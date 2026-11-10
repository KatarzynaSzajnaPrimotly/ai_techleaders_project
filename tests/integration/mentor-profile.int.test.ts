import { randomUUID } from "node:crypto";
import { Client } from "pg";
import { describe, expect, inject, it } from "vitest";
import { SESSION_COOKIE } from "../../packages/core/src/http/auth";
import { createUser, mintSessionCookie } from "./helpers/identity";

const baseUrl = inject("baseUrl");
const databaseUrl = inject("databaseUrl");
const jwtSecret = inject("jwtSecret");
const unique = randomUUID().replaceAll("-", "");
const csrf = { "x-devmentor-csrf": "1", "content-type": "application/json" };

async function seedProfile(userId: string) {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try { await client.query("INSERT INTO mentor_profiles (user_id) VALUES ($1)", [userId]); }
  finally { await client.end(); }
}

describe("mentor profile integration", () => {
  it("saves a draft, publishes a privacy-scoped share page, unpublishes and republishes at the same slug", async () => {
    const user = await createUser({ email: `profile-${unique}@example.test`, role: "mentor", displayName: `Ada Profile ${unique}` }, databaseUrl);
    await seedProfile(user.id);
    const token = await mintSessionCookie({ userId: user.id, role: "mentor", roles: ["mentor"] }, jwtSecret);
    const cookie = `${SESSION_COOKIE}=${token}`;
    const headers = { ...csrf, cookie };
    const refused = await fetch(new URL("/api/mentors/me/publish", baseUrl), { method: "POST", headers, body: "{}" });
    expect(refused.status).toBe(400);
    expect(await refused.json()).toMatchObject({ error: { fieldErrors: { publicWorkUrl: [expect.any(String)], bio: [expect.any(String)] } } });
    const draft = await fetch(new URL("/api/mentors/me", baseUrl), { method: "PUT", headers, body: JSON.stringify({ publicWorkUrl: "https://example.test/work", bio: "I build reliable systems.", stackTags: ["TypeScript", "AI agents"], sessionChannel: "private-channel@example.test" }) });
    expect(draft.status).toBe(200);
    const privateProfile = await fetch(new URL("/api/mentors/me", baseUrl), { headers: { cookie } });
    expect(await privateProfile.json()).toMatchObject({ data: { sessionChannel: "private-channel@example.test" } });
    const published = await fetch(new URL("/api/mentors/me/publish", baseUrl), { method: "POST", headers, body: "{}" });
    expect(published.status).toBe(200);
    const owner = await published.json() as { data: { slug: string } };
    const slug = owner.data.slug;
    const response = await fetch(new URL(`/api/mentors/${slug}`, baseUrl));
    expect(response.status).toBe(200);
    const body = await response.json() as { data: Record<string, unknown> };
    expect(Object.keys(body.data).sort()).toEqual(["bio", "displayName", "publicWorkUrl", "slots", "slug", "stackTags"]);
    expect(body.data).toMatchObject({ slug, publicWorkUrl: "https://example.test/work", bio: "I build reliable systems." });
    expect(JSON.stringify(body.data)).not.toContain("private-channel@example.test");
    const publicPage = await fetch(new URL(`/m/${slug}`, baseUrl));
    expect(publicPage.status).toBe(200);
    const pageHtml = await publicPage.text();
    expect(pageHtml).toContain("I build reliable systems.");
    expect(pageHtml).toContain("https://example.test/work");
    expect(pageHtml).not.toContain("private-channel@example.test");
    expect(pageHtml).not.toContain(user.email);
    expect(pageHtml).not.toMatch(/rating|reviews|score|ranking/i);
    const privateResponse = await fetch(new URL(`/api/mentors/${slug}`, baseUrl));
    expect(await privateResponse.text()).not.toContain("private-channel@example.test");
    await fetch(new URL("/api/mentors/me/unpublish", baseUrl), { method: "POST", headers, body: "{}" });
    expect((await fetch(new URL(`/api/mentors/${slug}`, baseUrl))).status).toBe(404);
    const republish = await fetch(new URL("/api/mentors/me/publish", baseUrl), { method: "POST", headers, body: "{}" });
    expect((await republish.json() as { data: { slug: string } }).data.slug).toBe(slug);
  });

  it("allocates different slugs when mentors with the same name publish concurrently", async () => {
    const displayName = `Same Name ${unique}`;
    const users = await Promise.all([
      createUser({ email: `same-a-${unique}@example.test`, role: "mentor", displayName }, databaseUrl),
      createUser({ email: `same-b-${unique}@example.test`, role: "mentor", displayName }, databaseUrl),
    ]);
    await Promise.all(users.map((user) => seedProfile(user.id)));
    const tokens = await Promise.all(users.map((user) => mintSessionCookie({ userId: user.id, role: "mentor", roles: ["mentor"] }, jwtSecret)));
    await Promise.all(tokens.map((token) => fetch(new URL("/api/mentors/me", baseUrl), {
      method: "PUT", headers: { ...csrf, cookie: `${SESSION_COOKIE}=${token}` },
      body: JSON.stringify({ publicWorkUrl: "https://example.test/work", bio: "Engineer" }),
    })));
    const responses = await Promise.all(tokens.map((token) => fetch(new URL("/api/mentors/me/publish", baseUrl), {
      method: "POST", headers: { ...csrf, cookie: `${SESSION_COOKIE}=${token}` }, body: "{}",
    })));
    expect(responses.map((response) => response.status)).toEqual([200, 200]);
    const slugs = await Promise.all(responses.map(async (response) => (await response.json() as { data: { slug: string } }).data.slug));
    expect(new Set(slugs).size).toBe(2);
  });

  it("publishes, lists and removes availability while keeping the public projection private", async () => {
    const user = await createUser({ email: `slots-${unique}@example.test`, role: "mentor", displayName: `Slot Mentor ${unique}` }, databaseUrl);
    await seedProfile(user.id);
    const token = await mintSessionCookie({ userId: user.id, role: "mentor", roles: ["mentor"] }, jwtSecret);
    const headers = { ...csrf, cookie: `${SESSION_COOKIE}=${token}` };
    const startsAt = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();

    const missingChannel = await fetch(new URL("/api/availability/slots", baseUrl), { method: "POST", headers, body: JSON.stringify({ startsAt }) });
    expect(missingChannel.status).toBe(400);
    expect(await missingChannel.json()).toMatchObject({ error: { fieldErrors: { sessionChannel: [expect.any(String)] } } });

    const draft = await fetch(new URL("/api/mentors/me", baseUrl), { method: "PUT", headers, body: JSON.stringify({ publicWorkUrl: "https://example.test/work", bio: "Mentor", sessionChannel: "Private mentor room" }) });
    expect(draft.status).toBe(200);
    const published = await fetch(new URL("/api/mentors/me/publish", baseUrl), { method: "POST", headers, body: "{}" });
    const slug = (await published.json() as { data: { slug: string } }).data.slug;

    const created = await fetch(new URL("/api/availability/slots", baseUrl), { method: "POST", headers, body: JSON.stringify({ startsAt }) });
    expect(created.status).toBe(200);
    const slot = (await created.json() as { data: { id: string; startsAt: string } }).data;
    const listed = await fetch(new URL("/api/availability/slots", baseUrl), { headers: { cookie: headers.cookie } });
    expect(await listed.json()).toMatchObject({ data: [{ id: slot.id, startsAt }] });

    const publicResponse = await fetch(new URL(`/api/mentors/${slug}`, baseUrl));
    const publicBody = await publicResponse.json() as { data: Record<string, unknown> & { slots: Array<{ id: string; meetsLeadTime: boolean }> } };
    expect(publicBody.data.slots).toEqual([{ id: slot.id, startsAt: expect.any(String), meetsLeadTime: true }]);
    expect(JSON.stringify(publicBody.data)).not.toContain("Private mentor room");
    const publicPage = await fetch(new URL(`/m/${slug}`, baseUrl));
    expect(await publicPage.text()).toContain("Availability");

    const duplicate = await fetch(new URL("/api/availability/slots", baseUrl), { method: "POST", headers, body: JSON.stringify({ startsAt }) });
    expect(duplicate.status).toBe(409);
    const removed = await fetch(new URL(`/api/availability/slots/${slot.id}`, baseUrl), { method: "DELETE", headers });
    expect(removed.status).toBe(200);
    expect((await (await fetch(new URL(`/api/mentors/${slug}`, baseUrl))).json() as { data: { slots: unknown[] } }).data.slots).toEqual([]);

    const republished = await fetch(new URL("/api/availability/slots", baseUrl), { method: "POST", headers, body: JSON.stringify({ startsAt }) });
    expect(republished.status).toBe(200);
    const owner = await fetch(new URL("/api/mentors/me", baseUrl), { headers: { cookie: headers.cookie } });
    expect((await owner.json() as { data: { lastPublishedAvailabilityAt: string | null } }).data.lastPublishedAvailabilityAt).not.toBeNull();
  });
});
