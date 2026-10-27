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

Manual checkpoint: the access contract test passes with the two named E01-S03 exceptions; production build succeeds and lists the current pages/routes. Browser preview remains unavailable (port mapping returns 404). Full integration suite could not start: no container runtime is available, `INTEGRATION_DATABASE_URL` is not configured, and Vitest reports no integration test files in this checkout.

### Phase 4 — Foundations B2a: shared form core

- [ ] **F4.1** Extract `useFormCore` from `CrudForm` without changing its public API or existing behavior; keep the existing tests green and cover the extracted core.

Manual checkpoint: the admin mentors form still creates and edits records with validation, server field errors, keyboard submit, and Escape cancel.

### Phase 5 — E01 S01a: identity backend

- [ ] **F5.1** Build the integration test kit core: fake external server/control API, signed identity, browser cookie helper, concurrency helper, migration helper, and harness environment.
- [ ] **F5.2** Add `absoluteUrl`, purpose-tagged tokens, and `safeReturnTo` with security and boundary tests.
- [ ] **F5.3** Add the generated `users` migration, entity, repository port/types and repository; verify up/down/up and duplicate/link behavior.
- [ ] **F5.4** Add GitHub config, session issuer, GitHub identity port/adapter, OAuth state helper, and their unit tests.
- [ ] **F5.5** Implement `AccountService.findOrCreateFromGithub`, register the services in Awilix, and test verified-email linking and concurrent first sign-in.
- [ ] **F5.6** Implement GitHub start/callback and logout routes, typed navigation errors, route tests, and the end-to-end GitHub callback tests.

Manual checkpoint: use the local fake GitHub flow to sign in; verify cancellation, state failure, missing verified e-mail, and logout. The callback must set the session cookie only on success.

### Phase 6 — E01 S01b: sign-in and role homes

- [ ] **F6.1** Implement page guards/public pages, session reader, `homeFor`, role navigation/shell, unauthorized API-call behavior, and response headers.
- [ ] **F6.2** Add the working GitHub-first sign-in page, mentee and mentor homes, sign-out, page tests, and browser integration checks.

Manual checkpoint: open `/sign-in`, complete the fake GitHub flow, verify mentee and mentor destinations, reject anonymous/wrong-role visits, and sign out.

### Phase 7 — E01 S02: e-mail and password

- [ ] **F7.1** Add the rate-limiter and mailer ports/adapters, adapter selection, `TooManyRequestsError`, proxy-hop config, and their tests.
- [ ] **F7.2** Add password hashing, the password migration, register/confirm/login schemas, safe registration tokens, and `PasswordAuthService`.
- [ ] **F7.3** Add registration, confirmation, login routes and route tests, including generic failures, replay/race handling and rate limits.
- [ ] **F7.4** Add `PublicForm`, registration and confirmation pages, enable the e-mail form, and cover page/form states.
- [ ] **F7.5** Add full integration coverage for registration, confirmation, login, mail failure, rate limits, headers, and concurrent confirmation.

Manual checkpoint: register a demo address, inspect the development mail adapter, confirm once, sign in, then verify expired/reused links, wrong-password messaging, preserved form values, and rate-limit feedback.

### Phase 8 — E01 S03: operator role and guards

- [ ] **F8.1** Add `OPERATOR_EMAILS`, derive operator role at sign-in, enforce the mentor/allowlist rule, and test all stored/effective-role combinations.
- [ ] **F8.2** Guard mentor API and admin page, add operator navigation/layout, remove the two contract exceptions, and prove the no-mentor-join navigation rule.
- [ ] **F8.3** Update project docs and the E01 issue text, close the mentee/`student` question, update integration tests, and complete the spec's full gate.

Manual checkpoint: anonymous calls are refused, mentee/mentor calls get 403, configured founders reach operator pages, a listed mentor remains a mentor, and no role can access another role's screens.

## Commit and manual test log

- Planning: pending initial commit.
- Phase 1: implementation complete; manual preview unavailable (port forwarding returns 404); user requested to continue.
- Phase 2: F2.1 commit `7fb7323`; F2.2 commit `9971172`; local API smoke test passed; browser manual checkpoint unavailable as noted above.
- Phase 3: F3.1 commit `6fda454`; F3.2 commit pending. Coverage 100% (304 tests), typecheck and production build passed; full lint is blocked by errors in generated Storybook files and the unrelated untracked lesson-06 backup directory; integration suite could not start (no container runtime / no tests found); browser preview unavailable.
- Phase 4: pending.
- Phase 5: pending.
- Phase 6: pending.
- Phase 7: pending.
- Phase 8: pending.
