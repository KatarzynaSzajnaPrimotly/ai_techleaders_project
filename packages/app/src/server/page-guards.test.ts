import { beforeEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";

const state = vi.hoisted(() => ({ token: undefined as string | undefined, session: null as { userId: string; role: "mentee" | "mentor" | "operator" } | null, failure: false, destination: "" }));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => state.token ? { value: state.token } : undefined }) }));
vi.mock("next/navigation", () => ({ redirect: (path: string) => { state.destination = path; throw new Error("NEXT_REDIRECT"); } }));
vi.mock("@devmentor/core", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@devmentor/core")>();
  return { ...actual, requireJwtSecret: () => "a-test-secret-with-at-least-32-characters", verifySession: async () => {
    if (state.failure || !state.session) throw new Error("invalid");
    return state.session;
  } };
});

import { guardedPage, publicPage, readSession } from "./guards";

beforeEach(() => {
  state.token = undefined;
  state.session = { userId: "u-1", role: "mentee" };
  state.failure = false;
  state.destination = "";
});

describe("readSession", () => {
  it("returns null without a session cookie", async () => expect(readSession()).resolves.toBeNull());
  it("verifies a present session cookie", async () => {
    state.token = "token";
    await expect(readSession()).resolves.toEqual({ userId: "u-1", role: "mentee" });
  });
  it("fails closed for an invalid or expired cookie", async () => {
    state.token = "bad";
    state.failure = true;
    await expect(readSession()).resolves.toBeNull();
  });
});

describe("guardedPage", () => {
  it("redirects anonymous visitors to sign-in with the explicit page path", async () => {
    const page = guardedPage({ path: "/home", access: { roles: ["mentee"] } }, () => "rendered");
    await expect(page({})).rejects.toThrow("NEXT_REDIRECT");
    expect(state.destination).toBe("/sign-in?returnTo=%2Fhome");
  });
  it("redirects a wrong role to its own home", async () => {
    state.token = "token";
    state.session = { userId: "u-1", role: "mentor" };
    const page = guardedPage({ path: "/home", access: { roles: ["mentee"] } }, () => "rendered");
    await expect(page({})).rejects.toThrow("NEXT_REDIRECT");
    expect(state.destination).toBe("/mentor");
  });
  it("renders for an allowed role", async () => {
    state.token = "token";
    const page = guardedPage({ path: "/home", access: { roles: ["mentee"] } }, (_props, session) => session.userId);
    await expect(page({})).resolves.toBe("u-1");
  });
  it("renders for any valid role with authenticated access", async () => {
    state.token = "token";
    const page = guardedPage({ path: "/private", access: "authenticated" }, () => "ok");
    await expect(page({})).resolves.toBe("ok");
  });
});

describe("publicPage", () => {
  it("returns a public component unchanged by default", () => {
    const component = () => "page";
    expect(publicPage(component)).toBe(component);
  });
  it("optionally reads and supplies the session", async () => {
    state.token = "token";
    const component = ({ session }: { session: { userId: string; role: "mentee" | "mentor" | "operator" } | null }) => createElement("span", null, session?.role);
    const page = publicPage(component, { withSession: true });
    await expect(page({})).resolves.toMatchObject({ props: { session: { userId: "u-1", role: "mentee" } } });
  });
  it("supplies null to a public page without a session", async () => {
    const component = ({ session }: { session: { userId: string; role: "mentee" | "mentor" | "operator" } | null }) => createElement("span", null, session?.role);
    const page = publicPage(component, { withSession: true });
    await expect(page({})).resolves.toMatchObject({ props: { session: null } });
  });
});
