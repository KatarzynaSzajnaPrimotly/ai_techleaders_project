import { describe, expect, it } from "vitest";
import { buildExistingAccountMail, buildRegistrationMail } from "./registration-mail";

describe("registration mail builders", () => {
  it("builds a generic confirmation message without personalizing its subject or opening", () => {
    expect(buildRegistrationMail("https://devmentor.example/register/confirm?token=token-value")).toEqual({
      subject: "Finish creating your DevMentor account",
      text: "Use this link to finish creating your DevMentor account:\n\nhttps://devmentor.example/register/confirm?token=token-value\n\nIf you did not request this, you can ignore this e-mail.",
    });
  });

  it.each([
    [true, "GitHub"],
    [false, "your password"],
  ])("tells an existing account to sign in with %s without disclosing it in the subject", (usesGithub, method) => {
    expect(buildExistingAccountMail("https://devmentor.example/sign-in", usesGithub)).toEqual({
      subject: "Sign in to your DevMentor account",
      text: `A DevMentor account already uses this e-mail address.\n\nSign in with ${method}: https://devmentor.example/sign-in\n\nIf you did not request this, you can ignore this e-mail.`,
    });
  });
});
