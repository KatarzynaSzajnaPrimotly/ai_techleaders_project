import { notFound } from "next/navigation";
import { withScope } from "../../../server/container";
import { MentorPageView } from "@devmentor/ui";
export const dynamic = "force-dynamic";
export default async function PublicMentorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try { const profile = await withScope(({ mentorService }) => mentorService.publicProfile(slug)); return <MentorPageView profile={profile} />; }
  catch { notFound(); }
}
