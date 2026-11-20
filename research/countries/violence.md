# violence: country figures

Fields: `violentCrime.scale`, `civilUnrest.forecast`, `civilUnrest.pessimistic`, for 46 countries. Labels: **[V]** read on a page I fetched; **[S]** search snippet; **[R]** recalled.

## violentCrime.scale

**Formula.** scale = 0.5 × D + 0.5 × B.

- **Weights.** In the US the two halves of the harm are about equal. Deaths: 1.2 micromorts × $14.6 × 2.5 people = $44 a household. Losses: $40.
- **D, the deaths ratio.** The UNODC homicide rate for the country's latest year [V, the Wikipedia table built on UNODC data, updated February 2026], divided by the US rate for the same year. US rates: 2024 5.0 (FBI [V]), 2023 5.76 (UNODC [V]), 2020–22 6.5, 6.8, 6.3 (FBI [R]). The result is multiplied by **s**: the country's share of homicides committed during robbery or burglary, relative to the US share of about 9% (NVDRS: robbery 6.5%, burglary 2.5%).
  - England and Wales: 6% of homicides were "in furtherance of theft or gain" [V, ONS], giving s = 0.7. I use 0.7 (0.35–1.4) for every rich country with low homicide.
  - South Africa: robbery was the factor in 382 of 5,596 murders, 6.8% [V, SAPS Q1 2024/25], plus other crimes: s = 0.85 (0.6–1.2).
  - Brazil: 807 robbery killings (*latrocínio*) [S] among 40,775 violent deaths [V] = 2%, giving s = 0.22. I use 0.25 (0.15–0.6) for Brazil, Mexico and Colombia, where gangs and cartels do most of the killing.
  - Every other s is a guess, stated in the JSON.
- **B, the loss ratio.** How often homes are burgled relative to the US, times L, the loss per burglary in dollars relative to the US.
  - **Europe.** Eurostat's police-recorded burglaries of private homes per 100,000, averaged over 2022–24 [V], divided by the US police figure of about 140. That figure is 779,542 burglaries in 2024 [S], of which about 60% are residential [R]. It agrees with NCVS's 8.2 burglaries per 1,000 households at a 45% reporting rate.
  - Insured European households report more of their burglaries, so I multiply by 0.6. In central, eastern and southern Europe, where reporting is lower, I multiply by 0.75. L = 1.
  - **United Kingdom.** About 167,000 home burglaries out of 245,284 police-recorded burglaries [V, ONS].
  - **South Africa.** 5.9% of households had a housebreaking and 1.1% a home robbery [V, Stats SA], against 0.71% of US households burgled. I take 8.5 times the US rate for cities.
  - **Other countries.** Burglary rates outside Europe and South Africa are guesses, partly from survey figures I recall.
  - **L.** About 0.45–0.65 in upper-middle-income countries and 0.2–0.3 in lower-middle-income ones: goods, repairs and time cost fewer dollars there.
- **Ranges** combine the 5th and 95th percentiles of s and B.

**Anchor reproduction.**

- **United States:** 1, by definition.
- **Western Europe:** the population-weighted figure for the 16 western countries on this preset is 0.5 (0.25–1.0), against the preset's 0.4.
  - My two halves match the preset researcher's closely: D is 0.12 against the preset's 0.2 for mortality, and B is 0.85 against its 1.0 for dollars.
  - The difference is the weighting. Getting 0.4 from those halves takes about 75% weight on deaths. I could not trace where that weight came from.
  - If the owner keeps 0.4, my European figures should be multiplied by 0.8.
- **Buenos Aires:** Argentina gives D = 3.94 / 5.0 × 1.2 = 0.95 and B = 4 × 0.5 = 2.0, so 1.5, the same as the preset.
  - The preset researcher's halves were 1.0 and 2.0.
  - B is a guess, as the preset's was.

## civilUnrest

**Method.** As for the anchors:

- List the episodes since 1990 that meet the threshold: a riot curfew or state of siege, serious rioting or looting, disorder sustained over days, or armed conflict on home territory. Armed conflict includes missile fire on cities and cartel or insurgent violence that shuts a city down.
- Count the share of the urban population living in the cities each episode touched. As in the US anchor, a whole city counts.
- Sum the shares and divide by the number of years.
- The forecast leans towards the last 10–15 years and to what is happening now: Verisk Maplecroft rankings, elections and wars.
- The pessimistic figure is two to three times the forecast, as in the anchors, or the recent peak rate where that is higher.

Sources for the episodes:

- Wikipedia's List of riots [V].
- Event pages: Chile 2019, Colombia 2021, South Africa 2021, Indonesia 2025, Nigeria 2020 and 2024, Israel 2026 [V].
- News on France in October 2026 [V].

The population shares are my own estimates.

**Anchor reproduction.**

- **United States:** 1% and 3%. The anchor's count is unchanged by the downtown-only Los Angeles curfew of June 2025.
- **Western Europe:** the anchor's weights (France 4%, England 1%, elsewhere 0.3%) give 1.0%. My country figures give 1.3%, because I raise France to 5% after the October 2026 riots. Those riots brought 2,300 arrests in one day and curfews in Paris, Lyon, Nice and Lille [V], and the rate since 2018 is near 8%. My pessimistic figures give 3.1%, against the preset's 3%.
- **Buenos Aires:** counting Argentina's waves gives 1.7 of the urban population over 43 years, or 4.0%, the same as the preset. The episodes are 1989 (50%), 2001 (70%), 2013 (30%), 2023 (15%) and Rosario 2024 (3.5%). I keep the preset's 8% pessimistic figure.

**What drives the large figures.**

- **Israel, 35%.** Missiles or rockets fell on most cities in 2014, 2021, 2023, 2024, 2025 and 2026. In 2026, Iranian missiles struck Tel Aviv, Jerusalem and Haifa over 40 days and again in June and July, and the war is still listed as ongoing [V].
- **Nigeria, 6%.** The rate since 2010 is 5%, raised for the election in February 2027.
- **Mexico, 5%.** Cities shut down by cartel wars: about 10% of the urban population a year in 2008–12, and 3–5% a year since.
- **France, 5%.** See above.
- **Colombia, 4%.** Curfews in 2019, riots in 2020, and the 2021 strike with food and fuel shortages.
- **South Africa, 4%.** July 2021 touched about 45% of the population and killed 354 people [V].
- **Indonesia, 3.5%.** May 1998 and August 2025, among others.
- **Chile, 3%.** In 2019 a curfew covered 16 regions [V].
- **India, 3%.** Frequent partial-city curfews after communal riots, plus Pakistani fire on border cities.
- **Turkey and Brazil, 2.5% each.**

## Middle figures

Scale tags are `derived` where both the homicide and the burglary inputs were fetched; otherwise `guess`. Unrest tags: forecast as shown; all pessimistic figures are `guess`.

| Country | Scale | Tag | Unrest forecast | Tag | Unrest pessimistic |
|---|---|---|---|---|---|
| Australia | 0.7 | guess | 0.004 | guess | 0.012 |
| Austria | 0.22 | derived | 0.002 | guess | 0.006 |
| Belgium | 0.75 | derived | 0.005 | guess | 0.015 |
| Canada | 0.66 | guess | 0.004 | guess | 0.012 |
| Chile | 1.5 | guess | 0.03 | derived | 0.07 |
| Colombia | 1.1 | guess | 0.04 | guess | 0.09 |
| Costa Rica | 1.6 | guess | 0.005 | guess | 0.015 |
| Czechia | 0.17 | derived | 0.001 | guess | 0.004 |
| Denmark | 0.88 | derived | 0.004 | guess | 0.012 |
| Estonia | 0.2 | derived | 0.007 | guess | 0.03 |
| Finland | 0.21 | derived | 0.002 | guess | 0.008 |
| France | 0.72 | derived | 0.05 | derived | 0.1 |
| Germany | 0.25 | derived | 0.003 | guess | 0.01 |
| Greece | 0.22 | derived | 0.012 | guess | 0.035 |
| Hungary | 0.22 | guess | 0.003 | guess | 0.01 |
| Iceland | 0.28 | derived | 0.001 | guess | 0.004 |
| Ireland | 0.4 | guess | 0.006 | guess | 0.02 |
| Israel | 0.55 | guess | 0.35 | derived | 0.55 |
| Italy | 0.57 | derived | 0.003 | guess | 0.01 |
| Japan | 0.056 | guess | 0.001 | guess | 0.005 |
| South Korea | 0.11 | guess | 0.004 | guess | 0.015 |
| Latvia | 0.23 | derived | 0.007 | guess | 0.03 |
| Lithuania | 0.23 | derived | 0.007 | guess | 0.03 |
| Luxembourg | 0.47 | derived | 0.001 | guess | 0.004 |
| Mexico | 1.6 | guess | 0.05 | guess | 0.1 |
| Netherlands | 0.32 | derived | 0.006 | guess | 0.02 |
| New Zealand | 0.83 | guess | 0.002 | guess | 0.007 |
| Norway | 0.3 | guess | 0.0015 | guess | 0.005 |
| Poland | 0.16 | derived | 0.004 | guess | 0.015 |
| Portugal | 0.26 | derived | 0.004 | guess | 0.012 |
| Slovakia | 0.12 | derived | 0.0015 | guess | 0.005 |
| Slovenia | 0.27 | derived | 0.003 | guess | 0.01 |
| Spain | 0.43 | derived | 0.005 | guess | 0.015 |
| Sweden | 0.77 | derived | 0.006 | guess | 0.02 |
| Switzerland | 0.63 | derived | 0.002 | guess | 0.006 |
| Turkey | 0.27 | guess | 0.025 | guess | 0.06 |
| United Kingdom | 0.63 | derived | 0.013 | guess | 0.04 |
| United States | 1 | derived | 0.01 | guess | 0.03 |
| Argentina | 1.5 | guess | 0.04 | derived | 0.08 |
| Brazil | 1.1 | guess | 0.025 | guess | 0.06 |
| China | 0.28 | guess | 0.004 | guess | 0.015 |
| India | 0.22 | guess | 0.03 | guess | 0.06 |
| Indonesia | 0.26 | guess | 0.035 | derived | 0.08 |
| Nigeria | 1.1 | guess | 0.06 | derived | 0.14 |
| Philippines | 0.34 | guess | 0.015 | guess | 0.04 |
| South Africa | 5.3 | derived | 0.04 | derived | 0.09 |

## Least sure

1. **Israel (civilUnrest).** The figure measures war, not rioting, and depends on whether the 2026 Iran war ceasefire holds. The preset's riot-shaped windows fit badly.
2. **Nigeria (both).** Homicide is a UNODC model estimate, there is no burglary survey, and the election falls inside the year.
3. **Mexico (civilUnrest).** It is a judgement call which cartel wars amount to "disorder sustained over days" for a whole city.
4. **China (both).** Recorded homicide and reported unrest are both probably too low.
5. **India (civilUnrest).** Curfews usually cover parts of a city. I counted them at half the city, and the answer moves with that choice.

Other weak points:

- The Latin American burglary halves (Chile, Costa Rica, Mexico) rest on survey rates I recall.
- The Baltic and Slovak burglary figures may reflect narrow police definitions.

## Sources not opened

- The Citizen article on SAPS murder causes (403).
- Monitor Mercantil on Brazil's 2025 *latrocínio* count (403). The 807 figure is from a search snippet.
- The full ENVIPE 2026 results for Mexico. The press release I read has no burglary rate.
- The burglary pages of Chile's ENUSC 2025 summary.
- The text of Argentina's SNIC 2023 report, which could not be extracted.
- Wikipedia on the Sinaloa Cartel war (404).
- The CSEW household burglary rate, which is absent from the ONS bulletin.
