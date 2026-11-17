import { randomUUID } from "node:crypto";
import { chmod, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { MailerPort } from "@devmentor/core";

/** QA-only mailbox: stores complete messages locally so browser flows can be tested without SMTP. */
export function createLocalFileMailer(directory: string | undefined): MailerPort {
  if (!directory?.trim()) throw new Error("LOCAL_MAILBOX_DIR is required when MAILER_TRANSPORT=local-file");
  const mailboxDirectory = resolve(directory);

  return {
    async send(message) {
      await mkdir(mailboxDirectory, { recursive: true, mode: 0o700 });
      const filePath = resolve(mailboxDirectory, `${Date.now()}-${randomUUID()}.json`);
      await writeFile(filePath, `${JSON.stringify({ ...message, receivedAt: new Date().toISOString() }, null, 2)}\n`, { encoding: "utf8", mode: 0o600, flag: "wx" });
      await chmod(filePath, 0o600);
      await chmod(mailboxDirectory, 0o700);
    },
  };
}
