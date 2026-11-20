#!/usr/bin/env node
// Assemble data/model.json from the research files in research/step3/ and the
// modelling choices in data/config.mjs.
//
// The research files say what the evidence supports. The config says how the
// model uses it: which entries are in, how each acts in the engine, and every
// place where a researcher's number was adjusted, with the reason.
//
// Usage: node tools/build-data.mjs [--check]   (--check reports without writing)

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import config from '../data/config.mjs';
import { COUNTRIES, COUNTRY_FIELDS, presetFor } from '../data/countries.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'research', 'step3');
const problems = [];
const warn = (msg) => problems.push(msg);

const files = Object.fromEntries(readdirSync(dir).filter((f) => f.endsWith('.json')).sort()
  .map((f) => [basename(f, '.json'), JSON.parse(readFileSync(join(dir, f), 'utf8'))]));

// A research quantity as an engine triple. `max` caps shares and probabilities.
function T(q, { max, scale = 1 } = {}) {
  if (q === undefined || q === null) return undefined;
  if (typeof q === 'number') return q * scale;
  const t = { lo: q.lo * scale, mid: q.mid * scale, hi: q.hi * scale, tag: q.tag, basis: q.basis };
  if (max !== undefined) { t.max = max; t.lo = Math.min(t.lo, max); t.mid = Math.min(t.mid, max); t.hi = Math.min(t.hi, max); }
  return t;
}
const mults = (list) => {
  if (!list || !list.length) return undefined;
  const out = {};
  for (const m of list) {
    out[m.profile] = {};
    if (m.hardship !== undefined) out[m.profile].hardship = m.hardship;
    if (m.mortality !== undefined) out[m.profile].mortality = m.mortality;
  }
  return out;
};
const curve = (c, scale = 1) => ({
  tag: c.tag, basis: c.basis,
  steps: c.steps.map((s) => ({ fromDay: s.fromDay, lo: s.lo * scale, mid: s.mid * scale, hi: s.hi * scale })),
});

// ---- index the research ----
const R = { needs: {}, channels: {}, items: {}, hazards: [], params: {}, sideRisks: [] };
for (const [name, d] of Object.entries(files)) {
  if (d.kind === 'items') {
    for (const n of d.needs || []) { if (R.needs[n.id]) warn(`need ${n.id} defined twice (${name})`); R.needs[n.id] = { ...n, file: name }; }
    for (const c of d.channels || []) R.channels[c.id] = { ...c, file: name };
    for (const it of d.items) { if (R.items[it.id]) warn(`item ${it.id} defined twice (${name})`); R.items[it.id] = { ...it, file: name }; }
    for (const s of d.sideRisks || []) R.sideRisks.push({ ...s, file: name });
  } else if (d.kind === 'hazards') {
    for (const h of d.hazards) R.hazards.push({ ...h, file: name });
  } else if (d.kind === 'parameters') {
    for (const p of d.parameters) R.params[p.id] = p;
  }
}

// ---- the AI research ----
const aiDir = join(root, 'research', 'ai');
const AI = { rates: {}, timelines: [], params: {} };
if (existsSync(aiDir)) {
  for (const f of readdirSync(aiDir).filter((x) => x.endsWith('.json')).sort()) {
    const d = JSON.parse(readFileSync(join(aiDir, f), 'utf8'));
    if (d.kind !== 'ai') continue;
    for (const r0 of d.hazardRates || []) {
      const r = { ...r0, file: basename(f, '.json') };
      // Where a file gives bounds on the rate with AI removed, not views of
      // it, the middle figure serves at every level of concern.
      if (((config.ai || {}).baselineIsPoint || []).includes(r.file)) r.baseline = { ...r.baseline, lo: r.baseline.mid, hi: r.baseline.mid };
      for (const c of (config.ai || {}).corrections || []) {
        if (c.hazard === r.hazard && c.location === r.location) r[c.field] = { ...r[c.field], mid: c.mid };
      }
      (AI.rates[r.hazard] ||= {})[r.location] = r;
    }
    for (const t of d.timelines || []) AI.timelines.push(t);
    for (const x of d.parameters || []) AI.params[x.id] = x;
  }
}
const tri = (q) => [q.lo, q.mid, q.hi];

// ---- parameters ----
const parameters = {};
for (const [id, spec] of Object.entries(config.parameters)) {
  if (spec.value !== undefined) { parameters[id] = spec.value; continue; }
  const get = (rid) => {
    const p = R.params[rid];
    if (!p) { warn(`parameter ${rid} not found in research`); return undefined; }
    return T(p.value, { max: spec.max });
  };
  if (spec.by) {
    parameters[id] = {};
    for (const key of spec.by) parameters[id][key] = spec.fixed && spec.fixed[key] !== undefined ? spec.fixed[key] : get(`${spec.from || id}.${key}`);
  } else parameters[id] = get(spec.from || id);
}

// ---- needs ----
const needs = {};
for (const [id, spec] of Object.entries(config.needs)) {
  const r = R.needs[spec.from || id];
  const { from, adjust, ...engine } = spec;
  if (!r && !spec.hardship) { warn(`need ${id} has no research`); continue; }
  const a = adjust || {};
  needs[id] = {
    label: spec.label,
    ...(r ? {
      baselineDays: T(r.baselineCoverageDays),
      hardship: curve(r.hardshipUsdPerPersonDay, a.hardshipScale),
      mortality: curve(r.mortalityMicromortsPerPersonDay, a.mortalityScale),
      multipliers: { ...(mults(r.multipliers) || {}), ...(a.multipliers || {}) },
    } : {}),
    ...engine,
  };
}

// ---- channels ----
const channels = {};
for (const [id, spec] of Object.entries(config.channels)) {
  const r = R.channels[id];
  channels[id] = { multipliers: spec && spec.multipliers ? spec.multipliers : (r ? mults(r.multipliers) : undefined) };
}

// ---- hazards ----
function profileOf(h) {
  const windows = {};
  for (const [k, w] of Object.entries(h.windows || {})) {
    windows[k] = { pOccur: T(w.pOccur, { max: 1 }), days: w.days, tag: w.tag, basis: w.basis };
    if (w.shareTreatable) windows[k].shareTreatable = T(w.shareTreatable, { max: 1 });
  }
  // The heat-wave researcher gives the length of the heat itself beside the
  // canonical windows.
  const heat = h.heat || (h.extraWindows && h.extraWindows.heat);
  if (heat) windows.heat = { pOccur: T(heat.pOccur, { max: 1 }), days: heat.days, tag: heat.tag, basis: heat.basis };
  return {
    windows,
    coldShare: T(h.coldShare, { max: 1 }),
    hotShare: T(h.hotShare, { max: 1 }),
    leave: {
      feasible: T(h.leave.feasible, { max: 1 }),
      earliestDay: T(h.leave.earliestDay),
      fixedUsdPerHousehold: T(h.leave.fixedUsdPerHousehold),
      usdPerPersonDay: T(h.leave.usdPerPersonDay),
    },
    warningDays: h.warningDays.mid,
    lateBuy: { staple: T(h.lateBuy.staple, { max: 1 }), specialty: T(h.lateBuy.specialty, { max: 1 }) },
    exposures: (h.exposures || []).map((x) => ({
      channel: x.channel,
      micromortsPerPerson: T(x.micromortsPerPerson),
      // Some exposures are given separately for each place.
      micromortsPerPersonByLocation: x.micromortsPerPersonByLocation
        ? Object.fromEntries(Object.entries(x.micromortsPerPersonByLocation).filter(([, q]) => q && typeof q === 'object').map(([l, q]) => [l, T(q)]))
        : undefined,
      hardshipUsdPerPerson: T(x.hardshipUsdPerPerson),
      financialUsdPerHousehold: T(x.financialUsdPerHousehold),
      multipliers: mults(x.multipliers),
    })),
  };
}
const hazards = {};
for (const [id, spec] of Object.entries(config.hazards)) {
  const entries = R.hazards.filter((h) => h.id === id);
  if (!entries.length && !spec.profile) { warn(`hazard ${id} has no research`); continue; }
  const primary = entries.find((h) => h.file === spec.from) || entries[0];
  const probability = {};
  for (const h of entries) {
    for (const a of h.annualProbability) {
      const t = T(a, { max: 1 });
      if (a.outlook === 'all') {
        if (probability[a.location] && typeof probability[a.location].mid !== 'number') probability[a.location].all = t;
        else probability[a.location] = t;
      } else {
        if (!probability[a.location] || typeof probability[a.location].mid === 'number') {
          probability[a.location] = probability[a.location] ? { all: probability[a.location] } : {};
        }
        probability[a.location][a.outlook] = t;
      }
    }
  }
  const byLocation = {};
  for (const h of entries) {
    if (h === primary) continue;
    const locs = [...new Set(h.annualProbability.map((a) => a.location))].filter((l) => l !== 'all' && l !== 'us');
    for (const l of locs) {
      byLocation[l] = profileOf(h);
      // Where the location researcher gave no exposures of their own, the
      // base profile's stand (carbon monoxide and fire in outages).
      if (!(h.exposures || []).length) delete byLocation[l].exposures;
    }
  }
  // A hazard that exists only because of the AI research takes its
  // probability from that research's figure for today.
  if (spec.aiBase) {
    for (const [l, r] of Object.entries(AI.rates[id] || {})) {
      probability[l] = { lo: r.now.lo, mid: r.now.mid, hi: r.now.hi, max: 1, tag: r.now.tag, basis: r.now.basis };
    }
    if (!AI.rates[id]) warn(`hazard ${id}: no AI research`);
  }
  const { from, label, patch, patchByLocation, aiBase, ...rest } = spec;
  delete rest.profile;
  const profile = typeof spec.profile === 'function' ? spec.profile(R, T) : spec.profile;
  hazards[id] = {
    label,
    definition: primary ? primary.definition : spec.definition,
    tickBox: spec.tickBox !== undefined ? spec.tickBox : (primary ? primary.tickBox || null : null),
    probability: { ...probability, ...(spec.probability || {}) },
    ...(primary ? profileOf(primary) : {}),
    ...(profile || {}),
    probability: { ...probability, ...(spec.probability || {}), ...((profile && profile.probability) || {}) },
    durationScale: { lo: 0.6, mid: 1, hi: 1.7, tag: 'guess', basis: 'Uncertainty about how long disruptions of this kind last, applied to every window of the hazard.' },
    ...rest,
  };
  if (Object.keys(byLocation).length) hazards[id].byLocation = byLocation;
  if (patch) patch(hazards[id]);
  for (const [l, fn] of Object.entries(patchByLocation || {})) {
    hazards[id].byLocation ||= {};
    hazards[id].byLocation[l] ||= {};
    fn(hazards[id].byLocation[l], hazards[id]);
  }
}

// ---- items ----
const items = [];
for (const spec of config.items) {
  const r = spec.from ? R.items[spec.from] : null;
  if (spec.from && !r) { warn(`item ${spec.id}: research item ${spec.from} not found`); continue; }
  const src = r || {};
  let effects = spec.effects;
  if (!effects) {
    // Mechanical translation of the researcher's effects.
    effects = [];
    for (const e of src.effects || []) {
      if (e.type === 'supply') {
        const unit = (config.units[e.need] || {})[e.amountUnit];
        if (unit === undefined) { warn(`item ${spec.id}: no conversion for supply of ${e.need} in "${e.amountUnit}"`); continue; }
        effects.push({ type: 'supply', need: e.need, amount: e.amountPerUnit * unit });
      } else if (e.type === 'capability') effects.push({ type: 'capability', capability: e.capability });
      else if (e.type === 'reduce') effects.push({ type: 'reduce', target: e.target, hazards: e.hazards, fraction: T(e.fractionRemoved, { max: 1 }), adherence: T(e.adherence, { max: 1 }) });
      else if (e.type === 'sideRisk') warn(`item ${spec.id}: side risk on ${e.channel} needs an explicit effect in the config`);
    }
  } else if (typeof effects === 'function') effects = effects(src, T);
  // Side risks of combustion come from the fire researcher's table.
  effects = effects.map((e) => {
    if (e.type !== 'sideRisk' || typeof e.micromortsPerDay !== 'string') return e;
    const key = e.micromortsPerDay.replace('SIDE:', '');
    const row = R.sideRisks.find((x) => x.channel === e.channel && config.sideRisks[key].test(x.activity));
    if (!row) { warn(`item ${spec.id}: no side-risk row for ${key}`); return null; }
    return { ...e, micromortsPerDay: T(row.micromortsPerDayOfUse) };
  }).filter(Boolean);
  // Fields given as functions draw on other research items.
  for (const [k, v] of Object.entries(spec)) if (k !== 'effects' && typeof v === 'function') spec[k] = v(R.items, T);
  const price = spec.price !== undefined ? spec.price : T(src.price && src.price.usdPerUnit);
  if (price === undefined) { warn(`item ${spec.id}: no price`); continue; }
  const pickQ = (key, opts) => (spec[key] !== undefined ? spec[key] : T(src[key], opts));
  const sources = [...new Set([
    ...(src.price && src.price.verified && src.price.source ? [src.price.source] : []),
    ...(src.evidence || []).filter((e) => /^https?:\/\//.test(e.source)).sort((a, b) => Number(b.verified) - Number(a.verified)).map((e) => e.source),
  ])];
  items.push({
    id: spec.id,
    name: spec.name || src.name,
    group: spec.group || src.file,
    spec: spec.spec || src.spec,
    units: spec.units || src.unit,
    note: spec.note,
    confidence: spec.confidence || src.confidence || 'guess',
    scalesWith: spec.scalesWith || src.scalesWith || 'household',
    scalesWho: spec.scalesWho,
    // Offered once per member, acting on that member alone.
    perPerson: spec.perPerson,
    perPersonWho: spec.perPersonWho,
    ladder: spec.ladder !== undefined ? spec.ladder : src.ladder,
    price,
    fixedPrice: spec.fixedPrice,
    capitalFree: spec.capitalFree,
    lifeYears: pickQ('lifeYears'),
    setupHours: pickQ('setupHours'),
    upkeepHoursPerYear: pickQ('upkeepHoursPerYear'),
    upkeepUsdPerYear: pickQ('upkeepUsdPerYear'),
    upkeepUsdPerUnitYear: spec.upkeepUsdPerUnitYear,
    everydayShare: pickQ('everydayShare', { max: 1 }),
    volumeLitres: spec.volumeLitres !== undefined ? spec.volumeLitres : src.volumeLitresPerUnit,
    reliability: pickQ('reliability', { max: 1 }),
    lateBuyClass: spec.lateBuyClass || src.lateBuyClass || 'none',
    lateBuyLevel: spec.lateBuyLevel,
    lateUptake: spec.lateUptake,
    hoursPerPerson: spec.hoursPerPerson,
    everydayUpkeep: spec.everydayUpkeep,
    setupLifeYears: spec.setupLifeYears,
    noReview: spec.noReview,
    requires: spec.requires !== undefined ? spec.requires : (src.requires || []),
    conditions: spec.conditions !== undefined ? spec.conditions : (src.conditions || []),
    bundleWith: spec.bundleWith,
    effects,
    sources,
    provenance: spec.from ? `${src.file}:${spec.from}` : 'config',
  });
}
const used = new Set(config.items.map((s) => s.from).filter(Boolean));
const dropped = new Set(Object.keys(config.dropped || {}));
for (const id of Object.keys(R.items)) {
  if (!used.has(id) && !dropped.has(id)) warn(`research item ${id} (${R.items[id].file}) is neither used nor dropped`);
}

// ---- AI timelines and rates ----
let ai;
if (config.ai && Object.keys(AI.rates).length) {
  const param = (id) => { if (!AI.params[id]) { warn(`AI parameter ${id} not found`); return null; } return AI.params[id].value; };
  const tYears = param('transitionYears');
  const pX = param('pExistentialGivenAGI');
  ai = {
    startYear: config.ai.startYear, horizonYears: config.ai.horizonYears,
    transitionYears: tYears ? tYears.mid : 5,
    pExistential: pX ? tri(pX) : undefined,
    timelines: {}, hazards: {},
  };
  for (const [key, spec] of Object.entries(config.ai.timelines)) {
    const t = AI.timelines.find((x) => x.id === spec.from);
    if (!t) { warn(`AI timeline ${spec.from} not found`); continue; }
    ai.timelines[key] = { label: spec.label, source: t.source, cumulative: t.cumulative };
  }
  for (const [hz, byLoc] of Object.entries(AI.rates)) {
    if (!hazards[hz]) { if (!(config.ai.unused || {})[hz]) warn(`AI rates for ${hz} are neither used nor set aside`); continue; }
    ai.hazards[hz] = {};
    for (const [l, r] of Object.entries(byLoc)) {
      ai.hazards[hz][l] = { baseline: tri(r.baseline), now: tri(r.now), transition: tri(r.transition), after: tri(r.after), survivable: r.survivableShare ? r.survivableShare.mid : 1 };
    }
  }
}

// ---- the impartial valuation (research/impartial/) ----
const impFile = join(root, 'research', 'impartial', 'impartial.json');
const IMP = {};
if (existsSync(impFile)) for (const p of JSON.parse(readFileSync(impFile, 'utf8')).parameters) IMP[p.id] = p.value;
else warn('research/impartial/impartial.json missing: no lost work, life-years or impartial values');
const imp = (id) => { if (!IMP[id]) { if (existsSync(impFile)) warn(`impartial parameter ${id} not found`); return undefined; } return T(IMP[id]); };
// Work lost per unmet day of each need, and per event through a channel.
for (const [id, n] of Object.entries(needs)) {
  const w = (config.impartial.workLoss || {})[id] !== undefined ? config.impartial.workLoss[id] : imp(`workLoss.${id}`);
  if (w !== undefined) n.workLoss = { ...w, max: 1, lo: Math.min(1, w.lo), mid: Math.min(1, w.mid), hi: Math.min(1, w.hi) };
}
for (const [hz, channel] of Object.entries(config.impartial.workDays)) {
  const d = imp(`workDays.${hz}`);
  if (d !== undefined && hazards[hz]) hazards[hz].workDays = { channel, days: d };
}
const lifeExpectancy = {};
for (const band of ['child', 'adult', 'age60to74', 'age75plus', 'reference']) {
  const x = imp(`lifeExpectancy.${band}`);
  if (x !== undefined) lifeExpectancy[band] = x;
}
if (imp('costPerLifeSavedUsd')) parameters.costPerLifeSavedUsd = imp('costPerLifeSavedUsd');
if (imp('defaults.hoursPerYear')) parameters.hoursPerYear = imp('defaults.hoursPerYear');
parameters.counterfactualShare = config.impartial.counterfactualShare;

// ---- countries (research/countries/) ----
// Each listed country gets the figures of every family researched; the
// United States is the preset itself, and so is the city of Buenos Aires.
const countryDir = join(root, 'research', 'countries');
const countries = {};
for (const [family, fields] of Object.entries(COUNTRY_FIELDS)) {
  const f = join(countryDir, `${family}.json`);
  if (!existsSync(f)) { warn(`country research ${family} missing`); continue; }
  const d = JSON.parse(readFileSync(f, 'utf8'));
  for (const c of d.countries) {
    const listed = COUNTRIES.find((x) => x.iso2 === c.iso2);
    if (!listed) { warn(`country ${c.iso2} in ${family} is not listed`); continue; }
    if (config.places.presetCountries.includes(c.iso2)) continue;
    const e = (countries[c.iso2] ||= { name: listed.name, preset: listed.preset, families: [], values: {} });
    for (const field of fields) {
      const q = (config.places.adjust[c.iso2] || {})[field] || c.values[field];
      if (!q) { warn(`country ${c.iso2}: ${field} missing`); continue; }
      e.values[field] = T(q, /forecast|pessimistic|probability/.test(field) ? { max: 1 } : {});
    }
    e.families.push(family);
  }
}
// Every country the city list names, with its preset.
const cityFile = join(root, 'data', 'cities.json');
const places = { hazardOrder: [], rules: config.places.cityRules, countries: {} };
if (existsSync(cityFile)) {
  const C = JSON.parse(readFileSync(cityFile, 'utf8'));
  places.hazardOrder = C.hazardOrder;
  places.attribution = C.attribution;
  for (const [iso2, [name, continent]] of Object.entries(C.countries)) {
    const own = countries[iso2];
    places.countries[iso2] = {
      name, preset: presetFor(iso2, continent),
      ...(own ? { researched: true, families: own.families } : {}),
      ...(config.places.presetCities[iso2] ? { presetCities: config.places.presetCities[iso2] } : {}),
    };
  }
} else warn('data/cities.json missing: the page will have no city box');

const model = {
  version: config.version,
  currentYear: config.currentYear,
  ai,
  countries, places, lifeExpectancy,
  locations: config.locations,
  outlooks: config.outlooks,
  defaults: config.defaults,
  parameters, needs, channels, hazards, items,
};
// An effect that names hazards none of which exposes its target can never act.
for (const it of items) {
  for (const fx of it.effects) {
    if (fx.type !== 'reduce' || !(fx.target in channels)) continue;
    const scope = !fx.hazards || fx.hazards.includes('all') ? Object.keys(hazards) : fx.hazards;
    const sideRisk = items.some((x) => x.effects.some((e) => e.type === 'sideRisk' && e.channel === fx.target));
    const exposed = scope.some((h) => hazards[h] && [hazards[h], ...Object.values(hazards[h].byLocation || {})].some((p) => (p.exposures || []).some((x) => x.channel === fx.target)));
    if (!exposed && !sideRisk) warn(`item ${it.id}: reduces ${fx.target} in ${scope.slice(0, 4).join(', ')}, where nothing exposes it`);
  }
}
// The sceptic's AI effect should not exceed the concerned view's.
for (const [hz, byLoc] of Object.entries((ai || {}).hazards || {})) {
  for (const [l, r] of Object.entries(byLoc)) {
    if (r.transition[0] - r.now[0] > r.transition[2] - r.now[2] + 1e-12) warn(`AI rates for ${hz} in ${l}: the effect of AGI falls as concern rises`);
  }
}

// Drop undefined values and check every engine triple is well-formed.
const clean = JSON.parse(JSON.stringify(model));
(function check(node, path) {
  if (Array.isArray(node)) return node.forEach((x, i) => check(x, `${path}[${i}]`));
  if (node === null || typeof node !== 'object') return undefined;
  if ('lo' in node && 'mid' in node && 'hi' in node && !(node.lo <= node.mid && node.mid <= node.hi)) warn(`bad triple at ${path}: ${node.lo}, ${node.mid}, ${node.hi}`);
  for (const [k, v] of Object.entries(node)) check(v, `${path}.${k}`);
  return undefined;
})(clean, 'model');

for (const p of problems) console.log(`! ${p}`);
console.log(`${Object.keys(needs).length} needs, ${Object.keys(hazards).length} hazards, ${items.length} items, ${problems.length} problems`);
if (!process.argv.includes('--check')) {
  writeFileSync(join(root, 'data', 'model.json'), JSON.stringify(clean, null, 1) + '\n');
  console.log('wrote data/model.json');
}
