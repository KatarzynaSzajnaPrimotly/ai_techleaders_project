# Lessons Learned

Rolling index of lessons, gotchas, and findings discovered while working on this project.
Newest entries first. Each line links to a detailed write-up in `.ai/lessons/`.

See `AGENTS.md` for the full `.ai/` workflow this file is part of.

<!-- Add new entries below this line, newest first. Format:
- YYYY-MM-DD — One-line summary. [details](lessons/YYYY-MM-DD-slug.md)
-->

- 2026-10-20 — Read `git diff --cached --name-only` before every commit: an unrelated archive was in the index; stacked PRs need the right base. [details](lessons/2026-10-20-check-the-index-before-committing.md)
- 2026-10-20 — Sandbox: `git push` needs `-c credential.helper='!gh auth git-credential'`; no `jq`; `gh` 2.65 is below the descriptor's minimum, so use REST. [details](lessons/2026-10-20-git-push-and-gh-in-sandbox.md)
- 2026-10-19 — No Tailwind preflight: links, one-sided dashed borders, headings and lists need explicit resets. [details](lessons/2026-10-19-tailwind-without-preflight.md)
- 2026-10-19 — `next build` fails if the shell has `NODE_ENV=development`; build with `NODE_ENV=production`. [details](lessons/2026-10-19-next-build-node-env.md)
- 2026-10-19 — Next.js bundles workspace packages once per route; never rely on schema object identity with a shared ORM. [details](lessons/2026-10-19-nextjs-duplicate-package-copies.md)
- 2026-10-19 — Sandbox: no `lsof`/`ss`, `pkill -f` kills the shell; use `$!` PIDs. [details](lessons/2026-10-19-tooling-in-sandbox.md)
- 2026-10-19 — A Promise-returning method must reject, not throw synchronously; unit tests with `assert.rejects` catch it. [details](lessons/2026-10-19-async-methods-reject.md)
- 2026-10-19 — After a Next.js upgrade the running dev preview serves 500s until restarted (`pm2 restart workspace-preview`). [details](lessons/2026-10-19-upgrades-typescript-next-preview.md)
- 2026-10-19 — Vitest 5 needs @types/node >=22; unmatched test files are silently skipped; cover defensive branches by forcing input. [details](lessons/2026-10-19-vitest-coverage-and-test-gotchas.md)
- 2026-10-19 — agent-browser needs system libs and `close --all` after env changes; no Docker in the sandbox, so Testcontainers runs only in CI. [details](lessons/2026-10-19-agent-browser-and-testcontainers.md)
- 2026-10-19 — Another session shared the checkout and my full-file rewrite of an index barrel dropped its exports; use targeted edits. [details](lessons/2026-10-19-concurrent-sessions-shared-checkout.md)
- 2026-10-19 — Client components must import schemas from `@devmentor/core/validators`, not the core barrel (pino, jose). [details](lessons/2026-10-19-client-bundles-and-core-subpaths.md)
