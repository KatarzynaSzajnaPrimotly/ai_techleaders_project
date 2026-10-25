import { useState } from "react";
import { z } from "zod";
import { Button } from "@devmentor/ui";
import { LOGIN_RETRY_MINUTES, SUPPORT_ADDRESS } from "../data";
import { submitLogin } from "../flows";
import { Alert, AuthCard, GithubIcon, PublicForm } from "../gaps";
import { latency, update, useStore, type SignInNotice } from "../store";

// Mirrors login.schema from the spec (core/src/validators/auth/login.schema.ts, not built yet).
const loginSchema = z.object({
  email: z.email("Enter a valid e-mail address."),
  password: z.string().min(1, "Enter your password."),
});

// One plain message per way the GitHub sign-in can end (36-K3, K6, K7; G14; G07). Wording of K6 and K7 is a placeholder.
const NOTICES: Record<Exclude<SignInNotice, null>, string> = {
  cancelled: "You cancelled the GitHub sign-in. No account was created.",
  state: "We couldn't verify the GitHub sign-in. Please try again.",
  noEmail:
    "GitHub didn't share a verified e-mail address, so no account was created. Verify an e-mail address on GitHub and try again, or register with e-mail.",
  unavailable: "We couldn't sign you in with GitHub. Try again or use your e-mail.",
  sessionExpired: "Your session expired. Sign in to continue.",
};

type Failure = "invalid" | "failed" | null;

// s01: GitHub first, the e-mail form second (D07, 36-K5).
export function SignIn() {
  const notice = useStore((state) => state.notice);
  const limited = useStore((state) => state.limits.login);
  const s01b = useStore((state) => state.scenario.s01b);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<Failure>(null);

  function submit(values: z.output<typeof loginSchema>) {
    setBusy(true);
    setFailure(null);
    window.setTimeout(() => {
      setBusy(false);
      const outcome = submitLogin(values.email, values.password);
      if (outcome === "invalid" || outcome === "failed") setFailure(outcome);
    }, latency());
  }

  return (
    <AuthCard title="DevMentor" description="Sign in to DevMentor.">
      {notice ? <Alert tone={notice === "sessionExpired" ? "info" : "error"}>{NOTICES[notice]}</Alert> : null}
      <Button asChild className="w-full">
        <a href="/api/auth/github" data-goto="s09" onClick={() => update({ notice: null })}>
          <GithubIcon />
          Sign in with GitHub
        </a>
      </Button>
      <p className="text-center text-xs text-muted-foreground">or use your e-mail</p>
      {s01b ? (
        <Alert tone="info">E-mail sign-in isn&apos;t available yet. Use GitHub.</Alert>
      ) : (
        <>
          <PublicForm
            schema={loginSchema}
            fields={[
              { name: "email", label: "E-mail", type: "email", autoComplete: "username" },
              { name: "password", label: "Password", type: "password", autoComplete: "current-password" },
            ]}
            submitLabel="Sign in"
            busyLabel="Signing in…"
            busy={busy}
            locked={limited}
            onSubmit={submit}
            formError={
              <>
                {limited ? (
                  <Alert tone="error">Too many attempts. Try again in {LOGIN_RETRY_MINUTES} minutes.</Alert>
                ) : null}
                {failure === "invalid" ? (
                  <>
                    <Alert tone="error">Invalid credentials, or sign in with GitHub instead.</Alert>
                    <p className="text-xs text-muted-foreground">
                      Forgot your password? Password reset isn&apos;t available yet. Sign in with GitHub or contact the DevMentor team at {SUPPORT_ADDRESS}.
                    </p>
                  </>
                ) : null}
                {failure === "failed" ? <Alert tone="error">Something went wrong. Please try again.</Alert> : null}
              </>
            }
          />
          <p className="text-center text-sm text-muted-foreground">
            No account yet?{" "}
            <a href="/register" data-goto="s02" className="text-foreground underline underline-offset-4">
              Register
            </a>
          </p>
        </>
      )}
    </AuthCard>
  );
}

