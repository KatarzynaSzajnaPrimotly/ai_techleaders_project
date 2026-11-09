# Checkpoint 1 — Phase 1 close

## Validation

| Check | Result |
|---|---|
| `npm run lint` | Pass; two pre-existing Next.js navigation warnings in `apiCall.ts` and `RoleShell.tsx` |
| `npm run typecheck` | Pass across app, core, db, ui, and integration tests |
| `npm run test:coverage` | Pass: 854 tests, 100% statements (1548/1548), branches (905/905), functions (390/390), and lines (1384/1384) |
| `NODE_ENV=production npm run build` | Pass; invitation API routes and `/invitation/[token]` included in production route output. The shell exports `NODE_ENV=development`; the repository lesson documents that Next production builds require the override. |
| Full PostgreSQL/browser integration suite | Pass after review fixes: `INTEGRATION_SKIP_BUILD=1 INTEGRATION_DATABASE_URL=postgresql://mercato-sandboxes@127.0.0.1:55432/devmentor_e02_race_20261109e npm run test:integration` — 7 files, 56 passed, 0 failed. Includes duplicate-create, accept-vs-revoke, and accept-vs-resend races. |
| Migration rollback | Integration test inserts an unverified account, runs up/down/up, and confirms its `email_verified_at` remains `NULL`; 6/6 users persistence tests pass. |

## UI and review

Independent review findings are addressed: commit `da9bc33` preserves nullable verification state on rollback; commit `6ec6776` covers duplicate invitation creation and acceptance races against revoke/resend on PostgreSQL. The full 56-test integration suite passes. Final review and screenshot-based browser QA remain. E02-S01 PR #60 stays draft until both gates are complete.
