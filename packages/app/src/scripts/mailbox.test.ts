import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { main } from "./mailbox";

describe("mailbox main", () => {
  let root: string;
  let write: ReturnType<typeof vi.spyOn>;

  async function message(file: string, data: { to?: string; subject?: string; text?: string; receivedAt?: string }) {
    await writeFile(resolve(root, ".ai/qa/mailbox", file), JSON.stringify({
      to: data.to ?? "ada@example.com", subject: data.subject ?? "Subject", text: data.text ?? "Visit https://example.test/token", receivedAt: data.receivedAt ?? "2026-01-01",
    }));
  }

  beforeEach(async () => {
    root = await mkdtemp(resolve(tmpdir(), "mailbox-test-"));
    await mkdir(resolve(root, ".ai/qa/mailbox"), { recursive: true });
    vi.spyOn(process, "cwd").mockReturnValue(root);
    write = vi.spyOn(process.stdout, "write").mockImplementation(() => true);
  });
  afterEach(async () => { vi.restoreAllMocks(); await rm(root, { recursive: true, force: true }); });

  it("prints only the newest matching subject and link, filtered case-insensitively", async () => {
    await message("old.json", { to: "ada@example.com", subject: "Old", receivedAt: "2026-01-01" });
    await message("new.json", { to: "ADA@example.com", subject: "Newest", text: "https://example.test/safe?token=secret", receivedAt: "2026-02-01" });
    await message("other.json", { to: "bob@example.com", subject: "Other", receivedAt: "2026-03-01" });
    await main(["latest", "Ada@Example.com"]);
    expect(write).toHaveBeenCalledExactlyOnceWith("Newest\nhttps://example.test/safe?token=secret\n");
  });

  it("finds the repository root when invoked from the app package", async () => {
    const appDirectory = resolve(root, "packages/app");
    await mkdir(appDirectory, { recursive: true });
    await message("from-app.json", { subject: "App invocation" });
    vi.spyOn(process, "cwd").mockReturnValue(appDirectory);
    await main();
    expect(write).toHaveBeenCalledExactlyOnceWith("App invocation\nhttps://example.test/token\n");
  });

  it("rejects unsupported commands and extra arguments", async () => {
    await expect(main(["send"])).rejects.toThrow("Usage:");
    await expect(main(["latest", "a@example.com", "extra"])).rejects.toThrow("Usage:");
  });

  it("reports no matching file or recipient message", async () => {
    await expect(main()).rejects.toThrow("No matching message found");
    await message("one.json", {});
    await expect(main(["latest", "missing@example.com"])).rejects.toThrow("No matching message found");
  });

  it("reports a missing link in the latest matching message", async () => {
    await message("one.json", { text: "No link here" });
    await expect(main()).rejects.toThrow("does not contain a link");
  });
});
