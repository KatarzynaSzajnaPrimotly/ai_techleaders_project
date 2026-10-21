# Platform foundations: access policy, ports, persistence recipes, forms, test kit and the catalogue of decided contracts

> Status: standing document (fixed name, like `engineering-standards.md`; the exception is recorded in `AGENTS.md` by phase A3), revised twice after the architectural review of 2026-10-21. It is not moved to `implemented/` when E01 ships; it is amended in place. Companion: `2026-10-21-auth.md` (E01, #29) is the first consumer; implementation order is this spec's phases A0 to A3, then auth. The two specs refer to each other by step name, not number.
> Source: `.ai/specs/backlog.md` (E01 to E07), `.ai/specs/product-brief.md`, `.ai/specs/engineering-standards.md`, `AGENTS.md`, and the code under `packages/` and `tests/`.
> Authority rule: the catalogue below is the default design for E02 to E07. A story or an owed epic spec (E02, E03, E05) may deviate with a stated reason and must amend this document in the same pull request, so there is one answer to each question.

## 📝 TLDR

DevMentor has 21 stories ahead (E01 to E05; E06 is parked and E07 has no stories filed) that repeat the same backend and frontend needs, and today each would invent its own: a route with no declared access is silently public (the `/api/mentors` "known gap"), public pages have no form layer, external services have no port-and-fake pattern, config is read ad hoc, and tests have no signed identity. This spec (future behavior) fixes the shape of those primitives in three tiers: **built now** (what E01 itself exercises, each in the pull request of the first consumer), **decided now** (a written contract with a recipe, built by the first story that needs it, so it is not invented twice), and **deferred** (named, no design yet). Stories keep their own acceptance criteria; this document owns the shared mechanisms.

## 📝 Problem Statement

Evidence from the repository (searched in `packages/`, `tests/`, `eslint.config.mjs`; re-verified by independent reviews):

- `makeCrudRoute` takes an optional `authorize`; `apiHandler` takes no access input. `packages/app/src/app/api/mentors/route.ts` passes none, so `GET` and `POST /api/mentors` are public, as is `/admin/mentors`. Nothing fails when a new route forgets a guard.
- `Session.role` is `string` and `verifySession` accepts any role claim. `requireRole` and `assertOwns` have no caller. `requireSession(request, secret = requireJwtSecret())` evaluates the secret before it reads the cookie (`core/src/http/auth.ts:45`).
- `CrudForm` (`packages/ui/src/backend/forms/CrudForm.tsx`) holds state, validation, server `fieldErrors` and keyboard handling inside one shadcn component; the backlog adds forms in E02 (page editor, slots, prices), E04 (answer, note) and E05 (invitations, settings, disputes), most of them edit forms with initial values.
- `parseEnv` runs at import time through the logger (`core/src/logger.ts:12`, re-exported by the barrel): a new required field would break every import and the CI build. `requireJwtSecret` throws a plain `Error` (a 500). `.env.example` and `README.md` do not mention `JWT_SECRET`.
- External services (GitHub now; mail, Stripe later) have no pattern. `AGENTS.md` says "a port in `core` with a mock adapter first" but no port with an adapter exists.
- `tests/integration` cannot sign in: no signed-cookie helper, no fake external server, `global-setup.ts` passes no `JWT_SECRET`, runs `next start` over plain http with `NODE_ENV=production` (line 78), and chooses the port after the build.

What the backlog implies beyond E01 (read from `backlog-snapshot.md`; items marked inferred are not stated there): invitation tokens; once-only state changes and check-then-write over unique constraints (slots, bookings, answers, notes, disputes, payouts); a visibility rule for the channel, e-mail and notes (D32/R24, N02, R02) repeated in about eleven stories; EUR money in integer cents with a fee split (D11, D29, D30); a rule set with time (2-hour lead, 24-hour cancellation) evaluated without a scheduler; payment, payout and mail ports with webhooks; notifications to both parties; an in-process event emitter after commit; an audit of operator changes (inferred); role navigation and an operator shell; forms with initial values and several submit intents.

## ✅ Decisions

| Id | Decision | Source |
|---|---|---|
| Q1 | Two specs: this one and `2026-10-21-auth.md`. | user |
| Q2 | Code: build only what E01 uses, each primitive in the pull request of its first consumer. Design: everything the review found shared by several stories is **decided now** as a contract in the catalogue (no code until its first consumer). Matches `AGENTS.md` (no empty scaffolds). | user, recommended; widened by the review |
| Q4 | Access is an explicit, mandatory declaration on every route and page. | user, recommended |
| Q5 | Headless form core with two skins (shadcn, Tailwind); `CrudForm` keeps its props. | user, recommended |
| Q6 | 1.0 is a single Node instance; the rate limiter is in memory behind a port. | user, recommended |
| Q9 | Styling boundary stays as in `AGENTS.md`: Tailwind for every page outside the operator and admin area (public, mentee, mentor), shadcn for the content of operator and admin pages. The shared chrome (`RoleShell`: navigation, sign-out, badge slot) is Tailwind in both areas. No `AGENTS.md` styling change. | user, recommended |

Question ids are shared with `2026-10-21-auth.md`, which holds Q3 (role name), Q7 (revocation) and Q8 (registration creates the account at confirmation).

## 📝 Proposed Solution

Three tiers. **Built now** because E01 uses each: config and errors (A1), the access policy (A2), the contract test and docs (A3), then inside auth the primitives of the pull request that first calls them (see Phasing). **Decided now**: persistence recipes, visibility, money, rules and time, notifications, events, audit, payments, operator shell. A short **spike** (A0) validates the persistence recipe against MikroORM before its first consumer (E02-S01). Alternatives that lost:

- **Build every primitive now:** untestable without a consumer, so it cannot reach 100% coverage honestly, and the shapes would be guesses (Q2).
- **Catalogue as one-line names:** the review found rows that did not match the stories that were to build them and ten-story primitives missing. A contract must be decided, not named.
- **Keep `authorize` and add a lint rule** for missing guards: a lint rule cannot see that a hook exists but does nothing; a required typed field can.
- **A third-party auth framework** (Auth.js, Clerk): see Research.

## 📝 Research

Compared against well-known tools (from general knowledge, not re-fetched in this run, so treat as direction, not evidence; the rejections rest on this repository's constraints, which were read):

- **Auth.js**: keeps e-mail account linking off by default because linking on an unverified e-mail is a takeover path. We adopt the same stance in the auth spec. Rejected as a dependency: it owns the session cookie shape and callbacks, while `auth.ts` already defines the protected cookie and JWT contract (`BACKWARD_COMPATIBILITY.md`).
- **Lucia** (now a guide rather than a library): its lesson is that session handling is small enough to own and that revocation needs a server-side store. Q7 chose stateless sessions instead and records the cost.
- **Clerk and similar hosted auth**: fastest to ship, but add a vendor, per-user cost and a role model we would still mirror locally (one role per account, operator by allowlist, D19, D31).
- **Next.js 16 authentication guide** (bundled in `node_modules/next/dist/docs/01-app/02-guides/authentication.md`): layouts do not re-render on navigation, so guards belong in each page. The bundled `redirect.md` and `streaming.md` add that a `redirect()` inside a streaming context (a `loading.tsx` or a `<Suspense>` above the page) becomes a meta tag with HTTP 200, not a 307: guarded pages must not sit under either.
- **Skipped on purpose**: RBAC engines (CASL, Casbin). `engineering-standards.md` excludes RBAC; with three roles, one per account, equality on a union type is enough.

## 📝 Architecture

Where each primitive lives (existing layering unchanged: `app` -> `ui`, `core`, `db`; `core` imports nothing project-internal and no framework or vendor SDK).

| Primitive | Package and path | Built by |
|---|---|---|
| `requireConfig`, `ALLOW_INSECURE_HTTP` helper, `ServiceUnavailableError`, `Role`, `isRole` | `core/src/config/env.ts`, `core/src/http/` | A1 |
| `Access`, `enforceAccess`, `access` and the `navigation` error option on `apiHandler`, `access` on `makeCrudRoute` | `core/src/http/access.ts`, `apiHandler.ts`, `makeCrudRoute.ts` | A2 (consumer: the mentors route and every route through `apiHandler`) |
| Access contract test (fixtures as strings) | `app/src/server/access-contract.test.ts` | A3 |
| `absoluteUrl`, purpose-token helper, `safeReturnTo`, migration helper, fake server, `mintSessionCookie`, `runConcurrently` | `core/`, `tests/integration/helpers/` | auth S01a |
| `guardedPage`, `publicPage`, `homeFor`, session reader, `RoleShell`, `navFor`, `apiCall` 401 option, response headers | `app/src/server/`, `ui/src/components/shell/`, `ui/src/backend/api/apiCall.ts`, `next.config.ts` | auth S01b |
| `TooManyRequestsError` with `retryAfterSeconds`, rate limiter port and memory adapter, mailer port and log adapter, `selectAdapter`, `PublicForm` | `core/src/http/errors.ts`, `core/src/services/ratelimit/`, `notifications/`, `shared/`, `ui/src/frontend/forms/` | auth S02 |
| Headless form core (only the options `CrudForm` uses), `CrudForm` on it | `ui/src/backend/forms/` | B2a (own PR) |
| Everything in the catalogue | per row | first consumer |

`ui/src/frontend/` is a new home for public and mentee/mentor Tailwind primitives (the review found no home for them: `backend/` means back-office generic panels in `AGENTS.md`); its `AGENTS.md` placement row lands with the first file in it (auth S02).

### Access policy (Q4)

```ts
type Access = "public" | "authenticated" | { roles: readonly Role[] };
```

- `Role = "mentee" | "mentor" | "operator"` (Q3) with `isRole`. `verifySession` rejects an unknown role claim and any token that carries a `purpose` claim (fail closed). No token is issued today, so no live session is affected.
- **One role-check API.** `enforceAccess(request, access): Promise<Session | null>` is the single entry point for authentication and role checks, called by `apiHandler` (and so by every route). `requireSession` becomes its internal helper (no longer exported from the barrel; `core/src/index.test.ts:27-29` is updated) and `requireRole` is deleted (no caller). `assertOwns` stays: it answers ownership of a record, not role. The authenticated and role branches are the same function and are covered by its unit tests; their first route consumer is E01-S03.
- **The secret is read inside `enforceAccess`, lazily.** `public` with no cookie returns `null` and never reads `JWT_SECRET`; `public` with a cookie but no secret configured also returns `null` (anonymous, logged once at warn), so a public route cannot start answering 503. `authenticated` and `{ roles }` read the secret and answer 503 when it is missing, 401 without a valid session and 403 for a role not listed. No secret is passed from the app.
- `apiHandler(handler, { access, csrf?, navigation? })`: `access` is required in the options type; the handler receives the session as a third argument, typed by the declaration (`Session` for `authenticated` and `{ roles }`, `Session | null` for `public`). A webhook is `access: "public", csrf: false` and verifies its own signature, so exceptions are visible in one grep. **`navigation: (error) => Response`** is the one place a browser-navigation route turns a typed error into a redirect (for example to `/sign-in?error=unavailable`); no route writes its own `try/catch` (`engineering-standards.md`, `AGENTS.md` Errors).
- `makeCrudRoute({ access, ... })`: one `Access` applied to every configured method (a per-method map is added by the first resource that needs it). The `authorize` hook is removed (no caller); record-level checks use `assertOwns` inside `run`, which receives `session`. Order of checks, with one small change from today (an unconfigured method used to be rejected by the CSRF check first, now it answers 405 before anything else; listed in the PR notes): an unconfigured method answers 405; for a configured state-changing method the CSRF header is checked (403), then access (401, 403).
- **Pages.** Two typed wrappers replace the earlier `requirePage` plus manifest. `guardedPage({ path, access }, render)` returns an async default export; `render` is exported separately so page tests render the inner component with `render(<Page />)` like the existing page tests, while a guards test covers the wrapper. `publicPage(Component)` returns the component unchanged (no cookie read, statically renderable); `publicPage(Component, { withSession: true })` is for a public page that needs the session and accepts dynamic rendering. `guardedPage` reads the cookie with `await cookies()`; no valid session redirects to `/sign-in?returnTo=<path>` (the path is the explicit argument, because a server page has no current-path API); a wrong role redirects to `homeFor(role)`. `homeFor(role)` (mentee `/home`, mentor `/mentor`, operator `/admin/mentors`) is a pure map in `app/src/server/guards.ts`. Both wrappers arrive with auth S01b, where their consumers (the role homes) arrive; until then the existing pages stay as they are and the contract test (A3) treats them through its named exception list.
- **Streaming constraint.** No `loading.tsx` and no `<Suspense>` boundary above a `guardedPage`, so `redirect()` stays a 307. The integration tests assert the status with `fetch(url, { redirect: "manual" })`.
- `proxy.ts` is not used for enforcement.
- **Contract test** `access-contract.test.ts` (project `unit-node`) parses the sources with the `typescript` API (already a root devDependency). Fixtures are strings inside the test. It fails when a route lacks `access:` in its `apiHandler` or `makeCrudRoute` call and, once auth S01b ships, when a page's default export is neither `guardedPage(` nor `publicPage(` and when the path rule is broken: `app/admin/**` and `app/api/operator/**` need `{ roles: ["operator"] }`, `app/(mentor)/**` mentor, `app/(mentee)/**` mentee. A **named, dated exception list** holds `app/admin/mentors/page.tsx` (public until E01-S03, with a comment) and `app/api/mentors/route.ts` (public until E01-S03); S03 empties the list and the test asserts it is empty afterwards. It is a convention check, not the primary security control; the typed field and the runtime guard are authoritative.

### Config

`parseEnv` stays as it is and is not made stricter: it runs at import time through the logger, so a new required field would break every import and the CI build, and making an optional variable required violates `BACKWARD_COMPATIBILITY.md` ("Environment variables and config"). Instead:

- `requireConfig(keys)` reads `process.env` by name (it never calls `parseEnv`, which throws a plain `Error` on any other bad variable) and returns the values or throws `ServiceUnavailableError` (503, `SERVICE_UNAVAILABLE`, listing variable names only, never values). It is called where a variable is first needed, so a missing variable becomes a 503 on the route that needs it. `requireJwtSecret` uses it. Tests: present, missing, names-only message.
- `ALLOW_INSECURE_HTTP` is the one test-only switch, parsed in `envSchema` (optional), documented in `.env.example` and `README.md` as test-only, and read by one helper `isInsecureHttpAllowed()`. It relaxes two things and nothing else: the session cookie `Secure` flag and the https requirement of `absoluteUrl`. The helper logs an error when the flag is set while `APP_URL` is https (a deployment that should not carry it); the harness runs over plain http with `NODE_ENV=production` and sets it. The deviation from `engineering-standards.md` ("`secure` in production") is recorded there by phase A3.
- `absoluteUrl(path)` (built with its first caller, auth S01a) is the only place that builds an absolute URL from `APP_URL` (GitHub redirect URI, mail links, share links, Stripe return URLs later). It uses `requireConfig(["APP_URL"])` and, in production, refuses a non-`https` value unless `isInsecureHttpAllowed()`.
- Each variable is added by the phase that first reads it, documented in `.env.example` and `README.md`: S01a `APP_URL`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GITHUB_OAUTH_BASE_URL`, `GITHUB_API_BASE_URL` (the last two default to the real hosts); S02 `TRUST_PROXY_HOPS`, `MAILER_TRANSPORT`; S03 `OPERATOR_EMAILS`. All stay optional in `envSchema`.
- The session cookie is `Secure` when `NODE_ENV=production` unless `isInsecureHttpAllowed()`.
- Config is not registered in the Awilix container: a registered `config` would pull the ORM into a page that only reads a cookie (`container.ts` awaits `createOrm()`), and the container is for services.

### Ports and adapters pattern

Rule for every external service or replaceable mechanism: `core/src/services/<concept>/<name>.port.ts` (interface), an in-memory fake for unit tests, and adapters. **Where an adapter lives:** an adapter that needs only `fetch` or the standard library lives in `core/.../adapters/`; an adapter that needs a vendor SDK (Stripe, a real mail transport) lives in the composition root, `app/src/server/<concept>/`, so `core` stays free of vendor SDKs. Wiring is one explicit line in `container.ts` per service.

**Adapter selection rule** (one rule, applied to every port): each port has one selector variable (`MAILER_TRANSPORT`, `PAYMENT_GATEWAY`, ...). Unset means "no adapter": using the port throws `ServiceUnavailableError` regardless of `NODE_ENV`. Mock and log adapters are chosen only by an explicit value, never by `NODE_ENV`, because the integration harness runs with `NODE_ENV=production`. One helper `selectAdapter(name, registry, value)` implements it, with one test per port. Built with the first port that uses it (the mailer, auth S02).

Ports built by E01:

- `GithubIdentityPort` (auth S01a): authorize URL, code exchange, `/user`, `/user/emails`; base URLs from config; no mock selector (the integration tests point the base URLs at the fake server).
- `RateLimiterPort.hit(key, policy): Promise<{ allowed: boolean; retryAfterSeconds: number }>` (auth S02), with `TooManyRequestsError` (429, `RATE_LIMITED`, `retryAfterSeconds`, mapped to a `Retry-After` header by `apiHandler`) added in the same PR. Keys: per (client IP, subject) and per client IP alone. **Client IP:** the entry of `x-forwarded-for` that is `TRUST_PROXY_HOPS` positions from the right; the default is **0**, which means no IP: only the per-subject key applies, and the process logs one warning in production when the variable is unset, so a deployment behind a proxy sets it deliberately (a default of 1 would let a client rotate its own header when there is no proxy). A header shorter than the hop count also means no IP. The leftmost entry is never used (it is client-controlled). With no IP, the login key is the e-mail alone, so a targeted lock-out of a known address for the window is accepted and documented (the alternative, no limit, is worse). There is no shared "unknown" bucket. The memory adapter stores counters on `globalThis` (`.ai/lessons/2026-10-19-nextjs-duplicate-package-copies.md`) and is bounded: expired windows are swept on each hit; if the store is still at its key cap, a request that needs a **new** key is refused (429) while every existing key keeps working, so flooding junk keys can neither reset an attacker's own counter nor evict an active one. It says in its doc comment that it is valid for one instance (Q6).
- `MailerPort.send({ to, subject, text })` (auth S02). The log adapter is chosen by `MAILER_TRANSPORT=log`; unset sends nothing and throws `ServiceUnavailableError`, because a logged message can contain a bearer link and the logger redacts keys, not message text. A real transport is a launch task (brief Q26).

### Persistence recipes (decided now; spike A0, built by E02-S01)

These recipes are used by about ten stories (E02-S01 accept, E02-S05, E03-S03 confirm, E03-S05 cancel, E03-S06 payout row, E04-S02 to S04, E05-S03). E01 itself needs none of them (see the auth spec: sign-in is one insert protected by unique constraints, and a GitHub link is one conditional update). They are decided now so that E02-S01 and E03-S02 do not carry two different patterns.

- **Transaction.** `UnitOfWork.run(work: (tx: TxRepositories) => Promise<T>): Promise<T>` in `core/src/services/shared/unit-of-work.port.ts`, implemented in `db`. `tx` exposes the repository ports bound to the transaction (a parameterless `fn` is a trap: repositories on the per-request forked `em` do not necessarily join `em.transactional`). A repository-owned transaction inside one method is the exception and needs a stated reason.
- **Once-only change.** A repository method `transitionWhere(id, { from }, patch): Promise<boolean>` is a conditional `UPDATE ... WHERE id = ? AND status IN (from)` returning whether one row changed; `false` becomes `ConflictError` in the service. The auth spec's GitHub link uses the same shape (`linkGithub` is `UPDATE ... WHERE id = ? AND github_id IS NULL`). A pure transition table `{ from: { event: { to, by: "mentee" | "mentor" | "system" } } }` carries the permitted party, so the state check and the actor check live in one table. Each use has the concurrent integration test `AGENTS.md` demands.
- **Partial unique index and row lock** (slots, bookings): must be generated by `migration:create` (hand-edited schema is forbidden).
- **Spike A0** (about an hour, a throwaway branch, outcome recorded in this document and a lesson file): confirm that MikroORM 7 generates a partial unique index from `EntitySchema`, that `FOR UPDATE` works through the query builder or `em.lock`, and that a transaction-bound repository factory works with the forked `em`. If generation cannot express the index, this document records the compliant alternative before E02-S01 starts. *Spike result: pending.*

### Visibility (decided now, built by E02-S02)

Eleven stories carry a negative criterion of the form "this appears nowhere public or to a non-party" (channel and e-mail E02-S02, payout status E02-S05, E03-S01, E03-S04, E04-S01 to S04, E05-S03). One mechanism:

- `resolveParty(actor, booking): "mentee" | "mentor"` throws `ForbiddenError` for anyone else (`assertOwns` answers one owner; a booking has two parties). Repositories return a booking with both party user ids.
- Every response body is produced by parsing through a Zod output schema per audience (`publicMentorSchema`, `partyBookingSchema`, `operatorBookingSchema`, under `core/src/validators/<concept>/`). Zod strips unknown keys, so adding a column to an entity cannot leak it. The channel address is in the party schema only (D32, R24): the public and operator schemas never carry it.
- One test helper `expectNoKeys(payload, forbidden)` in `tests/integration/helpers/` is reused by every such criterion.

### Money (decided now; format and parse built by E02-S04, split by E03-S03)

- Integer cents; one currency, EUR (D29); `PLATFORM_CURRENCY`, `formatEur(cents)`, `parseEur(text)` (mentors type euros, not cents).
- Fee: for 1.0 the fixed percent of D11 (20, a named constant); an operator-configurable percent is E05-S02 (1.1) and is an integer from 0 to 100. `platformFee = floor(price × percent ÷ 100)` and `mentorShare = price − platformFee`, so `platformFee + mentorShare = price` always and the odd cent goes to the mentor. ⚠ A detail of D11 and D30 (protected, risk-high); taken as a default for founder A to confirm.
- The split is a snapshot stored on the booking at confirmation (fee percent and both amounts). "Owed to the mentor" is derived, never stored: `owedToMentor(booking)` is the share when the booking is paid, not refunded, not held by an open dispute, and not marked paid by hand (D28, R20, R22). What a forfeited late cancellation owes is open (brief Q25).
- Idempotency keys are namespaced per operation: `checkout:<booking id>`, `refund:<booking id>`, `transfer:<payout id>` (Stripe scopes keys per request and rejects reuse with different parameters; recalled, not re-checked).
- **Browser-safe home.** Constants and pure functions a client component needs (session lengths, the lead-time constant, `STACK_TAGS`, money functions) live in `core/src/constants/`, exported as the zod-free, node-free subpath `@devmentor/core/constants`, because importing the barrel would pull `pino` and `jose` into the client bundle (`.ai/lessons/2026-10-19-client-bundles-and-core-subpaths.md`).

### Rules and time (decided now, built by E02-S03)

- No Clock port. Services take `now: Date` as a parameter at their boundary (every story already does); tests pass a fixed value; rules are evaluated lazily on read, because the repository has no scheduler or worker.
- One module `core/src/constants/booking-rules.ts` holds the named constants (`MIN_BOOKING_LEAD_MINUTES`, `FREE_CANCELLATION_HOURS`, `BOOKING_HOLD_MINUTES`, `SESSION_LENGTHS`) and the pure predicates (`isOfferable(slot, now)`, `sessionState(booking, now)`). It is the single answer to "which rule decides bookable": the mentor list, the slot picker, the booking start and `isBookable` use it and cannot disagree.
- API and database carry UTC instants (ISO 8601). A local zone appears only at the edge: a client component `LocalTime` renders the UTC value on the server and the local value after mount, always labelled, to avoid hydration mismatches; a `datetime-local` form field converts to an instant with the browser's offset before submit.

### Notifications, events, audit, payments, tokens, shell (decided now)

- **Notifications.** `NotificationService.notify(recipientUserId, kind, { subjectType, subjectId })` with `kind` as a registered union, a `readAt` column and text templates under `services/notifications/templates/`. The domain row is the durable record; the notification is a convenience. `MailDeliveryError` carries no recipient and no token. Built by E03-S04 (eight stories notify somebody).
- **Events.** A typed in-process emitter in `core/src/events/`, ids `concept.entity.action`, emitted after commit, handler failures logged and swallowed, **created by the root container** (never a module singleton, per the duplicate-copies lesson). Built by E03-S03.
- **Audit.** `audit.record({ actor, action, subjectType, subjectId, details })` written in the same transaction as the operator change; R18's shared operator note stays outside the product, this is the in-product trace (a column keeps only the last editor, but the fee that applied to a booking must be explainable). Built by the first operator change.
- **Error details.** The envelope gains an optional typed `details` (additive; recorded in `BACKWARD_COMPATIBILITY.md` as an envelope extension) when its first consumer needs it: E03-S05 returns the new outcome in a stale 409.
- **Payments.** Two ports, `PaymentGateway` (checkout and refund) and `PayoutGateway` (Connect onboarding and transfers), selector `PAYMENT_GATEWAY`. Stripe adapters live in `app/src/server/payments/`; mocks and fakes in `core`. The webhook route is one route with a handler registry (`event type -> handler`, one line per story: `checkout.session.*` E03-S03, `charge.refunded` E03-S05, `account.updated` E02-S05), `access: "public", csrf: false`, signature check and a processed-event table. Built by E03-S03.
- **Tokens.** `signPurposeToken(purpose, claims, ttl)` and `verifyPurposeToken` in `core/src/http/tokens.ts` (auth S01a) back the OAuth state and the registration link, so "a session token is never a purpose token" is one tested property. An invitation token is opaque: 32 random bytes, only the SHA-256 stored, never logged (E02-S01).
- **Response headers.** Pages that carry a token or a signed-in view send `Referrer-Policy: no-referrer` and `Cache-Control: no-store`. Mechanism: `headers()` in `packages/app/next.config.ts`, per source (`/register/confirm`, `/sign-in`, and the guarded areas `/home`, `/mentor`, `/admin/:path*`); a page component cannot set response headers. Built in auth S01b (and S02 for `/register/confirm`) with an integration test asserting the headers.
- **Role shell.** `RoleShell` (layout component fed by `navFor(role)`: navigation, sign-out and a badge slot, Tailwind chrome identical in every area) is built in auth S01b for the mentee and mentor homes. The operator shell is the same component with the operator navigation, wrapped around shadcn page content, built in auth S03 (E01-S03), not in E05: E03-S03 and E04-S04 add operator pages in the first iteration. Layouts render navigation only; guards stay in pages.
- **Client contract.** `apiCall` takes an `onUnauthorized: "redirect" | "ignore"` call option: the default `redirect` sends a 401 to `/sign-in?returnTo=` (a mentor editing after the 24-hour cookie expired otherwise sees "Authentication required" on the form); `ignore` is used by the login, register and confirm calls, whose 401 is an answer to render, and the redirect is skipped when the page is already `/sign-in`. Built in auth S01b; the failed-login case is a test in S02.

### Form layer (Q5)

Extract the logic of `CrudForm` into a headless hook `useFormCore({ schema, fields, onSubmit, onSuccess, onCancel })` returning `values`, `setValue`, `fieldErrors`, `formError`, `submitting`, `handleSubmit`, `handleKeyDown` — only the behavior `CrudForm` has today, so the extraction has its own consumer and ships as its own pure-refactor pull request (B2a) with the existing `CrudForm` tests green and unchanged. `initialValues`, `resetOnSuccess: false` and several submit intents (save draft versus publish, approve versus decline with a comment) are **decided here and built by the first edit form** (E02-S02); behavior that exists only for the public skin ("Saving…" label, focus on the first invalid field) belongs to `PublicForm`, not to `CrudForm`.

Two skins render it: `CrudForm` (shadcn, operator and admin pages, unchanged public props and behavior) and `PublicForm` in `ui/src/frontend/forms/PublicForm.tsx` (Tailwind, used by sign-in, register and the mentee and mentor screens, Q9; built in auth S02). Each skin has a field-renderer map; one test asserts that both maps cover the `type` union, so a story that adds a field type (`textarea`, `select`, `multi-select`, `datetime`, `money`) must add it to both. The union starts with `text | email | password`. A story that needs a new shadcn primitive adds it with the field type (a first-time `components.json` for E05-S03 included).

### Test kit

- `global-setup.ts` generates a random `JWT_SECRET` (at least 32 characters), reserves the port **before** the build, and starts an always-on fake HTTP server with a control API (`POST /__control/...`, so a test running in a worker can program it). It passes `APP_URL`, `JWT_SECRET`, `GITHUB_OAUTH_BASE_URL`, `GITHUB_API_BASE_URL`, `MAILER_TRANSPORT=log` and `ALLOW_INSECURE_HTTP=true` in the child `env`. `provide` carries only serializable values (`jwtSecret`, `databaseUrl`, `appUrl`, `fakeServerUrl`).
- `helpers/identity.ts`: `mintSessionCookie({ userId, role })` imports the signing function by relative path from `core/src/http/auth.ts` (the package `exports` map exposes only `.` and `./validators`, and the barrel would pull pino and run `parseEnv()` in the test process). `createUser(...)` inserts through a Postgres client added to the test dependencies (the root `package.json` has no `pg`; it is transitive from MikroORM today).
- `helpers/browser.ts`: `setCookie(name, value)` through `agent-browser cookies set` with the page URL.
- `helpers/concurrency.ts`: `runConcurrently(n, requestFn)` with a start barrier, used by every check-then-write test (about twelve stories). First consumer: the concurrent sign-in tests in auth S01a.
- `helpers/migrations.ts`: runs `up`, `down`, `up` against the throwaway database; `migration:create` must run against the database named `devmentor` (two snapshot files are committed). Built with the test kit core, first used by the `users` migration.
- Factories (a bookable mentor, a slot, a confirmed booking inserted directly) are added by the first story that needs each.

### Catalogue (summary of the decided contracts)

| Primitive | Location | Decided in | Built by |
|---|---|---|---|
| Transaction and once-only change | `core/src/services/shared/`, `db` | Persistence recipes | E02-S01 (after spike A0) |
| Visibility (`resolveParty`, audience schemas, `expectNoKeys`) | `core/src/validators/<concept>/`, tests helper | Visibility | E02-S02 |
| Money and `owedToMentor` | `core/src/constants/`, `services/shared/` | Money | E02-S04, E03-S03 |
| Booking rules, `LocalTime` | `core/src/constants/booking-rules.ts`, `ui` | Rules and time | E02-S03 |
| Edit-form options of the form core | `ui/src/backend/forms/` | Form layer | E02-S02 |
| Notifications | `core/src/services/notifications/` | Notifications | E03-S04 |
| Event emitter | `core/src/events/` | Events | E03-S03 |
| Audit | `core/src/services/audit/` | Audit | first operator change |
| Error `details` | `core/src/http/errors.ts` | Error details | E03-S05 |
| Payment and payout ports, webhook registry | `core`, `app/src/server/payments/` | Payments | E03-S03, E02-S05 |
| Invitation token | `core/src/services/invitations/` | Tokens | E02-S01 |
| Platform settings | `core/src/services/operator/platform-settings.service.ts` (the path the stories use) | this row | E02-S04 |
| Operator shell | `app/src/app/admin/layout.tsx`, `/api/operator/*` | Role shell | E01-S03 |

`services/shared/` is a named exception to the one-folder-per-concept convention for primitives with no owning concept; it is created with the first file that goes in it. Naming rule: `Session` in code is the login session; the mentoring meeting is `Booking` in code and "session" only in copy; service methods that act for a user take the login session as `actor`. Deferred, no design yet: search, pagination (volumes are tiny: batches of 20, ten sessions a week), a queue or worker, RBAC.

### Issue texts superseded by this spec

These issue bodies name APIs this spec deletes or renames (`requireSession` plus `requireRole`, `authorize`, the parameter name `session`, HTTP 422). `om-auto-fix-issue` reads them, so they are edited when phase A2 merges (the E01 issues #36 to #38 are edited when the auth spec merges): E02-S01, E02-S02, E02-S04, E02-S05, E03-S02 to S05, E04-S01 to S04 (`requireSession` and the mentor role; E04-S02 to S04 also say 422 where the contract is 400), the E05 epic and E05-S01 (`requireSession` then `requireRole` for operator), E05-S02 (`authorize` calling `requireRole`), and the stories that name the parameter `session` instead of `actor` (E02-S03, E03-S02, S03, S05, S06, E05-S01). The mapping line in `AGENTS.md`: "`requireSession` plus `requireRole` is now `access`".

## 📝 Data Model

None. This spec adds no entity and no migration. Persistent shapes (`users` in the auth spec; slots, bookings, notes later) belong to their concepts.

## 📝 API Contracts

- New error codes (additive): `SERVICE_UNAVAILABLE` (503, A1), `RATE_LIMITED` (429, `Retry-After` header from `retryAfterSeconds`, S02). The envelope `{ ok, data | error }` is otherwise unchanged until `details` arrives with E03-S05. `ValidationError` stays 400 (stories disagree between 400 and 422; the existing contract wins and the story texts that say 422 are corrected).
- `apiHandler` and `makeCrudRoute` signatures change as described (internal, one caller: `api/mentors/route.ts`).
- A denied request keeps today's codes: 401 without a valid session, 403 for the wrong role or a missing CSRF header.

## 📝 UI/UX

Only what is unique: the shared form layer has defined states: idle, submitting (submit disabled), field errors under each field, one form-level error region announced with `role="alert"`, Ctrl/Cmd+Enter submits, Escape cancels. The public skin adds the "Saving…" label and focus on the first invalid field. Tailwind has no preflight, so buttons, labels and inputs set their own resets (`.ai/lessons/2026-10-19-tailwind-without-preflight.md`).

## 📝 Edge Cases & Failure Scenarios

- Valid signature, unknown role claim, or a token with a `purpose` claim: rejected as an invalid session (401).
- A `public` page or route with a malformed or expired cookie, or a cookie and no configured secret: anonymous. A guarded page redirects to sign-in. Neither shows the previous user's data.
- `requireConfig` missing a variable: 503 with names only; a navigation route redirects to a plain "temporarily unavailable" state through `navigation`, not a stack.
- Rate-limit memory is lost on restart and not shared across instances (accepted for 1.0, Q6). At the key cap new keys are refused, existing keys keep working.
- `redirect()` inside a guarded page happens before any data fetch and stays a 307 because no `loading.tsx` or `Suspense` sits above it (asserted with `redirect: "manual"`).
- Contract test false negatives: a route built through a wrapper the test does not recognise. The typed `access` field is the primary control.
- A 401 from a sign-in or registration call is rendered by the form, not redirected (`onUnauthorized: "ignore"`).

## 📝 Risks & Impact Review

- **Signature change** of `apiHandler` and `makeCrudRoute`, removal of `authorize`, `requireRole` and the `requireSession` export: breaking for any unmerged branch; no external consumers. Because the change touches the auth path, phases A1 and A2 carry `risk-high`, `needs-qa`, a second reviewer (`SDLC.md`). `BACKWARD_COMPATIBILITY.md` rows touched: "Session cookie and JWT" (`Session.role`, `verifySession`), "HTTP API routes" (access on every route), "Environment variables and config" (all new variables optional), "Package public exports". The PR body lists the breaking changes.
- **Behavior change**: a missing `JWT_SECRET` moves from 500 to 503 on guarded routes; public routes are unaffected.
- **CrudForm refactor risk**: the existing `CrudForm` tests are the safety net and must pass unchanged before and after the extraction (own PR).
- **Single-instance assumption (Q6)**: horizontal scaling silently weakens rate limiting. Mitigation: documented in the adapter and `README.md`; the port makes the swap local.
- **Known gap stays visible until auth ships**: the mentors route is declared `access: "public"` and `/admin/mentors` stays as it is, both on the contract test's named exception list with a comment pointing at E01-S03; closing them earlier would lock the only admin page before anyone can sign in.
- **Catalogue drift**: a contract nobody builds for months can go stale. Mitigation: the authority rule above, and each first consumer re-reads its row.
- **Standing document**: `AGENTS.md` allows one standing document today; phase A3 adds this one (with its fixed name) to the exception.
- Rollback: each phase is an independent commit range; reverting restores the previous signatures with no data change.

### Assumptions taken as defaults (non-blocking, confirm in review, owner founder A)

- Fee rounding (floor, odd cent to the mentor) and the `owedToMentor` derivation (⚠ D11, D30, protected).
- `TRUST_PROXY_HOPS` default 0 (no IP; per-subject keys only) with a production warning when unset.
- The test-only switch name `ALLOW_INSECURE_HTTP` and its error log when it meets an https `APP_URL`.
- `ui/src/frontend/` as the home for Tailwind public and mentee/mentor primitives.
- One webhook route with a handler registry rather than one route per event family.

## 📝 Decisions in play

Business rules and decisions this spec relies on: R03 (text notice), R22 and D30 (owed amount), D29 (EUR), D11 (fee), R23 and D31 (one role per account, `Role`), D19 (operator by allowlist), R24 and D32 (channel visible to the two parties), R02 and N02. It supersedes none. `engineering-standards.md` says "no RBAC": consistent, since `Access` is role equality, not a permission engine. Owner for any change to these: founder A (founders A and B for D19).

## 📋 Phasing

1. **Phase A0, spike:** MikroORM transaction, partial unique index and row lock (outcome recorded here and in a lesson). Before E02-S01; not on the auth path.
2. **Phase A1, config and vocabulary:** `requireConfig`, `ALLOW_INSECURE_HTTP`, `ServiceUnavailableError`, `Role`, `verifySession` hardening.
3. **Phase A2, access policy:** `Access`, `enforceAccess`, `apiHandler` (`access`, `navigation`), `makeCrudRoute`; the consumers are every route through `apiHandler` and the mentors route.
4. **Phase A3, contract test and docs:** `access-contract.test.ts` with its exception list, `AGENTS.md`, `engineering-standards.md`, the issue-text edits.
5. **Phase B2a, form core:** headless `useFormCore`, `CrudForm` on it (own pull request, before auth S02).
6. **Inside auth S01a:** `absoluteUrl`, purpose tokens, `safeReturnTo`, test kit core, migration helper, `runConcurrently`.
7. **Inside auth S01b:** `guardedPage`, `publicPage`, `homeFor`, session reader, `RoleShell`, `navFor`, `apiCall` option, response headers.
8. **Inside auth S02:** `TooManyRequestsError`, rate limiter, mailer, `selectAdapter`, `PublicForm`.

A1 to A3 and B2a each merge independently and leave the app working. Every primitive has a caller in the pull request that adds it or in code already on `main`.

## 📋 Implementation Plan

### Phase A0: spike
1. On a throwaway branch: generate a partial unique index through `migration:create`, take a row lock, run a transaction-bound repository factory against a throwaway database. Record the result in "Persistence recipes" and in `.ai/lessons/`; if the generator cannot express the index, record the compliant alternative.

### Phase A1: config and vocabulary
2. Add `ServiceUnavailableError` (503, `SERVICE_UNAVAILABLE`) to `core/src/http/errors.ts`; extend `ErrorCode`; export from `core/src/index.ts`. Unit tests for status and code.
3. `requireConfig(keys)` (reads `process.env` by name); `requireJwtSecret` uses it. `ALLOW_INSECURE_HTTP` in `envSchema` with `isInsecureHttpAllowed()` (logs an error with an https `APP_URL`). Tests: present, missing, names-only message, the flag and the error log. Document `JWT_SECRET` and the flag in `.env.example` and `README.md`.
4. `Role`, `isRole`; narrow `Session.role`; `verifySession` rejects unknown roles and any `purpose` claim. Tests for both.

### Phase A2: access policy
5. `core/src/http/access.ts`: `Access`, `enforceAccess` (lazy secret, public never needs it); delete `requireRole`, stop exporting `requireSession`; update `core/src/index.test.ts`. Tests: public with no cookie and no secret, with a valid, tampered and secretless cookie; authenticated; role allowed and denied.
6. `apiHandler` takes `access`, passes `session`, and takes `navigation`; `makeCrudRoute` takes a single `access`, puts `session` in the context, removes `authorize`, keeps 405 first and CSRF before access. Update both test files (add: `navigation` redirect, no per-route `try/catch`). Declare `access: "public"` in `api/mentors/route.ts` with a comment pointing at E01-S03. The pull request is labelled `risk-high`.

### Phase A3: contract test and docs
7. `access-contract.test.ts` (string fixtures, the `typescript` API, the path rule, the dated exception list for `app/admin/mentors/page.tsx` and `app/api/mentors/route.ts`), proving it fails for an undeclared route and handles aliases and wrappers.
8. `AGENTS.md`: the access rule, the ports pattern with the adapter selection rule, the mapping "`requireSession` plus `requireRole` is now `access`", this document as the catalogue and as a second standing document with its fixed name, the pointer from "Known gap". `engineering-standards.md`: replace `requireRole` and `(student)` with `access` and `(mentee)`, and record the `ALLOW_INSECURE_HTTP` exception to "`secure` in production". Edit the issue bodies listed under "Issue texts superseded". `README.md` route table. Lesson file if a gotcha appears.
9. Gate: `npm run lint`, `typecheck`, `test:coverage` (100%), `build`, `test:integration`; breaking-change note and the 405-before-CSRF note in the PR body.

### Phase B2a: form core (own pull request)
10. Extract `useFormCore` with only the behavior `CrudForm` has today; rebuild `CrudForm` on it with its existing tests untouched and green before and after. No new consumer and no new options.

### Inside auth S01a (listed here because this spec owns the design)
11. Test kit core: `global-setup.ts` (port reserved first, always-on fake server with control API, env including `ALLOW_INSECURE_HTTP`), `identity.ts`, `browser.ts`, `concurrency.ts`, `migrations.ts`.
12. `absoluteUrl`; `signPurposeToken` and `verifyPurposeToken` in `core/src/http/tokens.ts`; `safeReturnTo` in `core/src/validators/auth/`. Tests: https refused in production unless the flag, a session token is rejected as a purpose token and the reverse, tampering, expiry, `safeReturnTo` cases.

### Inside auth S01b
13. `guardedPage`, `publicPage`, `homeFor`, the session reader (tests with mocked `next/headers` and `next/navigation`, page tests render the inner component); `RoleShell` and `navFor`; `apiCall` `onUnauthorized` option; `headers()` in `next.config.ts` with an integration test for the headers. Extend the contract test: the page rules apply and the exception list loses nothing it should keep.

### Inside auth S02
14. `TooManyRequestsError` and `Retry-After` mapping; `RateLimiterPort` and memory adapter (bounded, refuses new keys at the cap, `globalThis`), `enforceRateLimit`; `MailerPort`, log adapter, `selectAdapter`; `TRUST_PROXY_HOPS` and `MAILER_TRANSPORT` in `envSchema`. Unit tests for window, key isolation, per-IP limit across many subjects, no-IP case with the e-mail-only login key, header-injection (a client-supplied header cannot choose a fresh bucket), bounded size and cap behavior, two module copies sharing state, and each mailer and selector combination. Registered in `container.ts` and `Cradle` (one line each). Row in the `AGENTS.md` placement table for `ui/src/frontend/`.
15. `PublicForm` in `ui/src/frontend/forms/` with the field union and the per-skin renderer map plus its coverage test. Export from `ui/src/index.ts`; confirm client bundles import schemas only through `@devmentor/core/validators`.
