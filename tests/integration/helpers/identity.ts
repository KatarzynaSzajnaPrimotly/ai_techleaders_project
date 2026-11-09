import { Client } from "pg";
import { signSession, type Role, type Session } from "../../../packages/core/src/http/auth";

export type StoredRole = Extract<Role, "mentee" | "mentor">;

export interface CreateUserInput {
  email: string;
  emailVerifiedAt?: Date;
  displayName?: string | null;
  role?: StoredRole;
  githubId?: string | null;
  githubLogin?: string | null;
  avatarUrl?: string | null;
  id?: string;
}

export interface CreatedUser {
  id: string;
  email: string;
  email_verified_at: Date;
  display_name: string | null;
  role: StoredRole;
  github_id: string | null;
  github_login: string | null;
  avatar_url: string | null;
}

const DEFAULT_STORED_ROLE: StoredRole = "mentee";

export async function mintSessionCookie(session: Session, secret = process.env.JWT_SECRET): Promise<string> {
  if (!secret) throw new Error("JWT_SECRET must be set to mint an integration session");
  return signSession(session, secret);
}

export async function createUser(
  input: CreateUserInput,
  databaseUrl = process.env.DEVMENTOR_DATABASE_URL,
): Promise<CreatedUser> {
  if (!databaseUrl) throw new Error("DEVMENTOR_DATABASE_URL must be set to create an integration user");
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    const result = await client.query<CreatedUser>(
      `INSERT INTO users (id, email, email_verified_at, display_name, role, github_id, github_login, avatar_url)
       VALUES (COALESCE($1::uuid, gen_random_uuid()), lower($2), $3, $4, $5, $6, $7, $8)
       RETURNING id, email, email_verified_at, display_name, role, github_id, github_login, avatar_url`,
      [
        input.id ?? null,
        input.email,
        input.emailVerifiedAt ?? new Date(),
        input.displayName ?? null,
        input.role ?? DEFAULT_STORED_ROLE,
        input.githubId ?? null,
        input.githubLogin ?? null,
        input.avatarUrl ?? null,
      ],
    );
    const user = result.rows[0];
    if (!user) throw new Error("The integration user insert returned no row");
    return user;
  } finally {
    await client.end();
  }
}
