import { Page, Locator } from '@playwright/test';

/**
 * Locators for the My Profile page.
 * Organized into clear sections for navigation, fields, buttons, PIN, and toast messages.
 */
export class MyProfileLocators {
  constructor(private page: Page) { }

  // ---------------- Navigation ----------------
  /**
   * Returns the locator for the profile icon.
   * Note: After uploading a profile image, the class or structure may change.
   * This method attempts to handle both the default and post-upload states.
   */
  profileIcon(): Locator {
    // Try the default selector first
    const possibleIcons = [
      this.page.locator("div.user-thumbnail-placeholder >> img"),
      this.page.locator(".user_thumb.ng-star-inserted"),
      this.page.locator(".pi.pi-angle-down.pl-2"),
    ];
    // Return a locator that matches any of the selectors
    return this.page.locator([
      "div.user-thumbnail-placeholder >> img",
      ".user_thumb.ng-star-inserted",
      ".pi.pi-angle-down.pl-2"
    ].join(', '));
  }

  myProfileButton(): Locator {
    return this.page.getByRole('menuitem', { name: 'My Profile' }).locator('a');
  }

  // ---------------- Profile Fields ----------------
  firstName(): Locator {
    return this.page.getByRole('textbox', { name: 'First Name *' });
  }

  lastName(): Locator {
    return this.page.getByRole('textbox', { name: 'Last Name *' });
  }

  email(): Locator {
    return this.page.getByRole('textbox', { name: 'Email *' });
  }

  mobileNumber(): Locator {
    return this.page
      .locator('div')
      .filter({ hasText: /^Email \*\+61Mobile NumberTelephone$/ })
      .getByRole('textbox')
      .nth(1);
  }

  telephone(): Locator {
    return this.page.locator('div').filter({ hasText: /^Telephone$/ }).nth(1);
  }

  jobTitle(): Locator {
    return this.page.getByRole('textbox', { name: 'Job Title' });
  }

  biography(): Locator {
    return this.page.getByRole('textbox', { name: 'Biography' });
  }

  role(): Locator {
    return this.page.locator("input[formcontrolname='role']");
  }

  group(): Locator {
    return this.page.locator("input[formcontrolname='group']");
  }

  office(): Locator {
    return this.page.locator("input[formcontrolname='office']");
  }

  // ---------------- Password & PIN ----------------
  password(): Locator {
    return this.page.locator('input[type="password"]');
  }

  generatePassword(): Locator {
    return this.page.getByRole('button', { name: 'Generate Password' });
  }

  pin(): Locator {
    return this.page.locator("input[placeholder='e.g 1234']");
  }

  pinPopupField(): Locator {
    return this.page.getByPlaceholder('PIN');
  }

  // ---------------- Private Library ----------------
  libraryLink(): Locator {
    return this.page.locator("//li[@data-label='Library']");
  }

  searchBox(): Locator {
    return this.page.locator('#wrapper').getByRole('textbox', { name: 'Search' });
  }

  clickImage(): Locator {
    return this.page.locator("(//img[@class='img-hub2 ng-star-inserted'])[1]");
  }

  privateDownloadButton(): Locator {
    return this.page.locator('.p-element.mr-3.pi.pi-download');
  }

  // ---------------- Calendar ----------------
  calendarColor(): Locator {
    return this.page.locator(
      'input.p-colorpicker-preview.p-inputtext[data-pc-section="input"]'
    );
  }

  // ---------------- Buttons ----------------
  updateButton(): Locator {
    return this.page.getByRole('button', { name: 'Update' });
  }

  saveButton(): Locator {
    return this.page.getByRole('button', { name: 'Save' });
  }

  pinConfirmButton(): Locator {
    return this.page.getByRole('button', { name: /Confirm|OK|Save/i });
  }

  // ---------------- Toasts / Messages ----------------

  toast(): Locator {
    return this.page.locator('div[role="alert"]');
  }

  profileUpdatedToast(): Locator {
    return this.page.getByRole('alert', { name: /Profile has been updated/i });
  }

  pinMatchedToast(): Locator {
    return this.page.getByRole('alert', { name: /PIN matched successfully/i });
  }

  pinEmptyErrorToast(): Locator {
    return this.page.getByRole('alert', { name: /Please enter PIN first/i });
  }

  pinInvalidErrorToast(): Locator {
    return this.page.getByRole('alert', { name: /Invalid PIN/i });
  }

  // ---------------- Images Tab ----------------
  imagesTab(): Locator {
    return this.page.getByText('Images', { exact: true });;
  }
  addProfileImage(): Locator {
    return this.page.locator("i[class='pi pi-plus f-12']");
  }
  uploadImage(index: number = 0): Locator {
    return this.page.locator('[ptooltip="Upload Image"]');
  }
  updateImages(): Locator {
    return this.page.locator('button:has-text("Update Images")');
  }
  AddMoreImagesButton(): Locator {
    return this.page.locator("i[class='pi pi-plus f-12']");
  }
  uploadMoreImageButton(): Locator {
    return this.page.locator('button:has-text("Upload Image"), div:has-text("Upload Image")');
  }
  defaultProfileCheckbox(): Locator {
    return this.page.locator('div:nth-child(4) > .d-flex.align-items-center.my-2 > .d-flex > .p-element > .p-checkbox > .p-checkbox-box');
  }
  InvalidImageFormatsError(): Locator {
    return this.page.getByRole('alert', { name: 'Unsupported file format!' })
  }
  corruptedImageAlert(): Locator {
    return this.page.locator('div[role="alert"][aria-label="Corrupted image file! Please upload a valid image"]');
  }

  /*
   * -----------------------------------------Social Setting Locators------------------------------------*
  */

  SocialSettingTab(): Locator {
    return this.page.getByRole('tab', { name: 'Social Setting' })
  }
  FaceBookUrl(): Locator {
    return this.page.locator('input[formcontrolname="facebook"]');
  }

  XUrl(): Locator {
    return this.page.locator('input[formcontrolname="twitter"]');
  }

  InstagramUrl(): Locator {
    return this.page.locator('input[formcontrolname="instagram"]');
  }

  LinkedInUrl(): Locator {
    return this.page.locator('input[formcontrolname="linkedin"]');
  }

  WebsiteUrl(): Locator {
    return this.page.locator('input[formcontrolname="website"]');
  }
  MarketingEmail(): Locator {
    return this.page.locator('input[formcontrolname="marketing_email"]');
  }

  BsoAdminInput(): Locator {
    return this.page.locator('.ng-select-searchable.ng-select-clearable > .ng-select-container > .ng-value-container > .ng-input > input');
  }
  BsoAdminOptions(): Locator {
    return this.page.locator('div.ng-option.ng-star-inserted');
  }

  /*
  *---------------------------------------------Profile Access Tab Locators----------------------------------------------*
  */
  AccessTab(): Locator {
    return this.page.getByRole('tab', { name: 'Access' });
  }
  selectUser(): Locator {
    return this.page.locator('div').filter({ hasText: /^Select$/ }).first()
  }
  SearchUserName(): Locator {
    return this.page.getByRole('textbox', { name: 'Type to search' })
  }
  selectuserFromDropdown(userName: string): Locator {
    return this.page.locator(`li:has-text("${userName}") div.checkbox__checkmark`);
  }

  SaveAccessButton(): Locator {
    return this.page.locator('button[type="submit"]._primary-btn').first();
  }

  calendarAccessUserName(userName: string): Locator {
    return this.page.locator(`tr td:text-is("${userName}")`);
  }

  calendarUpdateMessage() {
    return this.page.getByRole('alert', { name: 'Calendar access updated' });
  }

  deleteUserIcon(): Locator {
    return this.page.locator('td:nth-child(2) > .d-flex > .cursor-pointer').first()
  }

  selectAll(): Locator {
    return this.page.locator('.checkbox__checkmark').first()
  }
  DeselectAll(): Locator {
    return this.page.locator('label[data="Deselect All"] .checkbox__checkmark')
  }
  /**
   * Locator for the Calendar menu in the side menu
   */
  CalendarMenu(): Locator {
    return this.page.locator('li[data-label="Calendar"]');
  }
  // Locator for the Notifications tab
  NotificationsTab(): Locator {
    return this.page.locator('a#pills-notification-tab');
  }
  webNotificationToggle(): Locator {
    return this.page.locator('.p-inputswitch-slider').first();
  }
  emailNotificationToggle(): Locator {
    return this.page.locator('div:nth-child(2) > .SP-switch > .p-element > .p-inputswitch > .p-inputswitch-slider');
  }

  // -------------------------------------------Locator For Teams Tab------------------------------------------//
  TeamsTabs(): Locator {
    return this.page.getByRole('tab', { name: 'Teams' });
  }
  SelectTeam(teamName: string): Locator {
    // Keep same method name and param — no need to change in tests
    return this.page.locator('ng-select[name="team"] input');
  }
  
  SelectTeamOption(teamName: string): Locator {
    // Updated for better matching
    return this.page.locator('.ng-dropdown-panel .ng-option span', { hasText: teamName });
  }

  
  AddButton(): Locator {
    return this.page.getByRole('button', { name: ' Add' });
  }

  TeamRow(teamName: string): Locator {
    return this.page.locator('tbody.p-datatable-tbody > tr', { hasText: teamName });
}
  CancelTeamButton(): Locator{
    return this.page.getByRole('button', { name: 'Cancel' })
  }
  EditIcon(): Locator {
    return this.page.locator('.cursor-pointer.mr-2');
  }
  DeleteIcon(): Locator {
    return this.page.getByRole('img', { name: 'delete' });
  }
  Searchkeyword(): Locator {
    return this.page.getByRole('textbox', { name: 'Search keyword' })
  }

  createNewTeam():Locator{
    return this.page.getByRole('link', { name: '+ Create new' })
  }
  crossPopup():Locator{
    return this.page.locator("//button[@class='popup-close']");
  }
  changeProfile():Locator{
    return this.page.locator('.profile-changer');
  }
  SelectOffice(OfficeName: string):Locator{
    return this.page.locator('div.ng-value-container input[type="text"]').nth(3);
  }
  SelectOfficeOption():Locator{
    return this.page.locator("span[class='p-element ng-star-inserted']")
  }
  SelectTeamMemberDropdown(): Locator {
    return this.page.locator('re-multiselect[formcontrolname="members"] .tags');
  }
  
  SelectTeamMemberSearchInput(): Locator {
    return this.page.locator("input[placeholder='Type to search']");
  }
  
  SelectTeamMemberOption(): Locator {
    return this.page.locator("//li[@class='p-element ng-star-inserted']");
  }

  SelectTeamLeaderDropdown(): Locator {
    return this.page.locator("ng-select[placeholder='Select Members'] div[class='ng-placeholder']");
  }
  
  SelectTeamLeaderSearchInput(): Locator {
    return this.page.locator("div[aria-expanded='true'] input[type='text']");
  }
  
  SelectTeamLeaderOption(): Locator {
    return this.page.locator(".ng-option span.p-element.ng-star-inserted");
  }
  
  
  TeamNameInput(): Locator {
    return this.page.getByRole('textbox').nth(4);
  }
  
  contactSideMenu():Locator{
    return this.page.locator("//li[@data-label='Contacts']");
  }
  ContactTeams():Locator{
    return this.page.locator("//a[contains(text(), 'Teams')]")
  }
  
  SelectNoRecordFound(): Locator {
    return this.page.locator('re-multiselect[formcontrolname="members"] ul li', { hasText: 'No Record Found' });
  }
  
  // -------------------------------------------Locator for MFA tab------------------------------------------//
  mfaTab(): Locator {
    return this.page.getByRole('tab', { name: 'MFA' });
  }

  // Locator for replace (icon/button)
  replaceButton(): Locator {
    return this.page.getByRole('img', { name: 'replace' });
  }
  googleAuthenticator(): Locator {
    return this.page.getByText('Google Authenticator');
  }
  // Locator for Microsoft Authenticator option
  microsoftAuthenticator(): Locator {
    return this.page.getByText('Microsoft Authenticator');
  }

  // Locator for Authy Authenticator option
  authyAuthenticator(): Locator {
    return this.page.getByText('Authy Authenticator');
  }

  // Locator for MFA code textbox
  mfaCodeTextbox(): Locator {
    return this.page.getByRole('textbox', { name: 'MFA Code1' });
  }

  // Locator for Save button
  saveMFAButton(): Locator {
    return this.page.getByRole('button', { name: 'Save' });
  }
}

