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
  test('Verify that the history tab displays details for the newly created listing', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyHistoryTabDisplaysListingDetails();
  });
});