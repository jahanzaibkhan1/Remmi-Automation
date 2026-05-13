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

test.describe('Project Lot List Tests', () => {

    test('TC_01: Lot tab displays the lot list', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLotTabDisplaysLotList('Automation');
    });

    test('TC_02: Verify lot search functionality', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLotSearchFunctionality('Automation', 'Automation Lot');
    });

    test('TC_03: Verify reset button clears lot search', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLotListResetClearsSearch('Automation', 'Automation Lot');
    });

    test('TC_04: Verify export button downloads the list', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLotListExportDownload('Automation');
    });

    test('TC_05: Verify view button is clickable', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLotListViewButtonClickable('Automation');
    });

    test('TC_06: Verify all statuses can be hidden/unhidden using eye icon', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyHideUnhideAllStatuses('Automation');
    });

});   