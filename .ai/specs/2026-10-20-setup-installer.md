# Idempotent `npm run setup` installer

## 📝 TLDR

A new contributor (developer, agent or reviewer) currently runs several commands by hand from the README "Getting started" and "Database" sections. **Proposed (future behavior):** one command, `npm run setup`, performs those steps, reports each as `done` or `skipped`, and can be re-run safely because it never overwrites user files or data. Source: issue #2.

## 📝 Problem Statement

Today a clean checkout needs: Node matching `.nvmrc`, `npm install`, a reachable PostgreSQL with a `devmentor` database, env configuration, and `npm run migration:up -w @devmentor/db`. Steps are easy to miss and nothing verifies the result. The installer covers exactly the steps the README lists today, no more.

## 📝 Proposed Solution

Two layers, because dependencies are not installed when setup starts:

1. `scripts/setup.mjs` (root, plain Node, zero dependencies): checks the Node version, installs dependencies when needed, then delegates to the TypeScript entry via `npx tsx`.
2. `packages/db/src/scripts/setup.ts` (thin CLI, console allowed like `migrate.ts`) calling testable step functions in `packages/db/src/setup/`.

Each step is a small function `(deps) => Promise<"done" | "skipped">` with an "already done?" probe. The runner prints `[done]` / `[skipped]` per step, stops at the first failure with the exact fix, and exits non-zero.

| # | Step | Skipped when | Otherwise |
|---|------|--------------|-----------|
| 1 | Node version | the running major version matches `.nvmrc` (reported `[skipped]`: nothing to do), or `.nvmrc` has no numeric version | Fail with `nvm use` hint when the major version differs from `.nvmrc` |
| 2 | Dependencies | `node_modules/.package-lock.json` exists and is not older than `package-lock.json` | `npm install` |
| 3 | Env file | `packages/app/.env.local` exists | Copy `.env.example` to it (never overwrite) |
| 4 | Database | target database exists | `CREATE DATABASE` through the maintenance database; clear error if Postgres is unreachable or rights are missing |
| 5 | Migrations | migrator reports 0 applied | Apply pending migrations through the existing migrator |

Alternatives considered: a shell script (not portable to Windows), a Makefile (extra tool), a `postinstall` hook (surprising side effects on every install). Rejected.

## 📝 Architecture

- Reuses `getDatabaseConfig()` (`packages/db/src/config.ts`) for URL and defaults, and the existing MikroORM migrator (`packages/db/src/scripts/migrate.ts`) for step 5; the migrator's `up` is already idempotent. The migration logic is extracted into a shared function in `packages/db/src/setup/` or imported, so `migrate.ts` behavior is unchanged.
- Package boundaries hold: everything lives in `db` and the repo root; `core` and `ui` are untouched, and no new project-internal dependency is introduced.
- Database creation goes through MikroORM's connection (an entity-less `MikroORM.init`) against the maintenance database (`postgres`) on the same server; no direct `pg` dependency is added.
- Env and variable names are read, never renamed. Migration scripts read the process environment only, so setup also uses the process environment (the generated `.env.local` serves the Next.js app, as documented today).

## 📝 Data Model

None. No entity, table or migration is added or changed.

## 📝 API Contracts

None. The only new surface is the root script `npm run setup` (additive; existing scripts untouched, per `BACKWARD_COMPATIBILITY.md`).

## 📝 Edge Cases and Failure Modes

- Wrong Node version: fail before installing anything, with the fix.
- Postgres unreachable: fail at step 4 with the connection target (password redacted) and the hint to start Postgres or set `DEVMENTOR_DATABASE_URL`.
- Database name from the URL is used as an identifier: it is validated against a strict pattern and quoted, never interpolated raw (SQL injection via env).
- Concurrent run creating the same database: error `42P04` (duplicate database) is treated as `skipped`.
- Second run on a finished checkout: every step `skipped`, exit 0, no writes.
- Existing `.env.local` is never read or modified, so user edits survive.
- Logs never print the database password.

## 📝 Out of Scope

Installing Node, PostgreSQL or Docker (the script reports what is missing and the fix); starting the dev server; running lint, tests or build; changing env variable names or defaults.

## 📝 UI/UX

No user-facing screens. Terminal output only: one line per step, `[done]` or `[skipped]` plus a short reason, and a final summary line.

## 📝 Testing Strategy

- Unit tests next to the code (`packages/db/src/setup/*.test.ts`, covered by the `unit-node` project): each step for done, skipped and failure paths, with the MikroORM connection and the filesystem faked at the boundary; the runner (ordering, stop on first failure, exit codes, output). 100% coverage, no `v8 ignore`.
- `scripts/setup.mjs` is plain Node outside `packages/*/src`: keep its logic minimal (version check, install probe, spawn) and cover it through a testable exported function with a unit test; extend `vitest.config.mts` patterns only if needed to include it, never lowering thresholds.
- Integration test `tests/integration/setup.int.test.ts`: run the setup steps twice against the throwaway database (`INTEGRATION_DATABASE_URL` or Testcontainers) and assert the second run reports every step skipped and exits 0.

## 📝 Risks

- Creating a database needs `CREATE DATABASE` rights: surfaced as a clear error, never swallowed.
- Mtime probe for dependencies can report "installed" after a manual partial install: acceptable; `npm install` remains the documented manual fix, and the message says so.

## 📝 Implementation Plan

### Phase 1: Testable setup core (`packages/db`)

1. Add `packages/db/src/setup/` with the step functions (node version, dependencies, env file, database, migrations) and the runner; the database step creates the database through MikroORM's connection.
2. Extract the migrator `up` into a reusable function used by both `migrate.ts` and the migrations step; `migrate.test.ts` keeps passing.
3. Unit tests for every step and the runner at 100% coverage.

### Phase 2: CLI and root script

1. Add `packages/db/src/scripts/setup.ts` (thin entry) and `scripts/setup.mjs` (bootstrap: Node check, install, delegate to `tsx`).
2. Add `"setup": "node scripts/setup.mjs"` to the root `package.json`.
3. Unit test for the bootstrap logic.

### Phase 3: Docs and integration test

1. README: `npm run setup` as the recommended path in "Getting started", current commands under "Manual setup (alternative)", note that rerunning is safe. Update the `AGENTS.md` Commands line.
2. Integration test running setup twice against the throwaway database.
3. Run the gate: `npm run lint`, `npm run typecheck`, `npm run test:coverage`, `npm run build`, `npm run test:integration`.

## 📝 Final Compliance Report

- Package boundaries: respected (`db` and root only).
- Schema changes: none, no migration generated.
- Security: no secrets in output, database identifier validated and quoted, `.env*` never committed or overwritten.
- Protected surfaces: root `npm run` scripts (additive only) and environment variables (read, not renamed).

## Resolved assumptions (autonomous defaults)

| # | Open question (issue #2) | Default applied | Reason |
|---|--------------------------|-----------------|--------|
| Q1 | Node version check: warn or fail? | Fail with a clear message | Later steps assume Node 24 features; failing early is cheaper than a confusing error mid-install |
| Q2 | Create the database or only verify connectivity? | Create it when missing; otherwise print the exact error | Matches "performs everything the README describes"; creation is the only write and is idempotent |
| Q3 | Write `packages/app/.env.local` from `.env.example` when absent? | Yes, never overwrite | The README tells users to configure env; copying defaults is safe and reversible |

No assumption carries `⚠ NEEDS HUMAN CONFIRMATION`: all three follow the proposals the issue author made.
