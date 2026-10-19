# Run: CI and testing

Spec: `.ai/specs/implemented/2026-10-19-ci-and-testing.md`

## Done
- Vitest 5 + coverage-v8 + jsdom + Testing Library; `vitest.config.mts` (projects `unit-node`, `unit-dom`), 100% thresholds on
  `packages/*/src`; scripts `test`, `test:watch`, `test:coverage`, `test:integration`; `@types/node` raised to ^24.
- Unit tests for all existing code: core, db (config, schema, orm, repository, migration script), ui (all components,
  `Backdrop` with fake canvas contexts), app (container, API route, pages, layout). 23 files, 90 tests, 100% of
  statements (293), branches (72), functions (58) and lines (271). Replaced the earlier `node:test` suite.
- Integration harness in `tests/integration`: Testcontainers PostgreSQL (or `INTEGRATION_DATABASE_URL`), migrations, build,
  `next start` on a free port, agent-browser helper, 9 tests (API, 404, home, public page, admin table, navigation).
- `.github/workflows/ci.yml`: lint+typecheck, build, unit (coverage artifact), integration; `.nvmrc` (24).
- `AGENTS.md` (new "Testing and CI" section, updated verify principle and commands) and `README.md` updated.
- ESLint ignores `coverage/`; `typecheck` also covers `tests/`.

## Verification (clean copy, fresh `npm ci`)
- Same commands as each CI job: lint, typecheck, build, `test:coverage` (exit 0, 100%), `test:integration` (9/9, against a
  local PostgreSQL, real Chrome 155 via agent-browser). `actionlint` 1.7.12: no findings.
- Coverage gate proven: an extra untested file made `test:coverage` exit 1; removing it restored exit 0.

## Not verified
- The Testcontainers container start (no Docker here): the failure path is clean, the success path is type-checked only.
- The workflow has not run on GitHub; `npx agent-browser install --with-deps` and `--no-sandbox` on the runner are unproven.
- Branch protection (required checks) must be set in the repository settings; it cannot be done from the repo.
