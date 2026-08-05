import { test as base } from '@playwright/test';
import { getSessionForRole } from '../auth/sessionManager';

const DASHBOARD_URL = process.env.DASHBOARD_URL || 'https://portal-staging.remmi.com.au/dashboard';

export const test = base.extend<{ sessionPage: any }>({
  sessionPage: async ({ browser }, use) => {
    const sessionPath = await getSessionForRole(browser, 'manager');
    const context = await browser.newContext({ storageState: sessionPath });
    const page = await context.newPage();
    await page.goto(DASHBOARD_URL, { waitUntil: 'domcontentloaded' });
    await use(page);
    await context.close();
  }
});
