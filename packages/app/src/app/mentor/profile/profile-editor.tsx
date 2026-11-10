"use client";

import { useEffect, useState } from "react";
import { MENTOR_STACK_TAGS, type MentorProfileOwnerDto } from "@devmentor/core";
import { mentorProfileUpdateSchema } from "@devmentor/core/validators";
import { apiCall, CrudForm } from "@devmentor/ui";

export function MentorProfileEditor({ initial }: { initial: MentorProfileOwnerDto }) {
  const [profile, setProfile] = useState(initial);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (profile.slug && typeof window !== "undefined") {
      setShareUrl(new URL(`/m/${profile.slug}`, window.location.origin).toString());
    }
  }, [profile.slug]);

  async function save(values: { publicWorkUrl?: string; bio?: string; stackTags?: string[]; sessionChannel?: string }) {
    setFieldErrors({});
    setFormError(null);
    return apiCall<MentorProfileOwnerDto>("/api/mentors/me", { method: "PUT", body: values });
  }

  function saved(data: unknown) {
    setProfile(data as MentorProfileOwnerDto);
    setFieldErrors({});
    setFormError(null);
  }

  async function transition(path: string) {
    setPending(true);
    setFieldErrors({});
    setFormError(null);
    const result = await apiCall<MentorProfileOwnerDto>(path, { method: "POST", body: {} });
    setPending(false);
    if (result.ok) saved(result.data);
    else {
      setFieldErrors(result.error.fieldErrors ?? {});
      setFormError(result.error.message);
    }
  }

  async function copyLink() {
    if (!shareUrl) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement("textarea");
        input.value = shareUrl;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.append(input);
        input.select();
        const copied = document.execCommand("copy");
        input.remove();
        if (!copied) throw new Error("Clipboard is unavailable");
      }
      setCopyMessage("Link copied");
    } catch {
      setCopyMessage("Copy failed. Select and copy the link above.");
    }
  }

  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-8 sm:px-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Your mentor page</h1>
        <p className="text-sm text-muted-foreground">Share your work and describe what you can help with. Your session channel stays private.</p>
      </header>
      <CrudForm
        schema={mentorProfileUpdateSchema}
        fields={[
          { name: "publicWorkUrl", label: "Link to your public work", type: "text", placeholder: "https://…", initialValue: profile.publicWorkUrl ?? "" },
          { name: "bio", label: "About your work", type: "textarea", maxLength: 2000, initialValue: profile.bio ?? "" },
          { name: "stackTags", label: "Areas of expertise", type: "multiselect", options: MENTOR_STACK_TAGS.map((tag) => ({ label: tag, value: tag })), initialValue: profile.stackTags },
          { name: "sessionChannel", label: "Session channel", type: "text", placeholder: "For example, Google Meet", maxLength: 300, initialValue: profile.sessionChannel ?? "" },
        ]}
        onSubmit={save}
        onSuccess={saved}
        submitLabel="Save draft"
        resetOnSuccess={false}
        serverFieldErrors={fieldErrors}
      />
      {formError ? <p role="alert" className="text-sm text-destructive">{formError}</p> : null}

      <section aria-labelledby="readiness-heading" className="space-y-2">
        <h2 id="readiness-heading" className="text-lg font-medium">Page readiness</h2>
        <ul className="list-inside list-disc space-y-1 text-sm">
          <li>{profile.readiness.publicWorkUrl ? "Public work link added" : "Add a public work link"}</li>
          <li>{profile.readiness.bio ? "Description added" : "Add a description"}</li>
          <li>{profile.readiness.sessionChannel ? "Session channel added" : "Add a session channel before publishing availability"}</li>
        </ul>
      </section>

      {profile.publishedAt && profile.slug ? (
        <section aria-labelledby="share-heading" className="space-y-3 rounded-lg border p-4">
          <h2 id="share-heading" className="text-lg font-medium">Your share link</h2>
          <a href={`/m/${profile.slug}`} className="block break-all text-sm underline">{shareUrl || `/m/${profile.slug}`}</a>
          <p className="text-sm text-muted-foreground">This link stays the same if you rename yourself.</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded-md border px-3 py-2 text-sm" onClick={copyLink}>Copy link</button>
            <button type="button" className="rounded-md border px-3 py-2 text-sm" disabled={pending} onClick={() => void transition("/api/mentors/me/unpublish")}>Unpublish page</button>
          </div>
          {copyMessage ? <p role="status" className="text-sm">{copyMessage}</p> : null}
        </section>
      ) : (
        <button type="button" className="rounded-md bg-primary px-4 py-2 text-primary-foreground" disabled={pending} onClick={() => void transition("/api/mentors/me/publish")}>Publish page</button>
      )}
    </main>
  );
}
