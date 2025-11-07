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

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.verifyAllProfileFields();
  });

  test('2. PIN field allows input and updates profile', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.enterPinAndSave('1234');
  });

  test('3. Correct PIN allows private download', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);
    
    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );

    await profile.navigateToLibrary();
    await profile.downloadWithCorrectPin('1234');
  });

  test('4. Fields remain non-editable if data missing', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);
  
    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );

    await profile.navigateToProfilePage();
    await profile.verifyAllProfileFields();
  });
  test('5. PIN is required for private download', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );

    await profile.navigateToLibrary();
    await profile.downloadWithEmptyPin();
  });

  test('6. Verify PIN is required for private download', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );

    await profile.navigateToLibrary();
    await profile.verifyPINIsRequired();
  });

  test('7. Calendar color selection updates correctly', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);
    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.updateCalendarColor('#c0add5');
  });

  test('8. Incorrect PIN prevents private download', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

      await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );

    await profile.navigateToLibrary();
    await profile.downloadWithIncorrectPin('1230');
  });
  // test('9. System does not allow invalid calendar color', async ({ page }) => {
  //   const login = new LoginActions(page);
  //   const profile = new MyProfileActions(page);
  //   await login.login(
  //       operationManager.email!,
  //       operationManager.password!,
  //       process.env.E2E_MANAGER_OTP_SECRET!
  //     );
  //   await profile.navigateToProfilePage();
  //   await profile.tryInvalidCalendarColor('INVALID_COLOR');
  // });
});
