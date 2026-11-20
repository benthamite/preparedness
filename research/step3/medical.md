# medical: first aid, training, vaccination, the trauma channel

Labels: **[V]** read on a fetched page (PubMed abstracts via the Europe PMC API, because PubMed blocks the fetcher); **[S]** search snippet; **[M]** memory. US data.

## Bottom line

- Home emergencies that a bystander can change are, in numbers, cardiac arrest.
- A trained household member removes about 0.7% of those deaths (0.15–2%); a first-aid kit or tourniquet about 0.01–0.02%.
- Vaccination dwarfs every other entry for anyone over 60 not already vaccinated.
- Disasters add little: a day without emergency care costs a healthy adult about 1 micromort.

## 1. Everyday baseline (channel `trauma`, hazard `homeMedicalEmergency`)

CARES 2024 [V]: 263,711 EMS-treated non-traumatic arrests nationally (78.7 per 100,000); 71.3% at home; home survival 8.9%; 37.5% bystander-witnessed; adult causes 83.8% cardiac, 9.1% respiratory (includes choking), 5.3% overdose, 0.7% bleeding, 0.5% drowning. The registry already holds the choking, overdose, drowning and anaphylaxis deaths, so I do not add them.

Age split (CARES 2023 figure 2 [V, extraction slightly garbled], weighted 63% male): 19–34 6.6%, 35–49 13.3%, 50–64 26.5%, 65–79 33.6%, 80+ 17.6%, ≤18 2.7%. Populations [M]: under 15 60M, 15–59 196M, 60–74 56M, 75+ 26M. Assumed: 58% of 50–64 cases fall at 50–59, 68% of 65–79 cases at 65–74.

| Age | Arrests/yr | per 100,000 | at home | fatal | micromorts/yr |
|---|---|---|---|---|---|
| 15–59 | 94,000 | 48 | 73% | 90% | 315 (270 without overdose) |
| 60–74 | 89,600 | 160 | 74% | 91% | 1,075 |
| 75+ | 74,800 | 288 | 67% | 94% | 1,800 |
| under 15 | 5,600 | 9.4 | 88% | 92% | 76 (infants ~700, ages 1–14 ~35) |

Baseline, healthy adult 15–59: **280 micromorts a year (150–380)**. Multipliers: 60–74 ×3.8, 75+ ×6.5, child ×0.27. Check: 315 is about 12% of deaths at 15–59 [M]; EMS-treated arrests are 7.6% of all US deaths.

Limb bleeding adds almost nothing: 235 (Bonk 2019 [V]) to 480 (Goolsby 2018 [V]) US deaths a year that a prompt tourniquet might have saved, 0.7–1.4 micromorts per person, mostly gunshot and stab wounds away from home.

## 2. What each thing removes

**Trained household member.** Per home arrest:

- witnessed: 0.35 (37.5% overall; home value unreadable);
- an untrained person would not have given effective CPR: 0.70 (CPR follows 50.1% of witnessed arrests [V]; lower at home, discounted for late dispatcher-coached starts; guess);
- survival gain from CPR: 5 points (2–9). Hasselqvist-Ax 2015 [V]: 10.5% vs 4.0%, adjusted OR 2.15. OR 2 on ~12% home witnessed survival gives 8.6% → 15.8%; shaded for confounding;
- 0.35 × 0.70 × 0.05 / 0.89 fatal = 1.4%, plus 0.2% for choking (guess; HR 0.55 for bystander intervention [S]) = **fractionRemoved 1.6%**;
- adherence 0.5 = 0.85 (the trained member is the one present) × 0.6 (acts in ~75% of cases against ~35% untrained; Swor 2006 [V]: trained OR 6.6, yet most trained bystanders did not act). Reliability 0.85 for skill fade.
- Net 0.016 × 0.5 × 0.85 = **0.7%**: 1.9 micromorts a year per other member aged 15–59, 7 at 60–74, 12 at 75+. The trained person gets nothing.

Check: Groeneveld and Owens 2005 [V] found $202,400 per QALY for unselected trainees, under $75,000 if the trainee lives with someone over 75 or the course costs under $10. Mine has the same shape: about $250 per course (fee plus 5.5 h at $25) buys 4 micromorts for a partner under 60, 24 for one over 75.

Hence the added **hands-only CPR self-training** (free video, half an hour a year): same ceiling, adherence 0.3 (guess; Bobrow 2011 [V]: 0.7% of video-trained adults failed to attempt CPR in a simulation against 23.5% untrained). It will outrank the course. The two overlap; do not sum.

**Home AED.** 0.35 witnessed × 0.25 shockable (guess; 18% of all arrests [V]) × 15 points over waiting for the crew (guess) / 0.89 = 1.5%; adherence 0.47 = 55% used when witnessed (HAT, 32 of 58 [V]) × 0.85; reliability 0.9. Net 0.6%, 1.8 micromorts per other adult under 60. At $1,664 [V] plus $96 a year, about $80M per death averted for two adults under 60, $20M for two aged 60–74. HAT: 6.4% vs 6.5% mortality in 7,001 patients, 4 survivors from 117 home arrests. Cram 2005 [V]: $216,000 per QALY at 60.

**Tourniquet.** 0.26 micromorts at home with someone present (a quarter of the national rate; guess) × 0.5 beyond improvised pressure (guess) / 280 = 0.05%; adherence 0.3 (PATTS [V]: 16% correct untrained, 88% just trained, 54.5% at 3–9 months). About 0.04 micromorts a year per person: poor value.

**First-aid kit.** Treats nothing in 99% of the baseline: 0.02% (0–0.1%), guess. Its case is everyday use (share 0.85) and hardship.

**Monitors.** Randomised trial of home pulse oximeters (Lee 2022 [V], n=1,217): −0.1 days alive out of hospital (−0.4 to 0.2). Median effect 0.5% of pandemic infection deaths (0–3%).

## 3. In hazards: the emergencyCare window

Per healthy adult 15–59 per day:

- **Care unreachable: 1.2 micromorts (0.4–3.0).** Puerto Rico after Maria: mortality +62% (CI 11–114%), a third tied to delayed or interrupted care (step 2 report), so about +20%. On 7.4 micromorts a day all-cause [M] that is 1.5. Bottom-up, incidence × extra case fatality (my guesses): cardiac arrest 0.15, heart attack 0.25, stroke 0.07, sepsis 0.5, major injury 0.25, other 0.3 = 1.5.
- **Care slow or overwhelmed: 0.2 (0.03–0.6).** RCEM's 300–500 UK deaths a week from emergency-department delays [V, Full Fact] is 0.6–1.1 micromorts a day at all ages, +3%. Support: one extra death per 82 patients delayed 6–8 h (Jones 2022 [V]); 30-day mortality 28.2% vs 24.9% for heart attacks on marathon days, ambulances 4.4 minutes slower (Jena 2017 [V]).
- Multipliers follow all-cause mortality: 60–74 ×6, 75+ ×18 (ratio 24, shaded), child ×0.3.
- Checks: the slow rate is 0.6 a day population-weighted; Texas 2021 recorded 25 illness-exacerbation deaths, 0.9 micromorts per resident over four days, on a count known to be low. The unreachable rate is 3.6 at all ages against 5.6 for New York's 2003 blackout (all causes).

Training removes about 4% (1–10%, guess): first aid bears on injury, a sixth of the total, and on recognising when to drive to hospital. Husum 2003 [V]: lay responders within a paramedic system cut trauma deaths from 40% to 14.9% with hospital 5.7 h away. Kit 1%, tourniquet 0.4–1.5%. A three-day slow window costs a healthy adult 0.6 micromorts, so none of these items earns much from disasters.

## 4. Vaccination: annual micromorts averted

Flu: typical season 30,000 deaths (2023–24: 28,000 [S]; 2024–25: 45,000 [V]), CDC age shares (65+ 70%, 50–64 20%); 65+ split 25/75 between 65–74 and 75+ (assumption). Unvaccinated risk = average / (1 − coverage × VE); averted = VE × that; VE 35–44% (CDC hospitalisation figures, assumed to hold for death).

| | Flu | COVID | Pneumococcal, RSV [M] | Total |
|---|---|---|---|---|
| Healthy 15–59 | 5 (a third of average-risk 16) | 1.5 | <1 | **8 (2–26)** |
| 60–74 | 70 | 40 | 20 | **130 (45–270)** |
| 75+ | 270 | 250 | 160 | **680 (230–1,300)** |

COVID: 34,981 deaths in 2024–25, 88.4% at 65+ [V]; VE 45% against hospitalisation for four months [V], 30% assumed over the year, ×0.8 for the trend. Check: CDC's 12,000 flu deaths prevented in 2024–25, 81% at 65+ [V], is 250 micromorts per vaccinated older adult. Tetanus under 0.1 [M].

## Assumptions about others' numbers

Time $25/h and $12.50 per micromort, for illustration. Naloxone and aspirin left to the drugs researcher.

## Sources I could not open

PubMed (cookie wall; used Europe PMC); NSC Injury Facts (403: choking by age and place); AHA 2026 statistics (403: age-specific arrest rates); CARES figures 5, 7, 13 (images: home witnessed and bystander-CPR shares); redcross.org, galls.com, rei.com (403); firstaidonly.com, zacurate.com (429); omronhealthcare.com (404); CDC flu-burden age table (image); Kishore 2018 and Wilde 2013 full texts. Prices for the kit, monitors, extras, course and vaccines are unverified.
