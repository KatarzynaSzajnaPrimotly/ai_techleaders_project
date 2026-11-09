import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  token: undefined as string | undefined,
  role: "mentee" as "mentee" | "mentor" | "operator",
  destination: "",
  profile: null as { displayName: string | null; githubLogin: string | null } | null,
}));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => state.token ? { value: state.token } : undefined }) }));
vi.mock("next/navigation", () => ({ redirect: (path: string) => { state.destination = path; throw new Error("NEXT_REDIRECT"); } }));
vi.mock("../../../server/container", () => ({ withScope: (run: (cradle: unknown) => unknown) => run({
  accountService: { findForRoleHome: async () => state.profile },
  userRepository: { findById: async () => ({ id: "u-1", email: "mentee@example.test", role: "mentee", sessionVersion: 0 }) },
}) }));
vi.mock("@devmentor/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@devmentor/core")>();
  return { ...actual, requireJwtSecret: () => "a-test-secret-with-at-least-32-characters", verifySession: async () => ({ userId: "u-1", role: state.role, sessionVersion: 0 }) };
});

import MenteePage from "./page";

beforeEach(() => {
  state.token = undefined;
  state.role = "mentee";
  state.destination = "";
  state.profile = { displayName: "Ada Lovelace", githubLogin: "ada" };
});

describe("MenteePage", () => {
  it("renders its inner view for a mentee session", async () => {
    state.token = "signed-cookie";
    const content = await MenteePage({});
    expect(content).toMatchObject({ props: { name: "Ada Lovelace" } });
  });

  it("uses the GitHub login when the display name is blank", async () => {
    state.token = "signed-cookie";
    state.profile = { displayName: "  ", githubLogin: "ada-login" };
    const content = await MenteePage({});
    expect(content).toMatchObject({ props: { name: "ada-login" } });
  });

  it("uses a safe name when the account profile is missing", async () => {
    state.token = "signed-cookie";
    state.profile = null;
    const content = await MenteePage({});
    expect(content).toMatchObject({ props: { name: "You" } });
  });

  it("uses the guarded page wrapper for anonymous visits", async () => {
    await expect(MenteePage({})).rejects.toThrow("NEXT_REDIRECT");
    expect(state.destination).toBe("/sign-in?returnTo=%2Fhome");
  });
});
