
import { test, expect } from '@playwright/test';
import { MyProfileActions } from './MyProfileActions';
import { LoginActions } from '../Login/LoginAction';
import { LoginUsers } from '../../fixture/test-data';

const operationManager = LoginUsers.manager;
const salesAgent = LoginUsers.sales;
const admin = LoginUsers.admin;
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

  test('Login without enabling MFA', async ({ page }) => {
    await page.goto('/login');
    const emailField = page.getByRole('textbox', { name: /email/i });
    const passwordField = page.getByRole('textbox', { name: /password/i });
    const termsCheckbox = page.getByText(/I agree to all the statements/i, { exact: false });
    const signInButton = page.getByRole('button', { name: /sign in/i });

    await emailField.fill(salesAgent.email!);
    await passwordField.fill(salesAgent.password!);
    await termsCheckbox.click();
    await signInButton.click();

    // Verify "No MFA Assigned" message appears
    const noMfaMessage = page.getByText(/No MFA Assigned/i);
    await expect(noMfaMessage).toBeVisible({ timeout: 30000 });
  });
  
  test('MFA Warning after 7 days', async ({ page }) => {
    await page.goto('/login');
    const emailField = page.getByRole('textbox', { name: /email/i });
    const passwordField = page.getByRole('textbox', { name: /password/i });
    const termsCheckbox = page.getByText(/I agree to all the statements/i, { exact: false });
    const signInButton = page.getByRole('button', { name: /sign in/i });

    await emailField.fill(salesAgent.email!);
    await passwordField.fill(salesAgent.password!);
    await termsCheckbox.click();
    await signInButton.click();

    // Verify "No MFA Assigned" message appears
    const noMfaMessage = page.getByText(/You have 7 days to complete/i);
    await expect(noMfaMessage).toBeVisible({ timeout: 30000 });
  });
});



// what does it mean
