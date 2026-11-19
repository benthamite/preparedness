## Report: prior work and baseline-harm evidence for a cost-effectiveness-ranked preparedness list

Labels: **[V]** = read on a page or PDF I fetched. **[S]** = seen only in a search-result snippet, page not opened (treat as unverified). **[U]** = recalled or inferred by me, unverified.

Bottom line for A: nothing rigorous exists. I found no published ranking of household preparedness items by expected value or cost-effectiveness, and the public-health literature says the effectiveness of kits is itself unmeasured.

### A. Prior attempts to quantify or rank

**Prepper sites**
- The Prepared, beginner checklist (page undated; fetched 2026): no probabilities, no costs, no EV. Ordering rests on Maslow, the "rule of 3s", and an asserted Pareto claim ("initial 20% ... gets you 80%"). Targets: two weeks, 15 gal water/person, 23,000 kcal/person. Supporting claims: "over 50% of Americans can't handle an unexpected $500 emergency" (unsourced) and US military needs "an average of eight days to mobilize". [V] https://theprepared.com/prepping-basics/guides/emergency-preparedness-checklist-prepping-beginners/
- Wirecutter emergency guide: fetch blocked. From recall it is product testing organised by need, with no likelihood weighting. [U] https://www.nytimes.com/wirecutter/reviews/emergency-preparedness/
- lcamtuf, "Disaster planning for regular folks": 403. From recall it argues for likelihood-first triage (money and health first) but has no numeric model. [U] https://lcamtuf.coredump.cx/prep/

**LessWrong / EA Forum** (closest thing to EV reasoning; all informal)
- Samotsvety (2022): the only worked probability chain. P(NATO-Russia exchange in a month) 0.00067 × P(London hit) 0.18 × P(can't escape) 0.25 × P(death) 0.78 = 24 micromorts (7–61), about 10 hours of life at 50 years remaining. Costs of leaving not quantified. [V] https://forum.effectivealtruism.org/posts/KRFXjCqqfGQAYirm5/samotsvety-nuclear-ri[REDACTED:sk-api-key:b159a8ea]
- "Accrue nuclear dignity points" (2022), comment by Martin Randall: two extra weeks of life = 4% of a QALY = ~$4,000; at an illustrative 1%/yr risk that justifies ~$40/yr. Lao Mein: a person-year of grains and water treatment for under $500. [V] https://www.lesswrong.com/posts/ZMgxFwqabdGepm3e6/accrue-nuclear-dignity-points
- Jeff Kaufman, "Disasters" (2020): guesses ~2% lifetime chance his household needs stored water; under 5% of people would be fine after a two-week outage; stores ~15 gal/person. No costs. [V] https://www.jefftk.com/p/disasters
- daenerys (2014): qualitative; a commenter proposes cost ÷ (probability × loss) but nobody computes it. [V] https://www.lesswrong.com/posts/ehHjcM3zSXGdSh7re/items-to-have-in-case-of-emergency-maybe
- Finan Adamson, Nuclear Preparedness Guide (2022): one probability (0.24%/yr US-Russia war), no costs, no ranking. [V] https://www.lesswrong.com/posts/zzBbRotDubk33YdGd/nuclear-preparedness-guide
- Hollow (2021) and Kaufman (2024): no numbers. [V] https://www.lesswrong.com/posts/waxtWyAXDwkLhRKCy/the-utility-function-of-a-prepper , https://www.lesswrong.com/posts/6z2jfG5eqkrktPiYT/preppers-are-too-negative-on-objects
- Jeffrey Ladish and Kelsey Piper: no personal-preparedness piece with quantification turned up in search.

**Academic and grey literature**
- Heagele (2016, AJPH): "no evidence exists for determining what should be in the disaster supply kits or determining whether having the kits results in self-sufficiency or disaster resilience." [S; PMC blocked the fetch] https://pmc.ncbi.nlm.nih.gov/articles/PMC4880243
- Pickering et al. (2018): 31 articles reviewed; only 2 address effectiveness, neither with outcome data. The 72-hour figure traces to a Canadian campaign assumption that "emergency services may not reach everyone within the first 72 hours". [V] https://currents.plos.org/disasters/article/the-promotion-of-grab-bags-as-a-disaster-risk-reduction-strategy/index.html
- Clay et al. (2020), Superstorm Sandy, n=1,114 NYC households: "Having a kit, plan, and medication did not reduce risk of adverse outcomes." Odds ratios were above 1 (e.g. evacuation plan and not recovered, OR 2.4, 1.5–3.8), which suggests confounding. [V, abstract only] https://www.cambridge.org/core/journals/disaster-medicine-and-public-health-preparedness/article/does-preparedness-matter-the-influence-of-household-preparedness-on-disaster-outcomes-during-superstorm-sandy/19287028C47560A8DBF30A31AECDC9C3
- Nearest household-level BCA is for flood-proofing, not kits. Poussin et al. (2015), 885 French households: cost-efficiency "depends strongly on the flood probability faced by households". [V, abstract] https://doi.org/10.1016/j.gloenvcha.2014.12.007

**Government guidance**
- Finland 72h: "at least three days"; no rationale given. [V] https://72tuntia.fi/en/
- Switzerland: 9 L water/person (3 L × 3 days), food for about a week. Germany BBK: 10 days, 2 L/day (1.5 drinking + 0.5 cooking), ~2,200 kcal/day. Rationales are physiological, not risk-based. [S] https://www.zh.ch/de/wirtschaft-arbeit/wirtschaftliche-landesversorgung/notvorrat/wasser.html , https://www.verbraucherzentrale-niedersachsen.de/node/125990
- Sweden: the page I fetched had no content; one week is from recall. [U]
- FEMA quantifies service loss for mitigation grants, not household kits (see B2).

### B. Baseline harm

**1. Deaths in outages**
- Texas, Feb 2021 (DSHS, Dec 2021): 246 deaths. Hypothermia 158 (64.2%), frostbite 3; exacerbation of pre-existing illness 25 (10.2%; includes dialysis, oxygen and powered-device loss; renal 6, respiratory 8); vehicle crashes 22 (8.9%); CO 19 (7.7%); fire 10 (4.1%); falls 9 (3.7%). Aged 60+: 147 (59.8%). Among hypothermia deaths, 13.9% involved alcohol. No deaths attributed to thirst or hunger. [V] https://www.dshs.texas.gov/sites/default/files/news/updates/SMOC_FebWinterStorm_MortalitySurvReport_12-30-21.pdf
- That is about 8 micromorts per Texas resident on the official count [U, my arithmetic on ~29M]. A BuzzFeed excess-death analysis gave ~702 (426–978) [S].
- Same storm, UH survey (n=1,500, Mar 2021): 69% lost power (mean 42 h, median 36); 49% lost running water (mean 52 h); 75% had difficulty getting food, 63% bottled water; 18% left home; of those who stayed, 26% heated with a gas oven or cooktop, 8% used a grill indoors; 15% said an outage harmed a relative dependent on powered medical equipment. [V] https://www.uh.edu/hobby/winter2021/storm.pdf
- Hurricane Irma (MMWR 2018): 129 deaths, only 11 direct. Exacerbation of existing conditions 46 (35.7%), of which heat 17 (14 in one unpowered care home) and oxygen-dependent 3; CO 16 (12.4%); preparation or repair injuries 15; falls 13. Power-outage-related: 20 + 27. [V] https://www.cdc.gov/mmwr/volumes/67/wr/mm6730a5.htm
- Puerto Rico (Kishore et al., NEJM 2018): 4,645 excess deaths (CI 793–8,498), a 62% rise; about one third from delayed or interrupted care; households averaged 84 days without electricity, 68 without water, 41 without cell service. [V via authors' institute page; NEJM blocked] https://fxb.harvard.edu/2018/05/29/study-estimates-prolonged-increase-in-puerto-rican-death-rate-after-hurricane-maria
- NYC 2003 blackout (Anderson and Bell 2012): ~90 excess deaths in two days (CI 46–138), +28%; 78 disease-related, 12 accidental; official count 6. [V] https://pmc.ncbi.nlm.nih.gov/articles/PMC3276729
- Generator CO (CPSC, 2011–2021): 770 generator-only deaths (~70/yr, my division); 157 in weather outages, 139 after shut-offs; a CO alarm was known present in only 17% of fatalities. [V] https://www.cpsc.gov/s3fs-public/Fatal-Incidents-Associated-with-Non-Fire-Carbon-Monoxide-Poisioning-from-Engine-Driven-Generators-and-Other-Engine-Driven-Tools-2011-2021.pdf
- Heat: BC 2021, 619 deaths, 98% indoors, 67% aged 70+, 56% living alone [V] https://news.gov.bc.ca/releases/2022PSSG0042-000903 . Europe 2022: 61,672 (CI 37,643–86,807) [S] https://www.nature.com/articles/s41591-023-02419-z . Europe 2003: ~70,000 [U].
- Japan 2011: 3,774 disaster-related (indirect) deaths as of Mar 2021. Ishinomaki sample (n=276): mean age 79.7; ~80% within three months; respiratory 31.1% (mostly pneumonia), cardiovascular 26.8%, hypothermia 3.6%. [V] https://pmc.ncbi.nlm.nih.gov/articles/PMC8998736
- Dialysis after Sandy (Kelman 2015): 30-day mortality 1.83% vs 1.47% and 1.60% in comparison groups. [S] https://pubmed.ncbi.nlm.nih.gov/25156306/

**2. Willingness to pay and value of lost load**
- LBNL/NRECA ICE 2.0 (Nov 2026; rural co-op members, WTP): residential cost per event $1.90 momentary, $7.08 for 2 h, $29.42 for 8 h, $53.68 for 24 h; $1.96 per unserved kWh at 24 h. For a 3-day outage, 42% would relocate; 20% would lose income (mean $1,157 among those). [V] https://eta-publications.lbl.gov/sites/default/files/2026-10/ice_2.0_nreca_final_report_28oct2026.pdf
- Baik et al. (Nature Energy 2020; n=483; 10-day winter blackout): $1.7–2.3/kWh; mean $43/day "for sure", $60/day with uncertainty, for partial backup. [V] https://doi.org/10.1038/s41560-020-0581-1
- FEMA standard values (v12, May 2023; 2022$): electricity $199/person/day, of which the residential WTP part is $33.04 (linear extrapolation from a 2003 survey; FEMA flags the linearity as doubtful). Water $138/person/day, of which residential $74.38 (welfare loss $66.26 + $8.12 bottled water for 6.6 gal). VSL $12.5M. [V] https://fema.gov/sites/default/files/documents/fema_standard-economic-values-methodology-report_2023.pdf
- EU household VoLL, production-function method: 3.2–15.8 €/kWh, average 8.7 (Shivakumar 2017). [S] https://pure.iiasa.ac.at/14689

**3. Running out before aid arrives**: thin evidence; no systematic time-to-aid data found.
- Hurricane Andrew 1992, Louisiana, 8 days after: 27% of households depended on relief food, 32% on relief water. [V] https://www.cdc.gov/mmwr/preview/mmwrhtml/00017631.htm
- Texas 2021 and Puerto Rico figures above are the best rich-country data. Katrina "three to five days without water and food". [S, Wikipedia]

**4. Benchmarks**
- Smoke alarm giveaway and installation programmes (Liu et al. 2012; 2011$): $51,404 and $45,630 per QALY; benefit-cost ratios 2.1 and 2.3. [V] https://stacks.cdc.gov/view/cdc/36304
- Tengs et al. (1995; 1993$), smoke detectors in homes: six estimates from ≤$0 to $210,000 per life-year. [V] https://www.gwern.net/doc/statistics/decision/1995-tengs.pdf
- NFPA (2019; 2012–16 data): risk of dying in a reported home fire is 54% lower with working alarms. [V] https://www1.maine.gov/dps/fmo/sites/maine.gov.dps.fmo/files/inline-files/nfpa_smoke_alarms_in_u.s._home_fires.pdf
- CO alarms: cost-effective if they prevent more than 10% of $3.47B/yr poisoning costs, against $348M/yr alarm cost (2017) [V] https://www.uhms.org/uhm-search/uhm-journal-volume-44/number-5/cost-effectiveness-of-residential-carbon-monoxide-alarms.html ; benefit-cost up to 7.2:1 (Ran et al. 2017) [V, abstract] https://stacks.cdc.gov/view/cdc/106790
- Fire extinguishers: nothing found.

### Five findings most likely to change the design
1. **Effectiveness is unmeasured.** Every "harm averted" coefficient will be an assumption. Make it an explicit, uncertain parameter and say so; the one outcome study (Sandy) found no benefit.
2. **Food and water save almost no lives in short rich-country events.** Deaths come from cold and heat exposure in the old, chronic-illness and device interruption, and dangerous coping. Value stored water and food as hardship averted (FEMA's $74/person/day), not mortality.
3. **Coping kills.** CO and fire were 12% of Texas deaths; CO alone 12% in Irma. Generators and combustion heaters need a negative term, and CO alarms belong with them.
4. **Risk is concentrated.** 60% of Texas deaths were aged 60+; BC heat deaths were 67% aged 70+ and 56% living alone. One ranked list for all households will mislead; parameterise by age, medical dependence, climate and heating type.
5. **Per-event stakes are small and the tail dominates.** Stated WTP is about $50–85 per household-day, and a Uri-class event costs ~8–25 micromorts per resident [U]. Only cheap or dual-use items will beat the smoke-alarm bar (~$50k/QALY). Model outage duration with a fat tail (Puerto Rico: 84 days) and include relocation as the counterfactual (18% of Texans left; 42% say they would).

Friction: PMC, NEJM, NYT, EA Forum (rate limit), lcamtuf, the BBK page and the BC coroner PDF refused automated fetches, which is why some primary sources are [S] or cited via secondary pages. I wrote no files; the fetch tool cached downloaded PDFs in the session's tool-results directory.
