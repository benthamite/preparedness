# ai-leadtime: AI-driven risk by the years left before full automation

Assignment `ai-leadtime`. Sources read on 20 November 2026. Revised the same day after the independent check (`ai-leadtime.check.md`) and the engine changes: monthly averaging, a share after automation that fades, the existential factor on the odds. L is the number of years from the start of 2027 to full labour automation.

| Figure | Middle | Range | First version |
|---|---|---|---|
| `referenceLeadYears` | 5 | 3–8 | 5 |
| `turbulentYears` | 3.5 | 1.5–10 | 5 |
| `runUpYears` | 2 | 1–6 | 3 |

Every factor is a guess. Only the existential factors rest on forecasts made conditional on timelines.

**Reading conventions.** "Verified" means I read the claim on a page I fetched. The fetch tool summarises pages and caps quotations at about 125 characters, so check quotations before print. NIST and the White House memorandum were read as PDF; the Metaculus figures from the data inside the embed pages. Claims taken from sibling files are marked unverified.

## 1. What sources say

**Forecasts conditional on timelines.** Four, all about catastrophe or takeover.

- Lifland's thread (LessWrong, September 2022): the chance of an AI-caused existential catastrophe given AGI by 2025, in 2025–2030, 2030–2040, 2040–2060 and after 2060. Medians of 41 to 45 answers: 84.5, 74, 65, 46, 34.5. Two people are counted twice; without them: 83, 70, 63, 45, 34. Of the 37 who answered every window, two rise after the second.
- Metaculus 12840 asks a narrower thing: a fall of more than 95% in world population from AI within 25 years of AGI. For arrival in 2025–2029, 2030–2039, 2040–2059 and 2060–2099: 40%, 30%, 17%, 11% (79 to 100 forecasters).
- Greenblatt (October 2025), takeover risk by lead time bought for safety work: 7% with ten years, 13% with one to three, 20% with months, 45% with none, 75% otherwise; 38% on his own weights.
- MacAskill and Taylor (Forethought, January 2026), for AI research automated by 2027, 2035 and 2045: US coup risk "22%/10%/7%", conditional on US dominance, itself 85%, 55%, 35%; China's chance of a decisive advantage 10%, 30%, 50%; "On longer timelines, takeoff is likely slower".

FRI's LEAP wave 9 conditions on pace: catastrophe by 2100 at 2% under slow progress and 10% under rapid; cybercrime losses in 2031 of $46 billion against $70 billion.

**How fast defences adapt.**

- Software: mean time to exploit "an estimated -7 days"; median time to patch up "from 32 days to 43 days", 26% of known-exploited flaws fixed; Mythos-class models at many companies "within 6 to 12 months"; Android's memory-safety share "from 76 percent in 2019 to an expected 24 percent" in 2024; Sentinel gives 35% to a memory-safe operating system passing 5% of servers by 2030.
- Control systems: equipment lasts "10 to 15 years and sometimes longer" (NIST); large transformers take up to four years.
- Biosecurity: FRI's experts put a human-caused epidemic at 0.3% a year, 1.5% with AI capabilities, 0.4% with safeguards and mandatory screening. The US policy of 5 November 2026 binds only federally funded buyers. Vaccines: 326 days for COVID-19 against a goal of 100. The Apollo programme for biodefense: ten years.
- Finance and fraud: a crisis follows a credit boom within three years 40% of the time, against 7%. Basel III ran from 2010 to 2028. US chip cards took seven years; counterfeit fraud fell on one network type and returned on the other.
- Labour: the China shock "plateaued in 2010" and its effects "are present out to 2019"; threshing machines caused riots, fewer where other work existed; "If automation proceeds sufficiently slowly ... wages may rise forever".
- War: "large, rapid shifts in the distribution of power can lead to war" (Powell); SALT I took two and a half years of talks, 27 years after the first bomb.

**Length of the transition.** AI 2027's race ending: AGI in August 2027, people "obsolete" in 2029. Metaculus: weak AGI August 2027, strong AGI May 2030. Davidson: about three years from 20% to 100% of cognitive tasks.

## 2. What I infer

**Reference lead time: 5 years.** The five files anchor on forecasts and defences of 2026–2028 and on AGI in about 2027–2030: FRI's conditionals for 2028 (`ai-bio`); the grid pilot for 2026 and Sentinel for 2028 (`ai-cyber`); FRI's rapid scenario for 2030 and the Fed's 2026 debt figures (`ai-economy`); a multiplier on today's rates (`ai-war`); a centre of "about 2027–2029" (`ai-timelines`). AGI at 2028.5 plus about 3.5 years to full automation gives 2032. The 3.5 is above the three fast-view figures because the reader's milestone needs robots at scale; with 3 the reference would be 4.5, with 5, 6.5.

**`turbulentYears`: 3.5.** The old window was five years from AGI. The full rate now runs from AGI to automation, and the last 1.5 years of the old window fall after automation (`afterShare`). With five, the full rate began 1.5 years before AGI.

**`runUpYears`: 2.** The engine ramps from today's rate, observed at the end of 2026. For the reference reader AGI is two years on. That puts 17% of the excess before AGI; `ai-timelines` says 15%.

**Existential factors, on the odds.** A window stands for a lead of its midpoint (of the part still ahead) plus 3.5 years: about 5, 11.5 and 26.5. Ratios of odds against the level at eight years:

| Source | L≈5 | L≈11.5 | L≈26.5 | After 2060 |
|---|---|---|---|---|
| Thread, no duplicates | 1.16 | 0.85 | 0.41 | 0.26 |
| Metaculus | 1.22 | 0.78 | 0.37 | 0.23 |
| Greenblatt, 2022 | 1.25 | 0.77 | 0.47 | 0.43 |
| Finnveden, 2022 | 1.32 | 0.71 | 0.44 | 0.33 |

As ratios of probabilities the thread gives 1.05, 0.94, 0.67 and Metaculus 1.13, 0.85, 0.48, 0.31. I use the odds because the engine does; the sources start from 35% to 67%, and carrying their odds ratios down to 0.2 is an assumption. For one year: Greenblatt's no-lead plans against his average are 1.38 in probability, 1.8 in odds; 1.2 if months of lead are still open.

## 3. My guesses

**Shorter leads.** Factor = compression (3.5 turbulent years in one: 3.5; in 2.75: 1.27) × unpreparedness (1.02–1.25) × the share that can happen before automation (0.35 for fraud to 0.75 for power at one year). The terms express a judgment; they are not derivations.

**Longer leads.** Factor = what the extra preparation buys, down to a floor. No dilution: the engine keeps the turbulent period fixed.

| Hazard | L=1 | 3 | 5 | 8 | 12 | 20 | 30 |
|---|---|---|---|---|---|---|---|
| `pandemicModerate` | 1.55 | 1.1 | 1 | 0.93 | 0.87 | 0.77 | 0.7 |
| `pandemicSevere` | 1.7 | 1.15 | 1 | 0.93 | 0.86 | 0.76 | 0.72 |
| `cyberOutage` | 2.9 | 1.3 | 1 | 0.9 | 0.78 | 0.65 | 0.6 |
| `gridLong` | 2.3 | 1.2 | 1 | 0.9 | 0.8 | 0.7 | 0.65 |
| `waterSystemFailure` | 2.1 | 1.2 | 1 | 0.93 | 0.82 | 0.65 | 0.57 |
| `paymentsOutage` | 2.45 | 1.3 | 1 | 0.75 | 0.5 | 0.38 | 0.33 |
| `commsOutage` | 2.6 | 1.3 | 1 | 0.8 | 0.6 | 0.47 | 0.42 |
| `cyberSupplyShock` | 2.2 | 1.25 | 1 | 0.85 | 0.7 | 0.55 | 0.5 |
| `bankingCrisis` | 2.0 | 1.2 | 1 | 0.88 | 0.76 | 0.67 | 0.63 |
| `supplyShock` | 1.75 | 1.15 | 1 | 0.88 | 0.76 | 0.67 | 0.63 |
| `aiFraud` | 1.35 | 1.05 | 1 | 0.97 | 0.92 | 0.86 | 0.8 |
| `greatPowerWar` | 1.9 | 1.15 | 1 | 0.97 | 0.9 | 0.82 | 0.77 |
| `nuclearNear` | 2.1 | 1.2 | 1 | 0.96 | 0.9 | 0.82 | 0.78 |
| `nuclearFar` | 1.85 | 1.15 | 1 | 0.97 | 0.92 | 0.86 | 0.82 |
| `civilUnrest` | 1.75 | 1.15 | 1 | 0.87 | 0.72 | 0.6 | 0.55 |
| existential (odds) | 1.6 | 1.35 | 1.15 | 1 | 0.8 | 0.58 | 0.42 |
| `afterShare` | 0.9 | 0.8 | 0.7 | 0.45 | 0.2 | 0.05 | 0 |

Ranges: at one year typically 0.6–5.5; at 30 years 0.1–1.2, to 1.7 for war and nuclear.

**`afterShare`.** A share s adds 1.75 × s year-equivalents of turbulence after automation. At the reference the old window leaves 1.5 years there (s = 0.86); at shorter leads more than the cap of 1 holds. I shade down for front-loading on fast-takeoff views. No source says how fast hazards fall after automation.

## 4. Mechanisms behind the biggest differences

- **Payments, communications and shop systems gain most from time** (0.33–0.5 at 30 years). Software can be audited and rewritten on a five-to-ten-year scale; finance fastest.
- **Power, grid and water gain less** (0.57–0.65). Equipment lasts 10 to 15 years, and state sabotage is a decision, not a vulnerability.
- **Banking crises and supply shocks** fall to 0.63. Here the slower pace is itself the cause: a slower boom, fewer workers displaced a year.
- **Pandemics gain little** (0.7). Screening removes the lone-actor part; states, accidents and attack-favouring biology remain.
- **War, nuclear risk and fraud barely move** (0.77–0.82), with high ends to 1.7. A slower shift helps; a longer arms race with China nearer parity does not.
- **Unrest** has a conditional forecast behind part of it: 0.38 × 0.45 (coup) + 0.62 × 0.83 (jobs, my guess) = 0.69 at twelve years, raised to 0.72 for places where coups matter less.
- **At one year** the hazards with standing attackers (power, communications, payments) rise most; those with a slow fuse (fraud, unrest, pandemics) least.

## 5. What it does in the model

Computed with the engine's `aiShift` and `aiSurvival` on `data/model.json`, with this file's figures substituted in memory (I did not rebuild `model.json`). Five-year average, middle values, US, percent a year, by year of automation:

| Hazard | Today | 2027 | 2028 | 2029 | 2030 | 2031 | 2032 | 2033 | 2035 | 2037 |
|---|---|---|---|---|---|---|---|---|---|---|
| `cyberOutage` | 0.10 | 0.60 | 1.02 | 1.09 | 1.03 | 0.98 | 0.81 | 0.61 | 0.26 | 0.10 |
| `paymentsOutage` | 0.50 | 1.35 | 2.22 | 2.51 | 2.53 | 2.45 | 2.03 | 1.55 | 0.79 | 0.50 |
| `greatPowerWar` | 1.60 | 2.17 | 3.13 | 3.58 | 3.78 | 3.84 | 3.51 | 3.02 | 2.06 | 1.60 |
| `aiFraud` | 6.0 | 8.1 | 9.7 | 10.7 | 11.3 | 11.5 | 10.8 | 9.6 | 7.2 | 6.0 |
| `pandemicModerate` | 2.20 | 1.49 | 1.97 | 2.32 | 2.56 | 2.71 | 2.67 | 2.55 | 2.31 | 2.20 |

- Software and power hazards are about level from 2028 to 2031 (2028 at most 15% below the peak) and fall after.
- 2027 is lower: half a year lies before automation and the factor is flat below one year.
- Slow-fuse hazards peak for 2030–2031.
- Where the `after` rate is far below today's (moderate pandemics 0.5% against 2.2%, war 0.5% against 1.6%), early automation lowers five-year risk because the old research's safer world comes sooner.

Existential catastrophe (middle 0.2): 0.29, 0.28, 0.25, 0.22, 0.20, 0.16 and 0.12 for 2027, 2028, 2030, 2032, 2035, 2040 and 2050.

## 6. Response to the check

Must-fix 1 to 4 are done; 5 and 6 were the engine's. I re-read Metaculus from the embed data and recomputed the thread without the duplicates.

Judgment calls adopted:

1. **`afterShare`.** In effect. The figures are 0.9, 0.8, 0.7, not 0.7, 0.3, 0, because the share now fades (half the weight) and 1.5 years of the old window moved after automation. Five-year `cyberOutage` for 2028–2031 is 1.02, 1.09, 1.03, 0.98; the check's row was 1.03, 1.02, 1.01, 1.01.
2. **Existential.** On the odds, 1.6, 1.35, 1.15 give 0.29, 0.25, 0.22 at 0.2; the check's 1.4, 1.25, 1.10 gave 0.28, 0.25, 0.22. All tagged `guess`.
3. **Low ends** of 0.6 at one year and **high ends** of 1.2 or more at 20 and 30 years.
4. **Dilution** divided out. War and nuclear now fall to about 0.8, not 0.5.
5. **`paymentsOutage`** 0.75 and 0.5.
6. **`turbulentYears`** 3.5, and `runUpYears` 2 so that the reference reader's ramp starts at 2027.

Changed otherwise or declined:

- **`gridLong` at one year** is 2.3, not 2.0. I adopted the principle (between `cyberOutage` and war at every lead); both neighbours rose.
- **One-year factors rose** (unasked): compression is now 3.5 into one. `cyberOutage` 2.3 → 2.9. Three-year factors fell (1.5 → 1.3), since the old tail now sits after automation.
- **Coup figures**: I kept the conditional ratios, state the condition, and shade the result up.
- **3.5 years from AGI to automation** kept, for the reason in section 2.
- **Run-up and turbulent period growing with the lead**: I think they should. The rule is in `openQuestions`.

## 7. Least sure

1. `afterShare` at one to five years. It rests on the old five-year window and a discount of mine, and decides the result for 2027–2031.
2. Every factor at one year.
3. The 3.5 years from AGI to automation, which sets the reference, the tail and the compression.
4. Long leads: whether a slower pace spreads risk or removes it, and the sign for war.
5. The existential reference at eight years, and odds ratios carried from sources at 35–67% down to 0.2 and 0.01.
6. Buenos Aires: no factor varies by place.

## 8. Not opened

The EA Forum copies of Lifland's thread and Dickens's post (429). RAND's history of US synthesis-screening policy (the fetch tool refused it). Google's 2024 memory-safety post (read via The Register). The Verizon and M-Trends 2026 reports (read via Tenable and Google's blog). The RAND report by Burdette and Demelash (read via MIT's summary). The second half of "Preparing for the Intelligence Explosion". AI 2027's slowdown ending. Wood Mackenzie's transformer survey. Full list in the JSON.
