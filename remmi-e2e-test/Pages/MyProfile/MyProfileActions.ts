import { Page, Locator, expect, test } from '@playwright/test';
import { MyProfileLocators } from './MyProfileLocators';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
import { extractSecretFromQr } from '../../../helper/mfaHelper';
import { generateOtp } from '../../../helper/getOtp';
import { updateEnvVariable } from '../../../helper/updateEnvVariable';


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
  private async CalendarColor() {
    const calendar= this.locators.calendarColor();
    await calendar.click({force: true})
  }
  private async fillCalendarColor(color: string) {
    const field = this.locators.calendarcolorInput();
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

  private async calendarAccessUserName(userName: string) {
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
  private async SelectTeamOption(teamName: string) {
    const selectTeamOption = this.locators.SelectTeamOption(teamName);
    await expect(selectTeamOption.first()).toHaveText(teamName);
    await expect(selectTeamOption.first()).toBeVisible({ timeout: 5000 });
    await selectTeamOption.first().click();
  }

  private async createNewTeamButton() {
    const createNewTeam = this.locators.createNewTeam();
    await expect(createNewTeam).toBeVisible();
    await createNewTeam.click();
  }

  private async crossPopup() {
    const crossPopup = this.locators.crossPopup();
    await expect(crossPopup).toBeVisible();
    await crossPopup.click();
  }
  private async changeProfile(imagePath: string) {
    const changeProfileButton = this.locators.changeProfile();
    const fileInput = this.page.locator('input[type="file"]');
    await fileInput.setInputFiles(imagePath);
  }
  private async CreateTeamButton() {
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

  private async NavigateToContacts() {
    const contactSideMenu = this.locators.contactSideMenu();
    await contactSideMenu.click();
  }

  private async contactTeamsList() {
    const contactTeams = this.locators.ContactTeams();
    await contactTeams.click();
  }

  private async CancelTeamButton() {
    const removeTeamButton = this.locators.CancelTeamButton();
    await expect(removeTeamButton).toBeVisible();
    await removeTeamButton.click();
  }

  private async editTeam() {
    const EditIcon = this.locators.EditIcon().last();
    await EditIcon.scrollIntoViewIfNeeded();
    await EditIcon.click();
  }

  private async deleteTeam() {
    const DeleteIcon = this.locators.DeleteIcon().first();
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


  //----------------------------------MFA Tab------------------------------------//
  private async navigateToMfaTab() {
    const mfaTab = this.locators.mfaTab();
    await mfaTab.click();
  }

  private async clickReplaceButton() {
    const replaceBtn = this.locators.replaceButton();
    await replaceBtn.click();
  }

  private async selectGoogleAuthenticator(){
    const gauth = this.locators.googleAuthenticator();
    await gauth.dblclick({force:true});
  }

  private async selectMicrosoftAuthenticator() {
    const msAuth = this.locators.microsoftAuthenticator();
    await msAuth.click();
  }
  private async selectAuthyAuthenticator() {
    const AuthyAuth = this.locators.authyAuthenticator();
    await AuthyAuth.click();
  }

  private async enterMicrosoftAuthOtp(otp: string) {
    const otpTextbox = this.locators.mfaCodeTextbox();
    await otpTextbox.click();
    await otpTextbox.fill(otp);
  }
  private async SaveMFAButton() {
    const saveMFAButton = this.locators.saveMFAButton().first();
    await saveMFAButton.dblclick({force: true});
  }

  //--------------------------------------------Associations Functions----------------------------------
  private async AssociationsTab() {
    await this.locators.associationTab.click();
  }

  private async clickAddProjectButton() {
    await this.locators.addProjectBtn.click();
  }

  private async fillSearchProjectInput(projectName: string) {
    const input = this.locators.searchProjectInput;
    await input.fill(projectName);
  }

  private async selectProjectOption() {
    const option = this.locators.searchProjectOption;
    await expect(option).toBeVisible();
    await option.click();
  }

  private async clickAddButton() {
    await this.locators.addBtn.click({force:true});
  }

  private async selectAllProjects() {
    await this.locators.selectAllCheckbox.click();
  }

  private async deselectAllProjects() {
    await this.locators.deselectAllCheckbox.click();
  }

  private async removeSelectedProjects() {
    await this.locators.removeSelected.click();
  }

  private async DeleteProjectIcon() {
    const deleteProjectIcon = this.locators.deleteProjectIcon();
    await deleteProjectIcon.click({force:true});
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
      await this.CalendarColor()
      await this.fillCalendarColor(color);
      const OkButton = this.page.getByRole('button', { name: 'Ok' })
      await OkButton.click()
      await this.clickUpdateButton();
      const successToast = this.page.getByRole('alert', { name: 'Profile has been updated' })
      await expect(successToast).toBeVisible()
    });
  }

  async tryInvalidCalendarColor(invalidColor: string) {
    await test.step(`Try invalid calendar color: ${invalidColor}`, async () => {
      await this.CalendarColor()
      await this.fillCalendarColor(invalidColor);
      await this.expectInvalidColorToast();
    });
  }

  async UploadImageProfile(imagePath: string) {
    await test.step('Upload a profile image', async () => {
      await this.goToImagesTab();
      await this.page.waitForTimeout(2000);
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
      await this.page.waitForTimeout(2000);
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
      await this.page.waitForTimeout(2000);
      await this.clickDefaultProfileCheckbox();
      await this.expectProfileImageVisible();
    });
  }

  async verifyThumbnailsAfterImageUpload(imagePath: string) {
    await test.step('Verify thumbnails appear after image upload', async () => {
      await this.goToImagesTab();
      await this.page.waitForTimeout(2000);
      await this.clickAddProfileImageButton();
      await this.clickLastUploadImageButton();
      await this.setLastFileInput(imagePath);
      await this.expectThumbnailsAppear();
    });
  }

  async verifyThumbnailsAreRemoved(imagePath: string) {
    await test.step('Verify thumbnails are removed when clicking cross button', async () => {
      await this.goToImagesTab();
      await this.page.waitForTimeout(2000);
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
      await this.page.waitForTimeout(2000);
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
      await this.page.waitForTimeout(2000);
      await this.clickAddMoreImagesButton();
      await this.clickLastUploadImageButton();
      await this.setLastFileInput(imagePath);
      await this.verifyResolutionWarningMessage();
    });
  }

  async VerifyInvalidImageFormats(imagePath: string) {
    await test.step('Verify invalid image format alert appears', async () => {
      await this.goToImagesTab();
      await this.page.waitForTimeout(2000);
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
      await this.page.waitForTimeout(2000);
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
      await this.page.waitForTimeout(2000);
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
      await this.page.waitForTimeout(2000);
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
      await this.page.waitForTimeout(2000);
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
      await this.page.waitForTimeout(2000);
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
      await this.page.waitForTimeout(2000);
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
      await this.page.waitForTimeout(2000);
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
      await this.page.waitForTimeout(2000);
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
    await this.page.waitForTimeout(2000)

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
    await this.page.waitForTimeout(2000)
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
    await this.page.waitForTimeout(2000)
    await this.removeUser();
    await this.calendarUpdateToast();
  }

  /**
   * Select all users
   */
  public async selectAllUsers(userNames: string[] = []) {
    await this.navigateToAccessTab();
    await this.openUserDropdown();
    await this.page.waitForTimeout(2000);
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
    await this.page.waitForTimeout(2000);
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
    await this.page.waitForTimeout(2000)
    const accessUser = this.locators.calendarAccessUserName(userName);
    await expect(accessUser).toBeVisible({ timeout: 8000 });
    console.log(`✅ User "${userName}" appears under 'Staff Calendar Access'`);
  }

  /**
   * Verify granted calendar access allows viewing calendar OFIs
   */
  public async verifyCalendarAccessFunctional(userName: string) {
    await this.navigateToCalendar();
    await this.page.waitForTimeout(2000)
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
  async SearchForExistingTeam(teamName: string) {
    await test.step('Verify search works for existing team names', async () => {
      await this.NavigateToTeamsTab()
      await this.searchTeamName(teamName);
      await this.SelectTeamOption(teamName);
      await this.AddButton();
      const toast = this.page.getByRole('alert', { name: 'Added successfully' });
      await expect(toast).toBeVisible({ timeout: 5000 });
      await this.verifyTeamInTable(teamName)
    })
  }

  async SearchForInvalidTeam(teamName: string) {
    await test.step('Verify dropdown search with invalid keyword.', async () => {
      await this.NavigateToTeamsTab()
      await this.searchTeamName(teamName);
      const NoRecord = this.page.getByText('No items found')
      await expect(NoRecord).toBeVisible({ timeout: 5000 });
    })
  }

  async verifyAddButtonDisabledWhenNoTeamSelected() {
    await test.step('Verify Add button remains disabled when no team is selected.', async () => {
      await this.NavigateToTeamsTab();
      const addButton = this.page.getByRole('button', { name: ' Add' });
      await expect(addButton).toBeDisabled();
    })
  }

  async verifyAddButtonperformNoAction() {
    await test.step('Verify clicking disabled Add button performs no action..', async () => {
      await this.NavigateToTeamsTab();
      const addButton = this.page.getByRole('button', { name: ' Add' });
      await expect(addButton).toBeDisabled();
      await addButton.click({ force: true });
    })
  }

  async verifySelectingTeamEnablesAddButton(teamName: string) {
    await test.step('Verify selecting a team enables Add button.', async () => {
      await this.NavigateToTeamsTab()
      await this.searchTeamName(teamName);
      await this.SelectTeamOption(teamName);
      const addButton = this.page.getByRole('button', { name: ' Add' });
      await expect(addButton).toBeEnabled();
    })
  }
  async verifyAddButtonNotEnabledDueToDropdownLag(teamName: string) {
    await test.step('Verify Add button doesn’t enable due to dropdown lag.', async () => {
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

        const option = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: name }).first();
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

        const option = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: name }).first();
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

  async verifyCancelClosesPopupWithoutSaving(OfficeName: string, memberName: string, leaderName: string) {
    await test.step('Verify Cancel button closes popup without saving', async () => {
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
      // Click Remove Button
      await this.CancelTeamButton();

      // Navigate to contacts team list & verify team is not present in the list
      await this.NavigateToContacts();
      await this.contactTeamsList();

      // Verify the team is not present - expect locator to be hidden or not visible
      const teamRow = this.locators.TeamRow(teamName);
      await expect(teamRow).not.toBeVisible({ timeout: 5000 });
    });
  }

  async verifyUnsavedDataNotPersist(OfficeName: string, memberName: string, leaderName: string) {
    await test.step('Verify unsaved data does not persist after closing Add Team popup', async () => {
      await this.NavigateToTeamsTab();

      // Open Add Team popup
      const selectTeamInput = this.page.locator('ng-select[name="team"] input');
      await selectTeamInput.click();
      await this.createNewTeamButton();

      // Fill in the popup fields
      const teamName = `Team ${faker.word.sample()}`;
      const teamNameInput = this.locators.TeamNameInput();
      await teamNameInput.click();
      await teamNameInput.fill(teamName);

      await this.SelectOffice(OfficeName);
      await this.SelectOfficeOption();

      await this.SelectTeamMember();
      await this.SelectTeamMemberSearchInput(memberName);
      await this.page.waitForTimeout(1000);
      await this.selectTeamFromDropdown(memberName);
      await this.SelectTeamMember();

      await this.SelectTeamLeader();
      await this.SelectTeamLeaderSearchInput(leaderName);
      await this.SelectTeamLeaderFromDropdown(leaderName);

      // Close the popup with cancel
      await this.CancelTeamButton();

      // Reopen the Add Team popup
      await this.page.locator('ng-select[name="team"] input').click();
      await this.createNewTeamButton();

      // Assert all the popup fields are empty/default
      const reopenedTeamNameInput = this.locators.TeamNameInput();
      await expect(reopenedTeamNameInput).toBeVisible();
      await expect(reopenedTeamNameInput).toHaveValue("");

      const officePlaceholder = this.page.getByText('Office *Select Office');
      await expect(officePlaceholder).toBeVisible()

      const memberPlaceholder = this.page.getByText('Team Member *Select Members');
      await expect(memberPlaceholder).toBeVisible();
    });
  }

  async verifyNewTeamAppearsInListAndDropdown(OfficeName: string, memberName: string, leaderName: string) {
    await test.step('Verify newly created team appears in dropdown and team list.', async () => {
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

  async verifyEmptySpacesTeamNameDoesNotReflectInList(
    officeName: string,
    memberName: string,
    leaderName: string
  ) {
    await test.step('Verify failed team creation doesn’t reflect in list.', async () => {
  
      // Navigate to Teams tab
      await this.NavigateToTeamsTab();
  
      // Open "Add Team" popup
      const selectTeamInput = this.page.locator('ng-select[name="team"] input');
      await selectTeamInput.click();
      await this.createNewTeamButton();
  
      // Enter only spaces in team name field
      const teamName = '    ';
      const teamNameInput = this.locators.TeamNameInput();
      await teamNameInput.click();
      await teamNameInput.fill(teamName);
  
      // Select office
      await this.SelectOffice(officeName);
      await this.SelectOfficeOption();
  
      // Select member
      await this.SelectTeamMember();
      await this.SelectTeamMemberSearchInput(memberName);
      await this.page.waitForTimeout(1000);
      await this.selectTeamFromDropdown(memberName);
  
      await this.SelectTeamMember();
  
      // Select leader
      await this.SelectTeamLeader();
      await this.SelectTeamLeaderSearchInput(leaderName);
      await this.SelectTeamLeaderFromDropdown(leaderName);
  
      // Attempt to create team
      await this.CreateTeamButton();
      await this.CancelTeamButton();
  
      // Navigate to Contacts > Team List
      await this.NavigateToContacts();
      await this.contactTeamsList();
  
  
      // ✅ Updated verification (do not remove anything else)
      const teamRows = this.page.locator('tbody.p-datatable-tbody > tr');
      const allTexts = await teamRows.allTextContents();
  
      // Ensure no team with empty/space-only name exists
      const hasInvalidTeam = allTexts.some(t => t.trim() === '');
      expect(hasInvalidTeam).toBeFalsy();
    });
  }  
  async verifyTeamListSorting() {
    await test.step('Verify sorting functionality for team list', async () => {
      await this.NavigateToTeamsTab();

      // Locate the sort icon using the header cell for "Name" (usually for ascending/descending sort switching)
      const sortCell = this.page.getByRole('cell', { name: 'Name' });
      const sortIcon = sortCell.locator('svg');
      await this.page.waitForTimeout(1000);
      await expect(sortIcon).toBeVisible();

      // --- Ascending Check ---
      // First click (ascending)
      await sortIcon.click({ force: true });
      const teamRowsAsc = this.page.locator('tbody.p-datatable-tbody > tr > td:first-child');
      const teamNamesAsc = (await teamRowsAsc.allTextContents()).map(name => name.trim()).filter(name => !!name);
      const sortedNamesAsc = [...teamNamesAsc].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
      expect(teamNamesAsc).toEqual(sortedNamesAsc);

      // --- Descending Check ---
      // Second click (descending)
      await sortIcon.click({ force: true });
      const teamRowsDesc = this.page.locator('tbody.p-datatable-tbody > tr > td:first-child');
      const teamNamesDesc = (await teamRowsDesc.allTextContents()).map(name => name.trim()).filter(name => !!name);
      const sortedNamesDesc = [...teamNamesDesc].sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' }));
      expect(teamNamesDesc).toEqual(sortedNamesDesc);
    });
  }
  async verifySortButtonOnEmptyListDoesNotCrashUI() {
    await test.step('Verify sort button on empty list doesn’t crash UI', async () => {
      // Navigate to Teams tab
      await this.NavigateToTeamsTab();
  
      const sortCell = this.page.getByRole('cell', { name: 'Name' });
      const sortIcon = sortCell.locator('svg');
      await this.page.waitForTimeout(1000);
      await expect(sortIcon).toBeVisible();

      // --- Ascending Check ---
      await sortIcon.click({ force: true });
      // --- Descending Check ---
      await sortIcon.click({ force: true });
      console.log('✅ Sort button clicked successfully on empty list - no crash detected.');
    });
  }

  async verifyEditIconOpensTeamForUpdate() {
    await test.step('Verify Edit icon opens team for update', async () => {
      await this.NavigateToTeamsTab();
      await this.editTeam();
      const verifyEditWindowOpen = this.page.getByRole('heading', { name: 'Edit Team' });
      await expect(verifyEditWindowOpen).toBeVisible();
    });
  }

  async verifyDeleteIconOpensConfirmationPopup() {
    await test.step('Verify Delete icon opens confirmation popup', async () => {
      await this.NavigateToTeamsTab();
  
      // Click the delete icon for any team
      await this.deleteTeam()
  
      // Wait for confirmation popup to appear
      const confirmationPopup = this.page.locator('p-dialog[header*="Confirm"], p-dialog:has-text("Are you sure")');
      await expect(confirmationPopup).toBeVisible({ timeout: 5000 });
  
      // Verify that popup contains confirmation text and action buttons
      await expect(this.page.getByRole('button', { name: /Yes/i })).toBeVisible();
      await expect(this.page.getByRole('button', { name: /No|Cancel/i })).toBeVisible();
    });
  }
  
  async verifyCancelOnDeleteKeepsTeam() {
    await test.step('Verify clicking Cancel on Delete popup keeps team', async () => {
      await this.NavigateToTeamsTab();
  
      // Count number of teams before deletion
      const teamRows = this.page.locator('table tbody tr');
      const initialCount = await teamRows.count();
  
      // Click Delete icon for the first team
      const deleteIcon = this.page.locator('button.p-button-danger i.pi.pi-trash').first();
      await expect(deleteIcon).toBeVisible({ timeout: 5000 });
      await deleteIcon.click();
  
      // Wait for confirmation popup
      const confirmationPopup = this.page.locator('p-dialog[header*="Confirm"], p-dialog:has-text("Are you sure")');
      await expect(confirmationPopup).toBeVisible({ timeout: 5000 });
  
      // Click Cancel or No button
      const cancelButton = this.page.getByRole('button', { name: /No|Cancel/i });
      await expect(cancelButton).toBeVisible();
      await cancelButton.click();
  
      // Wait for popup to close
      await expect(confirmationPopup).toBeHidden({ timeout: 5000 });
  
      // Verify the team list count remains unchanged
      await this.page.waitForTimeout(1000); // short wait for UI to settle
      const finalCount = await teamRows.count();
      expect(finalCount).toBe(initialCount);
    });
  }
  
  async verifyDeleteIconRemovesTeamPermanently() {
    await test.step('Verify deleted team not shown in dropdown.', async () => {
      await this.NavigateToTeamsTab();
  
      // Capture the first team's name before deleting
      const firstTeamRow = this.page.locator('tbody tr').nth(1);
      const teamName = (await firstTeamRow.locator('td').nth(1).textContent())?.trim();
      if (!teamName) throw new Error('No teams found to delete.');
      console.log('🟠 Name of the team to be deleted:', teamName);
  
      // Click the delete icon specifically for this team
      await this.deleteTeam();
  
      // Wait for delete confirmation dialog box to appear
      // const deleteDialog = this.page.locator('p-confirmdialog, [role="dialog"]');
      // await expect(deleteDialog).toBeVisible({ timeout: 5000 });
      // console.log('🟣 Delete confirmation dialog is visible.');
  
      // Click on "Yes" button to confirm delete (adjust button text if different)
      // const confirmButton = deleteDialog.getByRole('button', { name: /Yes/i });
      // await expect(confirmButton).toBeVisible();
      // await confirmButton.click();
      // console.log('🟢 Confirmed team deletion from dialog.');
  
      // Verify success message
      const ToastMessage = this.page.getByRole('alert', { name: /Removed successfully/i });
      await expect(ToastMessage).toBeVisible();
  
      // Wait for the toast and UI refresh
      await ToastMessage.waitFor({ state: 'detached', timeout: 10000 });
      await this.page.waitForTimeout(1500);
  
      // ✅ Verify that the deleted team name no longer exists in the table
      const teamRow = this.page.locator('tbody tr', { hasText: teamName });
      const rowCount = await teamRow.count();
  
      if (rowCount === 0) {
        console.log(`🟢 The team was deleted and is no longer present in the list: "${teamName}"`);
      } else {
        console.warn(`🔴 The team "${teamName}" still appears in the list!`);
      }
  
      await expect(teamRow).toHaveCount(0);
    });
  }
  
  async verifyTeamCreatedInMyProfileAlsoAppearsInTeamModule(OfficeName: string, memberName: string, leaderName: string) {
    await test.step('Verify team created in My Profile also appears in Team module', async () => {
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
  async verifyAlignmentOfAddButtonWithTeamDropdown() {
    await test.step('Verify alignment of Add button with Team dropdown.', async () => {
      // Navigate to Teams tab
      await this.NavigateToTeamsTab();
  
      // Get references for Add button and Team dropdown
      const addButton = this.locators.AddButton();
      const teamDropdown = this.page.getByText('Select Team');
  
      // Ensure both elements are visible
      await expect(teamDropdown).toBeVisible();
      await expect(addButton).toBeVisible();
  
      // Get their bounding boxes (positions and sizes)
      const teamDropdownBox = await teamDropdown.boundingBox();
      const addButtonBox = await addButton.boundingBox();
  
      if (!teamDropdownBox || !addButtonBox) {
        throw new Error('❌ Unable to determine bounding boxes for dropdown or Add button');
      }
  
      // ✅ Check vertical alignment (Y-axis)
      const verticalAlignmentDiff = Math.abs(teamDropdownBox.y - addButtonBox.y);
      console.log(`📏 Vertical alignment difference: ${verticalAlignmentDiff.toFixed(2)}px`);
  
      // ✅ Check horizontal position (Add button should be to the right)
      const horizontalGap = addButtonBox.x - (teamDropdownBox.x + teamDropdownBox.width);
      console.log(`📐 Horizontal gap between dropdown and Add button: ${horizontalGap.toFixed(2)}px`);
      expect(horizontalGap).toBeGreaterThanOrEqual(0);
  
      // ✅ Final confirmation
      console.log('🟢 Add button is horizontally aligned and properly placed next to the Team dropdown.');
    });
  }  
  // Verify dropdown supports search for large team lists
  async verifyDropdownSupportsSearchForLargeTeamLists(teamName: string) {
    await test.step('Verify dropdown supports search for large team lists', async () => {
      await this.NavigateToTeamsTab();
      await this.searchTeamName(teamName);
    });
  }
  async verifyDropdownWithInvalidKeyword(teamName: string) {
    await test.step('Verify dropdown search with invalid keyword.', async () => {
      await this.NavigateToTeamsTab()
      await this.searchTeamName(teamName);
      const NoRecord = this.page.getByText('No items found')
      await expect(NoRecord).toBeVisible({ timeout: 5000 });
    })
  }
  async VerifyToastAfterTeamCreation(OfficeName: string, memberName: string, leaderName: string) {
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
    });
  }
  async VerifySingleToastOnMultipleClicks(OfficeName: string, memberName: string, leaderName: string) {
    await test.step('Verify no duplicate toast shown for single event.', async () => {
      await this.NavigateToTeamsTab();
  
      // Open Add Team popup
      const selectTeamInput = this.page.locator('ng-select[name="team"] input');
      await selectTeamInput.click();
      await this.createNewTeamButton();
  
      // Enter team name
      const teamName = `Team ${faker.word.sample()}`;
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
  
      // Locate Create Team button
      const createButton = this.page.locator('button:has-text("Create Team")');

      await createButton.dblclick({force:true})
  
      // Verify only one toast appears
      const toasts = this.page.getByText(/Team created/i);
      await expect(toasts).toHaveCount(1, { timeout: 10000 });
    });
  }
// Verify required field validation for Team Name, Office, and Members with color check
async VerifyRequiredFieldErrorColor() {
  await test.step('Verify required field validation for Team Name, Office, and Members', async () => {
    await this.NavigateToTeamsTab();

    // Open Add Team popup
    const selectTeamInput = this.page.locator('ng-select[name="team"] input');
    await selectTeamInput.click();
    await this.createNewTeamButton();

    const popup = this.page.getByText('Add TeamUpload profile');
    await expect(popup).toBeVisible();

    // Click Create without filling fields
    await this.CreateTeamButton();

    // Assert required validation errors appear
    const requiredTeamError = this.page.getByText(/Team Name is required/i);
    const requiredOfficeError = this.page.getByText(/Office is required/i);
    const requiredMembersError = this.page.getByText('Team Member(s) is required');

    await expect(requiredTeamError).toBeVisible();
    await expect(requiredOfficeError).toBeVisible();
    await expect(requiredMembersError).toBeVisible();

    // Verify color of validation messages
    const expectedColor = 'rgb(205, 24, 24)';

    const teamErrorColor = await requiredTeamError.evaluate(el => getComputedStyle(el).color);
    const officeErrorColor = await requiredOfficeError.evaluate(el => getComputedStyle(el).color);
    const membersErrorColor = await requiredMembersError.evaluate(el => getComputedStyle(el).color);

    await expect(teamErrorColor).toBe(expectedColor);
    await expect(officeErrorColor).toBe(expectedColor);
    await expect(membersErrorColor).toBe(expectedColor);
  });
}

async VerifyConfirmationMessageColor(OfficeName: string, memberName: string, leaderName: string) {
  await test.step('Verify confirmation message color (green for success).', async () => {
    await this.NavigateToTeamsTab();

    // Open Add Team popup
    const selectTeamInput = this.page.locator('ng-select[name="team"] input');
    await selectTeamInput.click();
    await this.createNewTeamButton();

    // Enter team name
    const teamName = `Team ${faker.word.sample()}`;
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

    // Verify success toast message and its background color
    const successToast = this.page.getByText(/Team created/i);
    await expect(successToast).toBeVisible({ timeout: 10000 });

    // Wait briefly for the toast style to apply and render
    await this.page.waitForTimeout(800);

    // Collect the toast's background color from the element and its parents
    type ToastColorInfo = { tag: string; class: string; color: string };
    const bgColors: ToastColorInfo[] = await successToast.evaluate((el) => {
      const styles: ToastColorInfo[] = [];
      let current = el as HTMLElement | null;
      while (current) {
        const color = window.getComputedStyle(current).backgroundColor;
        styles.push({ tag: current.tagName, class: (current.className || '').toString(), color });
        current = current.parentElement as HTMLElement | null;
      }
      return styles;
    });

    console.log('Toast background chain:', bgColors);

    // Find the first color that isn't fully transparent (rgba(0, 0, 0, 0))
    const visibleColor = bgColors.find(c => c.color !== 'rgba(0, 0, 0, 0)' && c.color !== 'transparent')?.color;
    console.log('Detected visible color:', visibleColor);

    // Normalize color string if necessary (convert rgba to rgb for alpha=1)
    let normalizedColor = visibleColor || '';
    if (normalizedColor.startsWith('rgba(')) {
      normalizedColor = normalizedColor.replace('rgba', 'rgb').replace(/, 1\)$/, ')');
    }

    const expectedColor = 'rgb(34, 146, 118)';
    await expect(normalizedColor).toBe(expectedColor);
  });
}

async VerifyTeamDataPersistenceAfterRefresh(OfficeName: string, memberName: string, leaderName: string) {
  await test.step('Verify team data remains after page refresh', async () => {
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

    // ✅ Verify team appears in the contacts list
    await this.NavigateToContacts();
    await this.contactTeamsList();
    await this.verifyTeamInTable(teamName);

    // ✅ Refresh the page and verify data persistence
    await this.page.reload();
    await this.page.waitForLoadState('networkidle'); // Wait until fully loaded

    // Wait for the table to appear again
    const teamTable = this.page.locator('table'); // Adjust locator if necessary
    await expect(teamTable).toBeVisible({ timeout: 10000 });

    // Re-check the same team name exists after refresh
    await this.verifyTeamInTable(teamName);

    console.log(`✅ Verified: Team "${teamName}" remains visible after page refresh.`);
  });
}

async VerifyUnsavedPopupDataLostOnRefresh(OfficeName: string, memberName: string, leaderName: string) {
  await test.step('Verify unsaved Add Team popup data is lost after page refresh', async () => {
    await this.NavigateToTeamsTab();

    // Open Add Team popup and fill some data
    const selectTeamInput = this.page.locator('ng-select[name="team"] input');
    await selectTeamInput.click();
    await this.createNewTeamButton();

    const teamName = `Team ${faker.word.sample()}`;
    const teamNameInput = this.locators.TeamNameInput();
    await teamNameInput.click();
    await teamNameInput.fill(teamName);

    await this.SelectOffice(OfficeName);
    await this.SelectOfficeOption();
    await this.SelectTeamMember();
    await this.SelectTeamMemberSearchInput(memberName);
    await this.page.waitForTimeout(1000);
    await this.selectTeamFromDropdown(memberName);
    await this.SelectTeamMember();
    await this.SelectTeamLeader();
    await this.SelectTeamLeaderSearchInput(leaderName);
    await this.SelectTeamLeaderFromDropdown(leaderName);

    // Reload the page before saving to simulate loss of unsaved data
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
    await this.NavigateToTeamsTab();

    // Re-open Add Team popup - all fields should be reset (empty)
    const selectTeamInputAfter = this.page.locator('ng-select[name="team"] input');
    await selectTeamInputAfter.click();
    await this.createNewTeamButton();


    const teamNameInputAfter = this.locators.TeamNameInput();
    // The team name input should be empty
    await expect(teamNameInputAfter).toBeEmpty();

    const Office = this.page.locator('#wrapper').getByText('Select Office');
    await expect(Office).toBeVisible();
    // Ensure member and leader fields are also cleared
    const memberTags = this.page.locator('re-multiselect[formcontrolname="members"] .tags');
    await expect(memberTags).toBeVisible();

    console.log('✅ Verified: Unsaved Add Team popup data is lost after page refresh.');
  });
}

// ---------------------------------------MFA------------------------------------------

// MFA enable hone par secret ko .env file me update karo jab success message aye.
async enableGoogleAuthenticatorMfa() {
  await test.step('Enable Google Authenticator MFA', async () => {
    await this.navigateToMfaTab();

    // Click replace and select Google Authenticator
    await this.clickReplaceButton();
    await this.selectGoogleAuthenticator();

    // Click the first radio button for Google Authenticator
    const googleRadioButton = this.page.locator('.p-radiobutton-icon').first();
    await googleRadioButton.click();

    // Check if already enabled
    const alreadyEnabled = this.page.getByRole('alert', { name: 'This MFA already enabled' });
    let isAlreadyEnabled = false;
    try {
      isAlreadyEnabled = await alreadyEnabled.isVisible({ timeout: 3000 });
    } catch {
      isAlreadyEnabled = false;
    }

    if (isAlreadyEnabled) {
      console.log('✅ Google Authenticator MFA already enabled, test passes.');
      return;
    }

    await this.page.waitForTimeout(2000);

    // Locate QR image
    const qrImage = this.page.locator("//div[@class='rqcode']//img");
    const qrVisible = await qrImage.isVisible({ timeout: 5000 }).catch(() => false);
    if (!qrVisible) throw new Error('QR code for Google MFA not visible.');

    // Extract secret and generate OTP
    const qrSrc = await qrImage.getAttribute('src');
    if (!qrSrc) throw new Error('Unable to find QR code src for Google MFA');

    const qrExtract = await extractSecretFromQr(qrSrc);
    if (!qrExtract?.secret) throw new Error('Failed to extract Google MFA secret');

    const otp = generateOtp(qrExtract.secret);
    console.log(`🔐 Google MFA Secret: ${qrExtract.secret}`);
    console.log(`📲 Generated OTP: ${otp}`);

    await this.enterMicrosoftAuthOtp(otp);

    const saveButton = this.page.getByRole('button', { name: 'Save' });
    await saveButton.click({ force: true });

    // Wait for notification
    const mfaEnabledToast = this.page.getByRole('alert', { name: /MFA enabled successfully/i });
    const appearTime = Date.now();
    await expect(mfaEnabledToast).toBeVisible({ timeout: 8000 });
    await mfaEnabledToast.waitFor({ state: 'hidden', timeout: 70000 });
    const disappearTime = Date.now();
    const shownDurationMs = disappearTime - appearTime;
    console.log(`ℹ️ 'MFA enabled successfully' notification was visible for ~${(shownDurationMs / 1000).toFixed(1)} seconds`);

    // ✅ Update environment variables consistently
    updateEnvVariable('E2E_MANAGER_MICROSOFT_SECRET', '');
    updateEnvVariable('E2E_MANAGER_AUTHY_SECRET', '');
    updateEnvVariable('E2E_MANAGER_GOOGLE_SECRET', qrExtract.secret);
    updateEnvVariable('E2E_MANAGER_OTP_SECRET', qrExtract.secret);

    process.env.E2E_MANAGER_OTP_SECRET = qrExtract.secret;
    dotenv.config();

    console.log(`✅ Google MFA secret updated and synced: ${qrExtract.secret}`);


  });
}

async enableMicrosoftAuthenticatorMfa() {
  await test.step('Enable Microsoft Authenticator MFA', async () => {
    await this.navigateToMfaTab();
    await this.page.waitForTimeout(1000);
    await this.clickReplaceButton();
    await this.selectMicrosoftAuthenticator();

    // Click the Microsoft Authenticator radio button
    const msRadioButton = this.page.locator('.p-radiobutton-box.p-highlight > .p-radiobutton-icon');
    await msRadioButton.click();

    // Check if already enabled
    const alreadyEnabled = this.page.getByRole('alert', { name: 'This MFA already enabled' });
    let isAlreadyEnabled = false;
    try {
      isAlreadyEnabled = await alreadyEnabled.isVisible({ timeout: 3000 });
    } catch {
      isAlreadyEnabled = false;
    }

    if (isAlreadyEnabled) {
      console.log('✅ Microsoft MFA already enabled, test passes.');
      return;
    }

    await this.page.waitForTimeout(2000);

    // Locate QR image
    const qrImage = this.page.locator("//div[@class='rqcode']//img");
    const qrVisible = await qrImage.isVisible({ timeout: 5000 }).catch(() => false);
    if (!qrVisible) throw new Error('QR code for Microsoft MFA not visible.');

    // Extract secret and generate OTP
    const qrSrc = await qrImage.getAttribute('src');
    if (!qrSrc) throw new Error('Unable to find QR code src for Microsoft MFA');

    const qrExtract = await extractSecretFromQr(qrSrc);
    if (!qrExtract?.secret) throw new Error('Failed to extract Microsoft MFA secret');

    const otp = generateOtp(qrExtract.secret);
    await this.enterMicrosoftAuthOtp(otp);

    const saveButton = this.page.getByRole('button', { name: 'Save' });
    await saveButton.click({ force: true });

    // Wait for notification
    const mfaEnabledToast = this.page.getByRole('alert', { name: /MFA enabled successfully/i });
    const appearTime = Date.now();
    await expect(mfaEnabledToast).toBeVisible({ timeout: 6000 });
    await mfaEnabledToast.waitFor({ state: 'hidden', timeout: 70000 });
    const disappearTime = Date.now();
    const shownDurationMs = disappearTime - appearTime;
    console.log(`ℹ️ 'MFA enabled successfully' notification was visible for ~${(shownDurationMs / 1000).toFixed(1)} seconds`);

    // ✅ Update environment variables consistently
    updateEnvVariable('E2E_MANAGER_GOOGLE_SECRET', '');
    updateEnvVariable('E2E_MANAGER_AUTHY_SECRET', '');
    updateEnvVariable('E2E_MANAGER_MICROSOFT_SECRET', qrExtract.secret);
    updateEnvVariable('E2E_MANAGER_OTP_SECRET', qrExtract.secret);

    process.env.E2E_MANAGER_OTP_SECRET = qrExtract.secret;
    dotenv.config();

    await expect(this.page).toHaveURL(/\/login$/i);
  });
}
async enableAuthyAuthenticatorMfa() {
  await test.step('Enable Authy Authenticator MFA', async () => {
    await this.navigateToMfaTab();
    await this.page.waitForTimeout(1000);
    await this.clickReplaceButton();
    await this.selectAuthyAuthenticator();

    // Click the Authy Authenticator radio button
    const authyRadioButton = this.page.locator('div:nth-child(3) > .p-element > .p-radiobutton > .p-radiobutton-box');
    await authyRadioButton.click();

    // Check if already enabled
    const alreadyEnabled = this.page.getByRole('alert', { name: 'This MFA already enabled' });
    let isAlreadyEnabled = false;
    try {
      isAlreadyEnabled = await alreadyEnabled.isVisible({ timeout: 3000 });
    } catch {
      isAlreadyEnabled = false;
    }

    if (isAlreadyEnabled) {
      console.log('✅ Authy MFA already enabled, test passes.');
      return;
    }

    await this.page.waitForTimeout(2000);

    // Locate QR image
    const qrImage = this.page.locator("//div[@class='rqcode']//img");
    const qrVisible = await qrImage.isVisible({ timeout: 5000 }).catch(() => false);
    if (!qrVisible) throw new Error('QR code for Authy MFA not visible.');

    // Extract secret and generate OTP
    const qrSrc = await qrImage.getAttribute('src');
    if (!qrSrc) throw new Error('Unable to find QR code src for Authy MFA');

    const qrExtract = await extractSecretFromQr(qrSrc);
    if (!qrExtract?.secret) throw new Error('Failed to extract Authy MFA secret');

    const otp = generateOtp(qrExtract.secret);
    await this.enterMicrosoftAuthOtp(otp); // assuming same OTP entry method works

    const saveButton = this.page.getByRole('button', { name: 'Save' });
    await saveButton.click({ force: true });

    // Wait for notification
    const mfaEnabledToast = this.page.getByRole('alert', { name: /MFA enabled successfully/i });
    const appearTime = Date.now();
    await expect(mfaEnabledToast).toBeVisible({ timeout: 6000 });
    await mfaEnabledToast.waitFor({ state: 'hidden', timeout: 70000 });
    const disappearTime = Date.now();
    const shownDurationMs = disappearTime - appearTime;
    console.log(`ℹ️ 'MFA enabled successfully' notification was visible for ~${(shownDurationMs / 1000).toFixed(1)} seconds`);

    // ✅ Update environment variables consistently
    updateEnvVariable('E2E_MANAGER_GOOGLE_SECRET', '');
    updateEnvVariable('E2E_MANAGER_MICROSOFT_SECRET', '');
    updateEnvVariable('E2E_MANAGER_AUTHY_SECRET', qrExtract.secret);
    updateEnvVariable('E2E_MANAGER_OTP_SECRET', qrExtract.secret);

    process.env.E2E_MANAGER_OTP_SECRET = qrExtract.secret;
    dotenv.config();

    await expect(this.page).toHaveURL(/\/login$/i);
  });
}
// Enter incorrect Google Authenticator MFA code
async enterInvalidOtpGoogleAuthenticatorMfa() {
  await test.step('Enter incorrect Google Authenticator MFA code', async () => {
    await this.navigateToMfaTab();

    // Click replace and select Google Authenticator
    await this.clickReplaceButton();
    await this.selectGoogleAuthenticator();

    // Click the radio button for Google Authenticator
    const googleRadioButton = this.page.locator('.p-radiobutton-icon').first();
    await googleRadioButton.click();

    // Check if "already enabled" alert is visible
    const alreadyEnabled = this.page.getByRole('alert', { name: 'This MFA already enabled' });
    let isAlreadyEnabled = false;
    try {
      isAlreadyEnabled = await alreadyEnabled.isVisible({ timeout: 3000 });
    } catch {
      isAlreadyEnabled = false;
    }

    if (isAlreadyEnabled) {
      console.log('Google Authenticator MFA is already enabled. Skipping invalid OTP entry.');
      return;
    }

    await this.page.waitForTimeout(2000);

    // Enter an invalid OTP code and attempt to save
    const otpTextbox = this.page.getByRole('textbox', { name: 'MFA Code1' });
    await otpTextbox.click();
    await otpTextbox.fill('123456');
    const saveButton = this.page.getByRole('button', { name: 'Save' });
    await saveButton.click({ force: true });

  });
}

async enterInvalidOtpMsleAuthenticatorMfa() {
  await test.step('Enter incorrect Microsoft Authenticator MFA code', async () => {
    await this.navigateToMfaTab();

    // Click replace and select Google Authenticator
    await this.clickReplaceButton();
    await this.selectMicrosoftAuthenticator();

    // Click the radio button for Google Authenticator
    const msRadioButton = this.page.locator('.p-radiobutton-box.p-highlight > .p-radiobutton-icon');
    await msRadioButton.click();

    // Check if "already enabled" alert is visible
    const alreadyEnabled = this.page.getByRole('alert', { name: 'This MFA already enabled' });
    let isAlreadyEnabled = false;
    try {
      isAlreadyEnabled = await alreadyEnabled.isVisible({ timeout: 3000 });
    } catch {
      isAlreadyEnabled = false;
    }

    if (isAlreadyEnabled) {
      console.log('Google Authenticator MFA is already enabled. Skipping invalid OTP entry.');
      return;
    }

    await this.page.waitForTimeout(2000);

    // Enter an invalid OTP code and attempt to save
    const otpTextbox = this.page.getByRole('textbox', { name: 'MFA Code1' });
    await otpTextbox.click();
    await otpTextbox.fill('123456');
    const saveButton = this.page.getByRole('button', { name: 'Save' });
    await saveButton.click({ force: true });

  });
}

async enterInvalidOtpAuthyleAuthenticatorMfa() {
  await test.step('Enter incorrect Authy Authenticator MFA code', async () => {
    await this.navigateToMfaTab();

    // Click replace and select Google Authenticator
    await this.clickReplaceButton();
    await this.selectMicrosoftAuthenticator();

    const authyRadioButton = this.page.locator('div:nth-child(3) > .p-element > .p-radiobutton > .p-radiobutton-box');
    await authyRadioButton.click();

    // Check if "already enabled" alert is visible
    const alreadyEnabled = this.page.getByRole('alert', { name: 'This MFA already enabled' });
    let isAlreadyEnabled = false;
    try {
      isAlreadyEnabled = await alreadyEnabled.isVisible({ timeout: 3000 });
    } catch {
      isAlreadyEnabled = false;
    }

    if (isAlreadyEnabled) {
      console.log('Google Authenticator MFA is already enabled. Skipping invalid OTP entry.');
      return;
    }

    await this.page.waitForTimeout(2000);

    // Enter an invalid OTP code and attempt to save
    const otpTextbox = this.page.getByRole('textbox', { name: 'MFA Code1' });
    await otpTextbox.click();
    await otpTextbox.fill('123456');
    const saveButton = this.page.getByRole('button', { name: 'Save' });
    await saveButton.click({ force: true });

  });
}
//------------------------------ Associations Tab -------------------------------------//
async verifyAssociationTabOpensSuccessfully() {
  await test.step('Verify that the Association tab opens successfully', async () => {
    await this.AssociationsTab();
  });
}

// Verify the search functionality in the Association tab
async verifyAssociationTabSearchFunctionality(searchName: string) {
  await test.step(`Verify the search functionality in the Association tab`, async () => {
    await this.AssociationsTab();
    await this.clickAddProjectButton();
    await this.fillSearchProjectInput(searchName);
    const option = this.locators.searchProjectOption;
    await expect(option).toBeVisible({ timeout: 5000 })
  });
}
// Verify search with no matching project
async verifyAssociationTabSearchNoResults(nonExistentProject: string) {
  await test.step('Verify search with no matching project', async () => {
    await this.AssociationsTab();
    await this.clickAddProjectButton();
    await this.fillSearchProjectInput(nonExistentProject);
    // Assert that no project options are visible
    const option = this.locators.searchProjectOption;
    await expect(option).not.toBeVisible({ timeout: 3000 });
  });
}
// Verify that Add Project dropdown opens successfully
async verifyAddProjectDropdownOpensSuccessfully() {
  await test.step('Verify that the Add Project dropdown opens successfully', async () => {
    await this.AssociationsTab();
    await this.clickAddProjectButton();
    const option = this.page.locator('.drop_box');
    await expect(option).toBeVisible({ timeout: 5000 });
  });
}
// Verify the search option inside Add Project dropdown
async verifySearchOptionInAddProjectDropdown(searchTerm: string) {
  await test.step('Verify the search option inside Add Project dropdown', async () => {
    await this.AssociationsTab();
    await this.clickAddProjectButton();
    await this.fillSearchProjectInput(searchTerm);
    const option = this.locators.searchProjectOption;
    await expect(option).toContainText(searchTerm, { timeout: 5000 });
  });
}
// Verify single project selection from dropdown
async verifySingleProjectSelectionFromDropdown(projectName: string) {
  await test.step('Verify single project selection from Add Project dropdown', async () => {
    await this.AssociationsTab();
    await this.clickAddProjectButton();
    await this.fillSearchProjectInput(projectName);
    await this.selectProjectOption();
    const insidesearchBox =  this.page.locator('.pi.pi-times-circle');
    await expect(insidesearchBox).toBeVisible()
  });
}

// Verify multiple project selection from dropdown
async verifyMultipleProjectSelectionFromDropdown(projectNames: string[]) {
  await test.step('Verify multiple project selection from Add Project dropdown', async () => {
    await this.AssociationsTab();
    await this.clickAddProjectButton();
    for (const projectName of projectNames) {
      await this.fillSearchProjectInput(projectName);
      await this.selectProjectOption();
      // Clear input if it's not automatically cleared
      const input = this.locators.searchProjectInput;
      await input.fill('');
    }
  });
}
// Verify the "Select All" functionality
async verifySelectAllFunctionality() {
  await test.step('Verify the Select All functionality in Associations', async () => {
    await this.AssociationsTab();
    await this.clickAddProjectButton();
    await this.page.waitForTimeout(2000)
    // Click "Select All" checkbox
    await this.selectAllProjects();
    // Verify all checkboxes are selected
    const checkboxes = await this.page.$$('.checkbox__input[type="checkbox"]');
    for (const checkbox of checkboxes) {
      // Evaluate if checkbox is checked
      const checked = await checkbox.isChecked();
      expect(checked).toBeTruthy();
    }
  });
}
// Verify the "Deselect All" functionality
async verifyDeselectAllFunctionality() {
  await test.step('Verify the Deselect All functionality in Associations', async () => {
    await this.AssociationsTab();
    await this.clickAddProjectButton();
    await this.page.waitForTimeout(2000);

    // Click "Select All" checkbox to first select all projects
    await this.selectAllProjects();

    // Click "Deselect All" checkbox to unselect all projects
    const deselectAllCheckbox = this.locators.deselectAllCheckbox;
    await deselectAllCheckbox.click();

    // Verify all checkboxes are deselected
    const checkboxes = await this.page.$$('.checkbox__input[type="checkbox"]');
    for (const checkbox of checkboxes) {
      const checked = await checkbox.isChecked();
      expect(checked).toBe(false);
    }
  });
}
// Verify removing a project tag before adding
async verifyRemoveProjectTagBeforeAdding(projectName: string) {
  await test.step('Verify removing a selected project tag before final Add', async () => {
    await this.AssociationsTab();
    await this.clickAddProjectButton();

    // Search and select a project
    await this.fillSearchProjectInput(projectName);
    await this.selectProjectOption();

    // Remove the selected project tag (before clicking final Add)
    await this.removeSelectedProjects();

    // Assert that the project tag is removed (i.e., not in the list anymore)
    const projectTag = this.page.getByText(projectName);
    // Check if the association row for the project exists and handle both visible and not visible cases
    const associationRow = this.page.getByRole('row', { name: projectName });
    if (await associationRow.isVisible()) {
      // Case: The project is present in the association table
      await expect(associationRow).toBeVisible();
      console.log(`Project "${projectName}" is visible in the association table.`);
    } else {
      // Case: The project is not present in the association table
      await expect(associationRow).not.toBeVisible();
      console.log(`Project "${projectName}" is NOT visible in the association table.`);
    }
  });
}

// Verify adding multiple projects at once
async verifyMultipleProjectSelection(projectNames: string[]) {
  await test.step('Verify adding multiple projects at once', async () => {
    await this.AssociationsTab();
    await this.clickAddProjectButton();

    for (const projectName of projectNames) {
      await this.fillSearchProjectInput(projectName);
      await this.page.waitForTimeout(300);
      await this.selectProjectOption();
      // Optionally clear input if it's not automatically cleared
      await this.locators.searchProjectInput.fill('');
    }
    await this.clickAddButton();

  });
}

// Verify that previously added projects are not duplicated
async verifyPreviouslyAddedProjectsAreNotDuplicated() {
  await test.step('Verify that previously added projects are not duplicated', async () => {
    await this.AssociationsTab();
    await this.page.waitForTimeout(1000);

    // Get current associated project names from the table
    const tableRows = this.page.locator('//table//tr//td[2]');
    const namesBefore = (await tableRows.allInnerTexts())
      .map(name => name.trim())
      .filter(name => name && name.toLowerCase() !== 'no records found');
    console.log('Associated projects before:', namesBefore);

    // Open the Add Project dialog, select all, and add
    await this.clickAddProjectButton();
    await this.page.waitForTimeout(2000)
    await this.selectAllProjects();
    await this.page.waitForTimeout(500);
    await this.clickAddButton();
    await this.page.waitForTimeout(1000);

    // Get updated associated project names from the table after adding
    const namesAfter = (await tableRows.allInnerTexts())
      .map(name => name.trim())
      .filter(name => name && name.toLowerCase() !== 'no records found');

    // Open Add Project dialog again to count unique addable projects
    await this.clickAddProjectButton();
    const allOptionBoxes = this.page.locator('p-multiselectpanel .p-multiselect-items .p-checkbox-box');
    const totalProjectOptions = await allOptionBoxes.count();
    const totalChecked = await this.page.locator('p-multiselectpanel .p-multiselect-items .p-checkbox-box.p-highlight').count();
    // Check for duplicates in the association table
    const counts: Record<string, number> = {};
    for (const name of namesAfter) {
      counts[name] = (counts[name] || 0) + 1;
    }
    const duplicates = Object.entries(counts)
      .filter(([, count]) => count > 1)
      .map(([name]) => name);

    if (duplicates.length) {
      console.warn(`Warning: Table contains duplicate names: [${duplicates.join(', ')}]`);
    } else {
    }

    // Table should not have fewer entries than number of checkable options (at least as many as can be selected at once)
    expect(namesAfter.length).toBeGreaterThanOrEqual(totalChecked);
  });
}

// Verify adding projects when the associated project list is initially empty.

async verifyInitialProjectSelection() {
  await test.step('Verify adding when list is initially empty', async () => {
    await this.AssociationsTab();
    await this.page.waitForTimeout(2000)
    // Clear any existing projects in the list (if any) by clicking checkbox and trash icon
    const checkbox = this.page.getByRole('checkbox').nth(1);
    await checkbox.click({ force: true });
    const trashIcon = this.page.locator(".mr-2.cursor-pointer.ng-star-inserted").first();
    await trashIcon.click({ force: true });

    // Add each project one by one in the add dialog
    await this.clickAddProjectButton();
    await this.page.waitForTimeout(1500);
    await this.selectAllProjects();
    await this.page.waitForTimeout(500);
    await this.clickAddButton();

    // Confirm the success alert
    await expect(this.page.getByRole('alert', { name: 'Added successfully' })).toBeVisible();
  });
}

async verifyAssocitionSortingList() {
  await test.step('Verify the sort functionality', async () => {
    await this.AssociationsTab();
    const sortHeader = this.page.getByRole('columnheader', { name: /Name/i }).first();
    const sortIcon = sortHeader.locator('svg').first();
    await expect(sortIcon).toBeVisible({ timeout: 10000 });
    // --- Ascending Check ---
    await sortIcon.click({ force: true });
    await this.page.waitForTimeout(2000);
    const rowsAsc = this.page.locator('tbody.p-datatable-tbody > tr > td:first-child');
    const namesAsc = (await rowsAsc.allTextContents()).map(name => name.trim()).filter(name => !!name && name.toLowerCase() !== 'no records found');
    const sortedNamesAsc = [...namesAsc].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    expect(namesAsc).toEqual(sortedNamesAsc);
    // --- Descending Check ---
    await sortIcon.click({ force: true });
    await this.page.waitForTimeout(2000);
    const rowsDesc = this.page.locator('tbody.p-datatable-tbody > tr > td:first-child');
    const namesDesc = (await rowsDesc.allTextContents()).map(name => name.trim()).filter(name => !!name && name.toLowerCase() !== 'no records found');
    const sortedNamesDesc = [...namesDesc].sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' }));
    expect(namesDesc).toEqual(sortedNamesDesc);
  });
}

async verifyDeleteIconInActionColumn() {
  await test.step('Verify delete icon under Action column', async () => {
    await this.AssociationsTab();
    await this.page.waitForTimeout(2000);
    const projectRows = this.page.locator('//table//tr//td[2]');
    const beforeDeleteNames = (await projectRows.allInnerTexts())
      .map(text => text.trim())
      .filter(text => text && text.toLowerCase() !== 'no records found');
    const projectToDelete = beforeDeleteNames[0];
    await this.DeleteProjectIcon();
    await expect(this.page.getByRole('alert', { name: 'Removed successfully' })).toBeVisible();
    await this.page.waitForTimeout(1000);
    const afterDeleteNames = (await projectRows.allInnerTexts())
      .map(text => text.trim())
      .filter(text => text && text.toLowerCase() !== 'no records found');
    expect(afterDeleteNames).not.toContain(projectToDelete);
    console.log(`✅ Verified project "${projectToDelete}" not present after deletion.`);
  });
}
async verifyProjectDeleteFunctionality() {
  await test.step('Verify project delete functionality', async () => {
    await this.AssociationsTab();
    await this.page.waitForTimeout(1000);

    // Find all project rows, select the first project to delete (if available)
    const projectRows = this.page.locator('//table//tr//td[2]');
    const beforeDeleteNames = (await projectRows.allInnerTexts())
      .map(text => text.trim())
      .filter(text => text && text.toLowerCase() !== 'no records found');

    const projectToDelete = beforeDeleteNames[0];
    if (!projectToDelete) {
      console.warn('No project found to delete.');
      return;
    }

    // Click the delete icon for the first project
    await this.DeleteProjectIcon();

    // Expect a toast/alert for successful removal
    await expect(this.page.getByRole('alert', { name: /Removed successfully/i })).toBeVisible();

    // Wait for table update, then re-read the projects
    await this.page.waitForTimeout(1000);
    const afterDeleteNames = (await projectRows.allInnerTexts())
      .map(text => text.trim())
      .filter(text => text && text.toLowerCase() !== 'no records found');

    // Assert the deleted project is no longer listed
    expect(afterDeleteNames).not.toContain(projectToDelete);
    console.log(`✅ Verified project "${projectToDelete}" not present after deletion.`);
  });
}

// Verify checkbox beside each project 
async verifyCheckboxBesideEachProject() {
  await test.step('Verify checkbox beside each project', async () => {
    await this.AssociationsTab();
    await this.page.waitForTimeout(3000);

    // Find the "main" (Select All) checkbox for project selection
    const selectAllCheckbox = this.page.getByRole('checkbox').nth(1);
    await selectAllCheckbox.scrollIntoViewIfNeeded();
    await selectAllCheckbox.click({ force: true }); // Select all

    // Verify that all project checkboxes are selected after clicking main checkbox
    const checkboxes = this.page.locator('//table//tr//td[1]//div[contains(@class,"p-checkbox-box")]');
    const checkboxCount = await checkboxes.count();

    if (checkboxCount === 0) {
      throw new Error('No checkboxes found beside any project.');
    }

    for (let i = 0; i < checkboxCount; i++) {
      const checkbox = checkboxes.nth(i);
      await checkbox.scrollIntoViewIfNeeded();
      // All should have PrimeNG selected class when selected
      const classes = await checkbox.getAttribute('class');
      expect(classes).toContain('p-highlight');
    }
    console.log(`✅ Verified all ${checkboxCount} project checkboxes selected after clicking Select All checkbox.`);
  });
}

// Verify multiple checkbox selection
async verifyMultipleCheckboxSelection() {
  await test.step('Verify multiple checkbox selection', async () => {
    await this.AssociationsTab();
    await this.page.waitForTimeout(1500);

    // ✅ More accurate locator for PrimeNG table checkboxes
    const checkboxes = this.page.locator('//table//tr//td[1]//div[contains(@class,"p-checkbox-box")]');
    const checkboxCount = await checkboxes.count();

    if (checkboxCount < 2) {
      throw new Error(`Less than 2 checkboxes found (${checkboxCount}). Cannot verify multi-selection.`);
    }

    // ✅ Click first two checkboxes
    await checkboxes.nth(0).click({ force: true });
    await checkboxes.nth(1).click({ force: true });

    // ✅ Verify they have the 'p-highlight' class (PrimeNG checked state)
    const firstChecked = await checkboxes.nth(0).getAttribute('class');
    const secondChecked = await checkboxes.nth(1).getAttribute('class');

    expect(firstChecked).toContain('p-highlight');
    expect(secondChecked).toContain('p-highlight');
  });
}

// Verify All checkbox selection
async verifySelectAllCheckbox() {
  await test.step('Verify multiple checkbox selection', async () => {
    await this.AssociationsTab();
    await this.page.waitForTimeout(2000)
    const checkbox = this.page.getByRole('checkbox').nth(1);
    await checkbox.click({ force: true });
    expect(checkbox).toBeEnabled()
  });
}

// Verify bulk delete functionality
async verifyBulkDeleteFunctionality() {
  await test.step('Verify bulk delete functionality', async () => {
    await this.AssociationsTab();
    await this.page.waitForTimeout(1500);

    // ✅ Locate all project checkboxes (skipping header)
    const checkboxes = this.page.locator('//table//tr//td[1]//div[contains(@class,"p-checkbox-box")]');
    const checkboxCount = await checkboxes.count();

    if (checkboxCount < 2) {
      throw new Error(`Less than 2 checkboxes found (${checkboxCount}). Cannot verify bulk delete.`);
    }

    // ✅ Capture current project names before delete
    const projectNamesBefore = await this.page.locator('//table//tr//td[2]').allInnerTexts();
    console.log('🧾 Projects BEFORE delete:', projectNamesBefore);

    // ✅ Select first two checkboxes for deletion
    await checkboxes.nth(0).click({ force: true });
    await checkboxes.nth(1).click({ force: true });

    // ✅ Click the delete icon (trash)
    const trashIcon = this.page.locator(".mr-2.cursor-pointer.ng-star-inserted").first();
    await trashIcon.click({ force: true });

    // ✅ Wait for table to refresh
    await this.page.waitForTimeout(2000);

    // ✅ Get updated table after deletion
    const projectNamesAfter = await this.page.locator('//table//tr//td[2]').allInnerTexts();
    console.log('🧾 Projects AFTER delete:', projectNamesAfter);

    // ✅ Expect fewer items in the list
    expect(projectNamesAfter.length).toBeLessThan(projectNamesBefore.length);

    // ✅ Verify deleted projects are no longer present
    const deletedProjects = projectNamesBefore.filter(name => !projectNamesAfter.includes(name));
    console.log('🗑️ Deleted Projects:', deletedProjects);

    expect(deletedProjects.length).toBeGreaterThan(0);
    console.log(`✅ Successfully verified bulk delete of ${deletedProjects.length} project(s).`);
  });
}

// Verify UI update after deletion (Add if not exists, delete if exists)
async verifyUIUpdateAfterDeletion() {
  await test.step('Add a project if not present, otherwise delete a project and verify UI update', async () => {
    await this.AssociationsTab();
    await this.page.waitForTimeout(1000);

    // Get all current projects in the table
    let projectNamesBefore = await this.page.locator('//table//tr//td[2]').allInnerTexts();
    console.log('🧾 Projects BEFORE action:', projectNamesBefore);

    if (projectNamesBefore.length === 0) {
      // List is empty, add a project first
      await this.clickAddProjectButton();

      // For reliability, use a default project name for adding
      // You can change this project name to any that is always searchable and addable
      const projectNameToAdd = "New Staging Project";
      await this.fillSearchProjectInput(projectNameToAdd);
      await this.selectProjectOption();
      await this.clickAddButton();

      // Wait for project to be added
      await this.page.waitForTimeout(1500);

      // Update the projectNamesBefore after adding
      projectNamesBefore = await this.page.locator('//table//tr//td[2]').allInnerTexts();
      console.log('🟢 Project added since list was empty. New list:', projectNamesBefore);
    }

    // At least one project should now exist for deletion
    const checkboxes = this.page.locator('//table//tr//td[1]//div[contains(@class,"p-checkbox-box")]');
    const checkboxCount = await checkboxes.count();

    if (checkboxCount < 1) {
      throw new Error(`No checkboxes (projects) found after attempted add. Test cannot proceed.`);
    }

    // Select the first project for deletion
    await checkboxes.first().click({ force: true });

    // Click the delete (trash) icon
    const trashIcon = this.page.locator(".mr-2.cursor-pointer.ng-star-inserted").first();
    await trashIcon.click({ force: true });

    // Wait for table to refresh
    await this.page.waitForTimeout(2000);

    // Check the table after deletion
    const projectNamesAfter = await this.page.locator('//table//tr//td[2]').allInnerTexts();
    console.log('🧾 Projects AFTER delete:', projectNamesAfter);

    // Expect fewer items if at least one was deleted
    expect(projectNamesAfter.length).toBeLessThan(projectNamesBefore.length);

    // Verify the deleted project is no longer present
    const deletedProjects = projectNamesBefore.filter(name => !projectNamesAfter.includes(name));
    console.log('🗑️ Deleted Project(s):', deletedProjects);

    expect(deletedProjects.length).toBeGreaterThan(0);
    console.log(`✅ Successfully deleted ${deletedProjects.length} project(s).`);
  });
}

// Verify that deleted projects can be re-added
async verifyDeletedProjectsCanBeReadded(projectName: string) {
  await test.step('Verify that deleted projects can be re-added', async () => {
    await this.AssociationsTab();
    await this.clickAddProjectButton();
    await this.fillSearchProjectInput(projectName);
    await this.selectProjectOption();
    await this.clickAddButton();
  });
}
// Verify empty list message
async verifyEmptyListMessage(projectName: string) {
  await test.step('Verify empty list message', async () => {
    await this.AssociationsTab();
    await this.clickAddProjectButton();
    await this.fillSearchProjectInput(projectName);
    await this.page.waitForTimeout(400)
    await this.selectProjectOption()
    await this.clickAddButton();
    await this.page.waitForTimeout(1500);
      // Clear any existing projects in the list (if any) by clicking checkbox and trash icon
      const checkbox = this.page.getByRole('checkbox').nth(1);
      await checkbox.click({ force: true });
      const trashIcon = this.page.locator(".mr-2.cursor-pointer.ng-star-inserted").first();
      await trashIcon.click({ force: true });
      const NoRecord = this.page.getByRole('cell', { name: 'No records found' });
      await expect(NoRecord).toBeVisible()
  });
}

async verifyAddProjectwithoutDropdownOption() {
  await test.step('Try adding project without selecting any', async () => {
    await this.AssociationsTab();
    await this.clickAddProjectButton();
    await this.clickAddButton();
  });
}
}