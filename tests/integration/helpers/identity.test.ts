import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { verifySession, type Session } from "../../../packages/core/src/http/auth";

const pgMock = vi.hoisted(() => ({
  connect: vi.fn(),
  query: vi.fn(),
  end: vi.fn(),
  config: undefined as unknown,
}));
vi.mock("pg", () => ({
  Client: class {
    constructor(config: unknown) { pgMock.config = config; }
    connect() { return pgMock.connect(); }
    query(...args: unknown[]) { return pgMock.query(...args); }
    end() { return pgMock.end(); }
  },
}));

import { createOrReuseUser, createUser, mintSessionCookie, seedPendingInvitation } from "./identity";

const secret = "integration-test-secret-that-is-at-least-32-characters";

beforeEach(() => {
  pgMock.connect.mockReset().mockResolvedValue(undefined);
  pgMock.query.mockReset();
  pgMock.end.mockReset().mockResolvedValue(undefined);
  pgMock.config = undefined;
  vi.stubEnv("JWT_SECRET", secret);
  vi.stubEnv("DEVMENTOR_DATABASE_URL", "postgresql://test:secret@127.0.0.1:5432/test_db");
});
afterEach(() => { vi.unstubAllEnvs(); vi.useRealTimers(); });

describe("integration identity helpers", () => {
  it("mints a session token accepted by the shared session verifier", async () => {
    const session: Session = { userId: "u-1", role: "mentor", sessionVersion: 0 };
    const token = await mintSessionCookie(session);
    await expect(verifySession(token, secret)).resolves.toEqual(session);
  });

  it("defaults a missing session version to zero", async () => {
    const token = await mintSessionCookie({ userId: "u-1", role: "mentee" });
    await expect(verifySession(token, secret)).resolves.toMatchObject({ sessionVersion: 0 });
  });

  it("rejects token creation when JWT_SECRET is not configured", async () => {
    vi.stubEnv("JWT_SECRET", "");
    await expect(mintSessionCookie({ userId: "u-1", role: "mentee", sessionVersion: 0 })).rejects.toThrow("JWT_SECRET must be set");
  });

  it("inserts a normalized user with the supplied test database URL", async () => {
    const inserted = {
      id: "u-1", email: "ada@example.test", email_verified_at: new Date(), display_name: "Ada",
      role: "mentor", roles: ["mentor"], github_id: "123", github_login: "ada", avatar_url: "https://example.test/ada.png", session_version: 0,
    };
    pgMock.query.mockResolvedValue({ rows: [inserted] });

    await expect(createUser({
      email: "Ada@Example.Test", displayName: "Ada", role: "mentor", githubId: "123",
      githubLogin: "ada", avatarUrl: "https://example.test/ada.png", id: "u-1",
    })).resolves.toEqual(inserted);

    expect(pgMock.config).toEqual({ connectionString: "postgresql://test:secret@127.0.0.1:5432/test_db" });
    expect(pgMock.query).toHaveBeenCalledWith(expect.stringContaining("lower($2)"), [
      "u-1", "Ada@Example.Test", expect.any(Date), "Ada", "mentor", ["mentor"], "123", "ada", "https://example.test/ada.png",
    ]);
    expect(pgMock.end).toHaveBeenCalledOnce();
  });

  it("uses defaults and always closes the client when no row is returned", async () => {
    pgMock.query.mockResolvedValue({ rows: [] });
    await expect(createUser({ email: "mentee@example.test" })).rejects.toThrow("returned no row");
    expect(pgMock.query).toHaveBeenCalledWith(expect.any(String), [
      null, "mentee@example.test", expect.any(Date), null, "mentee", ["mentee"], null, null, null,
    ]);
    expect(pgMock.end).toHaveBeenCalledOnce();
  });

  it("closes the client when the database insert fails", async () => {
    pgMock.query.mockRejectedValue(new Error("database unavailable"));
    await expect(createUser({ email: "mentee@example.test" })).rejects.toThrow("database unavailable");
    expect(pgMock.end).toHaveBeenCalledOnce();
  });

  it("rejects missing database configuration before creating a client", async () => {
    vi.stubEnv("DEVMENTOR_DATABASE_URL", "");
    await expect(createUser({ email: "mentee@example.test" })).rejects.toThrow("DEVMENTOR_DATABASE_URL must be set");
    expect(pgMock.config).toBeUndefined();
  });

  it("seeds a pending invitation with a hashed opaque token and defaults", async () => {
    const now = new Date("2026-11-09T12:00:00.000Z");
    vi.useFakeTimers();
    vi.setSystemTime(now);
    const expiresAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    pgMock.query.mockResolvedValue({ rows: [{ id: "inv-1", email: "ada@example.test", expires_at: expiresAt }] });

    await expect(seedPendingInvitation({ email: "Ada@Example.Test" }, "postgresql://test/db")).resolves.toMatchObject({
      id: "inv-1", email: "ada@example.test", expiresAt,
    });
    const [sql, values] = pgMock.query.mock.calls[0];
    expect(sql).toContain("INSERT INTO invitations");
    expect(values).toMatchObject(["Ada@Example.Test", expect.stringMatching(/^[a-f0-9]{64}$/), ["TypeScript"], expiresAt, null]);
    expect(pgMock.end).toHaveBeenCalledOnce();
  });

  it("uses provided invitation tags, deadline and batch", async () => {
    const expiresAt = new Date("2026-12-01T00:00:00.000Z");
    pgMock.query.mockResolvedValue({ rows: [{ id: "inv-2", email: "ada@example.test", expires_at: expiresAt }] });
    await seedPendingInvitation({ email: "ada@example.test", stackTags: ["React"], expiresAt, batch: "November" }, "postgresql://test/db");
    expect(pgMock.query.mock.calls[0][1]).toMatchObject(["ada@example.test", expect.any(String), ["React"], expiresAt, "November"]);
  });

  it("rejects a missing invitation row and closes the database client", async () => {
    pgMock.query.mockResolvedValue({ rows: [] });
    await expect(seedPendingInvitation({ email: "ada@example.test" }, "postgresql://test/db")).rejects.toThrow("insert returned no row");
    expect(pgMock.end).toHaveBeenCalledOnce();
  });

  it("rejects missing database configuration before creating an invitation client", async () => {
    vi.stubEnv("DEVMENTOR_DATABASE_URL", "");
    await expect(seedPendingInvitation({ email: "ada@example.test" })).rejects.toThrow("DEVMENTOR_DATABASE_URL must be set");
    expect(pgMock.config).toBeUndefined();
  });

  it("reuses a conflicting operator identity without changing its existing row", async () => {
    const inserted = { id: "u-operator", email: "operator@example.test", email_verified_at: new Date(), display_name: null, role: "mentee", roles: ["mentee"], github_id: null, github_login: null, avatar_url: null, session_version: 0 };
    pgMock.query.mockResolvedValue({ rows: [inserted] });
    await expect(createOrReuseUser({ email: "operator@example.test" }, "postgresql://test/db")).resolves.toEqual(inserted);
    expect(pgMock.query).toHaveBeenCalledWith(expect.stringContaining("ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email"), [
      null, "operator@example.test", expect.any(Date), null, "mentee", ["mentee"], null, null, null,
    ]);
    expect(pgMock.end).toHaveBeenCalledOnce();
  });

  it("always closes the reused-identity client on an empty result or query error", async () => {
    pgMock.query.mockResolvedValueOnce({ rows: [] });
    await expect(createOrReuseUser({ email: "operator@example.test" }, "postgresql://test/db")).rejects.toThrow("returned no row");
    expect(pgMock.end).toHaveBeenCalledOnce();
    pgMock.end.mockClear();
    pgMock.query.mockRejectedValueOnce(new Error("database unavailable"));
    await expect(createOrReuseUser({ email: "operator@example.test" }, "postgresql://test/db")).rejects.toThrow("database unavailable");
    expect(pgMock.end).toHaveBeenCalledOnce();
  });

  it("rejects missing configuration before creating a reusable user client", async () => {
    vi.stubEnv("DEVMENTOR_DATABASE_URL", "");
    await expect(createOrReuseUser({ email: "operator@example.test" })).rejects.toThrow("DEVMENTOR_DATABASE_URL must be set");
    expect(pgMock.config).toBeUndefined();
  });
});
