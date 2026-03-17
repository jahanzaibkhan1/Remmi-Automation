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

  test('Verify message deletion from Noticeboard', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyMessageDeletionFromNoticeboard();
  });
  
  test('Verify that the user name is shown when a message is added to the Noticeboard', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyUserNameOnNoticeboardMessage();
  });

  test('Verify comment on a message', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyCommentOnNoticeboardMessage();
  });

  test('Verify react on a message', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyReactOnNoticeboardMessage();
  });

  test('Add a blank message on Noticeboard', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.addBlankMessageOnNoticeboard();
  });

  test('Verify scrolling loads all Noticeboard comments', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyNoticeboardCommentScrollAndCleanup();
  });

});