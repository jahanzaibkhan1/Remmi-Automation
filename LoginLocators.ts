import { Locator, Page } from '@playwright/test';

export class LocatorLogin {
  constructor(private page: Page) {}

  /** Email input field */
  emailField(): Locator {
    return this.page.getByRole('textbox', { name: /email/i });
  }

  /** Password input field */
  passwordField(): Locator {
    return this.page.getByRole('textbox', { name: /password/i });
  }

  /** Eye icon to toggle password visibility */
  eyeIcon(): Locator {
    return this.page.locator("img.icon-close");
  }

  /** Terms & conditions checkbox with partial text match */
  termsCheckbox(): Locator {
    return this.page.getByText(/I agree to all the statements/i, { exact: false });
  }

  /** Sign in button */
  signInButton(): Locator {
    return this.page.getByRole('button', { name: /sign in/i });
  }

  /** OTP input fields */
  otpField(): Locator {
    return this.page.locator('input.otp-input');
  }

  /** Continue button (after OTP) */
  continueButton(): Locator {
    return this.page.getByRole('button', { name: /continue/i });
  }

  /** Forgot Password link */
  forgetPasswordLink(): Locator {
    return this.page.getByText(/forgot password\?/i);
  }

  /** Reset email input field */
  resetEmailField(): Locator {
    return this.page.getByRole('textbox', { name: /email/i });
  }

  /** Continue button on Reset Password */
  continueResetButton(): Locator {
    return this.page.getByRole('button', { name: /continue/i });
  }

  /** Continue button for OTP (alias for continueButton) */
  continueOtpButton(): Locator {
    return this.continueButton();
  }

  /** New password input field */
  newPasswordField(): Locator {
    return this.page.getByRole('textbox', { name: /enter your new password/i });
  }
}
