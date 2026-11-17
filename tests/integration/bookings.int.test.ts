import { randomUUID } from "node:crypto";
import { createHmac } from "node:crypto";
import { Client } from "pg";
import { describe, expect, inject, it } from "vitest";
import { SESSION_COOKIE } from "../../packages/core/src/http/auth";
import { createUser, mintSessionCookie } from "./helpers/identity";

const baseUrl = inject("baseUrl");
const databaseUrl = inject("databaseUrl");
const jwtSecret = inject("jwtSecret");
const paymentSecret = "integration-only-webhook-secret-at-least-32-characters";
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

  it("confirms a booking only from a signed payment webhook and deduplicates retries", async () => {
    const slotId = await seedBookableSlot();
    const mentee = await createUser({ email: `booking-paid-${unique()}@example.test`, role: "mentee", displayName: "Paying Mentee" }, databaseUrl);
    const headers = await headersFor(mentee.id);
    const held = await fetch(new URL("/api/bookings", baseUrl), { method: "POST", headers, body: JSON.stringify({ slotId, lengthMinutes: 25 }) });
    const heldBody = await held.json() as { data: { id: string } };
    expect(held.status).toBe(200);
    const checkout = await fetch(new URL("/api/bookings/checkout", baseUrl), { method: "POST", headers, body: JSON.stringify({ bookingId: heldBody.data.id }) });
    const checkoutBody = await checkout.json() as { data: { checkoutUrl: string } };
    expect(checkout.status).toBe(200);
    const checkoutSessionId = new URL(checkoutBody.data.checkoutUrl).pathname.split("/").at(-1) ?? "";
    const event = JSON.stringify({ id: randomUUID(), type: "checkout.paid", checkoutSessionId, amountCents: 5000, currency: "EUR" });
    const signature = createHmac("sha256", paymentSecret).update(event).digest("hex");
    const sendWebhook = () => fetch(new URL("/api/payments/webhook", baseUrl), { method: "POST", headers: { "x-devmentor-payment-signature": signature }, body: event });
    expect((await sendWebhook()).status).toBe(200);
    expect((await sendWebhook()).status).toBe(200);
    const client = new Client({ connectionString: databaseUrl });
    await client.connect();
    try {
      const result = await client.query("select status, payment_status from bookings where id = $1", [heldBody.data.id]);
      expect(result.rows[0]).toEqual({ status: "confirmed", payment_status: "paid" });
    } finally { await client.end(); }
  });

  it("refunds a valid payment that arrives after the hold expires", async () => {
    const slotId = await seedBookableSlot();
    const mentee = await createUser({ email: `booking-late-${unique()}@example.test`, role: "mentee", displayName: "Late Mentee" }, databaseUrl);
    const headers = await headersFor(mentee.id);
    const held = await fetch(new URL("/api/bookings", baseUrl), { method: "POST", headers, body: JSON.stringify({ slotId, lengthMinutes: 25 }) });
    const heldBody = await held.json() as { data: { id: string } };
    const checkout = await fetch(new URL("/api/bookings/checkout", baseUrl), { method: "POST", headers, body: JSON.stringify({ bookingId: heldBody.data.id }) });
    const checkoutBody = await checkout.json() as { data: { checkoutUrl: string } };
    const checkoutSessionId = new URL(checkoutBody.data.checkoutUrl).pathname.split("/").at(-1) ?? "";
    const client = new Client({ connectionString: databaseUrl });
    await client.connect();
    try { await client.query("update bookings set expires_at = now() - interval '1 minute' where id = $1", [heldBody.data.id]); }
    finally { await client.end(); }
    const event = JSON.stringify({ id: randomUUID(), type: "checkout.paid", checkoutSessionId, amountCents: 5000, currency: "EUR" });
    const signature = createHmac("sha256", paymentSecret).update(event).digest("hex");
    const response = await fetch(new URL("/api/payments/webhook", baseUrl), { method: "POST", headers: { "x-devmentor-payment-signature": signature }, body: event });
    expect(response.status).toBe(200);
    const verify = new Client({ connectionString: databaseUrl });
    await verify.connect();
    const result = await verify.query("select status, payment_status from bookings where id = $1", [heldBody.data.id]);
    expect(result.rows[0]).toEqual({ status: "expired", payment_status: "refunded" });
    await verify.end();
  });
});
