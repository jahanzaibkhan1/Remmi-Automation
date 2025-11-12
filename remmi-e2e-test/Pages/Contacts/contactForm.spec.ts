import { test } from '@playwright/test';
import { ContactActions } from './contactAction';
import { LoginActions } from '../Login/LoginAction';
import { LoginUsers } from '../../fixture/test-data';

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
});
   