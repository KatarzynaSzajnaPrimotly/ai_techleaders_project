import { MentorValidationError } from "./errors";
import type { Mentor, MentorRepository, NewMentor } from "./mentor";

export class MentorService {
  private readonly mentorRepository: MentorRepository;

  constructor({ mentorRepository }: { mentorRepository: MentorRepository }) {
    this.mentorRepository = mentorRepository;
  }

  list(): Promise<Mentor[]> {
    return this.mentorRepository.findAll();
  }

  async register(input: NewMentor): Promise<Mentor> {
    const name = input.name.trim();
    const email = input.email.trim().toLowerCase();
    if (!name) throw new MentorValidationError("Mentor name is required");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new MentorValidationError("Mentor email is invalid");
    return this.mentorRepository.create({ name, email });
  }
}
