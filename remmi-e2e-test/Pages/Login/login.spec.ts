import { test } from '@playwright/test';
import { LoginActions } from './LoginAction';
import { LoginUsers } from '../../fixture/test-data';

const manager = LoginUsers.manager;
const sales = LoginUsers.sales;
const admin= LoginUsers.admin;

test.describe('Login Tests - Remmi E2E', () => {
  // test 1
  test('Successful login with OTP', async ({ page }) => {
    const login = new LoginActions(page);
    await login.login(manager.email!, manager.password!, manager.otpSecret!);
  });

  // test 2
  test('Verify OTP during login', async ({ page }) => {
    const login = new LoginActions(page);
    await login.verifyOtp(manager.email!, manager.password!, manager.otpSecret!);
  });

  // test 3
  test('Verify login placeholders', async ({ page }) => {
    const login = new LoginActions(page);
    await login.verifyLoginPlaceholder();
  });

  // test 4
  test('Toggle password visibility', async ({ page }) => {
    const login = new LoginActions(page);
    await login.togglePasswordVisibility(manager.email!, manager.password!);
  });

  // test 5
  test('Login without accepting terms', async ({ page }) => {
    const login = new LoginActions(page);
    await login.withoutCheckbox(manager.email!, manager.password!);
  });

  // test 6
  test('Invalid email format', async ({ page }) => {
    const login = new LoginActions(page);
    await login.invalidEmail('invalid-email', manager.password!);
  });

  // test 7
  test('Incorrect password', async ({ page }) => {
    const login = new LoginActions(page);
    await login.incorrectPassword(manager.email!, 'WrongPass123!');
  });

  // test 8
  test('Retry login after failed attempt', async ({ page }) => {
    const login = new LoginActions(page);
    await login.loginWithRetryWithoutOtp('wrong@example.com', 'WrongPass123!', manager.email!, manager.password!);
  });

  // test 9
  test('Login with invalid OTP', async ({ page }) => {
    const login = new LoginActions(page);
    await login.invalidOtp(manager.email!, manager.password!, '123456');
  });

  // test 10
  test('Forgot Password without entering OTP', async ({ page }) => {
    const login = new LoginActions(page);
    await login.forgetPasswordWithoutOtp(manager.email!);
  });

  // test 11
  test('Empty email', async ({ page }) => {
    const login = new LoginActions(page);
    await login.emptyEmail(manager.password!);
  });

  // test 12
  test('Empty password', async ({ page }) => {
    const login = new LoginActions(page);
    await login.emptyPassword(manager.email!);
  });

  // test 13
  test('Both email and password empty', async ({ page }) => {
    const login = new LoginActions(page);
    await login.emptyEmailAndPassword();
  });

  // test 14
  test('OTP shorter/longer than expected', async ({ page }) => {
    const login = new LoginActions(page);
    await login.invalidOtpLength(manager.email!, manager.password!, '12'); // Short OTP example
  });
});
