import { defineConfig } from "@playwright/test";

/**
 * SEO-Verifikations-Harness (scripts/seo-verify).
 *
 * Lokal:  npm run verify:seo       (baut und startet die Site auf :4123)
 * Live:   npm run verify:seo:live  (BASE_URL=https://gleitschirm-tandemflug.com)
 */
const BASE_URL = process.env.BASE_URL || "http://localhost:4123";

export default defineConfig({
  testDir: "./scripts/seo-verify",
  timeout: 30_000,
  fullyParallel: true,
  retries: 0,
  workers: 4,
  reporter: [["list"]],
  use: {
    baseURL: BASE_URL,
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npx next start -p 4123",
        url: "http://localhost:4123/de",
        reuseExistingServer: true,
        timeout: 60_000,
      },
});
