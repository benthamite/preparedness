#!/usr/bin/env node
// Print the ranked list for given settings.
// Usage: node tools/rank.mjs [--data FILE] [--robust N] [--top N] ['{"location":"buenosAires"}']
// The JSON argument is merged over the default settings (one level deep for
// household, ticks, owned, probabilities and parameters).

import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rank, robustness, defaultSettings } from '../src/model.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
function option(name, fallback) {
  const i = argv.indexOf(name);
  if (i < 0) return fallback;
  const value = argv[i + 1];
  argv.splice(i, 2);
  return value;
}
const dataFile = option('--data', join(root, 'data', 'model.json'));
const robust = Number(option('--robust', 0));
const top = Number(option('--top', 0));
const data = JSON.parse(readFileSync(dataFile, 'utf8'));
const settings = defaultSettings(data);
if (argv[0]) {
  for (const [k, v] of Object.entries(JSON.parse(argv[0]))) {
    const nested = v !== null && typeof v === 'object' && !Array.isArray(v);
    settings[k] = nested ? { ...(settings[k] || {}), ...v } : v;
  }
}

const t0 = performance.now();
const r = rank(data, settings);
const ms = performance.now() - t0;
const u = robust ? robustness(data, settings, r.entries, { samples: robust }) : null;

function f(x, d = 0) {
  if (x === Infinity) return 'inf';
  return x.toLocaleString('en-US', { maximumFractionDigits: d, minimumFractionDigits: d });
}
const names = Object.fromEntries(data.items.map((it) => [it.id, it.name || it.id]));
console.log(`${r.entries.length} entries, ${r.events} events, ${ms.toFixed(0)} ms. Micromort = $${f(r.micromortValueUsd, 2)}.`);
console.log(`Expected harm per year: unprepared $${f(r.harm.unprepared.usd)} + ${f(r.harm.unprepared.mm, 1)} micromorts; with everything $${f(r.harm.end.usd)} + ${f(r.harm.end.mm, 1)}.`);
console.log('Hazards: ' + r.hazards.map((h) => `${h.id} ${(100 * h.p).toPrecision(2)}%`).join(', '));
console.log('');
console.log(['#', 'entry', 'upfront $', 'hours', 'cost $/y', 'hardship $/y', 'mm/y', 'ratio', robust ? 'P(>1)' : '', 'main hazard', 'break-even'].join('\t'));
r.entries.forEach((e, i) => {
  if (top && i >= top) return;
  const label = e.items.map((x) => names[x.id] + (x.label ? ` (${x.label})` : '') + (x.person ? ` [${x.person}]` : '')).join(' + ');
  const h = e.byHazard[0];
  const share = h && e.valueUsd > 0 ? `${h.id} ${Math.round(100 * h.value / e.valueUsd)}%` : '';
  const be = e.breakEven ? `${(100 * e.breakEven.probability).toPrecision(2)}% vs ${(100 * e.breakEven.current).toPrecision(2)}%` : '';
  console.log([i + 1, label, f(e.upfrontUsd), f(e.setupHours, 1), f(e.annualCostUsd, 2), f(e.hardshipUsd, 2), f(e.micromorts, 2), f(e.ratio, 2), u ? f(u[i].pAbove1, 2) : '', share, be].join('\t'));
});
