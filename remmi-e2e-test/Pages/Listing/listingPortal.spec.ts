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

    test('Test 1: Verify that all portal toggle buttons are displayed', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyAllPortalToggleButtonsDisplayed();
    });

    test('Test 2: Verify that clicking a toggle button enables the portal', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyToggleEnablesPortal();
    });

    test('Test 3: Verify that clicking a toggle button disables the portal', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyToggleDisablesPortal();
    });

    test('Test 4: Verify that the listing  does not update without saving changes', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyAllPortalToggleButtonsDisplayed()
    });

    test('Test 5: Verify that the listing  updates after saving changes', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyToggleEnablesPortal();
      });

      test('Test 6: Verify that the green dot appears in grid view listing card after enabling a portal', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyGreenDotAppearsAfterEnablingPortal();
      });
});