import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { navFor, RoleShell } from "./RoleShell";

const apiCall = vi.fn();
vi.mock("../../backend/api/apiCall", () => ({ apiCall: (...args: unknown[]) => apiCall(...args) }));

afterEach(() => { apiCall.mockReset(); vi.unstubAllGlobals(); });

describe("navFor", () => {
  it.each([
    ["mentee", [{ label: "Home", href: "/home" }]],
    ["mentor", [{ label: "Home", href: "/mentor" }]],
    ["operator", [{ label: "Mentors", href: "/admin/mentors" }]],
  ] as const)("returns %s navigation", (role, items) => expect(navFor(role)).toEqual(items));
});

describe("RoleShell", () => {
  it("shows DevMentor identity, role navigation, role badge and optional badge content", () => {
    render(<RoleShell name="Ari" role="mentor" onSignedOut={() => undefined} badge={<span>Verified</span>}><h1>Dashboard</h1></RoleShell>);
    expect((screen.getByRole("link", { name: "DevMentor" }) as HTMLAnchorElement).href).toContain("/mentor");
    expect(screen.getByRole("navigation", { name: "Main navigation" }).textContent).toContain("Home");
    expect(screen.getByText("Ari")).toBeTruthy();
    expect(screen.getByText("Mentor")).toBeTruthy();
    expect(screen.getByText("Verified")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeTruthy();
  });

  it("uses the wide main content class when requested", () => {
    const { container } = render(<RoleShell name="Op" role="operator" wide onSignedOut={() => undefined}><p>Rows</p></RoleShell>);
    expect(container.querySelector("main")?.className).toContain("max-w-4xl");
  });

  it("posts logout and navigates to sign-in after success", async () => {
    apiCall.mockResolvedValue({ ok: true, status: 200, data: null });
    const onSignedOut = vi.fn();
    render(<RoleShell name="Ari" role="mentee" onSignedOut={onSignedOut}><p>Home</p></RoleShell>);
    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));
    expect(apiCall).toHaveBeenCalledWith("/api/auth/logout", { method: "POST", onUnauthorized: "ignore" });
    await vi.waitFor(() => expect(onSignedOut).toHaveBeenCalled());
  });

  it("navigates to sign-in when logout succeeds without a callback", async () => {
    apiCall.mockResolvedValue({ ok: true, status: 200, data: null });
    const assign = vi.fn();
    vi.stubGlobal("window", { location: { assign } });
    render(<RoleShell name="Ari" role="mentee"><p>Home</p></RoleShell>);
    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));
    await vi.waitFor(() => expect(assign).toHaveBeenCalledWith("/sign-in"));
  });

  it("stays on the page when logout fails", async () => {
    apiCall.mockResolvedValue({ ok: false, status: 500, error: { code: "SERVER_ERROR", message: "Failed" } });
    const onSignedOut = vi.fn();
    render(<RoleShell name="Ari" role="mentee" onSignedOut={onSignedOut}><p>Home</p></RoleShell>);
    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));
    expect(apiCall).toHaveBeenCalled();
    expect(onSignedOut).not.toHaveBeenCalled();
  });
});
