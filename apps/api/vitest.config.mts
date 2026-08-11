import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.spec.ts", "test/**/*.e2e.spec.ts"],
    testTimeout: 15_000,
    hookTimeout: 20_000,
    coverage: { provider: "v8", thresholds: { lines: 90 } }
  }
});