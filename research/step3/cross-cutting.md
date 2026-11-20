# cross-cutting: reasoning

39 parameters and 52 anchors. Every `basis` in the JSON carries its own arithmetic; this file gives the method and the points a reader could get wrong.

Tags follow the brief strictly: `data` or `derived` only where I read the page or PDF; anything resting on a search snippet or memory is `guess`, even when the figure is an official one. All prices are November 2026 dollars. I did not find the November 2026 CPI, so I assumed 3.5% above the 2025 average and 14% above 2022.

## Values

- **Micromort, US: $14.6 (6.8–22.3).** HHS 2026 standard values, read: VSL $14.1M central, $6.6M low, $21.5M high in 2025 dollars; × 1.035; ÷ 1e6. DOT's figure (recalled, pages blocked) agrees.
- **Western Europe: $7.0 (3.5–11).** The sources disagree twofold. OECD's 2025 meta-analysis puts the EU at $8.4M (2022 dollars), almost the US value; an income transfer gives 14.6 × 0.58 = 8.5; older Commission and UK practice is $4–5M. Mid is the geometric middle of 5 and 9.4.
- **Buenos Aires: $3.0 (1.0–6.0).** Transfer: VSL_US × (GNI per capita ratio)^e. Atlas GNI 13,530 / 83,490 = 0.162. e = 1 gives 2.4; e = 1.5 gives 0.95; a city income premium of 1.5 gives 3.6; a PPP ratio gives 5.1.
- **Time: $21 / $15 / $5.5 an hour.** HHS method (median wage after tax): US $24.43 × 0.83 = $20.27, read. Europe and Buenos Aires apply the same method to wages from snippets. Lo is half of each, the fraction transport appraisal uses.
- **Discount rate 3% (1–7%).** OMB 3% and 7%.

## Storage

Apartment: rent $232/m²/yr ÷ 900 usable litres per m² (1.8 m stack, half full) = $0.26 per litre-year for average floor space; marginal dead space at a quarter of that = **$0.07** (0.02–0.26). Self-storage prices give $0.13–0.16, an upper check. House: $158/m²/yr × 0.3 (garage or basement) ÷ 900 × 0.4 (slack) = **$0.02** (0.005–0.10).

## Prices

Western Europe 1.1 (no prices fetched). Buenos Aires **1.4 (1.0–2.3)**: a generic CO alarm is $39 against $25–35 in the US, but a Sawyer Mini through a cross-border reseller is $134–156 against $29. One index hides a fivefold spread; item-level overrides would be better.

## Household shares

| | US | W. Europe | Buenos Aires |
|---|---|---|---|
| car (urban) | 0.90 | 0.65 | 0.40 |
| electric cooking | 0.60 | 0.60 | 0.17 |
| main heating needs grid | 0.93 | 0.90 | 0.50 |
| apartment tap needs building pumps | 0.15 | 0.25 | 0.85 |
| air conditioning | 0.89 | 0.22 | 0.68 |

Read sources: Pew/ACS (92% of US households have a vehicle) and Carbon Brief (AC by country). The rest are snippets or judgment, hence `guess`. The Buenos Aires heating and pumped-water shares are judgment from how buildings there are built; I found no source. `shareHeatingNeedsGrid` counts main heating only, not fireplaces or stoves.

## Relocation and aid

US $45 per person-day: 0.6 × $15 (relatives) + 0.3 × $95 (hotel at the $113 GSA rate shared, plus meals) + 0.1 × $10 = $38, rounded up. Fixed $300: 300 miles × $0.30 + 2 adults × 5 h × $21. Aid arrives at the median household on day 3 (2–5); across households p10 1, p90 7, p99 21 days. Six cases, no dataset.

## Hardship anchors

- **Power, $65 per household-day (35–170).** ICE 2.0 (read): $53.68 for 24 h. Baik: $56–78 a day today. FEMA: $33.04 × 2.5 × 1.14 = $94. The first 8 hours carry 55% of day one ($29.42); after that the per-day cost is flat to about day 10; nothing is known beyond two weeks.
- **Water, $85 per person-day (40–160).** FEMA $74.38 × 1.14. FEMA applies it flat. It covers washing and flushing as well as drinking, so stored drinking water buys back only a third to a half of it.

## Age multipliers

Deaths by age (read) over population by age (recalled shares, so ±20%), relative to ages 15–59:

| | under 15 | 60–74 | 75+ |
|---|---|---|---|
| Texas 2021, all certified | 0.17 | 3.8 | 9.5 |
| Katrina | 0.15 | 4.8 | 18 |
| New York 2003 (vs under 65) | – | 12.6 | 23 |
| British Columbia heat | 0 | 12 | 45 |
| Japan 2011, indirect | 0.08 | 10 | 73 |
| ordinary mortality | 0.2 | 6 | 30 |
| **adopted** | **0.15** | **7** | **25** |

Cold and injury sit at the low end, heat and interrupted care at the high end. Need-specific multipliers should override these.

## Anchors

Micromorts per exposed person-day = deaths ÷ (exposed persons × exposure days). `lo` pairs the fewest deaths with the largest exposure and `hi` the reverse, so ranges are wider than 90%.

Denominators, by event:

- Texas: 19M people in homes that lost power (69%, UH survey) × 1.75 days (42 h mean).
- New York: 8.1M residents × 1.2 days.
- Irma: 13.4M (64% of Florida) × 3.8 days (area under the EIA restoration curve).
- Maria: 3.3M × 84 days without power.
- British Columbia: 5.2M × 7 days.
- Japan: 5.71M residents of three prefectures; shelter deaths over 15.2M shelter person-days.
- Sandy: 19M × 3.3 days (both recalled).
- Katrina: 110,000 who stayed × 5 days.
- Iberia: 45.5M × 0.5 day.

Central values:

| | all | cold | heat | CO | fire | care | water/food |
|---|---|---|---|---|---|---|---|
| Texas | 21 | 9.0 | – | 0.57 | 0.30 | 1.8 | 0 |
| New York | 9.3 | – | 8.0* | 0.41 | 0.10 | * | 0 |
| Irma | 7.5 | – | 0.59 | 0.31 | 0.02 | 0.59 | 0 |
| Maria | 10.7 | – | – | – | – | 6.5 | 0.12 |
| British Columbia | – | – | 17 | – | – | – | – |
| Japan, 3 months | 3.5 | 0.84 | – | – | – | 0.95 | 0 |
| Sandy | 2.5 | 0.16 | – | 0.14 | 0.10 | 735† | 0 |
| Katrina | 1,790 | – | 27 | 5.5 | – | 345 | 17 |
| Iberia | 6.5 | – | – | 0.13 | 0.04 | 0.13 | 0 |

\* heat and interrupted care cannot be separated. † per dialysis patient, not per resident.

Cells marked – are causes that could not occur (cold in a heat wave) or for which no count exists (CO and fire after Maria). Injury rows are in the JSON.

What the anchors say:

1. A multi-day outage in bad weather costs the general population about 2–20 micromorts per person-day, all causes.
2. Healthy adults are far below that. Texas hypothermia under 60: 51 ÷ (15.6M × 1.75) = 1.9. British Columbia heat at 15–59: 55 ÷ (3.08M × 7) = 2.6. To compare an all-ages anchor with a healthy-adult curve, divide by about 3.5 (US age shares × the multipliers above).
3. Water and food are zero everywhere except Maria (26 leptospirosis deaths over 68 days, 0.12) and a guessed handful at the Katrina mass shelters.
4. CO is 0.1–0.6 per person-day without power, and about 2 per day for people burning fuel indoors (Texas).
5. Excess-death estimates run two to four times certified counts (Texas 702 against 246). Where both exist, `lo` is the certified count and `mid` the excess estimate; cause rows keep certified counts as `lo` and say how `mid` was set.
6. Katrina is a flood-drowning event; do not use it for outage curves.

## Assumptions about others' numbers

- Utility pumping failures, window lengths and leave feasibility belong to the hazard files.
- Secondary heat sources and grill ownership belong to the warmth and food researchers.
- Food spoilage is not in the power hardship figure.

## Sources I could not open

DOT VSL and benefit-cost guidance (403); OECD 2025 VSL report (403 on all mirrors); NHC Sandy report (403, mirror too large); medRxiv Iberian preprint (403); GWU Maria page (403); PubMed record for Kelman (cookie wall); JAMA Network Open, Dosa et al. (snippet only); EIA RECS press release (503); Mercado Libre product pages (403); Louisiana health department copy of Brunkard et al. (403, read via a mirror). Japan's shelter-population series by date was not found.
