// The preparedness model engine. See MODEL.md for what it computes and why.
//
// It has no dependencies and runs unchanged in the browser and under Node.
// Entry points:
//   rank(data, settings)              the ordered list, on median parameters
//   robustness(data, settings, order) how sure each entry's ratio is
//   defaultSettings(data)

const Z95 = 1.6448536269514722;
const Z90 = 1.2815515655446004;
const Z99 = 2.3263478740408408;

// ---------------------------------------------------------------------------
// Numbers with uncertainty
// ---------------------------------------------------------------------------

export function isTriple(x) {
  return x !== null && typeof x === 'object' && typeof x.lo === 'number'
    && typeof x.mid === 'number' && typeof x.hi === 'number';
}

// Value of a {lo, mid, hi} triple at standard-normal deviate z. lo and hi are
// the 5th and 95th percentiles. Positive quantities are spread on a log scale,
// separately on each side of the median; quantities that can be zero are
// spread linearly. An optional `max` caps the result (shares, probabilities).
export function drawTriple(t, z) {
  let v = t.mid;
  if (z !== 0) {
    const zz = Math.max(-2.5, Math.min(2.5, z)) / Z95;
    if (t.lo > 0 && t.mid > 0) {
      v = t.mid * Math.exp(zz * (zz > 0 ? Math.log(t.hi / t.mid) : Math.log(t.mid / t.lo)));
    } else {
      v = Math.max(0, t.mid + zz * (zz > 0 ? t.hi - t.mid : t.mid - t.lo));
    }
  }
  return t.max !== undefined ? Math.min(t.max, v) : v;
}

// The average of a triple under the same spread: what the quantity is worth
// in expectation. For a quantity whose high end lies far above its middle,
// this is well above the middle.
export function meanTriple(t) {
  const n = 64;
  let sum = 0;
  for (let i = 0; i < n; i++) sum += drawTriple(t, normInv((i + 0.5) / n));
  return sum / n;
}

// Replace every triple in `data` by a number. `draw` returns a standard-normal
// deviate per parameter, or is null for medians; with `mean`, each triple is
// replaced by its average instead. The steps of one curve share a deviate, so
// a sampled curve keeps its shape.
export function resolveModel(data, draw, mean = false) {
  const walk = (node, shared) => {
    if (Array.isArray(node)) return node.map((x) => walk(x, shared));
    if (node === null || typeof node !== 'object') return node;
    if (isTriple(node)) {
      const v = mean ? meanTriple(node) : drawTriple(node, shared !== undefined ? shared : (draw ? draw() : 0));
      return 'fromDay' in node ? { fromDay: node.fromDay, v } : v;
    }
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      if (k === 'steps' && Array.isArray(v)) {
        const z = draw ? draw() : 0;
        out[k] = v.map((s) => walk(s, z));
      } else if (k === 'ai' && shared === undefined) {
        // One draw for every AI figure (section 9 of MODEL.md).
        out[k] = walk(v, draw ? draw() : 0);
      } else out[k] = walk(v, shared);
    }
    return out;
  };
  return walk(data, undefined);
}

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function normalFrom(rng) {
  return () => {
    const u = Math.max(1e-12, rng());
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
  };
}

// Inverse of the standard normal distribution function (Acklam's algorithm).
export function normInv(p) {
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  if (p < 0.02425) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p > 1 - 0.02425) return -normInv(1 - p);
  const q = p - 0.5;
  const r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

// A risk of death cannot exceed certainty. Micromorts added up over a long
// exposure are converted to the chance of dying at least once.
export const saturate = (micromorts) => 1e6 * (1 - Math.exp(-micromorts / 1e6));

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

// Severity strata: [quantile, weight]. Denser toward the severe end, where
// most of the harm is.
function makeStrata(segments) {
  const out = [];
  for (const [from, to, n] of segments) {
    const w = (to - from) / n;
    for (let i = 0; i < n; i++) out.push([from + (i + 0.5) * w, w]);
  }
  return out;
}
export const STRATA = makeStrata([[0, 0.5, 2], [0.5, 0.9, 4], [0.9, 0.99, 6], [0.99, 0.999, 4], [0.999, 1, 2]]);

// Length in days of a window at quantile u of its own distribution, from its
// 50th, 90th and 99th percentiles. Interpolates on a log scale against the
// normal deviate. Beyond the 99th percentile, which is as far as the research
// goes, the slope is extended only to one and a half times that percentile.
export function windowDays(d, u) {
  const z = normInv(u);
  const cap = Math.min(1095, 1.5 * d.p99);
  let v;
  if (d.p50 > 0) {
    const l50 = Math.log(d.p50), l90 = Math.log(Math.max(d.p90, d.p50)), l99 = Math.log(Math.max(d.p99, d.p90, d.p50));
    v = Math.exp(z <= Z90 ? l50 + (l90 - l50) * z / Z90 : l90 + (l99 - l90) * (z - Z90) / (Z99 - Z90));
  } else {
    v = z <= Z90 ? d.p90 * z / Z90 : d.p90 + (d.p99 - d.p90) * (z - Z90) / (Z99 - Z90);
  }
  return Math.max(0, Math.min(cap, v));
}

// Cumulative value of a step curve over the first `days` unmet days.
// steps: [{fromDay, v}], each rate applying from that day until the next step.
export function cumulative(steps, days) {
  let total = 0;
  for (let i = 0; i < steps.length; i++) {
    const from = steps[i].fromDay - 1;
    if (days <= from) break;
    const to = i + 1 < steps.length ? steps[i + 1].fromDay - 1 : Infinity;
    total += steps[i].v * (Math.min(days, to) - from);
  }
  return total;
}

// Days on which leaving is considered, counted from the earliest feasible day.
const LEAVE_OFFSETS = [0, 1, 2, 4, 7, 14, 30, 90];
const J = LEAVE_OFFSETS.length + 1; // option 0 is "stay"

const AGES = ['age75plus', 'age60to74', 'adult', 'child'];
const FLAGS = ['powerDependent', 'criticalDrug', 'limitedMobility'];
export const AGE_LABELS = { child: 'under 15', adult: '15–59', age60to74: '60–74', age75plus: '75 or over' };

// The members of the household. Settings give them one by one (`people`);
// older settings give counts (`household`), which are turned into people.
export function peopleOf(settings) {
  let list;
  if (Array.isArray(settings.people) && settings.people.length) {
    list = settings.people.map((p) => {
      const age = AGES.includes(p.age) ? p.age : 'adult';
      return {
        ...p, age,
        flags: {
          powerDependent: !!p.powerDependent, criticalDrug: !!p.criticalDrug, limitedMobility: !!p.limitedMobility,
          onMedication: !!(p.onMedication || p.criticalDrug), infant: age === 'child' && !!p.infant,
        },
      };
    });
  } else {
    const h = settings.household || {};
    const counts = { age75plus: h.age75plus || 0, age60to74: h.age60to74 || 0, adult: h.adults || 0, child: h.children || 0 };
    list = [];
    for (const age of AGES) for (let i = 0; i < counts[age]; i++) list.push({ age, flags: {} });
    // Conditions are assigned to the oldest members first.
    const mark = (flag, n) => { for (let i = 0; i < Math.min(list.length, n || 0); i++) list[i].flags[flag] = true; };
    for (const f of FLAGS) mark(f, h[f]);
    mark('onMedication', Math.max(h.onMedication || 0, h.criticalDrug || 0));
    // Infants are the youngest children.
    for (let i = 0; i < Math.min(counts.child, h.infants || 0); i++) list[list.length - 1 - i].flags.infant = true;
  }
  return list.map((p, index) => ({ ...p, index, key: p.id !== undefined ? String(p.id) : String(index + 1), label: p.name || `person ${index + 1}` }));
}

// Present value of one a year for n years at rate r.
export const annuity = (r, n) => (n <= 0 ? 0 : r > 0 ? (1 - Math.pow(1 + r, -n)) / r : n);

// What each member's death, hardship, lost work and time are worth, in
// dollars. Two standards (MODEL.md, section 7):
// - personal (the default): the value of a statistical life, scaled by the
//   member's hour value relative to the local default (income elasticity 1)
//   and, unless the reader asks for equal values, by remaining life-years;
// - impartial: what the member's work would achieve for others, discounted,
//   plus their own wellbeing priced at what it costs to produce wellbeing
//   elsewhere (the cost of saving a life through the most cost-effective
//   charities). Short disruptions then cost the work days they take.
export function valuePeople(people, ctx) {
  const { v, timeValue, rate, life, costPerLife, currentYear, horizonYears, automationYear, deathValue, hoursPerYear, counterfactual } = ctx;
  const lifeYears = deathValue !== 'equal' && life;
  const lyFactor = (age) => (lifeYears ? annuity(rate, life[age]) / annuity(rate, life.reference) : 1);
  for (const p of people) {
    const hour = p.hourValue > 0 ? p.hourValue : timeValue;
    const personal = v * lyFactor(p.age);
    if (p.valuation === 'impartial' && p.age !== 'child') {
      const rep = { adult: 37, age60to74: 67, age75plus: 82 }[p.age];
      // Their work matters to others until they retire (at 65, or in five
      // years at the least) or until full labour automation, if sooner.
      const retire = currentYear + Math.max(5, 65 - rep);
      const end = automationYear > 0 ? Math.min(retire, automationYear) : retire;
      const years = Math.max(0, Math.min(end - currentYear, life ? life[p.age] : Infinity));
      const hpy = p.hoursPerYear > 0 ? p.hoursPerYear : hoursPerYear;
      const cf = p.counterfactual >= 0 && p.counterfactual <= 1 ? p.counterfactual : counterfactual;
      p.v = 1e-6 * (hour * hpy * cf * annuity(rate, years) + costPerLife);
      p.hw = personal > 0 ? costPerLife / (1e6 * personal) : 0;
      // A day lost to a disruption is the average calendar day's work, at the
      // full hour value: nobody replaces a lost day. Days after the member's
      // impact ends are worth nothing, so only the share of the planning
      // horizon before that point counts.
      const share = Math.min(1, years / Math.max(1, horizonYears));
      p.dv = hour * hpy / 365 * share;
      p.impactEndYear = end;
      p.impartial = true;
    } else {
      p.v = personal * (hour / timeValue);
      p.hw = 1;
      p.dv = 0;
      p.impartial = false;
    }
    p.hv = hour;
  }
  return people;
}

function multiplier(mults, person, kind) {
  if (!mults) return 1;
  let x = 1;
  const a = mults[person.age];
  if (a && a[kind] !== undefined) x *= a[kind];
  for (const f of FLAGS) {
    if (person.flags[f] && mults[f] && mults[f][kind] !== undefined) x *= mults[f][kind];
  }
  return x;
}

function holds(condition, settings, people) {
  const s = settings;
  const any = (flag) => people.some((p) => p.flags[flag]);
  switch (condition) {
    case 'house': return s.dwelling === 'house';
    case 'apartment': return s.dwelling === 'apartment';
    case 'car': return !!s.car;
    case 'infant': return any('infant');
    case 'pet': return ((s.household && s.household.pets) || 0) > 0;
    case 'powerDependent': return any('powerDependent');
    case 'criticalDrug': return any('criticalDrug');
    case 'onMedication': return any('onMedication');
    case 'age60plus': return people.some((p) => p.age === 'age60to74' || p.age === 'age75plus');
    case 'livesAlone': return people.length === 1;
    case 'severalPeople': return people.length > 1;
    case 'airConditioning': return !!s.airConditioning;
    case 'noAirConditioning': return !s.airConditioning;
    case 'allElectric': return s.cooking !== 'gas' && s.heating !== 'gas';
    default: return !!(s.ticks && s.ticks[condition]);
  }
}

// A long outage is not cold, or hot, on every one of its days: at most one
// season's worth in each year it lasts.
const seasonDays = (days, season) => Math.min(days, season * Math.ceil(days / 365));

// What each raw window means for this household's needs. `win` holds the
// event's window lengths in days; `state` is 'cold', 'hot' or 'mild'.
function deriveGaps(win, state, settings) {
  const power = win.power || 0;
  const gas = win.gas || 0;
  const water = win.water || 0;
  const food = win.food || 0;
  // In a building that pumps its water, the tap fails with the grid; the
  // household can buy water once shops are reachable, a day after they open.
  const pumped = settings.pumpedWater ? Math.min(power, food + 1) : 0;
  const tap = Math.max(water, pumped);
  let heatLoss = 0;
  if (state === 'cold') {
    if (settings.heating === 'electric') heatLoss = power;
    else if (settings.heating === 'gas') heatLoss = Math.max(power, gas);
    heatLoss = seasonDays(heatLoss, 120);
  }
  let cooling = 0;
  if (state === 'hot') {
    const heat = win.heat !== undefined ? win.heat : seasonDays(power, 90);
    cooling = settings.airConditioning ? Math.min(power, heat) : (win.heat || 0);
  }
  return {
    water: tap,
    shareTreatable: tap > 0 ? (win.shareTreatable || 0) * water / tap : 0,
    food,
    cookOut: settings.cooking === 'gas' ? gas : power,
    warmth: heatLoss,
    cooling,
    power,
    comms: win.comms || 0,
    medication: win.medication || 0,
    emergencyCare: win.emergencyCare || 0,
    sanitation: Math.max(win.sanitation || 0, settings.pumpedWater ? power : 0),
    payments: win.payments || 0,
  };
}

function crf(r, years) {
  if (!(years > 0)) return 1;
  return r > 0 ? r / (1 - Math.pow(1 + r, -years)) : 1 / years;
}

// ---------------------------------------------------------------------------
// Advanced AI and the hazard probabilities
// ---------------------------------------------------------------------------
//
// The reader gives one year: their point estimate of full labour
// automation. For each AI-driven hazard the data gives yearly rates `now`,
// `transition` and `after`, each a low, middle and high figure (a careful
// sceptic, the central view, a highly concerned view). Like every uncertain
// input they are resolved by their averages or middles, or drawn; all AI
// figures share one draw, since a sceptic about one effect is a sceptic
// about the others.
// The rate is `now` until a run-up; the excess then grows linearly to its
// full level, which holds through the turbulent years just before automation;
// after automation the rate is `after`. The excess is scaled by a factor that
// depends on the lead time, the years left to prepare
// (research/ai/ai-leadtime.*): the sooner automation comes, the more
// turbulence. The model's own probabilities are today's, and each is shifted
// by the average over the planning horizon of this path, less today's rate.

const aiOn = (ai, settings) => !!(ai && settings.ai && settings.ai.automationYear > 0);

// A lead-time factor at lead time L, from values at the lead times `leads`:
// straight lines between them, flat beyond the ends. Without research, 1.
export function leadFactor(leads, values, L) {
  if (!leads || !values || !values.length) return 1;
  if (L <= leads[0]) return values[0];
  for (let i = 1; i < leads.length; i++) {
    if (L <= leads[i]) return values[i - 1] + (values[i] - values[i - 1]) * (L - leads[i - 1]) / (leads[i] - leads[i - 1]);
  }
  return values[values.length - 1];
}

// The timing of the transition: full automation in the middle of the year
// given, the turbulent years before it, and the run-up before those.
export function aiTiming(ai, settings) {
  const lt = ai.leadTime || {};
  const A = settings.ai.automationYear + 0.5;
  const T = lt.turbulentYears > 0 ? lt.turbulentYears : ai.transitionYears;
  const R = lt.runUpYears > 0 ? lt.runUpYears : 0;
  return { A, T, R, L: Math.max(0, A - ai.startYear), H: Math.max(1, Math.round(settings.ai.horizonYears || ai.horizonYears)) };
}

// The share of the full excess reached at time y: 0 before the run-up, rising
// linearly through it, 1 in the turbulent years, and null once automation has
// come.
export function excessShare(y, { A, T, R }) {
  if (y >= A) return null;
  const turbulent = A - T;
  if (y >= turbulent) return 1;
  if (R > 0 && y >= turbulent - R) return (y - (turbulent - R)) / R;
  return 0;
}

// The shift in a hazard's annual probability.
export function aiShift(ai, settings, hazardId, loc) {
  if (!aiOn(ai, settings)) return 0;
  const spec = ai.hazards[hazardId];
  const r = spec && (spec[loc] || spec.all);
  if (!r) return 0;
  const tm = aiTiming(ai, settings);
  const lt = (ai.leadTime && ai.leadTime.hazards && ai.leadTime.hazards[hazardId]) || {};
  const leads = ai.leadTime && ai.leadTime.leads;
  const f = leadFactor(leads, lt.factors, tm.L);
  const fAfter = leadFactor(leads, lt.afterFactors, tm.L);
  const { now, transition: during, after } = r;
  const peak = Math.max(0, Math.min(1, now + (during - now) * f));
  let sum = 0;
  for (let k = 0; k < tm.H; k++) {
    const y = ai.startYear + k + 0.5; // the middle of each year of the horizon
    const x = excessShare(y, tm);
    sum += x === null ? Math.min(1, after * fAfter) : now + (peak - now) * x;
  }
  // Only the share of the added risk that a household could survive counts.
  return (sum / tm.H - now) * (r.survivable === undefined ? 1 : r.survivable);
}

// The chance, averaged over the planning horizon, that no existential
// catastrophe has happened yet. Nothing a household owns is worth anything
// after one, so every hazard's weight is scaled by this. The chance of such
// a catastrophe, scaled by its lead-time factor, is spread evenly over the
// turbulent years.
export function aiSurvival(ai, settings) {
  if (!aiOn(ai, settings) || !ai.pExistential) return 1;
  const tm = aiTiming(ai, settings);
  const ex = ai.leadTime && ai.leadTime.existential;
  const pX = Math.min(1, ai.pExistential * leadFactor(ai.leadTime && ai.leadTime.leads, ex, tm.L));
  let sum = 0;
  for (let k = 0; k < tm.H; k++) {
    const y = ai.startYear + k + 0.5;
    const elapsed = Math.max(0, Math.min(1, (y - (tm.A - tm.T)) / tm.T));
    sum += 1 - pX * elapsed;
  }
  return sum / tm.H;
}

// ---------------------------------------------------------------------------
// The world: one resolved model applied to one household
// ---------------------------------------------------------------------------

export function buildWorld(m, settings) {
  const P = m.parameters;
  const loc = settings.location;
  const over = settings.parameters || {};
  // A country with figures of its own replaces some of the preset's
  // (data/countries.mjs, research/countries/).
  const country = settings.country && m.countries && m.countries[settings.country] ? m.countries[settings.country].values : null;
  const cv = (field) => (country && country[field] !== undefined && country[field] !== null ? country[field] : undefined);
  const pick = (id) => {
    if (over[id] !== undefined && over[id] !== null) return over[id];
    if (cv(id) !== undefined) return cv(id);
    const x = P[id];
    return x !== null && typeof x === 'object' ? (x[loc] !== undefined ? x[loc] : x[settings.dwelling]) : x;
  };
  const v = pick('micromortValueUsd');
  const timeValue = pick('timeValueUsdPerHour');
  const rate = pick('realDiscountRate');
  const storage = pick('storageCostUsdPerLitreYear');
  const priceIndex = pick('priceIndex') || 1;
  const homePresence = pick('homePresence') === undefined ? 1 : pick('homePresence');
  const leaveHardship = pick('leaveHardshipUsdPerPersonDay') || 0;

  const people = peopleOf(settings);
  const nPeople = people.length;
  const NP1 = nPeople + 1; // per-person slots, then one for the household as a whole
  const useAiTimeline = aiOn(m.ai, settings);
  valuePeople(people, {
    v, timeValue, rate,
    // Remaining life expectancy by age band, where the data give it.
    life: m.lifeExpectancy && m.lifeExpectancy.reference > 0 ? m.lifeExpectancy : null,
    costPerLife: pick('costPerLifeSavedUsd') || 0,
    currentYear: m.currentYear || 2026,
    horizonYears: Math.max(1, Math.round((settings.ai && settings.ai.horizonYears) || (m.ai && m.ai.horizonYears) || 5)),
    automationYear: useAiTimeline ? settings.ai.automationYear : 0,
    deathValue: settings.deathValue || 'lifeYears',
    hoursPerYear: pick('hoursPerYear') || 1800,
    counterfactual: pick('counterfactualShare') === undefined ? 0.5 : pick('counterfactualShare'),
  });
  // Time spent on something the household shares is taken to be spent by
  // the member whose hour is valued least; on something one member owns, by
  // that member.
  const grown = people.filter((p) => p.age !== 'child');
  const sharedHour = Math.min(...(grown.length ? grown : people).map((p) => p.hv));
  // The holder of a skill (first aid, CPR): the first member aged 15–59, or
  // the first member.
  const holder = Math.max(0, people.findIndex((p) => p.age === 'adult'));

  // ---- needs ----
  const needIds = Object.keys(m.needs);
  const K = needIds.length;
  const needIndex = Object.fromEntries(needIds.map((id, k) => [id, k]));
  const needs = needIds.map((id) => {
    const n = m.needs[id];
    // A need may apply to some people only, or to some households only.
    const who = n.if && !holds(n.if, settings, people) ? [] : people.filter((p) => !n.who || n.who === 'all' || p.flags[n.who]);
    let baseline = (n.baselineIf || []).reduce((b, x) => (holds(x.if, settings, people) ? Math.max(b, x.days) : b), n.baselineDays || 0);
    // The reader may say how much they hold already (food in the kitchen).
    if (n.baselineSetting && settings[n.baselineSetting] !== undefined && settings[n.baselineSetting] !== null) baseline = Number(settings[n.baselineSetting]);
    const perHousehold = n.per === 'household';
    const workLoss = n.workLoss || 0;
    // Each member's weights: hardship (in dollars per dollar of the curve),
    // mortality multiplier, value of a micromort, and lost work per unmet day.
    const members = who.map((p) => ({
      i: p.index,
      h: perHousehold ? 0 : multiplier(n.multipliers, p, 'hardship') * p.hw,
      x: multiplier(n.multipliers, p, 'mortality'),
      v: p.v,
      d: p.dv * workLoss,
      w: p.dv > 0 ? workLoss : 0,
    }));
    // A need of the household as a whole is felt once.
    if (perHousehold && members.length) members[0].h = (grown.length ? grown : people).reduce((s, p) => s + p.hw, 0) / (grown.length || people.length);
    const slot = new Int32Array(nPeople).fill(-1);
    members.forEach((x, j) => { slot[x.i] = j; });
    const cap = n.lateMultiplierCap;
    return {
      id,
      spec: n,
      count: who.length,
      members, slot,
      H: members.reduce((s, x) => s + x.h, 0),
      D: members.reduce((s, x) => s + x.d, 0),
      VX: members.reduce((s, x) => s + x.v * x.x, 0),
      VXcap: members.reduce((s, x) => s + x.v * (cap ? Math.min(x.x, cap) : x.x), 0),
      V: members.reduce((s, x) => s + x.v, 0),
      demandPer: n.demandPerPersonDay !== undefined ? n.demandPerPersonDay : (n.demandPerHouseholdDay || 1),
      // A member valued for their work runs a laptop as well as a phone.
      demand: n.demandPerPersonDay !== undefined
        ? who.reduce((s, p) => s + (p.dv > 0 && n.workerDemandPerPersonDay ? n.workerDemandPerPersonDay : n.demandPerPersonDay), 0)
        : (n.demandPerHouseholdDay || 1),
      leaveEnds: n.leaveEnds !== false,
      home: n.home !== false,
      personal: false,
      baseline,
    };
  });

  const channelIds = Object.keys(m.channels || {});
  const channelIndex = Object.fromEntries(channelIds.map((id, c) => [id, c]));

  // ---- hazards and events ----
  const hazardIds = Object.keys(m.hazards);
  const survival = aiSurvival(m.ai, settings);
  const useAi = aiOn(m.ai, settings);
  const hazards = [];
  const ev = { hz: [], w: [], gaps: [], cookOut: [], powerOut: [], share: [] };
  hazardIds.forEach((id) => {
    // A hazard may unfold differently in different places.
    const base = m.hazards[id];
    const h = base.byLocation && base.byLocation[loc] ? { ...base, ...base.byLocation[loc] } : base;
    if (h.tickBox && !(settings.ticks && settings.ticks[h.tickBox])) return;
    let p;
    const custom = settings.probabilities && settings.probabilities[id];
    if (custom !== undefined && custom !== null) p = custom;
    else {
      // Where the AI research gives rates for a hazard and a timeline is
      // chosen, the timeline replaces the pessimistic outlook, which was
      // built on the same forecasts.
      const outlook = useAi && m.ai.hazards[id] ? 'forecast' : settings.outlook;
      const byLoc = h.probability[loc] !== undefined ? h.probability[loc] : h.probability.all;
      p = byLoc === undefined ? 0 : (typeof byLoc === 'object' ? (byLoc[outlook] !== undefined ? byLoc[outlook] : byLoc.all) : byLoc);
      // A local hazard rated medium for the district counts at a fraction
      // of a zone's probability (data/config.mjs, cityRules).
      if (h.tickBox && settings.tickScale && settings.tickScale[h.tickBox] !== undefined) p *= settings.tickScale[h.tickBox];
      const own = cv(`${id}.probability`) !== undefined ? cv(`${id}.probability`) : cv(`${id}.${outlook}`);
      if (own !== undefined) p = own;
      p = Math.max(0, Math.min(1, (p || 0) + aiShift(m.ai, settings, id, loc)));
    }
    if (!(p > 0)) return;
    const late = h.lateBuy && (h.warningDays || 0) >= 0.5 ? h.lateBuy : { staple: 0, specialty: 0 };
    const es = h.exposureScale || {};
    let xScale = es.dwelling && es.dwelling[settings.dwelling] !== undefined ? es.dwelling[settings.dwelling] : 1;
    for (const c of es.conditions || []) if (holds(c.if, settings, people)) xScale *= c.factor;
    // Work lost to illness or to dealing with a loss does not follow the
    // differences in death rates between places that the location factor
    // carries.
    const workScale = xScale;
    xScale *= cv(`${id}.scale`) !== undefined ? cv(`${id}.scale`) : (es.location && es.location[loc] !== undefined ? es.location[loc] : 1);
    const wd = h.workDays || null;
    // Where leaving is held up by roads, fuel and transport, time brings a
    // way out; where few can leave because there is nowhere better to go
    // (a nuclear war, a pandemic), it does not.
    const half = h.leave && h.leave.halfLifeDays !== undefined ? h.leave.halfLifeDays : (h.leave && h.leave.feasible >= 0.3 ? 10 : 0);
    const hz = {
      id, index: hazards.length, p, pw: p * survival, spec: h,
      late: { staple: late.staple || 0, specialty: late.specialty || 0, none: 0 },
      feasible: h.leave ? h.leave.feasible : 0,
      earliest: h.leave ? h.leave.earliestDay : 0,
      leaveFixed: h.leave ? h.leave.fixedUsdPerHousehold : 0,
      leavePerDay: h.leave ? (h.leave.usdPerPersonDay + leaveHardship) * nPeople : 0,
      // Those who cannot leave at first find a way as time passes: the share
      // still stuck halves every `half` days.
      halfLife: half > 0 && isFinite(half) ? half : 0,
      scale: h.needScale || {},
      exposures: (h.exposures || []).map((x, xi) => {
        const ch = (m.channels || {})[x.channel] || {};
        const mults = { ...(ch.multipliers || {}), ...(x.multipliers || {}) };
        const byL = x.micromortsPerPersonByLocation || {};
        let perPerson = byL[loc] !== undefined ? byL[loc] : (x.micromortsPerPerson || 0);
        // A country's own fallout figure is relative to the United States.
        if (x.channel === 'fallout' && cv(`${id}.falloutScale`) !== undefined) perPerson = (byL.us !== undefined ? byL.us : (x.micromortsPerPerson || 0)) * cv(`${id}.falloutScale`);
        // Lost work goes with the first exposure on the hazard's work channel.
        const work = wd && wd.channel === x.channel && (h.exposures || []).findIndex((y) => y.channel === wd.channel) === xi ? workScale * (wd.days || 0) : 0;
        return {
          c: channelIndex[x.channel],
          mmBase: xScale * perPerson,
          mm: people.map((q) => multiplier(mults, q, 'mortality')),
          // Hardship per person, by member; money lost, by household.
          hard: (x.hardshipUsdPerPerson || 0) ? people.map((q) => xScale * x.hardshipUsdPerPerson * multiplier(mults, q, 'hardship') * q.hw) : null,
          fin: xScale * (x.financialUsdPerHousehold || 0),
          work,
          workOnMortality: x.channel === 'infection' || x.channel === 'seasonalInfection',
        };
      }),
    };
    hazards.push(hz);
    let cold = settings.ticks && settings.ticks.coldWinters ? (h.coldShare || 0) : 0;
    let hot = settings.ticks && settings.ticks.hotSummers ? (h.hotShare || 0) : 0;
    if (cold + hot > 1) { const t = cold + hot; cold /= t; hot /= t; }
    const states = [['mild', 1 - cold - hot], ['cold', cold], ['hot', hot]];
    const scale = (h.durationScale === undefined ? 1 : h.durationScale) * (cv(`${id}.durationFactor`) !== undefined ? cv(`${id}.durationFactor`) : 1);
    // Being forced out of the home is its own branch of each event: it may
    // or may not happen however severe the event, and when it does, what is
    // stored at home is out of reach for as long as it lasts.
    const dw = (h.windows || {}).displacement;
    const pOut = dw ? Math.max(0, Math.min(1, dw.pOccur)) : 0;
    for (const [state, ws] of states) {
      if (!(ws > 1e-9)) continue;
      for (const [q, wq] of STRATA) {
        const win = {};
        for (const [wid, w] of Object.entries(h.windows || {})) {
          if (wid === 'displacement') continue;
          const pOccur = w.pOccur;
          if (!(pOccur > 0) || q <= 1 - pOccur) continue;
          win[wid] = scale * windowDays(w.days, (q - (1 - pOccur)) / pOccur);
          if (wid === 'water') win.shareTreatable = w.shareTreatable || 0;
        }
        const g = deriveGaps(win, state, settings);
        for (const [pBranch, D] of [[1 - pOut, 0], [pOut, pOut > 0 ? scale * windowDays(dw.days, q) : 0]]) {
          if (!(pBranch > 1e-12)) continue;
          const row = new Float64Array(K);
          needs.forEach((n, k) => {
            if (n.count === 0) return;
            if (n.spec.gap === 'displacement') row[k] = D;
            else if (n.spec.gap === 'dataAccess') {
              // Own files and computer: out of reach on a share of the days
              // without internet, when an account is locked or a device
              // wiped, and for a while when the household is displaced.
              const A = n.spec.access || {};
              row[k] = Math.max(win.dataAccess || 0, (A.commsShare || 0) * (g.comms || 0), Math.min(A.displacedCapDays || 0, (A.displacedShare || 0) * D));
            } else { const raw = g[n.spec.gap] || 0; row[k] = n.home ? Math.max(0, raw - D) : raw; }
          });
          ev.hz.push(hz.index);
          ev.w.push(hz.pw * ws * wq * pBranch * homePresence);
          ev.gaps.push(row);
          ev.cookOut.push(Math.max(0, g.cookOut - D));
          ev.powerOut.push(Math.max(0, g.power - D));
          ev.share.push(g.shareTreatable);
        }
      }
    }
  });
  const E = ev.hz.length;

  // Leave options per event.
  const Lopt = new Float64Array(E * J).fill(Infinity);
  const leaveCost = new Float64Array(E * J);
  // Options in use per event: "stay", then the leave days, which fill a prefix.
  const nOpt = new Uint8Array(E).fill(1);
  // Share of those unable to leave at first who are still stuck on each
  // leave day.
  const stuckBy = new Float64Array(E * J).fill(1);
  const active = [];
  for (let e = 0; e < E; e++) {
    const hz = hazards[ev.hz[e]];
    const row = ev.gaps[e];
    const act = [];
    let T = 0;
    for (let k = 0; k < K; k++) {
      if (row[k] > 0) { act.push(k); if (needs[k].leaveEnds) T = Math.max(T, row[k]); }
    }
    active.push(act);
    if (hz.feasible > 0) {
      LEAVE_OFFSETS.forEach((off, i) => {
        const L = hz.earliest + off;
        if (L < T) {
          Lopt[e * J + i + 1] = L;
          leaveCost[e * J + i + 1] = hz.leaveFixed + hz.leavePerDay * (T - L);
          stuckBy[e * J + i + 1] = hz.halfLife ? Math.pow(0.5, off / hz.halfLife) : 1;
          nOpt[e] = i + 2;
        }
      });
    }
  }

  // ---- items ----
  const leaveFx = [];
  let review = null;
  const capProviders = {};
  const capFuel = {};
  const suppliers = needs.map(() => []);
  const needReducers = needs.map(() => []);
  const chanReducers = channelIds.map(() => []);
  const capNeeds = { cook: ['food'], campStove: ['food'], treatWater: ['water'] };

  // An item marked `perPerson` is offered once for each member it suits
  // (`perPersonWho`: only those with a stated condition), and each copy acts
  // on its owner alone. Its id is the item's id, "@", and the member's key.
  const specs = [];
  for (const it of m.items) {
    if (!it.perPerson) { specs.push({ it, person: undefined }); continue; }
    for (const p of people) if (!it.perPersonWho || p.flags[it.perPersonWho]) specs.push({ it, person: p.index });
  }
  const items = specs.map(({ it, person }, i) => {
    const owner = person === undefined ? null : people[person];
    const applicable = (it.conditions || []).every((c) => holds(c, settings, people));
    const ladder = it.ladder && it.ladder.length ? it.ladder : null;
    // Units are per person for items that scale with people: everyone, or
    // only those with a stated condition (the people on medication, say).
    const scale = owner ? 1 : it.scalesWith === 'person'
      ? Math.max(1, it.scalesWho ? people.filter((p) => p.flags[it.scalesWho]).length : nPeople)
      : 1;
    const life = it.lifeYears;
    const e = it.everydayShare || 0;
    const capital = (1 - e) * crf(rate, life) + e * rate;
    // Cash is priced in dollars everywhere, and its cost is given whole as
    // upkeep, so it carries no price index and no charge for capital.
    const unitUsd = it.price * (it.capitalFree ? 1 : priceIndex);
    const perUnitCapital = it.capitalFree ? 0 : unitUsd * capital;
    const perUnit = perUnitCapital + (it.upkeepUsdPerUnitYear || 0) + (it.volumeLitres || 0) * storage;
    // A fixed price is paid once, with the first level (a heater, as against
    // the fuel that is the item's ladder), and once for all the members'
    // copies of a personal item (the kit for checking a mask's fit).
    const fixedUsd = (it.fixedPrice || 0) * priceIndex;
    // Time: setting up (spread over the item's life, or longer where the
    // set-up outlasts the stock), and upkeep. Charged per person where each
    // person must spend it; and, like money upkeep, cut by the everyday
    // share where the upkeep is itself everyday use. An hour is the owner's,
    // or for shared things that of the member whose hour is valued least.
    const hourUsd = (owner ? owner.hv : sharedHour) * (it.hoursPerPerson ? scale : 1);
    const upkeepShare = it.everydayUpkeep ? 1 - e : 1;
    // The running cost in its three parts, for the item's details.
    const runningParts = {
      setupTime: (it.setupHours || 0) * crf(rate, it.setupLifeYears || life) * hourUsd * upkeepShare,
      upkeepTime: (it.upkeepHoursPerYear || 0) * hourUsd * upkeepShare,
      money: (it.upkeepUsdPerYear || 0) * upkeepShare,
    };
    const running = runningParts.setupTime + runningParts.upkeepTime + runningParts.money;
    const item = {
      i, id: owner ? `${it.id}@${owner.key}` : it.id, baseId: it.id, person, spec: it, applicable, ladder, scale,
      maxLevel: ladder ? ladder.length : 1,
      unitsAt: (level) => (level <= 0 ? 0 : (ladder ? ladder[Math.min(level, ladder.length) - 1].units : 1)),
      lateLevel: it.lateBuyLevel === undefined ? 1 : it.lateBuyLevel,
      // Of the households that could buy it late, the share that would.
      lateUptake: it.lateUptake === undefined ? 1 : it.lateUptake,
      reliability: it.reliability === undefined ? 1 : it.reliability,
      lateClass: it.lateBuyClass || 'none',
      requires: it.requires || [],
      unitUsd, perUnit, perUnitCapital, fixedCapital: fixedUsd * capital, running, runningParts, fixedUsd,
      siblings: [],
      setupHours: (it.setupHours || 0) * (it.hoursPerPerson ? scale : 1),
      upkeepHours: (it.upkeepHoursPerYear || 0) * (it.hoursPerPerson ? scale : 1),
      leave: false,
      needSet: new Set(),
      chanSet: new Set(),
      sideRisks: [],
      annual: null,
    };
    if (!applicable) return item;
    for (const fx of it.effects || []) {
      if (fx.type === 'supply' && fx.capability) {
        // Fuel for a capability, in days: hours of stove burn, say, over the
        // hours a day the household uses.
        const perDay = fx.perPersonDay ? fx.perPersonDay * Math.max(1, nPeople) : (fx.perDay || 1);
        (capFuel[fx.capability] ||= []).push({ i, days: fx.amount / perDay });
        for (const nid of capNeeds[fx.capability] || []) if (nid in needIndex) item.needSet.add(needIndex[nid]);
      } else if (fx.type === 'supply') {
        const k = needIndex[fx.need];
        if (k === undefined || needs[k].count === 0) continue;
        if (owner) {
          // A member's own stock covers that member's days only.
          if (needs[k].slot[person] < 0) continue;
          suppliers[k].push({ i, days: fx.amount / needs[k].demandPer, pool: 'main', renew: !!fx.renewable, person });
          needs[k].personal = true;
        } else suppliers[k].push({ i, days: fx.amount * scale / needs[k].demand, pool: fx.pool || 'main', renew: !!fx.renewable });
        item.needSet.add(k);
      } else if (fx.type === 'capability') {
        (capProviders[fx.capability] ||= []).push(i);
        for (const nid of capNeeds[fx.capability] || []) if (nid in needIndex) item.needSet.add(needIndex[nid]);
      } else if (fx.type === 'reduce') {
        // `othersOnly`: the item protects everyone but the member who holds
        // it (someone trained in CPR cannot resuscitate themselves).
        const adj = fx.adherence === undefined ? 1 : fx.adherence;
        const red = {
          i, f: (fx.fraction || 0) * adj, on: fx.on || 'both', group: fx.group || null,
          person: owner ? person : undefined,
          work: !!fx.work,
          exclude: fx.othersOnly ? holder : undefined,
          // A fraction that grows with the level owned (deeper stocks).
          byLevel: fx.fractionByLevel ? fx.fractionByLevel.map((x) => x * adj * (fx.levelScale === undefined ? 1 : fx.levelScale)) : null,
          hazards: !fx.hazards || fx.hazards.includes('all') ? null : new Set(fx.hazards),
        };
        if (fx.othersOnly && people.length < 2) continue;
        if (fx.target in needIndex) {
          needReducers[needIndex[fx.target]].push(red);
          item.needSet.add(needIndex[fx.target]);
        } else if (fx.target in channelIndex) {
          chanReducers[channelIndex[fx.target]].push(red);
          item.chanSet.add(channelIndex[fx.target]);
        }
      } else if (fx.type === 'sideRisk') {
        const k = needIndex[fx.need];
        if (k !== undefined) item.sideRisks.push({ k, c: channelIndex[fx.channel], mm: fx.micromortsPerDay });
      } else if (fx.type === 'leave') {
        // Makes leaving likelier to be possible, or cheaper.
        leaveFx.push({
          i, feasible: fx.feasible || 0, cost: fx.cost || 0,
          hazards: !fx.hazards || fx.hazards.includes('all') ? null : new Set(fx.hazards),
        });
        item.leave = true;
      } else if (fx.type === 'annualRisk') {
        // A risk of owning the thing at all, every year (a firearm at home):
        // one figure for the owner, one for each other adult, one per child.
        // The owner is the holder (see above).
        const own = fx.micromortsOwner !== undefined ? fx.micromortsOwner : (fx.micromortsPerPersonYear || 0);
        const other = fx.micromortsOtherAdult !== undefined ? fx.micromortsOtherAdult : (fx.micromortsPerPersonYear || 0);
        const child = fx.micromortsChild !== undefined ? fx.micromortsChild : (fx.micromortsPerPersonYear || 0);
        const risk = people.map((p) => (p.index === holder ? own : p.age === 'child' ? child : other));
        item.annual = { mm: risk.reduce((a, b) => a + b, 0), mmv: risk.reduce((a, r, j) => a + r * people[j].v, 0), usd: fx.usdPerHouseholdYear || 0 };
      } else if (fx.type === 'review') {
        // Practice makes every other item likelier to work when needed.
        review = { i, factor: fx.failureFactor };
      }
    }
    return item;
  });
  // The members' copies of one personal item.
  for (const it of items) if (it.person !== undefined) it.siblings = items.filter((x) => x.baseId === it.baseId && x !== it).map((x) => x.i);
  // An item that requires a capability is touched by whatever provides it.
  for (const it of items) {
    for (const cap of it.requires) {
      for (const p of capProviders[cap] || []) {
        for (const k of it.needSet) items[p].needSet.add(k);
        for (const c of it.chanSet) items[p].chanSet.add(c);
      }
    }
  }
  // Practice touches everything.
  if (review) {
    const it = items[review.i];
    needs.forEach((_, k) => it.needSet.add(k));
    channelIds.forEach((_, c) => it.chanSet.add(c));
  }
  // Whatever reduces a channel also reduces the side risks on that channel.
  for (const it of items) {
    for (const s of it.sideRisks) for (const r of chanReducers[s.c] || []) items[r.i].needSet.add(s.k);
  }
  const sideRiskOf = needs.map((_, k) => items.filter((it) => it.sideRisks.some((s) => s.k === k)));

  const eventsOfNeed = needs.map((_, k) => {
    const list = [];
    for (let e = 0; e < E; e++) if (ev.gaps[e][k] > 0) list.push(e);
    return list;
  });
  function eventsOf(needSet) {
    if (needSet.size === 1) return eventsOfNeed[[...needSet][0]];
    const seen = new Uint8Array(E);
    const list = [];
    for (const k of needSet) for (const e of eventsOfNeed[k]) if (!seen[e]) { seen[e] = 1; list.push(e); }
    return list;
  }
  const leaveEvents = [];
  for (let e = 0; e < E; e++) if (nOpt[e] > 1) leaveEvents.push(e);
  function eventsFor(needSet, leave) {
    const list = eventsOf(needSet);
    if (!leave) return list;
    const seen = new Uint8Array(E);
    const out = [];
    for (const e of list) { seen[e] = 1; out.push(e); }
    for (const e of leaveEvents) if (!seen[e]) out.push(e);
    return out;
  }
  for (const it of items) it.events = eventsFor(it.needSet, it.leave);

  // ---- what the household has, in expectation ----
  //
  // An owned item works with its reliability. Whether owned or not, a
  // household with warning may buy it late: the hazard says how likely the
  // shops still have it, the item how likely a household is to think of it.
  // Buying late what one already owns adds nothing.
  // These depend on the kit and the hazard, not on the event, and are asked
  // for thousands of times; they are kept until the kit changes.
  let version = 1;
  const nH = hazards.length;
  const memo = (size) => ({ v: new Float64Array(size), s: new Int32Array(size) });
  const unitsMemo = memo(items.length * nH), haveMemo = memo(items.length * nH), worksMemo = memo(items.length * nH);
  const personalList = (list) => list.some((r) => r.person !== undefined || r.exclude !== undefined);
  needReducers.forEach((list, k) => { list.id = k; list.personal = personalList(list); });
  chanReducers.forEach((list, c) => { list.id = K + c; list.personal = personalList(list); });
  const EMPTY = [];
  // Shares of a harm that remain after the items acting on it: for each list
  // of reducers, kind of harm and hazard, one per member and, last, one for
  // the household as a whole (money, which no member's own item touches).
  // keepOf returns where they start in KV; the final block is all ones.
  // Kinds of harm a reducer may act on: hardship, mortality, and lost work.
  // Lost work falls only with items that let a member work (`work: true`):
  // a radio eases a day without news but does not restore the internet.
  const KINDS = { hardship: 0, mortality: 1, work: 2 };
  const nKeep = (K + channelIds.length) * 3 * nH;
  const KV = new Float64Array((nKeep + 1) * NP1);
  const ONE = nKeep * NP1;
  KV.fill(1, ONE);
  const keepStamp = new Int32Array(nKeep);
  function reliabilityOf(it, level) {
    if (level[it.i] <= 0) return 0;
    if (review && review.i !== it.i && !it.spec.noReview && level[review.i] > 0) {
      const works = items[review.i].reliability;
      return 1 - (1 - it.reliability) * (1 - works * (1 - review.factor));
    }
    return it.reliability;
  }
  const lateP = (it, hz) => (it.applicable ? hz.late[it.lateClass] * it.lateUptake : 0);
  function pHave(it, level, hz) {
    const key = it.i * nH + hz.index;
    if (haveMemo.s[key] === version) return haveMemo.v[key];
    const r = reliabilityOf(it, level), pl = lateP(it, hz);
    haveMemo.s[key] = version;
    return (haveMemo.v[key] = r + (1 - r) * pl);
  }
  function unitsIn(it, level, hz) {
    const key = it.i * nH + hz.index;
    if (unitsMemo.s[key] === version) return unitsMemo.v[key];
    const r = reliabilityOf(it, level), pl = lateP(it, hz);
    const uo = it.unitsAt(level[it.i]), ul = it.unitsAt(it.lateLevel);
    unitsMemo.s[key] = version;
    return (unitsMemo.v[key] = r * (pl * Math.max(uo, ul) + (1 - pl) * uo) + (1 - r) * pl * ul);
  }
  function pCap(cap, level, hz) {
    let none = 1;
    for (const i of capProviders[cap] || []) none *= 1 - pHave(items[i], level, hz);
    return 1 - none;
  }
  function pWorks(it, level, hz) {
    if (!it.requires.length) return 1;
    const key = it.i * nH + hz.index;
    if (worksMemo.s[key] === version) return worksMemo.v[key];
    let p = 1;
    for (const cap of it.requires) p *= pCap(cap, level, hz);
    worksMemo.s[key] = version;
    return (worksMemo.v[key] = p);
  }
  const fractionAt = (r, lv) => (r.byLevel ? (lv > 0 ? r.byLevel[Math.min(lv, r.byLevel.length) - 1] : 0) : r.f);
  // Expected share of a harm that remains for member t (or, with t = -1, for
  // the household as a whole) after the items acting on it.
  function keepOne(list, level, kind, hz, t) {
    let keep = 1;
    let groups = null;
    for (const r of list) {
      if (kind === 'work' ? !r.work : r.on !== 'both' && r.on !== kind) continue;
      if (r.hazards && !r.hazards.has(hz.id)) continue;
      if (r.person !== undefined && r.person !== t) continue;
      if (r.exclude !== undefined && r.exclude === t) continue;
      const it = items[r.i];
      if (!it.applicable) continue;
      const rel = reliabilityOf(it, level), pl = lateP(it, hz);
      const have = (rel + (1 - rel) * pl) * pWorks(it, level, hz);
      if (have <= 0) continue;
      const fo = fractionAt(r, level[it.i]), fl = fractionAt(r, it.lateLevel);
      const removed = (rel * (pl * Math.max(fo, fl) + (1 - pl) * fo) + (1 - rel) * pl * fl) * pWorks(it, level, hz);
      if (r.group) { groups ||= {}; (groups[r.group] ||= []).push([removed / have, have]); } else keep *= 1 - removed;
    }
    if (groups) {
      for (const g of Object.values(groups)) {
        // Within a group only the best item present counts.
        g.sort((a, b) => b[0] - a[0]);
        let none = 1, removed = 0;
        for (const [f, have] of g) { removed += none * have * f; none *= 1 - have; }
        keep *= 1 - removed;
      }
    }
    return keep;
  }
  function keepOf(list, level, kind, hz) {
    if (!list || !list.length) return ONE;
    const key = (list.id * 3 + KINDS[kind]) * nH + hz.index;
    const base = key * NP1;
    if (keepStamp[key] === version) return base;
    keepStamp[key] = version;
    if (!list.personal) KV.fill(keepOne(list, level, kind, hz, -1), base, base + NP1);
    else for (let t = 0; t < NP1; t++) KV[base + t] = keepOne(list, level, kind, hz, t === nPeople ? -1 : t);
    return base;
  }

  // Food. A household with F days of full rations facing a window of W days
  // does not eat normally and then starve: it stretches what it has. The
  // cheaper of two plans is taken: eat in full and then go without, or
  // ration (half rations while that lasts the window; else quarter rations;
  // else quarter rations and then nothing). Returns dollars per person, two
  // mortality sums (`a`, to which each person's multiplier applies in full,
  // and `b`, the part of a long fast on which age adds less), and the days
  // without food, which cost work.
  const plan = { usd: 0, a: 0, b: 0, fast: 0 };
  function foodPlan(n, W, F) {
    const spec = n.spec;
    const fast = (d, out) => {
      if (d <= 0) return;
      const all = cumulative(spec.mortality.steps, d), early = cumulative(spec.mortality.steps, Math.min(d, 30));
      out.usd += cumulative(spec.hardship.steps, d); out.a += early; out.b += all - early; out.fast += d;
    };
    const part = (curve, d, out) => {
      if (d <= 0) return;
      out.usd += cumulative(curve.hardship.steps, d); out.a += cumulative(curve.mortality.steps, d);
    };
    const p1 = { usd: 0, a: 0, b: 0, fast: 0 };
    fast(W - F, p1);
    const R = spec.rationing;
    let best = p1;
    if (R && F > 0) {
      const p2 = { usd: 0, a: 0, b: 0, fast: 0 };
      if (W <= 2 * F) part(R.half, 2 * (W - F), p2);
      else if (W <= 4 * F) { part(R.half, 4 * F - W, p2); part(R.quarter, 2 * W - 4 * F, p2); }
      else { part(R.quarter, 4 * F, p2); fast(W - 4 * F, p2); }
      const cost = (p) => p.usd * n.H + p.a * n.VX + p.b * n.VXcap + p.fast * n.D;
      if (cost(p2) < cost(p1)) best = p2;
    }
    plan.usd = best.usd; plan.a = best.a; plan.b = best.b; plan.fast = best.fast;
    return plan;
  }

  function workRow(wb, j, x, U, f) {
    if (x.w > 0 && U > 0) { const o = wb + j * nPeople + x.i; scrU[o] = U; scrW[o] = x.w * f; }
  }
  // Harm on need k in event e, for each leave option: dollars (hardship,
  // lost work), micromorts, and micromorts valued at each member's value.
  const own = new Float64Array(Math.max(1, nPeople));
  function needRow(e, k, level, out$, outM, outV, wb) {
    const n = needs[k];
    const spec = n.spec;
    const hz = hazards[ev.hz[e]];
    const g = ev.gaps[e][k];
    const mem = n.members;
    const nm = mem.length;
    let stock = 0, cookStock = 0, renew = 0;
    if (n.personal) own.fill(0);
    for (const s of suppliers[k]) {
      const it = items[s.i];
      const u = unitsIn(it, level, hz) * pWorks(it, level, hz);
      if (u <= 0) continue;
      if (s.person !== undefined) own[n.slot[s.person]] += u * s.days;
      else if (s.renew) renew += u * s.days;
      else if (s.pool === 'cook') cookStock += u * s.days;
      else stock += u * s.days;
    }
    const food = spec.special === 'food';
    let fuelDays = 0, ready = 0, cookBase = 0, cookOut = 0, pTreat = 0;
    if (food) {
      for (const f of capFuel.cook || []) {
        const it = items[f.i];
        fuelDays += unitsIn(it, level, hz) * pWorks(it, level, hz) * f.days;
      }
      // The kitchen: part ready to eat, part needing a cooker, part chilled
      // (lost in a power cut of five days or more). After a while without a
      // cooker a household improvises one.
      const B = n.baseline;
      const chilled = spec.chilledShare || 0, cookShare = spec.cookShare || 0;
      ready = B * (1 - chilled - cookShare) + (ev.powerOut[e] < 5 ? B * chilled : 0);
      cookBase = B * cookShare;
      const improvise = spec.improviseCookDays ? (spec.improviseCookDays[settings.dwelling] || Infinity) : Infinity;
      cookOut = Math.min(ev.cookOut[e], improvise);
    } else if (spec.special === 'water') {
      pTreat = pCap('treatWater', level, hz);
    }
    const sc = hz.scale[n.id] || {};
    const scH = sc.hardship === undefined ? 1 : sc.hardship;
    const scM = sc.mortality === undefined ? 1 : sc.mortality;
    const bH = keepOf(needReducers[k], level, 'hardship', hz);
    const bM = keepOf(needReducers[k], level, 'mortality', hz);
    const bW = keepOf(needReducers[k], level, 'work', hz);
    // Hardship and lost work per unmet day, with each member's share kept.
    let HK = 0;
    for (const x of mem) HK += x.h * KV[bH + x.i];
    // Lost work: for each option and member, the days unmet and the share of
    // a day's work each costs, combined across needs in eventHarm.
    if (anyWork) { scrU.fill(0, wb, wb + J * nPeople); scrW.fill(0, wb, wb + J * nPeople); }
    const risky = sideRiskOf[k];
    const cap = spec.lateMultiplierCap;
    const nj = nOpt[e];
    for (let j = 0; j < nj; j++) {
      const L = Lopt[e * J + j];
      const gL = n.leaveEnds ? Math.min(g, L) : g;
      let usd = 0, mm = 0, mmv = 0;
      if (food) {
        const cookable = Math.max(0, gL - cookOut) + fuelDays;
        const F = ready + stock + Math.min(cookBase + cookStock, cookable);
        if (gL > F) {
          const p = foodPlan(n, gL, F);
          usd = p.usd * HK * scH;
          if (anyWork) for (const x of mem) workRow(wb, j, x, p.fast, KV[bW + x.i] * scH);
          // Each person's risk, capped at certainty.
          for (const x of mem) {
            const r = saturate((p.a * x.x + p.b * (cap ? Math.min(x.x, cap) : x.x)) * KV[bM + x.i] * scM);
            mm += r; mmv += r * x.v;
          }
        }
      } else {
        let untreated = 1;
        if (spec.special === 'water' && ev.share[e] > 0) {
          // Where unsafe water can still be had, treating it ends the harm:
          // with a filter or tablets, or by boiling on the days the cooker
          // works.
          const boil = gL > 0 ? Math.max(0, gL - ev.cookOut[e]) / gL : 0;
          untreated = 1 - ev.share[e] * (pTreat + (1 - pTreat) * boil);
        }
        const short = gL * (1 - Math.min(1, renew)) - n.baseline - stock;
        if (!n.personal) {
          const U = Math.max(0, short);
          if (U > 0) {
            usd = cumulative(spec.hardship.steps, U) * HK * scH * untreated;
            if (anyWork) for (const x of mem) workRow(wb, j, x, U, KV[bW + x.i] * scH * untreated);
            const cM = cumulative(spec.mortality.steps, U) * scM * untreated;
            if (cM > 0) for (const x of mem) { const r = saturate(cM * x.x * KV[bM + x.i]); mm += r; mmv += r * x.v; }
          }
        } else {
          // Members with stocks of their own run short on different days.
          for (let q = 0; q < nm; q++) {
            const x = mem[q];
            const U = Math.max(0, short - own[q]);
            if (U <= 0) continue;
            usd += cumulative(spec.hardship.steps, U) * x.h * KV[bH + x.i] * scH * untreated;
            if (anyWork) workRow(wb, j, x, U, KV[bW + x.i] * scH * untreated);
            const r = saturate(cumulative(spec.mortality.steps, U) * x.x * KV[bM + x.i] * scM * untreated);
            mm += r; mmv += r * x.v;
          }
        }
      }
      for (const it of risky) {
        const have = pHave(it, level, hz);
        if (have <= 0) continue;
        for (const s of it.sideRisks) {
          if (s.k !== k) continue;
          const sup = suppliers[k].find((x) => x.i === it.i);
          const used = Math.min(Math.max(0, gL - n.baseline), sup ? unitsIn(it, level, hz) * sup.days : Infinity);
          const r = s.mm * used * have * KV[keepOf(chanReducers[s.c], level, 'mortality', hz) + nPeople];
          mm += r * n.count; mmv += r * n.V;
        }
      }
      out$[j] = usd;
      outM[j] = mm;
      outV[j] = mmv;
    }
  }

  // ---- state for the current kit ----
  const R$ = new Float64Array(E * K * J);
  const RM = new Float64Array(E * K * J);
  const RV = new Float64Array(E * K * J);
  // Totals over needs, per event and leave option.
  const S$ = new Float64Array(E * J);
  const SM = new Float64Array(E * J);
  const SV = new Float64Array(E * J);
  const cur$ = new Float64Array(E);
  const curM = new Float64Array(E);
  const curV = new Float64Array(E);
  const tmp$ = new Float64Array(J), tmpM = new Float64Array(J), tmpV = new Float64Array(J);
  const tot$ = new Float64Array(J), totM = new Float64Array(J), totV = new Float64Array(J);
  const res = { usd: 0, mm: 0, mmv: 0 };
  // Lost work, kept per row (event, need), option and member: unmet days and
  // the share of a day's work each costs. Only households with a member
  // valued for their work need it.
  const anyWork = people.some((p) => p.dv > 0);
  const RU = anyWork ? new Float32Array(E * K * J * nPeople) : null;
  const RW = anyWork ? new Float32Array(E * K * J * nPeople) : null;
  const scrU = new Float32Array(K * J * nPeople), scrW = new Float32Array(K * J * nPeople);
  const fromScr = new Uint8Array(K);
  const pairU = new Float64Array(K), pairW = new Float64Array(K);
  // Lost work in dollars for option j: for each member, the needs unmet are
  // taken to overlap as much as they can (all from the first unmet day), and
  // on a day when several are unmet the shares combine as 1 − Π(1 − share),
  // so that no day costs more than a day's work.
  const workNeeds = needs.map((n) => n.members.some((x) => x.w > 0));
  const activeWork = anyWork ? active.map((list) => list.filter((k) => workNeeds[k])) : null;
  // Members who belong to the same needs, with no item of their own that
  // restores work, lose the same days; each group is worked out once.
  const personalWork = needReducers.some((list) => list.some((r) => r.work && r.person !== undefined));
  const workGroups = [];
  for (const p of people) {
    if (!(p.dv > 0)) continue;
    const sig = needs.map((n) => (n.slot[p.index] >= 0 ? n.members[n.slot[p.index]].w : -1)).join();
    const g = !personalWork && workGroups.find((x) => x.sig === sig);
    if (g) g.dv += p.dv; else workGroups.push({ sig, p, dv: p.dv });
  }
  function workCost(e, j) {
    let usd = 0;
    const list = activeWork[e];
    for (const grp of workGroups) {
      const p = grp.p;
      let n = 0;
      for (const k of list) {
        let u, w;
        if (fromScr[k]) { const o = (k * J + j) * nPeople + p.index; u = scrU[o]; w = scrW[o]; } else { const o = ((e * K + k) * J + j) * nPeople + p.index; u = RU[o]; w = RW[o]; }
        if (!(u > 0 && w > 0)) continue;
        // Insertion in order of unmet days, longest first.
        let m = n++;
        while (m > 0 && pairU[m - 1] < u) { pairU[m] = pairU[m - 1]; pairW[m] = pairW[m - 1]; m--; }
        pairU[m] = u; pairW[m] = w < 1 ? w : 1;
      }
      let keep = 1, days = 0;
      for (let m = 0; m < n; m++) {
        keep *= 1 - pairW[m];
        days += (pairU[m] - (m + 1 < n ? pairU[m + 1] : 0)) * (1 - keep);
      }
      usd += days * grp.dv;
    }
    return usd;
  }
  function workChanged(e, fresh, j) {
    for (const k of fresh) {
      if (!workNeeds[k] || !(ev.gaps[e][k] > 0)) continue;
      const a = (k * J + j) * nPeople, b = ((e * K + k) * J + j) * nPeople;
      for (let t = 0; t < nPeople; t++) if (scrU[a + t] !== RU[b + t] || scrW[a + t] !== RW[b + t]) return true;
    }
    return false;
  }
  // Lost work per event and option for the current kit.
  const SW = anyWork ? new Float64Array(E * J) : null;
  const storeWork = (e, k) => { RU.set(scrU.subarray(k * J * nPeople, (k + 1) * J * nPeople), (e * K + k) * J * nPeople); RW.set(scrW.subarray(k * J * nPeople, (k + 1) * J * nPeople), (e * K + k) * J * nPeople); };

  // Harm in event e. Needs in `fresh` are recomputed for `level`; the rest
  // come from the cache. With `store`, recomputed rows replace the cache.
  function eventHarm(e, fresh, level, store) {
    const nj = nOpt[e];
    const sb = e * J;
    if (anyWork) fromScr.fill(0);
    if (fresh === null) {
      for (let j = 0; j < nj; j++) { tot$[j] = 0; totM[j] = 0; totV[j] = 0; }
      for (const k of active[e]) {
        const base = (e * K + k) * J;
        needRow(e, k, level, tmp$, tmpM, tmpV, k * J * nPeople);
        if (anyWork) { fromScr[k] = 1; if (store) storeWork(e, k); }
        for (let j = 0; j < nj; j++) {
          tot$[j] += tmp$[j]; totM[j] += tmpM[j]; totV[j] += tmpV[j];
          R$[base + j] = tmp$[j]; RM[base + j] = tmpM[j]; RV[base + j] = tmpV[j];
        }
      }
      for (let j = 0; j < nj; j++) { S$[sb + j] = tot$[j]; SM[sb + j] = totM[j]; SV[sb + j] = totV[j]; }
    } else {
      // Start from the stored totals and swap in the rows that changed.
      for (let j = 0; j < nj; j++) { tot$[j] = S$[sb + j]; totM[j] = SM[sb + j]; totV[j] = SV[sb + j]; }
      const row = ev.gaps[e];
      for (const k of fresh) {
        if (!(row[k] > 0)) continue;
        const base = (e * K + k) * J;
        needRow(e, k, level, tmp$, tmpM, tmpV, k * J * nPeople);
        if (anyWork) { fromScr[k] = 1; if (store) storeWork(e, k); }
        for (let j = 0; j < nj; j++) {
          tot$[j] += tmp$[j] - R$[base + j]; totM[j] += tmpM[j] - RM[base + j]; totV[j] += tmpV[j] - RV[base + j];
          if (store) { R$[base + j] = tmp$[j]; RM[base + j] = tmpM[j]; RV[base + j] = tmpV[j]; }
        }
      }
      if (store) for (let j = 0; j < nj; j++) { S$[sb + j] = tot$[j]; SM[sb + j] = totM[j]; SV[sb + j] = totV[j]; }
    }
    // Lost work is not additive across needs, so it is worked out afresh
    // from the rows each time; the stored totals leave it out.
    if (anyWork) {
      // Recomputed only for the options in which a recomputed row's lost
      // work differs from the stored one.
      for (let j = 0; j < nj; j++) {
        const redo = fresh === null || store || workChanged(e, fresh, j);
        const w = redo ? workCost(e, j) : SW[sb + j];
        if (redo && store) SW[sb + j] = w;
        tot$[j] += w;
      }
    }
    if (nj === 1) { res.usd = tot$[0]; res.mm = totM[0]; res.mmv = totV[0]; return res; }
    // Items that make leaving likelier to be possible, or cheaper.
    const hz = hazards[ev.hz[e]];
    let f0 = hz.feasible;
    let keep = 1;
    for (const lf of leaveFx) {
      if (lf.hazards && !lf.hazards.has(hz.id)) continue;
      const it = items[lf.i];
      const have = pHave(it, level, hz) * pWorks(it, level, hz);
      if (have <= 0) continue;
      f0 += (1 - f0) * lf.feasible * have;
      keep *= 1 - lf.cost * have;
    }
    // The share able to leave grows with time. Those who become able on a
    // given day take the best of that day and the later ones, or stay.
    let best = 0, bestCost = tot$[0] + totV[0], bestUsd = tot$[0];
    let usd = 0, mm = 0, mmv = 0, later = 1 - (1 - f0) * stuckBy[sb + nj - 1];
    const stuck = 1 - later;
    for (let j = nj - 1; j >= 1; j--) {
      const u = tot$[j] + keep * leaveCost[sb + j];
      const c = u + totV[j];
      if (c < bestCost) { bestCost = c; best = j; bestUsd = u; }
      const before = j === 1 ? 0 : 1 - (1 - f0) * stuckBy[sb + j - 1];
      const mass = later - before;
      usd += mass * bestUsd; mm += mass * totM[best]; mmv += mass * totV[best];
      later = before;
    }
    res.usd = usd + stuck * tot$[0];
    res.mm = mm + stuck * totM[0];
    res.mmv = mmv + stuck * totV[0];
    return res;
  }

  // Exposure harm of one hazard under a kit, per year, into `out`:
  // [dollars, micromorts, valued micromorts].
  function exposureHarm(hz, level, out) {
    let usd = 0, mm = 0, mmv = 0;
    for (const x of hz.exposures) {
      const list = chanReducers[x.c] || EMPTY;
      if (x.hard || x.fin || x.work) {
        const bH = keepOf(list, level, 'hardship', hz);
        if (x.hard) for (let t = 0; t < nPeople; t++) usd += x.hard[t] * KV[bH + t];
        if (x.fin) usd += x.fin * KV[bH + nPeople];
        if (x.work) {
          const b = x.workOnMortality ? keepOf(list, level, 'mortality', hz) : bH;
          for (const p of people) usd += x.work * p.dv * KV[b + p.index];
        }
      }
      if (x.mmBase) {
        const bM = keepOf(list, level, 'mortality', hz);
        for (const p of people) {
          const r = saturate(x.mmBase * x.mm[p.index]) * KV[bM + p.index];
          mm += r; mmv += r * p.v;
        }
      }
    }
    out[0] = hz.pw * usd; out[1] = hz.pw * mm; out[2] = hz.pw * mmv;
    return out;
  }
  const curX = hazards.map(() => new Float64Array(3));
  const tmpX = new Float64Array(3);

  function refresh(level) {
    version++;
    for (let e = 0; e < E; e++) {
      const r = eventHarm(e, null, level, true);
      cur$[e] = r.usd; curM[e] = r.mm; curV[e] = r.mmv;
    }
    hazards.forEach((hz, h) => { exposureHarm(hz, level, curX[h]); });
  }

  function total(level) {
    let usd = 0, mm = 0, mmv = 0;
    for (let e = 0; e < E; e++) { usd += ev.w[e] * cur$[e]; mm += ev.w[e] * curM[e]; mmv += ev.w[e] * curV[e]; }
    for (const x of curX) { usd += x[0]; mm += x[1]; mmv += x[2]; }
    if (level) for (const it of items) if (it.annual && level[it.i] > 0) { usd += it.annual.usd; mm += it.annual.mm; mmv += it.annual.mmv; }
    return { usd, mm, mmv };
  }

  // Harm averted per year by raising items to new levels. `add` is a list of
  // [itemIndex, newLevel]. With `commit`, the kit and caches are updated.
  // With `byHazard`, the result also carries each hazard's contribution.
  function delta(level, add, { commit = false, byHazard = false } = {}) {
    const old = add.map(([i]) => level[i]);
    let needSet = items[add[0][0]].needSet;
    let events = items[add[0][0]].events;
    const chans = new Set();
    for (const [i] of add) for (const c of items[i].chanSet) chans.add(c);
    if (add.length > 1) {
      needSet = new Set();
      for (const [i] of add) for (const k of items[i].needSet) needSet.add(k);
      events = eventsFor(needSet, add.some(([i]) => items[i].leave));
    }
    for (const [i, lv] of add) level[i] = lv;
    version++;
    let usd = 0, mm = 0, mmv = 0;
    const per = byHazard ? hazards.map(() => [0, 0, 0]) : null;
    for (const e of events) {
      const r = eventHarm(e, needSet, level, commit);
      const dU = ev.w[e] * (cur$[e] - r.usd), dM = ev.w[e] * (curM[e] - r.mm), dV = ev.w[e] * (curV[e] - r.mmv);
      usd += dU; mm += dM; mmv += dV;
      if (per) { const q = per[ev.hz[e]]; q[0] += dU; q[1] += dM; q[2] += dV; }
      if (commit) { cur$[e] = r.usd; curM[e] = r.mm; curV[e] = r.mmv; }
    }
    if (chans.size) {
      hazards.forEach((hz, h) => {
        if (!hz.exposures.some((x) => chans.has(x.c))) return;
        const x = exposureHarm(hz, level, tmpX);
        const c = curX[h];
        usd += c[0] - x[0]; mm += c[1] - x[1]; mmv += c[2] - x[2];
        if (per) { per[h][0] += c[0] - x[0]; per[h][1] += c[1] - x[1]; per[h][2] += c[2] - x[2]; }
        if (commit) c.set(x);
      });
    }
    add.forEach(([i, lv], n) => {
      const a = items[i].annual;
      if (a && old[n] === 0 && lv > 0) { usd -= a.usd; mm -= a.mm; mmv -= a.mmv; }
    });
    if (!commit) { add.forEach(([i], n) => { level[i] = old[n]; }); version++; }
    return { usd, mm, mmv, per };
  }

  // Annual cost and upfront outlay of raising an item from one level to
  // another. A personal item's fixed price is paid with the first member's
  // copy only.
  function cost(i, from, to, level) {
    const it = items[i];
    const units = (it.unitsAt(to) - it.unitsAt(from)) * it.scale;
    const first = from === 0;
    const fixed = first && !(level && it.siblings.some((s) => level[s] > 0));
    const capital = units * it.perUnitCapital + (fixed ? it.fixedCapital : 0);
    const rp = it.runningParts;
    // The yearly cost, split: the purchase spread over its life; money spent
    // on upkeep and storage; and time, to set up (spread over its life) and
    // to keep up.
    const parts = {
      capital,
      money: units * (it.perUnit - it.perUnitCapital) + (first ? rp.money : 0),
      setupTime: first ? rp.setupTime : 0,
      upkeepTime: first ? rp.upkeepTime : 0,
      upkeepHours: first ? it.upkeepHours : 0,
    };
    return {
      annual: units * it.perUnit + (first ? it.running : 0) + (fixed ? it.fixedCapital : 0),
      upfront: units * it.unitUsd + (fixed ? it.fixedUsd : 0),
      hours: first ? it.setupHours : 0,
      units,
      parts,
    };
  }

  return {
    v, timeValue, survival, items, needs, hazards, needIds, channelIds, E, people,
    capProviders, refresh, total, delta, cost,
    itemIndex: Object.fromEntries(items.map((it) => [it.id, it.i])),
    newLevel: () => new Int32Array(items.length),
  };
}

// ---------------------------------------------------------------------------
// Ranking
// ---------------------------------------------------------------------------

function ownedLevels(W, settings) {
  const level = W.newLevel();
  for (const [id, lv] of Object.entries(settings.owned || {})) {
    const it = W.items[W.itemIndex[id]];
    if (it && it.applicable) level[it.i] = Math.max(0, Math.min(it.maxLevel, lv === true ? 1 : lv | 0));
  }
  return level;
}

// The candidates open to a kit. For every applicable item not yet at its top
// level: its next few levels and its top one (so that a ladder whose first
// step is worth little but whose third is worth a lot is seen whole),
// together with whatever the item needs in order to work, and with each item
// it is marked as pairing with.
function candidates(W, level) {
  const out = [];
  const index = W.itemIndex;
  // What an item needs in order to work, beyond what is owned.
  const needsOf = (it, extra) => {
    for (const cap of it.requires) {
      const providers = (W.capProviders[cap] || []).filter((p) => W.items[p].applicable);
      if (providers.some((p) => level[p] > 0 || extra.some(([i]) => i === p))) continue;
      if (!providers.length) return false;
      const cheapest = providers.reduce((a, b) => (W.cost(a, 0, 1, level).annual <= W.cost(b, 0, 1, level).annual ? a : b));
      if (cheapest !== it.i) extra.push([cheapest, 1]);
    }
    return true;
  };
  for (const it of W.items) {
    if (!it.applicable || level[it.i] >= it.maxLevel) continue;
    const extra = [];
    if (!needsOf(it, extra)) continue;
    // The next three levels, and the top.
    const next = level[it.i] + 1;
    for (const lv of new Set([next, Math.min(next + 1, it.maxLevel), Math.min(next + 2, it.maxLevel), it.maxLevel])) out.push([[it.i, lv], ...extra]);
    // With the next level of each item it pairs with (food that needs
    // cooking and the fuel to cook it).
    for (const id of it.spec.bundleWith || []) {
      const j = index[id];
      if (j === undefined || !W.items[j].applicable || level[j] >= W.items[j].maxLevel || extra.some(([i]) => i === j)) continue;
      const both = [...extra, [j, level[j] + 1]];
      if (!needsOf(W.items[j], both)) continue;
      out.push([[it.i, next], ...both.filter(([i]) => i !== it.i)]);
    }
  }
  return out;
}

function costOf(W, level, add) {
  const c = { annual: 0, upfront: 0, hours: 0, parts: { capital: 0, money: 0, setupTime: 0, upkeepTime: 0, upkeepHours: 0 } };
  for (const [i, lv] of add) {
    const x = W.cost(i, level[i], lv, level);
    c.annual += x.annual; c.upfront += x.upfront; c.hours += x.hours;
    for (const k in c.parts) c.parts[k] += x.parts[k];
  }
  return c;
}

function ratioOf(value, annual) {
  if (annual > 0) return value / annual;
  return value > 0 ? Infinity : 0;
}

// The list. It is ranked on the middle value of every input, or, with
// settings.rankOn = 'mean', on the average of every input, which is closer to
// what "expected value" means and gives more weight to rare catastrophes.
export function rank(data, settings) {
  const m = resolveModel(data, null, settings.rankOn === 'mean');
  const W = buildWorld(m, settings);
  W.refresh(W.newLevel());
  const baseline = W.total(null);
  const level = ownedLevels(W, settings);
  W.refresh(level);
  const start = W.total(level);
  const entries = [];
  let cumUpfront = 0, cumAnnual = 0;
  // A candidate's value is kept from one round to the next unless the entry
  // just taken could have changed it: one that shares a channel with it, or,
  // because the decision to leave ties all needs together, any other entry
  // that acts on a need when this one does.
  const cache = new Map();
  const touched = (add) => {
    const t = { needs: false, chans: new Set(), all: false };
    for (const [i] of add) {
      const it = W.items[i];
      if (it.needSet.size || it.leave) t.needs = true;
      for (const c of it.chanSet) t.chans.add(c);
      if (it.spec.effects && it.spec.effects.some((fx) => fx.type === 'review')) t.all = true;
    }
    return t;
  };
  for (;;) {
    const cands = candidates(W, level);
    if (!cands.length) break;
    let best = null;
    for (const add of cands) {
      const key = add.map((a) => a.join(':')).join('+');
      let hit = cache.get(key);
      if (!hit) {
        const x = W.delta(level, add);
        hit = { usd: x.usd, mm: x.mm, mmv: x.mmv, t: touched(add) };
        cache.set(key, hit);
      }
      const c = costOf(W, level, add);
      const value = hit.usd + hit.mmv;
      const ratio = ratioOf(value, c.annual);
      if (!best || ratio > best.ratio || (ratio === best.ratio && value > best.value)) best = { add, c, value, ratio };
    }
    const { add, c } = best;
    const d = W.delta(level, add, { commit: true, byHazard: true });
    const took = touched(add);
    for (const [key, hit] of cache) {
      let stale = took.all || hit.t.all || (took.needs && hit.t.needs);
      if (!stale) for (const ch of hit.t.chans) if (took.chans.has(ch)) { stale = true; break; }
      if (stale) cache.delete(key);
    }
    cumUpfront += c.upfront; cumAnnual += c.annual;
    const value = d.usd + d.mmv;
    const byHazard = W.hazards
      .map((hz, h) => ({ id: hz.id, p: hz.p, value: d.per[h][0] + d.per[h][2] }))
      .filter((x) => Math.abs(x.value) > 1e-12)
      .sort((a, b) => b.value - a.value);
    // The annual probability of the main hazard at which this entry breaks even.
    let breakEven = null;
    if (byHazard.length && byHazard[0].value > 0) {
      const top = byHazard[0];
      const need = c.annual - (value - top.value);
      breakEven = { hazard: top.id, probability: need <= 0 ? 0 : top.p * need / top.value, current: top.p };
    }
    entries.push({
      items: add.map(([i, lv]) => {
        const it = W.items[i];
        return { id: it.baseId, key: it.id, person: it.person === undefined ? null : W.people[it.person].key, level: lv, label: it.ladder ? it.ladder[lv - 1].label : null, units: it.unitsAt(lv) * it.scale };
      }),
      add: add.map(([i, lv]) => [W.items[i].id, lv]),
      upfrontUsd: c.upfront, setupHours: c.hours, annualCostUsd: c.annual, annualCostParts: c.parts,
      hardshipUsd: d.usd, micromorts: d.mm, valueUsd: value,
      ratio: ratioOf(value, c.annual),
      byHazard, breakEven,
      cumulativeUpfrontUsd: cumUpfront, cumulativeAnnualUsd: cumAnnual,
    });
  }
  return {
    entries,
    micromortValueUsd: W.v,
    timeValueUsdPerHour: W.timeValue,
    survival: W.survival,
    harm: { unprepared: baseline, start, end: W.total(level) },
    hazards: W.hazards.map((hz) => ({ id: hz.id, p: hz.p })),
    people: W.people.map((p) => ({ key: p.key, label: p.label, age: p.age, impartial: p.impartial, micromortValueUsd: p.v, hourValueUsd: p.hv, workDayUsd: p.dv, impactEndYear: p.impartial ? p.impactEndYear : null })),
    events: W.E,
  };
}

// How sure is each entry? Samples every uncertain parameter, replays the
// ranked order, and reports the spread of each entry's ratio.
// With `raw`, returns each entry's sampled ratios instead of their summary.
export function robustness(data, settings, order, { samples = 200, seed = 1, raw = false, sums = null } = {}) {
  const ratios = order.map(() => []);
  for (let s = 0; s < samples; s++) {
    const m = resolveModel(data, normalFrom(mulberry32(seed * 7919 + s)));
    const W = buildWorld(m, settings);
    const level = ownedLevels(W, settings);
    W.refresh(level);
    order.forEach((step, n) => {
      const add = step.add.map(([id, lv]) => [W.itemIndex[id], lv]);
      const c = costOf(W, level, add);
      const d = W.delta(level, add, { commit: true });
      ratios[n].push(ratioOf(d.usd + d.mmv, c.annual));
      // For checking averages: total value and total cost over the samples.
      if (sums) { sums[n] ||= { value: 0, cost: 0 }; sums[n].value += d.usd + d.mmv; sums[n].cost += c.annual; }
    });
  }
  if (raw) return ratios;
  return ratios.map((list) => {
    const sorted = [...list].sort((a, b) => a - b);
    const at = (p) => sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))];
    return { p05: at(0.05), p50: at(0.5), p95: at(0.95), pAbove1: list.filter((x) => x > 1).length / list.length };
  });
}

export function defaultSettings(data) {
  return JSON.parse(JSON.stringify(data.defaults));
}
