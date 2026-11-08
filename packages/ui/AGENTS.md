# UI package guidance

- UI is presentational and imports no project-internal packages, app code, Next.js or core/db.
- Add shadcn primitives with `npx shadcn@latest add <component>` from `packages/ui`; primitives live in `src/components/ui/`.
- Reusable backend panels live in `src/backend/<category>/`; concept components in `src/components/<concept>/`; single-page components stay beside the page.
- Public/marketing pages use Tailwind. Signed-in and admin surfaces use shadcn components inside `AppShell`.
- Read `.storybook/Guidelines.mdx` before composing screens. Preserve the approved button order, typography, chip semantics and accessible text labels for technology icons.
- Test client components with Testing Library and jsdom. Run relevant UI tests, Storybook checks and `npm run build-storybook` when applicable.
