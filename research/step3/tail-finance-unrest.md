# tail-finance-unrest: reasoning

Labels: **[V]** read on a fetched page; **[S]** search snippet; **[R]** recalled. A number is tagged `derived` only when it lies inside the range that fetched data give; otherwise `guess`.

## Format

- Six entries: each hazard once per location, US first, so that `build-data.mjs` reads the other two as `byLocation`.
- Exposure mids are means per event: the engine multiplies an exposure by the hazard probability without scaling it by severity.
- Extra fields: `referenceDepositUsd`, `lossShare`, `conflictShare`.

## bankingCrisis

Threshold: deposits unusable for three days or more, or the currency loses 30% against the dollar (parallel rate under controls) or 25% of its purchasing power, within 12 months.

**Base rates**

- IMF database [V]: 151 banking crises in 1970–2017; freezes in 8; six bank holidays, five of 4–8 days, Greece 21. Advanced economies: 2 freezes (Cyprus, Greece) in about 1,700 country-years, 0.12%.
- Reinhart and Rogoff [V]: years in banking crisis since 1800: US 13.0%, UK 9.2%, France 11.5%, Argentina 8.8%. Advanced economies since 1945: 1.4 crises each in 63 years, 2.2% a year; × 8/151 with a freeze = 0.12%.
- US: no event since the March 1933 holiday [V]. Zero in 93 years gives 1/95 = 1% by the rule of succession, my upper end. Mid 0.2% = 0.05% freeze + 0.15% dollar collapse.
- Western Europe: 2 freezes in about 460 euro country-years = 0.43%; by population, 12 of 430 million over 27 years = 0.1%. Mid 0.3%.
- Pessimistic: Dalio and Rogoff [V] expect a US debt crisis within 5–10 years, about 10% a year. Both describe 1970s-style inflation, which stays under the threshold: × 15% = 1.5%. Western Europe 2%: the 2010–15 rate, 2 of about 17 euro members in six years.

**Argentina**

Episodes since 1975 [V: Perfil, Tiempo Argentino, IMF, Diario de Cuyo]:

- Rodrigazo, June 1975 (devaluation near 100%); devaluations of 1981; Plan Austral, 1985.
- Hyperinflation, 1989: prices +3,079%, the dollar from 17 to 1,800 australes.
- Plan Bonex, 28 December 1989: time deposits swapped for ten-year bonds that fell to 25% of face value; USD 550 paid in cash.
- Corralito, 1 December 2001 to 2 December 2002: 250 pesos a week; dollar deposits converted at 1.40 against a market rate near 3.4.
- Controls of 2011–15: gap above 100% in May 2013; 23% devaluation in January 2014; unification from 9.80 to 13–14 in December 2015.
- 2018, and August 2019: 46.55 to 63 in days, controls back, 42% of dollar deposits withdrawn.
- Controls of 2019–25: gap of 200% in October 2023, the widest since 1989; devaluation of December 2023; lifted for individuals in April 2025.

Peso loss against the dollar, official December averages [V]: 2002 70%; 2013–16 23–27% a year; 2018 54%; 2019 38%; 2020 29%; 2022 40%; 2023 74%; 2025 29%. (2024 shows 34% only because the December 2023 devaluation fell mid-month.)

- 30% or more: 5 of 35 years since 1992 (14%); 5 of 25 since 2002 (20%); 4 of 15 since 2011 (27%). 25% or more: 10 of 15.
- IMF: nine crisis onsets in six episodes over 48 years, 12–19%.
- 1975–91: every year, judging by inflation [R].
- Freezes: 2 in 52 years, 4%.

Forecast 15% (7–30). Pessimistic 30% (15–50): the frequency since 2011, and four presidential election years out of four with a devaluation or new controls.

Present regime, November 2026 [V]: dollar 1,551; band ceiling 1,989, indexed to inflation. The survey forecast for October 2027 is 1,985, a 22% loss that expected inflation of 21.8% matches. The ceiling by then is 1,989 × 1.018^11 = 2,420, a 36% loss, so the event is roughly "the band breaks, or deposits are restricted". Country risk is 840–950 points, up from 400 this year: 0.09 / 0.65 = 14% a year of default, risk-neutral. Firms still face controls. A freeze is now about 1.5% a year (guess): the reserve requirement on dollar deposits was about 10% in 2001 and 50% in 2019 [V].

**Loss on three months of spending**

| | Deposit | Share | Loss |
|---|---|---|---|
| US | $81,905 / 4 = $20,500 [V] | 8% | $1,600 |
| Western Europe | (€35,101 [V] + €39,100 [S]) / 2 / 4 × 1.10 [S] = $10,000 | 9% | $900 |
| Buenos Aires | ARS 2.08–2.60 million [V] × 1.019³ × 3 / 1,551 = $4,300–5,300; I use $4,500 | 35% | $1,600 |

- US: 1/3 freeze × 1% + 2/3 currency fall × (2/3 × 6% + 1/3 × 22%) = 8%.
- Europe: 0.5 × 1% + 0.15 × 30% (euro exit) + 0.35 × 10% = 8.5%.
- Buenos Aires: the five threshold years average 55%. Interest recovers about 40% of that on the remunerated half: 55 × 0.8 = 44%. I shade to 35% because a banded rate should break less far. In purchasing power the loss is about half (2002: prices +41% [R], so 29% against 70%).
- Caveat: the loss is gross of the interest premium of calm years. For remunerated deposits that premium roughly matched the losses over 2003–2026 [R]; for sight balances it did not.

**Windows**

- Payments: cards kept working in Greece and Cyprus [V] and in Argentina in 2001–02 (money-docs). I count only days of empty ATMs and cash-only sellers: probability 0.2 (Buenos Aires 0.1 = 2 freezes in 11 episodes × 0.6); days 3/8/21 from the IMF's holiday lengths.
- Food: none recorded in Cyprus, Greece or Iceland; 0.02. Buenos Aires 0.05, the remainder after civilUnrest.
- Medication, Buenos Aires only: in January 2002 wholesalers filled 30% of pharmacy orders and insulin ran short [V]; 0.05.

## civilUnrest

Event: the household's city or commune has rioting, looting, a riot curfew or state of siege, or armed conflict. Broad on purpose; the windows carry the severity.

- US: people under curfew or riot: 2020, 60 million [S] in 200 cities [V]; 1992, 5 million; 1967–68, 23 million; others, 4 million (my estimates). 92 million / (62 years × 260 million) = 0.6% a year; 1.5% over 2015–26. Forecast 1%. Pessimistic 3%: a 2020 every six years (18% / 6).
- Western Europe: France 2005 (274 towns), 2018–19, 2023 (672 communes), 2026 (3,000 businesses hit) [V]; I estimate 15–35% of the population each time: 92% / 22 years = 4%. England 2011 and 2024: 25% / 26 = 1%. Elsewhere 0.3%. Weighted: (68 × 4 + 68 × 1 + 294 × 0.3) / 430 = 1%.
- Buenos Aires: the region in 1989, 2001, 2013 and 2023 [V]: 4 / 43 = 9%; the city proper once or twice, 2–5%. Forecast 4%, pessimistic 8%.
- Conflict share: US 3% (Metaculus 2% by 2031 = 0.5% a year, × 1/5 of households, × 1/2 for bias, ÷ 1.5%); Europe 2%; Buenos Aires 1%.
- Violence, riot tier, from deaths per million residents, cut for people who stay out of it: 2020, 19 / 60 = 0.3; Los Angeles 1992, 55–63 / 3.5 = 16–18; Buenos Aires 2001, 7 / 3 = 2.4; England 2011, 5 / 8 = 0.6. Conflict tier 300 [R]. US 0.5 + 0.03 × 300 = 9; Europe 0.2 + 6 = 6; Buenos Aires 0.5 + 3 = 3.5.
- Financial: riot tier $5–20 (2020: $1–2 billion / 23 million households = $45–90, nearly all commercial); conflict tier $5,000–15,000 × share.
- Food window: US 0.08, Europe 0.05, Buenos Aires 0.2, where looting targets food shops and thousands shut in 2013 and on rumour in 2023 [V].
- Leave: feasible 0.9–0.94 from the next morning; riots are local and nocturnal.

## Warning and late buying

- Banking: Cyprus none; Greece five months (€50 billion withdrawn); Argentina 2001 nine months (deposits 85 to 67 billion) [V]. Median 14 days, 21 in Buenos Aires. An alert household can still draw two weeks of cash, buy food and medicines, pay bills ahead and, in Argentina today, buy dollars inside the band. Staple 0.5–0.6; hard currency 0.15 (Buenos Aires 0.3).
- Unrest: hours in the first city, 2–4 days elsewhere (2020, 2011, 2001). The household can buy a week of food by day, fill prescriptions, move the car, or leave. Staple 0.85.

## Assumed from others

Payments need and its baseline (money-docs); household of 2.5; value of a micromort.

## Not opened

- Metaculus (403); the 2% is the step-2 reading.
- IMF appendix table: partly garbled; advanced-economy currency crises are recalled.
- Chequeado's timeline of the controls; es.wikipedia on the 1989 looting (404); the Senate report PDF (404; read via Public Sénat); Verisk's blogs; ACLED's dashboard; the Financial Times interview with Dalio; the central bank survey PDF (read via Perfil).
- Destatis, the euro rate and sentix: snippets only.
- No series of the parallel dollar or of deposit rates: the interest adjustment is recalled.
