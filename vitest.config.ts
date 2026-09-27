import { defineConfig } from "vitest/config";

// Unit tests for content and data. Browser tests live in e2e/ and run with Playwright.
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: { include: ["src/**/*.test.ts"] },
});
