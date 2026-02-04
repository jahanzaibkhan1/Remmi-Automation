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

    test('Test 1: Verify search functionality in stream tab', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifySearchFunctionalityInStreamTab('Listing Added');
    });

    test('Test 2: Verify search field displays correct total records count', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifySearchFieldDisplaysCorrectTotalRecordsCount('Listing Added');
    });

    test('Test 3: Verify infinite scrolling in stream tab', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyInfiniteScrollingInStreamTab();
    });

    test('Test 4: Verify stream card is added when a new inspection is created', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      // Pass a sample inspection title; adjust as needed for your use case
      await listingActions.verifyStreamCardAppearsForNewInspection();
    });

    test('Test 5: Verify stream card is added when a contact is related', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyStreamCardAppearsForRelatedContact();
    });

    test('Test 6: Verify contact name is clickable in the stream card', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyContactNameClickableInStreamCard();
    });

    test('Test 7: Verify that when a contact is removed, the stream card is also removed', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyStreamCardRemovedWhenContactRemoved();
    });

    test('Test 8: Verify stream card is added when a primary agent is assigned', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      // Optionally provide a specific agent name; uses the default if omitted
      await listingActions.verifyStreamCardAppearsForPrimaryAgentAssignment('Jahanzaib Xenex');
    });

    test('Test 9: Verify stream card is added when a secondary agent is added', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyStreamCardAppearsForSecondaryAgent();
    });

    test('Test 10: Verify stream card is added when a task is created for a listing', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyStreamCardAppearsForCreatedTask('Automation Task');
    });

    test('Test 11: Verify stream card is added when a listing is created', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyStreamCardAppearsForListingCreation();
    });

    test('Test 12: Verify stream card is added when a listing is created for the first time', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyStreamCardAppearsForListingCreation();
    });

});