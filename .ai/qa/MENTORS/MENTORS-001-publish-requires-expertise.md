# MENTORS-001 — Mentor must select an expertise before publishing

- **Priority:** High
- **Type:** UI integration
- **Purpose:** Ensure a signed-in mentor cannot publish a profile while no expertise technology is selected.
- **Prerequisites:** A new mentor account with an empty profile; a live integration app and isolated PostgreSQL fixture.
- **Implementation:** [mentor profile integration test](../../../tests/integration/mentor-profile.int.test.ts#L23)

## Scenario (Given–When–Then)

**Given** a mentor is signed in and opens “Edit your mentor page” with no expertise selected  
**When** they choose “Publish page”  
**Then** publishing is rejected with the expertise validation message and no share link is created.

## Fixture and cleanup

Create a unique mentor and empty profile for the test. Delete the mentor in `finally` so its profile is removed with it; close the browser session in the same cleanup path.

## Expected result

The page remains unpublished and displays “Choose at least one area of expertise”; no share link is shown.
