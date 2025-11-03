import { test } from '@playwright/test';
import { LoginActions } from './LoginAction';
import { LoginUsers } from '../../fixture/test-data';

const manager = LoginUsers.manager;
const sales = LoginUsers.sales;
const admin= LoginUsers.admin;

test.describe('Login Tests - Remmi E2E', () => {
  // test 1
  test('Test case 1: Verify sign in with valid email and password', async ({ page }) => {
    const login = new LoginActions(page);
    await login.login(manager.email!, manager.password!, manager.otpSecret!);
  });

  test('Test case 2: Verify password visibility toggle', async ({ page }) => {
    const login = new LoginActions(page);
    await login.togglePasswordVisibility(manager.email!, manager.password!);
  });

  test('Test case 3: Verify error message if checkbox is not selected', async ({ page }) => {
    const login = new LoginActions(page);
    await login.withoutCheckbox(manager.email!, manager.password!);
  });

  test('Test case 4: Verify error on invalid email ', async ({ page }) => {
    const login = new LoginActions(page);
    await login.invalidEmail('invalid-email', manager.password!);
  });

  test('Test case 5: Verify error message on incorrect password', async ({ page }) => {
    const login = new LoginActions(page);
    await login.incorrectPassword(manager.email!, 'WrongPass123!');
  });

  test('Test case 6: Verify login after correcting incorrect email or password', async ({ page }) => {
    const login = new LoginActions(page);
    await login.loginWithRetryWithoutOtp('wrong@example.com', 'WrongPass123!', manager.email!, manager.password!);
  });

  test('Test case 7: Verify OTP is sent after successful login attempt', async ({ page }) => {
    const login = new LoginActions(page);
    await login.verifyOtp(manager.email!, manager.password!, manager.otpSecret!);
  });

  test('Test case 8: Verify OTP functionality on valid OTP input', async ({ page }) => {
    const login = new LoginActions(page);
    await login.verifyValidOtp(manager.email!, manager.password!, manager.otpSecret!);
  });

  test('Test case 9: Verify OTP error on invalid OTP input', async ({ page }) => {
    const login = new LoginActions(page);
    await login.invalidOtp(manager.email!, manager.password!, '123456');
  });

  test('Test case 10: Verify "Forgot Password" functionality (email input)', async ({ page }) => {
    const login = new LoginActions(page);
    await login.forgetPasswordWithoutOtp(manager.email!);
  });

 test('Test case 11: Verify "Forgot Password" functionality with wrong (email input)', async ({ page }) => {
    const login = new LoginActions(page);
    await login.forgetPasswordWithIncorrectEmail();
  });

  test('Test case 12: Verify "Forgot Password" functionality without (email input)', async ({ page }) => {
    const login = new LoginActions(page);
    await login.forgetPasswordWithoutEmail();
  });

  test('Test case 13: Verify OTP is sent after "Forgot Password"', async ({ page }) => {
    const login = new LoginActions(page);
    await login.verifyOtpSentAfterForgotPassword(manager.email!, manager.otpSecret!);
  });
  
  test('Test case 15: Verify error on invalid email in "Forgot Password"', async ({ page }) => {
    const login = new LoginActions(page);
    await login.forgetPasswordWithInvalidEmail();
  });
  // test('Test case 16: Verify password visibility toggle on "Forgot Password" new password page', async ({ page }) => {
  //   const login = new LoginActions(page);
  //   await login.togglePasswordVisibilityOnNewPasswordPage(manager.email!, 'Jahanzaib@123');
  // });
  test('Test case 22: Verify proper placeholder text is shown in each input field', async ({ page }) => {
    const login = new LoginActions(page);
    await login.verifyLoginPlaceholder();
  });

  test('Empty email', async ({ page }) => {
    const login = new LoginActions(page);
    await login.emptyEmail(manager.password!);
  });

  test('Empty password', async ({ page }) => {
    const login = new LoginActions(page);
    await login.emptyPassword(manager.email!);
  });

  test('Test case 21: Verify validation triggers when "Sign In" button is clicked', async ({ page }) => {
    const login = new LoginActions(page);
    await login.emptyEmailAndPassword();
  });

  test('OTP shorter/longer than expected', async ({ page }) => {
    const login = new LoginActions(page);
    await login.invalidOtpLength(manager.email!, manager.password!, '12'); // Short OTP example
  });
});
