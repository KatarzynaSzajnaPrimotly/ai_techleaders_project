# Plan — E02-S01 invitation and mentor role grant

Source spec: `.ai/specs/2026-09-08-mentors-become-bookable.md` (Slice 1); story: `.ai/specs/2026-09-08-invitations.md`; design handoff: `.ai/specs/2026-09-09-e02-design-handoff.md`; design PR #58; tracker issue #39, epic #30; base: E01 implementation PR #59.

## Tasks

> Authoritative status table. `Status` is one of `todo` or `done`. On landing a Step, flip `Status` to `done` and fill the `Commit` column with the short SHA. The first row whose `Status` is not `done` is the resume point. Step ids and `Exec` cells are immutable after this plan is committed.

| Phase | Step | Title | Exec | Status | Commit |
|-------|------|-------|------|--------|--------|
| 1 | 1.1 | Opaque invitation token utilities | dispatch:cheap | done | 9a51d7e |
| 1 | 1.2 | Invitation and onboarding persistence | inline | todo | — |
| 1 | 1.3 | Invitation policy configuration | inline | todo | — |
| 1 | 1.4 | Invitation lifecycle service | inline | todo | — |
| 1 | 1.5 | Local-time deadline display primitive | inline | todo | — |
| 1 | 1.6 | Invitation and onboarding API routes | inline | todo | — |
| 1 | 1.7 | Invitation acceptance and mentor home | inline | todo | — |
| 1 | 1.8 | Operator invitation script and docs | inline | todo | — |
| 1 | 1.9 | Invitation integration coverage | inline | todo | — |

## Goal

Implement E02-S01 (#39): an operator can create, revoke, and resend invitations; an invited engineer with the matching verified email can accept once, gain the additive mentor role, receive a renewed session, and see the snapshotted publish-by date on `/mentor`.

## Scope

- Follow Slice 1's data model, API contracts, role grant, deadline snapshot, session-cookie renewal, and concurrency rules in the epic spec.
- Add the public invitation lookup/accept screens, owner-scoped onboarding read, `/mentor` deadline, and the by-hand `invite` CLI.
- Add migration up/down, unit tests for changed production files, and PostgreSQL/browser integration coverage.
- Reuse existing E01 auth, DI, API, feedback, UI and Storybook patterns wherever present.
- The repository has no Storybook setup or stories; reuse tested UI components without introducing an unrelated Storybook framework.
- Keep S02 work separate for issue #40 and its own PR, while leaving the empty profile row compatible with that next slice.

## Non-goals

- No batch-of-20 operator tooling, email transport, invitation admin screen, mentor-profile editor/public page, slots, prices, or Stripe Connect.
- Do not modify the E02 specification or archive docs; PR #58 remains design-only.
- Do not merge E01 or E02 into `main`.

## Risks

- Role grant is security-sensitive (`risk-high`): acceptance must bind to the persisted, verified, normalized email, hold the specified locks, grant the role and profile atomically, and issue a fresh JWT with the incremented `sessionVersion`.
- The partial unique index and concurrent accept/revoke/resend paths require PostgreSQL integration tests; migration tests must cover both `up` and `down`.
- This slice changes user-facing auth/onboarding screens and needs manual QA by a second reviewer before merge.

## External References

- E02 design-only PR #58 and epic issue #30.
- E02-S01 issue #39; E02-S02 #40 is the next dependent slice and remains separate.
- E01 implementation PR #59, head `feat/e01-auth-implementation`.

## Implementation Plan

1. **Opaque invitation token utilities** — add B5′ mint/hash helpers and focused tests for entropy/length and deterministic SHA-256 hashes.
2. **Invitation and onboarding persistence** — add the invitation entity and both-direction migration, profile initial publish deadline, entity registration, and named checks/indexes; verify the MikroORM `text[]` mapping.
3. **Invitation policy configuration** — add defaulted TTL/deadline settings to both Zod env schemas and wire `.env.example`, `README.md`, CI and integration environment.
4. **Invitation lifecycle service** — implement create/lookup/accept/revoke/resend with normalization, token rotation, transaction locking, current-session identity checks, additive role grant, one-time profile/deadline creation, and domain event; test failure and concurrency cases.
5. **Local-time deadline display primitive** — implement `formatInstant` and `LocalTime` with UTC first render and viewer-zone update, with full unit coverage.
6. **Invitation and onboarding API routes** — add public lookup, session-only accept (no role guard), fresh session cookie after grant, and mentor-only durable onboarding status; retain shared API/CSRF/error handling.
7. **Invitation acceptance and mentor home** — add `/invitation/[token]` states and `/mentor` publish-by ask, using existing UI/Storybook components and accessible feedback.
8. **Operator invitation script and docs** — add `invite create|revoke|resend`, safe token-free audit output, raw link only on successful create/resend, npm script and README guidance.
9. **Invitation integration coverage** — exercise acceptance-to-mentor-home while still signed in, invalid-link indistinguishability, and absence of an open mentor-registration path; add `seedPendingInvitation` for future tests.
