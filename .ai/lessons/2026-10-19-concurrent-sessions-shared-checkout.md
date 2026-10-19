# Two sessions in one checkout: do not overwrite shared files

While implementing the engineering standards, another interactive session (`workspace-f4`) was building the Mentora
homepage in the same working tree and appending exports to `packages/core/src/index.ts` and `packages/ui/src/index.ts`.
A full `cat > index.ts` rewrite silently dropped those exports; the unit tests caught it
(`expected ui to have property "SiteHeader"`). SendMessage to the peer failed, so it could not be warned.

- Before restructuring, list recently modified files (`find -newer`) and check `git status` / `ListAgents` for peers.
- Edit shared files (index barrels, eslint and vitest config, AGENTS.md, integration tests) with targeted replacements, never
  full rewrites, and re-read them right before editing.
- A failing barrel test with names you never wrote is the signal that someone else is editing.
