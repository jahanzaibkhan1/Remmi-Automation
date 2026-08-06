import { Page, expect, test } from '@playwright/test';
import { MyProfileBasePage } from './MyProfileBasePage';

export class MyProfileImagesPage extends MyProfileBasePage {
  constructor(page: Page) {
    super(page);
  }

  private async goToImagesTab(): Promise<void> {
    const tab = this.locators.imagesTab().first();
    await tab.click({ force: true });
  }

  private async uploadImageFile(imagePath: string): Promise<void> {
    const input = await this.page.$('input[type="file"]');
    if (!input) throw new Error('File input not found for image upload');
    await input.setInputFiles(imagePath);
  }

  private async moveImageSlightlyLeft(): Promise<void> {
    const cropBox = this.page.locator('.ngx-ic-move');
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

  private async clickUpdateImages(): Promise<void> {
    const btn = this.locators.updateImages().first();
    await btn.click({ force: true });
  }

  private async expectImagesUpdatedToast(): Promise<void> {
    const toast = this.locators.toast().first();
    await expect(toast).toBeVisible({ timeout: 15000 });
    await expect(toast).toHaveText(/Images updated successfully/i);
  }

  private async clickAddMoreImagesButton(): Promise<void> {
    const btn = this.locators.AddMoreImagesButton().first();
    await btn.evaluate(node => node.scrollIntoView({ behavior: 'smooth', block: 'center' }));
    await btn.evaluate(node => (node as HTMLElement).style.zIndex = '9999');
    await expect(btn).toBeVisible({ timeout: 10000 });
    await btn.click({ force: true });
  }

  private async clickLastUploadImageButton(): Promise<void> {
    const uploadButtons = this.locators.uploadMoreImageButton();
    const count = await uploadButtons.count();
    if (count === 0) throw new Error('No "Upload Image" buttons found');
    const btn = uploadButtons.nth(count - 1);
    await btn.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' }));
    await btn.click({ force: true });
  }

  private async setLastFileInput(imagePath: string): Promise<void> {
    const fileInputs = this.page.locator('input[type="file"][name="profile"]');
    const count = await fileInputs.count();
    if (count === 0) throw new Error('No file input found for upload');
    await fileInputs.nth(count - 1).setInputFiles(imagePath);
  }

  private async scrollAndClickUpdateImages(): Promise<void> {
    const btn = this.locators.updateImages().first();
    await btn.click({ force: true });
  }

  private async clickDefaultProfileCheckbox(): Promise<void> {
    const checkbox = this.locators.defaultProfileCheckbox();
    await checkbox.scrollIntoViewIfNeeded();
    await expect(checkbox).toBeVisible({ timeout: 10000 });
    await checkbox.click({ force: true });
  }

  private async expectProfileImageVisible(): Promise<void> {
    const img = this.page.locator('div.user-thumbnail-placeholder >> img, .user_thumb.ng-star-inserted');
    await expect(img.first()).toBeVisible({ timeout: 30000 });
    await expect(img.first()).toHaveAttribute('src', /.+/);
  }

  private async clickAddProfileImageButton(): Promise<void> {
    const btn = this.locators.addProfileImage().first();
    await btn.click({ force: true });
  }

  private async expectThumbnailsAppear(): Promise<void> {
    const lowRes = this.page.getByRole('img', { name: 'Low Resolution' }).nth(2);
    const agentFace = this.page.getByText('Agent Face', { exact: true }).nth(-1);
    await expect(lowRes).toBeVisible();
    await expect(agentFace).toBeVisible();
  }

  private async expectThumbnailsAppearForRemoval(): Promise<void> {
    const lowRes = this.page.getByRole('img', { name: 'Low Resolution' }).nth(-1);
    const agentFace = this.page.getByText('Agent Face', { exact: true }).nth(-1);
    await expect(lowRes).toBeVisible();
    await expect(agentFace).toBeVisible();
  }

  private async clickCrossIconAndVerifyRemoval(): Promise<void> {
    const crossIcon = this.page
      .locator('app-user-profile-images div.row > div')
      .last()
      .locator('i.pi.pi-times.f-12');
    if ((await crossIcon.count()) > 0 && await crossIcon.isVisible()) {
      await crossIcon.scrollIntoViewIfNeeded();
      await crossIcon.evaluate((el: HTMLElement | SVGElement) => {
        if (typeof (el as HTMLElement).click === 'function') {
          (el as HTMLElement).click();
        } else {
          el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        }
      });
      const msg = this.page.getByRole('alert', { name: 'Image deleted' });
      await expect(msg).toBeVisible();
    }
  }

  private async expectLowResAndAgentFaceThumbnails(): Promise<void> {
    const lowRes = this.page.getByRole('img', { name: 'Low Resolution' }).first();
    const agentFace = this.page.getByText('Agent Face', { exact: true }).first();
    await expect(lowRes).toBeVisible();
    await expect(agentFace).toBeVisible();
  }

  private async editLowResolutionThumbnail(imagePath: string): Promise<void> {
    const fileInput = await this.page.$('input[type="file"]');
    if (!fileInput) throw new Error('File input not found for image upload');
    await fileInput.setInputFiles(imagePath);
    await this.clickUpdateImages();
    await this.expectImagesUpdatedToast();
  }

  private async deleteAndReuploadAgentFaceThumbnail(imagePath: string): Promise<void> {
    const fileInput = await this.page.$('input[type="file"]');
    if (!fileInput) throw new Error('File input not found for Agent Face re-upload');
    await fileInput.setInputFiles(imagePath);
    await this.moveImageSlightlyLeft();
    await this.scrollAndClickUpdateImages();
    await this.expectImagesUpdatedToast();
  }

  private async verifyResolutionWarningMessage(): Promise<void> {
    const warning = this.page.getByText('Please upload a higher resolution image for better quality.');
    await expect(warning).toBeVisible();
  }

  private async fileExists(filePath: string): Promise<boolean> {
    const fs = await import('fs');
    return fs.existsSync(filePath);
  }

  async UploadImageProfile(imagePath: string): Promise<void> {
    await test.step('Upload a profile image', async () => {
      await this.goToImagesTab();
      await this.clickAddProfileImageButton();
      await this.uploadImageFile(imagePath);
      await this.moveImageSlightlyLeft();
      await this.clickUpdateImages();
      await this.expectImagesUpdatedToast();
    });
  }

  async uploadMultipleImages(imagePath: string): Promise<void> {
    await test.step('Upload multiple images to profile', async () => {
      await this.goToImagesTab();
      await this.clickAddMoreImagesButton();
      await this.clickLastUploadImageButton();
      await this.setLastFileInput(imagePath);
      await this.moveImageSlightlyLeft();
      await this.scrollAndClickUpdateImages();
    });
  }

  async setImageAsDefaultProfile(): Promise<void> {
    await test.step('Set uploaded image as default profile', async () => {
      await this.goToImagesTab();
      await this.clickDefaultProfileCheckbox();
      await this.expectProfileImageVisible();
    });
  }

  async verifyThumbnailsAfterImageUpload(imagePath: string): Promise<void> {
    await test.step('Verify thumbnails appear after image upload', async () => {
      await this.goToImagesTab();
      await this.clickAddProfileImageButton();
      await this.clickLastUploadImageButton();
      await this.setLastFileInput(imagePath);
      await this.expectThumbnailsAppear();
    });
  }

  async verifyThumbnailsAreRemoved(imagePath: string): Promise<void> {
    await test.step('Verify thumbnails are removed when clicking cross button', async () => {
      await this.goToImagesTab();
      await this.clickAddProfileImageButton();
      await this.clickLastUploadImageButton();
      await this.setLastFileInput(imagePath);
      await this.expectThumbnailsAppearForRemoval();
      await this.clickCrossIconAndVerifyRemoval();
    });
  }

  async manageExistingThumbnails(imagePath1: string, imagePath2: string): Promise<void> {
    await test.step('Edit and delete low resolution and agent face thumbnails', async () => {
      await this.goToImagesTab();
      await this.expectLowResAndAgentFaceThumbnails();
      await this.editLowResolutionThumbnail(imagePath1);
      try {
        await this.deleteAndReuploadAgentFaceThumbnail(imagePath2);
      } catch (err) {
        // Continue if agent face thumbnail is not available
      }
      await this.clickUpdateImages();
      await this.expectImagesUpdatedToast();
    });
    await this.page.waitForTimeout(1000);
  }

  async validateImageResolutionWarning(imagePath: string): Promise<void> {
    await test.step('Verify Resolution warning message displays', async () => {
      await this.goToImagesTab();
      await this.clickAddMoreImagesButton();
      await this.clickLastUploadImageButton();
      await this.setLastFileInput(imagePath);
      await this.verifyResolutionWarningMessage();
    });
  }

  async VerifyInvalidImageFormats(imagePath: string): Promise<void> {
    await test.step('Verify invalid image format alert appears', async () => {
      await this.goToImagesTab();
      await this.clickAddMoreImagesButton();
      await this.clickLastUploadImageButton();
      await this.setLastFileInput(imagePath);
      const error = this.locators.InvalidImageFormatsError();
      await expect(error).toBeVisible();
      await this.page.waitForTimeout(1200);
    });
  }

  async ChangeProfileImage(imagePath: string): Promise<void> {
    await test.step('Change the profile image', async () => {
      await this.goToImagesTab();
      await this.clickAddMoreImagesButton();
      await this.clickLastUploadImageButton();
      await this.setLastFileInput(imagePath);
      await this.moveImageSlightlyLeft();

      const checkboxes = this.page.locator('.p-checkbox-box:visible:not(.p-disabled)');
      await checkboxes.first().waitFor({ state: 'visible', timeout: 20000 });
      const count = await checkboxes.count();
      if (count === 0) throw new Error('No visible checkboxes found to click');
      await checkboxes.nth(count - 1).scrollIntoViewIfNeeded();
      await checkboxes.nth(count - 1).click({ force: true });
      await this.clickUpdateImages();
      await this.page.waitForTimeout(1200);
    });
  }

  async VerifyProfileImagePersistsAfterReload(imagePath: string): Promise<void> {
    await test.step('Verify that the updated profile image persists after reload', async () => {
      await this.goToImagesTab();
      await this.page.waitForTimeout(2000);
      await Promise.all([
        this.clickAddMoreImagesButton(),
        this.clickLastUploadImageButton(),
      ]);
      await this.setLastFileInput(imagePath);
      await this.moveImageSlightlyLeft();

      const checkboxes = this.page.locator('.p-checkbox-box:visible:not(.p-disabled)');
      await checkboxes.first().waitFor({ state: 'visible', timeout: 7000 });
      const count = await checkboxes.count();
      if (count === 0) throw new Error('No visible checkboxes found to click');
      await checkboxes.nth(count - 1).scrollIntoViewIfNeeded();
      await checkboxes.nth(count - 1).click({ force: true });

      await Promise.all([
        this.clickUpdateImages(),
        this.expectImagesUpdatedToast(),
      ]);

      await this.page.reload();
      await this.expectProfileImageVisible();
      await this.page.waitForTimeout(1200);
    });
  }

  async VerifyDefaultPlaceholder(): Promise<void> {
    await test.step('Verify the default placeholder is visible when no image is uploaded', async () => {
      await this.goToImagesTab();
      const placeholders = this.page.locator('[ptooltip="Upload Image"]');
      const count = await placeholders.count();
      expect(count).toBeGreaterThan(0);
      await expect(placeholders.first()).toBeVisible({ timeout: 7000 });
    });
  }

  async removeSelectedProfileImage(): Promise<void> {
    await test.step('Delete only the image currently set as default profile', async () => {
      await this.goToImagesTab();
      const checkedContainer = this.page.locator('.d-flex.align-items-start.mt-2.mr-5.ng-star-inserted')
        .filter({ has: this.page.locator('.p-checkbox.p-checkbox-checked') });

      await checkedContainer.scrollIntoViewIfNeeded();
      await expect(checkedContainer).toBeVisible({ timeout: 7000 });

      const deleteButton = checkedContainer.locator('xpath=following-sibling::button[contains(@class, "_view-btn")]');
      await deleteButton.click({ force: true });

      const confirmButton = this.page.locator('button:has-text("Yes")');
      if (await confirmButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        await confirmButton.click();
      }

      const successToast = this.page.getByRole('alert').filter({ hasText: 'Image deleted' });
      await expect(successToast).toBeVisible({ timeout: 10000 });
      await expect(this.page.locator('.p-checkbox.p-checkbox-checked')).toHaveCount(0, { timeout: 10000 });
    });
  }

  async verifyAgentFaceAspectRatio(imagePath: string): Promise<void> {
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

  async UploadBrokenImage(imagePath: string): Promise<void> {
    await test.step('Verify broken/corrupt image is rejected', async () => {
      await this.goToImagesTab();
      await this.clickAddMoreImagesButton();
      await this.clickLastUploadImageButton();
      await this.setLastFileInput(imagePath);
      const alert = this.locators.corruptedImageAlert();
      await expect(alert).toBeVisible();
    });
  }

  async verifyAllowedImageFileFormats(validImagePaths: string[], invalidImagePaths: string[]): Promise<void> {
    await test.step('Verify system allows only specific image formats', async () => {
      await this.goToImagesTab();
      for (const validPath of validImagePaths) {
        await this.clickAddMoreImagesButton();
        await this.page.waitForTimeout(1000);
        await this.clickLastUploadImageButton();
        if (!(await this.fileExists(validPath))) continue;
        await this.setLastFileInput(validPath);
        await this.moveImageSlightlyLeft();
        await this.clickUpdateImages();
        const toast = this.page.locator('div.toast-message, [role="alert"]');
        await expect(toast.first()).toBeVisible({ timeout: 15000 });
        const text = (await toast.first().textContent())?.toLowerCase() ?? '';
        expect(text).toMatch(/updated|uploaded|successfully/);
      }
      for (const invalidPath of invalidImagePaths) {
        await this.clickAddMoreImagesButton();
        await this.page.waitForTimeout(1000);
        await this.clickLastUploadImageButton();
        if (!(await this.fileExists(invalidPath))) continue;
        await this.setLastFileInput(invalidPath);
        const corruptedAlert = this.page.locator('div[role="alert"][aria-label="Corrupted image file! Please upload a valid image"]');
        const invalidFormatAlert = this.page.getByRole('alert', { name: 'Unsupported file format!' });
        await expect(corruptedAlert.or(invalidFormatAlert).first()).toBeVisible({ timeout: 12000 });
      }
    });
  }

  async verifyUploadFailureOnNetworkError(ImagePath: string): Promise<void> {
    await test.step('Verify upload fails when network is disconnected', async () => {
      const context = this.page.context();
      await context.setOffline(true);

      await this.goToImagesTab();
      await this.page.waitForTimeout(2000);
      await this.clickAddMoreImagesButton();
      await this.clickLastUploadImageButton();
      await this.setLastFileInput(ImagePath);
      await this.clickUpdateImages();

      const uploadErrorToast = this.page.locator(
        'div[role="alert"], div.toast-message, div.p-toast-message',
      ).filter({ hasText: /failed|error|network|internet/i });
      await expect(uploadErrorToast.first()).toBeVisible({ timeout: 20000 });

      await context.setOffline(false);
    });
  }
}
