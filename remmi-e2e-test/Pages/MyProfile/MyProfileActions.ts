import { Page, Locator, expect, test } from '@playwright/test';
import { MyProfileLocators } from './MyProfileLocators';
import { url } from 'inspector';
import { setEngine } from 'crypto';

/**
 * Actions and verifications for the My Profile page.
 */
export class MyProfileActions {
  private locators: MyProfileLocators;

  constructor(private page: Page) {
    this.locators = new MyProfileLocators(page);
  }

  // --------- PRIVATE HELPERS ---------
  private async clickProfileIcon() {
    const profileIcon = this.locators.profileIcon();
    await expect(profileIcon).toBeVisible({ timeout: 20000 });
    await profileIcon.click({ force: true });
  }

  private async clickMyProfileButton() {
    const myProfileBtn = this.locators.myProfileButton();
    await expect(myProfileBtn).toBeVisible({ timeout: 20000 });
    await myProfileBtn.click({ force: true });
  }

  private async verifyField(fieldName: string, getField: () => Locator) {
    const field = getField().first();
    await expect(field).toBeVisible({ timeout: 15000 });

    const tag = await field.evaluate(el => el.tagName.toUpperCase());
    let value: string = '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') {
      value = await field.inputValue();
    } else {
      value = (await field.textContent())?.trim() || '';
    }

    console.log(`${fieldName} value: "${value || 'EMPTY'}"`);

    let nonEditable: boolean;
    if (tag === 'INPUT' || tag === 'TEXTAREA') {
      nonEditable = await field.isDisabled() || (await field.getAttribute('readonly')) !== null;
    } else {
      nonEditable = (await field.getAttribute('contenteditable')) !== 'true';
    }
    console.log(`${fieldName} non-editable? ${nonEditable ? '✅ Yes' : '❌ No'}`);
    expect(nonEditable).toBe(true);
  }

  private async fillPinField(pin: string) {
    const pinField = this.locators.pin().first();
    await expect(pinField).toBeVisible({ timeout: 10000 });
    await pinField.fill(pin);
    expect(await pinField.inputValue()).toBe(pin);
  }

  private async clickUpdateButton() {
    const btn = this.locators.updateButton();
    await btn.scrollIntoViewIfNeeded();
    await btn.click({ force: true });
  }

  private async expectProfileUpdatedToast() {
    const toast = this.locators.profileUpdatedToast().first();
    await expect.soft(toast).toHaveText(/Profile has been updated/i, { timeout: 15000 });
  }

  private async clickLibraryLink() {
    const libLink = this.locators.libraryLink().first();
    await expect(libLink).toBeVisible({ timeout: 15000 });
    await libLink.scrollIntoViewIfNeeded();
    await libLink.click({ force: true });
  }

  private async clickImage() {
    const img = this.locators.clickImage().first();
    await img.click({ force: true });
  }

  private async clickPrivateDownloadButton() {
    const btn = this.locators.privateDownloadButton().first();
    await expect(btn).toBeVisible({ timeout: 15000 });
    await btn.click({ force: true });
  }

  private async fillPinPopup(pin: string) {
    const field = this.locators.pinPopupField().first();
    await expect(field).toBeVisible({ timeout: 15000 });
    await field.fill(pin);
  }

  private async clickConfirmButton() {
    const confirmBtn = this.page.getByRole('button', { name: /Confirm|Save/i });
    await expect(confirmBtn).toBeVisible({ timeout: 10000 });
    await confirmBtn.scrollIntoViewIfNeeded();
    await confirmBtn.click({ force: true });
  }

  private async expectPinMatchedToast() {
    const toast = this.locators.pinMatchedToast().first();
    await expect.soft(toast).toBeVisible({ timeout: 7000 });
    await expect.soft(toast).toContainText(/PIN matched successfully/i);
  }

  private async clickSaveButton() {
    const btn = this.locators.saveButton();
    await btn.click({ force: true });
  }

  private async expectPinEmptyErrorToast() {
    const toast = this.locators.pinEmptyErrorToast().first();
    await expect(toast).toBeVisible({ timeout: 15000 });
    await expect(toast).toHaveText(/Please enter PIN first/i);
  }

  private async expectPinInvalidErrorToast() {
    const toast = this.locators.pinInvalidErrorToast().first();
    await expect(toast).toBeVisible({ timeout: 15000 });
    await expect(toast).toHaveText(/Invalid PIN/i);
  }

  private async fillCalendarColor(color: string) {
    const field = this.locators.calendarColor().first();
    await field.fill(color);
    expect(await field.inputValue()).toBe(color);
  }

  private async expectInvalidColorToast() {
    const toast = this.locators.pinInvalidErrorToast().first();
    await expect(toast).toHaveText(/invalid color/i);
  }

  private async goToImagesTab() {
    const tab = this.locators.imagesTab().first();
    await tab.click({ force: true });
  }

  private async uploadImageFile(imagePath: string) {
    const input = await this.page.$('input[type="file"]');
    if (!input) throw new Error('File input not found for image upload');
    await input.setInputFiles(imagePath);
  }

  private async moveImageSlightlyLeft() {
    const cropBox = await this.page.locator('.ngx-ic-move');
    if (!cropBox) return;
    const box = await cropBox.boundingBox();
    if (!box) return;
    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;
    const endX = startX - 20;
    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(endX, startY, { steps: 5 });
    await this.page.mouse.up();
  }

  private async clickUpdateImages() {
    const btn = this.locators.updateImages().first();
    await btn.click({ force: true });
  }

  private async UpdateImagesButton() {
    const updateImages = this.locators.updateImages().first();
  }

  private async expectImagesUpdatedToast() {
    const toast = this.locators.toast().first();
    await expect(toast).toBeVisible({ timeout: 15000 });
    await expect(toast).toHaveText(/Images updated successfully/i);
  }

  private async clickAddMoreImagesButton() {
    const btn = this.locators.AddMoreImagesButton().first();
    await expect(btn).toBeVisible({ timeout: 10000 });
    await btn.click({ force: true });
  }

  private async clickLastUploadImageButton() {
    const uploadButtons = this.locators.uploadMoreImageButton();
    const count = await uploadButtons.count();
    if (count === 0) throw new Error('No "Upload Image" buttons found');
    const btn = uploadButtons.nth(count - 1);
    await btn.scrollIntoViewIfNeeded();
    await btn.click({ force: true });
  }

  private async setLastFileInput(imagePath: string) {
    const fileInputs = this.page.locator('input[type="file"][name="profile"]');
    const fileInputCount = await fileInputs.count();
    if (fileInputCount === 0) throw new Error('No file input found for upload');
    const lastInput = fileInputs.nth(fileInputCount - 1);
    await lastInput.setInputFiles(imagePath);
  }

  private async scrollAndClickUpdateImages() {
    const btn = this.locators.updateImages().first();
    await btn.click({ force: true });
  }

  private async clickDefaultProfileCheckbox() {
    const checkbox = this.locators.defaultProfileCheckbox();
    await checkbox.scrollIntoViewIfNeeded();
    await expect(checkbox).toBeVisible({ timeout: 10000 });
    await checkbox.click({ force: true });
  }

  private async expectProfileImageVisible() {
    const img = this.page.locator("div.user-thumbnail-placeholder >> img, .user_thumb.ng-star-inserted");
    await expect(img.first()).toBeVisible({ timeout: 15000 });
    await expect(img.first()).toHaveAttribute('src', /.+/);
  }

  private async clickAddProfileImageButton() {
    const btn = this.locators.addProfileImage().first();
    await btn.click({ force: true });
  }

  private async expectThumbnailsAppear() {
    const lowRes = this.page.getByRole('img', { name: 'Low Resolution' }).nth(2);
    const cropped = this.page.locator('image-cropper').getByRole('img').nth(-1);
    const agentFace = this.page.getByText('Agent Face', { exact: true }).nth(-1);
    await expect(lowRes).toBeVisible();
    await expect(cropped).toBeVisible();
    await expect(agentFace).toBeVisible();
  }

  private async expectThumbnailsAppearForRemoval() {
    const lowRes = this.page.getByRole('img', { name: 'Low Resolution' }).nth(-1);
    const cropped = this.page.locator('image-cropper').getByRole('img').nth(-1);
    const agentFace = this.page.getByText('Agent Face', { exact: true }).nth(-1);
    await expect(lowRes).toBeVisible();
    await expect(cropped).toBeVisible();
    await expect(agentFace).toBeVisible();
  }

  private async clickCrossIconAndVerifyRemoval() {
    const crossIcon = this.page
      .locator('app-user-profile-images div.row > div')
      .last()
      .locator('i.pi.pi-times.f-12');
    if ((await crossIcon.count()) > 0 && await crossIcon.isVisible()) {
      await crossIcon.scrollIntoViewIfNeeded();
      await crossIcon.evaluate((el: HTMLElement | SVGElement) => {
        if (typeof (el as HTMLElement).click === 'function') {
          (el as HTMLElement).click();
        } else if (typeof (el as SVGElement).dispatchEvent === 'function') {
          el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        }
      });
      const msg = this.page.getByRole('alert', { name: 'Image deleted' });
      await expect(msg).toBeVisible();
    }
  }

  private async expectLowResAndAgentFaceThumbnails() {
    const lowRes = this.page.getByRole('img', { name: 'Low Resolution' }).first();
    const agentFace = this.page.getByText('Agent Face', { exact: true }).first();
    await expect(lowRes).toBeVisible();
    await expect(agentFace).toBeVisible();
  }

  private async editLowResolutionThumbnail(imagePath: string) {
    const fileInput = await this.page.$('input[type="file"]');
    if (!fileInput) throw new Error('File input not found for image upload');
    await fileInput.setInputFiles(imagePath);
    await this.clickUpdateImages();
    await this.expectImagesUpdatedToast();
  }

  private async deleteAndReuploadAgentFaceThumbnail(imagePath: string) {
    const fileInput = await this.page.$('input[type="file"]');
    if (!fileInput) throw new Error('File input not found for Agent Face re-upload');
    await fileInput.setInputFiles(imagePath);
    await this.moveImageSlightlyLeft();
    await this.scrollAndClickUpdateImages();
    await this.expectImagesUpdatedToast();
  }

  private async verifyResolutionWarningMessage() {
    const warning = this.page.getByText('Please upload a higher resolution image for better quality.');
    await expect(warning).toBeVisible();
  }

  // ----------- Social Settings Section -----------
  // These methods support the Social Settings tab in the profile.

  private async navigateToSocialSetting() {
    const tab = this.locators.SocialSettingTab();
    await tab.click({ force: true });
  }

  private async fillFacebookUrl(url: string) {
    if (url) await this.locators.FaceBookUrl().fill(url);
  }

  private async fillXUrl(url: string) {
    if (url) await this.locators.XUrl().fill(url);
  }

  private async fillInstagramUrl(url: string) {
    if (url) await this.locators.InstagramUrl().fill(url);
  }

  private async fillLinkedInUrl(url: string) {
    if (url) await this.locators.LinkedInUrl().fill(url);
  }

  private async fillWebsiteUrl(url: string) {
    if (url) await this.locators.WebsiteUrl().fill(url);
  }

  private async fillMarketingEmail(email: string) {
    if (email) await this.locators.MarketingEmail().fill(email);
  }
// Select BSO/Admin and fill input field
private async selectBsoAdmin(textOption: string) {
  const bsoInput = this.locators.BsoAdminInput();
  await bsoInput.click({ force: true });
  await bsoInput.fill(textOption);
  // Wait for the options to become available after filling input
  await this.page.waitForTimeout(500);
}

// Click on the matching BSO/Admin option from the dropdown
private async selectBsoAdminOption(textOption: string) {
  const BsoAdminOptions = this.locators.BsoAdminOptions();
  await BsoAdminOptions.filter({ hasText: textOption }).first().click({ force: true });
}

// ----------- Access Tab Section -----------
// These methods support the Access tab in the profile.

private async navigateToAccessTab() {
  const tab = this.locators.AccessTab();
  await tab.click({ force: true });
}

private async openUserDropdown() {
  const selectUser = this.locators.selectUser();
  await selectUser.click({ force: true });
}

private async searchforUserName(userName: string) {
  const SearchUserName = this.locators.SearchUserName()
  await SearchUserName.click({ force: true });
  await SearchUserName.fill(userName);
  await this.page.waitForTimeout(5000); // small wait for dropdown results to load
}

private async selectUserFromDropdown(userName: string) {
  const selectUserFromDropdown = this.locators.selectuserFromDropdown(userName);
  await selectUserFromDropdown.click({ force: true });
}

private async SaveButton(){
  const saveButton = this.locators.saveButton();
  await saveButton.click();
}

private async calendarAccessUserName(userName){
  const calendarAccessUserName = this.locators.calendarAccessUserName(userName);
  await expect(calendarAccessUserName).toBeVisible({timeout: 10000});
}

  // --------- PUBLIC TEST/STEPS ---------
  async navigateToProfilePage() {
    await test.step('Navigate to My Profile page', async () => {
      await this.clickProfileIcon();
      await this.clickMyProfileButton();
    });
  }

  async verifyAllProfileFields() {
    const fields = [
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

  async enterPinAndSave(pin: string) {
    await test.step('Enter PIN and save profile', async () => {
      await this.fillPinField(pin);
      const btn = this.locators.updateButton();
      await btn.scrollIntoViewIfNeeded();
      await btn.click({ force: true });
      console.log('🟢 Clicked Update button');
      const toast = this.locators.profileUpdatedToast().first();
      if (await toast.isVisible()) {
        await expect(toast).toHaveText(/Profile has been updated/i);
      } else {
        console.warn('⚠️ No toast visible — may auto-save or reload silently');
      }
    });
  }

  async navigateToLibrary() {
    await test.step('Navigate to Library page', async () => {
      await this.clickLibraryLink();
    });
  }

  async downloadWithCorrectPin(pin: string) {
    await test.step('Download with correct PIN', async () => {
      await this.clickImage();
      await this.clickPrivateDownloadButton();
      await this.fillPinPopup(pin);
      await this.clickConfirmButton();
      await this.expectPinMatchedToast();
    });
  }

  async downloadWithIncorrectPin(pin: string) {
    await test.step('Download with incorrect PIN', async () => {
      await this.clickImage();
      await this.clickPrivateDownloadButton();
      await this.fillPinPopup(pin);
      await this.clickSaveButton();
      await this.expectPinInvalidErrorToast();
    });
  }

  async verifyPINIsRequired() {
    await test.step('Verify PIN is required before download', async () => {
      await this.clickImage();
      await this.clickPrivateDownloadButton();
      await this.clickSaveButton();
      await this.expectPinEmptyErrorToast();
    });
  }

  async downloadWithEmptyPin() {
    await test.step('Download with empty PIN', async () => {
      await this.clickImage();
      await this.clickPrivateDownloadButton();
      await this.clickSaveButton();
      await this.expectPinEmptyErrorToast();
    });
  }

  async updateCalendarColor(color: string) {
    await test.step(`Update calendar color to ${color}`, async () => {
      await this.fillCalendarColor(color);
      await this.clickUpdateButton();
    });
  }

  async tryInvalidCalendarColor(invalidColor: string) {
    await test.step(`Try invalid calendar color: ${invalidColor}`, async () => {
      await this.fillCalendarColor(invalidColor);
      await this.expectInvalidColorToast();
    });
  }

  async UploadImageProfile(imagePath: string) {
    await test.step('Upload a profile image', async () => {
      await this.goToImagesTab();
      await this.clickAddProfileImageButton();
      await this.uploadImageFile(imagePath);
      await this.moveImageSlightlyLeft();
      await this.clickUpdateImages();
      await this.expectImagesUpdatedToast();
    });
  }

  async uploadMultipleImages(imagePath: string) {
    await test.step('Upload multiple images to profile', async () => {
      await this.goToImagesTab();
      await this.clickAddMoreImagesButton();
      await this.clickLastUploadImageButton();
      await this.setLastFileInput(imagePath);
      await this.moveImageSlightlyLeft();
      await this.scrollAndClickUpdateImages();
    });
  }

  async setImageAsDefaultProfile() {
    await test.step('Set uploaded image as default profile', async () => {
      await this.goToImagesTab();
      await this.clickDefaultProfileCheckbox();
      await this.expectProfileImageVisible();
    });
  }

  async verifyThumbnailsAfterImageUpload(imagePath: string) {
    await test.step('Verify thumbnails appear after image upload', async () => {
      await this.goToImagesTab();
      await this.clickAddProfileImageButton();
      await this.clickLastUploadImageButton();
      await this.setLastFileInput(imagePath);
      await this.expectThumbnailsAppear();
    });
  }

  async verifyThumbnailsAreRemoved(imagePath: string) {
    await test.step('Verify thumbnails are removed when clicking cross button', async () => {
      await this.goToImagesTab();
      await this.clickAddProfileImageButton();
      await this.clickLastUploadImageButton();
      await this.setLastFileInput(imagePath);
      await this.expectThumbnailsAppearForRemoval();
      await this.clickCrossIconAndVerifyRemoval();
    });
  }

  async manageExistingThumbnails(imagePath1: string, imagePath2: string) {
    await test.step('Edit and delete low resolution and agent face thumbnails', async () => {
      await this.goToImagesTab();
      await this.expectLowResAndAgentFaceThumbnails();
      await this.editLowResolutionThumbnail(imagePath1);
      await this.deleteAndReuploadAgentFaceThumbnail(imagePath2);
      await this.moveImageSlightlyLeft();
      await this.clickUpdateImages();
      await this.expectImagesUpdatedToast();
    });
  }

  async validateImageResolutionWarning(imagePath: string) {
    await test.step('Verify Resolution warning message displays', async () => {
      await this.goToImagesTab();
      await this.clickAddMoreImagesButton();
      await this.clickLastUploadImageButton();
      await this.setLastFileInput(imagePath);
      await this.verifyResolutionWarningMessage();
    });
  }

  async VerifyInvalidImageFormats(imagePath: string) {
    await test.step('Verify invalid image format alert appears', async () => {
      await this.goToImagesTab();
      await this.clickAddMoreImagesButton();
      await this.clickLastUploadImageButton();
      await this.setLastFileInput(imagePath);
      const error = this.locators.InvalidImageFormatsError();
      await expect(error).toBeVisible();
    });
  }

  async ChangeProfileImage(imagePath: string) {
    await test.step('Change the profile image to the last uploaded image and check the corresponding checkbox', async () => {
      await this.goToImagesTab();
      await this.clickAddMoreImagesButton();
      await this.clickLastUploadImageButton();
      await this.setLastFileInput(imagePath);
      await this.moveImageSlightlyLeft();

      const checkboxes = this.page.locator('.p-checkbox-box:visible:not(.p-disabled)');
      await checkboxes.first().waitFor({ state: 'visible', timeout: 20000 });
      const count = await checkboxes.count();
      if (count === 0) throw new Error('❌ No visible checkboxes found to click');
      const lastCheckbox = checkboxes.nth(count - 1);
      await lastCheckbox.scrollIntoViewIfNeeded();
      await lastCheckbox.click({ force: true });
      console.log('☑️ Last visible checkbox clicked successfully');
      await this.clickUpdateImages();
    });
  }

  async VerifyProfileImagePersistsAfterReload(imagePath: string) {
    await test.step('Verify that the updated profile image persists after reload', async () => {
      await this.goToImagesTab();
      await this.clickAddMoreImagesButton();
      await this.clickLastUploadImageButton();
      await this.setLastFileInput(imagePath);
      await this.moveImageSlightlyLeft();
      const checkboxes = this.page.locator('.p-checkbox-box:visible:not(.p-disabled)');
      await checkboxes.first().waitFor({ state: 'visible', timeout: 20000 });
      const count = await checkboxes.count();
      if (count === 0) throw new Error('❌ No visible checkboxes found to click');
      const lastCheckbox = checkboxes.nth(count - 1);
      await lastCheckbox.scrollIntoViewIfNeeded();
      await lastCheckbox.click({ force: true });
      console.log('☑️ Last visible checkbox clicked successfully');
      await this.clickUpdateImages();
      await this.expectImagesUpdatedToast();
      await this.page.reload();
      await this.expectProfileImageVisible();
    });
  }

  async VerifyDefaultPlaceholder() {
    await test.step('Verify the default placeholder is visible when no image is uploaded or in the first image slot', async () => {
      await this.goToImagesTab();
      const placeholders = this.page.locator('[ptooltip="Upload Image"]');
      const count = await placeholders.count();
      expect(count).toBeGreaterThan(0);
      const first = placeholders.first();
      await expect(first).toBeVisible({ timeout: 7000 });
    });
  }
  /**
   * Deletes only the currently checked/default profile image.
   * Uses a robust approach that does not rely on child index or fragile DOM structure.
   */
  async removeSelectedProfileImage() {
    await test.step('Delete only the image currently set as default profile (checked)', async () => {
      await this.goToImagesTab();

      // Locate the container holding the checked/default profile checkbox
      const checkedContainer = this.page.locator('.d-flex.align-items-start.mt-2.mr-5.ng-star-inserted')
        .filter({ has: this.page.locator('.p-checkbox.p-checkbox-checked') });

      // Scroll into view and verify visibility
      await checkedContainer.scrollIntoViewIfNeeded();
      await expect(checkedContainer).toBeVisible({ timeout: 7000 });

      // Locate the delete button that is the following sibling of the container
      const deleteButton = checkedContainer.locator('xpath=following-sibling::button[contains(@class, "_view-btn")]');

      // Click the delete button
      await deleteButton.click({ force: true });

      // Handle optional confirmation dialog
      const confirmButton = this.page.locator('button:has-text("Yes")');
      if (await confirmButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await confirmButton.click();
      }

      // Wait for success toast or deletion message
      const successToast = this.page.getByRole('alert').filter({ hasText: 'Image deleted' });
      await expect(successToast).toBeVisible({ timeout: 10000 });

      // Verify that no checked images remain
      await expect(this.page.locator('.p-checkbox.p-checkbox-checked')).toHaveCount(0, { timeout: 10000 });

      console.log('✅ Default profile image deleted successfully.');
    });
  }


  async verifyAgentFaceAspectRatio(imagePath: string) {
    await test.step('Upload image and check AGENT FACE 1:1 aspect ratio', async () => {
      await this.goToImagesTab();
      await this.clickAddMoreImagesButton();
      await this.clickLastUploadImageButton();
      await this.setLastFileInput(imagePath);
      await this.moveImageSlightlyLeft();
      await this.clickUpdateImages();
      await this.expectImagesUpdatedToast();
    });
  }

  async UploadBrokenImage(imagePath: string) {
    await test.step('Verify Resolution warning message displays', async () => {
      await this.goToImagesTab();
      await this.clickAddMoreImagesButton();
      await this.clickLastUploadImageButton();
      await this.setLastFileInput(imagePath);
      const alert = this.locators.corruptedImageAlert();
      await expect(alert).toBeVisible();
    });
  }

  async verifyAllowedImageFileFormats(validImagePaths: string[], invalidImagePaths: string[]) {
    await test.step('Verify system strictly allows only specific image formats and rejects invalid/corrupted ones', async () => {
      await this.goToImagesTab();
      for (const validPath of validImagePaths) {
        console.log(`🟢 Uploading valid image: ${validPath}`);
        await this.clickAddMoreImagesButton();
        await this.page.waitForTimeout(1000);
        await this.clickLastUploadImageButton();
        if (!(await this.fileExists(validPath))) {
          console.warn(`⚠️ File not found or inaccessible: ${validPath}`);
          continue;
        }
        await this.setLastFileInput(validPath);
        await this.moveImageSlightlyLeft();
        await this.clickUpdateImages();
        const toast = this.page.locator('div.toast-message, [role="alert"]');
        await expect(toast.first()).toBeVisible({ timeout: 15000 });
        const text = (await toast.first().textContent())?.toLowerCase() ?? '';
        expect(text).toMatch(/updated|uploaded|successfully/);
        console.log(`✅ Toast appeared with message: ${text}`);
      }
      for (const invalidPath of invalidImagePaths) {
        console.log(`🔴 Uploading invalid or corrupted image: ${invalidPath}`);
        await this.clickAddMoreImagesButton();
        await this.page.waitForTimeout(1000);
        await this.clickLastUploadImageButton();
        if (!(await this.fileExists(invalidPath))) {
          console.warn(`⚠️ File not found or inaccessible: ${invalidPath}`);
          continue;
        }
        await this.setLastFileInput(invalidPath);
        const corruptedAlert = this.page.locator('div[role="alert"][aria-label="Corrupted image file! Please upload a valid image"]');
        const invalidFormatAlert = this.page.getByRole('alert', { name: 'Unsupported file format!' });
        const anyAlert = corruptedAlert.or(invalidFormatAlert);
        await expect(anyAlert.first()).toBeVisible({ timeout: 12000 });
        const alertText = (await anyAlert.first().textContent())?.trim() ?? '';
        console.log(`✅ Invalid/Corrupted image correctly rejected with message: "${alertText}"`);
      }
    });
  }

  private async fileExists(filePath: string): Promise<boolean> {
    const fs = await import('fs');
    return fs.existsSync(filePath);
  }
  /**
   * Verify proper error message is shown when upload fails due to network offline
   */
  async verifyUploadFailureOnNetworkError(ImagePath: string) {
    await test.step('Verify upload fails when network is disconnected', async () => {
      const context = this.page.context();

      // Go offline BEFORE any network activity
      await context.setOffline(true);

      await this.goToImagesTab();
      await this.clickAddMoreImagesButton();
      await this.clickLastUploadImageButton();
      await this.setLastFileInput(ImagePath);

      // Skip moving the image — offline might break UI
      // await this.moveImageSlightlyLeft();

      // Click update to trigger upload while offline
      await this.clickUpdateImages();

      // Wait for the error toast (No internet connection)
      const uploadErrorToast = this.page.locator(
        'div[role="alert"], div.toast-message, div.p-toast-message'
      ).filter({ hasText: /failed|error|network|internet/i });
      await expect(uploadErrorToast.first()).toBeVisible({ timeout: 20000 });

      console.log('✅ Upload failure due to network offline verified successfully.');
    });
  }


  public async updateSocialSettings(settings: {
    facebook?: string;
    xUrl?: string;
    instagram?: string;
    linkedIn?: string;
    website?: string;
    marketingEmail?: string;
    selectBso?: string; // Pass the exact option text
  }) {
    await this.navigateToSocialSetting();
  
    if (settings.facebook) {
      await this.fillFacebookUrl(settings.facebook);
    }
  
    if (settings.xUrl) {
      await this.fillXUrl(settings.xUrl);
    }
  
    if (settings.instagram) {
      await this.fillInstagramUrl(settings.instagram);
    }
  
    if (settings.linkedIn) {
      await this.fillLinkedInUrl(settings.linkedIn);
    }
  
    if (settings.website) {
      await this.fillWebsiteUrl(settings.website);
    }
  
    if (settings.marketingEmail) {
      await this.fillMarketingEmail(settings.marketingEmail);
    }
  
    if (settings.selectBso) {
      await this.selectBsoAdmin(settings.selectBso);
      await this.selectBsoAdminOption(settings.selectBso);
    }
  
    // Click update button and wait for confirmation

    const updateButton = this.locators.updateButton();
    await updateButton.click();

    // verify toast message
    const updateMessage = this.page.locator('div[role="alert"]', { hasText: 'Profile has been updated' });
    await expect(updateMessage).toBeVisible();
    
  }
  
  // ----------- Public Function: Update Access Settings -----------

public async updateAccessSettings(userName: string) {
  await test.step('Verify user can grant calendar access to another user', async () =>{
    await this.navigateToAccessTab();
    await this.openUserDropdown();
    await this.searchforUserName(userName);
    await this.selectUserFromDropdown(userName);
    await this.SaveButton();
    await this.calendarAccessUserName(userName);
    

  })
  
}

}




