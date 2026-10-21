# Backlog

One section per `Backlog source:`. The tracker is the live authority; this file is the source-to-issue map, the dependencies and the reserved ids.

## Source: `.ai/specs/product-brief.md`

Filed 2026-10-20 (E01–E05) and 2026-10-21 (E06, accounts and roles) to `KatarzynaSzajnaPrimotly/ai_techleaders_project` through `om-backlog` and `om-prepare-issue`. No issue was adopted: the only other issue (#2) is unrelated. A child lists its epic or story in its body (`Epic:` / `Story:`) and its dependencies in `Depends on:`; each epic carries a checklist of its stories.

### E01
- E01 — #5 [A mentee can buy a written answer](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/5)
  - E01-S01 — #10 [A mentee who opens a mentor's link sees what they will pay and when they will be answered](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/10)
  - E01-S02 — #11 [A mentee can pay PLN 200 in advance and send a written question](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/11) — depends on E01-S01 (#10)

### E02
- E02 — #6 [A mentor can answer within the window](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/6)
  - E02-S01 — #12 [A mentor can publish availability and receive a paid question](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/12) — depends on E01-S02 (#11)
    - E02-S01-T01 — #13 [Mentor sign-in (session) so only the mentor publishes availability and answers](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/13)
  - E02-S02 — #14 [A mentor can answer in text and the mentee receives it](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/14) — depends on E02-S01 (#12)
  - E02-S03 — #15 [A mentor can ask for more information and answer from what was provided if the mentee does not reply](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/15) — depends on E02-S01 (#12)

### E03
- E03 — #7 [Refunds and mentor payout](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/7)
  - E03-S01 — #16 [A mentee whose mentor misses the window gets a full refund](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/16) — depends on E02-S01 (#12)
  - E03-S02 — #17 [A mentor receives PLN 150 per completed request](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/17) — depends on E02-S02 (#14)

### E04
- E04 — #8 [Pilot measurement and prerequisites](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/8)
  - E04-S01 — #18 [The pilot coordinator can see whether the success rule is met](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/18) — depends on E01-S02 (#11), E02-S02 (#14)
  - E04-T01 — #19 [Recruit the first mentors](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/19)
  - E04-T02 — #20 [Publish basic terms and a privacy notice before the first payment](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/20)

### E05 (parked, no stories)
- E05 — #9 [Later (parked)](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/9)

### E06 — Accounts and roles (D16 to D19, R08 to R11)
- E06 — #22 [Accounts and roles](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/22)
  - E06-S01 — #23 [The pilot coordinator can sign in and reach the admin pages; nobody else can](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/23) — depends on E02-S01-T01 (#13)
  - E06-S02 — #24 [The coordinator can create an account for an invited mentor](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/24) — depends on E06-S01 (#23)
  - E06-S03 — #25 [A guest mentee is identified by e-mail and counted once](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/25) — depends on E01-S02 (#11)
  - E06-S04 — #26 [Role and ownership checks hold on every route](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/26) — depends on E06-S01 (#23), E06-S02 (#24), E02-S01 (#12)

### Build order implied by the dependencies
E01-S01 → E01-S02 → E02-S01 (with its task E02-S01-T01) → E02-S02 and E02-S03 → E03-S01 (after E02-S01) and E03-S02 (after E02-S02) → E04-S01 (after E01-S02 and E02-S02). E06-S01 follows E02-S01-T01, E06-S02 follows E06-S01, E06-S03 follows E01-S02, and E06-S04 comes last (after E06-S01, E06-S02 and E02-S01). E04-T01 and E04-T02 have no code dependencies and must be done before the first payment.

Reserved ids: E01–E06, E01-S01–S02, E02-S01–S03, E02-S01-T01, E03-S01–S02, E04-S01, E04-T01–T02, E06-S01–S04.
