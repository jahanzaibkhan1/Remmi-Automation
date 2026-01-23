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
            await context.close();
        }
    }, { scope: 'worker' }]
});

test.describe('Listing side Menu Tests - Remmi E2E', () => {

    test('Test 1: Verify that the Document Tab opens correctly', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyDocumentTabOpensCorrectly();
    });

    test('Test 2: Verify the presence of search field in the Document Tab', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifySearchFieldPresent();
    });

    test('Test 3: Verify that default folders are displayed in the Document Tab', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyDefaultFoldersDisplayed();
    });

    test('Test 4: Verify that clicking on a folder expands it in the Document Tab', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyClickingOnFolderExpandsIt();
    });

    test('Test 5: Verify subfolders under "Documents" in the Document Tab', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyClickingOnFolderExpandsIt();
    });

    test('Test 6: Verify subfolders under "Images" in the Document Tab', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifySubfoldersUnderImages();
    });

    test('Test 7: Verify that the "Legal" folder is empty in the Document Tab', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyLegalFolderIsEmpty();
    });

    test('Test 8: Verify that clicking Add opens options in the Document Tab', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyAddButtonOpensOptions();
    });

    test('Test 9: Verify that clicking "Folder" opens the "New Folder" popup in the Document Tab', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyFilesFolderOptionOpensNewFolderPopup();
    });
    
    test('Test 10: Verify that creating a folder with a valid name works', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.createNewFolderInFilesTab();
    });

    test('Test 11: Verify error message when creating folder without a name', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyNewFolderPopupHasRequireNameField();
    });

    test('Test 12: Verify that clicking "Public File Upload" allows uploading a file', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        // Use an image path within your repo's PropertyImages folder for this test file
        const IMAGE_DIR = path.resolve(__dirname, 'PropertyImages');
        const imagePath = path.join(IMAGE_DIR, 'PropertyImage2.jpg');
        await listingActions.verifyPublicFileUploadAllowUploadingFile(imagePath);
    });

    test('Test 13: Verify that clicking "Private File Upload" allows uploading a file', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        // Use an image path within your repo's PropertyImages folder for this test file
        const IMAGE_DIR = path.resolve(__dirname, 'PropertyImages');
        const imagePath = path.join(IMAGE_DIR, 'propertyImage.jpg');
        await listingActions.uploadsPrivateImage(imagePath);
    });

    test('Test 14: Verify that entering the correct PIN allows file download', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyPrivateFileUploadAllowDownload();
    });

    test('Test 15: Verify that downloading a private file requires entering a PIN', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyPrivateFileRequiresPinForDownload();
    });

    test('Test 16: Verify that entering incorrect PIN prevents private file download', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyPrivateFileUploadInvalidPin();
    });

    test('Test 17: Verify double clicking a file opens preview', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyDoubleClickOpenFilePreview();
    });

    test('Test 18: Verify that file preview has a close button', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyDoubleClickOpenFilePreview();
    });

    test('Test 19: Verify right clicking a folder shows context menu options', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyFolderContextMenuOption();
    });
});