import { apiHandler } from "@devmentor/core";
import { withScope } from "../../../../server/container";
export const dynamic = "force-dynamic";
export const GET = apiHandler((_request, context: { params: Promise<{ slug: string }> }) => withScope(async ({ mentorService, availabilityService }) => {
  const slug = (await context.params).slug;
  const [profile, slots] = await Promise.all([mentorService.publicProfile(slug), availabilityService.publicSlots(slug)]);
  return { ...profile, slots };
}), { access: "public" });
