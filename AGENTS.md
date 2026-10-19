<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# DevMentor: Project Assumptions

DevMentor is the product name, in the UI, titles, copy and docs. "Mentora" was only the name of the concept prototype and
must not appear in user-facing text. These assumptions are binding; do not swap technologies or restructure
without an approved spec in `.ai/specs/`.

## Tech stack

- **Framework:** latest Next.js (App Router) + React + TypeScript (strict mode). See the Next.js note above.
- **Database:** PostgreSQL.
- **ORM:** MikroORM (`@mikro-orm/postgresql`) with its migrations tooling and connection pooling.
  Schema changes always go through generated, committed migrations; never edit the schema by hand.
- **Dependency injection:** Awilix. Services and repositories are registered in the container and
  resolved from it; do not instantiate them with `new` in route handlers or components.
- **Styling:** Tailwind CSS for frontend (public-facing) pages; shadcn/ui for backend (admin/back-office) pages.

## Monorepo layout

npm workspaces; all sub-packages live in `packages/`:

| Package | Purpose |
|---|---|
| `packages/app` | Main application: Next.js routes, pages, composition root (Awilix container setup) |
| `packages/core` | Reusable, framework-agnostic domain logic, services, shared types and utilities |
| `packages/db` | Data layer: MikroORM entities, config, pool settings, migrations, repositories, seeds |
| `packages/ui` | Reusable UI components (Tailwind-based frontend components and shadcn/ui components) |

Dependency direction: `app` -> `ui`, `core`, `db`; `db` -> `core`; `ui` -> nothing project-internal;
`core` depends on no other package. No circular dependencies.

### Domain concept convention

Domain code is not organized into `modules/`. Each concept (`auth`, `mentors`, `availability`, `bookings`, `payments`,
`messages`, `favorites`, `reviews`, ...) is a same-named sub-folder repeated across the layers that need it:

- `packages/db/src/entities/<concept>/<name>.entity.ts` and `packages/db/src/repositories/<concept>/<name>.repository.ts`
- `packages/core/src/services/<concept>/<name>.service.ts` plus its `<name>.types.ts` and
  `<name>-repository.port.ts` (the interface `db` implements; `core` never imports `db`)
- `packages/core/src/validators/<concept>/<name>-<action>.schema.ts` (shared Zod schemas, exported also through
  `@devmentor/core/validators`, which client code must use so server-only dependencies stay out of the browser bundle)
- `packages/app/src/app/api/<concept>/route.ts` and the matching `page.tsx`

Create a concept folder only when its first file is added; never scaffold empty ones. This is a directory convention,
not a module runtime: no per-concept setup, ACL or auto-discovery. Event IDs follow `concept.entity.action`
(`bookings.booking.created`) and go through a typed in-process emitter in `core/src/events`, added only when the first
feature needs one; there is no queue or worker. External integrations (payments, notifications) are accessed through
a port in `core` with a mock adapter first. A new service is one explicit line in `app/src/server/container.ts`.

### Reusable API & UI layer

Every route and page reuses two shared layers instead of re-implementing fetch, validation, auth and error handling:

- `packages/core/src/http/`: `errors.ts` (typed `AppError` hierarchy), `apiHandler.ts` (wraps a route: CSRF check,
  maps `AppError`s to status and envelope, logs unexpected failures with the shared pino `logger`), `makeCrudRoute.ts`
  (`{ list, create, update, remove, authorize }` config in, `{ GET, POST, PUT, DELETE }` out; unconfigured methods
  answer 405; for plain CRUD resources), `auth.ts` (`requireSession`, `requireRole`, `assertOwns`, session JWT and
  cookie helpers), `validate.ts` (`parseWithSchema`, `readJsonBody`). Configuration lives in `config/env.ts`.
- `packages/ui/src/backend/`: `api/apiCall.ts` (the only place a `fetch()` to `/api/*` may be written; ESLint enforces
  it), `forms/CrudForm.tsx` (schema-driven, shows server `fieldErrors`, Ctrl/Cmd+Enter submits, Escape cancels),
  `tables/DataTable.tsx` (loading, empty, error, pagination, row actions), `feedback/{LoadingMessage,ErrorMessage,EmptyState}.tsx`.
- Reference example to copy: `app/api/mentors/route.ts` (CRUD config) and `app/admin/mentors/` (`apiCall` + `DataTable`
  + `CrudForm`).

A new reusable component has one home: a shadcn primitive goes to `ui/src/components/ui/` (added with
`npx shadcn@latest add`); a generic, concept-agnostic panel pattern goes to `ui/src/backend/<category>/`; a component
tied to one concept's shape goes to `ui/src/components/<concept>/`; one used by a single page stays next to its `page.tsx`.

### Engineering standards (summary)

The binding source is `.ai/specs/engineering-standards.md` (naming table, principles, security minimums, code quality,
review checklist) and how it maps to this repo is in `.ai/specs/implemented/2026-10-19-engineering-standards-rollout.md`.
The rules agents most often need:

- Naming: entity `<name>.entity.ts`, service `<name>.service.ts`, port `<name>.port.ts`, schema `<name>.schema.ts`
  (`camelCase` + `Schema`), tables and columns snake_case plural, DI cradle keys camelCase, one `route.ts` per resource.
- No `any`, no empty `catch`, no `console` (use the logger; the migration CLI is the one exception), no raw `fetch`,
  no dead or commented-out code, no magic numbers (name the constant and say why), early returns over deep nesting.
  ESLint enforces the first four.
- Security: auth is enforced server-side on every non-public route and checks the specific record (ownership);
  fail closed; never spread a request body into `em.create()` (parse through the Zod schema first); recompute prices
  server-side; no secrets, tokens or full JWTs in logs or responses (the logger redacts them); hash passwords with
  bcrypt cost >= 12; JWT HS256 with a secret >= 32 characters from env, 24h expiry, HttpOnly/Secure/SameSite=Lax cookie,
  never in `localStorage`; rate limit login and register; generic auth error messages; UUID ids; run `npm audit`.
- Anything that checks then writes shared state (slot availability, booking status) runs in a DB transaction backed by
  a unique constraint, and has an integration test for the concurrent case.
- A bug fix ships a regression test that fails without the fix; a security-relevant fix says so in the PR.
- Known gap: `POST /api/mentors` and `/admin/*` are still public because authentication has not been built yet. The
  first feature that needs a session must call `requireSession` before touching a service.

## Conventions

- Business logic belongs in `core`, persistence in `db`, presentation in `ui`; `app` only wires them together.
- Reusable components go in `packages/ui`, not inside `app`.
- Package boundaries are enforced by ESLint (`eslint.config.mjs`, `no-restricted-imports`): `npm run lint` fails if
  `core`/`ui` import a project package or framework, or `db` imports `ui`/`app`. Do not disable these rules.
- Versions: Next.js 16.4, React 19.3, TypeScript pinned to `~6.0` (`typescript-eslint` does not support 7 yet; check
  its peer range before bumping). `tsconfig.base.json` sets `types: ["node"]` because TypeScript 6 no longer
  auto-includes `@types/*`.
- After upgrading dependencies, restart the dev preview (`pm2 restart workspace-preview` in the sandbox); a stale
  `next dev` keeps the old version in memory and returns 500s. `next build` shares `packages/app/.next` with it.
- Database config (URL, pool size) comes from environment variables; never commit secrets or `.env*` files.
- Styling: Tailwind 4 is configured in `app` (`globals.css`, no preflight; `@source` covers `packages/ui`).
  shadcn/ui primitives live in `packages/ui/src/components/ui` (use `cn` from `ui`); add new ones in the same style. Frontend pages use Tailwind utilities, admin pages (`/admin/*`) use the shadcn components.
- Next.js bundles workspace packages once per route: in code touching the shared ORM, reference entities by
  name, never by schema object identity (see `.ai/lessons/2026-10-19-nextjs-duplicate-package-copies.md`).
- Migration history: `.ai/specs/implemented/2026-10-19-monorepo-migration.md`.
- Data flow example: `core` defines `MentorRepositoryPort` and `MentorService`; `db` implements the port
  (MikroORM `EntitySchema`, no decorators); `app/src/server/container.ts` builds the Awilix container and a
  per-request scope; route handlers and pages call `withScope(({ mentorService }) => ...)` (or `createRequestScope()`).
- Database: `DEVMENTOR_DATABASE_URL` (default `postgresql://postgres:postgres@127.0.0.1:5432/devmentor`; the
  generic `DATABASE_URL` is deliberately ignored), `DATABASE_POOL_MIN/MAX`. Migrations:
  `npm run migration:create|up|down -w @devmentor/db`; commit generated files in `packages/db/migrations`.
- Errors: services and repositories throw only the typed `AppError` subclasses from `core/src/http/errors.ts`
  (`ValidationError`, `ConflictError`, `NotFoundError`, `ForbiddenError`, `UnauthorizedError`); `db` translates driver
  errors into them (PostgreSQL 23505 -> `ConflictError`). `apiHandler` maps them to HTTP codes and the JSON envelope
  and never leaks database messages or stack traces; no route writes its own `try/catch`.
- API contract: every `/api/*` response is `{ ok: true, data }` or `{ ok: false, error: { code, message, fieldErrors? } }`.
  State-changing requests must carry the `x-devmentor-csrf: 1` header (`apiCall` always sends it).
- Commands (run from the repo root): `npm run dev|build|lint|typecheck|test|test:coverage|test:integration`. Build with `NODE_ENV=production`
  if the shell sets `NODE_ENV=development`.

# Testing and CI (mandatory)

## Unit tests: every new feature must be 100% covered

- **Rule:** every new feature, change and bug fix ships with unit tests that keep coverage of `packages/*/src` at
  **100%** for statements, branches, functions and lines. A feature without its unit tests is not finished.
- **Enforcement:** `npm run test:coverage` fails below 100% (thresholds in `vitest.config.mts`) and so does the CI
  `unit` job. A new source file without tests counts as 0% and fails the build.
- **Never** lower the thresholds, add coverage exclusions, or use `/* v8 ignore */` comments to get green. If a branch
  is truly unreachable, remove the dead code; if it is defensive and reachable only artificially, cover it with a test
  that forces it (see the `Math.exp` case in `packages/ui/src/backdrop.test.tsx`).
- **Framework:** Vitest 5 with `@vitest/coverage-v8`, Testing Library and jsdom. Tests sit next to the code as
  `*.test.ts` / `*.test.tsx` under `packages/*/src`. `vitest.config.mts` has two projects: `unit-node` (`core`, `db`,
  `app/src/server`, `app/src/app/api`) and `unit-dom` (`ui` and `app/src/app/**/*.test.tsx`). A test outside those
  patterns is silently not run, so put new files where a pattern matches or extend the patterns.
- **Style:** test behaviour and error paths, not implementation details. Mock only boundaries (MikroORM, the Awilix
  container, `@devmentor/db` from `app`), never the unit under test. Keep domain code testable without a database.
- Run the suite you touched while working (`npx vitest run <path>`), and `npm run test:coverage` before finishing.

## Integration tests

- Live in `tests/integration/*.int.test.ts` and run with `npm run test:integration`. A global setup starts an
  ephemeral PostgreSQL with **Testcontainers**, applies the migrations, builds the app and starts `next start`
  on a free port. Pages are checked in a real browser through the **agent-browser** CLI (`tests/integration/helpers`).
- Add or extend an integration test for every user-visible flow and every change that touches the database, routes
  or migrations. Use unique data per run instead of truncating tables.
- No Docker (for example in the sandbox)? Point `INTEGRATION_DATABASE_URL` at a throwaway database and the container
  step is skipped. Chrome needs system libraries (`npx agent-browser install --with-deps`; without root, extract the
  `.deb` files and set `LD_LIBRARY_PATH`). Set `AGENT_BROWSER_ARGS=--no-sandbox` in containers and CI, and run
  `agent-browser close --all` after changing the browser environment, because the daemon keeps the old one.
  `INTEGRATION_SKIP_BUILD=1` reuses an existing build.

## CI (GitHub Actions)

`.github/workflows/ci.yml` runs on every pull request and on pushes to `main`, as four independent jobs: **lint and
typecheck**, **build**, **unit tests (100% coverage)** and **integration tests**. All must be green to merge.
When you change scripts, Node version or test layout, update the workflow too and validate it with `actionlint`.

# AI-Assisted Development Workflow (SDD + Run Logs + Lessons)

This project uses a lightweight Spec-Driven Development (SDD) workflow backed by a `.ai/` folder.
Every AI agent (and human) working in this repo MUST follow these conventions — they are not optional.

## Directory structure

```
.ai/
  specs/                   # Specifications for Spec-Driven Development
    YYYY-MM-DD-slug.md       # Active specs — not yet fully implemented
    implemented/              # Specs whose work has fully shipped (moved here, never deleted)
    archive/                  # Specs that were abandoned or superseded (moved here, never deleted)
  runs/                    # One log file per autonomous AI run
    YYYY-MM-DD-slug.md
  lessons.md               # Rolling index of lessons learned (newest first)
  lessons/                 # One detailed write-up per lesson, linked from lessons.md
    YYYY-MM-DD-slug.md
```

Naming rule for every file created under `.ai/` (specs and runs alike): `YYYY-MM-DD-slug.md`, where
`YYYY-MM-DD` is the date the file was authored and `slug` is a short kebab-case description
(e.g. `2026-10-19-mentor-matching.md`). Never rename the date when a spec is later moved between
`specs/`, `specs/implemented/`, or `specs/archive/` — it records when it was written, not when it moved.
The one exception is the standing document `.ai/specs/engineering-standards.md`: it keeps its fixed name, stays in
`specs/` (it is never "implemented"), and is amended in place.

## Specs (`.ai/specs/`)

- Before starting any non-trivial feature or change, write a spec at `.ai/specs/YYYY-MM-DD-slug.md`
  describing the problem, the approach, and acceptance criteria — or check whether one already exists.
- Once the work described in a spec has fully shipped, move the file to `.ai/specs/implemented/`.
- If a spec is abandoned or superseded before being implemented, move it to `.ai/specs/archive/`
  instead of deleting it.

## Run logs (`.ai/runs/`)

- Every autonomous AI run — any multi-step agentic session that makes changes without a human
  driving each individual step — must produce a log at `.ai/runs/YYYY-MM-DD-slug.md`.
- Include: what was asked, what was done, which files were touched, key decisions, and any
  follow-ups or open questions left for a human or a future run.

## Lessons learned (`.ai/lessons.md` + `.ai/lessons/`)

- When you fix a non-obvious bug, hit a gotcha, or learn something worth remembering long-term,
  record it — don't let it live only in chat history.
- Write the detailed finding to `.ai/lessons/YYYY-MM-DD-slug.md`.
- Add a one-line pointer to it at the top of `.ai/lessons.md` (newest entries first).
- Before starting new work, skim `.ai/lessons.md` for relevant prior findings so past mistakes
  aren't repeated.

Note: `.ai/cezar/` is unrelated tooling/runtime state (not part of this workflow) — leave it alone.

# Working principles

1. **Plan complex work first.** For anything multi-step or ambiguous, plan before coding, and capture
   the plan in a spec (see Specs above). Put the effort into the plan so implementation goes in one
   pass. If the implementation goes off track, stop and re-plan; don't keep pushing.
2. **Verify every change.** Never report work as done without proof it works. At minimum run
   `npm run lint`, `npm run typecheck`, `npm run test:coverage` (100%) and `npm run build`; for features and
   database or route changes also `npm run test:integration`. For UI changes, run `npm run dev` and check the affected pages
   in a browser. If something could not be verified, say so explicitly.
3. **Learn from corrections.** When a human corrects you or a fix reveals a mistake, record a lesson
   (see Lessons learned above). If the lesson is a rule that applies to all future work, also add
   it to this file in one line.
4. **Fix bugs on your own.** Given a bug report, failing build, or logs, find the root cause and fix
   it without asking for step-by-step direction. Don't patch symptoms or bypass checks.
5. **Choose the elegant solution.** If a fix feels hacky, scrap it and do it properly before
   presenting it. Keep changes minimal and focused on the task.
6. **Use subagents for wide research.** Hand broad exploration or independent parallel tasks to
   subagents so the main context stays focused.
7. **Turn repeated workflows into skills.** If the same multi-step procedure is done more than
   occasionally, make it a skill or command under `.claude/` and commit it.
