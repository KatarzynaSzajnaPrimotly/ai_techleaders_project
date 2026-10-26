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
  // Engineering standards (.ai/specs/engineering-standards.md): code quality rules that can be linted.
  {
    files: ["**/*.{ts,tsx,mts}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "no-empty": ["error", { allowEmptyCatch: false }],
    },
  },
  {
    files: ["packages/*/src/**/*.{ts,tsx}"],
    ignores: ["packages/db/src/scripts/**", "**/*.test.{ts,tsx}"],
    rules: { "no-console": "error" },
  },
  // The only sanctioned fetch() to /api/* is apiCall (ui/src/backend/api/apiCall.ts).
  {
    files: ["packages/app/src/**/*.{ts,tsx}", "packages/ui/src/**/*.{ts,tsx}"],
    ignores: ["packages/ui/src/backend/api/apiCall.ts", "**/*.test.{ts,tsx}"],
    rules: {
      "no-restricted-globals": [
        "error",
        { name: "fetch", message: "Use apiCall/apiCallOrThrow from @devmentor/ui instead of raw fetch." },
      ],
      "no-restricted-properties": [
        "error",
        { object: "window", property: "fetch", message: "Use apiCall/apiCallOrThrow from @devmentor/ui." },
        { object: "globalThis", property: "fetch", message: "Use apiCall/apiCallOrThrow from @devmentor/ui." },
      ],
    },
  },
  globalIgnores([
    "**/.next/**",
    "**/out/**",
    "**/build/**",
    "coverage/**",
    "**/next-env.d.ts",
    ".ai/**",
    "mentoring-portal-concept/**",
    "prototypes/**",
    "packages/ui/.storybook/public/prototypes/**",
    "**/lekcja-07/**",
  ]),
]);

export default eslintConfig;
