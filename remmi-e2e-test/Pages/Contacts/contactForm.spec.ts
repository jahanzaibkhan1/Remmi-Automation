import { test } from '@playwright/test';
import { ContactActions } from './contactAction';
import { LoginActions } from '../Login/LoginAction';
import { LoginUsers } from '../../fixture/test-data';
import { fa, faker } from '@faker-js/faker';

const OprationManager = LoginUsers.manager;
const salesAgent = LoginUsers.sales;
const admin = LoginUsers.admin;


test.describe('Contacts side Menu Tests - Remmi E2E', () => {

  test('Test 1: Verify that the contact form opens successfully', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifyContactFormOpensSuccessfully()
  });

  test('Test 2: Verify that the contact form can be closed with the X icon', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifyContactFormCloseWithXIcon();
  });

  test('Test 3: Verify image upload functionality is removed from the contact form', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifyImageUploadFunctionalityNotDisplayed()
  });

  test('Test 4: Verify that the contact initials placeholder is displayed', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    await contact.verifyContactInitialsPlaceholderDisplays(firstName, lastName);
  });

  test('Test 5: Verify that selecting a contact type updates the type dropdown', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifySelectContactTypeUpdatesDropdown();
  });

  test('Test 6: Verify required fields validation for Company contact type', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifyRequiredFieldsValidationForCompany();
  });

  test('Test 7: Verify that the first word of each error message starts with a capital letter', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifyRequiredFieldsCapitalizedValidationForCompany();
  });

  test('Test 8: Verify required fields validation for Individual contact type', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifyRequiredFieldsValidationForIndividual();
  });

  test('Test 9: Verify that clicking "Save" button saves the contact form', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifySaveButtonSavesForm();
  });

  test('Test 10: Verify that clicking "Save & Close" saves and closes the contact form', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifySaveAndCloseButtonSavesAndClosesForm();
  });

  test('Test 11: Verify that "Select All" changes to "Deselect All" after selecting all check circles', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifySelectAllChangesToDeselectAllInPreferredContactMethod()
  });

  test('Test 12: Verify validation for invalid email format in contact form', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifyInvalidEmailFormatErrorMessage();
  });

  test('Test 13: Verify that clicking the "+" icon adds a new email field', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifyAddEmailField();
  });

  test('Test 14: Verify that clicking the "+" icon adds a new phone field', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifyAddPhoneField();
  });

  test('Test 15: Verify that an email or phone field can be deleted', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifyDeleteEmailOrPhoneField();
  });

  test('Test 16: Verify that clicking the correct (✔) button sets an email as the primary email', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifySetPrimaryEmail();
  });

  test('Test 17: Attempt to save a tag without entering a name', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifyCannotSaveTagWithoutName()
  });

  test('Test 18: Verify that a company is successfully associated with the contact', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifyCompanyAssociatedWithContact('Netsol');
  });

  test('Test 19: Try to associate the same company twice', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.tryAssociateSameCompanyTwice('Netsol');
  });

  test('Test 20: Verify that clicking on a company tag opens the company form', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifyOpenCompanyFormFromTag('Netsol');
  });

  test('Test 21: Verify that a company tag can be removed', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifyRemoveCompanyTag('Netsol');
  });

  test('Test 22: Verify that address suggestions appear while typing in the address field', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifyAddressSuggestions('123 Main');
  });

  test('Test 23: Verify that entering an address auto-fills the relevant fields', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifyAddressAutoFill('1600 Amphitheatre');
  });

  test('Test 24: Verify that entering data in address fields updates the main address field', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await contact.verifyMainAddressUpdatesWithAllFields();
  });

  test('Test 25: Verify that all address fields are displayed correctly', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifyAllAddressFieldsDisplayed();
  });

  test('Test 26: Verify that the Tag Manager popup opens', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifyTagManagerPopupOpens()
  });

  test('Test 27: Verify that a new tag type can be added', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await contact.verifyCanAddNewTagType('Automation Testing');
  });

  test('Test 28: Search for a non-existent tag in Tag Manager', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.searchForNonExistentTag('NonExistentTag123');
  });

  test('Test 29: Verify that entering a valid tag and pressing "Enter" creates a tag', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    const tagTypeName = 'Automation Testing';
    const tagValue = faker.lorem.words(1);
    await contact.verifyCreateTagByEnter(tagTypeName, tagValue);
  });

  test('Test 30: Verify that removing a tag updates the tag list', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    const tagValue = faker.lorem.words(1);


    // Now remove the tag and verify it updates the tag list
    await contact.verifyRemoveTagUpdatesTagList(tagValue);
  });

  test('Test 31: Verify that a tag remains in the list after form save', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    const tagTypeName = 'Automation Testing';
    const tagValue = faker.lorem.words(1);

    await contact.verifyTagPersistsAfterFormSave(tagTypeName, tagValue);
  });

  test('Test 32: Verify that double clicking a tag adds it to the tag field', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    const tagTypeName = 'Automation Testing';
    const tagValue = faker.lorem.words(1);

    await contact.verifyDoubleClickTagAddsToField(tagTypeName, tagValue);
  });
});
  