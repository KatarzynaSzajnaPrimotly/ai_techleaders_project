import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, inject, it } from "vitest";
import { verifySession } from "../../packages/core/src/http/auth";
import { createUser } from "./helpers/identity";
import { runConcurrently } from "./helpers/concurrency";

const baseUrl = inject("baseUrl");
const databaseUrl = inject("databaseUrl");
const fakeServerUrl = inject("fakeServerUrl");
const jwtSecret = inject("jwtSecret");
const unique = randomUUID().replaceAll("-", "");

interface Identity {
  user: { id: number; login: string; name: string; avatar_url: string };
  emails: Array<{ email: string; primary: boolean; verified: boolean; visibility: "private" }>;
}

function identity(id: number, login: string, email: string): Identity {
  return {
    user: { id, login, name: login, avatar_url: "https://example.test/avatar.png" },
    emails: [{ email, primary: true, verified: true, visibility: "private" }],
  };
}

async function setIdentity(value: Identity, code?: string): Promise<void> {
  const suffix = code ? `?code=${encodeURIComponent(code)}` : "";
  const response = await fetch(`${fakeServerUrl}/__control/github/identity${suffix}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(value),
  });
  if (!response.ok) throw new Error("Failed to configure fake GitHub identity");
}

async function clearFakeIdentity(): Promise<void> {
  await fetch(`${fakeServerUrl}/__control/reset`, { method: "POST" });
}

function firstCookie(response: Response, prefix: string): string {
  const cookie = response.headers.getSetCookie().find((value) => value.startsWith(prefix));
  if (!cookie) throw new Error(`Expected ${prefix} cookie`);
  return cookie.split(";", 1)[0] ?? "";
}

async function startLogin(returnTo?: string): Promise<{ state: string; cookie: string }> {
  const target = new URL("/api/auth/github", baseUrl);
  if (returnTo) target.searchParams.set("returnTo", returnTo);
  const response = await fetch(target, { redirect: "manual" });
  if (response.status !== 303) throw new Error("GitHub login did not start");
  const authorizationUrl = response.headers.get("location");
  if (!authorizationUrl) throw new Error("GitHub authorization URL is missing");
  const state = new URL(authorizationUrl).searchParams.get("state");
  if (!state) throw new Error("OAuth state is missing");
  return { state, cookie: firstCookie(response, "devmentor_oauth_state=") };
}

async function callback(code: string, state: string, cookie: string): Promise<Response> {
  const target = new URL("/api/auth/github/callback", baseUrl);
  target.searchParams.set("code", code);
  target.searchParams.set("state", state);
  return fetch(target, { headers: { cookie }, redirect: "manual" });
}

beforeAll(async () => {
  await clearFakeIdentity();
  await setIdentity(identity(7001, `callback-${unique}`, `callback-${unique}@example.test`));
});

afterAll(clearFakeIdentity);

describe("GitHub OAuth callback integration", () => {
  it("completes the callback, creates a mentee session, and keeps both Set-Cookie headers separate", async () => {
    const login = await startLogin("/home?tab=upcoming");
    const response = await callback(`success-${unique}`, login.state, login.cookie);

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/home?tab=upcoming");
    const cookies = response.headers.getSetCookie();
    expect(cookies).toHaveLength(2);
    expect(cookies[0]).toContain("devmentor_oauth_state=;");
    const sessionCookie = firstCookie(response, "devmentor_session=");
    const token = sessionCookie.slice("devmentor_session=".length);
    await expect(verifySession(token, jwtSecret)).resolves.toMatchObject({ role: "mentee" });
  });

  it("issues the stored mentor role in the session", async () => {
    const githubId = 7301;
    const email = `mentor-callback-${unique}@example.test`;
    await createUser({ email, role: "mentor", githubId: String(githubId), githubLogin: `mentor-${unique}` }, databaseUrl);
    const code = `mentor-${unique}`;
    await setIdentity(identity(githubId, `mentor-${unique}`, email), code);
    const login = await startLogin();
    const response = await callback(code, login.state, login.cookie);

    expect(response.headers.get("location")).toBe("/mentor");
    const token = firstCookie(response, "devmentor_session=").slice("devmentor_session=".length);
    await expect(verifySession(token, jwtSecret)).resolves.toMatchObject({ role: "mentor" });
  });

  it("returns cancellation and clears OAuth state", async () => {
    const response = await fetch(new URL("/api/auth/github/callback?error=access_denied", baseUrl), { redirect: "manual" });
    expect(response.headers.get("location")).toBe("/sign-in?cancelled=1");
    expect(response.headers.getSetCookie()).toEqual([expect.stringContaining("devmentor_oauth_state=;")]);
  });

  it.each(["missing", "tampered"])("rejects %s state", async (mode) => {
    const login = await startLogin();
    const state = mode === "missing" ? "" : `${login.state}tampered`;
    const cookie = mode === "missing" ? "" : login.cookie;
    const response = await callback(`bad-${mode}-${unique}`, state, cookie);
    expect(response.headers.get("location")).toBe("/sign-in?error=state");
    expect(response.headers.getSetCookie()).toEqual([expect.stringContaining("devmentor_oauth_state=;")]);
  });

  it("maps missing verified email to its typed navigation error", async () => {
    const code = `unverified-${unique}`;
    await setIdentity({ ...identity(7002, `unverified-${unique}`, `unverified-${unique}@example.test`), emails: [] }, code);
    const login = await startLogin();
    const response = await callback(code, login.state, login.cookie);
    expect(response.headers.get("location")).toBe("/sign-in?error=no-verified-email");
  });

  it("keeps conflicting existing GitHub links unavailable", async () => {
    const code = `conflict-${unique}`;
    const email = `conflict-${unique}@example.test`;
    await createUser({ email, githubId: "799999", githubLogin: "other-github" }, databaseUrl);
    await setIdentity(identity(7003, `conflict-${unique}`, email), code);
    const login = await startLogin();
    const response = await callback(code, login.state, login.cookie);
    expect(response.headers.get("location")).toBe("/sign-in?error=unavailable");
  });

  it("links only one of two GitHub identities racing for the same unlinked account", async () => {
    const email = `link-race-${unique}@example.test`;
    const account = await createUser({ email }, databaseUrl);
    const codes = [`link-a-${unique}`, `link-b-${unique}`];
    await setIdentity(identity(7101, `github-a-${unique}`, email), codes[0]);
    await setIdentity(identity(7102, `github-b-${unique}`, email), codes[1]);
    const logins = await Promise.all(codes.map(() => startLogin()));

    const responses = await runConcurrently(2, (index) => {
      const login = logins[index];
      const code = codes[index];
      if (!login || !code) throw new Error("Concurrent callback input is missing");
      return callback(code, login.state, login.cookie);
    });

    const locations = responses.map((response) => response.headers.get("location"));
    expect(locations.filter((value) => value === "/home")).toHaveLength(1);
    expect(locations.filter((value) => value === "/sign-in?error=unavailable")).toHaveLength(1);
    const { Client } = await import("pg");
    const client = new Client({ connectionString: databaseUrl });
    await client.connect();
    try {
      const result = await client.query<{ id: string; github_id: string | null }>("SELECT id, github_id FROM users WHERE id = $1", [account.id]);
      expect(result.rows[0]).toMatchObject({ id: account.id });
      expect(["7101", "7102"]).toContain(result.rows[0]?.github_id);
    } finally {
      await client.end();
    }
  });

  it("creates one account when first sign-in callbacks race", async () => {
    const email = `first-race-${unique}@example.test`;
    const github = identity(7201, `first-race-${unique}`, email);
    const codes = [`first-a-${unique}`, `first-b-${unique}`];
    await Promise.all(codes.map((code) => setIdentity(github, code)));
    const logins = await Promise.all(codes.map(() => startLogin()));
    const responses = await runConcurrently(2, (index) => {
      const login = logins[index];
      const code = codes[index];
      if (!login || !code) throw new Error("Concurrent callback input is missing");
      return callback(code, login.state, login.cookie);
    });
    const sessions = await Promise.all(responses.map(async (response) => {
      expect(response.status).toBe(303);
      const token = firstCookie(response, "devmentor_session=").slice("devmentor_session=".length);
      return verifySession(token, jwtSecret);
    }));
    expect(sessions[0]?.userId).toBeTruthy();
    expect(sessions[1]?.userId).toBe(sessions[0]?.userId);
  });

  it("makes logout idempotent and clears stale session cookies with CSRF", async () => {
    const response = await fetch(new URL("/api/auth/logout", baseUrl), {
      method: "POST",
      headers: { "x-devmentor-csrf": "1", cookie: "devmentor_session=expired" },
    });
    expect(response.status).toBe(200);
    expect(response.headers.getSetCookie()).toEqual([expect.stringContaining("devmentor_session=;")]);
  });

  it("rejects logout without CSRF and returns 405 for unsupported route methods", async () => {
    const logout = await fetch(new URL("/api/auth/logout", baseUrl), { method: "POST" });
    expect(logout.status).toBe(403);
    expect(logout.headers.getSetCookie()).toHaveLength(0);
    const unsupported = await fetch(new URL("/api/auth/github", baseUrl), { method: "POST" });
    expect(unsupported.status).toBe(405);
  });
});
