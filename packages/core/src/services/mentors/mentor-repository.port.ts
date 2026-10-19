import type { Mentor, NewMentor } from "./mentor.types";

export interface MentorRepositoryPort {
  findAll(): Promise<Mentor[]>;
  create(input: NewMentor): Promise<Mentor>;
}
