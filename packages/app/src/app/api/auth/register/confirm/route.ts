import {
  apiHandler,
  enforceRateLimit,
  issueSession,
  ok,
  parseWithSchema,
  readJsonBody,
  type RateLimitPolicy,
  absoluteUrl,
} from "@devmentor/core";
import { confirmSchema, safeReturnTo } from "@devmentor/core/validators";
import { clientIpForRequest } from "../../../../../server/client-ip";
import { withScope } from "../../../../../server/container";
import { homeFor } from "../../../../../server/guards";

export const dynamic = "force-dynamic";

const CONFIRMATION_PER_IP_POLICY: RateLimitPolicy = { maxHits: 10, windowSeconds: 60 * 60 };

export const POST = apiHandler(async (request) => {
  const input = parseWithSchema(confirmSchema, await readJsonBody(request));
  const clientIp = clientIpForRequest(request);

  if (clientIp) {
    await withScope(({ rateLimiter }) =>
      enforceRateLimit(rateLimiter, `register-confirm:ip:${clientIp}`, CONFIRMATION_PER_IP_POLICY),
    );
  }

  const result = await withScope(({ passwordAuthService }) =>
    passwordAuthService.confirmRegistration(input.token, input.password),
  );
  const session = await issueSession(result.account);
  const safeReturn = result.returnTo
    ? safeReturnTo(result.returnTo, new URL(absoluteUrl("/")).origin)
    : undefined;
  const response = ok({ redirectTo: safeReturn ?? homeFor(session.session.role) });
  response.headers.append("set-cookie", session.cookie);
  return response;
}, { access: "public" });
