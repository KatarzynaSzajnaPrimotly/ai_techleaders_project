import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

function boundary(dir, forbidden) {
  return {
    files: [`${dir}/**/*.{ts,tsx}`],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: forbidden.map((group) => ({
            group: [group],
            message: `${dir} must not import "${group}" (see package boundaries in AGENTS.md).`,
          })),
        },
      ],
    },
  };
}

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  { settings: { next: { rootDir: "packages/app" } } },
  // Package boundaries from AGENTS.md: app -> ui, core, db; db -> core; ui and core import no project package.
  boundary("packages/core", ["@devmentor/*", "@mikro-orm/*", "awilix", "pg", "next", "next/*", "react", "react-dom"]),
  boundary("packages/ui", ["@devmentor/*", "@mikro-orm/*", "awilix", "pg"]),
  boundary("packages/db", ["@devmentor/ui", "@devmentor/app", "awilix", "next", "next/*", "react", "react-dom"]),
  globalIgnores([
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "coverage/**",
    "**/next-env.d.ts",
    ".ai/**",
    "mentoring-portal-concept/**",
  ]),
]);

export default eslintConfig;
