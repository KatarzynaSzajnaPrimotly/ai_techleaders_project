import { redirect } from "next/navigation";
import { isMockAuthEnabled, type Session } from "@devmentor/core";
import { homeFor, publicPage } from "../../../server/guards";
import { getSignInErrorMessage, SignInView, type SignInError } from "./sign-in-view";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function asSignInError(value: string | undefined): SignInError | undefined {
  if (value === "state" || value === "no-verified-email" || value === "unavailable" || value === "session-expired") return value;
  if (value !== undefined) return "unavailable";
  return undefined;
}

export async function SignInPageContent({
  searchParams,
  session,
}: {
  searchParams: SearchParams;
  session: Session | null;
}) {
  if (session) redirect(homeFor(session.role));
  const params = await searchParams;
  const cancelled = firstValue(params.cancelled) === "1";
  const error = asSignInError(firstValue(params.error));
  const returnTo = firstValue(params.returnTo);
  return <SignInView cancelled={cancelled} error={error} returnTo={returnTo} mockAuth={isMockAuthEnabled()} />;
}

export default publicPage(SignInPageContent, { withSession: true });

export { getSignInErrorMessage };
