# Repo-specific test environment notes

This file extends the installed `om-prepare-test-env` skill.

## Browser setup

The project provides `agent-browser` from `node_modules/.bin/agent-browser`.
Run its `install` and `doctor --json` operations during generation. If doctor
reports Chrome missing a shared library, run
`./node_modules/.bin/agent-browser install --with-deps`, then rerun
`./node_modules/.bin/agent-browser doctor --json`. This installs the Linux
Chrome system libraries (including `libnspr4`) that the browser needs to launch.

The repository's integration test setup starts a disposable PostgreSQL
Testcontainer and requires Docker. The reusable local environment uses a
production build/start on a free localhost port with the documented local
`devmentor` PostgreSQL database. It applies the repository's migrations and
never starts, drops, or stops PostgreSQL. Keep the database connection
restricted to localhost.

## Next.js launch directory

Run Next.js from `packages/app`. Starting from the monorepo root makes Next.js
report that it cannot find an `app` or `pages` directory. Next.js 16 also locks
`.next/dev` to one development server, so use a production build/start when a
preview dev server is already running; build output is isolated from `.next/dev`.
Launch the server in a detached Node child process so it remains alive after
the bootstrap script exits and its PID can be checked during warm reuse.
Cache the dependency install separately from the app build: source-only
changes rebuild production output without rerunning `npm ci`, which can replace
modules underneath the workspace preview process.
Keep shell function declarations outside embedded Node heredocs and run
`sh -n .ai/scripts/test-env-up.sh` before trying to boot the environment.
