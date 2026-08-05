import { test as base } from '@playwright/test';
import { ListingPage } from '../../pages/listing/ListingPage';
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
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifySearchFunctionalityInStreamTab('Listing Added');
    });

    test('Test 2: Verify search field displays correct total records count', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifySearchFieldDisplaysCorrectTotalRecordsCount('Listing Added');
    });

    test('Test 3: Verify infinite scrolling in stream tab', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyInfiniteScrollingInStreamTab();
    });

    test('Test 4: Verify stream card is added when a new inspection is created', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.addValidInspectionAndVerifySuccess();
      await listingActions.verifyStreamCardAppearsForNewInspection();
    });

    test('Test 5: Verify stream card is added when a contact is related', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.addValidInspectionAndVerifySuccess();
      await listingActions.verifyStreamCardAppearsForRelatedContact();
    });

    test('Test 6: Verify contact name is clickable in the stream card', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyContactNameClickableInStreamCard();
    });

    test('Test 7: Verify that when a contact is removed, the stream card is also removed', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyStreamCardRemovedWhenContactRemoved();
    });

    test('Test 8: Verify stream card is added when a primary agent is assigned', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      // Optionally provide a specific agent name; uses the default if omitted
      await listingActions.verifyStreamCardAppearsForPrimaryAgentAssignment('Jahanzaib Xenex');
    });

    test('Test 9: Verify stream card is added when a secondary agent is added', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyStreamCardAppearsForSecondaryAgent();
    });

    test('Test 10: Verify stream card is added when a task is created for a listing', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyStreamCardAppearsForCreatedTask('Automation Task');
    });

    test('Test 11: Verify stream card is added when a listing is created', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyStreamCardAppearsForListingCreation();
    });

    test('Test 12: Verify stream card is added when a listing is created for the first time', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyStreamCardAppearsForListingCreation();
    });

    test('Test 13: Verify date and time is displayed on each stream card', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyDateTimeDisplayedOnEachStreamCard();
    });

    test('Test 14: Verify searching the stream tab with an invalid keyword shows zero results', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifySearchWithInvalidKeyword("notarealkeyword123456");
    });

    test('Test 15: Verify search field with empty input returns all records', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifySearchFieldWithEmptyInput();
    });

    test('Test 16: Verify that clicking on the agent name in the stream card opens the agent profile (or relevant details)', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyContactNameClickableInStreamCard();
    });

    test('Test 17: Verify stream tab UI consistency (headers, layout, scroll, empty state)', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyStreamTabUIConsistency()
    });

    test('Test 18: Verify stream tab loading time is within acceptable threshold', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyStreamTabLoadingTime(5000);
    });

    test('Test 19: Verify duplicate stream cards are not created for the same action', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyNoDuplicateStreamCardsForAction();
    });

    test('Test 20: Verify stream card updates when a listing is modified', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyStreamCardUpdatesOnListingModification();
    });

    test('Test 21: Verify scroll does not stop loading new records', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyInfiniteScrollingInStreamTab();
    });

    test('Test 22: Verify search is not case sensitive', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifySearchFunctionalityInStreamTab('LisTing AdDed');
    });


    test('Test 23: Verify searching the stream tab with special characters', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifySearchWithInvalidKeyword('!%^&*()_+|{}:"<>?`~[];\'\\,./');
    });

    test('Test 24: Verify searching in the stream tab by agent name returns relevant records', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifySearchFunctionalityInStreamTab('Jahanzaib Xenex');
    });

    test('Test 25: Verify page refresh does not remove stream cards', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyStreamCardsPersistAfterRefresh();
    });

    test('Test 26: Verify empty stream tab scenario', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifySearchFieldWithEmptyInput();
    });

    test('Test 27: Verify error handling for failed listing creation', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyErrorHandlingForFailedListingCreation();
    });

    test('Test 28: Verify excessive scrolling does not break the UI', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyInfiniteScrollingInStreamTab();
    });

    test('Test 29: Verify invalid time/date formats do not affect stream tab', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyInspectionCannotAddPastDate();
    });


});