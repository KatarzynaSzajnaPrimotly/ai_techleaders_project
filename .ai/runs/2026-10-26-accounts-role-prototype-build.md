# Epik 01 prototype build

- Asked: build the clickable accounts-and-roles prototype for the Storybook preview at `/prototypes/konta-i-role/index.html`, using the approved screen map, design system, review engine and current mentor-onboarding prototype only for invitation/sign-in context.
- Spec selected: `.ai/specs/2026-10-21-auth.md`; the requested 2026-09-04 spec file is absent, and the screen map independently selects this spec with `.ai/specs/platform-foundations.md`.
- Done: built the existing Vite prototype into `packages/ui/.storybook/public/prototypes/konta-i-role/`; documented the new output directory and preview URL in `prototypes/konta-i-role/README.md`.
- Fix: restored the `ScenarioPanel.tsx` first-line React import after the source had a malformed `/clear/import` prefix. The rest of the source was left intact.
- Verification: Vite build passed; `npx tsc -p prototypes/konta-i-role/_src/tsconfig.json` passed; the documented navigation suite passed (18/18); Storybook served the HTML, JS and CSS with HTTP 200; agent-browser smoke test reached sign-in, simulated GitHub consent and the mentee home. Browser session closed. Build emitted non-fatal Vite/Rolldown warnings about `__dirname`, module directives and bundle size.
- Output under `packages/ui/.storybook/public/prototypes/` is ignored by Git and is a local build artifact. No commit was made.
- Open: only the GitHub sign-in happy path was rechecked in this run; the source README records broader prior checks and limitations.
