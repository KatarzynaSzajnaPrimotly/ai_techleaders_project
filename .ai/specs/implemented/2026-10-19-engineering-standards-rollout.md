# Engineering standards rollout

Status: COMPLETE (2026-10-19), moved to `implemented/`. Implements `.ai/specs/engineering-standards.md` (the standards document, which stays active)
in this repository. That document was written against a different bootstrap, so this spec records how it maps here.

## Mapping and deliberate deviations

- **Dependency direction stays `app -> core, db, ui; db -> core`** (not `app -> core -> db`). `core` never imports `db`;
  `db` implements the repository ports declared in `core`. This is the standard's own "depend on a port" principle applied
  to persistence, and it is enforced by ESLint. Consequence: the DI container and `withScope` live in `app/src/server`
  (the composition root), not in `core/src/container`; entities stay `EntitySchema` (referenced by name, see lesson on
  per-route bundles) instead of `defineEntity`.
- Existing concept `mentors` replaces the standard's `auth`/`mentors` migration step; `/admin/mentors` and
  `/api/mentors` replace `/admin/users` and `/api/users` as the reference example.
- Not applicable here: `docs/product-scope.md` (does not exist), `base.entity.ts`/`define.ts` (not needed with one entity).
- Not built until a feature needs it (the standard's own YAGNI/step order): `core/src/events`, concept folders for
  `availability`, `bookings`, `payments`, `messages`, `favorites`, `reviews`; password hashing, rate limiting and the
  login flow (they arrive with the auth concept; the rules stay documented in AGENTS.md).
- Existing routes stay public for now (auth is deferred by the owner). `POST /api/mentors` therefore remains an
  unauthenticated write, which the standard's checklist calls a blocker for any route that is not public; it is
  flagged in the run log and needs a decision when the auth concept is built.
- Persona route groups and moving `mentors/page.tsx` are deferred: another session was editing the app pages at the same
  time, and a route group changes file layout only. Add them with the first persona-specific page.
- Documented API change: JSON envelope `{ ok, data | error }` and a CSRF header on state-changing requests.

## Phases

### Phase 1: core foundations (DONE 2026-10-19)
`core/src/{config/env.ts, logger.ts, http/{errors,apiHandler,makeCrudRoute,auth,validate}.ts}`, concept layout
`services/mentors/*`, `validators/mentors/*`; domain errors become `ValidationError`/`ConflictError`.
Completion: unit tests at 100%.

### Phase 2: db and ui layout (DONE 2026-10-19)
`db/src/entities/mentors/mentor.entity.ts`, `repositories/mentors/*`; `ui/src/components/ui/*` (shadcn),
`components/mentors/*`, `backend/{api,forms,tables,feedback}`.
Completion: unit tests at 100%.

### Phase 3: app wiring and reference example (DONE 2026-10-19)
`withScope`, `api/mentors/route.ts` via `makeCrudRoute`, route groups, `/admin/mentors` rebuilt on `apiCall`,
`DataTable`, `CrudForm` and the feedback components.
Completion: unit and integration tests pass.

### Phase 4: enforcement and docs (DONE 2026-10-19)
ESLint rules (no raw `fetch` outside `apiCall`, no `console`, no empty `catch`); `AGENTS.md` sections from the standard
(adapted); README; run log; lessons.
Completion: lint, typecheck, coverage (100%), build and integration tests pass on a clean copy.

## Progress log

- 2026-10-19: spec written.
- 2026-10-19: all phases implemented (see run log `.ai/runs/2026-10-19-engineering-standards-rollout.md`).
