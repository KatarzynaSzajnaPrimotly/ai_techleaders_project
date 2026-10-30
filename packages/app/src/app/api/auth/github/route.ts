import {
  absoluteUrl,
  apiHandler,
  createOAuthState,
  ForbiddenError,
  isMockAuthEnabled,
  ValidationError,
  type AppError,
} from "@devmentor/core";
import { withScope } from "../../../../server/container";

export const dynamic = "force-dynamic";

const CALLBACK_PATH = "/api/auth/github/callback";
const SIGN_IN_PATH = "/sign-in";
const REDIRECT_STATUS = 303;
const MOCK_LOGINS = new Set(["mock-mentee", "mock-mentor", "mock-operator"]);

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
    const url = new URL(request.url);
    const returnTo = url.searchParams.get("returnTo") ?? undefined;
    const state = await createOAuthState(returnTo);
    const redirectUri = absoluteUrl(CALLBACK_PATH);
    const mockLogin = url.searchParams.get("login");
    if (mockLogin !== null) {
      if (!isMockAuthEnabled()) throw new ForbiddenError("Local mock sign-in is disabled");
      if (!MOCK_LOGINS.has(mockLogin)) throw new ValidationError("Unknown local mock identity");
      const callbackParams = new URLSearchParams({ state: state.state, code: mockLogin });
      return redirectWithCookie(`${CALLBACK_PATH}?${callbackParams}`, state.cookie);
    }
    const authorizationUrl = await withScope(async ({ githubIdentity }) =>
      githubIdentity.createAuthorizationUrl(state.state, redirectUri),
    );
    return redirectWithCookie(authorizationUrl, state.cookie);
  },
  { access: "public", navigation: startNavigation },
);

