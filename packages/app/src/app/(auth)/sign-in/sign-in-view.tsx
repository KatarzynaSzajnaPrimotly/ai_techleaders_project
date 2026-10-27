export type SignInError = "state" | "no-verified-email" | "unavailable";

const errorMessages: Record<SignInError, string> = {
  state: "We couldn't verify the GitHub sign-in. Please try again.",
  "no-verified-email": "GitHub didn't share a verified e-mail address. Verify an e-mail address on GitHub and try again.",
  unavailable: "We couldn't sign you in with GitHub. Please try again.",
};

export function getSignInErrorMessage(error: string | undefined): string | null {
  if (error === "state" || error === "no-verified-email" || error === "unavailable") return errorMessages[error];
  if (error === undefined) return null;
  return errorMessages.unavailable;
}

export function SignInView({
  cancelled = false,
  error,
  returnTo,
}: {
  cancelled?: boolean;
  error?: string;
  returnTo?: string;
}) {
  const githubHref = returnTo
    ? `/api/auth/github?returnTo=${encodeURIComponent(returnTo)}`
    : "/api/auth/github";
  const errorMessage = getSignInErrorMessage(error);

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-12">
      <section aria-labelledby="sign-in-title" className="w-full space-y-6 rounded-2xl border border-mentora-line bg-mentora-bg p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <p className="text-sm font-semibold text-mentora">DevMentor</p>
          <h1 className="m-0 text-2xl font-bold tracking-tight" id="sign-in-title">Sign in</h1>
          <p className="m-0 text-sm text-mentora-muted">Sign in to continue to DevMentor.</p>
        </div>
        {cancelled ? <p className="rounded-md border border-mentora-line p-3 text-sm" role="status">You cancelled the GitHub sign-in. No account was created.</p> : null}
        {errorMessage ? <p className="rounded-md border border-mentora-line p-3 text-sm" role="alert">{errorMessage}</p> : null}
        <a className="flex w-full items-center justify-center rounded-md bg-mentora px-4 py-3 text-sm font-semibold text-white no-underline hover:opacity-90" href={githubHref}>
          Sign in with GitHub
        </a>
        <div className="space-y-2 text-center">
          <p className="m-0 text-sm text-mentora-muted">Or use your e-mail</p>
          <p className="m-0 text-sm text-mentora-muted" role="note">E-mail sign-in isn&apos;t available yet. Use GitHub for now.</p>
        </div>
      </section>
    </main>
  );
}
