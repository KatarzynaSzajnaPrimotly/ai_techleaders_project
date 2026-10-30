"use client";

import { loginSchema } from "@devmentor/core/validators";
import { PublicForm, apiCall } from "@devmentor/ui";

export type SignInError = "state" | "no-verified-email" | "unavailable" | "session-expired";

const errorMessages: Record<SignInError, string> = {
  state: "We couldn't verify the GitHub sign-in. Please try again.",
  "no-verified-email": "GitHub didn't share a verified e-mail address. Verify an e-mail address on GitHub and try again.",
  unavailable: "We couldn't sign you in with GitHub. Please try again.",
  "session-expired": "Your session expired. Sign in to continue.",
};

export function getSignInErrorMessage(error: string | undefined): string | null {
  if (error === "state" || error === "no-verified-email" || error === "unavailable" || error === "session-expired") return errorMessages[error];
  if (error === undefined) return null;
  return errorMessages.unavailable;
}

export function SignInView({
  cancelled = false,
  error,
  returnTo,
  mockAuth = false,
}: {
  cancelled?: boolean;
  error?: string;
  returnTo?: string;
  mockAuth?: boolean;
}) {
  const githubHref = (login?: string) => {
    const params = new URLSearchParams();
    if (login) params.set("login", login);
    if (returnTo) params.set("returnTo", returnTo);
    const query = params.toString();
    return query ? `/api/auth/github?${query}` : "/api/auth/github";
  };
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
        <a className="flex w-full items-center justify-center rounded-md bg-mentora px-4 py-3 text-sm font-semibold text-white no-underline hover:opacity-90" href={githubHref(mockAuth ? "mock-mentee" : undefined)}>
          {mockAuth ? "Sign in as mentee" : "Sign in with GitHub"}
        </a>
        {mockAuth ? (
          <div className="space-y-2 text-center">
            <p className="m-0 text-sm text-mentora-muted">Local role walkthrough</p>
            <p className="m-0 text-sm"><a href={githubHref("mock-mentor")}>Sign in as mentor</a></p>
            <p className="m-0 text-sm"><a href={githubHref("mock-operator")}>Sign in as operator</a></p>
            <p className="m-0 text-sm text-mentora-muted">E-mail sign-in is disabled in local mock mode.</p>
          </div>
        ) : (
          <div className="space-y-2 text-center">
            <p className="m-0 text-sm text-mentora-muted">Or use your e-mail</p>
            <PublicForm
              schema={loginSchema}
              fields={[{ name: "email", label: "E-mail", type: "email", autoComplete: "email" }, { name: "password", label: "Password", type: "password", autoComplete: "current-password" }]}
              submitLabel="Sign in with e-mail"
              onSubmit={(values) => apiCall<{ redirectTo: string }>("/api/auth/login", { method: "POST", body: { ...values, ...(returnTo ? { returnTo } : {}) }, onUnauthorized: "ignore" })}
              onSuccess={(data) => { const target = data as { redirectTo: string }; window.location.assign(target.redirectTo); }}
              onErrorMessage={(failure) => failure.status === 401 ? "Invalid credentials, or sign in with GitHub instead." : "We couldn't sign you in. Please try again."}
              formNote={<p className="m-0 text-sm text-mentora-muted">Forgot your password? Password reset isn&apos;t available yet — sign in with GitHub or contact the DevMentor team at <a href="mailto:support@devmentor.test">support@devmentor.test</a>.</p>}
            />
            <p className="m-0 text-sm text-mentora-muted">New to DevMentor? <a href={`/register${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`}>Create an account</a>.</p>
          </div>
        )}
      </section>
    </main>
  );
}
