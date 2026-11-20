// Model entries for food, fire and carbon monoxide, respiratory protection,
// radiation, evacuation, money and documents, protection of the home, tools,
// plans and structural measures. See items-1.mjs for the conventions.

import { guess, reduce, reduceAll, OUTAGES } from './helpers.mjs';

const days = (n, units) => ({ label: `${n} days`, units: units === undefined ? n : units });

// The share of a pandemic's risk that falls before countermeasures arrive
// and before respirators can be bought again (tail-pandemic.json,
// shareBeforeCountermeasure). A respirator bought in advance, and a stock of
// food to stay home on, earn their keep in that period only.
const EARLY = { pandemicModerate: 0.55, pandemicSevere: 0.85 };

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
  fractionByLevel: stockDays.map((d) => Number((EARLY.pandemicSevere * 0.78 * (T(14 + d) - T(14))).toFixed(4))),
  adherence: guess(0.08, 0.25, 0.5, 'Half of households holding the stock would isolate; half of those could not have done so without it. Both guesses.', 1),
});
const KCAL = 2100;

// A respirator's effect on infection in one of the two pandemics.
const respirator = (s, T2, hazard, fraction) => reduce(s, T2, 'infection', { hazard, hazards: [hazard], group: 'respirator', scale: EARLY[hazard], fraction });

// Smoke alarms and extinguishers act on fires at home, in ordinary times and
// in outages, but not on wildfire.
const HOME_FIRES = ['houseFire', ...OUTAGES];

export const items = [
  // ---- food ----
  {
    // What a household with warning buys is two weeks of ordinary groceries;
    // that is this entry's third step. Setting up the habit is done once.
    id: 'pantry-ready', from: 'pantry-no-cook', group: 'Food', lateBuyLevel: 3, lateUptake: 0.6, setupLifeYears: 10,
    ladder: [3, 7, 14, 30, 60].map((n) => days(n)),
    effects: () => [{ type: 'supply', need: 'food', amount: 1 }, isolation([3, 7, 14, 30, 60])],
  },
  {
    id: 'pantry-cook', from: 'pantry-cook', group: 'Food', requires: [], bundleWith: ['camp-stove', 'stove-fuel'], lateBuyClass: 'none', setupLifeYears: 10,
    ladder: [7, 14, 30, 60, 90].map((n) => days(n)),
    effects: () => [{ type: 'supply', need: 'food', amount: 1, pool: 'cook' }, isolation([7, 14, 30, 60, 90])],
  },
  {
    id: 'freeze-dried', from: 'freeze-dried-meals', group: 'Food', lateBuyClass: 'none',
    ladder: [3, 7, 14, 30].map((n) => days(n)),
    effects: () => [{ type: 'supply', need: 'food', amount: 1 }],
  },
  {
    id: 'bulk-staples', from: 'bulk-staples', group: 'Food', requires: [], bundleWith: ['camp-stove', 'stove-fuel'], lateBuyClass: 'none',
    ladder: [30, 90, 180, 365].map((n) => days(n)),
    effects: () => [{ type: 'supply', need: 'food', amount: 1, pool: 'cook' }, isolation([30, 90, 180, 365])],
  },
  {
    id: 'ration-bars', from: 'ration-bars', group: 'Food', lateBuyClass: 'none',
    ladder: [{ label: '1 pack', units: 1 }, { label: '2 packs', units: 2 }, { label: '4 packs', units: 4 }],
    effects: () => [{ type: 'supply', need: 'food', amount: 3600 / KCAL }],
  },
  {
    // A person-day of cooked staples takes about a quarter of an hour of
    // burn. The stove can also boil water, which the model does not credit:
    // boiling draws on the same small stock of fuel.
    id: 'camp-stove', from: 'camp-stove', group: 'Food', lateUptake: 0.1,
    effects: () => [
      { type: 'capability', capability: 'cook' },
      { type: 'capability', capability: 'campStove' },
      { type: 'supply', capability: 'cook', amount: 5.3, perPersonDay: 0.25 },
      { type: 'supply', need: 'hotMeals', amount: 5.3 },
      { type: 'sideRisk', need: 'hotMeals', channel: 'co', micromortsPerDay: 'SIDE:campStove' },
    ],
  },
  {
    // Fire codes commonly limit the gas kept inside a dwelling to about five
    // small canisters; the larger steps need somewhere else to keep them.
    id: 'stove-fuel', from: 'stove-fuel', group: 'Food', requires: ['campStove'], bundleWith: ['bulk-staples', 'pantry-cook'], lateBuyClass: 'none',
    ladder: [{ label: '4 canisters', units: 4 }, { label: '12 canisters', units: 12 }, { label: '36 canisters', units: 36 }],
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
    // engine that is the dollar side of the fire channel. NFPA's figures for
    // alarms of every kind give a reduction of 50 to 60%; for battery alarms
    // alone, 30%. Both are confounded by the age of the housing. The entry
    // keeps the researcher's 0.55 with a range that reaches 0.3.
    id: 'smoke-alarms', from: 'smoke-alarm-basic', group: 'Fire and CO',
    note: 'Worth nothing extra to the homes that already have working alarms, which in the United States is about five in six.',
    effects: (s, T2) => {
      const e = s.effects.find((x) => x.type === 'reduce');
      const base = { type: 'reduce', hazards: HOME_FIRES, adherence: T2(e.adherence, { max: 1 }), group: 'smokeAlarm' };
      return [
        { type: 'capability', capability: 'smokeAlarm' },
        { ...base, target: 'fire', on: 'mortality', fraction: T2(e.fractionRemoved, { max: 1 }) },
        { ...base, target: 'fire', on: 'hardship', fraction: T2({ ...e.financialFractionRemoved, basis: e.fractionRemoved.basis }, { max: 1 }) },
      ];
    },
  },
  {
    id: 'smoke-alarms-interconnected', from: 'smoke-alarm-upgrade', group: 'Fire and CO',
    effects: (s, T2) => reduce(s, T2, 'fire', { hazards: HOME_FIRES, on: 'mortality' }),
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
      const base = { type: 'reduce', target: 'fire', hazards: HOME_FIRES, adherence: T2(e.adherence, { max: 1 }) };
      return [
        { ...base, on: 'mortality', fraction: T2(e.fractionRemoved, { max: 1 }) },
        { ...base, on: 'hardship', fraction: T2({ ...e.financialFractionRemoved, basis: e.fractionRemoved.basis }, { max: 1 }) },
      ];
    },
  },

  // ---- respiratory protection ----
  {
    // The respiratory researcher's protection figure for an unfitted N95,
    // 0.6, already allows for the hours it is not worn, and adherence is
    // then applied again. Fit studies (Lawrence 2006) put leakage at about
    // 10% for an N95 against 5% for an elastomeric; 0.75 is used here.
    // The fraction applies while the stock lasts: masks x 3 uses over the
    // roughly 90 days of outings before respirators can be bought again.
    id: 'n95-respirators', from: 'n95-respirators', group: 'Air',
    ladder: [5, 10, 20, 40].map((n) => ({ label: `${n} each`, units: n })),
    effects: (s, T2) => {
      const cover = [0.17, 0.33, 0.67, 1];
      const worn = guess(0.4, 0.75, 0.9, 'Lawrence et al. 2006 fit factors, as re-read by the verifier; respiratory.json gives 0.6 net of partial wear.', 1);
      const spread = { lo: worn.lo / worn.mid, mid: 1, hi: worn.hi / worn.mid, tag: 'guess', basis: worn.basis };
      const eff = (hazard) => {
        const e = s.effects.find((x) => x.type === 'reduce' && x.hazards.includes(hazard));
        return { type: 'reduce', target: 'infection', hazards: [hazard], group: 'respirator', fractionByLevel: cover.map((c) => c * worn.mid * EARLY[hazard]), levelScale: spread, adherence: T2(e.adherence, { max: 1 }) };
      };
      return [eff('pandemicModerate'), eff('pandemicSevere'), ...reduce(s, T2, 'smoke', { group: 'smokeMask' })];
    },
  },
  {
    // The mask and filters are per person; the kit for checking the fit is
    // bought once. $45 is the researcher's price for a home-made kit; the
    // one kit whose price was read on a page costs $193.
    id: 'elastomeric-respirator', from: 'elastomeric-respirator-p100', group: 'Air',
    price: guess(45, 57, 100, 'respiratory.json: mask $23.99 plus two pairs of filters at $16.69.'),
    fixedPrice: guess(18, 45, 193, 'respiratory.json: fit-check kit, home-made to bought.'),
    note: 'An N95 stock does much the same job. Whichever is bought first earns most of the value; the second adds a fraction of it.',
    effects: (s, T2) => [
      ...respirator(s, T2, 'pandemicSevere'),
      ...respirator(s, T2, 'pandemicModerate'),
      ...reduce(s, T2, 'smoke', { group: 'smokeMask' }),
    ],
  },
  {
    id: 'papr', from: 'papr', group: 'Air',
    effects: (s, T2) => [...respirator(s, T2, 'pandemicSevere'), ...respirator(s, T2, 'pandemicModerate')],
  },
  { id: 'goggles', from: 'sealed-goggles', group: 'Air', effects: (s, T2) => reduceAll(s, T2) },
  { id: 'hepa-purifier', from: 'hepa-purifier', group: 'Air', everydayUpkeep: true, effects: (s, T2) => reduceAll(s, T2) },
  { id: 'far-uvc', from: 'far-uvc-lamp', group: 'Air', effects: (s, T2) => reduceAll(s, T2) },
  {
    // respiratory.json sizes this at about 3% of infection risk for an
    // hour's work, and passed it to the plans researcher, who folded it
    // into the isolation plan. It is its own entry here.
    id: 'sick-room-plan', group: 'Air',
    name: 'Sick-room plan',
    spec: 'Decide in advance which room a sick member would stay in, who would care for them, and that both would wear respirators; keep a few for the purpose.',
    units: 'plan', confidence: 'guess', scalesWith: 'household',
    price: 0, lifeYears: 5, upkeepUsdPerYear: 0, everydayShare: 0, volumeLitres: 0, lateBuyClass: 'none',
    setupHours: guess(0.5, 1, 2, 'respiratory.json, excluded items: an hour of planning.'),
    upkeepHoursPerYear: 0,
    reliability: guess(0.5, 0.8, 0.95, "The model's own guess.", 1),
    effects: () => [{
      type: 'reduce', target: 'infection', hazards: ['pandemicModerate', 'pandemicSevere'],
      fraction: guess(0.02, 0.075, 0.15, 'respiratory.json: a quarter of infections are caught at home; masking the sick person and the carer before symptoms spread cuts onward spread by about 0.3.', 1),
      adherence: guess(0.15, 0.4, 0.7, 'respiratory.json.', 1),
    }],
  },

  // ---- radiation ----
  {
    // A two-hour plan made from official advice can also be made in the days
    // of warning that the nuclear researcher expects, so it is something an
    // unprepared household may still acquire.
    id: 'shelter-plan', from: 'fallout-shelter-plan', group: 'Radiation', lateBuyClass: 'staple',
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
    id: 'go-bag', from: 'go-bag', group: 'Evacuation', lateUptake: 0.5,
    effects: (s, T2) => [
      { type: 'capability', capability: 'goBag' },
      ...reduce(s, T2, 'displacement', { on: 'hardship' }),
      ...reduce(s, T2, 'trauma'),
    ],
  },
  {
    // The leave effect is the researcher's suggestion: a free bed waiting
    // makes relocating 8% cheaper and 3 points likelier. It applies where a
    // place to stay is what holds people back, not in a pandemic or a long
    // grid failure.
    id: 'evacuation-plan', from: 'evacuation-plan', group: 'Evacuation',
    effects: (s, T2) => [
      { type: 'capability', capability: 'evacuationPlan' },
      ...reduce(s, T2, 'displacement', { on: 'hardship' }),
      ...reduce(s, T2, 'trauma'),
      { type: 'leave', hazards: ['hurricane', 'wildfire', 'flood', 'earthquake', 'severeStorm', 'winterStorm', 'civilUnrest', 'cyberOutage'], cost: guess(0.02, 0.08, 0.2, 'mobility.json, evacuation-plan.', 1), feasible: guess(0, 0.03, 0.1, 'mobility.json, evacuation-plan.', 1) },
    ],
  },
  {
    id: 'half-tank', from: 'half-tank-habit', group: 'Evacuation',
    effects: (s, T2) => [
      ...reduce(s, T2, 'displacement', { on: 'hardship' }),
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
    id: 'cash', from: 'cash-small-notes', group: 'Money and documents', units: 'hundreds of dollars', lateUptake: 0.5,
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
    // After a house fire the loss sits on the fire channel, so the effect
    // on losses there is entered against that channel.
    id: 'document-copies', from: 'document-copies', group: 'Money and documents',
    effects: (s, T2) => {
      const [loss] = reduce(s, T2, 'financialLoss', { on: 'hardship' });
      return [loss, { ...loss, target: 'fire', hazards: ['houseFire'] }, ...reduce(s, T2, 'displacement', { on: 'hardship' })];
    },
  },
  {
    id: 'document-box', from: 'fire-document-box', group: 'Money and documents',
    effects: (s, T2) => { const [loss] = reduce(s, T2, 'financialLoss', { on: 'hardship' }); return [loss, { ...loss, target: 'fire', hazards: ['houseFire'] }]; },
  },
  {
    id: 'data-backup', from: 'data-backup', group: 'Money and documents', everydayUpkeep: true,
    effects: (s, T2) => { const [loss] = reduce(s, T2, 'financialLoss', { on: 'hardship' }); return [loss, { ...loss, target: 'fire', hazards: ['houseFire'] }]; },
  },
  // Two entries that come from the AI research (research/ai/ai-economy.md),
  // not from a step 3 item. Both act on scams and account takeover.
  {
    id: 'verification-phrase', group: 'Money and documents',
    name: 'Family verification phrase and call-back habit',
    spec: 'Agree a phrase that family members will ask for before acting on any urgent request for money, and the habit of hanging up and calling back on a number you already have.',
    units: 'arrangement', confidence: 'guess', scalesWith: 'household',
    price: 0, lifeYears: 5, upkeepUsdPerYear: 0, everydayShare: 0, volumeLitres: 0, lateBuyClass: 'none',
    setupHours: guess(0.2, 0.5, 1.5, "The model's own guess."),
    upkeepHoursPerYear: guess(0.05, 0.2, 0.5, "The model's own guess: a yearly reminder."),
    reliability: guess(0.4, 0.7, 0.9, "The model's own guess: the chance that the person targeted remembers to use it.", 1),
    note: 'Recommended by the FBI, the National Cybersecurity Alliance and others. No study of its effectiveness exists, so the fraction is a guess.',
    effects: () => [{
      type: 'reduce', target: 'financialLoss', hazards: ['aiFraud'], on: 'hardship',
      fraction: guess(0.02, 0.12, 0.35, 'Imposter scams are most of the expected loss (ai-economy.md); the share a phrase and a call-back would stop is unmeasured.', 1),
      adherence: guess(0.3, 0.6, 0.9, "The model's own guess.", 1),
    }],
  },
  {
    id: 'account-protection', group: 'Money and documents',
    name: 'Passkeys or hardware keys, credit freeze and port-out PIN',
    spec: 'Passkeys or hardware keys on email, bank and phone accounts; a credit freeze; a port-out PIN with the mobile carrier; transaction alerts.',
    units: 'set-up', confidence: 'guess', scalesWith: 'household',
    price: guess(0, 50, 100, 'Two hardware keys; passkeys alone cost nothing.'),
    lifeYears: 8, upkeepUsdPerYear: 0, everydayShare: 0.5, volumeLitres: 0, lateBuyClass: 'none',
    setupHours: guess(1, 3, 6, "The model's own guess."),
    upkeepHoursPerYear: guess(0.2, 0.5, 1.5, "The model's own guess."),
    reliability: guess(0.8, 0.95, 0.99, "The model's own guess.", 1),
    note: 'In a 2019 Google study hardware keys blocked every targeted account-takeover attempt; but takeover is the smaller part of the loss, and no study measures a credit freeze or a port-out PIN.',
    effects: () => [{
      type: 'reduce', target: 'financialLoss', hazards: ['aiFraud'], on: 'hardship',
      fraction: guess(0.03, 0.1, 0.25, 'Account takeover is roughly a tenth of the expected loss (ai-economy.md: about $15 of $130 a year); hardware keys stop nearly all of it.', 1),
      adherence: 0.9,
    }],
  },

  // ---- protection of the home ----
  { id: 'pepper-spray', from: 'pepper-spray', group: 'Protection', effects: (s, T2) => reduceAll(s, T2, { on: 'mortality' }) },
  {
    // The researcher's ownership risk is 0.22 micromorts a day averaged over
    // two adults, from Studdert et al. 2020 on suicide, homicide and accident
    // in homes with handguns: about 123 a year for the owner and 38 for
    // another adult in the home. The figure for a child is the model's guess.
    id: 'firearm', from: 'firearm-with-training', group: 'Protection',
    effects: (s, T2) => [
      // The researcher's first effect is on everyday crime at home, which
      // the model carries as its own hazard.
      ...reduceAll(s, T2, { hazards: (list) => (list.includes('localOutage') ? ['violentCrime'] : list) }),
      {
        type: 'annualRisk',
        micromortsOwner: guess(35, 123, 330, 'plans-skills-security.json: firearm suicide and accident among owners (Studdert et al. 2020).'),
        micromortsOtherAdult: guess(10, 38, 100, 'plans-skills-security.json: risk to an adult living with an owner.'),
        micromortsChild: guess(1, 5, 20, "The model's own guess."),
      },
    ],
  },
  { id: 'helmet', from: 'protective-helmet', group: 'Protection', effects: (s, T2) => reduceAll(s, T2) },
  { id: 'door-reinforcement', from: 'door-reinforcement', group: 'Protection', ladder: null, noReview: true, effects: (s, T2) => reduceAll(s, T2) },
  {
    // A habit costs attention if not money: six minutes a year, the model's own figure.
    id: 'discretion', from: 'discretion-about-supplies', group: 'Protection', upkeepHoursPerYear: 0.1,
    effects: (s, T2) => reduceAll(s, T2),
  },
  {
    // The researcher's effect inside disasters and banking crises is, in
    // their words, a token. What the entry does is cut everyday losses to
    // fraud: about a fifth of an out-of-pocket loss of $10 to $25 a year.
    id: 'digital-hygiene', from: 'basic-digital-security', group: 'Protection', everydayUpkeep: true,
    effects: () => [{
      type: 'reduce', target: 'financialLoss', hazards: ['aiFraud'], on: 'hardship',
      fraction: guess(0.01, 0.04, 0.1, 'plans-skills-security.json: removes about 20% of an out-of-pocket loss of $10 to $25 a year, against an expected loss to scams of about $100.', 1),
      adherence: 0.8,
    }],
  },

  // ---- tools ----
  { id: 'tools-bundle', from: 'basic-tools-bundle', group: 'Tools', effects: (s, T2) => reduceAll(s, T2) },
  { id: 'axe-shovel-saw', from: 'axe-shovel-saw', group: 'Tools', effects: (s, T2) => reduceAll(s, T2) },

  // ---- plans and skills ----
  {
    // An escape plan saves lives, not property, and only where alarms give
    // the warning to act on.
    id: 'household-plan', from: 'household-plan', group: 'Plans and skills', requires: ['smokeAlarm'],
    effects: (s, T2) => [...reduceAll(s, T2, { only: ['fire'], on: 'mortality' }), ...reduceAll(s, T2, { only: ['information', 'displacement'] })],
  },
  { id: 'neighbour-network', from: 'neighbour-network', group: 'Plans and skills', everydayUpkeep: true, effects: (s, T2) => reduceAll(s, T2) },
  {
    // Practice multiplies every other item's chance of failing by 0.6. Its
    // effect on carbon monoxide is on the risks of improvised heat and power
    // in outages, not on the everyday risk.
    id: 'practice', from: 'practice-and-yearly-review', group: 'Plans and skills',
    effects: (s, T2) => [
      { type: 'review', failureFactor: guess(0.35, 0.6, 0.9, 'plans-skills-security.json, practice-and-yearly-review.', 1) },
      ...reduceAll(s, T2, { hazards: () => OUTAGES }),
    ],
  },
  { id: 'learn-hazards', from: 'learn-local-hazards', group: 'Plans and skills', effects: (s, T2) => reduceAll(s, T2) },
  { id: 'reference-books', from: 'reference-books', group: 'Plans and skills', effects: (s, T2) => reduceAll(s, T2) },
  { id: 'isolation-plan', from: 'pandemic-isolation-plan', group: 'Plans and skills', effects: (s, T2) => reduceAll(s, T2) },

  // ---- the home itself ----
  { id: 'seismic-securing', from: 'seismic-securing', group: 'The home', effects: (s, T2) => reduceAll(s, T2, { only: ['trauma', 'financialLoss'] }) },
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
];

export const dropped = {
  multivitamins: 'No effect in a food window shorter than about two months.',
  'kitchen-sundries': 'Nearly every home has a way to open a can and light a flame; the harm avoided is small and unquantified.',
  'smoke-co-combo-alarm': 'A substitute for the separate smoke and CO alarms, with the same effects.',
  'fire-blanket': 'Overlaps almost wholly with the extinguisher.',
  'gas-shutoff-tool': 'Its effect is on fires after an earthquake, which the earthquake hazard does not carry separately; in the model it would be worth nothing.',
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
  'extra-fuel-store': 'Fuel for the generator, which is not ranked.',
};
