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

  test('Test 1: Searching for a valid contact', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.searchForValidListing('Hina Agent');
  });

  test('Test 2: Searching for an invalid contact', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.searchForInvalidListing('Invalid Contact Name');
  });

  test('Test 3: Searching with special characters', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.searchWithSpecialCharacters('$');
  });

  test('Test 4: Searching with an empty search field', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.searchWithEmptyField();
  });

  test('Test 5: Selecting a single property type filters listings correctly', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.selectSinglePropertyType();
  });

  test('Test 6: Selecting multiple property types filters listings correctly', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.selectMultiplePropertyTypes();
  });

  test('Test 7: Using "Select All" option selects all property types and filters listings accordingly', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.selectAllPropertyType();
  });

  test('Test 8: Using "Deselect All" option deselects all property types and resets filter', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.deselectAllPropertyTypes();
  });

  test('Test 9: Searching within property type filter displays correct filtered property types', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.searchWithinPropertyTypeFilter('house');
  });

  test('Test 10: Closing the property type dropdown works as expected', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.selectSinglePropertyAndCloseDropdown();
  });

  test('Test 11: Selecting a single suburb with assertions', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.selectSingleSuburb();
  });

  test('Test 12: Selecting multiple suburbs filters listings correctly', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.selectMultipleSuburbs();
  });

  test('Test 13: Using "Select All" in suburb dropdown selects all suburbs and displays all listings', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.selectAllSuburbs();
  });

  test('Test 14: Using "Deselect All" in suburb dropdown deselects all suburbs and resets filter', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.deselectAllSuburbs();
  });
  test('Test 15: Searching for a suburb in the dropdown filters listings', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.searchWithinSuburbDropdown('Anglesea');
  });

  test('Test 16: Selecting a single listing status filters the listings correctly', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.selectSingleListingStatus();
  });

  test('Test 17: Selecting multiple listing statuses filters listings correctly', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.selectMultipleListingStatuses();
  });

  test('Test 18: Using "Select All" in status filter selects all listing statuses and displays all listings', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.selectAllListingStatuses();
  });

  test('Test 19: Using "Deselect All" in status filter deselects all statuses and resets filter', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.deselectAllListingStatuses();
  });

  test('Test 20: Searching within listing status filter filters status options', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.searchListingStatusFilter('For Lease');
  });

  test('Test 21: Selecting a single listing type filters listings correctly', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.selectSingleListingType();
  });

  test('Test 22: Selecting multiple listing types filters listings correctly', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.selectMultipleListingTypes();
  });

  test('Test 23: Selecting a single agent filters listings to show only those for the chosen agent', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.selectSingleAgent();
  });
  test('Test 24: Selecting multiple agents filters listings to show only those for the chosen agents', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.selectMultipleAgents();
  });

  test('Test 25: Selecting a single contract status', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.selectSingleContractStatus();
  });

  test('Test 26: Selecting multiple contract statuses filters listings correctly', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.selectMultipleContractStatuses();
  });

  test('Test 27: Selecting a contact creation date', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.selectListingCreationDate();
  });

  // test('Test 28: Selecting an invalid date', async ({ sessionPage }) => {
  //   const listingActions = new ListingActions(sessionPage);
  //   await listingActions.selectNextDateFromToday();
  // });

  test('Test 29: Checking grid view display', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.checkGridViewDisplay();
  });

  test('Test 30: Checking contact details in grid view', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.checkContactDetailsInGridView();
  });

  test('Test 31: Expanding a Listing card', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.expandFirstContactCard();
  });

  test('Test 32: Collapsing an expanded Listing card', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.collapseExpandedListingCard();
  });

  test('Test 33: Deleting a listing card', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.deleteListingCard();
  });

  test('Test 34: Editing a listing card', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.editListingCard();
  });

  test('Test 35: Editing and saving changes on a listing card', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    const newTitle = `Updated Listing Title ${Date.now()}`;
    await listingActions.editAndSaveListingCard(newTitle);
  });

});



export { test };
