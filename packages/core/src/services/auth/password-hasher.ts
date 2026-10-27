import bcrypt from "bcryptjs";
import type { PasswordHasherPort } from "./password-hasher.port";

export const PASSWORD_HASH_COST = 12;

/** A cost-12 hash used to keep unknown and GitHub-only login checks equivalent. */
export const DUMMY_PASSWORD_HASH = "$2b$12$feZ.GI3fK5UThl3kftWsled2myADwl41sYxn54vtMwxuAlDljbi1O";

export function createPasswordHasher(): PasswordHasherPort {
  return {
    hash(password) {
      return bcrypt.hash(password, PASSWORD_HASH_COST);
    },
    compare(password, passwordHash) {
      return bcrypt.compare(password, passwordHash);
    },
  };
}
