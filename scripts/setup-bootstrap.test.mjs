import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { bootstrap, checkNodeVersion, dependenciesInstalled, majorVersion } from "./setup-bootstrap.mjs";

let root;
const past = new Date("2026-01-01T00:00:00Z");
const future = new Date("2026-06-01T00:00:00Z");

function touch(file, date) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, "{}");
  fs.utimesSync(file, date, date);
}

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "devmentor-bootstrap-"));
  fs.writeFileSync(path.join(root, ".nvmrc"), "24\n");
  touch(path.join(root, "package-lock.json"), past);
});

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

describe("majorVersion", () => {
  it("parses nvmrc content and process.version", () => {
    expect(majorVersion("24\n")).toBe(24);
    expect(majorVersion("v24.21.0")).toBe(24);
  });
});

describe("checkNodeVersion", () => {
  it("accepts the required major version", () => {
    expect(checkNodeVersion("24\n", "v24.21.0")).toEqual({ ok: true, detail: "Node v24.21.0 matches .nvmrc" });
  });

  it("rejects another major version with the fix", () => {
    const result = checkNodeVersion("24\n", "v22.1.0");
    expect(result.ok).toBe(false);
    expect(result.detail).toBe("Node v22.1.0 is running, .nvmrc requires 24");
    expect(result.fix).toContain("nvm use");
  });
});

describe("dependenciesInstalled", () => {
  it("is false without node_modules", () => {
    expect(dependenciesInstalled(root)).toBe(false);
  });

  it("is false when package-lock.json is newer", () => {
    touch(path.join(root, "node_modules", ".package-lock.json"), new Date("2025-01-01T00:00:00Z"));
    expect(dependenciesInstalled(root)).toBe(false);
  });

  it("is true when the installed lockfile is not older", () => {
    touch(path.join(root, "node_modules", ".package-lock.json"), future);
    expect(dependenciesInstalled(root)).toBe(true);
  });
});

describe("bootstrap", () => {
  const options = () => ({ root, nodeVersion: "v24.21.0", log: vi.fn(), run: vi.fn().mockReturnValue(0) });

  it("fails before installing anything on a Node mismatch", () => {
    const o = { ...options(), nodeVersion: "v22.0.0" };
    expect(bootstrap(o)).toBe(1);
    expect(o.run).not.toHaveBeenCalled();
    expect(o.log).toHaveBeenCalledWith("[failed] Node version: Node v22.0.0 is running, .nvmrc requires 24");
    expect(o.log).toHaveBeenCalledWith(expect.stringContaining("  fix: Run \"nvm use\""));
  });

  it("installs when node_modules is missing, then delegates to the TypeScript setup", () => {
    const o = options();
    expect(bootstrap(o)).toBe(0);
    expect(o.run.mock.calls).toEqual([
      ["npm", ["install"]],
      ["npm", ["run", "setup", "-w", "@devmentor/db"]],
    ]);
    expect(o.log).toHaveBeenCalledWith("[done] Dependencies: ran npm install");
  });

  it("skips the install when dependencies are in sync", () => {
    touch(path.join(root, "node_modules", ".package-lock.json"), future);
    const o = options();
    expect(bootstrap(o)).toBe(0);
    expect(o.run.mock.calls).toEqual([["npm", ["run", "setup", "-w", "@devmentor/db"]]]);
    expect(o.log).toHaveBeenCalledWith("[skipped] Dependencies: node_modules is in sync with package-lock.json");
  });

  it("stops when npm install fails", () => {
    const o = options();
    o.run.mockReturnValue(1);
    expect(bootstrap(o)).toBe(1);
    expect(o.run).toHaveBeenCalledTimes(1);
    expect(o.log).toHaveBeenCalledWith("[failed] Dependencies: npm install failed");
  });

  it("returns the exit code of the TypeScript setup", () => {
    touch(path.join(root, "node_modules", ".package-lock.json"), future);
    const o = options();
    o.run.mockReturnValue(1);
    expect(bootstrap(o)).toBe(1);
  });
});
