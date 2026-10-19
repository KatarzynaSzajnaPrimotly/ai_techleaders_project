# Monorepo migration

Status: COMPLETE (2026-10-19), moved to `implemented/`. Move the single Next.js app at the repo root into the npm-workspaces monorepo
described in `AGENTS.md` (`packages/app`, `core`, `db`, `ui`), preserving existing behavior.

## Phases

### Phase 1: Workspace skeleton and app move (DONE 2026-10-19)
- Root becomes an npm workspace (`packages/*`) with shared tooling (TypeScript, ESLint) and a base tsconfig.
- App moved to `packages/app` (`@devmentor/app`), including `public/`, `next.config.ts`, route files.
- Reusable `Backdrop` component moved to `packages/ui` (`@devmentor/ui`).
- `packages/core` (`@devmentor/core`) holds shared constants; `packages/db` (`@devmentor/db`) holds
  environment-driven database/pool config (no ORM yet).
- Inter-package dependencies follow AGENTS.md direction; `app` consumes them via `transpilePackages`.
- Root scripts (`dev`, `build`, `start`, `lint`, `typecheck`) delegate to the workspaces; `.gitignore` updated.

Completion criteria: `npm install` links workspaces; `npm run lint`, `npm run typecheck` and
`npm run build` pass; the dev server renders the same page as before.

### Phase 2: Data layer and DI (DONE 2026-10-19)
- Add MikroORM (`@mikro-orm/core`, `@mikro-orm/postgresql`, `@mikro-orm/migrations`) to `packages/db`:
  ORM config using the pool settings, first entity, migration setup and scripts.
- Add Awilix to `packages/app` (composition root registering core services and the db layer).

Completion criteria: a migration runs against PostgreSQL; a service is resolved from the container in a route.

### Phase 3: Styling (DONE 2026-10-19)
- Tailwind CSS for frontend pages; shadcn/ui set up in `packages/ui` for backend (admin) pages.

Completion criteria: a Tailwind-styled public page and a shadcn/ui-based admin page build and render.

### Phase 4: Docs and cleanup (DONE 2026-10-19)
- Remove the "migration pending" notes from `AGENTS.md` and `README.md`; add run log and lessons.
- Full verification from a clean copy: `npm ci`, lint, typecheck, tests, build, migrations on a new database, prod and dev startup.
- Added during this phase: `npm test` (node:test suite for `MentorService`), domain errors mapped to 400/409.

Completion criteria: all checks above pass from a clean install.

## Progress log

- 2026-10-19: Phase 1 implemented (see run log `.ai/runs/2026-10-19-monorepo-phase-1.md`).
- 2026-10-19: Phase 2 implemented (see run log `.ai/runs/2026-10-19-monorepo-phase-2.md`).
- 2026-10-19: Phase 3 implemented (see run log `.ai/runs/2026-10-19-monorepo-phase-3.md`).
- 2026-10-19: Phase 4 implemented and full verification passed (see run log `.ai/runs/2026-10-19-monorepo-phase-4.md`). Migration complete.
