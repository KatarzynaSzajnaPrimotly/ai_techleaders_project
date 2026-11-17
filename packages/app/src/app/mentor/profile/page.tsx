import { withScope } from "../../../server/container";
import { MentorProfileEditor } from "./profile-editor";
import { guardedPage } from "../../../server/guards";
export const dynamic = "force-dynamic";
const MentorProfilePage = guardedPage<Record<string, never>>({ path: "/mentor/profile", access: { roles: ["mentor"] } }, async (_props, session) => {
 const profile = await withScope(({ mentorService }) => mentorService.profile(session.userId));
 return <MentorProfileEditor initial={profile} />;
});
export default MentorProfilePage;
