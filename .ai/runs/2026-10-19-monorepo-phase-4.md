# Run: monorepo migration, phase 4 (docs, cleanup, final verification)

Spec: `.ai/specs/implemented/2026-10-19-monorepo-migration.md`

## Done
- Removed "not wired up yet" notes from `AGENTS.md` and `README.md`; documented routes, styling, errors, tests, commands.
- Replaced raw database error text in `POST /api/mentors` with typed domain errors (`MentorValidationError` -> 400,
  `MentorAlreadyExistsError` -> 409, anything else -> logged, generic 500). The repository maps PostgreSQL code 23505.
- Added `npm test` (`node:test` via `tsx`, `packages/core`, 4 tests). The tests caught `MentorService.register`
  throwing synchronously instead of rejecting; it is now `async`.
- Moved the spec to `.ai/specs/implemented/`.

## Verification (clean copy of the repo in /tmp, fresh `npm ci`)
- `npm ci`: pass. `npm run lint`, `npm run typecheck`: pass. `npm test`: 4/4 pass.
- `NODE_ENV=production npm run build`: pass; routes `/`, `/mentors`, `/admin/mentors`, `/api/mentors`.
- New empty database + `migration:up`: pass.
- Production server, three request orders (API first, admin page first, public page first): all pages 200,
  POST 201/400/409 as expected, no errors in logs. Dev server (preview command): all 200, no errors.
- Test processes and the temporary `devmentor_verify` database were removed.

## Not covered
- No browser or visual check of the Tailwind/shadcn pages (only HTTP status, HTML content and generated CSS).
- Tests exist only for `core`; `db` and `app` have no automated tests beyond the manual runtime checks above.
