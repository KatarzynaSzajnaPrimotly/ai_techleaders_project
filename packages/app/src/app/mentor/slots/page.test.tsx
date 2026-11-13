import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ token: "valid", role: "mentor" as "mentee" | "mentor", destination: "" }));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => state.token ? { value: state.token } : undefined }) }));
vi.mock("next/navigation", () => ({ redirect: (path: string) => { state.destination = path; throw new Error("NEXT_REDIRECT"); } }));
vi.mock("@devmentor/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@devmentor/core")>();
  return { ...actual, requireJwtSecret: () => "test-secret-with-enough-random-bytes-12345", verifySession: async () => ({ userId: "user-1", role: state.role, sessionVersion: 0 }) };
});
vi.mock("../../../server/current-session", () => ({ resolveCurrentSession: async (session: unknown) => session }));
vi.mock("./availability-slot-manager", () => ({ AvailabilitySlotManager: () => <div data-testid="availability-manager" /> }));

import MentorSlotsPage from "./page";

beforeEach(() => {
  state.token = "valid";
  state.role = "mentor";
  state.destination = "";
});

describe("mentor slots page", () => {
  it("renders the availability manager for a mentor", async () => {
    render(await MentorSlotsPage({}));
    expect(screen.getByTestId("availability-manager")).toBeDefined();
  });

  it("redirects anonymous users to sign-in and non-mentors to their home", async () => {
    state.token = "";
    await expect(MentorSlotsPage({})).rejects.toThrow("NEXT_REDIRECT");
    expect(state.destination).toBe("/sign-in?returnTo=%2Fmentor%2Fslots");
    state.token = "valid";
    state.role = "mentee";
    await expect(MentorSlotsPage({})).rejects.toThrow("NEXT_REDIRECT");
    expect(state.destination).toBe("/home");
  });
});
