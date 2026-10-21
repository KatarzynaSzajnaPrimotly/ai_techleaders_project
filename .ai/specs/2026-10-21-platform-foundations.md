# Platform foundations: access policy, forms, ports, config and test kit

> Status: draft for review. Companion: `2026-10-21-auth.md` (E01, #29) is the first consumer; implementation order is this spec, then auth.
> Source: `.ai/specs/backlog.md` (E01 to E07), `.ai/specs/product-brief.md`, `.ai/specs/engineering-standards.md`, and the code under `packages/`.

## 📝 TLDR

DevMentor has 21 stories ahead (E01 to E05, E07) that repeat the same backend and frontend needs, and today each would invent its own: a route with no declared access is silently public (the `/api/mentors` "known gap"), public pages have no form layer (`CrudForm` is shadcn only), external services have no port-and-fake pattern, config is read ad hoc, and tests have no signed identity. This spec (future behavior) fixes the shape of those primitives and builds only the ones E01 exercises, each in the same pull request as the auth phase that first consumes it; every other primitive is a contract in a catalogue, built by the first story that needs it.

## 📝 Problem Statement

Evidence from the repository (searched in `packages/`, `tests/`, `eslint.config.mjs`):

- `makeCrudRoute` takes an optional `authorize`; `apiHandler` takes no access input. `packages/app/src/app/api/mentors/route.ts` passes none, so `GET` and `POST /api/mentors` are public, as is `/admin/mentors`. Nothing fails when a new route forgets a guard.
- `Session.role` is `string` and `verifySession` accepts any role claim. `requireRole` and `assertOwns` have no caller.
- `CrudForm` (`packages/ui/src/backend/forms/CrudForm.tsx`) holds state, validation, server `fieldErrors` and keyboard handling inside one shadcn component. The sign-in and register pages are public Tailwind pages and the backlog adds forms on both sides in E02 (page editor, slots, prices), E04 (answer, note) and E05 (invitations, settings, disputes).
- `parseEnv` knows `NODE_ENV`, `LOG_LEVEL`, `JWT_SECRET`; `requireJwtSecret` throws a plain `Error` (a 500). No `.env.example` entry or README line mentions `JWT_SECRET`.
- External services (GitHub now; mail, Stripe later) have no pattern. `AGENTS.md` says "a port in `core` with a mock adapter first" but no port with an adapter exists.
- `tests/integration` cannot sign in: no signed-cookie helper, no fake external server, and `global-setup.ts` passes no `JWT_SECRET`.

What the backlog implies beyond E01 (inventory read from the stories E02 to E07, items marked inferred are not stated there): invitation tokens, transactional check-then-write over unique constraints (slots, bookings, notes), booking and note status machines, a clock for the 2-hour and 24-hour rules, EUR money in integer cents, a settings store, payment and mail ports with mock adapters, an in-process event emitter after commit, ownership-scoped queries and public DTO allowlists, an operator shell, and a text-session notice on every session screen.

## ✅ Decisions

| Id | Decision | Source |
|---|---|---|
| Q1 | Two specs: this one and `2026-10-21-auth.md`. | user |
| Q2 | Build only what E01 uses; the rest is a catalogue of contracts, built by the first consumer. Matches `AGENTS.md` (no empty scaffolds). Applied per phase: a primitive ships with the auth phase that first uses it, never earlier. | user, recommended |
| Q4 | Access is an explicit, mandatory declaration on every route and page. | user, recommended |
| Q5 | Headless form core with two skins (shadcn, Tailwind); `CrudForm` keeps its props. | user, recommended |
| Q6 | 1.0 is a single Node instance; the rate limiter is in memory behind a port. | user, recommended |

Question ids are shared with `2026-10-21-auth.md`, which holds Q3 (role name) and Q7 (revocation).

## 📝 Proposed Solution

The primitives below are built because E01 uses each of them, delivered as two groups (see Phasing): group A is the prerequisite of auth phase 1, group B ships inside auth phase 2 with its first consumer. A catalogue fixes the rest. Alternatives that lost:

- **Build every primitive now** (Q2 option b): untestable without a consumer, so it cannot reach 100% coverage honestly, and the shapes would be guesses.
- **Keep `authorize` and add a lint rule** for missing guards: a lint rule cannot see that a hook exists but does nothing; a required typed field can.
- **A third-party auth framework** (Auth.js, Clerk): see Research; rejected for the session, role and test-kit constraints below.

## 📝 Research

Compared against well-known tools (from general knowledge, not re-fetched in this run, so treat as direction, not evidence; the rejections below rest on this repository's constraints, which were read):

- **Auth.js**: keeps e-mail account linking off by default because linking on an unverified e-mail is a takeover path. We adopt the same stance in the auth spec. Rejected as a dependency: it owns the session cookie shape and callbacks, while `auth.ts` already defines the protected cookie and JWT contract (`BACKWARD_COMPATIBILITY.md`).
- **Lucia** (now a guide rather than a library): its lesson is that session handling is small enough to own and that revocation needs a server-side store. Q7 in the auth spec chose stateless sessions instead, and records the cost.
- **Clerk and similar hosted auth**: fastest to ship, but add a vendor, per-user cost and a role model we would still mirror locally (one role per account, operator by allowlist, D19, D31).
- **Next.js 16 authentication guide** (bundled in `node_modules/next/dist/docs/01-app/02-guides/authentication.md`, read for the E01 backlog): layouts do not re-render on navigation, so guards belong in each page or in a helper each page calls. That drives the page guard below.
- **Skipped on purpose**: RBAC engines (CASL, Casbin). `engineering-standards.md` excludes RBAC; with three roles, one per account, equality on a union type is enough.

## 📝 Architecture

Where each primitive lives (existing layering unchanged: `app` -> `ui`, `core`, `db`; `core` imports nothing project-internal).

| Primitive | Package and path | Group |
|---|---|---|
| `requireConfig`, new error classes | `core/src/config/env.ts`, `core/src/http/errors.ts` | A |
| `Role`, `isRole`, `Access`, `enforceAccess` | `core/src/http/auth.ts`, `core/src/http/access.ts` | A |
| Access on `apiHandler` and `makeCrudRoute` | `core/src/http/` | A |
| Page guard, session reader, `homeFor` | `app/src/server/session.ts`, `app/src/server/guards.ts` | A |
| Access contract test (with fixtures) | `app/src/server/access-contract.test.ts` | A |
| Test kit core: `JWT_SECRET`, fake server, cookie minting and setting | `tests/integration/helpers/`, `global-setup.ts` | A |
| Rate limiter port and memory adapter | `core/src/services/ratelimit/` | B (auth phase 2) |
| Mailer port and log adapter | `core/src/services/notifications/` | B (auth phase 2) |
| Headless form core, `CrudForm` on it, Tailwind `PublicForm` | `ui/src/backend/forms/` (generic, concept-agnostic) | B (auth phase 2) |
| Everything in the catalogue below | per row | not built |

Variables are added by the phase that reads them (see Config), and the `createUser` test helper arrives with the `users` table in auth phase 1.

### Access policy (Q4)

```ts
type Access = "public" | "authenticated" | { roles: readonly Role[] };
```

- `Role = "mentee" | "mentor" | "operator"` (name per the auth spec, Q3) with `isRole`. `verifySession` rejects an unknown role claim (fail closed). No token is issued today, so no live session is affected.
- **One role-check API.** `enforceAccess` is the single entry point for authentication and role checks. `requireSession` becomes its internal helper (no longer exported from the barrel) and `requireRole` is deleted (it has no caller). `assertOwns` stays: it answers a different question (ownership of a record, not role).
- `enforceAccess(request, access): Promise<Session | null>`: `public` returns the session when a valid cookie is present and `null` otherwise (never throws for a bad cookie), `authenticated` throws `UnauthorizedError` without a valid session, `{ roles }` additionally throws `ForbiddenError` for a role not listed.
- `apiHandler(handler, { access, csrf? })`: `access` is required in the options type; the handler receives the session as a third argument, typed by the declaration: `Session` for `authenticated` and `{ roles }`, `Session | null` for `public`, so guarded handlers need no non-null assertions. A webhook is `access: "public", csrf: false` and verifies its own signature, so exceptions are visible in one grep.
- `makeCrudRoute({ access, ... })`: `access` is a single `Access` applied to every configured method (a per-method map is added by the first resource that needs different access per verb). The `authorize` hook is removed (no caller exists); record-level checks use `assertOwns` inside `run`, which now receives `session` in its context.
- Page guard `requirePage(access)` in `app/src/server/guards.ts` reads the cookie with `await cookies()` and: no valid session sends the visitor to `/sign-in?returnTo=<path>`; a wrong role redirects to that role's home. `homeFor(role)` (mentee `/home`, mentor `/mentor`, operator `/admin/mentors`) is a pure map in `app/src/server/guards.ts`, not in `core`, because URL paths are an `app` concern; the pages it points to arrive in auth phase 1, and a wrong-role visit cannot occur before sign-in exists. `requirePage` returns the `Session`.
- **Public pages do not read the cookie.** A page that only renders for everyone exports `export const access = "public" as const;` and nothing else, so it stays statically renderable (reading cookies opts a route into dynamic rendering, per the bundled `cookies()` docs). A public page that needs the session (for example a header showing the signed-in user) calls `requirePage("public")` and accepts dynamic rendering.
- Each page calls the guard itself, because layouts do not re-render on client navigation. `proxy.ts` is not used for enforcement.
- **Contract test** `access-contract.test.ts` (project `unit-node`): lists every `app/api/**/route.ts` and `app/**/page.tsx`, and fails when a route file lacks `access:` in its `apiHandler` or `makeCrudRoute` call or a page file has neither `requirePage(` nor `export const access = "public"`. It reads source text; this is a deliberate cheap guard, backed by the typed `access` field, not a replacement for it. Its own behavior is tested by committed fixture files (a route and a page with and without a declaration) passed to the checking function, so a regression in the test itself fails the suite.

### Ports and adapters pattern

Rule for every external service or replaceable mechanism (including the rate limiter, concept folder `ratelimit`): `core/src/services/<concept>/<name>.port.ts` (interface), a real adapter in `.../adapters/<name>.adapter.ts` whose base URL and credentials come from config, a pure in-memory fake for unit tests, and, for integration tests, a real HTTP fake server driven through the base-URL variables so the real adapter is exercised. No test-only code path in production code. Adapters in `core` use the global `fetch` (the ESLint `no-restricted-globals` rule covers `app` and `ui` only). Wiring is one explicit line in `container.ts` per service.

Group B, built inside auth phase 2 where the first consumer exists: the rate limiter and the mailer (GitHub identity is built in auth phase 1 using this pattern).

- `RateLimiterPort.hit(key, policy): Promise<{ allowed: boolean; retryAfterSeconds: number }>` (policy: limit and window; each protected endpoint applies two independent keys, per (client IP, subject) and per client IP alone; when the IP is unknown, all such requests share one `unknown` IP bucket instead of falling back to the subject only, so neither a lock-out of one account nor unlimited guessing across accounts is possible); `enforceRateLimit` throws a new `TooManyRequestsError` (429, `RATE_LIMITED`). The memory adapter stores counters on `globalThis` (Next.js bundles a module once per route, `.ai/lessons/2026-10-19-nextjs-duplicate-package-copies.md`) and says so in its doc comment: valid for one instance (Q6); a database adapter replaces it behind the port when that stops being true.
- `MailerPort.send({ to, subject, text })`. The log adapter is development and test only and is chosen by an explicit setting, not by `NODE_ENV`: `MAILER_TRANSPORT=log` selects it, and unset means "no transport", where sending throws `ServiceUnavailableError` instead of logging, because a logged message can contain a bearer link and the logger redacts keys, not message text. The integration harness runs `next start` with `NODE_ENV=production`, so it sets `MAILER_TRANSPORT=log` explicitly. `MAILER_TRANSPORT` is added to `envSchema` by auth phase 2 together with `TRUST_PROXY`. A real transport is a launch task (brief Q26), not part of this spec.

### Config

This spec adds only `requireConfig(keys)`. Each variable is added, optional so existing deployments boot, by the phase that first reads it: auth phase 1 adds `APP_URL` (absolute URL), `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_OAUTH_BASE_URL`, `GITHUB_API_BASE_URL` (the last two default to the real hosts); auth phase 2 adds `TRUST_PROXY`; auth phase 3 adds `OPERATOR_EMAILS`. `requireConfig(keys)` returns the values or throws `ServiceUnavailableError` (503, `SERVICE_UNAVAILABLE`, listing variable names only, never values). `requireJwtSecret` uses it, so a missing secret becomes a 503 instead of a 500. Config is parsed once (`parseEnv` at container creation) and registered in the Awilix container as `config`; `enforceAccess` takes the secret from its caller (`apiHandler` and `requirePage` read it from the container) instead of re-parsing the environment on every request. Documented in `.env.example` and `README.md` by the phase that adds each variable (`JWT_SECRET` here).

### Form layer (Q5, group B)

Extract the logic of `CrudForm` into a headless hook `useFormCore({ schema, fields, onSubmit, onSuccess, onCancel })` returning `values`, `setValue`, `fieldErrors`, `formError`, `submitting`, `handleSubmit`, `handleKeyDown`. In the auth phase 2 pull request the extraction is the first commit: `CrudForm` is rebuilt on the hook with its existing tests untouched and green, before any new consumer exists. Two skins render it: `CrudForm` (shadcn, unchanged public props and behavior) and `PublicForm` in `ui/src/backend/forms/PublicForm.tsx` (Tailwind, used by sign-in and register). Skin rule, applied everywhere: public pages (no session needed) use Tailwind; every page behind a session (mentee, mentor and operator screens) uses the shadcn components, so the mentee and mentor homes are shadcn. Field descriptors become a discriminated union on `type` starting with `text | email | password` plus an optional `autoComplete`; `textarea`, `select`, `number`, `datetime-local` are listed in the catalogue and added by the first story that needs them. `ui` still imports no project package, so schemas are passed in, and a submit goes through `apiCall` (ESLint forbids raw `fetch`).

### Test kit

- `global-setup.ts` generates a random `JWT_SECRET` (at least 32 characters), starts a generic fake server (`helpers/fake-server.ts`, a Node `http` server on a free port, routes registered per test file) and `provide`s `jwtSecret`, `databaseUrl` and the fake server's URL. Auth phase 1 passes that URL to `next start` through the GitHub base-URL variables it introduces, and sets `APP_URL` to the run's base URL.
- `helpers/identity.ts`: `mintSessionCookie({ userId, role })` (uses `signSession` with the run's secret, so no test-only path exists in the app). `createUser(...)`, which inserts through the database URL, is added in auth phase 1 with the `users` table.
- `helpers/browser.ts`: `setCookie(name, value)` using `agent-browser cookies set`.

### Catalogue (contracts, not code, until a story needs them)

Only primitives that impose a shape across several stories are listed; story-local rules (for example the 120-minute lead time constant, the public DTO allowlist per concept, the text-session notice) stay in their stories.

| Primitive | Location | Shape | Built by |
|---|---|---|---|
| Clock | `core/src/services/shared/clock.port.ts` | `now(): Date` injected into services; no scheduler, rules evaluated lazily on read | E02-S03, E03-S02 |
| Money | `core/src/services/shared/money.ts` | EUR integer cents, one `PLATFORM_CURRENCY`, `formatEur`, pure `computeFeeSplit` with the fee snapshot stored on the booking | E02-S04 |
| Platform settings | `core/src/services/settings/` | one `get()` service; env-backed first, one-row table later | E02-S04 |
| Transaction helper | `core/src/services/shared/unit-of-work.port.ts` | `runInTransaction(fn)` implemented in `db`; every check-then-write uses it with a unique constraint, plus a concurrent integration test (`AGENTS.md`) | E02-S01 |
| Status machine | `core/src/services/shared/status-machine.ts` | `transition(from, event, table)` pure; illegal transitions throw `ConflictError` | E03-S03 |
| Event emitter | `core/src/events/` | typed, in-process, ids `concept.entity.action`, emitted after commit, handlers' failures logged and swallowed | E03-S03 |
| Payment gateway | `core/src/services/payments/payment-gateway.port.ts` | port plus mock adapter first, idempotency key is the booking id; webhooks `apiHandler(..., { access: "public", csrf: false })` with signature check and a processed-event table | E03-S03 |
| Operator shell | `app/src/app/admin/layout.tsx`, `/api/operator/*` | `access: { roles: ["operator"] }` on each page and route | E05-S01 |
| Invitation token | `core/src/services/invitations/` | 32 random bytes, only the SHA-256 stored, never logged | E02-S01 |

`services/shared/` is a named exception to the one-folder-per-concept convention for primitives with no owning concept (clock, money, unit of work, status machine); it is created with the first file that goes in it.

Naming rule recorded here: `Session` in code is the login session; the mentoring meeting is `Booking` in code and "session" only in copy. Service methods that act for a user take the login session as `actor`.

## 📝 Data Model

None. This spec adds no entity and no migration. Persistent shapes (`users` in the auth spec; slots, bookings, notes later) belong to their concepts.

## 📝 API Contracts

- New error codes (additive): `SERVICE_UNAVAILABLE` (503), `RATE_LIMITED` (429, with a `Retry-After` header when known). Existing envelope `{ ok, data | error }` unchanged. `ValidationError` stays 400 (stories disagree between 400 and 422; the existing contract wins).
- `apiHandler` and `makeCrudRoute` signatures change as described (internal, one caller: `api/mentors/route.ts`).
- A denied request keeps today's codes: 401 without a valid session, 403 for the wrong role or a missing CSRF header.

## 📝 UI/UX

Only what is unique: the shared form layer has defined states: idle, submitting (submit disabled, label unchanged), field errors under each field, one form-level error region announced with `role="alert"`, Ctrl/Cmd+Enter submits, Escape cancels, focus moves to the first invalid field. Public skin uses Tailwind utilities; no preflight is configured, so buttons, labels and inputs set their own resets (`.ai/lessons/2026-10-19-tailwind-without-preflight.md`).

## 📝 Edge Cases & Failure Scenarios

- Valid signature, unknown role claim: rejected as an invalid session (401).
- A `public` page with a malformed or expired cookie renders as anonymous; a guarded page redirects to sign-in. Neither shows the previous user's data.
- `requireConfig` missing a variable: 503 with names only; the page equivalent shows a plain "temporarily unavailable" state, not a stack.
- Rate-limit memory is lost on restart and not shared across instances (accepted for 1.0, Q6, recorded in Risks).
- `redirect()` inside a guarded page must happen before any data fetch so nothing of the page renders (acceptance criterion in auth).
- Contract test false negatives: a route file built through a wrapper the test does not recognise. The typed `access` field is the primary control; the test only catches a missing field in code that bypasses types.

## 📝 Risks & Impact Review

- **Signature change** of `apiHandler` and `makeCrudRoute`, removal of the `authorize` option and widened exports in `core/src/index.ts`: breaking for any unmerged branch; no external consumers (single deployable). Mentioned in the PR body under breaking changes.
- **Behavior change**: a missing `JWT_SECRET` moves from 500 to 503. Additive code `SERVICE_UNAVAILABLE`; `BACKWARD_COMPATIBILITY.md` surfaces touched: "HTTP API routes", "Environment variables and config", "Package public exports".
- **CrudForm refactor risk**: the existing `CrudForm` tests are the safety net and must pass unchanged before and after the extraction.
- **Single-instance assumption (Q6)**: horizontal scaling silently weakens rate limiting. Mitigation: documented in the adapter and in `README.md`; the port makes the swap local.
- **Known gap stays visible until auth ships**: the mentors route is declared `access: "public"` with a comment pointing at E01-S03, so the gap becomes explicit rather than closed. Closing it here would lock the only admin page before anyone can sign in.
- Rollback: each phase is an independent commit range; reverting restores the previous signatures with no data change.

## 📝 Decisions in play

Business rules and decisions this spec relies on: R03 (text notice, catalogue), R23 and D31 (one role per account, `Role`), D19 (operator by allowlist, config), R24 (channel privacy, public DTO rule). It supersedes none. `engineering-standards.md` says "no RBAC": consistent, since `Access` is role equality, not a permission engine. Owner for any change to these: founder A.

## 📋 Phasing

Group A is the prerequisite of auth phase 1 and merges first, on its own. Group B has no consumer before auth phase 2, so it ships inside the auth phase 2 pull request; its steps are listed here because this spec owns the design.

1. **Phase A1, config and vocabulary:** `requireConfig`, new errors, `Role`.
2. **Phase A2, access policy:** `Access`, `apiHandler`, `makeCrudRoute`, page guard, `homeFor`, session reader, config in the container, contract test.
3. **Phase A3, test kit core:** `JWT_SECRET`, fake server, cookie minting and setting, catalogue and rules in `AGENTS.md`.
4. **Phase B1 (with auth phase 2), ports:** rate limiter, mailer.
5. **Phase B2 (with auth phase 2), forms:** headless core, `CrudForm` on it, `PublicForm`.

A1 to A3 each merge independently and leave the app working; B1 and B2 land with S02 so no primitive exists without a consumer.

## 📋 Implementation Plan

### Phase A1: config and vocabulary
1. Add `ServiceUnavailableError` (503, `SERVICE_UNAVAILABLE`) and `TooManyRequestsError` (429, `RATE_LIMITED`) to `core/src/http/errors.ts`; export from `core/src/index.ts`. Unit tests for status and code. (The 429 class is used from phase B1; adding both codes together keeps the error table in one change.)
2. Add `requireConfig(keys)`; `requireJwtSecret` uses it. Tests: present, missing, names-only message.
3. Document `JWT_SECRET` in `.env.example` and `README.md`.
4. Add `Role`, `isRole`; narrow `Session.role`; `verifySession` rejects unknown roles. Update `auth.test.ts` (the old "admin" token case now rejects).

### Phase A2: access policy
5. `core/src/http/access.ts`: `Access`, `enforceAccess`; delete `requireRole`, stop exporting `requireSession` from the barrel. Tests: public with valid, missing and tampered cookie; authenticated; role allowed and denied.
6. `apiHandler` takes `access` and passes `session`; `makeCrudRoute` takes a single `access` and puts `session` in the context; remove `authorize`. Update both test files. Declare `access: "public"` in `api/mentors/route.ts` with a comment pointing at E01-S03; its route test still passes.
7. `app/src/server/session.ts` (`readSession`) and `guards.ts` (`requirePage`, `homeFor`). Tests with mocked `next/headers` and `next/navigation`. Declare `export const access = "public" as const;` on `/` and `/mentors`, and call `requirePage("public")` in `/admin/mentors` only if it needs the session (it stays public until auth phase 3, with a comment pointing at E01-S03). Register `config` in `container.ts` and read the secret from it.
8. `access-contract.test.ts` plus committed fixture-based tests proving it fails for an undeclared route and page.

### Phase A3: test kit core and docs
9. `global-setup.ts`: random `JWT_SECRET`, generic fake server, provided `jwtSecret`, `databaseUrl` and fake URL. `helpers/fake-server.ts`, `helpers/identity.ts` (`mintSessionCookie`), `browser.setCookie`. Verified by a smoke integration test that the app boots with the new environment and the fake server answers; the signed-cookie cases need a guarded surface and are asserted in auth phase 1 (step 8) and phase 3 (step 5).
10. `AGENTS.md`: the access rule ("every route and page declares `access`"), the ports pattern, and a pointer to the catalogue in this spec (the catalogue itself stays here, not duplicated); `README.md` route table. Lesson file if a gotcha appears.
11. Gate: `npm run lint`, `typecheck`, `test:coverage` (100%), `build`, `test:integration`; breaking-change note in the PR body.

### Phase B1: ports (inside the auth phase 2 pull request)
12. `RateLimiterPort` in `services/ratelimit/`, memory adapter on `globalThis`, `enforceRateLimit` with the two-key rule; `TRUST_PROXY` and `MAILER_TRANSPORT` added to `envSchema`. Tests: window, cooldown, key isolation, unknown-IP shared bucket, per-IP limit across many subjects, two module copies sharing state.
13. `MailerPort`, log adapter selected by `MAILER_TRANSPORT`, fail-closed when unset (including with `NODE_ENV=production` and with `NODE_ENV=test`). Tests for each combination; `global-setup.ts` sets `MAILER_TRANSPORT=log`.
14. Register `rateLimiter` and `mailer` in `container.ts` and `Cradle` (one line each). Their consumers are the register, login and verify-email routes of that same pull request.

### Phase B2: forms (inside the auth phase 2 pull request)
15. First commit of the pull request: extract `useFormCore`; rebuild `CrudForm` on it with the existing tests untouched and green before and after.
16. `PublicForm` (in `ui/src/backend/forms/`) with the field union (`text | email | password`, `autoComplete`). Tests: validation, server `fieldErrors`, keyboard, submit lock, `role="alert"`. Consumer: the sign-in and register pages of that pull request.
17. Export from `ui/src/index.ts`; confirm client bundles import schemas only through `@devmentor/core/validators`.
