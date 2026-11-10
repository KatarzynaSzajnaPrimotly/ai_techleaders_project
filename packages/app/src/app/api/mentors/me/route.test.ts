import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  mentorService: { profile: vi.fn(), updateProfile: vi.fn() },
}));
vi.mock("../../../../server/container", () => ({ withScope: (run: (cradle: unknown) => unknown) => run({ mentorService: mocks.mentorService }) }));
vi.mock("../../../../server/current-session", () => ({ resolveCurrentSession: async (session: unknown) => session }));

import { SESSION_COOKIE, signSession } from "@devmentor/core";
import { dynamic, GET, PUT } from "./route";

const SECRET = "e02-mentor-profile-route-secret-at-least-32-characters";
const profile = { id: "profile-1", publicWorkUrl: null, bio: null, sessionChannel: null, stackTags: [], slug: null, publishedAt: null, readiness: { publicWorkUrl: false, bio: false, sessionChannel: false } };

async function mentorCookie() {
  const token = await signSession({ userId: "mentor-1", role: "mentor", roles: ["mentee", "mentor"], sessionVersion: 1 }, SECRET);
  return `${SESSION_COOKIE}=${token}`;
}

beforeEach(() => {
  vi.stubEnv("JWT_SECRET", SECRET);
  mocks.mentorService.profile.mockReset().mockResolvedValue(profile);
  mocks.mentorService.updateProfile.mockReset().mockResolvedValue(profile);
});
afterEach(() => vi.unstubAllEnvs());

describe("/api/mentors/me", () => {
  it("loads only the signed-in mentor's owner projection", async () => {
    expect(dynamic).toBe("force-dynamic");
    const response = await GET(new Request("http://devmentor.test/api/mentors/me", { headers: { cookie: await mentorCookie() } }), undefined);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, data: profile });
    expect(mocks.mentorService.profile).toHaveBeenCalledWith("mentor-1");
  });

  it("requires the mentor role to read and save the owner profile", async () => {
    const token = await signSession({ userId: "mentee-1", role: "mentee", roles: ["mentee"], sessionVersion: 0 }, SECRET);
    const request = new Request("http://devmentor.test/api/mentors/me", { headers: { cookie: `${SESSION_COOKIE}=${token}` } });
    expect((await GET(request, undefined)).status).toBe(403);
    expect((await PUT(new Request(request.url, { method: "PUT", headers: { cookie: `${SESSION_COOKIE}=${token}`, "content-type": "application/json", "x-devmentor-csrf": "1" }, body: "{}" }), undefined)).status).toBe(403);
    expect(mocks.mentorService.profile).not.toHaveBeenCalled();
    expect(mocks.mentorService.updateProfile).not.toHaveBeenCalled();
  });

  it("validates updates, rejects owner-id injection, and requires CSRF", async () => {
    const cookie = await mentorCookie();
    const response = await PUT(new Request("http://devmentor.test/api/mentors/me", {
      method: "PUT", headers: { cookie, "content-type": "application/json", "x-devmentor-csrf": "1" },
      body: JSON.stringify({ publicWorkUrl: "https://example.test/work", sessionChannel: "private-room", userId: "other-mentor" }),
    }), undefined);
    expect(response.status).toBe(400);
    expect(mocks.mentorService.updateProfile).not.toHaveBeenCalled();

    const noCsrf = await PUT(new Request("http://devmentor.test/api/mentors/me", {
      method: "PUT", headers: { cookie, "content-type": "application/json" }, body: JSON.stringify({ bio: "Engineer" }),
    }), undefined);
    expect(noCsrf.status).toBe(403);
  });

  it("saves a parsed draft against the authenticated account", async () => {
    const cookie = await mentorCookie();
    const response = await PUT(new Request("http://devmentor.test/api/mentors/me", {
      method: "PUT", headers: { cookie, "content-type": "application/json", "x-devmentor-csrf": "1" },
      body: JSON.stringify({ publicWorkUrl: "https://example.test/work", bio: "Engineer", sessionChannel: "  Private room  ", stackTags: ["React"] }),
    }), undefined);
    expect(response.status).toBe(200);
    expect(mocks.mentorService.updateProfile).toHaveBeenCalledWith("mentor-1", {
      publicWorkUrl: "https://example.test/work", bio: "Engineer", sessionChannel: "Private room", stackTags: ["React"],
    });
  });
});
