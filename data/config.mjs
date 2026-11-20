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

    // Hazards added by the AI research. Their probabilities come from it;
    // their windows are the researchers' guesses, set out in the notes of
    // research/ai/ai-cyber.json and ai-war.json.
    cyberOutage: {
      label: 'Blackout from an attack or software failure', aiBase: true,
      definition: 'Grid power out for 1 to 14 days across a metropolitan region or larger because of a cyberattack, sabotage, or a failure of software or AI-run operations.',
      profile: {
        windows: {
          power: { pOccur: 1, days: { p50: 2, p90: 6, p99: 14 } },
          water: { pOccur: 0.25, days: { p50: 1, p90: 3, p99: 8 }, shareTreatable: 0.8 },
          comms: { pOccur: 0.6, days: { p50: 1, p90: 4, p99: 12 } },
          payments: { pOccur: 0.9, days: { p50: 2, p90: 6, p99: 14 } },
          food: { pOccur: 0.1, days: { p50: 1, p90: 3, p99: 7 } },
          sanitation: { pOccur: 0.1, days: { p50: 1, p90: 4, p99: 10 } },
        },
        coldShare: 0.4, hotShare: 0.25,
        leave: { feasible: 0.85, earliestDay: 1, fixedUsdPerHousehold: 300, usdPerPersonDay: 45 },
        warningDays: 0, lateBuy: { staple: 0, specialty: 0 },
        exposures: [
          { channel: 'co', micromortsPerPerson: guess(0.03, 0.15, 0.6, 'As for a severe storm (hazards-ordinary.json): improvised power and cooking.') },
          { channel: 'fire', micromortsPerPerson: guess(0.02, 0.1, 0.4, 'As for a severe storm (hazards-ordinary.json): candles and improvised cooking.') },
        ],
      },
    },
    paymentsOutage: {
      label: 'Payment systems down', aiBase: true,
      definition: 'For at least a day the household cannot pay by card, use ATMs or reach its bank, because of an attack on or failure of banks, card networks or the systems between them, while shops stay open.',
      profile: {
        windows: { payments: { pOccur: 1, days: { p50: 2, p90: 7, p99: 30 } } },
        leave: { feasible: 0, earliestDay: 0, fixedUsdPerHousehold: 0, usdPerPersonDay: 0 },
        warningDays: 0, lateBuy: { staple: 0, specialty: 0 },
      },
    },
    commsOutage: {
      label: 'Mobile and internet down', aiBase: true,
      definition: 'Mobile and home internet unusable for at least a day for a national operator or a metropolitan region, because of an attack or an AI-caused failure.',
      profile: {
        windows: {
          comms: { pOccur: 1, days: { p50: 1.5, p90: 5, p99: 14 } },
          payments: { pOccur: 0.3, days: { p50: 1, p90: 3, p99: 7 } },
          emergencyCare: { pOccur: 0.3, days: { p50: 1, p90: 2, p99: 5 } },
        },
        leave: { feasible: 0, earliestDay: 0, fixedUsdPerHousehold: 0, usdPerPersonDay: 0 },
        warningDays: 0, lateBuy: { staple: 0, specialty: 0 },
      },
    },
    aiFraud: {
      label: 'Scam or account takeover', aiBase: true,
      definition: 'Someone in the household loses money to an impersonation scam, or loses control of a financial, email or phone account, whether or not AI was used.',
      profile: {
        windows: { payments: { pOccur: guess(0.1, 0.25, 0.5, 'The share of events that lock the household out of an account. A guess.', 1), days: { p50: 2, p90: 10, p99: 45 } } },
        leave: { feasible: 0, earliestDay: 0, fixedUsdPerHousehold: 0, usdPerPersonDay: 0 },
        warningDays: 0, lateBuy: { staple: 0, specialty: 0 },
        exposures: [{ channel: 'financialLoss', financialUsdPerHousehold: guess(500, 2000, 6000, 'ai-economy.json: mean unreimbursed loss per event in the United States.') }],
        exposureScale: { location: { us: 1, westernEurope: 0.5, buenosAires: 0.3 } },
      },
    },
    greatPowerWar: {
      label: 'War between great powers, short of nuclear', aiBase: true,
      definition: 'A conventional war between the United States and China, or a Russia–NATO war of similar scale, that does not go nuclear. Its financial effects are not counted here: nothing on the list addresses them.',
      profile: {
        windows: {
          power: { pOccur: 0.2, days: { p50: 2, p90: 10, p99: 30 } },
          water: { pOccur: 0.07, days: { p50: 1, p90: 3, p99: 7 }, shareTreatable: 0.8 },
          comms: { pOccur: 0.2, days: { p50: 1, p90: 3, p99: 10 } },
          payments: { pOccur: 0.15, days: { p50: 2, p90: 7, p99: 14 } },
          medication: { pOccur: 0.15, days: { p50: 14, p90: 60, p99: 120 } },
        },
        coldShare: 0.3, hotShare: 0.25,
        leave: { feasible: 0, earliestDay: 0, fixedUsdPerHousehold: 0, usdPerPersonDay: 0 },
        warningDays: 30, lateBuy: { staple: 0.8, specialty: 0.3 },
        byLocation: {
          buenosAires: {
            windows: {
              medication: { pOccur: 0.1, days: { p50: 14, p90: 60, p99: 120 } },
              payments: { pOccur: 0.15, days: { p50: 5, p90: 10, p99: 20 } },
            },
            coldShare: 0, hotShare: 0,
          },
        },
      },
    },

    // Everyday risks, as yearly expectations, so that ordinary safety items
    // compete on the same scale. Baselines are for a home without the item.
    houseFire: {
      everyday: true,
      label: 'House fire (everyday)',
      definition: 'The yearly risk of death and loss from fire at home, for a home with no working smoke alarm.',
      profile: (R, T) => ({
        probability: { all: 1 }, windows: {},
        exposures: [{ channel: 'fire', micromortsPerPerson: T(R.channels.fire.everydayAnnualMicromortsPerPerson), financialUsdPerHousehold: T(R.channels.fire.everydayAnnualUsdPerHousehold) }],
        exposureScale: { dwelling: { house: 1.15, apartment: 0.5 } },
      }),
    },
    coIncident: {
      everyday: true,
      label: 'Carbon monoxide at home (everyday)',
      definition: 'The yearly risk of carbon monoxide poisoning at home from appliances, heaters, engines and vehicles, for a home with fuel-burning equipment and no alarm.',
      profile: (R, T) => ({
        probability: { all: 1 }, windows: {},
        exposures: [{ channel: 'co', micromortsPerPerson: T(R.channels.co.everydayAnnualMicromortsPerPerson), financialUsdPerHousehold: T(R.channels.co.everydayAnnualUsdPerHousehold) }],
        exposureScale: { dwelling: { house: 1.15, apartment: 0.5 } },
      }),
    },
    homeMedicalEmergency: {
      everyday: true,
      label: 'Medical emergency at home (everyday)',
      definition: 'The yearly risk of death from an emergency at home that is decided before the ambulance arrives: mostly cardiac arrest.',
      profile: (R, T) => ({
        probability: { all: 1 }, windows: {},
        exposures: [{ channel: 'trauma', micromortsPerPerson: T(R.channels.trauma.everydayAnnualMicromortsPerPerson) }],
      }),
    },
    seasonalIllness: {
      everyday: true,
      label: 'Seasonal respiratory infection (everyday)',
      definition: 'The yearly deaths from influenza, COVID-19 and similar infections that routine vaccination averts.',
      profile: () => ({
        probability: { all: 1 }, windows: {},
        exposures: [{ channel: 'seasonalInfection', micromortsPerPerson: { lo: 2, mid: 8, hi: 26, tag: 'derived', basis: 'medical.json, routine-vaccinations: yearly micromorts averted for a healthy adult aged 15 to 59 against skipping all routine vaccines; 130 at ages 60 to 74 and 680 at 75 or over.' } }],
      }),
    },
    violentCrime: {
      everyday: true,
      label: 'Burglary and assault at home (everyday)',
      definition: 'The yearly risk of death and loss from burglary and assault at home.',
      profile: (R, T) => ({
        probability: { all: 1 }, windows: {},
        exposures: [{ channel: 'violence', micromortsPerPerson: T(R.channels.violence.everydayAnnualMicromortsPerPerson), financialUsdPerHousehold: T(R.channels.violence.everydayAnnualUsdPerHousehold) }],
      }),
    },
  },

  // The reader's AI timeline. Presets are the timelines researcher's, built
  // on the named sources (research/ai/ai-timelines.md).
  ai: {
    startYear: 2027,
    horizonYears: 5,
    timelines: {
      short: { from: 'preset-short', label: 'Short: most likely by 2028 (AI Futures Project, November 2026)' },
      middle: { from: 'preset-middle', label: 'Middle: around 2030 (Metaculus community)' },
      long: { from: 'preset-long', label: 'Long: the 2040s (forecasting panels, researcher surveys)' },
      never: { from: 'preset-not-this-century', label: 'Not this century' },
    },
    // Rates the researchers gave for hazards the model does not carry.
    unused: {
      cyberSupplyShock: 'Its main effect is on motor fuel, for which the model has no window.',
      incomeShock: 'Nothing on the list addresses a lasting fall in earnings.',
      marketCrash: 'Nothing on the list addresses a fall in the value of savings.',
    },
  },

  items: [...items1, ...items2],
  dropped: { ...dropped1, ...dropped2 },
};
