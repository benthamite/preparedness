#!/usr/bin/env node
// Build data/cities.json: every world city of 50,000 people or more, with its
// local hazard levels and the mean temperature of its coldest and warmest
// month. The page ships this file; nothing is looked up at run time.
//
// Sources (all downloaded into cache/cities/, which is not committed):
//
// - Cities: GeoNames cities15000, admin1CodesASCII and countryInfo
//   (https://www.geonames.org, CC BY 4.0).
// - Hazards: ThinkHazard! (GFDRR / World Bank, https://thinkhazard.org).
//   "Classified hazard levels are licenced under CC-BY." The levels are rated
//   per district (GAUL level 2, numeric codes). Two of its public endpoints
//   are used:
//     /en/admindiv_hazardsets/{HZ}.json  every district's level for one hazard
//                                       (6 requests in all);
//     /en/report/{code}/neighbours.geojson?bbox=...  the districts whose
//                                       full boundary intersects a box: with
//                                       a box of about a metre round the
//                                       city's point, the district the city
//                                       is in (one request per city, unless
//                                       an outline already seen settles it;
//                                       see knownDistrict).
//   Boundaries are only queried on ThinkHazard's server; none are published.
//   ThinkHazard leaves some districts unrated for a hazard: districts too
//   small for the hazard's raster (Tokyo's inner wards have no earthquake
//   rating) and districts outside a regional hazard's reach (coastal flood
//   inland, cyclones outside the cyclone basins). When the city's district
//   lacks a rating for river flood, earthquake, wildfire or extreme heat,
//   which ThinkHazard rates on all land, a second query lists the districts
//   within 11 km, and each rating the district lacks is borrowed from the
//   nearest district that has it (BORROW_KM). A city whose point lies in no
//   district (just offshore) is placed in the nearest one within NEAREST_KM.
//   The check output counts both.
// - Climate: CHELSA V2.1 monthly climatologies of mean near-surface air
//   temperature, 1981-2010, 30 arc-seconds (https://chelsa-climate.org,
//   CC0 1.0). tools/sample-chelsa.py samples the 12 monthly rasters at the
//   cell holding each city's point (about 1 km across; the rasters cover the
//   sea too). The coldest and warmest of the 12 monthly means are kept.
//
// Every response is cached, so a rerun resumes rather than refetches.
// Requests to any one host are spaced at least 250 ms apart (4 a second).
//
// Usage:
//   node tools/build-cities.mjs                 all stages, then write and check
//   node tools/build-cities.mjs --stage NAME    one stage: geonames, levels,
//                                               points, chelsa, write
//   node tools/build-cities.mjs --stage verify [--sample N]
//                 re-query N cities placed from outlines already seen
//   --minutes N   stop starting new point queries after N minutes (for
//                 chunked runs; rerun to continue)

import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync, statSync, createWriteStream, unlinkSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateRawSync } from 'node:zlib';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { execFileSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cache = join(root, 'cache', 'cities');
const out = join(root, 'data', 'cities.json');

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const stage = opt('--stage') ?? 'all';
const minutes = opt('--minutes') ? Number(opt('--minutes')) : Infinity;
const deadline = Date.now() + minutes * 60_000;

const MIN_POPULATION = 50_000;
const HAZARDS = ['FL', 'CF', 'EQ', 'CY', 'WF', 'EH'];
const LEVEL_LETTER = { HIG: 'H', MED: 'M', LOW: 'L', VLO: 'V' };
// GeoNames feature codes for places that no longer exist as such.
const DEFUNCT = new Set(['PPLH', 'PPLQ', 'PPLW', 'PPLCH']);

const TH = 'https://thinkhazard.org/en';
const GEONAMES = 'https://download.geonames.org/export/dump';
const CHELSA = 'https://os.unil.cloud.switch.ch/chelsa02/chelsa/global/climatologies/tas/1981-2010';
const chelsaFile = (m) => `CHELSA_tas_${String(m).padStart(2, '0')}_1981-2010_V.2.1.tif`;

const ensureDir = (d) => { mkdirSync(d, { recursive: true }); return d; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(new Date().toISOString().slice(11, 19), ...a);

// ---------------------------------------------------------------- fetching

// At most one request start per host every 250 ms.
const nextSlot = new Map();
async function slot(host) {
  const now = Date.now();
  const at = Math.max(now, nextSlot.get(host) ?? 0);
  nextSlot.set(host, at + 250);
  if (at > now) await sleep(at - now);
}

class PermanentError extends Error {}

// GET a URL, retrying transient failures. ThinkHazard's front proxy now and
// then answers any path with a plain-text "404 page not found" (seen while
// probing it: the same URL succeeded a minute later); that answer is treated
// as transient. The application's own 404 is an HTML page and is permanent.
async function get(url, { tries = 6 } = {}) {
  const host = new URL(url).host;
  let wait = 2000;
  for (let attempt = 1; ; attempt++) {
    await slot(host);
    let res, err;
    try { res = await fetch(url, { signal: AbortSignal.timeout(120_000) }); } catch (e) { err = e; }
    if (res && res.ok) return res;
    let transient = !res || res.status >= 500 || res.status === 429;
    if (res && res.status === 404) {
      const body = await res.text();
      transient = body.trim() === '404 page not found';
      if (!transient) throw new PermanentError(`404 ${url}`);
    } else if (res) await res.body?.cancel();
    const why = err ? err.message : `HTTP ${res.status}`;
    if (!transient || attempt >= tries) throw new Error(`${why} ${url}`);
    log(`retry ${attempt} after ${why}: ${url}`);
    await sleep(wait);
    wait = Math.min(wait * 2, 60_000);
  }
}

// Download to a file unless it is already there. Writes a .part file first.
async function download(url, file) {
  if (existsSync(file)) return file;
  ensureDir(dirname(file));
  const res = await get(url);
  const part = `${file}.part`;
  await pipeline(Readable.fromWeb(res.body), createWriteStream(part));
  const expected = Number(res.headers.get('content-length'));
  if (expected && statSync(part).size !== expected) {
    unlinkSync(part);
    throw new Error(`short download (${statSync(part).size} of ${expected}): ${url}`);
  }
  renameSync(part, file);
  return file;
}

// Fetch a JSON or text response once and keep it in the cache.
async function cachedText(url, file) {
  if (existsSync(file)) return readFileSync(file, 'utf8');
  ensureDir(dirname(file));
  const text = await (await get(url)).text();
  writeFileSync(`${file}.part`, text);
  renameSync(`${file}.part`, file);
  return text;
}

// ---------------------------------------------------------------- GeoNames

// Read one entry from a zip archive (no zip64; GeoNames' city files are small).
function readZipEntry(buf, name) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65_557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('not a zip file');
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  for (let k = 0; k < count; k++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error('bad zip central directory');
    const method = buf.readUInt16LE(p + 10);
    const size = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const entry = buf.toString('utf8', p + 46, p + 46 + nameLen);
    if (entry === name) {
      if (buf.readUInt32LE(local) !== 0x04034b50) throw new Error('bad zip local header');
      const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
      const data = buf.subarray(start, start + size);
      if (method === 0) return data;
      if (method === 8) return inflateRawSync(data);
      throw new Error(`zip method ${method} not supported`);
    }
    p += 46 + nameLen + extraLen + commentLen;
  }
  throw new Error(`${name} not in zip`);
}

async function geonames() {
  const dir = ensureDir(join(cache, 'geonames'));
  const zip = await download(`${GEONAMES}/cities15000.zip`, join(dir, 'cities15000.zip'));
  await download(`${GEONAMES}/admin1CodesASCII.txt`, join(dir, 'admin1CodesASCII.txt'));
  await download(`${GEONAMES}/countryInfo.txt`, join(dir, 'countryInfo.txt'));

  const admin1 = new Map();
  for (const line of readFileSync(join(dir, 'admin1CodesASCII.txt'), 'utf8').split('\n')) {
    const [code, name] = line.split('\t');
    if (code && name) admin1.set(code, name);
  }
  const countries = new Map();
  for (const line of readFileSync(join(dir, 'countryInfo.txt'), 'utf8').split('\n')) {
    if (!line || line.startsWith('#')) continue;
    const c = line.split('\t');
    countries.set(c[0], [c[4], c[8]]);
  }
  const text = readZipEntry(readFileSync(zip), 'cities15000.txt').toString('utf8');
  const cities = [];
  let defunct = 0;
  for (const line of text.split('\n')) {
    if (!line) continue;
    const c = line.split('\t');
    const population = Number(c[14]);
    if (!(population >= MIN_POPULATION)) continue;
    if (DEFUNCT.has(c[7])) { defunct++; continue; }
    cities.push({
      id: Number(c[0]), name: c[1], featureCode: c[7], cc: c[8],
      admin1: admin1.get(`${c[8]}.${c[10]}`) ?? '',
      population, lat: Number(c[4]), lon: Number(c[5]),
    });
  }
  cities.sort((a, b) => b.population - a.population || a.id - b.id);
  const missingCountry = [...new Set(cities.map((c) => c.cc))].filter((cc) => !countries.has(cc));
  if (missingCountry.length) throw new Error(`countries missing from countryInfo: ${missingCountry}`);
  log(`GeoNames: ${cities.length} places of ${MIN_POPULATION}+ (${defunct} defunct places left out)`);
  return { cities, countries };
}

// ---------------------------------------------------------------- ThinkHazard levels

async function levels() {
  const dir = ensureDir(join(cache, 'thinkhazard'));
  const byHazard = {};
  for (const hz of HAZARDS) {
    const rows = JSON.parse(await cachedText(`${TH}/admindiv_hazardsets/${hz}.json`, join(dir, `levels-${hz}.json`)));
    byHazard[hz] = new Map();
    for (const r of rows) {
      const letter = LEVEL_LETTER[r.hazard_level];
      if (!letter) throw new Error(`unknown ThinkHazard level ${r.hazard_level} (${hz}, ${r.code})`);
      byHazard[hz].set(r.code, letter);
    }
    log(`ThinkHazard ${hz}: ${rows.length} districts rated`);
  }
  return byHazard;
}

// ---------------------------------------------------------------- ThinkHazard points

// Two queries per city at most. The point box (about a metre across) finds
// the district the city is in, using the district's full boundary. The wide
// box (WIDE_KM each way) lists the districts round the city, with simplified
// outlines; it is fetched only when the point box finds no district or finds
// one that lacks a rating for any of the hazards ThinkHazard rates on all
// land (see needsNeighbours).
const POINT_HALF_DEG = 0.00001;
const WIDE_KM = 11;
const pointFile = (c, kind) => join(cache, 'thinkhazard', 'points',
  `${c.lat.toFixed(5)}_${c.lon.toFixed(5)}${kind === 'wide' ? '_wide' : ''}.json`);

async function pointQuery(c, kind, refCode) {
  const hy = kind === 'wide' ? WIDE_KM / 111.32 : POINT_HALF_DEG;
  const hx = kind === 'wide' ? hy / Math.cos(c.lat * Math.PI / 180) : POINT_HALF_DEG;
  const bbox = [c.lon - hx, c.lat - hy, c.lon + hx, c.lat + hy].map((v) => v.toFixed(6)).join(',');
  const text = await cachedText(`${TH}/report/${refCode}/neighbours.geojson?bbox=${bbox}`, pointFile(c, kind));
  const features = JSON.parse(text).features ?? [];
  remember(features);
  return features;
}

// Web Mercator, the projection ThinkHazard returns its geometries in.
const R = 6378137;
const merc = (lon, lat) => [R * lon * Math.PI / 180, R * Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360))];
const mercLat = (y) => (2 * Math.atan(Math.exp(y / R)) - Math.PI / 2) * 180 / Math.PI;

// Every district outline seen in a response, to save a point query when a
// city lies well inside one already seen. ThinkHazard simplifies each outline
// with a tolerance of 1/250 of its bounding-box diagonal (simplify.sql in its
// repository), so a point farther than twice that (plus 250 m) from the
// simplified outline, and inside no other seen outline, is inside the real
// district. Cities placed this way are counted as "known" in the check output,
// and `--stage verify` re-queries a sample of them.
const districts = new Map();
function remember(features) {
  for (const f of features) {
    const code = f.properties?.code;
    if (code == null || !f.geometry || districts.has(code)) continue;
    let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity];
    for (const ring of rings(f.geometry)) for (const [x, y] of ring) {
      x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
    }
    const scale = Math.cos(mercLat((y0 + y1) / 2) * Math.PI / 180);
    const tol = Math.hypot(x1 - x0, y1 - y0) * scale / 250; // ground metres
    districts.set(code, { code, geometry: f.geometry, box: [x0, y0, x1, y1], tol });
  }
}
function rememberCached() {
  const dir = ensureDir(join(cache, 'thinkhazard', 'points'));
  for (const f of readdirSync(dir)) {
    if (f.endsWith('.json')) remember(JSON.parse(readFileSync(join(dir, f), 'utf8')).features ?? []);
  }
}
function knownDistrict(c) {
  const p = merc(c.lon, c.lat);
  const holders = [];
  for (const d of districts.values()) {
    const [x0, y0, x1, y1] = d.box;
    if (p[0] >= x0 && p[0] <= x1 && p[1] >= y0 && p[1] <= y1 && inside(d.geometry, p)) holders.push(d);
  }
  if (holders.length !== 1) return null;
  const [d] = holders;
  const metres = distance(d.geometry, p) * Math.cos(c.lat * Math.PI / 180);
  return metres > 2 * d.tol + 250 ? d.code : null;
}

function rings(geometry) {
  if (!geometry) return [];
  if (geometry.type === 'Polygon') return geometry.coordinates;
  if (geometry.type === 'MultiPolygon') return geometry.coordinates.flat();
  return [];
}
function inside(geometry, [x, y]) {
  let n = 0;
  for (const ring of rings(geometry)) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i], [xj, yj] = ring[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) n++;
    }
  }
  return n % 2 === 1;
}
// Distance in Mercator metres from a point to a geometry's boundary.
function distance(geometry, [x, y]) {
  let best = Infinity;
  for (const ring of rings(geometry)) {
    for (let i = 1; i < ring.length; i++) {
      const [ax, ay] = ring[i - 1], [bx, by] = ring[i];
      const dx = bx - ax, dy = by - ay;
      const t = dx || dy ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy))) : 0;
      best = Math.min(best, Math.hypot(x - ax - t * dx, y - ay - t * dy));
    }
  }
  return best;
}

// Hazards ThinkHazard rates on all land. A district that lacks a rating for
// one of them was too small for that hazard's raster (inner-city wards such
// as Shinjuku or Manhattan) or fell in a gap of the data.
const ALL_LAND = ['FL', 'EQ', 'WF', 'EH'];
// A rating the city's district lacks is borrowed from the nearest district
// that has one, if that district's outline is within this many km of the
// city's point. Coastal flood is borrowed only from very close, so that an
// inland city does not take the rating of the coast. Set a value to 0 to
// switch borrowing off for that hazard.
const BORROW_KM = { FL: 10, CF: 3, EQ: 10, CY: 10, WF: 10, EH: 10 };
// A city whose point is in no district (just offshore, or across a shore) is
// placed in the nearest district within this distance.
const NEAREST_KM = 6;

const needsNeighbours = (code, byHazard) => code == null || ALL_LAND.some((h) => !byHazard[h].has(code));

// Where a city is, from the point query and, when needed, the wide query:
// {code, how, km, near}. `near` lists the districts round the city, nearest
// first, with the distance in km from the city's point to each outline.
// Returns null (or {incomplete: true}) when a needed response is not cached
// and fetchMissing is false.
async function locate(c, refCode, byHazard, { fetchMissing }) {
  const p = merc(c.lon, c.lat);
  let code = null, how = 'none', km = null, here = [];
  const known = existsSync(pointFile(c, 'point')) ? null : knownDistrict(c);
  if (known != null) {
    code = known; how = 'known'; km = 0;
  } else if (!fetchMissing && !existsSync(pointFile(c, 'point'))) {
    return null;
  } else {
    here = await pointQuery(c, 'point', refCode);
  }
  if (here.length === 1) {
    ({ code } = here[0].properties); how = 'inside'; km = 0;
  } else if (here.length > 1) {
    // On a boundary: the district whose (simplified) outline holds the point.
    const hit = here.find((f) => inside(f.geometry, p));
    ({ code } = (hit ?? here[0]).properties); how = 'boundary'; km = 0;
  }
  let near = null;
  if (needsNeighbours(code, byHazard)) {
    if (!fetchMissing && !existsSync(pointFile(c, 'wide'))) return { code, how, km, near, incomplete: true };
    const scale = Math.cos(c.lat * Math.PI / 180); // Mercator metres to ground metres
    near = (await pointQuery(c, 'wide', refCode))
      .map((f) => ({ code: f.properties.code, km: inside(f.geometry, p) ? 0 : distance(f.geometry, p) * scale / 1000 }))
      .filter((n) => Number.isFinite(n.km))
      .sort((a, b) => a.km - b.km);
    if (code == null && near.length && near[0].km <= NEAREST_KM) {
      ({ code, km } = near[0]); how = 'nearest';
    }
  }
  return { code, how, km, near };
}

// The six levels for a located city; `borrowed` counts borrowings by hazard.
function hazardLevels(loc, byHazard, borrowed) {
  return HAZARDS.map((h) => {
    if (loc?.code != null && byHazard[h].has(loc.code)) return byHazard[h].get(loc.code);
    const lender = loc?.near?.find((n) => n.km <= BORROW_KM[h] && byHazard[h].has(n.code));
    if (!lender) return 'N';
    borrowed[h] = (borrowed[h] ?? 0) + 1;
    // A level borrowed from a neighbouring district is written in lower
    // case, so the page can say so.
    return byHazard[h].get(lender.code).toLowerCase();
  }).join('');
}

// ThinkHazard's server slows sharply under four parallel requests (latency
// rose from about 1 s to 9 s in a trial), so three run at a time.
const WORKERS = 3;
const refCodeOf = (byHazard) => byHazard.EQ.keys().next().value; // any district: sets the level queried

async function points(cities, byHazard) {
  const refCode = refCodeOf(byHazard);
  const todo = cities.slice(); // cached cities pass through without a request
  let done = 0, failed = 0;
  const workers = Array.from({ length: WORKERS }, async () => {
    while (todo.length) {
      if (Date.now() > deadline) return;
      const c = todo.shift();
      try {
        await locate(c, refCode, byHazard, { fetchMissing: true });
      } catch (e) {
        failed++;
        log(`failed ${c.name} (${c.cc}): ${e.message}`);
      }
      if (++done % 500 === 0) log(`points: ${done} cities checked`);
    }
  });
  await Promise.all(workers);
  let left = 0;
  for (const c of cities) {
    const loc = await locate(c, refCode, byHazard, { fetchMissing: false });
    if (!loc || loc.incomplete) left++;
  }
  log(`points: ${failed} failed this run, ${left} cities still to query`);
  return left;
}

// Re-query a sample of the cities placed from outlines already seen, and say
// whether the exact query agrees. The answers are cached like any other, so
// the sampled cities become exact.
async function verifyKnown(cities, byHazard, n) {
  const refCode = refCodeOf(byHazard);
  const known = [];
  for (const c of cities) {
    if (!existsSync(pointFile(c, 'point')) && knownDistrict(c) != null) known.push(c);
  }
  const step = Math.max(1, Math.floor(known.length / n));
  let agree = 0, checked = 0;
  for (let i = 0; i < known.length && checked < n; i += step) {
    const c = known[i];
    const guess = knownDistrict(c);
    const here = await pointQuery(c, 'point', refCode);
    const codes = here.map((f) => f.properties.code);
    checked++;
    if (codes.includes(guess)) agree++;
    else log(`disagree: ${c.name} (${c.cc}) known ${guess}, query ${codes.join('/') || 'none'}`);
  }
  log(`verify: ${agree} of ${checked} known placements agree with the exact query (${known.length} known in all)`);
}

// ---------------------------------------------------------------- CHELSA

async function chelsa(cities) {
  const dir = ensureDir(join(cache, 'chelsa'));
  for (let m = 1; m <= 12; m++) {
    const file = join(dir, chelsaFile(m));
    if (!existsSync(file)) log(`downloading ${chelsaFile(m)}`);
    await download(`${CHELSA}/${chelsaFile(m)}`, file);
  }
  const pointsFile = join(dir, 'points.json');
  const samplesFile = join(dir, 'samples.json');
  const pts = JSON.stringify(cities.map((c) => [c.id, c.lat, c.lon]));
  const stale = !existsSync(samplesFile) || !existsSync(pointsFile) || readFileSync(pointsFile, 'utf8') !== pts;
  if (stale) {
    writeFileSync(pointsFile, pts);
    log('sampling CHELSA');
    execFileSync('python3', ['-I', join(root, 'tools', 'sample-chelsa.py'), dir, pointsFile, samplesFile], { stdio: 'inherit' });
  }
  return JSON.parse(readFileSync(samplesFile, 'utf8'));
}

// ---------------------------------------------------------------- assemble

const ATTRIBUTION = [
  'Cities: GeoNames (https://www.geonames.org), licensed under CC BY 4.0.',
  'Hazard levels: ThinkHazard! by the Global Facility for Disaster Reduction and Recovery (GFDRR) and the World Bank (https://thinkhazard.org);',
  'classified hazard levels licensed under CC BY. Each city takes the level of the district (FAO GAUL level 2) it lies in;',
  'where ThinkHazard did not rate that district for river flood, earthquake, wildfire or extreme heat (mostly small inner-city districts),',
  'each level it lacks is taken from the nearest rated district within 10 km (3 km for coastal flood).',
  'Temperatures: CHELSA V2.1 climatologies, mean monthly air temperature 1981-2010',
  '(Karger et al. 2017, Scientific Data 4:170122; Karger et al. 2021, EnviDat, doi:10.16904/envidat.228.v2.1; https://chelsa-climate.org), CC0 1.0.',
].join(' ');

async function write(cities, countries, byHazard, samples, borrowed) {
  const usedCountries = {};
  const rows = [];
  for (const c of cities) {
    const loc = await locate(c, null, byHazard, { fetchMissing: false });
    c._located = loc;
    const hz = hazardLevels(loc, byHazard, borrowed);
    const s = samples[c.id];
    const t = s?.months ? [Math.round(Math.min(...s.months)), Math.round(Math.max(...s.months))] : [null, null];
    rows.push([c.name, c.admin1, c.cc, c.population, Math.round(c.lat * 100) / 100, Math.round(c.lon * 100) / 100, hz, ...t.map((v) => (Object.is(v, -0) ? 0 : v))]);
    usedCountries[c.cc] = countries.get(c.cc);
  }
  const sorted = Object.fromEntries(Object.entries(usedCountries).sort(([a], [b]) => a.localeCompare(b)));
  const json = {
    attribution: ATTRIBUTION,
    hazardOrder: HAZARDS,
    levels: 'H high, M medium, L low, V very low, N not rated or unknown; lower case: borrowed from the nearest rated district within BORROW_KM',
    countries: sorted,
    cities: rows,
  };
  writeFileSync(out, JSON.stringify(json));
  log(`wrote ${out}: ${rows.length} cities, ${(statSync(out).size / 1e6).toFixed(2)} MB`);
  return rows;
}

// ---------------------------------------------------------------- check

const CHECK = [
  ['Buenos Aires', 'AR'], ['Paris', 'FR'], ['London', 'GB'], ['Berlin', 'DE'], ['Madrid', 'ES'],
  ['Rome', 'IT'], ['New York City', 'US'], ['Los Angeles', 'US'], ['Miami', 'US'], ['San Francisco', 'US'],
  ['Houston', 'US'], ['Chicago', 'US'], ['Tokyo', 'JP'], ['Mumbai', 'IN'], ['Manila', 'PH'],
  ['Lagos', 'NG'], ['Mexico City', 'MX'], ['Santiago', 'CL'],
];

function check(cities, rows, byHazard, samples, borrowed) {
  const names = (list, n = 12) => list.slice(0, n).map((c) => `${c.name} (${c.cc})`).join('; ');
  console.log(`\ncities: ${rows.length}`);
  console.log('hazard levels (count of cities):');
  HAZARDS.forEach((h, i) => {
    const n = {};
    for (const r of rows) n[r[6][i]] = (n[r[6][i]] ?? 0) + 1;
    console.log(`  ${h}: ${['H', 'M', 'L', 'V', 'N'].map((l) => `${l} ${n[l] ?? 0}`).join(', ')}  (borrowed from a nearby district: ${borrowed[h] ?? 0})`);
  });
  const how = {};
  for (const c of cities) {
    const k = !c._located ? 'not queried' : c._located.incomplete ? 'incomplete' : c._located.how;
    how[k] = (how[k] ?? 0) + 1;
  }
  console.log('district match:', how);
  const far = cities.filter((c) => c._located?.how === 'nearest').sort((a, b) => b._located.km - a._located.km);
  if (far.length) console.log('  farthest nearest-district matches:', far.slice(0, 8).map((c) => `${c.name} (${c.cc}) ${c._located.km.toFixed(1)} km`).join('; '));
  const none = cities.filter((c) => c._located?.how === 'none');
  console.log(`  no district within ${NEAREST_KM} km: ${none.length}`, names(none, 20));
  const allN = cities.filter((c, i) => rows[i][6] === 'NNNNNN');
  console.log(`  all six levels N: ${allN.length}`, names(allN, 20));
  ALL_LAND.forEach((h) => {
    const i = HAZARDS.indexOf(h);
    const miss = cities.filter((c, k) => rows[k][6][i] === 'N');
    console.log(`  ${h} still N: ${miss.length}`, names(miss));
  });
  const noTemp = cities.filter((c) => !samples[c.id]?.months);
  const shifted = cities.filter((c) => samples[c.id]?.months && samples[c.id].cells > 0);
  console.log(`climate: ${noTemp.length} without a value`, noTemp.slice(0, 15).map((c) => `${c.name} (${c.cc})`).join('; '));
  console.log(`  ${shifted.length} took a nearby cell (no data in the city's own cell)`);
  console.log('\ncheck rows:');
  for (const [name, cc] of CHECK) {
    const r = rows.find((x) => x[0] === name && x[2] === cc);
    console.log(' ', r ? JSON.stringify(r) : `${name} (${cc}) not found`);
  }
}

// ---------------------------------------------------------------- main

const { cities, countries } = await geonames();
if (stage === 'geonames') process.exit(0);
const byHazard = await levels();
if (stage === 'levels') process.exit(0);
rememberCached();
if (stage === 'verify') {
  await verifyKnown(cities, byHazard, Number(opt('--sample') ?? 60));
  process.exit(0);
}
if (stage === 'all' || stage === 'points') {
  const left = await points(cities, byHazard);
  if (stage === 'points') process.exit(0);
  if (left) { log('stopping: point queries unfinished (deadline); rerun to continue'); process.exit(2); }
}
const samples = await chelsa(cities);
if (stage === 'chelsa') process.exit(0);
const borrowed = {};
const rows = await write(cities, countries, byHazard, samples, borrowed);
check(cities, rows, byHazard, samples, borrowed);
