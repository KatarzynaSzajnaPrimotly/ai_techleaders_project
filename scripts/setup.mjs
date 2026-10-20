import path from "node:path";
import { fileURLToPath } from "node:url";
import { bootstrap, createRunner } from "./setup-bootstrap.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

process.exit(bootstrap({ root, nodeVersion: process.version, log: console.log, run: createRunner(root) }));
