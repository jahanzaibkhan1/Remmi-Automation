import { Page, expect, test } from '@playwright/test';
import { BasePage } from '../common/BasePage';
import { LocatorLogin } from './LoginLocators';
import { LoginMessages } from './LoginMessages';
import { generateOtp } from '../../helpers/getOtp';
import * as fs from 'fs';
import * as path from 'path';

const DASHBOARD_URL = process.env.DASHBOARD_URL ?? 'https://portal-staging.remmi.com.au/dashboard';
const DEFAULT_SESSION_PATH = path.join(__dirname, '../../sessions/manager-session.json');

export class LoginPage extends BasePage {
  private readonly locators: LocatorLogin;

  constructor(page: Page) {
    super(page);
    this.locators = new LocatorLogin(page);
  }

  // ---------------------------------------------------------------------------
  // Primitives
  // ---------------------------------------------------------------------------

  async gotoLogin(): Promise<void> {
    await this.page.goto('/login', { waitUntil: 'domcontentloaded', timeout: BasePage.TIMEOUT_XLONG });
  }

  async fillCredentials(email: string, password: string): Promise<void> {
    await this.fillAndVerify(this.locators.emailField(), email);
    await this.fillAndVerify(this.locators.passwordField(), password);
  }

  async acceptTerms(): Promise<void> {
    await this.locators.termsCheckbox().scrollIntoViewIfNeeded();
    await this.locators.termsCheckbox().click();
  }

  async clickSignIn(): Promise<void> {
    await this.clickWhenReady(this.locators.signInButton());
  }

  async fillOtp(otp: string): Promise<void> {
    const otpInputs = this.locators.otpField();
    for (let i = 0; i < otp.length; i++) {
      await otpInputs.nth(i).fill(otp[i]);
    }
  }

  async clickContinue(): Promise<void> {
    await this.clickWhenReady(this.locators.continueButton());
  }

  // ---------------------------------------------------------------------------
  // Core login flow
  // ---------------------------------------------------------------------------

  /**
   * Full login flow. Only saves session state when the login is expected to succeed
   * AND navigation to the dashboard is confirmed — never on negative tests.
   */
  async loginFlow({
    email,
    password,
    otpSecret,
    expectSuccess = true,
    skipOtp = false,
    customOtp,
    saveSessionPath,
  }: {
    email: string;
    password: string;
    otpSecret?: string;
    expectSuccess?: boolean;
    skipOtp?: boolean;
    customOtp?: string;
    saveSessionPath?: string;
  }): Promise<void> {
    await this.gotoLogin();

    await test.step('Fill credentials', async () => {
      await this.fillCredentials(email, password);
    });

    await test.step('Accept terms and sign in', async () => {
      await this.acceptTerms();
      await this.clickSignIn();
    });

    if (!skipOtp) {
      await test.step('Enter OTP', async () => {
        const otp = customOtp ?? (otpSecret ? generateOtp(otpSecret) : '');
        if (otp) await this.fillOtp(otp);
        await this.clickContinue();
      });
    }

    if (expectSuccess) {
      await test.step('Verify dashboard reached', async () => {
        await this.page.waitForURL(url => !url.pathname.endsWith('/login'), {
          timeout: BasePage.TIMEOUT_LONG,
        });
        await expect(this.page.locator(
          '[data-testid="dashboard-home"], img[src*="home.svg"], img[alt*="home" i]'
        )).toBeVisible({ timeout: BasePage.TIMEOUT_LONG });
      });

      // Only save session after confirmed navigation to dashboard
      const target = saveSessionPath ?? DEFAULT_SESSION_PATH;
      const dir = path.dirname(target);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      await this.page.context().storageState({ path: target });
    }
  }

  /**
   * Shorthand used by session setup — always expects success.
   */
  async login(email: string, password: string, otpSecret: string, saveSessionPath?: string): Promise<void> {
    await this.loginFlow({ email, password, otpSecret, saveSessionPath });
  }

  // ---------------------------------------------------------------------------
  // Individual test-scenario methods
  // ---------------------------------------------------------------------------

  async togglePasswordVisibility(email: string, password: string): Promise<void> {
    await this.gotoLogin();
    await this.fillCredentials(email, password);
    await this.locators.eyeIcon().click();
    await expect(this.locators.passwordField()).toHaveAttribute('type', 'text');
    await this.locators.eyeIcon().click();
    await expect(this.locators.passwordField()).toHaveAttribute('type', 'password');
  }

  async withoutCheckbox(email: string, password: string): Promise<void> {
    await this.gotoLogin();
    await this.fillCredentials(email, password);
    await this.clickSignIn();
    await expect(this.page.getByText(LoginMessages.termsNotAccepted, { exact: false })).toBeVisible();
  }

  async invalidEmail(invalidEmail: string, password: string): Promise<void> {
    await this.gotoLogin();
    await this.fillCredentials(invalidEmail, password);
    await this.acceptTerms();
    await this.clickSignIn();
    await expect(this.page.getByText(LoginMessages.incorrectEmail, { exact: false })).toBeVisible();
  }

  async incorrectPassword(email: string, incorrectPassword: string): Promise<void> {
    await this.gotoLogin();
    await this.fillCredentials(email, incorrectPassword);
    await this.acceptTerms();
    await this.clickSignIn();
    await expect(this.page.getByText(LoginMessages.incorrectPassword, { exact: false })).toBeVisible();
  }

  async loginWithRetryWithoutOtp(
    incorrectEmail: string,
    incorrectPassword: string,
    email: string,
    password: string,
  ): Promise<void> {
    await this.gotoLogin();
    await this.fillCredentials(incorrectEmail, incorrectPassword);
    await this.acceptTerms();
    await this.clickSignIn();
    await expect(this.page.getByText(LoginMessages.incorrect_Email_Password, { exact: false })).toBeVisible();

    await this.fillCredentials(email, password);
    await this.acceptTerms();
    await this.clickSignIn();
    // Wait for navigation away from login before asserting success
    await this.page.waitForURL(url => !url.pathname.endsWith('/login'), {
      timeout: BasePage.TIMEOUT_LONG,
    });
  }

  async verifyOtp(email: string, password: string, otpSecret: string): Promise<void> {
    await this.loginFlow({ email, password, otpSecret, expectSuccess: false });
  }

  async verifyValidOtp(email: string, password: string, otpSecret: string): Promise<void> {
    await this.loginFlow({ email, password, otpSecret, expectSuccess: false });
  }

  async invalidOtp(email: string, password: string, invalidOtp: string): Promise<void> {
    await this.loginFlow({ email, password, skipOtp: true, expectSuccess: false });
    await this.fillOtp(invalidOtp);
    await this.clickContinue();
    await expect(this.page.getByText(LoginMessages.otpIncorrect, { exact: false })).toBeVisible();
  }

  async invalidOtpLength(email: string, password: string, otp: string): Promise<void> {
    await this.loginFlow({ email, password, skipOtp: false, expectSuccess: false });
    await this.fillOtp(otp);
    await this.clickContinue();
    await expect(this.page.getByText(LoginMessages.otpIncorrect, { exact: false })).toBeVisible();
  }

  async verifyLoginPlaceholder(): Promise<void> {
    await this.gotoLogin();
    await expect(this.locators.emailField()).toHaveAttribute('placeholder', LoginMessages.emailPlaceholder);
    await expect(this.locators.passwordField()).toHaveAttribute('placeholder', LoginMessages.passwordPlaceholder);
  }

  async emptyEmail(password: string): Promise<void> {
    await this.gotoLogin();
    await this.locators.passwordField().fill(password);
    await this.acceptTerms();
    await this.clickSignIn();
    await expect(this.page.getByText(LoginMessages.emptyEmail, { exact: false })).toBeVisible();
  }

  async emptyPassword(email: string): Promise<void> {
    await this.gotoLogin();
    await this.locators.emailField().fill(email);
    await this.acceptTerms();
    await this.clickSignIn();
    await expect(this.page.getByText(LoginMessages.emptyPassword, { exact: false })).toBeVisible();
  }

  async emptyEmailAndPassword(): Promise<void> {
    await this.gotoLogin();
    await this.acceptTerms();
    await this.clickSignIn();
    await expect(this.page.getByText(LoginMessages.emptyEmail, { exact: false })).toBeVisible();
    await expect(this.page.getByText(LoginMessages.emptyPassword, { exact: false })).toBeVisible();
  }

  // ---------------------------------------------------------------------------
  // Forgot password flows
  // ---------------------------------------------------------------------------

  async forgetPasswordWithoutOtp(email: string): Promise<void> {
    await this.gotoLogin();
    await this.locators.forgetPasswordLink().click();
    await this.locators.resetEmailField().fill(email);
    await this.locators.continueResetButton().click();
    await expect(this.page.getByText(LoginMessages.otpPageHeader, { exact: false })).toBeVisible();
    await this.locators.continueOtpButton().scrollIntoViewIfNeeded();
    await this.locators.continueOtpButton().click();
    await expect(this.page.getByText(LoginMessages.otpRequired, { exact: false })).toBeVisible();
  }

  async verifyOtpSentAfterForgotPassword(email: string, otpSecret: string): Promise<void> {
    await this.gotoLogin();
    await this.locators.forgetPasswordLink().click();
    await this.locators.resetEmailField().fill(email);
    await this.locators.continueResetButton().click();
    await expect(this.page.getByText(LoginMessages.otpPageHeader, { exact: false })).toBeVisible();
    const otp = generateOtp(otpSecret);
    await this.fillForgotPasswordOtp(otp);
  }

  async forgetPasswordWithIncorrectEmail(): Promise<void> {
    await this.gotoLogin();
    await this.locators.forgetPasswordLink().click();
    await this.locators.resetEmailField().fill('invalid email');
    await this.locators.continueResetButton().click();
    await this.locators.continueOtpButton().click();
    await expect(this.page.getByText(LoginMessages.emailNotRegistered, { exact: false })).toBeVisible();
  }

  async forgetPasswordWithoutEmail(): Promise<void> {
    await this.gotoLogin();
    await this.locators.forgetPasswordLink().click();
    await this.locators.continueResetButton().click();
    await this.locators.continueOtpButton().click();
    await expect(this.page.getByText(LoginMessages.emptyEmail, { exact: false })).toBeVisible();
  }

  async forgetPasswordWithInvalidEmail(): Promise<void> {
    await this.gotoLogin();
    await this.locators.forgetPasswordLink().click();
    await this.locators.resetEmailField().fill('invalid-email @');
    await this.locators.continueResetButton().click();
    await expect(this.page.getByText(LoginMessages.emailNotRegistered, { exact: false })).toBeVisible();
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private async fillForgotPasswordOtp(otp: string): Promise<void> {
    const otpInput = this.locators.otpField();
    for (let i = 0; i < otp.length; i++) {
      await otpInput.nth(i).fill(otp[i]);
    }
  }
}
