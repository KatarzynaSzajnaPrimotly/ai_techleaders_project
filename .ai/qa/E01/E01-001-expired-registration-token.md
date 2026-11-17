# E01-001 — Expired registration token is rejected

- **Priority:** High
- **Type:** API integration
- **Purpose:** Verify that registration-token expiry prevents account creation and session issuance.
- **Prerequisites:** Integration app and isolated PostgreSQL database; no account exists for the target email.
- **Implementation:** [Expired registration token integration test](../../../tests/integration/auth-password-routes.int.test.ts#L88)

## Scenario (Given–When–Then)

**Given** a registration token whose lifetime has elapsed and no account for its email,  
**when** the client submits the token and a valid password to confirmation,  
**then** the API returns `401 UNAUTHORIZED`, issues no session cookie, and creates no account.

## Fixture and cleanup

Mint a purpose-bound registration token with a negative lifetime and query the isolated database for the target email. The integration harness resets its database between files.

## Expected result

The expired token cannot be used to register or sign in. This assertion is exercised by the linked TypeScript test.
