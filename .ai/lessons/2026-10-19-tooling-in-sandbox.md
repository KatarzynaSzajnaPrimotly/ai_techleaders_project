# Sandbox shell gotchas

- `lsof` and `ss` are not installed; `kill $(lsof -t -i:PORT)` silently does nothing and leaves servers running.
  Start test servers with `cmd & SRV=$!` and `kill $SRV`.
- `pkill -f` / `pgrep -f "<text>"` also match the bash tool's own command line and kill the shell (exit 144).
- The sandbox exports `DATABASE_URL` for an unrelated database; DevMentor reads `DEVMENTOR_DATABASE_URL`.
- When reaping test servers by working directory, skip your own shell (`[ "$p" = "$$" ] && continue`) and run the
  loop from a different directory; otherwise it kills the bash tool (exit 144).
