import { test } from '@playwright/test';
import { MyProfileActions } from './MyProfileActions';
import { LoginActions } from '../Login/LoginAction';
import { LoginUsers } from '../../fixture/test-data';

const operationManager = LoginUsers.manager;
const salesAgent = LoginUsers.sales;
const admin = LoginUsers.admin;

test.describe('My Profile Tests - Remmi E2E', () => {
  // ---------------------------
  // TEST 1: Verify profile fields
  // ---------------------------
  test('1. Profile fields show data & are non-editable', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await page.waitForLoadState('networkidle');
    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping profile tests: missing environment credentials');
    }
    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);

    // Navigate to My Profile page
    await profile.navigateToProfilePage();

    // Verify all fields contain data and cannot be edited
    await profile.verifyAllProfileFields();
  });

  // ---------------------------
  // TEST 2: PIN input functionality
  // ---------------------------
  test('2. PIN field allows input and updates profile', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await page.waitForLoadState('networkidle');
    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping profile tests: missing environment credentials');
    }
    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);

    await profile.navigateToProfilePage();

    // Enter a valid PIN and save profile
    await profile.enterPinAndSave('1234');
  });

  // ---------------------------
  // TEST 3: Correct PIN allows private download
  // ---------------------------
  test('3. Correct PIN allows private download', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await page.waitForLoadState('networkidle');
    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping profile tests: missing environment credentials');
    }
    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);

    await profile.navigateToLibrary();

    // Verify downloading with correct PIN succeeds
    await profile.downloadWithCorrectPin('1234');
  });

  // ---------------------------
  // Optional: Calendar color update test
  // ---------------------------
  // test('4. Calendar color selection updates correctly', async ({ page }) => {
  //   const login = new LoginActions(page);
  //   const profile = new MyProfileActions(page);
  //   await page.waitForLoadState('networkidle');
  //   if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
  //     test.skip(true, 'Skipping profile tests: missing environment credentials');
  //   }
  //   await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);
  //   await profile.navigateToProfilePage();
  //   await profile.updateCalendarColor('#FF0000');
  // });

  // ---------------------------
  // TEST 5: Non-editable fields remain enforced
  // ---------------------------
  test('5. Fields remain non-editable if data missing', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await page.waitForLoadState('networkidle');
    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping profile tests: missing environment credentials');
    }
    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);

    await profile.navigateToProfilePage();
    await profile.verifyAllProfileFields();
  });

  // ---------------------------
  // TEST 6: PIN is required for private download
  // ---------------------------
  test('6. PIN is required for private download', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await page.waitForLoadState('networkidle');
    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping profile tests: missing environment credentials');
    }
    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);

    await profile.navigateToLibrary();

    // Attempt download without entering a PIN
    await profile.downloadWithEmptyPin();
  });

  // ---------------------------
  // TEST 7: Verify PIN enforcement UI
  // ---------------------------
  test('7. Verify PIN is required for private download', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await page.waitForLoadState('networkidle');
    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping profile tests: missing environment credentials');
    }
    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);

    await profile.navigateToLibrary();

    // Check that PIN is explicitly required before download
    await profile.verifyPINIsRequired();
  });

  // ---------------------------
  // TEST 8: Incorrect PIN prevents download
  // ---------------------------
  test('8. Incorrect PIN prevents private download', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await page.waitForLoadState('networkidle');
    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping profile tests: missing environment credentials');
    }
    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);

    await profile.navigateToLibrary();

    // Attempt download with wrong PIN and validate error
    await profile.downloadWithIncorrectPin('1230');
  });

  // ---------------------------
  // Optional: Invalid calendar color test
  // ---------------------------
  // test('9. System does not allow invalid calendar color', async ({ page }) => {
  //   const login = new LoginActions(page);
  //   const profile = new MyProfileActions(page);
  //   await page.waitForLoadState('networkidle');
  //   if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
  //     test.skip(true, 'Skipping profile tests: missing environment credentials');
  //   }
  //   await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);
  //   await profile.navigateToProfilePage();
  //   await profile.tryInvalidCalendarColor('INVALID_COLOR');
  // });
});
