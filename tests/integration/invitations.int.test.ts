import { randomUUID } from "node:crypto";
import { Client } from "pg";
import { describe, expect, inject, it } from "vitest";
import { ConflictError, InvitationService, SESSION_COOKIE, verifySession } from "@devmentor/core";
import { createInvitationRepository, createOrm } from "@devmentor/db";
import { createUser, mintSessionCookie, seedPendingInvitation } from "./helpers/identity";
import { runConcurrently } from "./helpers/concurrency";

const baseUrl = inject("baseUrl");
const databaseUrl = inject("databaseUrl");
const jwtSecret = inject("jwtSecret");
const unique = randomUUID().replaceAll("-", "");
const CSRF_HEADERS = { "x-devmentor-csrf": "1", "content-type": "application/json" };

function sessionCookie(response: Response): string {
  const cookie = response.headers.getSetCookie().find((value) => value.startsWith(`${SESSION_COOKIE}=`));
  if (!cookie) throw new Error("Expected a refreshed session cookie");
  return cookie.split(";", 1)[0] ?? "";
}

async function readAccountRolesAndProfile(userId: string) {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    const users = await client.query<{ role: string; roles: string[]; session_version: number }>("SELECT role, roles, session_version FROM users WHERE id = $1", [userId]);
    const profiles = await client.query<{ initial_publish_due_at: Date | null }>("SELECT initial_publish_due_at FROM mentor_profiles WHERE user_id = $1", [userId]);
    return { user: users.rows[0], profile: profiles.rows[0] };
  } finally {
    await client.end();
  }
}

async function createInvitationServices() {
  const orm = await createOrm({ url: databaseUrl, pool: { min: 1, max: 4 } });
  return {
    makeService: () => new InvitationService({
      invitationRepository: createInvitationRepository(orm.em.fork()),
      invitationEvents: { async publishInvitationAccepted() { return undefined; } },
    }),
    close: () => orm.close(true),
  };
}

async function readInvitationState(invitationId: string) {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    const result = await client.query<{ accepted_at: Date | null; revoked_at: Date | null; token_hash: string }>(
      "SELECT accepted_at, revoked_at, token_hash FROM invitations WHERE id = $1",
      [invitationId],
    );
    return result.rows[0];
  } finally {
    await client.end();
  }
}

async function countUnresolvedInvitations(email: string) {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    const result = await client.query<{ count: string }>(
      "SELECT count(*)::text AS count FROM invitations WHERE email = $1 AND accepted_at IS NULL AND revoked_at IS NULL",
      [email],
    );
    return Number(result.rows[0]?.count ?? 0);
  } finally {
    await client.end();
  }
}

async function settle<T>(operation: () => Promise<T>): Promise<{ status: "fulfilled"; value: T } | { status: "rejected"; reason: unknown }> {
  try {
    return { status: "fulfilled", value: await operation() };
  } catch (reason) {
    return { status: "rejected", reason };
  }
}

describe("invitation acceptance integration", () => {
  it("accepts for the verified matching account, retains mentee, renews the session, and shows the deadline on /mentor", async () => {
    const email = `invited-${unique}@example.test`;
    const account = await createUser({ email, role: "mentee" }, databaseUrl);
    const invitation = await seedPendingInvitation({ email, stackTags: ["TypeScript", "AI agents"] }, databaseUrl);
    const token = await mintSessionCookie({ userId: account.id, role: "mentee", roles: ["mentee"] }, jwtSecret);

    const accept = await fetch(new URL(`/api/invitations/${invitation.token}/accept`, baseUrl), {
      method: "POST",
      headers: { ...CSRF_HEADERS, cookie: `${SESSION_COOKIE}=${token}` },
    });
    expect(accept.status).toBe(200);
    const body = await accept.json() as { ok: boolean; data: { roles: string[]; publishDueAt: string; redirectTo: string } };
    expect(body).toMatchObject({ ok: true, data: { roles: ["mentee", "mentor"], redirectTo: "/mentor" } });

    const refreshedCookie = sessionCookie(accept);
    const refreshedToken = refreshedCookie.slice(`${SESSION_COOKIE}=`.length);
    await expect(verifySession(refreshedToken, jwtSecret)).resolves.toMatchObject({ role: "mentor", roles: ["mentee", "mentor"], sessionVersion: 1 });
    const home = await fetch(new URL("/mentor", baseUrl), { headers: { cookie: refreshedCookie }, redirect: "manual" });
    expect(home.status).toBe(200);
    expect(await home.text()).toContain("Publish at least one bookable session by");

    const onboarding = await fetch(new URL("/api/mentors/me/onboarding", baseUrl), { headers: { cookie: refreshedCookie } });
    expect(onboarding.status).toBe(200);
    await expect(onboarding.json()).resolves.toMatchObject({ ok: true, data: { initialPublishDueAt: body.data.publishDueAt } });

    const persisted = await readAccountRolesAndProfile(account.id);
    expect(persisted.user).toMatchObject({ role: "mentee", roles: ["mentee", "mentor"], session_version: 1 });
    expect(persisted.profile?.initial_publish_due_at?.toISOString()).toBe(body.data.publishDueAt);

    const consumedLink = await fetch(new URL(`/api/invitations/${invitation.token}`, baseUrl));
    expect(consumedLink.status).toBe(404);
  });

  it("does not consume an invitation or create a profile when the persisted verified e-mail differs", async () => {
    const invited = `expected-${unique}@example.test`;
    const other = await createUser({ email: `actual-${unique}@example.test` }, databaseUrl);
    const invitation = await seedPendingInvitation({ email: invited }, databaseUrl);
    const token = await mintSessionCookie({ userId: other.id, role: "mentee", roles: ["mentee"] }, jwtSecret);
    const response = await fetch(new URL(`/api/invitations/${invitation.token}/accept`, baseUrl), {
      method: "POST",
      headers: { ...CSRF_HEADERS, cookie: `${SESSION_COOKIE}=${token}` },
    });
    expect(response.status).toBe(403);
    expect(response.headers.has("set-cookie")).toBe(false);
    const persisted = await readAccountRolesAndProfile(other.id);
    expect(persisted.user).toMatchObject({ roles: ["mentee"], session_version: 0 });
    expect(persisted.profile).toBeUndefined();
  });

  it("serializes concurrent acceptance so one request wins and the role/profile are created once", async () => {
    const email = `racing-${unique}@example.test`;
    const account = await createUser({ email }, databaseUrl);
    const invitation = await seedPendingInvitation({ email }, databaseUrl);
    const token = await mintSessionCookie({ userId: account.id, role: "mentee", roles: ["mentee"] }, jwtSecret);
    const responses = await runConcurrently(2, () => fetch(new URL(`/api/invitations/${invitation.token}/accept`, baseUrl), {
      method: "POST",
      headers: { ...CSRF_HEADERS, cookie: `${SESSION_COOKIE}=${token}` },
    }));
    expect(responses.map(({ status }) => status).sort()).toEqual([200, 404]);
    const persisted = await readAccountRolesAndProfile(account.id);
    expect(persisted.user).toMatchObject({ roles: ["mentee", "mentor"], session_version: 1 });
    expect(persisted.profile).toBeDefined();
  });

  it("keeps one unresolved invitation when create commands race for a normalized e-mail", async () => {
    const email = "duplicate-create-" + unique + "@example.test";
    const harness = await createInvitationServices();
    try {
      const services = [harness.makeService(), harness.makeService()];
      const outcomes = await runConcurrently(2, async (index) => {
        try {
          return { status: "fulfilled" as const, value: await services[index]!.create({
            email: index === 0 ? " " + email.toUpperCase() + " " : email,
            stackTags: ["TypeScript"],
          }) };
        } catch (reason) {
          return { status: "rejected" as const, reason };
        }
      });
      expect(outcomes.filter(({ status }) => status === "fulfilled")).toHaveLength(1);
      const failures = outcomes.filter((result) => result.status === "rejected");
      expect(failures).toHaveLength(1);
      expect(failures[0]?.status === "rejected" ? failures[0].reason : null).toBeInstanceOf(ConflictError);
      expect(await countUnresolvedInvitations(email)).toBe(1);
    } finally {
      await harness.close();
    }
  });

  it("serializes acceptance against revocation without partial role or profile changes", async () => {
    const email = "accept-revoke-" + unique + "@example.test";
    const account = await createUser({ email }, databaseUrl);
    const harness = await createInvitationServices();
    try {
      const invitation = await harness.makeService().create({ email, stackTags: ["TypeScript"] });
      const [acceptService, revokeService] = [harness.makeService(), harness.makeService()];
      const outcomes = await runConcurrently(2, async (index) => {
        try {
          const value = index === 0
            ? await acceptService.accept(invitation.token, account.id)
            : await revokeService.revoke(invitation.invitation.id);
          return { status: "fulfilled" as const, value };
        } catch (reason) {
          return { status: "rejected" as const, reason };
        }
      });
      expect(outcomes.filter(({ status }) => status === "fulfilled")).toHaveLength(1);
      expect(outcomes.filter(({ status }) => status === "rejected")).toHaveLength(1);

      const persisted = await readAccountRolesAndProfile(account.id);
      const state = await readInvitationState(invitation.invitation.id);
      if (outcomes[0]?.status === "fulfilled") {
        expect(state?.accepted_at).not.toBeNull();
        expect(state?.revoked_at).toBeNull();
        expect(persisted.user).toMatchObject({ roles: ["mentee", "mentor"], session_version: 1 });
        expect(persisted.profile).toBeDefined();
      } else {
        expect(state?.accepted_at).toBeNull();
        expect(state?.revoked_at).not.toBeNull();
        expect(persisted.user).toMatchObject({ roles: ["mentee"], session_version: 0 });
        expect(persisted.profile).toBeUndefined();
      }
    } finally {
      await harness.close();
    }
  });

  it("serializes acceptance against resend so either acceptance or token rotation wins atomically", async () => {
    const email = "accept-resend-" + unique + "@example.test";
    const account = await createUser({ email }, databaseUrl);
    const harness = await createInvitationServices();
    try {
      const invitation = await harness.makeService().create({ email, stackTags: ["TypeScript"] });
      const [acceptService, resendService] = [harness.makeService(), harness.makeService()];
      let releaseStart: () => void = () => undefined;
      const start = new Promise<void>((resolve) => { releaseStart = resolve; });
      const acceptOperation = (async () => { await start; return settle(() => acceptService.accept(invitation.token, account.id)); })();
      const resendOperation = (async () => { await start; return settle(() => resendService.resend(invitation.invitation.id)); })();
      releaseStart();
      const [acceptOutcome, resendOutcome] = await Promise.all([acceptOperation, resendOperation]);
      expect([acceptOutcome, resendOutcome].filter(({ status }) => status === "fulfilled")).toHaveLength(1);
      expect([acceptOutcome, resendOutcome].filter(({ status }) => status === "rejected")).toHaveLength(1);

      const persisted = await readAccountRolesAndProfile(account.id);
      const state = await readInvitationState(invitation.invitation.id);
      await expect(acceptService.lookup(invitation.token)).rejects.toMatchObject({ status: 404 });
      if (acceptOutcome.status === "fulfilled") {
        expect(state?.accepted_at).not.toBeNull();
        expect(state?.token_hash).toBe(invitation.invitation.tokenHash);
        expect(persisted.user).toMatchObject({ roles: ["mentee", "mentor"], session_version: 1 });
        expect(persisted.profile).toBeDefined();
      } else {
        expect(resendOutcome.status).toBe("fulfilled");
        if (resendOutcome.status !== "fulfilled") throw new Error("Expected resend to win the invitation lock");
        expect(state?.accepted_at).toBeNull();
        expect(state?.token_hash).toBe(resendOutcome.value.invitation.tokenHash);
        expect(state?.token_hash).not.toBe(invitation.invitation.tokenHash);
        await expect(acceptService.lookup(resendOutcome.value.token)).resolves.toMatchObject({ email });
        expect(persisted.user).toMatchObject({ roles: ["mentee"], session_version: 0 });
        expect(persisted.profile).toBeUndefined();
      }
    } finally {
      await harness.close();
    }
  });
});
