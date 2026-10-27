import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  token: undefined as string | undefined,
  role: "operator" as "mentee" | "mentor" | "operator",
  destination: "",
}));

vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => state.token ? { value: state.token } : undefined }) }));
vi.mock("next/navigation", () => ({ redirect: (path: string) => { state.destination = path; throw new Error("NEXT_REDIRECT"); } }));
vi.mock("@devmentor/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@devmentor/core")>();
  return {
    ...actual,
    requireJwtSecret: () => "a-test-secret-with-at-least-32-characters",
    verifySession: async () => ({ userId: "u-1", role: state.role }),
  };
});

vi.mock("./admin-mentors", () => ({ AdminMentors: () => <div data-testid="admin-mentors" /> }));

import AdminMentorsPage, { metadata } from "./page";

beforeEach(() => {
  state.token = "signed-cookie";
  state.role = "operator";
  state.destination = "";
});

describe("admin mentors page", () => {
  it("has a title for the admin area", () => {
    expect(metadata.title).toBe("Mentors | DevMentor admin");
  });

  it("renders the heading, a link to the public page and the client table for operators", async () => {
    render(await AdminMentorsPage({}));
    expect(screen.getByRole("heading", { name: "Mentors" })).toBeDefined();
    expect(screen.getByRole("link", { name: "View public page" }).getAttribute("href")).toBe("/mentors");
    expect(screen.getByTestId("admin-mentors")).toBeDefined();
  });

  it("redirects anonymous operators to sign-in", async () => {
    state.token = undefined;
    await expect(AdminMentorsPage({})).rejects.toThrow("NEXT_REDIRECT");
    expect(state.destination).toBe("/sign-in?returnTo=%2Fadmin%2Fmentors");
  });

  it.each([
    ["mentee", "/home"],
    ["mentor", "/mentor"],
  ] as const)("redirects a %s away from operator-only page", async (role, destination) => {
    state.role = role;
    await expect(AdminMentorsPage({})).rejects.toThrow("NEXT_REDIRECT");
    expect(state.destination).toBe(destination);
  });
});
