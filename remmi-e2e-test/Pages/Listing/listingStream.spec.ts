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
    
});