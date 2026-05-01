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

});