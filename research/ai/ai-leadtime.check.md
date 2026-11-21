# Check of ai-leadtime

Independent check, 20 November 2026. I read the brief, MODEL.md section 9, the five sibling files, the two new files, and the engine as committed. Model figures are US, middle values, five-year horizon.

## 1. Claims marked verified

I re-fetched 31 pages, and every quoted figure matched: Lifland's thread (raw poll data from LessWrong's API), the four Metaculus pages, Greenblatt, MacAskill and Taylor, both FRI reports, NIST and the White House memorandum (PDF text), Greenwood, Kansas City Fed, The Register, Davidson, AI 2027, and sixteen others. Not re-checked: CEPI, Biodefense Commission, DORA, EU AI Act, non-proliferation treaty, Garfinkel and Dafoe, Murphy and Stone, Narayanan and Kapoor, MIT's RAND summary.

Four problems of context, none a misquote:

- **Metaculus 12840.** The embed page's HTML holds all five windows; nothing is blocked. Arrival 2022–2024: 20% (56 forecasters; a dead window, since no AGI arrived). 2025–2029: **40%** (79). 2030–2039: 30% (100). 2040–2059: **17%** (99). 2060–2099: 11% (99). The file's inference that 50% belongs to 2025–2029 is wrong; Dickens's 50% dates from July 2025. The question resolves on a fall of more than 95% in world population from AI within 25 years of Metaculus's strong AGI, so it is not "the same question" as Lifland's.
- **Lifland's thread.** Medians are exact (84.5, 74, 65, 46, 34.5). Two people answered twice (Kokotajlo, who says so in a comment, and Sharmake). Without the duplicates: 83, 70, 63, 45, 34. Two of the 37 who answered every window rise after the second (sbowman, weeatquince), so "all point the same way" needs "almost".
- **Greenblatt.** His lead time is time bought for safety work at the critical moment (by agreement, government or a lead over rivals), not years until AGI, and his 38% is his overall view. Anchoring a one-year lead on plans D and E is an analogy, and multiplying the ratio by 1.15 has no basis.
- **MacAskill and Taylor.** The coup figures (22%, 10%, 7%) are conditional on US dominance, whose chance also falls (the US winning the race: 95%, 80%, 50%). The unrest factor uses the conditional ratio.

## 2. Arithmetic

Reproduced: the thread ratios (1.06, 0.93, 0.66), Greenblatt and Finnveden (1.12, 0.83, 0.60), Greenblatt's 38% and 52%, the unrest blend (0.57 and 0.42), the reference (2028.5 + 3.5 = 2032), every product of compression, unpreparedness and lag, the existential chances by year (0.31 to 0.13), and section 5's table under the JSON's `afterFactors`.

Wrong or inconsistent:

- Metaculus ratios (must-fix 1).
- Windows are mapped to lead times by adding "four to five years"; the file's own gap is 3.5. No factor moves by more than 0.01.
- Compression is "about 3" at one year, where five years into one is 5. So the file assumes, without saying so, that a one-year transition carries about 60% of the cumulative excess of a five-year one. This drives point 6.

## 3. Mechanisms and shape

The directions are defensible and the ordering across hazards mostly follows the mechanisms (software hazards gain most from time, war and fraud least). Specific objections:

- `gridLong` at one year (2.5) is the highest factor in the file, above `cyberOutage` (2.3) and `greatPowerWar` (1.6), though its mechanism ties the physical route to war. Beyond eight years the file places it between the two.
- Factors from eight years on include "dilution" (0.9, 0.78, 0.65, 0.57) for a transition longer than five years, but the engine keeps five turbulent years and a three-year run-up. The excess is therefore removed, not spread. Result: a reader who gives 2038 gets `cyberOutage` at 0.14% against 0.10% today, and from 2040 no AI effect at all in the next five years. The researcher lists this as an open question; it should be settled before release.
- `paymentsOutage` falls fast (0.65 at eight years) on one vendor's record with new code. Core banking systems last decades, and the file's own evidence shows patching getting slower.
- War and nuclear factors fall to 0.5 at thirty years though the file calls the sign unclear. Almost all of that fall is the dilution.

## 4. Tags and ranges

No value is tagged `data`, and all hazard factors are tagged `guess`, which is honest. The products of compression, unpreparedness and lag are back-fitted (lags of 0.57, 0.61, 0.82), not derivations.

- The four existential factors tagged `derived` (5, 12, 20, 30 years) rest on a guessed mapping from windows to lead times, a guessed reference at eight years and an unstated weighting of three sources. The middle at five years (1.15) is above all three corrected anchors (1.04–1.06, 1.12, 1.12). Tag them `guess`.
- Low ends of exactly 1.0 at one year (`cyberOutage`, `gridLong`, `paymentsOutage`, `commsOutage`) say with 95% confidence that a short lead cannot lower the yearly excess. Open models trail by four to seven months, which is half of a one-year window.
- High ends of 0.9 to 1.0 at twenty and thirty years for the software hazards rule out Kokotajlo's fast late takeoff and a larger attack surface, both of which the file itself raises.
- `afterShare` in `data/config.mjs` is three bare numbers with no range, tag or basis. The researcher calls it the weakest guess in the file.

## 5. Reference lead time

Five years is a fair reading of the five files; anything from 5 to 6.5 is. The weak link is the 3.5 years from AGI to full automation, which sits above all three figures cited for it and far below slow-diffusion views.

One inconsistency matters. With AGI 3.5 years before automation and five turbulent years ending at automation, the full transition rate starts 1.5 years before AGI. For a 2032 reader all of 2027 is at that rate: `cyberOutage` at ten times today's, on figures that assume AGI-level offence in many hands. The run-up lies wholly or partly in the past for any year up to 2034, so those readers start 2027 well above today's rate, the one rate that is observed.

## 6. The two engine changes

**Rate after automation = after + (transition − after) × s(L).** Sound in form, and needed: the JSON's factor of 3.4 gave `cyberOutage` 0.10% after automation where "40% of the way" is 0.42%. Three problems as committed:

- The year of automation is counted as wholly after it. For 2027 the one-year factors are never used; for 2028 they cover one year, not one and a half.
- s never ends. Over a fifteen-year horizon a 2027 reader gets `cyberOutage` at 0.42% in every year, fourteen times the `after` rate.
- At 0.4 and 0.15 the five-year risk falls the sooner automation comes, against the brief's premise:

| `cyberOutage`, % a year, by year of automation | 2027 | 2028 | 2029 | 2030 | 2031 | 2032 |
|---|---|---|---|---|---|---|
| Engine as committed | 0.42 | 0.68 | 0.79 | 0.86 | 0.90 | 0.97 |
| Boundary year split | 0.59 | 0.85 | 0.93 | 0.98 | 1.01 | 0.96 |
| Split, and s = 0.7, 0.3 | 0.86 | 1.03 | 1.02 | 1.01 | 1.01 | 0.96 |

**Existential chance spread over turbulent years from 2027.** Sound: the risk is tied to events that all lie ahead. Two notes. For 2027 or 2028 the whole chance (about 0.3 at middles, 0.45 at averages) falls in the first six to eighteen months, before automation; AI 2027 puts takeover a year after people become obsolete. And the factor should act on the odds, as the researcher says: 0.8 × 1.6 is capped at 1.

## Must fix

1. **Metaculus.** 2025–2029 is 40%, not 50%; 2040–2059 is 17%. Against 35.7% at eight years the ratios are 1.12 (not 1.25), 0.84 (not 0.75), 0.48 at about 28 years and 0.31 after 2060. Describe the question as a 95% fall in population, drop "the same question", and remove it from `blockedSources`.
2. **Thread.** State that two respondents are counted twice; without them the medians are 83, 70, 63, 45, 34 and the ratios 1.04, 0.94, 0.67.
3. **Greenblatt anchor.** Use 1.38, the ratio to his own average, not 1.38 × 1.15 = 1.59.
4. **Section 5 and "After automation" in the .md** describe `afterFactors`, which the engine no longer uses. New figures for 2028 and 2030: `cyberOutage` 0.68 and 0.86 (not 0.47, 0.82); `paymentsOutage` 1.60 and 2.07 (not 1.06, 1.98); `greatPowerWar` 2.40 and 3.08 (not 2.06, 3.03). Remove `afterFactors` from the JSON and give s as triples with tag and basis.
5. **Engine: boundary year.** Split the year of automation between the two regimes (second row of the table).
6. **Engine: end s.** Apply it only to years before 2027 plus the reference lead (2032), or let it decline to zero over about five years.

## Judgment calls I would change

1. s: 0.7 (0.2–1) at one year and 0.3 (0.05–0.7) at three, so that five-year risk does not fall as automation gets sooner. No evidence bears on this either way.
2. Existential factors: 1.4, 1.25, 1.10 at one, three and five years (now 1.6, 1.3, 1.15). Act on the odds, and spread the chance over at least three years.
3. `gridLong` at one year: 2.0.
4. Low ends at one year for the four software and power hazards: 0.6. High ends at twenty and thirty years for payments, communications and power: 1.2.
5. Let the run-up grow with the lead (three years up to a lead of five, about five at twelve, ten at thirty), or divide the dilution out of the factors from eight years on.
6. `paymentsOutage`: 0.75 at eight years and 0.5 at twelve.
7. Start the ramp at 2027, where today's rate is observed, or set `turbulentYears` to 3.5 with the remaining 1.5 years after automation. Either removes the step at 2027.
