import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ invitationService: { accept: vi.fn() } }));
vi.mock("../../../../../server/container", () => ({ withScope: (run: (cradle: unknown) => unknown) => run(mocks) }));
vi.mock("../../../../../server/current-session", () => ({ resolveCurrentSession: async (session: unknown) => session }));

import { ForbiddenError, SESSION_COOKIE, verifySession } from "@devmentor/core";
import { dynamic, POST } from "./route";

const SECRET = "e02-accept-route-secret-at-least-32-characters";
const REQUEST_HEADERS = { "x-devmentor-csrf": "1" };
const accepted = {
  user: { id: "user-1", email: "ada@example.test", role: "mentee" as const, roles: ["mentee", "mentor"] as ("mentee" | "mentor")[], sessionVersion: 3 },
  roles: ["mentee", "mentor"],
  publishDueAt: new Date("2026-11-23T12:00:00Z"),
};

function request(headers: Record<string, string> = {}) {
  return new Request("http://devmentor.test/api/invitations/token/accept", { method: "POST", headers: { ...REQUEST_HEADERS, ...headers } });
}

beforeEach(() => {
  vi.stubEnv("JWT_SECRET", SECRET);
  vi.stubEnv("NODE_ENV", "test");
  mocks.invitationService.accept.mockReset().mockResolvedValue(accepted);
});
afterEach(() => vi.unstubAllEnvs());

describe("POST /api/invitations/[token]/accept", () => {
  it("requires a session, returns the additive roles and deadline, and renews the session after acceptance", async () => {
    expect(dynamic).toBe("force-dynamic");
    const currentSession = await import("@devmentor/core").then(({ signSession }) => signSession({ userId: "user-1", role: "mentee", sessionVersion: 2 }, SECRET));
    const response = await POST(request({ cookie: `${SESSION_COOKIE}=${currentSession}` }), { params: Promise.resolve({ token: "opaque" }) });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, data: { roles: ["mentee", "mentor"], publishDueAt: "2026-11-23T12:00:00.000Z", redirectTo: "/mentor" } });
    expect(mocks.invitationService.accept).toHaveBeenCalledWith("opaque", "user-1");
    const cookie = response.headers.get("set-cookie") ?? "";
    const token = cookie.split(";", 1)[0]?.slice(`${SESSION_COOKIE}=`.length);
    await expect(verifySession(token ?? "", SECRET)).resolves.toEqual({ userId: "user-1", role: "mentor", roles: ["mentee", "mentor"], sessionVersion: 3 });
  });

  it("relies on central CSRF enforcement and does not reach the service without the header", async () => {
    const sessionToken = await import("@devmentor/core").then(({ signSession }) => signSession({ userId: "user-1", role: "mentee", sessionVersion: 2 }, SECRET));
    const response = await POST(request({ cookie: `${SESSION_COOKIE}=${sessionToken}`, "x-devmentor-csrf": "" }), { params: Promise.resolve({ token: "opaque" }) });
    expect(response.status).toBe(403);
    expect(mocks.invitationService.accept).not.toHaveBeenCalled();
    expect(response.headers.has("set-cookie")).toBe(false);
  });

  it("returns the service's verified-email denial without issuing a fresh session", async () => {
    mocks.invitationService.accept.mockRejectedValue(new ForbiddenError("Sign in with the verified e-mail address invited"));
    const sessionToken = await import("@devmentor/core").then(({ signSession }) => signSession({ userId: "user-1", role: "mentee", sessionVersion: 2 }, SECRET));
    const response = await POST(request({ cookie: `${SESSION_COOKIE}=${sessionToken}` }), { params: Promise.resolve({ token: "opaque" }) });
    expect(response.status).toBe(403);
    expect(response.headers.has("set-cookie")).toBe(false);
  });
});
