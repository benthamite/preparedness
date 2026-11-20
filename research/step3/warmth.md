# Warmth: reasoning behind warmth.json

Labels: **[V]** read on a fetched page or PDF; **[S]** search snippet only; **[G]** my guess.

## Bottom line

A day in an unheated home in freezing weather costs a healthy adult about 1 to 3.5 micromorts and $15 to $35 of hardship. Over 75, mortality is about 40 times higher. Warmth items are poor buys for young households and reasonable ones for old households. Only the heater with fuel removes most of the harm.

Main weakness: Texas does not publish where its hypothermia victims died. Every mortality figure scales with my guess of the at-home share.

## The unmet day

Normal heating is out, there is no purpose-built alternative heat source, and the home is below about 10 °C. Stored heat covers the first 0.5 day (0.2 to 1.5) [G]: with a time constant of 20 to 60 hours a house falls from 20 °C to 10 °C in 8 to 24 hours at −10 °C outside.

## Mortality: Texas, February 2021

Data [V]: 158 hypothermia deaths, 107 aged 60+ (DSHS). 69% of people in ERCOT counties (91.5% of the state) lost power for a mean 42 hours; 18% left; of those who stayed, 16% used a wood fire and 15% a gas fireplace (UH survey).

| Exposure step | Person-days |
|---|---|
| 29.5M [G] × 0.915 × 0.69 = 18.6M people; × 42/24 days | 32.6M |
| less leavers, gone for half their outage (−9%) [G] | 29.7M |
| less 12 hours of thermal lag: × 30/42 | 21.2M |
| less homes with a real fireplace or stove, 25% [G] | 15.9M |

Age shares [S, ACS 2017–21]: under 15, 21.4%; 15–59, 60.8%; 60–74, 13.0%; 75+, 4.8%.

Deaths at home:

- At-home share [G]: 0.45 under 60, 0.8 at 60+ (plausible overall range 0.45 to 0.85). In Japan 73.4% of accidental hypothermia starts indoors [V].
- Under 60: 51 × 0.45 = 23, less about 3 children [G] = 20 adults.
- The 107 at 60+ split into 52 at 60–74 and 55 at 75+ [G], using the DSHS all-cause age table (100 at 60–79, 47 at 80+) and a 75–79 rate 2.5 times the 60–74 rate. At home: 42 and 44.

| Group | Deaths ÷ unmet person-days | Micromorts per day |
|---|---|---|
| 15–59, average | 20 ÷ 9.66M | 2.1 |
| 15–59, healthy: × 0.7 [G] (21% of deaths involved alcohol or drugs) | | 1.45 |
| 60–74 | 42 ÷ 2.07M | 20 |
| 75+ | 44 ÷ 0.76M | 58 |
| Under 15 | 3 ÷ 3.40M | 0.9 |
| All ages | 109 ÷ 15.9M | 6.8 |

Curve: the mean stayer had 30 ÷ 24 = 1.25 unmet days, so the target is 1.45 × 1.25 = 1.8 micromorts. Steps of 1.2 (day 1) and 2.4 (day 2) give 1.2 + 0.25 × 2.4 = 1.8. The rise by day and the day-3 value of 3.5 are assumptions; only the average is anchored.

Check: 109 at-home deaths over 27.0M people is 4.0 micromorts per resident, inside the 8.3 for all certified causes.

## Cross-checks

- **Buffalo 2022**: 7 of the first 31 deaths were from lack of heat [V]. With about 20,000 customers out for most of the storm [S], 7 ÷ (20,000 × 2.3 × 3 days) ≈ 51 micromorts per person-day, seven times Texas. Colder, and nobody could leave. This sets my high bounds (5, 10, 20).
- **Quebec 1998** [V]: 4 hypothermia deaths among 21 by 18 January, with 1.4 million customers out. At 2.5 people and a mean of 6 days [G], that is 4 ÷ 21M, under 0.2 micromorts per person-day. But 89.3% of surveyed older people used combustion heaters, only 18.5% were ever below 5 °C indoors, and about 100,000 people went to shelters. Quebec measures what heat sources and relocation achieve. CO (6) and fire (5) killed more than cold.
- **Uncertified deaths** [V]: Texas excess deaths were about 702 against 246 certified. If half the gap was cold at home, the true toll is three times mine. This sits in the high bounds only.

## Multipliers

60–74: 20 ÷ 1.45 = 14 (6 to 30). 75+: 58 ÷ 1.45 = 40 (15 to 100). US death rates run 4.6 per 100,000 at 85+ against 0.2 at 15–34 [V]. Child 0.6, limited mobility 3 and all hardship multipliers are guesses.

## Hardship

Baik et al. [V]: for a 10-day below-freezing outage, households would pay a median $43 (mean $51) for sure, or $60 (mean $80) with uncertainty, per day for 20 A of backup running a furnace blower, fridge, freezer and lights. At 2.5 persons that is $17 to $32 per person-day. I give heat 60% [G]: $10 to $19. FEMA's figure for all electricity is $33. Behaviour suggests more: 26% of Texans who stayed heated with a gas oven. Steps: $15, $25 from day 2, $35 from day 4; high bounds $50 to $120. The escalation is a guess.

## Items

Fractions are relative to a household already wearing every layer and using all its bedding. Mortality is in `fractionRemoved`; hardship is in an extra field, `hardshipFractionRemoved`. All are guesses.

| Item | Mortality removed | Hardship removed | Adherence |
|---|---|---|---|
| Sleeping bag, 20 °F, per person ($60 [V]) | 0.30 (0.1–0.6) | 0.25 | 0.85 |
| Warm layers, per person ($45 [G]) | 0.10 (0.02–0.25) | 0.15 | 0.9 |
| Mylar blankets ($4 each) | 0.03 (0–0.1) | 0.02 | 0.5 |
| One-warm-room plan ($25 [S], 2 hours) | 0.12 (0.03–0.3) | 0.10 | 0.65 |
| Indoor tent ($80) | 0.10 (0.02–0.25) | 0.08 | 0.7 |
| Propane heater ($120 [V]) with fuel, per covered day | 0.85 (0.6–0.97) | 0.75 | reliability 0.85 |

Basis:

- Required insulation in clo = (33 °C − air temperature) ÷ (0.155 × dry heat loss in W/m²).
- Asleep (32 W/m²): 4.6 clo at 10 °C, 5.6 at 5 °C, 6.7 at 0 °C. Ordinary bedding measures 0.90 to 4.89 clo [V], so it stops sufficing near 9 °C. A 20 °F bag gives roughly 6 to 7 clo [G].
- Seated (45 W/m²): 3.3 clo at 10 °C, against 1.0 to 1.3 clo for indoor winter clothing [V].
- A bag closes the physical gap. I credit 0.3 because cold-climate households can pile up duvets, and because many deaths follow falls, illness or not noticing the cold.
- Mylar: outdoors on a torso model it cut the one-hour drop from 11.6 °C to 4.5 °C [V]. Indoors, with bedding and no wind, it adds little.
- Warm room: three people emit 300 W; a sealed room losing 50 to 100 W/K sits 3 to 6 °C above the house. Tent: 150 W inside 8 m² of fabric at 3 to 5 W/m²K gives 3 to 5 °C; a Korean test found about 3 °C [S].
- Heater: 4,000 BTU/h is 1.17 kW, lifting a room that loses 80 to 120 W/K by 10 to 15 °C. A 1-lb cylinder lasts 5.5 hours on low (5.4 [S] to 6 [V]). A covered day needs about 14 heater-hours (8 to 30) [G], about $14 of fuel.

Stacked at medians, the bag, layers, plan and tent remove 1 − (0.745 × 0.91 × 0.92 × 0.93) = 0.42. I would cap the package at 0.6.

Fuel ladder: 2, 6, 12, 24 cylinders. Two is the usual legal limit inside a dwelling [S]; larger steps need outdoor storage.

## Assumptions about numbers owned by others

- Heater CO and fire risk: none entered; the combustion researcher supplies it.
- Value of a micromort: about $12.50, for sanity checks only.
- The pre-arranged place to stay acts through the hazard's leave parameters.

## Sources I could not open

- KHOU, WFAA (403): place of death in Harris and Dallas counties.
- CMAJ 1998 (403); ICLR summary used instead.
- NYU Buffalo report (too large): outage count.
- RMI figures, Neilsberg age table, Minnesota propane sheet, Korea Consumer Agency article: snippets only.
- mrheater.com, Teton, 32 Degrees, SOL (429); Walmart, Coleman, Campmor, Ace, Bass Pro, REI, Harbor Freight (403 or bot check). Fuel, layers and plan prices are unverified.
- ISO 23537, ISO 11079 (paywalled). PubMed (cookie wall; read via Europe PMC).
