# Research brief: figures for individual countries

This brief supplements `research/BRIEF.md`. Read `MODEL.md` and `BRIEF.md`
first: the rules for numbers (every quantity a `{lo, mid, hi, tag, basis}`
triple, `lo` and `hi` the 5th and 95th percentiles, `data` / `derived` /
`guess` tags, sources in `basis`, never a guess presented as data) apply
unchanged.

## The question

The model was built for three places: the United States (`us`), Western
Europe (`westernEurope`) and Buenos Aires (`buenosAires`). Readers will now
pick their city from a list of world cities. For 46 countries the model will
use figures of their own for a few quantities that differ most between
countries; for everything else each country borrows one of the three
presets. The countries, and the preset each borrows, are in
`data/countries.mjs` (`COUNTRIES`). Your assignment is one family of
quantities (`COUNTRY_FIELDS` in the same file) for all 46 countries.

The presets' own figures are the anchors. Your figures must be on the same
scale and follow the same definitions, so that a country between the United
States and Germany on some indicator gets a figure between theirs. For each
anchor below, first reproduce the preset's figure (or explain why your source
would give a different one) from the same source you use for the other
countries. Then apply one method to every country. Where a source covers
only a country's largest city (the World Bank's Doing Business surveys) or
only some years, say so and widen the range.

Where you find no country-level source for a country, give a `guess` with a
wide range and say what you assumed. Do not leave a country out.

## Definitions and anchors, by family

Figures are for an urban household in the country, in the next year,
without any AI effect (the AI adjustment is applied on top).

### grid

- `localOutage.probability`: the annual probability that the home is
  completely without grid power for 6 hours or more from a cause that is not
  a regional disaster (equipment failure, ordinary storm, planned work).
  Outages of 12 hours or more from a regional storm, heat wave, hurricane or
  wildfire are excluded. Anchors: us 0.11 (0.06–0.16), westernEurope 0.03
  (0.012–0.07), buenosAires 0.25 (0.1–0.5). The full reasoning behind each is
  in `research/step3/hazards-ordinary.json` and `hazards-locations.json`
  (field `basis` of `localOutage`): they convert SAIFI (interruptions per
  customer a year) and SAIDI (minutes) into the share of households with an
  outage of 6 hours or more. Use SAIDI and SAIFI from national regulators,
  CEER, the World Bank's Doing Business "Getting Electricity" reliability
  data, or Enterprise Surveys (outages per month and their length), and the
  same conversion.
- `localOutage.durationFactor`: how much longer (or shorter) such outages
  last than in the country's preset, as a multiplier on the preset's outage
  lengths (1 = the same). Preset lengths of the power cut in days: us median
  0.33, 90th percentile 0.5, 99th 1.8; westernEurope 0.25, 0.6, 2;
  buenosAires 0.3, 1.1, 5. Use CAIDI (SAIDI / SAIFI) relative to the preset's
  anchor where you have it.

### banking

- `bankingCrisis.forecast` and `bankingCrisis.pessimistic`: the annual
  probability that the household either cannot freely use its bank deposits
  for three days or more (bank holiday, deposit freeze, withdrawal limits,
  forced conversion), or holds a currency that loses 30% or more of its value
  against other major currencies or 25% or more of its domestic purchasing
  power. Anchors and their reasoning: `research/step3/tail-finance-unrest.json`
  (us 0.002 and 0.015, westernEurope 0.003 and 0.02, buenosAires 0.15 and
  0.3). Sources: Laeven and Valencia's systemic banking crises database (IMF
  WP/18/206 and its 2020 update), currency-crash dates in the same database,
  IMF and central-bank data on exchange rates and inflation since then, and
  current sovereign spreads or ratings for the forecast. `forecast` is base
  rates adjusted for present conditions; `pessimistic` is the view of a
  well-informed pessimist, as for the anchors.

### violence

- `violentCrime.scale`: the yearly risk of death and loss from burglary and
  assault at home, relative to the United States (1). The US figure is 1.2
  micromorts a person and $40 a household a year (`data/config.mjs`,
  `violentCrime`). Anchors: westernEurope 0.4, buenosAires 1.5 (the
  researcher's blend over deaths and dollars, `research/step3/plans-skills-security.json`).
  Base it on UNODC intentional-homicide rates (and burglary rates where the
  UNODC or Eurostat give them), relative to the US rate of the same year.
  Homicide at home is a smaller share of all homicide where most killings
  are gang or street violence; say how you allowed for that.
- `civilUnrest.forecast` and `civilUnrest.pessimistic`: the annual
  probability that the household's city or district has serious rioting or
  looting, a riot curfew or state of siege, disorder sustained over days, or
  armed conflict on home territory. Peaceful mass protest does not count.
  Anchors and reasoning: `research/step3/tail-finance-unrest.json` (us 0.01
  and 0.03, westernEurope 0.01 and 0.03, buenosAires 0.04 and 0.08). Use the
  country's record of curfews, states of emergency for unrest and looting
  waves since about 1990, ACLED where it helps, and the share of the urban
  population each episode touched.

### fire

- `houseFire.scale`: the yearly risk of death and loss from fire at home,
  relative to the United States (1). The US figure is about 10 micromorts a
  person a year for a home without a working smoke alarm. Anchors:
  westernEurope 0.5, buenosAires 1 (`research/step3/fire-co.json`). Use
  residential fire death rates (national fire statistics, CTIF World Fire
  Statistics, the Global Burden of Disease "fire, heat and hot substances"
  cause), relative to the US rate. GBD's cause includes burns that are not
  house fires; prefer residential fire deaths where a country reports them.
- `coIncident.scale`: the yearly risk of carbon monoxide poisoning at home,
  relative to the United States (1). Anchors: westernEurope 0.8, buenosAires
  2 (unflued gas heaters), in `research/step3/fire-co.json`. Use unintentional
  CO death rates where reported, and what is known about heating and cooking
  fuels; this one may be mostly `guess`.

### prices

- `priceIndex`: what the model's preparedness goods (water containers,
  shelf-stable food, respirators, batteries, power banks, smoke alarms, camp
  stoves) cost in the country, in US dollars at market exchange rates,
  relative to US prices before sales tax. Anchors: us 1, westernEurope 1.1
  (0.9–1.35), buenosAires 1.4 (1–2.3) (`research/step3/cross-cutting.json`).
  Use price-level indices for tradable goods (World Bank ICP, Eurostat) and,
  where you can, a few prices read from local retailers.
- `micromortValueUsd`: the value of a one-in-a-million reduction in the
  risk of death, in US dollars at market exchange rates (the value of a
  statistical life divided by a million). Anchors: us 14.6 (6.8–22.3),
  westernEurope 7 (3.5–11), buenosAires 3 (1–6). Transfer from the US figure
  with income elasticity 1, as the OECD's 2025 guidance recommends, using
  GNI per capita (Atlas method) as the buenosAires anchor does; say if a
  country has an official figure of its own and how it compares.
- `timeValueUsdPerHour`: the value of an hour of an adult's unpaid time, in
  US dollars at market exchange rates. Anchors: us 21 (10.5–35),
  westernEurope 15 (7.5–26), buenosAires 5.5 (2.5–10). The anchors use the
  median (or average formal) hourly wage less taxes (the US Department of
  Health and Human Services method). Use ILO, OECD or national earnings
  data.

### nuclear

- `nuclearNear.forecast` and `nuclearNear.pessimistic`: the annual
  probability that nuclear weapons detonate on the household's own country in
  a large-scale attack (roughly 100 warheads or more), or in a smaller attack
  that puts the home inside a damaged area or under a fallout plume, and
  everyone in the household survives the first hour. Anchors and full
  reasoning: `research/step3/tail-nuclear-grid.json` (us 0.0006 and 0.0022,
  westernEurope 0.0005 and 0.0017, buenosAires 0.000001 and 0.000003). This is
  your own estimate: say for each country which wars could reach it (is it a
  nuclear power, a host of US weapons or bases, a NATO frontline state, a
  party to a nuclear dyad such as India–Pakistan or the Korean peninsula,
  downwind of likely targets), and build its figure from the anchors'
  war-rate figures. Use published forecasts (Metaculus, Samotsvety, the
  Forecasting Research Institute) where they name a country or region.
- `nuclearFar.forecast` and `nuclearFar.pessimistic`: the annual probability
  of a nuclear war that kills more than 1,000 people but leaves the
  household's own country without large-scale attack and its home outside
  any damaged or fallout area. Anchors: us and westernEurope 0.006 and 0.015,
  buenosAires 0.007 and 0.018. It is roughly the probability of any nuclear
  use less the country's own `nuclearNear`, so it varies little.
- `nuclearNear.falloutScale`: the mean fallout risk to a surviving household
  in such an attack, relative to the United States (1; 10,000 micromorts a
  person, from ground bursts on missile fields and light-frame housing).
  Anchor: westernEurope 0.6. Base it on likely targets, building stock and
  prevailing winds; mostly `guess`.

## Deliverables

Write two files into `research/countries/`, named after your family
(`grid.json` and `grid.md`, and so on):

```json
{
  "kind": "countries",
  "group": "<family>",
  "method": "how you went from the sources to the figures, in a paragraph",
  "anchors": [
    {"preset": "us", "field": "<field>", "reproduced": Q, "comment": "how it compares with the preset's figure"}
  ],
  "countries": [
    {
      "iso2": "DE", "name": "Germany",
      "values": { "<field>": Q, "...": Q },
      "notes": "anything particular to this country"
    }
  ],
  "blockedSources": ["URL: what it would have told us"],
  "openQuestions": ["…"]
}
```

Every country in `COUNTRIES` must appear, with every field of your family.
The `.md` file (at most about 1,500 words) gives the method, the anchor
reproduction, a table of the 46 countries' middle figures with their tags,
and the countries you are least sure of.

Validate with `node tools/validate-research.mjs research/countries/<family>.json`
and fix every error. Write files with the Write tool, not shell redirection
or heredocs, and run only single-line commands. Write nothing else to disk.
Do not run git commands that change anything.
