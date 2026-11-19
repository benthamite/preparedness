# Research brief for step 3

You are one of about twenty researchers supplying parameters for a quantitative
model that ranks household preparedness purchases by cost-effectiveness. Read
`MODEL.md` at the repository root first: it defines the hazards, windows,
needs, channels and effects you must speak in terms of.

Step 2 produced three reports you should read before searching, in
`research/step2/`: `item-longlist.md` (122 candidate items with prices and
sources), `base-rates.md` (hazard probabilities) and `prior-art.md` (what is
known about harm in real disruptions, and existing valuations).

## Deliverables

Write exactly two files, named after your assignment id, into the output
directory given in your assignment:

- `<id>.json`: parameters, in the schema below.
- `<id>.md`: your reasoning, at most about 1,200 words. For every number that
  is not a direct quotation from a source, show the arithmetic or the argument.
  List the sources you could not open.

Then run the validator on your JSON file and fix every error it reports:

```
node /Users/pablostafforini/repos/preparedness/tools/validate-research.mjs <path-to-json>
```

Write nothing else to disk. Do not run git commands that change anything.

## Rules for numbers

- Every quantity is `{"lo": n, "mid": n, "hi": n, "tag": "...", "basis": "..."}`.
  `lo` and `hi` are your 5th and 95th percentiles, `mid` your median.
  `tag` is `data` (you read it on a page you fetched), `derived` (computed from
  such data; say how in `basis`) or `guess`. `basis` is one or two sentences
  and includes the source URL where there is one.
- Never present a guess as data. A wide, honest range is more useful than a
  narrow invented one. If you have no basis at all, still give your best range
  and tag it `guess`.
- Think in orders of magnitude first. A mortality figure should be checked
  against the real events in `prior-art.md`: Texas 2021 cost roughly 8–24
  micromorts per resident over a two-to-four-day winter outage, mostly from
  cold; none of the deaths were from thirst or hunger.
- Use United States prices in US dollars at November 2026 levels. Prefer a
  price you read on a retailer or manufacturer page; mark `verified` true only
  then.
- Use WebSearch and WebFetch. Do not use browser automation. If a source
  refuses to load, try another route (publisher mirror, PubMed abstract,
  preprint, archive.org); if that fails, list it under `blockedSources` and
  mark anything you take from memory or a search snippet as a guess.
- Effects must describe what an item changes for a household that would
  otherwise improvise. Do not credit an item with harm that an unprepared
  household avoids anyway.

## Schema: assignments of kind `items`

```json
{
  "kind": "items",
  "group": "<assignment id>",
  "needs": [
    {
      "id": "<canonical need id>",
      "definition": "what counts as an unmet day",
      "baselineCoverageDays": Q,
      "hardshipUsdPerPersonDay": CURVE,
      "mortalityMicromortsPerPersonDay": CURVE,
      "multipliers": [
        {"profile": "age75plus", "hardship": 1.5, "mortality": 8, "tag": "derived", "basis": "…"}
      ],
      "notes": "…"
    }
  ],
  "channels": [
    {
      "id": "<canonical channel id>",
      "definition": "…",
      "everydayAnnualMicromortsPerPerson": Q,
      "everydayAnnualUsdPerHousehold": Q,
      "inHazards": "how the baseline risk on this channel arises and scales inside hazards",
      "multipliers": []
    }
  ],
  "items": [
    {
      "id": "kebab-case-id",
      "name": "Short name",
      "spec": "the specific product or action and quantity",
      "fromLonglistRows": [1, 2],
      "scalesWith": "person | household | fixed",
      "unit": "what one unit is (litre, day of food for one person, device, hour of training)",
      "ladder": [{"label": "3 days", "units": 12}],
      "price": {"usdPerUnit": Q, "product": "…", "source": "URL", "verified": true},
      "lifeYears": Q,
      "setupHours": Q,
      "upkeepHoursPerYear": Q,
      "upkeepUsdPerYear": Q,
      "everydayShare": Q,
      "volumeLitresPerUnit": 1.0,
      "reliability": Q,
      "lateBuyClass": "staple | specialty | none",
      "requires": ["cook"],
      "conditions": ["coldWinters"],
      "effects": [
        {"type": "supply", "need": "water", "amountPerUnit": 1, "amountUnit": "litre", "notes": "…"},
        {"type": "capability", "capability": "treatWater", "notes": "…"},
        {"type": "reduce", "target": "infection", "hazards": ["pandemicSevere"],
         "fractionRemoved": Q, "adherence": Q, "notes": "…"},
        {"type": "sideRisk", "channel": "co", "micromortsPerDayOfUse": Q,
         "mitigatedBy": "coAlarm", "notes": "…"},
        {"type": "other", "description": "…"}
      ],
      "evidence": [{"claim": "…", "source": "URL", "year": 2021, "verified": true}],
      "confidence": "data | derived | guess",
      "notes": "…"
    }
  ],
  "excluded": [{"what": "longlist row or candidate", "reason": "…"}],
  "blockedSources": ["URL: what it would have told us"],
  "openQuestions": ["…"]
}
```

`CURVE` is `{"tag": "…", "basis": "…", "steps": [{"fromDay": 1, "lo": n, "mid": n, "hi": n}, …]}`.
Each step applies from that consecutive unmet day until the next step. Day 1
is the first unmet day, after the household's baseline stock has run out.
Mortality is for a healthy adult aged 15–59; put everything else in
`multipliers`.

Notes on fields:

- `needs` and `channels`: include only those your assignment names as yours.
- Consolidate your longlist rows into few model entries. The whole model
  should have about 50 to 60. Make a quantity ladder where the question is how
  much (water, food, cash, drugs, masks). Merge cheap sundries that are bought
  together into one bundle. Put items that apply only to some households
  (infants, pets, car owners, houses, a climate, a hazard zone) in separate
  entries with `conditions`. Add candidates the longlist missed. Record what
  you drop, and why, in `excluded`.
- `price.usdPerUnit` is per model unit, so a ladder's cost is units × price.
- `setupHours` is the one-off time to choose, buy, set up and learn the item,
  per household. `upkeepHoursPerYear` is rotation, testing and refreshing.
- `everydayShare` is the share of the item's cost that everyday use would
  justify anyway: 0 for a tourniquet, near 1 for pantry food you rotate and eat.
- `reliability` covers failure, expiry, being unable to find it, and not
  knowing how to use it. It does not cover being away from home.
- `lateBuyClass`: `staple` if shops normally have it in quantity, `specialty`
  if it sells out in the first days of a scare (respirators, generators,
  potassium iodide), `none` if it cannot be acquired quickly at all (training,
  vaccination, a plan, an account at a second bank).
- `reduce.target` is a need id or a channel id. `fractionRemoved` is the share
  of that harm removed when the item is used correctly; `adherence` is the
  share of the relevant time a typical owner would in fact use it correctly.
- Capability ids in use: `cook`, `treatWater`, `fetchWater`, `light`,
  `chargePhone`, `mainsPower` (can run mains-voltage devices), `radio`,
  `coAlarm`, `smokeAlarm`, `sealRoom`, `passiveWarmth`, `heatSource`,
  `shelterPlan`, `evacuationPlan`, `goBag`, `firstAidSkill`. Use these where
  they fit. If you need another, name it in camelCase and list it under
  `openQuestions`.
- `conditions` use: `coldWinters`, `hotSummers`, `hurricane`, `earthquake`,
  `wildfire`, `flood`, `house`, `apartment`, `car`, `infant`, `pet`,
  `powerDependent`, `criticalDrug`, `age60plus`.

## Schema: assignments of kind `hazards`

```json
{
  "kind": "hazards",
  "group": "<assignment id>",
  "hazards": [
    {
      "id": "<canonical hazard id>",
      "definition": "the threshold that makes an event count",
      "annualProbability": [
        {"location": "us", "outlook": "all", "lo": 0.01, "mid": 0.03, "hi": 0.06,
         "tag": "data", "basis": "…"}
      ],
      "tickBox": null,
      "windows": {
        "power": {"pOccur": Q, "days": {"p50": 2, "p90": 6, "p99": 20},
                  "tag": "derived", "basis": "…"},
        "water": {"pOccur": Q, "days": {"p50": 1, "p90": 4, "p99": 14},
                  "shareTreatable": Q, "tag": "guess", "basis": "…"}
      },
      "coldShare": Q,
      "hotShare": Q,
      "leave": {"feasible": Q, "earliestDay": Q, "fixedUsdPerHousehold": Q, "usdPerPersonDay": Q},
      "warningDays": Q,
      "lateBuy": {"staple": Q, "specialty": Q},
      "exposures": [
        {"channel": "infection", "description": "…",
         "micromortsPerPerson": Q, "hardshipUsdPerPerson": Q, "financialUsdPerHousehold": Q,
         "multipliers": [{"profile": "age75plus", "mortality": 20, "tag": "data", "basis": "…"}]}
      ],
      "dwellingNotes": "what differs for apartments, houses, high floors",
      "evidence": [{"claim": "…", "source": "URL", "year": 2021, "verified": true}],
      "notes": "…"
    }
  ],
  "blockedSources": [],
  "openQuestions": []
}
```

Notes on fields:

- `annualProbability` is per household per year. `location` is `us`,
  `westernEurope`, `buenosAires` or `all`. `outlook` is `forecast`,
  `pessimistic` or `all`. For a tick-box hazard, give the probability for a
  household that lives in an exposed area, and say in `basis` what "exposed"
  means.
- A window's `pOccur` is conditional on the event. Its `days` are conditional
  on the window occurring, and are net of outside relief: count only days on
  which the household could not get the thing from aid, shops or neighbours.
  Omit windows that essentially never occur in this hazard.
- `leave.feasible` is the chance that the household could relocate to an
  unaffected place if it chose to. `earliestDay` is when that first becomes
  possible. Costs are what relocating costs beyond normal living costs.
- `lateBuy` is the chance that a household which had not prepared can still
  buy the item once the event is foreseeable, by class.
- `exposures` hold harms that are not day counts. `micromortsPerPerson` is the
  baseline risk of death the event imposes on an unprepared healthy adult aged
  15–59 who stays.

## Schema: assignments of kind `parameters`

```json
{
  "kind": "parameters",
  "group": "<assignment id>",
  "parameters": [
    {"id": "micromortValueUsd.us", "definition": "…", "unit": "USD", "value": Q}
  ],
  "anchors": [
    {"event": "Texas winter storm, February 2021", "cause": "hypothermia",
     "deaths": Q, "exposedPersons": Q, "exposureDays": Q,
     "micromortsPerExposedPersonDay": Q, "source": "URL", "notes": "…"}
  ],
  "blockedSources": [],
  "openQuestions": []
}
```
