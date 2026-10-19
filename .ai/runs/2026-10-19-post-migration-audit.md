# Run: audit of earlier prompts and follow-up hardening

No separate spec: small items scoped by the user's request to check and implement anything still missing.

## Audit
Compared the state of the repo with every earlier prompt (`.ai` structure and naming, AGENTS.md/CLAUDE.md, working
principles, stack, monorepo, README). All requested items exist. Gaps found against "agents must keep to these
assumptions" and "most recent versions":
- Package dependency rules were only prose. Added ESLint `no-restricted-imports` boundaries (verified by adding
  temporary violating imports in core, ui and db: all rejected; allowed db -> core passes; temp files removed).
- No `.env.example`. Added (with a `.gitignore` exception) and documented what actually reads env files.
- Next 16.3.4 / React 19.2.8 were not the latest. Upgraded to Next 16.4.2, React and react-dom 19.3.1,
  eslint-config-next 16.4.2, TypeScript 6.0.3 (TypeScript 7 blocked by typescript-eslint, see lesson).
  Needed `"types": ["node"]` in `tsconfig.base.json`.

## Verification (clean copy, fresh `npm ci`)
- lint, typecheck, `npm test` (4/4), `NODE_ENV=production npm run build`: pass. Migration on a new database: pass.
- Prod server in three request orders and the dev server: all routes 200, POST 201/400/409, no log errors.
- The preview on port 3000 was left stale by the upgrade (500s); restarted with `pm2 restart workspace-preview`,
  now 200 on all routes with Next 16.4.2.

## Open items (not implemented, need a decision)
- `/admin/mentors` and `POST /api/mentors` have no authentication or authorization.
- `mentoring-portal-concept/` (brand "Mentora", full screen specs and mockups) is not implemented; the app is
  still a one-entity (Mentor) skeleton. Brand name differs from "DevMentor".
