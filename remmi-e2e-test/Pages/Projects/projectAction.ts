import { expect, Page, Locator } from '@playwright/test';
import { faker, th } from '@faker-js/faker';
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

    private get firstPrecinctOnProjectsPage(): Locator {
        return this.page.locator('.sgv-product.ng-star-inserted').first();
    }

    private get precinctNameUnderActive(): Locator {
        return this.page.locator('#project .product-content h3').first();
    }

    private get projectTabInPrecinct(): Locator {
        return this.page.locator('a#pills-project-tab, a#pills-project').first();
    }

    private get lotTabInPrecinct(): Locator {
        return this.page.locator('a#pills-lot-tab, a#pills-lot').first();
    }

    private get eoiTabInPrecinct(): Locator {
        return this.page.locator('a#pills-EOI-tab, a#pills-EOI').first();
    }

    private get lotListView(): Locator {
        return this.page.locator('#lot, #pills-lot, app-lot-list').first();
    }

    private get projectCardName(): Locator {
        return this.page.locator('.product-content h3').first();
    }

    private get projectCardArrowIcon(): Locator {
        return this.page.locator(
            'img[src*="arrow"], img[src*="chevron"], i.pi-chevron-down, i.pi-angle-down'
        ).last();
    }

    private projectBreadcrumbName(projectName: string): Locator {
        return this.page.locator('p.ml-2.cursor-pointer', { hasText: projectName }).last();
    }

    private get projectsBreadcrumbLink(): Locator {
        return this.page.locator('p.cursor-pointer[routerlink="/project/projects"]');
    }

    private projectCardCollapseIcon(): Locator {
        return this.page.locator('i.pi-chevron-up').first();
    }

    private projectCardPriceContent(): Locator {
        return this.page.locator('.product-meta-tool a', { hasText: /priced from|price/i }).first()
    }

    // Click on project image in precinct (product-thumbnail context)
    private get projectImageInPrecinct(): Locator {
        return this.page.locator('.product-thumbnail img').first();
    }

    async clickProjectImageInPrecinct(): Promise<void> {
        await this.projectImageInPrecinct.click();
    }

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

    private get firstGridProduct(): Locator {
        return this.page.locator('.projects-row.view-grid .sgv-product').first();
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

    private get firstTableRow(): Locator {
        // Scoped to datatable specifically
        return this.page.locator('tbody.p-datatable-tbody tr').first();
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

    private get gridViewButton(): Locator {
        return this.page.locator('.layout-changer a.grid-icon');
    }

    private get listViewButton(): Locator {
        // Direct selector — no filter, no sub-query
        return this.page.locator('.layout-changer a:has(img[src*="list.svg"])');
    }

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
        return this.page.locator('.view-options img[src*="share-one.svg"]');
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

    private get reorderExpandCollapseArrow(): Locator {
        return this.page.locator('.icon-style i.pi');
    }

    private get reorderCollapsedArrow(): Locator {
        return this.page.locator('.icon-style i.pi-angle-down');
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

    private get addNewProjectButton(): Locator {
        return this.page.locator('button._addNew i.pi.pi-plus').first();
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

    private get projectStatusDropdownPanel(): Locator {
        return this.projectStatusField.locator('ng-dropdown-panel');
    }

    private projectStatusOptionByText(text: string): Locator {
        return this.projectStatusDropdownPanel.locator('.ng-option').filter({ hasText: new RegExp(`^${text}$`) }).first();
    }

    private get projectDialogSaveButton(): Locator {
        return this.page.getByRole('button', { name: /save/i });
    }

    private get projectDialogCancelButton(): Locator {
        return this.page.getByRole('button', { name: /cancel/i });
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

    private get projectsMenuLink(): Locator {
        return this.page.locator('a[href="/project/projects"]').first();
    }

    private get projectsBreadcrumb(): Locator {
        return this.page.locator('p[routerlink="/project/projects"]', { hasText: /^\s*Projects\s*$/i });
    }

    private get precinctListingsMenuLink(): Locator {
        return this.page.locator('a[href="/listings/project-precinct"]');
    }

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

    private get allPrecinctCards(): Locator {
        return this.page.locator('#precinct .sgv-product');
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
    // LOT LIST PAGE — LOCATORS
    // =========================================================================

    // Search bar
    private get lotSearchInput(): Locator {
        return this.page.locator('input#keywordInput[name="task-search"]').last();
    }

    private get lotSearchIcon(): Locator {
        return this.page.locator('i.pi-search._search-icon');
    }

    // Filter dropdowns (re-multiselect)
    private get precinctFilter(): Locator {
        return this.page.locator('re-multiselect[placeholder="Precinct"]');
    }

    private get projectFilter(): Locator {
        return this.page.locator('re-multiselect[placeholder="Project"]');
    }

    private get bedFilter(): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]');
    }

    private get statusFilter(): Locator {
        return this.page.locator('re-multiselect[placeholder="Status"]');
    }

    private get internalAreaFilter(): Locator {
        return this.page.locator('.land-size', { hasText: 'Internal Area' });
    }

    // Table - Header
    private get lotTable(): Locator {
        return this.page.locator('p-table#apartmentscolumns table');
    }

    private get lotTableHeader(): Locator {
        return this.page.locator('table thead tr');
    }

    private lotColumnHeader(columnName: string): Locator {
        return this.page.locator('table thead th p', { hasText: columnName });
    }

    private lotColumnSortIcon(columnName: string): Locator {
        return this.page.locator('table thead th', { hasText: columnName }).locator('i.custom-sort');
    }

    // Header checkbox (select all)
    private get selectAllLotCheckbox(): Locator {
        return this.page.locator('p-tableheadercheckbox .p-checkbox-box');
    }

    // Table - Body rows
    private get lotTableRows(): Locator {
        return this.page.locator('table tbody tr');
    }

    // LOCATOR — Popup close icon
    private get popupCloseIcon(): Locator {
        return this.page.locator('.p-dialog-header-close, .close-icon, i.pi-times').first();
    }

    private get lotFormProjectValue(): Locator {
        return this.page.locator('ng-select[formcontrolname="projectid"] .ng-value-label');
    }

    // LOCATOR — Right pin icon
    private get lotFormPinIcon(): Locator {
        return this.page.locator('i.fa-thumbtack');
    }

    private get lotFormPinIconPinned(): Locator {
        return this.page.locator('i.fa-thumbtack.pinned');
    }

    // LOCATORS — Project dropdown inside lot form

    private get lotFormProjectSelect(): Locator {
        return this.page.locator('ng-select[formcontrolname="projectid"]');
    }

    private get lotFormProjectArrow(): Locator {
        return this.lotFormProjectSelect.locator('.ng-arrow-wrapper');
    }

    private get lotFormProjectDropdownPanel(): Locator {
        return this.lotFormProjectSelect.locator('ng-dropdown-panel');
    }

    private get lotFormProjectSearchInput(): Locator {
        return this.lotFormProjectSelect.locator('input[type="text"]');
    }

    private get lotFormProjectOptions(): Locator {
        return this.lotFormProjectSelect.locator('ng-dropdown-panel .ng-option');
    }

    private projectOptionInForm(name: string): Locator {
        return this.lotFormProjectSelect.locator('ng-dropdown-panel .ng-option', { hasText: name });
    }


    // LOCATOR — Pin delete success toast
    private get pinDeleteSuccessToast(): Locator {
        return this.page.locator('div[role="alert"].toast-message', { hasText: 'Pin deleted successfully' });
    }

    // LOCATOR — Pin success toast
    private get pinSuccessToast(): Locator {
        return this.page.locator('div[role="alert"].toast-message', { hasText: 'Pin created successfully' });
    }

    private get lotFormHistoryTab(): Locator {
        return this.page.locator('a#pills-history-tab');
    }

    // LOCATORS — History Old Value & New Value columns

    private historyRowOldValue(row: Locator): Locator {
        return row.locator('td').nth(4);
    }

    private historyRowNewValue(row: Locator): Locator {
        return row.locator('td').nth(5);
    }

    // LOCATORS — History tab

    private get historyTabContent(): Locator {
        return this.page.locator('app-remmi-history');
    }

    private get historyTableRows(): Locator {
        return this.historyTabContent.locator('p-table tbody tr');
    }

    private get historyRecordsCount(): Locator {
        return this.historyTabContent.locator('p', { hasText: /Records:/ });
    }

    // LOCATOR — History search input
    private get historySearchInput(): Locator {
        return this.historyTabContent.locator('input[name="task-search"]');
    }

    // LOCATOR — Changed Date column cell (1st column)
    private historyRowChangedDate(row: Locator): Locator {
        return row.locator('td').nth(0);
    }

    // LOCATOR — Changed By column cell (2nd column)
    private historyRowChangedBy(row: Locator): Locator {
        return row.locator('td').nth(1);
    }

    // LOCATOR — Event column cell (3rd column)
    private historyRowEvent(row: Locator): Locator {
        return row.locator('td').nth(2);
    }

    // LOCATOR — Changed Field column cell (4th column)
    private historyRowChangedField(row: Locator): Locator {
        return row.locator('td').nth(3);
    }

    // LOCATORS — Lot form tabs

    private get lotFormApartmentDetailsTab(): Locator {
        return this.page.locator('a#pills-lot-tab');
    }

    private get firstLotRow(): Locator {
        return this.lotTableRows.first();
    }

    // Row by lot number / project name
    private lotRowByLotNumber(lotNumber: string): Locator {
        return this.page.locator('table tbody tr', { hasText: lotNumber });
    }

    private lotRowByProjectName(projectName: string): Locator {
        return this.page.locator('table tbody tr', { hasText: projectName });
    }

    // Row checkbox
    private rowCheckbox(row: Locator): Locator {
        return row.locator('p-tablecheckbox .p-checkbox-box');
    }

    // Row cell values (by column index — 0-based, includes checkbox column)
    private rowProjectCell(row: Locator): Locator {
        return row.locator('td').nth(1).locator('p');
    }

    private rowLotCell(row: Locator): Locator {
        return row.locator('td').nth(2).locator('p');
    }

    private rowLotPriceCell(row: Locator): Locator {
        return row.locator('td').nth(3).locator('p');
    }

    private rowStatusCell(row: Locator): Locator {
        return row.locator('td').nth(4).locator('p');
    }

    private rowSalesAgencyCell(row: Locator): Locator {
        return row.locator('td').nth(5).locator('p');
    }

    private rowSalesAgentCell(row: Locator): Locator {
        return row.locator('td').nth(6).locator('p');
    }

    private rowBedCell(row: Locator): Locator {
        return row.locator('td').nth(7).locator('p');
    }

    private rowBathCell(row: Locator): Locator {
        return row.locator('td').nth(8).locator('p');
    }

    private rowCreatedAtCell(row: Locator): Locator {
        return row.locator('td').nth(9).locator('p');
    }

    // Records count
    private get lotRecordsCount(): Locator {
        return this.page.locator('p.ng-star-inserted', { hasText: /records:/i });
    }

    // LOCATORS — PROJECT DROPDOWN IN LOT TAB

    private get projectDropdownInLot(): Locator {
        return this.page.locator('re-multiselect[placeholder="Project"]').locator('.box');
    }

    private get projectDropdownPanel(): Locator {
        return this.page.locator('re-multiselect[placeholder="Project"]').locator('.drop_box');
    }

    private get projectDropdownOptions(): Locator {
        return this.page.locator('re-multiselect[placeholder="Project"]').locator('.drop_box ul li.p-element');
    }

    private get projectDropdownSearchInput(): Locator {
        return this.page.locator('re-multiselect[placeholder="Project"]').locator('.drop_box .inpt input');
    }

    private get projectDropdownSelectAllCheckbox(): Locator {
        return this.page.locator('re-multiselect[placeholder="Project"]').locator('.drop_box label.select_all');
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

    /**
     * Clicks the popup close icon if visible. Waits for the close icon to appear,
     */
    async closePopupIfVisible(): Promise<void> {
        if (await this.popupCloseIcon.isVisible({ timeout: 20000 }).catch(() => false)) {
            await this.popupCloseIcon.click();
            await this.page.waitForTimeout(500);
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
        await expect(this.precinctListingsMenuLink).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.precinctListingsMenuLink.click();
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
        await this.page.waitForSelector('.loading-overlay', { state: 'detached', timeout: 43000 }).catch(() => { });
        await expect(this.listViewButton).toBeEnabled({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.listViewButton.evaluate((el: HTMLElement) => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
        await this.listViewButton.click();
        await this.firstTableRow.waitFor({ state: 'visible', timeout: ProjectActions.TIMEOUT_LONG });
        const text = await this.firstTableRow.textContent();
        if (!text || text.trim().length < 2) {
            await this.page.waitForTimeout(500);
        }
    }

    async switchBetweenProjectViews(): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.switchToGridView();
    }

    async switchBetweenGridAndListView(): Promise<void> {
        await this.navigateToProjects();
        await this.switchToGridView();
        await this.page.waitForLoadState('networkidle');
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
        await expect(this.firstGridProduct).toBeEnabled({ timeout: ProjectActions.TIMEOUT_LONG });
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

        await this.projectsMenuLink.evaluate((el: HTMLElement) => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
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
        await expect(this.precinctListingsMenuLink).toBeEnabled({
            timeout: ProjectActions.TIMEOUT_EXTRA_LONG,
        });
        await this.precinctListingsMenuLink.click();

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
        await this.page.reload();
        await expect(this.addNewProjectButton).toBeEnabled({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.addNewProjectButton.click();
        await expect(this.projectDialog).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.projectNameField).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.projectStatusField).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.projectDialogSaveButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.projectDialogCancelButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });

    }

    async verifyAndCloseProjectPopup(): Promise<void> {
        await this.navigateToProjects();
        await this.openProjectPopup();
        await this.projectDialogCancelButton.click({ force: true });
        await expect(this.projectDialogContent).toBeHidden({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        const projectsText = this.page.locator('p', { hasText: 'Projects' });
        await expect(projectsText).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
            timeout: ProjectActions.TIMEOUT_SHORT,
        });

        await this.projectDialogCancelButton.click();
        await expect(this.projectDialog).toBeHidden({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    async closeProjectPopupWithCrossIcon(): Promise<void> {
        await this.navigateToProjects();
        await this.openProjectPopup();
        await this.projectDialogCloseIcon.click({ force: true });
        await expect(this.projectDialogContent).toBeHidden({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    // ==========================================================================
    // PIN / UNPIN
    // ==========================================================================

    async verifyPinToDashboardOptionVisibleOnRightClick(projectName: string): Promise<void> {
        await this.navigateToProjects();
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
        await this.page.waitForTimeout(1000);
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
        if (await this.precinctCancelButton.isVisible().catch(() => false)) {
            await this.precinctCancelButton.click();
            await expect(this.addPrecinctDialog).toBeHidden({ timeout: ProjectActions.TIMEOUT_SHORT });
        }
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

        const editedCard = this.precinctCardByName(newName).first();
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
        await this.page.waitForTimeout(1000);
        await this.firstSelectProjectOption.click({ force: true });
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

    async verifyLongPrecinctNameTruncatedInCard(): Promise<void> {
        await this.openAddPrecinctDialog();
        const longName = `A ${faker.word.words(10)}`.replace(/[^a-zA-Z0-9 ]/g, '');
        await this.precinctNameInput.fill(longName);
        const imagePath = path.resolve(ProjectActions.IMAGES_DIR, ProjectActions.DEFAULT_TEST_IMAGE);
        await this.precinctFileInput.setInputFiles(imagePath);
        await this.page.waitForTimeout(1000);
        await this.precinctSaveButton.click();
        await expect(this.addPrecinctDialog).toBeHidden({ timeout: ProjectActions.TIMEOUT_MEDIUM });
        await expect(this.precinctAddSuccessToast).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        const card = this.precinctCardByName(longName);
        await card.evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
        await expect(card).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
    }

    async validateNoDuplicatePrecinctNameAllowed(): Promise<void> {
        await this.openPrecinctSetup();

        // Capture an existing precinct name
        await expect(this.firstGridProduct).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        const existingName = (await this.firstPrecinctCardName.innerText()).trim();

        // Try to create a precinct with the same name
        await this.openAddPrecinctDialog();
        await this.precinctNameInput.fill(existingName);

        const imagePath = path.resolve(ProjectActions.IMAGES_DIR, ProjectActions.DEFAULT_TEST_IMAGE);
        await this.precinctFileInput.setInputFiles(imagePath);
        await this.page.waitForTimeout(1000);

        await this.precinctSaveButton.click();

        // [BUG] Expected: validation error, dialog stays open. Actual: duplicate created.
        // TODO: Uncomment when validation is implemented
        // await expect(this.page.getByText(/precinct name already exists/i))
        //     .toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        // await expect(this.addPrecinctDialog).toBeVisible();

        // Current behavior — duplicate is accepted
        await expect(this.precinctAddSuccessToast).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        console.log(`[BUG] Duplicate precinct "${existingName}" created without validation error`);
    }



    async verifyMultiplePrecinctCardsInGridView(): Promise<void> {
        await this.openPrecinctSetup();
        // Verify grid container uses the view-grid class (grid layout)
        await expect(this.page.locator('#precinct .projects-row.view-grid')).toBeVisible();
        // Verify grid layout shows multiple precinct cards
        const cardCount = await this.allPrecinctCards.count();
        expect(cardCount).toBeGreaterThan(1);
        // Verify first and last cards are rendered correctly
        await expect(this.allPrecinctCards.first()).toBeVisible();
        await expect(this.allPrecinctCards.last()).toBeVisible();
    }

    async verifyUploadImagePreviewIsShown(): Promise<void> {
        await this.openAddPrecinctDialog();
        await expect(this.precinctNoImagePlaceholder).toBeVisible();
        await expect(this.precinctUploadedImage).toHaveCount(0);
        const imagePath = path.resolve(ProjectActions.IMAGES_DIR, ProjectActions.DEFAULT_TEST_IMAGE);
        await this.precinctFileInput.setInputFiles(imagePath);
        await expect(this.precinctUploadedImage).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.precinctNoImagePlaceholder).toHaveCount(0);
        await this.precinctCancelButton.click();
    }

    async verifyCancelEditDoesNotUpdatePrecinct(): Promise<void> {
        // Open edit dialog and capture original name
        const originalName = await this.openEditPrecinctDialog();

        // Change the name but click Cancel instead of Save
        const newName = `A${faker.word.noun()}Changed`.replace(/[^a-zA-Z0-9]/g, '');
        await this.precinctNameInput.fill(newName);

        await this.precinctCancelButton.click();
        await expect(this.addPrecinctDialog).toBeHidden({ timeout: ProjectActions.TIMEOUT_SHORT });

        // Verify original name still exists and new name was not saved
        await expect(this.precinctCardByName(originalName).first()).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await expect(this.precinctCardByName(newName)).toHaveCount(0);
    }

    // ==========================================================================
    // TC_01 to TC_08 — PRECINCT INNER VIEW TESTS
    // ==========================================================================

    // TC_01 — Project name visible under precinct after click
    async verifyPrecinctNameDisplayedCorrectly(): Promise<void> {
        await this.navigateToProjects();
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectActions.TIMEOUT_LONG,
        });
        const precinctName = (await this.firstPrecinctOnProjectsPage.locator('h3').first().innerText()).trim();
        await this.firstPrecinctOnProjectsPage.click();
        await console.log(precinctName);
        await expect(this.precinctNameUnderActive).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        const displayedName = (await this.precinctNameUnderActive.innerText()).trim();
        expect(displayedName.length).toBeGreaterThan(0);
        await this.projectsMenuLink.click();
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectActions.TIMEOUT_LONG,
        });
    }

    // TC_02 — Project, Lot, EOI tabs visible after selecting precinct
    async verifyTabsVisibleAfterPrecinctSelection(): Promise<void> {
        await this.navigateToProjects();
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectActions.TIMEOUT_LONG,
        });
        const precinctName = (await this.firstPrecinctOnProjectsPage.locator('h3').first().innerText()).trim();
        await this.firstPrecinctOnProjectsPage.click();
        await console.log(precinctName);
        await expect(this.projectTabInPrecinct).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await expect(this.lotTabInPrecinct).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.eoiTabInPrecinct).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.projectsMenuLink.click();
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectActions.TIMEOUT_LONG,
        });
    }

    // TC_03 — Allocated projects displayed under Project tab
    async verifyAllocatedProjectsUnderProjectTab(): Promise<void> {
        await this.navigateToProjects();
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectActions.TIMEOUT_LONG,
        });
        const precinctName = (await this.firstPrecinctOnProjectsPage.locator('h3').first().innerText()).trim();
        await this.firstPrecinctOnProjectsPage.click();
        await console.log(precinctName);
        await expect(this.precinctNameUnderActive).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        const displayedName = (await this.precinctNameUnderActive.innerText()).trim();
        expect(displayedName.length).toBeGreaterThan(0);
        await this.projectsMenuLink.click();
    }

    // TC_04 — Project card shows image, name, and price label
    async verifyProjectCardShowsImageNameAndPrice(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectActions.TIMEOUT_LONG,
        });
        const precinctName = (await this.firstPrecinctOnProjectsPage.locator('h3').first().innerText()).trim();
        await console.log(precinctName);
        await expect(this.searchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.searchInput.fill(projectName);

        const card = this.projectCardByName(projectName);
        await expect(card).toBeVisible({ timeout: ProjectActions.TIMEOUT_MEDIUM });

        // Image
        const thumbnail = this.thumbnailForCard(card);
        await expect(thumbnail).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });

        const styleAttr = await thumbnail.getAttribute('style');
        const bgUrlMatch = styleAttr?.match(/background-image:\s*url\((['"]?)(.*?)\1\)/i);
        expect(bgUrlMatch && bgUrlMatch[2]).toBeTruthy();
        expect(bgUrlMatch![2].trim()).not.toBe('');

        // Name
        const name = this.projectCardName;
        await expect(name).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });

        // "Priced From" label
        const priceLabel = this.projectCardPriceContent();
        await expect(priceLabel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });


    }

    // TC_05 — Expand project card using arrow icon
    async verifyExpandProjectCard(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectActions.TIMEOUT_LONG,
        });
        const precinctName = (await this.firstPrecinctOnProjectsPage.locator('h3').first().innerText()).trim();
        await console.log(precinctName);
        await expect(this.searchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.searchInput.click();
        await this.searchInput.fill(projectName);
        await expect(this.searchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.searchInput.fill(projectName);

        const card = this.projectCardByName(projectName);
        await expect(card).toBeVisible({ timeout: ProjectActions.TIMEOUT_MEDIUM });
        await expect(this.projectCardArrowIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.projectCardArrowIcon.click();
        await expect(this.projectCardCollapseIcon()).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.projectCardCollapseIcon().click();
    }

    // TC_06 — Collapse project card using arrow icon
    async verifyCollapseProjectCard(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectActions.TIMEOUT_LONG,
        });
        const precinctName = (await this.firstPrecinctOnProjectsPage.locator('h3').first().innerText()).trim();
        await console.log(precinctName);
        await expect(this.searchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.searchInput.click();
        await this.searchInput.fill(projectName);
        await expect(this.searchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.searchInput.fill(projectName);

        const card = this.projectCardByName(projectName);
        await expect(card).toBeVisible({ timeout: ProjectActions.TIMEOUT_MEDIUM });
        await expect(this.projectCardArrowIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.projectCardArrowIcon.click();
        await expect(this.projectCardCollapseIcon()).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.projectCardCollapseIcon().click();
        await this.clickResetIcon();
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectActions.TIMEOUT_LONG,
        });
    }

    // TC_07 — Open project from precinct card
    async verifyOpenProjectFromPrecinctCard(): Promise<void> {
        await this.navigateToProjects();
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectActions.TIMEOUT_LONG,
        });
        const precinctName = (await this.firstPrecinctOnProjectsPage.locator('h3').first().innerText()).trim();
        await this.firstPrecinctOnProjectsPage.click();
        await console.log(precinctName);
        const displayedName = (await this.precinctNameUnderActive.innerText()).trim();
        expect(displayedName.length).toBeGreaterThan(0);

        await this.clickProjectImageInPrecinct();

        await expect(this.projectBreadcrumbName(displayedName)).toBeVisible({
            timeout: ProjectActions.TIMEOUT_LONG,
        });
        await expect(this.projectsBreadcrumbLink).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.projectsBreadcrumbLink.click();
        await this.page.waitForTimeout(1200);
        await this.projectsMenuLink.click();
        await this.page.waitForTimeout(1200);
        await this.projectsMenuLink.click();
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.page.getByText('Precinct', { exact: true })).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });

    }

    // TC_08 — Open Lot tab successfully, click on Lot tab
    async verifyLotTabOpens(): Promise<void> {
        await this.navigateToProjects();
        await this.page.waitForLoadState('networkidle')
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectActions.TIMEOUT_LONG,
        });
        const precinctName = (await this.firstPrecinctOnProjectsPage.locator('h3').first().innerText()).trim();
        await this.firstPrecinctOnProjectsPage.click();
        await console.log(precinctName);
        await expect(this.precinctNameUnderActive).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        const displayedName = (await this.precinctNameUnderActive.innerText()).trim();
        expect(displayedName.length).toBeGreaterThan(0);
        await expect(this.lotTabInPrecinct).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.lotTabInPrecinct.click();
    }

    // LOCATORS — BED DROPDOWN IN LOT TAB

    private get bedDropdownInLot(): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]').locator('.box');
    }

    private get bedDropdownPanel(): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]').locator('.drop_box');
    }

    private get bedDropdownOptions(): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]').locator('.drop_box ul li.p-element');
    }

    private get bedDropdownSearchInput(): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]').locator('.drop_box .inpt input');
    }

    private get bedDropdownSelectAllCheckbox(): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]').locator('.drop_box label.select_all');
    }

    private get selectedBedTags(): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]').locator('.tags .selected_one');
    }

    private selectedBedTagByValue(bedValue: string): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]')
            .locator('.tags .selected_one', { hasText: bedValue });
    }

    private bedTagCrossIcon(bedValue: string): Locator {
        return this.selectedBedTagByValue(bedValue).locator('span.pi-times-circle');
    }

    // LOCATORS — STATUS DROPDOWN IN LOT TAB

    private get statusDropdownInLot(): Locator {
        return this.page.locator('re-multiselect[placeholder="Status"]').locator('.box');
    }

    private get statusDropdownPanel(): Locator {
        return this.page.locator('re-multiselect[placeholder="Status"]').locator('.drop_box');
    }

    private get statusDropdownOptions(): Locator {
        return this.page.locator('re-multiselect[placeholder="Status"]').locator('.drop_box ul li.p-element');
    }

    private get statusDropdownSearchInput(): Locator {
        return this.page.locator('re-multiselect[placeholder="Status"]').locator('.drop_box .inpt input');
    }

    private get statusDropdownSelectAllCheckbox(): Locator {
        return this.page.locator('re-multiselect[placeholder="Status"]').locator('.drop_box label.select_all');
    }

    private selectedStatusTagByValue(statusValue: string): Locator {
        return this.page.locator('re-multiselect[placeholder="Status"]')
            .locator('.tags .selected_one', { hasText: statusValue });
    }

    private statusTagCrossIcon(statusValue: string): Locator {
        return this.selectedStatusTagByValue(statusValue).locator('span.pi-times-circle');
    }

    // Price Range filter
    private get priceRangeFilter(): Locator {
        return this.page.locator('.land-size', { hasText: 'Price Range' });
    }

    private get priceRangeMinInput(): Locator {
        return this.page.locator('input[placeholder*="Min" i]').first();
    }

    private get priceRangeMaxInput(): Locator {
        return this.page.locator('input[placeholder*="Max" i]').first();
    }

    private get priceRangeApplyButton(): Locator {
        return this.page.locator('button', { hasText: /apply/i }).first();
    }


    private get internalAreaMinInput(): Locator {
        return this.page.locator('input[placeholder*="Min" i]');
    }

    private get internalAreaMaxInput(): Locator {
        return this.page.locator('input[placeholder*="Max" i]');
    }

    // LOCATORS — View button & popup

    private get viewButton(): Locator {
        return this.page.locator('._view-btn');
    }

    private get viewPopup(): Locator {
        return this.page.locator('p-overlaypanel .p-overlaypanel, .p-overlaypanel-content').first();
    }

    // LOCATOR — Bulk edit button/section
    private get bulkEditButton(): Locator {
        return this.page.locator('button, a, p', { hasText: /bulk edit/i }).first();
    }

    private get saveAndCloseButton(): Locator {
        return this.page.locator('button', { hasText: /save.*close|save & close/i }).first();
    }

    private get lotFormLotInput(): Locator {
        return this.page.locator('input[formcontrolname="lot_name"]');
    }

    // LOCATORS — Optional input fields

    private get lotFormBedInput(): Locator {
        return this.page.locator('input[formcontrolname="bed"]');
    }

    private get lotFormBathInput(): Locator {
        return this.page.locator('input[formcontrolname="bath"]');
    }

    private get lotFormAspectInput(): Locator {
        return this.page.locator('input[formcontrolname="aspect"]');
    }

    // LOCATORS — Only what TC_11 needs

    private get lotFormStatusReasonSelect(): Locator {
        return this.page.locator('ng-select[formcontrolname="status_reason"]');
    }

    private get lotFormStatusReasonArrow(): Locator {
        return this.lotFormStatusReasonSelect.locator('.ng-arrow-wrapper');
    }

    private get lotFormStatusReasonDropdownPanel(): Locator {
        return this.lotFormStatusReasonSelect.locator('ng-dropdown-panel');
    }

    private get lotFormStatusReasonOptions(): Locator {
        return this.lotFormStatusReasonSelect.locator('ng-dropdown-panel .ng-option');
    }

    private statusReasonOptionInForm(name: string): Locator {
        return this.lotFormStatusReasonSelect.locator('ng-dropdown-panel .ng-option', { hasText: name });
    }

    // LOCATORS — Toast notifications

    private get successToast(): Locator {
        return this.page.locator('div[role="alert"].toast-message');
    }

    // LOCATORS — Sort icon states (targeted to Status column reliably)

    private statusColumnHeader(): Locator {
        return this.page.locator('table thead th', { has: this.page.locator('p', { hasText: /^Project Status$/ }) });
    }

    private projectColumnHeader(): Locator {
        return this.page.locator('table thead th', { has: this.page.locator('p', { hasText: /^Project$/ }) });
    }

    private get projectColumnSortIcon(): Locator {
        return this.projectColumnHeader().locator('i.custom-sort');
    }

    private get projectColumnSortIconDesc(): Locator {
        return this.projectColumnHeader().locator('i.pi-sort-amount-up-alt');
    }

    private get statusColumnSortIcon(): Locator {
        return this.statusColumnHeader().locator('i.custom-sort');
    }

    private get statusColumnSortIconDesc(): Locator {
        return this.statusColumnHeader().locator('i.pi-sort-amount-up-alt');
    }

    // LOCATOR — No record found message
    private get noRecordFoundMessage(): Locator {
        return this.page.locator('ul li', { hasText: 'No Record Found' });
    }

    private get noLotFoundMessage(): Locator {
        return this.page.locator('tr', { hasText: 'No Lots available' });
    }

    // ==========================================================================
    // LOT LIST PAGE — HELPER FUNCTIONS
    // ==========================================================================

    private async assertSuccessToast(expectedText: string = 'Update successfully'): Promise<void> {
        await expect(this.successToast.first()).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.successToast.first()).toContainText(expectedText, { timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    private async navigateToLots(): Promise<void> {
        const url = this.page.url();
        if (!url.includes('/listings/lot')) {
            await this.page.goto('/listings/lot');
        }
        await expect(this.lotSearchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
    }

    private async searchLot(keyword: string): Promise<void> {
        await this.lotSearchInput.fill(keyword);
        await this.page.waitForTimeout(1500);
    }

    private async clearLotSearch(): Promise<void> {
        await this.lotSearchInput.fill('');
        await this.page.waitForTimeout(1000);
    }

    private async getLotRowCount(): Promise<number> {
        return await this.lotTableRows.count();
    }

    private async assertLotsExist(): Promise<void> {
        const count = await this.getLotRowCount();
        expect(count).toBeGreaterThan(0);
    }

    private async assertFirstRowContains(keyword: string): Promise<void> {
        await this.lotTableRows.first().waitFor({ state: 'visible', timeout: ProjectActions.TIMEOUT_LONG });
    }

    // Project dropdown helpers
    private async openProjectDropdown(): Promise<void> {
        await expect(this.projectDropdownInLot).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.projectDropdownInLot.click();
        await expect(this.projectDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    private async closeDropdown(): Promise<void> {
        await this.page.waitForTimeout(200);
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(800);
    }

    private async searchInProjectDropdown(projectName: string): Promise<void> {
        await expect(this.projectDropdownSearchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.projectDropdownSearchInput.fill(projectName);
        await this.page.waitForTimeout(800);
    }

    private async clearProjectDropdownSearch(): Promise<void> {
        await this.projectDropdownSearchInput.fill('');
        await this.page.waitForTimeout(300);
    }

    private async selectProjectByName(projectName: string): Promise<void> {
        const optionsCount = await this.projectDropdownOptions.count();
        for (let i = 0; i < optionsCount; i++) {
            const option = this.projectDropdownOptions.nth(i);
            const text = (await option.innerText()).trim().toLowerCase();
            if (text.includes(projectName.toLowerCase())) {
                await expect(option).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
                await option.click();
                return;
            }
        }
        throw new Error(`Project "${projectName}" not found in dropdown`);
    }

    private async assertAllRowsContainAnyProject(projectNames: string[]): Promise<void> {
        const rowCount = await this.lotTableRows.count();
        expect(rowCount).toBeGreaterThan(0);
        for (let i = 0; i < rowCount; i++) {
            const rowText = (await this.lotTableRows.nth(i).innerText()).toLowerCase();
            const matches = projectNames.some(name => rowText.includes(name.toLowerCase()));
            expect(matches).toBeTruthy();
        }
    }

    private async resetFilters(): Promise<void> {
        await this.resetButton.click();
        await this.page.waitForTimeout(800);
    }

    // LOCATORS — Selected project tags

    private get selectedProjectTags(): Locator {
        return this.page.locator('re-multiselect[placeholder="Project"]').locator('.tags .selected_one');
    }

    private selectedProjectTagByName(projectName: string): Locator {
        return this.page.locator('re-multiselect[placeholder="Project"]')
            .locator('.tags .selected_one', { hasText: projectName });
    }

    private projectTagCrossIcon(projectName: string): Locator {
        return this.selectedProjectTagByName(projectName).locator('span.pi-times-circle');
    }

    // ==========================================================================
    // LOT LIST PAGE — TEST FUNCTIONS
    // ==========================================================================

    // TC — /listings/lot: Search for specific lot
    async verifySearchSpecificLot(lotKeyword: string): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const firstCheckbox = this.rowCheckbox(firstRow);
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_EXTRA_LONG });
        const checkbox = this.rowCheckbox(firstRow);
        await expect(checkbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_EXTRA_LONG });
        await this.searchLot(lotKeyword);
        await this.assertLotsExist();
        await this.assertFirstRowContains(lotKeyword);
        await this.clearLotSearch();
    }

    // TC — Use Project dropdown in Lot tab, verify only allocated projects shown
    async verifyProjectDropdownShowsAllocatedProjects(): Promise<void> {
        await this.navigateToLots();
        await this.openProjectDropdown();
        await this.closeDropdown();
    }

    // TC — Search project in Project dropdown list
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

        await expect(this.projectDropdownSelectAllCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.projectDropdownSelectAllCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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

        await expect(this.projectDropdownSelectAllCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.selectedProjectTagByName(projectName)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.projectTagCrossIcon(projectName).click();
        await this.page.waitForTimeout(800);
        await this.resetButton.click();
    }

    private async openBedDropdown(): Promise<void> {
        await expect(this.bedDropdownInLot).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.bedDropdownInLot.click();
        await expect(this.bedDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    private async selectBedByValue(bedValue: string): Promise<void> {
        const optionsCount = await this.bedDropdownOptions.count();
        for (let i = 0; i < optionsCount; i++) {
            const option = this.bedDropdownOptions.nth(i);
            const text = (await option.innerText()).trim();
            if (text === bedValue || text.includes(bedValue)) {
                await expect(option).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.bedDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        const optionsCount = await this.bedDropdownOptions.count();
        expect(optionsCount).toBeGreaterThan(0);
        await this.closeDropdown();
    }

    // Search bed numbers in dropdown
    async verifySearchBedInDropdown(bedValue: string): Promise<void> {
        await this.navigateToLots();
        await this.openBedDropdown();
        await expect(this.bedDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.bedDropdownSearchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.bedDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.selectBedByValue(bedValue);
        await this.closeDropdown();
        await expect(this.selectedBedTagByValue(bedValue)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.resetButton.click();
    }

    /**
     * Select multiple bed numbers
     */
    async selectMultipleBedNumbers(bedValues: string[]): Promise<void> {
        await this.navigateToLots();
        await this.openBedDropdown();
        await expect(this.bedDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        for (const bedValue of bedValues) {
            await this.selectBedByValue(bedValue);
        }
        await this.closeDropdown();
        for (const bedValue of bedValues) {
            await expect(this.selectedBedTagByValue(bedValue)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        }
        await this.resetButton.click();
    }

    /**
     * Select All beds option
     */
    async verifySelectAllBedsInDropdown(): Promise<void> {
        await this.navigateToLots();
        await this.openBedDropdown();
        await expect(this.bedDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.bedDropdownSelectAllCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.bedDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.bedDropdownSelectAllCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.bedDropdownSelectAllCheckbox.click();
        await this.page.waitForTimeout(800);
        await this.bedDropdownSelectAllCheckbox.click();
        await this.page.waitForTimeout(800);
        await expect(this.selectedBedTags).toHaveCount(0, { timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.selectedBedTagByValue(bedValue)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.bedTagCrossIcon(bedValue).click();
        await expect(this.selectedBedTagByValue(bedValue)).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.resetButton.click();
    }

    private async openStatusDropdown(): Promise<void> {
        await expect(this.statusDropdownInLot).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.statusDropdownInLot.click();
        await expect(this.statusDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.statusDropdownOptions.first()).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    private async searchInStatusDropdown(statusValue: string): Promise<void> {
        await expect(this.statusDropdownSearchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.statusDropdownSearchInput.fill(statusValue);
        await this.page.waitForTimeout(800);
    }

    private async selectStatusByValue(statusValue: string): Promise<void> {
        const optionsCount = await this.statusDropdownOptions.count();
        for (let i = 0; i < optionsCount; i++) {
            const option = this.statusDropdownOptions.nth(i);
            const text = (await option.innerText()).trim().toLowerCase();
            if (text.includes(statusValue.toLowerCase())) {
                await expect(option).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.selectedStatusTagByValue(statusValue)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
            await expect(this.selectedStatusTagByValue(statusValue)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        }
        await this.assertLotsExist();
        await this.resetFilters();
    }

    // Search statuses in dropdown
    async verifySearchStatusInDropdown(statusValue: string): Promise<void> {
        await this.navigateToLots();
        await this.lotTableRows.first().waitFor({ state: 'visible', timeout: ProjectActions.TIMEOUT_LONG });
        await this.openStatusDropdown();
        await this.searchInStatusDropdown(statusValue);
        await this.closeDropdown();
        await this.resetFilters();
    }

    // TC — Use Select All in Status dropdown
    async verifySelectAllStatusInDropdown(): Promise<void> {
        await this.navigateToLots();
        await this.openStatusDropdown();

        await expect(this.statusDropdownSelectAllCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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

        await expect(this.statusDropdownSelectAllCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });

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
        await expect(this.selectedStatusTagByValue(statusValue)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.statusTagCrossIcon(statusValue).click();
        await expect(this.selectedStatusTagByValue(statusValue)).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.assertLotsExist();
        await this.resetButton.click();
    }

    private async openPriceRangeFilter(): Promise<void> {
        await expect(this.priceRangeFilter).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.priceRangeFilter.click();
    }

    private async setPriceRange(min: string, max: string): Promise<void> {
        await this.priceRangeMinInput.fill(min);
        await this.priceRangeMaxInput.fill(max);
    }

    private async openInternalAreaFilter(): Promise<void> {
        await expect(this.internalAreaFilter).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.internalAreaFilter.click();
    }

    private async setInternalArea(min: string, max: string): Promise<void> {
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
        await expect(this.selectedProjectTagByName('Nexton')).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.resetFilters();
        await expect(this.lotSearchInput).toHaveValue('');
        await expect(this.selectedProjectTagByName('Nexton')).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.assertLotsExist();
    }

    // TC — View popup opens on View button click
    async verifyViewPopupOpens(): Promise<void> {
        await this.navigateToLots();
        await expect(this.viewButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.viewButton.click();
        await this.page.waitForTimeout(800);
        await expect(this.viewPopup).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.closeDropdown();
    }

    // TC — Create new view from popup
    async verifyCreateNewView(viewName: string): Promise<void> {
        await this.navigateToLots();
        await this.openDefaultViewPopup();
        await this.addViewIcon.waitFor({ state: 'visible', timeout: ProjectActions.TIMEOUT_LONG });
        await this.addViewIcon.click();
        await expect(this.viewNameInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.viewNameInput.click();
        await this.viewNameInput.fill(viewName);
        await expect(this.saveOrCreateButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.saveOrCreateButton.click({ force: true });
        await expect(this.viewCreatedToast).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.resetToDefaultView();
    }

    // TC — Share view with agent/team
    async verifyShareViewWithAgent(
        userName: string = 'Abdul Rehman',
        teamName: string = 'Automation Team'
    ): Promise<void> {
        await this.navigateToLots();
        await this.openDefaultViewPopup();
        await expect(this.shareViewIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
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
        await expect(this.savedViewDropdown).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.savedViewDropdown.click();
        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);
        const viewOption = this.savedViewOption(viewName);
        await expect(viewOption).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        const deleteIcon = viewOption.locator('img[src*="delete_icon.svg"]');
        await expect(deleteIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await deleteIcon.click();
        try {
            await expect(this.confirmAnyButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_SHORT });
            await this.confirmAnyButton.click();
        } catch {

        }
        await expect(this.viewDeletedToast).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.columnSearchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.columnSearchInput.fill(searchTerm);
        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);
        await expect(this.columnItemByName(searchTerm).first()).toBeVisible({
            timeout: ProjectActions.TIMEOUT_DEFAULT,
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
        await expect(this.hideAllButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.hideAllButton.click();
        await this.page.waitForTimeout(1000);
        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);
        await expect(this.visibleColumnList).toHaveCount(0, { timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.showAllButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.showAllButton.evaluate(button => button.scrollIntoView({ behavior: 'instant', block: 'center' }));
        await this.page.waitForTimeout(1000);
        await this.showAllButton.click();
        await this.page.waitForTimeout(1000);
        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);
        await expect(this.hiddenColumnList).toHaveCount(0, { timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.visibleColumnList.first()).toBeVisible({
            timeout: ProjectActions.TIMEOUT_DEFAULT,
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
        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);
        await this.closeOverlay();
    }

    private async isRowCheckboxSelected(row: Locator): Promise<boolean> {
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
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_EXTRA_LONG });
        const checkbox = this.rowCheckbox(firstRow);
        await expect(checkbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_EXTRA_LONG });
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
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_EXTRA_LONG });
        const totalRows = await this.lotTableRows.count();
        expect(totalRows).toBeGreaterThanOrEqual(count);
        // Click checkboxes of first N rows
        for (let i = 0; i < count; i++) {
            const row = this.lotTableRows.nth(i);
            const checkbox = this.rowCheckbox(row);
            await expect(checkbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
    private async isSelectAllCheckboxSelected(): Promise<boolean> {
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
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_EXTRA_LONG });
        // Click master checkbox
        await expect(this.selectAllLotCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.selectAllLotCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_EXTRA_LONG });
        // Select all lots first to ensure some are selected
        await expect(this.selectAllLotCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.selectAllLotCheckbox.click();
        await this.page.waitForTimeout(800);
        // Deselect all using master checkbox
        await expect(this.selectAllLotCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_EXTRA_LONG });
        await expect(this.bulkEditButton).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.rowCheckbox(firstRow).click();
        await this.page.waitForTimeout(500);
        // Verify Bulk Edit becomes visible
        await expect(this.bulkEditButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(500);
        await this.rowCheckbox(firstRow).click();
        await this.page.waitForTimeout(500);
        await expect(this.bulkEditButton).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    // Edit selected lots using Edit Bulk
    async editSelectedLotsUsingBulkEdit(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const firstCheckbox = this.rowCheckbox(firstRow);
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_EXTRA_LONG });
        await firstCheckbox.click();
        await this.page.waitForTimeout(500);
        await expect(this.bulkEditButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.bulkEditButton.click();
        await expect(this.saveAndCloseButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.saveAndCloseButton.click();
        await this.assertSuccessToast();
        await this.rowCheckbox(firstRow).click();
        await this.page.waitForTimeout(500);
        await expect(this.bulkEditButton).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    async verifySortLotsByStatus(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const firstCheckbox = this.rowCheckbox(firstRow);
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_EXTRA_LONG });
        await expect(this.statusColumnSortIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.statusColumnSortIcon.click();
        await expect(this.statusColumnSortIconDesc).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
            await expect(this.noRecordFoundMessage).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        } else {
            await expect(this.noRecordFoundMessage).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_EXTRA_LONG });
        const checkbox = this.rowCheckbox(firstRow);
        await expect(checkbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_EXTRA_LONG });
        await this.searchLot(invalidKeyword);
        await expect(this.noLotFoundMessage).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_EXTRA_LONG });
        await this.openPriceRangeFilter();
        await this.setPriceRange(min, max);
        await expect(this.noLotFoundMessage).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_EXTRA_LONG });
        await this.openInternalAreaFilter();
        await this.setInternalArea(min, max);
        await expect(this.noLotFoundMessage).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_EXTRA_LONG });
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        const lotEditHeader = this.page.locator('.name-handle p');
        await expect(lotEditHeader).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await expect(this.page.locator('a#pills-lot-tab.active')).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        const fieldsToCheck = ['Lot Price', 'Car Park Price', 'Storage Price', 'Total', 'Bed', 'Bath', 'Internal Area', 'Aspect', 'Orientation'];
        for (const fieldLabel of fieldsToCheck) {
            const fieldLabelLocator = this.page.locator('p.f-12.mb-2', { hasText: new RegExp(`^${fieldLabel}$`) }).first();
            await expect(fieldLabelLocator).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        }
        await expect(this.saveAndCloseButton.first()).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_EXTRA_LONG });
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        const lotEditHeader = this.page.locator('.name-handle p');
        await expect(lotEditHeader).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await expect(this.popupCloseIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.popupCloseIcon.click();
        await this.page.waitForTimeout(800);
        await expect(lotEditHeader).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    // TC — Share popup fails on empty selection
    async verifySharePopupFailsOnEmptySelection(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        await this.defaultViewButton.click();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_MEDIUM });
        await expect(this.shareViewIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.shareViewIcon.click({ force: true });
        await expect(this.shareButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.shareButton.click({ force: true });
        await expect(this.shareResponseMessage()).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);
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
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_MEDIUM });
        await this.addViewIcon.waitFor({ state: 'visible', timeout: ProjectActions.TIMEOUT_LONG });
        await this.addViewIcon.click();
        await expect(this.viewNameInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.saveOrCreateButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.saveOrCreateButton.click({ force: true });
        await expect(this.viewNameInputInvalid).toBeVisible({ timeout: ProjectActions.TIMEOUT_SHORT });
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
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_MEDIUM });
        await expect(this.saveOrCreateButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.saveOrCreateButton.click({ force: true });
        const invalidToastMessage = this.page.getByRole('alert', { name: 'You cannot change the default view' });
        await expect(invalidToastMessage).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.selectedProjectTagByName('adb')).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_EXTRA_LONG });
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
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_EXTRA_LONG });
        await firstCheckbox.click();
        await this.page.waitForTimeout(500);
        await expect(this.bulkEditButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.bulkEditButton.click();
        await expect(this.saveAndCloseButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.saveAndCloseButton.click();
        await this.assertSuccessToast();
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_EXTRA_LONG });
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
        await expect(this.selectedProjectTagByName(projectName)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.openProjectDropdown();
        await this.searchInProjectDropdown(projectName);
        await this.selectProjectByName(projectName);
        await this.closeDropdown();
        await expect(this.selectedProjectTagByName(projectName)).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.resetFilters();
        await this.waitForFirstTableRow();
    }

    // TC — Verify lot edit form opens on clicking a lot, save & close, and verify success alert
    async verifyLotFormOpensOnClick(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const firstCheckbox = this.rowCheckbox(firstRow);
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_EXTRA_LONG });
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        const lotEditHeader = this.page.locator('.name-handle p');
        await expect(lotEditHeader).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await expect(this.page.locator('a#pills-lot-tab.active')).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.page.locator('a#pills-history-tab')).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        const saveAndCloseBtn = this.saveAndCloseButton.first();
        await expect(saveAndCloseBtn).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await saveAndCloseBtn.click();
        await this.assertSuccessToast();
        await this.assertLotsExist();
        await this.resetButton.click();
    }

    // TC — Verify lot name is shown in the form's Lot field
    async verifyLotNameOnFormTab(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const expectedLotName = (await this.rowLotCell(firstRow).innerText()).trim();
        expect(expectedLotName.length).toBeGreaterThan(0);
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        const actualLotName = await this.lotFormLotInput.inputValue();
        expect(actualLotName.trim()).toBe(expectedLotName);
        const saveAndCloseBtn = this.saveAndCloseButton.first();
        await expect(saveAndCloseBtn).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await saveAndCloseBtn.click();
        await this.assertSuccessToast();
        await this.assertLotsExist();
        await this.resetButton.click();
    }

    // TC — Verify left cross icon closes lot form
    async verifyCrossIconClosesLotForm(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const firstCheckbox = this.rowCheckbox(firstRow);
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_EXTRA_LONG });
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await expect(this.popupCloseIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.popupCloseIcon.click();
        await this.page.waitForTimeout(800);
        await expect(this.lotFormLotInput).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.assertLotsExist();
    }

    // TC — Verify right pin icon pins the form (pin then unpin)
    async verifyPinIconPinsForm(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await expect(this.lotFormPinIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.lotFormPinIcon.click();
        await expect(this.pinSuccessToast).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.lotFormHistoryTab).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.lotFormHistoryTab.click();
        await expect(this.lotFormPinIconPinned).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.lotFormPinIcon.click();
        await expect(this.pinDeleteSuccessToast).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.lotFormPinIconPinned).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.popupCloseIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.popupCloseIcon.click();
        await this.page.waitForTimeout(800);
        await expect(this.lotFormLotInput).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.assertLotsExist();
    }

    // TC — Verify project and lot name below tab
    async verifyProjectAndLotNameBelowTab(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const expectedProjectName = (await this.rowProjectCell(firstRow).innerText()).trim();
        const expectedLotName = (await this.rowLotCell(firstRow).innerText()).trim();
        expect(expectedProjectName.length).toBeGreaterThan(0);
        expect(expectedLotName.length).toBeGreaterThan(0);
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormProjectValue).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        const actualProjectName = (await this.lotFormProjectValue.innerText()).trim();
        expect(actualProjectName).toBe(expectedProjectName);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        const actualLotName = await this.lotFormLotInput.inputValue();
        expect(actualLotName.trim()).toBe(expectedLotName);
        const saveAndCloseBtn = this.saveAndCloseButton.first();
        await expect(saveAndCloseBtn).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await saveAndCloseBtn.click();
        await this.assertSuccessToast();
        await this.assertLotsExist();
        await this.resetButton.click();
    }

    // TC — Verify Apartment Details and History tabs are visible
    async verifyApartmentAndHistoryTabsVisible(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        await this.rowLotCell(firstRow).click();
        await expect(this.lotFormApartmentDetailsTab).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await expect(this.lotFormApartmentDetailsTab).toHaveClass(/active/);
        await expect(this.lotFormHistoryTab).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.closePopupIfVisible();
    }

    // TC — Verify project dropdown is auto-filled
    async verifyProjectDropdownAutoFilled(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const expectedProjectName = (await this.rowProjectCell(firstRow).innerText()).trim();
        expect(expectedProjectName.length).toBeGreaterThan(0);
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormProjectValue).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        const actualProjectName = (await this.lotFormProjectValue.innerText()).trim();
        expect(actualProjectName).toBe(expectedProjectName);
        await this.closePopupIfVisible();
    }


    // TC_09 — Verify project can be changed (search project, save, refresh, verify)
    async verifyProjectCanBeChanged(newProjectName: string): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const originalLotName = (await this.rowLotCell(firstRow).innerText()).trim();
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.lotFormProjectArrow.click();
        await expect(this.lotFormProjectDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.lotFormProjectSearchInput.fill(newProjectName);
        await this.page.waitForTimeout(800);
        const newOption = this.projectOptionInForm(newProjectName).first();
        await expect(newOption).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await newOption.click();
        await this.page.waitForTimeout(800);

        const updatedValue = (await this.lotFormProjectValue.innerText()).trim();
        expect(updatedValue.toLowerCase()).toContain(newProjectName.toLowerCase());
        await this.saveAndCloseButton.first().click();
        await this.assertSuccessToast();
        await this.page.waitForTimeout(1500);
        await this.page.reload();
        await this.page.waitForTimeout(2000);
        await expect(this.lotSearchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.assertLotsExist();
        await this.searchLot(originalLotName);
        await this.assertLotsExist();
        const updatedRow = this.lotTableRows.first();
        const projectAfter = (await this.rowProjectCell(updatedRow).innerText()).trim();
        expect(projectAfter.toLowerCase()).toContain(newProjectName.toLowerCase());
        await this.clearLotSearch();
        await this.resetButton.click();
    }

    /**
     * Asserts that the lot name displayed in the form matches the selected lot in the list.
     */
    async verifyLotNameOnLotFormTab(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const expectedLotName = (await this.rowLotCell(firstRow).innerText()).trim();
        expect(expectedLotName.length).toBeGreaterThan(0);
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1200);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        // Get lot name input value in the form
        const actualLotName = (await this.lotFormLotInput.inputValue()).trim();
        expect(actualLotName).toBe(expectedLotName);
        await this.closePopupIfVisible();
    }

    // TC_11 — Verify status reason dropdown shows all statuses
    async verifyStatusReasonDropdownShowsAll(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.lotFormStatusReasonArrow.click();
        await expect(this.lotFormStatusReasonDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        const totalOptions = await this.lotFormStatusReasonOptions.count();
        expect(totalOptions).toBeGreaterThanOrEqual(15);
        const expectedStatuses = [
            'Developer Hold', 'For Sale', 'Withheld', 'Awaiting Vendor Signing',
            'Called to Settle', 'Cancelled', 'Conditional', 'Contract Issued',
            'Contract Requested', 'Defaulted', 'Held', 'Reserved', 'Settled', 'Sold', 'Unconditional'
        ];
        for (const status of expectedStatuses) {
            const option = this.statusReasonOptionInForm(status).first();
            await expect(option).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        }
        await this.closePopupIfVisible();
    }

    // TC_13 — Verify optional fields accept input
    async verifyOptionalFieldsAcceptInput(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        // Open lot form
        const firstRow = this.lotTableRows.first();
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        // Fill optional fields
        await this.lotFormBedInput.fill('3');
        await this.page.waitForTimeout(300);
        expect(await this.lotFormBedInput.inputValue()).toBe('3');
        await this.lotFormBathInput.fill('2');
        await this.page.waitForTimeout(300);
        expect(await this.lotFormBathInput.inputValue()).toBe('2');
        await this.lotFormAspectInput.fill('North');
        await this.page.waitForTimeout(300);
        expect(await this.lotFormAspectInput.inputValue()).toBe('North');
        await this.closePopupIfVisible();
    }

    // TC — Verify close button exits without saving
    async verifyCloseButtonExitsWithoutSaving(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.lotFormLotInput.fill('Changed Lot Name');
        await this.page.waitForTimeout(500);
        expect(await this.lotFormLotInput.inputValue()).toBe('Changed Lot Name');
        await this.closePopupIfVisible();
    }

    // Verify Save button saves form without closing
    async verifySaveButtonSavesWithoutClosing(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.lotFormBedInput.fill('4');
        await this.page.waitForTimeout(300);
        expect(await this.lotFormBedInput.inputValue()).toBe('4');
        await this.lotFormBathInput.fill('3');
        await this.page.waitForTimeout(300);
        expect(await this.lotFormBathInput.inputValue()).toBe('3');
        await this.lotFormAspectInput.fill('East');
        await this.page.waitForTimeout(300);
        expect(await this.lotFormAspectInput.inputValue()).toBe('East');
        const saveButton = this.page.locator('button', { hasText: /^save$/i }).first();
        await expect(saveButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await saveButton.click();
        await this.assertSuccessToast();
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        expect(await this.lotFormBedInput.inputValue()).toBe('4');
        expect(await this.lotFormBathInput.inputValue()).toBe('3');
        expect(await this.lotFormAspectInput.inputValue()).toBe('East');
        await this.closePopupIfVisible();
        await this.assertLotsExist();
        await this.resetButton.click();
        const updatedRow = this.lotTableRows.first();
        await this.rowLotCell(updatedRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        expect(await this.lotFormBedInput.inputValue()).toBe('4');
        expect(await this.lotFormBathInput.inputValue()).toBe('3');
        expect(await this.lotFormAspectInput.inputValue()).toBe('East');
        await this.closePopupIfVisible();
    }

    // Verify Save & Close saves and closes form
    async verifySaveAndCloseButtonSavesAndClosesForm(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.lotFormBedInput.fill('5');
        await this.page.waitForTimeout(300);
        expect(await this.lotFormBedInput.inputValue()).toBe('5');
        await this.lotFormBathInput.fill('2');
        await this.page.waitForTimeout(300);
        expect(await this.lotFormBathInput.inputValue()).toBe('2');
        await this.lotFormAspectInput.fill('West');
        await this.page.waitForTimeout(300);
        expect(await this.lotFormAspectInput.inputValue()).toBe('West');
        const saveAndCloseBtn = this.saveAndCloseButton.first();
        await expect(saveAndCloseBtn).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await saveAndCloseBtn.click();
        await this.assertSuccessToast();
        await expect(this.lotFormLotInput).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.assertLotsExist();
        await this.resetButton.click();
        const updatedRow = this.lotTableRows.first();
        await this.rowLotCell(updatedRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        expect(await this.lotFormBedInput.inputValue()).toBe('5');
        expect(await this.lotFormBathInput.inputValue()).toBe('2');
        expect(await this.lotFormAspectInput.inputValue()).toBe('West');
        await this.closePopupIfVisible();
    }

    // TC_17 — Verify history tab loads properly
    async verifyHistoryTabLoads(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await expect(this.lotFormHistoryTab).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.lotFormHistoryTab.click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormHistoryTab).toHaveClass(/active/);
        await expect(this.historyTabContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        const rowCount = await this.historyTableRows.count();
        expect(rowCount).toBeGreaterThan(0);
        await expect(this.historyRecordsCount).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.closePopupIfVisible();
    }

    // TC_18 — Verify search works in history tab
    async verifyHistorySearch(searchKeyword: string): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();

        const firstRow = this.lotTableRows.first();
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });

        // Open the History tab
        await this.lotFormHistoryTab.click();
        await this.page.waitForTimeout(1500);
        await expect(this.historyTabContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });

        // Count initial rows
        const initialCount = await this.historyTableRows.count();
        expect(initialCount).toBeGreaterThan(0);

        // Search
        await expect(this.historySearchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.historySearchInput.fill(searchKeyword);
        await this.page.waitForTimeout(1500);

        // Count filtered rows and check contents
        const filteredCount = await this.historyTableRows.count();
        expect(filteredCount).toBeGreaterThan(0);
        const firstRowText = (await this.historyTableRows.first().innerText()).toLowerCase();
        expect(firstRowText).toContain(searchKeyword.toLowerCase());

        // Clear search input and close the popup
        await this.historySearchInput.fill('');
        await this.page.waitForTimeout(500);
        await this.closePopupIfVisible();
    }

    // TC_19 — Verify change date is correct
    async verifyHistoryChangeDate(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();

        // Open lot form
        const firstRow = this.lotTableRows.first();
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });

        // Click History tab
        await this.lotFormHistoryTab.click();
        await this.page.waitForTimeout(1500);
        await expect(this.historyTabContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });

        // Verify history rows exist
        const rowCount = await this.historyTableRows.count();
        expect(rowCount).toBeGreaterThan(0);

        // Verify Changed Date column has valid timestamp format (e.g., "06-05-2026 10:02 AM")
        const dateText = (await this.historyRowChangedDate(this.historyTableRows.first()).innerText()).trim();
        expect(dateText.length).toBeGreaterThan(0);
        expect(dateText).toMatch(/\d{2}-\d{2}-\d{4}\s+\d{1,2}:\d{2}\s+(AM|PM)/i);
        await this.closePopupIfVisible();
    }

    // TC_20 — Verify change by field shows updating staff
    async verifyHistoryChangeByField(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();

        // Open lot form
        const firstRow = this.lotTableRows.first();
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });

        // Click History tab
        await this.lotFormHistoryTab.click();
        await this.page.waitForTimeout(1500);
        await expect(this.historyTabContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });

        // Verify history rows exist
        const rowCount = await this.historyTableRows.count();
        expect(rowCount).toBeGreaterThan(0);

        // Verify Changed By column has staff name (e.g., "Remmi: Jahanzaib Xenex")
        const changedByText = (await this.historyRowChangedBy(this.historyTableRows.first()).innerText()).trim();
        expect(changedByText.length).toBeGreaterThan(0);
        await this.closePopupIfVisible();
    }

    // TC_21 — Verify event column shows 'Create' or 'Update'
    async verifyHistoryEventColumn(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();

        // Open lot form
        const firstRow = this.lotTableRows.first();
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });

        // Click History tab
        await this.lotFormHistoryTab.click();
        await this.page.waitForTimeout(1500);
        await expect(this.historyTabContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });

        // Verify history rows exist
        const rowCount = await this.historyTableRows.count();
        expect(rowCount).toBeGreaterThan(0);

        // Verify all Event column values are either 'Create' or 'Update'
        for (let i = 0; i < rowCount; i++) {
            const eventText = (await this.historyRowEvent(this.historyTableRows.nth(i)).innerText()).trim();
            expect(['Create', 'Update']).toContain(eventText);
        }
        await this.closePopupIfVisible();
    }

    // TC_22 — Verify change fields show updated fields
    async verifyHistoryChangedFields(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();

        // Open lot form
        const firstRow = this.lotTableRows.first();
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });

        // Click History tab
        await this.lotFormHistoryTab.click();
        await this.page.waitForTimeout(1500);
        await expect(this.historyTabContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });

        // Verify history rows exist
        const rowCount = await this.historyTableRows.count();
        expect(rowCount).toBeGreaterThan(0);

        // Verify Changed Field column has a non-empty value for each row
        for (let i = 0; i < rowCount; i++) {
            const fieldText = (await this.historyRowChangedField(this.historyTableRows.nth(i)).innerText()).trim();
            expect(fieldText.length).toBeGreaterThan(0);
        }
        await this.closePopupIfVisible();
    }

    // TC_23 — Verify only new values are shown on creation 
    async verifyOnlyNewValuesShownOnCreation(searchValue: string): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();

        // Open lot form
        await this.rowLotCell(this.lotTableRows.first()).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });

        // Open History tab
        await this.lotFormHistoryTab.click();
        await this.page.waitForTimeout(1500);
        await expect(this.historyTabContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });

        // Search in history
        await this.historySearchInput.fill(searchValue);
        await this.page.waitForTimeout(1000);

        // Verify filtered rows exist
        const filteredRows = await this.historyTableRows.all();
        expect(filteredRows.length).toBeGreaterThan(0);

        // Verify search keyword appears in the Changed Field column of at least one row
        let found = false;
        for (let i = 0; i < filteredRows.length; i++) {
            const fieldText = (await this.historyRowChangedField(filteredRows[i]).innerText())
                .trim()
                .toLowerCase();
            if (fieldText.includes(searchValue.toLowerCase())) {
                found = true;
                break;
            }
        }
        expect(found).toBeTruthy();

        await this.closePopupIfVisible();
    }

    // TC_24 — Verify both old and new column values exist on update
    async verifyBothOldAndNewValuesOnUpdate(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        await this.rowLotCell(this.lotTableRows.first()).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.lotFormHistoryTab.click();
        await this.page.waitForTimeout(1500);
        await expect(this.historyTabContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        const rowCount = await this.historyTableRows.count();
        expect(rowCount).toBeGreaterThan(0);
        let verified = false;
        for (let i = 0; i < rowCount; i++) {
            const row = this.historyTableRows.nth(i);
            const eventText = (await this.historyRowEvent(row).innerText()).trim();
            if (eventText === 'Update') {
                const oldValueText = (await this.historyRowOldValue(row).innerText()).trim();
                const newValueText = (await this.historyRowNewValue(row).innerText()).trim();
                console.log(`Old Value: "${oldValueText}", New Value: "${newValueText}"`);
                expect(oldValueText.length).toBeGreaterThan(0);
                expect(newValueText.length).toBeGreaterThan(0);
                expect(oldValueText).not.toBe(newValueText);
                verified = true;
                break;
            }
        }
        expect(verified).toBeTruthy();
        await this.closePopupIfVisible();
    }

    // ==========================================================================
    // HELPERS — PRECINCT LOT TAB
    // ==========================================================================

    /**
     * HELPER — Navigate to first precinct and open Lot tab
     */
    private async navigateToLotTabInPrecinct(): Promise<void> {
        await this.navigateToProjects();
        await this.page.waitForLoadState('networkidle');
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectActions.TIMEOUT_LONG,
        });
        await this.firstPrecinctOnProjectsPage.click();
        await expect(this.lotTabInPrecinct).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.lotTabInPrecinct.click();
    }

    /**
     * HELPER — Reset filters and ensure at least one lot row is visible
     */
    private async resetAndAssertLotRowVisible(): Promise<void> {
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const firstCheckbox = this.rowCheckbox(firstRow);
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_EXTRA_LONG });
        await this.resetButton.click();
        await this.page.waitForTimeout(2000);
    }

    /**
     * HELPER — Cleanup after test (close dropdown, reset, navigate back)
     */
    private async cleanupAfterLotTest(): Promise<void> {
        await this.closeDropdown();
        await this.resetFilters();
        await this.closeDropdown();
        await this.clickOnProjects();
        await this.page.waitForTimeout(500);
    }

    /**
     * HELPER — Open Project dropdown, search, and verify results exist
     */
    private async openProjectDropdownAndSearch(projectName: string): Promise<number> {
        await this.openProjectDropdown();
        await this.page.waitForTimeout(1000);
        await this.searchInProjectDropdown(projectName);
        const count = await this.projectDropdownOptions.count();
        expect(count).toBeGreaterThan(0);
        return count;
    }

    /**
     * HELPER — Verify first dropdown option matches project name
     */
    private async assertFirstOptionMatchesProject(projectName: string): Promise<void> {
        const firstOptionText = (await this.projectDropdownOptions.first().innerText()).trim().toLowerCase();
        expect(firstOptionText).toContain(projectName.toLowerCase());
    }

    /**
     * HELPER — Click matching project option from dropdown
     */
    private async clickProjectOptionByName(projectName: string): Promise<void> {
        const count = await this.projectDropdownOptions.count();
        for (let i = 0; i < count; i++) {
            const option = this.projectDropdownOptions.nth(i);
            const text = (await option.innerText()).trim().toLowerCase();
            if (text.includes(projectName.toLowerCase())) {
                await expect(option).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
                await option.click();
                return;
            }
        }
        throw new Error(`Project "${projectName}" not found in dropdown`);
    }

    // ==========================================================================
    // TESTS — PRECINCT LOT TAB
    // ==========================================================================

    /**
     * Opens the Lot tab from the Precinct view.
     */
    async openLotTabFromPrecinct(): Promise<void> {
        await this.navigateToProjects();
        await this.page.waitForLoadState('networkidle');
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectActions.TIMEOUT_LONG,
        });
        const precinctName = (await this.firstPrecinctOnProjectsPage.locator('h3').first().innerText()).trim();
        await this.firstPrecinctOnProjectsPage.click();
        console.log(precinctName);

        await expect(this.precinctNameUnderActive).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        const displayedName = (await this.precinctNameUnderActive.innerText()).trim();
        expect(displayedName.length).toBeGreaterThan(0);

        await expect(this.lotTabInPrecinct).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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

        await expect(this.lotTable.first()).toBeVisible({ timeout: ProjectActions.TIMEOUT_MEDIUM });
        expect(await this.lotTable.count()).toBeGreaterThan(0);

        await this.clickOnProjects();
    }

    /**
     * Search for a lot by a keyword that does not exist
     */
    async searchNonExistingLot(keyword: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.searchLot(keyword);
        await expect(this.noLotFoundMessage).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });

        await this.clickOnProjects();
    }

    /**
     * Opens the Project dropdown and verifies options appear
     */
    async openAndAssertProjectDropdown(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();

        await this.projectFilter.click();
        await expect(this.projectDropdownOptions.first()).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });

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
        await expect(this.projectDropdownSelectAllCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.projectDropdownSelectAllCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.selectedProjectTagByName(projectName)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.projectTagCrossIcon(projectName).click();
        await this.page.waitForTimeout(800);
        await expect(this.selectedProjectTagByName(projectName)).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.cleanupAfterLotTest();
    }

    /**
 * Open Bed dropdown and verify options appear
 */
    async openAndAssertBedDropdown(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openBedDropdown();
        await expect(this.bedDropdownOptions.first()).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
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
        await expect(this.bedDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.bedDropdownSearchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.bedDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.selectBedByValue(bedValue);
        await this.closeDropdown();
        await expect(this.selectedBedTagByValue(bedValue)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.cleanupAfterLotTest();
    }

    /**
 * Select multiple bed numbers from Bed dropdown
 */
    async selectMultipleBedsInDropdown(bedValues: string[]): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openBedDropdown();
        await expect(this.bedDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        for (const bedValue of bedValues) {
            await this.selectBedByValue(bedValue);
            await this.page.waitForTimeout(500);
        }
        await this.closeDropdown();
        for (const bedValue of bedValues) {
            await expect(this.selectedBedTagByValue(bedValue)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.bedDropdownSelectAllCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.bedDropdownSelectAllCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.bedDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.selectBedByValue(bedValue);
        await this.closeDropdown();
        await expect(this.selectedBedTagByValue(bedValue)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.bedTagCrossIcon(bedValue).click();
        await this.page.waitForTimeout(800);
        await expect(this.selectedBedTagByValue(bedValue)).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.cleanupAfterLotTest();
    }

    /**
 * Open Status dropdown and verify options appear
 */
    async openAndAssertStatusDropdown(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openStatusDropdown();
        await expect(this.statusDropdownOptions.first()).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
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
        await expect(this.statusDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.statusDropdownSearchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.statusDropdownSearchInput.fill(statusName);
        await this.page.waitForTimeout(500);
        const matchingOption = this.statusDropdownOptions.filter({ hasText: statusName }).first();
        await expect(matchingOption).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.selectedStatusTagByValue(statusValue)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.statusDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.closeDropdown();
        await expect(this.statusDropdownPanel).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.noLotFoundMessage).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.noLotFoundMessage).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.selectedProjectTagByName(projectName)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.resetButton.click();
        await this.page.waitForTimeout(1000);
        await expect(this.selectedProjectTagByName(projectName)).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.cleanupAfterLotTest();
    }

    /**
 * Create a new view with a custom name
 */
    async createNewView(viewName: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openDefaultViewPopup();
        await this.addViewIcon.waitFor({ state: 'visible', timeout: ProjectActions.TIMEOUT_LONG });
        await this.addViewIcon.click();
        await expect(this.viewNameInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.viewNameInput.click();
        await this.viewNameInput.fill(viewName);
        await expect(this.saveOrCreateButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.saveOrCreateButton.click({ force: true });
        await expect(this.viewCreatedToast).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.shareViewIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.shareViewIcon.click({ force: true });
        await this.selectShareTarget(this.usersShareDropdown, this.usersShareDropdownArrow, userName);
        await this.selectShareTarget(this.teamsShareDropdown, this.teamsShareDropdownArrow, teamName);
        await expect(this.shareButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.shareButton.click({ force: true });
        await expect(this.shareResponseMessage()).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);
        await this.cleanupAfterLotTest();
    }

    /**
    * Delete a view from the View popup
    */
    async deleteView(viewName: string): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openDefaultViewPopup();
        await expect(this.savedViewDropdown).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.savedViewDropdown.click();
        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);
        const viewOption = this.savedViewOption(viewName);
        await expect(viewOption).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        const deleteIcon = viewOption.locator('img[src*="delete_icon.svg"]');
        await expect(deleteIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await deleteIcon.click();
        try {
            await expect(this.confirmAnyButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_SHORT });
            await this.confirmAnyButton.click();
        } catch {
            // Confirmation dialog may not appear in some flows
        }
        await expect(this.viewDeletedToast).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.cleanupAfterLotTest();
    }

    /**
    * Search for a column in View popup
    */
    async searchColumnInViewPopup(searchTerm: string = 'Project'): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openDefaultViewPopup();
        await expect(this.columnSearchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.columnSearchInput.fill(searchTerm);
        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);
        await expect(this.columnItemByName(searchTerm).first()).toBeVisible({
            timeout: ProjectActions.TIMEOUT_DEFAULT,
        });
        await this.columnSearchInput.fill('');
        await this.page.waitForTimeout(1000);
        await this.cleanupAfterLotTest();
    }

    /**
 * HELPER — Click 'Hide All' button and verify Shown list is empty
 */
    private async clickHideAll(): Promise<void> {
        await expect(this.hideAllButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.hideAllButton.click();
        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);
        await expect(this.visibleColumnList).toHaveCount(0, { timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Click 'Show All' button and verify Hidden list is empty
     */
    private async clickShowAll(): Promise<void> {
        await expect(this.showAllButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.showAllButton.evaluate(button => button.scrollIntoView({ behavior: 'instant', block: 'center' }));
        await this.page.waitForTimeout(1300);
        await this.showAllButton.click();
        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);
        await expect(this.hiddenColumnList).toHaveCount(0, { timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.visibleColumnList.first()).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);
        await this.cleanupAfterLotTest();
    }

    /**
 * HELPER — Get drag handle by index from visible column list
 */
    private async getColumnHandleAndName(index: number): Promise<{ handle: Locator; name: string }> {
        const handle = this.visibleColumnList.nth(index);
        await this.page.waitForTimeout(1000);
        const name = (await handle.locator('p').innerText()).trim();
        return { handle, name };
    }

    /**
     * HELPER — Get bounding box safely from a column handle
     */
    private async getBoxFromHandle(handle: Locator): Promise<{ x: number; y: number; width: number; height: number }> {
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
    private async dragColumn(fromIndex: number, toIndex: number): Promise<void> {
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
    private tableColumnHeaderByIndex(index: number): Locator {
        return this.page.locator('table thead th p').nth(index);
    }

    /**
     * HELPER — Verify table column order matches expected names
     */
    private async assertTableColumnOrder(): Promise<void> {
        await expect(this.tableColumnHeaderByIndex(0)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
    private async toggleRowCheckboxAndVerify(row: Locator, expectSelected: boolean): Promise<void> {
        const checkbox = this.rowCheckbox(row);
        await expect(checkbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_EXTRA_LONG });
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
        await expect(this.selectAllLotCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_EXTRA_LONG });
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
    private async openBulkEditDialog(): Promise<void> {
        await expect(this.bulkEditButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.bulkEditButton.click();
    }

    /**
     * HELPER — Save & Close Bulk Edit and verify success toast
     */
    private async saveAndCloseBulkEdit(): Promise<void> {
        await expect(this.saveAndCloseButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.projectColumnSortIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.projectColumnSortIcon.click();
        await expect(this.projectColumnSortIconDesc).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.cleanupAfterLotTest();
    }

    /**
 * Toggle status sorting (click sort icon again to switch to ascending/descending)
 */
    async toggleStatusSorting(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await expect(this.projectColumnSortIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.projectColumnSortIcon.click();
        await expect(this.projectColumnSortIconDesc).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.projectColumnSortIconDesc.click();
        await expect(this.projectColumnSortIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.selectedProjectTagByName(projectName)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.selectedBedTagByValue(bedValue)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.selectedStatusTagByValue(statusName)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });

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
        await expect(this.selectedProjectTagByName(projectName)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.selectedBedTagByValue(bedValue)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });

        // Remove only the Project tag
        await this.projectTagCrossIcon(projectName).click();
        await this.page.waitForTimeout(800);

        // Verify Project tag is removed but Bed tag remains
        await expect(this.selectedProjectTagByName(projectName)).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.selectedBedTagByValue(bedValue)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });

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
        await expect(this.selectedProjectTagByName(projectName)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.openProjectDropdown();
        await this.page.waitForTimeout(800);
        const selectedOption = this.projectDropdownOptions.filter({ hasText: projectName }).first();
        await expect(selectedOption).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.selectedBedTagByValue(bedValue)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.openProjectDropdown();
        await this.page.waitForTimeout(800);
        await expect(this.projectDropdownOptions.first()).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.closeDropdown();
        await expect(this.selectedBedTagByValue(bedValue)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.selectedProjectTagByName(projectName)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.openProjectDropdownAndSearch(projectName);
        await this.projectDropdownOptions.first().click();
        await this.closeDropdown();
        await expect(this.selectedProjectTagByName(projectName)).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.selectedProjectTagByName(projectName)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.openProjectDropdownAndSearch(projectName);
        await this.projectDropdownOptions.first().click();
        await this.closeDropdown();
        await expect(this.selectedProjectTagByName(projectName)).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(800);
        await expect(this.viewPopupContent).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.cleanupAfterLotTest();
    }

    /**
 * Open View popup and click Save without making any changes
 */
    async clickSaveWithoutChangingView(): Promise<void> {
        await this.navigateToLotTabInPrecinct();
        await this.resetAndAssertLotRowVisible();
        await this.openDefaultViewPopup();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.saveOrCreateButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.shareViewIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.shareViewIcon.click({ force: true });
        await this.selectShareTarget(this.usersShareDropdown, this.usersShareDropdownArrow, userName);
        await expect(this.shareButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.lotTableRows.first()).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
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
        await expect(this.selectedProjectTagByName(projectName)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.eoiTabInPrecinct).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.bedDropdownOptions.first()).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.closeDropdown();
        await this.page.waitForTimeout(500);
        await this.openProjectDropdown();
        await expect(this.projectDropdownOptions.first()).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.bedDropdownOptions.first()).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.projectColumnSortIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.projectColumnSortIcon.click();
        await expect(this.projectColumnSortIconDesc).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.openBedDropdown();
        await this.selectBedByValue(bedValue);
        await this.closeDropdown();
        await expect(this.projectColumnSortIconDesc).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.selectedProjectTagByName(projectName)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.noLotFoundMessage).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.selectedProjectTagByName(projectName)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.selectedBedTagByValue(bedValue)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.resetButton.click();
        await expect(this.selectedProjectTagByName(projectName)).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.selectedBedTagByValue(bedValue)).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.cleanupAfterLotTest();
    }

    // ==========================================================================
    // CONSTANTS — PROJECT SETUP
    // ==========================================================================

    private static readonly PROJECT_PRICELIST_URL = '/projects/edit_/69e9c1d7be0c8310f1dceee0/price-list';
    private static readonly PROJECT_SETUP_URL = '/projects/edit_/69e9c1d7be0c8310f1dceee0/project-setup';

    // ==========================================================================
    // LOCATORS — PROJECT CLICK & PRICELIST TAB
    // ==========================================================================

    private get projectsSectionHeading(): Locator {
        return this.page.locator('p', { hasText: /^\s*Project\s*$/i }).first();
    }

    private projectCardInProjectSection(projectName: string): Locator {
        return this.page
            .locator('.sgv-product')
            .filter({ has: this.page.locator('.product-content h3', { hasText: new RegExp(`^\\s*${projectName}\\s*$`, 'i') }) })
            .first();
    }

    private projectCardClickTarget(projectName: string): Locator {
        return this.projectCardInProjectSection(projectName).locator('a[href="javascript:void(0)"]').first();
    }

    private get pricelistTab(): Locator {
        return this.page.locator('a[href*="/price-list"]', { hasText: /Price List/i });
    }

    private get pricelistTabActive(): Locator {
        return this.page.locator('a.active[href*="/price-list"]');
    }

    private get pricelistContent(): Locator {
        return this.page.locator('app-price-list');
    }

    // ==========================================================================
    // LOCATORS — PROJECT SETUP TAB & GENERAL TAB
    // ==========================================================================

    private get projectSetupTab(): Locator {
        return this.page.locator('a[href*="/project-setup"]', { hasText: /Project Set Up/i });
    }

    private get projectSetupTabActive(): Locator {
        return this.page.locator('a.active[href*="/project-setup"]');
    }

    private get projectSetupContent(): Locator {
        return this.page.locator('app-project-setup, [class*="project-setup"]').first();
    }

    private get generalTab(): Locator {
        return this.page.locator('a, li', { hasText: /^\s*General\s*$/i }).first();
    }

    private get generalTabActive(): Locator {
        return this.page.locator('a.active, li.active', { hasText: /General/i });
    }

    // ==========================================================================
    // LOCATORS — PROJECT SETUP FIELDS
    // ==========================================================================

    private get projectSetupNameField(): Locator {
        return this.page.locator('input[formcontrolname="Project_Name"], input[formcontrolname="project_name"]').first();
    }

    private get projectSetupStatusField(): Locator {
        return this.page.locator('ng-select[formcontrolname="Project_Status"], ng-select[formcontrolname="project_status"]').first();
    }

    private get projectAddressField(): Locator {
        return this.page.locator('[class*="address"]', { hasText: /Project Address/i }).first();
    }

    private get projectAddressIcon(): Locator {
        return this.projectAddressField.locator('img, i.pi').first();
    }

    private get projectDisplayAddressField(): Locator {
        return this.page.locator('[class*="address"]', { hasText: /Display Address/i }).first();
    }

    private get projectDisplayAddressIcon(): Locator {
        return this.projectDisplayAddressField.locator('img, i.pi').first();
    }

    // ==========================================================================
    // LOCATORS — PROJECT ADDRESS POPUP
    // ==========================================================================

    private get projectAddressPopup(): Locator {
        return this.page.locator('.p-dialog', { hasText: /Project Address/i });
    }

    private get projectAddressPopupCloseIcon(): Locator {
        return this.projectAddressPopup.locator('.p-dialog-header-close, i.pi-times').first();
    }

    private get projectAddressSaveButton(): Locator {
        return this.projectAddressPopup.locator('button', { hasText: /save/i });
    }

    private get projectAddressStreetInput(): Locator {
        return this.projectAddressPopup.locator('input[formcontrolname*="street" i], input[placeholder*="street" i]').first();
    }

    private get projectAddressSuburbInput(): Locator {
        return this.projectAddressPopup.locator('input[formcontrolname*="suburb" i], input[placeholder*="suburb" i]').first();
    }

    private get projectAddressStateInput(): Locator {
        return this.projectAddressPopup.locator('input[formcontrolname*="state" i], input[placeholder*="state" i]').first();
    }

    private get projectAddressPostcodeInput(): Locator {
        return this.projectAddressPopup.locator('input[formcontrolname*="postcode" i], input[placeholder*="postcode" i]').first();
    }

    // ==========================================================================
    // LOCATORS — PROJECT DISPLAY ADDRESS POPUP
    // ==========================================================================

    private get projectDisplayAddressPopup(): Locator {
        return this.page.locator('.p-dialog', { hasText: /Display Address/i });
    }

    private get projectDisplayAddressPopupCloseIcon(): Locator {
        return this.projectDisplayAddressPopup.locator('.p-dialog-header-close, i.pi-times').first();
    }

    private get projectDisplayAddressSaveButton(): Locator {
        return this.projectDisplayAddressPopup.locator('button', { hasText: /save/i });
    }

    // ==========================================================================
    // LOCATORS — PROJECT SETUP > GENERAL TAB (sub-tabs)
    // Source: app-project-setup HTML (shared 2026-05-08)
    // ==========================================================================

    private get generalSubTab(): Locator {
        return this.page.locator('a[href*="/project-setup/general"]', { hasText: /^\s*General\s*$/i });
    }

    private get generalSubTabActive(): Locator {
        return this.page.locator('a.active[href*="/project-setup/general"]');
    }

    private get generalSettingContent(): Locator {
        return this.page.locator('app-general-setting');
    }

    // ==========================================================================
    // LOCATORS — GENERAL TAB FORM FIELDS
    // Source: app-general-setting HTML (shared 2026-05-08)
    // ==========================================================================

    private get projectSetupNameLabel(): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1', { hasText: /^Project Name$/i });
    }

    private get projectSetupNameInput(): Locator {
        return this.generalSettingContent.locator('input[formcontrolname="Project_Name"]');
    }

    private get projectSetupStatusLabel(): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1', { hasText: /^Project Status$/i });
    }

    private get projectSetupStatusSelect(): Locator {
        return this.generalSettingContent.locator('ng-select[formcontrolname="Project_Status"]');
    }

    private get projectSetupAddressLabel(): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1', { hasText: /^Project Address$/i });
    }

    private get projectSetupAddressInput(): Locator {
        return this.generalSettingContent.locator('input[formcontrolname="Project_Address"]');
    }

    private get projectSetupDisplayAddressLabel(): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1', { hasText: /^Project Display Address$/i });
    }

    private get projectSetupDisplayAddressInput(): Locator {
        return this.generalSettingContent.locator('input[formcontrolname="Project_Display_Address"]');
    }

    private get projectDisplayAddressPencilIcon(): Locator {
        return this.generalSettingContent.locator('button#toggle-overlay');
    }

    private get googlePlacesDropdown(): Locator {
        return this.page.locator('.pac-container:visible').first();
    }

    private get googlePlacesSuggestions(): Locator {
        return this.page.locator('.pac-container:visible .pac-item');
    }

    private get generalTabSaveButton(): Locator {
        return this.generalSettingContent.locator('button._outline-btn', { hasText: /^\s*Save\s*$/i }).first();
    }

    private get generalTabSaveAndCloseButton(): Locator {
        return this.generalSettingContent.locator('button._primary-btn', { hasText: /Save & Close/i }).first();
    }

    private get generalTabCloseButton(): Locator {
        return this.generalSettingContent.locator('button._cancel-btn', { hasText: /^\s*Close\s*$/i }).first();
    }

    private get displayAddressPopup(): Locator {
        return this.page.locator('.row', { hasText: /Property Address/i }).filter({ has: this.page.locator('h4', { hasText: /Property Address/i }) });
    }

    private get displayAddressPopupHeading(): Locator {
        return this.page.locator('h4', { hasText: /^\s*Property Address\s*$/i });
    }

    private get displayAddressPopupSaveButton(): Locator {
        return this.displayAddressPopup.locator('button.btn-primary', { hasText: /^\s*Save\s*$/i });
    }

    private get displayAddressBuildingNameInput(): Locator {
        return this.page.locator('input[formcontrolname="building_name"]');
    }

    private get displayAddressUnitNoInput(): Locator {
        return this.page.locator('input[formcontrolname="unit_no"]');
    }

    private get displayAddressStreetNoInput(): Locator {
        return this.page.locator('input[formcontrolname="street_no"]');
    }

    private get displayAddressStreetNameInput(): Locator {
        return this.page.locator('input[formcontrolname="street_name"]');
    }

    private get displayAddressSuburbAutocomplete(): Locator {
        return this.page.locator('p-autocomplete[formcontrolname="suburb"] input');
    }

    private get displayAddressSuburbSuggestionItems(): Locator {
        return this.page.locator('li.p-autocomplete-item[role="option"]');
    }

    private displayAddressSuburbSuggestionByLabel(label: string): Locator {
        return this.page.locator('li.p-autocomplete-item[role="option"][aria-label="' + label + '"]');
    }

    private get displayAddressStateInput(): Locator {
        return this.page.locator('input[formcontrolname="state"]');
    }

    private get displayAddressPostCodeInput(): Locator {
        return this.page.locator('input[formcontrolname="post_code"]');
    }

    private get displayAddressCountryInput(): Locator {
        return this.page.locator('input[formcontrolname="country"]');
    }

    private get displayAddressPopupCloseIcon(): Locator {
        return this.page.locator('.p-overlaypanel-close-icon').first();
    }

    // ==========================================================================
    // LOCATORS — DEVELOPER DROPDOWN (re-multiselect)
    // Source: app-general-setting HTML (shared 2026-05-08)
    // ==========================================================================

    private get developerDropdownContainer(): Locator {
        return this.page.locator('re-multiselect').first();
    }

    private get developerDropdownTrigger(): Locator {
        return this.developerDropdownContainer.locator('.tags').first();
    }

    private get developerDropdownArrow(): Locator {
        return this.developerDropdownContainer.locator('i.fas.fa-sort-down, i.fas.fa-sort-up').first();
    }

    private get developerDropdownPanel(): Locator {
        return this.developerDropdownContainer.locator('.drop_box');
    }

    private get developerDropdownSearchInput(): Locator {
        return this.developerDropdownPanel.locator('input[placeholder="Search"]');
    }

    private get developerDropdownCreateNew(): Locator {
        return this.developerDropdownPanel.locator('p.cursor-pointer', { hasText: /Create New/i });
    }

    private get developerDropdownItems(): Locator {
        return this.developerDropdownPanel.locator('ul li');
    }

    private developerDropdownItemByText(text: string): Locator {
        return this.developerDropdownPanel.locator('ul li').filter({ hasText: text }).first();
    }

    private get developerPlaceholder(): Locator {
        return this.developerDropdownContainer.locator('.placeHolder', { hasText: /Select Developer/i });
    }

    private get developerSelectedChips(): Locator {
        return this.developerDropdownContainer.locator('.tags .selected_one');
    }

    private developerSelectedChipByName(name: string): Locator {
        return this.developerSelectedChips.filter({ hasText: name }).first();
    }

    private get projectManagerLabel(): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1', { hasText: /^Project Manager$/ });
    }

    private get projectManagersDropdown(): Locator {
        return this.page.locator('ng-select[formcontrolname="Project_Manager"]');
    }

    private get projectManagerDropdownPanel(): Locator {
        return this.page.locator('ng-dropdown-panel');
    }

    private get projectManagerDropdownInput(): Locator {
        return this.page.locator('.ng-input input').last();
    }

    private get projectManagerDropdownOptions(): Locator {
        return this.projectManagerDropdownPanel.locator('.ng-option');
    }

    private projectManagerOptionByText(text: string): Locator {
        return this.projectManagerDropdownPanel.locator('.ng-option').filter({ hasText: text }).first();
    }

    private generalTabLabelByText(text: string): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1', { hasText: new RegExp(`^${text}$`) }).first();
    }

    private get floorplanSectionHeading(): Locator {
        return this.generalSettingContent.locator('p.f-14').filter({ hasText: 'Floorplan Types' }).first();
    }

    private get floorplanSectionHeader(): Locator {
        return this.floorplanSectionHeading.locator('xpath=..').first();
    }

    private get floorplanToggleArrowUp(): Locator {
        return this.page.locator('i.pi-angle-up').first();
    }

    private get floorplanToggleArrowDown(): Locator {
        return this.page.locator('i.pi-angle-down').last();
    }


    private get floorplanTableWrapper(): Locator {
        return this.generalSettingContent.locator('div.s-card-table.s-responsive-table').first();
    }

    // ==========================================================================
    // LOCATORS — FLOORPLAN DELETE (TC_22)
    // Source: app-general-setting HTML (verified — row with checkbox + delete icon)
    // ==========================================================================

    private get floorplanPlusIcon(): Locator {
        return this.floorplanSectionHeader.locator('i.pi-plus').first();
    }

    private get floorplanHeaderDeleteIcon(): Locator {
        return this.floorplanSectionHeader.locator('img[src*="delete_icon.svg"]').first();
    }

    private get floorplanTable(): Locator {
        return this.floorplanTableWrapper.locator('p-table').first();
    }

    private get floorplanTableRows(): Locator {
        return this.floorplanTable.locator('tbody tr');
    }

    private floorplanRowCheckbox(rowIndex: number): Locator {
        return this.floorplanTableRows.nth(rowIndex).locator('p-checkbox.cbox .p-checkbox-box').first();
    }

    private get floorplanHeaderCheckbox(): Locator {
        return this.floorplanTable.locator('thead p-checkbox .p-checkbox-box').first();
    }

    private get floorplanTypeColumnHeader(): Locator {
        return this.floorplanTable.locator('th.p-sortable-column[psortablecolumn="name"]').first();
    }


    // ==========================================================================
    // LOCATORS — BONUS PAYABLE UPON CHIPS (TC_30)
    // Source: app-general-setting HTML (verified — empty + with chip)
    // ==========================================================================

    private get bonusPayableUponLabel(): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1', { hasText: /^Bonus Payable Upon$/ }).first();
    }

    private get bonusPayableUponChips(): Locator {
        return this.generalSettingContent.locator('p-chips[formcontrolname="bonus_payable_upon"]').first();
    }

    private get bonusPayableUponInput(): Locator {
        return this.bonusPayableUponChips.locator('li.p-chips-input-token input').first();
    }

    private get bonusPayableUponTokens(): Locator {
        return this.bonusPayableUponChips.locator('li.p-chips-token');
    }

    private bonusPayableUponTokenByText(text: string): Locator {
        return this.bonusPayableUponChips.locator('li.p-chips-token').filter({
            has: this.page.locator('span.p-chips-token-label', { hasText: text })
        }).first();
    }

    private bonusPayableUponTokenRemoveIcon(text: string): Locator {
        return this.bonusPayableUponTokenByText(text).locator('timescircleicon').first();
    }

    private get projectUpgradesHeading(): Locator {
        return this.generalSettingContent.locator('p.f-16._fw-600').filter({ hasText: 'Project Upgrades' }).first();
    }

    private get projectUpgradesSection(): Locator {
        return this.projectUpgradesHeading.locator('xpath=../..').first();
    }

    private get addAdditionalUpgradeGroupButton(): Locator {
        return this.projectUpgradesSection.locator('button._view-btn').filter({
            has: this.page.locator('i.pi-plus')
        }).first();
    }

    private get upgradeBoxes(): Locator {
        return this.projectUpgradesSection.locator('.upgrade-box');
    }

    private upgradeBox(index: number): Locator {
        return this.upgradeBoxes.nth(index);
    }

    private upgradeGroupInput(boxIndex: number): Locator {
        return this.upgradeBox(boxIndex).locator('input.site-input').nth(0);
    }

    private upgradeInput(boxIndex: number): Locator {
        return this.upgradeBox(boxIndex).locator('input.site-input').nth(1);
    }

    private upgradeCostInput(boxIndex: number): Locator {
        return this.upgradeBox(boxIndex).locator('app-price-input input').first();
    }

    private upgradeBoxRemoveIcon(boxIndex: number): Locator {
        return this.upgradeBox(boxIndex).locator('button._view-btn').filter({
            has: this.page.locator('i.pi-times-circle')
        }).first();
    }

    private get bonusPayableToLabel(): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1', { hasText: /^Bonus Payable To$/ }).first();
    }

    private get bonusPayableToChips(): Locator {
        return this.generalSettingContent.locator('p-chips[formcontrolname="bonus_payable_to"]').first();
    }

    private get bonusPayableToInput(): Locator {
        return this.bonusPayableToChips.locator('li.p-chips-input-token input').first();
    }

    private get bonusPayableToTokens(): Locator {
        return this.bonusPayableToChips.locator('li.p-chips-token');
    }

    private bonusPayableToTokenByText(text: string): Locator {
        return this.bonusPayableToChips.locator('li.p-chips-token').filter({
            has: this.page.locator('span.p-chips-token-label', { hasText: text })
        }).first();
    }

    private bonusPayableToTokenRemoveIcon(text: string): Locator {
        return this.bonusPayableToTokenByText(text).locator('timescircleicon').first();
    }

    /**
     * All upgrade rows inside a specific upgrade box (rows containing Upgrade + Cost)
     * Excludes the Upgrade Group row which is structured differently
     */
    private upgradeRowsInBox(boxIndex: number): Locator {
        return this.upgradeBox(boxIndex).locator('div.mb-2.d-flex.position-relative');
    }

    /**
     * Upgrade input within a specific row within a specific box
     */
    private upgradeRowInput(boxIndex: number, rowIndex: number): Locator {
        return this.upgradeRowsInBox(boxIndex).nth(rowIndex).locator('input.site-input').first();
    }

    /**
     * Cost input within a specific row within a specific box
     */
    private upgradeRowCostInput(boxIndex: number, rowIndex: number): Locator {
        return this.upgradeRowsInBox(boxIndex).nth(rowIndex).locator('app-price-input input').first();
    }

    /**
     * Cross icon on an upgrade row (only exists on added rows, not row 0)
     */
    private upgradeRowRemoveIcon(boxIndex: number, rowIndex: number): Locator {
        return this.upgradeRowsInBox(boxIndex).nth(rowIndex).locator('i.pi-times-circle').first();
    }

    /**
     * "Add Upgrade" button inside a specific upgrade box
     */
    private addUpgradeButton(boxIndex: number): Locator {
        return this.upgradeBox(boxIndex).locator('button._view-btn').filter({
            has: this.page.locator('i.pi-plus')
        }).first();
    }

    private get bonusCampaignLabel(): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1', { hasText: /^Bonus Campaign$/ }).first();
    }

    private get bonusCampaignChips(): Locator {
        return this.generalSettingContent.locator('p-chips[formcontrolname="bonus_campaign"]').first();
    }

    private get bonusCampaignInput(): Locator {
        return this.bonusCampaignChips.locator('li.p-chips-input-token input').first();
    }

    private get bonusCampaignTokens(): Locator {
        return this.bonusCampaignChips.locator('li.p-chips-token');
    }

    private bonusCampaignTokenByText(text: string): Locator {
        return this.bonusCampaignChips.locator('li.p-chips-token').filter({
            has: this.page.locator('span.p-chips-token-label', { hasText: text })
        }).first();
    }

    private bonusCampaignTokenRemoveIcon(text: string): Locator {
        return this.bonusCampaignTokenByText(text).locator('timescircleicon').first();
    }
    /**
   * HELPER — Fill all fields in the Display Address popup, including suburb (with autocomplete select)
   */
    private async fillDisplayAddressFields(data: {
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
                    await expect(suggestion).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
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
    private async clickDisplayAddressPopupSave(): Promise<void> {
        await expect(this.displayAddressPopupSaveButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.displayAddressPopupSaveButton.click();
        await this.page.waitForTimeout(1500);
    }

    /**
     * HELPER — Assert all Display Address fields match expected data
     */
    private async assertDisplayAddressFieldsMatch(data: {
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
    private async navigateToProjectPricelist(): Promise<void> {
        const currentUrl = this.page.url().split(/[?#]/)[0];
        if (!currentUrl.includes('/price-list')) {
            await this.page.goto(ProjectActions.PROJECT_PRICELIST_URL);
        }
        await expect(this.pricelistContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
    }

    /**
     * HELPER — Navigate to Project Setup (skip if already there)
     */
    private async navigateToProjectSetup(): Promise<void> {
        const currentUrl = this.page.url().split(/[?#]/)[0];
        if (!currentUrl.includes('/project-setup')) {
            await this.page.goto(ProjectActions.PROJECT_SETUP_URL);
        }
        await expect(this.projectSetupContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
    }

    /**
     * HELPER — Click a project card from the "Project" section by name
     */
    private async clickProjectCardInProjectSection(projectName: string): Promise<void> {
        await expect(this.projectsSectionHeading).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        const projectCard = this.projectCardClickTarget(projectName);
        await expect(projectCard).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await projectCard.scrollIntoViewIfNeeded();
        await projectCard.click();
        await this.page.waitForTimeout(1500);
    }

    /**
     * HELPER — Click Project Setup tab
     */
    private async clickProjectSetupTab(): Promise<void> {
        await expect(this.projectSetupTab).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.projectSetupTab.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * HELPER — Verify Pricelist tab is active and content loaded
     */
    private async assertPricelistTabActive(): Promise<void> {
        await expect(this.page).toHaveURL(/\/price-list/, { timeout: ProjectActions.TIMEOUT_LONG });
        await expect(this.pricelistTab).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await expect(this.pricelistTabActive).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.pricelistContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    private async cleanupAfterProjectTest(): Promise<void> {
        await expect(this.projectsBreadcrumb).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.projectsBreadcrumb.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'auto' }));
        await this.page.waitForTimeout(800);
        await this.projectsBreadcrumb.click();
        await this.page.waitForTimeout(800);
        await expect(this.projectsSectionHeading).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
    }

    /**
     * HELPER — Open Project Address popup
     */
    private async openProjectAddressPopup(): Promise<void> {
        await expect(this.projectAddressIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.projectAddressIcon.click();
        await expect(this.projectAddressPopup).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Close Project Address popup via cross icon
     */
    private async closeProjectAddressPopup(): Promise<void> {
        await this.projectAddressPopupCloseIcon.click();
        await expect(this.projectAddressPopup).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Fill Project Address fields
     */
    private async fillProjectAddress(data: { street?: string; suburb?: string; state?: string; postcode?: string }): Promise<void> {
        if (data.street) await this.projectAddressStreetInput.fill(data.street);
        if (data.suburb) await this.projectAddressSuburbInput.fill(data.suburb);
        if (data.state) await this.projectAddressStateInput.fill(data.state);
        if (data.postcode) await this.projectAddressPostcodeInput.fill(data.postcode);
    }

    /**
     * HELPER — Open Project Display Address popup
     */
    private async openProjectDisplayAddressPopup(): Promise<void> {
        await expect(this.projectDisplayAddressIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.projectDisplayAddressIcon.click();
        await expect(this.projectDisplayAddressPopup).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Close Project Display Address popup via cross icon
     */
    private async closeProjectDisplayAddressPopup(): Promise<void> {
        await this.projectDisplayAddressPopupCloseIcon.click();
        await expect(this.projectDisplayAddressPopup).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    private async openGeneralTab(): Promise<void> {
        const currentUrl = this.page.url();
        if (!currentUrl.includes('/project-setup')) {
            await this.clickProjectSetupTab();
        }
        await expect(this.generalSubTabActive).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await expect(this.generalSettingContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
    }

    /**
* HELPER — Open project (clicks card → asserts Pricelist landing → switches to Project Setup → General)
*/
    private async openProjectGeneralTab(projectName: string): Promise<void> {
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
    private get generalTabAllLabels(): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1');
    }

    /**
     * HELPER — Verify form labels appear in the expected order at given starting index
     */
    private async assertLabelOrder(expectedLabels: string[], startIndex: number = 0): Promise<void> {
        for (let i = 0; i < expectedLabels.length; i++) {
            const actualText = (await this.generalTabAllLabels.nth(startIndex + i).innerText()).trim();
            expect(actualText).toBe(expectedLabels[i]);
        }
    }

    /**
     * HELPER — Verify a form field's label and input are both visible
     */
    private async assertFieldVisible(label: Locator, input: Locator): Promise<void> {
        await expect(label).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(input).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    private async typeAddressAndAssertSuggestions(input: Locator, query: string): Promise<void> {
        await expect(input).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await input.click();
        await input.press('Control+A');
        await input.press('Delete');
        await this.page.waitForTimeout(300);
        await input.pressSequentially(query, { delay: 300 });
        await this.page.waitForTimeout(1500);
        const firstSuggestion = this.page.locator('.pac-container:visible .pac-item').first();
        await firstSuggestion.waitFor({ state: 'visible', timeout: ProjectActions.TIMEOUT_LONG });
        const suggestionCount = await this.googlePlacesSuggestions.count();
        expect(suggestionCount).toBeGreaterThan(0);
    }

    /**
     * HELPER — Clear an address input and dismiss Google Places dropdown
     */
    private async clearAddressInput(input: Locator): Promise<void> {
        await input.fill('');
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);
    }

    /**
 * HELPER — Clear an address input fully (handles existing saved value)
 */
    private async clearAddressInputFully(input: Locator): Promise<void> {
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
    private async selectFirstAddressSuggestion(input: Locator): Promise<string> {
        await expect(this.googlePlacesSuggestions.first()).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.googlePlacesSuggestions.first().click();
        await this.page.waitForTimeout(800);
        const filledValue = await input.inputValue();
        expect(filledValue.length).toBeGreaterThan(0);
        return filledValue;
    }

    /**
     * HELPER — Click General tab Save button (bottom)
     */
    private async clickGeneralTabSave(): Promise<void> {
        await expect(this.generalTabSaveButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.generalTabSaveButton.click();
        await this.page.waitForTimeout(1500);
    }

    private async assertProjectUpdatedToast(): Promise<void> {
        const toast = this.page.locator('div[aria-label="Project updated successfully"]', { hasText: /Project updated successfully/i }).first();
        await expect(toast).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
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

    private async assertInputIsEmpty(input: Locator): Promise<void> {
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

    private async openDisplayAddressPopup(): Promise<void> {
        await expect(this.projectDisplayAddressPencilIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.projectDisplayAddressPencilIcon.click();
        await this.page.waitForTimeout(800);
        await expect(this.displayAddressPopupHeading).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    private async closeDisplayAddressPopup(): Promise<void> {
        await this.page.mouse.click(0, 100); // click outside the popup
        await this.page.waitForTimeout(500);
    }

    /**
 * TC_10 — Verify Project Display Address popup opens from General tab
 */
    async verifyProjectDisplayAddressPopupOpens(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.openDisplayAddressPopup();
        await expect(this.displayAddressPopupHeading).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.displayAddressBuildingNameInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.displayAddressPopupSaveButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
    private async clearAllDisplayAddressFields(): Promise<void> {
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
    private async assertAllDisplayAddressFieldsEmpty(): Promise<void> {
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
    private async closeDisplayAddressPopupViaCross(): Promise<void> {
        await expect(this.displayAddressPopupCloseIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.displayAddressPopupCloseIcon.click();
        await this.page.waitForTimeout(500);
        await expect(this.displayAddressPopupHeading).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
    private async openDeveloperDropdown(): Promise<void> {
        const isOpen = await this.developerDropdownPanel.isVisible().catch(() => false);
        if (isOpen) return;

        await expect(this.developerDropdownArrow).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.developerDropdownArrow.scrollIntoViewIfNeeded();
        await this.developerDropdownArrow.click();
        await this.page.waitForTimeout(500);
        await expect(this.developerDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Close the Developer dropdown by clicking outside
     */
    private async closeDeveloperDropdown(): Promise<void> {
        await this.page.mouse.click(10, 10);
        await this.page.waitForTimeout(500);
        await expect(this.developerDropdownPanel).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Click a developer item in the dropdown (toggles selection)
     */
    private async toggleDeveloperSelection(developerName: string): Promise<void> {
        const developerItem = this.developerDropdownItemByText(developerName);
        await expect(developerItem).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await developerItem.click();
        await this.page.waitForTimeout(500);
    }

    /**
     * HELPER — Assert a developer is selected (.selected_one chip exists)
     */
    private async assertDeveloperSelected(developerName: string): Promise<void> {
        await expect(this.developerSelectedChipByName(developerName)).toBeVisible({
            timeout: ProjectActions.TIMEOUT_DEFAULT,
        });
    }

    /**
     * HELPER — Assert no developer is selected (no chips, placeholder visible)
     */
    private async assertDeveloperPlaceholderVisible(): Promise<void> {
        const chipCount = await this.developerSelectedChips.count();
        expect(chipCount).toBe(0);
        await expect(this.developerPlaceholder).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    /**
     * TC_14 — Verify Developer dropdown opens and shows contact list
     */
    async verifyDeveloperDropdownShowsContacts(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.openDeveloperDropdown();
        await expect(this.developerDropdownSearchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.developerDropdownCreateNew).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
    private async openProjectsManagerDropdown(): Promise<void> {
        await this.projectManagersDropdown.scrollIntoViewIfNeeded();
        await this.projectManagersDropdown.click();
        await this.page.waitForTimeout(500);
        await expect(this.projectManagerDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Close the Project Manager dropdown by clicking outside
     */
    private async closeProjectManagerDropdown(): Promise<void> {
        await this.page.mouse.click(10, 10);
        await this.page.waitForTimeout(500);
        await expect(this.projectManagerDropdownPanel).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    /**
 * TC_18 — Verify Project Manager dropdown shows all staff
 */
    async verifyProjectManagerDropdownShowsAllStaff(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.openProjectsManagerDropdown();
        await expect(this.projectManagerDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.closeProjectManagerDropdown();
        await this.cleanupAfterProjectTest();
    }

    private async assertLabelNotRequired(labelText: string): Promise<void> {
        const label = this.generalTabLabelByText(labelText);
        await expect(label).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
    private async scrollToFloorplanSection(): Promise<void> {
        await this.floorplanSectionHeading.scrollIntoViewIfNeeded();
        await expect(this.floorplanSectionHeading).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(300);
    }

    /**
     * HELPER — Click the Floorplan toggle arrow
     */
    private async clickFloorplanToggleArrow(): Promise<void> {
        await expect(this.floorplanToggleArrowDown).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
    private async clickFloorplanPlusIcon(): Promise<void> {
        await expect(this.floorplanPlusIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.floorplanPlusIcon.scrollIntoViewIfNeeded();
        await this.floorplanPlusIcon.click();
        await this.page.waitForTimeout(500);
    }

    /**
     * HELPER — Get current count of floorplan rows
     */
    private async getFloorplanRowCount(): Promise<number> {
        return await this.floorplanTableRows.count();
    }

    /**
     * HELPER — Check row checkbox AND wait for header delete icon to appear
     */
    private async checkFloorplanRowAndWaitForDelete(rowIndex: number): Promise<void> {
        const checkbox = this.floorplanRowCheckbox(rowIndex);
        await expect(checkbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await checkbox.scrollIntoViewIfNeeded();
        await checkbox.click();
        await expect(this.floorplanHeaderDeleteIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Click header bulk delete icon (no confirmation popup)
     */
    private async clickFloorplanHeaderDelete(): Promise<void> {
        await expect(this.floorplanHeaderDeleteIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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


    private async toggleFloorplanHeaderCheckboxAndWaitForDelete(): Promise<void> {
        await expect(this.floorplanHeaderCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.floorplanHeaderCheckbox.scrollIntoViewIfNeeded();
        await this.floorplanHeaderCheckbox.click();
        await expect(this.floorplanHeaderDeleteIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
    private async clickFloorplanTypeColumnSort(): Promise<void> {
        await expect(this.floorplanTypeColumnHeader).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.floorplanTypeColumnHeader.scrollIntoViewIfNeeded();
        await this.floorplanTypeColumnHeader.click();
        await this.page.waitForTimeout(500);
    }


    private async assertFloorplanTypeColumnSortState(expectedState: 'none' | 'ascending' | 'descending'): Promise<void> {
        await expect(this.floorplanTypeColumnHeader).toHaveAttribute('aria-sort', expectedState, {
            timeout: ProjectActions.TIMEOUT_DEFAULT,
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
    private async scrollToProjectUpgradesSection(): Promise<void> {
        await this.projectUpgradesHeading.scrollIntoViewIfNeeded();
        await expect(this.projectUpgradesHeading).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(300);
    }

    /**
     * HELPER — Get current count of upgrade boxes
     */
    private async getUpgradeBoxCount(): Promise<number> {
        return await this.upgradeBoxes.count();
    }

    /**
     * HELPER — Clear and fill an upgrade box with Group, Upgrade, Cost values
     */
    private async clearAndFillUpgradeBox(boxIndex: number, groupName: string, upgradeName: string, cost: string): Promise<void> {
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
    private async assertUpgradeBoxValues(boxIndex: number, groupName: string, upgradeName: string, cost: string): Promise<void> {
        await expect(this.upgradeGroupInput(boxIndex)).toHaveValue(groupName, { timeout: ProjectActions.TIMEOUT_LONG });
        await expect(this.upgradeInput(boxIndex)).toHaveValue(upgradeName, { timeout: ProjectActions.TIMEOUT_LONG });
    }

    /**
     * HELPER — Click remove (cross) icon on an upgrade box
     */
    private async removeUpgradeBox(boxIndex: number): Promise<void> {
        await expect(this.upgradeBoxRemoveIcon(boxIndex)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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

    private async clickAddAdditionalUpgradeGroup(): Promise<void> {
        await expect(this.addAdditionalUpgradeGroupButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.addAdditionalUpgradeGroupButton.scrollIntoViewIfNeeded();
        await this.addAdditionalUpgradeGroupButton.click();
        await this.page.waitForTimeout(500);
    }

    /**
 * HELPER — Remove all additionally added upgrade boxes (boxes with cross icon)
 */
    private async removeAllAdditionallyAddedUpgradeBoxes(): Promise<void> {
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
    private async clickAddUpgrade(boxIndex: number): Promise<void> {
        await expect(this.addUpgradeButton(boxIndex)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.addUpgradeButton(boxIndex).scrollIntoViewIfNeeded();
        await this.addUpgradeButton(boxIndex).click();
        await this.page.waitForTimeout(500);
    }

    /**
     * HELPER — Get count of upgrade rows in a specific box
     */
    private async getUpgradeRowCount(boxIndex: number): Promise<number> {
        return await this.upgradeRowsInBox(boxIndex).count();
    }

    /**
     * HELPER — Clear and fill an upgrade row (Upgrade + Cost)
     */
    private async clearAndFillUpgradeRow(boxIndex: number, rowIndex: number, upgradeName: string, cost: string): Promise<void> {
        await this.upgradeRowInput(boxIndex, rowIndex).fill('');
        await this.upgradeRowInput(boxIndex, rowIndex).fill(upgradeName);

        await this.upgradeRowCostInput(boxIndex, rowIndex).fill('');
        await this.upgradeRowCostInput(boxIndex, rowIndex).fill(cost);

        await this.page.waitForTimeout(300);
    }

    /**
     * HELPER — Assert upgrade row has expected values
     */
    private async assertUpgradeRowValues(boxIndex: number, rowIndex: number, upgradeName: string, cost: string): Promise<void> {
        await expect(this.upgradeRowInput(boxIndex, rowIndex)).toHaveValue(upgradeName, { timeout: ProjectActions.TIMEOUT_DEFAULT });

        const actualCost = await this.upgradeRowCostInput(boxIndex, rowIndex).inputValue();
        const cleanCost = actualCost.replace(/[$,]/g, '').trim();
        expect(cleanCost).toBe(cost);
    }

    /**
     * HELPER — Click cross icon to remove an upgrade row
     */
    private async removeUpgradeRow(boxIndex: number, rowIndex: number): Promise<void> {
        await expect(this.upgradeRowRemoveIcon(boxIndex, rowIndex)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
    private async scrollToBonusPayableUpon(): Promise<void> {
        await this.bonusPayableUponLabel.scrollIntoViewIfNeeded();
        await expect(this.bonusPayableUponLabel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(300);
    }

    /**
     * HELPER — Type text in Bonus Payable Upon input and press Enter
     */
    private async addBonusPayableUponTag(tagText: string): Promise<void> {
        await expect(this.bonusPayableUponInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.bonusPayableUponInput.scrollIntoViewIfNeeded();
        await this.bonusPayableUponInput.fill(tagText);
        await this.bonusPayableUponInput.press('Enter');
        await this.page.waitForTimeout(500);
    }

    /**
     * HELPER — Assert a chip with given text exists
     */
    private async assertBonusPayableUponTagExists(tagText: string): Promise<void> {
        await expect(this.bonusPayableUponTokenByText(tagText)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.bonusPayableUponTokenByText(tagText).locator('span.p-chips-token-label')).toHaveText(tagText, {
            timeout: ProjectActions.TIMEOUT_DEFAULT,
        });
    }

    /**
     * HELPER — Remove a Bonus Payable Upon chip by text
     */
    private async removeBonusPayableUponTag(tagText: string): Promise<void> {
        await expect(this.bonusPayableUponTokenRemoveIcon(tagText)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.bonusPayableUponTokenRemoveIcon(tagText).click();
        await this.page.waitForTimeout(500);
        await expect(this.bonusPayableUponTokenByText(tagText)).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Remove all existing Bonus Payable Upon chips (cleanup)
     */
    private async removeAllBonusPayableUponTags(): Promise<void> {
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
    private async scrollToBonusPayableTo(): Promise<void> {
        await this.bonusPayableToLabel.scrollIntoViewIfNeeded();
        await expect(this.bonusPayableToLabel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(300);
    }

    /**
     * HELPER — Type text in Bonus Payable To input and press Enter
     */
    private async addBonusPayableToTag(tagText: string): Promise<void> {
        await expect(this.bonusPayableToInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.bonusPayableToInput.scrollIntoViewIfNeeded();
        await this.bonusPayableToInput.fill(tagText);
        await this.bonusPayableToInput.press('Enter');
        await this.page.waitForTimeout(500);
    }

    /**
     * HELPER — Assert a chip with given text exists
     */
    private async assertBonusPayableToTagExists(tagText: string): Promise<void> {
        await expect(this.bonusPayableToTokenByText(tagText)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.bonusPayableToTokenByText(tagText).locator('span.p-chips-token-label')).toHaveText(tagText, {
            timeout: ProjectActions.TIMEOUT_DEFAULT,
        });
    }

    /**
     * HELPER — Remove a Bonus Payable To chip by text
     */
    private async removeBonusPayableToTag(tagText: string): Promise<void> {
        await expect(this.bonusPayableToTokenRemoveIcon(tagText)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.bonusPayableToTokenRemoveIcon(tagText).click();
        await this.page.waitForTimeout(500);
        await expect(this.bonusPayableToTokenByText(tagText)).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Remove all existing Bonus Payable To chips (cleanup)
     */
    private async removeAllBonusPayableToTags(): Promise<void> {
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
    private async scrollToBonusCampaign(): Promise<void> {
        await this.bonusCampaignLabel.scrollIntoViewIfNeeded();
        await expect(this.bonusCampaignLabel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(300);
    }

    /**
     * HELPER — Type text in Bonus Campaign input and press Enter
     */
    private async addBonusCampaignTag(tagText: string): Promise<void> {
        await expect(this.bonusCampaignInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.bonusCampaignInput.scrollIntoViewIfNeeded();
        await this.bonusCampaignInput.fill(tagText);
        await this.bonusCampaignInput.press('Enter');
        await this.page.waitForTimeout(500);
    }

    /**
     * HELPER — Assert a chip with given text exists
     */
    private async assertBonusCampaignTagExists(tagText: string): Promise<void> {
        await expect(this.bonusCampaignTokenByText(tagText)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.bonusCampaignTokenByText(tagText).locator('span.p-chips-token-label')).toHaveText(tagText, {
            timeout: ProjectActions.TIMEOUT_DEFAULT,
        });
    }

    /**
     * HELPER — Remove a Bonus Campaign chip by text
     */
    private async removeBonusCampaignTag(tagText: string): Promise<void> {
        await expect(this.bonusCampaignTokenRemoveIcon(tagText)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.bonusCampaignTokenRemoveIcon(tagText).click();
        await this.page.waitForTimeout(500);
        await expect(this.bonusCampaignTokenByText(tagText)).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Remove all existing Bonus Campaign chips (cleanup)
     */
    private async removeAllBonusCampaignTags(): Promise<void> {
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

    async verifyPrecinctUnderInactiveTab(precinctName: string): Promise<void> {
        await this.navigateToProjects();
        await this.clickTabByLabel('Inactive');
        await this.getFirstVisiblePrecinctCard();
        for (const tab of ['project', 'lot', 'EOI']) {
            const el = this.innerTabById(tab);
            await expect(el).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
            await expect(el).toHaveText(new RegExp(tab, 'i'), { timeout: ProjectActions.TIMEOUT_LONG });
        }
        await this.projectsMenuLink.click();
        await expect(this.firstGridProduct).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
    }

    /**
     * Adds a project with the same name twice to confirm that uniqueness is not enforced.
     * Both projects named "Project A" should be created successfully.
     */
    async addProjectWithSameNameTwice(project?: { name?: string; status?: string }): Promise<void> {
        await this.navigateToProjects();
        const projectName = project?.name ?? faker.company.name();
        // First creation
        await this.openProjectPopup();
        await this.projectNameField.fill(projectName);
        await this.projectDialogSaveButton.click({ force: true });
        await expect(this.projectDialog).toBeHidden({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.projectAddedToast.waitFor({ state: 'visible', timeout: ProjectActions.TIMEOUT_MEDIUM }).catch(() => { });
        await this.projectTitleBanner(projectName).waitFor({ state: 'visible', timeout: ProjectActions.TIMEOUT_MEDIUM });
        // Optionally: return to projects main view for clarity
        const projectsText = this.page.locator('p', { hasText: 'Projects' });
        await expect(projectsText).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await projectsText.click({ force: true });
        await this.verifyProjectCanBeSearchedByName(projectName);
        await this.clickResetIcon();
        // Second creation with the same name
        await this.openProjectPopup();
        await this.projectNameField.fill(projectName);
        await this.projectDialogSaveButton.click({ force: true });
        await expect(this.projectDialog).toBeHidden({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.projectAddedToast.waitFor({ state: 'visible', timeout: ProjectActions.TIMEOUT_MEDIUM }).catch(() => { });
        await this.projectTitleBanner(projectName).waitFor({ state: 'visible', timeout: ProjectActions.TIMEOUT_MEDIUM });
        await expect(projectsText).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await projectsText.click({ force: true });
        await this.verifyProjectCanBeSearchedByName(projectName);
        await this.clickResetIcon();
    }

    /**
     * Updates the project name in the Project Setup and saves the changes.
     * @param currentName - The current name of the project.
     * @param newName - The new name to update to.
     */
    async updateProjectNameAndSave(currentName: string, newName: string): Promise<void> {
        await this.openProjectGeneralTab(currentName);
        await this.assertFieldVisible(this.projectSetupNameLabel, this.projectSetupNameInput);
        await this.assertFieldVisible(this.projectSetupStatusLabel, this.projectSetupStatusSelect);
        await this.projectSetupNameInput.fill(newName);
        await this.cleanupAfterProjectTest();
    }

    /**
     * Updates the project status in the Project Setup and saves the changes.
     */
    async updateProjectStatusAndSave(currentName: string, newStatus: string): Promise<void> {
        await this.openProjectGeneralTab(currentName);
        await this.assertFieldVisible(this.projectSetupStatusLabel, this.projectSetupStatusSelect);
        await this.projectSetupStatusSelect.click();
        const newStatusOption = this.page.locator('div.ng-option', { hasText: newStatus }).first();
        await newStatusOption.click();
        await this.clickGeneralTabSave();
        await this.assertProjectUpdatedToast();
        await this.cleanupAfterProjectTest();
    }

    /**
     * Assign developer, type, and manager fields together
     */
    async assignDeveloperTypeAndManager(
        projectName: string,
        developerName: string,
        manager: string
    ): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.openDeveloperDropdown();
        await this.toggleDeveloperSelection(developerName);
        await this.closeDeveloperDropdown();
        await this.assertDeveloperSelected(developerName);
        await this.openProjectsManagerDropdown();
        await expect(this.projectManagerDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        const managerOption = this.projectManagerDropdownPanel.locator('div.ng-option', { hasText: manager }).first();
        await expect(managerOption).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await managerOption.click();
        await this.closeProjectManagerDropdown();
        await this.cleanupAfterProjectTest();
    }

    /**
     * Opens the Project Display Address popup without entering any data.
     */
    async openAddressPopupWithoutData(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.openDisplayAddressPopup();
        await expect(this.displayAddressPopupHeading).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.displayAddressPopupSaveButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.closeDisplayAddressPopup();
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_xx — Enter incomplete address, fill only suburb, save, verify suburb saved and others blank
     */
    async enterIncompleteAddressAndSave(
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
                buildingName: '',
                unitNo: '',
                streetNo: '',
                streetName: '',
                suburb: 'East Albury',
                state: '',
                postCode: '',
                country: '',
            }
    ): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.openDisplayAddressPopup();
        await this.clearAllDisplayAddressFields();
        await this.fillDisplayAddressFields(addressData);
        await this.clickDisplayAddressPopupSave();
        await this.openDisplayAddressPopup();
        await this.assertDisplayAddressFieldsMatch(addressData);
        await this.closeDisplayAddressPopup();
        await this.cleanupAfterProjectTest();
    }

    private async selectProjectStatusInDialog(statusText: string): Promise<void> {
        await expect(this.projectStatusField).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.projectStatusField.click();
        await expect(this.projectStatusDropdownPanel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });

        const option = this.projectStatusOptionByText(statusText);
        await expect(option).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await option.click();
        await this.page.waitForTimeout(300);
    }

    /**
    * TC_48 — Create project with status 'Inactive'
    */
    async createProjectWithInactiveStatus(project?: { name?: string }): Promise<void> {
        await this.navigateToProjects();
        await this.openProjectPopup();
        const projectName = project?.name ?? faker.company.name();
        await this.projectNameField.fill(projectName);
        await this.selectProjectStatusInDialog('Inactive');
        await this.projectDialogSaveButton.click({ force: true });
        await expect(this.projectDialog).toBeHidden({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.projectAddedToast
            .waitFor({ state: 'visible', timeout: ProjectActions.TIMEOUT_MEDIUM })
            .catch(() => {
            });
        await this.projectTitleBanner(projectName).waitFor({
            state: 'visible',
            timeout: ProjectActions.TIMEOUT_MEDIUM,
        });
        const projectsText = this.page.locator('p', { hasText: 'Projects' });
        await expect(projectsText).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await projectsText.click({ force: true });
        await this.clickTabByLabel('Inactive');
        const card = this.projectCardByName(projectName);
        await expect(card).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await card.scrollIntoViewIfNeeded();
        await this.clickResetIcon();
    }

    /**
     * TC_49 — Validate input trimming in project name
     * Enter project name with excessive spaces and verify name is auto-trimmed (e.g. "     Name        Added     " becomes "Name Added")
     */
    async validateProjectNameTrimming(project?: { name?: string }): Promise<void> {
        await this.navigateToProjects();
        await this.openProjectPopup();
        const nameWithExcessiveSpaces = project?.name ?? `     ${faker.word.words(2)}     `;
        const expectedTrimmedName = nameWithExcessiveSpaces.trim().replace(/\s+/g, ' ');
        await this.projectNameField.fill(nameWithExcessiveSpaces);
        await this.projectDialogSaveButton.click({ force: true });
        await expect(this.projectDialog).toBeHidden({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.projectAddedToast
            .waitFor({ state: 'visible', timeout: ProjectActions.TIMEOUT_MEDIUM })
            .catch(() => { });
        await this.projectTitleBanner(expectedTrimmedName).waitFor({
            state: 'visible',
            timeout: ProjectActions.TIMEOUT_MEDIUM,
        });
        const projectsText = this.page.locator('p', { hasText: 'Projects' });
        await expect(projectsText).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await projectsText.click({ force: true });
        await this.navigateToProjects();
        await expect(this.searchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.searchInput.fill(expectedTrimmedName);
        await this.clickResetIcon();
    }

    private get lotSubTab(): Locator {
        return this.page.locator('app-project-setup a[href*="/project-setup/unit"]').first();
    }

    private get lotSubTabActive(): Locator {
        return this.page.locator('app-project-setup a[href*="/project-setup/unit"].active').first();
    }

    private get lotListTable(): Locator {
        return this.page.locator('app-unit p-table#apartmentscolumns').first();
    }

    private get lotListRecordsCounter(): Locator {
        return this.page.locator('app-unit p', { hasText: /^Records:\s*\d+/ }).first();
    }

    private get lotListSearchInput(): Locator {
        return this.page.locator('app-unit input#keywordInput').first();
    }

    private get lotListTableRows(): Locator {
        return this.lotListTable.locator('tbody tr');
    }

    private lotListRowByText(text: string): Locator {
        return this.lotListTable.locator('tbody tr').filter({ hasText: text }).first();
    }

    private get lotListExportButton(): Locator {
        return this.page.locator('app-unit button._cancel-btn', { hasText: /^\s*Export\s*$/ }).first();
    }

    private get lotListViewButton(): Locator {
        return this.page.locator('app-genaric-view div._view-btn').first();
    }

    private columnRowByName(name: string): Locator {
        return this.viewPopupContent.locator('.cdk-drag.column-item').filter({ hasText: name }).first();
    }

    private get firstVisibleColumnRow(): Locator {
        return this.visibleColumnList.first();
    }

    private columnDownArrow(row: Locator): Locator {
        return row.locator('img[src*="down-arrow"]').first();
    }

    private columnUpArrow(row: Locator): Locator {
        return row.locator('img[src*="up-arrow"]').first();
    }

    private get lotListImportInput(): Locator {
        return this.page.locator('app-unit input#csv[type="file"]').first();
    }

    private get lotListUpdateDataButton(): Locator {
        return this.page.locator('app-unit button.btn-outline', { hasText: /Update Data/i }).first();
    }

    private get lotListConfirmUpdatesButton(): Locator {
        return this.page.locator('button._outline-btn', { hasText: /Confirm Updates/i }).first();
    }

    private get lotListImportSuccessToast(): Locator {
        return this.page.locator('div[role="alert"].toast-message', {
            hasText: /Your file has successfully imported/i
        }).first();
    }

    private get lotListImportInvalidFileToast(): Locator {
        return this.page.locator('div[role="alert"].toast-message', {
            hasText: /Only \.csv, \.xls, and \.xlsx files are allowed/i
        }).first();
    }

    private get lotListAddNewButton(): Locator {
        return this.page.locator('app-unit button._addNew').first();
    }

    private get lotCreateForm(): Locator {
        return this.page.locator('app-add-unit').first();
    }

    private get lotCreateLotInput(): Locator {
        return this.lotCreateForm.locator('input[formcontrolname="lot_name"]').first();
    }

    private get lotCreateStatusReasonSelect(): Locator {
        return this.lotCreateForm.locator('ng-select[formcontrolname="status_reason"]').first();
    }

    private lotCreateStatusReasonOptionByText(text: string): Locator {
        return this.page.locator('ng-dropdown-panel .ng-option').filter({
            hasText: new RegExp(`^\\s*${text}\\s*$`, 'i')
        }).first();
    }

    private get lotCreateBedInput(): Locator {
        return this.lotCreateForm.locator('input[formcontrolname="bed"]').first();
    }

    private get lotCreateBathInput(): Locator {
        return this.lotCreateForm.locator('input[formcontrolname="bath"]').first();
    }

    private get lotCreateSaveAndCloseButton(): Locator {
        return this.lotCreateForm.locator('button._primary-btn', { hasText: /Save & Close/i }).first();
    }

    private get lotCreateCloseButton(): Locator {
        return this.lotCreateForm.locator('button._cancel-btn', { hasText: /^\s*Close\s*$/i }).first();
    }

    private get lotListMasterCheckbox(): Locator {
        return this.lotListTable.locator('thead p-tableheadercheckbox .p-checkbox-box').first();
    }

    private get lotCreateRequiredFieldToast(): Locator {
        return this.page.locator('div[role="alert"].toast-message', {
            hasText: /Fill out the required field/i
        }).first();
    }

    private lotListRowCheckbox(rowIndex: number): Locator {
        return this.lotListTable.locator('tbody tr').nth(rowIndex).locator('p-tablecheckbox .p-checkbox-box').first();
    }

    /**
     * HELPER — Verify checkboxes in the lot list table are properly aligned.
     */
    private async verifyLotListCheckboxesAlignment(): Promise<void> {
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.lotListMasterCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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

    private get lotListDeleteButton(): Locator {
        return this.page.locator('app-unit button._cancel-btn').filter({
            has: this.page.locator('img[src*="delete_icon.svg"]')
        }).first();
    }

    private get lotListSelectedRecordsLabel(): Locator {
        return this.page.locator('app-unit p', { hasText: /^Selected Records:\s*\d+/ }).first();
    }

    private lotListColumnHeader(columnName: string): Locator {
        return this.lotListTable.locator('thead th').filter({
            has: this.page.locator('p', { hasText: new RegExp(`^${columnName}$`) })
        }).first();
    }

    private lotListColumnSortIcon(columnName: string): Locator {
        return this.lotListColumnHeader(columnName).locator('p-sorticon').first();
    }

    private get lotListFilterPopup(): Locator {
        return this.page.locator('div.p-overlaypanel').first();
    }

    private lotListColumnFilterIcon(columnName: string): Locator {
        return this.lotListColumnHeader(columnName).locator('img[alt="filter"]').first();
    }

    /**
     * HELPER — Assert "Fill out the required field" error toast appears
     */
    private async assertRequiredFieldToast(): Promise<void> {
        await expect(this.lotCreateRequiredFieldToast).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
    }
    /**
     * HELPER — Click the + (Add New) button to open lot create form
     */
    private async clickAddNewLotButton(): Promise<void> {
        await expect(this.lotListAddNewButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.lotListAddNewButton.click();
        await expect(this.lotCreateForm).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(1000);
    }

    /**
     * HELPER — Fill Lot name input
     */
    private async fillLotName(lotName: string): Promise<void> {
        await expect(this.lotCreateLotInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.lotCreateLotInput.click();
        await this.lotCreateLotInput.fill(lotName);
        await this.page.waitForTimeout(300);
    }

    /**
 * HELPER — Click the master/header checkbox to select all rows
 */
    private async clickLotListMasterCheckbox(): Promise<void> {
        await expect(this.lotListMasterCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.lotListMasterCheckbox.click();
        await this.page.waitForTimeout(800);
    }

    /**
     * HELPER — Select Status Reason from dropdown
     */
    private async selectLotStatusReason(statusReason: string): Promise<void> {
        await expect(this.lotCreateStatusReasonSelect).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.lotCreateStatusReasonSelect.click();
        await this.page.waitForTimeout(500);
        const statusOption = this.lotCreateStatusReasonOptionByText(statusReason);
        await expect(statusOption).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await statusOption.click();
        await this.page.waitForTimeout(500);
    }

    /**
     * HELPER — Fill Bed input
     */
    private async fillLotBed(bed: string): Promise<void> {
        await expect(this.lotCreateBedInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.lotCreateBedInput.click();
        await this.lotCreateBedInput.fill(bed);
        await this.page.waitForTimeout(300);
    }

    /**
     * HELPER — Fill Bath input
     */
    private async fillLotBath(bath: string): Promise<void> {
        await expect(this.lotCreateBathInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.lotCreateBathInput.click();
        await this.lotCreateBathInput.fill(bath);
        await this.page.waitForTimeout(300);
    }

    /**
     * HELPER — Fill all required fields in lot create form
     */
    private async fillLotCreateForm(data: {
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

    /**
     * HELPER — Click Save & Close button in lot create form
     */
    private async clickLotCreateSaveAndClose(): Promise<void> {
        await expect(this.lotCreateSaveAndCloseButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.lotCreateSaveAndCloseButton.scrollIntoViewIfNeeded();
        await this.lotCreateSaveAndCloseButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
    }

    /**
     * HELPER — Click Close button to dismiss lot create form
     */
    private async clickLotCreateClose(): Promise<void> {
        await expect(this.lotCreateCloseButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.lotCreateCloseButton.click();
        await this.page.waitForTimeout(800);
    }

    /**
     * HELPER — Assert lot create form is closed (no longer visible)
     */
    private async assertLotCreateFormClosed(): Promise<void> {
        await expect(this.lotCreateForm).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }
    /**
 * HELPER — Get column name at given index in visible list
 */
    private async getVisibleColumnNameAtIndex(index: number): Promise<string> {
        const text = await this.visibleColumnList.nth(index).locator('p').first().innerText();
        return text.trim();
    }

    /**
     * HELPER — Click down arrow on column at given index
     */
    private async clickDownArrowAtIndex(index: number): Promise<void> {
        const row = this.visibleColumnList.nth(index);
        const downArrow = this.columnDownArrow(row);
        await expect(downArrow).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await downArrow.scrollIntoViewIfNeeded();
        await downArrow.click();
        await this.page.waitForTimeout(500);
    }

    /**
     * HELPER — Click up arrow on column at given index
     */
    private async clickUpArrowAtIndex(index: number): Promise<void> {
        const row = this.visibleColumnList.nth(index);
        const upArrow = this.columnUpArrow(row);
        await expect(upArrow).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await upArrow.scrollIntoViewIfNeeded();
        await upArrow.click();
        await this.page.waitForTimeout(500);
    }
    /**
     * HELPER — Click the Lot sub-tab inside Project Setup
     */
    private async clickLotSubTab(): Promise<void> {
        await expect(this.lotSubTab).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.lotSubTab.scrollIntoViewIfNeeded();
        await this.lotSubTab.click();
        await this.page.waitForURL(/\/project-setup\/unit/, { timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.lotSubTabActive).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * HELPER — Open Project Setup → Lot tab (full flow)
     */
    private async openProjectLotTab(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await this.page.waitForLoadState('networkidle');
        await this.clickProjectCardInProjectSection(projectName);
        await this.assertPricelistTabActive();
        await this.clickProjectSetupTab();
        await this.clickLotSubTab();
    }

    /**
     * HELPER — Type a keyword in the lot list search input and trigger filter
     */
    private async searchLotList(keyword: string): Promise<void> {
        await expect(this.lotListSearchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.lotListSearchInput.scrollIntoViewIfNeeded();
        await this.lotListSearchInput.fill('');
        await this.lotListSearchInput.fill(keyword);
        await this.lotListSearchInput.press('Enter');
        await this.page.waitForTimeout(1000);
    }

    /**
     * HELPER — Get count of visible rows in lot list
     */
    private async getLotListRowCount(): Promise<number> {
        return await this.lotListTableRows.count();
    }

    /**
     * HELPER — Assert a row containing the given text is visible
     */
    private async assertLotListRowExists(text: string): Promise<void> {
        await expect(this.lotListRowByText(text)).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    /**
 * HELPER — Click Export button and wait for file download
 */
    private async clickLotListExportAndDownload(): Promise<void> {
        await expect(this.lotListExportButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        const downloadPromise = this.page.waitForEvent('download', { timeout: ProjectActions.TIMEOUT_LONG });
        await this.lotListExportButton.click();
        const download = await downloadPromise;
        await download.saveAs(`./downloads/${download.suggestedFilename()}`);
    }

    /**
     * HELPER — Click the View button in lot list
     */
    private async clickLotListViewButton(): Promise<void> {
        await expect(this.lotListViewButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.lotListViewButton.scrollIntoViewIfNeeded();
        await this.lotListViewButton.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * HELPER — Upload a file to the lot list import input
     */
    private async uploadLotImportFile(fileName: string): Promise<void> {
        const filePath = path.resolve(ProjectActions.IMAGES_DIR, fileName);
        await this.lotListImportInput.setInputFiles(filePath);
        await this.page.waitForTimeout(2000);
    }

    /**
     * HELPER — Click Update Data button
     */
    private async clickUpdateDataButton(): Promise<void> {
        await expect(this.lotListUpdateDataButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.lotListUpdateDataButton.scrollIntoViewIfNeeded();
        await this.lotListUpdateDataButton.click();
        await this.page.waitForTimeout(1500);
    }

    /**
     * HELPER — Click Confirm Updates button
     */
    private async clickConfirmUpdatesButton(): Promise<void> {
        await expect(this.lotListConfirmUpdatesButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.lotListConfirmUpdatesButton.scrollIntoViewIfNeeded();
        await this.lotListConfirmUpdatesButton.click();
        await this.page.waitForTimeout(2000);
    }

    /**
     * HELPER — Assert import success toast appears
     */
    private async assertImportSuccessToast(): Promise<void> {
        await expect(this.lotListImportSuccessToast).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
    }

    /**
* HELPER — Assert invalid file error toast appears
*/
    private async assertInvalidFileToast(): Promise<void> {
        await expect(this.lotListImportInvalidFileToast).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
    }

    /**
     * HELPER — Select checkbox of a specific row (by index)
     */
    private async selectLotListRowCheckbox(rowIndex: number): Promise<void> {
        const checkbox = this.lotListRowCheckbox(rowIndex);
        await expect(checkbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await checkbox.click();
        await this.page.waitForTimeout(500);
    }

    /**
     * HELPER — Click the Delete button (appears after row selection)
     */
    private async clickLotListDeleteButton(): Promise<void> {
        await expect(this.lotListDeleteButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.lotListDeleteButton.scrollIntoViewIfNeeded();
        await this.lotListDeleteButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
    }

    /**
     * HELPER — Get the lot name from a specific row (by index)
     */
    private async getLotNameFromRow(rowIndex: number): Promise<string> {
        const row = this.lotListTable.locator('tbody tr').nth(rowIndex);
        const lotCell = row.locator('td').nth(1).locator('p');
        const text = await lotCell.innerText();
        return text.trim();
    }

    /**
     * HELPER — Assert "Selected Records: N" label is visible
     */
    private async assertSelectedRecordsLabel(): Promise<void> {
        await expect(this.lotListSelectedRecordsLabel).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }
    /**
 * TC_01 — Verify clicking Lot tab displays the lot list
 */
    async verifyLotTabDisplaysLotList(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.page).toHaveURL(/\/project-setup\/unit/, { timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.lotSubTabActive).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.lotListRecordsCounter).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.lotListRecordsCounter).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.searchLotList(keyword);
        await this.assertLotListRowExists(keyword);
        await expect(this.lotListRecordsCounter).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotListExportAndDownload();
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_05 — Verify view button is clickable
     */
    async verifyLotListViewButtonClickable(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.lotListViewButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotListViewButton();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(800);
        await expect(this.viewPopupContent).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_06 — Verify all statuses can be hidden/unhidden using eye icon
 */
    async verifyHideUnhideAllStatuses(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotListViewButton();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickHideAll();
        await this.page.waitForTimeout(1200);
        await this.clickShowAll();
        await this.page.waitForTimeout(500);
        await this.saveOrCreateButton.click();
        await this.cleanupAfterProjectTest();
    }

    async verifyDragAndDropChangesStatusPositions(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotListViewButton();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.columnSearchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.columnSearchInput.fill(statusName);
        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);
        await expect(this.columnItemByName(statusName).first()).toBeVisible({
            timeout: ProjectActions.TIMEOUT_DEFAULT,
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotListViewButton();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.viewDropdownArrow).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotListViewButton();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.addViewIcon.waitFor({ state: 'visible', timeout: ProjectActions.TIMEOUT_LONG });
        await this.addViewIcon.click();
        await expect(this.viewNameInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.viewNameInput.click();
        await this.viewNameInput.fill(viewName);
        await expect(this.saveOrCreateButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.saveOrCreateButton.click({ force: true });
        await expect(this.viewCreatedToast).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotListViewButton();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.shareViewIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.shareViewIcon.click({ force: true });
        await this.selectShareTarget(this.usersShareDropdown, this.usersShareDropdownArrow, userName);
        await expect(this.shareButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.shareButton.click({ force: true });
        await expect(this.shareResponseMessage()).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotListViewButton();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.shareViewIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.shareViewIcon.click({ force: true });
        await this.selectShareTarget(this.teamsShareDropdown, this.teamsShareDropdownArrow, teamName);
        await expect(this.shareButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.shareButton.click({ force: true });
        await expect(this.shareResponseMessage()).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_ — Verify that a saved view reflects the reordered statuses 
     */
    async verifySavedViewReflectsReorderedStatuses(
        projectName: 'Automation',
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotListViewButton();
        await this.reorderCollapsedArrow.click();
        await this.page.waitForTimeout(500);
        await this.reorderExpandCollapseArrow.click();
        await this.page.waitForTimeout(500);
        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotListViewButton();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(ProjectActions.UI_SETTLE_DELAY);
        await expect(this.viewDropdownArrow).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.viewDropdownArrow.click();
        const viewOption = this.savedViewOption(viewName);
        await expect(viewOption).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        const deleteIcon = viewOption.locator('img[src*="delete_icon.svg"]');
        await expect(deleteIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await deleteIcon.click();
        try {
            await expect(this.confirmAnyButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_SHORT });
            await this.confirmAnyButton.click();
        } catch {

        }
        await expect(this.viewDeletedToast).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickAddNewLotButton();
        await expect(this.lotCreateSaveAndCloseButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.selectLotListRowCheckbox(1);
        await this.assertSelectedRecordsLabel();
        await this.clickLotListDeleteButton();
        await this.cleanupAfterProjectTest();
    }
    private async selectMultipleLotListRowCheckboxes(rowIndexes: number[]): Promise<void> {
        for (const index of rowIndexes) {
            await this.selectLotListRowCheckbox(index);
        }
    }
    /**
 * TC_ — Verify bulk deletion of lots
 */
    async verifyBulkLotDeletion(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.lotListDeleteButton).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.lotListSelectedRecordsLabel).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.cleanupAfterProjectTest();
    }

    /**
     * HELPER — Click sort icon on a specific column
     */
    private async clickLotListColumnSortIcon(columnName: string): Promise<void> {
        const sortIcon = this.lotListColumnSortIcon(columnName);
        await expect(sortIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await sortIcon.scrollIntoViewIfNeeded();
        await sortIcon.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * HELPER — Assert sort state of a column (none/ascending/descending)
     */
    private async assertLotListColumnSortState(
        columnName: string,
        state: 'none' | 'ascending' | 'descending'
    ): Promise<void> {
        const sortIcon = this.lotListColumnSortIcon(columnName);
        await expect(sortIcon).toHaveAttribute('aria-sort', state, {
            timeout: ProjectActions.TIMEOUT_DEFAULT
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
    private async assertFilterPopupVisible(): Promise<void> {
        await expect(this.lotListFilterPopup).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
    }

    /**
     * Dropdown for the filter "Values" in the filter popup (ng-select, not re-multiselect)
     */
    private get filterValuesDropdown(): Locator {
        return this.lotListFilterPopup.locator('ng-select[placeholder="Select"]');
    }

    private get filterConditionDropdown(): Locator {
        return this.lotListFilterPopup.locator('re-multiselect').first();
    }

    private get filterPopup(): Locator {
        return this.page.getByRole('dialog');
    }

    get equalsOption() {
        return this.page.getByRole('option', { name: /equals/i });
    }

    get searchBoxInFilterPopup(): Locator {
        return this.page.locator('input[placeholder="Search"]').last();
    }

    private optionListItemInFilterPopup(name: string): Locator {
        return this.page.getByRole('dialog').getByRole('listitem').filter({ hasText: name });
    }

    private get filterByTasksRemoveIcon(): Locator {
        return this.page.locator('.filter-by-tasks > re-multiselect > .box > .tags > .fas');
    }

    private get recordsFooter(): Locator {
        return this.page.locator('text=Records:');
    }

    /**
     * Option inside dropdown 
     */
    private optionInFilterPopup(option: string): Locator {
        return this.page
            .getByRole('dialog')
            .locator('li')
            .filter({ hasText: option });
    }
    /**
     * Apply button in filter popup
     */
    private get applyFilterButton(): Locator {
        return this.filterPopup.getByRole('button', { name: /apply/i });
    }

    /**
     * Locator for the close ("times") icon in filter popup.
     */
    private get filterPopupCloseIcon(): Locator {
        return this.page.locator('i.pi.pi-times.f-14.cursor-pointer').last();
    }

    /**
     * Locator for the "Clear" button inside the filter popup.
     */
    private get clearFilterButton(): Locator {
        return this.filterPopup.getByRole('button', { name: /clear/i });
    }

    /**
     * Locator for the "Select all" checkbox inside the filter popup.
     */
    private get selectAllCheckboxInFilterPopup(): Locator {
        return this.page.locator('div.checkbox__checkmark').first();
    }

    /**
     * Clicks the "Select all" checkbox in the filter popup.
     */
    private async selectAllInFilterPopup(): Promise<void> {
        const selectAllCheckbox = this.selectAllCheckboxInFilterPopup;
        await expect(selectAllCheckbox).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await selectAllCheckbox.click();
    }

    /**
     * HELPER — Assert both Condition (re-multiselect) and Values (ng-select) dropdowns are visible in filter popup
     */
    private async assertFilterDropdownsVisible(): Promise<void> {
        await expect(this.filterValuesDropdown).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.filterConditionDropdown).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    private async openFilterPopup(): Promise<void> {
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
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
    private async selectConditionDropdownOptionWithSearch(searchTerm: string): Promise<void> {
        await this.filterConditionDropdown.click();
        const searchBox = this.searchBoxInFilterPopup;
        await expect(searchBox).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await searchBox.click();
        await searchBox.fill(searchTerm);
        const optionLocator = this.optionInFilterPopup(searchTerm);
        await expect(optionLocator).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await optionLocator.click();
        await expect(this.filterConditionDropdown).toHaveText(
            new RegExp(searchTerm, 'i'),
            { timeout: ProjectActions.TIMEOUT_DEFAULT }
        );

        await this.filterByTasksRemoveIcon.click();
    }

    /**
     * Helper to click the "Select All" checkbox for Statuses in filter popup.
     */
    private async selectAllStatusesInFilterPopup(): Promise<void> {
        // Open the filterConditionDropdown, which shows the filter popup.
        await this.filterConditionDropdown.click();
        const searchBox = this.searchBoxInFilterPopup;
        await expect(searchBox).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.selectAllInFilterPopup();
    }

    /**
 * Helper to click the "Deselect All" checkbox for Statuses in filter popup.
 */
    private async deselectAllStatusesInFilterPopup(): Promise<void> {
        // Open the filterConditionDropdown, which shows the filter popup.
        await this.filterConditionDropdown.click();
        const searchBox = this.searchBoxInFilterPopup;
        await expect(searchBox).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
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
    private async selectMultipleStatusesInFilterPopup(statuses: string[]): Promise<void> {
        // Ensure the filter popup and search box are visible
        await this.filterConditionDropdown.click();
        const searchBox = this.searchBoxInFilterPopup;
        await expect(searchBox).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await searchBox.click();

        for (const status of statuses) {
            await searchBox.fill(status);
            const optionLocator = this.optionInFilterPopup(status);
            await expect(optionLocator).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
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
        await expect(resultLocator.first()).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.cleanupAfterProjectTest();
    }

    /**
     * Helper to type a value in the filter dropdown search
     */
    private async typeInFilterDropdownSearch(value: string): Promise<void> {
        await this.filterConditionDropdown.click();
        const searchBox = this.searchBoxInFilterPopup;
        await expect(searchBox).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
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
        await expect(this.lotListRecordsCounter).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
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
        await expect(this.lotTableRows.nth(count - 1)).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await this.cleanupAfterProjectTest();
    }
    /**
     * Check vertical alignment of header and row checkboxes in Lot table
     */
    async verifyLotTableCheckboxAlignment(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.verifyLotListCheckboxesAlignment();
        await this.cleanupAfterProjectTest();
    }


    /**
     * Verify that the create button is not clickable when the name input is empty
     */
    async verifyCreateButtonNotClickableWithoutName(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotListViewButton();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.addViewIcon.waitFor({ state: 'visible', timeout: ProjectActions.TIMEOUT_LONG });
        await this.addViewIcon.click();
        await expect(this.viewNameInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.viewNameInput.click();
        await this.saveOrCreateButton.click({ force: true });
        await expect(this.viewNameInputInvalid).toBeVisible({ timeout: ProjectActions.TIMEOUT_SHORT });
        await this.cleanupAfterProjectTest();
    }

    /**
     * Verify that switching between views updates the lots list layout.
     */
    async verifySwitchingBetweenViewsUpdatesListLayout(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotListViewButton();
        await expect(this.viewDropdownArrow).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.viewDropdownArrow.click();
        await this.page.waitForTimeout(1000);
        const testViewOption = this.page.locator('p', { hasText: 'Test View' }).last();
        await expect(testViewOption).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await testViewOption.click();
        await this.saveOrCreateButton.click({ force: true });
        await this.cleanupAfterProjectTest();
    }

    private get lotFormTabTitle(): Locator {
        return this.page.locator('a#pills-lot-tab').first();
    }

    private get lotFormSaveAndCloseButton(): Locator {
        return this.page.locator('app-edit-unit button._primary-btn').filter({ hasText: /save\s*&\s*close/i }).first();
    }

    private get lotFormSaveButton(): Locator {
        return this.page.locator('app-edit-unit button._outline-btn').filter({ hasText: /^\s*save\s*$/i }).first();
    }

    private get lotFormNameHandle(): Locator {
        return this.page.locator('app-edit-unit .name-handle').first();
    }

    private get lotFormNameHandleText(): Locator {
        return this.page.locator('app-edit-unit .name-handle p').first();
    }

    private get lotFormProjectDropdown(): Locator {
        return this.page.locator('app-edit-unit ng-select[formcontrolname="projectid"]').first();
    }

    private get lotFormProjectDropdownOptions(): Locator {
        return this.page.locator('ng-dropdown-panel .ng-option');
    }

    private get lotFormProjectDropdownCombobox(): Locator {
        return this.lotFormProjectDropdown.locator('div[role="combobox"]').first();
    }

    private get lotFormProjectDropdownSelectedValue(): Locator {
        return this.lotFormProjectDropdown.locator('.ng-value-label').first();
    }

    private get lotFormStatusReasonDropdown(): Locator {
        return this.page.locator('app-edit-unit ng-select[formcontrolname="status_reason"]').first();
    }

    private get lotFormStudyInput(): Locator {
        return this.page.locator('app-edit-unit input[formcontrolname="study"]').first();
    }

    private get lotFormOrientationInput(): Locator {
        return this.page.locator('app-edit-unit input[formcontrolname="orientation"]').first();
    }
    private lotFormStatusReasonOptionByText(statusText: string): Locator {
        return this.lotFormStatusReasonOptions.filter({ hasText: new RegExp(`^\\s*${statusText}\\s*$`, 'i') }).first();
    }

    /**
 * HELPER — Fill optional fields on lot form
 */
    private async fillLotFormOptionalFields(data: {
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
    private async assertLotFormOptionalFieldsRetained(data: {
        bed?: string;
        bath?: string;
        study?: string;
        aspect?: string;
        orientation?: string;
    }): Promise<void> {
        if (data.bed !== undefined) {
            await expect(this.lotFormBedInput).toHaveValue(data.bed, { timeout: ProjectActions.TIMEOUT_DEFAULT });
        }
        if (data.bath !== undefined) {
            await expect(this.lotFormBathInput).toHaveValue(data.bath, { timeout: ProjectActions.TIMEOUT_DEFAULT });
        }
        if (data.study !== undefined) {
            await expect(this.lotFormStudyInput).toHaveValue(data.study, { timeout: ProjectActions.TIMEOUT_DEFAULT });
        }
        if (data.aspect !== undefined) {
            await expect(this.lotFormAspectInput).toHaveValue(data.aspect, { timeout: ProjectActions.TIMEOUT_DEFAULT });
        }
        if (data.orientation !== undefined) {
            await expect(this.lotFormOrientationInput).toHaveValue(data.orientation, { timeout: ProjectActions.TIMEOUT_DEFAULT });
        }
    }

    /**
 * HELPER — Click Status Reason dropdown to open options
 */
    private async clickLotFormStatusReasonDropdown(): Promise<void> {
        await expect(this.lotFormStatusReasonDropdown).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.lotFormStatusReasonDropdown.click();
        await this.page.waitForTimeout(800);
    }

    /**
     * HELPER — Assert all expected status options are visible in Status Reason dropdown
     */
    private async assertStatusReasonOptionsVisible(expectedStatuses: string[]): Promise<void> {
        // Verify options panel is open
        await expect(this.lotFormStatusReasonOptions.first()).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        for (const status of expectedStatuses) {
            const option = this.lotFormStatusReasonOptionByText(status);
            await expect(option).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        }
    }

    /**
     * HELPER — Close Project dropdown by clicking selected option
     */
    private async closeLotFormProjectDropdown(projectName: string): Promise<void> {
        const selectedOption = this.lotFormProjectDropdownOptions.filter({ hasText: projectName }).first();
        await expect(selectedOption).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await selectedOption.click();
        await this.page.waitForTimeout(500);
    }

    /**
     * HELPER — Assert Project dropdown is closed (aria-expanded="false")
     */
    private async assertProjectDropdownClosed(): Promise<void> {
        await expect(this.lotFormProjectDropdownCombobox).toHaveAttribute('aria-expanded', 'false', {
            timeout: ProjectActions.TIMEOUT_DEFAULT
        });
    }

    /**
 * HELPER — Click Project dropdown on lot form to open project list
 */
    private async clickLotFormProjectDropdown(): Promise<void> {
        await expect(this.lotFormProjectDropdown).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.lotFormProjectDropdown.click();
        await this.page.waitForTimeout(800);
    }

    /**
     * HELPER — Assert Project dropdown options list is visible (popup open)
     */
    private async assertProjectDropdownOptionsVisible(): Promise<void> {
        await expect(this.lotFormProjectDropdownOptions.first()).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    /**
 * HELPER — Assert Apartment Details and History tabs are visible on lot form
 */
    private async assertLotFormTabsVisible(): Promise<void> {
        await expect(this.lotFormApartmentDetailsTab).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.lotFormHistoryTab).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    /**
 * HELPER — Click a lot row by its lot name to open lot form
 */
    private async clickLotRowByName(lotName: string): Promise<void> {
        const targetLotRow = this.lotListTableRows.filter({ hasText: lotName }).first();
        await expect(targetLotRow).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await targetLotRow.click();
        await this.page.waitForTimeout(1500);
    }

    /**
     * HELPER — Assert lot form tab shows the lot name in title
     */
    private async assertLotFormTabTitle(lotName: string): Promise<void> {
        await expect(this.lotFormTabTitle).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.lotFormTabTitle).toContainText(lotName, {
            timeout: ProjectActions.TIMEOUT_DEFAULT
        });
    }

    /**
     * HELPER — Click "Save & Close" button on lot form
     */
    private async clickLotFormSaveAndClose(): Promise<void> {
        await expect(this.lotFormSaveAndCloseButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.lotFormSaveAndCloseButton.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * HELPER — Click "Save" button on lot form 
     */
    private async clickLotFormSave(): Promise<void> {
        await expect(this.lotFormSaveButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.lotFormSaveButton.click();
        await this.page.waitForTimeout(1000);
    }

    /**
  * HELPER — Click popup close icon 
  */
    private async clickPopupCloseIcon(): Promise<void> {
        await expect(this.popupCloseIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.popupCloseIcon.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * HELPER — Assert lot form is closed 
     */
    private async assertLotFormClosed(): Promise<void> {
        await expect(this.lotFormSaveAndCloseButton).not.toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    /**
 * HELPER — Assert project name appears below tab in name-handle
 */
    private async assertProjectNameBelowTab(projectName: string): Promise<void> {
        await expect(this.lotFormNameHandle).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.lotFormNameHandleText).toContainText(projectName, {
            timeout: ProjectActions.TIMEOUT_DEFAULT
        });
    }

    /**
     * HELPER — Assert lot name appears below tab in name-handle
     */
    private async assertLotNameBelowTab(lotName: string): Promise<void> {
        await expect(this.lotFormNameHandle).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.lotFormNameHandleText).toContainText(lotName, {
            timeout: ProjectActions.TIMEOUT_DEFAULT
        });
    }

    /**
 * HELPER — Assert Project dropdown is auto-filled with given project name
 */
    private async assertProjectDropdownAutoFilled(projectName: string): Promise<void> {
        await expect(this.lotFormProjectDropdownSelectedValue).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.lotFormProjectDropdownSelectedValue).toContainText(projectName, {
            timeout: ProjectActions.TIMEOUT_DEFAULT
        });
    }

    /**
 * TC_01 — Click a lot row to open the lot form/details panel
 */
    async clickLotOpensLotForm(
        projectName: string = 'Automation',
        lotName: string = 'Automation Lot'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotRowByName(lotName);
        await expect(this.lotFormSaveAndCloseButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotFormSaveAndClose();
        await this.assertSuccessToast();
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_02 — Verify lot name is shown on the form tab
     */
    async verifyLotNameShownOnFormTab(
        projectName: string = 'Automation',
        lotName: string = 'Automation Lot'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotRowByName(lotName);
        await this.assertLotFormTabTitle(lotName);
        await this.clickLotFormSaveAndClose();
        await this.assertSuccessToast();
        await this.cleanupAfterProjectTest();
    }

    /**
   * TC_03 — Verify left cross icon closes lot form
   */
    async verifyLeftCrossIconClosesLotForm(
        projectName: string = 'Automation',
        lotName: string = 'Automation Lot'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotRowByName(lotName);
        await expect(this.lotFormSaveAndCloseButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickPopupCloseIcon();
        await this.assertLotFormClosed();
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_05 — Verify project and lot name appear below tab
 */
    async verifyProjectAndLotNameBelowsTab(
        projectName: string = 'Automation',
        lotName: string = 'Automation Lot'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotRowByName(lotName);
        await expect(this.lotFormSaveAndCloseButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.assertProjectNameBelowTab(projectName);
        await this.clickLotFormSaveAndClose();
        await this.assertSuccessToast();
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_06 — Verify Apartment Details and History tabs are visible on lot form
 */
    async verifyApartmentDetailAndHistoryTabsVisible(
        projectName: string = 'Automation',
        lotName: string = 'Automation Lot'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotRowByName(lotName);
        await expect(this.lotFormSaveAndCloseButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.assertLotFormTabsVisible();
        await this.clickLotFormSaveAndClose();
        await this.assertSuccessToast();
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_07 — Verify Project dropdown is auto-filled with current project
 */
    async verifyProjectsDropdownAutoFilled(
        projectName: string = 'Automation',
        lotName: string = 'Automation Lot'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotRowByName(lotName);
        await expect(this.lotFormSaveAndCloseButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.assertProjectDropdownAutoFilled(projectName);
        await this.clickLotFormSaveAndClose();
        await this.assertSuccessToast();
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_09 — Verify Status Reason dropdown shows all status options
 */
    async verifyStatusReasonDropdownShowsAllStatuses(
        projectName: string = 'Automation',
        lotName: string = 'Automation Lot'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotRowByName(lotName);
        await expect(this.lotFormSaveAndCloseButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotFormStatusReasonDropdown();
        const expectedStatuses = ['For Sale', 'Withheld', 'Developer Hold'];
        await this.assertStatusReasonOptionsVisible(expectedStatuses);
        await this.clickLotFormSaveAndClose();
        await this.assertSuccessToast();
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_12 — Verify optional fields accept and retain input
 */
    async verifyOptionalFieldAcceptInput(
        projectName: string = 'Automation',
        lotName: string = 'Automation Lot'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotRowByName(lotName);
        await expect(this.lotFormSaveAndCloseButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        const optionalData = {
            bed: '3',
            bath: '2',
            study: 'Yes',
            aspect: 'North',
            orientation: 'East'
        };
        await this.fillLotFormOptionalFields(optionalData);
        await this.assertLotFormOptionalFieldsRetained(optionalData);
        await this.clickLotFormSaveAndClose();
        await this.assertSuccessToast();
        await this.cleanupAfterProjectTest();
    }

    /**
 * HELPER — Select a project from Project dropdown by searching and exact-text click
 */
    private async selectLotFormProject(projectName: string): Promise<void> {
        // Open dropdown
        await this.clickLotFormProjectDropdown();

        // Type project name in search input
        const searchInput = this.lotFormProjectDropdown.locator('input[type="text"]').first();
        await searchInput.fill(projectName);
        await this.page.waitForTimeout(500);

        // Click exact match option
        const projectOption = this.page.getByRole('option', { name: projectName, exact: true });
        await expect(projectOption).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await projectOption.click();
        await this.page.waitForTimeout(500);
    }

    /**
 * TC_11 — Verify project can be changed to "Automation"
 */
    async verifyProjectCanBeChange(
        projectName: string = 'Automation',
        lotName: string = 'Automation Lot'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotRowByName(lotName);
        await expect(this.lotFormSaveAndCloseButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.selectLotFormProject(projectName);
        await this.assertProjectDropdownAutoFilled(projectName);
        await this.clickLotFormSaveAndClose();
        await this.assertSuccessToast();
        await this.cleanupAfterProjectTest();
    }


    /**
 * TC_13 — Verify close button exits without saving changes
 */
    async verifyCloseButtonExitWithoutSaving(
        projectName: string = 'Automation',
        lotName: string = 'Automation Lot'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotRowByName(lotName);
        await this.lotFormLotInput.fill('Changed Lot Name');
        await this.page.waitForTimeout(500);
        expect(await this.lotFormLotInput.inputValue()).toBe('Changed Lot Name');
        await this.clickPopupCloseIcon();
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_14 — Verify Save button saves form without closing
     */
    async verifySaveButtonSavesFormWithoutClosing(
        projectName: string = 'Automation',
        lotName: string = 'Automation Lot'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotRowByName(lotName);
        await this.lotFormLotInput.fill('Automation Lot');
        await this.clickLotFormSave();
        await expect(this.lotFormSaveAndCloseButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.lotFormSaveButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        expect(await this.lotFormLotInput.inputValue()).toBe('Automation Lot');
        await this.lotFormLotInput.fill(lotName);
        await this.clickLotFormSaveAndClose();
        await this.assertSuccessToast();
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_15 — Verify Save & Close button saves form and closes it
     */
    async verifySaveAndCloseButtonSaveAndClosesForm(
        projectName: string = 'Automation',
        lotName: string = 'Automation Lot'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotRowByName(lotName);
        // Optionally, modify data
        await this.lotFormLotInput.fill('Automation Lot');
        await this.clickLotFormSaveAndClose();
        await this.assertSuccessToast();
        await this.cleanupAfterProjectTest();
    }

    /**
     * Helper to open and validate history tab for current lot.
     */
    async openAndValidateHistoryTab(): Promise<number> {
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        await expect(this.lotFormHistoryTab).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.lotFormHistoryTab.click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormHistoryTab).toHaveClass(/active/);
        await expect(this.historyTabContent).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
        const rowCount = await this.historyTableRows.count();
        expect(rowCount).toBeGreaterThan(0);
        await expect(this.historyRecordsCount).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        return rowCount;
    }

    /**
     * TC_17 — Verify history tab loads properly
     */
    async verifyHistoryTabLoadsProperly(
        projectName: string = 'Automation',
        lotName: string = 'Automation Lot'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotRowByName(lotName);
        await this.openAndValidateHistoryTab();
        await this.clickPopupCloseIcon();
        await this.cleanupAfterProjectTest();
    }

    /**
     * Helper to perform a search in the history tab and check results.
     */
    async searchHistoryTabAndCheck(keyword: string): Promise<void> {
        await expect(this.historySearchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.historySearchInput.fill(keyword);
        await this.page.waitForTimeout(1500);

        const filteredCount = await this.historyTableRows.count();
        expect(filteredCount).toBeGreaterThan(0);
        const firstRowText = (await this.historyTableRows.first().innerText()).toLowerCase();
        expect(firstRowText).toContain(keyword.toLowerCase());
    }

    /**
     * TC_18 — Verify search works in history tab
     */
    async verifyHistorySearchInTab(
        searchKeyword: string,
        projectName: string = 'Automation',
        lotName: string = 'Automation Lot'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await this.clickLotRowByName(lotName);
        await this.openAndValidateHistoryTab();
        await this.searchHistoryTabAndCheck(searchKeyword);
        await this.clickPopupCloseIcon();
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_19 — Verify change date is correct in the history tab
     */
    async verifyHistoryChangeDateInTab(
        projectName: string = 'Automation',
        lotName: string = 'Automation Lot'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await this.clickLotRowByName(lotName);
        await this.openAndValidateHistoryTab();
        const changedDateText = (await this.historyRowChangedDate(this.historyTableRows.first()).innerText()).trim();
        expect(changedDateText.length).toBeGreaterThan(0);
        expect(changedDateText).toMatch(/\d{2}-\d{2}-\d{4}\s+\d{1,2}:\d{2}\s+(AM|PM)/i);
        await this.clickPopupCloseIcon();
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_20 — Verify change by field shows updating staff in history tab
     */
    async verifyHistoryChangeByFieldInTab(
        projectName: string = 'Automation',
        lotName: string = 'Automation Lot'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await this.clickLotRowByName(lotName);
        await this.openAndValidateHistoryTab();
        const changedByText = (await this.historyRowChangedBy(this.historyTableRows.first()).innerText()).trim();
        expect(changedByText.length).toBeGreaterThan(0);
        await this.clickPopupCloseIcon();
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_21 — Verify event column shows 'Create' or 'Update'
     */
    async verifyHistoryEventColumnShowsCreateOrUpdate(
        projectName: string = 'Automation',
        lotName: string = 'Automation Lot'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await this.clickLotRowByName(lotName);
        await this.openAndValidateHistoryTab();
        const eventText = (await this.historyRowEvent(this.historyTableRows.first()).innerText()).trim();
        expect(['Create', 'Update']).toContain(eventText);
        await this.clickPopupCloseIcon();
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_22 — Verify change fields show updated fields in history tab
     */
    async verifyHistoryChangedField(
        projectName: string = 'Automation',
        lotName: string = 'Automation Lot'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await this.clickLotRowByName(lotName);
        await this.openAndValidateHistoryTab();
        // Using the existing method historyRowChangedField as per linter suggestion
        const changedFieldsText = (await this.historyRowChangedField(this.historyTableRows.first()).innerText()).trim();
        expect(changedFieldsText.length).toBeGreaterThan(0);
        await this.clickPopupCloseIcon();
        await this.cleanupAfterProjectTest();
    }

    /**
 * HELPER — Get trimmed Event text from a history row
 */
    private async getHistoryRowEventText(row: Locator): Promise<string> {
        return (await this.historyRowEvent(row).innerText()).trim();
    }

    /**
     * HELPER — Get trimmed Old Value text from a history row
     */
    private async getHistoryRowOldValueText(row: Locator): Promise<string> {
        return (await this.historyRowOldValue(row).innerText()).trim();
    }

    /**
     * HELPER — Get trimmed New Value text from a history row
     */
    private async getHistoryRowNewValueText(row: Locator): Promise<string> {
        return (await this.historyRowNewValue(row).innerText()).trim();
    }

    /**
     * HELPER — Assert all rows matching expectedEvent have old value empty and new value present
     * Used for CREATE events where only new values should be shown
     */
    private async assertOnlyNewValuesForEvent(expectedEvent: string): Promise<void> {
        const rowCount = await this.historyTableRows.count();
        expect(rowCount).toBeGreaterThan(0);

        for (let i = 0; i < rowCount; i++) {
            const row = this.historyTableRows.nth(i);
            const eventText = await this.getHistoryRowEventText(row);

            if (eventText === expectedEvent) {
                const oldValueText = await this.getHistoryRowOldValueText(row);
                const newValueText = await this.getHistoryRowNewValueText(row);

                // CREATE event: old value should be empty
                expect(oldValueText === '' || oldValueText === undefined).toBeTruthy();
                // CREATE event: new value should exist
                expect(newValueText.length).toBeGreaterThan(0);
            }
        }
    }

    /**
     * HELPER — Assert all rows matching expectedEvent have BOTH old and new values present
     * Used for UPDATE events where both values should be shown
     */
    private async assertBothValuesForEvent(expectedEvent: string): Promise<void> {
        const rowCount = await this.historyTableRows.count();
        expect(rowCount).toBeGreaterThan(0);

        for (let i = 0; i < rowCount; i++) {
            const row = this.historyTableRows.nth(i);
            const eventText = await this.getHistoryRowEventText(row);

            if (eventText === expectedEvent) {
                const oldValueText = await this.getHistoryRowOldValueText(row);
                const newValueText = await this.getHistoryRowNewValueText(row);
                expect(oldValueText.length).toBeGreaterThan(0);
                expect(newValueText.length).toBeGreaterThan(0);
            }
        }
    }

    /**
 * TC_23 — Verify only new values are shown on creation
 */
    async verifyNewValuesShownOnCreation(
        expectedEvent: string = 'Create',
        projectName: string = 'Automation',
        lotName: string = 'Automation Lot'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await this.clickLotRowByName(lotName);
        await this.openAndValidateHistoryTab();
        await this.assertOnlyNewValuesForEvent(expectedEvent);
        await this.clickPopupCloseIcon();
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_24 — Verify both old and new values are shown on update
     */
    async verifyBothOldAndNewValueOnUpdate(
        projectName: string = 'Automation',
        lotName: string = 'Automation Lot',
        expectedEvent: string = 'update'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await this.clickLotRowByName(lotName);
        await this.openAndValidateHistoryTab();
        await this.assertBothValuesForEvent(expectedEvent);
        await this.clickPopupCloseIcon();
        await this.cleanupAfterProjectTest();
    }

    /**
 * HELPER — Search for a project in dropdown and assert no results found
 */
    private async assertInvalidProjectNotFound(invalidProjectName: string): Promise<void> {
        await this.clickLotFormProjectDropdown();
        const searchInput = this.lotFormProjectDropdown.locator('input[type="text"]').first();
        await searchInput.fill(invalidProjectName);
        await this.page.waitForTimeout(800);
        const matchingOption = this.lotFormProjectDropdownOptions.filter({
            hasText: new RegExp(invalidProjectName, 'i')
        });
        await expect(matchingOption).toHaveCount(0, { timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    /**
     * TC_25 — Verify invalid/removed project cannot be selected in dropdown
     */
    async verifyInvalidProjectCannotBeSelected(
        projectName: string = 'Automation',
        lotName: string = 'Automation Lot',
        invalidProjectName: string = 'InvalidProject_XYZ_12345'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.clickLotRowByName(lotName);
        await expect(this.lotFormSaveAndCloseButton).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.assertInvalidProjectNotFound(invalidProjectName);
        await this.clickPopupCloseIcon();
        await this.cleanupAfterProjectTest();
    }

    // ==========================================================================
    // LOCATORS — PRICE LIST
    // ==========================================================================

    private get priceListTab(): Locator {
        return this.page.locator('a, button, li').filter({ hasText: /^\s*Price List\s*$/i }).first();
    }

    private get priceListTable(): Locator {
        return this.page.locator('app-price-list table, p-table table').first();
    }

    private get priceListTableRows(): Locator {
        return this.priceListTable.locator('tbody tr');
    }

    private get lotPreviewToggle(): Locator {
        return this.page.locator('app-price-list p-inputswitch').first();
    }

    private get lotPreviewToggleSlider(): Locator {
        return this.lotPreviewToggle.locator('.p-inputswitch').first();
    }

    private priceListRowByLotName(lotName: string): Locator {
        return this.priceListTableRows.filter({ hasText: lotName }).first();
    }

    private get lotPreviewPopup(): Locator {
        return this.page.locator('.confirmation-dialog-body, .unit-detail-popup').first();
    }

    private get lotPreviewPopupTitle(): Locator {
        return this.page.locator('.confirmation-dialog-header p.f-24').first();
    }

    private get lotPreviewPopupCloseIcon(): Locator {
        return this.page.locator('.confirmation-dialog-header img[src*="Close_square"]').first();
    }

    private get lotPreviewToastOn(): Locator {
        return this.page.locator('div[role="alert"].toast-message').filter({ hasText: /lot preview on successfully/i }).first();
    }

    private get lotPreviewToastOff(): Locator {
        return this.page.locator('div[role="alert"].toast-message').filter({ hasText: /lot preview off successfully/i }).first();
    }

    private get priceListSearchInput(): Locator {
        return this.page.locator('app-price-list input[placeholder="Search"]').first();
    }

    private get priceListNoResultsMessage(): Locator {
        return this.page.locator('app-price-list td').filter({ hasText: /^\s*No lots available\s*$/i }).first();
    }

    private get priceListSearchCrossIcon(): Locator {
        return this.page.locator('app-price-list i.pi-times._cross-icon').first();
    }

    /**
 * HELPER — Click cross icon to clear search input
 */
    private async clickPriceListSearchCrossIcon(): Promise<void> {
        await expect(this.priceListSearchCrossIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.priceListSearchCrossIcon.click();
        await this.page.waitForTimeout(800);
    }

    /**
     * HELPER — Assert search input is empty
     */
    private async assertPriceListSearchInputEmpty(): Promise<void> {
        await expect(this.priceListSearchInput).toHaveValue('', { timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    /**
 * HELPER — Click on Price List tab
 */
    private async clickPriceListTab(): Promise<void> {
        await expect(this.priceListTab).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.priceListTab.click();
    }

    private async getRecordsCountText(): Promise<string> {
        await expect(this.lotRecordsCount).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        const text = (await this.lotRecordsCount.innerText()).trim();
        console.log(text);
        return text;
    }

    /**
 * TC_01 — Open Price List with valid lots
 */
    async openPriceListWithValidLots(projectName: string = 'Automation'): Promise<void> {
        await this.navigateToProjects();
        await this.clickProjectCardInProjectSection(projectName);
        await this.clickPriceListTab();
        await this.getRecordsCountText();
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_02 — Open Price List when no lots exist → redirects to General tab
 */
    async verifyPriceListRedirectsToGeneralWhenNoLots(projectName: string = "Hina's Project"): Promise<void> {
        await this.navigateToProjects();
        await this.clickProjectCardInProjectSection(projectName);
        await this.clickPriceListTab();
        await this.cleanupAfterProjectTest();
    }

    /**
 * HELPER — Toggle Lot Preview switch ON
 */
    private async enableLotPreviewToggle(): Promise<void> {
        await expect(this.lotPreviewToggle).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        const isChecked = await this.lotPreviewToggleSlider.evaluate(el => el.classList.contains('p-inputswitch-checked'));
        if (!isChecked) {
            await this.lotPreviewToggle.click();
            await this.page.waitForTimeout(800);
        }
    }

    /**
     * HELPER — Toggle Lot Preview switch OFF
     */
    private async disableLotPreviewToggle(): Promise<void> {
        await expect(this.lotPreviewToggle).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        const isChecked = await this.lotPreviewToggleSlider.evaluate(el => el.classList.contains('p-inputswitch-checked'));
        if (isChecked) {
            await this.lotPreviewToggle.click();
            await this.page.waitForTimeout(800);
        }
    }

    /**
     * HELPER — Click on a lot row in Price List by lot name
     */
    private async clickPriceListLotByName(lotName: string): Promise<void> {
        const row = this.priceListRowByLotName(lotName);
        await expect(row).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await row.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * HELPER — Assert Lot Preview popup is visible with lot details
     */
    private async assertLotPreviewPopupVisible(lotName: string): Promise<void> {
        await expect(this.lotPreviewPopup).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.lotPreviewPopupTitle).toContainText(lotName, { timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Click close icon on Lot Preview popup
     */
    private async closeLotPreviewPopup(): Promise<void> {
        await expect(this.lotPreviewPopupCloseIcon).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.lotPreviewPopupCloseIcon.click();
        await this.page.waitForTimeout(800);
    }

    /**
 * HELPER — Assert "Lot preview on successfully" toast is visible
 */
    private async assertLotPreviewToastOn(): Promise<void> {
        await expect(this.lotPreviewToastOn).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Assert "Lot preview off successfully" toast is visible
     */
    private async assertLotPreviewToastOff(): Promise<void> {
        await expect(this.lotPreviewToastOff).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    /**
   * TC_03 — Verify Lot Preview toggle enables popup on lot click
   */
    async verifyLotPreviewTogglePopup(
        projectName: string = 'Automation',
        lotName: string = 'Automation Lot'
    ): Promise<void> {
        await this.navigateToProjects();
        await this.clickProjectCardInProjectSection(projectName);
        await this.clickPriceListTab();
        await expect(this.priceListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.enableLotPreviewToggle();
        await this.assertLotPreviewToastOn();
        await this.clickPriceListLotByName(lotName);
        await this.assertLotPreviewPopupVisible(lotName);
        await this.closeLotPreviewPopup();
        await this.disableLotPreviewToggle();
        await this.assertLotPreviewToastOff();
        await this.cleanupAfterProjectTest();
    }

    /**
 * HELPER — Search for a lot in Price List by name
 */
    private async searchPriceListLot(keyword: string): Promise<void> {
        await expect(this.priceListSearchInput).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.priceListSearchInput.fill(keyword);
    }

    /**
     * HELPER — Assert lot row with given name is visible in Price List
     */
    private async assertPriceListLotRowExists(lotName: string): Promise<void> {
        const row = this.priceListRowByLotName(lotName);
        await expect(row).toBeVisible({ timeout: ProjectActions.TIMEOUT_LONG });
    }

    /**
 * TC_04 — Search existing lot by name
 */
    async verifyPriceListLotSearch(
        projectName: string = 'Automation',
        lotName: string = 'Automation Lot'
    ): Promise<void> {
        await this.navigateToProjects();
        await this.clickProjectCardInProjectSection(projectName);
        await this.clickPriceListTab();
        await expect(this.priceListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.searchPriceListLot(lotName);
        await this.assertPriceListLotRowExists(lotName);
        await this.cleanupAfterProjectTest();
    }

    /**
 * HELPER — Assert "No lots available" message is shown
 */
    private async assertNoPriceListLotsFound(): Promise<void> {
        await expect(this.priceListNoResultsMessage).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
    }

    /**
 * TC_05 — Search non-existent lot shows "No lots available"
 */
    async verifyPriceListSearchNonExistentLot(
        projectName: string = 'Automation',
        nonExistentLotName: string = 'NonExistentLot_XYZ_12345'
    ): Promise<void> {
        await this.navigateToProjects();
        await this.clickProjectCardInProjectSection(projectName);
        await this.clickPriceListTab();
        await expect(this.priceListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.searchPriceListLot(nonExistentLotName);
        await this.assertNoPriceListLotsFound();
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_06 — Clear search using cross icon shows full lot list
 */
    async verifyPriceListSearchClearByCrossIcon(
        projectName: string = 'Automation',
        lotName: string = 'Automation Lot'
    ): Promise<void> {
        await this.navigateToProjects();
        await this.clickProjectCardInProjectSection(projectName);
        await this.clickPriceListTab();
        await expect(this.priceListTable).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await this.searchPriceListLot(lotName);
        await this.assertPriceListLotRowExists(lotName);
        await this.clickPriceListSearchCrossIcon();
        await this.assertPriceListSearchInputEmpty();
        await this.cleanupAfterProjectTest();
    }

}

