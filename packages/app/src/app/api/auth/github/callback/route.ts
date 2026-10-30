import {
  absoluteUrl,
  apiHandler,
  clearOAuthStateCookie,
  ForbiddenError,
  NoVerifiedGithubEmailError,
  readOAuthStateCookie,
  issueSession,
  isMockAuthEnabled,
  ServiceUnavailableError,
  UnauthorizedError,
  verifyOAuthState,
  type AppError,
} from "@devmentor/core";
import { withScope } from "../../../../../server/container";
import { homeFor } from "../../../../../server/guards";

export const dynamic = "force-dynamic";

const CALLBACK_PATH = "/api/auth/github/callback";
const SIGN_IN_PATH = "/sign-in";
const REDIRECT_STATUS = 303;

function redirect(path: string): Response {
  return new Response(null, { status: REDIRECT_STATUS, headers: { location: path } });
}

function redirectWithCookie(path: string, cookie: string): Response {
  const response = redirect(path);
  response.headers.append("set-cookie", cookie);
  return response;
}

function navigation(error: AppError): Response {
  let query = "unavailable";
  if (error instanceof NoVerifiedGithubEmailError) query = "no-verified-email";
  else if (error instanceof UnauthorizedError || error instanceof ForbiddenError) query = "state";
  return redirectWithCookie(`${SIGN_IN_PATH}?error=${query}`, clearOAuthStateCookie());
}

export const GET = apiHandler(
  async (request) => {
    const url = new URL(request.url);
    const providerError = url.searchParams.get("error");
    if (providerError === "access_denied") {
      return redirectWithCookie(`${SIGN_IN_PATH}?cancelled=1`, clearOAuthStateCookie());
    }
    if (providerError) throw new ServiceUnavailableError("GitHub authentication is temporarily unavailable");

    const state = await verifyOAuthState(
      url.searchParams.get("state"),
      readOAuthStateCookie(request.headers.get("cookie")),
    );
    if (!state) throw new UnauthorizedError("Invalid OAuth state");

    const code = url.searchParams.get("code");
    if (!code) throw new UnauthorizedError("Invalid OAuth state");

    const redirectUri = absoluteUrl(CALLBACK_PATH);
    const user = await withScope(async ({ githubIdentity, accountService }) => {
      const accessToken = await githubIdentity.exchangeCode(code, redirectUri);
      const account = await accountService.findOrCreateFromGithub(accessToken);
      if (isMockAuthEnabled() && code === "mock-mentor") {
        await accountService.grantRole(account.id, "mentor");
        return { ...account, role: "mentor" as const };
      }
      return account;
    });
    const session = await issueSession(user);
    const response = redirect(state.returnTo ?? homeFor(session.session.role));
    response.headers.append("set-cookie", clearOAuthStateCookie());
    response.headers.append("set-cookie", session.cookie);
    return response;
  },
  { access: "public", navigation },
);
