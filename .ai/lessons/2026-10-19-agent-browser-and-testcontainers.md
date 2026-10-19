# agent-browser and Testcontainers in this repo

- `agent-browser` is a native CLI driving Chrome through a background daemon: `open`, `get text|url|title`, `click`,
  `wait --url`, `snapshot`; failures exit with code 1. The CSS selector `a[href="/mentors"]` worked, `text=...` did not
  match a link. `AGENT_BROWSER_ARGS=--no-sandbox` passes Chrome flags; use one `AGENT_BROWSER_SESSION` per run.
- The daemon keeps the environment it started with. After fixing `LD_LIBRARY_PATH` the old session still failed until
  `agent-browser close --all`.
- The sandbox has no Docker and no root: `npx agent-browser install` downloads Chrome but it needs system libraries.
  Without root: `apt-get -o Dir::State::lists=/tmp/apt/lists -o Dir::Cache=/tmp/apt/cache update`, `apt-get download`
  the missing `.deb` packages (found with `ldd`), `dpkg-deb -x` them and export `LD_LIBRARY_PATH`.
- The Testcontainers start itself cannot run here (`Could not find a working container runtime strategy`, fails fast
  and cleanly). Everything else is verified through `INTEGRATION_DATABASE_URL`; the container path is first exercised
  in GitHub Actions.
- npm 11 prints "install-scripts not yet covered by allowScripts" warnings; the binaries we need still worked.
