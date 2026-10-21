# Run: architectural review and revision of the auth and platform-foundations specs

Specs: `.ai/specs/2026-10-21-auth.md` (E01, #29) and `.ai/specs/platform-foundations.md` (standing document).

## Asked
Write a spec for issue #36 that also designs the backend and frontend primitives the whole backlog will need. The two specs already existed on `docs/devmentor-discovery` (commits f925af8, c0c75ad, written by an earlier session); the request became an architectural review followed by a revision.

## Done
- Two independent fresh-context reviews: one verified every claim against the repository and the bundled Next 16 docs (40 findings), one checked coverage of the backlog's needs and the Q2 decision (25 findings, 37-row capability matrix). I verified two findings in the code myself (`logger.ts:13` parses env at import; `auth.ts:45` reads the secret before the cookie).
- Decisions by founder A: registration creates the account when the e-mail link is confirmed (Q8); the styling boundary stays as in `AGENTS.md` (Q9); the spec set is revised rather than rewritten from scratch.
- Revision: foundations became a standing document with three tiers (built now, decided now, deferred), a spike A0, and decided contracts for persistence recipes, visibility, money, rules and time, notifications, events, audit, payments, tokens, role shell and client contract; auth was split into S01a, S01b, S02, S03 with registration at confirmation.
- A third fresh-context review of the revision found four new High items (apiCall 401 redirect, https guard versus the harness, per-route try/catch, an unscheduled test-only switch); all were fixed (`onUnauthorized`, `ALLOW_INSECURE_HTTP`, `navigation` option on `apiHandler`) together with the notable Mediums.

## Not verified
- No code exists for these specs; nothing was linted, built or tested.
- MikroORM partial unique index and transaction behaviour (spike A0 pending), Stripe idempotency scoping, GitHub OAuth details, bcryptjs in the Next 16 bundle, a `Secure` cookie over http in the harness, `headers()` setting `Cache-Control` on dynamic pages: recalled or read from docs, not run.
- The fourth review round was not run on the final text.

## Open for a human
- Fee rounding (floor, odd cent to the mentor) and the owed-amount derivation (D11, D30) are defaults to confirm.
- Issue bodies naming deleted APIs (about thirteen) and #36 to #38 need editing; the list is in the foundations spec.
- Spike A0 result, brief Q22 closure and the `AGENTS.md` standing-document exception are scheduled in the specs, not done.
