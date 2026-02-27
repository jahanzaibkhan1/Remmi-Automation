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
      // cleanup if necessary
    }
  }, { scope: 'worker' }]
});

test.describe('Listing History Tab - Remmi E2E', () => {
  test('Test 1: Verify that the history tab displays details for the newly created listing', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyHistoryTabDisplaysListingDetails();
  });

  test('Test 2: Verify if changes to a listing field are reflected in history', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyListingFieldChangeIsReflectedInHistory();
  });

  test('Test 3: Verify that the "Changed Date" field displays the correct modification date and time', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyChangedDateIsCorrect();
  });

  test('Test 4: Verify if the "Changed By" field displays the correct user who made changes', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyChangedByFieldIsCorrect('Jahanzaib Xenex');
  });

  test('Test 5: Verify that the "Event" status correctly indicates the type of action', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyEventStatusIsCorrect('Update'); 
  });

  test('Test 6: Verify if the "Changed Field" column correctly records the modified field name', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyChangedFieldIsCorrect('Listing Type');
  });

  test('Test 7: Verify search functionality in history tab', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyHistorySearchFunctionality('Listing Type', 'Listing Type');
  });

  test('Test 8: Check search functionality with an invalid term', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyHistorySearchWithInvalidTerm('invalid_search_term_1234');
  });

  test('Test 9: Verify if history displays only relevant changes per contact', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyHistoryDisplaysRelevantChangesForContact('Jahanzaib Xenex');
  });

});