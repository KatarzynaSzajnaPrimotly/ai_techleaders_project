# Accounts and roles implementation tracker

## Source and scope

- Spec: `.ai/specs/2026-10-21-auth.md` (E01, Accounts and roles). The requested `[date]-accounts-and-roles.md` is this repository's `2026-10-21-auth.md`.
- Required design dependency: `.ai/specs/platform-foundations.md`. Phases A1–A3 and B2a are not implemented in this checkout and must land before the E01 work that depends on them. A0 is not on the auth path and is deferred to E02-S01.
- Product reference: `prototypes/konta-i-role/` is the E01 prototype. `ai-techleaders-project-after-lesson-06/prototypes/devmentor-journey/README.md` is a useful broader screen reference, but its combined-role example is superseded by D31 (one role per account).
- Work branch: `feat/accounts-and-roles`.
- Every implementation task is delegated to a subagent, reviewed in this checkout, and committed separately with its checkbox updated here. At each phase boundary, run the phase gate and provide a manual test checkpoint before continuing.

## Phases and tasks

### Phase 1 — Foundations A1: config and role vocabulary

- [x] **F1.1** Add typed `ServiceUnavailableError`, lazy `requireConfig`, test-only `ALLOW_INSECURE_HTTP`, and the `Role` / session-claim validation. Document the config and cover all branches.

Manual checkpoint: the application still starts; public mentor reads still work without auth configuration; malformed and unknown-role sessions fail closed. No sign-in UI exists yet.

### Phase 2 — Foundations A2: access policy

- [x] **F2.1** Implement `Access` and `enforceAccess`, including lazy secret reads and the public, authenticated, and role branches.
- [x] **F2.2** Require declared access in `apiHandler` and `makeCrudRoute`; pass the verified session to handlers; add navigation error mapping; declare the mentors API public with an E01-S03 note; update callers and tests.

Manual checkpoint: user could not access the preview through port 3000 and asked to continue. Local smoke test `GET http://127.0.0.1:3000/api/mentors` returned 200 with `{ ok: true, data: [] }`; automated tests cover 401, 403, CSRF, 405, and navigation errors. Browser verification remains unavailable.

### Phase 3 — Foundations A3: access contract and docs

- [x] **F3.1** Add the source-based access contract test, dated exceptions for the two mentors surfaces, and tests for aliases/wrappers and missing declarations.
- [x] **F3.2** Update `AGENTS.md`, engineering standards, `README.md`, and the superseded GitHub issue descriptions to match the access contract and the auth spec.

Manual checkpoint: the access contract test passes with the two named E01-S03 exceptions; production build succeeds and lists the current pages/routes. Browser preview remains unavailable (port mapping returns 404). Integration setup could not start because this sandbox has no container runtime.

### Phase 4 — Foundations B2a: shared form core

- [x] **F4.1** Extract `useFormCore` from `CrudForm` without changing its public API or existing behavior; keep the existing tests green and cover the extracted core.

Manual checkpoint: `CrudForm`'s unchanged tests and new `useFormCore` behavior tests pass, covering validation, server field errors, submit shortcuts, and Escape cancel. Browser preview remains unavailable through the provided port mapping.

### Phase 5 — E01 S01a: identity backend

- [x] **F5.1** Build the integration test kit core: fake external server/control API, signed identity, browser cookie helper, concurrency helper, migration helper, and harness environment.
- [x] **F5.2** Add `absoluteUrl`, purpose-tagged tokens, and `safeReturnTo` with security and boundary tests.
- [x] **F5.3** Add the generated `users` migration, entity, repository port/types and repository; verify up/down/up and duplicate/link behavior.
- [x] **F5.4** Add GitHub config, session issuer, GitHub identity port/adapter, OAuth state helper, and their unit tests.
- [x] **F5.5** Implement `AccountService.findOrCreateFromGithub`, register the services in Awilix, and test verified-email linking and concurrent first sign-in.
- [x] **F5.6** Implement GitHub start/callback and logout routes, typed navigation errors, route tests, and the end-to-end GitHub callback tests.

Manual checkpoint: integration tests exercised the local fake GitHub flow, cancellation, state failure, missing verified e-mail, logout, session cookies, stored mentor role, and concurrent callback races (29 integration tests passed). Browser preview remains unavailable through the port mapping, so interactive manual testing remains open.

### Phase 6 — E01 S01b: sign-in and role homes

- [x] **F6.1** Implement page guards/public pages, session reader, role navigation/shell, unauthorized API-call behavior, and response headers; reuse the `homeFor` helper added in F5.6 for callback redirects.
- [x] **F6.2** Add the working GitHub-first sign-in page, mentee and mentor homes, sign-out, page tests, and browser integration checks.

Manual checkpoint: open `/sign-in`, complete the fake GitHub flow, verify mentee and mentor destinations, reject anonymous/wrong-role visits, and sign out.

### Phase 7 — E01 S02: e-mail and password

- [x] **F7.1** Add the bounded in-memory rate-limiter and mailer ports/adapters, adapter selection, `enforceRateLimit`, `TooManyRequestsError`/`Retry-After`, trusted proxy-hop config and tests.
- [x] **F7.2** Add password hashing, the password migration, register/confirm/login schemas, safe registration tokens, and `PasswordAuthService`.
- [x] **F7.3** Add registration, confirmation, login routes and route tests, including generic failures, replay/race handling and rate limits.
- [x] **F7.4** Add `PublicForm`, registration and confirmation pages, enable the e-mail form, and cover page/form states.
- [x] **F7.5** Add full integration coverage for registration, confirmation, login, mail failure, rate limits, headers, and concurrent confirmation.

Manual checkpoint: register a demo address, inspect the development mail adapter, confirm once, sign in, then verify expired/reused links, wrong-password messaging, preserved form values, and rate-limit feedback. Automated browser verification confirms failed login stays on `/sign-in` and shows the generic error. Interactive preview through the shared port remains unavailable.

### Phase 8 — E01 S03: operator role and guards

- [x] **F8.1** Add `OPERATOR_EMAILS`, derive operator role at sign-in, enforce the mentor/allowlist rule, and test all stored/effective-role combinations.
- [x] **F8.2** Guard mentor API and admin page, add operator navigation/layout, remove the two contract exceptions, and prove the no-mentor-join navigation rule.
- [x] **F8.3** Update project docs and the E01 issue text, close the mentee/`student` question, update integration tests, and complete the spec's full gate.

Manual checkpoint: anonymous calls are refused, mentee/mentor calls get 403, configured founders reach operator pages, a listed mentor remains a mentor, and no role can access another role's screens.

## Commit and manual test log

- Planning: initial tracker commit `1328a0b`.
- Phase 1: implementation complete; manual preview unavailable (port forwarding returns 404); user requested to continue.
- Phase 2: F2.1 commit `7fb7323`; F2.2 commit `3f73c2b` (amended to correct tracker/run log); local API smoke test passed; browser manual checkpoint unavailable as noted above.
- Phase 3: F3.1 commit `6fda454`; F3.2 commit `3938132`. Coverage 100% (304 tests), typecheck and production build passed; full lint is blocked by errors in generated Storybook files and the unrelated untracked lesson-06 backup directory; browser preview unavailable. The integration suite later passed on a disposable DB during F5.3 (17 tests).
- Phase 4: F4.1 commit `01b512a`; coverage is 100% (314 tests), full typecheck and focused lint pass; browser manual checkpoint unavailable.
- Phase 5: F5.1 commit `57ac13c`; F5.2 commit `9e4432b`; F5.3 commit `da003bf`; F5.4 commit `10f777e`; F5.5 commit `c221f19`; F5.6 commit `6b58f7f`. Coverage 100% (501 tests), full typecheck, focused ESLint, diff check, and production build pass. Full integration suite (29 tests) passed on a disposable database. Interactive browser checkpoint remains unavailable.
- Phase 6: F6.1 commit `106bb8e`; F6.2 commit `bb1c700`. Coverage 100% (543 tests), typecheck and production build pass, and 37 integration tests pass on an isolated temporary PostgreSQL 17 cluster. Scoped ESLint has 0 errors and one warning for `window.location.assign`; full lint remains blocked by unrelated generated and untracked content. Interactive browser checkpoint remains unavailable; user requested continuing.
- Phase 7: F7.1 commit `a45af16`; F7.2 commit `11b6ded`; F7.3 commit `f7c364f`; F7.4 commits `1ea4e57`, `95e42c9`; F7.5 commit `d537f40`. Coverage 100% (726 tests), typecheck, production build and focused lint pass; 47 integration tests pass on disposable PostgreSQL. F7.2 migration up/down/up and `npm audit` (0 vulnerabilities) pass. Full lint remains blocked by generated Storybook and unrelated untracked prototype files. Shared preview remains unavailable.
- Phase 8: F8.1 commit `8ab9d6f`; F8.2 commit `ad7ff14`; F8.3 implemented and verified, commit pending. Integration checkpoint: operator API access, anonymous/wrong-role redirects, allowlisted mentee sign-in as operator, listed mentor staying mentor, and mentor creation all passed in the browser-backed integration suite.

- F7.5: added integration coverage for read-only confirmation preview and response headers, exactly-one concurrent confirmation/session, identical login failures with no cookies, generic registration and per-address cooldown, trusted proxy IP limits across emails despite spoofed X-Forwarded-For hops, and browser-confirmed failed login feedback without navigation. Harness explicitly sets `TRUST_PROXY_HOPS=1`; mail adapter failure is already covered by route unit tests. Verification: 47 integration tests, 726 unit tests at 100% coverage, typecheck, focused ESLint, production build, `npm audit` (0 vulnerabilities), and diff check passed. Browser test uses the disposable integration app/DB; disposable DB and browser sessions were cleaned up. Commit pending.
