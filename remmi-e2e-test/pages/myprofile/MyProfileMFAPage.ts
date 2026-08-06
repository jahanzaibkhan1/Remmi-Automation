import { Page, expect, test } from '@playwright/test';
import * as dotenv from 'dotenv';
import { extractSecretFromQr } from '../../helpers/mfaHelper';
import { generateOtp } from '../../helpers/getOtp';
import { updateEnvVariable } from '../../helpers/updateEnvVariable';
import { MyProfileBasePage } from './MyProfileBasePage';

export class MyProfileMFAPage extends MyProfileBasePage {
  constructor(page: Page) {
    super(page);
  }

  private async navigateToMfaTab(): Promise<void> {
    const mfaTab = this.locators.mfaTab();
    await mfaTab.click();
  }

  private async clickReplaceButton(): Promise<void> {
    const replaceBtn = this.locators.replaceButton();
    await replaceBtn.click();
  }

  private async selectGoogleAuthenticator(): Promise<void> {
    const gauth = this.locators.googleAuthenticator();
    await gauth.dblclick({ force: true });
  }

  private async selectMicrosoftAuthenticator(): Promise<void> {
    const msAuth = this.locators.microsoftAuthenticator();
    await msAuth.click();
  }

  private async selectAuthyAuthenticator(): Promise<void> {
    const authyAuth = this.locators.authyAuthenticator();
    await authyAuth.click();
  }

  private async enterMfaOtp(otp: string): Promise<void> {
    const otpTextbox = this.locators.mfaCodeTextbox();
    await otpTextbox.click();
    await otpTextbox.fill(otp);
  }

  async enableGoogleAuthenticatorMfa(): Promise<void> {
    await test.step('Enable Google Authenticator MFA', async () => {
      await this.navigateToMfaTab();
      await this.clickReplaceButton();
      await this.selectGoogleAuthenticator();

      const googleRadioButton = this.page.locator('.p-radiobutton-icon').first();
      await googleRadioButton.click();

      const alreadyEnabled = this.page.getByRole('alert', { name: 'This MFA already enabled' });
      let isAlreadyEnabled = false;
      try { isAlreadyEnabled = await alreadyEnabled.isVisible({ timeout: 3000 }); } catch { isAlreadyEnabled = false; }

      if (isAlreadyEnabled) return;

      await this.page.waitForTimeout(2000);

      const qrImage = this.page.locator("//div[@class='rqcode']//img");
      const qrVisible = await qrImage.isVisible({ timeout: 5000 }).catch(() => false);
      if (!qrVisible) throw new Error('QR code for Google MFA not visible.');

      const qrSrc = await qrImage.getAttribute('src');
      if (!qrSrc) throw new Error('Unable to find QR code src for Google MFA');

      const qrExtract = await extractSecretFromQr(qrSrc);
      if (!qrExtract?.secret) throw new Error('Failed to extract Google MFA secret');

      const otp = generateOtp(qrExtract.secret);
      await this.enterMfaOtp(otp);

      const saveButton = this.page.getByRole('button', { name: 'Save' });
      await saveButton.click({ force: true });

      const mfaEnabledToast = this.page.getByRole('alert', { name: /MFA enabled successfully/i });
      await expect(mfaEnabledToast).toBeVisible({ timeout: 8000 });
      await mfaEnabledToast.waitFor({ state: 'hidden', timeout: 70000 });

      updateEnvVariable('E2E_MANAGER_MICROSOFT_SECRET', '');
      updateEnvVariable('E2E_MANAGER_AUTHY_SECRET', '');
      updateEnvVariable('E2E_MANAGER_GOOGLE_SECRET', qrExtract.secret);
      updateEnvVariable('E2E_MANAGER_OTP_SECRET', qrExtract.secret);

      process.env.E2E_MANAGER_OTP_SECRET = qrExtract.secret;
      dotenv.config();
    });
  }

  async enableMicrosoftAuthenticatorMfa(): Promise<void> {
    await test.step('Enable Microsoft Authenticator MFA', async () => {
      await this.navigateToMfaTab();
      await this.page.waitForTimeout(1000);
      await this.clickReplaceButton();
      await this.selectMicrosoftAuthenticator();

      const msRadioButton = this.page.locator('.p-radiobutton-box.p-highlight > .p-radiobutton-icon');
      await msRadioButton.click();

      const alreadyEnabled = this.page.getByRole('alert', { name: 'This MFA already enabled' });
      let isAlreadyEnabled = false;
      try { isAlreadyEnabled = await alreadyEnabled.isVisible({ timeout: 3000 }); } catch { isAlreadyEnabled = false; }

      if (isAlreadyEnabled) return;

      await this.page.waitForTimeout(2000);

      const qrImage = this.page.locator("//div[@class='rqcode']//img");
      const qrVisible = await qrImage.isVisible({ timeout: 5000 }).catch(() => false);
      if (!qrVisible) throw new Error('QR code for Microsoft MFA not visible.');

      const qrSrc = await qrImage.getAttribute('src');
      if (!qrSrc) throw new Error('Unable to find QR code src for Microsoft MFA');

      const qrExtract = await extractSecretFromQr(qrSrc);
      if (!qrExtract?.secret) throw new Error('Failed to extract Microsoft MFA secret');

      const otp = generateOtp(qrExtract.secret);
      await this.enterMfaOtp(otp);

      const saveButton = this.page.getByRole('button', { name: 'Save' });
      await saveButton.click({ force: true });

      const mfaEnabledToast = this.page.getByRole('alert', { name: /MFA enabled successfully/i });
      await expect(mfaEnabledToast).toBeVisible({ timeout: 6000 });
      await mfaEnabledToast.waitFor({ state: 'hidden', timeout: 70000 });

      updateEnvVariable('E2E_MANAGER_GOOGLE_SECRET', '');
      updateEnvVariable('E2E_MANAGER_AUTHY_SECRET', '');
      updateEnvVariable('E2E_MANAGER_MICROSOFT_SECRET', qrExtract.secret);
      updateEnvVariable('E2E_MANAGER_OTP_SECRET', qrExtract.secret);

      process.env.E2E_MANAGER_OTP_SECRET = qrExtract.secret;
      dotenv.config();

      await expect(this.page).toHaveURL(/\/login$/i);
    });
  }

  async enableAuthyAuthenticatorMfa(): Promise<void> {
    await test.step('Enable Authy Authenticator MFA', async () => {
      await this.navigateToMfaTab();
      await this.page.waitForTimeout(1000);
      await this.clickReplaceButton();
      await this.selectAuthyAuthenticator();

      const authyRadioButton = this.page.locator('div:nth-child(3) > .p-element > .p-radiobutton > .p-radiobutton-box');
      await authyRadioButton.click();

      const alreadyEnabled = this.page.getByRole('alert', { name: 'This MFA already enabled' });
      let isAlreadyEnabled = false;
      try { isAlreadyEnabled = await alreadyEnabled.isVisible({ timeout: 3000 }); } catch { isAlreadyEnabled = false; }

      if (isAlreadyEnabled) return;

      await this.page.waitForTimeout(2000);

      const qrImage = this.page.locator("//div[@class='rqcode']//img");
      const qrVisible = await qrImage.isVisible({ timeout: 5000 }).catch(() => false);
      if (!qrVisible) throw new Error('QR code for Authy MFA not visible.');

      const qrSrc = await qrImage.getAttribute('src');
      if (!qrSrc) throw new Error('Unable to find QR code src for Authy MFA');

      const qrExtract = await extractSecretFromQr(qrSrc);
      if (!qrExtract?.secret) throw new Error('Failed to extract Authy MFA secret');

      const otp = generateOtp(qrExtract.secret);
      await this.enterMfaOtp(otp);

      const saveButton = this.page.getByRole('button', { name: 'Save' });
      await saveButton.click({ force: true });

      const mfaEnabledToast = this.page.getByRole('alert', { name: /MFA enabled successfully/i });
      await expect(mfaEnabledToast).toBeVisible({ timeout: 6000 });
      await mfaEnabledToast.waitFor({ state: 'hidden', timeout: 70000 });

      updateEnvVariable('E2E_MANAGER_GOOGLE_SECRET', '');
      updateEnvVariable('E2E_MANAGER_MICROSOFT_SECRET', '');
      updateEnvVariable('E2E_MANAGER_AUTHY_SECRET', qrExtract.secret);
      updateEnvVariable('E2E_MANAGER_OTP_SECRET', qrExtract.secret);

      process.env.E2E_MANAGER_OTP_SECRET = qrExtract.secret;
      dotenv.config();

      await expect(this.page).toHaveURL(/\/login$/i);
    });
  }

  async enterInvalidOtpGoogleAuthenticatorMfa(): Promise<void> {
    await test.step('Enter incorrect Google Authenticator MFA code', async () => {
      await this.navigateToMfaTab();
      await this.clickReplaceButton();
      await this.selectGoogleAuthenticator();

      const googleRadioButton = this.page.locator('.p-radiobutton-icon').first();
      await googleRadioButton.click();

      const alreadyEnabled = this.page.getByRole('alert', { name: 'This MFA already enabled' });
      let isAlreadyEnabled = false;
      try { isAlreadyEnabled = await alreadyEnabled.isVisible({ timeout: 3000 }); } catch { isAlreadyEnabled = false; }

      if (isAlreadyEnabled) return;

      await this.page.waitForTimeout(2000);
      const otpTextbox = this.page.getByRole('textbox', { name: 'MFA Code1' });
      await otpTextbox.click();
      await otpTextbox.fill('123456');
      const saveButton = this.page.getByRole('button', { name: 'Save' });
      await saveButton.click({ force: true });
    });
  }

  async enterInvalidOtpMsleAuthenticatorMfa(): Promise<void> {
    await test.step('Enter incorrect Microsoft Authenticator MFA code', async () => {
      await this.navigateToMfaTab();
      await this.clickReplaceButton();
      await this.selectMicrosoftAuthenticator();

      const msRadioButton = this.page.locator('.p-radiobutton-box.p-highlight > .p-radiobutton-icon');
      await msRadioButton.click();

      const alreadyEnabled = this.page.getByRole('alert', { name: 'This MFA already enabled' });
      let isAlreadyEnabled = false;
      try { isAlreadyEnabled = await alreadyEnabled.isVisible({ timeout: 3000 }); } catch { isAlreadyEnabled = false; }

      if (isAlreadyEnabled) return;

      await this.page.waitForTimeout(2000);
      const otpTextbox = this.page.getByRole('textbox', { name: 'MFA Code1' });
      await otpTextbox.click();
      await otpTextbox.fill('123456');
      const saveButton = this.page.getByRole('button', { name: 'Save' });
      await saveButton.click({ force: true });
    });
  }

  async enterInvalidOtpAuthyleAuthenticatorMfa(): Promise<void> {
    await test.step('Enter incorrect Authy Authenticator MFA code', async () => {
      await this.navigateToMfaTab();
      await this.clickReplaceButton();
      await this.selectMicrosoftAuthenticator();

      const authyRadioButton = this.page.locator('div:nth-child(3) > .p-element > .p-radiobutton > .p-radiobutton-box');
      await authyRadioButton.click();

      const alreadyEnabled = this.page.getByRole('alert', { name: 'This MFA already enabled' });
      let isAlreadyEnabled = false;
      try { isAlreadyEnabled = await alreadyEnabled.isVisible({ timeout: 3000 }); } catch { isAlreadyEnabled = false; }

      if (isAlreadyEnabled) return;

      await this.page.waitForTimeout(2000);
      const otpTextbox = this.page.getByRole('textbox', { name: 'MFA Code1' });
      await otpTextbox.click();
      await otpTextbox.fill('123456');
      const saveButton = this.page.getByRole('button', { name: 'Save' });
      await saveButton.click({ force: true });
    });
  }
}
