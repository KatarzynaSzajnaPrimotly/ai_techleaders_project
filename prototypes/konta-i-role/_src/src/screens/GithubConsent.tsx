import { useState } from "react";
import { Button } from "@devmentor/ui";
import { GITHUB_PROFILES } from "../data";
import { authorizeGithub, cancelGithub } from "../flows";
import { Alert, AuthCard, GithubIcon } from "../gaps";
import { landAfterSignIn, visit } from "../store";

// s09: a stand-in for GitHub's consent page. It is not a DevMentor screen (mapa-ekranow.md, s09).
// A failed outcome returns to s01 with a plain message; success lands on the role's home (or returnTo).
export function GithubConsent() {
  const [login, setLogin] = useState(GITHUB_PROFILES[0].login);

  function authorize() {
    const profile = GITHUB_PROFILES.find((candidate) => candidate.login === login) ?? GITHUB_PROFILES[0];
    if (authorizeGithub(profile) === "signedIn") landAfterSignIn();
    else visit("s01");
  }

  function cancel() {
    cancelGithub();
    visit("s01");
  }

  return (
    <AuthCard title="Authorize DevMentor" description="Choose the demo GitHub profile to sign in with.">
      <Alert tone="info">
        Simulation of an external page. This is not GitHub: the prototype connects to nothing and sends nothing.
      </Alert>
      <fieldset className="space-y-2">
        <legend className="mb-1 flex items-center gap-2 text-sm font-medium">
          <GithubIcon />
          Demo profile
        </legend>
        {GITHUB_PROFILES.map((profile) => (
          <label key={profile.login} className="flex cursor-pointer items-start gap-2 rounded-md border border-border p-2 text-sm">
            <input type="radio" name="github-profile" value={profile.login} checked={login === profile.login} onChange={() => setLogin(profile.login)} className="mt-1" />
            <span>
              <span className="block font-medium">{profile.login}</span>
              <span className="block text-xs text-muted-foreground">{profile.label}</span>
            </span>
          </label>
        ))}
      </fieldset>
      <div className="flex gap-2">
        <Button onClick={authorize} className="flex-1">
          Authorize DevMentor
        </Button>
        <Button variant="outline" onClick={cancel}>
          Cancel
        </Button>
      </div>
    </AuthCard>
  );
}
