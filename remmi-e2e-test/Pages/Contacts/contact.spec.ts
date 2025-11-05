import { test } from '@playwright/test';
import { ContactActions } from './contactAction';
import { LoginActions } from '../Login/LoginAction';
import { LoginUsers } from '../../fixture/test-data';

const OprationManager = LoginUsers.manager;
const salesAgent = LoginUsers.sales;
const admin = LoginUsers.admin;


test.describe('Contacts side Menu Tests - Remmi E2E', () => {

    test('Test 1: Verify contact search functionality', async ({ page }) => {
        const login = new LoginActions(page);
        const contact = new ContactActions(page);
    
        await login.login(OprationManager.email!, OprationManager.password!, OprationManager.otpSecret!);
        await contact.NavigateToContacts();
        await contact.verifySearchFuntionality('Hina Test')
      });

      test('Test 2: Verify search with an invalid contact name', async ({ page }) => {
        const login = new LoginActions(page);
        const contact = new ContactActions(page);
    
        await login.login(OprationManager.email!, OprationManager.password!, OprationManager.otpSecret!);
        await contact.NavigateToContacts();
        await contact.searchNonExistingContact('fghjkkkk')
      });
      
      test('Test 3: Verify contact type dropdown filters contacts correctly', async ({ page }) => {
        const login = new LoginActions(page);
        const contact = new ContactActions(page);
    
        await login.login(OprationManager.email!, OprationManager.password!, OprationManager.otpSecret!);
        await contact.verifyContactDropdownFilter('Agent');
      });

      test('Test 4: Verify "Select All" functionality in contact type dropdown', async ({ page }) => {
        const login = new LoginActions(page);
        const contact = new ContactActions(page);
    
        await login.login(OprationManager.email!, OprationManager.password!, OprationManager.otpSecret!);
        await contact.NavigateToContacts();
        await page.waitForTimeout(2000);
        await contact.selectAllContactType();
      });

      test('Test 5: Verify "Deselect All" functionality in contact type dropdown', async ({ page }) => {
        const login = new LoginActions(page);
        const contact = new ContactActions(page);
    
        await login.login(OprationManager.email!, OprationManager.password!, OprationManager.otpSecret!);
        await contact.deselectAllContactType();
      });

      test('Test 6: Verify search within contact type dropdown', async ({ page }) => {
        const login = new LoginActions(page);
        const contact = new ContactActions(page);
    
        await login.login(OprationManager.email!, OprationManager.password!, OprationManager.otpSecret!);
        await contact.verifymatchingTypeDisplayed('Agent');
      });

      test('Test 7: Verify company type dropdown filters companies correctly', async ({ page }) => {
        const login = new LoginActions(page);
        const contact = new ContactActions(page);
    
        await login.login(OprationManager.email!, OprationManager.password!, OprationManager.otpSecret!);
        await contact.verifyCompanyTypeDropdownFilter('Agency');
      });
});