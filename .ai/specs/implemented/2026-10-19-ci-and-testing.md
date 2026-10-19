# CI and testing

Status: COMPLETE (2026-10-19), moved to `implemented/`. The Testcontainers start itself was verified only by type check and by the
external-database path; its first real run happens in GitHub Actions (no Docker in the authoring sandbox).

Goal: every pull request is checked by GitHub Actions for build, lint, unit tests (100% coverage enforced) and
integration tests (ephemeral PostgreSQL via Testcontainers, app driven through `agent-browser`). New features must
ship with unit tests that keep coverage at 100%. Afterwards, bring all existing code to 100% unit coverage.

## Decisions

- Unit tests: Vitest (+ `@vitest/coverage-v8`, jsdom and Testing Library for React). Replaces the `node:test` suite.
  Coverage thresholds are 100% for statements, branches, functions and lines, so CI fails on any gap.
- Coverage scope: `packages/*/src/**/*.{ts,tsx}`; excluded: test files and type-only declaration files.
  Generated migration files live outside `src` and are exercised by the integration tests instead.
- Integration tests: separate Vitest config and `npm run test:integration`. A global setup starts a
  `@testcontainers/postgresql` container, applies migrations, builds nothing itself (CI builds first), starts
  `next start` on a free port with `DEVMENTOR_DATABASE_URL` pointing at the container, and tears everything down.
  `INTEGRATION_DATABASE_URL` skips the container (for machines without Docker; used for local verification).
- Browser driving: the `agent-browser` CLI (Chrome for Testing, installed with `agent-browser install --with-deps`).
- CI (`.github/workflows/ci.yml`, triggers: `pull_request`, push to `main`): jobs `lint` (ESLint and typecheck),
  `build`, `unit` (coverage, artifact upload) and `integration`. Least-privilege `contents: read`,
  concurrency cancels superseded runs.

## Phases

### Phase 1: Vitest and coverage gate (DONE 2026-10-19)
- Add Vitest, coverage, jsdom, Testing Library; root `vitest.config.ts`; scripts `test`, `test:coverage`.
- Port the existing `node:test` suite.
Completion: `npm test` and `npm run test:coverage` run; the thresholds are enforced.

### Phase 2: 100% unit coverage of existing code (DONE 2026-10-19)
- Unit tests for `core`, `db` (incl. migration script), `ui` (incl. `Backdrop`) and `app` (container, route, pages, layout).
Completion: `npm run test:coverage` passes with 100% in every metric and no unjustified exclusions.

### Phase 3: Integration test harness (DONE 2026-10-19)
- Testcontainers PostgreSQL global setup, app lifecycle helper, `agent-browser` helper, first integration tests
  (public page, admin page, API, duplicate/invalid input) and `npm run test:integration`.
Completion: suite passes against a real PostgreSQL and a real browser. Container startup is verified only in CI
if Docker is unavailable locally (state this explicitly).

### Phase 4: GitHub Actions (DONE 2026-10-19)
- Workflow described above; workflow file validated (syntax and a dry review of every step against the scripts).
Completion: workflow lints cleanly; each job's commands succeed when run locally in the same order.

### Phase 5: Rules and docs (DONE 2026-10-19)
- `AGENTS.md`: every new feature must be 100% covered by unit tests, CI gates, how to run each suite.
- `README.md`: testing and CI section. Run log and lessons.
Completion: docs match the real scripts.

## Progress log

- 2026-10-19: spec written.
- 2026-10-19: all phases implemented (see run log `.ai/runs/2026-10-19-ci-and-testing.md`).
