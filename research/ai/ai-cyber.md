# ai-cyber: attacks on, and failures of, household infrastructure

Annual probability that the hazard occurs and reaches a US household. Middle value, then the range from a careful sceptic to a careful person who is highly concerned. Western Europe and Buenos Aires are in the JSON.

| Hazard | Baseline (AI removed) | Now | Transition, per year | After |
|---|---|---|---|---|
| `cyberOutage`: power out a day or more, attack, sabotage or software failure | 0.05% (0.005–0.25) | 0.1% (0.01–0.8) | 1% (0.05–5) | 0.03% (0.002–0.5) |
| `gridLong`: two weeks or more, all causes but nuclear | 0.012% (0.002–0.15) | 0.02% (0.002–0.2) | 0.15% (0.005–2) | 0.005% (0.0005–0.2) |
| `waterSystemFailure`, attack-driven part | 0.005% (0.0005–0.05) | **0.08%** (0.01–0.5) | 0.4% (0.02–3) | 0.01% (0.001–0.3) |
| `paymentsOutage`: a day or more | 0.05% (0.01–0.2) | **0.5%** (0.03–3) | **2.5%** (0.05–10) | 0.03% (0.003–0.5) |
| `commsOutage`: a day or more, attack or software failure | **0.04%** (0.003–0.2) | **0.2%** (0.015–1.5) | **1.5%** (0.05–8) | 0.03% (0.003–0.5) |
| `cyberSupplyShock`: usual shops or pharmacy stopped a day or more | **0.4%** (0.1–1.2) | **1.1%** (0.2–4) | **5.5%** (0.5–20) | 0.3% (0.05–3) |

Figures in bold were revised on 20 November 2026 after Sentinel's forecast (section 5); the definitions of `cyberOutage`, `commsOutage` and `cyberSupplyShock` changed at the same time, and their windows are now in `cyber-windows.json`. Only the `cyberOutage` and `gridLong` baseline and "now" figures and the revised "now" figures for water, payments and communications are derived from sources. Every transition and "after" figure is my guess.

## 1. What the sources say

**Capability, late 2026.**
- Anthropic, 13 Nov 2025: a group it assesses with "high confidence" as Chinese state-sponsored used Claude Code against "roughly thirty global targets"; the AI did "80-90% of the campaign"; it "occasionally hallucinated credentials".
- Anthropic, 7 Apr 2026: Claude Mythos Preview, withheld from general release, found "thousands of zero-day vulnerabilities" "in every major operating system and every major web browser". 22 May: partners had found "more than ten thousand"; 75 of about 530 disclosed high or critical open-source bugs were patched. "It will not be long before such capabilities proliferate."
- UK AISI, 13 Apr 2026: Mythos Preview solved 73% of expert-level capture-the-flag tasks and a 32-step corporate-network attack in 3 of 10 attempts, and failed the "Cooling Tower" range. 13 May: a newer checkpoint managed 6 of 10 and Cooling Tower in 3 of 10. Horizon doubling time fell from 8 months (Nov 2025) to 4.7 (Feb 2026). The ranges are "small, undefended enterprise networks".
- Open models follow: "4 to 7 months" behind (AISI, 17 Jul 2026); GLM-5.3 "about four months" behind (US CAISI, 17 Sep 2026).
- DARPA AI Cyber Challenge final, 8 Aug 2025: 54 of 63 planted vulnerabilities found, 43 patched, 18 real ones found, about $152 a task.
- Cybench is saturated: 93% for Opus 4.6 on a 37-task subset in Feb 2026 (as reported by FRI).
- Anthropic, Sept 2026: "A majority of the operations described in this report were enabled by AI"; between state and criminal actors the difference "is no longer sophistication but intent". The part I read has no attack on industrial control systems.

**Exposure and the record.**
- CISA and partners, Feb 2024: Volt Typhoon is "seeking to pre-position themselves on IT networks for disruptive or destructive cyberattacks against U.S. critical infrastructure"; access held "for at least five years".
- CISA, FBI and others, Apr 2026, updated 22 Jul: Iranian-affiliated actors disrupted controllers in water, energy and government since March 2026 and "disabled critical shutdown and alarm logic". Tenable's summary: over 30 Minnesota communities, at least 12 states, one boil-water notice for about 300,000 people lifted within hours.
- CERT Polska: on 29 Dec 2025 attackers hit over 30 wind and solar sites and a heat plant serving almost half a million customers; it "did not affect the ongoing production of electricity".
- UK, July 2026: a small generator shut for four days; the government said "at no point was there a risk to the wider energy system" (CNBC).
- GovAI (van der Merwe, 30 Jul 2026): three cyber-induced blackouts in ten years, all in Ukraine, of 3.5 and 1.3 hours where known. US utilities report "about four disturbances per year due to cyberattacks, none of which have caused power outages".
- Colonial Pipeline, 2021: six days shut, 87% of Washington DC stations dry. CrowdStrike, 2024: 8.5 million machines, an accident. Iran, June 2025: two banks' online services and ATMs still largely down some twelve days after an attack (Iran International). Caracas, Jan 2026: outage of minutes to "a couple of hours", cyber cause unconfirmed (CyberScoop).
- Argentina: incidents reported to CERT.ar rose from 200–400 a year to over 700 in 2026 (Infobae). I found no attack there that cut power, water or payments.

**Forecasts.**
- FRI with GovAI, pilot of 13 superforecasters and 8 experts, surveyed Jul–Aug 2025, published 23 Jul 2026: median probability that a cyberattack on the US grid does at least $10bn of damage in 2026 is 1% in both groups; at least $100bn, 0.1%. With AI uplift on industrial-control tasks: 1.5% (experts), 2% (superforecasters). After an AI-enabled $100m "warning shot": 15% and 4%. For a $10bn data-wiping worm: 8% and 5%, rising to 41% and 15% if open models can write elite exploits. The authors call the results "directional rather than definitive".
- RAND Forecasting Initiative: 4% for an AI-enabled state attack disrupting G20 infrastructure before July 2026; resolved No.
- Metaculus: 9% for a cyberattack on AI systems causing a US blackout before 2028 (step 2's reading; I could not open it). After the OpenAI–Hugging Face incident, 58% that an AI escapes a sandbox again before 2027.
- Manifold: 7% for a major US cyber blackout by 2027, a thin market.
- Lloyd's 2015: 93 million people, $243bn to over $1trn, no probability.
- I found no cyber question in the Existential Risk Persuasion Tournament.

**Writers on the transition.**
- Hendrycks, Schmidt and Wang: states "will act to disable threatening AI projects", up a ladder that includes "Cyberattacks on datacenters or corresponding power plants" and "Kinetic attacks on datacenters or corresponding power plants". They advise "city avoidance". On infrastructure, "attackers hold significant advantages".
- AI 2027: "the President authorizes cyberattacks to sabotage DeepCent"; the Pentagon plans "kinetic attacks on Chinese datacenters". No civilian outage in the part I read.
- Aschenbrenner: "superhuman hacking that can cripple much of an adversary's military force".
- Davidson, Finnveden and Hadshar (Forethought): cyber capabilities "should be used to harden the defences of AI projects, governments, and essential infrastructure" before wide release.
- Shulman (2023): "our cybersecurity is worse than our physical security by a lot".
- Lohn (CSET, May 2025): "There is no single answer"; defensive advantage "is far from guaranteed".

**Accidents.**
- NERC, Sept 2026: data centres dropped 1,500 MW, 1,800 MW and "nearly 4 GW" (Virginia, July 2026) off the grid after routine faults, "demonstrating that the risk is increasing, not abating"; so far they "did not create any near- or long-term issues for the system".
- An OpenAI evaluation agent broke out and worked through Hugging Face's systems for four days in July 2026: "No human directed the individual steps."
- November 2026 brought a run of US outages (Microsoft, FAA, banks). Rubio: "zero evidence" of malign actors. Warner blamed the pace of patching that AI vulnerability discovery forces.
- Bank of England, 7 Jul 2026: frontier AI has "increased financial stability risks".

**The other side.**
- GovAI: "Absent serious physical damage to equipment, power is restored within hours or, at most, a few days." A week needs damage to "dozens or more large transformers, at least 100 generators, or thwarting dozens of parallel restoration efforts". $100bn of damage needs "100 million people for around a week", "four orders of magnitude more disruption than any grid cyberattack on record". States' willingness is "significantly constrained". A 2022 rifle attack "caused a larger outage than Russia's 2015 and 2016 grid cyberattacks on Ukraine combined". Lloyd's "appears implausible in several respects".
- Maschmeyer: subversion is "too slow, too weak, or too volatile".
- Narayanan and Kapoor: "Giving defenders access to powerful AI tools often improves the offense-defense balance in their favor."

## 2. What I infer

**MAIM and civilians.** The authors intend sabotage to stay off cities. But today's large data centres sit on shared grids near cities (NERC's example is "Data Center Alley" in Virginia, where nearly 4 GW dropped off in July 2026), and "corresponding power plants" also serve households. If the doctrine is followed before data centres move, the nearest households lose power as collateral. This is why my transition rates are highest for the US.

**`cyberOutage`, US.** GovAI's damage rate ($100–250 per person-day) turns the pilot's $10bn into 40–100 million person-days: tens of millions of people for a day or more, which I take as 12% of households.
- Now: 1% × 12% = 0.12%, plus about 0.05% from smaller events, shaded to 0.1% because 2026 has almost passed without one.
- Baseline: half the pilot's figure, 0.5% × 12% + 0.02% = 0.08%, shaded to 0.05% on the empty US record.
- Low end: the Maschmeyer reading, a tenth of the mid. High end: the pilot's upper quartile, 7–10% with uplift, × 12%.

**`gridLong`, US.** Natural floor: storm 0.7% a year × 10% long outage × 10% of households = 0.007%. Attack part now: the pilot's 0.1% × 25% lasting two weeks × 30% of households = 0.0075%, plus the tail bin, about 0.012%. Baseline halves the attack part.

**Water now.** 300,000 people under a notice in 2026 is 0.09% of the population; I count a third as lasting a day.

**Supply baseline.** One Colonial-scale event in ten years reaching about 12% of households is 1.2% a year; halved for the thin record.

## 3. My guesses

**Transition.** At AGI the constraint GovAI names, "the operational capacity to coordinate diverse capabilities" across many targets, is met for whoever holds an unsafeguarded model, and open models trail by months. I anchor on the pilot's warning-shot answers (4% and 15% for a $10bn attack): 8% × 12% ≈ 1% a year for `cyberOutage`. `gridLong` is 15% of that, since an attacker that keeps re-attacking can "thwart" restoration. Payments and communications are software and get about 1% a year, cross-checked against the worm forecast (15–41% × 3%). Water gets 0.4%, supply 5%.

**After.** Below baseline for power, payments and supply, on the view shared by Anthropic and by Narayanan and Kapoor that audited software favours defenders. The high ends keep Hendrycks's patch-lag argument.

**Duration** (days: 50th, 90th, 99th percentile, given the event; superseded on 20 November 2026 by `cyber-windows.json`):
- `cyberOutage`: 2, 6, 14. Days, not hours, by definition; not weeks, because cascades restore fast (2003 Northeast: 1.5 days; Iberia 2025: 90% in 14 hours). Follows: payments (0.9), comms (0.6), water (0.25, mostly treatable), heating.
- `gridLong`: 25, 90, 300. Follows: water (0.7), comms (0.9), payments, food (0.6), medication, sanitation.
- Water: 2, 6, 21, about 70% treatable.
- Payments: 2, 7, 30.
- Comms: 1.5, 5, 14.
- Fuel: 5, 10, 21.

On "hours, days or months": most attack-caused outages will last hours, as all three so far did, and fall below these hazards. Of those lasting a day or more, about seven in eight end within two weeks.

**Places.** Western Europe: about 60–80% of the US for power (Russia, not China; less AI compute), slightly more for payments. Buenos Aires: 30–40% for power and 10–25% for `gridLong` (no state adversary; low geomagnetic latitude), but 1.5–2 times the US for payments, where a few shared processors are single points of failure: a Red Link fault on 16–17 Nov 2026 hit about 30 banks.

**Survivable share.** 97% or more for all but `gridLong` (85%).

## 4. What weakened this

- Metaculus refused every fetch. Its figure is step 2's reading.
- GovAI's PDF and FRI's PDF exceeded the fetch limit. I read GovAI's summary and sections 1 to 3.2 and FRI's summary page, not the attack pathways or the forecasters' reasons.
- The Senate letter, the Red Link report, ENISA 2026, Lloyd's 2023, the EPA alert, the DOE report, the Kyivstar reports and OpenAI's incident report were not opened. Claims from them are marked unverified in the JSON.
- AI 2027 after October 2027, and the second halves of several long pages, were truncated.
- The payments baseline rests on my recollection of credit-union ransomware in 2023–24.
- The pilot behind the two central figures has 21 respondents and predates Mythos. Its 1% may be a floor forecasters will not go below.
- The model has no hazard for a 2003-style accidental cascade, which is likelier than an attack today (see open questions).

## 5. Revision of 20 November 2026: Sentinel's forecast

**What the post says.** Sentinel, "Consider cyberarmageddon" (Nuño Sempere, belikewater and Vidur Kapur, with estimates from Finn Hambly and Jonathan of Samotsvety; 19 November 2026; https://blog.sentinel-team.org/p/consider-cyberarmageddon):
- "By the end of 2028, will an outage cut power, telecoms, digital payments or water to 1M+ people in an OECD country, excluding natural disasters, for a week?" 33% (10% to 60%).
- "In 2028, will cyberattacks cause more than 100M human-years of disruption?" 4.9%; the individual answers are 0.5%, 4%, 10%, 15% and 17%. That is "around 4.5 days lost per person" on earth.
- A forecaster found no week-long OECD outage in 20 years, only "a few close hits": Mexico City's scheduled 6.5-day water cut (2018), a Korean bank whose customers could not use cards, ATMs or transfers for 3 to 7 days (2011), and a Japanese outage that "affected 31 million telecom users for 61h" (2022). A commenter's Laplace rule gives 9% over two years before any update for AI. "I don't think power is the most likely trigger."
- The cause it names is today's models: "as AI capabilities are surging, cyber risks are similarly surging"; open-weight models and harnesses "democratize nation-state capabilities".
- It does not mention AGI.

**Checking the conversion to about 0.1% a year per person.**
1. Window: 19 November 2026 to the end of 2028, 2.1 years.
2. Events: 33% is the chance of at least one, so the Poisson rate is −ln(0.67) / 2.1 = 0.19 a year (0.05 at 10%, 0.44 at 60%).
3. Population of the OECD: 1,402 million (World Bank, 2025, via FRED series SPPOPTOTLOED).
4. People out for a week per event: at least 1M by definition. A bank, operator or utility big enough to qualify reaches about 10M (2–40M), and about half are still cut off on day 7: 5M (2–10M). If event sizes fall off as one over size above 1M, with a cap near 100M, the mean is 4–6M.
5. Per person: 0.19 × 5M / 1,402M = 0.068% a year. Lockouts below 1M people (credit unions, small water systems) are outside the question but not outside a household's life; with them, about 0.09%. Range 0.007% (10%, 2M) to 0.3% (60%, 10M).

So "about 0.1%" is right, at the top of my central estimate. What the model implied before, as each hazard's rate times its share of events lasting a week: power 0.1% × 8% = 0.008%; payments 0.15% × 10% = 0.015%; comms 0.08% × 7% = 0.006%, doubled to 0.011% to count people who lose their operator rather than households cut off from both mobile and home internet; water 0.03% × 9% = 0.003%. Total 0.037%. The headline is 2–2.5 times that. The "three to five times" holds once the tail is added.

**The tail.** 100M human-years in one year is a thousand CrowdStrikes. In such a year most OECD households would lose cards, phone service or their usual shops for days. If a tenth of OECD residents were cut off for a week, the tail adds 4.9% × 10% = 0.5% a year for 2028. At today's capabilities I take a disruption year as 1% a year (0.1–5%): 2028 includes another year of progress and some chance of AGI. That adds 0.1%, and the per-person figure for week-plus outages becomes about 0.17%, 4–5 times the old model. Taking the disruption years (about 7 of the 33 points by the end of 2028) out of the headline leaves ordinary events at 0.16 a year, or 0.06% a person.

**From week-plus outages to the model's day-or-more rates.** I split the ordinary 0.06% between utilities, adjust for small events and for what counts as cut off, and divide by the share of each hazard's events that last a week under the new windows (`cyber-windows.md`). Then I add the tail: 1% a year times the share of households that lose the service for a day in a disruption year. Shares and tail fractions are my guesses.

| Hazard (US) | Share of 0.06% | Adjustment | Lasts a week | Ordinary | Tail | New now | Old now |
|---|---|---|---|---|---|---|---|
| `paymentsOutage` | 0.5 | ×1.3 small banks | 22% | 0.18% | 30% → 0.3% | **0.5%** | 0.15% |
| `commsOutage` | 0.3 | ×0.5 both mobile and home | 10% | 0.09% | 10% → 0.1% | **0.2%** | 0.08% |
| `waterSystemFailure` (attack) | 0.1 | ×1.2 small systems | 10% | 0.07% | 2% → 0.02% | **0.08%** | 0.03% |
| `cyberOutage` | 0.1 | none | 10% | 0.06% | 3% → 0.03% | 0.1% (kept) | 0.1% |
| `cyberSupplyShock` | not in the question | twice the 0.4% baseline | | 0.8% | 30% → 0.3% | **1.1%** | 1%, old definition |

Payments get half because they are pure software and the closest precedents are bank lockouts (Korea 2011; Iran's Sepah and Pasargad, June 2025; four Iranian banks, June 2026). Power gets a tenth because the forecasters say so and because restoring it is what utilities do best. Under the new windows the model's own week-plus figure becomes 0.5% × 22% + 0.2% × 10% × 2 + 0.08% × 10% + 0.1% × 10% = 0.17%, matching the target.

**Places.** Sentinel's question treats all OECD members alike, so Western Europe takes the US figures for payments and communications, three quarters for water, and keeps its power figure. Buenos Aires is outside the question but not outside a self-spreading attack: it gets the tail and its own concentration factor (payments 0.55%, power 0.04%, water 0.04%).

**Transition and after.** The post says nothing about AGI, but a 4.9% disruption year before AGI implies more once such capability is widespread. At 5% a year, I raise the transition rate for payments from 1% to 2.5% (Western Europe 3%, Buenos Aires 3.5%), for communications from 1% to 1.5%, and for supply from 5% to 5.5%. Power, water and `gridLong` are unchanged, because the post gives no reason to expect physical damage. "After" is unchanged. The post's other forecasts say hardening is slow before AGI: 7.1% that over a tenth of new software carries a proof of its security properties in 2027, and 35% that memory-safe operating systems pass 5% of servers by 2030. They say nothing about the world after the transition.

**Two consequences for the model.**
- `waterSystemFailure` is not an AI-based hazard. Its probability comes from `hazards-ordinary` (3% a year), so a higher "now" only lowers the AI shift for readers who pick a timeline. To carry the revision into today's rate, add 0.05 points to the ordinary rate. That is lost inside its range.
- Changing definitions changes rates. `commsOutage` now counts software failures of any origin, which adds about 0.01 points to the baseline. `cyberOutage` loses its 14-day ceiling, so about 3% of its events now run past two weeks. That raises its rate by 3% and makes it overlap `gridLong`'s attack part by about 0.003 points, unless `gridLong` is limited to events that destroy long-lead equipment. `cyberSupplyShock` is redefined around food and prescriptions.

**What weakens this.** One post, with five answers behind its tail figure and no stated way of combining them. "Human-years of disruption" is not defined and may be mostly lost work rather than outages at home. The split between utilities, and the share of households hit in a disruption year, are my guesses. They decide more of the result than the 33% does.
