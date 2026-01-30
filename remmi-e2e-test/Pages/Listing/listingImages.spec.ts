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

  test('Test 1: Verify that the image tab contains a search field', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyImageTabHasSearchField();
  });
  test('Test 2: Verify that the Floor Plan folder is displayed upon opening the image tab', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyFloorPlanFolderVisibleInImageTab();
  });

  test('Test 3: Verify that the Add button provides options for folder, public file upload, and private file upload', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyAddButtonOptionsInImageTab();
  });

  test("Test 4: Verify that clicking Folder opens the 'New Folder' popup", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyFolderOptionOpensNewFolderPopup();
  });

  test("Test 5: Verify that the 'New Folder' popup contains a required name field", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyNewFolderPopupHasRequiredNameField();
  });

  test("Test 6: Verify that the 'New Folder' popup has cross, cancel, and create buttons", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyNewFolderPopupHasButtons();
  });

  test("Test 7: Verify that clicking 'Create' without entering a name does not create a folder", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyNewFolderPopupHasRequiredNameField();
  });

  test("Test 8: Verify that entering a name and clicking Create successfully creates a folder", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.createNewFolderInImagesTab();
  });

  test("Test 9: Verify that clicking Public File Upload allows file uploads", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    // Use an image path within your repo's PropertyImages folder for this test file
    const path = require('path');
    const IMAGE_DIR = path.resolve(__dirname, 'PropertyImages');
    const imagePath = path.join(IMAGE_DIR, 'PropertyImage2.jpg');
    await listingActions.verifyPublicFileUploadAllowsUploadingFile(imagePath);
  });

  test("Test 10: Verify that Public File Upload allows downloading files", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    // Use an image path within your repo's PropertyImages folder for this test file
    const path = require('path');
    const IMAGE_DIR = path.resolve(__dirname, 'PropertyImages');
    const imagePath = path.join(IMAGE_DIR, 'PropertyImage2.jpg');
    await listingActions.verifyPublicFileUploadAllowsDownload(imagePath);
  });

  test("Test 11: Verify that Private File Upload asks for a PIN before downloading", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    const path = require('path');
    const IMAGE_DIR = path.resolve(__dirname, 'PropertyImages');
    const imagePath = path.join(IMAGE_DIR, 'propertyImage.jpg');
    await listingActions.uploadPrivateImage(imagePath);
  });

  test("Test 12: Verify that entering the correct PIN allows file download", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyPrivateFileUploadAllowsDownload();
  });

  test("Test 13: Verify that entering an incorrect PIN prevents file download", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyPrivateFileUploadInvalidPinBlocksDownload();
  });

  test("Test 14: Verify that double clicking a file opens the File Preview popup", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyDoubleClickOpensFilePreview();
  });

  test("Test 15: Verify that the total number of files is displayed next to the search field", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyFileCountDisplayedNextToSearch();
  });

  test("Test 16: Verify that right clicking a folder shows options for Share, Rename, Make a Copy, and Remove", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyFolderContextMenuOptions();
  });

  test("Test 17: Verify that clicking Make a Copy duplicates the folder", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyMakeCopyDuplicatesFolder();
  });

  test("Test 18: Verify that clicking Remove deletes the folder", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyRemoveFolderDeletesFolder();
  });

  test("Test 19: Verify that entering a name and clicking Rename changes the folder name", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyRenameFolderChangesName();
  });

  test("Test 20: Verify that clicking Share opens the Share popup", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyShareOptionOpensSharePopup();
  });

  test("Test 21:  Verify that clicking rename open the popup ", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.renamePopupopen();
  });

  test("Test 22: Verify that adding a staff or team member in the Share popup enables the Share button", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyShareFolderSelectingStaffOrTeam();
  });

  test("Test 23: Verify that sharing without selecting a staff/team member does not work", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyShareFolderRequiresStaffOrTeam();
  });

  test("Test 24: Verify that files have right click options: Preview, Share, Get Link, Get Path, Rename, Make a Copy, Download, Remove", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyFileContextMenuOptionsInImagesTab();
  });

  test("Test 25: Verify that clicking Preview opens the file in a popup", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyPreviewOptionOpensFileInImages();
  });

  test("Test 26: Verify that clicking Download successfully downloads the file in the Images tab", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyDownloadImageFile();
  });

  test("Test 27: Verify that clicking Get Link opens a popup with the file link", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyGetLinkOpensLinkPopupInImagesTab();
  });

  test("Test 28: Verify that clicking Get Path opens a popup with the file path", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyGetPathOpensPathPopupInImagesTab();
  });

  test("Test 29: Verify that clicking Get Path on a private file requires a PIN", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyGetPathOnPrivateFileRequiresPIN();
  });

  test("Test 30: Verify that selecting a folder or file enables toolbar options (Share, Download, Delete, More)", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyToolbarOptionsEnabledOnSelection();
  });

  test('Test 31: Verify that clicking the List View/Grid View toggle changes the display in the Images tab', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyImagesTabListGridViewToggle();
  });

  test("Test 32: Verify that clicking Edit on an image opens the image in a popup", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyPreviewOptionOpensFileInImages();
  });

  test('Test 33: Verify that Zoom In and Zoom Out buttons work in the Edit popup in the Images tab', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyImagesTabZoomInOutInEditPopup();
  });

  test("Test 34: Verify that dragging an image in the Edit popup changes its position in the Images tab", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyDragChangesImagePosition();
  });

  test("Test 35: Verify that deleting an image from the Edit popup removes it from the library", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyImageDeleteRemovesFromLibrary();
  });

  test("Test 36: Verify that duplicating an image creates a copy with 'Copy of ...' in its name", async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyImageMakeCopyCreatesCopy();
  });

  test('Test 37: Verify that uploading an image through the Edit popup works', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyUploadImageThroughEditPopupWorks();
  });

  test('Test 38: Verify that converting a PDF to an image works in the Images tab', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyPdfToImageConversion();
  });

});