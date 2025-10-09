import { test } from '@playwright/test';
import { LoginActions } from './LoginAction';
import { LoginUsers } from '../../fixture/test-data';

const manager = LoginUsers.manager;

test.describe('Login Tests - Remmi E2E', () => {
  let login: LoginActions;

  test.beforeEach(async ({ page }) => {
    login = new LoginActions(page);

    // Skip dynamically if credentials missing
    if (!manager.email || !manager.password || !manager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }
  });

  // test 1
  test('Successful login with OTP', async () => {
    await login.login(manager.email!, manager.password!, manager.otpSecret!);
  });

  // test 2
  test('Verify OTP during login', async () => {
    await login.verifyOtp(manager.email!, manager.password!, manager.otpSecret!);
  });

  // test 3
  test('Verify login placeholders', async () => {
    await login.verifyLoginPlaceholder();
  });

  // test 4
  test('Toggle password visibility', async () => {
    await login.togglePasswordVisibility(manager.email!, manager.password!);
  });

  // test 5
  test('Login without accepting terms', async () => {
    await login.withoutCheckbox(manager.email!, manager.password!);
  });

  // test 6
  test('Invalid email format', async () => {
    await login.invalidEmail('invalid-email', manager.password!);
  });

  // test 7
  test('Incorrect password', async () => {
    await login.incorrectPassword(manager.email!, 'WrongPass123!');
  });

  // test 8
  test('Retry login after failed attempt', async () => {
    await login.loginWithRetryWithoutOtp('wrong@example.com', 'WrongPass123!', manager.email!, manager.password!);
  });

  // test 9
  test('Login with invalid OTP', async () => {
    await login.invalidOtp(manager.email!, manager.password!, '123456');
  });

  // test 10
  test('Forgot Password without entering OTP', async () => {
    await login.forgetPasswordWithoutOtp(manager.email!);
  });

  // test 11
  test('Empty email', async () => {
    await login.emptyEmail(manager.password!);
  });

  // test 12
  test('Empty password', async () => {
    await login.emptyPassword(manager.email!);
  });

  // test 13
  test('Both email and password empty', async () => {
    await login.emptyEmailAndPassword();
  });

  // test 14
  test('OTP shorter/longer than expected', async () => {
    await login.invalidOtpLength(manager.email!, manager.password!, '12'); // Short OTP example
  });
});
