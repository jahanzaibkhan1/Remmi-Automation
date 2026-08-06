import { Page, expect, test } from '@playwright/test';
import { MyProfileBasePage } from './MyProfileBasePage';

export class MyProfileNotificationsPage extends MyProfileBasePage {
  constructor(page: Page) {
    super(page);
  }

  private async navigateToNotificationsTab(): Promise<void> {
    const tab = this.locators.NotificationsTab();
    await tab.click({ force: true });
  }

  async enableAllNotifications(): Promise<void> {
    await test.step('Enable all notifications', async () => {
      await this.navigateToNotificationsTab();

      const webToggle = this.locators.webNotificationToggle();
      const webToggleClass = await webToggle.evaluate(el => el.parentElement?.className || '');
      if (!webToggleClass.includes('p-inputswitch-checked')) {
        await webToggle.click({ force: true });
        const successToast = this.page.getByRole('alert', { name: 'Profile has been updated' });
        await expect(successToast).toBeVisible({ timeout: 30000 });
      }

      const emailToggle = this.locators.emailNotificationToggle();
      const emailToggleClass = await emailToggle.evaluate(el => el.parentElement?.className || '');
      if (!emailToggleClass.includes('p-inputswitch-checked')) {
        await emailToggle.click({ force: true });
        const successToast = this.page.getByRole('alert', { name: 'Profile has been updated' });
        await expect(successToast).toBeVisible({ timeout: 30000 });
      }
    });
  }
}
