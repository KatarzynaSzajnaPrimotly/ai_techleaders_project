import type { SetupStep } from "./types";

export function migrationsStep(applyPending: () => Promise<number>): SetupStep {
  return {
    name: "Migrations",
    async run() {
      const applied = await applyPending();
      if (applied === 0) return { status: "skipped", detail: "no pending migrations" };
      return { status: "done", detail: `applied ${applied} migration(s)` };
    },
  };
}
