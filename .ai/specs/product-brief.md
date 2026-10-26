# DevMentor — product brief

- Date: 2026-10-21
- Mode: own; Owner: founder A (Oliwia); Pass: re-baselined on 2026-10-21 to the scope of the reference backlog `full-backlog.md`; the earlier pilot brief is archived in `.ai/specs/archive/2026-10-20-pilot/`
- Evidence basis: 7 interviews (4 developers who get stuck, 3 senior engineers who answer for free), all reached through the founders' contacts or invitation list, so not a random sample; a 14-day export of one developers' Discord (109 threads); a 54-answer survey on the same Discord (stated intent, not payment); two competitor pages checked on 2026-09-04; decisions from the 2026-08-26 workshop. The scope and decisions of 1.0 are adopted from the reference backlog without its brief, so their rationale is not supplied. Read every result as a signal to check, not a conclusion about the market. Most consequential untested belief: that developers will pay for a bookable session at a mentor's price (A01).
- Coverage: 83 claims — 77 sourced (interview 10, data 3, document 62, product 0, benchmark 2), 0 synthetic, 6 assumed; 1 entry on the collection plan
- Synthetic questions outside Coverage: 2
- Definition of Ready signed by: founder A adopted the reference decisions on 2026-10-21; Q18 and Q19 were decided on 2026-10-21 (D27, D28); ready for: filing the backlog; Q20 must be answered before 2026-11-28
- Sources: research directory `.ai/specs/research/` (cited by file name; decision records in `decisions/`); the reference backlog `full-backlog.md`; repository `README.md`, `AGENTS.md`

## Decision summary

Decision (adopted by founder A, 2026-10-21): DevMentor 1.0 is a marketplace where invited senior engineers publish bookable 25- or 50-minute text sessions, mentees pay through Stripe, and each session ends with a written answer and a privately kept note the mentee approves (D01, D04, D05, D08, D20, D22). The first iteration is 14 stories; seven more wait for 1.1 (D13).

Basis: developers who got stuck describe losing half a day to a week and wanting a fast answer from someone who has done the exact thing; one Discord shows 21% of help threads with no human reply (Problems). No mentee asked for the vault, which stays later (D05).

What could change this: only 3 of 54 survey respondents have ever paid anyone (A01); mentors may not accept an invitation or publish a slot (A03, D18); text sessions run outside the product (D27) and payouts are manual (D28), but the first iteration is still much larger than the 25 build hours from the workshop, which are not estimated here. The 1.0 metric is 10 paid sessions a week for two consecutive weeks by 2026-12-31 (D16).

[SYNTHETIC] Questions from the two-run prototype walkthrough: what does an invited mentor believe is public before saving the page, and what payout information do they need before setting prices? These are questions to check, not user evidence or requirements; they do not change existing rules.

Next: file the backlog; use the collection-plan mentor task to inform E02-S02 and E02-S04; answer Q20 (recording mentor-page visits) before 2026-11-28; check the manual payout flow with a lawyer or Stripe before the first payout (Q27). Prices are in EUR (D29). Read all results as signals to check.

## Vision

- The team's intended direction: mentors earn twice, once for the hour and again each time that knowledge helps someone else; 1.0 delivers the first half and a privately kept note, the vault is later (D05). `[DOCUMENT]` 2026-09-02-miro-board-vision-target-needs.md

## Target group and stakeholders

- Customer (pays): a mentee, a working developer with an urgent problem, in the beachhead of English-speaking TypeScript, React, Python and AI-agent developers (D24). `[DOCUMENT]` full-backlog.md
- User (mentee): developers stuck on a specific, time-bound problem; the platform developer in a 200-person company with an internal channel is the counter-case. `[INTERVIEW]` 2026-08-20-interview-working-dev.md, 2026-09-02-interview-platform-dev-solves-alone.md
- User (mentor): invited senior engineers who already answer the same questions unpaid. `[INTERVIEW]` 2026-08-22-interview-mentor.md, 2026-09-03-interview-senior-python-meetups.md, 2026-09-03-interview-staff-engineer-declined-before.md
- Stakeholders: the operator, which is the two founders (D19); Stripe is the one external payments dependency (D04). `[DOCUMENT]` decisions/D19-operator-is-the-two-founders.md
- Decider for scope decisions: founder A. `[DOCUMENT]` 2026-08-26-workshop-export.md

## Problems, with evidence

- A developer lost half a day on a TypeScript generics error before a release and shipped a workaround. `[INTERVIEW]` 2026-08-20-interview-working-dev.md
- A fintech developer's staging ingress broke on a Friday evening; a Discord answer arrived Saturday and was wrong; the release slipped from Monday to Tuesday. `[INTERVIEW]` 2026-09-01-interview-backend-dev-fintech.md
- A freelancer under-quoted a migration after two evenings of reading and a Discord "it depends", costing about a week of own time. `[INTERVIEW]` 2026-09-02-interview-freelancer-react.md
- 109 help threads in 14 days: 23 (21%) got no human reply; median wait for the first reply was 67 minutes among the 86 answered (the export note says 68; the CSV gives 67); 31 carried an urgency signal and 9 of those got no reply. `[DATA]` 2026-09-04-data-request-discord-help.md, 2026-09-04-discord-help-requests.csv (one Discord, 2026-08-18 to 08-31, labels assigned by one person)
- 35 threads ended solved and 20 partially (the export note says 23 partial; the CSV gives 20). `[DATA]` 2026-09-04-discord-help-requests.csv
- What people did the last time: 49 searched, 38 asked an AI assistant, 31 asked a community, 20 shipped a workaround, 3 paid someone. `[DATA]` 2026-09-04-survey-discord-willingness-to-pay.md (multiple choice, self-selected)
- Mentors lose time to repeated answers and their notes "rot". `[INTERVIEW]` 2026-08-22-interview-mentor.md
- Conditions the mentees named: an answer within the hour (working developer), someone found in 20 minutes and a booking under 5 minutes (fintech developer), the same day (freelancer). `[INTERVIEW]` 2026-08-20-interview-working-dev.md, 2026-09-01-interview-backend-dev-fintech.md, 2026-09-02-interview-freelancer-react.md
- How often a given developer gets stuck is unknown: "ciągle" was never quantified and the fintech episode was one Friday. `[INTERVIEW]` 2026-09-02-interview-freelancer-react.md, 2026-09-01-interview-backend-dev-fintech.md

## Product and how it stands out

- What it is: bookable 25- or 50-minute text sessions with invited senior engineers, paid through Stripe, each ending with a written answer and a privately kept note (D01, D04, D05, D08). `[DOCUMENT]` full-backlog.md
- Codementor is the closest: live help paid by time, listed at $15 to $80 per 15 minutes, nothing kept after the session; the board's "$8 to $30" was too low. `[BENCHMARK]` 2026-09-04-benchmark-codementor.md
- MentorCruise sells a monthly relationship from $100 a month, which the staff engineer refused. `[BENCHMARK]` 2026-09-04-benchmark-mentorcruise.md
- That a mentor-owned knowledge layer inside the coding agent sets DevMentor apart is the founders' hypothesis and is Later. `[ASSUMPTION]` 2026-09-02-miro-board-product-goals.md

| reference | what it does well | where it falls short for our users | checked on | link |
|---|---|---|---|---|
| Codementor | request-to-session is the whole product | transactional; 40 minutes to find someone, then a call the user did not want | 2026-09-04 | https://www.codementor.io/ |
| MentorCruise | free intro call; 7,200 mentors | monthly commitment; no one-off | 2026-09-04 | https://mentorcruise.com/ |

Three other competitors (ADPList, Topmate, Preply) have checks in the research folder; not read for this decision.

## Goals and success criteria

- Business goal: the smallest product that earns for a mentor without a call. `[DOCUMENT]` 2026-08-26-workshop-export.md
- The 1.0 metric: 10 paid sessions a week for two consecutive weeks by 2026-12-31, chosen by founder A (D16). `[DOCUMENT]` decisions/D16-metric-10-paid-sessions-a-week.md
- The invitation check: one bookable session within two weeks of accepting, in batches of 20; fewer than 5 of the first 20 stops further invitations (D18). `[DOCUMENT]` decisions/D18-invitation-check-batches-of-20.md
- A second measure the reference backlog cites: median booking-to-start under 48 hours in the first four weeks, which it attributes to D22 although D22 is the slot rule; the id is ambiguous (Q21). `[DOCUMENT]` full-backlog.md
- User outcome: a mentee gets an answer from someone who has done it, in text, within the time the problem allows. `[INTERVIEW]` 2026-08-20-interview-working-dev.md
- Must not get worse: no video (N01), no ratings (N02), nothing published without mentee approval (D02), no promise of speed in copy (R14). `[DOCUMENT]` decisions/N01-no-video.md

## Scope

- **Now (first iteration, D13, 14 stories):** accounts with GitHub and e-mail sign-in and role screens (E01); invited mentors with a mentor page, slots and prices (E02-S01 to S04); a mentee picks a slot and pays through Stripe Checkout, both are told and see upcoming sessions (E03-S02 to S04); a text session in the channel the mentor names, the written answer, the mentor's note and the mentee's approval or decline of it (E04-S01 to S04).
- **1.1 (D13, 7 stories):** Stripe Connect onboarding (E02-S05), the mentor list by stack tag (E03-S01), cancellation with the 24-hour rule (E03-S05), the 20% fee and Connect payout (E03-S06), and the operator functions: invitations, price bounds and fee, disputes (E05-S01 to S03).
- **Later:** the vault and anything published (D05), search or ranking (R13), automatic refunds (R09), a second payment provider (R05), an admin role beyond the two founders (D19), co-editing the note (R12), open mentor registration (R07), stacks outside the four (R16). The public home page (E07) is not in D13's first iteration; whether it ships with 1.0 is founder A's call.
- **Not doing:** see Non-goals.

## Domain glossary

| Term | Meaning | Owned by | Visible to |
|---|---|---|---|
| Mentee | the paying developer; the code currently calls the role `student` (naming open, Q22) | mentee | mentee and the mentor they booked |
| Mentor | an invited senior engineer who publishes slots and prices (D08, D09) | mentor | public mentor page |
| Operator | the two founders; they invite mentors, set price bounds and the fee, and resolve disputes (D19) | founders | operator screens |
| Slot | a time a mentor publishes; bookable when it starts at least two hours later (D22) | mentor | mentees |
| Session | a 25- or 50-minute text exchange (D01, N01) | mentor and mentee | both |
| Written answer | what the mentor gives after the session; the mentee keeps it (D05) | mentor | mentee |
| Note | drafted by the mentor, approved or declined by the mentee, kept privately by both (D20) | mentor and mentee | both |

## Key flows

- Current state: the founders' journey runs problem, search, ask on Slack or Discord, judge on GitHub, schedule, pay, session, nothing kept. `[DOCUMENT]` 2026-09-02-miro-board-journey-current-state.md
- Interviews confirm the asking and judging steps; the cost was time, not money. `[INTERVIEW]` 2026-09-01-interview-backend-dev-fintech.md, 2026-09-02-interview-freelancer-react.md
- Future state for 1.0: the stories in Scope describe it step by step: invited mentor publishes slots and prices, a mentee finds a mentor by list or share link (D21), books a slot at least two hours ahead, pays through Stripe Checkout, holds the text session, receives the written answer, and approves or declines the mentor's note. `[DOCUMENT]` full-backlog.md
- The founders' own future-state journey includes Meet/Zoom and reviews, which contradict N01 and N02, so it cannot be used as is. `[DOCUMENT]` 2026-09-04-miro-board-journey-future-state.md

## Business rules

| Id | Rule | Applies to | Source | Status | Review by | Required path to change | Owner | Supersedes |
|---|---|---|---|---|---|---|---|---|
| R01 | A session is 25 or 50 minutes (D01) | 1.0 | `[DOCUMENT]` decisions/D01-sessions-25-or-50-minutes.md | active | unknown | superseding row approved by founder A | founder A | none |
| R02 | Nothing from a session is published without the mentee's approval (D02) | 1.0 | `[DOCUMENT]` decisions/D02-nothing-published-without-mentee-approval.md | active | unknown | superseding row approved by founders A and B | founders A and B | none |
| R03 | Sessions are text; the product says so on every session screen (N01) | 1.0 | `[DOCUMENT]` decisions/N01-no-video.md | active | unknown | superseding row approved by founder A | founder A | none |
| R04 | A link to public work and a plain description appear on every mentor page (N02) | 1.0 | `[DOCUMENT]` decisions/N02-no-ratings.md | active | unknown | superseding row approved by founder A | founder A | none |
| R05 | Stripe Checkout for sessions and Stripe Connect for payouts; onboarding before the first payout (D04) | 1.0 | `[DOCUMENT]` decisions/D04-stripe-only-with-connect-for-payouts.md | active | unknown | superseding row approved by founder A | founder A | none |
| R06 | GitHub sign-in first, e-mail fallback (D07) | 1.0 | `[DOCUMENT]` decisions/D07-github-sign-in-with-email-fallback.md | active | unknown | superseding row approved by founder A | founder A | none |
| R07 | Mentors join by invitation only; no open registration (D08) | 1.0 | `[DOCUMENT]` decisions/D08-mentors-join-by-invitation.md | active | unknown | superseding row approved by founder A | founder A | none |
| R08 | Each mentor sets their own prices within the operator's bounds (D09) | 1.0 | `[DOCUMENT]` decisions/D09-mentor-prices-within-operator-bounds.md | active | unknown | superseding row approved by founder A | founder A | none |
| R09 | Cancellation is free up to 24 hours before; later cancellation forfeits the fee; the operator resolves disputes; no automatic refunds (D10) | 1.0 | `[DOCUMENT]` decisions/D10-cancellation-24-hours-disputes-by-operator.md | active | unknown | superseding row approved by founder A | founder A | none |
| R10 | The platform fee is 20% of a session, configurable by the operator (D11) | 1.0 | `[DOCUMENT]` decisions/D11-platform-fee-20-percent.md | active | unknown | superseding row approved by founder A | founder A | none |
| R12 | The mentor drafts, the mentee approves in full or declines with a comment, no co-editing (D20) | 1.0 | `[DOCUMENT]` decisions/D20-mentor-drafts-mentee-approves-the-note.md | active | unknown | superseding row approved by founder A | founder A | none |
| R13 | The mentor list is filtered by stack tag and ordered by most recent published availability; no search, no ranking (D21) | 1.0 | `[DOCUMENT]` decisions/D21-list-by-stack-tag-or-share-link.md | active | unknown | superseding row approved by founder A | founder A | none |
| R14 | A slot is bookable only if it starts at least two hours later; no promise of speed in copy (D22) | 1.0 | `[DOCUMENT]` decisions/D22-slots-bookable-two-hours-ahead.md | active | unknown | superseding row approved by founder A | founder A | none |
| R15 | The product records the time from booking to session start for every booking (D22) | 1.0 | `[DOCUMENT]` decisions/D22-slots-bookable-two-hours-ahead.md | active | unknown | superseding row approved by founder A | founder A | none |
| R16 | Invitations and tags only from the beachhead (D24) | 1.0 | `[DOCUMENT]` decisions/D24-beachhead-typescript-react-python-ai-agents.md | active | unknown | superseding row approved by founder A | founder A | none |
| R17 | Invitations go in batches of 20 with the two-week ask; fewer than 5 of 20 stops further invitations (D18) | 1.0 | `[DOCUMENT]` decisions/D18-invitation-check-batches-of-20.md | active | unknown | superseding row approved by founders A and B | founders A and B | none |
| R18 | Operator actions without a story are done by hand and logged in the shared operator note (D19) | 1.0 | `[DOCUMENT]` decisions/D19-operator-is-the-two-founders.md | active | unknown | superseding row approved by founders A and B | founders A and B | none |
| R19 | The text session takes place in a channel the mentor names on their mentor page; DevMentor holds the written answer and the note, records when the session starts (R15) and tells both parties where it happens (D27) | 1.0 | `[DOCUMENT]` decisions/D27-text-exchange-in-the-channel-the-mentor-names.md | active | unknown | superseding row approved by founder A | founder A | none |
| R20 | Until Stripe Connect ships in 1.1 the operator pays mentors by bank transfer by hand and logs each payout in the shared operator note (D28, R18) | 1.0 | `[DOCUMENT]` decisions/D28-first-iteration-payouts-by-hand.md | active | unknown | superseding row approved by founders A and B | founder A | none |
| R21 | Prices, charges, fees and payouts are in EUR; the platform has one currency (D29) | 1.0 | `[DOCUMENT]` decisions/D29-prices-and-charges-in-eur.md | active | unknown | superseding row approved by founder A | founder A | none |
| R22 | The amount owed to a mentor for a paid session is the price less the 20% fee, recorded for every paid session in the first iteration so the operator can pay by hand; the automatic Connect split stays in 1.1 (D30, D28) | 1.0 | `[DOCUMENT]` decisions/D30-owed-to-the-mentor-is-the-price-less-20-percent.md | active | unknown | superseding row approved by founder A | founder A | none |
| R23 | Each account has exactly one role: mentee, mentor or operator; a founder who also mentors uses a separate mentor account (D31) | 1.0 | `[DOCUMENT]` decisions/D31-one-role-per-account.md | active | unknown | superseding row approved by founder A | founder A | none |
| R24 | The session channel address is shown only to the mentor and the mentee of a confirmed booking, never on the public mentor page (D32) | 1.0 | `[DOCUMENT]` decisions/D32-the-channel-is-shown-to-the-two-parties-only.md | active | unknown | superseding row approved by founder A | founder A | none |

R11 is cited by no issue text in the reference backlog and is not defined here.

## Non-goals

| Id | We are not building | Why | Owner | Status | Review by | Required path to change | Source | Supersedes |
|---|---|---|---|---|---|---|---|---|
| N01 | video calls; sessions are text | workshop constraint; mentee: "text is fine, faster" | founder A | active | unknown | superseding record by founder A | `[DOCUMENT]` decisions/N01-no-video.md | none |
| N02 | ratings or a reviews profile; each mentor links public work instead | all three mentors refuse ratings; two mentees distrust them | founder A | active | unknown | superseding record by founder A | `[DOCUMENT]` decisions/N02-no-ratings.md | none |

## Decisions

| Id | Date | Decision | Why | Owner | Status | Review by | Required path to change | Source | Supersedes |
|---|---|---|---|---|---|---|---|---|---|
| D01 | 2026-10-21 | sessions are 25 or 50 minutes | adopted from the reference backlog; its rationale is not supplied | founder A | active | unknown | superseding row approved by founder A | `[DOCUMENT]` decisions/D01-sessions-25-or-50-minutes.md | none |
| D02 | 2026-10-21 | nothing from a session is published without the mentee's approval | adopted from the reference backlog; its rationale is not supplied | founders A and B | active | unknown | superseding row approved by founders A and B | `[DOCUMENT]` decisions/D02-nothing-published-without-mentee-approval.md | none |
| D03 | 2026-10-21 | the first iteration must leave an answerable session | adopted from the reference backlog; its rationale is not supplied | founder A | active | unknown | superseding row approved by founder A | `[DOCUMENT]` decisions/D03-first-iteration-leaves-an-answerable-session.md | none |
| D04 | 2026-10-21 | Stripe is the only payment provider, with Stripe Connect for mentor payouts | adopted from the reference backlog; its rationale is not supplied | founder A | active | unknown | superseding row approved by founder A | `[DOCUMENT]` decisions/D04-stripe-only-with-connect-for-payouts.md | none |
| D05 | 2026-10-21 | 1.0 delivers the written answer and a privately kept note; the vault is later | adopted from the reference backlog; its rationale is not supplied | founder A | active | unknown | superseding row approved by founder A | `[DOCUMENT]` decisions/D05-written-answer-and-private-note-vault-later.md | none |
| D07 | 2026-10-21 | sign-in with GitHub for every role, e-mail plus password as the fallback | adopted from the reference backlog; its rationale is not supplied | founder A | active | unknown | superseding row approved by founder A | `[DOCUMENT]` decisions/D07-github-sign-in-with-email-fallback.md | none |
| D08 | 2026-10-21 | mentors join by invitation in 1.0 | adopted from the reference backlog; its rationale is not supplied | founder A | active | unknown | superseding row approved by founder A | `[DOCUMENT]` decisions/D08-mentors-join-by-invitation.md | none |
| D09 | 2026-10-21 | each mentor sets 25- and 50-minute prices within operator-set bounds | adopted from the reference backlog; its rationale is not supplied | founder A | active | unknown | superseding row approved by founder A | `[DOCUMENT]` decisions/D09-mentor-prices-within-operator-bounds.md | none |
| D10 | 2026-10-21 | free cancellation up to 24 hours before; later forfeits the fee; disputes by the operator; no automatic refunds | adopted from the reference backlog; its rationale is not supplied | founder A | active | unknown | superseding row approved by founder A | `[DOCUMENT]` decisions/D10-cancellation-24-hours-disputes-by-operator.md | none |
| D11 | 2026-10-21 | platform fee of 20% of a session; the vault fee is set later | adopted from the reference backlog; its rationale is not supplied | founder A | active | unknown | superseding row approved by founder A | `[DOCUMENT]` decisions/D11-platform-fee-20-percent.md | none |
| D13 | 2026-10-21 | first iteration of 14 stories and 1.1 of 7, as marked in the reference backlog index | adopted from the reference backlog; its rationale is not supplied | founder A | active | unknown | superseding row approved by founder A | `[DOCUMENT]` decisions/D13-first-iteration-and-1-1-split.md | none |
| D16 | 2026-10-21 | the 1.0 metric: 10 paid sessions a week for two consecutive weeks by 2026-12-31 | adopted from the reference backlog; its rationale is not supplied | founder A | active | unknown | superseding row approved by founder A | `[DOCUMENT]` decisions/D16-metric-10-paid-sessions-a-week.md | none |
| D18 | 2026-10-21 | one bookable session within two weeks of an invitation, in batches of 20; fewer than 5 of 20 stops invitations | adopted from the reference backlog; its rationale is not supplied | founders A and B | active | unknown | superseding row approved by founders A and B | `[DOCUMENT]` decisions/D18-invitation-check-batches-of-20.md | none |
| D19 | 2026-10-21 | the operator is the two founders; by-hand operator functions are logged | adopted from the reference backlog; its rationale is not supplied | founders A and B | active | unknown | superseding row approved by founders A and B | `[DOCUMENT]` decisions/D19-operator-is-the-two-founders.md | none |
| D20 | 2026-10-21 | the mentor drafts the note, the mentee approves in full or declines with a comment, the mentor redrafts; no co-editing | adopted from the reference backlog; its rationale is not supplied | founder A | active | unknown | superseding row approved by founder A | `[DOCUMENT]` decisions/D20-mentor-drafts-mentee-approves-the-note.md | none |
| D21 | 2026-10-21 | the mentor list by stack tag, or the share link; no search, no ranking | adopted from the reference backlog; its rationale is not supplied | founder A | active | unknown | superseding row approved by founder A | `[DOCUMENT]` decisions/D21-list-by-stack-tag-or-share-link.md | none |
| D22 | 2026-10-21 | mentors publish slots; a slot is bookable when it starts at least two hours later | adopted from the reference backlog; its rationale is not supplied | founder A | active | unknown | superseding row approved by founder A | `[DOCUMENT]` decisions/D22-slots-bookable-two-hours-ahead.md | none |
| D24 | 2026-10-21 | the beachhead: English-speaking TypeScript, React, Python and AI-agent developers | adopted from the reference backlog; its rationale is not supplied | founder A | active | unknown | superseding row approved by founder A | `[DOCUMENT]` decisions/D24-beachhead-typescript-react-python-ai-agents.md | none |
| D27 | 2026-10-21 | the text exchange takes place in a channel the mentor names; the product keeps only the written answer and the note | agent recommendation accepted by founder A; alternative was a session screen inside DevMentor; cost is no session screen and session content outside the product | founder A | active | unknown | superseding row approved by founder A | `[DOCUMENT]` decisions/D27-text-exchange-in-the-channel-the-mentor-names.md | none |
| D28 | 2026-10-21 | until Connect ships in 1.1 the operator pays mentors by bank transfer by hand and logs it | agent recommendation accepted by founder A; alternative was Connect in the first iteration; cost is manual work and a money-flow question to verify with a lawyer or Stripe | founder A | active | unknown | superseding row approved by founder A | `[DOCUMENT]` decisions/D28-first-iteration-payouts-by-hand.md | none |
| D29 | 2026-10-21 | prices, charges, fees and payouts are in EUR | founder A's choice among PLN, EUR and USD; no recommendation was made | founder A | active | unknown | superseding row approved by founder A | `[DOCUMENT]` decisions/D29-prices-and-charges-in-eur.md | none |
| D30 | 2026-10-21 | the amount owed to a mentor is the price less the 20% fee, recorded per paid session in the first iteration | agent drafting of D11 and D28, confirmed by founder A; alternative was the full price with the fee settled outside the product | founder A | active | unknown | superseding row approved by founder A | `[DOCUMENT]` decisions/D30-owed-to-the-mentor-is-the-price-less-20-percent.md | none |
| D31 | 2026-10-21 | one role per account; a founder who also mentors uses a separate mentor account | agent recommendation accepted by founder A; alternative was combined roles; cost is two accounts for one person | founder A | active | unknown | superseding row approved by founder A | `[DOCUMENT]` decisions/D31-one-role-per-account.md | none |
| D32 | 2026-10-21 | the session channel address is shown only to the two parties of a confirmed booking | agent recommendation accepted by founder A; alternative was a public address, which lets a mentee skip the payment; cost is that either party can still move the session outside DevMentor | founder A | active | unknown | superseding row approved by founder A | `[DOCUMENT]` decisions/D32-the-channel-is-shown-to-the-two-parties-only.md | none |

Decisions made here after the adoption start at D27 so they do not clash with the ids the reference backlog cites. The reference backlog also cites D06, D12, D14, D15, D17, D23, D25 and D26 (for example D26 narrows N02 to presentational design-system components, and D17 relates to Q20) without their text; they are not adopted here (Q23). The earlier pilot decisions are archived in `.ai/specs/archive/2026-10-20-pilot/`.

## Riskiest assumptions

| Id | Assumption | Importance | Evidence today | If false | Smallest test | Owner | By when | Result |
|---|---|---|---|---|---|---|---|---|
| A01 | Developers will pay for a bookable session at the mentor's price `[ASSUMPTION]` team belief | high | stated: 37 of 54 would pay something, 23 would pay 25 EUR or more; interviews gave "50 euro, 100 if it fixes it" and "below 200 zł" with hesitation; behaviour: 3 of 54 have paid anyone; no payment tested | the D16 metric is out of reach and 1.0 is revisited | the first paid sessions after invitations, counting completed payments apart from stated intent and started bookings | founder A | 2026-12-31 (D16) | untested |
| A02 | Text is enough for most blockers `[ASSUMPTION]` team belief | medium | survey: 33 text, 9 call, 12 depends; the freelancer wants a call for estimates; the fintech developer: "call jak tekst nie zadziała" | N01 is revisited | note in the sessions which ones ask for a call | pending | unknown | untested |
| A03 | Invited mentors publish a bookable session within two weeks `[ASSUMPTION]` team belief | high | three mentors, all conditional (one "ok, ale pewnie powiem nie"); 50 on the list, none contacted | no supply; invitations stop (D18) | the first batch of 20 invitations (D18) | both founders | within two weeks of each invitation | untested |
| A04 | The mentor list and share links reach people who are stuck now `[ASSUMPTION]` no material | high | 16 of 50 mentors have an audience of their own, 11 do not, 23 unknown; the staff engineer wants the share link as the only door | no demand reaches mentors | count how mentees arrive: list, share link, or neither (Q20) | founders A and B | before 2026-11-28 (Q20) | untested |
| A05 | Mentees accept forfeiting the fee on a cancellation within 24 hours `[ASSUMPTION]` no material | medium | no material; the freelancer asked for a same-day refund when a mentor does not come | trust in paying is lower than assumed | count late cancellations and complaints in 1.1 | founder A | after 1.1 ships | untested |

## Kill criteria

D18 stops further invitations when fewer than 5 of the first 20 invited mentors publish a bookable session within two weeks. D16 sets the metric (10 paid sessions a week for two consecutive weeks by 2026-12-31); what happens if it is missed is not decided and stays with founder A. Completed payments count; verbal intent and started bookings do not. The numbers in D16 and D18 are founder A's choices with no baseline in the material.

## Questions to check from the synthetic walkthrough

- `[SYNTHETIC question]` Before saving a mentor page, what does an invited mentor believe will be public, and do they want to review the page first? Ask this during a real-user task and observe their decision. Source: `.ai/specs/research/walkthroughs/2026-10-26-mentor-onboarding-session-001/report.md`. This question does not settle PA03 or decide whether to build a separate preview; R04 defines the public work link and description.
- `[SYNTHETIC question]` Before setting prices, what does an invited mentor expect to happen after a booking, and when do they expect payment or payout details to be requested? Compare the answer with the operator's manual 1.0 process (D28/R20). Source: the same walkthrough report; no payout was simulated. This question does not resolve Q27 or change D28.

## Open questions

| Id | Question | Blocking | Who can answer | Status |
|---|---|---|---|---|
| Q18 | Where does the text exchange take place? | no longer | founder A | closed: a channel the mentor names (D27) |
| Q19 | How are first-iteration mentors paid before Stripe Connect? | no longer | founder A with founder B | closed: by hand by the operator (D28); the money flow is to be verified with a lawyer or Stripe before the first payout |
| Q20 | Is a signed-in mentee's visit to a mentor page without booking recorded? The invitation check needs those developers | yes: before the fourth-week check on 2026-11-28 | founder A with founder B | open |
| Q21 | Which decision holds the "median booking-to-start under 48 hours in the first four weeks" target the reference backlog attributes to D22? | no: decide before E03-S03 | founder A | open |
| Q22 | Mentee or `student`: the brief says mentee, the code's `Role` says `student` | no: decide once in E01-S01 | founder A | open |
| Q23 | Are the cited decisions D06, D12, D14, D15, D17, D23, D25 and D26 part of 1.0, and what do they say? | no: supply or confirm they do not exist | founder A | open |
| Q24 | What are the initial values of the operator's price bounds and the first prices, in EUR? | no: blocking before QA of E02-S04 | founder A | open |
| Q25 | What does a late-cancelled, forfeited booking pay the mentor, and is the platform fee taken? D10 says only that the mentee's fee is forfeited | yes: before E03-S05 and E03-S06 are implemented (1.1) | founder A | open |
| Q26 | Which e-mail transport and sender address send the confirmations and invitations? A logging mailer tells nobody | yes: before launch, not for implementation | founder A | open |
| Q27 | Is holding mentees' money and paying mentors by hand (D28) permitted, or does it need Stripe Connect or a payment institution first? To be checked with a lawyer or Stripe; this is not legal advice | yes: before the first payout | founders A and B | open |
| Q28 | May a written answer be revised after it is posted? The reference contradicts itself; the draft allows one posting | no: decide in the E04-S02 spec | founder A | open |
| Q29 | Does the public home page (E07) ship with 1.0, and what replaces the fictional mentor band and its reviews, which conflict with N02? | yes: for the mentor-band story only | founder A | open |

## Definition of Ready addendum (own)

Problems and Target group have support from interviews and data, with limits: contacts of the founders, one Discord, stated payment intent; these are signals to check, not market conclusions. A01 is what the first paid sessions test; it was not accepted as true.

Ready for: filing the backlog. Blocking later: Q20 before 2026-11-28; Q27 (the manual payout flow, D28) before the first payout; Q26 before launch; Q25 before E03-S05 and E03-S06; Q24 before QA of E02-S04. The first iteration is far larger than the 25 build hours from the workshop; they are not estimated here.

## Collection plan

### Mentor page visibility and payout expectations during invited setup

- What decision or work needs it: inform the page-visibility explanation in E02-S02 and payout information in E02-S04; this does not change D28 or settle Q27.
- Who can answer it: invited senior engineers who answer technical questions and are considering a mentor page.
- How: a task-based interview/usability walkthrough. Before saving the page, ask what the mentor believes will be public and observe whether they seek a preview or hesitate. At the pricing step, ask what they expect after a booking and when payment details should be requested; compare this with the operator's manual process. Do not suggest an answer.
- Owner and by when: unknown.
- Template: `.ai/specs/research/templates/interview-note.md`
