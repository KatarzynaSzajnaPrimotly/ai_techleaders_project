export class MentorValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MentorValidationError";
  }
}

export class MentorAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`A mentor with email ${email} already exists`);
    this.name = "MentorAlreadyExistsError";
  }
}
