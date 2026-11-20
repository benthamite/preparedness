# drugs: reasoning

Need owned: `medication`. Nine entries: longlist rows 55 and 57–62, plus naloxone, which the medical researcher passed to this file. No study measures the outcome of holding any of these items, so most harm figures are guesses built from clinical data.

## Who is exposed

Read: any prescription drug in the past 30 days is 21.5% under 18, 35.7% at 18–44, 67.1% at 45–64, 88.5% at 65+ (NHANES 2015–2018). That includes short courses, so I take regular use as 12%, 38%, 80% and 90% for child, 15–59, 60–74 and 75+.

Share on a drug dangerous to interrupt within days, my estimate from user counts (7.6M on anticoagulants and 2.1M with type 1 diabetes, read; 7–8.4M on insulin and 1.2% of adults on oral steroids, snippets; epilepsy and opioid-substitution, recalled), allowing for overlap: 5% at 15–59, 18% at 60–74, 28% at 75+.

The curves are conditional on taking regular medication.

## Baseline coverage

A spread, not a point: the household is hit at a random moment in its refill cycle.

- 89.7% of households hold 3 days (BRFSS, read); 82% of users aged 50–80 hold 7 days (snippet).
- Refills are collected with 3–6 days in hand on 30-day fills and 7–9 on 90-day fills (read).
- 90-day fills are about 22% of retail prescriptions: 0.22×90 ÷ (0.22×90 + 0.78×30) = 46% of days; mail order lifts it to about half.
- Model: 10% near zero; the rest uniform on 4–34 days (half) or 8–98 (half). P(<14) = 0.10 + 0.90 × (0.5×10/30 + 0.5×6/90) = 28%; P(<30) = 60%; median 24 for one drug. Several unsynchronised drugs bring the first run-out earlier: 18% under 7, 33% under 14, 62% under 30, median 20, 5th–95th percentile 1–85.

The median alone would give zero harm in any window under three weeks. With the spread, a 7-day window leaves about 0.8 expected unmet days per medicated person.

## Mortality

Baseline user (non-critical drugs, age 15–59): all-cause risk is of the order of 10 micromorts a day; drugs preventing a tenth of it are worth about 1 a day after washout. Hence 0.3, 0.6, 1.0 for days 1–3, 4–14, 15+, uncertain by a factor of about five.

criticalDrug, excess deaths per day without the drug:

- Methadone: (36.1 − 11.3) per 1,000 person-years ÷ 365 = 68. Buprenorphine: (9.5 − 4.3) ÷ 365 = 14 (Sordo 2017).
- Anticoagulants: ROCKET AF, 5–6 strokes per 100 patient-years after a 3-day interruption against about 2 on treatment = about 100 per million a day, a fifth fatal: 20 at mean age 73; 5–40 at under 60, allowing for the 23–26 after permanent discontinuation.
- Antiepileptics: hazard ratio 3.32 in non-adherent quarters on an assumed 1% a year = 64; 30–60 after confounding.
- Type 1 diabetes: ketoacidosis in one to three days; 0.1–0.5% fatal per episode with a hospital (0.4% in-hospital, read) = 200–1,000 a day over five days; fatal without one.
- Others: 10–50, guessed.

Weights 8% type 1 (×500), 15% epilepsy (×45), 12% opioid-substitution (×30), 15% cardiac (×30), 8% steroids (×30), 25% other insulin (×10), 10% anticoagulant (×15), 7% other (×10) sum to about 63 against 0.6. Without type 1 it is about 23. I use a multiplier of 80, range 20–300.

Age multipliers (5, 15) follow all-cause ratios of about 5 and over 20, cut for causes drugs do not prevent.

Check against Maria: 3.3M residents, 20% of medicated people with 15 unmet days. Critical users: 300k person-days × 45 ≈ 14 deaths at 15–59, 243k × 45 × 5 ≈ 55 at 60–74, 210k × 45 × 15 ≈ 140 at 75+; others under 10. About 200. The study attributes a third of 2,975–4,645 excess deaths to interrupted care, and medication was 14.4 of roughly 47 points of reported access problems: 300–450. Low by up to half. Texas 2021 gives a handful, as observed.

Other evidence read: Katrina, 20.6% of chronically ill survivors cut back or stopped treatment and 32–48% of evacuees were short of medication; Japan 2006, interruption carried 4.5 times the odds of worse health; Sandy dialysis patients, 30-day mortality 1.83% against 1.47–1.60%; Katrina dialysis, 44% missed a session, no significant excess deaths; COVID-19, fills up a fifth in March 2020.

## Hardship

No willingness-to-pay data. Utility loss of 0.03, 0.06, 0.09 × about $450 per quality-adjusted day, plus $5–10 of worry: $15, $30, $45. The critical multiplier of 8 reflects opioid withdrawal, seizures, hospital stays and non-fatal strokes.

## Items

- **Prescription buffer**, 7–90 person-days. $0.50 a day (0.15–12) from prices read on singlecare.com: lisinopril $0.04–0.08, atorvastatin $0.20, Lantus about $2.60, Eliquis $11.20. Everyday share 0.9; the real cost is an hour or two of arranging it.
- **Medication list**: 5% (1–15%) of medication harm in displacement-type hazards. It does nothing where no pharmacy exists; it makes relief usable sooner. 43% of users could not list their regimen (read).
- **Core over-the-counter kit**: $0.70 per person per pharmacy-shut day = 10% × 15% × $25 (pain, fever) + 0.25% × $45 (gastroenteritis) + 4% × 40% × $15 (allergy). A household of three gains about $10 in a five-day window.
  - Aspirin, scaled to medical.json's trauma bases. No care: 3.4 heart attacks per million adult-days × 4 points (ISIS-2: 9.4% against 11.8%) = 0.14 of 1.2 micromorts a day, 11%. Ambulances running: a tenth of the trial effect, 240,000 attacks × 0.24 points ≈ 580 deaths ≈ 3 micromorts a year, 1% of 280. Adherence 0.25.
  - Oral rehydration: a proposed capability, removing 25% (5–60%) of the water need's mortality only.
- **Wider kit**: $0.40 per person per day, same method, weaker inputs.
- **Antibiotic pack**: 30% (5–60%) of no-care trauma deaths at 50% correct use, set to give 0.36 of the 1.2 base. My own sum is 0.8: untreated bacterial infection and appendicitis at about 50 per 100,000 a year (1.4 a day), 60% averted. That exceeds half the base, so the base probably omits slow infections. Either way a 30-day window is worth 5–12 micromorts for $290.
- **Spare inhaler or epinephrine**: 0.5 micromort and $1 per window-day = 8% chance of no working reliever × 2% daily attack rate × 0.03% fatal. Not to be valued at the criticalDrug rate.
- **Drug cooler**: insulin keeps its potency for 2 months at 37 °C (Cochrane), so mortality benefit is near nil; about $60 of stock not discarded per hot multi-day outage.
- **Spare glasses**: $11 per displacement event = 4% × 7 days × $40. Everyday breakage is worth far more.
- **Naloxone**: 7,400 micromorts a year with opioid use disorder (44,564 deaths ÷ 6M, the second recalled) × 30% at home with someone there (24.5% + 0.755 × 0.729 × 0.29) × 40% averted = 890. Prescribed 50 mg or more a day: about 150. No opioids at home: near zero.

## Assumptions about others' numbers

- The `medication` window is net of relief and usually coincides with reachable emergency care.
- Trauma bases as in medical.json on 19 Nov 2026: 280 micromorts a year everyday, 1.2 a day with no care.

## Sources not opened

- BMJ (403), Springer, PubMed: read through Europe PMC instead.
- Harvard copy of the NEJM Maria paper (timeout): survey figures via Healthcare Dive.
- ihpi.umich.edu (403): the 82% figure is a snippet.
- jasemedical.com, costplusdrugs.com, walmart.com, goodrx.com, costco.com, dripdrop.com, axios.com: refused. web.archive.org is unreachable from the fetch tool.
- Kaufman 2002 full text; any post-2020 figure for the 90-day share.
