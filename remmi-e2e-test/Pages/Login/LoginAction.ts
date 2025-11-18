import { Page, expect, test, Locator } from '@playwright/test';
import { LocatorLogin } from './LoginLocators';
import { generateOtp } from '../../../helper/getOtp';
import { LoginMessages } from './LoginMessages';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * LoginActions class for handling login operations and validation steps.
 */
export class LoginActions {
  private locators: LocatorLogin;

  constructor(private page: Page) {
    this.locators = new LocatorLogin(this.page);
  }

  async gotoLogin() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  async fillCredentials(email: string, password: string) {
    await this.locators.emailField().fill(email);
    await expect(this.locators.emailField()).toHaveValue(email);
    await this.locators.passwordField().fill(password);
    await expect(this.locators.passwordField()).toHaveValue(password);
  }

  async acceptTerms() {
    await this.locators.termsCheckbox().scrollIntoViewIfNeeded();
    await this.locators.termsCheckbox().click();
  }

  async clickSignIn() {
    await this.locators.signInButton().click({ force: true });
  }

  async fillOtp(otp: string) {
    const otpInputs = this.locators.otpField();
    for (let i = 0; i < otp.length; i++) {
      await otpInputs.nth(i).fill(otp[i]);
    }
  }

  async fillForgotPasswordOtp(otp: string) {
    const otpInput = this.locators.otpField();
    console.log('Total OTP fields:', await otpInput.count());
    console.log('OTP:', otp);

    for (let i = 0; i < otp.length; i++) {
      console.log(`Filling index ${i} with ${otp[i]}`);
      await otpInput.nth(i).fill(otp[i]);
    }
  }

  async clickContinue() {
    await this.locators.continueButton().click({ force: true });
  }

  /**
   * General login flow; customizable for different paths.
   */
  async loginFlow({
    email,
    password,
    otpSecret,
    expectSuccess = true,
    skipTerms = false,
    skipOtp = false,
    customOtp,
    expectUrl,
  }: {
    email: string;
    password: string;
    otpSecret?: string;
    expectSuccess?: boolean;
    skipTerms?: boolean;
    skipOtp?: boolean;
    customOtp?: string;
    expectUrl?: string;
  }) {
    await this.gotoLogin();

    await test.step('Enter credentials', async () => {
      await this.fillCredentials(email, password);
    });

    if (!skipTerms) {
      await test.step('Accept terms and click Sign In', async () => {
        await this.acceptTerms();
        await this.clickSignIn();
      });
    } else {
      await this.clickSignIn();
    }

    if (!skipOtp) {
      await test.step('Enter OTP', async () => {
        const otp = customOtp ?? (otpSecret ? generateOtp(otpSecret) : '');
        if (otp) await this.fillOtp(otp);
        await this.clickContinue();
      });
    }

    if (expectSuccess) {
      const dashboardUrl = expectUrl ?? (this.page.context() as any)._options.baseURL ?? '/';

      await this.page.waitForURL(
        url => !url.pathname.endsWith('/login'),
        { timeout: 30000 }
      );

      const dashboardElement = this.page.locator("//img[@src='assets/img/dashboadIcon/home.svg']");
      await dashboardElement.waitFor({ timeout: 30000 });

      await expect(this.page).toHaveURL(dashboardUrl, { timeout: 30000 });
    }
  }
  
  async loginFlowwithoutOTP({
    email,
    password,
    otpSecret,
    expectSuccess = true,
    skipTerms = false,
    skipOtp = false,
    customOtp,
    expectUrl,
  }: {
    email: string;
    password: string;
    otpSecret?: string;
    expectSuccess?: boolean;
    skipTerms?: boolean;
    skipOtp?: boolean;
    customOtp?: string;
    expectUrl?: string;
  }) {
    await this.gotoLogin();

    await test.step('Enter credentials', async () => {
      await this.fillCredentials(email, password);
    });

    if (!skipTerms) {
      await test.step('Accept terms and click Sign In', async () => {
        await this.acceptTerms();
        await this.clickSignIn();
      });
    } else {
      await this.clickSignIn();
    }


    if (expectSuccess) {
      const dashboardUrl = expectUrl ?? (this.page.context() as any)._options.baseURL ?? '/';

      await this.page.waitForURL(
        url => !url.pathname.endsWith('/login'),
        { timeout: 30000 }
      );

      const dashboardElement = this.page.locator("//img[@src='assets/img/dashboadIcon/home.svg']");
      await dashboardElement.waitFor({ timeout: 30000 });

      await expect(this.page).toHaveURL(dashboardUrl, { timeout: 30000 });
    }
  }


  async login(email: string, password: string, otpSecret: string) {
    await this.loginFlow({ email, password, otpSecret });
  }

  async loginwithoutOTp(email: string, password: string) {
    await this.loginFlowwithoutOTP({ email, password });
  }

  async togglePasswordVisibility(email: string, password: string) {
    await this.gotoLogin();
    await this.fillCredentials(email, password);

    await this.locators.eyeIcon().click();
    await expect(this.locators.passwordField()).toHaveAttribute('type', 'text');
    await this.locators.eyeIcon().click();
    await expect(this.locators.passwordField()).toHaveAttribute('type', 'password');
  }

  async withoutCheckbox(email: string, password: string) {
    await this.gotoLogin();
    await this.fillCredentials(email, password);
    await this.clickSignIn();
    await expect(this.page.getByText(LoginMessages.termsNotAccepted, { exact: false })).toBeVisible();
  }

  async invalidEmail(invalidEmail: string, password: string) {
    await this.gotoLogin();
    await this.fillCredentials(invalidEmail, password);
    await this.acceptTerms();
    await this.clickSignIn();
    await expect(this.page.getByText(/invalid email/i)).toBeVisible();
  }

  async incorrectPassword(email: string, incorrectPassword: string) {
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
    password: string
  ) {
    await this.gotoLogin();

    await this.fillCredentials(incorrectEmail, incorrectPassword);
    await this.acceptTerms();
    await this.clickSignIn();
    await expect(this.page.getByText(LoginMessages.incorrect_Email_Password, { exact: false })).toBeVisible();

    await this.fillCredentials(email, password);
    await this.acceptTerms();
    await this.clickSignIn();
  }

  async verifyOtp(email: string, password: string, otpSecret: string) {
    await this.loginFlow({ email, password, otpSecret, expectSuccess: false });
  }

  async verifyValidOtp(email: string, password: string, otpSecret: string) {
    await this.loginFlow({ email, password, otpSecret, expectSuccess: false });
  }

  async invalidOtp(email: string, password: string, invalidOtp: string) {
    await this.loginFlow({
      email,
      password,
      skipOtp: true,
      expectSuccess: false,
    });

    await this.fillOtp(invalidOtp);
    await this.clickContinue();
    await expect(this.page.getByText(LoginMessages.otpIncorrect, { exact: false })).toBeVisible();
  }

  async forgetPasswordWithoutOtp(email: string) {
    await this.gotoLogin();
    await this.locators.forgetPasswordLink().click();
    await this.locators.resetEmailField().fill(email);

    if (typeof this.locators.continueResetButton === 'function') {
      await this.locators.continueResetButton().click();
    }
    await expect(this.page.getByText(LoginMessages.otpPageHeader, { exact: false })).toBeVisible();

    if (typeof this.locators.continueOtpButton === 'function') {
      await this.locators.continueOtpButton().scrollIntoViewIfNeeded();
      await this.locators.continueOtpButton().click();
    }
    await expect(this.page.getByText(LoginMessages.otpRequired, { exact: false })).toBeVisible();
  }

  async verifyLoginPlaceholder() {
    await this.gotoLogin();
    await expect(this.locators.emailField()).toHaveAttribute('placeholder', LoginMessages.emailPlaceholder);
    await expect(this.locators.passwordField()).toHaveAttribute('placeholder', LoginMessages.passwordPlaceholder);
  }

  async emptyEmail(password: string) {
    await this.gotoLogin();
    await this.locators.passwordField().fill(password);
    await this.acceptTerms();
    await this.clickSignIn();
    await expect(this.page.getByText(LoginMessages.emptyEmail, { exact: false })).toBeVisible();
  }

  async emptyPassword(email: string) {
    await this.gotoLogin();
    await this.locators.emailField().fill(email);
    await this.acceptTerms();
    await this.clickSignIn();
    await expect(this.page.getByText(LoginMessages.emptyPassword, { exact: false })).toBeVisible();
  }

  async invalidOtpLength(email: string, password: string, otp: string) {
    await this.loginFlow({
      email,
      password,
      skipOtp: true,
      expectSuccess: false,
    });

    await this.fillOtp(otp);
    await this.clickContinue();
    await expect(this.page.getByText(LoginMessages.otpIncorrect, { exact: false })).toBeVisible();
  }

  async emptyEmailAndPassword() {
    await this.gotoLogin();
    await this.acceptTerms();
    await this.clickSignIn();
    await expect(this.page.getByText(LoginMessages.emptyEmail, { exact: false })).toBeVisible();
    await expect(this.page.getByText(LoginMessages.emptyPassword, { exact: false })).toBeVisible();
  }

  async forgetPasswordWithIncorrectEmail() {
    await this.gotoLogin();
    await this.locators.forgetPasswordLink().click();
    await this.locators.resetEmailField().fill('invalid email');
    await this.locators.continueResetButton().click();
    await this.locators.continueOtpButton().click();
    await expect(this.page.getByText('This email address is not registered', { exact: false })).toBeVisible();
  }

  async forgetPasswordWithoutEmail() {
    await this.gotoLogin();
    await this.locators.forgetPasswordLink().click();
    await this.locators.continueResetButton().click();
    await this.locators.continueOtpButton().click();
    await expect(this.page.getByText('Email is required', { exact: false })).toBeVisible();
  }

  async verifyOtpSentAfterForgotPassword(email: string, otpSecret: string) {
    await this.gotoLogin();
    await this.locators.forgetPasswordLink().click();
    await this.locators.resetEmailField().fill(email);
    await this.locators.continueResetButton().click();
    await expect(
      this.page.getByText(/We sent an OTP code to your email/i, { exact: false })
    ).toBeVisible();
    // Enter the OTP
    const otp = generateOtp(otpSecret)
    await this.fillForgotPasswordOtp(otp);
  }

  async forgetPasswordWithInvalidEmail() {
    await this.gotoLogin();
    await this.locators.forgetPasswordLink().click();
    await this.locators.resetEmailField().fill('invalid-email @');
    await this.locators.continueResetButton().click();
    await expect(this.page.getByText('This email address is not registered', { exact: false })).toBeVisible();
  }

  // Verify password visibility toggle on "Forgot Password" new password page


  // Verify new password is accepted after entering valid OTP

  // Verify redirection to login page after setting new password

  // Verify OTP after entering new password in "Forgot Password" flow

  // Verify login functionality after "Forgot Password" with valid OTP

  // Verify validation triggers when "Sign In" button is clicked

}

