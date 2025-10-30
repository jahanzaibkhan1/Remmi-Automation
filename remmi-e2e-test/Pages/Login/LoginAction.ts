import { Page, expect, test, Locator } from '@playwright/test';
import { LocatorLogin } from './LoginLocators';
import { generateOtp } from '../../../helper/getOtp';
import { LoginMessages } from './LoginMessages';

/**
 * LoginActions class implements all necessary login and validation actions.
 * Compatible with cross-browser testing via Playwright.
 */
export class LoginActions {
  private locators: LocatorLogin;

  constructor(private page: Page) {
    this.locators = new LocatorLogin(this.page);
  }

  /** Navigate to login page. Uses standard Playwright navigation. */
  async gotoLogin() {
    await this.page.goto('/login');
    await this.page.waitForLoadState('networkidle');
  }

  /** Fill email and password fields. Ensures compatibility by using role and text selectors. */
  async fillCredentials(email: string, password: string) {
    await this.locators.emailField().fill(email);
    await expect(this.locators.emailField()).toHaveValue(email);

    await this.locators.passwordField().fill(password);
    await expect(this.locators.passwordField()).toHaveValue(password);
  }

  /** Accept terms checkbox using partial text match. */
  async acceptTerms() {
    await this.locators.termsCheckbox().scrollIntoViewIfNeeded();
    await this.locators.termsCheckbox().click();
  }

  /** Click sign in button using accessible role. */
  async clickSignIn() {
    await this.locators.signInButton().click({force:true});
  }

  /** Fill OTP fields (input[type='*']). */
  async fillOtp(otp: string) {
    const otpInputs = this.locators.otpField();
    for (let i = 0; i < otp.length; i++) {
      await otpInputs.nth(i).fill(otp[i]);
    }
  }

  /** Click continue button (after OTP), robust for cross-browser. */
  async clickContinue() {
    await this.locators.continueButton().dblclick({force: true});
  }

  /**
   * General login flow with options and cross-browser Playwright steps.
   * Relies on role/text selectors which are more robust across browsers.
   * Ensures after successful login, navigation goes to dashboard/base url.
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
  
      // Wait longer for WebKit, 30s timeout
      await this.page.waitForURL(
        (url) => !url.pathname.endsWith('/login'),
        { timeout: 30000 }
      );
  
      // Wait for a dashboard-specific element to be visible
      const dashboardElement = this.page.locator("//img[@src='assets/img/dashboadIcon/home.svg']"); 
      await dashboardElement.waitFor({ timeout: 30000 });
      
      // Finally verify URL (give extra timeout for WebKit)
      await expect(this.page).toHaveURL(dashboardUrl, { timeout: 30000 });
    }
  }
  
  /** Successful login with OTP */
  async login(email: string, password: string, otpSecret: string) {
    await this.loginFlow({ email, password, otpSecret });
  }

  /** Toggle password visibility (cross-browser: "type" attribute always applies). */
  async togglePasswordVisibility(email: string, password: string) {
    await this.gotoLogin();
    await this.fillCredentials(email, password);

    // Toggle ON
    await this.locators.eyeIcon().click();
    await expect(this.locators.passwordField()).toHaveAttribute('type', 'text');

    // Toggle OFF
    await this.locators.eyeIcon().click();
    await expect(this.locators.passwordField()).toHaveAttribute('type', 'password');
  }

  /** Login without accepting terms */
  async withoutCheckbox(email: string, password: string) {
    await this.gotoLogin();
    await this.fillCredentials(email, password);
    await this.clickSignIn();

    const errorMessage = this.page.getByText(LoginMessages.termsNotAccepted, { exact: false });
    await expect(errorMessage).toBeVisible();
  }

  /** Invalid email format check; uses regexp selector to maximize robustness. */
  async invalidEmail(invalidEmail: string, password: string) {
    await this.gotoLogin();
    await this.fillCredentials(invalidEmail, password);
    await this.acceptTerms();
    await this.clickSignIn();

    const errorMessage = this.page.getByText(/invalid email/i);
    await expect(errorMessage).toBeVisible();
  }

  /** Incorrect password validation. */
  async incorrectPassword(email: string, incorrectPassword: string) {
    await this.gotoLogin();
    await this.fillCredentials(email, incorrectPassword);
    await this.acceptTerms();
    await this.clickSignIn();

    const errorMessage = this.page.getByText(LoginMessages.incorrectPassword, { exact: false });
    await expect(errorMessage).toBeVisible();
  }

  /** Retry login without OTP. */
  async loginWithRetryWithoutOtp(
    incorrectEmail: string,
    incorrectPassword: string,
    email: string,
    password: string
  ) {
    await this.gotoLogin();

    // First attempt with invalid credentials
    await this.fillCredentials(incorrectEmail, incorrectPassword);
    await this.acceptTerms();
    await this.clickSignIn();

    await expect(this.page.getByText(LoginMessages.incorrect_Email_Password, { exact: false })).toBeVisible();

    // Retry with correct credentials
    await this.fillCredentials(email, password);
    await this.acceptTerms();
    await this.clickSignIn();
  }

  /** OTP page verification step. */
  async verifyOtp(email: string, password: string, otpSecret: string) {
    await this.loginFlow({ email, password, otpSecret, expectSuccess: false });
  }

   /** OTP page verification step. */
   async verifyValidOtp(email: string, password: string, otpSecret: string) {
    await this.loginFlow({ email, password, otpSecret, expectSuccess: false });
  }

  /** Use invalid OTP and check for error. */
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

  /** Forgot Password flow without entering OTP.
   * The continueResetButton and continueOtpButton must be implemented in LocatorLogin
   * for full cross-browser robustness.
   */
  async forgetPasswordWithoutOtp(email: string) {
    await this.gotoLogin();
    await this.locators.forgetPasswordLink().click();
    await this.locators.resetEmailField().fill(email);

    // These locators should use role/text or CSS selectors that are robust across browsers.
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

  /** Verify placeholders: check attribute presence for accessible placeholder values. */
  async verifyLoginPlaceholder() {
    await this.gotoLogin();
    await expect(this.locators.emailField()).toHaveAttribute('placeholder', LoginMessages.emailPlaceholder);
    await expect(this.locators.passwordField()).toHaveAttribute('placeholder', LoginMessages.passwordPlaceholder);
  }

  /** Edge case: empty email, cross-browser safe. */
  async emptyEmail(password: string) {
    await this.gotoLogin();
    await this.locators.passwordField().fill(password);
    await this.acceptTerms();
    await this.clickSignIn();
    await expect(this.page.getByText(LoginMessages.emptyEmail, { exact: false })).toBeVisible();
  }

  /** Edge case: empty password, cross-browser safe. */
  async emptyPassword(email: string) {
    await this.gotoLogin();
    await this.locators.emailField().fill(email);
    await this.acceptTerms();
    await this.clickSignIn();
    await expect(this.page.getByText(LoginMessages.emptyPassword, { exact: false })).toBeVisible();
  }

  /** Edge case: OTP shorter/longer than expected. */
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

  /** Both Email and Password empty (mandatory fields). */
  async emptyEmailAndPassword() {
    await this.gotoLogin();
    await this.acceptTerms();
    await this.clickSignIn();
    await expect(this.page.getByText(LoginMessages.emptyEmail, { exact: false })).toBeVisible();
    await expect(this.page.getByText(LoginMessages.emptyPassword, { exact: false })).toBeVisible();
  }
  /**
   * Verify "Forgot Password" functionality when providing an email
   */
  async forgetPasswordWithIncorrectEmail() {
    await this.gotoLogin();
    await this.locators.forgetPasswordLink().click();
    await this.locators.resetEmailField().fill('invalid email');

    await this.locators.continueResetButton().click();
    await this.locators.continueOtpButton().click();
    await expect(this.page.getByText('This email address is not registered', { exact: false })).toBeVisible();
  }
  // Verify "Forgot Password" functionality without (email input)
  async forgetPasswordWithoutEmail() {
    await this.gotoLogin();
    await this.locators.forgetPasswordLink().click();
    await this.locators.continueResetButton().click();
    await this.locators.continueOtpButton().click();
    await expect(this.page.getByText('Email is required', { exact: false })).toBeVisible();
  }
  // Verify OTP is sent after "Forgot Password", ab yeah google authenticator say verify kerni hy 

  // Verify session timeout after OTP is sent

  // Verify error on invalid email in "Forgot Password"

  // Verify password visibility toggle on "Forgot Password" new password page

  // Verify new password is accepted after entering valid OTP

  // Verify redirection to login page after setting new password

  // Verify OTP after entering new password in "Forgot Password" flow

  // Verify login functionality after "Forgot Password" with valid OTP

  // Verify validation triggers when "Sign In" button is clicked

}
