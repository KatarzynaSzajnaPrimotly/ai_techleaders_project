import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const service = vi.hoisted(() => ({ remove: vi.fn() }));
vi.mock("../../../../../server/container", () => ({ withScope: (run: (cradle: unknown) => unknown) => run({ availabilityService: service }) }));
vi.mock("../../../../../server/current-session", () => ({ resolveCurrentSession: async (session: unknown) => session }));

import { SESSION_COOKIE, signSession } from "@devmentor/core";
import { DELETE, dynamic } from "./route";

const SECRET = "e02-availability-delete-route-secret-at-least-32-characters";
const slotId = "70782fd4-7eb6-4ac6-92cc-cf529c1dc11f";

beforeEach(() => {
  vi.stubEnv("JWT_SECRET", SECRET);
  service.remove.mockReset().mockResolvedValue({ id: slotId });
});
afterEach(() => vi.unstubAllEnvs());

async function mentorCookie() {
  const token = await signSession({ userId: "owner-1", role: "mentor", roles: ["mentor"], sessionVersion: 1 }, SECRET);
  return `${SESSION_COOKIE}=${token}`;
}

describe("DELETE /api/availability/slots/[id]", () => {
  it("removes a slot belonging to the current mentor and requires CSRF", async () => {
    expect(dynamic).toBe("force-dynamic");
    const cookie = await mentorCookie();
    const response = await DELETE(new Request(`http://devmentor.test/api/availability/slots/${slotId}`, { method: "DELETE", headers: { cookie, "x-devmentor-csrf": "1" } }), { params: Promise.resolve({ id: slotId }) });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ data: { id: slotId } });
    expect(service.remove).toHaveBeenCalledWith("owner-1", slotId);
    const denied = await DELETE(new Request(`http://devmentor.test/api/availability/slots/${slotId}`, { method: "DELETE", headers: { cookie } }), { params: Promise.resolve({ id: slotId }) });
    expect(denied.status).toBe(403);
  });

  it("rejects a malformed slot id", async () => {
    const response = await DELETE(new Request("http://devmentor.test/api/availability/slots/not-a-uuid", { method: "DELETE", headers: { cookie: await mentorCookie(), "x-devmentor-csrf": "1" } }), { params: Promise.resolve({ id: "not-a-uuid" }) });
    expect(response.status).toBe(400);
    expect(service.remove).not.toHaveBeenCalled();
  });
});
