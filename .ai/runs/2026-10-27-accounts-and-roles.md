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
- F3.2: updated `AGENTS.md`, `.ai/specs/engineering-standards.md`, and `README.md`. Updated GitHub issue bodies #33, #36, #38–#43, and #45–#55; #37 needed no change. Replaced obsolete API references, role terminology, and 422 status claims. Verification: 304 tests at 100% coverage, typecheck and production build pass. Full lint currently reports errors in generated Storybook output and the unrelated untracked lesson-06 backup; integration setup cannot find a container runtime and this checkout has no integration test files. Browser preview remains unavailable to the user.
- F4.1: extracted `useFormCore` and rebuilt `CrudForm` on the hook while leaving `CrudForm.test.tsx` unchanged. New hook tests cover state, validation, submission results, callbacks, errors, keyboard shortcuts and cancel. Verification: 314 tests at 100% coverage, full typecheck, focused ESLint, and `git diff --check` pass; commit pending.

## Current state

- Implementing F3.1: source-based access contract test with the two dated mentor exceptions.
- Unrelated pre-existing untracked user files are being left untouched.

## Follow-ups

- Continue F3.1, then F3.2 in order; commit each task separately.
- Complete later phases and record each manual checkpoint. Browser-only checkpoints may remain unavailable while preview routing returns 404.
- Move the spec to `.ai/specs/implemented/` only after all specified work has shipped.
