import type { NewUser, StoredRole, User } from "./user.types";

export interface UserRepositoryPort {
  findById(userId: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByGithubId(githubId: string): Promise<User | null>;
  create(input: NewUser): Promise<User>;
  linkGithub(userId: string, githubId: string): Promise<boolean>;
  grantRole(userId: string, role: StoredRole): Promise<boolean>;
}
