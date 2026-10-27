import { redirect } from "next/navigation";
import type { Session } from "@devmentor/core";
import { homeFor, publicPage } from "../../../server/guards";
import { RegisterView } from "./register-view";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
function first(value: string | string[] | undefined): string | undefined { return Array.isArray(value) ? value[0] : value; }

export async function RegisterPageContent({ searchParams, session }: { searchParams: SearchParams; session: Session | null }) {
  if (session) redirect(homeFor(session.role));
  const params = await searchParams;
  return <RegisterView returnTo={first(params.returnTo)} />;
}

export default publicPage(RegisterPageContent, { withSession: true });
