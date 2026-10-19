import type { Mentor, NewMentor } from "./mentor.types";
import type { MentorRepositoryPort } from "./mentor-repository.port";

export class MentorService {
  private readonly mentorRepository: MentorRepositoryPort;

  constructor({ mentorRepository }: { mentorRepository: MentorRepositoryPort }) {
    this.mentorRepository = mentorRepository;
  }

  list(): Promise<Mentor[]> {
    return this.mentorRepository.findAll();
  }

  register(input: NewMentor): Promise<Mentor> {
    return this.mentorRepository.create(input);
  }
}
