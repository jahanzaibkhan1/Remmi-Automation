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

    test('TC_08: Use Select All in Project dropdown', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).useSelectAllInProjectDropdown();
    });

    test('TC_09: Use Deselect All in Project dropdown', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).useDeselectAllInProjectDropdown();
    });

    test('TC_010: Remove selected project tag from Project dropdown', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).removeSelectedProjectTagInLotDropdown('Adb');
    });

    test('TC_11: Open Bed dropdown', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).openAndAssertBedDropdown();
    });

    test('TC_12: Search bed number in Bed dropdown', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).searchBedInBedDropdown('2');
    });

    test('TC_13: Select single bed number', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).selectSingleBedInDropdown('2');
    });

    test('TC_14: Select multiple bed numbers', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).selectMultipleBedsInDropdown(['1', '2']);
    });

    test('TC_15: Use Select All in Bed dropdown', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).useSelectAllInBedDropdown();
    });

    test('TC_16: Use Deselect All in Bed dropdown', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).useDeselectAllInBedDropdown();
    });

    test('TC_17: Remove bed tag from Bed dropdown', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).removeSelectedBedTagInBedDropdown('2');
    });

    test('TC_18: Open Status dropdown', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).openAndAssertStatusDropdown();
    });

    test('TC_19: Search a status in Status dropdown', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).searchStatusInStatusDropdown('For Sale');
    });

    test('TC_20: Select single status', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).selectSingleStatusInDropdown('For Sale');
    });

    test('TC_21: Select multiple statuses', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).selectMultipleStatusesInDropdown(['For Sale', 'Sold']);
    });

    test('TC_22: Select all statuses', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).useSelectAllInStatusDropdown();
    });
    
    test('TC_23: Deselect all statuses', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).useDeselectAllInStatusDropdown();
    });

    test('TC_24: Remove status tag', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).removeSelectedStatusTagInStatusDropdown('For Sale');
    });

    test('TC_25: Close Status dropdown', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).closeStatusDropdownTest();
    });

    test('TC_26: Open Price range filter', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).openAndClosePriceRangeFilter();
    });

    test('TC_27: Filter lots using price range', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).filterLotsUsingPriceRange('500000', '1000000');
    });

    test('TC_28: Use invalid price range', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).useInvalidPriceRange('1000000', '500');
    });

    test('TC_29: Open Area range filter', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).openAndCloseAreaRangeFilter();
    });

    test('TC_30: Filter lots using area range', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).filterLotsUsingAreaRange('50', '200');
    });

    test('TC_31: Enter invalid area range', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).useInvalidAreaRange('500', '50');
    });

    test('TC_32: Use Reset button after filtering', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).useResetButtonAfterFiltering('adb');
    });

    test('TC_33: Use Reset with no filters applied', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).useResetWithNoFiltersApplied();
    });

    test('TC_34: Open View popup', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).openAndAssertViewPopup();
    });

    test('TC_35: Create new view', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).createNewView('My Test View');
    });

    test('TC_36: Delete a view', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).deleteView('My Test View');
    });

    test('TC_37: Share a view', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).shareView('Abdul Rehman', 'Automation Team');
    });

    test('TC_38: Search column in View popup', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).searchColumnInViewPopup('Project');
    });

    test('TC_39: Hide all and show all columns', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).hideAllAndShowAllColumns();
    });

    test('TC_40: Hide/show statuses (bulk)', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).hideAllAndShowAllColumns();
    });

    test('TC_41: Drag statuses to reorder', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).dragColumnToReorder();
    });

    test('TC_42: Reorder using arrows', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).reorderColumnUsingArrows();
    });

    test('TC_43: Save reordered statuses', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).saveReorderedStatuses();
    });

    test('TC_44: Select a saved view', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).selectSavedView();
    });

    test('TC_45: Select single lot from list', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).selectSingleLotFromList();
    });

    test('TC_46: Select multiple lots manually', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).selectMultipleLotsManually(2);
    });
    
    test('TC_47: Select all lots using master checkbox', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).selectAllLotsUsingMasterCheckbox();
    });

    test('TC_48: Deselect one selected lot', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).deselectOneSelectedLot();
    });

    test('TC_49: Open bulk edit after selecting lots', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).openBulkEditAfterSelectingLots();
    });

    test('TC_50: Sort lots by Status', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).sortLotsByStatus();
    });

    test('TC_51: Toggle status sorting', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).toggleStatusSorting();
    });

    test('TC_52: Apply multiple dropdown filters', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).applyMultipleDropdownFilters('adb', '2', 'For Sale');
    });

    test('TC_53: Remove one tag only', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).removeOneTagOnly('adb', '2');
    });

    test('TC_54: Reopen closed dropdown and verify selection', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).reopenDropdownAndVerifySelection('adb');
    });
    
    test('TC_55: Apply bed filter and switch to Project dropdown', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).applyBedFilterAndSwitchToProjectDropdown('2');
    });

    test('TC_56: Verify no duplicate tag', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyNoDuplicateTag('adb');
    });

    test('TC_57: Validate deselected tag is removed from list', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).validateDeselectedTagIsRemoved('adb');
    });

    test('TC_58: Validate cleared price removes filter', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).validateClearedPriceRemovesFilter('500000', '1000000');
    });

    test('TC_59: Validate cleared area removes filter', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).validateClearedAreaRemovesFilter('50', '200');
    });

    test('TC_60: View popup - open and close without action', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).openAndCloseViewPopupWithoutAction();
    });

    test('TC_61: View popup - click save without changing', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).clickSaveWithoutChangingView();
    });

    test('TC_62: Share view with no team selected', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).shareViewWithNoTeamSelected('Abdul Rehman');
    });

    test('TC_63: View popup UI remains responsive', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyViewPopupResponsive();
    });

    test('TC_64: Lots list responsive after many filters', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLotsListResponsiveAfterManyFilters('adb', '2', 'For Sale');
    });

    test('TC_65: Filters persist on tab switch', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyFiltersOnTabSwitch('adb');
    });

    test('TC_66: UI alignment for selected tags', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyTagsAlignment(['adb', 'Nexton', 'Villa B1']);
    });

    test('TC_67: Close one dropdown, open another', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).closeOneOpenAnotherDropdown();
    });

    test('TC_68: Sorting remains after filters', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifySortingRemainsAfterFilters('East Village Vila', '2');
    });

    test('TC_69: Select project with no lots created', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).selectProjectWithNoLots("Hina's Project");
    });

});