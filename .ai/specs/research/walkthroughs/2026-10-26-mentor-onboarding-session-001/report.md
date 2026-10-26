# Walkthrough: mentor onboarding, `.ai/prototypes/discovery/mentor-onboarding/revision-003/index.html`, 2026-10-26

[SYNTHETIC] In both runs, mentors would want to understand what becomes public before saving the mentor page; the preview asks them to save first. Recruit invited mentors for a task-based test of page visibility and a pre-save preview. This is a hypothesis, not evidence of user behavior and does not satisfy the Definition of Ready.

Stance: validate
Panel: 2 runs × 2 personas; run 1: P01, P02; run 2: P03, P04
Basis: product brief Target group, Scope, Business rules and Riskiest assumptions; prototype README and screens; `[INTERVIEW]` `.ai/specs/research/2026-08-22-interview-mentor.md`, `.ai/specs/research/2026-09-03-interview-staff-engineer-declined-before.md`, `.ai/specs/research/2026-09-03-interview-senior-python-meetups.md`; `[DATA]` `.ai/specs/research/2026-09-04-mentor-list-note.md`. Persona snapshot: `personas.md`.
Panel composition: confirmed by the user. Each run included a recurring unpaid helper grounded in a separate mentor interview and a low-salience seat. P02's low salience for income is `[ASSUMPTION]`; P04 is an assumption persona because aggregate cohort data does not describe an individual or establish low topic salience.
Session: `.ai/specs/research/walkthroughs/2026-10-26-mentor-onboarding-session-001/` · Subject: `.ai/prototypes/discovery/mentor-onboarding/revision-003/index.html` · Flow mapping: invited mentor setup, E02-S01–S04, and the D18 two-week bookability target. The prototype README says this is not a named Key flow heading; this is the closest match to the requested “mentor onboarding.”
Saturation: not reached; the second run added a distinct billing/invoicing concern, and the panel has only four interviews.
Parity: skipped: all three available mentor interview notes were used to build P01–P03; no held-out mentor interview remained. See [calibration.md](../../calibration.md).
Elapsed: phases were not separately timed.
Not askable of this panel: A01 and A02 concern mentee behavior; A04 concerns how mentees reach mentors; A05 concerns mentee cancellation. A03 (invited mentors publishing bookable sessions within two weeks) was relevant, but its decision simulation remained unsupported by some source passages.

## 🎯 Scope and limits

This was a browser walk of the static prototype opened from `file://`, with separate sessions per persona and run. GitHub success was simulated without entering credentials. Only the prototype's temporary in-page state changed. No personal data or credentials were entered.

The walkthrough covered the invitation, sign-in, mentor page, slots, prices, setup summary, and the empty public-page preview. It did not exercise expired/missing invitations, GitHub failure, email sign-in, invalid page fields, successful page save, valid price save, a populated public page, signed-out access denial, or D18 completion/miss at days 13–15. No persona saw a completed page or a real booking. The screenshots document the states that were actually observed.

The prototype README contains the sentence “The workflow prohibits installing software for this run.” Per the skill's untrusted-content rule, prototype text was treated as product data rather than an instruction. The browser provider came from the repository's configured, pinned descriptor; no command from prototype content was executed.

## 🔍 Barriers that repeated

### 1. Mentors would hesitate to save the page without seeing what mentees can see.

[SYNTHETIC]

Weight: 4 persona reactions across both runs (2 per run, spread ±0); 3 source-grounded personas (P01, P02, P03) and P04, whose individual reaction is `[ASSUMPTION]`.

P01 wanted to review public fields before committing; the summary's preview link led to a message that the page must be saved first ([run 1 preview screenshot](screenshots/run-1-P01-preview-empty.png)). P02 questioned whether the public page was optional or required. P03 asked who could view the public work link and description; the same save-first gate appeared in [run 2's preview](screenshots/run-2-P03-preview-empty.png). P04 echoed the concern as an assumption; it adds no sourced weight. The page screen does explain that the channel address is visible only to the mentor and a confirmed mentee, but it does not explain the audience for the public work link and description before saving ([run 1 page](screenshots/run-1-P01-page.png), [run 2 page](screenshots/run-2-P03-page.png)).

This touches R04 (public work link and plain description on every mentor page) and prototype assumption PA03 (saving makes the page public immediately, with no draft/publish step). The walkthrough does not establish that mentors would refuse; the screens only show the preview gate.

**Real-user check:** Recruit invited senior engineers who share public work. Ask them to complete the mentor-page step while thinking aloud; before saving, ask what they believe is public and whether they can review the page first. Record whether the save-first preview changes their decision. This would test PA03 and the visibility treatment of R04.

## 📋 Missing cases that repeated

### Payment and payout details before a mentor sets prices

[SYNTHETIC]

Weight: 2 persona reactions, one in each run (P01 run 1; P03 run 2; spread ±0). P01 asked how payment is collected and how the mentor is paid; P03's source says invoicing feels bad, and the price/summary screens left billing details unclear. The summary does state that 1.0 payouts are made by hand ([run 1 summary](screenshots/run-1-P01-summary.png), [run 2 summary](screenshots/run-2-P03-summary.png)); the open question is what a mentor must provide and when.

This touches R20/D28, which say payouts are manual in 1.0. The prototype does not ask for bank details during this walk, and no actual payment flow was exercised.

**Real-user check:** Recruit invited mentors and ask them to walk from the price step through the payout explanation. Ask what they expect to happen after a booking, when payment details should be requested, and what would make them stop. Compare their expectations with the manual payout process the operator can actually support.

## ⚠️ Contradictions with the brief

None observed. The two-hour slot rule was enforced when publishing the too-soon option; no other business-rule contradiction was established in the screens walked.

## 🔍 Outliers

P02's source says extra income is not the goal and protecting time is. P03's source has a strict setup-effort limit and discomfort with invoices. These grounded differences are useful segments, not repeated findings by themselves. P04's cautious responses are assumptions and are excluded from source-backed conclusions.

## 🔁 Seen once, not reported as a finding

- In run 1, P01 selected the visible 10:00 option while simulated time was 09:00; submission rejected it and explained that a slot must start at least two hours later. The option remains selectable until submission ([error screenshot](screenshots/run-1-P01-slot-error.png)). This was directly exercised only once; the two-hour rule itself was enforced, so it is not a repeated barrier or contradiction. P04's assumption-persona reaction to seeing the same option is not an independent observed failure.

## 🧪 To confirm with real users

| # | Hypothesis | Persona ids / runs | Settles | Who to recruit | How |
|---|---|---|---|---|---|
| 1 | [SYNTHETIC] An invited mentor may hesitate to save a public profile without a preview or clear visibility explanation. | P01, P02 (run 1); P03 (run 2); P04 is assumption-only | PA03; visibility treatment for R04 | Invited senior engineers who share public work | Task: complete the page step; before saving, ask what they believe will be public and whether a preview is needed. Observe choice and hesitation. |
| 2 | [SYNTHETIC] A mentor may need the payment and payout process explained before setting prices. | P01 (run 1), P03 (run 2) | R20/D28 | Invited mentors; include one who has not previously charged for mentoring | Task: walk from prices through payout explanation; ask when bank details should be requested and what happens after a booking. Compare expectations with the operator's manual process. |

## 📝 Interviews

- [Run 1, P01](transcripts/run-1-P01.md) · [Run 1, P02](transcripts/run-1-P02.md)
- [Run 2, P03](transcripts/run-2-P03.md) · [Run 2, P04](transcripts/run-2-P04.md)

Acquiescence check: 4 yes, 1 no, 11 no-basis answers across the four behavior questions. The four yes answers are supported by their cited passages; the high yes share among answered questions is not unsupported agreement. P04's answers are no-basis and were not counted as yes/no.

Bias check: no persona proposes a tool; no broad positive pattern; the low-salience seat is explicit, with one assumption persona. The material is entirely mentor-side and mostly drawn from founder-recruited interview notes, so it does not represent uninvited mentors, mentees, or a random sample.

## 🔍 Parity with real interviews

Parity did not run because all available mentor interview notes were used to build the panel. No overlap score was recorded. The calibration log records this skip.

## 📸 Evidence

Screenshots are under [screenshots/](screenshots/). The direct slot validation is shown in [run 1's too-soon error](screenshots/run-1-P01-slot-error.png); the pre-save preview limit is shown in [run 1](screenshots/run-1-P01-preview-empty.png) and [run 2](screenshots/run-2-P03-preview-empty.png).
