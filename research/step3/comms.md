# comms: the information need and longlist rows 41–49

## What the evidence says

**Radio outlasts mobile, though thinly in the first days of the worst events.**

| Event | Mobile | Broadcast radio | Source |
|---|---|---|---|
| Katrina 2005, New Orleans | up to 2,000 cell sites out; ~820 a month later | 4 of 41 stations stayed on air | House Report 109-377 |
| Maria 2017, day 2–3 | 95.6% of sites out | 22 of ~185 stations reported on air | FCC |
| Maria, day 28 | 71.2% out | 60% of AM, 62% of FM on air | FCC |
| Helene 2024, western North Carolina, day 5 | 48.7% out (about 74% on day 2) | 4 stations reported out statewide | FCC |
| Iberia 2025, 10 h blackout | 50–100% of users offline in many areas about 7 h in | stayed up (search summary only) | Broadband Breakfast |

One surviving station serves a listener, so I put the chance of usable radio in a comms window at 0.9 (0.7–0.98).

**Cell-site backup.** Verizon: up to 8 h of battery at every macro site, 24–72 h per tank where a generator is fitted. AT&T: 4–72 h by facility (2021 FCC filings, via Light Reading). GAO: weaker sites last "several hours to one day". In California's high fire-threat districts the share of wireless facilities with 72 h backup rose from 39% (2021) to 72% (2023) (CPUC). Europe is thinner: Iberian sites ran down within hours.

**Warnings and deaths.**
- Camp Fire: 85 dead among about 39,000 residents (85 ÷ 39,000 ≈ 2,200 micromorts). Opt-in calls reached at most 17% of residents; the national phone alert was never sent; 87% of victims died at home; median age 72 (NIST).
- Lahaina: 101 dead, sirens silent, mobile network down (PBS). On a population of about 12,700 (recalled) that is about 8,000 micromorts.
- 2011 tsunami: 40% of 150 interviewed survivors never got the warning because power and communications failed (Ando et al.).
- Tornado warnings cut injuries by over 40% at some lead times; the fatality result is not robust (Simmons and Sutter).
- Puerto Rico: 41 days without cell service on average, 9% of households unable to reach 911, a third of excess deaths from delayed care (Kishore et al., via a summary).

**Mental cost.** I found no study that prices it. Texas 2021: 47% lost cell service and 43% of them called it very or extremely serious (power 68%, water 56–58%). Japan 2011: first contact with family took 4 h 9 min on average in the disaster area, and most first calls were safety checks (self-selected sample).

## The information need

**Hardship.** 43% ÷ 68% ≈ 0.65. Power-outage willingness to pay is $53.68 per household-day (ICE 2.0; ÷ 2.5 = $21 per person) to $33 per person (FEMA), both from step 2. 0.65 × $21–33 = $14–21. I use $15 (4–45), falling to $12 after a week (guess). FEMA's residential figure for communications loss, $0.67, is the price of service, not a willingness to pay.

**Decomposition (guesses), used to size every effect.** With no improvisation the day costs $25: news $11.25, contact $10.50, ordinary use $3.25. A car radio or a neighbour recovers 0.92 × 0.65 + 0.08 × 0.25 = 0.62 of news. Phone satellite texting recovers 0.6 × 0.7 × 0.7 = 0.29 of contact. 25 − 6.95 − 3.09 = $15.

**Mortality, healthy adult:** 0.1 micromort a day (0.01–0.6), a guess.
- Bottom-up: 5–10 time-critical emergencies per million adult-days × 1–3 points of survival lost = 0.05–0.3.
- Upper bound from Maria: 2,975–4,645 excess deaths ÷ 3.3M = 900–1,400 micromorts; × 1/3 for delayed care; × about 1/5, the share of reported access problems that were "could not reach 911"; ÷ 41 days = 1.4–2.1 per person-day; ÷ 2.5 for the age mix = 0.6–0.9.
- Texas check: 0.1 × 2.15 (age mix) × 1.5 days × 0.47 = 0.15 micromorts per resident, about 2% of the official toll. Not contradicted.

Age multipliers (4 and 12) are recalled incidence gradients, tagged guess.

## Items

| Item | Fraction of the information day removed | Arithmetic |
|---|---|---|
| Battery radio | 0.20 (0.07–0.4) | news recovered rises 0.62 → 0.9: 0.28 × 11.25 = $3.2 of $15. With a car 0.19, without 0.38 |
| Phone setup | 0.05 | 0.6 × (0.9 − 0.7) × 0.7 × 10.5 = $0.9 |
| Paper contact list | 0.02 | 0.25 × 0.2 × 0.6 × 10.5 = $0.3 |
| Two-way radios | 0.03 | 0.12 × 0.5 × 10.5 = $0.6; range 0.5–1 mile in a city |
| Satellite messenger | 0.35 (0.12–0.6) | 0.4 × 8.9 + 0.6 × 3.8 = $5.8 (0.39), shaded down |
| Offline and paper maps | 0.03 | a third of ordinary use on travel days: $0.4 |
| Books, games, downloads | 0.05 | a quarter of ordinary use: $0.8 |
| Shielded bag | 0.03, nuclearNear only | the radio's 0.2 × a 15% chance the radio would be destroyed |

Effects on other needs and channels:
- Phone setup, `fire` in wildfire: 0.10 (0.02–0.3). Registration cuts late awareness by a third, and 20–50% of deaths turn on late awareness: 0.07–0.17.
- Phone setup, `trauma` in flood, storm, hurricane, earthquake: 0.03. Only 7.2% have imminent-threat alerts switched off (RAND); 0.07 × 0.4 warning effect.
- Radio, `fallout` in nuclearNear: 0.05 (0.005–0.2), a guess on another researcher's channel.
- Whistle, `trauma` in earthquake: 0.01 at 0.2 adherence, a guess.
- Contact list, `devicePower`: 0.6 × 0.6 × 0.5 × 0.3 = 0.05.

**The uncomfortable result.** On the information need alone a radio does not pay for a US household with a car. Step 2's base rates imply about 0.16 comms-window days a year (0.2 × 0.4 + 0.02 × 2 + 0.005 × 7). 0.16 × $15 × 2.5 people × 0.2 × 0.9 × 0.85 ≈ $0.9 a year, against about $10 a year ($30 over ten years, spare cells, 0.2 h of upkeep). It ranks only if long outages or the nuclear effect carry it, or the household has no car. The satellite messenger costs about $150 a year ($340 over seven years plus $96 of plan) and should rank near the bottom; many US phones already do part of its job. The free actions (phone setup, contact list, offline maps) are the likely winners.

## Assumptions about other researchers' numbers
- Comms windows start when service is lost, not when power fails.
- Direct wildfire deaths sit on `fire`; flood and storm deaths on `trauma`.
- About half of what a flat phone costs (`devicePower`) is lost contact. That need is in rated Wh in the power-light file, so the crank radio's cell is entered as 7 Wh rated.

## Weak points
- Every share in the decomposition is a guess. Only the $15 total is anchored.
- The share of US households with a satellite-capable phone (60%) is my estimate.
- No price is verified on a retailer page.
- US values throughout; I verified nothing about car ownership, alert systems or phone satellite service in Western Europe or Buenos Aires.

## Sources I could not open
- Kishore et al., NEJM 2018: Harvard repository 502, PMC browser check. Used a Weather Underground summary.
- Ofcom's consultation and 2025 technical report on mobile backup power (403).
- GSMA report on Spanish networks in the 2025 blackout (403).
- World Bank note on 2011 tsunami evacuation (403).
- EMP Commission 2008 report on DTIC (403).
- Brynjolfsson et al. 2019 (PMC browser check); not used in any number.
- Christian Science Monitor (403) and NPR (timeout) on Lahaina.
- Mint Mobile survey on remembered numbers (403).
- Price pages: Midland and FosPower (429), REI and T-Mobile (403), Walmart (bot check), Best Buy (timeout), Retevis (404), Garmin (no prices shown).
- Huang et al. 2016 and Macintyre et al. 2006: search-result abstracts only.

## Method note
NIST TN 2252 exceeds the fetch tool's size limit, so I downloaded that one PDF with curl. Other PDFs came back as binary and I read them with pdftotext from the fetch tool's cache.
