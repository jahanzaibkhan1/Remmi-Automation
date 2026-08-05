import { test } from '../../fixtures/session.fixture';
import { MyProfilePage } from '../../pages/myprofile/MyProfilePage';

// ----------- Tests -----------

test.describe('Notifications Tab Tests - Remmi E2E', () => {
  test('Test case 1: User clicks ON the button for notification', async ({ sessionPage }) => {
    const profile = new MyProfilePage(sessionPage);
    await profile.navigateToProfilePage();
    await profile.enableAllNotifications();
  });
});