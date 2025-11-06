import { test } from '@playwright/test';
import { MyProfileActions } from './MyProfileActions';
import { LoginActions } from '../Login/LoginAction';
import { LoginUsers } from '../../fixture/test-data';

const operationManager = LoginUsers.manager;
const salesAgent = LoginUsers.sales;
const admin = LoginUsers.admin;

let login: LoginActions;
let profile: MyProfileActions;

// 🔹 Helper functions
async function enableAllNotifications() {
  await profile.navigateToProfilePage();
  await profile.enableAllNotifications();
}

// ----------- Tests -----------

test.describe('Notifications Tab Tests - Remmi E2E', () => {
  test('Test case 1: User click ON the button for notification  ', async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );

    await enableAllNotifications();
  });
});