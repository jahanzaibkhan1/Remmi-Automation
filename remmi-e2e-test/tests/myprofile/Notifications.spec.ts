import { test as base } from '@playwright/test';
import { MyProfilePage } from '../../pages/myprofile/MyProfilePage';
import * as path from 'path';

const managerSessionPath = path.join(__dirname, '../../sessions/manager-session.json');
const DASHBOARD_URL = process.env.DASHBOARD_URL || 'https://remmi-app-stage-ui.azurewebsites.net/dashboard';

const test = base.extend<{ sessionPage: any }>({
  sessionPage: [async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: managerSessionPath });
    try {
      const page = await context.newPage();
      await page.goto(DASHBOARD_URL);
      await use(page);
    } finally {

    }
  }, { scope: 'worker' }]
});

// ----------- Tests -----------

test.describe('Notifications Tab Tests - Remmi E2E', () => {
  test('Test case 1: User clicks ON the button for notification', async ({ sessionPage }) => {
    const profile = new MyProfilePage(sessionPage);
    await profile.navigateToProfilePage();
    await profile.enableAllNotifications();
  });
});