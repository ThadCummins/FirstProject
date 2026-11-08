import { defineConfig, devices } from "@playwright/test";

// End-to-end tests: build the website, open it in a real browser,
// and click through it like a user would.
export default defineConfig({
  testDir: "e2e",
  use: {
    baseURL: "http://localhost:4173",
    trace: "off",
    // Optional: point at an already-installed Chrome (used in the cloud setup).
    // On your own computer, leave it unset and run `npx playwright install` once.
    launchOptions: { executablePath: process.env.CHROMIUM_PATH || undefined },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "npm run build:web && npx serve dist -l 4173",
    url: "http://localhost:4173",
    timeout: 180_000,
    reuseExistingServer: true,
  },
});
