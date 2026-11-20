# tail-pandemic: pandemicModerate and pandemicSevere

Labels: [V] read on a fetched page, [S] search snippet only, [R] recalled.

## 1. Annual probability

The two hazards are exclusive. pandemicModerate = at least COVID-19's death toll but under 1% of the world. pandemicSevere = over 1% of the world dead within five years, fatality of several percent in working-age adults.

**Correction to step 2.** Marani et al. corrected their paper in March 2023 for a coding error [V]. A 1918-intensity event now recurs every 879 years (730–1,081), not 400; the lifetime chance of a COVID-like pandemic is 17%, not 38%. `base-rates.md` and Duke's "2% a year" use the old figures.

| Source | COVID-scale or worse, per year | Over 1% of humanity, per year |
|---|---|---|
| Madhav et al. 2023, Metabiota catalogue [V] | 2–3% (4.2% for 10M+ deaths) | 0.8% (over 80M); 0.6% (100M+) |
| Metabiota 2021 via CGD [V] | 2.5–3.3% | |
| Marani, corrected [V] | 0.2–0.8% (523 or 129 years) | 0.11%; 0.34% if emergence triples |
| Cambeiro 2023 [V] | 2.1% (19% for over 20M in 2023–32; base rate 2 in 123 years) | |
| Metaculus [S] | 0.5% (5% for over 25M in 2022–31) | |
| Tournament superforecasters [V, via arXiv 2312.14289] | | 0.11% (0.04 engineered + 0.07 natural, 2023–30) |
| Tournament biosecurity experts [V, same] | | 0.32% (2023–30); 0.56% (2030–50) |

- **Moderate, forecast: 1.5% (0.4–3%).** Median of the first column, about 1.8%, less 0.2% severe.
- **Moderate, pessimistic: 3% (1.5–6%).** Madhav's 4.2% less 0.8%; Metabiota's 3.3%; Marani's threefold rise applied to 2–3% gives 6%.
- **Severe, forecast: 0.2% (0.06–0.8%).** Superforecasters at the bottom, Metabiota at the top; their tenfold gap on natural pandemics is unexplained.
- **Severe, pessimistic: 1% (0.4–3%).** Who says what:
  - Tournament experts, 2030–50: 0.56%.
  - Metabiota: 0.8%, natural only.
  - Forecasting Research Institute 2025 [V]: 46 experts put a human-caused epidemic of over 100,000 deaths at 0.3% a year, 1.5% once AI matches top virologists on troubleshooting, which o3 did by April 2025. Only part of that would be this severe.
  - Metaculus [S]: 5% that an engineered pandemic infects a billion within five years of AGI.
  - Ord [S]: 1 in 30 for existential catastrophe from engineered pandemics by 2100.
  - Amodei 2026 [V] and Gopal, Esvelt et al. 2023 [V, abstract]: grave warnings, no number.

## 2. Infection exposure, moderate

US COVID deaths at 15–59 [V, CDC; I take 39% of the 55–64 band as 55–59], over 197M people:

| Year | Deaths | Micromorts |
|---|---|---|
| 2020 | 46,200 | 234 |
| 2021 | 96,700 | 491 |
| 2022 | 32,600 | 165 |
| To Sep 2023 | 179,200 | 910 |

- Event = two years: **725, entered as 700 (150–3,000)**.
- Attack rate 0.35: 20.2% of blood donors by May 2021 [S], about a third by December 2021 [R].
- Implied fatality 0.21%; the Lancet gives 0.057% at age 30 and 1.0% at 60 [V].
- About 55% fell before vaccines opened to all adults (234 + 35% of 491; monthly split [R]). A prompt vaccinator faced about 450.

**Hardship: $450.** 0.35 × $1,320 per infection:
- 65% symptomatic × 10 days × $70 = $455
- 2% hospitalised × $10,000 = $200
- 0.65 × 7% with symptoms at three months [V, Wulf Hanson: 6.2% overall, mean 4 months, 15% still ill at 12] × 0.08 quality-adjusted years × $182,500 = $665

**Illness cost: $400 per household.** 0.35 × 2 adults × $550 (unpaid isolation days for the 25% without sick leave [S], hospital bills, long illness).

**Wider income loss (`financialLoss`): $2,500 (0–12,000).** 42% of US households had a job loss or pay cut by August 2020 [S]; wages about 3.5% below trend [R].

**Age multipliers.** Equal mix of COVID (0.02, 8, 35) and Metabiota's average pandemic, two-thirds influenza [V, Table 9: deaths per 10,000 of 3.0 at 20–59, 6.9 at 60–79, 15 at 80+, 1.6 at 1–9]:

| | Child | 60–74 | 75+ |
|---|---|---|---|
| Moderate | 0.25 | 5 | 20 |
| Severe (catalogue alone) | 0.4 | 2.3 | 4.5 |

## 3. Infection exposure, severe

A scenario, not a measurement: attack rate 0.30 × fatality 3% at 15–59 = **9,000 micromorts (1,500–80,000)**.

- Low: 0.12 × 1.2%. High: 0.5 × 16%.
- Anchor: 1918 killed about 0.65% of Americans [R] and 2.7% of the world; case fatality above 2.5%, a third of the world infected, nearly half the deaths at 20–40 [V].
- Hardship $3,000 and illness cost $2,000 are guesses (0.30 × $10,000; 0.30 × 2 × $3,000).
- Income loss $15,000: output falls 5–20%; McKibbin and Sidorenko's "ultra" case loses 12.6% of world output [S].

## 4. Windows

**Moderate.** Shops, pharmacies and utilities worked throughout 2020.
- Food, 3% of events, 5/14/30 days: an isolating household with no delivery slot. Of food-insufficient adults (a tenth of all [R]), 15.9% could not get out and 8.2% could not get delivery [S]: 1–2.5% of households.
- Medication, 4%, 5/21/60 days: guess.
- Emergency care, 70%, 60/150/300 days at the trauma channel's `careStrained` rate. Bottom-up: 60–75 days × 0.2 = 12–15 micromorts at 15–59. Top-down: 28% of 522,368 excess deaths not attributed to COVID [V] = 440 micromorts at all ages × ¼ delayed care × 0.3 for this age = about 30.

**Severe.** All guesses.
- Food, 30% (8–70%), 7/28/60 days. Absenteeism evidence:
  - For: a model finds widespread shortages above a 25% loss of labour [V, abstract]. Planning assumed 40% absent at the peak [S]. Fewer than half of 1,100 New York emergency workers were willing and able to work [V]. Infection of 3.5% of meat-plant workers cut output 40% [V]. Shops and warehouses hold five days [V].
  - Against: 5% of US workers out sick in January 2022 broke nothing [V]. Food stayed on sale in 1918. Grain stocks exceed a year [V].
  - No source gives a collapse threshold. The tail drives the result.
- Medication, 30%, 14/60/180 days.
- Emergency care, 95%, 90/240/540 days, a third at `careAbsent`.
- Power, 8%, and water, 4%: qualitative basis only. NERC called COVID a "people event" [S]; Gopal et al. and ALLFED assert cascading failure without a threshold. Mid = an ordinary outage (4% in three months) repaired late, plus a few percent.

## 5. Warning, late buying, leaving

- **Warning.** Moderate 35 days (3–70): Wuhan lockdown to empty US shelves took 46–59; 2009 gave none. Severe 14 (guess).
- **Staples.** Moderate 0.92: 13% of items out at the peak against 5–7% normally [S]. Severe 0.65 (guess).
- **Specialty.** Moderate 0.15, severe 0.05. The 2020 record:

| Item | Scarce for |
|---|---|
| N95s | about 13 months; still unavailable to most consumers on 27 Jan 2021 [V] |
| Freezers | back-ordered to late May–August by 20 April [V] |
| Thermometers | shipping in May or June on 31 March [V] |
| Toilet paper | out at 70–73% of stores from 23 March to 12 April, 48% on 19 April [V] |
| Sanitiser, oximeters, flour, yeast | one to four months [R/S] |

- **Leaving.** Feasible in 3% and 2% of events. 5% of New Yorkers left in spring 2020 [S]: isolation, not exit.

## 6. How long a household would want to avoid contact

- **COVID-19, US.** 64 weeks from first spread to a prompt adult's full vaccination. Three waves [R dates]: spring 2020 (10 weeks), summer (10), winter (16). Any one place had two: about 180 days (100–260).
- **1918.** Three waves within 8–9 months per country [V]; 6–10 weeks per city [R].
- **1957, 2009.** Two waves of 8–10 weeks [R]; the 2009 vaccine came 173 days in, after the peak [S].
- **Severe.** 100 days (CEPI's target) to two years; 150 high-incidence days (45–400).

## 7. Assumptions about others' numbers

$500 per healthy day (`food.json`); the trauma channel's two rates; the 14-day food baseline; `respiratory.json` turns days at home into risk avoided.

## 8. Could not open

PMC (Marani full text); the tournament report PDF (too large); EA Forum (429); Forecasting Research Institute memo PDF (404); Metaculus; samotsvety.org; three ALLFED PDF addresses (404); Springer (Huff full text); the 2005 US pandemic plan; CDC's weekly deaths series (400); NPR (read a mirror); GreaterWrong (Gopal full text).
