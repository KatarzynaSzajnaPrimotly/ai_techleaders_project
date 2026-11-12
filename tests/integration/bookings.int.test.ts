import { randomUUID } from "node:crypto";
import { Client } from "pg";
import { describe, expect, inject, it } from "vitest";
import { SESSION_COOKIE } from "../../packages/core/src/http/auth";
import { createUser, mintSessionCookie } from "./helpers/identity";

const baseUrl = inject("baseUrl");
const databaseUrl = inject("databaseUrl");
const jwtSecret = inject("jwtSecret");
const unique = () => randomUUID().replaceAll("-", "");
const headersFor = async (userId: string) => ({
  cookie: `${SESSION_COOKIE}=${await mintSessionCookie({ userId, role: "mentee", roles: ["mentee"] }, jwtSecret)}`,
  "x-devmentor-csrf": "1",
  "content-type": "application/json",
});

async function seedBookableSlot() {
  const suffix = unique();
  const mentor = await createUser({ email: `booking-mentor-${suffix}@example.test`, role: "mentor", displayName: `Booking Mentor ${suffix}` }, databaseUrl);
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    const profile = await client.query<{ id: string }>(
      `insert into mentor_profiles (user_id, slug, public_work_url, bio, session_channel, stack_tags, published_at, price_25_cents, price_50_cents)
       values ($1, $2, 'https://example.test/work', 'Experienced mentor profile text', 'https://example.test/session', ARRAY['TypeScript'], now(), 5000, 9000) returning id`,
      [mentor.id, `booking-${suffix}`],
    );
    const slot = await client.query<{ id: string }>(
      "insert into slots (mentor_profile_id, starts_at) values ($1, now() + interval '4 hours') returning id",
      [profile.rows[0]?.id],
    );
    return slot.rows[0]?.id ?? "";
  } finally { await client.end(); }
}

describe("booking hold integration", () => {
  it("allows only one concurrent mentee to hold a slot and snapshots server price", async () => {
    const slotId = await seedBookableSlot();
    const suffix = unique();
    const mentees = await Promise.all([1, 2].map((n) => createUser({ email: `booking-mentee-${n}-${suffix}@example.test`, role: "mentee", displayName: `Mentee ${n}` }, databaseUrl)));
    const responses = await Promise.all(mentees.map(async (mentee) => fetch(new URL("/api/bookings", baseUrl), {
      method: "POST", headers: await headersFor(mentee.id), body: JSON.stringify({ slotId, lengthMinutes: 25 }),
    })));
    const responseBodies = await Promise.all(responses.map((response) => response.json()));
    expect(responses.map((response) => response.status).sort(), JSON.stringify(responseBodies)).toEqual([200, 409]);
    const createdIndex = responses.findIndex((response) => response.status === 200);
    expect(responseBodies[createdIndex]).toMatchObject({ ok: true, data: { status: "pending_payment", priceCents: 5000, currency: "EUR" } });
  });

  it("releases a stale hold so another mentee can claim the slot", async () => {
    const slotId = await seedBookableSlot();
    const suffix = unique();
    const first = await createUser({ email: `booking-expired-a-${suffix}@example.test`, role: "mentee", displayName: "First Mentee" }, databaseUrl);
    const second = await createUser({ email: `booking-expired-b-${suffix}@example.test`, role: "mentee", displayName: "Second Mentee" }, databaseUrl);
    const firstResponse = await fetch(new URL("/api/bookings", baseUrl), { method: "POST", headers: await headersFor(first.id), body: JSON.stringify({ slotId, lengthMinutes: 50 }) });
    expect(firstResponse.status).toBe(200);
    const client = new Client({ connectionString: databaseUrl });
    await client.connect();
    try { await client.query("update bookings set expires_at = now() - interval '1 minute' where slot_id = $1", [slotId]); }
    finally { await client.end(); }
    const secondResponse = await fetch(new URL("/api/bookings", baseUrl), { method: "POST", headers: await headersFor(second.id), body: JSON.stringify({ slotId, lengthMinutes: 50 }) });
    expect(secondResponse.status).toBe(200);
  });
});
