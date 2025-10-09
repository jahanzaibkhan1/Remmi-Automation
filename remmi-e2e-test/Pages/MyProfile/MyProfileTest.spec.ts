import { test } from '@playwright/test';
import { MyProfileActions } from './MyProfileActions';
import { LoginActions } from '../Login/LoginAction';
import { LoginUsers } from '../../fixture/test-data';

const manager = LoginUsers.manager;

test.describe('My Profile Tests - Remmi E2E', () => {
  let login: LoginActions;
  let profile: MyProfileActions;

  test.beforeEach(async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);

    // Skip dynamically if credentials missing
    if (!manager.email || !manager.password || !manager.otpSecret) {
      test.skip(true, 'Skipping profile tests: missing environment credentials');
    }

    // Login first
    await login.login(manager.email!, manager.password!, manager.otpSecret!);
  });

  test('1. Profile fields show data & non-editable', async () => {
    await profile.navigateToProfilePage();
    await profile.verifyAllProfileFields();
  });

  test('2. PIN field allows input', async () => {
    await profile.navigateToProfilePage();
    await profile.enterPinAndSave('1234');
  });

  test('3. Correct PIN allows private download', async () => {
    await profile.navigateToLibrary();
    await profile.downloadWithCorrectPin('1234');
  });

  // test('4. Calendar color selection updates correctly', async () => {
  //   await profile.navigateToProfilePage();
  //   await profile.updateCalendarColor('#FF0000');
  // });

  test('5. Fields remain non-editable if data missing', async () => {
    await profile.navigateToProfilePage();
    await profile.verifyAllProfileFields();
  });

  test('6. PIN is required for private download', async () => {
    await profile.navigateToLibrary();
    await profile.downloadWithEmptyPin();
  });

  test('7. Verify PIN is required for private download', async () => {
    await profile.navigateToLibrary();
    await profile.verifyPINIsRequired();
  });

  test('8. Incorrect PIN prevents private download', async () => {
    await profile.navigateToLibrary();
    await profile.downloadWithIncorrectPin('1230');
  });

  // test('9. System does not allow invalid calendar color', async () => {
  //   await profile.navigateToProfilePage();
  //   await profile.tryInvalidCalendarColor('INVALID_COLOR');
  // });
});
