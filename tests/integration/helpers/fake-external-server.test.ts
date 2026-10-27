import { afterEach, describe, expect, it } from "vitest";
import { startFakeExternalServer, type FakeGithubIdentity, type FakeExternalServer } from "./fake-external-server";

const identity: FakeGithubIdentity = {
  user: { id: 12_345, login: "ada", name: "Ada Lovelace", avatar_url: "https://example.test/ada.png" },
  emails: [{ email: "ada@example.test", primary: true, verified: true, visibility: "private" }],
};
const MAX_BODY_BYTES_FOR_FAKE_SERVER = 1_048_576;

let server: FakeExternalServer | undefined;

afterEach(async () => {
  await server?.close();
  server = undefined;
});

async function start(): Promise<string> {
  server = await startFakeExternalServer();
  return server.url;
}

describe("fake external server", () => {
  it("requires an identity, then serves configured OAuth and GitHub API responses", async () => {
    const url = await start();
    const unavailable = await fetch(`${url}/user`);
    expect(unavailable.status).toBe(503);

    const configured = await fetch(`${url}/__control/github/identity`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(identity),
    });
    expect(configured.status).toBe(200);

    const tokenResponse = await fetch(`${url}/login/oauth/access_token`, { method: "POST" });
    expect(tokenResponse.status).toBe(200);
    const token = (await tokenResponse.json() as { access_token: string }).access_token;
    expect(token).toBeTruthy();

    const headers = { authorization: `Bearer ${token}` };
    expect(await (await fetch(`${url}/user`, { headers })).json()).toEqual(identity.user);
    expect(await (await fetch(`${url}/user/emails`, { headers })).json()).toEqual(identity.emails);
  });

  it("rejects invalid identities and malformed JSON", async () => {
    const url = await start();
    const invalidIdentity = await fetch(`${url}/__control/github/identity`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ user: { login: "missing required values" }, emails: [] }),
    });
    expect(invalidIdentity.status).toBe(400);

    const malformed = await fetch(`${url}/__control/github/identity`, {
      method: "POST",
      body: "{",
    });
    expect(malformed.status).toBe(400);
  });

  it("rejects missing bearer credentials, returns 404 for unknown authenticated paths, and resets state", async () => {
    const url = await start();
    await fetch(`${url}/__control/github/identity`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(identity),
    });
    expect((await fetch(`${url}/user`)).status).toBe(401);
    expect((await fetch(`${url}/not-found`, { headers: { authorization: "Bearer devmentor-fake-github-access-token" } })).status).toBe(404);
    await fetch(`${url}/__control/reset`, { method: "POST" });
    expect((await fetch(`${url}/user`)).status).toBe(503);
  });

  it("rejects request bodies that exceed its safety limit", async () => {
    const url = await start();
    const tooLarge = await fetch(`${url}/__control/github/identity`, {
      method: "POST",
      body: "x".repeat(MAX_BODY_BYTES_FOR_FAKE_SERVER + 1),
    });
    expect(tooLarge.status).toBe(413);
  });
});
