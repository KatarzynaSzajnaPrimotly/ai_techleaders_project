import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.hoisted(() => {
  process.env.LOG_LEVEL = "silent";
});

const mocks = vi.hoisted(() => ({ listPublishedProfiles: vi.fn(), register: vi.fn() }));

vi.mock("../../../server/container", () => ({
  withScope: (run: (cradle: unknown) => Promise<unknown>) =>
  run({ mentorService: { listPublishedProfiles: mocks.listPublishedProfiles, register: mocks.register } }),
}));
vi.mock("../../../server/current-session", () => ({ resolveCurrentSession: async (session: unknown) => session }));

import { ConflictError, SESSION_COOKIE, signSession, type Role } from "@devmentor/core";
import { dynamic, GET, POST } from "./route";

const CSRF = { "x-devmentor-csrf": "1" };
const JWT_SECRET = "mentors-route-test-secret-long-enough-for-hs256";
const sessions: Record<Role, string> = { mentee: "", mentor: "", operator: "" };

function authHeaders(role: Role): Record<string, string> {
  return { ...CSRF, cookie: `${SESSION_COOKIE}=${sessions[role]}` };
}

function post(body: unknown, headers: Record<string, string> = authHeaders("operator"), raw = false) {
  return new Request("http://localhost/api/mentors", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: raw ? (body as string) : JSON.stringify(body),
  });
}

beforeEach(async () => {
  vi.stubEnv("JWT_SECRET", JWT_SECRET);
  sessions.mentee = await signSession({ userId: "mentee-1", role: "mentee", sessionVersion: 0 }, JWT_SECRET);
  sessions.mentor = await signSession({ userId: "mentor-1", role: "mentor", sessionVersion: 0 }, JWT_SECRET);
  sessions.operator = await signSession({ userId: "operator-1", role: "operator", sessionVersion: 0 }, JWT_SECRET);
  mocks.listPublishedProfiles.mockReset();
  mocks.register.mockReset();
});

afterEach(() => vi.unstubAllEnvs());

describe("/api/mentors", () => {
  it("is rendered on demand", () => {
    expect(dynamic).toBe("force-dynamic");
  });

  describe("GET", () => {
    it("lists only published public profiles inside the success envelope", async () => {
      mocks.listPublishedProfiles.mockResolvedValue([{ slug: "ada", displayName: "Ada", publicWorkUrl: "https://example.test", bio: "Engineer", stackTags: [] }]);
      const response = await GET(new Request("http://localhost/api/mentors", { headers: authHeaders("operator") }), undefined);
      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual({ ok: true, data: [{ slug: "ada", displayName: "Ada", publicWorkUrl: "https://example.test", bio: "Engineer", stackTags: [] }] });
    });

    it("requires an operator session", async () => {
      const anonymous = await GET(new Request("http://localhost/api/mentors"), undefined);
      const mentee = await GET(new Request("http://localhost/api/mentors", { headers: { cookie: `${SESSION_COOKIE}=${sessions.mentee}` } }), undefined);
      const mentor = await GET(new Request("http://localhost/api/mentors", { headers: { cookie: `${SESSION_COOKIE}=${sessions.mentor}` } }), undefined);
      expect(anonymous.status).toBe(401);
      expect(mentee.status).toBe(403);
      expect(mentor.status).toBe(403);
      expect(mocks.listPublishedProfiles).not.toHaveBeenCalled();
    });
  });

  describe("POST", () => {
    it.each(["anonymous", "mentee", "mentor"] as const)("rejects %s", async (identity) => {
      const headers = identity === "anonymous" ? CSRF : authHeaders(identity);
      const response = await POST(post({ name: "Ada", email: "a@b.co" }, headers), undefined);
      expect(response.status).toBe(identity === "anonymous" ? 401 : 403);
      expect(mocks.register).not.toHaveBeenCalled();
    });

    it("creates a mentor from the validated, normalised input and answers 201", async () => {
      mocks.register.mockResolvedValue({ id: "1", name: "Ada", email: "ada@example.com" });
      const response = await POST(post({ name: "  Ada ", email: " ADA@Example.com ", id: "evil", status: "x" }), undefined);
      expect(response.status).toBe(201);
      await expect(response.json()).resolves.toEqual({
        ok: true,
        data: { id: "1", name: "Ada", email: "ada@example.com" },
      });
      expect(mocks.register).toHaveBeenCalledWith({ name: "Ada", email: "ada@example.com" });
    });

    it("rejects a request without the CSRF header", async () => {
      const response = await POST(post({ name: "Ada", email: "a@b.co" }, {}), undefined);
      expect(response.status).toBe(403);
      expect(mocks.register).not.toHaveBeenCalled();
    });

    it("rejects invalid input with per-field errors", async () => {
      const response = await POST(post({ name: " ", email: "nope" }), undefined);
      expect(response.status).toBe(400);
      const body = (await response.json()) as { error: { code: string; fieldErrors: Record<string, string[]> } };
      expect(body.error.code).toBe("VALIDATION_ERROR");
      expect(body.error.fieldErrors.name).toEqual(["Name is required"]);
      expect(body.error.fieldErrors.email).toEqual(["Email is invalid"]);
      expect(mocks.register).not.toHaveBeenCalled();
    });

    it("rejects a body that is not valid JSON", async () => {
      const response = await POST(post("not json", authHeaders("operator"), true), undefined);
      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toMatchObject({ error: { message: "Request body must be valid JSON" } });
    });

    it("maps a duplicate mentor to 409 without database details", async () => {
      mocks.register.mockRejectedValue(new ConflictError("A mentor with email ada@example.com already exists"));
      const response = await POST(post({ name: "Ada", email: "ada@example.com" }), undefined);
      expect(response.status).toBe(409);
      await expect(response.json()).resolves.toEqual({
        ok: false,
        error: { code: "CONFLICT", message: "A mentor with email ada@example.com already exists" },
      });
    });

    it("hides unexpected errors behind a generic 500", async () => {
      mocks.register.mockRejectedValue(new Error("password=secret leaked"));
      const response = await POST(post({ name: "Ada", email: "ada@example.com" }), undefined);
      expect(response.status).toBe(500);
      const text = await response.text();
      expect(text).not.toContain("secret");
      expect(JSON.parse(text).error.message).toBe("Internal server error");
    });
  });
});
