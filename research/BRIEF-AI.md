# Research brief: how advanced AI changes the hazard probabilities

This brief supplements `research/BRIEF.md`. Read `MODEL.md` and `BRIEF.md`
first: the rules for numbers, sources and the two deliverable files apply here
unchanged.

## The question

The model ranks household preparedness by cost-effectiveness. Its tail hazards
(pandemics, long grid failure, war, financial crisis, unrest) carry annual
probabilities taken from base rates and public forecasts. Many careful people
now expect artificial general intelligence within a few years and think it
will change those probabilities drastically. The model will let the reader
state their own timeline and level of concern, and will derive the hazard
probabilities from that. Your job is to supply the evidence and the numbers
for one part of that mapping.

Only catastrophes that a household can survive and prepare for are in scope.
Human extinction, permanent disempowerment and anything else that no
household measure would change are out of scope, except that you should say
what share of the catastrophe probability in your area falls there, so that it
is not counted as something to prepare for.

## Definitions to use

- **AGI**: AI systems able to do, autonomously and at the level of human
  experts, nearly all cognitive work that can be done remotely, including AI
  research itself. Roughly the "superhuman AI researcher" milestone of AI 2027,
  or Metaculus's "strong AGI" without the robotics requirement.
- **ASI**: systems far better than the best humans at essentially everything.
- **Now**: the period before AGI, at the frontier of late 2026. Models
  already give some uplift to attackers and some to defenders.
- **Transition**: the five years starting when AGI arrives. It covers any
  intelligence explosion, the arrival of ASI, and the period of greatest
  geopolitical and economic instability.
- **After**: the world after the transition, given that no existential
  catastrophe has occurred. Hazards here may be lower than today.

## Whose views count

The reader weighs most heavily people and groups with a record of careful,
quantified reasoning about these questions: the AI safety, effective altruism
and rationalist communities and those adjacent to them. Start with, and cite
precisely: Forecasting Research Institute (the Existential Risk Persuasion
Tournament and its later studies), Metaculus, Samotsvety, Good Judgment;
AI Futures Project (AI 2027 and its timeline updates); Forethought (Preparing
for the Intelligence Explosion; AI-Enabled Coups; other 2025–26 papers);
Epoch AI; METR; Open Philanthropy and Coefficient Giving staff writing
(Karnofsky, Cotra, Shulman, Davidson); Toby Ord; Rethink Priorities;
Center for AI Safety (Superintelligence Strategy); the frontier labs' own
safety frameworks, system cards and essays; SecureBio, CLTR, NTI and Kevin
Esvelt on biosecurity; RAND, CSET and GovAI; and writers such as Scott
Alexander, Zvi Mowshowitz, Gwern, Leopold Aschenbrenner, Dwarkesh Patel's
interviews, and the 80,000 Hours podcast and problem profiles. Include the
strongest sceptical views held by people with comparable care (for example
superforecasters in the tournament, Arvind Narayanan and Sayash Kapoor), so
that the low end of each range is somebody's considered view and not a straw
man.

Today is November 2026. Search for what has happened and been published in
2025 and 2026; do not rely on memory for the state of play, and say when a
source predates an important development.

## Deliverables

Write `<id>.json` and `<id>.md` to your output directory and validate the
JSON as `BRIEF.md` describes. The `.md` may run to about 2,000 words. It must
separate three things: what sources say (with who, where, when, and the exact
figure), what you infer from them, and what is your own guess.

## Schema: assignments of kind `ai`

```json
{
  "kind": "ai",
  "group": "<assignment id>",
  "hazardRates": [
    {
      "hazard": "pandemicSevere",
      "location": "all",
      "baseline": Q,
      "now": Q,
      "transition": Q,
      "after": Q,
      "mechanism": "how AI changes this hazard, in two or three sentences",
      "survivableShare": Q,
      "evidence": [{"claim": "…", "source": "URL", "year": 2025, "verified": true}],
      "notes": "…"
    }
  ],
  "views": [
    {"who": "name or group", "claim": "what they say, with the figure", "source": "URL", "year": 2025, "verified": true}
  ],
  "timelines": [
    {"id": "ai-2027", "label": "…", "source": "URL", "definition": "what the source forecasts",
     "cumulative": [{"year": 2027, "p": 0.1}, {"year": 2030, "p": 0.5}]}
  ],
  "parameters": [],
  "blockedSources": [],
  "openQuestions": []
}
```

- `hazard` is a canonical hazard id from `MODEL.md`. If AI creates a hazard
  that none of them covers, add `"newHazard": true`, give it a camelCase id,
  and describe in `notes` what it does to a household in the model's terms
  (which windows open, for how long; which exposures).
- `location` is `us`, `westernEurope`, `buenosAires` or `all`. Give separate
  entries where the answer differs by place. Buenos Aires matters: the author
  lives there, and several hazards (a US–China war, strikes on data centres,
  nuclear exchange) reach the Southern Hemisphere only indirectly.
- All four rates are annual probabilities that the hazard, as `MODEL.md`
  defines it, occurs and affects the household: `baseline` with AI's effect
  removed (the historical base rate), `now` at today's frontier, `transition`
  per year during the five years after AGI, `after` per year thereafter.
- In each `Q`, `lo` and `hi` are not statistical bounds. `lo` is the considered
  view of a careful sceptic, `mid` the central view among the sources listed
  above, `hi` the considered view of a careful person who is highly concerned.
  Name in `basis` whose view each end reflects.
- `survivableShare` is the share of that probability in which household
  preparation could matter (the rest being extinction-level or otherwise
  beyond help).
- `views` records each quantified or clearly stated position you found, one
  per entry, so that the article can cite them.
- `timelines` and `parameters` are for the assignment that asks for them.
