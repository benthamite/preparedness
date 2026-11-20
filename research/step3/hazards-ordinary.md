# hazards-ordinary: reasoning

Labels: **[V]** read on a page or PDF I fetched; **[S]** search snippet only; **[G]** my guess. Household = 2.5 people; US = 335 million people [G].

## 1. The RECS conflict

- Wording [V], 2020 and 2024 forms: "During the past year, has your entire home had a power outage lasting at least 24 hours?" The follow-up asks the reason for the longest one, and "unable to pay electric bills" is an option. So the period is one year, not "ever", and disconnections count.
- The 18% and 22% are too high. EIA Table 11.1 [V]: major-event days added 340 minutes and 0.37 interruptions per customer in 2020, and 531 minutes and 0.47 in 2024. NREL Table 14 [V]: of major-event outages, 50.3% exceed 12 h and 35.7% exceed 24 h; my bin midpoints give a mean of 27 h. Following NREL's method, with the other major-event interruptions at 3 h each [G], large outages per customer = (hours − 3 × interruptions) ÷ 24 = 0.19 in 2020 and 0.31 in 2024. Times 0.357: 6.8% and 11.1% had a 24 h+ outage.
- RECS therefore overstates about twofold, and both cycles fell in the two worst years on record. NREL's 3.5% is centred on 2013–2020. The same arithmetic on the 2015–2025 means (258 minutes, 0.33 interruptions) gives 0.138 large outages a year: **6.9% over 12 h, 4.9% over 24 h, 1.4% over 3 days, 0.18% over a week**.

## 2. Splitting the 6.9%

Climate Central's counts of major weather outages, 2000–2023 [V]: severe weather 58%, winter 23%, tropical 14%, heat 3%. Hurricane and ice outages last longer, so my shares of 12 h+ outages are hurricanes 30%, severe storms 35%, winter 20%, other 15% [G].

- **severeStorm**: 6.9% × 0.35 = 2.4%, entered as 2.5% (1.2–5).
- **winterStorm**: 6.9% × 0.20 = 1.4% nationally, 2.0% for the 70% of households in cold-winter places [G]. Check [V, AHS 2021]: share cold for 24 h+ × share blaming a utility interruption = 0.7–2.0% in seven northern and eastern metros (median 0.9%); Dallas 32%, Houston 45% in the Uri year. 0.9% ÷ 0.65 (24 h to 12 h) = 1.4%, plus a Uri-class year once in 50–100 years [G] = 2.0%.
- **localOutage**: AHS 2023 [V], 25.4% × 70% = 17.7% with a 6 h+ outage, minus 6.9% = 11% (6–16).

## 3. Power quantiles

NREL Table 13 [V], mean of the Central, Eastern and Western regions, conditional on 12 h: 65% exceed 1 day, 30% 2 days, 12% 3, 5.5% 4, 3.2% 5, 1.1% 7. Log-linear interpolation gives p50 1.35 and p90 3.2 days; NREL's p99 is about 7. The tail is thin: the sample is 2015–2021 and the authors say the method "undercounts long-duration outages" [V]. I raise p99 to 9 (severe) and 10 (winter). Texas 2021 [V]: mean 42 h, median 36. Local outages: p50 8 h, p90 12 h, p99 1.8 days [G].

## 4. Net of relief

- Texas 2021 is the worst measured US case [V]: 49% lost running water (median 48 h), 63% had difficulty getting bottled water, 75% food, 47% lost mobile service, 71% internet. Boil notices covered over 17 million people for a mean 8.0 days [V].
- I found no measurement of how long shops stay shut. Food windows (p50 0.7–1.5 days, p99 4–6) and water windows (p50 1–1.5, p99 5–7) are guesses. Against baselines of 14 days of food and 1.5 of water, only the water tail matters.
- Winter water pOccur: Texas was 14 million of about 52 million winter-storm person-events in 2015–2025 (1.4% × 335M × 11). 0.27 × 0.55 + 0.10 × 0.4 + 0.63 × 0.05 = 0.22; the last two rates are guesses.
- The engine already cuts the tap with the power for pumped-water homes, so my water and sanitation windows cover mains homes only.

## 5. waterSystemFailure

- EPA [V]: 4,036 advisories found for 2021, 80% from main breaks or pressure loss; 20 states supplied data; no population or duration totals. Kentucky alone logged about 2,160 a year, mean 5 days [S], so the national count is far higher.
- Probability [G]: 30,000 advisories × 300 people = 9 million = 2.7%, plus 0.2–0.5% for city-wide failures: 3% (1–7).
- Advisory length (`grossDays`): p50 3, p90 8, p99 45. Jackson 2022 [V]: 49 days, running water lost for 5, National Guard water from the next day.
- Net of relief the window is the 1–3 days before bottled water can be had, in the 30% of events [G] big enough to strip shops.
- shareTreatable 0.88 = 1 − 8% no-flow days − 4% chemical events [G].

## 6. heatWave

- Probability 0.5 (0.25–0.9) for a hot-summer household; heat lasts p50 5, p90 10, p99 20 days [G]. Check with cooling.md's all-ages curve: 0.5 × 35 micromorts = 17 a year per person without cooling; × 20 million such people [G] = 350 deaths, against perhaps 500–900 indoor heat deaths a year [G]. Low by about half.
- Grid failure is minor: 48 heat-caused major outages in 24 years [V]. I take 0.5% of households a year, 1% of events.
- Share of harm with the grid up: 95% (85–99). AHS 2023 [V]: of 13.2 million households hot for 24 h+, 1.3 million blamed a power cut of any cause, 4.9 million a broken unit; 1.6 million had none. Maricopa 2023 [V]: a quarter of 645 deaths were indoors, 85% of those with a non-working unit.
- The validator rejects a `heat` window, so the duration is a hazard-level `heat` field. Unless it is copied into the windows, this hazard does nothing for homes without cooling.

## 7. supplyShock

- Episodes [G, recalled]: 1973–74, 1979, March 2020, Colonial 2021 (15% of people): 3.2 per household in 55 years = 6%; entered as 5% (2–12).
- March 2020 [V]: spending on 13 March was 53% above any 2019 day; dried beans +377%, rice +234%; shortages lingered all year. Out-of-stock rates rose from 5–7% to 15–33% at the peak [S]. So about 12% (5–25) of a basket was unobtainable for 2–4 weeks, single categories for 4–8.
- No calories were unobtainable: the true food window is 3% × 1–7 days [G].
- Colonial [V]: over 70% of North Carolina stations dry at the peak, 47% on day 11.
- The harm is a hardship exposure: 1–2 extra hours a week for 4–6 weeks at $20, over 2.5 people = $30–100 a person [G].

## 8. Leave

- Who leaves: 8.4% of outage households stayed away overnight [V]; 18% of Texans, 44% of them to a local relative [V].
- Cost: hotel $177.65 [V] × 1.12 tax ÷ 2.5 + $15 meals = $95 a person-day; hosts $10; a 40/60 blend = $44.
- Feasible [G]: 0.95 local, 0.8 severe storm, 0.55 winter, 0.9 heat, 0.2 supply shock.
- The engine applies lateBuy only when warning is half a day or more, so it is inert for localOutage, severeStorm and waterSystemFailure.

## 9. Exposures

- Severe-storm trauma: NWS 2016–2025 means [V], tornado 51 + wind 57 = 108 deaths; 60% [G] among the 8.4 million people a year in events = 7.7; × 0.8 for a healthy adult = 6 micromorts.
- Texas (DSHS via prior-art.md): CO 19, fire 10, crashes 22, falls 9 over 14 million people with 12 h+ outages (29.5M × 0.915 × 0.69 × 0.75 [G]) = 1.4, 0.7 and 2.2 micromorts; entered as 0.7, 0.5 and 1.5 for a healthy adult with no generator.
- Financial loss counts only spoiled food (14% of outage households [V]; 47% in Texas [V]) and frozen pipes. Dollar amounts are guesses.

## Assumed from others

Hypothermia and heat deaths sit in the warmth and cooling curves. Generator CO is the generator's side risk. Hurricane outages and California safety shut-offs are excluded.

## Could not open

- nrel.gov (DNS failure; read the PNNL mirror); omb.report (403; read eia.gov); npr.org (timeout; used Wikipedia).
- MDPI and DOAJ (403): Kentucky advisory study. pmmag.com (403): boil-alert survey, not used. EPA heat-wave indicator (404).
- Snippets only: McLaughlin 2023 stock-outs; Field Agent, IRI and Datasembly rates; Iowa derecho counts.
- Not re-fetched: Texas DSHS and CPSC reports (from prior-art.md).
- Not searched: FCC cell-site outages; AHS national reasons for cold homes.
