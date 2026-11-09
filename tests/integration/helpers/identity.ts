import { Client } from "pg";
import { signSession, type Role, type Session } from "../../../packages/core/src/http/auth";
import { hashToken, mintOpaqueToken } from "../../../packages/core/src/services/invitations/token.service";

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
  session_version: number;
}

const DEFAULT_STORED_ROLE: StoredRole = "mentee";

export async function mintSessionCookie(
  session: Omit<Session, "sessionVersion"> & Partial<Pick<Session, "sessionVersion">>,
  secret = process.env.JWT_SECRET,
): Promise<string> {
  if (!secret) throw new Error("JWT_SECRET must be set to mint an integration session");
  return signSession({ ...session, sessionVersion: session.sessionVersion ?? 0 }, secret);
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
       RETURNING id, email, email_verified_at, display_name, role, github_id, github_login, avatar_url, session_version`,
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

export async function seedPendingInvitation(
  input: { email: string; stackTags?: string[]; expiresAt?: Date; batch?: string | null },
  databaseUrl = process.env.DEVMENTOR_DATABASE_URL,
): Promise<{ id: string; email: string; token: string; expiresAt: Date }> {
  if (!databaseUrl) throw new Error("DEVMENTOR_DATABASE_URL must be set to seed an integration invitation");
  const token = mintOpaqueToken();
  const expiresAt = input.expiresAt ?? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    const result = await client.query<{ id: string; email: string; expires_at: Date }>(
      `INSERT INTO invitations (email, token_hash, stack_tags, expires_at, batch)
       VALUES (lower($1), $2, $3::text[], $4, $5)
       RETURNING id, email, expires_at`,
      [input.email, hashToken(token), input.stackTags ?? ["TypeScript"], expiresAt, input.batch ?? null],
    );
    const invitation = result.rows[0];
    if (!invitation) throw new Error("The integration invitation insert returned no row");
    return { id: invitation.id, email: invitation.email, token, expiresAt: invitation.expires_at };
  } finally {
    await client.end();
  }
}
