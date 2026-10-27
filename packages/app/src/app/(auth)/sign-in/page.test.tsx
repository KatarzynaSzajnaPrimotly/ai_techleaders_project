import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const redirectTo = vi.hoisted(() => ({ value: "" }));
vi.mock("next/navigation", () => ({ redirect: (path: string) => { redirectTo.value = path; throw new Error("NEXT_REDIRECT"); } }));

import { SignInPageContent } from "./page";

beforeEach(() => { redirectTo.value = ""; });

describe("SignInPageContent", () => {
  it("renders cancellation, known errors, and the first returnTo query value", async () => {
    const content = await SignInPageContent({
      searchParams: Promise.resolve({ cancelled: ["1", "0"], error: ["no-verified-email", "state"], returnTo: ["/mentor?next=1", "/home"] }),
      session: null,
    });
    render(content);
    expect(screen.getByRole("status").textContent).toContain("No account was created");
    expect(screen.getByRole("alert").textContent).toContain("didn't share a verified e-mail");
    expect(screen.getByRole("link", { name: "Sign in with GitHub" }).getAttribute("href"))
      .toBe("/api/auth/github?returnTo=%2Fmentor%3Fnext%3D1");
  });

  it("maps unknown error values to a generic message and does not render cancellation", async () => {
    const content = await SignInPageContent({ searchParams: Promise.resolve({ error: "token-value" }), session: null });
    render(content);
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.getByRole("alert").textContent).toContain("couldn't sign you in");
    expect(screen.getByRole("alert").textContent).not.toContain("token-value");
  });

  it("renders without notices when no query values are present", async () => {
    const content = await SignInPageContent({ searchParams: Promise.resolve({}), session: null });
    render(content);
    expect(screen.queryByRole("status")).toBeNull();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it.each([
    [{ userId: "m-1", role: "mentee" }, "/home"],
    [{ userId: "t-1", role: "mentor" }, "/mentor"],
    [{ userId: "o-1", role: "operator" }, "/admin/mentors"],
  ] as const)("redirects signed-in %s to its home", async (session, home) => {
    await expect(SignInPageContent({ searchParams: Promise.resolve({}), session }))
      .rejects.toThrow("NEXT_REDIRECT");
    expect(redirectTo.value).toBe(home);
  });
});
