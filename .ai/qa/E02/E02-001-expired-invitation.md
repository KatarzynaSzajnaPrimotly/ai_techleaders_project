# E02-001 — Expired invitation cannot grant mentor access

- **Priority:** High
- **Type:** API integration
- **Purpose:** Verify the invitation expiry boundary protects the one self-service mentor-role grant.
- **Prerequisites:** Integration app and isolated PostgreSQL database; a signed-in mentee account and an invitation with an elapsed expiry.
- **Implementation:** [Expired invitation integration test](../../../tests/integration/invitations.int.test.ts#L81)

## Scenario (Given–When–Then)

**Given** a mentee and an invitation whose expiry is in the past,  
**when** the client looks up and attempts to accept the invitation,  
**then** both routes return `404`, no session is issued, and the account keeps only its mentee role with no mentor profile.

## Fixture and cleanup

Create a unique mentee and seed an invitation with a fixed past expiry in the isolated database. The integration harness resets its database between files.

## Expected result

An expired link is indistinguishable from an unknown link at the API boundary and cannot grant a role. The linked test exercises lookup, acceptance and persisted account state.
