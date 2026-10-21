# Backlog

One section per `Backlog source:`. The tracker is the live authority; this file is the source-to-issue map, the dependencies, the iterations and the reserved ids. A full snapshot with every body is in `backlog-snapshot.md`.

## Source: `.ai/specs/product-brief.md` (1.0 tree, filed 2026-10-21)

Filed to `KatarzynaSzajnaPrimotly/ai_techleaders_project` through `om-backlog`, adapted from the reference backlog `full-backlog.md` to this repository's code. Iterations follow D13: 14 stories in the first iteration, 7 in 1.1. A child lists its epic in `Epic:` and its dependencies in `Depends on:`; each epic carries a checklist of its stories.

### E01
- E01 — #29 [Accounts and roles](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/29)
  - E01-S01 — #36 [A developer or invited mentor signs in with GitHub and lands in their role's home](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/36) [first (D13)]
  - E01-S02 — #37 [A user without GitHub signs in with email and password](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/37) [first (D13)] — depends on E01-S01 (#36)
  - E01-S03 — #38 [A signed-in user sees only their role's screens; the operator role belongs to the two founders](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/38) [first (D13)] — depends on E01-S01 (#36)

### E02
- E02 — #30 [Mentors become bookable](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/30)
  - E02-S01 — #39 [An invited senior engineer accepts the invitation and gets a mentor account; there is no open registration](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/39) [first (D13)] — depends on E01-S01 (#36)
  - E02-S02 — #40 [A mentor fills the mentor page (public-work link, description, stack tags) and gets a share link; no ratings](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/40) [first (D13)] — depends on E02-S01 (#39)
  - E02-S03 — #41 [A mentor publishes slots and sees them taken as they are booked](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/41) [first (D13)] — depends on E02-S01 (#39)
  - E02-S04 — #42 [A mentor sets 25- and 50-minute prices within the operator's bounds](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/42) [first (D13)] — depends on E02-S01 (#39)
  - E02-S05 — #43 [A mentor completes Stripe Connect onboarding and sees whether payouts are enabled](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/43) [1.1 (D13)] — depends on E02-S01 (#39)

### E03
- E03 — #31 [Booking and payment](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/31)
  - E03-S01 — #44 [A mentee finds a mentor in a list filtered by stack tag, ordered by most recent published availability; no search, no ranking](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/44) [1.1 (D13)] — depends on E02-S02 (#40), E02-S03 (#41)
  - E03-S02 — #45 [A mentee picks a slot that starts at least two hours ahead and a 25- or 50-minute length at the mentor's price](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/45) [first (D13)] — depends on E02-S03 (#41), E02-S04 (#42), E01-S01 (#36)
  - E03-S03 — #46 [A mentee pays through Stripe Checkout; the booking is confirmed only after payment; booking-to-start is recorded](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/46) [first (D13)] — depends on E03-S02 (#45)
  - E03-S04 — #47 [The mentor and the mentee are told about a confirmed booking and each sees their upcoming sessions](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/47) [first (D13)] — depends on E03-S03 (#46)
  - E03-S05 — #48 [A mentee cancels free up to 24 hours before a session; a later cancellation forfeits the fee](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/48) [1.1 (D13)] — depends on E03-S03 (#46)
  - E03-S06 — #49 [DevMentor keeps 20% of a paid session and the mentor's share is paid out through Stripe Connect](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/49) [1.1 (D13)] — depends on E03-S03 (#46), E02-S05 (#43)

### E04
- E04 — #32 [Session, written answer, and note](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/32)
  - E04-S01 — #50 [At the slot's start the mentee and the mentor hold a 25- or 50-minute text session in the channel the mentor named; every DevMentor screen about the session says sessions are text](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/50) [first (D13)] — depends on E03-S03 (#46)
  - E04-S02 — #51 [The mentor gives the written answer and the mentee sees it after the session](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/51) [first (D13)] — depends on E04-S01 (#50)
  - E04-S03 — #52 [The mentor drafts a session note and the mentee sees it awaiting approval](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/52) [first (D13)] — depends on E04-S02 (#51)
  - E04-S04 — #53 [The mentee approves the note in full or declines it with a comment; an approved note is kept privately by both; nothing is published](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/53) [first (D13)] — depends on E04-S03 (#52)

### E05
- E05 — #33 [Operator functions in 1.0](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/33)
  - E05-S01 — #54 [The operator invites a senior engineer from the beachhead pool in a batch of 20 and sees who published a slot within two weeks](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/54) [1.1 (D13)] — depends on E01-S03 (#38)
  - E05-S02 — #55 [The operator sets the price bounds and the platform fee](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/55) [1.1 (D13)] — depends on E01-S03 (#38)
  - E05-S03 — #56 [The operator resolves a quality dispute and records the outcome; no automatic refund](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/56) [1.1 (D13)] — depends on E03-S03 (#46)

### E06 (parked, no stories)
- E06 — #34 [Later (parked)](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/34)

### E07 (epic only, stories not filed)
- E07 — #35 [Public home page](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/35)

Reserved ids: E01–E07; stories E01-S01–S03, E02-S01–S05, E03-S01–S06, E04-S01–S04, E05-S01–S03.

## Source: `.ai/specs/archive/2026-10-20-pilot/2026-10-20-product-brief-pilot.md` (pilot tree, retired 2026-10-21)

The pilot tree was renamed to the P series, closed as not planned with a comment pointing at the 1.0 epics, and kept for history. Its ids are reserved and never reused.

- P01 — #5
- P02 — #6
- P03 — #7
- P04 — #8
- P05 — #9
- P01-S01 — #10
- P01-S02 — #11
- P02-S01 — #12
- P02-S01-T01 — #13
- P02-S02 — #14
- P02-S03 — #15
- P03-S01 — #16
- P03-S02 — #17
- P04-S01 — #18
- P04-T01 — #19
- P04-T02 — #20
- P06 — #22
- P06-S01 — #23
- P06-S02 — #24
- P06-S03 — #25
- P06-S04 — #26
- P02-S04 — #27
