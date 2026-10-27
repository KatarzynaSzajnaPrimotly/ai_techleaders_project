import { randomUUID } from "node:crypto";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { describe, expect, inject, it } from "vitest";
import { REGISTRATION_TOKEN_TTL_SECONDS, signPurposeToken } from "../../packages/core/src/index";
import { Client } from "pg";
import { runConcurrently } from "./helpers/concurrency";

const baseUrl = inject("baseUrl");
const jwtSecret = inject("jwtSecret");
const unique = randomUUID().replaceAll("-", "");
const email = `password-${unique}@example.test`;
const CSRF_HEADERS = { "content-type": "application/json", "x-devmentor-csrf": "1" };
const PASSWORD = "a sufficiently long password";
const browser = path.resolve("node_modules/.bin/agent-browser");

async function post(path: string, body: unknown): Promise<Response> {
  return fetch(new URL(path, baseUrl), {
    method: "POST",
    headers: CSRF_HEADERS,
    body: JSON.stringify(body),
  });
}

async function userCount(targetEmail: string): Promise<number> {
  const client = new Client({ connectionString: inject("databaseUrl") });
  await client.connect();
  try {
    const result = await client.query<{ count: string }>("SELECT count(*)::text AS count FROM users WHERE email = $1", [targetEmail]);
    return Number(result.rows[0]?.count ?? 0);
  } finally {
    await client.end();
  }
}

function forwardedHeaders(spoofed: string, trusted: string): Record<string, string> {
  return { ...CSRF_HEADERS, "x-forwarded-for": `${spoofed}, ${trusted}` };
}

describe("password authentication route integration", () => {
  it("registers generically, confirms once, and logs in without accepting an unsafe returnTo", async () => {
    const registration = await post("/api/auth/register", { email, displayName: "Ada Lovelace" });
    expect(registration.status).toBe(200);
    const genericRegistration = await registration.json();
    expect(genericRegistration).toEqual({ ok: true, data: { message: "Check your e-mail for next steps." } });
    expect(registration.headers.has("set-cookie")).toBe(false);

    const token = await signPurposeToken("register", { email, displayName: "Ada Lovelace", returnTo: "/home?tab=upcoming" }, REGISTRATION_TOKEN_TTL_SECONDS, jwtSecret);
    const confirmation = await post("/api/auth/register/confirm", { token, password: PASSWORD });
    expect(confirmation.status).toBe(200);
    await expect(confirmation.json()).resolves.toEqual({ ok: true, data: { redirectTo: "/home?tab=upcoming" } });
    expect(confirmation.headers.getSetCookie().some((cookie) => cookie.startsWith("devmentor_session=") && cookie.includes("HttpOnly"))).toBe(true);

    const replay = await post("/api/auth/register/confirm", { token, password: PASSWORD });
    expect(replay.status).toBe(401);
    await expect(replay.json()).resolves.toMatchObject({ ok: false, error: { code: "UNAUTHORIZED" } });
    expect(replay.headers.has("set-cookie")).toBe(false);

    const existingAccountRegistration = await post("/api/auth/register", { email, displayName: "Ada Lovelace" });
    expect(existingAccountRegistration.status).toBe(200);
    await expect(existingAccountRegistration.json()).resolves.toEqual(genericRegistration);

    const failedLogin = await post("/api/auth/login", { email, password: "a wrong but sufficiently long password" });
    expect(failedLogin.status).toBe(401);
    await expect(failedLogin.json()).resolves.toEqual({ ok: false, error: { code: "UNAUTHORIZED", message: "Invalid credentials" } });
    expect(failedLogin.headers.has("set-cookie")).toBe(false);

    const login = await post("/api/auth/login", { email, password: PASSWORD, returnTo: "https://evil.example/steal" });
    expect(login.status).toBe(200);
    await expect(login.json()).resolves.toEqual({ ok: true, data: { redirectTo: "/home" } });
    expect(login.headers.getSetCookie().some((cookie) => cookie.startsWith("devmentor_session=") && cookie.includes("HttpOnly"))).toBe(true);
  });

  it("does not consume a valid registration token on GET and protects the confirmation response from caching/referrers", async () => {
    const target = `preview-${unique}@example.test`;
    const token = await signPurposeToken("register", { email: target, displayName: "Preview User" }, REGISTRATION_TOKEN_TTL_SECONDS, jwtSecret);
    const preview = await fetch(new URL(`/register/confirm?token=${encodeURIComponent(token)}`, baseUrl));
    expect(preview.status).toBe(200);
    expect(preview.headers.get("cache-control")).toContain("no-store");
    expect(preview.headers.get("referrer-policy")).toBe("no-referrer");
    expect(await userCount(target)).toBe(0);

    const confirmation = await post("/api/auth/register/confirm", { token, password: PASSWORD });
    expect(confirmation.status).toBe(200);
    expect(await userCount(target)).toBe(1);
  });

  it("allows exactly one of two concurrent confirmations to create an account and issue a session", async () => {
    const target = `race-${unique}@example.test`;
    const token = await signPurposeToken("register", { email: target, displayName: "Race User" }, REGISTRATION_TOKEN_TTL_SECONDS, jwtSecret);
    const responses = await runConcurrently(2, () => post("/api/auth/register/confirm", { token, password: PASSWORD }));
    expect(responses.map(({ status }) => status).sort()).toEqual([200, 401]);
    expect(responses.filter((response) => response.headers.has("set-cookie"))).toHaveLength(1);
    expect(await userCount(target)).toBe(1);
  });

  it("returns identical credential failures without cookies for unknown, wrong-password, and GitHub-only accounts", async () => {
    const githubEmail = `github-only-${unique}@example.test`;
    const client = new Client({ connectionString: inject("databaseUrl") });
    await client.connect();
    try {
      await client.query("INSERT INTO users (email, email_verified_at, display_name, role, github_id, github_login) VALUES ($1, now(), 'GitHub User', 'mentee', $2, 'github-user')", [githubEmail, `gh-${unique}`]);
    } finally {
      await client.end();
    }
    const credentialCases = [
      { email: `unknown-${unique}@example.test`, password: PASSWORD },
      { email, password: "a wrong but sufficiently long password" },
      { email: githubEmail, password: PASSWORD },
    ];
    const failures = await Promise.all(credentialCases.map((body) => post("/api/auth/login", body)));
    const bodies = await Promise.all(failures.map((response) => response.json()));
    expect(failures.map(({ status }) => status)).toEqual([401, 401, 401]);
    expect(bodies[0]).toEqual(bodies[1]);
    expect(bodies[1]).toEqual(bodies[2]);
    expect(failures.every((response) => !response.headers.has("set-cookie"))).toBe(true);
  });

  it("keeps registration responses generic for another person's address and applies per-address cooldown", async () => {
    const target = `owner-${unique}@example.test`;
    const headers = forwardedHeaders("198.51.100.10", "10.10.0.20");
    const first = await fetch(new URL("/api/auth/register", baseUrl), { method: "POST", headers, body: JSON.stringify({ email: target, displayName: "Someone Else" }) });
    const second = await fetch(new URL("/api/auth/register", baseUrl), { method: "POST", headers, body: JSON.stringify({ email: target, displayName: "Someone Else" }) });
    expect(first.status).toBe(200);
    expect(await second.json()).toEqual(await first.json());
    expect(await userCount(target)).toBe(0);
    const third = await fetch(new URL("/api/auth/register", baseUrl), { method: "POST", headers, body: JSON.stringify({ email: target, displayName: "Someone Else" }) });
    expect(third.status).toBe(200);
    const cooledDown = await fetch(new URL("/api/auth/register", baseUrl), { method: "POST", headers, body: JSON.stringify({ email: target, displayName: "Someone Else" }) });
    expect(cooledDown.status).toBe(429);
    expect(Number(cooledDown.headers.get("retry-after"))).toBeGreaterThan(0);
  });

  it("limits registration across many e-mails by the trusted proxy IP, ignoring spoofed earlier hops", async () => {
    const trusted = "10.10.0.21";
    const requests = await Promise.all(Array.from({ length: 5 }, (_, index) => fetch(new URL("/api/auth/register", baseUrl), {
      method: "POST",
      headers: forwardedHeaders(`198.51.100.${index + 1}`, trusted),
      body: JSON.stringify({ email: `ip-bucket-${unique}-${index}@example.test`, displayName: "IP Bucket" }),
    })));
    expect(requests.every((response) => response.status === 200)).toBe(true);
    const blocked = await fetch(new URL("/api/auth/register", baseUrl), {
      method: "POST",
      headers: forwardedHeaders("203.0.113.99", trusted),
      body: JSON.stringify({ email: `ip-bucket-extra-${unique}@example.test`, displayName: "IP Bucket" }),
    });
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get("retry-after"))).toBeGreaterThan(0);
    expect(await blocked.json()).toMatchObject({ ok: false, error: { code: "RATE_LIMITED" } });
  });

  it("shows failed login in place in the browser without reloading the sign-in page", async () => {
    const session = `auth-failure-${unique}`;
    const invoke = (args: string[]) => execFileSync(browser, ["--session", session, ...args, "--json"], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    try {
      invoke(["open", new URL("/sign-in", baseUrl).toString()]);
      invoke(["wait", "1000"]);
      const initial = JSON.parse(invoke(["snapshot", "-i"])) as { data: { origin: string; refs: Record<string, { name: string }> } };
      const refFor = (name: string) => {
        const ref = Object.entries(initial.data.refs).find(([, element]) => element.name === name)?.[0];
        return ref ? `@${ref}` : undefined;
      };
      const emailRef = refFor("E-mail");
      const passwordRef = refFor("Password");
      const submitRef = refFor("Sign in with e-mail");
      expect(emailRef && passwordRef && submitRef).toBeTruthy();
      const initialUrl = initial.data.origin;
      invoke(["fill", emailRef!, `missing-${unique}@example.test`]);
      invoke(["fill", passwordRef!, PASSWORD]);
      invoke(["click", submitRef!]);
      invoke(["wait", "1500"]);
      const result = JSON.parse(invoke(["snapshot"])) as { data: { origin: string; snapshot: string } };
      expect(result.data.snapshot).toContain("Invalid credentials, or sign in with GitHub instead.");
      expect(result.data.origin).toBe(initialUrl);
    } finally {
      try { invoke(["close"]); } catch { /* browser session may not have started */ }
    }
  });
});
