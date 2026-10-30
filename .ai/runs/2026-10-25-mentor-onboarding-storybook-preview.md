# Mentor onboarding prototype: saved state

- Asked: prepare a gray preview of the mentor-onboarding discovery prototype in Storybook, then check the project and continue from `.ai/specs/product-brief.md`.
- Source reviewed: `.ai/prototypes/discovery/mentor-onboarding/revision-001/`. Its README describes the E02-S01–S04 flow, confirmed simulation boundary, open assumptions, and previous browser verification.
- Copied the complete source folder to `packages/ui/.storybook/public/prototypes/szary/`; `diff -qr` found no differences. This path is ignored by Git as requested, so the local copy does not appear in `git status`.
- Added `/packages/ui/.storybook/public/prototypes/` to `.gitignore`.
- Added `packages/ui/.storybook/public/prototypes/**` and `**/lekcja-07/**` to ESLint `globalIgnores`.
- Blocker: in the active checkout, `packages/ui/.storybook/` did not exist, and the root project has no Storybook dependency or script. No `main.*` config was created, so Storybook cannot yet serve the copied prototype. An unrelated imported lesson folder contains a Storybook config; it was inspected only as a reference and left untouched.
- No tests were run.
- Existing user changes to preserve: `prototypes/konta-i-role/_src/src/ScenarioPanel.tsx`, `ai-techleaders-project-after-lesson-06.zip`, `ai-techleaders-project-after-lesson-06/`, `full-backlog.md`, and `lekcja-06-cwiczenia.zip`.
- At the time of this note, tracked changes from this task are `.gitignore` and `eslint.config.mjs`; the prototype copy is present locally but Git-ignored.
- Next step: decide whether to add/configure Storybook for `packages/ui` (including its required dependencies and scripts), or to use an existing Storybook setup elsewhere. Then add `staticDirs: ['./public']` to the chosen `main.*` config and open `/prototypes/szary/index.html` through Storybook.
