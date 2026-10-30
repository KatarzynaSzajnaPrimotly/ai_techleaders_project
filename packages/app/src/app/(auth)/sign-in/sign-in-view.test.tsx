import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getSignInErrorMessage, SignInView } from "./sign-in-view";

describe("SignInView", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("offers GitHub and e-mail sign-in", () => {
    render(<SignInView />);
    expect(screen.getByRole("heading", { name: "Sign in" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Sign in with GitHub" }).getAttribute("href")).toBe("/api/auth/github");
    expect(screen.getByLabelText("E-mail")).toBeTruthy();
    expect(screen.getByLabelText("Password")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Create an account" })).toBeTruthy();
  });

  it("preserves a requested destination through the GitHub flow", () => {
    render(<SignInView returnTo="/mentor?tab=upcoming" />);
    expect(screen.getByRole("link", { name: "Sign in with GitHub" }).getAttribute("href"))
      .toBe("/api/auth/github?returnTo=%2Fmentor%3Ftab%3Dupcoming");
  });

  it("offers local mock role links and disables e-mail sign-in in mock mode", () => {
    render(<SignInView mockAuth returnTo="/mentor" />);
    expect(screen.getByRole("link", { name: "Sign in as mentee" }).getAttribute("href"))
      .toBe("/api/auth/github?login=mock-mentee&returnTo=%2Fmentor");
    expect(screen.getByRole("link", { name: "Sign in as mentor" }).getAttribute("href"))
      .toBe("/api/auth/github?login=mock-mentor&returnTo=%2Fmentor");
    expect(screen.getByRole("link", { name: "Sign in as operator" }).getAttribute("href"))
      .toBe("/api/auth/github?login=mock-operator&returnTo=%2Fmentor");
    expect(screen.getByText("E-mail sign-in is disabled in local mock mode.")).toBeTruthy();
    expect(screen.queryByLabelText("E-mail")).toBeNull();
  });

  it("renders cancellation and GitHub error notices", () => {
    render(<SignInView cancelled error="state" />);
    expect(screen.getByRole("status").textContent).toContain("No account was created");
    expect(screen.getByRole("alert").textContent).toContain("couldn't verify");
  });

  it.each([
    ["state", "couldn't verify"],
    ["no-verified-email", "didn't share a verified e-mail"],
    ["unavailable", "couldn't sign you in"],
    ["session-expired", "session expired"],
    ["unexpected", "couldn't sign you in"],
  ])("maps error %s to a safe message", (error, expected) => {
    expect(getSignInErrorMessage(error)).toContain(expected);
  });

  it("has no error message when no error code is present", () => {
    expect(getSignInErrorMessage(undefined)).toBeNull();
  });

  it.each([[401, "Invalid credentials, or sign in with GitHub instead."], [503, "We couldn't sign you in. Please try again."]])("submits e-mail credentials and maps HTTP %s", async (status, message) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: false, error: { code: "FAILED", message: "private server text" } }), { status })));
    render(<SignInView returnTo="/mentor" />);
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "ada@example.test" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "long password here" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in with e-mail" }));
    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain(message));
  });

  it("navigates to the API redirect after e-mail sign-in", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true, data: { redirectTo: "/home" } }), { status: 200 })));
    render(<SignInView />);
    fireEvent.change(screen.getByLabelText("E-mail"), { target: { value: "ada@example.test" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "long password here" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in with e-mail" }));
    await waitFor(() => expect(vi.mocked(fetch)).toHaveBeenCalled());
  });
});
