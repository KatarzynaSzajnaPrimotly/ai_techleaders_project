# DevMentor — my backlog

Every issue of the 1.0 tree on the tracker, with its description as it stands on GitHub (snapshot of 2026-10-21). Comparable with the reference `full-backlog.md`.

The epics and stories come from `.ai/specs/product-brief.md` and are mapped to issue numbers in `.ai/specs/backlog.md`. The earlier pilot tree (P01–P06, issues #5–#27) is closed and retired.

The tracker is the authority; this file is a snapshot for reading in one place.

## Index

| Id | Issue | Title | Epic | Depends on | Iteration |
|---|---|---|---|---|---|
| E01 | [#29](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/29) | Accounts and roles |  |  |  |
| E01-S01 | [#36](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/36) | A developer or invited mentor signs in with GitHub and lands in their role's home | #29 |  | first (D13) |
| E01-S02 | [#37](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/37) | A user without GitHub signs in with email and password | #29 | E01-S01 (#36) | first (D13) |
| E01-S03 | [#38](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/38) | A signed-in user sees only their role's screens; the operator role belongs to the two founders | #29 | E01-S01 (#36) | first (D13) |
| E02 | [#30](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/30) | Mentors become bookable |  |  |  |
| E02-S01 | [#39](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/39) | An invited senior engineer accepts the invitation and gets a mentor account; there is no open registration | #30 | E01-S01 (#36) | first (D13) |
| E02-S02 | [#40](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/40) | A mentor fills the mentor page (public-work link, description, stack tags) and gets a share link; no ratings | #30 | E02-S01 (#39) | first (D13) |
| E02-S03 | [#41](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/41) | A mentor publishes slots and sees them taken as they are booked | #30 | E02-S01 (#39) | first (D13) |
| E02-S04 | [#42](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/42) | A mentor sets 25- and 50-minute prices within the operator's bounds | #30 | E02-S01 (#39) | first (D13) |
| E02-S05 | [#43](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/43) | A mentor completes Stripe Connect onboarding and sees whether payouts are enabled | #30 | E02-S01 (#39) | 1.1 (D13) |
| E03 | [#31](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/31) | Booking and payment |  |  |  |
| E03-S01 | [#44](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/44) | A mentee finds a mentor in a list filtered by stack tag, ordered by most recent published availability; no search, no ranking | #31 | E02-S02 (#40), E02-S03 (#41) | 1.1 (D13) |
| E03-S02 | [#45](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/45) | A mentee picks a slot that starts at least two hours ahead and a 25- or 50-minute length at the mentor's price | #31 | E02-S03 (#41), E02-S04 (#42), E01-S01 (#36) | first (D13) |
| E03-S03 | [#46](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/46) | A mentee pays through Stripe Checkout; the booking is confirmed only after payment; booking-to-start is recorded | #31 | E03-S02 (#45) | first (D13) |
| E03-S04 | [#47](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/47) | The mentor and the mentee are told about a confirmed booking and each sees their upcoming sessions | #31 | E03-S03 (#46) | first (D13) |
| E03-S05 | [#48](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/48) | A mentee cancels free up to 24 hours before a session; a later cancellation forfeits the fee | #31 | E03-S03 (#46) | 1.1 (D13) |
| E03-S06 | [#49](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/49) | DevMentor keeps 20% of a paid session and the mentor's share is paid out through Stripe Connect | #31 | E03-S03 (#46), E02-S05 (#43) | 1.1 (D13) |
| E04 | [#32](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/32) | Session, written answer, and note |  |  |  |
| E04-S01 | [#50](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/50) | At the slot's start the mentee and the mentor hold a 25- or 50-minute text session in the channel the mentor named; every DevMentor screen about the session says sessions are text | #32 | E03-S03 (#46) | first (D13) |
| E04-S02 | [#51](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/51) | The mentor gives the written answer and the mentee sees it after the session | #32 | E04-S01 (#50) | first (D13) |
| E04-S03 | [#52](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/52) | The mentor drafts a session note and the mentee sees it awaiting approval | #32 | E04-S02 (#51) | first (D13) |
| E04-S04 | [#53](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/53) | The mentee approves the note in full or declines it with a comment; an approved note is kept privately by both; nothing is published | #32 | E04-S03 (#52) | first (D13) |
| E05 | [#33](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/33) | Operator functions in 1.0 |  |  |  |
| E05-S01 | [#54](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/54) | The operator invites a senior engineer from the beachhead pool in a batch of 20 and sees who published a slot within two weeks | #33 | E01-S03 (#38) | 1.1 (D13) |
| E05-S02 | [#55](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/55) | The operator sets the price bounds and the platform fee | #33 | E01-S03 (#38) | 1.1 (D13) |
| E05-S03 | [#56](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/56) | The operator resolves a quality dispute and records the outcome; no automatic refund | #33 | E03-S03 (#46) | 1.1 (D13) |
| E06 | [#34](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/34) | Later (parked) |  |  |  |
| E07 | [#35](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/35) | Public home page |  |  |  |

## Product tree

### E01 — #29 Accounts and roles

**Issue:** [#29](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/29)  
**Labels:** feature, priority-medium, risk-high  

Backlog source: .ai/specs/product-brief.md
Backlog id: E01

## Summary
- Problem: nobody can be identified today. `packages/core/src/http/auth.ts` can sign and verify a session JWT (`signSession`, `verifySession`, `requireSession`), but nothing in the app issues a cookie, there is no `users` table (the only entity is `Mentor`, `packages/db/src/entities/mentors/mentor.entity.ts`), and `POST /api/mentors`, `GET /api/mentors` and `/admin/mentors` are public (the known gap in `AGENTS.md`). Evidence of need: a developer blocked before a release shipped a workaround (`.ai/specs/research/2026-08-20-interview-working-dev.md`); a senior engineer answers the same questions unpaid in DMs (`.ai/specs/research/2026-08-22-interview-mentor.md`). Neither can transact without an account and a role. Sign-in friction is itself a risk: the fintech developer wanted help "in twenty minutes, not create an account, verify the e-mail, then wait" and said "github wystarczy" (`.ai/specs/research/2026-09-01-interview-backend-dev-fintech.md`).
- Who has it: mentees (developers with an urgent problem), mentors (invited senior engineers), the operator (the two founders, D19).
- Expected outcome: every role can sign in (GitHub first, e-mail fallback) and reaches only its own screens, and the two public write surfaces are closed; checked by the three stories' acceptance criteria and by the risk-high gates in `SDLC.md` (integration tests for the denied path and the wrong-scope read).

## Spec
Design authority: `.ai/specs/product-brief.md`. No implementation spec exists. Per `AGENTS.md`, one is owed before the first story is implemented: `.ai/specs/YYYY-MM-DD-auth.md`, covering the session mechanics, the role model, the guard layers and the test-identity approach shared by E01-S01 to S03. Each story may add its own short spec, named in the story.

## Analysis
- Exists and is reused: `signSession`, `verifySession`, `requireSession(request)`, `requireRole`, `assertOwns`, `buildSessionCookie`, `clearSessionCookie`, `SESSION_COOKIE = "devmentor_session"`, 24 h lifetime (`packages/core/src/http/auth.ts`); `JWT_SECRET` (optional, min 32 chars) and `requireJwtSecret` (`packages/core/src/config/env.ts`); `apiHandler` with a default CSRF check on non-safe methods via `x-devmentor-csrf: 1` (`packages/core/src/http/apiHandler.ts`); `makeCrudRoute` with an `authorize(request, method)` hook that runs before every verb (`packages/core/src/http/makeCrudRoute.ts`).
- Does not exist yet: a `users` entity or table (one migration only, `packages/db/migrations/Migration20261019084823.ts`, creating `mentors`); an `auth` concept folder in any package; OAuth, password hashing, a mailer, rate limiting, `core/src/events`; sign-in pages, persona route groups, `/admin` layout or index page; a seeder; `Role` (today `Session.role` is a plain `string`, and no code says `student`).
- Public surfaces to close: `GET`/`POST /api/mentors` (`packages/app/src/app/api/mentors/route.ts`, no `authorize`), `/admin/mentors` (`packages/app/src/app/admin/mentors/`), and the integration test that relies on both being open (`tests/integration/mentors.int.test.ts`).
- Next.js 16 note (read from `node_modules/next/dist/docs/01-app/02-guides/authentication.md`): layouts do not re-render on navigation, so a role check only in a layout is not enforcement; check in each page or a data-access helper, and use `proxy.ts` (the renamed middleware) at most as an optimistic redirect.
- Account and role model (D31): each account has exactly one role, so `Session.role` stays a single string and the protected session surface keeps its shape. A founder who also mentors uses a separate mentor account (with a different e-mail, since `users.email` is unique).
- Mandated by `AGENTS.md` and `.ai/specs/engineering-standards.md`: auth enforced server-side on every non-public route and per record; services take dependencies from the Awilix cradle (one explicit line in `packages/app/src/server/container.ts`); only typed `AppError`s; migrations generated and committed; 100% coverage including every new page and route; integration tests for flows and database changes.

## How to implement
Three stories, in order; each ships its own unit and integration tests.
1. E01-S01: GitHub sign-in, the `users` table, session issuance, role homes.
2. E01-S02: e-mail and password registration and sign-in on the same session.
3. E01-S03: the operator role, guards on every non-public route and page, closing the public surfaces.
Shared rule: no new `fetch` outside `apiCall` in `app`/`ui` (ESLint); the GitHub client lives in `core` behind a port.

## Acceptance criteria
- Given any role, When it signs in (GitHub or e-mail), Then it reaches its own home and no other role's screens. (R06, D07)
- Given an anonymous visitor, When they call a guarded route or open a guarded page, Then they get 401 or a redirect to sign-in and nothing of the page is rendered. (negative)
- Given the epic is complete, When `POST /api/mentors` is called without an operator session, Then it is refused. (negative; closes the `AGENTS.md` known gap)

## Decisions in play
- D07 — sign-in with GitHub for every role, e-mail plus password as the fallback (owner: founder A)
- R06 — the same, as a rule
- D19 — the operator is the two founders; operator functions without a story are done by hand and logged (owner: founders A and B)
- R07 — mentors join by invitation only; no open registration (D08)
- R18 — operator actions without a story are done by hand and logged in the shared operator note
- D31 — one role per account; a founder who also mentors uses a separate mentor account (owner: founder A)

## Compatibility notes
`BACKWARD_COMPATIBILITY.md` (it lists protected surfaces in a table, not numbered sections): "Session cookie and JWT" and "Environment variables and config" are touched by every story; "HTTP API routes" and "Package public exports" when `/api/mentors` is guarded and `Role` is exported (E01-S03, E01-S01); "Database schema and migrations" for the `users` table. Each story names its own path. `AGENTS.md` must drop the "known gap" bullet when E01-S03 merges.

## How to pick this up
Container issue; it closes when its three stories close. Pick up the stories with `om-auto-fix-issue <story number>`, in order, after the `.ai/specs/` auth spec is written.

## Out of scope
- N01 video calls; N02 ratings or a reviews profile; open mentor registration (R07); any role beyond mentee, mentor, operator (D19); password reset; invitation acceptance (E02-S01).

## Open questions
- Mentee or `student` for the role name: the brief says mentee, no code uses `student` (Q22) — non-blocking (owner: founder A); decided in E01-S01.
- Q19 (first-iteration payouts) touches roles only through the operator acting by hand (R18) — non-blocking for this epic.

## Unverified claims
- None at epic level; each story lists its own.

## 📋 Stories
<!-- om-backlog: checklist, rewritten on every run -->
- [ ] #36 E01-S01 — A developer or invited mentor signs in with GitHub and lands in their role's home
- [ ] #37 E01-S02 — A user without GitHub signs in with email and password
- [ ] #38 E01-S03 — A signed-in user sees only their role's screens; the operator role belongs to the two founders

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-high` — touches sign-in, sessions, money, data scoping or a migration (SDLC risk-high rules)

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E01-S01 — #36 A developer or invited mentor signs in with GitHub and lands in their role's home

**Issue:** [#36](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/36)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #29  
**Iteration:** first (D13)  

Backlog source: .ai/specs/product-brief.md
Backlog id: E01-S01
Epic: #29
Depends on: none
Iteration: first (D13)

## Summary
- Problem: nothing identifies a user. The session helpers in `packages/core/src/http/auth.ts` exist but nothing issues the `devmentor_session` cookie, there is no `users` table, and no sign-in page, so no booking can be tied to a person. Sources: that file and `packages/db/migrations/`; the mentor interview says "my GitHub is my profile" (`.ai/specs/research/2026-08-22-interview-mentor.md`), and the fintech developer judges a stranger by GitHub and refuses account friction (`.ai/specs/research/2026-09-01-interview-backend-dev-fintech.md`).
- Who has it: mentees (developers with an urgent problem) and invited mentors; both are developers, so GitHub comes first (D07).
- Expected outcome: a GitHub sign-in finds or creates the account tied to that GitHub identity, starts a session, and sends the user to the mentee home or the mentor home by role; checked by the criteria below, unit tests at 100%, and an integration test for the cancelled and expired paths.

## Spec
Design authority: `.ai/specs/product-brief.md`. An implementation spec is owed before implementing: the shared `.ai/specs/YYYY-MM-DD-auth.md` named in E01 (session issuance, role model, GitHub flow, test-identity approach).

## Analysis
- Reused as is: `signSession`, `buildSessionCookie({ secure })`, `clearSessionCookie`, `SESSION_COOKIE`, `SESSION_TTL_SECONDS` (24 h), `requireSession(request)` in `packages/core/src/http/auth.ts`. There is no `readSession`; do not add a session service that duplicates these.
- One role per account (D31): `users.role` holds a single value and `Session.role` stays a single string; no roles list in the JWT, so the "Session cookie and JWT" surface keeps its claims. How an account moves from mentee to mentor is E02-S01's accept step, which replaces the stored role through the user repository; this story only provides the single-valued column and repository.
- Changes there: `Session.role` is `string` and `verifySession` accepts any role claim. Add `Role` and make `verifySession` reject an unknown role (fail closed). No code issues tokens today, so no live session is invalidated. Role name: see Open questions.
- `packages/core/src/config/env.ts`: only `NODE_ENV`, `LOG_LEVEL`, `JWT_SECRET` exist; `JWT_SECRET` is not in `README.md` or `.env.example`. `requireJwtSecret` throws a plain `Error` (a 500 through `apiHandler`). New optional variables: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `APP_URL`, and base URLs for GitHub's OAuth and API hosts defaulting to the real ones (so an integration test can point the app at a local fake instead of a test-mode backdoor).
- Entities are `EntitySchema` objects registered in `packages/db/src/orm.ts` and exported from `packages/db/src/entities/index.ts`; repositories reference entities by name (`.ai/lessons/2026-10-19-nextjs-duplicate-package-copies.md`). `packages/db/src/entities/auth/` does not exist.
- The container is `packages/app/src/server/container.ts` (`Cradle` interface, scoped registrations). `core/src/events` does not exist and nothing listens, so no `auth.user.created` event.
- `/` is the existing landing page; `/mentors` is public. No `(auth)`, `(mentee)`, `(mentor)` route groups exist yet; this is the first persona page, which `.ai/specs/implemented/2026-10-19-engineering-standards-rollout.md` deferred to.
- `apiHandler` passes a returned `Response` through, so redirects and `Set-Cookie` work in routes; state-changing routes need the `x-devmentor-csrf` header (`apiCall` sends it).

## How to implement
1. `packages/core/src/http/auth.ts`: add `Role = "mentee" | "mentor"` (E01-S03 widens it with `operator`), `isRole`, narrow `Session.role`; update `auth.test.ts` (the "admin" role token case now rejects).
2. `packages/core/src/config/env.ts`: add the optional variables above; document them and `JWT_SECRET` in `.env.example` and `README.md`. A route that needs a missing value fails closed with a typed 503 error (add `ServiceUnavailableError` and a `SERVICE_UNAVAILABLE` code to `errors.ts`; additive).
3. Migration: `users` (`id` uuid, `email` unique, `display_name`, `role` default mentee or mentor only, `github_id` unique nullable, `github_login`, `avatar_url`, `created_at`) via `npm run migration:create -w @devmentor/db`; entity `packages/db/src/entities/auth/user.entity.ts`, registered in `orm.ts` and `entities/index.ts`. Check the regenerated snapshot diff. Test the migration up and down.
4. `packages/core/src/services/auth/`: `user-repository.port.ts`, `user.types.ts`, `user.service.ts` (`findOrCreateFromGithub`: match `github_id`, else link by verified primary e-mail, else create with the default role; throw typed errors only), `github-identity.port.ts` with an adapter under `adapters/` using `fetch` (authorize URL, code exchange, `/user` and `/user/emails`), and a signed short-lived `state` cookie helper (jose). Repository in `packages/db/src/repositories/auth/user.repository.ts`, mapping 23505 to `ConflictError`.
5. Register `userRepository`, `userService`, `githubIdentity` in `container.ts` (one explicit line each, extend `Cradle`).
6. Routes with `apiHandler`, all `force-dynamic`: `api/auth/github/route.ts` (GET, redirect, set `state`), `api/auth/github/callback/route.ts` (GET; on `error=access_denied` redirect to `/sign-in?cancelled=1` and create nothing; otherwise sign the session, set the cookie, redirect by role), `api/auth/logout/route.ts` (POST, clears the cookie).
7. `packages/app/src/server/session.ts`: read the cookie with `await cookies()` from `next/headers` and verify it; redirect to `/sign-in` when missing or expired. Pages: `(auth)/sign-in/page.tsx` (Tailwind; GitHub button first, e-mail link second, disabled with a note until E01-S02; cancelled message), `(mentee)/home/page.tsx`, `(mentor)/mentor/page.tsx`. Each page calls the session helper itself (layout-only checks do not run on client navigation).
8. Tests: unit for every new file (routes in `*.test.ts` under `api/`, pages in `*.test.tsx`). Integration `tests/integration/auth.int.test.ts`: cancelled authorisation, expired-session redirect, and a full callback against a fake GitHub server started in `global-setup.ts` (pass `JWT_SECRET` and the base URLs to `next start`); add a cookie helper to `tests/integration/helpers/browser.ts` using `agent-browser cookies set`.

## Acceptance criteria
- Given a developer with a GitHub account, When they choose "Sign in with GitHub" and authorise DevMentor, Then a DevMentor account tied to that GitHub identity exists and they see the mentee home. (R06, D07)
- Given a user whose stored role is mentor, When their GitHub sign-in completes, Then they land on the mentor home, not the mentee home. (D07, D19; the role is granted by invitation acceptance in E02-S01, so here it is set directly in the test database)
- Given a user who cancels the GitHub authorisation, When they return to DevMentor, Then no account is created and the sign-in screen says so plainly. (negative)
- Given a signed-in user whose session has expired or was tampered with, When they open a signed-in screen, Then they are sent to sign-in and nothing of theirs is shown first. (negative)
- Given any sign-in screen, When it renders, Then GitHub is offered first and the e-mail fallback second. (D07)
- Given a callback with a missing or mismatched `state`, When it is processed, Then no session starts and no account is created. (negative)
- Given GitHub returns no verified e-mail, When the callback runs, Then no account is created and the user is told why. (negative)

## Decisions in play
- D07 — sign-in with GitHub for every role, e-mail plus password as the fallback (owner: founder A)
- D19 — the operator is the two founders (owners: founders A and B)
- D31 — one role per account; a founder who also mentors uses a separate mentor account (owner: founder A)

## Compatibility notes
Protected surfaces in `BACKWARD_COMPATIBILITY.md`: "Session cookie and JWT" (cookie name and algorithm unchanged; the role claim is now validated; no live sessions exist); "Environment variables and config" (new variables optional, `JWT_SECRET` name kept); "Database schema and migrations" (new table, additive, `up` and `down`, rollback plan in the PR body); "Package public exports" (new exports are additive; narrowing `Session.role` is noted in the PR); "HTTP API routes" (new routes are additive; `SERVICE_UNAVAILABLE` is a new code). Labels `risk-high`, `needs-qa`; second reviewer; no self-QA.

## How to pick this up
`om-auto-fix-issue <issue number>` once filed. Prerequisite: the auth spec above is written.

## Out of scope
E-mail and password (E01-S02); the operator role and guards beyond the two homes (E01-S03); invitation acceptance (E02-S01); a real mail transport; N01; N02.

## Open questions
- Mentee or `student` (Q22): no code or doc in this repo says `student` yet, so renaming costs nothing; the default in this issue is `mentee`, to be confirmed. — non-blocking (owner: founder A)
- Session lifetime of 24 h with no refresh flow, per the standards document; confirm. — non-blocking (owner: founder A)

## Unverified claims
- Whether Chrome stores a `Secure` session cookie served over `http://127.0.0.1` in the integration run; the planned test sets the cookie explicitly instead.
- The behaviour of `await cookies()` and `redirect()` in Next 16.4.2 was read from the bundled docs, not run.

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-high` — touches sign-in, sessions, money, data scoping or a migration (SDLC risk-high rules)

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E01-S02 — #37 A user without GitHub signs in with email and password

**Issue:** [#37](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/37)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #29  
**Iteration:** first (D13)  

Backlog source: .ai/specs/product-brief.md
Backlog id: E01-S02
Epic: #29
Depends on: E01-S01 (#36)
Iteration: first (D13)

## Summary
- Problem: D07 keeps e-mail plus password as the fallback for users without GitHub; without it a mentee or an invited mentor with no GitHub account cannot enter. The sign-in wall is also the main friction risk: the fintech developer wanted help "in twenty minutes, not create an account, verify the e-mail, then wait" (`.ai/specs/research/2026-09-01-interview-backend-dev-fintech.md`). Code fact: no password, mailer, rate-limit or `bcrypt` code exists in `packages/` today.
- Who has it: mentees and invited mentors without a GitHub account.
- Expected outcome: registration, e-mail confirmation, sign-in with one generic failure message, on the same session cookie as E01-S01; checked by the criteria below and an integration test of the wrong-password and unverified paths.

## Spec
Design authority: `.ai/specs/product-brief.md`. Owed before implementing: `.ai/specs/YYYY-MM-DD-auth-email-password.md` (token design, rate-limit policy, the enumeration trade-off in Open questions), next to the shared auth spec from E01.

## Analysis
- After E01-S01 the `users` table and `userService` exist. This story adds `password_hash` and `email_verified_at` (both nullable); it reuses the E01-S01 session issuance unchanged.
- E01-S01's `findOrCreateFromGithub` links a GitHub identity to an existing account by e-mail. Once password accounts exist that is an account-takeover path: an attacker registers a victim's address without verifying it, and the victim's later GitHub sign-in is linked into the attacker's account. This story must change that rule: link only when `email_verified_at` is set; an unverified password registration is replaced, not linked.
- Standards (`.ai/specs/engineering-standards.md`): bcrypt or bcryptjs cost >= 12, generic auth errors, rate limit on login and register, no token or password in logs. Neither `bcryptjs` nor `bcrypt` is in any `package.json`; a new dependency is needed in `packages/core/package.json` (`bcryptjs`, pure JavaScript, avoids a native build in CI).
- No mailer exists. `packages/core/src/logger.ts` redacts keys named `token` or `password`, but not a link inside a message string, so a log-only mailer would print a bearer link; it must be development-only, and production without a configured transport fails closed (503) instead of logging.
- Shared schema pattern: `packages/core/src/validators/mentors/mentor-create.schema.ts`, exported from `validators/index.ts` and `core/src/index.ts`. `CrudForm` (`packages/ui/src/backend/forms/CrudForm.tsx`) supports `type: "password"` and server `fieldErrors`, but it is a backend (shadcn) component while sign-in is a public Tailwind page; the spec decides whether to reuse it or add a frontend form.
- Module-level state is duplicated per Next.js route bundle (`.ai/lessons/2026-10-19-nextjs-duplicate-package-copies.md`): keep the rate-limit store on `globalThis`, like the container.

## How to implement
1. Add `bcryptjs` to `packages/core/package.json`; `packages/core/src/services/auth/password.service.ts` (`hash` with a named cost constant of 12 and the reason, `verify`; a dummy hash compared when the e-mail is unknown, so timing does not reveal it).
2. Migration (`npm run migration:create -w @devmentor/db`) and `user.entity.ts` update for the two columns; test up and down.
3. `packages/core/src/validators/auth/register.schema.ts` (`email`, `password` min 12 and max 72, since bcrypt ignores the rest, `displayName`, optional `returnTo` accepted only as a single-slash relative path) and `login.schema.ts`; export through `@devmentor/core/validators`.
4. `packages/core/src/services/notifications/mailer.port.ts` (`send({ to, subject, text })`) and `adapters/log-mailer.ts`; register `mailer` in `container.ts`. `email-verification` helper: a signed expiring token (jose, `JWT_SECRET`, a `purpose` claim so a session token is never accepted here and the reverse).
5. `user.service.ts`: `registerWithPassword`, `authenticateWithPassword` (generic `UnauthorizedError("Invalid credentials")`; no session before `email_verified_at`), `verifyEmail`; adjust `findOrCreateFromGithub` as above.
6. `packages/core/src/http/rate-limit.ts`: per IP plus e-mail counter with a named window and cooldown, on `globalThis`; documented as in-memory only.
7. Routes with `apiHandler`: `api/auth/register` (POST), `api/auth/login` (POST, sets the cookie), `api/auth/verify-email` (GET, then redirect to `returnTo` or the mentee home).
8. Pages `(auth)/register/page.tsx` and the e-mail form on `(auth)/sign-in/page.tsx` (GitHub stays first); carry `returnTo`.
9. Tests: unit for each new file, 100%. Integration `tests/integration/auth-password.int.test.ts`: wrong password gives the generic message and no `Set-Cookie`; an unverified user cannot sign in; verification uses a token the test signs with the known `JWT_SECRET` (no test-only code path).

## Acceptance criteria
- Given a user without GitHub, When they register with an e-mail and a password and confirm the e-mail, Then they have an account and land on the mentee home. (R06)
- Given a registered e-mail user, When they enter a wrong password, Then sign-in fails with a message that does not say which part was wrong and no session starts. (negative)
- Given an e-mail already tied to a GitHub account, When someone registers it with a password, Then the product refuses and points to GitHub sign-in. (negative)
- Given a mentor invited by e-mail who has no GitHub, When they accept the invitation, Then they can complete it with e-mail and password and still get the mentor role. (D07, R07; the round trip of `returnTo` is tested here, the acceptance itself in E02-S01)
- Given an unconfirmed e-mail, When the user tries to sign in, Then no session starts. (negative)
- Given an e-mail that already has a password account, When someone registers it again, Then the answer is the same as for a new address and no account is changed. (negative)
- Given a `returnTo` that is absolute or protocol-relative, When it is submitted, Then it is rejected. (negative)
- Given repeated failed attempts, When the limit is reached, Then further attempts are refused until the cooldown ends. (negative)

## Decisions in play
- D07 — sign-in with GitHub for every role, e-mail plus password as the fallback (owner: founder A)
- R06 — the same, as a rule
- R07 — mentors join by invitation only (D08)

## Compatibility notes
`BACKWARD_COMPATIBILITY.md` table rows: "Database schema and migrations" (additive nullable columns, `up` and `down`, rollback plan); "Environment variables and config" (mail transport variables, if any, optional); "HTTP API routes" (new routes only; existing codes reused); "Shared Zod schemas" (new schemas only). Labels `risk-high`, `needs-qa`; second reviewer; no self-QA.

## How to pick this up
`om-auto-fix-issue <issue number>` once filed; E01-S01 must be merged.

## Out of scope
Password reset; GitHub sign-in (E01-S01); the invitation entity (E02-S01); other social providers (D07); a real mail transport.

## Open questions
- Registration must refuse an e-mail tied to GitHub and say why, which discloses that the address is registered; `.ai/specs/engineering-standards.md` asks for generic register/login messages. Default: keep the criterion, rate-limit, and have the reviewer confirm. — non-blocking (owner: founder A)
- Which mail transport ships for 1.0; the log adapter is enough for development and tests, a real one is needed before invitations go out (D16). — non-blocking (owner: founder A)
- Must the e-mail be confirmed before sign-in, or only before booking? The fintech interview suggests friction costs; the criteria assume before sign-in. — non-blocking (owner: founder A)

## Unverified claims
- Client IP source behind the deployment's proxy is unknown (`x-forwarded-for` trust); the rate-limit key must be chosen in the spec.
- `bcryptjs` compatibility with the Next 16 server bundle was not tried.

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-high` — touches sign-in, sessions, money, data scoping or a migration (SDLC risk-high rules)

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E01-S03 — #38 A signed-in user sees only their role's screens; the operator role belongs to the two founders

**Issue:** [#38](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/38)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #29  
**Iteration:** first (D13)  

Backlog source: .ai/specs/product-brief.md
Backlog id: E01-S03
Epic: #29
Depends on: E01-S01 (#36)
Iteration: first (D13)

## Summary
- Problem: roles exist on paper (mentee, mentor, operator; D19) but nothing enforces them, and two write surfaces are public. Code facts: `POST /api/mentors` and `GET /api/mentors` have no `authorize` (`packages/app/src/app/api/mentors/route.ts`), `/admin/mentors` has no guard, `AGENTS.md` lists this as a known gap, and `requireRole`/`assertOwns` in `packages/core/src/http/auth.ts` have no caller. Without guards a mentee could open mentor screens and anyone could register a mentor. Source for who holds the operator role: the founders cover every internal role themselves (`.ai/specs/research/2026-09-04-miro-board-stakeholders.md`, `2026-09-05-miro-board-raci-matrix.md`).
- Who has it: mentees, mentors, the operator (founder A, founder B).
- Expected outcome: every non-public route and page denies the wrong role (a page redirects, a route answers 401 or 403), the operator role is held only by the founders, and the public write surfaces are closed; checked by the criteria below and by integration tests for the denied path (`SDLC.md` risk-high gates).

## Spec
Design authority: `.ai/specs/product-brief.md`. Owed before implementing: `.ai/specs/YYYY-MM-DD-roles-and-scoping.md` (guard layers, the operator grant, the scoping rule for future lists), after the shared auth spec from E01.

## Analysis
- Exists: `requireSession(request)`, `requireRole(session, role)`, `assertOwns(session, ownerId)` (`packages/core/src/http/auth.ts`); `makeCrudRoute({ authorize })`, called with `(request, method)` before every verb; CSRF is already enforced for non-safe methods by `apiHandler`, so nothing to add there.
- Does not exist: `Role` includes no `operator` (E01-S01 introduces `Role` with mentee and mentor); no `OPERATOR_EMAILS`; no `/api/users`, `/admin/users`, `/admin` index or `admin/layout.tsx` (the only admin page is `packages/app/src/app/admin/mentors/page.tsx`, a server component); no sessions list, so no per-user scoped list exists yet (bookings arrive with E03-S04).
- `/mentors` (public, `packages/app/src/app/mentors/page.tsx`) reads through `mentorService` directly, not the API, so guarding `/api/mentors` does not break it. It prints each mentor's e-mail publicly, which is a separate privacy question for E02, not changed here.
- `AdminMentors` (`admin-mentors.tsx`) calls `/api/mentors` through `apiCall` with same-origin credentials, so the cookie is sent once the operator is signed in.
- Next.js 16 (bundled docs, authentication guide): layouts do not re-render on navigation, so guard in each page (or a helper each page calls), not only in a layout; `proxy.ts` is optional and optimistic only.
- One role per account (D31): the operator role is derived at sign-in and is never combined with another. A founder who also mentors uses a separate mentor account with a different e-mail (`users.email` is unique). If an e-mail on `OPERATOR_EMAILS` already belongs to an account whose stored role is mentor, the allowlist does not apply: the account signs in as mentor and the founder uses another address for the operator account. E02-S01 must in turn not grant the mentor role to an account whose e-mail is on the list.
- Sessions are stateless JWTs: removing an e-mail from `OPERATOR_EMAILS` takes effect at the next sign-in, and an existing cookie lasts up to 24 h (rotating `JWT_SECRET` revokes all).
- `tests/integration/mentors.int.test.ts` posts and uses the admin page anonymously; it must change in this PR. Integration files must match `*.int.test.ts` (`vitest.integration.config.mts`), otherwise they are silently skipped.

## How to implement
1. `packages/core/src/http/auth.ts`: add `operator` to `Role`; update `auth.test.ts` and `index.test.ts` if exports change.
2. `OPERATOR_EMAILS` in `packages/core/src/config/env.ts` (comma-separated, trimmed, lower-cased, default empty meaning nobody); a pure function in `packages/core/src/services/auth/` that gives `operator` only when the e-mail is listed, verified (GitHub's verified primary e-mail, or `email_verified_at` set) and the account's stored role is not mentor (D31); used by the E01-S01 callback and the E01-S02 login when signing the session. Nothing stores or assigns the role (R18: founders edit the list by hand and log it). Document in `.env.example` and `README.md`.
3. `packages/app/src/app/api/mentors/route.ts`: `authorize: async (request) => requireRole(await requireSession(request), "operator")`; update `route.test.ts` (401 without a cookie, 403 for mentee and mentor, success for operator).
4. `packages/app/src/server/session.ts` (from E01-S01): add `requirePageRole(role)`; redirect to `/sign-in` when there is no valid session, to the caller's own home when the role is wrong. Call it inside `admin/mentors/page.tsx`, `(mentee)/home/page.tsx` and `(mentor)/mentor/page.tsx`. Operator lands on `/admin/mentors` after sign-in (the only operator screen that exists).
5. Navigation: role homes link only to their own screens; no "become a mentor" link or route anywhere (R07).
6. Scoping rule, written in the roles spec and tested here on the one list that exists: a service method takes the session's `userId`, never an id supplied by the client, and every record mutation calls `assertOwns`. The sessions-list instance of this rule is tested in E03-S04.
7. Tests: unit for the new function, `requirePageRole` and each guarded page (100%). Integration `tests/integration/roles.int.test.ts`: add a helper that mints a session cookie with `signSession` and the run's `JWT_SECRET` (pass the secret in `global-setup.ts`) and a cookie setter on `helpers/browser.ts`; cases: anonymous POST 401, mentee and mentor 403, operator 201; mentee opening `/admin/mentors` lands on `/home`, mentor lands on `/mentor`, anonymous lands on `/sign-in`; a sign-in through E01-S01's fake GitHub with an e-mail in `OPERATOR_EMAILS` yields operator access. Update `mentors.int.test.ts` to use an operator cookie.
8. Remove the "Known gap" bullet from `AGENTS.md` and update the route table in `README.md`.

## Acceptance criteria
- Given a mentee, When they open a mentor-only screen, Then they are refused and sent to their home. (negative; D05 roles)
- Given a mentor, When they open an operator screen or call an operator route, Then they are refused. (negative)
- Given founder A or founder B, When they sign in, Then they hold the operator role; no other account can be given it in 1.0 except by a founder acting by hand. (D19, R18)
- Given a mentee, When they list sessions, Then only sessions they booked appear; a mentor sees only sessions booked with them. (data scoping; asserted in E03-S04 once sessions exist; here the mentor list is operator-only, so a mentee or mentor gets no rows)
- Given a signed-in user with no invitation, When they look for a way to become a mentor, Then there is none. (R07, negative)
- Given an anonymous visitor, When they call `POST /api/mentors` or open `/admin/mentors`, Then they get 401 or a redirect to sign-in and no mentor is created. (negative)
- Given an account whose e-mail is listed but not verified, When it signs in, Then it does not get the operator role. (negative)
- Given an operator e-mail that already has a mentor account, When that account signs in, Then it holds the mentor role only and gets no operator access; no account ever carries two roles. (D31, negative)

## Decisions in play
- D19 — the operator is the two founders; by-hand actions logged (owners: founders A and B)
- D31 — one role per account; a founder who also mentors uses a separate mentor account (owner: founder A)
- D05 — 1.0 is the session marketplace with accounts and roles (owner: founder A)
- R07 — invitation only; no open registration
- R18 — operator actions without a story are done by hand and logged

## Compatibility notes
`BACKWARD_COMPATIBILITY.md` table rows: "HTTP API routes" (`/api/mentors` GET and POST become authenticated, which is a breaking change: the in-repo caller `AdminMentors` and the integration tests ship in the same PR and the PR body lists it under breaking changes; the roles spec covers the "needs a spec" rule); "Session cookie and JWT" (the role claim may now be `operator`); "Environment variables and config" (`OPERATOR_EMAILS` has a default); "Package public exports" (`Role` widened; no exhaustive switch exists in repo). Labels `risk-high`, `needs-qa`; second reviewer; no self-QA.

## How to pick this up
`om-auto-fix-issue <issue number>` once filed; E01-S01 must be merged (the sign-in routes it guards around).

## Out of scope
The mentor, slot, price and session screens (E02 to E05); an admin role beyond the two founders; RBAC (the standards exclude it); making `/mentors` hide e-mails.

## Open questions
- Should `GET /api/mentors` stay public for a future mentor directory (R13)? Default: operator-only now, reopened in E03-S01. — non-blocking (owner: founder A)

## Unverified claims
- That `redirect()` from a server component page inside a route group issues the expected redirect in Next 16.4.2 was read from docs, not run.
- A search of non-test `.tsx` in `packages/app/src` and `packages/ui/src` found no sign-up or "become a mentor" link (only "register" in admin mentor code); other file types were not searched.

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-high` — touches sign-in, sessions, money, data scoping or a migration (SDLC risk-high rules)

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E02 — #30 Mentors become bookable

**Issue:** [#30](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/30)  
**Labels:** feature, priority-medium, risk-high  

Backlog source: .ai/specs/product-brief.md
Backlog id: E02

## Summary
- Problem: the mentor interviewed on 2026-08-22 answers the same questions unpaid ("two evenings a month, for free, and the notes rot") and the staff engineer who declined MentorCruise wants "a question up front, text, 25 minutes, a high price they set, found through their own link, no ratings" (`.ai/specs/research/2026-08-22-interview-mentor.md`, `2026-09-03-interview-staff-engineer-declined-before.md`). In this repository a mentor is only a placeholder row (`mentors`: id, name, email, createdAt; `packages/db/src/entities/mentors/mentor.entity.ts`) that anyone can create, anonymously, through `POST /api/mentors`: no invitation, no page, no price, no slot, no channel.
- Who has it: invited senior engineers from the beachhead (D24); the operator (the two founders, D19) who invites them and needs the D18 check.
- Expected outcome: an invited engineer accepts, fills a mentor page, publishes slots, sets prices and names the text channel where sessions happen (D27; its address stays private, D32), all within two weeks of accepting. Checked per D18 (fewer than 5 of the first 20 publishing stops further invitations) and by the story acceptance criteria. From 1.1 the mentor is also paid through Stripe Connect (E02-S05); until then the operator pays by hand and logs it (D28, R20).

## Spec
Design authority: `.ai/specs/product-brief.md`. An implementation spec is owed before any story starts (AGENTS.md): `.ai/specs/YYYY-MM-DD-mentors-become-bookable.md` (the shared data-model decision below, the public DTO allowlist, the role model), plus one spec per story, named in each story. Nothing of these exists yet.

## Analysis
Verified in this repository:
- Entity `Mentor` (`packages/db/src/entities/mentors/mentor.entity.ts`, `EntitySchema`, table `mentors`), repository (`packages/db/src/repositories/mentors/mentor.repository.ts`, `findAll`, `create`), port and service (`packages/core/src/services/mentors/`), schema `mentorCreateSchema`, route `packages/app/src/app/api/mentors/route.ts` (`makeCrudRoute` with public GET and POST), pages `/mentors` (lists every row, and `MentorCard` shows the e-mail) and `/admin/mentors`. One migration exists (`packages/db/migrations/Migration20261019084823.ts`).
- Not present: users, invitations, slots, prices, stack tags, `mentorProfile`, Stripe, `availability`, `invitations`, `payments`, `operator` folders. `Session` in `packages/core/src/http/auth.ts` is `{ userId, role: string }` and `requireRole` is a strict equality, which fits D31 (one role per account): accepting an invitation makes the account a mentor and nothing else.
- New entities must be added in two places: `packages/db/src/entities/index.ts` and the `entities: [...]` array in `packages/db/src/orm.ts`; the container is `packages/app/src/server/container.ts` (one explicit line per service).
- Data-model decision proposed for the epic spec: evolve the existing `mentors` table into the mentor profile (add nullable columns, link to the user) rather than add `mentor_profiles` beside it. It keeps one source of truth and only additive migrations (`BACKWARD_COMPATIBILITY.md`, "Database schema and migrations"). Legacy rows have no user and stay unpublished and invisible.
- Existing defects this epic closes: anonymous mentor creation violates R07; the public page and `GET /api/mentors` expose e-mail (against the public-DTO rule of E02-S02).
- Not touched: the home page (`packages/app/src/app/page.tsx`) and `TutorCard` show star ratings and hourly prices from a static catalogue, which N02 excludes; that belongs to E07. The mentor page must not reuse `TutorCard`.

## How to implement
1. E02-S01: invitation entity, accept flow, mentor role, closing anonymous creation.
2. E02-S02: mentor page (public-work link, description, stack tags, session channel), publish, share link `/m/<slug>`.
3. E02-S03: slots.
4. E02-S04: prices within operator bounds.
5. E02-S05 (1.1): Stripe Connect onboarding.
6. Each story: a generated migration (`npm run migration:create -w @devmentor/db`), port, service, route, page, unit tests to 100% (`npm run test:coverage`), and an integration test in `tests/integration/*.int.test.ts` (the harness needs a signed-in mentor from E01-S01, which does not exist yet).

## Acceptance criteria
- Given the epic is done, When an invited engineer follows the stories in order, Then they reach a published page with a channel, at least one bookable slot and both prices, and no step needed anything from the operator except the invitation. (D08, D18, D22, D09, D27)
- Given a visitor who was never invited, When they look for a way to become a mentor, Then there is none. (R07, negative)
- Given any public mentor page, When it renders, Then it shows a link to public work and a plain description, and no rating, review, score or ranking. (R04, N02, negative)

## Decisions in play
- D08, R07 — mentors join by invitation (owner: founder A)
- D18, R17 — one bookable session within two weeks; batches of 20 (owners: both founders)
- D24, R16 — beachhead stacks only (owner: founder A)
- D09, R08 — mentor prices within operator bounds (owner: founder A)
- D22, R14 — slots bookable two hours ahead (owner: founder A)
- D27, R19 — the text session happens in a channel the mentor names (owner: founder A)
- D29 — prices, charges, fees and payouts are in EUR (owner: founder A)
- D31 — one role per account; a founder who also mentors uses a separate mentor account (owner: founder A)
- D32 — the channel address is shown only to the two parties of a confirmed booking, never on the public page (owner: founder A)
- D28, R20 — until Connect (1.1) the operator pays by hand and logs it (owner: founder A)
- D04, R05 — Stripe only; Connect for payouts (owner: founder A)
- N02, R04 — no ratings; link to public work (owner: founder A)

## Compatibility notes
`BACKWARD_COMPATIBILITY.md` has a surface table, not numbered sections. Touched: "Database schema and migrations" (additive columns and tables, one reversible migration per story), "HTTP API routes and response envelope" (POST `/api/mentors` is removed in E02-S01, GET `/api/mentors` loses `email` in E02-S02: both need the documented path), "Session cookie and JWT" (the role claim changes value at acceptance; the cookie is reissued), "Environment variables and config" (price bounds, Stripe keys), "CLI" (a new invite script). `risk-high`.

## How to pick this up
File the stories first; start with `om-auto-fix-issue <E02-S01 number>` once E01-S01 has merged.

## Out of scope
Ratings or reviews (N02); open registration (R07); the vault (D05); stacks outside the four (R16); the mentor list and its tag filter (E03-S01, 1.1); the operator's invitation batches and price-bound screens (E05, 1.1); booking and payment (E03).

## Open questions
- Evolve `mentors` into the profile, or add `mentor_profiles` and retire `mentors` — non-blocking, decide in the epic spec (owner: the implementing author with founder A).
- Should the first iteration show a mentor list at all (`/mentors` today)? D13 puts the list in 1.1 and the staff engineer wants the share link as the only door; proposed default: no list until E03-S01 — non-blocking (owner: founder A).
- Q20 (is a signed-in mentee's visit to a mentor page recorded) concerns the public page of E02-S02 — blocking before 2026-11-28, not for filing (owner: founders A and B).

## Unverified claims
- The reference's design handoff specs and `docs/designs/` do not exist here, so no screen design is claimed.
- Whether MikroORM 7.2 supports partial unique indexes in `EntitySchema` (used in E02-S03) was not checked.

## 📋 Stories
<!-- om-backlog: checklist, rewritten on every run -->
- [ ] #39 E02-S01 — An invited senior engineer accepts the invitation and gets a mentor account; there is no open registration
- [ ] #40 E02-S02 — A mentor fills the mentor page (public-work link, description, stack tags) and gets a share link; no ratings
- [ ] #41 E02-S03 — A mentor publishes slots and sees them taken as they are booked
- [ ] #42 E02-S04 — A mentor sets 25- and 50-minute prices within the operator's bounds
- [ ] #43 E02-S05 — A mentor completes Stripe Connect onboarding and sees whether payouts are enabled

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-high` — touches sign-in, sessions, money, data scoping or a migration (SDLC risk-high rules)

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E02-S01 — #39 An invited senior engineer accepts the invitation and gets a mentor account; there is no open registration

**Issue:** [#39](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/39)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #30  
**Iteration:** first (D13)  

Backlog source: .ai/specs/product-brief.md
Backlog id: E02-S01
Epic: #30
Depends on: E01-S01 (#36)
Iteration: first (D13)

## Summary
- Problem: today anyone can create a mentor: `POST /api/mentors` is public (`packages/app/src/app/api/mentors/route.ts`, `makeCrudRoute` with no `authorize`) and `/admin/mentors` has an "Add mentor" form, so R07 (invitation only) is broken before launch. The mentors interviewed say they join only if the people around them do and want little setup ("dwadzieścia minut. max", `.ai/specs/research/2026-09-03-interview-senior-python-meetups.md`; "jak ludzie, których znam, to wchodzę"), and the invitation is also the D18 test of A03.
- Who has it: invited senior engineers from the beachhead; the operator who invites by hand until E05-S01 (1.1).
- Expected outcome: a single-use link, signed in with the matching verified e-mail, an explicit accept, the mentor role, a draft mentor profile and a visible two-week publish deadline (D18); anonymous mentor creation is gone. Checked by the criteria below and a real-PostgreSQL race test.

## Spec
Design authority: `.ai/specs/product-brief.md`. A spec is owed before implementing: `.ai/specs/YYYY-MM-DD-mentor-invitations.md` (after the epic spec `YYYY-MM-DD-mentors-become-bookable.md`).

## Analysis
- Does not exist yet: users and sign-in (E01-S01), an `invitations` concept, a `scripts/` folder, any mailer. Exists: `mentors` table and `Mentor` types/service/repository/schema, `Session { userId, role: string }` and `requireSession`, `requireRole`, `signSession`, `buildSessionCookie` in `packages/core/src/http/auth.ts`.
- One role per account (D31): `requireRole` is a strict equality on one string, which fits. Accepting sets the account's role to `mentor` (replacing `mentee`) and refuses an account that holds the operator role; a founder who also mentors needs a separate account with its own e-mail. The role claim in the JWT changes value, so the cookie is reissued ("Session cookie and JWT" in `BACKWARD_COMPATIBILITY.md`).
- Accept spans invitation, user and mentor rows: the transaction belongs in the db repository (services never touch the ORM), with a row lock and unique indexes (AGENTS.md: check-then-write needs a transaction, a unique constraint and a concurrent integration test).
- R07 closure: remove `create` from `/api/mentors` (unconfigured methods answer 405), the "Add mentor" form in `packages/app/src/app/admin/mentors/admin-mentors.tsx`, and the then-unused `mentorCreateSchema`, `MentorService.register`, `MentorRepositoryPort.create` (no dead code), updating `tests/integration/mentors.int.test.ts`.
- Operator by hand (R18, D19): no operator screen exists; a CLI under `packages/db/src/scripts/` is the one place where `console` is allowed (`eslint.config.mjs`).

## How to implement
1. Migration (generated): table `invitations` (id uuid, `email` lower-cased, `token_hash` unique, `stack_tags` text[], `created_at`, `expires_at`, `accepted_at`, `accepted_user_id`, `revoked_at`, `publish_due_at`); partial unique index on `email` while unresolved; `mentors.user_id` uuid nullable unique. Register `InvitationSchema` in `entities/index.ts` and `orm.ts`.
2. Core: `services/invitations/` `invitation.types.ts`, `invitation-repository.port.ts`, `invitation.service.ts` (`create`, `revoke`, `resend` rotating the token, `preview(token)`, `accept(session, token, now)`), token = 32 random bytes, only its SHA-256 stored, never logged. Named constants with a why: `INVITATION_TTL_DAYS`, `PUBLISH_DEADLINE_DAYS = 14` (D18). Tags must come from `STACK_TAGS` (typescript, react, python, ai-agents; D24, R16), at least one.
3. Db: `repositories/invitations/invitation.repository.ts` with `accept` in one transaction with `FOR UPDATE`: checks state, verified e-mail equality, adopts a legacy `mentors` row with the same e-mail or inserts one, links `user_id`, sets the single role to `mentor` through E01-S01's user repository, sets `accepted_at` and `publish_due_at` once. Unique violation (23505) becomes `ConflictError`.
4. Routes (`apiHandler`): `GET /api/invitations/[token]` (public; state only, no invited e-mail) and `POST /api/invitations/[token]/accept` (`requireSession`; answers with a refreshed session cookie). Page `packages/app/src/app/invitation/[token]/page.tsx` (Tailwind) with `returnTo` through E01-S01 sign-in; mentor home shows "Publish a bookable session by <date>".
5. CLI `packages/db/src/scripts/invite.ts` (`npm run invite -w @devmentor/db -- create|revoke|resend`) printing the link once and an audit line without the token (R18).
6. Unit tests to 100% (service, repository with mocked ORM, script like `migrate.test.ts`); integration: accept, wrong e-mail, double accept in parallel, revoked, anonymous `POST /api/mentors` is 405.

## Acceptance criteria
- Given an operator-created invitation, When the invitee opens the link, Then the page shows the state and asks them to sign in, and nothing is granted yet. (R07)
- Given the invitee signed in with the invited, verified e-mail, When they explicitly accept, Then their account's single role becomes mentor, they get a draft, unpublished profile, stay signed in on the mentor home, and see a deadline of acceptance plus 14 days that does not move later. (R07, D18)
- Given a signed-in user whose verified e-mail differs, When they accept, Then it is refused, nothing changes and the invited address is not revealed. (negative)
- Given an unverified e-mail, When they accept, Then it is refused. (negative)
- Given two parallel accepts of one link, When both run, Then exactly one profile exists, the role is granted once and the other gets a conflict. (negative, concurrency)
- Given an invitee whose account holds the operator role, When they accept, Then it is refused and they are told to use a separate account with another e-mail. (D31, negative)
- Given a revoked, expired, already used or replaced (resent) link, When it is opened, Then it is inert and says which state it is in. (negative)
- Given a second invitation for an address with an unresolved one, or no beachhead tag, When the operator creates it, Then it is refused. (R16, negative)
- Given anyone not invited, When they call `POST /api/mentors` or look for a "become a mentor" screen, Then there is none. (R07, negative)

## Decisions in play
- D08 — mentors join by invitation (owner: founder A)
- D18 — one bookable session within two weeks, batches of 20 (owners: both founders)
- D24 — beachhead stacks (owner: founder A)
- D19 — the operator is the two founders; by-hand actions logged (owners: both founders)
- D31 — one role per account; a mentor account has only the mentor role (owner: founder A)

## Compatibility notes
"HTTP API routes and response envelope": removing `POST /api/mentors` needs the documented path (spec, `risk-high`, PR body note; the only in-repo caller is `admin-mentors.tsx`, changed together). "Database schema and migrations": additive, migration tested up and down, rollback plan in the PR. "Session cookie and JWT": only if claims change. "CLI": new script, additive.

## How to pick this up
`om-auto-fix-issue <issue number>` once filed; E01-S01 must have merged.

## Out of scope
Batches, counts and the report (E05-S01); a real mail transport (E01-S02 owns the mailer); the mentor page (E02-S02); password reset.

## Open questions
- What happens to a mentee account's own history when it accepts and becomes a mentor (D31 allows only one role) — non-blocking (owner: founder A).
- Q22 mentee or `student` — non-blocking (owner: founder A).
- Invitation lifetime (assumed 14 days) — non-blocking (owner: founder A).
- Where the by-hand command may run from (a founder's machine against which database) — non-blocking (owner: founders A and B).

## Unverified claims
- Whether the user model from E01-S01 exposes a verified-e-mail flag and a role-grant method.
- Whether MikroORM 7.2 expresses a partial unique index and `FOR UPDATE` in this repository's repository style.

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-high` — touches sign-in, sessions, money, data scoping or a migration (SDLC risk-high rules)

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E02-S02 — #40 A mentor fills the mentor page (public-work link, description, stack tags) and gets a share link; no ratings

**Issue:** [#40](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/40)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #30  
**Iteration:** first (D13)  

Backlog source: .ai/specs/product-brief.md
Backlog id: E02-S02
Epic: #30
Depends on: E02-S01 (#39)
Iteration: first (D13)

## Summary
- Problem: a mentor has no page. The row in `mentors` has name, e-mail and join date only, and the one public page that shows it (`packages/app/src/app/mentors/page.tsx` through `MentorCard`) prints the e-mail and lists every row. The staff engineer wants "found through their own link" and "nie wsadzajcie mnie na listę"; three mentors refuse ratings ("my GitHub is my profile", `.ai/specs/research/2026-08-22-interview-mentor.md`, `2026-09-03-interview-staff-engineer-declined-before.md`, `2026-09-03-interview-senior-python-meetups.md`). D27 adds that the text session happens in a channel the mentor names; D32 keeps its address off the public page.
- Who has it: mentors; mentees who arrive by a share link and need to judge a stranger without scores.
- Expected outcome: a mentor saves a draft, publishes when the public-work link and description are present, copies a stable `/m/<slug>` link and can unpublish and republish at the same URL; the public page shows no e-mail and no rating. Checked by the criteria below.

## Spec
Design authority: `.ai/specs/product-brief.md`. Spec owed: `.ai/specs/YYYY-MM-DD-mentor-page.md`.

## Analysis
- Exists: `mentors` table and `Mentor` service/port (`packages/core/src/services/mentors/`), `makeCrudRoute`, `CrudForm`, `DataTable`, `MentorCard` (`packages/ui/src/components/mentors/mentor-card.tsx`, takes `email`). Does not exist: slug, public-work URL, description, tags, channel, publish state, `/m/[slug]`, `STACK_TAGS`.
- `CrudForm` (`packages/ui/src/backend/forms/CrudForm.tsx`) supports only `text | email | password` string fields: a textarea and a multi-select for tags need an additive `CrudField` extension in `packages/ui` with tests.
- The public page uses Tailwind in `packages/ui/src/components/mentors/`; do not reuse `TutorCard` (stars, hourly price). Mentor-area screens use the shadcn and `ui/src/backend` primitives.
- Public-DTO allowlist: name, description, public-work URL, tags, slug. Never e-mail, `user_id`, deadline, payout fields, or the session-channel address (D32). The channel is saved on the mentor's own editor and read back only by its owner; E03-S04 shows it to the two parties of a confirmed booking.
- `GET /api/mentors` returns e-mail today; its only in-repo caller is `admin-mentors.tsx`.
- Ownership over role: every mutation resolves the profile from `session.userId`, never from a body id (AGENTS.md, no body spread into `em.create()`).

## How to implement
1. Migration (generated): on `mentors` add `slug` (unique, nullable), `public_work_url`, `description`, `stack_tags` (text[]), `session_channel`, `published_at`, all nullable.
2. Core: `STACK_TAGS` constant (typescript, react, python, ai-agents; D24, R16); schema `validators/mentors/mentor-page-update.schema.ts` (http/https URL only, plain-text description and channel with named length limits, tags subset of `STACK_TAGS`), exported via `validators/index.ts`.
3. Extend `MentorService` and `MentorRepositoryPort`: `getMine`, `saveDraft`, `publish` (needs URL and description; otherwise `ValidationError` with `fieldErrors`), `unpublish`, `getPublicBySlug` (404 when unpublished). Slug from the name, unique constraint plus retry on 23505, fixed at first publish and kept on unpublish.
4. Routes: `GET/PUT /api/mentors/me`, `POST /api/mentors/me/publish` and `/unpublish` (`requireSession` and mentor role). Make `GET /api/mentors` return the public DTO of published profiles only (no e-mail) and let `admin-mentors.tsx` show only those fields until the operator guard of E01-S03 exists; `MentorCard` loses its `email` prop.
5. Pages: editor `packages/app/src/app/(mentor)/mentor/page-editor/page.tsx` (name chosen in the spec) with a copy-link button and a clipboard fallback; public `packages/app/src/app/m/[slug]/page.tsx` (Tailwind, `force-dynamic`, says sessions are text, R03). `/mentors` stops listing mentors until E03-S01 (open question).
6. Tests to 100%; integration: publish, open `/m/<slug>` signed out in the browser, assert no e-mail, rating text or channel address, unpublish gives 404, republish returns the same URL, two parallel publishes of one name get distinct slugs.

## Acceptance criteria
- Given a mentor with an incomplete page, When they save, Then the draft is kept and nothing is public. (R04)
- Given a page with a public-work link and a description, When the mentor publishes, Then `/m/<slug>` opens for a signed-out visitor showing both. (R04, N02)
- Given a published page, When the mentor unpublishes and later republishes, Then content is kept, the URL is the same, and while unpublished it answers 404. (D21)
- Given a mentor who names the channel where sessions happen, When the page is saved, Then the channel is stored and shown back to the mentor only; a page saved without one is allowed but the mentor is not bookable. (D27, R19)
- Given a published page with a channel, When a signed-out visitor or any other account opens `/m/<slug>` or any public API response of this story, Then the channel address appears nowhere in the HTML, the data or the response. (D32, negative)
- Given a mentor with no channel, When they try to publish a slot, Then it is refused with the channel field named (checked in E02-S03). (R19, negative)
- Given tags, When the mentor selects a stack outside typescript, react, python and ai-agents, Then it is rejected. (D24, R16, negative)
- Given a page without a public-work link or description, or with a link that is not http(s), When the mentor publishes, Then it is refused with the field named. (R04, negative)
- Given any public response of this story, When inspected, Then it has no e-mail, payout, invitation or deadline field and no rating, review, score or ranking. (N02, negative)
- Given another mentor's profile, When a mentor tries to update it, Then it is impossible: the id is never taken from the request. (negative)

## Decisions in play
- N02 / R04 — no ratings; link to public work and a plain description (owner: founder A)
- D21 — share link (owner: founder A)
- D24 / R16 — four beachhead tags (owner: founder A)
- D27 / R19 — the mentor names the session channel (owner: founder A)
- D32 — the channel address is shown only to the two parties of a confirmed booking, never on the public page (owner: founder A)

## Compatibility notes
"HTTP API routes and response envelope": `GET /api/mentors` loses `email` and unpublished rows (a removal of response fields: document the path, note in PR body; in-repo caller changed in the same PR). "Shared Zod schemas": new schema, additive. "Package public exports": `MentorCard` props change; its one consumer changes together. "Database schema and migrations": additive nullable columns.

## How to pick this up
`om-auto-fix-issue <issue number>` once filed; E02-S01 first.

## Out of scope
Ratings, reviews, scores (N02); the list and tag filter (E03-S01); recording mentor-page visits (Q20); slots and prices (E02-S03, E02-S04); the home page catalogue that shows stars (E07).

## Open questions
- Show a mentor list in the first iteration or not (see epic) — non-blocking (owner: founder A).
- Q20 recording signed-in mentee visits — blocking before 2026-11-28, not for this story's filing (owners: founders A and B).

## Unverified claims
- The slug-collision behaviour under concurrency was not tried.
- That a textarea field fits `CrudForm` without breaking its tests was not checked.

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-high` — touches sign-in, sessions, money, data scoping or a migration (SDLC risk-high rules)

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E02-S03 — #41 A mentor publishes slots and sees them taken as they are booked

**Issue:** [#41](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/41)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #30  
**Iteration:** first (D13)  

Backlog source: .ai/specs/product-brief.md
Backlog id: E02-S03
Epic: #30
Depends on: E02-S01 (#39)
Iteration: first (D13)

## Summary
- Problem: D22 says mentors publish slots and a slot is bookable only when it starts at least two hours later (R14), but nothing stores availability: AGENTS.md names an `availability` concept and no file for it exists (verified: no `availability` folder under `packages/`). The mentors want control of their time ("mogę między spotkaniami", `.ai/specs/research/2026-09-03-interview-staff-engineer-declined-before.md`; "nie potrzebuję pieniędzy. potrzebuję nie tracić czasu"). The staff engineer also says she would forget the product if nobody booked her in a month, and D18 counts a published slot.
- Who has it: mentors; mentees who book them (E03-S02).
- Expected outcome: a mentor publishes single start times; a booked slot stops being offered; an unbooked one can be removed, a booked one cannot. Checked by the criteria and a concurrency test.

## Spec
Design authority: `.ai/specs/product-brief.md`. Spec owed: `.ai/specs/YYYY-MM-DD-availability-slots.md`.

## Analysis
- Does not exist: `Slot` entity, `availability` services, validators, routes, bookings (E03-S03 will own the transition that books a slot). Exists: `makeCrudRoute` (`authorize`, `remove` with `context` for `[id]`), `requireSession`, `requireRole`, `assertOwns`, `DataTable` with row `actions`, `CrudForm`.
- Slots belong to the mentor row (`mentors.id`). This story adds `mentors.last_published_availability_at` (R13's ordering key, read by E03-S01 in 1.1) because it is written here.
- A reference slip fixed here: a soft-removed slot plus a plain unique (mentor, start) would block republishing the same time; use a partial unique index on live rows. Soft delete is kept because E05-S01 counts "published a slot within two weeks" (D18) from `created_at`.
- D27: publishing is refused when the mentor has no session channel (field from E02-S02).
- Ownership is data scoping, hence `risk-high`: a mentor lists and removes only their own slots; test the wrong-owner path.
- `CrudForm` has no date-time field; extend `CrudField` additively (`datetime-local`).

## How to implement
1. Migration (generated): table `slots` (id uuid, `mentor_id` FK, `starts_at` timestamptz, `booking_id` uuid null without foreign key until E03-S03 creates `bookings`, `removed_at`, `created_at`); partial unique index (`mentor_id`, `starts_at`) where `removed_at` is null; `mentors.last_published_availability_at`. Register `SlotSchema` in `entities/index.ts` and `orm.ts`.
2. Core `services/availability/`: `slot.types.ts`, `slot-repository.port.ts`, `slot.service.ts` (`listMine`, `publish`, `remove`, `listPublicFor(mentorId, now)`), constant `MIN_BOOKING_LEAD_MINUTES = 120` (D22, R14; E03-S02 reuses it); schema `validators/availability/slot-create.schema.ts`.
3. `publish(session, input, now)`: mentor owns the target, channel present, `startsAt` at least the lead from now, then insert and set `last_published_availability_at`. `remove`: owner only; a slot with `booking_id` throws `ConflictError("This slot is booked; cancel the booking instead")`. `listPublicFor`: live, unbooked, future, page published.
4. Db repository `repositories/availability/slot.repository.ts` (23505 to `ConflictError`); container lines in `packages/app/src/server/container.ts`.
5. Routes: `packages/app/src/app/api/availability/slots/route.ts` (`makeCrudRoute`: list, create) and `.../slots/[id]/route.ts` (DELETE); page `(mentor)/mentor/slots/page.tsx` (`DataTable` with status open or booked, `CrudForm`); `/m/[slug]` lists `listPublicFor`.
6. Tests to 100%; integration: publish then see it on `/m/<slug>`; remove then republish the same time; a slot with `booking_id` set directly in the test database cannot be removed or offered; another mentor's slot cannot be removed.

## Acceptance criteria
- Given a mentor with a channel, When they publish a start time at least two hours ahead, Then it appears on their page and their last-published-availability time updates. (D22, R14, R13)
- Given a published slot, When a booking is attached to it (E03-S03), Then it is no longer offered. (D22)
- Given an unbooked slot, When the mentor removes it, Then it disappears from the page and the same time can be published again. (D22)
- Given a booked slot, When the mentor tries to remove it, Then the product refuses and points to cancellation (E03-S05; by hand under R18 until then). (R09, negative)
- Given a start time less than two hours ahead or in the past, When the mentor publishes, Then it is refused. (R14, negative)
- Given a mentor with no session channel, When they publish a slot, Then it is refused naming the channel field. (D27, R19, negative)
- Given another mentor's slot id, When a mentor removes it, Then it is forbidden. (negative)
- Given the same start time published twice in parallel, When both run, Then one slot exists and the other gets a conflict. (negative, concurrency)

## Decisions in play
- D22 — slots, bookable two hours ahead (owner: founder A)
- R14 — the two-hour rule, no speed promise in copy
- R09 — cancellation rules; the operator resolves disputes
- D27 — the channel must exist before slots are offered (owner: founder A)
- R18 — by-hand actions logged

## Compatibility notes
"Database schema and migrations": new table, partial unique index and one additive column, tested up and down. "HTTP API routes and response envelope": new routes only; the 409 `CONFLICT` and 403 `FORBIDDEN` codes from `packages/core/src/http/errors.ts` are reused. "Shared Zod schemas": new schema, additive.

## How to pick this up
`om-auto-fix-issue <issue number>` once filed; E02-S01 (and E02-S02 for the channel field) first.

## Out of scope
Booking a slot (E03-S02, E03-S03); cancellation (E03-S05); recurring availability; notifying the mentor of a booking (E03-S04).

## Open questions
- Single start times or recurring hours: the plain reading of D22 (single start times) is used — non-blocking (owner: founder A).
- Overlapping slots (a 50-minute session at 10:00 and a slot at 10:20): allowed or refused — non-blocking (owner: founder A).
- Time zone shown to mentor and mentee (only timestamptz is stored) — non-blocking (owner: founder A).

## Unverified claims
- Partial unique index syntax in MikroORM 7.2 `EntitySchema`; if unsupported, the migration carries raw SQL and the entity omits it.
- How `makeCrudRoute` passes the `[id]` param in Next.js 16 (`context.params` as a promise) was not run.

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-high` — touches sign-in, sessions, money, data scoping or a migration (SDLC risk-high rules)

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E02-S04 — #42 A mentor sets 25- and 50-minute prices within the operator's bounds

**Issue:** [#42](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/42)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #30  
**Iteration:** first (D13)  

Backlog source: .ai/specs/product-brief.md
Backlog id: E02-S04
Epic: #30
Depends on: E02-S01 (#39)
Iteration: first (D13)

## Summary
- Problem: D09 lets each mentor set a 25- and a 50-minute price within operator-set bounds, but `mentors` has no price column and the repository has no notion of bounds, so nothing can be booked at a known amount. The mentors in the interviews want to set a "high" price as a filter ("wysoko. żeby bookowali tylko poważni") or will look at others' prices first and go a little lower (`.ai/specs/research/2026-09-03-interview-staff-engineer-declined-before.md`, `2026-09-03-interview-senior-python-meetups.md`); the 23 of 54 survey answers willing to pay 25 EUR or more are stated intent only (A01).
- Who has it: mentors; mentees who see the price before paying (E03-S02).
- Expected outcome: two integer prices inside the bounds, shown on the mentor page, with the server as the only source of a price. Checked by the criteria and money-path tests.

## Spec
Design authority: `.ai/specs/product-brief.md`. Spec owed: `.ai/specs/YYYY-MM-DD-mentor-prices.md`. Money rule: price recomputed server-side from stored prices (`.ai/specs/engineering-standards.md`, "Money correctness").

## Analysis
- Does not exist: price fields, bounds, an `operator` concept, a price formatter. `packages/core/src/config/env.ts` is the only place configuration enters: a zod `envSchema` with `parseEnv` (today `NODE_ENV`, `LOG_LEVEL`, `JWT_SECRET`); the integration harness (`tests/integration/global-setup.ts`) passes only the database URL and `NODE_ENV` to the server.
- Operator screens are 1.1 (E05-S02), so bounds come from env now, read through one service so that E05-S02 changes only storage. Founders set them by hand and log it (R18, D19).
- Currency: EUR, the one platform currency (D29), a named constant in `core`, not a setting and not per profile; prices are integers in euro cents.
- `CrudForm` handles string values only; the price schema must coerce (the form passes parsed output to `onSubmit`).
- A booking's price snapshot lives on the booking (E03-S02, E03-S03); this story only guarantees that changing prices writes nothing else.

## How to implement
1. Migration (generated): on `mentors` add `price_25_cents`, `price_50_cents` (integer, nullable).
2. `config/env.ts`: optional `PRICE_MIN_25_CENTS`, `PRICE_MAX_25_CENTS`, `PRICE_MIN_50_CENTS`, `PRICE_MAX_50_CENTS`, with no invented defaults: unset means the save is refused (fail closed). Document in `.env.example` and `README.md`; add values to the harness env.
3. `services/operator/platform-settings.service.ts`: `get()` returns the bounds (currency is the EUR constant), or throws a typed `AppError` when unset. No fee field here (E03-S06 adds it).
4. Schema `validators/mentors/mentor-prices-update.schema.ts`: two positive integers (coerced from form strings). Service (extend `MentorService`): `updatePrices(session, input)` refuses a price outside the inclusive bounds with `ValidationError` carrying the bound in `fieldErrors`; `isBookable(profile)` = published, both prices set and inside bounds, and a session channel (D27); `getPriceFor(mentorId, 25 | 50)` is the only way E03 obtains a price.
5. Route `PUT /api/mentors/me/prices` (`requireSession`, mentor role, profile from the session). Page `(mentor)/mentor/prices/page.tsx` with the bounds beside each field; `/m/[slug]` shows both prices, or "not bookable yet" with no slot offered. No speed claim in copy (R14).
6. Tests to 100%: exactly min, max, min minus 1, max plus 1, zero, negative, fractional, text, unset bounds; integration: out-of-bounds save returns 400 with the bound; `getPriceFor` ignores any client value.

## Acceptance criteria
- Given operator bounds, When a mentor sets a 25-minute and a 50-minute price inside them, Then the mentor page shows both. (R08, R01)
- Given a price outside the bounds, When the mentor saves, Then the save is refused and the bound is shown. (R08, negative)
- Given a mentor with no prices (or no channel), When a visitor opens the page, Then no slot can be booked and the page says the mentor is not bookable yet. (negative)
- Given bounds that are not configured, When a mentor saves a price, Then it is refused, never accepted unbounded. (R08, negative)
- Given a mentor changing a price, When a session was already booked at the old price, Then that booking keeps its price (verified with E03-S03's test; here, no write outside the profile). (money, negative)
- Given a request body carrying a price for a booking or another mentor's id, When it reaches the server, Then it is ignored. (negative)

## Decisions in play
- D09 / R08 — mentor prices within operator bounds (owner: founder A)
- R01 — a session is 25 or 50 minutes
- D19 — the operator is the two founders (owners: both founders)
- R18 — by-hand operator actions logged
- D27 — a channel is part of being bookable
- D29 — prices, charges, fees and payouts are in EUR (owner: founder A)
- D32 — the channel address is private to the two parties of a confirmed booking (owner: founder A)

## Compatibility notes
"Environment variables and config": new optional variables, additive; later removal needs the old name kept for one release (E05-S02). "Database schema and migrations": additive nullable columns. "Shared Zod schemas": new schema. `risk-high` (money): failure and boundary tests, second reviewer, `needs-qa`.

## How to pick this up
`om-auto-fix-issue <issue number>` once filed; E02-S01 first. The values for the bounds (in EUR) must be supplied before QA.

## Out of scope
The operator screen for bounds and fee (E05-S02); the fee split (E03-S06); any currency other than EUR (D29).

## Open questions
- The initial bounds — non-blocking for filing, blocking before QA (owner: founder A).
- When the operator narrows bounds, is an existing in-bounds price that falls outside no longer bookable (proposed default, fail closed) — non-blocking (owner: founder A).

## Unverified claims
- Whether the CI integration job needs the new variables set in `.github/workflows/ci.yml` (only its first jobs were read; the harness itself is verified).

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-high` — touches sign-in, sessions, money, data scoping or a migration (SDLC risk-high rules)

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E02-S05 — #43 A mentor completes Stripe Connect onboarding and sees whether payouts are enabled

**Issue:** [#43](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/43)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #30  
**Iteration:** 1.1 (D13)  

Backlog source: .ai/specs/product-brief.md
Backlog id: E02-S05
Epic: #30
Depends on: E02-S01 (#39)
Iteration: 1.1 (D13)

## Summary
- Problem: R05 makes Stripe Connect the only payout channel, with onboarding before the first payout, but the repository has no Stripe code and no payment concept (verified: no `stripe` in any `package.json`, no `payments` folder). D13 leaves Connect to 1.1, so D28/R20 apply meanwhile: the operator pays mentors by bank transfer by hand and logs each payout. The Python mentor said "jak chcecie mój numer konta, zanim ktokolwiek mnie zabookował, to nie" and "faktury. nie" (`.ai/specs/research/2026-09-03-interview-senior-python-meetups.md`), so bank details must be asked for through Stripe's hosted flow and never before a first booking.
- Who has it: mentors who want to be paid without handing over bank details; the operator who needs to see who can be paid.
- Expected outcome: hosted onboarding started from DevMentor, a status only the mentor and the operator see, and no automated payout while onboarding is incomplete. Checked by the criteria and the money-path tests.

## Spec
Design authority: `.ai/specs/product-brief.md`. Spec owed: `.ai/specs/YYYY-MM-DD-stripe-connect-onboarding.md`; it must also state how the manual flow of D28 hands over to Connect and carry the lawyer-or-Stripe check D28 asks for before the first payout.

## Analysis
- New dependency: the official `stripe` package. Whoever lands first adds it; E03-S03 (Checkout, first iteration) probably does, so this story then only extends. If it does not, adding it means: `package.json` and `package-lock.json` changes, `npm audit` in the gate, pinning a version, and a supply-chain review. Engineering standards keep vendor SDKs out of `core`: the port (`PaymentGateway`) and a mock live in `packages/core/src/services/payments/`, the Stripe adapter in the composition root (for example `packages/app/src/server/payments/`), with `stripe` in `packages/app/package.json` only. ESLint boundaries still hold.
- New env: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (introduced with Checkout), plus an absolute base URL for the Connect return and refresh links (no `APP_URL` exists in `packages/core/src/config/env.ts`; E01-S01 may add it). Optional, failing closed at the route.
- Does not exist: `payments` services, a webhook route, a processed-event record, `stripe_account_id` columns. Exists: `apiHandler` (webhook route needs a raw body, so it answers Stripe, not the envelope, and must be documented), `requireSession`, `requireRole`.
- Data scoping: payout status is read by the owner and the operator only; the public DTO from E02-S02 never contains it.
- Unverified product facts: that the founders' Stripe platform account is Connect-enabled, which account type fits (Express is assumed), and that Connect supports the mentors' countries.

## How to implement
1. Migration (generated): on `mentors` add `stripe_account_id` (unique, nullable), `payouts_enabled` (default false), `payout_requirements` (jsonb, nullable).
2. Port (extend the `PaymentGateway` port from E03-S03): `createConnectAccount`, `createAccountLink(accountId, refreshUrl, returnUrl)`, `getAccountStatus(accountId)`; mock adapter in `core`, Stripe adapter in `app`.
3. `services/payments/connect-onboarding.service.ts`: `start(session)` (creates the account once, returns the hosted link), `refresh(session)` (reads and stores the status), `applyAccountUpdated(event)` idempotent by account and event id (reuse E03-S03's processed-event table).
4. Routes with `apiHandler`: `POST /api/payments/connect/onboard` (mentor only), `GET /api/payments/connect/return` (refresh, redirect to the payouts page), webhook route dispatches `account.updated`.
5. Pages: mentor payouts page (set up payouts, then "Payouts enabled" or what Stripe still requires); operator sees a "Payouts" column on the operator mentors list (guarded by E01-S03's operator role).
6. Payout guard for E03-S06: no automated transfer while `payouts_enabled` is false; the mentor sees what is missing. Until then R20 applies.
7. Tests to 100%: account created once, status stored, duplicate event applied once, wrong role refused; integration with the mock gateway: simulated event shows "payouts enabled" to the mentor and the operator, never to a mentee or in the public DTO.

## Acceptance criteria
- Given a mentor, When they start Connect onboarding, Then they are sent to Stripe's hosted onboarding and return to DevMentor with a status. (R05)
- Given a mentor whose onboarding is incomplete, When a payout would fall due, Then no automated payout is made and the mentor sees what is missing. (R05, negative)
- Given Stripe reporting onboarding complete, When the mentor or the operator opens the mentor's settings, Then "payouts enabled" is shown to them and to no one else. (R05; data scoping, negative)
- Given the same `account.updated` event delivered twice, When it is processed, Then the stored status changes once. (negative, idempotency)
- Given a mentor who clicks start twice, When both calls run, Then one Stripe account exists. (negative, concurrency)
- Given a mentor who has been paid by hand under R20, When they later complete onboarding, Then new payouts use Connect and the hand-paid ones stay in the operator note. (D28)

## Decisions in play
- D04 / R05 — Stripe only; Connect for payouts, onboarding before the first payout (owner: founder A)
- D28 / R20 — until Connect ships the operator pays by hand and logs it (owner: founder A)
- D13 — this story is 1.1 (owner: founder A)
- D29 — payouts are in EUR; a mentor with a bank account in another currency is part of the D28 check (owner: founder A)

## Compatibility notes
"Environment variables and config": new optional variables, failing closed. "Database schema and migrations": additive columns. "Repository ports" and "Package public exports": the payment port is extended additively. "HTTP API routes and response envelope": the webhook route is the documented exception to the envelope. `risk-high` (money, data scoping): `needs-qa`, second reviewer, no self-QA.

## How to pick this up
`om-auto-fix-issue <issue number>` once filed; E02-S01 and E03-S03 (port, webhook, `stripe`) must exist first.

## Out of scope
The fee split and transfer itself (E03-S06); the manual payout log (a by-hand operator action, D28); the lawyer-or-Stripe verification of holding funds (a founders' task, not a story).

## Open questions
- Is the manual flow of D28 permitted as designed, or does holding mentees' money need Connect or a payment institution first — blocking before the first payout, non-blocking for this story (owner: founder A; verify with a lawyer or Stripe).
- Stripe account type, supported countries and payout to a bank account in a currency other than EUR (D29) — non-blocking (owner: founder A).

## Unverified claims
- Whether `stripe` will already be a dependency when this starts.
- Stripe Connect availability, account type and countries; the legal position of D28.

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-high` — touches sign-in, sessions, money, data scoping or a migration (SDLC risk-high rules)

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E03 — #31 Booking and payment

**Issue:** [#31](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/31)  
**Labels:** feature, priority-medium, risk-high  

Backlog source: .ai/specs/product-brief.md
Backlog id: E03

## Summary
- Problem: a developer who is stuck wants "someone who has actually done this" to look at the problem and has no way to book and pay a senior (`.ai/specs/research/2026-08-20-interview-working-dev.md`: "I'd pay for speed, not for a subscription"); the current-state journey ends in "agrees a payment method: PayPal, transfer ... no clear rules" (`2026-09-02-miro-board-journey-current-state.md`). Verified in this repo: there is no booking, slot, payment, Stripe or notification code anywhere in `packages/` or `tests/` (grep for stripe, booking, slot finds nothing in source).
- Who has it: mentees who want to find, book and prepay a mentor; mentors who want booking, prepayment and cancellation rules handled for them (`2026-09-03-interview-senior-python-meetups.md`: "if someone does not show up, I want the money anyway"; `2026-09-02-interview-freelancer-react.md`: "payment before the call is fine, but I want the price first").
- Expected outcome: a mentee finds a mentor (share link now, list in 1.1), books a slot at least two hours ahead, pays through Stripe Checkout, both parties are told where and when the text session happens, and the operator can see what each paid session owes the mentor. Checked by D16 (10 paid sessions a week for two consecutive weeks by 2026-12-31) and by the booking-to-start median target (its decision id is ambiguous, Q21).

## Spec
Design authority: `.ai/specs/product-brief.md`. An umbrella implementation spec `.ai/specs/YYYY-MM-DD-bookings-payments.md` is owed before the first story is implemented (AGENTS.md requires specs for non-trivial work). It settles what is shared by the stories: the transaction boundary behind a repository port, the payment gateway port and its mock-first selection, the first domain event emitter, and how time rules are evaluated with no scheduler. Per-story specs are named in each story (`booking-flow` is shared by E03-S02 and E03-S03).

## Analysis
- Verified absent: `packages/core/src/events/` (no emitter; `BACKWARD_COMPATIBILITY.md` says "no events exist yet"), any mailer, any `User` entity, `MentorProfile`, `Slot`, a `platform-settings` service, route groups `(student)`/`(mentor)`, an operator page beyond `packages/app/src/app/admin/mentors/`. Those belong to E01 and E02 and are dependencies, not work here.
- Verified present and reused: `packages/core/src/http/apiHandler.ts` (CSRF check on every non-GET unless `{ csrf: false }`, envelope, logging), `auth.ts` (`requireSession`, `requireRole(session, role)` with a free-string role, `assertOwns(session, ownerId)`), `errors.ts` (`ValidationError` is HTTP 400), `config/env.ts` (zod env schema, today `JWT_SECRET` only), the mentors concept as the pattern (core types + port + service, db `EntitySchema` + repository, entity referenced by name, `app/src/server/container.ts` with the `Cradle` interface).
- Layering rule that shapes every story: services in `core` never touch the ORM and `core` may not import `@mikro-orm/*` (ESLint `no-restricted-imports`). Check-then-write on slots and booking status therefore runs inside a transaction opened by the `db` repository behind a port, not in the service as the reference assumed.
- AGENTS.md: payments and notifications go through a port in `core` with a mock adapter first; money is recomputed server-side; there is no queue or worker; a concurrent-case integration test is mandatory for slot and booking-status writes; 100% unit coverage.

## How to implement
Stories in dependency order (each filed on its own):
1. E03-S02 (first): pick a slot and a length at the mentor's price; pending booking behind a unique constraint.
2. E03-S03 (first): pay through Stripe Checkout; confirm exactly once from the webhook; record booking-to-start (R15) and what each paid session owes the mentor (D28, R20). The reference carries the real Stripe adapter as a separate task (E03-S03-T01); it is not drafted here.
3. E03-S04 (first): both parties are told when, how long and where (D27, R19); each role sees its sessions.
4. E03-S01 (1.1): the mentor list by stack tag.
5. E03-S05 (1.1): cancellation with the 24-hour rule, refund through the gateway.
6. E03-S06 (1.1): Stripe Connect transfer replaces the by-hand payout (D28); operator-set fee.
7. Every money story carries tests for failure, retry and idempotency paths and a second person's review (`SDLC.md`, Money gate); every story with a migration carries an up and down migration test and a rollback plan in the PR body.

## Acceptance criteria
- Given the first-iteration stories are shipped, When a mentee books and pays, Then a confirmed booking exists once, the slot is taken, both parties are told, and the operator can read the owed amount (price less 20%, in EUR) for that session. (R05, R14, R15, R19, R20)
- Given two mentees pick the same slot at the same moment, When both submit, Then exactly one booking exists. (negative)
- Given a Stripe event is delivered twice, When it is processed, Then one booking and one recorded charge exist. (negative, Money gate)
- Given any booking, payment or session-describing screen, When it renders, Then it promises nothing about how soon an answer arrives and says the session is text. (R03, R14)
- Given a mentee who is not a party to a booking, When they look for the session channel, Then it is not shown; the public mentor page never shows it. (D32, negative)
- Given the mock payment gateway is configured, When the app runs with `NODE_ENV=production` without an explicit mock opt-in, Then the app refuses to start a payment. (negative; fail closed)

## Decisions in play
- D04 / R05 — Stripe only: Checkout for sessions, Connect for payouts (owner: founder A)
- D28 / R20 — first-iteration mentors are paid by hand by the operator and logged; Q19 is closed (owner: founder A)
- D27 / R19 — the text session happens in the channel the mentor names; DevMentor tells both parties where (owner: founder A)
- D29 — prices, charges, fees and payouts are in EUR, one currency (owner: founder A)
- D30 — the amount owed to a mentor is the price less the 20% fee, recorded for every paid session in the first iteration; the automatic split and payout stay in 1.1 (owner: founder A)
- D32 — the session channel is shown only to the mentor and mentee of a confirmed booking (owner: founder A)
- D31 — one role per account (owner: founder A)
- D21 / R13 — list by stack tag or share link, no search, no ranking (owner: founder A)
- D22 / R14 / R15 — two hours ahead, no speed promise, booking-to-start recorded (owner: founder A)
- D10 / R09 — free cancellation up to 24 hours before; no automatic refunds (owner: founder A)
- D11 / R10 — 20% platform fee, operator-configurable (owner: founder A)
- D16 — 10 paid sessions a week for two consecutive weeks by 2026-12-31 (owner: founder A)
- D13 — S01, S05 and S06 are 1.1; D19 / R18 — by-hand operator actions are logged (owner: founders A and B)
- R01, R03, R08, N02 — 25 or 50 minutes; sessions are text; mentor prices within bounds; no ratings

## Compatibility notes
`BACKWARD_COMPATIBILITY.md` surfaces touched (the file lists surfaces in a table, it has no numbered sections): "HTTP API routes and response envelope" (new routes are additive; the webhook route keeps the envelope and only disables the CSRF header check), "Database schema and migrations" (new tables and columns, each with a down), "Environment variables and config" (Stripe keys and the gateway selector, optional and fail closed), "Domain events" (first events, so additive), "Repository ports" (new ports). No existing surface is broken. `risk-high` (money, migrations, data scoping), `needs-qa`, second reviewer, no self-QA.

## How to pick this up
Write the umbrella spec first, then file and pick up stories in the order above with `om-auto-fix-issue <issue number>` once filed. E03-S02 needs E02-S03, E02-S04 and E01-S01 first.

## Out of scope
Any promise of speed in copy (R14); search or ranking (R13); ratings (N02); automatic refunds (R09); a second payment provider (R05); a session screen or chat inside DevMentor (D27); mentor-initiated cancellation.

## Open questions
- Q20 — whether a signed-in mentee's mentor-page visit without booking is recorded (A04's smallest test counts how mentees arrive) — blocking before 2026-11-28 (owner: founder A with founder B)
- Q21 — which decision holds the "median booking-to-start under 48 hours in the first four weeks" target the reference attributes to D22 — non-blocking, decide before E03-S03 (owner: founder A)
- D28 says holding mentees' money and paying mentors by hand may need a different flow; verify with a lawyer or Stripe before the first payout — blocking before the first payout, not before implementation (owner: founders A and B)
- Real e-mail transport for notifications (only a logging adapter is in scope) — blocking before launch (owner: founder A; see E03-S04)

## Unverified claims
- Stripe behaviours cited in the stories (Checkout `expires_at` minimum, expiring a session, event names, idempotency keys) are recalled, not checked against current Stripe docs; no `stripe` package is in any `package.json` here.
- Whether MikroORM 7 `EntitySchema` supports a partial unique index without a hand-written SQL step was not checked.

## 📋 Stories
<!-- om-backlog: checklist, rewritten on every run -->
- [ ] #44 E03-S01 — A mentee finds a mentor in a list filtered by stack tag, ordered by most recent published availability; no search, no ranking
- [ ] #45 E03-S02 — A mentee picks a slot that starts at least two hours ahead and a 25- or 50-minute length at the mentor's price
- [ ] #46 E03-S03 — A mentee pays through Stripe Checkout; the booking is confirmed only after payment; booking-to-start is recorded
- [ ] #47 E03-S04 — The mentor and the mentee are told about a confirmed booking and each sees their upcoming sessions
- [ ] #48 E03-S05 — A mentee cancels free up to 24 hours before a session; a later cancellation forfeits the fee
- [ ] #49 E03-S06 — DevMentor keeps 20% of a paid session and the mentor's share is paid out through Stripe Connect

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-high` — touches sign-in, sessions, money, data scoping or a migration (SDLC risk-high rules)

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E03-S01 — #44 A mentee finds a mentor in a list filtered by stack tag, ordered by most recent published availability; no search, no ranking

**Issue:** [#44](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/44)  
**Labels:** feature, priority-medium, risk-medium  
**Epic:** #31  
**Iteration:** 1.1 (D13)  

Backlog source: .ai/specs/product-brief.md
Backlog id: E03-S01
Epic: #31
Depends on: E02-S02 (#40), E02-S03 (#41)
Iteration: 1.1 (D13)

## Summary
- Problem: D21 gives mentees two doors, the share link and the list by stack tag. D13 puts no list in the first iteration, so until 1.1 a mentee needs a link from the mentor. Mentees said they will not search long: "found in 20 minutes" (`.ai/specs/research/2026-09-01-interview-backend-dev-fintech.md`), "found in five minutes" (`2026-09-02-interview-platform-dev-solves-alone.md`). Only 16 of 50 listed mentors have an audience of their own (brief, A04), so links alone will not reach everyone. Code fact: `/mentors` exists but lists every `Mentor` row with its e-mail, no tags, no availability (`packages/app/src/app/mentors/page.tsx`).
- Who has it: mentees without a share link.
- Expected outcome: `/mentors` becomes the list of bookable mentors, filterable by one of the four stack tags, ordered by most recent published availability, with no search box, score, rating or featured block, and no e-mail address exposed. Checked by the acceptance criteria, unit tests and an integration test on the rendered page.

## Spec
Design authority: `.ai/specs/product-brief.md` (R13, D21). An implementation spec `.ai/specs/YYYY-MM-DD-mentor-list.md` is owed before implementing; it decides how an unknown `tag` is shown and whether a JSON route is needed.

## Analysis
- Exists today and changes here: `packages/app/src/app/mentors/page.tsx` (server component, `createRequestScope`, calls `mentorService.list()`), `packages/ui/src/components/mentors/mentor-card.tsx` (props `name`, `email`, `joinedAt`; exported from `@devmentor/ui`), `packages/core/src/services/mentors/mentor.service.ts` (`list`, `register`), `packages/app/src/app/api/mentors/route.ts` (public `makeCrudRoute`, also feeds `/admin/mentors`; leave unchanged, it must keep returning e-mail for the admin table), `tests/integration/mentors.int.test.ts` (asserts the public page shows the mentor e-mail at lines 82-88 and 107: those assertions must be rewritten).
- Does not exist yet (from E02): mentor profile with slug, stack tags, prices and `lastPublishedAvailabilityAt`; `STACK_TAGS`; the slot entity; the public mentor page `/m/<slug>`. This story reads them through a port method (for example `MentorProfileRepositoryPort.findPublished({ tag, now })`) and adds nothing to the schema, so no migration.
- Do not reuse `SearchBar`, `TutorCard` or `FEATURED_TUTORS` (`packages/ui/src/search-bar.tsx`, `tutor-card.tsx`, `packages/core/src/catalog.ts`): they come from the concept prototype and show search and ratings (R13, N02). The landing page is E07, not this story.
- Next.js: in this version `searchParams` of a page is a Promise; read `node_modules/next/dist/docs/` before writing the page (AGENTS.md).
- Q20 (recording signed-in mentee visits to a mentor page) is open; the list is where such a record would start. Nothing is recorded here until founder A decides.

## How to implement
1. Port method + `mentor-profile.service.ts#listPublished(tag, now)`: published, both prices set, at least one slot starting at or after `now + MIN_LEAD_MINUTES` (the D22 constant from E03-S02 / E02-S03) with no active booking; order by `lastPublishedAvailabilityAt` desc, ties by id; no free-text parameter exists. The repository lives in `packages/db/src/repositories/mentors/`.
2. Zod schema `packages/core/src/validators/mentors/mentor-list-query.schema.ts` (`tag` optional, `z.enum(STACK_TAGS)`), exported through `@devmentor/core/validators`; an unknown tag throws `ValidationError` (HTTP 400 here, not 422).
3. Public DTO without e-mail and internal ids: slug, display name, tags, both prices, next slot start, public-work link (R04); prices are formatted in EUR (D29); the session channel is not part of it (D32).
4. Page `packages/app/src/app/mentors/page.tsx` (`force-dynamic`): tag links (`?tag=...`), a card per mentor linking to `/m/<slug>`, an empty state, no search input. Replace `MentorCard` props in `packages/ui` (BC: update the single in-repo consumer in the same PR) and its test.
5. Tests: service (no prices, no slot, slot inside two hours, tag filter, ordering, tie), schema, page (no `searchbox` role, no rating text, no e-mail), `MentorCard`; 100% coverage. Integration test in `tests/integration/mentor-list.int.test.ts` using the seeded bookable mentor; update `mentors.int.test.ts`.

## Acceptance criteria
- Given published mentors, When a mentee opens the list, Then mentors with prices and at least one bookable slot appear, most recently published availability first. (R13)
- Given the list, When the mentee filters by a stack tag, Then only mentors carrying that tag remain. (R13)
- Given the list, When it renders, Then there is no search box, no score, no rating and no featured placement. (R13, N02, negative)
- Given a mentor with no published slot, no prices, or only a slot starting within two hours, When the list renders, Then that mentor is not listed. (R14, negative)
- Given a `tag` that is not one of the four stack tags, When the page loads, Then no mentor is filtered silently and the page says the tag is unknown. (negative)
- Given any list entry, When it is rendered or serialised, Then no e-mail address and no session channel appear. (D32, negative)

## Decisions in play
- D21 — list by stack tag or share link; no search, no ranking (owner: founder A)
- R13 — same as a rule; ordered by most recent published availability
- N02 — no ratings (owner: founder A)
- R04 — link to public work and a plain description
- R14 — a slot counts only if it is bookable (two hours ahead)
- D29 — the prices on each card are in EUR (owner: founder A)
- D32 — the card and the list never show the session channel (owner: founder A)

## Compatibility notes
`BACKWARD_COMPATIBILITY.md` "Package public exports": `MentorCard` props change, one consumer (`app`), updated in the same PR. "Shared Zod schemas": new schema is additive. "HTTP API routes and response envelope": `/api/mentors` is not changed. No migration. R13's own change path: more than 30 published mentors, or mentees unable to find a fit, reopens search.

## How to pick this up
`om-auto-fix-issue <issue number>` once filed, after E02-S02 and E02-S03 are merged and the spec above is written.

## Out of scope
Search, ranking, featured placement (R13, N02); recording page visits (Q20); changing the admin mentor table or `GET /api/mentors`; the landing page (E07).

## Open questions
- Q20 — whether a signed-in mentee's visit to a mentor page without booking is recorded — blocking before 2026-11-28, non-blocking for this story (owner: founder A with founder B)
- Which timezone the next-slot time is shown in (the viewer's, labelled) — non-blocking (owner: founder A)

## Unverified claims
- The field names `lastPublishedAvailabilityAt`, `STACK_TAGS` and the slug come from the reference's E02 stories; they do not exist yet and may be named differently when E02 lands.
- The A04 figures are taken from the brief; the mentor list files were not re-counted.

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-medium` — ordinary single-area change that ships with tests

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E03-S02 — #45 A mentee picks a slot that starts at least two hours ahead and a 25- or 50-minute length at the mentor's price

**Issue:** [#45](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/45)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #31  
**Iteration:** first (D13)  

Backlog source: .ai/specs/product-brief.md
Backlog id: E03-S02
Epic: #31
Depends on: E02-S03 (#41), E02-S04 (#42), E01-S01 (#36)
Iteration: first (D13)

## Summary
- Problem: "someone who has actually done this" looking at the problem (`.ai/specs/research/2026-08-20-interview-working-dev.md`) needs a booking step that is short ("booking under five minutes", `2026-09-01-interview-backend-dev-fintech.md`) and shows the price first (`2026-09-02-interview-freelancer-react.md`: "I want to know the price before I write anything"). D22 sets the rule: a slot is bookable only from two hours ahead, no promise of speed. Code fact: this repo has no `bookings` concept and no slot.
- Who has it: signed-in mentees on a mentor page.
- Expected outcome: a pending booking for one slot and one length at the server-computed price; refused for a slot inside two hours or already held; sign-in returns to the same slot. Checked by the acceptance criteria and a concurrency integration test.
- Risk is high, not medium as in the reference: the story adds a table and a check-then-write on shared state (`SDLC.md`: schema migrations and money-adjacent state; AGENTS.md: unique constraint plus concurrency test).

## Spec
Design authority: `.ai/specs/product-brief.md`. Implementation spec `.ai/specs/YYYY-MM-DD-booking-flow.md` (shared with E03-S03) is owed before implementing. It must decide the unique-constraint design (see Analysis) and the pending-hold length.

## Analysis
- New concept `bookings` (verified: no folder exists): `packages/db/src/entities/bookings/booking.entity.ts` (MikroORM `EntitySchema`, no decorators, referenced by name, registered in `entities/index.ts`, `orm.ts` `entities: [...]` and the `db` index), type `packages/core/src/services/bookings/booking.types.ts`, port `booking-repository.port.ts`, service `booking.service.ts`, repository `packages/db/src/repositories/bookings/booking.repository.ts`, schema `packages/core/src/validators/bookings/booking-create.schema.ts`, route `packages/app/src/app/api/bookings/route.ts`, one explicit line each in `Cradle` and `createRequestScope` in `packages/app/src/server/container.ts`.
- Transaction: `core` cannot import the ORM, so the repository port exposes a transaction wrapper (`runInTransaction(work)` giving a transaction-scoped port with `findSlotForUpdate`) that the `db` implementation backs with `em.transactional` and a row lock; the service keeps the rules (lead time, price, bookable mentor). The 23505 unique violation is translated to `ConflictError` in the repository, as `createMentorRepository` already does.
- Constraint design (the reference's "booking.slot 1:1 unique" is wrong): a unique `slot_id` would let an expired or cancelled booking block that slot forever. Use a unique index on `slot_id` limited to active statuses (`pending`, `confirmed`) or a claim column on the slot; whether MikroORM 7 expresses a partial index without hand-written SQL is not verified, and AGENTS.md forbids hand-edited schema, so the spec resolves it.
- Time with no scheduler: a pending booking holds the slot until `expiresAt`. Nothing runs a job. A stale pending booking is treated as free where it matters: the slot listing from E02-S03 must exclude only unexpired pending bookings (this story extends that query), and `start` first marks a stale pending booking on the slot `expired` inside the same transaction. E03-S03 extends the expiry with the gateway.
- Auth: `requireSession`, `requireRole(session, <mentee role>)` (the role name is E01's, Q22; the code has no `student` literal today), CSRF comes free from `apiHandler`. Price is never read from the request.
- R03: D27 removed the session screen, so the "sessions are text" notice goes on the screens that exist: mentor page and booking step. Component `packages/ui/src/components/bookings/session-is-text-notice.tsx` (file names in `components/` are kebab-case, as in `mentor-card.tsx`).

## How to implement
1. Entity `Booking` (id uuid, slot, mentee user id, mentor profile, `lengthMinutes`, `priceCents`, `currency` (always EUR, D29, from one named constant), `status` pending | confirmed | cancelled | expired, `startsAt` copied from the slot, `bookedAt` nullable, `expiresAt`, `createdAt`) and the active-status uniqueness above; generate the migration with `npm run migration:create -w @devmentor/db` (both snapshots in `packages/db/migrations`), test `up` then `down`, rollback plan in the PR body.
2. Schema `bookingCreateSchema`: `slotId` uuid, `lengthMinutes` 25 or 50 (R01), exported via `@devmentor/core/validators`.
3. `booking.service.ts#start(session, input, now)` inside the transaction: slot exists and not removed; `startsAt - now >= MIN_LEAD_MINUTES` (120, D22, with the why); mentor bookable (E02-S04); stale pending expired; no active booking (`ConflictError`); `priceCents` from the mentor's stored price for the length; create `pending`, `expiresAt = now + hold` (named constant).
4. Route `POST /api/bookings` via `apiHandler`, returns the booking DTO.
5. Public mentor page `/m/<slug>` (E02-S02): colocated slot picker client component using `apiCall`; slots inside two hours shown disabled with the reason; price for the chosen length shown before paying; signed out goes to sign-in with a `returnTo` to the same slot (E01).
6. Tests (100%): lead time at the boundary, taken slot, expired pending reclaimed, unbookable mentor, wrong length, price from the stored value, role denied. Integration `tests/integration/booking.int.test.ts`: two concurrent `POST /api/bookings` on one slot give one 201 and one 409. The integration environment needs `JWT_SECRET` in `tests/integration/global-setup.ts` (not set today) to sign session cookies.

## Acceptance criteria
- Given a mentor page with slots, When a signed-in mentee picks a slot starting at least two hours from now, Then they choose 25 or 50 minutes and see the mentor's price for that length in EUR before paying. (R14, R01, R08, D29)
- Given a slot starting in less than two hours, When the mentee tries to pick it, Then it is not bookable and the screen says why. (R14, negative)
- Given a signed-out visitor, When they pick a slot, Then they are asked to sign in and return to the same slot; a direct API call without a session answers 401. (R06, negative)
- Given any booking screen, When it renders, Then it promises nothing about how soon an answer arrives and says the session is text. (R14, R03)
- Given a slot held or booked by another mentee, When a second mentee tries it, Then the pick is refused, also when both submit at once. (negative)
- Given a pending booking past its `expiresAt` and never paid, When another mentee picks the slot, Then the slot is available again. (negative)
- Given a client-supplied price or status in the request body, When the booking is created, Then it is ignored and the server price applies. (R08, negative)

## Decisions in play
- D22 / R14 — two hours ahead; no speed promise (owner: founder A)
- D29 — prices and charges are in EUR, one currency (owner: founder A)
- D31 — one role per account; the mentee role check is exact (owner: founder A)
- R01 — 25 or 50 minutes; R08 — mentor's own prices within bounds
- R03 / D27 — sessions are text; said on the screens that exist
- R06 — GitHub sign-in first, e-mail fallback

## Compatibility notes
"Database schema and migrations": new table, new migration with `down`; "HTTP API routes and response envelope": new route, 409 `CONFLICT` reused; "Repository ports": new port; "Package public exports": new exports. Down on a table holding bookings destroys them: state the rollback plan. `needs-qa`, second reviewer.

## How to pick this up
`om-auto-fix-issue <issue number>` once filed, after the booking-flow spec is written and E02-S03, E02-S04, E01-S01 are merged.

## Out of scope
Payment and confirmation (E03-S03); the list (E03-S01); cancellation (E03-S05); notifications (E03-S04).

## Open questions
- Pending-hold length (30 minutes is the plain choice; it must be compatible with the Checkout expiry set in E03-S03) — non-blocking (owner: founder A)
- Timezone shown in the slot picker (the viewer's, labelled) — non-blocking (owner: founder A)

## Unverified claims
- MikroORM 7 partial unique index support and pessimistic locking API names were not checked.
- `Slot`, `isBookable`, `returnTo` and the mentor page `/m/<slug>` come from E02/E01 stories and do not exist yet.

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-high` — touches sign-in, sessions, money, data scoping or a migration (SDLC risk-high rules)

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E03-S03 — #46 A mentee pays through Stripe Checkout; the booking is confirmed only after payment; booking-to-start is recorded

**Issue:** [#46](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/46)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #31  
**Iteration:** first (D13)  

Backlog source: .ai/specs/product-brief.md
Backlog id: E03-S03
Epic: #31
Depends on: E03-S02 (#45)
Iteration: first (D13)

## Summary
- Problem: D04 and R05 make Stripe Checkout the only way a session is paid. Without it the pending booking from E03-S02 never becomes a session and D16 (paid sessions per week) cannot be counted. Mentors want prepayment ("that is what prepayment is for, no?", `.ai/specs/research/2026-09-03-interview-senior-python-meetups.md`) and the mentee wants to pay before the call (`2026-09-02-interview-freelancer-react.md`). Code fact: no payment port, Stripe package, webhook route or Stripe env variable exists; `packages/core/src/config/env.ts` knows only `JWT_SECRET`.
- Who has it: mentees paying; mentors whose slot is taken; the operator paying mentors by hand (D28) and reading D16 and the booking-to-start median.
- Expected outcome: a Checkout session per pending booking, confirmation exactly once from the verified webhook, the slot taken, `bookedAt` and `startsAt` stored (R15), an abandoned Checkout leaving the slot free, and a record of what each paid session owes its mentor so the operator can pay by bank transfer (D28, R20). Checked by the acceptance criteria and the money-gate tests.

## Spec
Design authority: `.ai/specs/product-brief.md`. `.ai/specs/YYYY-MM-DD-booking-flow.md` (shared with E03-S02) is owed; it covers the gateway port, adapter selection, the event emitter and the idempotency design.

## Analysis
- New concept `payments` (verified absent): port `packages/core/src/services/payments/payment-gateway.port.ts`, `adapters/mock-payment-gateway.ts`, `payment.service.ts`; entity `packages/db/src/entities/payments/processed-webhook-event.entity.ts` and its repository; route `packages/app/src/app/api/payments/webhook/route.ts`; extra `Booking` columns from E03-S02. The real Stripe adapter is a separate task in the reference (E03-S03-T01). It needs a new `stripe` dependency; where it lives (core adapters folder per the standards' naming table, or the composition root, since the standards also say core stays free of vendor SDKs) is for the spec.
- Gateway selection fails closed: add `PAYMENT_GATEWAY` (`mock` | `stripe`) plus `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` to the zod schema in `config/env.ts`; the container (`packages/app/src/server/container.ts`) refuses the mock in `NODE_ENV=production` unless `PAYMENT_GATEWAY=mock` is set explicitly. Integration tests run with `NODE_ENV=production` (`tests/integration/global-setup.ts`), so they set it explicitly.
- Webhook route: `apiHandler(handler, { csrf: false })` (the Stripe call carries no `x-devmentor-csrf` header; the signature is the control), raw body via `await request.text()`, verification through the port. It can keep the envelope (Stripe reads only the status), so no contract exception is needed. Dynamic route params are a Promise in this Next.js version.
- Idempotency: insert the event id (unique) and change the booking in one transaction opened in the repository; a duplicate event is a no-op, a rollback also removes the event row so Stripe's retry reprocesses. Unique `stripeCheckoutSessionId` on the booking. Checkout creation uses the booking id as idempotency key so a double click makes one session.
- No scheduler: the abandoned Checkout is handled by Stripe's `checkout.session.expired` event (marks the pending booking `expired`) plus the lazy expiry of E03-S02, which here asks the gateway to expire the session first and treats an already-paid session as confirmed, so a late payment cannot meet a re-sold slot.
- First domain event: `packages/core/src/events/` does not exist; this story adds the typed emitter and `bookings.booking.confirmed` (`concept.entity.action`), registered on the `Cradle`, in-process only.
- D28: money lands on DevMentor's own Stripe balance and mentors are paid by hand. The booking stores `amountPaidCents`, `currency`, `paidAt`, `stripePaymentIntentId`, and an owed snapshot (`feePercentApplied`, `platformFeeCents`, `mentorShareCents`, computed once by a pure `computeFeeSplit` with the R10 default of 20% as a named constant, D30). Currency is EUR only (D29): the charge, the amount check and the owed record use one `PLATFORM_CURRENCY` constant. E03-S06 reuses the snapshot.

## How to implement
1. Port `createCheckoutSession({ bookingId, amountCents, currency, successUrl, cancelUrl, expiresAt })`, `parseWebhookEvent(rawBody, signature)`, `expireCheckoutSession(id)`; mock adapter with a fixed test signature; no `refund` here (E03-S05 adds it).
2. Migration `payments`: `processed_webhook_events` (event id unique, type, received at) and the booking columns; generated, tested `up` and `down`, rollback plan in the PR body.
3. `payment.service.ts#startCheckout(session, bookingId, now)` (`assertOwns` on the mentee; pending and unexpired only) and `confirmFromWebhook(event, now)`: amount and currency must equal the booking's, else status `payment_review` and no confirmation (R08); not confirmed when the slot was lost, same status; otherwise `confirmed`, `bookedAt = now` (R15), snapshot columns, emit the event after commit.
4. Routes `POST /api/bookings/[id]/checkout` (mentee only) and the webhook; `success_url` to the mentee's sessions page (E03-S04), `cancel_url` to the mentor page.
5. Env, `.env.example`, README table, `tests/integration/global-setup.ts` (`JWT_SECRET`, `PAYMENT_GATEWAY=mock`).
6. Operator read-only page (for example `packages/app/src/app/admin/paid-sessions/page.tsx`), guarded by the operator role from E01 (admin pages are public today, a known gap; money data must not ship unguarded): paid sessions with mentor, start, amount paid and owed, plus the D16 weekly count and median booking-to-start. Until E01 lands this step waits.
7. Tests (100%): bad signature 400, mismatched amount, same event twice, abandoned Checkout frees the slot, late payment on a lost slot, double click one session. Integration with the mock gateway: book, post a signed mock event, see the confirmed booking.

## Acceptance criteria
- Given a picked slot and length, When the mentee pays in Stripe Checkout, Then the booking becomes confirmed, the slot is taken and both parties can see the booking. (R05)
- Given a Checkout the mentee abandons, When the hold ends, Then no confirmed booking exists and the slot is free again. (negative)
- Given a Stripe confirmation delivered twice, When it is processed, Then one booking and one recorded charge exist. (idempotency, Money gate)
- Given a confirmed booking, When it is stored, Then it holds the booked-at time and the slot's start so booking-to-start can be read. (R15)
- Given the amount charged, When compared with the mentor's price for the chosen length, Then they are equal; a mismatch is not confirmed and is flagged for the operator. (R08, negative)
- Given a webhook with a missing or invalid signature, When it arrives, Then it answers 400 and changes nothing. (negative)
- Given a payment that arrives after the hold ended and the slot was taken, When it is processed, Then no second booking is created and the payment is flagged for a by-hand refund by the operator. (R09, R18, negative)
- Given a confirmed booking, When the operator opens the paid-sessions page, Then the mentor, amount owed (price less 20%, EUR) are listed (D28, D30, R20); an unconfirmed booking is not listed. (negative)
- Given a confirmed booking, When paid sessions are counted for D16, Then it counts once. (D16; booking week or start week is undecided)
- Given `NODE_ENV=production` and no explicit `PAYMENT_GATEWAY`, When a Checkout is started, Then it fails and no mock payment is accepted. (negative)

## Decisions in play
- D04 / R05 — Stripe only (owner: founder A)
- D29 — prices, charges, fees and payouts are in EUR; the charge currency is one named constant (owner: founder A)
- D30 — the amount owed to a mentor is the price less the 20% fee (D11), recorded for every paid session; the automatic split and payout stay in 1.1 (owner: founder A)
- D28 / R20 — mentors paid by hand; the session records what is owed (owner: founder A); R18 — by-hand actions logged
- R15 — booking-to-start recorded; R08 — mentor's price; R10 — 20% fee; D16 (owner: founder A)

## Compatibility notes
"Environment variables and config": three optional variables, fail closed. "Database schema and migrations": new table and columns. "Domain events": first event (additive). "HTTP API routes and response envelope": new routes; the webhook keeps the envelope. `risk-high` (money), `needs-qa`, second reviewer, no self-QA.

## How to pick this up
`om-auto-fix-issue <issue number>` once filed, after E03-S02 is merged and the spec is written.

## Out of scope
Refunds (E03-S05); Connect transfers and operator-set fee (E03-S06); notifications (E03-S04); the real Stripe adapter if filed as its own task.

## Open questions
- Q21 — which decision holds the 48-hour median target — non-blocking, decide before this story (owner: founder A)
- D28: verify holding mentees' money and paying by hand with a lawyer or Stripe before the first payout — blocking before the first payout (owner: founders A and B)
- D16: which week a paid session counts in — non-blocking (owner: founder A)

## Unverified claims
- Stripe: event names, `expires_at` minimum (recalled as 30 minutes), session expiry API and idempotency-key behaviour are not checked; no Stripe package is installed.
- Whether MikroORM transaction and lock helpers fit the port design was not prototyped.

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-high` — touches sign-in, sessions, money, data scoping or a migration (SDLC risk-high rules)

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E03-S04 — #47 The mentor and the mentee are told about a confirmed booking and each sees their upcoming sessions

**Issue:** [#47](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/47)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #31  
**Iteration:** first (D13)  

Backlog source: .ai/specs/product-brief.md
Backlog id: E03-S04
Epic: #31
Depends on: E03-S03 (#46)
Iteration: first (D13)

## Summary
- Problem: after payment both parties must know a session exists, when it starts and where it happens. D27 moved the text exchange out of the product into a channel the mentor names, so the confirmation is now the only place a mentee learns where to go. A mentor often answers "between meetings" (`.ai/specs/research/2026-09-03-interview-staff-engineer-declined-before.md`) and so needs to be told; nothing in the brief or the decisions names how, so the channel (in the product plus e-mail) is an assumption. Code fact: no notification, mailer, sessions list or event subscriber exists in this repo.
- Who has it: mentors (a booking arrives while they are away); mentees (a place to find the session and its channel).
- Expected outcome: on confirmation each party gets an in-product notification and an e-mail with start, length, the other party's display name and the mentor's channel; each role has a sessions list scoped to the caller. Checked by the acceptance criteria and an isolation test.
- Risk is high, not medium as in the reference: new table plus per-user data scoping, which `SDLC.md` requires an isolation test for.

## Spec
Design authority: `.ai/specs/product-brief.md` (R19, D27). Implementation spec `.ai/specs/YYYY-MM-DD-booking-notifications.md` is owed before implementing.

## Analysis
- Depends on what E03-S03 adds: `packages/core/src/events/` (typed emitter, created there) and `bookings.booking.confirmed`. Subscribers must be registered in `buildRootContainer` of `packages/app/src/server/container.ts`; because the `EntityManager` is forked per request, each handler opens its own scope through `withScope` instead of reusing the webhook request's `em`.
- In-process only (AGENTS.md: no queue or worker): a failing handler is logged with the shared logger and swallowed, and a crash between commit and handler loses the e-mail. The durable record is the booking itself, so the sessions lists are built from bookings, not from notifications, and the in-product notification is a convenience.
- Mailer: no `mailer.port.ts` exists. The reference expects E01-S02 to create it; whichever story lands first creates `packages/core/src/services/notifications/mailer.port.ts` and a logging adapter `adapters/log-mailer.ts`. A real transport is not in this story.
- The mentor's channel (D27, R19) is a field on the mentor profile owned by an E02 story (D32: not shown on the public mentor page); it does not exist yet. This story reads it live, only for the two parties of a confirmed booking, so a changed channel shows in the lists, and the e-mail carries the value at send time. Render it as text, or as a link only for `https:` URLs with `rel="noopener noreferrer"`; the E02 field must validate the same.
- Lists: `listForMentee(session)` and `listForMentor(session)` in `packages/core/src/services/bookings/booking.service.ts` (E03-S02 creates the file) with the filter in the repository; the caller's id comes from `requireSession`, never from a request parameter. Neither `(student)/` nor `(mentor)/` route groups exist; pages follow the `admin/mentors/` shape (server `page.tsx` plus a client component using `apiCall` and `DataTable`).
- R03: no session screen exists, so the sessions lists and the confirmation say "sessions are text" using the notice from E03-S02.

## How to implement
1. Entity `Notification` (`packages/db/src/entities/notifications/notification.entity.ts`: user id, `kind` `booking_confirmed`, booking, `readAt` nullable) with repository, port and migration `notifications` (generated, `up` and `down` tested, rollback plan in the PR body).
2. `notification.service.ts#onBookingConfirmed(bookingId)`: loads the booking, writes one notification per party, sends one e-mail per party through the mailer port with start, length, counterpart name and the channel. Registered in the container and subscribed to `bookings.booking.confirmed`; nothing subscribes to pending or expired bookings.
3. `GET /api/bookings` (`apiHandler`; mentee role calls `listForMentee`, mentor role `listForMentor`, any other role 403) and `GET`/`POST /api/notifications` (mine; mark read, ownership via `assertOwns`).
4. Pages: mentee sessions page and mentor sessions page with upcoming and past sections, start, length, counterpart, status and channel; `?booked=<id>` banner after Checkout (the Checkout `success_url` of E03-S03).
5. Tests (100%): subscriber fires once per confirmed event and not for pending; list scoping with two mentors and two mentees; mailer failure is logged, notification still written; channel rendering (text, `https:` link, `javascript:` refused). Integration `tests/integration/sessions-list.int.test.ts`: mentor A's list never contains mentor B's booking, mentee A never sees mentee B's.

## Acceptance criteria
- Given a confirmed booking, When it is created, Then the mentor is told in the product and by e-mail with start, length and the mentee's name, and the mentee is told the same with the mentor's name and the channel where the text session happens. (R19, D27; the channel for notifying is an assumption)
- Given a mentee, When they open their sessions, Then upcoming and past sessions are listed with start, length, mentor, status and channel. (R19)
- Given a mentor, When they open their sessions, Then only sessions booked with them appear. (data scoping, negative)
- Given a mentee, When they request the mentor sessions list or another user's list, Then the answer is 403 or the caller's own data only. (negative)
- Given a booking that is not confirmed, or a user who is neither its mentee nor its mentor, When the channel would be shown, Then it is not shown or sent, and the public mentor page never shows it. (D32, negative)
- Given a booking that was never confirmed, When notifications run, Then none is sent. (negative)
- Given the mail transport fails, When a booking is confirmed, Then the confirmation stands, the failure is logged without addresses or tokens, and the notification row exists. (negative)
- Given any sessions screen, When it renders, Then it says the session is text and promises nothing about speed. (R03, R14)

## Decisions in play
- D27 / R19 — the text session happens in the channel the mentor names; DevMentor tells both parties where (owner: founder A)
- D32 — the channel is shown only to the mentor and mentee of a confirmed booking, never on the public mentor page (owner: founder A)
- D31 — one role per account, so the list a caller gets follows their single role (owner: founder A)
- R03 — sessions are text; R15 / D22 — the start shown is the slot's start (owner: founder A)

## Compatibility notes
"Database schema and migrations": new table. "HTTP API routes and response envelope": `GET /api/bookings` is new and shares the path with the POST from E03-S02 (additive). "Domain events": subscribing to an existing event is additive. "Repository ports": new ports. `needs-qa`, second reviewer for the scoping.

## How to pick this up
`om-auto-fix-issue <issue number>` once filed, after E03-S03 is merged, the mentor-channel field exists, and the spec is written.

## Out of scope
Reminders before the start; cancellation notices (E03-S05); a real mail transport; a session screen or chat (D27); calendar invites.

## Open questions
- Real e-mail transport and sender address before launch (a logging mailer tells nobody) — blocking before launch, non-blocking for implementation (owner: founder A)
- Snapshot the channel on the booking at confirmation or read it live (live is drafted) — non-blocking (owner: founder A)
- Whether a mentor wants a calendar invite — non-blocking (owner: founder A)

## Unverified claims
- The mentor channel field and the mailer port are assumed to arrive from E02 and E01; neither is in the repo.
- Cradle and subscriber wiring in `buildRootContainer` was not prototyped.

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-high` — touches sign-in, sessions, money, data scoping or a migration (SDLC risk-high rules)

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E03-S05 — #48 A mentee cancels free up to 24 hours before a session; a later cancellation forfeits the fee

**Issue:** [#48](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/48)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #31  
**Iteration:** 1.1 (D13)  

Backlog source: .ai/specs/product-brief.md
Backlog id: E03-S05
Epic: #31
Depends on: E03-S03 (#46)
Iteration: 1.1 (D13)

## Summary
- Problem: D10 sets the cancellation window and R09 forbids automatic refunds for disputes. D13 leaves cancellation to 1.1, so until this ships the operator cancels and refunds by hand in the Stripe dashboard and logs it (R18). Two interviews pull in opposite directions: the freelancer wants "a refund the same day, not a ticket" when the mentor does not come (`.ai/specs/research/2026-09-02-interview-freelancer-react.md`), a mentor wants the money kept when someone does not show up (`2026-09-03-interview-senior-python-meetups.md`). Whether mentees accept forfeiting is untested (A05). Code fact: no cancel route, refund method or cancelled status exists.
- Who has it: mentees who cannot make a session; mentors whose slot should reopen.
- Expected outcome: a cancellation that frees the slot, refunds in full when at least 24 hours remain, refunds nothing afterwards, is refused once the session started, and is visible to the mentor with its refund state. Checked by the acceptance criteria and money-path tests.

## Spec
Design authority: `.ai/specs/product-brief.md` (R09, D10). Implementation spec `.ai/specs/YYYY-MM-DD-cancellation.md` is owed before implementing.

## Analysis
- Extends E03-S02/S03 files that do not exist yet: `booking.service.ts`, the `Booking` schema (status gains use of `cancelled`; add `cancelledAt`, `refundStatus` none | pending | refunded | failed, `stripeRefundId`), the payment gateway port (this story adds `refund`, not E03-S03), the webhook route (`charge.refunded` branch, same processed-event table).
- The 24-hour rule needs no scheduler: it is evaluated at the moment the cancel request is processed, with the server clock, `startsAt - now >= FREE_CANCELLATION_HOURS` (24, D10; exactly 24 hours counts as free). Nothing fires at the deadline. Because the mentee's screen may be stale, the request carries the outcome the mentee saw (`refund` or `forfeit`); if the server's result differs it answers `ConflictError` and the mentee confirms again, so nobody loses money unseen.
- Slot release: with the active-status uniqueness from E03-S02, setting `cancelled` frees the slot; nothing is cleared on the slot. It reopens only if still bookable under R14.
- Refund runs after the transaction: write `cancelled` and `refundStatus = pending` in a transaction opened by the repository, then call the gateway with the booking id as idempotency key, then set `refunded` or `failed`. With no worker, a crash leaves `pending` and a failure leaves `failed`; both are shown to the operator, who retries from the booking (idempotent key) or refunds by hand and logs it (R18); the `charge.refunded` webhook reconciles either to `refunded`.
- Owed list (E03-S03, D28): a refunded booking must drop out of the operator's owed-to-mentor list. What a forfeited (late) cancellation owes the mentor is open.
- Route `POST /api/bookings/[id]/cancel` (params are a Promise in this Next.js), `apiHandler`, `requireSession`, mentee role, `assertOwns(session, booking.menteeId)` (the helper is `assertOwns`, not `assertOwnership`); `bookings.booking.cancelled` event; the mentor is told through E03-S04's notification service. Migration is generated.

## How to implement
1. Migration `booking-cancellation` (three columns, generated, `up`/`down` tested, rollback plan in the PR body).
2. Port `refund({ paymentIntentId, amountCents, idempotencyKey })`; mock adapter; the Stripe adapter follows the real-adapter task of E03-S03.
3. `booking.service.ts#cancelByMentee(session, input, now)`: ownership, status must be `confirmed`, `startsAt > now` else `ConflictError` pointing to a quality dispute (E05-S03), compute free or forfeit, compare with the outcome the mentee saw, transaction, refund after commit, emit the event.
4. Webhook branch `charge.refunded`, idempotent.
5. UI: row action on the mentee's sessions page with a confirmation that states the rule and the result ("free, full refund" or "less than 24 hours: no refund") before confirming (R09); the mentor's page shows `cancelled` and the refund state.
6. Tests (100%): boundary at exactly 24 hours and one second either side, stale outcome refused, refund failure leaves `failed` and the booking cancelled, same idempotency key on retry, started session refused, another mentee's booking 403, owed list excludes the refunded booking. Integration with the mock gateway on both sides of the window; concurrent double cancel gives one refund.

## Acceptance criteria
- Given a confirmed booking at least 24 hours before its start, When the mentee cancels, Then the slot is freed and the full amount is refunded through Stripe. (R09, R05)
- Given a confirmed booking less than 24 hours before its start, When the mentee cancels, Then the slot is freed and no refund is made, and the confirmation screen said so first. (R09)
- Given the mentee saw "free" and the window passed before they confirmed, When they confirm, Then nothing is cancelled and they are shown the new outcome. (R09, negative)
- Given a cancelled booking, When the mentor opens their sessions, Then it shows as cancelled with its refund state. (R09)
- Given a session that already started, When the mentee tries to cancel, Then the product refuses and points to a quality dispute. (R09, negative)
- Given another mentee's booking, When someone tries to cancel it, Then 403. (negative)
- Given the same cancel submitted twice, When both are processed, Then one cancellation and at most one refund exist. (idempotency, negative)

## Decisions in play
- D10 / R09 — free up to 24 hours before; later forfeits the fee; disputes by the operator; no automatic refunds (owner: founder A)
- D30 — owed to the mentor is the price less 20%; what a forfeited booking owes is not decided (owner: founder A)
- D29 — refunds are in EUR, one currency (owner: founder A)
- R05 — refunds through Stripe; D28 / R20 — payouts by hand until Connect; R18 — by-hand actions logged

## Compatibility notes
"Database schema and migrations": additive nullable columns. "Domain events": new `bookings.booking.cancelled`. "HTTP API routes and response envelope": new route. "Repository ports" and the gateway port: additive method. Until this ships, refunds are by hand and logged (R18). `needs-qa`, second reviewer.

## How to pick this up
`om-auto-fix-issue <issue number>` once filed, after E03-S03 and its Stripe adapter are merged and the spec is written.

## Out of scope
Mentor-initiated cancellation; disputes (E05-S03); fee reversal (E03-S06 takes no fee on a refunded session); rescheduling.

## Open questions
- What happens when the mentor cancels or does not come (D10 is silent; A05 and the freelancer interview point at it) — non-blocking (owner: founder A)
- Does a late-cancelled (forfeited) booking pay the mentor, and is the platform fee taken? D10 only says the fee is forfeited — blocking before implementation (owner: founder A)
- Operator retry of `pending` or `failed` refunds: by hand only, or a button — non-blocking (owner: founder A)

## Unverified claims
- Stripe refund idempotency, `charge.refunded` event name and refund API shape were not checked against Stripe docs.
- Whether the 24-hour boundary is inclusive is the reference's choice (`>=`); D10 does not state it.

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-high` — touches sign-in, sessions, money, data scoping or a migration (SDLC risk-high rules)

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E03-S06 — #49 DevMentor keeps 20% of a paid session and the mentor's share is paid out through Stripe Connect

**Issue:** [#49](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/49)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #31  
**Iteration:** 1.1 (D13)  

Backlog source: .ai/specs/product-brief.md
Backlog id: E03-S06
Epic: #31
Depends on: E03-S03 (#46), E02-S05 (#43)
Iteration: 1.1 (D13)

## Summary
- Problem: R10 sets the fee and R05 the payout channel. In the first iteration the operator pays mentors by bank transfer by hand and logs it (D28, R20, which closed Q19). That is manual work and a money-flow risk that D28 itself says to verify with a lawyer or Stripe. Mentors will not hand over bank details before the first booking (`.ai/specs/research/2026-09-03-interview-senior-python-meetups.md`), which fits paying after the session through Connect. Code fact: no transfer method, payout entity or Connect field exists in this repo.
- Who has it: mentors waiting to be paid; the operator reconciling by hand.
- Expected outcome: after a session ends, the mentor's share is transferred through Stripe Connect and nothing else; mentors without finished onboarding are held and told; the fee is the one in force at booking; a refunded session takes no fee and pays nothing; sessions already paid by hand are never paid twice. Checked by the acceptance criteria and money-gate tests.

## Spec
Design authority: `.ai/specs/product-brief.md` (R05, R10, R20). Implementation spec `.ai/specs/YYYY-MM-DD-fee-split-and-payouts.md` is owed before implementing; it must choose between separate transfers after the session and destination charges at Checkout. Destination charges would need onboarding before any booking, which contradicts R05's "before the first payout" and the mentors' "no bank details before the first booking"; separate transfers is the drafted default.

## Analysis
- Already done in E03-S03 under D28: the owed snapshot on the booking (`feePercentApplied`, `platformFeeCents`, `mentorShareCents`) and the pure `computeFeeSplit`. This story reads them, does not recompute, and changes only how the fee is chosen: from the operator setting (E02-S04 `platform-settings.service.ts`, env-backed until E05-S02; neither exists yet) instead of the named 20% constant, for bookings confirmed after the change.
- New: `Payout` entity (`packages/db/src/entities/payments/payout.entity.ts`: booking unique, mentor profile, `amountCents`, `status` held | pending | transferred | failed | manual, `stripeTransferId`, `heldReason`), repository, port, `packages/core/src/services/payments/payout.service.ts`; gateway port method `transfer({ amountCents, currency, destinationAccountId, idempotencyKey, transferGroup })`; mentor Connect fields `stripeAccountId` and `payoutsEnabled` come from E02-S05 and do not exist yet.
- No scheduler (AGENTS.md): payouts run when the operator triggers `runDue(now)`: confirmed, uncancelled, unrefunded bookings with `startsAt + lengthMinutes <= now` and no payout row. Safe to press twice: a payout row with the booking unique is inserted and committed first, the transfer uses the payout id as idempotency key, then the row is marked `transferred`; a crash leaves `pending`, which the next run resumes with the same key. Two operators pressing at once are covered by the unique row and need the concurrency integration test AGENTS.md requires.
- Trigger: `POST /api/operator/payouts/run` (operator only, role from E01) and a button on an operator page next to the E03-S03 paid-sessions page. The reference's `scripts/payouts-run.ts` is dropped: `tsx` is only a `db` dev dependency, `no-console` is lint-enforced outside `db/src/scripts`, and a root script would also be a CLI surface.
- Cutover from by-hand payouts: sessions confirmed before this ships were paid (or are owed) by hand per the operator note, which the product cannot read. The migration or an operator action marks bookings up to a cutover date the operator names as `manual`, and `runDue` skips them.

## How to implement
1. Migration `payouts` (new table, generated, `up`/`down` tested, rollback plan in the PR body; note that `down` drops payout history).
2. Gateway port `transfer` and its mock adapter; the Stripe call follows the real-adapter task of E03-S03.
3. `payout.service.ts#runDue(now)` and `listForMentor(session)` (scoped by `requireSession`, never a client id): `payoutsEnabled` gives a transfer, otherwise `held` with `heldReason = connect_onboarding_incomplete` and a notification to the mentor through E03-S04's service; failures become `failed` and are retried by the next run.
4. Operator route and button; a mentor payouts page (E02-S05 owns the Connect screen) listing per-session share and status.
5. Fee choice from the operator setting for later bookings; earlier snapshots are never rewritten.
6. Tests (100%): rounding at half a cent, fee change affects only later bookings, refund gives no fee and no payout, held without onboarding, transfer idempotent on retry, transfer failure then retry, `manual` skipped, mentor sees only their own payouts, non-operator 403, concurrent double run gives one transfer.

## Acceptance criteria
- Given a paid session that was held, When the payout runs, Then the platform fee and the mentor's share equal the snapshot taken at booking. (R10)
- Given a mentor with completed Connect onboarding, When the payout runs, Then the share is transferred through Stripe Connect and through nothing else. (R05)
- Given a mentor without Connect onboarding, When the payout would run, Then it is held and the mentor is told. (R05, negative)
- Given the operator changes the fee, When later sessions are paid, Then the new fee applies to them and not to earlier ones. (R10, money)
- Given a refunded session, When fees are computed, Then no fee is taken and nothing is paid out. (negative)
- Given a session already paid by hand (marked `manual`), When the payout runs, Then it is not paid again. (R20, negative)
- Given the payout run is triggered twice at once, When both finish, Then each session was transferred at most once. (idempotency, negative)
- Given a session that has not ended, When the payout runs, Then it is not paid. (negative)

## Decisions in play
- D11 / R10 — 20% platform fee, operator-configurable; vault fee later (owner: founder A)
- D04 / R05 — Stripe only, Connect for payouts, onboarding before the first payout (owner: founder A)
- D30 — owed to the mentor is the price less the 20% fee, recorded since the first iteration; this story automates the split and payout (owner: founder A)
- D29 — transfers are in EUR, one currency (owner: founder A)
- D28 / R20 — by hand until this ships; R18 — by-hand actions logged (owner: founder A)

## Compatibility notes
"Database schema and migrations": new table (payout history). "Repository ports" and the gateway port: additive. "HTTP API routes and response envelope": new operator route. No CLI change. `risk-high` (money), `needs-qa`, second reviewer, no self-QA.

## How to pick this up
`om-auto-fix-issue <issue number>` once filed, after E03-S03 and E02-S05 are merged and the spec is written.

## Out of scope
Connect onboarding (E02-S05); the settings screen (E05-S02); a scheduler or worker; payouts for the first iteration (done by hand, D28).

## Open questions
- What does a forfeited late cancellation (E03-S05) pay the mentor, and is the fee taken? — blocking before implementation (owner: founder A)
- Should a dispute (E05-S03) pause a payout, and how long after the session end does a transfer wait, since a transfer cannot be recalled by the product — non-blocking (owner: founder A)
- Who bears Stripe's own processing fee under separate transfers (it appears to fall on the platform balance, inside the 20%) — non-blocking (owner: founder A)
- D28's lawyer or Stripe check of the manual flow also decides whether the cutover marks are needed, and D29 leaves a mentor with a bank account in another currency to the same check — non-blocking (owners: founders A and B)

## Unverified claims
- Stripe Connect behaviour (separate transfers, `transfer_group`, who bears processing fees) is recalled, not checked; no Stripe package exists here.
- E02-S05 and E02-S04 field names (`payoutsEnabled`, `feePercent`) are from the reference and do not exist yet.

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-high` — touches sign-in, sessions, money, data scoping or a migration (SDLC risk-high rules)

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E04 — #32 Session, written answer, and note

**Issue:** [#32](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/32)  
**Labels:** feature, priority-medium, risk-medium  

Backlog source: .ai/specs/product-brief.md
Backlog id: E04

## Summary
- Problem: a paid session must leave the mentee something to act on and the mentor something to keep. The working developer of 2026-08-20 got "two contradictory answers" and wanted "an answer, not a course" (`.ai/specs/research/2026-08-20-interview-working-dev.md`); the mentor of 2026-08-22 keeps notes that "rot" and "won't publish anything a mentee didn't agree to" (`2026-08-22-interview-mentor.md`). Verified: nothing for bookings, sessions, answers or notes exists in `packages/core`, `packages/db` or `packages/app`; the only entity is `Mentor`.
- Who has it: mentees who need an answer they can act on; mentors whose notes are their asset.
- Expected outcome: the text session happens in a channel the mentor names and DevMentor says on every session screen that sessions are text (D27, R03, R19); the mentor gives a written answer delivered inside DevMentor (D05); the mentor drafts a note the mentee sees awaiting approval; the mentee approves or declines and an approved note is kept privately by both (D20, R12). Nothing is published without the mentee's approval (D02, R02). Checked by the stories' criteria.

## Spec
Design authority: `.ai/specs/product-brief.md`. Implementation specs owed before the first story is built: `.ai/specs/2026-10-21-text-session-channel.md` (E04-S01) and `.ai/specs/2026-10-21-session-answer-and-note.md` (E04-S02 to S04).

## Analysis
- New concept folders by the AGENTS.md convention, created with their first file only: `sessions` (booking-based session details, written answer) and `notes` (`packages/db/src/entities/notes/`, `packages/core/src/services/notes/`, `packages/core/src/validators/notes/`, `packages/app/src/app/api/notes/`). Each service has a repository port in `core` implemented in `db`, registered in `packages/app/src/server/container.ts`.
- D27 removes the reference's chat: no message entity, no polling, no session screen. DevMentor holds the channel field, a details page per booking (`packages/app/src/app/sessions/[bookingId]/page.tsx`), the answer and the note.
- Every route runs `requireSession` then an ownership check with `assertOwns` (`packages/core/src/http/auth.ts`); the reference's `assertOwnership` does not exist. Avoid the name `session` for the mentoring session in code: `Session` in `auth.ts` is the login session.
- Standards: generated migrations only, typed `AppError`s, `apiHandler`, 100% coverage, an integration test per user-visible flow (`tests/integration/*.int.test.ts`), transactions for check-then-write.

## How to implement
1. Write the two specs named above; settle the open questions.
2. Build in order: E04-S01, E04-S02, E04-S03, E04-S04 (all first iteration, D13).
3. Unit tests per file; an integration scenario proving that a third user cannot open a session, read an answer or a note.

## Acceptance criteria
- Given a confirmed booking, When the slot starts, Then both parties are told which channel to use and that sessions are text. (R19, R03)
- Given the epic's checklist, When the four stories are done, Then a mentee has a written answer and can approve or decline the mentor's note; all four are first iteration.
- Given any user who is not a party of a booking, or the public mentor page, When they request its details, answer, note or the session channel, Then they are refused or it is absent. (D32; negative)
- Given any session, When it ends, Then nothing from it is public. (R02; negative)

## Decisions in play
- D27 / R19 — session in the mentor's channel; product keeps the answer and the note (owner: founder A)
- N01 / R03 — no video; every screen about a session says sessions are text (owner: founder A)
- D01 / R01 — 25 or 50 minutes (owner: founder A)
- D05 — written answer and a privately kept note; vault later (owner: founder A)
- D02 / R02 — nothing published without the mentee's approval (owners: founders A and B)
- D20 / R12 — mentor drafts, mentee approves or declines, no co-editing (owner: founder A)
- D03 — the first iteration must leave an answerable session (owner: founder A)
- D22 / R15 — booking-to-start recorded (owner: founder A)
- D32 — the channel address is shown only to the two parties of a confirmed booking, not on the public mentor page (owner: founder A)

## Compatibility notes
`BACKWARD_COMPATIBILITY.md` surfaces touched: "Database schema and migrations" (additive), "HTTP API routes and response envelope" (new routes), "Shared Zod schemas", "Repository ports", "Package public exports" (additive), "Domain events" only if an event emitter is introduced. The file has no numbered sections. Protected decisions R02 and D05 bound the epic.

## How to pick this up
`om-auto-fix-issue <story number>` for each story once filed, in order. Prerequisites: E03-S03 and accounts (E01).

## Out of scope
Video (N01); a chat or session screen (D27); storing the session's content; publishing anything and the vault (R02, D05); co-editing the note (R12); disputes (E05-S03).

## Open questions
- none

## Unverified claims
- Stories of E01, E02 and E03 are drafted by other agents; fields such as booking `startsAt` and the mentor-page entity are taken from the reference, not from code.

## 📋 Stories
<!-- om-backlog: checklist, rewritten on every run -->
- [ ] #50 E04-S01 — At the slot's start the mentee and the mentor hold a 25- or 50-minute text session in the channel the mentor named; every DevMentor screen about the session says sessions are text
- [ ] #51 E04-S02 — The mentor gives the written answer and the mentee sees it after the session
- [ ] #52 E04-S03 — The mentor drafts a session note and the mentee sees it awaiting approval
- [ ] #53 E04-S04 — The mentee approves the note in full or declines it with a comment; an approved note is kept privately by both; nothing is published

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-medium` — ordinary single-area change that ships with tests

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E04-S01 — #50 At the slot's start the mentee and the mentor hold a 25- or 50-minute text session in the channel the mentor named; every DevMentor screen about the session says sessions are text

**Issue:** [#50](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/50)  
**Labels:** feature, priority-medium, risk-medium  
**Epic:** #32  
**Iteration:** first (D13)  

Backlog source: .ai/specs/product-brief.md
Backlog id: E04-S01
Epic: #32
Depends on: E03-S03 (#46)
Iteration: first (D13)

## Summary
- Problem: a mentee who paid needs to know where the text session happens and that it is text. The 2026-08-20 working developer wants "an answer, not a course" and said "text is fine, faster" (`.ai/specs/research/2026-08-20-interview-working-dev.md`); the 2026-09-01 fintech developer wants text with the yaml pasted in, a call only if text fails (`2026-09-01-interview-backend-dev-fintech.md`). N01/R03 forbid video and require the product to say so. D27/R19 moved the exchange out of the product: it takes place in a channel the mentor names. Verified today: no booking, no session code, and the only stored mentor data is `mentors` (id, name, email, created_at); there is no field for a channel.
- Who has it: the mentee and the mentor of a confirmed booking.
- Expected outcome: both parties see, on DevMentor's session details page, the channel the mentor named, the slot's time window (25 or 50 minutes) and a clear "sessions are text" statement; the same statement appears on every other DevMentor screen about a session; the session start is recorded (R15). Checked by the criteria below and a third-user denial test.

## Spec
Design authority: `.ai/specs/product-brief.md` (R01, R03, R15, R19, D27). Implementation spec owed before implementing: `.ai/specs/2026-10-21-text-session-channel.md` (the field, the details page, the notice on each screen, the access rule). It may be shared with E04-S02 as `2026-10-21-session-answer-and-note.md`.

## Analysis
- Does not exist yet: `bookings`/`sessions` concepts, a booking entity (E03-S02/S03 create it with `startsAt`, `bookedAt`; the reference stores `bookedAt` and `startsAt` for R15 in E03-S03), users and accounts (E01), `packages/ui/src/components/sessions/`, any `SessionIsTextNotice`, `packages/app/src/lib/`, `packages/core/src/events`, a mailer or notification service.
- Exists: `packages/db/src/entities/mentors/mentor.entity.ts` (EntitySchema, no decorators; `mentors` table: id, name, email, created_at), `packages/core/src/http/auth.ts` (`requireSession`, `requireRole`, `assertOwns(session, ownerId)`; there is no `assertOwnership`), `apiHandler`, `packages/app/src/server/container.ts` (the `Cradle` interface lives there; there is no `cradle.ts`).
- Naming clash to avoid: `Session` in `auth.ts` is the login session (`userId`, `role`), not a mentoring session. The service for this story must not take a parameter called `session`; call it `actor`.
- Channel field: belongs to the mentor-page entity of E02-S02 (the reference's `mentorProfile`; not present here). If E02-S02 has not added it, this story adds a nullable `session_channel` column through a generated migration.
- No queue or worker exists (AGENTS.md), so nothing fires "at the slot's start": the details page computes the state (`not_started`, `started`, `ended`) from `startsAt` and `lengthMinutes` when it is read.
- Next.js: read `node_modules/next/dist/docs/` first. `params` is a Promise (`await params`). `forbidden()` requires `experimental.authInterrupts` in `packages/app/next.config.ts` (not set); otherwise use `notFound()`.
- Mandates: auth server-side on every non-public route plus an ownership check on the booking; `AppError` subclasses only; generated migration; 100% coverage; integration test. Pages: Tailwind (these are not `/admin/*`).

## How to implement
1. Spec first (above); settle the open questions.
2. Migration and entity: add `session_channel` (text, nullable, max length a named constant) to the mentor-page entity unless E02-S02 did; `npm run migration:create -w @devmentor/db`; commit generated files incl. snapshots.
3. Core: validator `packages/core/src/validators/sessions/session-channel.schema.ts` (trimmed, 1 to N chars; export via `validators/index.ts`); `packages/core/src/services/sessions/session-window.ts` (pure: `endsAt = startsAt + lengthMinutes`, state from `now`; lengths 25 and 50 as named constants shared with E03-S02, R01); `session-details.service.ts` with `getForParty(actor, bookingId, now)` (confirmed bookings only; mentee id or the mentor's user id via `assertOwns`, else `ForbiddenError`) and a port `session-details-repository.port.ts`; implement in `packages/db/src/repositories/sessions/`.
4. Register service and repository in `container.ts` (one line each, plus `Cradle`).
5. UI: `packages/ui/src/components/sessions/session-is-text-notice.tsx` (reuse if E03-S02 already added it); render it on the mentor page, booking, confirmation, upcoming-sessions lists (E03-S04), the details page and the answer panel (E04-S02). No audio or video control anywhere.
6. Page `packages/app/src/app/sessions/[bookingId]/page.tsx` (server component, `withScope`, party check, no chat, no polling): notice, channel, start and end, state. Render the channel as a link only if it parses as an `https:` URL, otherwise plain text (never `javascript:`). Do not put the page guard in `src/lib/`: unit tests only run under `src/server/**`, `src/app/api/**` and `src/app/**/*.test.tsx`.
7. Tests: window boundaries (exactly at start, at end, 25 vs 50), third user refused, unconfirmed booking refused, channel absent shows "not named yet", `https`-only link, notice on each page. Integration `tests/integration/session.int.test.ts` (existing pattern in `mentors.int.test.ts`): third signed-in user refused; parties' snapshot contains the notice and the channel; public mentor payload contains no channel.

## Acceptance criteria
- Given a confirmed booking, When its start time arrives, Then both parties see the channel the mentor named and that the session is text. (R19, R03)
- Given any DevMentor screen about a session (mentor page, booking, confirmation, upcoming sessions, details, written answer), When it renders, Then it says the session is text and offers no video or audio. (R03, N01; negative)
- Given a confirmed booking, When it is stored, Then it holds the booking time and the slot start so booking-to-start is readable. (R15; recorded by E03-S03, asserted here)
- Given the booked length, When 25 or 50 minutes have passed since the start, Then the page shows the session as ended and the written answer remains possible. (R01, D05)
- Given a mentor who has not named a channel, When the parties open the page, Then it says no channel is named yet and asks the mentor to name one; no invented channel is shown. (negative)
- Given a user who is neither party of the booking, When they open its details page or look for the channel, Then they are refused and the channel is not shown. (D32, data scoping; negative)
- Given the public mentor page and the public mentor payloads (`GET /api/mentors`), When they render, Then the channel is not present; the mentor enters it in the mentor-page editor and only the two parties of a confirmed booking see it. (D32; negative)

## Decisions in play
- D27 / R19 — text session in a channel the mentor names; no session screen (owner: founder A)
- N01 / R03 — no video; every screen about a session says so (owner: founder A)
- D01 / R01 — 25 or 50 minutes (owner: founder A)
- D22 / R15 — booking-to-start recorded (owner: founder A)
- D32 — the channel address is shown only to the two parties of a confirmed booking, never on the public mentor page (owner: founder A)

## Compatibility notes
`BACKWARD_COMPATIBILITY.md` surfaces: "Database schema and migrations" (additive nullable column), "Package public exports" and "Shared Zod schemas" (additive), "Repository ports" (new port). No route is added. Protected product decisions (SDLC.md): D27/R19 and R03.

## How to pick this up
`om-auto-fix-issue <issue number>` once filed. Prerequisite: E03-S03 and accounts (E01); E02-S02 for the mentor-page field.

## Out of scope
A chat or session screen, polling, video or audio, file attachments, reading or storing the session's content (it stays in the channel), reminders or scheduled jobs, the written answer (E04-S02), the note (E04-S03, E04-S04).

## Open questions
- May a mentor publish slots without naming a channel? — non-blocking, decide in the spec (owner: founder A)
- If the mentor changes the channel after a booking, does the booking keep the old one? — non-blocking (owner: founder A)
- Does "records the session start" mean the scheduled start already stored (plain reading) or the first time a party opens the page after it? — non-blocking (owner: founder A)

## Unverified claims
- E03-S02/S03, E02-S02 and E01 are drafted by others: the booking fields `startsAt`, `lengthMinutes`, `bookedAt`, the mentor-page entity and the page guard are assumed from the reference.
- `forbidden()` behaviour taken from the docs, not run.

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-medium` — ordinary single-area change that ships with tests

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E04-S02 — #51 The mentor gives the written answer and the mentee sees it after the session

**Issue:** [#51](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/51)  
**Labels:** feature, priority-medium, risk-medium  
**Epic:** #32  
**Iteration:** first (D13)  

Backlog source: .ai/specs/product-brief.md
Backlog id: E04-S02
Epic: #32
Depends on: E04-S01 (#50)
Iteration: first (D13)

## Summary
- Problem: the text session itself now takes place outside DevMentor (D27), so the written answer is the one thing DevMentor holds that proves a paid session delivered. D05 makes it what 1.0 produces and D03 sets the first iteration's bar at an "answerable" session. The working developer of 2026-08-20 got "two contradictory answers" in a Discord and wants one he can act on (`.ai/specs/research/2026-08-20-interview-working-dev.md`). Verified: no booking, answer column or answer screen exists in `packages/*`.
- Who has it: the mentee (the answer is what they paid for) and the mentor (it is the deliverable).
- Expected outcome: one written answer per booking, posted inside DevMentor by that booking's mentor, readable by the mentee from then on, with an explicit "still owed" state after the session ended. Checked by the criteria below.

## Spec
Design authority: `.ai/specs/product-brief.md` (D05, D03, R02, R03). An implementation spec is owed: `.ai/specs/2026-10-21-session-answer-and-note.md` (shared with E04-S01, E04-S03, E04-S04), or one `...-written-answer.md`.

## Analysis
- Does not exist yet: the booking entity (E03-S02/S03; reference columns `startsAt`, `lengthMinutes`), the details page from E04-S01 (`packages/app/src/app/sessions/[bookingId]/page.tsx`), a notification service or mailer port (E03-S04 in the reference), `packages/core/src/events/` (AGENTS.md: added only when the first feature needs one).
- The answer belongs to the booking (one per session): two nullable columns `written_answer` and `written_answer_at` on `bookings` are enough.
- The mentor is the party who may post: `assertOwns` (`packages/core/src/http/auth.ts`) against the mentor's user id; `requireSession` first. Errors: `ForbiddenError`, `ConflictError` for a wrong state, `ValidationError` from the schema.
- `packages/ui/src/backend/forms/CrudForm.tsx` supports only `text | email | password` inputs (single-line), starts empty and has no initial values. A multi-line answer needs an additive `textarea` field type. `CrudForm` lives under `backend/` (admin, shadcn style) while this page is a Tailwind frontend page; the spec decides reuse or a small frontend form in `packages/ui/src/components/sessions/`.
- Check-then-write on shared state (the answer must be posted once): write with `update ... where id = ? and written_answer_at is null` inside a transaction, zero rows means `ConflictError`; needs a concurrent-post integration test (AGENTS.md).
- Telling the mentee: first the in-product indicator (details page and E03-S04's upcoming/past lists). E-mail only through a core port with a mock adapter, and only if E03-S04 already introduced one; otherwise it is a follow-up.

## How to implement
1. Spec (above).
2. Migration `written-answer` (generated, `npm run migration:create -w @devmentor/db`): the two columns; update `packages/db/src/entities/bookings/booking.entity.ts`.
3. `packages/core/src/validators/sessions/answer-post.schema.ts`: `body` trimmed, min 1, max a named constant (reference: 20000; say why), exported through `@devmentor/core/validators`.
4. `packages/core/src/services/sessions/session-details.service.ts` (from E04-S01): `postAnswer(actor, bookingId, input, now)` mentor only; refused before the slot's start; sets both columns once; `getForParty` returns `answer: { body, postedAt } | null` and `answerOwed = state === "ended" && answer === null`. Extend the port and the repository in `packages/db/src/repositories/sessions/`.
5. Route `packages/app/src/app/api/sessions/[bookingId]/answer/route.ts` (POST via `apiHandler`, so CSRF is enforced; `requireSession`, mentor party check, `parseWithSchema`). Use `apiHandler` rather than `makeCrudRoute` (not plain CRUD).
6. Page: on the details page the mentor gets the answer form; the mentee gets the answer, or "The written answer is still owed" once the slot has ended. The R03 notice stays on the page.
7. Tests (all under the Vitest patterns): another mentor refused, mentee refused, third user refused, post before start refused, empty and over-length body 422 with `fieldErrors.body`, second post 409, concurrent posts leave one answer, owed state, answer persists on re-read. Integration in `tests/integration/session.int.test.ts` or `session-answer.int.test.ts`.

## Acceptance criteria
- Given a held session, When the mentor posts the written answer, Then the mentee sees it in DevMentor and sees that it is there. (D05)
- Given a session with no written answer after its end, When the mentee opens it, Then it says the answer is still owed. (D03; negative)
- Given a posted written answer, When the mentee opens the session weeks later, Then the answer is still there. (D05)
- Given the mentor of a different booking or the mentee, When they try to post an answer to this one, Then they are refused. (data scoping; negative)
- Given a slot that has not started, or an answer already posted, When the mentor posts, Then it is refused. (negative)

## Decisions in play
- D05 — 1.0 delivers the written answer and a privately kept note (owner: founder A)
- D03 — the first iteration must leave an answerable session (owner: founder A)
- D27 / R19 — the session happens in the mentor's channel; the answer is delivered inside DevMentor (owner: founder A)
- R03 — every screen about a session says sessions are text

## Compatibility notes
`BACKWARD_COMPATIBILITY.md` surfaces: "Database schema and migrations" (additive nullable columns), "HTTP API routes and response envelope" (new route), "Shared Zod schemas" (new schema), "Repository ports" (port extended with its implementation), "Package public exports" (additive). No event is emitted unless the emitter already exists. Protected decisions D05, D27.

## How to pick this up
`om-auto-fix-issue <issue number>` once filed. Prerequisite: E04-S01.

## Out of scope
Revising the answer after posting; the note (E04-S03, E04-S04); anything published (R02); storing the session's content (it stays in the channel); a session screen (D27).

## Open questions
- May the answer be revised after posting? The reference contradicts itself (open question says "replaceable until the note is approved", out of scope says no editing). This draft posts once. — non-blocking (owner: founder A)
- E-mail to the mentee: needs a mailer port that does not exist here — non-blocking (owner: founder A)
- Should the mentee get a way to say the answer did not arrive when the mentor never posts? That is E05-S03's dispute path (1.1). — non-blocking (owner: founder A)

## Unverified claims
- The booking entity and its columns come from the reference and the E03 drafts by other agents; not present in the code.
- Whether E03-S04 introduces a notification service or mailer port is unknown.

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-medium` — ordinary single-area change that ships with tests

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E04-S03 — #52 The mentor drafts a session note and the mentee sees it awaiting approval

**Issue:** [#52](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/52)  
**Labels:** feature, priority-medium, risk-medium  
**Epic:** #32  
**Iteration:** first (D13)  

Backlog source: .ai/specs/product-brief.md
Backlog id: E04-S03
Epic: #32
Depends on: E04-S02 (#51)
Iteration: first (D13)

## Summary
- Problem: the mentor interviewed on 2026-08-22 keeps a private notes file that "rots" and said "I won't publish anything a mentee didn't agree to" (`.ai/specs/research/2026-08-22-interview-mentor.md`). D20 makes the mentor the drafter, D02 gives the mentee the approval. Verified: nothing in `packages/*` stores a note; the only persisted concept is `mentors`.
- Who has it: mentors (the note is their asset) and mentees (they must see what they will be asked to approve).
- Expected outcome: one draft note per session, written inside DevMentor after the written answer, sent for approval, visible only to the two parties, read-only for the mentee. Checked by the criteria below.

## Spec
Design authority: `.ai/specs/product-brief.md` (D20/R12, D02/R02, D05). Implementation spec owed: `.ai/specs/2026-10-21-session-answer-and-note.md` (shared with E04-S02 and E04-S04).

## Analysis
- Does not exist yet: a `notes` concept (entity, port, service, validator, routes), the booking entity and details page (E03, E04-S01), the written-answer columns (E04-S02).
- New files by convention: `packages/db/src/entities/notes/session-note.entity.ts` (EntitySchema, like `mentor.entity.ts`), `packages/db/src/repositories/notes/session-note.repository.ts`, `packages/core/src/services/notes/{session-note.service.ts, session-note.types.ts, session-note-repository.port.ts}`, `packages/core/src/validators/notes/note-draft.schema.ts`, routes under `packages/app/src/app/api/notes/[bookingId]/`. Register the entity in `packages/db/src/entities/index.ts` and the service in `packages/app/src/server/container.ts` (`Cradle` interface there; no `cradle.ts`).
- A note requires the booking's `written_answer_at` (D05: the note follows the answer).
- Privacy by construction: no route lists notes across bookings; the mentor list and any public mentor payload (`mentor.service.ts`, `api/mentors`) never join notes; the repository exposes only per-booking reads.
- The note is saved and read by `requireSession` plus `assertOwns` against the mentor's or the mentee's user id; `ForbiddenError` otherwise. No `assertOwnership` exists.
- Editor UI: `CrudForm` has no textarea or initial values (see E04-S02); the draft must be re-editable, so initial values are needed (additive extension) or a dedicated form.
- Save-and-send transition (`draft` to `awaiting_approval`) must happen once: conditional update inside a transaction plus a concurrent integration test.

## How to implement
1. Spec (above).
2. Entity `SessionNote`: `booking` many-to-one, `version` integer (1 here; used by redrafts in E04-S04), `body` text, `status` (`draft` | `awaiting_approval`; a TypeScript union, E04-S04 extends it), `sentAt` nullable; unique (`booking_id`, `version`). Generated migration `notes`.
3. `note-draft.schema.ts`: `body` min 1, max a named constant (reference 20000), exported via `@devmentor/core/validators`.
4. `session-note.service.ts`: `getForParty(actor, bookingId)`, `saveDraft(actor, bookingId, input)` (mentor only; refused before the written answer exists), `sendForApproval(actor, bookingId)` (mentor only; once; the mentor cannot edit after sending, plain reading). Port plus `db` repository. Name the auth parameter `actor`, not `session`.
5. Routes with `apiHandler`: `api/notes/[bookingId]/route.ts` (GET both parties; PUT draft, mentor only) and `api/notes/[bookingId]/send/route.ts` (POST, mentor only).
6. Details page `sessions/[bookingId]/page.tsx`: the mentor sees a draft editor and "Send for approval"; the mentee sees a read-only note marked "Awaiting your approval" with no edit control, and the line that the note stays private. Approve and Decline (with a comment) are added by E04-S04, also in the first iteration.
7. Tests: third user refused on GET, mentee PUT refused, draft before the answer refused, send once (second send 409), edit after send refused, note absent from `GET /api/mentors` payload. Integration: the mentee's snapshot has no textbox for the note body; third user refused.

## Acceptance criteria
- Given a session with a written answer, When the mentor writes a draft note and sends it for approval, Then the mentee sees it marked as awaiting their approval. (R12)
- Given a draft or awaiting note, When anyone but the two parties looks, Then it is visible nowhere. (R02; negative)
- Given the mentee viewing the note, When they look for a way to edit it, Then there is none: only approve, or decline with a comment (E04-S04). (R12 no co-editing; negative)
- Given a session with no written answer, When the mentor tries to draft a note, Then it is refused. (D05; negative)

## Decisions in play
- D20 / R12 — mentor drafts, mentee approves or declines, no co-editing (owner: founder A)
- D02 / R02 — nothing is published without the mentee's approval (owner: founders A and B)
- D05 — written answer and a privately kept note; vault later (owner: founder A)
- D27 / R19 — session content is outside the product; the note is delivered inside it (owner: founder A)

## Compatibility notes
`BACKWARD_COMPATIBILITY.md` surfaces: "Database schema and migrations" (new table, additive), "HTTP API routes and response envelope" (new routes), "Shared Zod schemas", "Repository ports" and "Package public exports" (additive). Protected decisions D02/R02, D05.

## How to pick this up
`om-auto-fix-issue <issue number>` once filed. Prerequisite: E04-S02.

## Out of scope
Approving or declining (E04-S04); co-editing (R12); the vault and any publishing (D05, R02); the mentor's own library of notes across sessions.

## Open questions
- May the mentor keep editing after sending? Plain reading: no, until a decline. — non-blocking (owner: founder A)

## Unverified claims
- Booking and written-answer columns, and the user ids to check ownership against, come from the reference and the other drafts, not from existing code.

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-medium` — ordinary single-area change that ships with tests

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E04-S04 — #53 The mentee approves the note in full or declines it with a comment; an approved note is kept privately by both; nothing is published

**Issue:** [#53](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/53)  
**Labels:** feature, priority-medium, risk-medium  
**Epic:** #32  
**Iteration:** first (D13)  

Backlog source: .ai/specs/product-brief.md
Backlog id: E04-S04
Epic: #32
Depends on: E04-S03 (#52)
Iteration: first (D13)

## Summary
- Problem: D02 ("nothing from a session is published without the mentee's approval") and R02 make the mentee's decision the gate; D20 fixes the mechanics and names repeated declines as the signal for co-editing. The mentor of 2026-08-22: "I won't publish anything a mentee didn't agree to" (`.ai/specs/research/2026-08-22-interview-mentor.md`). Verified: no decision, comment or status beyond a draft exists in the repo (E04-S03 adds the note).
- Who has it: the mentee (the approval is theirs), the mentor (redrafts after a decline) and the operator (reads the decline count).
- Expected outcome: approve, or decline with a mandatory comment; a redraft is a new version; an approved note is visible to both parties, marked private, and absent from every public payload; the operator can read the decline count. Checked by the criteria below.

## Spec
Design authority: `.ai/specs/product-brief.md` (D20/R12, D02/R02, D05). The implementation spec `.ai/specs/2026-10-21-session-answer-and-note.md` (shared with E04-S02, E04-S03) is owed and should be written before E04-S03 is built so the version model is settled once.

## Analysis
- Builds on E04-S03 (`session-note.entity.ts`, `session-note.service.ts`, port, repository; none exists yet): adds `declineComment`, `decidedAt`, statuses `approved` and `declined`.
- `packages/core/src/validators/notes/note-decline.schema.ts`: `comment` min 1, max a named constant (reference 2000).
- Mentee-only actions: `requireSession` plus `assertOwns` against the mentee's user id; the mentor cannot approve (`ForbiddenError`). Check-then-write on status (`awaiting_approval` to a decision exactly once) runs in a transaction with a conditional update, with a concurrent approve/decline integration test.
- Events `notes.note.approved` and `notes.note.declined` follow the `concept.entity.action` convention but `packages/core/src/events` does not exist; add the emitter only if this is the first feature that needs it, otherwise just tell the mentor in product.
- Operator decline count: `packages/app/src/app/admin/` has only `mentors/`; there is no `admin/layout.tsx`, no `admin/sessions`. It needs the operator role and guard from E01-S03 and E05; `/admin/*` is public today (AGENTS.md known gap). Back-office pages use shadcn components (`Table`, `Badge` exist in `packages/ui/src/components/ui/`).
- Public payloads that must never include notes: `GET /api/mentors` (`packages/app/src/app/api/mentors/route.ts`, `mentor.service.ts#list`) and mentor pages.

## How to implement
1. Spec (above).
2. Migration (generated) adding `decline_comment`, `decided_at` to `session_notes`; extend the status union.
3. `note-decline.schema.ts`, exported via `@devmentor/core/validators`.
4. Service: `approve(actor, bookingId)` (mentee only; `awaiting_approval` to `approved`); `decline(actor, bookingId, input)` (mentee only; to `declined` with comment; the mentor's next `saveDraft` creates `version + 1`); `declineCount(bookingId)` = number of declined versions; `getForParty` returns the approved note with `private: true` and the decline history. Port and repository updated together.
5. Routes with `apiHandler`: `api/notes/[bookingId]/approve/route.ts` and `.../decline/route.ts` (POST, mentee only).
6. Details page: the mentee's Approve and Decline (comment required; submit disabled while empty); the mentor sees the comment and a "Redraft" action; both see the approved note marked "Private: kept by you and the other party; nothing is published".
7. Operator view: `packages/app/src/app/admin/sessions/page.tsx` (operator only) with a "note declines" column, using the guard from E01-S03.
8. Tests: decline without comment 422 with `fieldErrors.comment`; a declined version never reads as approved; mentor cannot approve; third user refused; second decision refused (409); two declines give a count of 2; approved note absent from `GET /api/mentors`, from mentor pages and from any list. Integration test for the flow and the denied paths.

## Acceptance criteria
- Given a note awaiting approval, When the mentee approves it, Then it becomes an approved note visible to both parties and marked private. (D05, R02)
- Given a note awaiting approval, When the mentee declines it with a comment, Then the mentor sees the comment and can redraft; the declined draft is never shown as approved. (R12)
- Given a decline with no comment, When submitted, Then it is refused: a decline carries a comment. (R12; negative)
- Given an approved note, When any other user, the mentor list or any public page is checked, Then the note appears nowhere: no vault, no publishing in 1.0. (R02, D05; negative)
- Given a session whose note was declined more than once in a row, When the operator reads the session, Then the decline count is visible, as D20's signal for co-editing. (D20)
- Given the mentor, When they try to approve or decline, Then they are refused. (negative)

## Decisions in play
- D20 / R12 — mentor drafts, mentee approves in full or declines with a comment, mentor redrafts; more than one decline in a row signals co-editing (owner: founder A)
- D02 / R02 — nothing published without the mentee's approval (owner: founders A and B)
- D05 — approved note kept privately; vault later (owner: founder A)
- D13 — this story is in the first iteration (owner: founder A)

## Compatibility notes
`BACKWARD_COMPATIBILITY.md` surfaces: "Database schema and migrations" (additive nullable columns), "HTTP API routes and response envelope" (new routes), "Shared Zod schemas", "Repository ports", and "Domain events" only if events are introduced (none exist yet). A PR that publishes a note contradicts R02 and D05 and needs a superseding record (SDLC.md, protected decisions).

## How to pick this up
`om-auto-fix-issue <issue number>` once filed. Prerequisites: E04-S03; E01-S03 and the E05 operator shell for the decline count.

## Out of scope
Publishing, the vault (D05); co-editing (R12); the mentor's approval of anything; deleting an approved note.

## Open questions
- Where is the operator decline count shown if the E05 shell is not built yet? — non-blocking (owner: founder A)

## Unverified claims
- E01-S03 and E05 operator guard names and the note entity fields come from the reference and other drafts, not from code.

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-medium` — ordinary single-area change that ships with tests

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E05 — #33 Operator functions in 1.0

**Issue:** [#33](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/33)  
**Labels:** feature, priority-medium, risk-high  

Backlog source: .ai/specs/product-brief.md
Backlog id: E05

## Summary
- Problem: invitations (D08, R07), price bounds (D09, R08), the 20% fee (D11, R10) and quality disputes (D10, R09) all name an operator. In 1.0 the operator is the two founders and every operator action without a story is done by hand and logged in the shared operator note (D19, R18). Source: `.ai/specs/research/decisions/D19-operator-is-the-two-founders.md`. The three stories are 1.1 (D13), not in the first iteration. The brief's own trigger to pull one forward is not recorded here; the reference says "more than one manual operator action a day for a week", which is not in this repo's brief (see Open questions).
- Who has it: the operator (founder A, founder B).
- Expected outcome: the operator invites, sets bounds and the fee, and resolves disputes inside the product instead of by hand; checked by the shared operator note going quiet and by the three stories' acceptance criteria.

## Spec
Design authority: `.ai/specs/product-brief.md` (Scope, Business rules R07 to R10, R16 to R18, Decisions D08 to D11, D18, D19, D24). No operator spec exists. An implementation spec `.ai/specs/2026-10-21-operator.md` is owed before the first story is implemented (AGENTS.md: specs for non-trivial work). It should settle the shared operator shell (layout, nav, the guard) once, so S01 to S03 do not each invent it. Each story also names its own spec.

## Analysis
Verified in this repo on 2026-10-21:
- The only operator/admin surface is `packages/app/src/app/admin/mentors/page.tsx` plus the client component `admin-mentors.tsx` (`DataTable` + `CrudForm` over `apiCall`). There is no `admin/layout.tsx`, no `admin/page.tsx` dashboard, no `admin/users` page, no navigation, and no `/api/health`.
- `/admin/*` and `POST /api/mentors` are public. AGENTS.md records this as a known gap: the first feature that needs a session must call `requireSession` before touching a service. Nothing in E05 can ship safely until E01-S03 gives the operator role and guards.
- `packages/core/src/http/auth.ts` has `requireSession`, `requireRole(session, role)`, `assertOwns`, `signSession`, `SESSION_COOKIE = "devmentor_session"`. `Session.role` is a plain `string` (no `Role` union, no `student`), which fits D31: exactly one role per account, so the operator role goes to an account that is not also a mentor and a founder who mentors uses a second account. There is no user entity, no sign-in route, no `readSession`, no page-level guard.
- `packages/ui/src/backend/forms/CrudForm.tsx` supports only `text | email | password` fields, starts empty and resets after success; it has no initial values, no number or select field. `DataTable` supports `actions`, pagination, loading, empty, error. shadcn primitives present: `Button`, `Badge`, `Card`, `Table` only; there is no `components.json` in `packages/ui`.
- None of `invitations`, `availability`, `bookings`, `payments`, `sessions`, `disputes`, `operator` concepts exist yet (`packages/*/src` holds only `mentors` and `http`). `core/src/events` does not exist. `env.ts` knows only `NODE_ENV`, `LOG_LEVEL`, `JWT_SECRET`.
- `.ai/specs/engineering-standards.md` (lines 206, 234) says "no RBAC"; D19 introduces one operator role. E01-S03 should amend the standard in the same PR.

## How to implement
1. Write the owed operator spec first (shared shell: `admin/layout.tsx` with nav, a server-side guard used by every admin page and `/api/operator/*` route, denied-path behavior).
2. Build in order: E05-S01 (invitation batches), E05-S02 (platform settings), E05-S03 (disputes). S02 needs a small additive `CrudForm` extension; S03 needs new shadcn primitives (see those stories).
3. Every operator route uses `apiHandler`, calls `requireSession` then `requireRole(session, "operator")` before any service call, and has an integration test for the denied path and the wrong-scope read (SDLC.md, `risk-high`).
4. Each story ships 100% unit coverage (the `coverage.include` glob already covers `packages/*/src`) and an integration test in `tests/integration/*.int.test.ts`.

## Acceptance criteria
- Given the operator, When they use the invitation, settings and dispute screens, Then each action is recorded in the product and no by-hand step is needed. (D19, R18)
- Given any non-operator or signed-out visitor, When they request an operator page or `/api/operator/*` route, Then they are refused server-side. (negative)
- Given an operator action with no story, When it is needed, Then it stays by hand and is logged in the shared operator note; E05 does not add an admin role beyond the two founders. (D19, R18, negative)
- Given the epic's checklist, When all three stories are done, Then the epic closes.

## Decisions in play
- D19 / R18 — the operator is the two founders; by-hand actions are logged (owner: founders A and B)
- D08 / R07 — invitation only (owner: founder A)
- D18 / R17 — batches of 20, fewer than 5 of 20 stops invitations (owner: founders A and B)
- D24 / R16 — the beachhead pool (owner: founder A)
- D09 / R08 — prices within operator bounds (owner: founder A)
- D11 / R10 — 20% fee, operator-configurable (owner: founder A)
- D10 / R09 — disputes by the operator, no automatic refunds (owner: founder A)
- D31 — one role per account; the operator role is never combined with mentor (owner: founder A)
- D29 — prices, charges, fees and payouts are in EUR; S02's bounds and fee are EUR (owner: founder A)
- D28 / R20 and D30 — first-iteration payouts are by hand; the amount owed is the price less the 20% fee, recorded per paid session. Operator screens do not pay anyone (owner: founder A)
- D13 — E05 is 1.1 (owner: founder A)

## Compatibility notes
`BACKWARD_COMPATIBILITY.md` surfaces touched across the stories: "HTTP API routes and response envelope" (new routes, additive), "Database schema and migrations" (new tables, additive), "Session cookie and JWT" (read only), "Environment variables and config" (S02 seed values), "Package public exports" (additive `CrudForm` and ui exports). The file has no numbered sections and no list of admin headings; the reference's section numbers do not apply.

## How to pick this up
`om-auto-fix-issue <story number>` for each story once filed; this epic is the container. Prerequisite: E01-S03 (operator role and guards); E05-S03 also needs E03-S03.

## Out of scope
An admin role beyond the two founders (D19); a second role on the same account (D31); making payouts (D28, by hand); automatic refunds (R09); ranking or featuring mentors (R13, N02); open mentor registration (R07).

## Open questions
- What triggers pulling an operator story forward from 1.1 (the reference says more than one manual operator action a day for a week; the brief does not say) — non-blocking (owner: founder A)
- Where is the shared operator note kept? It is outside the repo and unverified — non-blocking (owner: founders A and B)

## Unverified claims
- The content of the E01-S03 and E02 drafts (written by other agents) is assumed, not read; names such as `STACK_TAGS` and the `invitations` concept are taken from the reference.
- The reference's "one manual operator action a day for a week" trigger is not found in this repo.

## 📋 Stories
<!-- om-backlog: checklist, rewritten on every run -->
- [ ] #54 E05-S01 — The operator invites a senior engineer from the beachhead pool in a batch of 20 and sees who published a slot within two weeks
- [ ] #55 E05-S02 — The operator sets the price bounds and the platform fee
- [ ] #56 E05-S03 — The operator resolves a quality dispute and records the outcome; no automatic refund

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-high` — touches sign-in, sessions, money, data scoping or a migration (SDLC risk-high rules)

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E05-S01 — #54 The operator invites a senior engineer from the beachhead pool in a batch of 20 and sees who published a slot within two weeks

**Issue:** [#54](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/54)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #33  
**Iteration:** 1.1 (D13)  

Backlog source: .ai/specs/product-brief.md
Backlog id: E05-S01
Epic: #33
Depends on: E01-S03 (#38)
Iteration: 1.1 (D13)

## Summary
- Problem: D18 makes the invitation the test of A03 (five of the first twenty invited mentors publish a bookable session within two weeks) and R17 fixes batches of 20. Without this story the founders send invitations by hand and count publishers in the shared operator note (R18). Source: `.ai/specs/research/decisions/D18-invitation-check-batches-of-20.md`; A03 in the brief is untested: one mentor replied "ok, ale pewnie powiem nie" (`.ai/specs/research/2026-09-03-interview-staff-engineer-declined-before.md`), and the 50-name mentor list has nobody contacted yet (`2026-09-04-mentor-list-note.md`, of which 29 have a warm contact for a first batch of 20). Verified code fact: no invitation concept exists, and `POST /api/mentors` is a public create, which is the opposite of R07.
- Who has it: the operator (founder A, founder B).
- Expected outcome: invitation batches capped at 20, a per-batch report of who published within two weeks, and the D18 stop shown and enforced; checked by the acceptance criteria and a denied-path test for non-operators.

## Spec
Design authority: `.ai/specs/product-brief.md`. An implementation spec is owed before implementing: `.ai/specs/2026-10-21-invitation-batches.md` (after the epic's operator spec, `.ai/specs/2026-10-21-operator.md`).

## Analysis
- Does not exist yet: `invitations` entity, service, port, schema, route; `STACK_TAGS`; slots (`availability`); a mailer port; `admin/layout.tsx`. These come from E02-S01 to S03 and E01-S02 (drafted separately; names below are proposals to align with those drafts).
- Exists: `packages/app/src/app/admin/mentors/page.tsx` and `admin-mentors.tsx` (reference pattern: `DataTable`, `CrudForm`, `apiCall`); `packages/core/src/http/auth.ts` (`requireSession`, `requireRole`); `packages/app/src/server/container.ts` (each service is one explicit registration line).
- Mandated by AGENTS.md: resolve services from the container (no `new` in routes), typed `AppError`s only, migrations generated with `npm run migration:create -w @devmentor/db`, no secrets in logs (the invitation token must not be logged), one `route.ts` per resource, 100% coverage, integration test.
- The invitation link is a credential: store only a hash of the token, expire it, single use.

## How to implement
1. Entity `InvitationBatch` (`packages/db/src/entities/invitations/invitation-batch.entity.ts`, `EntitySchema`, registered in `entities/index.ts`): number, `openedBy`, `openedAt`, `closedAt`, `resumedAt` nullable. Generated migration `npm run migration:create -w @devmentor/db`; `invitations.batch_id` is nullable first, then a "batch 0" backfill, then not null in a later release (expand/contract).
2. Constant `INVITATION_BATCH_SIZE = 20` (R17) in `packages/core/src/services/invitations/invitation.service.ts`, with a comment citing D18.
3. Service methods (an invitation is for a new mentor account; one role per account, D31, so `createInBatch` refuses an email that already belongs to an account with another role, including an operator): `openBatch(session)`, `createInBatch(session, batchId, { email, stackTags })` (refuses a 21st with `ConflictError`, tags only from the four of D24, R16), `report(batchId, now)` (accepted, publish due, published yes/no/pending), and `invitationsStopped(now)` (first batch fully past due and fewer than 5 publishers, D18). Ports in `packages/core/src/services/invitations/invitation-repository.port.ts`.
4. Zod schema `packages/core/src/validators/invitations/invitation-create.schema.ts`, exported through `@devmentor/core/validators`.
5. Routes `packages/app/src/app/api/operator/invitation-batches/route.ts` and `.../invitations/route.ts` with `apiHandler`; each calls `requireSession` then `requireRole(session, "operator")` first.
6. Page `packages/app/src/app/admin/invitations/page.tsx` (shadcn, `DataTable` per batch; `CrudForm` for a new invitation; stop banner). Register the service in `container.ts`.
7. Tests: batch full, report at the exact two-week boundary, stop rule, non-operator 403, token not logged. Integration test in `tests/integration/`: a mentor and a signed-out visitor are refused on the page and the routes.

## Acceptance criteria
- Given the operator, When they create an invitation with an email and stack tags from the four, Then an invitation link exists, is sent, and the batch count is shown. (R16, R17)
- Given a batch with 20 invitations, When the operator tries to add a 21st, Then the product says the batch is full and a new batch is a deliberate act. (R17)
- Given an accepted invitation, When two weeks have passed, Then the list shows whether that mentor published at least one slot, and the batch's count of publishers. (D18)
- Given fewer than 5 publishers of 20 at two weeks, When the operator opens the list, Then it says further invitations are stopped per D18 until the decliners are interviewed. (D18)
- Given a non-operator or a signed-out visitor, When they try to create an invitation or open the page, Then they are refused. (negative)
- Given an email that already belongs to an operator account, When the operator invites it as a mentor, Then it is refused, because an account has one role. (D31, negative)
- Given a tag outside TypeScript, React, Python and AI agents, When the operator saves, Then it is refused. (R16, negative)

## Decisions in play
- D08 — invitation only (owner: founder A)
- R07 — no open registration
- D18 / R17 — batches of 20; fewer than 5 of the first 20 stops invitations (owners: founders A and B)
- D24 / R16 — beachhead tags only (owner: founder A)
- D19 — the operator is the two founders (owners: founders A and B)
- D31 — one role per account; a founder who also mentors needs a separate mentor account (owner: founder A)

## Compatibility notes
`BACKWARD_COMPATIBILITY.md`: "Database schema and migrations" (new table, nullable-then-not-null column, migration tested up and down, rollback plan in the PR body); "HTTP API routes" (new routes, additive); "Zod schemas" (new). Any removal of the public `POST /api/mentors` belongs to E02-S01, not here. `risk-high` (grants a role): `needs-qa`, second reviewer, no self-QA.

## How to pick this up
`om-auto-fix-issue <issue number>` once filed. Prerequisite: E01-S03 merged; E02-S01 and E02-S03 (slots) for the publish check.

## Out of scope
The acceptance flow (E02-S01); interviewing decliners (a collection-plan activity); a real mail transport (E01-S02); measuring mentee visits (Q20).

## Open questions
- "A bookable session" (D18) versus "a slot published": must the slot be in the future and the mentor have prices (E02-S04) to count? — non-blocking (owner: founder A)
- An invitee who already has a mentee account: with one role per account (D31) the mentee account cannot become a mentor account, so is a second account with another email required, or is the role changed by hand? — non-blocking (owner: founder A)
- Who lifts the D18 stop after the decliner interviews and how it is recorded — non-blocking (owner: founders A and B)

## Unverified claims
- The shape of E02-S01 to S03 and E01-S02 (invitation, slot, mailer) is assumed from the reference; those drafts were not read.
- The mentor list is an anonymised export (ids only); how invited emails get into the product is not specified anywhere.

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-high` — touches sign-in, sessions, money, data scoping or a migration (SDLC risk-high rules)

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E05-S02 — #55 The operator sets the price bounds and the platform fee

**Issue:** [#55](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/55)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #33  
**Iteration:** 1.1 (D13)  

Backlog source: .ai/specs/product-brief.md
Backlog id: E05-S02
Epic: #33
Depends on: E01-S03 (#38)
Iteration: 1.1 (D13)

## Summary
- Problem: D09 says each mentor sets prices within operator-set bounds and D11 sets a 20% fee the operator can configure. Until this story ships, bounds and fee are fixed values the founders change by hand (R18). Source: `.ai/specs/research/decisions/D09-mentor-prices-within-operator-bounds.md`, `D11-platform-fee-20-percent.md`. Price evidence is thin and unsettled: the freelancer said "ponizej 200 to tak, z wlasnego" (`2026-09-02-interview-freelancer-react.md`), the brief's A01 row also cites "50 euro, 100 if it fixes it" (not found verbatim in the research files), and 3 of 54 survey respondents have ever paid anyone (`2026-09-04-survey-discord-willingness-to-pay.md`), so the bounds will need to move. D29 fixes the currency: everything is in EUR. Verified code fact: no price, bound, fee, booking or payment exists in the repo yet.
- Who has it: the operator (founder A, founder B).
- Expected outcome: an operator-only settings screen for the four bounds and the fee, validated, applied to later prices and later bookings, with out-of-bounds existing prices flagged, not changed; checked by the acceptance criteria.

## Spec
Design authority: `.ai/specs/product-brief.md`. Implementation spec owed before implementing: `.ai/specs/2026-10-21-platform-settings.md`.

## Analysis
- Does not exist yet: `PlatformSettings` entity, a settings service, mentor prices (E02-S04), the fee split (E03-S06), any `operator` concept folder. `env.ts` has no price or fee variable; E02-S04 (drafted separately) is expected to introduce the interim values. Read that draft for the variable names before coding.
- Exists: `packages/core/src/config/env.ts` (zod `envSchema`), `packages/core/src/http/makeCrudRoute.ts` (its `update` entry takes a schema and `authorize` hook; PUT is available), `packages/core/src/http/auth.ts` (`requireRole`).
- `packages/ui/src/backend/forms/CrudForm.tsx` cannot yet edit an existing record: fields are `text | email | password`, values start as `""` and reset after success, there is no number field or initial values. Using it as the reference says needs an additive extension (initial values, `type: "number"`, keep existing behavior) with tests. Values arrive as strings, so the schema must coerce.
- The mentor entity today is only `name`, `email`, `createdAt` (`packages/db/src/entities/mentors/mentor.entity.ts`); the flag-out-of-bounds list needs E02-S04's price columns.
- AGENTS.md: money is `risk-high`; prices are recomputed server-side; integers only (euro cents; the platform has one currency, EUR, D29, so no currency column), magic numbers get a named constant (the 20 default). D30 makes the amount owed to a mentor the price less this fee, recorded per paid session for manual payout (D28), so the fee that applied at payment must be stored with that record (E03).

## How to implement
1. Entity `PlatformSettings` (`packages/db/src/entities/operator/platform-settings.entity.ts`): one row with a fixed id, min and max for 25 and 50 minutes in cents, `feePercent`, `updatedBy`; amounts are EUR cents by D29 (a named constant, not a column). Generated migration seeds the row from the interim values E02-S04 uses, so behavior does not change on deploy.
2. Service `packages/core/src/services/operator/platform-settings.service.ts`: `get()` and `update(session, input)` (operator only); consumers (`updatePrices`, payment confirmation) go through `get()` only. Register in `container.ts`.
3. Schema `packages/core/src/validators/operator/platform-settings-update.schema.ts`: integers above 0, min not above max per length, fee from 0 to 100.
4. Mentor service: list mentors whose current prices fall outside new bounds for display; never modify them (R08: held to the bounds on their next save).
5. Route `packages/app/src/app/api/operator/settings/route.ts` (GET, PUT; `makeCrudRoute` with `authorize` calling `requireSession` and `requireRole(session, "operator")`). Page `packages/app/src/app/admin/settings/page.tsx` (shadcn) with the flagged mentors below the form.
6. Extend `CrudForm` additively (step above) and export from `packages/ui/src/index.ts`.
7. Tests: min above max, fee 101, non-operator 403, signed-out 401, flagged prices unchanged, later bookings use the new fee (with E03-S06's stored snapshot). Integration test for the denied path.

## Acceptance criteria
- Given the operator, When they set a minimum and a maximum for 25- and 50-minute prices in EUR, Then mentors setting prices from then on are held to them, and existing prices outside the new bounds are flagged, not changed. (R08)
- Given the operator, When they set the platform fee, Then later paid sessions use it; the default is 20%. (R10)
- Given a session already paid, When the fee changes, Then that session keeps its earlier fee, and the amount owed to its mentor is unchanged. (R10, D30, negative)
- Given a fee outside 0 to 100% or a minimum above the maximum, When saved, Then the save is refused. (negative)
- Given a non-operator or a signed-out visitor, When they open the screen or call the route, Then they are refused. (negative)

## Decisions in play
- D09 / R08 — prices within operator-set bounds (owner: founder A)
- D11 / R10 — 20% fee, operator-configurable; the vault fee is set later (owner: founder A)
- D29 — all prices, fees and payouts are in EUR (owner: founder A)
- D30 — amount owed to the mentor is the price less the fee, recorded per paid session (owner: founder A)
- D19 — the operator is the two founders (owners: founders A and B)

## Compatibility notes
`BACKWARD_COMPATIBILITY.md`: "Database schema and migrations" (new table, migration up and down, rollback plan); "Environment variables and config" (E02-S04's interim variables become seed values and are removed only with a one-release fallback and README note); "Package public exports" (additive `CrudForm` change); "HTTP API routes" (new route, additive). `risk-high` (money): `needs-qa`, second reviewer, failure and idempotency tests, no self-QA.

## How to pick this up
`om-auto-fix-issue <issue number>` once filed. Prerequisites: E01-S03; E02-S04 (prices) so there is something to bound.

## Out of scope
The fee split and payout (E03-S06); per-mentor exceptions to the bounds; the vault fee (D11); a second currency or conversion (D29); recording or making payouts (D28, D30).

## Open questions
- Initial values for the four bounds, in EUR: D29 fixes the currency but not the values, and the brief supplies none (A01 shows only stated intent) — non-blocking (owner: founder A)

## Unverified claims
- E02-S04 and E03-S06 are drafted by other agents and were not read; the interim variable names, price columns and fee snapshot are assumed from the reference.
- The "50 euro, 100 if it fixes it" quote is only in the brief's A01 row; grep of `.ai/specs/research/` did not find it.

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-high` — touches sign-in, sessions, money, data scoping or a migration (SDLC risk-high rules)

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E05-S03 — #56 The operator resolves a quality dispute and records the outcome; no automatic refund

**Issue:** [#56](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/56)  
**Labels:** feature, priority-medium, risk-medium  
**Epic:** #33  
**Iteration:** 1.1 (D13)  

Backlog source: .ai/specs/product-brief.md
Backlog id: E05-S03
Epic: #33
Depends on: E03-S03 (#46)
Iteration: 1.1 (D13)

## Summary
- Problem: D10 sends quality disputes to the operator and forbids automatic refunds (R09). Until this ships a dispute arrives by e-mail and is logged by hand (R18). The wish behind it: the freelancer asked for "zwrot tego samego dnia a nie jakis ticket" (same-day refund, not a ticket) when a mentor does not come, and A05 (mentees accept forfeiting the fee) has no material (`.ai/specs/research/2026-09-02-interview-freelancer-react.md`, brief A05). Verified code fact: there are no bookings, sessions, payments or disputes in the repo.
- Who has it: a mentee or mentor of a held session; the operator.
- Expected outcome: a party raises a dispute after the session started; the operator resolves it from the written answer, the booking record and statements from the two parties, and records an outcome that both parties see, and the product moves no money; checked by the acceptance criteria and a test that the dispute service has no payment-gateway dependency. The session itself is not in the product (D27, R19), so the operator cannot read it.

## Spec
Design authority: `.ai/specs/product-brief.md`. Implementation spec owed before implementing: `.ai/specs/2026-10-21-quality-disputes.md`.

## Analysis
- Does not exist yet: a `disputes` concept (entity, service, schemas, routes, page), a written answer (E04-S02), bookings and payments (E03-S02, S03), a payment-gateway port, notifications, `core/src/events`. AGENTS.md adds an event emitter only when the first feature needs one; do not create one here just for `disputes.dispute.resolved`.
- Exists: `requireSession`, `requireRole`, `assertOwns` in `packages/core/src/http/auth.ts`; `DataTable` for the open list. There are no shadcn `Input`, `Textarea`, `Select` or `Dialog` in `packages/ui/src/components/ui/` (only button, badge, card, table) and no `components.json`, so the resolve form needs primitives added (`npx shadcn@latest add`, which may need a one-time `components.json`) or a `CrudForm` extension; `CrudForm` has no select or textarea.
- D27 / R19 close Q18: the text session happens in a channel the mentor names, outside DevMentor, and the product keeps only the written answer and the note. The operator cannot read session text because it is not in the product, and there is no session screen. Evidence for a dispute is the written answer (E04-S02), the booking record (time, parties, the start time recorded under R15, the channel the mentor named) and statements from the two parties, entered through the dispute form. The operator-reads-session scoping exception in the reference is dropped; the operator view still needs an isolation test so it shows only the disputed booking.
- The operator reading a session is a scoping exception: an operator-only service method, never the party path, with an isolation test (SDLC.md data scoping).
- Reference depends only on E03-S03, but operator-only access also needs E01-S03, and the written answer needs E04-S02; see Divergences.

## How to implement
1. Entity `Dispute` (`packages/db/src/entities/disputes/dispute.entity.ts`): booking, `raisedBy`, `reason`, `status` (open or resolved), `outcome` (no refund, refund done by hand), `outcomeNote`, `refundedCents` (EUR, D29, only for a by-hand refund), `resolvedBy`, `resolvedAt`. Generated migration; a partial unique index allows one open dispute per booking.
2. Schemas `dispute-create.schema.ts` and `dispute-resolve.schema.ts` under `packages/core/src/validators/disputes/`.
3. `dispute.service.ts` (constructor takes repositories and the session reader only, no payment port): `raise` (party only, booking's start time passed; takes the reason and the party's statement), `listOpen` and `getForOperator` (operator only; returns the booking record, the written answer if any, and both parties' statements, never session content), `resolve` (operator only; records outcome and note).
4. Routes with `apiHandler`: `api/disputes/route.ts` (POST, party), `api/operator/disputes/route.ts`, `.../[id]/route.ts`, `.../[id]/resolve/route.ts`; each calls `requireSession` and the role or ownership check first.
5. UI: a "Raise a dispute" form on the mentee's and the mentor's booking page (the page that shows the booking and the written answer), shown only after the start time; `packages/app/src/app/admin/disputes/page.tsx` with the booking record, written answer, both statements and the resolve form, saying "recorded; refunds, if any, are done by hand in Stripe". Both parties see the outcome on their booking page; notification through the E03-S04 mechanism.
6. Tests: non-party 403, before-start refused, mentor cannot resolve, second open dispute refused, a party's statement is stored and shown to the operator, both parties see the outcome, dispute service resolves with no gateway registered in the container. Integration test for the denied paths and wrong-scope read.

## Acceptance criteria
- Given a mentee or a mentor of a booking whose start time has passed, When they raise a dispute with a statement, Then it reaches the operator with the booking record, the written answer if one exists, and the statement; the operator is not shown session text, which is not in the product. (R09, R19)
- Given a dispute with statements from both parties, When the operator reviews it, Then the outcome is decided from the written answer, the booking record and those statements, and the outcome note says so. (R09, R19)
- Given a dispute, When the operator records an outcome (no refund, or a refund done by hand in Stripe with its amount in EUR, never more than the price paid), Then both parties see the outcome and the product itself moves no money. (R09, negative)
- Given a user who is not a party to the session, When they try to raise a dispute on it, Then they are refused. (negative)
- Given a booking whose start time has not passed, When a party tries to raise a dispute, Then it is refused. (negative)
- Given a mentor or mentee, When they call a resolve route, Then they are refused; only the operator resolves. (negative)

## Decisions in play
- D10 / R09 — disputes by the operator, no automatic refunds (owner: founder A)
- D29 — refund amounts are in EUR (owner: founder A)
- D30 / D28 — the amount owed to a mentor is recorded per paid session and paid by hand; an outcome may need to adjust it (owner: founder A)
- D31 — one role per account (owner: founder A)
- R18 — by-hand operator actions are logged (owners: founders A and B)
- D19 — the operator is the two founders (owners: founders A and B)
- D27 / R19 — the text session happens in a channel the mentor names; the product keeps the written answer and the note (owner: founder A)
- N01 — sessions are text (owner: founder A)
- N02 — no ratings; a dispute is not a rating signal (owner: founder A)

## Compatibility notes
`BACKWARD_COMPATIBILITY.md`: "Database schema and migrations" (new table, up and down, rollback plan); "HTTP API routes" (new routes, additive); "Domain events" only if an emitter exists by then. The operator sees only the disputed booking, its written answer and the parties' statements (isolation test), not session content. `risk-medium` (no money moved), `needs-qa`; treat as `risk-high` if the spec makes a dispute pause a payout.

## How to pick this up
`om-auto-fix-issue <issue number>` once filed. Prerequisites: E03-S03 and E04-S02 (written answer) merged, E01-S03 for the operator guard.

## Out of scope
Automatic refunds (R09); mentor-initiated cancellation (D10 is silent); ratings as a dispute signal (N02); pausing a payout (see questions).

## Open questions
- A dispute about what was said in the channel rests on the parties' statements alone; should either party be able to attach an excerpt from that channel? Not decided in D27 — non-blocking (owner: founder A)
- Payouts are by hand in the first iteration (D28): does an open dispute hold the mentor's amount owed (D30), and does a refund change it? D30 leaves late-cancelled bookings undecided too — non-blocking (owner: founder A)
- A founder who mentors holds a separate mentor account (D31): may an operator resolve a dispute on that founder's own mentor account? — non-blocking (owners: founders A and B)

## Unverified claims
- Contents of the E03 and E04 drafts (booking, written answer, notification names, the channel field on the mentor page) are assumed from the reference and D27.
- none beyond the cross-story assumptions above (the freelancer quote was checked in the interview file).

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-medium` — ordinary single-area change that ships with tests

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E06 — #34 Later (parked)

**Issue:** [#34](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/34)  
**Labels:** feature, priority-low, risk-low  

Backlog source: .ai/specs/product-brief.md
Backlog id: E06

## Summary
- Problem: the brief's Scope names things that are deliberately deferred, and the Non-goals table names two things 1.0 will not build. Without one visible parking place, an agent or a founder can pick a deferred idea up by accident, or re-file it under a new epic. Source: `.ai/specs/product-brief.md` (Scope, Later; Non-goals). Verified code fact: none of the deferred items has code in this repo.
- Who has it: the founders, as scope owners (founder A decides scope; founders A and B own D02, D18 and D19).
- Expected outcome: a single parked epic with no stories and no iteration; nothing here is scheduled, and each bullet says what would unpark it. Checked by: the epic has no child issues, and any story drafted from a bullet first goes through the owner's superseding record.

This epic holds bullets only. Do not file stories, and do not implement anything listed here. Unparking a bullet means a new story under a real epic, with the owner's approval where a rule or decision is superseded.

## Spec
Design authority: `.ai/specs/product-brief.md`. No implementation spec is owed: nothing is implemented. A spec is owed per bullet at the moment it is unparked.

## Analysis
Deferred items, from Scope, Later, each tied to the rule or decision that defers it (ids from the brief):
- The vault and anything published from a session (D05; also D02, nothing published without the mentee's approval, and D11, the vault fee is set when the vault returns). 1.0 ends with the written answer and a privately kept note.
- Search or ranking of mentors (R13, D21); 1.0 has a stack-tag filter and a most-recent-availability order only.
- Automatic refunds (R09, D10); 1.0 resolves disputes by hand through the operator (E05-S03).
- A second payment provider (R05, D04); Stripe Checkout and Connect only.
- An admin role beyond the two founders (D19).
- Co-editing the note (R12, D20); the mentor drafts, the mentee approves in full or declines with a comment.
- Open mentor registration (R07, D08); invitation only.
- Stacks outside TypeScript, React, Python and AI agents (R16, D24).
- A mentor-owned knowledge layer inside the coding agent: the founders' hypothesis, marked Later in the brief and not a decision (`[ASSUMPTION]`, `2026-09-02-miro-board-product-goals.md`).

Not parked here: the public home page has its own epic, E07 (the brief says it is outside D13's first iteration and founder A decides whether it ships with 1.0).

## How to implement
Nothing to implement. When a bullet is unparked: (1) write a superseding record or decision row approved by its owner (SDLC.md, Product decisions as a protected contract); (2) write the spec for that bullet; (3) file a story under a new or existing real epic via `om-backlog`; (4) remove the bullet here in the same change.

## Acceptance criteria
- Given this epic, When someone looks for child issues, Then there are none and no story is filed against it.
- Given a pull request that builds a bullet above without a superseding record, When it is reviewed, Then it is a blocker quoting the rule or decision id. (SDLC.md)
- Given a pull request that builds video calls (N01) or a ratings or reviews profile (N02), When it is reviewed, Then it is a blocker; these are non-goals, not parked ideas. (negative)

## Decisions in play
- N01 — "We are not building video calls; sessions are text." Why: workshop constraint; mentee: "text is fine, faster" (owner: founder A)
- N02 — "We are not building ratings or a reviews profile; each mentor links public work instead." Why: all three mentors refuse ratings; two mentees distrust them (owner: founder A)
- D05, R13, R09, R05, D19, R12, R07, R16 — the rules and decisions that defer the bullets above (owners as in the brief: founder A, except D19, owned by founders A and B)
- D13 — the iteration split (owner: founder A)

## Compatibility notes
No protected surface changes: this epic changes no code.

## How to pick this up
Not pickable. An agent that finds this epic as the next item should stop and ask the owner. Do not run `om-auto-fix-issue` on it.

## Out of scope
Everything in it; also anything that would reverse N01 or N02, which are Non-goals rather than Later.

## Open questions
- Review-by dates for the parked bullets are `unknown` in the brief; when should the founders revisit them? — non-blocking (owner: founder A)
- Q23 — the reference backlog cites decisions (D06, D12, D14, D15, D17, D23, D25, D26) not adopted here; if any of them defers more work, it belongs on this list — non-blocking (owner: founder A)

## Unverified claims
- The reference's own wording of the "Later" bucket is not in `full-backlog.md`; the list is taken from this repo's brief, not from the reference.
- Whether the founders want the knowledge layer parked here or only in the brief is not stated.

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-low` — parked, not built now
- `risk-low` — parked work with no code

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.


### E07 — #35 Public home page

**Issue:** [#35](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/issues/35)  
**Labels:** feature, priority-medium, risk-medium  

Backlog source: .ai/specs/product-brief.md
Backlog id: E07

## Summary
- Problem: `packages/app/src/app/page.tsx` is not a neutral placeholder. It is the port of the "Mentora" concept prototype's tutor-marketplace home page (`.ai/specs/implemented/2026-10-19-mentora-homepage.md`): the headline "Find the perfect tutor and start learning today", a subject search over languages, music and exams, a stats row ("900+ Verified tutors", "4.8/5 Average rating", "40k+ Lessons delivered"), and "Featured tutors" cards with ratings, review counts, "Super tutor" badges and hourly prices from `FEATURED_TUTORS` in `packages/core/src/catalog.ts`. None of this describes DevMentor (bookable 25- or 50-minute text sessions with invited senior engineers, D01, D08) and part of it contradicts N02 (no ratings or reviews). The page title is "DevMentor — Learn anything, from real people". Source: the code, read on 2026-10-21; the brief's Scope names the public home page as E07, outside D13's first iteration.
- Who has it: mentees (developers stuck on a specific problem, brief Target group) arriving at `/` from the mentor list or a share link (D21); founders, whose D16 metric (10 paid sessions a week for two consecutive weeks by 2026-12-31) depends on a funnel that starts here.
- Expected outcome: `/` explains what DevMentor sells in the brief's own terms and links into the real app; no fictional statistics, ratings or people unless the owner decides otherwise. Checked by the acceptance criteria below and a browser check of the narrow-viewport state (SDLC.md QA state matrix).

## Spec
Design authority: `.ai/specs/product-brief.md` (Vision, Scope, R01, R03, R14, N01, N02, D16, D21). There is no design prototype for the target page in this repo: the reference's `prototypes/devmentor-journey` screen s17, `docs/designs/`, and the platform-primitives spec "F1" (`.ai/specs/2026-09-04-platform-primitives.md`) do not exist here. The only prototype is `mentoring-portal-concept/` (Mentora, a tutor marketplace with video lesson rooms and reviews, which conflicts with N01 and N02), so it cannot be the design source. An implementation spec `.ai/specs/2026-10-21-home-page.md` is owed before implementing (AGENTS.md), and it must include the copy, since copy is the design here. `om-auto-write-spec` on this issue can write it. `.ai/specs/implemented/2026-10-19-mentora-homepage.md` is history, not authority.

## Analysis
Verified:
- Present: `packages/app/src/app/page.tsx` plus `page.test.tsx` (asserts the old title, h1, stats, tutors); `packages/ui/src/{site-header,site-footer,search-bar,tutor-card}.tsx` (Tailwind, tuned to the `mentora-*` colour tokens in `packages/app/src/app/globals.css`); `packages/core/src/catalog.ts` (`SUBJECTS`, `FEATURED_TUTORS`, a "Mentora concept prototype" code comment). The `mentora-*` names are internal class and token names, not user-facing text; AGENTS.md forbids "Mentora" only in user-facing copy.
- Styling rule that applies (AGENTS.md): public pages use Tailwind utilities, `/admin/*` uses shadcn/ui. This settles the reference's blocking "F1 versus design system" question: use Tailwind on `/`. `Button`, `Badge`, `Card` in `packages/ui/src/components/ui/` are shadcn primitives for admin; whether the homepage reuses them is a spec choice (non-blocking). There is no `MentorRatingSummary`, `TechnologyChips` or `theme-bridge.css`.
- Does not exist: `/sign-in`, role homes (`/mentor`, `/home`, `/admin` dashboard), `homeFor`, `packages/app/src/lib/session.ts`, a session reader (`packages/core/src/http/auth.ts` has `requireSession` for API routes only), `/api/health`, `/m/<slug>`. `/mentors` exists but lists registered mentors with their email addresses (`packages/app/src/app/mentors/page.tsx`); E03-S01 and E02-S02 are expected to replace it. The reference's "Open the admin dashboard" and "Health check" buttons are not on this page.
- The page is static and uses no database (it imports only `@devmentor/core` catalog data and `@devmentor/ui`); keep it that way so it builds and renders without PostgreSQL. `tests/integration/mentors.int.test.ts` ("renders the DevMentor home page") asserts the old title, h1 and "Ana Ruiz", and must be updated.
- Coverage: `vitest.config.mts` includes `packages/*/src/**` by glob, so new files count automatically; `unit-dom` already covers `packages/app/src/app/**/*.test.tsx`.
- `BACKWARD_COMPATIBILITY.md`: removing `FEATURED_TUTORS`, `SUBJECTS`, `TutorCard`, `SearchBar` is a change to "Package public exports"; their only consumer is this page.

## How to implement
Proposed stories (not filed; this epic is the container; ids are proposals):
1. E07-S01 — Core page: hero (what DevMentor is, the three facts "1:1 text sessions", "25 or 50 minutes", "Written answer included", R01, R03, D05), "how it works" (choose a mentor, choose a time, discuss your code), closing call to action to `/mentors`, header and footer in DevMentor wording. Removes the stats row, subject search, tutor cards and every rating. Removes unused `catalog.ts` exports, `TutorCard`, `SearchBar` and their tests in the same PR (100% coverage).
2. E07-S02 — "During your session": a text-conversation example and a written-answer example, labelled as an example.
3. E07-S03 — Mentor band, blocked on the question below.
4. E07-S04 — Account action ("Sign in" or "My workspace"), after E01-S01 and E01-S03 exist; until then omit it rather than render a dead link (the rule the implemented homepage spec already used).
5. E07-S05 — update `page.test.tsx` and the integration test with the new copy; a browser check of the narrow viewport.

## Acceptance criteria
- Given a visitor, When they open `/`, Then they see what DevMentor sells in the brief's terms and a primary action to `/mentors`. (D21)
- Given the page, When it is read, Then it states sessions are text (R03) and makes no promise of speed (R14).
- Given the page, When it is read, Then it shows no star rating, review count, "verified tutors" or lesson-count statistic, and no video. (N02, N01, negative)
- Given the page, When "Mentora" is searched in the rendered text, Then there is no match. (negative)
- Given no database reachable, When `/` is requested, Then it renders. (negative)
- Given a narrow viewport, When `/` is opened, Then chips wrap and actions stack without horizontal scroll.
- Given a signed-out visitor, When they view the header, Then there is no dead account link; once E01 ships it shows "Sign in".

## Decisions in play
- D16 — the 1.0 metric the funnel serves (owner: founder A)
- D21 — acquisition by the stack-tag list or a share link (owner: founder A)
- D01 / R01, N01 / R03, D05, R14 — facts the copy may state and promises it must not make (owner: founder A)
- N02 — no ratings or reviews profile (owner: founder A); D26, cited by the reference to narrow N02, is not adopted here (Q23)
- D08 / R07 — invited mentors; no "become a mentor" sign-up on the page (owner: founder A)

## Compatibility notes
`BACKWARD_COMPATIBILITY.md`: "Package public exports" if `TutorCard`, `SearchBar` or the catalog exports are removed (update every consumer in the same PR). No API route, schema, cookie or env change.

## How to pick this up
`om-auto-write-spec <issue number>` first (the spec is owed), then `om-auto-implement-spec`; or story by story with `om-auto-fix-issue` once stories are filed. Founder A decides whether this ships with 1.0.

## Out of scope
Video calls (N01); ratings or review persistence (N02); open mentor registration (D08); freelance hiring; a CMS; changes to `/mentors` or the signed-in screens (E03-S01 owns the list).

## Open questions
- Shipping example mentors: the reference's mentor band uses a fictional mentor and fictional reviews. Fictional people or reviews on production conflict with N02 and the brief's rule that every mentor page links real public work (R04). Options: feature a real invited mentor with consent, a band without ratings, or no band for 1.0 — blocking for the mentor-band story only (owner: founder A)
- Does this ship with 1.0? It is not among D13's first-iteration stories — non-blocking (owner: founder A)
- Epic id E07 and the label classification were chosen without confirmation — non-blocking (owner: founder A)
- Should the homepage reuse shadcn `Button`/`Badge`, or Tailwind only? — non-blocking (owner: spec author)

## Unverified claims
- Whether the old page had DB-free behavior beyond what its imports show was not run; no build was executed for this draft.
- The facts-chip copy ("1:1 text sessions" etc.) comes from the reference and has not been checked against founder wording.

## 🏷️ Label rationale

🤖 `om-backlog` via `om-prepare-issue` — one label per line with the reason:
- `feature` — the item is a product capability
- `priority-medium` — ordinary feature work, also the default reading of unset
- `risk-medium` — ordinary single-area change that ships with tests

## 📝 Design authority

The brief, its decisions and the acceptance criteria above: https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_project/blob/docs/devmentor-discovery/.ai/specs/product-brief.md (decision records in `.ai/specs/research/decisions/`); on PR #21 until it merges.

