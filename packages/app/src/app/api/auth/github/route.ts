import {
  absoluteUrl,
  apiHandler,
  createOAuthState,
  ValidationError,
  type AppError,
} from "@devmentor/core";
import { withScope } from "../../../../server/container";

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

function startNavigation(error: AppError): Response {
  const query = error instanceof ValidationError ? "state" : "unavailable";
  return redirect(`${SIGN_IN_PATH}?error=${query}`);
}

export const GET = apiHandler(
  async (request) => {
    const returnTo = new URL(request.url).searchParams.get("returnTo") ?? undefined;
    const state = await createOAuthState(returnTo);
    const redirectUri = absoluteUrl(CALLBACK_PATH);
    const authorizationUrl = await withScope(async ({ githubIdentity }) =>
      githubIdentity.createAuthorizationUrl(state.state, redirectUri),
    );
    return redirectWithCookie(authorizationUrl, state.cookie);
  },
  { access: "public", navigation: startNavigation },
);
