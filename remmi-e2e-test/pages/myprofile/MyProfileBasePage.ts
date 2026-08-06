import { Page, expect, test } from '@playwright/test';
import { BasePage } from '../common/BasePage';
import { MyProfileLocators } from './MyProfileLocators';

export abstract class MyProfileBasePage extends BasePage {
  protected readonly locators: MyProfileLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new MyProfileLocators(page);
  }

  private async clickProfileIcon(): Promise<void> {
    const profileIcon = this.locators.profileIcon();
    const myProfileBtn = this.locators.myProfileButton();

    const dashboardLoader = this.page.getByText('Loading....').first();
    if (await dashboardLoader.isVisible().catch(() => false)) {
      await dashboardLoader.waitFor({ state: 'hidden', timeout: 30000 });
    }

    await profileIcon.waitFor({ state: 'visible' });

    for (let attempt = 1; attempt <= 20; attempt++) {
      await profileIcon.click({ force: true });
      if (await myProfileBtn.isVisible()) return;
      await this.page.waitForTimeout(100);
    }

    throw new Error('My Profile button did not appear after multiple clicks on the profile icon.');
  }

  private async clickMyProfileButton(): Promise<void> {
    const myProfileBtn = this.locators.myProfileButton();
    await expect(myProfileBtn).toBeVisible({ timeout: 20000 });
    await myProfileBtn.click({ force: true });
  }

  async navigateToProfilePage(): Promise<void> {
    await test.step('Navigate to My Profile page', async () => {
      await this.clickProfileIcon();
      await this.clickMyProfileButton();
    });
  }
}
