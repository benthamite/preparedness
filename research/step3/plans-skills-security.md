# plans-skills-security: reasoning

One channel (`violence`) and 23 entries. Most effects are guesses and are tagged so. Data support the violence baseline, the firearm side risk, door reinforcement and the pandemic plan.

## Violence channel

Harm at home from outsiders; violence between household members is excluded.

- **Deaths, 2 micromorts a person-year (0.8–4).** NVDRS 2021: 21.9% of homicides were precipitated by another crime; of those burglary 11.6%, robbery 29.6%. So burglary is 2.5% of homicides and robbery 6.5%; I guess a quarter of robberies are at home, giving 4.1%. Times 51 micromorts (5.1 per 100,000 in 2024, snippet) = 2.1. Check: BJS's 430 burglary-related homicides a year in 2003–2007 is about 1.5.
- **Money, $40 a household-year (15–110).** 8.2 burglaries per 1,000 households (BJS 2024) × ($2,000 loss + $2,000 repairs, time and distress, both guesses anchored on the FBI's $2,661 mean) = $33. Plus 0.0082 × 7% with violence × $15,000 (guess) = $9.
- **In hazards.** "Less crime than feared" holds for short events with people at home: Austin 2021 gives an elasticity of crime to outages of −0.004 to 0.002. It fails in three cases:
  - Empty homes. Houston recorded 251, 428, 200 and 135 burglaries on the four days of the Rita evacuation against 67 afterwards (mean 3.8×). New Orleans rose almost 200% the month after Katrina. Factor 3 (1.5–5), property only.
  - Police absent. Espírito Santo 2017: violent deaths from 4 to 18 a day for 21 days (4.5×). Factor for civil unrest 2.5 (1–6), below 4.5 because riot deaths occur mostly away from home.
  - Weeks without power or supply. No data; 3 (1–10), bracketed by the two cases above.
  - Lockdowns lower residential burglary (Detroit −20.5%, Grand Rapids −37.5%): 0.8.

## Security items

- **Firearm.** The side risk dominates. Arithmetic, per year:
  - Owner: California cohort firearm-suicide rates of 14–19 per 100,000 at 4–12 years and 46 at 1–3 years, against 3.1 for non-owners, less 2 for fewer suicides by other means. Over 20 years excluding year one: (2 × 41 + 17 × 11)/19 ≈ 14 per 100,000, shaded to 120 micromorts for confounding.
  - Other adult: suicide HR 1.43 × 5.2 per 100,000 baseline = +22; homicide HR 2.33 on an assumed 2 per 100,000, half causal = +13.
  - Accident: 463 deaths / 140 million people in gun households = 3.
  - Mean per member: (120 + 35)/2 + 3 = 80 a year = 0.22 a day (0.06–0.6).
  - Protective effect: injury 4.1% after gun defence against 4.2% after any protective action; no lower risk of being killed by strangers. I give 0.03 everyday and 0.15 (guess) when police are absent. Everyday benefit: 2 × 0.03 × 0.4 = 0.02 micromorts.
  - Break-even needs 80/(0.15 × 0.5) ≈ 1,100 micromorts a year of outside violence. Net harmful at every plausible setting.
- **Door reinforcement, 0.12 (0.03–0.3).** The Dutch code requiring burglar-resistant doors and windows cut burglary 26%. A door-only retrofit: 55.7% forced entry × half through a door × 45% defeated net of switching (last two are guesses) = 0.12. Adherence 0.85, because about 40% of unlawful entries to empty homes use an unlocked door or window. Value: 0.12 × 0.85 × $40 ≈ $4 plus 0.2 micromorts a person, against roughly $9 a year. Near break-even.
- **Pepper spray.** 90% incapacitation in police hands (156 of 174); no civilian data. Fraction 0.1 × adherence 0.3 on a 2-micromort baseline is worth cents.
- **Helmet.** Northridge deaths came from building collapse; fraction 0.02 on trauma.
- **Discretion.** No data; 0.1 on violence in tail hazards only.
- **Digital security.** `other` effect: 9% of adults are victims a year and losses are $16.4 billion ($125 a household), mostly refunded card misuse. I guess it removes 20% of $10–25 out-of-pocket.

## Tools

Little can be quantified. Both entries carry an `other` effect and reduce effects of 0.01–0.02. The hatchet-shovel-saw set also has a side risk of 0.5 micromorts per day of clearing work: Irma's 15 repair deaths / 21 million = 0.7 per resident; × 40% tree work ÷ 0.16 person-days per resident = 1.8; a quarter of that for hand tools.

## Plans and skills (costed in hours)

- **Neighbour network** (4 h, then 4 h a year). Reduces water and food 0.1, cooling 0.1, warmth 0.08, trauma 0.05, information 0.1, all at adherence 0.6, all guesses. Anchors: Chicago 1995 (living alone OR 2.3), British Columbia 2021 (56% lived alone), Kobe (over 70% rescued by residents). Violence 0.08: a third to a half of the 16–26% found for neighbourhood watch. The need curves already assume spontaneous sharing, so these are increments.
- **Yearly review** (3 h a year). Multiplies every other item's failure probability by 0.6 (0.35–0.9); pure guess, in a `reliabilityEffect` field. Also 0.15 on `co` for rehearsed generator and stove use.
- **Household plan** (2 h, then 0.5 h a year). Fire 0.05, information 0.05, displacement 0.02. No outcome study; the Sandy study found no benefit, so ranges include zero.
- **Learn local hazards** (2 h). Trauma 0.05: a sixth of the 32% injury reduction from tornado warnings.
- **Reference books.** Trauma 0.01 in long events.
- **Pandemic isolation plan** (4 h). Telework removes (1.8 − 1)/1.8 = 44% of a worker's infection risk (MMWR aOR 1.8). Most remote-capable workers went home in 2020 anyway, so the plan earns a quarter: 0.1 (0.02–0.3). Reliability 0.4 because every earner's job must allow it.

## Location, structure, grid independence

- **Check exposure before choosing a home** (3 h per move). 0.3 × adherence 0.5 on financial loss and displacement in tick-box hazards, from a field experiment in which buyers shown flood scores bid on homes scored 3.9 instead of 8.5. It really changes tick-boxes; see open questions.
- **Structural** (five entries by hazard). Fractions are guesses anchored on benefit-cost ratios I could read only in snippets: water-heater strapping 24:1, bookcases 13:1, hurricane retrofit 6:1, wildfire 2:1 to 6:1. FORTIFIED homes had 55–74% fewer claims in Hurricane Sally; I take a third for shutters alone.
- **Solar with battery.** $20,800 (8 kW × $2.60) + $13,473 = $34,300. Everyday share (0.9 × 20,800 + 0.15 × 13,473)/34,300 = 0.60. Supplies 15 kWh a day in outage conditions (8 kW × 2.5 sun-hours).
- **Rain barrel.** 190 litres untreated; reliability 0.55 for being full.
- **Extra petrol.** 17,500 Wh a can through a generator. Fire side risk 0.0015 micromorts a person-day: 110 deaths / 70 million households (guess) / 2.5 / 365.

## Assumptions about others' numbers

- Hazard researchers put building damage on `financialLoss` and an injury exposure on `trauma`.
- 35,000 Wh per 10 gallons, from the power researcher.
- The fire, CO, infection and information owners may override my small reduce effects on their channels.
- The violence baseline has no everyday hazard id; `hazards: ["all"]` is meant to include it.

Excluded: body armour, fitness, food growing, burglar alarms (reasons in the JSON).

## Sources I could not open

- PubMed pages (cookie wall): Studdert 2022, Semenza 1996, Peek-Asa 1998. Three other abstracts were read through Europe PMC.
- Miller 2022 (JAMA Psychiatry), Zahran 2009, NBER w33119, the PEER-CEA report: snippets only.
- FBI 2019 burglary page (403).
- NIBS Mitigation Saves fact sheets (404).
- Alabama insurance department release (connection refused).
- Frailing and Harper 2010 (abstract only).
- Retailers and makers: sabrered.com, academy.com (pepper spray), tractorsupply.com, armorconcepts.com, lowes.com, leatherman.com, fiskars.com, harborfreight.com, store.hesperian.org, api.org.

Verified prices: shotgun (Academy), Powerwall and solar (EnergySage). All others are unverified.
