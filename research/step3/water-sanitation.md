# water-sanitation: reasoning

Labels: **[V]** read on a page I fetched; **[S]** search snippet only; **[R]** recalled. Everything [S] or [R] is tagged `guess` in the JSON.

## Quantity

3 L per person per day for drinking and minimal cooking (range 2–4.5). It sits between BBK's 2 L, the UK's and Sweden's 3 L, CDC's 1 gal (3.8 L, which includes hygiene) [V] and Gleick's 5 L as cited by FEMA [V]. In dangerous heat, 4–5 L.

## Water: hardship

FEMA's residential value is $74.38 per person per day (2022 dollars): $66.26 of welfare loss plus $8.12 for 6.6 gal of bottled water [V]. How it is built matters:

- It integrates a constant-elasticity demand curve (elasticity −0.41, $6.13 per 1,000 gal) from 160 gal down to a 25 L "basic requirement". I reproduced it: 0.695 × $0.981 × 97.3 = $66.3. So it values lost showers, flushing and laundry, not drinking water.
- It assumes the 25 L stays purchasable at $1.23 per gallon. An unmet day in this model is the case where it is not.
- It is flat per day.

Extending FEMA's curve below 25 L gives $945 for the cut to 1 gal. That is the curve breaking down, so I did not use it.

So FEMA's figure (about $86 today at CPI ×1.15, my estimate [R]) anchors the sum of the water and sanitation curves, not the water curve alone.

- Day 1 = $35. Seeking water: 1–2 h × $20 ÷ 2.5 people = $8–16. Illness: 1% × $500 = $5. The rest is thirst, rationing and worry.
- Check: Hurricane Harvey prices of $42.96 and $99 per 12 L case [S] are $11–25 per person-day, and some people paid them.
- Curve: 35, then 60 (day 2), 100 (day 4), 130 (day 8). Ranges run from about a third to four times the middle. It rises as substitutes run out and flattens as people adapt.
- Water plus sanitation: 43, 75, 125, 160. That crosses $86 near day 3. FEMA's flat value is too high for day 1 and too low after a week.

All of this is `guess`.

## Water: mortality

Per unmet day, healthy adult = chance of illness from unsafe water × case fatality.

- Chance of illness: mains breaks in Norway raised household illness in the following week from 8.0% to 12.7% [S], about 0.3–0.7% a day. Confirmed contamination is worse: Walkerton, 2,300 ill of 4,800 [S], roughly 3–7% a day. I take 1% (0.2–5%).
- Case fatality: norovirus causes 900 deaths in 19–21 million cases, mostly among those 65 and over [V]. If 90% of deaths are 65+ [R], under-65s have 90 ÷ 17 million ≈ 5–6 per million. Bacterial causes are deadlier, so I take 15 (5–100).
- 1% × 15 = 0.15, rounded to 0.1 (0.01–1) for days 1–3. Then 0.3 from day 4 and 1 from day 15, as sources get dirtier.

Checks:

- Puerto Rico after Maria: 17–26 leptospirosis deaths [S; 57 confirmed cases V] ÷ (3.3 million × 68 days without water) = 0.08–0.12 per person-day, all ages.
- Texas 2021: none of 246 deaths was from water. Three unmet days cost 0.3 micromorts here, against 8–24 for the whole storm.

Age: adults 65+ are 83% of gastroenteritis deaths [V]. That is 258 per million person-years [S] against 17% × 11,255 ÷ 250 million ≈ 7.6 for under-65s, a ratio of 34. I assign 8 to ages 60–74 and 40 to 75+. Texas nursing homes with power and water both out had 0.60 points higher 4-week mortality (CI 0.04–1.16) [V]; water alone was not significant.

## Sanitation

FEMA assigns $0 to residential wastewater loss and says the true value is unlikely to be zero [V]. I take a third of the $76 indoor-use welfare loss, $25, from day 4, and $8 on day 1. `guess`.

Mortality is bounded by Christchurch 2011: 80% of water and sewerage systems severely damaged, thousands of chemical toilets, household latrines, and "a small increase in gastroenteritis", 18 notified cases above average in a month [V].

- 18 × 10–100 unreported cases ÷ 3–6 million person-days without sewerage = 0.003–0.06% a day.
- × 5–15 deaths per million cases = 0.0002–0.01 micromorts.
- I use 0.005 with a high end of 0.1, because one unpublished survey claimed a 14-fold rise [S].

Crowded shelters are worse (Katrina megashelter: 4.6 gastroenteritis clinic visits per 1,000 people per day [S]), but that belongs to displacement.

## Baseline

- Water: 1.5 days (0.5–6). About 4.5 L per person of drinks, ice and part-cases of bottled water. 53.6% of households self-report a three-day supply [V], but that includes deliberate preparers.
- The water heater tank is excluded because few people use it. It is a separate, nearly free item I added: 150 L median tank (93.5% of US homes have one [S]) × 0.75 who would not have used it unprompted = 110 L.
- Sanitation: 0.5 days, one 6 L flush per cistern [R].

## Pumped supply

- US: mains pressure reaches about the sixth floor [S]. About 3.3 million units are in buildings of seven or more storeys [S, undated], roughly 2.5% of 130–145 million. Roof tanks last hours to a day.
- Private wells: over 23 million households [S], 13–17%. Water stops with the power.
- Buenos Aires: a pump and a roof tank holding about a day's use is standard [S for the rule, R for prevalence]. My estimate is two thirds of city households.
- Western Europe: 10–25%, a guess. Málaga reported it in the 2025 blackout [S].

## Items

- Filter: misses viruses and chemicals [V].
- Bleach: misses Cryptosporidium, weak on Giardia [V].
- Chlorine dioxide tablets: miss nothing microbial if the 4-hour wait is kept [V for Cryptosporidium, R for times]. 30 L a pack.
- None removes chemicals [V]. Boiling kills all pathogens and is the baseline whenever power or gas works.
- Bathtub bladder: 380 L × 0.5 (can fill it) × 0.4 (gain over an open tub) = 75 L effective.
- Toilet kit removes 35% of sanitation harm and the hygiene bundle 20%. Handwashing prevents about 30% of diarrhoea [V]; sanitiser is weak against norovirus [V]. Both fractions are guesses.
- Toilet paper and menstrual products fit no window, so they are recorded as `other` effects.
- Verified prices: filter $28.99, bleach $6.39, bladder $39.99, bucket toilet $21.99, tampons $8.99. The rest are snippets.

## Assumed from other researchers

Value of time $20 an hour; household of 2.5; window probabilities and `shareTreatable`; a rule that boiling counts as `treatWater`.

## Sources I could not open

- Axios (403): the 26 leptospirosis deaths.
- PubMed 22491338 (cookie wall): age-specific gastroenteritis death rates.
- Scallan 2011 tables in EID: deaths per illness by pathogen.
- NMHC apartment-stock page and the AHS Table Creator: units by storeys.
- PubMed 17389718 and MMWR mm5440a3: read as snippets only.
- relianceoutdoors.com (429), REI, Sportsman's, Cabela's, Bass Pro, Walmart, Academy's water-container page (403 or bot wall): prices.
- waterbob.com: shows no price.
- Buenos Aires roof-tank sizing rule: not found.
