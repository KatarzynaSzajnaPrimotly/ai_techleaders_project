# Prepare test environment

- **Asked:** Run `/om-prepare-test-env` for the DevMentor repository.
- **Done:** Generated reusable Linux start/stop scripts; installed and verified `agent-browser` plus Chrome system libraries; prepared a production Next.js server against the existing local PostgreSQL database and applied repository migrations.
- **Files touched:** `.ai/scripts/test-env-up.sh`, `.ai/scripts/test-env-down.sh`, `.ai/qa/test-env.json`, `.ai/qa/test-env-build-cache.json`, `.ai/skills/om-prepare-test-env/SKILL.md`, `.gitattributes`, `.gitignore`, `.ai/runs/2026-10-26-prepare-test-env.md`.
- **Decision:** Docker is unavailable. The environment uses local PostgreSQL at the repository's documented development address; teardown stops only the app started by this repository and preserves PostgreSQL.
- **Verification:** `agent-browser doctor --json` passed. The environment passed a cold start (18.4s with install/build), a cached start after teardown (2.2s), warm reuse (0.27s), and source-change cache invalidation (7.0s build only). Teardown stopped the managed app and preserved PostgreSQL and the preview. Home and mentors API both returned 200. `git diff --check` passed.
- **Recovery:** Reinstalling workspace dependencies left the PM2 preview returning 500, so it was restarted per the repository's environment instructions; it returned 200 afterward.
- **Open items:** None.
