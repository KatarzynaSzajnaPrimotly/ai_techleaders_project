# Run: monorepo migration, phase 1

Spec: `.ai/specs/implemented/2026-10-19-monorepo-migration.md`

## Asked
Migrate the single Next.js app to the monorepo in AGENTS.md; implement the first incomplete phase.

## Done
- Wrote the spec/plan (4 phases); implemented Phase 1.
- Root is an npm workspace (`packages/*`); `tsconfig.json` became `tsconfig.base.json`; per-package tsconfigs extend it.
- `src/`, `public/`, `next.config.ts` moved to `packages/app`; `Backdrop` moved to `packages/ui` and imported via `@devmentor/ui`.
- `packages/core` exports `APP_NAME`; `packages/db` exports `getDatabaseConfig()` (env-driven URL and pool).
- `next.config.ts`: `transpilePackages` for the workspace packages and `turbopack.root` set to the repo root.
- Root scripts delegate to `@devmentor/app`; ESLint config stays at the root with `settings.next.rootDir`; `.gitignore` covers package build output.

## Checks
- `npm run lint`: pass. `npm run typecheck` (all 4 packages): pass.
- `npm run build`: pass with `NODE_ENV=production`. Fails on `/_global-error` prerender with the sandbox's `NODE_ENV=development`.
- Dev server via the preview command: HTTP 200, same page content as before.

## Follow-ups
- Phase 2: MikroORM in `db`, Awilix in `app`. `core` and `db` are still minimal and unused by `app`.
