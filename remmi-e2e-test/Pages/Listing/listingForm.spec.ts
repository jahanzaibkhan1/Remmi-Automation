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

  test('Test 1: Open listing form', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.openContactForm();
  });

  test('Test 2: Close listing  form using cross icon', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.openContactForm();
  });

  test('Test 3: Close form without saving', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.closeFormWithoutSaving('House', 'Rental', 'For Lease');
  });

  test('Test 4: Pinning a listing', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.pinFirstListing();
  });

  test('Test 5: Opening a pinned listing', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.openPinnedListing();
  });

  test('Test 6: Unpinning a pinned listing', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.unpinFirstPinnedListing();
  });

  test('Test 7: Search field listing functionality', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.searchfieldListing();
  });

  test('Test 8: Selecting a listing from search', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    // Example address can be changed as necessary
    await listingActions.selectListingFromSearch();
  });

  test('Test 9: Confirming listing copy', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.confirmListingCopy();
  });

  test('Test 10: Declining listing copy', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    // This test should trigger the "Would you like to copy this" dialog and then decline it (click "No")
    await listingActions.navigateToListings();
    await listingActions.declineListingCopy()
  });

  test('Test 11: Closing the popup using the cross icon', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.closePopup();
  });

  test('Test 12: Search field reset', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.resetSearchField();
  });

  test('Test 13: Selecting a property in search', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.selectPropertyInSearch();
  });

  test('Test 14: Selecting previous listing in search', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.selectPreviousListing();
  });

  test('Test 15: Confirming previous listing data copy', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.previousListingCopy();
  });

  test('Test 16: Declining previous listing data copy', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.declinePreviousListingCopy();
  });

  test('Test 17: Search field reset after previous data selection', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.resetPreviousDataSearchField();
  });

  test('Test 18: Save button functionality', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.clickSaveButtonOnContactForm();
  });

  test('Test 19: Save without required fields', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.createListingWithMissingFields();
    await listingActions.resetFilters()
  });

  test('Test 20: Create listing with missing primary agent', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.withoutPrimaryAgent()
  });

  test('Test 21: Selecting "Auction" as listing type', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    // Assume there's a method for selecting listing type; if not, use direct actions as in previous tests
    await listingActions.selectAuctionAsListingType();
  });

  test('Test 22: Selecting "For Lease" as listing status', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.selectingForLease();
  });

  test('Test 23: Adding multiple agents to a listing', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();

    const agentNames = [
      'Automation Test',
      'Hina Agent',
      'Dawood Ahmad',
      'Jahanzaib Xenex'
    ];

    await listingActions.addMultipleAgents(agentNames);
  });

  test('Test 24: Feature name selection dropdown', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.selectFeatureByName();
  });

  test('Test 25: Searching in feature dropdown by name', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    // Provide the feature name you want to search for
    const featureName = "Air Conditioning";
    await listingActions.searchFeatureInDropdown(featureName);
  });

  test('Test 26: Closing feature dropdown', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.closeFeatureDropdown();
  });

  test('Test 27: Creating new listing from search', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.createNewListingFromSearch();
  });

  test('Test 28: Editing an existing listing', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.editExistingListing();
  });

  test('Test 29: Verify toggles functionality in search field selection', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifySearchFieldToggles();
  });

  test('Test 30: Verify toggles disappear after saving', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyTogglesDisappearAfterSaving();
  });

  test('Test 31: Resetting listing form', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.resetListingForm();
  });

  test('Test 32: Verify Save button functionality', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.checkSaveButton();
    await listingActions.resetFilters();
  });

  test('Test 33: Upload images to library', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    // Use a relative image path within the repo's PropertyImages folder
    const IMAGE_DIR = path.resolve(__dirname, 'PropertyImages');
    const imagePath = path.join(IMAGE_DIR, 'PropertyImage2.jpg');
    await listingActions.uploadImagesToLibrary(imagePath);
  });

  test('Test 34: No image uploaded', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.noImageUploadedScenario();
  });

  test('Test 35: Upload unsupported image format', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    // Use a relative image path within the repo's PropertyImages folder
    const IMAGE_DIR = path.resolve(__dirname, 'PropertyImages');
    const imagePath = path.join(IMAGE_DIR, 'invalidImage.webp');
    await listingActions.uploadunsupportedImageFormat(imagePath);
  });

  test('Test 36: Delete uploaded image', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.deleteUploadedImage();
  });

  test('Test 37: Invalid characters in fields', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.checkInvalidCharactersInFields();
  });

  test('Test 38: Duplicate listing  creation', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.createListingWithRequiredFields('house', 'Rental', 'For Lease');
    await listingActions.resetFilters()
  });

  test('Test 39: Listing appears in grid after save', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyListingAppearsInGrid();
  });

  test('Test 40: Search for a saved listing appears in results', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.searchForSavedListing();
  });

  test('Test 41: Delete a listing', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.deleteListingCard();
  });

  test('Test 42: Verifying delete action', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings()
    await listingActions.verifyListingNotVisibleAfterDeletion();
  });

  test('Test 43: Verify project association popup opens', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyProjectAssociationPopupOpens();
  });

  test('Test 44: Verify project dropdown displays all projects', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyProjectDropdownDisplaysAllProjects();
  });

  test('Test 45: Verify project cannot be associated without selection', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyProjectCannotAssociateWithoutSelection();
  });
  
  test('Test 46: Verify successful project association', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifySuccessfulProjectAssociation();
  });

  test('Test 47: Verify closing the project association popup without selecting', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyProjectAssociateWithoutSelection();
  });

  test('Test 48: Verify associated project listing leads', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyAssociatedProjectListingLeads();
  });

  test('Test 49: Verify buttons in lead, task, and related tabs before saving', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyButtonsInTabsBeforeSave()
  });

  test('Test 50: Verify conjunction tabs before saving', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyConjunctionTabsBeforeSave();
  });

  test('Test 51: Verify preview listing', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyPreviewListing();
  });

  test('Test 52: Verify admin view button in preview listing', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyAdminViewButtonInPreviewListing();
  });

  test('Test 53: Verify image and thumbnails in preview listing ', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    const path = require('path');
    const IMAGE_DIR = path.resolve(__dirname, 'PropertyImages');
    const images = [
      path.join(IMAGE_DIR, 'propertyImage.jpg'),
      path.join(IMAGE_DIR, 'PropertyImage2.jpg')
    ];
    await listingActions.uploadMultipleImagesToLibrary(images);
    await listingActions.verifyImageAndThumbnailsInPreviewListing();
  });

});