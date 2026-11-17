import { readdir, readFile } from "node:fs/promises";
import { basename, resolve } from "node:path";

export async function main(args = process.argv.slice(2)): Promise<void> {
  const [command = "latest", recipient] = args;
  if (command !== "latest" || args.length > 2) throw new Error("Usage: npm run mailbox -- latest [recipient-email]");
  const repositoryRoot = basename(process.cwd()) === "app" ? resolve(process.cwd(), "../..") : process.cwd();
  const directory = resolve(repositoryRoot, ".ai/qa/mailbox");
  const entries = await readdir(directory);
  const messages = await Promise.all(entries.filter((name) => name.endsWith(".json")).map(async (name) => {
    const content = JSON.parse(await readFile(resolve(directory, name), "utf8")) as { to: string; subject: string; text: string; receivedAt: string };
    return { ...content, file: name };
  }));
  const message = messages.filter((item) => !recipient || item.to.toLowerCase() === recipient.toLowerCase())
    .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))[0];
  if (!message) throw new Error("No matching message found in the local QA mailbox");
  const link = message.text.match(/https?:\/\/\S+/)?.[0];
  if (!link) throw new Error("The latest matching message does not contain a link");
  process.stdout.write(`${message.subject}\n${link}\n`);
}

