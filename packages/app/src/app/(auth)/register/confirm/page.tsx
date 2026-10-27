import { redirect } from "next/navigation";
import type { Session } from "@devmentor/core";
import { homeFor, publicPage } from "../../../../server/guards";
import { withScope } from "../../../../server/container";
import { ConfirmView } from "./confirm-view";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
function first(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }

export async function ConfirmPageContent({ searchParams, session }: { searchParams: SearchParams; session: Session | null }) {
  if (session) redirect(homeFor(session.role));
  const token = first((await searchParams).token);
  if (!token) return <ConfirmView state="invalid" />;
  const preview = await withScope(({ passwordAuthService }) => passwordAuthService.inspectRegistrationToken(token));
  if (!preview) return <ConfirmView state="invalid" />;
  if (preview.status === "used") return <ConfirmView state="used" email={preview.email} />;
  return <ConfirmView state="ready" token={token} email={preview.email} />;
}

export default publicPage(ConfirmPageContent, { withSession: true });
