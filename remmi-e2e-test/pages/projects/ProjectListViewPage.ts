import { expect, Locator } from '@playwright/test';
import { faker } from '@faker-js/faker';
import * as path from 'path';
import { ProjectBasePage } from './ProjectBasePage';

export class ProjectListViewPage extends ProjectBasePage {
    async openProjectCreatePopup(): Promise<void> {
        await this.prepareListView();
        await expect(this.addNewProjectButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.addNewProjectButton.click();

        await expect(this.projectDialog).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.projectNameField).toBeVisible();
        await expect(this.projectStatusField).toBeVisible();
        await expect(this.projectDialogSaveButton).toBeVisible();
        await expect(this.projectDialogCancelButton).toBeVisible();
        await this.projectDialogCancelButton.click();
    }

    async selectMultipleProjects(): Promise<void> {
        await this.prepareListView();
        await expect(this.selectAllCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.selectAllCheckbox.click();
        await this.page.waitForTimeout(1000);
        await this.selectAllCheckbox.click();
        await this.resetListView();
    }

    async duplicateSelectedProjects(): Promise<void> {
        await this.prepareListView();
        await this.firstRowCheckbox.click();
        await this.duplicateButton.click();
        await expect(this.duplicateSuccessToast).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(1000);
        await this.resetListView();
    }

    async deleteSelectedProjects(): Promise<void> {
        await this.prepareListView();
        await this.firstRowCheckbox.click();
        await this.deleteButtonFirst.click();
        await this.deleteButtonLast.click();
        await expect(this.deleteSuccessToast).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    async deleteProjectViaRowIcon(): Promise<void> {
        await this.prepareListView();
        await expect(this.firstRowDeleteIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.firstRowDeleteIcon.click();
        await this.confirmDeleteButton.click();
        await expect(this.deleteSuccessToast).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    async cancelDeleteFromPopup(): Promise<void> {
        await this.prepareListView();
        await this.firstRowDeleteIcon.click();
        await expect(this.cancelDeleteButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.cancelDeleteButton.click();
        await expect(this.cancelDeleteButton).toBeHidden({ timeout: ProjectBasePage.TIMEOUT_SHORT });
    }

    async sortProjectsAscending(columnName: string = 'Project Name'): Promise<void> {
        await this.prepareListView();
        await this.sortIconForColumn(columnName).click();
        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);
        await this.verifyColumnSort('asc', columnName);
    }

    async sortProjectsDescending(columnName: string = 'Project Name'): Promise<void> {
        await this.prepareListView();
        await this.columnFilterIcon(columnName).click();
        await expect(this.columnHeader(columnName).locator('sortamountdownicon')).toHaveCount(1, {
            timeout: ProjectBasePage.TIMEOUT_SHORT,
        });
        await this.verifyColumnSort('desc', columnName);
    }

    protected async verifyColumnSort(direction: 'asc' | 'desc', columnName: string): Promise<void> {
        const values = await this.projectNameColumnValues.allTextContents();
        const trimmed = values.map((v) => v.trim()).filter((v) => v.length > 0);
        const sorted = [...trimmed].sort((a, b) =>
            direction === 'asc'
                ? a.toLowerCase().localeCompare(b.toLowerCase())
                : b.toLowerCase().localeCompare(a.toLowerCase())
        );

        if (JSON.stringify(trimmed) !== JSON.stringify(sorted)) {
            const dirLabel = direction === 'asc' ? 'Ascending' : 'Descending';
            throw new Error(
                `${dirLabel} sort failed for "${columnName}".\n` +
                `Actual:   ${trimmed.slice(0, 5).join(' | ')}\n` +
                `Expected: ${sorted.slice(0, 5).join(' | ')}`
            );
        }
    }

    // ==========================================================================
    // LIST VIEW — EDGE CASES
    // ==========================================================================

    async createViewWithoutName(): Promise<void> {
        await this.openAddViewAndClickSave();
        await expect(this.viewNameInputInvalid).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_SHORT });
        await this.page.keyboard.press('Escape');
        await this.resetListView();
    }

    async saveViewWithoutChanges(): Promise<void> {
        await this.openAddViewAndClickSave();
        await expect(this.viewNameInputInvalid).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_SHORT });
        await this.page.keyboard.press('Escape');
        await this.resetListView();
    }

    protected async openAddViewAndClickSave(): Promise<void> {
        await this.prepareListView();
        await this.defaultViewButton.click();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_MEDIUM });

        await this.addViewIcon.waitFor({ state: 'visible', timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.addViewIcon.click();

        await expect(this.viewNameInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.saveOrCreateButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.saveOrCreateButton.click({ force: true });
    }

    async shareViewWithNoSelection(): Promise<void> {
        await this.prepareListView();
        await this.defaultViewButton.click();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_MEDIUM });

        await expect(this.shareViewIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.shareViewIcon.click({ force: true });

        await expect(this.shareButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.shareButton.click({ force: true });

        await expect(this.shareResponseMessage()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });

        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);
        await this.closeOverlay();
        await this.resetListView();
        await this.waitForFirstTableRow();
    }

    async viewStatusOutOfSync(): Promise<void> {
        await this.prepareListView();
        await this.defaultViewButton.click();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });

        await this.columnItemByName('developer').locator('img[src*="Eye.svg"]').click();
        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);

        await this.closeOverlay();
        await this.defaultViewButton.click();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });

        // Intentional debug log — tracks view persistence behavior
        const developerCount = await this.columnItemByName('developer').count();
        console.log(`After navigate-away-and-reopen, Developer in visible list: ${developerCount > 0}`);

        await this.closeOverlay();
        await this.resetListView();
    }

    async verifyRecordsCountAtEnd(): Promise<void> {
        await this.prepareListView();
        await this.recordsCountLabel.scrollIntoViewIfNeeded();
        await expect(this.recordsCountLabel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });

        const text = await this.recordsCountLabel.textContent();
        const count = parseInt(text?.match(/\d+/)?.[0] ?? '0', 10);
        if (count <= 0) {
            throw new Error(`Invalid records count: "${text?.trim()}"`);
        }
    }

    // ==========================================================================
    // PRECINCT SETUP
    // ==========================================================================

    async verifyPrecinctSetupSubTabs(): Promise<void> {
        await this.openPrecinctSetup();
        await expect(this.precinctSubTab).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.precinctAllocationSubTab).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_DEFAULT,
        });
    }

    async verifyPrecinctTabDefaultControls(): Promise<void> {
        await this.openPrecinctSetup();
        await expect(this.precinctTab).toHaveClass(/active/);
        await expect(this.selectProjectDropdown).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_DEFAULT,
        });
        await expect(this.createNewPrecinctButton).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_DEFAULT,
        });
    }

    // ==========================================================================
    // LIST VIEW — SEARCH
    // ==========================================================================

    async verifyProjectCanBeSearchedByNameInListView(projectName: string): Promise<void> {
        await this.prepareListView();
        await this.searchInputByPlaceholder.fill('');
        await this.searchInputByPlaceholder.fill(projectName);
        await expect(this.tableRowWithText(projectName)).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_LONG,
        });
        await this.clickResetIcon();
    }

    async verifyProjectSearchWithInvalidNameInListView(invalidName: string): Promise<void> {
        await this.prepareListView();
        await this.searchInputByPlaceholder.fill('');
        await this.searchInputByPlaceholder.fill(invalidName);
        await this.page.waitForLoadState('networkidle');
        await expect(this.noProjectsAvailableMessage).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_LONG,
        });
        await expect(this.page.locator('tr').filter({ hasText: new RegExp(invalidName, 'i') })).toHaveCount(0);
        await this.clickResetIcon();
    }

    async searchProjectWithSymbols(): Promise<void> {
        await this.prepareListView();
        await this.searchInputByPlaceholder.fill('@#$%^&*');
        await expect(this.noProjectsAvailableMessage).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_LONG,
        });
        await this.resetListView();
    }

    // ==========================================================================
    // LIST VIEW — FILTERING
    // ==========================================================================

    async verifyActiveTabFilteringInListView(): Promise<void> {
        await this.prepareListView();
        const tab = this.listFilterTab('Active');
        await tab.click();
        await expect(tab).toHaveClass(/active-filter/);
        await this.waitForFirstTableRow();
        expect(await this.allTableRows.count()).toBeGreaterThan(0);
    }

    async verifyInactiveTabFilteringInListView(): Promise<void> {
        await this.prepareListView();
        const tab = this.listFilterTab('Inactive');
        await tab.click();
        await expect(tab).toHaveClass(/active-filter/);
        await this.waitForFirstTableRow();
        expect(await this.allTableRows.count()).toBeGreaterThan(0);
    }

    // ==========================================================================
    // LIST VIEW — PROJECT MANAGER MULTISELECT
    // ==========================================================================

    async selectSingleProjectManagerInListView(managerName: string): Promise<void> {
        await this.openProjectManagerDropdown();
        await this.selectManagerByName(managerName);
        await this.page.keyboard.press('Escape');
        await this.verifyManagerTagsVisible([managerName]);
        await this.waitForFirstTableRow();
        expect(await this.allTableRows.count()).toBeGreaterThan(0);
        await this.resetListView();
    }

    async selectMultipleProjectManagersInListView(managerNames: string[]): Promise<void> {
        await this.openProjectManagerDropdown();
        for (const name of managerNames) {
            await this.selectManagerByName(name);
        }
        await this.page.keyboard.press('Escape');
        await this.verifyManagerTagsVisible(managerNames);
        await this.waitForFirstTableRow();
        expect(await this.allTableRows.count()).toBeGreaterThan(0);
        await this.resetListView();
    }

    async selectAllProjectManagersInListView(): Promise<void> {
        await this.openProjectManagerDropdown();
        await this.selectAllManagersLabel.waitFor({
            state: 'visible',
            timeout: ProjectBasePage.TIMEOUT_MEDIUM,
        });
        await this.selectAllManagersLabel.click();
        await this.page.keyboard.press('Escape');
        await this.waitForFirstTableRow();
        expect(await this.allTableRows.count()).toBeGreaterThan(0);
        await this.resetListView();
    }

    async deselectAllProjectManagersInListView(): Promise<void> {
        await this.openProjectManagerDropdown();
        await this.selectAllToggle.waitFor({
            state: 'visible',
            timeout: ProjectBasePage.TIMEOUT_MEDIUM,
        });

        const currentState = await this.selectAllToggle.getAttribute('data');
        if (currentState === 'Select All') {
            await this.selectAllToggle.click();
            await expect(this.selectAllToggle).toHaveAttribute('data', 'Deselect All', {
                timeout: ProjectBasePage.TIMEOUT_DEFAULT,
            });
        }

        await this.selectAllToggle.click();
        await expect(this.selectAllToggle).toHaveAttribute('data', 'Select All', {
            timeout: ProjectBasePage.TIMEOUT_DEFAULT,
        });

        await this.page.keyboard.press('Escape');
        await this.waitForFirstTableRow();
        expect(await this.allTableRows.count()).toBeGreaterThan(0);
        await this.resetListView();
    }

    async selectProjectManagerWithNoProjects(): Promise<void> {
        await this.openProjectManagerDropdown();
        await this.page.keyboard.press('Escape');
        await this.resetListView();
    }

    // ==========================================================================
    // LIST VIEW — CUSTOM VIEWS
    // ==========================================================================

    async verifyDefaultViewPopupOpensInListView(): Promise<void> {
        await this.prepareListView();
        await this.openDefaultViewPopup();
        await this.page.keyboard.press('Escape');
    }

    async createNewCustomViewInListView(viewName: string): Promise<void> {
        await this.prepareListView();
        await this.openDefaultViewPopup();

        await this.addViewIcon.waitFor({ state: 'visible', timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.addViewIcon.click();

        await expect(this.viewNameInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.viewNameInput.click();
        await this.viewNameInput.fill(viewName);

        await expect(this.saveOrCreateButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.saveOrCreateButton.click({ force: true });

        await expect(this.viewCreatedToast).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.resetToDefaultView();
    }

    protected async resetToDefaultView(): Promise<void> {
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

    async shareViewWithAgentAndTeamInListView(
        userName: string = 'Abdul Rehman',
        teamName: string = 'Automation Team'
    ): Promise<void> {
        await this.prepareListView();
        await this.openDefaultViewPopup();

        await expect(this.shareViewIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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

    async reorderStatusPositions(): Promise<void> {
        await this.prepareListView();
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

    async hideAndShowStatus(): Promise<void> {
        await this.prepareListView();
        await this.openDefaultViewPopup();

        await expect(this.hideAllButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.hideAllButton.click();
        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);

        await expect(this.visibleColumnList).toHaveCount(0, { timeout: ProjectBasePage.TIMEOUT_DEFAULT });

        await expect(this.showAllButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.showAllButton.click();
        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);

        await expect(this.hiddenColumnList).toHaveCount(0, { timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.visibleColumnList.first()).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_DEFAULT,
        });

        await this.closeOverlay();
    }

    async searchStatusInViewPopup(): Promise<void> {
        await this.prepareListView();
        await this.openDefaultViewPopup();

        const searchTerm = 'Project Name';
        await expect(this.columnSearchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.columnSearchInput.fill(searchTerm);
        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);

        await expect(this.columnItemByName(searchTerm).first()).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_DEFAULT,
        });

        await this.closeOverlay();
    }

    async deleteSavedViewInListView(viewName: string): Promise<void> {
        await this.prepareListView();
        await this.openDefaultViewPopup();

        await expect(this.savedViewDropdown).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.savedViewDropdown.click();
        await this.page.waitForTimeout(ProjectBasePage.UI_SETTLE_DELAY);

        const viewOption = this.savedViewOption(viewName);
        await expect(viewOption).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });

        const deleteIcon = viewOption.locator('img[src*="delete_icon.svg"]');
        await expect(deleteIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await deleteIcon.click();

        try {
            await expect(this.confirmAnyButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_SHORT });
            await this.confirmAnyButton.click();
        } catch {
            // No confirmation dialog — deletion was immediate
        }

        await expect(this.viewDeletedToast).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.closeOverlay();
    }

}
