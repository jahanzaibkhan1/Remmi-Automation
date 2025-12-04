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

  test('Test 6: Searching listing with an empty field', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.searchListingWithEmptyField();
    await listingActions.resetFilters();
  });

  test('Test 7: Selecting a single property type', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.selectPropertyType();
    await listingActions.resetFilters();
  });

  test('Test 8: Selecting multiple property types in List View', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.selectMultiplePropertyTypesInListView();
    await listingActions.resetFilters();
  });

  test('Test 9: Deselecting all property types in List View', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.deselectPropertyTypes();
    await listingActions.resetFilters();
  });

  test('Test 10: Searching for a non-existing property type in List View', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.searchForNonExistingPropertyType('NonExistentType123');
    await listingActions.resetFilters();
  });

  test('Test 11: Filtering with a valid suburb in List View', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.filterByValidSuburb('Laidley');
    await listingActions.resetFilters();
  });

  test('Test 12: Filtering with multiple suburbs in List View', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.filterByMultipleSuburbs(['Laidley', 'Anglesea']);
    await listingActions.resetFilters();
  });

  test('Test 13: Deselecting all suburbs in List View', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.deselectAllSuburbsInListView();
    await listingActions.resetFilters();
  });

  test('Test 14: Searching for a non-existing suburb in List View', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.searchForNonExistingSuburb('NonExistentSuburb123');
    await listingActions.resetFilters();
  });

  test('Test 15: Filtering by a valid listing status in List View', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.filterByValidListingStatus('For Sale');
    await listingActions.resetFilters();
  });

  test('Test 16: Selecting multiple contract statuses in List View', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.selectMultipleListingStatusesInListView(['For Sale', 'For Lease']);
    await listingActions.resetFilters();
  });

});



export { test };
