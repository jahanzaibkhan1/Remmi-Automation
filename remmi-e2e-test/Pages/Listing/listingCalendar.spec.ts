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

    test('Test 1: Verify that the "Connect Your Account" button is shown if Google Calendar is not connected', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyGoogleCalendarConnectButtonVisible();
    });

    test('Test 2: Verify that "+Create New" and "+New Task" buttons appear ', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyCreateNewAndNewTaskButtonsVisible();
    });

    test('Test 3: Verify that clicking "+Create New" opens the inspection fields', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyCreateNewOpensInspectionFields();
    });

    test('Test 4: Verify that private inspection fields have required validation for date and time', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyPrivateInspectionFieldsValidation();
    });

    test('Test 5: Verify that the listing location field is auto filled', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyListingLocationFieldIsAutoFilled();
    });

    test('Test 6: Verify that the primary agent is auto selected', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyPrimaryAgentIsAutoSelected();
    });

    test('Test 7: Verify that the agent dropdown allows adding and removing agents', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyAgentDropdownAllowsAddAndRemoveAgents();
    });

    test('Test 8: Verify that clicking "Cancel" does not save the inspection', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyClickingCancelNotSave();
    });

    test('Test 9: Verify that saving an inspection adds it to the calendar', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifySavingInspectionAddsToCalendar();
    });

    test('Test 10: Verify that the saved inspection appears under the "Inspection" section', async ({ sessionPage }) => {
        const listingActions = new ListingActions(sessionPage);
        await listingActions.verifyInspectionAppearsInInspectionSection();
    });

});