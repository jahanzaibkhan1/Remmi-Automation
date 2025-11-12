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
});
  