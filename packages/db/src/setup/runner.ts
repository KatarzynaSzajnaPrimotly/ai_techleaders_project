import { SetupError, type SetupStep } from "./types";

/** Runs the steps in order and stops at the first failure. Returns whether every step succeeded. */
export async function runSetup(steps: SetupStep[], log: (line: string) => void): Promise<boolean> {
  for (const step of steps) {
    try {
      const { status, detail } = await step.run();
      log(`[${status}] ${step.name}: ${detail}`);
    } catch (error) {
      log(`[failed] ${step.name}: ${error instanceof Error ? error.message : String(error)}`);
      if (error instanceof SetupError) log(`  fix: ${error.fix}`);
      return false;
    }
  }
  return true;
}
