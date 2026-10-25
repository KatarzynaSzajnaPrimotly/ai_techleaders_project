# Run: clickable prototype of Epic 01 (accounts and roles)

## Asked
Build a clickable prototype of Epic 01 from the approved screen map (`lekcja-07/mapa-ekranow.md`), in stages 0 to 3, with a stop after each stage. Output in `prototypes/konta-i-role/`; progress in its `POSTEP.md`.

## Done
- Stage 0 (plan), stage 1 (skeleton, happy path, access gates) and stage 2 (all 54 states, roles, scenario panel P01 to P10) finished on 2026-10-24. Stage 3 (honesty and final check) has not started and waits for "dalej".
- 2026-10-25 resume: rebuilt, `tsc` on the prototype, `npm run lint` (0 errors, 2 pre-existing warnings) and `npm run typecheck` pass; opened `index.html` over `file://` in agent-browser (title and 3 forms render). The full 122-check run is the stage 2 log in `_src/evidence/stage2/`.

## Files
- `prototypes/konta-i-role/` (sources in `_src/`, evidence, `POSTEP.md`); build output `index.html` and `assets/` is git-ignored.
- `lekcja-07/` (course inputs: prompts, review engine), `.ai/prototypes/discovery/mentor-onboarding/revision-001/` (grey prototype).
- `.gitignore`, `eslint.config.mjs` (`prototypes/**` ignored), lesson `2026-10-24-prototype-all-screens-in-dom-and-file-protocol.md`.

## Decisions
See `POSTEP.md` (stage 0 answers; deviations from the map listed under stage 2, awaiting confirmation).

## Follow-ups
- Stage 3 and the owner's confirmation of the stage 2 deviations and placeholder texts.
- Not committed on purpose: the lesson zips, `ai-techleaders-project-after-lesson-06/`, `full-backlog.md`.
- Sandbox: Chrome needs `LD_LIBRARY_PATH=/tmp/chromelibs/usr/lib/x86_64-linux-gnu:/tmp/chromelibs/lib/x86_64-linux-gnu` and `AGENT_BROWSER_ARGS=--no-sandbox`.
