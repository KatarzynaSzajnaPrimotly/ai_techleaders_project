import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ publicProfile: vi.fn() }));
vi.mock("../../../../server/container", () => ({ withScope: (run: (cradle: unknown) => unknown) => run({ mentorService: mocks }) }));

import { dynamic, GET } from "./route";

describe("GET /api/mentors/[slug]", () => {
  beforeEach(() => mocks.publicProfile.mockReset());

  it("returns the public DTO to a signed-out visitor", async () => {
    const dto = { slug: "ada", displayName: "Ada", publicWorkUrl: "https://example.test", bio: "Engineer", stackTags: ["TypeScript"] };
    mocks.publicProfile.mockResolvedValue(dto);
    expect(dynamic).toBe("force-dynamic");
    const response = await GET(new Request("http://devmentor.test/api/mentors/ada"), { params: Promise.resolve({ slug: "ada" }) });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true, data: dto });
    expect(mocks.publicProfile).toHaveBeenCalledWith("ada");
  });
});
