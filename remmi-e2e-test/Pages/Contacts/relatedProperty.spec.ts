import { test as base } from '@playwright/test';
import { ContactActions } from './contactAction';

const managerSessionPath = require('path').join(__dirname, '../../sessions/manager-session.json');
const DASHBOARD_URL = process.env.DASHBOARD_URL;

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

test.describe('Contact Related Property Tabs - Remmi E2E', () => {

  test('Verify all three tabs (Listing, Property, Contract) appear under Related Property', async ({ sessionPage }) => {
    const contactActions = new ContactActions(sessionPage);
    await contactActions.verifyRelatedPropertyHasAllTabs();
  });
  
});