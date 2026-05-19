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

test.describe('Project Price List Tests', () => {

    test('TC_01 - Open Price List with valid lots', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).openPriceListWithValidLots('Automation');
    });

    test('TC_02 - Open Price List when no lots exist', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyPriceListRedirectsToGeneralWhenNoLots("Hina's Project");
    });

    test('TC_03: Verify Lot Preview toggle shows popup on lot click', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLotPreviewTogglePopup('Automation', 'Automation Lot');
    });

    test('TC_04: Search existing lot by name', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyPriceListLotSearch('Automation', 'Automation Lot');
    });

    test('TC_05: Search non-existent lot shows no results', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyPriceListSearchNonExistentLot('Automation', 'NonExistentLot_XYZ_12345');
    });

    test('TC_06: Clear search using cross icon', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyPriceListSearchClearByCrossIcon('Automation', 'Automation Lot');
    });

    test('TC_07: Open filter dropdown for Status', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyPriceListFilterStatusDropdownOpens('Automation');
    });

    test('TC_08: Select a single status filter', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifySingleStatusFilter('Automation', 'For Sale');
    });

    test('TC_09: Apply multiple status filters in Price List', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).applyMultipleStatusFiltersInPriceList('Automation', ['For Sale', 'Sold']);
    });

    test('TC_10: Use "Select All" in status filter', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).useSelectAllInStatusFilterOnPriceList('Automation');
    });

});