# hazards-regional: hurricane, earthquake, wildfire, flood (United States)

Of 167 tagged quantities, 45 are derived and 122 are guesses; none is tagged data. Probabilities, displacement and deaths rest on sources I read. Most other windows are guesses anchored on a few events.

## Event definitions and annual probability

Each event is defined broadly, so most events are mild and the harm sits in the worst tenth.

**Hurricane, 6% (2–15%).** Exposed: Gulf or Atlantic coastal county. Event: tropical-storm-force wind, surge or flood rain that causes a 6-hour outage, an evacuation order or damage. NOAA: a hurricane passes within 50 nautical miles every 5–7 years in south Florida, coastal North Carolina and southeast Louisiana, every 30–50 years in New England. I take 9% for the Gulf and Southeast and 2.5% for the Northeast, half the population each: 5.75%. Check: Pulse counts 0.84M (2023) to 1.9M (2022) adults displaced by hurricanes, 1.4–4% of 47–62M exposed adults.

**Earthquake, 1% (0.3–2%).** Exposed: the 28M people in the USGS high tier, who meet 0.1 g about once in 72 years (1.4%/yr). Event: intensity VII or more at the home (about 0.2 g), two to three times rarer at a given site, offset by the Los Angeles and Bay Area cores lying well above the tier's floor. My count of 1971–2025 gives 8M person-exposures among 20M high-hazard Californians, 0.7%/yr. The moderate tier (57M) is 0.1–0.3%.

**Wildfire, 13% (5–30%).** Exposed: western wildland-urban interface. Event: evacuation order or warning, or three or more days of heavy smoke.
- Smoke: over 8M people a year had a day above 100 µg/m³ of smoke PM2.5 in 2016–2020 (Childs et al.), 10% of the West; 12% for interface homes.
- Evacuation: 1.1M Californians ordered out in 2017–2019 (Wong et al.). My 2017–2025 tally is 300,000 a year over 22M interface residents: 1.3%.
- So heavy smoke without evacuation is about nine times as frequent as evacuation. Displacement pOccur is 0.1, and the trauma and financial figures are already multiplied by 0.1.

**Flood, 2.5% (1–6%).** Exposed: FEMA Special Flood Hazard Area or First Street substantial risk, both defined by at least 1%/yr. Event excludes named tropical cyclones. NFIP claims run at about 1.2% of policies a year (search snippets); street flooding and orders without water in the building double it. Pulse check: 665,000–670,000 adults displaced by floods in each of two years; half of them in mapped-risk homes is 1.4% of 24M adults, which matches pOccur 0.5.

## Windows

- **Hurricane power**: NREL (via step 2) gives 52% over 1 day, 33% over 3, 2.5% over 7, mean 2.2 days. My Florida 2016–2025 tally gives 2.8. I use 1.5 / 6 / 16 days (engine mean 2.6).
- **Earthquake**: Northridge timeline. Nearly half of 1.4M LADWP customers had power by noon on day 1, all but 7,500 by day 4; 36,000 lacked water on day 4, 10,000 on day 6; gas was back in 40,000 homes on day 6 with as many still out. Christchurch after a month: water to 95%, a quarter of households without a toilet. Tails follow HayWired (unverified).
- **Displacement** starts from the Pulse split: 43% under a week, 25% a week to a month, 11% one to six months, 7% longer, 14% never returned. Counting never-returned as resettled within six months gives 9 / 140 / 600 days.
  - Flood: 8 / 120 / 600, nearly as it stands.
  - Hurricane: 7 / 90 / 540. Pulse under-counts ordered evacuations of 2–6 days, and its 2022 tail (24% over six months or never) is several times the homes destroyed.
  - Wildfire: 4 / 16 / 500, from Wong's surveys (most away 1–8 days) and my estimate that one evacuated household in twenty lost its home. Pulse's fire category is mostly house fires.
  - Earthquake: 30 / 240 / 900. Displacement is by damage only, so the short classes are missing.
  - Engine means are 45, 38, 21 and 89 days; the tails dominate unless daily displacement hardship falls with duration.

## Exposures

**Trauma, healthy adult, per event.**
- Hurricane, 10 (3–40). About 3,000 mainland deaths in 2000–2024 (my sum, half of it Katrina) is 120 a year over 60–80M people, about 30 per event. Half is direct, plus a fifth for clean-up: 20. Times 0.5–0.6 for under-60s. Surge-zone stayers: 70 (Sandy, Zone A) to 10,000 (Katrina). Late evacuation: 8 (3–30); Rita killed 29 per million evacuees.
- Earthquake, 25 (5–120). Northridge: 33–57 deaths over about 3M at intensity VII+, 11–19. Ordinary events are near 10 and one in ten near 200.
- Wildfire, 4 (0.5–15). 144 deaths among 1.1M ordered out is 130 per evacuation; times 0.3 for under-60s (72 of 84 identified Camp Fire dead were 60 or older) is 40; times 0.1. Those who stay or leave late: about 400.
- Flood, 8 (2–30). 94–118 deaths a year (NWS), 8.4% in buildings or mobile homes (Terti et al.): 8–10 a year over about 700,000 people in flooded homes is 13 each, 6.5 per event, halved for under-60s, plus 5 for wading near home. Driving out late: about 30, so staying above the water is safer, the opposite of wildfire.

**Smoke, 3 micromorts (0.5–20) and $120 per event.** Five days at 75 µg/m³ is 375 µg-days. At 1.5–1.9% per 10 µg/m³ that is 56–71% of a day's mortality, 4.2–5.3 micromorts at 7.4 a day. Halved for healthy adults and times 0.7 for flattening: 1.5–1.9. Long-term response functions on the same dose (1 µg/m³ over a year × 0.7% × 2,700 micromorts) give 19, hence the wide range. Hardship: 5 days × a third symptomatic × $84 (Richardson et al.) = $140.

**Financial loss, renter in an apartment** (owner of a house in brackets):
- Hurricane: $600 ($6,000).
- Earthquake: $1,500 ($25,000). Contents at about 6% damage, uninsured.
- Wildfire: $50 ($600) per event, $450 ($5,700) per evacuation. A 3% chance the apartment burns × $25,000 × 51% of renters uninsured.
- Flood: $2,300 ($16,000). A 20% chance a ground-floor unit floods × $11,000 × 0.85, plus $440 for an uninsured car.

These are guesses built from recalled insurance shares.

## Leave, warning, late buying

Warning is 3 days for a hurricane, 0 for an earthquake, 0.75 for a flood (near the engine's half-day threshold) and 1 for wildfire smoke; the wildfire evacuation tail has minutes to hours. Hurricane leaving costs $250 plus $35 per person per day: 25% in hotels at $85, 75% with friends at $15 (Whitehead: 16% hotel, 6% shelter, 70% friends). That is $560 for 2.5 people over 3.5 days, against Gellman et al.'s welfare cost of $117–343 per person. Late-buy chances are guesses; the only numbers found were fuel stock-outs at 36–58% of stations before Irma (snippets).

## Assumptions about others' numbers

- Baseline adult mortality is 7.4 micromorts a day, with age ratios of 6 and 24, as in the medical file.
- Deaths from heat, carbon monoxide and interrupted care belong to the windows and other channels; my trauma figures exclude them.
- The displacement need carries the per-day cost of being away.
- The engine does not read the extra fields I added (listed under openQuestions).

## Sources I could not open

nhc.noaa.gov (return-period maps, Ian and Helene reports, indirect-deaths page); Rappaport 2014 (the download was an HTML wrapper); preventionweb.net; the Louisiana health department copy of Brunkard et al. and pubmed.ncbi.nlm.nih.gov (three abstracts read through Europe PMC instead); cira.colostate.edu; news.stanford.edu and the Stanford copy of Childs et al. (phys.org press release read instead); the USGS HayWired fact sheet; FEMA's NFIP brochure; the NPR story on Irma fuel shortages (timeout).

Not found or not searched: Pulse durations by disaster type, FCC cell-site outage reports, pharmacy status maps, post-hurricane household surveys. Everything from snippets or memory is marked unverified or guess in the JSON.
