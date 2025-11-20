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
      await page.goto(DASHBOARD_URL); // simple navigation to dashboard
      await use(page);
    } finally {
      await context.close();
    }
  }, { scope: 'worker' }]
});

test.describe('Listing side Menu Tests - Remmi E2E', () => {

  test('Searching for a valid contact', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.searchForValidListing('Hina Ryan');
  });

  test('Searching for an invalid contact', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.searchForInvalidListing('Invalid Contact Name');
  });
  test('Searching with special characters', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.searchWithSpecialCharacters('$');
  });
  
});

export { test };
