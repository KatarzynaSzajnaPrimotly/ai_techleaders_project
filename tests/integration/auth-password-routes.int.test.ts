import { randomUUID } from "node:crypto";
import { describe, expect, inject, it } from "vitest";
import { REGISTRATION_TOKEN_TTL_SECONDS, signPurposeToken } from "../../packages/core/src/index";

const baseUrl = inject("baseUrl");
const jwtSecret = inject("jwtSecret");
const unique = randomUUID().replaceAll("-", "");
const email = `password-${unique}@example.test`;
const CSRF_HEADERS = { "content-type": "application/json", "x-devmentor-csrf": "1" };
const PASSWORD = "a sufficiently long password";

async function post(path: string, body: unknown): Promise<Response> {
  return fetch(new URL(path, baseUrl), {
    method: "POST",
    headers: CSRF_HEADERS,
    body: JSON.stringify(body),
  });
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
});
