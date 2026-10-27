import { describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({ session: null as { userId: string; role: "mentee" | "mentor" | "operator" } | null, destination: "", preview: null as { email: string; status: "ready" | "used" } | null, inspected: "" }));
vi.mock("next/navigation", () => ({ redirect: (path: string) => { state.destination = path; throw new Error("NEXT_REDIRECT"); } }));
vi.mock("../../../../server/container", () => ({ withScope: (run: (scope: unknown) => unknown) => run({ passwordAuthService: { inspectRegistrationToken: async (token: string) => { state.inspected = token; return state.preview; } } }) }));
import { ConfirmPageContent } from "./page";

describe("ConfirmPageContent", () => {
  it("displays invalid state without token and resolves a valid token preview", async () => {
    const invalid = await ConfirmPageContent({ searchParams: Promise.resolve({}), session: null });
    expect(invalid).toMatchObject({ props: { state: "invalid" } });
    state.preview = { email: "ada@example.test", status: "ready" };
    const valid = await ConfirmPageContent({ searchParams: Promise.resolve({ token: ["signed", "ignored"] }), session: null });
    expect(state.inspected).toBe("signed");
    expect(valid).toMatchObject({ props: { state: "ready", token: "signed", email: "ada@example.test" } });
  });

  it("shows used and invalid previews", async () => {
    state.preview = { email: "ada@example.test", status: "used" };
    expect(await ConfirmPageContent({ searchParams: Promise.resolve({ token: "used" }), session: null })).toMatchObject({ props: { state: "used" } });
    state.preview = null;
    expect(await ConfirmPageContent({ searchParams: Promise.resolve({ token: "expired" }), session: null })).toMatchObject({ props: { state: "invalid" } });
  });

  it.each([["mentee", "/home"], ["mentor", "/mentor"], ["operator", "/admin/mentors"]] as const)("redirects signed-in %s", async (role, target) => {
    await expect(ConfirmPageContent({ searchParams: Promise.resolve({}), session: { userId: "u1", role } })).rejects.toThrow("NEXT_REDIRECT");
    expect(state.destination).toBe(target);
  });
});
