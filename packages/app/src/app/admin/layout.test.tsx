import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  session: null as { userId: string; role: "operator" } | null,
  profile: null as { displayName: string | null; githubLogin: string | null } | null,
}));

vi.mock("../../server/guards", () => ({ readSession: async () => state.session }));
vi.mock("../../server/container", () => ({
  withScope: (run: (cradle: unknown) => unknown) => run({ accountService: { findForRoleHome: async () => state.profile } }),
}));

import AdminLayout from "./layout";

beforeEach(() => {
  state.session = { userId: "operator-1", role: "operator" };
  state.profile = { displayName: "Founder A", githubLogin: "founder-a" };
});

describe("AdminLayout", () => {
  it("wraps operator content in the wide operator shell and uses the profile name", async () => {
    render(await AdminLayout({ children: <p>Admin content</p> }));
    expect(screen.getByRole("link", { name: "DevMentor" }).getAttribute("href")).toBe("/admin/mentors");
    expect(screen.getByRole("navigation", { name: "Main navigation" }).textContent).toBe("Mentors");
    expect(screen.getByText("Founder A")).toBeDefined();
    expect(screen.getByText("Operator")).toBeDefined();
    expect(screen.getByRole("main").className).toContain("max-w-4xl");
    expect(screen.getByText("Admin content")).toBeDefined();
  });

  it("uses the GitHub login when the display name is blank", async () => {
    state.profile = { displayName: "  ", githubLogin: "founder-login" };
    render(await AdminLayout({ children: <p>Admin content</p> }));
    expect(screen.getByText("founder-login")).toBeDefined();
  });

  it("uses a safe name if profile data is missing", async () => {
    state.profile = null;
    render(await AdminLayout({ children: <p>Admin content</p> }));
    expect(screen.getByText("You")).toBeDefined();
  });

  it("does not load an account profile when there is no session", async () => {
    state.session = null;
    render(await AdminLayout({ children: <p>Admin content</p> }));
    expect(screen.getByText("You")).toBeDefined();
  });
});
