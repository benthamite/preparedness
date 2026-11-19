// The page. Assumes the engine (rank, robustness, defaultSettings) and DATA
// are in scope: tools/build-page.mjs puts them in the same script.

const STORE = 'preparedness-settings-v1';
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let settings = defaultSettings(DATA);
try {
  const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
  if (saved && saved.version === DATA.version) settings = saved.settings;
} catch (e) { /* storage unavailable: start from the defaults */ }

let result = null;
let sure = null;
let open = {};
let timer = null;
let job = 0;

const money = (x) => {
  if (!isFinite(x)) return '–';
  const a = Math.abs(x);
  const d = a >= 100 ? 0 : a >= 10 ? 1 : 2;
  return (x < 0 ? '−$' : '$') + a.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
};
const whole = (x) => '$' + Math.round(x).toLocaleString('en-US');
const num = (x, d = 1) => x.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const ratioText = (x) => (x === Infinity ? '∞' : x >= 100 ? Math.round(x).toLocaleString('en-US') : x >= 10 ? num(x, 0) : num(x, 1));
const pct = (p) => {
  const x = 100 * p;
  if (x === 0) return '0';
  return x >= 10 ? num(x, 0) : x >= 1 ? num(x, 1) : String(Number(x.toPrecision(2)));
};

const ITEM = Object.fromEntries(DATA.items.map((it) => [it.id, it]));
const HAZARD_LABEL = (id) => (DATA.hazards[id] && DATA.hazards[id].label) || id;

// ---- controls ----

const HOUSEHOLD = [
  ['adults', 'Adults aged 15–59'],
  ['children', 'Children under 15'],
  ['age60to74', 'People aged 60–74'],
  ['age75plus', 'People aged 75 or over'],
  ['onMedication', 'People on daily prescription medicine'],
  ['criticalDrug', '…whose medicine is dangerous to miss'],
  ['powerDependent', 'People who depend on a powered medical device'],
  ['infants', 'Infants'],
  ['pets', 'Pets'],
];
const TICKS = [
  ['coldWinters', 'Cold winters'],
  ['hotSummers', 'Hot summers'],
  ['hurricane', 'Hurricane or cyclone zone'],
  ['earthquake', 'Earthquake zone'],
  ['wildfire', 'Wildfire zone'],
  ['flood', 'Flood zone'],
];

function controls() {
  const sel = (id, label, options, value) => `<div class="field"><label for="${id}">${label}</label><select id="${id}">${options.map(([v, t]) => `<option value="${v}"${String(v) === String(value) ? ' selected' : ''}>${t}</option>`).join('')}</select></div>`;
  const numf = (id, label, value, step = 1) => `<div class="field"><label for="${id}">${label}</label><input type="number" id="${id}" min="0" step="${step}" value="${value}"></div>`;
  const chk = (id, label, on) => `<div class="field check"><input type="checkbox" id="${id}"${on ? ' checked' : ''}><label for="${id}">${label}</label></div>`;
  const s = settings;
  const p = s.parameters || {};
  $('controls').innerHTML = `
  <div class="panels">
    <div class="panel"><h3>Household</h3>
      ${HOUSEHOLD.map(([k, label]) => numf(`hh-${k}`, label, s.household[k] || 0)).join('')}
    </div>
    <div class="panel"><h3>Home</h3>
      ${sel('location', 'Location', Object.entries(DATA.locations).map(([k, v]) => [k, v.label]), s.location)}
      ${sel('dwelling', 'Dwelling', [['apartment', 'Apartment'], ['house', 'House']], s.dwelling)}
      ${sel('cooking', 'Cooker', [['electric', 'Electric'], ['gas', 'Gas']], s.cooking)}
      ${sel('heating', 'Heating', [['electric', 'Electric, or needs electricity'], ['gas', 'Gas'], ['independent', 'Works without utilities']], s.heating)}
      ${chk('airConditioning', 'Air conditioning', s.airConditioning)}
      ${chk('pumpedWater', 'Tap water needs an electric pump', s.pumpedWater)}
      ${chk('car', 'Car', s.car)}
    </div>
    <div class="panel"><h3>Where you live</h3>
      ${TICKS.map(([k, label]) => chk(`tick-${k}`, label, s.ticks[k])).join('')}
    </div>
    <div class="panel"><h3>Values</h3>
      ${sel('outlook', 'Risk outlook', Object.entries(DATA.outlooks).map(([k, v]) => [k, v.label]), s.outlook)}
      ${numf('p-micromort', 'A one-in-a-million risk of death is worth ($)', p.micromortValueUsd ?? '', 0.5)}
      ${numf('p-time', 'An hour of your time is worth ($)', p.timeValueUsdPerHour ?? '', 1)}
      ${numf('budget', 'Budget, upfront ($)', s.budget ?? '', 50)}
      <div class="field"><span></span><button type="button" id="reset">Reset</button></div>
    </div>
  </div>
  <details class="panel" id="haz-panel"${s.showHazards ? ' open' : ''}>
    <summary>Annual probabilities (edit any)</summary>
    <div class="hazards" id="hazards"></div>
  </details>`;
}

function hazardInputs() {
  const live = Object.fromEntries(result.hazards.map((h) => [h.id, h.p]));
  $('hazards').innerHTML = Object.keys(DATA.hazards).map((id) => {
    const on = id in live;
    const custom = settings.probabilities && settings.probabilities[id] !== undefined;
    const value = on ? pct(live[id]).replace(/,/g, '') : '';
    return `<div class="field${on ? '' : ' off'}"><label for="hz-${id}" title="${esc(DATA.hazards[id].definition || '')}">${esc(HAZARD_LABEL(id))}${custom ? ' *' : ''}</label><span><input type="number" id="hz-${id}" data-hazard="${id}" min="0" max="100" step="any" value="${value}"${on ? '' : ' disabled'}> %</span></div>`;
  }).join('');
}

function readControls() {
  const s = settings;
  for (const [k] of HOUSEHOLD) s.household[k] = Math.max(0, Math.floor(Number($(`hh-${k}`).value) || 0));
  if (s.household.adults + s.household.children + s.household.age60to74 + s.household.age75plus === 0) s.household.adults = 1;
  for (const k of ['location', 'dwelling', 'cooking', 'heating', 'outlook']) s[k] = $(k).value;
  for (const k of ['airConditioning', 'pumpedWater', 'car']) s[k] = $(k).checked;
  for (const [k] of TICKS) s.ticks[k] = $(`tick-${k}`).checked;
  s.parameters = s.parameters || {};
  const opt = (id) => ($(id).value === '' ? undefined : Math.max(0, Number($(id).value)));
  s.parameters.micromortValueUsd = opt('p-micromort');
  s.parameters.timeValueUsdPerHour = opt('p-time');
  s.budget = opt('budget');
  s.showHazards = $('haz-panel').open;
}

function save() {
  try { localStorage.setItem(STORE, JSON.stringify({ version: DATA.version, settings })); } catch (e) { /* ignore */ }
}

// ---- output ----

function entryName(e) {
  return e.items.map((x) => {
    const it = ITEM[x.id];
    return esc(it.name) + (x.label ? ` <span class="sub">(${esc(x.label)})</span>` : '');
  }).join(' + ');
}

function detail(e) {
  const parts = [];
  for (const x of e.items) {
    const it = ITEM[x.id];
    parts.push(`<p><b>${esc(it.name)}.</b> ${esc(it.spec || '')}${it.units && x.units ? ` Quantity: ${num(x.units, 0)} ${esc(it.units)}.` : ''} <span class="tag tag-${it.confidence || 'guess'}">${it.confidence || 'guess'}</span></p>`);
    if (it.note) parts.push(`<p>${esc(it.note)}</p>`);
  }
  const total = e.byHazard.reduce((s, h) => s + Math.max(0, h.value), 0);
  if (total > 0) {
    parts.push('<p>Where the value comes from: ' + e.byHazard.filter((h) => h.value > 0.005 * total).slice(0, 6)
      .map((h) => `${esc(HAZARD_LABEL(h.id))} ${Math.round(100 * h.value / total)}%`).join(', ') + '.</p>');
  }
  if (e.breakEven && e.breakEven.probability > 0 && e.byHazard[0].value > 0.5 * e.valueUsd) {
    parts.push(`<p>Pays for itself if the yearly chance of “${esc(HAZARD_LABEL(e.breakEven.hazard))}” is above ${pct(e.breakEven.probability)}%. You have it at ${pct(e.breakEven.current)}%.</p>`);
  }
  if (e.setupHours > 0) parts.push(`<p>Time to set up: ${num(e.setupHours, 1)} hours, counted in the yearly cost.</p>`);
  const src = e.items.flatMap((x) => ITEM[x.id].sources || []);
  if (src.length) {
    parts.push('<p>Sources: ' + src.slice(0, 6).map((u) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(u.replace(/^https?:\/\/(www\.)?/, '').split('/')[0])}</a>`).join(', ') + '.</p>');
  }
  return parts.join('');
}

function render() {
  const r = result;
  const v = r.micromortValueUsd;
  const un = r.harm.unprepared;
  const start = r.harm.start;
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
  const totalHarm = un.usd + v * un.mm;
  const share = totalHarm > 0 ? 100 * (averted$ + v * avertedM + (un.usd - start.usd) + v * (un.mm - start.mm)) / totalHarm : 0;

  $('summary').innerHTML = `Unprepared, this household can expect harm worth <b>${whole(totalHarm)} a year</b> from the events modelled: ${whole(un.usd)} of hardship and loss, and ${num(un.mm, 0)} micromorts (a ${num(un.mm / 1e4, 2)}% yearly chance of death across the household). `
    + `The ${picked.length} entries above the line cost <b>${whole(upfront)} upfront</b> (${whole(annual)} a year, all in) and avert about <b>${Math.round(share)}%</b> of that harm.`;

  const owned = Object.entries(settings.owned || {}).filter(([id, lv]) => lv > 0 && ITEM[id]);
  $('owned').innerHTML = owned.length
    ? 'Already have: ' + owned.map(([id, lv]) => {
      const it = ITEM[id];
      return `<span>${esc(it.name)}${it.ladder ? ` (${esc(it.ladder[lv - 1].label)})` : ''}<a data-unown="${id}" title="Remove">×</a></span>`;
    }).join('')
    : '';

  const maxRatio = Math.max(1, ...r.entries.map((e) => (isFinite(e.ratio) ? e.ratio : 0)));
  const barw = (x) => (x > 0 ? Math.max(2, Math.round(60 * Math.log10(1 + x) / Math.log10(1 + maxRatio))) : 0);
  let html = `<table><thead><tr><th class="cb" title="Tick what you already have">Have</th><th class="r">#</th><th>What</th><th class="r">Upfront</th><th class="r">Cost<br>a year</th><th class="r">Hardship<br>averted a year</th><th class="r">Micromorts<br>averted a year</th><th class="r">Benefit ÷ cost</th><th class="r" title="Share of plausible parameter sets under which benefit exceeds cost">Chance<br>it pays</th><th>Mostly for</th></tr></thead><tbody>`;
  r.entries.forEach((e, i) => {
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
    html += `<tr class="entry${i >= cutoff ? ' below' : ''}" data-key="${key}"><td class="cb"><input type="checkbox" data-own="${i}" title="I already have this"></td><td class="r">${i + 1}</td><td class="name" data-toggle="${key}">${entryName(e)}</td><td class="r">${whole(e.upfrontUsd)}</td><td class="r">${money(e.annualCostUsd)}</td><td class="r">${money(e.hardshipUsd)}</td><td class="r">${num(e.micromorts, e.micromorts >= 10 ? 0 : 2)}</td><td class="r"><span class="bar" style="width:${barw(e.ratio)}px"></span>${ratioText(e.ratio)}</td><td class="r">${s}</td><td>${mainText}</td></tr>`;
    if (open[key]) html += `<tr class="detail"><td colspan="10">${detail(e)}</td></tr>`;
  });
  html += '</tbody></table>';
  $('output').innerHTML = html;
  fit();
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
  $('p-time').placeholder = Number(result.timeValueUsdPerHour.toPrecision(3));
  hazardInputs();
  render();
  save();
  // The uncertainty pass runs in slices so the page stays responsive.
  const N = 120, SLICE = 12;
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
  setTimeout(step, 30);
}

function changed() {
  readControls();
  clearTimeout(timer);
  timer = setTimeout(compute, 120);
}

$('controls').addEventListener('change', (ev) => {
  const hz = ev.target.dataset && ev.target.dataset.hazard;
  if (hz) {
    settings.probabilities = settings.probabilities || {};
    if (ev.target.value === '') delete settings.probabilities[hz];
    else settings.probabilities[hz] = Math.min(1, Math.max(0, Number(ev.target.value) / 100));
  } else if (ev.target.id === 'outlook' || ev.target.id === 'location') {
    settings.probabilities = {};
  }
  changed();
});
$('controls').addEventListener('click', (ev) => {
  if (ev.target.id === 'reset') {
    settings = defaultSettings(DATA);
    open = {};
    controls();
    compute();
  }
});
$('controls').addEventListener('toggle', () => { settings.showHazards = $('haz-panel').open; save(); fit(); }, true);
$('output').addEventListener('click', (ev) => {
  const t = ev.target.closest('[data-toggle]');
  if (t) { open[t.dataset.toggle] = !open[t.dataset.toggle]; render(); }
});
$('output').addEventListener('change', (ev) => {
  const i = ev.target.dataset && ev.target.dataset.own;
  if (i === undefined) return;
  settings.owned = settings.owned || {};
  for (const [id, lv] of result.entries[Number(i)].add) settings.owned[id] = Math.max(settings.owned[id] || 0, lv);
  compute();
});
$('owned').addEventListener('click', (ev) => {
  const id = ev.target.dataset && ev.target.dataset.unown;
  if (!id) return;
  delete settings.owned[id];
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
