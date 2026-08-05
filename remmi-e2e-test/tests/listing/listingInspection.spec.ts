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

    test('Test 1: Verify that the inspection tab is hidden before listing  is saved', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyInspectionTabHiddenBeforeSave();
    });

    test('Test 2: Verify required fields validation', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyRequiredFieldsValidation();
    });

    test('Test 3: Verify successful addition of an inspection', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.addValidInspectionAndVerifySuccess();
    });

    test('Test 4: Verify deletion of an inspection from the inspection tab', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyDeleteInspectionFromTab();
    });

    test('Test 5: Verify that deleting an inspection from the inspection tab removes it from the calendar', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyDeleteInspectionRemovesFromCalendar();
    });

    test('Test 6: Verify inspection is visible in the calendar tab after adding', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyInspectionVisibleInCalendarTab();
    });

    test('Test 7: Verify that clicking on an inspection in the calendar opens a popup', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyInspectionClickOpensPopup();
    });

    test('Test 8: Verify deleting an inspection from the calendar removes it from all relevant places', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyInspectionRemovesFromCalendar();
    });

    test('Test 9: Verify deletion of an inspection from the inspection portion', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyDeleteInspectionFromInspectionTab();
    });

    test('Test 10: Verify that an inspection with a past date cannot be added', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyInspectionCannotAddPastDate();
    });

    test('Test 11: Verify inspection portion expand/collapse functionality', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyInspectionExpandCollapse();
    });

    test('Test 12: Verify adding multiple inspections on different dates', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyAddMultipleInspectionsDifferentDates();
    });

    test('Test 13: Verify adding multiple inspections on the same date but different times', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyAddMultipleInspectionsSameDateDifferentTimes();
    });

    test('Test 14: Verify deleting all inspections removes them from all views', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyDeleteAllInspectionsRemovesFromAllViews();
    });

    test('Test 15: Verify that deleting an inspection from the calendar does not affect other inspections', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyDeleteInspectionFromCalendarDoesNotAffectOthers();
    });

    test('Test 16: Verify that start time must be before end time when adding an inspection', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyStartTimeMustBeBeforeEndTime();
    });

    test('Test 17: Verify duplicate inspections can be added on the same listing', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyDuplicateInspectionsCanBeAdded();
    });

    test('Test 18: Verify system does not accept invalid date formats', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyInspectionCannotAddPastDate();
    });

    test('Test 19: Verify system does not accept invalid time formats', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyStartTimeMustBeBeforeEndTime();
    });

    test('Test 20: Verify correct error message when only some fields are filled', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyRequiredFieldsValidation();
    });

});    