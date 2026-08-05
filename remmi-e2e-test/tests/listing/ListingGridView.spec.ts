import { test } from '../../fixtures/session.fixture';
import { ListingPage } from '../../pages/listing/ListingPage';

test.describe('Listing side Menu Tests - Remmi E2E', () => {

  test('Test 1: Searching for a valid contact', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.searchForValidListing('Hina Agent');
    await listingActions.resetFilters()

    
  });

  test('Test 2: Searching for an invalid contact', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.searchForInvalidListing('Invalid Contact Name');
    await listingActions.resetFilters()
  });

  test('Test 3: Searching with special characters', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.searchWithSpecialCharacters('$');
    await listingActions.resetFilters()
  });

  test('Test 4: Searching with an empty search field', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.searchWithEmptyField();
    await listingActions.resetFilters()
  });

  test('Test 5: Selecting a single property type filters listings correctly', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectSinglePropertyType();
    await listingActions.resetFilters()
  });

  test('Test 6: Selecting multiple property types filters listings correctly', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectMultiplePropertyTypes();
    await listingActions.resetFilters()
  });

  test('Test 7: Using "Select All" option selects all property types and filters listings accordingly', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectAllPropertyType();
    await listingActions.resetFilters()
  });

  test('Test 8: Using "Deselect All" option deselects all property types and resets filter', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.deselectAllPropertyTypes();
    await listingActions.resetFilters()
  });

  test('Test 9: Searching within property type filter displays correct filtered property types', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.searchWithinPropertyTypeFilter('house');
    await listingActions.resetFilters()
  });

  test('Test 10: Closing the property type dropdown works as expected', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectSinglePropertyAndCloseDropdown();
    await listingActions.resetFilters()
  });

  test('Test 11: Selecting a single suburb with assertions', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectSingleSuburb();
    await listingActions.resetFilters()
  });

  test('Test 12: Selecting multiple suburbs filters listings correctly', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectMultipleSuburbs();
    await listingActions.resetFilters()
  });

  test('Test 13: Using "Select All" in suburb dropdown selects all suburbs and displays all listings', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectAllSuburbs();
    await listingActions.resetFilters()
  });

  test('Test 14: Using "Deselect All" in suburb dropdown deselects all suburbs and resets filter', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.deselectAllSuburbs();
    await listingActions.resetFilters()
  });
  test('Test 15: Searching for a suburb in the dropdown filters listings', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.searchWithinSuburbDropdown('Anglesea');
    await listingActions.resetFilters()
  });

  test('Test 16: Selecting a single listing status filters the listings correctly', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectSingleListingStatus();
    await listingActions.resetFilters()
  });

  test('Test 17: Selecting multiple listing statuses filters listings correctly', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectMultipleListingStatuses();
    await listingActions.resetFilters()
  });

  test('Test 18: Using "Select All" in status filter selects all listing statuses and displays all listings', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectAllListingStatuses();
    await listingActions.resetFilters()
  });

  test('Test 19: Using "Deselect All" in status filter deselects all statuses and resets filter', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.deselectAllListingStatuses();
    await listingActions.resetFilters()
  });

  test('Test 20: Searching within listing status filter filters status options', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.searchListingStatusFilter('For Lease');
    await listingActions.resetFilters()
  });

  test('Test 21: Selecting a single listing type filters listings correctly', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectSingleListingType();
    await listingActions.resetFilters()
  });

  test('Test 22: Selecting multiple listing types filters listings correctly', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectMultipleListingTypes();
    await listingActions.resetFilters()
  });

  test('Test 23: Selecting a single agent filters listings to show only those for the chosen agent', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectSingleAgent();
    await listingActions.resetFilters()
  });
  test('Test 24: Selecting multiple agents filters listings to show only those for the chosen agents', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectMultipleAgents();
    await listingActions.resetFilters()
  });

  test('Test 25: Selecting a single contract status', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectSingleContractStatus();
    await listingActions.resetFilters()
  });

  test('Test 26: Selecting multiple contract statuses filters listings correctly', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectMultipleContractStatuses();
    await listingActions.resetFilters()
  });

  test('Test 27: Selecting a contact creation date', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectListingCreationDate();
    await listingActions.resetFilters()
  });

  test('Test 28: Selecting an invalid date', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.selectNextDateFromToday();
    await listingActions.resetFilters()
  });

  test('Test 29: Checking grid view display', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.checkGridViewDisplay();
  });

  test('Test 30: Checking contact details in grid view', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.checkContactDetailsInGridView();
    await listingActions.resetFilters()
  });

  test('Test 31: Expanding a Listing card', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.expandFirstContactCard();
  });

  test('Test 32: Collapsing an expanded Listing card', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.collapseExpandedListingCard();
  });

  test('Test 33: Deleting a listing card', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.deleteListingCard();
  });

  test('Test 34: Editing a listing card', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.editListingCard();
  });

  test('Test 35: Editing and saving changes on a listing card', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.editAndSaveListingCard();
  });

  test('Test 36: Opening a listing portal', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.openPortalListingCard();
  });

  test('Test 37: Comparing two listing cards', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.compareListingCard();
  });

  test('Test 38: Comparing more than two listing cards', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.compareMoreThanTwoListingCards();
  });

  test('Test 39: Resetting all filters restores listing defaults', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.resetAllFilters();
  });

  test('Test 40: Switching to grid view displays', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.switchToGridView();
  });

  test('Test 41: Switching to list view displays', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.switchToListView();
  });

  test('Test 42: Opening the contact form', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.openListingForm();
    await listingActions.resetFilters()
  });

  test('Test 43: Fill required fields and click "Save"', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.createListingWithRequiredFields('house', 'Rental', 'For Lease');
    await listingActions.resetFilters()
  });

  test('Test 44: Creating a Listing with missing required fields shows validation error', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.createListingWithMissingFields();
    await listingActions.resetFilters()
  });

  test('Test 45: Scrolling down should load more listings', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.scrollToLoadMoreListings();
  });

  test('Test 46: Searching and then applying filters', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.applyListingFilters();
    await listingActions.resetFilters()
  });

});

export { test };
