import { test as base } from '@playwright/test';
import { MyProfileActions } from './MyProfileActions';
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
      // Optionally close context if desired in cleanup
    }
  }, { scope: 'worker' }]
});

test.describe('Social Settings Tests - Remmi E2E', () => {
  test('Test 1: The user can successfully upload social media links and the page updates correctly', async ({ sessionPage }) => {
    const profile = new MyProfileActions(sessionPage);

    await profile.navigateToProfilePage();
    await profile.updateSocialSettings({
      facebook: 'https://facebook.com/myprofile',
      xUrl: 'https://x.com/myprofile',
      instagram: 'https://instagram.com/myprofile',
      linkedIn: 'https://linkedin.com/in/myprofile',
      website: 'https://mywebsite.com',
      marketingEmail: 'marketing@example.com',
      selectBso: 'Jahanzaib Xenex',
    });
  });
});
