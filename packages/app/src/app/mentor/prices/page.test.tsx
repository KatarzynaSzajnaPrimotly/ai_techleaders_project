import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ token: "valid", role: "mentor" as "mentee" | "mentor", destination: "", configuration: { prices: null, priceBounds: null } }));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => state.token ? { value: state.token } : undefined }) }));
vi.mock("next/navigation", () => ({ redirect: (path: string) => { state.destination = path; throw new Error("NEXT_REDIRECT"); } }));
vi.mock("@devmentor/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@devmentor/core")>();
  return { ...actual, requireJwtSecret: () => "test-secret-with-enough-random-bytes-12345", verifySession: async () => ({ userId: "user-1", role: state.role, sessionVersion: 0 }) };
});
vi.mock("../../../server/current-session", () => ({ resolveCurrentSession: async (session: unknown) => session }));
vi.mock("../../../server/container", () => ({ withScope: (run: (cradle: unknown) => unknown) => run({ mentorService: { priceConfiguration: async () => state.configuration } }) }));
vi.mock("./price-editor", () => ({ MentorPriceEditor: ({ initial }: { initial: unknown }) => <div data-testid="price-editor" data-initial={JSON.stringify(initial)} /> }));

import MentorPricesPage from "./page";

beforeEach(() => {
  state.token = "valid";
  state.role = "mentor";
  state.destination = "";
});

describe("mentor prices page", () => {
  it("loads price configuration for the current mentor", async () => {
    const page = await MentorPricesPage({});
    expect(page).toMatchObject({ props: { initial: { prices: null, priceBounds: null } } });
  });

  it("redirects anonymous and non-mentor users", async () => {
    state.token = "";
    await expect(MentorPricesPage({})).rejects.toThrow("NEXT_REDIRECT");
    expect(state.destination).toBe("/sign-in?returnTo=%2Fmentor%2Fprices");
    state.token = "valid";
    state.role = "mentee";
    await expect(MentorPricesPage({})).rejects.toThrow("NEXT_REDIRECT");
    expect(state.destination).toBe("/home");
  });
});
