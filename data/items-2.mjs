// Model entries for food, fire and carbon monoxide, respiratory protection,
// radiation, evacuation, money and documents, security, tools, plans and
// structural measures. See items-1.mjs for the conventions.

import { guess, reduce, reduceAll } from './helpers.mjs';

const days = (n, units) => ({ label: `${n} days`, units: units === undefined ? n : units });

// Staying home through a severe pandemic. respiratory.md section 3: the share
// of infection risk avoided is H x T(D), where H = 0.78 for a household in
// which one adult still goes out to work, and T(D) is the share of the
// pre-vaccine hazard that falls inside D days of isolation (0.15 at 30 days,
// 0.40 at 90, 0.60 at 180). A household holds about 14 days of food unprepared,
// so D is that plus the stock. The model's own assumptions, both guesses: half
// of households with the stock would in fact isolate, and half of those could
// have done so anyway through deliveries.
const T = (d) => {
  const pts = [[0, 0], [30, 0.15], [90, 0.4], [180, 0.6], [365, 0.75]];
  for (let i = 1; i < pts.length; i++) {
    if (d <= pts[i][0]) return pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * (d - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]);
  }
  return 0.75;
};
const isolation = (stockDays) => ({
  type: 'reduce', target: 'infection', hazards: ['pandemicSevere'], group: 'isolation',
  fractionByLevel: stockDays.map((d) => Number((0.78 * (T(14 + d) - T(14))).toFixed(4))),
  adherence: guess(0.08, 0.25, 0.5, 'Half of households holding the stock would isolate; half of those could not have done so without it. Both guesses.', 1),
});
const KCAL = 2100;

export const items = [
  // ---- food ----
  {
    id: 'pantry-ready', from: 'pantry-no-cook', group: 'Food',
    ladder: [3, 7, 14, 30, 60].map((n) => days(n)),
    effects: () => [{ type: 'supply', need: 'food', amount: 1 }, isolation([3, 7, 14, 30, 60])],
  },
  {
    id: 'pantry-cook', from: 'pantry-cook', group: 'Food', requires: [], bundleWith: ['camp-stove', 'stove-fuel'],
    ladder: [7, 14, 30, 60, 90].map((n) => days(n)),
    effects: () => [{ type: 'supply', need: 'food', amount: 1, pool: 'cook' }, isolation([7, 14, 30, 60, 90])],
  },
  {
    id: 'freeze-dried', from: 'freeze-dried-meals', group: 'Food',
    ladder: [3, 7, 14, 30].map((n) => days(n)),
    effects: () => [{ type: 'supply', need: 'food', amount: 1 }],
  },
  {
    id: 'bulk-staples', from: 'bulk-staples', group: 'Food', requires: [], bundleWith: ['camp-stove', 'stove-fuel'],
    ladder: [30, 90, 180, 365].map((n) => days(n)),
    effects: () => [{ type: 'supply', need: 'food', amount: 1, pool: 'cook' }, isolation([30, 90, 180, 365])],
  },
  {
    id: 'ration-bars', from: 'ration-bars', group: 'Food',
    ladder: [{ label: '1 pack', units: 1 }, { label: '2 packs', units: 2 }, { label: '4 packs', units: 4 }],
    effects: () => [{ type: 'supply', need: 'food', amount: 3600 / KCAL }],
  },
  {
    // A person-day of cooked staples takes about a quarter of an hour of burn.
    id: 'camp-stove', from: 'camp-stove', group: 'Food',
    effects: () => [
      { type: 'capability', capability: 'cook' },
      { type: 'supply', capability: 'cook', amount: 5.3, perPersonDay: 0.25 },
      { type: 'supply', need: 'hotMeals', amount: 5.3 },
      { type: 'sideRisk', need: 'hotMeals', channel: 'co', micromortsPerDay: 'SIDE:campStove' },
    ],
  },
  {
    id: 'stove-fuel', from: 'stove-fuel', group: 'Food', requires: ['cook'], bundleWith: ['bulk-staples', 'pantry-cook'],
    ladder: [{ label: '12 canisters', units: 12 }, { label: '36 canisters', units: 36 }, { label: '96 canisters', units: 96 }],
    effects: () => [
      { type: 'supply', capability: 'cook', amount: 1.33, perPersonDay: 0.25 },
      { type: 'supply', need: 'hotMeals', amount: 1.33 },
    ],
  },
  {
    id: 'grill', from: 'grill', group: 'Food',
    effects: () => [
      { type: 'capability', capability: 'cook' },
      { type: 'supply', capability: 'cook', amount: 12, perPersonDay: 0.25 },
      { type: 'supply', need: 'hotMeals', amount: 12 },
    ],
  },
  {
    id: 'infant-formula', from: 'infant-formula', group: 'Food',
    scalesWith: 'person', scalesWho: 'infant',
    ladder: [7, 14, 30].map((n) => days(n)),
    effects: () => [{ type: 'supply', need: 'infantFood', amount: 1 }],
  },
  {
    id: 'pet-food', from: 'pet-food', group: 'Food', scalesWith: 'household',
    ladder: [14, 30, 60].map((n) => days(n)),
    effects: () => [{ type: 'supply', need: 'petFood', amount: 1 }],
  },

  // ---- fire and carbon monoxide ----
  {
    // The researcher gives a separate fraction for property loss; in the
    // engine that is the dollar side of the fire channel.
    id: 'smoke-alarms', from: 'smoke-alarm-basic', group: 'Fire and CO',
    effects: (s, T2) => {
      const e = s.effects.find((x) => x.type === 'reduce');
      const base = { type: 'reduce', hazards: ['all'], adherence: T2(e.adherence, { max: 1 }), group: 'smokeAlarm' };
      const m = T2(e.fractionRemoved, { max: 1 });
      return [
        { type: 'capability', capability: 'smokeAlarm' },
        { ...base, target: 'fire', on: 'mortality', fraction: m },
        { ...base, target: 'fire', on: 'hardship', fraction: T2({ ...e.financialFractionRemoved, basis: e.fractionRemoved.basis }, { max: 1 }) },
      ];
    },
  },
  {
    id: 'smoke-alarms-interconnected', from: 'smoke-alarm-upgrade', group: 'Fire and CO',
    effects: (s, T2) => reduce(s, T2, 'fire', { hazards: ['all'], on: 'mortality', both: true }),
  },
  {
    id: 'co-alarm', from: 'co-alarm', group: 'Fire and CO',
    effects: (s, T2) => {
      const [m, h] = reduce(s, T2, 'co', { hazards: ['all'] });
      return [{ type: 'capability', capability: 'coAlarm' }, m, h];
    },
  },
  {
    id: 'fire-extinguisher', from: 'fire-extinguisher', group: 'Fire and CO',
    effects: (s, T2) => {
      const e = s.effects.find((x) => x.type === 'reduce');
      const base = { type: 'reduce', target: 'fire', hazards: ['all'], adherence: T2(e.adherence, { max: 1 }) };
      return [
        { ...base, on: 'mortality', fraction: T2(e.fractionRemoved, { max: 1 }) },
        { ...base, on: 'hardship', fraction: T2({ ...e.financialFractionRemoved, basis: e.fractionRemoved.basis }, { max: 1 }) },
      ];
    },
  },
  { id: 'gas-shutoff', from: 'gas-shutoff-tool', group: 'Fire and CO', effects: (s, T2) => reduce(s, T2, 'fire', { both: true }) },

  // ---- respiratory protection ----
  {
    // The fraction applies while the stock lasts. The model's own guess of
    // how much of a pandemic each step covers: 15, 30, 55, 85 and 100%.
    id: 'n95-respirators', from: 'n95-respirators', group: 'Air',
    ladder: [5, 10, 20, 40, 80].map((n) => ({ label: `${n} each`, units: n })),
    effects: (s, T2) => {
      const mod = s.effects.find((x) => x.type === 'reduce' && x.hazards.includes('pandemicModerate'));
      const sev = s.effects.find((x) => x.type === 'reduce' && x.hazards.includes('pandemicSevere'));
      const cover = [0.15, 0.3, 0.55, 0.85, 1];
      return [
        { type: 'reduce', target: 'infection', hazards: ['pandemicModerate'], group: 'respirator', fractionByLevel: cover.map((c) => c * mod.fractionRemoved.mid), adherence: T2(mod.adherence, { max: 1 }) },
        { type: 'reduce', target: 'infection', hazards: ['pandemicSevere'], group: 'respirator', fractionByLevel: cover.map((c) => c * sev.fractionRemoved.mid), adherence: T2(sev.adherence, { max: 1 }) },
        ...reduce(s, T2, 'smoke', { group: 'smokeMask' }),
      ];
    },
  },
  {
    id: 'elastomeric-respirator', from: 'elastomeric-respirator-p100', group: 'Air',
    effects: (s, T2) => [
      ...reduce(s, T2, 'infection', { hazard: 'pandemicSevere', group: 'respirator' }),
      ...reduce(s, T2, 'infection', { hazard: 'pandemicModerate', group: 'respirator' }),
      ...reduce(s, T2, 'smoke', { group: 'smokeMask' }),
    ],
  },
  {
    id: 'papr', from: 'papr', group: 'Air',
    effects: (s, T2) => [
      ...reduce(s, T2, 'infection', { hazard: 'pandemicSevere', group: 'respirator' }),
      ...reduce(s, T2, 'infection', { hazard: 'pandemicModerate', group: 'respirator' }),
    ],
  },
  { id: 'goggles', from: 'sealed-goggles', group: 'Air', effects: (s, T2) => reduceAll(s, T2) },
  { id: 'hepa-purifier', from: 'hepa-purifier', group: 'Air', effects: (s, T2) => reduceAll(s, T2) },
  { id: 'far-uvc', from: 'far-uvc-lamp', group: 'Air', effects: (s, T2) => reduceAll(s, T2) },

  // ---- radiation ----
  {
    id: 'shelter-plan', from: 'fallout-shelter-plan', group: 'Radiation',
    effects: (s, T2) => [{ type: 'capability', capability: 'shelterPlan' }, ...reduceAll(s, T2)],
  },
  { id: 'potassium-iodide', from: 'potassium-iodide', group: 'Radiation', effects: (s, T2) => reduceAll(s, T2) },
  { id: 'radiation-meter', from: 'radiation-meter', group: 'Radiation', effects: (s, T2) => reduceAll(s, T2) },
  {
    id: 'seal-room-kit', from: 'seal-room-kit', group: 'Radiation',
    effects: (s, T2) => [{ type: 'capability', capability: 'sealRoom' }, ...reduceAll(s, T2)],
  },
  {
    id: 'relocation-trigger', from: 'relocation-trigger-plan', group: 'Radiation',
    note: 'Most of what leaving early buys is surviving the first hour, which the model leaves out; the ranking understates this entry.',
    effects: (s, T2) => reduceAll(s, T2),
  },

  // ---- evacuation ----
  {
    id: 'go-bag', from: 'go-bag', group: 'Evacuation',
    effects: (s, T2) => [
      { type: 'capability', capability: 'goBag' },
      ...reduce(s, T2, 'displacement', { on: 'hardship', both: true }),
      ...reduce(s, T2, 'trauma'),
    ],
  },
  {
    // The leave effect is the researcher's suggestion: a free bed waiting
    // makes relocating 8% cheaper and 3 points likelier.
    id: 'evacuation-plan', from: 'evacuation-plan', group: 'Evacuation',
    effects: (s, T2) => [
      { type: 'capability', capability: 'evacuationPlan' },
      ...reduce(s, T2, 'displacement', { on: 'hardship', both: true }),
      ...reduce(s, T2, 'trauma'),
      { type: 'leave', cost: guess(0.02, 0.08, 0.2, 'mobility.json, evacuation-plan.', 1), feasible: guess(0, 0.03, 0.1, 'mobility.json, evacuation-plan.', 1) },
    ],
  },
  {
    id: 'half-tank', from: 'half-tank-habit', group: 'Evacuation',
    effects: (s, T2) => [
      ...reduce(s, T2, 'displacement', { on: 'hardship', both: true }),
      ...reduce(s, T2, 'trauma'),
      { type: 'leave', hazards: ['hurricane', 'gridLong', 'supplyShock', 'nuclearFar'], feasible: guess(0, 0.03, 0.08, 'mobility.json, half-tank-habit.', 1) },
    ],
  },
  { id: 'car-kit', from: 'car-emergency-kit', group: 'Evacuation', effects: (s, T2) => reduceAll(s, T2) },
  { id: 'tent', from: 'evacuation-tent', group: 'Evacuation', effects: (s, T2) => reduceAll(s, T2, { on: 'hardship' }) },

  // ---- money and documents ----
  {
    // The money is still the owner's. Its cost is what it loses lying at
    // home: purchasing power beyond what a bank would pay, and the risk of
    // theft, which the researcher puts at $3.60 a year per $100.
    id: 'cash', from: 'cash-small-notes', group: 'Money and documents', units: 'hundreds of dollars',
    capitalFree: true, upkeepUsdPerYear: 0,
    upkeepUsdPerUnitYear: (R, T2) => T2(R['cash-small-notes'].upkeepUsdPerYear),
    ladder: [1, 2, 3, 5, 10, 20, 50].map((n) => ({ label: `$${n * 100}`, units: n })),
    effects: () => [{ type: 'supply', need: 'payments', amount: 100 }],
  },
  { id: 'second-bank', from: 'second-payment-route', group: 'Money and documents', effects: (s, T2) => reduceAll(s, T2) },
  {
    id: 'account-abroad', from: 'account-abroad', group: 'Money and documents',
    note: 'Ranked only for keeping payments working. What it does for savings in a freeze is described in the text, not ranked.',
    effects: (s, T2) => reduceAll(s, T2),
  },
  {
    id: 'document-copies', from: 'document-copies', group: 'Money and documents',
    effects: (s, T2) => [...reduce(s, T2, 'financialLoss', { on: 'hardship', both: true }), ...reduce(s, T2, 'displacement', { on: 'hardship', both: true })],
  },
  { id: 'document-box', from: 'fire-document-box', group: 'Money and documents', effects: (s, T2) => reduceAll(s, T2, { on: 'hardship' }) },
  { id: 'data-backup', from: 'data-backup', group: 'Money and documents', effects: (s, T2) => reduceAll(s, T2, { on: 'hardship' }) },

  // ---- security ----
  { id: 'pepper-spray', from: 'pepper-spray', group: 'Security', effects: (s, T2) => reduceAll(s, T2, { on: 'mortality' }) },
  {
    // The researcher's ownership risk is 0.22 micromorts per person per day,
    // from the evidence on suicide, homicide and accident in homes with guns.
    id: 'firearm', from: 'firearm-with-training', group: 'Security',
    effects: (s, T2) => {
      const side = s.effects.find((x) => x.type === 'sideRisk');
      return [...reduceAll(s, T2), { type: 'annualRisk', micromortsPerPersonYear: T2(side.micromortsPerDayOfUse, { scale: 365 }) }];
    },
  },
  { id: 'helmet', from: 'protective-helmet', group: 'Security', effects: (s, T2) => reduceAll(s, T2) },
  { id: 'door-reinforcement', from: 'door-reinforcement', group: 'Security', ladder: null, effects: (s, T2) => reduceAll(s, T2) },
  {
    // A habit costs attention if not money: six minutes a year, the model's own figure.
    id: 'discretion', from: 'discretion-about-supplies', group: 'Security', upkeepHoursPerYear: 0.1,
    effects: (s, T2) => reduceAll(s, T2),
  },
  { id: 'digital-security', from: 'basic-digital-security', group: 'Security', effects: (s, T2) => reduceAll(s, T2, { on: 'hardship' }) },

  // ---- tools ----
  { id: 'tools-bundle', from: 'basic-tools-bundle', group: 'Tools', effects: (s, T2) => reduceAll(s, T2) },
  { id: 'axe-shovel-saw', from: 'axe-shovel-saw', group: 'Tools', effects: (s, T2) => reduceAll(s, T2) },

  // ---- plans and skills ----
  { id: 'household-plan', from: 'household-plan', group: 'Plans and skills', effects: (s, T2) => reduceAll(s, T2) },
  { id: 'neighbour-network', from: 'neighbour-network', group: 'Plans and skills', effects: (s, T2) => reduceAll(s, T2) },
  {
    // Practice multiplies every other item's chance of failing by 0.6.
    id: 'practice', from: 'practice-and-yearly-review', group: 'Plans and skills',
    effects: (s, T2) => [
      { type: 'review', failureFactor: guess(0.35, 0.6, 0.9, 'plans-skills-security.json, practice-and-yearly-review.', 1) },
      ...reduceAll(s, T2),
    ],
  },
  { id: 'learn-hazards', from: 'learn-local-hazards', group: 'Plans and skills', effects: (s, T2) => reduceAll(s, T2) },
  { id: 'reference-books', from: 'reference-books', group: 'Plans and skills', effects: (s, T2) => reduceAll(s, T2) },
  { id: 'isolation-plan', from: 'pandemic-isolation-plan', group: 'Plans and skills', effects: (s, T2) => reduceAll(s, T2) },

  // ---- the home itself ----
  { id: 'seismic-securing', from: 'seismic-securing', group: 'The home', effects: (s, T2) => reduceAll(s, T2) },
  { id: 'seismic-retrofit', from: 'seismic-brace-and-bolt', group: 'The home', effects: (s, T2) => reduceAll(s, T2) },
  { id: 'storm-shutters', from: 'wind-opening-protection', group: 'The home', effects: (s, T2) => reduceAll(s, T2) },
  { id: 'flood-proofing', from: 'flood-proofing-basic', group: 'The home', effects: (s, T2) => reduceAll(s, T2) },
  { id: 'wildfire-hardening', from: 'wildfire-home-hardening', group: 'The home', effects: (s, T2) => reduceAll(s, T2) },
  {
    id: 'home-solar', from: 'home-solar-battery', group: 'The home',
    effects: (s, T2) => [
      { type: 'capability', capability: 'mainsPower' }, { type: 'capability', capability: 'chargePhone' },
      { type: 'supply', need: 'refrigeration', amount: 15000, renewable: true },
      { type: 'supply', need: 'medicalPower', amount: 15000, renewable: true },
      { type: 'supply', need: 'devicePower', amount: 15000, renewable: true },
      ...reduceAll(s, T2),
    ],
  },
  {
    id: 'rain-barrel', from: 'rainwater-barrel', group: 'The home', ladder: null, requires: [],
    note: 'The water needs treating, so it counts toward sanitation only.',
    effects: (s, T2) => reduceAll(s, T2),
  },
  {
    id: 'stored-petrol', from: 'extra-fuel-store', group: 'The home', requires: ['generator'],
    ladder: [{ label: '5 gallons', units: 1 }, { label: '10 gallons', units: 2 }, { label: '15 gallons', units: 3 }],
    effects: () => [
      { type: 'supply', need: 'refrigeration', amount: 17500 },
      { type: 'supply', need: 'medicalPower', amount: 17500 },
      { type: 'supply', need: 'devicePower', amount: 17500 },
    ],
  },
];

export const dropped = {
  multivitamins: 'No effect in a food window shorter than about two months.',
  'kitchen-sundries': 'Nearly every home has a way to open a can and light a flame; the harm avoided is small and unquantified.',
  'smoke-co-combo-alarm': 'A substitute for the separate smoke and CO alarms, with the same effects.',
  'fire-blanket': 'Overlaps almost wholly with the extinguisher.',
  'gloves-and-gowns': 'Removes about half a percent of infection risk for an airborne pathogen.',
  'faraday-bag-radio': 'The same object as the communications entry.',
  'get-home-bag': 'The model has no away-from-home state. The researcher puts its value at 5 to 40 cents a year per commuter.',
  'travel-documents-keys': 'No measured effect; a valid passport matters in the few scenarios where leaving the country is the way out.',
  'legal-documents': 'Does not change the chance of harm to the household; its preparedness value is about 50 cents a year.',
  'emergency-fund': 'A savings decision, not ranked. Described in the text.',
  'hard-currency-notes': 'A store of value, not ranked. The historical record is described in the text.',
  'gold-coins': 'A store of value, not ranked.',
  'crypto-stablecoins': 'A store of value, not ranked.',
  'insurance-renters': 'Not ranked: the model is risk-neutral, and insurance pays back less than it costs on average.',
  'insurance-flood': 'Not ranked, for the same reason.',
  'insurance-earthquake': 'Not ranked, for the same reason.',
  'check-home-hazard-exposure': 'Acts only when a household is about to move; it changes which boxes the reader ticks.',
};
