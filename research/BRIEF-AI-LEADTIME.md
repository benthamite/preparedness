# Research brief: AI-driven risk as a function of the time left before full labour automation

This brief supplements `research/BRIEF.md` and `research/BRIEF-AI.md`. Read
`MODEL.md` (section 9, "Advanced AI"), `BRIEF.md` and `BRIEF-AI.md` first. The
rules for numbers apply unchanged: every quantity is a `{lo, mid, hi, tag,
basis}` triple, `lo` and `hi` the 5th and 95th percentiles, tagged `data`,
`derived` or `guess`, with its sources in `basis`; never a guess presented as
data. Most of what is asked here has no direct source. That is expected: say
so, reason from what does exist, tag it `guess`, and give wide ranges.

## Why the model is changing

Readers will no longer give an AGI timeline (presets or their own
probabilities) and a level of concern. They will give one year: their point
estimate of **full labour automation**, the year by which AI systems (with
robots where needed) can do essentially every job more cheaply than people.
The model uses it in two ways:

1. Under the impartial valuation, a member's work stops mattering to others at
   that year. That part needs no research.
2. The AI-driven hazards are worse the sooner full automation comes, because
   the world has less time to prepare: fewer years for cyber defence to catch
   up with AI offence, for biosecurity countermeasures, for financial
   regulation and labour-market adjustment, for arms-control arrangements.
   Automation by 2030 should mean a lot of turbulence (cyberattacks, outages,
   financial crises, perhaps more war); automation in 2050 much less of it
   per year of transition.

Your task is the second: a model of how much each AI-driven hazard rises, and
when, as a function of the lead time to full automation.

## What the model has now

`research/ai/*.json` (the five AI research files, `ai-bio`, `ai-cyber`,
`ai-economy`, `ai-war`, `ai-timelines`) give, for each AI-driven hazard and
place, four yearly probabilities: `baseline` (before recent AI), `now`,
`transition` (the five years after AGI arrives) and `after`. Each is a triple
whose `lo`, `mid` and `hi` are the views of a careful sceptic, the central
view and a highly concerned view. The model averages, over the reader's
planning horizon (default 5 years from 2027), the rate implied by their
timeline. `data/model.json` (`ai`) holds the resolved figures, including
`transitionYears` (5) and `pExistential` (the chance of an existential
catastrophe given AGI: 0.01, 0.2, 0.8).

Those `transition` figures were estimated without regard to when AGI comes.
Read the five research files to establish, hazard by hazard, what lead time
their authors implicitly assumed (for most, the timelines researcher's centre
of about 2027–2030), and say how you inferred it.

## The new model, and what you supply

Let L be the number of years from the start of 2027 to the reader's year of
full automation. The model will:

- Treat the `turbulentYears` (your figure; the current model uses 5) before
  full automation as the transition. During it a hazard's yearly probability
  is `now + (transition − now) × factor(L)`, where `transition` and `now` are
  the existing figures and `factor` is yours, equal to 1 at
  `referenceLeadYears`.
- Ramp the excess linearly from 0 to its full level over the `runUpYears`
  before the turbulent period.
- After full automation, use the existing `after` rate, scaled by an optional
  `afterFactors(L)` if you find reason to think the post-automation rate also
  depends on lead time (for instance, a rushed transition leaving fragile
  institutions). Omit it otherwise.
- Scale the chance of an existential catastrophe in the same way, by
  `existential.factor(L)` on `pExistential`.

`factor` is given at L = 1, 3, 5, 8, 12, 20 and 30 years; the model
interpolates linearly between them and holds the last value beyond 30.
The `lo`, `mid` and `hi` of each factor are the 5th, 50th and 95th
percentiles of your uncertainty about that factor; the model's existing
sceptic-to-concerned spread in `transition` stays as it is, so do not fold it
in again.

For each hazard, reason about the mechanism: which defences or adjustments
take time, how long they take, and whether more lead time could make
anything worse (for example, a longer arms race, or more years in which
misuse-capable but not yet transformative models are widely available). A
factor need not fall monotonically, and it need not fall towards zero: some
risks come from the capabilities themselves, whatever the preparation. Say
what floor you assume and why.

Relevant evidence includes, among others: the history of offence-defence
balance in cybersecurity and how quickly defenders adopt new tools; how long
regulation and institutions took to adapt to past general-purpose
technologies and to financial innovations; arms-race and crisis-stability
literature on fast versus slow capability shifts; biosecurity preparedness
timelines (countermeasure development, DNA synthesis screening, far-UVC and
PPE stockpiles); work on "differential technological development", "defensive
acceleration" and takeoff speeds (for example Epoch, AI Futures Project, Forethought,
Open Philanthropy and RAND reports on fast versus slow takeoff); economists'
work on labour-market adjustment speed and unrest. Forecasts conditional on
timelines, where any exist, are the most direct evidence; say if you find
none.

The hazards: `pandemicModerate`, `pandemicSevere`, `cyberOutage`, `gridLong`,
`waterSystemFailure`, `paymentsOutage`, `commsOutage`, `cyberSupplyShock`,
`bankingCrisis`, `supplyShock`, `aiFraud`, `greatPowerWar`, `nuclearNear`,
`nuclearFar`, `civilUnrest`. Related hazards may share reasoning but each
needs its own entry.

Also give:

- `turbulentYears`: how many years before full automation the elevated rates
  apply. The current model says five years after AGI; full automation comes
  after AGI, so say how you map one onto the other.
- `runUpYears`: how long before the turbulent period risks start rising.
- `referenceLeadYears`: the lead time the existing `transition` figures
  implicitly assume (one figure for all hazards, or explain in `method` if they
  differ and give the one most of the weight rests on).

## Deliverables

Write two files into `research/ai/`: `ai-leadtime.json` and `ai-leadtime.md`.

```json
{
  "kind": "aiLeadTime",
  "group": "ai-leadtime",
  "method": "a paragraph: how you went from the evidence to the factors",
  "turbulentYears": Q, "runUpYears": Q, "referenceLeadYears": Q,
  "hazards": {
    "cyberOutage": {
      "factors": [{"leadYears": 1, "factor": Q}, {"leadYears": 3, "factor": Q}, "... 5, 8, 12, 20, 30"],
      "afterFactors": "optional, same shape",
      "mechanism": "what preparation does to this risk, and how long it takes",
      "evidence": [{"claim": "…", "source": "URL or citation", "verified": true}]
    }
  },
  "existential": {"factors": ["… same shape"], "mechanism": "…", "evidence": []},
  "blockedSources": ["URL: what it would have told us"],
  "openQuestions": ["…"]
}
```

`verified` is true only for a claim you read on the fetched page or document
yourself. The `.md` file (at most about 2,000 words) gives the method, the
reference lead time and how you found it, a table of the middle factors for
every hazard at each lead time, the mechanisms that drive the biggest
differences, and the figures you are least sure of.

Validate with `node tools/validate-research.mjs research/ai/ai-leadtime.json`
and fix every error. Write files with the Write tool, not shell redirection
or heredocs, and run only single-line commands. Write nothing else to disk.
Do not run git commands that change anything.
