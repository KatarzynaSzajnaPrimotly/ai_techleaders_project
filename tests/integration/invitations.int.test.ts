import { randomUUID } from "node:crypto";
import { Client } from "pg";
import { describe, expect, inject, it } from "vitest";
import { SESSION_COOKIE, verifySession } from "../../packages/core/src/http/auth";
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
});
