
import { test, expect } from '@playwright/test';
import { MyProfileActions } from './MyProfileActions';
import { LoginActions } from '../Login/LoginAction';
import { LoginUsers } from '../../fixture/test-data';

const operationManager = LoginUsers.manager;

// Ensure tests are not skipped and run independently
test.describe('MFA Tab Tests - Remmi E2E', () => {
  test('Enable Google Authenticator MFA for a user', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
      operationManager.email!,
      operationManager.password!,
      operationManager.otpSecret!
    );
    await profile.navigateToProfilePage();
    await profile.enableGoogleAuthenticatorMfa();
  });

  test('Enable Microsoft Authenticator MFA for a user', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    // Ensure we are not skipping this test
    await login.login(
      operationManager.email!,
      operationManager.password!,
      operationManager.otpSecret!
    );
    await profile.navigateToProfilePage();
    await profile.enableMicrosoftAuthenticatorMfa();
  });

  test('Enable Authy Authenticator MFA for a user', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    // Ensure we are not skipping this test
    await login.login(
      operationManager.email!,
      operationManager.password!,
      operationManager.otpSecret!
    );
    await profile.navigateToProfilePage();
    await profile.enableAuthyAuthenticatorMfa();

  });
});



// what does it mean
