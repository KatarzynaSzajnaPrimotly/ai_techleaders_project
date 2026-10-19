import { describe, expect, it } from "vitest";
import { MentorValidationError } from "./errors";
import type { Mentor, MentorRepository, NewMentor } from "./mentor";
import { MentorService } from "./mentor-service";

function createService() {
  const created: NewMentor[] = [];
  const mentorRepository: MentorRepository = {
    findAll: async () => [],
    create: async (input): Promise<Mentor> => {
      created.push(input);
      return { id: "1", createdAt: new Date(0), ...input };
    },
  };
  return { service: new MentorService({ mentorRepository }), created };
}

describe("MentorService.register", () => {
  it("trims the name and lowercases the email", async () => {
    const { service, created } = createService();
    const mentor = await service.register({ name: "  Ada Lovelace ", email: " Ada@Example.COM " });
    expect(created).toEqual([{ name: "Ada Lovelace", email: "ada@example.com" }]);
    expect(mentor.email).toBe("ada@example.com");
  });

  it("rejects an empty name", async () => {
    const { service, created } = createService();
    await expect(service.register({ name: "   ", email: "a@b.co" })).rejects.toBeInstanceOf(MentorValidationError);
    expect(created).toHaveLength(0);
  });

  it("rejects an invalid email", async () => {
    const { service } = createService();
    await expect(service.register({ name: "Ada", email: "not-an-email" })).rejects.toBeInstanceOf(MentorValidationError);
  });
});

describe("MentorService.list", () => {
  it("returns what the repository returns", async () => {
    const { service } = createService();
    expect(await service.list()).toEqual([]);
  });
});
