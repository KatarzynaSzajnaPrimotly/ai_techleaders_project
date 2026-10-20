import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { bootstrap } from "./setup-bootstrap.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const run = (command, args) =>
  spawnSync(command, args, { cwd: root, stdio: "inherit", shell: process.platform === "win32" }).status ?? 1;

process.exit(bootstrap({ root, nodeVersion: process.version, log: console.log, run }));
