import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "integration",
    environment: "node",
    include: ["tests/integration/**/*.int.test.ts"],
    globalSetup: ["tests/integration/global-setup.ts"],
    testTimeout: 60_000,
    hookTimeout: 300_000,
    fileParallelism: false,
  },
});
