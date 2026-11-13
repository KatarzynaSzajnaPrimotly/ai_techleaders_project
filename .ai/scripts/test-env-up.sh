#!/bin/sh
# om-prepare-test-env: generated entrypoint (contract v2)
# regenerate with: om-prepare-test-env --regenerate
# history:
#   2026-11-09 generated for local PostgreSQL and production Next.js start
#   2026-11-09 repair: detach app from the task process group and recover stale locks
set -eu

ROOT=$(CDPATH= cd -- "$(dirname "$0")/../.." && pwd)
QA_DIR="$ROOT/.ai/qa"
DESCRIPTOR="$QA_DIR/test-env.json"
CREDENTIALS="$QA_DIR/test-env.env"
BUILD_CACHE="$QA_DIR/test-env-build-cache.json"
LOCK="$QA_DIR/test-env.lock"
PID_FILE="$QA_DIR/test-env.pid"
LOG_FILE="$QA_DIR/test-env.log"
mkdir -p "$QA_DIR"
umask 077

if [ ! -f "$CREDENTIALS" ]; then
  : "${DEVMENTOR_DATABASE_URL:?Set DEVMENTOR_DATABASE_URL to a local disposable PostgreSQL database on first run}"
  DEVMENTOR_DATABASE_URL="$DEVMENTOR_DATABASE_URL" node -e '
    const { randomBytes } = require("node:crypto");
    console.log("DEVMENTOR_DATABASE_URL=" + process.env.DEVMENTOR_DATABASE_URL);
    console.log("JWT_SECRET=" + randomBytes(32).toString("base64url"));
    console.log("TEST_MENTOR_EMAIL=qa-mentor-e02@example.test");
    console.log("TEST_MENTOR_PASSWORD=" + randomBytes(18).toString("base64url"));
    console.log("OPERATOR_EMAILS=qa-operator-e02@example.test");
  ' > "$CREDENTIALS"
fi
set -a
. "$CREDENTIALS"
set +a

NODE_ENV=production
APP_URL=""
GITHUB_CLIENT_ID=qa-placeholder
GITHUB_CLIENT_SECRET=qa-placeholder
TRUST_PROXY_HOPS=1
INVITATION_TTL_DAYS=14
MENTOR_PUBLISH_WINDOW_DAYS=14
MAILER_TRANSPORT=local-file
LOCAL_MAILBOX_DIR="$ROOT/.ai/qa/mailbox"
ALLOW_INSECURE_HTTP=true
export NODE_ENV APP_URL GITHUB_CLIENT_ID GITHUB_CLIENT_SECRET TRUST_PROXY_HOPS
export INVITATION_TTL_DAYS MENTOR_PUBLISH_WINDOW_DAYS MAILER_TRANSPORT LOCAL_MAILBOX_DIR ALLOW_INSECURE_HTTP

if [ -f "$DESCRIPTOR" ]; then
  REUSE=$(node -e '
    const fs=require("node:fs");
    try {
      const d=JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
      process.stdout.write(d.status === "running" && Number.isInteger(d.app?.pid) ? String(d.app.pid) : "");
    } catch {}
  ' "$DESCRIPTOR")
  if [ -n "$REUSE" ] && kill -0 "$REUSE" 2>/dev/null; then
    BASE_URL=$(node -e 'process.stdout.write(JSON.parse(require("node:fs").readFileSync(process.argv[1], "utf8")).baseUrl)' "$DESCRIPTOR")
    if curl -fsS --max-time 3 "$BASE_URL/" >/dev/null 2>&1; then
      printf 'TEST_ENV_STATUS=running\nTEST_ENV_BASE_URL=%s\nTEST_ENV_DESCRIPTOR=.ai/qa/test-env.json\nTEST_ENV_REUSED=1\n' "$BASE_URL"
      exit 0
    fi
  fi
fi

if ! mkdir "$LOCK" 2>/dev/null; then
  LOCK_OWNER=""
  if [ -f "$LOCK/owner.pid" ]; then LOCK_OWNER=$(cat "$LOCK/owner.pid"); fi
  if [ -n "$LOCK_OWNER" ] && ! kill -0 "$LOCK_OWNER" 2>/dev/null; then
    rm -f "$LOCK/owner.pid"
    rmdir "$LOCK" 2>/dev/null || true
  fi
  if ! mkdir "$LOCK" 2>/dev/null; then
    echo "A test-environment bootstrap is already in progress: $LOCK" >&2
    exit 1
  fi
fi
printf '%s\n' "$$" > "$LOCK/owner.pid"
cleanup_on_error() {
  STATUS=$?
  if [ "$STATUS" -ne 0 ]; then
    if [ -f "$PID_FILE" ]; then kill "$(cat "$PID_FILE")" 2>/dev/null || true; fi
    rm -rf "$LOCK"
  fi
}
trap cleanup_on_error EXIT

cd "$ROOT"
export DEVMENTOR_DATABASE_URL JWT_SECRET TEST_MENTOR_EMAIL TEST_MENTOR_PASSWORD OPERATOR_EMAILS TEST_ENV_PORT
INPUTS="packages/app/src packages/core/src packages/db/src packages/ui/src package.json package-lock.json packages/app/package.json packages/core/package.json packages/db/package.json packages/ui/package.json"
fingerprint() {
  for item in $INPUTS; do
    if [ -d "$item" ]; then
      find "$item" -type f ! -path '*/node_modules/*' ! -path '*/.next/*' ! -path '*/coverage/*'
    elif [ -f "$item" ]; then
      printf '%s\n' "$item"
    fi
  done | LC_ALL=C sort | while IFS= read -r file; do
    stat -c '%n:%s:%Y' "$file"
  done | cksum | awk '{print $1 "-" $2}'
}
CURRENT_FINGERPRINT=$(fingerprint)
CACHED_FINGERPRINT=""
if [ -f "$BUILD_CACHE" ]; then
  CACHED_FINGERPRINT=$(node -e 'try { process.stdout.write(JSON.parse(require("node:fs").readFileSync(process.argv[1], "utf8")).sourceFingerprint ?? ""); } catch {}' "$BUILD_CACHE")
fi
if [ "$CURRENT_FINGERPRINT" != "$CACHED_FINGERPRINT" ] || [ ! -d "$ROOT/packages/app/.next" ]; then
  NODE_ENV=production npm run build
  node -e '
    const fs=require("node:fs");
    fs.writeFileSync(process.argv[1], JSON.stringify({builtAt:new Date().toISOString(),sourceFingerprint:process.argv[2],projectRoot:process.argv[3],artifactPaths:"packages/app/.next"},null,2)+"\n");
  ' "$BUILD_CACHE" "$CURRENT_FINGERPRINT" "$ROOT"
fi

npm run migration:up -w @devmentor/db
node --input-type=module <<'NODE'
import { Client } from "pg";
import bcrypt from "bcryptjs";
const client = new Client({ connectionString: process.env.DEVMENTOR_DATABASE_URL });
await client.connect();
try {
  const hash = await bcrypt.hash(process.env.TEST_MENTOR_PASSWORD, 12);
  await client.query(
    "INSERT INTO users (email, email_verified_at, display_name, role, roles, password_hash) VALUES ($1, now(), 'QA Mentor', 'mentee', ARRAY['mentee']::text[], $2) ON CONFLICT (email) DO NOTHING",
    [process.env.TEST_MENTOR_EMAIL, hash],
  );
} finally {
  await client.end();
}
NODE

PORT=${TEST_ENV_PORT:-$(node -e 'const s=require("node:net").createServer();s.listen(0,"127.0.0.1",()=>{console.log(s.address().port);s.close()})')}
APP_URL="http://127.0.0.1:$PORT"
export APP_URL
(
  cd "$ROOT/packages/app"
  nohup setsid "$ROOT/node_modules/.bin/next" start --hostname 127.0.0.1 --port "$PORT" > "$LOG_FILE" 2>&1 </dev/null &
  echo $! > "$PID_FILE"
)
PID=$(cat "$PID_FILE")
printf '%s\n' "$PID" > "$LOCK/owner.pid"
READY=0
for _attempt in $(seq 1 120); do
  if ! kill -0 "$PID" 2>/dev/null; then cat "$LOG_FILE" >&2; exit 1; fi
  if curl -fsS --max-time 2 "$APP_URL/" >/dev/null; then READY=1; break; fi
  sleep 0.5
done
if [ "$READY" -ne 1 ]; then cat "$LOG_FILE" >&2; echo "App health check timed out" >&2; exit 1; fi

RUN_ID=$(date -u +%Y%m%dT%H%M%SZ)
STARTED_AT=$(date -u +%FT%TZ)
node -e '
  const fs=require("node:fs");
  const d={
    version:1,runId:process.argv[2],status:"running",mode:"dev",baseUrl:process.argv[3],
    startedByThisRepo:true,startScript:".ai/scripts/test-env-up.sh",stopScript:".ai/scripts/test-env-down.sh",
    app:{startCommand:"next start --hostname 127.0.0.1",port:Number(process.argv[4]),healthPath:"/",pid:Number(process.argv[5])},
    services:[{type:"postgres",host:"127.0.0.1",port:55432,container:"",env:{DEVMENTOR_DATABASE_URL:"<local disposable DB URL in credentials file>"}}],
    credentials:[{role:"mentor",username:process.env.TEST_MENTOR_EMAIL,passwordEnv:"TEST_MENTOR_PASSWORD"}],
    credentialsFile:".ai/qa/test-env.env",
    browser:{provider:"agent-browser",installed:true,command:process.argv[6],version:process.argv[7],descriptor:".ai/browsers/agent-browser.md",notes:"Local headless Chrome; no remote browser service."},
    testRunner:{name:"other",config:"vitest.integration.config.mts"},platform:"linux",startedAt:process.argv[8],
    notes:"Uses a local disposable PostgreSQL database (Docker is unavailable here). The up script builds with NODE_ENV=production, runs migrations, seeds a verified demo mentor, and starts the built app. The database is not stopped by teardown."
  };
  fs.writeFileSync(process.argv[1],JSON.stringify(d,null,2)+"\n");
' "$DESCRIPTOR" "$RUN_ID" "$APP_URL" "$PORT" "$PID" "$ROOT/node_modules/.bin/agent-browser" "$("$ROOT/node_modules/.bin/agent-browser" --version)" "$STARTED_AT"
printf 'TEST_ENV_STATUS=running\nTEST_ENV_BASE_URL=%s\nTEST_ENV_DESCRIPTOR=.ai/qa/test-env.json\nTEST_ENV_REUSED=0\nBROWSER_PROVIDER=agent-browser\nBROWSER_INSTALLED=1\n' "$APP_URL"
trap - EXIT
