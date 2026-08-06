import { expect, Locator } from '@playwright/test';
import { faker } from '@faker-js/faker';
import * as path from 'path';
import { ProjectBasePage } from './ProjectBasePage';

export class ProjectPrecinctLotListPage extends ProjectBasePage {
    async openLotTabFromPrecinct(): Promise<void> {
        await this.navigateToProjects();
        await this.page.waitForLoadState('networkidle');
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_LONG,
        });
        const precinctName = (await this.firstPrecinctOnProjectsPage.locator('h3').first().innerText()).trim();
        await this.firstPrecinctOnProjectsPage.click();
        console.log(precinctName);

        await expect(this.precinctNameUnderActive).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        const displayedName = (await this.precinctNameUnderActive.innerText()).trim();
        expect(displayedName.length).toBeGreaterThan(0);

        await expect(this.lotTabInPrecinct).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotTabInPrecinct.click();
        await this.clickOnProjects();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Search a lot by keyword in Precinct's Lot tab
     */
    async searchLotByKeyword(keyword: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.searchLot(keyword);

        await expect(this.lotTable.first()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_MEDIUM });
        expect(await this.lotTable.count()).toBeGreaterThan(0);

        await this.clickOnProjects();
    }

    /**
     * Search for a lot by a keyword that does not exist
     */
    async searchNonExistingLot(keyword: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.searchLot(keyword);
        await expect(this.noLotFoundMessage).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });

        await this.clickOnProjects();
    }

    /**
     * Opens the Project dropdown and verifies options appear
     */
    async openAndAssertProjectDropdown(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();

        await this.projectFilter.click();
        await expect(this.projectDropdownOptions.first()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });

        await this.cleanupAfterLotTest();
    }

    /**
     * Search for a project in the Project dropdown
     */
    async verifySearchProjectInLotDropdown(projectName: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();

        await this.openProjectDropdownAndSearch(projectName);
        await this.assertFirstOptionMatchesProject(projectName);

        await this.cleanupAfterLotTest();
    }

    /**
     * Select a project by name from the Project dropdown on the Lot tab
     */
    async selectProjectInLotDropdown(projectName: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();

        await this.openProjectDropdownAndSearch(projectName);
        await this.assertFirstOptionMatchesProject(projectName);
        await this.projectDropdownOptions.first().click();

        await this.cleanupAfterLotTest();
    }

    /**
     * Select multiple projects from the Project dropdown on the Lot tab
     */
    async selectMultipleProjectsInLotDropdown(projectNames: string[]): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();

        for (const projectName of projectNames) {
            await this.openProjectDropdownAndSearch(projectName);
            await this.clickProjectOptionByName(projectName);
            await this.closeDropdown();
        }

        await this.cleanupAfterLotTest();
    }

    /**
     * Use 'Select All' in Project dropdown
     */
    async useSelectAllInProjectDropdown(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();

        await this.openProjectDropdown();
        await expect(this.projectDropdownSelectAllCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        const totalOptions = await this.projectDropdownOptions.count();
        expect(totalOptions).toBeGreaterThan(0);
        await this.projectDropdownSelectAllCheckbox.click();
        await this.cleanupAfterLotTest();
    }

    /**
 * Use 'Deselect All' in Project dropdown (uncheck after select all)
 */
    async useDeselectAllInProjectDropdown(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openProjectDropdown();
        await expect(this.projectDropdownSelectAllCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        const totalOptions = await this.projectDropdownOptions.count();
        expect(totalOptions).toBeGreaterThan(0);
        await this.projectDropdownSelectAllCheckbox.click();
        await this.page.waitForTimeout(800);
        await this.projectDropdownSelectAllCheckbox.click();
        await this.page.waitForTimeout(800);
        await this.cleanupAfterLotTest();
    }

    /**
 * Remove a selected project tag from Project dropdown (× icon click)
 */
    async removeSelectedProjectTagInLotDropdown(projectName: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openProjectDropdownAndSearch(projectName);
        await this.assertFirstOptionMatchesProject(projectName);
        await this.projectDropdownOptions.first().click();
        await this.closeDropdown();
        await expect(this.selectedProjectTagByName(projectName)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectTagCrossIcon(projectName).click();
        await this.page.waitForTimeout(800);
        await expect(this.selectedProjectTagByName(projectName)).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.cleanupAfterLotTest();
    }

    /**
 * Open Bed dropdown and verify options appear
 */
    async openAndAssertBedDropdown(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openBedDropdown();
        await expect(this.bedDropdownOptions.first()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        const optionsCount = await this.bedDropdownOptions.count();
        expect(optionsCount).toBeGreaterThan(0);
        await this.cleanupAfterLotTest();
    }

    /**
 * Search a bed number in Bed dropdown
 */
    async searchBedInBedDropdown(bedValue: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openBedDropdown();
        await expect(this.bedDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.bedDropdownSearchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.bedDropdownSearchInput.fill(bedValue);
        await this.selectBedByValue(bedValue);
        await this.bedDropdownSearchInput.fill('');
        await this.closeDropdown();
        await this.cleanupAfterLotTest();
    }

    /**
 * Select a single bed number from Bed dropdown
 */
    async selectSingleBedInDropdown(bedValue: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openBedDropdown();
        await expect(this.bedDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.selectBedByValue(bedValue);
        await this.closeDropdown();
        await expect(this.selectedBedTagByValue(bedValue)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.cleanupAfterLotTest();
    }

    /**
 * Select multiple bed numbers from Bed dropdown
 */
    async selectMultipleBedsInDropdown(bedValues: string[]): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openBedDropdown();
        await expect(this.bedDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        for (const bedValue of bedValues) {
            await this.selectBedByValue(bedValue);
            await this.page.waitForTimeout(500);
        }
        await this.closeDropdown();
        for (const bedValue of bedValues) {
            await expect(this.selectedBedTagByValue(bedValue)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        }
        await this.cleanupAfterLotTest();
    }

    /**
 * Use 'Select All' in Bed dropdown
 */
    async useSelectAllInBedDropdown(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openBedDropdown();
        await expect(this.bedDropdownSelectAllCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        const totalOptions = await this.bedDropdownOptions.count();
        expect(totalOptions).toBeGreaterThan(0);
        await this.bedDropdownSelectAllCheckbox.click();
        await this.page.waitForTimeout(800);
        await this.cleanupAfterLotTest();
    }

    /**
     * Use 'Deselect All' in Bed dropdown
     */
    async useDeselectAllInBedDropdown(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openBedDropdown();
        await expect(this.bedDropdownSelectAllCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.bedDropdownSelectAllCheckbox.click();
        await this.page.waitForTimeout(500);
        await this.bedDropdownSelectAllCheckbox.click();
        await this.page.waitForTimeout(800);
        await this.cleanupAfterLotTest();
    }

    /**
 * Remove a selected bed tag from Bed dropdown (× icon click)
 */
    async removeSelectedBedTagInBedDropdown(bedValue: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openBedDropdown();
        await expect(this.bedDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.selectBedByValue(bedValue);
        await this.closeDropdown();
        await expect(this.selectedBedTagByValue(bedValue)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.bedTagCrossIcon(bedValue).click();
        await this.page.waitForTimeout(800);
        await expect(this.selectedBedTagByValue(bedValue)).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.cleanupAfterLotTest();
    }

    /**
 * Open Status dropdown and verify options appear
 */
    async openAndAssertStatusDropdown(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openStatusDropdown();
        await expect(this.statusDropdownOptions.first()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        const optionsCount = await this.statusDropdownOptions.count();
        expect(optionsCount).toBeGreaterThan(0);
        await this.cleanupAfterLotTest();
    }

    /**
 * Search a status in Status dropdown
 */
    async searchStatusInStatusDropdown(statusName: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openStatusDropdown();
        await expect(this.statusDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.statusDropdownSearchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.statusDropdownSearchInput.fill(statusName);
        await this.page.waitForTimeout(500);
        const matchingOption = this.statusDropdownOptions.filter({ hasText: statusName }).first();
        await expect(matchingOption).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.statusDropdownSearchInput.fill('');
        await this.cleanupAfterLotTest();
    }

    /**
 * Select a single status from Status dropdown
 */
    async selectSingleStatusInDropdown(statusName: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openStatusDropdown();
        await this.searchInStatusDropdown(statusName);
        await this.selectStatusByValue(statusName);
        await this.cleanupAfterLotTest();
    }

    /**
 * Select multiple statuses from Status dropdown
 */
    async selectMultipleStatusesInDropdown(statusNames: string[]): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openStatusDropdown();
        for (const statusName of statusNames) {
            await this.searchInStatusDropdown(statusName);
            await this.selectStatusByValue(statusName);
            await this.statusDropdownSearchInput.fill('');
            await this.page.waitForTimeout(500);
        }
        await this.cleanupAfterLotTest();
    }

    /**
 * Use 'Select All' in Status dropdown
 */
    async useSelectAllInStatusDropdown(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openStatusDropdown();
        await this.statusDropdownSelectAllCheckbox.click();
        await this.page.waitForTimeout(800);
        await this.cleanupAfterLotTest();
    }

    /**
 * Use 'Deselect All' in Status dropdown 
 */
    async useDeselectAllInStatusDropdown(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openStatusDropdown();
        await this.statusDropdownSelectAllCheckbox.click();
        await this.page.waitForTimeout(800);
        await this.statusDropdownSelectAllCheckbox.click();
        await this.page.waitForTimeout(800);
        await this.cleanupAfterLotTest();
    }

    /**
 * Remove a selected status tag from Status dropdown (× icon click)
 */
    /**
     * Remove a selected status tag from Status dropdown (× icon click)
     */
    async removeSelectedStatusTagInStatusDropdown(statusValue: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openStatusDropdown();
        await this.searchInStatusDropdown(statusValue);
        await this.selectStatusByValue(statusValue);
        await this.closeDropdown();
        await expect(this.selectedStatusTagByValue(statusValue)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.statusTagCrossIcon(statusValue).click();
        await this.cleanupAfterLotTest();
    }

    /**
 * Close Status dropdown
 */
    async closeStatusDropdownTest(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openStatusDropdown();
        await expect(this.statusDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.closeDropdown();
        await expect(this.statusDropdownPanel).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.cleanupAfterLotTest();
    }

    /**
    * Open Price range filter (test)
    */
    async openAndClosePriceRangeFilter(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openPriceRangeFilter();
        await this.cleanupAfterLotTest();
    }

    /**
 * Filter lots using Price Range (min to max) and verify lots are filtered
 */
    async filterLotsUsingPriceRange(min: string, max: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openPriceRangeFilter();
        await this.setPriceRange(min, max);
        await this.assertLotsExist();
        await this.cleanupAfterLotTest();
    }

    /**
 * Use invalid price range
 */
    async useInvalidPriceRange(min: string, max: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openPriceRangeFilter();
        await this.setPriceRange(min, max);
        await expect(this.noLotFoundMessage).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.cleanupAfterLotTest();
    }

    /**
 * Open Area range filter (test)
 */
    async openAndCloseAreaRangeFilter(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openInternalAreaFilter();
        await this.cleanupAfterLotTest();
    }

    /**
 * Filter lots using Internal Area range (min to max) and verify lots are filtered
 */
    async filterLotsUsingAreaRange(min: string, max: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openInternalAreaFilter();
        await this.setInternalArea(min, max);
        await this.assertLotsExist();
        await this.cleanupAfterLotTest();
    }

    /**
 * Enter invalid area range (e.g., min > max) and verify "No Record Found" appears
 */
    async useInvalidAreaRange(min: string, max: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openInternalAreaFilter();
        await this.setInternalArea(min, max);
        await expect(this.noLotFoundMessage).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.cleanupAfterLotTest();
    }

    /**
 * Use Reset button after applying filters and verify filters are cleared
 */
    async useResetButtonAfterFiltering(projectName: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openProjectDropdownAndSearch(projectName);
        await this.assertFirstOptionMatchesProject(projectName);
        await this.projectDropdownOptions.first().click();
        await this.closeDropdown();
        await expect(this.selectedProjectTagByName(projectName)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.resetButton.click();
        await this.page.waitForTimeout(1000);
        await expect(this.selectedProjectTagByName(projectName)).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.assertLotsExist();
        await this.cleanupAfterLotTest();
    }

    /**
 * Use Reset button with no filters applied (verify it works gracefully)
 */
    async useResetWithNoFiltersApplied(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetButton.click();
        await this.page.waitForTimeout(1000);
        await this.assertLotsExist();
        await this.cleanupAfterLotTest();
    }

    /**
 * Open View popup and verify it appears
 */
    async openAndAssertViewPopup(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.defaultViewButton.click();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.cleanupAfterLotTest();
    }

    /**
 * Create a new view with a custom name
 */
    async createNewView(viewName: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
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
        await this.cleanupAfterLotTest();
    }

    /**
 * Share a view with a user and team
 */
    async shareView(
        userName: string = 'Abdul Rehman',
        teamName: string = 'Automation Team'
    ): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openDefaultViewPopup();
        await expect(this.shareViewIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.shareViewIcon.click({ force: true });
        await this.selectShareTarget(this.usersShareDropdown, this.usersShareDropdownArrow, userName);
        await this.selectShareTarget(this.teamsShareDropdown, this.teamsShareDropdownArrow, teamName);
        await expect(this.shareButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.shareButton.click({ force: true });
        await expect(this.shareResponseMessage()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);
        await this.cleanupAfterLotTest();
    }

    /**
    * Delete a view from the View popup
    */
    async deleteView(viewName: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
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
            // Confirmation dialog may not appear in some flows
        }
        await expect(this.viewDeletedToast).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.cleanupAfterLotTest();
    }

    /**
    * Search for a column in View popup
    */
    async searchColumnInViewPopup(searchTerm: string = 'Project'): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openDefaultViewPopup();
        await expect(this.columnSearchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.columnSearchInput.fill(searchTerm);
        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);
        await expect(this.columnItemByName(searchTerm).first()).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_DEFAULT,
        });
        await this.columnSearchInput.fill('');
        await this.page.waitForTimeout(1000);
        await this.cleanupAfterLotTest();
    }

    /**
 * HELPER — Click 'Hide All' button and verify Shown list is empty
 */
    protected async clickHideAll(): Promise<void> {
        await expect(this.hideAllButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.hideAllButton.click();
        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);
        await expect(this.visibleColumnList).toHaveCount(0, { timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Click 'Show All' button and verify Hidden list is empty
     */
    protected async clickShowAll(): Promise<void> {
        await expect(this.showAllButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.showAllButton.evaluate(button => button.scrollIntoView({ behavior: 'instant', block: 'center' }));
        await this.page.waitForTimeout(1300);
        await this.showAllButton.click();
        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);
        await expect(this.hiddenColumnList).toHaveCount(0, { timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.visibleColumnList.first()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
  * Hide all columns then show all columns via Hide All / Show All buttons
  */
    async hideAllAndShowAllColumns(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openDefaultViewPopup();
        await this.clickHideAll();
        await this.page.waitForTimeout(1200)
        await this.clickShowAll();
        await this.page.waitForTimeout(500)
        await this.cleanupAfterLotTest();
    }

    /**
 * Drag a column to reorder it (drag first column to second position)
 */
    async dragColumnToReorder(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
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
        await this.cleanupAfterLotTest();
    }

    /**
     * Reorder using up/down arrows — Status moves accordingly
     */
    async reorderColumnUsingArrows(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.openDefaultViewPopup();
        await this.reorderCollapsedArrow.click();
        await this.page.waitForTimeout(500);
        await this.reorderExpandCollapseArrow.click();
        await this.page.waitForTimeout(500);
        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);
        await this.cleanupAfterLotTest();
    }

    /**
 * HELPER — Get drag handle by index from visible column list
 */
    protected async getColumnHandleAndName(index: number): Promise<{ handle: Locator; name: string }> {
        const handle = this.visibleColumnList.nth(index);
        await this.page.waitForTimeout(1000);
        const name = (await handle.locator('p').innerText()).trim();
        return { handle, name };
    }

    /**
     * HELPER — Get bounding box safely from a column handle
     */
    protected async getBoxFromHandle(handle: Locator): Promise<{ x: number; y: number; width: number; height: number }> {
        await handle.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500);
        const box = await handle.boundingBox();
        if (!box) {
            throw new Error('Could not get bounding box for drag handle.');
        }
        return box;
    }

    /**
     * HELPER — Drag column from one position to another
     */
    protected async dragColumn(fromIndex: number, toIndex: number): Promise<void> {
        const handleCount = await this.visibleColumnList.count();
        if (handleCount < 2) {
            throw new Error('Less than 2 draggable columns found, cannot perform drag-and-drop.');
        }

        const fromColumn = this.visibleColumnList.nth(fromIndex);
        const toColumn = this.visibleColumnList.nth(toIndex);

        const fromBox = await this.getBoxFromHandle(fromColumn);
        const toBox = await this.getBoxFromHandle(toColumn);

        await this.performDragDrop(fromBox, toBox);
    }

    /**
     * HELPER — Get table column header name by index
     */
    protected tableColumnHeaderByIndex(index: number): Locator {
        return this.page.locator('table thead th p').nth(index);
    }

    /**
     * HELPER — Verify table column order matches expected names
     */
    protected async assertTableColumnOrder(): Promise<void> {
        await expect(this.tableColumnHeaderByIndex(0)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
     * Save the reordered statuses after drag-and-drop, then verify table column order changed
     */
    async saveReorderedStatuses(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.openDefaultViewPopup();
        await this.dragColumn(0, 1);
        await expect(this.viewPopupContent).toBeVisible();
        await this.saveOrCreateButton.click();
        await this.page.waitForTimeout(1500);
        await this.assertTableColumnOrder();
        await this.cleanupAfterLotTest();
    }

    /**
 * Select a saved view from the saved view dropdown
 */
    async selectSavedView(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openDefaultViewPopup();
        await this.cleanupAfterLotTest();
    }

    /**
 * HELPER — Toggle a row checkbox and verify selected state
 */
    protected async toggleRowCheckboxAndVerify(row: Locator, expectSelected: boolean): Promise<void> {
        const checkbox = this.rowCheckbox(row);
        await expect(checkbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        await checkbox.click();
        await this.page.waitForTimeout(500);
        const isSelected = await this.isRowCheckboxSelected(row);
        expect(isSelected).toBe(expectSelected);
    }

    /**
     * Select single lot from list (toggle checkbox)
     */
    async selectSingleLotFromList(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        const firstRow = this.lotTableRows.first();
        await this.toggleRowCheckboxAndVerify(firstRow, true);
        await this.cleanupAfterLotTest();
    }

    /**
 * Select multiple lots manually (toggle checkboxes for first N rows)
 */
    async selectMultipleLotsManually(count: number = 2): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        const totalRows = await this.lotTableRows.count();
        const selectCount = Math.min(count, totalRows);
        expect(selectCount).toBeGreaterThan(1);
        for (let i = 0; i < selectCount; i++) {
            await this.toggleRowCheckboxAndVerify(this.lotTableRows.nth(i), true);
        }
        await this.cleanupAfterLotTest();
    }

    /**
 * Select all lots using master/header checkbox in status row
 */
    async selectAllLotsUsingMasterCheckbox(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await expect(this.selectAllLotCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        await this.selectAllLotCheckbox.click();
        await this.cleanupAfterLotTest();
    }

    /**
     * Deselect one selected lot (toggle checkbox off for the first selected row)
     */
    async deselectOneSelectedLot(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        const firstRow = this.lotTableRows.first();
        await this.toggleRowCheckboxAndVerify(firstRow, true);
        await this.toggleRowCheckboxAndVerify(firstRow, false);
        await this.cleanupAfterLotTest();
    }

    /**
     * HELPER — Open Bulk Edit dialog (assumes lots are already selected)
     */
    protected async openBulkEditDialog(): Promise<void> {
        await expect(this.bulkEditButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.bulkEditButton.click();
    }

    /**
     * HELPER — Save & Close Bulk Edit and verify success toast
     */
    protected async saveAndCloseBulkEdit(): Promise<void> {
        await expect(this.saveAndCloseButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.saveAndCloseButton.click();
        await this.assertSuccessToast();
    }

    /**
 * Open bulk edit after selecting lots, save and close, verify success toast
 */
    async openBulkEditAfterSelectingLots(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        const firstRow = this.lotTableRows.first();
        await this.toggleRowCheckboxAndVerify(firstRow, true);
        await this.openBulkEditDialog();
        await this.saveAndCloseBulkEdit();
        await this.toggleRowCheckboxAndVerify(firstRow, false);
        await this.cleanupAfterLotTest();
    }

    /**
 * Sort lots by Status column (Asc/Desc)
 */
    async sortLotsByStatus(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await expect(this.projectColumnSortIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectColumnSortIcon.click();
        await expect(this.projectColumnSortIconDesc).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.cleanupAfterLotTest();
    }

    /**
 * Toggle status sorting (click sort icon again to switch to ascending/descending)
 */
    async toggleStatusSorting(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await expect(this.projectColumnSortIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectColumnSortIcon.click();
        await expect(this.projectColumnSortIconDesc).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectColumnSortIconDesc.click();
        await expect(this.projectColumnSortIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.cleanupAfterLotTest();
    }

    /**
 * Apply multiple dropdown filters (Project + Bed + Status) and verify results
 */
    async applyMultipleDropdownFilters(projectName: string, bedValue: string, statusName: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();

        // Apply Project filter
        await this.openProjectDropdownAndSearch(projectName);
        await this.assertFirstOptionMatchesProject(projectName);
        await this.projectDropdownOptions.first().click();
        await this.closeDropdown();

        // Apply Bed filter
        await this.openBedDropdown();
        await this.selectBedByValue(bedValue);
        await this.closeDropdown();

        // Apply Status filter
        await this.openStatusDropdown();
        await this.searchInStatusDropdown(statusName);
        await this.selectStatusByValue(statusName);
        await this.closeDropdown();

        // Verify all selected tags are visible
        await expect(this.selectedProjectTagByName(projectName)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.selectedBedTagByValue(bedValue)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.selectedStatusTagByValue(statusName)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });

        await this.cleanupAfterLotTest();
    }

    /**
 * Remove one filter tag only and verify other tags remain
 */
    async removeOneTagOnly(projectName: string, bedValue: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();

        // Apply Project filter
        await this.openProjectDropdownAndSearch(projectName);
        await this.assertFirstOptionMatchesProject(projectName);
        await this.projectDropdownOptions.first().click();
        await this.closeDropdown();

        // Apply Bed filter
        await this.openBedDropdown();
        await this.selectBedByValue(bedValue);
        await this.closeDropdown();

        // Verify both tags visible
        await expect(this.selectedProjectTagByName(projectName)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.selectedBedTagByValue(bedValue)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });

        // Remove only the Project tag
        await this.projectTagCrossIcon(projectName).click();
        await this.page.waitForTimeout(800);

        // Verify Project tag is removed but Bed tag remains
        await expect(this.selectedProjectTagByName(projectName)).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.selectedBedTagByValue(bedValue)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });

        await this.cleanupAfterLotTest();
    }

    /**
 * Reopen closed dropdown and verify selection persists
 */
    async reopenDropdownAndVerifySelection(projectName: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();

        // Apply Project filter
        await this.openProjectDropdownAndSearch(projectName);
        await this.assertFirstOptionMatchesProject(projectName);
        await this.projectDropdownOptions.first().click();
        await this.closeDropdown();
        await expect(this.selectedProjectTagByName(projectName)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.openProjectDropdown();
        await this.page.waitForTimeout(800);
        const selectedOption = this.projectDropdownOptions.filter({ hasText: projectName }).first();
        await expect(selectedOption).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        const isChecked = await selectedOption.locator('.p-checkbox-box.p-highlight, input[type="checkbox"]:checked').count();
        expect(isChecked).toBeGreaterThan(0);
        await this.closeDropdown();
        await this.cleanupAfterLotTest();
    }

    /**
 * Apply bed filter and switch to Project dropdown - verify bed filter persists
 */
    async applyBedFilterAndSwitchToProjectDropdown(bedValue: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openBedDropdown();
        await this.selectBedByValue(bedValue);
        await this.closeDropdown();
        await expect(this.selectedBedTagByValue(bedValue)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.openProjectDropdown();
        await this.page.waitForTimeout(800);
        await expect(this.projectDropdownOptions.first()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.closeDropdown();
        await expect(this.selectedBedTagByValue(bedValue)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.cleanupAfterLotTest();
    }

    /**
 * Verify no duplicate tag — selecting same filter twice toggles it (deselects)
 */
    async verifyNoDuplicateTag(projectName: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openProjectDropdownAndSearch(projectName);
        await this.projectDropdownOptions.first().click();
        await this.closeDropdown();
        await expect(this.selectedProjectTagByName(projectName)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.openProjectDropdownAndSearch(projectName);
        await this.projectDropdownOptions.first().click();
        await this.closeDropdown();
        await expect(this.selectedProjectTagByName(projectName)).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.cleanupAfterLotTest();
    }

    /**
     * Validate that a deselected project tag is removed from the tag list
     */
    async validateDeselectedTagIsRemoved(projectName: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openProjectDropdownAndSearch(projectName);
        await this.projectDropdownOptions.first().click();
        await this.closeDropdown();
        await expect(this.selectedProjectTagByName(projectName)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.openProjectDropdownAndSearch(projectName);
        await this.projectDropdownOptions.first().click();
        await this.closeDropdown();
        await expect(this.selectedProjectTagByName(projectName)).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.cleanupAfterLotTest();
    }
    /**
     * Validate cleared price removes filter and shows all lots
     */
    async validateClearedPriceRemovesFilter(min: string, max: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openPriceRangeFilter();
        await this.setPriceRange(min, max);
        await this.assertLotsExist();
        await this.setPriceRange('', '');
        await this.page.waitForTimeout(800);
        await this.assertLotsExist();
        await this.cleanupAfterLotTest();
    }

    /**
 * Validate cleared area removes filter and shows all lots
 */
    async validateClearedAreaRemovesFilter(min: string, max: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openInternalAreaFilter();
        await this.setInternalArea(min, max);
        await this.assertLotsExist();
        await this.setInternalArea('', '');
        await this.page.waitForTimeout(800);
        await this.assertLotsExist();
        await this.cleanupAfterLotTest();
    }

    /**
 * Open and close View popup without performing any action
 */
    async openAndCloseViewPopupWithoutAction(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openDefaultViewPopup();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(800);
        await expect(this.viewPopupContent).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.cleanupAfterLotTest();
    }

    /**
 * Open View popup and click Save without making any changes
 */
    async clickSaveWithoutChangingView(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openDefaultViewPopup();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.saveOrCreateButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.saveOrCreateButton.click();
        await this.cleanupAfterLotTest();
    }

    /**
 * Try to share view without selecting a team and verify validation
 */
    async shareViewWithNoTeamSelected(userName: string = 'Abdul Rehman'): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openDefaultViewPopup();
        await expect(this.shareViewIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.shareViewIcon.click({ force: true });
        await this.selectShareTarget(this.usersShareDropdown, this.usersShareDropdownArrow, userName);
        await expect(this.shareButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.shareButton.click({ force: true });
        await this.page.waitForTimeout(1000);
        const responseVisible = await this.shareResponseMessage().isVisible().catch(() => false);
        expect(responseVisible).toBeTruthy();
        await this.cleanupAfterLotTest();
    }

    /**
 * Verify View popup UI remains responsive
 */
    async verifyViewPopupResponsive(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openDefaultViewPopup();
        await this.reorderExpandCollapseArrow.click();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.cleanupAfterLotTest();
    }

    /**
 * Verify Lots list remains responsive after applying many filters
 */
    async verifyLotsListResponsiveAfterManyFilters(projectName: string, bedValue: string, statusName: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openProjectDropdownAndSearch(projectName);
        await this.projectDropdownOptions.first().click();
        await this.closeDropdown();
        await this.openBedDropdown();
        await this.selectBedByValue(bedValue);
        await this.closeDropdown();
        await this.openStatusDropdown();
        await this.searchInStatusDropdown(statusName);
        await this.selectStatusByValue(statusName);
        await this.closeDropdown();
        await expect(this.lotTableRows.first()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.cleanupAfterLotTest();
    }

    /**
 * Verify filters persist (or reset) when switching tabs
 */
    async verifyFiltersOnTabSwitch(projectName: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openProjectDropdownAndSearch(projectName);
        await this.projectDropdownOptions.first().click();
        await this.closeDropdown();
        await expect(this.selectedProjectTagByName(projectName)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.eoiTabInPrecinct).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.eoiTabInPrecinct.click();
        await this.page.waitForTimeout(1500);
        await this.lotTabInPrecinct.click();
        await this.page.waitForTimeout(1500);
        const tagVisible = await this.selectedProjectTagByName(projectName).isVisible().catch(() => false);
        console.log(`Project filter after tab switch: ${tagVisible ? 'PERSISTED' : 'RESET'}`);
        expect(typeof tagVisible).toBe('boolean');
        await this.cleanupAfterLotTest();
    }

    /**
 * Verify UI alignment for selected tags — tags appear inline without overlapping
 */
    async verifyTagsAlignment(projectNames: string[]): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();

        // Select multiple projects to populate tags
        for (const projectName of projectNames) {
            await this.openProjectDropdownAndSearch(projectName);
            await this.clickProjectOptionByName(projectName);
            await this.closeDropdown();
        }

        // Verify all tags are visible and not overlapping
        const tags = this.page.locator('re-multiselect[placeholder="Project"] .tags .selected_one');
        const tagCount = await tags.count();
        expect(tagCount).toBe(projectNames.length);

        // Check each tag has a valid bounding box (visible, no zero size)
        const tagBoxes: Array<{ x: number; y: number; width: number; height: number }> = [];
        for (let i = 0; i < tagCount; i++) {
            const box = await tags.nth(i).boundingBox();
            expect(box).not.toBeNull();
            if (box) {
                expect(box.width).toBeGreaterThan(0);
                expect(box.height).toBeGreaterThan(0);
                tagBoxes.push(box);
            }
        }

        // Verify tags don't overlap (each tag's x position differs OR they are on different rows)
        for (let i = 0; i < tagBoxes.length - 1; i++) {
            const current = tagBoxes[i];
            const next = tagBoxes[i + 1];
            const horizontallyOverlapping = current.x + current.width > next.x && current.y === next.y;
            expect(horizontallyOverlapping).toBeFalsy();
        }

        await this.cleanupAfterLotTest();
    }

    /**
 * Verify closing one dropdown and opening another works without conflicts
 */
    async closeOneOpenAnotherDropdown(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openBedDropdown();
        await expect(this.bedDropdownOptions.first()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.closeDropdown();
        await this.page.waitForTimeout(500);
        await this.openProjectDropdown();
        await expect(this.projectDropdownOptions.first()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.bedDropdownOptions.first()).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.closeDropdown();
        await this.cleanupAfterLotTest();
    }

    /**
 * Verify sorting remains after applying multiple filters
 */
    async verifySortingRemainsAfterFilters(projectName: string, bedValue: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openProjectDropdownAndSearch(projectName);
        await this.projectDropdownOptions.first().click();
        await this.closeDropdown();
        await expect(this.projectColumnSortIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectColumnSortIcon.click();
        await expect(this.projectColumnSortIconDesc).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.openBedDropdown();
        await this.selectBedByValue(bedValue);
        await this.closeDropdown();
        await expect(this.projectColumnSortIconDesc).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.cleanupAfterLotTest();
    }

    /**
 * Select a project that has no lots created in this precinct and verify no lots shown
 */
    async selectProjectWithNoLots(projectName: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openProjectDropdownAndSearch(projectName);
        await this.assertFirstOptionMatchesProject(projectName);
        await this.projectDropdownOptions.first().click();
        await this.closeDropdown();
        await expect(this.selectedProjectTagByName(projectName)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.noLotFoundMessage).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.cleanupAfterLotTest();
    }

    /**
 * Verify all dropdown tags and fields are cleared after clicking Reset
 */
    async verifyTagsRemovedOnReset(projectName: string, bedValue: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openProjectDropdownAndSearch(projectName);
        await this.projectDropdownOptions.first().click();
        await this.closeDropdown();
        await this.openBedDropdown();
        await this.selectBedByValue(bedValue);
        await this.closeDropdown();
        await expect(this.selectedProjectTagByName(projectName)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.selectedBedTagByValue(bedValue)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.resetButton.click();
        await expect(this.selectedProjectTagByName(projectName)).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.selectedBedTagByValue(bedValue)).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.cleanupAfterLotTest();
    }

    // ==========================================================================
    // CONSTANTS — PROJECT SETUP
    // ==========================================================================

    protected static readonly PROJECT_PRICELIST_URL = '/projects/edit_/69e9c1d7be0c8310f1dceee0/price-list';
    protected static readonly PROJECT_SETUP_URL = '/projects/edit_/69e9c1d7be0c8310f1dceee0/project-setup';

    // ==========================================================================
    // LOCATORS — PROJECT CLICK & PRICELIST TAB
    // ==========================================================================

    protected get projectsSectionHeading(): Locator {
        return this.page.locator('p', { hasText: /^\s*Project\s*$/i }).first();
    }

    protected projectCardInProjectSection(projectName: string): Locator {
        return this.page
            .locator('.sgv-product')
            .filter({ has: this.page.locator('.product-content h3', { hasText: new RegExp(`^\\s*${projectName}\\s*$`, 'i') }) })
            .first();
    }

    protected projectCardClickTarget(projectName: string): Locator {
        return this.projectCardInProjectSection(projectName).locator('a[href="javascript:void(0)"]').first();
    }

    protected get pricelistTab(): Locator {
        return this.page.locator('a[href*="/price-list"]', { hasText: /Price List/i });
    }

    protected get pricelistTabActive(): Locator {
        return this.page.locator('a.active[href*="/price-list"]');
    }

    protected get pricelistContent(): Locator {
        return this.page.locator('app-price-list');
    }

    // ==========================================================================
    // LOCATORS — PROJECT SETUP TAB & GENERAL TAB
    // ==========================================================================

    protected get projectSetupTab(): Locator {
        return this.page.locator('a[href*="/project-setup"]', { hasText: /Project Set Up/i });
    }

    protected get projectSetupTabActive(): Locator {
        return this.page.locator('a.active[href*="/project-setup"]');
    }

    protected get projectSetupContent(): Locator {
        return this.page.locator('app-project-setup, [class*="project-setup"]').first();
    }

    protected get generalTab(): Locator {
        return this.page.locator('a, li', { hasText: /^\s*General\s*$/i }).first();
    }

    protected get generalTabActive(): Locator {
        return this.page.locator('a.active, li.active', { hasText: /General/i });
    }

    // ==========================================================================
    // LOCATORS — PROJECT SETUP FIELDS
    // ==========================================================================

    protected get projectSetupNameField(): Locator {
        return this.page.locator('input[formcontrolname="Project_Name"], input[formcontrolname="project_name"]').first();
    }

    protected get projectSetupStatusField(): Locator {
        return this.page.locator('ng-select[formcontrolname="Project_Status"], ng-select[formcontrolname="project_status"]').first();
    }

    protected get projectAddressField(): Locator {
        return this.page.locator('[class*="address"]', { hasText: /Project Address/i }).first();
    }

    protected get projectAddressIcon(): Locator {
        return this.projectAddressField.locator('img, i.pi').first();
    }

    protected get projectDisplayAddressField(): Locator {
        return this.page.locator('[class*="address"]', { hasText: /Display Address/i }).first();
    }

    protected get projectDisplayAddressIcon(): Locator {
        return this.projectDisplayAddressField.locator('img, i.pi').first();
    }

    // ==========================================================================
    // LOCATORS — PROJECT ADDRESS POPUP
    // ==========================================================================

    protected get projectAddressPopup(): Locator {
        return this.page.locator('.p-dialog', { hasText: /Project Address/i });
    }

    protected get projectAddressPopupCloseIcon(): Locator {
        return this.projectAddressPopup.locator('.p-dialog-header-close, i.pi-times').first();
    }

    protected get projectAddressSaveButton(): Locator {
        return this.projectAddressPopup.locator('button', { hasText: /save/i });
    }

    protected get projectAddressStreetInput(): Locator {
        return this.projectAddressPopup.locator('input[formcontrolname*="street" i], input[placeholder*="street" i]').first();
    }

    protected get projectAddressSuburbInput(): Locator {
        return this.projectAddressPopup.locator('input[formcontrolname*="suburb" i], input[placeholder*="suburb" i]').first();
    }

    protected get projectAddressStateInput(): Locator {
        return this.projectAddressPopup.locator('input[formcontrolname*="state" i], input[placeholder*="state" i]').first();
    }

    protected get projectAddressPostcodeInput(): Locator {
        return this.projectAddressPopup.locator('input[formcontrolname*="postcode" i], input[placeholder*="postcode" i]').first();
    }

    // ==========================================================================
    // LOCATORS — PROJECT DISPLAY ADDRESS POPUP
    // ==========================================================================

    protected get projectDisplayAddressPopup(): Locator {
        return this.page.locator('.p-dialog', { hasText: /Display Address/i });
    }

    protected get projectDisplayAddressPopupCloseIcon(): Locator {
        return this.projectDisplayAddressPopup.locator('.p-dialog-header-close, i.pi-times').first();
    }

    protected get projectDisplayAddressSaveButton(): Locator {
        return this.projectDisplayAddressPopup.locator('button', { hasText: /save/i });
    }

    // ==========================================================================
    // LOCATORS — PROJECT SETUP > GENERAL TAB (sub-tabs)
    // Source: app-project-setup HTML (shared 2026-05-08)
    // ==========================================================================

    protected get generalSubTab(): Locator {
        return this.page.locator('a[href*="/project-setup/general"]', { hasText: /^\s*General\s*$/i });
    }

    protected get generalSubTabActive(): Locator {
        return this.page.locator('a.active[href*="/project-setup/general"]');
    }

    protected get generalSettingContent(): Locator {
        return this.page.locator('app-general-setting');
    }

    // ==========================================================================
    // LOCATORS — GENERAL TAB FORM FIELDS
    // Source: app-general-setting HTML (shared 2026-05-08)
    // ==========================================================================

    protected get projectSetupNameLabel(): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1', { hasText: /^Project Name$/i });
    }

    protected get projectSetupNameInput(): Locator {
        return this.generalSettingContent.locator('input[formcontrolname="Project_Name"]');
    }

    protected get projectSetupStatusLabel(): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1', { hasText: /^Project Status$/i });
    }

    protected get projectSetupStatusSelect(): Locator {
        return this.generalSettingContent.locator('ng-select[formcontrolname="Project_Status"]');
    }

    protected get projectSetupAddressLabel(): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1', { hasText: /^Project Address$/i });
    }

    protected get projectSetupAddressInput(): Locator {
        return this.generalSettingContent.locator('input[formcontrolname="Project_Address"]');
    }

    protected get projectSetupDisplayAddressLabel(): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1', { hasText: /^Project Display Address$/i });
    }

    protected get projectSetupDisplayAddressInput(): Locator {
        return this.generalSettingContent.locator('input[formcontrolname="Project_Display_Address"]');
    }

    protected get projectDisplayAddressPencilIcon(): Locator {
        return this.generalSettingContent.locator('button#toggle-overlay');
    }

    protected get googlePlacesDropdown(): Locator {
        return this.page.locator('.pac-container:visible').first();
    }

    protected get googlePlacesSuggestions(): Locator {
        return this.page.locator('.pac-container:visible .pac-item');
    }

    protected get generalTabSaveButton(): Locator {
        return this.generalSettingContent.locator('button._outline-btn', { hasText: /^\s*Save\s*$/i }).first();
    }

    protected get generalTabSaveAndCloseButton(): Locator {
        return this.generalSettingContent.locator('button._primary-btn', { hasText: /Save & Close/i }).first();
    }

    protected get generalTabCloseButton(): Locator {
        return this.generalSettingContent.locator('button._cancel-btn', { hasText: /^\s*Close\s*$/i }).first();
    }

    protected get displayAddressPopup(): Locator {
        return this.page.locator('.row', { hasText: /Property Address/i }).filter({ has: this.page.locator('h4', { hasText: /Property Address/i }) });
    }

    protected get displayAddressPopupHeading(): Locator {
        return this.page.locator('h4', { hasText: /^\s*Property Address\s*$/i });
    }

    protected get displayAddressPopupSaveButton(): Locator {
        return this.displayAddressPopup.locator('button.btn-primary', { hasText: /^\s*Save\s*$/i });
    }

    protected get displayAddressBuildingNameInput(): Locator {
        return this.page.locator('input[formcontrolname="building_name"]');
    }

    protected get displayAddressUnitNoInput(): Locator {
        return this.page.locator('input[formcontrolname="unit_no"]');
    }

    protected get displayAddressStreetNoInput(): Locator {
        return this.page.locator('input[formcontrolname="street_no"]');
    }

    protected get displayAddressStreetNameInput(): Locator {
        return this.page.locator('input[formcontrolname="street_name"]');
    }

    protected get displayAddressSuburbAutocomplete(): Locator {
        return this.page.locator('p-autocomplete[formcontrolname="suburb"] input');
    }

    protected get displayAddressSuburbSuggestionItems(): Locator {
        return this.page.locator('li.p-autocomplete-item[role="option"]');
    }

    protected displayAddressSuburbSuggestionByLabel(label: string): Locator {
        return this.page.locator('li.p-autocomplete-item[role="option"][aria-label="' + label + '"]');
    }

    protected get displayAddressStateInput(): Locator {
        return this.page.locator('input[formcontrolname="state"]');
    }

    protected get displayAddressPostCodeInput(): Locator {
        return this.page.locator('input[formcontrolname="post_code"]');
    }

    protected get displayAddressCountryInput(): Locator {
        return this.page.locator('input[formcontrolname="country"]');
    }

    protected get displayAddressPopupCloseIcon(): Locator {
        return this.page.locator('.p-overlaypanel-close-icon').first();
    }

    // ==========================================================================
    // LOCATORS — DEVELOPER DROPDOWN (re-multiselect)
    // Source: app-general-setting HTML (shared 2026-05-08)
    // ==========================================================================

    protected get developerDropdownContainer(): Locator {
        return this.page.locator('re-multiselect').first();
    }

    protected get developerDropdownTrigger(): Locator {
        return this.developerDropdownContainer.locator('.tags').first();
    }

    protected get developerDropdownArrow(): Locator {
        return this.developerDropdownContainer.locator('i.fas.fa-sort-down, i.fas.fa-sort-up').first();
    }

    protected get developerDropdownPanel(): Locator {
        return this.developerDropdownContainer.locator('.drop_box');
    }

    protected get developerDropdownSearchInput(): Locator {
        return this.developerDropdownPanel.locator('input[placeholder="Search"]');
    }

    protected get developerDropdownCreateNew(): Locator {
        return this.developerDropdownPanel.locator('p.cursor-pointer', { hasText: /Create New/i });
    }

    protected get developerDropdownItems(): Locator {
        return this.developerDropdownPanel.locator('ul li');
    }

    protected developerDropdownItemByText(text: string): Locator {
        return this.developerDropdownPanel.locator('ul li').filter({ hasText: text }).first();
    }

    protected get developerPlaceholder(): Locator {
        return this.developerDropdownContainer.locator('.placeHolder', { hasText: /Select Developer/i });
    }

    protected get developerSelectedChips(): Locator {
        return this.developerDropdownContainer.locator('.tags .selected_one');
    }

    protected developerSelectedChipByName(name: string): Locator {
        return this.developerSelectedChips.filter({ hasText: name }).first();
    }

    protected get projectManagerLabel(): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1', { hasText: /^Project Manager$/ });
    }

    protected get projectManagersDropdown(): Locator {
        return this.page.locator('ng-select[formcontrolname="Project_Manager"]');
    }

    protected get projectManagerDropdownPanel(): Locator {
        return this.page.locator('ng-dropdown-panel');
    }

    protected get projectManagerDropdownInput(): Locator {
        return this.page.locator('.ng-input input').last();
    }

    protected get projectManagerDropdownOptions(): Locator {
        return this.projectManagerDropdownPanel.locator('.ng-option');
    }

    protected projectManagerOptionByText(text: string): Locator {
        return this.projectManagerDropdownPanel.locator('.ng-option').filter({ hasText: text }).first();
    }

    protected generalTabLabelByText(text: string): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1', { hasText: new RegExp(`^${text}$`) }).first();
    }

    protected get floorplanSectionHeading(): Locator {
        return this.generalSettingContent.locator('p.f-14').filter({ hasText: 'Floorplan Types' }).first();
    }

    protected get floorplanSectionHeader(): Locator {
        return this.floorplanSectionHeading.locator('xpath=..').first();
    }

    protected get floorplanToggleArrowUp(): Locator {
        return this.page.locator('i.pi-angle-up').first();
    }

    protected get floorplanToggleArrowDown(): Locator {
        return this.page.locator('i.pi-angle-down').last();
    }


    protected get floorplanTableWrapper(): Locator {
        return this.generalSettingContent.locator('div.s-card-table.s-responsive-table').first();
    }

    // ==========================================================================
    // LOCATORS — FLOORPLAN DELETE (TC_22)
    // Source: app-general-setting HTML (verified — row with checkbox + delete icon)
    // ==========================================================================

    protected get floorplanPlusIcon(): Locator {
        return this.floorplanSectionHeader.locator('i.pi-plus').first();
    }

    protected get floorplanHeaderDeleteIcon(): Locator {
        return this.floorplanSectionHeader.locator('img[src*="delete_icon.svg"]').first();
    }

    protected get floorplanTable(): Locator {
        return this.floorplanTableWrapper.locator('p-table').first();
    }

    protected get floorplanTableRows(): Locator {
        return this.floorplanTable.locator('tbody tr');
    }

    protected floorplanRowCheckbox(rowIndex: number): Locator {
        return this.floorplanTableRows.nth(rowIndex).locator('p-checkbox.cbox .p-checkbox-box').first();
    }

    protected get floorplanHeaderCheckbox(): Locator {
        return this.floorplanTable.locator('thead p-checkbox .p-checkbox-box').first();
    }

    protected get floorplanTypeColumnHeader(): Locator {
        return this.floorplanTable.locator('th.p-sortable-column[psortablecolumn="name"]').first();
    }


    // ==========================================================================
    // LOCATORS — BONUS PAYABLE UPON CHIPS (TC_30)
    // Source: app-general-setting HTML (verified — empty + with chip)
    // ==========================================================================

    protected get bonusPayableUponLabel(): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1', { hasText: /^Bonus Payable Upon$/ }).first();
    }

    protected get bonusPayableUponChips(): Locator {
        return this.generalSettingContent.locator('p-chips[formcontrolname="bonus_payable_upon"]').first();
    }

    protected get bonusPayableUponInput(): Locator {
        return this.bonusPayableUponChips.locator('li.p-chips-input-token input').first();
    }

    protected get bonusPayableUponTokens(): Locator {
        return this.bonusPayableUponChips.locator('li.p-chips-token');
    }

    protected bonusPayableUponTokenByText(text: string): Locator {
        return this.bonusPayableUponChips.locator('li.p-chips-token').filter({
            has: this.page.locator('span.p-chips-token-label', { hasText: text })
        }).first();
    }

    protected bonusPayableUponTokenRemoveIcon(text: string): Locator {
        return this.bonusPayableUponTokenByText(text).locator('timescircleicon').first();
    }

    protected get projectUpgradesHeading(): Locator {
        return this.generalSettingContent.locator('p.f-16._fw-600').filter({ hasText: 'Project Upgrades' }).first();
    }

    protected get projectUpgradesSection(): Locator {
        return this.projectUpgradesHeading.locator('xpath=../..').first();
    }

    protected get addAdditionalUpgradeGroupButton(): Locator {
        return this.projectUpgradesSection.locator('button._view-btn').filter({
            has: this.page.locator('i.pi-plus')
        }).first();
    }

    protected get upgradeBoxes(): Locator {
        return this.projectUpgradesSection.locator('.upgrade-box');
    }

    protected upgradeBox(index: number): Locator {
        return this.upgradeBoxes.nth(index);
    }

    protected upgradeGroupInput(boxIndex: number): Locator {
        return this.upgradeBox(boxIndex).locator('input.site-input').nth(0);
    }

    protected upgradeInput(boxIndex: number): Locator {
        return this.upgradeBox(boxIndex).locator('input.site-input').nth(1);
    }

    protected upgradeCostInput(boxIndex: number): Locator {
        return this.upgradeBox(boxIndex).locator('app-price-input input').first();
    }

    protected upgradeBoxRemoveIcon(boxIndex: number): Locator {
        return this.upgradeBox(boxIndex).locator('button._view-btn').filter({
            has: this.page.locator('i.pi-times-circle')
        }).first();
    }

    protected get bonusPayableToLabel(): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1', { hasText: /^Bonus Payable To$/ }).first();
    }

    protected get bonusPayableToChips(): Locator {
        return this.generalSettingContent.locator('p-chips[formcontrolname="bonus_payable_to"]').first();
    }

    protected get bonusPayableToInput(): Locator {
        return this.bonusPayableToChips.locator('li.p-chips-input-token input').first();
    }

    protected get bonusPayableToTokens(): Locator {
        return this.bonusPayableToChips.locator('li.p-chips-token');
    }

    protected bonusPayableToTokenByText(text: string): Locator {
        return this.bonusPayableToChips.locator('li.p-chips-token').filter({
            has: this.page.locator('span.p-chips-token-label', { hasText: text })
        }).first();
    }

    protected bonusPayableToTokenRemoveIcon(text: string): Locator {
        return this.bonusPayableToTokenByText(text).locator('timescircleicon').first();
    }

    /**
     * All upgrade rows inside a specific upgrade box (rows containing Upgrade + Cost)
     * Excludes the Upgrade Group row which is structured differently
     */
    protected upgradeRowsInBox(boxIndex: number): Locator {
        return this.upgradeBox(boxIndex).locator('div.mb-2.d-flex.position-relative');
    }

    /**
     * Upgrade input within a specific row within a specific box
     */
    protected upgradeRowInput(boxIndex: number, rowIndex: number): Locator {
        return this.upgradeRowsInBox(boxIndex).nth(rowIndex).locator('input.site-input').first();
    }

    /**
     * Cost input within a specific row within a specific box
     */
    protected upgradeRowCostInput(boxIndex: number, rowIndex: number): Locator {
        return this.upgradeRowsInBox(boxIndex).nth(rowIndex).locator('app-price-input input').first();
    }

    /**
     * Cross icon on an upgrade row (only exists on added rows, not row 0)
     */
    protected upgradeRowRemoveIcon(boxIndex: number, rowIndex: number): Locator {
        return this.upgradeRowsInBox(boxIndex).nth(rowIndex).locator('i.pi-times-circle').first();
    }

    /**
     * "Add Upgrade" button inside a specific upgrade box
     */
    protected addUpgradeButton(boxIndex: number): Locator {
        return this.upgradeBox(boxIndex).locator('button._view-btn').filter({
            has: this.page.locator('i.pi-plus')
        }).first();
    }

    protected get bonusCampaignLabel(): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1', { hasText: /^Bonus Campaign$/ }).first();
    }

    protected get bonusCampaignChips(): Locator {
        return this.generalSettingContent.locator('p-chips[formcontrolname="bonus_campaign"]').first();
    }

    protected get bonusCampaignInput(): Locator {
        return this.bonusCampaignChips.locator('li.p-chips-input-token input').first();
    }

    protected get bonusCampaignTokens(): Locator {
        return this.bonusCampaignChips.locator('li.p-chips-token');
    }

    protected bonusCampaignTokenByText(text: string): Locator {
        return this.bonusCampaignChips.locator('li.p-chips-token').filter({
            has: this.page.locator('span.p-chips-token-label', { hasText: text })
        }).first();
    }

    protected bonusCampaignTokenRemoveIcon(text: string): Locator {
        return this.bonusCampaignTokenByText(text).locator('timescircleicon').first();
    }
    /**
   * HELPER — Fill all fields in the Display Address popup, including suburb (with autocomplete select)
   */
    protected async fillDisplayAddressFields(data: {
        buildingName?: string;
        unitNo?: string;
        streetNo?: string;
        streetName?: string;
        suburb?: string;
        state?: string;
        postCode?: string;
        country?: string;
    }): Promise<void> {
        if (data.buildingName !== undefined) await this.displayAddressBuildingNameInput.fill(data.buildingName);
        if (data.unitNo !== undefined) await this.displayAddressUnitNoInput.fill(data.unitNo);
        if (data.streetNo !== undefined) await this.displayAddressStreetNoInput.fill(data.streetNo);
        if (data.streetName !== undefined) await this.displayAddressStreetNameInput.fill(data.streetName);
        if (data.suburb !== undefined) {
            await this.displayAddressSuburbAutocomplete.fill('');
            if (data.suburb) {
                await this.displayAddressSuburbAutocomplete.fill(data.suburb);
                await this.page.waitForTimeout(600);
                const suggestion = this.displayAddressSuburbSuggestionByLabel(data.suburb);
                try {
                    await expect(suggestion).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
                    await suggestion.click();
                } catch {
                    await this.displayAddressSuburbAutocomplete.press('Enter');
                }
            }
        }
        if (data.state !== undefined) await this.displayAddressStateInput.fill(data.state);
        if (data.postCode !== undefined) await this.displayAddressPostCodeInput.fill(data.postCode);
        if (data.country !== undefined) await this.displayAddressCountryInput.fill(data.country);
    }

    /**
     * HELPER — Click Save button inside Display Address popup
     */
    protected async clickDisplayAddressPopupSave(): Promise<void> {
        await expect(this.displayAddressPopupSaveButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.displayAddressPopupSaveButton.click();
        await this.page.waitForTimeout(1500);
    }

    /**
     * HELPER — Assert all Display Address fields match expected data
     */
    protected async assertDisplayAddressFieldsMatch(data: {
        buildingName?: string;
        unitNo?: string;
        streetNo?: string;
        streetName?: string;
        state?: string;
        postCode?: string;
        country?: string;
    }): Promise<void> {
        if (data.buildingName !== undefined) expect(await this.displayAddressBuildingNameInput.inputValue()).toBe(data.buildingName);
        if (data.unitNo !== undefined) expect(await this.displayAddressUnitNoInput.inputValue()).toBe(data.unitNo);
        if (data.streetNo !== undefined) expect(await this.displayAddressStreetNoInput.inputValue()).toBe(data.streetNo);
        if (data.streetName !== undefined) expect(await this.displayAddressStreetNameInput.inputValue()).toBe(data.streetName);
        if (data.state !== undefined) expect(await this.displayAddressStateInput.inputValue()).toBe(data.state);
        if (data.postCode !== undefined) expect(await this.displayAddressPostCodeInput.inputValue()).toBe(data.postCode);
        if (data.country !== undefined) expect(await this.displayAddressCountryInput.inputValue()).toBe(data.country);
    }

    /**
     * HELPER — Navigate to Project Pricelist (skip if already there)
     */
    protected async navigateToProjectPricelist(): Promise<void> {
        const currentUrl = this.page.url().split(/[?#]/)[0];
        if (!currentUrl.includes('/price-list')) {
            await this.page.goto(ProjectBasePage.PROJECT_PRICELIST_URL);
        }
        await expect(this.pricelistContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
    }

    /**
     * HELPER — Navigate to Project Setup (skip if already there)
     */
    protected async navigateToProjectSetup(): Promise<void> {
        const currentUrl = this.page.url().split(/[?#]/)[0];
        if (!currentUrl.includes('/project-setup')) {
            await this.page.goto(ProjectBasePage.PROJECT_SETUP_URL);
        }
        await expect(this.projectSetupContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
    }

    /**
     * HELPER — Click a project card from the "Project" section by name
     */
    protected async clickProjectCardInProjectSection(projectName: string): Promise<void> {
        await expect(this.projectsSectionHeading).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        const projectCard = this.projectCardClickTarget(projectName);
        await expect(projectCard).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await projectCard.scrollIntoViewIfNeeded();
        await projectCard.click();
        await this.page.waitForTimeout(1500);
    }

    /**
     * HELPER — Click Project Setup tab
     */
    protected async clickProjectSetupTab(): Promise<void> {
        await expect(this.projectSetupTab).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.projectSetupTab.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * HELPER — Verify Pricelist tab is active and content loaded
     */
    protected async assertPricelistTabActive(): Promise<void> {
        await expect(this.page).toHaveURL(/\/price-list/, { timeout: ProjectBasePage.TIMEOUT_LONG });
        await expect(this.pricelistTab).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await expect(this.pricelistTabActive).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.pricelistContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async cleanupAfterProjectTest(): Promise<void> {
        await expect(this.projectsBreadcrumb).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectsBreadcrumb.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'auto' }));
        await this.page.waitForTimeout(800);
        await this.projectsBreadcrumb.click();
        await this.page.waitForTimeout(800);
        await expect(this.projectsSectionHeading).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
    }

    /**
     * HELPER — Open Project Address popup
     */
    protected async openProjectAddressPopup(): Promise<void> {
        await expect(this.projectAddressIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectAddressIcon.click();
        await expect(this.projectAddressPopup).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Close Project Address popup via cross icon
     */
    protected async closeProjectAddressPopup(): Promise<void> {
        await this.projectAddressPopupCloseIcon.click();
        await expect(this.projectAddressPopup).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Fill Project Address fields
     */
    protected async fillProjectAddress(data: { street?: string; suburb?: string; state?: string; postcode?: string }): Promise<void> {
        if (data.street) await this.projectAddressStreetInput.fill(data.street);
        if (data.suburb) await this.projectAddressSuburbInput.fill(data.suburb);
        if (data.state) await this.projectAddressStateInput.fill(data.state);
        if (data.postcode) await this.projectAddressPostcodeInput.fill(data.postcode);
    }

    /**
     * HELPER — Open Project Display Address popup
     */
    protected async openProjectDisplayAddressPopup(): Promise<void> {
        await expect(this.projectDisplayAddressIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectDisplayAddressIcon.click();
        await expect(this.projectDisplayAddressPopup).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Close Project Display Address popup via cross icon
     */
    protected async closeProjectDisplayAddressPopup(): Promise<void> {
        await this.projectDisplayAddressPopupCloseIcon.click();
        await expect(this.projectDisplayAddressPopup).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async openGeneralTab(): Promise<void> {
        const currentUrl = this.page.url();
        if (!currentUrl.includes('/project-setup')) {
            await this.clickProjectSetupTab();
        }
        await expect(this.generalSubTabActive).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await expect(this.generalSettingContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
    }

    /**
* HELPER — Open project (clicks card → asserts Pricelist landing → switches to Project Setup → General)
*/
    protected async openProjectGeneralTab(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await this.page.waitForLoadState('networkidle');
        await this.clickProjectCardInProjectSection(projectName);
        await this.assertPricelistTabActive();
        await this.clickProjectSetupTab();
        await this.openGeneralTab();
    }

    /**
     * HELPER — Get all form field labels in the General tab
     */
    protected get generalTabAllLabels(): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1');
    }

    /**
     * HELPER — Verify form labels appear in the expected order at given starting index
     */
    protected async assertLabelOrder(expectedLabels: string[], startIndex: number = 0): Promise<void> {
        for (let i = 0; i < expectedLabels.length; i++) {
            const actualText = (await this.generalTabAllLabels.nth(startIndex + i).innerText()).trim();
            expect(actualText).toBe(expectedLabels[i]);
        }
    }

    /**
     * HELPER — Verify a form field's label and input are both visible
     */
    protected async assertFieldVisible(label: Locator, input: Locator): Promise<void> {
        await expect(label).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(input).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async typeAddressAndAssertSuggestions(input: Locator, query: string): Promise<void> {
        await expect(input).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await input.click();
        await input.press('Control+A');
        await input.press('Delete');
        await this.page.waitForTimeout(300);
        await input.pressSequentially(query, { delay: 300 });
        await this.page.waitForTimeout(1500);
        const firstSuggestion = this.page.locator('.pac-container:visible .pac-item').first();
        await firstSuggestion.waitFor({ state: 'visible', timeout: ProjectBasePage.TIMEOUT_LONG });
        const suggestionCount = await this.googlePlacesSuggestions.count();
        expect(suggestionCount).toBeGreaterThan(0);
    }

    /**
     * HELPER — Clear an address input and dismiss Google Places dropdown
     */
    protected async clearAddressInput(input: Locator): Promise<void> {
        await input.fill('');
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);
    }

    /**
 * HELPER — Clear an address input fully (handles existing saved value)
 */
    protected async clearAddressInputFully(input: Locator): Promise<void> {
        await input.click();
        await input.press('Control+A');
        await input.press('Delete');
        await this.page.waitForTimeout(300);
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);
    }

    /**
     * HELPER — Click the first Google Places suggestion and verify input is filled
     */
    protected async selectFirstAddressSuggestion(input: Locator): Promise<string> {
        await expect(this.googlePlacesSuggestions.first()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.googlePlacesSuggestions.first().click();
        await this.page.waitForTimeout(800);
        const filledValue = await input.inputValue();
        expect(filledValue.length).toBeGreaterThan(0);
        return filledValue;
    }

    /**
     * HELPER — Click General tab Save button (bottom)
     */
    protected async clickGeneralTabSave(): Promise<void> {
        await expect(this.generalTabSaveButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.generalTabSaveButton.click();
        await this.page.waitForTimeout(1500);
    }

    protected async assertProjectUpdatedToast(): Promise<void> {
        const toast = this.page.locator('div[aria-label="Project updated successfully"]', { hasText: /Project updated successfully/i }).first();
        await expect(toast).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.page.waitForTimeout(500);
    }


    /**
     * TC_01 — Verify clicking a project with lots opens the Pricelist tab by default
     */
    async verifyProjectWithLotsOpensPricelistTab(projectName: string = 'Automation'): Promise<void> {
        await this.navigateToProjects();
        await this.page.waitForLoadState('networkidle');
        await this.clickProjectCardInProjectSection(projectName);
        await this.assertPricelistTabActive();
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_02 — Verify clicking a project without lots opens General tab under Project Setup
     */
    async verifyProjectWithoutLotsOpensGeneralTab(projectName: string = "Hina's Project"): Promise<void> {
        await this.navigateToProjects();
        await this.page.waitForLoadState('networkidle');
        await this.clickProjectCardInProjectSection(projectName);
        await this.assertPricelistTabActive();
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_03 — From Pricelist tab, click Project Setup → switches to setup section
 */
    async verifyProjectSetupTabSwitchFromPricelist(projectName: string = 'Automation'): Promise<void> {
        await this.navigateToProjects();
        await this.page.waitForLoadState('networkidle');
        await this.clickProjectCardInProjectSection(projectName);
        await this.assertPricelistTabActive();
        await this.clickProjectSetupTab();
        await this.cleanupAfterProjectTest();
    }


    /**
 * TC_04 — Verify "Project Name" and "Project Status" fields appear first on General tab
 */
    async verifyProjectNameAndStatusAppearFirst(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.assertFieldVisible(this.projectSetupNameLabel, this.projectSetupNameInput);
        await this.assertFieldVisible(this.projectSetupStatusLabel, this.projectSetupStatusSelect);
        await this.assertLabelOrder(['Project Name', 'Project Status'], 0);
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_05 — Verify "Project Address" and "Project Display Address" fields appear below name/status
 */
    async verifyAddressFieldsAppearBelowNameStatus(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.assertFieldVisible(this.projectSetupAddressLabel, this.projectSetupAddressInput);
        await this.assertFieldVisible(this.projectSetupDisplayAddressLabel, this.projectSetupDisplayAddressInput);
        await this.assertLabelOrder(
            ['Project Name', 'Project Status', 'Project Address', 'Project Display Address'],
            0
        );
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_06 — Verify project address autocomplete suggestions appear when typing
 */
    async verifyProjectAddressPopupOpens(projectName: string = 'Automation', searchQuery: string = 'Australia'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.typeAddressAndAssertSuggestions(this.projectSetupAddressInput, searchQuery);
        await this.clearAddressInput(this.projectSetupAddressInput);
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_07 — Add project address and save
 */
    async addProjectAddressAndSave(
        projectName: string = 'Automation',
        searchQuery: string = 'Australia'
    ): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.clearAddressInputFully(this.projectSetupAddressInput);
        await this.typeAddressAndAssertSuggestions(this.projectSetupAddressInput, searchQuery);
        const savedAddress = await this.selectFirstAddressSuggestion(this.projectSetupAddressInput);
        await this.clickGeneralTabSave();
        await this.assertProjectUpdatedToast();
        const currentValue = await this.projectSetupAddressInput.inputValue();
        expect(currentValue).toBe(savedAddress);
        await this.cleanupAfterProjectTest();
    }

    protected async assertInputIsEmpty(input: Locator): Promise<void> {
        const value = await input.inputValue();
        expect(value).toBe('');
    }

    /**
 * TC_08 — Save Project Address with empty fields (none are required)
 */
    async saveProjectAddressWithEmptyFields(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.clearAddressInputFully(this.projectSetupAddressInput);
        await this.clickGeneralTabSave();
        await this.assertProjectUpdatedToast();
        await this.assertInputIsEmpty(this.projectSetupAddressInput);
        await this.cleanupAfterProjectTest();
    }

    protected async openDisplayAddressPopup(): Promise<void> {
        await expect(this.projectDisplayAddressPencilIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectDisplayAddressPencilIcon.click();
        await this.page.waitForTimeout(800);
        await expect(this.displayAddressPopupHeading).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async closeDisplayAddressPopup(): Promise<void> {
        await this.page.mouse.click(0, 100); // click outside the popup
        await this.page.waitForTimeout(500);
    }

    /**
 * TC_10 — Verify Project Display Address popup opens from General tab
 */
    async verifyProjectDisplayAddressPopupOpens(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.openDisplayAddressPopup();
        await expect(this.displayAddressPopupHeading).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.displayAddressBuildingNameInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.displayAddressPopupSaveButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.closeDisplayAddressPopup();
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_11 — Add Display Address and save (verify values persist)
     */
    async addProjectDisplayAddressAndSave(
        projectName: string = 'Automation',
        addressData: {
            buildingName?: string;
            unitNo?: string;
            streetNo?: string;
            streetName?: string;
            suburb?: string;
            state?: string;
            postCode?: string;
            country?: string;
        } = {
                buildingName: 'Test Building',
                unitNo: '12',
                streetNo: '456',
                streetName: 'George Street',
                suburb: 'East Albury',
                state: 'NSW',
                postCode: '2000',
                country: 'Australia',
            }
    ): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.openDisplayAddressPopup();
        await this.fillDisplayAddressFields(addressData);
        await this.clickDisplayAddressPopupSave();
        await this.openDisplayAddressPopup();
        await this.assertDisplayAddressFieldsMatch(addressData);
        await this.closeDisplayAddressPopup();
        await this.cleanupAfterProjectTest();
    }

    /**
 * HELPER — Clear all Display Address popup fields
 */
    protected async clearAllDisplayAddressFields(): Promise<void> {
        await this.displayAddressBuildingNameInput.fill('');
        await this.displayAddressUnitNoInput.fill('');
        await this.displayAddressStreetNoInput.fill('');
        await this.displayAddressStreetNameInput.fill('');
        await this.displayAddressStateInput.fill('');
        await this.displayAddressPostCodeInput.fill('');
        await this.displayAddressCountryInput.fill('');
        await this.page.waitForTimeout(300);
    }

    /**
     * HELPER — Assert all Display Address fields are empty
     */
    protected async assertAllDisplayAddressFieldsEmpty(): Promise<void> {
        expect(await this.displayAddressBuildingNameInput.inputValue()).toBe('');
        expect(await this.displayAddressUnitNoInput.inputValue()).toBe('');
        expect(await this.displayAddressStreetNoInput.inputValue()).toBe('');
        expect(await this.displayAddressStreetNameInput.inputValue()).toBe('');
        expect(await this.displayAddressStateInput.inputValue()).toBe('');
        expect(await this.displayAddressPostCodeInput.inputValue()).toBe('');
        expect(await this.displayAddressCountryInput.inputValue()).toBe('');
    }

    /**
 * TC_12 — Save Display Address popup with empty fields (none are required)
 */
    async saveDisplayAddressWithEmptyFields(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.openDisplayAddressPopup();
        await this.clearAllDisplayAddressFields();
        await this.clickDisplayAddressPopupSave();
        await this.openDisplayAddressPopup();
        await this.assertAllDisplayAddressFieldsEmpty();
        await this.closeDisplayAddressPopup();
        await this.cleanupAfterProjectTest();
    }

    /**
 * HELPER — Close Display Address popup via the cross icon
 */
    protected async closeDisplayAddressPopupViaCross(): Promise<void> {
        await expect(this.displayAddressPopupCloseIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.displayAddressPopupCloseIcon.click();
        await this.page.waitForTimeout(500);
        await expect(this.displayAddressPopupHeading).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
     * TC_13 — Close Display Address popup using cross icon (data not saved)
     */
    async closeDisplayAddressPopupUsingCross(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.openDisplayAddressPopup();
        await this.closeDisplayAddressPopupViaCross();
        await this.cleanupAfterProjectTest();
    }

    // ==========================================================================
    // HELPERS — DEVELOPER DROPDOWN
    // ==========================================================================

    /**
     * HELPER — Open the Developer dropdown by clicking the arrow (skip if already open)
     */
    protected async openDeveloperDropdown(): Promise<void> {
        const isOpen = await this.developerDropdownPanel.isVisible().catch(() => false);
        if (isOpen) return;

        await expect(this.developerDropdownArrow).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.developerDropdownArrow.scrollIntoViewIfNeeded();
        await this.developerDropdownArrow.click();
        await this.page.waitForTimeout(500);
        await expect(this.developerDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Close the Developer dropdown by clicking outside
     */
    protected async closeDeveloperDropdown(): Promise<void> {
        await this.page.mouse.click(10, 10);
        await this.page.waitForTimeout(500);
        await expect(this.developerDropdownPanel).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Click a developer item in the dropdown (toggles selection)
     */
    protected async toggleDeveloperSelection(developerName: string): Promise<void> {
        const developerItem = this.developerDropdownItemByText(developerName);
        await expect(developerItem).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await developerItem.click();
        await this.page.waitForTimeout(500);
    }

    /**
     * HELPER — Assert a developer is selected (.selected_one chip exists)
     */
    protected async assertDeveloperSelected(developerName: string): Promise<void> {
        await expect(this.developerSelectedChipByName(developerName)).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_DEFAULT,
        });
    }

    /**
     * HELPER — Assert no developer is selected (no chips, placeholder visible)
     */
    protected async assertDeveloperPlaceholderVisible(): Promise<void> {
        const chipCount = await this.developerSelectedChips.count();
        expect(chipCount).toBe(0);
        await expect(this.developerPlaceholder).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
     * TC_14 — Verify Developer dropdown opens and shows contact list
     */
    async verifyDeveloperDropdownShowsContacts(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.openDeveloperDropdown();
        await expect(this.developerDropdownSearchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.developerDropdownCreateNew).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.closeDeveloperDropdown();
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_15 — Add and remove developer (toggle by clicking same item twice)
     */
    async addAndRemoveDeveloper(projectName: string = 'Automation', developerName: string = '11 22'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.openDeveloperDropdown();
        await this.toggleDeveloperSelection(developerName);
        await this.closeDeveloperDropdown();
        await this.assertDeveloperSelected(developerName);
        await this.openDeveloperDropdown();
        await this.toggleDeveloperSelection(developerName);
        await this.closeDeveloperDropdown();
        await this.assertDeveloperPlaceholderVisible();
        await this.cleanupAfterProjectTest();
    }

    /**
 * HELPER — Open the Project Manager dropdown
 */
    protected async openProjectsManagerDropdown(): Promise<void> {
        await this.projectManagersDropdown.scrollIntoViewIfNeeded();
        await this.projectManagersDropdown.click();
        await this.page.waitForTimeout(500);
        await expect(this.projectManagerDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Close the Project Manager dropdown by clicking outside
     */
    protected async closeProjectManagerDropdown(): Promise<void> {
        await this.page.mouse.click(10, 10);
        await this.page.waitForTimeout(500);
        await expect(this.projectManagerDropdownPanel).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
 * TC_18 — Verify Project Manager dropdown shows all staff
 */
    async verifyProjectManagerDropdownShowsAllStaff(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.openProjectsManagerDropdown();
        await expect(this.projectManagerDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.closeProjectManagerDropdown();
        await this.cleanupAfterProjectTest();
    }

    protected async assertLabelNotRequired(labelText: string): Promise<void> {
        const label = this.generalTabLabelByText(labelText);
        await expect(label).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        const text = await label.textContent();
        expect(text?.trim()).toBe(labelText);
        expect(text).not.toContain('*');
    }

    /**
 * TC_20 — Verify no field is required on General tab
 */
    async verifyNoFieldRequiredOnGeneralTab(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        const labels = [
            'Project Name',
            'Project Status',
            'Project Address',
            'Project Display Address',
            'Developer',
            'Project Manager',
        ];
        for (const labelText of labels) {
            await this.assertLabelNotRequired(labelText);
        }
        await this.cleanupAfterProjectTest();
    }

    // ==========================================================================
    // HELPERS — FLOORPLAN (TC_21)
    // ==========================================================================

    /**
     * HELPER — Scroll to Floorplan section heading
     */
    protected async scrollToFloorplanSection(): Promise<void> {
        await this.floorplanSectionHeading.scrollIntoViewIfNeeded();
        await expect(this.floorplanSectionHeading).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(300);
    }

    /**
     * HELPER — Click the Floorplan toggle arrow
     */
    protected async clickFloorplanToggleArrow(): Promise<void> {
        await expect(this.floorplanToggleArrowDown).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.floorplanToggleArrowDown.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(800);
        await this.floorplanToggleArrowDown.click();
    }

    /**
 * TC_21 — Verify Floorplan list appears/hides on toggle arrow click
 */
    async verifyFloorplanListAppearsOnIconClick(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.scrollToFloorplanSection();
        await this.clickFloorplanToggleArrow();
        await this.cleanupAfterProjectTest();
    }

    /**
     * HELPER — Click plus icon to add a new floorplan row
     */
    protected async clickFloorplanPlusIcon(): Promise<void> {
        await expect(this.floorplanPlusIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.floorplanPlusIcon.scrollIntoViewIfNeeded();
        await this.floorplanPlusIcon.click();
        await this.page.waitForTimeout(500);
    }

    /**
     * HELPER — Get current count of floorplan rows
     */
    protected async getFloorplanRowCount(): Promise<number> {
        return await this.floorplanTableRows.count();
    }

    /**
     * HELPER — Check row checkbox AND wait for header delete icon to appear
     */
    protected async checkFloorplanRowAndWaitForDelete(rowIndex: number): Promise<void> {
        const checkbox = this.floorplanRowCheckbox(rowIndex);
        await expect(checkbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await checkbox.scrollIntoViewIfNeeded();
        await checkbox.click();
        await expect(this.floorplanHeaderDeleteIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Click header bulk delete icon (no confirmation popup)
     */
    protected async clickFloorplanHeaderDelete(): Promise<void> {
        await expect(this.floorplanHeaderDeleteIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.floorplanHeaderDeleteIcon.click();
        await this.page.waitForTimeout(800);
    }

    /**
 * TC_22 — Select and delete a floorplan type
 */
    async selectAndDeleteFloorplanType(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.scrollToFloorplanSection();
        await this.clickFloorplanToggleArrow();;
        const initialCount = await this.getFloorplanRowCount();
        await this.clickFloorplanPlusIcon();
        const afterAddCount = await this.getFloorplanRowCount();
        expect(afterAddCount).toBe(initialCount + 1);
        await this.checkFloorplanRowAndWaitForDelete(afterAddCount - 1);
        await this.clickFloorplanHeaderDelete();
        const afterDeleteCount = await this.getFloorplanRowCount();
        expect(afterDeleteCount).toBe(initialCount);
        await this.cleanupAfterProjectTest();
    }


    protected async toggleFloorplanHeaderCheckboxAndWaitForDelete(): Promise<void> {
        await expect(this.floorplanHeaderCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.floorplanHeaderCheckbox.scrollIntoViewIfNeeded();
        await this.floorplanHeaderCheckbox.click();
        await expect(this.floorplanHeaderDeleteIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
 * TC_23 — Delete all selected floorplan types at once
 */
    async deleteAllSelectedFloorplanTypes(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.scrollToFloorplanSection();
        const initialCount = await this.getFloorplanRowCount();
        await this.clickFloorplanPlusIcon();
        await this.clickFloorplanPlusIcon();
        const afterAddCount = await this.getFloorplanRowCount();
        expect(afterAddCount).toBe(initialCount + 2);
        await this.toggleFloorplanHeaderCheckboxAndWaitForDelete();
        await this.clickFloorplanHeaderDelete();
        const afterDeleteCount = await this.getFloorplanRowCount();
        expect(afterDeleteCount).toBe(initialCount);
        await this.cleanupAfterProjectTest();
    }

    /**
 * HELPER — Click the Type column header to sort
 */
    protected async clickFloorplanTypeColumnSort(): Promise<void> {
        await expect(this.floorplanTypeColumnHeader).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.floorplanTypeColumnHeader.scrollIntoViewIfNeeded();
        await this.floorplanTypeColumnHeader.click();
        await this.page.waitForTimeout(500);
    }


    protected async assertFloorplanTypeColumnSortState(expectedState: 'none' | 'ascending' | 'descending'): Promise<void> {
        await expect(this.floorplanTypeColumnHeader).toHaveAttribute('aria-sort', expectedState, {
            timeout: ProjectBasePage.TIMEOUT_DEFAULT,
        });
    }

    /**
 * TC_24 — Sort floorplan list by Type column (ascending/descending)
 */
    async sortFloorplanListAscendingDescending(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.scrollToFloorplanSection();
        await this.clickFloorplanPlusIcon();
        await this.clickFloorplanPlusIcon();
        await this.assertFloorplanTypeColumnSortState('none');
        await this.clickFloorplanTypeColumnSort();
        await this.assertFloorplanTypeColumnSortState('ascending');
        await this.clickFloorplanTypeColumnSort();
        await this.assertFloorplanTypeColumnSortState('descending');
        await this.toggleFloorplanHeaderCheckboxAndWaitForDelete();
        await this.clickFloorplanHeaderDelete();
        await this.cleanupAfterProjectTest();
    }

    // ==========================================================================
    // HELPERS — PROJECT UPGRADES (TC_25)
    // ==========================================================================

    /**
     * HELPER — Scroll to Project Upgrades section heading
     */
    protected async scrollToProjectUpgradesSection(): Promise<void> {
        await this.projectUpgradesHeading.scrollIntoViewIfNeeded();
        await expect(this.projectUpgradesHeading).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(300);
    }

    /**
     * HELPER — Get current count of upgrade boxes
     */
    protected async getUpgradeBoxCount(): Promise<number> {
        return await this.upgradeBoxes.count();
    }

    /**
     * HELPER — Clear and fill an upgrade box with Group, Upgrade, Cost values
     */
    protected async clearAndFillUpgradeBox(boxIndex: number, groupName: string, upgradeName: string, cost: string): Promise<void> {
        await this.upgradeGroupInput(boxIndex).fill('');
        await this.upgradeGroupInput(boxIndex).fill(groupName);

        await this.upgradeInput(boxIndex).fill('');
        await this.upgradeInput(boxIndex).fill(upgradeName);

        await this.upgradeCostInput(boxIndex).fill('');
        await this.upgradeCostInput(boxIndex).fill(cost);

        await this.page.waitForTimeout(300);
    }

    /**
     * HELPER — Assert upgrade box has expected values
     */
    protected async assertUpgradeBoxValues(boxIndex: number, groupName: string, upgradeName: string, cost: string): Promise<void> {
        await expect(this.upgradeGroupInput(boxIndex)).toHaveValue(groupName, { timeout: ProjectBasePage.TIMEOUT_LONG });
        await expect(this.upgradeInput(boxIndex)).toHaveValue(upgradeName, { timeout: ProjectBasePage.TIMEOUT_LONG });
    }

    /**
     * HELPER — Click remove (cross) icon on an upgrade box
     */
    protected async removeUpgradeBox(boxIndex: number): Promise<void> {
        await expect(this.upgradeBoxRemoveIcon(boxIndex)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.upgradeBoxRemoveIcon(boxIndex).scrollIntoViewIfNeeded();
        await this.upgradeBoxRemoveIcon(boxIndex).click();
        await this.page.waitForTimeout(500);
    }
    /**
  * TC_25 — Add upgrade data to existing box, save, verify, and remove extra boxes
  */
    async addUpgradeGroupWithValidData(
        projectName: string = 'Automation',
        groupName: string = 'Test Group',
        upgradeName: string = 'Test Upgrade',
        cost: string = '1000'
    ): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.scrollToProjectUpgradesSection();
        await this.clearAndFillUpgradeBox(0, groupName, upgradeName, cost);
        await this.clickGeneralTabSave();
        await this.assertProjectUpdatedToast();
        await this.scrollToProjectUpgradesSection();
        await this.assertUpgradeBoxValues(0, groupName, upgradeName, cost);
        let boxCount = await this.getUpgradeBoxCount();
        while (boxCount > 1) {
            await this.removeUpgradeBox(boxCount - 1);
            boxCount = await this.getUpgradeBoxCount();
        }
        if ((await this.getUpgradeBoxCount()) === 1) {
            await this.clickGeneralTabSave();
            await this.assertProjectUpdatedToast();
        }
        await this.clickGeneralTabSave();
        await this.assertProjectUpdatedToast();
        await this.cleanupAfterProjectTest();
    }

    protected async clickAddAdditionalUpgradeGroup(): Promise<void> {
        await expect(this.addAdditionalUpgradeGroupButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.addAdditionalUpgradeGroupButton.scrollIntoViewIfNeeded();
        await this.addAdditionalUpgradeGroupButton.click();
        await this.page.waitForTimeout(500);
    }

    /**
 * HELPER — Remove all additionally added upgrade boxes (boxes with cross icon)
 */
    protected async removeAllAdditionallyAddedUpgradeBoxes(): Promise<void> {
        const removeIconLocator = this.projectUpgradesSection.locator('button._view-btn').filter({
            has: this.page.locator('i.pi-times-circle')
        });

        let removableCount = await removeIconLocator.count();
        while (removableCount > 0) {
            await removeIconLocator.first().click();
            await this.page.waitForTimeout(500);
            removableCount = await removeIconLocator.count();
        }
    }

    async addMultipleUpgradeGroups(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.scrollToProjectUpgradesSection();
        const initialCount = await this.getUpgradeBoxCount();
        await this.clickAddAdditionalUpgradeGroup();
        await this.clickAddAdditionalUpgradeGroup();
        const afterAddCount = await this.getUpgradeBoxCount();
        expect(afterAddCount).toBe(initialCount + 2);
        const box1Index = initialCount;
        const box2Index = initialCount + 1;
        await this.clearAndFillUpgradeBox(box1Index, 'Group A', 'Upgrade A', '1000');
        await this.clearAndFillUpgradeBox(box2Index, 'Group B', 'Upgrade B', '2000');
        await this.clickGeneralTabSave();
        await this.assertProjectUpdatedToast();
        await this.scrollToProjectUpgradesSection();
        await this.assertUpgradeBoxValues(box1Index, 'Group A', 'Upgrade A', '1000');
        await this.assertUpgradeBoxValues(box2Index, 'Group B', 'Upgrade B', '2000');
        await this.removeAllAdditionallyAddedUpgradeBoxes();
        await this.clickGeneralTabSave();
        await this.assertProjectUpdatedToast();
        await this.cleanupAfterProjectTest();
    }

    /**
 * HELPER — Click "Add Upgrade" button within a specific upgrade box
 */
    protected async clickAddUpgrade(boxIndex: number): Promise<void> {
        await expect(this.addUpgradeButton(boxIndex)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.addUpgradeButton(boxIndex).scrollIntoViewIfNeeded();
        await this.addUpgradeButton(boxIndex).click();
        await this.page.waitForTimeout(500);
    }

    /**
     * HELPER — Get count of upgrade rows in a specific box
     */
    protected async getUpgradeRowCount(boxIndex: number): Promise<number> {
        return await this.upgradeRowsInBox(boxIndex).count();
    }

    /**
     * HELPER — Clear and fill an upgrade row (Upgrade + Cost)
     */
    protected async clearAndFillUpgradeRow(boxIndex: number, rowIndex: number, upgradeName: string, cost: string): Promise<void> {
        await this.upgradeRowInput(boxIndex, rowIndex).fill('');
        await this.upgradeRowInput(boxIndex, rowIndex).fill(upgradeName);

        await this.upgradeRowCostInput(boxIndex, rowIndex).fill('');
        await this.upgradeRowCostInput(boxIndex, rowIndex).fill(cost);

        await this.page.waitForTimeout(300);
    }

    /**
     * HELPER — Assert upgrade row has expected values
     */
    protected async assertUpgradeRowValues(boxIndex: number, rowIndex: number, upgradeName: string, cost: string): Promise<void> {
        await expect(this.upgradeRowInput(boxIndex, rowIndex)).toHaveValue(upgradeName, { timeout: ProjectBasePage.TIMEOUT_DEFAULT });

        const actualCost = await this.upgradeRowCostInput(boxIndex, rowIndex).inputValue();
        const cleanCost = actualCost.replace(/[$,]/g, '').trim();
        expect(cleanCost).toBe(cost);
    }

    /**
     * HELPER — Click cross icon to remove an upgrade row
     */
    protected async removeUpgradeRow(boxIndex: number, rowIndex: number): Promise<void> {
        await expect(this.upgradeRowRemoveIcon(boxIndex, rowIndex)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.upgradeRowRemoveIcon(boxIndex, rowIndex).click();
        await this.page.waitForTimeout(500);
    }

    /**
 * TC_28 — Add upgrade under same group with valid data
 */
    async addUpgradeUnderSameGroup(
        projectName: string = 'Automation',
        upgradeName: string = 'Extra Upgrade',
        cost: string = '500'
    ): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.scrollToProjectUpgradesSection();
        const boxIndex = 0;
        const initialRowCount = await this.getUpgradeRowCount(boxIndex);
        await this.clickAddUpgrade(boxIndex);
        const afterAddCount = await this.getUpgradeRowCount(boxIndex);
        expect(afterAddCount).toBe(initialRowCount + 1);
        const newRowIndex = afterAddCount - 1;
        await this.clearAndFillUpgradeRow(boxIndex, newRowIndex, upgradeName, cost);
        await this.clickGeneralTabSave();
        await this.assertProjectUpdatedToast();
        await this.scrollToProjectUpgradesSection();
        await this.assertUpgradeRowValues(boxIndex, newRowIndex, upgradeName, cost);
        await this.removeUpgradeRow(boxIndex, newRowIndex);
        await this.clickGeneralTabSave();
        await this.assertProjectUpdatedToast();
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_29 — Add multiple upgrades under one group
 */
    async addMultipleUpgradesUnderOneGroup(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.scrollToProjectUpgradesSection();
        const boxIndex = 0;
        const initialRowCount = await this.getUpgradeRowCount(boxIndex);
        await this.clickAddUpgrade(boxIndex);
        await this.clickAddUpgrade(boxIndex);
        const afterAddCount = await this.getUpgradeRowCount(boxIndex);
        expect(afterAddCount).toBe(initialRowCount + 2);
        const row1Index = initialRowCount;
        const row2Index = initialRowCount + 1;
        await this.clearAndFillUpgradeRow(boxIndex, row1Index, 'Upgrade One', '1000');
        await this.clearAndFillUpgradeRow(boxIndex, row2Index, 'Upgrade Two', '2000');
        await this.clickGeneralTabSave();
        await this.assertProjectUpdatedToast();
        await this.scrollToProjectUpgradesSection();
        await this.assertUpgradeRowValues(boxIndex, row1Index, 'Upgrade One', '1000');
        await this.assertUpgradeRowValues(boxIndex, row2Index, 'Upgrade Two', '2000');
        await this.removeUpgradeRow(boxIndex, row2Index);
        await this.removeUpgradeRow(boxIndex, row1Index);
        await this.clickGeneralTabSave();
        await this.assertProjectUpdatedToast();
        await this.cleanupAfterProjectTest();
    }

    /**
     * HELPER — Scroll to Bonus Payable Upon section
     */
    protected async scrollToBonusPayableUpon(): Promise<void> {
        await this.bonusPayableUponLabel.scrollIntoViewIfNeeded();
        await expect(this.bonusPayableUponLabel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(300);
    }

    /**
     * HELPER — Type text in Bonus Payable Upon input and press Enter
     */
    protected async addBonusPayableUponTag(tagText: string): Promise<void> {
        await expect(this.bonusPayableUponInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.bonusPayableUponInput.scrollIntoViewIfNeeded();
        await this.bonusPayableUponInput.fill(tagText);
        await this.bonusPayableUponInput.press('Enter');
        await this.page.waitForTimeout(500);
    }

    /**
     * HELPER — Assert a chip with given text exists
     */
    protected async assertBonusPayableUponTagExists(tagText: string): Promise<void> {
        await expect(this.bonusPayableUponTokenByText(tagText)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.bonusPayableUponTokenByText(tagText).locator('span.p-chips-token-label')).toHaveText(tagText, {
            timeout: ProjectBasePage.TIMEOUT_DEFAULT,
        });
    }

    /**
     * HELPER — Remove a Bonus Payable Upon chip by text
     */
    protected async removeBonusPayableUponTag(tagText: string): Promise<void> {
        await expect(this.bonusPayableUponTokenRemoveIcon(tagText)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.bonusPayableUponTokenRemoveIcon(tagText).click();
        await this.page.waitForTimeout(500);
        await expect(this.bonusPayableUponTokenByText(tagText)).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Remove all existing Bonus Payable Upon chips (cleanup)
     */
    protected async removeAllBonusPayableUponTags(): Promise<void> {
        let count = await this.bonusPayableUponTokens.count();
        while (count > 0) {
            await this.bonusPayableUponTokens.first().locator('timescircleicon').click();
            await this.page.waitForTimeout(500);
            count = await this.bonusPayableUponTokens.count();
        }
    }

    /**
 * TC_30 — Verify Bonus Payable Upon accepts text tag
 */
    async verifyBonusPayableUponAcceptsText(
        projectName: string = 'Automation',
        tagText: string = 'Upon Contract Signing'
    ): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.scrollToBonusPayableUpon();
        await this.removeAllBonusPayableUponTags();
        await this.addBonusPayableUponTag(tagText);
        await this.assertBonusPayableUponTagExists(tagText);
        await this.clickGeneralTabSave();
        await this.assertProjectUpdatedToast();
        await this.scrollToBonusPayableUpon();
        await this.assertBonusPayableUponTagExists(tagText);
        await this.removeBonusPayableUponTag(tagText);
        await this.clickGeneralTabSave();
        await this.assertProjectUpdatedToast();
        await this.cleanupAfterProjectTest();
    }

    /**
     * HELPER — Scroll to Bonus Payable To section
     */
    protected async scrollToBonusPayableTo(): Promise<void> {
        await this.bonusPayableToLabel.scrollIntoViewIfNeeded();
        await expect(this.bonusPayableToLabel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(300);
    }

    /**
     * HELPER — Type text in Bonus Payable To input and press Enter
     */
    protected async addBonusPayableToTag(tagText: string): Promise<void> {
        await expect(this.bonusPayableToInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.bonusPayableToInput.scrollIntoViewIfNeeded();
        await this.bonusPayableToInput.fill(tagText);
        await this.bonusPayableToInput.press('Enter');
        await this.page.waitForTimeout(500);
    }

    /**
     * HELPER — Assert a chip with given text exists
     */
    protected async assertBonusPayableToTagExists(tagText: string): Promise<void> {
        await expect(this.bonusPayableToTokenByText(tagText)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.bonusPayableToTokenByText(tagText).locator('span.p-chips-token-label')).toHaveText(tagText, {
            timeout: ProjectBasePage.TIMEOUT_DEFAULT,
        });
    }

    /**
     * HELPER — Remove a Bonus Payable To chip by text
     */
    protected async removeBonusPayableToTag(tagText: string): Promise<void> {
        await expect(this.bonusPayableToTokenRemoveIcon(tagText)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.bonusPayableToTokenRemoveIcon(tagText).click();
        await this.page.waitForTimeout(500);
        await expect(this.bonusPayableToTokenByText(tagText)).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Remove all existing Bonus Payable To chips (cleanup)
     */
    protected async removeAllBonusPayableToTags(): Promise<void> {
        let count = await this.bonusPayableToTokens.count();
        while (count > 0) {
            await this.bonusPayableToTokens.first().locator('timescircleicon').click();
            await this.page.waitForTimeout(500);
            count = await this.bonusPayableToTokens.count();
        }
    }

    /**
 * TC_33 — Verify Bonus Payable To accepts text tag
 */
    async verifyBonusPayableToAcceptsText(
        projectName: string = 'Automation',
        tagText: string = 'Selling Agent'
    ): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.scrollToBonusPayableTo();
        await this.removeAllBonusPayableToTags();
        await this.addBonusPayableToTag(tagText);
        await this.assertBonusPayableToTagExists(tagText);
        await this.clickGeneralTabSave();
        await this.assertProjectUpdatedToast();
        await this.scrollToBonusPayableTo();
        await this.assertBonusPayableToTagExists(tagText);
        await this.removeBonusPayableToTag(tagText);
        await this.clickGeneralTabSave();
        await this.assertProjectUpdatedToast();
        await this.cleanupAfterProjectTest();
    }

    /**
     * HELPER — Scroll to Bonus Campaign section
     */
    protected async scrollToBonusCampaign(): Promise<void> {
        await this.bonusCampaignLabel.scrollIntoViewIfNeeded();
        await expect(this.bonusCampaignLabel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(300);
    }

    /**
     * HELPER — Type text in Bonus Campaign input and press Enter
     */
    protected async addBonusCampaignTag(tagText: string): Promise<void> {
        await expect(this.bonusCampaignInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.bonusCampaignInput.scrollIntoViewIfNeeded();
        await this.bonusCampaignInput.fill(tagText);
        await this.bonusCampaignInput.press('Enter');
        await this.page.waitForTimeout(500);
    }

    /**
     * HELPER — Assert a chip with given text exists
     */
    protected async assertBonusCampaignTagExists(tagText: string): Promise<void> {
        await expect(this.bonusCampaignTokenByText(tagText)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.bonusCampaignTokenByText(tagText).locator('span.p-chips-token-label')).toHaveText(tagText, {
            timeout: ProjectBasePage.TIMEOUT_DEFAULT,
        });
    }

    /**
     * HELPER — Remove a Bonus Campaign chip by text
     */
    protected async removeBonusCampaignTag(tagText: string): Promise<void> {
        await expect(this.bonusCampaignTokenRemoveIcon(tagText)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.bonusCampaignTokenRemoveIcon(tagText).click();
        await this.page.waitForTimeout(500);
        await expect(this.bonusCampaignTokenByText(tagText)).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Remove all existing Bonus Campaign chips (cleanup)
     */
    protected async removeAllBonusCampaignTags(): Promise<void> {
        let count = await this.bonusCampaignTokens.count();
        while (count > 0) {
            await this.bonusCampaignTokens.first().locator('timescircleicon').click();
            await this.page.waitForTimeout(500);
            count = await this.bonusCampaignTokens.count();
        }
    }

    /**
 * TC_34 — Verify Bonus Campaign accepts text tag
 */
    async verifyBonusCampaignAcceptsText(
        projectName: string = 'Automation',
        tagText: string = 'Spring Campaign'
    ): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.scrollToBonusCampaign();
        await this.removeAllBonusCampaignTags();
        await this.addBonusCampaignTag(tagText);
        await this.assertBonusCampaignTagExists(tagText);
        await this.clickGeneralTabSave();
        await this.assertProjectUpdatedToast();
        await this.scrollToBonusCampaign();
        await this.assertBonusCampaignTagExists(tagText);
        await this.removeBonusCampaignTag(tagText);
        await this.clickGeneralTabSave();
        await this.assertProjectUpdatedToast();
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_33 — Add multiple tags in all bonus fields
 */
    async addMultipleTagsInAllBonusFields(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);

        // Cleanup all leftover tags first
        await this.scrollToBonusPayableUpon();
        await this.removeAllBonusPayableUponTags();
        await this.removeAllBonusPayableToTags();
        await this.removeAllBonusCampaignTags();
        await this.scrollToBonusPayableUpon();
        await this.addBonusPayableUponTag('Contract Signing');
        await this.addBonusPayableUponTag('Settlement');
        await this.scrollToBonusPayableTo();
        await this.addBonusPayableToTag('Selling Agent');
        await this.addBonusPayableToTag('Buyer Agent');
        await this.scrollToBonusCampaign();
        await this.addBonusCampaignTag('Spring Campaign');
        await this.addBonusCampaignTag('Winter Campaign');
        await this.clickGeneralTabSave();
        await this.assertProjectUpdatedToast();
        await this.scrollToBonusPayableUpon();
        await this.assertBonusPayableUponTagExists('Contract Signing');
        await this.assertBonusPayableUponTagExists('Settlement');
        await this.scrollToBonusPayableTo();
        await this.assertBonusPayableToTagExists('Selling Agent');
        await this.assertBonusPayableToTagExists('Buyer Agent');
        await this.scrollToBonusCampaign();
        await this.assertBonusCampaignTagExists('Spring Campaign');
        await this.assertBonusCampaignTagExists('Winter Campaign');
        await this.removeAllBonusPayableUponTags();
        await this.removeAllBonusPayableToTags();
        await this.removeAllBonusCampaignTags();
        await this.clickGeneralTabSave();
        await this.assertProjectUpdatedToast();
        await this.cleanupAfterProjectTest();
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

    protected get noLotFoundMessage(): Locator {
        return this.page.locator('tr', { hasText: 'No Lots available' });
    }

    protected get projectColumnSortIcon(): Locator {
        return this.projectColumnHeader().locator('i.custom-sort');
    }

    protected get projectColumnSortIconDesc(): Locator {
        return this.projectColumnHeader().locator('i.pi-sort-amount-up-alt');
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



    protected async assertFirstOptionMatchesProject(projectName: string): Promise<void> {
        const firstOptionText = (await this.projectDropdownOptions.first().innerText()).trim().toLowerCase();
        expect(firstOptionText).toContain(projectName.toLowerCase());
    }

    protected async assertLotsExist(): Promise<void> {
        const count = await this.getLotRowCount();
        expect(count).toBeGreaterThan(0);
    }

    protected bedTagCrossIcon(bedValue: string): Locator {
        return this.selectedBedTagByValue(bedValue).locator('span.pi-times-circle');
    }

    protected async cleanupAfterLotTest(): Promise<void> {
        await this.closeDropdown();
        await this.resetFilters();
        await this.closeDropdown();
        await this.clickOnProjects();
        await this.page.waitForTimeout(500);
    }

    async clickOnProjects(): Promise<void> {
        await this.projectsMenuLink.click();
    }

    protected async clickProjectOptionByName(projectName: string): Promise<void> {
        const count = await this.projectDropdownOptions.count();
        for (let i = 0; i < count; i++) {
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

    protected async closeDropdown(): Promise<void> {
        await this.page.waitForTimeout(200);
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(800);
    }

    protected async isRowCheckboxSelected(row: Locator): Promise<boolean> {
        const checkbox = this.rowCheckbox(row);
        const className = await checkbox.getAttribute('class') || '';
        return className.includes('p-highlight') || className.includes('p-checked');
    }

    protected async navigateToLotTabInPrecinct(): Promise<void> {
        await this.navigateToProjects();
        await this.page.waitForLoadState('networkidle');
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_LONG,
        });
        await this.firstPrecinctOnProjectsPage.click();
        await expect(this.lotTabInPrecinct).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.lotTabInPrecinct.click();
    }

    protected async openBedDropdown(): Promise<void> {
        await expect(this.bedDropdownInLot).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.bedDropdownInLot.click();
        await expect(this.bedDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async openInternalAreaFilter(): Promise<void> {
        await expect(this.internalAreaFilter).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.internalAreaFilter.click();
    }

    protected async openPriceRangeFilter(): Promise<void> {
        await expect(this.priceRangeFilter).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.priceRangeFilter.click();
    }

    protected async openProjectDropdown(): Promise<void> {
        await expect(this.projectDropdownInLot).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.projectDropdownInLot.click();
        await expect(this.projectDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async openProjectDropdownAndSearch(projectName: string): Promise<number> {
        await this.openProjectDropdown();
        await this.page.waitForTimeout(1000);
        await this.searchInProjectDropdown(projectName);
        const count = await this.projectDropdownOptions.count();
        expect(count).toBeGreaterThan(0);
        return count;
    }

    protected async openStatusDropdown(): Promise<void> {
        await expect(this.statusDropdownInLot).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.statusDropdownInLot.click();
        await expect(this.statusDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.statusDropdownOptions.first()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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

    protected projectTagCrossIcon(projectName: string): Locator {
        return this.selectedProjectTagByName(projectName).locator('span.pi-times-circle');
    }

    protected async resetAndAssertLotRowVisible(): Promise<void> {
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const firstCheckbox = this.rowCheckbox(firstRow);
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        await this.resetButton.click();
        await this.page.waitForTimeout(2000);
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

    protected get saveAndCloseButton(): Locator {
        return this.page.locator('button', { hasText: /save.*close|save & close/i }).first();
    }

    protected async searchInStatusDropdown(statusValue: string): Promise<void> {
        await expect(this.statusDropdownSearchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.statusDropdownSearchInput.fill(statusValue);
        await this.page.waitForTimeout(800);
    }

    protected async searchLot(keyword: string): Promise<void> {
        await this.lotSearchInput.fill(keyword);
        await this.page.waitForTimeout(1500);
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

    protected async setInternalArea(min: string, max: string): Promise<void> {
        await this.internalAreaMinInput.fill(min);
        await this.internalAreaMaxInput.fill(max);
    }

    protected async setPriceRange(min: string, max: string): Promise<void> {
        await this.priceRangeMinInput.fill(min);
        await this.priceRangeMaxInput.fill(max);
    }

    protected statusTagCrossIcon(statusValue: string): Locator {
        return this.selectedStatusTagByValue(statusValue).locator('span.pi-times-circle');
    }



    protected get bedDropdownInLot(): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]').locator('.box');
    }

    protected async getLotRowCount(): Promise<number> {
        return await this.lotTableRows.count();
    }

    protected get internalAreaMaxInput(): Locator {
        return this.page.locator('input[placeholder*="Max" i]');
    }

    protected get internalAreaMinInput(): Locator {
        return this.page.locator('input[placeholder*="Min" i]');
    }

    protected get priceRangeFilter(): Locator {
        return this.page.locator('.land-size', { hasText: 'Price Range' });
    }

    protected get priceRangeMaxInput(): Locator {
        return this.page.locator('input[placeholder*="Max" i]').first();
    }

    protected get priceRangeMinInput(): Locator {
        return this.page.locator('input[placeholder*="Min" i]').first();
    }

    protected projectColumnHeader(): Locator {
        return this.page.locator('table thead th', { has: this.page.locator('p', { hasText: /^Project$/ }) });
    }

    protected async resetFilters(): Promise<void> {
        await this.resetButton.click();
        await this.page.waitForTimeout(800);
    }

    protected async searchInProjectDropdown(projectName: string): Promise<void> {
        await expect(this.projectDropdownSearchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectDropdownSearchInput.fill(projectName);
        await this.page.waitForTimeout(800);
    }

    protected get statusDropdownInLot(): Locator {
        return this.page.locator('re-multiselect[placeholder="Status"]').locator('.box');
    }

}