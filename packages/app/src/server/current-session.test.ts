import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Session } from "@devmentor/core";

const state = vi.hoisted(() => ({ user: null as null | { id: string; email: string; role: "mentee" | "mentor"; roles?: ("mentee" | "mentor")[]; sessionVersion: number } }));
vi.mock("./container", () => ({
  withScope: (run: (cradle: unknown) => Promise<unknown>) =>
    run({ userRepository: { findById: async () => state.user } }),
}));

import { resolveCurrentSession } from "./current-session";

beforeEach(() => {
  vi.stubEnv("OPERATOR_EMAILS", "");
  state.user = { id: "u-1", email: "ada@example.test", role: "mentee", sessionVersion: 0 };
});
afterEach(() => vi.unstubAllEnvs());

describe("resolveCurrentSession", () => {
  const session: Session = { userId: "u-1", role: "mentee", sessionVersion: 0 };

  it("rejects a deleted account", async () => {
    state.user = null;
    await expect(resolveCurrentSession(session)).resolves.toBeNull();
  });

  it("rejects a session version that was invalidated", async () => {
    state.user = { ...state.user!, sessionVersion: 1 };
    await expect(resolveCurrentSession(session)).resolves.toBeNull();
  });

  it("rejects a token carrying a stale role", async () => {
    state.user = { ...state.user!, role: "mentor" };
    await expect(resolveCurrentSession(session)).resolves.toBeNull();
  });

  it("returns the current session for an active account", async () => {
    await expect(resolveCurrentSession(session)).resolves.toEqual(session);
  });

  it("accepts a current additive role set and rejects stale role grants", async () => {
    state.user = { ...state.user!, role: "mentee", roles: ["mentee", "mentor"] };
    const current: Session = { ...session, role: "mentor", roles: ["mentee", "mentor"], sessionVersion: 0 };
    await expect(resolveCurrentSession(current)).resolves.toEqual(current);
    await expect(resolveCurrentSession({ ...current, roles: ["mentee"] })).resolves.toBeNull();
  });

  it("rejects an operator token after its e-mail is removed from the allowlist", async () => {
    await expect(resolveCurrentSession({ ...session, role: "operator" })).resolves.toBeNull();
  });

  it("preserves an operator role only while the account remains allowlisted", async () => {
    vi.stubEnv("OPERATOR_EMAILS", " ADA@example.test ");
    await expect(resolveCurrentSession({ ...session, role: "operator" })).resolves.toEqual({ ...session, role: "operator" });
    await expect(resolveCurrentSession({ ...session, role: "operator", roles: ["mentee", "operator"] })).resolves.toEqual({ ...session, role: "operator", roles: ["mentee", "operator"] });
  });
});
