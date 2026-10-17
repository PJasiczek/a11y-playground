import { defineConfig, devices } from "@playwright/test";

const port = 4173;
const baseURL = `http://localhost:${String(port)}`;

// Runs against the production build, so what we test is what ships.
export default defineConfig({
  testDir: "e2e",
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    // Every test but consent.spec.ts starts with statistics refused, so the banner stays out of the way.
    storageState: { cookies: [], origins: [{ origin: baseURL, localStorage: [{ name: "a11y-statystyki", value: "denied" }] }] },
  },
  projects: [{ name: "chromium", use: devices["Desktop Chrome"] }],
  webServer: {
    command: `pnpm build && pnpm preview --port ${String(port)} --strictPort`,
    port,
    reuseExistingServer: !process.env.CI,
    // The build imports every page from Notion first, which alone can take a minute.
    timeout: 300_000,
    // A made-up ID, so the build includes the banner; consent.spec.ts stubs gtag.js.
    env: { VITE_GA_MEASUREMENT_ID: "G-TEST000000" },
  },
});
