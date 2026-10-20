import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { envFileStep } from "./env-file.step";

let root: string;
const target = () => path.join(root, "packages/app/.env.local");

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "devmentor-setup-"));
  fs.mkdirSync(path.join(root, "packages/app"), { recursive: true });
  fs.writeFileSync(path.join(root, ".env.example"), "DEVMENTOR_DATABASE_URL=example\n");
});

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

describe("envFileStep", () => {
  it("creates the env file from the example", async () => {
    const outcome = await envFileStep(root).run();
    expect(outcome.status).toBe("done");
    expect(fs.readFileSync(target(), "utf8")).toBe("DEVMENTOR_DATABASE_URL=example\n");
  });

  it("never overwrites an existing env file", async () => {
    fs.writeFileSync(target(), "mine=1\n");
    const outcome = await envFileStep(root).run();
    expect(outcome.status).toBe("skipped");
    expect(fs.readFileSync(target(), "utf8")).toBe("mine=1\n");
  });

  it("is skipped on a second run", async () => {
    await envFileStep(root).run();
    expect((await envFileStep(root).run()).status).toBe("skipped");
  });
});
