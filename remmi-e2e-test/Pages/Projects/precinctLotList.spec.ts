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

test.describe('Lot List Page', () => {
    test('TC_01: Verify only new values are shown on creation', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).openLotTabFromPrecinct();
    });
    
    test('TC_02: Search a lot by keyword', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).searchLotByKeyword('Automation Lot');
    });

    test('TC_03: Search for a non-existing lot', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).searchNonExistingLot('nonexistent_lot_keyword_12345');
    });

    test('TC_04: Open Project dropdown and verify options', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).openAndAssertProjectDropdown();
    });

    test('TC_05: Search a project in the Project dropdown in Lot tab', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifySearchProjectInLotDropdown('Adb');
    });

    test('TC_06: Select a project from Project dropdown', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).selectProjectInLotDropdown('Adb');
    });

    test('TC_07: Select multiple projects from Project dropdown', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).selectMultipleProjectsInLotDropdown(['Adb', 'Automation Testing']);
    });

    test('TC_07: Use Select All in Project dropdown', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).useSelectAllInProjectDropdown();
    });

    test('TC_08: Use Deselect All in Project dropdown', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).useDeselectAllInProjectDropdown();
    });
});