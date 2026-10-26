import { readdir, readFile } from 'node:fs/promises';
import { relative, resolve } from 'node:path';

const packageRoot = resolve(import.meta.dirname, '..');
const roots = [resolve(packageRoot, 'src'), resolve(packageRoot, '.storybook')];
const allowedExtensions = new Set(['.css', '.ts', '.tsx', '.mdx']);
const issues = [];

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collect(path));
    else if (allowedExtensions.has(path.slice(path.lastIndexOf('.')))) files.push(path);
  }
  return files;
}

for (const root of roots) {
  for (const file of await collect(root)) {
    if (file.endsWith('/tokens.css') || file.endsWith('/design-system-tokens.css')) continue;
    const source = await readFile(file, 'utf8');
    const relPath = relative(packageRoot, file);
    const checks = [
      { label: 'raw color value', pattern: /#(?:[\da-f]{3,8})\b|\b(?:rgb|rgba|hsl|hsla|oklch)\s*\(/gi },
      { label: 'Tailwind palette class', pattern: /\b(?:bg|text|border|ring|fill|stroke|from|via|to)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:\d{2,3}|white|black)\b/g },
      { label: 'arbitrary Tailwind value', pattern: /\b(?:p|px|py|pt|pr|pb|pl|m|mx|my|mt|mr|mb|ml|w|h|min-w|max-w|min-h|max-h|gap|gap-x|gap-y|rounded|text|bg|border|shadow)-\[[^\]]+\]/g },
    ];
    for (const { label, pattern } of checks) {
      for (const match of source.matchAll(pattern)) {
        const line = source.slice(0, match.index).split('\n').length;
        issues.push(`${relPath}:${line}: ${label}: ${match[0]}`);
      }
    }
  }
}

if (issues.length) {
  process.stderr.write(`Design token check failed:\n${issues.join('\n')}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write('Design token check passed.\n');
}
