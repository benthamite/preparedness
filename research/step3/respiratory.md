# respiratory: masks, respirators, air cleaning

Channels `infection` and `smoke`; seven items. Labels: [V] read on a fetched page, [S] search snippet only, [R] recalled.

## 1. Respirators: protection while worn

Lab protection = 1 − mean(1/protection factor). From a geometric mean G and 5th percentile P: σ = ln(G/P)/1.645, mean leakage = exp(σ²/2)/G.

| Device | Lab | Infection studies | Risk removed while worn |
|---|---|---|---|
| Cloth | fit factor ≈2 [V] | aOR 0.44 (0.17–1.17) [V] | 0.15 (0–0.4) |
| Surgical | G 3, P 1 → leakage 42% [V] | OR 0.82 (0.54–1.23) DANMASK; 0.91 (0.82–1.00) Bangladesh; Cochrane 0.95 (0.84–1.09) [V] | 0.3 (0.05–0.55) |
| N95/FFP2, no fit test | G 21, P 3 → leakage 9.5%; untrained medians 5.6–64; ≈2 before instructions, ≥10 after [V] | against surgical: HR 1.14 (0.77–1.69) Loeb; Cochrane 0.70–1.10; aOR 0.17 (0.05–0.64) [V] | 0.7 (0.4–0.9) |
| N95, fit-tested | P 20.5 → leakage <3% [V] | same trials | 0.88 (0.6–0.97) |
| Elastomeric + P100, fit-checked | G 36, P 7 → 4.6% untested; P 11–13 tested; APF 10 [V] | none | 0.93 (0.7–0.99) |
| PAPR, loose hood | APF 25 [V] | none | 0.97 (0.9–0.999) |

Lab sources: Lawrence 2006, O'Kelly 2021, Kelly 2020, OSHA. The N95 mid sits between the lab (0.85–0.9) and the trials, which are diluted by unmasked exposure and partial adherence.

**fractionRemoved** is relative to what an unprepared household improvises (cloth, then surgical: 0.2, range 0.05–0.4, guess):
- N95: 1 − 0.3/0.8 = 0.6 (0.2–0.87)
- Elastomeric: 1 − 0.07/0.8 = 0.9 (0.6–0.985)
- PAPR: 1 − 0.03/0.8 = 0.96

**adherence** = share of outside exposure spent in a correctly worn device, over months. All guesses.

| | pandemicModerate | pandemicSevere |
|---|---|---|
| N95 | 0.5 (0.25–0.75) | 0.75 (0.5–0.9) |
| Elastomeric | 0.3 (0.1–0.6) | 0.75 (0.45–0.9) |
| PAPR | 0.08 | 0.55 |

Anchors: Bangladesh reached 42% wearing with active promotion [V]; "always" maskers in California had aOR 0.44 (0.24–0.82) [V].

**N95 ladder.** One mask lasts about 3 days of outings (1–7; fit holds for about five donnings [S]). The stock matters until respirators can be bought again: about 200 days (90–420); N95s were still scarce for consumers in January 2021 [S]. Masks needed = 200 × share of days with an outing ÷ 3: about 14 for a home worker (0.2), 48 for a commuter (0.7). Steps 5/10/20/40/80.

## 2. Home versus outside

Share of infections caught from another household member: 22.5% in Geneva (23% in two-person, 41% in five-person households), 18% in Virus Watch, 19–34% in Singapore [all V]. I use 0.25 (0.15–0.45).

This caps a mask worn by one member, and anything done inside the home. It does not cap masks worn by every member: household infections need an introduction.

Effects act on the hazard rate: P(infected) = 1 − (1 − A)^(1 − r). At attack rate A = 0.6, r = 0.5 cuts risk by 38%, not 50%.

## 3. Staying home

Risk avoided = H × T(D).

**H, exposure removed while home.**
- Nobody leaves: 0.97 house, 0.93 flat (guess). Yerba Buena and Gunnison had zero cases while sequestered in 1918 [V].
- One adult still works on site: the worker keeps w = 0.5 of outside exposure and is the only way in, so infections fall to w/n. H = 0.75 for two people, 0.83 for three, 0.88 for four; I use 0.78 (0.55–0.9). The worker's own risk only halves.

**T(D), share of the pre-vaccine hazard inside D days.**
- Multi-wave: my arithmetic on CDC weekly COVID deaths, March 2020–April 2021 [V]. Best-timed 30/90/180 days: US 0.17/0.46/0.61, Texas 0.18/0.46/0.65, New York City 0.51/0.71/0.73. First D days of the local epidemic: 0.02–0.32, 0.06–0.71, 0.33–0.73.
- Single sharp wave (1918 autumn): guess [R].

| Share of infection risk avoided | 30 d | 90 d | 180 d |
|---|---|---|---|
| **Multi-wave, T** | 0.15 (0.03–0.45) | 0.40 (0.1–0.7) | 0.60 (0.33–0.75) |
| nobody leaves | 0.14 | 0.38 | 0.57 |
| one works on site | 0.12 | 0.31 | 0.47 |
| **Single wave, T** | 0.50 (0.25–0.8) | 0.85 (0.6–0.97) | 0.95 (0.85–0.99) |
| nobody leaves | 0.48 | 0.81 | 0.90 |
| one works on site | 0.39 | 0.66 | 0.74 |

Avoidance pays in full only if fatality is lower afterwards.

Partial version: in the English lockdown, shopping more than weekly carried aOR 1.69 (1.29–2.21) and 35% of infections caught outside the home [V]. 35% of US workers teleworked in May 2020 [S]; I guess half of working households have someone who must go out.

## 4. Air cleaning at home

Bound: household share 0.25 × cut in within-household spread.

- **Purifier.** 0.45 of household spread through room air beyond arm's length (guess) × 0.7 aerosol cut in that room (7–10 air changes added to 1–2) × 0.5 of shared time there = 0.16, shaded to 0.12 (0–0.4) for the trials: OR 0.57 (0.32–1.04) in 135 aged-care residents [V]; no difference across 91 care homes [V]; viral RNA in air 44% → 25%, p = 0.23 [S]. fractionRemoved 0.25 × 0.12 = 0.03 (0–0.12).
- **Far-UVC.** 0.45 × 0.9 × 0.4 (one room) = 0.15; fractionRemoved 0.04 (0–0.15). No trial; conventional germicidal UV in care homes gave a rate ratio of 0.91, not significant [S].

## 5. Smoke

Unit: one person-day at about 100 µg/m³ outdoor PM2.5, household behaving normally. Adult under 65, three routes:

1. Acute: RR 1.019 per 10 µg/m³ of 3-day mean [S] → 19% of one day's ~5 non-accidental micromorts = 1.0.
2. Long-term, ages 0–64 (Ma 2024 [V]): +0.55 deaths per 100,000 a month at annual smoke ≥5 µg/m³ (taken as 7) → 0.026 per µg-day → 2.6; +0.07 at 1–5 (taken as 2) → 1.2.
3. Generic PM2.5 coefficient, 0.7% per µg/m³ [R] → 3.8.

Mid 1.5 (0.3–5). All ages: 5 on route 1 (19% × 25), about 10 on route 2. Coefficients at 65+ are 8–13 times larger [V]: ×5 at 60–74, ×15 at 75+.

Hardship $40 (8–130): willingness to pay $87–95 per symptom-day [S], about $135 today, × one third with symptoms (guess).

Home share of dose 0.7: 80% of time × infiltration 0.4 (0.2 on fire days in homes with sensors [V]) against 8% of time outdoors.
- Purifier: 0.71 × 0.6 (48–78% [S]) × 0.75 of home time in that room = 0.33 (0.15–0.55); adherence 0.85.
- N95: outdoor share 0.18 × 0.8 (protection factor 16, Kodros 2021 [V]) plus some indoor wear = 0.2 (0.08–0.45); adherence 0.5.

## 6. Age multipliers for infection

COVID-like, from US deaths per 100,000 through 2023 [V counts, R populations]: 2.2 at 0–14, 92 at 15–59, about 650 at 60–74, about 2,660 at 75+ → 0.02, 8, 35. Fatality per infection alone gives 15 and 90 (Levin 2020 [V]); the old were infected less [S].

pandemicSevere: equal mix with a 1918-like pattern [R] → 0.35, 4, 17. Guesses.

## 7. Prices and everyday share

Read on retailer pages: N95 $38.99 per 20 (Quill); 3M 6200 $23.99 and 2091 filters $16.69 (Quill); fit-test kit $192.99 (Zoro; home-made about $45, guess); PAPR $2,315 (Uline); goggles $11, gloves $17 per 100, gowns $57 per 50 (Uline); Honeywell HPA5100B purifier $203.99 (Quill). Far-UVC $500 from a blog post only.

Purifier everydayShare 0.8 (guess): 1.5 µg/m³ lower everyday exposure × 0.7% per µg [R] × 2,700 micromorts a year ≈ 28 micromorts per adult, worth more than the unit's roughly $95 annual cost.

## Assumptions about others' numbers

- The pandemic baseline already includes cloth or surgical masking and fewer outings.
- Adult 15–59 non-accidental mortality is about 5 micromorts a day.
- The wildfire hazard supplies person-days of heavy smoke.

## Could not open

PubMed (cookie wall; used Europe PMC); Nature and medRxiv pages (used PMC); eLife FFP3 study; Chen 2021; Qiu 2025; Richardson 2013 (three mirrors, 403); Xiang 2021; Markel 2007 table; MMWR seroprevalence by age; purifier makers' shops (429); aerolamp.net.
