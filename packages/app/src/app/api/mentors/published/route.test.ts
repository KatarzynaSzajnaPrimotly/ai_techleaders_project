import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.hoisted(() => {
  process.env.LOG_LEVEL = "silent";
});

const mocks = vi.hoisted(() => ({ listPublishedProfiles: vi.fn() }));

vi.mock("../../../../server/container", () => ({
  withScope: (run: (cradle: unknown) => Promise<unknown>) => run({ mentorService: { listPublishedProfiles: mocks.listPublishedProfiles } }),
}));
vi.mock("../../../../server/current-session", () => ({ resolveCurrentSession: async (session: unknown) => session }));

import { SESSION_COOKIE, signSession, type Role } from "@devmentor/core";
import { dynamic, GET } from "./route";

const JWT_SECRET = "mentors-published-route-test-secret-long-enough";
const sessions: Record<Role, string> = { mentee: "", mentor: "", operator: "" };

function authHeaders(role: Role): Record<string, string> {
  return { cookie: `${SESSION_COOKIE}=${sessions[role]}` };
}

beforeEach(async () => {
  vi.stubEnv("JWT_SECRET", JWT_SECRET);
  sessions.mentee = await signSession({ userId: "mentee-1", role: "mentee", sessionVersion: 0 }, JWT_SECRET);
  sessions.mentor = await signSession({ userId: "mentor-1", role: "mentor", sessionVersion: 0 }, JWT_SECRET);
  sessions.operator = await signSession({ userId: "operator-1", role: "operator", sessionVersion: 0 }, JWT_SECRET);
  mocks.listPublishedProfiles.mockReset();
});

afterEach(() => vi.unstubAllEnvs());

describe("GET /api/mentors/published", () => {
  it("is rendered on demand and lists only published profiles", async () => {
    const profiles = [{ slug: "ada", displayName: "Ada", publicWorkUrl: "https://example.test", bio: "Engineer", stackTags: [] }];
    mocks.listPublishedProfiles.mockResolvedValue(profiles);
    const response = await GET(new Request("http://localhost/api/mentors/published", { headers: authHeaders("operator") }), undefined);
    expect(dynamic).toBe("force-dynamic");
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, data: profiles });
  });

  it("requires an operator session", async () => {
    const anonymous = await GET(new Request("http://localhost/api/mentors/published"), undefined);
    const mentee = await GET(new Request("http://localhost/api/mentors/published", { headers: authHeaders("mentee") }), undefined);
    const mentor = await GET(new Request("http://localhost/api/mentors/published", { headers: authHeaders("mentor") }), undefined);
    expect(anonymous.status).toBe(401);
    expect(mentee.status).toBe(403);
    expect(mentor.status).toBe(403);
    expect(mocks.listPublishedProfiles).not.toHaveBeenCalled();
  });
});
