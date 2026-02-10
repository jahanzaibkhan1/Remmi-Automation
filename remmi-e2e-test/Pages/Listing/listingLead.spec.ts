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

    test('Test 1: Open Lead tab', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.openLeadTab();
    });

    test('Test 2: Verify New Lead tab', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyNewLeadButton();
    });

    test('Test 3: Verify lead appears in the Lead module after creation', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyLeadAppearsInLeadModule();
    });

    test('Test 4: Verify lead status details', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyLeadStatusDetails();
    });

    test('Test 5: Verify duplicate lead creation', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyDuplicateLeadCreation();
    });

    test('Test 6: Verify lead assignment removal', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyLeadAssignmentRemoval();
    });

    // Verify reassignment of a lead after removal
    test('Test 7: Verify reassignment of a lead after removal', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyLeadAppearsInLeadModule();
      });

      test('Test 8: Verify lead listing details', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyLeadListingDetails();
      });

      test('Test 9: Verify lead source details', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyLeadSourceDetails();
      });

      test('Test 10: Verify duplicate lead creation does not merge records', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyDuplicateLeadCreation();
      });

      test('Test 11: Verify lead list updates after a new lead is added', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyLeadListUpdatesAfterAdd();
      });

      test('Test 12: Verify lead modification', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyLeadModification();
      });

      test('Test 13: Verify lead status change', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyLeadStatusChange();
      });

      test('Test 14: Verify lead records time and date', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyLeadRecordsTimeAndDate();
      });

      test('Test 15: Verify navigation between tabs on the listing detail page', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyNavigationBetweenTabs();
      });

      test('Test 16: Verify proper linking of leads to contacts', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyLeadAppearsInLeadModule();
      });

});