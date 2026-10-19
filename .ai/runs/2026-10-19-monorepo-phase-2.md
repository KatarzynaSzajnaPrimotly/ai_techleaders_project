# Run: monorepo migration, phase 2 (data layer and DI)

Spec: `.ai/specs/implemented/2026-10-19-monorepo-migration.md`

## Done
- `core`: `Mentor` types, `MentorRepository` interface, `MentorService` (validation); no framework deps.
- `db`: MikroORM 7 (`@mikro-orm/postgresql`) with pool config, `MentorSchema` (`EntitySchema`), repository
  implementation, migration scripts (`migration:create|up|down`, run with tsx), first migration with `down`.
- `app`: Awilix container (`src/server/container.ts`, root container cached on `globalThis`, per-request scope
  with forked `EntityManager`), `GET`/`POST /api/mentors`; `serverExternalPackages` for MikroORM and `pg`.
- Created a local database `devmentor` on the sandbox PostgreSQL. Config reads `DEVMENTOR_DATABASE_URL`
  because the sandbox's `DATABASE_URL` points at an unrelated `open-mercato` database.

## Checks
- lint, typecheck (all packages): pass. `NODE_ENV=production npm run build`: pass.
- Migration up, down, up against `devmentor`: pass (table created, dropped, recreated).
- Production server: POST valid mentor 201 and persisted; invalid email 400; GET lists it; home page 200.
  Test row deleted afterwards.

## Follow-ups
- Phase 3: Tailwind and shadcn/ui. Duplicate email currently surfaces as a 400 with the DB error text; map to 409 later.
