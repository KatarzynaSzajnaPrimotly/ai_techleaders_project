# Local mock auth mode

## Request

Implement the local role sign-in flow shown in the user's screenshot: deterministic mentee, mentor, and operator sign-in without real GitHub credentials.

## Plan and decisions

- Inspect the auth architecture and preserve the existing OAuth callback, session issuance, and role authorization.
- Require both `AUTH_IDENTITY_ADAPTER=mock` and `INTEGRATION_TEST_RUN=1`; reject production. Support screenshot's `SESSION_SECRET` while retaining `JWT_SECRET` compatibility.
- Document exact setup, add regression coverage, and run the available validation gate.

## Done

- Added a deterministic mock GitHub identity adapter for mentee, mentor, and operator users. Mock role selection enters through `/api/auth/github?login=mock-<role>` and continues through the normal signed OAuth state, callback, account, session, and guards.
- Mock mode requires both explicit flags, refuses production, and is checked as Next loads `next.config.ts`. The operator remains controlled by `OPERATOR_EMAILS`.
- The sign-in screen shows the local role links and an e-mail-disabled note only in mock mode; normal sign-in remains unchanged.
- Added `SESSION_SECRET` support as an alias while preserving `JWT_SECRET`; documented setup in `.env.example` and `README.md`.
- Added a README URL/expected-results table for the local role walkthrough at the user's request.
- Added unit tests for environment gates, adapter identities, sign-in rendering, route redirects, callback role grant, and container selection. Added a production integration test asserting mock identities are refused.

## Files touched

- `.ai/specs/2026-10-30-local-mock-auth.md`
- `.env.example`, `README.md`, `packages/core/package.json`
- `packages/app/next.config.ts`, sign-in page/view and tests, GitHub routes and tests, server container and test
- `packages/core/src/config/*`, core index and test, new mock identity adapter and test
- `tests/integration/roles.int.test.ts`

Pre-existing worktree modifications to notifications, migration snapshot, `.gitignore`, and unrelated untracked files were left untouched.

## Evidence

- `npx eslint <all changed source and test paths>` passed.
- `npm run typecheck` passed.
- `npm run test:coverage` passed: 100% statements, branches, functions, and lines (767 unit tests).
- `NODE_ENV=production npm run build` passed.
- `AUTH_IDENTITY_ADAPTER=mock npm run dev -w @devmentor/app -- --port 3101` failed during Next config loading with `Invalid environment variables: AUTH_IDENTITY_ADAPTER`, confirming the incomplete two-signal configuration is rejected.
- Full `npm run lint` failed on pre-existing generated Storybook assets and the unrelated `ai-techleaders-project-after-lesson-06/` directory; changed source/test files pass targeted lint.
- `npm run test:integration` could not initialize because this sandbox has no working container runtime. The production refusal integration case was added but could not run here.

## Follow-ups

To see the walkthrough in this sandbox, add `SESSION_SECRET` (32+ random characters), `OPERATOR_EMAILS=mock-operator@devmentor.test`, `AUTH_IDENTITY_ADAPTER=mock`, and `INTEGRATION_TEST_RUN=1` to `packages/app/.env.local`, then restart the preview. The local `.env.local` was not modified because it contains untracked secrets/configuration.
