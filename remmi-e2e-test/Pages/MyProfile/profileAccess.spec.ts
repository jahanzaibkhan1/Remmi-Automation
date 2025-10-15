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

// 🔹 Helper function to update Access Tab settings for multiple users
async function grantTaskAccessToMultipleUsers() {
    await profile.navigateToProfilePage();
    await profile.grantTaskAccessToMultipleUsers(['Hina Agent', 'Hina Tahir']);
  }

  async function removeUserFromAccess(){
    await profile.navigateToProfilePage();
    await profile.removeUserFromAccess();
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

  test('Test case 2: The user can successfully select a user from Access tab', async () => {
    await updateAccessTabSettings();
  });
  test('Test 4: Verify multiple users can be granted calendar access', async () => {
    await grantTaskAccessToMultipleUsers()
  });

  test('Test 6: Verify multiple users can be granted calendar access', async () => {
    await removeUserFromAccess()
  });
  
});

