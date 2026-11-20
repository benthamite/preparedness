# fire-co: reasoning

Longlist rows 82–85. Seven items, the `fire` and `co` channels, ten side risks, and an extra `everydayHazards` array holding the full baseline tables for `houseFire` and `coIncident`.

## Conventions the integrator must know

- **Channel baselines are for the empty-kit home: no working smoke alarm, no working CO alarm.** 84% of US households have a working smoke alarm, 49% a working CO alarm (CPSC survey, 2024), about 76% an extinguisher (CPSC, 2004–05). The model needs "already owned" switches; the with-alarm baselines are in `everydayHazards`.
- `fractionRemoved` is mortality only. Injury and property effects are in the extra fields `hardshipFractionRemoved` and `financialFractionRemoved` (the warmth file's convention).
- Everyday shares are 0 because everyday fire and CO are hazards in the model.
- New capability id: `utilityShutoff`.

## Fire baseline (US)

- NFPA 2019–2023: 328,590 reported home fires, 2,600 deaths, 10,770 injuries, $8.9bn a year. 2024: 329,500 fires, 2,920 deaths, $11.4bn. Deaths per million: 7.8 (2019–23), 8.6 (2023, 2024).
- Ages 15–59: population-weighting NFPA's age rates (2.1 to 12.5 per million) gives 5.2; raised to 5.4 for the recent years.
- No-alarm home: 5.4 ÷ (1 − 0.84 × 0.55) = **10 micromorts a year**; with a working alarm 4.5. Range 6–20: the low end uses a 30% alarm effect; the high end allows that homes without alarms are riskier in other ways. Their observed rate is about 30 (59% of deaths in 16% of households), which I treat as mostly confounding.
- Age multipliers against 15–59: children 0.77, 60–74 3.0, 75+ 4.1 (same NFPA table).
- Dwelling: houses are 67% of units and 85–88% of deaths. Per person: house 1.15, apartment 0.5.
- Dollars: $85 per household of property loss in 2026 dollars (gross of insurance) plus about $6 of injuries; ×1.27 for the no-alarm state = $110.
- Western Europe ×0.5 (England 2024/25: 208 dwelling-fire deaths, 3.6 per million). Buenos Aires ×1.0, a guess.

## CO baseline (US)

- CPSC 2020–2022: 238 consumer-product deaths a year (generators 98, portable heaters 31, furnaces 23, charcoal 14, ovens 10); 126 in ordinary homes. All accidental non-fire CO deaths: 430 (CDC, 1999–2010) to 624 (2022, provisional), about 1.6 per million.
- At home: 126 − 18 (weather-outage generator deaths, carried by side risks) + 100 (vehicles in home garages, a guess) ≈ 210, or 0.63 per million. ÷ 0.78 (homes with a CO source, a guess) ÷ (1 − 0.49 × 0.6) = **1.1 micromorts a year** for a fuel-burning home with no alarm.
- Western Europe ×0.8 (England and Wales 0.45 per million, France 1.5–2.0). Buenos Aires ×2 (ministry's 200 deaths a year is 4.3 per million; cases concentrate in the south).

## Efficacy

**First smoke alarm (none to one): 0.55 (0.3–0.7).** NFPA 2018–2022: 14.4 deaths per 1,000 reported fires without a working alarm, 5.8 with (60% lower). NIST: casualties fall by a factor of 2.5–3.5. Dallas installation programme: 63% lower after adjustment. All are observational, so I set the middle below them. Times adherence 0.95 and reliability 0.9 gives 0.47, matching NFPA's presence-based 50%. Two adults: 10 × 0.47 × 2 = 9.4 micromorts a year for $40.

**Adding or replacing (upgrade): 0.22 (0.08–0.45) of what remains, a guess.** 28% of deaths in homes with working alarms happened when the alarm failed to alert anyone; interconnected alarms alerted occupants in 26% of fires against 10% (CPSC survey). About 1 micromort per adult for $90. Replacing a dead alarm is not this case: that home is in the no-alarm state.

**CO alarm: 0.6 (0.3–0.85).** Yoon 1998: 65% of residential deaths preventable. CPSC: an alarm sounded in 5% of generator deaths with known status, against 49% of households with a working alarm. Mecklenburg 2002: 1 of 31 exposed people with a working alarm was severely poisoned, against 25 of 127 without. Law evaluations show smaller or no effects.

**Extinguisher: 0.03 of deaths, 0.16 of property (before adherence 0.65 and reliability 0.75), both guesses.** No outcome study exists. CPSC 2004–05: used in 5% of 7.4M home fires a year, successful in about half, so 0.44% of owning households a year. If 5% of uses avert a $30,000 fire, that is $7 a year, 8% of the average loss. Fire control accounts for 2% of deaths but 30% of injuries, so I assume no injury benefit.

**Fire blanket:** 0.005 of deaths, 0.02 of property. Dominated by the extinguisher and by a pan lid; I would leave it off the headline list.

**Gas shut-off:** 0.1 (0.02–0.25) of post-earthquake fire risk, a guess. Northridge: at least 50 gas-related structure fires against 14,000 customer-side leaks. The water shut-off half of the row may be worth more in freezes.

## Side risks (micromorts per household member per day of use, no alarm)

| Activity | Mid (range) | Denominator |
|---|---|---|
| Portable generator, typical placement | 1.5 (0.5–4) | National: 98 deaths × 24% in outages = 24; 21.46M generators × 0.27 × 0.8 × 1.3 days = 6.0M household-days; ÷ 2.5 people = 1.6. Texas 2021: 6 deaths ÷ (713,000 households × 2.8 × 1.75 days) = 1.7 |
| Generator kept 6 m from openings | 0.1 | Only 5–6% of deaths had the generator outdoors |
| Charcoal grill indoors | 3 (1–10) | Texas: 6 ÷ (475,000 × 2.8 × 1.75) = 2.6 |
| Outdoor-only propane heater indoors | 1.5 (0.3–5) | Texas: 2 ÷ (297,000 × 4.9) = 1.4 |
| Indoor-rated propane heater | 0.2 (0.03–1) | 25 deaths ÷ 45M household-days (guess) ÷ 2.5 |
| Kerosene heater | 0.3 (0.05–1.5) | Guess |
| Gas oven for heat | 0.1 (0.02–0.5) | Texas: 1 ÷ (1.54M × 4.9) = 0.13 |
| Camp stove, cooking only | 0.03 (0.003–0.3) | Guess |
| Vehicle idling in garage | 10 (2–50) | Guess: 4 ÷ (89,000 × 4.9) = 9 |
| Candles for light (fire) | 0.1 (0.03–0.4) | 70–81 deaths × 4% in temporary outages = 3–5; 29–46M person-evenings |
| Combustion heater (fire) | 0.1 (0.02–0.5) | 400 deaths ÷ 3.6bn household-days ÷ 2.5, doubled |

Texas denominators: 10.5M households × 69% without power × 82% who stayed = 5.9M; 2.8 people; mean 1.75 days; coping shares from the UH survey. **The split of the 19 CO deaths by source is my assumption** (generators 6, charcoal 6, vehicles 4, heaters 2, ovens 1); DSHS names the sources without counts.

Alarm fractions: 0.7 for generators, heaters and charcoal; 0.6 for ovens and stoves; 0.3 for a car in the garage (the alarm is in the house); 0.5 for a smoke alarm on candle and heater fires.

Outage baseline for an unprepared household that stays: CO 0.4 micromorts per person-day (Texas 0.65, Irma about 0.27), fire 0.2 (Texas 0.34). A kit's generator or heater should replace the matching part of this baseline, not add to it.

## Benchmark check

At an illustrative $10 per micromort (another researcher's parameter), two adults get about $94 a year from the first smoke alarm set for roughly $5 a year of hardware; $10 a year everyday from the CO alarm for $4–5; $1–3 of mortality and $7–9 of gross property loss from the extinguisher for $2–3.

## Assumptions about others' numbers

Earthquake fire exposure, winterStorm burst-pipe losses and the warmth need's coping shares belong to others. Persons per household: 2.5 (US), 2.8 (Texas).

## Could not open

- PMC4504304 (NYC CO alarm law), ScienceDirect S2950541024000206 (Uri CO sources), Texas Tribune CO articles, Injury Prevention (Istre 2014), PubMed (Marshall 1998), California Seismic Safety Commission gas report, ONS CO spreadsheet.
- Walmart, Home Depot, Ace and First Alert price pages; prices are from Target listings and one specialist seller, read 19 Nov 2026.
- NFPA Home Heating Fires was not fetched. No national count of Argentine home fire deaths was found.
- Figures from search snippets are marked `verified: false` or tagged `guess`.
