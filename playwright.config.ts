import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  timeout: 30_000,
  use: {
    baseURL: "http://127.0.0.1:8083",
    viewport: { width: 402, height: 874 },
    channel: "chrome",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "python3 -m http.server 8083 --bind 127.0.0.1 --directory dist",
    url: "http://127.0.0.1:8083",
    reuseExistingServer: !process.env.CI,
  },
});
