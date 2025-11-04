import { test } from '@playwright/test';
import { ContactActions } from './contactAction';
import { LoginActions } from '../Login/LoginAction';
import { LoginUsers } from '../../fixture/test-data';

const OprationManager = LoginUsers.manager;
const salesAgent = LoginUsers.sales;
const admin = LoginUsers.admin;


test.describe('Contacts side Menu Tests - Remmi E2E', () => {

    test('Test 1: Searching for an existing listing', async ({ page }) => {
        const login = new LoginActions(page);
        const contact = new ContactActions(page);
    
        await login.login(OprationManager.email!, OprationManager.password!, OprationManager.otpSecret!);
        await contact.NavigateToContacts();
        await contact.searchExistingContact('Hina Test')
      });

      test('Test 2: Searching for a non existing listing', async ({ page }) => {
        const login = new LoginActions(page);
        const contact = new ContactActions(page);
    
        await login.login(OprationManager.email!, OprationManager.password!, OprationManager.otpSecret!);
        await contact.NavigateToContacts();
        await contact.searchNonExistingContact('fghjkkkk')
      });
});