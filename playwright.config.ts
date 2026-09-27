import { defineConfig, devices } from "@playwright/test";

const port = 4173;

// Runs against the production build, so what we test is what ships.
export default defineConfig({
  testDir: "e2e",
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: `http://localhost:${String(port)}` },
  projects: [{ name: "chromium", use: devices["Desktop Chrome"] }],
  webServer: {
    command: `pnpm build && pnpm preview --port ${String(port)} --strictPort`,
    port,
    reuseExistingServer: !process.env.CI,
  },
});
