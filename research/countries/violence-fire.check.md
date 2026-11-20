# Check: violence and fire country figures

Files checked: `violence.json` / `.md`, `fire.json` / `.md`. Both pass `tools/validate-research.mjs` (OK). I changed nothing: I found no clear error in a figure, a unit or a tag. The open points below are judgment calls or inconsistencies for the owner.

## What I checked

**Arithmetic.** I recomputed every country's chain in both files (D, B and the blend; registration ratio × CTIF ratio × place factor × alarm factor; CO ratio × 1.42 and the shrinkage weights). All agree to rounding. I also recomputed the population-weighted anchors: Western Europe violence 0.51, fire 0.36, CO 0.51.

**Violence sources.**

- UNODC homicide rates (Wikipedia table, updated February 2026): 34 countries checked, all match, including the US 2023 figure of 5.76.
- Eurostat `crim_off_cat` ICCS05012 per 100,000, 2022–24 means: re-pulled from the API for all 23 reporting countries. All match, including Luxembourg 2020–21 and Turkey 63.
- SAPS Q1 2024/25: 382 robbery murders out of a sample of 5,596.
- Stats SA housebreaking: 5.9% of households. Home robbery is 209,000 households, about 1.1%, confirmed by search; the cited page does not give it.
- ONS: total burglary 245,284. The 166,577 residential burglaries are in the ONS tables, not in the cited bulletin.
- Wikipedia, 2026 Iranian strikes on Israel: dates, cities and the toll of 26 killed match.
- Al Jazeera, France, October 2026: more than 2,300 arrests and the curfews match.

**Fire sources.**

- WHO Mortality Database, ICD-10 parts 5 and 6: I streamed both files again and tallied X00–X09, Y26, X47 and Y17 for 18 countries. Every count quoted matches:
  - US: 3,195 fire deaths and 1,004 CO deaths a year.
  - Chile 330, South Africa 2,519, Latvia 94, Estonia 40.
  - Turkey X47 316.
  - Argentina 216, 277, 111 and 95.
  - Brazil 1,054, Mexico 320, Japan 970, Poland 136, Czechia 52.
  - The Lithuanian coding break in 2021 is real.
- Age-standardised ratios recomputed in three bands:

  | Country | Recomputed | File |
  |---|---|---|
  | Chile, fire | ≈2.0 | 1.95 |
  | South Africa, fire | ≈5.4 | 5.0 |
  | Japan, fire | 0.57 | 0.55 |
  | Turkey, fire | 0.34 | 0.35 |
  | Turkey, CO | 1.60 | 1.65 |

  The US CO denominator comes out at 3.01 per million, against the file's 3.04.
- CTIF Report 31, Table 1.9: every rate used matches.
- GBD 2021 regional rates for fire, heat and hot substances (PMC12091820) and for CO (PMC10602911) match. So does China's CO rate of 0.8 per 100,000 (Frontiers 2025).
- NCRB: 5,888 deaths, confirmed. The "60% residential" share is for fire incidents, not deaths.

## Flags for the owner

### Violence

1. **The presets disagree on weighting.** The preset researcher's halves were 0.2 deaths and 1.0 loss for Western Europe, and 1.0 and 2.0 for Buenos Aires (plans-skills-security.json). `config.mjs` turns these into 0.4, which takes 75% weight on deaths, and 1.5, which takes 50%. This file weights deaths and losses equally. That reproduces Buenos Aires and gives Western Europe 0.5. Choose one weighting for presets and countries alike, or split the field into a mortality scale and a loss scale (the researcher's open question). South Africa has D 6.8 and B 3.8; France has D 0.19 and B 1.25.
2. **The reporting factor is not applied as stated.** The stated rule is 0.75 for southern Europe, but Spain and Italy get 0.6, while Greece and Portugal get 0.75. At 0.75, Italy would be 0.70 (now 0.57) and Spain 0.52 (now 0.43).
3. **South Africa's upper bound (8.3) may be too low.**
   - About 3,280 of SAPS's 5,596 sampled murders have no listed cause. Robbery is 6.8% of all of them, but 16.5% of those with a cause.
   - If the US share of about 9% (NVDRS) is of homicides with known circumstances, s is about 1.8, not 0.85, and the scale is about 9.
   - House robbery at home is also probably a larger share of robbery killings in South Africa than in the US.
4. **Netherlands and Sweden unrest forecasts.** The method says the forecast leans towards the last 10–15 years. Yet both forecasts (0.6%) sit below the researcher's own long-run rates:
   - Sweden: 0.75% since 1990 and 2% since 2013.
   - Netherlands: about 0.8% since 1990, and about 4–5% a year in 2021–26 on the stated count. Its pessimistic figure (2%) is labelled "the 2021–26 rate", which that count does not give.
5. **France: the curfews were narrower than the basis suggests.** In Paris the curfew covered only Place de la République and Les Halles, and some curfews elsewhere applied only to minors. The wave still qualifies on looting. But the US Los Angeles curfew of June 2025 was left out for being downtown-only, so the two should be treated the same way.
6. **War and overlap.** Israel's 35% is war, not rioting, and the preset's riot-shaped windows fit it badly. The Baltic, Polish, Finnish, Korean, Japanese and Chinese figures include attack by a foreign state, which may also be counted in greatPowerWar and the nuclear hazards. The researcher flagged both.
7. **The loss half is a guess outside Europe and South Africa.** For Australia, New Zealand, Canada, Chile, Costa Rica and Mexico it is the larger half. These figures are tagged `guess`, which is correct.

### Fire

1. **The smoke-alarm step is consistent with the definition but not with the presets.** It divides each figure by (1 − 0.55 × alarm share), so that every figure describes a home with no working alarm, as the definition requires. The presets never had this step. As a result Argentina is 0.52, while any unlisted middle-income country borrows the Buenos Aires preset of 1.0; Western Europe is 0.36 against the preset's 0.5. Either rebase the presets (Buenos Aires about 0.5, Western Europe about 0.36) or drop the step: each country's notes give its figure before the step.
2. **The CO factor of 1.42 is a common guess.** It covers gas mix, the share of deaths at home and CO-alarm ownership, and it sets the level of every non-US CO figure.
   - Canada gets 1.4 for reasons that describe it as US-like, which would point to about 1.0.
   - The UK gets 1.8.
3. **Pooling over 2017–23 hides trends.** On 2021–23 alone:

   | Country | Trend | 2021–23 figure | Pooled figure |
   |---|---|---|---|
   | Turkey CO | X47 fell from 475 to 226 | about 1.9 | 2.35 |
   | Argentina CO | X47 fell from 149 to 76 | about 1.5 | 1.8 |
   | Mexico CO | X47 rose from 228 to 416 | about 1.55 | 1.41 |

   All three alternatives fall inside the stated ranges.
4. **Japan.** Japan alone leaves out Y26, which is about 350 deaths a year; every other country counts half of it. Counting half would give about 0.62 instead of 0.53. The stated reason, that X00–X09 already matches the fire agency's residential deaths excluding suicide, is plausible.
5. **Tags are uneven.** China's fire figure is tagged `derived` and Indonesia's `guess`, though both use the same method: a GBD regional rate times guessed shares.
6. **Property losses.** houseFire.scale also multiplies the dollars of property loss, but it is calibrated on deaths only. The researcher flagged this.
7. **Scales above 1.** Latvia (3.1), Estonia (2.7), Lithuania (2.0) and South Africa (2.0) exceed 1. Both data sources support the Baltic figures. Confirm the engine accepts scales above 1.
