import { apiHandler, mentorProfileUpdateSchema, parseWithSchema } from "@devmentor/core";
import { withScope } from "../../../../server/container";
import { resolveCurrentSession } from "../../../../server/current-session";
export const dynamic = "force-dynamic";
export const GET = apiHandler((_request, _context, session) => withScope(({ mentorService }) => mentorService.profile(session.userId)), { access: { roles: ["mentor"] }, resolveCurrentSession });
export const PUT = apiHandler(async (request, _context, session) => { const input = parseWithSchema(mentorProfileUpdateSchema, await request.json()); return withScope(({ mentorService }) => mentorService.updateProfile(session.userId, input)); }, { access: { roles: ["mentor"] }, resolveCurrentSession });
