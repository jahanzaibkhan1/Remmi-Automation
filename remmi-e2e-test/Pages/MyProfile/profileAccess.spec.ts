import { test } from '@playwright/test';
import { MyProfileActions } from './MyProfileActions';
import { LoginActions } from '../Login/LoginAction';
import { LoginUsers } from '../../fixture/test-data';

const operationManager = LoginUsers.manager;
const salesAgent = LoginUsers.sales;
const admin = LoginUsers.admin;

let login: LoginActions;
let profile: MyProfileActions;

// ----------- Tests -----------

test.describe('Access Tab Tests - Remmi E2E', () => {
  test('Test case 2: The user can successfully select a user from Access tab', async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);

    await login.login(
      operationManager.email!,
      operationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await profile.navigateToProfilePage();
    await profile.updateAccessSettings('Dawood Ahmad');
  });

  test('Test 4: Verify multiple users can be granted calendar access', async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);

    await login.login(
      operationManager.email!,
      operationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await profile.navigateToProfilePage();
    await profile.grantTaskAccessToMultipleUsers(['Hina Agent', 'Hina Tahir']);
  });

  test('Test 6: Verify user can remove granted calendar access', async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);

    await login.login(
      operationManager.email!,
      operationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await profile.navigateToProfilePage();
    await profile.removeUserFromAccess();
  });

  test('Test 7: Verify that selecting Select All grants access to all users', async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);

    await login.login(
      operationManager.email!,
      operationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await profile.navigateToProfilePage();
    await profile.selectAllUsers();
  });

  test('Test 8: Verify that selecting Deselect All removes access from all users', async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);

    await login.login(
      operationManager.email!,
      operationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await profile.navigateToProfilePage();
    await profile.DeselectAllUsers();
  });

  // ----------- New Tests -----------

  // test('Verify user appears under Staff Calendar Access when granted access', async ({ page }) => {
  //   login = new LoginActions(page);
  //   profile = new MyProfileActions(page);

  //   if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
  //     test.skip(true, 'Skipping login tests: missing environment credentials');
  //   }

  //   await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);
  //   await profile.navigateToProfilePage();
  //   await profile.verifyUserInStaffCalendarAccess('Dawood Ahmad');
  // });

  // test('Verify granted calendar access allows viewing calendar OFIs', async ({ page }) => {
  //   login = new LoginActions(page);
  //   profile = new MyProfileActions(page);

  //   if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
  //     test.skip(true, 'Skipping login tests: missing environment credentials');
  //   }

  //   await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);
  //   await profile.navigateToProfilePage();
  //   await profile.verifyCalendarAccessFunctional('Dawood Ahmad');
  // });

  // test('Verify user cannot see calendar OFIs without granted access', async ({ page }) => {
  //   login = new LoginActions(page);
  //   profile = new MyProfileActions(page);

  //   if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
  //     test.skip(true, 'Skipping login tests: missing environment credentials');
  //   }

  //   await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);
  //   await profile.navigateToProfilePage();
  //   await profile.verifyNoCalendarAccess('Unauthorized User'); // replace with a real user without access
  // });

});
