# Check: grid and banking country research

Both files pass `tools/validate-research.mjs`, before and after the changes.

## What I checked

**Grid.**
- Recomputed the log-normal conversion (S4, rate, p, duration factor) for all 46 countries and the three anchors. The arithmetic holds to rounding, with one exception (Israel).
- Re-read CEER 6.1 Tables 7, 8, 15 and 16. Every European SAIDI and SAIFI input matches the 2014–16 means.
- Confirmed the researcher's correction to the preset: the Western Europe anchor quotes Table 8 values (Germany 12.80, Italy 37.11, Austria 24.22 in 2016) while calling them "including exceptional events".
- Re-read the Doing Business 2020 SAIDI and SAIFI through the World Bank API for 26 countries, and Enterprise Survey outage shares. All match.
- Re-opened the national sources for the six heaviest or oddest figures: Brazil (ANEEL), China (NEA/CEC), Indonesia (PLN), the Philippines (Meralco), Canada (Electricity Canada) and South Africa (Eskom via SAnews). All match. I also checked Poland, Japan, Korea, Turkey and India through CEER and the API.

**Banking.**
- Recomputed December-on-December falls from BIS for 12 currencies and recent 12-month moves for 10. Every event the file lists is there, and none is missing.
- Recomputed rolling-window worst falls, which confirm the open question on December averages.
- Recomputed every band prior, posterior and pessimistic figure.
- Re-read the S&P ratings of 36 countries; all match.
- Re-read Laeven–Valencia's crisis table and its freeze and holiday text.
- Re-opened the sources behind the six heaviest figures: Argentina (INDEC via Forbes, REM via Perfil, iProfesional, BIS daily rates), Turkey (TurkStat, CDS article), Nigeria (NBS) and Brazil, South Africa and Korea (BIS).

## What I changed

- **grid, Israel:** probability mid changed from 0.055 to 0.051. The basis's own rate, 0.052, converts to 0.051.
- **grid, France:** added a Checker note. The cited Selectra page gives no long-cut frequency, so SAIFI 0.55 is unsourced. The page gives 2.08 cuts per customer in 2023, short cuts included. The figure is kept because it barely moves: 0.036–0.056 for SAIFI 1.0–0.4.
- **grid, Estonia:** added a Checker note. The basis calls the rate (0.094) the probability (0.089).
- **grid, India:** added a Checker open question. Enterprise Surveys point below 0.55.
- **banking, Argentina and the buenosAires anchor:** added Checker notes. Two of the three reasons given for missing the preset are wrong:
  - The peso's 2024 "event" (37.1% on December averages) is the 13 December 2023 devaluation counted a second time. End-of-December rates give a 21.7% loss.
  - The preset did not misread inflation into its figure. Its definition excludes "inflation that deposit interest roughly matches", and its 0.15 uses no inflation number.

  Neither changes a final figure.
- **banking, Nigeria:** added a Checker note. The file excludes China's 1994 rate unification but counts Nigeria's 1999 one; treating them alike gives 0.11, not 0.12. "Prior 17.6%" is the posterior.
- `.md` files updated to match, each with a short "Checker's notes" section.

## What I would flag to the owner

1. **Banking definition, the one that matters.** The brief's wording counts any 25% loss of purchasing power. The anchor's definition (`tail-finance-unrest.json`, buenosAires) excludes inflation that deposit interest roughly matches. The researcher followed the brief, so the inflation-only branch makes up these shares:
   - Argentina: 0.15 of its 0.42.
   - Turkey: 0.23 of its 0.32.

   On the anchor's definition the figures are:
   - Argentina: 0.27 forecast, 0.43 pessimistic.
   - Turkey: 0.10 forecast, 0.23 pessimistic.

   The model attaches a 35% deposit loss to this event, so the choice moves the harm a lot. I did not change the figures, because the brief's text supports the researcher. I would adopt the anchor's definition, since the brief also says to follow the presets' definitions.
2. **Argentina's currency part is still 0.27 against the preset's 0.15.** It comes from the central bank survey's dollar path and an assumed 15–20% volatility. Either the preset or this figure should move.
3. **Argentina's 0.2 inflation-only chance** sits beside a survey forecast of 21.8% inflation over the next 12 months. If the branch is kept, 0.2 looks high.
4. **Turkey's record raises its neighbours.** Its eight events dominate the pooled BB prior. That puts Colombia and Costa Rica, with no events since 1995, at 2.0%, above Mexico at 1.65%, which had 1995. The yen and sterling sit in the AAA band by judgment.
5. **Unlisted middle-income countries.** `presetFor` gives them buenosAires's 0.15, against 0.7–2.6% for listed peers. This is the researcher's flag, and I agree.
6. **Grid threshold.** The brief says 6 hours, but the Western Europe and Buenos Aires anchors use 4. The researcher's 4-hour conversion reproduces all three anchors, so I left it. The brief's text should be updated.
7. **Grid saturation and urban share.**
   - A probability capped at 1 cannot represent Nigeria, and only barely India, South Africa and Turkey.
   - National indices put Poland (0.13) and Canada (0.14) above the United States (0.11). For city flats they are probably lower; Warsaw gives about 0.06.
   - Japan and Korea get a 0.3–0.4% blackout allowance against Europe's 1.15%. That makes them three times safer than Germany, by judgment.
8. **India's grid figure (0.55)** is a guess resting on snippets and a 30/70 weighting. It is the largest single uncertainty by population.
