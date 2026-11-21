# ai-leadtime: AI-driven risk by the years left before full automation

Assignment `ai-leadtime`. Sources read on 20 November 2026. L is the number of years from the start of 2027 to full labour automation.

| Figure | Middle | Range | Tag |
|---|---|---|---|
| `referenceLeadYears` | 5 | 3–8 | guess |
| `turbulentYears` | 5 | 2–10 | guess |
| `runUpYears` | 3 | 1–8 | guess |

Every hazard factor is a guess. Only the existential factors rest on forecasts made conditional on timelines.

**Reading conventions.** "Verified" means I read the claim on a page I fetched. The fetch tool passes pages through a summarising model and caps quotations at about 125 characters, so check quotations before print. The NIST guide and the White House memorandum were read as PDF text and pages. Claims taken from the sibling files are marked unverified.

## 1. What sources say

**Forecasts conditional on timelines.** I found four, all about catastrophe or takeover, none about a household-level hazard.

- Lifland's thread (LessWrong, 14 September 2022) asked for the chance of an AI-caused existential catastrophe given AGI by 2025, in 2025–2030, 2030–2040, 2040–2060 and after 2060. Lifland: 65%, 60%, 55%, 50%, 45%. Greenblatt: 73, 53, 41, 30, 28. Finnveden: 80, 50, 35, 25, 20. Medians of the 41 to 45 answers per window, computed by me: 84.5, 74, 65, 46, 34.5. The fetch tool rebuilt the answer lists from the page layout.
- Metaculus question 12840, the same question: 30% for arrival in 2030–2039, 11% for 2060–2099, 20% for 2022–2024 (111 forecasters; embed page only). Dickens reports a range "from 50% to 9.3%" in 2025 without saying which window is which.
- Greenblatt (8 October 2025), takeover risk by lead time for safety work: 7% with ten years, 13% with one to three years, 20% with one to nine months, 45% with none but "ten people on the inside", 75% otherwise.
- MacAskill and Taylor (Forethought, 22 January 2026), for AI research automated by 2027, 2035 and 2045: US coup risk "22%/10%/7%"; China's chance of a decisive advantage "10%/30%/50%"; "On longer timelines, takeoff is likely slower"; risk from other catastrophes rises with "a longer 'time of perils'".

FRI's LEAP wave 9 conditions on pace, not date. Median expert, catastrophe killing over 10% of people by 2100: 2% under slow progress, 10% under rapid. FBI-reported cybercrime losses in 2031: $46 billion against $70 billion.

**How fast defences adapt.**

- Software. Mean time to exploit is "an estimated -7 days" (M-Trends 2026). Median time to patch rose "from 32 days to 43 days"; 26% of known-exploited flaws are fully fixed (Verizon via Tenable). Anthropic, June 2026: "within 6 to 12 months" many companies will have Mythos-class models; "the bottleneck in cybersecurity is now verifying, disclosing, and patching". Android's memory-safety share of vulnerabilities fell "from 76 percent in 2019 to an expected 24 percent" in 2024. Sentinel: 35% that a memory-safe operating system passes 5% of servers by 2030; 7.1% that a tenth of new software carries proofs in 2027.
- Control systems. Operational technology lasts "10 to 15 years and sometimes longer", IT "three to five years" (NIST SP 800-82r3). Large transformers take "as long as four years" (PwC via pv magazine).
- Biosecurity. FRI's experts: 0.3% a year for a human-caused epidemic, 1.5% with AI capabilities, back to 0.4% with safeguards and mandatory synthesis screening. The US policy of 5 November 2026 binds only recipients of federal funds and gives them 250 to 340 days. COVID-19 vaccines took 326 days; CEPI's goal is 100. The Apollo programme for biodefense set a ten-year horizon ("by 2030", from 2021).
- Finance and fraud. After three years of rapid credit and asset-price growth, a crisis follows within three years with probability about 40%, against 7% (Greenwood and others). Basel III: published 2010, final reforms 2017, transition to 2028. US chip cards: under 5% of in-person transactions in 2015, nearly 90% in 2022; counterfeit fraud fell on one network type and returned to its 2015 level on the other (Kansas City Fed).
- Labour and unrest. The China shock "plateaued in 2010"; its local effects "are present out to 2019". Threshing machines caused the Swing riots, less "where alternative employment opportunities softened the blow". "If automation proceeds sufficiently slowly ... wages may rise forever" (Korinek and Suh).
- War. "Large, rapid shifts in the distribution of power can lead to war" (Powell). SALT I took "two and a half years" of talks, 27 years after the first bomb; the non-proliferation treaty seven years from proposal to signature. Cotton-Barratt: "the rapidity of change during an AI takeoff" raises nuclear risk.

**Length of the transition.** AI 2027's race ending: AGI in August 2027, "a million new robots per month" by the end of 2028, "Humans realize that they are obsolete" in 2029. Metaculus: weak AGI 11 Aug 2027, strong AGI (with robotics) 23 May 2030, weak AGI to superintelligence 23.3 months. Davidson: 20% to 100% automation of cognitive tasks in about three years (25% under one, 80% under ten). Davidson and Hadshar: the industrial explosion "will proceed more slowly" than the intelligence explosion.

## 2. What I infer

**Reference lead time: 5 years.** The five files anchor their transition rates on forecasts and defences of 2026–2028 and on AGI in about 2027–2030:

- `ai-bio`: FRI's conditionals for 2028, "2026-era evals", AI 2027 at 70–90% speed.
- `ai-cyber`: the FRI and GovAI pilot for 2026, Sentinel's forecasts for 2028, open models "4 to 7 months" behind.
- `ai-economy`: FRI's rapid scenario for 2030, Korinek and Suh's five-year scenario, the Fed's 2026 debt figures.
- `ai-war`: a multiplier on today's rates, Aschenbrenner and AI 2027.
- `ai-timelines`: centre "about 2027–2029", Metaculus 2030.

AGI at 2028.5 plus about 3.5 years to full automation gives 2032, five years from the start of 2027. By hazard the reference runs from 4 (cyber, bio) to 7 (war). The existential figure of 0.2 is different: its sources (Ord 2020, Christiano 2023, AI Impacts 2024, Samotsvety 2022) had median AGI dates in the 2030s and 2040s, so I set its factor to 1 at eight years.

**`turbulentYears`: 5.** The old window began at AGI; the new one ends at full automation, about 3.5 years after AGI. A five-year window therefore starts a year before AGI, where `ai-timelines` already puts misuse and economic risk, and the existing yearly figures cover the same number of years.

**`runUpYears`: 3.** Today's cyber rates are 2 to 10 times baseline and the first AI-run intrusions date from 2025, three years before the reference turbulent period. Davidson's three years of partial automation agree.

**Existential factors.** Windows map to L by adding four to five years to their midpoints: 2025–2030 is L ≈ 5, 2030–2040 L ≈ 12, 2040–2060 L ≈ 28. Relative to the level at eight years, the thread's medians give 1.06, 0.93 and 0.66; Greenblatt and Finnveden 1.12, 0.83 and 0.60; Metaculus is steeper.

## 3. My guesses

**Shorter leads.** Factor = compression × unpreparedness × lag. Compression is the same transition in fewer years (about 3 at L = 1, 1.6 at L = 3). Unpreparedness is 1.05 to 1.3. Lag is the time attackers, strikers, armies and crises need (0.35 for fraud to 0.8 for grid sabotage at L = 1).

**Longer leads.** Factor = dilution × preparedness, down to a floor. Dilution (0.9, 0.78, 0.65, 0.57 at 8, 12, 20, 30) reflects a slower takeoff spread over more than five years. Preparedness follows the adaptation speeds above.

Middle factors:

| Hazard | L=1 | 3 | 5 | 8 | 12 | 20 | 30 |
|---|---|---|---|---|---|---|---|
| `pandemicModerate` | 1.4 | 1.2 | 1 | 0.85 | 0.7 | 0.5 | 0.4 |
| `pandemicSevere` | 1.5 | 1.25 | 1 | 0.85 | 0.68 | 0.5 | 0.42 |
| `cyberOutage` | 2.3 | 1.5 | 1 | 0.8 | 0.6 | 0.42 | 0.35 |
| `gridLong` | 2.5 | 1.5 | 1 | 0.8 | 0.62 | 0.45 | 0.38 |
| `waterSystemFailure` | 1.8 | 1.35 | 1 | 0.85 | 0.65 | 0.42 | 0.33 |
| `paymentsOutage` | 2.2 | 1.5 | 1 | 0.65 | 0.4 | 0.25 | 0.2 |
| `commsOutage` | 2.3 | 1.5 | 1 | 0.7 | 0.45 | 0.3 | 0.25 |
| `cyberSupplyShock` | 2.0 | 1.4 | 1 | 0.75 | 0.55 | 0.35 | 0.3 |
| `bankingCrisis` | 1.8 | 1.4 | 1 | 0.8 | 0.6 | 0.45 | 0.4 |
| `supplyShock` | 1.6 | 1.3 | 1 | 0.8 | 0.6 | 0.45 | 0.4 |
| `aiFraud` | 1.2 | 1.15 | 1 | 0.9 | 0.75 | 0.6 | 0.5 |
| `greatPowerWar` | 1.6 | 1.3 | 1 | 0.9 | 0.75 | 0.6 | 0.5 |
| `nuclearNear` | 1.8 | 1.35 | 1 | 0.88 | 0.75 | 0.6 | 0.52 |
| `nuclearFar` | 1.6 | 1.3 | 1 | 0.9 | 0.78 | 0.65 | 0.55 |
| `civilUnrest` | 1.5 | 1.35 | 1 | 0.8 | 0.58 | 0.42 | 0.35 |
| existential | 1.6 | 1.3 | 1.15 | 1 | 0.88 | 0.7 | 0.57 |

Ranges are wide: at L = 1 typically 0.7–5; at L = 30 typically 0.1–1.1, and up to 1.5 for war and nuclear hazards.

**After automation.** With a lead under five years, the years after automation still lie inside what the old research called the transition. `afterFactors` put the rate 40% (L = 1) and 15% (L = 3) of the way from the after rate to the transition rate, computed on averaged rates and on the place with the smallest ratio. From five years on they are 1.

| Hazard | L=1 | L=3 | Hazard | L=1 | L=3 |
|---|---|---|---|---|---|
| `pandemicModerate` | 2.2 | 1.45 | `bankingCrisis` | 1.4 | 1.15 |
| `pandemicSevere` | 3.1 | 1.8 | `supplyShock` | 1.2 | 1.1 |
| `cyberOutage` | 3.4 | 1.9 | `aiFraud` | 1.35 | 1.15 |
| `gridLong` | 3.8 | 2.0 | `greatPowerWar` | 2.8 | 1.7 |
| `waterSystemFailure` | 3.9 | 2.1 | `nuclearNear` | 1.4 | 1.15 |
| `paymentsOutage` | 7.4 | 3.4 | `nuclearFar` | 2.0 | 1.4 |
| `commsOutage` | 8.5 | 3.8 | `civilUnrest` | 1.3 | 1.1 |
| `cyberSupplyShock` | 4.2 | 2.2 | | | |

## 4. Mechanisms behind the biggest differences

- **Payments, communications and shop systems gain most from time** (0.2–0.3 at 30 years). They are software, and software can be audited and rewritten on a five-year scale. Finance adapts fastest; retail and logistics are trailing-edge firms.
- **Power, grid and water gain less** (0.33–0.38). Equipment lasts 10 to 15 years, transformers take four, and state sabotage of data-centre power is a decision, not a vulnerability.
- **Pandemics gain slowly** (0.4). Screening removes the lone-actor part; states, accidents and attack-favouring biology remain. A short lead adds less than in cyber because a release takes months.
- **War and nuclear risk have the highest floors** (0.5–0.55) and high ends above 1. Speed of the shift is the cause in theory, but a longer lead is a longer arms race with China nearer parity.
- **Fraud is nearly flat.** Criminal take-up lags capability and defences displace fraud.
- **Unrest** is the one hazard with a conditional forecast behind part of it: 0.38 × 0.45 (coup) + 0.62 × 0.65 (jobs, my guess) = 0.57 at twelve years.

## 5. What it does in the model

Five-year average, middle values, US, percent a year, by year of full automation:

| Hazard | Today | 2028 | 2030 | 2032 | 2035 | 2038 |
|---|---|---|---|---|---|---|
| `cyberOutage` | 0.10 | 0.47 | 0.82 | 0.97 | 0.52 | 0.14 |
| `paymentsOutage` | 0.50 | 1.06 | 1.98 | 2.38 | 1.24 | 0.56 |
| `greatPowerWar` | 1.60 | 2.06 | 3.03 | 3.96 | 2.87 | 1.72 |

The yearly rate before automation rises the sooner it comes, but the five-year average peaks near 2032, because for 2028 or 2030 part of the horizon lies after automation. The chance of existential catastrophe (middle 0.2) becomes 0.31, 0.25, 0.23, 0.20, 0.17 and 0.13 for 2028, 2030, 2032, 2035, 2040 and 2050.

## 6. Least sure

1. `afterFactors` at one and three years. They decide the result for readers who give 2027–2029, and rest on one assumption of mine (40% and 15%).
2. Every factor at L = 1. Compression and lag pull opposite ways and neither is measured.
3. The reference. If it is 3 or 8 rather than 5, every factor shifts by 20–40%.
4. Whether long timelines mean slow takeoff. Kokotajlo expects the opposite; then factors at 12–30 belong near 1.
5. War and nuclear factors beyond eight years, where the sign is unclear.
6. The existential reference at eight years, which adds 15% at the model's central case.
7. Buenos Aires: no factor varies by place.

## 7. Not opened

Metaculus question 12840 and its API (403; embed only, three of five windows). The EA Forum copies of Lifland's thread and Dickens's post (429). RAND's history of US synthesis-screening policy (the fetch tool refused it). Google's 2024 memory-safety post (read via The Register). The Verizon and M-Trends 2026 reports (read via Tenable and Google's blog). The RAND report by Burdette and Demelash (read via MIT's summary). The second half of "Preparing for the Intelligence Explosion". AI 2027's slowdown ending. Wood Mackenzie's transformer survey. Full list in the JSON.
