import { useState } from "react";
import { z } from "zod";
import { Button } from "@devmentor/ui";
import { HOURLY_RETRY_MINUTES } from "../data";
import { submitConfirm } from "../flows";
import { Alert, AuthCard, PublicForm } from "../gaps";
import { latency, useStore } from "../store";

const MIN_PASSWORD_LENGTH = 12;
// bcrypt ignores everything past 72 bytes, so the form refuses longer passwords.
const MAX_PASSWORD_BYTES = 72;

// Mirrors confirm.schema from the spec (password only; the token travels in the link).
const confirmSchema = z.object({
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, `Use at least ${MIN_PASSWORD_LENGTH} characters.`)
    .refine((value) => new TextEncoder().encode(value).length <= MAX_PASSWORD_BYTES, `Use at most ${MAX_PASSWORD_BYTES} bytes.`),
});

type Failure = "failed" | null;

// s04: only the password form; opening the link changes nothing until the form is sent.
export function ConfirmPassword() {
  const token = useStore((state) => state.token);
  const accounts = useStore((state) => state.accounts);
  const link = useStore((state) => state.scenario.link);
  const limited = useStore((state) => state.limits.confirm);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<Failure>(null);

  // s04.5: the link was used already, or the address has an account now.
  const used = link === "used" || (token !== null && accounts.some((account) => account.email === token.email));
  // s04.4: expired, tampered or missing token all look the same (spec: a plain page asking to register again; G13).
  const invalid = !token || link === "expired" || link === "tampered" || link === "missing";

  if (used) {
    return (
      <AuthCard title="This link was already used" description="An account for this address already exists.">
        <Button asChild className="w-full">
          <a href="/sign-in" data-goto="s01">
            Sign in
          </a>
        </Button>
      </AuthCard>
    );
  }

  if (invalid || !token) {
    return (
      <AuthCard title="This link can't be used" description="It has expired or is not valid.">
        <p className="text-sm">Register again to get a new link.</p>
        <Button asChild className="w-full">
          <a href="/register" data-goto="s02">
            Register
          </a>
        </Button>
      </AuthCard>
    );
  }

  function submit(values: z.output<typeof confirmSchema>) {
    setBusy(true);
    setFailure(null);
    window.setTimeout(() => {
      setBusy(false);
      if (submitConfirm(values.password) === "failed") setFailure("failed");
    }, latency());
  }

  return (
    <AuthCard title="Set a password" description={`For ${token.email}`}>
      <PublicForm
        schema={confirmSchema}
        fields={[
          {
            name: "password",
            label: "Password",
            type: "password",
            autoComplete: "new-password",
            hint: `At least ${MIN_PASSWORD_LENGTH} characters.`,
          },
        ]}
        submitLabel="Create account"
        busyLabel="Creating…"
        busy={busy}
        locked={limited}
        onSubmit={submit}
        formError={
          <>
            {limited ? <Alert tone="error">Too many attempts. Try again in {HOURLY_RETRY_MINUTES} minutes.</Alert> : null}
            {failure === "failed" ? <Alert tone="error">Something went wrong. Please try again.</Alert> : null}
          </>
        }
      />
    </AuthCard>
  );
}
