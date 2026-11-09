import { randomUUID } from "node:crypto";
import { Client } from "pg";
import { afterAll, describe, expect, inject, it } from "vitest";
import { ConflictError } from "@devmentor/core";
import { createOrm, createUserRepository } from "@devmentor/db";
import { runMigrationCycle } from "./helpers/migrations";

const databaseUrl = inject("databaseUrl");
const userTag = randomUUID();
const now = new Date();

const ormPromise = createOrm({ url: databaseUrl, pool: { min: 1, max: 2 } });

afterAll(async () => {
  const orm = await ormPromise;
  await orm.close(true);
});

describe("users persistence in an isolated PostgreSQL", () => {
  it("preserves unverified accounts during the migration up/down/up cycle", async () => {
    const email = `unverified-${userTag}@example.test`;
    const client = new Client({ connectionString: databaseUrl });
    await client.connect();
    try {
      await client.query(
        "INSERT INTO users (email, email_verified_at, display_name, role, roles) VALUES ($1, NULL, 'Unverified', 'mentee', ARRAY['mentee']::text[])",
        [email],
      );
    } finally {
      await client.end();
    }

    runMigrationCycle(databaseUrl);

    const verify = new Client({ connectionString: databaseUrl });
    await verify.connect();
    try {
      const result = await verify.query<{ email_verified_at: Date | null }>(
        "SELECT email_verified_at FROM users WHERE email = $1",
        [email],
      );
      expect(result.rows[0]?.email_verified_at).toBeNull();
    } finally {
      await verify.end();
    }
  });

  it("creates and finds normalized user identities", async () => {
    const orm = await ormPromise;
    const repository = createUserRepository(orm.em.fork());
    const user = await repository.create({
      email: `  ${userTag}@Example.Test  `,
      emailVerifiedAt: now,
      displayName: "Ada",
      role: "mentee",
    });

    expect(user.email).toBe(`${userTag.toLowerCase()}@example.test`);
    await expect(repository.findByEmail(`${userTag}@EXAMPLE.TEST`)).resolves.toMatchObject({ id: user.id });
  });

  it("persists a password hash without changing its value", async () => {
    const orm = await ormPromise;
    const repository = createUserRepository(orm.em.fork());
    const passwordHash = "$2b$12$integration-password-hash";
    const user = await repository.create({
      email: `password-${userTag}@example.test`,
      emailVerifiedAt: now,
      passwordHash,
    });
    await expect(repository.findByEmail(user.email)).resolves.toMatchObject({ id: user.id, passwordHash });
  });

  it("maps a duplicate email constraint to a typed conflict", async () => {
    const orm = await ormPromise;
    const repository = createUserRepository(orm.em.fork());
    const email = `duplicate-${userTag}@example.test`;
    await repository.create({ email, emailVerifiedAt: now });

    await expect(repository.create({ email: email.toUpperCase(), emailVerifiedAt: now })).rejects.toBeInstanceOf(ConflictError);
  });

  it("conditionally links a GitHub identity once and conflicts on duplicates", async () => {
    const orm = await ormPromise;
    const repository = createUserRepository(orm.em.fork());
    const first = await repository.create({ email: `link-a-${userTag}@example.test`, emailVerifiedAt: now });
    const second = await repository.create({ email: `link-b-${userTag}@example.test`, emailVerifiedAt: now });

    await expect(repository.linkGithub(first.id, `github-${userTag}`)).resolves.toBe(true);
    await expect(repository.linkGithub(first.id, `other-${userTag}`)).resolves.toBe(false);
    await expect(repository.linkGithub(second.id, `github-${userTag}`)).rejects.toBeInstanceOf(ConflictError);
  });

  it("updates only the stored mentee or mentor role", async () => {
    const orm = await ormPromise;
    const repository = createUserRepository(orm.em.fork());
    const user = await repository.create({ email: `role-${userTag}@example.test`, emailVerifiedAt: now });

    await expect(repository.grantRole(user.id, "mentor")).resolves.toBe(true);
    await expect(repository.findByEmail(user.email)).resolves.toMatchObject({ role: "mentee", roles: ["mentee", "mentor"] });
    await expect(repository.grantRole(randomUUID(), "mentee")).resolves.toBe(false);
  });
});
