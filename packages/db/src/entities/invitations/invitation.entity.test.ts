import { describe, expect, it } from "vitest";
import { InvitationSchema } from "../index";

describe("InvitationSchema", () => {
  it("maps invitations with the single-use token and acceptance fields", () => {
    expect(InvitationSchema.meta.className).toBe("Invitation");
    expect(InvitationSchema.meta.tableName).toBe("invitations");
    const properties = InvitationSchema.meta.properties;
    const columnType = (property: typeof properties.email) =>
      (property as unknown as { columnType: string }).columnType;
    expect(Object.keys(properties).sort()).toEqual([
      "acceptedAt", "acceptedById", "batch", "createdAt", "email", "expiresAt", "id", "publishDueAt",
      "revokedAt", "stackTags", "tokenHash", "updatedAt",
    ]);
    expect(properties.id.primary).toBe(true);
    expect(columnType(properties.email)).toBe("varchar(255)");
    expect(properties.tokenHash.unique).toBe(true);
    expect(properties.stackTags.type).toBe(Array);
    expect(columnType(properties.stackTags)).toBe("text[]");
    expect(properties.acceptedAt.nullable).toBe(true);
    expect(properties.acceptedById.nullable).toBe(true);
    expect(properties.publishDueAt.nullable).toBe(true);
    expect(properties.revokedAt.nullable).toBe(true);
    expect(columnType(properties.batch)).toBe("varchar(64)");
  });
});
