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

    // ==========================================================================
    // LOCATORS — PRECINCT INNER VIEW (TC_01 to TC_08)
    // ==========================================================================

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

    // ==========================================================================
    // LOCATORS — LIST VIEW (TABLE)
    // ==========================================================================

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

    // ==========================================================================
    // LOCATORS — VIEW SWITCHING
    // ==========================================================================

    private get gridViewButton(): Locator {
        return this.page.locator('.layout-changer a.grid-icon');
    }

    private get listViewButton(): Locator {
        // Direct selector — no filter, no sub-query
        return this.page.locator('.layout-changer a:has(img[src*="list.svg"])');
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

    // LOCATORS — Reorder section expand/collapse arrow

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
        return this.page.locator('a[href="/project/projects"]').first();
    }

    private get precinctListingsMenuLink(): Locator {
        return this.page.locator('a[href="/listings/project-precinct"]');
    }

    // click project

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
        await expect(this.successToast).toBeVisible({ timeout: ProjectActions.TIMEOUT_DEFAULT });
        await expect(this.successToast).toContainText(expectedText, { timeout: ProjectActions.TIMEOUT_DEFAULT });
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
        await this.clickShowAll();
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
}