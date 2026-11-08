import { existsSync, readFileSync } from 'node:fs';

const routes = [
  'packages/app/AGENTS.md',
  'packages/core/AGENTS.md',
  'packages/db/AGENTS.md',
  'packages/ui/AGENTS.md',
  '.ai/specs/engineering-standards.md',
  'CODE_REVIEW.md',
];
const budgets = new Map([
  ['AGENTS.md', 200],
  ...['app', 'core', 'db', 'ui'].map((unit) => [`packages/${unit}/AGENTS.md`, 160]),
]);
let failed = false;

for (const route of routes) {
  if (!existsSync(route)) {
    console.error(`Missing routed file: ${route}`);
    failed = true;
  }
}

for (const [file, limit] of budgets) {
  if (!existsSync(file)) continue;
  const lines = readFileSync(file, 'utf8').split('\n').length;
  if (lines > limit) {
    console.error(`${file}: ${lines} lines exceeds ${limit}`);
    failed = true;
  }
}

if (failed) process.exitCode = 1;
else console.log('Agent routes exist and instruction files are within budget.');
