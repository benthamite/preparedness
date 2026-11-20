# The preparedness model

This file specifies the model behind the ranked preparedness list. It is the
contract between the research files in `research/`, the data file
`data/model.json`, and the engine in `src/model.mjs`.

## What the model answers

Given a household (who lives there, where, in what kind of home) and a view of
how likely different catastrophes are, which preparedness purchases and actions
avert the most harm per dollar, and in what order should they be acquired?

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
depend on the location preset (`us`, `westernEurope`, `buenosAires`), on local
hazard tick-boxes (`hurricane`, `earthquake`, `wildfire`, `flood`,
`coldWinters`, `hotSummers`) and, for tail hazards, on the risk outlook
(`forecast` = public forecasts and base rates, `pessimistic`, or the reader's
own numbers).

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
harm(event, kit) = hardship dollars + micromorts × value of a micromort + financial loss
value(item|kit)  = harm(kit) − harm(kit + item)
annual cost      = price × [(1 − e) × CRF(r, life) + e × r] + upkeep money
                   + upkeep hours × value of time + volume × storage cost
ratio            = value ÷ annual cost
```

`e` is the everyday share, `r` the discount rate, `CRF` the capital recovery
factor. The list is built greedily: add the candidate with the highest ratio,
recompute, repeat. Complements and substitutes need no special treatment.

### 8. Uncertainty

Every number is a triple: low (5th percentile), middle (median), high (95th
percentile), tagged `data` (read from a source), `derived` (computed from
data with stated steps) or `guess`. The headline list uses the medians. A
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
- Harm to anyone outside the household.
- Risk aversion. Values are expected values, so insurance never pays on these
  terms; it is reported with its loading, not ranked.
- Interactions between hazards (a pandemic during a blackout).
- What the list ranks on is each parameter's median. For skewed parameters
  the expected value is higher, so entries that rest on a tail hazard would
  score higher on means, and everyday entries a little lower. The page's
  "chance it pays" column shows how often each entry clears the bar across
  the ranges.

## Verification

Six verifiers checked the ranking before publication: five took groups of
entries, one audited the engine. They re-opened the sources that carry most
weight, reproduced each entry's value by hand from `data/model.json`, and
compared the engine with brute-force recomputation. What they found, and what
was changed, is in the commit history of 19 November 2026 and in the comments
of `data/config.mjs` and the item files. The largest corrections were the cap
on deaths, the rationing rule, displacement as its own branch, expected values
in place of per-event draws, and the limit on window lengths.
