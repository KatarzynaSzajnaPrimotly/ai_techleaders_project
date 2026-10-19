# Code review rules

Applied automatically by `om-code-review` and `om-auto-review-pr`. The binding sources are `AGENTS.md` and `.ai/specs/engineering-standards.md`; this file is the reviewer's checklist derived from them. Severity: **blocker** (must fix before merge), **major** (should fix, justify if not), **minor** (nit, may defer to a follow-up issue).

## Review priorities

1. **Correctness** — does it do what the ticket/spec says, including error and concurrent paths?
2. **Security** — authn/authz, input handling, secrets.
3. **Contracts** — anything listed in `BACKWARD_COMPATIBILITY.md`.
4. **Tests and coverage** — see below.
5. **Quality** — naming, structure, dead code, readability.

## Repo-specific checks

### Architecture and boundaries
- Business logic lives in `packages/core`, persistence in `packages/db`, presentation in `packages/ui`; `packages/app` only wires them. Dependency direction is `app -> ui, core, db`; `db -> core`; `core` and `ui` import no project package. A violation is a **blocker** (ESLint `no-restricted-imports` must not be disabled).
- Services and repositories are resolved from the Awilix container (`app/src/server/container.ts`, `withScope`/`createRequestScope`), never created with `new` in routes or components.
- Domain concepts are same-named folders across layers (no `modules/`); no empty scaffolded folders. Files follow `<name>.entity.ts`, `.repository.ts`, `.service.ts`, `.port.ts`, `.schema.ts`. `core` defines the repository port, `db` implements it.
- Entities are referenced by name, never by schema object identity (Next.js bundles workspace packages per route).

### HTTP/API
- Every route is wrapped by `apiHandler` (or built with `makeCrudRoute`); no route-level `try/catch`; responses use the `{ ok, data }` / `{ ok: false, error }` envelope; state-changing requests require the `x-devmentor-csrf: 1` header.
- Services and repositories throw only typed `AppError` subclasses; `db` translates driver errors (23505 -> `ConflictError`); no database messages or stack traces reach responses.
- Request bodies are parsed through a shared Zod schema (`parseWithSchema`/`readJsonBody`) before use; never spread a request body into `em.create()`. Schemas used by client code are exported through `@devmentor/core/validators`.
- Auth is enforced server-side on every non-public route (`requireSession`/`requireRole`) and checks the specific record (`assertOwns`); fail closed. Missing auth on a new non-public route is a **blocker**. (`POST /api/mentors` and `/admin/*` are a known, documented gap.)
- Prices and totals are recomputed server-side. No secrets, tokens or full JWTs in logs or responses. Passwords use bcrypt cost >= 12; JWT HS256, secret >= 32 chars from env, 24h expiry, HttpOnly/Secure/SameSite=Lax cookie, never `localStorage`; login/register are rate limited with generic error messages.

### Data
- Schema changes ship as generated, committed MikroORM migrations in `packages/db/migrations`; never hand-edited schema. UUID ids, snake_case plural tables/columns. Migrations are `risk-high` and need up/down evidence and a rollback plan.
- Check-then-write on shared state (slot availability, booking status) runs in a transaction backed by a unique constraint and has an integration test for the concurrent case. Missing is a **blocker**.

### UI
- `fetch()` to `/api/*` appears only in `packages/ui/src/backend/api/apiCall.ts`. Admin pages use shadcn components, `DataTable`, `CrudForm`; public pages use Tailwind utilities. Reusable components belong in `packages/ui`, in the home the AGENTS.md rules specify. Check loading, empty, error states.
- Tailwind runs without preflight; check links, headings, lists and borders have explicit styles.

### Code quality (ESLint-enforced items are still reviewed)
- No `any`, no empty `catch`, no `console` (use the pino logger), no raw `fetch`, no dead or commented-out code, no magic numbers, early returns over deep nesting.

### Tests
- Coverage of `packages/*/src` must stay at 100% (statements, branches, functions, lines). Lowering thresholds, adding exclusions, or `/* v8 ignore */` comments is a **blocker**.
- Tests sit next to the code in a location matched by `vitest.config.mts`; a test outside the patterns is silently skipped. Mock only boundaries.
- A bug fix includes a regression test that fails without the fix; a security-relevant fix says so in the PR.
- Database, route, migration or user-visible-flow changes add or extend a `tests/integration/*.int.test.ts` test.

### Process
- A non-trivial change references a spec in `.ai/specs/`; stack or architecture changes need an approved spec. Autonomous runs leave a log in `.ai/runs/`; non-obvious findings are recorded in `.ai/lessons/` and indexed in `.ai/lessons.md`.
- User-facing text says "DevMentor", never "Mentora".
- `.env*` files and secrets are never committed.

## Validation gate

`npm run lint`, `npm run typecheck`, `npm run test:coverage`, `npm run build` must pass; CI also runs the integration job. A red required check is a **blocker** finding reported together with all code findings.
