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
    const draft = await fetch(new URL("/api/mentors/me", baseUrl), { method: "PUT", headers, body: JSON.stringify({ publicWorkUrl: "https://example.test/work", bio: "I build reliable systems.", stackTags: ["TypeScript", "AI agents"] }) });
    expect(draft.status).toBe(200);
    const published = await fetch(new URL("/api/mentors/me/publish", baseUrl), { method: "POST", headers, body: "{}" });
    expect(published.status).toBe(200);
    const owner = await published.json() as { data: { slug: string } };
    const slug = owner.data.slug;
    const response = await fetch(new URL(`/api/mentors/${slug}`, baseUrl));
    expect(response.status).toBe(200);
    const body = await response.json() as { data: Record<string, unknown> };
    expect(Object.keys(body.data).sort()).toEqual(["bio", "displayName", "publicWorkUrl", "slug", "stackTags"]);
    expect(body.data).toMatchObject({ slug, publicWorkUrl: "https://example.test/work", bio: "I build reliable systems." });
    await fetch(new URL("/api/mentors/me/unpublish", baseUrl), { method: "POST", headers, body: "{}" });
    expect((await fetch(new URL(`/api/mentors/${slug}`, baseUrl))).status).toBe(404);
    const republish = await fetch(new URL("/api/mentors/me/publish", baseUrl), { method: "POST", headers, body: "{}" });
    expect((await republish.json() as { data: { slug: string } }).data.slug).toBe(slug);
  });
});
