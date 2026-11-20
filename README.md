# preparedness

A quantitative model that ranks household emergency-preparedness purchases and
actions by cost-effectiveness, for a household and risk outlook the reader sets.

- `MODEL.md`: what the model computes, and what it leaves out.
- `research/`: the evidence behind the parameters.
  - `step2/`: the initial survey (prior art, base rates, a longlist of 122 items).
  - `step3/`: one parameter file and one reasoning file per topic, written to
    `research/BRIEF.md` (14 item groups, 6 hazard groups, 1 cross-cutting).
  - `ai/`: how advanced AI changes the hazard probabilities, written to
    `research/BRIEF-AI.md` (pandemics, cyber and infrastructure, war, economy,
    timelines).
- `data/config.mjs`, `data/items-1.mjs`, `data/items-2.mjs`: how the model uses
  the research. Every modelling choice, and every place a researcher's number
  was adjusted, is here with its reason.
- `data/model.json`: the built parameters the engine reads. Do not edit; run
  `node tools/build-data.mjs`.
- `src/model.mjs`: the engine. It runs in the browser and under Node.
- `src/ui.js`, `src/ui.css`: the page.
- `test/`: `node --test`.

## Commands

```
node tools/build-data.mjs            # research + config -> data/model.json
node --test                          # engine tests
node tools/rank.mjs --top 30         # the list for the default household
node tools/rank.mjs --robust 60 '{"location":"buenosAires"}'
node tools/profiles.mjs 12           # eleven test households side by side
node tools/build-page.mjs            # -> dist/preparedness-list.html
node tools/validate-research.mjs research/step3/*.json research/ai/*.json
```

To put the page on the site, build it into the site's static files, where the
note's iframe expects it:

```
node tools/build-page.mjs --out ~/repos/stafforini.com/static/images/preparedness-list.html
```
