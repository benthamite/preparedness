# money-docs: reasoning

Labels: **[V]** read on a page I fetched; **[S]** search snippet only; **[R]** recalled. Everything [S] or [R] is tagged `guess` in the JSON.

## How payments fail

| Cause | Length | Evidence |
|---|---|---|
| One bank or processor | hours; TSB 2018, weeks [S] | Nine UK banks: 803 hours, 158 incidents, two years [S]. 1 in 7 UK adults had a card blocked by a glitch in 2018 [S] |
| National network | 3–22 hours | Visa Europe 2018: 10 hours, 10% of 51.2 million transactions failed [V]. Interac 2022 about 15 hours, Square 2023 15.5, Nets 2025 3 [S]. Iberian blackout 2025: up to 22 [V] |
| Regional disaster | 2 days to weeks | Helene: Boone "a couple days", groceries and fuel "almost a week", most ATMs down or empty [V]. Maria: half of branches open after a month [S] |
| Bank holiday or freeze | 4–8 days in five of six holidays, Greece 21 [V]; freezes 12 months in Argentina [V], 12–24 in Cyprus [S] | 8 freezes in 151 crises, 1970–2017 [V] |

Two findings shape the numbers.

- A short failure defers spending. Spain, 28 April 2025: spending fell 34% on the day; after two days the net loss was 15% [V].
- In freezes, banked households could usually still pay. Greece: €60 a day per depositor per bank [S], cards worked at home. Argentina: card payments "were not disrupted" [V]. So unmet payment days come mostly from infrastructure failure, and a banking crisis acts mostly through `financialLoss`.

My US frequency, for the hazard owners: cash-only for a day or more, 1% a year; four days or more, 0.2–0.3%. That is NREL's 3.5%, 1.0% and 0.13% for outages over 1, 3 and 7 days, times a guessed 0.3–0.5 share with shops open but cash-only.

## Need: payments

- Requirement: $20 per person-day (10–40). CEX 2025: food at home $6,491 + fuel $2,503 = $8,994 ÷ 365 ÷ 2.5 = $9.86 [V], doubled for emergency buying. Checks: Riksbank, SEK 1,000 per adult-week ≈ $15 a day [V]; authorities cited by the ECB, €70–100 per person for 72 hours ≈ $27–38 [V].
- Baseline: 1 day (0–4). 76% of Americans carry cash, mean $69 [V]; two wallets against $50 a day. Euro-area median €59 [V], about 2 days. The 45% of Americans and 35% of Europeans with a reserve (US mean $364) [V] are already prepared.
- Hardship per person-day, all guesses: chance of having to buy something × value lost, plus search time. Days 1–2: 0.3 × $15 + $4 = $7. Days 3–7: 0.6 × $30 + $6 = $25. Days 8–30: 0.9 × $40 + $4 = $40. Later $30.
- Mortality: 0.005, then 0.02 micromorts. No death in the Texas, Irma or Greek records is attributed to inability to pay.

## Cash

Cost per $100 a year: inflation $3.2 − average savings rate $0.39 + theft and loss $0.8 = $3.6 (0.8–6.5).

- Inflation: CPI +3.7% to September 2026 [V]; I use 3.2.
- Bank rates: 0.39% average savings, 0.07% checking [V]; 4.1–4.35% at the top [S].
- Theft and loss: burglary 1.3% [S] × 40% found + fire 0.21% [V] × 25% + misplaced 0.25% = 0.8%. The shares are guesses.
- The true cost depends on where the money would otherwise be: $1.2 (average account), $5 (top account), $9 (invested). The wording of the assignment allows $0.8 to $5; see open questions.
- Reliability 0.9: three quarters of stored cash is in $100 notes [V], which a cash-only shop cannot change.

Consequence: the first $100 averts about 1% × 1–2 days × 2.5 people × $7 ≈ $0.3 a year. Cash ranks low in the US unless payments windows are longer or likelier than I found.

## Argentina

Corralito from 1 December 2001: 250 pesos a week, 300 from January; bank holidays 21–26 December and 19–25 April; demand deposits freed 2 December 2002 [V]. Dollar deposits became pesos at 1.40 plus an inflation index; the market rate neared 4 [V].

Per $1,000 held on 30 November 2001:

- Peso deposit: 1,000 ÷ 3.4–3.9 = $255–295. Loss 70–75%.
- Dollar deposit: 1,400 × index 1.2–1.4 [R] ÷ 3.4–3.8 = $440–580. Loss 42–56%. Savers who sued did better: 21% of deposits were paid at the market rate by court order [V], and in 2006 the Supreme Court ordered full value [V].
- Dollar notes: $1,000, buying 3.4 ÷ 1.41 = 2.4 times as much locally (2002 inflation 41% [R]).
- In local goods the converted dollar saver was not poorer (1.96 ÷ 1.41 = 1.39). The loss is against the dollar.

People without accounts suffered through the cash shortage [V].

Later controls (2011–15; 2019 to April 2025): $200 a month at the official rate, parallel premium 103% to over 230% [S]. Bank dollars stayed withdrawable [R]; the loss fell on peso savers. In 2024–25 pesos beat dollars [R].

Notes at home cost 1–3% a year in theft over a local dollar deposit. The deposit's expected freeze loss is 4% a year (base rates) × 50% = 2%. Break-even. Only 20% of Argentines say they hold dollars at home [S]; old "small-head" notes trade 2–5% lower [S].

## Other stores of value, per $1,000

| | Cost a year | Averts | Limits |
|---|---|---|---|
| Dollar notes | $55 (30–110) | $420–750 in a forced conversion | nothing on insured deposits in Cyprus (47.5% cut only above €100,000) or Greece [V] |
| Account abroad | $30, 5 hours to open | the same, no theft | must exist first: Greece barred new accounts [S] |
| Gold | $20; 15% annual swings [R] | as dollars | must be sold first |
| Stablecoins | $60 (25–120) | as dollars | needs power and internet; USDC fell to $0.88 in March 2023 [S] |

All are `other` effects. For US and Western European households under the insurance cap there is no historical principal loss to avert.

## Other items

- Second route: 20% of payments harm in `bankingCrisis` (5–50%), because Greece's cap was per bank; nothing in storms.
- Document copies: 4% of net loss (1–12%). FEMA rejected about 60% of Maria applications [S]; only 10–23% of Los Angeles total-loss claimants got full contents limits without an inventory [S].
- Fire chest: 0.21% × $700 of replacements × 0.5 = $0.70 a year against $30 × 0.067 = $2. Low.
- Legal documents: preparedness share 50 catastrophe micromorts ÷ 3,500 all-cause [R] = 1.5%.
- Backup: everyday share 0.95; fire 0.21% against about 5% a year of ordinary loss [R].
- Emergency fund: a top account pays inflation, so the engine's capital charge is the cost. Value: $2,000 at 22.3% [S] over a year ≈ $240 of interest averted. 37% of adults would not cover $400 from cash [V].

## Insurance (not ranked)

| | Premium | Payout per $1 | Loading |
|---|---|---|---|
| Renters | $173 [V] | 0.58. Homeowners line 53.6% in 2025 [V], higher in other years [R] | 73% |
| Flood, NFIP | $920 [S] | 0.65 (0.45–1.5). Median $689 against full-risk $1,288 in 2022 [V] × loss share 0.5–0.55 (guess), premiums since raised | 54% |
| Earthquake, CEA | $965 [S] | 0.35 (0.2–0.55). 55% of premium buys risk transfer [S] | 185% |

Subsidised flood policies can pay out more than they cost.

## Assumed from others

Value of time $20 an hour; household of 2.5; discount rate 3%; hazard probabilities and windows.

## Sources I could not open

- store.sentrysafe.com (429): exact chest price.
- mfa.gr (403): Greek notice exempting foreign cards.
- travel.state.gov (403): passport fees.
- AOL/Reuters on Maria (404).
- Not opened: BJS cv24.pdf, Banco de España blackout paper, NAIC homeowners report, CEA financial statements, NFIP cumulative premiums and claims, UK Treasury Committee data, CRTC Rogers report.
- Fed diary and ECB SPACE PDFs: read by extracting text from the downloaded files.
- IMF WP 18/206: appendix table garbled; I used the text.
