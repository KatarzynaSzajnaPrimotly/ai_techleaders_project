import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, inject, it } from "vitest";
import { SESSION_COOKIE, verifySession } from "../../packages/core/src/http/auth";
import { createUser, mintSessionCookie } from "./helpers/identity";

const baseUrl = inject("baseUrl");
const databaseUrl = inject("databaseUrl");
const fakeServerUrl = inject("fakeServerUrl");
const jwtSecret = inject("jwtSecret");
const OPERATOR_EMAIL = inject("operatorEmail");
const LISTED_MENTOR_EMAIL = inject("listedMentorEmail");
const unique = randomUUID().replaceAll("-", "");

function githubIdFor(offset: number): number {
  return Number.parseInt(unique.slice(0, 7), 16) + offset;
}
const CSRF_HEADERS = { "content-type": "application/json", "x-devmentor-csrf": "1" };

interface Identity {
  user: { id: number; login: string; name: string; avatar_url: string };
  emails: Array<{ email: string; primary: boolean; verified: boolean; visibility: "private" }>;
}

function githubIdentity(id: number, login: string, email: string): Identity {
  return {
    user: { id, login, name: login, avatar_url: "https://example.test/avatar.png" },
    emails: [{ email, primary: true, verified: true, visibility: "private" }],
  };
}

async function configureIdentity(identity: Identity, code: string): Promise<void> {
  const response = await fetch(`${fakeServerUrl}/__control/github/identity?code=${encodeURIComponent(code)}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(identity),
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

async function startGithubLogin(): Promise<{ state: string; cookie: string }> {
  const response = await fetch(new URL("/api/auth/github", baseUrl), { redirect: "manual" });
  if (response.status !== 303) throw new Error("GitHub login did not start");
  const authorizationUrl = response.headers.get("location");
  if (!authorizationUrl) throw new Error("GitHub authorization URL is missing");
  const state = new URL(authorizationUrl).searchParams.get("state");
  if (!state) throw new Error("OAuth state is missing");
  return { state, cookie: firstCookie(response, "devmentor_oauth_state=") };
}

async function completeGithubLogin(code: string, state: string, cookie: string): Promise<Response> {
  const callbackUrl = new URL("/api/auth/github/callback", baseUrl);
  callbackUrl.searchParams.set("code", code);
  callbackUrl.searchParams.set("state", state);
  return fetch(callbackUrl, { headers: { cookie }, redirect: "manual" });
}

beforeAll(clearFakeIdentity);
afterAll(clearFakeIdentity);

describe("operator access integration", () => {
  it("refuses local mock identities in the production integration server", async () => {
    const response = await fetch(new URL("/api/auth/github?login=mock-mentee", baseUrl), { redirect: "manual" });
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/sign-in?error=unavailable");
  });

  it("requires an operator session to create a mentor", async () => {
    const anonymous = await fetch(new URL("/api/mentors", baseUrl), {
      method: "POST",
      headers: CSRF_HEADERS,
      body: JSON.stringify({ name: "Anonymous", email: `anonymous-${unique}@example.test` }),
    });
    expect(anonymous.status).toBe(401);

    for (const role of ["mentee", "mentor"] as const) {
      const token = await mintSessionCookie({ userId: `${role}-${unique}`, role }, jwtSecret);
      const denied = await fetch(new URL("/api/mentors", baseUrl), {
        method: "POST",
        headers: { ...CSRF_HEADERS, cookie: `${SESSION_COOKIE}=${token}` },
        body: JSON.stringify({ name: role, email: `${role}-${unique}@example.test` }),
      });
      expect(denied.status).toBe(403);
      await expect(denied.json()).resolves.toMatchObject({ ok: false, error: { code: "FORBIDDEN" } });
    }
  });

  it("redirects anonymous and wrong-role visitors away from the operator page with 307", async () => {
    const anonymous = await fetch(new URL("/admin/mentors", baseUrl), { redirect: "manual" });
    expect(anonymous.status).toBe(307);
    expect(anonymous.headers.get("location")).toBe("/sign-in?returnTo=%2Fadmin%2Fmentors");

    for (const [role, home] of [["mentee", "/home"], ["mentor", "/mentor"]] as const) {
      const account = await createUser({ email: `wrong-role-${role}-${unique}@example.test`, role }, databaseUrl);
      const token = await mintSessionCookie({ userId: account.id, role }, jwtSecret);
      const denied = await fetch(new URL("/admin/mentors", baseUrl), {
        headers: { cookie: `${SESSION_COOKIE}=${token}` },
        redirect: "manual",
      });
      expect(denied.status).toBe(307);
      expect(denied.headers.get("location")).toBe(home);
    }
  });

  it("gives an allowlisted GitHub mentee operator access and permits mentor creation", async () => {
    const code = `operator-${unique}`;
    await configureIdentity(githubIdentity(githubIdFor(81_001), `operator-${unique}`, OPERATOR_EMAIL), code);
    const login = await startGithubLogin();
    const response = await completeGithubLogin(code, login.state, login.cookie);
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/admin/mentors");

    const sessionCookie = firstCookie(response, `${SESSION_COOKIE}=`);
    const token = sessionCookie.slice(`${SESSION_COOKIE}=`.length);
    await expect(verifySession(token, jwtSecret)).resolves.toMatchObject({ role: "operator" });

    const page = await fetch(new URL("/admin/mentors", baseUrl), { headers: { cookie: sessionCookie }, redirect: "manual" });
    expect(page.status).toBe(200);
    const created = await fetch(new URL("/api/mentors", baseUrl), {
      method: "POST",
      headers: { ...CSRF_HEADERS, cookie: sessionCookie },
      body: JSON.stringify({ name: "Operator created", email: `created-${unique}@example.test` }),
    });
    expect(created.status).toBe(201);
    await expect(created.json()).resolves.toMatchObject({ ok: true, data: { name: "Operator created" } });
  });

  it("keeps an allowlisted account with stored mentor role as mentor after GitHub sign-in", async () => {
    const user = await createUser({ email: LISTED_MENTOR_EMAIL, role: "mentor" }, databaseUrl);
    const code = `listed-mentor-${unique}`;
    await configureIdentity(githubIdentity(githubIdFor(81_002), `listed-mentor-${unique}`, LISTED_MENTOR_EMAIL), code);
    const login = await startGithubLogin();
    const response = await completeGithubLogin(code, login.state, login.cookie);
    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/mentor");

    const sessionCookie = firstCookie(response, `${SESSION_COOKIE}=`);
    const token = sessionCookie.slice(`${SESSION_COOKIE}=`.length);
    await expect(verifySession(token, jwtSecret)).resolves.toEqual({ userId: user.id, role: "mentor" });
    const operatorPage = await fetch(new URL("/admin/mentors", baseUrl), { headers: { cookie: sessionCookie }, redirect: "manual" });
    expect(operatorPage.status).toBe(307);
    expect(operatorPage.headers.get("location")).toBe("/mentor");
  });
});
