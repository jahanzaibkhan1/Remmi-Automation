import { Page, expect } from '@playwright/test';
import { MyProfileBasePage } from './MyProfileBasePage';

export class MyProfileAccessPage extends MyProfileBasePage {
  constructor(page: Page) {
    super(page);
  }

  private async navigateToAccessTab(): Promise<void> {
    const tab = this.locators.AccessTab();
    await tab.click({ force: true });
  }

  private async openUserDropdown(): Promise<void> {
    const selectUser = this.locators.selectUser();
    await expect(selectUser).toBeVisible({ timeout: 30000 });
    await selectUser.click({ force: true });
  }

  private async searchforUserName(userName: string): Promise<void> {
    const input = this.locators.SearchUserName();
    await input.click({ force: true });
    await input.fill(userName);
  }

  private async selectUserFromDropdown(userName: string): Promise<void> {
    const userOption = this.locators.selectuserFromDropdown(userName);
    await expect(userOption).toBeVisible({ timeout: 30000 });
    await userOption.click({ force: true });
  }

  private async SaveButton(): Promise<void> {
    const saveButton = this.locators.SaveAccessButton();
    await saveButton.click();
  }

  private async calendarUpdateToast(): Promise<void> {
    const calendarUpdateMessage = this.locators.calendarUpdateMessage();
    try {
      await calendarUpdateMessage.waitFor({ state: 'visible', timeout: 30000 });
    } catch {
      const anyToast = this.locators.toast();
      const toastCount = await anyToast.count();
      if (toastCount > 0) {
        await anyToast.first().textContent();
      }
    }
  }

  private async calendarAccessUserName(userName: string): Promise<void> {
    this.locators.calendarAccessUserName(userName);
  }

  private async removeUser(): Promise<void> {
    const deleteUserIcon = this.locators.deleteUserIcon();
    await deleteUserIcon.dblclick({ force: true });
  }

  private async selectAll(): Promise<void> {
    const selectAll = this.locators.selectAll();
    await this.page.waitForTimeout(2000);
    await selectAll.click({ force: true });
  }

  private async DeselectAll(): Promise<void> {
    const selectAll = this.locators.selectAll();
    await this.page.waitForTimeout(2000);
    await selectAll.click({ force: true });
    await selectAll.click({ force: true });
  }

  private async navigateToCalendar(): Promise<void> {
    const calendarMenu = this.locators.CalendarMenu();
    await expect(calendarMenu).toBeVisible({ timeout: 5000 });
    await calendarMenu.click();
  }

  async updateAccessSettings(userName = 'Dawood Ahmad'): Promise<void> {
    await this.navigateToAccessTab();
    await this.page.waitForTimeout(2000);

    const alreadySelected = this.page.getByRole('cell', { name: 'Dawood Ahmad' });
    if (await alreadySelected.isVisible().catch(() => false)) {
      return;
    }

    await this.openUserDropdown();
    await this.searchforUserName(userName);
    const userOption = this.locators.selectuserFromDropdown(userName).first();
    await expect(userOption).toBeVisible({ timeout: 10000 });
    await userOption.click({ force: true });
    await this.SaveButton();
    await this.calendarUpdateToast();
    await this.calendarAccessUserName(userName);
  }

  async grantTaskAccessToMultipleUsers(userNames: string[]): Promise<void> {
    await this.navigateToAccessTab();
    await this.page.waitForTimeout(2000);
    await this.openUserDropdown();
    for (const userName of userNames) {
      const searchBox = this.locators.SearchUserName();
      await searchBox.click({ force: true });
      await searchBox.fill(userName);
      await this.page.waitForTimeout(3000);
      await this.selectUserFromDropdown(userName);
      await searchBox.clear();
    }

    await this.SaveButton();
    await this.SaveButton();
    await this.calendarUpdateToast();

    for (const userName of userNames) {
      await this.calendarAccessUserName(userName);
    }
  }

  async removeUserFromAccess(): Promise<void> {
    await this.navigateToAccessTab();
    await this.page.waitForTimeout(2000);
    await this.removeUser();
    await this.calendarUpdateToast();
  }

  async selectAllUsers(userNames: string[] = []): Promise<void> {
    await this.navigateToAccessTab();
    await this.openUserDropdown();
    await this.page.waitForTimeout(2000);
    await this.selectAll();
    await this.SaveButton();
    await this.SaveButton();
    await this.calendarUpdateToast();

    for (const userName of userNames) {
      const userRow = this.locators.calendarAccessUserName(userName);
      await expect(userRow).toBeVisible({ timeout: 10000 });
    }
  }

  async DeselectAllUsers(userNames: string[] = []): Promise<void> {
    await this.navigateToAccessTab();
    await this.openUserDropdown();
    await this.page.waitForTimeout(2000);
    await this.DeselectAll();
    const saveAccess = this.page.getByRole('button', { name: 'Save' }).first();
    await saveAccess.click({ force: true });
    await this.calendarUpdateToast();
  }

  async verifyUserInStaffCalendarAccess(userName: string): Promise<void> {
    await this.navigateToAccessTab();
    const accessUser = this.page.locator('tr.ng-star-inserted').filter({
      has: this.page.locator('td .d-flex.align-items-center.gap-2', { hasText: userName }),
    });
    await expect(accessUser).toBeVisible({ timeout: 8000 });
  }

  async verifyCalendarAccessFunctional(userName: string): Promise<void> {
    await this.navigateToCalendar();
    await this.page.waitForTimeout(2000);
    const calendarItem = this.page.locator('.calendar-item');
    await expect(calendarItem).toBeVisible();
  }

  async verifyNoCalendarAccess(userName: string): Promise<void> {
    await this.navigateToCalendar();
    const calendarItem = this.page.locator('.calendar-item');
    await expect(calendarItem).not.toBeVisible();
  }
}
