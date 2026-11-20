# radiation: reasoning

Six entries and the `fallout` channel. One entry matters: the shelter plan. The rest are small.

## Assumed from others

The nuclear researcher supplies the chance that fallout lands on the household and the unsheltered 14-day outdoor dose D. I assumed their `fallout` exposure is the mean over unprepared households, some of whom go outside. If they assumed everyone stays in, cut the plan's fraction to about 0.35.

## Channel: from dose to deaths

**Decay.** Dose rate falls as t^-1.2 (Kearny: 1000 R/h at 1 h, 100 at 7 h, 10 at 2 days, 1 at 2 weeks). Dose between hours a and b is 5 × R1 × (a^-0.2 − b^-0.2). With arrival at hour 1, D = 3.44 × R1, and the share received is 57% by 12 h, 68% by 24 h, 78% by 48 h, 84% by 72 h, 93% by day 7. Arrival at 15 minutes: 78% by 24 h. Arrival at 4 h: 51%.

**Share of D avoided by staying in**, then living unshielded in the same area to day 14 (arrival at hour 1):

| PF | 24 h | 48 h | 72 h | 14 d |
|---|---|---|---|---|
| 3 (light-frame house) | 46% | 52% | 56% | 67% |
| 10 | 62% | 71% | 75% | 90% |
| 20 (house basement) | 65% | 75% | 79% | 95% |
| 100 (core of large block) | 68% | 78% | 83% | 99% |

A household that leaves the area on coming out avoids about 1 − 1/PF after any stay of 24 h or more. The two-week stay matters only when there is nowhere clean to go.

**Protection factors** (read in LLNL 2009, LLNL 2022, FEMA 2010): light-frame house 3 (2–5); masonry house 10 (2.5–35); house basement 20 (7–150); ordinary rooms of a large apartment block 18 (5–94); core of middle floors 70 (20–300); underground car park or metro 200 (50–1,000); vehicle 1.7–2. About 70% of people in US houses and small apartment buildings, 87% in large blocks and nobody in mobile homes can reach PF 10 at home.

**Dose response.** LLNL 2009, no medical care: under 5% dead at 1–1.5 Gy, 5% at 2, 30–50% at 3, 95–100% at 6. Cancer: BEIR VII gives 479 (male) and 662 (female) deaths per 100,000 per 0.1 Gy, 5.7% per Gy; FEMA says 6–8% at 1 Gy. I use 6% (3–10%). These deaths come decades later; I suggest a weight of 0.4 (guess).

**The unprepared.** 2018 US surveys (about 2,000 each): 12% would evacuate quickly, 31% reunite with family first, 30% go deep inside; 64% had never seen advice. 2004 survey (n = 2,545): 59% would stay in as long as told, 11% leave at once. I take 30% (15–50%) with someone outdoors or in a car in the first hours: all who flee plus half who reunite. They receive about 0.25 of D, since 19–40% of D arrives in the first 1–4 hours and a car halves it at best. Of those indoors, 45% (guess) use the best-shielded spot.

Unprepared dose share = 0.3 × 0.25 + 0.7 × (0.45/PF best + 0.55/PF ordinary):

- light house with basement (3, 20): 0.075 + 0.7 × 0.206 = **0.22**
- light house, no basement (3, 4): **0.28**
- masonry house (8, 30): **0.13**
- large apartment block (18, 50): **0.10**
- mobile home (2): **0.42**

## Shelter plan

Executed correctly, everyone is in the best spot before arrival: dose share 0.05, 0.033, 0.02. Removed: 77%, 75%, 81%. A light house without a basement gains 11% from the central room, 38% if half such households reach a PF 10 building in time. Weighted 70:30 by LLNL's adequate-shelter share: 0.7 × 0.78 + 0.3 × 0.2 = **0.6** (0.25–0.85). Where D is 5–15 Gy the gain is larger, because 0.22 → 0.05 crosses the lethal threshold.

Adherence 0.7 (0.4–0.9): in the 2004 survey full cooperation rises from 59% to 74% when people know their family is somewhere prepared, which the plan arranges.

Check: Wein et al. (Washington DC, 10 kt) get 54,600 deaths among vehicle owners when 10% shelter in basements and 23,100 when 90% do, a 58% cut. My 0.6 × 0.7 = 0.42 sits below that. Cost: two hours. No outcome data exist; this rests on surveys and models.

## Potassium iodide

It blocks radioactive iodine in the thyroid and nothing else. CDC: it will not help after a detonation.

Adult (guess): fatal thyroid cancer about 100 per million per Gy (BEIR VII incidence 0.6% per Gy all ages, about 0.2% for adults, 5% fatal) against 60,000 for all cancers. If internal thyroid dose equals whole-body dose (Rongelap islanders, living outdoors and drinking open water, had about five times), thyroid deaths are 0.17% of cancer deaths. Times 85% blocked, times 55% of 15–59s under 40: **0.001** (0.0001–0.006). Child: three times the thyroid dose, ten times the risk per Gy, twice the all-cancer risk: **0.02**. The Rongelap ratio and child risk are from memory.

Adherence 0.5: modelled protection is 80% at 2 h after intake, 40% at 8 h.

Reactor accident (no hazard in the model): 1 in 100,000 a year that a home within 50 km gets a dose above the FDA threshold × 0.2 Gy averted × 1,000 micromorts per Gy for a child = 0.002 micromorts a year, a few cents, against $2 a year for the pack. The release frequency is my guess from two major releases in about 20,000 reactor-years, shaded down.

Price $12.95 for 14 tablets, read on anbex.com; stock dated July 2032.

## Geiger counter

GQ GMC-500 Plus, $124, read on the maker's site; range to 4.25 R/h. The dangerous fallout zone starts at 10 R/h, so it is off scale where fallout kills fastest. Fraction 0.08 (0.01–0.25) is a guess: half of events leave no official readings; there, choosing the spot and timing trips might save 15% of remaining dose.

## Sheeting and tape

Plastic does not stop gamma rays, and FEMA puts inhaled fallout orders of magnitude below external dose: 0.01 (0–0.05). Against a chemical cloud a sealed room tested at protection factors of 1.3 to 539, but the model has no such hazard, and my rough sum gives under 0.001 micromorts a year.

## Faraday bag

0.4 (a high-altitude pulse accompanies the war) × 0.05 (it kills a small unplugged radio; 0.005–0.3) = 0.02 of information harm. The EMP Commission saw no effects on 37 switched-off cars up to 50 kV/m. I found no test of small radios.

## Relocation trigger

Cost: 2% a year that the tripwire fires (0.5–8%) × $4,000 per person per trip (1,500–12,000) = $80, plus about 5 household hours a year. Benefit: 0.5 (wars with a day or two of visible escalation; Samotsvety gave 75% for an attentive Londoner mid-crisis) × 0.6 (the household goes) = 0.3 of all nuclear harm, including death in the first hour, which the hazard definition omits. Break-even at $125 per person a year: 125 / (0.3 × $10) = 42 micromorts a year, a 0.007% yearly chance that the city is struck if 60% die. Step 2 gives 0.002–0.2% for a NATO big city, so it can fall either side. All guesses.

## Two weeks of supplies

An hour outdoors costs about 600 × R1 × t^-1.2 micromorts (cancer only). At the zone edge (R1 = 10 R/h): 58 on day 2, 13 on day 7, 6 on day 14; ten times that at R1 = 100. Water and food for days 1–3 are worth far more per day here than in any other hazard.

## Sources not opened

FEMA guidance, third edition (too large; I used 2010). Dillon 2014 and the Center for Health Security shelter page (403). Florig and Fischhoff 2007, Dombroski 2006, Sorensen and Vogt 2001, Jetter and Whitfield 2005: abstract, press report or snippets only. UNSCEAR release on 15 Chernobyl thyroid deaths (403). Retailer pages for the dosimeter card, sheeting and Faraday bag refused; those prices are unverified.
