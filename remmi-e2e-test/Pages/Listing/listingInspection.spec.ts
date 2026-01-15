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

    test('Test 1: Verify that the inspection tab is hidden before listing  is saved', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyInspectionTabHiddenBeforeSave();
    });

    test('Test 2: Verify required fields validation', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyRequiredFieldsValidation();
    });

    test('Test 3: Verify successful addition of an inspection', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.addValidInspectionAndVerifySuccess();
    });

    test('Test 4: Verify deletion of an inspection from the inspection tab', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyDeleteInspectionFromTab();
    });

    test('Test 5: Verify that deleting an inspection from the inspection tab removes it from the calendar', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyDeleteInspectionRemovesFromCalendar();
    });

    test('Test 6: Verify inspection is visible in the calendar tab after adding', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyInspectionVisibleInCalendarTab();
    });

    test('Test 7: Verify that clicking on an inspection in the calendar opens a popup', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyInspectionClickOpensPopup();
    });

    test('Test 8: Verify deleting an inspection from the calendar removes it from all relevant places', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyInspectionRemovesFromCalendar();
    });

    test('Test 9: Verify deletion of an inspection from the inspection portion', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.addValidInspectionAndVerifySuccess();
      await listingActions.verifyDeleteInspectionFromTab();
    });

    test('Test 10: Verify that an inspection with a past date cannot be added', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyInspectionCannotAddPastDate();
    });

    test('Test 11: Verify inspection portion expand/collapse functionality', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyInspectionExpandCollapse();
    });

});    