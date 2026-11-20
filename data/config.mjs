// How the model uses the research: its needs, hazards, defaults and entries.
// tools/build-data.mjs combines this with research/step3 into data/model.json.

import { guess } from './helpers.mjs';
import { items as items1, dropped as dropped1 } from './items-1.mjs';
import { items as items2, dropped as dropped2 } from './items-2.mjs';

const none = { steps: [{ fromDay: 1, lo: 0, mid: 0, hi: 0 }], tag: 'derived', basis: 'None claimed.' };
const flatCurve = (lo, mid, hi, basis) => ({ steps: [{ fromDay: 1, lo, mid, hi }], tag: 'guess', basis });

const household = { adults: 2, children: 0, age60to74: 0, age75plus: 0, onMedication: 0, criticalDrug: 0, powerDependent: 0, infants: 0, pets: 0 };
const ticks = { coldWinters: false, hotSummers: false, hurricane: false, earthquake: false, wildfire: false, flood: false };

export default {
  version: '2026-11-19',

  // What a typical urban apartment is like in each place. Choosing a place in
  // the page sets these; the reader then corrects them.
  locations: {
    us: { label: 'United States', home: { cooking: 'electric', heating: 'electric', airConditioning: true, pumpedWater: false, car: true }, ticks: { ...ticks, coldWinters: true, hotSummers: true } },
    westernEurope: { label: 'Western Europe', home: { cooking: 'electric', heating: 'gas', airConditioning: false, pumpedWater: false, car: false }, ticks: { ...ticks, coldWinters: true, hotSummers: true } },
    buenosAires: { label: 'Buenos Aires', home: { cooking: 'gas', heating: 'gas', airConditioning: true, pumpedWater: true, car: false }, ticks: { ...ticks, hotSummers: true } },
  },
  outlooks: {
    forecast: { label: 'Base rates and public forecasts' },
    pessimistic: { label: 'Pessimistic' },
  },
  defaults: {
    location: 'us', outlook: 'forecast', dwelling: 'apartment',
    cooking: 'electric', heating: 'electric', airConditioning: true, pumpedWater: false, car: true,
    household, ticks: { ...ticks, coldWinters: true, hotSummers: true },
    owned: {}, probabilities: {}, parameters: {},
    ai: { timeline: 'none', concern: 0.5, horizonYears: 5 },
  },

  parameters: {
    micromortValueUsd: { by: ['us', 'westernEurope', 'buenosAires'] },
    timeValueUsdPerHour: { by: ['us', 'westernEurope', 'buenosAires'] },
    realDiscountRate: {},
    storageCostUsdPerLitreYear: { by: ['apartment', 'house'] },
    priceIndex: { by: ['us', 'westernEurope', 'buenosAires'], fixed: { us: 1 } },
    homePresence: { max: 1 },
    leaveHardshipUsdPerPersonDay: { value: guess(10, 30, 80, "The discomfort of being away from home when leaving by choice, over and above what it costs. The model's own guess, set below the displaced-day hardship in mobility.json because the move is chosen and planned.") },
  },

  units: {},

  // Engine settings for each need. Curves, baselines and multipliers come
  // from the research file that owns the need unless given here.
  needs: {
    water: { label: 'Drinking water', per: 'person', gap: 'water', special: 'water', demandPerPersonDay: 3 },
    food: { label: 'Food', per: 'person', gap: 'food', special: 'food', demandPerPersonDay: 1, noCookShare: 0.5 },
    hotMeals: {
      label: 'Hot food and drink', per: 'person', gap: 'cookOut', demandPerPersonDay: 0.25, baselineDays: 0,
      hardship: flatCurve(1, 3, 10, 'food.json, camp-stove: hot meals and drinks for a household that would otherwise eat cold are worth about $3 a person a day.'),
      mortality: none,
    },
    infantFood: {
      label: 'Infant formula', per: 'person', who: 'infant', gap: 'food', demandPerPersonDay: 1,
      baselineDays: guess(2, 5, 14, 'food.json, infant-formula: ordinary stock.'),
      hardship: flatCurve(40, 150, 600, 'food.json, infant-formula: an infant-day without formula, the household improvising.'),
      mortality: flatCurve(3, 30, 300, 'food.json, infant-formula.'),
    },
    petFood: {
      label: 'Pet food', per: 'household', if: 'pet', gap: 'food', demandPerHouseholdDay: 1,
      baselineDays: guess(3, 10, 30, "The model's own guess of ordinary stock."),
      hardship: flatCurve(3, 10, 30, "food.json, pet-food: the owner's distress at a hungry animal."),
      mortality: none,
    },
    warmth: { label: 'Warmth', per: 'person', gap: 'warmth', demandPerHouseholdDay: 1 },
    cooling: { label: 'Cooling', per: 'person', gap: 'cooling', demandPerHouseholdDay: 1 },
    light: { label: 'Light', per: 'person', gap: 'power', demandPerHouseholdDay: 4 },
    devicePower: { label: 'Phone and small devices', per: 'person', gap: 'power', demandPerPersonDay: 15, baselineIf: [{ if: 'car', days: 30 }] },
    refrigeration: { label: 'Refrigeration', per: 'person', gap: 'power', demandPerHouseholdDay: 1300 },
    medicalPower: { label: 'Powered medical device', per: 'person', who: 'powerDependent', gap: 'power', demandPerPersonDay: 1500 },
    information: { label: 'News and contact', per: 'person', gap: 'comms', leaveEnds: false },
    medication: { label: 'Prescription medicine', per: 'person', who: 'onMedication', gap: 'medication', demandPerPersonDay: 1, home: false },
    minorIllness: {
      label: 'Minor illness without a pharmacy', per: 'person', gap: 'medication', home: false, baselineDays: 0,
      hardship: flatCurve(0.25, 1.1, 3.7, 'drugs.json: the two over-the-counter kits together relieve about $1.10 of hardship per person per day without a pharmacy.'),
      mortality: none,
    },
    sanitation: { label: 'Toilet and washing', per: 'person', gap: 'sanitation', demandPerPersonDay: 1 },
    payments: { label: 'Ability to pay', per: 'person', gap: 'payments', demandPerPersonDay: 20, leaveEnds: false, home: false },
    displacement: { label: 'Being displaced', per: 'person', gap: 'displacement', leaveEnds: false, home: false },
    emergencyCare: {
      // medical.md section 3: 1.2 micromorts a day when care cannot be
      // reached at all, 0.2 when it is slow or overwhelmed. Hazards differ in
      // which they mean; pandemics are scaled to the lower figure below.
      label: 'Emergency medical care', per: 'person', gap: 'emergencyCare', home: false, leaveEnds: false, baselineDays: 0,
      hardship: none,
      mortality: flatCurve(0.05, 0.5, 3, 'medical.json, trauma channel: between the slow-care and no-care rates.'),
      multipliers: { age60to74: { mortality: 6 }, age75plus: { mortality: 18 }, child: { mortality: 0.3 } },
    },
  },

  channels: {
    infection: null, smoke: null, fallout: null, co: null, fire: null, trauma: null, violence: null, financialLoss: null,
    // Everyday respiratory infection that routine vaccination averts.
    seasonalInfection: { multipliers: { age60to74: { mortality: 16 }, age75plus: { mortality: 85 }, child: { mortality: 0.25 } } },
  },

  sideRisks: {
    heater: /Indoor-rated portable propane heater/,
    heaterFire: /Portable combustion heater indoors/,
    generator: /Portable gasoline generator/,
    candles: /Candles/,
    campStove: /camp stove/i,
  },

  hazards: {
    localOutage: { label: 'Local power cut', from: 'hazards-ordinary' },
    severeStorm: { label: 'Severe storm', from: 'hazards-ordinary' },
    winterStorm: { label: 'Winter storm', from: 'hazards-ordinary' },
    heatWave: { label: 'Heat wave', from: 'hazards-ordinary' },
    waterSystemFailure: { label: 'Tap water failure', from: 'hazards-ordinary' },
    supplyShock: { label: 'Shortages in shops', from: 'hazards-ordinary' },
    hurricane: { label: 'Hurricane', from: 'hazards-regional' },
    earthquake: { label: 'Earthquake', from: 'hazards-regional' },
    wildfire: { label: 'Wildfire or heavy smoke', from: 'hazards-regional' },
    flood: { label: 'Flood', from: 'hazards-regional' },
    pandemicModerate: {
      label: 'Pandemic on the scale of COVID-19', from: 'tail-pandemic',
      needScale: { emergencyCare: { mortality: 0.4 } },
    },
    pandemicSevere: {
      label: 'Pandemic far worse than COVID-19', from: 'tail-pandemic',
      needScale: { emergencyCare: { mortality: 0.4 } },
    },
    nuclearNear: { label: 'Nuclear war reaching your region', from: 'tail-nuclear-grid' },
    nuclearFar: { label: 'Nuclear war elsewhere', from: 'tail-nuclear-grid' },
    gridLong: { label: 'Grid failure for weeks or months', from: 'tail-nuclear-grid' },
    bankingCrisis: { label: 'Bank freeze or currency crisis', from: 'tail-finance-unrest' },
    civilUnrest: { label: 'Serious unrest', from: 'tail-finance-unrest' },

    // Everyday risks, as yearly expectations, so that ordinary safety items
    // compete on the same scale. Baselines are for a home without the item.
    houseFire: {
      label: 'House fire (everyday)',
      definition: 'The yearly risk of death and loss from fire at home, for a home with no working smoke alarm.',
      profile: (R, T) => ({
        probability: { all: 1 }, windows: {},
        exposures: [{ channel: 'fire', micromortsPerPerson: T(R.channels.fire.everydayAnnualMicromortsPerPerson), financialUsdPerHousehold: T(R.channels.fire.everydayAnnualUsdPerHousehold) }],
        exposureScale: { dwelling: { house: 1.15, apartment: 0.5 } },
      }),
    },
    coIncident: {
      label: 'Carbon monoxide at home (everyday)',
      definition: 'The yearly risk of carbon monoxide poisoning at home from appliances, heaters, engines and vehicles, for a home with fuel-burning equipment and no alarm.',
      profile: (R, T) => ({
        probability: { all: 1 }, windows: {},
        exposures: [{ channel: 'co', micromortsPerPerson: T(R.channels.co.everydayAnnualMicromortsPerPerson), financialUsdPerHousehold: T(R.channels.co.everydayAnnualUsdPerHousehold) }],
        exposureScale: { dwelling: { house: 1.15, apartment: 0.5 } },
      }),
    },
    homeMedicalEmergency: {
      label: 'Medical emergency at home (everyday)',
      definition: 'The yearly risk of death from an emergency at home that is decided before the ambulance arrives: mostly cardiac arrest.',
      profile: (R, T) => ({
        probability: { all: 1 }, windows: {},
        exposures: [{ channel: 'trauma', micromortsPerPerson: T(R.channels.trauma.everydayAnnualMicromortsPerPerson) }],
      }),
    },
    seasonalIllness: {
      label: 'Seasonal respiratory infection (everyday)',
      definition: 'The yearly deaths from influenza, COVID-19 and similar infections that routine vaccination averts.',
      profile: () => ({
        probability: { all: 1 }, windows: {},
        exposures: [{ channel: 'seasonalInfection', micromortsPerPerson: { lo: 2, mid: 8, hi: 26, tag: 'derived', basis: 'medical.json, routine-vaccinations: yearly micromorts averted for a healthy adult aged 15 to 59 against skipping all routine vaccines; 130 at ages 60 to 74 and 680 at 75 or over.' } }],
      }),
    },
    violentCrime: {
      label: 'Burglary and assault at home (everyday)',
      definition: 'The yearly risk of death and loss from burglary and assault at home.',
      profile: (R, T) => ({
        probability: { all: 1 }, windows: {},
        exposures: [{ channel: 'violence', micromortsPerPerson: T(R.channels.violence.everydayAnnualMicromortsPerPerson), financialUsdPerHousehold: T(R.channels.violence.everydayAnnualUsdPerHousehold) }],
      }),
    },
  },

  items: [...items1, ...items2],
  dropped: { ...dropped1, ...dropped2 },
};
