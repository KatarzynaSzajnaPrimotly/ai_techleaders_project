import {
  absoluteUrl,
  apiHandler,
  enforceRateLimit,
  issueSession,
  loginRateLimitKeys,
  ok,
  parseWithSchema,
  readJsonBody,
  UnauthorizedError,
  ValidationError,
  type RateLimitPolicy,
  type PasswordAuthAccount,
} from "@devmentor/core";
import { loginSchema, safeReturnTo } from "@devmentor/core/validators";
import { clientIpForRequest } from "../../../../server/client-ip";
import { withScope } from "../../../../server/container";
import { homeFor } from "../../../../server/guards";

export const dynamic = "force-dynamic";

const LOGIN_PER_IP_EMAIL_POLICY: RateLimitPolicy = { maxHits: 5, windowSeconds: 15 * 60 };
const LOGIN_PER_IP_POLICY: RateLimitPolicy = { maxHits: 30, windowSeconds: 15 * 60 };
const LOGIN_WITHOUT_IP_POLICY: RateLimitPolicy = LOGIN_PER_IP_EMAIL_POLICY;

function returnToOrHome(value: string | undefined, home: string): string {
  if (value === undefined) return home;
  try {
    return safeReturnTo(value, new URL(absoluteUrl("/")).origin);
  } catch (error) {
    if (!(error instanceof ValidationError)) throw error;
    return home;
  }
}

export const POST = apiHandler(async (request) => {
  const input = parseWithSchema(loginSchema, await readJsonBody(request));
  const clientIp = clientIpForRequest(request);
  const keys = loginRateLimitKeys(input.email, clientIp);

  const { session } = await withScope(async ({ passwordAuthService, rateLimiter }) => {
    const ipWideKey = clientIp ? keys[1] : undefined;
    if (ipWideKey) {
      await enforceRateLimit(rateLimiter, ipWideKey, LOGIN_PER_IP_POLICY);
    }
    let account: PasswordAuthAccount;
    try {
      account = await passwordAuthService.authenticate(input.email, input.password);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        const failurePolicy = clientIp ? LOGIN_PER_IP_EMAIL_POLICY : LOGIN_WITHOUT_IP_POLICY;
        await enforceRateLimit(rateLimiter, keys[0], failurePolicy);
      }
      throw error;
    }
    return { session: await issueSession(account) };
  });

  const redirectTo = returnToOrHome(input.returnTo, homeFor(session.session.role));
  const response = ok({ redirectTo });
  response.headers.append("set-cookie", session.cookie);
  return response;
}, { access: "public" });
