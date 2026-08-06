import { expect, Locator } from '@playwright/test';
import { faker } from '@faker-js/faker';
import * as path from 'path';
import { ProjectBasePage } from './ProjectBasePage';

export class ProjectSetupPage extends ProjectBasePage {
    async verifyPrecinctUnderInactiveTab(precinctName: string): Promise<void> {
        await this.navigateToProjects();
        await this.clickTabByLabel('Inactive');
        await this.getFirstVisiblePrecinctCard();
        for (const tab of ['project', 'lot', 'EOI']) {
            const el = this.innerTabById(tab);
            await expect(el).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
            await expect(el).toHaveText(new RegExp(tab, 'i'), { timeout: ProjectBasePage.TIMEOUT_LONG });
        }
        await this.projectsMenuLink.click();
        await expect(this.firstGridProduct).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
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
        await expect(this.projectDialog).toBeHidden({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectAddedToast.waitFor({ state: 'visible', timeout: ProjectBasePage.TIMEOUT_MEDIUM }).catch(() => { });
        await this.projectTitleBanner(projectName).waitFor({ state: 'visible', timeout: ProjectBasePage.TIMEOUT_MEDIUM });
        // Optionally: return to projects main view for clarity
        const projectsText = this.page.locator('p', { hasText: 'Projects' });
        await expect(projectsText).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await projectsText.click({ force: true });
        await this.verifyProjectCanBeSearchedByName(projectName);
        await this.clickResetIcon();
        // Second creation with the same name
        await this.openProjectPopup();
        await this.projectNameField.fill(projectName);
        await this.projectDialogSaveButton.click({ force: true });
        await expect(this.projectDialog).toBeHidden({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectAddedToast.waitFor({ state: 'visible', timeout: ProjectBasePage.TIMEOUT_MEDIUM }).catch(() => { });
        await this.projectTitleBanner(projectName).waitFor({ state: 'visible', timeout: ProjectBasePage.TIMEOUT_MEDIUM });
        await expect(projectsText).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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
        await this.clickGeneralTabSave();
        await this.assertProjectUpdatedToast();
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
        await expect(this.projectManagerDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        const managerOption = this.projectManagerDropdownPanel.locator('div.ng-option', { hasText: manager }).first();
        await expect(managerOption).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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
        await expect(this.displayAddressPopupHeading).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.displayAddressPopupSaveButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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

    protected async selectProjectStatusInDialog(statusText: string): Promise<void> {
        await expect(this.projectStatusField).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectStatusField.click();
        await expect(this.projectStatusDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });

        const option = this.projectStatusOptionByText(statusText);
        await expect(option).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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
        await expect(this.projectDialog).toBeHidden({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectAddedToast
            .waitFor({ state: 'visible', timeout: ProjectBasePage.TIMEOUT_MEDIUM })
            .catch(() => {
            });
        await this.projectTitleBanner(projectName).waitFor({
            state: 'visible',
            timeout: ProjectBasePage.TIMEOUT_MEDIUM,
        });
        const projectsText = this.page.locator('p', { hasText: 'Projects' });
        await expect(projectsText).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await projectsText.click({ force: true });
        await this.clickTabByLabel('Inactive');
        const card = this.projectCardByName(projectName);
        await expect(card).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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
        await expect(this.projectDialog).toBeHidden({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectAddedToast
            .waitFor({ state: 'visible', timeout: ProjectBasePage.TIMEOUT_MEDIUM })
            .catch(() => { });
        await this.projectTitleBanner(expectedTrimmedName).waitFor({
            state: 'visible',
            timeout: ProjectBasePage.TIMEOUT_MEDIUM,
        });
        const projectsText = this.page.locator('p', { hasText: 'Projects' });
        await expect(projectsText).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await projectsText.click({ force: true });
        await this.navigateToProjects();
        await expect(this.searchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.searchInput.fill(expectedTrimmedName);
        await this.clickResetIcon();
    }

    protected get lotSubTab(): Locator {
        return this.page.locator('app-project-setup a[href*="/project-setup/unit"]').first();
    }

    protected get lotSubTabActive(): Locator {
        return this.page.locator('app-project-setup a[href*="/project-setup/unit"].active').first();
    }

    protected get lotListTable(): Locator {
        return this.page.locator('app-unit p-table#apartmentscolumns').first();
    }

    protected get lotListRecordsCounter(): Locator {
        return this.page.locator('app-unit p', { hasText: /^Records:\s*\d+/ }).first();
    }

    protected get lotListSearchInput(): Locator {
        return this.page.locator('app-unit input#keywordInput').first();
    }

    protected get lotListTableRows(): Locator {
        return this.lotListTable.locator('tbody tr');
    }

    protected lotListRowByText(text: string): Locator {
        return this.lotListTable.locator('tbody tr').filter({ hasText: text }).first();
    }

    protected get lotListExportButton(): Locator {
        return this.page.locator('app-unit button._cancel-btn', { hasText: /^\s*Export\s*$/ }).first();
    }

    protected get lotListViewButton(): Locator {
        return this.page.locator('app-genaric-view div._view-btn').first();
    }

    protected columnRowByName(name: string): Locator {
        return this.viewPopupContent.locator('.cdk-drag.column-item').filter({ hasText: name }).first();
    }

    protected get firstVisibleColumnRow(): Locator {
        return this.visibleColumnList.first();
    }

    protected columnDownArrow(row: Locator): Locator {
        return row.locator('img[src*="down-arrow"]').first();
    }

    protected columnUpArrow(row: Locator): Locator {
        return row.locator('img[src*="up-arrow"]').first();
    }

    protected get lotListImportInput(): Locator {
        return this.page.locator('app-unit input#csv[type="file"]').first();
    }

    protected get lotListUpdateDataButton(): Locator {
        return this.page.locator('app-unit button.btn-outline', { hasText: /Update Data/i }).first();
    }

    protected get lotListConfirmUpdatesButton(): Locator {
        return this.page.locator('button._outline-btn', { hasText: /Confirm Updates/i }).first();
    }

    protected get lotListImportSuccessToast(): Locator {
        return this.page.locator('div[role="alert"].toast-message', {
            hasText: /Your file has successfully imported/i
        }).first();
    }

    protected get lotListImportInvalidFileToast(): Locator {
        return this.page.locator('div[role="alert"].toast-message', {
            hasText: /Only \.csv, \.xls, and \.xlsx files are allowed/i
        }).first();
    }

    protected get lotListAddNewButton(): Locator {
        return this.page.locator('app-unit button._addNew').first();
    }

    protected get lotCreateForm(): Locator {
        return this.page.locator('app-add-unit').first();
    }

    protected get lotCreateLotInput(): Locator {
        return this.lotCreateForm.locator('input[formcontrolname="lot_name"]').first();
    }

    protected get lotCreateStatusReasonSelect(): Locator {
        return this.lotCreateForm.locator('ng-select[formcontrolname="status_reason"]').first();
    }

    protected lotCreateStatusReasonOptionByText(text: string): Locator {
        return this.page.locator('ng-dropdown-panel .ng-option').filter({
            hasText: new RegExp(`^\\s*${text}\\s*$`, 'i')
        }).first();
    }

    protected get lotCreateBedInput(): Locator {
        return this.lotCreateForm.locator('input[formcontrolname="bed"]').first();
    }

    protected get lotCreateBathInput(): Locator {
        return this.lotCreateForm.locator('input[formcontrolname="bath"]').first();
    }

    protected get lotCreateSaveAndCloseButton(): Locator {
        return this.lotCreateForm.locator('button._primary-btn', { hasText: /Save & Close/i }).first();
    }

    protected get lotCreateCloseButton(): Locator {
        return this.lotCreateForm.locator('button._cancel-btn', { hasText: /^\s*Close\s*$/i }).first();
    }

    protected get lotListMasterCheckbox(): Locator {
        return this.lotListTable.locator('thead p-tableheadercheckbox .p-checkbox-box').first();
    }

    protected get lotCreateRequiredFieldToast(): Locator {
        return this.page.locator('div[role="alert"].toast-message', {
            hasText: /Fill out the required field/i
        }).first();
    }

    protected lotListRowCheckbox(rowIndex: number): Locator {
        return this.lotListTable.locator('tbody tr').nth(rowIndex).locator('p-tablecheckbox .p-checkbox-box').first();
    }

    /**
     * HELPER — Verify checkboxes in the lot list table are properly aligned.
     */
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

    protected get lotListDeleteButton(): Locator {
        return this.page.locator('app-unit button._cancel-btn').filter({
            has: this.page.locator('img[src*="delete_icon.svg"]')
        }).first();
    }

    protected get lotListSelectedRecordsLabel(): Locator {
        return this.page.locator('app-unit p', { hasText: /^Selected Records:\s*\d+/ }).first();
    }

    protected lotListColumnHeader(columnName: string): Locator {
        return this.lotListTable.locator('thead th').filter({
            has: this.page.locator('p', { hasText: new RegExp(`^${columnName}$`) })
        }).first();
    }

    protected lotListColumnSortIcon(columnName: string): Locator {
        return this.lotListColumnHeader(columnName).locator('p-sorticon').first();
    }

    protected get lotListFilterPopup(): Locator {
        return this.page.locator('div.p-overlaypanel').first();
    }

    protected lotListColumnFilterIcon(columnName: string): Locator {
        return this.lotListColumnHeader(columnName).locator('img[alt="filter"]').first();
    }

    /**
     * HELPER — Assert "Fill out the required field" error toast appears
     */
    protected async assertRequiredFieldToast(): Promise<void> {
        await expect(this.lotCreateRequiredFieldToast).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
    }
    /**
     * HELPER — Click the + (Add New) button to open lot create form
     */
    protected async clickAddNewLotButton(): Promise<void> {
        await expect(this.lotListAddNewButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotListAddNewButton.click();
        await expect(this.lotCreateForm).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(1000);
    }

    /**
     * HELPER — Fill Lot name input
     */
    protected async fillLotName(lotName: string): Promise<void> {
        await expect(this.lotCreateLotInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotCreateLotInput.click();
        await this.lotCreateLotInput.fill(lotName);
        await this.page.waitForTimeout(300);
    }

    /**
 * HELPER — Click the master/header checkbox to select all rows
 */
    protected async clickLotListMasterCheckbox(): Promise<void> {
        await expect(this.lotListMasterCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotListMasterCheckbox.click();
        await this.page.waitForTimeout(800);
    }

    /**
     * HELPER — Select Status Reason from dropdown
     */
    protected async selectLotStatusReason(statusReason: string): Promise<void> {
        await expect(this.lotCreateStatusReasonSelect).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotCreateStatusReasonSelect.click();
        await this.page.waitForTimeout(500);
        const statusOption = this.lotCreateStatusReasonOptionByText(statusReason);
        await expect(statusOption).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await statusOption.click();
        await this.page.waitForTimeout(500);
    }

    /**
     * HELPER — Fill Bed input
     */
    protected async fillLotBed(bed: string): Promise<void> {
        await expect(this.lotCreateBedInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotCreateBedInput.click();
        await this.lotCreateBedInput.fill(bed);
        await this.page.waitForTimeout(300);
    }

    /**
     * HELPER — Fill Bath input
     */
    protected async fillLotBath(bath: string): Promise<void> {
        await expect(this.lotCreateBathInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotCreateBathInput.click();
        await this.lotCreateBathInput.fill(bath);
        await this.page.waitForTimeout(300);
    }

    /**
     * HELPER — Fill all required fields in lot create form
     */
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

    /**
     * HELPER — Click Save & Close button in lot create form
     */
    protected async clickLotCreateSaveAndClose(): Promise<void> {
        await expect(this.lotCreateSaveAndCloseButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotCreateSaveAndCloseButton.scrollIntoViewIfNeeded();
        await this.lotCreateSaveAndCloseButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
    }

    /**
     * HELPER — Click Close button to dismiss lot create form
     */
    protected async clickLotCreateClose(): Promise<void> {
        await expect(this.lotCreateCloseButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotCreateCloseButton.click();
        await this.page.waitForTimeout(800);
    }

    /**
     * HELPER — Assert lot create form is closed (no longer visible)
     */
    protected async assertLotCreateFormClosed(): Promise<void> {
        await expect(this.lotCreateForm).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }
    /**
 * HELPER — Get column name at given index in visible list
 */
    protected async getVisibleColumnNameAtIndex(index: number): Promise<string> {
        const text = await this.visibleColumnList.nth(index).locator('p').first().innerText();
        return text.trim();
    }

    /**
     * HELPER — Click down arrow on column at given index
     */
    protected async clickDownArrowAtIndex(index: number): Promise<void> {
        const row = this.visibleColumnList.nth(index);
        const downArrow = this.columnDownArrow(row);
        await expect(downArrow).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await downArrow.scrollIntoViewIfNeeded();
        await downArrow.click();
        await this.page.waitForTimeout(500);
    }

    /**
     * HELPER — Click up arrow on column at given index
     */
    protected async clickUpArrowAtIndex(index: number): Promise<void> {
        const row = this.visibleColumnList.nth(index);
        const upArrow = this.columnUpArrow(row);
        await expect(upArrow).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await upArrow.scrollIntoViewIfNeeded();
        await upArrow.click();
        await this.page.waitForTimeout(500);
    }
    /**
     * HELPER — Click the Lot sub-tab inside Project Setup
     */
    protected async clickLotSubTab(): Promise<void> {
        await expect(this.lotSubTab).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotSubTab.scrollIntoViewIfNeeded();
        await this.lotSubTab.click();
        await this.page.waitForURL(/\/project-setup\/unit/, { timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.lotSubTabActive).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.waitForLoadState('networkidle');
    }

    /**
     * HELPER — Open Project Setup → Lot tab (full flow)
     */
    protected async openProjectLotTab(projectName: string): Promise<void> {
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
    protected async searchLotList(keyword: string): Promise<void> {
        await expect(this.lotListSearchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotListSearchInput.scrollIntoViewIfNeeded();
        await this.lotListSearchInput.fill('');
        await this.lotListSearchInput.fill(keyword);
        await this.lotListSearchInput.press('Enter');
        await this.page.waitForTimeout(1000);
    }

    /**
     * HELPER — Get count of visible rows in lot list
     */
    protected async getLotListRowCount(): Promise<number> {
        return await this.lotListTableRows.count();
    }

    /**
     * HELPER — Assert a row containing the given text is visible
     */
    protected async assertLotListRowExists(text: string): Promise<void> {
        await expect(this.lotListRowByText(text)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
 * HELPER — Click Export button and wait for file download
 */
    protected async clickLotListExportAndDownload(): Promise<void> {
        await expect(this.lotListExportButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        const downloadPromise = this.page.waitForEvent('download', { timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.lotListExportButton.click();
        const download = await downloadPromise;
        await download.saveAs(`./downloads/${download.suggestedFilename()}`);
    }

    /**
     * HELPER — Click the View button in lot list
     */
    protected async clickLotListViewButton(): Promise<void> {
        await expect(this.lotListViewButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotListViewButton.scrollIntoViewIfNeeded();
        await this.lotListViewButton.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * HELPER — Upload a file to the lot list import input
     */
    protected async uploadLotImportFile(fileName: string): Promise<void> {
        const filePath = path.resolve(ProjectBasePage.IMAGES_DIR, fileName);
        await this.lotListImportInput.setInputFiles(filePath);
        await this.page.waitForTimeout(2000);
    }

    /**
     * HELPER — Click Update Data button
     */
    protected async clickUpdateDataButton(): Promise<void> {
        await expect(this.lotListUpdateDataButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotListUpdateDataButton.scrollIntoViewIfNeeded();
        await this.lotListUpdateDataButton.click();
        await this.page.waitForTimeout(1500);
    }

    /**
     * HELPER — Click Confirm Updates button
     */
    protected async clickConfirmUpdatesButton(): Promise<void> {
        await expect(this.lotListConfirmUpdatesButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotListConfirmUpdatesButton.scrollIntoViewIfNeeded();
        await this.lotListConfirmUpdatesButton.click();
        await this.page.waitForTimeout(2000);
    }

    /**
     * HELPER — Assert import success toast appears
     */
    protected async assertImportSuccessToast(): Promise<void> {
        await expect(this.lotListImportSuccessToast).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
    }

    /**
* HELPER — Assert invalid file error toast appears
*/
    protected async assertInvalidFileToast(): Promise<void> {
        await expect(this.lotListImportInvalidFileToast).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
    }

    /**
     * HELPER — Select checkbox of a specific row (by index)
     */
    protected async selectLotListRowCheckbox(rowIndex: number): Promise<void> {
        const checkbox = this.lotListRowCheckbox(rowIndex);
        await expect(checkbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await checkbox.click();
        await this.page.waitForTimeout(500);
    }

    /**
     * HELPER — Click the Delete button (appears after row selection)
     */
    protected async clickLotListDeleteButton(): Promise<void> {
        await expect(this.lotListDeleteButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotListDeleteButton.scrollIntoViewIfNeeded();
        await this.lotListDeleteButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(2000);
    }

    /**
     * HELPER — Get the lot name from a specific row (by index)
     */
    protected async getLotNameFromRow(rowIndex: number): Promise<string> {
        const row = this.lotListTable.locator('tbody tr').nth(rowIndex);
        const lotCell = row.locator('td').nth(1).locator('p');
        const text = await lotCell.innerText();
        return text.trim();
    }

    /**
     * HELPER — Assert "Selected Records: N" label is visible
     */
    protected async assertSelectedRecordsLabel(): Promise<void> {
        await expect(this.lotListSelectedRecordsLabel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }
    /**
 * TC_01 — Verify clicking Lot tab displays the lot list
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

    async closeDisplayAddressPopupUsingCross(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.openDisplayAddressPopup();
        await this.closeDisplayAddressPopupViaCross();
        await this.cleanupAfterProjectTest();
    }

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

    protected get displayAddressPopupHeading(): Locator {
        return this.page.locator('h4', { hasText: /^\s*Property Address\s*$/i });
    }

    protected get displayAddressPopupSaveButton(): Locator {
        return this.displayAddressPopup.locator('button.btn-primary', { hasText: /^\s*Save\s*$/i });
    }

    protected get projectManagerDropdownPanel(): Locator {
        return this.page.locator('ng-dropdown-panel');
    }

    protected get projectSetupNameInput(): Locator {
        return this.generalSettingContent.locator('input[formcontrolname="Project_Name"]');
    }

    protected get projectSetupNameLabel(): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1', { hasText: /^Project Name$/i });
    }

    protected get projectSetupStatusLabel(): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1', { hasText: /^Project Status$/i });
    }

    protected get projectSetupStatusSelect(): Locator {
        return this.generalSettingContent.locator('ng-select[formcontrolname="Project_Status"]');
    }

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

    async saveProjectAddressWithEmptyFields(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.clearAddressInputFully(this.projectSetupAddressInput);
        await this.clickGeneralTabSave();
        await this.assertProjectUpdatedToast();
        await this.assertInputIsEmpty(this.projectSetupAddressInput);
        await this.cleanupAfterProjectTest();
    }

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

    async verifyDeveloperDropdownShowsContacts(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.openDeveloperDropdown();
        await expect(this.developerDropdownSearchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.developerDropdownCreateNew).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.closeDeveloperDropdown();
        await this.cleanupAfterProjectTest();
    }

    async verifyFloorplanListAppearsOnIconClick(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.scrollToFloorplanSection();
        await this.clickFloorplanToggleArrow();
        await this.cleanupAfterProjectTest();
    }

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

    async verifyProjectAddressPopupOpens(projectName: string = 'Automation', searchQuery: string = 'Australia'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.typeAddressAndAssertSuggestions(this.projectSetupAddressInput, searchQuery);
        await this.clearAddressInput(this.projectSetupAddressInput);
        await this.cleanupAfterProjectTest();
    }

    async verifyProjectDisplayAddressPopupOpens(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.openDisplayAddressPopup();
        await expect(this.displayAddressPopupHeading).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.displayAddressBuildingNameInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.displayAddressPopupSaveButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.closeDisplayAddressPopup();
        await this.cleanupAfterProjectTest();
    }

    async verifyProjectManagerDropdownShowsAllStaff(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.openProjectsManagerDropdown();
        await expect(this.projectManagerDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.closeProjectManagerDropdown();
        await this.cleanupAfterProjectTest();
    }

    async verifyProjectNameAndStatusAppearFirst(projectName: string = 'Automation'): Promise<void> {
        await this.openProjectGeneralTab(projectName);
        await this.assertFieldVisible(this.projectSetupNameLabel, this.projectSetupNameInput);
        await this.assertFieldVisible(this.projectSetupStatusLabel, this.projectSetupStatusSelect);
        await this.assertLabelOrder(['Project Name', 'Project Status'], 0);
        await this.cleanupAfterProjectTest();
    }

    async verifyProjectSetupTabSwitchFromPricelist(projectName: string = 'Automation'): Promise<void> {
        await this.navigateToProjects();
        await this.page.waitForLoadState('networkidle');
        await this.clickProjectCardInProjectSection(projectName);
        await this.assertPricelistTabActive();
        await this.clickProjectSetupTab();
        await this.cleanupAfterProjectTest();
    }

    async verifyProjectsUnderInactiveTab(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await this.clickTabByLabel('Inactive');
        const card = this.projectCardByName(projectName);
        await expect(card).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await card.scrollIntoViewIfNeeded();
    }

    async verifyProjectWithLotsOpensPricelistTab(projectName: string = 'Automation'): Promise<void> {
        await this.navigateToProjects();
        await this.page.waitForLoadState('networkidle');
        await this.clickProjectCardInProjectSection(projectName);
        await this.assertPricelistTabActive();
        await this.cleanupAfterProjectTest();
    }

    async verifyProjectWithoutLotsOpensGeneralTab(projectName: string = "Hina's Project"): Promise<void> {
        await this.navigateToProjects();
        await this.page.waitForLoadState('networkidle');
        await this.clickProjectCardInProjectSection(projectName);
        await this.assertPricelistTabActive();
        await this.cleanupAfterProjectTest();
    }



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


    protected async assertDeveloperSelected(developerName: string): Promise<void> {
        await expect(this.developerSelectedChipByName(developerName)).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_DEFAULT,
        });
    }

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

    protected async assertFieldVisible(label: Locator, input: Locator): Promise<void> {
        await expect(label).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(input).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async assertProjectUpdatedToast(): Promise<void> {
        const toast = this.page.locator('div[aria-label="Project updated successfully"]', { hasText: /Project updated successfully/i }).first();
        await expect(toast).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.page.waitForTimeout(500);
    }

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

    protected async clickDisplayAddressPopupSave(): Promise<void> {
        await expect(this.displayAddressPopupSaveButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.displayAddressPopupSaveButton.click();
        await this.page.waitForTimeout(1500);
    }

    protected async clickGeneralTabSave(): Promise<void> {
        await expect(this.generalTabSaveButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.generalTabSaveButton.click();
        await this.page.waitForTimeout(1500);
    }

    protected async closeDeveloperDropdown(): Promise<void> {
        await this.page.mouse.click(10, 10);
        await this.page.waitForTimeout(500);
        await expect(this.developerDropdownPanel).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async closeDisplayAddressPopup(): Promise<void> {
        await this.page.mouse.click(0, 100); // click outside the popup
        await this.page.waitForTimeout(500);
    }

    protected async closeProjectManagerDropdown(): Promise<void> {
        await this.page.mouse.click(10, 10);
        await this.page.waitForTimeout(500);
        await expect(this.projectManagerDropdownPanel).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

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

    protected async getFirstVisiblePrecinctCard(): Promise<void> {
        await expect(this.firstGridProduct).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await expect(this.firstGridProduct).toBeEnabled({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.firstGridProduct.click();
    }

    protected async openDeveloperDropdown(): Promise<void> {
        const isOpen = await this.developerDropdownPanel.isVisible().catch(() => false);
        if (isOpen) return;

        await expect(this.developerDropdownArrow).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.developerDropdownArrow.scrollIntoViewIfNeeded();
        await this.developerDropdownArrow.click();
        await this.page.waitForTimeout(500);
        await expect(this.developerDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async openDisplayAddressPopup(): Promise<void> {
        await expect(this.projectDisplayAddressPencilIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectDisplayAddressPencilIcon.click();
        await this.page.waitForTimeout(800);
        await expect(this.displayAddressPopupHeading).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async openProjectGeneralTab(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await this.page.waitForLoadState('networkidle');
        await this.clickProjectCardInProjectSection(projectName);
        await this.assertPricelistTabActive();
        await this.clickProjectSetupTab();
        await this.openGeneralTab();
    }

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

    protected async openProjectsManagerDropdown(): Promise<void> {
        await this.projectManagersDropdown.scrollIntoViewIfNeeded();
        await this.projectManagersDropdown.click();
        await this.page.waitForTimeout(500);
        await expect(this.projectManagerDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async toggleDeveloperSelection(developerName: string): Promise<void> {
        const developerItem = this.developerDropdownItemByText(developerName);
        await expect(developerItem).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await developerItem.click();
        await this.page.waitForTimeout(500);
    }

    async verifyProjectCanBeSearchedByName(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await expect(this.searchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.searchInput.fill(projectName);
        await expect(this.projectCardByName(projectName)).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_LONG,
        });
    }



    protected async addBonusCampaignTag(tagText: string): Promise<void> {
        await expect(this.bonusCampaignInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.bonusCampaignInput.scrollIntoViewIfNeeded();
        await this.bonusCampaignInput.fill(tagText);
        await this.bonusCampaignInput.press('Enter');
        await this.page.waitForTimeout(500);
    }

    protected async addBonusPayableToTag(tagText: string): Promise<void> {
        await expect(this.bonusPayableToInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.bonusPayableToInput.scrollIntoViewIfNeeded();
        await this.bonusPayableToInput.fill(tagText);
        await this.bonusPayableToInput.press('Enter');
        await this.page.waitForTimeout(500);
    }

    protected async addBonusPayableUponTag(tagText: string): Promise<void> {
        await expect(this.bonusPayableUponInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.bonusPayableUponInput.scrollIntoViewIfNeeded();
        await this.bonusPayableUponInput.fill(tagText);
        await this.bonusPayableUponInput.press('Enter');
        await this.page.waitForTimeout(500);
    }

    protected async assertAllDisplayAddressFieldsEmpty(): Promise<void> {
        expect(await this.displayAddressBuildingNameInput.inputValue()).toBe('');
        expect(await this.displayAddressUnitNoInput.inputValue()).toBe('');
        expect(await this.displayAddressStreetNoInput.inputValue()).toBe('');
        expect(await this.displayAddressStreetNameInput.inputValue()).toBe('');
        expect(await this.displayAddressStateInput.inputValue()).toBe('');
        expect(await this.displayAddressPostCodeInput.inputValue()).toBe('');
        expect(await this.displayAddressCountryInput.inputValue()).toBe('');
    }

    protected async assertBonusCampaignTagExists(tagText: string): Promise<void> {
        await expect(this.bonusCampaignTokenByText(tagText)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.bonusCampaignTokenByText(tagText).locator('span.p-chips-token-label')).toHaveText(tagText, {
            timeout: ProjectBasePage.TIMEOUT_DEFAULT,
        });
    }

    protected async assertBonusPayableToTagExists(tagText: string): Promise<void> {
        await expect(this.bonusPayableToTokenByText(tagText)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.bonusPayableToTokenByText(tagText).locator('span.p-chips-token-label')).toHaveText(tagText, {
            timeout: ProjectBasePage.TIMEOUT_DEFAULT,
        });
    }

    protected async assertBonusPayableUponTagExists(tagText: string): Promise<void> {
        await expect(this.bonusPayableUponTokenByText(tagText)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.bonusPayableUponTokenByText(tagText).locator('span.p-chips-token-label')).toHaveText(tagText, {
            timeout: ProjectBasePage.TIMEOUT_DEFAULT,
        });
    }

    protected async assertDeveloperPlaceholderVisible(): Promise<void> {
        const chipCount = await this.developerSelectedChips.count();
        expect(chipCount).toBe(0);
        await expect(this.developerPlaceholder).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async assertFloorplanTypeColumnSortState(expectedState: 'none' | 'ascending' | 'descending'): Promise<void> {
        await expect(this.floorplanTypeColumnHeader).toHaveAttribute('aria-sort', expectedState, {
            timeout: ProjectBasePage.TIMEOUT_DEFAULT,
        });
    }

    protected async assertInputIsEmpty(input: Locator): Promise<void> {
        const value = await input.inputValue();
        expect(value).toBe('');
    }

    protected async assertLabelNotRequired(labelText: string): Promise<void> {
        const label = this.generalTabLabelByText(labelText);
        await expect(label).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        const text = await label.textContent();
        expect(text?.trim()).toBe(labelText);
        expect(text).not.toContain('*');
    }

    protected async assertLabelOrder(expectedLabels: string[], startIndex: number = 0): Promise<void> {
        for (let i = 0; i < expectedLabels.length; i++) {
            const actualText = (await this.generalTabAllLabels.nth(startIndex + i).innerText()).trim();
            expect(actualText).toBe(expectedLabels[i]);
        }
    }

    protected async assertUpgradeBoxValues(boxIndex: number, groupName: string, upgradeName: string, cost: string): Promise<void> {
        await expect(this.upgradeGroupInput(boxIndex)).toHaveValue(groupName, { timeout: ProjectBasePage.TIMEOUT_LONG });
        await expect(this.upgradeInput(boxIndex)).toHaveValue(upgradeName, { timeout: ProjectBasePage.TIMEOUT_LONG });
    }

    protected async assertUpgradeRowValues(boxIndex: number, rowIndex: number, upgradeName: string, cost: string): Promise<void> {
        await expect(this.upgradeRowInput(boxIndex, rowIndex)).toHaveValue(upgradeName, { timeout: ProjectBasePage.TIMEOUT_DEFAULT });

        const actualCost = await this.upgradeRowCostInput(boxIndex, rowIndex).inputValue();
        const cleanCost = actualCost.replace(/[$,]/g, '').trim();
        expect(cleanCost).toBe(cost);
    }

    protected async checkFloorplanRowAndWaitForDelete(rowIndex: number): Promise<void> {
        const checkbox = this.floorplanRowCheckbox(rowIndex);
        await expect(checkbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await checkbox.scrollIntoViewIfNeeded();
        await checkbox.click();
        await expect(this.floorplanHeaderDeleteIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async clearAddressInput(input: Locator): Promise<void> {
        await input.fill('');
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);
    }

    protected async clearAddressInputFully(input: Locator): Promise<void> {
        await input.click();
        await input.press('Control+A');
        await input.press('Delete');
        await this.page.waitForTimeout(300);
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(300);
    }

    protected async clearAndFillUpgradeBox(boxIndex: number, groupName: string, upgradeName: string, cost: string): Promise<void> {
        await this.upgradeGroupInput(boxIndex).fill('');
        await this.upgradeGroupInput(boxIndex).fill(groupName);

        await this.upgradeInput(boxIndex).fill('');
        await this.upgradeInput(boxIndex).fill(upgradeName);

        await this.upgradeCostInput(boxIndex).fill('');
        await this.upgradeCostInput(boxIndex).fill(cost);

        await this.page.waitForTimeout(300);
    }

    protected async clearAndFillUpgradeRow(boxIndex: number, rowIndex: number, upgradeName: string, cost: string): Promise<void> {
        await this.upgradeRowInput(boxIndex, rowIndex).fill('');
        await this.upgradeRowInput(boxIndex, rowIndex).fill(upgradeName);

        await this.upgradeRowCostInput(boxIndex, rowIndex).fill('');
        await this.upgradeRowCostInput(boxIndex, rowIndex).fill(cost);

        await this.page.waitForTimeout(300);
    }

    protected async clickAddAdditionalUpgradeGroup(): Promise<void> {
        await expect(this.addAdditionalUpgradeGroupButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.addAdditionalUpgradeGroupButton.scrollIntoViewIfNeeded();
        await this.addAdditionalUpgradeGroupButton.click();
        await this.page.waitForTimeout(500);
    }

    protected async clickAddUpgrade(boxIndex: number): Promise<void> {
        await expect(this.addUpgradeButton(boxIndex)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.addUpgradeButton(boxIndex).scrollIntoViewIfNeeded();
        await this.addUpgradeButton(boxIndex).click();
        await this.page.waitForTimeout(500);
    }

    protected async clickFloorplanHeaderDelete(): Promise<void> {
        await expect(this.floorplanHeaderDeleteIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.floorplanHeaderDeleteIcon.click();
        await this.page.waitForTimeout(800);
    }

    protected async clickFloorplanPlusIcon(): Promise<void> {
        await expect(this.floorplanPlusIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.floorplanPlusIcon.scrollIntoViewIfNeeded();
        await this.floorplanPlusIcon.click();
        await this.page.waitForTimeout(500);
    }

    protected async clickFloorplanToggleArrow(): Promise<void> {
        await expect(this.floorplanToggleArrowDown).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.floorplanToggleArrowDown.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(800);
        await this.floorplanToggleArrowDown.click();
    }

    protected async clickFloorplanTypeColumnSort(): Promise<void> {
        await expect(this.floorplanTypeColumnHeader).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.floorplanTypeColumnHeader.scrollIntoViewIfNeeded();
        await this.floorplanTypeColumnHeader.click();
        await this.page.waitForTimeout(500);
    }

    protected async closeDisplayAddressPopupViaCross(): Promise<void> {
        await expect(this.displayAddressPopupCloseIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.displayAddressPopupCloseIcon.click();
        await this.page.waitForTimeout(500);
        await expect(this.displayAddressPopupHeading).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected get developerDropdownArrow(): Locator {
        return this.developerDropdownContainer.locator('i.fas.fa-sort-down, i.fas.fa-sort-up').first();
    }

    protected get developerDropdownCreateNew(): Locator {
        return this.developerDropdownPanel.locator('p.cursor-pointer', { hasText: /Create New/i });
    }

    protected developerDropdownItemByText(text: string): Locator {
        return this.developerDropdownPanel.locator('ul li').filter({ hasText: text }).first();
    }

    protected get developerDropdownPanel(): Locator {
        return this.developerDropdownContainer.locator('.drop_box');
    }

    protected get developerDropdownSearchInput(): Locator {
        return this.developerDropdownPanel.locator('input[placeholder="Search"]');
    }

    protected developerSelectedChipByName(name: string): Locator {
        return this.developerSelectedChips.filter({ hasText: name }).first();
    }

    protected get displayAddressBuildingNameInput(): Locator {
        return this.page.locator('input[formcontrolname="building_name"]');
    }

    protected get displayAddressCountryInput(): Locator {
        return this.page.locator('input[formcontrolname="country"]');
    }

    protected get displayAddressPopup(): Locator {
        return this.page.locator('.row', { hasText: /Property Address/i }).filter({ has: this.page.locator('h4', { hasText: /Property Address/i }) });
    }

    protected get displayAddressPostCodeInput(): Locator {
        return this.page.locator('input[formcontrolname="post_code"]');
    }

    protected get displayAddressStateInput(): Locator {
        return this.page.locator('input[formcontrolname="state"]');
    }

    protected get displayAddressStreetNameInput(): Locator {
        return this.page.locator('input[formcontrolname="street_name"]');
    }

    protected get displayAddressStreetNoInput(): Locator {
        return this.page.locator('input[formcontrolname="street_no"]');
    }

    protected get displayAddressSuburbAutocomplete(): Locator {
        return this.page.locator('p-autocomplete[formcontrolname="suburb"] input');
    }

    protected displayAddressSuburbSuggestionByLabel(label: string): Locator {
        return this.page.locator('li.p-autocomplete-item[role="option"][aria-label="' + label + '"]');
    }

    protected get displayAddressUnitNoInput(): Locator {
        return this.page.locator('input[formcontrolname="unit_no"]');
    }

    protected get generalSettingContent(): Locator {
        return this.page.locator('app-general-setting');
    }

    protected get generalTabSaveButton(): Locator {
        return this.generalSettingContent.locator('button._outline-btn', { hasText: /^\s*Save\s*$/i }).first();
    }

    protected async getFloorplanRowCount(): Promise<number> {
        return await this.floorplanTableRows.count();
    }

    protected async getUpgradeBoxCount(): Promise<number> {
        return await this.upgradeBoxes.count();
    }

    protected async getUpgradeRowCount(boxIndex: number): Promise<number> {
        return await this.upgradeRowsInBox(boxIndex).count();
    }

    protected async openGeneralTab(): Promise<void> {
        const currentUrl = this.page.url();
        if (!currentUrl.includes('/project-setup')) {
            await this.clickProjectSetupTab();
        }
        await expect(this.generalSubTabActive).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await expect(this.generalSettingContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
    }

    protected get projectDisplayAddressPencilIcon(): Locator {
        return this.generalSettingContent.locator('button#toggle-overlay');
    }

    protected get projectManagersDropdown(): Locator {
        return this.page.locator('ng-select[formcontrolname="Project_Manager"]');
    }

    protected get projectSetupAddressInput(): Locator {
        return this.generalSettingContent.locator('input[formcontrolname="Project_Address"]');
    }

    protected get projectSetupAddressLabel(): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1', { hasText: /^Project Address$/i });
    }

    protected get projectSetupDisplayAddressInput(): Locator {
        return this.generalSettingContent.locator('input[formcontrolname="Project_Display_Address"]');
    }

    protected get projectSetupDisplayAddressLabel(): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1', { hasText: /^Project Display Address$/i });
    }

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

    protected async removeAllBonusCampaignTags(): Promise<void> {
        let count = await this.bonusCampaignTokens.count();
        while (count > 0) {
            await this.bonusCampaignTokens.first().locator('timescircleicon').click();
            await this.page.waitForTimeout(500);
            count = await this.bonusCampaignTokens.count();
        }
    }

    protected async removeAllBonusPayableToTags(): Promise<void> {
        let count = await this.bonusPayableToTokens.count();
        while (count > 0) {
            await this.bonusPayableToTokens.first().locator('timescircleicon').click();
            await this.page.waitForTimeout(500);
            count = await this.bonusPayableToTokens.count();
        }
    }

    protected async removeAllBonusPayableUponTags(): Promise<void> {
        let count = await this.bonusPayableUponTokens.count();
        while (count > 0) {
            await this.bonusPayableUponTokens.first().locator('timescircleicon').click();
            await this.page.waitForTimeout(500);
            count = await this.bonusPayableUponTokens.count();
        }
    }

    protected async removeBonusCampaignTag(tagText: string): Promise<void> {
        await expect(this.bonusCampaignTokenRemoveIcon(tagText)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.bonusCampaignTokenRemoveIcon(tagText).click();
        await this.page.waitForTimeout(500);
        await expect(this.bonusCampaignTokenByText(tagText)).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async removeBonusPayableToTag(tagText: string): Promise<void> {
        await expect(this.bonusPayableToTokenRemoveIcon(tagText)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.bonusPayableToTokenRemoveIcon(tagText).click();
        await this.page.waitForTimeout(500);
        await expect(this.bonusPayableToTokenByText(tagText)).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async removeBonusPayableUponTag(tagText: string): Promise<void> {
        await expect(this.bonusPayableUponTokenRemoveIcon(tagText)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.bonusPayableUponTokenRemoveIcon(tagText).click();
        await this.page.waitForTimeout(500);
        await expect(this.bonusPayableUponTokenByText(tagText)).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async removeUpgradeBox(boxIndex: number): Promise<void> {
        await expect(this.upgradeBoxRemoveIcon(boxIndex)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.upgradeBoxRemoveIcon(boxIndex).scrollIntoViewIfNeeded();
        await this.upgradeBoxRemoveIcon(boxIndex).click();
        await this.page.waitForTimeout(500);
    }

    protected async removeUpgradeRow(boxIndex: number, rowIndex: number): Promise<void> {
        await expect(this.upgradeRowRemoveIcon(boxIndex, rowIndex)).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.upgradeRowRemoveIcon(boxIndex, rowIndex).click();
        await this.page.waitForTimeout(500);
    }

    protected async scrollToBonusCampaign(): Promise<void> {
        await this.bonusCampaignLabel.scrollIntoViewIfNeeded();
        await expect(this.bonusCampaignLabel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(300);
    }

    protected async scrollToBonusPayableTo(): Promise<void> {
        await this.bonusPayableToLabel.scrollIntoViewIfNeeded();
        await expect(this.bonusPayableToLabel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(300);
    }

    protected async scrollToBonusPayableUpon(): Promise<void> {
        await this.bonusPayableUponLabel.scrollIntoViewIfNeeded();
        await expect(this.bonusPayableUponLabel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(300);
    }

    protected async scrollToFloorplanSection(): Promise<void> {
        await this.floorplanSectionHeading.scrollIntoViewIfNeeded();
        await expect(this.floorplanSectionHeading).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(300);
    }

    protected async scrollToProjectUpgradesSection(): Promise<void> {
        await this.projectUpgradesHeading.scrollIntoViewIfNeeded();
        await expect(this.projectUpgradesHeading).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(300);
    }

    protected async selectFirstAddressSuggestion(input: Locator): Promise<string> {
        await expect(this.googlePlacesSuggestions.first()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.googlePlacesSuggestions.first().click();
        await this.page.waitForTimeout(800);
        const filledValue = await input.inputValue();
        expect(filledValue.length).toBeGreaterThan(0);
        return filledValue;
    }

    protected async toggleFloorplanHeaderCheckboxAndWaitForDelete(): Promise<void> {
        await expect(this.floorplanHeaderCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.floorplanHeaderCheckbox.scrollIntoViewIfNeeded();
        await this.floorplanHeaderCheckbox.click();
        await expect(this.floorplanHeaderDeleteIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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



    protected get addAdditionalUpgradeGroupButton(): Locator {
        return this.projectUpgradesSection.locator('button._view-btn').filter({
            has: this.page.locator('i.pi-plus')
        }).first();
    }

    protected addUpgradeButton(boxIndex: number): Locator {
        return this.upgradeBox(boxIndex).locator('button._view-btn').filter({
            has: this.page.locator('i.pi-plus')
        }).first();
    }

    protected get bonusCampaignInput(): Locator {
        return this.bonusCampaignChips.locator('li.p-chips-input-token input').first();
    }

    protected get bonusCampaignLabel(): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1', { hasText: /^Bonus Campaign$/ }).first();
    }

    protected bonusCampaignTokenByText(text: string): Locator {
        return this.bonusCampaignChips.locator('li.p-chips-token').filter({
            has: this.page.locator('span.p-chips-token-label', { hasText: text })
        }).first();
    }

    protected bonusCampaignTokenRemoveIcon(text: string): Locator {
        return this.bonusCampaignTokenByText(text).locator('timescircleicon').first();
    }

    protected get bonusCampaignTokens(): Locator {
        return this.bonusCampaignChips.locator('li.p-chips-token');
    }

    protected get bonusPayableToInput(): Locator {
        return this.bonusPayableToChips.locator('li.p-chips-input-token input').first();
    }

    protected get bonusPayableToLabel(): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1', { hasText: /^Bonus Payable To$/ }).first();
    }

    protected bonusPayableToTokenByText(text: string): Locator {
        return this.bonusPayableToChips.locator('li.p-chips-token').filter({
            has: this.page.locator('span.p-chips-token-label', { hasText: text })
        }).first();
    }

    protected bonusPayableToTokenRemoveIcon(text: string): Locator {
        return this.bonusPayableToTokenByText(text).locator('timescircleicon').first();
    }

    protected get bonusPayableToTokens(): Locator {
        return this.bonusPayableToChips.locator('li.p-chips-token');
    }

    protected get bonusPayableUponInput(): Locator {
        return this.bonusPayableUponChips.locator('li.p-chips-input-token input').first();
    }

    protected get bonusPayableUponLabel(): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1', { hasText: /^Bonus Payable Upon$/ }).first();
    }

    protected bonusPayableUponTokenByText(text: string): Locator {
        return this.bonusPayableUponChips.locator('li.p-chips-token').filter({
            has: this.page.locator('span.p-chips-token-label', { hasText: text })
        }).first();
    }

    protected bonusPayableUponTokenRemoveIcon(text: string): Locator {
        return this.bonusPayableUponTokenByText(text).locator('timescircleicon').first();
    }

    protected get bonusPayableUponTokens(): Locator {
        return this.bonusPayableUponChips.locator('li.p-chips-token');
    }

    protected get developerDropdownContainer(): Locator {
        return this.page.locator('re-multiselect').first();
    }

    protected get developerPlaceholder(): Locator {
        return this.developerDropdownContainer.locator('.placeHolder', { hasText: /Select Developer/i });
    }

    protected get developerSelectedChips(): Locator {
        return this.developerDropdownContainer.locator('.tags .selected_one');
    }

    protected get displayAddressPopupCloseIcon(): Locator {
        return this.page.locator('.p-overlaypanel-close-icon').first();
    }

    protected get floorplanHeaderCheckbox(): Locator {
        return this.floorplanTable.locator('thead p-checkbox .p-checkbox-box').first();
    }

    protected get floorplanHeaderDeleteIcon(): Locator {
        return this.floorplanSectionHeader.locator('img[src*="delete_icon.svg"]').first();
    }

    protected get floorplanPlusIcon(): Locator {
        return this.floorplanSectionHeader.locator('i.pi-plus').first();
    }

    protected floorplanRowCheckbox(rowIndex: number): Locator {
        return this.floorplanTableRows.nth(rowIndex).locator('p-checkbox.cbox .p-checkbox-box').first();
    }

    protected get floorplanSectionHeading(): Locator {
        return this.generalSettingContent.locator('p.f-14').filter({ hasText: 'Floorplan Types' }).first();
    }

    protected get floorplanTableRows(): Locator {
        return this.floorplanTable.locator('tbody tr');
    }

    protected get floorplanToggleArrowDown(): Locator {
        return this.page.locator('i.pi-angle-down').last();
    }

    protected get floorplanTypeColumnHeader(): Locator {
        return this.floorplanTable.locator('th.p-sortable-column[psortablecolumn="name"]').first();
    }

    protected get generalSubTabActive(): Locator {
        return this.page.locator('a.active[href*="/project-setup/general"]');
    }

    protected get generalTabAllLabels(): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1');
    }

    protected generalTabLabelByText(text: string): Locator {
        return this.generalSettingContent.locator('p.f-12.mb-1', { hasText: new RegExp(`^${text}$`) }).first();
    }

    protected get googlePlacesSuggestions(): Locator {
        return this.page.locator('.pac-container:visible .pac-item');
    }

    protected get projectUpgradesHeading(): Locator {
        return this.generalSettingContent.locator('p.f-16._fw-600').filter({ hasText: 'Project Upgrades' }).first();
    }

    protected get projectUpgradesSection(): Locator {
        return this.projectUpgradesHeading.locator('xpath=../..').first();
    }

    protected get upgradeBoxes(): Locator {
        return this.projectUpgradesSection.locator('.upgrade-box');
    }

    protected upgradeBoxRemoveIcon(boxIndex: number): Locator {
        return this.upgradeBox(boxIndex).locator('button._view-btn').filter({
            has: this.page.locator('i.pi-times-circle')
        }).first();
    }

    protected upgradeCostInput(boxIndex: number): Locator {
        return this.upgradeBox(boxIndex).locator('app-price-input input').first();
    }

    protected upgradeGroupInput(boxIndex: number): Locator {
        return this.upgradeBox(boxIndex).locator('input.site-input').nth(0);
    }

    protected upgradeInput(boxIndex: number): Locator {
        return this.upgradeBox(boxIndex).locator('input.site-input').nth(1);
    }

    protected upgradeRowCostInput(boxIndex: number, rowIndex: number): Locator {
        return this.upgradeRowsInBox(boxIndex).nth(rowIndex).locator('app-price-input input').first();
    }

    protected upgradeRowInput(boxIndex: number, rowIndex: number): Locator {
        return this.upgradeRowsInBox(boxIndex).nth(rowIndex).locator('input.site-input').first();
    }

    protected upgradeRowRemoveIcon(boxIndex: number, rowIndex: number): Locator {
        return this.upgradeRowsInBox(boxIndex).nth(rowIndex).locator('i.pi-times-circle').first();
    }

    protected upgradeRowsInBox(boxIndex: number): Locator {
        return this.upgradeBox(boxIndex).locator('div.mb-2.d-flex.position-relative');
    }



    protected get bonusCampaignChips(): Locator {
        return this.generalSettingContent.locator('p-chips[formcontrolname="bonus_campaign"]').first();
    }

    protected get bonusPayableToChips(): Locator {
        return this.generalSettingContent.locator('p-chips[formcontrolname="bonus_payable_to"]').first();
    }

    protected get bonusPayableUponChips(): Locator {
        return this.generalSettingContent.locator('p-chips[formcontrolname="bonus_payable_upon"]').first();
    }

    protected get floorplanSectionHeader(): Locator {
        return this.floorplanSectionHeading.locator('xpath=..').first();
    }

    protected get floorplanTable(): Locator {
        return this.floorplanTableWrapper.locator('p-table').first();
    }

    protected upgradeBox(index: number): Locator {
        return this.upgradeBoxes.nth(index);
    }


    protected get floorplanTableWrapper(): Locator {
        return this.generalSettingContent.locator('div.s-card-table.s-responsive-table').first();
    }
}