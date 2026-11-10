import { describe, expect, it } from "vitest";
import { MentorProfileSchema } from "../index";

describe("MentorProfileSchema", () => {
  it("maps one owner-scoped profile with its first publish deadline", () => {
    expect(MentorProfileSchema.meta.className).toBe("MentorProfile");
    expect(MentorProfileSchema.meta.tableName).toBe("mentor_profiles");
    const properties = MentorProfileSchema.meta.properties;
    expect(Object.keys(properties).sort()).toEqual(["bio", "createdAt", "id", "initialPublishDueAt", "lastPublishedAvailabilityAt", "publicWorkUrl", "publishedAt", "sessionChannel", "slug", "stackTags", "updatedAt", "userId"]);
    expect(properties.id.primary).toBe(true);
    expect(properties.userId.unique).toBe(true);
    expect(properties.initialPublishDueAt.nullable).toBe(true);
    expect(properties.stackTags.type).toBe(Array);
    expect(properties.sessionChannel.nullable).toBe(true);
  });
});
