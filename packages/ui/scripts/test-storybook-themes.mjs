import { spawnSync } from 'node:child_process';

for (const theme of ['light', 'dark']) {
  process.stdout.write(`\nRunning Storybook stories with ${theme} theme\n`);
  const result = spawnSync('npm', ['run', 'test-storybook'], {
    stdio: 'inherit',
    env: { ...process.env, VITE_STORYBOOK_THEME: theme },
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
