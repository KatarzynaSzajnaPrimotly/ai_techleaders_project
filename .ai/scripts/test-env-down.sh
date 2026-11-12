#!/bin/sh
# om-prepare-test-env: generated teardown
set -eu
ROOT=$(CDPATH= cd -- "$(dirname "$0")/../.." && pwd)
QA_DIR="$ROOT/.ai/qa"
DESCRIPTOR="$QA_DIR/test-env.json"
LOCK="$QA_DIR/test-env.lock"
if [ ! -f "$DESCRIPTOR" ]; then
  echo "No test environment descriptor exists."
  exit 0
fi
PID=$(node -e 'try { process.stdout.write(String(JSON.parse(require("node:fs").readFileSync(process.argv[1], "utf8")).app.pid ?? "")); } catch {}' "$DESCRIPTOR")
if [ -n "$PID" ] && kill -0 "$PID" 2>/dev/null; then
  kill "$PID"
  for _attempt in $(seq 1 40); do
    kill -0 "$PID" 2>/dev/null || break
    sleep 0.25
  done
fi
node -e '
  const fs=require("node:fs");
  const p=process.argv[1], d=JSON.parse(fs.readFileSync(p,"utf8"));
  d.status="stopped"; fs.writeFileSync(p,JSON.stringify(d,null,2)+"\n");
' "$DESCRIPTOR"
if [ -f "$LOCK/owner.pid" ]; then rm -f "$LOCK/owner.pid"; fi
rmdir "$LOCK" 2>/dev/null || true
echo "TEST_ENV_STATUS=stopped"
echo "Stopped the app started by this repository; local PostgreSQL remains running."
