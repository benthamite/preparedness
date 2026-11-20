# Grid reliability by country

Fields: `localOutage.probability` and `localOutage.durationFactor` for the 46
countries in `data/countries.mjs`.

## Method

One conversion for every country. It is the one the Western Europe and Buenos
Aires presets used.

1. Take SAIFI (unplanned interruptions per customer a year) and CAIDI (SAIDI ÷
   SAIFI). Exclude major or exceptional events. Use figures for urban customers
   where a source gives them.
2. Assume interruption lengths are log-normal with σ = 1.2 and mean CAIDI. The
   share lasting 4 h or more is S4 = 1 − Φ((ln 4 − ln CAIDI + 0.72) / 1.2).
3. The rate of long local outages is SAIFI × S4. Multiply it by 0.9 when the
   figure is national: that is the AHS 2023 urban/all ratio for the United
   States.
4. Add a rate for same-day system blackouts, which the indices exclude:
   - 1.15% a year in Europe, as in the preset;
   - 0.3–1% elsewhere in the rich world;
   - 0.5–5% in middle-income countries, from each grid's record.
5. p = 1 − exp(−rate). The range divides and multiplies the rate by 2 where
   the data are good, and by 2.5 or 3 where they are weaker.

`durationFactor` uses the same log-normal. It is the mean length of a
4-hour-plus outage at the country's CAIDI, divided by the same at the
preset's reference CAIDI:

| preset | reference CAIDI | source |
|---|---|---|
| United States | 2.0 h | EIA |
| Western Europe | 0.83 h | CEER, pooled |
| Buenos Aires | 1.9 h | ENRE city comunas |

The factor moves far less than CAIDI does, because every counted outage is
already at least 4 h long. CAIDI 0.4 h gives 0.9, 3.4 h gives 1.2, and 10 h
gives 1.9. For Nigeria, South Africa and India I raised it by judgement for
slow repairs.

**Sources, by priority:** CEER 6.1 Tables 8 and 16 (2014–16 means; the
Western Europe anchor's source); EIA; national regulators or utilities
(Electricity Canada, ENRE, ANEEL, SEC, SSPD, NEA/CEC, PLN, Meralco); Doing
Business 2020 largest-city SAIDI/SAIFI (main input for Belgium, Iceland,
Israel, Japan and Korea, a cross-check elsewhere); Enterprise Surveys as a
further check. Where CEER gives only figures including exceptional events
(Estonia, Finland, the Netherlands, Norway, Slovakia, Slovenia) I scaled
SAIFI by 0.85 and CAIDI by 0.8, ratios from countries reporting both.

## Why 4 hours, not 6

The brief says 6 hours, but the Western Europe and Buenos Aires anchors were
built at 4 h, and the US one from a 6-hour survey (AHS). At 4 h the
conversion reproduces all three; at 6 h EIA's indices give 0.066 against
0.11, because the survey shows more long outages than the log-normal
implies. So 4 h on these indices is the presets' scale, and the brief's text
should say so.

## Anchor reproduction

| preset | preset figure | reproduced | how |
|---|---|---|---|
| us | 0.11 (0.06–0.16) | 0.113 (0.059–0.21) | EIA 2021–25 without major event days: SAIFI 1.06, CAIDI 2.0 h, S4 12.0% → 0.127; + 0.008 blackouts; × 0.9 urban |
| westernEurope | 0.03 (0.012–0.07) | 0.0325 (0.016–0.065) | CEER per country, population-weighted over the preset's ten countries; 0.042 over all 26 European countries on this preset |
| buenosAires | 0.25 (0.1–0.5) | 0.22 (0.1–0.45) | ENRE semester 57: city comunas give 11% (Edenor) and 35% (Edesur), weighted 24%; + 5% force majeure − 7.5% heat-wave cuts; the preset rounded up |

The three duration factors are 1 by construction. The log-normal's
conditional medians are 6.3 h, 5.6 h and 6.2 h. The preset medians are 8 h,
6 h and 7.2 h. Their order and size broadly agree.

One correction to the record: the preset's basis calls its CEER figures
"including exceptional events". The values it quotes (Germany 12.8, France
48.7, Italy 37.1 minutes) are from Tables 8 and 16, which exclude them.
Excluding them is the right choice for this hazard.

## Results (middle figures)

| country | preset | probability | tag | duration factor | tag |
|---|---|---|---|---|---|
| Australia | us | 0.065 | derived | 0.92 | derived |
| Austria | WE | 0.025 | derived | 0.99 | derived |
| Belgium | WE | 0.028 | derived | 1.04 | derived |
| Canada | us | 0.14 | derived | 1.01 | derived |
| Chile | BA | 0.23 | derived | 1.03 | derived |
| Colombia | BA | 0.33 | guess | 0.9 | derived |
| Costa Rica | BA | 0.12 | guess | 1.0 | guess |
| Czechia | WE | 0.052 | derived | 1.0 | derived |
| Denmark | WE | 0.017 | derived | 0.96 | derived |
| Estonia | WE | 0.08 | derived | 1.15 | derived |
| Finland | WE | 0.039 | derived | 0.97 | derived |
| France | WE | 0.05 | derived | 1.13 | derived |
| Germany | WE | 0.014 | derived | 0.89 | derived |
| Greece | WE | 0.065 | derived | 1.03 | derived |
| Hungary | WE | 0.068 | derived | 1.09 | derived |
| Iceland | WE | 0.044 | derived | 1.13 | derived |
| Ireland | WE | 0.067 | derived | 1.08 | derived |
| Israel | WE | 0.051 | derived | 0.97 | derived |
| Italy | WE | 0.021 | derived | 0.91 | derived |
| Japan | WE | 0.006 | derived | 1.13 | derived |
| South Korea | WE | 0.0043 | derived | 0.99 | derived |
| Latvia | WE | 0.08 | derived | 1.02 | derived |
| Lithuania | WE | 0.044 | derived | 1.08 | derived |
| Luxembourg | WE | 0.024 | derived | 1.05 | derived |
| Mexico | BA | 0.11 | guess | 0.9 | guess |
| Netherlands | WE | 0.021 | derived | 1.03 | derived |
| New Zealand | us | 0.13 | derived | 0.97 | derived |
| Norway | WE | 0.048 | derived | 0.99 | derived |
| Poland | WE | 0.13 | derived | 1.05 | derived |
| Portugal | WE | 0.043 | derived | 0.99 | derived |
| Slovakia | WE | 0.034 | derived | 0.96 | derived |
| Slovenia | WE | 0.027 | derived | 0.94 | derived |
| Spain | WE | 0.037 | derived | 0.99 | derived |
| Sweden | WE | 0.056 | derived | 1.04 | derived |
| Switzerland | WE | 0.017 | derived | 1.0 | derived |
| Turkey | BA | 0.3 | guess | 1.05 | guess |
| United Kingdom | WE | 0.045 | derived | 1.11 | derived |
| United States | us | 0.11 | derived | 1.0 | derived |
| Argentina | BA | 0.25 | derived | 1.0 | derived |
| Brazil | BA | 0.37 | derived | 1.01 | derived |
| China | BA | 0.13 | derived | 1.2 | derived |
| India | BA | 0.55 | guess | 1.2 | guess |
| Indonesia | BA | 0.22 | derived | 0.97 | derived |
| Nigeria | BA | 0.95 | derived | 2.5 | guess |
| Philippines | BA | 0.18 | derived | 0.99 | derived |
| South Africa | BA | 0.5 | guess | 1.6 | guess |

The ranges are in `grid.json`.

Germany, Switzerland, Denmark, Italy and the Netherlands are mostly the
1.15% blackout allowance. Britain and France are higher because their cuts
last longer; Poland and the Baltics because they have more of them.

## Notable judgements

- **CEER ends in 2016.** ACER's 2021–23 SAIDI uses mixed definitions, so it
  only widened ranges (Greece improved by about 40%).
- **France.** CEER's French SAIFI (0.08) uses another definition. I used
  Enedis's 0.5–0.6 long cuts a year instead.
- **Doing Business fails for middle-income cities.** Buenos Aires converts to
  0.05 and Istanbul to 0.94, so it is not the main input there.

## Countries I am least sure of

1. **Turkey.** There is no regulator series. Doing Business (0.94) and
   Enterprise Surveys (33% of firms with any outage) disagree by a factor of
   three.
2. **India.** Metros convert to about 0.18, while smaller cities face daily
   cuts. The 0.55 figure rests on a 30/70 weighting and on survey snippets.
3. **South Africa.** Load shedding has ended, and municipal failure rates are
   unmeasured.
4. **Mexico.** No CFE distribution SAIDI was found, and Doing Business looks
   wrong.
5. **Costa Rica.** Doing Business (0.04) conflicts with Enterprise Surveys
   (51% of firms had an outage).

Colombia is close behind. The log-normal tail is unreliable when most
interruptions are very short.

## For the model's owner

- **The event can only happen once a year.** For Nigeria the rate is dozens
  of long cuts a year. India outside the metros, South Africa, Turkey, Brazil
  and Colombia are at or near one a year. A probability capped at 1 misses
  most of that harm, so a rate field would serve these countries better.
- **Heat-wave cuts.** The Buenos Aires anchor removed heat-wave cuts because
  its heatWave hazard carries them. I removed nothing for the other
  middle-income countries. Where their indices include heat-driven cuts
  (India, Brazil, Mexico, Turkey) and hot summers is ticked, some outages are
  counted twice.

## Sources I could not open

CEER's 7th report (too large), the AER reports (timed out), Enerjisa
(refused; no EPDK series found), Enterprise Surveys country pages
(JavaScript), Electricity Canada's continuity report (paywalled), India's
CSRD report, and CFE and ARESEP indices. Snippet-only figures are marked in
the bases.

## Checker's notes

- **Israel** changed from 0.055 to 0.051: the basis's own rate (0.052)
  converts to 0.051.
- **France.** The cited Selectra page gives no long-cut frequency. It gives
  2.08 cuts per customer in 2023, short cuts included, and 72.9 minutes. So
  the SAIFI of 0.55 is unsourced. The probability is kept because it barely
  depends on SAIFI when SAIDI is fixed (0.036–0.056 for SAIFI 1.0–0.4). The
  duration factor would fall from 1.13 to about 1.0 at SAIFI 1.0.
- **India.** Enterprise Surveys show 15–20% of Indian firms with any outage
  (2022, 2025), which points below 0.55. The series ranks countries
  erratically (Australia 57%), so the figure is left as the researcher's
  guess.
- Re-checked against the sources: CEER 6.1 Tables 7, 8, 15 and 16 (every
  European input); Doing Business 2020 via the World Bank API; Electricity
  Canada, ANEEL, NEA/CEC, PLN, Meralco and Eskom. Every converted figure was
  recomputed; all others match to rounding.
