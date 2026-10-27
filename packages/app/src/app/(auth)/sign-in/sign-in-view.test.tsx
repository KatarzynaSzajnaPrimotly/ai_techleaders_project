import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getSignInErrorMessage, SignInView } from "./sign-in-view";

describe("SignInView", () => {
  it("offers GitHub sign-in and explains that e-mail sign-in is not available yet", () => {
    render(<SignInView />);
    expect(screen.getByRole("heading", { name: "Sign in" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Sign in with GitHub" }).getAttribute("href")).toBe("/api/auth/github");
    expect(screen.getByRole("note").textContent).toContain("isn't available yet");
  });

  it("preserves a requested destination through the GitHub flow", () => {
    render(<SignInView returnTo="/mentor?tab=upcoming" />);
    expect(screen.getByRole("link", { name: "Sign in with GitHub" }).getAttribute("href"))
      .toBe("/api/auth/github?returnTo=%2Fmentor%3Ftab%3Dupcoming");
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
    ["unexpected", "couldn't sign you in"],
  ])("maps error %s to a safe message", (error, expected) => {
    expect(getSignInErrorMessage(error)).toContain(expected);
  });

  it("has no error message when no error code is present", () => {
    expect(getSignInErrorMessage(undefined)).toBeNull();
  });
});
