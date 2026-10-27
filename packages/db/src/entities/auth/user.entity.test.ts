import { describe, expect, it } from "vitest";
import { UserSchema } from "../index";

describe("UserSchema", () => {
  it("maps User to the users table", () => {
    expect(UserSchema.meta.className).toBe("User");
    expect(UserSchema.meta.tableName).toBe("users");
  });

  it("declares the expected columns, constraints, and defaults", () => {
    const properties = UserSchema.meta.properties;
    expect(Object.keys(properties).sort()).toEqual([
      "avatarUrl", "createdAt", "displayName", "email", "emailVerifiedAt", "githubId", "githubLogin", "id", "passwordHash", "role", "updatedAt",
    ]);
    expect(properties.id.primary).toBe(true);
    expect(properties.email.unique).toBe(true);
    expect(properties.email.type).toBe("string");
    expect(properties.emailVerifiedAt.nullable).not.toBe(true);
    expect(properties.role.default).toBe("mentee");
    expect((properties.role as unknown as { check?: string }).check).toBe("role in ('mentee', 'mentor')");
    expect(properties.githubId.unique).toBe(true);
    expect(properties.githubId.nullable).toBe(true);
    expect(properties.displayName.nullable).toBe(true);
    expect(properties.passwordHash.nullable).toBe(true);
  });
});
