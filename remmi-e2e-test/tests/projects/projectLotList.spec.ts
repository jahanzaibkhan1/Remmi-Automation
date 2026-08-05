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

    test('TC_06: View dropdown in popup shows no views', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyViewDropdownShowsNoViews('Automation');
    });

    test('TC_07: Verify create view button functionality', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyCreateViewButtonFunctionality('Automation');
    });

    test('TC_08: Verify switching between views updates list layout', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifySwitchingBetweenViewsUpdatesListLayout('Automation');
    });
    
    test('TC_09: Verify individual status hide/unhide works', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyHideUnhideAllStatuses('Automation');
    });

    test('TC_10: Verify status positions can be changed using drag and drop', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyDragAndDropChangesStatusPositions('Automation');
    });

    test('TC_11: Verify status positions can be changed using arrows', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyArrowsChangeStatusPositions('Automation');
    });

    test('TC_12: Verify status search in view popup works', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyStatusSearchInViewPopup('Lot', 'Automation');
    });

    test('TC_13: Verify all statuses can be hidden/unhidden using eye icon', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyHideUnhideAllStatuses('Automation');
    });

    test('TC_14: Verify share view to agent', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyShareViewToAgent('Automation', 'Test View', 'Dawood Ahmad');
    });

    test('TC_15: Verify share view to team', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyShareViewToTeam('Automation', 'Test View', 'Automation Team');
    });

    test('TC_16: Verify saved view reflects reordered statuses', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifySavedViewReflectsReorderedStatuses('Automation');
    });

    test('TC_17: Verify delete view from dropdown works', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyDeleteViewFromDropdown('Automation', 'Test View');
    });

    test('TC_18: Verify error message when importing invalid file', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLotImportWithInvalidFile('Automation', 'invalid.txt');
    });

    test('TC_19: Verify lot creation via "+" button', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLotCreationViaPlusButton('Automation');
    });

    test('TC_20: Verify validation error on lot creation with missing required fields', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLotCreationWithMissingFields('Automation');
    });

    test('TC_21: Verify individual lot deletion using checkbox', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyIndividualLotDeletion('Automation');
    });

    test('TC_22: Verify bulk deletion of lots', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyBulkLotDeletion('Automation');
    });

    test('TC_23: Verify Delete button is hidden when no lot is selected', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyDeleteButtonHiddenWhenNoSelection('Automation');
    });

    test('TC_24: Verify sort icon works for ascending order', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLotListSortAscending('Automation', 'Lot');
    });

    test('TC_25: Verify sort icon works for descending order', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLotListSortDescending('Automation', 'Lot');
    });

    test('TC_26: Verify filter popup opens correctly for Project Status', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyFilterPopupOpensForProjectStatus('Automation');
    });

    test('TC_27: Verify dropdowns are shown in filter popup', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyFilterDropdownsAreVisible('Automation');
    });

    test('TC_28: Verify condition dropdown is working', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyConditionDropdownIsWorking('Automation', 'For sale');
    });

    test('TC_29: Verify "Select All" in status filter selects all options', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifySelectAllInStatusFilterSelectsAllOptions('Automation');
    });

    test('TC_30: Verify "Deselect All" in status filter removes all selections', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyDeselectAllInStatusFilterRemovesAllSelections('Automation');
    });

    test('TC_31: Verify multiple selections in status filter are allowed', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyMultipleSelectionsInStatusFilterAreAllowed('Automation', ['For sale', 'Sold']);
    });

    test('TC_32: Verify search in filter dropdown filters options', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyConditionDropdownIsWorking('Automation', 'For sale');
    });

    test('TC_33: Verify closing filter popup with cross does not apply changes', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyClosingFilterPopupWithCrossDoesNotApplyChanges('Automation');
    });

    test('TC_34: Verify closing filter popup with "Clear" button clears all filters', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyClosingFilterPopupWithClearButtonClearsAllFilters('Automation', 'For sale');
    });

    test('TC_35: Apply filter without any selection', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).applyFilterWithoutAnySelection('Automation');
    });

    test('TC_36: Verify valid filter applies correctly in Project Lots', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyValidFilterAppliesCorrectly('Automation', 'For sale');
    });

    test('TC_37: Invalid value typed in filter dropdown search', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyInvalidDataInFilterDropdownSearch('Automation', 'InvalidStatusXYZ');
    });

    test('TC_38: Verify other fields have condition + search in filter popup', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyFilterPopupOpensForProjectStatus();
    });

    test('TC_39: Verify records count displays correctly at bottom of project lots list', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyRecordCountDisplayedAtBottom('Automation');
    });

    test('TC_40: Verify all lots load via infinite scroll pagination', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyAllLotsLoadOnScroll('Automation');
    });

    test('TC_41: Verify checkboxes are properly aligned in lot table', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLotTableCheckboxAlignment('Automation');
    });

    test('TC_42: Verify newly created lot appears in the lot list after creation', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLotCreationViaPlusButton('Automation');
    });

    test('TC_43: Verify create button is not clickable when name input is empty', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyCreateButtonNotClickableWithoutName('Automation');
    });

    test('TC_44: Verify lot list shows updated result after deleting a lot', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyIndividualLotDeletion('Automation');
    });

});