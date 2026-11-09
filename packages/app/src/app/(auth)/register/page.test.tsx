import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const redirected = vi.hoisted(() => ({ path: "" }));
vi.mock("next/navigation", () => ({ redirect: (path: string) => { redirected.path = path; throw new Error("NEXT_REDIRECT"); } }));
import { RegisterPageContent } from "./page";

describe("RegisterPageContent", () => {
  it("renders the registration form and carries the first return destination", async () => {
    render(await RegisterPageContent({ searchParams: Promise.resolve({ returnTo: ["/mentor", "/home"] }), session: null }));
    expect(screen.getByRole("heading", { name: "Create your account" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Back to sign in" }).getAttribute("href")).toBe("/sign-in?returnTo=%2Fmentor");
  });

  it("accepts a scalar return destination", async () => {
    render(await RegisterPageContent({ searchParams: Promise.resolve({ returnTo: "/home" }), session: null }));
    expect(screen.getByRole("link", { name: "Back to sign in" }).getAttribute("href")).toBe("/sign-in?returnTo=%2Fhome");
  });

  it.each([["mentee", "/home"], ["mentor", "/mentor"], ["operator", "/admin/mentors"]] as const)("redirects a signed-in %s", async (role, target) => {
    await expect(RegisterPageContent({ searchParams: Promise.resolve({}), session: { userId: "u1", role, sessionVersion: 0 } })).rejects.toThrow("NEXT_REDIRECT");
    expect(redirected.path).toBe(target);
  });
});
