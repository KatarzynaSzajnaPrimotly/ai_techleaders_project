# Storybook technical notes

- Product name shown in Storybook: DevMentor.
- Component base selected in the supplied exercise prompt: shadcn/ui on Radix.
- Runtime framework: Storybook React with Vite, isolated in `@devmentor/ui`.
- `@storybook/addon-vitest` runs stories in a real browser using Vitest and Playwright. The browser project config is in `../vitest.storybook.config.ts`.
- The legacy variables in `src/tokens.css` remain unchanged under accepted decision P-TOKEN.1. Approved light/dark semantic values are layered in `src/design-system-tokens.css` and consumed by Storybook. The toolbar writes `data-theme` and `color-scheme` on the document root so portal content inherits the selected theme.
- Tailwind v4 is connected through the Vite plugin. CSS imports the existing theme and utility layers without Tailwind preflight, matching the application setup.
- `lucide-react` is the approved icon set. No font is loaded from a CDN; typography uses system font stacks.
- `scripts/check-design-tokens.mjs` scans package sources and Storybook stories for color literals, palette classes, and arbitrary Tailwind values. Existing violations are listed in `design-system/POSTEP.md` and still need an approved migration.
- `scripts/test-storybook-themes.mjs` runs Storybook stories once per theme using `VITE_STORYBOOK_THEME`.
