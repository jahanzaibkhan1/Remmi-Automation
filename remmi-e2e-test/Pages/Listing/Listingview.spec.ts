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

  test('Test 1: Searching for a valid Listing', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.searchForExistingListingview('Hina Agent');
    await listingActions.resetFilters()
  });

  test('Test 2: Searching for a non-existing Listing', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.searchForNonExistingListing('Invalid listing name');
    await listingActions.resetFilters()
  });

  test('Test 3: Searching for a listing using partial name', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.searchForPartialListingview('Hin');
    await listingActions.resetFilters()
  });

  test('Test 4: Searching listing with special characters', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.searchListingWithSpecialCharacters('@@@$###!!!');
    await listingActions.resetFilters();
  });

  test('Test 5: Searching with Listing only', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.searchForListingview('Hina Agent');
    await listingActions.resetFilters()
  });

});



export { test };
