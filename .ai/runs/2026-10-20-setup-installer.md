# Execution plan: idempotent `npm run setup` installer

Source doc: .ai/specs/2026-10-20-setup-installer.md
Issue: #2 · Spec PR: #3 (design-only; the spec merges via its own PR)
Engine: om-auto-create-pr (steps: 7, --loop: no)

## Goal
`npm run setup` performs every README "Getting started"/"Database" step and is safe to re-run.

## Scope
`packages/db/src/setup/` (step functions + runner), `packages/db/src/scripts/setup.ts` (CLI), root `scripts/setup.mjs` (bootstrap), root `package.json` script, README, AGENTS.md Commands line, unit and integration tests.

## Non-goals
Installing Node/Postgres/Docker, starting the dev server, running lint/tests/build, changing env names or defaults, schema changes.

## Risks
`scripts/setup.mjs` lives outside `packages/*/src` (coverage include): keep its logic in a tested module under `packages/db/src` or make it a thin spawn wrapper.

## Progress

PR: #4

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: Testable setup core (`packages/db`)

- [x] 1.1 Step functions (node version, dependencies, env file, database, migrations) and runner, with unit tests
- [x] 1.2 Extract migrator `up` into a reusable function shared with `migrate.ts`

### Phase 2: CLI and root script

- [x] 2.1 `packages/db/src/scripts/setup.ts` entry and `scripts/setup.mjs` bootstrap
- [x] 2.2 Root `"setup"` script in `package.json`

### Phase 3: Docs and integration test

- [x] 3.1 README and AGENTS.md Commands line
- [x] 3.2 Integration test running setup twice against the throwaway database
- [x] 3.3 Full validation gate

## Outcome

- Asked: implement issue #2 (spec PR #3) via `om-auto-fix-issue`, feature route.
- Done: `npm run setup` (bootstrap `scripts/setup.mjs`, steps in `packages/db/src/setup/`, shared `packages/db/src/migrator.ts`), README and AGENTS.md updated, unit tests at 100% coverage, integration test `tests/integration/setup.int.test.ts` (passed against a real PostgreSQL 17).
- Decisions: database created through MikroORM's connection instead of a direct `pg` dependency (no `@types/pg`); a passing Node check reports `[skipped]` so a second run is all-skipped; migrations/env use the process environment like `migrate.ts`.
- Follow-ups: move `.ai/specs/2026-10-20-setup-installer.md` to `specs/implemented/` once this PR and spec PR #3 have merged; `mentors.int.test.ts` could not run in the sandbox (Chrome `libnspr4.so` missing); with `NODE_ENV=production` set in the shell, `npm install` skips dev dependencies (`tsx`), so setup's delegated step would fail: run it with `NODE_ENV` unset.
