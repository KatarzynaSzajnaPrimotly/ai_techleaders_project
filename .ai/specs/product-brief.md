# DevMentor — product brief

- Date: 2026-10-20
- Mode: own; Owner: founder A (Oliwia); Pass: Quick pass, refreshed 2026-10-20 (one question round in each session, inline review, no independent reading)
- Evidence basis: 7 interviews (4 developers who get stuck, 3 senior engineers who answer for free), all reached through the founders' contacts or invitation list, so not a random sample; a 14-day export of one developers' Discord (109 threads); a 54-answer survey on the same Discord (stated intent, not payment); two competitor pages checked on 2026-09-04; decisions from the 2026-08-26 workshop. The board is the founders' positions, not evidence. Read every result below as a signal to check, not a conclusion about the market: seven conversations and 54 self-selected answers are small, and probably not representative. Most consequential untested belief: that developers will actually pay for a text answer (A01).
- Coverage: 63 claims — 55 sourced (interview 14, data 5, document 34, product 0, benchmark 2), 0 synthetic, 8 assumed; 2 entries on the collection plan
- Synthetic hypotheses outside Coverage: 0
- Definition of Ready signed by: founder A confirmed Now, the unit, what the pilot measures, the price, mentor payment, refund and window rules, the terms owner and the success rule on 2026-10-20; ready for: implementation planning of the pilot's scope only (not the Later items); starting it is a separate decision: basic terms and a privacy notice must exist before the first payment (D10) and mentors must be recruited (A02)
- Sources: research directory `.ai/specs/research/` (cited by file name below; decision records in `decisions/`, capture templates in `templates/`); repository `README.md`, `AGENTS.md`, `mentoring-portal-concept/docs/04-screen-specifications.md`

## Decision summary

Decision (agreed by founder A, 2026-10-20): the first build is a pilot that sells prepaid written answers, reached through the mentor's own link (D03, D05). The vault, MCP, subscription and ratings wait.

Pilot terms: one fixed price of PLN 200, of which the mentor gets PLN 150 per completed request (D13, D14); the mentor answers within four business hours of the mentor's published availability, otherwise a full refund initiated within five business days (D09, D11); success is 3 paid requests from 3 different mentees, with at least 10 mentees offered, otherwise inconclusive after six weeks (D15). The pilot also records minutes from payment to first answer (D06). Founder A coordinates, decides go/no-go and owns basic terms and a privacy notice before any payment (D07, D10).

Basis: developers who got stuck describe losing half a day to a week and wanting a fast text answer from someone who has done the exact thing (Problems). One Discord shows 21% of help threads with no reply. No mentee asked for the vault.

What could still change this: only 3 of 54 survey respondents have ever paid anyone, and PLN 200 is the edge of the only ceiling a mentee stated in zł (A01); two mentees named 20 minutes and an hour, while the window is four business hours (A04); mentors may decline a fixed price or a link-only door (A02, A05). The target of three is provisional with no baseline.

Next: no blocking question remains; the brief is ready for implementation planning of the pilot's scope. Before the first payment, terms and a privacy notice must exist (D10), and mentors must be recruited. Read all results as signals to check, not conclusions about the market.

## Vision

- The team's intended direction: mentors earn twice, once for the hour and again each time that knowledge helps someone else. `[DOCUMENT]` 2026-09-02-miro-board-vision-target-needs.md
- The first build tests only the first half (D03); the second half is Later.

## Target group and stakeholders

- Customer (pays): a developer paying from their own pocket was described by the freelancer (below 200 zł) and, with hesitation, the fintech developer ("chyba"). `[INTERVIEW]` 2026-09-02-interview-freelancer-react.md, 2026-09-01-interview-backend-dev-fintech.md
- Customer (pays): the platform developer would pay only for a rare one-off, found in five minutes and expensed. `[INTERVIEW]` 2026-09-02-interview-platform-dev-solves-alone.md
- Customer (pays): of 54 survey respondents, 24 would pay themselves, 19 would ask or not ask their employer, 2 their client, 9 nobody. `[DATA]` 2026-09-04-survey-discord-willingness-to-pay.md
- User (mentee): developers stuck on a specific, time-bound problem; the platform developer in a 200-person company, with an internal channel, is the counter-case. `[INTERVIEW]` 2026-08-20-interview-working-dev.md, 2026-09-02-interview-platform-dev-solves-alone.md
- User (mentor): senior engineers already answering the same questions unpaid: two evenings a month, weekly DMs, "cały czas" on Slack. `[INTERVIEW]` 2026-08-22-interview-mentor.md, 2026-09-03-interview-senior-python-meetups.md, 2026-09-03-interview-staff-engineer-declined-before.md
- Stakeholders: founder A (sponsor, product owner, UX) and founder B (project manager, tech lead, developer); QA and legal have no person; Stripe is the one external dependency. `[DOCUMENT]` 2026-09-05-miro-board-raci-matrix.md
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

- What it is: a prepaid question answered in text by a senior engineer who has done the thing, through the mentor's own link, within a reply window (D03, D05).
- Codementor is the closest: live help paid by time, listed at $15 to $80 per 15 minutes, nothing kept after the session; the board's "$8 to $30" was too low. `[BENCHMARK]` 2026-09-04-benchmark-codementor.md
- MentorCruise sells a monthly relationship from $100 a month, which the staff engineer refused. `[BENCHMARK]` 2026-09-04-benchmark-mentorcruise.md
- That a mentor-owned knowledge layer inside the coding agent sets DevMentor apart is the founders' hypothesis and is Later. `[ASSUMPTION]` 2026-09-02-miro-board-product-goals.md (A06)

| reference | what it does well | where it falls short for our users | checked on | link |
|---|---|---|---|---|
| Codementor | request-to-session is the whole product | transactional; 40 minutes to find someone, then a call the user did not want | 2026-09-04 | https://www.codementor.io/ |
| MentorCruise | free intro call; 7,200 mentors | monthly commitment; no one-off | 2026-09-04 | https://mentorcruise.com/ |

Three other competitors (ADPList, Topmate, Preply) have checks in the research folder; not read for this decision.

## Goals and success criteria

- Business goal for the first build: the smallest product that earns for a mentor without a call. `[DOCUMENT]` 2026-08-26-workshop-export.md
- The board's year-one targets (100 vault mentors, 30% on a subscription) belong to the vault and are not adopted for Now. `[DOCUMENT]` 2026-09-02-miro-board-product-goals.md
- User outcome: a mentee gets an answer from someone who has done it, in text, within the time the problem allows (Problems). `[INTERVIEW]` 2026-08-20-interview-working-dev.md
- Primary metric: unique mentees with a paid request, among at least 10 mentees offered; no payment has been tested, so no baseline exists; 3 paid requests from 3 different mentees, with at least 10 mentees offered, a provisional choice by founder A (D15). `[DOCUMENT]` decisions/D15-pilot-success-three-different-mentees.md
- Secondary measure: minutes from payment to first answer against the four-business-hour window (D06, D11); no share of on-time answers is set as a threshold. The Discord's 67-minute median first reply describes community help, not DevMentor. `[DATA]` 2026-09-04-discord-help-requests.csv
- Must not get worse: no video (N01), no ratings (N02), nothing published without mentee approval (R02), 25 hours of build time, no payments provider beyond Stripe. `[DOCUMENT]` 2026-08-26-workshop-export.md

## Scope

- **Now:** a pilot, four weeks and extended to six if fewer than 10 mentees have been offered (D15). A mentee reaches a mentor through the mentor's own link, sees the fixed price of PLN 200 (R06), pays in advance and asks a question in text; the mentor answers within four business hours of published availability (R03, D05, D11), with refunds under R04 and mentor payment under R07. Implementation planning is ready for this scope only.
- **Later:** timed sessions of 25 or 50 minutes (R01), vault, MCP access, subscription, async 24-hour tier, mentor directory and search, membership and team plans (D03).
- **Not doing:** see Non-goals.

## Domain glossary

| Term | Meaning | Owned by | Visible to |
|---|---|---|---|
| Question | what the mentee pays for in Now: a text question the mentor answers within the reply window (D05) | mentee, answered by the mentor | both |
| Reply window | four business hours within the mentor's published availability (D11); business hours and time zone are not defined (Q12) | founder A | mentor and mentee |
| Session | a timed text exchange of 25 or 50 minutes; Later (R01, N01) | mentor and mentee | both |
| Mentor link | the mentor's own booking address; no public list in Now (D03) | mentor | whoever the mentor shares it with |
| Vault | a mentor's saved notes sold as a subscription; Later | mentor | subscribers |

## Key flows

- Current state: the founders' journey runs problem, search, ask on Slack or Discord, judge on GitHub, schedule, pay, session, nothing kept. `[DOCUMENT]` 2026-09-02-miro-board-journey-current-state.md
- Interviews confirm the asking and judging steps; the cost was time, not money. `[INTERVIEW]` 2026-09-01-interview-backend-dev-fintech.md, 2026-09-02-interview-freelancer-react.md
- Future state for Now: the flow is decided in the last bullet of this section (D09, D11); mentee identification, mentor sign-in and the wait for a mentee's reply are open (Q14, Q15, Q16). The founders' future-state journey includes Meet/Zoom and reviews, which contradict N01 and N02, so it cannot be used as is. `[DOCUMENT]` 2026-09-04-miro-board-journey-future-state.md
- Conditions interviewees set for a flow: see the price before writing anything and refund the same day if the mentor does not come; no account or email verification before booking. `[INTERVIEW]` 2026-09-02-interview-freelancer-react.md, 2026-09-01-interview-backend-dev-fintech.md
- Conditions mentors set: see the question before accepting; no bank details before the first booking; keep the money if the mentee does not come. `[INTERVIEW]` 2026-09-03-interview-senior-python-meetups.md, 2026-09-03-interview-staff-engineer-declined-before.md
- Flow decided for Now: the mentee receives an offer with the price and a payment link, pays, and sends a question; the mentor answers within the window; if the mentor misses it the mentee is refunded; if the mentee does not reply to a request for more information the mentor answers from what was provided. `[DOCUMENT]` decisions/D09-pilot-no-shows-refunds-and-payment.md, decisions/D11-pilot-response-window.md

## Business rules

| Id | Rule | Applies to | Source | Status | Review by | Required path to change | Owner | Supersedes |
|---|---|---|---|---|---|---|---|---|
| R01 | Sessions are 25 or 50 minutes (D01) | Later (timed sessions); not Now (D05) | `[DOCUMENT]` 2026-08-26-workshop-export.md | active | unknown | superseding row approved by founder A | founder A | none |
| R02 | Nothing from a session or question is published without the mentee's approval (D02) | Now, Later | `[DOCUMENT]` 2026-08-26-workshop-export.md | active | unknown | superseding row approved by both founders | founders A and B | none |
| R03 | The mentor answers a paid question in text within four business hours during the mentor's published availability; requests outside availability are not accepted (D11) | Now | `[DOCUMENT]` decisions/D11-pilot-response-window.md | active | when the pilot ends | superseding row approved by founder A | founder A | none |
| R04 | If the mentor misses the window, the mentee gets a full refund initiated within five business days; if the mentee does not reply to a request for more information, the mentor answers from what was provided; payment is kept once the answer is sent (D09) | Now | `[DOCUMENT]` decisions/D09-pilot-no-shows-refunds-and-payment.md | active | when the pilot ends | superseding row approved by founder A | founder A | none |
| R05 | The pilot price is one fixed PLN 149 per written answer (D08) | Now | `[DOCUMENT]` decisions/D08-pilot-price-pln-149.md | superseded by R06 | when the pilot ends | superseding row approved by founder A | founder A | none |
| R06 | The pilot price is one fixed PLN 200 per written answer, set by the platform and unchanged during the test (D13) | Now | `[DOCUMENT]` decisions/D13-pilot-price-pln-200.md | active | when the pilot ends | superseding row approved by founder A | founder A | R05 |
| R07 | For each completed request the mentor receives 150 PLN and the platform keeps 50 PLN before payment processing fees; the mentor is asked for bank details only after the first booking and before being paid (D14) | Now | `[DOCUMENT]` decisions/D14-pilot-mentor-payment.md | active | when the pilot ends | superseding row approved by founder A | founder A | none |

## Non-goals

| Id | We are not building | Why | Owner | Status | Review by | Required path to change | Source | Supersedes |
|---|---|---|---|---|---|---|---|---|
| N01 | video calls; sessions are text | workshop constraint; mentee: "text is fine, faster" (the freelancer wants a call for estimates, A03) | founder A | active | unknown | superseding record by founder A | `[DOCUMENT]` decisions/N01-no-video.md | none |
| N02 | ratings or a reviews profile; each mentor links public work instead | all three mentors refuse ratings; two mentees distrust them | founder A | active | unknown | superseding record by founder A | `[DOCUMENT]` decisions/N02-no-ratings.md | none |

## Decisions

| Id | Date | Decision | Why | Owner | Status | Review by | Required path to change | Source | Supersedes |
|---|---|---|---|---|---|---|---|---|---|
| D01 | 2026-08-26 | sessions are 25 or 50 minutes | "bookable in a lunch break" | founder A | active for Later; superseded for Now by D05 | unknown | superseding row approved by founder A | `[DOCUMENT]` 2026-08-26-workshop-export.md | none |
| D02 | 2026-08-26 | nothing from a session is published without mentee approval | "trust is the product" | founders A and B | active | unknown | superseding row approved by both founders | `[DOCUMENT]` 2026-08-26-workshop-export.md | none |
| D03 | 2026-10-20 | Now: prepaid text answers through the mentor's own link; no vault, MCP, subscription or ratings in the first build | agent recommendation accepted by founder A; alternative was keeping one vault answer in the 25-hour build; cost is that recurring revenue stays untested | founder A | active | when the D04 signal is read | superseding row approved by founder A | `[DOCUMENT]` decisions/D03-now-paid-text-answers.md | none |
| D04 | 2026-10-20 | stop or rethink D03 if mentees start bookings but do not pay, or only say they would | chosen by founder A from three candidate signals; no threshold or period | founder A | superseded by D07 | not applicable | not applicable | `[DOCUMENT]` decisions/D04-stop-signal-mentees-dont-pay.md | none |
| D05 | 2026-10-20 | Now: the unit is a question with a reply window; sessions of 25 or 50 minutes move to Later | chosen by founder A from three options (timed session, question with window, both); mentee need is within the hour to the same day | founder A | active | when the pilot ends | superseding row approved by founder A | `[DOCUMENT]` decisions/D05-now-unit-question-with-reply-window.md | D01 for Now only |
| D06 | 2026-10-20 | the pilot measures payment and minutes from payment to first answer | agent recommendation accepted by founder A; alternative was limiting the group to people who accept a longer wait; cost is that mentors must commit to a reply window | founder A | active | when the pilot ends | superseding row approved by founder A | `[DOCUMENT]` decisions/D06-pilot-measures-payment-and-response-time.md | none |
| D07 | 2026-10-20 | a case is a unique mentee who gets a clear offer, price and payment link and does not pay within 24 hours (a started booking, or a promise to pay without booking); fewer than three payers means pause and review the offer; founder A coordinates and decides go/no-go; the mentor provides the paid answers | founder A's choice; the number three is provisional with no baseline | founder A | active (case definition and coordinator); the period, offers and count are superseded by D12, then D15, where they conflict | when the four weeks end (start date unknown) | superseding row approved by founder A | `[DOCUMENT]` decisions/D07-pilot-parameters-and-continuation-target.md | D04 |
| D08 | 2026-10-20 | pilot price: one fixed PLN 149 per written answer, set by the platform, unchanged during the test | founder A's choice for the test only, so results can be compared; answers the workshop's open "per mentor or per platform"; not a long-term pricing decision | founder A | superseded by D13 | when the pilot ends | superseding row approved by founder A | `[DOCUMENT]` decisions/D08-pilot-price-pln-149.md | none |
| D09 | 2026-10-20 | no answer in the window means a full refund initiated within five business days; no reply from the mentee to a request for more information means the mentor answers from what was provided; payment is kept once the answer is sent | founder A's choice | founder A | active | when the pilot ends | superseding row approved by founder A | `[DOCUMENT]` decisions/D09-pilot-no-shows-refunds-and-payment.md | none |
| D10 | 2026-10-20 | founder A makes sure basic terms and a privacy notice exist before accepting payments | the RACI had no owner for legal; founder A was the default | founder A | active | before the first payment | superseding row approved by founder A | `[DOCUMENT]` decisions/D10-pilot-terms-and-privacy-owner.md | none |
| D11 | 2026-10-20 | one response window for all mentors: four business hours during the mentor's published availability; no requests outside availability | founder A's choice; mentees named 20 minutes to the same day | founder A | active | when the pilot ends | superseding row approved by founder A | `[DOCUMENT]` decisions/D11-pilot-response-window.md | none |
| D12 | 2026-10-20 | success is 3 paid requests from 10 offers in 4 weeks; fewer than 10 offers extends the pilot by 2 weeks; still fewer than 10 means inconclusive | founder A's choice; three is provisional with no baseline | founder A | superseded by D15 | when the pilot ends | superseding row approved by founder A | `[DOCUMENT]` decisions/D12-pilot-success-and-too-few-offers.md | D07 where they conflict |
| D13 | 2026-10-20 | pilot price: one fixed PLN 200 per written answer, set by the platform, unchanged during the test | founder A's change from PLN 149; test price only; PLN 200 is the edge of the freelancer's "below 200 zł" ceiling | founder A | active | when the pilot ends | superseding row approved by founder A | `[DOCUMENT]` decisions/D13-pilot-price-pln-200.md | D08 |
| D14 | 2026-10-20 | the mentor receives 150 PLN per completed request; the platform keeps 50 PLN before payment processing fees; the mentor is asked for bank details only after the first booking, before being paid | founder A's choice; the Python mentor wanted no bank details before the first booking | founder A | active | when the pilot ends | superseding row approved by founder A | `[DOCUMENT]` decisions/D14-pilot-mentor-payment.md | none |
| D15 | 2026-10-20 | success is 3 paid requests from 3 different mentees; each mentee counts as one offer; at least 10 mentees must be offered, otherwise after six weeks the result is inconclusive | founder A's choice; three is provisional with no baseline | founder A | active | when the pilot ends | superseding row approved by founder A | `[DOCUMENT]` decisions/D15-pilot-success-three-different-mentees.md | D12 |

## Riskiest assumptions

| Id | Assumption | Importance | Evidence today | If false | Smallest test | Owner | By when | Result |
|---|---|---|---|---|---|---|---|---|
| A01 | Developers will pay for a text answer `[ASSUMPTION]` team belief | high | stated: 37 of 54 would pay something, 23 would pay 25 EUR or more; interviews gave "50 euro, 100 if it fixes it" and "below 200 zł" with hesitation; PLN 200 is at, not below, the freelancer's stated ceiling of "below 200 zł"; the pilot tests one price only (D13); behaviour: 3 of 54 have paid anyone; no payment tested | D03 is revisited (D04) | the four-week pilot (D07), counting completed payments apart from stated intent and started bookings; a manual payment link may answer it before any build | founder A | end of the four-week pilot; start date unknown | untested |
| A02 | Enough mentors accept and publish availability `[ASSUMPTION]` team belief | high | three mentors, all conditional (one "ok, ale pewnie powiem nie"); 50 on the list, none contacted; the staff engineer wanted a price she sets herself, the pilot fixes PLN 200 with PLN 150 to the mentor (D13, D14) | no supply | invite the first batch from the 29 with a warm contact and record accept, decline, publish | pending | before the pilot starts; date unknown | untested |
| A03 | Text is enough for most blockers `[ASSUMPTION]` team belief | medium | survey: 33 text, 9 call, 12 depends; freelancer wants a call for estimates; fintech: "call jak tekst nie zadziała" | N01 is revisited | record in the pilot which sessions asked for a call | pending | unknown | untested |
| A04 | A mentor can answer within the time the problem allows `[ASSUMPTION]` no material | high | mentees named 20 minutes, within the hour and the same day, while the window is four business hours (D11), so the pilot tests a slower window; no mentor response time observed; one mentor works "between meetings" | the problem is not solved even if people pay | measure minutes from payment to first answer in the pilot (D06) | founder A | end of the four-week pilot; start date unknown | untested |
| A05 | A mentor's own link reaches people who are stuck right now `[ASSUMPTION]` no material | high | 16 of 50 mentors have an audience of their own, 11 do not, 23 unknown; staff engineer wants the link as the only door; mentees describe finding someone in minutes | no demand reaches mentors; a directory becomes necessary and conflicts with that mentor's condition | in the pilot, count how many mentees arrived through a link they already had versus found by searching; also note whether payers already knew the mentor | founder A | end of the four-week pilot | untested |
| A06 | A mentor-owned knowledge layer is what sets DevMentor apart `[ASSUMPTION]` founders' board | low for Now | two mentors call their notes the value; the two mentees asked rejected saved answers | Later scope changes | not tested in Now | pending | unknown | untested |
| A07 | Mentees accept a refund initiated within five business days when the mentor misses the window `[ASSUMPTION]` no material | medium | the freelancer asked for a same-day refund; the Python mentor wants payment kept when the mentee does not show, which D09 follows | trust in paying is lower than assumed (A01) | count refund requests, delays and complaints in the pilot | founder A | end of the four-week pilot | untested |

## Kill criteria

D15 sets the success rule: 3 paid requests from 3 different mentees, each mentee one offer, with at least 10 mentees offered; otherwise, after six weeks, the result is inconclusive. The pilot runs four weeks and is extended by two if fewer than 10 mentees have been offered (D12, kept by D15). If 10 mentees are offered and fewer than three pay, D07 applies: pause and review the offer before deciding whether to continue. Founder A decides. A case is a unique mentee who gets a clear offer, price and payment link and does not pay within 24 hours (D07). Completed payments count; verbal intent and started bookings do not.

Limits: the target of three is provisional and has no baseline. Three payers from fewer than 10 mentees offered is inconclusive as written. Payment alone would not show success; answers that arrive late would not show the need is met (A04, D06). Payers who already know the mentor may reflect that relationship more than the offer (A05). The pilot tests one price, PLN 200 (D13).

## Hypotheses to test

None: no synthetic walkthrough was run.

## Open questions

| Id | Question | Blocking | Who can answer | Status |
|---|---|---|---|---|
| Q01 | Is the unit a timed text session or a question with a reply window? | no longer | founder A | closed: question with a reply window (D05) |
| Q02 | Who sets the price, and in what range? | no longer | founder A | closed: platform, fixed for the pilot (D08, then D13: PLN 200) |
| Q03 | What count, period and definition of a case counts for the stop signal, and who runs the pilot? | no longer | founder A | closed: D07, count and period later changed by D12 |
| Q04 | What happens on a no-show or a missed reply window? | no longer | founder A | closed: D09 |
| Q05 | Does a vault answer cite the mentor and the note? (workshop, founder B) | no: vault is Later | founder B | open: settled by founder B's decision, no material needed |
| Q06 | Who owns terms of service and data processing? | no longer | founder A | closed: founder A, basic terms and a privacy notice before accepting payments (D10) |
| Q07 | Does the pilot also measure whether a mentor answers in time? | no longer | founder A | closed: yes (D06) |
| Q08 | How long is the reply window? | no longer | founder A | closed: four business hours within published availability (D11) |
| Q09 | What happens if fewer than 10 offers are made? | no longer | founder A | closed: extend by 2 weeks, then inconclusive (D12) |
| Q10 | Does success count paid requests or unique mentees, and is three payers from fewer than 10 offers inconclusive? | no longer | founder A | closed: 3 different mentees, at least 10 mentees offered, otherwise inconclusive after six weeks (D15) |
| Q11 | How and when is the mentor paid, and how is the price split? | no longer | founder A | closed: PLN 150 to the mentor, PLN 50 to the platform before processing fees, bank details after the first booking (D14); the payout moment is Q13 |
| Q12 | Which time zone defines business hours, and does the four-hour clock stop outside published availability? | no: detail for the spec; a refund trigger depends on it | founder A | open: settled by founder A's decision in the spec |
| Q13 | When after the answer is the mentor paid, and does "completed request" mean the answer was sent (D09)? | no: detail for the spec; mentors should be told before they accept | founder A | open: settled by founder A's decision in the spec |
| Q14 | How is a mentee identified before paying (an email, an account, none)? It decides how offers and unique mentees are counted (D07, D15). Options: the pilot coordinator records offers by hand during the pilot, or the product records them; the 25-hour build limit is a build-time argument, not evidence about mentees | no: decide before implementing #11 and #18 | founder A | open: settled by founder A's decision |
| Q15 | How do mentors sign in? The repository has no authentication yet (`AGENTS.md`, known gap) and the brief does not say | no: decide before implementing #13 | founder A, with founder B as tech lead | open: settled by a decision |
| Q16 | How long does a mentor wait for a mentee's reply to a request for more information, and does the four-hour window clock pause meanwhile (D09, D11)? | no: decide before implementing #15 | founder A | open: settled by founder A's decision |

## Definition of Ready addendum (own)

Problems and Target group have support from interviews and data, with limits: contacts of the founders, one Discord, stated payment intent; these are signals to check, not market conclusions. A01 is what the pilot tests; it was not accepted as true.

Ready for: implementation planning of the pilot's scope (R03 to R07, D05 to D15). No blocking question is open. Q05 (vault, Later), Q12, Q13 (spec details) and Q14–Q16 (design choices to settle before the issues named in each) do not block the tree.

Not covered: the Later items, and a decision to start. Before the first payment basic terms and a privacy notice must exist (D10) and mentors must be recruited (A02).

## Collection plan

### Do developers complete a payment for a text answer, and how fast does the answer arrive?

- What decision or work needs it: D03 and D04 (continue or rethink); A01, A03, A04, A05
- Who can answer it: developers who are stuck now, and the mentors answering them
- How: the pilot with at least 10 mentees offered at PLN 200, results exported with the data request template: completed payments, cases as defined in D07, minutes from payment to first answer, how each mentee arrived; starting it waits for the answers listed under Not ready for in the readiness addendum; also record refunds and delays (A07)
- Owner and by when: founder A coordinates; four weeks from a start date that is not set; starting is a separate decision from designing
- Template: `templates/data-request.md`

### Will the first mentors accept, at what rate and hours, and with what response time?

- What decision or work needs it: A02; whether they accept a fixed price and PLN 150 per request, their weekly availability and employer stance were not obtained from any mentor
- Who can answer it: mentors from the 29 warm contacts on the list; the mentors who will provide the paid answers in the pilot
- How: invitation and a short interview each, captured with the interview note template
- Owner and by when: founders A and B contact the warm ones; date unknown
- Template: `templates/interview-note.md`
