# Backward compatibility

The surfaces below are protected contracts. Review skills check diffs against this file and implementation skills warn when a change violates it. DevMentor is a single deployable application (no published packages), so the contracts that matter are the ones that consumers, stored data and running sessions depend on.

## Surfaces

| Surface | Where | Breaking change | Required path |
|---|---|---|---|
| HTTP API routes and response envelope | `packages/app/src/app/api/**`, `packages/core/src/http/` | Removing or renaming a route or method; changing the `{ ok: true, data }` / `{ ok: false, error: { code, message, fieldErrors? } }` envelope, error `code` values or status mapping; removing/renaming response fields; making an optional request field required; dropping the `x-devmentor-csrf` requirement semantics | Add the new shape alongside the old, migrate in-repo callers (`apiCall` users) in the same PR, and note the change in the PR body. Removal needs a spec in `.ai/specs/` and `risk-high`. |
| Shared Zod schemas | `packages/core/src/validators/**`, exported as `@devmentor/core/validators` | Tightening validation so previously valid persisted or client-sent data is rejected; renaming exports | Extend rather than tighten; update every client and server consumer in the same PR. |
| Database schema and migrations | `packages/db/migrations`, `packages/db/src/entities/**` | Dropping/renaming tables or columns, narrowing types, adding NOT NULL without default, editing an already-merged migration | Only through new generated migrations (never edited by hand or rewritten after merge); use expand/contract across two releases for destructive changes; migration tested up and down; rollback plan in the PR body (`risk-high`). |
| Session cookie and JWT | `packages/core/src/http/auth.ts` | Changing cookie name, claims, algorithm or secret handling so existing sessions fail unexpectedly | Accept old and new during a transition window, or call out forced re-login explicitly in the PR; `risk-high`. |
| Environment variables and config | `packages/core/src/config/env.ts`, `packages/db/src/config.ts` (`DEVMENTOR_DATABASE_URL`, `DATABASE_POOL_MIN/MAX`, JWT secret) | Renaming or removing a variable, changing a default, making an optional variable required | Keep the old name as a fallback for one release, document the change in README/PR; never commit `.env*`. |
| Package public exports | `packages/core/src/index.ts`, `packages/core/src/validators/index.ts`, `packages/db/src/index.ts`, `packages/ui/src/index.ts` (and package `exports` maps) | Removing or renaming an export or changing its signature or type | Update all in-repo consumers in the same PR; keep a deprecated alias when more than one package consumes it. |
| Repository ports | `packages/core/src/services/**/*-repository.port.ts` | Changing a port method signature without updating the `db` implementation | Change port and implementation together; both covered by tests. |
| Domain events | `core/src/events` (event IDs `concept.entity.action`) | Renaming an event ID or changing its payload | Emit both until all listeners migrate; no events exist yet. |
| CLI | `npm run migration:create|up|down -w @devmentor/db` and root `npm run` scripts | Renaming or removing a script CI or AGENTS.md relies on | Update `.github/workflows/ci.yml`, `AGENTS.md`, and `.ai/agentic.config.json` in the same PR. |

## Rules

- A change to a surface above without the required path is a **blocker** in review.
- Additive changes (new optional field, new route, new nullable column, new export) are compatible.
- Anything touching auth, sessions or schema migrations is `risk-high` per `SDLC.md`.
- When unsure whether something is a contract, treat it as one and ask in the PR.
