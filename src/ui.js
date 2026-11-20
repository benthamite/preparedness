// The page. Assumes the engine (rank, robustness, defaultSettings) and DATA
// are in scope: tools/build-page.mjs puts them in the same script.

const STORE = 'preparedness-settings-v3';
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Settings from before members were listed one by one carry counts; they
// become a list of members. Fields added since get their default values.
function migrate(old) {
  const s = { ...defaultSettings(DATA), ...old };
  if (!Array.isArray(old.people) && old.household) {
    const h = old.household;
    const people = [];
    let id = 0;
    const add = (age, n) => { for (let i = 0; i < (n || 0); i++) people.push({ id: ++id, age, valuation: 'personal' }); };
    add('age75plus', h.age75plus); add('age60to74', h.age60to74); add('adult', h.adults); add('child', h.children);
    const mark = (flag, n) => { for (let i = 0; i < Math.min(people.length, n || 0); i++) people[i][flag] = true; };
    mark('powerDependent', h.powerDependent); mark('criticalDrug', h.criticalDrug); mark('onMedication', Math.max(h.onMedication || 0, h.criticalDrug || 0));
    for (let i = 0, j = people.length - 1; i < (h.infants || 0) && j >= 0 && people[j].age === 'child'; i++, j--) people[j].infant = true;
    if (people.length) s.people = people;
    s.household = { pets: h.pets || 0 };
  }
  return s;
}
let settings = defaultSettings(DATA);
try {
  const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
  if (saved && saved.version === DATA.version) settings = migrate(saved.settings);
} catch (e) { /* storage unavailable: start from the defaults */ }

// A shared link carries its settings after "#list=" in the address of the
// note (or of this page when opened on its own), and takes precedence.
const LINK_KEY = 'list=';
function hostLocation() {
  try { if (window.frameElement) return parent.location; } catch (e) { /* cross-origin parent */ }
  return location;
}
function encodeSettings(x) {
  const bytes = new TextEncoder().encode(JSON.stringify({ version: DATA.version, settings: x }));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function decodeSettings(code) {
  const b = atob(code.replace(/-/g, '+').replace(/_/g, '/'));
  return JSON.parse(new TextDecoder().decode(Uint8Array.from(b, (c) => c.charCodeAt(0))));
}
try {
  const hash = hostLocation().hash || '';
  const at = hash.indexOf(LINK_KEY);
  if (at >= 0) {
    const shared = decodeSettings(hash.slice(at + LINK_KEY.length));
    // Settings from an older version of the model are merged onto today's
    // defaults, so fields it added get their default values.
    settings = migrate(shared.settings);
  }
} catch (e) { /* a damaged link: keep the saved or default settings */ }

// Once the reader changes anything, the address no longer describes the list,
// so the settings are dropped from it; otherwise a reload would undo the change.
function dropLink() {
  try {
    const L = hostLocation();
    if (L.hash.includes(LINK_KEY)) (L === location ? history : parent.history).replaceState(null, '', L.pathname + L.search);
  } catch (e) { /* nothing to drop */ }
}

let result = null;
let settingsTouched = false;
let sure = null;
let open = {};
let showAll = false;
const SHORT_LIST = 20;
let timer = null;
let job = 0;

const money = (x) => {
  if (!isFinite(x)) return '–';
  const a = Math.abs(x);
  const d = a >= 100 ? 0 : a >= 10 ? 1 : 2;
  return (x < 0 ? '−$' : '$') + a.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
};
const whole = (x) => (x < 0 ? '−$' : '$') + Math.round(Math.abs(x)).toLocaleString('en-US');
const num = (x, d = 1) => x.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const ratioText = (x) => (x === Infinity ? '∞' : x >= 100 ? Math.round(x).toLocaleString('en-US') : x >= 10 ? num(x, 0) : num(x, x < 0.1 && x > -0.1 ? 2 : 1));
const pct = (p) => {
  const x = 100 * p;
  if (x === 0) return '0';
  return x >= 10 ? num(x, 0) : x >= 1 ? num(x, 1) : String(Number(x.toPrecision(2)));
};

const ITEM = Object.fromEntries(DATA.items.map((it) => [it.id, it]));
const HAZARD_LABEL = (id) => (DATA.hazards[id] && DATA.hazards[id].label) || id;
const AI = DATA.ai || null;
const CUSTOM_YEARS = [2028, 2030, 2035];

// ---- controls ----

const AGE_OPTIONS = [['adult', '15–59'], ['child', 'under 15'], ['age60to74', '60–74'], ['age75plus', '75 or over']];
const PERSON_FLAGS = [
  ['onMedication', 'takes a daily prescription drug'],
  ['criticalDrug', '…that is dangerous to miss'],
  ['powerDependent', 'depends on a powered medical device'],
  ['infant', 'is an infant'],
];
const TICKS = [
  ['coldWinters', 'Cold winters'],
  ['hotSummers', 'Hot summers'],
  ['hurricane', 'Hurricane or cyclone zone'],
  ['earthquake', 'Earthquake zone'],
  ['wildfire', 'Wildfire zone'],
  ['flood', 'Flood zone'],
];
const HOME = ['cooking', 'heating', 'airConditioning', 'pumpedWater', 'car'];
const PLACES = DATA.places || { countries: {}, cities: [], hazardOrder: [] };
const CURRENT_YEAR = DATA.currentYear || 2026;
const FAMILY_TEXT = {
  grid: 'power cuts', banking: 'bank and currency crises', violence: 'crime and unrest', fire: 'fire and carbon monoxide',
  prices: 'prices and incomes', nuclear: 'nuclear war',
};

const personName = (p, i) => (p.name && p.name.trim()) || `person ${i + 1}`;
const nextId = () => 1 + Math.max(0, ...settings.people.map((p) => Number(p.id) || 0));

// ---- the city box ----
// Cities are matched on their name with accents removed, largest first.
const fold = (x) => String(x).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
let folded = null;
function cityMatches(q) {
  const f = fold(q.trim());
  if (!f) return [];
  folded ||= PLACES.cities.map((c) => fold(c[0]));
  const out = [];
  for (let i = 0; i < folded.length && out.length < 8; i++) if (folded[i].startsWith(f)) out.push(i);
  if (out.length < 8) {
    const word = ' ' + f;
    for (let i = 0; i < folded.length && out.length < 8; i++) if (!out.includes(i) && folded[i].includes(word)) out.push(i);
  }
  return out;
}
const countryName = (iso2) => (PLACES.countries[iso2] && PLACES.countries[iso2].name) || iso2;
const cityLabel = (c) => [c[0], c[1], countryName(c[2])].filter((x, i) => x && (i !== 1 || x !== c[0])).join(', ');

// Local hazards from a city's district ratings and climate (data/config.mjs,
// `cityRules`, says how). Returns the ticks, the fraction at which a medium
// rating counts, and a note on each tick.
const LEVEL_NAME = { H: 'high', M: 'medium', L: 'low', V: 'very low', N: 'not rated' };
const CODE_NAME = { FL: 'river flood', CF: 'coastal flood', EQ: 'earthquake', CY: 'cyclone', WF: 'wildfire', EH: 'extreme heat' };
function ticksFor(c) {
  const R = PLACES.rules;
  // c: [name, region, country, ratings, coldest month °C, warmest month °C].
  // A rating in lower case was borrowed from a neighbouring district.
  const raw = (code) => c[3][PLACES.hazardOrder.indexOf(code)] || 'N';
  const level = (code) => raw(code).toUpperCase();
  const said = (code) => `${CODE_NAME[code]} ${LEVEL_NAME[level(code)]}${raw(code) !== level(code) ? ' (from a neighbouring district)' : ''}`;
  const ticks = {}, scale = {}, notes = {};
  for (const [k, byCode] of Object.entries(R.levels)) {
    let best = 0;
    for (const [code, levels] of Object.entries(byCode)) best = Math.max(best, levels[level(code)] || 0);
    ticks[k] = best > 0;
    if (best > 0 && best < 1) scale[k] = best;
    notes[k] = Object.keys(byCode).map(said).join(', ') + (best > 0 && best < 1 ? `: counted at ${Math.round(100 * best)}% of a zone` : '');
  }
  ticks.wildfire = false;
  notes.wildfire = `${said('WF')}; not ticked from the rating, which measures fire weather`;
  ticks.coldWinters = c[4] !== null && c[4] !== undefined ? c[4] <= R.coldWintersMaxC : false;
  notes.coldWinters = c[4] !== null && c[4] !== undefined ? `coldest month ${c[4]} °C on average` : 'no climate data';
  ticks.hotSummers = R.hotSummersHeat.includes(level('EH')) || (c[5] !== null && c[5] !== undefined && c[5] >= R.hotSummersMinC);
  notes.hotSummers = `${said('EH')}${c[5] !== null && c[5] !== undefined ? `; warmest month ${c[5]} °C` : ''}`;
  return { ticks, scale, notes };
}

function chooseCity(i) {
  const c = PLACES.cities[i];
  const info = PLACES.countries[c[2]] || {};
  settings.city = { name: c[0], admin1: c[1], iso2: c[2], label: cityLabel(c) };
  settings.location = info.preset || 'buenosAires';
  // A country with figures of its own; Buenos Aires itself is the preset.
  settings.country = info.researched && !(info.presetCities || []).includes(c[0]) ? c[2] : null;
  const loc = DATA.locations[settings.location];
  for (const k of HOME) if (loc.home && loc.home[k] !== undefined) settings[k] = loc.home[k];
  const t = ticksFor(c);
  settings.ticks = t.ticks;
  settings.tickScale = t.scale;
  settings.tickNotes = t.notes;
  settings.cityTicks = { ...t.ticks };
  settings.probabilities = {};
}

function placeNote() {
  const s = settings;
  const preset = DATA.locations[s.location] ? DATA.locations[s.location].label : s.location;
  if (!s.city) return `No city chosen: the figures are those for the ${preset} preset.`;
  const iso = s.city.iso2;
  const info = PLACES.countries[iso] || {};
  if (s.country) {
    const fams = (info.families || []).map((f) => FAMILY_TEXT[f]);
    const list = fams.length > 1 ? `${fams.slice(0, -1).join(', ')} and ${fams[fams.length - 1]}` : fams.join('');
    return `${esc(countryName(iso))} has figures of its own for ${list}; everything else comes from the ${esc(preset)} preset.`;
  }
  if (info.presetCities && info.presetCities.includes(s.city.name)) return `${esc(s.city.name)} is one of the model's three presets.`;
  if (iso === 'US') return 'The United States is one of the model\'s three presets.';
  return `<b>${esc(countryName(iso))} has no figures of its own.</b> The model uses those of the ${esc(preset)} preset, the closest of its three in income and region.`;
}

function peoplePanel() {
  const s = settings;
  const rows = s.people.map((p, i) => {
    const child = p.age === 'child';
    const imp = p.valuation === 'impartial' && !child;
    const flags = PERSON_FLAGS.filter(([k]) => k !== 'infant' || child)
      .map(([k, label]) => `<label class="flag"><input type="checkbox" data-p="${i}" data-f="${k}"${p[k] ? ' checked' : ''}> ${label}</label>`).join('');
    const out = result && result.people && result.people[i];
    const valueText = out ? `${money(out.micromortValueUsd)} per micromort${out.impartial && out.workDayUsd > 0 ? `; a lost work day ${whole(out.workDayUsd)}` : ''}` : '';
    return `<div class="person">
      <div class="prow">
        <input type="text" class="pname" data-p="${i}" data-f="name" value="${esc(p.name || '')}" placeholder="person ${i + 1}" aria-label="Name">
        <select data-p="${i}" data-f="age" aria-label="Age">${AGE_OPTIONS.map(([v, t]) => `<option value="${v}"${p.age === v ? ' selected' : ''}>${t}</option>`).join('')}</select>
        <select data-p="${i}" data-f="valuation" aria-label="Valued by"${child ? ' disabled title="Children are valued by the personal standard"' : ''}><option value="personal"${imp ? '' : ' selected'}>Personal</option><option value="impartial"${imp ? ' selected' : ''}>Impartial</option></select>
        <label class="hour">$/hour <input type="number" min="0" step="1" data-p="${i}" data-f="hourValue" value="${p.hourValue ?? ''}" placeholder="${result ? Number(result.timeValueUsdPerHour.toPrecision(3)) : ''}"></label>
        ${s.people.length > 1 ? `<button type="button" class="remove" data-remove="${i}" title="Remove ${esc(personName(p, i))}">×</button>` : ''}
      </div>
      <div class="pflags">${flags}</div>
      ${imp ? `<div class="pimp">
        <label>Hours of work a year <input type="number" min="0" step="50" data-p="${i}" data-f="hoursPerYear" value="${p.hoursPerYear ?? ''}" placeholder="${DATA.defaults.hoursPerYear || 1800}"></label>
        <label>Counterfactual share <input type="number" min="0" max="100" step="5" data-p="${i}" data-f="counterfactual" value="${p.counterfactual !== undefined && p.counterfactual !== null ? Math.round(100 * p.counterfactual) : ''}" placeholder="50"> %</label>
        <label>Impact ends in <input type="number" min="${CURRENT_YEAR}" max="2100" step="1" data-p="${i}" data-f="impactEndYear" value="${p.impactEndYear ?? ''}" placeholder="${out && out.impactEndYear ? out.impactEndYear : ''}"></label>
      </div>` : ''}
      <div class="meta pv">${valueText}</div>
    </div>`;
  }).join('');
  return `<div class="panel people"><h3>Who lives here</h3>
    ${rows}
    <div class="field"><button type="button" id="add-person">Add a person</button><span></span></div>
    <div class="field"><label for="hh-pets">Pets</label><input type="number" id="hh-pets" min="0" step="1" value="${(s.household && s.household.pets) || 0}"></div>
    <div class="meta">Personal: a member's death and hardship are valued at what they would pay to avoid them. Impartial: at what their work would achieve for others, so lost work days count and their own comfort counts little.</div>
  </div>`;
}

function controls() {
  const sel = (id, label, options, value) => `<div class="field"><label for="${id}">${label}</label><select id="${id}">${options.map(([v, t]) => `<option value="${v}"${String(v) === String(value) ? ' selected' : ''}>${esc(t)}</option>`).join('')}</select></div>`;
  const numf = (id, label, value, step = 1, max = '') => `<div class="field"><label for="${id}">${label}</label><input type="number" id="${id}" min="0"${max !== '' ? ` max="${max}"` : ''} step="${step}" value="${value}"></div>`;
  const chk = (id, label, on, off = false) => `<div class="field check${off ? ' off' : ''}"><input type="checkbox" id="${id}"${on && !off ? ' checked' : ''}${off ? ' disabled title="Not modelled for this location"' : ''}><label for="${id}">${label}</label></div>`;
  // A local hazard can be ticked only where the research gives it a probability.
  const absent = (k) => { const h = DATA.hazards[k]; return !!h && h.probability[settings.location] === undefined && h.probability.all === undefined; };
  const s = settings;
  const p = s.parameters || {};
  const ai = s.ai || {};
  const custom = Object.fromEntries((ai.custom || []).map((c) => [c.year, c.p]));
  const aiPanel = !AI ? '' : `
    <div class="panel"><h3>Artificial intelligence</h3>
      ${sel('ai-timeline', 'When AGI arrives', [['none', 'Leave AI out'], ...Object.entries(AI.timelines).map(([k, v]) => [k, v.label]), ['custom', 'My own numbers']], ai.timeline || 'none')}
      <div id="ai-custom"${ai.timeline === 'custom' ? '' : ' style="display:none"'}>
        ${CUSTOM_YEARS.map((y) => numf(`ai-p-${y}`, `Chance of AGI by the end of ${y} (%)`, custom[y] !== undefined ? Math.round(1000 * custom[y]) / 10 : '', 1, 100)).join('')}
      </div>
      <div class="field"><label for="ai-concern">How concerned you are</label><span class="range"><span class="meta">sceptic</span><input type="range" id="ai-concern" min="0" max="100" step="5" value="${Math.round(100 * (ai.concern === undefined ? 0.5 : ai.concern))}"><span class="meta">very</span></span></div>
      ${numf('ai-horizon', 'Years you are planning for', ai.horizonYears || AI.horizonYears, 1, 30)}
      <div class="meta" id="ai-note"></div>
    </div>`;
  const tickDiffers = s.cityTicks && TICKS.some(([k]) => !!s.ticks[k] !== !!s.cityTicks[k]);
  $('controls').innerHTML = `
  <div class="panels">
    ${peoplePanel()}
    <div class="panel"><h3>Home</h3>
      <div class="field city"><label for="city">City</label><span class="citybox"><input type="text" id="city" autocomplete="off" spellcheck="false" placeholder="Type your city" value="${esc(s.city ? s.city.label : '')}"><span id="city-list" class="citylist" role="listbox"></span></span></div>
      <div class="meta" id="place-note">${placeNote()}</div>
      ${sel('dwelling', 'Dwelling', [['apartment', 'Apartment'], ['house', 'House']], s.dwelling)}
      ${sel('cooking', 'Cooker', [['electric', 'Electric'], ['gas', 'Gas']], s.cooking)}
      ${sel('heating', 'Heating', [['electric', 'Electric, or needs electricity'], ['gas', 'Gas'], ['independent', 'Works without utilities']], s.heating)}
      ${chk('airConditioning', 'Air conditioning', s.airConditioning)}
      ${chk('pumpedWater', 'Tap water needs an electric pump', s.pumpedWater)}
      ${chk('car', 'Car', s.car)}
      ${sel('pantryDays', 'Days you could eat from your kitchen now', [[3, '3'], [7, '7'], [14, '14'], [30, '30']], s.pantryDays ?? 14)}
      <details id="ticks-panel"${s.showTicks ? ' open' : ''}><summary>Local hazards${s.city ? '' : ' (preset)'}${tickDiffers ? ', changed by you' : ''}</summary>
        ${TICKS.map(([k, label]) => chk(`tick-${k}`, label, s.ticks[k], absent(k)) + (s.city && s.tickNotes && s.tickNotes[k] ? `<div class="meta ticknote">${esc(s.tickNotes[k])}${s.cityTicks && !!s.cityTicks[k] !== !!s.ticks[k] ? '; changed by you' : ''}</div>` : '')).join('')}
        <div class="meta">${s.city ? 'Filled in from the World Bank\'s ThinkHazard ratings for the district and from CHELSA climate normals. They describe the district, not your street: untick a flood zone if your home is well above the flood plain, and tick wildfire if you live near wildland.' : 'Choose a city to fill these in.'}</div>
      </details>
    </div>
    ${aiPanel}
    <div class="panel"><h3>Values</h3>
      ${sel('rankOn', 'Rank on', [['median', 'Middle values'], ['mean', 'Averages (expected value)']], s.rankOn || 'median')}
      ${sel('outlook', 'Other risks', Object.entries(DATA.outlooks).map(([k, v]) => [k, v.label]), s.outlook)}
      ${sel('deathValue', 'Value each death by', [['lifeYears', 'Remaining life-years'], ['equal', 'Equal for everyone']], s.deathValue || 'lifeYears')}
      ${numf('p-micromort', 'A one-in-a-million risk of death to an adult on the local wage is worth ($)', p.micromortValueUsd ?? '', 0.5)}
      ${numf('budget', 'Budget, upfront ($)', s.budget ?? '', 50)}
      <div class="field"><span></span><button type="button" id="reset">Reset</button></div>
    </div>
  </div>
  <details class="panel" id="haz-panel"${s.showHazards ? ' open' : ''}>
    <summary>Yearly probabilities (edit any)</summary>
    <div class="hazards" id="hazards"></div>
    <div class="field" style="margin-top:8px"><button type="button" id="copy-probs">Copy these numbers</button><input type="text" id="probs-text" readonly style="flex:1;display:none"></div>
  </details>`;
}

function hazardInputs() {
  const live = Object.fromEntries(result.hazards.map((h) => [h.id, h.p]));
  $('hazards').innerHTML = Object.keys(DATA.hazards).filter((id) => !DATA.hazards[id].everyday).map((id) => {
    const on = id in live;
    const custom = settings.probabilities && settings.probabilities[id] !== undefined;
    const value = on ? pct(live[id]).replace(/,/g, '') : '';
    return `<div class="field${on ? '' : ' off'}"><label for="hz-${id}" title="${esc(DATA.hazards[id].definition || '')}">${esc(HAZARD_LABEL(id))}${custom ? ' *' : ''}</label><span><input type="number" id="hz-${id}" data-hazard="${id}" min="0" max="100" step="any" value="${value}"${on ? '' : ' disabled'}> %</span></div>`;
  }).join('');
}

function readControls() {
  const s = settings;
  const num0 = (x) => (x === '' || x === undefined ? undefined : Math.max(0, Number(x)));
  document.querySelectorAll('#controls [data-p][data-f]').forEach((el) => {
    const p = s.people[Number(el.dataset.p)];
    if (!p) return;
    const f = el.dataset.f;
    if (el.type === 'checkbox') p[f] = el.checked;
    else if (f === 'name' || f === 'age' || f === 'valuation') p[f] = el.value;
    else if (f === 'counterfactual') p[f] = el.value === '' ? undefined : Math.min(1, Math.max(0, Number(el.value) / 100));
    else p[f] = num0(el.value);
  });
  for (const p of s.people) {
    if (p.age !== 'child') p.infant = false;
    if (p.age === 'child') p.valuation = 'personal';
    if (p.criticalDrug) p.onMedication = true;
  }
  s.household = { ...(s.household || {}), pets: Math.max(0, Math.floor(Number($('hh-pets').value) || 0)) };
  for (const k of ['dwelling', 'cooking', 'heating', 'outlook', 'rankOn', 'deathValue']) s[k] = $(k).value;
  for (const k of ['airConditioning', 'pumpedWater', 'car']) s[k] = $(k).checked;
  s.pantryDays = Number($('pantryDays').value);
  for (const [k] of TICKS) {
    const on = $(`tick-${k}`).checked && !$(`tick-${k}`).disabled;
    // A tick the reader sets counts in full.
    if (on !== !!s.ticks[k] && s.tickScale) delete s.tickScale[k];
    s.ticks[k] = on;
  }
  s.parameters = s.parameters || {};
  s.parameters.micromortValueUsd = num0($('p-micromort').value);
  s.budget = num0($('budget').value);
  s.showHazards = $('haz-panel').open;
  s.showTicks = $('ticks-panel').open;
  if (AI) {
    const points = CUSTOM_YEARS.map((y) => ({ year: y, p: num0($(`ai-p-${y}`).value) })).filter((c) => c.p !== undefined).map((c) => ({ year: c.year, p: Math.min(1, c.p / 100) }));
    // Later years cannot be less likely than earlier ones.
    for (let i = 1; i < points.length; i++) points[i].p = Math.max(points[i].p, points[i - 1].p);
    s.ai = {
      timeline: $('ai-timeline').value, custom: points,
      concern: Number($('ai-concern').value) / 100,
      horizonYears: Math.max(1, Math.min(30, Math.round(num0($('ai-horizon').value) || AI.horizonYears))),
    };
    if (s.ai.timeline === 'custom' && !points.length) s.ai.timeline = 'none';
    $('ai-custom').style.display = $('ai-timeline').value === 'custom' ? '' : 'none';
  }
}

function save() {
  if (result && settingsTouched) dropLink();
  try { localStorage.setItem(STORE, JSON.stringify({ version: DATA.version, settings })); } catch (e) { /* ignore */ }
}

// ---- output ----

// A member's copy of a personal item is named for its owner.
function ownerName(key) {
  const i = settings.people.findIndex((p, j) => String(p.id !== undefined ? p.id : j + 1) === String(key));
  return i < 0 ? '' : personName(settings.people[i], i);
}
function entryName(e) {
  return e.items.map((x) => {
    const it = ITEM[x.id];
    return esc(it.name) + (x.label ? ` <span class="sub">(${esc(x.label)})</span>` : '') + (x.person !== null && x.person !== undefined ? ` <span class="who">for ${esc(ownerName(x.person))}</span>` : '');
  }).join(' + ');
}
const plainName = (e) => e.items.map((x) => ITEM[x.id].name + (x.label ? ` (${x.label})` : '') + (x.person !== null && x.person !== undefined ? `, for ${ownerName(x.person)}` : '')).join(' + ');
// An owned key is an item id, or an item id, "@" and a member's key.
function ownedName(key, lv) {
  const [id, who] = key.split('@');
  const it = ITEM[id];
  if (!it) return null;
  return `${it.name}${it.ladder ? ` (${it.ladder[lv - 1].label})` : ''}${who ? `, for ${ownerName(who)}` : ''}`;
}
function peopleText() {
  return settings.people.map((p, i) => {
    const r = result.people && result.people[i];
    const flags = PERSON_FLAGS.filter(([k]) => p[k]).map(([, l]) => l.replace(/^…/, 'drug '));
    return `${personName(p, i)} (${AGE_OPTIONS.find(([v]) => v === p.age)[1]}, ${p.valuation === 'impartial' && p.age !== 'child' ? 'valued impartially' : 'valued personally'}${r ? `, ${money(r.micromortValueUsd)} per micromort` : ''}${flags.length ? `; ${flags.join(', ')}` : ''})`;
  }).join('; ');
}

function detail(e) {
  const parts = [];
  for (const x of e.items) {
    const it = ITEM[x.id];
    parts.push(`<p><b>${esc(it.name)}.</b> ${esc(it.spec || '')} <span class="tag tag-${it.confidence || 'guess'}">${it.confidence || 'guess'}</span></p>`);
    if (it.note) parts.push(`<p>${esc(it.note)}</p>`);
  }
  const total = e.byHazard.reduce((s, h) => s + Math.max(0, h.value), 0);
  if (total > 0) {
    parts.push('<p>Where the value comes from: ' + e.byHazard.filter((h) => h.value > 0.005 * total).slice(0, 6)
      .map((h) => `${esc(HAZARD_LABEL(h.id))} ${Math.round(100 * h.value / total)}%`).join(', ') + '.</p>');
  }
  const be = e.breakEven;
  if (be && !DATA.hazards[be.hazard].everyday && e.byHazard[0].value > 0.5 * e.valueUsd) {
    if (be.probability <= 0) parts.push(`<p>Pays for itself even without “${esc(HAZARD_LABEL(be.hazard))}”.</p>`);
    else if (be.probability <= 1) parts.push(`<p>Pays for itself if the yearly chance of “${esc(HAZARD_LABEL(be.hazard))}” is above ${pct(be.probability)}%. It is set at ${pct(be.current)}%.</p>`);
  }
  if (e.setupHours > 0) parts.push(`<p>Time to set up: ${num(e.setupHours, 1)} hours, counted in the yearly cost.</p>`);
  const src = e.items.flatMap((x) => ITEM[x.id].sources || []);
  if (src.length) {
    parts.push('<p>Sources: ' + src.slice(0, 6).map((u) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(u.replace(/^https?:\/\/(www\.)?/, '').split('/')[0])}</a>`).join(', ') + '.</p>');
  }
  return parts.join('');
}

// The list as plain text (Markdown), for the reader to keep or to give to an
// assistant: a fetched link shows only the default list, because the page
// computes the list in the browser.
function listText() {
  const r = result;
  const s = settings;
  let cutoff = r.entries.findIndex((e) => !(e.ratio > 1));
  if (cutoff < 0) cutoff = r.entries.length;
  const ticks = TICKS.filter(([k]) => s.ticks && s.ticks[k]).map(([, label]) => label.toLowerCase()).join(', ');
  const timeline = !AI || !s.ai || s.ai.timeline === 'none' ? 'left out' : (AI.timelines && AI.timelines[s.ai.timeline] ? AI.timelines[s.ai.timeline].label : s.ai.timeline);
  const name = plainName;
  const line = (e, i) => {
    const specs = e.items.map((x) => ITEM[x.id].spec).filter(Boolean).join(' ');
    const main = e.byHazard[0];
    const forText = main && e.valueUsd > 0 && main.value > 0 ? `; mostly for: ${HAZARD_LABEL(main.id)}` : '';
    return `${i + 1}. **${name(e)}**: ${whole(e.upfrontUsd)} upfront, ${money(e.annualCostUsd)} a year; benefit ÷ cost ${ratioText(e.ratio)}${forText}.${specs ? `\n   ${specs}` : ''}`;
  };
  const out = [
    '# My preparedness list',
    '',
    `From ${hostLocation().origin}${hostLocation().pathname}. Each entry is valued given the ones above it, so buy in order.`,
    '',
    `- Household: ${peopleText()}${s.household && s.household.pets ? `; ${s.household.pets} pet${s.household.pets > 1 ? 's' : ''}` : ''}`,
    `- Location: ${s.city ? s.city.label : `${DATA.locations[s.location] ? DATA.locations[s.location].label : s.location} (preset)`}; ${s.dwelling}${ticks ? `; ${ticks}` : ''}`,
    `- Deaths valued by ${s.deathValue === 'equal' ? 'equal values for everyone' : 'remaining life-years'}`,
    `- Artificial intelligence: ${timeline}`,
    '',
    `## Worth buying or doing (${cutoff} entries, ${whole(cutoff ? r.entries[cutoff - 1].cumulativeUpfrontUsd : 0)} upfront)`,
    '',
    ...r.entries.slice(0, cutoff).map(line),
    '',
    '## Next in line (benefit below cost)',
    '',
    ...r.entries.slice(cutoff, cutoff + 10).map((e, j) => line(e, cutoff + j)),
  ];
  const owned = Object.entries(s.owned || {}).filter(([id, lv]) => lv > 0 && ownedName(id, lv));
  if (owned.length) out.push('', '## Already have', '', ...owned.map(([id, lv]) => `- ${ownedName(id, lv)}`));
  out.push('', `Settings link: ${shareLink()}`, '');
  return out.join('\n');
}

function shareLink() {
  const L = hostLocation();
  return `${L.origin}${L.pathname}#${LINK_KEY}${encodeSettings(settings)}`;
}

function flash(button, text) {
  const old = button.textContent;
  button.textContent = text;
  setTimeout(() => { button.textContent = old; }, 1500);
}

function copy(text, button) {
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => flash(button, 'Copied'), () => flash(button, 'Copy failed'));
  else flash(button, 'Copy failed');
}

function render() {
  const r = result;
  const v = r.micromortValueUsd;
  const budget = settings.budget;
  let cutoff = r.entries.findIndex((e) => !(e.ratio > 1));
  if (cutoff < 0) cutoff = r.entries.length;
  let within = r.entries.length;
  if (budget !== undefined) {
    within = r.entries.findIndex((e) => e.cumulativeUpfrontUsd > budget);
    if (within < 0) within = r.entries.length;
  }
  const stop = Math.min(cutoff, within);
  const picked = r.entries.slice(0, stop);
  const averted$ = picked.reduce((s, e) => s + e.hardshipUsd, 0);
  const avertedM = picked.reduce((s, e) => s + e.micromorts, 0);
  const upfront = picked.length ? picked[picked.length - 1].cumulativeUpfrontUsd : 0;
  const annual = picked.length ? picked[picked.length - 1].cumulativeAnnualUsd : 0;

  $('summary').innerHTML = picked.length
    ? `The <b>${picked.length} entries above the line</b> cost <b>${whole(upfront)} upfront</b>, or ${whole(annual)} a year with upkeep and your time. Each year they avert, in expectation, <b>${whole(averted$)} of hardship and loss and ${num(avertedM, avertedM >= 10 ? 0 : 1)} micromorts</b>: worth ${whole(picked.reduce((s, e) => s + e.valueUsd, 0))} in all, with deaths valued as shown for each member.`
    : 'Nothing on the list pays for itself at these settings.';
  if (AI) {
    const on = settings.ai && settings.ai.timeline && settings.ai.timeline !== 'none';
    $('ai-note').textContent = !on ? 'The probabilities below are base rates, with AI left out.'
      : `The probabilities below now reflect your timeline.${r.survival < 0.995 ? ` Every value is scaled by ${num(r.survival, 2)}: the chance, over your horizon, that no existential catastrophe has made preparation moot.` : ''}`;
  }

  const owned = Object.entries(settings.owned || {}).filter(([id, lv]) => lv > 0 && ownedName(id, lv));
  $('owned').innerHTML = owned.length
    ? 'Already have: ' + owned.map(([id, lv]) => `<span>${esc(ownedName(id, lv))}<a data-unown="${esc(id)}" title="Remove">×</a></span>`).join('')
    : '';

  const maxRatio = Math.max(1, ...r.entries.map((e) => (isFinite(e.ratio) ? e.ratio : 0)));
  const barw = (x) => (x > 0 ? Math.max(2, Math.round(36 * Math.log10(1 + x) / Math.log10(1 + maxRatio))) : 0);
  let html = `<table><thead><tr><th class="cb" title="Tick what you already have">Have</th><th class="r">#</th><th>What</th><th class="r">Upfront</th><th class="r">Cost<br>a year</th><th class="r" title="Hardship, loss and, for members valued impartially, lost work averted a year, in dollars">Hardship<br>averted</th><th class="r" title="Micromorts averted a year">Micro&shy;morts<br>averted</th><th class="r">Benefit<br>÷ cost</th><th class="r" title="Share of plausible parameter sets under which benefit exceeds cost">Chance<br>it pays</th><th class="for">Mostly for</th></tr></thead><tbody>`;
  // The list shows its first entries until the reader asks for all.
  const shown = showAll ? r.entries.length : Math.max(SHORT_LIST, 0);
  r.entries.forEach((e, i) => {
    if (i >= shown) return;
    if (i === stop) {
      const why = within < cutoff ? 'Your budget ends here.' : 'Below this line, expected benefit is less than cost.';
      html += `<tr class="rule"><td colspan="10">${why}</td></tr>`;
    } else if (i === cutoff && cutoff > within) {
      html += '<tr class="rule"><td colspan="10">Below this line, expected benefit is less than cost.</td></tr>';
    }
    const key = e.add.map((a) => a.join(':')).join('+');
    const main = e.byHazard[0];
    const mainText = main && e.valueUsd > 0 && main.value > 0 ? `${esc(HAZARD_LABEL(main.id))} ${Math.round(100 * main.value / e.valueUsd)}%` : '';
    const s = sure && sure[i] ? `${Math.round(100 * sure[i].pAbove1)}%` : '…';
    html += `<tr class="entry${i >= cutoff ? ' below' : ''}" data-key="${key}"><td class="cb"><input type="checkbox" data-own="${i}" title="I already have this"></td><td class="r">${i + 1}</td><td class="name" data-toggle="${key}">${entryName(e)}<div class="sub">${esc(ITEM[e.items[0].id].group || '')}</div></td><td class="r">${whole(e.upfrontUsd)}</td><td class="r">${money(e.annualCostUsd)}</td><td class="r">${money(e.hardshipUsd)}</td><td class="r">${num(e.micromorts, Math.abs(e.micromorts) >= 10 ? 0 : 2)}</td><td class="r"><span class="bar" style="width:${barw(e.ratio)}px"></span>${ratioText(e.ratio)}</td><td class="r">${s}</td><td class="for">${mainText}</td></tr>`;
    if (open[key]) html += `<tr class="detail"><td colspan="10">${detail(e)}</td></tr>`;
  });
  html += '</tbody></table>';
  if (r.entries.length > SHORT_LIST) {
    html += `<div class="more"><button type="button" id="show-all">${showAll ? `Show the first ${SHORT_LIST}` : `Show all ${r.entries.length} entries`}</button>${!showAll && stop > SHORT_LIST ? ` <span class="meta">${stop - SHORT_LIST} more above the line.</span>` : ''}</div>`;
  }
  $('output').innerHTML = html;
  fit();
}

// What each member's death and lost work are worth, beside their row.
function memberValues() {
  document.querySelectorAll('#controls .person').forEach((row, i) => {
    const out = result.people && result.people[i];
    if (!out) return;
    row.querySelector('.pv').textContent = `${money(out.micromortValueUsd)} per micromort${out.impartial && out.workDayUsd > 0 ? `; an average day of work ${whole(out.workDayUsd)}` : ''}`;
    const hour = row.querySelector('[data-f="hourValue"]');
    if (hour) hour.placeholder = Number(result.timeValueUsdPerHour.toPrecision(3));
    const end = row.querySelector('[data-f="impactEndYear"]');
    if (end && out.impactEndYear) end.placeholder = out.impactEndYear;
  });
}

function fit() {
  try {
    const el = window.frameElement;
    if (el) el.style.height = document.body.scrollHeight + 'px';
  } catch (e) { /* not in a same-origin frame */ }
}

// ---- computing ----

function compute() {
  const mine = ++job;
  result = rank(DATA, settings);
  sure = null;
  // Empty value fields show the figure the model is using.
  $('p-micromort').placeholder = Number(result.micromortValueUsd.toPrecision(3));
  hazardInputs();
  memberValues();
  render();
  save();
  // The uncertainty pass runs in slices so the page stays responsive.
  const N = 40, SLICE = 2;
  const order = result.entries;
  const all = order.map(() => []);
  let done = 0;
  const step = () => {
    if (mine !== job) return;
    const part = robustness(DATA, settings, order, { samples: SLICE, seed: 1 + done, raw: true });
    part.forEach((list, i) => all[i].push(...list));
    done += SLICE;
    if (done >= N) {
      sure = all.map((list) => ({ pAbove1: list.filter((x) => x > 1).length / list.length }));
      render();
    } else setTimeout(step, 0);
  };
  setTimeout(step, 50);
}

function changed() {
  settingsTouched = true;
  readControls();
  $('summary').textContent = 'Working…';
  clearTimeout(timer);
  timer = setTimeout(compute, 150);
}

$('controls').addEventListener('change', (ev) => {
  const t = ev.target;
  if (t.id === 'city') return; // a city is chosen from its list
  const hz = t.dataset && t.dataset.hazard;
  if (hz) {
    settings.probabilities = settings.probabilities || {};
    if (t.value === '') delete settings.probabilities[hz];
    else settings.probabilities[hz] = Math.min(1, Math.max(0, Number(t.value) / 100));
    changed();
    return;
  }
  if (['outlook', 'ai-timeline', 'ai-concern', 'ai-horizon'].includes(t.id) || t.id.startsWith('ai-p-')) {
    settings.probabilities = {};
  }
  // A member's age or standard changes which fields they have.
  if (t.dataset && (t.dataset.f === 'age' || t.dataset.f === 'valuation')) {
    readControls();
    controls();
  }
  changed();
});
$('controls').addEventListener('input', (ev) => {
  if (ev.target.id === 'ai-concern') changed();
  else if (ev.target.id === 'city') cityList(ev.target.value);
});

// The city box: suggestions as the reader types, chosen with a click or the
// keyboard.
let suggestions = [];
let picked = -1;
function cityList(q) {
  suggestions = cityMatches(q);
  picked = suggestions.length ? 0 : -1;
  drawCityList();
}
function drawCityList() {
  const box = $('city-list');
  if (!box) return;
  box.innerHTML = suggestions.map((i, j) => `<span role="option" data-city="${i}" class="${j === picked ? 'on' : ''}">${esc(cityLabel(PLACES.cities[i]))}</span>`).join('');
  box.style.display = suggestions.length ? 'block' : 'none';
  fit();
}
function takeCity(i) {
  chooseCity(i);
  suggestions = [];
  settingsTouched = true;
  controls();
  changed();
}
$('controls').addEventListener('keydown', (ev) => {
  if (ev.target.id !== 'city' || !suggestions.length) return;
  if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') {
    picked = (picked + (ev.key === 'ArrowDown' ? 1 : suggestions.length - 1)) % suggestions.length;
    drawCityList();
    ev.preventDefault();
  } else if (ev.key === 'Enter') {
    if (picked >= 0) takeCity(suggestions[picked]);
    ev.preventDefault();
  } else if (ev.key === 'Escape') {
    suggestions = [];
    drawCityList();
  }
});
$('controls').addEventListener('mousedown', (ev) => {
  const c = ev.target.closest('[data-city]');
  if (c) { ev.preventDefault(); takeCity(Number(c.dataset.city)); }
});
$('controls').addEventListener('focusout', (ev) => {
  if (ev.target.id === 'city') setTimeout(() => { suggestions = []; drawCityList(); if ($('city') && settings.city) $('city').value = settings.city.label; }, 150);
});

$('controls').addEventListener('click', (ev) => {
  const t = ev.target;
  if (t.id === 'reset') {
    settings = defaultSettings(DATA);
    settingsTouched = true;
    open = {};
    controls();
    compute();
  } else if (t.id === 'add-person') {
    readControls();
    settings.people.push({ id: nextId(), age: 'adult', valuation: 'personal' });
    controls();
    changed();
  } else if (t.dataset && t.dataset.remove !== undefined) {
    readControls();
    const gone = settings.people.splice(Number(t.dataset.remove), 1)[0];
    // What the member owned goes with them.
    const key = String(gone.id !== undefined ? gone.id : Number(t.dataset.remove) + 1);
    for (const id of Object.keys(settings.owned || {})) if (id.split('@')[1] === key) delete settings.owned[id];
    controls();
    changed();
  } else if (t.id === 'copy-probs') {
    // The probabilities in use, as text: percent a year by hazard.
    const text = JSON.stringify(Object.fromEntries(result.hazards.filter((h) => !DATA.hazards[h.id].everyday).map((h) => [h.id, Number((100 * h.p).toPrecision(3))])));
    const box = $('probs-text');
    box.value = text;
    box.style.display = '';
    box.select();
    const done = () => { t.textContent = 'Copied'; setTimeout(() => { t.textContent = 'Copy these numbers'; }, 1500); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, () => {});
  }
});
$('controls').addEventListener('toggle', () => {
  settings.showHazards = $('haz-panel').open;
  settings.showTicks = $('ticks-panel').open;
  save();
  fit();
}, true);
$('output').addEventListener('click', (ev) => {
  if (ev.target.id === 'show-all') { showAll = !showAll; render(); return; }
  const t = ev.target.closest('[data-toggle]');
  if (t) { open[t.dataset.toggle] = !open[t.dataset.toggle]; render(); }
});
$('output').addEventListener('change', (ev) => {
  const i = ev.target.dataset && ev.target.dataset.own;
  if (i === undefined) return;
  settings.owned = settings.owned || {};
  for (const [id, lv] of result.entries[Number(i)].add) settings.owned[id] = Math.max(settings.owned[id] || 0, lv);
  settingsTouched = true;
  compute();
});
$('export').addEventListener('click', (ev) => {
  if (!result) return;
  if (ev.target.id === 'copy-link') copy(shareLink(), ev.target);
  else if (ev.target.id === 'copy-list') copy(listText(), ev.target);
  else if (ev.target.id === 'download-list') {
    const a = document.createElement('a');
    a.href = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(listText());
    a.download = 'preparedness-list.md';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
});
$('owned').addEventListener('click', (ev) => {
  const id = ev.target.dataset && ev.target.dataset.unown;
  if (!id) return;
  delete settings.owned[id];
  settingsTouched = true;
  compute();
});

function isDark() {
  try { return parent.document.documentElement.getAttribute('data-theme') === 'dark'; }
  catch (e) { return window.matchMedia('(prefers-color-scheme: dark)').matches; }
}
function applyTheme() { document.body.classList.toggle('dark', isDark()); }
applyTheme();
try {
  new MutationObserver(applyTheme).observe(parent.document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
} catch (e) { /* not in a same-origin frame */ }
window.addEventListener('resize', fit);

controls();
compute();
