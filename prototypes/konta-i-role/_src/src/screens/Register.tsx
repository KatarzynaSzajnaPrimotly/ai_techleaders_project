import { useState } from "react";
import { z } from "zod";
import { HOURLY_RETRY_MINUTES } from "../data";
import { submitRegistration } from "../flows";
import { Alert, AuthCard, PublicForm } from "../gaps";
import { latency, useStore, visit } from "../store";

const MAX_DISPLAY_NAME = 80;
// No control characters, newlines or URLs: the name is rendered in a mail another person receives.
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/;
const URL_LIKE = /https?:\/\/|www\./i;

// Mirrors register.schema from the spec (not built yet).
const registerSchema = z.object({
  email: z.email("Enter a valid e-mail address."),
  displayName: z
    .string()
    .trim()
    .min(1, "Enter a display name.")
    .max(MAX_DISPLAY_NAME, `Use at most ${MAX_DISPLAY_NAME} characters.`)
    .refine((value) => !CONTROL_CHARACTERS.test(value), "Remove control characters and line breaks.")
    .refine((value) => !URL_LIKE.test(value), "Remove the link from the display name."),
});

type Failure = "failed" | null;

// s02: e-mail and display name, then "check your e-mail" (s03). The answer never reveals whether the address has an account (37-K6).
export function Register() {
  const draft = useStore((state) => state.draft);
  const limited = useStore((state) => state.limits.register);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<Failure>(null);

  function submit(values: z.output<typeof registerSchema>) {
    setBusy(true);
    setFailure(null);
    window.setTimeout(() => {
      setBusy(false);
      const outcome = submitRegistration(values.email, values.displayName);
      if (outcome === "sent") visit("s03");
      if (outcome === "failed") setFailure("failed");
    }, latency());
  }

  return (
    <AuthCard title="DevMentor" description="Register for DevMentor.">
      <PublicForm
        schema={registerSchema}
        fields={[
          { name: "email", label: "E-mail", type: "email", autoComplete: "email" },
          { name: "displayName", label: "Display name", autoComplete: "name" },
        ]}
        initial={{ ...draft }}
        submitLabel="Register"
        busyLabel="Sending…"
        busy={busy}
        locked={limited}
        onSubmit={submit}
        formError={
          <>
            {limited ? <Alert tone="error">Too many attempts. Try again in {HOURLY_RETRY_MINUTES} minutes.</Alert> : null}
            {failure === "failed" ? <Alert tone="error">We couldn&apos;t send the e-mail. Please try again.</Alert> : null}
          </>
        }
      />
      <p className="text-center text-sm text-muted-foreground">
        Already registered?{" "}
        <a href="/sign-in" data-goto="s01" className="text-foreground underline underline-offset-4">
          Sign in
        </a>
      </p>
    </AuthCard>
  );
}
