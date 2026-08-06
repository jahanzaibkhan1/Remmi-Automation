import { test } from '../../fixtures/session.fixture';
import { ListingFormPage as ListingPage } from '../../pages/listing/ListingFormPage';
import * as path from 'path';

test.describe('Listing side Menu Tests - Remmi E2E', () => {

  test('Test 1: Open listing form', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.openContactForm();
  });

  test('Test 2: Close listing  form using cross icon', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.openContactForm();
  });

  test('Test 3: Close form without saving', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.closeFormWithoutSaving();
  });

  test('Test 4: Pinning a listing', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.pinFirstListing();
  });

  test('Test 5: Opening a pinned listing', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.openPinnedListing();
  });

  test('Test 6: Unpinning a pinned listing', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.unpinFirstPinnedListing();
  });

  test('Test 7: Search field listing functionality', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.searchfieldListing();
  });

  test('Test 8: Selecting a listing from search', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    // Example address can be changed as necessary
    await listingActions.selectListingFromSearch();
  });

  test('Test 9: Confirming listing copy', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.confirmListingCopy();
  });

  test('Test 10: Declining listing copy', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.declineListingCopy()
  });

  test('Test 11: Closing the popup using the cross icon', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.closePopup();
  });

  test('Test 12: Search field reset', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.resetSearchField();
  });

  test('Test 13: Selecting a property in search', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.selectPropertyInSearch();
  });

  test('Test 14: Selecting previous listing in search', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.selectPreviousListing();
  });

  test('Test 15: Confirming previous listing data copy', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.previousListingCopy();
  });

  test('Test 16: Declining previous listing data copy', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.declinePreviousListingCopy();
  });

  test('Test 17: Search field reset after previous data selection', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.resetPreviousDataSearchField();
  });

  test('Test 18: Save button functionality', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.clickSaveButtonOnContactForm();
  });

  test('Test 19: Save without required fields', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.createListingWithMissingFields();
    await listingActions.resetFilters()
  });

  test('Test 20: Create listing with missing primary agent', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.withoutPrimaryAgent()
  });

  test('Test 21: Selecting "Auction" as listing type', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    // Assume there's a method for selecting listing type; if not, use direct actions as in previous tests
    await listingActions.selectAuctionAsListingType();
  });

  test('Test 22: Selecting "For Lease" as listing status', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.selectingForLease();
  });

  test('Test 23: Adding multiple agents to a listing', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
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
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.selectFeatureByName();
  });

  test('Test 25: Searching in feature dropdown by name', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    const featureName = "Air Conditioning";
    await listingActions.searchFeatureInDropdown(featureName);
  });

  test('Test 26: Closing feature dropdown', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.closeFeatureDropdown();
  });

  test('Test 27: Creating new listing from search', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.createNewListingFromSearch();
  });

  test('Test 28: Editing an existing listing', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.editExistingListing();
  });

  test('Test 29: Verify toggles functionality in search field selection', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifySearchFieldToggles();
  });

  test('Test 30: Verify toggles disappear after saving', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyTogglesDisappearAfterSaving();
  });

  test('Test 31: Resetting listing form', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.resetListingForm();
  });

  test('Test 32: Verify Save button functionality', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.checkSaveButton();
    await listingActions.resetFilters();
  });

  test('Test 33: Upload images to library', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    // Use a relative image path within the repo's PropertyImages folder
    const IMAGE_DIR = path.resolve(__dirname, 'PropertyImages');
    const imagePath = path.join(IMAGE_DIR, 'PropertyImage2.jpg');
    await listingActions.uploadImagesToLibrary(imagePath);
  });

  test('Test 34: No image uploaded', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.noImageUploadedScenario();
  });

  test('Test 35: Upload unsupported image format', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    const IMAGE_DIR = path.resolve(__dirname, 'PropertyImages');
    const imagePath = path.join(IMAGE_DIR, 'invalidImage.webp');
    await listingActions.uploadunsupportedImageFormat(imagePath);
  });

  test('Test 36: Delete uploaded image', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.deleteUploadedImage();
  });

  test('Test 37: Invalid characters in fields', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.checkInvalidCharactersInFields();
  });

  test('Test 38: Duplicate listing  creation', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.createListingWithRequiredFields('house', 'Rental', 'For Lease');
    await listingActions.resetFilters()
  });

  test('Test 39: Listing appears in grid after save', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.clickSaveButtonOnContactForm();
  });

  test('Test 40: Search for a saved listing appears in results', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.searchForSavedListing();
  });

  test('Test 41: Delete a listing', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.deleteListingCard();
  });

  test('Test 42: Verifying delete action', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings()
    await listingActions.verifyListingNotVisibleAfterDeletion();
  });

  test('Test 43: Verify project association popup opens', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyProjectAssociationPopupOpens();
  });

  test('Test 44: Verify project dropdown displays all projects', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyProjectDropdownDisplaysAllProjects();
  });

  test('Test 45: Verify project cannot be associated without selection', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyProjectCannotAssociateWithoutSelection();
  });

  test('Test 46: Verify successful project association', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifySuccessfulProjectAssociation();
  });

  test('Test 47: Verify closing the project association popup without selecting', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyProjectAssociateWithoutSelection();
  });

  test('Test 48: Verify associated project listing leads', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyAssociatedProjectListingLeads();
  });

  test('Test 49: Verify buttons in lead, task, and related tabs before saving', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyButtonsInTabsBeforeSave()
  });

  test('Test 50: Verify conjunction tabs before saving', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyConjunctionTabsBeforeSave();
  });

  test('Test 51: Verify preview listing', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyPreviewListing();
  });

  test('Test 52: Verify admin view button in preview listing', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyAdminViewButtonInPreviewListing();
  });

  test('Test 53: Verify image and thumbnails in preview listing ', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    const IMAGE_DIR = path.resolve(__dirname, 'PropertyImages');
    const images = [
      path.join(IMAGE_DIR, 'propertyImage.jpg'),
      path.join(IMAGE_DIR, 'PropertyImage2.jpg')
    ];
    await listingActions.uploadMultipleImagesToLibrary(images);
    await listingActions.verifyImageAndThumbnailsInPreviewListing();
  });

  test('Test 54: Verify thumbnail selection changes main image', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyThumbnailSelectionChangesMainImage();
  });

  test('Test 55: Verify listing status display in preview', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.VerifyListingStatusDisplayInPreview();
  });

  test('Test 56: Verify total images count in preview', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyTotalImagesCountInPreview();
  });

  test('Test 57: Verify image days count in preview', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyImageDaysCountInPreview();
  });

  test('Test 58: Verify sale type display in preview listing', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifySaleTypeDisplayInPreviewListing();
  });

  test('Test 59: Verify all listing details display correctly in preview', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings()
    // Add listing with agents and details, then check preview details
    const agentNames =
      ['Automation Test',
        'Hina Agent'];
    await listingActions.verifyAllListingDetailsInPreview(agentNames);
  });

  test('Test 60: Verify fields are not editable in preview listing', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyFieldsNotEditableInPreviewListing();
  });

  test('Test 61: Verify Save button functionality in listing form', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.clickSaveButtonOnListingForm();
  });

  test('Test 62: Verify Save & Close button functionality in listing form', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.clickSaveAndCloseButtonOnListingForm();
  });

  test('Test 63: Verify Save & Close button functionality on listing form', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifySaveAndCloseButtonFunctionality();
    await listingActions.resetFilters();
  });

  test('Test 64: Verify correct error message for missing property type', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyMissingPropertyTypeError();
    await listingActions.resetFilters();
  });

  test('Test 65: Verify correct error message for missing listing type', async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyMissingListingTypeError();
  });

  test("Test 66: Verify 'Sold' status popup appears when selecting 'Sold' in listing status dropdown", async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifySoldStatusPopupAppears();
    await listingActions.resetFilters();
  });

  test("Test 67: Verify listing appears at the top of the grid after creation", async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.clickSaveButtonOnContactForm();
  });

  test("Test 68: Verify 'Sold' status popup contains correct fields", async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifySoldStatusPopupFields();
    await listingActions.resetFilters();
  });

  test("Test 69: Verify 'Sold' status popup can be closed without saving changes", async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifySoldStatusPopupCanBeClosedWithoutSaving();
    await listingActions.resetFilters();
  });

  test("Test 70: Verify 'Sold' status popup saves data correctly with valid inputs", async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifySoldStatusPopupSavesWithValidInputs();
    await listingActions.resetFilters();
  });

  test("Test 71: Verify if updating 'Date Sold' and 'Sold Price' reflects the correct changes.", async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.updateSoldDetailsAndVerify();
    await listingActions.resetFilters();
  });

  test("Test 72: Verify if clicking 'Save & Close' saves the details and closes the popup", async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifySoldStatusPopupSavesWithValidInputs();
    await listingActions.resetFilters();
  });

  test("Test 73: Verify if listing disappears from grid/list view after changing status to 'Sold'", async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyListingDisappearsAfterMarkingSold();
    await listingActions.resetFilters();
  });

  test("Test 74: Verify if invalid data in 'Sold Price' field (e.g., letters) is handled correctly.", async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyInvalidSoldPriceInput();
    await listingActions.resetFilters();
  });

  test("Test 75: Verify if the 'Disclose Price' checkbox can be selected/deselected.", async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyDisclosePriceCheckboxFunctionality();
    await listingActions.resetFilters();
  });

  test("Test 76: Verify if selecting 'Disclose Price' correctly reflects in the saved listing details.", async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyDisclosePriceCheckboxReflectsInListing();
    await listingActions.resetFilters();
  });

  test("Test 77:Verify if listings marked as 'Sold' do not appear in active searches.", async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyListingDisappearsAfterMarkingSold();
    await listingActions.resetFilters();
  });

  test("Test 78: Verify if navigating away from the form without saving discards changes.", async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyFormDoesNotSaveOnNavigateAway();
    await listingActions.resetFilters();
  });

  test("Test 79: Verify if undoing 'Sold' status brings the contact back to grid/list view.", async ({ sessionPage }) => {
    const listingActions = new ListingPage(sessionPage);
    await listingActions.navigateToListings();
    await listingActions.verifyUndoSoldStatusBringsListingBack();
    await listingActions.resetFilters();
  });

});