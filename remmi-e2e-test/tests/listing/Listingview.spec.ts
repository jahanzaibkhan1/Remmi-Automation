import { test as base } from '@playwright/test';
import { ListingPage } from '../../pages/listing/ListingPage';
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
    const listingActions = new ListingPage(sessionPage);
    await listingActions.searchForExistingListingview('Hina Agent');
    await listingActions.resetFilters()
  });

  test('Test 2: Searching for a non-existing Listing', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.searchForNonExistingListing('Invalid listing name');
    await listingActions.resetFilters()
  });

  test('Test 3: Searching for a listing using partial name', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.searchForPartialListingview('Hin');
    await listingActions.resetFilters()
  });

  test('Test 4: Searching listing with special characters', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.searchListingWithSpecialCharacters('@@@$###!!!');
    await listingActions.resetFilters();
  });

  test('Test 5: Searching with Listing only', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.searchForListingview('Hina Agent');
    await listingActions.resetFilters()
  });

  test('Test 6: Searching listing with an empty field', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.searchListingWithEmptyField();
    await listingActions.resetFilters();
  });

  test('Test 7: Selecting a single property type', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectPropertyType();
    await listingActions.resetFilters();
  });

  test('Test 8: Selecting multiple property types in List View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectMultiplePropertyTypesInListView();
    await listingActions.resetFilters();
  });

  test('Test 9: Deselecting all property types in List View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.deselectPropertyTypes();
    await listingActions.resetFilters();
  });

  test('Test 10: Searching for a non-existing property type in List View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.searchForNonExistingPropertyType('NonExistentType123');
    await listingActions.resetFilters();
  });

  test('Test 11: Filtering with a valid suburb in List View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.filterByValidSuburb('Laidley');
    await listingActions.resetFilters();
  });

  test('Test 12: Filtering with multiple suburbs in List View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.filterByMultipleSuburbs(['Laidley', 'Anglesea']);
    await listingActions.resetFilters();
  });

  test('Test 13: Deselecting all suburbs in List View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.deselectAllSuburbsInListView();
    await listingActions.resetFilters();
  });

  test('Test 14: Searching for a non-existing suburb in List View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.searchForNonExistingSuburb('NonExistentSuburb123');
    await listingActions.resetFilters();
  });

  test('Test 15: Filtering by a valid listing status in List View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.filterByValidListingStatus('For Sale');
    await listingActions.resetFilters();
  });

  test('Test 16: Selecting multiple contract statuses in List View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectMultipleListingStatusesInListView(['For Sale', 'For Lease']);
    await listingActions.resetFilters();
  });

  test('Test 17: Deselecting all listing statuses in List View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.deselectAllListingStatus();
    await listingActions.resetFilters();
  });

  test('Test 18: Filtering by a valid listing type in List View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.filterByValidListingType('Auction');
    await listingActions.resetFilters();
  });

  test('Test 19: Selecting multiple listing types in List View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectMultipleListingType();
    await listingActions.resetFilters();
  });

  test('Test 20: Deselecting all listing types in List View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.deselectAllListingTypesInListView();
    await listingActions.resetFilters();
  });

  test('Test 21: Filtering by a valid agent in List View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.filterByValidAgent('Dawood Ahmad');
    await listingActions.resetFilters();
  });

  test('Test 22: Selecting multiple agents in List View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectMultipleAgent();
    await listingActions.resetFilters();
  });

  test('Test 23: Deselecting all agents in List View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.deselectAllAgentsInListView();
    await listingActions.resetFilters();
  });

  test('Test 24: Searching for an inactive agent in List View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.searchForInactiveAgentInListView('Test Inactive Agent');
    await listingActions.resetFilters();
  });

  test('Test 25: Filtering by a valid contract status in List View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.filterByValidContractStatus('Contract issued');
    await listingActions.resetFilters();
  });

  test('Test 26: Selecting multiple contract statuses in List View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectMultipleContractStatusesInListView();
    await listingActions.resetFilters();
  });

  test('Test 27: Deselecting all contract statuses in List View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.deselectAllContractStatusesInListView();
    await listingActions.resetFilters();
  });

  test('Test 28: Selecting a valid listing creation date range in List View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectValidListingCreationDateRange();
    await listingActions.resetFilters();
  });

  test('Test 29: Selecting a future listing creation date in List View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectFutureListingCreationDateInListView();
    await listingActions.resetFilters();
  });

  test('Test 30: Clicking on Admin Default in List View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.clickAdminDefaultButton();
    await listingActions.resetFilters();
  });

  test('Test 31: Hiding and showing a Status in List View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.hideAndShowStatus();
    await listingActions.resetFilters();
  });

  test('Test 32: Dragging a status to change its position in List View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.dragStatusToNewPosition();
    await listingActions.resetFilters();
  });

  test('Test 33: Searching for a status inside Admin View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.searchStatusInAdminView('Primary Agent');
    await listingActions.resetFilters();
  });

  test('Test 34: Creating a new list view', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.CreateNewListView('Automation Testing');
    await listingActions.resetFilters();
  });

  test('Test 35: Creating a view without a name (should show error)', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.CreateViewWithoutName();
    await listingActions.resetFilters();
  });

  test('Test 36: Deleting an existing view', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.deleteView('Automation Testing');
    await listingActions.resetFilters();
  });

  test('Test 37: Sharing a view with a user or team', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    // Use a view name that is present or was created by previous tests
    await listingActions.shareView();
    await listingActions.resetFilters();
  });

  test('Test 38: Searching for a user/team inside Share View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.searchUserAndTeamInShareView();
    await listingActions.resetFilters();
  });

  test('Test 39: Apply a filter and verify reset removes all filters', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.applyListingFilter();
    await listingActions.resetFilters();
  });

  test('Test 40: Clicking Reset when no filters are applied', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.clickResetNoFilters();
  });

  test('Test 41: Deleting a listing from List View', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.deleteListingFromListView();
    await listingActions.resetFilters();
  });

  test('Test 42: Searching should not take more than 2 seconds', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.fastSearch('Hina');
    await listingActions.resetFilters();
  });

  test('Test 43: Filtering 100+ listings should be smooth', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.filterHundredPlusListingsSmoothly('Hina');
    await listingActions.resetFilters();
  });

  test('Test 44: Applying a valid filter on a status', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.applyvalidListingFilter('For Sale');
    await listingActions.resetFilters();
  });

  test('Test 45: Clearing an applied filter on Listing', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.clearAppliedFilters('For Sale');
    await listingActions.resetFilters();
  });

  test('Test 46: Selecting invalid data for a condition', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectInvalidData('under Offer');
    await listingActions.resetFilters();
  });

  test('Test 47: Sorting by a valid column', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.sortByValidColumn();
    await listingActions.resetFilters();
  });

  test('Test 48: Sorting after applying a filter', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.sortAfterFiltering('For Sale');
    await listingActions.resetFilters();
  });

  test('Test 49: Sorting by an empty column', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.sortListingByEmptyColumn();
    await listingActions.resetFilters();
  });

  test('Test 50: Scrolling down to load more Listings', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.scrollToLoadMoreListing();
    await listingActions.resetFilters();
  });

  test('Test 51: Applying multiple filters at once', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.applyMultipleFilters();
    await listingActions.resetFilters();
  });

  test('Test 52: Sorting and filtering together', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.sortAfterFilter('Hina');
    await listingActions.resetFilters();
  });

  test('Test 53: Opening multiple filters without applying', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.openMultipleFiltersWithoutApplying();
    await listingActions.resetFilters();
  });

  test('Test 54: Searching with an extremely long string', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.searchWithExtremelyLongString('The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs, safely!');
    await listingActions.resetFilters();
  });

  test('Test 55: Applying a filter and then quickly clicking Reset', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.applyFilterAndQuickReset('For Sale');
    await listingActions.resetFilters();
  });

  test('Test 56: Opening the contact form', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.openContactForm();
    await listingActions.resetFilters();
  });

  test('Test 57: Creating a Listing with required fields', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.createListingWithRequiredField('House', 'Rental', 'For Lease');
    await listingActions.resetFilters();
  });

  test('Test 58: Creating a Listing with missing required fields shows validation error', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.createListingWithMissingField();
    await listingActions.resetFilters();
  });

  test('Test 59: Scrolling down should load more listings', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.scrollToLoadListings();
    await listingActions.resetFilters();
  });

  test('Test 60: Opening and closing listing details modal', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.openAndCloseListingDetails();
  });

  test('Test 61: Opens, closes a listing details modal, then scrolls', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.openCloseListingThenScroll();
  });

test('Test 62: Open/close multiple listing modals, then scroll and load more', async ({ sessionPage }) => {
  const listingActions = new ListingPage(sessionPage);
  await listingActions.openCloseMultipleListingsThenScroll();
});

test('Test 63: Opening and closing a Listing, then applying filters', async ({ sessionPage }) => {
  const listingActions = new ListingPage(sessionPage);
  // Apply filter and then quickly reset it
  await listingActions.openAndCloseListingDetailsThenApplyFilter('For Sale');
});

test('Test 64: Searching for a listing and opening Listing details', async ({ sessionPage }) => {
  const listingActions = new ListingPage(sessionPage);
  await listingActions.searchAndOpenListing('Hina');
  await listingActions.resetFilters();
});

test('Test 65: Check for duplicate Property Address values in the table', async ({ sessionPage }) => {
  const listingActions = new ListingPage(sessionPage);
  await listingActions.checkForDuplicatePropertyAddresses();
  await listingActions.resetFilters();
});

});




export { test };
