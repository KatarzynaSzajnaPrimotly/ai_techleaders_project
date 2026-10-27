import { guardedPage } from "../../../server/guards";
import { MentorHomeView } from "./mentor-view";

const MentorPage = guardedPage({ path: "/mentor", access: { roles: ["mentor"] } }, (_props: Record<string, never>, session) => (
  <MentorHomeView session={session} />
));

export default MentorPage;
