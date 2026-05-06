import { test as base, expect } from '@playwright/test';
import { ProjectActions } from './projectAction';
import * as path from 'path';

const managerSessionPath = path.join(__dirname, '../../sessions/manager-session.json');
const DASHBOARD_URL = process.env.DASHBOARD_URL;

const test = base.extend<{ sessionPage: any }>({
    sessionPage: [async ({ browser }, use) => {
        const context = await browser.newContext({ storageState: managerSessionPath });
        try {
            const page = await context.newPage();
            await page.goto(DASHBOARD_URL);
            await use(page);
        } finally {
            // Optionally clean up context
        }
    }, { scope: 'worker' }]
});

test.describe('Lot Form', () => {

    test('Test 1: Verify lot form opens on clicking a lot', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLotFormOpensOnClick();
    });

    test('Test 2: Verify lot name is shown on the form', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLotNameOnFormTab();
    });

    test('Test 3: Left cross icon closes lot form', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyCrossIconClosesLotForm();
    });

    test('Test 4: Right pin icon pins the form', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyPinIconPinsForm();
    });

    test('Test 5: Verify tabs cross icon closes form', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyCrossIconClosesLotForm();
    });

    test('Test 6: Verify project and lot name below tab', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyProjectAndLotNameBelowTab();
    });

    test('Test 7: Apartment Details and History tabs are visible', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyApartmentAndHistoryTabsVisible();
    });

    test('Test 8: Verify project dropdown is auto-filled', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyProjectDropdownAutoFilled();
    });

    test('TC_09: Verify project can be changed', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyProjectCanBeChanged('Automation Testing');
    });
    
    test('Test_10: Verify lot field shows correct lot name', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLotNameOnLotFormTab();
    });

    test('TC_11: Verify status reason dropdown shows all statuses', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyStatusReasonDropdownShowsAll();
    });

    test('TC_13: Verify optional fields accept input', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyOptionalFieldsAcceptInput();
    });

    test('TC_14: Verify close button exits without saving', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyCloseButtonExitsWithoutSaving();
    });

    test('TC_15: Verify Save button saves form without closing', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifySaveButtonSavesWithoutClosing();
    });

});