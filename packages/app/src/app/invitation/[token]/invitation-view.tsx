"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiCall } from "@devmentor/ui";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, ErrorMessage, LocalTime } from "@devmentor/ui";

interface InvitationViewProps {
  token: string;
  invitation: { email: string; stackTags: string[]; expiresAt: Date } | null;
  account: { email: string; displayName: string | null; verified: boolean } | null;
}

export function InvitationView({ token, invitation, account }: InvitationViewProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const returnTo = `/invitation/${encodeURIComponent(token)}`;

  async function acceptInvitation() {
    setError(null);
    setBusy(true);
    const result = await apiCall<{ redirectTo: string }>(`/api/invitations/${encodeURIComponent(token)}/accept`, { method: "POST" });
    setBusy(false);
    if (!result.ok) {
      setError(result.error.message);
      return;
    }
    router.push(result.data.redirectTo);
    router.refresh();
  }

  async function signOutAndSwitch() {
    setError(null);
    setBusy(true);
    const result = await apiCall("/api/auth/logout", { method: "POST", onUnauthorized: "ignore" });
    setBusy(false);
    if (!result.ok) {
      setError(result.error.message);
      return;
    }
    router.push(`/sign-in?returnTo=${encodeURIComponent(returnTo)}`);
    router.refresh();
  }

  if (!invitation) {
    return <main className="mx-auto w-full max-w-xl px-4 py-12"><p role="status">This invitation is not valid.</p></main>;
  }

  const matches = Boolean(account?.verified && account.email.trim().toLowerCase() === invitation.email.trim().toLowerCase());
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Mentor invitation</CardTitle>
          <CardDescription>You have been invited to join the DevMentor mentor community.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="m-0">Invitation for <strong>{invitation.email}</strong></p>
          {invitation.stackTags.length ? (
            <div className="flex flex-wrap gap-2" aria-label="Invitation skills">
              {invitation.stackTags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}
            </div>
          ) : null}
          <p className="m-0 text-sm text-muted-foreground">Expires <LocalTime value={invitation.expiresAt} /></p>
          {error ? <ErrorMessage message={error} /> : null}
          {!account ? (
            <div className="flex flex-col gap-3">
              <Button asChild><a href={`/sign-in?returnTo=${encodeURIComponent(returnTo)}`}>Sign in with GitHub</a></Button>
              <a className="text-sm underline" href={`/sign-in?returnTo=${encodeURIComponent(returnTo)}`}>Sign in with e-mail</a>
            </div>
          ) : matches ? (
            <div className="space-y-3">
              <p className="m-0">This will grant the mentor role to {account.displayName?.trim() || account.email}.</p>
              <Button type="button" disabled={busy} onClick={acceptInvitation}>{busy ? "Accepting…" : "Accept invitation"}</Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="m-0">You are signed in as <strong>{account.email}</strong>, but this invitation is for <strong>{invitation.email}</strong>. Sign out and sign in with the invited, verified e-mail address.</p>
              <Button type="button" variant="outline" disabled={busy} onClick={signOutAndSwitch}>{busy ? "Signing out…" : "Sign out and switch account"}</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
