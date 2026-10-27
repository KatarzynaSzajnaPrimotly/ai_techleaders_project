import { guardedPage } from "../../../server/guards";
import { MenteeHomeView } from "./home-view";

const MenteePage = guardedPage({ path: "/home", access: { roles: ["mentee"] } }, (_props: Record<string, never>, session) => (
  <MenteeHomeView session={session} />
));

export default MenteePage;
