import { apiHandler } from "@devmentor/core";
import { withScope } from "../../../../../server/container";
import { resolveCurrentSession } from "../../../../../server/current-session";
export const dynamic = "force-dynamic";
export const POST = apiHandler((_request, _context, session) => withScope(({ mentorService }) => mentorService.unpublishProfile(session.userId)), { access: { roles: ["mentor"] }, resolveCurrentSession });
