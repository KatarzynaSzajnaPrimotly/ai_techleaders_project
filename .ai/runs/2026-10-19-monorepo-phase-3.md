# Run: monorepo migration, phase 3 (styling)

Spec: `.ai/specs/implemented/2026-10-19-monorepo-migration.md`

## Done
- Tailwind CSS 4 in `app` (`@tailwindcss/postcss`, `postcss.config.mjs`); `globals.css` imports theme and utilities
  only (no preflight) so the starter home page is unchanged, `@source` covers `packages/ui`, and design tokens are
  mapped into the Tailwind theme and shared with shadcn/ui. Starter-only `main`/`h1`/`code` rules scoped to `.starter`.
  Removed the unused `page.module.css`.
- shadcn/ui-style components (Button, Card, Badge, Table, `cn` helper) added to `packages/ui` by hand
  (class-variance-authority, clsx, tailwind-merge, @radix-ui/react-slot), plus a Tailwind `MentorCard`.
- Public Tailwind page `/mentors`; shadcn/ui admin page `/admin/mentors`; both read via the Awilix container.
- Fixed a cross-route bug (see lesson `2026-10-19-nextjs-duplicate-package-copies.md`): repository now references
  the entity by name.

## Checks
- lint, typecheck, `NODE_ENV=production npm run build`: pass.
- Production server, three request orders (POST first, admin page first, API first): `/`, `/mentors`,
  `/admin/mentors`, `/api/mentors` all 200, no errors in logs; generated CSS contains utilities from `packages/ui`.
- Not verified visually in a browser (no browser tooling used).
