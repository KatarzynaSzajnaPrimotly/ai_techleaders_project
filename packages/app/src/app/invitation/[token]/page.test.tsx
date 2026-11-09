import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  invitation: null as null | { email: string; stackTags: string[]; expiresAt: Date },
  lookupFailure: null as Error | null,
  session: null as null | { userId: string },
  user: null as null | { email: string; displayName: string | null; emailVerifiedAt: Date | null },
}));
vi.mock("../../../server/guards", () => ({ readSession: async () => state.session }));
vi.mock("../../../server/container", () => ({
  withScope: (run: (cradle: unknown) => unknown) => run({
    invitationService: { lookup: async () => {
      if (state.lookupFailure) throw state.lookupFailure;
      if (!state.invitation) {
        const { NotFoundError } = await import("@devmentor/core");
        throw new NotFoundError("This invitation is not valid.");
      }
      return state.invitation;
    } },
    userRepository: { findById: async () => state.user },
  }),
}));

import InvitationPage from "./page";

beforeEach(() => {
  state.invitation = { email: "ada@example.test", stackTags: ["TypeScript"], expiresAt: new Date("2026-11-23T12:00:00Z") };
  state.lookupFailure = null;
  state.session = { userId: "user-1" };
  state.user = { email: "ada@example.test", displayName: "Ada", emailVerifiedAt: new Date("2026-01-01T00:00:00Z") };
});

describe("InvitationPage", () => {
  it("loads the invitation and current persisted account identity", async () => {
    const page = await InvitationPage({ params: Promise.resolve({ token: "opaque" }) });
    expect(page).toMatchObject({ props: { token: "opaque", invitation: { email: "ada@example.test" }, account: { email: "ada@example.test", displayName: "Ada", verified: true } } });
  });

  it("does not need an account lookup for a signed-out visit", async () => {
    state.session = null;
    const page = await InvitationPage({ params: Promise.resolve({ token: "opaque" }) });
    expect(page).toMatchObject({ props: { account: null } });
  });

  it("renders one generic invalid state and still handles a stale session", async () => {
    state.invitation = null;
    state.user = null;
    const page = await InvitationPage({ params: Promise.resolve({ token: "unknown" }) });
    expect(page).toMatchObject({ props: { invitation: null, account: null } });
  });

  it("rethrows unexpected lookup errors", async () => {
    state.lookupFailure = new Error("database unavailable");
    await expect(InvitationPage({ params: Promise.resolve({ token: "opaque" }) })).rejects.toThrow("database unavailable");
  });
});
