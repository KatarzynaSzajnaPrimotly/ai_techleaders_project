import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  token: undefined as string | undefined,
  role: "mentor" as "mentee" | "mentor" | "operator",
  destination: "",
  profile: null as { displayName: string | null; githubLogin: string | null } | null,
}));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => state.token ? { value: state.token } : undefined }) }));
vi.mock("next/navigation", () => ({ redirect: (path: string) => { state.destination = path; throw new Error("NEXT_REDIRECT"); } }));
vi.mock("../../../server/container", () => ({ withScope: (run: (cradle: unknown) => unknown) => run({ accountService: { findForRoleHome: async () => state.profile } }) }));
vi.mock("@devmentor/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@devmentor/core")>();
  return { ...actual, requireJwtSecret: () => "a-test-secret-with-at-least-32-characters", verifySession: async () => ({ userId: "u-2", role: state.role }) };
});

import MentorPage from "./page";

beforeEach(() => {
  state.token = undefined;
  state.role = "mentor";
  state.destination = "";
  state.profile = { displayName: "Mentor Name", githubLogin: "mentor-login" };
});

describe("MentorPage", () => {
  it("renders its inner view for a mentor session", async () => {
    state.token = "signed-cookie";
    const content = await MentorPage({});
    expect(content).toMatchObject({ props: { name: "Mentor Name" } });
  });

  it("uses the guarded page wrapper for anonymous visits", async () => {
    await expect(MentorPage({})).rejects.toThrow("NEXT_REDIRECT");
    expect(state.destination).toBe("/sign-in?returnTo=%2Fmentor");
  });

  it("uses the GitHub login when the display name is missing", async () => {
    state.token = "signed-cookie";
    state.profile = { displayName: null, githubLogin: "mentor-login" };
    const content = await MentorPage({});
    expect(content).toMatchObject({ props: { name: "mentor-login" } });
  });

  it("uses the safe fallback when both profile names are unavailable", async () => {
    state.token = "signed-cookie";
    state.profile = null;
    const content = await MentorPage({});
    expect(content).toMatchObject({ props: { name: "You" } });
  });
});
