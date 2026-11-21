// Tests for the engine on a small synthetic model whose answers can be worked
// out by hand. Run with: node --test

import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rank, robustness, cumulative, windowDays, drawTriple, meanTriple, resolveModel, normInv, STRATA, leadFactor, valuePeople, annuity, defaultSettings } from '../src/model.mjs';

const flat = (v) => ({ lo: v, mid: v, hi: v });
const fixed = (days) => ({ p50: days, p90: days, p99: days });
const noLeave = { feasible: 0, earliestDay: 0, fixedUsdPerHousehold: 0, usdPerPersonDay: 0 };

// One hazard, once a decade: no safe water for exactly five days. A household
// holds one day's worth. A day without water costs $50 a person, and from the
// third such day 10 micromorts a person. A micromort is worth $10.
function fixture() {
  return {
    defaults: {
      location: 'us', outlook: 'forecast', dwelling: 'apartment', car: false,
      cooking: 'electric', heating: 'electric', airConditioning: true, pumpedWater: false,
      household: { adults: 2 }, ticks: {}, owned: {},
    },
    parameters: {
      micromortValueUsd: { us: 10 },
      timeValueUsdPerHour: { us: 20 },
      realDiscountRate: 0.03,
      storageCostUsdPerLitreYear: { apartment: 0, house: 0 },
      priceIndex: { us: 1 },
      homePresence: 1,
      leaveHardshipUsdPerPersonDay: 0,
    },
    needs: {
      water: {
        per: 'person', gap: 'water', special: 'water', demandPerPersonDay: 3, baselineDays: flat(1),
        hardship: { steps: [{ fromDay: 1, ...flat(50) }] },
        mortality: { steps: [{ fromDay: 1, ...flat(0) }, { fromDay: 3, ...flat(10) }] },
      },
    },
    channels: { fire: {}, co: {} },
    hazards: {
      storm: {
        probability: { us: 0.1 },
        windows: { water: { pOccur: 1, days: fixed(5), shareTreatable: 0 } },
        leave: noLeave, warningDays: 0, lateBuy: { staple: 0, specialty: 0 },
      },
    },
    items: [{
      id: 'water', scalesWith: 'person',
      ladder: [{ label: '2 days', units: 6 }, { label: '4 days', units: 12 }],
      price: 1, lifeYears: 10, reliability: 1, lateBuyClass: 'staple',
      effects: [{ type: 'supply', need: 'water', amount: 1 }],
    }],
  };
}
const CRF10 = 0.03 / (1 - Math.pow(1.03, -10));
// Deaths are capped at one per person, which shaves a few parts in 100,000
// off small risks; hand calculations are compared to that tolerance.
const near = (a, b, tol = 2e-4) => assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)), `${a} is not ${b}`);
const run = (data, patch = {}) => rank(data, { ...data.defaults, ...patch });
const entry = (r, id, level) => r.entries.find((e) => e.items.some((x) => x.id === id && (level === undefined || x.level === level)));

test('numeric helpers', () => {
  near(normInv(0.5), 0);
  near(normInv(0.95), 1.6448536269514722, 1e-8);
  near(STRATA.reduce((s, [, w]) => s + w, 0), 1);
  near(cumulative([{ fromDay: 1, v: 0 }, { fromDay: 3, v: 10 }], 4), 20);
  near(cumulative([{ fromDay: 1, v: 5 }], 2.5), 12.5);
  near(windowDays(fixed(5), 0.01), 5);
  near(windowDays({ p50: 2, p90: 6, p99: 20 }, 0.5), 2);
  near(windowDays({ p50: 2, p90: 6, p99: 20 }, 0.9), 6, 1e-6);
  near(windowDays({ p50: 2, p90: 6, p99: 20 }, 0.99), 20, 1e-6);
  assert.equal(windowDays({ p50: 2, p90: 6, p99: 20 }, 0.999999), 30);
  near(drawTriple({ lo: 1, mid: 2, hi: 8 }, 0), 2);
  near(drawTriple({ lo: 1, mid: 2, hi: 8 }, 1.6448536269514722), 8);
  near(drawTriple({ lo: 1, mid: 2, hi: 8 }, -1.6448536269514722), 1);
  near(drawTriple({ lo: 0, mid: 0.5, hi: 1, max: 0.9 }, 1.6448536269514722), 0.9);
  assert.deepEqual(resolveModel({ a: flat(3), steps: [{ fromDay: 1, ...flat(2) }] }, null), { a: 3, steps: [{ fromDay: 1, v: 2 }] });
});

test('stored water: value, cost and ratio match the hand calculation', () => {
  const r = run(fixture());
  // Unprepared: 4 unmet days. Hardship 4 x $50 x 2 people = $400; mortality
  // 2 days x 10 x 2 people = 40 micromorts = $400. Times 0.1 a year.
  near(r.harm.unprepared.usd, 40);
  near(r.harm.unprepared.mm, 4);
  assert.equal(r.entries.length, 2);
  const [a, b] = r.entries;
  // First step covers days 2 and 3: 2 unmet days remain, none past the third.
  assert.equal(a.items[0].label, '2 days');
  near(a.hardshipUsd, 20);
  near(a.micromorts, 4);
  near(a.valueUsd, 60);
  near(a.upfrontUsd, 12);
  near(a.annualCostUsd, 12 * CRF10);
  near(a.ratio, 60 / (12 * CRF10));
  // Second step covers the rest.
  near(b.hardshipUsd, 20);
  near(b.micromorts, 0);
  near(b.ratio, 20 / (12 * CRF10));
  near(r.harm.end.usd, 0);
  near(r.harm.end.mm, 0);
  near(b.cumulativeUpfrontUsd, 24);
});

test('value is proportional to the hazard probability, and zero without it', () => {
  const d = fixture();
  const base = run(d).entries[0].valueUsd;
  near(run(d, { probabilities: { storm: 0.2 } }).entries[0].valueUsd, 2 * base);
  near(run(d, { probabilities: { storm: 0 } }).entries[0].valueUsd, 0);
});

test('break-even probability', () => {
  const a = run(fixture()).entries[0];
  assert.equal(a.breakEven.hazard, 'storm');
  near(a.breakEven.probability, 0.1 * (12 * CRF10) / 60);
});

test('adding a person never lowers the value of stored water', () => {
  const d = fixture();
  const two = run(d).entries[0];
  const three = run(d, { household: { adults: 3 } }).entries[0];
  assert.ok(three.valueUsd >= two.valueUsd);
  near(three.valueUsd, 1.5 * two.valueUsd);
  near(three.ratio, two.ratio);
});

test('older people count for more where the need says so', () => {
  const d = fixture();
  d.needs.water.multipliers = { age75plus: { mortality: 5 } };
  const r = run(d, { household: { adults: 1, age75plus: 1 } });
  near(r.harm.unprepared.mm, 0.1 * 20 * (1 + 5));
});

test('what is already owned is not ranked again', () => {
  const r = run(fixture(), { owned: { water: 1 } });
  assert.equal(r.entries.length, 1);
  assert.equal(r.entries[0].items[0].level, 2);
  near(r.entries[0].valueUsd, 20);
  near(r.harm.start.usd, 20);
});

test('an item that can be bought once the event is foreseen earns nothing from it', () => {
  const d = fixture();
  d.hazards.storm.warningDays = 2;
  d.hazards.storm.lateBuy = { staple: 1, specialty: 0 };
  d.items[0].ladder = [{ label: '4 days', units: 12 }];
  near(run(d).entries[0].valueUsd, 0);
  d.hazards.storm.lateBuy = { staple: 0, specialty: 1 };
  near(run(d).entries[0].valueUsd, 80);
});

test('an unreliable item is worth its reliability', () => {
  const d = fixture();
  d.items[0].ladder = [{ label: '4 days', units: 12 }];
  d.items[0].reliability = 0.75;
  const v = run(d).entries[0].valueUsd;
  // Whether it works is decided per severity stratum, so the share that works
  // is close to, not exactly, the reliability.
  assert.ok(v > 0.55 * 80 && v < 0.95 * 80, String(v));
});

test('a way to treat water substitutes for stored water when water is treatable', () => {
  const d = fixture();
  d.hazards.storm.windows.water.shareTreatable = 1;
  d.hazards.storm.windows.power = { pOccur: 1, days: fixed(5) };
  d.items.push({ id: 'filter', scalesWith: 'household', price: 30, lifeYears: 10, reliability: 1, lateBuyClass: 'specialty', effects: [{ type: 'capability', capability: 'treatWater' }] });
  near(run(d, { owned: { filter: 1 } }).harm.start.usd, 0);
  near(run(d, { owned: { filter: 1 } }).entries[0].valueUsd, 0);
  // Stored water ranks first on its ratio and leaves the filter nothing to
  // do; alone, the filter averts the whole harm.
  near(entry(run(d), 'filter').valueUsd, 0);
  const alone = { ...d, items: [d.items[1]] };
  near(run(alone).entries[0].valueUsd, 80);
  // With the cooker working, the household would have boiled it anyway.
  delete d.hazards.storm.windows.power;
  near(run(d).harm.unprepared.usd, 0);
});

test('food that needs cooking is worthless without a way to cook, and is offered with one', () => {
  const d = fixture();
  d.needs = {
    food: {
      per: 'person', gap: 'food', special: 'food', demandPerPersonDay: 1, baselineDays: flat(0), noCookShare: 0,
      hardship: { steps: [{ fromDay: 1, ...flat(30) }] }, mortality: { steps: [{ fromDay: 1, ...flat(0) }] },
    },
  };
  d.hazards.storm.windows = { food: { pOccur: 1, days: fixed(5) }, power: { pOccur: 1, days: fixed(5) } };
  d.items = [
    { id: 'rice', scalesWith: 'person', ladder: [{ label: '5 days', units: 5 }], price: 2, lifeYears: 10, reliability: 1, lateBuyClass: 'staple', bundleWith: ['stove'], effects: [{ type: 'supply', need: 'food', amount: 1, pool: 'cook' }] },
    { id: 'stove', scalesWith: 'household', price: 30, lifeYears: 10, reliability: 1, lateBuyClass: 'staple', effects: [{ type: 'capability', capability: 'cook' }, { type: 'supply', capability: 'cook', amount: 10, perDay: 1 }] },
  ];
  const r = run(d);
  // Neither is worth anything alone, so the first entry must be the pair.
  assert.equal(r.entries[0].items.length, 2);
  near(r.entries[0].valueUsd, 0.1 * 5 * 30 * 2);
  near(run(d, { owned: { rice: 1 } }).harm.start.usd, 30);
  near(run(d, { owned: { rice: 1, stove: 1 } }).harm.start.usd, 0);
  // With a gas cooker and the gas on, the rice is enough.
  near(run(d, { owned: { rice: 1 }, cooking: 'gas' }).harm.start.usd, 0);
});

test('the option to leave caps the harm, and makes partial stocks worth less', () => {
  const d = fixture();
  d.hazards.storm.leave = { feasible: 1, earliestDay: 0, fixedUsdPerHousehold: 0, usdPerPersonDay: 10 };
  const r = run(d);
  // Unprepared: leave on day 1, when the household's own water runs out, and
  // pay $10 x 2 people x 4 days = $80.
  near(r.harm.unprepared.usd, 8);
  near(r.harm.unprepared.mm, 0);
  // Two days of water only delays leaving (worth $2 a year); four days makes
  // it unnecessary ($8 a year). The ranking must see the ladder whole.
  assert.equal(r.entries[0].items[0].label, '4 days');
  near(r.entries[0].valueUsd, 8);
  assert.equal(r.entries.length, 1);
});

test('an item can make leaving likelier to be possible, and cheaper', () => {
  const d = fixture();
  d.hazards.storm.leave = { feasible: 0.5, earliestDay: 0, fixedUsdPerHousehold: 0, usdPerPersonDay: 10, halfLifeDays: Infinity };
  d.items = [{ id: 'plan', scalesWith: 'household', price: 0, lifeYears: 5, setupHours: 2, reliability: 1, lateBuyClass: 'none', effects: [{ type: 'leave', feasible: 0.6, cost: 0.25 }] }];
  const r = run(d);
  // Unprepared: half can leave (paying $80), half stay ($400 and 40 micromorts).
  near(r.harm.unprepared.usd, 0.1 * (0.5 * 80 + 0.5 * 400));
  near(r.harm.unprepared.mm, 0.1 * 0.5 * 40);
  // With the plan: 80% can leave, paying $60.
  near(r.entries[0].hardshipUsd, 0.1 * ((0.5 * 80 + 0.5 * 400) - (0.8 * 60 + 0.2 * 400)));
  near(r.entries[0].micromorts, 0.1 * (0.5 - 0.2) * 40);
  near(r.entries[0].annualCostUsd, 2 * 20 * 0.03 / (1 - Math.pow(1.03, -5)));
});

test('a fixed price is paid once, with the first level', () => {
  const d = fixture();
  Object.assign(d.items[0], { scalesWith: 'household', fixedPrice: 100, price: 5, ladder: [{ label: 'a', units: 6 }, { label: 'b', units: 12 }] });
  const r = run(d);
  const total = r.entries.reduce((s, e) => s + e.upfrontUsd, 0);
  near(total, 100 + 12 * 5);
  near(r.entries.reduce((s, e) => s + e.annualCostUsd, 0), 160 * CRF10);
});

test('ownership risks, practice, and fractions that grow with the level owned', () => {
  const d = fixture();
  d.hazards.fire = {
    probability: { us: 1 }, windows: {}, leave: noLeave, warningDays: 0, lateBuy: { staple: 0, specialty: 0 },
    exposures: [{ channel: 'fire', micromortsPerPerson: 100 }],
    exposureScale: { dwelling: { apartment: 0.5, house: 2 } },
  };
  const base = { scalesWith: 'household', price: 10, lifeYears: 10, reliability: 1, lateBuyClass: 'none' };
  // The exposure is halved in an apartment: 100 x 2 people x 0.5.
  d.items = [{ ...base, id: 'gun', effects: [{ type: 'reduce', target: 'fire', hazards: ['all'], fraction: 0.2 }, { type: 'annualRisk', micromortsPerPersonYear: 15 }] }];
  let r = run(d);
  near(r.harm.unprepared.mm, 4 + 100);
  near(r.entries[0].micromorts, 0.2 * 100 - 2 * 15);
  near(r.harm.end.mm, 4 + 80 + 30);
  near(run(d, { dwelling: 'house' }).entries[0].micromorts, 0.2 * 400 - 30);
  // A fraction that depends on the level owned.
  d.items = [{ ...base, id: 'stock', ladder: [{ label: 'a', units: 1 }, { label: 'b', units: 2 }], effects: [{ type: 'reduce', target: 'fire', hazards: ['all'], fractionByLevel: [0.1, 0.3], adherence: 0.5 }] }];
  r = run(d);
  near(r.entries.reduce((s, e) => s + e.micromorts, 0), 0.3 * 0.5 * 100);
  // Practice: a half-reliable alarm becomes fully reliable with a factor of 0.
  d.items = [
    { ...base, id: 'alarm', reliability: 0.5, effects: [{ type: 'reduce', target: 'fire', hazards: ['all'], fraction: 0.4 }] },
    { ...base, id: 'practice', price: 0, effects: [{ type: 'review', failureFactor: 0 }] },
  ];
  near(run(d, { owned: { alarm: 1 } }).harm.start.mm, 4 + 100 * (1 - 0.5 * 0.4));
  r = run(d, { owned: { alarm: 1 } });
  near(entry(r, 'practice').micromorts, 100 * 0.5 * 0.4);
});

test('reducers scale harm; within a group only the best counts', () => {
  const d = fixture();
  d.hazards.fire = {
    probability: { us: 0.01 }, windows: {}, leave: noLeave, warningDays: 0, lateBuy: { staple: 0, specialty: 0 },
    exposures: [{ channel: 'fire', micromortsPerPerson: 100, financialUsdPerHousehold: 1000 }],
  };
  const alarm = (id, f, group) => ({ id, scalesWith: 'household', price: 20, lifeYears: 10, reliability: 1, lateBuyClass: 'staple', effects: [{ type: 'reduce', target: 'fire', hazards: ['all'], fraction: f, adherence: 1, on: 'mortality', group }] });
  d.items = [alarm('alarm', 0.5)];
  let r = run(d);
  near(r.harm.unprepared.mm, 4 + 0.01 * 100 * 2);
  near(r.entries[0].micromorts, 0.01 * 100 * 2 * 0.5);
  near(r.entries[0].hardshipUsd, 0);
  d.items = [alarm('a', 0.5, 'alarms'), alarm('b', 0.8, 'alarms')];
  r = run(d, { owned: { a: 1 } });
  near(r.entries[0].micromorts, 0.01 * 100 * 2 * (0.8 - 0.5));
  d.items = [alarm('a', 0.5), alarm('b', 0.8)];
  r = run(d, { owned: { a: 1 } });
  near(r.entries[0].micromorts, 0.01 * 100 * 2 * 0.5 * 0.8);
  // Reducing a need rather than a channel.
  d.items = [{ id: 'bag', scalesWith: 'person', price: 50, lifeYears: 10, reliability: 1, lateBuyClass: 'staple', effects: [{ type: 'reduce', target: 'water', hazards: ['storm'], fraction: 0.5, adherence: 0.5, on: 'mortality' }] }];
  r = run(d);
  near(r.entries[0].micromorts, 4 * 0.25);
  near(r.entries[0].hardshipUsd, 0);
});

test('warmth counts only in the cold, for households that say they have winters', () => {
  const d = fixture();
  d.needs.warmth = {
    per: 'person', gap: 'warmth', baselineDays: flat(0),
    hardship: { steps: [{ fromDay: 1, ...flat(40) }] }, mortality: { steps: [{ fromDay: 1, ...flat(5) }] },
  };
  d.hazards.storm.windows = { power: { pOccur: 1, days: fixed(2) } };
  d.hazards.storm.coldShare = 0.25;
  d.items = [
    { id: 'heater', scalesWith: 'household', price: 100, lifeYears: 10, reliability: 1, lateBuyClass: 'specialty', effects: [{ type: 'supply', need: 'warmth', amount: 1 }, { type: 'sideRisk', need: 'warmth', channel: 'co', micromortsPerDay: 2 }] },
    { id: 'co-alarm', scalesWith: 'household', price: 25, lifeYears: 7, reliability: 1, lateBuyClass: 'staple', effects: [{ type: 'reduce', target: 'co', hazards: ['all'], fraction: 0.5, adherence: 1 }] },
  ];
  near(run(d).harm.unprepared.usd, 0);
  let r = run(d, { ticks: { coldWinters: true } });
  // 0.1 a year x 0.25 cold x 2 days x 2 people.
  near(r.harm.unprepared.usd, 0.1 * 0.25 * 2 * 2 * 40);
  near(r.harm.unprepared.mm, 0.1 * 0.25 * 2 * 2 * 5);
  // The heater covers one of the two days, at 2 micromorts a person for the
  // day it runs: 5 averted, 2 added, per person.
  near(entry(r, 'heater').micromorts, 0.1 * 0.25 * 2 * (5 - 2));
  // A CO alarm halves the heater's own risk.
  r = run(d, { ticks: { coldWinters: true }, owned: { heater: 1 } });
  near(entry(r, 'co-alarm').micromorts, 0.1 * 0.25 * 2 * (0.5 * 2));
  near(run(d, { ticks: { coldWinters: true }, heating: 'independent' }).harm.unprepared.usd, 0);
});

test('conditions gate items; tick-boxes gate hazards', () => {
  const d = fixture();
  d.items.push({ id: 'car-kit', scalesWith: 'household', conditions: ['car'], price: 50, lifeYears: 10, reliability: 1, lateBuyClass: 'staple', effects: [{ type: 'reduce', target: 'water', hazards: ['all'], fraction: 0.1 }] });
  assert.equal(entry(run(d), 'car-kit'), undefined);
  assert.ok(entry(run(d, { car: true }), 'car-kit'));
  d.hazards.storm.tickBox = 'hurricane';
  assert.equal(run(d).hazards.length, 0);
  assert.equal(run(d, { ticks: { hurricane: true } }).hazards.length, 1);
});

test('location and outlook select the probability', () => {
  const d = fixture();
  d.hazards.storm.probability = { us: { forecast: 0.1, pessimistic: 0.3 }, all: 0.05 };
  d.parameters.micromortValueUsd.other = 10;
  d.parameters.timeValueUsdPerHour.other = 20;
  d.parameters.priceIndex.other = 2;
  near(run(d).hazards[0].p, 0.1);
  near(run(d, { outlook: 'pessimistic' }).hazards[0].p, 0.3);
  const r = run(d, { location: 'other' });
  near(r.hazards[0].p, 0.05);
  near(r.entries[0].upfrontUsd, 24);
});

test('costs: everyday share, upkeep, time and storage', () => {
  const d = fixture();
  d.parameters.storageCostUsdPerLitreYear.apartment = 0.5;
  Object.assign(d.items[0], { ladder: undefined, scalesWith: 'household', price: 100, everydayShare: 0.6, setupHours: 2, upkeepHoursPerYear: 0.5, upkeepUsdPerYear: 3, volumeLitres: 4 });
  const c = run(d).entries[0];
  near(c.annualCostUsd, 100 * (0.4 * CRF10 + 0.6 * 0.03) + 4 * 0.5 + 2 * 20 * CRF10 + 0.5 * 20 + 3);
  near(c.setupHours, 2);
});

test('the ranking is deterministic and, among pure substitutes, never rises', () => {
  const d = fixture();
  d.items[0].ladder = [1, 2, 3, 4, 5, 6].map((n) => ({ label: `${n} L`, units: n * 2 }));
  const a = run(d), b = run(d);
  assert.deepEqual(a, b);
  for (let i = 1; i < a.entries.length; i++) assert.ok(a.entries[i].ratio <= a.entries[i - 1].ratio + 1e-9);
});

test('the year of full automation shifts hazard probabilities, more the sooner it comes', () => {
  const d = fixture();
  const leads = [1, 3, 5, 8, 12, 20, 30];
  const f = [2, 1.5, 1, 0.8, 0.6, 0.5, 0.5];
  d.ai = {
    startYear: 2027, transitionYears: 5, horizonYears: 5, pExistential: 0.2,
    hazards: { storm: { all: { now: 0.2, transition: 0.4, after: 0.05 } } },
    leadTime: { turbulentYears: 5, runUpYears: 2, leads, existential: f, hazards: { storm: { factors: f } }, afterShare: { leads: [1, 3, 5], values: [0.4, 0.15, 0] } },
  };
  const run1 = (ai) => run(d, { ai });
  const p = (ai) => run1(ai).hazards[0].p;
  // Straight lines between lead times, flat beyond the ends.
  near(leadFactor(leads, f, 4.5), 1.125);
  near(leadFactor(leads, f, 0.5), 2);
  near(leadFactor(leads, f, 40), 0.5);
  // No year: AI left out, the model's own rate (0.1).
  near(p(undefined), 0.1);
  near(p({ automationYear: null }), 0.1);
  // Automation in mid-2031: lead time 4.5 years, factor 1.125, so the
  // turbulent rate is 0.2 + 0.2 x 1.125 = 0.425 for the 54 months to then.
  // In the last 6 months the rate is 3.75% of the way from 0.05 back to 0.4,
  // a share that fades over 5 years (to 95% of it on average here):
  // 0.05 + 0.35 x 0.0375 x 0.95 = 0.062469. The average over 60 months is
  // 0.388747, 0.188747 above today's.
  near(p({ automationYear: 2031 }), 0.288747, 1e-6);
  // In 2036: lead time 9.5, factor 0.725, turbulent rate 0.345 from mid-2031;
  // the run-up reaches half of the excess in 2030 and all of it in 2031:
  // 0.145 x 1.5 / 5 = 0.0435 above today's.
  near(p({ automationYear: 2036 }), 0.1435);
  // In 2040: the run-up starts after the five-year horizon.
  near(p({ automationYear: 2040 }), 0.1);
  // A longer horizon reaches it.
  assert.ok(p({ automationYear: 2040, horizonYears: 12 }) > 0.1);
  // The chance that no existential catastrophe has happened, for automation
  // in 2031: the odds of 0.2 (0.25) times 1.125 give 0.2195, spread over the
  // turbulent years still ahead, 2027-2031.5, so on average 55% of it has
  // elapsed over the horizon.
  near(run1({ automationYear: 2031 }).survival, 1 - (0.28125 / 1.28125) * 0.55, 1e-6);
  // A probability the reader sets by hand overrides all of it.
  near(run(d, { ai: { automationYear: 2031 }, probabilities: { storm: 0.07 } }).hazards[0].p, 0.07);
});

test('robustness: no uncertainty gives no spread; uncertainty gives some', () => {
  const d = fixture();
  let r = run(d);
  let u = robustness(d, d.defaults, r.entries, { samples: 20 });
  near(u[0].p05, r.entries[0].ratio);
  near(u[0].p95, r.entries[0].ratio);
  assert.equal(u[0].pAbove1, 1);
  d.hazards.storm.probability.us = { lo: 0.001, mid: 0.1, hi: 0.5, max: 1 };
  r = run(d);
  u = robustness(d, d.defaults, r.entries, { samples: 200 });
  assert.ok(u[0].p05 < r.entries[0].ratio && r.entries[0].ratio < u[0].p95);
  assert.ok(u[0].pAbove1 > 0.5 && u[0].pAbove1 <= 1);
});

test('nobody dies more than once', () => {
  const d = fixture();
  d.needs.water.mortality = { steps: [{ fromDay: 1, ...flat(2e6) }] };
  const r = run(d);
  // Four unmet days at 2 million micromorts a day: certain death, twice over.
  assert.ok(r.harm.unprepared.mm < 0.1 * 2 * 1e6 && r.harm.unprepared.mm > 0.1 * 2 * 0.999e6);
  d.hazards.fire = { probability: { us: 1 }, windows: {}, leave: noLeave, warningDays: 0, lateBuy: { staple: 0, specialty: 0 }, exposures: [{ channel: 'fire', micromortsPerPerson: 5e6 }] };
  d.hazards.storm.probability.us = 0;
  assert.ok(run(d).harm.unprepared.mm < 2e6);
});

test('a household short of food rations it', () => {
  const d = fixture();
  d.needs = {
    food: {
      per: 'person', gap: 'food', special: 'food', demandPerPersonDay: 1, baselineDays: flat(10),
      hardship: { steps: [{ fromDay: 1, ...flat(100) }] }, mortality: { steps: [{ fromDay: 1, ...flat(1000) }] },
      rationing: {
        half: { hardship: { steps: [{ fromDay: 1, ...flat(20) }] }, mortality: { steps: [{ fromDay: 1, ...flat(1) }] } },
        quarter: { hardship: { steps: [{ fromDay: 1, ...flat(60) }] }, mortality: { steps: [{ fromDay: 1, ...flat(5) }] } },
      },
    },
  };
  d.items = [];
  const harm = (days) => { d.hazards.storm.windows = { food: { pOccur: 1, days: fixed(days) } }; return run(d).harm.unprepared; };
  near(harm(8).usd, 0);
  // 15 days on 10 days of food: half rations for 10 days.
  near(harm(15).usd, 0.1 * 2 * 10 * 20);
  near(harm(15).mm, 0.1 * 2 * 10 * 1);
  // 30 days: half rations for 10 days, quarter rations for 20.
  near(harm(30).usd, 0.1 * 2 * (10 * 20 + 20 * 60));
  // 50 days: quarter rations for 40 days, then 10 with nothing.
  near(harm(50).usd, 0.1 * 2 * (40 * 60 + 10 * 100));
  // Eating in full and fasting two days would cost more than rationing here,
  // but for a very short gap it can cost less: 11 days is 2 days on half
  // rations ($40) against one day with nothing ($100).
  near(harm(11).usd, 0.1 * 2 * 2 * 20);
});

test('being forced out is its own branch of an event', () => {
  const d = fixture();
  d.hazards.storm.windows.displacement = { pOccur: 0.25, days: fixed(30) };
  d.needs.displacement = {
    per: 'person', gap: 'displacement', leaveEnds: false, home: false, baselineDays: 0,
    hardship: { steps: [{ fromDay: 1, ...flat(10) }] }, mortality: { steps: [{ fromDay: 1, ...flat(0) }] },
  };
  const r = run(d);
  // A quarter of events: away for 30 days, so the 5 days without water at
  // home do not arise, and 30 days displaced. The rest: as before.
  near(r.harm.unprepared.usd, 0.1 * (0.75 * 400 + 0.25 * 2 * 30 * 10));
  near(r.harm.unprepared.mm, 0.1 * 0.75 * 40);
});

test('those who cannot leave at first find a way in time', () => {
  const d = fixture();
  d.hazards.storm.windows.water.days = fixed(60);
  d.hazards.storm.leave = { feasible: 0.5, earliestDay: 0, fixedUsdPerHousehold: 0, usdPerPersonDay: 1, halfLifeDays: Infinity };
  const stuck = run(d).harm.unprepared.usd;
  d.hazards.storm.leave.halfLifeDays = 10;
  const moving = run(d).harm.unprepared.usd;
  assert.ok(moving < 0.6 * stuck, `${moving} against ${stuck}`);
});

test('ranking on averages gives skewed quantities their expected value', () => {
  near(meanTriple({ lo: 3, mid: 3, hi: 3 }), 3);
  // A lognormal with median 1 and 95th percentile e^1.645 has sigma 1: mean e^0.5,
  // a little less here because draws are capped at 2.5 deviations.
  const m = meanTriple({ lo: Math.exp(-1.6448536269514722), mid: 1, hi: Math.exp(1.6448536269514722) });
  assert.ok(m > 1.5 && m < Math.exp(0.5), String(m));
  const d = fixture();
  d.hazards.storm.probability.us = { lo: 0.01, mid: 0.1, hi: 1, max: 1 };
  const median = run(d).entries[0].valueUsd;
  const mean = run(d, { rankOn: 'mean' }).entries[0].valueUsd;
  near(median, 60);
  near(mean, 60 * meanTriple(d.hazards.storm.probability.us) / 0.1);
  assert.ok(mean > 1.5 * median);
});

// ---------------------------------------------------------------------------
// Members valued one by one
// ---------------------------------------------------------------------------

const adult = (id, extra = {}) => ({ id, age: 'adult', valuation: 'personal', ...extra });
const ctx = (extra = {}) => ({
  v: 10, timeValue: 20, rate: 0.04, life: null, costPerLife: 0, currentYear: 2026,
  horizonYears: 5, automationYear: 0, deathValue: 'lifeYears', hoursPerYear: 1800, counterfactual: 0.5, ...extra,
});

test('the impartial value of a micromort: the worked check', () => {
  // Age 35, $100 an hour, 1,800 hours a year, half of it counterfactual, for
  // 30 years at 4%: 90,000 x 17.292 = $1.556M, so about $1.6 per micromort.
  near(annuity(0.04, 30), 17.29203, 1e-6);
  // The model's adult (15-59) is taken to be 37, so works 28 more years to
  // 65: 90,000 x 16.663 = $1.50M.
  const [p] = valuePeople([{ age: 'adult', valuation: 'impartial', hourValue: 100, hoursPerYear: 1800, counterfactual: 0.5, flags: {} }], ctx());
  near(p.v, 1e-6 * 90000 * annuity(0.04, 28));
  assert.equal(p.impactEndYear, 2054);
  assert.ok(p.v > 1.45 && p.v < 1.55);
  // Its own wellbeing is priced at the cost of saving a life elsewhere: here
  // $5,000, half a cent a micromort; and its hardship at 5,000 / 10M.
  const [q] = valuePeople([{ age: 'adult', valuation: 'impartial', hourValue: 100, flags: {} }], ctx({ costPerLife: 5000 }));
  near(q.v, p.v + 0.005);
  near(q.hw, 5000 / 10e6);
  // A lost day is the average calendar day's work at the full hour value.
  near(q.dv, 100 * 1800 / 365);
  // Work ends at full labour automation, if that comes before retirement.
  const [r] = valuePeople([{ age: 'adult', valuation: 'impartial', hourValue: 100, flags: {} }], ctx({ automationYear: 2031 }));
  near(r.v, 1e-6 * 90000 * annuity(0.04, 5));
  assert.equal(r.impactEndYear, 2031);
  const [r2] = valuePeople([{ age: 'adult', valuation: 'impartial', hourValue: 100, flags: {} }], ctx({ automationYear: 2080 }));
  assert.equal(r2.impactEndYear, 2054);
});

test('the personal value of a micromort scales with income and remaining life-years', () => {
  // Twice the local hour value, twice the value (income elasticity 1).
  const [a, b] = valuePeople([{ age: 'adult', flags: {} }, { age: 'adult', hourValue: 40, flags: {} }], ctx());
  near(a.v, 10);
  near(b.v, 20);
  near(a.hw, 1);
  assert.equal(a.dv, 0);
  // By remaining life-years: 10 left against 40 for the reference adult.
  const life = { child: 70, adult: 40, age60to74: 18, age75plus: 10, reference: 40 };
  const [c, d] = valuePeople([{ age: 'age75plus', flags: {} }, { age: 'child', flags: {} }], ctx({ life }));
  near(c.v, 10 * annuity(0.04, 10) / annuity(0.04, 40));
  near(d.v, 10 * annuity(0.04, 70) / annuity(0.04, 40));
  // Or the same for everyone.
  const [e] = valuePeople([{ age: 'age75plus', flags: {} }], ctx({ life, deathValue: 'equal' }));
  near(e.v, 10);
});

test('each member is valued at their own figure in the ranking', () => {
  // Person 2 earns twice the local wage: their micromorts are worth $20.
  // Unprepared: 0.1 x (2 x 4 x $50 + 2 days x 10 x ($10 + $20)) = $100.
  const r = run(fixture(), { people: [adult(1), adult(2, { hourValue: 40 })] });
  near(r.harm.unprepared.usd, 40);
  near(r.harm.unprepared.mm, 4);
  near(r.entries[0].valueUsd, 0.1 * (2 * 2 * 50 + 2 * 10 * 30));
  near(r.people[1].micromortValueUsd, 20);
});

test('a personal item is offered to each member and acts on its owner alone', () => {
  const d = fixture();
  d.channels.infection = {};
  d.hazards.flu = {
    probability: { us: 1 }, windows: {}, leave: noLeave, warningDays: 0, lateBuy: { staple: 0, specialty: 0 },
    exposures: [{ channel: 'infection', micromortsPerPerson: 100 }],
  };
  d.items.push({
    id: 'mask', perPerson: true, price: 10, fixedPrice: 30, lifeYears: 10, reliability: 1, lateBuyClass: 'none',
    effects: [{ type: 'reduce', target: 'infection', hazards: ['flu'], fraction: 0.5 }],
  });
  const r = run(d, { people: [adult(1), adult(2, { hourValue: 40 })] });
  const masks = r.entries.filter((e) => e.items[0].id === 'mask');
  assert.equal(masks.length, 2);
  const forWhom = Object.fromEntries(masks.map((e) => [e.items[0].person, e]));
  // Half of 100 micromorts, at each owner's value.
  near(forWhom['1'].micromorts, 50);
  near(forWhom['1'].valueUsd, 500);
  near(forWhom['2'].valueUsd, 1000);
  // The $30 fixed price (say, a fit-check kit) is paid with the first copy only.
  const first = masks[0], second = masks[1];
  near(first.upfrontUsd, 40);
  near(second.upfrontUsd, 10);
  assert.equal(first.items[0].person, '2');
});

test('impartial members lose work on unmet days; their comfort counts little', () => {
  const d = fixture();
  d.needs.water.workLoss = 0.5;
  d.parameters.costPerLifeSavedUsd = 0;
  // An impartial member at $73 an hour and 3,650 hours a year: a day's work
  // is $730; four unmet days cost 4 x 0.5 x $730 = $1,460, and their
  // hardship, at a cost per life of nil, nothing. The personal member's
  // hardship is 4 x $50.
  const people = [adult(1, { valuation: 'impartial', hourValue: 73, hoursPerYear: 3650 }), adult(2)];
  const r = run(d, { people });
  near(r.people[0].workDayUsd, 730);
  near(r.harm.unprepared.usd, 0.1 * (4 * 0.5 * 730 + 4 * 50));
});

test('a country with figures of its own replaces the preset', () => {
  const d = fixture();
  d.countries = { XX: { values: { 'storm.probability': 0.3, priceIndex: 2 } } };
  d.parameters.priceIndex = { us: 1 };
  const base = run(d).entries[0];
  const own = run(d, { country: 'XX' }).entries[0];
  near(own.valueUsd, 3 * base.valueUsd);
  near(own.upfrontUsd, 2 * base.upfrontUsd);
  // A country not in the data changes nothing.
  near(run(d, { country: 'YY' }).entries[0].valueUsd, base.valueUsd);
});

test('lost work from needs unmet on the same days is not double-counted', () => {
  const d = fixture();
  d.parameters.costPerLifeSavedUsd = 0;
  d.needs.water.workLoss = 0.5;
  // A second need, unmet on all five days of the same window, also costing
  // half a day's work a day, and nothing else.
  d.needs.heat = { per: 'person', gap: 'water', demandPerPersonDay: 1, baselineDays: 0, workLoss: 0.5,
    hardship: { steps: [{ fromDay: 1, ...flat(0) }] }, mortality: { steps: [{ fromDay: 1, ...flat(0) }] } };
  // One member, valued impartially, whose work day is worth $730. Water is
  // unmet on 4 days and heat on 5; taken to overlap, that is 1 day at a half
  // and 4 days at 1 − 0.5 × 0.5 = 0.75: 3.5 days, not 4.5.
  const people = [adult(1, { valuation: 'impartial', hourValue: 73, hoursPerYear: 3650 })];
  const r = run(d, { people });
  near(r.harm.unprepared.usd, 0.1 * 3.5 * 730);
  // Two days of stored water now save half a day's work on each, but only
  // a quarter of a day where heat is also unmet: water covers days 2 and 3,
  // leaving water unmet 2 days; 3 days at a half and 2 at 0.75 = 3 days.
  const w = entry(r, 'water', 1);
  near(w.hardshipUsd, 0.1 * (3.5 - 3) * 730);
});

test('the parts of the yearly cost add up to it, with time at the hour value', () => {
  const d = JSON.parse(readFileSync(new URL('../data/model.json', import.meta.url)));
  const r = rank(d, { ...defaultSettings(d), people: [{ id: 1, age: 'adult', valuation: 'personal', hourValue: 1000 }] });
  assert.ok(r.entries.every((e) => Number.isFinite(e.annualCostUsd)));
  for (const e of r.entries) {
    const p = e.annualCostParts;
    assert.ok(Math.abs(p.capital + p.money + p.setupTime + p.upkeepTime - e.annualCostUsd) < 1e-6 * Math.max(1, e.annualCostUsd), e.items[0].id);
  }
  // The elastomeric mask: upkeep hours a year at $1,000 an hour.
  const m = r.entries.find((e) => e.items[0].id === 'elastomeric-respirator');
  assert.ok(Math.abs(m.annualCostParts.upkeepTime - 1000 * m.annualCostParts.upkeepHours) < 1e-6);
});
