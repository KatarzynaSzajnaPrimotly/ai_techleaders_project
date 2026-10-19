# Run: Mentora homepage at `/`

Asked: "Build the website I created and show it on the homepage at /. Update src/app/page.tsx."

The website is the concept prototype in `mentoring-portal-concept/mockups`. The repo is a monorepo now, so
`src/app/page.tsx` is `packages/app/src/app/page.tsx`. Spec: `.ai/specs/implemented/2026-10-19-mentora-homepage.md`.

## Done

- `core`: `catalog.ts` (`Tutor`, `SUBJECTS`, `FEATURED_TUTORS`) + test, exported from the index.
- `ui`: `SiteHeader`, `SiteFooter`, `SearchBar`, `TutorCard` + tests, exported from the index (and its test).
- `app`: new `page.tsx` (hero, search, subject chips, stats, featured tutors, how it works) + test; `--color-mentora-*`
  theme tokens in `globals.css`; the integration test for `/` now checks the Mentora page.
- Verified: `npm run lint`, `typecheck`, `test:coverage` (100%), `NODE_ENV=production npm run build`,
  `test:integration` (9 passed, external PostgreSQL, Chrome via agent-browser), screenshot of `/` at 1280px.

## Decisions / follow-ups

- Only the home screen is ported; the other 21 prototype pages and the simulated login are not. Log in / sign up,
  favourites and "View profile" are left out rather than shown dead. Search and chips go to `/mentors?subject=...`,
  which ignores the filter for now.
- Brand is "Mentora" (prototype) while AGENTS.md names the product DevMentor; one prop/constant to change.
- `Backdrop` and the `.starter` CSS are now unused by the app; removing them is a separate cleanup.
- Not checked: mobile layout in a real browser (Tailwind breakpoints only), emoji glyphs (sandbox has no emoji font).
