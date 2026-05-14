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

    test('TC_6: Verify create view button functionality', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyCreateViewButtonFunctionality('Automation');
    });

    test('TC_07: Verify individual status hide/unhide works', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyHideUnhideAllStatuses('Automation');
    });

    test('TC_08: Verify status positions can be changed using drag and drop', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyDragAndDropChangesStatusPositions('Automation');
    });

    test('TC_09: Verify status positions can be changed using arrows', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyArrowsChangeStatusPositions('Automation');
    });

    test('TC_10: Verify status search in view popup works', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyStatusSearchInViewPopup('Lot', 'Automation');
    });

    test('TC_011: Verify all statuses can be hidden/unhidden using eye icon', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyHideUnhideAllStatuses('Automation');
    });

    test('TC_12: Verify share view to agent', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyShareViewToAgent('Automation', 'Test View', 'Dawood Ahmad');
    });

    test('TC_13: Verify share view to team', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyShareViewToTeam('Automation', 'Test View', 'Automation Team');
    });

    test('TC_14: Verify saved view reflects reordered statuses', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifySavedViewReflectsReorderedStatuses('Automation');
    });

    test('TC_16: Verify error message when importing invalid file', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLotImportWithInvalidFile('Automation', 'invalid.txt');
    });

    test('TC_17: Verify lot creation via "+" button', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLotCreationViaPlusButton('Automation');
    });

    test('TC_18: Verify validation error on lot creation with missing required fields', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLotCreationWithMissingFields('Automation');
    });

    test('TC_19: Verify individual lot deletion using checkbox', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyIndividualLotDeletion('Automation');
    });

    test('TC_20: Verify bulk deletion of lots', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyBulkLotDeletion('Automation');
    });

    test('TC_21: Verify Delete button is hidden when no lot is selected', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyDeleteButtonHiddenWhenNoSelection('Automation');
    });

    test('TC_22: Verify sort icon works for ascending order', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLotListSortAscending('Automation', 'Lot');
    });

    test('TC_23: Verify sort icon works for descending order', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyLotListSortDescending('Automation', 'Lot');
    });

    test('TC_24: Verify filter popup opens correctly for Project Status', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyFilterPopupOpensForProjectStatus('Automation');
    });

    test('TC_25: Verify dropdowns are shown in filter popup', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyFilterDropdownsAreVisible('Automation');
    });

    test('TC_26: Verify condition dropdown is working', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyConditionDropdownIsWorking('Automation', 'For sale');
    });

    test('TC_27: Verify "Select All" in status filter selects all options', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifySelectAllInStatusFilterSelectsAllOptions('Automation');
    });

    test('TC_28: Verify "Deselect All" in status filter removes all selections', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyDeselectAllInStatusFilterRemovesAllSelections('Automation');
    });

    test('TC_29: Verify multiple selections in status filter are allowed', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyMultipleSelectionsInStatusFilterAreAllowed('Automation', ['For sale', 'Sold']);
    });


});   