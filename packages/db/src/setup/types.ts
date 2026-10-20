export interface StepOutcome {
  status: "done" | "skipped";
  detail: string;
}

export interface SetupStep {
  name: string;
  run(): Promise<StepOutcome>;
}

/** A failure the user can act on: `fix` is printed under the message. */
export class SetupError extends Error {
  constructor(
    message: string,
    readonly fix: string,
  ) {
    super(message);
    this.name = "SetupError";
  }
}
