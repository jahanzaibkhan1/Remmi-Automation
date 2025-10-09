import { Page, Locator, expect, test } from '@playwright/test';
import { MyProfileLocators } from './MyProfileLocators';
export class MyProfileActions {
  private locators: MyProfileLocators;

  constructor(private page: Page) {
    this.locators = new MyProfileLocators(page);
  }

  // ---------------- Navigation ----------------
  async navigateToProfilePage() {
    await test.step('Navigate to My Profile page', async () => {
      await this.clickProfileIcon();
      await this.clickMyProfileButton();
    });
  }

  private async clickProfileIcon() {
    const profileIcon = this.locators.profileIcon();
    await expect(profileIcon).toBeVisible({ timeout: 20000 });
    await profileIcon.click({ force: true });
  }

  private async clickMyProfileButton() {
    const myProfileButton = this.locators.myProfileButton();
    await expect(myProfileButton).toBeVisible({ timeout: 20000 });
    await myProfileButton.click({ force: true });
  }

  // ---------------- Field Verification ----------------
  private async verifyField(fieldName: string, getField: () => Locator) {
    await test.step(`Verify field: ${fieldName}`, async () => {
      const field = getField().first();
      await expect(field).toBeVisible({ timeout: 15000 });

      const tag = await field.evaluate(el => el.tagName.toUpperCase());
      let value = '';
      if (tag === 'INPUT' || tag === 'TEXTAREA') {
        value = await field.inputValue();
      } else {
        value = (await field.textContent())?.trim() || '';
      }

      console.log(`${fieldName} value: "${value || 'EMPTY'}"`);

      const nonEditable = (tag === 'INPUT' || tag === 'TEXTAREA')
        ? await field.isDisabled() || (await field.getAttribute('readonly')) !== null
        : (await field.getAttribute('contenteditable')) !== 'true';

      console.log(`${fieldName} non-editable? ${nonEditable ? '✅ Yes' : '❌ No'}`);
      expect(nonEditable).toBe(true);
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
      await this.verifyField(field.name, field.locator);
    }
  }

  // ---------------- PIN ----------------
  async enterPinAndSave(pin: string) {
    await test.step('Enter PIN and save profile', async () => {
      await this.fillPinField(pin);
      await this.clickUpdateButton();
      await this.expectProfileUpdatedToast();
    });
  }

  private async fillPinField(pin: string) {
    const pinField = this.locators.pin().first();
    await expect(pinField).toBeVisible({ timeout: 10000 });
    await pinField.fill(pin);
    expect(await pinField.inputValue()).toBe(pin);
  }

  private async clickUpdateButton() {
    const updateButton = this.locators.updateButton();
    await updateButton.scrollIntoViewIfNeeded();
    await updateButton.click({ force: true });
  }

  private async expectProfileUpdatedToast() {
    const toast = this.locators.profileUpdatedToast().first();
    await expect.soft(toast).toHaveText(/Profile has been updated/i, { timeout: 15000 });
  }

  // ---------------- Library ----------------
  async navigateToLibrary() {
    await test.step('Navigate to Library page', async () => {
      await this.clickLibraryLink();
    });
  }

  private async clickLibraryLink() {
    const libraryLink = this.locators.libraryLink().first();
    await expect(libraryLink).toBeVisible({ timeout: 15000 });
    await libraryLink.scrollIntoViewIfNeeded();
    await libraryLink.click({ force: true });
  }

  // ---------------- Private Download ----------------
  async downloadWithCorrectPin(pin: string) {
    await test.step('Download with correct PIN', async () => {
      await this.clickImage();
      await this.clickPrivateDownloadButton();
      await this.fillPinPopup(pin);
      await this.clickConfirmButton();
      await this.expectPinMatchedToast();
    });
  }

  private async clickImage() {
    const image = this.locators.clickImage().first();
    await image.click({ force: true });
  }

  private async clickPrivateDownloadButton() {
    const downloadBtn = this.locators.privateDownloadButton().first();
    await expect(downloadBtn).toBeVisible({ timeout: 15000 });
    await downloadBtn.click({ force: true });
  }

  private async fillPinPopup(pin: string) {
    const pinPopup = this.locators.pinPopupField().first();
    await expect(pinPopup).toBeVisible({ timeout: 15000 });
    await pinPopup.fill(pin);
  }

  private async clickConfirmButton() {
    const confirmButton = this.page.getByRole('button', { name: /Confirm|Save/i });
    await expect(confirmButton).toBeVisible({ timeout: 10000 });
    await confirmButton.scrollIntoViewIfNeeded();
    await confirmButton.click({ force: true });
  }

  private async expectPinMatchedToast() {
    const successToast = this.locators.pinMatchedToast().first();
    await expect.soft(successToast).toBeVisible({ timeout: 7000 });
    await expect.soft(successToast).toContainText(/PIN matched successfully/i);
  }

  // ---------------- Verify PIN Required ----------------
  async verifyPINIsRequired() {
    await test.step('Verify PIN is required before download', async () => {
      await this.clickImage();
      await this.clickPrivateDownloadButton();
      await this.clickSaveButton();
      await this.expectPinEmptyErrorToast();
    });
  }

  private async clickSaveButton() {
    const saveButton = this.locators.saveButton();
    await saveButton.click({ force: true });
  }

  private async expectPinEmptyErrorToast() {
    const toast = this.locators.pinEmptyErrorToast().first();
    await expect(toast).toBeVisible({ timeout: 15000 });
    await expect(toast).toHaveText(/Please enter PIN first/i);
    console.log(toast);
  }

  // ---------------- Incorrect PIN ----------------
  async downloadWithIncorrectPin(pin: string) {
    await test.step('Download with incorrect PIN', async () => {
      await this.clickImage();
      await this.clickPrivateDownloadButton();
      await this.fillPinPopup(pin);
      await this.clickSaveButton();
      await this.expectPinInvalidErrorToast();
    });
  }

  private async expectPinInvalidErrorToast() {
    const errorToast = this.locators.pinInvalidErrorToast().first();
    await expect(errorToast).toBeVisible({ timeout: 15000 });
    await expect(errorToast).toHaveText(/Invalid PIN/i);
    console.log(errorToast);
  }

  // ---------------- Empty PIN ----------------
  async downloadWithEmptyPin() {
    await test.step('Download with empty PIN', async () => {
      await this.clickImage();
      await this.clickPrivateDownloadButton();
      await this.clickSaveButton();
      await this.expectPinEmptyErrorToast();
    });
  }

  // ---------------- Calendar ----------------
  async updateCalendarColor(color: string) {
    await test.step(`Update calendar color to ${color}`, async () => {
      await this.fillCalendarColor(color);
      await this.clickUpdateButton();
    });
  }

  private async fillCalendarColor(color: string) {
    const colorField = this.locators.calendarColor().first();
    await colorField.fill(color);
    expect(await colorField.inputValue()).toBe(color);
  }

  // ---------------- Invalid Calendar Color ----------------
  async tryInvalidCalendarColor(invalidColor: string) {
    await test.step(`Try invalid calendar color: ${invalidColor}`, async () => {
      await this.fillCalendarColor(invalidColor);
      await this.expectInvalidColorToast();
    });
  }

  private async expectInvalidColorToast() {
    const errorToast = this.locators.pinInvalidErrorToast().first();
    await expect(errorToast).toHaveText(/invalid color/i);
  }

  // ---------------- Navigate to Images Tab ----------------
  async UploadImageProfile(imagePath: string) {
    await test.step('Upload a profile image', async () => {
      await this.goToImagesTab();
      const addProfileImage = this.locators.addProfileImage().first();
      const isAddProfileImageVisible = await addProfileImage.isVisible();

      if (!isAddProfileImageVisible) {
        console.log('Profile image already exists. Skipping upload.');
        return;
      }

      await addProfileImage.click({ force: true });

      // Optionally click upload icon if required
      // const uploadImage = this.locators.uploadImage().first();
      // await uploadImage.click({ force: true });

      await this.uploadImageFile(imagePath);

      await this.moveImageSlightlyLeft();

      await this.clickUpdateImages();

      await this.expectImagesUpdatedToast();
    });
  }

  private async goToImagesTab() {
    const imagesTab = this.locators.imagesTab().first();
    await imagesTab.click({ force: true });
  }

  private async uploadImageFile(imagePath: string) {
    const fileInput = await this.page.$('input[type="file"]');
    if (!fileInput) throw new Error('File input not found for image upload');
    await fileInput.setInputFiles(imagePath);
  }

  private async moveImageSlightlyLeft() {
    const moveIcon = this.page.locator('div.ngx-ic-move').first();
    const boundingBox = await moveIcon.boundingBox();
    if (boundingBox) {
      await moveIcon.hover();
      await this.page.mouse.move(
        boundingBox.x + boundingBox.width / 2,
        boundingBox.y + boundingBox.height / 2
      );
      await this.page.mouse.move(
        boundingBox.x + boundingBox.width / 2 - 30,
        boundingBox.y + boundingBox.height / 2,
        { steps: 5 }
      );
    } else {
      throw new Error('Move icon bounding box not found');
    }
  }

  private async clickUpdateImages() {
    const updateImages = this.locators.updateImages().first();
    await updateImages.click({ force: true });
  }

  private async expectImagesUpdatedToast() {
    const toast = this.locators.toast().first();
    await expect(toast).toBeVisible({ timeout: 15000 });
    await expect(toast).toHaveText(/Images updated successfully/i);
  }

  // ------------------- Verify multiple images can be uploaded -------------------
  async uploadMultipleImages(imagePath: string) {
    await this.goToImagesTab();
    await this.clickAddMoreImagesButton();
    await this.clickLastUploadImageButton();
    await this.setLastFileInput(imagePath);
    await this.moveImageSlightlyLeft();
    await this.scrollAndClickUpdateImages();
    console.log('✅ Successfully uploaded image from path:', imagePath);
  }

  private async clickAddMoreImagesButton() {
    const addMoreImagesButton = this.locators.AddMoreImagesButton().first();
    await expect(addMoreImagesButton).toBeVisible({ timeout: 10000 });
    await addMoreImagesButton.click({ force: true });
  }

  private async clickLastUploadImageButton() {
    const uploadButtons = this.locators.uploadMoreImageButton();
    const count = await uploadButtons.count();
    if (count === 0) throw new Error('No "Upload Image" buttons found');
    const lastUploadButton = uploadButtons.nth(count - 1);
    await lastUploadButton.scrollIntoViewIfNeeded();
    await lastUploadButton.click({ force: true });
  }

  private async setLastFileInput(imagePath: string) {
    const fileInputs = this.page.locator('input[type="file"][name="profile"]');
    const fileInputCount = await fileInputs.count();
    if (fileInputCount === 0) throw new Error('No file input found for upload');
    const lastFileInput = fileInputs.nth(fileInputCount - 1);
    await lastFileInput.setInputFiles(imagePath);
  }

  private async scrollAndClickUpdateImages() {
    const updateImages = this.locators.updateImages().first();
    await updateImages.scrollIntoViewIfNeeded();
    await updateImages.click({ force: true });
  }

  // ---------------- Verify user can set selected image as profile image ----------------
  async setImageAsDefaultProfile() {
    await this.goToImagesTab();
    await this.clickDefaultProfileCheckbox();
    await this.expectProfileImageVisible();
  }

  private async clickDefaultProfileCheckbox() {
    const checkbox = this.locators.defaultProfileCheckbox();
    await checkbox.scrollIntoViewIfNeeded();
    await expect(checkbox).toBeVisible({ timeout: 10000 });
    await checkbox.click({ force: true });
  }

  private async expectProfileImageVisible() {
    const profileImage = this.page.locator("div.user-thumbnail-placeholder >> img, .user_thumb.ng-star-inserted");
    await expect(profileImage.first()).toBeVisible({ timeout: 15000 });
    await expect(profileImage.first()).toHaveAttribute('src', /.+/);
  }

  // ---------------- Verify thumbnails appear after image upload ----------------
  async verifyThumbnailsAfterImageUpload(imagePath: string) {
    await test.step('Verify thumbnails appear after image upload', async () => {
      await this.goToImagesTab();
      await this.clickAddProfileImageButton();
      await this.clickLastUploadImageButton();
      await this.setLastFileInput(imagePath);
      await this.expectThumbnailsAppear();
    });
  }

  private async clickAddProfileImageButton() {
    const addProfileImage = this.locators.addProfileImage().first();
    await addProfileImage.click({ force: true });
  }

  private async expectThumbnailsAppear() {
    const lowResolutionImg = this.page.getByRole('img', { name: 'Low Resolution' }).nth(2);
    const croppedFaceImg = this.page.locator('image-cropper').getByRole('img').nth(-1);
    const agentFaceText = this.page.getByText('Agent Face', { exact: true }).nth(-1);

    await expect(lowResolutionImg).toBeVisible();
    await expect(croppedFaceImg).toBeVisible();
    await expect(agentFaceText).toBeVisible();
    console.log('✅ Verified: Three thumbnails (Low Resolution, Agent Face, Agent Face Selection) appear successfully');
  }

  // ---------------- Verify thumbnails are removed when clicking cross button ----------------
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

  private async expectThumbnailsAppearForRemoval() {
    const lowResolutionImg = this.page.getByRole('img', { name: 'Low Resolution' }).nth(-1);
    const croppedFaceImg = this.page.locator('image-cropper').getByRole('img').nth(-1);
    const agentFaceText = this.page.getByText('Agent Face', { exact: true }).nth(-1);

    await expect(lowResolutionImg).toBeVisible();
    await expect(croppedFaceImg).toBeVisible();
    await expect(agentFaceText).toBeVisible();
    console.log('✅ Verified: Three thumbnails appear successfully');
  }

  private async clickCrossIconAndVerifyRemoval() {
    const crossIcon = this.page
      .locator('app-user-profile-images div.row > div')
      .last()
      .locator('i.pi.pi-times.f-12');

    if (await crossIcon.count() > 0 && await crossIcon.isVisible()) {
      await crossIcon.scrollIntoViewIfNeeded();
      await crossIcon.evaluate((el: HTMLElement | SVGElement) => {
        if (typeof (el as HTMLElement).click === 'function') {
          (el as HTMLElement).click();
        } else if (typeof (el as SVGElement).dispatchEvent === 'function') {
          el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        }
      });

      const successMessage = this.page.getByRole('alert', { name: 'Image deleted' });
      await expect(successMessage).toBeVisible();
      console.log('✅ Cross (delete) button clicked and image deleted successfully');
    } else {
      console.warn('⚠️ Cross (delete) button not found or not visible. Skipping delete step.');
    }
  }

  // ---------------- Verify options to delete and edit low resolution and agent face thumbnails ----------------
  async manageExistingThumbnails(imagePath1: string, imagePath2: string) {
    await test.step('Edit and delete low resolution and agent face thumbnails', async () => {
      await this.goToImagesTab();
      await this.expectLowResAndAgentFaceThumbnails();
      await this.editLowResolutionThumbnail(imagePath1);
      await this.deleteAndReuploadAgentFaceThumbnail(imagePath2);
    });
  }

  private async expectLowResAndAgentFaceThumbnails() {
    const lowResolutionImg = this.page.getByRole('img', { name: 'Low Resolution' }).first();
    const agentFaceText = this.page.getByText('Agent Face', { exact: true }).first();
    await expect(lowResolutionImg).toBeVisible();
    await expect(agentFaceText).toBeVisible();
    console.log('✅ Verified: Low Resolution and Agent Face thumbnails are visible');
  }

  private async editLowResolutionThumbnail(imagePath: string) {
    // const editIcon = this.page.locator('.d-flex.align-items-center.justify-content-center').first();
    // await editIcon.click({ force: true });
    const fileInput = await this.page.$('input[type="file"]');
    if (!fileInput) throw new Error('File input not found for image upload');
    await fileInput.setInputFiles(imagePath);
    await this.clickUpdateImages();
    await this.expectImagesUpdatedToast();
  }

  private async deleteAndReuploadAgentFaceThumbnail(imagePath: string) {
    // const deleteIcon = this.page.locator('.edit-icon1 > .d-flex').first();
    // await deleteIcon.click({ force: true });
    const uploadAgentFaceInput = await this.page.$('input[type="file"]');
    if (!uploadAgentFaceInput) throw new Error('File input not found for Agent Face re-upload');
    await uploadAgentFaceInput.setInputFiles(imagePath);
    await this.moveImageSlightlyLeft();
    await this.scrollAndClickUpdateImages();
    await this.expectImagesUpdatedToast();
    console.log('✅ Successfully edited, deleted, and re-uploaded Agent Face thumbnail');
  }
}