"use client";

import { useState } from "react";
import { z } from "zod";
import { confirmSchema } from "@devmentor/core/validators";
import { apiCall, PublicForm } from "@devmentor/ui";

const passwordOnlySchema = confirmSchema.omit({ token: true });
type ConfirmState = "ready" | "used" | "invalid";

export function ConfirmView({ state: initialState, token, email }: { state: ConfirmState; token?: string; email?: string }) {
  const [state, setState] = useState(initialState);
  const completedSchema = passwordOnlySchema as z.ZodType<{ password: string }>;
  return <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-12"><section className="w-full space-y-6 rounded-2xl border border-mentora-line bg-mentora-bg p-8 shadow-sm" aria-labelledby="confirm-title">
    <header className="space-y-2 text-center"><p className="text-sm font-semibold text-mentora">DevMentor</p><h1 id="confirm-title" className="m-0 text-2xl font-bold">Set your password</h1></header>
    {state === "invalid" ? <div role="alert" className="space-y-3"><p>This registration link is invalid or expired. Please register again.</p><a href="/register">Register again</a></div> : null}
    {state === "used" ? <div role="status" className="space-y-3"><p>This registration link has already been used. Please sign in.</p><a href="/sign-in">Sign in</a></div> : null}
    {state === "ready" && token ? <><p className="text-sm text-mentora-muted">Confirming account for <strong>{email}</strong>.</p><PublicForm
      schema={completedSchema}
      fields={[{ name: "password", label: "Password", type: "password", autoComplete: "new-password", hint: "Use at least 12 characters." }]}
      submitLabel="Create account"
      onSubmit={(values) => apiCall<{ redirectTo: string }>("/api/auth/register/confirm", { method: "POST", body: { ...values, token }, onUnauthorized: "ignore" })}
      onSuccess={(data) => { window.location.assign((data as { redirectTo: string }).redirectTo); }}
      onErrorMessage={(failure) => {
        if (failure.status === 401 && failure.error.message.includes("already been used")) { setState("used"); return "This registration link has already been used. Please sign in."; }
        if (failure.status === 401) { setState("invalid"); return "This registration link is invalid or expired. Please register again."; }
        return "We couldn't create your account. Please try again.";
      }}
    /></> : null}
  </section></main>;
}
