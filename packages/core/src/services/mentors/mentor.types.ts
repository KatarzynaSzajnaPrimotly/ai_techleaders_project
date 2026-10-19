export interface Mentor {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export type NewMentor = Pick<Mentor, "name" | "email">;
