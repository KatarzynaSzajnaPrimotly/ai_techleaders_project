import { describe, expect, it } from "vitest";
import { mentorProfileUpdateSchema } from "./mentor-profile.schema";

describe("mentorProfileUpdateSchema", () => {
  it("accepts drafts with empty optional fields and normalizes channel whitespace", () => {
    expect(mentorProfileUpdateSchema.parse({ publicWorkUrl: "", bio: "", sessionChannel: "  Zoom  ", stackTags: ["TypeScript"] })).toEqual({
      publicWorkUrl: "", bio: "", sessionChannel: "Zoom", stackTags: ["TypeScript"],
    });
  });

  it("accepts an HTTP(S) work link and all supported stack tags", () => {
    expect(mentorProfileUpdateSchema.safeParse({
      publicWorkUrl: "http://example.test/work", bio: "Engineer", sessionChannel: "Meet", stackTags: ["TypeScript", "React", "Python", "AI agents"],
    }).success).toBe(true);
  });

  it("rejects unsupported URL protocols and unknown tags", () => {
    expect(mentorProfileUpdateSchema.safeParse({ publicWorkUrl: "ftp://example.test/work" }).success).toBe(false);
    expect(mentorProfileUpdateSchema.safeParse({ stackTags: ["Rust"] }).success).toBe(false);
  });

  it("rejects excessive descriptions, channels, and tag counts", () => {
    expect(mentorProfileUpdateSchema.safeParse({ bio: "a".repeat(2001) }).success).toBe(false);
    expect(mentorProfileUpdateSchema.safeParse({ sessionChannel: "a".repeat(301) }).success).toBe(false);
    expect(mentorProfileUpdateSchema.safeParse({ stackTags: ["TypeScript", "React", "Python", "AI agents", "TypeScript"] }).success).toBe(false);
  });

  it("rejects unknown input keys", () => {
    expect(mentorProfileUpdateSchema.safeParse({ userId: "attacker-controlled" }).success).toBe(false);
  });
});
