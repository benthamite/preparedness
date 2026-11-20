# cyber-items: offline backup and spare computer; offline reference library

Two items from the advice in Sentinel's "Consider cyberarmageddon" (19 November 2026): "an offline backup of your important data and perhaps a backup computer", and offline Wikipedia "or even useful physical books". On these figures neither pays for itself as preparedness.

## A new need: `dataAccess`

**Definition.** A day on which a member of the household cannot reach the files, accounts and working computer they rely on for work, records and money. News and contact belong to `information`, and the ability to pay belongs to `payments`.

**What opens it.**
1. *A comms window*, for the share of the household's essentials that live only online: web documents, streamed photo libraries, online records. I put that share at 0.4 (0.2–0.7). Western Digital's 2025 survey of 6,118 consumers found 78% using free cloud storage and 45% an external drive. Synced folders keep local copies; streamed ones do not.
2. *Ransomware, a wiped device or a locked account.* In the model this belongs in `aiFraud` (6% a year per US household), which has no window now. Security.org's survey found that about 6% of adults a year have an account taken over, and 23% of victims lose an email or messaging account. That is about 1.3% of adults, or 2.6% of two-adult households, a year. I propose a `dataAccess` window in `aiFraud` with pOccur 0.3 and days 3, 14, 60. Google says recovery "can be delayed for a few hours or a number of days"; accounts without a working second factor take longer.
3. *The computer destroyed or left behind* when the household is displaced: pOccur 0.4, for at most about a week per event, until a replacement is bought and files are restored from the cloud. `houseFire` has no windows, so fire enters only through displacement.

**Hardship.** $4 per person-day at first (1–15), $7 from day 4 and $10 from day 15. 27% of US paid workdays are worked from home (FRED, October 2026). If a fifth of those depend on the household's own machine or files, and a lost day costs about $100 after the work made up later, that is about $5 per working adult-day. Records, bills and personal projects add $1–2. Averaged over members (children ×0.3), the first days come to about $4. The cost then rises as bills, claims and deadlines are missed. Mortality is zero.

**Work lost.** `research/impartial/impartial.json` already gives 0.55 of a knowledge worker's day. My curve implies far less for the average member, because few workers depend on household machines; the open questions say how to reconcile the two.

**Not data-backup.** `data-backup` (money-docs.json) is a cloud service and a connected drive, valued on records lost in a fire. It needs the network, and CISA warns that encrypted local files "will be synced to the cloud, possibly overwriting unaffected data." This entry is an unplugged copy and a second machine, valued on days of access.

## `offline-backup-computer`

**Spec.** An encrypted 2 TB portable drive, refreshed monthly, unplugged and kept in the go-bag or away from home. A spare laptop with the same essentials, a password-manager emergency kit and offline tools. A restore test twice a year.

**Price: $400 ($96–750).** Read on retailer pages on 20 November 2026, when storage cost two to three times its 2024–25 level:
- drives: Seagate Expansion 2 TB at $95.99 (Staples, out of stock), WD Elements 2 TB at $169.99 (Target), Seagate One Touch with password at $163.99 (Zones);
- laptops at Target: a refurbished ThinkPad T490 at $209.99, a T14 Gen 1 at $304.99, a new HP 14 at $299.99.

Low: a drive alone, the old laptop serving as the spare. Middle: a $170 drive plus a refurbished or cheap new laptop. High: a 2 TB SSD ($458–575) plus a $300 laptop. Encryption software is free. Life 5 years, setup 4 hours, upkeep 2.5 hours a year. Everyday share 0.6 (0.3–0.85), since drive failure, theft and ransomware are far commoner than regional events. Reliability 0.75: copies go stale, passwords are forgotten, batteries go flat.

**Effects on `dataAccess`, for a household that would otherwise improvise with its phone and synced folders:**
- in comms-window hazards, 0.6 (0.3–0.85) of the harm removed, at 0.75 adherence. Cloud-only files and offline work return; networked work does not.
- in `aiFraud` lockouts and ransomware, 0.8 at 0.85 adherence. Files and a working machine return at once; the locked account does not.
- in displacement hazards, 0.3 at 0.6 adherence. Only a drive taken along or kept elsewhere helps.

**Rough value for two US adults:**
- lockouts: 6% × 0.3 × about 6 days × $5.5 × 1.5 people ≈ $0.90 a year, of which 0.8 × 0.85 × 0.75 is removed: $0.45;
- comms: about 0.16 comms-window days a year (step 2) × 0.4 × $4 × 2 ≈ $0.50, of which a third is removed: $0.17;
- displacement: a few cents.

About $0.7 a year, against a preparedness share of cost of about $40 a year plus 2.5 hours of upkeep. It could rank only for a member whose income lives on a personal computer, or if the model adds everyday device loss (open questions).

## `offline-reference`

**Spec.** Kiwix, which is free on every platform, with:
- English Wikipedia: the 119 GB edition with pictures on a laptop, and the 13 GB "mini" or 49 GB edition without pictures on phones;
- WikiMed (1.7 GB), iFixit (3.3 GB), Wikivoyage (1 GB) and Stack Exchange's DIY, cooking and gardening sites;
- PDFs, refreshed yearly.

Two paperbacks cover a flat battery: the SAS Survival Handbook ($25.99) and Black & Decker's Book of Home How-To ($40.00), both at Barnes & Noble. WikiHow is no longer offered as a Kiwix file.

**Price: $66 ($26–160).** One book; two books; or three books plus a 256 GB microSD card ($62.99, Target) for a phone too full for Wikipedia. Life is 5 years, setup 1.5 hours, upkeep 0.5 hours a year, everyday share 0.2 and reliability 0.65 (the device must be charged and the household must remember the library).

**Effects.**
- *Information*, hardship only, all hazards: 0.04 (0.01–0.1). Comms.json's $15 day is $11.25 of news, $10.50 of contact and $3.25 of ordinary use. A reference library recovers perhaps a sixth of the ordinary use plus a little practical guidance in long outages: about $0.6 of the day. Offline entertainment gets 0.05 and maps 0.03; nothing here restores news or contact.
- *Trauma*, in `gridLong`, `nuclearNear`, `nuclearFar` and `pandemicSevere`: 0.01 (0–0.04) at 0.5 adherence. This copies reference-books, since no study measures either. WikiMed is fuller and searchable but slower than paper in an emergency and dies with the battery. The two are near-perfect substitutes; the engine's multiplicative combination overstates owning both.

**Rough value.** Information: 0.16 days × $15 × 2 × 0.04 × 0.8 × 0.65 ≈ $0.10 a year; trauma adds almost nothing. Cost is about $11 a year plus half an hour, so it does not rank. Its real use, know-how that improves every other improvisation in a long outage, is something the model cannot credit.

**Not reference-books.** That entry is a paper first-aid manual and lay medical handbook. This one is mostly digital and general, and its paper books are practical, not medical.

## What is guessed, and what I could not open

Every effect fraction, the hardship curve, the window shares and the 0.3 share of `aiFraud` events that lock files are guesses; prices and Kiwix sizes are data. Amazon, Walmart, Best Buy, B&H, Newegg and Back Market refused automated fetches; their snippets show cheaper laptops ($159–250) and drives ($86–97) that I could not confirm.
