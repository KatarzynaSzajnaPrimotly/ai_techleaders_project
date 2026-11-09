# Checkpoint 1 — Phase 1 close

## Validation

| Check | Result |
|---|---|
| `npm run lint` | Pass; two pre-existing Next.js navigation warnings in `apiCall.ts` and `RoleShell.tsx` |
| `npm run typecheck` | Pass across app, core, db, ui, and integration tests |
| `npm run test:coverage` | Pass: 854 tests, 100% statements (1548/1548), branches (905/905), functions (390/390), and lines (1384/1384) |
| `NODE_ENV=production npm run build` | Pass; invitation API routes and `/invitation/[token]` included in production route output. The shell exports `NODE_ENV=development`; the repository lesson documents that Next production builds require the override. |
| Full PostgreSQL/browser integration suite | Pass after review fix: `INTEGRATION_SKIP_BUILD=1 INTEGRATION_DATABASE_URL=postgresql://mercato-sandboxes@127.0.0.1:55432/devmentor_e02_review_20261109d npm run test:integration` — 7 files, 53 passed, 0 failed |
| Migration rollback | Integration test inserts an unverified account, runs up/down/up, and confirms its `email_verified_at` remains `NULL`; 6/6 users persistence tests pass. |

## UI and review

The independent review identified that reverting the additive-role migration could fail or falsify verification state for an unverified account. Commit `da9bc33` removes that unsafe `NOT NULL` restoration and adds a regression integration test; focused users tests and the full 53-test integration suite pass. A second independent review is pending. The spec introduces an invitation page and changes `/mentor`; screenshot-based browser QA follows the review. E02-S01 PR #60 remains draft until both gates are complete.
