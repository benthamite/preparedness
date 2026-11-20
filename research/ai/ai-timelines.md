# AI timelines, the shape of the transition, and the value of preparing

Assignment `ai-timelines`. Sources read on 19 November 2026.

**Conventions.** A cumulative probability "by 2030" means by 31 December 2030. "Verified" means the figure was read on a fetched page, by me or by one of three research agents I briefed; I re-read seven of their figures and all matched. The fetch tool passes pages through a summarising model and caps quotations at about 125 characters. Only the AI Impacts 2024 paper was read as raw pages. Check every quotation against its original before print. All URLs are in the JSON.

## Part 1. Timelines

### What sources say

Timelines shortened through 2026. On 5 November METR reported that Anthropic's capability progress is running at about twice its 2024–25 rate, "perhaps ≈80%" of that due to AI, with most of the evidence redacted. That report caused the largest revision of the year.

| Source | Milestone; match to the brief's AGI | Latest figure | Movement |
|---|---|---|---|
| AI 2027, as published (Apr 2025) | Scenario: superhuman coder Mar 2027, superhuman AI researcher (SAR, ≈ AGI) Aug 2027, ASI Dec 2027 | One trajectory, not a median. Superhuman-coder medians then: Lifland 2030, Jurkovic 2028, FutureSearch 2033 | — |
| AI Futures Project, 10 Nov 2026 (Lifland, Halstead, Kokotajlo, Dean, "Thomas", "Lukas") | SAR; exact match | "All of us forecast that [SAR] will likely arrive at some point in 2027 (assuming no substantial deliberate slowdown)". SAR medians: Kokotajlo May 2027, Lifland Aug 2027. 35–65% for top-expert-dominating AI before 2028. Model outputs: 63–65% SAR by end-2027, 84% by end-2028, ≈92% by 2040 | See below |
| Daniel Kokotajlo | AGI median | 2029 (2021) → 2027 (Dec 2022–Jan 2025) → 2028 (Apr 2025) → end-2029 (Aug 2025) → Dec 2030 (Jan 2026) → SAR Dec 2028 (Aug 2026) → SAR May 2027 (Nov 2026) | Lengthened in 2025, shortened three times in 2026 |
| Eli Lifland | AGI median | 2050 (2022) → 2031 (Apr 2025) → 2035 (Nov 2025) → mid-2032 (Aug 2026) → Sep 2028 (Nov 2026) | Same pattern |
| Metaculus strong AGI (q5121) | Adds robotics; omits autonomous research | 6 Jun 2030; 1.9k forecasters. Quartiles ≈ Feb 2028 and Mar 2036, **unverified** (search snippet) | Mid-2030 in Feb 2025; a secondary page reports Jan 2033 in July 2026 (unverified) |
| Metaculus weak AGI (q3479) | Easier test set; weaker | 17 Aug 2027; 1.8k forecasters | — |
| METR | 50% time horizon on software tasks; not AGI | Doubling every 196 days (2019–25), 131 days (post-2023), 89 days (2024 on). Mythos Preview ≥16 h (via press, unverified); "Measurements above 16 hrs are unreliable" | Page frozen 8 Sep 2026 |
| Ajeya Cotra | Transformative AI, then AI R&D parity | Median 2050 (2020) → 2040 (2022; 15% by 2030) → early 2030 for AI R&D parity (Apr 2026, as cited by Greenblatt) → "a big update" on 6 Nov 2026, no number | Shortened each time |
| Ryan Greenblatt (Apr 2026) | AI R&D parity; close | 30% by end-2028; median early 2031 | Up from ~15%; pre-dates METR report |
| Epoch: Ege Erdil (Apr 2025) | Full automation of remote work; close | Median ≈20 years; ≈30% within ten. Erdil on Dwarkesh: "around 2045" | No 2026 revision found. Besiroglu on the November updates: "it'll be clear in a few years that this didn't happen" (secondhand) |
| Epoch models | GATE; Direct Approach (transformative AI) | GATE: "most tasks within two decades", explicitly not a forecast. Direct Approach page: median 2029, 85% by 2050, "not ... the authors' all-things-considered views" | No staff-wide forecast exists |
| Samotsvety (Jan 2023) | Adversarial Turing test; weaker | 31% by 2030, 63% by 2050, 81% by 2100 | No update found |
| AI Impacts ESPAI 2024 (fielded Dec 2024; 1,580 researchers) | HLMI: every task incl. physical; stricter | 10% by 2027, 50% by 2042. Full automation of labour: 50% by 2098 | HLMI 50% year: 2059 (2022) → 2047 (2023) → 2042 |
| XPT (2022) | "Bostrom affirms AGI"; loose | Superforecasters 1% / 20.5% / 74.8% by 2030 / 2050 / 2100; domain experts 9% / 46% / 87% | FRI (2025): superforecasters gave 9.7% on average to the AI progress that then happened |
| FRI LEAP Wave 8 (Apr–May 2026) | 90th-percentile professional in every non-physical job at ≤5× cost; closest definition, later by construction | 80% before 2100; conditional median 2047 (superforecasters), 2050 (experts); 25th percentile 2036, 2039 | Pre-dates METR report |
| Lab leaders (claims) | — | Amodei: "as little as 1–2 years away" (Jan 2026); 90% within ten years (Feb 2026). Altman: goal of "a true automated AI researcher by March of 2028" (press). Hassabis: "five to ten years" (2025) → "a few short years" (Jul 2026) | Amodei's near end slid a year; Altman unchanged; Hassabis earlier |
| Long timelines | — | Narayanan and Kapoor: no probabilities; impacts "on the timescale of decades". LeCun: "not ... next year or two years from now". Karpathy: "about a decade" (Oct 2025). Hanson: median ≈2150 (2023). Dwarkesh Patel: median 2028 for automated AI researchers (13 Nov 2026); in June 2025 his 50/50 date for human-like on-the-job learning was 2032 | Patel left this camp |

Reactions to the November report from careful people who did not adopt 2027: Zvi Mowshowitz, "an SAR in 2027 is under 50% to happen, but not so far under"; Toby Ord reportedly cuts the speed-up to 1.4× (secondhand); Lifland himself notes "a nagging feeling that the update feels so large without being based on commensurate evidence".

### What I infer

**Extrapolating METR's trend.** From ≥16 hours in March 2026, a one-work-month horizon (167 h) needs log₂(167/16) = 3.4 doublings and a work-year (2,000 h) 7.0. At 89, 131 and 196 days per doubling: a month by January 2027, June 2027 or January 2028; a year by November 2027, September 2028 or December 2029. Kokotajlo's requirement for an automated coder is an 80% horizon of one year. The Mythos preview's 80% horizon was 3 h 6 min (FRI citing METR), so that needs log₂(2,000/3.1) = 9.3 doublings: June 2028, July 2029 or March 2031. A plain exponential therefore gives 2028–2031 for the step before AGI. The 2027 forecast rests on measured acceleration, not on the trend.

**Where the centre is.** Among the brief's weighted sources, the median for AGI moved in November from about 2029–2031 to about 2027–2029. Metaculus (2030) and the panels surveyed before the report (LEAP 2047–2050) have not followed, or have not been re-asked.

### Presets (my construction)

| Preset | 2027 | 2028 | 2030 | 2035 | 2040 | 2050 | Anchor |
|---|---|---|---|---|---|---|---|
| Short | 0.60 | 0.78 | 0.86 | 0.91 | 0.93 | 0.95 | AI Futures Project, Nov 2026 |
| Middle | 0.22 | 0.34 | 0.52 | 0.74 | 0.83 | 0.90 | Metaculus strong AGI; Greenblatt |
| Long | 0.02 | 0.04 | 0.08 | 0.22 | 0.35 | 0.52 | LEAP Wave 8; ESPAI 2024; Erdil |
| Not this century | 0.001 | 0.002 | 0.005 | 0.015 | 0.03 | 0.07 | Hanson; normal-technology view |

- **Short** follows the published model outputs (63–65% by end-2027; 84% by end-2028; 90th percentile ≈2034). I shaded 2027–28 by a few points because the forecast is conditional on no slowdown. The size of the shading is a guess.
- **Middle** is the Metaculus median with the unverified quartiles, checked against Greenblatt (0.30 by 2028; 0.49 by 2030). The 2040 and 2050 values are my extrapolation.
- **Long** takes LEAP's quantiles at 0.8–1.0× (it is unclear whether they are conditional on arrival before 2100), giving 0.20–0.25 by 2036–39 and 0.40–0.50 by 2047–50, and sits between that and Erdil (0.30 by 2035). Values before 2035 are guesses.
- **Not this century** is my quantification of Hanson's "pretty sure it won't be in the next thirty years" and median ≈2150. No sceptic publishes a curve.

## Part 2. The shape of the transition

### What sources say

**AGI to ASI.** Davidson (2023): "My best guess ... is less than 1 year"; from 20% to 100% automation, about 3 years, with ≈25% under one year and ≈80% under ten. AI 2027 takeoff forecast: SAR to ASI in two steps with medians of 0.3 and 0.16 years, and intervals running past 50 years. Lifland (Dec 2025): automated coder to ASI in under one year 30%, under three years 60%. Davidson and Houlden (2025): ≈60% that more than three years of AI progress is compressed into one. Aschenbrenner: "perhaps in less than one year". Against: Erdil and Barnett call a software-only singularity "an unlikely outcome"; Narayanan and Kapoor reject fast takeoff.

**Length of the dangerous period.** No source states a window. AI 2027's bad ending is settled about three years after SAR; its good ending has superintelligence eight months after SAR and "Transformation" by 2029. MacAskill and Moorhouse: "a century of technological progress in a decade". Hanson: a transition lasting "roughly a decade". GATE: gains "over roughly a decade".

**When each danger peaks.**
- Misuse: already arriving. Anthropic could not rule out its bioweapons threshold in May 2025. OpenAI rated models High for biology (July 2025) and cyber (July 2026). Mythos Preview finds and exploits zero-days "in every major operating system". Amodei: models "may already be ... doubling or tripling the likelihood of success".
- War: Hendrycks, Schmidt and Wang say mutual sabotage "already describes the strategic picture". RAND finds war unlikely in absolute terms, and preventive attack "relatively more likely" to preserve an AGI monopoly than to prevent one; I read that as placing the risk after one side has AGI. Metaculus: 4% for a world war within five years of AGI (66 forecasters).
- Loss of control: between AI R&D automation and just after ASI (AI 2027; Aschenbrenner; 80,000 Hours' summary of Cotra: "maybe 12 months").
- Coups: "AI capabilities are currently too limited" (Davidson, Finnveden and Hadshar); by my reading the risk arrives with AGI.
- Economic upheaval: starts before AGI (Amodei: half of entry-level white-collar jobs "in the next 1–5 years") and runs a decade or more on the slow view.

### What I infer

Five years is defensible as a single window. Davidson gives about 50% to a takeoff under three years and 80% under ten; interpolating on a log scale puts about 63% under five (0.5 + 0.3 × ln(5/3)/ln(10/3)). It hides two things. On fast-takeoff views most of the loss-of-control and war risk falls in the first one to three years. On slow views there is no discrete window. Misuse and economic risk start before AGI.

### My guesses

- `transitionYears`: 5 (2 to 12). The low end is the fast-takeoff view, the high end the slow one.
- `shareOfRiskBeforeAGI`: 0.15 (0.05 to 0.5). Arithmetic: share = Y / (Y + 5k), with Y the ramp-weighted years before AGI and k the ratio of transition to current annual risk. LEAP Wave 9 suggests k ≈ 5–10 (experts' AI catastrophe by 2030: 1% under rapid progress, 0.08% under slow). Y = 1.5, 6, 25 for the short, middle and long presets gives 3–6%, 11–19%, 33–50%. The model should compute this from the timeline.
- `agiToAsiYears`: 1.5 (0.3 to 10).

## Part 3. What cuts the value of preparing short

### What sources say

**Existential catastrophe given AGI.**

| View | Figure |
|---|---|
| XPT superforecasters (2022) | 0.38% AI extinction by 2100, unconditional; "more than quadruple" given AGI by 2070 |
| Metaculus | 1% extinct five years after AGI (169 forecasters); 2.5% extinct by 2100 from any cause |
| Good Judgment superforecasters (2023) | 6% by 2200 given AGI by 2070 |
| AI Impacts 2024 | Extinction or severe disempowerment: median 10%, mean 18.2% |
| Ord | 20% given AGI this century |
| Christiano (2023); Shulman; Scott Alexander | 22% takeover; "one in four or one in five"; 20% |
| Samotsvety (2022) | 38% given AGI by 2070; 23% in its less-engaged subset |
| Kokotajlo; Mowshowitz | 70%; 60% |
| Yudkowsky | No number; death "the most likely result" |
| Narayanan and Kapoor | Decline: such forecasts are "far too unreliable" |

Christiano in November 2026, via press: about 10% takeover risk in the next year.

**Non-existential AI catastrophe.**
- XPT, more than 10% of humans dead within five years, by 2100: superforecasters 2.13%, experts 12%.
- LEAP Wave 9 experts: 2% by 2100 under slow progress, 10% under rapid. An AI-driven event with 50 deaths or $100 billion by 2050: experts 62%, superforecasters 70%.
- Metaculus: AI malfunction with 1,000 deaths or $200 billion before 2032, 72% (55 forecasters). If an AI catastrophe occurs, a 95% population fall: 25%.

**The world after.** Metaculus forecasters expect, five years after AGI, 6.03% growth, 6.47% in extreme poverty and 8.78 billion people (17–41 forecasters each).

### What I infer

Per year, with p = 1 − (1 − P)^(1/n):
- Survivable 10% die-off: XPT superforecasters (2.13 − 0.38 = 1.75% over 78 years) 0.023%; experts (9%) 0.12%; Metaculus (0.40 × 0.43 × 0.75 = 12.9% over 73 years) 0.19%.
- Large incident somewhere: LEAP 3.9–4.8% a year; Metaculus 22%. They conflict; LEAP has the larger panel.

`shareSurvivable` at the 10% threshold is 75% (XPT experts, 9/12; Metaculus, 1 − 0.25) to 82% (superforecasters). For a highly concerned view, 0.25 survivable against 0.7 existential gives 0.26.

### My guesses

- `pExistentialGivenAGI`: 0.2 (0.01 to 0.8). The ends are others' stated views; the middle is my reading of the 10–25% cluster.
- `shareSurvivable`: 0.7 (0.25 to 0.95).
- `pOrdinaryHazardsRecedeWithinTransition`: 0.1 (0.02 to 0.5). The Metaculus pools imply ordinary hazards persist five years on.

## Problems

- The short preset rests on a nine-day-old update built on redacted evidence.
- Metaculus pages and API returned 403. Only the embed pages loaded: estimate and forecaster count, no quartiles or criteria.
- The AI Futures Project's forecast tables are images. I have each author's medians from the text, not their distributions. Two authors are known to me only by first name.
- METR's Mythos figure, Altman's and Hassabis's 2026 statements, Christiano's November figures, and the Ord and Besiroglu critiques come from secondary reports.
- Not opened: web.archive.org, archive.ph, x.com, the XPT report PDF, goodjudgment.com, samotsvety.org, openai.com, Axios, Forbes, the Mythos system card, the AAAI report.
- No number exists for Cotra's current timeline, Epoch staff as a group, Yudkowsky, LeCun, or Narayanan and Kapoor.
