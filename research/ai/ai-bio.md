# ai-bio: how advanced AI changes pandemic probabilities

Assignment `ai-bio`, kind `ai`. Two hazards, `pandemicModerate` and
`pandemicSevere`, location `all`. Today is 19 November 2026.

Three sections, as the brief requires: what sources say, what I infer, what is
my own guess.

## 1. What the sources say

**Forecasting Research Institute, *Forecasting LLM-enabled biorisk and the
efficacy of safeguards*, 1 July 2025** (Williams, Righetti, Rosenberg, …,
Karger, Tetlock; 46 biosecurity/biology experts, 22 superforecasters; survey
fielded November 2024 – February 2025). I read the PDF page by page. The
question: "What is the likelihood that a human-caused release of a pathogen
occurs in 2028, and leads to at least 100,000 deaths in excess mortality or $1
trillion in damage within 3 years?" Median expert **0.3%** (IQR 0.01–2%);
median superforecaster **0.38%** (IQR 0.1–1.21%). Conditional medians, read off
Figure 2 (experts / superforecasters): AI matches the top of five expert
virologist teams on the VCT **1.5% / 0.7%**; 90% of long-form biothreat
responses preferred to experts' **0.84% / 1.05%**; an RCT showing AI enables
50% of non-experts to synthesise influenza **1.25% / 1.5%**; three capabilities
combined **2.3% / 3%**. Mitigations matter as much as capabilities: proprietary
models with strict anti-jailbreaking plus *legally mandatory* nucleic-acid
screening cut the expert conditional from 1.25% back to **0.4%**, near
baseline; screening alone removes 0.35 pp.

The timing result is the one that should move a reader. The median expert gave
the VCT top-team threshold **14% by 2026**, most likely year 2030
(superforecasters 2% and 2034). FRI's own baselining study with SecureBio then
found o3 already comparable to the top team, and they judge the long-form
threshold "very likely" met too.

**XPT (2022, 169 forecasters)**, read through the EA Forum bot mirror. A
genetically engineered pathogen killing >1% of the population in five years, by
2100: superforecasters **4%**, biorisk experts **10.25%**. Non-engineered:
3.63% / 8.14%. Catastrophe (≥10% of humanity): 0.8% / 3%. Extinction
(population <5,000): 0.01% / 1%. The catastrophe and extinction questions were
excluded from the main tournament for information-hazard reasons and asked in a
separate survey. 80,000 Hours' problem profile (updated 16 October 2026) calls
these "perhaps the best estimates" and sets Ord's *Precipice* figure of ~3%
existential risk from engineered pandemics by 2120 against Millett and
Snyder-Beattie's 0.00019%/yr.

**Capability evidence, 2025–26.** o3 scored 43.8% on the VCT against 22.1% for
experts in their own domains. Anthropic's September 2026 threat report
describes five biological cases between December 2025 and August 2026
(chikungunya gain-of-function, H5 mammalian adaptation, an orthopoxvirus grant,
two toxin-design cases), one assessed as part of a state-supported programme,
and says evaluations "clearly showed" Opus 4 and Sonnet 4.5 were "well below
the threshold where they could meaningfully assist a sophisticated user" but
that for current models "the evidence is no longer certain, and we cannot make
that same assurance." Its August 2026 post says Fable 5 "could provide
significant uplift" to a malicious actor. The International AI Safety Report
2026 (as summarised by Stephen Turner, 3 February 2026) reports that OpenAI,
Anthropic and Google DeepMind all shipped models with heightened safeguards
because they could not rule out meaningful novice assistance, and that 23% of
the best biological AI tools have high misuse potential, 61.5% of those fully
open source, 3% of 375 tools carrying any safeguards at all.

**Evidence the other way.** RAND's January 2024 red-team found "no
statistically significant difference in the viability of plans" with or without
an LLM. The Active Site randomised wet-lab trial — 153 novices, eight weeks,
$1.9M, reported by METR in February 2026 — found AI "did not produce a
significant effect on end-to-end success across the three core tasks together."
That trial tested, in the real world, the scenario that moved FRI's
superforecasters most. Ben Ouagrham-Gormley (GJIA, August 2026) gives the tacit
-knowledge case; Berke and Relman (Bulletin, July 2026) give the practical one;
Narayanan and Kapoor argue bioterror "is not an AI risk any more than it is an
internet risk" and that defender access often improves the balance.
Counterweight: RAND's Brent and McKelvey (December 2025) say tacit-knowledge
arguments "may create a false sense of security."

**Threat models.** Esvelt (UnHerd, 9 October 2026): a model able to design
immune-evasive pathogens is "likely to be trained within a few years"; "a
reactive vaccine strategy is nearly useless against anyone capable of
continually releasing new pandemics"; defend with stockpiled protective
equipment, far-UVC and glycol vapours, and mandatory synthesis screening.
Amodei (January 2026): "an asymmetry between attack and defense in biology,"
uplift "perhaps doubling or tripling the likelihood of success," mirror
bacteria "in the next one to few decades" and in the worst case destroying all
life. AI 2027's race branch has an AI releasing "a dozen quiet-spreading
biological weapons in major cities" in mid-2030. AI Futures' August 2026 update
has reality at "roughly 70–90% the speed of AI 2027."

## 2. What I infer

Two inference steps carry everything.

**(a) From ">100,000 deaths, human-caused" to the model's hazards.** FRI's
threshold is far below both model hazards: a 100,000-death regional outbreak
may not open a single window for a household in Buenos Aires. So I need the
share of such events that escalate. Among the real post-1900 outbreaks above
100,000 deaths — 1918, 1957, 1968, HIV, 2009 H1N1, COVID-19 — roughly a third
reached COVID-scale global disruption, and a smaller fraction reached
several-percent fatality. I use **30%** reaching `pandemicModerate` and **12%**
reaching `pandemicSevere` now, raising the severe share to 20% during the
transition because deliberate releases in that period are selected for
severity. This is judgement calibrated on six events; it is the weakest joint
in the chain and is listed as an open question.

**(b) From capability thresholds to periods.** Of FRI's five scenarios, the two
knowledge benchmarks are met (VCT, long-form). The three *human-uplift*
scenarios are not: the biggest was tested directly and came back null. So the
"now" human-caused rate should sit between the superforecasters' VCT-only
conditional (0.7%) and the experts' (1.5%), shaded down for the null RCT:
**0.8%/yr**. During the transition, AGI by definition clears all five
thresholds, and automated laboratories dissolve the wet-lab bottleneck that the
null result rests on; FRI's three-capability conditional was already 2.3–3% on
2026-era evals, so **6%/yr** is a modest extrapolation.

Arithmetic for `pandemicSevere`:

- baseline = natural 0.25%/yr (between Marani's 1918-intensity 0.27–1.9%/yr and
  the XPT-implied 0.05–0.11%/yr) + 0.03% pre-LLM human-caused ≈ **0.3%**
- now = 0.3% + (0.8% × 0.12) ≈ **0.45%**, i.e. about 1.5× baseline
- transition = (6% × 0.20) + 0.2% natural + 0.2% accident ≈ **1.5%**
- after = **0.1%**, a third of the natural baseline

For `pandemicModerate`: baseline 2.0% (Marani's 0.6%/yr lower anchor, Metabiota's
2.5–3.3% upper); now 2.0% + (0.8% × 0.30) ≈ 2.2%; transition 2.0% + (6% × 0.30)
≈ 2.8%, net of better detection; after 0.5%.

Two cross-checks. Metaculus shows 3–10% for an engineered pandemic infecting a
billion people within five years of AGI; my 1.5%/yr is about 7% over five
years, in the middle of that. And 1.5%/yr with roughly a fifth reaching ≥10% of
humanity gives 1.5% over the transition for a catastrophe — above the
superforecasters' whole-century 0.8% and consuming half the experts' 3%, which
is what "risk concentrates in the transition" should look like.

**Range ends.** `lo` is the sceptic's considered view: the XPT superforecasters'
natural rate, RAND 2024 and Active Site showing no uplift, Ben Ouagrham-Gormley
on tacit knowledge, Narayanan and Kapoor on downstream defence, and FRI's own
finding that mandatory screening plus strict safeguards return the number to
baseline. `hi` is Esvelt, Amodei, Brent and McKelvey, and the AI 2027 branch.

**survivableShare (pandemicSevere) = 0.85.** XPT implies an
extinction-to-catastrophe ratio of 1% (superforecasters) to 33% (experts), and
`pandemicSevere` is a lower bar than their ≥10% catastrophe, so the unsurvivable
fraction of it is smaller still. I then remove two transition-specific branches
in which no household measure helps: AI takeover using pathogens (AI 2027: "the
few survivors (e.g. preppers in bunkers…) are mopped up by drones") and mirror
life. Period-weighted: ~0.97 baseline and now, ~0.70 during the transition,
~0.8 after. `pandemicModerate` is 0.99 by construction.

## 3. What is my own guess

The 12% and 30% escalation shares; the 6%/yr transition rate for human-caused
epidemics; the 0.2 pp/yr lab-accident contribution; every `after` number; and
the period weights inside survivableShare. All are tagged `guess` or `derived`
with the step shown. No source gives an annual probability for either model
hazard directly, so there is no `data` tag on any of the eight rates.

**Offence–defence through the transition.** My reading of the sources is that
offence leads for a bounded period and defence wins afterwards *conditional on
getting through*. FRI's mitigation result is the strongest quantitative evidence
that defence can work — but note it requires *legally mandatory* screening,
which does not exist, and it addresses only lone-actor misuse. It does nothing
about state programmes or about accidents in accelerated research, which is why
the `lo` ends should not be read as "safeguards solve it."

**For the household, the probability shift is not the main finding.** AI moves
`pandemicSevere` by about 1.5× now and perhaps 5× during the transition. What
it changes more is *warning time*. A natural pandemic is seeded once and
announces itself abroad: COVID-19 gave most households six to ten weeks. A
deliberate release can be seeded in many cities at once, so warning falls to
days, `lateBuy` for respirators and filters falls close to zero, and the leave
option is worth little because the destination is infected too. Multiple or
sequential agents (Esvelt) fatten the tail of window lengths and may mean no
countermeasure ever arrives. At several-percent fatality across ages,
absenteeism in trucking, pharmacy and water treatment lengthens the food,
medication and payments windows and can open a water window that COVID-19 never
opened. Those are the parameters the ranking should feel, and they are set out
in the `notes` field of the `pandemicSevere` entry.

## Sources I could not open

Listed in full in `blockedSources`. The material ones: all Metaculus URLs (403,
as in step 2), so current community predictions are search snippets, undated,
and tagged accordingly; the EA Forum post on XPT biorisk (429, read through its
bot mirror); Coefficient Giving's AI-biosecurity scale-up post (403); Axios on
the 2026 US threat assessment (403); samotsvety.org (connection refused, and
archive.org is not reachable from this tool); the Claude Fable 5 / Mythos 5 and
OpenAI GPT-5.6 system cards; and the Active Site preprint itself, cited through
METR. The FRI PDF exceeded the fetch limit at one host and was read page by
page at another; its per-scenario medians are plotted chart labels, not table
values.
