import { beforeEach, describe, expect, it, vi } from "vitest";
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

import { createUser, mintSessionCookie } from "./identity";

const secret = "integration-test-secret-that-is-at-least-32-characters";

beforeEach(() => {
  pgMock.connect.mockReset().mockResolvedValue(undefined);
  pgMock.query.mockReset();
  pgMock.end.mockReset().mockResolvedValue(undefined);
  pgMock.config = undefined;
  vi.stubEnv("JWT_SECRET", secret);
  vi.stubEnv("DEVMENTOR_DATABASE_URL", "postgresql://test:secret@127.0.0.1:5432/test_db");
});

describe("integration identity helpers", () => {
  it("mints a session token accepted by the shared session verifier", async () => {
    const session: Session = { userId: "u-1", role: "mentor", sessionVersion: 0 };
    const token = await mintSessionCookie(session);
    await expect(verifySession(token, secret)).resolves.toEqual(session);
  });

  it("rejects token creation when JWT_SECRET is not configured", async () => {
    vi.stubEnv("JWT_SECRET", "");
    await expect(mintSessionCookie({ userId: "u-1", role: "mentee", sessionVersion: 0 })).rejects.toThrow("JWT_SECRET must be set");
  });

  it("inserts a normalized user with the supplied test database URL", async () => {
    const inserted = {
      id: "u-1", email: "ada@example.test", email_verified_at: new Date(), display_name: "Ada",
      role: "mentor", github_id: "123", github_login: "ada", avatar_url: "https://example.test/ada.png", session_version: 0,
    };
    pgMock.query.mockResolvedValue({ rows: [inserted] });

    await expect(createUser({
      email: "Ada@Example.Test", displayName: "Ada", role: "mentor", githubId: "123",
      githubLogin: "ada", avatarUrl: "https://example.test/ada.png", id: "u-1",
    })).resolves.toEqual(inserted);

    expect(pgMock.config).toEqual({ connectionString: "postgresql://test:secret@127.0.0.1:5432/test_db" });
    expect(pgMock.query).toHaveBeenCalledWith(expect.stringContaining("lower($2)"), [
      "u-1", "Ada@Example.Test", expect.any(Date), "Ada", "mentor", "123", "ada", "https://example.test/ada.png",
    ]);
    expect(pgMock.end).toHaveBeenCalledOnce();
  });

  it("uses defaults and always closes the client when no row is returned", async () => {
    pgMock.query.mockResolvedValue({ rows: [] });
    await expect(createUser({ email: "mentee@example.test" })).rejects.toThrow("returned no row");
    expect(pgMock.query).toHaveBeenCalledWith(expect.any(String), [
      null, "mentee@example.test", expect.any(Date), null, "mentee", null, null, null,
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
});
