# Nuclear: figures for 46 countries

## Method

The anchors (research/step3/tail-nuclear-grid.json) rest on three numbers: any nuclear use that kills over 1,000 people, 0.7%/yr forecast and 1.8%/yr pessimistic; a large-scale attack on the United States or on Western Europe, 0.07% and 0.25%; and the share alive an hour after the first detonation, 0.88 (US) and 0.82 (Western Europe). I kept these and split the 0.7% and 1.8% into wars, so each country can be built from the wars that reach it.

| war | forecast %/yr | pessimistic %/yr |
|---|---|---|
| Russia–NATO, large-scale attack on Europe (anchor) | 0.07 | 0.25 |
| Russian limited use on NATO Europe | 0.03 | 0.10 |
| Russian use in Ukraine | 0.17 | 0.45 |
| US–China, large-scale | 0.025 | 0.08 |
| US–China, limited (at sea, on regional bases) | 0.10 | 0.22 |
| India–Pakistan, about 100 warheads or more | 0.03 | 0.10 |
| India–Pakistan, smaller | 0.07 | 0.15 |
| North Korean use | 0.10 | 0.25 |
| Use on Israel | 0.02 | 0.08 |
| China–India / Russia–China | 0.008 | 0.025 |
| Non-state | 0.06 | 0.10 |
| **Total** | **0.68** | **1.8** |

Sources for the split:
- ONN and the Swift Centre (March 2026): 1.3% by 2030 for any US–China exchange, about 0.28%/yr. I use it as the pessimistic rate and half of it as the forecast, as the AI researcher did.
- The US anchor fixes the large-scale US–China share. Its 0.07% equals 0.05% from Russia plus 0.019% from China.
- PS21's 2015 survey of 50 experts, over 20 years: India–Pakistan nuclear exchange 9%, North Korea–US 6%, Russia–NATO 4%, US–China 2%.
- The Atlantic Council's Nov–Dec 2025 survey (447 experts), asked who would use a nuclear weapon by 2036: Russia 15%, North Korea 10%, non-state 8%, US 8%, Israel 5%.
- Metaculus search snippets (the page refused): India about 10%, Israel 11–13% and Ukraine 15–18% of fatalities, given any detonation by 2030. These serve as checks only.

For each country, **nuclearNear** = Σ war rate × weight × share alive at one hour. The weight is the chance the country is attacked heavily enough that power, supply and care fail nationally. In that case every household counts, as in the anchors. A country hit only lightly also adds the share of its urban households inside a damaged area or under a plume.

Weights are judgments, guided by these factors:
- whether the country is a nuclear power (UK, France, China, India);
- whether it hosts US weapons: Belgium, Germany, Italy, the Netherlands and Turkey (FAS 2023);
- whether it is a NATO frontline state (Poland, the Baltic states, Finland, Norway);
- whether it hosts US bases that China or Russia would strike (Japan, South Korea, the Philippines, Australia's joint facilities, which the Australian government accepts as targets per Tanter/Nautilus);
- whether it lies downwind of such targets (Austria, Switzerland, Slovenia, Lithuania downwind of Kaliningrad).

Survival is 0.82 for the most heavily targeted European states and 0.84–0.85 for Italy, Poland and the Baltic states. It is 0.88–0.92 where targets are few, and 0.95–0.97 where only plumes arrive.

**nuclearFar** is any use less the rate of wars that strike the country at all, the convention of the anchors.

**falloutScale** compares a counted household's mean fallout death risk with the US mean of 10,000 micromorts. It depends on three things: ground bursts on hard targets upwind of cities, the housing stock (US light frame against masonry, concrete or cellars), and wind. For countries hit only lightly, the counted households are by definition near a target or under a plume. So their mean can exceed the US all-household mean, as for Australia and the Philippines.

## Anchor reproduction

| preset | field | preset | mine | how |
|---|---|---|---|---|
| us | near forecast | 0.0006 | 0.00061 | (0.07×0.72 + 0.025×0.75)% × 0.88 |
| us | near pessimistic | 0.0022 | 0.0021 | (0.25×0.72 + 0.08×0.75)% × 0.88 |
| us | far | 0.006 / 0.015 | same | 0.7 − 0.07 − 0.03; 1.8 − 0.25 − 0.05 |
| westernEurope | near forecast | 0.0005 | 0.00052 | 0.07% × 0.739, the population-weighted weight × survival over 18 countries (anchor: 0.85 × 0.82 = 0.70) |
| westernEurope | near pessimistic | 0.0017 | 0.0018 | 0.25% × 0.739 |
| westernEurope | far | 0.006 / 0.015 | same | as US |
| westernEurope | falloutScale | 0.6 | 0.60 | risk-weighted mean of my 18 values |
| buenosAires | near | 1e-6 / 3e-6 | same | placeholder; no war reaches Argentina |
| buenosAires | far | 0.007 / 0.018 | same | nothing to subtract |
| buenosAires | falloutScale | 0 (not applicable) | 0.3 | see below |

The Western European figures are 4–6% above the preset. I give the big NATO states weight 1 and the neutrals 0.2–0.35, which averages slightly above the anchor's 0.85. For Buenos Aires falloutScale I give 0.3, not the preset's 0, so the field means the same everywhere. Times a 1e-6 probability, the difference is 0.003 micromorts a year.

## China's fallout, the one derived scale

Philippe and Stepanov (2023), read in full, model ground bursts on 270 silos, two 300 kt warheads each. Over a year of weather they average 4.6M acute deaths with building protection (18M without). About 70% of the deaths come from the Ordos field, which is upwind of Beijing, Taiyuan and Zhengzhou.

I multiply by 1.3 for typical behaviour, as the US anchor does. I add 1.5M for other ground bursts (a guess). That gives 7.5M deaths among 1.3B survivors, 0.58%. The US anchor has 0.88%, so the scale is 0.65.

The same paper puts average deaths in South Korea at 6,000 and in Japan at 1,600 from those strikes, which is small.

## Table of middle figures

Tags are given as near / far / fallout: d = derived, g = guess.

| country | near f | near p | far f | far p | fallout | tags |
|---|---|---|---|---|---|---|
| Australia | 4.4e-6 | 2.5e-5 | 0.0066 | 0.017 | 1.0 | g/d/g |
| Austria | 0.00020 | 0.00071 | 0.0068 | 0.017 | 0.5 | g/d/g |
| Belgium | 0.00057 | 0.0021 | 0.006 | 0.015 | 0.6 | d/d/g |
| Canada | 0.00037 | 0.0013 | 0.0066 | 0.016 | 0.6 | d/d/g |
| Chile | 1e-6 | 3e-6 | 0.007 | 0.018 | 0.3 | g/d/g |
| Colombia | 1e-6 | 3e-6 | 0.007 | 0.018 | 0.3 | g/d/g |
| Costa Rica | 1e-6 | 3e-6 | 0.007 | 0.018 | 0.3 | g/d/g |
| Czechia | 0.00041 | 0.0015 | 0.0063 | 0.016 | 0.5 | d/d/g |
| Denmark | 0.00049 | 0.0018 | 0.0061 | 0.015 | 0.5 | d/d/g |
| Estonia | 0.00054 | 0.0019 | 0.006 | 0.015 | 0.55 | d/d/g |
| Finland | 0.00052 | 0.0019 | 0.0061 | 0.015 | 0.4 | d/d/g |
| France | 0.00057 | 0.0021 | 0.006 | 0.015 | 0.7 | d/d/g |
| Germany | 0.00057 | 0.0021 | 0.006 | 0.015 | 0.55 | d/d/g |
| Greece | 0.00035 | 0.0012 | 0.0064 | 0.016 | 0.4 | d/d/g |
| Hungary | 0.00035 | 0.0012 | 0.0064 | 0.016 | 0.45 | d/d/g |
| Iceland | 0.00019 | 0.00068 | 0.0068 | 0.017 | 0.4 | g/d/g |
| Ireland | 0.00014 | 0.00049 | 0.0068 | 0.017 | 0.5 | g/d/g |
| Israel | 4.3e-5 | 0.00016 | 0.0068 | 0.017 | 0.4 | g/d/g |
| Italy | 0.00056 | 0.0020 | 0.006 | 0.015 | 0.55 | d/d/g |
| Japan | 0.00033 | 0.0010 | 0.0059 | 0.015 | 0.5 | g/d/g |
| South Korea | 0.00042 | 0.0012 | 0.0059 | 0.015 | 0.5 | g/d/g |
| Latvia | 0.00054 | 0.0019 | 0.006 | 0.015 | 0.55 | d/d/g |
| Lithuania | 0.00057 | 0.0020 | 0.006 | 0.015 | 0.7 | d/d/g |
| Luxembourg | 0.00037 | 0.0013 | 0.0063 | 0.016 | 0.6 | d/d/g |
| Mexico | 7.6e-6 | 2.6e-5 | 0.007 | 0.018 | 0.7 | g/d/g |
| Netherlands | 0.00057 | 0.0021 | 0.006 | 0.015 | 0.6 | d/d/g |
| New Zealand | 2e-6 | 6e-6 | 0.007 | 0.018 | 0.5 | g/d/g |
| Norway | 0.00055 | 0.0020 | 0.0061 | 0.015 | 0.45 | d/d/g |
| Poland | 0.00059 | 0.0021 | 0.006 | 0.015 | 0.6 | d/d/g |
| Portugal | 0.00028 | 0.0010 | 0.0064 | 0.016 | 0.35 | d/d/g |
| Slovakia | 0.00038 | 0.0014 | 0.0063 | 0.016 | 0.45 | d/d/g |
| Slovenia | 0.00035 | 0.0012 | 0.0064 | 0.016 | 0.55 | d/d/g |
| Spain | 0.00043 | 0.0015 | 0.0063 | 0.016 | 0.45 | d/d/g |
| Sweden | 0.00046 | 0.0017 | 0.0063 | 0.016 | 0.45 | d/d/g |
| Switzerland | 0.00023 | 0.00083 | 0.0068 | 0.017 | 0.4 | g/d/g |
| Turkey | 0.00017 | 0.00061 | 0.0066 | 0.016 | 0.6 | g/d/g |
| United Kingdom | 0.00057 | 0.0021 | 0.006 | 0.015 | 0.8 | d/d/g |
| United States | 0.00061 | 0.0021 | 0.006 | 0.015 | 1 | d/d/d |
| Argentina | 1e-6 | 3e-6 | 0.007 | 0.018 | 0.3 | g/d/g |
| Brazil | 1e-6 | 3e-6 | 0.007 | 0.018 | 0.3 | g/d/g |
| China | 0.00027 | 0.00087 | 0.0062 | 0.016 | 0.65 | d/d/d |
| India | 0.00030 | 0.00097 | 0.0063 | 0.016 | 0.3 | g/d/g |
| Indonesia | 2e-6 | 6e-6 | 0.007 | 0.018 | 0.3 | g/d/g |
| Nigeria | 1e-6 | 3e-6 | 0.007 | 0.018 | 0.3 | g/d/g |
| Philippines | 1.8e-5 | 4.9e-5 | 0.0067 | 0.017 | 0.8 | g/d/g |
| South Africa | 1e-6 | 3e-6 | 0.007 | 0.018 | 0.3 | g/d/g |

Ranges follow the anchors. Derived figures run from mid/6 to mid×4.2 for the forecast and mid/3.6 to mid×3.8 for the pessimistic outlook. Guesses run from mid/10 to mid×6 and from mid/5 to mid×5. Far ranges are the anchors' own.

Checker: Mexico's near figures were 7.2e-6 and 2.5e-5; its stated arithmetic (0.95 alive) gives 7.6e-6 and 2.6e-5, so the JSON and this table now use those.

## Countries I am least sure of

1. **South Korea.** The rate of North Korean use (0.1%/yr) rests on surveys, not on a forecast of use against the South. So does the share of households that count (0.4). North Korea has about 60 warheads (SIPRI 2026), so it cannot mount a 100-warhead attack. Most of this figure is a smaller attack on Seoul and on bases.
2. **Turkey.** Incirlik hosts B61s, but it is unclear whether Russia would strike Turkey in a war centred on Europe. It is also unclear whether a few strikes on Incirlik and Kürecik would collapse the country or touch only Adana and Malatya.
3. **Israel.** Everything hinges on Iran. The CRS (October 2026) says Iran has not resumed enrichment, its 60% material is "under the rubble" and the IAEA has no access. A quick Iranian rebuild would move Israel to the pessimistic figure or above it.
4. **India.** No fetched source gives a current India–Pakistan nuclear rate. The forecast of 0.03%/yr for a large exchange agrees with a Metaculus snippet, but not with the 2015 PS21 survey, which is about four times higher in total.
5. **Japan.** Whether China or Russia would strike US bases near Tokyo in a war that reaches the US homeland (weights 0.7 and 0.2) is judgment. These two terms carry 80% of the figure.

## Sources not opened

- Metaculus question 11481 (403, also through its API and the Wayback Machine).
- The FRI/ONN full report PDF (over the fetch limit).
- The Bulletin's December 2025 Nuclear Notebook on Europe (paywalled).

Figures from them appear only as checks and are not tagged as data.
