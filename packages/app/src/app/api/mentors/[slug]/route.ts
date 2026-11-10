import { apiHandler } from "@devmentor/core";
import { withScope } from "../../../../server/container";
export const dynamic = "force-dynamic";
export const GET = apiHandler((_request, context: { params: Promise<{ slug: string }> }) => withScope(async ({ mentorService }) => mentorService.publicProfile((await context.params).slug)), { access: "public" });
