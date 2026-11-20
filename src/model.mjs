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

// Replace every triple in `data` by a number. `draw` returns a standard-normal
// deviate per parameter, or is null for medians. The steps of one curve share
// a deviate, so a sampled curve keeps its shape.
export function resolveModel(data, draw) {
  const walk = (node, shared) => {
    if (Array.isArray(node)) return node.map((x) => walk(x, shared));
    if (node === null || typeof node !== 'object') return node;
    if (isTriple(node)) {
      const v = drawTriple(node, shared !== undefined ? shared : (draw ? draw() : 0));
      return 'fromDay' in node ? { fromDay: node.fromDay, v } : v;
    }
    const out = {};
    for (const [k, v] of Object.entries(node)) {
      if (k === 'steps' && Array.isArray(v)) {
        const z = draw ? draw() : 0;
        out[k] = v.map((s) => walk(s, z));
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

// Deterministic pseudo-random number in [0, 1) from three integers. Used so
// that "did this item work in this event" is the same question with the same
// answer in every evaluation.
function hash01(a, b, c) {
  let h = Math.imul(a + 0x9E3779B9, 0x85EBCA6B) ^ Math.imul(b + 0x7F4A7C15, 0xC2B2AE35) ^ Math.imul(c + 0x165667B1, 0x27D4EB2F);
  h ^= h >>> 15; h = Math.imul(h, 0x2C1B3C6D);
  h ^= h >>> 12; h = Math.imul(h, 0x297A2D39);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

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
export const STRATA = makeStrata([[0, 0.5, 4], [0.5, 0.9, 8], [0.9, 0.99, 12], [0.99, 0.999, 8], [0.999, 1, 4]]);

// Length in days of a window at quantile u of its own distribution, from its
// 50th, 90th and 99th percentiles. Interpolates on a log scale against the
// normal deviate and extends the last slope beyond the 99th percentile, to a
// cap of three times the 99th percentile.
export function windowDays(d, u) {
  const z = normInv(u);
  const cap = Math.min(1095, 3 * d.p99);
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

function peopleOf(settings) {
  const h = settings.household;
  const counts = { age75plus: h.age75plus || 0, age60to74: h.age60to74 || 0, adult: h.adults || 0, child: h.children || 0 };
  const list = [];
  for (const age of AGES) for (let i = 0; i < counts[age]; i++) list.push({ age, flags: {} });
  // Conditions are assigned to the oldest members first.
  const mark = (flag, n) => { for (let i = 0; i < Math.min(list.length, n || 0); i++) list[i].flags[flag] = true; };
  for (const f of FLAGS) mark(f, h[f]);
  mark('onMedication', Math.max(h.onMedication || 0, h.criticalDrug || 0));
  // Infants are the youngest children.
  for (let i = 0; i < Math.min(counts.child, h.infants || 0); i++) list[list.length - 1 - i].flags.infant = true;
  return list;
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

function holds(condition, settings) {
  const s = settings;
  switch (condition) {
    case 'house': return s.dwelling === 'house';
    case 'apartment': return s.dwelling === 'apartment';
    case 'car': return !!s.car;
    case 'infant': return (s.household.infants || 0) > 0;
    case 'pet': return (s.household.pets || 0) > 0;
    case 'powerDependent': return (s.household.powerDependent || 0) > 0;
    case 'criticalDrug': return (s.household.criticalDrug || 0) > 0;
    case 'onMedication': return Math.max(s.household.onMedication || 0, s.household.criticalDrug || 0) > 0;
    case 'age60plus': return (s.household.age60to74 || 0) + (s.household.age75plus || 0) > 0;
    case 'livesAlone': return (s.household.adults || 0) + (s.household.children || 0) + (s.household.age60to74 || 0) + (s.household.age75plus || 0) === 1;
    case 'severalPeople': return (s.household.adults || 0) + (s.household.children || 0) + (s.household.age60to74 || 0) + (s.household.age75plus || 0) > 1;
    case 'airConditioning': return !!s.airConditioning;
    case 'noAirConditioning': return !s.airConditioning;
    default: return !!(s.ticks && s.ticks[condition]);
  }
}

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
  }
  let cooling = 0;
  if (state === 'hot') {
    const heat = win.heat !== undefined ? win.heat : power;
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
    displacement: win.displacement || 0,
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
// The reader states when they expect AGI and how concerned they are. For each
// hazard the data gives four annual rates: `baseline` (AI's effect removed),
// `now` (before AGI), `transition` (the years just after AGI arrives) and
// `after`. Each rate is [low, middle, high]: the view of a careful sceptic,
// the central view, and the view of someone highly concerned. The hazard's
// probability is shifted by the average, over the planning horizon, of the
// rate the reader's timeline implies, less the baseline.

// Value of a [low, middle, high] triple at concern c in [0, 1].
export function atConcern(t, c) {
  const [lo, mid, hi] = t;
  const k = Math.max(0, Math.min(1, c));
  const mix = (a, b, w) => (a > 0 && b > 0 ? a * Math.pow(b / a, w) : a + (b - a) * w);
  return k <= 0.5 ? mix(lo, mid, 2 * k) : mix(mid, hi, 2 * k - 1);
}

// Cumulative probability that AGI has arrived by time y (in years, so 2028.5
// is mid-2028), from points [{year, p}] giving the probability by the end of
// each year. Zero at `zeroAt`, straight lines between points, flat after the last.
export function arrivalCdf(points, zeroAt) {
  const pts = [{ year: zeroAt - 1e-9, p: 0 }, ...points.map((x) => ({ year: x.year + 1, p: x.p })).filter((x) => x.year >= zeroAt)];
  return (y) => {
    if (y <= pts[0].year) return 0;
    for (let i = 1; i < pts.length; i++) {
      if (y <= pts[i].year) {
        const a = pts[i - 1], b = pts[i];
        return a.p + (b.p - a.p) * (y - a.year) / (b.year - a.year);
      }
    }
    return pts[pts.length - 1].p;
  };
}

// The shift in a hazard's annual probability, and the rates behind it.
export function aiShift(ai, settings, hazardId, loc) {
  const s = settings.ai;
  if (!ai || !s || !s.timeline || s.timeline === 'none') return 0;
  const spec = ai.hazards[hazardId];
  const r = spec && (spec[loc] || spec.all);
  if (!r) return 0;
  const points = s.timeline === 'custom' ? (s.custom || []) : ai.timelines[s.timeline].cumulative;
  const F = arrivalCdf(points, ai.startYear);
  const c = s.concern === undefined ? 0.5 : s.concern;
  const now = atConcern(r.now, c), during = atConcern(r.transition, c), after = atConcern(r.after, c);
  const T = ai.transitionYears;
  const H = Math.max(1, Math.round(s.horizonYears || ai.horizonYears));
  let sum = 0;
  for (let k = 0; k < H; k++) {
    const y = ai.startYear + k + 0.5; // the middle of each year of the horizon
    const arrived = F(y), over = F(y - T);
    sum += (1 - arrived) * now + (arrived - over) * during + over * after;
  }
  return sum / H - atConcern(r.baseline, c);
}

// ---------------------------------------------------------------------------
// The world: one resolved model applied to one household
// ---------------------------------------------------------------------------

export function buildWorld(m, settings) {
  const P = m.parameters;
  const loc = settings.location;
  const over = settings.parameters || {};
  const pick = (id) => {
    if (over[id] !== undefined && over[id] !== null) return over[id];
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

  // ---- needs ----
  const needIds = Object.keys(m.needs);
  const K = needIds.length;
  const needIndex = Object.fromEntries(needIds.map((id, k) => [id, k]));
  const needs = needIds.map((id) => {
    const n = m.needs[id];
    // A need may apply to some people only, or to some households only.
    const who = n.if && !holds(n.if, settings) ? [] : people.filter((p) => !n.who || n.who === 'all' || p.flags[n.who]);
    return {
      id,
      spec: n,
      count: who.length,
      Mh: n.per === 'household' ? (who.length > 0 ? 1 : 0) : who.reduce((s, p) => s + multiplier(n.multipliers, p, 'hardship'), 0),
      Mm: who.reduce((s, p) => s + multiplier(n.multipliers, p, 'mortality'), 0),
      demand: n.demandPerPersonDay !== undefined ? n.demandPerPersonDay * who.length : (n.demandPerHouseholdDay || 1),
      leaveEnds: n.leaveEnds !== false,
      home: n.home !== false,
      // What the household covers unprepared; some households cover more
      // (a car charges phones for as long as it has fuel).
      baseline: (n.baselineIf || []).reduce((b, x) => (holds(x.if, settings) ? Math.max(b, x.days) : b), n.baselineDays || 0),
    };
  });

  const channelIds = Object.keys(m.channels || {});
  const channelIndex = Object.fromEntries(channelIds.map((id, c) => [id, c]));

  // ---- hazards and events ----
  const hazardIds = Object.keys(m.hazards);
  const hazards = [];
  const ev = { hz: [], key: [], w: [], gaps: [], cookOut: [], share: [] };
  hazardIds.forEach((id, hIdx) => {
    // A hazard may unfold differently in different places.
    const base = m.hazards[id];
    const h = base.byLocation && base.byLocation[loc] ? { ...base, ...base.byLocation[loc] } : base;
    if (h.tickBox && !(settings.ticks && settings.ticks[h.tickBox])) return;
    let p;
    const custom = settings.probabilities && settings.probabilities[id];
    if (custom !== undefined && custom !== null) p = custom;
    else {
      const byLoc = h.probability[loc] !== undefined ? h.probability[loc] : h.probability.all;
      p = byLoc === undefined ? 0 : (typeof byLoc === 'object' ? (byLoc[settings.outlook] !== undefined ? byLoc[settings.outlook] : byLoc.all) : byLoc);
      p = Math.max(0, Math.min(1, (p || 0) + aiShift(m.ai, settings, id, loc)));
    }
    if (!(p > 0)) return;
    const late = h.lateBuy && (h.warningDays || 0) >= 0.5 ? h.lateBuy : { staple: 0, specialty: 0 };
    const hz = {
      id, index: hazards.length, p, spec: h,
      late: { staple: late.staple || 0, specialty: late.specialty || 0, none: 0 },
      feasible: h.leave ? h.leave.feasible : 0,
      earliest: h.leave ? h.leave.earliestDay : 0,
      leaveFixed: h.leave ? h.leave.fixedUsdPerHousehold : 0,
      leavePerDay: h.leave ? (h.leave.usdPerPersonDay + leaveHardship) * nPeople : 0,
      scale: h.needScale || {},
      exposures: (h.exposures || []).map((x) => {
        const ch = (m.channels || {})[x.channel] || {};
        const mults = x.multipliers || ch.multipliers;
        // Some exposures differ by kind of home or by place (house fires).
        const es = h.exposureScale || {};
        const scale = (es.dwelling && es.dwelling[settings.dwelling] !== undefined ? es.dwelling[settings.dwelling] : 1)
          * (es.location && es.location[loc] !== undefined ? es.location[loc] : 1);
        return {
          c: channelIndex[x.channel],
          mm: scale * (x.micromortsPerPerson || 0) * people.reduce((s, q) => s + multiplier(mults, q, 'mortality'), 0),
          usd: scale * ((x.hardshipUsdPerPerson || 0) * people.reduce((s, q) => s + multiplier(mults, q, 'hardship'), 0)
            + (x.financialUsdPerHousehold || 0)),
        };
      }),
    };
    hazards.push(hz);
    let cold = settings.ticks && settings.ticks.coldWinters ? (h.coldShare || 0) : 0;
    let hot = settings.ticks && settings.ticks.hotSummers ? (h.hotShare || 0) : 0;
    if (cold + hot > 1) { const t = cold + hot; cold /= t; hot /= t; }
    const states = [['mild', 1 - cold - hot], ['cold', cold], ['hot', hot]];
    const scale = h.durationScale === undefined ? 1 : h.durationScale;
    states.forEach(([state, ws], sIdx) => {
      if (!(ws > 1e-9)) return;
      STRATA.forEach(([q, wq], qIdx) => {
        const win = {};
        for (const [wid, w] of Object.entries(h.windows || {})) {
          const pOccur = w.pOccur;
          if (!(pOccur > 0) || q <= 1 - pOccur) continue;
          win[wid] = scale * windowDays(w.days, (q - (1 - pOccur)) / pOccur);
          if (wid === 'water') win.shareTreatable = w.shareTreatable || 0;
        }
        const g = deriveGaps(win, state, settings);
        const D = g.displacement;
        const row = new Float64Array(K);
        needs.forEach((n, k) => {
          const raw = g[n.spec.gap] || 0;
          row[k] = n.count === 0 ? 0 : (n.home && n.spec.gap !== 'displacement' ? Math.max(0, raw - D) : raw);
        });
        ev.hz.push(hz.index);
        ev.key.push(hIdx * 4096 + sIdx * 256 + qIdx);
        ev.w.push(p * ws * wq * homePresence);
        ev.gaps.push(row);
        ev.cookOut.push(Math.max(0, g.cookOut - D));
        ev.share.push(g.shareTreatable);
      });
    });
  });
  const E = ev.hz.length;

  // Leave options per event.
  const Lopt = new Float64Array(E * J).fill(Infinity);
  const leaveCost = new Float64Array(E * J);
  // Options in use per event: "stay", then the leave days, which fill a prefix.
  const nOpt = new Uint8Array(E).fill(1);
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
  const capNeeds = { cook: ['food', 'water'], treatWater: ['water'] };
  for (const n of needs) {
    for (const cp of n.spec.coping || []) (capNeeds[`reduces:${cp.channel}`] ||= []).push(n.id);
  }

  const items = m.items.map((it, i) => {
    const applicable = (it.conditions || []).every((c) => holds(c, settings));
    const ladder = it.ladder && it.ladder.length ? it.ladder : null;
    // Units are per person for items that scale with people: everyone, or
    // only those with a stated condition (the people on medication, say).
    const scale = it.scalesWith === 'person'
      ? Math.max(1, it.scalesWho ? people.filter((p) => p.flags[it.scalesWho]).length : nPeople)
      : 1;
    const life = it.lifeYears;
    const e = it.everydayShare || 0;
    // Cash is priced in dollars everywhere, and its cost is given whole as
    // upkeep, so it carries no price index and no charge for capital.
    const unitUsd = it.price * (it.capitalFree ? 1 : priceIndex);
    const perUnit = (it.capitalFree ? 0 : unitUsd * ((1 - e) * crf(rate, life) + e * rate))
      + (it.upkeepUsdPerUnitYear || 0) + (it.volumeLitres || 0) * storage;
    // A fixed price is paid once, with the first level (a heater, as against
    // the fuel that is the item's ladder).
    const fixedUsd = (it.fixedPrice || 0) * priceIndex;
    const fixed = fixedUsd * ((1 - e) * crf(rate, life) + e * rate)
      + (it.setupHours || 0) * timeValue * crf(rate, life)
      + (it.upkeepHoursPerYear || 0) * timeValue + (it.upkeepUsdPerYear || 0);
    const item = {
      i, id: it.id, spec: it, applicable, ladder, scale,
      maxLevel: ladder ? ladder.length : 1,
      unitsAt: (level) => (level <= 0 ? 0 : (ladder ? ladder[Math.min(level, ladder.length) - 1].units : 1)),
      lateLevel: it.lateBuyLevel === undefined ? 1 : it.lateBuyLevel,
      reliability: it.reliability === undefined ? 1 : it.reliability,
      lateClass: it.lateBuyClass || 'none',
      requires: it.requires || [],
      unitUsd, perUnit, fixed, fixedUsd,
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
        suppliers[k].push({ i, days: fx.amount * scale / needs[k].demand, pool: fx.pool || 'main', renew: !!fx.renewable });
        item.needSet.add(k);
      } else if (fx.type === 'capability') {
        (capProviders[fx.capability] ||= []).push(i);
        for (const nid of capNeeds[fx.capability] || []) if (nid in needIndex) item.needSet.add(needIndex[nid]);
      } else if (fx.type === 'reduce') {
        // `othersOnly`: the item protects everyone but the member who holds
        // it (someone trained in CPR cannot resuscitate themselves).
        const adj = (fx.adherence === undefined ? 1 : fx.adherence)
          * (fx.othersOnly ? Math.max(0, nPeople - 1) / Math.max(1, nPeople) : 1);
        const f = (fx.fraction || 0) * adj;
        const red = {
          i, f, on: fx.on || 'both', group: fx.group || null,
          // A fraction that grows with the level owned (deeper stocks).
          byLevel: fx.fractionByLevel ? fx.fractionByLevel.map((x) => x * adj) : null,
          hazards: !fx.hazards || fx.hazards.includes('all') ? null : new Set(fx.hazards),
        };
        if (fx.target in needIndex) {
          needReducers[needIndex[fx.target]].push(red);
          item.needSet.add(needIndex[fx.target]);
        } else if (fx.target in channelIndex) {
          chanReducers[channelIndex[fx.target]].push(red);
          item.chanSet.add(channelIndex[fx.target]);
          for (const nid of capNeeds[`reduces:${fx.target}`] || []) item.needSet.add(needIndex[nid]);
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
        // A risk of owning the thing at all, every year (a firearm at home).
        item.annual = { mm: (fx.micromortsPerPersonYear || 0) * nPeople, usd: fx.usdPerHouseholdYear || 0 };
      } else if (fx.type === 'review') {
        // Practice makes every other item likelier to work when needed.
        review = { i, factor: fx.failureFactor };
      }
    }
    return item;
  });
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
  for (let e = 0; e < E; e++) if (Lopt[e * J + 1] !== Infinity) leaveEvents.push(e);
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

  // ---- what the household has in a given event ----
  function reliabilityOf(it, level) {
    if (review && review.i !== it.i && level[review.i] > 0) return 1 - (1 - it.reliability) * review.factor;
    return it.reliability;
  }
  const fractionAt = (r, lv) => (r.byLevel ? (lv > 0 ? r.byLevel[Math.min(lv, r.byLevel.length) - 1] : 0) : r.f);
  // Whether each item works, and whether it could be bought late, is fixed
  // per event in advance.
  const N = items.length;
  const workDraw = new Float32Array(E * N);
  const boughtLate = new Uint8Array(E * N);
  for (let e = 0; e < E; e++) {
    const late = hazards[ev.hz[e]].late;
    for (let i = 0; i < N; i++) {
      workDraw[e * N + i] = hash01(ev.key[e], i, 1);
      const pLate = late[items[i].lateClass];
      boughtLate[e * N + i] = pLate > 0 && items[i].applicable && hash01(ev.key[e], i, 2) < pLate ? 1 : 0;
    }
  }
  function unitsIn(e, it, level) {
    const lv = level[it.i];
    let u = 0;
    if (lv > 0 && workDraw[e * N + it.i] < reliabilityOf(it, level)) u = it.unitsAt(lv);
    if (boughtLate[e * N + it.i]) u = Math.min(it.unitsAt(it.maxLevel), u + it.unitsAt(it.lateLevel));
    return u;
  }
  function hasCap(e, cap, level) {
    for (const i of capProviders[cap] || []) if (unitsIn(e, items[i], level) > 0) return true;
    return false;
  }
  function works(e, it, level) {
    for (const cap of it.requires) if (!hasCap(e, cap, level)) return false;
    return true;
  }
  function reduction(list, e, level, kind, hazardId) {
    let keep = 1;
    let groups = null;
    for (const r of list) {
      if (r.on !== 'both' && r.on !== kind) continue;
      if (r.hazards && !r.hazards.has(hazardId)) continue;
      const it = items[r.i];
      if (unitsIn(e, it, level) <= 0 || !works(e, it, level)) continue;
      const f = fractionAt(r, level[it.i] > 0 ? level[it.i] : it.lateLevel);
      if (r.group) { groups ||= {}; groups[r.group] = Math.max(groups[r.group] || 0, f); }
      else keep *= 1 - f;
    }
    if (groups) for (const g of Object.values(groups)) keep *= 1 - g;
    return keep;
  }

  // Harm on need k in event e, for each leave option, into out$ and outM.
  function needRow(e, k, level, out$, outM) {
    const n = needs[k];
    const spec = n.spec;
    const hz = hazards[ev.hz[e]];
    const g = ev.gaps[e][k];
    let stock = 0, cookStock = 0, renew = 0;
    for (const s of suppliers[k]) {
      const it = items[s.i];
      const u = unitsIn(e, it, level);
      if (u <= 0 || !works(e, it, level)) continue;
      if (s.renew) renew += u * s.days;
      else if (s.pool === 'cook') cookStock += u * s.days;
      else stock += u * s.days;
    }
    let fuelDays = 0;
    let treat = 0;
    if (spec.special === 'food') {
      for (const f of capFuel.cook || []) {
        const u = unitsIn(e, items[f.i], level);
        if (u > 0) fuelDays += u * f.days;
      }
    } else if (spec.special === 'water') {
      // Unsafe water can be made safe by treating it, or by boiling if the
      // household can cook.
      if (hasCap(e, 'treatWater', level) || hasCap(e, 'cook', level) || ev.cookOut[e] < 0.5) treat = ev.share[e];
    }
    const sc = hz.scale[n.id] || {};
    const rH = reduction(needReducers[k], e, level, 'hardship', hz.id) * (sc.hardship === undefined ? 1 : sc.hardship);
    const rM = reduction(needReducers[k], e, level, 'mortality', hz.id) * (sc.mortality === undefined ? 1 : sc.mortality);
    let copingFactor = 0;
    for (const cp of spec.coping || []) {
      copingFactor += cp.share * reduction(chanReducers[channelIndex[cp.channel]] || [], e, level, 'mortality', hz.id);
    }
    const risky = sideRiskOf[k];
    const nj = nOpt[e];
    for (let j = 0; j < nj; j++) {
      const L = Lopt[e * J + j];
      const gL = n.leaveEnds ? Math.min(g, L) : g;
      let covered;
      if (spec.special === 'food') {
        const s = spec.noCookShare === undefined ? 1 : spec.noCookShare;
        const cookable = Math.max(0, gL - ev.cookOut[e]) + fuelDays;
        covered = n.baseline * s + stock + Math.min(n.baseline * (1 - s) + cookStock, cookable);
      } else covered = n.baseline + stock;
      const share = Math.min(1, renew + treat);
      const U = Math.max(0, gL * (1 - share) - covered);
      const mort = cumulative(spec.mortality.steps, U) * n.Mm * rM;
      let mm = mort * (1 + copingFactor);
      for (const it of risky) {
        const u = unitsIn(e, it, level);
        if (u <= 0) continue;
        for (const s of it.sideRisks) {
          if (s.k !== k) continue;
          const used = Math.min(Math.max(0, gL - n.baseline), u * (suppliers[k].find((x) => x.i === it.i)?.days || Infinity));
          mm += s.mm * used * n.count * reduction(chanReducers[s.c] || [], e, level, 'mortality', hz.id);
        }
      }
      out$[j] = cumulative(spec.hardship.steps, U) * n.Mh * rH;
      outM[j] = mm;
    }
  }

  // ---- state for the current kit ----
  const R$ = new Float64Array(E * K * J);
  const RM = new Float64Array(E * K * J);
  // Totals over needs, per event and leave option.
  const S$ = new Float64Array(E * J);
  const SM = new Float64Array(E * J);
  const cur$ = new Float64Array(E);
  const curM = new Float64Array(E);
  const tmp$ = new Float64Array(J), tmpM = new Float64Array(J);
  const tot$ = new Float64Array(J), totM = new Float64Array(J);
  const res = { usd: 0, mm: 0 };

  // Harm in event e. Needs in `fresh` are recomputed for `level`; the rest
  // come from the cache. With `store`, recomputed rows replace the cache.
  function eventHarm(e, fresh, level, store) {
    const nj = nOpt[e];
    const sb = e * J;
    if (fresh === null) {
      for (let j = 0; j < nj; j++) { tot$[j] = 0; totM[j] = 0; }
      for (const k of active[e]) {
        const base = (e * K + k) * J;
        needRow(e, k, level, tmp$, tmpM);
        for (let j = 0; j < nj; j++) { tot$[j] += tmp$[j]; totM[j] += tmpM[j]; R$[base + j] = tmp$[j]; RM[base + j] = tmpM[j]; }
      }
      for (let j = 0; j < nj; j++) { S$[sb + j] = tot$[j]; SM[sb + j] = totM[j]; }
    } else {
      // Start from the stored totals and swap in the rows that changed.
      for (let j = 0; j < nj; j++) { tot$[j] = S$[sb + j]; totM[j] = SM[sb + j]; }
      const row = ev.gaps[e];
      for (const k of fresh) {
        if (!(row[k] > 0)) continue;
        const base = (e * K + k) * J;
        needRow(e, k, level, tmp$, tmpM);
        for (let j = 0; j < nj; j++) {
          tot$[j] += tmp$[j] - R$[base + j]; totM[j] += tmpM[j] - RM[base + j];
          if (store) { R$[base + j] = tmp$[j]; RM[base + j] = tmpM[j]; }
        }
      }
      if (store) for (let j = 0; j < nj; j++) { S$[sb + j] = tot$[j]; SM[sb + j] = totM[j]; }
    }
    if (nj === 1) { res.usd = tot$[0]; res.mm = totM[0]; return res; }
    // Items that make leaving likelier to be possible, or cheaper.
    const hz = hazards[ev.hz[e]];
    let f = hz.feasible;
    let cut = 0;
    if (leaveFx.length) {
      let keep = 1;
      for (const lf of leaveFx) {
        if (lf.hazards && !lf.hazards.has(hz.id)) continue;
        const it = items[lf.i];
        if (unitsIn(e, it, level) <= 0 || !works(e, it, level)) continue;
        f += (1 - f) * lf.feasible;
        keep *= 1 - lf.cost;
      }
      cut = 1 - keep;
    }
    let best = 0;
    let bestUsd = tot$[0];
    let bestCost = tot$[0] + v * totM[0];
    for (let j = 1; j < nj; j++) {
      const usd = tot$[j] + (1 - cut) * leaveCost[sb + j];
      const c = usd + v * totM[j];
      if (c < bestCost) { bestCost = c; best = j; bestUsd = usd; }
    }
    if (best === 0) f = 0;
    res.usd = f * bestUsd + (1 - f) * tot$[0];
    res.mm = f * totM[best] + (1 - f) * totM[0];
    return res;
  }

  // Exposure harm of one hazard under a kit: [usd, mm] per year.
  function chanKeep(c, hz, level, kind) {
    // Expected share of the harm that remains, items acting independently.
    let keep = 1;
    const groups = {};
    for (const r of chanReducers[c]) {
      if (r.on !== 'both' && r.on !== kind) continue;
      if (r.hazards && !r.hazards.has(hz.id)) continue;
      const it = items[r.i];
      if (!it.applicable) continue;
      const pLate = hz.late[it.lateClass];
      const rel = reliabilityOf(it, level);
      const owned = level[it.i] > 0;
      let pHave = owned ? rel + (1 - rel) * pLate : pLate;
      for (const cap of it.requires) {
        if (!(capProviders[cap] || []).some((p) => level[p] > 0)) pHave = 0;
      }
      if (pHave <= 0) continue;
      // Expected fraction removed: the owned level if it works, else
      // whatever could be bought late.
      const removed = (owned ? rel * fractionAt(r, level[it.i]) + (1 - rel) * pLate * fractionAt(r, it.lateLevel) : pLate * fractionAt(r, it.lateLevel));
      if (r.group) (groups[r.group] ||= []).push([removed / pHave, pHave]);
      else keep *= 1 - removed;
    }
    for (const list of Object.values(groups)) {
      // Within a group only the best item present counts.
      list.sort((a, b) => b[0] - a[0]);
      let none = 1, removed = 0;
      for (const [f, pHave] of list) { removed += none * pHave * f; none *= 1 - pHave; }
      keep *= 1 - removed;
    }
    return keep;
  }
  function exposureHarm(hz, level) {
    let usd = 0, mm = 0;
    for (const x of hz.exposures) {
      if (x.usd) usd += x.usd * chanKeep(x.c, hz, level, 'hardship');
      if (x.mm) mm += x.mm * chanKeep(x.c, hz, level, 'mortality');
    }
    return [hz.p * usd, hz.p * mm];
  }
  const curX = hazards.map(() => [0, 0]);

  function refresh(level) {
    for (let e = 0; e < E; e++) {
      const r = eventHarm(e, null, level, true);
      cur$[e] = r.usd; curM[e] = r.mm;
    }
    hazards.forEach((hz, h) => { curX[h] = exposureHarm(hz, level); });
  }

  function total(level) {
    let usd = 0, mm = 0;
    for (let e = 0; e < E; e++) { usd += ev.w[e] * cur$[e]; mm += ev.w[e] * curM[e]; }
    for (const x of curX) { usd += x[0]; mm += x[1]; }
    if (level) for (const it of items) if (it.annual && level[it.i] > 0) { usd += it.annual.usd; mm += it.annual.mm; }
    return { usd, mm };
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
    let usd = 0, mm = 0;
    const per = byHazard ? hazards.map(() => [0, 0]) : null;
    for (const e of events) {
      const r = eventHarm(e, needSet, level, commit);
      const dU = ev.w[e] * (cur$[e] - r.usd), dM = ev.w[e] * (curM[e] - r.mm);
      usd += dU; mm += dM;
      if (per) { per[ev.hz[e]][0] += dU; per[ev.hz[e]][1] += dM; }
      if (commit) { cur$[e] = r.usd; curM[e] = r.mm; }
    }
    if (chans.size) {
      hazards.forEach((hz, h) => {
        if (!hz.exposures.some((x) => chans.has(x.c))) return;
        const x = exposureHarm(hz, level);
        usd += curX[h][0] - x[0]; mm += curX[h][1] - x[1];
        if (per) { per[h][0] += curX[h][0] - x[0]; per[h][1] += curX[h][1] - x[1]; }
        if (commit) curX[h] = x;
      });
    }
    add.forEach(([i, lv], n) => {
      const a = items[i].annual;
      if (a && old[n] === 0 && lv > 0) { usd -= a.usd; mm -= a.mm; }
    });
    if (!commit) add.forEach(([i], n) => { level[i] = old[n]; });
    return { usd, mm, per };
  }

  // Annual cost and upfront outlay of raising an item from one level to another.
  function cost(i, from, to) {
    const it = items[i];
    const units = (it.unitsAt(to) - it.unitsAt(from)) * it.scale;
    return {
      annual: units * it.perUnit + (from === 0 ? it.fixed : 0),
      upfront: units * it.unitUsd + (from === 0 ? it.fixedUsd : 0),
      hours: from === 0 ? (it.spec.setupHours || 0) : 0,
      units,
    };
  }

  return {
    v, timeValue, items, needs, hazards, needIds, channelIds, E, people,
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
// level: each higher level (so that a ladder whose first step is worth little
// but whose third is worth a lot is seen whole), together with whatever the
// item needs in order to work, and with each item it is marked as pairing with.
function candidates(W, level) {
  const out = [];
  const index = W.itemIndex;
  for (const it of W.items) {
    if (!it.applicable || level[it.i] >= it.maxLevel) continue;
    const extra = [];
    let ok = true;
    for (const cap of it.requires) {
      const providers = (W.capProviders[cap] || []).filter((p) => W.items[p].applicable);
      if (providers.some((p) => level[p] > 0)) continue;
      if (!providers.length) { ok = false; break; }
      const cheapest = providers.reduce((a, b) => (W.cost(a, 0, 1).annual <= W.cost(b, 0, 1).annual ? a : b));
      if (cheapest !== it.i && !extra.some(([i]) => i === cheapest)) extra.push([cheapest, 1]);
    }
    if (!ok) continue;
    for (let lv = level[it.i] + 1; lv <= it.maxLevel; lv++) out.push([[it.i, lv], ...extra]);
    for (const id of it.spec.bundleWith || []) {
      const j = index[id];
      if (j === undefined || !W.items[j].applicable || level[j] > 0 || extra.some(([i]) => i === j)) continue;
      out.push([[it.i, level[it.i] + 1], ...extra, [j, 1]]);
    }
  }
  return out;
}

function costOf(W, level, add) {
  const c = { annual: 0, upfront: 0, hours: 0 };
  for (const [i, lv] of add) {
    const x = W.cost(i, level[i], lv);
    c.annual += x.annual; c.upfront += x.upfront; c.hours += x.hours;
  }
  return c;
}

function ratioOf(value, annual) {
  if (annual > 0) return value / annual;
  return value > 0 ? Infinity : 0;
}

export function rank(data, settings) {
  const m = resolveModel(data, null);
  const W = buildWorld(m, settings);
  const level = ownedLevels(W, settings);
  W.refresh(level);
  const baseline = (() => {
    const W0 = buildWorld(m, settings);
    W0.refresh(W0.newLevel());
    return W0.total(null);
  })();
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
        hit = { usd: x.usd, mm: x.mm, t: touched(add) };
        cache.set(key, hit);
      }
      const c = costOf(W, level, add);
      const value = hit.usd + W.v * hit.mm;
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
    const value = d.usd + W.v * d.mm;
    const byHazard = W.hazards
      .map((hz, h) => ({ id: hz.id, p: hz.p, value: d.per[h][0] + W.v * d.per[h][1] }))
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
        return { id: it.id, level: lv, label: it.ladder ? it.ladder[lv - 1].label : null, units: it.unitsAt(lv) * it.scale };
      }),
      add: add.map(([i, lv]) => [W.items[i].id, lv]),
      upfrontUsd: c.upfront, setupHours: c.hours, annualCostUsd: c.annual,
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
    harm: { unprepared: baseline, start, end: W.total(level) },
    hazards: W.hazards.map((hz) => ({ id: hz.id, p: hz.p })),
    events: W.E,
  };
}

// How sure is each entry? Samples every uncertain parameter, replays the
// ranked order, and reports the spread of each entry's ratio.
// With `raw`, returns each entry's sampled ratios instead of their summary.
export function robustness(data, settings, order, { samples = 200, seed = 1, raw = false } = {}) {
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
      ratios[n].push(ratioOf(d.usd + W.v * d.mm, c.annual));
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
