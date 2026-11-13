import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ publicProfile: vi.fn(), publicSlots: vi.fn(), notFound: vi.fn(() => { throw new Error("NEXT_NOT_FOUND"); }) }));
vi.mock("../../../server/container", () => ({ withScope: (run: (cradle: unknown) => unknown) => run({ mentorService: { publicProfile: state.publicProfile }, availabilityService: { publicSlots: state.publicSlots } }) }));
vi.mock("next/navigation", () => ({ notFound: state.notFound }));

import { NotFoundError } from "@devmentor/core";
import PublicMentorPage from "./page";

beforeEach(() => { state.publicProfile.mockReset(); state.publicSlots.mockReset(); state.notFound.mockClear(); });

describe("/m/[slug]", () => {
  it("renders the public profile returned for the requested slug", async () => {
    const profile = { slug: "ada", displayName: "Ada", publicWorkUrl: "https://example.test/work", bio: "Engineer", stackTags: ["TypeScript"], prices: null, isBookable: false };
    state.publicProfile.mockResolvedValue(profile);
    state.publicSlots.mockResolvedValue([]);
    await expect(PublicMentorPage({ params: Promise.resolve({ slug: "ada" }) })).resolves.toMatchObject({ props: { profile, slots: [] } });
    expect(state.publicProfile).toHaveBeenCalledWith("ada");
    expect(state.publicSlots).toHaveBeenCalledWith("ada");
  });

  it("maps only a typed missing profile to the framework 404", async () => {
    state.publicProfile.mockRejectedValue(new NotFoundError("Not found"));
    await expect(PublicMentorPage({ params: Promise.resolve({ slug: "missing" }) })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(state.notFound).toHaveBeenCalledTimes(1);
  });

  it("rethrows non-not-found failures", async () => {
    const failure = new Error("database unavailable");
    state.publicProfile.mockRejectedValue(failure);
    await expect(PublicMentorPage({ params: Promise.resolve({ slug: "ada" }) })).rejects.toBe(failure);
  });
});
