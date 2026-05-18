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

    test('TC_04: Verify tabs cross icon closes form', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLeftCrossIconClosesLotForm('Automation', 'Automation Lot');
    });

    test('TC_05: Verify project and lot name below tab', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyProjectAndLotNameBelowsTab('Automation', 'Automation Lot');
    });

    test('TC_06: Verify Apartment Detail and History tabs are visible', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyApartmentDetailAndHistoryTabsVisible('Automation', 'Automation Lot');
    });

    test('TC_07: Verify project dropdown is auto-filled', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyProjectsDropdownAutoFilled('Automation', 'Automation Lot');
    });

    test('Test 08: Verify lot field shows correct lot name', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLotNameShownOnFormTab('Automation', 'Automation Lot');
    });

    test('TC_09: Verify status reason dropdown shows all statuses', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyStatusReasonDropdownShowsAllStatuses('Automation', 'Automation Lot');
    });

    test('TC_10: Verify validation error on lot creation with missing required fields', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLotCreationWithMissingFields('Automation');
    });


});