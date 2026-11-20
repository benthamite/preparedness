# cyber-windows: how long cyber outages last

Proposed windows for `cyberOutage`, `paymentsOutage` and `commsOutage`, and a new profile for `cyberSupplyShock`, are in `cyber-windows.json`. The rates are in `ai-cyber.json`, revised the same day (`ai-cyber.md`, section 5).

## Why the tails were too short

Sentinel's forecasters give 33% to a week-long, non-natural outage of power, telecoms, payments or water for a million people somewhere in the OECD by the end of 2028. That is about 0.07–0.09% a year per resident, and about 0.17% once their tail forecast for a year of extreme disruption is added. The old windows put only 7–10% of each hazard's events past a week, so the model implied 0.037%. The day-or-more rates were roughly right for power and communications; the durations were not.

## The record

Lengths run until the household could again use the service, or until most of it was back.

| Event | Service | Scale | Length |
|---|---|---|---|
| Ukraine, Dec 2015 and Dec 2016 (attack) | power | 225,000 customers; part of Kyiv | 1–6 hours; about 75 minutes |
| Moore County, NC, Dec 2022 (gunfire) | power | 40,000–45,000 customers | about 4 days |
| Berlin, Sep 2025 and Jan 2026 (arson) | power | about 50,000 customers; 45,000 households and 2,000 businesses | 60 hours; about 4.5 days |
| Iberia, Apr 2025 (not an attack) | power | Spain and Portugal | about 10 hours for most; 99% of demand in 18.5 |
| Venezuela, Mar 2019 (blamed on sabotage) | power | most of the country | 4–6 days in most cities |
| NongHyup, South Korea, Apr 2011 (attack) | payments | about 30 million account holders | ATMs 2–3 days, cards 3–4; data by about 22 April |
| Sepah and Pasargad, Iran, Jun 2025 (wiper) | payments | two large banks | cards in 2–3 days; full recovery 10; online banking weeks |
| Four Iranian banks, Jun 2026 | payments | state banks | disruption over two weeks, with relapses |
| Trellance processor, US, Nov–Dec 2023 (ransomware) | payments | about 60 credit unions | at one, cards 12 days, online banking 14 |
| KDDI, Japan, Jul 2022 (maintenance error) | mobile | up to 39 million lines | 61 hours; full recovery declared at 86 |
| Kyivstar, Ukraine, Dec 2023 (attack) | mobile and home internet | 24.3 million mobile, 1.1 million home | 2 days without signal; all services in 4, 100% in 8 |
| Viasat KA-SAT, Feb 2022 (attack) | satellite internet | tens of thousands of modems | replacement modems shipped over a month |
| Colonial Pipeline, May 2021 (ransomware) | fuel | US East Coast | 6 days shut; 10,600 stations still dry 6 days after restart |
| Coop Sweden, Jul 2021 (ransomware via Kaseya) | food shops | about 700 of 800 stores closed | all reopened within 6 days |
| UK Co-op, May 2025 (attack) | food shops | its stores, worst on islands | about 2 weeks of shortages |
| UNFI, Jun 2025 (attack) | grocery distribution | Whole Foods and independents | ordering 10 days; core systems 3 weeks |
| Change Healthcare, Feb 2024 (ransomware) | prescriptions | over 7,000 pharmacies and hospitals | workarounds at 90% in 6 days; restored in 15 |
| Jaguar Land Rover, Sep 2025 (attack) | car production | its plants and suppliers | 5.3 weeks to restart; normal output in about 11 |
| CrowdStrike, Jul 2024 (faulty update) | firms' computers | 8.5 million machines | hours for most; Delta 5 days |

Two patterns. Power comes back within days even when equipment is damaged, because utilities carry spares and can run by hand. Software-run services come back in days for the basic function and in weeks for the rest: a wiped system must be rebuilt from backups, which are often hit too (Sepah). Coveware's last published average downtime after ransomware was 24 days (2022).

## The proposals

**`cyberOutage`: power 2.5, 7, 21 days (was 2, 6, 14).** The median rises because every day-long physical hit on record took two to five days. The 99th percentile allows for damage at many substations at once, repaired in turn. The windows that follow power lengthen with it, and a medication window is added. The definition loses its 14-day ceiling, since the model's cap of 1.5 × p99 now reaches 31 days; the boundary with `gridLong` becomes one of cause (destroyed long-lead equipment, storms, EMP). About 3% of events now run past two weeks, so the rate rises by 3%, lost in rounding.

**`paymentsOutage`: 3, 10, 35 days (was 2, 7, 30).** At every bank attacked, cards and cash machines came back in two to twelve days; full service took ten days to a month. Under these windows 22% of events last a week, against 10% before.

**`commsOutage`: 2, 7, 25 days (was 1.5, 5, 14).** Both outages of a day or more lasted two to three days for most users. The attacked network took eight days to restore fully. The tail is equipment bricked by an attack, as with Viasat's modems. The definition now counts all software and configuration failures, such as KDDI's, which adds about 0.01 points a year.

**`cyberSupplyShock`: food 0.1 × (2, 6, 14) days; medication 0.35 × (3, 10, 30) days.** The hazard is redefined as the household's usual shops or pharmacy stopped for a day or more. Fuel is left out because the model cannot represent it. The food window opens only when no shop within reach sells food: an island or small town served by the stricken chain, or a distributor serving most local shops. Its length follows Coop Sweden (six days) and the UK Co-op (two weeks). The medication window follows Change Healthcare: workarounds at most pharmacies within six days, the system back in fifteen. With this profile the hazard can join the model, and its `unused` note in `data/config.mjs` can go.

## What is guessed

Every window is a judgment from a handful of events, many outside the OECD or not attacks. The 99th percentiles are the least grounded: no OECD event has reached them. Windows are net of outside relief, so I have cut firms' recovery times to the point where a household could get the service elsewhere or in part; that cut is a guess. The model's `durationScale` (0.6–1.7) still applies on top.
