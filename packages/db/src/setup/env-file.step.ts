import fs from "node:fs";
import path from "node:path";
import type { SetupStep } from "./types";

const ENV_EXAMPLE = ".env.example";
const ENV_TARGET = "packages/app/.env.local";

/** Copies `.env.example` to the Next.js env file; an existing file is never read or overwritten. */
export function envFileStep(root: string): SetupStep {
  const source = path.join(root, ENV_EXAMPLE);
  const target = path.join(root, ENV_TARGET);
  return {
    name: "Environment file",
    async run() {
      if (fs.existsSync(target)) return { status: "skipped", detail: `${ENV_TARGET} already exists` };
      fs.copyFileSync(source, target, fs.constants.COPYFILE_EXCL);
      return { status: "done", detail: `created ${ENV_TARGET} from ${ENV_EXAMPLE}` };
    },
  };
}
