# power-light: reasoning

Four needs, 13 items (12 assigned, one added). The only number here with real mortality behind it is medicalPower for people on life support. Everything else is hardship of a few dollars a day, and most households already cover the first day or two.

## Needs

**light.** Baseline 1.5 days (0.2–6). 94.8% of households report a working flashlight and batteries (CDC BRFSS, read); 91% of adults have a phone torch (Pew, snippet). The day count is my guess from 5–20 h of part-used cells.
- Hardship $4/person-day, $5 from day 4. Guess: 15–25% of stated whole-outage WTP ($53.68/household per 24 h, LBNL; $33/person-day, FEMA) ≈ $10/household-evening ÷ 2.5.
- Mortality 0.018 micromorts/person-day. Fall deaths at 15–59 ≈ 3,700 in 2023 (WISQARS, read) ÷ 197M = 1.9/100,000/yr = 0.052/day. Falls and fractures in over-65s rose 40% in the week after Sandy (read, news summary) although most homes had flashlights. I assume no light at all adds 35% (8–100%) over battery light: 0.052 × 0.35. Tagged guess because of the 35%.
- Age multipliers are ratios of fall death rates (NCHS, read): 60–74 is 15.3/100,000 → ×8; 75+ is 141.5 → ×75, i.e. 1.4 micromorts per dark day. For the old the fall term outweighs hardship.
- Texas falls (9) were on ice. Irma's 13 standing-height falls show a lamp removes only part of outage fall risk.

**devicePower.** 15 Wh rated per person-day (10 Wh into a ~15 Wh phone, rationed), 40 Wh per household-day.
- Baseline 1.5 days without a car (phone 1–2 days, laptop holds 3–4 charges). With a car it is effectively unlimited; the engine must handle this (open question).
- Hardship $8, then $12 from day 3. Guess: about a third of whole-outage WTP ($54/household-day) once phones are dead.
- Mortality 0.03. EMS benefit for a healthy adult ≈ 0.2 micromorts/day (cardiac arrest 0.1%/yr × 10% survival, scaled to under-60s, tripled for other emergencies; recalled figures) × 15% lost when no phone works.

**refrigeration.** One-off loss on two days.
- Baseline 0.4 day. The official rule is 4 h (CDC, read). But 4.9M households reported spoiled food in 2023 (AHS, read), matching the 3.5% × 131M ≈ 4.6M with an outage over 24 h (NREL, step 2), not the 23.6M with one over 6 h. So loss starts at roughly 10 h.
- Day 1 (fridge) $45/household, day 2 (freezer) $110, both ÷ 2.5 → $18 and $44 per person; then $2/person-day. Anchors: Con Edison pays up to $280 on a list, $655 with proof (read); surveys say $117–200 (snippets); only 31–37% discard (RTI, read), which pulls the expected fridge loss below the value of the contents.
- Mortality 0.01 on the loss days: baseline foodborne risk for a healthy adult ≈ 0.005/day, assumed tripled. Guess. Marx 2006 tied post-blackout diarrhoea to meat and seafood (snippet).
- Insulin: works for 28 days at 59–86°F, opened or not (FDA, read). Nothing happens in an ordinary outage; above 86°F potency falls gradually and FDA says keep using it. 2.9% of households with refrigerated medicine reported spoilage in 2023 (AHS).

**medicalPower.** The schema wants a healthy-adult curve, but a healthy adult has no device. I set the base curve for an *important* device (CPAP class) and the `powerDependent` multiplier (×100 mortality, ×15 hardship) for *life-supporting* devices. The base must not be applied to people without a device.
- Life-supporting: 200 micromorts/day (30–1,500), 300 from day 3. Three checks:
  1. NOTT: 12-month mortality 20.6% on nocturnal-only oxygen against 11.9% on continuous (read, WikiJournalClub) = 8.7 points/yr ÷ 365 = 238/day. A chronic effect, used as an order of magnitude.
  2. Texas: 25 exacerbation deaths (8 respiratory, 6 renal; DSHS, read). Say 8–15 from device power, among ~200,000 users (my guess from 2.6M nationally) × 69% × 1.75 days (UH survey) = 241,500 person-days → 33–62/day officially, ×3 on excess-death counts, with many relocating.
  3. Irma: 3 oxygen deaths (read) ≈ 10/day after relocation and resupply.
- Over 99% of this group are on oxygen concentrators (Molinari, read). Ventilator users risk death within hours; the mean does not describe them.
- CPAP base: 2 micromorts/day, hardship $20. Guess, bounded above by observational data (19/day in untreated severe apnoea, recalled); trials show no mortality benefit.
- Baseline 0.3 day: concentrator batteries 2–4 h, up to 12 (Molinari); E cylinder 5.7 h at 2 L/min (recalled). CPAP has none.
- Energy: CPAP 89 Wh/night without humidifier, 221–351 with (ResMed battery guide, read: 0.93, 2.30, 3.66 A × 12 V × 8 h). Life support blended 1,500 Wh/day: 35% low-draw at 600 Wh, 65% stationary at 7,200 Wh (300 W, snippets) → 0.35 × 1.4 + 0.65 × 0.12 = 0.57 day per usable 850 Wh. The split is a guess.

## Items

| id | price | note |
|---|---|---|
| flashlight | $15 (read) | 95% already own one |
| headlamp | $23 each (read) | matters most at 75+ |
| lantern | $30 (unverified) | area light |
| candles | $7 per 100 tealights (read) | fire risk owned elsewhere |
| spare-batteries | $12 per 24 AA (read) | 60 Wh, 10-year shelf life, ~$0.20/Wh |
| power-bank | $0.85/Wh (read: $1.07, $1.00; $0.76 unverified) | 37 Wh ≈ one household-day |
| solar-panel | $65 (unverified) | 40 W × 4 h × 0.55 = 90 Wh/day; value is in long outages |
| power-station | $0.65/Wh (read: $0.93 at 256 Wh; list $0.78 at 1 kWh) | 1 kWh = 16 h of fridge or 9 CPAP nights |
| generator-fuel | $650 (generator read at $399–650; +$130 est.) | 10 gal ≈ 35 kWh usable; house only |
| car-charging-kit | $40 (unverified) | most cars charge phones already |
| medical-backup-battery | $650/kWh (unverified) | 0.57 day/kWh blended |
| medical-power-plan | ~$10, 3 h | added: backup cylinders, registration, leave-early plan |
| fridge-kit | $7.50 (read) | 5 kg ice = 464 Wh ÷ 30 W ≈ 15 h → 0.5 day |

Generator energy: seller states 11.5 h at 25% of 1,850 W on 1.05 gal = 5.3 kWh, about 5 kWh/gal; I cut 50 kWh to 35 for lighter, less efficient loads. Lives, upkeep, everyday shares and reliabilities are all guesses; I found no failure-rate data.

Rough check: a life-support user with 0.2–0.3 unmet days a year loses about 50 micromorts and $75 of hardship a year, so the plan and a battery or generator should rank high for those households.

## Assumptions about numbers owned by others

- Household of 2.5; outage durations as in base-rates.md.
- CO and fire side risks of generator, idling car and candles: named, not parameterised.
- Radio news belongs to the information need; heating and cooling from `mainsPower` to warmth and cooling.

## Sources I could not open

- PubMed 15640685 (Prezant) and 15231473 (Greenwald): 2003 blackout device-failure visits; snippets only.
- Kishore 2018 full text (dash.harvard.edu, 429).
- PMC9851928, Texas outages and Medicare device users (captcha; Europe PMC 500). Would replace my 200,000 guess.
- PMC10505355, MRC oxygen trial table (captcha).
- Louisiana list of Ida deaths (403).
- foodsafety.gov and fsis.usda.gov (403); CDC carries the same figures.
- ResMed AC power sheet and concentrator wattage pages (403).
- McBrien 2026, PLOS Medicine (snippet only).
- Cochrane insulin review (abstract snippet only).
- Retail pages: goalzero, jackery, ecoflow, blackdiamond, wen (429); harborfreight, rei (403); farmandfleet (captcha); flexsolar (empty); ankersolix (no prices). Hence four unverified prices.
