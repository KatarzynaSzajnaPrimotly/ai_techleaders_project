import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ publishProfile: vi.fn() }));
vi.mock("../../../../../server/container", () => ({ withScope: (run: (cradle: unknown) => unknown) => run({ mentorService: mocks }) }));
vi.mock("../../../../../server/current-session", () => ({ resolveCurrentSession: async (session: unknown) => session }));

import { SESSION_COOKIE, signSession } from "@devmentor/core";
import { dynamic, POST } from "./route";

const SECRET = "e02-mentor-publish-route-secret-at-least-32-characters";
beforeEach(() => {
  vi.stubEnv("JWT_SECRET", SECRET);
  mocks.publishProfile.mockReset().mockResolvedValue({ slug: "ada", publishedAt: new Date(0) });
});
afterEach(() => vi.unstubAllEnvs());

describe("POST /api/mentors/me/publish", () => {
  it("publishes the current mentor's profile and requires CSRF", async () => {
    expect(dynamic).toBe("force-dynamic");
    const token = await signSession({ userId: "mentor-1", role: "mentor", roles: ["mentor"], sessionVersion: 0 }, SECRET);
    const headers = { cookie: `${SESSION_COOKIE}=${token}`, "content-type": "application/json", "x-devmentor-csrf": "1" };
    const response = await POST(new Request("http://devmentor.test/api/mentors/me/publish", { method: "POST", headers, body: "{}" }), undefined);
    expect(response.status).toBe(200);
    expect(mocks.publishProfile).toHaveBeenCalledWith("mentor-1");
    const denied = await POST(new Request("http://devmentor.test/api/mentors/me/publish", { method: "POST", headers: { cookie: `${SESSION_COOKIE}=${token}` }, body: "{}" }), undefined);
    expect(denied.status).toBe(403);
  });
});
