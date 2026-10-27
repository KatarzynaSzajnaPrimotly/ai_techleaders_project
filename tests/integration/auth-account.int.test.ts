import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, inject, it } from "vitest";
import { AccountService, createGithubIdentityAdapter, type GithubConfig } from "@devmentor/core";
import { createOrm, createUserRepository } from "@devmentor/db";
import { runConcurrently } from "./helpers/concurrency";

const databaseUrl = inject("databaseUrl");
const fakeServerUrl = inject("fakeServerUrl");
const unique = randomUUID().replaceAll("-", "");
const githubId = Number.parseInt(unique.slice(0, 12), 16);
const email = `github-${unique}@example.test`;
const ormPromise = createOrm({ url: databaseUrl, pool: { min: 1, max: 3 } });

const githubConfig: GithubConfig = {
  clientId: "integration-client",
  clientSecret: "integration-secret",
  oauthBaseUrl: fakeServerUrl,
  apiBaseUrl: fakeServerUrl,
};
const githubIdentity = createGithubIdentityAdapter({ config: githubConfig });

async function resetFakeIdentity(): Promise<void> {
  await fetch(`${fakeServerUrl}/__control/reset`, { method: "POST" });
}

beforeAll(async () => {
  const response = await fetch(`${fakeServerUrl}/__control/github/identity`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      user: {
        id: githubId,
        login: `github-${unique}`,
        name: "Ada Lovelace",
        avatar_url: "https://example.test/avatar.png",
      },
      emails: [{ email, primary: true, verified: true, visibility: "private" }],
    }),
  });
  if (!response.ok) throw new Error("Failed to configure the integration GitHub identity");
});

afterAll(async () => {
  await resetFakeIdentity();
  const orm = await ormPromise;
  await orm.close(true);
});

describe("AccountService first GitHub sign-in", () => {
  it("returns the unique winning account for concurrent callbacks", async () => {
    const identities = await runConcurrently(2, async () => {
      const orm = await ormPromise;
      const service = new AccountService({
        userRepository: createUserRepository(orm.em.fork()),
        githubIdentity,
      });
      return service.findOrCreateFromGithub("devmentor-fake-github-access-token");
    });

    expect(identities[0]?.id).toBeTruthy();
    expect(identities[1]?.id).toBe(identities[0]?.id);
    expect(identities[0]).toMatchObject({
      email,
      githubId: String(githubId),
      githubLogin: `github-${unique}`,
      role: "mentee",
    });

    const orm = await ormPromise;
    const repository = createUserRepository(orm.em.fork());
    await expect(repository.findByGithubId(String(githubId))).resolves.toMatchObject({
      id: identities[0]?.id,
      email,
    });
  });
});
