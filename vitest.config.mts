import { defineConfig } from "vitest/config";

const sharedExclude = ["**/node_modules/**", "**/.next/**"];

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit-node",
          environment: "node",
          include: [
            "packages/core/src/**/*.test.ts",
            "packages/db/src/**/*.test.ts",
            "packages/app/src/server/**/*.test.ts",
            "packages/app/src/app/api/**/*.test.ts",
          ],
          exclude: sharedExclude,
        },
      },
      {
        test: {
          name: "unit-dom",
          environment: "jsdom",
          setupFiles: ["./vitest.setup.dom.ts"],
          include: ["packages/ui/src/**/*.test.{ts,tsx}", "packages/app/src/app/**/*.test.tsx"],
          exclude: sharedExclude,
        },
      },
    ],
    coverage: {
      provider: "v8",
      include: ["packages/*/src/**/*.{ts,tsx}"],
      exclude: ["**/*.test.{ts,tsx}", "**/*.d.ts"],
      reporter: ["text", "lcov", "json-summary"],
      reportsDirectory: "coverage",
      thresholds: { statements: 100, branches: 100, functions: 100, lines: 100 },
    },
  },
});
