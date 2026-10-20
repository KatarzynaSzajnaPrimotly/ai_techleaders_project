# DevMentor

DevMentor is a mentoring portal built with Next.js, TypeScript and React, backed by PostgreSQL.

## Tech stack

- Next.js (App Router), React, TypeScript
- PostgreSQL with [MikroORM](https://mikro-orm.io) (migrations, connection pooling)
- [Awilix](https://github.com/jeffijoe/awilix) for dependency injection
- Tailwind CSS for frontend pages, [shadcn/ui](https://ui.shadcn.com) for backend (admin) pages

## Architecture

DevMentor is a monorepo; sub-packages live in `packages/`.

```
packages/
  app/    Main application: Next.js routes and pages, Awilix composition root
  core/   Reusable domain logic, services, shared types and utilities
  db/     MikroORM entities, config, pooling, migrations, repositories, seeds
  ui/     Reusable UI components (Tailwind and shadcn/ui)
```

Dependency direction (no cycles):

```
app -> ui, core, db
db  -> core
ui  -> (no project packages)
core -> (no project packages)
```

Notes:

- **Layering:** business logic in `core`, persistence in `db`, presentation in `ui`; `app` wires them together.
- **Dependency injection:** services and repositories are registered in an Awilix container in `app` and
  resolved from it, so they can be swapped in tests.
- **Database:** schema changes are made via MikroORM migrations only. Connection URL and pool size come
  from environment variables (see `.env.example`; real `.env*` files are not committed).
- **Styling:** Tailwind for public pages, shadcn/ui for admin pages. Shared components live in `ui`.

Pages and routes (all in `packages/app`):

| Route | Purpose |
|---|---|
| `/` | Starter home page (original behavior preserved) |
| `/mentors` | Public page, Tailwind (`MentorCard` from `ui`) |
| `/admin/mentors` | Admin page: shadcn/ui components, list through `apiCall` + `DataTable`, create through `CrudForm` |
| `/api/mentors` | `GET` list, `POST` create (400 invalid input with field errors, 409 duplicate email, 403 without the CSRF header); built with `makeCrudRoute`, resolves `MentorService` from the Awilix container |

Tailwind 4 is configured in `app` (no preflight, so the starter page is unchanged); `@source` covers `packages/ui`.
shadcn/ui components are vendored in `packages/ui/src/components`.

## Database

Set `DEVMENTOR_DATABASE_URL` (default `postgresql://postgres:postgres@127.0.0.1:5432/devmentor`) and optionally
`DATABASE_POOL_MIN` / `DATABASE_POOL_MAX` (see `.env.example` for the full list), create the database, then apply migrations.
The migration scripts read the process environment only; the Next.js app also reads `packages/app/.env.local`.

```bash
npm run migration:up -w @devmentor/db
```

Sample endpoint using the container, service and repository: `GET`/`POST /api/mentors`. Responses use one envelope,
`{ "ok": true, "data": ... }` or `{ "ok": false, "error": { "code", "message", "fieldErrors"? } }`, and state-changing
requests must send the header `x-devmentor-csrf: 1` (the `apiCall` helper in `ui` always does):

```bash
curl -X POST localhost:3000/api/mentors -H 'content-type: application/json' -H 'x-devmentor-csrf: 1' \
  -d '{"name":"Ada Lovelace","email":"ada@example.com"}'
```

Engineering standards, naming, security minimums and the review checklist: `.ai/specs/engineering-standards.md`.

## Getting started

Needs Node matching `.nvmrc` and a reachable PostgreSQL. One command does the rest:

```bash
npm run setup
npm run dev     # http://localhost:3000
```

`npm run setup` checks the Node version, installs dependencies, creates `packages/app/.env.local` from `.env.example`,
creates the database (`DEVMENTOR_DATABASE_URL`, needs `CREATE DATABASE` rights) and applies migrations. Each step prints
`[done]` or `[skipped]`; rerunning is safe, it never overwrites an existing env file or touches existing data.

### Manual setup (alternative)

Create the database (see [Database](#database)), then:

```bash
npm install
npm run migration:up -w @devmentor/db
npm run dev     # http://localhost:3000
```

Other commands:

```bash
npm run lint
npm run typecheck
npm test                 # unit tests (Vitest)
npm run test:coverage    # unit tests with the 100% coverage gate
npm run test:integration # Testcontainers PostgreSQL + agent-browser (needs Docker)
npm run build   # use NODE_ENV=production if your shell sets NODE_ENV=development
```

## Testing and CI

- **Unit tests:** Vitest, colocated as `*.test.ts(x)` in `packages/*/src`. Coverage must stay at **100%**
  (statements, branches, functions, lines); `npm run test:coverage` and CI fail otherwise.
- **Integration tests:** `tests/integration`, run an ephemeral PostgreSQL via Testcontainers (Docker required),
  apply migrations, start the built app and drive it in a real browser with
  [agent-browser](https://github.com/vercel-labs/agent-browser). Install its browser once with
  `npx agent-browser install --with-deps`. Without Docker, set `INTEGRATION_DATABASE_URL` to a throwaway database.
- **CI:** `.github/workflows/ci.yml` runs lint and typecheck, build, unit tests with coverage, and integration
  tests on every pull request. Make these four checks required in the repository's branch protection settings.

## AI-assisted development

This project uses Spec-Driven Development. Specs, run logs and lessons learned live in `.ai/`;
see `AGENTS.md` for the conventions that humans and coding agents follow.
