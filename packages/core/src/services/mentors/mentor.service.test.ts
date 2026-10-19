import { describe, expect, it, vi } from "vitest";
import type { Mentor } from "./mentor.types";
import { MentorService } from "./mentor.service";

const mentor: Mentor = { id: "1", name: "Ada", email: "ada@example.com", createdAt: new Date(0) };

function createService() {
  const mentorRepository = {
    findAll: vi.fn().mockResolvedValue([mentor]),
    create: vi.fn().mockResolvedValue(mentor),
  };
  return { service: new MentorService({ mentorRepository }), mentorRepository };
}

describe("MentorService", () => {
  it("lists mentors from the repository", async () => {
    const { service, mentorRepository } = createService();
    await expect(service.list()).resolves.toEqual([mentor]);
    expect(mentorRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it("registers a mentor through the repository", async () => {
    const { service, mentorRepository } = createService();
    await expect(service.register({ name: "Ada", email: "ada@example.com" })).resolves.toBe(mentor);
    expect(mentorRepository.create).toHaveBeenCalledWith({ name: "Ada", email: "ada@example.com" });
  });

  it("lets repository errors (for example duplicates) propagate as rejections", async () => {
    const { service, mentorRepository } = createService();
    mentorRepository.create.mockRejectedValue(new Error("duplicate"));
    await expect(service.register({ name: "Ada", email: "ada@example.com" })).rejects.toThrowError("duplicate");
  });
});
