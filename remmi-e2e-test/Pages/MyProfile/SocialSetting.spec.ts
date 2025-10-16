import { test } from '@playwright/test';
import { MyProfileActions } from './MyProfileActions';
import { LoginActions } from '../Login/LoginAction';
import { LoginUsers } from '../../fixture/test-data';

const operationManager = LoginUsers.manager;
const salesAgent = LoginUsers.sales;
const admin = LoginUsers.admin;

let login: LoginActions;
let profile: MyProfileActions;

// 🔹 Helper function to update social media settings
async function updateSocialMediaSettings() {
  await profile.navigateToProfilePage();
  await profile.updateSocialSettings({
    facebook: 'https://facebook.com/myprofile',
    xUrl: 'https://x.com/myprofile',
    instagram: 'https://instagram.com/myprofile',
    linkedIn: 'https://linkedin.com/in/myprofile',
    website: 'https://mywebsite.com',
    marketingEmail: 'marketing@example.com',
    selectBso: 'Jahanzaib Xenex',
  });
}

test.describe('Social Settings Tests - Remmi E2E', () => {
  test('Test 1: The user can successfully upload social media links and the page updates correctly', async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);

    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);
    await updateSocialMediaSettings();
  });
});
