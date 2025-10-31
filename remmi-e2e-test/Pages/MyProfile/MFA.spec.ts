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
  console.log('♻️ Environment reloaded. Current OTP Secret:', process.env.E2E_MANAGER_OTP_SECRET);
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

    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    await page.reload();
    await login.login(
      operationManager.email!,
      operationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
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
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    await page.reload();

    // Wait for login page inputs to be visible before interacting
    const emailField = page.getByRole('textbox', { name: /email/i });
    const passwordField = page.getByRole('textbox', { name: /password/i });
    const termsCheckbox = page.getByText(/I agree to all the statements/i, { exact: false });
    const signInButton = page.getByRole('button', { name: /sign in/i });

    await emailField.fill(operationManager.email!);
    await passwordField.fill(operationManager.password!);
    await termsCheckbox.click();
    await signInButton.click();
    await page.waitForTimeout(2000);
  });

  test(' Enable Authy Authenticator MFA for a user', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
      operationManager.email!,
      operationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await profile.navigateToProfilePage();
    await profile.enableAuthyAuthenticatorMfa();

    reloadEnv();
  });

  test(' Login without enabling MFA', async ({ page }) => {
    const login = new LoginActions(page);
    await login.loginwithoutOTp(salesAgent.email!, salesAgent.password!);
    const noMfaMessage = page.getByText(/No MFA Assigned/i);
    await expect(noMfaMessage).toBeVisible();
  });

  test(' MFA Warning after 7 days', async ({ page }) => {
      const login = new LoginActions(page);
      await login.loginwithoutOTp(salesAgent.email!, salesAgent.password!);
      const warningMessage = page.locator('div').filter({ hasText: 'No MFA AssignedTo enhance' }).nth(2);
      await expect(warningMessage).toBeVisible();
  });

  test(' Enter incorrect Google Authenticator MFA code', async ({ page }) => {
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
