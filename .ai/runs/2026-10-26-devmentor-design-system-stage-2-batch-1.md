# DevMentor design system — Stage 2, batch 1

- **Asked:** Continue the DevMentor design-system work with Stage 2.
- **Done:** Migrated Button, Badge, Card, and Table to accepted semantic tokens; added Input and Textarea primitives; added six instructional Storybook stories; exposed Input and Textarea from the UI package entrypoint; mapped tokenized line-height, duration, and reading-width utilities.
- **Files touched for this batch:** `packages/ui/src/components/ui/{button,badge,card,table,input,textarea,primitives.stories}.tsx`, `packages/ui/src/design-system-tokens.css`, `packages/ui/src/index.ts`, and `packages/ui/design-system/POSTEP.md`.
- **Decisions:** Kept existing APIs for Button, Badge, Card, and Table. Added text labels to status variants; examples use native input types and associated validation text. Work is limited to the first batch of six base components.
- **Verification:** UI package typecheck, Storybook typecheck, Storybook production build, and `git diff --check` passed. Storybook indexed all six stories. Build retains large-chunk and `lucide-react` `use client` warnings, and notes no `.storybook/*.mdx` matches; TSX stories build successfully.
- **Not run:** Unit/story tests, lint, or browser checks.
- **Follow-up:** Continue Stage 2 with base controls and overlays; verify interactions, keyboard behavior, and both themes during the planned browser stage.
