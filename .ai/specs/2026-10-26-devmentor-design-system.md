# DevMentor design system and Storybook

## Problem

Developers, AI agents, and designers need one source of truth to build and review DevMentor screens. Storybook must explain component choice, composition, tokens, states, and constraints, using product brief, backlog, and exercise references as evidence.

## Approach

Build the system in `packages/ui`, with Storybook under `packages/ui/.storybook`. Preserve existing component and token files until a specific migration is approved. Use Storybook 10 with React/Vite, Docs, a11y, Vitest interaction support, MDX GFM, MSW, Tailwind 4, Lucide React, semantic CSS tokens, and light/dark themes. Capture all progress and user-approved decisions in `packages/ui/design-system/POSTEP.md`.

## Acceptance criteria

- Follow the user's staged workflow and stop after each stage.
- Every new style value is tokenized, every semantic token cites its source, and old system files are not overwritten without approval.
- Storybook has instructional pages and real package components in stories.
- Accessibility checks fail the story test suite; theme tests run in light and dark.
- Documentation reflects actual backlog screens and states, and calls out unsupported or missing material.
- Final verification reports only checks actually run and records any remaining token, accessibility, responsive, or interaction gaps.

## Current status

Stage 0 inventory and Stage 1 foundations are complete. Stage 2 is in progress: batch 1 migrated Button, Badge, Card, and Table to the accepted semantic tokens and added Input and Textarea with six Storybook stories. UI and Storybook typechecks and the Storybook production build pass. The original `tokens.css` and components outside this batch remain unchanged. Continue Stage 2 in further batches before moving to Stage 3.
