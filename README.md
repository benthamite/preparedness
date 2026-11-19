# preparedness

A quantitative model that ranks household emergency-preparedness purchases and
actions by cost-effectiveness, for a household and risk outlook the reader sets.

- `MODEL.md`: the model.
- `research/`: the evidence behind the parameters. `step2/` is the initial
  survey; `step3/` holds one parameter file and one reasoning file per topic,
  written to `research/BRIEF.md`.
- `data/model.json`: the parameters the engine reads.
- `src/model.mjs`: the engine. It runs in the browser and under Node.
- `test/`: `node --test`.
- `tools/validate-research.mjs`: checks a research file against the schema.
