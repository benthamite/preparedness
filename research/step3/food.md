# food: reasoning

One person-day of food is 2,100 kcal (the relief planning figure; search snippet, Sphere handbook not opened). Source URLs are in `food.json`.

## Baseline: 14 days (4 to 30)

What was measured:

- Kitchen inventories. 100 food-secure New Jersey families held a mean of 33.2 days of calories (SD 22.0, range 8.1 to 125.2). 60 low-income households held 17.1 and 16.7 days (SD 13 to 14). Abstracts only.
- Self-report, 572 US adults, 2014: 4.2% under 3 days, 3.7% exactly 3 days, 46.9% more than 3 days but under a month, 45.3% a month or more.
- 82.0% say they hold three days of non-perishable food (American Housing Survey 2013).

Arithmetic. Assuming a lognormal spread, median = mean / sqrt(1 + (SD/mean)^2): 33.2/1.20 = 28 and 17/1.28 = 13, so a mixed population sits near 20. Times 0.75 for calories nobody eats as meals (oil, flour, sugar, condiments; judgment), times 0.9 for flats and small households (judgment) = 13.5, rounded to 14.

Usable share in an outage, from the same inventory study: calories fall 35% without energy for cooking, 27% after five days without power, 28% without water, 38% without water and cooking. If half the chilled calories also need cooking, an all-electric home in a long blackout keeps 100 - 35 - 27 + 13 = about 50% (40 to 60), or about 7 days.

The spread matters more than the median. Among the low-income households, 40 to 47% would be out of food three days after losing resources. Households holding under a week are the ones the pantry ladder helps, so the baseline should be a reader input.

## Mortality curve (healthy adult, no food, water available)

- Days 1 to 21 are a guess under a measured ceiling. There were no deaths in 6,265 water-only fasting days (Finnell 2018) or in 12,275 days at 200 to 250 kcal (659x5 + 530x10 + 196x15 + 37x20; Wilhelmi de Toledo 2019). The rule of three gives under 3/18,540 = 162 micromorts a day. I set 0.2 rising to 10, for fainting, risky food-seeking and electrolyte trouble. Texas 2021 recorded no hunger deaths.
- Late days come from the 1981 hunger strike. Of 22 men with known durations none died before day 46; ten died on days 46, 59, 60, 61, 61, 61, 62, 66, 71 and 73. For these lean men that is about 3 deaths in 200 person-days (15,000 a day) on days 46 to 60 and far more after. I shift the curve 15 to 20 days later for average body fat and keep it steep because there is no medical care.
- Cumulative risk on my medians: 0.8% by day 45, 8% by day 60, 32% by day 75, 80% by day 90.

## Hardship curve

No willingness-to-pay study was found, so the curve is a guess. I multiply a disability weight by an assumed $500 per healthy day: weights of 0.05, 0.10, 0.16, 0.24, 0.36 and 0.60 give $25, 50, 80, 120, 180 and 300. Check: day 1 sits below FEMA's $66 per person-day for tap water. Supervised fasters report mostly mild symptoms, which keeps day 1 low; involuntary, open-ended hunger is worse, hence the wide highs.

## Multipliers (all guesses)

- age75plus 25, age60to74 6. Dutch famine: 20,000 deaths among 4.3 million, 60% aged 65 or over. If that group was 7% of the population (recalled), its rate was 12,000/301,000 = 4.0% against 8,000/4.0 million = 0.2%, a ratio of 20. The split between the two profiles is judgment.
- child 3. Emergency thresholds put under-five mortality at twice the all-age rate (snippet); young children tolerate fasting poorly.
- criticalDrug 40. EPIDIAR: severe hypoglycaemia in Ramadan ran at 0.14 a month in type 1 and 0.03 in type 2 diabetes, so 0.47% and 0.1% a day. Times an assumed 2% fatal: 93 and 20 micromorts. Weighted 1.8 million to 11 million users (recalled): 30. Times 40% of the profile: 12 a day. Divided by the healthy early-day 0.3: 40.
- limitedMobility 3. No data.

## A structural problem: rationing

The engine eats full rations, then nothing. Real households stretch their stock. Half rations for 24 weeks killed none of 36 men in the Minnesota experiment. Official rations of 400 to 900 kcal for five months killed 0.47% of the western Netherlands (under-65s: 2,000 micromorts over 150 days, 13 a day). Under the engine's rule, 90 days of food in a 180-day window means certain death, so the early bulk-staples rungs earn nothing and the greedy ranking cannot reach the later ones. The proposed fix is the first open question.

## Items

Price is per person-day unless stated. "Read" means on a retailer or maker page I fetched.

| Entry | Price | Arithmetic |
|---|---|---|
| pantry-no-cook | $6 (4 to 9), guess | Basket of 2,235 kcal = $5.51; only peanut butter read ($2.69/lb) |
| pantry-cook | $2.20, derived | BLS October 2026 per lb: rice $1.101, pasta $1.384, beans $1.680. $0.63 + 0.52 + 0.57 = $1.72, plus $0.50 oil and seasoning |
| freeze-dried-meals | $39, read | $449 / (14 x 1,720 kcal) x 2,100 |
| bulk-staples | $2.20, derived | $0.84 rice + $0.92 beans + $0.44 packaging ($11 per 25 person-days, guess) |
| ration-bars | $7.50 per 3,600 kcal, read | $4.40 per person-day |
| multivitamins | $12 per person-year, snippet | 365/500 x $16 |
| camp-stove | $30 per kit, read | $19.50 + 4 x $1.79 + $3 |
| stove-fuel | $1.79 per canister, read | $21.49/12. 227 g x 49.5 MJ/kg = 10,640 BTU = 1.33 h at 8,000 BTU/h |
| grill | $171, snippet | $149 + 2 x $10.92 |
| kitchen-sundries | $22, guess | $14.99 + $3 + $4 |
| infant-formula | $8 per infant-day, read | 28 fl oz x $0.29 |
| pet-food | $0.40 per pet-day, snippet | $1.50/kg x 0.23 kg |

Other numbers:

- everydayShare 0.9 for the pantry: 10% of each two-year cycle wasted, about 5% a year. No data found.
- Cooking fuel: oats, two pots and hot drinks for three people take about 4,500 BTU a day, 0.56 h at full output, 0.19 h each; I use 0.25. Boiling takes 0.09 h per litre (5 min 15 s, measured by a reviewer).
- Can already cook in a power cut: 1 - (1 - 0.38 gas)(1 - 0.70 grill x 0.7 usable) = 0.68; about 0.5 if gas is off too. The 0.7 is a guess.
- Stove comfort value ($3 per person-day), infant harms and pet harms are guesses.

## Assumptions about other researchers' numbers

- Water for cooking and rehydrating (1.3 to 1.7 litres per person-day) comes from the water researcher's stock.
- Combustion risk of the stove and grill is not included; I name only the cook capability.
- The pandemic and payments value of a food store is not included.
- $500 per healthy day is mine; rescale the hardship curve to the model's value.

## Could not open

- Full texts of the two kitchen-inventory papers and the Hiatt survey (paywalled; abstracts read).
- Church of Jesus Christ store (redirects by location): sealed rice and bean prices.
- Mountain House, Augason Farms, Gas One, Weber, Costco, Chewy (HTTP 429); Walmart, Sam's Club (robot check).
- USDA FNS food-plan costs and FSIS shelf-life page (HTTP 403).
- PubMed and MDPI (read through Europe PMC instead).
- Gerhold et al. 2019 on German household stocks (not found).

Details are in `blockedSources`.
