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

test.describe('Project Lot Form Tests', () => {

    test('Test 1: Lot form opens on clicking a lot', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).clickLotOpensLotForm('Automation');
    });

    test('Test 2: Verify lot name is shown on the form tab', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLotNameShownOnFormTab('Automation', 'Automation Lot');
    });

    test('TC_03: Verify left cross icon closes lot form', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLeftCrossIconClosesLotForm('Automation', 'Automation Lot');
    });

});