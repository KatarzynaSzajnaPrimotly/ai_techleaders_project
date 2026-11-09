import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ invitationService: { lookup: vi.fn() } }));
vi.mock("../../../../server/container", () => ({ withScope: (run: (cradle: unknown) => unknown) => run(mocks) }));
vi.mock("../../../../server/current-session", () => ({ resolveCurrentSession: async (session: unknown) => session }));

import { dynamic, GET } from "./route";

describe("GET /api/invitations/[token]", () => {
  beforeEach(() => mocks.invitationService.lookup.mockReset().mockResolvedValue({ email: "ada@example.test", stackTags: ["TypeScript"], expiresAt: new Date("2026-11-23T00:00:00Z") }));
  afterEach(() => vi.restoreAllMocks());

  it("is dynamic and returns only the public invitation projection", async () => {
    expect(dynamic).toBe("force-dynamic");
    const response = await GET(new Request("http://devmentor.test/api/invitations/token"), { params: Promise.resolve({ token: "opaque" }) });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, data: { email: "ada@example.test", stackTags: ["TypeScript"], expiresAt: "2026-11-23T00:00:00.000Z" } });
    expect(mocks.invitationService.lookup).toHaveBeenCalledWith("opaque");
  });
});
