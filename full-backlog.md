# DevMentor — full backlog

Every issue on the DevMentor tracker, with its description as it stands on GitHub. Generated from [open-mercato/ai_techleaders_project](https://github.com/open-mercato/ai_techleaders_project/issues).

The epics and stories below come from `.ai/specs/product-brief.md` and are mapped to issue numbers in `.ai/specs/backlog.md`.

The tracker is the authority; this file is a snapshot for reading in one place.

## Index

### Product tree

| Id | Issue | Title | Epic | Depends on | Iteration |
|---|---|---|---|---|---|
| [E01](#e01--7-accounts-and-roles) | [#7](https://github.com/open-mercato/ai_techleaders_project/issues/7) | Accounts and roles |  |  |  |
| [E01-S01](#e01-s01--12-a-developer-or-invited-mentor-signs-in-with-github-and-lands-in-their-roles-home) | [#12](https://github.com/open-mercato/ai_techleaders_project/issues/12) | A developer or invited mentor signs in with GitHub and lands in their role's home | #7 |  | first (D13) |
| [E01-S02](#e01-s02--13-a-user-without-github-signs-in-with-email-and-password) | [#13](https://github.com/open-mercato/ai_techleaders_project/issues/13) | A user without GitHub signs in with email and password | #7 | E01-S01 (#12) | first (D13) |
| [E01-S03](#e01-s03--14-a-signed-in-user-sees-only-their-roles-screens-the-operator-role-belongs-to-the-two-founders) | [#14](https://github.com/open-mercato/ai_techleaders_project/issues/14) | A signed-in user sees only their role's screens; the operator role belongs to the two founders | #7 | E01-S01 (#12) | first (D13) |
| [E02](#e02--8-mentors-become-bookable) | [#8](https://github.com/open-mercato/ai_techleaders_project/issues/8) | Mentors become bookable |  |  |  |
| [E02-S01](#e02-s01--15-an-invited-senior-engineer-accepts-the-invitation-and-gets-a-mentor-account-there-is-no-open-registration) | [#15](https://github.com/open-mercato/ai_techleaders_project/issues/15) | An invited senior engineer accepts the invitation and gets a mentor account; there is no open registration | #8 | E01-S01 (#12) | first (D13) |
| [E02-S02](#e02-s02--16-a-mentor-fills-the-mentor-page-public-work-link-description-stack-tags-and-gets-a-share-link-no-ratings) | [#16](https://github.com/open-mercato/ai_techleaders_project/issues/16) | A mentor fills the mentor page (public-work link, description, stack tags) and gets a share link; no ratings | #8 | E02-S01 (#15) | first (D13) |
| [E02-S03](#e02-s03--17-a-mentor-publishes-slots-and-sees-them-taken-as-they-are-booked) | [#17](https://github.com/open-mercato/ai_techleaders_project/issues/17) | A mentor publishes slots and sees them taken as they are booked | #8 | E02-S01 (#15) | first (D13) |
| [E02-S04](#e02-s04--18-a-mentor-sets-25--and-50-minute-prices-within-the-operators-bounds) | [#18](https://github.com/open-mercato/ai_techleaders_project/issues/18) | A mentor sets 25- and 50-minute prices within the operator's bounds | #8 | E02-S01 (#15) | first (D13) |
| [E02-S05](#e02-s05--19-a-mentor-completes-stripe-connect-onboarding-and-sees-whether-payouts-are-enabled) | [#19](https://github.com/open-mercato/ai_techleaders_project/issues/19) | A mentor completes Stripe Connect onboarding and sees whether payouts are enabled | #8 | E02-S01 (#15) | 1.1 (D13) |
| [E03](#e03--9-booking-and-payment) | [#9](https://github.com/open-mercato/ai_techleaders_project/issues/9) | Booking and payment |  |  |  |
| [E03-S01](#e03-s01--20-a-mentee-finds-a-mentor-in-a-list-filtered-by-stack-tag-ordered-by-most-recent-published-availability-no-search-no-ranking) | [#20](https://github.com/open-mercato/ai_techleaders_project/issues/20) | A mentee finds a mentor in a list filtered by stack tag, ordered by most recent published availability; no search, no ranking | #9 | E02-S02 (#16), E02-S03 (#17) | 1.1 (D13) |
| [E03-S02](#e03-s02--21-a-mentee-picks-a-slot-that-starts-at-least-two-hours-ahead-and-a-25--or-50-minute-length-at-the-mentors-price) | [#21](https://github.com/open-mercato/ai_techleaders_project/issues/21) | A mentee picks a slot that starts at least two hours ahead and a 25- or 50-minute length at the mentor's price | #9 | E02-S03 (#17), E02-S04 (#18), E01-S01 (#12) | first (D13) |
| [E03-S03](#e03-s03--22-a-mentee-pays-through-stripe-checkout-the-booking-is-confirmed-only-after-payment-booking-to-start-is-recorded) | [#22](https://github.com/open-mercato/ai_techleaders_project/issues/22) | A mentee pays through Stripe Checkout; the booking is confirmed only after payment; booking-to-start is recorded | #9 | E03-S02 (#21) | first (D13) |
| [E03-S04](#e03-s04--23-the-mentor-and-the-mentee-are-told-about-a-confirmed-booking-and-each-sees-their-upcoming-sessions) | [#23](https://github.com/open-mercato/ai_techleaders_project/issues/23) | The mentor and the mentee are told about a confirmed booking and each sees their upcoming sessions | #9 | E03-S03 (#22) | first (D13) |
| [E03-S05](#e03-s05--24-a-mentee-cancels-free-up-to-24-hours-before-a-session-a-later-cancellation-forfeits-the-fee) | [#24](https://github.com/open-mercato/ai_techleaders_project/issues/24) | A mentee cancels free up to 24 hours before a session; a later cancellation forfeits the fee | #9 | E03-S03 (#22) | 1.1 (D13) |
| [E03-S06](#e03-s06--25-devmentor-keeps-20-of-a-paid-session-and-the-mentors-share-is-paid-out-through-stripe-connect) | [#25](https://github.com/open-mercato/ai_techleaders_project/issues/25) | DevMentor keeps 20% of a paid session and the mentor's share is paid out through Stripe Connect | #9 | E03-S03 (#22), E02-S05 (#19) | 1.1 (D13) |
| [E04](#e04--10-session-written-answer-and-note) | [#10](https://github.com/open-mercato/ai_techleaders_project/issues/10) | Session, written answer, and note |  |  |  |
| [E04-S01](#e04-s01--26-at-the-slots-start-the-mentee-and-the-mentor-hold-a-25--or-50-minute-text-session-in-devmentor-every-session-screen-says-sessions-are-text) | [#26](https://github.com/open-mercato/ai_techleaders_project/issues/26) | At the slot's start the mentee and the mentor hold a 25- or 50-minute text session in DevMentor; every session screen says sessions are text | #10 | E03-S03 (#22) | first (D13) |
| [E04-S02](#e04-s02--27-the-mentor-gives-the-written-answer-and-the-mentee-sees-it-after-the-session) | [#27](https://github.com/open-mercato/ai_techleaders_project/issues/27) | The mentor gives the written answer and the mentee sees it after the session | #10 | E04-S01 (#26) | first (D13) |
| [E04-S03](#e04-s03--28-the-mentor-drafts-a-session-note-and-the-mentee-sees-it-awaiting-approval) | [#28](https://github.com/open-mercato/ai_techleaders_project/issues/28) | The mentor drafts a session note and the mentee sees it awaiting approval | #10 | E04-S02 (#27) | first (D13) |
| [E04-S04](#e04-s04--29-the-mentee-approves-the-note-in-full-or-declines-it-with-a-comment-an-approved-note-is-kept-privately-by-both-nothing-is-published) | [#29](https://github.com/open-mercato/ai_techleaders_project/issues/29) | The mentee approves the note in full or declines it with a comment; an approved note is kept privately by both; nothing is published | #10 | E04-S03 (#28) | first (D13) |
| [E05](#e05--11-operator-functions-in-10) | [#11](https://github.com/open-mercato/ai_techleaders_project/issues/11) | Operator functions in 1.0 |  |  |  |
| [E05-S01](#e05-s01--30-the-operator-invites-a-senior-engineer-from-the-beachhead-pool-in-a-batch-of-20-and-sees-who-published-a-slot-within-two-weeks) | [#30](https://github.com/open-mercato/ai_techleaders_project/issues/30) | The operator invites a senior engineer from the beachhead pool in a batch of 20 and sees who published a slot within two weeks | #11 | E01-S03 (#14) | 1.1 (D13) |
| [E05-S02](#e05-s02--31-the-operator-sets-the-price-bounds-and-the-platform-fee) | [#31](https://github.com/open-mercato/ai_techleaders_project/issues/31) | The operator sets the price bounds and the platform fee | #11 | E01-S03 (#14) | 1.1 (D13) |
| [E05-S03](#e05-s03--32-the-operator-resolves-a-quality-dispute-and-records-the-outcome-no-automatic-refund) | [#32](https://github.com/open-mercato/ai_techleaders_project/issues/32) | The operator resolves a quality dispute and records the outcome; no automatic refund | #11 | E03-S03 (#22) | 1.1 (D13) |
| [E07](#e07--85-public-home-page) | [#85](https://github.com/open-mercato/ai_techleaders_project/issues/85) | Public home page |  |  |  |

## Product tree

### E01 — #7 Accounts and roles

**Issue:** [#7](https://github.com/open-mercato/ai_techleaders_project/issues/7)  
**Labels:** feature, priority-medium, risk-high

<!-- devmentor-ui-designs:start -->
#### UI designs

Finished screen compositions from the DevMentor design system. Open an image to view it at full size.

[Component and prototype source](https://github.com/open-mercato/ai_techleaders_project/tree/9e40854b626ee3542345cf6c3d83bbd73695c46a) | [Screen source and state map](https://github.com/open-mercato/ai_techleaders_project/blob/9e40854b626ee3542345cf6c3d83bbd73695c46a/prototypes/devmentor-journey/README.md)

##### Sign-in — #12

![E01-S01: GitHub and email sign-in](https://github.com/open-mercato/ai_techleaders_project/blob/7018d0f/docs/designs/e01/01-sign-in.png?raw=true)

<details>
<summary>Registration and email verification — #13</summary>

![E01-S02: Create an account](https://github.com/open-mercato/ai_techleaders_project/blob/7018d0f/docs/designs/e01/02-create-account.png?raw=true)

![E01-S02: Check your inbox](https://github.com/open-mercato/ai_techleaders_project/blob/7018d0f/docs/designs/e01/03-check-your-inbox.png?raw=true)

![E01-S02: Email verified](https://github.com/open-mercato/ai_techleaders_project/blob/7018d0f/docs/designs/e01/04-email-verified.png?raw=true)

</details>

<details>
<summary>Mentee, mentor and operator screens — #14</summary>

![E01-S03: Mentee first visit](https://github.com/open-mercato/ai_techleaders_project/blob/7018d0f/docs/designs/e01/05-mentee-first-home.png?raw=true)

![E01-S03: Mentor workspace](https://github.com/open-mercato/ai_techleaders_project/blob/7018d0f/docs/designs/e01/06-mentor-home.png?raw=true)

![E01-S03: Operator home](https://github.com/open-mercato/ai_techleaders_project/blob/7018d0f/docs/designs/e01/07-operator-home.png?raw=true)

![E01-S03: Operator users and roles](https://github.com/open-mercato/ai_techleaders_project/blob/7018d0f/docs/designs/e01/08-operator-users.png?raw=true)

</details>

<details>
<summary>Session expiry and mobile sign-in — #12</summary>

![E01-S01: Expired session recovery](https://github.com/open-mercato/ai_techleaders_project/blob/7018d0f/docs/designs/e01/09-session-expired.png?raw=true)

![E01-S01: Mobile sign-in](https://github.com/open-mercato/ai_techleaders_project/blob/7018d0f/docs/designs/e01/10-sign-in-mobile.png?raw=true)

</details>

<!-- devmentor-ui-designs:end -->

#### Summary
- Every DevMentor role (mentee, mentor, operator) can sign in and reaches only its own screens, so that bookings, mentor pages, and operator actions have an identity behind them.
- Problem: a working developer, blocked the day before a release with the only senior on leave, spent 40 minutes on Stack Overflow and shipped a workaround with a TODO ("half a day, and I still don't trust that code", working developer, 2026-08-20) `[INTERVIEW]` `.ai/specs/research/2026-08-20-interview-working-dev.md`; a senior engineer answers the same questions unpaid in DMs ("two evenings a month, for free, and the notes rot", mentor, 2026-08-22) `[INTERVIEW]` `.ai/specs/research/2026-08-22-interview-mentor.md`. Neither can transact without an account and a role.
- Who has it: mentees (developers with an urgent problem), mentors (invited senior engineers), the operator (the two founders, D19).
- Expected outcome: every role can sign in (GitHub first, email fallback) and reaches only its own screens; checked by the stories' acceptance criteria and by D16's metric, which depends on bookings that require a signed-in mentee.

#### Spec
- Design authority: `.ai/specs/product-brief.md` (https://github.com/open-mercato/ai_techleaders_project/blob/backlog/product-brief/.ai/specs/product-brief.md, on PR #6 until it merges). Filed with `--no-spec`: no per-story implementation spec exists yet; per `AGENTS.md` (Spec-Driven Development) an `.ai/specs/YYYY-MM-DD-auth.md` spec is still owed before the first story is implemented.

#### Analysis
- Affected areas: `packages/core/src/http/auth.ts` (today `readSession` returns `null` for every request and `Role = 'student' | 'mentor'`; `requireSession`, `requireRole`, `assertOwnership` already express the rules), `packages/db/src/entities/auth/user.entity.ts` (placeholder `User` with `email`, `displayName`, `mentorProfile` only), `packages/core/src/services/auth/user.service.ts`, `packages/core/src/config/env.ts` (no auth secrets or OAuth config yet), `packages/app/src/app/api/users/route.ts` (public "until the auth concept lands"), `packages/ui/src/backend/api/apiCall.ts` (sets the CSRF header `x-devmentor-request`; nothing checks it server-side yet).
- The engineering standards spec (`.ai/specs/2026-09-01-engineering-standards.md`, Security & Validation) fixes the mechanics: bcrypt cost >= 12, HS256 JWT or signed cookie with a >= 32-byte secret from `env.ts`, `httpOnly`/`secure`/`sameSite` cookie, CSRF header check on state-changing routes, rate limiting on login and register, generic auth error messages.
- Naming: the brief calls the paying user a mentee; `Role` in `packages/core/src/http/auth.ts` calls the same role `student`. Decide once in E01-S01 (non-blocking) and keep the code name everywhere afterwards.

#### How to implement
1. E01-S01 (#12): GitHub OAuth sign-in, the real `readSession`, role-aware home routing.
2. E01-S02 (#13): email plus password registration and sign-in as the fallback, on the same session.
3. E01-S03 (#14): the `operator` role, role guards on every non-public route and page, data scoping on lists.
4. Each story ships its own unit tests next to the source (`*.test.ts`, 100% per-file coverage, files added to `coverage.include` in `vitest.config.mts`) and an integration scenario under `tests/integration/` for the denied path and the wrong-scope read (`SDLC.md`, risk-high gates).

#### Compatibility notes
- `BACKWARD_COMPATIBILITY.md` section 7 (session cookie `devmentor_session`, the `Role` union) and section 4 (new environment variables need a default or the documented path) are touched by every story here; section 1 is touched when `/api/users` stops being public (E01-S03). Each story names its own path.

#### How to pick this up
- Pick up the stories in the checklist below in order with `om-auto-fix-issue <story number>`; this epic is the container and closes when its checklist is complete.

#### Out of scope
- N01 "Video calls" (owner founder A); N02 "A ratings or reviews profile" (owner founder A); open mentor registration (R07); any role beyond mentee, mentor, operator (D19).

#### Open questions
- None blocking. Q19 (first-iteration payouts) touches roles only through the operator acting by hand (R18).
- The mentee/student naming question is carried on E01-S01 as non-blocking.

#### 📋 Decisions in play
- D07 — sign-in with GitHub for every role, email plus password as the fallback (owner: founder A)
- R06 — the same, as a rule
- D19 — the operator is the two founders; operator functions without a story are done by hand and logged (owner: both founders)
- R07 — mentors join by invitation only; no open registration
- R18 — operator actions without a story are done by hand and logged in the shared operator note

#### 📋 Stories
<!-- om-backlog: checklist, rewritten on every run -->
- [ ] #12 E01-S01 — A developer or invited mentor signs in with GitHub and lands in their role's home
- [ ] #13 E01-S02 — A user without GitHub signs in with email and password
- [ ] #14 E01-S03 — A signed-in user sees only their role's screens; the operator role belongs to the two founders


### E01-S01 — #12 A developer or invited mentor signs in with GitHub and lands in their role's home

**Issue:** [#12](https://github.com/open-mercato/ai_techleaders_project/issues/12)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #7  
**Iteration:** first (D13)

#### Summary
- First iteration (D13)
- A developer or an invited mentor signs in with GitHub and lands in their role's home.
- Problem: nothing in the repository identifies a user: `readSession` in `packages/core/src/http/auth.ts` returns `null` for every request, so every guarded route denies and no booking can be tied to a person. The mentee interviewed on 2026-08-20 and the mentor interviewed on 2026-08-22 both need an account before they can transact (see the epic).
- Who has it: mentees (developers with an urgent problem), invited mentors; both are developers, which is why GitHub comes first (D07: "my GitHub is my profile").
- Expected outcome: a GitHub sign-in creates or finds the DevMentor account tied to that GitHub identity and sends the user to the mentee home or the mentor home by role; checked by the acceptance criteria below and by the integration scenario for the denied and cancelled paths.

Epic: #7
Depends on: none

#### Spec
- Design authority: `.ai/specs/product-brief.md` (https://github.com/open-mercato/ai_techleaders_project/blob/backlog/product-brief/.ai/specs/product-brief.md, on PR #6 until it merges). Filed with `--no-spec`; per `AGENTS.md` write `.ai/specs/YYYY-MM-DD-auth-github-sign-in.md` before implementing (owed). Security mechanics are already fixed in `.ai/specs/2026-09-01-engineering-standards.md` (Security & Validation).

#### Analysis
- `packages/core/src/http/auth.ts`: `Role = 'student' | 'mentor'`, `Session { userId, role }`, `SESSION_COOKIE = 'devmentor_session'`, `readSession` deliberately returns `null` until signature verification exists; `requireSession`, `requireRole`, `assertOwnership` need no change.
- `packages/db/src/entities/auth/user.entity.ts`: placeholder `User` (`email` unique, `displayName`, `mentorProfile` 1:1); it needs `role`, `githubId` (unique, nullable), `githubLogin`, `avatarUrl` (nullable). `packages/db/src/entities/index.ts` already discovers it.
- `packages/core/src/services/auth/user.service.ts`: `findByEmail`, `create` (emits `auth.user.created` from `packages/core/src/events/event-map.ts`); the OAuth callback builds on it.
- `packages/core/src/config/env.ts`: no auth configuration exists; `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `SESSION_SECRET` (at least 32 bytes), `APP_URL` (callback base) are new.
- `packages/core/src/container/{container,cradle}.ts`: services are registered explicitly, one line each.
- `packages/app/src/app/page.tsx` is the only public page; there is no sign-in page and no persona route group yet (the standards spec names `(auth)/`, `(student)/`, `(mentor)/`).
- Naming: the brief says mentee, the code says `student`. Decide once (see Open questions) and use the chosen name in every file this story adds.

#### How to implement
1. Migration (`npm run db:migration:create -- --name auth-github`): add `role` (`student` | `mentor` | `operator` reserved for E01-S03, default `student`), `github_id` unique nullable, `github_login`, `avatar_url` to `users`; update `packages/db/src/entities/auth/user.entity.ts` with the `p.*` builders and the seeder `packages/db/src/seeders/database.seeder.ts` (Ada keeps working).
2. `packages/core/src/config/env.ts`: add `SESSION_SECRET` (`z.string().min(32).optional()`), `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (optional), `APP_URL` (default `http://localhost:3000`); mirror in `.env.example` and `README.md`. Missing values fail closed at the route (a typed `AppError`, 503 `service_unavailable`, is additive per `BACKWARD_COMPATIBILITY.md` section 1), never at boot.
3. `packages/core/src/services/auth/session.service.ts`: `issue(user) -> Set-Cookie` value (HS256-signed payload `{ userId, role, exp }`, 24 h, `httpOnly`, `secure` in production, `sameSite=lax`, `path=/`) and `verify(cookieValue) -> Session | null` (signature, expiry). Replace the body of `readSession` in `packages/core/src/http/auth.ts` with `verify` of the `devmentor_session` cookie; keep the cookie name (section 7).
4. `packages/core/src/services/auth/github-oauth.service.ts`: `authorizeUrl(state)`, `exchangeCode(code)`, `fetchIdentity(token)` (`/user` and `/user/emails`, primary verified email); the `state` lives in a short-lived signed cookie. Register both services in `container.ts` and `cradle.ts`.
5. `packages/core/src/services/auth/user.service.ts`: `findOrCreateFromGithub(identity)`: match by `githubId`, then by verified email (link the GitHub id), else create with `role: 'student'`; emit `auth.user.created` on create.
6. Routes with `apiHandler` from `packages/core/src/http/apiHandler.ts` (a returned `Response` passes through): `packages/app/src/app/api/auth/github/route.ts` (GET: redirect to GitHub, set `state`), `packages/app/src/app/api/auth/github/callback/route.ts` (GET: on `error=access_denied` redirect to `/sign-in?cancelled=1` and create nothing; else exchange, `findOrCreateFromGithub`, set the session cookie, redirect to `/home` for `student` and `/mentor` for `mentor`), `packages/app/src/app/api/auth/logout/route.ts` (POST: clear the cookie). All `export const dynamic = 'force-dynamic'`.
7. Pages (public pages use Tailwind, `AGENTS.md`): `packages/app/src/app/(auth)/sign-in/page.tsx` with "Sign in with GitHub" first and the email fallback second (a link to E01-S02's form; disabled with a note until it ships), plus the "sign-in was cancelled, no account was created" message; `packages/app/src/app/(student)/home/page.tsx` and `packages/app/src/app/(mentor)/mentor/page.tsx` as the role homes, each reading the session server-side and redirecting to `/sign-in` when it is missing or expired (nothing of the user's is rendered first).
8. Tests: `session.service.test.ts` (valid, expired, tampered), `github-oauth.service.test.ts` (mocked `fetch`: happy path, denied, no verified email), `auth.test.ts` for `readSession`; add every new production file to `coverage.include` in `vitest.config.mts` (100% per file). Integration: `tests/integration/auth.integration.test.ts` for the cancelled authorisation and the expired-session redirect (GitHub itself is not called; stub the callback with the mock identity in test mode), following `tests/integration/admin.integration.test.ts`.

#### ✅ Acceptance criteria
- Given a developer with a GitHub account, When they choose "Sign in with GitHub" and authorise DevMentor, Then a DevMentor account tied to that GitHub identity exists and they see the mentee home. (R06, D07)
- Given a mentor who accepted an invitation, When their GitHub sign-in completes, Then they land on the mentor home, not the mentee home. (D07, D19)
- Given a user who cancels the GitHub authorisation, When they return to DevMentor, Then no account is created and the sign-in screen says so plainly. (negative)
- Given a signed-in user whose session has expired, When they open a signed-in screen, Then they are asked to sign in again and nothing of theirs is shown before that. (negative; SDLC auth gate)
- Given any sign-in screen, When it renders, Then GitHub is offered first and the email fallback second. (D07)

#### 📋 Decisions in play
- D07 — sign-in with GitHub for every role, email plus password as the fallback (owner: founder A)
- R06 — the same, as a rule
- D19 — the operator is the two founders (owner: both founders)

#### Compatibility notes
- `BACKWARD_COMPATIBILITY.md` section 4: three new variables without a sensible default (`SESSION_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`); keep them optional in `packages/core/src/config/env.ts`, fail closed at the route, and update `.env.example`, `README.md`, `.github/workflows/ci.yml`, and `tests/integration/environment.ts` (a test `SESSION_SECRET`) in the same PR so the integration build still boots. Section 7: the cookie name `devmentor_session` stays; the `Role` union is unchanged here. Section 3: the `users` migration is additive, with `up` and `down` and a rollback plan in the PR body. Section 2: new `Cradle` keys are additive. Label the PR `risk-high` and `needs-qa` (auth).

#### How to pick this up
- Run `om-auto-fix-issue 12` (it handles both bugs and features), or hand this analysis to `om-auto-create-pr` as the brief. No spec PR was authored (`--no-spec`): write the spec named above first, per `AGENTS.md`.

#### Out of scope
- The email plus password fallback itself (E01-S02); the operator role and page guards beyond the two role homes (E01-S03); invitation acceptance (E02-S01); N01 video; N02 ratings.

#### Open questions
- Mentee vs `student`: the brief and every issue say mentee; `Role` in `packages/core/src/http/auth.ts` and `BACKWARD_COMPATIBILITY.md` sections 2 and 7 say `student`. Decide once here, before any consumer of `Role` exists: either rename to `mentee` in `auth.ts` and both compatibility entries in this PR, or keep `student` and add the mapping to the brief's glossary. — non-blocking (owner: founder A)
- Session lifetime: 24 hours with no refresh flow, per the standards spec's known limitation; confirm or change in the spec. — non-blocking


### E01-S02 — #13 A user without GitHub signs in with email and password

**Issue:** [#13](https://github.com/open-mercato/ai_techleaders_project/issues/13)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #7  
**Depends on:** E01-S01 (#12)  
**Iteration:** first (D13)

#### Summary
- First iteration (D13)
- A user without GitHub registers and signs in with email and password, on the same session mechanism as GitHub sign-in.
- Problem: D07 makes GitHub the first sign-in and keeps email plus password as the fallback "for users without GitHub"; without it, a mentee or an invited mentor without a GitHub account cannot enter (see the epic's evidence).
- Who has it: mentees and invited mentors without a GitHub account.
- Expected outcome: registration with email and password, email confirmation, sign-in with a generic failure message, and the invitation path completing with either method; checked by the acceptance criteria and the integration scenario for the wrong-password path.

Epic: #7
Depends on: E01-S01 (#12)

#### Spec
- Design authority: `.ai/specs/product-brief.md` (https://github.com/open-mercato/ai_techleaders_project/blob/backlog/product-brief/.ai/specs/product-brief.md, on PR #6 until it merges). Filed with `--no-spec`; write `.ai/specs/YYYY-MM-DD-auth-email-password.md` before implementing (owed). Password and rate-limit rules: `.ai/specs/2026-09-01-engineering-standards.md` (bcrypt cost >= 12, generic auth errors, brute-force control on login and register).

#### Analysis
- `packages/db/src/entities/auth/user.entity.ts` (after E01-S01: `email`, `displayName`, `role`, `githubId`): needs `passwordHash` (nullable) and `emailVerifiedAt` (nullable); an email tied to a GitHub account (`githubId` not null) must refuse a password registration.
- `packages/core/src/services/auth/session.service.ts` (E01-S01) issues the cookie; this story reuses it unchanged.
- `packages/core/src/validators/auth/user-create.schema.ts` is the shared-schema pattern (one Zod schema, server and `CrudForm`); the register and login schemas follow it.
- `packages/ui/src/backend/forms/CrudForm.tsx` renders the forms; `packages/ui/src/backend/api/apiCall.ts` is the only `fetch` site.
- No mailer exists; email confirmation needs a port (`mailer.port.ts`) with a logging adapter for development and tests (the same port E03-S04 uses for booking emails; whichever story lands first creates it).
- No rate limiting exists anywhere in `packages/core/src/http/`.

#### How to implement
1. Migration `auth-password`: `password_hash` and `email_verified_at` (both nullable) on `users`; entity update in `packages/db/src/entities/auth/user.entity.ts`.
2. Add `bcryptjs` (pinned) to `packages/core/package.json`; `packages/core/src/services/auth/password.service.ts` with `hash` (cost 12, named constant with the why) and `verify`.
3. `packages/core/src/validators/auth/register.schema.ts` (`email`, `password` min 12, `displayName`, optional `returnTo` restricted to a relative path) and `login.schema.ts`.
4. `packages/core/src/services/notifications/mailer.port.ts` (`send({ to, subject, text })`) with `adapters/log-mailer.ts` (pino) as the default; register `mailer` in `container.ts` and `cradle.ts`. `packages/core/src/services/auth/email-verification.service.ts`: signed, expiring token in the confirmation link.
5. `packages/core/src/services/auth/user.service.ts`: `registerWithPassword` (refuse with a 409 that points to GitHub sign-in when the email already carries a `githubId`; otherwise create with `role: 'student'`, send the confirmation), `authenticateWithPassword` (generic `UnauthorizedError('Invalid credentials')` for unknown email and wrong password alike; no session before `emailVerifiedAt`).
6. `packages/core/src/http/rate-limit.ts`: in-memory per IP plus email attempt counter with a cooldown, applied in the login and register routes; documented as needing a stronger backend before production traffic.
7. Routes with `apiHandler`: `packages/app/src/app/api/auth/register/route.ts` (POST), `packages/app/src/app/api/auth/login/route.ts` (POST, sets the cookie via `session.service.ts`), `packages/app/src/app/api/auth/verify-email/route.ts` (GET, sets `emailVerifiedAt`, redirects to `returnTo` or `/home`).
8. Pages: `packages/app/src/app/(auth)/register/page.tsx` and the email form on `packages/app/src/app/(auth)/sign-in/page.tsx` (both `CrudForm` bound to the schemas from step 3; GitHub stays first). Carry `returnTo` through so that an invitation link (E02-S01, `/invitation/<token>`) completes after either method and the invitation grants the mentor role.
9. Tests: `password.service.test.ts`, `user.service.test.ts` (GitHub-tied email refused, generic failure, unverified email cannot sign in), `rate-limit.test.ts`; add to `coverage.include` in `vitest.config.mts`. Integration: wrong password shows the generic message and sets no cookie.

#### ✅ Acceptance criteria
- Given a user without GitHub, When they register with an email and a password and confirm the email, Then they have an account and land on the mentee home. (R06)
- Given a registered email user, When they enter a wrong password, Then sign-in fails with a message that does not say which part was wrong, and no session starts. (negative)
- Given an email already tied to a GitHub account, When someone registers it with a password, Then the product refuses and points to GitHub sign-in. (negative)
- Given a mentor invited by email who has no GitHub, When they accept the invitation, Then they can complete it with email and password and still get the mentor role. (D07, R07)

#### 📋 Decisions in play
- D07 — sign-in with GitHub for every role, email plus password as the fallback (owner: founder A)
- R06 — the same, as a rule
- R07 — mentors join by invitation only; no open registration

#### Compatibility notes
- `BACKWARD_COMPATIBILITY.md` section 3: additive `users` columns, migration with `up` and `down`. Section 4: mail transport variables, if any, are optional with the log adapter as default. Section 1: new routes are additive; the 401 `unauthorized` and 409 `conflict` codes from `packages/core/src/http/errors.ts` are reused. `risk-high` and `needs-qa` (auth); a second person's review.

#### How to pick this up
- Run `om-auto-fix-issue 13` (it handles both bugs and features), or hand this analysis to `om-auto-create-pr` as the brief. Write the spec named above first (`--no-spec`).

#### Out of scope
- Password reset (not in the brief; a follow-up); GitHub sign-in (E01-S01); the invitation entity itself (E02-S01); social providers other than GitHub (D07).

#### Open questions
- Which mail transport ships for 1.0 (the log adapter is enough for development and tests; a real one is needed before invitations go out in October, D16). — non-blocking (owner: founder A)


### E01-S03 — #14 A signed-in user sees only their role's screens; the operator role belongs to the two founders

**Issue:** [#14](https://github.com/open-mercato/ai_techleaders_project/issues/14)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #7  
**Depends on:** E01-S01 (#12)  
**Iteration:** first (D13)

#### Summary
- First iteration (D13)
- A signed-in user sees only their role's screens; the operator role belongs to the two founders and nothing in the product grants it.
- Problem: the roles exist on paper (mentee, mentor, operator, D05 and D19) but `Role` in `packages/core/src/http/auth.ts` knows no operator, `/api/users` is public, and no page checks a role; without guards a mentee could open mentor screens and any signed-in user could read another's sessions.
- Who has it: mentees, mentors, the operator (founder A, founder B).
- Expected outcome: every non-public route and page denies the wrong role and sends the user to their own home, list endpoints return only the caller's rows, and the operator role is held by the founders only; checked by the acceptance criteria and integration tests for the denied path and the wrong-scope read (`SDLC.md`, risk-high gates).

Epic: #7
Depends on: E01-S01 (#12)

#### Spec
- Design authority: `.ai/specs/product-brief.md` (https://github.com/open-mercato/ai_techleaders_project/blob/backlog/product-brief/.ai/specs/product-brief.md, on PR #6 until it merges). Filed with `--no-spec`; write `.ai/specs/YYYY-MM-DD-roles-and-scoping.md` before implementing (owed). "Ownership over role" and "fail closed" rules: `.ai/specs/2026-09-01-engineering-standards.md`.

#### Analysis
- `packages/core/src/http/auth.ts`: `Role = 'student' | 'mentor'` (listed as a contract in `BACKWARD_COMPATIBILITY.md` sections 2 and 7); `requireRole(session, role)` and `assertOwnership(session, ownerId)` exist and are unused.
- `packages/core/src/http/makeCrudRoute.ts`: the `authorize` option runs before any verb; `packages/app/src/app/api/users/route.ts` omits it ("intentionally public until the auth concept lands").
- `packages/app/src/app/admin/layout.tsx`, `admin/page.tsx`, `admin/users/page.tsx`: the shadcn admin surface has no guard; it becomes the operator's workspace.
- `packages/ui/src/backend/api/apiCall.ts` sets `x-devmentor-request`; nothing on the server checks it yet.
- `tests/integration/admin.integration.test.ts` opens `/admin` and `/admin/users` anonymously and asserts on the seeded Ada row; once the admin surface is operator-only, the test needs a signed-in operator.
- Data scoping applies to every list that lands later (sessions, slots, notes); this story sets the pattern and guards what exists today.

#### How to implement
1. `packages/core/src/http/auth.ts`: widen `Role` to `'student' | 'mentor' | 'operator'`; add `requireAnyRole(session, roles)` and `requireCsrfHeader(req)` (rejects a state-changing request without `x-devmentor-request`, the header `apiCall` always sends). Update `BACKWARD_COMPATIBILITY.md` sections 2 and 7 in the same PR.
2. Operator grant: `OPERATOR_EMAILS` (comma-separated, default empty) in `packages/core/src/config/env.ts`; `packages/core/src/services/auth/session.service.ts` issues `role: 'operator'` for a user whose verified email is on the list; no route or page assigns the role (R18: the founders change the list by hand and log it). `.env.example`, `README.md`, and `tests/integration/environment.ts` (a seeded operator email) updated together.
3. `packages/app/src/app/api/users/route.ts`: `authorize: async (req) => requireRole(await requireSession(req), 'operator')`. Every later route copies this line or its `apiHandler` equivalent.
4. Page guards in the composition root: `packages/app/src/lib/session.ts` (reads the cookie with `next/headers` and calls `readSession`) and `requirePageRole(role)` that redirects to `/sign-in` when missing and to the caller's own home when the role is wrong; use it in `packages/app/src/app/(student)/layout.tsx`, `packages/app/src/app/(mentor)/layout.tsx`, and `packages/app/src/app/admin/layout.tsx`.
5. Navigation: the student and mentor layouts show only their own links; there is no "become a mentor" link or route anywhere (R07).
6. Data scoping pattern: services take the `Session` and filter by `userId` (`packages/core/src/services/auth/user.service.ts#list` stays operator-only; `listForMentee`/`listForMentor` in the bookings service, E03-S04, follow it). `assertOwnership` guards every mutation on a record.
7. Seeder `packages/db/src/seeders/database.seeder.ts`: add an operator user with a password hash so the integration harness can sign in through E01-S02's form; update `tests/integration/admin.integration.test.ts` to sign in first, and add `tests/integration/roles.integration.test.ts`: mentee opens `/mentor/slots` and is redirected home; mentor opens `/admin` and is refused; a mentee's sessions list does not contain another mentee's booking (isolation test).
8. Unit tests for `requireAnyRole`, `requireCsrfHeader`, the operator allowlist, and `requirePageRole`; add the files to `coverage.include` in `vitest.config.mts`.

#### ✅ Acceptance criteria
- Given a mentee, When they open a mentor-only screen (slots, prices, note drafting), Then they are refused and sent to their home. (negative; D05 roles)
- Given a mentor, When they open an operator screen, Then they are refused. (negative)
- Given founder A or founder B, When they sign in, Then they hold the operator role; no other account can be given it in 1.0 except by a founder acting by hand. (D19, R18)
- Given a mentee, When they list sessions, Then only sessions they booked appear; a mentor sees only sessions booked with them. (data scoping; SDLC isolation test)
- Given a signed-in user with no invitation, When they look for a way to become a mentor, Then there is none. (R07, negative)

#### 📋 Decisions in play
- D19 — the operator is the two founders; by-hand actions logged (owner: both founders)
- D05 — 1.0 is the session marketplace with accounts and roles (owner: founder A)
- R07 — invitation only; no open registration
- R18 — operator actions without a story are done by hand and logged

#### Compatibility notes
- `BACKWARD_COMPATIBILITY.md` section 1: `/api/users` stops being public; the client side (`packages/app/src/app/admin/users/page.tsx` under the operator layout) and `tests/integration/admin.integration.test.ts` ship in the same PR, and the change is listed under "Breaking changes" in the PR body. Sections 2 and 7: `Role` gains `operator` (a widened union; consumers with exhaustive switches must be updated; note it). Section 4: `OPERATOR_EMAILS` has a default. `risk-high`, `needs-qa`, second reviewer.

#### How to pick this up
- Run `om-auto-fix-issue 14` (it handles both bugs and features), or hand this analysis to `om-auto-create-pr` as the brief. Write the spec named above first (`--no-spec`).

#### Out of scope
- The screens themselves (slots, prices, notes, sessions are E02 to E05 stories; this story guards the layouts and the pattern); an admin role beyond the two founders; RBAC (the standards spec excludes it).

#### Open questions
- Whether a founder who is also a mentor holds two roles or two accounts; the allowlist gives the operator role to the founder's account, and a mentor profile on the same account is allowed unless founder A says otherwise. — non-blocking (owner: both founders)


### E02 — #8 Mentors become bookable

**Issue:** [#8](https://github.com/open-mercato/ai_techleaders_project/issues/8)  
**Labels:** feature, priority-medium, risk-high

<!-- devmentor-ui-designs:start -->
#### UI designs

Finished screen compositions from the DevMentor design system. Open an image to view it at full size.

[Component and prototype source](https://github.com/open-mercato/ai_techleaders_project/tree/9e40854b626ee3542345cf6c3d83bbd73695c46a) | [Screen source and state map](https://github.com/open-mercato/ai_techleaders_project/blob/9e40854b626ee3542345cf6c3d83bbd73695c46a/prototypes/devmentor-journey/README.md)

##### Mentor invitation (#15)

![E02-S01: Accept a mentor invitation](https://github.com/open-mercato/ai_techleaders_project/blob/77b481f43f7a37b233b28d3da47356159c4ea866/docs/designs/e02/01-invitation.png?raw=true)

<details>
<summary>First mentor visit (#15)</summary>

![E02-S01: First mentor visit and setup steps](https://github.com/open-mercato/ai_techleaders_project/blob/77b481f43f7a37b233b28d3da47356159c4ea866/docs/designs/e02/02-first-mentor-workspace.png?raw=true)

</details>

<details>
<summary>Profile editor and public profile (#16)</summary>

![E02-S02: Edit, publish and share a mentor profile](https://github.com/open-mercato/ai_techleaders_project/blob/77b481f43f7a37b233b28d3da47356159c4ea866/docs/designs/e02/03-profile-editor.png?raw=true)

![E02-S02: Public mentor profile](https://github.com/open-mercato/ai_techleaders_project/blob/77b481f43f7a37b233b28d3da47356159c4ea866/docs/designs/e02/04-public-mentor-profile.png?raw=true)

The review components shown on the public profile are additional designs; ratings remain outside the scope of #16.

</details>

<details>
<summary>Session prices and availability (#17, #18)</summary>

![E02-S03 and E02-S04: Available times, booked slots and session prices](https://github.com/open-mercato/ai_techleaders_project/blob/77b481f43f7a37b233b28d3da47356159c4ea866/docs/designs/e01/06-mentor-home.png?raw=true)

</details>

<details>
<summary>Payout setup and statuses (#19, iteration 1.1)</summary>

![E02-S05: Payout setup required](https://github.com/open-mercato/ai_techleaders_project/blob/77b481f43f7a37b233b28d3da47356159c4ea866/docs/designs/e02/05-payouts-setup.png?raw=true)

![E02-S05: Payouts enabled](https://github.com/open-mercato/ai_techleaders_project/blob/77b481f43f7a37b233b28d3da47356159c4ea866/docs/designs/e02/06-payouts-enabled.png?raw=true)

![E02-S05: Payout account needs attention](https://github.com/open-mercato/ai_techleaders_project/blob/77b481f43f7a37b233b28d3da47356159c4ea866/docs/designs/e02/07-payouts-restricted.png?raw=true)

</details>

<!-- devmentor-ui-designs:end -->

#### Summary
- An invited senior engineer becomes bookable: accepts the invitation, fills the mentor page, publishes slots, sets prices, and (in 1.1) completes Stripe Connect onboarding.
- Problem: the mentor interviewed on 2026-08-22 answers the same questions for free and wants income from expertise without consulting ("two evenings a month, for free, and the notes rot", mentor, 2026-08-22) `[INTERVIEW]` `.ai/specs/research/2026-08-22-interview-mentor.md`; nothing exists for a senior engineer to sell a bookable session.
- Who has it: mentors (invited senior engineers from the beachhead pool, D24); the operator who invites them.
- Expected outcome: an invited senior engineer publishes at least one bookable session (a page, prices, slots) within two weeks of accepting; checked per D18, where fewer than 5 of the first 20 stops further invitations.

#### Spec
- Architecture and phased authority: `.ai/specs/2026-09-08-mentors-become-bookable.md`
- Slice 1 authority: `.ai/specs/2026-09-08-invitations.md`
- Slice 2 authority: `.ai/specs/2026-09-08-mentor-page.md`
- UI handoff: `.ai/specs/2026-09-09-e02-design-handoff.md`
- Implementation: Slices 1 and 2 are complete in #44, Slice 3 is complete in #46, and Slice 4 is complete in #48; all four 1.0 slices await their remaining independent approval/QA gates.

#### Analysis
- Affected areas: `packages/db/src/entities/mentors/mentor-profile.entity.ts` (placeholder fields `headline`, `bio`, `yearsOfExperience`, owning side of the 1:1 with `User`), `packages/db/src/entities/index.ts` (the `entities` array the ORM discovers), `packages/db/migrations/` (one migration per story, generated with `npm run db:migration:create -- --name <x>`), `packages/core/src/services/auth/user.service.ts` (the only service today; a `MentorProfileService` follows its shape), `packages/core/src/container/{container,cradle}.ts` (explicit registrations), `packages/core/src/validators/auth/user-create.schema.ts` (the shared-Zod-schema pattern the mentor forms copy), `packages/app/src/app/api/users/route.ts` (the `makeCrudRoute` reference route), `packages/ui/src/backend/forms/CrudForm.tsx` and `tables/DataTable.tsx` (the mandatory form and list primitives).
- New concept folders this epic creates on first use (`AGENTS.md`, domain concept convention): `invitations`, `availability`, `payments`; `mentors` already exists in `db`.

#### How to implement
1. E02-S01 (#15): invitation entity and acceptance flow that grants the `mentor` role.
2. E02-S02 (#16): the mentor page fields, stack tags, publish rule, share link.
3. E02-S03 (#17): slots (publish, remove, taken on booking).
4. E02-S04 (#18): 25- and 50-minute prices within operator bounds.
5. E02-S05 (#19, 1.1): Stripe Connect onboarding and payout status, with task E02-S05-T01 (#33).
6. Unit tests per file (100% coverage, `vitest.config.mts`), integration scenarios for the role-grant and the public page.

#### Compatibility notes
- `BACKWARD_COMPATIBILITY.md` section 3: the placeholder `MentorProfile` fields are not protected, but the seeder (`packages/db/src/seeders/database.seeder.ts`) and `tests/integration/admin.integration.test.ts` assert on `Systems & algorithms mentor`; keep `headline` or update both together. Section 4 applies to the Stripe variables in E02-S05.

#### How to pick this up
- Review and QA #44 against its temporary base #45. Once Pat lands canonical E01 from `feat/lesson-08`, rebase and retarget #44 onto that result, then close #45. Continue with #17 only after Slices 1 and 2 land.

#### Out of scope
- N02 ratings or reviews (owner founder A); open registration (R07); the vault and anything published (D05); stacks outside the four (R16).

#### Open questions
- Q19 — how first-iteration mentors are paid before Connect onboarding exists: non-blocking for filing, blocking before the first payout falls due; owner founder A with founder B.

#### 📋 Decisions in play
- D08 — mentors join by invitation in 1.0 (owner: founder A)
- D18 — A03 accepted with the invitation as the check: one bookable session within two weeks, batches of 20 (owner: both founders)
- D24 — the beachhead: English-speaking TypeScript, React, Python, AI-agent developers (owner: founder A)
- D09 — each mentor sets 25- and 50-minute prices within operator bounds (owner: founder A)
- D22 — mentors publish slots; a slot is bookable when it starts at least two hours later (owner: founder A)
- D21 — the mentor list by stack tag and the share link (owner: founder A)
- N02 / R04 — no ratings; a link to public work and a plain description on every mentor page (owner: founder A)
- D04 / R05 — Stripe only; Stripe Connect for payouts (owner: founder A)
- R16, R17, R18 — beachhead-only invitations and tags; batches of 20 with the two-week ask; by-hand operator actions logged

#### 📋 Stories
<!-- om-backlog: checklist, rewritten on every run -->
- [ ] #15 E02-S01 — An invited senior engineer accepts the invitation and gets a mentor account; there is no open registration — implemented in #44; awaiting review and QA
- [ ] #16 E02-S02 — A mentor fills the mentor page (public-work link, description, stack tags) and gets a share link; no ratings — implemented in #44; awaiting review and QA
- [ ] #17 E02-S03 — A mentor publishes slots and sees them taken as they are booked — implemented in #46; awaiting independent approval and manual QA
- [ ] #18 E02-S04 — A mentor sets 25- and 50-minute prices within the operator's bounds — implemented in #48; awaiting independent approval and manual QA
- [ ] #19 E02-S05 — A mentor completes Stripe Connect onboarding and sees whether payouts are enabled


### E02-S01 — #15 An invited senior engineer accepts the invitation and gets a mentor account; there is no open registration

**Issue:** [#15](https://github.com/open-mercato/ai_techleaders_project/issues/15)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #8  
**Depends on:** E01-S01 (#12)  
**Iteration:** first (D13)

#### Summary

An invited senior engineer can open a single-use link, sign in with the matching verified email, explicitly accept, gain the additive `mentor` role, remain signed in, and see the durable two-week publication deadline on the mentor home. There is no open “become a mentor” path.

Epic: #8
Implementation: #44
Temporary prerequisite base: #45
Depends on: E01 Slices 1, 2 and 4. Pat's canonical E01 work remains on `feat/lesson-08`; #45 only keeps this stacked implementation testable until that work lands.

#### Spec

- Story authority: `.ai/specs/2026-09-08-invitations.md`
- Epic architecture and contracts: `.ai/specs/2026-09-08-mentors-become-bookable.md` (Slice 1)
- UI handoff: `.ai/specs/2026-09-09-e02-design-handoff.md`

#### Delivered behavior

- Operator `create`, `revoke`, and token-rotating `resend` commands with token-free audit output.
- Hashed raw tokens, normalized invitation email, one unresolved invitation per address, and verified-email identity binding.
- Transaction-locked acceptance, revoke, resend, profile creation, first-deadline snapshot, and additive role grant.
- Refreshed session cookie after role grant, public invitation states, mentor-home deadline, and no open-registration route.
- Real PostgreSQL coverage for duplicate acceptance, normalized-email creation, accept/revoke, and accept/resend races.

#### Status

Implemented in #44 and locally verified with 100% per-file unit coverage plus the full integration suite. The PR is awaiting CI, independent review, and QA; this issue closes when #44 merges.


### E02-S02 — #16 A mentor fills the mentor page (public-work link, description, stack tags) and gets a share link; no ratings

**Issue:** [#16](https://github.com/open-mercato/ai_techleaders_project/issues/16)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #8  
**Depends on:** E02-S01 (#15)  
**Iteration:** first (D13)

#### Summary

A mentor can save an incomplete profile draft, choose only the four beachhead technologies, publish when the required public-work link and description are complete, copy a stable share link, unpublish without deleting content, and republish at the same URL. Signed-out visitors can open `/m/<slug>`; no rating, review, score, or ranking crosses the public surface.

Epic: #8
Implementation: #44
Depends on: E02-S01 (#15) and the temporary E01 prerequisite base #45.

#### Spec

- Story authority: `.ai/specs/2026-09-08-mentor-page.md`
- Epic architecture and contracts: `.ai/specs/2026-09-08-mentors-become-bookable.md` (Slice 2)
- UI handoff: `.ai/specs/2026-09-09-e02-design-handoff.md`

#### Delivered behavior

- Owner-scoped draft read/update plus field-keyed publication readiness.
- Stable, reserved-name-safe, collision-retrying slugs with serialized publish/unpublish transitions.
- Exact public DTO allowlist with no email, payout, invitation, or deadline fields.
- Profile editor, shared public-page preview, clipboard recovery, mentor navigation, Storybook examples, responsive Tailwind public page, and light/dark theme support.
- Reversible additive migration and real PostgreSQL tests for same-name and same-profile races.

Prices, slots, and booking actions remain staged for E02 Slices 3 and 4 and E03, as the accepted story spec requires.

#### Status

Implemented in #44 and locally verified with 100% per-file unit coverage plus the full integration suite. The PR is awaiting CI, independent review, and QA; this issue closes when #44 merges.


### E02-S03 — #17 A mentor publishes slots and sees them taken as they are booked

**Issue:** [#17](https://github.com/open-mercato/ai_techleaders_project/issues/17)  
**Labels:** feature, priority-medium, risk-medium  
**Epic:** #8  
**Depends on:** E02-S01 (#15)  
**Iteration:** first (D13)

#### Summary
- First iteration (D13)
- A mentor publishes slots and sees them taken as they are booked.
- Problem: D22 decides that mentors publish slots and that a slot is bookable when it starts at least two hours after booking; nothing in the repository stores availability (`AGENTS.md` names an `availability` concept that does not exist yet).
- Who has it: mentors; mentees who book them (E03-S02).
- Expected outcome: a mentor publishes single start times that appear on the mentor page, a booked slot stops being offered, an unbooked slot can be removed, and a booked one cannot; checked by the acceptance criteria.

Epic: #8
Depends on: E02-S01 (#15)

#### Spec
- Design authority: `.ai/specs/product-brief.md` (https://github.com/open-mercato/ai_techleaders_project/blob/backlog/product-brief/.ai/specs/product-brief.md, on PR #6 until it merges). Filed with `--no-spec`; write `.ai/specs/YYYY-MM-DD-availability-slots.md` before implementing (owed).

#### Analysis
- New concept `availability`: `packages/db/src/entities/availability/slot.entity.ts`, `packages/core/src/services/availability/slot.service.ts`, `packages/core/src/validators/availability/slot-create.schema.ts`, `packages/app/src/app/api/availability/slots/route.ts`.
- `packages/db/src/entities/mentors/mentor-profile.entity.ts` gets `lastPublishedAvailabilityAt` in E02-S02; this story maintains it (R13's ordering key).
- `packages/core/src/http/makeCrudRoute.ts` fits the slot resource (list, create, delete) with an `authorize` for the mentor role; `packages/ui/src/backend/tables/DataTable.tsx` and `forms/CrudForm.tsx` render the mentor's list and form.
- The shape of a slot (single start time vs recurring hour) is decided nowhere; the plain reading of D22 (single start times) is used, tagged `[ASSUMPTION]` in the brief.

#### How to implement
1. Entity `Slot`: `mentorProfile` (many-to-one), `startsAt` (timestamptz), `booking` nullable 1:1 (set by E03-S03; unique so one slot carries one confirmed booking), `removedAt` nullable; unique index on (`mentor_profile_id`, `starts_at`). Register in `packages/db/src/entities/index.ts`; migration `availability-slots`.
2. Schema `slot-create.schema.ts`: `startsAt` ISO datetime in the future (a named constant for the minimum lead, 2 hours, shared with E03-S02).
3. `slot.service.ts`: `listMine(session)`, `publish(session, input)` (sets `mentorProfile.lastPublishedAvailabilityAt = now`), `remove(session, id)` (`assertOwnership`; a slot with a booking throws `ConflictError('This slot is booked; cancel the booking instead')`, R09), `listPublicFor(mentorProfileId, now)` (future, unbooked, not removed; consumed by the public page from E02-S02 and by E03-S02). Register in `container.ts` and `cradle.ts`.
4. Routes: `packages/app/src/app/api/availability/slots/route.ts` (`makeCrudRoute` with `resolve: (c) => c.slotService`, `createSchema`, `authorize` requiring `mentor`) and `packages/app/src/app/api/availability/slots/[id]/route.ts` (DELETE).
5. Page `packages/app/src/app/(mentor)/mentor/slots/page.tsx`: `DataTable` (start, status: open, booked, with the booking link) and `CrudForm` for a new start time; the public page `packages/app/src/app/m/[slug]/page.tsx` renders `listPublicFor`.
6. Tests: service (publish updates the ordering key, remove refused when booked, booked slot not offered), route tests; `coverage.include` in `vitest.config.mts`. Integration: publish a slot and see it on the share page.

#### ✅ Acceptance criteria
- Given a mentor, When they publish a start time, Then it appears as a slot on their page and the page's most recent published availability updates for the list's order. (D22, R13)
- Given a published slot, When a mentee's payment confirms a booking on it, Then the slot is no longer offered. (D22)
- Given an unbooked slot, When the mentor removes it, Then it disappears from the page. (D22)
- Given a booked slot, When the mentor tries to remove it, Then the product refuses and points to cancellation (E03-S05; by hand under R18 in the first iteration). (R09, negative)

#### 📋 Decisions in play
- D22 — mentors publish slots; bookable when the start is at least two hours later (owner: founder A)
- R14 — the two-hour rule; no speed promise
- R09 — cancellation rules; disputes resolved by the operator
- R18 — by-hand operator actions are logged

#### Compatibility notes
- `BACKWARD_COMPATIBILITY.md` section 3: new table with a unique index, `up` and `down`; section 1: new routes are additive and reuse the 409 `conflict` code. `risk-medium`; `needs-qa`.

#### How to pick this up
- Run `om-auto-fix-issue 17` (it handles both bugs and features), or hand this analysis to `om-auto-create-pr` as the brief. Write the spec named above first (`--no-spec`).

#### Out of scope
- Booking the slot (E03-S02, E03-S03); cancellation (E03-S05); recurring availability (not decided; a later story if D22 is superseded).

#### Open questions
- Single start times or recurring hours (the plain reading of D22 is used; `[ASSUMPTION]` in the brief). — non-blocking (owner: founder A)
- How the mentor learns a slot was booked (E03-S04 covers the notification). — non-blocking


### E02-S04 — #18 A mentor sets 25- and 50-minute prices within the operator's bounds

**Issue:** [#18](https://github.com/open-mercato/ai_techleaders_project/issues/18)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #8  
**Depends on:** E02-S01 (#15)  
**Iteration:** first (D13)

#### Summary
- First iteration (D13)
- A mentor sets 25- and 50-minute prices within the operator's bounds.
- Problem: D09 gives each mentor control over price within operator-set bounds; the repository has no price field and no notion of bounds, so nothing can be booked at a known amount.
- Who has it: mentors; mentees who see the price before paying (E03-S02).
- Expected outcome: two prices, refused outside the bounds, shown on the mentor page, with a booking keeping the price it was made at; checked by the acceptance criteria and money-path tests.

Epic: #8
Depends on: E02-S01 (#15)

#### Spec
- Design authority: `.ai/specs/product-brief.md` (https://github.com/open-mercato/ai_techleaders_project/blob/backlog/product-brief/.ai/specs/product-brief.md, on PR #6 until it merges). Filed with `--no-spec`; write `.ai/specs/YYYY-MM-DD-mentor-prices.md` before implementing (owed). Money rule: the price is always recomputed server-side from the mentor's stored prices (`.ai/specs/2026-09-01-engineering-standards.md`, "Money correctness").

#### Analysis
- `packages/db/src/entities/mentors/mentor-profile.entity.ts`: no price fields; integers in minor units avoid float money.
- Bounds are operator-set (D09) but E05-S02 is 1.1; until then the founders set them by hand (R18). Reading them through one service now means E05-S02 changes the storage, not the callers.
- `packages/core/src/config/env.ts` is the only place configuration enters (`AGENTS.md`); `packages/core/src/validators/auth/user-create.schema.ts` is the schema pattern; `packages/ui/src/backend/forms/CrudForm.tsx` renders number fields.
- A booking's price snapshot lives on the booking (E03-S02); this story guarantees the page shows the current prices and that changing them never touches an existing booking.

#### How to implement
1. Migration `mentor-prices`: `price_25_cents`, `price_50_cents` (integer, nullable) and `currency` (char(3), default `USD`) on `mentor_profiles`; entity update.
2. `packages/core/src/services/operator/platform-settings.service.ts`: `get() -> { minPrice25Cents, maxPrice25Cents, minPrice50Cents, maxPrice50Cents, feePercent, currency }`, backed for now by `packages/core/src/config/env.ts` (`PRICE_MIN_25_CENTS`, `PRICE_MAX_25_CENTS`, `PRICE_MIN_50_CENTS`, `PRICE_MAX_50_CENTS`, `PLATFORM_FEE_PERCENT` default 20, all with defaults; `.env.example` and `README.md` updated); E05-S02 moves the values to a table behind the same method. Register in `container.ts` and `cradle.ts`.
3. `packages/core/src/validators/mentors/mentor-prices-update.schema.ts`: two positive integers; the bound check happens in the service (it needs the settings).
4. `packages/core/src/services/mentors/mentor-profile.service.ts#updatePrices(session, input)`: refuse a price outside the bounds with `ValidationError` carrying the bound in `fieldErrors`; `isBookable(profile)` = published and both prices set (used by the public page and E03-S02).
5. Route `packages/app/src/app/api/mentors/me/prices/route.ts` (PUT, mentor only); page `packages/app/src/app/(mentor)/mentor/prices/page.tsx` (`CrudForm` with the bounds shown next to each field). The public page `packages/app/src/app/m/[slug]/page.tsx` shows both prices, or "not bookable yet" with no bookable slot when either is missing.
6. Tests: service (inside, outside, missing prices), schema, settings reader defaults; `coverage.include` in `vitest.config.mts`. E03-S02 and E03-S03 add the test that a booking keeps its `priceCents` after the mentor changes a price.

#### ✅ Acceptance criteria
- Given operator bounds (set by hand under R18 until E05-S02), When a mentor sets a 25-minute and a 50-minute price inside them, Then the mentor page shows both prices. (R08, R01)
- Given a price outside the bounds, When the mentor saves, Then the save is refused and the bound is shown. (R08, negative)
- Given a mentor with no prices set, When a visitor opens the page, Then no slot can be booked and the page says the mentor is not bookable yet. (negative)
- Given a mentor changing a price, When a session was already booked at the old price, Then that booking keeps its price. (money; negative)

#### 📋 Decisions in play
- D09 — each mentor sets their own 25- and 50-minute prices within operator-set bounds (owner: founder A)
- R08 — the same, as a rule
- R01 — a session is 25 or 50 minutes
- D19 — the operator is the two founders (owner: both founders)
- R18 — by-hand operator actions are logged

#### Compatibility notes
- `BACKWARD_COMPATIBILITY.md` section 4: new variables all with defaults (additive); section 3: additive columns. `risk-high` (money) and `needs-qa`; second reviewer.

#### How to pick this up
- Run `om-auto-fix-issue 18` (it handles both bugs and features), or hand this analysis to `om-auto-create-pr` as the brief. Write the spec named above first (`--no-spec`).

#### Out of scope
- The operator settings screen (E05-S02); the fee split (E03-S06); currencies other than the one constant (the brief says nothing about currency).

#### Open questions
- Currency: the brief names none; USD for the English-speaking beachhead (D24) is the plain choice and is stored per profile so it can change. — non-blocking (owner: founder A)
- The initial bounds themselves (values for the env defaults). — non-blocking (owner: founder A)


### E02-S05 — #19 A mentor completes Stripe Connect onboarding and sees whether payouts are enabled

**Issue:** [#19](https://github.com/open-mercato/ai_techleaders_project/issues/19)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #8  
**Depends on:** E02-S01 (#15)  
**Iteration:** 1.1 (D13)

#### Summary
- 1.1, not in the first iteration (D13)
- A mentor completes Stripe Connect onboarding and sees whether payouts are enabled.
- Problem: R05 makes Stripe Connect the only payout channel and requires onboarding before the first payout; D13 leaves it out of the first iteration (the founders' E02-S06), which is why Q19 asks how first-iteration mentors are paid at all.
- Who has it: mentors who want to be paid; the operator who needs to see who can be paid.
- Expected outcome: hosted Connect onboarding from DevMentor, a status that only the mentor and the operator see, and no payout while onboarding is incomplete; checked by the acceptance criteria and the money-path tests in task E02-S05-T01.

Epic: #8
Depends on: E02-S01 (#15)

#### Spec
- Design authority: `.ai/specs/product-brief.md` (https://github.com/open-mercato/ai_techleaders_project/blob/backlog/product-brief/.ai/specs/product-brief.md, on PR #6 until it merges). Filed with `--no-spec`; write `.ai/specs/YYYY-MM-DD-stripe-connect-onboarding.md` before implementing (owed). The port-and-adapter rule for payments comes from `.ai/specs/2026-09-01-engineering-standards.md`.

#### Analysis
- `packages/core/src/services/payments/payment-gateway.port.ts` and `adapters/stripe-payment-gateway.ts` are introduced by E03-S03-T01 (first iteration); this story extends the port with the Connect operations and the adapter with their Stripe calls (task E02-S05-T01).
- `packages/db/src/entities/mentors/mentor-profile.entity.ts` needs `stripeAccountId` (unique, nullable), `payoutsEnabled` (default false), `payoutRequirements` (json, nullable).
- `packages/app/src/app/api/payments/webhook/route.ts` (E03-S03-T01) receives `account.updated`; the handler must be idempotent.
- The operator's view is the admin surface (`packages/app/src/app/admin/users/page.tsx` lists users with their mentor profile).

#### How to implement
1. Migration `mentor-connect`: the three columns above; entity update.
2. Port: `createConnectAccount(mentorProfileId, email) -> accountId`, `createAccountLink(accountId, refreshUrl, returnUrl) -> url`, `getAccountStatus(accountId) -> { payoutsEnabled, requirements }`; adapter in E02-S05-T01 (#33).
3. `packages/core/src/services/payments/connect-onboarding.service.ts`: `start(session)` (creates the account once, returns the account link), `refresh(session)` (reads the status and stores it), `applyAccountUpdated(event)` (idempotent by account id and event id). Register in `container.ts` and `cradle.ts`.
4. Routes with `apiHandler`: `packages/app/src/app/api/payments/connect/onboard/route.ts` (POST, mentor only) and `packages/app/src/app/api/payments/connect/return/route.ts` (GET: refresh and redirect to `/mentor/payouts`); the webhook route dispatches `account.updated` to `applyAccountUpdated`.
5. Page `packages/app/src/app/(mentor)/mentor/payouts/page.tsx`: "Set up payouts" button, then "Payouts enabled" or the list of what Stripe still requires (`requirements.currently_due`). Operator: a "Payouts" column on `packages/app/src/app/admin/users/page.tsx` (operator only, E01-S03); no other role sees the field (the public mentor DTO in `mentor-profile.service.ts` never includes it).
6. Payout guard: `payout.service.ts` (E03-S06) holds a payout when `payoutsEnabled` is false and the mentor's page says what is missing.
7. Tests: service (account created once; status stored; duplicate `account.updated` applied once); route tests; `coverage.include` in `vitest.config.mts`. Integration with the mock gateway: a mentor sees "payouts enabled" after the simulated event and a mentee cannot read the field.

#### ✅ Acceptance criteria
- Given a mentor, When they start Connect onboarding, Then they are sent to Stripe's hosted onboarding and return to DevMentor with a status. (R05)
- Given a mentor whose onboarding is incomplete, When a payout would fall due, Then no payout is made and the mentor sees what is missing. (R05, negative)
- Given Stripe reporting the onboarding complete, When the mentor or the operator opens the mentor's settings, Then "payouts enabled" is shown to them and to no one else. (R05; data scoping)

#### 📋 Decisions in play
- D04 — Stripe is the only payment provider, with Stripe Connect for mentor payouts (owner: founder A)
- R05 — Stripe Checkout for sessions, Stripe Connect for payouts; onboarding before the first payout

#### Compatibility notes
- `BACKWARD_COMPATIBILITY.md` section 4: `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are introduced by E03-S03-T01 (optional, fail closed); section 3: additive columns; section 2: the port interface is a package export, extended additively. `risk-high` (money, data scoping), `needs-qa`, second reviewer.

#### How to pick this up
- Run `om-auto-fix-issue 19` (it handles both bugs and features), or hand this analysis to `om-auto-create-pr` as the brief. Write the spec named above first (`--no-spec`).

#### Out of scope
- The fee split and the transfer itself (E03-S06); paying first-iteration mentors by hand (Q19, a founders' decision, not a story).

#### Open questions
- Q19 — until this story ships, how first-iteration mentors are paid is undecided (owner founder A with founder B); blocking before the first payout falls due, non-blocking for this story's implementation.


### E03 — #9 Booking and payment

**Issue:** [#9](https://github.com/open-mercato/ai_techleaders_project/issues/9)  
**Labels:** feature, priority-medium, risk-high

#### Summary
- A mentee finds a mentor, books a slot at least two hours ahead, pays through Stripe Checkout, and both parties know; cancellation and the fee split follow in 1.1.
- Problem: the working developer of 2026-08-20 wanted "someone who has actually done this looks at my code and tells me what to do, within the hour" and had no way to book or pay a senior `[INTERVIEW]` `.ai/specs/research/2026-08-20-interview-working-dev.md`; the current-state journey ends in unanswered DMs and payment by PayPal with no rules (`[ASSUMPTION]`, the founders' reconstruction on the board).
- Who has it: mentees; mentors who want prepayment and booking rules handled for them (board hypothesis, `[ASSUMPTION]`).
- Expected outcome: a mentee finds a mentor, books a slot at least two hours ahead, pays, and both know; checked by D16 (10 paid sessions a week for two consecutive weeks by 2026-12-31) and D22 (median booking-to-start under 48 hours in the first four weeks).

#### Spec
- Design authority: `.ai/specs/product-brief.md` (https://github.com/open-mercato/ai_techleaders_project/blob/backlog/product-brief/.ai/specs/product-brief.md, on PR #6 until it merges). Filed with `--no-spec`; a `.ai/specs/YYYY-MM-DD-bookings-payments.md` spec is still owed before implementation per `AGENTS.md`.

#### Analysis
- Affected areas: new concept folders `bookings`, `payments`, `notifications` under `packages/db/src/entities/`, `packages/core/src/services/`, `packages/core/src/validators/`, `packages/app/src/app/api/`; `packages/core/src/events/event-map.ts` (today only `auth.user.created`) gains `bookings.booking.confirmed` and `bookings.booking.cancelled`; `packages/core/src/http/apiHandler.ts` for the workflow routes that are not plain CRUD; `packages/core/src/config/env.ts` for the Stripe keys.
- The engineering standards spec (`.ai/specs/2026-09-01-engineering-standards.md`) already decides the shape: a `PaymentGateway` port in `packages/core/src/services/payments/payment-gateway.port.ts` with adapters under `services/payments/adapters/` (mock for tests, Stripe for real), a DB transaction plus a unique constraint on the slot for the check-then-write, webhook transitions that run exactly once, and the price recomputed server-side from the mentor's stored prices.

#### How to implement
1. E03-S01 (#20, 1.1): the mentor list filtered by stack tag.
2. E03-S02 (#21): pick a slot and a length at the mentor's price.
3. E03-S03 (#22): pay through Stripe Checkout; confirmed only after payment; booking-to-start recorded; task E03-S03-T01 (#34).
4. E03-S04 (#23): notifications and each role's sessions list.
5. E03-S05 (#24, 1.1): cancellation and refund.
6. E03-S06 (#25, 1.1): the 20% fee and the Connect payout.
7. Money stories carry tests for the failure, retry, and idempotency paths and a second person's review (`SDLC.md`).

#### Compatibility notes
- `BACKWARD_COMPATIBILITY.md` section 6 (new events are additive), section 4 (Stripe variables), section 1 (new routes are additive; the envelope from `packages/core/src/http/apiHandler.ts` is reused; the webhook route is the one route that reads the raw body and answers Stripe, not the envelope, and must be documented as such).

#### How to pick this up
- Pick up the stories in the checklist below in order with `om-auto-fix-issue <story number>`; E03-S02 needs E02-S03 and E02-S04 first.

#### Out of scope
- Any promise of speed in copy (R14); search or ranking (R13); N02; automatic refunds (R09); a second payment provider (R05).

#### Open questions
- Q19 — first-iteration payouts (founder A with founder B): blocking before the first payout falls due.
- Q20 — recording signed-in mentees' mentor-page visits for D17's check (founder A with founder B): blocking before 2026-11-28.

#### 📋 Decisions in play
- D21 — list and share link (owner: founder A)
- D22 — two hours ahead, no speed promise, booking-to-start recorded (owner: founder A)
- D04 / R05 — Stripe only: Checkout for sessions, Connect for payouts (owner: founder A)
- D10 / R09 — free cancellation up to 24 hours before; later forfeits the fee; no automatic refunds (owner: founder A)
- D11 / R10 — 20% platform fee, operator-configurable (owner: founder A)
- D16 — the 1.0 metric: 10 paid sessions a week for two consecutive weeks by 2026-12-31 (owner: founder A)
- R01, R08, R13, R14, R15 — 25 or 50 minutes; mentor prices within bounds; list by tag, no search; two-hour rule; booking-to-start recorded

#### 📋 Stories
<!-- om-backlog: checklist, rewritten on every run -->
- [ ] #20 E03-S01 — A mentee finds a mentor in a list filtered by stack tag, ordered by most recent published availability; no search, no ranking
- [ ] #21 E03-S02 — A mentee picks a slot that starts at least two hours ahead and a 25- or 50-minute length at the mentor's price
- [ ] #22 E03-S03 — A mentee pays through Stripe Checkout; the booking is confirmed only after payment; booking-to-start is recorded
- [ ] #23 E03-S04 — The mentor and the mentee are told about a confirmed booking and each sees their upcoming sessions
- [ ] #24 E03-S05 — A mentee cancels free up to 24 hours before a session; a later cancellation forfeits the fee
- [ ] #25 E03-S06 — DevMentor keeps 20% of a paid session and the mentor's share is paid out through Stripe Connect


### E03-S01 — #20 A mentee finds a mentor in a list filtered by stack tag, ordered by most recent published availability; no search, no ranking

**Issue:** [#20](https://github.com/open-mercato/ai_techleaders_project/issues/20)  
**Labels:** feature, priority-medium, risk-medium  
**Epic:** #9  
**Depends on:** E02-S02 (#16), E02-S03 (#17)  
**Iteration:** 1.1 (D13)

#### Summary
- 1.1, not in the first iteration (D13)
- A mentee finds a mentor in a list filtered by stack tag, ordered by most recent published availability; no search, no ranking.
- Problem: D21 gives mentees two ways to find a mentor: the list by stack tag and the share link. D13 lists no E03-S01, so the first iteration relies on share links only ("mentors bring their own audience"); this story adds the list.
- Who has it: mentees without a share link.
- Expected outcome: a public list of bookable mentors, filterable by one of the four tags, ordered by `lastPublishedAvailabilityAt`, with no search box, score, rating, or featured placement; checked by the acceptance criteria and an integration snapshot.

Epic: #9
Depends on: E02-S02 (#16), E02-S03 (#17)

#### Spec
- Design authority: `.ai/specs/product-brief.md` (https://github.com/open-mercato/ai_techleaders_project/blob/backlog/product-brief/.ai/specs/product-brief.md, on PR #6 until it merges). Filed with `--no-spec`; write `.ai/specs/YYYY-MM-DD-mentor-list.md` before implementing (owed).

#### Analysis
- `packages/core/src/services/mentors/mentor-profile.service.ts` (E02-S02) holds `getPublicBySlug`; this story adds `listPublished(tag?)`.
- `packages/db/src/entities/mentors/mentor-profile.entity.ts`: `publishedAt`, `stackTags`, `price25Cents`, `price50Cents`, `lastPublishedAvailabilityAt` (E02-S02 to E02-S04); `packages/db/src/entities/availability/slot.entity.ts` (E02-S03) for "at least one future unbooked slot".
- `packages/app/src/app/admin/users/page.tsx` is the reference list page (`apiCall` plus `DataTable`), but the mentor list is a public marketing-style page (Tailwind, `AGENTS.md`), so it renders cards; a `MentorCard` tied to the mentor shape goes to `packages/ui/src/components/mentors/MentorCard.tsx` (placement rule 3).
- Q20 (recording signed-in mentees' mentor-page visits for D17's check) is open; the list is where such a record would start, and it is left out until founder A decides.

#### How to implement
1. `mentor-profile.service.ts#listPublished(tag?, now)`: published, both prices set, at least one slot with `startsAt > now`, no booking, not removed; optional `tag` from `STACK_TAGS`; `orderBy: { lastPublishedAvailabilityAt: 'desc' }`; no free-text parameter exists.
2. Route `packages/app/src/app/api/mentors/route.ts` (GET, public, `apiHandler`; `?tag=` validated against `STACK_TAGS`, anything else 422).
3. Page `packages/app/src/app/mentors/page.tsx` (public, `force-dynamic`): tag links (`?tag=typescript` and so on), `MentorCard` per mentor (name, tags, prices, next slot, link to `/m/<slug>`); no search input, no score, no "featured" section. The landing page `packages/app/src/app/page.tsx` links to it.
4. Tests: service (excluded without slot or price; tag filter; ordering), route (invalid tag 422); `coverage.include` in `vitest.config.mts`. Integration `tests/integration/mentor-list.integration.test.ts`: the snapshot contains the seeded bookable mentor and no `searchbox` role.

#### ✅ Acceptance criteria
- Given published mentors, When a mentee opens the list, Then mentors with at least one published slot and prices appear, most recently published availability first. (R13)
- Given the list, When the mentee filters by a stack tag, Then only mentors carrying that tag remain. (R13)
- Given the list, When it renders, Then there is no search box, no score, no rating, and no featured placement. (R13, N02, negative)
- Given a mentor with no published slot or no prices, When the list renders, Then that mentor is not listed. (negative)

#### 📋 Decisions in play
- D21 — the list filtered by stack tag or the share link; no search, no ranking (owner: founder A)
- R13 — the same, as a rule; ordered by most recent published availability
- N02 — no ratings or reviews (owner: founder A)
- R04 — link to public work and a plain description on every page

#### Compatibility notes
- `BACKWARD_COMPATIBILITY.md` section 1: a new public route (additive). `risk-medium`; `needs-qa`. R13's own change path: more than 30 published mentors, or mentees unable to find a fit, reopens search for 1.1.

#### How to pick this up
- Run `om-auto-fix-issue 20` (it handles both bugs and features), or hand this analysis to `om-auto-create-pr` as the brief. Write the spec named above first (`--no-spec`).

#### Out of scope
- Search, ranking, featured placement (R13, N02); page-visit recording (Q20).

#### Open questions
- Q20 — whether a signed-in mentee's visit to a mentor page without booking is recorded (D17's check needs those developers). — non-blocking for filing; blocking before the fourth-week check on 2026-11-28 (owner: founder A with founder B)


### E03-S02 — #21 A mentee picks a slot that starts at least two hours ahead and a 25- or 50-minute length at the mentor's price

**Issue:** [#21](https://github.com/open-mercato/ai_techleaders_project/issues/21)  
**Labels:** feature, priority-medium, risk-medium  
**Epic:** #9  
**Depends on:** E02-S03 (#17), E02-S04 (#18), E01-S01 (#12)  
**Iteration:** first (D13)

#### Summary
- First iteration (D13)
- A mentee picks a slot that starts at least two hours ahead and a 25- or 50-minute length at the mentor's price.
- Problem: the mentee interviewed on 2026-08-20 wants "someone who has actually done this" to look at the code; D22 turns that into a booking that starts at least two hours later, with no promise of speed. The repository has no `bookings` concept.
- Who has it: signed-in mentees on a mentor page (share link now, list in 1.1).
- Expected outcome: a pending booking for one slot and one length at the server-computed price, refused for a slot inside two hours or already taken, with sign-in returning to the same slot; checked by the acceptance criteria and a concurrency test.

Epic: #9
Depends on: E02-S03 (#17), E02-S04 (#18), E01-S01 (#12)

#### Spec
- Design authority: `.ai/specs/product-brief.md` (https://github.com/open-mercato/ai_techleaders_project/blob/backlog/product-brief/.ai/specs/product-brief.md, on PR #6 until it merges). Filed with `--no-spec`; write `.ai/specs/YYYY-MM-DD-booking-flow.md` (shared with E03-S03) before implementing (owed). Transaction and unique-constraint rule: `.ai/specs/2026-09-01-engineering-standards.md` ("never split a check-then-write across two round-trips without a transaction").

#### Analysis
- New concept `bookings`: `packages/db/src/entities/bookings/booking.entity.ts`, `packages/core/src/services/bookings/booking.service.ts`, `packages/core/src/validators/bookings/booking-create.schema.ts`, `packages/app/src/app/api/bookings/route.ts`.
- Inputs it reads: `Slot` (E02-S03, `packages/db/src/entities/availability/slot.entity.ts`) and the mentor's prices (E02-S04). The client never supplies a price.
- `packages/core/src/http/apiHandler.ts` is the wrapper for this workflow route (not plain CRUD); `packages/core/src/http/auth.ts` `requireSession` and `requireRole(..., 'student')`.
- R03 requires "sessions are text" on every screen that describes sessions; a single shared notice component avoids drift.

#### How to implement
1. Entity `Booking` (`baseProperties`): `slot` 1:1 (unique), `mentee` many-to-one `User`, `mentorProfile` many-to-one, `lengthMinutes` (25 or 50), `priceCents`, `currency`, `status` (`pending` | `confirmed` | `cancelled` | `expired`), `startsAt` (copied from the slot), `bookedAt` nullable (set on confirmation, R15), `expiresAt` (pending only), `stripeCheckoutSessionId` unique nullable (E03-S03). Register in `packages/db/src/entities/index.ts`; migration `bookings`.
2. Schema `booking-create.schema.ts`: `slotId` uuid, `lengthMinutes` `z.union([z.literal(25), z.literal(50)])` (R01).
3. `booking.service.ts#start(session, input, now)` inside `em.transactional` with the slot locked: slot exists, not removed, `startsAt - now >= MIN_LEAD_MINUTES` (120, D22, with the why in a comment); mentor bookable (E02-S04 `isBookable`); no confirmed booking and no unexpired pending booking on the slot (`ConflictError` otherwise); `priceCents` from the mentor's stored price for the length; creates `pending` with `expiresAt = now + 30 min`. Register in `container.ts` and `cradle.ts`.
4. Route `packages/app/src/app/api/bookings/route.ts` (POST, `apiHandler`, `requireSession`, `requireRole student`, `requireCsrfHeader`), returning the booking DTO; E03-S03 adds the Checkout step right after.
5. `packages/ui/src/components/sessions/SessionIsTextNotice.tsx`: the one component that says "Sessions are text. DevMentor makes no promise about how soon an answer arrives." (R03, R14), rendered on every booking and session screen.
6. Public page `packages/app/src/app/m/[slug]/page.tsx`: colocated `SlotPicker` client component (slots inside two hours are shown disabled with the reason; picking a length shows the price for it before paying); signed out -> `/sign-in?returnTo=/m/<slug>?slot=<id>` and back to the same slot after sign-in (E01-S01, E01-S02 carry `returnTo`).
7. Tests: service (lead time, taken slot, unbookable mentor, wrong length, price from the stored value); `coverage.include` in `vitest.config.mts`. Integration `tests/integration/booking.integration.test.ts`: two concurrent `POST /api/bookings` on one slot yield one 201 and one 409; a signed-out click returns to the same slot after sign-in.

#### ✅ Acceptance criteria
- Given a mentor page with slots, When a signed-in mentee picks a slot starting at least two hours from now, Then they choose 25 or 50 minutes and see the mentor's price for that length before paying. (R14, R01, R08)
- Given a slot starting in less than two hours, When the mentee tries to pick it, Then it is not bookable and the screen says why. (R14, negative)
- Given a signed-out visitor, When they pick a slot, Then they are asked to sign in and return to the same slot. (R06)
- Given any booking screen, When it renders, Then it promises nothing about how soon an answer arrives and says the session is text. (R14, R03)
- Given a slot already taken by another mentee, When a second mentee tries it, Then the pick is refused. (negative)

#### 📋 Decisions in play
- D22 — two hours ahead; no speed promise; booking-to-start recorded (owner: founder A)
- R14 — the two-hour rule; no promise of speed in copy
- R01 — 25 or 50 minutes
- R08 — the mentor's own prices within bounds
- R03 — sessions are text; every session screen says so
- R06 — GitHub sign-in first, email fallback

#### Compatibility notes
- `BACKWARD_COMPATIBILITY.md` section 3: new table with unique constraints, `up` and `down`, rollback plan; section 1: new route, 409 `conflict` reused. `risk-medium` by content, but it ships with E03-S03 in the money gate; `needs-qa`.

#### How to pick this up
- Run `om-auto-fix-issue 21` (it handles both bugs and features), or hand this analysis to `om-auto-create-pr` as the brief. Write the spec named above first (`--no-spec`).

#### Out of scope
- Payment and confirmation (E03-S03); the list (E03-S01); cancellation (E03-S05).

#### Open questions
- The pending-booking hold (30 minutes is the plain choice; Stripe Checkout expires in 24 hours by default and should be set to match). — non-blocking (owner: founder A)


### E03-S03 — #22 A mentee pays through Stripe Checkout; the booking is confirmed only after payment; booking-to-start is recorded

**Issue:** [#22](https://github.com/open-mercato/ai_techleaders_project/issues/22)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #9  
**Depends on:** E03-S02 (#21)  
**Iteration:** first (D13)

#### Summary
- First iteration (D13)
- A mentee pays through Stripe Checkout; the booking is confirmed only after payment; booking-to-start is recorded.
- Problem: D04 and R05 make Stripe Checkout the only way a session is paid; without it the pending booking from E03-S02 never becomes a session, and D16's metric (paid sessions per week) cannot be counted.
- Who has it: mentees paying; mentors whose slot is taken; the founders reading D16 and D22.
- Expected outcome: a Checkout session per pending booking, confirmation exactly once from the webhook, the slot taken, `bookedAt` and `startsAt` stored for D22's median, and an abandoned Checkout leaving the slot free; checked by the acceptance criteria and the money-gate tests in task E03-S03-T01.

Epic: #9
Depends on: E03-S02 (#21)

#### Spec
- Design authority: `.ai/specs/product-brief.md` (https://github.com/open-mercato/ai_techleaders_project/blob/backlog/product-brief/.ai/specs/product-brief.md, on PR #6 until it merges). Filed with `--no-spec`; write `.ai/specs/YYYY-MM-DD-booking-flow.md` (shared with E03-S02) before implementing (owed). Idempotency rule: `.ai/specs/2026-09-01-engineering-standards.md` ("transitions booking to `confirmed` exactly once").

#### Analysis
- New concept `payments`: `packages/core/src/services/payments/payment-gateway.port.ts`, `adapters/stripe-payment-gateway.ts` (task E03-S03-T01), `adapters/mock-payment-gateway.ts`, `packages/core/src/services/payments/payment.service.ts`, `packages/db/src/entities/payments/processed-webhook-event.entity.ts`, `packages/app/src/app/api/payments/webhook/route.ts`.
- `packages/db/src/entities/bookings/booking.entity.ts` (E03-S02): `status`, `bookedAt`, `startsAt`, `stripeCheckoutSessionId`; add `paidAt`, `stripePaymentIntentId`, `amountPaidCents`.
- `packages/core/src/events/event-map.ts` gains `bookings.booking.confirmed` (E03-S04 subscribes); `packages/core/src/container/container.ts` registers the gateway adapter by environment.
- The webhook route is the one route that must read the raw body (`await req.text()`) for signature verification and answer Stripe with a plain 2xx/4xx rather than the envelope; `BACKWARD_COMPATIBILITY.md` section 1 needs that exception written down.

#### How to implement
1. Port `payment-gateway.port.ts`: `createCheckoutSession({ bookingId, amountCents, currency, successUrl, cancelUrl, expiresAt }) -> { id, url }`, `parseWebhookEvent(rawBody, signatureHeader) -> Event`, `refund(...)` (E03-S05 uses it); `mock-payment-gateway.ts` for tests and local development; `stripe-payment-gateway.ts` in E03-S03-T01 (#34). Register `paymentGateway` in `container.ts` (Stripe when `STRIPE_SECRET_KEY` is set, mock otherwise) and `cradle.ts`.
2. Entity `ProcessedWebhookEvent` (`eventId` unique, `type`, `receivedAt`); migration `payments`.
3. `payment.service.ts`: `startCheckout(session, bookingId)` (`assertOwnership`; pending and unexpired only; stores `stripeCheckoutSessionId`); `confirmFromWebhook(event)` inside `em.transactional`: insert the event id first (a duplicate is a no-op), find the booking by Checkout session id, if already `confirmed` return, verify `amount_total === booking.priceCents` else mark `payment_mismatch` and refuse (R08), set `status = confirmed`, `bookedAt = now` (R15), `paidAt`, `slot.booking = booking`, emit `bookings.booking.confirmed`; `expirePending(now)` frees slots whose pending booking passed `expiresAt`.
4. Routes: `packages/app/src/app/api/bookings/[id]/checkout/route.ts` (POST, `apiHandler`, mentee only) returning the Checkout URL; `packages/app/src/app/api/payments/webhook/route.ts` (POST, `force-dynamic`, raw body, signature check via the port, 400 on a bad signature, dispatch by event type). `success_url` -> `/sessions?booked=<id>`, `cancel_url` -> `/m/<slug>`.
5. `packages/core/src/config/env.ts`: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` (optional; fail closed at the route); `.env.example`, `README.md`, CI workflow, `tests/integration/environment.ts`.
6. Reporting for D16 and D22: a read-only query in `booking.service.ts` (`paidSessionsPerWeek`, `medianBookingToStart(sinceDate)`) exposed on the operator dashboard `packages/app/src/app/admin/page.tsx` (operator only).
7. Tests (`SDLC.md` money gate): failure (bad signature, mismatched amount), retry (the same event twice), idempotency (one booking, one recorded charge), abandoned Checkout leaves the slot free; `coverage.include` in `vitest.config.mts`. Integration with the mock gateway: book, simulate the webhook, see the confirmed session on both sides.

#### ✅ Acceptance criteria
- Given a picked slot and length, When the mentee pays in Stripe Checkout, Then the booking becomes confirmed, the slot is taken, and both parties can see the booking. (R05)
- Given a Checkout the mentee abandons, When they return, Then no booking exists and the slot is still free. (negative)
- Given a Stripe confirmation delivered twice, When it is processed, Then one booking and one charge exist. (idempotency; SDLC money gate)
- Given a confirmed booking, When it is stored, Then it holds the booked-at time and the slot's start, so booking-to-start can be read for D22's median. (R15)
- Given the amount charged, When compared with the mentor's price for the chosen length, Then they are equal; the 20% split is E03-S06, not this story. (R08, R10)
- Given a confirmed booking, When paid sessions are counted for D16, Then it counts once as a paid session. (D16; which week it falls in, booking or start, is not decided and is an open detail)

#### 📋 Decisions in play
- D04 — Stripe is the only payment provider (owner: founder A)
- R05 — Stripe Checkout for sessions, Stripe Connect for payouts
- R15 — the product records the time from booking to session start for every booking
- R08 — the mentor's own prices within bounds
- R10 — the platform fee is 20%, configurable by the operator
- D16 — 10 paid sessions a week for two consecutive weeks by 2026-12-31 (owner: founder A)

#### Compatibility notes
- `BACKWARD_COMPATIBILITY.md` section 1: the webhook route is documented as the non-enveloped exception next to `/api/health`; section 4: two Stripe variables, optional, fail closed; section 6: new event; section 3: new table and columns. `risk-high` (money), `needs-qa`, second reviewer, no self-QA.

#### How to pick this up
- Run `om-auto-fix-issue 22` (it handles both bugs and features), or hand this analysis to `om-auto-create-pr` as the brief. Write the spec named above first (`--no-spec`).

#### Out of scope
- The fee split and payouts (E03-S06); refunds (E03-S05); notifications (E03-S04, which subscribes to the event this story emits).

#### Open questions
- Which week a paid session counts in for D16 (the booking week or the start week). — non-blocking (owner: founder A)


### E03-S04 — #23 The mentor and the mentee are told about a confirmed booking and each sees their upcoming sessions

**Issue:** [#23](https://github.com/open-mercato/ai_techleaders_project/issues/23)  
**Labels:** feature, priority-medium, risk-medium  
**Epic:** #9  
**Depends on:** E03-S03 (#22)  
**Iteration:** first (D13)

#### Summary
- First iteration (D13)
- The mentor and the mentee are told about a confirmed booking and each sees their upcoming sessions.
- Problem: the Key flow needs both parties to know a session exists; no decision record names how a mentor learns of a booking (the brief tags the step `[ASSUMPTION]`), and the repository has no sessions list and no mail transport beyond what E01-S02 introduces.
- Who has it: mentors (a booking arrives while they are away from the product); mentees (a place to find the session).
- Expected outcome: two notifications (in the product and by email) on confirmation, and a sessions list per role scoped to the caller; checked by the acceptance criteria and an isolation test.

Epic: #9
Depends on: E03-S03 (#22)

#### Spec
- Design authority: `.ai/specs/product-brief.md` (https://github.com/open-mercato/ai_techleaders_project/blob/backlog/product-brief/.ai/specs/product-brief.md, on PR #6 until it merges). Filed with `--no-spec`; write `.ai/specs/YYYY-MM-DD-booking-notifications.md` before implementing (owed).

#### Analysis
- `packages/core/src/events/event-bus.ts` and `packages/core/src/container/container.ts`: subscribers are registered in `build()` (today: a log line on `auth.user.created`); `bookings.booking.confirmed` (E03-S03) is the trigger here. In-process only: a failing handler is logged and swallowed, so the email is best-effort and the in-product record is the durable one.
- `packages/core/src/services/notifications/mailer.port.ts` and `adapters/log-mailer.ts` (E01-S02) are the transport; a real adapter is needed before October.
- `packages/core/src/services/bookings/booking.service.ts` (E03-S02) gets the scoped list methods; `packages/app/src/app/admin/users/page.tsx` is the `apiCall` plus `DataTable` shape the lists copy.
- Weakest source in the tree: the notification channel rests on the Key flow step tagged `[ASSUMPTION]`.

#### How to implement
1. Entity `Notification` (`packages/db/src/entities/notifications/notification.entity.ts`): `user` many-to-one, `kind` (`booking_confirmed` for now), `booking` many-to-one, `readAt` nullable; migration `notifications`.
2. `packages/core/src/services/notifications/notification.service.ts#onBookingConfirmed(bookingId)`: loads the booking with mentee and mentor, writes one `Notification` per party, sends one email per party through the mailer port (start, length, the other party's display name). Register in `container.ts` and `cradle.ts`; subscribe in `container.ts#build` on `bookings.booking.confirmed`. Nothing subscribes to pending or expired bookings, so an unconfirmed booking sends nothing.
3. `booking.service.ts#listForMentee(session)` (`mentee = session.userId`) and `listForMentor(session)` (`mentorProfile.user = session.userId`), each ordered by `startsAt`, with upcoming and past sections; DTOs carry start, length, counterpart name, status.
4. Routes: `packages/app/src/app/api/bookings/route.ts` GET (`apiHandler`; `student` -> `listForMentee`, `mentor` -> `listForMentor`; never a `userId` parameter from the client) and `packages/app/src/app/api/notifications/route.ts` (GET mine, POST mark read).
5. Pages: `packages/app/src/app/(student)/sessions/page.tsx` and `packages/app/src/app/(mentor)/mentor/sessions/page.tsx` (`DataTable`; a `?booked=<id>` banner after Checkout), plus an unread-notifications line on both role homes.
6. Tests: subscriber fires once per confirmed event and not for pending; list scoping (unit with two mentors); `coverage.include` in `vitest.config.mts`. Integration `tests/integration/sessions-list.integration.test.ts`: mentor A's list does not contain mentor B's booking (isolation).

#### ✅ Acceptance criteria
- Given a confirmed booking, When it is created, Then the mentor is told in the product and by email, with start, length, and the mentee's name; the mentee is told the same. (Key flow; no decision names notifications; `[ASSUMPTION]` in the brief)
- Given a mentee, When they open their sessions, Then upcoming and past sessions are listed with start, length, mentor, and status. (Key flow)
- Given a mentor, When they open their sessions, Then only sessions booked with them appear. (data scoping; negative)
- Given a booking that was never confirmed, When notifications run, Then none is sent. (negative)

#### 📋 Decisions in play
- R03 — sessions are text; every session screen says so
- D22 — the start time shown is the slot's start (owner: founder A)

#### Compatibility notes
- `BACKWARD_COMPATIBILITY.md` section 6: subscribing to an existing event is additive; section 3: new table; section 1: `GET /api/bookings` is new. `risk-medium`; `needs-qa`.

#### How to pick this up
- Run `om-auto-fix-issue 23` (it handles both bugs and features), or hand this analysis to `om-auto-create-pr` as the brief. Write the spec named above first (`--no-spec`).

#### Out of scope
- Reminders before the start (not in the brief); cancellation notices (E03-S05 emits its own event); a real mail transport (a follow-up before October, see E01-S02).

#### Open questions
- Whether a mentor also wants a calendar invite (`.ics`) in the email; not in any record. — non-blocking (owner: founder A)


### E03-S05 — #24 A mentee cancels free up to 24 hours before a session; a later cancellation forfeits the fee

**Issue:** [#24](https://github.com/open-mercato/ai_techleaders_project/issues/24)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #9  
**Depends on:** E03-S03 (#22)  
**Iteration:** 1.1 (D13)

#### Summary
- 1.1, not in the first iteration (D13)
- A mentee cancels free up to 24 hours before a session; a later cancellation forfeits the fee.
- Problem: D10 sets the cancellation window and R09 forbids automatic refunds for disputes; D13 leaves cancellation (the founders' E03-S07 and E03-S08) to 1.1, so the founders cancel and refund by hand under R18 until this ships.
- Who has it: mentees who cannot make the session; mentors whose slot should reopen.
- Expected outcome: a cancellation that frees the slot, refunds in full through Stripe when more than 24 hours remain and not at all afterwards, is refused once the session started, and is visible to the mentor with its refund state; checked by the acceptance criteria and money-path tests.

Epic: #9
Depends on: E03-S03 (#22)

#### Spec
- Design authority: `.ai/specs/product-brief.md` (https://github.com/open-mercato/ai_techleaders_project/blob/backlog/product-brief/.ai/specs/product-brief.md, on PR #6 until it merges). Filed with `--no-spec`; write `.ai/specs/YYYY-MM-DD-cancellation.md` before implementing (owed).

#### Analysis
- `packages/core/src/services/bookings/booking.service.ts` and `packages/db/src/entities/bookings/booking.entity.ts` (E03-S02, E03-S03): `status`, `startsAt`, `stripePaymentIntentId`; this story adds `cancelledAt`, `refundStatus` (`none` | `pending` | `refunded` | `failed`), `stripeRefundId`.
- `packages/core/src/services/payments/payment-gateway.port.ts#refund` and the webhook route (E03-S03-T01) for `charge.refunded`.
- `packages/db/src/entities/availability/slot.entity.ts`: the slot's `booking` link is cleared so the slot is offered again (E02-S03).
- `packages/core/src/events/event-map.ts`: `bookings.booking.cancelled` for E03-S04's notification service.

#### How to implement
1. Migration `booking-cancellation`: the three columns above.
2. `booking.service.ts#cancelByMentee(session, bookingId, now)`: `assertOwnership`; `startsAt <= now` -> `ConflictError` pointing to a quality dispute (E05-S03); `free = startsAt - now >= FREE_CANCELLATION_HOURS (24)`; inside `em.transactional`: `status = cancelled`, `cancelledAt`, clear `slot.booking`, `refundStatus = free ? pending : none`; after commit, when free, `paymentGateway.refund(stripePaymentIntentId, priceCents)` with the booking id as the idempotency key, store `stripeRefundId`, `refundStatus = refunded` (or `failed`, logged, shown to the operator); emit `bookings.booking.cancelled`.
3. Webhook branch `charge.refunded` -> mark `refunded` idempotently (E03-S03-T01's processed-event record).
4. Route `packages/app/src/app/api/bookings/[id]/cancel/route.ts` (POST, `apiHandler`, mentee only, `requireCsrfHeader`); the response says whether a refund was made.
5. UI: row action on `packages/app/src/app/(student)/sessions/page.tsx` with a confirmation that states the rule and the outcome ("free, full refund" or "less than 24 hours: no refund") before the mentee confirms (R09); `packages/app/src/app/(mentor)/mentor/sessions/page.tsx` shows `cancelled` and the refund state; `notification.service.ts` tells the mentor.
6. Tests (money gate): boundary at exactly 24 hours, refund failure leaves `failed` and the booking cancelled, retried refund uses the same idempotency key, started session refused; `coverage.include` in `vitest.config.mts`. Integration with the mock gateway on both sides of the window.

#### ✅ Acceptance criteria
- Given a confirmed booking more than 24 hours before its start, When the mentee cancels, Then the slot is freed and the full amount is refunded through Stripe. (R09, R05)
- Given a confirmed booking less than 24 hours before its start, When the mentee cancels, Then the slot is freed and no refund is made; the confirmation screen said so before the mentee confirmed. (R09)
- Given a cancelled booking, When the mentor opens their sessions, Then it shows as cancelled with its refund state. (R09)
- Given a session that has already started, When the mentee tries to cancel, Then the product refuses and points to a quality dispute (E05-S03). (R09, negative)

#### 📋 Decisions in play
- D10 — free cancellation up to 24 hours before; later forfeits the fee; disputes by the operator; no automatic refunds (owner: founder A)
- R09 — the same, as a rule
- R05 — Stripe only; refunds through Stripe

#### Compatibility notes
- `BACKWARD_COMPATIBILITY.md` section 3: additive columns; section 6: new event; section 1: new route. `risk-high` (money), `needs-qa`, second reviewer. Until this ships, a refund is done by hand in the Stripe dashboard and logged (R18).

#### How to pick this up
- Run `om-auto-fix-issue 24` (it handles both bugs and features), or hand this analysis to `om-auto-create-pr` as the brief. Write the spec named above first (`--no-spec`).

#### Out of scope
- Mentor-initiated cancellation (D10 speaks of the mentee only); disputes (E05-S03); the fee reversal on a refund (E03-S06 takes no fee on a refunded session).

#### Open questions
- What happens when the mentor cancels; D10 does not say. — non-blocking (owner: founder A)


### E03-S06 — #25 DevMentor keeps 20% of a paid session and the mentor's share is paid out through Stripe Connect

**Issue:** [#25](https://github.com/open-mercato/ai_techleaders_project/issues/25)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #9  
**Depends on:** E03-S03 (#22), E02-S05 (#19)  
**Iteration:** 1.1 (D13)

#### Summary
- 1.1, not in the first iteration (D13)
- DevMentor keeps 20% of a paid session and the mentor's share is paid out through Stripe Connect.
- Problem: D11 sets the fee and R05 the payout channel; D13 leaves the split (the founders' E06-S01) to 1.1, so the first iteration takes the mentee's payment with no story for paying the mentor (Q19).
- Who has it: mentors waiting to be paid; the founders reconciling money by hand until then.
- Expected outcome: the fee and the share recorded per held session with the fee in force at booking, a transfer through Connect and nothing else, a hold without onboarding, and no fee on a refund; checked by the acceptance criteria and money-gate tests.

Epic: #9
Depends on: E03-S03 (#22), E02-S05 (#19)

#### Spec
- Design authority: `.ai/specs/product-brief.md` (https://github.com/open-mercato/ai_techleaders_project/blob/backlog/product-brief/.ai/specs/product-brief.md, on PR #6 until it merges). Filed with `--no-spec`; write `.ai/specs/YYYY-MM-DD-fee-split-and-payouts.md` before implementing (owed); it must choose between separate transfers and destination charges (see Open questions).

#### Analysis
- `packages/db/src/entities/bookings/booking.entity.ts`: add `feePercentApplied`, `platformFeeCents`, `mentorShareCents` (snapshot at confirmation so a later fee change never touches earlier bookings, R10).
- `packages/core/src/services/operator/platform-settings.service.ts#get().feePercent` (E02-S04; env-backed until E05-S02).
- `packages/core/src/services/payments/payment-gateway.port.ts`: `transfer({ amountCents, currency, destinationAccountId, idempotencyKey, transferGroup })`; `packages/db/src/entities/mentors/mentor-profile.entity.ts#payoutsEnabled` (E02-S05).
- There is no scheduler or worker (`AGENTS.md`): completion is detected on demand.

#### How to implement
1. Migration `fee-split`: the three booking columns; entity `Payout` (`packages/db/src/entities/payments/payout.entity.ts`: `booking` 1:1 unique, `mentorProfile`, `amountCents`, `status` `held` | `transferred` | `failed`, `stripeTransferId`, `heldReason`).
2. `packages/core/src/services/payments/payment.service.ts#confirmFromWebhook` (E03-S03) computes `feePercentApplied = settings.feePercent`, `platformFeeCents = round(priceCents * fee / 100)`, `mentorShareCents = priceCents - platformFeeCents` at confirmation.
3. `packages/core/src/services/payments/payout.service.ts`: `runDue(now)` for confirmed, uncancelled bookings with `startsAt + lengthMinutes <= now` and no payout: `payoutsEnabled` -> `paymentGateway.transfer` with idempotency key = payout id, `transferred`; else `held` with `heldReason = 'connect_onboarding_incomplete'` and a notification to the mentor; a refunded or cancelled booking gets no payout and no fee; `listForMentor(session)` for the payouts page.
4. Trigger: `packages/app/src/app/api/operator/payouts/run/route.ts` (POST, operator only) and a "Run payouts" button on `packages/app/src/app/admin/page.tsx`; `scripts/payouts-run.ts` (`tsx`) for the founders (R18). A scheduler is a later decision.
5. `packages/app/src/app/(mentor)/mentor/payouts/page.tsx` (E02-S05): per-session share and payout status; the operator dashboard shows fee totals.
6. Tests (money gate): rounding, fee change applies only to later bookings, refund -> no fee and no payout, held without onboarding, transfer idempotent on retry, transfer failure -> `failed` and retried later; `coverage.include` in `vitest.config.mts`.

#### ✅ Acceptance criteria
- Given a paid session that was held, When it completes, Then 20% is recorded as the platform fee and the rest as the mentor's share. (R10)
- Given a mentor with completed Connect onboarding, When the payout runs, Then the share is transferred through Stripe Connect and through nothing else. (R05)
- Given a mentor without Connect onboarding, When the payout would run, Then it is held and the mentor is told. (R05, negative)
- Given the operator changes the fee (E05-S02), When later sessions are paid, Then the new fee applies to them and not to earlier ones. (R10; money)
- Given a refunded session, When fees are computed, Then no fee is taken. (negative)

#### 📋 Decisions in play
- D11 — platform fee 20% of a session; the vault fee is set later (owner: founder A)
- R10 — the same, as a rule; configurable by the operator
- D04 — Stripe only, with Connect for payouts (owner: founder A)
- R05 — Connect onboarding before the first payout
- R18 — by-hand operator actions are logged

#### Compatibility notes
- `BACKWARD_COMPATIBILITY.md` section 3: new table and columns; section 2: additive port method; section 5: a new npm script is additive. `risk-high` (money), `needs-qa`, second reviewer.

#### How to pick this up
- Run `om-auto-fix-issue 25` (it handles both bugs and features), or hand this analysis to `om-auto-create-pr` as the brief. Write the spec named above first (`--no-spec`).

#### Out of scope
- Connect onboarding (E02-S05); the settings screen (E05-S02); paying first-iteration mentors by hand (Q19, a founders' decision).

#### Open questions
- Q19 — until this story and E02-S05 ship, first-iteration payouts are undecided (owner founder A with founder B); blocking before the first payout falls due.
- Separate transfers after completion (works for mentors who onboard late) or destination charges at Checkout (simpler, but requires onboarding before any booking); the spec decides. — non-blocking (owner: founder A)


### E04 — #10 Session, written answer, and note

**Issue:** [#10](https://github.com/open-mercato/ai_techleaders_project/issues/10)  
**Labels:** feature, priority-medium, risk-medium

#### Summary
- A paid session is held as text inside DevMentor, ends with a written answer the mentee keeps, and produces a note the mentor drafts and the mentee approves or declines; both keep the approved note privately.
- Problem: the working developer of 2026-08-20 got "two contradictory answers" and shipped code they did not trust; "I don't want a course, I want an answer" `[INTERVIEW]` `.ai/specs/research/2026-08-20-interview-working-dev.md`; the mentor of 2026-08-22 keeps a private notes file that rots and "won't publish anything a mentee didn't agree to" `[INTERVIEW]` `.ai/specs/research/2026-08-22-interview-mentor.md`.
- Who has it: mentees who need an answer they can act on; mentors whose notes are their asset.
- Expected outcome: a paid session ends with a written answer the mentee keeps and a note both parties keep privately after the mentee's approval; checked by the stories' criteria; D03's bar is an "answerable" session.

#### Spec
- Design authority: `.ai/specs/product-brief.md` (https://github.com/open-mercato/ai_techleaders_project/blob/backlog/product-brief/.ai/specs/product-brief.md, on PR #6 until it merges). Filed with `--no-spec`; a `.ai/specs/YYYY-MM-DD-sessions-notes.md` spec is still owed before implementation per `AGENTS.md`, and it must settle Q18 first.

#### Analysis
- Affected areas: new concept folders `sessions` and `notes` (`packages/db/src/entities/sessions/session-message.entity.ts`, `packages/db/src/entities/notes/session-note.entity.ts`, `packages/core/src/services/sessions/session.service.ts`, `packages/core/src/services/notes/session-note.service.ts`, `packages/app/src/app/api/sessions/...`, `packages/app/src/app/api/notes/...`); the `Booking` entity from E03 (`packages/db/src/entities/bookings/booking.entity.ts`) carries the written answer; `packages/core/src/http/auth.ts` `assertOwnership` is the party check every route here runs first.
- Q18 (where the text exchange lives) is open: the stories use the plain reading (a session screen inside DevMentor); if founder A decides on an external channel, E04-S01 shrinks to the written-answer screen and the rest of the epic is unchanged.

#### How to implement
1. E04-S01 (#26): the text session screen with the time window and the "sessions are text" line.
2. E04-S02 (#27): the written answer.
3. E04-S03 (#28): the draft note awaiting approval.
4. E04-S04 (#29): approve in full or decline with a comment; private keeping; the decline counter.
5. Unit tests per file; an integration scenario proving a third user cannot open a session (data scoping).

#### Compatibility notes
- `BACKWARD_COMPATIBILITY.md` section 3 (new tables, additive; migrations with `up` and `down`), section 6 (new events `sessions.answer.posted`, `notes.note.approved` are additive), section 8 (R02 and D05: nothing published; a story that publishes would need a superseding record).

#### How to pick this up
- Pick up the stories in the checklist below in order with `om-auto-fix-issue <story number>`; E04-S01 needs E03-S03 first and Q18 answered.

#### Out of scope
- N01 video; publishing anything (R02, D05); co-editing the note (R12); the vault (D05).

#### Open questions
- Q18 — where the text exchange takes place (owner founder A): non-blocking for filing, blocking before E04-S01 is implemented.

#### 📋 Decisions in play
- D01 / R01 — sessions are 25 or 50 minutes (owner: founder A)
- N01 / R03 — sessions are text; every session screen says so (owner: founder A)
- D05 — 1.0 delivers the written answer and a privately kept note; the vault is later (owner: founder A)
- D02 / R02 — nothing from a session is published without the mentee's approval (owner: both founders)
- D20 / R12 — the mentor drafts, the mentee approves in full or declines with a comment, the mentor redrafts; no co-editing (owner: founder A)
- D03 — the first iteration must leave an answerable session (owner: founder A)

#### 📋 Stories
<!-- om-backlog: checklist, rewritten on every run -->
- [ ] #26 E04-S01 — At the slot's start the mentee and the mentor hold a 25- or 50-minute text session in DevMentor; every session screen says sessions are text
- [ ] #27 E04-S02 — The mentor gives the written answer and the mentee sees it after the session
- [ ] #28 E04-S03 — The mentor drafts a session note and the mentee sees it awaiting approval
- [ ] #29 E04-S04 — The mentee approves the note in full or declines it with a comment; an approved note is kept privately by both; nothing is published


### E04-S01 — #26 At the slot's start the mentee and the mentor hold a 25- or 50-minute text session in DevMentor; every session screen says sessions are text

**Issue:** [#26](https://github.com/open-mercato/ai_techleaders_project/issues/26)  
**Labels:** feature, priority-medium, risk-medium  
**Epic:** #10  
**Depends on:** E03-S03 (#22)  
**Iteration:** first (D13)

#### Summary
- First iteration (D13)
- At the slot's start the mentee and the mentor hold a 25- or 50-minute text session in DevMentor; every session screen says sessions are text.
- Problem: the mentee interviewed on 2026-08-20 wants an answer, not a course, and said "text is fine, faster"; N01 rules out video and R03 makes every session screen say so. Nothing in the repository holds a session's exchange, and Q18 (where the exchange lives) is still open.
- Who has it: the two parties of a confirmed booking.
- Expected outcome: a session screen both parties can open at the start time and post text in for the booked length, visible to no one else, ended after 25 or 50 minutes with the written answer still possible afterwards; checked by the acceptance criteria and a third-user denial test.

Epic: #10
Depends on: E03-S03 (#22)

#### Spec
- Design authority: `.ai/specs/product-brief.md` (https://github.com/open-mercato/ai_techleaders_project/blob/backlog/product-brief/.ai/specs/product-brief.md, on PR #6 until it merges). Filed with `--no-spec`; write `.ai/specs/YYYY-MM-DD-text-session.md` before implementing (owed), after Q18 is answered.

#### Analysis
- New concept `sessions`: `packages/db/src/entities/sessions/session-message.entity.ts`, `packages/core/src/services/sessions/session.service.ts`, `packages/core/src/validators/sessions/message-create.schema.ts`, `packages/app/src/app/api/sessions/[bookingId]/...`, `packages/app/src/app/sessions/[bookingId]/page.tsx`.
- `packages/db/src/entities/bookings/booking.entity.ts` (E03-S02): `startsAt`, `lengthMinutes`, `mentee`, `mentorProfile` define the window and the parties; `packages/core/src/http/auth.ts#assertOwnership` is the party check (against the mentee id or the mentor's user id).
- `packages/ui/src/components/sessions/SessionIsTextNotice.tsx` (E03-S02) is the R03 line every session screen renders.
- No websocket or worker exists (`AGENTS.md`); the screen polls through `apiCall` from `packages/ui/src/backend/api/apiCall.ts`.
- Q18's plain reading (a session screen inside DevMentor) is built here; if founder A chooses an external channel, this story shrinks to the written-answer screen (E04-S02).

#### How to implement
1. Entity `SessionMessage`: `booking` many-to-one, `author` many-to-one `User`, `body` text (max 4000), `createdAt`; index on `booking`; migration `sessions`.
2. `session.service.ts`: `getForParty(session, bookingId, now)` (confirmed booking; party check, else `ForbiddenError`; returns booking, messages, `window`); `window(booking, now)` = `not_started` | `open` | `ended` with `endsAt = startsAt + lengthMinutes` (R01); `postMessage(session, bookingId, body, now)` only while `open`. Register in `container.ts` and `cradle.ts`.
3. Routes with `apiHandler`: `packages/app/src/app/api/sessions/[bookingId]/route.ts` (GET) and `packages/app/src/app/api/sessions/[bookingId]/messages/route.ts` (POST, `requireCsrfHeader`).
4. Page `packages/app/src/app/sessions/[bookingId]/page.tsx` (server-side party check through `packages/app/src/lib/session.ts`, E01-S03; one page for both roles): `SessionIsTextNotice` at the top, no audio or video control anywhere, the message list polling every few seconds, the composer enabled only while `open`, an "ended" state that points to the written answer (E04-S02). Linked from both sessions lists (E03-S04).
5. Tests: window math at the boundaries, third user 403, post after `ended` refused, post before start refused; `coverage.include` in `vitest.config.mts`. Integration `tests/integration/session.integration.test.ts`: a third signed-in user opening the session address is refused; the snapshot contains the "sessions are text" line.

#### ✅ Acceptance criteria
- Given a confirmed booking, When its start time arrives, Then both parties can open the session and exchange text there. (R01; the "there" rests on Q18's plain reading, `[ASSUMPTION]`)
- Given any session screen, When it renders, Then it says the session is text and offers no video or audio. (R03, N01, negative)
- Given the booked length, When 25 or 50 minutes have passed since the start, Then the session shows as ended; the written answer can still be posted afterwards. (R01, D05)
- Given a user who is neither party, When they open the session's address, Then they are refused. (data scoping; negative)

#### 📋 Decisions in play
- R03 — sessions are text; the product says so on every session screen
- N01 — no video calls (owner: founder A)
- R01 — a session is 25 or 50 minutes
- D01 — sessions are 25 or 50 minutes (owner: founder A)

#### Compatibility notes
- `BACKWARD_COMPATIBILITY.md` section 3: new table; section 1: new routes. `risk-medium` (data scoping is enforced by the existing `assertOwnership`; the isolation test is still required); `needs-qa`.

#### How to pick this up
- Run `om-auto-fix-issue 26` (it handles both bugs and features), or hand this analysis to `om-auto-create-pr` as the brief. Write the spec named above first (`--no-spec`), after Q18.

#### Out of scope
- Video or audio (N01); the written answer (E04-S02); notes (E04-S03, E04-S04); file attachments (not in the brief).

#### Open questions
- Q18 — where the text exchange takes place: a session screen inside DevMentor (built here) or a channel the mentor names with only the written answer in the product. — non-blocking for filing, blocking before implementation (owner: founder A)


### E04-S02 — #27 The mentor gives the written answer and the mentee sees it after the session

**Issue:** [#27](https://github.com/open-mercato/ai_techleaders_project/issues/27)  
**Labels:** feature, priority-medium, risk-medium  
**Epic:** #10  
**Depends on:** E04-S01 (#26)  
**Iteration:** first (D13)

#### Summary
- First iteration (D13)
- The mentor gives the written answer and the mentee sees it after the session.
- Problem: D05 makes the written answer what a 1.0 session produces, and D03's bar for the first iteration is an "answerable" session; the mentee interviewed on 2026-08-20 wants an answer they can act on and keep.
- Who has it: mentees (the answer is what they paid for); mentors (the answer is the deliverable).
- Expected outcome: one written answer per session, posted by that session's mentor, visible to the mentee in the session and kept there, with an explicit "still owed" state; checked by the acceptance criteria.

Epic: #10
Depends on: E04-S01 (#26)

#### Spec
- Design authority: `.ai/specs/product-brief.md` (https://github.com/open-mercato/ai_techleaders_project/blob/backlog/product-brief/.ai/specs/product-brief.md, on PR #6 until it merges). Filed with `--no-spec`; write `.ai/specs/YYYY-MM-DD-written-answer.md` (or fold it into the text-session spec) before implementing (owed).

#### Analysis
- `packages/db/src/entities/bookings/booking.entity.ts` (E03-S02) carries the session's state; the answer belongs to the booking (one per session), so two nullable columns are enough.
- `packages/core/src/services/sessions/session.service.ts` (E04-S01) already resolves the parties and the window; `postAnswer` is a mentor-only method on it.
- `packages/core/src/events/event-map.ts` gains `sessions.answer.posted`; `packages/core/src/services/notifications/notification.service.ts` (E03-S04) tells the mentee.
- `packages/app/src/app/sessions/[bookingId]/page.tsx` (E04-S01) gets the answer panel.

#### How to implement
1. Migration `written-answer`: `written_answer` text nullable and `written_answer_at` timestamptz nullable on `bookings`; entity update.
2. `packages/core/src/validators/sessions/answer-update.schema.ts`: `body` min 1, max 20000.
3. `session.service.ts#postAnswer(session, bookingId, body, now)`: the booking's mentor only (`assertOwnership` against `mentorProfile.user.id`), window `open` or `ended`, sets both columns, emits `sessions.answer.posted`; `getForParty` returns `answer: { body, postedAt } | null` and `answerOwed = window === 'ended' && answer === null`.
4. Route `packages/app/src/app/api/sessions/[bookingId]/answer/route.ts` (PUT, `apiHandler`, mentor only, `requireCsrfHeader`).
5. Page: on `sessions/[bookingId]/page.tsx` the mentor sees an answer editor (a `CrudForm` bound to the schema, `method: 'PUT'`), the mentee sees the answer or "The written answer is still owed" after the session ended; a notification (in product and by email through the mailer port) on `sessions.answer.posted`.
6. Tests: another mentor 403, owed state, answer persists on re-read, mentee cannot PUT; `coverage.include` in `vitest.config.mts`.

#### ✅ Acceptance criteria
- Given a held session, When the mentor posts the written answer, Then the mentee sees it in the session and is told it is there. (D05)
- Given a session with no written answer after its end, When the mentee opens it, Then it says the answer is still owed. (negative; D03 "answerable")
- Given a posted written answer, When the mentee opens the session weeks later, Then the answer is still there. (D05)
- Given the mentor of a different session, When they try to post an answer to this one, Then they are refused. (data scoping; negative)

#### 📋 Decisions in play
- D05 — 1.0 delivers the written answer and a privately kept note (owner: founder A)
- D03 — the first iteration must leave an answerable session (owner: founder A)
- R03 — sessions are text; every session screen says so

#### Compatibility notes
- `BACKWARD_COMPATIBILITY.md` section 3: additive columns; section 6: new event; section 1: new route. `risk-medium`; `needs-qa`.

#### How to pick this up
- Run `om-auto-fix-issue 27` (it handles both bugs and features), or hand this analysis to `om-auto-create-pr` as the brief. Write the spec named above first (`--no-spec`).

#### Out of scope
- Editing the answer after posting (not in the brief; a later `updatedAt` if needed); the note (E04-S03); publishing anything (R02).

#### Open questions
- Whether the answer may be revised after posting; the plain reading is one answer, replaceable until the note is approved. — non-blocking (owner: founder A)


### E04-S03 — #28 The mentor drafts a session note and the mentee sees it awaiting approval

**Issue:** [#28](https://github.com/open-mercato/ai_techleaders_project/issues/28)  
**Labels:** feature, priority-medium, risk-medium  
**Epic:** #10  
**Depends on:** E04-S02 (#27)  
**Iteration:** first (D13)

#### Summary
- First iteration (D13)
- The mentor drafts a session note and the mentee sees it awaiting approval.
- Problem: the mentor interviewed on 2026-08-22 keeps a private notes file that rots and "won't publish anything a mentee didn't agree to"; D20 makes the mentor the drafter and D02 gives the mentee the approval; nothing in the repository stores a note.
- Who has it: mentors (the note is their asset); mentees (they must see what they are asked to approve).
- Expected outcome: a draft note per session, sent for approval, visible only to the two parties, read-only for the mentee with approve or decline as the only actions; checked by the acceptance criteria.

Epic: #10
Depends on: E04-S02 (#27)

#### Spec
- Design authority: `.ai/specs/product-brief.md` (https://github.com/open-mercato/ai_techleaders_project/blob/backlog/product-brief/.ai/specs/product-brief.md, on PR #6 until it merges). Filed with `--no-spec`; write `.ai/specs/YYYY-MM-DD-session-notes.md` (shared with E04-S04) before implementing (owed).

#### Analysis
- New concept `notes`: `packages/db/src/entities/notes/session-note.entity.ts`, `packages/core/src/services/notes/session-note.service.ts`, `packages/core/src/validators/notes/note-draft.schema.ts`, `packages/app/src/app/api/notes/[bookingId]/...`.
- `packages/core/src/services/sessions/session.service.ts` (E04-S01, E04-S02) resolves the parties; a note requires `writtenAnswerAt` on the booking (D05: the note follows the answer).
- `packages/app/src/app/sessions/[bookingId]/page.tsx` gets the note panel; `packages/ui/src/backend/forms/CrudForm.tsx` renders the mentor's draft form.
- Visibility: no route lists notes across bookings; `getPublicBySlug` and the mentor list (`mentor-profile.service.ts`) never join notes.

#### How to implement
1. Entity `SessionNote`: `booking` many-to-one, `version` integer, `body` text, `status` (`draft` | `awaiting_approval` | `approved` | `declined`), `declineComment` nullable, `sentAt`, `decidedAt` nullable; unique (`booking_id`, `version`); migration `notes`.
2. Schema `note-draft.schema.ts`: `body` min 1, max 20000.
3. `session-note.service.ts`: `getForParty(session, bookingId)` (party check or `ForbiddenError`; returns the current version and the history), `saveDraft(session, bookingId, body)` (mentor only; requires `writtenAnswerAt`; creates version 1 or a new version after a decline, E04-S04), `sendForApproval(session, bookingId)` (mentor only; `draft` -> `awaiting_approval`, `sentAt`, notification to the mentee). Register in `container.ts` and `cradle.ts`.
4. Routes with `apiHandler`: `packages/app/src/app/api/notes/[bookingId]/route.ts` (GET for both parties; PUT draft, mentor only) and `packages/app/src/app/api/notes/[bookingId]/send/route.ts` (POST, mentor only).
5. Page: on `sessions/[bookingId]/page.tsx` the mentor gets a draft editor and "Send for approval"; the mentee gets a read-only view marked "Awaiting your approval" with Approve and Decline with a comment (E04-S04) and no edit control; the panel says the note stays private.
6. Tests: third user 403 on GET, mentee PUT 403, draft before the answer refused, send transitions once; `coverage.include` in `vitest.config.mts`. Integration: the mentee's snapshot has no textbox for the note body.

#### ✅ Acceptance criteria
- Given a session with a written answer, When the mentor writes a draft note and sends it for approval, Then the mentee sees it marked as awaiting their approval. (R12)
- Given a draft note not yet approved, When anyone but the two parties looks, Then it is visible nowhere. (R02, negative)
- Given the mentee viewing a draft, When they look for a way to edit it, Then there is none: only approve, or decline with a comment. (R12 no co-editing, negative)

#### 📋 Decisions in play
- D20 — the mentor drafts; the mentee approves in full or declines with a comment; no co-editing (owner: founder A)
- R12 — the same, as a rule
- R02 — nothing from a session is published without the mentee's approval
- D02 — the same, as a decision (owner: both founders)

#### Compatibility notes
- `BACKWARD_COMPATIBILITY.md` section 3: new table; section 1: new routes; section 8: R02 and D05 bound this story (nothing published). `risk-medium`; `needs-qa`.

#### How to pick this up
- Run `om-auto-fix-issue 28` (it handles both bugs and features), or hand this analysis to `om-auto-create-pr` as the brief. Write the spec named above first (`--no-spec`).

#### Out of scope
- Approval and decline (E04-S04); co-editing (R12); the vault (D05).

#### Open questions
- none blocking; whether the mentor may keep editing a draft after sending it (the plain reading: no, until it is declined). — non-blocking (owner: founder A)


### E04-S04 — #29 The mentee approves the note in full or declines it with a comment; an approved note is kept privately by both; nothing is published

**Issue:** [#29](https://github.com/open-mercato/ai_techleaders_project/issues/29)  
**Labels:** feature, priority-medium, risk-medium  
**Epic:** #10  
**Depends on:** E04-S03 (#28)  
**Iteration:** first (D13)

#### Summary
- First iteration (D13)
- The mentee approves the note in full or declines it with a comment; an approved note is kept privately by both; nothing is published.
- Problem: D02 ("trust is the product") and R02 make the mentee's approval the gate before anything from a session exists beyond the two parties; D20 fixes the mechanics and names repeated declines as the signal for co-editing.
- Who has it: mentees (the approval is theirs); mentors (they redraft after a decline); the operator (reads the decline count).
- Expected outcome: approve or decline with a mandatory comment, a redraft as a new version, an approved note visible to both parties and marked private, absent from every public payload, and a decline count the operator can read; checked by the acceptance criteria.

Epic: #10
Depends on: E04-S03 (#28)

#### Spec
- Design authority: `.ai/specs/product-brief.md` (https://github.com/open-mercato/ai_techleaders_project/blob/backlog/product-brief/.ai/specs/product-brief.md, on PR #6 until it merges). Filed with `--no-spec`; write `.ai/specs/YYYY-MM-DD-session-notes.md` (shared with E04-S03) before implementing (owed).

#### Analysis
- `packages/db/src/entities/notes/session-note.entity.ts` and `packages/core/src/services/notes/session-note.service.ts` (E04-S03) hold the versions and statuses; this story adds the decisions.
- `packages/core/src/validators/notes/note-decline.schema.ts` enforces the comment (R12: a decline carries a comment).
- `packages/core/src/events/event-map.ts` gains `notes.note.approved` and `notes.note.declined` (notifications through E03-S04's service).
- Operator read path: `packages/app/src/app/admin/` (operator only, E01-S03) is where the decline count is shown; the public routes `api/mentors/[slug]` and `api/mentors` (E02-S02, E03-S01) never include notes, which the tests assert.

#### How to implement
1. Schema `note-decline.schema.ts`: `comment` min 1, max 2000.
2. `session-note.service.ts`: `approve(session, bookingId)` (mentee only; `awaiting_approval` -> `approved`, `decidedAt`; emits `notes.note.approved`), `decline(session, bookingId, comment)` (mentee only; -> `declined` with the comment; emits `notes.note.declined`; the mentor's next `saveDraft` creates `version + 1`), `declineCount(bookingId)` = number of `declined` versions; `getForParty` returns the approved note with `private: true` and the decline history.
3. Routes with `apiHandler`: `packages/app/src/app/api/notes/[bookingId]/approve/route.ts` and `packages/app/src/app/api/notes/[bookingId]/decline/route.ts` (POST, mentee only, `requireCsrfHeader`).
4. Page: on `sessions/[bookingId]/page.tsx` the mentee's Approve and Decline (with the comment field, submit disabled while empty); the mentor sees the comment and a "Redraft" action; both see the approved note marked "Private: kept by you and the other party; nothing is published".
5. Operator: `packages/app/src/app/admin/sessions/page.tsx` (operator only) lists bookings with a "note declines" column from `declineCount` (D20's co-editing signal); add the nav link in `packages/app/src/app/admin/layout.tsx`.
6. Tests: decline without comment -> 422 with `fieldErrors.comment`; a declined version never reads as approved; approved note absent from `GET /api/mentors/[slug]` and `GET /api/mentors` payloads and from any list route; decline count after two declines; mentor cannot approve; `coverage.include` in `vitest.config.mts`.

#### ✅ Acceptance criteria
- Given a draft note, When the mentee approves it, Then it becomes an approved note visible to both parties and marked private. (D05, R02)
- Given a draft note, When the mentee declines it with a comment, Then the mentor sees the comment and can redraft; the declined draft is never shown as approved. (R12)
- Given a decline with no comment, When submitted, Then it is refused: a decline carries a comment. (R12, negative)
- Given an approved note, When any other user, the mentor list, or any public page is checked, Then the note appears nowhere: no vault, no publishing in 1.0. (R02, D05, negative)
- Given a session whose note is declined more than once in a row, When the operator reads the session, Then the number of declines is visible, because that is D20's signal for co-editing. (D20)

#### 📋 Decisions in play
- D20 — mentor drafts, mentee approves in full or declines with a comment, mentor redrafts; declines more than once in a row are the co-editing signal (owner: founder A)
- R12 — the same, as a rule
- R02 — nothing published without the mentee's approval
- D02 — the same, as a decision (owner: both founders)
- D05 — the approved note is kept privately; the vault is later (owner: founder A)

#### Compatibility notes
- `BACKWARD_COMPATIBILITY.md` section 6: new events; section 1: new routes; section 8: R02 and D05 (a PR that publishes a note needs a superseding record). `risk-medium`; `needs-qa`.

#### How to pick this up
- Run `om-auto-fix-issue 29` (it handles both bugs and features), or hand this analysis to `om-auto-create-pr` as the brief. Write the spec named above first (`--no-spec`).

#### Out of scope
- Publishing into a vault (later scope, D05, D25); co-editing (R12); exporting the note (not in the brief).

#### Open questions
- none blocking; the operator's read of the session for the decline count is a scoping exception that E05-S03 also needs; name it in the spec. — non-blocking (owner: both founders)


### E05 — #11 Operator functions in 1.0

**Issue:** [#11](https://github.com/open-mercato/ai_techleaders_project/issues/11)  
**Labels:** feature, priority-medium, risk-high

#### Summary
- The operator (the two founders) invites mentors, sets the price bounds and the platform fee, and resolves quality disputes inside the product instead of by hand.
- Problem: invitations (D08), price bounds (D09), disputes (D10), and the fee (D11) all name an operator; in 1.0 the operator is the two founders, and every action without a story is done by hand and logged in a shared note (D19, R18) `[DOCUMENT]` `.ai/specs/research/decisions/D19-operator.md`. None of these stories is in D13; more than one manual operator action a day for a week pulls the next one forward.
- Who has it: the operator (founder A, founder B).
- Expected outcome: the operator invites, bounds, configures, and resolves inside the product instead of by hand; checked by the shared operator note going quiet.

#### Spec
- Design authority: `.ai/specs/product-brief.md` (https://github.com/open-mercato/ai_techleaders_project/blob/backlog/product-brief/.ai/specs/product-brief.md, on PR #6 until it merges). Filed with `--no-spec`; a `.ai/specs/YYYY-MM-DD-operator.md` spec is still owed before implementation per `AGENTS.md`.

#### Analysis
- Affected areas: the existing admin surface `packages/app/src/app/admin/layout.tsx` (nav: Dashboard, Users), `packages/app/src/app/admin/page.tsx`, `packages/app/src/app/admin/users/page.tsx` (the reference list page built on `DataTable` and `apiCall`), which becomes the operator's workspace once E01-S03 guards it with `requireRole(session, 'operator')`; new concept folders `operator` (platform settings) and `disputes`; the `invitations` concept from E02-S01.
- `packages/ui/src/backend/forms/CrudForm.tsx` and `tables/DataTable.tsx` are the mandatory primitives for the settings form and the invitation and dispute lists (`AGENTS.md`, "Never hand-roll fetch / validation / error-handling / CRUD").

#### How to implement
1. E05-S01 (#30, 1.1): invitation batches of 20 and the two-week publish check.
2. E05-S02 (#31, 1.1): price bounds and the platform fee as a stored setting.
3. E05-S03 (#32, 1.1): quality disputes and their outcome.
4. Every route under `/api/operator/*` and `/api/invitations` (create) and `/api/disputes` (resolve) denies non-operators; integration tests for the denied path.

#### Compatibility notes
- `BACKWARD_COMPATIBILITY.md` "What is not protected" names the admin headings `Dashboard` and `Users` and the link `Users` that `tests/integration/admin.integration.test.ts` asserts on; keep them or update the test in the same PR. Section 3 for the new tables; section 4 if bounds or the fee are read from environment until E05-S02 lands.

#### How to pick this up
- Pick up the stories in the checklist below with `om-auto-fix-issue <story number>`; all three need E01-S03, and E05-S03 needs E03-S03.

#### Out of scope
- An admin role beyond the two founders; automatic refunds (R09); ranking or featuring mentors (R13, N02).

#### Open questions
- None blocking.

#### 📋 Decisions in play
- D19 / R18 — the operator is the two founders; by-hand actions are logged (owner: both founders)
- D08 / R07 — invitation only (owner: founder A)
- D18 / R17 — batches of 20, one bookable session within two weeks, fewer than 5 of 20 stops invitations (owner: both founders)
- D24 / R16 — the beachhead pool (owner: founder A)
- D09 / R08 — prices within operator bounds (owner: founder A)
- D11 / R10 — the 20% fee, operator-configurable (owner: founder A)
- D10 / R09 — disputes resolved by the operator, no automatic refunds (owner: founder A)

#### 📋 Stories
<!-- om-backlog: checklist, rewritten on every run -->
- [ ] #30 E05-S01 — The operator invites a senior engineer from the beachhead pool in a batch of 20 and sees who published a slot within two weeks
- [ ] #31 E05-S02 — The operator sets the price bounds and the platform fee
- [ ] #32 E05-S03 — The operator resolves a quality dispute and records the outcome; no automatic refund


### E05-S01 — #30 The operator invites a senior engineer from the beachhead pool in a batch of 20 and sees who published a slot within two weeks

**Issue:** [#30](https://github.com/open-mercato/ai_techleaders_project/issues/30)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #11  
**Depends on:** E01-S03 (#14)  
**Iteration:** 1.1 (D13)

#### Summary
- 1.1, not in the first iteration (D13)
- The operator invites a senior engineer from the beachhead pool in a batch of 20 and sees who published a slot within two weeks.
- Problem: D18 makes the invitation the test of A03 (five of the first twenty must publish within two weeks) and R17 fixes batches of 20; until this ships the founders create invitations with the by-hand script from E02-S01 and count publishers in the shared note (R18).
- Who has it: the operator (founder A, founder B).
- Expected outcome: invitation batches with a hard cap of 20, the two-week publish report per batch, and the D18 stop rule shown and enforced; checked by the acceptance criteria and a denied-path test for non-operators.

Epic: #11
Depends on: E01-S03 (#14)

#### Spec
- Design authority: `.ai/specs/product-brief.md` (https://github.com/open-mercato/ai_techleaders_project/blob/backlog/product-brief/.ai/specs/product-brief.md, on PR #6 until it merges). Filed with `--no-spec`; write `.ai/specs/YYYY-MM-DD-invitation-batches.md` before implementing (owed).

#### Analysis
- `packages/db/src/entities/invitations/invitation.entity.ts` and `packages/core/src/services/invitations/invitation.service.ts` (E02-S01): `batch` is nullable there; this story adds the batch entity and the report.
- `packages/db/src/entities/availability/slot.entity.ts` (E02-S03): "published a slot within two weeks" = a slot with `createdAt <= invitation.acceptedAt + 14 days`.
- `packages/app/src/app/admin/users/page.tsx` and `packages/app/src/app/admin/layout.tsx`: the operator surface (`DataTable`, `apiCall`, `CrudForm` from `packages/ui/src/backend/`).
- `packages/core/src/services/notifications/mailer.port.ts` (E01-S02) sends the invitation email; `scripts/invite.ts` (E02-S01) is retired by this story.

#### How to implement
1. Entity `InvitationBatch` (`packages/db/src/entities/invitations/invitation-batch.entity.ts`): `number`, `openedBy` (User), `openedAt`, `closedAt` nullable; `Invitation.batch` becomes required for new rows; migration `invitation-batches`. Constant `INVITATION_BATCH_SIZE = 20` (R17) in `invitation.service.ts`.
2. `invitation.service.ts`: `openBatch(session)` (operator only, a deliberate act), `createInBatch(session, batchId, { email, stackTags })` (refuses the 21st with `ConflictError('This batch is full; open a new batch')`, tags from `STACK_TAGS` only, R16; sends the email through the mailer port), `report(batchId, now)` (per invitation: accepted at, publish due, published within two weeks yes/no/pending; counts of accepted and publishers), `invitationsStopped(now)` = the first batch's accepted invitations are all past their due date and publishers < 5 (D18) -> `createInBatch` refuses until an operator records the decliner interviews (a `resumedAt` on the batch, set by hand or by a later story).
3. Schemas `packages/core/src/validators/invitations/invitation-create.schema.ts`.
4. Routes with `apiHandler`, operator only (`requireRole(session, 'operator')`): `packages/app/src/app/api/operator/invitation-batches/route.ts` (GET, POST), `packages/app/src/app/api/operator/invitations/route.ts` (GET with `?batch=`, POST).
5. Page `packages/app/src/app/admin/invitations/page.tsx` (`DataTable` per batch with the report columns and the count line "x of 20 sent, y accepted, z published within two weeks"; `CrudForm` for a new invitation; the D18 banner "Invitations are stopped: fewer than 5 of the first 20 published within two weeks; interview the decliners first"); nav link in `admin/layout.tsx`.
6. Tests: batch full, report math at the two-week boundary, stop rule, non-operator 403; `coverage.include` in `vitest.config.mts`. Integration: a mentor opening `/admin/invitations` is refused.

#### ✅ Acceptance criteria
- Given the operator, When they create an invitation with an email and the invitee's stack tags from the four, Then an invitation link exists, is sent, and the batch's count is shown. (R16, R17)
- Given a batch with 20 invitations, When the operator tries to add a 21st to it, Then the product says the batch is full and a new batch is a deliberate act. (R17)
- Given an accepted invitation, When two weeks have passed, Then the invitations list shows whether that mentor published at least one slot, and the batch's count of publishers. (D18)
- Given fewer than 5 publishers of 20 at two weeks, When the operator opens the invitations list, Then it says further invitations are stopped per D18 until the decliners are interviewed. (D18)
- Given a non-operator, When they try to create an invitation, Then they are refused. (negative)

#### 📋 Decisions in play
- D08 — invitation only (owner: founder A)
- R07 — no open registration
- D18 — batches of 20; fewer than 5 of the first 20 publishing within two weeks stops invitations (owner: both founders)
- R17 — the same, as a rule
- D24 — the beachhead pool (owner: founder A)
- R16 — invitations and tags only from the beachhead
- D19 — the operator is the two founders (owner: both founders)

#### Compatibility notes
- `BACKWARD_COMPATIBILITY.md` section 3: new table and a tightened `batch_id` constraint on `invitations` (expand-then-contract: nullable first, backfill by-hand invitations into a "batch 0", then not-null); section 5: removing the `invite` script is a breaking change to a script and is listed in the PR body. `risk-high` (grants a role), `needs-qa`, second reviewer.

#### How to pick this up
- Run `om-auto-fix-issue 30` (it handles both bugs and features), or hand this analysis to `om-auto-create-pr` as the brief. Write the spec named above first (`--no-spec`).

#### Out of scope
- The acceptance flow (E02-S01); interviewing the decliners (a collection-plan entry, not a story); a real mail transport (see E01-S02).

#### Open questions
- Who lifts the D18 stop after the decliner interviews and how it is recorded in the product. — non-blocking (owner: both founders)


### E05-S02 — #31 The operator sets the price bounds and the platform fee

**Issue:** [#31](https://github.com/open-mercato/ai_techleaders_project/issues/31)  
**Labels:** feature, priority-medium, risk-high  
**Epic:** #11  
**Depends on:** E01-S03 (#14)  
**Iteration:** 1.1 (D13)

#### Summary
- 1.1, not in the first iteration (D13)
- The operator sets the price bounds and the platform fee.
- Problem: D09 and D11 name operator-set bounds and a configurable fee; until this ships they live in environment variables the founders change by hand (E02-S04, R18).
- Who has it: the operator (founder A, founder B).
- Expected outcome: a settings screen for the four bounds and the fee, validated, operator-only, applied to later prices and later bookings, with out-of-bounds existing prices flagged, not changed; checked by the acceptance criteria.

Epic: #11
Depends on: E01-S03 (#14)

#### Spec
- Design authority: `.ai/specs/product-brief.md` (https://github.com/open-mercato/ai_techleaders_project/blob/backlog/product-brief/.ai/specs/product-brief.md, on PR #6 until it merges). Filed with `--no-spec`; write `.ai/specs/YYYY-MM-DD-platform-settings.md` before implementing (owed).

#### Analysis
- `packages/core/src/services/operator/platform-settings.service.ts#get()` (E02-S04) reads `packages/core/src/config/env.ts` today; every consumer (`mentor-profile.service.ts#updatePrices`, `payment.service.ts#confirmFromWebhook` in E03-S06) already goes through it, so only the storage changes.
- `packages/db/src/entities/mentors/mentor-profile.entity.ts`: `price25Cents`, `price50Cents` to flag against the new bounds.
- `packages/app/src/app/admin/` (operator only, E01-S03) with `CrudForm` from `packages/ui/src/backend/forms/CrudForm.tsx`.

#### How to implement
1. Entity `PlatformSettings` (`packages/db/src/entities/operator/platform-settings.entity.ts`): a single row (`id` fixed), `minPrice25Cents`, `maxPrice25Cents`, `minPrice50Cents`, `maxPrice50Cents`, `feePercent` (default 20), `currency`, `updatedBy` nullable; migration `platform-settings` seeded from the env defaults so behaviour does not change on deploy.
2. `platform-settings.service.ts`: `get()` reads the row (cached per request scope), `update(session, input)` operator only; the env variables from E02-S04 stay as the seed values and are removed in a later PR (section 4 path).
3. Schema `packages/core/src/validators/operator/platform-settings-update.schema.ts`: integers > 0, `min <= max` per length (`superRefine`), `0 <= feePercent <= 100`.
4. `mentor-profile.service.ts#listOutOfBounds(settings)`: mentors whose current prices fall outside the new bounds, returned for display; their prices are not modified (R08: they are held to the bounds on their next save).
5. Routes `packages/app/src/app/api/operator/settings/route.ts` (GET, PUT; `apiHandler`, operator only, `requireCsrfHeader`); page `packages/app/src/app/admin/settings/page.tsx` (`CrudForm` with `method: 'PUT'`, the flagged mentors listed below it); nav link in `admin/layout.tsx`.
6. Tests: validation (min above max, fee 101), non-operator 403, flagged prices unchanged, later bookings use the new fee (with E03-S06's snapshot); `coverage.include` in `vitest.config.mts`.

#### ✅ Acceptance criteria
- Given the operator, When they set a minimum and a maximum for 25- and 50-minute prices, Then mentors setting prices from then on are held to them; existing prices outside the new bounds are flagged, not changed. (R08)
- Given the operator, When they set the platform fee, Then later paid sessions use it (E03-S06); the default is 20%. (R10)
- Given a fee outside 0–100% or a minimum above the maximum, When saved, Then the save is refused. (negative)
- Given a non-operator, When they open the screen, Then they are refused. (negative)

#### 📋 Decisions in play
- D09 — prices within operator-set bounds (owner: founder A)
- R08 — the same, as a rule
- D11 — the platform fee is 20%, configurable (owner: founder A)
- R10 — the same, as a rule

#### Compatibility notes
- `BACKWARD_COMPATIBILITY.md` section 3: new table; section 4: the E02-S04 variables become seed values and are removed only through the documented path (both schemas, `.env.example`, `README.md`, CI, harness). `risk-high` (money), `needs-qa`, second reviewer.

#### How to pick this up
- Run `om-auto-fix-issue 31` (it handles both bugs and features), or hand this analysis to `om-auto-create-pr` as the brief. Write the spec named above first (`--no-spec`).

#### Out of scope
- The fee split itself (E03-S06); per-mentor exceptions to the bounds (not in the brief); the vault fee (set when the vault returns, D11).

#### Open questions
- none


### E05-S03 — #32 The operator resolves a quality dispute and records the outcome; no automatic refund

**Issue:** [#32](https://github.com/open-mercato/ai_techleaders_project/issues/32)  
**Labels:** feature, priority-medium, risk-medium  
**Epic:** #11  
**Depends on:** E03-S03 (#22)  
**Iteration:** 1.1 (D13)

#### Summary
- 1.1, not in the first iteration (D13)
- The operator resolves a quality dispute and records the outcome; no automatic refund.
- Problem: D10 sends quality disputes to the operator and forbids automatic refunds; until this ships a dispute reaches the founders by email and is logged by hand (R18).
- Who has it: mentees and mentors of a held session; the operator.
- Expected outcome: a dispute raised by a party after the session started, visible to the operator with the session's text, resolved with a recorded outcome both parties see, with the product itself moving no money; checked by the acceptance criteria and a zero-refund-call test.

Epic: #11
Depends on: E03-S03 (#22)

#### Spec
- Design authority: `.ai/specs/product-brief.md` (https://github.com/open-mercato/ai_techleaders_project/blob/backlog/product-brief/.ai/specs/product-brief.md, on PR #6 until it merges). Filed with `--no-spec`; write `.ai/specs/YYYY-MM-DD-quality-disputes.md` before implementing (owed).

#### Analysis
- New concept `disputes`: `packages/db/src/entities/disputes/dispute.entity.ts`, `packages/core/src/services/disputes/dispute.service.ts`, `packages/core/src/validators/disputes/`, `packages/app/src/app/api/disputes/...`, `packages/app/src/app/admin/disputes/page.tsx`.
- `packages/core/src/services/sessions/session.service.ts` (E04-S01) resolves the parties and the messages; the operator reading a session's text is a scoping exception that must be explicit (an operator-only read path, never the party path).
- `packages/core/src/services/payments/payment-gateway.port.ts#refund` exists for E03-S05; this story must not call it (R09: a manual refund happens in the Stripe dashboard and is recorded as the outcome).
- `packages/core/src/services/notifications/notification.service.ts` (E03-S04) tells both parties about the outcome.

#### How to implement
1. Entity `Dispute`: `booking` many-to-one, `raisedBy` (User), `reason` text, `status` (`open` | `resolved`), `outcome` (`no_refund` | `manual_refund`) nullable, `outcomeNote` nullable, `resolvedBy` nullable, `resolvedAt` nullable; migration `disputes`.
2. Schemas `dispute-create.schema.ts` (`bookingId`, `reason` min 1) and `dispute-resolve.schema.ts` (`outcome`, `outcomeNote`).
3. `dispute.service.ts`: `raise(session, input, now)` (party of the booking only, `startsAt <= now`, one open dispute per booking), `listOpen(session)` and `getForOperator(session, id)` (operator only; includes the booking, both parties, and the session messages through an operator-only method `session.service.ts#getForOperator`), `resolve(session, id, input)` (operator only; records the outcome, emits `disputes.dispute.resolved`); no call to the payment gateway anywhere in this service.
4. Routes with `apiHandler`: `packages/app/src/app/api/disputes/route.ts` (POST, party), `packages/app/src/app/api/operator/disputes/route.ts` (GET), `packages/app/src/app/api/operator/disputes/[id]/route.ts` (GET), `packages/app/src/app/api/operator/disputes/[id]/resolve/route.ts` (POST).
5. UI: "Raise a dispute" on `packages/app/src/app/sessions/[bookingId]/page.tsx` (colocated form, shown only after the start); `packages/app/src/app/admin/disputes/page.tsx` (`DataTable` of open disputes, a detail view with the transcript and the resolve form; the outcome text says "recorded; refunds, if any, are done by hand in Stripe"); both parties see the outcome on their session page and are notified; nav link in `admin/layout.tsx`.
6. Tests: non-party 403, before-start refused, mentor cannot resolve, mock gateway records zero refund calls during resolve, both parties see the outcome; `coverage.include` in `vitest.config.mts`.

#### ✅ Acceptance criteria
- Given a mentee or a mentor of a held session, When they raise a dispute, Then it reaches the operator with the session and its text. (R09)
- Given a dispute, When the operator records an outcome (no refund, or a refund done by hand in Stripe), Then both parties see the outcome and the product itself moves no money. (R09, negative)
- Given a user who is not a party to the session, When they try to raise a dispute on it, Then they are refused. (negative)

#### 📋 Decisions in play
- D10 — disputes resolved by the operator; no automatic refunds in 1.0 (owner: founder A)
- R09 — the same, as a rule
- R18 — by-hand operator actions are logged
- D19 — the operator is the two founders (owner: both founders)

#### Compatibility notes
- `BACKWARD_COMPATIBILITY.md` section 3: new table; section 1: new routes; section 6: new event. `risk-medium`; `needs-qa`. The operator's read of session text is a documented scoping exception.

#### How to pick this up
- Run `om-auto-fix-issue 32` (it handles both bugs and features), or hand this analysis to `om-auto-create-pr` as the brief. Write the spec named above first (`--no-spec`).

#### Out of scope
- Automatic refunds (R09); mentor-initiated cancellation (D10 is silent); ratings as a dispute signal (N02).

#### Open questions
- none blocking; whether a dispute pauses the mentor's payout (E03-S06) until resolved. — non-blocking (owner: founder A)


### E07 — #85 Public home page

**Issue:** [#85](https://github.com/open-mercato/ai_techleaders_project/issues/85)  
**Labels:** feature, priority-medium, risk-medium

#### 🎯 Change

- Epic: replace the placeholder public homepage with the finished homepage design from the prototype, so both 1.0 acquisition paths (D21: the stack-tag mentor list and a mentor's share link) land visitors on a page that explains what DevMentor sells.
- Problem: `packages/app/src/app/page.tsx` is a scaffold placeholder — a generic headline ("Grow faster with the right mentor") and buttons linking to `/mentors`, the admin dashboard, and the `/api/health` check. A developer who opens the root URL sees developer plumbing, not the product. The finished design already exists as prototype screen s17 (`prototypes/devmentor-journey/LandingScreen.tsx` + `landing.css`; run `npm run prototype` to view it; state map in `prototypes/devmentor-journey/README.md`).
- Who has it: mentees — the "working dev mid-transition to agentic engineering" from the product brief's Target group — arriving at `/`; mentors whose share-link audience browses up to the root; the founders, whose D16 metric (10 paid sessions a week by 2026-12-31) depends on the mentee funnel that starts here.
- Expected outcome: `/` serves the prototype's homepage — hero, session walkthrough, mentor band, how-it-works, closing CTA — with working navigation into the real app; checked by the acceptance criteria below and by design screenshots exported the way E01/E02 did (`docs/designs/`).

#### 📋 Scope

Content the prototype's s17 screen defines, to carry over:

- **Hero** — eyebrow "Developer mentoring", headline "Work through your code with a mentor.", lead copy, primary CTA "Find your mentor" → the mentor catalogue, the three fact chips ("1:1 text sessions", "25 or 50 minutes", "Written answer included" — separate chips, never dot-separated) and the generated illustration `prototypes/devmentor-journey/assets/developer-mentoring.png`.
- **"During your session" feature rows** — the example text-session conversation card and the example written-answer sheet with the private-note stamp ("Your note stays private"), reflecting R03 (sessions are text) and D20 (mentee-approved note).
- **Mentor band** — example mentor profile card with stack chips (see the blocking open question on fictional content).
- **"How it works"** — three numbered steps: choose a mentor, choose a time, discuss your code.
- **Closing CTA**, header navigation (How it works / Meet a mentor / account action / Find your mentor) with in-page section anchors, and the footer (DM Mono wordmark with the ✦ star, nav, detail line).
- **Auth-aware account action** — signed out: "Sign in" → `/sign-in`; signed in: "My workspace" → the role home from `homeFor(roles)` (`/admin`, `/mentor`, `/home`; `BACKWARD_COMPATIBILITY.md` §7).

Out of scope: video calls (N01); ratings/review persistence or eligibility (N02 as narrowed by D26 — presentational design-system components only); open mentor registration (D08); freelance hiring (excluded by the prototype's own scope note); any CMS; changes to `/mentors`, `/m/<slug>`, or the signed-in surfaces.

#### ✅ Done when

- `/` renders the homepage with the prototype's sections and copy; the placeholder — including the "Open the admin dashboard" and "Health check" buttons — is gone.
- "Find your mentor" navigates to `/mentors`; the account action shows "Sign in" → `/sign-in` when signed out and "My workspace" → the role home when signed in.
- The page builds and renders with no database reachable (AGENTS.md: the app must build and boot with no DB).
- Copy and composition follow the repo's confirmed design rules: humanized, specific copy; no dot/bullet separators between inline facts; DM Mono wordmark; homepage feature chips with generous padding and decorative icons.
- The narrow-viewport layout holds (chips wrap, hero actions stack) — part of the QA state matrix in `SDLC.md`.
- Unit tests at 100% per-file coverage for every new or changed production file, each added to `coverage.include` in `vitest.config.mts`; the integration scenario that verifies the public home page (`tests/integration/`, per `.ai/specs/2026-09-02-pull-request-ci-and-testing.md`) is updated to the new content.

#### 📝 Spec

- Design authority today: prototype screen s17 (`prototypes/devmentor-journey/LandingScreen.tsx`, `landing.css`, README state map) and `.ai/specs/product-brief.md` for the bounding decisions (D16, D21, N01/R03, N02/D26).
- Partial coverage: `.ai/specs/2026-09-04-platform-primitives.md` (F1) fixes the public surface — landing, `/mentors`, `/m/<slug>`, `(auth)/*` — to Tailwind utilities; this epic adds the homepage composition F1 does not define.
- Per AGENTS.md (Spec-Driven Development) an `.ai/specs/YYYY-MM-DD-home-page.md` implementation spec is still owed before the first story is implemented — `om-auto-write-spec` on this issue produces it.

#### 🔍 Implementation notes

Proposed stories (not yet filed — this epic is the container):

1. **E07-S01 — Core homepage**: hero, how-it-works, closing CTA, header/footer with the auth-aware account action; replaces `packages/app/src/app/page.tsx`.
2. **E07-S02 — Session walkthrough**: the two "During your session" feature rows (conversation scene, written-answer scene).
3. **E07-S03 — Mentor band**: blocked on the fictional-content question below.
4. **E07-S04 — Design handoff**: export the finished screens to `docs/designs/e07/` and embed them in this epic, as E01 (#7) and E02 (#8) carry theirs.

Mechanics (hypotheses for the owed spec to settle):

- The prototype composes `@devmentor/ui` components (Button, Badge, Card, TechnologyChips, MentorRatingSummary) bridged through `theme-bridge.css`/`tokens.css`; F1 says production public pages use Tailwind utilities. The spec must pick one path — reproduce the look in Tailwind, or explicitly supersede F1 for the landing (open question below).
- The auth-aware header needs the session without making `/` depend on the database: `packages/app/src/lib/session.ts` and `homeFor` in `@devmentor/core` are the existing seams — read-only, degrading to the signed-out state on any failure.
- The hero illustration moves from `prototypes/devmentor-journey/assets/` into `packages/app` (static asset).
- Server components are invoked, not rendered, in unit tests (AGENTS.md, Testing React components); if the page reads the session, the two-seam guarded-page pattern applies.

No protected surface in `BACKWARD_COMPATIBILITY.md` changes: the homepage is a page, not an API route, and §7's `homeFor` targets are consumed read-only.

Pick up with `om-auto-write-spec #85` (spec first), then `om-auto-implement-spec`; or story-by-story `om-auto-fix-issue <story>` once the stories are filed.

#### ⚠️ Open questions

- **Blocking before implementation** — public-surface styling: F1 (`.ai/specs/2026-09-04-platform-primitives.md`) fixes public pages to Tailwind utilities while the prototype's landing composes `@devmentor/ui` design-system components. Owner: maintainer; resolve in the owed spec or by a superseding note on F1.
- **Blocking for the mentor-band story only** — the prototype's mentor band and its reviews are fictional ("Alex Laurent"; the prototype labels them fictional on-screen). Shipping fictional people and reviews on production conflicts with the honest-copy rule and brushes N02/D26. Options: feature a real invited mentor, keep the band without ratings, or drop it for 1.0. Owner: founder A (owner of N02).
- **Non-blocking** — scheduling: this epic is not among D13's 14 first-iteration story ids, so it does not gate the first-iteration bar; founder A owns whether it ships with 1.0 (D16's funnel starting at `/` argues for it).
- **Autonomous assumptions awaiting human confirmation**: the epic id `E07` (E01–E05 are filed; `.ai/specs/backlog.md` reserves E06 for the parked "Later" bucket) and the `priority-medium` / `risk-medium` classification. `backlog.md` is the id map and was not updated by this run (tracker-only); add the E07 row when adopting the id.
