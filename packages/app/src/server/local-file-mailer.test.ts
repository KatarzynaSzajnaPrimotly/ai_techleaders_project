import { mkdtemp, readFile, readdir, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createLocalFileMailer } from "./local-file-mailer";

const directories: string[] = [];

afterEach(async () => {
  await Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

describe("createLocalFileMailer", () => {
  it("captures the full message in a private local mailbox", async () => {
    const directory = await mkdtemp(join(tmpdir(), "devmentor-mailbox-"));
    directories.push(directory);
    await createLocalFileMailer(join(directory, "messages")).send({
      to: "ada@example.test",
      subject: "Confirm your account",
      text: "Open https://devmentor.example/register/confirm?token=one-time-token",
    });

    const mailbox = join(directory, "messages");
    const [file] = await readdir(mailbox);
    const message = JSON.parse(await readFile(join(mailbox, file!), "utf8"));
    expect(message).toMatchObject({ to: "ada@example.test", text: expect.stringContaining("token=one-time-token") });
    expect((await stat(mailbox)).mode & 0o777).toBe(0o700);
    expect((await stat(join(mailbox, file!))).mode & 0o777).toBe(0o600);
  });

  it("requires an explicit mailbox directory", () => {
    expect(() => createLocalFileMailer(undefined)).toThrow("LOCAL_MAILBOX_DIR is required");
  });
});
