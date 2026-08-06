import { Page, expect } from '@playwright/test';
import { BasePage } from '../common/BasePage';
import { ListingLocators } from './ListingLocators';

export abstract class ListingBasePage extends BasePage {
    protected readonly locators: ListingLocators;

    constructor(page: Page) {
        super(page);
        this.locators = new ListingLocators(page);
    }

    /**
     * Navigates to the Listings tab and asserts its visibility quickly.
     */
    async navigateToListings() {
        const currentUrl = this.page.url().split(/[?#]/)[0];
        if (!currentUrl.endsWith('/listings/listing-properties')) {
            await this.page.goto('/listings/listing-properties');
        }
    }

    async closeModalIfVisible() {
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    async navigateToContracts() {
        const contracts = this.page.locator('li[data-label="Contracts"]');
        await expect(contracts).toBeVisible({ timeout: 30000 });
        await contracts.click({ force: true });
    }

    async navigateToProperties() {
        const PropertyTab = this.page.getByRole('link', { name: 'Properties' });
        await PropertyTab.waitFor({ state: 'visible', timeout: 20000 });
        await PropertyTab.click({ force: true });
        const firstPropertyCard = this.page.locator('.s-property').first();
        await expect(firstPropertyCard).toBeVisible({ timeout: 40000 });
    }

    // Common function for returning rows locator
    protected getRowsLocator() {
        return this.page.locator('tr');
    }

    // Function for returning rows count
    protected async getRowsCount() {
        return await this.getRowsLocator().count();
    }

    // Waits for table loaded, header row visible and at least one data row
    protected async waitForTableRows(minRows: number = 2, rowTimeout = 30000) {
        const rows = this.getRowsLocator();
        await expect(rows.nth(0)).toBeVisible({ timeout: rowTimeout });
        const count = await this.getRowsCount();
        if (count < minRows) {
            throw new Error('No data rows are visible in the table.');
        }
        for (let i = 1; i < count; ++i) {
            await expect(rows.nth(i)).toBeVisible({ timeout: 10000 });
        }
        return count;
    }

    protected async searchListing(keyword: string) {
        const searchBox = this.locators.SearchBox();
        await expect(searchBox).toBeVisible();
        await searchBox.click();
        await searchBox.fill(keyword);
        await this.page.keyboard.press('Enter');
    }

    protected async verifySearchResults(keyword: string) {
        const searchBox = this.locators.SearchBox();
        await expect(searchBox).toBeVisible({ timeout: 1000 });
        await expect(searchBox).toHaveValue(keyword);

        const resultsWithKeyword = this.page.locator(`tr:has-text("${keyword}"), li:has-text("${keyword}"), div:has-text("${keyword}")`);
        const count = await resultsWithKeyword.count();
        const noResults = this.page.locator('text="No results found"');
        await expect(noResults).toHaveCount(0);
    }

    protected async openPropertyTypeDropdown() {
        const dropdown = this.locators.propertyTypeDropdown();
        await expect(dropdown).toBeVisible();
        await dropdown.click({ force: true });
    }

    protected async searchPropertyType(type: string) {
        const searchInput = this.locators.propertyTypeSearchInput();
        await expect(searchInput).toBeVisible();
        await searchInput.click({ force: true });
        await searchInput.fill('');
        await searchInput.fill(type);
    }

    protected async selectPropertyTypeOption(type: string) {
        const option = this.locators.propertyTypeOption(type);
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click({ force: true });
    }

    protected async selectAllPropertyTypes() {
        const dropdown = this.locators.propertyTypeDropdown();
        await dropdown.click();
        const selectAll = this.locators.propertyTypeSelectAll();
        await selectAll.click();
    }

    // Protected functions for "Select By Agent" filter

    protected async openSelectByAgentDropdown() {
        const dropdown = this.locators.selectByAgentDropdown();
        await expect(dropdown).toBeVisible({ timeout: 3000 });
        await dropdown.click({ force: true });
    }

    protected async searchSelectByAgent(name: string) {
        const searchInput = this.locators.selectByAgentSearchInput()
        await expect(searchInput).toBeVisible();
        await searchInput.click({ force: true });
        await searchInput.fill('');
        await searchInput.fill(name);
    }

    protected async selectSelectByAgentOption(agentName: string) {
        const option = this.locators.selectByAgentOption(agentName);
        await expect(option).toBeVisible({ timeout: 10000 });
        await option.click({ force: true });
    }

    protected async selectAllSelectByAgent() {
        await this.openSelectByAgentDropdown();
        const selectAllCheckbox = this.locators.selectByAgentSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible();
        await selectAllCheckbox.click({ force: true });
    }

    protected async deselectAllSelectByAgent() {
        await this.openSelectByAgentDropdown();
        const selectAllCheckbox = this.locators.selectByAgentSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible();
        await selectAllCheckbox.click({ force: true });
    }

    // Protected functions for "Contract Status" filter
    protected async openContractStatusDropdown() {
        const dropdown = this.locators.contractStatusDropdown();
        await expect(dropdown).toBeVisible({ timeout: 3000 });
        await dropdown.click({ force: true });
    }

    protected async selectAllContractStatuses() {
        await this.openContractStatusDropdown();
        const selectAllCheckbox = this.locators.contractStatusSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible();
        await selectAllCheckbox.click({ force: true });
    }

    protected async deselectAllContractStatuses() {
        await this.openContractStatusDropdown();
        const selectAllCheckbox = this.locators.contractStatusSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible();
        await selectAllCheckbox.click({ force: true });
    }

    protected async searchContractStatus(status: string) {
        const searchInput = this.locators.contractStatusSearchInput();
        await expect(searchInput).toBeVisible();
        await searchInput.click({ force: true });
        await searchInput.fill('');
        await searchInput.fill(status);
    }

    protected async selectContractStatusOption(status: string) {
        const option = this.locators.contractStatusOption(status);
        await expect(option).toBeVisible({ timeout: 10000 });
        await option.click({ force: true });
    }


    // Protected functions for "Listing Creation Date" filter

    protected async openListingCreationDateDropdown() {
        const dropdown = this.locators.listingCreationDateDropdown();
        await expect(dropdown).toBeVisible({ timeout: 3000 });
        await dropdown.click({ force: true });
    }

    protected async searchListingCreationDate(searchText: string) {
        const searchInput = this.locators.listingCreationDateSearchInput();
        await expect(searchInput).toBeVisible();
        await searchInput.click({ force: true });
        await searchInput.fill('');
        await searchInput.fill(searchText);
    }

    protected async selectListingCreationDateOption(label: string) {
        const option = this.locators.listingCreationDateOption(label);
        await expect(option).toBeVisible({ timeout: 10000 });
        await option.click({ force: true });
    }

    protected async selectAllListingCreationDates() {
        await this.openListingCreationDateDropdown();
        const selectAllCheckbox = this.locators.listingCreationDateSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible();
        await selectAllCheckbox.click({ force: true });
    }

    protected async deselectAllListingCreationDates() {
        await this.openListingCreationDateDropdown();
        const selectAllCheckbox = this.locators.listingCreationDateSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible();
        await selectAllCheckbox.click({ force: true });
    }

    public async resetFilters() {
        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeVisible({ timeout: 10000 });
        await expect(resetButton).toBeEnabled();
        await resetButton.click({ force: true });
    }


    //*************************************View Switching *************************************//

    protected async openFirstListingCard(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await firstCard.waitFor({ state: 'visible', timeout: 30000 });
        await firstCard.click();
    }

    async switchToGridView() {
        await this.navigateToListings();
        const cardRows = this.locators.cardViewPropertyRow();
        if (await cardRows.first().isVisible().catch(() => false)) {
            return;
        }
        const gridViewBtn = this.page.locator('img.grid-svg-image');
        await gridViewBtn.click();
        await cardRows.first().waitFor({ state: 'visible', timeout: 30000 });
    }

    //// Switching to list view
    async switchToListView() {
        await this.navigateToListings();
        const tableRows = this.page.locator('tbody tr');

        // If table rows are already visible, assume list view is selected and return early
        if (await tableRows.first().isVisible().catch(() => false)) {
            return;
        }
        const listViewButton = this.page.getByRole('link').nth(4);
        await listViewButton.click();
        await this.waitForTableRows();
    }
}
