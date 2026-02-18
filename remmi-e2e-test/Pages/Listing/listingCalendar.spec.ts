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
});