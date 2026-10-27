import { execFileSync, spawn, type ChildProcess } from "node:child_process";
import { randomBytes } from "node:crypto";
import path from "node:path";
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import type { TestProject } from "vitest/node";
import { startFakeExternalServer, type FakeExternalServer } from "./helpers/fake-external-server";
import { createHarnessEnvironment } from "./helpers/harness-environment";
import { reservePort, type PortReservation } from "./helpers/port";

const APP_READY_TIMEOUT_MS = 60_000;
const APP_READY_POLL_MS = 250;
const JWT_SECRET_BYTES = 32;

declare module "vitest" {
  export interface ProvidedContext {
    baseUrl: string;
    appUrl: string;
    databaseUrl: string;
    fakeServerUrl: string;
    jwtSecret: string;
  }
}

const root = path.resolve(import.meta.dirname, "../..");
const appDir = path.join(root, "packages/app");
const browserBinary = path.join(root, "node_modules/.bin/agent-browser");

function run(command: string, args: string[], env: NodeJS.ProcessEnv) {
  try {
    execFileSync(command, args, { cwd: root, env, stdio: "pipe", encoding: "utf8" });
  } catch (error) {
    const failure = error as { stdout?: string; stderr?: string };
    throw new Error(`${command} ${args.join(" ")} failed\n${failure.stdout ?? ""}\n${failure.stderr ?? ""}`);
  }
}

async function waitUntilReady(url: string, server: ChildProcess, logs: () => string) {
  const deadline = Date.now() + APP_READY_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`next start exited early (${server.exitCode})\n${logs()}`);
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      // not listening yet
    }
    await new Promise((resolve) => setTimeout(resolve, APP_READY_POLL_MS));
  }
  throw new Error(`The app did not become ready at ${url}\n${logs()}`);
}

export default async function setup(project: TestProject) {
  let container: StartedPostgreSqlContainer | undefined;
  let server: ChildProcess | undefined;
  let fakeServer: FakeExternalServer | undefined;
  let portReservation: PortReservation | undefined;

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
    await portReservation?.release();
    await fakeServer?.close();
    await container?.stop();
  };

  try {
    portReservation = await reservePort();
    const appUrl = `http://127.0.0.1:${portReservation.port}`;
    const jwtSecret = randomBytes(JWT_SECRET_BYTES).toString("base64url");
    fakeServer = await startFakeExternalServer();

    let databaseUrl = process.env.INTEGRATION_DATABASE_URL;
    if (!databaseUrl) {
      container = await new PostgreSqlContainer("postgres:17-alpine").start();
      databaseUrl = container.getConnectionUri();
    }

    const env = createHarnessEnvironment({
      base: process.env,
      databaseUrl,
      appUrl,
      fakeServerUrl: fakeServer.url,
      jwtSecret,
    });
    run("npm", ["run", "migration:up", "-w", "@devmentor/db"], env);
    if (!process.env.INTEGRATION_SKIP_BUILD) run("npm", ["run", "build"], env);

    await portReservation.release();
    let output = "";
    server = spawn(path.join(root, "node_modules/.bin/next"), ["start", "--port", String(portReservation.port)], {
      cwd: appDir,
      env,
      detached: true,
    });
    server.stdout?.on("data", (chunk) => (output += chunk));
    server.stderr?.on("data", (chunk) => (output += chunk));

    await waitUntilReady(appUrl, server, () => output);
    project.provide("baseUrl", appUrl);
    project.provide("appUrl", appUrl);
    project.provide("databaseUrl", databaseUrl);
    project.provide("fakeServerUrl", fakeServer.url);
    project.provide("jwtSecret", jwtSecret);
  } catch (error) {
    await stop();
    throw error;
  }

  return stop;
}
