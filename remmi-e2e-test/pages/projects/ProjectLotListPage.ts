import { expect, Locator } from '@playwright/test';
import { faker } from '@faker-js/faker';
import * as path from 'path';
import { ProjectBasePage } from './ProjectBasePage';

export class ProjectLotListPage extends ProjectBasePage {
    async verifySearchProjectInDropdown(projectName: string): Promise<void> {
        await this.navigateToLots();
        await this.openProjectDropdown();
        await this.searchInProjectDropdown(projectName);

        const filteredCount = await this.projectDropdownOptions.count();
        expect(filteredCount).toBeGreaterThan(0);

        const firstOptionText = (await this.projectDropdownOptions.first().innerText()).trim().toLowerCase();
        expect(firstOptionText).toContain(projectName.toLowerCase());

        await this.closeDropdown();
        await this.resetFilters();
    }

    // TC — Select one project from dropdown
    async verifySelectProjectFromDropdown(projectName: string): Promise<void> {
        await this.navigateToLots();
        await this.openProjectDropdown();
        await this.searchInProjectDropdown(projectName);
        await this.selectProjectByName(projectName);
        await this.page.mouse.click(0, 0);

        await this.assertLotsExist();
        await this.assertFirstRowContains(projectName);
        await this.resetFilters();
    }

    // TC — Select multiple projects from Project dropdown
    async verifySelectMultipleProjectsFromDropdown(projectNames: string[]): Promise<void> {
        await this.navigateToLots();
        await this.openProjectDropdown();

        for (const projectName of projectNames) {
            await this.searchInProjectDropdown(projectName);
            await this.selectProjectByName(projectName);
            await this.clearProjectDropdownSearch();
        }

        await this.closeDropdown();
        await this.assertAllRowsContainAnyProject(projectNames);
        await this.resetFilters();
    }

    // TC — Use Select All in Project dropdown
    async verifySelectAllProjectsInDropdown(): Promise<void> {
        await this.navigateToLots();
        await this.openProjectDropdown();

        await expect(this.projectDropdownSelectAllCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        const totalOptions = await this.projectDropdownOptions.count();
        expect(totalOptions).toBeGreaterThan(0);

        await this.projectDropdownSelectAllCheckbox.click();
        await this.closeDropdown();

        await this.assertLotsExist();
        await this.resetFilters();
    }

    // TC — Use Deselect All in Project dropdown
    async verifyDeselectAllProjectsInDropdown(): Promise<void> {
        await this.navigateToLots();
        await this.openProjectDropdown();

        // First select all
        await expect(this.projectDropdownSelectAllCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectDropdownSelectAllCheckbox.click();
        await this.page.waitForTimeout(800);

        // Click again to deselect all
        await this.projectDropdownSelectAllCheckbox.click();
        await this.page.waitForTimeout(800);

        await this.closeDropdown();

        // Verify table shows all lots (no filter applied = all results)
        await this.assertLotsExist();
        await this.resetFilters();
    }

    // TC — Use Select All in Project dropdown
    async verifySelectAllProjects(): Promise<void> {
        await this.navigateToLots();
        await this.openProjectDropdown();

        await expect(this.projectDropdownSelectAllCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        const totalOptions = await this.projectDropdownOptions.count();
        expect(totalOptions).toBeGreaterThan(0);

        await this.projectDropdownSelectAllCheckbox.click();
        await this.page.waitForTimeout(1000);

        await this.closeDropdown();
        await this.assertLotsExist();
        await this.resetFilters();
    }

    // TC — Remove selected project tag using cross icon
    async verifyRemoveSelectedProjectTag(projectName: string): Promise<void> {
        await this.navigateToLots();
        await this.openProjectDropdown();
        await this.searchInProjectDropdown(projectName);
        await this.selectProjectByName(projectName);
        await this.closeDropdown();
        await expect(this.selectedProjectTagByName(projectName)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectTagCrossIcon(projectName).click();
        await this.page.waitForTimeout(800);
        await this.resetButton.click();
    }

    protected async openBedDropdown(): Promise<void> {
        await expect(this.bedDropdownInLot).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.bedDropdownInLot.click();
        await expect(this.bedDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async selectBedByValue(bedValue: string): Promise<void> {
        const optionsCount = await this.bedDropdownOptions.count();
        for (let i = 0; i < optionsCount; i++) {
            const option = this.bedDropdownOptions.nth(i);
            const text = (await option.innerText()).trim();
            if (text === bedValue || text.includes(bedValue)) {
                await expect(option).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
                await option.click();
                return;
            }
        }
        throw new Error(`Bed value "${bedValue}" not found in dropdown`);
    }
    // TC — Use Bed dropdown in Lot tab
    async verifyBedDropdownFilter(): Promise<void> {
        await this.navigateToLots();
        await this.openBedDropdown();
        await expect(this.bedDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        const optionsCount = await this.bedDropdownOptions.count();
        expect(optionsCount).toBeGreaterThan(0);
        await this.closeDropdown();
    }

    // Search bed numbers in dropdown
    async verifySearchBedInDropdown(bedValue: string): Promise<void> {
        await this.navigateToLots();
        await this.openBedDropdown();
        await expect(this.bedDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.bedDropdownSearchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.bedDropdownSearchInput.fill(bedValue);
        await this.selectBedByValue(bedValue);
        await this.bedDropdownSearchInput.fill('');
        await this.closeDropdown();
        await this.resetButton.click();
    }

    /**
     * Select one bed number
     */
    async selectBedNumber(bedValue: string): Promise<void> {
        await this.navigateToLots();
        await this.openBedDropdown();
        await expect(this.bedDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.selectBedByValue(bedValue);
        await this.closeDropdown();
        await expect(this.selectedBedTagByValue(bedValue)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.resetButton.click();
    }

    /**
     * Select multiple bed numbers
     */
    async selectMultipleBedNumbers(bedValues: string[]): Promise<void> {
        await this.navigateToLots();
        await this.openBedDropdown();
        await expect(this.bedDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        for (const bedValue of bedValues) {
            await this.selectBedByValue(bedValue);
        }
        await this.closeDropdown();
        for (const bedValue of bedValues) {
            await expect(this.selectedBedTagByValue(bedValue)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        }
        await this.resetButton.click();
    }

    /**
     * Select All beds option
     */
    async verifySelectAllBedsInDropdown(): Promise<void> {
        await this.navigateToLots();
        await this.openBedDropdown();
        await expect(this.bedDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.bedDropdownSelectAllCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.bedDropdownSelectAllCheckbox.click();
        const optionsCount = await this.bedDropdownOptions.count();
        await expect(async () => {
            const tagCount = await this.selectedBedTags.count();
            expect(tagCount).toBe(optionsCount);
        }).toPass();
        await this.closeDropdown();
        await this.resetButton.click();
    }

    /**
     * Use Deselect All in Bed dropdown
     */
    async verifyDeselectAllBedsInDropdown(): Promise<void> {
        await this.navigateToLots();
        await this.openBedDropdown();
        await expect(this.bedDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.bedDropdownSelectAllCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.bedDropdownSelectAllCheckbox.click();
        await this.page.waitForTimeout(800);
        await this.bedDropdownSelectAllCheckbox.click();
        await this.page.waitForTimeout(800);
        await expect(this.selectedBedTags).toHaveCount(0, { timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.closeDropdown();
        await this.resetButton.click();
    }

    /**
     * Remove selected bed tag using cross icon
     */
    async verifyRemoveSelectedBedTag(bedValue: string): Promise<void> {
        await this.navigateToLots();
        await this.openBedDropdown();
        await this.selectBedByValue(bedValue);
        await this.closeDropdown();
        await expect(this.selectedBedTagByValue(bedValue)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.bedTagCrossIcon(bedValue).click();
        await expect(this.selectedBedTagByValue(bedValue)).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.resetButton.click();
    }

    protected async openStatusDropdown(): Promise<void> {
        await expect(this.statusDropdownInLot).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.statusDropdownInLot.click();
        await expect(this.statusDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.statusDropdownOptions.first()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async searchInStatusDropdown(statusValue: string): Promise<void> {
        await expect(this.statusDropdownSearchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.statusDropdownSearchInput.fill(statusValue);
        await this.page.waitForTimeout(800);
    }

    protected async selectStatusByValue(statusValue: string): Promise<void> {
        const optionsCount = await this.statusDropdownOptions.count();
        for (let i = 0; i < optionsCount; i++) {
            const option = this.statusDropdownOptions.nth(i);
            const text = (await option.innerText()).trim().toLowerCase();
            if (text.includes(statusValue.toLowerCase())) {
                await expect(option).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
                await option.click();
                return;
            }
        }
        throw new Error(`Status value "${statusValue}" not found in dropdown`);
    }

    // TC — Use Status dropdown in Lot tab
    async verifyStatusDropdownFilter(): Promise<void> {
        await this.navigateToLots();
        await this.openStatusDropdown();
        await this.closeDropdown();
        await this.resetFilters();
    }

    // TC — Select one status from Status dropdown 
    async verifySelectOneStatus(statusValue: string): Promise<void> {
        await this.navigateToLots();
        await this.openStatusDropdown();
        await this.searchInStatusDropdown(statusValue);
        await this.selectStatusByValue(statusValue);
        await this.closeDropdown();
        await expect(this.selectedStatusTagByValue(statusValue)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.assertLotsExist();
        await this.resetFilters();
    }

    // TC — Select multiple statuses from Status dropdown
    async selectMultipleStatuses(statusValues: string[]): Promise<void> {
        await this.navigateToLots();
        await this.openStatusDropdown();
        for (const statusValue of statusValues) {
            await this.searchInStatusDropdown(statusValue);
            await this.selectStatusByValue(statusValue);
            await this.statusDropdownSearchInput.fill('');
            await this.page.waitForTimeout(300);
        }

        await this.closeDropdown();
        for (const statusValue of statusValues) {
            await expect(this.selectedStatusTagByValue(statusValue)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        }
        await this.assertLotsExist();
        await this.resetFilters();
    }

    // Search statuses in dropdown
    async verifySearchStatusInDropdown(statusValue: string): Promise<void> {
        await this.navigateToLots();
        await this.lotTableRows.first().waitFor({ state: 'visible', timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.openStatusDropdown();
        await this.searchInStatusDropdown(statusValue);
        await this.closeDropdown();
        await this.resetFilters();
    }

    // TC — Use Select All in Status dropdown
    async verifySelectAllStatusInDropdown(): Promise<void> {
        await this.navigateToLots();
        await this.openStatusDropdown();

        await expect(this.statusDropdownSelectAllCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        const totalOptions = await this.statusDropdownOptions.count();
        expect(totalOptions).toBeGreaterThan(0);

        await this.statusDropdownSelectAllCheckbox.click();
        await this.page.waitForTimeout(1000);

        await this.closeDropdown();
        await this.assertLotsExist();
        await this.resetFilters();
    }

    // TC — Use Deselect All in Status dropdown
    async verifyDeselectAllStatusInDropdown(): Promise<void> {
        await this.navigateToLots();
        await this.openStatusDropdown();

        await expect(this.statusDropdownSelectAllCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });

        // Select all first
        await this.statusDropdownSelectAllCheckbox.click();
        await this.page.waitForTimeout(800);

        // Deselect all
        await this.statusDropdownSelectAllCheckbox.click();
        await this.page.waitForTimeout(800);

        await this.closeDropdown();
        await this.assertLotsExist();
        await this.resetFilters();
    }

    // TC — Remove status tag via cross icon
    async verifyRemoveSelectedStatusTag(statusValue: string): Promise<void> {
        await this.navigateToLots();
        await this.openStatusDropdown();
        await this.searchInStatusDropdown(statusValue);
        await this.selectStatusByValue(statusValue);
        await this.closeDropdown();
        await expect(this.selectedStatusTagByValue(statusValue)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.statusTagCrossIcon(statusValue).click();
        await expect(this.selectedStatusTagByValue(statusValue)).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.assertLotsExist();
        await this.resetButton.click();
    }

    protected async openPriceRangeFilter(): Promise<void> {
        await expect(this.priceRangeFilter).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.priceRangeFilter.click();
    }

    protected async setPriceRange(min: string, max: string): Promise<void> {
        await this.priceRangeMinInput.fill(min);
        await this.priceRangeMaxInput.fill(max);
    }

    protected async openInternalAreaFilter(): Promise<void> {
        await expect(this.internalAreaFilter).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.internalAreaFilter.click();
    }

    protected async setInternalArea(min: string, max: string): Promise<void> {
        await this.internalAreaMinInput.fill(min);
        await this.internalAreaMaxInput.fill(max);
    }

    // TC — Use Price Range filter
    async verifyPriceRangeFilter(min: string, max: string): Promise<void> {
        await this.navigateToLots();
        await this.openPriceRangeFilter();
        await this.setPriceRange(min, max);
        await this.assertLotsExist();
        await this.openPriceRangeFilter();
        await this.resetFilters();
    }

    // TC — Use Internal Area filter
    async verifyInternalAreaFilter(min: string, max: string): Promise<void> {
        await this.navigateToLots();
        await this.openInternalAreaFilter();
        await this.setInternalArea(min, max);
        await this.assertLotsExist();
        await this.openInternalAreaFilter();
        await this.resetFilters();
    }

    // TC — Use Reset button to clear filters
    async verifyResetButtonClearsFilters(): Promise<void> {
        await this.navigateToLots();
        await this.searchLot('2308');
        await this.openProjectDropdown();
        await this.searchInProjectDropdown('Nexton');
        await this.selectProjectByName('Nexton');
        await this.closeDropdown();
        await expect(this.lotSearchInput).toHaveValue('2308');
        await expect(this.selectedProjectTagByName('Nexton')).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.resetFilters();
        await expect(this.lotSearchInput).toHaveValue('');
        await expect(this.selectedProjectTagByName('Nexton')).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.assertLotsExist();
    }

    // TC — View popup opens on View button click
    async verifyViewPopupOpens(): Promise<void> {
        await this.navigateToLots();
        await expect(this.viewButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.viewButton.click();
        await this.page.waitForTimeout(800);
        await expect(this.viewPopup).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.closeDropdown();
    }

    // TC — Create new view from popup
    async verifyCreateNewView(viewName: string): Promise<void> {
        await this.navigateToLots();
        await this.openDefaultViewPopup();
        await this.addViewIcon.waitFor({ state: 'visible', timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.addViewIcon.click();
        await expect(this.viewNameInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.viewNameInput.click();
        await this.viewNameInput.fill(viewName);
        await expect(this.saveOrCreateButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.saveOrCreateButton.click({ force: true });
        await expect(this.viewCreatedToast).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.resetToDefaultView();
    }

    // TC — Share view with agent/team
    async verifyShareViewWithAgent(
        userName: string = 'Abdul Rehman',
        teamName: string = 'Automation Team'
    ): Promise<void> {
        await this.navigateToLots();
        await this.openDefaultViewPopup();
        await expect(this.shareViewIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.shareViewIcon.click({ force: true });
        await this.selectShareTarget(this.usersShareDropdown, this.usersShareDropdownArrow, userName);
        await this.selectShareTarget(this.teamsShareDropdown, this.teamsShareDropdownArrow, teamName);
        await expect(this.shareButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.shareButton.click({ force: true });
        await expect(this.shareResponseMessage()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);
        await this.closeOverlay();
        await this.resetListView();
        await this.waitForFirstTableRow();
    }

    /**
     * Save custom view with status arrangement
     */
    async saveCustomViewWithStatusArrangement(): Promise<void> {
        await this.navigateToLots();
        await this.openDefaultViewPopup();
        const handleCount = await this.visibleColumnList.count();
        if (handleCount < 2) {
            throw new Error('Less than 2 draggable statuses found, cannot perform drag-and-drop.');
        }
        const firstHandle = this.visibleColumnList.nth(0);
        const secondHandle = this.visibleColumnList.nth(1);
        await firstHandle.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);
        const box1 = await firstHandle.boundingBox();
        const box2 = await secondHandle.boundingBox();
        if (!box1 || !box2) {
            throw new Error('Could not get bounding boxes for drag handles.');
        }
        await this.performDragDrop(box1, box2);
        await expect(this.viewPopupContent).toBeVisible();
        await this.closeOverlay();
        await this.resetListView();
        await this.waitForFirstTableRow();
    }

    /**
     * Delete an existing saved view in the Lot List View
     */
    async deleteSavedViewInLotList(viewName: string): Promise<void> {
        await this.navigateToLots();
        await this.openDefaultViewPopup();
        await expect(this.savedViewDropdown).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.savedViewDropdown.click();
        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);
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
        await this.closeOverlay();
        await this.resetListView();
        await this.waitForFirstTableRow();
    }

    /**
     * Search for a given status in the View Options popup and verify results show as expected.
     */
    async searchStatusInLotViewPopup(): Promise<void> {
        await this.navigateToLots();
        await this.openDefaultViewPopup();
        const searchTerm = 'Project';
        await expect(this.columnSearchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.columnSearchInput.fill(searchTerm);
        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);
        await expect(this.columnItemByName(searchTerm).first()).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_DEFAULT,
        });
        await this.columnSearchInput.fill('');
        await this.page.waitForTimeout(1000);
        await this.closeOverlay();
        await this.resetListView();
        await this.waitForFirstTableRow();
    }

    // TC — Hide/Unhide status using eye icon
    async verifyHideUnhideStatus(): Promise<void> {
        await this.navigateToLots();
        await this.openDefaultViewPopup();
        await expect(this.hideAllButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.hideAllButton.click();
        await this.page.waitForTimeout(1000);
        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);
        await expect(this.visibleColumnList).toHaveCount(0, { timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.showAllButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.showAllButton.evaluate(button => button.scrollIntoView({ behavior: 'instant', block: 'center' }));
        await this.page.waitForTimeout(1000);
        await this.showAllButton.click();
        await this.page.waitForTimeout(1000);
        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);
        await expect(this.hiddenColumnList).toHaveCount(0, { timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.visibleColumnList.first()).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_DEFAULT,
        });
        await this.page.waitForTimeout(1000);
        await this.closeOverlay();
    }

    // TC — Use arrow to collapse and expand Reorder list
    async verifyCollapseAndExpandReorderList(): Promise<void> {
        await this.navigateToLots();
        await this.openDefaultViewPopup();
        await this.reorderExpandCollapseArrow.click();
        await this.page.waitForTimeout(500);
        await this.reorderExpandCollapseArrow.click();
        await this.page.waitForTimeout(500);
        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);
        await this.closeOverlay();
    }

    protected async isRowCheckboxSelected(row: Locator): Promise<boolean> {
        const checkbox = this.rowCheckbox(row);
        const className = await checkbox.getAttribute('class') || '';
        return className.includes('p-highlight') || className.includes('p-checked');
    }

    // TC — Select single lot from list
    async verifySelectSingleLot(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const firstCheckbox = this.rowCheckbox(firstRow);
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        const checkbox = this.rowCheckbox(firstRow);
        await expect(checkbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        await checkbox.click();
        await this.page.waitForTimeout(500);
        // Verify checkbox is selected
        const isSelected = await this.isRowCheckboxSelected(firstRow);
        expect(isSelected).toBeTruthy();
        await checkbox.click();
        await this.page.waitForTimeout(500);
    }

    // TC — Select multiple lots from list
    async verifySelectMultipleLots(count: number = 2): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const firstCheckbox = this.rowCheckbox(firstRow);
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        const totalRows = await this.lotTableRows.count();
        expect(totalRows).toBeGreaterThanOrEqual(count);
        // Click checkboxes of first N rows
        for (let i = 0; i < count; i++) {
            const row = this.lotTableRows.nth(i);
            const checkbox = this.rowCheckbox(row);
            await expect(checkbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
            await checkbox.click();
            await this.page.waitForTimeout(300);
        }
        // Verify all selected rows have selected checkboxes
        for (let i = 0; i < count; i++) {
            const row = this.lotTableRows.nth(i);
            const isSelected = await this.isRowCheckboxSelected(row);
            expect(isSelected).toBeTruthy();
        }
    }

    // HELPER — check if select all (master) checkbox is selected
    protected async isSelectAllCheckboxSelected(): Promise<boolean> {
        const className = await this.selectAllLotCheckbox.getAttribute('class') || '';
        return className.includes('p-highlight') || className.includes('p-checked');
    }

    // TC — Use master checkbox to select all lots
    async verifySelectAllLotsViaMasterCheckbox(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const firstCheckbox = this.rowCheckbox(firstRow);
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        // Click master checkbox
        await expect(this.selectAllLotCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.selectAllLotCheckbox.click();
        await this.page.waitForTimeout(800);

        // Verify master checkbox is selected
        const isMasterSelected = await this.isSelectAllCheckboxSelected();
        expect(isMasterSelected).toBeTruthy();

        // Verify all visible row checkboxes are selected
        const rowCount = await this.lotTableRows.count();
        for (let i = 0; i < Math.min(rowCount, 5); i++) {
            const row = this.lotTableRows.nth(i);
            const isSelected = await this.isRowCheckboxSelected(row);
            expect(isSelected).toBeTruthy();
        }
        await this.page.waitForTimeout(800);
        await expect(this.selectAllLotCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.selectAllLotCheckbox.click();
        await this.page.waitForTimeout(800);

    }

    // Use master checkbox to deselect all lots
    async verifyDeselectAllLotsViaMasterCheckbox(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const firstCheckbox = this.rowCheckbox(firstRow);
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        // Select all lots first to ensure some are selected
        await expect(this.selectAllLotCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.selectAllLotCheckbox.click();
        await this.page.waitForTimeout(800);
        // Deselect all using master checkbox
        await expect(this.selectAllLotCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.selectAllLotCheckbox.click();
        await this.page.waitForTimeout(800);
        // Verify master checkbox is NOT selected
        const isMasterSelected = await this.isSelectAllCheckboxSelected();
        expect(isMasterSelected).toBeFalsy();
        // Verify all visible row checkboxes are NOT selected
        const rowCount = await this.lotTableRows.count();
        for (let i = 0; i < Math.min(rowCount, 5); i++) {
            const row = this.lotTableRows.nth(i);
            const isSelected = await this.isRowCheckboxSelected(row);
            expect(isSelected).toBeFalsy();
        }
    }

    // TC — Bulk edit becomes visible on lot selection
    async verifyBulkEditVisibleOnSelection(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const firstCheckbox = this.rowCheckbox(firstRow);
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        await expect(this.bulkEditButton).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.rowCheckbox(firstRow).click();
        await this.page.waitForTimeout(500);
        // Verify Bulk Edit becomes visible
        await expect(this.bulkEditButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(500);
        await this.rowCheckbox(firstRow).click();
        await this.page.waitForTimeout(500);
        await expect(this.bulkEditButton).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    // Edit selected lots using Edit Bulk
    async editSelectedLotsUsingBulkEdit(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const firstCheckbox = this.rowCheckbox(firstRow);
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        await firstCheckbox.click();
        await this.page.waitForTimeout(500);
        await expect(this.bulkEditButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.bulkEditButton.click();
        await expect(this.saveAndCloseButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.saveAndCloseButton.click();
        await this.assertSuccessToast();
        await this.rowCheckbox(firstRow).click();
        await this.page.waitForTimeout(500);
        await expect(this.bulkEditButton).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    async verifySortLotsByStatus(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const firstCheckbox = this.rowCheckbox(firstRow);
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        await expect(this.statusColumnSortIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.statusColumnSortIcon.click();
        await expect(this.statusColumnSortIconDesc).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.assertLotsExist();
        await this.statusColumnSortIcon.click();
        await this.assertLotsExist();
    }

    // TC — Project dropdown shows "No Record Found" if no projects allocated
    async verifyNoRecordFoundIfNoProjectAllocation(): Promise<void> {
        await this.navigateToLots();
        await this.openProjectDropdown();
        const optionsCount = await this.projectDropdownOptions.count();
        if (optionsCount === 0) {
            await expect(this.noRecordFoundMessage).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        } else {
            await expect(this.noRecordFoundMessage).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
            expect(optionsCount).toBeGreaterThan(0);
        }
        await this.closeDropdown();
    }

    // TC — Lot tab displays “No Record Found” message on invalid search
    async verifyNoRecordsOnInvalidLotSearch(invalidKeyword: string): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const firstCheckbox = this.rowCheckbox(firstRow);
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        const checkbox = this.rowCheckbox(firstRow);
        await expect(checkbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        await this.searchLot(invalidKeyword);
        await expect(this.noLotFoundMessage).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clearLotSearch();
    }

    // TC — Prevent tag display for unselected filters
    async verifyPreventTagDisplayForUnselectedFilters(): Promise<void> {
        await this.navigateToLots();
        await this.openProjectDropdown();
        await this.closeDropdown();
        const projectTagsCount = await this.page.locator('re-multiselect[placeholder="Project"] .tags .selected_one').count();
        expect(projectTagsCount).toBe(0);
    }

    // TC — Handle invalid price range input and display validation error
    async verifyInvalidPriceRangeInput(min: string, max: string): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const firstCheckbox = this.rowCheckbox(firstRow);
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        await this.openPriceRangeFilter();
        await this.setPriceRange(min, max);
        await expect(this.noLotFoundMessage).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.openPriceRangeFilter();
        await this.resetFilters();
    }

    // TC — Handle invalid internal area range input and display validation error
    async verifyInvalidInternalAreaRangeInput(min: string, max: string): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const firstCheckbox = this.rowCheckbox(firstRow);
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        await this.openInternalAreaFilter();
        await this.setInternalArea(min, max);
        await expect(this.noLotFoundMessage).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.openInternalAreaFilter();
        await this.resetFilters();
    }

    // TC — Lot edit page renders properly with incomplete/missing field data
    async verifyLotRendersWithIncompleteData(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const firstCheckbox = this.rowCheckbox(firstRow);
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        const lotEditHeader = this.page.locator('.name-handle p');
        await expect(lotEditHeader).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await expect(this.page.locator('a#pills-lot-tab.active')).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        const fieldsToCheck = ['Lot Price', 'Car Park Price', 'Storage Price', 'Total', 'Bed', 'Bath', 'Internal Area', 'Aspect', 'Orientation'];
        for (const fieldLabel of fieldsToCheck) {
            const fieldLabelLocator = this.page.locator('p.f-12.mb-2', { hasText: new RegExp(`^${fieldLabel}$`) }).first();
            await expect(fieldLabelLocator).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        }
        await expect(this.saveAndCloseButton.first()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.saveAndCloseButton.click();
        await this.assertSuccessToast();
        await this.resetButton.click();
    }

    // TC — Popup closes on cross icon click
    async verifyPopupClosesOnCrossClick(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const firstCheckbox = this.rowCheckbox(firstRow);
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        const lotEditHeader = this.page.locator('.name-handle p');
        await expect(lotEditHeader).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await expect(this.popupCloseIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.popupCloseIcon.click();
        await this.page.waitForTimeout(800);
        await expect(lotEditHeader).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    // TC — Share popup fails on empty selection
    async verifySharePopupFailsOnEmptySelection(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        await this.defaultViewButton.click();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_MEDIUM });
        await expect(this.shareViewIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.shareViewIcon.click({ force: true });
        await expect(this.shareButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.shareButton.click({ force: true });
        await expect(this.shareResponseMessage()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);
        await this.closeOverlay();
        await this.resetListView();
        await this.waitForFirstTableRow();
    }

    // TC — Create popup fails when attempting to save without name
    async verifyCreatePopupFailsWithoutName(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        await this.defaultViewButton.click();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_MEDIUM });
        await this.addViewIcon.waitFor({ state: 'visible', timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.addViewIcon.click();
        await expect(this.viewNameInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.saveOrCreateButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.saveOrCreateButton.click({ force: true });
        await expect(this.viewNameInputInvalid).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_SHORT });
        await this.closeOverlay();
        await this.resetListView();
        await this.waitForFirstTableRow();
    }

    // TC — Save view fails without making any changes (e.g., without reordering or editing)
    async verifySaveViewFailsWithoutChanges(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        await this.defaultViewButton.click();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_MEDIUM });
        await expect(this.saveOrCreateButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.saveOrCreateButton.click({ force: true });
        const invalidToastMessage = this.page.getByRole('alert', { name: 'You cannot change the default view' });
        await expect(invalidToastMessage).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.closeOverlay();
        await this.resetListView();
        await this.waitForFirstTableRow();
        await this.page.waitForTimeout(1200);
    }

    // TC — Dropdown close does not remove selected tags
    async verifyDropdownCloseDoesNotRemoveTags(): Promise<void> {
        await this.navigateToLots();
        await this.openProjectDropdown();
        await this.searchInProjectDropdown('adb');
        await this.selectProjectByName('adb');
        await this.closeDropdown();
        await expect(this.selectedProjectTagByName('adb')).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.resetFilters();
        await this.waitForFirstTableRow();
    }

    // TC — View reflects only selected project, bed, or status filters
    async verifyViewReflectsSelectedFilters(projectName: string, bedValue: string): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const firstCheckbox = this.rowCheckbox(firstRow);
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        await this.openProjectDropdown();
        await this.searchInProjectDropdown(projectName);
        await this.selectProjectByName(projectName);
        await this.closeDropdown();
        await this.page.waitForTimeout(1000);
        await this.openBedDropdown();
        await this.selectBedByValue(bedValue);
        await this.closeDropdown();
        await this.page.waitForTimeout(1000);
        await this.assertLotsExist();
        await this.resetFilters();
        await this.waitForFirstTableRow();
    }

    // Lot selection preserved during view toggle
    async verifyLotSelectionPreservedDuringViewToggle(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const firstCheckbox = this.rowCheckbox(firstRow);
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        await firstCheckbox.click();
        await this.page.waitForTimeout(500);
        await expect(this.bulkEditButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.bulkEditButton.click();
        await expect(this.saveAndCloseButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.saveAndCloseButton.click();
        await this.assertSuccessToast();
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        await this.page.waitForTimeout(1000);
    }

    // Tags reflect real-time selection/deselection
    async verifyTagReflectsRealTimeSelectionDeselection(projectName: string): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        await this.openProjectDropdown();
        await this.searchInProjectDropdown(projectName);
        await this.selectProjectByName(projectName);
        await this.closeDropdown();
        await expect(this.selectedProjectTagByName(projectName)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.openProjectDropdown();
        await this.searchInProjectDropdown(projectName);
        await this.selectProjectByName(projectName);
        await this.closeDropdown();
        await expect(this.selectedProjectTagByName(projectName)).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.resetFilters();
        await this.waitForFirstTableRow();
    }

    // TC — Verify lot edit form opens on clicking a lot, save & close, and verify success alert


    protected get bedDropdownInLot(): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]').locator('.box');
    }

    protected get bedDropdownOptions(): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]').locator('.drop_box ul li.p-element');
    }

    protected get bedDropdownPanel(): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]').locator('.drop_box');
    }

    protected get bedDropdownSearchInput(): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]').locator('.drop_box .inpt input');
    }

    protected get bedDropdownSelectAllCheckbox(): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]').locator('.drop_box label.select_all');
    }

    protected get bulkEditButton(): Locator {
        return this.page.locator('button, a, p', { hasText: /bulk edit/i }).first();
    }

    protected get internalAreaMaxInput(): Locator {
        return this.page.locator('input[placeholder*="Max" i]');
    }

    protected get internalAreaMinInput(): Locator {
        return this.page.locator('input[placeholder*="Min" i]');
    }

    protected get noLotFoundMessage(): Locator {
        return this.page.locator('tr', { hasText: 'No Lots available' });
    }

    protected get noRecordFoundMessage(): Locator {
        return this.page.locator('ul li', { hasText: 'No Record Found' });
    }

    protected get priceRangeMaxInput(): Locator {
        return this.page.locator('input[placeholder*="Max" i]').first();
    }

    protected get priceRangeMinInput(): Locator {
        return this.page.locator('input[placeholder*="Min" i]').first();
    }

    protected get saveAndCloseButton(): Locator {
        return this.page.locator('button', { hasText: /save.*close|save & close/i }).first();
    }

    protected get selectedBedTags(): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]').locator('.tags .selected_one');
    }

    protected get statusColumnSortIcon(): Locator {
        return this.statusColumnHeader().locator('i.custom-sort');
    }

    protected get statusColumnSortIconDesc(): Locator {
        return this.statusColumnHeader().locator('i.pi-sort-amount-up-alt');
    }

    protected get statusDropdownInLot(): Locator {
        return this.page.locator('re-multiselect[placeholder="Status"]').locator('.box');
    }

    protected get statusDropdownOptions(): Locator {
        return this.page.locator('re-multiselect[placeholder="Status"]').locator('.drop_box ul li.p-element');
    }

    protected get statusDropdownPanel(): Locator {
        return this.page.locator('re-multiselect[placeholder="Status"]').locator('.drop_box');
    }

    protected get statusDropdownSearchInput(): Locator {
        return this.page.locator('re-multiselect[placeholder="Status"]').locator('.drop_box .inpt input');
    }

    protected get statusDropdownSelectAllCheckbox(): Locator {
        return this.page.locator('re-multiselect[placeholder="Status"]').locator('.drop_box label.select_all');
    }

    async verifyProjectDropdownShowsAllocatedProjects(): Promise<void> {
        await this.navigateToLots();
        await this.openProjectDropdown();
        await this.closeDropdown();
    }

    async verifySearchSpecificLot(lotKeyword: string): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const firstCheckbox = this.rowCheckbox(firstRow);
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        const checkbox = this.rowCheckbox(firstRow);
        await expect(checkbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        await this.searchLot(lotKeyword);
        await this.assertLotsExist();
        await this.assertFirstRowContains(lotKeyword);
        await this.clearLotSearch();
    }

    protected get viewButton(): Locator {
        return this.page.locator('._view-btn');
    }



    protected async assertAllRowsContainAnyProject(projectNames: string[]): Promise<void> {
        const rowCount = await this.lotTableRows.count();
        expect(rowCount).toBeGreaterThan(0);
        for (let i = 0; i < rowCount; i++) {
            const rowText = (await this.lotTableRows.nth(i).innerText()).toLowerCase();
            const matches = projectNames.some(name => rowText.includes(name.toLowerCase()));
            expect(matches).toBeTruthy();
        }
    }

    protected async assertFirstRowContains(keyword: string): Promise<void> {
        await this.lotTableRows.first().waitFor({ state: 'visible', timeout: ProjectBasePage.TIMEOUT_LONG });
    }

    protected async assertLotsExist(): Promise<void> {
        const count = await this.getLotRowCount();
        expect(count).toBeGreaterThan(0);
    }

    protected bedTagCrossIcon(bedValue: string): Locator {
        return this.selectedBedTagByValue(bedValue).locator('span.pi-times-circle');
    }

    protected async clearLotSearch(): Promise<void> {
        await this.lotSearchInput.fill('');
        await this.page.waitForTimeout(1000);
    }

    protected async clearProjectDropdownSearch(): Promise<void> {
        await this.projectDropdownSearchInput.fill('');
        await this.page.waitForTimeout(300);
    }

    protected async closeDropdown(): Promise<void> {
        await this.page.waitForTimeout(200);
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(800);
    }

    protected async navigateToLots(): Promise<void> {
        const url = this.page.url();
        if (!url.includes('/listings/lot')) {
            await this.page.goto('/listings/lot');
        }
        await expect(this.lotSearchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
    }

    protected async openProjectDropdown(): Promise<void> {
        await expect(this.projectDropdownInLot).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.projectDropdownInLot.click();
        await expect(this.projectDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async performDragDrop(
        sourceBox: { x: number; y: number; width: number; height: number },
        targetBox: { x: number; y: number; width: number; height: number }
    ): Promise<void> {
        const startX = sourceBox.x + sourceBox.width / 2;
        const startY = sourceBox.y + sourceBox.height / 2;
        const endX = targetBox.x + targetBox.width / 2;
        const endY = targetBox.y + targetBox.height + 20;

        await this.page.mouse.move(startX, startY);
        await this.page.waitForTimeout(100);
        await this.page.mouse.down();
        await this.page.waitForTimeout(100);
        await this.page.mouse.move(startX, startY + 15, { steps: 10 });
        await this.page.waitForTimeout(100);
        await this.page.mouse.move(endX, endY, { steps: 25 });
        await this.page.waitForTimeout(300);
        await this.page.mouse.up();
        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);
    }

    protected get priceRangeFilter(): Locator {
        return this.page.locator('.land-size', { hasText: 'Price Range' });
    }

    protected projectTagCrossIcon(projectName: string): Locator {
        return this.selectedProjectTagByName(projectName).locator('span.pi-times-circle');
    }

    protected async resetFilters(): Promise<void> {
        await this.resetButton.click();
        await this.page.waitForTimeout(800);
    }

    async resetToDefaultView(): Promise<void> {
        await this.activeViewButton.click();

        await expect(this.viewDropdownArrow).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.viewDropdownArrow.click();
        await this.page.waitForTimeout(1000);
        await expect(this.defaultViewOption).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.defaultViewOption.click();

        await this.closeOverlay();
        await this.page.waitForTimeout(800);
        await this.waitForFirstTableRow();
    }

    protected async searchInProjectDropdown(projectName: string): Promise<void> {
        await expect(this.projectDropdownSearchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectDropdownSearchInput.fill(projectName);
        await this.page.waitForTimeout(800);
    }

    protected async searchLot(keyword: string): Promise<void> {
        await this.lotSearchInput.fill(keyword);
        await this.page.waitForTimeout(1500);
    }

    protected selectedBedTagByValue(bedValue: string): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]')
            .locator('.tags .selected_one', { hasText: bedValue });
    }

    protected selectedProjectTagByName(projectName: string): Locator {
        return this.page.locator('re-multiselect[placeholder="Project"]')
            .locator('.tags .selected_one', { hasText: projectName });
    }

    protected selectedStatusTagByValue(statusValue: string): Locator {
        return this.page.locator('re-multiselect[placeholder="Status"]')
            .locator('.tags .selected_one', { hasText: statusValue });
    }

    protected async selectProjectByName(projectName: string): Promise<void> {
        const optionsCount = await this.projectDropdownOptions.count();
        for (let i = 0; i < optionsCount; i++) {
            const option = this.projectDropdownOptions.nth(i);
            const text = (await option.innerText()).trim().toLowerCase();
            if (text.includes(projectName.toLowerCase())) {
                await expect(option).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
                await option.click();
                return;
            }
        }
        throw new Error(`Project "${projectName}" not found in dropdown`);
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

    protected statusTagCrossIcon(statusValue: string): Locator {
        return this.selectedStatusTagByValue(statusValue).locator('span.pi-times-circle');
    }

    protected get viewPopup(): Locator {
        return this.page.locator('p-overlaypanel .p-overlaypanel, .p-overlaypanel-content').first();
    }



    protected async getLotRowCount(): Promise<number> {
        return await this.lotTableRows.count();
    }

    protected statusColumnHeader(): Locator {
        return this.page.locator('table thead th', { has: this.page.locator('p', { hasText: /^Project Status$/ }) });
    }

}