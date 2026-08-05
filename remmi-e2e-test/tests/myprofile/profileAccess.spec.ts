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
      // Optionally close context if desired in cleanup
    }
  }, { scope: 'worker' }]
});


test.describe('Access Tab Tests - Remmi E2E', () => {
  test('Test case 2: The user can successfully select a user from Access tab', async ({ sessionPage }) => {
    const profile = new MyProfilePage(sessionPage);
    await profile.navigateToProfilePage();
    await profile.updateAccessSettings('Dawood Ahmad');
  });

  test('Test 4: Verify multiple users can be granted calendar access', async ({ sessionPage }) => {
    const profile = new MyProfilePage(sessionPage);
    await profile.navigateToProfilePage();
    await profile.grantTaskAccessToMultipleUsers(['Hina Agent', 'Hina Tahir']);
  });

  test('Test 6: Verify user can remove granted calendar access', async ({ sessionPage }) => {
    const profile = new MyProfilePage(sessionPage);
    await profile.navigateToProfilePage();
    await profile.removeUserFromAccess();
  });

  test('Test 7: Verify that selecting Select All grants access to all users', async ({ sessionPage }) => {
    const profile = new MyProfilePage(sessionPage);
    await profile.navigateToProfilePage();
    await profile.selectAllUsers();
  });

  test('Test 8: Verify that selecting Deselect All removes access from all users', async ({ sessionPage }) => {
    const profile = new MyProfilePage(sessionPage);
    await profile.navigateToProfilePage();
    await profile.DeselectAllUsers();
  });

  test('Test 10: Verify user appears under Staff Calendar Access when granted access', async ({ sessionPage }) => {
    const profile = new MyProfilePage(sessionPage);
    await profile.navigateToProfilePage();
    await profile.verifyUserInStaffCalendarAccess('Admin Admin');
  });

  // test('Verify granted calendar access allows viewing calendar OFIs', async ({ sessionPage }) => {
  //   const profile = new MyProfilePage(sessionPage);
  //   await profile.navigateToProfilePage();
  //   await profile.verifyCalendarAccessFunctional('Dawood Ahmad');
  // });

  // test('Verify user cannot see calendar OFIs without granted access', async ({ sessionPage }) => {
  //   const profile = new MyProfilePage(sessionPage);
  //   await profile.navigateToProfilePage();
  //   await profile.verifyNoCalendarAccess('Unauthorized User'); // replace with a real user without access
  // });

});
