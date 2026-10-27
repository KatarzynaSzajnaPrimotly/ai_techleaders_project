import { ValidationError } from "../../http/errors";

const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f-\u009f]/u;
const SIGN_IN_PATH = "/sign-in";
const REGISTRATION_PATH = "/register";
const API_PATH = "/api";

function isDisallowedPath(pathname: string): boolean {
  const normalized = pathname.toLowerCase();
  return normalized === SIGN_IN_PATH || normalized.startsWith(`${SIGN_IN_PATH}/`) ||
    normalized.startsWith(REGISTRATION_PATH) || normalized === API_PATH || normalized.startsWith(`${API_PATH}/`);
}

export function safeReturnTo(value: string, appUrl: string): string {
  if (!value || value.startsWith("//") || CONTROL_CHARACTERS.test(value)) throw new ValidationError("Invalid returnTo");

  let base: URL;
  let destination: URL;
  try {
    base = new URL(appUrl);
    if (base.protocol !== "https:" && base.protocol !== "http:") throw new Error("Invalid app URL protocol");
    destination = new URL(value, base);
  } catch {
    throw new ValidationError("Invalid returnTo");
  }

  let decodedPathname: string;
  try {
    decodedPathname = decodeURIComponent(destination.pathname);
  } catch {
    throw new ValidationError("Invalid returnTo");
  }
  if (destination.origin !== base.origin || CONTROL_CHARACTERS.test(decodedPathname) ||
    isDisallowedPath(destination.pathname) || isDisallowedPath(decodedPathname)) {
    throw new ValidationError("Invalid returnTo");
  }

  return `${destination.pathname}${destination.search}${destination.hash}`;
}
