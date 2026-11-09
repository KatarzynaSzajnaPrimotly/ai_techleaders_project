import { isInsecureHttpAllowed, requireConfig } from "./env";
import { ServiceUnavailableError } from "../http/errors";

const HTTPS_PROTOCOL = "https:";
const HTTP_PROTOCOL = "http:";

export function absoluteUrl(path: string): string {
  const { APP_URL } = requireConfig(["APP_URL"]);
  let base: URL;
  try {
    base = new URL(APP_URL);
  } catch {
    throw new ServiceUnavailableError("Required configuration is invalid: APP_URL");
  }

  if (base.protocol !== HTTPS_PROTOCOL && base.protocol !== HTTP_PROTOCOL || base.username || base.password) {
    throw new ServiceUnavailableError("Required configuration is invalid: APP_URL");
  }
  const insecureHttpAllowed = isInsecureHttpAllowed();
  if (process.env.NODE_ENV === "production" && base.protocol !== HTTPS_PROTOCOL && !insecureHttpAllowed) {
    throw new ServiceUnavailableError("APP_URL must use HTTPS in production");
  }

  let result: URL;
  try {
    result = new URL(path, base);
  } catch {
    throw new ServiceUnavailableError("The application URL path is invalid");
  }
  if (result.origin !== base.origin) {
    throw new ServiceUnavailableError("The application URL path must stay on the configured origin");
  }
  return result.toString();
}
