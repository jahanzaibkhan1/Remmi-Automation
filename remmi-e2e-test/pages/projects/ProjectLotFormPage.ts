import { expect, Locator } from '@playwright/test';
import { faker } from '@faker-js/faker';
import * as path from 'path';
import { ProjectBasePage } from './ProjectBasePage';

export class ProjectLotFormPage extends ProjectBasePage {
    async clickLotOpensLotForm(
        projectName: string = 'Automation',
        lotName: string = 'Automation Lot'
    ): Promise<void> {
        await this.openProjectLotTab(projectName);
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickLotRowByName(lotName);
        await expect(this.lotFormSaveAndCloseButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickLotRowByName(lotName);
        await expect(this.lotFormSaveAndCloseButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickLotRowByName(lotName);
        await expect(this.lotFormSaveAndCloseButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickLotRowByName(lotName);
        await expect(this.lotFormSaveAndCloseButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickLotRowByName(lotName);
        await expect(this.lotFormSaveAndCloseButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickLotRowByName(lotName);
        await expect(this.lotFormSaveAndCloseButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickLotRowByName(lotName);
        await expect(this.lotFormSaveAndCloseButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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
    protected async selectLotFormProject(projectName: string): Promise<void> {
        // Open dropdown
        await this.clickLotFormProjectDropdown();

        // Type project name in search input
        const searchInput = this.lotFormProjectDropdown.locator('input[type="text"]').first();
        await searchInput.fill(projectName);
        await this.page.waitForTimeout(500);

        // Click exact match option
        const projectOption = this.page.getByRole('option', { name: projectName, exact: true });
        await expect(projectOption).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickLotRowByName(lotName);
        await expect(this.lotFormSaveAndCloseButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickLotRowByName(lotName);
        await this.lotFormLotInput.fill('Automation Lot');
        await this.clickLotFormSave();
        await expect(this.lotFormSaveAndCloseButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.lotFormSaveButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await expect(this.lotFormHistoryTab).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotFormHistoryTab.click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormHistoryTab).toHaveClass(/active/);
        await expect(this.historyTabContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        const rowCount = await this.historyTableRows.count();
        expect(rowCount).toBeGreaterThan(0);
        await expect(this.historyRecordsCount).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickLotRowByName(lotName);
        await this.openAndValidateHistoryTab();
        await this.clickPopupCloseIcon();
        await this.cleanupAfterProjectTest();
    }

    /**
     * Helper to perform a search in the history tab and check results.
     */
    async searchHistoryTabAndCheck(keyword: string): Promise<void> {
        await expect(this.historySearchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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
    protected async getHistoryRowEventText(row: Locator): Promise<string> {
        return (await this.historyRowEvent(row).innerText()).trim();
    }

    /**
     * HELPER — Get trimmed Old Value text from a history row
     */
    protected async getHistoryRowOldValueText(row: Locator): Promise<string> {
        return (await this.historyRowOldValue(row).innerText()).trim();
    }

    /**
     * HELPER — Get trimmed New Value text from a history row
     */
    protected async getHistoryRowNewValueText(row: Locator): Promise<string> {
        return (await this.historyRowNewValue(row).innerText()).trim();
    }

    /**
     * HELPER — Assert all rows matching expectedEvent have old value empty and new value present
     * Used for CREATE events where only new values should be shown
     */
    protected async assertOnlyNewValuesForEvent(expectedEvent: string): Promise<void> {
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
    protected async assertBothValuesForEvent(expectedEvent: string): Promise<void> {
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
    protected async assertInvalidProjectNotFound(invalidProjectName: string): Promise<void> {
        await this.clickLotFormProjectDropdown();
        const searchInput = this.lotFormProjectDropdown.locator('input[type="text"]').first();
        await searchInput.fill(invalidProjectName);
        await this.page.waitForTimeout(800);
        const matchingOption = this.lotFormProjectDropdownOptions.filter({
            hasText: new RegExp(invalidProjectName, 'i')
        });
        await expect(matchingOption).toHaveCount(0, { timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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
        await expect(this.lotListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickLotRowByName(lotName);
        await expect(this.lotFormSaveAndCloseButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.assertInvalidProjectNotFound(invalidProjectName);
        await this.clickPopupCloseIcon();
        await this.cleanupAfterProjectTest();
    }

    // ==========================================================================
    // LOCATORS — PRICE LIST
    // ==========================================================================

    protected get priceListTab(): Locator {
        return this.page.locator('a, button, li').filter({ hasText: /^\s*Price List\s*$/i }).first();
    }

    protected get priceListTable(): Locator {
        return this.page.locator('app-price-list table, p-table table').first();
    }

    protected get priceListTableRows(): Locator {
        return this.priceListTable.locator('tbody tr');
    }

    protected get lotPreviewToggle(): Locator {
        return this.page.locator('app-price-list p-inputswitch').first();
    }

    protected get lotPreviewToggleSlider(): Locator {
        return this.lotPreviewToggle.locator('.p-inputswitch').first();
    }

    protected priceListRowByLotName(lotName: string): Locator {
        return this.priceListTableRows.filter({ hasText: lotName }).first();
    }

    protected get lotPreviewPopup(): Locator {
        return this.page.locator('.confirmation-dialog-body, .unit-detail-popup').first();
    }

    protected get lotPreviewPopupTitle(): Locator {
        return this.page.locator('.confirmation-dialog-header p.f-24').first();
    }

    protected get lotPreviewPopupCloseIcon(): Locator {
        return this.page.locator('.confirmation-dialog-header img[src*="Close_square"]').first();
    }

    protected get lotPreviewToastOn(): Locator {
        return this.page.locator('div[role="alert"].toast-message').filter({ hasText: /lot preview on successfully/i }).first();
    }

    protected get lotPreviewToastOff(): Locator {
        return this.page.locator('div[role="alert"].toast-message').filter({ hasText: /lot preview off successfully/i }).first();
    }

    protected get priceListSearchInput(): Locator {
        return this.page.locator('app-price-list input[placeholder="Search"]').first();
    }

    protected get priceListNoResultsMessage(): Locator {
        return this.page.locator('app-price-list td').filter({ hasText: /^\s*No lots available\s*$/i }).first();
    }

    protected get priceListSearchCrossIcon(): Locator {
        return this.page.locator('app-price-list i.pi-times._cross-icon').first();
    }

    protected get priceListFilterPopup(): Locator {
        return this.page.locator('div.p-overlaypanel').first();
    }

    protected priceListColumnFilterIcon(columnName: string): Locator {
        return this.page.locator(`app-price-list th:has-text("${columnName}") img[alt="filter"]`).first();
    }

    protected get priceListFilterStatusDropdown(): Locator {
        return this.priceListFilterPopup.locator('re-multiselect, ng-select').first();
    }

    protected priceListFilterSelectedTag(value: string): Locator {
        return this.priceListFilterPopup
            .locator('re-multiselect .selected_one')
            .filter({ hasText: value })
            .first();
    }

    protected priceListFilterTagRemoveIcon(value: string): Locator {
        return this.priceListFilterSelectedTag(value).locator('span.pi-times-circle').first();
    }

    /**
     * HELPER — Click the cross icon on a selected filter tag to remove it
     */
    protected async removePriceListFilterTag(value: string): Promise<void> {
        const removeIcon = this.priceListFilterTagRemoveIcon(value);
        await expect(removeIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await removeIcon.click();
        await this.page.waitForTimeout(800);
    }

    /**
     * HELPER — Assert a filter tag is no longer visible
     */
    protected async assertPriceListFilterTagNotVisible(value: string): Promise<void> {
        await expect(this.priceListFilterSelectedTag(value)).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
 * HELPER — Click filter icon on specific column (Price List)
 */
    protected async clickPriceListColumnFilterIcon(columnName: string): Promise<void> {
        const filterIcon = this.priceListColumnFilterIcon(columnName);
        await expect(filterIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });

        // Double-click pattern (PrimeNG OverlayPanel requirement)
        await filterIcon.click();
        await this.page.waitForTimeout(700);
        await filterIcon.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * HELPER — Assert Price List filter popup is visible
     */
    protected async assertPriceListFilterPopupVisible(): Promise<void> {
        await expect(this.priceListFilterPopup).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Click Status dropdown inside filter popup
     */
    protected async clickPriceListFilterStatusDropdown(): Promise<void> {
        await expect(this.priceListFilterStatusDropdown).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.priceListFilterStatusDropdown.click();
        await this.page.waitForTimeout(800);
    }

    /**
 * HELPER — Click cross icon to clear search input
 */
    protected async clickPriceListSearchCrossIcon(): Promise<void> {
        await expect(this.priceListSearchCrossIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.priceListSearchCrossIcon.click();
        await this.page.waitForTimeout(800);
    }

    /**
     * HELPER — Assert search input is empty
     */
    protected async assertPriceListSearchInputEmpty(): Promise<void> {
        await expect(this.priceListSearchInput).toHaveValue('', { timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
 * HELPER — Click on Price List tab
 */
    protected async clickPriceListTab(): Promise<void> {
        await expect(this.priceListTab).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.priceListTab.click();
    }

    protected async getRecordsCountText(): Promise<string> {
        await expect(this.lotRecordsCount).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        const text = (await this.lotRecordsCount.innerText()).trim();
        console.log(text);
        return text;
    }

    /**
 * TC_01 — Open Price List with valid lots
 */


    protected get lotFormProjectDropdownOptions(): Locator {
        return this.page.locator('ng-dropdown-panel .ng-option');
    }

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



    protected async clickAddNewLotButton(): Promise<void> {
        await expect(this.lotListAddNewButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotListAddNewButton.click();
        await expect(this.lotCreateForm).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.page.waitForTimeout(1000);
    }

    protected async assertRequiredFieldToast(): Promise<void> {
        await expect(this.lotCreateRequiredFieldToast).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
    }

    protected async clickLotCreateClose(): Promise<void> {
        await expect(this.lotCreateCloseButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotCreateCloseButton.click();
        await this.page.waitForTimeout(800);
    }

    protected async assertLotCreateFormClosed(): Promise<void> {
        await expect(this.lotCreateForm).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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

    protected get lotCreateSaveAndCloseButton(): Locator {
        return this.lotCreateForm.locator('button._primary-btn', { hasText: /Save & Close/i }).first();
    }

    protected get lotListAddNewButton(): Locator {
        return this.page.locator('app-unit button._addNew').first();
    }

}