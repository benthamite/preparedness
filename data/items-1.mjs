// Model entries for water, sanitation, warmth, cooling, light and power,
// first aid, drugs and communications. Each entry names the research item it
// comes from (`from`) and says how it acts in the engine. Numbers are the
// researcher's unless a comment says otherwise.

import { guess, reduce, reduceAll } from './helpers.mjs';

const days = (n, units) => ({ label: `${n} days`, units });

// A reduction of deaths from injury and acute illness inside hazards applies
// both to the hazard's own injuries and to the days without emergency care.
const trauma = (src, T, hazard, opts = {}) => [
  ...reduce(src, T, 'trauma', { hazard, ...opts }),
  ...reduce(src, T, 'trauma', { hazard, as: 'emergencyCare', ...opts }),
];

export const items = [
  // ---- water ----
  {
    id: 'water-bottled', from: 'bottled-water', group: 'Water',
    ladder: [days(3, 9), days(7, 21), days(14, 42)],
    effects: () => [{ type: 'supply', need: 'water', amount: 1 }],
  },
  {
    id: 'water-stored', from: 'stored-water', group: 'Water',
    ladder: [days(3, 9), days(7, 21), days(14, 42), days(30, 90)],
    effects: () => [{ type: 'supply', need: 'water', amount: 1 }],
  },
  {
    id: 'water-heater-draw', from: 'water-heater-draw', group: 'Water',
    effects: () => [{ type: 'supply', need: 'water', amount: 110 }],
  },
  {
    id: 'bathtub-bladder', from: 'bathtub-bladder', group: 'Water',
    note: 'Only useful when there is warning and the tap still runs; the 75 litres already allow for that.',
    effects: () => [{ type: 'supply', need: 'water', amount: 75 }],
  },
  { id: 'water-filter', from: 'water-filter', group: 'Water', effects: () => [{ type: 'capability', capability: 'treatWater' }] },
  { id: 'water-tablets', from: 'water-purification-tablets', group: 'Water', ladder: null, effects: () => [{ type: 'capability', capability: 'treatWater' }] },
  { id: 'water-bleach', from: 'bleach-for-water', group: 'Water', effects: () => [{ type: 'capability', capability: 'treatWater' }] },
  { id: 'water-carriers', from: 'water-fetch-containers', group: 'Water', effects: (s, T) => reduce(s, T, 'sanitation') },
  { id: 'emergency-toilet', from: 'emergency-toilet-kit', group: 'Sanitation', effects: (s, T) => reduce(s, T, 'sanitation') },
  { id: 'hygiene-bundle', from: 'hygiene-bundle', group: 'Sanitation', effects: (s, T) => reduce(s, T, 'sanitation') },

  // ---- warmth ----
  { id: 'sleeping-bags', from: 'sleeping-bag', group: 'Warmth', effects: (s, T) => reduce(s, T, 'warmth') },
  { id: 'warm-layers', from: 'warm-layers', group: 'Warmth', effects: (s, T) => reduce(s, T, 'warmth') },
  { id: 'warm-room-plan', from: 'one-warm-room-plan', group: 'Warmth', effects: (s, T) => reduce(s, T, 'warmth') },
  {
    // The heater and its fuel are one entry: the heater is the fixed price,
    // cylinders are the ladder. A cylinder runs 5.5 hours; a covered day takes
    // about 14; a covered day removes about 85% of the harm, entered as 0.85
    // of a day. Steps above two cylinders exceed the usual limit for storage
    // inside a dwelling.
    id: 'propane-heater', from: 'heater-fuel-propane', group: 'Warmth',
    name: 'Indoor-rated propane heater with fuel',
    spec: 'A catalytic or radiant heater rated for indoor use, with oxygen-depletion and tip-over cut-offs, and 1-lb propane cylinders.',
    units: 'cylinders',
    fixedPrice: (R, T) => T(R['indoor-propane-heater'].price.usdPerUnit),
    lifeYears: (R, T) => T(R['indoor-propane-heater'].lifeYears),
    setupHours: (R, T) => T(R['indoor-propane-heater'].setupHours),
    upkeepHoursPerYear: (R, T) => T(R['indoor-propane-heater'].upkeepHoursPerYear),
    reliability: (R, T) => T(R['indoor-propane-heater'].reliability, { max: 1 }),
    volumeLitres: 2,
    requires: [],
    ladder: [{ label: '2 cylinders, about a day', units: 2 }, { label: '6 cylinders', units: 6 }, { label: '12 cylinders', units: 12 }],
    effects: () => [
      { type: 'supply', need: 'warmth', amount: 0.85 * 5.5 / 14 },
      { type: 'sideRisk', need: 'warmth', channel: 'co', micromortsPerDay: 'SIDE:heater' },
      { type: 'sideRisk', need: 'warmth', channel: 'fire', micromortsPerDay: 'SIDE:heaterFire' },
    ],
  },

  // ---- cooling ----
  {
    id: 'room-air-conditioner', from: 'room-air-conditioner', group: 'Cooling',
    conditions: ['hotSummers', 'noAirConditioning'],
    effects: (s, T) => reduce(s, T, 'cooling', { hazards: ['all'] }),
  },
  {
    // Researcher: 0.15 of mortality, about 0.3 of hardship.
    id: 'battery-fan', from: 'battery-fan-kit', group: 'Cooling',
    effects: (s, T) => {
      const [m] = reduce(s, T, 'cooling', { hazard: 'heatWave', hazards: ['all'], on: 'mortality' });
      return [m, { ...m, on: 'hardship', fraction: guess(0.15, 0.3, 0.5, 'cooling.json, battery-fan-kit note: fans relieve discomfort more than they prevent death.', 1) }];
    },
  },
  { id: 'heat-plan', from: 'heat-plan', group: 'Cooling', effects: (s, T) => reduce(s, T, 'cooling') },
  {
    id: 'heat-check-in', from: 'heat-check-in', group: 'Cooling',
    conditions: ['hotSummers', 'age60plus', 'livesAlone'],
    effects: (s, T) => reduce(s, T, 'cooling'),
  },
  { id: 'window-shading', from: 'window-shading', group: 'Cooling', effects: (s, T) => reduce(s, T, 'cooling') },

  // ---- light and power ----
  {
    id: 'flashlight', from: 'flashlight', group: 'Light and power',
    name: 'A second flashlight or headlamp',
    note: 'Nearly every household already has a light; that is in the baseline.',
    effects: () => [{ type: 'capability', capability: 'light' }, { type: 'supply', need: 'light', amount: 5 }],
  },
  {
    id: 'spare-batteries', from: 'spare-batteries', group: 'Light and power', requires: [],
    ladder: [{ label: '24 AA cells', units: 1 }, { label: '48 cells', units: 2 }, { label: '96 cells', units: 4 }],
    effects: () => [{ type: 'supply', need: 'light', amount: 60 }],
  },
  {
    id: 'candles', from: 'candles', group: 'Light and power',
    effects: () => [
      { type: 'supply', need: 'light', amount: 80 },
      { type: 'sideRisk', need: 'light', channel: 'fire', micromortsPerDay: 'SIDE:candles' },
    ],
  },
  {
    id: 'power-bank', from: 'power-bank', group: 'Light and power', units: 'watt-hours',
    ladder: [{ label: '10,000 mAh', units: 37 }, { label: '20,000 mAh', units: 74 }, { label: '40,000 mAh', units: 148 }],
    effects: () => [{ type: 'capability', capability: 'chargePhone' }, { type: 'supply', need: 'devicePower', amount: 1 }],
  },
  {
    id: 'solar-charger', from: 'solar-panel', group: 'Light and power',
    effects: () => [{ type: 'capability', capability: 'chargePhone' }, { type: 'supply', need: 'devicePower', amount: 90, renewable: true }],
  },
  {
    // One stock serves phones, the fridge and a medical device. The engine
    // credits it to each need separately, which overstates it a little for a
    // household that has all three.
    id: 'power-station', from: 'power-station', group: 'Light and power', units: 'watt-hours',
    ladder: [{ label: '256 Wh', units: 256 }, { label: '1 kWh', units: 1024 }, { label: '2 kWh', units: 2048 }],
    effects: () => [
      { type: 'capability', capability: 'mainsPower' }, { type: 'capability', capability: 'chargePhone' },
      { type: 'supply', need: 'devicePower', amount: 1 },
      { type: 'supply', need: 'medicalPower', amount: 0.85 },
      { type: 'supply', need: 'refrigeration', amount: 0.85 },
    ],
  },
  {
    id: 'generator', from: 'generator-fuel', group: 'Light and power',
    effects: () => [
      { type: 'capability', capability: 'mainsPower' }, { type: 'capability', capability: 'chargePhone' },
      { type: 'supply', need: 'devicePower', amount: 35000 },
      { type: 'supply', need: 'medicalPower', amount: 35000 },
      { type: 'capability', capability: 'generator' },
      { type: 'supply', need: 'refrigeration', amount: 35000 },
      { type: 'sideRisk', need: 'refrigeration', channel: 'co', micromortsPerDay: 'SIDE:generator' },
    ],
  },
  {
    id: 'medical-backup-battery', from: 'medical-backup-battery', group: 'Light and power',
    scalesWith: 'person', scalesWho: 'powerDependent', units: 'kWh',
    ladder: [{ label: '1 kWh', units: 1 }, { label: '2 kWh', units: 2 }, { label: '4 kWh', units: 4 }],
    effects: () => [{ type: 'supply', need: 'medicalPower', amount: 850 }],
  },
  {
    id: 'medical-power-plan', from: 'medical-power-plan', group: 'Light and power',
    scalesWith: 'person', scalesWho: 'powerDependent',
    name: 'Medical power plan with spare oxygen',
    effects: (s, T) => [{ type: 'supply', need: 'medicalPower', amount: 750 }, ...reduce(s, T, 'medicalPower', { hazards: ['all'] })],
  },
  { id: 'fridge-kit', from: 'fridge-kit', group: 'Light and power', effects: () => [{ type: 'supply', need: 'refrigeration', amount: 650 }] },

  // ---- first aid ----
  {
    id: 'first-aid-kit', from: 'home-first-aid-kit', group: 'First aid',
    effects: (s, T) => [...reduce(s, T, 'trauma', { hazard: 'homeMedicalEmergency' }), ...trauma(s, T, 'severeStorm')],
  },
  {
    id: 'bleeding-control-kit', from: 'bleeding-control-kit', group: 'First aid',
    effects: (s, T) => [...reduce(s, T, 'trauma', { hazard: 'homeMedicalEmergency' }), ...trauma(s, T, 'earthquake'), ...trauma(s, T, 'winterStorm')],
  },
  { id: 'vitals-monitors', from: 'home-vitals-monitors', group: 'First aid', effects: (s, T) => reduce(s, T, 'infection') },
  {
    // One adult takes the course. It protects the others, not the trainee.
    id: 'first-aid-course', from: 'first-aid-cpr-course', group: 'First aid',
    scalesWith: 'household', conditions: ['severalPeople'],
    spec: 'One adult takes a first-aid and CPR course, and refreshes it every two years.',
    effects: (s, T) => [
      { type: 'capability', capability: 'firstAidSkill' },
      ...reduce(s, T, 'trauma', { hazard: 'homeMedicalEmergency', othersOnly: true, group: 'cpr' }),
      ...trauma(s, T, 'severeStorm'),
    ],
  },
  {
    id: 'cpr-self-training', from: 'hands-only-cpr-video', group: 'First aid',
    scalesWith: 'household', conditions: ['severalPeople'],
    spec: 'One adult watches a hands-only CPR video and practises for half an hour a year.',
    effects: (s, T) => reduce(s, T, 'trauma', { hazard: 'homeMedicalEmergency', othersOnly: true, group: 'cpr' }),
  },
  {
    id: 'home-aed', from: 'home-aed', group: 'First aid', conditions: ['severalPeople'],
    effects: (s, T) => reduce(s, T, 'trauma', { hazard: 'homeMedicalEmergency', othersOnly: true }),
  },
  {
    // Not a hazard effect: everyday infection risk. The channel's baseline is
    // the deaths that vaccination averts, so the item removes all of it.
    id: 'vaccinations', from: 'routine-vaccinations', group: 'First aid',
    note: 'Worth nothing extra to people who already keep up to date. Shown as a benchmark.',
    effects: () => [{ type: 'reduce', target: 'seasonalInfection', hazards: ['seasonalIllness'], fraction: 1 }],
  },

  // ---- drugs ----
  {
    id: 'prescription-buffer', from: 'prescription-buffer', group: 'Drugs',
    scalesWith: 'person', scalesWho: 'onMedication', conditions: ['onMedication'],
    ladder: [days(7, 7), days(14, 14), days(30, 30), days(60, 60), days(90, 90)],
    effects: () => [{ type: 'supply', need: 'medication', amount: 1 }],
  },
  {
    id: 'medication-list', from: 'medication-list', group: 'Drugs', conditions: ['onMedication'],
    effects: (s, T) => reduce(s, T, 'medication'),
  },
  {
    // The kit relieves about $0.70 of the $1.10 a day of minor illness that
    // goes untreated when pharmacies are out of reach; the aspirin in it acts
    // on heart attacks.
    id: 'otc-core-kit', from: 'otc-core-kit', group: 'Drugs',
    effects: (s, T) => [
      { type: 'reduce', target: 'minorIllness', hazards: ['all'], on: 'hardship', fraction: 0.64 },
      ...reduce(s, T, 'trauma', { hazard: 'homeMedicalEmergency' }),
      ...trauma(s, T, 'gridLong'),
    ],
  },
  {
    id: 'otc-wider-kit', from: 'otc-wider-kit', group: 'Drugs',
    effects: () => [{ type: 'reduce', target: 'minorIllness', hazards: ['all'], on: 'hardship', fraction: 0.36 }],
  },
  { id: 'emergency-antibiotics', from: 'emergency-antibiotic-pack', group: 'Drugs', effects: (s, T) => trauma(s, T, 'gridLong') },

  // ---- communications ----
  {
    // The radio brings news but cannot call for help: the researcher applies
    // it to hardship and to at most a fifth of the mortality.
    id: 'radio', from: 'battery-radio', group: 'Communications',
    effects: (s, T) => {
      const [r] = reduce(s, T, 'information', { on: 'hardship' });
      return [
        { type: 'capability', capability: 'radio' }, r,
        { ...r, on: 'mortality', fraction: guess(0.01, 0.04, 0.08, 'comms.json, battery-radio: at most a fifth of the 0.2 applies to mortality.', 1) },
        ...reduce(s, T, 'fallout'),
      ];
    },
  },
  { id: 'phone-alerts', from: 'phone-emergency-setup', group: 'Communications', effects: (s, T) => reduceAll(s, T) },
  { id: 'contact-list', from: 'paper-contact-list', group: 'Communications', effects: (s, T) => reduceAll(s, T) },
  { id: 'two-way-radios', from: 'two-way-radios', group: 'Communications', effects: (s, T) => reduceAll(s, T) },
  { id: 'satellite-messenger', from: 'satellite-messenger', group: 'Communications', effects: (s, T) => reduceAll(s, T) },
  { id: 'maps', from: 'offline-and-paper-maps', group: 'Communications', effects: (s, T) => reduceAll(s, T) },
  { id: 'whistle', from: 'whistle', group: 'Communications', effects: (s, T) => reduceAll(s, T) },
  { id: 'faraday-bag', from: 'faraday-bag', group: 'Communications', effects: (s, T) => reduceAll(s, T) },
  { id: 'entertainment', from: 'offline-entertainment', group: 'Communications', effects: (s, T) => reduceAll(s, T, { on: 'hardship' }) },
];

export const dropped = {
  'toilet-paper-stock': 'An everyday good with no window in the model: keeping one spare pack costs almost nothing and is not ranked.',
  'menstrual-supplies': 'As for toilet paper.',
  'mylar-blankets': 'Removes about 1.5% of cold harm at home, where bedding does the same job; it belongs in a go-bag.',
  'indoor-tent': 'Overlaps with the warm-room plan and removes about 7% of cold harm for $80.',
  'indoor-propane-heater': 'Merged with its fuel into one entry.',
  headlamp: 'Merged into the second-light entry.',
  lantern: 'Merged into the second-light entry.',
  'car-charging-kit': 'For car owners, charging from the car is already in the baseline for device power.',
  'first-aid-extras': 'Merged into the first-aid kit; its own effect is a fraction of a micromort.',
  'spare-rescue-medicine': 'Applies to people with asthma or severe allergy, a profile the model does not have. About half a micromort per day without pharmacy or emergency care.',
  'drug-cooler': 'Applies to households holding refrigerated drugs in hot places; averts about $60 per long hot outage.',
  'spare-glasses': "On the researcher's figures, about $0.15 a year of benefit against about $5 of cost.",
};
