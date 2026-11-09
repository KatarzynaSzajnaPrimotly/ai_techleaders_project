"use client";

import { useState } from "react";
import { registerSchema } from "@devmentor/core/validators";
import { apiCall, PublicForm } from "@devmentor/ui";

export function RegisterView({ returnTo }: { returnTo?: string }) {
  const [sent, setSent] = useState(false);
  return <main className="mx-auto flex min-h-screen max-w-md items-center px-6 py-12"><section className="w-full space-y-6 rounded-2xl border border-mentora-line bg-mentora-bg p-8 shadow-sm" aria-labelledby="register-title">
    <header className="space-y-2 text-center"><p className="text-sm font-semibold text-mentora">DevMentor</p><h1 id="register-title" className="m-0 text-2xl font-bold">Create your account</h1></header>
    {sent ? <div role="status" className="space-y-4"><p>Check your e-mail for next steps.</p><button className="text-sm underline" type="button" onClick={() => setSent(false)}>Didn&apos;t get it? Register again.</button></div> : <PublicForm
      schema={registerSchema}
      fields={[{ name: "displayName", label: "Name", autoComplete: "name" }, { name: "email", label: "E-mail", type: "email", autoComplete: "email" }]}
      submitLabel="Continue"
      onSubmit={(values) => apiCall("/api/auth/register", { method: "POST", body: { ...values, ...(returnTo ? { returnTo } : {}) }, onUnauthorized: "ignore" })}
      onSuccess={() => setSent(true)}
      onErrorMessage={(failure) => failure.status === 503 ? "We couldn't send the e-mail. Please try again later." : "We couldn't start registration. Please try again."}
    />}
    <p className="m-0 text-sm text-mentora-muted"><a href={`/sign-in${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`}>Back to sign in</a></p>
  </section></main>;
}
