#!/usr/bin/env node
// Print a compact digest of step 3 research files, for review.
// Usage: node tools/digest-research.mjs [--items|--needs|--hazards|--params|--open] [FILE.json ...]
// With no files, reads research/step3/*.json.

import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
let files = args.filter((a) => !a.startsWith('--'));
if (!files.length) {
  const dir = join(root, 'research', 'step3');
  files = readdirSync(dir).filter((f) => f.endsWith('.json')).sort().map((f) => join(dir, f));
}
const want = (f) => flags.size === 0 || flags.has(f);

const n = (x) => {
  if (x === undefined || x === null) return '-';
  if (Math.abs(x) >= 100) return String(Math.round(x));
  if (Math.abs(x) >= 1) return String(Math.round(x * 10) / 10);
  return String(Number(x.toPrecision(2)));
};
const q = (x) => (x ? `${n(x.mid)} [${n(x.lo)}–${n(x.hi)}]${x.tag ? x.tag[0] : ''}` : '-');
const curve = (c) => (c ? c.steps.map((s) => `d${s.fromDay}:${n(s.mid)}[${n(s.lo)}–${n(s.hi)}]`).join(' ') + ` (${c.tag})` : '-');
const clip = (s, len = 110) => (s && s.length > len ? `${s.slice(0, len)}…` : s || '');

for (const file of files) {
  const d = JSON.parse(readFileSync(file, 'utf8'));
  console.log(`\n===== ${basename(file)} (${d.kind}) =====`);
  if (d.kind === 'items') {
    if (want('--needs')) {
      for (const x of d.needs || []) {
        console.log(`NEED ${x.id}: baseline ${q(x.baselineCoverageDays)} days`);
        console.log(`  hardship $/pd: ${curve(x.hardshipUsdPerPersonDay)}`);
        console.log(`  mortality mm/pd: ${curve(x.mortalityMicromortsPerPersonDay)}`);
        for (const m of x.multipliers || []) console.log(`  x ${m.profile}: hardship ${n(m.hardship)} mortality ${n(m.mortality)} (${m.tag})`);
      }
      for (const x of d.channels || []) {
        console.log(`CHANNEL ${x.id}: everyday ${q(x.everydayAnnualMicromortsPerPerson)} mm/person/yr, ${q(x.everydayAnnualUsdPerHousehold)} $/hh/yr`);
        for (const m of x.multipliers || []) console.log(`  x ${m.profile}: hardship ${n(m.hardship)} mortality ${n(m.mortality)} (${m.tag})`);
      }
      for (const x of d.sideRisks || []) console.log(`SIDERISK ${clip(x.activity, 50)} [${x.channel}]: ${q(x.micromortsPerDayOfUse)} mm/day; alarm removes ${q(x.fractionRemovedByAlarm)}`);
    }
    if (want('--items')) {
      for (const it of d.items) {
        const lad = it.ladder ? ` ladder ${it.ladder.map((s) => s.units).join('/')}` : '';
        console.log(`ITEM ${it.id} | ${clip(it.name, 60)} | per ${it.scalesWith}, unit=${clip(it.unit, 40)}${lad}`);
        console.log(`  $${q(it.price.usdPerUnit)}${it.price.verified ? ' ✓' : ''} life ${q(it.lifeYears)}y setup ${n(it.setupHours.mid)}h upkeep ${n(it.upkeepHoursPerYear.mid)}h+$${n(it.upkeepUsdPerYear.mid)}/y everyday ${n(it.everydayShare.mid)} vol ${n(it.volumeLitresPerUnit)}L rel ${n(it.reliability.mid)} late=${it.lateBuyClass} conf=${it.confidence}`);
        if ((it.requires || []).length || (it.conditions || []).length) console.log(`  requires [${(it.requires || []).join(', ')}] conditions [${(it.conditions || []).join(', ')}]`);
        for (const e of it.effects) {
          if (e.type === 'supply') console.log(`  + supply ${e.need}: ${n(e.amountPerUnit)} ${clip(e.amountUnit, 30)}`);
          else if (e.type === 'capability') console.log(`  + capability ${e.capability}`);
          else if (e.type === 'reduce') console.log(`  + reduce ${e.target} in [${e.hazards.join(',')}]: removes ${q(e.fractionRemoved)} × adherence ${q(e.adherence)} | ${clip(e.notes, 90)}`);
          else if (e.type === 'sideRisk') console.log(`  + sideRisk ${e.channel}: ${q(e.micromortsPerDayOfUse)} mm/day, mitigated by ${e.mitigatedBy || '-'}`);
          else console.log(`  + other: ${clip(e.description, 120)}`);
        }
      }
      for (const x of d.excluded || []) console.log(`EXCLUDED ${clip(String(x.what), 50)}: ${clip(x.reason, 90)}`);
    }
  } else if (d.kind === 'hazards' && want('--hazards')) {
    for (const h of d.hazards) {
      console.log(`HAZARD ${h.id}${h.tickBox ? ` (tick ${h.tickBox})` : ''}: ${clip(h.definition, 120)}`);
      for (const a of h.annualProbability) console.log(`  P ${a.location}/${a.outlook}: ${q(a)}`);
      for (const [k, w] of Object.entries(h.windows || {})) {
        console.log(`  window ${k}: p ${q(w.pOccur)} days ${n(w.days.p50)}/${n(w.days.p90)}/${n(w.days.p99)}${w.shareTreatable ? ` treatable ${q(w.shareTreatable)}` : ''} (${w.tag})`);
      }
      console.log(`  cold ${q(h.coldShare)} hot ${q(h.hotShare)} | leave feasible ${q(h.leave.feasible)} from day ${q(h.leave.earliestDay)} $${q(h.leave.fixedUsdPerHousehold)} + $${q(h.leave.usdPerPersonDay)}/pd | warning ${q(h.warningDays)}d late staple ${q(h.lateBuy.staple)} specialty ${q(h.lateBuy.specialty)}`);
      for (const x of h.exposures || []) {
        console.log(`  exposure ${x.channel}: ${q(x.micromortsPerPerson)} mm/person, $${q(x.hardshipUsdPerPerson)}/person, $${q(x.financialUsdPerHousehold)}/hh | ${clip(x.description, 80)}`);
        for (const m of x.multipliers || []) console.log(`    x ${m.profile}: hardship ${n(m.hardship)} mortality ${n(m.mortality)}`);
      }
    }
  } else if (d.kind === 'parameters' && want('--params')) {
    for (const p of d.parameters) console.log(`PARAM ${p.id} = ${q(p.value)} ${p.unit} | ${clip(p.definition, 80)}`);
    for (const a of d.anchors || []) console.log(`ANCHOR ${clip(a.event, 40)} / ${a.cause}: ${q(a.deaths)} deaths, ${q(a.exposedPersons)} exposed × ${q(a.exposureDays)} d → ${q(a.micromortsPerExposedPersonDay)} mm/pd`);
  }
  if (want('--open')) {
    for (const x of d.openQuestions || []) console.log(`OPEN ${clip(x, 220)}`);
    for (const x of d.blockedSources || []) console.log(`BLOCKED ${clip(x, 160)}`);
  }
}
