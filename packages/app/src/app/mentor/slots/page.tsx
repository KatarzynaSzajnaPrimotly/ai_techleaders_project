import { guardedPage } from "../../../server/guards";
import { AvailabilitySlotManager } from "./availability-slot-manager";

export const dynamic = "force-dynamic";

const MentorSlotsPage = guardedPage<Record<string, never>>({ path: "/mentor/slots", access: { roles: ["mentor"] } }, async () => <AvailabilitySlotManager />);

export default MentorSlotsPage;
