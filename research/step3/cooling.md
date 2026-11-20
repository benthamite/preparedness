# Cooling: reasoning

One need (`cooling`) and five entries: `room-air-conditioner`, `battery-fan-kit`, `heat-plan`, `heat-check-in`, `window-shading`. Eleven candidates are in `excluded`.

## 1. Mortality curve

Unmet day: a person-day at home at about 31 °C or more indoors with no working cooling. The 31 °C line is from the trial evidence in Kenny 2024 (no undue strain at 26 °C; avoid 31 °C and above).

All-ages deaths per million person-days without cooling:

| Event | Arithmetic | Result |
|---|---|---|
| BC 2021 | 619 x 93% without AC = 576; 5.21M x 66% of homes without AC = 3.44M; daily shares 8, 13, 53, 131, 231, 57, 33 of 526 | 2.5, 4.1, 17, 42, 73, 18, 10 |
| France 2003 | excess 286, 1,202, 2,197 on 4, 8, 12 August; 59.6M people (recalled), almost no AC | 4.8, 20, 37 on days 1, 5, 9 |
| Chicago 1995 | 739 excess, 14-20 July; about 2.7M (recalled), AC homes included | about 270 per resident; peak day 162 deaths = 60 |
| Europe 2022 | 61,672 over 543M, whole summer | 114 per person-summer; Italy 295 |
| Beryl 2024, Houston | at least 36 deaths, at least 16 of them heat; about 8M customer-days without power, about 20M person-days | about 1 (official attributions only) |
| Ida 2021, New Orleans | 10 heat deaths; guessed 1.4-2.1M person-days | 5-7 (weak) |
| New York blackout 2003 | 90 excess / (8M x 2 days) | 5.6, all causes |
| Stone 2023 model | Detroit 31 per 100,000 over 5 days; Phoenix 917 | 62 a day; 1,800 a day |

So an ordinary summer outage costs 1-6 a day, and a record heat wave 3-5 on day 1 rising to 40-70 by days 5-9. BC and France both show risk climbing with consecutive days. Mid all-ages curve, set between the two regimes: 1.5, 3, 6, 10, 14 from days 1, 2, 3, 5, 8.

Healthy adult share. Adults 15-59 relative to the all-ages rate: Europe 2022 16/114 = 14% (ages 0-64); BC 47 of 526 deaths (8.9%) in about 59% of the population = 15%; France (132 + 414 + 368 = 914 of 14,802, 6.2%) in about 61% = 10%. Most heat deaths under 60 involve psychiatric illness, substance use or chronic disease (Bouchama: psychiatric OR 3.6, cardiovascular 2.5), so I guess a healthy adult at one third of the average adult: 3-5% of all ages. Using 5%: 0.08, 0.15, 0.3, 0.5, 0.7 micromorts a day. Low and high are about one fifth (Beryl-type days) and seven times (BC peak days: 73 x 5% = 3.7). The Phoenix blackout model lies above my high and is noted, not used.

Check against Texas 2021 (8-24 micromorts per resident over 2-4 days, so 3-8 a day all ages): my all-ages mid of 6 on day 3 is the same order.

## 2. Multipliers (relative to a healthy adult)

Rates relative to all adults 15-59, then x3:

- 60-74: Europe 160/16 = 10; BC (115 + 0.4 x 154 = 177 deaths, 34%, in about 18.5% of people) = 12; France (368 + 1,300)/7.9M = 211 against 914/36.1M = 25, so 8. Times 3 gives 25-36. I use 30.
- 75+: BC (92 + 142 + 68 = 302 deaths, 57%, in about 8.5% of people) = 45; Europe ages 80+ 1,684/16 = 105; France 12,210/4.5M = 2,713 against 25 = 108, with 24% of those deaths in care homes. Times 3 gives 135-320. I use 150 because only BC counts community deaths alone.
- Child 0.3: no BC deaths under 19; France ages 1-14 observed 104, expected 99.
- Limited mobility 4, critical drug 2.5: Bouchama odds ratios. Power dependent 2.5 is a guess.

Consistency: 0.18 x 0.3 + 0.58 x 3 + 0.165 x 30 + 0.075 x 150 = 18, so a healthy adult is 5.6% of the all-ages rate, matching the 5% used. BC and France age denominators are recalled; the Europe rates are read directly.

## 3. Hardship

A guess: $12, $20, $30 per person-day from days 1, 2, 3. I found no study of willingness to pay for a hot day at home. Anchors: the outage figures in prior-art.md ($54 per household-day, $33 per person-day) and a hotel at about $50 per person-night. Non-fatal illness adds under $1 a day for a healthy adult and about $9 at 75+ (recalled ratios of emergency visits and admissions per death), hence the 75+ hardship multiplier of 1.6.

## 4. Effects

- Air conditioner: odds ratio 0.23 (0.1-0.6) across six case-control studies; 0.3 and 0.2 in the two Chicago studies. 1 - 0.23 = 0.77, cut to 0.70 (0.4-0.9) for confounding and one-room cooling. Supporting: 93% of BC decedents had no AC against 66% of homes; in New York none of 25 home heat-stress deaths had AC in use. Adherence 0.85: 14% of New York adults with AC seldom run it because of cost. Applies to homes without AC, heatWave only, grid up.
- Fan kit: fan odds ratio 0.60 (0.4-1.1), not significant. Trials: -0.1 to -0.2 °C core temperature at 31-38 °C, nothing at 36 °C and 45% humidity, +0.3 °C at 45 °C dry. I take about a third of the raw 0.40: 0.15 (0-0.35), with skin wetting covering the conditions where a fan alone fails. Outage days only, since most homes own a mains fan.
- Heat plan: visiting cool places odds ratio 0.34, so 0.66, cut to 0.5. Adherence is the extra share of dangerous days the household actually goes because it planned: 0.15 (0.05-0.35), a pure guess. Net 0.075.
- Check-in: social contact odds ratio 0.40 implies 0.60; halved to 0.3 because over half of Chicago 1999 decedents had been in contact within a day, and the Rome programme shows only 25 against 29 deaths per 1,000. Times adherence 0.7.
- Shading: simulated danger-hours fall 18-23% with interior shades and 55% with exterior ones; times two thirds for curtains already present gives 0.12 (0.03-0.3). Deaths assumed proportional to dangerous hours.

## 5. Assumptions about numbers owned by others

- heatWave and hotShare count days with outdoor highs of about 35-40 °C (see the intensity question in the JSON).
- The value of a micromort does not vary with age.
- Water: about 1 extra litre per person per unmet cooling day.
- Power: a USB fan draws 3-5 W; a 5,000 BTU air conditioner about 450-500 W and 5-8 kWh a day (recalled, one snippet).
- Unprepared households own curtains, towels, tap water and usually a mains fan.

## 6. Weakest points

- Adherence for the plan and the check-in has no data.
- Every protective odds ratio is observational.
- Beryl and Ida denominators are rough, so the low end of the curve is soft.
- The "one third" healthy-adult adjustment is a guess; risks at 60+ do not depend on it, because the multipliers undo it.

## 7. Sources I could not open

- PubMed pages (cookie wall): read through the Europe PMC API.
- BC coroners panel report PDF: used the October 2021 knowledge update, the news release and Kenny 2024.
- Fouillet 2006 full text: used the INSERM report of 25 September 2003.
- O'Connor 2024 (JAMA), Semenza 1996 and Chaseling 2024 (NEJM) full texts.
- Statistics Canada age table; Maricopa final 2024 report; the CDC heat-prevention page.
- Walmart, Academy, O2COOL, Frigidaire and NPR pages; CenterPoint restoration counts after 12 July 2024.
- Not fetched, snippet only: Orlando 2021 (Rome, rate ratio 0.44), the Harris County 7-of-14 heat count, the IEA 19% figure for Europe, and fan battery runtimes.
