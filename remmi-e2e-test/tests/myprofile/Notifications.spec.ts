import { test } from '../../fixtures/session.fixture';
import { MyProfileNotificationsPage as MyProfilePage } from '../../pages/myprofile/MyProfileNotificationsPage';

// ----------- Tests -----------

test.describe('Notifications Tab Tests - Remmi E2E', () => {
  test('Test case 1: User clicks ON the button for notification', async ({ sessionPage }) => {
    const profile = new MyProfilePage(sessionPage);
    await profile.navigateToProfilePage();
    await profile.enableAllNotifications();
  });
});