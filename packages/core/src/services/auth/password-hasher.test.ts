import { describe, expect, it } from "vitest";
import { createPasswordHasher, DUMMY_PASSWORD_HASH, PASSWORD_HASH_COST } from "./password-hasher";

describe("password hasher", () => {
  it("hashes passwords with the named cost of at least 12 and verifies them", async () => {
    const hasher = createPasswordHasher();
    const passwordHash = await hasher.hash("correct horse battery staple");
    expect(PASSWORD_HASH_COST).toBe(12);
    expect(passwordHash).toMatch(/^\$2[aby]\$12\$/);
    await expect(hasher.compare("correct horse battery staple", passwordHash)).resolves.toBe(true);
    await expect(hasher.compare("wrong password", passwordHash)).resolves.toBe(false);
  });

  it("provides a valid cost-12 dummy hash for accounts without a password", async () => {
    expect(DUMMY_PASSWORD_HASH).toMatch(/^\$2[aby]\$12\$/);
    await expect(createPasswordHasher().compare("irrelevant-password", DUMMY_PASSWORD_HASH)).resolves.toBe(false);
  });
});
