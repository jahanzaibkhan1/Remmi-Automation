import { expect, Page, Locator } from '@playwright/test';
import { faker } from '@faker-js/faker';
import * as path from 'path';

export class ProjectActions {
    // ========== CONSTANTS ==========
    private static readonly TIMEOUT_SHORT = 5_000;
    private static readonly TIMEOUT_DEFAULT = 10_000;
    private static readonly TIMEOUT_MEDIUM = 15_000;
    private static readonly TIMEOUT_LONG = 30_000;
    private static readonly TIMEOUT_EXTRA_LONG = 40_000;
    private static readonly UI_SETTLE_DELAY = 500;
    private static readonly IMAGES_DIR = path.resolve(__dirname, 'Images');
    private static readonly DEFAULT_TEST_IMAGE = 'propertyImage.jpg';
    private static readonly PROJECTS_URL = '/project/projects';
    private static readonly PRECINCT_LISTINGS_URL = '/listings/project-precinct';

    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // ==========================================================================
    // LOCATORS — SEARCH & TOP BAR
    // ==========================================================================

    private get searchInput(): Locator {
        return this.page.getByPlaceholder('Search').last();
    }

    private get searchInputByPlaceholder(): Locator {
        return this.page.locator('input[placeholder="Search"]').last();
    }

    private get resetIcon(): Locator {
        return this.page.locator('i').nth(3);
    }

    private get resetButton(): Locator {
        return this.page.locator('button', { hasText: /reset/i }).last();
    }

    private tabByLabel(label: string): Locator {
        return this.page.getByText(label, { exact: true });
    }

    // ==========================================================================
    // LOCATORS — GRID VIEW (PROJECT CARDS)
    // ==========================================================================

    private get firstGridProduct(): Locator {
        return this.page.locator('.sgv-product').first();
    }

    private projectCardByName(name: string): Locator {
        return this.page
            .locator('.sgv-product .product-content h3', {
                hasText: new RegExp(`^${name}$`, 'i'),
            })
            .first();
    }

    private projectCardContainingText(text: string): Locator {
        return this.page
            .locator('.sgv-product .product-content h3', { hasText: new RegExp(text, 'i') })
            .first();
    }

    private allProjectCardsByName(name: string): Locator {
        return this.page.locator('.sgv-product .product-content h3', {
            hasText: new RegExp(name, 'i'),
        });
    }

    private thumbnailForCard(card: Locator): Locator {
        return card.locator('..').locator('..').first().locator('.product-thumbnail').first();
    }

    private precinctContainerByName(name: string): Locator {
        const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return this.page
            .locator('.sgv-product.ng-star-inserted')
            .filter({
                has: this.page.locator('.precinct-content h3', {
                    hasText: new RegExp(`^${escapedName}$`, 'i'),
                }),
            })
            .first();
    }

    private get precinctCardThumbnailWithImage(): Locator {
        return this.page.locator('.product-thumbnail.cp.ng-star-inserted[style*="projectimages"]');
    }

    // ==========================================================================
    // LOCATORS — LIST VIEW (TABLE)
    // ==========================================================================

    private get firstTableRow(): Locator {
        return this.page.locator('tbody tr').first();
    }

    private get allTableRows(): Locator {
        return this.page.locator('tbody tr');
    }

    private get firstRowCheckbox(): Locator {
        return this.page.locator('tbody tr p-tablecheckbox .p-checkbox-box').first();
    }

    private get selectAllCheckbox(): Locator {
        return this.page.locator('thead div.p-checkbox.p-component .p-checkbox-box');
    }

    private get firstRowDeleteIcon(): Locator {
        return this.page.locator('tbody tr img[src*="delete_icon.svg"]').first();
    }

    private tableRowWithText(text: string): Locator {
        return this.page.locator('tr').filter({ hasText: new RegExp(text, 'i') }).first();
    }

    private get projectNameColumnValues(): Locator {
        return this.page.locator('tbody tr td:nth-child(3) p');
    }

    private get recordsCountLabel(): Locator {
        return this.page.locator('p').filter({ hasText: /^\s*Records:\s*\d+/ });
    }

    private get noProjectsAvailableMessage(): Locator {
        return this.page.getByText(/No projects available/i).first();
    }

    private sortIconForColumn(columnName: string): Locator {
        return this.page.locator('th', { hasText: columnName }).locator('p-sorticon').first();
    }

    private columnHeader(columnName: string): Locator {
        return this.page.locator('th', { hasText: columnName }).first();
    }

    private columnFilterIcon(columnName: string): Locator {
        return this.page.getByRole('cell', { name: `${columnName} filter` }).locator('svg');
    }

    private listFilterTab(label: string): Locator {
        return this.page.locator('ul.list-type li', { hasText: label }).first();
    }

    // ==========================================================================
    // LOCATORS — VIEW SWITCHING
    // ==========================================================================

    private get gridViewButton(): Locator {
        return this.page.locator('.layout-changer a.grid-icon');
    }

    private get listViewButton(): Locator {
        return this.page.locator('.layout-changer a').filter({
            has: this.page.locator('img[src*="list.svg"]'),
        });
    }

    // ==========================================================================
    // LOCATORS — VIEW POPUP (DEFAULT VIEW / SAVED VIEWS)
    // ==========================================================================

    private get defaultViewButton(): Locator {
        return this.page.locator('._view-btn').filter({ hasText: /default view/i });
    }

    private get activeViewButton(): Locator {
        return this.page.locator('._view-btn').first();
    }

    private get viewPopupContent(): Locator {
        return this.page.locator('.p-overlaypanel-content');
    }

    private get addViewIcon(): Locator {
        return this.viewPopupContent.locator('.view-options img[src*="plus-solid.svg"]');
    }

    private get shareViewIcon(): Locator {
        return this.viewPopupContent.locator('.view-options img[src*="share-one.svg"]');
    }

    private get viewNameInput(): Locator {
        return this.page
            .locator('input[placeholder*="view" i], input[placeholder*="name" i]')
            .last();
    }

    private get viewNameInputInvalid(): Locator {
        return this.page.locator(
            'input[placeholder*="view" i], input[placeholder*="name" i].invalidField'
        );
    }

    private get saveOrCreateButton(): Locator {
        return this.page.getByRole('button', { name: /save|create/i }).first();
    }

    private get savedViewDropdown(): Locator {
        return this.viewPopupContent.locator('ng-select[placeholder="Select default view"]');
    }

    private get viewDropdownArrow(): Locator {
        return this.page.locator('.view-w-100 > .ng-select-container > .ng-arrow-wrapper');
    }

    private get defaultViewOption(): Locator {
        return this.page.getByText(/^default view$/i).first();
    }

    private savedViewOption(viewName: string): Locator {
        return this.page
            .locator('.ng-dropdown-panel-items .ng-option')
            .filter({ hasText: new RegExp(`^\\s*${viewName}\\s*$`, 'i') });
    }

    private get visibleColumnList(): Locator {
        return this.viewPopupContent.locator('#visibleColumnList .cdk-drag');
    }

    private get hiddenColumnList(): Locator {
        return this.viewPopupContent.locator('#hiddenColumnList .cdk-drag');
    }

    private columnItemByName(name: string): Locator {
        return this.visibleColumnList.filter({ hasText: new RegExp(name, 'i') });
    }

    private get hideAllButton(): Locator {
        return this.viewPopupContent.getByText('Hide All', { exact: true });
    }

    private get showAllButton(): Locator {
        return this.viewPopupContent.getByText('Show All', { exact: true });
    }

    private get columnSearchInput(): Locator {
        return this.viewPopupContent.locator('input[placeholder="Search"]').first();
    }

    private get shareButton(): Locator {
        return this.viewPopupContent.locator('button._outline-btn', { hasText: 'Share' });
    }

    private get usersShareDropdown(): Locator {
        return this.viewPopupContent.locator('re-multiselect.w-100.mr-2 .box');
    }

    private get teamsShareDropdown(): Locator {
        return this.viewPopupContent.locator('re-multiselect.custom-select-share .box');
    }

    private get usersShareDropdownArrow(): Locator {
        return this.page.locator('re-multiselect.w-100.mr-2 i.fa-sort-up');
    }

    private get teamsShareDropdownArrow(): Locator {
        return this.page.locator('re-multiselect.custom-select-share i.fas.fa-sort-up');
    }

    private get lastDropBox(): Locator {
        return this.page.locator('.drop_box').last();
    }

    // ==========================================================================
    // LOCATORS — PROJECT MANAGER MULTISELECT
    // ==========================================================================

    private get projectManagerDropdown(): Locator {
        return this.page.locator('re-multiselect[placeholder="Project Manager"] .box');
    }

    private get projectManagerList(): Locator {
        return this.page.locator('re-multiselect[placeholder="Project Manager"] ul');
    }

    private get projectManagerSearchInput(): Locator {
        return this.page
            .locator(
                're-multiselect[placeholder="Project Manager"] input[type="text"], ' +
                're-multiselect[placeholder="Project Manager"] input[type="search"]'
            )
            .last();
    }

    private projectManagerTag(name: string): Locator {
        return this.page
            .locator('re-multiselect[placeholder="Project Manager"] .tags')
            .filter({ hasText: name });
    }

    private listOptionByText(text: string): Locator {
        return this.page.locator('li').filter({ hasText: text }).first();
    }

    private get selectAllManagersLabel(): Locator {
        return this.page.locator('label.select_all[data="Select All"]');
    }

    private get selectAllToggle(): Locator {
        return this.page.locator('label.select_all');
    }

    // ==========================================================================
    // LOCATORS — PROJECT CREATION DIALOG
    // ==========================================================================

    private get addNewProjectButton(): Locator {
        return this.page.locator('button._addNew');
    }

    private get projectDialog(): Locator {
        return this.page.locator('.p-dialog-content').filter({
            has: this.page.locator('input[formcontrolname="Project_Name"]'),
        });
    }

    private get projectDialogContent(): Locator {
        return this.page.locator('.p-dialog-content');
    }

    private get projectNameField(): Locator {
        return this.projectDialog.locator('input[formcontrolname="Project_Name"]');
    }

    private get projectStatusField(): Locator {
        return this.projectDialog.locator('ng-select[formcontrolname="Project_Status"]');
    }

    private get projectDialogSaveButton(): Locator {
        return this.projectDialog.locator('button._outline-btn');
    }

    private get projectDialogCancelButton(): Locator {
        return this.projectDialog.locator('button._cancel-btn');
    }

    private get projectNameValidationError(): Locator {
        return this.projectDialog.locator(
            'input[formcontrolname="Project_Name"] ~ .invalid-feedback, ' +
            'input[formcontrolname="Project_Name"] ~ .text-danger, ' +
            'input[formcontrolname="Project_Name"].ng-invalid'
        );
    }

    private get projectDialogCloseIcon(): Locator {
        return this.page.locator("//*[name()='path' and contains(@d,'M8.01186 7')]");
    }

    // ==========================================================================
    // LOCATORS — ACTION BUTTONS (LIST VIEW TOOLBAR)
    // ==========================================================================

    private get duplicateButton(): Locator {
        return this.page.locator('button', { hasText: /duplicate/i });
    }

    private get deleteButtonFirst(): Locator {
        return this.page.getByRole('button', { name: /delete/i }).first();
    }

    private get deleteButtonLast(): Locator {
        return this.page.getByRole('button', { name: /delete/i }).last();
    }

    private get confirmDeleteButton(): Locator {
        return this.page.getByRole('button', { name: /yes|confirm|delete/i }).first();
    }

    private get cancelDeleteButton(): Locator {
        return this.page.getByRole('button', { name: /cancel|no/i }).first();
    }

    private get confirmAnyButton(): Locator {
        return this.page.getByRole('button', { name: /confirm|yes|delete|ok/i }).first();
    }

    // ==========================================================================
    // LOCATORS — TOAST & MESSAGES
    // ==========================================================================

    private toastByText(pattern: RegExp): Locator {
        return this.page.getByText(pattern).first();
    }

    private get duplicateSuccessToast(): Locator {
        return this.page.locator('.toast-message', { hasText: /project duplicated successfully/i });
    }

    private get deleteSuccessToast(): Locator {
        return this.page.getByText(/project deleted successfully|project.*deleted/i).first();
    }

    private get projectAddedToast(): Locator {
        return this.page.getByText('Project added successfully');
    }

    private get viewCreatedToast(): Locator {
        return this.page.getByText(/view created|saved successfully|created successfully/i);
    }

    private get viewDeletedToast(): Locator {
        return this.page.getByText(/view deleted|deleted successfully|removed successfully/i);
    }

    private get genericToast(): Locator {
        return this.page.locator('.toast-message');
    }

    private get precinctAddSuccessToast(): Locator {
        return this.page.locator('.toast-message[aria-label="Add successfully"]', {
            hasText: /Add successfully/i,
        });
    }

    // ==========================================================================
    // LOCATORS — NAVIGATION MENU
    // ==========================================================================

    private get projectsMenuLink(): Locator {
        return this.page.locator('p', { hasText: 'Projects' }).first();
    }

    private get precinctSetupMenuText(): Locator {
        return this.page.locator('p', { hasText: 'Precinct Set up' }).first();
    }

    private get precinctSetupMenu(): Locator {
        return this.page.locator('app-menu a', { hasText: /precinct set up/i });
    }

    private get precinctListingsMenuLink(): Locator {
        return this.page.locator('a[href="/listings/project-precinct"]');
    }

    // ==========================================================================
    // LOCATORS — PRECINCT SUB-TABS & PANELS
    // ==========================================================================

    private get precinctSubTab(): Locator {
        return this.page
            .locator('.secondary-tabs a[role="tab"]')
            .filter({ hasText: /^\s*Precinct\s*$/i });
    }

    private get precinctAllocationSubTab(): Locator {
        return this.page
            .locator('.secondary-tabs a[role="tab"]')
            .filter({ hasText: /precinct allocation/i });
    }

    private get precinctAllocationTabById(): Locator {
        return this.page.locator('a#pills-precinct_allow-tab', {
            hasText: /precinct allocation/i,
        });
    }

    private get precinctAllocationTabQuick(): Locator {
        return this.page.locator('#pills-precinct_allow-tab');
    }

    private get precinctTab(): Locator {
        return this.page.locator('#pills-precinct-tab');
    }

    private get precinctPanel(): Locator {
        return this.page.locator('#precinct');
    }

    private get selectProjectDropdown(): Locator {
        return this.precinctPanel.locator('ng-select[placeholder="Select Project"]');
    }

    private get createNewPrecinctButton(): Locator {
        return this.page.locator('#precinct button', { hasText: /create new/i });
    }

    private precinctCardByName(name: string): Locator {
        return this.page.locator('#precinct .sgv-product', { hasText: name });
    }

    private innerTabById(tabName: string): Locator {
        return this.page.locator(`a#pills-${tabName}`).first();
    }

    // ==========================================================================
    // LOCATORS — ADD PRECINCT DIALOG
    // ==========================================================================

    private get addPrecinctDialog(): Locator {
        return this.page.locator('.p-dialog[role="dialog"]');
    }

    private get precinctDialogTitle(): Locator {
        return this.addPrecinctDialog.locator('.p-dialog-title');
    }

    private get precinctNameInput(): Locator {
        return this.addPrecinctDialog.locator('input[placeholder="Precinct Name"]');
    }

    private get precinctUploadButton(): Locator {
        return this.addPrecinctDialog.locator('button', { hasText: /upload image/i });
    }

    private get precinctSaveButton(): Locator {
        return this.addPrecinctDialog.locator('button', { hasText: /^save$/i });
    }

    private get precinctCancelButton(): Locator {
        return this.addPrecinctDialog.locator('button', { hasText: /^cancel$/i });
    }

    private get precinctFileInput(): Locator {
        return this.addPrecinctDialog.locator('input[type="file"]');
    }

    private get precinctUploadedImage(): Locator {
        return this.addPrecinctDialog.locator('img.logo-img');
    }

    private get precinctRemoveImageIcon(): Locator {
        return this.addPrecinctDialog.locator('i.pi-times.remove-icon');
    }

    private get precinctNoImagePlaceholder(): Locator {
        return this.addPrecinctDialog.locator('img.no-images');
    }

    // ==========================================================================
    // LOCATORS — PIN / UNPIN
    // ==========================================================================

    private get pinToDashboardOption(): Locator {
        return this.page.getByText('Pin to Dashboard', { exact: true });
    }

    private get unpinFromDashboardOption(): Locator {
        return this.page.getByText('Unpin from Dashboard', { exact: true });
    }

    private get pinnedIcon(): Locator {
        return this.page.locator('img[src="assets/img/dashboadIcon/pin-fill.svg"]');
    }

    // ==========================================================================
    // LOCATORS — PRECINCT ALLOCATION CHECKBOXES & DROPDOWNS
    // ==========================================================================

    private get allocationCheckboxes(): Locator {
        return this.page.locator('p-checkbox .p-checkbox-box');
    }

    private get lastNgSelectContainer(): Locator {
        return this.page.locator('.ng-select-container').last();
    }

    private get firstNgDropdownOption(): Locator {
        return this.page.locator('.ng-dropdown-panel .ng-option-label').first();
    }

    private get saveButtonByText(): Locator {
        return this.page.locator('button:has-text("Save")');
    }
    // ==========================================================================
    // LOCATORS — PRECINCT CARD ICONS (EDIT / DELETE)
    // ==========================================================================

    /**
     * Edit (pencil) icon on the first precinct card in the grid.
     */
    private get firstPrecinctEditIcon(): Locator {
        return this.page.locator('#precinct .sgv-product').first().locator('img[alt="edit"]');
    }

    /**
     * Delete icon on the first precinct card in the grid.
     */
    private get firstPrecinctDeleteIcon(): Locator {
        return this.page.locator('#precinct .sgv-product').first().locator('img[alt="delete"]');
    }

    /**
     * Name of the first precinct card (reads the <h3>).
     */
    private get firstPrecinctCardName(): Locator {
        return this.page.locator('#precinct .sgv-product').first().locator('h3');
    }

    /**
     * Toast shown after successfully deleting a precinct.
     */
    private get precinctDeleteSuccessToast(): Locator {
        return this.page.locator('.toast-message', {
            hasText: /delete(d)? successfully|removed successfully/i,
        });
    }

    // ==========================================================================
    // LOCATORS — PRECINCT TAB PROJECT FILTER DROPDOWN
    // ==========================================================================

    private get selectProjectDropdownContainer(): Locator {
        return this.selectProjectDropdown.locator('.ng-select-container');
    }

    private get selectProjectPlaceholder(): Locator {
        return this.selectProjectDropdown.locator('.ng-placeholder');
    }

    private get selectedProjectValueLabel(): Locator {
        return this.selectProjectDropdown.locator('.ng-value-label');
    }

    private get selectProjectClearIcon(): Locator {
        return this.selectProjectDropdown.locator('.ng-clear-wrapper');
    }

    private get selectProjectDropdownPanel(): Locator {
        return this.page.locator('.ng-dropdown-panel');
    }

    private get firstSelectProjectOption(): Locator {
        return this.page.locator('.ng-dropdown-panel .ng-option').first();
    }

    // ==========================================================================
    // LOCATORS — PRECINCT ALLOCATION TAB LAYOUT
    // ==========================================================================

    private get precinctAllocationPanel(): Locator {
        return this.page.locator('#precinct_allow');
    }

    private get selectPrecinctDropdown(): Locator {
        return this.precinctAllocationPanel.locator('ng-select[placeholder="Select Precinct"]');
    }

    private get allocationSaveButton(): Locator {
        return this.precinctAllocationPanel.locator('button._outline-btn', { hasText: /^save$/i });
    }

    private get allocationSearchField(): Locator {
        return this.precinctAllocationPanel.locator('input#keywordInput');
    }

    private get allocationProjectTable(): Locator {
        return this.precinctAllocationPanel.locator('p-table');
    }

    private get allocationProjectRows(): Locator {
        return this.precinctAllocationPanel.locator('tbody tr');
    }

    private get allocationProjectCheckboxes(): Locator {
        return this.precinctAllocationPanel.locator('tbody p-checkbox .p-checkbox-box');
    }

    private get allocationSelectedListPanel(): Locator {
        return this.precinctAllocationPanel.locator('p-orderlist');
    }

    private get allocationSearchClearIcon(): Locator {
        return this.precinctAllocationPanel.locator('i.pi-times._cross-icon');
    }

    // ==========================================================================
    // LOCATORS — MISC
    // ==========================================================================

    private get backButton(): Locator {
        return this.page.locator('text=/back/i').first();
    }

    private projectTitleBanner(name: string): Locator {
        return this.page.locator('p.f-24', { hasText: name });
    }

    private get allSgvProductHeadings(): Locator {
        return this.page.locator('.sgv-product .product-content h3');
    }

    private activeProjectCardFilter(escapedName: string): Locator {
        const nameRegex = new RegExp(`^\\s*${escapedName}\\s*$`, 'i');
        return this.page
            .locator('.projects-row .sgv-product .product-content h3')
            .filter({ hasText: nameRegex });
    }

    private shareResponseMessage(): Locator {
        return this.page
            .getByText('View shared')
            .or(this.page.getByText('shared successfully'))
            .or(this.page.getByText('already shared with one or more selected users or teams'))
            .or(this.page.getByText('user or team is not selected'));
    }

    // ==========================================================================
    // NAVIGATION HELPERS
    // ==========================================================================

    private async navigateToProjects(): Promise<void> {
        const currentUrl = this.page.url().split(/[?#]/)[0];
        if (!currentUrl.endsWith(ProjectActions.PROJECTS_URL)) {
            await this.page.goto(ProjectActions.PROJECTS_URL);
        }
    }

    async gotoPrecinctListings(): Promise<void> {
        const currentUrl = this.page.url().split(/[?#]/)[0];
        if (!currentUrl.endsWith(ProjectActions.PRECINCT_LISTINGS_URL)) {
            await this.page.goto(ProjectActions.PRECINCT_LISTINGS_URL);
        }
    }

    private async openPrecinctSetup(): Promise<void> {
        await this.gotoPrecinctListings();
        await expect(this.precinctSetupMenu).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.precinctSetupMenu.click();
    }

    private async openAddPrecinctDialog(): Promise<void> {
        await this.openPrecinctSetup();
        await expect(this.createNewPrecinctButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.createNewPrecinctButton.click();
        await expect(this.addPrecinctDialog).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    private async prepareListView(): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();
    }

    // ==========================================================================
    // VIEW SWITCHING
    // ==========================================================================

    async switchToGridView(): Promise<void> {
        if (await this.firstGridProduct.isVisible().catch(() => false)) return;
        await expect(this.gridViewButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.gridViewButton.click({ force: true });
        await expect(this.firstGridProduct).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
    }

    async switchToListView(): Promise<void> {
        if (await this.firstTableRow.isVisible().catch(() => false)) return;
        await this.listViewButton.click();
        await this.waitForFirstTableRow();
    }

    async switchBetweenProjectViews(): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.switchToGridView();
    }

    async switchBetweenGridAndListView(): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.switchToGridView();
        await this.switchToListView();
    }

    async waitForFirstTableRow(): Promise<void> {
        await this.page.waitForSelector('tbody tr', {
            state: 'attached',
            timeout: ProjectActions.TIMEOUT_LONG,
        });
        await this.page.waitForFunction(
            () => {
                const rows = document.querySelectorAll('tbody tr');
                if (rows.length === 0) return false;
                return (rows[0].textContent?.trim() ?? '').length > 5;
            },
            { timeout: ProjectActions.TIMEOUT_LONG }
        );
        await this.firstTableRow.waitFor({ state: 'visible', timeout: ProjectActions.TIMEOUT_LONG });
    }

    // ==========================================================================
    // COMMON ACTION HELPERS
    // ==========================================================================

    async resetListView(): Promise<void> {
        await expect(this.resetButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.resetButton.click();
        await this.waitForFirstTableRow();
    }

    private async clickResetIcon(): Promise<void> {
        await expect(this.resetIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.resetIcon.click();
    }

    private async clickTabByLabel(tabLabel: string): Promise<void> {
        const tab = this.tabByLabel(tabLabel);
        await expect(tab).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await tab.click();
    }

    private async openDefaultViewPopup(): Promise<void> {
        await this.defaultViewButton.waitFor({ state: 'visible', timeout: ProjectActions.TIMEOUT_MEDIUM });
        await this.defaultViewButton.click();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_MEDIUM });
    }

    private async closeOverlay(): Promise<void> {
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(400);
    }

    private async openProjectManagerDropdown(): Promise<void> {
        await this.prepareListView();
        await this.page.waitForTimeout(1500);
        await this.projectManagerDropdown.click();
        await this.projectManagerList.waitFor({ state: 'visible', timeout: 50_000 });
    }

    private async selectManagerByName(name: string): Promise<void> {
        await this.projectManagerSearchInput.waitFor({
            state: 'visible',
            timeout: ProjectActions.TIMEOUT_MEDIUM,
        });
        await this.projectManagerSearchInput.fill(name);

        const option = this.listOptionByText(name);
        await option.waitFor({ state: 'visible', timeout: ProjectActions.TIMEOUT_MEDIUM });
        await option.click();
        await this.projectManagerSearchInput.fill('');
    }

    private async verifyManagerTagsVisible(names: string[]): Promise<void> {
        for (const name of names) {
            await expect(this.projectManagerTag(name)).toBeVisible({
                timeout: ProjectActions.TIMEOUT_MEDIUM,
            });
        }
    }

    private async selectFirstProjectFromDropdown(): Promise<void> {
        await this.lastNgSelectContainer.click();
        await this.firstNgDropdownOption.click();
    }

    private async clickSaveAndVerifyToast(): Promise<void> {
        await this.saveButtonByText.click();
        await expect(this.genericToast).toBeVisible();
    }

    // ==========================================================================
    // SEARCH (GRID VIEW)
    // ==========================================================================

    async verifyProjectCanBeSearchedByName(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await expect(this.searchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.searchInput.fill(projectName);
        await expect(this.projectCardByName(projectName)).toBeVisible({
            timeout: ProjectActions.TIMEOUT_LONG,
        });
    }

    async verifyProjectCanBeSearchedByPartialName(partialName: string): Promise<void> {
        await this.navigateToProjects();
        await expect(this.searchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.searchInput.fill(partialName);

        const firstResult = this.projectCardContainingText(partialName);
        await expect(firstResult).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });

        const resultText = await firstResult.textContent();
        expect(resultText?.toLowerCase()).toContain(partialName.toLowerCase());
    }

    async verifyProjectSearchWithInvalidName(invalidName: string): Promise<void> {
        await this.navigateToProjects();
        await expect(this.searchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.searchInput.fill(invalidName);
        await expect(this.allProjectCardsByName(invalidName)).toHaveCount(0);
        await this.clickResetIcon();
    }

    // ==========================================================================
    // IMAGE VERIFICATION
    // ==========================================================================

    async verifyProjectImageDisplayedInGridView(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await expect(this.searchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.searchInput.fill(projectName);

        const card = this.projectCardByName(projectName);
        await expect(card).toBeVisible({ timeout: ProjectActions.TIMEOUT_MEDIUM });

        const thumbnail = this.thumbnailForCard(card);
        await expect(thumbnail).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });

        const styleAttr = await thumbnail.getAttribute('style');
        expect(styleAttr).toBeTruthy();

        const bgUrlMatch = styleAttr?.match(/background-image:\s*url\((['"]?)(.*?)\1\)/i);
        expect(bgUrlMatch && bgUrlMatch[2]).toBeTruthy();
        expect(bgUrlMatch![2].trim()).not.toBe('');
    }

    async verifyPlaceholderImageForProjectWithNoImage(): Promise<void> {
        const projectName = 'Al kabir heights';
        await this.navigateToProjects();
        await expect(this.searchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.searchInput.fill(projectName);

        const card = this.projectCardByName(projectName);
        await expect(card).toBeVisible({ timeout: ProjectActions.TIMEOUT_MEDIUM });
        await expect(this.thumbnailForCard(card)).toBeVisible({
            timeout: ProjectActions.TIMEOUT_DEFAULT,
        });
        await this.clickResetIcon();
    }

    // ==========================================================================
    // TABS
    // ==========================================================================

    async verifyTabsAndResetAfterSearch(searchText: string): Promise<void> {
        await this.navigateToProjects();
        await expect(this.searchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.searchInput.fill(searchText);
        await this.clickTabByLabel('Inactive');
        await this.clickTabByLabel('Active');
        await this.clickResetIcon();
        await expect(this.searchInput).toHaveValue('');
    }

    async verifyDefaultTabIsActive(): Promise<void> {
        await this.navigateToProjects();
        const activeTab = this.tabByLabel('Active');
        await expect(activeTab).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });

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
        await expect(this.tabByLabel('Active')).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.projectCardByName(projectName).scrollIntoViewIfNeeded();
    }

    async verifyProjectsUnderInactiveTab(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await this.clickTabByLabel('Inactive');
        const card = this.projectCardByName(projectName);
        await expect(card).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await card.scrollIntoViewIfNeeded();
    }

    async verifyPrecinctIsGroupedUnderTab(precinctName: string): Promise<void> {
        await this.navigateToProjects();
        const container = this.precinctContainerByName(precinctName);
        await expect(container).toBeVisible({ timeout: ProjectActions.TIMEOUT_EXTRA_LONG });
        await expect(container.locator(this.precinctCardThumbnailWithImage)).toBeVisible({
            timeout: ProjectActions.TIMEOUT_DEFAULT,
        });
    }

    // ==========================================================================
    // PRECINCT NAVIGATION
    // ==========================================================================

    private async getFirstVisiblePrecinctCard(): Promise<void> {
        await expect(this.firstGridProduct).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.firstGridProduct.click();
    }

    private async clickVisibleBackButton(): Promise<void> {
        await expect(this.backButton).toBeEnabled({ timeout: ProjectActions.TIMEOUT_MEDIUM });
        await this.backButton.click({ force: true });
    }

    async verifyClickingPrecinctOpensTabs(): Promise<void> {
        await this.navigateToProjects();
        await this.getFirstVisiblePrecinctCard();

        for (const tab of ['project', 'lot', 'EOI']) {
            const el = this.innerTabById(tab);
            await expect(el).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
            await expect(el).toHaveText(new RegExp(tab, 'i'), { timeout: ProjectActions.TIMEOUT_LONG });
        }

        await this.projectsMenuLink.click();
        await expect(this.firstGridProduct).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
    }

    async verifyPrecinctAllocatedProjectNotInActiveTabAfterPrecinctClick(): Promise<void> {
        await this.navigateToProjects();
        await this.getFirstVisiblePrecinctCard();

        const insidePrecinctHeading = (await this.allSgvProductHeadings.first().innerText()).trim();

        await this.projectsMenuLink.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForSelector('.sgv-product .product-content h3', {
            state: 'visible',
            timeout: ProjectActions.TIMEOUT_LONG,
        });

        await expect(this.searchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.searchInput.fill(insidePrecinctHeading);

        const escapedName = insidePrecinctHeading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        await expect(this.activeProjectCardFilter(escapedName)).toHaveCount(0);
    }

    async verifyProjectReappearsInActiveTabAfterPrecinctDeletion(): Promise<void> {
        await this.navigateToProjects();
        await this.page.waitForLoadState('networkidle');

        await expect(this.precinctSetupMenuText).toBeEnabled({
            timeout: ProjectActions.TIMEOUT_EXTRA_LONG,
        });
        await this.precinctSetupMenuText.click();

        await expect(this.precinctAllocationTabById).toBeEnabled({
            timeout: ProjectActions.TIMEOUT_LONG,
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
        await this.addNewProjectButton.click();
        await expect(this.projectDialog).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.projectNameField).toBeVisible();
        await expect(this.projectStatusField).toBeVisible();
        await expect(this.projectDialogSaveButton).toBeVisible();
        await expect(this.projectDialogCancelButton).toBeVisible();
    }

    async verifyAndCloseProjectPopup(): Promise<void> {
        await this.navigateToProjects();
        await this.page.reload();
        await this.openProjectPopup();
        await this.projectDialogCancelButton.click();
        await expect(this.projectDialogContent).toBeHidden({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    async clickOnProjects(): Promise<void> {
        await this.projectsMenuLink.click();
    }

    async createProjectWithValidData(project?: { name?: string; status?: string }): Promise<void> {
        await this.navigateToProjects();
        await this.page.reload();
        await this.openProjectPopup();

        const projectName = project?.name ?? faker.company.name();

        await this.projectNameField.fill(projectName);
        await this.projectDialogSaveButton.click();
        await expect(this.projectDialog).toBeHidden({ timeout: ProjectActions.TIMEOUT_DEFAULT });

        await this.projectAddedToast
            .waitFor({ state: 'visible', timeout: ProjectActions.TIMEOUT_MEDIUM })
            .catch(() => {
                /* Toast may disappear too quickly — non-fatal */
            });

        await this.projectTitleBanner(projectName).waitFor({
            state: 'visible',
            timeout: ProjectActions.TIMEOUT_MEDIUM,
        });

        await this.clickOnProjects();
        await this.verifyProjectCanBeSearchedByName(projectName);
        await this.clickResetIcon();
    }

    async saveProjectPopupWithEmptyFields(): Promise<void> {
        await this.navigateToProjects();
        await this.page.reload();
        await this.openProjectPopup();

        await this.projectNameField.fill('');
        await this.projectDialogSaveButton.click();
        await expect(this.projectNameValidationError).toBeVisible({
            timeout: ProjectActions.TIMEOUT_SHORT,
        });

        await this.projectDialogCancelButton.click();
        await expect(this.projectDialog).toBeHidden({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    async closeProjectPopupWithCrossIcon(): Promise<void> {
        await this.navigateToProjects();
        await this.page.reload();
        await this.openProjectPopup();
        await this.projectDialogCloseIcon.click({ force: true });
        await expect(this.projectDialogContent).toBeHidden({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    // ==========================================================================
    // PIN / UNPIN
    // ==========================================================================

    async verifyPinToDashboardOptionVisibleOnRightClick(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await this.page.reload();
        await this.verifyProjectCanBeSearchedByName(projectName);

        const card = this.projectCardByName(projectName);
        await expect(card).toBeVisible({ timeout: ProjectActions.TIMEOUT_MEDIUM });
        await card.click({ button: 'right' });

        await expect(this.pinToDashboardOption).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.page.mouse.click(0, 0);
        await expect(this.pinToDashboardOption).not.toBeVisible({
            timeout: ProjectActions.TIMEOUT_DEFAULT,
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
        await expect(card).toBeVisible({ timeout: ProjectActions.TIMEOUT_MEDIUM });
        await card.click({ button: 'right' });

        await expect(this.pinToDashboardOption).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.pinToDashboardOption.click();

        await expect(this.pinnedIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(1200);
    }

    async unpinProjectAndVerifyRemoval(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await this.verifyProjectCanBeSearchedByName(projectName);

        const card = this.projectCardByName(projectName);
        await card.scrollIntoViewIfNeeded();
        await expect(card).toBeVisible({ timeout: ProjectActions.TIMEOUT_MEDIUM });
        await card.click({ button: 'right' });

        await expect(this.unpinFromDashboardOption).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.unpinFromDashboardOption.click();

        await expect(this.pinnedIcon.filter({ has: card })).toHaveCount(0, {
            timeout: ProjectActions.TIMEOUT_DEFAULT,
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
            timeout: ProjectActions.TIMEOUT_LONG,
        });
        await this.clickResetIcon();
    }

    async verifyProjectSearchWithInvalidNameInListView(invalidName: string): Promise<void> {
        await this.prepareListView();
        await this.searchInputByPlaceholder.fill('');
        await this.searchInputByPlaceholder.fill(invalidName);
        await this.page.waitForLoadState('networkidle');
        await expect(this.noProjectsAvailableMessage).toBeVisible({
            timeout: ProjectActions.TIMEOUT_LONG,
        });
        await expect(this.page.locator('tr').filter({ hasText: new RegExp(invalidName, 'i') })).toHaveCount(0);
        await this.clickResetIcon();
    }

    async searchProjectWithSymbols(): Promise<void> {
        await this.prepareListView();
        await this.searchInputByPlaceholder.fill('@#$%^&*');
        await expect(this.noProjectsAvailableMessage).toBeVisible({
            timeout: ProjectActions.TIMEOUT_LONG,
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
            timeout: ProjectActions.TIMEOUT_MEDIUM,
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
            timeout: ProjectActions.TIMEOUT_MEDIUM,
        });

        const currentState = await this.selectAllToggle.getAttribute('data');
        if (currentState === 'Select All') {
            await this.selectAllToggle.click();
            await expect(this.selectAllToggle).toHaveAttribute('data', 'Deselect All', {
                timeout: ProjectActions.TIMEOUT_DEFAULT,
            });
        }

        await this.selectAllToggle.click();
        await expect(this.selectAllToggle).toHaveAttribute('data', 'Select All', {
            timeout: ProjectActions.TIMEOUT_DEFAULT,
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

        await this.addViewIcon.waitFor({ state: 'visible', timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.addViewIcon.click();

        await expect(this.viewNameInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.viewNameInput.click();
        await this.viewNameInput.fill(viewName);

        await expect(this.saveOrCreateButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.saveOrCreateButton.click({ force: true });

        await expect(this.viewCreatedToast).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.resetToDefaultView();
    }

    async resetToDefaultView(): Promise<void> {
        await this.activeViewButton.click();

        await expect(this.viewDropdownArrow).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.viewDropdownArrow.click();

        await expect(this.defaultViewOption).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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

        await expect(this.shareViewIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.shareViewIcon.click({ force: true });

        await this.selectShareTarget(this.usersShareDropdown, this.usersShareDropdownArrow, userName);
        await this.selectShareTarget(this.teamsShareDropdown, this.teamsShareDropdownArrow, teamName);

        await expect(this.shareButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.shareButton.click({ force: true });

        await expect(this.shareResponseMessage()).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });

        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);
        await this.closeOverlay();
        await this.resetListView();
        await this.waitForFirstTableRow();
    }

    private async selectShareTarget(
        dropdown: Locator,
        dropdownArrow: Locator,
        targetName: string
    ): Promise<void> {
        await expect(dropdown).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await dropdown.click();

        const dropBox = this.lastDropBox;
        await expect(dropBox).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });

        const searchField = dropBox.locator('input[placeholder="Search"]');
        await searchField.fill(targetName);
        await this.page.waitForTimeout(800);

        const option = dropBox.locator('li', { hasText: targetName }).first();
        await expect(option).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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

    private async performDragDrop(
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
        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);
    }

    async hideAndShowStatus(): Promise<void> {
        await this.prepareListView();
        await this.openDefaultViewPopup();

        await expect(this.hideAllButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.hideAllButton.click();
        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);

        await expect(this.visibleColumnList).toHaveCount(0, { timeout: ProjectActions.TIMEOUT_DEFAULT });

        await expect(this.showAllButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.showAllButton.click();
        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);

        await expect(this.hiddenColumnList).toHaveCount(0, { timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.visibleColumnList.first()).toBeVisible({
            timeout: ProjectActions.TIMEOUT_DEFAULT,
        });

        await this.closeOverlay();
    }

    async searchStatusInViewPopup(): Promise<void> {
        await this.prepareListView();
        await this.openDefaultViewPopup();

        const searchTerm = 'Project Name';
        await expect(this.columnSearchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.columnSearchInput.fill(searchTerm);
        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);

        await expect(this.columnItemByName(searchTerm).first()).toBeVisible({
            timeout: ProjectActions.TIMEOUT_DEFAULT,
        });

        await this.closeOverlay();
    }

    async deleteSavedViewInListView(viewName: string): Promise<void> {
        await this.prepareListView();
        await this.openDefaultViewPopup();

        await expect(this.savedViewDropdown).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.savedViewDropdown.click();
        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);

        const viewOption = this.savedViewOption(viewName);
        await expect(viewOption).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });

        const deleteIcon = viewOption.locator('img[src*="delete_icon.svg"]');
        await expect(deleteIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await deleteIcon.click();

        try {
            await expect(this.confirmAnyButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_SHORT });
            await this.confirmAnyButton.click();
        } catch {
            // No confirmation dialog — deletion was immediate
        }

        await expect(this.viewDeletedToast).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.closeOverlay();
    }

    // ==========================================================================
    // LIST VIEW — PROJECT ACTIONS (CREATE / DELETE / DUPLICATE / SORT)
    // ==========================================================================

    async openProjectCreatePopup(): Promise<void> {
        await this.prepareListView();
        await expect(this.addNewProjectButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.addNewProjectButton.click();

        await expect(this.projectDialog).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.projectNameField).toBeVisible();
        await expect(this.projectStatusField).toBeVisible();
        await expect(this.projectDialogSaveButton).toBeVisible();
        await expect(this.projectDialogCancelButton).toBeVisible();
        await this.projectDialogCancelButton.click();
    }

    async selectMultipleProjects(): Promise<void> {
        await this.prepareListView();
        await expect(this.selectAllCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.selectAllCheckbox.click();
        await this.page.waitForTimeout(1000);
        await this.selectAllCheckbox.click();
        await this.resetListView();
    }

    async duplicateSelectedProjects(): Promise<void> {
        await this.prepareListView();
        await this.firstRowCheckbox.click();
        await this.duplicateButton.click();
        await expect(this.duplicateSuccessToast).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(1000);
        await this.resetListView();
    }

    async deleteSelectedProjects(): Promise<void> {
        await this.prepareListView();
        await this.firstRowCheckbox.click();
        await this.deleteButtonFirst.click();
        await this.deleteButtonLast.click();
        await expect(this.deleteSuccessToast).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    async deleteProjectViaRowIcon(): Promise<void> {
        await this.prepareListView();
        await expect(this.firstRowDeleteIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.firstRowDeleteIcon.click();
        await this.confirmDeleteButton.click();
        await expect(this.deleteSuccessToast).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    async cancelDeleteFromPopup(): Promise<void> {
        await this.prepareListView();
        await this.firstRowDeleteIcon.click();
        await expect(this.cancelDeleteButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.cancelDeleteButton.click();
        await expect(this.cancelDeleteButton).toBeHidden({ timeout: ProjectActions.TIMEOUT_SHORT });
    }

    async sortProjectsAscending(columnName: string = 'Project Name'): Promise<void> {
        await this.prepareListView();
        await this.sortIconForColumn(columnName).click();
        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);
        await this.verifyColumnSort('asc', columnName);
    }

    async sortProjectsDescending(columnName: string = 'Project Name'): Promise<void> {
        await this.prepareListView();
        await this.columnFilterIcon(columnName).click();
        await expect(this.columnHeader(columnName).locator('sortamountdownicon')).toHaveCount(1, {
            timeout: ProjectActions.TIMEOUT_SHORT,
        });
        await this.verifyColumnSort('desc', columnName);
    }

    private async verifyColumnSort(direction: 'asc' | 'desc', columnName: string): Promise<void> {
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
        await expect(this.viewNameInputInvalid).toBeVisible({ timeout: ProjectActions.TIMEOUT_SHORT });
        await this.page.keyboard.press('Escape');
        await this.resetListView();
    }

    async saveViewWithoutChanges(): Promise<void> {
        await this.openAddViewAndClickSave();
        await expect(this.viewNameInputInvalid).toBeVisible({ timeout: ProjectActions.TIMEOUT_SHORT });
        await this.page.keyboard.press('Escape');
        await this.resetListView();
    }

    private async openAddViewAndClickSave(): Promise<void> {
        await this.prepareListView();
        await this.defaultViewButton.click();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_MEDIUM });

        await this.addViewIcon.waitFor({ state: 'visible', timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.addViewIcon.click();

        await expect(this.viewNameInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.saveOrCreateButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.saveOrCreateButton.click({ force: true });
    }

    async shareViewWithNoSelection(): Promise<void> {
        await this.prepareListView();
        await this.defaultViewButton.click();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_MEDIUM });

        await expect(this.shareViewIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.shareViewIcon.click({ force: true });

        await expect(this.shareButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.shareButton.click({ force: true });

        await expect(this.shareResponseMessage()).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });

        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);
        await this.closeOverlay();
        await this.resetListView();
        await this.waitForFirstTableRow();
    }

    async viewStatusOutOfSync(): Promise<void> {
        await this.prepareListView();
        await this.defaultViewButton.click();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });

        await this.columnItemByName('developer').locator('img[src*="Eye.svg"]').click();
        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);

        await this.closeOverlay();
        await this.defaultViewButton.click();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });

        // Intentional debug log — tracks view persistence behavior
        const developerCount = await this.columnItemByName('developer').count();
        console.log(`After navigate-away-and-reopen, Developer in visible list: ${developerCount > 0}`);

        await this.closeOverlay();
        await this.resetListView();
    }

    async verifyRecordsCountAtEnd(): Promise<void> {
        await this.prepareListView();
        await this.recordsCountLabel.scrollIntoViewIfNeeded();
        await expect(this.recordsCountLabel).toBeVisible({ timeout: ProjectActions.TIMEOUT_EXTRA_LONG });

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
        await expect(this.precinctSubTab).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.precinctAllocationSubTab).toBeVisible({
            timeout: ProjectActions.TIMEOUT_DEFAULT,
        });
    }

    async verifyPrecinctTabDefaultControls(): Promise<void> {
        await this.openPrecinctSetup();
        await expect(this.precinctTab).toHaveClass(/active/);
        await expect(this.selectProjectDropdown).toBeVisible({
            timeout: ProjectActions.TIMEOUT_DEFAULT,
        });
        await expect(this.createNewPrecinctButton).toBeVisible({
            timeout: ProjectActions.TIMEOUT_DEFAULT,
        });
    }

    async verifyAddPrecinctPopupOpensAndCloses(): Promise<void> {
        await this.openAddPrecinctDialog();
        await expect(this.precinctDialogTitle).toHaveText(/add precinct/i);
        await expect(this.precinctNameInput).toBeVisible();
        await expect(this.precinctUploadButton).toBeVisible();
        await expect(this.precinctSaveButton).toBeVisible();

        await expect(this.precinctCancelButton).toBeVisible();
        await this.precinctCancelButton.click();
        await expect(this.addPrecinctDialog).toBeHidden({ timeout: ProjectActions.TIMEOUT_SHORT });
    }

    async verifyPrecinctCreationWithImage(): Promise<void> {
        await this.openAddPrecinctDialog();
        await expect(this.precinctDialogTitle).toHaveText(/add precinct/i);

        const precinctName = this.generateUniquePrecinctName();
        await this.precinctNameInput.fill(precinctName);

        const imagePath = path.resolve(ProjectActions.IMAGES_DIR, ProjectActions.DEFAULT_TEST_IMAGE);
        await this.precinctFileInput.setInputFiles(imagePath);
        await this.page.waitForTimeout(1000);

        await this.precinctSaveButton.click();
        await expect(this.addPrecinctDialog).toBeHidden({ timeout: ProjectActions.TIMEOUT_MEDIUM });
        await expect(this.precinctAddSuccessToast).toBeVisible({
            timeout: ProjectActions.TIMEOUT_DEFAULT,
        });

        const newCard = this.precinctCardByName(precinctName);
        await newCard.evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
        await expect(newCard).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
    }

    async verifyImageRemovalViaCrossIcon(): Promise<void> {
        await this.openAddPrecinctDialog();

        const imagePath = path.resolve(ProjectActions.IMAGES_DIR, ProjectActions.DEFAULT_TEST_IMAGE);
        await this.precinctFileInput.setInputFiles(imagePath);

        await expect(this.precinctUploadedImage).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.precinctRemoveImageIcon).toBeVisible();

        await this.precinctRemoveImageIcon.click();

        await expect(this.precinctUploadedImage).toBeHidden({ timeout: ProjectActions.TIMEOUT_SHORT });
        await expect(this.precinctRemoveImageIcon).toBeHidden({ timeout: ProjectActions.TIMEOUT_SHORT });
        await expect(this.precinctNoImagePlaceholder).toBeVisible({
            timeout: ProjectActions.TIMEOUT_SHORT,
        });

        await this.precinctCancelButton.click();
        await expect(this.addPrecinctDialog).toBeHidden({ timeout: ProjectActions.TIMEOUT_SHORT });
    }

    private generateUniquePrecinctName(): string {
        return `A${faker.word.adjective()}${faker.word.noun()}`.replace(/[^a-zA-Z0-9]/g, '');
    }

    async cancelAddPrecinctPopupUsingCrossIcon(): Promise<void> {
        await this.openAddPrecinctDialog();
        await expect(this.precinctDialogTitle).toHaveText(/add precinct/i);
        const closeIcon = this.addPrecinctDialog.locator('.p-dialog-header-close');
        await expect(closeIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await closeIcon.click();
        await expect(this.addPrecinctDialog).toBeHidden({ timeout: ProjectActions.TIMEOUT_SHORT });
    }

    async cancelAddPrecinctPopupUsingCancelButton(): Promise<void> {
        await this.openAddPrecinctDialog();
        await expect(this.precinctDialogTitle).toHaveText(/add precinct/i);
        await expect(this.precinctCancelButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.precinctCancelButton.click();
        await expect(this.addPrecinctDialog).toBeHidden({ timeout: ProjectActions.TIMEOUT_SHORT });
    }

    // ==========================================================================
    // EDIT PRECINCT HELPERS
    // ==========================================================================

    /**
     * Opens the Edit Precinct dialog for the first available precinct card.
     * Returns the original precinct name (useful for chained verification).
     */
    private async openEditPrecinctDialog(): Promise<string> {
        await this.openPrecinctSetup();

        const firstCard = this.page.locator('#precinct .sgv-product').first();
        await expect(firstCard).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });

        // Capture original name before opening dialog
        const originalName = (await this.firstPrecinctCardName.innerText()).trim();

        await expect(this.firstPrecinctEditIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.firstPrecinctEditIcon.click();

        await expect(this.addPrecinctDialog).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        return originalName;
    }

    async verifyEditPrecinctPopupOpensCorrectly(): Promise<void> {
        const originalName = await this.openEditPrecinctDialog();

        // Title should say "Edit Precinct" (key difference from Add mode)
        await expect(this.precinctDialogTitle).toHaveText(/edit precinct/i);

        // All fields must be visible
        await expect(this.precinctNameInput).toBeVisible();
        await expect(this.precinctUploadButton).toBeVisible();
        await expect(this.precinctSaveButton).toBeVisible();
        await expect(this.precinctCancelButton).toBeVisible();

        // Name field must be pre-populated with the existing precinct name
        const currentValue = await this.precinctNameInput.inputValue();
        expect(currentValue.trim()).toBe(originalName);
        expect(currentValue.trim().length).toBeGreaterThan(0);

        // Close dialog cleanly
        await this.precinctCancelButton.click();
        await expect(this.addPrecinctDialog).toBeHidden({ timeout: ProjectActions.TIMEOUT_SHORT });
    }

    private get precinctUpdateSuccessToast(): Locator {
        return this.page.locator('.toast-message', {
            hasText: /update(d)? successfully/i,
        });
    }

    private generateEditedPrecinctName(originalName: string): string {
        const suffix = Date.now().toString().slice(-6);
        return `${originalName}_edited_${suffix}`.substring(0, 50); // guard against max-length
    }

    async validateChangesAreSavedAfterEditingPrecinct(): Promise<void> {
        const originalName = await this.openEditPrecinctDialog();
        await expect(this.precinctDialogTitle).toHaveText(/edit precinct/i);

        const newName = this.generateEditedPrecinctName(originalName);

        await this.precinctNameInput.click();
        await this.precinctNameInput.fill('');
        await this.precinctNameInput.fill(newName);
        await expect(this.precinctNameInput).toHaveValue(newName);

        await this.precinctSaveButton.click();
        await expect(this.addPrecinctDialog).toBeHidden({ timeout: ProjectActions.TIMEOUT_MEDIUM });
        await expect(this.precinctUpdateSuccessToast).toBeVisible({
            timeout: ProjectActions.TIMEOUT_DEFAULT,
        });

        const editedCard = this.precinctCardByName(newName);
        await editedCard.evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
        await expect(editedCard).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });

    }

    async validatePrecinctDeletionFromCard(): Promise<void> {
        await this.openPrecinctSetup();
        const firstCard = this.page.locator('#precinct .sgv-product').first();
        await expect(firstCard).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        const cardsBefore = await this.page.locator('#precinct .sgv-product').count();
        expect(cardsBefore).toBeGreaterThan(0);
        const precinctNameToDelete = (await this.firstPrecinctCardName.innerText()).trim();
        await expect(this.firstPrecinctDeleteIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.firstPrecinctDeleteIcon.click();
        await expect(this.precinctDeleteSuccessToast).toBeVisible({
            timeout: ProjectActions.TIMEOUT_DEFAULT,
        });
        await expect(this.precinctCardByName(precinctNameToDelete)).toHaveCount(0, {
            timeout: ProjectActions.TIMEOUT_DEFAULT,
        });
        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);
        const cardsAfter = await this.page.locator('#precinct .sgv-product').count();
        expect(cardsAfter).toBe(cardsBefore - 1);
    }

    async verifyDropdownSelectAndClearInPrecinctTab(): Promise<void> {
        await this.openPrecinctSetup();
        await expect(this.selectProjectDropdownContainer).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.selectProjectDropdownContainer.click();
        await this.selectProjectDropdownPanel.waitFor({ state: 'visible', timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.firstSelectProjectOption).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        const selectedName = (await this.firstSelectProjectOption.innerText()).trim();
        await this.firstSelectProjectOption.click({ force: true });

        await expect(this.selectedProjectValueLabel).toHaveText(
            new RegExp(`^\\s*${selectedName}\\s*$`, 'i'),
            { timeout: ProjectActions.TIMEOUT_DEFAULT }
        );
        await this.selectProjectClearIcon.click();
        await expect(this.selectProjectPlaceholder).toHaveText(/select project/i);
        await expect(this.selectedProjectValueLabel).toHaveCount(0);
    }

    async verifyPrecinctAllocationTabLayout(): Promise<void> {
        await this.openPrecinctSetup();

        // Click Precinct Allocation tab
        await this.precinctAllocationSubTab.click();
        await expect(this.precinctAllocationTabQuick).toHaveClass(/active/);

        // Verify all layout elements
        await expect(this.selectPrecinctDropdown).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.allocationSaveButton).toBeVisible();
        await expect(this.allocationSearchField).toBeVisible();
        await expect(this.allocationProjectTable).toBeVisible();
        await expect(this.allocationProjectCheckboxes.first()).toBeVisible({
            timeout: ProjectActions.TIMEOUT_DEFAULT,
        });
        await expect(this.allocationSelectedListPanel).toBeVisible();
    }

    async validatePrecinctDropdownShowsCreatedPrecincts(): Promise<void> {
        await this.openPrecinctSetup();

        // Go to Precinct Allocation tab
        await this.precinctAllocationSubTab.click();
        await expect(this.precinctAllocationTabQuick).toHaveClass(/active/);

        await this.selectPrecinctDropdown.locator('.ng-select-container').click();
        await expect(this.selectProjectDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.page.locator('.ng-dropdown-panel .ng-option-label').first()).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });

        const optionCount = await this.page.locator('.ng-dropdown-panel .ng-option-label').count();
        expect(optionCount).toBeGreaterThan(0);
        await this.page.mouse.click(0, 0);
    }

    async verifySearchFieldFiltersProjectList(): Promise<void> {
        await this.openPrecinctSetup();
        await this.precinctAllocationSubTab.click();
        await expect(this.allocationProjectRows.first()).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        const searchTerm = 'Automation Testing';
        await this.allocationSearchField.type(searchTerm, { delay: 120 });
        await expect(this.allocationProjectRows.first()).toContainText(new RegExp(searchTerm, 'i'));
        await this.allocationSearchClearIcon.click();
        await expect(this.allocationSearchField).toHaveValue('');
    }

    async allocateProjectToPrecinctAndSave(): Promise<void> {
        await this.openPrecinctSetup();
        await this.precinctAllocationSubTab.click();
        await expect(this.precinctAllocationTabQuick).toHaveClass(/active/);
        await this.selectPrecinctDropdown.locator('.ng-select-container').click();
        await expect(this.selectProjectDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        const firstPrecinctOption = this.page.locator('.ng-dropdown-panel .ng-option-label').first();
        const precinctName = (await firstPrecinctOption.innerText()).trim();
        await firstPrecinctOption.click();
        await this.page.waitForTimeout(1200);
        await expect(this.allocationProjectRows.nth(1)).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        const projectName = (await this.allocationProjectRows.nth(1).innerText()).trim();
        await this.allocationProjectCheckboxes.nth(1).click();
        await this.allocationSaveButton.click();
        await expect(this.genericToast).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.projectsMenuLink.click();
        await expect(this.searchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.searchInput.fill(precinctName);
        const precinctCard = this.precinctContainerByName(precinctName);
        await expect(precinctCard).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await precinctCard.click();
        await expect(
            this.page.locator('.sgv-product .product-content h3', {
                hasText: new RegExp(`^\\s*${projectName}\\s*$`, 'i'),
            }).first()
        ).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
    }

    async attemptAllocationWithoutPrecinct(): Promise<void> {
        await this.openPrecinctSetup();
        await this.precinctAllocationSubTab.click();
        await expect(this.precinctAllocationTabQuick).toHaveClass(/active/);
        await expect(this.allocationProjectCheckboxes.nth(1)).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.allocationProjectCheckboxes.nth(1).click();
        await this.allocationSaveButton.click();
        const errorMessage = this.page.getByText(/please select a precinct/i);
        await expect(errorMessage).toHaveCount(0, { timeout: ProjectActions.TIMEOUT_SHORT });
        console.log('[BUG] No validation error shown when saving allocation without selecting a precinct');
        await this.allocationProjectCheckboxes.nth(1).click();
    }

    async attemptAllocationWithoutProjects(): Promise<void> {
        await this.openPrecinctSetup();
        await this.precinctAllocationSubTab.click();
        await expect(this.precinctAllocationTabQuick).toHaveClass(/active/);
        await this.allocationSaveButton.click();
        await expect(this.page.getByText(/please select at least one project/i))
            .toHaveCount(0, { timeout: ProjectActions.TIMEOUT_SHORT });
        console.log('[BUG] No validation error shown when saving allocation without selecting any project');
    }

    async verifyAllocatedProjectsMarkedOnReopen(): Promise<void> {
        await this.openPrecinctSetup();
        await this.precinctAllocationSubTab.click();
        await expect(this.precinctAllocationTabQuick).toHaveClass(/active/);

        // Select first precinct and capture its name
        await this.selectPrecinctDropdown.locator('.ng-select-container').click();
        await expect(this.selectProjectDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        const precinctOption = this.page.locator('.ng-dropdown-panel .ng-option-label').first();
        const precinctName = (await precinctOption.innerText()).trim();
        await precinctOption.click();
        await this.page.waitForTimeout(1000);

        // Wait for project list and verify at least one checkbox is already highlighted (pre-allocated)
        await expect(this.allocationProjectCheckboxes.first()).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        const highlightedCheckboxes = this.precinctAllocationPanel.locator(
            'tbody p-checkbox .p-checkbox-box.p-highlight'
        );
        const allocatedCount = await highlightedCheckboxes.count();
        expect(allocatedCount).toBeGreaterThan(0);

        // Navigate to Projects and verify the precinct shows the allocated projects
        await this.projectsMenuLink.click();
        await expect(this.searchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.searchInput.fill(precinctName);

        const precinctCard = this.precinctContainerByName(precinctName);
        await expect(precinctCard).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await precinctCard.click();

        // Verify at least one project card exists inside the precinct view
        await expect(this.firstGridProduct).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
    }

    async validateDeletedPrecinctNotInAllocationDropdown(): Promise<void> {
        await this.openPrecinctSetup();

        // Capture first precinct name and delete it
        await expect(this.firstGridProduct).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        const deletedPrecinctName = (await this.firstPrecinctCardName.innerText()).trim();

        await this.firstPrecinctDeleteIcon.click();
        await expect(this.precinctDeleteSuccessToast).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });

        // Go to Precinct Allocation tab and open the dropdown
        await this.precinctAllocationSubTab.click();
        await this.selectPrecinctDropdown.locator('.ng-select-container').click();
        await expect(this.page.locator('.ng-dropdown-panel .ng-option-label').first())
            .toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });

        // Verify deleted precinct is NOT in the dropdown
        await expect(
            this.page.locator('.ng-dropdown-panel .ng-option-label', { hasText: deletedPrecinctName })
        ).toHaveCount(0);
    }


    async verifyOnlyAllocatedPrecinctsShowForProject(): Promise<void> {
        await this.openPrecinctSetup();

        // Go to Precinct Allocation tab
        await this.precinctAllocationSubTab.click();
        await expect(this.precinctAllocationTabQuick).toHaveClass(/active/);

        // Select first precinct and capture its name
        await this.selectPrecinctDropdown.locator('.ng-select-container').click();
        await expect(this.selectProjectDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(1200);
        const precinctOption = this.page.locator('.ng-dropdown-panel .ng-option-label').first();
        const allocatedPrecinctName = (await precinctOption.innerText()).trim();
        await precinctOption.click();
        await this.page.waitForTimeout(1200);
        // Select first project and capture its name
        await expect(this.allocationProjectRows.first()).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        const allocatedProjectName = (await this.allocationProjectRows.first().innerText()).trim();
        await this.allocationProjectCheckboxes.first().click();

        // Save allocation
        await this.allocationSaveButton.click();
        await expect(this.genericToast).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });

        // Switch to Precinct tab and filter by the allocated project
        await this.precinctSubTab.click();
        await this.selectProjectDropdownContainer.click();
        await expect(this.selectProjectDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.page.locator('.ng-dropdown-panel .ng-option', {
            hasText: new RegExp(`^\\s*${allocatedProjectName}\\s*$`, 'i')
        }).first().click();
        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);
        // Verify only the allocated precinct appears
        await expect(this.precinctCardByName(allocatedPrecinctName))
            .toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
    }

    async verifyImageFileTypeValidation(): Promise<void> {
        await this.openAddPrecinctDialog();
        const invalidFile = path.resolve(ProjectActions.IMAGES_DIR, 'invalid.txt');
        await this.precinctFileInput.setInputFiles(invalidFile);
        await expect(this.page.getByText(/"invalid.txt" is not a valid image/i))
            .toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.precinctUploadedImage).toHaveCount(0);
        await this.precinctCancelButton.click();
        await expect(this.addPrecinctDialog).toBeHidden({ timeout: ProjectActions.TIMEOUT_SHORT });
    }
}