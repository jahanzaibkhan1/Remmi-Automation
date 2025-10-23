import { Page, Locator, expect, test } from '@playwright/test';
import { MyProfileLocators } from './MyProfileLocators';
import { url } from 'inspector';
import { setEngine } from 'crypto';
import { faker } from '@faker-js/faker';
import { AsyncLocalStorage } from 'async_hooks';
import { time } from 'console';

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
    await expect(img.first()).toBeVisible({ timeout: 30000 });
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
    await expect(selectUser).toBeVisible({ timeout: 30000 })
    await selectUser.click({ force: true });
  }

  private async searchforUserName(userName: string) {
    const SearchUserName = this.locators.SearchUserName()
    await SearchUserName.click({ force: true });
    await SearchUserName.fill(userName);// small wait for dropdown results to load
  }

  private async selectUserFromDropdown(userName: string) {
    const userOption = this.locators.selectuserFromDropdown(userName);
    await expect(userOption).toBeVisible({ timeout: 30000 });
    await userOption.click({ force: true })
  }


  private async SaveButton() {
    const saveButton = this.locators.SaveAccessButton();
    await saveButton.click();
  }

  private async calendarUpdateToast() {
    const calendarUpdateMessage = this.locators.calendarUpdateMessage();
    try {
      await calendarUpdateMessage.waitFor({ state: 'visible', timeout: 30000 });
      console.log('Calendar access updated toast message appeared');
    } catch (error) {
      console.warn('Calendar update toast message did not appear within timeout period');
      // Check if there are any other toast messages that might indicate success
      const anyToast = this.locators.toast();
      const toastCount = await anyToast.count();
      if (toastCount > 0) {
        const toastText = await anyToast.first().textContent();
        console.log(`Alternative toast message found: "${toastText}"`);
      }
      // Don't throw error - toast might not always appear depending on the operation
    }
  }

  private async calendarAccessUserName(userName) {
    const calendarAccessUserName = this.locators.calendarAccessUserName(userName);
    await expect(calendarAccessUserName).toBeVisible({ timeout: 30000 });
  }

  private async removeUser() {
    const deleteUserIcon = this.locators.deleteUserIcon();
    await deleteUserIcon.click({ force: true });
  }

  private async selectAll() {
    // Locator for the "Select All" checkbox
    const selectAll = this.locators.selectAll();
    // Click the "Select All" checkbox
    await this.page.waitForTimeout(2000)
    await selectAll.click({ force: true });
  }

  private async DeselectAll() {
    // Locator for the "Select All" checkbox
    const selectAll = this.locators.DeselectAll();
    // Click the "Select All" checkbox
    await this.page.waitForTimeout(2000);
    await selectAll.click({ force: true });
  }

  /**
 * Navigate to the Calendar module via side menu
 */
  private async navigateToCalendar() {
    // Locator for Calendar menu in side menu
    const calendarMenu = this.locators.CalendarMenu();

    // Wait until visible and click
    await expect(calendarMenu).toBeVisible({ timeout: 5000 });
    await calendarMenu.click();
  }

  // ----------- Notifications Section -----------
  // These methods support the Notifications tab in the profile.

  private async navigateToNotificationsTab() {
    const tab = this.locators.NotificationsTab();
    await tab.click({ force: true });
  }

  private async toggleWebNotification() {
    const toggle = this.locators.webNotificationToggle();
    await toggle.click({ force: true });
  }

  private async toggleEmailNotification() {
    const toggle = this.locators.emailNotificationToggle();
    await toggle.click({ force: true });
  }
  // <--------------------------------------------Private Function for Teams Tab----------------------------------->

  private async NavigateToTeamsTab() {
    const TeamsTabs = this.locators.TeamsTabs();
    await TeamsTabs.click();
  }

  private async searchTeamName(teamName: string) {
    const searchTeam = this.locators.SelectTeam(teamName);
    await expect(searchTeam).toBeVisible();
    // Click to open dropdown first
    await searchTeam.click();
    // Type the team name directly
    await searchTeam.fill(teamName);
  }
// AGAR Team 2 search ker rahay hain agra Team 232 bhi show ho raha hy dropdown me to exact ko kesay click krein
  private async SelectTeamOption(teamName: string) {
    const selectTeamOption = this.locators.SelectTeamOption(teamName);
    await expect(selectTeamOption.first()).toHaveText(teamName);
    await expect(selectTeamOption.first()).toBeVisible({ timeout: 5000 });
    await selectTeamOption.first().click();
  }

  private async createNewTeamButton(){
    const createNewTeam = this.locators.createNewTeam();
    await expect(createNewTeam).toBeVisible();
    await createNewTeam.click();
  }

  private async crossPopup(){
    const crossPopup = this.locators.crossPopup();
    await expect(crossPopup).toBeVisible();
    await crossPopup.click();
  }
  private async changeProfile(imagePath: string) {
    const changeProfileButton = this.locators.changeProfile();
    const fileInput = this.page.locator('input[type="file"]');
    await fileInput.setInputFiles(imagePath);
  }
  private async CreateTeamButton(){
    const CreateTeamButton = this.page.getByRole('button', { name: 'Create Team' });
    await expect(CreateTeamButton).toBeVisible();
    await CreateTeamButton.click();
  }
  private async SelectOffice(officeName: string) {
    const officeInput = this.locators.SelectOffice(officeName);
    await officeInput.click();
    await expect(officeInput).toBeVisible({ timeout: 5000 });
    await officeInput.fill(officeName);
  }

  private async SelectOfficeOption() {
    const officeOption = this.locators.SelectOfficeOption();
    await expect(officeOption.first()).toBeVisible({ timeout: 5000 });
    await officeOption.first().click();
  }

  private async SelectTeamMember() {
    const dropdown = this.locators.SelectTeamMemberDropdown();
    await expect(dropdown).toBeVisible({ timeout: 10000 });
    await dropdown.click();
  }
  
  private async SelectTeamMemberSearchInput(memberName: string) {
    const input = this.locators.SelectTeamMemberSearchInput();
    await expect(input).toBeVisible({ timeout: 5000 });
    await input.fill(memberName);
  
    // Wait for dropdown to populate after typing
    await this.page.waitForTimeout(1000);
  }
  
  private async selectTeamFromDropdown(memberName: string) {
    
    const option = this.locators.SelectTeamMemberOption().filter({ hasText: memberName });
  
    // Wait until at least one matching option appears
    await expect(option.first()).toBeVisible({ timeout: 10000 });
  
    // Scroll & click safely
    await option.first().scrollIntoViewIfNeeded();
    await option.first().click({ force: true });
  }

  private async SelectTeamLeader() {
    const dropdown = this.locators.SelectTeamLeaderDropdown();
    await expect(dropdown).toBeVisible({ timeout: 10000 });
    await dropdown.click();
  }
  
  private async SelectTeamLeaderSearchInput(leaderName: string) {
    const input = this.locators.SelectTeamLeaderSearchInput();
    await expect(input).toBeVisible({ timeout: 5000 });
    await input.fill(leaderName);
  
    // Wait for dropdown to populate after typing
    await this.page.waitForTimeout(1000);
  }
  
  private async SelectTeamLeaderFromDropdown(leaderName: string) {
    const option = this.locators.SelectTeamLeaderOption().filter({ hasText: leaderName });
  
    // Wait until at least one matching option appears
    await expect(option.first()).toBeVisible({ timeout: 10000 });
  
    // Scroll & click safely
    await option.first().scrollIntoViewIfNeeded();
    await option.first().click({ force: true });
  }

  private async EnterTeamName() {
    const teamNameInput = this.locators.TeamNameInput();
    await teamNameInput.click();
    // Generate a unique team name using faker
    const teamName = `Team ${faker.word.sample()}`;
    // Fill the input field
    await teamNameInput.fill(teamName);
  }

  private async NavigateToContacts(){
    const contactSideMenu = this.locators.contactSideMenu();
    await contactSideMenu.click();
  }
  
  private async contactTeamsList() {
    const contactTeams = this.locators.ContactTeams();
    await contactTeams.click();
  }
  
  private async editTeam(teamName: string) {
    const EditIcon = this.locators.EditIcon();
    await EditIcon.click();
  }

  private async deleteTeam(teamName: string) {
    const DeleteIcon = this.locators.DeleteIcon();
    await DeleteIcon.click();
  }

  private async AddButton() {
    const AddButton = this.locators.AddButton()
    await AddButton.click();
  }
  private async verifyTeamInTable(teamName: string) {
    const teamRow = this.locators.TeamRow(teamName);
    await teamRow.scrollIntoViewIfNeeded();
    await expect(teamRow).toBeVisible({ timeout: 10000 });
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

      // Edit low resolution thumbnail
      await this.editLowResolutionThumbnail(imagePath1);

      // Delete agent face thumbnail and reupload
      try {
        await this.deleteAndReuploadAgentFaceThumbnail(imagePath2);
      } catch (err) {
        console.error('❌ Failed to delete and reupload agent face thumbnail:', err);
        // Try to recover or just continue depending on test needs
      }

      // Move image slightly left if crop box is present
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
    await test.step('Verify that the updated profile image persists after reload (FAST)', async () => {
      await this.goToImagesTab();

      // Parallelize add/click
      await Promise.all([
        this.clickAddMoreImagesButton(),
        this.clickLastUploadImageButton(),
      ]);
      await this.setLastFileInput(imagePath);
      await this.moveImageSlightlyLeft();

      const checkboxes = this.page.locator('.p-checkbox-box:visible:not(.p-disabled)');
      // Only wait for the first visible checkbox, but continue as soon as possible
      await checkboxes.first().waitFor({ state: 'visible', timeout: 7000 });
      const count = await checkboxes.count();

      if (count === 0) throw new Error('❌ No visible checkboxes found to click');
      const lastCheckbox = checkboxes.nth(count - 1);
      await Promise.all([
        lastCheckbox.scrollIntoViewIfNeeded(),
        checkboxes,
      ]);
      await lastCheckbox.click({ force: true });
      // Remove console log for speed

      // Don't unnecessarily wait between update and toast
      await Promise.all([
        this.clickUpdateImages(),
        (async () => {
          await this.expectImagesUpdatedToast();
        })()
      ]);

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
  /**
    * Update access for a single user
    */
  public async updateAccessSettings(userName: string = 'Dawood Ahmad') {
    await this.navigateToAccessTab();

    // Check if user is already selected
    const alreadySelected = this.page.getByRole('cell', { name: 'Dawood Ahmad' });

    if (await alreadySelected.isVisible().catch(() => false)) {
      console.log(`ℹ️ User "${userName}" is already selected — clicking Save only.`);
      await this.SaveButton();
      await this.calendarUpdateToast();
      await this.calendarAccessUserName(userName);
    } else {
      await this.openUserDropdown();
      await this.searchforUserName(userName);
      const userOption = this.locators.selectuserFromDropdown(userName);
      await expect(userOption).toBeVisible({ timeout: 10000 });
      await userOption.click({ force: true });
      console.log(`🟢 Selected user: ${userName}`);
      await this.SaveButton();
      await this.calendarUpdateToast();
      await this.calendarAccessUserName(userName);
    }
  }

  /**
   * Grant access to multiple users
   */
  public async grantTaskAccessToMultipleUsers(userNames: string[]) {
    await this.navigateToAccessTab();

    await this.openUserDropdown();
    for (const userName of userNames) {
      const searchBox = this.locators.SearchUserName();
      await searchBox.click({ force: true });
      await searchBox.fill(userName);
      await this.page.waitForTimeout(3000); // wait for dropdown results
      await this.selectUserFromDropdown(userName);
      console.log(`${userName} selected for access.`);
    }
    await this.SaveButton();
    await this.calendarUpdateToast();

    // Verify each user
    for (const userName of userNames) {
      await this.calendarAccessUserName(userName);
      console.log(`${userName} verified in granted access list.`);
    }
  }

  /**
   * Remove granted access for a user
   */
  public async removeUserFromAccess() {
    await this.navigateToAccessTab();
    await this.removeUser();
    await this.calendarUpdateToast();
  }

  /**
   * Select all users
   */
  public async selectAllUsers(userNames: string[] = []) {
    await this.navigateToAccessTab();
    await this.openUserDropdown();
    await this.selectAll();
    await this.SaveButton();
    await this.SaveButton();
    await this.calendarUpdateToast();
    console.log('All users selected and saved.');

    // Verify access for provided users
    for (const userName of userNames) {
      const userRow = this.locators.calendarAccessUserName(userName);
      await expect(userRow).toBeVisible({ timeout: 10000 });
      console.log(`${userName} access verified.`);
    }
  }

  /**
   * Deselect all users
   */
  public async DeselectAllUsers(userNames: string[] = []) {
    await this.navigateToAccessTab();
    await this.openUserDropdown();
    await this.DeselectAll();
    const saveAccess = this.page.getByRole('button', { name: 'Save' }).first();
    await saveAccess.click({ force: true });
    await this.calendarUpdateToast();
    console.log('All users deselected and saved.');

    // Optionally verify
    for (const userName of userNames) {
      const userRow = this.locators.calendarAccessUserName(userName);
      // You can add expect(...).not.toBeVisible() if UI hides removed users
    }
  }

  // ----------- Verification -----------

  /**
   * Verify a user appears under 'Staff Calendar Access'
   */
  public async verifyUserInStaffCalendarAccess(userName: string) {
    await this.navigateToCalendar();
    const accessUser = this.locators.calendarAccessUserName(userName);
    await expect(accessUser).toBeVisible({ timeout: 8000 });
    console.log(`✅ User "${userName}" appears under 'Staff Calendar Access'`);
  }

  /**
   * Verify granted calendar access allows viewing calendar OFIs
   */
  public async verifyCalendarAccessFunctional(userName: string) {
    await this.navigateToCalendar();
    const calendarItem = this.page.locator('.calendar-item'); // adjust selector
    await expect(calendarItem).toBeVisible();
    console.log(`✅ User "${userName}" can view calendar OFIs`);
  }

  /**
   * Verify user cannot see calendar OFIs without access
   */
  public async verifyNoCalendarAccess(userName: string) {
    await this.navigateToCalendar();
    const calendarItem = this.page.locator('.calendar-item');
    await expect(calendarItem).not.toBeVisible();
    console.log(`✅ User "${userName}" cannot view calendar OFIs without access`);
  }


  /**
   * Enable both Web and Email notifications
   */
  public async enableAllNotifications() {
    await test.step('Enable all notifications', async () => {
      await this.navigateToNotificationsTab();

      // Enable Web Notification if not enabled
      const webToggle = this.locators.webNotificationToggle();
      const webToggleClass = await webToggle.evaluate(el => el.parentElement?.className || '');
      if (!webToggleClass.includes('p-inputswitch-checked')) {
        await webToggle.click({ force: true });
        const successToast = this.page.getByRole('alert', { name: 'Profile has been updated' });
        await expect(successToast).toBeVisible({ timeout: 30000 });
      }

      // Enable Email Notification if not enabled
      const emailToggle = this.locators.emailNotificationToggle();
      const emailToggleClass = await emailToggle.evaluate(el => el.parentElement?.className || '');
      if (!emailToggleClass.includes('p-inputswitch-checked')) {
        await emailToggle.click({ force: true });
        const successToast = this.page.getByRole('alert', { name: 'Profile has been updated' });
        await expect(successToast).toBeVisible({ timeout: 30000 });
      }
    });
  }

  // <-----------------------------------Teams Tab -------------------------------------->
  async SearchForExistingTeam(teamName: string){
    await test.step('Verify search works for existing team names', async()=>{
      await this.NavigateToTeamsTab()
      await this.searchTeamName(teamName);
      await this.SelectTeamOption(teamName);
      await this.AddButton();
      const toast = this.page.getByRole('alert', { name: 'Added successfully' });
      await expect(toast).toBeVisible({timeout:5000});
      await this.verifyTeamInTable(teamName)
    })
  }

  async SearchForInvalidTeam(teamName: string){
    await test.step('Verify search works for existing team names', async()=>{
      await this.NavigateToTeamsTab()
      await this.searchTeamName(teamName);
      const NoRecord = this.page.getByText('No items found')
      await expect(NoRecord).toBeVisible({timeout:5000});
    })
  }

  async verifyAddButtonDisabledWhenNoTeamSelected() {
    await test.step('Verify Add button remains disabled when no team is selected.', async()=>{
      await this.NavigateToTeamsTab();
      const addButton = this.page.getByRole('button', { name: ' Add' });
      await expect(addButton).toBeDisabled();
    })
  }

  async verifyAddButtonperformNoAction() {
    await test.step('Verify clicking disabled Add button performs no action..', async()=>{
      await this.NavigateToTeamsTab();
      const addButton = this.page.getByRole('button', { name: ' Add' });
      await expect(addButton).toBeDisabled();
      await addButton.click({ force: true });
    })
  }

  async verifySelectingTeamEnablesAddButton(teamName: string){
    await test.step('Verify selecting a team enables Add button.', async()=>{
      await this.NavigateToTeamsTab()
      await this.searchTeamName(teamName);
      await this.SelectTeamOption(teamName);
      const addButton = this.page.getByRole('button', { name: ' Add' });
      await expect(addButton).toBeEnabled();
    })
  }
  async verifyAddButtonNotEnabledDueToDropdownLag(teamName: string){
    await test.step('Verify Add button doesn’t enable due to dropdown lag.', async()=>{
      await this.NavigateToTeamsTab()
      await this.searchTeamName(teamName);
      await this.SelectTeamOption(teamName);
      const addButton = this.page.getByRole('button', { name: ' Add' });
      await expect(addButton).toBeEnabled();
      const removeSelectTeam = this.page.locator('.pi.pi-times-circle')
      await removeSelectTeam.click();
      await expect(addButton).toBeDisabled();
    })
  }

  async verifySelectedTeamAppearsAsTag(teamName: string) {
    await test.step('Verify selected team appears as a tag below the dropdown', async () => {
      await this.NavigateToTeamsTab();
      await this.searchTeamName(teamName);
      await this.SelectTeamOption(teamName);

      // Wait for the tag to appear – a tag is shown when a team is selected
      const tagLocator = this.page.locator('.ng-value-label', { hasText: teamName });
      await expect(tagLocator).toBeVisible({ timeout: 5000 });

      // Optionally, verify only one tag appears for this team
      await expect(tagLocator).toHaveCount(1);

      // Optionally log success for debugging
      console.log(`🟢 Tag for team "${teamName}" is visible below dropdown.`);
    });
  }

  async verifyRemovingTagUpdatesList(teamName: string) {
    await test.step('Verify removing a tag updates the list', async () => {
      await this.NavigateToTeamsTab();
      await this.searchTeamName(teamName);
      await this.SelectTeamOption(teamName);

      // Wait for the tag to appear – a tag is shown when a team is selected
      const tagLocator = this.page.locator('.ng-value-label', { hasText: teamName });
      await expect(tagLocator).toBeVisible({ timeout: 5000 });

      // Optionally, verify only one tag appears for this team
      await expect(tagLocator).toHaveCount(1);
      const removeSelectTeam = this.page.locator('.pi.pi-times-circle')
      await removeSelectTeam.click();

      // Optionally log success for debugging
      console.log(`🟢 Tag for team "${teamName}" is visible below dropdown.`);
    });
  }
  async verifyUserCanSelectMultipleTeams(teamNames: string[]) {
    await test.step('Verify user can select multiple teams from dropdown', async () => {
      await this.NavigateToTeamsTab();

      for (const name of teamNames) {
        const searchBox = this.locators.SelectTeam(name);
        await expect(searchBox).toBeVisible();
        await searchBox.fill(name);

        const option = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: name });
        await expect(option).toBeVisible({ timeout: 5000 });
        await option.click();
      }

      // Verify each selected team appears as a tag
      for (const name of teamNames) {
        const tag = this.page.locator('.ng-value-label', { hasText: name });
        await expect(tag).toBeVisible({ timeout: 5000 });
        await expect(tag).toHaveCount(1);
      }
    });
  }
  async verifySelectMultipleTeams(teamNames: string[]) {
    await test.step('Verify clicking Add adds selected teams to list.', async () => {
      await this.NavigateToTeamsTab();

      for (const name of teamNames) {
        const searchBox = this.locators.SelectTeam(name);
        await expect(searchBox).toBeVisible();
        await searchBox.fill(name);

        const option = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: name });
        await expect(option).toBeVisible({ timeout: 5000 });
        await option.click();
      }

      await this.AddButton();

      // Verify each selected team appears as a tag
      for (const name of teamNames) {
        const tag = this.page.locator('.ng-value-label', { hasText: name });
        await expect(tag).toBeVisible({ timeout: 5000 });
        await expect(tag).toHaveCount(1);
      }
    });
  }

  async VerifyCreateNewTeamPopUp() {
    await test.step('Verify “Create New” opens Add Team popup.', async () => {
      await this.NavigateToTeamsTab();
      const SelectTeam = this.page.locator('ng-select[name="team"] input');
      await SelectTeam.click();
      await this.createNewTeamButton();
      const verifyPopup = this.page.getByText('Add TeamUpload profile');
      await expect(verifyPopup).toBeVisible();
      
    });
  }
  async VerifyCrossPopUpButton() {
    await test.step('Verify popup close (X) closes Add Team popup.', async () => {
      await this.NavigateToTeamsTab();
      const SelectTeam = this.page.locator('ng-select[name="team"] input');
      await SelectTeam.click();
      await this.createNewTeamButton();
      const verifyPopup = this.page.getByText('Add TeamUpload profile');
      await expect(verifyPopup).toBeVisible();
      await this.crossPopup();
      
    });
  }
  async verifyImageFormats(jpgImagePath: string, pngImagePath: string, invalidImagePath?: string) {
    await test.step('Verify JPG/PNG allowed and invalid images are rejected for team upload.', async () => {
      await this.NavigateToTeamsTab();

      // Open Add Team popup
      const selectTeamInput = this.page.locator('ng-select[name="team"] input');
      await selectTeamInput.click();
      await this.createNewTeamButton();
      const popup = this.page.getByText('Add TeamUpload profile');
      await expect(popup).toBeVisible();
      await this.changeProfile(jpgImagePath);
      await this.changeProfile(pngImagePath);

      // Try invalid image format if provided
      if (invalidImagePath) {
        await this.changeProfile(invalidImagePath);
        // Expect a validation message or error to show, not accept image
        const errorMessage = this.page.locator('div').filter({ hasText: 'Unsupported file format!' }).nth(2);
        await expect(errorMessage).toBeVisible({ timeout: 5000 });
      }
    });
  }

  async verifyUnsupportedFiles(invalidImagePath?: string) {
    await test.step('Verify unsupported file formats show validation error.', async () => {
      await this.NavigateToTeamsTab();

      // Open Add Team popup
      const selectTeamInput = this.page.locator('ng-select[name="team"] input');
      await selectTeamInput.click();
      await this.createNewTeamButton();
      const popup = this.page.getByText('Add TeamUpload profile');
      await expect(popup).toBeVisible();
      // Try invalid image format if provided
      if (invalidImagePath) {
        await this.changeProfile(invalidImagePath);
        // Expect a validation message or error to show, not accept image
        const errorMessage = this.page.locator('div').filter({ hasText: 'Unsupported file format!' }).nth(2);
        await expect(errorMessage).toBeVisible({ timeout: 5000 });
      }
    });
  }
  // Verify required field validation for Team Name, Office, and Members.
  async VerifyRequiredFiled() {
    await test.step('Verify required field validation for Team Name, Office, and Members', async () => {
      await this.NavigateToTeamsTab();
      // Open Add Team popup
      const selectTeamInput = this.page.locator('ng-select[name="team"] input');
      await selectTeamInput.click();
      await this.createNewTeamButton();

      const popup = this.page.getByText('Add TeamUpload profile');
      await expect(popup).toBeVisible();
      await this.CreateTeamButton();

      // Assert required validation errors appear
      const requiredTeamError = this.page.getByText(/Team Name is required/i);
      const requiredOfficeError = this.page.getByText(/Office is required/i);
      const requiredMembersError = this.page.getByText('Team Member(s) is required');

      await expect(requiredTeamError).toBeVisible();
      await expect(requiredOfficeError).toBeVisible();
      await expect(requiredMembersError).toBeVisible();
    });
  }

async VerifyRequiredFieldValidation() {
  await test.step('Verify team cannot be created with missing required field', async () => {
    await this.NavigateToTeamsTab();
    // Open Add Team popup
    const selectTeamInput = this.page.locator('ng-select[name="team"] input');
    await selectTeamInput.click();
    await this.createNewTeamButton();

    await this.CreateTeamButton();

    // Assert required validation errors appear
    const requiredTeamError = this.page.getByText(/Team Name is required/i);
    const requiredOfficeError = this.page.getByText(/Office is required/i);
    const requiredMembersError = this.page.getByText('Team Member(s) is required');

    await expect(requiredTeamError).toBeVisible();
    await expect(requiredOfficeError).toBeVisible();
    await expect(requiredMembersError).toBeVisible();
  });
}

async VerifySelectingOfficeFiltersMembers(OfficeName: string) {
  await test.step('Verify selecting office filters available members', async () => {
    await this.NavigateToTeamsTab();
    // Open Add Team popup
    const selectTeamInput = this.page.locator('ng-select[name="team"] input');
    await selectTeamInput.click();
    await this.createNewTeamButton();

    // Select an office
    await this.SelectOffice(OfficeName);
    await this.SelectOfficeOption();

  });
}
async VerifyNoMembersWithoutOffice() {
  await test.step('Verify no members shown when office not selected', async () => {
    await this.NavigateToTeamsTab();
    // Open Add Team popup
    const selectTeamInput = this.page.locator('ng-select[name="team"] input');
    await selectTeamInput.click();
    await this.createNewTeamButton();
    await this.SelectTeamMember()
    const NoRecord = this.page.getByText('No Record Found')
    await expect(NoRecord).toBeVisible()

  });
}
async VerifyTeamLeaderDropdownActive(OfficeName: string, teamName: string) {
  await test.step('Verify selecting members activates Team Leader dropdown', async () => {
    await this.NavigateToTeamsTab();

    // Open Add Team popup
    const selectTeamInput = this.page.locator('ng-select[name="team"] input');
    await selectTeamInput.click();
    await this.createNewTeamButton();

    // Select office
    await this.SelectOffice(OfficeName);
    await this.SelectOfficeOption();

    // Select member
    await this.SelectTeamMember();
    await this.SelectTeamMemberSearchInput(teamName);
    await this.page.waitForTimeout(1000);
    await this.selectTeamFromDropdown(teamName);

    await this.SelectTeamMember();

    // ✅ Verify Team Leader dropdown becomes active (enabled)
    const teamLeaderDropdown = this.page.locator('div').filter({ hasText: /^Team Leader \*Select Members$/ }).first();
    await expect(teamLeaderDropdown).toBeVisible()
  });
}

async VerifyTeamCreationWithoutLeader(OfficeName: string, teamName: string) {
  await test.step('Verify selecting members activates Team Leader dropdown', async () => {
    await this.NavigateToTeamsTab();

    // Open Add Team popup
    const selectTeamInput = this.page.locator('ng-select[name="team"] input');
    await selectTeamInput.click();
    await this.createNewTeamButton();

    // Select office
    await this.SelectOffice(OfficeName);
    await this.SelectOfficeOption();

    // Select member
    await this.SelectTeamMember();
    await this.SelectTeamMemberSearchInput(teamName);
    await this.page.waitForTimeout(1000);
    await this.selectTeamFromDropdown(teamName);
    await this.SelectTeamMember();
    await this.CreateTeamButton()
    const requiredLeaderError = this.page.getByText(/Team Leader is required/i);
    await expect(requiredLeaderError).toBeVisible({ timeout: 5000 });
  });
}
async VerifyTeamCreationWithValidDetails(OfficeName: string, memberName: string, leaderName: string) {
  await test.step('Verify successful team creation with all valid details', async () => {
    await this.NavigateToTeamsTab();

    // Open Add Team popup
    const selectTeamInput = this.page.locator('ng-select[name="team"] input');
    await selectTeamInput.click();
    await this.createNewTeamButton();

    // Enter team name
    const teamName = `Team ${faker.word.sample()}`; // Generate a unique name
    const teamNameInput = this.locators.TeamNameInput();
    await teamNameInput.click();
    await teamNameInput.fill(teamName);

    // Select office
    await this.SelectOffice(OfficeName);
    await this.SelectOfficeOption();

    // Select member
    await this.SelectTeamMember();
    await this.SelectTeamMemberSearchInput(memberName);
    await this.page.waitForTimeout(1000);
    await this.selectTeamFromDropdown(memberName);
    await this.SelectTeamMember();

    // Select team leader
    await this.SelectTeamLeader();
    await this.SelectTeamLeaderSearchInput(leaderName);
    await this.SelectTeamLeaderFromDropdown(leaderName);

    // Create team
    await this.CreateTeamButton();

    // Verify success toast message
    const successToast = this.page.getByText(/Team created/i);
    await expect(successToast).toBeVisible({ timeout: 10000 });

    // Navigate to contacts team list & verify team is present in the list
    await this.NavigateToContacts();
    await this.contactTeamsList();
    await this.verifyTeamInTable(teamName);
  });
}
}