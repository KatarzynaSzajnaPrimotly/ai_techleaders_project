import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ invitationService: { onboardingStatus: vi.fn() } }));
vi.mock("../../../../../server/container", () => ({ withScope: (run: (cradle: unknown) => unknown) => run(mocks) }));
vi.mock("../../../../../server/current-session", () => ({ resolveCurrentSession: async (session: unknown) => session }));

import { SESSION_COOKIE, signSession } from "@devmentor/core";
import { dynamic, GET } from "./route";

const SECRET = "e02-onboarding-route-secret-at-least-32-characters";

beforeEach(() => {
  vi.stubEnv("JWT_SECRET", SECRET);
  mocks.invitationService.onboardingStatus.mockReset().mockResolvedValue({ initialPublishDueAt: new Date("2026-11-23T12:00:00Z") });
});
afterEach(() => vi.unstubAllEnvs());

describe("GET /api/mentors/me/onboarding", () => {
  it("requires a mentor grant and returns the persistent onboarding deadline", async () => {
    expect(dynamic).toBe("force-dynamic");
    const token = await signSession({ userId: "user-1", role: "mentor", roles: ["mentee", "mentor"], sessionVersion: 3 }, SECRET);
    const response = await GET(new Request("http://devmentor.test/api/mentors/me/onboarding", { headers: { cookie: `${SESSION_COOKIE}=${token}` } }), undefined);
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, data: { initialPublishDueAt: "2026-11-23T12:00:00.000Z" } });
    expect(mocks.invitationService.onboardingStatus).toHaveBeenCalledWith("user-1");
  });

  it("rejects sessions without mentor grants", async () => {
    const token = await signSession({ userId: "user-1", role: "mentee", roles: ["mentee"], sessionVersion: 0 }, SECRET);
    const response = await GET(new Request("http://devmentor.test/api/mentors/me/onboarding", { headers: { cookie: `${SESSION_COOKIE}=${token}` } }), undefined);
    expect(response.status).toBe(403);
    expect(mocks.invitationService.onboardingStatus).not.toHaveBeenCalled();
  });
});
