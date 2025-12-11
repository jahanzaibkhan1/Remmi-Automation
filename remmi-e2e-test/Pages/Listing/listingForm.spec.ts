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

  test('Test 1: Open listing form', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.openContactForm();
  });

  test('Test 2: Close listing  form using cross icon', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.openContactForm();
  });

  test('Test 3: Close form without saving', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.closeFormWithoutSaving('House', 'Rental', 'For Lease');
  });

  test('Test 4: Pinning a listing', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.pinFirstListing();
  });

  test('Test 5: Opening a pinned listing', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.openPinnedListing();
  });

  test('Test 6: Unpinning a pinned listing', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.unpinFirstPinnedListing();
  });

});