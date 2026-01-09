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

});