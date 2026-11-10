import { notFound } from "next/navigation";
import { withScope } from "../../../server/container";
import { MentorPageView } from "@devmentor/ui";
import { NotFoundError } from "@devmentor/core";
import type { MentorProfilePublicDto, PublicMentorSlotDto } from "@devmentor/core";
export const dynamic = "force-dynamic";
export default async function PublicMentorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let profile: MentorProfilePublicDto;
  let slots: PublicMentorSlotDto[];
  try {
    ({ profile, slots } = await withScope(async ({ mentorService, availabilityService }) => {
      const [mentorProfile, publicSlots] = await Promise.all([
        mentorService.publicProfile(slug),
        availabilityService.publicSlots(slug),
      ]);
      return { profile: mentorProfile, slots: publicSlots };
    }));
  } catch (error) {
    if (error instanceof NotFoundError) notFound();
    throw error;
  }
  return <MentorPageView profile={profile} slots={slots} />;
}
