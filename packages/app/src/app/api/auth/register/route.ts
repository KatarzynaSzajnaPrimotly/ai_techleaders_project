import {
  apiHandler,
  enforceRateLimit,
  parseWithSchema,
  readJsonBody,
  type RateLimitPolicy,
} from "@devmentor/core";
import { registerSchema } from "@devmentor/core/validators";
import { clientIpForRequest } from "../../../../server/client-ip";
import { withScope } from "../../../../server/container";
import { resolveCurrentSession } from "../../../../server/current-session";

export const dynamic = "force-dynamic";

const REGISTRATION_PER_IP_POLICY: RateLimitPolicy = { maxHits: 5, windowSeconds: 60 * 60 };
const REGISTRATION_PER_EMAIL_POLICY: RateLimitPolicy = { maxHits: 3, windowSeconds: 60 * 60 };
const REGISTRATION_RESPONSE = { message: "Check your e-mail for next steps." };

export const POST = apiHandler(async (request) => {
  const input = parseWithSchema(registerSchema, await readJsonBody(request));
  const clientIp = clientIpForRequest(request);

  await withScope(async ({ passwordAuthService, rateLimiter }) => {
    if (clientIp) {
      await enforceRateLimit(rateLimiter, `register:ip:${clientIp}`, REGISTRATION_PER_IP_POLICY);
    }
    await enforceRateLimit(
      rateLimiter,
      `register:email:${encodeURIComponent(input.email)}`,
      REGISTRATION_PER_EMAIL_POLICY,
    );
    await passwordAuthService.requestRegistration(input);
  });

  return REGISTRATION_RESPONSE;
}, { access: "public", resolveCurrentSession });
