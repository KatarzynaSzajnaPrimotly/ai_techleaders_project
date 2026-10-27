import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ConflictError, UnauthorizedError, ValidationError } from "../../http/errors";
import { signPurposeToken } from "../../http/tokens";
import * as tokenModule from "../../http/tokens";
import type { MailerPort } from "../notifications/mailer.port";
import type { PasswordHasherPort } from "./password-hasher.port";
import type { AccountService } from "./account.service";
import { DUMMY_PASSWORD_HASH } from "./password-hasher";
import { PasswordAuthService, REGISTRATION_TOKEN_TTL_SECONDS } from "./password-auth.service";

const JWT_SECRET = "password-auth-test-secret-with-at-least-32-characters";
const APP_URL = "https://devmentor.example";

function setup() {
  const accountService = {
    findByEmail: vi.fn().mockResolvedValue(null),
    createPasswordAccount: vi.fn(),
    findForLogin: vi.fn().mockResolvedValue(null),
  } as unknown as Pick<AccountService, "findByEmail" | "createPasswordAccount" | "findForLogin">;
  const passwordHasher: PasswordHasherPort = {
    hash: vi.fn().mockResolvedValue("$2b$12$test-password-hash"),
    compare: vi.fn().mockResolvedValue(false),
  };
  const mailer: MailerPort = { send: vi.fn().mockResolvedValue(undefined) };
  return { service: new PasswordAuthService({ accountService, passwordHasher, mailer }), accountService, passwordHasher, mailer };
}

function registrationMessage(mailer: MailerPort): { to: string; subject: string; text: string } {
  const send = mailer.send as ReturnType<typeof vi.fn>;
  return send.mock.calls[0]?.[0] as { to: string; subject: string; text: string };
}

beforeEach(() => {
  vi.stubEnv("APP_URL", APP_URL);
  vi.stubEnv("JWT_SECRET", JWT_SECRET);
  vi.stubEnv("NODE_ENV", "test");
  vi.stubEnv("ALLOW_INSECURE_HTTP", "false");
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("PasswordAuthService.requestRegistration", () => {
  it("signs a 24-hour registration token and mails a confirmation URL to a new address", async () => {
    const { service, mailer } = setup();
    const signer = vi.spyOn(tokenModule, "signPurposeToken");
    await service.requestRegistration({ email: " ADA@Example.Test ", displayName: "Ada Lovelace", returnTo: "/mentor?tab=upcoming" });

    const message = registrationMessage(mailer);
    expect(message.to).toBe("ada@example.test");
    expect(message.subject).not.toContain("Ada");
    expect(message.text.split("\n")[0]).not.toContain("Ada");
    const confirmationUrl = new URL(message.text.match(/https:\/\/[^\s]+/)?.[0] ?? "");
    expect(confirmationUrl.pathname).toBe("/register/confirm");
    const token = confirmationUrl.searchParams.get("token");
    expect(token).toBeTruthy();
    await expect(tokenModule.verifyPurposeToken(token ?? "", "register", JWT_SECRET)).resolves.toMatchObject({
      email: "ada@example.test",
      displayName: "Ada Lovelace",
      returnTo: "/mentor?tab=upcoming",
    });
    expect(signer).toHaveBeenCalledWith("register", {
      email: "ada@example.test",
      displayName: "Ada Lovelace",
      returnTo: "/mentor?tab=upcoming",
    }, REGISTRATION_TOKEN_TTL_SECONDS, JWT_SECRET);
    expect(signer.mock.calls[0]?.[2]).toBe(24 * 60 * 60);
  });

  it.each([
    [{ id: "existing-password", email: "ada@example.test", githubId: null }, "your password"],
    [{ id: "existing-github", email: "ada@example.test", githubId: "github-1" }, "GitHub"],
  ] as const)("sends sign-in guidance for an existing account using %s", async (account, method) => {
    const { service, accountService, mailer } = setup();
    accountService.findByEmail = vi.fn().mockResolvedValue(account) as typeof accountService.findByEmail;
    await service.requestRegistration({ email: "ada@example.test", displayName: "Ada" });
    expect(registrationMessage(mailer)).toMatchObject({
      to: "ada@example.test",
      subject: "Sign in to your DevMentor account",
    });
    expect(registrationMessage(mailer).text).toContain(`Sign in with ${method}`);
    expect(registrationMessage(mailer).text).not.toContain("token=");
  });

  it("performs one token signature and one send for both new and existing addresses", async () => {
    const { service, accountService, mailer } = setup();
    const signer = vi.spyOn(tokenModule, "signPurposeToken");
    await service.requestRegistration({ email: "new@example.test", displayName: "New User" });
    accountService.findByEmail = vi.fn().mockResolvedValue({ id: "existing", email: "existing@example.test", githubId: null }) as typeof accountService.findByEmail;
    await service.requestRegistration({ email: "existing@example.test", displayName: "Existing User" });
    expect(signer).toHaveBeenCalledTimes(2);
    expect(mailer.send).toHaveBeenCalledTimes(2);
  });

  it("rejects an unsafe returnTo before signing or mailing", async () => {
    const { service, mailer } = setup();
    await expect(service.requestRegistration({ email: "ada@example.test", displayName: "Ada", returnTo: "https://attacker.example" }))
      .rejects.toBeInstanceOf(ValidationError);
    expect(mailer.send).not.toHaveBeenCalled();
  });

  it("propagates mail delivery failure without changing account data", async () => {
    const { service, mailer, accountService } = setup();
    const failure = new Error("mailer unavailable");
    (mailer.send as ReturnType<typeof vi.fn>).mockRejectedValue(failure);
    await expect(service.requestRegistration({ email: "ada@example.test", displayName: "Ada" })).rejects.toBe(failure);
    expect(accountService.createPasswordAccount).not.toHaveBeenCalled();
  });
});

describe("PasswordAuthService.confirmRegistration", () => {
  it("creates a verified mentee account and returns only the account and safe return path", async () => {
    const { service, accountService, passwordHasher } = setup();
    accountService.createPasswordAccount = vi.fn().mockResolvedValue({ id: "user-1", role: "mentee" }) as typeof accountService.createPasswordAccount;
    const token = await signPurposeToken("register", {
      email: " ADA@Example.Test ",
      displayName: "Ada Lovelace",
      returnTo: "/mentor/sessions",
    }, REGISTRATION_TOKEN_TTL_SECONDS, JWT_SECRET);

    await expect(service.confirmRegistration(token, "a strong password")).resolves.toEqual({
      account: { id: "user-1", role: "mentee" },
      returnTo: "/mentor/sessions",
    });
    expect(passwordHasher.hash).toHaveBeenCalledWith("a strong password");
    expect(accountService.createPasswordAccount).toHaveBeenCalledWith({
      email: "ada@example.test",
      displayName: "Ada Lovelace",
      emailVerifiedAt: expect.any(Date),
      passwordHash: "$2b$12$test-password-hash",
    });
  });

  it("omits returnTo when the signed registration token has none", async () => {
    const { service, accountService } = setup();
    accountService.createPasswordAccount = vi.fn().mockResolvedValue({ id: "user-1", role: "mentee" }) as typeof accountService.createPasswordAccount;
    const token = await signPurposeToken("register", { email: "ada@example.test", displayName: "Ada" }, 60, JWT_SECRET);
    await expect(service.confirmRegistration(token, "a strong password")).resolves.toEqual({ account: { id: "user-1", role: "mentee" } });
  });

  it("rejects a malformed token with a generic registration-link error", async () => {
    const { service, accountService, passwordHasher } = setup();
    await expect(service.confirmRegistration("not-a-token", "a strong password")).rejects.toMatchObject({
      name: "UnauthorizedError",
      message: "This registration link is invalid or expired. Please register again.",
    });
    expect(passwordHasher.hash).not.toHaveBeenCalled();
    expect(accountService.createPasswordAccount).not.toHaveBeenCalled();
  });

  it("rejects a token for another purpose with a generic registration-link error", async () => {
    const { service, accountService, passwordHasher } = setup();
    const token = await signPurposeToken("oauth-state", { nonce: "n-1" }, 60, JWT_SECRET);
    await expect(service.confirmRegistration(token, "a strong password")).rejects.toMatchObject({
      name: "UnauthorizedError",
      message: "This registration link is invalid or expired. Please register again.",
    });
    expect(passwordHasher.hash).not.toHaveBeenCalled();
    expect(accountService.createPasswordAccount).not.toHaveBeenCalled();
  });

  it("rejects a signed token with malformed registration claims", async () => {
    const { service, accountService } = setup();
    const token = await signPurposeToken("register", { email: "not-an-email", displayName: "Ada" }, 60, JWT_SECRET);
    await expect(service.confirmRegistration(token, "a strong password")).rejects.toBeInstanceOf(UnauthorizedError);
    expect(accountService.createPasswordAccount).not.toHaveBeenCalled();
  });

  it("rejects an unsafe returnTo embedded in a registration token", async () => {
    const { service, accountService } = setup();
    const token = await signPurposeToken("register", { email: "ada@example.test", displayName: "Ada", returnTo: "/api/auth/logout" }, 60, JWT_SECRET);
    await expect(service.confirmRegistration(token, "a strong password")).rejects.toMatchObject({ name: "UnauthorizedError" });
    expect(accountService.createPasswordAccount).not.toHaveBeenCalled();
  });

  it("maps a duplicate confirmation race to the generic already-used response", async () => {
    const { service, accountService } = setup();
    accountService.createPasswordAccount = vi.fn().mockRejectedValue(new ConflictError("unique race")) as typeof accountService.createPasswordAccount;
    const token = await signPurposeToken("register", { email: "ada@example.test", displayName: "Ada" }, 60, JWT_SECRET);
    await expect(service.confirmRegistration(token, "a strong password")).rejects.toMatchObject({
      name: "UnauthorizedError",
      message: "This link has already been used. Please sign in.",
    });
  });

  it("propagates a non-conflict account creation error", async () => {
    const { service, accountService } = setup();
    const failure = new Error("database offline");
    accountService.createPasswordAccount = vi.fn().mockRejectedValue(failure) as typeof accountService.createPasswordAccount;
    const token = await signPurposeToken("register", { email: "ada@example.test", displayName: "Ada" }, 60, JWT_SECRET);
    await expect(service.confirmRegistration(token, "a strong password")).rejects.toBe(failure);
  });
});

describe("PasswordAuthService.authenticate", () => {
  it("normalizes the e-mail and returns only the account session fields on success", async () => {
    const { service, accountService, passwordHasher } = setup();
    accountService.findForLogin = vi.fn().mockResolvedValue({ id: "user-1", role: "mentor", passwordHash: "$2b$12$stored" }) as typeof accountService.findForLogin;
    (passwordHasher.compare as ReturnType<typeof vi.fn>).mockResolvedValue(true);
    await expect(service.authenticate(" ADA@Example.Test ", "correct password")).resolves.toEqual({ id: "user-1", role: "mentor" });
    expect(accountService.findForLogin).toHaveBeenCalledWith("ada@example.test");
    expect(passwordHasher.compare).toHaveBeenCalledWith("correct password", "$2b$12$stored");
  });

  it.each([
    ["unknown address", null],
    ["wrong password", { id: "user-1", role: "mentee", passwordHash: "$2b$12$stored" }],
    ["GitHub-only account", { id: "user-2", role: "mentee", passwordHash: null }],
  ] as const)("uses the same generic failure for %s", async (_label, account) => {
    const { service, accountService, passwordHasher } = setup();
    accountService.findForLogin = vi.fn().mockResolvedValue(account) as typeof accountService.findForLogin;
    await expect(service.authenticate("ada@example.test", "wrong password")).rejects.toMatchObject({
      name: "UnauthorizedError",
      message: "Invalid credentials",
    });
    expect(passwordHasher.compare).toHaveBeenCalledTimes(1);
    expect(passwordHasher.compare).toHaveBeenCalledWith("wrong password", account?.passwordHash ?? DUMMY_PASSWORD_HASH);
  });

  it("still rejects a GitHub-only account if the dummy comparison happens to return true", async () => {
    const { service, accountService, passwordHasher } = setup();
    accountService.findForLogin = vi.fn().mockResolvedValue({ id: "github-user", role: "mentee", passwordHash: null }) as typeof accountService.findForLogin;
    (passwordHasher.compare as ReturnType<typeof vi.fn>).mockResolvedValue(true);
    await expect(service.authenticate("ada@example.test", "irrelevant")).rejects.toMatchObject({ message: "Invalid credentials" });
  });
});
