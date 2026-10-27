# Accounts and roles implementation run

## Request

Implement `.ai/specs/2026-10-21-auth.md` in stable, sequential tasks. Keep `track.md`, use a subagent for each implementation task, commit after each task, and provide a manual test checkpoint after each phase.

## Work completed

- Read the auth and platform-foundations specifications and created `track.md` with phased tasks.
- F1.1: implemented typed unavailable-config errors, lazy config access, insecure HTTP test switch, and role/session validation. Commit: `6d7f6b4`.
- F2.1: implemented the shared access policy and stopped exporting the old role/session guards. Commit: `7fb7323`.
- F2.2: required declared access in API handlers and CRUD routes, forwarded verified sessions, added navigation error mapping, and declared mentor reads public pending E01-S03. Commit: `3f73c2b`.
- Coverage is at 100% (297 tests); core and app typechecks, focused ESLint, and diff checks passed for F2.2.
- Local `GET /api/mentors` on port 3000 returned 200 with the expected API envelope. The user’s browser still gets 404 from the preview mapping, and asked to continue without browser preview.
- F3.1: added the source-based access contract for API routes and protected page paths, with dated E01-S03 exceptions for the admin mentors page and mentors API. Tests cover imported/local aliases, wrappers, missing declarations, page-role mapping, and TSX parsing. Focused test (7), app typecheck, focused ESLint, and diff check passed. Commit: `6fda454`.
- F3.2: updated `AGENTS.md`, `.ai/specs/engineering-standards.md`, and `README.md`. Updated GitHub issue bodies #33, #36, #38–#43, and #45–#55; #37 needed no change. Replaced obsolete API references, role terminology, and 422 status claims. Verification: 304 tests at 100% coverage, typecheck and production build pass. Full lint currently reports errors in generated Storybook output and the unrelated untracked lesson-06 backup; integration setup cannot run because the sandbox has no container runtime. Browser preview remains unavailable to the user. Commit: `3938132`.
- F4.1: extracted `useFormCore` and rebuilt `CrudForm` on the hook while leaving `CrudForm.test.tsx` unchanged. New hook tests cover state, validation, submission results, callbacks, errors, keyboard shortcuts and cancel. Verification: 314 tests at 100% coverage, full typecheck, focused ESLint, and `git diff --check` pass. Commit: `01b512a`.
- F5.1: added integration helpers for fake GitHub/control API, signed sessions and user fixtures, browser cookie injection, concurrency, migration cycles, port reservation, and harness environment; global setup now reserves the app port before migration/build and passes test secrets/services to the child. Helper tests 21/21; full coverage 100% (335 tests), full typecheck, focused ESLint, and diff check pass. Integration setup cannot run without a container runtime. Commit: `57ac13c`.
- F5.2: added `absoluteUrl`, purpose-tagged signing/verification, and `safeReturnTo` at the paths specified by the platform contract. Tests cover HTTPS policy, config errors, token purpose separation/tampering/expiry, external and loop destinations, encoded paths, and control characters. Verification: 382 tests at 100% coverage, full typecheck, focused ESLint, and `git diff --check` pass. Commit: `9e4432b`.
- F5.3: added the generated users migration, entity, core types/port, ORM registration, and PostgreSQL repository with normalized email, duplicate conflicts, conditional GitHub linking, and stored-role updates. Added unit and integration coverage. Verification: 395 tests at 100% coverage, full typecheck/focused lint, migration up/down/up, and full integration suite (17 tests) passed on disposable databases. The shared `devmentor` database was not migrated. Commit: `da003bf`.
- F5.4: added GitHub config, session issuing, identity port/adapter, and OAuth state cookie/token helpers; documented `APP_URL` and GitHub OAuth variables. Verification: 455 tests at 100% coverage, full typecheck, focused ESLint, and `git diff --check` pass; commit pending.

## Current state

- Implementing F5.4: GitHub identity adapter and OAuth session primitives.
- Unrelated pre-existing untracked user files are being left untouched.

## Follow-ups

- Continue F5.5 onward in order; commit each task separately.
- Complete later phases and record each manual checkpoint. Browser-only checkpoints may remain unavailable while preview routing returns 404.
- Move the spec to `.ai/specs/implemented/` only after all specified work has shipped.
