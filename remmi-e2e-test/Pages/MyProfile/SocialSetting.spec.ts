import { test } from '@playwright/test';
import { MyProfileActions } from './MyProfileActions';
import { LoginActions } from '../Login/LoginAction';
import { LoginUsers } from '../../fixture/test-data';

const manager = LoginUsers.manager;

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
  test.beforeEach(async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);

    if (!manager.email || !manager.password || !manager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(manager.email!, manager.password!, manager.otpSecret!);
  });

  test('Test 1: The user can successfully upload social media links and the page updates correctly', async () => {
    await updateSocialMediaSettings();
  });
});
