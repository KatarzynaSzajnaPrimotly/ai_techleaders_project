import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  apiCall: vi.fn(),
  push: vi.fn(),
  refresh: vi.fn(),
}));
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: mocks.push, refresh: mocks.refresh }) }));
vi.mock("@devmentor/ui", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@devmentor/ui")>();
  return { ...actual, apiCall: mocks.apiCall };
});

import { InvitationView } from "./invitation-view";

const invitation = { email: "ada@example.test", stackTags: ["TypeScript", "React"], expiresAt: new Date("2026-11-23T12:00:00Z") };

beforeEach(() => {
  mocks.apiCall.mockReset().mockResolvedValue({ ok: true, status: 200, data: { redirectTo: "/mentor" } });
  mocks.push.mockReset();
  mocks.refresh.mockReset();
});
afterEach(() => vi.restoreAllMocks());

describe("InvitationView", () => {
  it("keeps all invalid invitation states to one sentence", () => {
    render(<InvitationView token="opaque" invitation={null} account={null} />);
    expect(screen.getByRole("status").textContent).toBe("This invitation is not valid.");
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("shows the invited e-mail and tags with sign-in return links", () => {
    render(<InvitationView token="opaque" invitation={invitation} account={null} />);
    expect(screen.getByText("ada@example.test")).toBeTruthy();
    expect(screen.getByText("TypeScript")).toBeTruthy();
    expect(screen.getByText("React")).toBeTruthy();
    expect(screen.getByText(/Expires/)).toBeTruthy();
    expect(screen.getByRole("link", { name: "Sign in with GitHub" }).getAttribute("href")).toContain("returnTo=%2Finvitation%2Fopaque");
    expect(screen.getByRole("link", { name: "Sign in with e-mail" })).toBeTruthy();
  });

  it("accepts for the matching verified account and redirects to the mentor home", async () => {
    render(<InvitationView token="opaque" invitation={invitation} account={{ email: "Ada@Example.Test", displayName: "Ada Lovelace", verified: true }} />);
    fireEvent.click(screen.getByRole("button", { name: "Accept invitation" }));
    await waitFor(() => expect(mocks.push).toHaveBeenCalledWith("/mentor"));
    expect(mocks.apiCall).toHaveBeenCalledWith("/api/invitations/opaque/accept", { method: "POST" });
    expect(mocks.refresh).toHaveBeenCalledOnce();
  });

  it("falls back to the verified e-mail when the matching account has no display name", () => {
    render(<InvitationView token="opaque" invitation={invitation} account={{ email: "ada@example.test", displayName: null, verified: true }} />);
    expect(screen.getByText("This will grant the mentor role to ada@example.test.")).toBeTruthy();
  });

  it("reports an acceptance failure without navigating", async () => {
    mocks.apiCall.mockResolvedValue({ ok: false, status: 403, error: { code: "FORBIDDEN", message: "Sign in with the verified e-mail address invited" } });
    render(<InvitationView token="opaque" invitation={invitation} account={{ email: invitation.email, displayName: "Ada", verified: true }} />);
    fireEvent.click(screen.getByRole("button", { name: "Accept invitation" }));
    expect((await screen.findByRole("alert")).textContent).toContain("Sign in with the verified e-mail address invited");
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it("shows both addresses for another signed-in account and signs out before switching", async () => {
    render(<InvitationView token="opaque" invitation={invitation} account={{ email: "other@example.test", displayName: null, verified: true }} />);
    expect(screen.getByText(/other@example.test/)).toBeTruthy();
    expect(screen.getAllByText(/ada@example.test/)).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: "Sign out and switch account" }));
    await waitFor(() => expect(mocks.apiCall).toHaveBeenCalledWith("/api/auth/logout", { method: "POST", onUnauthorized: "ignore" }));
    await waitFor(() => expect(mocks.push).toHaveBeenCalledWith("/sign-in?returnTo=%2Finvitation%2Fopaque"));
    expect(mocks.refresh).toHaveBeenCalledOnce();
  });

  it("requires verification even when the e-mail address matches", () => {
    render(<InvitationView token="opaque" invitation={invitation} account={{ email: invitation.email, displayName: null, verified: false }} />);
    expect(screen.queryByRole("button", { name: "Accept invitation" })).toBeNull();
    expect(screen.getByRole("button", { name: "Sign out and switch account" })).toBeTruthy();
  });

  it("renders invitations without stack tags and reports sign-out failures", async () => {
    mocks.apiCall.mockResolvedValue({ ok: false, status: 500, error: { code: "INTERNAL_ERROR", message: "Could not sign out" } });
    render(<InvitationView token="opaque" invitation={{ ...invitation, stackTags: [] }} account={{ email: "other@example.test", displayName: null, verified: false }} />);
    expect(screen.queryByLabelText("Invitation skills")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Sign out and switch account" }));
    expect((await screen.findByRole("alert")).textContent).toContain("Could not sign out");
    expect(mocks.push).not.toHaveBeenCalled();
  });
});
