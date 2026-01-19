import { test as base } from '@playwright/test';
import { ListingActions } from './ListingAction';
import * as path from 'path';

const managerSessionPath = path.join(__dirname, '../../sessions/manager-session.json');
const DASHBOARD_URL = process.env.DASHBOARD_URL || 'https://remmi-app-stage-ui.azurewebsites.net/dashboard';

const test = base.extend<{ sessionPage: any }>({
  sessionPage: [async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: managerSessionPath });
    try {
      const page = await context.newPage();
      await page.goto(DASHBOARD_URL);
      await use(page);
    } finally {

    }
  }, { scope: 'worker' }]
});


test.describe('Listing side Menu Tests - Remmi E2E', () => {

    test('Test 1: Verify that clicking the Add button in the Legal tab opens the contract popup in a new tab', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyAddButtonInLegalTabOpensContractPopup();
    });

    test('Test 2: Verify that the listing dropdown auto populates the selected listing in the contract popup', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyContractPopupListingDropdownAutoPopulates();
    });

    test('Test 3: Verify that the Seller field auto populates in the contract popup', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyContractPopupSellerFieldAutoPopulates();
    });
    
    test('Test 4: Verify that the listing dropdown auto selects the primary listing for the contract popup', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyContractPopupListingDropdownAutoPopulate();
    });

    test('Test 5: Verify that the Managing Contact dropdown auto selects the primary Contact for the contact', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyManagingContactDropdownAutoSelectsPrimaryContact();
    });

});