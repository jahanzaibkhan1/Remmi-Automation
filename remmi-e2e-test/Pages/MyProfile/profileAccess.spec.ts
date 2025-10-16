import { test } from '@playwright/test';
import { MyProfileActions } from './MyProfileActions';
import { LoginActions } from '../Login/LoginAction';
import { LoginUsers } from '../../fixture/test-data';

const operationManager = LoginUsers.manager;
const salesAgent = LoginUsers.sales;
const admin = LoginUsers.admin;

let login: LoginActions;
let profile: MyProfileActions;

// 🔹 Helper function to update Access Tab settings
async function updateAccessTabSettings() {
  await profile.navigateToProfilePage();
  await profile.updateAccessSettings('Dawood Ahmad');
}

// 🔹 Helper function to update Access Tab settings for multiple users
async function grantTaskAccessToMultipleUsers() {
  await profile.navigateToProfilePage();
  await profile.grantTaskAccessToMultipleUsers(['Hina Agent', 'Hina Tahir']);
}

async function removeUserFromAccess() {
  await profile.navigateToProfilePage();
  await profile.removeUserFromAccess();
}

async function selectAllUsers() {
  await profile.navigateToProfilePage();
  await profile.selectAllUsers([]);
}

async function DeselectAllUsers() {
  await profile.navigateToProfilePage();
  await profile.DeselectAllUsers([]);
}

test.describe('Access Tab Tests - Remmi E2E', () => {
  test('Test case 2: The user can successfully select a user from Access tab', async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);

    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);

    await updateAccessTabSettings();
  });

  test('Test 4: Verify multiple users can be granted calendar access', async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);

    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);

    await grantTaskAccessToMultipleUsers();
  });

  test('Test 6: Verify user can remove granted calendar access', async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);

    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);

    await removeUserFromAccess();
  });

  test('Test 7: Verify that selecting Select All grants access to all users', async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);

    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);

    await selectAllUsers();
  });

  test('Test 8: Verify that selecting Deselect All removes access from all users', async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);

    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);

    await DeselectAllUsers();
  });
});
