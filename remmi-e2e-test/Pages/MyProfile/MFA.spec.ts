import { test, expect } from '@playwright/test';
import { MyProfileActions } from './MyProfileActions';
import { LoginActions } from '../Login/LoginAction';
import { LoginUsers } from '../../fixture/test-data';
import * as dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const operationManager = LoginUsers.manager;
const salesAgent = LoginUsers.sales;
const admin = LoginUsers.admin;

// Helper: Reload .env after MFA update
function reloadEnv() {
  dotenv.config();
  console.log('Current OTP Secret:', process.env.E2E_MANAGER_OTP_SECRET);
}

// Helper: Verify .env file actually contains new secret
function logCurrentSecret() {
  if (fs.existsSync('.env')) {
    const envData = fs.readFileSync('.env', 'utf8');
    const match = envData.match(/E2E_MANAGER_OTP_SECRET=(.+)/);
    console.log('🔍 .env file secret:', match ? match[1] : '(not found)');
  } else {
    console.log('⚠️ .env file not found!');
  }
}

test.describe(' MFA Tab Tests - Remmi E2E', () => {
  test.beforeEach(async () => {
    // Reload env before every test to pick up updated secret
    reloadEnv();
  });

  test(' Enable Google Authenticator MFA for a user', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
      operationManager.email!,
      operationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await profile.navigateToProfilePage();
    await profile.enableGoogleAuthenticatorMfa();

    // Re-check secret after enabling MFA
    reloadEnv();
    logCurrentSecret();
  });

  test(' Enable Microsoft Authenticator MFA for a user', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
      operationManager.email!,
      operationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await profile.navigateToProfilePage();
    await profile.enableMicrosoftAuthenticatorMfa();
    reloadEnv();
    logCurrentSecret()
  });

  test(' Enable Authy Authenticator MFA for a user', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);
    reloadEnv();
    await login.login(
      operationManager.email!,
      operationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await profile.navigateToProfilePage();
    await profile.enableAuthyAuthenticatorMfa();

    // Re-check secret after enabling MFA for Authy, for consistency
    reloadEnv();
    logCurrentSecret();
  });

  test(' Login without enabling MFA', async ({ page }) => {
    const login = new LoginActions(page);
    await login.loginwithoutOTp(salesAgent.email!, salesAgent.password!);
    await page.waitForTimeout(2000);
    const noMfaMessage = page.getByText(/No MFA Assigned/i);
    await expect(noMfaMessage).toBeVisible();
  });

  test(' MFA Warning after 7 days', async ({ page }) => {
      const login = new LoginActions(page);
      await login.loginwithoutOTp(salesAgent.email!, salesAgent.password!);
      await page.waitForTimeout(2000);
      const warningMessage = page.locator('div').filter({ hasText: 'No MFA AssignedTo enhance' }).nth(2);
      await expect(warningMessage).toBeVisible();
  });

  test(' Enter incorrect Google Authenticator MFA code', async ({ page }) => {
    reloadEnv(); // Reload environment variables to ensure fresh values
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
      operationManager.email!,
      operationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await profile.navigateToProfilePage();
    await profile.enterInvalidOtpGoogleAuthenticatorMfa();
  });

  test(' Enter incorrect Microsoft Authenticator MFA code', async ({ page }) => {
    reloadEnv(); // Reload environment variables to ensure fresh values
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
      operationManager.email!,
      operationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await profile.navigateToProfilePage();
    await profile.enterInvalidOtpMsleAuthenticatorMfa();
  });

  test(' Enter incorrect Authy Authenticator MFA code', async ({ page }) => {
    reloadEnv(); // Reload environment variables to ensure fresh values
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
      operationManager.email!,
      operationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await profile.navigateToProfilePage();
    await profile.enterInvalidOtpAuthyleAuthenticatorMfa();
  });
});
