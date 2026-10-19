import { execFileSync, spawn, type ChildProcess } from "node:child_process";
import net from "node:net";
import path from "node:path";
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import type { TestProject } from "vitest/node";

declare module "vitest" {
  export interface ProvidedContext {
    baseUrl: string;
  }
}

const root = path.resolve(import.meta.dirname, "../..");
const appDir = path.join(root, "packages/app");
const browserBinary = path.join(root, "node_modules/.bin/agent-browser");

function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address() as net.AddressInfo;
      server.close(() => resolve(port));
    });
  });
}

function run(command: string, args: string[], env: NodeJS.ProcessEnv) {
  try {
    execFileSync(command, args, { cwd: root, env, stdio: "pipe", encoding: "utf8" });
  } catch (error) {
    const failure = error as { stdout?: string; stderr?: string };
    throw new Error(`${command} ${args.join(" ")} failed\n${failure.stdout ?? ""}\n${failure.stderr ?? ""}`);
  }
}

async function waitUntilReady(url: string, server: ChildProcess, logs: () => string) {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`next start exited early (${server.exitCode})\n${logs()}`);
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      // not listening yet
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`The app did not become ready at ${url}\n${logs()}`);
}

export default async function setup(project: TestProject) {
  let container: StartedPostgreSqlContainer | undefined;
  let server: ChildProcess | undefined;

  const stop = async () => {
    if (server?.pid && server.exitCode === null) {
      try {
        process.kill(-server.pid, "SIGTERM");
      } catch {
        // already gone
      }
    }
    try {
      execFileSync(browserBinary, ["close", "--all"], { stdio: "ignore" });
    } catch {
      // no browser session was started
    }
    await container?.stop();
  };

  try {
    let databaseUrl = process.env.INTEGRATION_DATABASE_URL;
    if (!databaseUrl) {
      container = await new PostgreSqlContainer("postgres:17-alpine").start();
      databaseUrl = container.getConnectionUri();
    }

    const env = { ...process.env, DEVMENTOR_DATABASE_URL: databaseUrl, NODE_ENV: "production" };
    run("npm", ["run", "migration:up", "-w", "@devmentor/db"], env);
    if (!process.env.INTEGRATION_SKIP_BUILD) run("npm", ["run", "build"], env);

    const port = await freePort();
    let output = "";
    server = spawn(path.join(root, "node_modules/.bin/next"), ["start", "--port", String(port)], {
      cwd: appDir,
      env,
      detached: true,
    });
    server.stdout?.on("data", (chunk) => (output += chunk));
    server.stderr?.on("data", (chunk) => (output += chunk));

    const baseUrl = `http://127.0.0.1:${port}`;
    await waitUntilReady(baseUrl, server, () => output);
    project.provide("baseUrl", baseUrl);
  } catch (error) {
    await stop();
    throw error;
  }

  return stop;
}
