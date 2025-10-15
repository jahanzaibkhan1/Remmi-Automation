import { test } from '@playwright/test';
import { MyProfileActions } from './MyProfileActions';
import { LoginActions } from '../Login/LoginAction';
import { LoginUsers } from '../../fixture/test-data';

const manager = LoginUsers.manager;

let login: LoginActions;
let profile: MyProfileActions;

// 🔹 Helper function to update Access Tab settings
async function updateAccessTabSettings() {
  await profile.navigateToProfilePage();
  await profile.updateAccessSettings('Dawood Ahmad');
}

test.describe('Access Tab Tests - Remmi E2E', () => {
  test.beforeEach(async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);

    if (!manager.email || !manager.password || !manager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(manager.email!, manager.password!, manager.otpSecret!);
  });

  test('Test 1: The user can successfully select a user from Access tab', async () => {
    await updateAccessTabSettings();
  });
});
