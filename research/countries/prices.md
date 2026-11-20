# prices: price index, micromort value and time value for 46 countries

All figures are November 2026 US dollars at market exchange rates (20 November 2026, open.er-api.com, matching the ECB's 19 November reference rates). Every `basis` in `prices.json` carries its own arithmetic and source.

## Method

**priceIndex.** The World Bank's ICP 2021 database gives price levels relative to the US for food, for furnishings and household equipment, and for machinery and equipment. These three stand in for the model's goods: shelf-stable food, household hardware (containers, alarms, stoves), and electrical equipment (power banks, radios, batteries).

- Food and household goods are consumer prices that include US sales tax. I multiply them by 1.02 and 1.07: the average combined rate is 7.53% (Tax Foundation, January 2026), and groceries are mostly exempt.
- Equipment prices exclude VAT on both sides. I multiply them by 1 plus the local VAT or GST rate (recalled), which a household pays.
- The 2021 index is the geometric mean of the three.
- It is moved to November 2026 with three inputs: the World Bank's consumption price level for 2021 and 2025 (WDI PPP over exchange rate), relative CPI from the 2025 average to October 2026, and today's exchange rate.

CPI comes from the OECD where its series runs into 2026. It comes from fetched reports of the official releases for Argentina, Turkey and Nigeria. Elsewhere it is assumed, from 2025 rates, and is worth ±2%. Applied to the US itself, the formula gives 1.03, which is the US sales tax. The US stays at 1 by definition.

**micromortValueUsd.** 14.6 × (Atlas GNI per capita 2025 ÷ $88,810), using World Bank data updated on 11 November 2026, with elasticity 1 as the brief prescribes.

- Lo is the lower of 0.466 × mid (HHS's low/central ratio) and a transfer at elasticity 1.5.
- Hi is the higher of 1.53 × mid and a transfer by GNI per capita at PPP.

This rule reproduces the US range exactly (6.8–22.3) and the buenosAires range closely (national 0.98–5.2 against 1–6).

**timeValueUsdPerHour.** This is the HHS method: median hourly earnings less income tax and employee contributions.

| Countries | Median from | Uprated by |
|---|---|---|
| 24 EU and EFTA | Eurostat SES, October 2022 | Eurostat wage cost index to November 2026 |
| UK, Canada, Switzerland (check), 10 middle-income | ILOSTAT median hourly earnings (labour force surveys) | Recent wage growth |
| Australia, New Zealand | ABS (August 2025); Stats NZ (June 2026) | Recent wage growth |
| Japan, Korea, Israel, China, South Africa | Bridges from averages or snippets | Tagged `guess` |

- Tax rates are OECD Taxing Wages 2025: the mean of the rates at 67% and 100% of the average wage.
- Where the survey records take-home pay (Argentina EPH, Mexico ENOE, Turkey HLFS, Indonesia Sakernas, Chile ESI), I deduct nothing.
- India, Indonesia and Nigeria get an urban premium from ILOSTAT's urban/national mean earnings: 1.12, 1.07 and 1.15, net of the US's 1.03.
- The same steps applied to the US (CPS median $26.80, 22.9% tax) give $21.7, against HHS's $21.0. Every country is therefore multiplied by 0.967.
- Lo is half of mid, as in the anchors. Hi is 1.7 × mid, or 1.9 × mid where the figure is a `guess`.

## Anchor reproduction

| field | preset | anchor | reproduced | why it differs |
|---|---|---|---|---|
| priceIndex | us | 1 | 1.03 | US sales tax; kept at 1 |
| priceIndex | westernEurope | 1.10 (0.90–1.35) | 1.03 (0.83–1.29) | the preset was a judgment; the dollar is now 3% stronger against the euro than in 2025 |
| priceIndex | buenosAires | 1.40 (1.0–2.3) | 1.22 (0.85–2.0) | the preset leaned on a cross-border import at 5× its US price |
| micromortValueUsd | us | 14.6 | 14.6 | identity |
| micromortValueUsd | westernEurope | 7 (3.5–11) | 8.8 (4.1–13.4) | the preset averaged the transfer (8.5) with older official European values ($4–5M) |
| micromortValueUsd | buenosAires | 3.0 (1–6) | 2.4 (0.98–5.2) | the preset is for the capital, with a city income premium of about 1.25 |
| timeValueUsdPerHour | us | 21 | 21.7 before scaling | CPS median vs OEWS median, OECD vs HHS tax rate |
| timeValueUsdPerHour | westernEurope | 15 (7.5–26) | 15.6 (7.8–26.5) | close; the preset assumed USD 1.15 per euro (now 1.098) and a flat 29% tax |
| timeValueUsdPerHour | buenosAires | 5.5 (2.5–10) | 4.6 (2.3–7.8) | national urban median against the capital |

Western Europe means the population-weighted mean of the 17 Western European countries in the list.

## Results (middle figures)

d = derived, g = guess.

| Country | preset | priceIndex | micromort $ | time $/h |
|---|---|---|---|---|
| Australia | us | 1.14 d | 10.5 d | 22.6 d |
| Austria | WE | 1.12 d | 9.9 d | 16.1 d |
| Belgium | WE | 1.06 d | 9.8 d | 19.0 d |
| Canada | us | 1.15 d | 9.3 d | 17.2 d |
| Chile | BA | 0.80 d | 2.8 d | 4.2 d |
| Colombia | BA | 0.96 d | 1.3 d | 2.3 d |
| Costa Rica | BA | 1.19 d | 2.9 d | 4.5 d |
| Czechia | WE | 1.01 d | 5.4 d | 9.2 d |
| Denmark | WE | 1.20 d | 12.7 d | 23.5 d |
| Estonia | WE | 1.11 d | 5.3 d | 11.2 d |
| Finland | WE | 1.04 d | 9.1 d | 17.4 d |
| France | WE | 1.03 d | 8.0 d | 14.6 d |
| Germany | WE | 1.04 d | 9.9 d | 15.6 d |
| Greece | WE | 1.00 d | 4.2 d | 8.6 d |
| Hungary | WE | 1.09 d | 3.9 d | 6.5 d |
| Iceland | WE | 1.63 d | 14.7 d | 28.6 d |
| Ireland | WE | 1.10 d | 14.4 d | 20.4 d |
| Israel | WE | 1.45 d | 9.2 d | 15.7 g |
| Italy | WE | 0.98 d | 6.9 d | 11.9 d |
| Japan | WE | 0.91 d | 6.3 d | 9.2 g |
| South Korea | WE | 1.09 d | 6.2 d | 10.4 g |
| Latvia | WE | 1.06 d | 4.1 d | 8.4 d |
| Lithuania | WE | 1.03 d | 5.0 d | 8.8 d |
| Luxembourg | WE | 1.12 d | 15.7 d | 21.4 d |
| Mexico | BA | 1.09 d | 2.3 d | 2.6 d |
| Netherlands | WE | 1.05 d | 11.3 d | 19.7 d |
| New Zealand | us | 1.01 d | 7.7 d | 15.8 d |
| Norway | WE | 1.31 d | 16.0 d | 27.4 d |
| Poland | WE | 0.94 d | 4.2 d | 8.9 d |
| Portugal | WE | 0.99 d | 4.9 d | 6.6 d |
| Slovakia | WE | 0.99 d | 4.3 d | 8.4 d |
| Slovenia | WE | 1.03 d | 5.8 d | 10.6 d |
| Spain | WE | 0.97 d | 6.1 d | 10.7 d |
| Sweden | WE | 1.06 d | 10.4 d | 18.0 d |
| Switzerland | WE | 1.33 d | 18.1 d | 38.8 d |
| Turkey | BA | 1.06 d | 2.7 d | 4.5 d |
| United Kingdom | WE | 1.02 d | 9.0 d | 18.4 d |
| United States | us | 1 d | 14.6 d | 21 d |
| Argentina | BA | 1.22 d | 2.4 d | 4.6 d |
| Brazil | BA | 0.91 d | 1.7 d | 2.1 d |
| China | BA | 1.04 d | 2.3 d | 4.0 g |
| India | BA | 0.55 d | 0.45 d | 0.75 d |
| Indonesia | BA | 0.65 d | 0.84 d | 0.79 d |
| Nigeria | BA | 0.56 d | 0.22 d | 0.36 d |
| Philippines | BA | 0.65 d | 0.80 d | 1.3 d |
| South Africa | BA | 0.73 d | 1.0 d | 2.3 g |

## Spot checks against retailers

I fetched one retailer's listings: Jumia Nigeria.

- Local-brand 10,000 mAh power banks cost ₦9,200–17,980, which is $7–13, about half the US price.
- A Duracell AA 4-pack costs ₦7,500, which is $5.5, about the US price.
- Both bracket the formula's 0.56.

For China, search snippets give a Xiaomi 10,000 mAh power bank at ¥61–169 ($9–25). Its US equivalent is about $20–30. That points below the formula's 1.04, so China's lo is set at 0.5.

Amazon US returned 503, so the US comparison prices are from memory.

## Countries I am least sure of

1. **China.** ICP's equipment price level (1.54) and food level (1.11) give a price index of 1.04. Domestic generics sell at half the US price or less. The time value rests on average wages with an assumed median ratio and hours.
2. **Nigeria.** The CPI was rebased in 2025. The naira has swung from 401 to 1,518 to 1,353 per dollar. Wage uprating from 2024 is a guess. The micromort value spans 0.03–1.5 depending on elasticity.
3. **Argentina.** The 2021 PPPs were measured at an official rate far from the market rate. Inflation is 33% a year. Every month of drift between prices and the peso moves the price index and the time value by about 2%.
4. **Turkey.** The same problem as Argentina, at 30% inflation. Since 2023 the lira's real appreciation has made goods dear in dollars, and electronics carry extra consumption tax.
5. **Japan and Korea, time value.** I found no median. Japan is bridged from the OECD average wage, Korea from a reported mean wage. The weak yen and won (160 and 1,331 per dollar) drive both their price indices and their time values.

## Things the owner should know

- **Hardship is still in US dollars.** The micromort and time values now vary with income, but hardship dollars do not. In India a micromort is worth 0.45 against 14.6 in the US. So, against death, hardship weighs about 30 times more in India than in the US. Scaling hardship by the same income ratio would fix that.
- **The westernEurope preset no longer matches its countries.** It sits 20% below its own countries on the micromort value (7 against 8.8) and 7% above them on the price index (1.10 against 1.03).
- **Official VSLs can be far below the transfer.** Australia's is A$5.87M (US$3.9M, read on the OIA page), against the transfer's 10.5. The UK's is about £2M (snippet only). Use them instead and these countries fall by 60–75%.

## Sources I could not open

- IMF WEO DataMapper (403).
- Amazon US (503).
- Two South African reports of Stats SA median earnings (403).
- Xiaomi's shop page (403).
- The Stats NZ release (body not rendered; read in a news report).
