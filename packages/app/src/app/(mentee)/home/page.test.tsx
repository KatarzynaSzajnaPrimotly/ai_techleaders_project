import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ token: undefined as string | undefined, role: "mentee" as "mentee" | "mentor" | "operator", destination: "" }));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => state.token ? { value: state.token } : undefined }) }));
vi.mock("next/navigation", () => ({ redirect: (path: string) => { state.destination = path; throw new Error("NEXT_REDIRECT"); } }));
vi.mock("@devmentor/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@devmentor/core")>();
  return { ...actual, requireJwtSecret: () => "a-test-secret-with-at-least-32-characters", verifySession: async () => ({ userId: "u-1", role: state.role }) };
});

import MenteePage from "./page";

beforeEach(() => { state.token = undefined; state.role = "mentee"; state.destination = ""; });

describe("MenteePage", () => {
  it("renders its inner view for a mentee session", async () => {
    state.token = "signed-cookie";
    const content = await MenteePage({});
    expect(content).toBeTruthy();
  });

  it("uses the guarded page wrapper for anonymous visits", async () => {
    await expect(MenteePage({})).rejects.toThrow("NEXT_REDIRECT");
    expect(state.destination).toBe("/sign-in?returnTo=%2Fhome");
  });
});
