import { absoluteUrl } from "../../config/absolute-url";
import { requireJwtSecret } from "../../config/env";
import { ConflictError, UnauthorizedError } from "../../http/errors";
import { signPurposeToken, verifyPurposeToken } from "../../http/tokens";
import { safeReturnTo } from "../../validators/auth/safe-return-to";
import { registerSchema, type RegisterInput } from "../../validators/auth/register.schema";
import type { MailerPort } from "../notifications/mailer.port";
import type { PasswordHasherPort } from "./password-hasher.port";
import { DUMMY_PASSWORD_HASH } from "./password-hasher";
import { buildExistingAccountMail, buildRegistrationMail } from "./registration-mail";
import type { AccountService } from "./account.service";
import type { PasswordAuthAccount } from "./user.types";

const REGISTRATION_TOKEN_PURPOSE = "register";
export const REGISTRATION_TOKEN_TTL_SECONDS = 24 * 60 * 60;
const ALREADY_USED_MESSAGE = "This link has already been used. Please sign in.";
const INVALID_REGISTRATION_TOKEN_MESSAGE = "This registration link is invalid or expired. Please register again.";
const INVALID_CREDENTIALS_MESSAGE = "Invalid credentials";

export interface ConfirmRegistrationResult {
  account: PasswordAuthAccount;
  returnTo?: string;
}

export type RegistrationPreview = { email: string; status: "ready" | "used" } | null;

type PasswordAuthAccounts = Pick<AccountService, "findByEmail" | "createPasswordAccount" | "findForLogin">;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function invalidRegistrationToken(): UnauthorizedError {
  return new UnauthorizedError(INVALID_REGISTRATION_TOKEN_MESSAGE);
}

export class PasswordAuthService {
  private readonly accountService: PasswordAuthAccounts;
  private readonly passwordHasher: PasswordHasherPort;
  private readonly mailer: MailerPort;

  constructor({ accountService, passwordHasher, mailer }: {
    accountService: PasswordAuthAccounts;
    passwordHasher: PasswordHasherPort;
    mailer: MailerPort;
  }) {
    this.accountService = accountService;
    this.passwordHasher = passwordHasher;
    this.mailer = mailer;
  }

  async requestRegistration(input: RegisterInput): Promise<void> {
    const email = normalizeEmail(input.email);
    const existingUser = await this.accountService.findByEmail(email);
    const appUrl = new URL(absoluteUrl("/")).origin;
    const returnTo = input.returnTo === undefined ? undefined : safeReturnTo(input.returnTo, appUrl);
    const claims = {
      email,
      displayName: input.displayName,
      ...(returnTo === undefined ? {} : { returnTo }),
    };
    const token = await signPurposeToken(REGISTRATION_TOKEN_PURPOSE, claims, REGISTRATION_TOKEN_TTL_SECONDS, requireJwtSecret());
    const confirmationUrl = absoluteUrl(`/register/confirm?token=${encodeURIComponent(token)}`);
    const signInUrl = absoluteUrl("/sign-in");
    const message = existingUser
      ? buildExistingAccountMail(signInUrl, existingUser.githubId !== null)
      : buildRegistrationMail(confirmationUrl);

    await this.mailer.send({ to: email, ...message });
  }

  async confirmRegistration(token: string, password: string): Promise<ConfirmRegistrationResult> {
    const secret = requireJwtSecret();
    let claims;
    try {
      claims = await verifyPurposeToken(token, REGISTRATION_TOKEN_PURPOSE, secret);
    } catch {
      throw invalidRegistrationToken();
    }

    const claimInput = registerSchema.safeParse({
      email: claims.email,
      displayName: claims.displayName,
      ...(claims.returnTo === undefined ? {} : { returnTo: claims.returnTo }),
    });
    if (!claimInput.success) throw invalidRegistrationToken();

    let returnTo: string | undefined;
    try {
      if (claimInput.data.returnTo !== undefined) {
        returnTo = safeReturnTo(claimInput.data.returnTo, new URL(absoluteUrl("/")).origin);
      }
    } catch {
      throw invalidRegistrationToken();
    }

    const passwordHash = await this.passwordHasher.hash(password);
    try {
      const account = await this.accountService.createPasswordAccount({
        email: claimInput.data.email,
        emailVerifiedAt: new Date(),
        passwordHash,
        displayName: claimInput.data.displayName,
      });
      return {
        account,
        ...(returnTo === undefined ? {} : { returnTo }),
      };
    } catch (error) {
      if (error instanceof ConflictError) throw new UnauthorizedError(ALREADY_USED_MESSAGE);
      throw error;
    }
  }

  async authenticate(emailInput: string, password: string): Promise<PasswordAuthAccount> {
    const user = await this.accountService.findForLogin(normalizeEmail(emailInput));
    const passwordHash = user?.passwordHash ?? DUMMY_PASSWORD_HASH;
    const validPassword = await this.passwordHasher.compare(password, passwordHash);
    if (!user || !user.passwordHash || !validPassword) throw new UnauthorizedError(INVALID_CREDENTIALS_MESSAGE);
    return { id: user.id, role: user.role };
  }

  async inspectRegistrationToken(token: string): Promise<RegistrationPreview> {
    let claims;
    try {
      claims = await verifyPurposeToken(token, REGISTRATION_TOKEN_PURPOSE, requireJwtSecret());
    } catch {
      return null;
    }
    const parsed = registerSchema.safeParse({ email: claims.email, displayName: claims.displayName });
    if (!parsed.success || (claims.returnTo !== undefined && typeof claims.returnTo !== "string")) return null;
    try {
      if (claims.returnTo !== undefined) safeReturnTo(claims.returnTo, new URL(absoluteUrl("/")).origin);
    } catch {
      return null;
    }
    const existing = await this.accountService.findByEmail(parsed.data.email);
    return { email: parsed.data.email, status: existing ? "used" : "ready" };
  }
}
