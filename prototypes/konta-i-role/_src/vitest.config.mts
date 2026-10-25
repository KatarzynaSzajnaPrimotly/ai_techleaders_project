import { defineConfig } from "vitest/config";

// Navigation tests of the prototype. They are not part of the repository's `unit-*` projects (no coverage rule applies
// to a prototype); run them with: npx vitest run --config prototypes/konta-i-role/_src/vitest.config.mts
export default defineConfig({
  root: import.meta.dirname,
  test: { environment: "jsdom", include: ["src/**/*.test.ts"] },
});
