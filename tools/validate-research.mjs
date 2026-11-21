#!/usr/bin/env node
// Validate a step 3 research file against the schema in research/BRIEF.md.
// Usage: node tools/validate-research.mjs FILE.json [FILE.json ...]
// Exits 0 when every file is valid, 1 otherwise. Prints one line per error.

import { readFileSync } from 'node:fs';
import { COUNTRIES, COUNTRY_FIELDS } from '../data/countries.mjs';

const TAGS = ['data', 'derived', 'guess'];
const NEEDS = ['water', 'food', 'warmth', 'cooling', 'light', 'devicePower', 'refrigeration',
  'medicalPower', 'information', 'medication', 'sanitation', 'payments', 'displacement', 'dataAccess'];
const CHANNELS = ['infection', 'smoke', 'fallout', 'co', 'fire', 'trauma', 'violence', 'financialLoss'];
const WINDOWS = ['power', 'gas', 'water', 'food', 'medication', 'emergencyCare', 'payments',
  'comms', 'sanitation', 'displacement'];
const HAZARDS = ['localOutage', 'severeStorm', 'winterStorm', 'heatWave', 'hurricane', 'earthquake',
  'wildfire', 'flood', 'waterSystemFailure', 'supplyShock', 'pandemicModerate', 'pandemicSevere',
  'nuclearNear', 'nuclearFar', 'gridLong', 'bankingCrisis', 'civilUnrest', 'houseFire', 'coIncident',
  'homeMedicalEmergency', 'seasonalIllness', 'violentCrime', 'cyberOutage', 'paymentsOutage', 'commsOutage',
  'cyberSupplyShock', 'aiFraud', 'greatPowerWar'];
const PROFILES = ['child', 'age60to74', 'age75plus', 'powerDependent', 'criticalDrug', 'limitedMobility'];
const CONDITIONS = ['coldWinters', 'hotSummers', 'hurricane', 'earthquake', 'wildfire', 'flood',
  'house', 'apartment', 'car', 'infant', 'pet', 'powerDependent', 'criticalDrug', 'age60plus'];
const LOCATIONS = ['us', 'westernEurope', 'buenosAires', 'all'];
const OUTLOOKS = ['forecast', 'pessimistic', 'all'];
const AI_HAZARDS = ['pandemicModerate', 'pandemicSevere', 'cyberOutage', 'gridLong', 'waterSystemFailure',
  'paymentsOutage', 'commsOutage', 'cyberSupplyShock', 'bankingCrisis', 'supplyShock', 'aiFraud',
  'greatPowerWar', 'nuclearNear', 'nuclearFar', 'civilUnrest'];
// Years from the start of 2027 to full labour automation.
const LEAD_YEARS = [1, 3, 5, 8, 12, 20, 30];
const EFFECT_TYPES = ['supply', 'capability', 'reduce', 'sideRisk', 'other'];

function validate(doc) {
  const errors = [];
  const err = (path, msg) => errors.push(`${path}: ${msg}`);
  const isNum = (x) => typeof x === 'number' && Number.isFinite(x);
  const isStr = (x) => typeof x === 'string' && x.trim().length > 0;
  const isObj = (x) => x !== null && typeof x === 'object' && !Array.isArray(x);

  function triple(x, path, { max } = {}) {
    for (const k of ['lo', 'mid', 'hi']) {
      if (!isNum(x[k])) { err(path, `${k} must be a number`); return; }
    }
    if (x.lo < 0) err(path, 'lo must not be negative');
    if (!(x.lo <= x.mid && x.mid <= x.hi)) err(path, 'need lo <= mid <= hi');
    if (max !== undefined && x.hi > max) err(path, `hi must not exceed ${max}`);
  }
  function tagged(x, path) {
    if (!TAGS.includes(x.tag)) err(path, `tag must be one of ${TAGS.join(', ')}`);
    if (!isStr(x.basis)) err(path, 'basis must be a non-empty string');
  }
  function Q(x, path, opts) {
    if (!isObj(x)) { err(path, 'must be a quantity {lo, mid, hi, tag, basis}'); return; }
    triple(x, path, opts);
    tagged(x, path);
  }
  function optQ(x, path, opts) { if (x !== undefined && x !== null) Q(x, path, opts); }
  function curve(x, path) {
    if (!isObj(x)) { err(path, 'must be a curve {tag, basis, steps}'); return; }
    tagged(x, path);
    if (!Array.isArray(x.steps) || x.steps.length === 0) { err(path, 'steps must be a non-empty array'); return; }
    let last = 0;
    x.steps.forEach((s, i) => {
      const p = `${path}.steps[${i}]`;
      if (!isObj(s)) { err(p, 'must be an object'); return; }
      if (!Number.isInteger(s.fromDay) || s.fromDay < 1) err(p, 'fromDay must be an integer >= 1');
      else if (s.fromDay <= last) err(p, 'fromDay must increase');
      else last = s.fromDay;
      triple(s, p);
    });
    if (x.steps[0].fromDay !== 1) err(path, 'the first step must start at fromDay 1');
  }
  function multipliers(x, path, keys) {
    if (x === undefined) return;
    if (!Array.isArray(x)) { err(path, 'must be an array'); return; }
    x.forEach((m, i) => {
      const p = `${path}[${i}]`;
      if (!isObj(m)) { err(p, 'must be an object'); return; }
      if (!PROFILES.includes(m.profile)) err(p, `profile must be one of ${PROFILES.join(', ')}`);
      if (!keys.some((k) => isNum(m[k]))) err(p, `needs a numeric ${keys.join(' or ')}`);
      for (const k of keys) if (m[k] !== undefined && !(isNum(m[k]) && m[k] >= 0)) err(p, `${k} must be a non-negative number`);
      tagged(m, p);
    });
  }
  function evidence(x, path, required) {
    if (x === undefined && !required) return;
    if (!Array.isArray(x) || (required && x.length === 0)) { err(path, 'must be a non-empty array'); return; }
    x.forEach((e, i) => {
      const p = `${path}[${i}]`;
      if (!isObj(e)) { err(p, 'must be an object'); return; }
      if (!isStr(e.claim)) err(p, 'claim must be a non-empty string');
      if (!isStr(e.source)) err(p, 'source must be a non-empty string');
      if (typeof e.verified !== 'boolean') err(p, 'verified must be true or false');
    });
  }
  function strings(x, path) {
    if (x === undefined) return;
    if (!Array.isArray(x) || x.some((s) => typeof s !== 'string')) err(path, 'must be an array of strings');
  }
  function oneOf(x, list, path, what) {
    if (!list.includes(x)) err(path, `${what} must be one of ${list.join(', ')}`);
  }

  function items(doc) {
    if (doc.needs !== undefined && !Array.isArray(doc.needs)) err('needs', 'must be an array');
    (Array.isArray(doc.needs) ? doc.needs : []).forEach((n, i) => {
      const p = `needs[${i}]`;
      if (!isObj(n)) { err(p, 'must be an object'); return; }
      oneOf(n.id, NEEDS, `${p}.id`, 'need id');
      if (!isStr(n.definition)) err(`${p}.definition`, 'must be a non-empty string');
      Q(n.baselineCoverageDays, `${p}.baselineCoverageDays`);
      curve(n.hardshipUsdPerPersonDay, `${p}.hardshipUsdPerPersonDay`);
      curve(n.mortalityMicromortsPerPersonDay, `${p}.mortalityMicromortsPerPersonDay`);
      multipliers(n.multipliers, `${p}.multipliers`, ['hardship', 'mortality']);
    });
    if (doc.channels !== undefined && !Array.isArray(doc.channels)) err('channels', 'must be an array');
    (Array.isArray(doc.channels) ? doc.channels : []).forEach((c, i) => {
      const p = `channels[${i}]`;
      if (!isObj(c)) { err(p, 'must be an object'); return; }
      oneOf(c.id, CHANNELS, `${p}.id`, 'channel id');
      if (!isStr(c.definition)) err(`${p}.definition`, 'must be a non-empty string');
      optQ(c.everydayAnnualMicromortsPerPerson, `${p}.everydayAnnualMicromortsPerPerson`);
      optQ(c.everydayAnnualUsdPerHousehold, `${p}.everydayAnnualUsdPerHousehold`);
      if (!isStr(c.inHazards)) err(`${p}.inHazards`, 'must be a non-empty string');
      multipliers(c.multipliers, `${p}.multipliers`, ['hardship', 'mortality']);
    });
    if (!Array.isArray(doc.items) || doc.items.length === 0) { err('items', 'must be a non-empty array'); return; }
    const seen = new Set();
    doc.items.forEach((it, i) => {
      const p = `items[${i}]${isObj(it) && isStr(it.id) ? ` (${it.id})` : ''}`;
      if (!isObj(it)) { err(p, 'must be an object'); return; }
      if (!isStr(it.id) || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(it.id)) err(`${p}.id`, 'must be kebab-case');
      else if (seen.has(it.id)) err(`${p}.id`, 'duplicate id');
      else seen.add(it.id);
      for (const k of ['name', 'spec', 'unit']) if (!isStr(it[k])) err(`${p}.${k}`, 'must be a non-empty string');
      oneOf(it.scalesWith, ['person', 'household', 'fixed'], `${p}.scalesWith`, 'scalesWith');
      if (it.ladder !== undefined) {
        if (!Array.isArray(it.ladder) || it.ladder.length === 0) err(`${p}.ladder`, 'must be a non-empty array when present');
        else {
          let last = 0;
          it.ladder.forEach((s, j) => {
            if (!isObj(s) || !isStr(s.label) || !isNum(s.units) || s.units <= last) err(`${p}.ladder[${j}]`, 'needs a label and units that increase');
            else last = s.units;
          });
        }
      }
      if (!isObj(it.price)) err(`${p}.price`, 'must be an object');
      else {
        Q(it.price.usdPerUnit, `${p}.price.usdPerUnit`);
        if (!isStr(it.price.product)) err(`${p}.price.product`, 'must be a non-empty string');
        if (typeof it.price.source !== 'string') err(`${p}.price.source`, 'must be a string (empty if none)');
        if (typeof it.price.verified !== 'boolean') err(`${p}.price.verified`, 'must be true or false');
      }
      Q(it.lifeYears, `${p}.lifeYears`);
      Q(it.setupHours, `${p}.setupHours`);
      Q(it.upkeepHoursPerYear, `${p}.upkeepHoursPerYear`);
      Q(it.upkeepUsdPerYear, `${p}.upkeepUsdPerYear`);
      Q(it.everydayShare, `${p}.everydayShare`, { max: 1 });
      if (!(isNum(it.volumeLitresPerUnit) && it.volumeLitresPerUnit >= 0)) err(`${p}.volumeLitresPerUnit`, 'must be a non-negative number');
      Q(it.reliability, `${p}.reliability`, { max: 1 });
      oneOf(it.lateBuyClass, ['staple', 'specialty', 'none'], `${p}.lateBuyClass`, 'lateBuyClass');
      strings(it.requires, `${p}.requires`);
      strings(it.conditions, `${p}.conditions`);
      (Array.isArray(it.conditions) ? it.conditions : []).forEach((c) => oneOf(c, CONDITIONS, `${p}.conditions`, 'condition'));
      if (!Array.isArray(it.effects) || it.effects.length === 0) err(`${p}.effects`, 'must be a non-empty array');
      else it.effects.forEach((e, j) => {
        const q = `${p}.effects[${j}]`;
        if (!isObj(e)) { err(q, 'must be an object'); return; }
        oneOf(e.type, EFFECT_TYPES, `${q}.type`, 'effect type');
        if (e.type === 'supply') {
          oneOf(e.need, NEEDS, `${q}.need`, 'need');
          if (!(isNum(e.amountPerUnit) && e.amountPerUnit > 0)) err(`${q}.amountPerUnit`, 'must be a positive number');
          if (!isStr(e.amountUnit)) err(`${q}.amountUnit`, 'must be a non-empty string');
        } else if (e.type === 'capability') {
          if (!isStr(e.capability)) err(`${q}.capability`, 'must be a non-empty string');
        } else if (e.type === 'reduce') {
          oneOf(e.target, [...NEEDS, ...CHANNELS], `${q}.target`, 'target');
          if (!Array.isArray(e.hazards) || e.hazards.length === 0) err(`${q}.hazards`, 'must list hazard ids, or ["all"]');
          else e.hazards.forEach((h) => oneOf(h, [...HAZARDS, 'all'], `${q}.hazards`, 'hazard'));
          Q(e.fractionRemoved, `${q}.fractionRemoved`, { max: 1 });
          Q(e.adherence, `${q}.adherence`, { max: 1 });
        } else if (e.type === 'sideRisk') {
          oneOf(e.channel, CHANNELS, `${q}.channel`, 'channel');
          Q(e.micromortsPerDayOfUse, `${q}.micromortsPerDayOfUse`);
        } else if (e.type === 'other') {
          if (!isStr(e.description)) err(`${q}.description`, 'must be a non-empty string');
        }
      });
      evidence(it.evidence, `${p}.evidence`, true);
      oneOf(it.confidence, TAGS, `${p}.confidence`, 'confidence');
    });
  }

  function hazards(doc) {
    if (!Array.isArray(doc.hazards) || doc.hazards.length === 0) { err('hazards', 'must be a non-empty array'); return; }
    doc.hazards.forEach((h, i) => {
      const p = `hazards[${i}]${isObj(h) && isStr(h.id) ? ` (${h.id})` : ''}`;
      if (!isObj(h)) { err(p, 'must be an object'); return; }
      oneOf(h.id, HAZARDS, `${p}.id`, 'hazard id');
      if (!isStr(h.definition)) err(`${p}.definition`, 'must be a non-empty string');
      if (!Array.isArray(h.annualProbability) || h.annualProbability.length === 0) err(`${p}.annualProbability`, 'must be a non-empty array');
      else h.annualProbability.forEach((a, j) => {
        const q = `${p}.annualProbability[${j}]`;
        if (!isObj(a)) { err(q, 'must be an object'); return; }
        oneOf(a.location, LOCATIONS, `${q}.location`, 'location');
        oneOf(a.outlook, OUTLOOKS, `${q}.outlook`, 'outlook');
        Q(a, q, { max: 1 });
      });
      if (!isObj(h.windows)) err(`${p}.windows`, 'must be an object (may be empty)');
      else for (const [k, w] of Object.entries(h.windows)) {
        const q = `${p}.windows.${k}`;
        oneOf(k, WINDOWS, q, 'window id');
        if (!isObj(w)) { err(q, 'must be an object'); continue; }
        Q(w.pOccur, `${q}.pOccur`, { max: 1 });
        const d = w.days;
        if (!isObj(d) || !['p50', 'p90', 'p99'].every((x) => isNum(d[x]) && d[x] >= 0)) err(`${q}.days`, 'needs numeric p50, p90, p99');
        else if (!(d.p50 <= d.p90 && d.p90 <= d.p99)) err(`${q}.days`, 'need p50 <= p90 <= p99');
        tagged(w, q);
        if (k === 'water') Q(w.shareTreatable, `${q}.shareTreatable`, { max: 1 });
      }
      optQ(h.coldShare, `${p}.coldShare`, { max: 1 });
      optQ(h.hotShare, `${p}.hotShare`, { max: 1 });
      if (!isObj(h.leave)) err(`${p}.leave`, 'must be an object');
      else {
        Q(h.leave.feasible, `${p}.leave.feasible`, { max: 1 });
        Q(h.leave.earliestDay, `${p}.leave.earliestDay`);
        Q(h.leave.fixedUsdPerHousehold, `${p}.leave.fixedUsdPerHousehold`);
        Q(h.leave.usdPerPersonDay, `${p}.leave.usdPerPersonDay`);
      }
      Q(h.warningDays, `${p}.warningDays`);
      if (!isObj(h.lateBuy)) err(`${p}.lateBuy`, 'must be an object');
      else {
        Q(h.lateBuy.staple, `${p}.lateBuy.staple`, { max: 1 });
        Q(h.lateBuy.specialty, `${p}.lateBuy.specialty`, { max: 1 });
      }
      if (h.exposures !== undefined && !Array.isArray(h.exposures)) err(`${p}.exposures`, 'must be an array');
      (Array.isArray(h.exposures) ? h.exposures : []).forEach((e, j) => {
        const q = `${p}.exposures[${j}]`;
        if (!isObj(e)) { err(q, 'must be an object'); return; }
        oneOf(e.channel, CHANNELS, `${q}.channel`, 'channel');
        if (!isStr(e.description)) err(`${q}.description`, 'must be a non-empty string');
        optQ(e.micromortsPerPerson, `${q}.micromortsPerPerson`);
        optQ(e.hardshipUsdPerPerson, `${q}.hardshipUsdPerPerson`);
        optQ(e.financialUsdPerHousehold, `${q}.financialUsdPerHousehold`);
        if (!e.micromortsPerPerson && !e.hardshipUsdPerPerson && !e.financialUsdPerHousehold) err(q, 'needs at least one of the three harm quantities');
        multipliers(e.multipliers, `${q}.multipliers`, ['hardship', 'mortality']);
      });
      evidence(h.evidence, `${p}.evidence`, true);
    });
  }

  function parameters(doc) {
    if (!Array.isArray(doc.parameters) || doc.parameters.length === 0) { err('parameters', 'must be a non-empty array'); return; }
    const seen = new Set();
    doc.parameters.forEach((x, i) => {
      const p = `parameters[${i}]${isObj(x) && isStr(x.id) ? ` (${x.id})` : ''}`;
      if (!isObj(x)) { err(p, 'must be an object'); return; }
      if (!isStr(x.id)) err(`${p}.id`, 'must be a non-empty string');
      else if (seen.has(x.id)) err(`${p}.id`, 'duplicate id');
      else seen.add(x.id);
      if (!isStr(x.definition)) err(`${p}.definition`, 'must be a non-empty string');
      if (!isStr(x.unit)) err(`${p}.unit`, 'must be a non-empty string');
      Q(x.value, `${p}.value`);
    });
    if (doc.anchors !== undefined && !Array.isArray(doc.anchors)) err('anchors', 'must be an array');
    (Array.isArray(doc.anchors) ? doc.anchors : []).forEach((a, i) => {
      const p = `anchors[${i}]`;
      if (!isObj(a)) { err(p, 'must be an object'); return; }
      for (const k of ['event', 'cause', 'source']) if (!isStr(a[k])) err(`${p}.${k}`, 'must be a non-empty string');
      for (const k of ['deaths', 'exposedPersons', 'exposureDays', 'micromortsPerExposedPersonDay']) Q(a[k], `${p}.${k}`);
    });
  }

  // Kind "ai": how advanced AI changes hazard probabilities. See research/BRIEF-AI.md.
  function ai(doc) {
    const rates = doc.hazardRates;
    if (rates !== undefined && !Array.isArray(rates)) err('hazardRates', 'must be an array');
    (Array.isArray(rates) ? rates : []).forEach((r, i) => {
      const p = `hazardRates[${i}]${isObj(r) && isStr(r.hazard) ? ` (${r.hazard})` : ''}`;
      if (!isObj(r)) { err(p, 'must be an object'); return; }
      if (!r.newHazard) oneOf(r.hazard, HAZARDS, `${p}.hazard`, 'hazard id (or set newHazard: true)');
      else if (!isStr(r.hazard)) err(`${p}.hazard`, 'must be a non-empty string');
      oneOf(r.location, LOCATIONS, `${p}.location`, 'location');
      for (const k of ['baseline', 'now', 'transition', 'after']) Q(r[k], `${p}.${k}`, { max: 1 });
      if (!isStr(r.mechanism)) err(`${p}.mechanism`, 'must be a non-empty string');
      evidence(r.evidence, `${p}.evidence`, true);
    });
    const views = doc.views;
    if (views !== undefined && !Array.isArray(views)) err('views', 'must be an array');
    (Array.isArray(views) ? views : []).forEach((x, i) => {
      const p = `views[${i}]`;
      if (!isObj(x)) { err(p, 'must be an object'); return; }
      for (const k of ['who', 'claim', 'source']) if (!isStr(x[k])) err(`${p}.${k}`, 'must be a non-empty string');
      if (typeof x.verified !== 'boolean') err(`${p}.verified`, 'must be true or false');
    });
    const tl = doc.timelines;
    if (tl !== undefined && !Array.isArray(tl)) err('timelines', 'must be an array');
    (Array.isArray(tl) ? tl : []).forEach((x, i) => {
      const p = `timelines[${i}]`;
      if (!isObj(x)) { err(p, 'must be an object'); return; }
      for (const k of ['id', 'label', 'source']) if (!isStr(x[k])) err(`${p}.${k}`, 'must be a non-empty string');
      if (!Array.isArray(x.cumulative) || x.cumulative.length < 2) { err(`${p}.cumulative`, 'needs at least two {year, p} points'); return; }
      let lastYear = 0, lastP = 0;
      x.cumulative.forEach((c, j) => {
        if (!isObj(c) || !Number.isInteger(c.year) || !isNum(c.p) || c.p < 0 || c.p > 1 || c.year <= lastYear || c.p < lastP) err(`${p}.cumulative[${j}]`, 'needs an increasing year and a non-decreasing p in [0, 1]');
        else { lastYear = c.year; lastP = c.p; }
      });
    });
    if (doc.parameters !== undefined) parameters(doc);
    if (!rates && !tl && !views) err('root', 'needs hazardRates, timelines or views');
  }


  // How AI-driven risk depends on the years left before full labour
  // automation (research/BRIEF-AI-LEADTIME.md).
  function aiLeadTime(doc) {
    if (!isStr(doc.method)) err('method', 'must be a non-empty string');
    for (const k of ['turbulentYears', 'runUpYears', 'referenceLeadYears']) Q(doc[k], k);
    const scale = (x, path) => {
      if (!isObj(x)) { err(path, 'must be an object'); return; }
      if (!Array.isArray(x.factors)) { err(`${path}.factors`, 'must be an array'); return; }
      const leads = x.factors.map((f) => f && f.leadYears);
      if (JSON.stringify(leads) !== JSON.stringify(LEAD_YEARS)) err(`${path}.factors`, `leadYears must be exactly ${LEAD_YEARS.join(', ')}, in order`);
      x.factors.forEach((f, i) => Q(f && f.factor, `${path}.factors[${i}].factor`));
      if (!isStr(x.mechanism)) err(`${path}.mechanism`, 'must be a non-empty string');
      evidence(x.evidence, `${path}.evidence`, false);
    };
    const hz = doc.hazards;
    if (!isObj(hz)) err('hazards', 'must be an object keyed by hazard id');
    else {
      for (const id of AI_HAZARDS) if (!hz[id]) err(`hazards.${id}`, 'missing');
      for (const [id, x] of Object.entries(hz)) {
        if (!AI_HAZARDS.includes(id)) err(`hazards.${id}`, `not an AI hazard (${AI_HAZARDS.join(', ')})`);
        scale(x, `hazards.${id}`);
        if (x && x.afterFactors !== undefined) scale({ factors: x.afterFactors, mechanism: 'after', evidence: [] }, `hazards.${id}.afterFactors`);
      }
    }
    scale(doc.existential, 'existential');
    for (const k of ['blockedSources', 'openQuestions']) if (!Array.isArray(doc[k])) err(k, 'must be an array');
  }

  // Country figures (research/BRIEF-COUNTRIES.md): every listed country, every
  // field of the family.
  function countries(d) {
    const fields = COUNTRY_FIELDS[d.group];
    if (!fields) { err('group', `must be one of ${Object.keys(COUNTRY_FIELDS).join(', ')}`); return; }
    if (!isStr(d.method)) err('method', 'must be a non-empty string');
    if (!Array.isArray(d.anchors) || !d.anchors.length) err('anchors', 'must be a non-empty array');
    else d.anchors.forEach((a, i) => {
      const p = `anchors[${i}]`;
      if (!isObj(a)) { err(p, 'must be an object'); return; }
      if (!['us', 'westernEurope', 'buenosAires'].includes(a.preset)) err(`${p}.preset`, 'must be us, westernEurope or buenosAires');
      if (!fields.includes(a.field)) err(`${p}.field`, `must be one of ${fields.join(', ')}`);
      Q(a.reproduced, `${p}.reproduced`);
      if (!isStr(a.comment)) err(`${p}.comment`, 'must be a non-empty string');
    });
    if (!Array.isArray(d.countries)) { err('countries', 'must be an array'); return; }
    const seen = new Set();
    d.countries.forEach((c, i) => {
      const p = `countries[${i}]`;
      if (!isObj(c)) { err(p, 'must be an object'); return; }
      if (!COUNTRIES.some((x) => x.iso2 === c.iso2)) err(`${p}.iso2`, `${c.iso2} is not in data/countries.mjs`);
      if (seen.has(c.iso2)) err(`${p}.iso2`, `${c.iso2} appears twice`);
      seen.add(c.iso2);
      if (!isObj(c.values)) { err(`${p}.values`, 'must be an object'); return; }
      for (const f of fields) {
        const prob = /forecast|pessimistic|probability/.test(f);
        Q(c.values[f], `${p}.values.${f}`, prob ? { max: 1 } : {});
      }
      for (const k of Object.keys(c.values)) if (!fields.includes(k)) err(`${p}.values.${k}`, 'is not a field of this family');
      if (/forecast/.test(fields.join()) ) {
        for (const f of fields.filter((x) => x.endsWith('.forecast'))) {
          const q = f.replace('forecast', 'pessimistic');
          if (isObj(c.values[f]) && isObj(c.values[q]) && c.values[q].mid < c.values[f].mid) err(`${p}.values.${q}`, 'pessimistic mid is below forecast mid');
        }
      }
    });
    for (const c of COUNTRIES) if (!seen.has(c.iso2)) err('countries', `${c.iso2} (${c.name}) is missing`);
  }

  if (!isObj(doc)) return ['root: must be a JSON object'];
  if (!isStr(doc.group)) err('group', 'must be a non-empty string');
  if (doc.kind === 'items') items(doc);
  else if (doc.kind === 'hazards') hazards(doc);
  else if (doc.kind === 'parameters') parameters(doc);
  else if (doc.kind === 'ai') ai(doc);
  else if (doc.kind === 'countries') countries(doc);
  else if (doc.kind === 'aiLeadTime') aiLeadTime(doc);
  else err('kind', 'must be items, hazards, parameters, ai or countries');
  strings(doc.blockedSources, 'blockedSources');
  strings(doc.openQuestions, 'openQuestions');
  return errors;
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('usage: validate-research.mjs FILE.json [FILE.json ...]');
  process.exit(2);
}
let failed = false;
for (const file of files) {
  let errors;
  try {
    errors = validate(JSON.parse(readFileSync(file, 'utf8')));
  } catch (e) {
    errors = [`cannot read or parse: ${e.message}`];
  }
  if (errors.length === 0) console.log(`OK ${file}`);
  else {
    failed = true;
    console.log(`INVALID ${file} (${errors.length} errors)`);
    for (const e of errors) console.log(`  ${e}`);
  }
}
process.exit(failed ? 1 : 0);
