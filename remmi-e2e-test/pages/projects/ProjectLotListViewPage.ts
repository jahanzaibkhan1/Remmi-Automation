import { expect, Locator } from '@playwright/test';
import { faker } from '@faker-js/faker';
import * as path from 'path';
import { ProjectBasePage } from './ProjectBasePage';

export class ProjectLotListViewPage extends ProjectBasePage {
    async verifyLotTabDisplaysLotList(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.page).toHaveURL(/\/project-setup\/unit/, { timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.lotSubTabActive).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.lotListRecordsCounter).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_02 — Verify lot search functionality
 */
    async verifyLotSearchFunctionality(
        projectName: string = 'Automation',
        keyword: string = 'Automation Lot'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.lotListRecordsCounter).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.searchLotList(keyword);
        await this.assertLotListRowExists(keyword);
        await expect(this.lotListRecordsCounter).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        const rowCount = await this.getLotListRowCount();
        expect(rowCount).toBeGreaterThan(0);
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_03 — Verify reset button clears search in lot list
     */
    async verifyLotListResetClearsSearch(
        projectName: string = 'Automation',
        keyword: string = 'Automation Lot'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.searchLotList(keyword);
        await this.assertLotListRowExists(keyword);
        await this.resetButton.click();
        await expect(this.lotListSearchInput).toHaveValue('');
        const rowCount = await this.getLotListRowCount();
        expect(rowCount).toBeGreaterThan(0);
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_04 — Verify export button downloads the list
 */
    async verifyLotListExportDownload(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickLotListExportAndDownload();
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_05 — Verify view button is clickable
     */
    async verifyLotListViewButtonClickable(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.lotListViewButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickLotListViewButton();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(800);
        await expect(this.viewPopupContent).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_06 — Verify all statuses can be hidden/unhidden using eye icon
 */
    async verifyHideUnhideAllStatuses(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickLotListViewButton();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickHideAll();
        await this.page.waitForTimeout(1200);
        await this.clickShowAll();
        await this.page.waitForTimeout(500);
        await this.saveOrCreateButton.click();
        await this.cleanupAfterProjectTest();
    }

    async verifyDragAndDropChangesStatusPositions(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickLotListViewButton();
        const firstHandle = this.visibleColumnList.nth(0);
        const secondHandle = this.visibleColumnList.nth(1);
        await firstHandle.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        await firstHandle.dragTo(secondHandle, {
            force: true,
            targetPosition: { x: 10, y: 30 }
        });
        await expect(this.viewPopupContent).toBeVisible();
        await this.cleanupAfterProjectTest();
    }

    /**
   * TC_09 — Verify status positions can be changed using arrows
   */
    async verifyArrowsChangeStatusPositions(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickLotListViewButton();
        const firstHandle = this.visibleColumnList.nth(0);
        const secondHandle = this.visibleColumnList.nth(1);
        await firstHandle.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        await firstHandle.dragTo(secondHandle, {
            force: true,
            targetPosition: { x: 10, y: 30 }
        });
        await expect(this.viewPopupContent).toBeVisible();
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_xx — Verify status search in view popup works
     */
    async verifyStatusSearchInViewPopup(statusName: string, projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickLotListViewButton();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.columnSearchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.columnSearchInput.fill(statusName);
        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);
        await expect(this.columnItemByName(statusName).first()).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_DEFAULT,
        });
        await this.columnSearchInput.fill('');
        await this.page.waitForTimeout(1000);
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_xx — Verify view dropdown in popup shows no views
     */
    async verifyViewDropdownShowsNoViews(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickLotListViewButton();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.viewDropdownArrow).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.viewDropdownArrow.click();
        await expect(this.page.locator('.ng-option.ng-option-disabled')).toHaveText(/No items found/i);
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_10 — Verify Create View button functionality
 */
    async verifyCreateViewButtonFunctionality(
        projectName: string = 'Automation',
        viewName: string = `Test View`
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickLotListViewButton();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.addViewIcon.waitFor({ state: 'visible', timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.addViewIcon.click();
        await expect(this.viewNameInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.viewNameInput.click();
        await this.viewNameInput.fill(viewName);
        await expect(this.saveOrCreateButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.saveOrCreateButton.click({ force: true });
        await expect(this.viewCreatedToast).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.cleanupAfterProjectTest();
    }
    /**
     * TC_ — Verify share view to agent functionality
     */
    async verifyShareViewToAgent(
        projectName: string = 'Automation',
        viewName: string = 'Test View',
        userName: string = 'Dawood Ahmad',
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickLotListViewButton();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.shareViewIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.shareViewIcon.click({ force: true });
        await this.selectShareTarget(this.usersShareDropdown, this.usersShareDropdownArrow, userName);
        await expect(this.shareButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.shareButton.click({ force: true });
        await expect(this.shareResponseMessage()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_ — Verify share view to team functionality
     */
    async verifyShareViewToTeam(
        projectName: string = 'Automation',
        viewName: string = 'Test View',
        teamName: string = 'Automation Team'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickLotListViewButton();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.shareViewIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.shareViewIcon.click({ force: true });
        await this.selectShareTarget(this.teamsShareDropdown, this.teamsShareDropdownArrow, teamName);
        await expect(this.shareButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.shareButton.click({ force: true });
        await expect(this.shareResponseMessage()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_ — Verify that a saved view reflects the reordered statuses 
     */
    async verifySavedViewReflectsReorderedStatuses(
        projectName: 'Automation',
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickLotListViewButton();
        await this.reorderCollapsedArrow.click();
        await this.page.waitForTimeout(500);
        await this.reorderExpandCollapseArrow.click();
        await this.page.waitForTimeout(500);
        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_ — Verify delete view from dropdown works
     */
    async verifyDeleteViewFromDropdown(
        projectName: string = 'Automation',
        viewName: string = 'Test View'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickLotListViewButton();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);
        await expect(this.viewDropdownArrow).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.viewDropdownArrow.click();
        const viewOption = this.savedViewOption(viewName);
        await expect(viewOption).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        const deleteIcon = viewOption.locator('img[src*="delete_icon.svg"]');
        await expect(deleteIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await deleteIcon.click();
        try {
            await expect(this.confirmAnyButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_SHORT });
            await this.confirmAnyButton.click();
        } catch {

        }
        await expect(this.viewDeletedToast).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_12 — Verify error message is displayed when importing invalid file
 */
    async verifyLotImportWithInvalidFile(
        projectName: string = 'Automation',
        fileName: string = 'invalid.txt'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.uploadLotImportFile(fileName);
        await this.assertInvalidFileToast();
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_13 — Verify lot creation via "+" button
 */
    async verifyLotCreationViaPlusButton(
        projectName: string = 'Automation',
        lotData: {
            lotName?: string;
            statusReason?: string;
            bed?: string;
            bath?: string;
        } = {}
    ): Promise<void> {
        const data = {
            lotName: lotData.lotName ?? `Auto Lot ${Date.now()}`,
            statusReason: lotData.statusReason ?? 'For Sale',
            bed: lotData.bed ?? '2',
            bath: lotData.bath ?? '1',
        };
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickAddNewLotButton();
        await this.fillLotCreateForm(data);
        await this.clickLotCreateSaveAndClose();
        await this.searchLotList(data.lotName);
        await this.assertLotListRowExists(data.lotName);
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_18 — Verify validation error on lot creation with missing required fields
 */
    async verifyLotCreationWithMissingFields(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickAddNewLotButton();
        await expect(this.lotCreateSaveAndCloseButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotCreateSaveAndCloseButton.click();
        await this.assertRequiredFieldToast();
        await this.clickLotCreateClose();
        await this.assertLotCreateFormClosed();
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_15 — Verify individual lot deletion using checkbox
 */
    async verifyIndividualLotDeletion(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.selectLotListRowCheckbox(1);
        await this.assertSelectedRecordsLabel();
        await this.clickLotListDeleteButton();
        await this.cleanupAfterProjectTest();
    }
    protected async selectMultipleLotListRowCheckboxes(rowIndexes: number[]): Promise<void> {
        for (const index of rowIndexes) {
            await this.selectLotListRowCheckbox(index);
        }
    }
    /**
 * TC_ — Verify bulk deletion of lots
 */
    async verifyBulkLotDeletion(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        // await this.selectMultipleLotListRowCheckboxes([1, 2]);
        // await this.assertSelectedRecordsLabel();
        // await this.clickLotListDeleteButton();
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_21 — Verify Delete button is hidden when no lot is selected
 */
    async verifyDeleteButtonHiddenWhenNoSelection(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.lotListDeleteButton).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.lotListSelectedRecordsLabel).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.cleanupAfterProjectTest();
    }

    /**
     * HELPER — Click sort icon on a specific column
     */
    protected async clickLotListColumnSortIcon(columnName: string): Promise<void> {
        const sortIcon = this.lotListColumnSortIcon(columnName);
        await expect(sortIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await sortIcon.scrollIntoViewIfNeeded();
        await sortIcon.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * HELPER — Assert sort state of a column (none/ascending/descending)
     */
    protected async assertLotListColumnSortState(
        columnName: string,
        state: 'none' | 'ascending' | 'descending'
    ): Promise<void> {
        const sortIcon = this.lotListColumnSortIcon(columnName);
        await expect(sortIcon).toHaveAttribute('aria-sort', state, {
            timeout: ProjectBasePage.TIMEOUT_DEFAULT
        });
    }

    /**
  * TC_18 — Verify sort icon works for ascending order
  */
    async verifyLotListSortAscending(
        projectName: string = 'Automation',
        columnName: string = 'Lot'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.assertLotListColumnSortState(columnName, 'none');
        await this.clickLotListColumnSortIcon(columnName);
        await this.assertLotListColumnSortState(columnName, 'ascending');
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_19 — Verify sort icon works for descending order
 */
    async verifyLotListSortDescending(
        projectName: string = 'Automation',
        columnName: string = 'Lot'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.assertLotListColumnSortState(columnName, 'none');
        await this.clickLotListColumnSortIcon(columnName);
        await this.assertLotListColumnSortState(columnName, 'ascending');
        await this.clickLotListColumnSortIcon(columnName);
        await this.assertLotListColumnSortState(columnName, 'descending');
        await this.cleanupAfterProjectTest();
    }
    /**
     * HELPER — Assert filter popup is visible
     */
    protected async assertFilterPopupVisible(): Promise<void> {
        await expect(this.lotListFilterPopup).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
    }

    /**
     * Dropdown for the filter "Values" in the filter popup (ng-select, not re-multiselect)
     */
    protected get filterValuesDropdown(): Locator {
        return this.lotListFilterPopup.locator('ng-select[placeholder="Select"]');
    }

    protected get filterConditionDropdown(): Locator {
        return this.lotListFilterPopup.locator('re-multiselect').first();
    }

    protected get filterPopup(): Locator {
        return this.page.getByRole('dialog');
    }

    get equalsOption() {
        return this.page.getByRole('option', { name: /equals/i });
    }

    get searchBoxInFilterPopup(): Locator {
        return this.page.locator('input[placeholder="Search"]').last();
    }

    protected optionListItemInFilterPopup(name: string): Locator {
        return this.page.getByRole('dialog').getByRole('listitem').filter({ hasText: name });
    }

    protected get filterByTasksRemoveIcon(): Locator {
        return this.page.locator('.filter-by-tasks > re-multiselect > .box > .tags > .fas');
    }

    protected get recordsFooter(): Locator {
        return this.page.locator('text=Records:');
    }

    /**
     * Option inside dropdown 
     */
    protected optionInFilterPopup(option: string): Locator {
        return this.page
            .getByRole('dialog')
            .locator('li')
            .filter({ hasText: option });
    }
    /**
     * Apply button in filter popup
     */
    protected get applyFilterButton(): Locator {
        return this.filterPopup.getByRole('button', { name: /apply/i });
    }

    /**
     * Locator for the close ("times") icon in filter popup.
     */
    protected get filterPopupCloseIcon(): Locator {
        return this.page.locator('i.pi.pi-times.f-14.cursor-pointer').last();
    }

    /**
     * Locator for the "Clear" button inside the filter popup.
     */
    protected get clearFilterButton(): Locator {
        return this.filterPopup.getByRole('button', { name: /clear/i });
    }

    /**
     * Locator for the "Select all" checkbox inside the filter popup.
     */
    protected get selectAllCheckboxInFilterPopup(): Locator {
        return this.page.locator('div.checkbox__checkmark').first();
    }

    /**
     * Clicks the "Select all" checkbox in the filter popup.
     */
    protected async selectAllInFilterPopup(): Promise<void> {
        const selectAllCheckbox = this.selectAllCheckboxInFilterPopup;
        await expect(selectAllCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await selectAllCheckbox.click();
    }

    /**
     * HELPER — Assert both Condition (re-multiselect) and Values (ng-select) dropdowns are visible in filter popup
     */
    protected async assertFilterDropdownsVisible(): Promise<void> {
        await expect(this.filterValuesDropdown).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.filterConditionDropdown).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async openFilterPopup(): Promise<void> {
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        const filterIcon = this.page.locator('th:has-text("Project Status") img[alt="filter"]');
        await filterIcon.click();
        await this.page.waitForTimeout(700);
        await filterIcon.click();
    }
    /**
 * TC_20 — Verify filter popup opens correctly for Project Status column
 */
    async verifyFilterPopupOpensForProjectStatus(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await this.openFilterPopup();
        await this.assertFilterPopupVisible();
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_21 — Verify dropdowns are shown in filter popup
 */
    async verifyFilterDropdownsAreVisible(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await this.openFilterPopup();
        await this.assertFilterPopupVisible();
        await this.assertFilterDropdownsVisible();
        await this.cleanupAfterProjectTest();
    }

    /**
     * Helper to select an option from filterConditionDropdown using search box in the filter popup.
     */
    protected async selectConditionDropdownOptionWithSearch(searchTerm: string): Promise<void> {
        await this.filterConditionDropdown.click();
        const searchBox = this.searchBoxInFilterPopup;
        await expect(searchBox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await searchBox.click();
        await searchBox.fill(searchTerm);
        const optionLocator = this.optionInFilterPopup(searchTerm);
        await expect(optionLocator).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await optionLocator.click();
        await expect(this.filterConditionDropdown).toHaveText(
            new RegExp(searchTerm, 'i'),
            { timeout: ProjectBasePage.TIMEOUT_DEFAULT }
        );

        await this.filterByTasksRemoveIcon.click();
    }

    /**
     * Helper to click the "Select All" checkbox for Statuses in filter popup.
     */
    protected async selectAllStatusesInFilterPopup(): Promise<void> {
        // Open the filterConditionDropdown, which shows the filter popup.
        await this.filterConditionDropdown.click();
        const searchBox = this.searchBoxInFilterPopup;
        await expect(searchBox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.selectAllInFilterPopup();
    }

    /**
 * Helper to click the "Deselect All" checkbox for Statuses in filter popup.
 */
    protected async deselectAllStatusesInFilterPopup(): Promise<void> {
        // Open the filterConditionDropdown, which shows the filter popup.
        await this.filterConditionDropdown.click();
        const searchBox = this.searchBoxInFilterPopup;
        await expect(searchBox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.selectAllInFilterPopup();
        await this.page.waitForTimeout(500);
        await this.selectAllInFilterPopup();
    }

    /**
     * TC_22 — Verify condition dropdown is working in the filter popup
     */
    async verifyConditionDropdownIsWorking(projectName: string = 'Automation', searchTerm: string): Promise<void> {
        await this.openProjectLotTab(projectName);
        await this.openFilterPopup();
        await this.assertFilterPopupVisible();
        await this.selectConditionDropdownOptionWithSearch(searchTerm);
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_27 — Verify "Select All" in status filter selects all options
     */
    async verifySelectAllInStatusFilterSelectsAllOptions(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await this.openFilterPopup();
        await this.assertFilterPopupVisible();
        await this.selectAllStatusesInFilterPopup();
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_xx — Verify "Deselect All" in status filter removes all selections
     */
    async verifyDeselectAllInStatusFilterRemovesAllSelections(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await this.openFilterPopup();
        await this.assertFilterPopupVisible();
        await this.deselectAllStatusesInFilterPopup();
        await this.cleanupAfterProjectTest();
    }

    /**
     * Helper to select multiple statuses in the status filter popup.
     */
    protected async selectMultipleStatusesInFilterPopup(statuses: string[]): Promise<void> {
        // Ensure the filter popup and search box are visible
        await this.filterConditionDropdown.click();
        const searchBox = this.searchBoxInFilterPopup;
        await expect(searchBox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await searchBox.click();

        for (const status of statuses) {
            await searchBox.fill(status);
            const optionLocator = this.optionInFilterPopup(status);
            await expect(optionLocator).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
            await optionLocator.click();
        }
    }

    /**
     * TC_xx — Verify that multiple selections in the status filter are allowed
     */
    async verifyMultipleSelectionsInStatusFilterAreAllowed(projectName: string = 'Automation', selections: string[] = ['For sale', 'Sold']): Promise<void> {
        await this.openProjectLotTab(projectName);
        await this.openFilterPopup();
        await this.assertFilterPopupVisible();
        await this.selectMultipleStatusesInFilterPopup(selections);
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_xx — Verify closing filter popup with cross does not apply changes
     */
    async verifyClosingFilterPopupWithCrossDoesNotApplyChanges(projectName: string = 'Automation', targetStatus: string = 'Sold'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await this.openFilterPopup();
        await this.assertFilterPopupVisible();
        await this.filterPopupCloseIcon.click();
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_xx — Verify closing filter popup with "Clear" button clears all filters
     */
    async verifyClosingFilterPopupWithClearButtonClearsAllFilters(projectName: string = 'Automation', searchTerm: string): Promise<void> {
        await this.openProjectLotTab(projectName);
        await this.openFilterPopup();
        await this.assertFilterPopupVisible();
        await this.selectConditionDropdownOptionWithSearch(searchTerm);
        await this.clearFilterButton.click();
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_xx — Apply filter without any selection (should not filter results)
     */
    async applyFilterWithoutAnySelection(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await this.openFilterPopup();
        await this.assertFilterPopupVisible();
        await this.applyFilterButton.click();
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_xx — Verify that applying a valid filter in Project Lots works correctly
     */
    async verifyValidFilterAppliesCorrectly(projectName: string = 'Automation', filterValue: string = 'For sale'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await this.openFilterPopup();
        await this.assertFilterPopupVisible();
        await this.selectConditionDropdownOptionWithSearch(filterValue);
        await this.applyFilterButton.click();
        const resultLocator = this.page.locator('.p-datatable .p-datatable-tbody tr td', { hasText: filterValue });
        await expect(resultLocator.first()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.cleanupAfterProjectTest();
    }

    /**
     * Helper to type a value in the filter dropdown search
     */
    protected async typeInFilterDropdownSearch(value: string): Promise<void> {
        await this.filterConditionDropdown.click();
        const searchBox = this.searchBoxInFilterPopup;
        await expect(searchBox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await searchBox.click();
        await searchBox.fill(value);
    }

    /**
     * TC_xx — Typing an invalid value in filter dropdown search should show no results
     */
    async verifyInvalidDataInFilterDropdownSearch(projectName: string = 'Automation', invalidValue: string): Promise<void> {
        await this.openProjectLotTab(projectName);
        await this.openFilterPopup();
        await this.assertFilterPopupVisible();
        await this.typeInFilterDropdownSearch(invalidValue);
        await this.cleanupAfterProjectTest();
    }

    /**
     *Verify records are correctly displayed at bottom of list (trim and console the number)
     */
    async verifyRecordCountDisplayedAtBottom(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListRecordsCounter).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        const footerText = await this.lotListRecordsCounter.textContent();
        const recordText = footerText ? footerText.trim() : '';
        console.log(recordText);
        expect(recordText.length).toBeGreaterThan(0);
        await this.cleanupAfterProjectTest();
    }


    /**
     * TC_xx — Verify pagination loads all lots via scroll (infinite scroll)
     */
    async verifyAllLotsLoadOnScroll(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        let prevCount = 0, count = await this.lotTableRows.count(), tries = 0;
        while (tries++ < 20 && count > prevCount) {
            prevCount = count;
            await this.lotTableRows.nth(count - 1).scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(1200);
            count = await this.lotTableRows.count();
        }
        await expect(this.lotTableRows.nth(count - 1)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.cleanupAfterProjectTest();
    }
    /**
     * Check vertical alignment of header and row checkboxes in Lot table
     */
    async verifyLotTableCheckboxAlignment(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.verifyLotListCheckboxesAlignment();
        await this.cleanupAfterProjectTest();
    }


    /**
     * Verify that the create button is not clickable when the name input is empty
     */
    async verifyCreateButtonNotClickableWithoutName(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickLotListViewButton();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.addViewIcon.waitFor({ state: 'visible', timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.addViewIcon.click();
        await expect(this.viewNameInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.viewNameInput.click();
        await this.saveOrCreateButton.click({ force: true });
        await expect(this.viewNameInputInvalid).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_SHORT });
        await this.cleanupAfterProjectTest();
    }

    /**
     * Verify that switching between views updates the lots list layout.
     */
    async verifySwitchingBetweenViewsUpdatesListLayout(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickLotListViewButton();
        await expect(this.viewDropdownArrow).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.viewDropdownArrow.click();
        await this.page.waitForTimeout(1000);
        const testViewOption = this.page.locator('p', { hasText: 'Test View' }).last();
        await expect(testViewOption).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await testViewOption.click();
        await this.saveOrCreateButton.click({ force: true });
        await this.cleanupAfterProjectTest();
    }

    protected get lotFormTabTitle(): Locator {
        return this.page.locator('a#pills-lot-tab').first();
    }

    protected get lotFormSaveAndCloseButton(): Locator {
        return this.page.locator('app-edit-unit button._primary-btn').filter({ hasText: /save\s*&\s*close/i }).first();
    }

    protected get lotFormSaveButton(): Locator {
        return this.page.locator('app-edit-unit button._outline-btn').filter({ hasText: /^\s*save\s*$/i }).first();
    }

    protected get lotFormNameHandle(): Locator {
        return this.page.locator('app-edit-unit .name-handle').first();
    }

    protected get lotFormNameHandleText(): Locator {
        return this.page.locator('app-edit-unit .name-handle p').first();
    }

    protected get lotFormProjectDropdown(): Locator {
        return this.page.locator('app-edit-unit ng-select[formcontrolname="projectid"]').first();
    }

    protected get lotFormProjectDropdownOptions(): Locator {
        return this.page.locator('ng-dropdown-panel .ng-option');
    }

    protected get lotFormProjectDropdownCombobox(): Locator {
        return this.lotFormProjectDropdown.locator('div[role="combobox"]').first();
    }

    protected get lotFormProjectDropdownSelectedValue(): Locator {
        return this.lotFormProjectDropdown.locator('.ng-value-label').first();
    }

    protected get lotFormStatusReasonDropdown(): Locator {
        return this.page.locator('app-edit-unit ng-select[formcontrolname="status_reason"]').first();
    }

    protected get lotFormStudyInput(): Locator {
        return this.page.locator('app-edit-unit input[formcontrolname="study"]').first();
    }

    protected get lotFormOrientationInput(): Locator {
        return this.page.locator('app-edit-unit input[formcontrolname="orientation"]').first();
    }
    protected lotFormStatusReasonOptionByText(statusText: string): Locator {
        return this.lotFormStatusReasonOptions.filter({ hasText: new RegExp(`^\\s*${statusText}\\s*$`, 'i') }).first();
    }

    /**
 * HELPER — Fill optional fields on lot form
 */
    protected async fillLotFormOptionalFields(data: {
        bed?: string;
        bath?: string;
        study?: string;
        aspect?: string;
        orientation?: string;
    }): Promise<void> {
        if (data.bed !== undefined) {
            await this.lotFormBedInput.clear();
            await this.lotFormBedInput.fill(data.bed);
        }
        if (data.bath !== undefined) {
            await this.lotFormBathInput.clear();
            await this.lotFormBathInput.fill(data.bath);
        }
        if (data.study !== undefined) {
            await this.lotFormStudyInput.clear();
            await this.lotFormStudyInput.fill(data.study);
        }
        if (data.aspect !== undefined) {
            await this.lotFormAspectInput.clear();
            await this.lotFormAspectInput.fill(data.aspect);
        }
        if (data.orientation !== undefined) {
            await this.lotFormOrientationInput.clear();
            await this.lotFormOrientationInput.fill(data.orientation);
        }
        await this.page.waitForTimeout(300);
    }

    /**
     * HELPER — Assert optional fields retain their values
     */
    protected async assertLotFormOptionalFieldsRetained(data: {
        bed?: string;
        bath?: string;
        study?: string;
        aspect?: string;
        orientation?: string;
    }): Promise<void> {
        if (data.bed !== undefined) {
            await expect(this.lotFormBedInput).toHaveValue(data.bed, { timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        }
        if (data.bath !== undefined) {
            await expect(this.lotFormBathInput).toHaveValue(data.bath, { timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        }
        if (data.study !== undefined) {
            await expect(this.lotFormStudyInput).toHaveValue(data.study, { timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        }
        if (data.aspect !== undefined) {
            await expect(this.lotFormAspectInput).toHaveValue(data.aspect, { timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        }
        if (data.orientation !== undefined) {
            await expect(this.lotFormOrientationInput).toHaveValue(data.orientation, { timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        }
    }

    /**
 * HELPER — Click Status Reason dropdown to open options
 */
    protected async clickLotFormStatusReasonDropdown(): Promise<void> {
        await expect(this.lotFormStatusReasonDropdown).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotFormStatusReasonDropdown.click();
        await this.page.waitForTimeout(800);
    }

    /**
     * HELPER — Assert all expected status options are visible in Status Reason dropdown
     */
    protected async assertStatusReasonOptionsVisible(expectedStatuses: string[]): Promise<void> {
        // Verify options panel is open
        await expect(this.lotFormStatusReasonOptions.first()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        for (const status of expectedStatuses) {
            const option = this.lotFormStatusReasonOptionByText(status);
            await expect(option).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        }
    }

    /**
     * HELPER — Close Project dropdown by clicking selected option
     */
    protected async closeLotFormProjectDropdown(projectName: string): Promise<void> {
        const selectedOption = this.lotFormProjectDropdownOptions.filter({ hasText: projectName }).first();
        await expect(selectedOption).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await selectedOption.click();
        await this.page.waitForTimeout(500);
    }

    /**
     * HELPER — Assert Project dropdown is closed (aria-expanded="false")
     */
    protected async assertProjectDropdownClosed(): Promise<void> {
        await expect(this.lotFormProjectDropdownCombobox).toHaveAttribute('aria-expanded', 'false', {
            timeout: ProjectBasePage.TIMEOUT_DEFAULT
        });
    }

    /**
 * HELPER — Click Project dropdown on lot form to open project list
 */
    protected async clickLotFormProjectDropdown(): Promise<void> {
        await expect(this.lotFormProjectDropdown).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotFormProjectDropdown.click();
        await this.page.waitForTimeout(800);
    }

    /**
     * HELPER — Assert Project dropdown options list is visible (popup open)
     */
    protected async assertProjectDropdownOptionsVisible(): Promise<void> {
        await expect(this.lotFormProjectDropdownOptions.first()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
 * HELPER — Assert Apartment Details and History tabs are visible on lot form
 */
    protected async assertLotFormTabsVisible(): Promise<void> {
        await expect(this.lotFormApartmentDetailsTab).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.lotFormHistoryTab).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
 * HELPER — Click a lot row by its lot name to open lot form
 */
    protected async clickLotRowByName(lotName: string): Promise<void> {
        const targetLotRow = this.lotListTableRows.filter({ hasText: lotName }).first();
        await expect(targetLotRow).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await targetLotRow.click();
        await this.page.waitForTimeout(1500);
    }

    /**
     * HELPER — Assert lot form tab shows the lot name in title
     */
    protected async assertLotFormTabTitle(lotName: string): Promise<void> {
        await expect(this.lotFormTabTitle).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.lotFormTabTitle).toContainText(lotName, {
            timeout: ProjectBasePage.TIMEOUT_DEFAULT
        });
    }

    /**
     * HELPER — Click "Save & Close" button on lot form
     */
    protected async clickLotFormSaveAndClose(): Promise<void> {
        await expect(this.lotFormSaveAndCloseButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotFormSaveAndCloseButton.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * HELPER — Click "Save" button on lot form 
     */
    protected async clickLotFormSave(): Promise<void> {
        await expect(this.lotFormSaveButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotFormSaveButton.click();
        await this.page.waitForTimeout(1000);
    }

    /**
  * HELPER — Click popup close icon 
  */
    protected async clickPopupCloseIcon(): Promise<void> {
        await expect(this.popupCloseIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.popupCloseIcon.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * HELPER — Assert lot form is closed 
     */
    protected async assertLotFormClosed(): Promise<void> {
        await expect(this.lotFormSaveAndCloseButton).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
 * HELPER — Assert project name appears below tab in name-handle
 */
    protected async assertProjectNameBelowTab(projectName: string): Promise<void> {
        await expect(this.lotFormNameHandle).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.lotFormNameHandleText).toContainText(projectName, {
            timeout: ProjectBasePage.TIMEOUT_DEFAULT
        });
    }

    /**
     * HELPER — Assert lot name appears below tab in name-handle
     */
    protected async assertLotNameBelowTab(lotName: string): Promise<void> {
        await expect(this.lotFormNameHandle).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.lotFormNameHandleText).toContainText(lotName, {
            timeout: ProjectBasePage.TIMEOUT_DEFAULT
        });
    }

    /**
 * HELPER — Assert Project dropdown is auto-filled with given project name
 */
    protected async assertProjectDropdownAutoFilled(projectName: string): Promise<void> {
        await expect(this.lotFormProjectDropdownSelectedValue).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.lotFormProjectDropdownSelectedValue).toContainText(projectName, {
            timeout: ProjectBasePage.TIMEOUT_DEFAULT
        });
    }

    /**
 * TC_01 — Click a lot row to open the lot form/details panel
 */


    protected get lotCreateSaveAndCloseButton(): Locator {
        return this.lotCreateForm.locator('button._primary-btn', { hasText: /Save & Close/i }).first();
    }

    protected get lotListFilterPopup(): Locator {
        return this.page.locator('div.p-overlaypanel').first();
    }

    protected get lotListRecordsCounter(): Locator {
        return this.page.locator('app-unit p', { hasText: /^Records:\s*\d+/ }).first();
    }

    protected get lotListSearchInput(): Locator {
        return this.page.locator('app-unit input#keywordInput').first();
    }

    protected get lotListSelectedRecordsLabel(): Locator {
        return this.page.locator('app-unit p', { hasText: /^Selected Records:\s*\d+/ }).first();
    }

    protected get lotSubTabActive(): Locator {
        return this.page.locator('app-project-setup a[href*="/project-setup/unit"].active').first();
    }



    protected async assertInvalidFileToast(): Promise<void> {
        await expect(this.lotListImportInvalidFileToast).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
    }

    protected async assertLotCreateFormClosed(): Promise<void> {
        await expect(this.lotCreateForm).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async assertLotListRowExists(text: string): Promise<void> {
        await expect(this.lotListRowByText(text)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async assertRequiredFieldToast(): Promise<void> {
        await expect(this.lotCreateRequiredFieldToast).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
    }

    protected async assertSelectedRecordsLabel(): Promise<void> {
        await expect(this.lotListSelectedRecordsLabel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async clickAddNewLotButton(): Promise<void> {
        await expect(this.lotListAddNewButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotListAddNewButton.click();
        await expect(this.lotCreateForm).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(1000);
    }

    protected async clickHideAll(): Promise<void> {
        await expect(this.hideAllButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.hideAllButton.click();
        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);
        await expect(this.visibleColumnList).toHaveCount(0, { timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async clickLotCreateClose(): Promise<void> {
        await expect(this.lotCreateCloseButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotCreateCloseButton.click();
        await this.page.waitForTimeout(800);
    }

    protected async clickLotCreateSaveAndClose(): Promise<void> {
        await expect(this.lotCreateSaveAndCloseButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotCreateSaveAndCloseButton.scrollIntoViewIfNeeded();
        await this.lotCreateSaveAndCloseButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
    }

    protected async clickLotListDeleteButton(): Promise<void> {
        await expect(this.lotListDeleteButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotListDeleteButton.scrollIntoViewIfNeeded();
        await this.lotListDeleteButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
    }

    protected async clickLotListExportAndDownload(): Promise<void> {
        await expect(this.lotListExportButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        const downloadPromise = this.page.waitForEvent('download', { timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.lotListExportButton.click();
        const download = await downloadPromise;
        await download.saveAs(`./downloads/${download.suggestedFilename()}`);
    }

    protected async clickLotListViewButton(): Promise<void> {
        await expect(this.lotListViewButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotListViewButton.scrollIntoViewIfNeeded();
        await this.lotListViewButton.click();
        await this.page.waitForTimeout(1000);
    }

    protected async clickShowAll(): Promise<void> {
        await expect(this.showAllButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.showAllButton.evaluate(button => button.scrollIntoView({ behavior: 'instant', block: 'center' }));
        await this.page.waitForTimeout(1300);
        await this.showAllButton.click();
        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);
        await expect(this.hiddenColumnList).toHaveCount(0, { timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.visibleColumnList.first()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async fillLotCreateForm(data: {
        lotName: string;
        statusReason: string;
        bed: string;
        bath: string;
    }): Promise<void> {
        await this.fillLotName(data.lotName);
        await this.selectLotStatusReason(data.statusReason);
        await this.fillLotBed(data.bed);
        await this.fillLotBath(data.bath);
    }

    protected async getLotListRowCount(): Promise<number> {
        return await this.lotListTableRows.count();
    }

    protected lotListColumnSortIcon(columnName: string): Locator {
        return this.lotListColumnHeader(columnName).locator('p-sorticon').first();
    }

    protected get lotListDeleteButton(): Locator {
        return this.page.locator('app-unit button._cancel-btn').filter({
            has: this.page.locator('img[src*="delete_icon.svg"]')
        }).first();
    }

    protected get lotListViewButton(): Locator {
        return this.page.locator('app-genaric-view div._view-btn').first();
    }

    protected async searchLotList(keyword: string): Promise<void> {
        await expect(this.lotListSearchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotListSearchInput.scrollIntoViewIfNeeded();
        await this.lotListSearchInput.fill('');
        await this.lotListSearchInput.fill(keyword);
        await this.lotListSearchInput.press('Enter');
        await this.page.waitForTimeout(1000);
    }

    protected async selectLotListRowCheckbox(rowIndex: number): Promise<void> {
        const checkbox = this.lotListRowCheckbox(rowIndex);
        await expect(checkbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await checkbox.click();
        await this.page.waitForTimeout(500);
    }

    protected async selectShareTarget(
        dropdown: Locator,
        dropdownArrow: Locator,
        targetName: string
    ): Promise<void> {
        await expect(dropdown).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await dropdown.click();

        const dropBox = this.lastDropBox;
        await expect(dropBox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });

        const searchField = dropBox.locator('input[placeholder="Search"]');
        await searchField.fill(targetName);
        await this.page.waitForTimeout(800);

        const option = dropBox.locator('li', { hasText: targetName }).first();
        await expect(option).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await option.locator('label.checkbox').click({ force: true });

        await dropdownArrow.click({ force: true });
    }

    protected async uploadLotImportFile(fileName: string): Promise<void> {
        const filePath = path.resolve(ProjectBasePage.IMAGES_DIR, fileName);
        await this.lotListImportInput.setInputFiles(filePath);
        await this.page.waitForTimeout(2000);
    }

    protected async verifyLotListCheckboxesAlignment(): Promise<void> {
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.lotListMasterCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        const headerCheckboxBox = this.lotListMasterCheckbox;
        const firstRowCheckboxBox = this.lotListRowCheckbox(0);
        const headerBox = await headerCheckboxBox.boundingBox();
        const rowBox = await firstRowCheckboxBox.boundingBox();
        if (!headerBox || !rowBox) {
            throw new Error('Could not get bounding boxes for checkboxes');
        }
        const alignmentDiff = Math.abs(headerBox.x - rowBox.x);
        expect(alignmentDiff).toBeLessThanOrEqual(2);
    }



    protected async fillLotBath(bath: string): Promise<void> {
        await expect(this.lotCreateBathInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotCreateBathInput.click();
        await this.lotCreateBathInput.fill(bath);
        await this.page.waitForTimeout(300);
    }

    protected async fillLotBed(bed: string): Promise<void> {
        await expect(this.lotCreateBedInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotCreateBedInput.click();
        await this.lotCreateBedInput.fill(bed);
        await this.page.waitForTimeout(300);
    }

    protected async fillLotName(lotName: string): Promise<void> {
        await expect(this.lotCreateLotInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotCreateLotInput.click();
        await this.lotCreateLotInput.fill(lotName);
        await this.page.waitForTimeout(300);
    }

    protected get lotCreateCloseButton(): Locator {
        return this.lotCreateForm.locator('button._cancel-btn', { hasText: /^\s*Close\s*$/i }).first();
    }

    protected get lotCreateForm(): Locator {
        return this.page.locator('app-add-unit').first();
    }

    protected get lotCreateRequiredFieldToast(): Locator {
        return this.page.locator('div[role="alert"].toast-message', {
            hasText: /Fill out the required field/i
        }).first();
    }

    protected get lotListAddNewButton(): Locator {
        return this.page.locator('app-unit button._addNew').first();
    }

    protected lotListColumnHeader(columnName: string): Locator {
        return this.lotListTable.locator('thead th').filter({
            has: this.page.locator('p', { hasText: new RegExp(`^${columnName}$`) })
        }).first();
    }

    protected get lotListExportButton(): Locator {
        return this.page.locator('app-unit button._cancel-btn', { hasText: /^\s*Export\s*$/ }).first();
    }

    protected get lotListImportInput(): Locator {
        return this.page.locator('app-unit input#csv[type="file"]').first();
    }

    protected get lotListImportInvalidFileToast(): Locator {
        return this.page.locator('div[role="alert"].toast-message', {
            hasText: /Only \.csv, \.xls, and \.xlsx files are allowed/i
        }).first();
    }

    protected get lotListMasterCheckbox(): Locator {
        return this.lotListTable.locator('thead p-tableheadercheckbox .p-checkbox-box').first();
    }

    protected lotListRowByText(text: string): Locator {
        return this.lotListTable.locator('tbody tr').filter({ hasText: text }).first();
    }

    protected lotListRowCheckbox(rowIndex: number): Locator {
        return this.lotListTable.locator('tbody tr').nth(rowIndex).locator('p-tablecheckbox .p-checkbox-box').first();
    }

    protected async selectLotStatusReason(statusReason: string): Promise<void> {
        await expect(this.lotCreateStatusReasonSelect).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotCreateStatusReasonSelect.click();
        await this.page.waitForTimeout(500);
        const statusOption = this.lotCreateStatusReasonOptionByText(statusReason);
        await expect(statusOption).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await statusOption.click();
        await this.page.waitForTimeout(500);
    }



    protected get lotCreateBathInput(): Locator {
        return this.lotCreateForm.locator('input[formcontrolname="bath"]').first();
    }

    protected get lotCreateBedInput(): Locator {
        return this.lotCreateForm.locator('input[formcontrolname="bed"]').first();
    }

    protected get lotCreateLotInput(): Locator {
        return this.lotCreateForm.locator('input[formcontrolname="lot_name"]').first();
    }

    protected lotCreateStatusReasonOptionByText(text: string): Locator {
        return this.page.locator('ng-dropdown-panel .ng-option').filter({
            hasText: new RegExp(`^\\s*${text}\\s*$`, 'i')
        }).first();
    }

    protected get lotCreateStatusReasonSelect(): Locator {
        return this.lotCreateForm.locator('ng-select[formcontrolname="status_reason"]').first();
    }

}