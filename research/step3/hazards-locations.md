# Location presets, Western Europe and Buenos Aires: reasoning

Eighteen entries: nine hazards, two locations. Each entry carries one `annualProbability` for its own location, so `build-data.mjs` reads it as that location's profile (windows, shares, leave, exposures). Per-number arguments are in each `basis`; this file gives the conventions and the arithmetic that matters.

## 1. Conventions

- **Thresholds.** `localOutage` starts at 4 hours, storm events at 6. Named storms, heat waves and winter storms hold their own power windows and are removed from `localOutage`.
- **Windows are net of relief.** Water windows cover the municipal supply only; the building pump is the engine's `pumpedWater` setting. Comms windows start when service is lost.
- **Heat.** The engine reads `win.heat`, which the validator rejects, so heat-wave entries carry `extraWindows.heat`.
- **Tags.** `derived` only where the backbone is something I read (CEER tables, ENRE reports, Ofgem, E-Redes, EEA, Chesini). Recalled figures and search snippets are `guess`, and say so.
- **Rates, 19 Nov 2026.** EUR 1 = USD 1.099 (ECB via frankfurter.dev); USD 1 = ARS 1,585 (official retail selling rate, dolarapi.com).

## 2. Probabilities

| Hazard | W. Europe | Buenos Aires | Arithmetic |
|---|---|---|---|
| localOutage | 3% | 25% | below |
| severeStorm | 0.7% | 2% | customers cut off in named storms / customers / years |
| winterStorm | 0.1% | 0.8% | about 4M household-events / 130M households / 25 years; BA is a guess |
| heatWave | 60% | 50% | count of years with a spell; BA: 6 in 13 summers, 5 of the last 5 |
| flood | 0.5% | 2.5% | 272,000 flooded a year / 52M in flood-prone areas; BA: 4 city floods in 13 years before the relief tunnels, none since |
| earthquake | 0.2% | 0.003% | Italy: 600,000 homeless in 50 years / 23M exposed = 0.05%, times 3-5 |
| wildfire | 0.4% | 8% (smoke only) | about 100,000 evacuated a year / 10-40M exposed |
| waterSystemFailure | 0.6% | 4% | England and Wales 0.7M household-events / 25M / 11 years = 0.25%; Ireland 3.5-4.8% |
| supplyShock | 7% | 25% | episodes per country since 2000; BA 8-9 in 25 years |

**Western Europe outages.** CEER 6.1: population-weighted unplanned SAIDI about 35 minutes, SAIFI about 0.7. With a log-normal spread (sigma 1.1-1.3, assumed) 3% of interruptions last 4 hours or more: 0.7 × 0.03 = 2%, cut to 1.5-2% for clustering. System blackouts: (56M + 59M) / 390M / 25 years = 1.15%. Total 3%.

**Buenos Aires outages.** ENRE, Sep 2024-Feb 2025: Edenor SAIFI 1.39, SAIDI 3.58 h; Edesur 4.12, 7.37 h. Annual frequency about 2.8 and 7-8.5; mean length 2.6 h and 1.8 h. City comunas had 25% and 60% of company-wide frequency in 2019: 0.7 and 4.2 a year. Shares over 4 h (log-normal, sigma 1.2): 17% and 10%. So 1 − e^(−0.12) = 11% and 1 − e^(−0.43) = 35%; weighted 45/55 = 24%. Plus 5% (force-majeure blackouts), minus 7.5% (heat waves: 0.5 × 0.15) = 22-24%, entered as 25%. All causes: about 35% a year, against 4.5% in Western Europe.

**Storms, Western Europe.** France 1.1%, Britain 1.2%, Ireland 8%, Portugal 1.5%, others 0.2-0.5%; population-weighted 0.74%.

## 3. Windows

- **Storm power, Western Europe (derived).** Share still out, pooled over four storms of about 1M customers: day 1, 40% (Arwen 18%, Éowyn 55%); days 3-4, 14% (Arwen 4%, Éowyn 27%); day 7, 5% (Arwen 0.4%, Éowyn 13%); day 14, 1% (Kristin 3%). Quantiles 0.7 / 4.5 / 14 days.
- **Storm power, Buenos Aires (derived).** 143,339 users out 36 hours after the December 2023 storm, of 400,000-600,000 at the peak (24-36%); Edenor 94% back in 96 hours. Quantiles 1 / 3.3 / 9.
- **Routine outage.** Western Europe 0.25 / 0.6 / 2, from the Iberian restoration (35% at 7.5 h, 87% at 15.5 h, 99% at 17.5 h; snippets). Buenos Aires 0.3 / 1.1 / 5; implied mean 13 h × 0.3 events = 4 h of SAIDI, consistent with comuna figures.
- **Heat-wave outage, Buenos Aires.** 202,287 Edesur users (8% of 2.5M) compensated for 6-20 March 2023; with shorter cuts and Edenor, 15% of households. Quantiles 0.5 / 3 / 9; tail from February 1999 (11 days).
- **Heat days.** Western Europe 5 / 12 / 22; Buenos Aires 5 / 10 / 16.
- Everything else is a guess, shaped on the same events.

## 4. Exposures

- **Flood, Western Europe (derived).** 5,213 deaths in 46 years = 113 a year; 113 / 272,000 flooded = 416 micromorts at all ages. Valencia 735, ordinary river floods about 100. Healthy adult 120 (10-1,500). Age 75+ ×6.
- **Flood, Buenos Aires.** La Plata 300-450, the city 23, Bahía Blanca 53; healthy adult 40 (3-600).
- **Earthquake, Western Europe.** 678 Italian deaths since 1990 = 19 a year / 23M = 0.85 a year; / 0.002 = 420; entered 300 (30-3,000).
- **Wildfire.** 25 civilian deaths a year / 100,000 threatened = 250; entered 80 (5-1,500), since two events supply half the deaths.
- **Storms.** 1-2.4 micromorts per person in a cut-off household; Lothar 11.
- **Supply shock, Buenos Aires.** 10-25% price jump on USD 350-500 of monthly purchases = USD 35-125; entered 40.
- No exposures for outages or heat: those deaths run through needs. Checks on the need curves: the Iberian blackout cost 147 / 48.6M = 3 micromorts per resident (interval −0.7 to 6.8); a three-day Buenos Aires heat wave costs 3 × 11 / 2.9M = 11, against 10.5 from the cooling curve; December 2013 cost 0.428 × 89 × 9 / 2.9M = 118.

## 5. Leave, warning, late buying

- Western Europe: EUR 60 travel (USD 66); EUR 75 a person a day (half a EUR 110 room plus EUR 20 meals) = USD 82. No price page read.
- Buenos Aires: ARS 40,000 travel (USD 25); half a three-star double at ARS 77,000-128,000 (Despegar, snippet) plus meals = USD 40.
- Warning: none for faults, earthquakes and water failures; 0.5-1.5 days for storms; 3 days for heat; 2 days for Argentine devaluations.

## 6. Assumptions about numbers owned by others

- Cooling curve as in `cooling.json`. With my heat windows it yields about 39 (Western Europe) and 25 (Buenos Aires) all-ages micromorts a year without air conditioning, against about 90-100 and 29 observed. Western Europe may need a twofold scaling.
- Warmth curve is calibrated on Texas. Buenos Aires cold is mild, so I set `coldShare` to 0.35 as a severity discount.
- Food baseline about 14 days, so sub-week food windows do nothing.
- Unprepared households boil water while power or gas works.
- Carbon monoxide and candle fires in outages belong to coping side risks.

## 7. Weakest points

- The share of interruptions over 4 hours is assumed in both places; no duration distribution was found. Buenos Aires comuna ratios are from 2019.
- Winter storm, wildfire and earthquake probabilities rest on recalled event lists and guessed exposed populations.
- Flood and wildfire deaths per event span two orders of magnitude, and ground-floor and upper-floor homes differ sharply; one profile cannot hold both.
- Buenos Aires earthquake and wildfire are essentially absent. I entered a near-zero earthquake probability and a smoke-only wildfire so the model never borrows another location's figure.
- Heat-wave outages sit under `heatWave`, so the Buenos Aires preset must tick hot summers by default.

## 8. Sources I could not open

- ENTSO-E final report on the Iberian blackout (connection refused).
- CEER 7th report (not attempted; 6.1 used, data to 2016).
- ENRE full report for March-August 2025; any Buenos Aires outage-duration distribution (not found).
- Eurosurveillance paper beyond the abstract.
- Snippets only: Ofgem Arwen final report, GSMA Iberian mobile report, EPA Ireland, DWI, ISGlobal 2024, Enedis, Red Eléctrica, Westenergie, Valencia press.
- Not found or unreadable: INDEC regional air-conditioning tables, the Buenos Aires roof-tank rule, the city flood-risk map, INPRES seismic zoning.
