import { test } from '@playwright/test';
import { LoginPage } from '../../pages/login/LoginPage';
import { LoginUsers } from '../../fixtures/test-data';
import * as fs from 'fs';
import * as path from 'path';

const manager = LoginUsers.manager;

// Path to store manager session
const managerSessionPath = path.join(__dirname, '../../sessions/manager-session.json');

test.describe('Login Tests - Remmi E2E', () => {
  // Save manager session before running other tests
  test('Test case 0: Login and save manager session', async ({ browser }) => {
    const context = await browser.newContext();
    try {
      const page = await context.newPage();
      const login = new LoginPage(page);
      await login.login(manager.email!, manager.password!, process.env.E2E_MANAGER_OTP_SECRET!);
      const dir = path.dirname(managerSessionPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      await context.storageState({ path: managerSessionPath });
      console.log(`✅ Manager session saved at: ${managerSessionPath}`);
    } finally {
      await context.close();
    }
  });

  // All other tests can reuse the manager session
  test('Test case 1: Verify sign in with valid email and password', async ({ page }) => {
    const login = new LoginPage(page);
    await login.login(manager.email!, manager.password!, process.env.E2E_MANAGER_OTP_SECRET!);
  });

  test('Test case 2: Verify password visibility toggle', async ({ page }) => {
    const login = new LoginPage(page);
    await login.togglePasswordVisibility(manager.email!, manager.password!);
  });

  test('Test case 3: Verify error message if checkbox is not selected', async ({ page }) => {
    const login = new LoginPage(page);
    await login.withoutCheckbox(manager.email!, manager.password!);
  });

  test('Test case 4: Verify error on invalid email', async ({ page }) => {
    const login = new LoginPage(page);
    await login.invalidEmail('invalid-email', manager.password!);
  });

  test('Test case 5: Verify error message on incorrect password', async ({ page }) => {
    const login = new LoginPage(page);
    await login.incorrectPassword(manager.email!, 'WrongPass123!');
  });

  test('Test case 6: Verify login after correcting incorrect email or password', async ({ page }) => {
    const login = new LoginPage(page);
    await login.loginWithRetryWithoutOtp('wrong@example.com', 'WrongPass123!', manager.email!, manager.password!);
  });

  test('Test case 7: Verify OTP is sent after successful login attempt', async ({ page }) => {
    const login = new LoginPage(page);
    await login.verifyOtp(manager.email!, manager.password!, manager.otpSecret!);
  });

  test('Test case 8: Verify OTP functionality on valid OTP input', async ({ page }) => {
    const login = new LoginPage(page);
    await login.verifyValidOtp(manager.email!, manager.password!, manager.otpSecret!);
  });

  test('Test case 9: Verify OTP error on invalid OTP input', async ({ page }) => {
    const login = new LoginPage(page);
    await login.invalidOtp(manager.email!, manager.password!, '123456');
  });

  test('Test case 10: Verify "Forgot Password" functionality (email input)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.forgetPasswordWithoutOtp(manager.email!);
  });

  test('Test case 11: Verify "Forgot Password" functionality with wrong (email input)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.forgetPasswordWithIncorrectEmail();
  });

  test('Test case 12: Verify "Forgot Password" functionality without (email input)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.forgetPasswordWithoutEmail();
  });

  test('Test case 13: Verify OTP is sent after "Forgot Password"', async ({ page }) => {
    const login = new LoginPage(page);
    await login.verifyOtpSentAfterForgotPassword(manager.email!, manager.otpSecret!);
  });

  test('Test case 15: Verify error on invalid email in "Forgot Password"', async ({ page }) => {
    const login = new LoginPage(page);
    await login.forgetPasswordWithInvalidEmail();
  });

  test('Test case 22: Verify proper placeholder text is shown in each input field', async ({ page }) => {
    const login = new LoginPage(page);
    await login.verifyLoginPlaceholder();
  });

  test('Empty email', async ({ page }) => {
    const login = new LoginPage(page);
    await login.emptyEmail(manager.password!);
  });

  test('Empty password', async ({ page }) => {
    const login = new LoginPage(page);
    await login.emptyPassword(manager.email!);
  });

  test('Test case 21: Verify validation triggers when "Sign In" button is clicked', async ({ page }) => {
    const login = new LoginPage(page);
    await login.emptyEmailAndPassword();
  });

  test('OTP shorter/longer than expected', async ({ page }) => {
    const login = new LoginPage(page);
    await login.invalidOtpLength(manager.email!, manager.password!, '12'); // Short OTP example
  });

});
