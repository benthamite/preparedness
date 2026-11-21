#!/usr/bin/env node
// Print the top of the list for a set of test households, side by side with
// the hazards that drive each entry. Usage: node tools/profiles.mjs [N] [name-filter]

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rank, defaultSettings } from '../src/model.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(join(root, 'data', 'model.json'), 'utf8'));
const top = Number(process.argv[2] || 10);
const filter = process.argv[3];
const ai = { automationYear: 2035, horizonYears: 5 };
const ba = { location: 'buenosAires', ...data.locations.buenosAires.home, ticks: data.locations.buenosAires.ticks };
const we = { location: 'westernEurope', ...data.locations.westernEurope.home, ticks: data.locations.westernEurope.ticks };

const P = (age, extra = {}) => ({ age, valuation: 'personal', ...extra });
const people = (...list) => ({ people: list.map((x, i) => ({ id: i + 1, ...x })) });
// Two adults who value their work impartially, at $100 an hour.
const ea = (extra = {}) => P('adult', { valuation: 'impartial', hourValue: 100, ...extra });

export const PROFILES = {
  'US apartment, two adults': {},
  'US apartment, two adults, full automation in 2035': { ai },
  'US apartment, two adults, full automation in 2030': { ai: { automationYear: 2030, horizonYears: 5 } },
  'US apartment, two adults valued impartially at $100 an hour': people(ea(), ea()),
  'US apartment, two adults valued impartially, full automation in 2035': { ...people(ea(), ea()), ai },
  'US apartment, two people over 75': people(P('age75plus', { onMedication: true }), P('age75plus', { onMedication: true })),
  'US house, family of four, hurricane and flood zone': { dwelling: 'house', ...people(P('adult'), P('adult'), P('child'), P('child')), ticks: { hurricane: true, flood: true } },
  'US, adult on a critical drug': people(P('adult', { criticalDrug: true }), P('adult')),
  'US apartment with gas, two adults': { cooking: 'gas', heating: 'gas' },
  'Western Europe apartment, two adults': we,
  'Western Europe apartment, one person over 75 living alone': { ...we, ...people(P('age75plus')) },
  'Buenos Aires apartment, two adults': ba,
  'Buenos Aires apartment, two adults, full automation in 2035': { ...ba, ai },
};

function settingsOf(patch) {
  const s = defaultSettings(data);
  for (const [k, v] of Object.entries(patch)) s[k] = v !== null && typeof v === 'object' && !Array.isArray(v) ? { ...(s[k] || {}), ...v } : v;
  return s;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const names = Object.fromEntries(data.items.map((it) => [it.id, it.name]));
  for (const [name, patch] of Object.entries(PROFILES)) {
    if (filter && !name.toLowerCase().includes(filter.toLowerCase())) continue;
    const t0 = performance.now();
    const r = rank(data, settingsOf(patch));
    const above = r.entries.findIndex((e) => !(e.ratio > 1));
    const picked = r.entries.slice(0, above < 0 ? r.entries.length : above);
    const up = picked.length ? picked[picked.length - 1].cumulativeUpfrontUsd : 0;
    console.log(`\n## ${name}  (${(performance.now() - t0).toFixed(0)} ms; ${picked.length} entries pay, $${Math.round(up)} upfront)`);
    r.entries.slice(0, top).forEach((e, i) => {
      const label = e.items.map((x) => names[x.id] + (x.label ? ` (${x.label})` : '') + (x.person ? ` [${x.person}]` : '')).join(' + ');
      const h = e.byHazard[0];
      console.log(`${String(i + 1).padStart(2)}. ${e.ratio.toFixed(2).padStart(7)}  ${label.slice(0, 74).padEnd(74)} ${h && e.valueUsd > 0 ? `${h.id} ${Math.round(100 * h.value / e.valueUsd)}%` : ''}`);
    });
  }
}
