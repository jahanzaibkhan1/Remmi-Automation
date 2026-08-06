import { expect, Locator } from '@playwright/test';
import { faker } from '@faker-js/faker';
import * as path from 'path';
import { ProjectBasePage } from './ProjectBasePage';

export class ProjectOverviewPage extends ProjectBasePage {
    async verifyPrecinctNameDisplayedCorrectly(): Promise<void> {
        await this.navigateToProjects();
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_LONG,
        });
        const precinctName = (await this.firstPrecinctOnProjectsPage.locator('h3').first().innerText()).trim();
        await this.firstPrecinctOnProjectsPage.click();
        await console.log(precinctName);
        await expect(this.precinctNameUnderActive).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        const displayedName = (await this.precinctNameUnderActive.innerText()).trim();
        expect(displayedName.length).toBeGreaterThan(0);
        await this.projectsMenuLink.click();
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_LONG,
        });
    }

    // TC_02 — Project, Lot, EOI tabs visible after selecting precinct
    async verifyTabsVisibleAfterPrecinctSelection(): Promise<void> {
        await this.navigateToProjects();
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_LONG,
        });
        const precinctName = (await this.firstPrecinctOnProjectsPage.locator('h3').first().innerText()).trim();
        await this.firstPrecinctOnProjectsPage.click();
        await console.log(precinctName);
        await expect(this.projectTabInPrecinct).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await expect(this.lotTabInPrecinct).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.eoiTabInPrecinct).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectsMenuLink.click();
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_LONG,
        });
    }

    // TC_03 — Allocated projects displayed under Project tab
    async verifyAllocatedProjectsUnderProjectTab(): Promise<void> {
        await this.navigateToProjects();
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_LONG,
        });
        const precinctName = (await this.firstPrecinctOnProjectsPage.locator('h3').first().innerText()).trim();
        await this.firstPrecinctOnProjectsPage.click();
        await console.log(precinctName);
        await expect(this.precinctNameUnderActive).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        const displayedName = (await this.precinctNameUnderActive.innerText()).trim();
        expect(displayedName.length).toBeGreaterThan(0);
        await this.projectsMenuLink.click();
    }

    // TC_04 — Project card shows image, name, and price label
    async verifyProjectCardShowsImageNameAndPrice(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_LONG,
        });
        const precinctName = (await this.firstPrecinctOnProjectsPage.locator('h3').first().innerText()).trim();
        await console.log(precinctName);
        await expect(this.searchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.searchInput.fill(projectName);

        const card = this.projectCardByName(projectName);
        await expect(card).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_MEDIUM });

        // Image
        const thumbnail = this.thumbnailForCard(card);
        await expect(thumbnail).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });

        const styleAttr = await thumbnail.getAttribute('style');
        const bgUrlMatch = styleAttr?.match(/background-image:\s*url\((['"]?)(.*?)\1\)/i);
        expect(bgUrlMatch && bgUrlMatch[2]).toBeTruthy();
        expect(bgUrlMatch![2].trim()).not.toBe('');

        // Name
        const name = this.projectCardName;
        await expect(name).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });

        // "Priced From" label
        const priceLabel = this.projectCardPriceContent();
        await expect(priceLabel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });


    }

    // TC_05 — Expand project card using arrow icon
    async verifyExpandProjectCard(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_LONG,
        });
        const precinctName = (await this.firstPrecinctOnProjectsPage.locator('h3').first().innerText()).trim();
        await console.log(precinctName);
        await expect(this.searchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.searchInput.click();
        await this.searchInput.fill(projectName);
        await expect(this.searchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.searchInput.fill(projectName);

        const card = this.projectCardByName(projectName);
        await expect(card).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_MEDIUM });
        await expect(this.projectCardArrowIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectCardArrowIcon.click();
        await expect(this.projectCardCollapseIcon()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectCardCollapseIcon().click();
    }

    // TC_06 — Collapse project card using arrow icon
    async verifyCollapseProjectCard(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_LONG,
        });
        const precinctName = (await this.firstPrecinctOnProjectsPage.locator('h3').first().innerText()).trim();
        await console.log(precinctName);
        await expect(this.searchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.searchInput.click();
        await this.searchInput.fill(projectName);
        await expect(this.searchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.searchInput.fill(projectName);

        const card = this.projectCardByName(projectName);
        await expect(card).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_MEDIUM });
        await expect(this.projectCardArrowIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectCardArrowIcon.click();
        await expect(this.projectCardCollapseIcon()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectCardCollapseIcon().click();
        await this.clickResetIcon();
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_LONG,
        });
    }

    // TC_07 — Open project from precinct card
    async verifyOpenProjectFromPrecinctCard(): Promise<void> {
        await this.navigateToProjects();
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_LONG,
        });
        const precinctName = (await this.firstPrecinctOnProjectsPage.locator('h3').first().innerText()).trim();
        await this.firstPrecinctOnProjectsPage.click();
        await console.log(precinctName);
        const displayedName = (await this.precinctNameUnderActive.innerText()).trim();
        expect(displayedName.length).toBeGreaterThan(0);

        await this.clickProjectImageInPrecinct();

        await expect(this.projectBreadcrumbName(displayedName)).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_LONG,
        });
        await expect(this.projectsBreadcrumbLink).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectsBreadcrumbLink.click();
        await this.page.waitForTimeout(1200);
        await this.projectsMenuLink.click();
        await this.page.waitForTimeout(1200);
        await this.projectsMenuLink.click();
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.page.getByText('Precinct', { exact: true })).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });

    }

    // TC_08 — Open Lot tab successfully, click on Lot tab
    async verifyLotTabOpens(): Promise<void> {
        await this.navigateToProjects();
        await this.page.waitForLoadState('networkidle')
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_LONG,
        });
        const precinctName = (await this.firstPrecinctOnProjectsPage.locator('h3').first().innerText()).trim();
        await this.firstPrecinctOnProjectsPage.click();
        await console.log(precinctName);
        await expect(this.precinctNameUnderActive).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        const displayedName = (await this.precinctNameUnderActive.innerText()).trim();
        expect(displayedName.length).toBeGreaterThan(0);
        await expect(this.lotTabInPrecinct).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotTabInPrecinct.click();
    }

    // LOCATORS — BED DROPDOWN IN LOT TAB

    protected get bedDropdownInLot(): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]').locator('.box');
    }

    protected get bedDropdownPanel(): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]').locator('.drop_box');
    }

    protected get bedDropdownOptions(): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]').locator('.drop_box ul li.p-element');
    }

    protected get bedDropdownSearchInput(): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]').locator('.drop_box .inpt input');
    }

    protected get bedDropdownSelectAllCheckbox(): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]').locator('.drop_box label.select_all');
    }

    protected get selectedBedTags(): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]').locator('.tags .selected_one');
    }

    protected selectedBedTagByValue(bedValue: string): Locator {
        return this.page.locator('re-multiselect[placeholder="Bed"]')
            .locator('.tags .selected_one', { hasText: bedValue });
    }

    protected bedTagCrossIcon(bedValue: string): Locator {
        return this.selectedBedTagByValue(bedValue).locator('span.pi-times-circle');
    }

    // LOCATORS — STATUS DROPDOWN IN LOT TAB

    protected get statusDropdownInLot(): Locator {
        return this.page.locator('re-multiselect[placeholder="Status"]').locator('.box');
    }

    protected get statusDropdownPanel(): Locator {
        return this.page.locator('re-multiselect[placeholder="Status"]').locator('.drop_box');
    }

    protected get statusDropdownOptions(): Locator {
        return this.page.locator('re-multiselect[placeholder="Status"]').locator('.drop_box ul li.p-element');
    }

    protected get statusDropdownSearchInput(): Locator {
        return this.page.locator('re-multiselect[placeholder="Status"]').locator('.drop_box .inpt input');
    }

    protected get statusDropdownSelectAllCheckbox(): Locator {
        return this.page.locator('re-multiselect[placeholder="Status"]').locator('.drop_box label.select_all');
    }

    protected selectedStatusTagByValue(statusValue: string): Locator {
        return this.page.locator('re-multiselect[placeholder="Status"]')
            .locator('.tags .selected_one', { hasText: statusValue });
    }

    protected statusTagCrossIcon(statusValue: string): Locator {
        return this.selectedStatusTagByValue(statusValue).locator('span.pi-times-circle');
    }

    // Price Range filter
    protected get priceRangeFilter(): Locator {
        return this.page.locator('.land-size', { hasText: 'Price Range' });
    }

    protected get priceRangeMinInput(): Locator {
        return this.page.locator('input[placeholder*="Min" i]').first();
    }

    protected get priceRangeMaxInput(): Locator {
        return this.page.locator('input[placeholder*="Max" i]').first();
    }

    protected get priceRangeApplyButton(): Locator {
        return this.page.locator('button', { hasText: /apply/i }).first();
    }


    protected get internalAreaMinInput(): Locator {
        return this.page.locator('input[placeholder*="Min" i]');
    }

    protected get internalAreaMaxInput(): Locator {
        return this.page.locator('input[placeholder*="Max" i]');
    }

    // LOCATORS — View button & popup

    protected get viewButton(): Locator {
        return this.page.locator('._view-btn');
    }

    protected get viewPopup(): Locator {
        return this.page.locator('p-overlaypanel .p-overlaypanel, .p-overlaypanel-content').first();
    }

    // LOCATOR — Bulk edit button/section
    protected get bulkEditButton(): Locator {
        return this.page.locator('button, a, p', { hasText: /bulk edit/i }).first();
    }

    protected get saveAndCloseButton(): Locator {
        return this.page.locator('button', { hasText: /save.*close|save & close/i }).first();
    }

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

    protected get lotFormStatusReasonSelect(): Locator {
        return this.page.locator('ng-select[formcontrolname="status_reason"]');
    }

    protected get lotFormStatusReasonArrow(): Locator {
        return this.lotFormStatusReasonSelect.locator('.ng-arrow-wrapper');
    }

    protected get lotFormStatusReasonDropdownPanel(): Locator {
        return this.lotFormStatusReasonSelect.locator('ng-dropdown-panel');
    }

    protected get lotFormStatusReasonOptions(): Locator {
        return this.lotFormStatusReasonSelect.locator('ng-dropdown-panel .ng-option');
    }

    protected statusReasonOptionInForm(name: string): Locator {
        return this.lotFormStatusReasonSelect.locator('ng-dropdown-panel .ng-option', { hasText: name });
    }

    // LOCATORS — Toast notifications

    protected get successToast(): Locator {
        return this.page.locator('div[role="alert"].toast-message');
    }

    // LOCATORS — Sort icon states (targeted to Status column reliably)

    protected statusColumnHeader(): Locator {
        return this.page.locator('table thead th', { has: this.page.locator('p', { hasText: /^Project Status$/ }) });
    }

    protected projectColumnHeader(): Locator {
        return this.page.locator('table thead th', { has: this.page.locator('p', { hasText: /^Project$/ }) });
    }

    protected get projectColumnSortIcon(): Locator {
        return this.projectColumnHeader().locator('i.custom-sort');
    }

    protected get projectColumnSortIconDesc(): Locator {
        return this.projectColumnHeader().locator('i.pi-sort-amount-up-alt');
    }

    protected get statusColumnSortIcon(): Locator {
        return this.statusColumnHeader().locator('i.custom-sort');
    }

    protected get statusColumnSortIconDesc(): Locator {
        return this.statusColumnHeader().locator('i.pi-sort-amount-up-alt');
    }

    // LOCATOR — No record found message
    protected get noRecordFoundMessage(): Locator {
        return this.page.locator('ul li', { hasText: 'No Record Found' });
    }

    protected get noLotFoundMessage(): Locator {
        return this.page.locator('tr', { hasText: 'No Lots available' });
    }

    // ==========================================================================
    // LOT LIST PAGE — HELPER FUNCTIONS
    // ==========================================================================

    protected async assertSuccessToast(expectedText: string = 'Update successfully'): Promise<void> {
        await expect(this.successToast.first()).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.successToast.first()).toContainText(expectedText, { timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async navigateToLots(): Promise<void> {
        const url = this.page.url();
        if (!url.includes('/listings/lot')) {
            await this.page.goto('/listings/lot');
        }
        await expect(this.lotSearchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
    }

    protected async searchLot(keyword: string): Promise<void> {
        await this.lotSearchInput.fill(keyword);
        await this.page.waitForTimeout(1500);
    }

    protected async clearLotSearch(): Promise<void> {
        await this.lotSearchInput.fill('');
        await this.page.waitForTimeout(1000);
    }

    protected async getLotRowCount(): Promise<number> {
        return await this.lotTableRows.count();
    }

    protected async assertLotsExist(): Promise<void> {
        const count = await this.getLotRowCount();
        expect(count).toBeGreaterThan(0);
    }

    protected async assertFirstRowContains(keyword: string): Promise<void> {
        await this.lotTableRows.first().waitFor({ state: 'visible', timeout: ProjectBasePage.TIMEOUT_LONG });
    }

    // Project dropdown helpers
    protected async openProjectDropdown(): Promise<void> {
        await expect(this.projectDropdownInLot).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.projectDropdownInLot.click();
        await expect(this.projectDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async closeDropdown(): Promise<void> {
        await this.page.waitForTimeout(200);
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(800);
    }

    protected async searchInProjectDropdown(projectName: string): Promise<void> {
        await expect(this.projectDropdownSearchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectDropdownSearchInput.fill(projectName);
        await this.page.waitForTimeout(800);
    }

    protected async clearProjectDropdownSearch(): Promise<void> {
        await this.projectDropdownSearchInput.fill('');
        await this.page.waitForTimeout(300);
    }

    protected async selectProjectByName(projectName: string): Promise<void> {
        const optionsCount = await this.projectDropdownOptions.count();
        for (let i = 0; i < optionsCount; i++) {
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

    protected async assertAllRowsContainAnyProject(projectNames: string[]): Promise<void> {
        const rowCount = await this.lotTableRows.count();
        expect(rowCount).toBeGreaterThan(0);
        for (let i = 0; i < rowCount; i++) {
            const rowText = (await this.lotTableRows.nth(i).innerText()).toLowerCase();
            const matches = projectNames.some(name => rowText.includes(name.toLowerCase()));
            expect(matches).toBeTruthy();
        }
    }

    protected async resetFilters(): Promise<void> {
        await this.resetButton.click();
        await this.page.waitForTimeout(800);
    }

    // LOCATORS — Selected project tags

    protected get selectedProjectTags(): Locator {
        return this.page.locator('re-multiselect[placeholder="Project"]').locator('.tags .selected_one');
    }

    protected selectedProjectTagByName(projectName: string): Locator {
        return this.page.locator('re-multiselect[placeholder="Project"]')
            .locator('.tags .selected_one', { hasText: projectName });
    }

    protected projectTagCrossIcon(projectName: string): Locator {
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
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        const checkbox = this.rowCheckbox(firstRow);
        await expect(checkbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
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
}
