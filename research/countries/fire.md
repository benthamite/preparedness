# fire: country figures for house fire and carbon monoxide

Two fields: `houseFire.scale` and `coIncident.scale`. Both are relative to the United States (1).

## Sources

- **WHO Mortality Database**, ICD-10 raw files, parts 5 (2017–2020) and 6 (2021 onward), updated February 2026. I streamed the files through `awk` without saving them and pooled 2017–2024 for each country. Fire: X00–X09 (accidental smoke, fire and flames) plus half of Y26 (fire, intent undetermined). CO: X47 (accidental poisoning by other gases, mostly CO) plus half of Y17 (gases, intent undetermined). Rates are age-standardised to the 2022 US population in three bands (0–14, 15–64, 65+), using World Bank population figures. Germany, New Zealand, the Philippines and South Africa stop at 2019 or 2020. Lithuania's CO uses 2021–2024 only (see below). Norway, China, India, Indonesia and Nigeria are not in the file.
- **CTIF World Fire Statistics No. 31** (2026), table 1.9: fire deaths per 100,000 people, averaged over 2020–2024, as reported by fire services. Table 1.5 gives residential shares.
- **GBD 2021**, regional age-standardised rates. Fire, heat and hot substances: PMC12091820. CO: PMC10602911. China's CO figure: Frontiers in Public Health 2025.
- India: NCRB fire-accident deaths, via dataful.in. US accidental CO deaths, 624 in 2022: USAFacts.

## Method

**Fire.**
1. Death-registration ratio: the country's age-standardised rate divided by the US rate. The US figure is 9.75 per million, or 3,195 deaths a year. NFPA's home fire deaths are 85–90% of that.
2. Where CTIF covers the country, I divide its rate by the US CTIF rate (1.07), correct it for age with the same factor, and take the geometric mean of the two ratios. The two sources mostly agree within 30%. Czechia is the exception: CTIF is twice the registration figure.
3. I removed wildfire disasters inside the pooled years: Mati in Greece (2018), Portugal (2017) and Black Summer in Australia (2019–20).
4. Where the place-of-occurrence digit shows a smaller share of fire deaths at home than the US's (about 82%), I scale the ratio down. This applies to Brazil (0.84), Mexico (0.74), Colombia (0.77), Turkey (0.89) and Korea (0.93).
5. **Smoke-alarm adjustment.** The model's US figure, 10 micromorts, is for a home *without* a working alarm. In the US, 84% of homes have one and an alarm removes 55% of the risk, so the US population rate is 0.54 of the alarm-less rate. Where almost nobody has an alarm, the population rate *is* the alarm-less rate. Each ratio is therefore multiplied by (1 − 0.84 × 0.55) / (1 − p × 0.55), where p is the country's share of homes with a working alarm. p is mostly my guess, based on whether alarms are mandatory. The factor runs from 0.55 (p ≈ 0) to 1.15 (Norway, p ≈ 0.97). Each country's notes give the figure before this step.
6. Countries without death registration:
   - China, Indonesia and Nigeria: the GBD regional rate against High-income North America (0.65 per 100,000), cut to a guessed share that is house fires rather than scalds or clothing burns.
   - India: a blend of that GBD estimate and NCRB residential deaths scaled up for under-recording.
   - Norway: CTIF alone.
   - Official Chinese, Indian and Nigerian counts serve only as floors.
7. Ranges combine data noise (log-sd 0.25 for large, consistent series up to 0.75 for no registration) with the uncertainty of the alarm factor.

**Carbon monoxide.**
1. The X47 + ½Y17 ratio to the US.
2. Multiplied by **1.42**, the product of three factors:
   - 1.3: only about 65% of US X47 deaths are CO (624 of 960 in 2022), against an assumed 85% elsewhere.
   - 1.5: about 40% of US CO deaths happen at home (fire-co.json), against an assumed 60% elsewhere.
   - 0.73: 49% of US homes have a working CO alarm and almost none elsewhere, so the US observed rate understates its alarm-less rate more.

   I used 1.8 for the UK, where CO alarms are common, and 1.4 for Canada, which has US-like garages and CO alarm laws.
3. Countries with fewer than about 50 deaths in the pooled period are shrunk toward a regional mean, with weight D/(D+20) on their own data.
4. China (×0.5 for an urban home), Indonesia and India use GBD rates against High-income North America (0.314 per 100,000). Nigeria, India and Norway are guesses.

## Anchor reproduction

| preset | field | preset figure | reproduced | comment |
|---|---|---|---|---|
| us | fire | 1 | 1 | by construction |
| westernEurope | fire | 0.5 (0.3–1.0) | 0.36 (0.25–0.55) | 0.41 before the alarm step; the UK alone gives 0.39, against the preset's 0.44 from England's dwelling-fire deaths |
| buenosAires | fire | 1.0 (0.4–2.0, guess) | 0.52 (0.24–1.1) | 0.91 before the alarm step, which confirms the guess; the alarm step halves it |
| us | CO | 1 | 1 | by construction |
| westernEurope | CO | 0.8 (0.3–1.3) | 0.51 (0.26–1.0) | raw X47 ratio 0.34; the preset compared old French and German figures with CDC's narrower US count |
| buenosAires | CO | 2 (0.7–4) | 1.8 (0.82–4.0) | national Argentina; the city is probably nearer 1.5 |

Both Western European figures fall inside the preset's ranges, but below its middle. The Buenos Aires fire figure differs only because of the alarm step. That step follows the field's definition, but the presets never had it. If the owner keeps it, the buenosAires preset should become about 0.5.

## Middle figures

Tags: d = derived, g = guess. Every derived fire figure contains a guessed alarm share.

| country | fire | tag | CO | tag |
|---|---|---|---|---|
| Australia | 0.29 | d | 0.24 | d |
| Austria | 0.28 | d | 0.96 | d |
| Belgium | 0.45 | d | 0.96 | d |
| Canada | 0.61 | d | 0.75 | d |
| Chile | 1.0 | d | 0.82 | d |
| Colombia | 0.14 | d | 0.44 | d |
| Costa Rica | 0.18 | d | 0.33 | d |
| Czechia | 0.43 | d | 1.25 | d |
| Denmark | 0.72 | d | 0.30 | d |
| Estonia | 2.7 | d | 2.4 | d |
| Finland | 0.84 | d | 0.75 | d |
| France | 0.43 | d | 0.49 | d |
| Germany | 0.36 | d | 0.50 | d |
| Greece | 0.38 | d | 0.56 | d |
| Hungary | 0.59 | d | 1.5 | d |
| Iceland | 0.71 | d | 0.61 | d |
| Ireland | 0.43 | d | 0.55 | d |
| Israel | 0.23 | d | 0.30 | d |
| Italy | 0.22 | d | 0.40 | d |
| Japan | 0.53 | d | 0.64 | d |
| South Korea | 0.39 | d | 0.94 | d |
| Latvia | 3.1 | d | 1.64 | d |
| Lithuania | 2.0 | d | 2.1 | d |
| Luxembourg | 0.30 | d | 0.50 | d |
| Mexico | 0.29 | d | 1.41 | d |
| Netherlands | 0.19 | d | 0.26 | d |
| New Zealand | 0.26 | d | 0.40 | d |
| Norway | 0.77 | d | 0.44 | g |
| Poland | 0.72 | d | 1.65 | d |
| Portugal | 0.23 | d | 0.89 | d |
| Slovakia | 0.48 | d | 1.29 | d |
| Slovenia | 0.16 | d | 0.84 | d |
| Spain | 0.23 | d | 0.70 | d |
| Sweden | 0.72 | d | 0.29 | d |
| Switzerland | 0.16 | d | 0.42 | d |
| Turkey | 0.17 | d | 2.35 | d |
| United Kingdom | 0.42 | d | 0.42 | d |
| United States | 1 | d | 1 | d |
| Argentina | 0.52 | d | 1.8 | d |
| Brazil | 0.28 | d | 0.10 | d |
| China | 0.25 | d | 1.8 | d |
| India | 0.38 | d | 0.35 | g |
| Indonesia | 0.35 | g | 0.45 | d |
| Nigeria | 0.8 | g | 1.2 | g |
| Philippines | 0.28 | d | 0.23 | d |
| South Africa | 2.0 | d | 1.4 | d |

The Baltic fire figures (Latvia 49, Estonia 30, Lithuania 27 deaths per million a year) are real: CTIF agrees. The alarm step pulls low-ownership Southern and Eastern Europe down to 0.16–0.7. CO is highest where coal stoves, braziers or flued water heaters are common.

## Least sure

1. **Nigeria**, both fields. There is no death registration. GBD's regional fire rate is modelled. Generator-CO estimates in the press differ by a factor of fourteen.
2. **China**, both fields. The figures rest on GBD regional and national modelling and on a guessed urban discount. Official fire counts are ten times lower.
3. **India**, both fields. NCRB under-records deaths, and most Indian burn deaths are cooking and clothing burns, which I excluded.
4. **South Africa**. The fire ratio is 5 before adjustments. Nearly all CO deaths are coded as undetermined intent.
5. **Chile** (fire). Registration counts 17 deaths per million, twice the US. Half carry no place code, and I found no fire-service total to check it.

Close behind: Argentina, where undetermined-intent fire deaths outnumber accidental ones; Lithuania's CO, which has a coding break in 2021; and Czechia, where registration and the fire service disagree by a factor of two.

## Could not open

- OWID's GBD fire series: 403, licence-restricted. The GBD results tool was not tried.
- factly.in's NCRB residential breakdown: 403.
- The WHO documentation PDF was not read; I applied the known age-format layout.
- Norway's own statistics, and fire-service totals for Chile and Argentina: not found.
- Search snippets only: alarm ownership in Denmark and England, Nigerian generator deaths. Recalled: Japan's alarm rate. Other alarm shares are guesses.
