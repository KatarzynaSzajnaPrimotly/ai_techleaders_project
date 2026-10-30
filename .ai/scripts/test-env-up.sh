#!/bin/sh
# om-prepare-test-env: generated entrypoint (contract v2)
# regenerate with: om-prepare-test-env --regenerate
# history:
#   2026-10-26 generated for Linux: app uses existing local PostgreSQL; Chrome dependencies installed after doctor found missing libnspr4
#   2026-10-26 repair: use a production build/start from packages/app; Next.js permits it alongside the preview dev server, while a second dev server is locked out
#   2026-10-26 repair: launch Next.js as a detached Node child so it survives the bootstrap shell and remains reusable
#   2026-10-26 repair: reinstall packages only when dependency manifests change; source-only edits rebuild the app without disrupting a live preview
#   2026-10-26 repair: keep POSIX function declarations outside embedded Node heredocs (prevents shell parse errors)
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT=$(CDPATH= cd -- "$SCRIPT_DIR/../.." && pwd)
SCRIPTS_DIR=.ai/scripts
QA_DIR=.ai/qa
UP_SCRIPT=$SCRIPTS_DIR/test-env-up.sh
DOWN_SCRIPT=$SCRIPTS_DIR/test-env-down.sh
ENV_DESCRIPTOR=$QA_DIR/test-env.json
BUILD_CACHE=$QA_DIR/test-env-build-cache.json
APP_DIR=packages/app
DATABASE_URL_DEFAULT=postgresql://postgres:postgres@127.0.0.1:5432/devmentor
BUILD_INPUTS='package.json package-lock.json packages/app/package.json packages/core/package.json packages/db/package.json packages/ui/package.json packages/app/next.config.ts tsconfig.base.json packages/app/src packages/core/src packages/db/src packages/ui/src'
BUILD_ENV_VARS=NODE_ENV
ARTIFACTS=packages/app/.next/BUILD_ID
TTL_SECONDS=${TEST_ENV_CACHE_TTL_SECONDS:-600}
FORCE=0
FORCE_REBUILD=0
APP_PID=
LOCK_HELD=0
LOCK_DIR=$QA_DIR/test-env.lock

for arg in "$@"; do
  case "$arg" in
    --force) FORCE=1 ;;
    --force-rebuild) FORCE_REBUILD=1 ;;
    *) echo "Unsupported argument: $arg" >&2; exit 2 ;;
  esac
done
case "$TTL_SECONDS" in ''|*[!0-9]*) echo 'TEST_ENV_CACHE_TTL_SECONDS must be a non-negative integer' >&2; exit 2 ;; esac

cd "$ROOT"
mkdir -p "$QA_DIR" "$SCRIPTS_DIR"

timestamp() { date -u +%FT%TZ; }

fingerprint() {
  NODE_ENV=production node - "$ROOT" "$BUILD_INPUTS" "$BUILD_ENV_VARS" <<'NODE'
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = process.argv[2];
const inputs = process.argv[3].split(' ').filter(Boolean);
const envVars = process.argv[4].split(' ').filter(Boolean);
const files = new Set();
function walk(rel) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) return;
  const stat = fs.statSync(abs);
  if (stat.isFile()) { files.add(rel); return; }
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    if (entry.isDirectory()) walk(path.posix.join(rel, entry.name));
    else if (entry.isFile()) files.add(path.posix.join(rel, entry.name));
  }
}
for (const input of inputs) walk(input);
const rows = [...files].sort().map(rel => {
  const stat = fs.statSync(path.join(root, rel));
  return `${rel}:${stat.size}:${Math.floor(stat.mtimeMs / 1000)}`;
});
for (const name of envVars) rows.push(`env:${name}=${process.env[name] || ''}`);
process.stdout.write(crypto.createHash('sha256').update(rows.join('\n')).digest('hex'));
NODE
}

dependency_fingerprint() {
  node - "$ROOT" <<'NODE'
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = process.argv[2];
const files = ['package.json', 'package-lock.json', 'packages/app/package.json', 'packages/core/package.json', 'packages/db/package.json', 'packages/ui/package.json', '.npmrc'].filter(file => fs.existsSync(path.join(root, file)));
const rows = files.sort().map(file => { const s = fs.statSync(path.join(root, file)); return `${file}:${s.size}:${Math.floor(s.mtimeMs / 1000)}`; });
rows.push(`runtime:${process.version}:${process.platform}:${process.arch}`);
process.stdout.write(crypto.createHash('sha256').update(rows.join('\n')).digest('hex'));
NODE
}

source_is_newer_than() {
  node - "$ROOT" "$1" <<'NODE'
const fs = require('node:fs');
const path = require('node:path');
const root = process.argv[2];
const startedAt = Date.parse(process.argv[3]);
const dirs = ['packages/app/src', 'packages/core/src', 'packages/db/src', 'packages/ui/src'];
let newer = false;
function walk(rel) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) return;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const child = path.posix.join(rel, entry.name);
    if (entry.isDirectory()) walk(child);
    else if (entry.isFile() && fs.statSync(path.join(root, child)).mtimeMs > startedAt) newer = true;
  }
}
for (const dir of dirs) walk(dir);
for (const file of ['package.json', 'package-lock.json', 'packages/app/package.json', 'packages/app/next.config.ts']) {
  const abs = path.join(root, file);
  if (fs.existsSync(abs) && fs.statSync(abs).mtimeMs > startedAt) newer = true;
}
process.exit(newer ? 0 : 1);
NODE
}

http_ready() {
  node - "$1" <<'NODE'
const base = process.argv[2];
(async () => {
  const page = await fetch(base, { signal: AbortSignal.timeout(3000) });
  if (!page.ok) process.exit(1);
  const api = await fetch(`${base}/api/mentors`, { signal: AbortSignal.timeout(3000) });
  if (!api.ok) process.exit(1);
})().catch(() => process.exit(1));
NODE
}

process_matches() {
  pid=$1
  port=$2
  kill -0 "$pid" 2>/dev/null || return 1
  process_command=$(ps -p "$pid" -o args= 2>/dev/null || true)
  case "$process_command" in
    *next*start*--port*"$port"*) return 0 ;;
    *next-server*) http_ready "http://127.0.0.1:$port" ;;
    *) return 1 ;;
  esac
}

stop_recorded_app() {
  [ -f "$ENV_DESCRIPTOR" ] || return 0
  record=$(node - "$ENV_DESCRIPTOR" <<'NODE'
const fs = require('node:fs');
try {
  const d = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
  if (d.startedByThisRepo !== true || !Number.isInteger(d.app?.pid) || !Number.isInteger(d.app?.port)) process.exit(0);
  process.stdout.write(`${d.app.pid}|${d.app.port}`);
} catch {}
NODE
)
  [ -n "$record" ] || return 0
  old_pid=${record%%|*}
  old_port=${record#*|}
  if process_matches "$old_pid" "$old_port"; then
    kill "$old_pid" 2>/dev/null || true
    attempt=0
    while kill -0 "$old_pid" 2>/dev/null && [ "$attempt" -lt 20 ]; do
      sleep 1
      attempt=$((attempt + 1))
    done
    if kill -0 "$old_pid" 2>/dev/null; then
      kill -KILL "$old_pid" 2>/dev/null || true
    fi
  fi
}

cleanup() {
  exit_code=$?
  if [ "$exit_code" -ne 0 ] && [ -n "$APP_PID" ] && kill -0 "$APP_PID" 2>/dev/null; then
    kill "$APP_PID" 2>/dev/null || true
  fi
  if [ "$LOCK_HELD" -eq 1 ]; then rm -rf "$LOCK_DIR"; fi
  exit "$exit_code"
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

acquire_lock() {
  attempt=0
  while ! mkdir "$LOCK_DIR" 2>/dev/null; do
    owner_pid=$(node - "$LOCK_DIR/owner.json" <<'NODE'
const fs = require('node:fs');
try { process.stdout.write(String(JSON.parse(fs.readFileSync(process.argv[2], 'utf8')).pid || '')); } catch {}
NODE
)
    if [ -z "$owner_pid" ] || ! kill -0 "$owner_pid" 2>/dev/null; then
      rm -rf "$LOCK_DIR"
      continue
    fi
    if [ "$attempt" -ge 150 ]; then echo 'Timed out waiting for another test environment bootstrap' >&2; return 1; fi
    sleep 2
    attempt=$((attempt + 1))
  done
  LOCK_HELD=1
  node - "$LOCK_DIR/owner.json" "$$" <<'NODE'
const fs = require('node:fs');
fs.writeFileSync(process.argv[2], JSON.stringify({ pid: Number(process.argv[3]), source: 'om-prepare-test-env', acquiredAt: new Date().toISOString() }));
NODE
}

check_reuse() {
  [ -f "$ENV_DESCRIPTOR" ] || return 1
  node - "$ENV_DESCRIPTOR" "$TTL_SECONDS" "$ROOT" <<'NODE'
const fs = require('node:fs');
const path = require('node:path');
const d = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const ttl = Number(process.argv[3]) * 1000;
const root = process.argv[4];
if (d.status !== 'running' || d.startedByThisRepo !== true || !Number.isInteger(d.app?.pid)) process.exit(1);
if (Date.now() - Date.parse(d.startedAt) > ttl || Date.parse(d.startedAt) > Date.now()) process.exit(1);
try { process.kill(d.app.pid, 0); } catch { process.exit(1); }
const dirs = ['packages/app/src', 'packages/core/src', 'packages/db/src', 'packages/ui/src'];
let changed = false;
function walk(rel) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) return;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const child = path.posix.join(rel, entry.name);
    if (entry.isDirectory()) walk(child);
    else if (entry.isFile() && fs.statSync(path.join(root, child)).mtimeMs > Date.parse(d.startedAt)) changed = true;
  }
}
for (const dir of dirs) walk(dir);
for (const file of ['package.json', 'package-lock.json', 'packages/app/package.json', 'packages/app/next.config.ts']) {
  const abs = path.join(root, file);
  if (fs.existsSync(abs) && fs.statSync(abs).mtimeMs > Date.parse(d.startedAt)) changed = true;
}
if (changed) process.exit(1);
process.stdout.write(d.baseUrl);
NODE
}

acquire_lock
REUSE_URL=$(check_reuse 2>/dev/null || true)
if [ -n "$REUSE_URL" ] && [ "$FORCE" -eq 0 ]; then
  if process_matches "$(node -p "JSON.parse(require('fs').readFileSync('$ENV_DESCRIPTOR')).app.pid")" "$(node -p "JSON.parse(require('fs').readFileSync('$ENV_DESCRIPTOR')).app.port")" && http_ready "$REUSE_URL"; then
    run_id=$(node -p "JSON.parse(require('fs').readFileSync('$ENV_DESCRIPTOR')).runId")
    echo 'TEST_ENV_STATUS=running'
    echo "TEST_ENV_BASE_URL=$REUSE_URL"
    echo "TEST_ENV_DESCRIPTOR=$ENV_DESCRIPTOR"
    echo 'TEST_ENV_REUSED=1'
    echo 'BROWSER_PROVIDER=agent-browser'
    echo 'BROWSER_INSTALLED=1'
    echo "TEST_ENV_RUN_ID=$run_id"
    exit 0
  fi
fi

stop_recorded_app

SOURCE_FINGERPRINT=$(fingerprint)
CACHE_ROOT=$(node - "$BUILD_CACHE" "$ROOT" <<'NODE'
const fs = require('node:fs');
try { process.stdout.write(JSON.parse(fs.readFileSync(process.argv[2], 'utf8')).projectRoot || ''); } catch {}
NODE
)
CACHE_FINGERPRINT=$(node - "$BUILD_CACHE" <<'NODE'
const fs = require('node:fs');
try { process.stdout.write(JSON.parse(fs.readFileSync(process.argv[2], 'utf8')).sourceFingerprint || ''); } catch {}
NODE
)
CURRENT_DEP_FINGERPRINT=$(dependency_fingerprint)
CACHE_DEP_FINGERPRINT=$(node - "$BUILD_CACHE" <<'NODE'
const fs = require('node:fs');
try { process.stdout.write(JSON.parse(fs.readFileSync(process.argv[2], 'utf8')).dependencyFingerprint || ''); } catch {}
NODE
)
NEEDS_BUILD=0
if [ "$FORCE_REBUILD" -eq 1 ] || [ "$CACHE_ROOT" != "$ROOT" ] || [ "$CACHE_FINGERPRINT" != "$SOURCE_FINGERPRINT" ] || [ ! -x node_modules/.bin/next ] || [ ! -s "$ARTIFACTS" ]; then
  NEEDS_BUILD=1
fi
if [ "$FORCE_REBUILD" -eq 1 ] || [ "$CACHE_DEP_FINGERPRINT" != "$CURRENT_DEP_FINGERPRINT" ] || [ ! -x node_modules/.bin/next ]; then
  npm ci
  CURRENT_DEP_FINGERPRINT=$(dependency_fingerprint)
  NEEDS_BUILD=1
fi
if [ "$NEEDS_BUILD" -eq 1 ]; then
  NODE_ENV=production npm run build
  SOURCE_FINGERPRINT=$(fingerprint)
  node - "$BUILD_CACHE" "$ROOT" "$SOURCE_FINGERPRINT" "$ARTIFACTS" "$CURRENT_DEP_FINGERPRINT" <<'NODE'
const fs = require('node:fs');
const value = { builtAt: new Date().toISOString(), sourceFingerprint: process.argv[4], projectRoot: process.argv[3], artifactPaths: process.argv[5], dependencyFingerprint: process.argv[6] };
fs.writeFileSync(process.argv[2], `${JSON.stringify(value, null, 2)}\n`);
NODE
fi

DATABASE_URL=${DEVMENTOR_DATABASE_URL:-$DATABASE_URL_DEFAULT}
node - "$DATABASE_URL" <<'NODE'
const url = new URL(process.argv[2]);
if (!['127.0.0.1', 'localhost'].includes(url.hostname) || (url.port && url.port !== '5432')) {
  console.error('This generated dev environment only runs migrations against local PostgreSQL on port 5432.');
  process.exit(1);
}
NODE
if ! node - "$DATABASE_URL" <<'NODE'
const net = require('node:net');
const url = new URL(process.argv[2]);
const socket = net.connect({ host: url.hostname, port: Number(url.port || 5432) });
socket.setTimeout(1500);
socket.once('connect', () => { socket.end(); process.exit(0); });
socket.once('error', () => process.exit(1));
socket.once('timeout', () => { socket.destroy(); process.exit(1); });
NODE
then
  echo 'Local PostgreSQL is not accepting connections at the configured dev URL.' >&2
  exit 1
fi
export DEVMENTOR_DATABASE_URL=$DATABASE_URL
npm run migration:up -w @devmentor/db

PORT=$(node - <<'NODE'
const net = require('node:net');
const server = net.createServer();
server.listen(0, '127.0.0.1', () => { console.log(server.address().port); server.close(); });
NODE
)
BASE_URL=http://127.0.0.1:$PORT
STARTED_AT=$(timestamp)
RUN_ID=$(date -u +%Y%m%d%H%M%S)-$$
mkdir -p "$QA_DIR"
cd "$ROOT/$APP_DIR"
APP_PID=$(node - "$ROOT" "$PORT" "$ROOT/$QA_DIR/test-env.log" <<'NODE'
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const [root, port, logPath] = process.argv.slice(2);
const logFd = fs.openSync(logPath, 'a');
const child = spawn(process.execPath, [path.join(root, 'node_modules/.bin/next'), 'start', '--hostname', '127.0.0.1', '--port', port], {
  cwd: path.join(root, 'packages/app'),
  env: { ...process.env, NODE_ENV: 'production' },
  detached: true,
  stdio: ['ignore', logFd, logFd],
});
child.once('error', error => { console.error(`Could not start Next.js: ${error.message}`); process.exitCode = 1; });
child.once('spawn', () => { child.unref(); process.stdout.write(String(child.pid)); });
fs.closeSync(logFd);
NODE
)
cd "$ROOT"

attempt=0
while [ "$attempt" -lt 120 ]; do
  if http_ready "$BASE_URL" 2>/dev/null; then break; fi
  if ! kill -0 "$APP_PID" 2>/dev/null; then
    echo 'Next.js exited before the home page and mentors API became ready; see .ai/qa/test-env.log' >&2
    exit 1
  fi
  sleep 1
  attempt=$((attempt + 1))
done
if [ "$attempt" -ge 120 ]; then
  echo 'Timed out waiting for the home page and mentors API; see .ai/qa/test-env.log' >&2
  exit 1
fi

printf '' > "$QA_DIR/test-env.env"
chmod 600 "$QA_DIR/test-env.env"
node - "$ENV_DESCRIPTOR" "$RUN_ID" "$BASE_URL" "$PORT" "$APP_PID" "$UP_SCRIPT" "$DOWN_SCRIPT" "$STARTED_AT" <<'NODE'
const fs = require('node:fs');
const [file, runId, baseUrl, port, pid, startScript, stopScript, startedAt] = process.argv.slice(2);
const descriptor = {
  version: 1,
  runId,
  status: 'running',
  mode: 'prod',
  baseUrl,
  startedByThisRepo: true,
  startScript,
  stopScript,
  app: { startCommand: 'next start --hostname 127.0.0.1 --port <free-port>', port: Number(port), healthPath: '/', pid: Number(pid) },
  services: [{ type: 'postgres', host: '127.0.0.1', port: 5432, database: 'devmentor', managedByThisRepo: false }],
  credentials: [],
  credentialsFile: '.ai/qa/test-env.env',
  browser: { provider: 'agent-browser', installed: true, command: 'node_modules/.bin/agent-browser', version: '0.39.1', descriptor: '.ai/browsers/agent-browser.md', notes: '' },
  testRunner: { name: 'other', config: 'vitest.integration.config.mts' },
  platform: 'linux',
  startedAt,
  notes: 'Production build/start uses a free localhost port and runs the repository migrations against the existing local PostgreSQL service. PostgreSQL is not started, modified beyond migrations, or stopped by teardown. Browser launch was verified with agent-browser doctor.'
};
fs.writeFileSync(file, `${JSON.stringify(descriptor, null, 2)}\n`, { mode: 0o600 });
NODE
APP_PID=

echo 'TEST_ENV_STATUS=running'
echo "TEST_ENV_BASE_URL=$BASE_URL"
echo "TEST_ENV_DESCRIPTOR=$ENV_DESCRIPTOR"
echo 'TEST_ENV_REUSED=0'
echo 'BROWSER_PROVIDER=agent-browser'
echo 'BROWSER_INSTALLED=1'
echo "TEST_ENV_RUN_ID=$RUN_ID"
