import { describe, expect, it } from "vitest";
import { ValidationError } from "../../../http/errors";
import { createMockGithubIdentityAdapter } from "./mock-github-identity.adapter";

describe("createMockGithubIdentityAdapter", () => {
  it("builds a local callback URL with signed-state input and the default mentee code", () => {
    const adapter = createMockGithubIdentityAdapter();
    expect(adapter.createAuthorizationUrl("signed-state", "http://localhost:3000/api/auth/github/callback"))
      .toBe("http://localhost:3000/api/auth/github/callback?state=signed-state&code=mock-mentee");
  });

  it("rejects missing OAuth URL inputs", () => {
    const adapter = createMockGithubIdentityAdapter();
    expect(() => adapter.createAuthorizationUrl("", "http://localhost/callback")).toThrow(ValidationError);
    expect(() => adapter.createAuthorizationUrl("state", "")).toThrow(ValidationError);
  });

  it.each([
    ["mock-mentee", "devmentor-mock-mentee", "mock-mentee@devmentor.test"],
    ["mock-mentor", "devmentor-mock-mentor", "mock-mentor@devmentor.test"],
    ["mock-operator", "devmentor-mock-operator", "mock-operator@devmentor.test"],
  ])("resolves the deterministic %s identity and verified primary email", async (login, id, email) => {
    const adapter = createMockGithubIdentityAdapter();
    await expect(adapter.exchangeCode(login, "http://localhost/callback")).resolves.toBe(login);
    const role = login.slice("mock-".length);
    await expect(adapter.getUser(login)).resolves.toMatchObject({ id, login, name: `Mock ${role[0].toUpperCase()}${role.slice(1)}` });
    await expect(adapter.getEmails(login)).resolves.toEqual([{ email, primary: true, verified: true, visibility: "private" }]);
  });

  it("rejects missing OAuth exchange inputs and unknown identities", async () => {
    const adapter = createMockGithubIdentityAdapter();
    await expect(adapter.exchangeCode("", "http://localhost/callback")).rejects.toThrow(ValidationError);
    await expect(adapter.exchangeCode("mock-mentee", "")).rejects.toThrow(ValidationError);
    await expect(adapter.exchangeCode("mock-unknown", "http://localhost/callback")).rejects.toThrow(ValidationError);
    await expect(adapter.exchangeCode("unknown", "http://localhost/callback")).rejects.toThrow(ValidationError);
    await expect(adapter.getUser("")).rejects.toThrow(ValidationError);
    await expect(adapter.getEmails("unknown")).rejects.toThrow(ValidationError);
  });
});
