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

  test('Verify associate field is visible and functional in Listing tab', async ({ sessionPage }) => {
    const contactActions = new ContactActions(sessionPage);
    await contactActions.verifyAssociateFieldVisibleAndFunctionalInListingTab();
  });

  test('Verify a listing can be associated using the associate field', async ({ sessionPage }) => {
    const contactActions = new ContactActions(sessionPage);
    await contactActions.verifyListingCanBeAssociatedViaAssociateField();
  });

  test('Verify the associated listing displays status aligned properly', async ({ sessionPage }) => {
    const contactActions = new ContactActions(sessionPage);
    await contactActions.verifyAssociatedListingStatusAlignment();
  });

  test('Verify a listing can be removed from the associated list', async ({ sessionPage }) => {
    const contactActions = new ContactActions(sessionPage);
    await contactActions.removeAssociatedListing();
  });

  test('Verify listing type or related tag can be dragged into a listing', async ({ sessionPage }) => {
    const contactActions = new ContactActions(sessionPage);
    await contactActions.verifyDragAndDropToListing();
  });

  test('Verify tag can be removed using the cross icon', async ({ sessionPage }) => {
    const contactActions = new ContactActions(sessionPage);
    await contactActions.removeTagByCrossIcon();
  });

  test('Verify clicking a listing opens it in a new tab and closes listing tab', async ({ sessionPage }) => {
    const contactActions = new ContactActions(sessionPage);
    await contactActions.verifyListingOpensInNewTabAndClosesListingTab();
  });

  test('Verify sort icon is present next to each status in listing tab', async ({ sessionPage }) => {
    const contactActions = new ContactActions(sessionPage);
    await contactActions.verifySortIconInStatusColumnHeaderInListingTab();
  });

  test('Verify property can be associated via associate field in Property tab', async ({ sessionPage }) => {
    const contactActions = new ContactActions(sessionPage);
    await contactActions.verifyPropertyCanBeAssociatedViaAssociateField();
  });
  
});