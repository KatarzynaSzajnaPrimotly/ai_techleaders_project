import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ token: "valid", role: "mentor" as "mentee" | "mentor", destination: "", profile: {
  id: "profile-1", publicWorkUrl: null, bio: null, sessionChannel: null, stackTags: [], slug: null, publishedAt: null,
  readiness: { publicWorkUrl: false, bio: false, sessionChannel: false },
} }));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => state.token ? { value: state.token } : undefined }) }));
vi.mock("next/navigation", () => ({ redirect: (path: string) => { state.destination = path; throw new Error("NEXT_REDIRECT"); } }));
vi.mock("@devmentor/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@devmentor/core")>();
  return { ...actual, requireJwtSecret: () => "test-secret-with-enough-random-bytes-12345", verifySession: async () => ({ userId: "user-1", role: state.role, sessionVersion: 0 }) };
});
vi.mock("../../../server/current-session", () => ({ resolveCurrentSession: async (session: unknown) => session }));
vi.mock("../../../server/container", () => ({ withScope: (run: (cradle: unknown) => unknown) => run({ mentorService: { profile: async () => state.profile } }) }));
vi.mock("./profile-editor", () => ({ MentorProfileEditor: ({ initial }: { initial: unknown }) => <div data-testid="profile-editor" data-profile={JSON.stringify(initial)} /> }));

import MentorProfilePage from "./page";

beforeEach(() => {
  state.token = "valid";
  state.role = "mentor";
  state.destination = "";
});

describe("mentor profile page", () => {
  it("renders the owner editor for a mentor", async () => {
    render(await MentorProfilePage({}));
    expect(screen.getByTestId("profile-editor").getAttribute("data-profile")).toContain("profile-1");
  });

  it("redirects anonymous users to sign-in", async () => {
    state.token = "";
    await expect(MentorProfilePage({})).rejects.toThrow("NEXT_REDIRECT");
    expect(state.destination).toBe("/sign-in?returnTo=%2Fmentor%2Fprofile");
  });

  it("redirects users without the mentor role to their home", async () => {
    state.role = "mentee";
    await expect(MentorProfilePage({})).rejects.toThrow("NEXT_REDIRECT");
    expect(state.destination).toBe("/home");
  });
});
