import { test } from '@playwright/test';
import { MyProfileActions } from './MyProfileActions';
import { LoginActions } from '../Login/LoginAction';
import { LoginUsers } from '../../fixture/test-data';

const manager = LoginUsers.manager;

test.describe('My Profile Tests - Remmi E2E', () => {
  let login: LoginActions;
  let profile: MyProfileActions;

  // ---------------------------
  // Runs before each test
  // ---------------------------
  test.beforeEach(async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);
    // Skip if credentials are missing
    await page.waitForLoadState('networkidle');
    if (!manager.email || !manager.password || !manager.otpSecret) {
      test.skip(true, 'Skipping profile tests: missing environment credentials');
    }

    // Login to the application
    await login.login(manager.email!, manager.password!, manager.otpSecret!);
  });

  // ---------------------------
  // TEST 1: Verify profile fields
  // ---------------------------
  test('1. Profile fields show data & are non-editable', async () => {
    // Navigate to My Profile page
    await profile.navigateToProfilePage();

    // Verify all fields contain data and cannot be edited
    await profile.verifyAllProfileFields();
  });

  // ---------------------------
  // TEST 2: PIN input functionality
  // ---------------------------
  test('2. PIN field allows input and updates profile', async () => {
    await profile.navigateToProfilePage();

    // Enter a valid PIN and save profile
    await profile.enterPinAndSave('1234');
  });

  // ---------------------------
  // TEST 3: Correct PIN allows private download
  // ---------------------------
  test('3. Correct PIN allows private download', async () => {
    await profile.navigateToLibrary();

    // Verify downloading with correct PIN succeeds
    await profile.downloadWithCorrectPin('1234');
  });

  // ---------------------------
  // Optional: Calendar color update test
  // ---------------------------
  // test('4. Calendar color selection updates correctly', async () => {
  //   await profile.navigateToProfilePage();
  //   await profile.updateCalendarColor('#FF0000');
  // });

  // ---------------------------
  // TEST 5: Non-editable fields remain enforced
  // ---------------------------
  test('5. Fields remain non-editable if data missing', async () => {
    await profile.navigateToProfilePage();
    await profile.verifyAllProfileFields();
  });

  // ---------------------------
  // TEST 6: PIN is required for private download
  // ---------------------------
  test('6. PIN is required for private download', async () => {
    await profile.navigateToLibrary();

    // Attempt download without entering a PIN
    await profile.downloadWithEmptyPin();
  });

  // ---------------------------
  // TEST 7: Verify PIN enforcement UI
  // ---------------------------
  test('7. Verify PIN is required for private download', async () => {
    await profile.navigateToLibrary();

    // Check that PIN is explicitly required before download
    await profile.verifyPINIsRequired();
  });

  // ---------------------------
  // TEST 8: Incorrect PIN prevents download
  // ---------------------------
  test('8. Incorrect PIN prevents private download', async () => {
    await profile.navigateToLibrary();

    // Attempt download with wrong PIN and validate error
    await profile.downloadWithIncorrectPin('1230');
  });

  // ---------------------------
  // Optional: Invalid calendar color test
  // ---------------------------
  // test('9. System does not allow invalid calendar color', async () => {
  //   await profile.navigateToProfilePage();
  //   await profile.tryInvalidCalendarColor('INVALID_COLOR');
  // });
});
