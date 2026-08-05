import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

/**
 * Load environment variables from .env file
 */
dotenv.config({
  path: path.resolve(__dirname, '.env'),
});

/**
 * Ensure critical environment variables exist
 */
const BASE_URL = process.env.BASE_URL;

if (!BASE_URL) {
  console.error('❌ BASE_URL is missing in .env or GitHub secrets!');
  console.error('👉 Expected .env at:', path.resolve(__dirname, '.env'));
  process.exit(1);
}

/**
 * Debug (remove later if you want)
 */
console.log('✅ BASE_URL:', BASE_URL);

/**
 * Playwright Test Configuration
 * See: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './remmi-e2e-test',
  globalSetup: './remmi-e2e-test/auth/globalSetup.ts',

  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 3,
  workers: 1,
  timeout: 120000, //

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: `results.xml` }],
  ],

  use: {
    baseURL: BASE_URL, // ✅ FIXED (now guaranteed to load)
    headless: true,
    viewport: { width: 1260, height: 580 },
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    navigationTimeout: 2 * 60 * 1000,
    launchOptions: {
      slowMo: process.env.CI ? 50 : 0,
      args: [
        '--disable-gpu',
        '--no-sandbox',
        '--disable-dev-shm-usage',
      ],
    },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        viewport: null,
        launchOptions: {
          args: ['--start-maximized']
        }
      }
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'],
    //   viewport: { width: 1320, height: 620 },
    //    },
      
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'],
    //     // viewport: { width: 1320, height: 620 },
    //    },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});