import { ValidationError } from "../../../http/errors";
import type { GithubEmail, GithubIdentityPort, GithubUser } from "../github-identity.port";

const MOCK_IDENTITIES = {
  mentee: { id: "devmentor-mock-mentee", login: "mock-mentee", name: "Mock Mentee", email: "mock-mentee@devmentor.test" },
  mentor: { id: "devmentor-mock-mentor", login: "mock-mentor", name: "Mock Mentor", email: "mock-mentor@devmentor.test" },
  operator: { id: "devmentor-mock-operator", login: "mock-operator", name: "Mock Operator", email: "mock-operator@devmentor.test" },
} as const;

export type MockGithubLogin = keyof typeof MOCK_IDENTITIES;

function identityFor(accessToken: string) {
  const identity = Object.values(MOCK_IDENTITIES).find((candidate) => candidate.login === accessToken);
  if (!identity) throw new ValidationError("Unknown local mock identity");
  return identity;
}

export function createMockGithubIdentityAdapter(): GithubIdentityPort {
  return {
    createAuthorizationUrl(state, redirectUri) {
      if (!state || !redirectUri) throw new ValidationError("GitHub OAuth state and redirect URI are required");
      const url = new URL(redirectUri);
      url.searchParams.set("state", state);
      url.searchParams.set("code", "mock-mentee");
      return url.toString();
    },

    async exchangeCode(code, redirectUri) {
      if (!code || !redirectUri) throw new ValidationError("GitHub authorization code and redirect URI are required");
      identityFor(code);
      return code;
    },

    async getUser(accessToken): Promise<GithubUser> {
      const identity = identityFor(accessToken);
      return { id: identity.id, login: identity.login, name: identity.name, avatarUrl: null };
    },

    async getEmails(accessToken): Promise<GithubEmail[]> {
      const identity = identityFor(accessToken);
      return [{ email: identity.email, primary: true, verified: true, visibility: "private" }];
    },
  };
}
