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

    test('TC_11: Use "Deselect All" in status filter', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).useDeselectAllInStatusFilterOnPriceList('Automation');
    });

    test('TC_12: Search inside status dropdown in Price List', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).searchInsideStatusDropdownInPriceList('Automation', 'For Sale');
    });

    test('TC_13: Try filtering without selecting any status', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).filterWithoutSelectingAnyStatusInPriceList('Automation');
    });

    test('TC_14: Remove a status filter tag', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyRemoveStatusFilterTag('Automation', 'For Sale');
    });

    test('TC_15: Select level filter from dropdown', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLevelFilter('Automation Testing', 'Level 16');
    });

    test('TC_16: Select multiple levels from dropdown', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).selectMultipleLevelsInLevelDropdown('Automation Testing', ['Level 15', 'Level 16']);
    });
    
    test('TC_17: Use Select All / Deselect All in Level dropdown', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLevelSelectAllDeselectAll('Automation Testing');
    });

    test('TC_18: Apply filter with empty level list', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLevelSelectAllDeselectAll('Automation Testing');
    });

    test('TC_19: Apply Bed filter (1 Bed)', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyBedFilter('Automation', '1');
    });

    test('TC_20: Select invalid bed option', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).selectInvalidBedOption('Automation', 'invalidBed');
    });

});