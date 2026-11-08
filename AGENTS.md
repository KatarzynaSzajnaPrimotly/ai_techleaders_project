# DevMentor agent guide

DevMentor is an npm-workspaces monorepo: Next.js 16, React 19, TypeScript, PostgreSQL, MikroORM, Awilix, Tailwind and shadcn/ui. Follow package boundaries: `app` wires `core`, `db` and `ui`; `core` contains domain logic; `db` persists it; `ui` is presentational.

## Hard rules

- Read `.ai/lessons.md` before related work. For nontrivial changes, check `.ai/specs/` and write a dated spec if none covers the task.
- Keep changes local unless the user explicitly authorizes a remote write. Never commit secrets or session materials.
- Preserve existing public contracts. Use UUIDs, typed errors, Zod validation and request-scoped DI. Never log credentials, use `any`, raw `/api/*` fetches, direct `process.env` reads under `packages/`, or hand-written route error envelopes.
- State-changing API routes require `x-devmentor-request`; all routes use shared API helpers and server-side access checks.
- Add unit tests for changed behavior and integration tests across route/database/browser boundaries. Consult package instructions for the full coverage gate.
- Run the repository checks relevant to the change. Commands are in `package.json` and CI.
- Keep specs, runs and lessons under `.ai/` with the documented date naming; never edit implemented/archive specs.

## Task routing

| Task | Read |
|---|---|
| Bug fix or feature | `.ai/specs/engineering-standards.md` |
| App routes, pages, auth, DI, Next.js | `packages/app/AGENTS.md` |
| Domain services, validators, events | `packages/core/AGENTS.md` |
| Entities, migrations, repositories | `packages/db/AGENTS.md` |
| Components, styling, Storybook | `packages/ui/AGENTS.md` |
| Database/API integration tests | `packages/app/AGENTS.md` |
| Review | `CODE_REVIEW.md` |

If a routed file is absent, report that gap and use the nearest package guidance. Do not infer new architecture; check `.ai/specs/` first.
