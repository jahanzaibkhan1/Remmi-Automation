import { expect, Locator } from '@playwright/test';
import { faker } from '@faker-js/faker';
import * as path from 'path';
import { ProjectBasePage } from './ProjectBasePage';

export class ProjectGridViewPage extends ProjectBasePage {
    async verifyProjectCanBeSearchedByName(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await expect(this.searchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.searchInput.fill(projectName);
        await expect(this.projectCardByName(projectName)).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_LONG,
        });
    }

    async verifyProjectCanBeSearchedByPartialName(partialName: string): Promise<void> {
        await this.navigateToProjects();
        await expect(this.searchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.searchInput.fill(partialName);

        const firstResult = this.projectCardContainingText(partialName);
        await expect(firstResult).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });

        const resultText = await firstResult.textContent();
        expect(resultText?.toLowerCase()).toContain(partialName.toLowerCase());
    }

    async verifyProjectSearchWithInvalidName(invalidName: string): Promise<void> {
        await this.navigateToProjects();
        await expect(this.searchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.searchInput.fill(invalidName);
        await expect(this.allProjectCardsByName(invalidName)).toHaveCount(0);
        await this.clickResetIcon();
    }

    // ==========================================================================
    // IMAGE VERIFICATION
    // ==========================================================================

    async verifyProjectImageDisplayedInGridView(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await expect(this.searchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.searchInput.fill(projectName);

        const card = this.projectCardByName(projectName);
        await expect(card).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_MEDIUM });

        const thumbnail = this.thumbnailForCard(card);
        await expect(thumbnail).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });

        const styleAttr = await thumbnail.getAttribute('style');
        expect(styleAttr).toBeTruthy();

        const bgUrlMatch = styleAttr?.match(/background-image:\s*url\((['"]?)(.*?)\1\)/i);
        expect(bgUrlMatch && bgUrlMatch[2]).toBeTruthy();
        expect(bgUrlMatch![2].trim()).not.toBe('');
    }

    async verifyPlaceholderImageForProjectWithNoImage(): Promise<void> {
        const projectName = 'Al kabir heights';
        await this.navigateToProjects();
        await expect(this.searchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.searchInput.fill(projectName);

        const card = this.projectCardByName(projectName);
        await expect(card).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_MEDIUM });
        await expect(this.thumbnailForCard(card)).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_DEFAULT,
        });
        await this.clickResetIcon();
    }

    // ==========================================================================
    // TABS
    // ==========================================================================

    async verifyTabsAndResetAfterSearch(searchText: string): Promise<void> {
        await this.navigateToProjects();
        await expect(this.searchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.searchInput.fill(searchText);
        await this.clickTabByLabel('Inactive');
        await this.clickTabByLabel('Active');
        await this.clickResetIcon();
        await expect(this.searchInput).toHaveValue('');
    }

    async verifyDefaultTabIsActive(): Promise<void> {
        await this.navigateToProjects();
        const activeTab = this.tabByLabel('Active');
        await expect(activeTab).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });

        const ariaSelected = await activeTab.getAttribute('aria-selected');
        if (ariaSelected !== null) {
            expect(ariaSelected).toBe('true');
        } else {
            const className = await activeTab.getAttribute('class');
            expect(className).toMatch(/active/i);
        }
    }

    async verifyProjectsUnderActiveTab(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await expect(this.tabByLabel('Active')).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.projectCardByName(projectName).scrollIntoViewIfNeeded();
    }

    async verifyProjectsUnderInactiveTab(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await this.clickTabByLabel('Inactive');
        const card = this.projectCardByName(projectName);
        await expect(card).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await card.scrollIntoViewIfNeeded();
    }

    async verifyPrecinctIsGroupedUnderTab(precinctName: string): Promise<void> {
        await this.navigateToProjects();
        const container = this.precinctContainerByName(precinctName);
        await expect(container).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        await expect(container.locator(this.precinctCardThumbnailWithImage)).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_DEFAULT,
        });
    }

    // ==========================================================================
    // PRECINCT NAVIGATION
    // ==========================================================================

    protected async getFirstVisiblePrecinctCard(): Promise<void> {
        await expect(this.firstGridProduct).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await expect(this.firstGridProduct).toBeEnabled({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.firstGridProduct.click();
    }

    protected async clickVisibleBackButton(): Promise<void> {
        await expect(this.backButton).toBeEnabled({ timeout: ProjectBasePage.TIMEOUT_MEDIUM });
        await this.backButton.click({ force: true });
    }

    async verifyClickingPrecinctOpensTabs(): Promise<void> {
        await this.navigateToProjects();
        await this.getFirstVisiblePrecinctCard();

        for (const tab of ['project', 'lot', 'EOI']) {
            const el = this.innerTabById(tab);
            await expect(el).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
            await expect(el).toHaveText(new RegExp(tab, 'i'), { timeout: ProjectBasePage.TIMEOUT_LONG });
        }

        await this.projectsMenuLink.click();
        await expect(this.firstGridProduct).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
    }

    async verifyPrecinctAllocatedProjectNotInActiveTabAfterPrecinctClick(): Promise<void> {
        await this.navigateToProjects();
        await this.getFirstVisiblePrecinctCard();

        const insidePrecinctHeading = (await this.allSgvProductHeadings.first().innerText()).trim();

        await this.projectsMenuLink.evaluate((el: HTMLElement) => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
        await this.projectsMenuLink.click();

        await this.page.waitForLoadState('networkidle');
        await this.page.waitForSelector('.sgv-product .product-content h3', {
            state: 'visible',
            timeout: ProjectBasePage.TIMEOUT_LONG,
        });

        await expect(this.searchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.searchInput.fill(insidePrecinctHeading);

        const escapedName = insidePrecinctHeading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        await expect(this.activeProjectCardFilter(escapedName)).toHaveCount(0);
    }

    async verifyProjectReappearsInActiveTabAfterPrecinctDeletion(): Promise<void> {
        await this.navigateToProjects();
        await expect(this.precinctListingsMenuLink).toBeEnabled({
            timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG,
        });
        await this.precinctListingsMenuLink.click();

        await expect(this.precinctAllocationTabById).toBeEnabled({
            timeout: ProjectBasePage.TIMEOUT_LONG,
        });
        await this.precinctAllocationTabById.click();

        await this.selectFirstProjectFromDropdown();

        await expect(this.allocationCheckboxes.first()).toBeVisible();
        await this.allocationCheckboxes.first().click();
        await this.page.waitForTimeout(1200);
        await this.allocationCheckboxes.first().click();

        await this.clickSaveAndVerifyToast();
        await this.projectsMenuLink.click();
        await this.getFirstVisiblePrecinctCard();

        await this.precinctListingsMenuLink.click();
        await this.precinctAllocationTabQuick.click();
        await this.selectFirstProjectFromDropdown();

        await expect(this.allocationCheckboxes.nth(1)).toBeVisible();
        await this.allocationCheckboxes.nth(1).click();

        await this.clickSaveAndVerifyToast();
        await this.projectsMenuLink.click();
        await this.getFirstVisiblePrecinctCard();
        await this.projectsMenuLink.click();
    }

    // ==========================================================================
    // PROJECT CREATION DIALOG
    // ==========================================================================

    async openProjectPopup(): Promise<void> {
        await this.page.reload();
        await expect(this.addNewProjectButton).toBeEnabled({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.addNewProjectButton.click();
        await expect(this.projectDialog).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.projectNameField).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.projectStatusField).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.projectDialogSaveButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.projectDialogCancelButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });

    }

    async verifyAndCloseProjectPopup(): Promise<void> {
        await this.navigateToProjects();
        await this.openProjectPopup();
        await this.projectDialogCancelButton.click({ force: true });
        await expect(this.projectDialogContent).toBeHidden({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    async clickOnProjects(): Promise<void> {
        await this.projectsMenuLink.click();
    }

    async createProjectWithValidData(project?: { name?: string; status?: string }): Promise<void> {
        await this.navigateToProjects();
        await this.openProjectPopup();

        const projectName = project?.name ?? faker.company.name();

        await this.projectNameField.fill(projectName);
        await this.projectDialogSaveButton.click({ force: true });
        await expect(this.projectDialog).toBeHidden({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });

        await this.projectAddedToast
            .waitFor({ state: 'visible', timeout: ProjectBasePage.TIMEOUT_MEDIUM })
            .catch(() => {
                /* Toast may disappear too quickly — non-fatal */
            });

        await this.projectTitleBanner(projectName).waitFor({
            state: 'visible',
            timeout: ProjectBasePage.TIMEOUT_MEDIUM,
        });
        const projectsText = this.page.locator('p', { hasText: 'Projects' });
        await expect(projectsText).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await projectsText.click({ force: true });
        await this.verifyProjectCanBeSearchedByName(projectName);
        await this.clickResetIcon();
    }

    async saveProjectPopupWithEmptyFields(): Promise<void> {
        await this.navigateToProjects();
        await this.openProjectPopup();

        await this.projectNameField.fill('');
        await this.projectDialogSaveButton.click({ force: true });
        await expect(this.projectNameValidationError).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_SHORT,
        });

        await this.projectDialogCancelButton.click();
        await expect(this.projectDialog).toBeHidden({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    async closeProjectPopupWithCrossIcon(): Promise<void> {
        await this.navigateToProjects();
        await this.openProjectPopup();
        await this.projectDialogCloseIcon.click({ force: true });
        await expect(this.projectDialogContent).toBeHidden({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    // ==========================================================================
    // PIN / UNPIN
    // ==========================================================================

    async verifyPinToDashboardOptionVisibleOnRightClick(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await this.verifyProjectCanBeSearchedByName(projectName);

        const card = this.projectCardByName(projectName);
        await expect(card).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_MEDIUM });
        await card.click({ button: 'right' });

        await expect(this.pinToDashboardOption).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.mouse.click(0, 0);
        await expect(this.pinToDashboardOption).not.toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_DEFAULT,
        });
        await this.page.waitForTimeout(1200);
    }

    async pinProjectAndVerifyIcon(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await this.verifyProjectCanBeSearchedByName(projectName);

        const card = this.projectCardByName(projectName);
        await card.evaluate((el) =>
            el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' })
        );
        await expect(card).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_MEDIUM });
        await card.click({ button: 'right' });

        await expect(this.pinToDashboardOption).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.pinToDashboardOption.click();

        await expect(this.pinnedIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(1200);
    }

    async unpinProjectAndVerifyRemoval(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await this.verifyProjectCanBeSearchedByName(projectName);

        const card = this.projectCardByName(projectName);
        await card.scrollIntoViewIfNeeded();
        await expect(card).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_MEDIUM });
        await card.click({ button: 'right' });

        await expect(this.unpinFromDashboardOption).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.unpinFromDashboardOption.click();

        await expect(this.pinnedIcon.filter({ has: card })).toHaveCount(0, {
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

    // ==========================================================================
    // LIST VIEW — PROJECT ACTIONS (CREATE / DELETE / DUPLICATE / SORT)
    // ==========================================================================

}
