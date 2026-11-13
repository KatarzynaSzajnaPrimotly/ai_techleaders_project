import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.hoisted(() => {
  process.env.LOG_LEVEL = "silent";
});

const mocks = vi.hoisted(() => ({ list: vi.fn(), register: vi.fn() }));

vi.mock("../../../server/container", () => ({
  withScope: (run: (cradle: unknown) => Promise<unknown>) =>
    run({ mentorService: { list: mocks.list, register: mocks.register } }),
}));
vi.mock("../../../server/current-session", () => ({ resolveCurrentSession: async (session: unknown) => session }));

import { SESSION_COOKIE, signSession, type Role } from "@devmentor/core";
import { dynamic, GET, POST } from "./route";

const JWT_SECRET = "mentors-route-test-secret-long-enough-for-hs256";
const sessions: Record<Role, string> = { mentee: "", mentor: "", operator: "" };

function authHeaders(role: Role): Record<string, string> {
  return { cookie: `${SESSION_COOKIE}=${sessions[role]}` };
}

beforeEach(async () => {
  vi.stubEnv("JWT_SECRET", JWT_SECRET);
  sessions.mentee = await signSession({ userId: "mentee-1", role: "mentee", sessionVersion: 0 }, JWT_SECRET);
  sessions.mentor = await signSession({ userId: "mentor-1", role: "mentor", sessionVersion: 0 }, JWT_SECRET);
  sessions.operator = await signSession({ userId: "operator-1", role: "operator", sessionVersion: 0 }, JWT_SECRET);
  mocks.list.mockReset();
  mocks.register.mockReset();
});

afterEach(() => vi.unstubAllEnvs());

describe("/api/mentors", () => {
  it("is rendered on demand", () => {
    expect(dynamic).toBe("force-dynamic");
  });

  it("preserves the legacy mentor list shape in the success envelope", async () => {
    const mentors = [{ id: "mentor-1", name: "Ada", email: "ada@example.test", createdAt: new Date("2026-01-01T00:00:00.000Z") }];
    mocks.list.mockResolvedValue(mentors);
    const response = await GET(new Request("http://localhost/api/mentors", { headers: authHeaders("operator") }), undefined);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, data: [{ ...mentors[0], createdAt: "2026-01-01T00:00:00.000Z" }] });
  });

  it("requires an operator session for listing", async () => {
    const anonymous = await GET(new Request("http://localhost/api/mentors"), undefined);
    const mentee = await GET(new Request("http://localhost/api/mentors", { headers: authHeaders("mentee") }), undefined);
    const mentor = await GET(new Request("http://localhost/api/mentors", { headers: authHeaders("mentor") }), undefined);
    expect(anonymous.status).toBe(401);
    expect(mentee.status).toBe(403);
    expect(mentor.status).toBe(403);
    expect(mocks.list).not.toHaveBeenCalled();
  });

  it("keeps the POST method contract while disabling direct registration", async () => {
    const response = await POST(new Request("http://localhost/api/mentors", {
      method: "POST",
      headers: { ...authHeaders("operator"), "content-type": "application/json" },
      body: JSON.stringify({ name: "Ada", email: "ada@example.test" }),
    }), undefined);
    expect(response.status).toBe(405);
    expect(await response.json()).toMatchObject({ ok: false });
    expect(mocks.register).not.toHaveBeenCalled();
  });
});
