# banking: bankingCrisis.forecast and .pessimistic for 46 countries

## Method

**Event-year.** A calendar year counts if any of these holds:

- the currency's December-average dollar rate is 30% or more below the previous December's, measured in dollars per unit (BIS monthly averages, `WS_XRU`; for the US, the BIS broad effective index);
- December year-on-year inflation is 33.3% or more, which is a 25% loss of purchasing power (BIS `WS_LONG_CPI`, or World Bank annual averages where BIS has no series: Nigeria, Costa Rica);
- a national deposit freeze, bank holiday or withdrawal limit lasting three days or more begins (Laeven and Valencia, WP/18/206). I added India's 2016 demonetisation.

All series were pulled from the BIS and World Bank APIs and computed, not copied.

**History.** I count currency-or-freeze years in 1995–2025. Year *y* is weighted by 0.5^((2025−*y*)/15), which gives 16.86 weighted years. Several kinds of event fall outside the window or are excluded: transition-era events in former planned economies (all before 1995), China's 1994 exchange-rate unification (Laeven and Valencia list no crisis there), and pre-euro national currencies.

**Shrinkage.** Each country's rate is (0.5 + weighted events) / (0.5/*g* + 16.86), a gamma-Poisson posterior. Its prior mean *g* is the pooled, weighted rate of these 46 countries in the country's current S&P band:

| Band | *g* | Pooled record 1995–2025 |
|---|---|---|
| AAA/AA+, plus GBP and JPY (reserve currencies) | 0.2% | 0 events in 310 country-years; set equal to the US preset |
| AA to A− | 1.0% | Korea 1997 and 2008, Iceland 2008 |
| BBB | 1.75% | Indonesia 1997 and 1998, Mexico 1995, India 2016 |
| BB | 6.5% | Brazil ×3, South Africa ×2, Turkey ×8 |
| B | 25% | Argentina ×8, Nigeria ×4 |
| Euro AAA/AA+, AA to A−, BBB | 0.14%, 0.35%, 0.7% | Greece 2015 and Cyprus 2013: about 0.35% a year over the euro area |

**Present conditions.** They come in through the current rating. Three countries also get a stated multiplier on the history-based rate:

- Argentina ×0.84: the central bank's October survey expects 1,985 pesos per dollar in October 2027. A 30% loss from 1,551 would need 2,216, which is about 0.27 at 15–20% volatility.
- Turkey ×0.6: the lira is managed and lost 15% over the year; the five-year CDS was 217 points in August 2026.
- Nigeria ×0.7: the naira floats, rose 13% over the year, and inflation is 14%.

Where inflation is close to 33.3% now, I add the chance that inflation alone crosses it in the next 12 months: Argentina 0.2 (33.1% in October 2026), Turkey 0.25 (29.77%, with 2.58% in October alone).

**Pessimistic and ranges.** The pessimistic odds are the forecast odds × 10^(0.39 − 0.25(log10 odds + 0.75)). This curve passes through the three preset pairs: 0.2%→1.5%, 0.3%→2%, 15%→30%. The 5th and 95th percentiles of both fields are interpolated in log *p* from the presets' own ranges.

## Anchors

| Preset | Preset forecast / pessimistic | Reproduced | Comment |
|---|---|---|---|
| us | 0.002 / 0.015 | 0.0019 / 0.014 | Consistent by construction: the AAA band prior equals the preset, and 0 events in 310 country-years allows it. |
| westernEurope | 0.003 / 0.02 | 0.0029 / 0.019 | Population-weighted mean of 16 countries (approximate populations); the euro priors come from the pooled freeze rate, not from the preset. |
| buenosAires | 0.15 / 0.30 | **0.42 / 0.55** | Not reproduced; see below. |

Buenos Aires differs for three reasons.

1. **More events.** BIS December averages put the peso's 2016 fall at 30.1% and 2024 at 37.1%, and the freeze of December 2001 is a year of its own. That gives eight currency-or-freeze years in 1995–2025, where the preset found five.
2. **Recent years weigh more.** Argentina's recent years were its worst.
3. **The preset misread inflation.** Its source's "23.6% in the year to September" is the January–September 2026 cumulative. INDEC's year-on-year rate was 33.4% in September and 33.1% in October ([Forbes Argentina](https://www.forbesargentina.com/money/subio-inflacion-octubre-ubico-22-n102387)). That is right at the 25% loss of purchasing power in the definition.

Counting currency and freezes only, my Argentina figure is 0.27.

**Checker.** Reasons 1 and 3 need correcting.

- The 2024 "event" is the devaluation of 13 December 2023 counted twice. The December 2023 average mixes 12 days at about 365 pesos with 19 at about 805. End-of-December rates (808.48 to 1,032.5, BIS daily) give a 21.7% loss in 2024. Without 2024 the history gives 0.27. The final currency-or-freeze figure (0.27, from the survey) is unchanged.
- The 23.6% is indeed a cumulative, mislabelled in a source claim of the step-3 file. But the preset's 0.15 uses no inflation figure. Its definition excludes "inflation that deposit interest roughly matches". So the gap from 0.27 to 0.42 is a difference of definition, not a misreading. On the preset's own definition the comparison is 0.27 against 0.15.

## Results (middle values)

F = forecast, P = pessimistic. Tags: d = derived, g = guess.

| Country | F | P | Tags | Country | F | P | Tags |
|---|---|---|---|---|---|---|---|
| Australia | 0.0019 | 0.014 | d/g | Latvia | 0.0031 | 0.021 | d/g |
| Austria | 0.0013 | 0.011 | d/g | Lithuania | 0.0031 | 0.021 | d/g |
| Belgium | 0.0031 | 0.021 | d/g | Luxembourg | 0.0013 | 0.011 | d/g |
| Canada | 0.0019 | 0.014 | d/g | Mexico | 0.017 | 0.069 | d/g |
| Chile | 0.0075 | 0.039 | d/g | Netherlands | 0.0013 | 0.011 | d/g |
| Colombia | 0.020 | 0.080 | d/g | New Zealand | 0.0019 | 0.014 | d/g |
| Costa Rica | 0.020 | 0.080 | d/g | Norway | 0.0019 | 0.014 | d/g |
| Czechia | 0.0075 | 0.039 | d/g | Poland | 0.0075 | 0.039 | d/g |
| Denmark | 0.0019 | 0.014 | d/g | Portugal | 0.0031 | 0.021 | d/g |
| Estonia | 0.0031 | 0.021 | d/g | Slovakia | 0.0031 | 0.021 | d/g |
| Finland | 0.0013 | 0.011 | d/g | Slovenia | 0.0031 | 0.021 | d/g |
| France | 0.0031 | 0.021 | d/g | Spain | 0.0031 | 0.021 | d/g |
| Germany | 0.0013 | 0.011 | d/g | Sweden | 0.0019 | 0.014 | d/g |
| Greece | 0.013 | 0.058 | d/g | Switzerland | 0.0019 | 0.014 | d/g |
| Hungary | 0.011 | 0.052 | d/g | Turkey | 0.32 | 0.48 | g/g |
| Iceland | 0.014 | 0.062 | d/g | United Kingdom | 0.0019 | 0.014 | d/g |
| Ireland | 0.0013 | 0.011 | d/g | United States | 0.0019 | 0.014 | d/g |
| Israel | 0.0075 | 0.039 | d/g | Argentina | 0.42 | 0.55 | g/g |
| Italy | 0.0057 | 0.032 | d/g | Brazil | 0.072 | 0.19 | d/g |
| Japan | 0.0019 | 0.014 | d/g | China | 0.0075 | 0.039 | d/g |
| South Korea | 0.018 | 0.075 | d/g | India | 0.026 | 0.094 | d/g |
| | | | | Indonesia | 0.023 | 0.088 | d/g |
| | | | | Nigeria | 0.12 | 0.27 | g/g |
| | | | | Philippines | 0.011 | 0.052 | d/g |
| | | | | South Africa | 0.052 | 0.15 | d/g |

Countries with events since 1995, and the size of the December-on-December fall:

| Country | Events |
|---|---|
| Korea | 1997 (44%), 2008 (32%) |
| Iceland | 2008 (50%) |
| Greece | 2015 (freeze) |
| Mexico | 1995 (48%) |
| Indonesia | 1997 (51%), 1998 (37%) |
| India | 2016 (withdrawal limits) |
| Brazil | 1999 (35%), 2002 (35%), 2015 (32%) |
| South Africa | 2001 (34%), 2008 (32%) |
| Turkey | 1995–99, 2001, 2021, 2023, plus inflation-only years 2000, 2022 and 2024 |
| Argentina | 2001 (freeze), 2002, 2016, 2018, 2019, 2022–24, plus inflation-only years 2020 and 2021 |
| Nigeria | 1999, 2016, 2023, 2024 |

No other listed country has had an event since 1995.

## Least sure

1. **Argentina.** Inflation is almost exactly on the 33.3% line, so the answer depends on a hair's breadth of the definition. The survey has under-forecast monthly inflation (1.8% expected for October, 2.2% printed). The plausible range is 0.25–0.67.
2. **Turkey.** Most of the 0.32 is the chance that inflation stays above 33%. The ×0.6 multiplier for today's policy is a judgment.
3. **Nigeria.** The ×0.7 for the float is a judgment. Three of its four events were step devaluations of a peg that no longer exists.
4. **India.** Counting demonetisation's withdrawal caps as an event raises the figure from 1.1% to 2.6%.
5. **Brazil.** Its 7% rests on three falls just over the line (32–35%). A rule a few points different would halve it or raise it by half.

## What the owner should know

- **Chronic inflation.** The purchasing-power criterion makes chronic inflation of about 30% an event, with no crisis behind it. Argentine and Turkish deposits earn close to inflation, so the 35% loss share attached to bankingCrisis overstates harm in that branch. Currency-or-freeze only: Argentina 0.27, Turkey 0.10.
- **Unlisted countries.** `presetFor` gives every unlisted middle-income country the buenosAires figure of 0.15. Listed middle-income countries without Argentina's history come out at 0.7–2.6%. A default near 1–2% would be closer for Malaysia, Thailand, Peru or Vietnam.
- **December averages understate.** They miss falls that partly reverse within the year: Colombia lost 37% over the 12 months to August 2015, Poland 36% to March 2009, the Philippines 38% to January 1998. Counting those would roughly double those countries' figures.

## Sources

Fetched or queried:

- BIS exchange rates, consumer prices and effective exchange rates (`https://stats.bis.org/api/v2/data/dataflow/BIS/WS_XRU/1.0/`, `WS_LONG_CPI`, `WS_EER`).
- World Bank inflation (`FP.CPI.TOTL.ZG`).
- [Laeven and Valencia, IMF WP/18/206](https://www.imf.org/-/media/files/publications/wp/2018/wp18206.pdf): definitions, Table 1 crisis dates, and the text on the 8 freezes and 6 holidays.
- [Wikipedia, List of countries by credit rating](https://en.wikipedia.org/wiki/List_of_countries_by_credit_rating): S&P column.
- [Bloomberg Línea](https://www.bloomberglinea.com/mercados/asi-cerro-el-riesgo-pais-en-america-latina-en-agosto-argentina-y-uruguay-en-los-extremos/): Latin American spreads, August 2026.
- [Forbes Argentina](https://www.forbesargentina.com/money/subio-inflacion-octubre-ubico-22-n102387): INDEC, October 2026.
- [Perfil](https://perfil.com/economia/rem-del-bcra-el-precio-que-le-ponen-a-la-inflacion-y-al-dolar-45-actores-del-mercado-a9fcc7k2dRuP): REM, October 2026.
- [A News](https://www.anews.com.tr/turkey/2026/11/03/turkiyes-annual-consumer-inflation-stands-at-2977-in-october/amp): TurkStat, October 2026.
- [Hürriyet Daily News](https://www.hurriyetdailynews.com/turkiyes-cds-falls-to-lowest-level-in-6-5-months-226086): Turkey CDS.
- [The Gazette](https://gazettengr.com/nigerias-inflation-rate-dropped-to-14-06-in-october-nbs/): Nigeria NBS, October 2026.
- [Wikipedia, 2016 Indian banknote demonetisation](https://en.wikipedia.org/wiki/2016_Indian_banknote_demonetisation).

Not opened:

- IMF DataMapper API (Access Denied).
- worldgovernmentbonds.com CDS table (loaded by script).
- The Laeven–Valencia spreadsheet with per-episode freeze dates.
- Fitch and Moody's columns of the ratings list.

Search snippets only: Colombia's S&P downgrade to BB− (April 2026) and Hungary's affirmation (May 2026). Some notes are recalled and marked "(recalled)".

## Checker's notes

No figure was changed. Re-checked: BIS December-on-December falls for 12 currencies, recent 12-month moves for 10, rolling-window worst falls for 10, the S&P ratings of all listed countries, every posterior and pessimistic figure, INDEC, REM, TurkStat, NBS and the Turkish CDS article. All match to rounding. Notes added in `banking.json`:

- **Argentina:** the 2024 double count (above). The same REM survey expects 21.8% inflation over the next 12 months, against which the 0.2 inflation-only chance looks generous.
- **Nigeria:** 1999 is a unification of the official rate, like China's 1994 one, which is excluded. Laeven and Valencia do not date a crisis in 1999. Treating the two alike gives 0.11 instead of 0.12.
