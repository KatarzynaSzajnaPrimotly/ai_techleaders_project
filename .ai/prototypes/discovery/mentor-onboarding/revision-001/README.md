# Mentor onboarding: discovery prototype, revision 001

- Brief: `.ai/specs/product-brief.md` (dated 2026-10-21)
- Flow: mentor onboarding, a chain over E02-S01 to E02-S04 in the brief's Scope (Now). It is not a named Key flow, so the boundary below was confirmed with the user on 2026-10-24.
- Revision date: 2026-10-24. Previous revision: none.
- Panel report: none supplied. No `[SYNTHETIC]` suggestions are used in this revision.
- Open `index.html` directly in a browser (`file://`). **Reset simulation** sits in the "Test state" panel at the bottom. The artifact holds fictitious data only. It is not research evidence and not production readiness, and it does not satisfy the Definition of Ready.

## Simulation boundary (confirmed by the user, 2026-10-24)

- Actor: a senior engineer invited by the operator (fictitious "Jordan Example").
- Start: the invitation screen. Success: the summary says the mentor is bookable (a saved mentor page, at least one open slot, both prices).
- Included screens: invitation (valid, expired or used, none), sign-in (GitHub, e-mail fallback), mentor page, slots, prices, summary, public page preview, an invitation help screen, a signed-out screen and an unknown-address screen.
- Excluded, not simulated: Stripe Connect onboarding (E02-S05, 1.1, D13), the operator's invitation screen (E05-S01), the mentee side (E03), the session itself (E04), notifications and e-mail delivery. The summary only restates that payouts are by hand (R20, D28).

## Rules and decisions preserved (source: brief, rows keep their owner and status `active`)

| ID | How the prototype keeps it | Owner |
|---|---|---|
| R07, D08 | Entry only through an invitation; the "none" and "expired" states offer no registration | founder A |
| R06, D07 | GitHub first, e-mail and password as fallback | founder A |
| R23, D31 | The simulated account has one role, mentor; no role choice is shown | founder A |
| R04 | The mentor page requires a public-work link and a plain description | founder A |
| R03, N01 | Copy says sessions are text; no video option anywhere | founder A |
| N02 | No ratings or reviews on any screen | founder A |
| R16, D24 | Stack tags limited to TypeScript, React, Python, AI agents | founder A |
| R19, D27 | The mentor names the session channel on the mentor page | founder A |
| R24, D32 | The channel address does not appear on the public preview | founder A |
| R14, D22 | A slot must start at least two hours from now; the copy makes no speed promise | founder A |
| R01, D01 | The summary and the public page speak of 25- and 50-minute sessions | founder A |
| R08, D09 | Two prices, one per length, checked against bounds | founder A |
| R21, D29 | Prices in EUR | founder A |
| R20, D28 | Payout setup is absent; the summary says it is by hand | founders A and B |

No rule, non-goal or decision was changed. Open questions that touch this flow: Q24 (initial price bounds, below), Q26 (e-mail transport: no e-mail is sent here).

## Assumptions (all `[ASSUMPTION]`; confirmation of the simulation does not turn them into facts)

| ID | Assumption | Why needed | How to check |
|---|---|---|---|
| PA01 `[ASSUMPTION]` | Price bounds are 15 to 120 EUR, whole euros | Q24 is open; the out-of-bounds recovery needs numbers | Founder A answers Q24 |
| PA02 `[ASSUMPTION]` | The channel field is required to save the mentor page | R19 says the channel is named on the mentor page, not that it is mandatory | Founder A decides in the E02-S02 spec |
| PA03 `[ASSUMPTION]` | The mentor page is public as soon as it is saved; there is no separate publish step or draft | The brief says a mentor "gets a share link", nothing about publishing | Founder A decides in the E02-S02 spec |
| PA04 `[ASSUMPTION]` | After sign-in the steps can be done in any order; the summary lists what is missing | The brief gives no required order | Watch a real mentor start with slots or prices |
| PA05 `[ASSUMPTION]` | The fixed simulated time is Mon 26 Oct 2026, 09:00; the slot picker is a fixed list of five times | A fixed clock keeps the two-hour check reproducible | None needed; a real picker is design work |
| PA06 `[ASSUMPTION]` | A slot carries a start time only; the mentee picks the 25- or 50-minute length | E03-S02 says the mentee picks the length | Check E02-S03 and E03-S02 wording |
| PA07 `[ASSUMPTION]` | E-mail sign-in needs a password of at least 8 characters; the e-mail typed need not match the invited address | Password rules and invitation binding are not in the brief | See the auth spec `.ai/specs/2026-10-21-auth.md` |
| PA08 `[ASSUMPTION]` | The description is limited to 400 characters; the public-work link must start with `https://` | A limit is needed to show a validation state | Founder A or the E02-S02 spec |
| PA09 `[ASSUMPTION]` | A published slot may be removed until it is booked; a booked slot cannot be removed here | The brief says only that slots are seen "taken as they are booked" | Decide in the E02-S03 spec |
| PA10 `[ASSUMPTION]` | The fictitious share link `https://devmentor.example/m/jordan-example` shows the shape of a link, not a real address format | A share link is in the brief (D21) without its form | E02-S02 spec |

## Screen and state map

| Screen / state | Action | Next state | Rules / assumptions |
|---|---|---|---|
| `#invitation` valid | Accept invitation and sign in | `#sign-in` | R07 |
| `#invitation` expired / none (Test state) | What can I do? | `#invitation-help`, then back | R07 |
| `#sign-in` | Continue with GitHub | loading (400 ms), then `#mentor-page`; or the failure message with the e-mail form still available (Test state "Fails") | R06 |
| `#sign-in` | Create account and accept (e-mail) | field errors with focus on the summary; or `#mentor-page` | R06, PA07 |
| Any signed-in screen while signed out | open the address | `#denied`, link to the invitation | R07 |
| `#mentor-page` | Save mentor page | field errors, or "saved" with the share link | R04, R16, R19, PA02, PA03, PA08 |
| `#slots` | Publish slot | too-soon error, duplicate error, or the slot listed; Remove; empty state before the first slot | R14, PA05, PA06, PA09 |
| `#prices` | Save prices | out-of-bounds and non-number errors, or saved | R08, R21, PA01 |
| `#summary` | open | "Bookable" or the list of what is missing | PA04 |
| `#public-preview` | open | empty notice before the page is saved; otherwise the public view without the channel | R24, R03 |
| Unknown address | open | `#notfound`, link to the start | none |
| Test state | Simulate a mentee booking the first open slot | the slot shows booked on slots, summary and preview | PA09 |
| Test state | Reset simulation | start state, inputs cleared, announced | none |

## Verification

Static review: passed (2026-10-24). All references are local; no network call, storage, cookie, external URL, `innerHTML` or `eval` in `index.html`; both forms call `preventDefault`; user text is written to text nodes; the script parses.

Browser walk: provider `agent-browser` 0.39.1 (descriptor `.ai/browsers/agent-browser.md`), isolated session, `file://` URL, 1280 px wide, then 360 px wide for the narrow checks. The Chrome shared libraries came from the pre-existing `/tmp/chromelibs` directory via `LD_LIBRARY_PATH`; nothing was installed. The session was closed (exit 0). Screenshots are in `evidence/`.

All required checks passed; the table lists each one.

| Check | Observed |
|---|---|
| none: message | true |
| none: no accept control visible | true |
| help heading | Need an invitation? |
| help hash | #invitation-help |
| back to invitation | Mentor invitation |
| expired: message | true |
| valid restored | false |
| unknown fragment heading | This screen is not part of the prototype |
| unknown recovery | Mentor invitation |
| denied heading | Sign in required |
| denied recovery | Mentor invitation |
| sign-in heading | Sign in to accept |
| loading state | true |
| github failure text | true |
| github failure status | GitHub sign-in failed. |
| email errors summary | true |
| email error summary focused | email-errors |
| email field invalid | true |
| email error text | Enter a valid e-mail address. |
| password error only | Enter a password of at least 8 characters. |
| email error cleared |  |
| accepted -> mentor page | Your mentor page |
| accepted hash | #mentor-page |
| accepted status | Invitation accepted. You are signed in as a mentor with e-mail and password. |
| entry heading | Mentor invitation |
| entry heading focused | H2:Mentor invitation |
| page: 4 errors | Please fix 4 problems: |
| page: tags error text | Choose at least one stack tag. |
| page: bad link only | Add a link to your public work that starts with https:// |
| page: other errors cleared |  |
| page: saved status | Mentor page saved. Your share link is ready. |
| page: share link shown | https://devmentor.example/m/jordan-example |
| preview heading | Public mentor page (preview) |
| preview: channel not public | false |
| preview: work + tag | true |
| preview: no slots yet | true |
| summary heading | Setup summary |
| summary not bookable | Not bookable yet. Still needed: an open slot, session prices. |
| slots heading | Your slots |
| slots empty state | false |
| slot: too soon error | A slot must start at least two hours from now. Choose a later time. |
| slot: exactly 2h accepted | Slot Mon 26 Oct, 11:00 published. |
| slot: error cleared |  |
| slot: duplicate error | You already published this slot. Choose another time. |
| slots listed (2) | 2 |
| slot removed | 1 |
| slots (2) after re-add | 2 |
| prices heading | Your session prices |
| prices: empty errors | Enter the 25-minute price as a whole number of euros. |
| prices: below bound | The 25-minute price must be between 15 and 120 EUR. |
| prices: above bound | The 50-minute price must be between 15 and 120 EUR. |
| prices: saved status | Prices saved: 40 EUR for 25 minutes, 70 EUR for 50 minutes. |
| prices: errors cleared |  |
| summary bookable | Bookable: a mentee can now pick one of your open slots at your prices. |
| summary prices row | 40 EUR for 25 min, 70 EUR for 50 min |
| preview shows prices | 40 EUR (25 min), 70 EUR (50 min) |
| preview open slots (2) | 2 |
| browser back -> summary | Setup summary |
| back: heading focused | H2:Setup summary |
| browser forward -> slots | Your slots |
| nav current step | 4. Slots |
| in-page Back from slots | Your mentor page |
| keyboard: Tab moves focus to a control | true |
| keyboard: focus outline visible | true |
| keyboard: Enter submits form (page saved status) | Mentor page saved. Your share link is ready. |
| narrow: no horizontal overflow | true |
| narrow: slots no overflow | true |
| narrow: mentor page no overflow | true |
| test-state panel open | true |
| booking status | Simulated booking: slot Mon 26 Oct, 11:00 is now taken. |
| preview open slots after booking (1) | 1 |
| summary open slots after booking | 1 open |
| slot marked booked, no remove | Mon 26 Oct, 11:00 (booked)|0 |
| reset: back at invitation | Mentor invitation |
| reset: status announced | Simulation reset. You are back at the invitation. |
| reset: signed out (slots denied) | Sign in required |
| github success -> mentor page | Your mentor page |
| reset: page form cleared | |false |
| reset: slots emptied | 0 |
| reset: prices cleared | |true |
| reset: summary not bookable | Not bookable yet. Still needed: a mentor page, an open slot, session prices. |
| reset from mid-flow -> invitation | Mentor invitation |
| reset on start stays on invitation | Mentor invitation |

Four of these checks were first attempted while the Test state panel was collapsed by my earlier click, so the button was not in the snapshot and they failed. That was a harness error, not a prototype defect. I reran those checks with the panel confirmed open, and they passed; the table shows the rerun results.

Evidence: `evidence/01-invitation.png` to `evidence/24-narrow-mentor-page.png` (entry, invitation states, unknown address, signed-out screen, sign-in and GitHub failure, form errors, saved states, slots, prices, summary, public preview, keyboard focus, 360 px layouts).

Keyboard traversal (separate run, same session setup, no screenshots): starting from the screen heading, Tab visited, in order, on the sign-in screen: Continue with GitHub, E-mail, Password, Create account and accept, Back to the invitation, then the Test state toggle; on the mentor page: link, description, the four tag checkboxes, channel, Save mentor page, Back, Skip to slots, then the Test state toggle. Every stop showed a 3 px outline. After the last control, focus left the screen and moved to the browser document and the step navigation, which is the normal wrap-around.

Limits of this check:
- Screen-reader announcements were checked by reading the live status text, not with a screen reader.
- Contrast was chosen (near-black on white and light gray) but not measured with a tool.
- Tab traversal was run on the sign-in and mentor page screens only; the other screens use the same controls.
- Browser checks observe the prototype only. They say nothing about whether mentors want this flow (A03 stays untested).
