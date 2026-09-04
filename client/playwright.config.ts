import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",

  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],

  // Automatically starts `npm run dev` before the test suite and reuses
  // it if you already have it running locally.
  //
  // NOTE: this does NOT start the backend. Make sure your Docker
  // containers (`docker compose -f docker-compose.dev.yml up -d`) are
  // already running before you run these tests - Playwright can't
  // start Docker for you here.
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});