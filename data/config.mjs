// How the model uses the research: its needs, hazards, defaults and entries.
// tools/build-data.mjs combines this with research/step3 into data/model.json.

import { guess } from './helpers.mjs';
// Windows for the cyber hazards, revised on 20 November 2026 after Sentinel's
// "Consider cyberarmageddon" (research/ai/cyber-windows.md).
import cyber from '../research/ai/cyber-windows.json' with { type: 'json' };
import { items as items1, dropped as dropped1 } from './items-1.mjs';
import { items as items2, dropped as dropped2 } from './items-2.mjs';

// A hazard profile as the cyber researcher gave it: windows, leaving,
// warning, and the chance of cold or heat.
const profileOf = (h) => {
  const { definition, definitionChange, notes, ...rest } = h;
  return { ...rest, lateBuy: rest.lateBuy || { staple: 0, specialty: 0 }, warningDays: rest.warningDays || 0 };
};
const none = { steps: [{ fromDay: 1, lo: 0, mid: 0, hi: 0 }], tag: 'derived', basis: 'None claimed.' };
const flatCurve = (lo, mid, hi, basis) => ({ steps: [{ fromDay: 1, lo, mid, hi }], tag: 'guess', basis });

// The household: its members one by one, and its pets.
const people = [{ id: 1, age: 'adult', valuation: 'personal' }, { id: 2, age: 'adult', valuation: 'personal' }];
const household = { pets: 0 };
const ticks = { coldWinters: false, hotSummers: false, hurricane: false, earthquake: false, wildfire: false, flood: false };

export default {
  version: '2026-11-21',
  currentYear: 2026,

  // Places. Choosing a city sets the preset (data/countries.mjs), the
  // country's own figures where it has them, and the local hazards.
  places: {
    // The United States preset is the United States; Buenos Aires is the
    // preset for that city, and Argentina's own figures serve the rest of
    // the country.
    presetCountries: ['US'],
    presetCities: { AR: ['Buenos Aires'] },
    // Corrections to a country researcher's figure, with the reason.
    adjust: {},
    // How a city's district ratings (ThinkHazard: H high, M medium, L low,
    // V very low) and climate normals become the local-hazard ticks. A tick
    // stands for living in a zone with the hazard's preset probability.
    cityRules: {
      hurricane: ['H', 'M'], earthquake: ['H', 'M'], wildfire: ['H'], flood: ['H'],
      hotSummersHeat: ['H'], coldWintersMaxC: 5, hotSummersMinC: 25,
    },
  },

  // The impartial valuation (MODEL.md, section 7). Figures come from
  // research/impartial/impartial.json unless given here.
  impartial: {
    // The share of a member's work that would not be done if they died. A
    // default for the reader to change.
    counterfactualShare: 0.5,
    // Lost work per unmet day, by need, where set here instead. Only
    // infants are without formula, and a pet's food is felt once by the
    // household, so neither costs a member's work.
    workLoss: { infantFood: { lo: 0, mid: 0, hi: 0, tag: 'derived', basis: 'Only infants are members of this need.' }, petFood: { lo: 0, mid: 0, hi: 0, tag: 'guess', basis: 'Felt by the household, not by a working member.' } },
    // Hazards whose lost work runs through a channel rather than unmet
    // needs, and the channel.
    workDays: {
      pandemicModerate: 'infection', pandemicSevere: 'infection', seasonalIllness: 'seasonalInfection',
      houseFire: 'fire', violentCrime: 'violence', aiFraud: 'financialLoss',
    },
  },

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
    people, household, ticks: { ...ticks, coldWinters: true, hotSummers: true },
    // No city chosen: the United States preset, with its own ticks.
    city: null, country: null,
    // Deaths are valued by remaining life-years unless the reader asks for
    // equal values (the practice of US agencies).
    deathValue: 'lifeYears',
    owned: {}, probabilities: {}, parameters: {},
    pantryDays: 14,
    // The list is ranked on the average of every input, which is what
    // expected value means; the reader can ask for middle values instead.
    rankOn: 'mean',
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
    food: {
      label: 'Food', per: 'person', gap: 'food', special: 'food', demandPerPersonDay: 1,
      // The reader says how many days they could eat from the kitchen now;
      // the research median, 14, is the default (food.json).
      baselineSetting: 'pantryDays',
      // Of what is in the kitchen: half can be eaten as it is, about a
      // quarter needs cooking, and the rest is chilled or frozen and is lost
      // in a power cut of five days or more (food.json, note 1).
      cookShare: 0.23, chilledShare: 0.27,
      // After a while without a cooker a household improvises one. The
      // model's own guess: a week in a house, two in a flat.
      improviseCookDays: { house: 7, apartment: 14 },
      // food.json sizes its multipliers for age and illness on the first
      // weeks; beyond a month without food they are held to 3. The 40 for a
      // critical drug is, the researcher says, really a small addition and
      // not a scaling; it is set to 1.
      lateMultiplierCap: 3,
      adjust: { multipliers: { criticalDrug: { hardship: 2, mortality: 1 } } },
      // Short rations. Half rations: food.json note 3 ($20, $40, $60 a
      // person-day; 1 micromort a day for three months, then 10; none of 36
      // men died on half rations for 24 weeks in the Minnesota experiment).
      // Quarter rations: the verifier's figures, anchored on the Dutch famine
      // of 1944-45 (about 13 micromorts a day under 65 on 500 to 900 kcal).
      rationing: {
        half: {
          hardship: { tag: 'guess', basis: 'food.json note 3.', steps: [{ fromDay: 1, lo: 8, mid: 20, hi: 60 }, { fromDay: 31, lo: 15, mid: 40, hi: 120 }, { fromDay: 91, lo: 25, mid: 60, hi: 180 }] },
          mortality: { tag: 'guess', basis: 'food.json note 3.', steps: [{ fromDay: 1, lo: 0.1, mid: 1, hi: 5 }, { fromDay: 91, lo: 1, mid: 10, hi: 50 }] },
        },
        quarter: {
          hardship: { tag: 'guess', basis: 'Scaled up from the half-ration figures.', steps: [{ fromDay: 1, lo: 20, mid: 60, hi: 180 }, { fromDay: 31, lo: 35, mid: 100, hi: 300 }, { fromDay: 91, lo: 50, mid: 150, hi: 450 }] },
          mortality: { tag: 'guess', basis: 'Dutch famine, 1944-45.', steps: [{ fromDay: 1, lo: 1, mid: 5, hi: 20 }, { fromDay: 31, lo: 4, mid: 15, hi: 60 }, { fromDay: 91, lo: 10, mid: 40, hi: 150 }] },
        },
      },
    },
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
    // A member valued for their work also runs a laptop: about 60 Wh a day
    // (research/impartial/impartial.md).
    devicePower: { label: 'Phone and small devices', per: 'person', gap: 'power', demandPerPersonDay: 15, workerDemandPerPersonDay: 60, baselineIf: [{ if: 'car', days: 30 }] },
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
    // Reaching one's own files, accounts and computer (research/step3/cyber-items.json).
    // Out of reach on 40% of the days without internet (cloud-only files),
    // when an account is locked or a device wiped (the aiFraud window), and
    // on 40% of displaced days, at most a week: the researcher's proposal.
    dataAccess: {
      label: 'Own files and computer', per: 'person', gap: 'dataAccess', leaveEnds: false, home: false,
      access: { commsShare: 0.4, displacedShare: 0.4, displacedCapDays: 7 },
    },
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
    seasonalInfection: { multipliers: { age60to74: { mortality: 6.2 }, age75plus: { mortality: 32 }, child: { mortality: 0.1 } } },
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
      // tail-pandemic.md: at these ages Western Europe lost about half as
      // many to COVID-19 as the United States.
      exposureScale: { location: { westernEurope: 0.5 } },
    },
    pandemicSevere: {
      // tail-pandemic.json puts care at about 0.5 micromorts a day here:
      // overwhelmed, and at the peak unreachable.
      label: 'Pandemic far worse than COVID-19', from: 'tail-pandemic',
    },
    nuclearNear: {
      label: 'Nuclear war reaching your region', from: 'tail-nuclear-grid',
      // The nuclear researcher asks for the fallout figure to be scaled by
      // dwelling: a large block or masonry building shields; a light-frame
      // house does not.
      exposureScale: { dwelling: { apartment: 0.6, house: 1.4 } },
    },
    nuclearFar: { label: 'Nuclear war elsewhere', from: 'tail-nuclear-grid' },
    gridLong: { label: 'Grid failure for weeks or months', from: 'tail-nuclear-grid' },
    bankingCrisis: { label: 'Bank freeze or currency crisis', from: 'tail-finance-unrest' },
    civilUnrest: { label: 'Serious unrest', from: 'tail-finance-unrest' },

    // Hazards added by the AI research. Their probabilities come from it;
    // their windows are the researchers' guesses, set out in the notes of
    // research/ai/ai-cyber.json and ai-war.json.
    cyberOutage: {
      label: 'Blackout from an attack or software failure', aiBase: true,
      definition: cyber.hazards.cyberOutage.definition,
      profile: {
        ...profileOf(cyber.hazards.cyberOutage),
        exposures: [
          { channel: 'co', micromortsPerPerson: guess(0.03, 0.15, 0.6, 'As for a severe storm (hazards-ordinary.json): improvised power and cooking.') },
          { channel: 'fire', micromortsPerPerson: guess(0.02, 0.1, 0.4, 'As for a severe storm (hazards-ordinary.json): candles and improvised cooking.') },
        ],
      },
    },
    paymentsOutage: {
      label: 'Payment systems down', aiBase: true,
      definition: cyber.hazards.paymentsOutage.definition,
      profile: profileOf(cyber.hazards.paymentsOutage),
    },
    commsOutage: {
      label: 'Mobile and internet down', aiBase: true,
      definition: cyber.hazards.commsOutage.definition,
      profile: profileOf(cyber.hazards.commsOutage),
    },
    cyberSupplyShock: {
      label: 'Shops or pharmacies down from an attack or software failure', aiBase: true,
      definition: cyber.hazards.cyberSupplyShock.definition,
      profile: profileOf(cyber.hazards.cyberSupplyShock),
    },
    aiFraud: {
      label: 'Scam or account takeover', aiBase: true,
      definition: 'Someone in the household loses money to an impersonation scam, or loses control of a financial, email or phone account, whether or not AI was used.',
      profile: {
        // Being locked out of one account is not being unable to pay, so the
        // event opens no payments window. In about three in ten events an
        // account is locked or a device wiped, and the household's own files
        // are out of reach (research/step3/cyber-items.json, open questions).
        windows: { dataAccess: { pOccur: 0.3, days: { p50: 3, p90: 14, p99: 60 }, tag: 'guess', basis: 'research/step3/cyber-items.json: account lockout and ransomware.' } },
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
      // The research figure for property is gross of insurance and of who
      // owns the building; the researcher puts the household's own share at
      // 0.25 to 0.4. Location factors are fire-co.json's.
      profile: (R, T) => ({
        probability: { all: 1 }, windows: {},
        exposures: [{ channel: 'fire', micromortsPerPerson: T(R.channels.fire.everydayAnnualMicromortsPerPerson), financialUsdPerHousehold: T(R.channels.fire.everydayAnnualUsdPerHousehold, { scale: 0.35 }) }],
        exposureScale: { dwelling: { house: 1.15, apartment: 0.5 }, location: { westernEurope: 0.5, buenosAires: 1 } },
      }),
    },
    coIncident: {
      everyday: true,
      label: 'Carbon monoxide at home (everyday)',
      definition: 'The yearly risk of carbon monoxide poisoning at home from appliances, heaters, engines and vehicles, for a home with fuel-burning equipment and no alarm.',
      profile: (R, T) => ({
        probability: { all: 1 }, windows: {},
        exposures: [{ channel: 'co', micromortsPerPerson: T(R.channels.co.everydayAnnualMicromortsPerPerson), financialUsdPerHousehold: T(R.channels.co.everydayAnnualUsdPerHousehold) }],
        // fire-co.json gives 0.05 micromorts a year for a home that burns no
        // fuel and has no attached garage, against 1.1 for one that does;
        // and location factors of 0.8 for Western Europe and 2 for Buenos
        // Aires, where unflued gas heaters are common in flats.
        exposureScale: { dwelling: { house: 1.15, apartment: 0.5 }, location: { westernEurope: 0.8, buenosAires: 2 }, conditions: [{ if: 'allElectric', factor: 0.09 }] },
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
        // The figure is for an adult of average risk, like the other everyday
        // baselines, not for a healthy one (8).
        exposures: [{ channel: 'seasonalInfection', micromortsPerPerson: { lo: 5, mid: 21, hi: 68, tag: 'derived', basis: 'medical.json, routine-vaccinations: yearly micromorts averted for an adult aged 15 to 59 of average risk against skipping all routine vaccines; 130 at ages 60 to 74 and 680 at 75 or over.' } }],
      }),
    },
    violentCrime: {
      everyday: true,
      label: 'Burglary and assault at home (everyday)',
      definition: 'The yearly risk of death and loss from burglary and assault at home.',
      profile: (R, T) => ({
        probability: { all: 1 }, windows: {},
        // The research figure of 2 micromorts rests on a cross-check that
        // read a five-year count of burglary homicides as a yearly one; with
        // that corrected it is about 1.2. Location factors are the
        // researcher's, blended over deaths and dollars.
        exposures: [{ channel: 'violence', micromortsPerPerson: guess(0.4, 1.2, 2.5, 'plans-skills-security.json, corrected: about 0.3 from burglary (FBI expanded homicide data, 80 to 110 a year) plus 0.8 from robbery at home.'), financialUsdPerHousehold: T(R.channels.violence.everydayAnnualUsdPerHousehold) }],
        exposureScale: { location: { westernEurope: 0.4, buenosAires: 1.5 } },
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
    // Slips in the researchers' own arithmetic, found on verification.
    corrections: [
      { hazard: 'pandemicSevere', location: 'all', field: 'now', mid: 0.004, reason: 'ai-bio.md: 0.3% + 0.8% x 0.12 = 0.396%, entered as 0.45%.' },
    ],
    // Rates the researchers gave for hazards the model does not carry.
    unused: {
      incomeShock: 'Nothing on the list addresses a lasting fall in earnings.',
      marketCrash: 'Nothing on the list addresses a fall in the value of savings.',
    },
  },

  items: [...items1, ...items2],
  dropped: { ...dropped1, ...dropped2 },
};
