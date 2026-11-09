import type { Role } from "../../http/auth";

export type StoredRole = Exclude<Role, "operator">;

export interface User {
  id: string;
  email: string;
  emailVerifiedAt: Date | null;
  passwordHash: string | null;
  displayName: string | null;
  role: StoredRole;
  /** All persisted grants; role remains the primary role for older consumers. */
  roles?: StoredRole[];
  sessionVersion: number;
  githubId: string | null;
  githubLogin: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewUser {
  email: string;
  emailVerifiedAt: Date;
  passwordHash?: string | null;
  displayName?: string | null;
  role?: StoredRole;
  roles?: StoredRole[];
  githubId?: string | null;
  githubLogin?: string | null;
  avatarUrl?: string | null;
}

export interface PasswordAuthAccount {
  id: string;
  email: string;
  role: StoredRole;
  roles?: StoredRole[];
  sessionVersion: number;
}

export interface LoginAccount extends PasswordAuthAccount {
  passwordHash: string | null;
}

export interface ExistingAccountLookup {
  id: string;
  email: string;
  githubId: string | null;
}

export interface RoleHomeProfile {
  displayName: string | null;
  githubLogin: string | null;
}

export interface NewPasswordAccount {
  email: string;
  emailVerifiedAt: Date;
  displayName: string;
  passwordHash: string;
}
