# The preparedness model

This file specifies the model behind the ranked preparedness list. It is the
contract between the research files in `research/`, the data file
`data/model.json`, and the engine in `src/model.mjs`.

## What the model answers

Given a household (who lives there, where, in what kind of home, and how each
member's life and time are to be valued) and a view of how likely different
catastrophes are, which preparedness purchases and actions avert the most harm
per dollar, and in what order should they be acquired?

The output is an ordered list. Each entry shows its cost, the hardship it
averts (dollars a year), the deaths it averts (micromorts a year), and a
benefit-cost ratio. Everything the reader can change (household, location,
probabilities, the dollar value of a micromort) recomputes the list.

## Structure

```
hazards ──▶ events (draws) ──▶ windows and exposures ──▶ harm to the household
                                                          ▲
                                         kit (items owned) reduces it
```

### 1. Hazards

A hazard is a kind of event with an annual probability for the household, for
example `severeStorm`, `pandemicSevere` or `bankingCrisis`. Probabilities
depend on the place (section 1a), on local hazard tick-boxes (`hurricane`,
`earthquake`, `wildfire`, `flood`, `coldWinters`, `hotSummers`) and, for tail
hazards, on the risk outlook (`forecast` = public forecasts and base rates,
`pessimistic`, or the reader's own numbers).

Canonical hazard ids:

| id | meaning |
|---|---|
| `localOutage` | routine local utility failure: equipment fault, ordinary storm |
| `severeStorm` | major regional storm other than a hurricane (wind, ice, derecho) |
| `winterStorm` | regional cold-wave with utility failure (tick-box `coldWinters`) |
| `heatWave` | dangerous multi-day heat, with or without grid failure (tick-box `hotSummers`) |
| `hurricane` | tropical cyclone landfall affecting the home (tick-box) |
| `earthquake` | damaging earthquake (tick-box) |
| `wildfire` | wildfire threatening the area: evacuation and smoke (tick-box) |
| `flood` | flooding of the home or its area (tick-box) |
| `waterSystemFailure` | tap water unsafe or absent without a wider disaster |
| `supplyShock` | shops empty or shut for some goods: panic buying, strikes, fuel shortage |
| `pandemicModerate` | COVID-scale pandemic |
| `pandemicSevere` | pandemic far worse than COVID-19 (high fatality, possibly engineered) |
| `nuclearNear` | nuclear war in which the household's region is struck or receives fallout, household survives the first hour |
| `nuclearFar` | nuclear war elsewhere: trade, supply, financial and climate effects reach the household |
| `gridLong` | grid failure lasting weeks to months over a large region (geomagnetic storm, cyberattack, EMP) |
| `bankingCrisis` | deposit freeze, bank holiday, capital controls, or severe currency crisis |
| `civilUnrest` | serious unrest or armed conflict disrupting daily life where the household lives |

The AI research added four more: `cyberOutage` (a blackout of 1 to 14 days
from an attack or a software failure), `paymentsOutage`, `commsOutage` and
`greatPowerWar` (a conventional war between great powers).

Everyday risks are hazards too, so that ordinary safety items compete on the
same scale: `houseFire`, `coIncident`, `homeMedicalEmergency`,
`seasonalIllness` and `violentCrime`. Each is entered as a yearly expectation
for a home without the relevant item.

### 1a. Places

The research was done for three presets: the United States (`us`), Western
Europe (`westernEurope`) and Buenos Aires (`buenosAires`). The reader picks a
city from a built-in list of world cities (GeoNames, about 50,000 people or
more; nothing is looked up while the page runs). The city sets:

- the preset, the closest of the three in income and region
  (`data/countries.mjs`, `presetFor`);
- for 46 countries (the OECD and eight large middle-income countries), figures
  of their own that replace the preset's: the chance and length of ordinary
  power cuts, banking and currency crises, violence at home and serious
  unrest, fire and carbon monoxide at home, prices, the value of a micromort
  and of an hour, and nuclear war (`research/countries/`, briefed in
  `research/BRIEF-COUNTRIES.md`). The United States and the city of Buenos
  Aires are their presets. For any other country the page says that it has no
  figures of its own and which preset it borrows;
- the local-hazard ticks, from the World Bank's ThinkHazard ratings for the
  district (river and coastal flood, earthquake, cyclone, wildfire, extreme
  heat) and from the mean temperatures of the coldest and warmest months.
  `cityRules` in `data/config.mjs` says which ratings tick which box. The
  reader can change the ticks.

The country figures and the AI adjustment are combined by adding the preset's
AI shift (section 9) to the country's own probability.

### 2. Events

For each hazard the engine evaluates a fixed, stratified set of events. Each
event has a severity quantile `q` between 0 and 1. Its windows are functions
of `q`: worse events are worse on every dimension (windows are comonotonic).
A window that occurs with probability `p` occurs in the worst `p` share of
events. Window lengths follow the researcher's 50th, 90th and 99th
percentiles and are not extended beyond one and a half times the 99th.

Being forced out of the home is the exception. It is a separate branch of
every event, with its own probability whatever the severity: a household may
be displaced or not, and when it is, what it stored at home is out of reach
for as long as that lasts.

### 3. Windows

A window is the number of days the household, if it stays home and has made no
special preparation, must rely on what it has for one need, because neither
the normal supply nor outside relief (aid, shops, neighbours) is available.
Each hazard specifies, per window: the probability it occurs given the event,
and the 50th, 90th and 99th percentile of its length in days given that it
occurs.

Canonical window ids:

| id | the household is without… |
|---|---|
| `power` | grid electricity |
| `gas` | piped gas |
| `water` | safe drinking water from the tap or any outside source. Carries `shareTreatable`: the share of such days on which unsafe water is still obtainable, so that treating it would suffice |
| `food` | any way to obtain food from outside the home |
| `medication` | pharmacy or prescriber access |
| `emergencyCare` | timely ambulance or hospital care |
| `payments` | electronic payments, ATMs or bank access, while goods are still on sale |
| `comms` | mobile and internet service |
| `sanitation` | a working toilet |
| `displacement` | the home itself (ordered out, or uninhabitable) |

A hazard also gives `coldShare` and `hotShare` (the chance the event coincides
with dangerous cold or heat, for a household in a climate that has them), the
leave option (see below), the warning time, and the chance that an unprepared
household can still buy supplies once the event is foreseeable.

### 4. Needs and harm

A need is something the household must have each day. An unmet day is a day
inside a window that the household cannot cover from what it has. Each need
has:

- a baseline: how many days an unprepared household covers from ordinary
  household contents;
- a hardship curve: dollars per person per unmet day, by how many consecutive
  days the need has been unmet (willingness to pay to avoid that day, excluding
  the risk of death);
- a mortality curve: micromorts per person per unmet day, same indexing, for a
  healthy adult aged 15–59;
- multipliers for other people: `child` (under 15), `age60to74`, `age75plus`,
  `powerDependent` (life-supporting powered device), `criticalDrug` (daily drug
  whose interruption is dangerous), `limitedMobility`.

Curves describe harm given realistic improvisation (drinking untreated water,
wearing every layer, sharing with neighbours) but not relocation, which the
engine handles separately.

Two rules keep long events honest. A person's risk of death in an event is
capped at certainty: micromorts summed over many days are converted to the
chance of dying at least once. And a household short of food rations it: with
`F` days of full rations and a window of `W` days it eats half rations while
that lasts the window, quarter rations if it does not, and goes without only
when even that runs out, each stage with its own, lower, curves.

Canonical need ids: `water`, `food`, `warmth`, `cooling`, `light`,
`devicePower`, `refrigeration`, `medicalPower`, `information`, `medication`,
`sanitation`, `payments`, `displacement`.

Some harms are not day counts. They are exposures on a channel: a baseline
risk per person or loss per household that the event imposes. Canonical
channel ids: `infection`, `smoke`, `fallout`, `co`, `fire`, `trauma`
(injury or acute illness without timely care), `violence`, `financialLoss`.

### 5. The leave option

In many events the household can end its exposure by leaving for an unaffected
place. Each hazard gives the probability that leaving is feasible, the
earliest day, and the cost (fixed, and per person per day). A household that
can leave does so on the day that minimises its total cost. So supplies are
worth the harm they avert before leaving is possible or when it is not
possible, plus the cost of leaving that they make unnecessary. Where leaving
is held up by roads, fuel and transport, the share still stuck halves every
ten days; where few can leave because there is nowhere better to go (a
nuclear war, a pandemic), time does not help.

### 6. Items

An item is a purchase or action. Quantity ladders (days of water, days of
food, dollars of cash) are items with many units, ranked one step at a time.
Each item has a price, a service life, upkeep (money and hours a year), an
everyday share (the share of its cost justified by everyday use), a storage
volume, and a reliability (the chance it is usable and at hand when needed).

Items act through effects:

| effect | meaning |
|---|---|
| `supply` | adds stock toward a need: litres of water, kilocalories, watt-hours, hours of stove or heater fuel, dollars of cash, person-days of a drug |
| `capability` | lets the household do something other items or rules depend on: `cook`, `treatWater`, `fetchWater`, `light`, `chargePhone`, `radio`, `coAlarm`, `smokeAlarm`, `sealRoom`, … |
| `reduce` | removes a fraction of the harm on a need or channel, in stated hazards, at a stated adherence |
| `sideRisk` | adds risk while in use (CO or fire from combustion), possibly mitigated by a capability |
| `leave` | makes leaving likelier to be possible, or cheaper |
| `annualRisk` | a risk of owning the thing at all, every year |
| `review` | practice: multiplies every other item's chance of failing |
| `other` | anything that fits none of the above, described in words (research files only) |

An item can require capabilities or other items (stove fuel requires a
stove). Whether an item works, and whether it is bought late, enter as
expectations, not as draws: an owned item counts at its reliability, and any
household with warning may buy an item late, with a probability that is the
hazard's (do shops still have it) times the item's (would a household think
to buy it). Buying late what one already owns adds nothing, so pre-buying
earns nothing in the share of events where it would have been bought anyway.

### 7. Value, cost and ranking

```
harm(kit)        = Σ over hazards  P(hazard) × mean over its events of harm(event, kit)
harm(event, kit) = Σ over members i [ hardship_i × w_i + micromorts_i × v_i + lost work days_i × d_i ]
                   + financial loss
value(item|kit)  = harm(kit) − harm(kit + item)
annual cost      = price × [(1 − e) × CRF(r, life) + e × r] + upkeep money
                   + upkeep hours × hour value + volume × storage cost
ratio            = value ÷ annual cost
```

`e` is the everyday share, `r` the discount rate, `CRF` the capital recovery
factor. The list is built greedily: add the candidate with the highest ratio,
recompute, repeat. Complements and substitutes need no special treatment.

#### Members and how they are valued

The household is a list of members, each with an age band, conditions
(daily drug, a drug dangerous to miss, a powered medical device, infancy) and
a standard of value:

- **Personal** (the default). `v_i`, the value of a micromort, is the local
  value of a statistical life over a million, scaled by the member's hour
  value over the local default (income elasticity 1, as the OECD's 2025
  guidance recommends) and, by default, by remaining life-years:
  `annuity(r, LE_i) ÷ annuity(r, LE_ref)`, where `LE_i` is the remaining life
  expectancy at the band's representative age and `LE_ref` that at the age on
  which agency values are estimated. The reader can ask for equal values
  instead, as US agencies use. Hardship counts in full (`w_i = 1`); lost work
  is taken to be in it (`d_i = 0`).
- **Impartial** (members aged 15 or over). What the member's life is worth to
  others: `v_i = 10⁻⁶ × [hour value × hours a year × counterfactual share ×
  annuity(r, years until their impact ends) + C]`, where `C` is the marginal
  cost of saving a life through the most cost-effective charities, which
  prices the member's own wellbeing at what it costs to produce wellbeing
  elsewhere. Hardship is wellbeing, so `w_i = C ÷ (10⁶ × personal v_i)`, a
  small number. A day of lost work costs `d_i = hour value × hours a year ÷
  365`, at the full hour value: nobody replaces a lost day, and the
  counterfactual share applies only to a whole career. Impact ends when the
  reader says, by default at the end of the AI planning horizon when a
  timeline is set and at 65 otherwise; with a timeline, a lost day counts in
  proportion to the share of the horizon before that point. Worked check: age
  35, $100 an hour, 1,800 hours, half counterfactual, 30 years, 4% → $1.56
  per micromort.

Lost work days come from unmet needs (each need has `workLoss`, the share of a
day's work lost per unmet day, net of work made up later) and, for illness,
fire, crime and fraud, from the hazard (`workDays`, days lost per event,
reduced by whatever reduces the channel) (`research/impartial/`).

An hour spent on preparation is the owner's for a personal item and, for a
shared one, that of the member whose hour is valued least.

#### Shared and personal items

Most items serve the household as a whole: a stock of water or food, a smoke
alarm, a plan. They are single entries, and their value is the sum of what
they avert for each member at that member's values. Items marked `perPerson`
act on one person (respirators, goggles, vaccinations, warm layers and a
sleeping bag, a go-bag, a helmet, a whistle, potassium iodide, a prescription
buffer, infant formula, a medical battery): they are offered once for each
member they suit, and each copy is ranked on its own. A personal item's fixed
price (the kit for checking a mask's fit) is paid with the first copy.

### 8. Uncertainty

Every number is a triple: low (5th percentile), middle (median), high (95th
percentile), tagged `data` (read from a source), `derived` (computed from
data with stated steps) or `guess`. The headline list uses each triple's
average under that spread, which is what expected value means; the reader can
switch to medians, which favours everyday entries over tail ones. A
second pass samples all parameters and reports, for each entry, an interval on
its ratio and the probability that the ratio exceeds 1. For items whose value
comes mostly from one tail hazard, the list also reports the break-even
probability: the annual chance of that hazard above which the item pays.

### 9. Advanced AI

The reader states when they expect AGI (a preset anchored on named forecasts,
or their own probabilities by 2028, 2030 and 2035), how concerned they are,
and how many years they are planning for. For each hazard the AI research
gives yearly rates for now, for the five years after AGI arrives, and for the
time after that. Each rate is three figures: the view of a careful sceptic,
the central view, and the view of someone highly concerned; the reader's
level of concern picks between them. The model's own probabilities are
today's. With a timeline chosen, each is shifted by the average over the
planning horizon of the rate the timeline implies, less today's rate, times
the share of that risk a household could survive. Leaving AI out therefore
means assuming that today's rates persist, not that AI has no effect today.
A chosen timeline replaces the pessimistic outlook for the hazards it covers,
since that outlook was built on the same forecasts.

Every hazard's weight is also scaled by the chance, over the horizon, that no
existential catastrophe has happened: nothing a household owns is worth
anything after one. The chance of such a catastrophe given AGI is one of the
three-figure quantities, spread evenly over the transition.

A probability the reader sets by hand overrides all of this for that hazard.

## What the model leaves out

- Scenarios where nothing a household does matters.
- Harm to anyone outside the household, except through the impartial
  valuation of a member's work.
- Risk aversion. Values are expected values, so insurance never pays on these
  terms; it is reported with its loading, not ranked.
- Interactions between hazards (a pandemic during a blackout).
- Averages are taken parameter by parameter, so the headline ratio is not
  exactly expected value over expected cost; a sampled check of the leading
  entries puts the two within about 30% of each other.

## Verification

Six verifiers checked the ranking before publication: five took groups of
entries, one audited the engine. They re-opened the sources that carry most
weight, reproduced each entry's value by hand from `data/model.json`, and
compared the engine with brute-force recomputation. What they found, and what
was changed, is in the commit history of 19 November 2026 and in the comments
of `data/config.mjs` and the item files. The largest corrections were the cap
on deaths, the rationing rule, displacement as its own branch, expected values
in place of per-event draws, and the limit on window lengths.
