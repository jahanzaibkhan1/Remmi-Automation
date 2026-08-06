import { Page, Locator, expect, test } from '@playwright/test';
import { MyProfileBasePage } from './MyProfileBasePage';

export class MyProfilePage extends MyProfileBasePage {
  constructor(page: Page) {
    super(page);
  }

  private async verifyField(fieldName: string, getField: () => Locator): Promise<void> {
    const field = getField().first();
    await expect(field).toBeVisible({ timeout: 15000 });

    const tag = await field.evaluate(el => el.tagName.toUpperCase());
    let value = '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') {
      value = await field.inputValue();
    } else {
      value = (await field.textContent())?.trim() || '';
    }

    let nonEditable: boolean;
    if (tag === 'INPUT' || tag === 'TEXTAREA') {
      nonEditable = await field.isDisabled() || (await field.getAttribute('readonly')) !== null;
    } else {
      nonEditable = (await field.getAttribute('contenteditable')) !== 'true';
    }
    expect(nonEditable).toBe(true);
  }

  private async fillPinField(pin: string): Promise<void> {
    const pinField = this.locators.pin().first();
    await expect(pinField).toBeVisible({ timeout: 10000 });
    await pinField.fill(pin);
    expect(await pinField.inputValue()).toBe(pin);
  }

  private async clickUpdateButton(): Promise<void> {
    const btn = this.locators.updateButton();
    await btn.scrollIntoViewIfNeeded();
    await btn.click({ force: true });
  }

  private async clickLibraryLink(): Promise<void> {
    const libLink = this.locators.libraryLink().first();
    await expect(libLink).toBeVisible({ timeout: 15000 });
    await libLink.scrollIntoViewIfNeeded();
    await libLink.click({ force: true });
  }

  private async clickImage(): Promise<void> {
    const saqtteStatus = this.page.locator('svg:visible');
    await saqtteStatus.waitFor({ state: 'hidden' });
    await this.page.waitForTimeout(1200);
    const img = this.locators.clickImage();
    await img.waitFor({ state: 'attached' });
    await img.click({ force: true });
  }

  private async clickPrivateDownloadButton(): Promise<void> {
    const btn = this.locators.privateDownloadButton();
    await btn.first().waitFor({ state: 'visible' });
    await btn.click({ force: true });
  }

  private async fillPinPopup(pin: string): Promise<void> {
    const field = this.locators.pinPopupField().first();
    await expect(field).toBeVisible({ timeout: 15000 });
    await field.fill(pin);
  }

  private async clickConfirmButton(): Promise<void> {
    const confirmBtn = this.page.getByRole('button', { name: /Confirm|Save/i });
    await expect(confirmBtn).toBeVisible({ timeout: 10000 });
    await confirmBtn.scrollIntoViewIfNeeded();
    await confirmBtn.click({ force: true });
  }

  private async expectPinMatchedToast(): Promise<void> {
    const toast = this.locators.pinMatchedToast().first();
    await expect.soft(toast).toBeVisible({ timeout: 7000 });
    await expect.soft(toast).toContainText(/PIN matched successfully/i);
  }

  private async clickSaveButton(): Promise<void> {
    const btn = this.locators.saveButton();
    await btn.click({ force: true });
  }

  private async expectPinEmptyErrorToast(): Promise<void> {
    const toast = this.locators.pinEmptyErrorToast().first();
    await expect(toast).toBeVisible({ timeout: 15000 });
    await expect(toast).toHaveText(/Please enter PIN first/i);
  }

  private async CalendarColor(): Promise<void> {
    const calendar = this.locators.calendarColor();
    await calendar.click({ force: true });
  }

  private async fillCalendarColor(color: string): Promise<void> {
    const field = this.locators.calendarcolorInput();
    await field.fill(color);
    expect(await field.inputValue()).toBe(color);
  }

  async uploadImageToLibrary(imagePath: string): Promise<void> {
    const imgThumb = this.locators.clickImage();
    const isVisible = await imgThumb.first().waitFor({ state: 'visible', timeout: 10000 }).then(() => true).catch(() => false);
    if (isVisible) return;

    const addButton = this.page.getByRole('button', { name: ' Add' });
    await addButton.waitFor({ state: 'visible' });
    await addButton.click({ force: true });

    const fileUploadLink = this.page.locator('a', { hasText: 'File Upload (Private)' });
    await fileUploadLink.waitFor({ state: 'visible' });
    await fileUploadLink.click();

    const fileInput = this.page.locator('input[type="file"]');
    await fileInput.setInputFiles(imagePath);
  }

  async verifyAllProfileFields(): Promise<void> {
    const fields: { name: string; locator: () => Locator }[] = [
      { name: 'First Name', locator: () => this.locators.firstName() },
      { name: 'Last Name', locator: () => this.locators.lastName() },
      { name: 'Email', locator: () => this.locators.email() },
      { name: 'Mobile Number', locator: () => this.locators.mobileNumber() },
      { name: 'Telephone', locator: () => this.locators.telephone() },
      { name: 'Job Title', locator: () => this.locators.jobTitle() },
      { name: 'Biography', locator: () => this.locators.biography() },
      { name: 'Role', locator: () => this.locators.role() },
      { name: 'Group', locator: () => this.locators.group() },
      { name: 'Office', locator: () => this.locators.office() },
    ];
    for (const field of fields) {
      await test.step(`Verify field: ${field.name}`, async () => {
        await this.verifyField(field.name, field.locator);
      });
    }
  }

  async enterPinAndSave(pin: string): Promise<void> {
    await test.step('Enter PIN and save profile', async () => {
      await this.fillPinField(pin);
      const btn = this.locators.updateButton();
      await btn.scrollIntoViewIfNeeded();
      await btn.click({ force: true });
      const toast = this.locators.profileUpdatedToast().first();
      if (await toast.isVisible()) {
        await expect(toast).toHaveText(/Profile has been updated/i);
      }
    });
  }

  async navigateToLibrary(): Promise<void> {
    await test.step('Navigate to Library page', async () => {
      await this.clickLibraryLink();
    });
  }

  async downloadWithCorrectPin(pin: string): Promise<void> {
    await test.step('Download with correct PIN', async () => {
      await this.clickImage();
      await this.clickPrivateDownloadButton();
      await this.fillPinPopup(pin);
      await this.clickConfirmButton();
      await this.expectPinMatchedToast();
      await this.page.waitForTimeout(1000);
    });
  }

  async downloadWithIncorrectPin(pin: string): Promise<void> {
    await test.step('Download with incorrect PIN', async () => {
      await this.clickImage();
      await this.clickPrivateDownloadButton();
      await this.fillPinPopup(pin);
      await this.clickConfirmButton();
      await this.clickSaveButton();
    });
  }

  async verifyPINIsRequired(): Promise<void> {
    await test.step('Verify PIN is required before download', async () => {
      await this.clickImage();
      await this.clickPrivateDownloadButton();
      await this.clickSaveButton();
      await this.expectPinEmptyErrorToast();
      const cancelBtn = this.page.getByRole('button', { name: /cancel/i });
      await expect(cancelBtn).toBeVisible({ timeout: 10000 });
      await cancelBtn.click({ force: true });
    });
  }

  async downloadWithEmptyPin(): Promise<void> {
    await test.step('Download with empty PIN', async () => {
      await this.clickImage();
      await this.clickPrivateDownloadButton();
      await this.clickSaveButton();
      await this.expectPinEmptyErrorToast();
      const cancelBtn = this.page.getByRole('button', { name: /cancel/i });
      await expect(cancelBtn).toBeVisible({ timeout: 10000 });
      await cancelBtn.click({ force: true });
      await this.page.waitForTimeout(1200);
    });
  }

  async updateCalendarColor(color: string): Promise<void> {
    await test.step(`Update calendar color to ${color}`, async () => {
      await this.CalendarColor();
      await this.fillCalendarColor(color);
      const OkButton = this.page.getByRole('button', { name: 'Ok' });
      await OkButton.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
      await this.page.waitForTimeout(1200);
      await OkButton.click({ force: true });
      await this.clickUpdateButton();
      const successToast = this.page.getByRole('alert', { name: 'Profile has been updated' });
      await successToast.waitFor({ state: 'visible' });
    });
  }

  async tryInvalidCalendarColor(invalidColor: string): Promise<void> {
    await test.step(`Try invalid calendar color: ${invalidColor}`, async () => {
      await this.CalendarColor();
      await this.fillCalendarColor(invalidColor);
      const toast = this.locators.pinInvalidErrorToast().first();
      await expect(toast).toHaveText(/invalid color/i);
    });
  }
}
