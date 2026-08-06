import { Page, expect } from '@playwright/test';
import { MyProfileBasePage } from './MyProfileBasePage';

export class MyProfileSocialPage extends MyProfileBasePage {
  constructor(page: Page) {
    super(page);
  }

  private async navigateToSocialSetting(): Promise<void> {
    const tab = this.locators.SocialSettingTab();
    await tab.click({ force: true });
  }

  private async fillFacebookUrl(url: string): Promise<void> {
    if (url) await this.locators.FaceBookUrl().fill(url);
  }

  private async fillXUrl(url: string): Promise<void> {
    if (url) await this.locators.XUrl().fill(url);
  }

  private async fillInstagramUrl(url: string): Promise<void> {
    if (url) await this.locators.InstagramUrl().fill(url);
  }

  private async fillLinkedInUrl(url: string): Promise<void> {
    if (url) await this.locators.LinkedInUrl().fill(url);
  }

  private async fillWebsiteUrl(url: string): Promise<void> {
    if (url) await this.locators.WebsiteUrl().fill(url);
  }

  private async fillMarketingEmail(email: string): Promise<void> {
    if (email) await this.locators.MarketingEmail().fill(email);
  }

  private async selectBsoAdmin(textOption: string): Promise<void> {
    const bsoInput = this.locators.BsoAdminInput();
    await bsoInput.click({ force: true });
    await bsoInput.fill(textOption);
    await this.page.waitForTimeout(500);
  }

  private async selectBsoAdminOption(textOption: string): Promise<void> {
    const options = this.locators.BsoAdminOptions();
    await options.filter({ hasText: textOption }).first().click({ force: true });
  }

  async updateSocialSettings(settings: {
    facebook?: string;
    xUrl?: string;
    instagram?: string;
    linkedIn?: string;
    website?: string;
    marketingEmail?: string;
    selectBso?: string;
  }): Promise<void> {
    await this.navigateToSocialSetting();

    if (settings.facebook) await this.fillFacebookUrl(settings.facebook);
    if (settings.xUrl) await this.fillXUrl(settings.xUrl);
    if (settings.instagram) await this.fillInstagramUrl(settings.instagram);
    if (settings.linkedIn) await this.fillLinkedInUrl(settings.linkedIn);
    if (settings.website) await this.fillWebsiteUrl(settings.website);
    if (settings.marketingEmail) await this.fillMarketingEmail(settings.marketingEmail);
    if (settings.selectBso) {
      await this.selectBsoAdmin(settings.selectBso);
      await this.selectBsoAdminOption(settings.selectBso);
    }

    const updateButton = this.locators.updateButton();
    await updateButton.click();

    const updateMessage = this.page.locator('div[role="alert"]', { hasText: 'Profile has been updated' });
    await expect(updateMessage).toBeVisible();
  }
}
