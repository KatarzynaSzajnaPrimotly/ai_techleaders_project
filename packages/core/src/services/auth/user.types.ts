import type { Role } from "../../http/auth";

export type StoredRole = Exclude<Role, "operator">;

export interface User {
  id: string;
  email: string;
  emailVerifiedAt: Date;
  displayName: string | null;
  role: StoredRole;
  githubId: string | null;
  githubLogin: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewUser {
  email: string;
  emailVerifiedAt: Date;
  displayName?: string | null;
  role?: StoredRole;
  githubId?: string | null;
  githubLogin?: string | null;
  avatarUrl?: string | null;
}
