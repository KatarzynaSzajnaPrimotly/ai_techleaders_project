# E02 remaining bookable slices

## Tasks

| Phase | Step | Title | Exec | Status | Commit |
|---|---|---|---|---|---|
| QA | 0.1 | Local mail capture and invitation CLI reliability | inline | todo | — |
| S02 | 2.1 | Mentor profile domain, schema, persistence and API | group:mentor-profile | todo | — |
| S02 | 2.2 | Profile editor, public mentor page and integration coverage | group:mentor-profile | todo | — |
| S03 | 3.1 | Availability slot model, service, API and integration coverage | group:availability | todo | — |
| S03 | 3.2 | Mentor slot editor and public availability display | group:availability | todo | — |
| S04 | 4.1 | Exact money, platform settings and bounded price persistence/API | group:prices | blocked | — |
| S04 | 4.2 | Price editor, public offer readiness and end-to-end coverage | group:prices | blocked | — |

## Goal
Implement E02-S02, E02-S03 and E02-S04 from `.ai/specs/2026-09-08-mentors-become-bookable.md`, building on E02-S01 in PR #60. Keep the user-facing flows aligned with `.ai/specs/2026-09-09-e02-design-handoff.md` and the existing Storybook component patterns. Deliver a stacked draft PR based on `feat/e02-s01-invitations`, with progress reported to issue #8 as requested.

## Scope
- E02 mentor profile/public page, availability slots, and price/offer-readiness slices.
- Required DB migrations, domain/service/API/UI work, tests, and local QA support needed to exercise the flows.
- Reuse existing app session, CSRF, owned-route, CrudForm, design system, and test environment patterns.

## Non-goals
- E03 booking/checkout/payment execution or Stripe Connect.
- E05 operator settings UI or fee configuration.
- Ratings, reviews, scoring, ranking, or mentor discovery/search.
- Merging the stacked PR into its base branch.

## Risks / blockers
- Slice 4 requires founder A's initial EUR price bounds before implementation/QA; D29 resolves currency as EUR, but the bounds are explicitly undecided in the story spec.
- Issue #8 is already closed and titled P04 — Pilot measurement and prerequisites; progress comments there may be out of context, but the brief explicitly requests reporting there.
- The supplied handoff doc is a design contract; its non-goals and no-production-service boundary remain authoritative.

## References
- `.ai/specs/2026-09-08-mentors-become-bookable.md`
- `.ai/specs/2026-09-09-e02-design-handoff.md`
- `.ai/specs/2026-09-08-mentor-page.md`
- Issue #40 and #41 for story acceptance criteria; issue #42 for price story and unresolved bounds.
