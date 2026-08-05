import { test as base } from '@playwright/test';
import { ContactPage } from '../../pages/contacts/ContactPage';
import * as path from 'path';
import * as fs from 'fs';
import { faker } from '@faker-js/faker'; // <-- FIX: add import for faker

const managerSessionPath = path.join(__dirname, '../../sessions/manager-session.json');
const DASHBOARD_URL = process.env.DASHBOARD_URL;

const IMAGE_DIR = path.resolve(__dirname, 'Images');

// Utility functions to ensure directory and file existence
function ensureDirExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
function ensureFileExists(filePath: string) {
  if (!fs.existsSync(filePath)) {
    // Create a dummy file if it does not exist.
    fs.writeFileSync(filePath, '');
  }
}

// Extend test to provide sessionPage for authenticated context
const test = base.extend<{ sessionPage: any }>({
  sessionPage: [async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: managerSessionPath });
    try {
      const page = await context.newPage();
      await page.goto(DASHBOARD_URL);
      await use(page);
    } finally {
      // Optionally close context if desired in cleanup
    }
  }, { scope: 'worker' }]
});


test.describe('Contacts side Menu Tests - Remmi E2E', () => {

  test('Test 1: Verify that the contact form opens successfully', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyContactFormOpensSuccessfully();
  });

  test('Test 2: Verify that the contact form can be closed with the X icon', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyContactFormCloseWithXIcon();
  });

  test('Test 3: Verify image upload functionality is removed from the contact form', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyImageUploadFunctionalityNotDisplayed();
  });

  test('Test 4: Verify that the contact initials placeholder is displayed', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    await contact.verifyContactInitialsPlaceholderDisplays(firstName, lastName);
  });

  test('Test 5: Verify that selecting a contact type updates the type dropdown', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifySelectContactTypeUpdatesDropdown();
  });

  test('Test 6: Verify required fields validation for Company contact type', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyRequiredFieldsValidationForCompany();
  });

  test('Test 7: Verify that the first word of each error message starts with a capital letter', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyRequiredFieldsCapitalizedValidationForCompany();
  });

  test('Test 8: Verify required fields validation for Individual contact type', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyRequiredFieldsValidationForIndividual();
  });

  test('Test 9: Verify that clicking "Save" button saves the contact form', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifySaveButtonSavesForm();
  });

  test('Test 10: Verify that clicking "Save & Close" saves and closes the contact form', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifySaveAndCloseButtonSavesAndClosesForm();
  });

  test('Test 11: Verify that "Select All" changes to "Deselect All" after selecting all check circles', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifySelectAllChangesToDeselectAllInPreferredContactMethod();
  });

  test('Test 12: Verify validation for invalid email format in contact form', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyInvalidEmailFormatErrorMessage();
  });

  test('Test 13: Verify that clicking the "+" icon adds a new email field', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyAddEmailField();
  });

  test('Test 14: Verify that clicking the "+" icon adds a new phone field', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyAddPhoneField();
  });

  test('Test 15: Verify that an email or phone field can be deleted', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyDeleteEmailOrPhoneField();
  });

  test('Test 16: Verify that clicking the correct (✔) button sets an email as the primary email', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifySetPrimaryEmail();
  });

  test('Test 17: Attempt to save a tag without entering a name', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyCannotSaveTagWithoutName();
  });

  test('Test 18: Verify that a company is successfully associated with the contact', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyCompanyAssociatedWithContact('Netsol INC');
  });

  test('Test 19: Try to associate the same company twice', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.tryAssociateSameCompanyTwice('Netsol INC');
  });

  test('Test 20: Verify that clicking on a company tag opens the company form', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyOpenCompanyFormFromTag('Netsol INC');
  });

  test('Test 21: Verify that a company tag can be removed', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyRemoveCompanyTag('Netsol INC');
  });

  test('Test 22: Verify that address suggestions appear while typing in the address field', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyAddressSuggestions('123 Main');
  });

  test('Test 23: Verify that entering an address auto-fills the relevant fields', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyAddressAutoFill('1600 Amphitheatre Road');
  });

  test('Test 24: Verify that entering data in address fields updates the main address field', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyMainAddressUpdatesWithAllFields();
  });

  test('Test 25: Verify that all address fields are displayed correctly', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyAllAddressFieldsDisplayed();
  });

  test('Test 26: Verify that the Tag Manager popup opens', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTagManagerPopupOpens();
  });

  test('Test 27: Verify that a new tag type can be added', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyCanAddNewTagType('Automation Testing');
  });

  test('Test 28: Search for a non-existent tag in Tag Manager', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.searchForNonExistentTag('NonExistentTag123');
  });

  test('Test 29: Verify that entering a valid tag and pressing "Enter" creates a tag', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    const tagTypeName = 'Automation Testing';
    const tagValue = faker.lorem.words(1);
    await contact.verifyCreateTagByEnter(tagTypeName, tagValue);
  });

  test('Test 30: Verify that removing a tag updates the tag list', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    // Now remove the tag and verify it updates the tag list
    await contact.verifyRemoveTagUpdatesTagList();
  });

  test('Test 31: Verify that a tag remains in the list after form save', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    const tagTypeName = 'Automation Testing';
    const tagValue = faker.lorem.words(1);
    await contact.verifyTagPersistsAfterFormSave(tagTypeName, tagValue);
  });

  test('Test 32: Verify that double clicking a tag adds it to the tag field', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    const tagTypeName = 'Automation Testing';
    const tagValue = faker.lorem.words(1);
    await contact.verifyDoubleClickTagAddsToField(tagTypeName, tagValue);
  });

  test('Test 33: Verify that tags can be searched in the Tag Manager', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTagCanBeSearchedInTagManager('Admin');
  });

  test('Test 34: Verify that clicking "X" on the Tag Manager popup closes it', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTagManagerPopupCloseWithX();
  });

  test('Test 35: Verify that clicking "Cancel" on the tag creation popup closes it', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTagCreationPopupCloseWithCancel();
  });

  test('Test 36: Verify that clicking "Save" after filling all required fields in tag creation successfully saves the tag', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    const tagTypeName = 'Automation Testing';
    const tagValue = faker.lorem.word();
    await contact.verifyTagCreationPopupSaveWorks(tagTypeName, tagValue);
  });

  test('Test 37: Verify that clicking "Save & Close" after filling all required fields in tag creation saves and closes the form', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    const tagTypeName = 'Automation testing';
    const tagValue = faker.lorem.word();
    await contact.verifyAddandCloseTag(tagTypeName, tagValue);
  });

});
