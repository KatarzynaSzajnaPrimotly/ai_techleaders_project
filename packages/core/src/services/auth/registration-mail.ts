export interface RegistrationMail {
  subject: string;
  text: string;
}

export function buildRegistrationMail(confirmationUrl: string): RegistrationMail {
  return {
    subject: "Finish creating your DevMentor account",
    text: `Use this link to finish creating your DevMentor account:\n\n${confirmationUrl}\n\nIf you did not request this, you can ignore this e-mail.`,
  };
}

export function buildExistingAccountMail(signInUrl: string, usesGithub: boolean): RegistrationMail {
  const signInMethod = usesGithub ? "GitHub" : "your password";
  return {
    subject: "Sign in to your DevMentor account",
    text: `A DevMentor account already uses this e-mail address.\n\nSign in with ${signInMethod}: ${signInUrl}\n\nIf you did not request this, you can ignore this e-mail.`,
  };
}
