import { apiHandler, clearSessionCookie, isInsecureHttpAllowed, ok } from "@devmentor/core";
import { resolveCurrentSession } from "../../../../server/current-session";

export const dynamic = "force-dynamic";

export const POST = apiHandler(
  async () => {
    const secure = process.env.NODE_ENV === "production" && !isInsecureHttpAllowed();
    const response = ok({ loggedOut: true });
    response.headers.append("set-cookie", clearSessionCookie(secure));
    return response;
  },
  { access: "public", resolveCurrentSession },
);
