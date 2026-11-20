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
const ai = { timeline: 'middle', concern: 0.5, horizonYears: 5 };
const ba = { location: 'buenosAires', ...data.locations.buenosAires.home, ticks: data.locations.buenosAires.ticks };
const we = { location: 'westernEurope', ...data.locations.westernEurope.home, ticks: data.locations.westernEurope.ticks };

export const PROFILES = {
  'US apartment, two adults': {},
  'US apartment, two adults, middle AI timeline': { ai },
  'US apartment, two adults, short AI timeline, very concerned': { ai: { timeline: 'short', concern: 0.85, horizonYears: 5 } },
  'US apartment, two people over 75': { household: { adults: 0, age75plus: 2, onMedication: 2 } },
  'US house, family of four, hurricane and flood zone': { dwelling: 'house', household: { adults: 2, children: 2 }, ticks: { hurricane: true, flood: true } },
  'US, adult on a critical drug': { household: { adults: 2, onMedication: 1, criticalDrug: 1 } },
  'US apartment with gas, two adults': { cooking: 'gas', heating: 'gas' },
  'Western Europe apartment, two adults': we,
  'Western Europe apartment, one person over 75 living alone': { ...we, household: { adults: 0, age75plus: 1 } },
  'Buenos Aires apartment, two adults': ba,
  'Buenos Aires apartment, two adults, middle AI timeline': { ...ba, ai },
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
      const label = e.items.map((x) => names[x.id] + (x.label ? ` (${x.label})` : '')).join(' + ');
      const h = e.byHazard[0];
      console.log(`${String(i + 1).padStart(2)}. ${e.ratio.toFixed(2).padStart(7)}  ${label.slice(0, 74).padEnd(74)} ${h && e.valueUsd > 0 ? `${h.id} ${Math.round(100 * h.value / e.valueUsd)}%` : ''}`);
    });
  }
}
