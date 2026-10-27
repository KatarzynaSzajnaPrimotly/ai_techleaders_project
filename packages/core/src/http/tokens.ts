import { jwtVerify, SignJWT, type JWTPayload } from "jose";
import { requireJwtSecret } from "../config/env";
import { UnauthorizedError, ValidationError } from "./errors";

const ALGORITHM = "HS256";
const MIN_TOKEN_TTL_SECONDS = 1;

export type PurposeToken<Purpose extends string = string> = JWTPayload & { purpose: Purpose };

export async function signPurposeToken<const Purpose extends string>(
  purpose: Purpose,
  claims: JWTPayload,
  ttlSeconds: number,
  secret: string = requireJwtSecret(),
): Promise<string> {
  if (!purpose.trim()) throw new ValidationError("Token purpose is required");
  if (!Number.isSafeInteger(ttlSeconds) || ttlSeconds < MIN_TOKEN_TTL_SECONDS) {
    throw new ValidationError("Token lifetime must be a positive integer");
  }

  return new SignJWT({ ...claims, purpose })
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(new TextEncoder().encode(secret));
}

export async function verifyPurposeToken<const Purpose extends string>(
  token: string,
  expectedPurpose: Purpose,
  secret: string = requireJwtSecret(),
): Promise<PurposeToken<Purpose>> {
  if (!expectedPurpose.trim()) throw new UnauthorizedError("Invalid or expired token");
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), { algorithms: [ALGORITHM] });
    if (typeof payload.purpose !== "string" || payload.purpose !== expectedPurpose) {
      throw new UnauthorizedError("Invalid or expired token");
    }
    return payload as PurposeToken<Purpose>;
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}
