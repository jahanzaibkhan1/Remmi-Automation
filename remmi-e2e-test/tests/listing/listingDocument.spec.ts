import { test } from '../../fixtures/session.fixture';
import { ListingPage } from '../../pages/listing/ListingPage';
import * as path from 'path';

test.describe('Listing side Menu Tests - Remmi E2E', () => {

    test('Test 1: Verify that the Document Tab opens correctly', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyDocumentTabOpensCorrectly();
    });

    test('Test 2: Verify the presence of search field in the Document Tab', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifySearchFieldPresent();
    });

    test('Test 3: Verify that default folders are displayed in the Document Tab', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyDefaultFoldersDisplayed();
    });

    test('Test 4: Verify that clicking on a folder expands it in the Document Tab', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyClickingOnFolderExpandsIt();
    });

    test('Test 5: Verify subfolders under "Documents" in the Document Tab', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyClickingOnFolderExpandsIt();
    });

    test('Test 6: Verify subfolders under "Images" in the Document Tab', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifySubfoldersUnderImages();
    });

    test('Test 7: Verify that the "Legal" folder is empty in the Document Tab', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyLegalFolderIsEmpty();
    });

    test('Test 8: Verify that clicking Add opens options in the Document Tab', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyAddButtonOpensOptions();
    });

    test('Test 9: Verify that clicking "Folder" opens the "New Folder" popup in the Document Tab', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyFilesFolderOptionOpensNewFolderPopup();
    });
    
    test('Test 10: Verify that creating a folder with a valid name works', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.createNewFolderInFilesTab();
    });

    test('Test 11: Verify error message when creating folder without a name', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyNewFolderPopupHasRequireNameField();
    });

    test('Test 12: Verify that clicking "Public File Upload" allows uploading a file', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        // Use an image path within your repo's PropertyImages folder for this test file
        const IMAGE_DIR = path.resolve(__dirname, 'PropertyImages');
        const imagePath = path.join(IMAGE_DIR, 'PropertyImage2.jpg');
        await listingActions.verifyPublicFileUploadAllowUploadingFile(imagePath);
    });

    test('Test 13: Verify that clicking "Private File Upload" allows uploading a file', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        // Use an image path within your repo's PropertyImages folder for this test file
        const IMAGE_DIR = path.resolve(__dirname, 'PropertyImages');
        const imagePath = path.join(IMAGE_DIR, 'propertyImage.jpg');
        await listingActions.uploadsPrivateImage(imagePath);
    });

    test('Test 14: Verify that entering the correct PIN allows file download', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyPrivateFileUploadAllowDownload();
    });

    test('Test 15: Verify that downloading a private file requires entering a PIN', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyPrivateFileRequiresPinForDownload();
    });

    test('Test 16: Verify that entering incorrect PIN prevents private file download', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyPrivateFileUploadInvalidPin();
    });

    test('Test 17: Verify double clicking a file opens preview', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyDoubleClickOpenFilePreview();
    });

    test('Test 18: Verify that file preview has a close button', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyDoubleClickOpenFilePreview();
    });

    test('Test 19: Verify right clicking a folder shows context menu options', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyFolderContextMenuOption();
    });

    test('Test 20: Verify that clicking "Remove" deletes a folder in the Files tab', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyRemoveFolderDeletesIt();
    });

    test('Test 21: Verify that clicking "Make a Copy" duplicates the folder in the Files tab', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyMakeACopyDuplicatesFolder();
    });

    test('Test 22: Verify that clicking "Rename" opens rename popup', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyRenameFolderOpensPopup();
    });

    test('Test 23: Verify that renaming a folder updates its name', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyRenameFolderUpdatesName();
    });

    test('Test 24: Verify that sharing a folder requires selecting staff or team member', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyShareFolderRequiresSelectingStaffOrTeam();
    });

    test('Test 25: Verify that selecting staff or team member enables "Share" button', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyShareFolderRequireSelectingStaffOrTeam();
    });

    test('Test 26: Verify that shared staff/team appear with profile image', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifySharedStaffTeamHasProfileImage();
    });

    test('Test 27: Verify that clicking a file shows action options', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyImageFileShowsActionOptions();
    });

    test('Test 28: Verify clicking "Get Link" opens link popup', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyGetLinkOpensLinkPopup();
    });

    test('Test 29: Verify clicking "Get Path" opens path popup', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyGetPathOpensPathPopup();
    });

    test('Test 30: Verify clicking "Preview" opens the file', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyPreviewOptionOpensFile();
    });

    test('Test 31: Verify clicking "Download" downloads the file', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyDownloadFile();
    });

    test('Test 32: Verify clicking "Edit" opens image in preview', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyEditOpensImageInPreview();
    });

    test('Test 33: Verify that image zoom in/out works', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyImageZoomInOutWorks();
    });

    test('Test 34: Verify that dragging image in preview changes its position', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyImageDragChangesPosition();
    });
    
    test('Test 35: Verify that edited image position reflects in the document tab', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyEditedImagePositionReflectsInDocumentTab();
        
    });

    test('Test 36: Verify that offline section expands and collapses', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyOfflineSectionExpandCollapse();
    });

    test('Test 37: Verify dragging a file to the offline section', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyDragFileToOfflineSection();
    });

    test('Test 38: Verify deleting an offline file', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyDeleteOfflineFile();
    });

    test('Test 39: Verify that opening a folder shows the "Back" button', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyBackButtonIsShownWhenFolderOpened();
    });

    test('Test 40: Verify that folder names appear as navigation tabs', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyFolderNamesAppearAsNavigationTabs();
    });

    test('Test 41: Verify clicking on a folder tab navigates to it', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyClickingFolderTabNavigatesToFolder();
    });

    test('Test 42: Verify that document tab supports list/grid view toggle', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyDocumentTabSupportsListGridViewToggle();
    });

    test('Test 43: Verify that reordering folders works', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyFolderReordering();
    });

    test('Test 44: Verify that reordering images works', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyImageDragChangesPosition();
    });

    test('Test 45: Verify error message when uploading unsupported file types', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        const IMAGE_DIR = path.resolve(__dirname, 'PropertyImages');
        const imagePath = path.join(IMAGE_DIR, 'invalidImage.webp');
        await listingActions.verifyUnsupportedFileTypeUploadShowsError(imagePath);
    });
    
});
