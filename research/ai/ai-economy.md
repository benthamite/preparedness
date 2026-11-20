# ai-economy: AI and economic, financial and fraud hazards

Rates are annual probabilities for one household, in percent: central view (careful sceptic to highly concerned). Sources were read on 19 November 2026.

## 1. Rates

| Hazard | Place | Baseline | Now | Transition | After |
|---|---|---|---|---|---|
| bankingCrisis | US | 0.1 (0.03–0.3) | 0.15 (0.1–0.5) | 0.5 (0.1–3) | 0.1 (0.03–1) |
| | W. Europe | 0.2 (0.07–0.5) | 0.25 (0.2–0.7) | 0.8 (0.2–4) | 0.2 (0.05–1.5) |
| | Buenos Aires | 7 (4–15) | 8 (7–18) | 12 (7–25) | 6 (2–15) |
| supplyShock | US | 4.5 (2–8) | 5 (4.5–7.5) | 8 (4.5–20) | 3.5 (1.5–10) |
| | W. Europe | 6 (3–10) | 7 (6–10) | 11 (6–25) | 5 (2–12) |
| | Buenos Aires | 15 (8–25) | 15.5 (15–19) | 19 (15–35) | 13 (6–25) |
| incomeShock (new) | US | 0.3 (0.15–0.6) | 0.4 (0.3–1) | 5 (1–25) | 3 (0.3–15) |
| | W. Europe | 0.25 (0.1–0.5) | 0.3 (0.25–0.7) | 3.5 (0.7–15) | 2.5 (0.25–12) |
| | Buenos Aires | 0.4 (0.2–0.9) | 0.5 (0.4–1.5) | 5 (0.8–25) | 3 (0.4–15) |
| aiFraud (new) | US | 5 (2.5–9) | 6 (3–10) | 12 (5–30) | 5 (1–20) |
| | W. Europe | 3.5 (1.5–7) | 4 (2–8) | 8 (3–22) | 3.5 (1–15) |
| | Buenos Aires | 5 (2–10) | 6 (2.5–12) | 12 (4–30) | 5 (1–20) |
| marketCrash (new, do not carry) | all | 5 (3.5–8) | 10 (5–20) | 12 (5–30) | 5 (3–15) |

Overlaps with sibling files:
- supplyShock includes the cyber route, which `ai-cyber` also carries as `cyberSupplyShock`. Use one or the other. Without the cyber part I put supplyShock at 4.6% now and 6% in transition (US), 6.2% and 8% (Europe), 15.1% and 17% (Buenos Aires).
- I add no hazard for identity-system failure. System-wide payment failures are `ai-cyber`'s `paymentsOutage`. Lock-out of a household's own accounts is inside aiFraud. The link from AI to identity-system failure is speculation.
- civilUnrest is in `ai-war`.

## 2. What the sources say

**Speed of the economic transition.**
- Fast. Davidson (2023): "~3 years from 20%-AI to 100%-AI". Korinek and Suh (2024): with full automation in five years, "the wage collapse happens after about 3 years". Davidson and Hadshar (Forethought, May 2025): humans do physical labour "as their cognitive labour is no longer useful". Amodei (essay, January 2026): he "predicted that AI could displace half of all entry-level white collar jobs in the next 1–5 years".
- Slow. Narayanan and Kapoor (April 2025): "Diffusion occurs over decades, not years." Acemoglu (2024): productivity gain "no more than 0.66% in total" over ten years. Nordhaus (2021): "The tests suggest that the Singularity is not near." Jones (2026): growth accelerates only once "the vast majority of the weak links" are automated.
- The one quantified forecast. Forecasting Research Institute (March 2026, 69 economists): 14% on a "rapid" scenario by 2030. In it, labour-force participation falls from 62.6% "to 59.1% in 2030 and 55% in 2050", about half because of AI; unemployment is 6%.
- No numbers. Gradual Disempowerment, The Intelligence Curse, Aschenbrenner and AI 2027 give no unemployment rate and no probability. Epoch's GATE has no wage output.

**Labour market today.**
- Brynjolfsson, Chandar and Chen (August 2026): workers aged 22–25 in exposed occupations are "about 19% below" trend; "Experienced workers show no comparable gap"; "not causal estimates".
- Cleveland Fed (November 2026): unemployment up "roughly 1 percentage point more" in the most exposed occupations, job-finding down six points, no "consistent evidence of elevated job separation rates".
- Brookings and Yale (October 2025): "stability, rather than disruption". Anthropic's Massenkoff and McCrory (March 2026): "no systematic increase in unemployment for highly exposed workers".
- Challenger: employers cited AI for 112,713 cuts in January–July 2026.
- History: Frey and Osborne's 47% of jobs "at risk" (2013) did not turn into job losses.

**Financial stability.**
- Federal Reserve (13 November 2026): large banks have "close to $1 trillion of exposure" to AI-related borrowers; AI debt issuance "more than $680 billion by October 2026" against "$130 billion in all of 2023"; "AI was the top-cited risk" among 23 market contacts.
- IMF (October 2026): under an AI-led correction banks "would remain adequately capitalized", but weak banks hold 22% of global bank assets.
- Bank of England FPC: "The risk of a sharp market correction has increased" (October 2025); "The risk of a sharper correction persists" (September 2026).
- BIS Bulletin 120 (January 2026): risks "appear moderate".
- Barr (16 November 2026): bank capital is "a bulwark"; "AI agents may accelerate deposit outflows during stress periods".
- Gopinath (October 2025, via Benzinga): a dot-com-size crash would "wipe out over $20trn" of US household wealth.
- Chow, Halperin and Mazlish: transformative AI implies much higher real interest rates; no figure.
- Nobody gives a probability that an AI bust causes a banking crisis. Metaculus was blocked.

**Fraud today.**
- Gallup (June 2026): 6% of US adults lost money to a scam in 2025, a further 4% had a household member who did; $68 billion; mean $5,578.
- FTC: $15.9 billion reported for 2025, imposters over $3.5 billion; adjusted for under-reporting, $261.5 billion, or $38.1 billion conservatively.
- FBI IC3 2025: $20.9 billion; complaints tagged "AI Related" lost $893 million. This is the only official measure of AI's share and it is a floor.
- Javelin (vendor): 6 million account-takeover victims in 2025, 5.1 million in 2024.
- England and Wales: 7.8% of people were fraud victims in the year to March 2026. UK banks returned 88% of claimed push-payment losses under the 2024 rule. In the EEA users bore about 85% of €4.2 billion.
- Argentina: 34,468 reports to the federal unit in 2024, up 21%. Its head said in August 2024 that no case using AI had been detected. No prevalence survey exists.

**Social and political effects: speculation only.**
- Amodei writes of "public anger and perhaps even civil unrest"; Hendrycks, Schmidt and Wang say automation "could undermine political stability". Neither gives a probability, and no forecaster does.
- AI 2027's "10,000 person anti-AI protest in DC" for late 2026 has not happened. CSIS (October 2026) counts two AI-motivated attacks.
- Capital controls or emergency taxes as a response to AI: no source predicts them. Korinek and Lockwood (2026) analyse taxes for an eroding labour-tax base; Trammell and Patel mention capital flight, not controls.
- Supply incidents (United Natural Foods 2025, Marks & Spencer 2025, about 700 French supermarkets in October 2026): none is attributed to AI. Anthropic documented AI-run intrusions in August and November 2025.

## 3. What I infer

**incomeShock, US.**
- Baseline: 3.3 million long-tenured workers displaced in 2023–25 (BLS) is 1.1 million a year over about 85 million such workers (my assumption): 1.3%. At the survey 53% were sharply worse off (33.9% not employed, plus 29.1% of the 66.1% re-employed who worked part time or for 20% less). I take 0.35 as still down after two years, and 0.7 for graduates (Farber: 11% against 16%). 1.3 × 0.35 × 0.7 = 0.3%.
- Now: Challenger's cuts annualise to 193,000, 0.3% of about 60 million white-collar jobs (my assumption); times 0.4 adds 0.1 point.
- Transition, low: the FRI rapid scenario implies about 0.55% of the labour force leaving each year because of AI, plus 0.4 point a year of extra unemployment; times 1.5 for exposed professions and 0.5 for sharp loss, plus baseline: 1%.
- Transition, high: Korinek and Suh's five-year scenario, about 75% over five years: 25% a year.
- Loss: Davis and von Wachter find 1.4 to 2.8 years of earnings in present value. I use 2.

**aiFraud, US.**
- Now: 10% of adults live in a scammed household (Gallup). Imposters are "nearly one in three" FTC reports but lose money less often: 2–3%. Account takeover: 6 million over 132 million households (my assumption) is 4.5%, cut to 3% for overlap. Total 6%.
- Expected loss: $68 billion over 132 million households is $515; imposters are 22% of FTC losses, $113; plus $15 for takeover: about $130 a year.
- Baseline: today less an AI share of 10–20%.

**bankingCrisis.** Step 2's 0.15% per advanced-economy year, two-thirds of that for the US. Buenos Aires: two freezes and two impositions of retail exchange controls in 56 years, 7%.

**marketCrash.** Six drawdowns of 30% since 1871 is 3.9% a year on one compilation.

## 4. What is my guess

- Every transition and after rate. The central incomeShock figure, 5%, is the geometric mean of the two anchors above.
- The AI share of fraud (12%), the multipliers on bankingCrisis (1.5 now, 5 in transition) and on supplyShock (1.1 and 1.8).
- All supplyShock baselines, which rest on my own count of events.
- Every Buenos Aires figure except the freeze dates.
- Every survivableShare, and the split of supplyShock between the cyber route and the rest.

## 5. Can household preparation help?

- **incomeShock: barely.** Nothing on the list restores earnings. A liquid buffer of months of spending cuts borrowing costs, forced sales and missed housing payments; I put that at 3% of the harm (1–8%, guess). Carry the hazard only if the cash ladder runs to months of expenses.
- **aiFraud: yes.** See the items below. Cash at home and a second account also cover a lock-out.
- **marketCrash: no.** Nothing on the list changes the loss, and how to hold savings is investment advice. Model it as a higher incomeShock rate.

Candidate items:

| Item | Acts on | Evidence |
|---|---|---|
| Security keys or passkeys on email, bank and phone accounts | account takeover | Google, NYU and UCSD 2019: SMS codes blocked 76% of targeted attacks, device prompts 90%, security keys all. Microsoft 2023: 99.22% lower compromise risk. Both predate generative AI. |
| Family verification phrase with a call-back habit | voice-clone scams | Recommended by the FBI (3 December 2024), the National Cybersecurity Alliance and Starling Bank. No study of effectiveness exists. The target is small: over-60s lost $578 million to phone scams in 2025. |
| Credit freeze, carrier port-out PIN, transaction alerts | new-account fraud, SIM swap | No outcome study found for any of them. |
| Second account at an unrelated bank, card on another network | account lock-out, payment failures | No study; a direct substitute. |
| Cash at home | account lock-out, bankingCrisis | Ready.gov: "Keep a small amount of cash at home in a safe place." |
| Liquid buffer of one to six months of spending | incomeShock | Ganong and Noel: spending falls 6% at job loss and 12% more when benefits end (snippet). |
| Paper list of accounts, recovery codes, identity documents | lock-out, benefit claims | Ready.gov recommends it; no study. |

## 6. Attribution traps

- Amodei's "10–20%" unemployment is Axios's paraphrase (28 May 2025). His essay gives no rate.
- "25% of remote-work jobs" is not in AI 2027.
- Gourinchas's "not financed by debt" (October 2025) is overtaken by the Fed's 2026 figures.
- Deloitte's $40 billion is a projection.
- Gallup's 2023 figure (15% of households) used a different question from 2026; it is not a trend.
- The FBI's AI figure counts complaints whose text mentions AI.

## 7. Method and what could not be opened

Four research subagents gathered sources. I re-read the Fed report, the IMF chapter and working paper, Barr, the September 2026 FPC record, Korinek and Suh, Amodei, Narayanan and Kapoor, FRI, Brynjolfsson et al., the Cleveland Fed, Gallup, BLS and the NBER digests. "Verified" in the JSON covers pages read by me or a subagent. Fetches pass through a summarising model, so re-check quotations before print. Several PDFs were read from the copies the fetch tool saved.

Not opened: Metaculus (two values came through a reader proxy and are marked unverified), Axios, The Economist, the UK Treasury Committee page, Urban Institute, archive.org, Coefficient Giving, the FTC 2025 data book, the IC3 definition of "AI Related", PNAS, Yale Budget Lab, GAO and Labor Department reports on 2020 benefit delays, Polymarket (read through trackers), and UFECI's 2025 report, which is not yet published. The full list is in the JSON.
