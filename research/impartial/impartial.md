# Impartial valuation: work lost, cost per life, life expectancy, hours

[R] = read on a fetched page; [S] = search snippet only; [F] = from another research file. Full URLs are in `impartial.json`.

## 1. Work lost per unmet-need day (`workLoss.*`)

**Method.** For each need, g is the gross share of an eight-hour working day that the unmet need prevents or uses up. It is measured for a knowledge worker who can work from home, net of what a person whose need is met loses in the same event. Then net = g × (1 − m), where m is the share of deferred work made up later. I take m = 0.3 (0.1–0.5), for two reasons:

- Calendar effects show that planned, economy-wide days off are largely recouped. One extra working day adds 0.05–0.15% to annual GDP, against 0.4% if output were proportional to days [S, ING and Bundesbank].
- Managers put the median cost of an unplanned absence at 1.28 times the wage (Nicholson 2006 [S]). For an individual's unplanned day I lean towards this.

Displacement and minorIllness are already net of make-up.

**Anchors.** No time-use study of a rich-country outage separates needs, so most figures are guesses. These anchors exist:

- Office output is 91.1% of its maximum at 30 °C, about 2% lower per degree above 25 °C (Seppänen 2006 [R]).
- Microsoft 365 users spend 57% of their time communicating and 43% creating [R].
- In a UK survey, 28% could not work at all without the internet and 7% could manage a full day [R].
- Texas, 2021: 66% lost power, 56% lacked reliable home internet, 53% had to obtain drinking water, and 30% lost income from being unable to get to work [R].
- LBNL ICE 2.0, hypothetical three-day outage: 21% of rural households would lose income, mean $1,158 among them [R]. That is 0.21 × 1,158 = $243, roughly a third of three days' income for a $70,000–100,000 household. It includes workplace closures, so it is a ceiling.
- Household Pulse, displaced households: 43% back within a week, 23% within a month, 20% longer, 14% not returned [R].
- A cold costs 8.7 work hours [R, abstract], and adults catch two to three a year [R].
- Two weeks without CPAP raised sleepiness but did not impair psychomotor performance [S].

| need | g | net mid (lo–hi) | arithmetic |
|---|---|---|---|
| water | 0.24 | 0.17 (0.05–0.4) | 1.5 h fetching or boiling (0.19) + 0.05 illness; × 0.7 |
| food | 0.22 | 0.15 (0.03–0.4) | 1 h searching (0.12) + 0.10 hunger; × 0.7 |
| hotMeals | 0.02 | 0.01 (0–0.04) | caffeine withdrawal |
| warmth | 0.45 | 0.3 (0.1–0.6) | home well below 15 °C; × 0.7 |
| cooling | 0.23 | 0.15 (0.05–0.35) | 0.09–0.17 at 30–34 °C, + 0.05 sleep, + 0.06 cooling off; × 0.7 |
| light | 0.03 | 0.02 (0–0.08) | screens light themselves |
| devicePower | 0.9 | 0.6 (0.3–0.85) | 0.9 × 0.7 = 0.63 |
| refrigeration | — | 0.02 (0–0.06) | 1 h per household ÷ 2.5 people |
| medicalPower | — | 0.1 (0.02–0.6) | CPAP: an hour or two finding power; oxygen: about a day |
| information | 0.75 | 0.5 (0.2–0.75) | 0.75 × 0.65 (messages defer easily) = 0.49 |
| dataAccess | 0.8 | 0.55 (0.25–0.85) | 0.8 × 0.7 = 0.56 |
| medication | 0.12 | 0.08 (0.01–0.3) | 0.12 × 0.7 |
| minorIllness | — | 0.005 (0.001–0.015) | below |
| sanitation | 0.1 | 0.07 (0.02–0.2) | about 1 h; × 0.7 |
| payments | 0.05 | 0.03 (0.005–0.12) | about 0.5 h finding cash or credit; × 0.7 |
| displacement | — | 0.3 (0.12–0.6) | below |
| emergencyCare | 0 | 0 (0–0.01) | harm is mortality only |

**Internet share.** About three quarters of a knowledge worker's work needs the internet (0.55–0.9). The 57% spent communicating needs it outright, and much of the 43% spent creating uses cloud files and search. The UK survey implies that about a quarter of a day can be done offline. dataAccess is wider: about 0.8 of the work needs one's own files, mail and logins.

**minorIllness.** Colds cost 2.5 × 8.7 = 22 h a year. Doubling for headaches, pain, stomach upsets and allergies gives about 45 h, which is 45 ÷ 1,800 = 2.5% of a working year. If over-the-counter drugs relieve a fifth of that (my guess, 5–50%), the loss is 0.025 × 0.2 = 0.005.

**displacement.** By day of displacement (my guess): 0.8 on days 1–3, 0.4 on days 4–14, 0.15 thereafter. Weighted over lognormal lengths:

- median 5–10 days, 90th percentile 45–60 (the hazards-ordinary windows): 0.28;
- median 3 days, 90th percentile 14: 0.49.

## 2. Work days lost through channels (`workDays.*`)

**pandemicModerate: 1.7 (0.6–5).**

- Per infection:
  - 0.65 symptomatic × 4 days = 2.6. Four days is 3.6 in Beck 2025 [R]; the Dutch median return to work was 10 calendar days [R].
  - 0.015 hospitalised × 35 days = 0.5.
  - Long COVID: 0.65 × 0.062 [F] × 85 days × 1/3 = 1.1. The third reflects about a quarter out of work and 45% on reduced hours (Brookings [R]).
  - Total 4.3; × 0.35 attack rate = 1.5.
- Caring: 1.5 others × 0.35 × 0.65 × 1 day × 0.6 = 0.2.
- Check: the illness lost-worktime rate of US full-time workers rose from 0.9% to 1.3% in 2020–21 [R]. 0.004 × 2 × 250 = 2.0.

**pandemicSevere: 5 (1.5–15).**

- Own illness: 0.3 × 0.9 × 12 days = 3.2.
- Lasting debility: 0.3 × 0.1 × 40 × 0.4 = 0.5.
- Caring: 1.5 × 0.3 × 0.9 × 5 × 0.6 = 1.2.
- Total 4.9.
- Checks:
  - CBO's severe scenario (survivors miss three weeks [R]): 0.3 × 15 = 4.5.
  - Goodrich, Akron, 1918–19 (influenza) [R]: 1.02 + 1.65 days per male and 1.42 + 5.05 per female employee, so 2.7–6.5.

**seasonalIllness: 0.2 (0.05–0.5) a year.**

- Influenza: 0.061 [R] × 0.4 × 2.8 days [R] × 1.5 for reduced output = 0.10.
- COVID-19: about 0.12 ill a year (43.6M and 33.0M illnesses over 335M [S]) × 0.235 averted [R] × 3.6 days = 0.10.
- Lo reflects Cochrane's −0.04 days for influenza vaccine [R].

**houseFire: 0.02 (0.005–0.06).**

- Chance of a reported fire in a home without an alarm:
  - 328,590 reported home fires ÷ 131M households = 0.25% [F].
  - Homes without alarms have about four times as many reported fires and are 16% of homes [F]: 0.25% ÷ (0.84 + 0.16 × 4) × 4 = 0.68%. I use 0.6%.
- Days per fire (guess):
  - Confined fires, half the total: 0.5 days.
  - Of the rest, 0.35 displace the household for about 21 days. On the profile that is 3 × 0.8 + 11 × 0.4 + 7 × 0.15 = 7.9, plus 2.3 for paperwork: 10.2.
  - The other 0.65: 1.5 days.
  - Average 2.5, raised to 3 for unalarmed homes, whose fires grow larger.
- 0.006 × 3 = 0.018, plus unreported fires (0.056 × 0.05 days) = 0.003.

**violentCrime: 0.004 (0.001–0.012).**

- Burglary: 9.7% of burglaries cost work time (NCVS 2008 [R]). Day bands at 0.5, 3, 8 and 18 days give a mean of 4.4, so 0.43 days per burglary. Over 1.9 adults, × 0.0082 burglaries a year = 0.002.
- Violence at home by outsiders: 5 per 1,000 a year (guess) × 0.072 × 4.9 days = 0.002.

**aiFraud: 0.3 (0.05–1) per adult per event.** Victims spend about 10 hours (Javelin 10.4 [R]; BJS 3.9–9.1 [R]). Half fall in working hours: 5 ÷ 8 = 0.63 days for the victim, 0.31 per adult in a two-adult household.

## 3. GiveWell

**Marginal cost: $8,000 ($5,000–10,000)** per life through the Top Charities Fund (GiveWell staff, May 2025 [R, archive copy]). The range is GiveWell's.

The fund's four programs have lower averages for 2022–2024 (Top Charities page, updated October 2026 [R]):

- Helen Keller Intl, vitamin A: $3,500.
- Malaria Consortium, seasonal malaria chemoprevention: $4,000.
- New Incentives, infant-vaccination incentives: $4,500.
- Against Malaria Foundation, bed nets: $5,500.

GiveWell's cost-per-life page says "an average cost between $3,000 and $5,500" [R].

## 4. Life expectancy

US period life table 2024, both sexes (NVSR 75-5 [R]); Eurostat EU27 2024 [R] for comparison.

| age | US e(x) | EU27 e(x) |
|---|---|---|
| 7 | 72.5 | 74.9 |
| 37 | 43.8 | 45.4 |
| 67 | 18.2 | 18.7 |
| 82 | 8.2 | 8.4 |

**Reference: 41.0 (34–45.5).**

- HHS tells analysts to assume the average person in the underlying VSL studies is 40 [R].
- e(40) ≈ 43.8 − 3 × 0.93 = 41.0. HHS gives 40.7 on the 2023 table [R].
- Hi: age 35, the young end of the hedonic-wage samples (Aldy and Viscusi [S]): 43.8 + 2 × 0.95 = 45.7.
- Lo: age 48, for older stated-preference samples (Krupnick 2001: mean age 54 [S]): 43.8 − 11 × 0.9 = 33.9.

## 5. Hours per year: 1,800 (1,600–2,000)

Usual weekly hours of full-time employees in 2025: OECD 40.0, US 41.0, EU professionals 39.2 [R]. Weeks at work (my assumption):

- US: about 47, so 41 × 47 = 1,927.
- Western Europe: about 43, so 39 × 43 = 1,680.

Check: OECD hours actually worked per worker, part-timers included, are 1,800 (US) and 1,736 (OECD average) [R].

## Sources I could not open

- givewell.org: read through archive.org copies instead.
- Allconnect's internet survey.
- The World Bank PDF of Hardy and McCasland on making up blackout hours.
- CBO's pandemic papers: read through Milliman's summary instead.
- The Household Pulse caregiver table.
- The PubMed and PMC pages: read through Europe PMC instead.
- Aldy and Viscusi's PDF.

I found no study of:

- telework lost in power or telecom outages;
- time spent getting water in a US water outage;
- displacement after ordinary house fires.
