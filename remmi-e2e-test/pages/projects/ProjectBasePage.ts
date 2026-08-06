import { expect, Page, Locator } from '@playwright/test';
import { faker } from '@faker-js/faker';
import * as path from 'path';
import { BasePage } from '../common/BasePage';

export abstract class ProjectBasePage extends BasePage {
    // ========== CONSTANTS ==========
    // TIMEOUT_SHORT/DEFAULT/MEDIUM/LONG are inherited from BasePage (5s/10s/20s/30s)
    protected static readonly TIMEOUT_EXTRA_LONG = 40_000;
    protected static readonly UI_SETTLE_DELAY = 500;
    protected static readonly IMAGES_DIR = path.resolve(__dirname, '../../tests/projects/Images');
    protected static readonly DEFAULT_TEST_IMAGE = 'propertyImage.jpg';
    protected static readonly PROJECTS_URL = '/project/projects';
    protected static readonly PRECINCT_LISTINGS_URL = '/listings/project-precinct';
    protected static readonly PROJECT_PRICELIST_URL = '/projects/edit_/69e9c1d7be0c8310f1dceee0/price-list';
    protected static readonly PROJECT_SETUP_URL = '/projects/edit_/69e9c1d7be0c8310f1dceee0/project-setup';


    constructor(page: Page) {
        super(page);
    }

    protected get firstPrecinctOnProjectsPage(): Locator {
        return this.page.locator('.sgv-product.ng-star-inserted').first();
    }

    protected get precinctNameUnderActive(): Locator {
        return this.page.locator('#project .product-content h3').first();
    }

    protected get projectTabInPrecinct(): Locator {
        return this.page.locator('a#pills-project-tab, a#pills-project').first();
    }

    protected get lotTabInPrecinct(): Locator {
        return this.page.locator('a#pills-lot-tab, a#pills-lot').first();
    }

    protected get eoiTabInPrecinct(): Locator {
        return this.page.locator('a#pills-EOI-tab, a#pills-EOI').first();
    }

    protected get lotListView(): Locator {
        return this.page.locator('#lot, #pills-lot, app-lot-list').first();
    }

    protected get projectCardName(): Locator {
        return this.page.locator('.product-content h3').first();
    }

    protected get projectCardArrowIcon(): Locator {
        return this.page.locator(
            'img[src*="arrow"], img[src*="chevron"], i.pi-chevron-down, i.pi-angle-down'
        ).last();
    }

    protected projectBreadcrumbName(projectName: string): Locator {
        return this.page.locator('p.ml-2.cursor-pointer', { hasText: projectName }).last();
    }

    protected get projectsBreadcrumbLink(): Locator {
        return this.page.locator('p.cursor-pointer[routerlink="/project/projects"]');
    }

    protected projectCardCollapseIcon(): Locator {
        return this.page.locator('i.pi-chevron-up').first();
    }

    protected projectCardPriceContent(): Locator {
        return this.page.locator('.product-meta-tool a', { hasText: /priced from|price/i }).first()
    }

    // Click on project image in precinct (product-thumbnail context)
    protected get projectImageInPrecinct(): Locator {
        return this.page.locator('.product-thumbnail img').first();
    }

    async clickProjectImageInPrecinct(): Promise<void> {
        await this.projectImageInPrecinct.click();
    }

    protected get searchInput(): Locator {
        return this.page.getByPlaceholder('Search').last();
    }

    protected get searchInputByPlaceholder(): Locator {
        return this.page.locator('input[placeholder="Search"]').last();
    }

    protected get resetIcon(): Locator {
        return this.page.locator('i').nth(3);
    }

    protected get resetButton(): Locator {
        return this.page.locator('button', { hasText: /reset/i }).last();
    }

    protected tabByLabel(label: string): Locator {
        return this.page.getByText(label, { exact: true });
    }

    protected get firstGridProduct(): Locator {
        return this.page.locator('.projects-row.view-grid .sgv-product').first();
    }

    protected projectCardByName(name: string): Locator {
        return this.page
            .locator('.sgv-product .product-content h3', {
                hasText: new RegExp(`^${name}$`, 'i'),
            })
            .first();
    }

    protected projectCardContainingText(text: string): Locator {
        return this.page
            .locator('.sgv-product .product-content h3', { hasText: new RegExp(text, 'i') })
            .first();
    }

    protected allProjectCardsByName(name: string): Locator {
        return this.page.locator('.sgv-product .product-content h3', {
            hasText: new RegExp(name, 'i'),
        });
    }

    protected thumbnailForCard(card: Locator): Locator {
        return card.locator('..').locator('..').first().locator('.product-thumbnail').first();
    }

    protected precinctContainerByName(name: string): Locator {
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

    protected get precinctCardThumbnailWithImage(): Locator {
        return this.page.locator('.product-thumbnail.cp.ng-star-inserted[style*="projectimages"]');
    }

    protected get firstTableRow(): Locator {
        // Scoped to datatable specifically
        return this.page.locator('tbody.p-datatable-tbody tr').first();
    }

    protected get allTableRows(): Locator {
        return this.page.locator('tbody tr');
    }

    protected get firstRowCheckbox(): Locator {
        return this.page.locator('tbody tr p-tablecheckbox .p-checkbox-box').first();
    }

    protected get selectAllCheckbox(): Locator {
        return this.page.locator('thead div.p-checkbox.p-component .p-checkbox-box');
    }

    protected get firstRowDeleteIcon(): Locator {
        return this.page.locator('tbody tr img[src*="delete_icon.svg"]').first();
    }

    protected tableRowWithText(text: string): Locator {
        return this.page.locator('tr').filter({ hasText: new RegExp(text, 'i') }).first();
    }

    protected get projectNameColumnValues(): Locator {
        return this.page.locator('tbody tr td:nth-child(3) p');
    }

    protected get recordsCountLabel(): Locator {
        return this.page.locator('p').filter({ hasText: /^\s*Records:\s*\d+/ });
    }

    protected get noProjectsAvailableMessage(): Locator {
        return this.page.getByText(/No projects available/i).first();
    }

    protected sortIconForColumn(columnName: string): Locator {
        return this.page.locator('th', { hasText: columnName }).locator('p-sorticon').first();
    }

    protected columnHeader(columnName: string): Locator {
        return this.page.locator('th', { hasText: columnName }).first();
    }

    protected columnFilterIcon(columnName: string): Locator {
        return this.page.getByRole('cell', { name: `${columnName} filter` }).locator('svg');
    }

    protected listFilterTab(label: string): Locator {
        return this.page.locator('ul.list-type li', { hasText: label }).first();
    }

    protected get gridViewButton(): Locator {
        return this.page.locator('.layout-changer a.grid-icon');
    }

    protected get listViewButton(): Locator {
        // Direct selector — no filter, no sub-query
        return this.page.locator('.layout-changer a:has(img[src*="list.svg"])');
    }

    protected get defaultViewButton(): Locator {
        return this.page.locator('._view-btn').filter({ hasText: /default view/i });
    }

    protected get activeViewButton(): Locator {
        return this.page.locator('._view-btn').first();
    }

    protected get viewPopupContent(): Locator {
        return this.page.locator('.p-overlaypanel-content');
    }

    protected get addViewIcon(): Locator {
        return this.viewPopupContent.locator('.view-options img[src*="plus-solid.svg"]');
    }

    protected get shareViewIcon(): Locator {
        return this.page.locator('.view-options img[src*="share-one.svg"]');
    }

    protected get viewNameInput(): Locator {
        return this.page
            .locator('input[placeholder*="view" i], input[placeholder*="name" i]')
            .last();
    }

    protected get viewNameInputInvalid(): Locator {
        return this.page.locator(
            'input[placeholder*="view" i], input[placeholder*="name" i].invalidField'
        );
    }

    protected get saveOrCreateButton(): Locator {
        return this.page.getByRole('button', { name: /save|create/i }).first();
    }

    protected get savedViewDropdown(): Locator {
        return this.viewPopupContent.locator('ng-select[placeholder="Select default view"]');
    }

    protected get viewDropdownArrow(): Locator {
        return this.page.locator('.view-w-100 > .ng-select-container > .ng-arrow-wrapper');
    }

    protected get defaultViewOption(): Locator {
        return this.page.getByText(/^default view$/i).first();
    }

    protected savedViewOption(viewName: string): Locator {
        return this.page
            .locator('.ng-dropdown-panel-items .ng-option')
            .filter({ hasText: new RegExp(`^\\s*${viewName}\\s*$`, 'i') });
    }

    protected get visibleColumnList(): Locator {
        return this.viewPopupContent.locator('#visibleColumnList .cdk-drag');
    }

    protected get hiddenColumnList(): Locator {
        return this.viewPopupContent.locator('#hiddenColumnList .cdk-drag');
    }

    protected columnItemByName(name: string): Locator {
        return this.visibleColumnList.filter({ hasText: new RegExp(name, 'i') });
    }

    protected get hideAllButton(): Locator {
        return this.viewPopupContent.getByText('Hide All', { exact: true });
    }

    protected get reorderExpandCollapseArrow(): Locator {
        return this.page.locator('.icon-style i.pi');
    }

    protected get reorderCollapsedArrow(): Locator {
        return this.page.locator('.icon-style i.pi-angle-down');
    }

    protected get showAllButton(): Locator {
        return this.viewPopupContent.getByText('Show All', { exact: true });
    }

    protected get columnSearchInput(): Locator {
        return this.viewPopupContent.locator('input[placeholder="Search"]').first();
    }

    protected get shareButton(): Locator {
        return this.viewPopupContent.locator('button._outline-btn', { hasText: 'Share' });
    }

    protected get usersShareDropdown(): Locator {
        return this.viewPopupContent.locator('re-multiselect.w-100.mr-2 .box');
    }

    protected get teamsShareDropdown(): Locator {
        return this.viewPopupContent.locator('re-multiselect.custom-select-share .box');
    }

    protected get usersShareDropdownArrow(): Locator {
        return this.page.locator('re-multiselect.w-100.mr-2 i.fa-sort-up');
    }

    protected get teamsShareDropdownArrow(): Locator {
        return this.page.locator('re-multiselect.custom-select-share i.fas.fa-sort-up');
    }

    protected get lastDropBox(): Locator {
        return this.page.locator('.drop_box').last();
    }

    protected get projectManagerDropdown(): Locator {
        return this.page.locator('re-multiselect[placeholder="Project Manager"] .box');
    }

    protected get projectManagerList(): Locator {
        return this.page.locator('re-multiselect[placeholder="Project Manager"] ul');
    }

    protected get projectManagerSearchInput(): Locator {
        return this.page
            .locator(
                're-multiselect[placeholder="Project Manager"] input[type="text"], ' +
                're-multiselect[placeholder="Project Manager"] input[type="search"]'
            )
            .last();
    }

    protected projectManagerTag(name: string): Locator {
        return this.page
            .locator('re-multiselect[placeholder="Project Manager"] .tags')
            .filter({ hasText: name });
    }

    protected listOptionByText(text: string): Locator {
        return this.page.locator('li').filter({ hasText: text }).first();
    }

    protected get selectAllManagersLabel(): Locator {
        return this.page.locator('label.select_all[data="Select All"]');
    }

    protected get selectAllToggle(): Locator {
        return this.page.locator('label.select_all');
    }

    protected get addNewProjectButton(): Locator {
        return this.page.locator('button._addNew i.pi.pi-plus').first();
    }

    protected get projectDialog(): Locator {
        return this.page.locator('.p-dialog-content').filter({
            has: this.page.locator('input[formcontrolname="Project_Name"]'),
        });
    }

    protected get projectDialogContent(): Locator {
        return this.page.locator('.p-dialog-content');
    }

    protected get projectNameField(): Locator {
        return this.projectDialog.locator('input[formcontrolname="Project_Name"]');
    }

    protected get projectStatusField(): Locator {
        return this.projectDialog.locator('ng-select[formcontrolname="Project_Status"]');
    }

    protected get projectStatusDropdownPanel(): Locator {
        return this.projectStatusField.locator('ng-dropdown-panel');
    }

    protected projectStatusOptionByText(text: string): Locator {
        return this.projectStatusDropdownPanel.locator('.ng-option').filter({ hasText: new RegExp(`^${text}$`) }).first();
    }

    protected get projectDialogSaveButton(): Locator {
        return this.page.getByRole('button', { name: /save/i });
    }

    protected get projectDialogCancelButton(): Locator {
        return this.page.getByRole('button', { name: /cancel/i });
    }

    protected get projectNameValidationError(): Locator {
        return this.projectDialog.locator(
            'input[formcontrolname="Project_Name"] ~ .invalid-feedback, ' +
            'input[formcontrolname="Project_Name"] ~ .text-danger, ' +
            'input[formcontrolname="Project_Name"].ng-invalid'
        );
    }

    protected get projectDialogCloseIcon(): Locator {
        return this.page.locator("//*[name()='path' and contains(@d,'M8.01186 7')]");
    }

    protected get duplicateButton(): Locator {
        return this.page.locator('button', { hasText: /duplicate/i });
    }

    protected get deleteButtonFirst(): Locator {
        return this.page.getByRole('button', { name: /delete/i }).first();
    }

    protected get deleteButtonLast(): Locator {
        return this.page.getByRole('button', { name: /delete/i }).last();
    }

    protected get confirmDeleteButton(): Locator {
        return this.page.getByRole('button', { name: /yes|confirm|delete/i }).first();
    }

    protected get cancelDeleteButton(): Locator {
        return this.page.getByRole('button', { name: /cancel|no/i }).first();
    }

    protected get confirmAnyButton(): Locator {
        return this.page.getByRole('button', { name: /confirm|yes|delete|ok/i }).first();
    }

    protected toastByText(pattern: RegExp): Locator {
        return this.page.getByText(pattern).first();
    }

    protected get duplicateSuccessToast(): Locator {
        return this.page.locator('.toast-message', { hasText: /project duplicated successfully/i });
    }

    protected get deleteSuccessToast(): Locator {
        return this.page.getByText(/project deleted successfully|project.*deleted/i).first();
    }

    protected get projectAddedToast(): Locator {
        return this.page.getByText('Project added successfully');
    }

    protected get viewCreatedToast(): Locator {
        return this.page.getByText(/view created|saved successfully|created successfully/i);
    }

    protected get viewDeletedToast(): Locator {
        return this.page.getByText(/view deleted|deleted successfully|removed successfully/i);
    }

    protected get genericToast(): Locator {
        return this.page.locator('.toast-message');
    }

    protected get precinctAddSuccessToast(): Locator {
        return this.page.locator('.toast-message[aria-label="Add successfully"]', {
            hasText: /Add successfully/i,
        });
    }

    protected get projectsMenuLink(): Locator {
        return this.page.locator('a[href="/project/projects"]').first();
    }

    protected get projectsBreadcrumb(): Locator {
        return this.page.locator('p[routerlink="/project/projects"]', { hasText: /^\s*Projects\s*$/i });
    }

    protected get precinctListingsMenuLink(): Locator {
        return this.page.locator('a[href="/listings/project-precinct"]');
    }

    protected get precinctSubTab(): Locator {
        return this.page
            .locator('.secondary-tabs a[role="tab"]')
            .filter({ hasText: /^\s*Precinct\s*$/i });
    }

    protected get precinctAllocationSubTab(): Locator {
        return this.page
            .locator('.secondary-tabs a[role="tab"]')
            .filter({ hasText: /precinct allocation/i });
    }

    protected get precinctAllocationTabById(): Locator {
        return this.page.locator('a#pills-precinct_allow-tab', {
            hasText: /precinct allocation/i,
        });
    }

    protected get precinctAllocationTabQuick(): Locator {
        return this.page.locator('#pills-precinct_allow-tab');
    }

    protected get precinctTab(): Locator {
        return this.page.locator('#pills-precinct-tab');
    }

    protected get precinctPanel(): Locator {
        return this.page.locator('#precinct');
    }

    protected get selectProjectDropdown(): Locator {
        return this.precinctPanel.locator('ng-select[placeholder="Select Project"]');
    }

    protected get createNewPrecinctButton(): Locator {
        return this.page.locator('#precinct button', { hasText: /create new/i });
    }

    protected precinctCardByName(name: string): Locator {
        return this.page.locator('#precinct .sgv-product', { hasText: name });
    }

    protected innerTabById(tabName: string): Locator {
        return this.page.locator(`a#pills-${tabName}`).first();
    }

    protected get addPrecinctDialog(): Locator {
        return this.page.locator('.p-dialog[role="dialog"]');
    }

    protected get precinctDialogTitle(): Locator {
        return this.addPrecinctDialog.locator('.p-dialog-title');
    }
    protected get precinctNameInput(): Locator {
        return this.addPrecinctDialog.locator('input[placeholder="Precinct Name"]');
    }

    protected get precinctUploadButton(): Locator {
        return this.addPrecinctDialog.locator('button', { hasText: /upload image/i });
    }

    protected get precinctSaveButton(): Locator {
        return this.addPrecinctDialog.locator('button', { hasText: /^save$/i });
    }

    protected get precinctCancelButton(): Locator {
        return this.addPrecinctDialog.locator('button', { hasText: /^cancel$/i });
    }

    protected get precinctFileInput(): Locator {
        return this.addPrecinctDialog.locator('input[type="file"]');
    }

    protected get precinctUploadedImage(): Locator {
        return this.addPrecinctDialog.locator('img.logo-img');
    }

    protected get precinctRemoveImageIcon(): Locator {
        return this.addPrecinctDialog.locator('i.pi-times.remove-icon');
    }

    protected get precinctNoImagePlaceholder(): Locator {
        return this.addPrecinctDialog.locator('img.no-images');
    }

    // ==========================================================================
    // LOCATORS — PIN / UNPIN
    // ==========================================================================

    protected get pinToDashboardOption(): Locator {
        return this.page.getByText('Pin to Dashboard', { exact: true });
    }

    protected get unpinFromDashboardOption(): Locator {
        return this.page.getByText('Unpin from Dashboard', { exact: true });
    }

    protected get pinnedIcon(): Locator {
        return this.page.locator('img[src="assets/img/dashboadIcon/pin-fill.svg"]');
    }

    // ==========================================================================
    // LOCATORS — PRECINCT ALLOCATION CHECKBOXES & DROPDOWNS
    // ==========================================================================

    protected get allocationCheckboxes(): Locator {
        return this.page.locator('p-checkbox .p-checkbox-box');
    }

    protected get lastNgSelectContainer(): Locator {
        return this.page.locator('.ng-select-container').last();
    }

    protected get firstNgDropdownOption(): Locator {
        return this.page.locator('.ng-dropdown-panel .ng-option-label').first();
    }

    protected get saveButtonByText(): Locator {
        return this.page.locator('button:has-text("Save")');
    }
    // ==========================================================================
    // LOCATORS — PRECINCT CARD ICONS (EDIT / DELETE)
    // ==========================================================================

    /**
     * Edit (pencil) icon on the first precinct card in the grid.
     */
    protected get firstPrecinctEditIcon(): Locator {
        return this.page.locator('#precinct .sgv-product').first().locator('img[alt="edit"]');
    }

    /**
     * Delete icon on the first precinct card in the grid.
     */
    protected get firstPrecinctDeleteIcon(): Locator {
        return this.page.locator('#precinct .sgv-product').first().locator('img[alt="delete"]');
    }

    /**
     * Name of the first precinct card (reads the <h3>).
     */
    protected get firstPrecinctCardName(): Locator {
        return this.page.locator('#precinct .sgv-product').first().locator('h3');
    }

    /**
     * Toast shown after successfully deleting a precinct.
     */
    protected get precinctDeleteSuccessToast(): Locator {
        return this.page.locator('.toast-message', {
            hasText: /delete(d)? successfully|removed successfully/i,
        });
    }

    // ==========================================================================
    // LOCATORS — PRECINCT TAB PROJECT FILTER DROPDOWN
    // ==========================================================================

    protected get selectProjectDropdownContainer(): Locator {
        return this.selectProjectDropdown.locator('.ng-select-container');
    }

    protected get selectProjectPlaceholder(): Locator {
        return this.selectProjectDropdown.locator('.ng-placeholder');
    }

    protected get selectedProjectValueLabel(): Locator {
        return this.selectProjectDropdown.locator('.ng-value-label');
    }

    protected get selectProjectClearIcon(): Locator {
        return this.selectProjectDropdown.locator('.ng-clear-wrapper');
    }

    protected get selectProjectDropdownPanel(): Locator {
        return this.page.locator('.ng-dropdown-panel');
    }

    protected get firstSelectProjectOption(): Locator {
        return this.page.locator('.ng-dropdown-panel .ng-option').first();
    }

    protected get allPrecinctCards(): Locator {
        return this.page.locator('#precinct .sgv-product');
    }

    // ==========================================================================
    // LOCATORS — PRECINCT ALLOCATION TAB LAYOUT
    // ==========================================================================

    protected get precinctAllocationPanel(): Locator {
        return this.page.locator('#precinct_allow');
    }

    protected get selectPrecinctDropdown(): Locator {
        return this.precinctAllocationPanel.locator('ng-select[placeholder="Select Precinct"]');
    }

    protected get allocationSaveButton(): Locator {
        return this.precinctAllocationPanel.locator('button._outline-btn', { hasText: /^save$/i });
    }

    protected get allocationSearchField(): Locator {
        return this.precinctAllocationPanel.locator('input#keywordInput');
    }

    protected get allocationProjectTable(): Locator {
        return this.precinctAllocationPanel.locator('p-table');
    }

    protected get allocationProjectRows(): Locator {
        return this.precinctAllocationPanel.locator('tbody tr');
    }

    protected get allocationProjectCheckboxes(): Locator {
        return this.precinctAllocationPanel.locator('tbody p-checkbox .p-checkbox-box');
    }

    protected get allocationSelectedListPanel(): Locator {
        return this.precinctAllocationPanel.locator('p-orderlist');
    }

    protected get allocationSearchClearIcon(): Locator {
        return this.precinctAllocationPanel.locator('i.pi-times._cross-icon');
    }

    // ==========================================================================
    // LOT LIST PAGE — LOCATORS
    // =========================================================================

    // Search bar
    protected get lotSearchInput(): Locator {
        return this.page.locator('input#keywordInput[name="task-search"]').last();
    }

    protected get lotSearchIcon(): Locator {
        return this.page.locator('i.pi-search._search-icon');
    }

    // Filter dropdowns (re-multiselect)
    protected get precinctFilter(): Locator {
        return this.page.locator('re-multiselect[placeholder="Precinct"]');
    }

    protected get projectFilter(): Locator {
        return this.page.locator('re-multiselect[placeholder="Project"]');
    }

    protected get bedFilter(): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]');
    }

    protected get statusFilter(): Locator {
        return this.page.locator('re-multiselect[placeholder="Status"]');
    }

    protected get internalAreaFilter(): Locator {
        return this.page.locator('.land-size', { hasText: 'Internal Area' });
    }

    // Table - Header
    protected get lotTable(): Locator {
        return this.page.locator('p-table#apartmentscolumns table');
    }

    protected get lotTableHeader(): Locator {
        return this.page.locator('table thead tr');
    }

    protected lotColumnHeader(columnName: string): Locator {
        return this.page.locator('table thead th p', { hasText: columnName });
    }

    protected lotColumnSortIcon(columnName: string): Locator {
        return this.page.locator('table thead th', { hasText: columnName }).locator('i.custom-sort');
    }

    // Header checkbox (select all)
    protected get selectAllLotCheckbox(): Locator {
        return this.page.locator('p-tableheadercheckbox .p-checkbox-box');
    }

    // Table - Body rows
    protected get lotTableRows(): Locator {
        return this.page.locator('table tbody tr');
    }

    // LOCATOR — Popup close icon
    protected get popupCloseIcon(): Locator {
        return this.page.locator('.p-dialog-header-close, .close-icon, i.pi-times').first();
    }

    protected get lotFormProjectValue(): Locator {
        return this.page.locator('ng-select[formcontrolname="projectid"] .ng-value-label');
    }

    // LOCATOR — Right pin icon
    protected get lotFormPinIcon(): Locator {
        return this.page.locator('i.fa-thumbtack');
    }

    protected get lotFormPinIconPinned(): Locator {
        return this.page.locator('i.fa-thumbtack.pinned');
    }

    // LOCATORS — Project dropdown inside lot form

    protected get lotFormProjectSelect(): Locator {
        return this.page.locator('ng-select[formcontrolname="projectid"]');
    }

    protected get lotFormProjectArrow(): Locator {
        return this.lotFormProjectSelect.locator('.ng-arrow-wrapper');
    }

    protected get lotFormProjectDropdownPanel(): Locator {
        return this.lotFormProjectSelect.locator('ng-dropdown-panel');
    }

    protected get lotFormProjectSearchInput(): Locator {
        return this.lotFormProjectSelect.locator('input[type="text"]');
    }

    protected get lotFormProjectOptions(): Locator {
        return this.lotFormProjectSelect.locator('ng-dropdown-panel .ng-option');
    }

    protected projectOptionInForm(name: string): Locator {
        return this.lotFormProjectSelect.locator('ng-dropdown-panel .ng-option', { hasText: name });
    }


    // LOCATOR — Pin delete success toast
    protected get pinDeleteSuccessToast(): Locator {
        return this.page.locator('div[role="alert"].toast-message', { hasText: 'Pin deleted successfully' });
    }

    // LOCATOR — Pin success toast
    protected get pinSuccessToast(): Locator {
        return this.page.locator('div[role="alert"].toast-message', { hasText: 'Pin created successfully' });
    }

    protected get lotFormHistoryTab(): Locator {
        return this.page.locator('a#pills-history-tab');
    }

    // LOCATORS — History Old Value & New Value columns

    protected historyRowOldValue(row: Locator): Locator {
        return row.locator('td').nth(4);
    }

    protected historyRowNewValue(row: Locator): Locator {
        return row.locator('td').nth(5);
    }

    // LOCATORS — History tab

    protected get historyTabContent(): Locator {
        return this.page.locator('app-remmi-history');
    }

    protected get historyTableRows(): Locator {
        return this.historyTabContent.locator('p-table tbody tr');
    }

    protected get historyRecordsCount(): Locator {
        return this.historyTabContent.locator('p', { hasText: /Records:/ });
    }

    // LOCATOR — History search input
    protected get historySearchInput(): Locator {
        return this.historyTabContent.locator('input[name="task-search"]');
    }

    // LOCATOR — Changed Date column cell (1st column)
    protected historyRowChangedDate(row: Locator): Locator {
        return row.locator('td').nth(0);
    }

    // LOCATOR — Changed By column cell (2nd column)
    protected historyRowChangedBy(row: Locator): Locator {
        return row.locator('td').nth(1);
    }

    // LOCATOR — Event column cell (3rd column)
    protected historyRowEvent(row: Locator): Locator {
        return row.locator('td').nth(2);
    }

    // LOCATOR — Changed Field column cell (4th column)
    protected historyRowChangedField(row: Locator): Locator {
        return row.locator('td').nth(3);
    }

    // LOCATORS — Lot form tabs

    protected get lotFormApartmentDetailsTab(): Locator {
        return this.page.locator('a#pills-lot-tab');
    }

    protected get firstLotRow(): Locator {
        return this.lotTableRows.first();
    }

    // Row by lot number / project name
    protected lotRowByLotNumber(lotNumber: string): Locator {
        return this.page.locator('table tbody tr', { hasText: lotNumber });
    }

    protected lotRowByProjectName(projectName: string): Locator {
        return this.page.locator('table tbody tr', { hasText: projectName });
    }

    // Row checkbox
    protected rowCheckbox(row: Locator): Locator {
        return row.locator('p-tablecheckbox .p-checkbox-box');
    }

    // Row cell values (by column index — 0-based, includes checkbox column)
    protected rowProjectCell(row: Locator): Locator {
        return row.locator('td').nth(1).locator('p');
    }

    protected rowLotCell(row: Locator): Locator {
        return row.locator('td').nth(2).locator('p');
    }

    protected rowLotPriceCell(row: Locator): Locator {
        return row.locator('td').nth(3).locator('p');
    }

    protected rowStatusCell(row: Locator): Locator {
        return row.locator('td').nth(4).locator('p');
    }

    protected rowSalesAgencyCell(row: Locator): Locator {
        return row.locator('td').nth(5).locator('p');
    }

    protected rowSalesAgentCell(row: Locator): Locator {
        return row.locator('td').nth(6).locator('p');
    }

    protected rowBedCell(row: Locator): Locator {
        return row.locator('td').nth(7).locator('p');
    }

    protected rowBathCell(row: Locator): Locator {
        return row.locator('td').nth(8).locator('p');
    }

    protected rowCreatedAtCell(row: Locator): Locator {
        return row.locator('td').nth(9).locator('p');
    }

    // Records count
    protected get lotRecordsCount(): Locator {
        return this.page.locator('p.ng-star-inserted', { hasText: /records:/i });
    }

    // LOCATORS — PROJECT DROPDOWN IN LOT TAB

    protected get projectDropdownInLot(): Locator {
        return this.page.locator('re-multiselect[placeholder="Project"]').locator('.box');
    }

    protected get projectDropdownPanel(): Locator {
        return this.page.locator('re-multiselect[placeholder="Project"]').locator('.drop_box');
    }

    protected get projectDropdownOptions(): Locator {
        return this.page.locator('re-multiselect[placeholder="Project"]').locator('.drop_box ul li.p-element');
    }

    protected get projectDropdownSearchInput(): Locator {
        return this.page.locator('re-multiselect[placeholder="Project"]').locator('.drop_box .inpt input');
    }

    protected get projectDropdownSelectAllCheckbox(): Locator {
        return this.page.locator('re-multiselect[placeholder="Project"]').locator('.drop_box label.select_all');
    }

    // ==========================================================================
    // LOCATORS — MISC
    // ==========================================================================

    protected get backButton(): Locator {
        return this.page.locator('text=/back/i').first();
    }

    protected projectTitleBanner(name: string): Locator {
        return this.page.locator('p.f-24', { hasText: name });
    }

    protected get allSgvProductHeadings(): Locator {
        return this.page.locator('.sgv-product .product-content h3');
    }

    protected activeProjectCardFilter(escapedName: string): Locator {
        const nameRegex = new RegExp(`^\\s*${escapedName}\\s*$`, 'i');
        return this.page
            .locator('.projects-row .sgv-product .product-content h3')
            .filter({ hasText: nameRegex });
    }

    protected shareResponseMessage(): Locator {
        return this.page
            .getByText('View shared')
            .or(this.page.getByText('shared successfully'))
            .or(this.page.getByText('already shared with one or more selected users or teams'))
            .or(this.page.getByText('user or team is not selected'));
    }

    // ==========================================================================
    // NAVIGATION HELPERS
    // ==========================================================================

    protected async navigateToProjects(): Promise<void> {
        const currentUrl = this.page.url().split(/[?#]/)[0];
        if (!currentUrl.endsWith(ProjectBasePage.PROJECTS_URL)) {
            await this.page.goto(ProjectBasePage.PROJECTS_URL);
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
        if (!currentUrl.endsWith(ProjectBasePage.PRECINCT_LISTINGS_URL)) {
            await this.page.goto(ProjectBasePage.PRECINCT_LISTINGS_URL);
        }
    }

    protected async openPrecinctSetup(): Promise<void> {
        await this.gotoPrecinctListings();
        await expect(this.precinctListingsMenuLink).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.precinctListingsMenuLink.click();
    }

    protected async openAddPrecinctDialog(): Promise<void> {
        await this.openPrecinctSetup();
        await expect(this.createNewPrecinctButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.createNewPrecinctButton.click();
        await expect(this.addPrecinctDialog).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async prepareListView(): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();
    }

    // ==========================================================================
    // VIEW SWITCHING
    // ==========================================================================

    async switchToGridView(): Promise<void> {
        if (await this.firstGridProduct.isVisible().catch(() => false)) return;
        await expect(this.gridViewButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.gridViewButton.click({ force: true });
        await expect(this.firstGridProduct).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
    }
    async switchToListView(): Promise<void> {
        if (await this.firstTableRow.isVisible().catch(() => false)) return;
        await this.page.waitForSelector('.loading-overlay', { state: 'detached', timeout: 43000 }).catch(() => { });
        await expect(this.listViewButton).toBeEnabled({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.listViewButton.evaluate((el: HTMLElement) => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
        await this.listViewButton.click();
        await this.firstTableRow.waitFor({ state: 'visible', timeout: ProjectBasePage.TIMEOUT_LONG });
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
            timeout: ProjectBasePage.TIMEOUT_LONG,
        });
        await this.page.waitForFunction(
            () => {
                const rows = document.querySelectorAll('tbody tr');
                if (rows.length === 0) return false;
                return (rows[0].textContent?.trim() ?? '').length > 5;
            },
            { timeout: ProjectBasePage.TIMEOUT_LONG }
        );
        await this.firstTableRow.waitFor({ state: 'visible', timeout: ProjectBasePage.TIMEOUT_LONG });
    }

    // ==========================================================================
    // COMMON ACTION HELPERS
    // ==========================================================================

    async resetListView(): Promise<void> {
        await expect(this.resetButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.resetButton.click();
        await this.waitForFirstTableRow();
    }

    protected async clickResetIcon(): Promise<void> {
        await expect(this.resetIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.resetIcon.click();
    }

    protected async clickTabByLabel(tabLabel: string): Promise<void> {
        const tab = this.tabByLabel(tabLabel);
        await expect(tab).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await tab.click();
    }

    protected async openDefaultViewPopup(): Promise<void> {
        await this.defaultViewButton.waitFor({ state: 'visible', timeout: ProjectBasePage.TIMEOUT_MEDIUM });
        await this.defaultViewButton.click();
        await expect(this.viewPopupContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_MEDIUM });
    }

    protected async closeOverlay(): Promise<void> {
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(400);
    }

    protected async openProjectManagerDropdown(): Promise<void> {
        await this.prepareListView();
        await this.page.waitForTimeout(1500);
        await this.projectManagerDropdown.click();
        await this.projectManagerList.waitFor({ state: 'visible', timeout: 50_000 });
    }

    protected async selectManagerByName(name: string): Promise<void> {
        await this.projectManagerSearchInput.waitFor({
            state: 'visible',
            timeout: ProjectBasePage.TIMEOUT_MEDIUM,
        });
        await this.projectManagerSearchInput.fill(name);

        const option = this.listOptionByText(name);
        await option.waitFor({ state: 'visible', timeout: ProjectBasePage.TIMEOUT_MEDIUM });
        await option.click();
        await this.projectManagerSearchInput.fill('');
    }

    protected async verifyManagerTagsVisible(names: string[]): Promise<void> {
        for (const name of names) {
            await expect(this.projectManagerTag(name)).toBeVisible({
                timeout: ProjectBasePage.TIMEOUT_MEDIUM,
            });
        }
    }

    protected async selectFirstProjectFromDropdown(): Promise<void> {
        await this.lastNgSelectContainer.click();
        await this.firstNgDropdownOption.click();
    }

    protected async clickSaveAndVerifyToast(): Promise<void> {
        await this.saveButtonByText.click();
        await expect(this.genericToast).toBeVisible();
    }



    // ========== SHARED HELPERS (moved from sub-sections) ==========
    protected get lotFormLotInput(): Locator {
        return this.page.locator('input[formcontrolname="lot_name"]');
    }

    // LOCATORS — Optional input fields

    protected get lotFormBedInput(): Locator {
        return this.page.locator('input[formcontrolname="bed"]');
    }

    protected get lotFormBathInput(): Locator {
        return this.page.locator('input[formcontrolname="bath"]');
    }

    protected get lotFormAspectInput(): Locator {
        return this.page.locator('input[formcontrolname="aspect"]');
    }

    // LOCATORS — Only what TC_11 needs

    protected get lotFormStatusReasonOptions(): Locator {
        return this.lotFormStatusReasonSelect.locator('ng-dropdown-panel .ng-option');
    }

    protected get successToast(): Locator {
        return this.page.locator('div[role="alert"].toast-message');
    }

    // LOCATORS — Sort icon states (targeted to Status column reliably)

    protected async assertSuccessToast(expectedText: string = 'Update successfully'): Promise<void> {
        await expect(this.successToast.first()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.successToast.first()).toContainText(expectedText, { timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected get projectsSectionHeading(): Locator {
        return this.page.locator('p', { hasText: /^\s*Project\s*$/i }).first();
    }

    protected async clickProjectCardInProjectSection(projectName: string): Promise<void> {
        await expect(this.projectsSectionHeading).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        const projectCard = this.projectCardClickTarget(projectName);
        await expect(projectCard).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await projectCard.scrollIntoViewIfNeeded();
        await projectCard.click();
        await this.page.waitForTimeout(1500);
    }

    protected async clickProjectSetupTab(): Promise<void> {
        await expect(this.projectSetupTab).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.projectSetupTab.click();
        await this.page.waitForTimeout(1000);
    }

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

    protected get lotListTable(): Locator {
        return this.page.locator('app-unit p-table#apartmentscolumns').first();
    }

    protected get lotListTableRows(): Locator {
        return this.lotListTable.locator('tbody tr');
    }

    protected async clickLotSubTab(): Promise<void> {
        await expect(this.lotSubTab).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotSubTab.scrollIntoViewIfNeeded();
        await this.lotSubTab.click();
        await this.page.waitForURL(/\/project-setup\/unit/, { timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.lotSubTabActive).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.waitForLoadState('networkidle');
    }

    protected async openProjectLotTab(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await this.page.waitForLoadState('networkidle');
        await this.clickProjectCardInProjectSection(projectName);
        await this.assertPricelistTabActive();
        await this.clickProjectSetupTab();
        await this.clickLotSubTab();
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

    protected async clickLotFormStatusReasonDropdown(): Promise<void> {
        await expect(this.lotFormStatusReasonDropdown).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotFormStatusReasonDropdown.click();
        await this.page.waitForTimeout(800);
    }

    protected async assertStatusReasonOptionsVisible(expectedStatuses: string[]): Promise<void> {
        // Verify options panel is open
        await expect(this.lotFormStatusReasonOptions.first()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        for (const status of expectedStatuses) {
            const option = this.lotFormStatusReasonOptionByText(status);
            await expect(option).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        }
    }

    protected async clickLotFormProjectDropdown(): Promise<void> {
        await expect(this.lotFormProjectDropdown).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotFormProjectDropdown.click();
        await this.page.waitForTimeout(800);
    }

    protected async assertLotFormTabsVisible(): Promise<void> {
        await expect(this.lotFormApartmentDetailsTab).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.lotFormHistoryTab).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async clickLotRowByName(lotName: string): Promise<void> {
        const targetLotRow = this.lotListTableRows.filter({ hasText: lotName }).first();
        await expect(targetLotRow).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await targetLotRow.click();
        await this.page.waitForTimeout(1500);
    }

    protected async assertLotFormTabTitle(lotName: string): Promise<void> {
        await expect(this.lotFormTabTitle).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.lotFormTabTitle).toContainText(lotName, {
            timeout: ProjectBasePage.TIMEOUT_DEFAULT
        });
    }

    protected async clickLotFormSaveAndClose(): Promise<void> {
        await expect(this.lotFormSaveAndCloseButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotFormSaveAndCloseButton.click();
        await this.page.waitForTimeout(1000);
    }

    protected async clickLotFormSave(): Promise<void> {
        await expect(this.lotFormSaveButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotFormSaveButton.click();
        await this.page.waitForTimeout(1000);
    }

    protected async clickPopupCloseIcon(): Promise<void> {
        await expect(this.popupCloseIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.popupCloseIcon.click();
        await this.page.waitForTimeout(1000);
    }

    protected async assertLotFormClosed(): Promise<void> {
        await expect(this.lotFormSaveAndCloseButton).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async assertProjectNameBelowTab(projectName: string): Promise<void> {
        await expect(this.lotFormNameHandle).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.lotFormNameHandleText).toContainText(projectName, {
            timeout: ProjectBasePage.TIMEOUT_DEFAULT
        });
    }

    protected async assertProjectDropdownAutoFilled(projectName: string): Promise<void> {
        await expect(this.lotFormProjectDropdownSelectedValue).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.lotFormProjectDropdownSelectedValue).toContainText(projectName, {
            timeout: ProjectBasePage.TIMEOUT_DEFAULT
        });
    }

    // ==========================================================================
    // LOCATORS — MISSING GETTERS (moved up from ProjectPage)
    // ==========================================================================

    protected get lotFormStatusReasonSelect(): Locator {
        return this.page.locator('ng-select[formcontrolname="status_reason"]');
    }

    protected get lotSubTab(): Locator {
        return this.page.locator('app-project-setup a[href*="/project-setup/unit"]').first();
    }

    protected get lotSubTabActive(): Locator {
        return this.page.locator('app-project-setup a[href*="/project-setup/unit"].active').first();
    }

    protected get pricelistContent(): Locator {
        return this.page.locator('app-price-list');
    }

    protected get pricelistTab(): Locator {
        return this.page.locator('a[href*="/price-list"]', { hasText: /Price List/i });
    }

    protected get pricelistTabActive(): Locator {
        return this.page.locator('a.active[href*="/price-list"]');
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

    protected get projectSetupTab(): Locator {
        return this.page.locator('a[href*="/project-setup"]', { hasText: /Project Set Up/i });
    }

}