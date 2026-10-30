#!/bin/sh
# om-prepare-test-env: generated entrypoint (contract v2)
# regenerate with: om-prepare-test-env --regenerate
# history:
#   2026-10-26 generated: stops only the recorded Next.js process; preserves the shared PostgreSQL service
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)
cd "$ROOT"
DESCRIPTOR=.ai/qa/test-env.json

if [ ! -f "$DESCRIPTOR" ]; then
  echo 'TEST_ENV_STATUS=stopped'
  echo 'TEST_ENV_NOTE=no descriptor exists'
  exit 0
fi

record=$(node - "$DESCRIPTOR" <<'NODE'
const fs = require('node:fs');
try {
  const d = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  if (d.startedByThisRepo !== true || !Number.isInteger(d.app?.pid) || !Number.isInteger(d.app?.port)) process.exit(0);
  process.stdout.write(`${d.app.pid}|${d.app.port}`);
} catch {}
NODE
)

if [ -n "$record" ]; then
  pid=${record%%|*}
  port=${record#*|}
  command_line=$(ps -p "$pid" -o args= 2>/dev/null || true)
  case "$command_line" in
    *next*start*--port*"$port"*)
      kill "$pid" 2>/dev/null || true
      attempt=0
      while kill -0 "$pid" 2>/dev/null && [ "$attempt" -lt 20 ]; do
        sleep 1
        attempt=$((attempt + 1))
      done
      if kill -0 "$pid" 2>/dev/null; then kill -KILL "$pid" 2>/dev/null || true; fi
      ;;
    *next-server*)
      if node - "$port" <<'NODE'
const port = process.argv[2];
(async () => {
  const page = await fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(2000) });
  const api = await fetch(`http://127.0.0.1:${port}/api/mentors`, { signal: AbortSignal.timeout(2000) });
  if (!page.ok || !api.ok) process.exit(1);
})().catch(() => process.exit(1));
NODE
      then
        kill "$pid" 2>/dev/null || true
        attempt=0
        while kill -0 "$pid" 2>/dev/null && [ "$attempt" -lt 20 ]; do
          sleep 1
          attempt=$((attempt + 1))
        done
        if kill -0 "$pid" 2>/dev/null; then kill -KILL "$pid" 2>/dev/null || true; fi
      fi
      ;;
  esac
fi

node - "$DESCRIPTOR" <<'NODE'
const fs = require('node:fs');
const file = process.argv[2];
try {
  const d = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (d.startedByThisRepo === true) d.status = 'stopped';
  fs.writeFileSync(`${file}.tmp`, `${JSON.stringify(d, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(`${file}.tmp`, file);
} catch {}
NODE

echo 'TEST_ENV_STATUS=stopped'
echo "TEST_ENV_DESCRIPTOR=$DESCRIPTOR"
