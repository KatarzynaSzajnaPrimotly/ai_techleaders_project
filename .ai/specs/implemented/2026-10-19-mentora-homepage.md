# Mentora homepage at `/`

Problem: the repo's `/` still shows the Next.js starter. The user's concept prototype
(`mentoring-portal-concept/mockups/index.html`, branded "Mentora") should be the homepage.

## Scope

Port the prototype's **home screen only** (header, hero with search and subject chips, stats, featured tutors,
"How it works", footer) to React + Tailwind, following the package boundaries:

- `core`: `catalog.ts` with the `Tutor` type, `SUBJECTS` and `FEATURED_TUTORS` (mock data copied from the prototype,
  to be replaced by a backend later).
- `ui`: `SiteHeader`, `SiteFooter`, `SearchBar`, `TutorCard` (plain `<a>`, no framework imports).
- `app`: `src/app/page.tsx` composes them; the Mentora palette lives in `globals.css` as `--color-mentora-*` theme tokens.

## Decisions

- Out of scope: the other 21 prototype pages and the simulated auth. Controls that need them (log in / sign up,
  favourites, "View profile", become a tutor) are omitted instead of rendered dead. Links only target existing routes (`/mentors`).
- Search and subject chips are plain GET links/forms to `/mentors?subject=...`; `/mentors` ignores the parameter for now.
- Brand stays "Mentora" as in the prototype (AGENTS.md calls the product DevMentor; the brand is passed as a prop).
- The root layout and `Backdrop` are untouched; the page sets its own `metadata`.

## Acceptance

- `/` renders the Mentora home screen; unit coverage stays 100%; lint, typecheck and build pass; integration test for `/` updated.

## Update 2026-10-19 (owner instruction)

The product is called **DevMentor**, not Mentora. Brand text on the home page (title, header, footer) was changed accordingly.
The `--color-mentora-*` palette tokens and `mentora-*` utility names are internal and unchanged until the owner's new
mockups replace this design.
