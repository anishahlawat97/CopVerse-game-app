import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60000, // 60 seconds timeout for each test
  expect: {
    timeout: 5000, // 5 seconds for assertions
  },
  use: {
    headless: false, // Run in headed mode for debugging
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000, // Increase timeout for user actions
    trace: 'on', // Captures traces for debugging failed tests
  },
})
