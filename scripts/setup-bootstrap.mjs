import fs from "node:fs";
import path from "node:path";

/**
 * The part of `npm run setup` that must work before anything is installed: plain Node, no dependencies.
 * Everything after it (env file, database, migrations) lives in packages/db/src/setup.
 */

export function majorVersion(version) {
  return Number.parseInt(String(version).trim().replace(/^v/, ""), 10);
}

export function checkNodeVersion(required, current) {
  if (majorVersion(current) !== majorVersion(required)) {
    return {
      ok: false,
      detail: `Node ${String(current).trim()} is running, .nvmrc requires ${String(required).trim()}`,
      fix: `Run "nvm use" (or install Node ${String(required).trim()}), then run "npm run setup" again.`,
    };
  }
  return { ok: true, detail: `Node ${String(current).trim()} matches .nvmrc` };
}

/** npm writes node_modules/.package-lock.json after every install, so it is older than package-lock.json when out of sync. */
export function dependenciesInstalled(root, fileSystem = fs) {
  const installed = path.join(root, "node_modules", ".package-lock.json");
  const lock = path.join(root, "package-lock.json");
  if (!fileSystem.existsSync(installed)) return false;
  return fileSystem.statSync(installed).mtimeMs >= fileSystem.statSync(lock).mtimeMs;
}

/**
 * Returns the process exit code. `run(command, args)` executes a command in the repository root with inherited stdio
 * and returns its exit status.
 */
export function bootstrap({ root, nodeVersion, log, run, fileSystem = fs }) {
  const required = fileSystem.readFileSync(path.join(root, ".nvmrc"), "utf8");
  const node = checkNodeVersion(required, nodeVersion);
  if (!node.ok) {
    log(`[failed] Node version: ${node.detail}`);
    log(`  fix: ${node.fix}`);
    return 1;
  }
  log(`[skipped] Node version: ${node.detail}`);

  if (dependenciesInstalled(root, fileSystem)) {
    log("[skipped] Dependencies: node_modules is in sync with package-lock.json");
  } else {
    if (run("npm", ["install"]) !== 0) {
      log("[failed] Dependencies: npm install failed");
      log('  fix: Resolve the npm error above, then run "npm run setup" again.');
      return 1;
    }
    log("[done] Dependencies: ran npm install");
  }

  return run("npm", ["run", "setup", "-w", "@devmentor/db"]);
}
