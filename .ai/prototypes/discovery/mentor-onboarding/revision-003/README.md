# Mentor onboarding: discovery prototype, revision 003

- Brief: `.ai/specs/product-brief.md` (dated 2026-10-21)
- Flow: invited mentor onboarding, covering E02-S01 to E02-S04 in the brief's Scope (Now). It is not a named Key flow.
- Revision date: 2026-10-26. Previous revision: [revision-002](../revision-002/README.md).
- Panel report: none supplied. No `[SYNTHETIC]` suggestions are used.
- Open `index.html` directly in a browser (`file://`). The **Test state** panel at the bottom has controls for invitation/sign-in outcomes, elapsed time, and reset. The artifact uses fictitious data, is not research evidence or production readiness, and does not satisfy the Definition of Ready.

## Simulation boundary

Confirmed by the user on 2026-10-26 for this revision.

- Actor: a senior engineer invited by the operator (fictitious “Jordan Example”).
- Start: a valid invitation, before it has been accepted.
- Success: after accepting the invitation and signing in, the mentor has a saved mentor page, both session prices, and at least one open slot whose start is at least two hours away; the setup becomes bookable within two weeks of invitation acceptance (D18/R17). The summary records whether the target was met by its deadline, even if the simulated clock is advanced later.
- Included screens and states: invitation (valid, expired/already used, or absent), invitation help, GitHub or e-mail/password sign-in (including failure and validation), signed-out access denial, mentor page, slot publishing, prices, setup summary, public page preview and unknown-address recovery. Test controls can set elapsed-time scenarios to day 0, 13, 14 or 15 and reset the simulation.
- Excluded: operator invitation management (E05-S01), mentee discovery and booking (E03), the text session (E04), notifications/e-mail delivery, and Stripe Connect onboarding (E02-S05, 1.1). The summary says payouts are manual in 1.0 (D28/R20); it does not simulate a payout.

## Preserved rules and decisions

The following rows are active in the brief. Their owner is retained; the brief lists the required change path as a superseding decision/row approved by the named owner(s).

| ID | Preserved meaning in this prototype | Source / owner |
|---|---|---|
| R07, D08 | A mentor can enter only through an invitation; there is no open registration. | `product-brief.md`, D08 decision; founder A |
| R06, D07 | GitHub sign-in first, with e-mail and password as fallback. | `product-brief.md`, D07 decision; founder A |
| R23, D31 | One role per account; the simulated account is a mentor. | `product-brief.md`, D31 decision; founder A |
| R04 | Every mentor page has a plain description and link to public work. | `product-brief.md`; founder A |
| R03, N01 | Sessions are text; no video option is presented. | `product-brief.md`, N01; founder A |
| N02 | No ratings or reviews are shown. | `product-brief.md`, N02; founder A |
| R16, D24 | Stack tags are limited to TypeScript, React, Python and AI agents. | `product-brief.md`, D24 decision; founder A |
| R19, D27 | The mentor names the text-session channel. | `product-brief.md`, D27 decision; founder A |
| R24, D32 | The channel address is not shown on the public page; it is for the parties to a confirmed booking. | `product-brief.md`, D32 decision; founder A |
| R14, D22 | A slot is bookable only if it starts at least two hours later; copy makes no promise of speed. | `product-brief.md`, D22 decision; founder A |
| R17, D18 | At least one bookable session is to be published within two weeks of accepting an invitation; fewer than 5 of the first 20 invited mentors doing so stops further invitations. | `product-brief.md`, D18 decision; founders A and B |
| R01, D01 | Sessions last 25 or 50 minutes. | `product-brief.md`, D01 decision; founder A |
| R08, D09 | The mentor sets both session prices inside operator-set bounds. | `product-brief.md`, D09 decision; founder A |
| R21, D29 | Prices and charges use EUR. | `product-brief.md`, D29 decision; founder A |
| R20, D28 | The operator pays mentors by bank transfer manually in 1.0 and logs the payout. | `product-brief.md`, D28 decision; founders A and B |

No product rule was changed. Q24 (price bounds and initial prices) remains open; Q26 (e-mail transport and sender) remains outside this simulation.

## Assumptions

Confirmation approves this simulation, not these facts. Each remains marked `[ASSUMPTION]`.

| ID | Assumption | Why it is needed | How it could be checked |
|---|---|---|---|
| PA01 `[ASSUMPTION]` | Prices are whole euros from 15 to 120 EUR. | Q24 is open; the prototype needs sample bounds for validation. | Founder A answers Q24. |
| PA02 `[ASSUMPTION]` | The channel field is required to save the mentor page. | R19 says the mentor names a channel, but does not say the field blocks saving. | Founder A decides in the E02-S02 spec. |
| PA03 `[ASSUMPTION]` | Saving a mentor page makes it public immediately; there is no separate publish/draft step. | The brief mentions a share link, not publication states. | Founder A decides in the E02-S02 spec. |
| PA04 `[ASSUMPTION]` | Page, slots and prices can be completed in any order. | The brief does not specify the setup order. | Observe a mentor using the flow. |
| PA05 `[ASSUMPTION]` | The invitation is accepted at the fixed simulated time 2026-10-26 09:00 UTC; the two-week deadline is 2026-11-09 09:00 UTC. This replaces revision-001's fixed “now” for slot selection. | A deterministic acceptance time makes D18's deadline reproducible. | Founder A confirms the intended deadline interpretation. |
| PA06 `[ASSUMPTION]` | A slot stores a start time only; the mentee chooses 25 or 50 minutes when booking. | E03-S02 says the mentee chooses session length; E02-S03 does not define slot duration. | Check E02-S03 and E03-S02 wording. |
| PA07 `[ASSUMPTION]` | For this compact simulation, e-mail/password immediately accepts the invitation; the password must be at least 8 characters and the typed e-mail need not match the invited address. No confirmation e-mail or separate registration step is simulated. | The brief specifies e-mail/password fallback but not the account-creation sequence. This simplified interaction differs from the draft `.ai/specs/2026-10-21-auth.md` (Q8), which proposes creating an e-mail account only after confirming a link and setting a password; that spec is still marked draft for review. | Founder A reconciles the draft auth spec and E01-S02 before implementation. |
| PA08 `[ASSUMPTION]` | The description is limited to 400 characters and the public-work link must start with `https://`. | These constraints provide concrete validation/recovery states. | Founder A or the E02-S02 spec. |
| PA09 `[ASSUMPTION]` | A slot can be removed until booked; a booked slot cannot be removed here. | The brief does not define slot removal. | Decide in the E02-S03 spec. |
| PA10 `[ASSUMPTION]` | `https://devmentor.example/m/jordan-example` illustrates a share-link shape, not a real URL format. | The brief specifies share links but not their format. | Decide in the E02-S02 spec. |
| PA11 `[ASSUMPTION]` | The simulation displays its fixed clock and slot times in UTC. | The brief does not specify a time zone; a single zone keeps the two-hour and 14-day checks deterministic. | Founder A decides the time-zone behavior in E02-S03. |
| PA12 `[ASSUMPTION]` | For this prototype, “bookable” means a saved mentor page, two saved prices, and at least one open slot. | The brief describes those setup pieces but does not define a single readiness status. | Founder A confirms the readiness rule in E02-S04. |
| PA13 `[ASSUMPTION]` | The Test state time selector is a scenario control, not a production feature; it can set day 0, 13, 14 or 15 relative to acceptance. | It exposes before-deadline, deadline and after-deadline states without waiting. | No product decision needed; remove from any production design. |

## Screen and state map

| Screen / state | Action | Expected next state | Rules / assumptions |
|---|---|---|---|
| `#invitation` valid | Accept invitation and choose sign-in | `#sign-in` | R06, R07 |
| `#invitation` expired / absent | Open invitation help, then return | `#invitation-help` / `#invitation` | R07 |
| `#sign-in` | GitHub succeeds or fails; e-mail submission validates then succeeds | Mentor page or an accessible recovery error | R06, PA07 |
| Signed-out protected screen | Open page directly | `#denied`, with a return path to invitation | R07 |
| `#mentor-page` | Save public work, description, tag and named channel | Field errors or saved page and share link | R04, R16, R19, PA02, PA03, PA08, PA10 |
| `#slots` | Publish an empty, too-soon, duplicate or valid slot; remove an unbooked slot | Validation message or updated slot list | R14, PA05, PA09, PA11 |
| `#prices` | Save empty, out-of-bounds or valid values | Validation message or saved prices | R08, R21, PA01 |
| `#summary` | Review setup and D18 outcome | Missing setup, D18 pending, D18 met, or D18 window passed | R17, R14, PA05, PA11, PA12 |
| Test state: elapsed-time scenario | Choose day 0, 13, 14 or 15 | Summary reports pending/met/passed-window state; slot picker reflects simulated time | R17, PA05, PA11, PA13 |
| `#public-preview` | Review saved public page | Public work, description, tags, prices and open slots; channel address stays hidden | R03, R04, R24, PA03, PA10, PA12 |
| Unknown fragment | Open unrecognized address | `#notfound`, then link to start | — |
| Test state: booking / reset | Simulate a booking or reset | Slot marked taken, or fresh invitation state | PA09 |

### Reproducible checks

Static review on 2026-10-26: passed. The inline JavaScript parses with `node --check`. Inspection confirmed forms prevent navigation, all navigation and generated references stay in this file, and there are no external scripts/styles, network APIs, storage, cookies, or imported dependencies. User-provided text is rendered with `textContent`; controls have labels and visible focus styles. The simulated D18 result changes only when the page, prices and a sufficiently distant open slot are all present, and completion after day 14 remains bookable while correctly reporting the missed target.

Browser walk: not run. The configured provider is `agent-browser` (`.ai/browsers/agent-browser.md`), but its executable is not available on `PATH`. The workflow prohibits installing software for this run. No browser screenshots were produced for this revision; evidence from earlier revisions is not evidence for revision-003.

If browser access becomes available, open `index.html` as `file://` and check: valid invitation → GitHub and e-mail sign-in; invalid sign-in recovery; save page with errors then correction; publish a slot less than two hours away then a valid slot; save invalid then valid prices; confirm D18 pending; complete setup by day 13 and confirm met; advance to day 15 and confirm the met result persists; reset, repeat setup only after day 14 and confirm window passed; inspect public preview for channel privacy; test back/forward, unknown-fragment recovery, keyboard focus, narrow viewport and reset. Close the browser session afterwards. These checks verify only prototype behavior, not whether mentors want this flow; A03 remains untested.

## Revision history and preservation

Revision-001 and revision-002 are preserved byte for byte. Revision-002 was verified against its ownership inventory before this refresh: both listed files matched their SHA-256 hashes, with no missing or unlisted files. Revision-001 browser evidence remains attached only to revision-001; revision-002 has no screenshots. This revision carries forward the D18 deadline outcome and elapsed-time scenarios without changing the interaction. No manual additions or modifications were found in revision-002. The brief, `.uxproof/` and application code remain unchanged.
