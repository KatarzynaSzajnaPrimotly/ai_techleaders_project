# Local mock sign-in for role verification

## Problem

The role-auth walkthrough expects deterministic local sign-in as a mentee, mentor, or allowlisted operator. The app currently starts the real GitHub OAuth flow and its sign-in page always offers e-mail/password, so the walkthrough cannot be reproduced without GitHub credentials.

## Approach

Add an explicitly selected mock GitHub identity adapter and local role shortcuts at `/api/auth/github?login=mock-<role>`. Keep the existing OAuth callback, account creation, session issuance, and role guards in the path. Mock mode requires both `AUTH_IDENTITY_ADAPTER=mock` and `INTEGRATION_TEST_RUN=1`, rejects production, and is validated when Next starts. Accept `SESSION_SECRET` as a compatibility alias for the existing `JWT_SECRET`; the operator remains derived exclusively from `OPERATOR_EMAILS`. In mock mode, the sign-in page exposes local role links and replaces the e-mail form with an explanatory note.

## Acceptance criteria

- Default configuration keeps real GitHub OAuth and e-mail/password behavior unchanged.
- Mock mode boots only with both explicit flags in development/test and refuses production or a missing/mismatched flag.
- Local links sign in deterministic mentee, mentor, and operator accounts through normal callback/session code; operator access still depends on `OPERATOR_EMAILS`.
- E-mail sign-in is visibly disabled in mock mode with a note.
- Unit and integration coverage exercises configuration gates, role paths, and protected routes.
- `.env.example` documents the safe local setup without secrets.
