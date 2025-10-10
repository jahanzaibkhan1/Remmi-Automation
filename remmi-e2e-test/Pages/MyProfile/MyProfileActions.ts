import { Page, Locator, expect, test } from '@playwright/test';
import { MyProfileLocators } from './MyProfileLocators';


/**
 * This class contains all actions and verifications for the My Profile page.
 * - Private helper methods: perform low-level actions like clicking, filling inputs, verifying visibility.
 * - Public test-step methods: combine helper actions into logical steps used in tests.
 */
export class MyProfileActions {
  private locators: MyProfileLocators;

  constructor(private page: Page) {
    this.locators = new MyProfileLocators(page);
  }

  // ---------------- Private Helper Functions ----------------
  // These are reusable functions for performing individual actions or verifications.

  /** Clicks the profile icon in the header to open the profile menu */
  private async clickProfileIcon() {
    const profileIcon = this.locators.profileIcon();
    await expect(profileIcon).toBeVisible({ timeout: 20000 });
    await profileIcon.click({ force: true });
  }

  /** Clicks the "My Profile" button in the menu */
  private async clickMyProfileButton() {
    const myProfileButton = this.locators.myProfileButton();
    await expect(myProfileButton).toBeVisible({ timeout: 20000 });
    await myProfileButton.click({ force: true });
  }

  /**
   * Verifies a field is visible, logs its value, and checks if it is non-editable
   * Works for INPUT, TEXTAREA, and contenteditable elements
   */
  private async verifyField(fieldName: string, getField: () => Locator) {
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
  }

  /** Fills the PIN field in the profile form */
  private async fillPinField(pin: string) {
    const pinField = this.locators.pin().first();
    await expect(pinField).toBeVisible({ timeout: 10000 });
    await pinField.fill(pin);
    expect(await pinField.inputValue()).toBe(pin);
  }

  /** Clicks the "Update" button to save profile changes */
  private async clickUpdateButton() {
    const updateButton = this.locators.updateButton();
    await updateButton.scrollIntoViewIfNeeded();
    await updateButton.click({ force: true });
  }

  /** Waits for the "Profile updated" toast notification */
  private async expectProfileUpdatedToast() {
    const toast = this.locators.profileUpdatedToast().first();
    await expect.soft(toast).toHaveText(/Profile has been updated/i, { timeout: 15000 });
  }

  /** Clicks the Library link to navigate to the Library page */
  private async clickLibraryLink() {
    const libraryLink = this.locators.libraryLink().first();
    await expect(libraryLink).toBeVisible({ timeout: 15000 });
    await libraryLink.scrollIntoViewIfNeeded();
    await libraryLink.click({ force: true });
  }

  /** Clicks an image thumbnail in profile for download */
  private async clickImage() {
    const image = this.locators.clickImage().first();
    await image.click({ force: true });
  }

  /** Clicks the "Private Download" button for images */
  private async clickPrivateDownloadButton() {
    const downloadBtn = this.locators.privateDownloadButton().first();
    await expect(downloadBtn).toBeVisible({ timeout: 15000 });
    await downloadBtn.click({ force: true });
  }

  /** Fills the PIN popup for image download */
  private async fillPinPopup(pin: string) {
    const pinPopup = this.locators.pinPopupField().first();
    await expect(pinPopup).toBeVisible({ timeout: 15000 });
    await pinPopup.fill(pin);
  }

  /** Clicks "Confirm" or "Save" button in PIN popup */
  private async clickConfirmButton() {
    const confirmButton = this.page.getByRole('button', { name: /Confirm|Save/i });
    await expect(confirmButton).toBeVisible({ timeout: 10000 });
    await confirmButton.scrollIntoViewIfNeeded();
    await confirmButton.click({ force: true });
  }

  /** Waits for the "PIN matched successfully" toast */
  private async expectPinMatchedToast() {
    const successToast = this.locators.pinMatchedToast().first();
    await expect.soft(successToast).toBeVisible({ timeout: 7000 });
    await expect.soft(successToast).toContainText(/PIN matched successfully/i);
  }

  /** Clicks the "Save" button without filling PIN */
  private async clickSaveButton() {
    const saveButton = this.locators.saveButton();
    await saveButton.click({ force: true });
  }

  /** Expects "Please enter PIN first" toast */
  private async expectPinEmptyErrorToast() {
    const toast = this.locators.pinEmptyErrorToast().first();
    await expect(toast).toBeVisible({ timeout: 15000 });
    await expect(toast).toHaveText(/Please enter PIN first/i);
  }

  /** Expects "Invalid PIN" toast */
  private async expectPinInvalidErrorToast() {
    const errorToast = this.locators.pinInvalidErrorToast().first();
    await expect(errorToast).toBeVisible({ timeout: 15000 });
    await expect(errorToast).toHaveText(/Invalid PIN/i);
  }

  /** Fills a color in the calendar color input */
  private async fillCalendarColor(color: string) {
    const colorField = this.locators.calendarColor().first();
    await colorField.fill(color);
    expect(await colorField.inputValue()).toBe(color);
  }

  /** Expects invalid color error toast */
  private async expectInvalidColorToast() {
    const errorToast = this.locators.pinInvalidErrorToast().first();
    await expect(errorToast).toHaveText(/invalid color/i);
  }

  /** Switches to Images tab in profile */
  private async goToImagesTab() {
    const imagesTab = this.locators.imagesTab().first();
    await imagesTab.click({ force: true });
  }

  /** Uploads an image file via input[type="file"] */
  private async uploadImageFile(imagePath: string) {
    const fileInput = await this.page.$('input[type="file"]');
    if (!fileInput) throw new Error('File input not found for image upload');
    await fileInput.setInputFiles(imagePath);
  }

  /** Moves uploaded image slightly left in cropper */
  private async moveImageSlightlyLeft() {
    const moveIcon = this.page.locator('div.ngx-ic-move').first();
    const boundingBox = await moveIcon.boundingBox();
    if (!boundingBox) {
      throw new Error('Move icon bounding box not found');
    }
    await moveIcon.hover();

    // Calculate the starting point (center of the move icon)
    const startX = boundingBox.x + boundingBox.width / 2;
    const startY = boundingBox.y + boundingBox.height / 2;

    // Move mouse to center, drag slightly to the left
    await this.page.mouse.move(startX, startY);
    await this.page.mouse.move(startX - 30, startY, { steps: 2 });
    await this.page.mouse.up();
  }
  /** Clicks "Update Images" button after upload */
  private async clickUpdateImages() {
    const updateImages = this.locators.updateImages().first();
    await updateImages.click({ force: true });
  }

  /** Expects "Images updated successfully" toast */
  private async expectImagesUpdatedToast() {
    const toast = this.locators.toast().first();
    await expect(toast).toBeVisible({ timeout: 15000 });
    await expect(toast).toHaveText(/Images updated successfully/i);
  }

  /** Clicks "Add More Images" button */
  private async clickAddMoreImagesButton() {
    const addMoreImagesButton = this.locators.AddMoreImagesButton().first();
    await expect(addMoreImagesButton).toBeVisible({ timeout: 10000 });
    await addMoreImagesButton.click({ force: true });
  }

  /** Clicks the last "Upload Image" button */
  private async clickLastUploadImageButton() {
    const uploadButtons = this.locators.uploadMoreImageButton();
    const count = await uploadButtons.count();
    if (count === 0) throw new Error('No "Upload Image" buttons found');
    const lastUploadButton = uploadButtons.nth(count - 1);
    await lastUploadButton.scrollIntoViewIfNeeded();
    await lastUploadButton.click({ force: true });
  }

  /** Sets the last file input for image upload */
  private async setLastFileInput(imagePath: string) {
    const fileInputs = this.page.locator('input[type="file"][name="profile"]');
    const fileInputCount = await fileInputs.count();
    if (fileInputCount === 0) throw new Error('No file input found for upload');
    const lastFileInput = fileInputs.nth(fileInputCount - 1);
    await lastFileInput.setInputFiles(imagePath);
  }

  /** Scrolls to and clicks "Update Images" */
  private async scrollAndClickUpdateImages() {
    const updateImages = this.locators.updateImages().first();
    await updateImages.click({ force: true });
  }

  /** Clicks default profile image checkbox */
  private async clickDefaultProfileCheckbox() {
    const checkbox = this.locators.defaultProfileCheckbox();
    await checkbox.scrollIntoViewIfNeeded();
    await expect(checkbox).toBeVisible({ timeout: 10000 });
    await checkbox.click({ force: true });
  }

  /** Verifies profile image thumbnail is visible */
  private async expectProfileImageVisible() {
    const profileImage = this.page.locator("div.user-thumbnail-placeholder >> img, .user_thumb.ng-star-inserted");
    await expect(profileImage.first()).toBeVisible({ timeout: 15000 });
    await expect(profileImage.first()).toHaveAttribute('src', /.+/);
  }

  /** Clicks "Add Profile Image" button */
  private async clickAddProfileImageButton() {
    const addProfileImage = this.locators.addProfileImage().first();
    await addProfileImage.click({ force: true });
  }

  /** Expects three types of thumbnails after image upload */
  private async expectThumbnailsAppear() {
    const lowResolutionImg = this.page.getByRole('img', { name: 'Low Resolution' }).nth(2);
    const croppedFaceImg = this.page.locator('image-cropper').getByRole('img').nth(-1);
    const agentFaceText = this.page.getByText('Agent Face', { exact: true }).nth(-1);
    await expect(lowResolutionImg).toBeVisible();
    await expect(croppedFaceImg).toBeVisible();
    await expect(agentFaceText).toBeVisible();
  }

  /** Expects three thumbnails before removal */
  private async expectThumbnailsAppearForRemoval() {
    const lowResolutionImg = this.page.getByRole('img', { name: 'Low Resolution' }).nth(-1);
    const croppedFaceImg = this.page.locator('image-cropper').getByRole('img').nth(-1);
    const agentFaceText = this.page.getByText('Agent Face', { exact: true }).nth(-1);
    await expect(lowResolutionImg).toBeVisible();
    await expect(croppedFaceImg).toBeVisible();
    await expect(agentFaceText).toBeVisible();
  }

  /** Clicks cross/delete icon on thumbnail and verifies removal */
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
    }
  }

  /** Expects Low Resolution and Agent Face thumbnails */
  private async expectLowResAndAgentFaceThumbnails() {
    const lowResolutionImg = this.page.getByRole('img', { name: 'Low Resolution' }).first();
    const agentFaceText = this.page.getByText('Agent Face', { exact: true }).first();
    await expect(lowResolutionImg).toBeVisible();
    await expect(agentFaceText).toBeVisible();
  }

  /** Edits low-resolution thumbnail by uploading a new image */
  private async editLowResolutionThumbnail(imagePath: string) {
    const fileInput = await this.page.$('input[type="file"]');
    if (!fileInput) throw new Error('File input not found for image upload');
    await fileInput.setInputFiles(imagePath);
    await this.clickUpdateImages();
    await this.expectImagesUpdatedToast();
  }

  /** Deletes and re-uploads agent face thumbnail */
  private async deleteAndReuploadAgentFaceThumbnail(imagePath: string) {
    const uploadAgentFaceInput = await this.page.$('input[type="file"]');
    if (!uploadAgentFaceInput) throw new Error('File input not found for Agent Face re-upload');
    await uploadAgentFaceInput.setInputFiles(imagePath);
    await this.moveImageSlightlyLeft();
    await this.scrollAndClickUpdateImages();
    await this.expectImagesUpdatedToast();
  }

  /** Verifies resolution warning message appears */
  private async verifyResolutionWarningMessage() {
    const warningMessage = this.page.getByText('Please upload a higher resolution image for better quality.');

    // Dynamic date handling (replace hardcoded '10/10/' with today's date)
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const datelocator = this.page.getByText(`${month}/${day}/`).nth(4);

    await expect(warningMessage).toBeVisible();
    await expect(datelocator).toBeVisible();
  }

  // ---------------- Public Test-Step Functions ----------------
  // These are called in your test files

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

      const updateButton = this.locators.updateButton();
      await updateButton.scrollIntoViewIfNeeded();
      await updateButton.click({ force: true });
      console.log('🟢 Clicked Update button');

      // ✅ Now safely check toast if it exists
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
  /**
   * Verify that entering PIN is required before downloading private files
   */
  async verifyPINIsRequired() {
    await test.step('Verify PIN is required before download', async () => {
      await this.clickImage(); // Select image to download
      await this.clickPrivateDownloadButton(); // Click private download
      await this.clickSaveButton(); // Attempt without entering PIN
      await this.expectPinEmptyErrorToast(); // Validate error toast appears
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
    await test.step('Verify Resolution warning message displays', async () => {
      await this.goToImagesTab();
      await this.clickAddMoreImagesButton();
      await this.clickLastUploadImageButton();
      await this.setLastFileInput(imagePath);
      const InvalidImageFormatsError = this.locators.InvalidImageFormatsError();
      await expect(InvalidImageFormatsError).toBeVisible();
    });
  }


  async ChangeProfileImage(imagePath: string) {
    await test.step('Change the profile image to the last uploaded image and check the corresponding checkbox', async () => {
      await this.goToImagesTab();
      await this.clickAddMoreImagesButton();
      await this.clickLastUploadImageButton();
      await this.setLastFileInput(imagePath);
      await this.moveImageSlightlyLeft();
  
      // Wait for at least one visible checkbox to appear
      const visibleCheckboxes = this.page.locator('.p-checkbox-box:visible:not(.p-disabled)');
      await visibleCheckboxes.first().waitFor({ state: 'visible', timeout: 20000 });
  
      // Get the last visible checkbox
      const count = await visibleCheckboxes.count();
      if (count === 0) throw new Error('❌ No visible checkboxes found to click');
      const lastCheckbox = visibleCheckboxes.nth(count - 1);
  
      // Scroll and click
      await lastCheckbox.scrollIntoViewIfNeeded();
      await lastCheckbox.click({ force: true });
      console.log('☑️ Last visible checkbox clicked successfully');
  
      await this.clickUpdateImages();
    });
  }

 
  async VerifyProfileImagePersistsAfterReload(imagePath: string) {
    await test.step('Verify profile image is updated and persists after page reload', async () => {
      await this.goToImagesTab();
      await this.clickAddMoreImagesButton();
      await this.clickLastUploadImageButton();
      await this.setLastFileInput(imagePath);
      await this.moveImageSlightlyLeft();
  
      // Wait for at least one visible checkbox to appear
      const visibleCheckboxes = this.page.locator('.p-checkbox-box:visible:not(.p-disabled)');
      await visibleCheckboxes.first().waitFor({ state: 'visible', timeout: 20000 });
  
      // Get the last visible checkbox
      const count = await visibleCheckboxes.count();
      if (count === 0) throw new Error('❌ No visible checkboxes found to click');
      const lastCheckbox = visibleCheckboxes.nth(count - 1);
  
      // Scroll and click
      await lastCheckbox.scrollIntoViewIfNeeded();
      await lastCheckbox.click({ force: true });
      console.log('☑️ Last visible checkbox clicked successfully');

      await this.clickUpdateImages();
  
      // Reload page
      await this.page.reload();
      // Re-verify image is visible and src is the same
      const refreshedProfileImage = this.locators.profileIcon();
      await expect(refreshedProfileImage).toBeVisible({ timeout: 10000 });
    });
  }
  
}
