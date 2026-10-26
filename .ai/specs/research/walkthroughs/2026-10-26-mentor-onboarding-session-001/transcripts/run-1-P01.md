# Run 1 — P01

Basis: `[INTERVIEW]` `.ai/specs/research/2026-08-22-interview-mentor.md`. Persona tags and source keys were stripped from the panel handoff. No brief assumptions were supplied to the persona.

## Interview under pressure

The five past-tense questions and four behavior checks were applied to the same source passage. Where the passage gives no basis, the persona says so.

1. **Last recurring-help event and steps:** The notes describe the same questions recurring in DMs and community Slack; the mentor pastes from private notes. No specific last event is described. Fast: recurrence is the salient part. Feeling: worn down, supported by the passage saying the work takes two evenings a month for free. Considered: the notes describe a repeated pattern, not a specific event. Passage: same source.
2. **What had been tried:** Codementor and a newsletter. Outcomes are not in the note. Fast: these were attempts. Feeling: no basis for intensity. Considered: the source does not describe whether they helped. Passage: same source.
3. **Cost:** The note says two evenings a month, unpaid, and that the notes rot. Fast: this is unpaid time. Feeling: frustration, supported by the quoted concern about the notes. Considered: the passage gives time spent, but no monetary value. Passage: same source.
4. **Others involved / decision:** No basis. Fast: no answer. Feeling: no basis. Considered: the note does not say who decides or helps.
5. **What did not matter:** Ratings. Fast: they do not matter. Feeling: neutral. Considered: the note explicitly says the mentor does not care about a public profile with ratings. Passage: same source.

### Balanced past-behavior questions

| Question | Answer | Passage or no basis | Fast reaction and feeling | Considered answer |
|---|---|---|---|---|
| Answered questions outside the team? | Yes | DMs and community Slack, same interview | Yes; matter-of-fact | Recurring answers happened outside a private note, but the exact relationship to the mentor's team is not stated. |
| Charged for mentoring? | No basis | None; the note says their own help was unpaid, not whether they charged elsewhere | Uncertain; weak | Cannot tell whether they charged for mentoring. |
| Published bookable availability? | No basis | None | Unsure; weak | The note does not mention booking availability. |
| Kept reusable notes? | Yes | Private answer notes pasted into replies, same interview | Yes; protective | The notes were kept privately and reused. |

### Pressure simulation

Given a valid invitation and a two-week window to create a page, slot, and prices, the persona would pause before publishing any material that lacks mentee agreement. The source supports the consent boundary and desire for their name to remain attached. It does not establish whether they would complete a page, slot, and pricing while withholding the notes. Fast reaction: do not publish the notes without agreement. Feeling: cautious, grounded in the source. The final setup choice remains unsupported.

## Prototype walk

| Step / screenshot | First three noticed | Expectation | Observed result and reaction / feeling | Friction, missing case, next action |
|---|---|---|---|---|
| Invitation — `../screenshots/run-1-P01-invitation.png` | Accept/sign-in; setup requires page, slots, prices; simulated-data banner | Acceptance leads to sign-in and setup | “Accept” feels like a commitment before details; mild caution | No path to decline visible. Next: accept to inspect sign-in. |
| Sign-in — `../screenshots/run-1-P01-sign-in.png` | GitHub primary; email/password fallback; back link | Either method continues setup | Straightforward, but unclear what acceptance commits to | No visible consent or decline details. Next: inspect sign-in choice. Main interviewer used the prototype's successful GitHub control without credentials. |
| Mentor page — `../screenshots/run-1-P01-page.png` | Public work link; description/tags; named channel address | Saving creates a page and permits slot setup | Channel visibility note is reassuring; unclear what is public | Wants to see what public fields expose before saving. Next: inspect slots. |
| Slots — `../screenshots/run-1-P01-slots.png` | Five times; two-hour rule; empty state | Choose and publish a slot | The 10:00 time appears selectable though current simulated time is 09:00 | Next: inspect times. |
| Too-soon error — `../screenshots/run-1-P01-slot-error.png` | Error summary; selected 10:00; field error | A selectable time may be publishable | Rejection makes the rule concrete, but the selectable option is misleading; frustration | 10:00 is rejected for being under two hours. Next: try a later time. This was directly tested only in this run. |
| Published slot — `../screenshots/run-1-P01-slot-valid.png` | 11:00 slot; Remove; selector resets | An open slot is available to mentees | Availability feels more concrete | Who can book and how to limit access remain unclear. Next: prices. |
| Prices — `../screenshots/run-1-P01-prices.png` | Separate 25/50 fields; EUR; 15–120 bounds | Saving sets what mentees pay | Concrete income mechanism, but another setup decision | No payment collection or payout details on this step. Next: consider values. |
| Price errors — `../screenshots/run-1-P01-prices-error.png` | Two required fields; error summary; field errors | Empty values might permit continuing | Errors clarify required values but block progress before a decision | Next: review setup status. |
| Summary — `../screenshots/run-1-P01-summary.png` | Not bookable; missing page/prices; D18 deadline | Summary shows unfinished steps | Manual payout copy reduces setup but the process remains unclear | No explanation of collection or invoicing. Next: preview. |
| Empty preview — `../screenshots/run-1-P01-preview-empty.png` | Preview title; save-first notice; open/back links | Preview would show what a mentee sees | Disappointing; wants to review public content before committing | Preview is unavailable until after saving. Next: return and review page fields. |
