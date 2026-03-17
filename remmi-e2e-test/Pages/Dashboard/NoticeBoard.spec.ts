import { test as base } from '@playwright/test';
import { DashboardAction } from './DashboardAction';
import path from 'path';

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
      // Optionally close context if desired
    }
  }, { scope: 'worker' }]
});

test.describe('Notice Board', () => {
  test('Verify public message on Noticeboard', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyPublicMessageOnNoticeboard();
  });

  test('Verify private message to specific staff', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyPrivateMessageToSpecificStaff();
  });

  test('Verify private message to specific office', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyPrivateMessageToSpecificOffice();
  });

  test('Verify private message to specific team', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyPrivateMessageToSpecificTeam();
  });
  
});