# Dependency upgrades: TypeScript 6/7, Next preview

- TypeScript 7 is not usable yet: `typescript-eslint` (latest 8.71.x) declares `typescript <6.1.0`. We pin `~6.0.3`.
  Re-check `npm view typescript-eslint peerDependencies.typescript` before bumping.
- TypeScript 6 no longer auto-includes every `@types/*` package: add `"types": ["node"]` (done in
  `tsconfig.base.json`) or `process`, `__dirname` and `node:*` modules disappear from typechecking.
  `next build` still passed in that state because its own check only covers the app, so run `npm run typecheck` too.
- The sandbox preview (`pm2` app `workspace-preview`, runs `npm run dev`) keeps the old Next version in memory.
  After upgrading Next it returned 500 on every route until `pm2 restart workspace-preview`.
- `.env*` files are loaded by Next only from `packages/app`, and the migration scripts read the process environment
  only, so a root `.env.local` does nothing. `.env.example` is a variable reference, not an auto-loaded file.
