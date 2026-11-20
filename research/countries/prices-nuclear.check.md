# Check: prices and nuclear

## What I checked

- **Validator.** Both files printed OK before and after the edits.
- **Method against the brief.** Definitions, anchor reproduction, one method per field, tags. Both files follow the brief. The prices file uses the brief's sources (ICP, Atlas GNI at elasticity 1, the HHS wage method). The nuclear file builds every country from the anchors' war rates.
- **Arithmetic, every country.** Prices: the ICP geometric mean, the uprating factor, the micromort value with its lo and hi rules, and the time value (wage × uprating × (1 − tax) ÷ exchange rate × 0.967). Nuclear: every nuclearNear sum and nuclearFar subtraction. I also redid the Western Europe anchor reproductions: weight × survival 0.739, fallout 0.60, GNI $53,275 giving 8.76, time value $15.61, price index 1.033. All match to rounding except Mexico's nuclearNear.
- **Prices sources re-opened.** All match the file:
  - World Bank Atlas GNI 2025 (20 countries);
  - open.er-api rates on 20 November 2026 (29 currencies);
  - ICP 2021 price levels for 15 countries;
  - WDI consumption PPP for 2021 and 2025 (26 countries; the uprating factors for JP, CN, IL, MX, CR, IS, KR, IN, NG, TR, CH, CL and DE reproduce);
  - Eurostat SES 2022 medians (13 countries);
  - ILOSTAT medians (15 countries);
  - ABS A$42.90, OECD average wages for Japan, Israel and Korea, Stats NZ NZ$35.96 (through the cited news report), and the OIA VSL of A$5.87M.

  The six price countries I examined most closely: Switzerland, Japan, China, Israel, India and Nigeria.
- **Nuclear sources re-opened.** All say what the file says:
  - ONN/Swift Centre: 1.3% by 2030.
  - Atlantic Council Global Foresight 2036: 447 respondents.
  - PS21 2015 survey.
  - Philippe and Stepanov 2023: 4.6M deaths with protection, 18M without, 70% from Ordos; 6,000 in South Korea and 1,600 in Japan.
  - FAS 2023 nuclear sharing: the host bases, and SNOWCAT support from the Czech Republic, Denmark, Hungary and Poland.
  - CRS IF12106 (13 October 2026).

  I recomputed six countries in full (Japan, South Korea, China, India, Turkey, Canada) and also Mexico, Australia, the Philippines and Israel.

## What I changed

1. **`nuclear.json`, Mexico nuclearNear.**
   - Forecast: 7.2e-6 → 7.6e-6 (range 7.6e-7 to 4.6e-5).
   - Pessimistic: 2.5e-5 → 2.6e-5 (range 5.2e-6 to 1.3e-4).
   - Why: the basis says 0.95 alive, but the old figures used 0.9.
   - The change is immaterial, but the figure contradicted its own basis. I updated the table in `nuclear.md` to match.
2. **`prices.json`, Western Europe timeValue anchor comment, and `prices.md`.** "EUR 1.15 per USD" now reads "USD 1.15 per EUR". The units were inverted; no figure changes.

I compared every entry before and after the rewrite. No other entry changed.

## Flags for the owner (judgment calls, left unchanged)

### Prices

1. **The ICP household category includes domestic services.** It is "furnishings, household equipment and routine household maintenance". Domestic services are very cheap in low-wage countries: the category stands at 0.41 of the US in India and 0.37 in Nigeria. The model's goods are tradable. Putting that category at 0.8 instead would give:
   - India 0.55 → 0.68;
   - Nigeria 0.56 → 0.72;
   - Indonesia 0.64 → 0.72;
   - Philippines 0.65 → 0.74;
   - South Africa 0.73 → 0.81;
   - Brazil 0.91 → 1.00.

   All of these stay inside the stated ranges. ICP publishes no finer split.
2. **The ICP equipment category is investment goods, not consumer electronics.** It drives China (1.54), Israel (1.67) and Argentina (1.43). The researcher already flags China.
3. **SES hourly earnings leave out 13th- and 14th-month pay.** This understates the time value by up to a sixth in Spain, Portugal, Austria and Greece, and partly in Italy and Belgium. The researcher notes only Spain and Portugal. The preset used the same SES data, so the anchor is consistent.
4. **The bridges for countries with no median differ.**
   - Israel: 0.6 × the OECD average wage.
   - Japan: 0.72 × the OECD average wage.
   - Korea: 0.82 × the labour force survey mean.

   Japan's bridge applied to Korea's OECD average wage (KRW 53.9M) gives $12.5 instead of $10.4. That is inside Korea's range, and the figure is tagged guess.
5. **The researcher's own flags matter most.**
   - Hardship dollars are not scaled by income, which distorts the hardship-to-death trade-off about 30-fold in India.
   - The westernEurope preset sits 20% below its own countries on the micromort value (7 against 8.8) and 7% above them on price (1.10 against 1.03).
   - Official VSLs fall 60–75% below the transfer: Australia 3.9, the UK about 2.6.
6. **Not verified: OECD tax rates.** The endpoint returned 403. By my own rough reckoning the UK's 20.9% looks 1–2 points high. That would move the UK time value by about 2%.

### Nuclear

7. **North Korea's share is low against the sources cited.**
   - The Atlantic Council survey names North Korea two-thirds as often as Russia (10% against 15%).
   - PS21 puts North Korea–US above Russia–NATO (6% against 4%).
   - The decomposition gives North Korea 0.10%/yr against Russia's 0.27%, a ratio of 0.37.

   At the survey ratio, South Korea's nuclearNear forecast would rise about 60% (0.00042 to about 0.0007), and Japan's a little. Both stay inside their ranges.
8. **India.** Every household counts (weight 1.0) in any India–Pakistan war of 100 or more warheads, though roughly half of those would land on India. Survival uses the US figure of 0.88, but 50 warheads on 1.4 billion people would kill a few percent. The two errors pull in opposite directions.
9. **Canada.** Every household counts whenever Canada is struck (0.7 of US-attack cases), so strikes on a few bases are treated as national collapse. This is defensible through the shared grid and supply chains. It is the one assumption that makes Canada 60% of the US figure.
10. **Fallout scales for plume-only countries are inconsistent.** The neutrals (Austria, Switzerland, Ireland) get 0.4–0.5. Remote countries whose counted households live near targets get 0.7–1.0 (Australia, the Philippines, Mexico), on the argument that counted households are exposed by definition. That argument applies to plume households too.
11. **Tags and reproduction for NATO Europe.** The figures are tagged derived although their weights are judgments; this is the anchors' convention. All of them move one-for-one with the anchors' 0.07% and 0.25% war rates. Western Europe reproduces 4–6% above the preset.
