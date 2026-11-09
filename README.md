# DevMentor

[![CI](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_sandbox/actions/workflows/ci.yml/badge.svg)](https://github.com/KatarzynaSzajnaPrimotly/ai_techleaders_sandbox/actions/workflows/ci.yml)

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
| `/admin/mentors` | Operator-only admin page: shadcn/ui components, list through `apiCall` + `DataTable`, create through `CrudForm` |
| `/api/mentors` | Operator-only `GET` list and `POST` create. Anonymous requests return 401; mentee and mentor requests return 403. Invalid input returns 400 with field errors, duplicate email returns 409, and a state-changing request without CSRF returns 403. Built with `makeCrudRoute({ access: { roles: ["operator"] }, ... })`; resolves `MentorService` from Awilix |

Tailwind 4 is configured in `app` (no preflight, so the starter page is unchanged); `@source` covers `packages/ui`.
shadcn/ui components are vendored in `packages/ui/src/components`.

## Database

Set `DEVMENTOR_DATABASE_URL` (default `postgresql://postgres:postgres@127.0.0.1:5432/devmentor`) and optionally
`DATABASE_POOL_MIN` / `DATABASE_POOL_MAX` (see `.env.example` for the full list), create the database, then apply migrations.
The migration scripts read the process environment only; the Next.js app also reads `packages/app/.env.local`.

```bash
npm run migration:up -w @devmentor/db
```

Sample endpoint using the container, service and repository: `GET`/`POST /api/mentors` (requires an operator session cookie). Responses use one envelope,
`{ "ok": true, "data": ... }` or `{ "ok": false, "error": { "code", "message", "fieldErrors"? } }`, and state-changing
requests must send the header `x-devmentor-csrf: 1` (the `apiCall` helper in `ui` always does):

```bash
curl -X POST localhost:3000/api/mentors -b "devmentor_session=$OPERATOR_SESSION" \
  -H 'content-type: application/json' -H 'x-devmentor-csrf: 1' \
  -d '{"name":"Ada Lovelace","email":"ada@example.com"}'
```

Engineering standards, naming, security minimums and the review checklist: `.ai/specs/engineering-standards.md`.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run typecheck
npm test                 # unit tests (Vitest)
npm run test:coverage    # unit tests with the 100% coverage gate
npm run test:integration # Testcontainers PostgreSQL + agent-browser (needs Docker)
npm run build   # use NODE_ENV=production if your shell sets NODE_ENV=development
```

Authentication routes are available. Configure `JWT_SECRET` and the provider settings described below to enable sign-in. API routes must declare `access` through `apiHandler` or `makeCrudRoute`; protected pages use `guardedPage`, while public pages use `publicPage`. The shared `enforceAccess` policy handles anonymous, authenticated, and role-restricted access. The mentors API and `/admin/mentors` require the operator role; configure founder addresses with `OPERATOR_EMAILS`.
`JWT_SECRET` must be at least 32 characters. `ALLOW_INSECURE_HTTP=true` is a
test-only setting for plain-HTTP integration tests; do not set it when `APP_URL`
uses HTTPS. GitHub OAuth is configured with `GITHUB_CLIENT_ID` and
`GITHUB_CLIENT_SECRET`; `GITHUB_OAUTH_BASE_URL` and `GITHUB_API_BASE_URL` default
to `https://github.com` and `https://api.github.com` and can point to the local
fake GitHub service in integration tests. Set `APP_URL` to the public application
origin; it is used to build the OAuth callback and safe return URLs.
For e-mail authentication, set `MAILER_TRANSPORT=log` explicitly for the local log
adapter; an unset selector fails closed. It redacts credential values from URLs in
message text before logging. Configure `TRUST_PROXY_HOPS` to the number
of trusted proxies that append to `X-Forwarded-For`. Its unset default is `0`, which
does not trust forwarded addresses and applies login limits by e-mail only. Production
logs a warning when proxy hops are unset; never use a client-controlled leftmost
forwarded value as the rate-limit IP. Set `OPERATOR_EMAILS` to the founders' e-mail
addresses separated by commas; values are trimmed and lower-cased, and the default
is empty. An allowlisted mentee signs in with the operator role; an allowlisted mentor
keeps the mentor role and cannot be granted mentor again.
Invitations expire after `INVITATION_TTL_DAYS` (default `14`), snapshotted when
the invitation is created. The first mentor publication deadline uses
`MENTOR_PUBLISH_WINDOW_DAYS` (default `14`), snapshotted when the invitation is
accepted; changing it affects later acceptances, not existing deadlines.

Operators can manage invitations from the repository root. Set `APP_URL` and
`DEVMENTOR_DATABASE_URL`, then provide an operator label so each action can be
copied into the shared audit note. The invitation link is printed only after a
successful create or resend; keep it private and share it only with the invited
person.

```bash
npm run invite -- create --email mentor@example.com --stack-tags TypeScript,React --operator "Founder A" --batch "October"
npm run invite -- resend --id <invitation-id> --operator "Founder A"
npm run invite -- revoke --id <invitation-id> --operator "Founder A"
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
