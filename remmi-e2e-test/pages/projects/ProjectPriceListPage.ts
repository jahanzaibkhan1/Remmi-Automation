import { expect, Locator } from '@playwright/test';
import { faker } from '@faker-js/faker';
import * as path from 'path';
import { ProjectBasePage } from './ProjectBasePage';

export class ProjectPriceListPage extends ProjectBasePage {
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
    protected async enableLotPreviewToggle(): Promise<void> {
        await expect(this.lotPreviewToggle).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        const isChecked = await this.lotPreviewToggleSlider.evaluate(el => el.classList.contains('p-inputswitch-checked'));
        if (!isChecked) {
            await this.lotPreviewToggle.click();
            await this.page.waitForTimeout(800);
        }
    }

    /**
     * HELPER — Toggle Lot Preview switch OFF
     */
    protected async disableLotPreviewToggle(): Promise<void> {
        await expect(this.lotPreviewToggle).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        const isChecked = await this.lotPreviewToggleSlider.evaluate(el => el.classList.contains('p-inputswitch-checked'));
        if (isChecked) {
            await this.lotPreviewToggle.click();
            await this.page.waitForTimeout(800);
        }
    }

    /**
     * HELPER — Click on a lot row in Price List by lot name
     */
    protected async clickPriceListLotByName(lotName: string): Promise<void> {
        const row = this.priceListRowByLotName(lotName);
        await expect(row).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await row.click();
        await this.page.waitForTimeout(1000);
    }

    /**
     * HELPER — Assert Lot Preview popup is visible with lot details
     */
    protected async assertLotPreviewPopupVisible(lotName: string): Promise<void> {
        await expect(this.lotPreviewPopup).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.lotPreviewPopupTitle).toContainText(lotName, { timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Click close icon on Lot Preview popup
     */
    protected async closeLotPreviewPopup(): Promise<void> {
        await expect(this.lotPreviewPopupCloseIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotPreviewPopupCloseIcon.click();
        await this.page.waitForTimeout(800);
    }

    /**
 * HELPER — Assert "Lot preview on successfully" toast is visible
 */
    protected async assertLotPreviewToastOn(): Promise<void> {
        await expect(this.lotPreviewToastOn).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
     * HELPER — Assert "Lot preview off successfully" toast is visible
     */
    protected async assertLotPreviewToastOff(): Promise<void> {
        await expect(this.lotPreviewToastOff).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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
        await expect(this.priceListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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
    protected async searchPriceListLot(keyword: string): Promise<void> {
        await expect(this.priceListSearchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.priceListSearchInput.fill(keyword);
    }

    /**
     * HELPER — Assert lot row with given name is visible in Price List
     */
    protected async assertPriceListLotRowExists(lotName: string): Promise<void> {
        const row = this.priceListRowByLotName(lotName);
        await expect(row).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
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
        await expect(this.priceListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.searchPriceListLot(lotName);
        await this.assertPriceListLotRowExists(lotName);
        await this.cleanupAfterProjectTest();
    }

    /**
 * HELPER — Assert "No lots available" message is shown
 */
    protected async assertNoPriceListLotsFound(): Promise<void> {
        await expect(this.priceListNoResultsMessage).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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
        await expect(this.priceListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
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
        await expect(this.priceListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.searchPriceListLot(lotName);
        await this.assertPriceListLotRowExists(lotName);
        await this.clickPriceListSearchCrossIcon();
        await this.assertPriceListSearchInputEmpty();
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_07 — Open filter dropdown for Status column
 */
    async verifyPriceListFilterStatusDropdownOpens(projectName: string = 'Automation'): Promise<void> {
        await this.navigateToProjects();
        await this.clickProjectCardInProjectSection(projectName);
        await this.clickPriceListTab();
        await expect(this.priceListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickPriceListColumnFilterIcon('Status');
        await this.assertPriceListFilterPopupVisible();
        await this.clickPriceListFilterStatusDropdown();
        await expect(this.priceListFilterStatusDropdown).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_08 — Verify single status filter selection
 */
    async verifySingleStatusFilter(
        projectName: string = 'Automation',
        statusToFilter: string = 'For Sale'
    ): Promise<void> {
        await this.navigateToProjects();
        await this.clickProjectCardInProjectSection(projectName);
        await this.clickPriceListTab();
        await expect(this.priceListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickPriceListColumnFilterIcon('Status');
        await this.assertPriceListFilterPopupVisible();
        await this.selectConditionDropdownOptionWithSearch(statusToFilter);
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_09 — Apply multiple status filters in the Price List
     */
    async applyMultipleStatusFiltersInPriceList(
        projectName: string = 'Automation',
        statuses: string[] = ['For Sale', 'Sold']
    ): Promise<void> {
        await this.navigateToProjects();
        await this.clickProjectCardInProjectSection(projectName);
        await this.clickPriceListTab();
        await expect(this.priceListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickPriceListColumnFilterIcon('Status');
        await this.assertPriceListFilterPopupVisible();
        await this.selectMultipleStatusesInFilterPopup(statuses)
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_xx — Use "Select All" in status filter on Price List
     */
    async useSelectAllInStatusFilterOnPriceList(
        projectName: string = 'Automation'
    ): Promise<void> {
        await this.navigateToProjects();
        await this.clickProjectCardInProjectSection(projectName);
        await this.clickPriceListTab();
        await expect(this.priceListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickPriceListColumnFilterIcon('Status');
        await this.assertPriceListFilterPopupVisible();
        await this.selectAllStatusesInFilterPopup();
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_xx — Use "Deselect All" in status filter on Price List
     */
    async useDeselectAllInStatusFilterOnPriceList(
        projectName: string = 'Automation'
    ): Promise<void> {
        await this.navigateToProjects();
        await this.clickProjectCardInProjectSection(projectName);
        await this.clickPriceListTab();
        await expect(this.priceListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickPriceListColumnFilterIcon('Status');
        await this.assertPriceListFilterPopupVisible();
        await this.deselectAllStatusesInFilterPopup();
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_12 — Search inside status dropdown in the Price List
     */
    async searchInsideStatusDropdownInPriceList(
        projectName: string = 'Automation',
        searchTerm: string
    ): Promise<void> {
        await this.navigateToProjects();
        await this.clickProjectCardInProjectSection(projectName);
        await this.clickPriceListTab();
        await expect(this.priceListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickPriceListColumnFilterIcon('Status');
        await this.assertPriceListFilterPopupVisible();
        await this.selectConditionDropdownOptionWithSearch(searchTerm);
        await this.cleanupAfterProjectTest();
    }

    /**
     * TC_13 — Try filtering without selecting any status in the Price List
     */
    async filterWithoutSelectingAnyStatusInPriceList(
        projectName: string = 'Automation'
    ): Promise<void> {
        await this.navigateToProjects();
        await this.clickProjectCardInProjectSection(projectName);
        await this.clickPriceListTab();
        await expect(this.priceListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickPriceListColumnFilterIcon('Status');
        await this.assertPriceListFilterPopupVisible();
        await this.applyFilterButton.click();
        await this.cleanupAfterProjectTest();
    }

    /**
 * TC_14 — Remove a status filter tag
 */
    async verifyRemoveStatusFilterTag(
        projectName: string = 'Automation',
        statusToFilter: string = 'For Sale'
    ): Promise<void> {
        await this.navigateToProjects();
        await this.clickProjectCardInProjectSection(projectName);
        await this.clickPriceListTab();
        await expect(this.priceListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickPriceListColumnFilterIcon('Status');
        await this.assertPriceListFilterPopupVisible();
        await this.selectConditionDropdownOptionWithSearch(statusToFilter);
        await this.removePriceListFilterTag(statusToFilter);
        await this.assertPriceListFilterTagNotVisible(statusToFilter);
        await this.cleanupAfterProjectTest();
    }

    protected get priceListGlobalFilterIcon(): Locator {
        return this.page.locator('app-price-list img[src*="filter_icon"]').first();
    }

    protected get priceListGlobalFilterBar(): Locator {
        return this.page.locator('app-price-list .filtero').first();
    }

    protected priceListGlobalFilterByPlaceholder(placeholder: string): Locator {
        return this.priceListGlobalFilterBar.locator(`re-multiselect[placeholder="${placeholder}"]`).first();
    }

    protected get priceListFilterResetButton(): Locator {
        return this.priceListGlobalFilterBar.getByRole('button', { name: /^\s*reset\s*$/i }).first();
    }

    /**
 * HELPER — Click global filter icon to open the filter bar
 */
    protected async clickPriceListGlobalFilterIcon(): Promise<void> {
        await expect(this.priceListGlobalFilterIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.priceListGlobalFilterIcon.click();
        await this.page.waitForTimeout(800);
    }

    /**
 * TC_15 — Apply Bed filter (1 Bed) from global filter bar
 */
    async verifyBedFilter(
        projectName: string = 'Automation',
        bedValue: string = '1'
    ): Promise<void> {
        await this.navigateToProjects();
        await this.clickProjectCardInProjectSection(projectName);
        await this.clickPriceListTab();
        await expect(this.priceListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickPriceListGlobalFilterIcon();
        await this.openBedDropdown();
        await this.bedDropdownSearchInput.fill(bedValue);
        await this.selectBedByValue(bedValue);
        await this.cleanupAfterProjectTest();
    }

    protected get levelDropdown(): Locator {
        return this.page.locator('app-price-list re-multiselect[placeholder="Level"]').first();
    }

    protected get levelDropdownPanel(): Locator {
        return this.page.locator('re-multiselect[placeholder="Level"] .drop_box').first();
    }

    protected get levelDropdownSearchInput(): Locator {
        return this.levelDropdownPanel.locator('input[placeholder="Search"]').first();
    }

    protected levelDropdownOption(value: string): Locator {
        return this.page.locator('re-multiselect[placeholder="Level"] ul li').filter({ hasText: new RegExp(`^\\s*${value}\\s*$`) }).first();
    }

    protected async openLevelDropdown(): Promise<void> {
        await expect(this.levelDropdown).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.levelDropdown.click();
        await this.page.waitForTimeout(800);
    }

    protected async selectLevelByValue(levelValue: string): Promise<void> {
        const levelOption = this.levelDropdownOption(levelValue);
        await expect(levelOption).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await levelOption.click();
        await this.page.waitForTimeout(700);
    }

    /**
 * TC_16 — Select level filter from dropdown
 */
    async verifyLevelFilter(
        projectName: string = 'Automation',
        levelValue: string = 'Level 16'
    ): Promise<void> {
        await this.navigateToProjects();
        await this.clickProjectCardInProjectSection(projectName);
        await this.clickPriceListTab();
        await expect(this.priceListTableRows.first()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickPriceListGlobalFilterIcon();
        await this.page.waitForTimeout(5000);
        await this.openLevelDropdown();
        await this.levelDropdownSearchInput.fill(levelValue);
        await this.selectLevelByValue(levelValue);
        await this.cleanupAfterProjectTest();
    }

    /**
     * Select multiple levels in the Level filter dropdown
     */
    async selectMultipleLevelsInLevelDropdown(
        projectName: string = 'Automation',
        levelValues: string[]
    ): Promise<void> {
        await this.navigateToProjects();
        await this.clickProjectCardInProjectSection(projectName);
        await this.clickPriceListTab();
        await expect(this.priceListTableRows.first()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickPriceListGlobalFilterIcon();
        await this.page.waitForTimeout(5000);
        await this.openLevelDropdown();
        for (const level of levelValues) {
            await this.levelDropdownSearchInput.fill(level);
            await this.selectLevelByValue(level);
        }
        await this.cleanupAfterProjectTest();
    }

    protected get levelDropdownSelectAllCheckbox(): Locator {
        return this.levelDropdownPanel.locator('label.select_all').first();
    }

    protected get levelDropdownSelectAllInput(): Locator {
        return this.levelDropdownSelectAllCheckbox.locator('input[type="checkbox"]').first();
    }

    protected async clickLevelSelectAll(): Promise<void> {
        await expect(this.levelDropdownSelectAllCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.levelDropdownSelectAllCheckbox.click();
        await this.page.waitForTimeout(500);
    }

    protected async assertLevelSelectAllChecked(): Promise<void> {
        await expect(this.levelDropdownSelectAllInput).toBeChecked({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async assertLevelSelectAllUnchecked(): Promise<void> {
        await expect(this.levelDropdownSelectAllInput).not.toBeChecked({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    /**
 * TC_18 — Use Select All / Deselect All in Level dropdown
 */
    async verifyLevelSelectAllDeselectAll(projectName: string = 'Automation'): Promise<void> {
        await this.navigateToProjects();
        await this.clickProjectCardInProjectSection(projectName);
        await this.clickPriceListTab();
        await expect(this.priceListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickPriceListGlobalFilterIcon();
        await this.page.waitForTimeout(5000);
        await this.openLevelDropdown();
        await expect(this.levelDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickLevelSelectAll();
        await this.assertLevelSelectAllChecked();
        await this.clickLevelSelectAll();
        await this.assertLevelSelectAllUnchecked();
        await this.cleanupAfterProjectTest();
    }

    /**
     * Selects an invalid bed option in the bed dropdown and asserts expected outcome
     */
    async selectInvalidBedOption(projectName: string, invalidBed: string): Promise<void> {
        await this.navigateToProjects();
        await this.clickProjectCardInProjectSection(projectName);
        await this.clickPriceListTab();
        await expect(this.priceListTable).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.clickPriceListGlobalFilterIcon();
        await this.openBedDropdown();
        await this.bedDropdownSearchInput.fill(invalidBed);
        await this.cleanupAfterProjectTest();
    }




    protected get applyFilterButton(): Locator {
        return this.filterPopup.getByRole('button', { name: /apply/i });
    }

    protected get bedDropdownSearchInput(): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]').locator('.drop_box .inpt input');
    }

    protected get lotPreviewPopupCloseIcon(): Locator {
        return this.page.locator('.confirmation-dialog-header img[src*="Close_square"]').first();
    }

    protected get lotPreviewPopupTitle(): Locator {
        return this.page.locator('.confirmation-dialog-header p.f-24').first();
    }

    protected get lotPreviewToggleSlider(): Locator {
        return this.lotPreviewToggle.locator('.p-inputswitch').first();
    }

    protected get priceListNoResultsMessage(): Locator {
        return this.page.locator('app-price-list td').filter({ hasText: /^\s*No lots available\s*$/i }).first();
    }

    protected get priceListSearchInput(): Locator {
        return this.page.locator('app-price-list input[placeholder="Search"]').first();
    }

    protected get priceListTable(): Locator {
        return this.page.locator('app-price-list table, p-table table').first();
    }

    protected get priceListTableRows(): Locator {
        return this.priceListTable.locator('tbody tr');
    }



    protected async assertPriceListFilterPopupVisible(): Promise<void> {
        await expect(this.priceListFilterPopup).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async assertPriceListFilterTagNotVisible(value: string): Promise<void> {
        await expect(this.priceListFilterSelectedTag(value)).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async assertPriceListSearchInputEmpty(): Promise<void> {
        await expect(this.priceListSearchInput).toHaveValue('', { timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async clickPriceListColumnFilterIcon(columnName: string): Promise<void> {
        const filterIcon = this.priceListColumnFilterIcon(columnName);
        await expect(filterIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });

        // Double-click pattern (PrimeNG OverlayPanel requirement)
        await filterIcon.click();
        await this.page.waitForTimeout(700);
        await filterIcon.click();
        await this.page.waitForTimeout(1000);
    }

    protected async clickPriceListFilterStatusDropdown(): Promise<void> {
        await expect(this.priceListFilterStatusDropdown).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.priceListFilterStatusDropdown.click();
        await this.page.waitForTimeout(800);
    }

    protected async clickPriceListSearchCrossIcon(): Promise<void> {
        await expect(this.priceListSearchCrossIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.priceListSearchCrossIcon.click();
        await this.page.waitForTimeout(800);
    }

    protected async clickPriceListTab(): Promise<void> {
        await expect(this.priceListTab).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.priceListTab.click();
    }

    protected async deselectAllStatusesInFilterPopup(): Promise<void> {
        // Open the filterConditionDropdown, which shows the filter popup.
        await this.filterConditionDropdown.click();
        const searchBox = this.searchBoxInFilterPopup;
        await expect(searchBox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.selectAllInFilterPopup();
        await this.page.waitForTimeout(500);
        await this.selectAllInFilterPopup();
    }

    protected async getRecordsCountText(): Promise<string> {
        await expect(this.lotRecordsCount).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        const text = (await this.lotRecordsCount.innerText()).trim();
        console.log(text);
        return text;
    }

    protected get lotPreviewPopup(): Locator {
        return this.page.locator('.confirmation-dialog-body, .unit-detail-popup').first();
    }

    protected get lotPreviewToastOff(): Locator {
        return this.page.locator('div[role="alert"].toast-message').filter({ hasText: /lot preview off successfully/i }).first();
    }

    protected get lotPreviewToastOn(): Locator {
        return this.page.locator('div[role="alert"].toast-message').filter({ hasText: /lot preview on successfully/i }).first();
    }

    protected get lotPreviewToggle(): Locator {
        return this.page.locator('app-price-list p-inputswitch').first();
    }

    protected async openBedDropdown(): Promise<void> {
        await expect(this.bedDropdownInLot).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.bedDropdownInLot.click();
        await expect(this.bedDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected get priceListFilterStatusDropdown(): Locator {
        return this.priceListFilterPopup.locator('re-multiselect, ng-select').first();
    }

    protected priceListRowByLotName(lotName: string): Locator {
        return this.priceListTableRows.filter({ hasText: lotName }).first();
    }

    protected async removePriceListFilterTag(value: string): Promise<void> {
        const removeIcon = this.priceListFilterTagRemoveIcon(value);
        await expect(removeIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await removeIcon.click();
        await this.page.waitForTimeout(800);
    }

    protected async selectAllStatusesInFilterPopup(): Promise<void> {
        // Open the filterConditionDropdown, which shows the filter popup.
        await this.filterConditionDropdown.click();
        const searchBox = this.searchBoxInFilterPopup;
        await expect(searchBox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.selectAllInFilterPopup();
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

    protected async selectConditionDropdownOptionWithSearch(searchTerm: string): Promise<void> {
        await this.filterConditionDropdown.click();
        const searchBox = this.searchBoxInFilterPopup;
        await expect(searchBox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await searchBox.click();
        await searchBox.fill(searchTerm);
        const optionLocator = this.optionInFilterPopup(searchTerm);
        await expect(optionLocator).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await optionLocator.click();
        await expect(this.filterConditionDropdown).toHaveText(
            new RegExp(searchTerm, 'i'),
            { timeout: ProjectBasePage.TIMEOUT_DEFAULT }
        );

        await this.filterByTasksRemoveIcon.click();
    }

    protected async selectMultipleStatusesInFilterPopup(statuses: string[]): Promise<void> {
        // Ensure the filter popup and search box are visible
        await this.filterConditionDropdown.click();
        const searchBox = this.searchBoxInFilterPopup;
        await expect(searchBox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await searchBox.click();

        for (const status of statuses) {
            await searchBox.fill(status);
            const optionLocator = this.optionInFilterPopup(status);
            await expect(optionLocator).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
            await optionLocator.click();
        }
    }



    protected get bedDropdownInLot(): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]').locator('.box');
    }

    protected get bedDropdownOptions(): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]').locator('.drop_box ul li.p-element');
    }

    protected get bedDropdownPanel(): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]').locator('.drop_box');
    }

    protected get filterByTasksRemoveIcon(): Locator {
        return this.page.locator('.filter-by-tasks > re-multiselect > .box > .tags > .fas');
    }

    protected get filterConditionDropdown(): Locator {
        return this.lotListFilterPopup.locator('re-multiselect').first();
    }

    protected get filterPopup(): Locator {
        return this.page.getByRole('dialog');
    }

    protected optionInFilterPopup(option: string): Locator {
        return this.page
            .getByRole('dialog')
            .locator('li')
            .filter({ hasText: option });
    }

    protected priceListColumnFilterIcon(columnName: string): Locator {
        return this.page.locator(`app-price-list th:has-text("${columnName}") img[alt="filter"]`).first();
    }

    protected get priceListFilterPopup(): Locator {
        return this.page.locator('div.p-overlaypanel').first();
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

    protected get priceListSearchCrossIcon(): Locator {
        return this.page.locator('app-price-list i.pi-times._cross-icon').first();
    }

    protected get pricelistTab(): Locator {
        return this.page.locator('a[href*="/price-list"]', { hasText: /Price List/i });
    }

    get searchBoxInFilterPopup(): Locator {
        return this.page.locator('input[placeholder="Search"]').last();
    }

    protected async selectAllInFilterPopup(): Promise<void> {
        const selectAllCheckbox = this.selectAllCheckboxInFilterPopup;
        await expect(selectAllCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await selectAllCheckbox.click();
    }



    protected get lotListFilterPopup(): Locator {
        return this.page.locator('div.p-overlaypanel').first();
    }

    protected get selectAllCheckboxInFilterPopup(): Locator {
        return this.page.locator('div.checkbox__checkmark').first();
    }


    protected get priceListTab(): Locator {
        return this.page.locator('a, button, li').filter({ hasText: /^\s*Price List\s*$/i }).first();
    }
}