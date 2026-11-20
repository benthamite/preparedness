// Helpers for data/config.mjs and the item files.

// A number of the model's own, with a range and the reason for it.
export const guess = (lo, mid, hi, basis, max) => ({
  lo, mid, hi, tag: 'guess', basis, ...(max === undefined ? {} : { max }),
});

// A researcher's "reduce" effect on `target`, as engine effects. Researchers
// give one fraction (for mortality) and sometimes a separate one for hardship
// (`hardshipFractionRemoved`); the engine takes them as two effects.
// Options: hazard (pick the effect whose hazard list includes it), as (retarget),
// hazards (override the scope), group, othersOnly, both (one effect for both),
// on, scale (multiply the fraction), fraction (replace it).
export function reduce(src, T, target, opts = {}) {
  const e = src.effects.find((x) => x.type === 'reduce' && x.target === target
    && (!opts.hazard || x.hazards.includes(opts.hazard)));
  if (!e) throw new Error(`${src.id}: no reduce effect on ${target}${opts.hazard ? ` for ${opts.hazard}` : ''}`);
  const base = { type: 'reduce', target: opts.as || target, hazards: opts.hazards || e.hazards, adherence: T(e.adherence, { max: 1 }) };
  for (const k of ['group', 'othersOnly']) if (opts[k] !== undefined) base[k] = opts[k];
  const scale = opts.scale === undefined ? 1 : opts.scale;
  const mortality = opts.fraction || T(e.fractionRemoved, { max: 1, scale });
  if (opts.both || opts.on || !e.hardshipFractionRemoved) return [{ ...base, fraction: mortality, ...(opts.on ? { on: opts.on } : {}) }];
  const h = e.hardshipFractionRemoved;
  const hardship = T({ ...h, basis: h.basis || e.fractionRemoved.basis }, { max: 1, scale });
  return [{ ...base, on: 'mortality', fraction: mortality }, { ...base, on: 'hardship', fraction: hardship }];
}

// Every "reduce" effect of a research item, translated as it stands.
// Options: group, othersOnly, on; only (keep effects on these targets);
// hazards (a function from the researcher's list to the list to use).
export function reduceAll(src, T, opts = {}) {
  return src.effects.filter((x) => x.type === 'reduce' && (!opts.only || opts.only.includes(x.target))).map((e) => {
    const base = { type: 'reduce', target: e.target, hazards: opts.hazards ? opts.hazards(e.hazards, e.target) : e.hazards, adherence: T(e.adherence, { max: 1 }), fraction: T(e.fractionRemoved, { max: 1 }) };
    for (const k of ['group', 'othersOnly', 'on']) if (opts[k] !== undefined) base[k] = opts[k];
    return base;
  });
}

export const price = (src, T) => T(src.price.usdPerUnit);

// Hazards in which the household is without power at home for a day or more.
export const OUTAGES = ['localOutage', 'severeStorm', 'winterStorm', 'heatWave', 'hurricane', 'earthquake', 'flood', 'gridLong', 'cyberOutage', 'greatPowerWar', 'nuclearNear'];
