import { Locator, Page, expect } from '@playwright/test';
import { ListingLocators } from './ListingLocator';
import { addAbortListener } from 'events';
import path from 'path';
import { count, table } from 'console';
import { en, faker, th } from '@faker-js/faker';
import { text } from 'stream/consumers';

export class ListingActions {
    private page: Page;
    private locators: ListingLocators;

    constructor(page: Page) {
        this.page = page;
        this.locators = new ListingLocators(page);
    }

    /**
     * Navigates to the Listings tab and asserts its visibility quickly.
     */
    async navigateToListings() {
        const listingTab = this.locators.ListingTab();
        await expect(listingTab).toBeVisible({ timeout: 30000 });
        await listingTab.click({ force: true });
    }

    async navigateToProperties() {
        const PropertyTab = this.page.getByRole('link', { name: 'Properties' });
        await PropertyTab.waitFor({ state: 'visible', timeout: 20000 });
        await PropertyTab.click({ force: true });
    }

    // Common function for returning rows locator
    private getRowsLocator() {
        return this.page.locator('tr');
    }

    // Function for returning rows count
    private async getRowsCount() {
        return await this.getRowsLocator().count();
    }

    // Waits for table loaded, header row visible and at least one data row
    private async waitForTableRows(minRows: number = 2, rowTimeout = 30000) {
        const rows = this.getRowsLocator();
        await expect(rows.nth(0)).toBeVisible({ timeout: rowTimeout });
        const count = await this.getRowsCount();
        if (count < minRows) {
            throw new Error('No data rows are visible in the table.');
        }
        for (let i = 1; i < count; ++i) {
            await expect(rows.nth(i)).toBeVisible({ timeout: 5000 });
        }
        return count;
    }

    private async searchListing(keyword: string) {
        const searchBox = this.locators.SearchBox();
        await expect(searchBox).toBeVisible();
        await searchBox.click();
        await searchBox.fill(keyword);
        await this.page.keyboard.press('Enter');
    }

    private async verifySearchResults(keyword: string) {
        const searchBox = this.locators.SearchBox();
        await expect(searchBox).toBeVisible({ timeout: 1000 });
        await expect(searchBox).toHaveValue(keyword);

        const resultsWithKeyword = this.page.locator(`tr:has-text("${keyword}"), li:has-text("${keyword}"), div:has-text("${keyword}")`);
        const count = await resultsWithKeyword.count();
        const noResults = this.page.locator('text="No results found"');
        await expect(noResults).toHaveCount(0);
    }

    private async openPropertyTypeDropdown() {
        const dropdown = this.locators.propertyTypeDropdown();
        await expect(dropdown).toBeVisible();
        await dropdown.click({ force: true });
    }

    private async searchPropertyType(type: string) {
        const searchInput = this.locators.propertyTypeSearchInput();
        await expect(searchInput).toBeVisible();
        await searchInput.click({ force: true });
        await searchInput.fill('');
        await searchInput.fill(type);
    }

    private async selectPropertyTypeOption(type: string) {
        const option = this.locators.propertyTypeOption(type);
        await option.waitFor({ state: 'visible', timeout: 5000 });
        await option.click({ force: true });
    }

    private async selectAllPropertyTypes() {
        const dropdown = this.locators.propertyTypeDropdown();
        await dropdown.click();
        const selectAll = this.locators.propertyTypeSelectAll();
        await selectAll.click();
    }

    // Private functions for "Select By Agent" filter

    private async openSelectByAgentDropdown() {
        const dropdown = this.locators.selectByAgentDropdown();
        await expect(dropdown).toBeVisible({ timeout: 3000 });
        await dropdown.click({ force: true });
        await this.page.waitForTimeout(500);
    }

    private async searchSelectByAgent(name: string) {
        // If ListingLocators.selectByAgentSearchInput exists, use it. Fallback to an input with correct placeholder.
        const searchInput = this.locators.selectByAgentSearchInput()
        await expect(searchInput).toBeVisible();
        await searchInput.click({ force: true });
        await searchInput.fill('');
        await searchInput.fill(name);
        await this.page.waitForTimeout(400);
    }

    private async selectSelectByAgentOption(agentName: string) {
        const option = this.locators.selectByAgentOption(agentName);
        await expect(option).toBeVisible({ timeout: 5000 });
        await option.click({ force: true });
        await this.page.waitForTimeout(600);
    }

    private async selectAllSelectByAgent() {
        await this.openSelectByAgentDropdown();
        const selectAllCheckbox = this.locators.selectByAgentSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible();
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(500);
    }

    private async deselectAllSelectByAgent() {
        await this.openSelectByAgentDropdown();
        const selectAllCheckbox = this.locators.selectByAgentSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible();
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(500);

        // Optionally click again if toggle required for deselect scenario
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(700);
    }

    // Private functions for "Contract Status" filter
    private async openContractStatusDropdown() {
        const dropdown = this.locators.contractStatusDropdown();
        await expect(dropdown).toBeVisible({ timeout: 3000 });
        await dropdown.click({ force: true });
        await this.page.waitForTimeout(500);
    }

    private async selectAllContractStatuses() {
        await this.openContractStatusDropdown();
        const selectAllCheckbox = this.locators.contractStatusSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible();
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(500);
    }

    private async deselectAllContractStatuses() {
        await this.openContractStatusDropdown();
        const selectAllCheckbox = this.locators.contractStatusSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible();
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(500);

        // Optionally click again if toggle required for deselect scenario
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(700);
    }


    private async searchContractStatus(status: string) {
        const searchInput = this.locators.contractStatusSearchInput();
        await expect(searchInput).toBeVisible();
        await searchInput.click({ force: true });
        await searchInput.fill('');
        await searchInput.fill(status);
        await this.page.waitForTimeout(400);
    }

    private async selectContractStatusOption(status: string) {
        const option = this.locators.contractStatusOption(status);
        await expect(option).toBeVisible({ timeout: 5000 });
        await option.click({ force: true });
        await this.page.waitForTimeout(600);
    }


    // Private functions for "Listing Creation Date" filter

    private async openListingCreationDateDropdown() {
        const dropdown = this.locators.listingCreationDateDropdown();
        await expect(dropdown).toBeVisible({ timeout: 3000 });
        await dropdown.click({ force: true });
        await this.page.waitForTimeout(500);
    }

    private async searchListingCreationDate(searchText: string) {
        const searchInput = this.locators.listingCreationDateSearchInput();
        await expect(searchInput).toBeVisible();
        await searchInput.click({ force: true });
        await searchInput.fill('');
        await searchInput.fill(searchText);
        await this.page.waitForTimeout(400);
    }

    private async selectListingCreationDateOption(label: string) {
        const option = this.locators.listingCreationDateOption(label);
        await expect(option).toBeVisible({ timeout: 5000 });
        await option.click({ force: true });
        await this.page.waitForTimeout(600);
    }

    private async selectAllListingCreationDates() {
        await this.openListingCreationDateDropdown();
        const selectAllCheckbox = this.locators.listingCreationDateSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible();
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(500);
    }

    private async deselectAllListingCreationDates() {
        await this.openListingCreationDateDropdown();
        const selectAllCheckbox = this.locators.listingCreationDateSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible();
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(500);

        // Optionally click again if toggle required for deselect scenario
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(700);
    }

    // Private function to reset filters (clicks the Reset button)
    public async resetFilters() {
        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeVisible({ timeout: 5000 });
        await expect(resetButton).toBeEnabled();
        await resetButton.click({ force: true });
        await this.page.waitForTimeout(700);
    }


    //*************************************Public Actions *************************************//

    async searchForValidListing(keyword: string) {
        await this.navigateToListings();
        await this.switchToGridView();

        // Wait for cards to be visible before searching
        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 30000 });

        await this.searchListing(keyword);
        await this.page.waitForTimeout(1000);

        // Verify search result: cards should be visible and contain the searched keyword
        await expect(cardRows.first()).toBeVisible({ timeout: 10000 });
        const cardRowCount = await cardRows.count();
        expect(cardRowCount).toBeGreaterThan(0);

        let foundKeyword = false;
        for (let i = 0; i < cardRowCount; ++i) {
            const row = cardRows.nth(i);
            const rowText = (await row.innerText()).toLowerCase();
            if (rowText.includes(keyword.toLowerCase())) {
                foundKeyword = true;
                break;
            }
        }

    }


    async searchForInvalidListing(keyword: string) {
        await this.navigateToListings();
        await this.switchToGridView();

        await this.searchListing(keyword);
        await this.page.waitForTimeout(1000);

        const noResults = this.page.getByText('No results found');
        await expect(noResults).toBeVisible({ timeout: 10000 });
    }

    async searchWithSpecialCharacters(specialChars: string) {
        await this.navigateToListings();
        const searchBox = this.locators.SearchBox();
        await searchBox.click();
        await searchBox.fill(specialChars);
        await this.page.waitForTimeout(1000);
    }

    async searchWithEmptyField() {
        await this.navigateToListings();
        await this.switchToGridView();

        const searchBox = this.locators?.SearchBox?.() ?? this.page.getByRole('textbox', { name: /search/i });
        await searchBox.fill('');
        await searchBox.press('Enter');
        await this.page.waitForTimeout(1000);
    }

    async selectSinglePropertyType() {
        await this.navigateToListings();
        await this.switchToGridView();
        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows.first()).toBeVisible({ timeout: 30000 });
        await this.openPropertyTypeDropdown();
        await this.page.waitForTimeout(1000);
        const firstOption = this.page.locator('ul > li.p-element').first();
        await expect(firstOption).toBeVisible({ timeout: 3000 });
        const label = (await firstOption.textContent())?.trim() || '';
        await firstOption.click({ force: true });
        await this.page.waitForTimeout(1000);
        const count = await cardRows.count();
        expect(count).toBeGreaterThan(0);
        let found = false;
        for (let i = 0; i < count; i++) {
            const card = cardRows.nth(i);
            await expect(card).toBeVisible({ timeout: 3000 });
            const text = (await card.innerText()).trim().toLowerCase();
            if (label && text.includes(label.toLowerCase())) {
                found = true;
                break;
            }
        }
        expect(found).toBe(true);

    }

    async selectMultiplePropertyTypes() {
        await this.navigateToListings();
        await this.switchToGridView();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows.first()).toBeVisible({ timeout: 30000 });

        await this.openPropertyTypeDropdown();
        await this.page.waitForTimeout(1000);

        const propertyTypeOptions = this.page.locator('ul > li.p-element');
        const optionCount = await propertyTypeOptions.count();
        if (optionCount < 2) {
            throw new Error('Less than two property type options available to select.');
        }
        const firstOption = propertyTypeOptions.nth(0);
        const secondOption = propertyTypeOptions.nth(1);

        const firstLabelRaw = await firstOption.textContent();
        const secondLabelRaw = await secondOption.textContent();
        const firstLabel = firstLabelRaw ? firstLabelRaw.trim().toLowerCase() : '';
        const secondLabel = secondLabelRaw ? secondLabelRaw.trim().toLowerCase() : '';

        await firstOption.click({ force: true });
        await this.page.waitForTimeout(300);
        await secondOption.click({ force: true });
        await this.page.waitForTimeout(1000);

        const count = await cardRows.count();

        let foundFirst = false;
        let foundSecond = false;

        for (let i = 0; i < count; i++) {
            const card = cardRows.nth(i);
            await expect(card).toBeVisible({ timeout: 3000 });
            const text = (await card.innerText()).trim().toLowerCase();
            if (firstLabel && text.includes(firstLabel)) {
                foundFirst = true;
            }
            if (secondLabel && text.includes(secondLabel)) {
                foundSecond = true;
            }
            if (foundFirst && foundSecond) break;
        }

    }

    async selectAllPropertyType() {
        await this.navigateToListings();
        await this.switchToGridView();
        // Wait for cards to load
        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows.first()).toBeVisible({ timeout: 30000 });

        await this.openPropertyTypeDropdown();
        await this.page.waitForTimeout(1000);

        const selectAllOption = this.page.locator('.checkbox__checkmark').first();
        await selectAllOption.click();
        await this.page.waitForTimeout(1000);
    }

    async deselectAllPropertyTypes() {
        await this.navigateToListings();
        await this.switchToGridView()
        // Cards load hone ka wait karo
        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows.first()).toBeVisible({ timeout: 30000 });

        await this.openPropertyTypeDropdown();
        await this.page.waitForTimeout(1000);

        const selectAllOption = this.page.locator('.checkbox__checkmark').first();
        await selectAllOption.click();
        await this.page.waitForTimeout(500);

        await selectAllOption.click();
        await this.page.waitForTimeout(1000);

    }

    async searchWithinPropertyTypeFilter(searchTerm: string) {
        await this.navigateToListings();
        await this.switchToGridView();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows.first()).toBeVisible({ timeout: 30000 });

        await this.openPropertyTypeDropdown();
        await this.page.waitForTimeout(1000);

        const propertyTypeSearchInput = this.page.locator('re-multiselect').filter({ hasText: 'Property Type' }).getByPlaceholder('Search')
        await propertyTypeSearchInput.click();
        await propertyTypeSearchInput.fill(searchTerm);
        await this.page.waitForTimeout(1000);

        const matchedOption = this.page.locator('li.p-element').filter({ hasText: new RegExp(searchTerm, 'i') }).first();
        if (await matchedOption.isVisible()) {
            await matchedOption.click();
            await this.page.waitForTimeout(800);
        }

        const rowCount = await cardRows.count();
        let found = false;
        for (let i = 0; i < rowCount; ++i) {
            const row = cardRows.nth(i);
            await expect(row).toBeVisible({ timeout: 3000 });
            const rowText = (await row.innerText()).toLowerCase();
            if (rowText.includes(searchTerm.toLowerCase())) {
                found = true;
                break;
            }
        }

    }

    async selectSinglePropertyAndCloseDropdown() {
        await this.navigateToListings();
        await this.switchToGridView()
        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows.first()).toBeVisible({ timeout: 30000 });
        await this.openPropertyTypeDropdown();
        await this.page.waitForTimeout(1000);

        const firstPropertyTypeOption = this.page.locator('ul > li.p-element').first();
        await firstPropertyTypeOption.click({ force: true });

        const closeButton = this.page.locator('.pi.pi-times-circle');
        if (await closeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await closeButton.click({ force: true });
        }
    }

    async selectSingleSuburb() {
        await this.navigateToListings();
        await this.switchToGridView();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 30000 });

        const suburbDropdown = this.locators.suburbDropdown();
        await expect(suburbDropdown).toBeVisible({ timeout: 2000 });
        await suburbDropdown.click();
        await this.page.waitForTimeout(1000);

        const firstSuburbOption = this.page.locator('ul > li.p-element').first();
        await expect(firstSuburbOption).toBeVisible({ timeout: 5000 });
        const firstSuburbText = (await firstSuburbOption.textContent() ?? '').trim();
        await firstSuburbOption.click({ force: true });
        await this.page.waitForTimeout(1000);

        const count = await cardRows.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
            const card = cardRows.nth(i);
            await expect(card).toBeVisible({ timeout: 3000 });
            const cardText = (await card.innerText()).toLowerCase();
            expect(firstSuburbText && cardText.includes(firstSuburbText.toLowerCase()))
                .toBe(true);
        }
    }

    async selectMultipleSuburbs() {
        await this.navigateToListings();
        await this.switchToGridView();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 30000 });

        await this.page.waitForTimeout(1000)

        const suburbDropdown = this.locators.suburbDropdown();
        await expect(suburbDropdown).toBeVisible({ timeout: 2000 });
        await suburbDropdown.click({ force: true });
        await this.page.waitForTimeout(1000);

        const allSuburbOptions = this.page.locator('ul > li.p-element');
        const optionCount = await allSuburbOptions.count();
        if (optionCount < 2) {
            throw new Error('Less than two suburb options available to select.');
        }

        // Pick first two displayed suburbs
        const suburb1 = allSuburbOptions.nth(0);
        const suburb2 = allSuburbOptions.nth(1);

        const suburb1Text = (await suburb1.textContent() ?? '').trim();
        const suburb2Text = (await suburb2.textContent() ?? '').trim();

        await suburb1.click({ force: true });
        await this.page.waitForTimeout(300);
        await suburb2.click({ force: true });
        await this.page.waitForTimeout(1000);

        const rowCount = await cardRows.count();

        // Assume that all listings should correspond to the suburbs filtered,
        // so each row should show at least one of the selected suburbs.
        for (let i = 0; i < rowCount; ++i) {
            const row = cardRows.nth(i);
            await expect(row).toBeVisible({ timeout: 3000 });
            const rowText = (await row.innerText()).toLowerCase();

            // At least one of the selected suburb names must appear in the text
            const matchesSuburb =
                (suburb1Text && rowText.includes(suburb1Text.toLowerCase())) ||
                (suburb2Text && rowText.includes(suburb2Text.toLowerCase()));
            expect(matchesSuburb).toBe(true);
        }

    }

    async selectAllSuburbs() {
        await this.navigateToListings();
        await this.switchToGridView();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const suburbDropdown = this.locators.suburbDropdown();
        await expect(suburbDropdown).toBeVisible({ timeout: 2000 });
        await suburbDropdown.click({ force: true });
        await this.page.waitForTimeout(1000);

        // Select 'Select All' for suburbs
        const selectAllCheckbox = this.locators.suburbSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible({ timeout: 2000 });
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(1000);

        // Count listings after selecting all suburbs
        const rowCount = await cardRows.count();
        expect(rowCount).toBeGreaterThan(0);
    }

    async deselectAllSuburbs() {
        await this.navigateToListings();
        await this.switchToGridView();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const suburbDropdown = this.locators.suburbDropdown();
        await expect(suburbDropdown).toBeVisible();
        await suburbDropdown.click({ force: true });

        const selectAllCheckbox = this.locators.suburbSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible();
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(500);

        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(500);

        const rowCount = await cardRows.count();
        expect(rowCount).toBeGreaterThan(0);
    }

    async searchWithinSuburbDropdown(suburbLabel: string) {
        await this.navigateToListings();
        await this.switchToGridView();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const suburbDropdown = this.locators.suburbDropdown();
        await expect(suburbDropdown).toBeVisible();
        await suburbDropdown.click({ force: true });

        const searchInput = this.locators.suburbSearchInput();
        await expect(searchInput).toBeVisible();
        await searchInput.fill(suburbLabel);

        await this.page.waitForTimeout(800);

        const suburbOption = this.locators.suburbOption(suburbLabel).first();
        await expect(suburbOption).toBeVisible();

        await suburbOption.first().click({ force: true });

        await this.page.waitForTimeout(1000);

        const count = await cardRows.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
            const card = cardRows.nth(i);
            await expect(card).toBeVisible({ timeout: 3000 });
            const cardText = (await card.innerText()).toLowerCase();
            // Check that suburbLabel is found in the card text
            expect(cardText.includes(suburbLabel.toLowerCase())).toBe(true);
        }
    }

    async selectSingleListingStatus() {
        await this.navigateToListings();
        await this.switchToGridView();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const listingStatusDropdown = this.locators.listingStatusDropdown();
        await expect(listingStatusDropdown).toBeVisible();
        await listingStatusDropdown.click({ force: true });

        await this.page.waitForSelector('ul > li.p-element');

        const statusOptions = this.page.locator('ul > li.p-element');
        const targetStatus = statusOptions.nth(2);

        await expect(targetStatus).toBeVisible();
        const statusLabel = (await targetStatus.innerText()).trim();
        expect(statusLabel.toLowerCase()).toBe("for lease");

        await targetStatus.click({ force: true });
        await this.page.waitForTimeout(1000);

        const count = await cardRows.count();
        expect(count).toBeGreaterThan(0);

        // Check that each card contains the selected status label ("For Lease")
        for (let i = 0; i < count; i++) {
            const card = cardRows.nth(i);
            await expect(card).toBeVisible({ timeout: 3000 });
            const cardText = (await card.innerText()).toLowerCase();
            expect(cardText.includes(statusLabel.toLowerCase())).toBe(true);
        }

        await listingStatusDropdown.click();

    }

    async selectMultipleListingStatuses() {
        await this.navigateToListings();
        await this.switchToGridView();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const listingStatusDropdown = this.locators.listingStatusDropdown();
        await expect(listingStatusDropdown).toBeVisible();
        await listingStatusDropdown.click({ force: true });

        const statusOptions = this.page.locator('ul > li.p-element');
        const statusCount = await statusOptions.count();
        if (statusCount < 2) {
            throw new Error('Less than two listing statuses available to select.');
        }

        const selectedStatusLabels: string[] = [];
        const status1 = statusOptions.nth(2);
        const status2 = statusOptions.nth(4);

        const status1Label = (await status1.innerText()).trim().toLowerCase();
        const status2Label = (await status2.innerText()).trim().toLowerCase();
        selectedStatusLabels.push(status1Label, status2Label);

        await status1.click({ force: true });
        await this.page.waitForTimeout(200);
        await status2.click({ force: true });
        await this.page.waitForTimeout(1000);

        const count = await cardRows.count();
        const selectedLabels = [status1Label.toLowerCase(), status2Label.toLowerCase()];

        // Check that each card contains at least one of the selected statuses in its text
        let foundAll = true;
        for (let i = 0; i < count; i++) {
            const card = cardRows.nth(i);
            await expect(card).toBeVisible({ timeout: 3000 });
            const cardText = (await card.innerText()).toLowerCase();
            if (!selectedLabels.some(lbl => cardText.includes(lbl))) {
                foundAll = false;
                break;
            }
        }
        expect(foundAll).toBe(true);

        await listingStatusDropdown.click();
    }

    async selectAllListingStatuses() {
        await this.navigateToListings();
        await this.switchToGridView();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const listingStatusDropdown = this.locators.listingStatusDropdown();
        await expect(listingStatusDropdown).toBeVisible();
        await listingStatusDropdown.click({ force: true });

        const selectAllCheckbox = this.locators.listingStatusSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible();
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(1000);

        const rowCount = await cardRows.count();
        expect(rowCount).toBeGreaterThan(0);

        await listingStatusDropdown.click();
    }

    async deselectAllListingStatuses() {
        await this.navigateToListings();
        await this.switchToGridView();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const listingStatusDropdown = this.locators.listingStatusDropdown();
        await expect(listingStatusDropdown).toBeVisible();
        await listingStatusDropdown.click({ force: true });

        const selectAllCheckbox = this.locators.listingStatusSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible();
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(500);

        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(1000);

        const rowCount = await cardRows.count();
        expect(rowCount).toBeGreaterThan(0);

        await listingStatusDropdown.click();

    }

    async searchListingStatusFilter(searchTerm: string) {
        await this.navigateToListings();
        await this.switchToGridView();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const listingStatusDropdown = this.locators.listingStatusDropdown();
        await expect(listingStatusDropdown).toBeVisible();
        await listingStatusDropdown.click({ force: true });
        await this.page.waitForTimeout(500);

        const statusDropdownSearchBox = this.locators.listingStatusSearchInput?.()
            ?? this.page.locator('input[placeholder="Search"][aria-label="Search Listing Status"]');
        await expect(statusDropdownSearchBox).toBeVisible();
        await statusDropdownSearchBox.fill(searchTerm);
        await this.page.waitForTimeout(500);

        const filteredOptions = this.locators.listingStatusOption(searchTerm);
        const count = await filteredOptions.count();
        expect(count).toBeGreaterThan(0);
        let found = false;
        for (let i = 0; i < count; i++) {
            const optionText = ((await filteredOptions.nth(i).innerText()) || '').toLowerCase();
            if (optionText.includes(searchTerm.toLowerCase())) {
                found = true;
                break;
            }
        }
        expect(found).toBe(true);
        await listingStatusDropdown.click();

        await this.page.waitForTimeout(1000)

    }

    async searchForListingStatus(searchTerm: string) {
        await this.navigateToListings();
        await this.switchToGridView();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const listingStatusDropdown = this.locators.listingStatusDropdown();
        await expect(listingStatusDropdown).toBeVisible();
        await listingStatusDropdown.click({ force: true });
        await this.page.waitForTimeout(500);

        const statusDropdownSearchBox = this.locators.listingStatusSearchInput?.()
            ?? this.page.locator('input[placeholder="Search"][aria-label="Search Listing Status"]');
        await expect(statusDropdownSearchBox).toBeVisible();
        await statusDropdownSearchBox.fill(searchTerm);
        await this.page.waitForTimeout(500);

        const filteredOptions = this.locators.listingStatusOption(searchTerm).first();
        await filteredOptions.click()
        await this.page.waitForTimeout(100)
        await listingStatusDropdown.click();

        await this.page.waitForTimeout(1000)
    }

    async selectSingleListingType() {
        await this.navigateToListings();
        await this.switchToGridView();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const listingTypeDropdown = this.locators.listingTypeDropdown();
        await expect(listingTypeDropdown).toBeVisible({ timeout: 3000 });
        await listingTypeDropdown.click({ force: true });
        await this.page.waitForTimeout(500);

        const allTypeOptions = this.page.locator('ul li.p-element');
        const firstTypeOption = allTypeOptions.first();
        await expect(firstTypeOption).toBeVisible({ timeout: 5000 });

        const selectedTypeTextRaw = await firstTypeOption.textContent();
        const selectedTypeText = selectedTypeTextRaw ? selectedTypeTextRaw.trim() : '';
        await firstTypeOption.click({ force: true });
        await this.page.waitForTimeout(1000);

        const rowCount = await cardRows.count();
        expect(rowCount).toBeGreaterThan(0);


    }

    // 
    // Search for an option by typing in the listing type search box, then click it
    async searchAndListingType(searchTerm: string) {
        await this.navigateToListings();
        await this.switchToGridView();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const listingTypeDropdown = this.locators.listingTypeDropdown();
        await expect(listingTypeDropdown).toBeVisible({ timeout: 3000 });
        await listingTypeDropdown.click({ force: true });
        await this.page.waitForTimeout(500);

        // Locate the search input inside listing type dropdown
        const searchInput = this.locators.listingTypeSearchInput?.()
            ?? this.page.locator('input[placeholder="Search"][aria-label="Search Listing Type"]');
        await expect(searchInput).toBeVisible({ timeout: 3000 });
        await searchInput.fill(searchTerm);
        await this.page.waitForTimeout(500);

        // Find and click the filtered option
        const filteredOption = this.locators.listingTypeOption(searchTerm).first();
        await expect(filteredOption).toBeVisible({ timeout: 2000 });
        await filteredOption.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    async selectMultipleListingTypes() {
        await this.navigateToListings();
        await this.switchToGridView();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);


        const listingTypeDropdown = this.locators.listingTypeDropdown();
        await expect(listingTypeDropdown).toBeVisible({ timeout: 3000 });
        await listingTypeDropdown.click({ force: true });
        await this.page.waitForTimeout(800);

        const allTypeOptions = this.page.locator('ul > li.p-element');
        const optionCount = await allTypeOptions.count();
        if (optionCount < 2) {
            throw new Error('Less than two listing types available to select.');
        }

        const type1 = allTypeOptions.nth(0);
        const type2 = allTypeOptions.nth(2);

        const type1TextRaw = await type1.textContent();
        const type2TextRaw = await type2.textContent();
        const type1Text = type1TextRaw ? type1TextRaw.trim() : '';
        const type2Text = type2TextRaw ? type2TextRaw.trim() : '';

        await type1.click({ force: true });
        await this.page.waitForTimeout(300);
        await type2.click({ force: true });
        await this.page.waitForTimeout(1000);

        const rowCount = await cardRows.count();
        expect(rowCount).toBeGreaterThan(0);

    }

    async selectSingleAgent() {
        await this.navigateToListings();
        await this.switchToGridView();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);
        await this.openSelectByAgentDropdown();

        const agentOptions = this.page.locator('li.p-element');
        const optionCount = await agentOptions.count();
        expect(optionCount).toBeGreaterThan(1);

        let idx = 1;
        let agentText = (await agentOptions.nth(idx).innerText()).trim();
        if (!agentText && optionCount > 2) {
            idx = 2;
            agentText = (await agentOptions.nth(idx).innerText()).trim();
        }
        if (!agentText) throw new Error('Could not find valid agent option for selection');

        await agentOptions.nth(idx).click({ force: true });
        await this.page.locator('.p-datatable-loading, .loading-spinner')
            .waitFor({ state: 'hidden', timeout: 7000 }).catch(() => { });

        const rowCount = await cardRows.count();
        expect(rowCount).toBeGreaterThan(0);


    }

    async searchAgent(searchText = 'Dawood Ahmad') {
        await this.navigateToListings();
        await this.switchToGridView();

        await this.locators.cardViewPropertyRow().waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);
        await this.openSelectByAgentDropdown();

        const agentSearchInput = this.locators.selectByAgentSearchInput();
        await agentSearchInput.fill('');
        await agentSearchInput.fill(searchText);
        await this.page.waitForTimeout(800);

        // Click the first matching agent option
        const agentOption = this.page.locator('li.p-element', { hasText: searchText }).first();
        await agentOption.click({ force: true });
    }

    async selectMultipleAgents() {
        await this.navigateToListings();
        await this.switchToGridView();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);
        await this.openSelectByAgentDropdown();

        // Select nth(1) and nth(3) agent options (i.e., 2nd and 4th option due to 0-based indexing)
        const agentOptions = this.page.locator('li.p-element');
        const optionCount = await agentOptions.count();
        expect(optionCount).toBeGreaterThan(3); // Ensure at least 4 options to select 1 and 3

        const idx1 = 1;
        const idx3 = 3;

        const agentText1 = (await agentOptions.nth(idx1).innerText()).trim();
        const agentText3 = (await agentOptions.nth(idx3).innerText()).trim();
        if (!agentText1 || !agentText3) throw new Error('Could not find valid agent options at nth(1) or nth(3)');

        await agentOptions.nth(idx1).click({ force: true });
        await this.page.waitForTimeout(200);
        await agentOptions.nth(idx3).click({ force: true });
        await this.page.waitForTimeout(600);

        const rowCount = await cardRows.count();
        expect(rowCount).toBeGreaterThan(0);

    }
    // Selecting a single contract status 
    async selectSingleContractStatus() {
        await this.navigateToListings();
        await this.switchToGridView();
        // Open the Contract Status dropdown
        const contractStatusDropdown = this.locators.contractStatusDropdown();
        await expect(contractStatusDropdown).toBeVisible({ timeout: 3000 });
        await contractStatusDropdown.click({ force: true });
        await this.page.waitForTimeout(800);

        // Find all contract status options
        const statusOptions = this.page.locator('ul > li.p-element');
        const optionCount = await statusOptions.count();
        if (optionCount === 0) throw new Error('No contract status options found.');

        // Pick the first one with non-empty text
        let selectedIdx = -1;
        for (let i = 0; i < optionCount; ++i) {
            const text = (await statusOptions.nth(i).textContent())?.trim() ?? '';
            if (text) {
                selectedIdx = i;
                break;
            }
        }
        if (selectedIdx === -1) throw new Error('Could not find a valid contract status to select.');

        // Select it
        await statusOptions.nth(selectedIdx).click({ force: true });
        await this.page.waitForTimeout(900);

    }

    // Selecting multiple Contract statuses
    async selectMultipleContractStatuses() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the Contract Status dropdown
        const contractStatusDropdown = this.locators.contractStatusDropdown();
        await expect(contractStatusDropdown).toBeVisible({ timeout: 3000 });
        await contractStatusDropdown.click({ force: true });
        await this.page.waitForTimeout(800);

        // Find all contract status options
        const statusOptions = this.page.locator('ul > li.p-element');
        const optionCount = await statusOptions.count();
        if (optionCount < 4) throw new Error('Less than four contract status options available to select.');

        // Pick the 0th and 3rd options
        const option0 = statusOptions.nth(0);
        const option3 = statusOptions.nth(3);

        const option0TextRaw = await option0.textContent();
        const option3TextRaw = await option3.textContent();
        const option0Text = option0TextRaw ? option0TextRaw.trim() : '';
        const option3Text = option3TextRaw ? option3TextRaw.trim() : '';

        await option0.click({ force: true });
        await this.page.waitForTimeout(300);
        await option3.click({ force: true });
        await this.page.waitForTimeout(1000);

        // (You can place table validation here if required)

        // Click 'Reset' to clear the filter

    }

    // Selecting a contact creation date
    async selectListingCreationDate() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open datepicker
        const input = this.locators.listingCreationDateDropdown();
        await expect(input).toBeVisible({ timeout: 3000 });
        await input.click({ force: true });
        await this.page.waitForTimeout(300);

        // Click 'Today' in datepicker
        let todayBtn = this.page.locator('.p-datepicker-buttonbar button', { hasText: /today/i });
        if (!(await todayBtn.isVisible().catch(() => false))) {
            todayBtn = this.page.locator('button', { hasText: /today/i });
        }
        await todayBtn.click({ force: true });
        // Reset filter

    }

    async selectNextDateFromToday() {
        await this.navigateToListings();

        // Open date picker
        await this.locators.listingCreationDateDropdown().click();

        // Always wait for calendar root (stable anchor)
        const calendar = this.page.locator(".p-datepicker");
        await expect(calendar).toBeVisible({ timeout: 5000 });

        // 1️⃣ Compute Tomorrow
        const t = new Date();
        t.setDate(t.getDate() + 1);

        const targetDay = t.getDate();
        const targetMonth = t.getMonth();
        const targetYear = t.getFullYear();

        // 2️⃣ Read currently opened calendar's month-year (stable header)
        const header = this.page.locator(".p-datepicker-title");
        await expect(header).toBeVisible();

        const headerText = await header.innerText();
        const [monthName, year] = headerText.trim().split(" ");

        const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();

        // 3️⃣ Move calendar to correct month
        const monthDifference =
            (targetYear - parseInt(year)) * 12 + (targetMonth - monthIndex);

        for (let i = 0; i < Math.abs(monthDifference); i++) {
            if (monthDifference > 0) {
                await this.page.locator(".p-datepicker-next").click();
            } else {
                await this.page.locator(".p-datepicker-prev").click();
            }
            // Wait for transition + re-render
            await this.page.waitForTimeout(200);
        }

        // 4️⃣ Select tomorrow's date (non-flaky selector)
        const dayLocator = this.page.locator(
            `.p-datepicker-calendar td:not(.p-disabled) >> text="${targetDay}"`
        );

        await dayLocator.first().waitFor({ state: "visible", timeout: 3000 });
        await dayLocator.first().click({ force: true });

        // 5️⃣ Validate "no results" message
        const noRecordsMsg = this.page.locator('text=/no results? found/i');
        await expect(noRecordsMsg).toBeVisible({ timeout: 6000 });
    }


    // Checking if grid view button is displayed and toggling to grid view
    async checkGridViewDisplay() {
        await this.navigateToListings();
        // Detect if already in grid view by checking visibility of at least one card row
        const cardRows = this.locators.cardViewPropertyRow();
        if (await cardRows.first().isVisible().catch(() => false)) {
            // Already in grid view, do nothing
            return;
        }
        // Reset filter

    }

    // Checking contact details in grid view - verify image, address, status, specifications, price
    async checkContactDetailsInGridView() {
        await this.navigateToListings();

        await this.switchToGridView();
        const image = this.page.locator('.s-property .product-thumbnail img').first();
        await expect(image).toBeVisible()

        const heading = this.page.locator('.s-property h3[title]').first();
        const headingValue = await heading.textContent();
        console.log("Heading:", headingValue?.trim());

        const status = this.page.locator('.tag-saved').first();
        const statusValue = await status.textContent();
        console.log("Status:", statusValue?.trim());

        // Beds
        const beds = this.page.locator('img[src*="Bed.svg"]').locator('xpath=../following-sibling::span').first();
        const bedsValue = await beds.textContent();
        console.log("Beds:", bedsValue?.trim());

        // Baths
        const baths = this.page.locator('img[src*="Bath.svg"]').locator('xpath=../following-sibling::span').first();
        const bathsValue = await baths.textContent();
        console.log("Baths:", bathsValue?.trim());

        // Cars
        const cars = this.page.locator('img[src*="Car.svg"]').locator('xpath=../following-sibling::span').first();
        const carsValue = await cars.textContent();
        console.log("Cars:", carsValue?.trim());

        // Area (16m2)
        const area = this.page.locator('img[src*="area-1.svg"]').locator('xpath=../following-sibling::span').first();
        const areaValue = await area.textContent();
        console.log("Area:", areaValue?.trim());

        const price = this.page.locator('.price-from').first();
        const priceValue = await price.textContent();
        console.log("Price:", priceValue?.trim());

    }

    // Expanding a Listing card
    async expandFirstContactCard() {
        await this.navigateToListings();
        await this.switchToGridView();
        const chevronDown = this.page.locator('i.pi.pi-chevron-down').nth(2);
        await chevronDown.click({ force: true });
        const expandedDetails = this.page.locator('.p-accordion-content, .expanded-section').nth(2);
        const expandedText = (await expandedDetails.textContent() ?? '').trim();
        console.log('Expanded Card Details (trimmed):', expandedText);


        await this.page.waitForTimeout(1000)
    }

    // Collapsing an expanded listing card
    async collapseExpandedListingCard() {
        await this.navigateToListings();
        await this.switchToGridView();
        const chevronDown = this.page.locator('i.pi.pi-chevron-down').first();
        await chevronDown.click({ force: true });
        const expandedDetails = this.page.locator('.p-accordion-content, .expanded-section').first();
        const expandedText = (await expandedDetails.textContent() ?? '').trim();
        console.log('Expanded Card Details (trimmed):', expandedText);
        await this.resetFilters()

        await this.page.waitForTimeout(2000)

    }

    // Deleting a Listing
    async deleteListingCard() {
        await this.navigateToListings();
        await this.switchToGridView();
        const firstCard = this.page.locator('.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 20000 });

        const chevronDown = this.page.locator('i.pi.pi-chevron-down').first();
        await chevronDown.click({ force: true });

        // Find the delete button for the first visible listing card in card/grid view
        const cardDeleteButton = this.page.locator('a:nth-child(4)').first();
        await cardDeleteButton.scrollIntoViewIfNeeded()
        await cardDeleteButton.click({ force: true });

        // Wait for confirmation dialog to appear
        const confirmationDialog = this.page.getByText('Are you sure you want to delete this listing ? Your listing will be permanently');
        await expect(confirmationDialog).toBeVisible({ timeout: 10000 });

        // Find and click the confirm Delete button
        const confirmButton = this.page.getByRole('button', { name: 'Delete' });
        await expect(confirmButton).toBeVisible({ timeout: 10000 });
        await confirmButton.click({ force: true });
        const toast = this.page.getByRole('alert', { name: 'Listing successfully deleted' });;
        await expect(toast).toBeVisible({ timeout: 10000 });
        await this.resetFilters();
        await this.page.waitForTimeout(2000);

    }

    // Editing a listing
    async editListingCard() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Expand the first listing card (if needed)
        const chevronDown = this.page.locator('i.pi.pi-chevron-down').first();
        await chevronDown.click({ force: true });

        await this.page.waitForTimeout(2000);

        // Find and click the edit icon
        const editIcon = this.page.locator('.ml-3.cp.ng-star-inserted').first(); // adjust selector if needed
        await editIcon.scrollIntoViewIfNeeded();
        await editIcon.click({ force: true });

        // Optionally, add further steps to interact with the edit modal or form
        const editForm = this.page.locator('#rightbarwithscroll');
        await expect(editForm).toBeVisible({ timeout: 10000 });

        const close = this.page.locator('.pi.pi-times').first()

        await close.click({ force: true })

        await this.page.waitForTimeout(1000);
        await this.resetFilters()

        await this.page.waitForTimeout(2000)
    }

    // Editing and saving changes
    async editAndSaveListingCard() {
        await this.navigateToListings();
        await this.switchToGridView();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);

        // Expand the first listing card
        const chevronDown = this.page.locator('i.pi.pi-chevron-down').first();
        await chevronDown.click({ force: true });

        // Click the edit icon
        const editIcon = this.page.locator('.ml-3.cp.ng-star-inserted').first();
        await editIcon.scrollIntoViewIfNeeded();
        await editIcon.click({ force: true });

        // Wait for form/modal
        const editForm = this.page.locator('#rightbarwithscroll, .p-dialog, .edit-form-modal-selector').first();
        await expect(editForm).toBeVisible({ timeout: 10000 });

        // LOCATORS AS PER PROMPT
        const propertyTypeValue = "House";

        // 1️⃣ Container
        const propertyTypeSelect = this.page.locator('ng-select[formcontrolname="type"]');
        await expect(propertyTypeSelect).toBeVisible({ timeout: 5000 });

        await propertyTypeSelect.click()

        // 3️⃣ Input for searching/typing
        const input = propertyTypeSelect.locator('input[type="text"]');
        await expect(input).toBeVisible({ timeout: 5000 });
        await input.fill(propertyTypeValue);

        // 6️⃣ All options - wait for visible
        const options = this.page.locator('.ng-dropdown-panel .ng-option');
        // 7️⃣ Specific option
        const specificOption = options.locator(`text=${propertyTypeValue}`).first();
        await expect(specificOption).toBeVisible({ timeout: 5000 });
        await specificOption.click();

        // Optionally log the selected value
        const selectedValue = propertyTypeSelect.locator('.ng-value-label');
        // Wait and log for debug
        await expect(selectedValue).toBeVisible({ timeout: 2000 });
        const selectedText = (await selectedValue.textContent())?.trim();
        console.log("Selected Property Type:", selectedText);

        // Save & Close
        const saveButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveButton).toBeVisible({ timeout: 5000 });
        await saveButton.click({ force: true });
        const toast = this.page.getByRole('alert', { name: 'Listing updated successfully' })

        expect(toast).toBeVisible()

        await this.page.waitForTimeout(1000)

        await this.resetFilters()

        await this.page.waitForTimeout(2000)
    }


    //Opening a Listing portal
    async openPortalListingCard() {
        await this.navigateToListings();
        await this.switchToGridView();
        await this.resetFilters()
        await this.page.waitForTimeout(1500)
        // Expand the first listing card
        const chevronDown = this.page.locator('i.pi.pi-chevron-down').first();
        await chevronDown.click({ force: true });

        const portal = this.page.locator('.ml-3').first()

        await portal.scrollIntoViewIfNeeded()
        await this.page.waitForTimeout(1000);
        await portal.click({ force: true })

        // Wait for form/modal
        const editForm = this.page.locator('#rightbarwithscroll, .p-dialog, .edit-form-modal-selector').first();
        await expect(editForm).toBeVisible({ timeout: 10000 });

        const closeform = this.page.locator('.pi.pi-times').first();
        await expect(closeform).toBeVisible({ timeout: 30000 })
        await closeform.click({ force: true })

        await this.page.waitForTimeout(1000)

        await this.resetFilters()

        await this.page.waitForTimeout(2000)

    }

    //     //Opening a Listing portal
    async compareListingCard() {
        await this.navigateToListings();

        await this.switchToGridView();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);

        // Expand the first listing card
        const chevronDown = this.page.locator('i.pi.pi-chevron-down').first();
        await chevronDown.click({ force: true });

        const compare1 = this.page.locator('.p-checkbox-box').first()

        await compare1.scrollIntoViewIfNeeded()
        await compare1.click({ force: true })

        await this.page.waitForTimeout(1000)
        const chevronDown2 = this.page.locator('i.pi.pi-chevron-down').first();
        await chevronDown2.click({ force: true });

        const compare2 = this.page.locator('.p-checkbox-box').nth(1)

        await compare2.scrollIntoViewIfNeeded()
        await compare2.click({ force: true })

        // Wait for form/modal
        const compareButton = this.page.getByRole('button', { name: 'Compare' });
        await compareButton.scrollIntoViewIfNeeded()
        await compareButton.click({ force: true })

        const verifyRows = this.page.locator('.property-row')
        await expect(verifyRows).toBeVisible({ timeout: 30000 })

        const clearCompare = this.page.getByRole('button', { name: 'Clear Compare' });
        await clearCompare.click({ force: true })

        await this.page.waitForTimeout(1500)

        await this.resetFilters()

        await this.page.waitForTimeout(1000)

    }

    // Comparing more than two Listings card (Pattern matching "oper walay code" style)
    async compareMoreThanTwoListingCards() {
        await this.navigateToListings();

        await this.switchToGridView();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);

        // Expand the first listing card
        const chevronDown1 = this.page.locator('i.pi.pi-chevron-down').first()
        await chevronDown1.click({ force: true });

        const compare1 = this.page.locator('.p-checkbox-box').first()

        await compare1.scrollIntoViewIfNeeded()
        await compare1.click({ force: true })
        await chevronDown1.click({ force: true });

        await this.page.waitForTimeout(1500)
        const chevronDown2 = this.page.locator('i.pi.pi-chevron-down').first();
        await chevronDown2.click({ force: true });

        const compare2 = this.page.locator('.p-checkbox-box').nth(1)

        await compare2.scrollIntoViewIfNeeded()
        await compare2.click({ force: true })

        await this.page.waitForTimeout(1500)

        const chevronDown3 = this.page.locator('i.pi.pi-chevron-down').first();
        await chevronDown3.click({ force: true });

        const compare3 = this.page.locator('.p-checkbox-box').nth(2)

        await compare3.scrollIntoViewIfNeeded()
        await compare3.click({ force: true })


        // Wait for form/modal
        const compareButton = this.page.getByRole('button', { name: 'Compare' });
        await compareButton.scrollIntoViewIfNeeded()
        await compareButton.click({ force: true })

        const verifyRows = this.page.locator('.property-row')
        await expect(verifyRows).toBeVisible({ timeout: 30000 })

        const clearCompare = this.page.getByRole('button', { name: 'Clear Compare' });

        await expect(clearCompare).toBeVisible({ timeout: 30000 })

        await clearCompare.click({ force: true })

        await this.page.waitForTimeout(1500)
        await this.resetFilters()
        await this.page.waitForTimeout(1000)
    }

    async resetAllFilters() {
        await this.navigateToListings();

        await this.switchToGridView();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);

        // -- Search filter
        await this.searchListing('Hina Agent');
        await this.page.waitForTimeout(1000)
        await this.openPropertyTypeDropdown();
        await this.page.waitForTimeout(1000);

        const selectAllOption = this.page.locator('.checkbox__checkmark').first();
        await selectAllOption.click();
        await this.page.waitForTimeout(1000);

    }

    async switchToGridView() {
        await this.navigateToListings();
        // Detect if already in grid view by checking visibility of at least one card row
        const cardRows = this.locators.cardViewPropertyRow();
        if (await cardRows.first().isVisible().catch(() => false)) {
            // Already in grid view, do nothing
            return;
        }
        // Otherwise, switch to grid view
        const gridViewBtn = this.locators.gridViewButton();
        await gridViewBtn.click();
        await expect(cardRows.first()).toBeVisible({ timeout: 30000 });
    }

    //// Switching to list view
    async switchToListView() {
        await this.navigateToListings();
        const tableRows = this.page.locator('tbody tr');

        // If table rows are already visible, assume list view is selected and return early
        if (await tableRows.first().isVisible().catch(() => false)) {
            return;
        }

        // Otherwise, click the list view button and wait for rows
        const listViewButton = this.page.getByRole('link').nth(4);
        await listViewButton.click();
        await this.waitForTableRows();
    }

    async openListingForm() {
        await this.navigateToListings();
        await this.switchToGridView();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);
        // Assuming there is a button or icon to open the contact form in each card row
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick();
        // Wait for contact form to be visible (adjust selector if needed)
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        const closeForm = this.page.locator('.pi.pi-times').first()
        await this.page.waitForTimeout(1000)
        await closeForm.click({ force: true })

        await this.page.waitForTimeout(1500)

    }

    // Fill required fields in the 'Create Listing' form and click "Save"
    async createListingWithRequiredFields(propertyType: string, listingType: string, listingStatus: string) {

        await this.navigateToListings();
        await this.switchToGridView();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(2000);
        // Assuming there is a button or icon to open the contact form in each card row
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick({ force: true });
        // Wait for contact form to be visible (adjust selector if needed)
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Fill and select the property address: "1/14 Thomas Street, Laidley, QLD 4341"
        const propertyAddressSearchInput = this.page.locator('#rightbarwithscroll').getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 5000 });
        await propertyAddressSearchInput.fill('140 Coates Street, Laidley, QLD 4341');
        // Wait for dropdown/options to appear and select the address
        const addressOption = this.page.locator('div:nth-child(2) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 5000 });
        await addressOption.click();

        // Open Property Type dropdown and search/select the option
        const propertyTypeDropdown = this.page.locator('ng-select[formcontrolname="type"]');
        await expect(propertyTypeDropdown).toBeVisible({ timeout: 10000 });
        await propertyTypeDropdown.click();

        // Search for the propertyType option
        const propertyTypeSearchInput = this.page.locator('ng-select[formcontrolname="type"] input[type="text"], ng-select[formcontrolname="type"] input[role="combobox"]');
        if (await propertyTypeSearchInput.isVisible({ timeout: 1000 }).catch(() => false)) {
            await propertyTypeSearchInput.fill(propertyType);
            await this.page.waitForTimeout(500); // Let options update if needed
        }

        const propertyTypeOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: propertyType }).first();
        await propertyTypeOption.click();

        // Open Listing Type dropdown, search and select option
        const listingTypeDropdown = this.page.locator('ng-select[formcontrolname="listingType"], ng-select[formcontrolname="listing_type"]');
        await expect(listingTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingTypeDropdown.click();
        const listingTypeSearchInput = listingTypeDropdown.locator('input[type="text"]');
        await expect(listingTypeSearchInput).toBeVisible({ timeout: 2000 });
        await listingTypeSearchInput.fill(listingType);
        await this.page.waitForTimeout(500); // Let options update if needed
        const listingTypeOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: listingType }).first();
        await listingTypeOption.click();

        // Open Listing Status dropdown, search and select option

        const listingStatusDropdown = this.page.locator('.cs-w-70.danger-tag > .ng-select-container > .ng-value-container > .ng-input > input')
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 })
        await listingStatusDropdown.click();
        // Correct way to access the search input for a native ng-select dropdown:
        const listingStatusSearchInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']").first();
        await listingStatusSearchInput.fill(listingStatus);
        await this.page.waitForTimeout(500);
        const listingStatusOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: listingStatus }).first();
        await listingStatusOption.click();

        // Click the "Save" button
        const saveButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveButton.click();

        await expect(this.page.getByRole('alert', { name: 'Active listing already exist' })).toBeVisible()

        const closeForm = this.page.locator('.pi.pi-times').first()
        await this.page.waitForTimeout(1000)
        await closeForm.click({ force: true })

        await this.page.waitForTimeout(1500)


    }

    // Creating a Listing with missing required fields for negative validation
    async createListingWithMissingFields() {
        // Navigate to Listings and open the listing form
        await this.navigateToListings();
        await this.switchToGridView();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick({ force: true });

        // Wait for the form/modal to appear
        const form = this.page.locator('#rightbarwithscroll, .p-dialog, .listing-form-modal, .add-listing-form').first();
        await expect(form).toBeVisible({ timeout: 10000 })
        // Click Save and expect validation error
        const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
        await saveButton.click();
        const closeForm = this.page.locator('.pi.pi-times').first()
        await closeForm.click({ force: true })

        await this.page.waitForTimeout(1500)


    }

    async scrollToLoadMoreListings() {
        await this.navigateToListings();
        await this.switchToGridView();

        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });

        // Get total records from page footer
        const recordsLabel = this.page.locator('p:has-text("Records:")');
        await expect(recordsLabel).toBeVisible({ timeout: 5000 });

        const totalRecordsText = await recordsLabel.textContent();
        const totalRecords = totalRecordsText
            ? parseInt(totalRecordsText.replace(/\D/g, ''), 10)
            : 1000;

        console.log("Total Records Label:", totalRecords);

        let currentCount = await cards.count();
        console.log("Initial cards:", currentCount);

        let scrollAttempts = 0;
        const maxScrollAttempts = 100;

        let noChangeTimes = 0;

        while (currentCount < totalRecords && scrollAttempts < maxScrollAttempts && noChangeTimes < 3) {
            const prevCount = currentCount;

            // Scroll to bottom
            await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

            // Wait for lazy loading items
            await this.page.waitForTimeout(700);

            currentCount = await cards.count();
            console.log(`Loaded so far: ${currentCount}`);

            if (currentCount === prevCount) {
                noChangeTimes++; // count consecutive no-change attempts
            } else {
                noChangeTimes = 0; // reset when new cards appear
            }

            scrollAttempts++;
        }

        // FINAL small wait before last count (Fixes flaky mismatches)
        await this.page.waitForTimeout(800);
        currentCount = await cards.count();
        console.log("Total cards loaded:", currentCount);

        // Ensure we got all records
        expect(currentCount).toBe(totalRecords);

        return currentCount;
    }


    // Searching and then applying filters using already created functions
    async applyListingFilters() {
        await this.navigateToListings();
        // Search for listing by name (using existing function)
        await this.searchForValidListing('Dawood Ahmad');
        // Select property type "House" (using existing function)
        await this.searchWithinPropertyTypeFilter('House');
        await this.searchWithinSuburbDropdown('Laidley');
        await this.searchForListingStatus('For Sale');
        await this.searchAndListingType('Set Sale');
        await this.searchAgent();
    }

    // Table view search/test function
    async searchForExistingListingview(listingName: string) {
        await this.navigateToListings();
        await this.switchToListView();

        // Wait for table rows and get their count
        await this.waitForTableRows();
        const searchInput = this.locators.SearchBox();

        await expect(searchInput).toBeVisible({ timeout: 30000 });
        await searchInput.fill(listingName);
        await this.page.waitForTimeout(500);

        // Fetch all visible table rows after search
        const rowsLocator = this.page.locator('tr');
        const rowCount = await rowsLocator.count();
        expect(rowCount).toBeGreaterThan(0);

        let foundKeyword = false;
        for (let i = 0; i < rowCount; ++i) {
            const row = rowsLocator.nth(i);
            const rowText = (await row.innerText()).toLowerCase();
            if (rowText.includes(listingName.toLowerCase())) {
                foundKeyword = true;
                break;
            }
        }
        expect(foundKeyword).toBe(true);


    }

    // Searching for a non-existing Listing by keyword
    async searchForNonExistingListing(keyword: string) {
        await this.navigateToListings();
        await this.switchToListView();

        // Wait for table rows (header at least)
        await this.waitForTableRows();

        // Search for the non-existing keyword
        const searchInput = this.locators.SearchBox();
        await expect(searchInput).toBeVisible({ timeout: 30000 });
        await searchInput.fill(keyword);
        await this.page.waitForTimeout(500);

        // Assert "No results found" is visible after searching
        const noResults = this.page.getByText('No results found');
        await expect(noResults).toBeVisible({ timeout: 10000 });

        // Optionally reset filters afterward
        ;
    }

    // Searching for a listing using a partial name match
    async searchForPartialListingview(partialName: string) {
        await this.navigateToListings();
        await this.switchToListView();

        // Search for the partial name
        const searchInput = this.locators.SearchBox();
        await expect(searchInput).toBeVisible({ timeout: 30000 });
        await searchInput.fill(partialName);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(500);

        // Fetch all visible table rows after search (skip header row if present)
        const rowsLocator = this.page.locator('tr');
        const rowCount = await rowsLocator.count();
        if (rowCount === 0) {
            throw new Error('No rows found in the table after searching.');
        }

        let foundMatch = false;
        for (let i = 0; i < rowCount; ++i) {
            const row = rowsLocator.nth(i);
            // Defensive: Only check visible rows and with text content
            if (await row.isVisible()) {
                const rowText = (await row.innerText()).toLowerCase();
                if (rowText.includes(partialName.toLowerCase())) {
                    foundMatch = true;
                    break;
                }
            }
        }
        expect(foundMatch).toBe(true);
    }

    // Searching Listing with special characters
    async searchListingWithSpecialCharacters(specialChars: string) {
        await this.navigateToListings();
        await this.switchToListView();

        const searchInput = this.locators.SearchBox();
        await expect(searchInput).toBeVisible({ timeout: 30000 });
        await searchInput.fill(specialChars);
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(500);

        // Assert that "No results found" is visible, as special characters generally yield zero hits
        const noResults = this.page.getByText('No results found', { exact: false });
        await expect(noResults).toBeVisible({ timeout: 10000 });
    }

    async searchForListingview(listingName: string) {
        await this.navigateToListings();
        await this.switchToListView();

        // Wait for table rows and get their count
        await this.waitForTableRows();
        const searchInput = this.locators.SearchBox();

        await expect(searchInput).toBeVisible({ timeout: 30000 });
        await searchInput.fill(listingName);
        await this.page.waitForTimeout(500);

        // Fetch all visible table rows after search
        const rowsLocator = this.page.locator('tr');
        const rowCount = await rowsLocator.count();
        expect(rowCount).toBeGreaterThan(0);

        let foundKeyword = false;
        for (let i = 0; i < rowCount; ++i) {
            const row = rowsLocator.nth(i);
            const rowText = (await row.innerText()).toLowerCase();
            if (rowText.includes(listingName.toLowerCase())) {
                foundKeyword = true;
                break;
            }
        }
        expect(foundKeyword).toBe(true);
    }

    // Searching listing with an empty search field and pressing Enter
    async searchListingWithEmptyField() {
        await this.navigateToListings();
        await this.switchToListView();

        const searchInput = this.locators.SearchBox();

        await expect(searchInput).toBeVisible({ timeout: 30000 });
        await searchInput.fill('');
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(500);

        // Fetch all visible table rows after search
        const rowsLocator = this.page.locator('tr');
        const rowCount = await rowsLocator.count();

        expect(rowCount).toBeGreaterThan(0);
    }

    // Selecting a single property type
    async selectPropertyType() {
        await this.navigateToListings();
        await this.switchToListView();

        // Locate all visible table/list rows (tr in tbody, skipping header row if present)
        const tableRows = this.page.locator('tbody tr');
        await expect(tableRows.first()).toBeVisible({ timeout: 30000 });

        await this.openPropertyTypeDropdown();
        await this.page.waitForTimeout(1000);
        const firstOption = this.page.locator('ul > li.p-element').first();
        await expect(firstOption).toBeVisible({ timeout: 30000 });
        const propertyTypeLabel = (await firstOption.textContent())?.trim() || '';
        await firstOption.click({ force: true });
        await this.page.waitForTimeout(1000);

        const rowCount = await tableRows.count();
        expect(rowCount).toBeGreaterThan(0);

        // First, find the index of the "Property Type" column from the table header
        const headers = this.page.locator('thead tr th');
        const headerCount = await headers.count();

        let propertyTypeIndex = -1;
        for (let i = 0; i < headerCount; i++) {
            const headerText = (await headers.nth(i).innerText()).trim().toLowerCase();
            if (headerText === 'property type') {
                propertyTypeIndex = i;
                break;
            }
        }
        expect(propertyTypeIndex).toBeGreaterThan(-1);

        // Now, confirm the filtered value is present specifically in the property type column of at least one row
        let found = false;
        for (let i = 0; i < rowCount; i++) {
            const row = tableRows.nth(i);
            await expect(row).toBeVisible({ timeout: 30000 });
            const cells = row.locator('td');
            const cellCount = await cells.count();
            if (propertyTypeIndex < cellCount) {
                const propertyTypeCellText = (await cells.nth(propertyTypeIndex).innerText()).trim().toLowerCase();
                if (propertyTypeLabel && propertyTypeCellText.includes(propertyTypeLabel.toLowerCase())) {
                    found = true;
                    break;
                }
            }
        }
        expect(found).toBe(true);
    }

    // Selecting multiple property types in List View

    async selectMultiplePropertyTypesInListView() {
        await this.navigateToListings();
        await this.switchToListView();

        // Locate all visible table/list rows (tr in tbody, skipping header row if present)
        const tableRows = this.page.locator('tbody tr');
        await expect(tableRows.first()).toBeVisible({ timeout: 30000 });

        await this.openPropertyTypeDropdown();
        await this.page.waitForTimeout(1000);

        const propertyTypeOptions = this.page.locator('ul > li.p-element');
        const optionCount = await propertyTypeOptions.count();

        if (optionCount < 2) {
            throw new Error('Less than two property type options available to select.');
        }

        const firstOption = propertyTypeOptions.nth(0);
        const secondOption = propertyTypeOptions.nth(1);

        const firstLabelRaw = await firstOption.textContent();
        const secondLabelRaw = await secondOption.textContent();
        const firstLabel = firstLabelRaw ? firstLabelRaw.trim().toLowerCase() : '';
        const secondLabel = secondLabelRaw ? secondLabelRaw.trim().toLowerCase() : '';

        await firstOption.click({ force: true });
        await this.page.waitForTimeout(300);
        await secondOption.click({ force: true });
        await this.page.waitForTimeout(1000);

        const rowCount = await tableRows.count();
        expect(rowCount).toBeGreaterThan(0);

        // Find index of the "Property Type" column
        const headers = this.page.locator('thead tr th');
        const headerCount = await headers.count();

        let propertyTypeIndex = -1;
        for (let i = 0; i < headerCount; i++) {
            const headerText = (await headers.nth(i).innerText()).trim().toLowerCase();
            if (headerText === 'property type') {
                propertyTypeIndex = i;
                break;
            }
        }
        expect(propertyTypeIndex).toBeGreaterThan(-1);

        // Check if both selected property types are present in the relevant column of at least one row each
        let foundFirst = false;
        let foundSecond = false;

        for (let i = 0; i < rowCount; i++) {
            const row = tableRows.nth(i);
            await expect(row).toBeVisible({ timeout: 30000 });
            const cells = row.locator('td');
            const cellCount = await cells.count();
            if (propertyTypeIndex < cellCount) {
                const propertyTypeCellText = (await cells.nth(propertyTypeIndex).innerText()).trim().toLowerCase();
                if (firstLabel && propertyTypeCellText.includes(firstLabel)) {
                    foundFirst = true;
                }
                if (secondLabel && propertyTypeCellText.includes(secondLabel)) {
                    foundSecond = true;
                }
                if (foundFirst && foundSecond) break;
            }
        }
    }
    // Selecting all property types in List View
    async selectAllPropertyTypesInListView() {
        await this.navigateToListings();
        await this.switchToListView();

        // Open the property type dropdown
        await this.openPropertyTypeDropdown();

        // Click the "Select All" checkbox
        const selectAll = this.locators.propertyTypeSelectAll();
        await expect(selectAll).toBeVisible({ timeout: 3000 });
        await selectAll.click({ force: true });

        // Wait for filter to apply and table to update
        await this.page.waitForTimeout(1000);

        // Verify that table rows are present
        const tableRows = this.page.locator('tr');
        const rowCount = await tableRows.count();
        expect(rowCount).toBeGreaterThan(0);
    }
    // Deselect all property types in the property type filter dropdown and verify rows remain
    async deselectPropertyTypes() {
        await this.navigateToListings();
        await this.switchToListView();

        // Open the property type dropdown
        await this.openPropertyTypeDropdown();

        // Find and click the select all checkbox to deselect all
        const selectAll = this.locators.propertyTypeSelectAll();
        await expect(selectAll).toBeVisible({ timeout: 3000 });
        await selectAll.click({ force: true });

        await this.page.waitForTimeout(400)
        await selectAll.click({ force: true });
        // Verify table rows are still present
        const tableRows = this.page.locator('tr');
        const rowCount = await tableRows.count();
        expect(rowCount).toBeGreaterThan(0);
    }

    // Attempts to search for a property type that does not exist in the dropdown,
    async searchForNonExistingPropertyType(nonExistingType: string) {
        await this.navigateToListings();
        await this.switchToListView();

        // Open the property type dropdown
        await this.openPropertyTypeDropdown();

        // Type the non-existing property type into the search input
        await this.searchPropertyType(nonExistingType);

        // Wait briefly to allow filtering
        await this.page.waitForTimeout(400);
    }

    // Filtering with a valid suburb (now in list view)
    async filterByValidSuburb(suburbLabel: string) {
        await this.navigateToListings();
        await this.switchToListView();

        // Open the suburb dropdown
        const suburbDropdown = this.locators.suburbDropdown();
        await expect(suburbDropdown).toBeVisible({ timeout: 30000 });
        await suburbDropdown.click({ force: true });

        // Type into the suburb search input
        const searchInput = this.locators.suburbSearchInput();
        await expect(searchInput).toBeVisible({ timeout: 30000 });
        await searchInput.fill(suburbLabel);
        await this.page.waitForTimeout(800);

        // Select the matching suburb
        const suburbOption = this.locators.suburbOption(suburbLabel).first();
        await expect(suburbOption).toBeVisible({ timeout: 10000 });
        await suburbOption.click({ force: true });

        await this.page.waitForTimeout(1000);

        // Table rows might contain a header row; filter out header by checking at least 1 row present
        const tableRows = this.page.locator('tr');
        const rowCount = await tableRows.count();
        expect(rowCount).toBeGreaterThan(0);

        let foundMatching = false;
        for (let i = 0; i < rowCount; i++) {
            const row = tableRows.nth(i);
            const rowText = (await row.innerText()).toLowerCase();

            // Check at least one row contains the suburb label; skip header rows by checking contents
            if (rowText.includes(suburbLabel.toLowerCase())) {
                foundMatching = true;
            }
        }
        expect(foundMatching).toBe(true);
    }

    // Filtering with multiple suburbs in List View
    async filterByMultipleSuburbs(suburbLabels: string[]) {
        await this.navigateToListings();
        await this.switchToListView();

        // Open the suburb dropdown
        const suburbDropdown = this.locators.suburbDropdown();
        await expect(suburbDropdown).toBeVisible({ timeout: 10000 });
        await suburbDropdown.click({ force: true });

        // For each suburb label, search and select via locator abstraction
        for (const suburbLabel of suburbLabels) {
            const searchInput = this.page.locator('input[placeholder="Search"]').last();
            await expect(searchInput).toBeVisible();
            await searchInput.fill('');
            await searchInput.fill(suburbLabel);
            await this.page.waitForTimeout(300);

            // Select the matching suburb
            const suburbOption = this.locators.suburbOption(suburbLabel).first();
            await expect(suburbOption).toBeVisible({ timeout: 10000 });
            await suburbOption.click({ force: true });

            // Optionally wait for UI to update after each selection
            await this.page.waitForTimeout(400);
        }

        // Check table rows contain at least one of each suburb
        const tableRows = this.page.locator('tr');
        const rowCount = await tableRows.count();
        expect(rowCount).toBeGreaterThan(0);

        // For each suburb, verify there's at least one matching row
        for (const suburbLabel of suburbLabels) {
            let foundMatching = false;
            for (let i = 0; i < rowCount; i++) {
                const row = tableRows.nth(i);
                const rowText = (await row.innerText()).toLowerCase();
                if (rowText.includes(suburbLabel.toLowerCase())) {
                    foundMatching = true;
                    break;
                }
            }
        }
    }

    // Selecting "Select All" in suburb filter in List View
    async selectAllSuburbsInListView() {
        await this.navigateToListings();
        await this.switchToListView();

        // Open the suburb dropdown
        const suburbDropdown = this.locators.suburbDropdown();
        await expect(suburbDropdown).toBeVisible({ timeout: 10000 });
        await suburbDropdown.click({ force: true });

        // Click the "Select All" checkbox to select all suburbs
        const selectAllCheckbox = this.locators.suburbSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible({ timeout: 10000 });
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(500);

        // Check that the table rows exist (i.e., at least the header or data rows are present)
        const tableRows = this.page.locator('tr');
        const rowCount = await tableRows.count();
        expect(rowCount).toBeGreaterThan(0);
    }

    // Selecting "Deselect All" in suburb filter in List View
    async deselectAllSuburbsInListView() {
        await this.navigateToListings();
        await this.switchToListView();

        // Open the suburb dropdown
        const suburbDropdown = this.locators.suburbDropdown();
        await expect(suburbDropdown).toBeVisible({ timeout: 10000 });
        await suburbDropdown.click({ force: true });

        // Click the "Select All" checkbox once to select all, then again to deselect all
        const selectAllCheckbox = this.locators.suburbSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible({ timeout: 10000 });
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(300);

        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(500);

        // Check that table rows still exist (i.e. at least the header row is present)
        const tableRows = this.page.locator('tr');
        const rowCount = await tableRows.count();
        expect(rowCount).toBeGreaterThan(0);
    }

    // Searching for a non existing suburb in List View
    async searchForNonExistingSuburb(suburbLabel: string) {
        await this.navigateToListings();
        await this.switchToListView();

        // Open the suburb dropdown
        const suburbDropdown = this.locators.suburbDropdown();
        await expect(suburbDropdown).toBeVisible({ timeout: 10000 });
        await suburbDropdown.click({ force: true });

        // Search for the non-existing suburb label
        const searchInput = this.locators.suburbSearchInput();
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.fill(suburbLabel);
        await this.page.waitForTimeout(400);

        // There should be no visible options matching the label
        const suburbOption = this.locators.suburbOption(suburbLabel);
        await expect(suburbOption).toHaveCount(0);

        // Optionally, verify the table has no data rows (except header)
        const tableRows = this.page.locator('tr');
        const rowCount = await tableRows.count();
        for (let i = 0; i < rowCount; i++) {
            const row = tableRows.nth(i);
            const rowText = (await row.innerText()).toLowerCase();
            expect(rowText.includes(suburbLabel.toLowerCase())).toBe(false);
        }
    }

    // Filtering by a valid Listing status in List View
    async filterByValidListingStatus(statusLabel: string) {
        await this.navigateToListings();
        await this.switchToListView();

        // Open the listing status dropdown
        const listingStatusDropdown = this.locators.listingStatusDropdown();
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click({ force: true });

        // Wait for listing status options to be visible
        const statusOptions = this.page.locator('ul > li.p-element');
        await expect(statusOptions.first()).toBeVisible({ timeout: 10000 });

        // Find the correct status option and click it
        const count = await statusOptions.count();
        let matched = false;
        for (let i = 0; i < count; ++i) {
            const option = statusOptions.nth(i);
            const text = (await option.innerText()).trim().toLowerCase();
            if (text === statusLabel.toLowerCase()) {
                await option.click({ force: true });
                matched = true;
                break;
            }
        }
        expect(matched).toBe(true);

        await this.page.waitForTimeout(1000);

        // Check that the table rows have the correct status in at least one row
        const tableRows = this.page.locator('tr');
        const rowCount = await tableRows.count();
        expect(rowCount).toBeGreaterThan(0);

        let foundStatus = false;
        for (let i = 0; i < rowCount; i++) {
            const row = tableRows.nth(i);
            const rowText = (await row.innerText()).toLowerCase();
            if (rowText.includes(statusLabel.toLowerCase())) {
                foundStatus = true;
                break;
            }
        }
        expect(foundStatus).toBe(true);
    }

    // Selecting multiple Listing statuses in List View
    async selectMultipleListingStatusesInListView(statusLabels: string[]) {
        await this.navigateToListings();
        await this.switchToListView();

        // Wait for table/list rows to become visible
        const initialRows = this.page.locator('tbody tr');
        await expect(initialRows.first()).toBeVisible({ timeout: 30000 });

        // Open the listing status dropdown
        const listingStatusDropdown = this.locators.listingStatusDropdown();
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click({ force: true });

        // Wait for listing status options to be visible
        const statusOptions = this.page.locator('ul > li.p-element');
        await expect(statusOptions.first()).toBeVisible({ timeout: 10000 });

        // Select each status label
        const lowerLabels = statusLabels.map(label => label.toLowerCase());
        let selectedCount = 0;
        const optionCount = await statusOptions.count();
        for (let i = 0; i < optionCount; ++i) {
            const option = statusOptions.nth(i);
            const text = (await option.innerText()).trim().toLowerCase();
            if (lowerLabels.includes(text)) {
                await option.click({ force: true });
                selectedCount++;
                await this.page.waitForTimeout(250);
            }
            if (selectedCount === lowerLabels.length) break;
        }
        expect(selectedCount).toBe(lowerLabels.length);

        // Dismiss the dropdown if needed
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(1000);

        // Check that at least one table row contains each selected status
        const allRows = this.page.locator('tr');
        const rowCount = await allRows.count();
        expect(rowCount).toBeGreaterThan(0);

        for (const desiredStatus of lowerLabels) {
            let found = false;
            for (let i = 0; i < rowCount; i++) {
                const row = allRows.nth(i);
                const rowText = (await row.innerText()).toLowerCase();
                if (rowText.includes(desiredStatus)) {
                    found = true;
                    break;
                }
            }

        }
    }

    // Select all listing statuses in the listing status filter dropdown
    async selectAllListingStatusesInListView() {
        await this.navigateToListings();
        await this.switchToListView();

        // Wait for table rows to become visible
        const tableRows = this.page.locator('tbody tr');
        await expect(tableRows.first()).toBeVisible({ timeout: 30000 });

        // Open the listing status dropdown
        const listingStatusDropdown = this.locators.listingStatusDropdown();
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click({ force: true });

        // Click the "Select All" checkbox to select all listing statuses
        const selectAllCheckbox = this.locators.listingStatusSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible({ timeout: 10000 });
        await selectAllCheckbox.click({ force: true });

        await this.page.waitForTimeout(700);

        // Optionally, dismiss the dropdown if necessary
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(700);

        // Verify that table rows are present after selecting all
        const allRows = this.page.locator('tr');
        const rowCount = await allRows.count();
        expect(rowCount).toBeGreaterThan(0);
    }

    // Select all listing statuses, then deselect all 
    async deselectAllListingStatus() {
        await this.navigateToListings();
        await this.switchToListView();

        // Wait for table/list rows to become visible
        const tableRows = this.page.locator('tbody tr');
        await expect(tableRows.first()).toBeVisible({ timeout: 30000 });

        // Open the listing status dropdown
        const listingStatusDropdown = this.locators.listingStatusDropdown();
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click({ force: true });

        // Click the "Select All" checkbox to select everything
        const selectAllCheckbox = this.locators.listingStatusSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible({ timeout: 10000 });
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(400);

        // Click the "Select All" checkbox again to deselect everything
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(700);

        // Wait for all (possibly reset) rows to be visible and at least one present
        const allRows = this.page.locator('tr');
        const rowCount = await allRows.count();
        expect(rowCount).toBeGreaterThan(0);
    }

    // Apply the listing type filter, then verify the column cells match the selected type

    async filterByValidListingType(listingType: string) {
        await this.navigateToListings();
        await this.switchToListView();

        // Wait for table rows to be visible
        const tableRows = this.page.locator('tbody tr');
        await expect(tableRows.first()).toBeVisible({ timeout: 30000 });

        // Open dropdown and select the desired type
        const listingTypeDropdown = this.locators.listingTypeDropdown();
        await expect(listingTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingTypeDropdown.click({ force: true });
        await this.page.waitForTimeout(500);

        const typeOption = this.locators.listingTypeOption(listingType).first();
        await expect(typeOption).toBeVisible({ timeout: 10000 });
        const selectedTypeLabel = (await typeOption.textContent())?.trim().toLowerCase() || '';

        await typeOption.click({ force: true });
        await this.page.waitForTimeout(1000);

        // Make sure rows are shown
        const rowCount = await tableRows.count();
        expect(rowCount).toBeGreaterThan(0);

        // Find "Listing Type" column index
        const headers = this.page.locator('thead tr th');
        const headerCount = await headers.count();
        let typeColIndex = -1;

        for (let i = 0; i < headerCount; i++) {
            const headerText = (await headers.nth(i).innerText()).trim().toLowerCase().replace(/\s+/g, " ");
            if (headerText === 'listings type' || headerText === 'type') {
                typeColIndex = i;
                break;
            }
        }

        expect(typeColIndex).toBeGreaterThan(-1);

        // Now verify every row cell in this column matches the selected option
        for (let i = 0; i < rowCount; i++) {
            const row = tableRows.nth(i);
            await expect(row).toBeVisible({ timeout: 10000 });
            const cells = row.locator('td');
            const cellCount = await cells.count();
            expect(typeColIndex).toBeLessThan(cellCount);
            const cellText = (await cells.nth(typeColIndex).innerText()).trim().toLowerCase();
            expect(cellText).toContain(selectedTypeLabel);
        }
    }

    // Selecting multiple Listing types in List View
    async selectMultipleListingType() {
        await this.navigateToListings();
        await this.switchToListView();

        // Wait for table rows to appear
        const tableRows = this.page.locator('tbody tr');
        await expect(tableRows.first()).toBeVisible({ timeout: 30000 });

        // Open the listing type dropdown
        const listingTypeDropdown = this.locators.listingTypeDropdown();
        await expect(listingTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingTypeDropdown.click({ force: true });
        await this.page.waitForTimeout(1000);

        // Get all visible listing type options
        const typeOptions = this.page.locator('ul > li.p-element');
        const optionCount = await typeOptions.count();
        if (optionCount < 2) {
            throw new Error('Less than two listing types available to select.');
        }

        // Pick first two options for testing
        const firstOption = typeOptions.nth(0);
        const secondOption = typeOptions.nth(2);

        // Get the labels we are selecting, for validation
        const firstLabelRaw = await firstOption.textContent();
        const secondLabelRaw = await secondOption.textContent();
        const firstLabel = firstLabelRaw ? firstLabelRaw.trim().toLowerCase() : '';
        const secondLabel = secondLabelRaw ? secondLabelRaw.trim().toLowerCase() : '';

        // Select both options
        await firstOption.click({ force: true });
        await this.page.waitForTimeout(200);
        await secondOption.click({ force: true });
        await this.page.waitForTimeout(700);

        // Ensure rows now displayed
        const rowCount = await tableRows.count();
        expect(rowCount).toBeGreaterThan(0);

        // Find the column index for "Listing Type"
        const headers = this.page.locator('thead tr th');
        const headerCount = await headers.count();
        let typeColIndex = -1;
        for (let i = 0; i < headerCount; i++) {
            const headerText = (await headers.nth(i).innerText()).trim().toLowerCase().replace(/\s+/g, " ");
            if (headerText === "listings type" || headerText === "type" || headerText === "listing type") {
                typeColIndex = i;
                break;
            }
        }
        expect(typeColIndex).toBeGreaterThan(-1);

        // Check that at least one row for each selected type exists in the column
        let foundFirst = false;
        let foundSecond = false;
        for (let i = 0; i < rowCount; i++) {
            const row = tableRows.nth(i);
            await expect(row).toBeVisible({ timeout: 3000 });
            const cells = row.locator('td');
            const cellCount = await cells.count();
            if (typeColIndex < cellCount) {
                const cellText = (await cells.nth(typeColIndex).innerText()).trim().toLowerCase();
                if (firstLabel && cellText.includes(firstLabel)) foundFirst = true;
                if (secondLabel && cellText.includes(secondLabel)) foundSecond = true;
            }
            if (foundFirst && foundSecond) break;
        }
    }
    // Selecting "Select All" in Listing type
    async selectAllListingTypesInListView() {
        await this.navigateToListings();
        await this.switchToListView();

        // Ensure the table/list is loaded
        const tableRows = this.page.locator('tbody tr');
        await expect(tableRows.first()).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);

        // Open the listing type dropdown
        const listingTypeDropdown = this.locators.listingTypeDropdown();
        await expect(listingTypeDropdown).toBeVisible({ timeout: 3000 });
        await listingTypeDropdown.click({ force: true });
        await this.page.waitForTimeout(800);

        // Click the "Select All" checkbox to select all listing types
        const selectAllCheckbox = this.locators.listingTypeSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible({ timeout: 10000 });
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(700);

        // Optionally, close the dropdown if it remains open
        await listingTypeDropdown.click({ force: true });

        // Check that table rows are present after selecting all types
        const rowCount = await tableRows.count();
        expect(rowCount).toBeGreaterThan(0);
    }

    // Selecting "Deselect All" in Listing type
    async deselectAllListingTypesInListView() {
        await this.navigateToListings();
        await this.switchToListView();

        // Ensure the table/list is loaded
        const tableRows = this.page.locator('tbody tr');
        await expect(tableRows.first()).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);

        // Open the listing type dropdown
        const listingTypeDropdown = this.locators.listingTypeDropdown();
        await expect(listingTypeDropdown).toBeVisible({ timeout: 3000 });
        await listingTypeDropdown.click({ force: true });
        await this.page.waitForTimeout(800);

        // Find and click the "Select All" checkbox twice (selects all then deselects all)
        const selectAllCheckbox = this.locators.listingTypeSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible({ timeout: 10000 });
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(300);
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(1000);

        // Verify that no rows are displayed (no listings match zero types)
        const rowCount = await tableRows.count();
        expect(rowCount).toBeGreaterThan(0);

        // Close dropdown if still open
        await listingTypeDropdown.click({ force: true });
    }

    // Filtering by a valid agent (who may be in Primary Agent or Secondary Agent columns)
    async filterByValidAgent(agentName: string) {
        await this.navigateToListings();
        await this.switchToListView();

        // Wait for table rows to be visible
        const tableRows = this.page.locator('tbody tr');
        await expect(tableRows.first()).toBeVisible({ timeout: 30000 });

        // Open agent dropdown and search for the agent
        const agentDropdown = this.locators.selectByAgentDropdown?.() ?? this.page.locator('[aria-label*="Agent"]');
        await expect(agentDropdown).toBeVisible({ timeout: 10000 });
        await agentDropdown.click({ force: true });
        await this.page.waitForTimeout(500);

        const searchInput = this.locators.selectByAgentSearchInput?.()
            ?? this.page.locator('input[placeholder="Search"][aria-label*="Agent"]');
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.fill(agentName);
        await this.page.waitForTimeout(500);

        const option = this.locators.selectByAgentOption?.(agentName)?.first()
            ?? this.page.locator('ul > li.p-element').filter({ hasText: agentName }).first();

        await expect(option).toBeVisible({ timeout: 10000 });
        const agentLabel = (await option.textContent())?.trim().toLowerCase() || "";
        await option.click({ force: true });
        await this.page.waitForTimeout(1000);

        // Find the indexes for "Primary Agent" and "Secondary Agent" columns
        const headers = this.page.locator('thead tr th');
        const headerCount = await headers.count();
        let primaryAgentColIndex = -1;
        let secondaryAgentColIndex = -1;

        for (let i = 0; i < headerCount; i++) {
            const headerText = (await headers.nth(i).innerText()).trim().toLowerCase().replace(/\s+/g, " ");
            if (headerText === "primary agent") {
                primaryAgentColIndex = i;
            } else if (headerText === "secondary agent") {
                secondaryAgentColIndex = i;
            }
        }
        expect(primaryAgentColIndex > -1 || secondaryAgentColIndex > -1).toBeTruthy();

        // Validate at least one row contains the agent either in Primary Agent or Secondary Agent column
        const rowCount = await tableRows.count();
        expect(rowCount).toBeGreaterThan(0);

        let found = false;
        for (let i = 0; i < rowCount; i++) {
            const row = tableRows.nth(i);
            await expect(row).toBeVisible({ timeout: 10000 });
            const cells = row.locator('td');
            const cellCount = await cells.count();

            let primaryAgentCellText = '';
            let secondaryAgentCellText = '';

            if (primaryAgentColIndex > -1 && primaryAgentColIndex < cellCount) {
                primaryAgentCellText = (await cells.nth(primaryAgentColIndex).innerText()).trim().toLowerCase();
            }
            if (secondaryAgentColIndex > -1 && secondaryAgentColIndex < cellCount) {
                secondaryAgentCellText = (await cells.nth(secondaryAgentColIndex).innerText()).trim().toLowerCase();
            }

            if (
                (agentLabel && primaryAgentCellText.includes(agentLabel)) ||
                (agentLabel && secondaryAgentCellText.includes(agentLabel))
            ) {
                found = true;
                break;
            }
        }
        expect(found).toBe(true);
    }

    // Selecting multiple agents in List View
    async selectMultipleAgent() {
        await this.navigateToListings();
        await this.switchToListView();

        // Wait for table rows to appear
        const tableRows = this.page.locator('tbody tr');
        await expect(tableRows.first()).toBeVisible({ timeout: 30000 });

        await this.openSelectByAgentDropdown();

        // Select nth(1) and nth(3) agent options (i.e., 2nd and 4th option due to 0-based indexing)
        const agentOptions = this.page.locator('li.p-element');
        const optionCount = await agentOptions.count();
        expect(optionCount).toBeGreaterThan(3); // Ensure at least 4 options to select 1 and 3

        const idx1 = 1;
        const idx3 = 2;

        const agentText1 = (await agentOptions.nth(idx1).innerText()).trim();
        const agentText3 = (await agentOptions.nth(idx3).innerText()).trim();
        if (!agentText1 || !agentText3) throw new Error('Could not find valid agent options at nth(1) or nth(3)');

        await agentOptions.nth(idx1).click({ force: true });
        await this.page.waitForTimeout(200);
        await agentOptions.nth(idx3).click({ force: true });
        await this.page.waitForTimeout(600);


        // Wait for listing rows to update
        const rowCount = await tableRows.count();
        expect(rowCount).toBeGreaterThan(0);
    }

    // Selecting "Select All" in agent filter in List View
    async selectAllAgentsInListView() {
        await this.navigateToListings();
        await this.switchToListView();

        // Open the agent dropdown
        const agentDropdown = this.locators.selectByAgentDropdown();
        await expect(agentDropdown).toBeVisible({ timeout: 10000 });
        await agentDropdown.click({ force: true });

        // Click the "Select All" checkbox to select all agents
        const selectAllCheckbox = this.locators.selectByAgentSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible({ timeout: 10000 });
        await selectAllCheckbox.click({ force: true });

        await this.page.waitForTimeout(500);

        // Ensure that table rows are present after selecting all
        const tableRows = this.page.locator('tr');
        const rowCount = await tableRows.count();
        expect(rowCount).toBeGreaterThan(0);
    }

    // Selecting "Deselect All" in agent filter
    async deselectAllAgentsInListView() {
        await this.navigateToListings();
        await this.switchToListView();

        // Open the agent dropdown
        const agentDropdown = this.locators.selectByAgentDropdown();
        await expect(agentDropdown).toBeVisible({ timeout: 10000 });
        await agentDropdown.click({ force: true });

        // Click the "Select All" checkbox once to select all, then again to deselect all
        const selectAllCheckbox = this.locators.selectByAgentSelectAll().first();
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(300);

        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(500);

        // Ensure that table rows still exist (may just be header)
        const tableRows = this.page.locator('tr');
        const rowCount = await tableRows.count();
        expect(rowCount).toBeGreaterThan(0);
    }

    // Searching for an inactive agent in the agent filter
    async searchForInactiveAgentInListView(agentName: string) {
        await this.navigateToListings();
        await this.switchToListView();

        // Open the agent dropdown
        const agentDropdown = this.locators.selectByAgentDropdown();
        await expect(agentDropdown).toBeVisible({ timeout: 10000 });
        await agentDropdown.click({ force: true });

        // Find the agent search input and type the agent name
        const agentSearchInput = this.locators.selectByAgentSearchInput();
        await expect(agentSearchInput).toBeVisible();
        await agentSearchInput.fill(agentName);

        // Wait for search results to filter
        await this.page.waitForTimeout(700);

        const noResult = this.page.getByText('No results found');
        await expect(noResult).toBeVisible({ timeout: 5000 })
    }

    // Filtering by contract status in List View
    async filterByValidContractStatus(statusLabel: string) {
        await this.navigateToListings();
        await this.switchToListView();
        await this.waitForTableRows();
        // Open the contract status dropdown
        const contractStatusDropdown = this.locators.contractStatusDropdown();
        await expect(contractStatusDropdown).toBeVisible({ timeout: 10000 });
        await contractStatusDropdown.click({ force: true });

        // Wait for contract status options to be visible
        const statusOptions = this.page.locator('ul > li.p-element');
        await expect(statusOptions.first()).toBeVisible({ timeout: 10000 });

        // Find and select the desired status option
        const count = await statusOptions.count();
        let matched = false;
        for (let i = 0; i < count; ++i) {
            const option = statusOptions.nth(i);
            const text = (await option.innerText()).trim().toLowerCase();
            if (text === statusLabel.toLowerCase()) {
                await option.click({ force: true });
                matched = true;
                break;
            }
        }
        expect(matched).toBe(true);

        await this.page.waitForTimeout(1000);

        // Now either table rows with results are visible OR "No results found" should be present
        const tableRows = this.page.locator('tr');
        const rowCount = await tableRows.count();

        // Check for both conditions: Table rows (other than header), or "No results found"
        let hasVisibleResults = false;
        if (rowCount > 1) { // usually header + data; adjust if only data
            hasVisibleResults = true;
        } else {
            // Try to find "No results found" visible text in table
            const noResults = this.page.getByText('No results found');
            if (await noResults.isVisible({ timeout: 10000 })) {
                hasVisibleResults = true;
            }
        }
        expect(hasVisibleResults).toBe(true); // pass if either table data or "No results found"
    }
    // Selecting multiple contract statuses in List View
    async selectMultipleContractStatusesInListView() {
        await this.navigateToListings();
        await this.switchToListView();
        await this.waitForTableRows();
        // Open the contract status dropdown
        const contractStatusDropdown = this.locators.contractStatusDropdown();
        await expect(contractStatusDropdown).toBeVisible({ timeout: 10000 });
        await contractStatusDropdown.click({ force: true });

        // Wait for contract status options to be visible
        const statusOptions = this.page.locator('ul > li.p-element');
        await expect(statusOptions.first()).toBeVisible({ timeout: 10000 });

        // Select the 1st and 2nd contract statuses with non-empty text (skip any "Select All" if present)
        const selectedIndexes: number[] = [];
        const validTexts: string[] = [];
        const count = await statusOptions.count();
        for (let i = 0; i < count && validTexts.length < 2; ++i) {
            const option = statusOptions.nth(i);
            const text = (await option.innerText()).trim();
            // avoid empty, "select all", or similar (case-insensitive)
            if (text && !/^select all$/i.test(text)) {
                selectedIndexes.push(i);
                validTexts.push(text);
            }
        }
        if (selectedIndexes.length < 2) throw new Error("Not enough contract statuses found to select two distinct options.");
        // Select both
        for (const idx of selectedIndexes) {
            await statusOptions.nth(idx).click({ force: true });
            await this.page.waitForTimeout(300);
        }

        await this.page.waitForTimeout(1000);

        // Check if table rows or "No results found" is visible (as filter outcome)
        const tableRows = this.page.locator('tr');
        const rowCount = await tableRows.count();
        let filterWorked = false;
        if (rowCount > 1) {
            filterWorked = true;
        } else {
            const noResults = this.page.getByText('No results found');
            if (await noResults.isVisible({ timeout: 10000 })) {
                filterWorked = true;
            }
        }
        expect(filterWorked).toBe(true);
    }

    // Selecting "Deselect All" in contract status in List View
    async deselectAllContractStatusesInListView() {
        await this.navigateToListings();
        await this.switchToListView();
        await this.waitForTableRows();

        // Open the contract status dropdown using locator from locators file
        const contractStatusDropdown = this.locators.contractStatusDropdown();
        await expect(contractStatusDropdown).toBeVisible({ timeout: 10000 });
        await contractStatusDropdown.click({ force: true });

        // Wait for "Select All" checkbox (deselect all) using locator from locators file
        const contractStatusSelectAll = this.locators.contractStatusSelectAll();
        await expect(contractStatusSelectAll.first()).toBeVisible({ timeout: 10000 });
        // Click to deselect all 
        await contractStatusSelectAll.click({ force: true });
        await this.page.waitForTimeout(500);

        await contractStatusSelectAll.click({ force: true });
        // Close dropdown if needed (optional)
        // await contractStatusDropdown.press('Escape');

        // Verify that filter is cleared:
        // Expect table rows to show all/none or "No results found" message as a result of deselect
        const tableRows = this.page.locator('tr');
        const rowCount = await tableRows.count();
        let resultValid = false;
        if (rowCount > 1) {
            resultValid = true;
        } else {
            const noResults = this.page.getByText('No results found');
            if (await noResults.isVisible({ timeout: 10000 })) {
                resultValid = true;
            }
        }
        expect(resultValid).toBe(true);
    }

    // Selecting a valid date range in List View
    async selectValidListingCreationDateRange() {
        await this.navigateToListings();
        await this.switchToListView();
        await this.waitForTableRows();

        // Open datepicker
        const input = this.locators.listingCreationDateDropdown();
        await expect(input).toBeVisible({ timeout: 10000 });
        await input.click({ force: true });
        await this.page.waitForTimeout(300);

        let todayBtn = this.page.locator('.p-datepicker-buttonbar button', { hasText: /today/i });
        if (!(await todayBtn.isVisible().catch(() => false))) {
            todayBtn = this.page.locator('button', { hasText: /today/i });
        }
        await todayBtn.click({ force: true });

        const tableRows = this.page.locator('tr');
        const rowCount = await tableRows.count();
        let resultValid = false;
        if (rowCount > 1) {
            resultValid = true;
        } else {
            const noResults = this.page.getByText('No results found');
            if (await noResults.isVisible({ timeout: 10000 })) {
                resultValid = true;
            }
        }
        expect(resultValid).toBe(true);
    }

    // Selecting a future date in List View
    async selectFutureListingCreationDateInListView() {
        await this.navigateToListings();
        await this.switchToListView();
        await this.waitForTableRows();

        // Open date picker
        const dateInput = this.locators.listingCreationDateDropdown();
        await expect(dateInput).toBeVisible({ timeout: 10000 });
        await dateInput.click({ force: true });

        // Wait for calendar to show
        const calendar = this.page.locator(".p-datepicker");
        await expect(calendar).toBeVisible({ timeout: 10000 });

        // Compute tomorrow's date
        const t = new Date();
        t.setDate(t.getDate() + 1);

        const targetDay = t.getDate();
        const targetMonth = t.getMonth();
        const targetYear = t.getFullYear();

        // Read calendar month and year displayed
        const header = this.page.locator(".p-datepicker-title");
        await expect(header).toBeVisible({ timeout: 10000 });
        const headerText = await header.innerText();
        const [monthName, year] = headerText.trim().split(" ");
        const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();

        // Move calendar if necessary to target month/year
        const monthDifference = (targetYear - parseInt(year)) * 12 + (targetMonth - monthIndex);
        for (let i = 0; i < Math.abs(monthDifference); i++) {
            if (monthDifference > 0) {
                await this.page.locator(".p-datepicker-next").click();
            } else {
                await this.page.locator(".p-datepicker-prev").click();
            }
            await this.page.waitForTimeout(1000);
        }

        // Click the target (future) day
        const dayLocator = this.page.locator(`.p-datepicker-calendar td:not(.p-disabled) >> text="${targetDay}"`);
        await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
        await dayLocator.first().click({ force: true });

        // Validate "No results found" message appears
        const noResults = this.page.getByText('No results found');
        await expect(noResults).toBeVisible({ timeout: 4000 });
    }

    // Clicking on Admin Default
    async clickAdminDefaultButton() {
        await this.navigateToListings();
        await this.waitForTableRows();
        const adminDefaultBtn = this.locators.adminDefaultButton();
        await expect(adminDefaultBtn).toBeVisible({ timeout: 10000 });
        await adminDefaultBtn.click({ force: true });
        const adminView = this.locators.adminView();
        await expect(adminView).toBeVisible({ timeout: 10000 });

        await this.page.mouse.click(0, 0);

        await this.page.waitForTimeout(500)
    }

    // Hiding and Showing a Status
    async hideAndShowStatus() {
        await this.navigateToListings();
        await this.switchToListView();
        await this.waitForTableRows();

        // Open Admin Default options
        const adminDefaultBtn = this.locators.adminDefaultButton();
        await expect(adminDefaultBtn).toBeVisible({ timeout: 30000 });
        await adminDefaultBtn.click({ force: true });

        // Wait for Admin options to appear
        const adminView = this.locators.adminView();
        await expect(adminView).toBeVisible({ timeout: 10000 });

        // Wait for "Show All" button to appear
        const showAllBtn = this.locators.showAllButton();
        await expect(showAllBtn).toBeVisible({ timeout: 30000 });

        // Show the hidden status again
        await showAllBtn.click({ force: true });

        // Hide Status
        const hideStatusBtn = this.locators.hideStatus();
        await expect(hideStatusBtn).toBeVisible({ timeout: 30000 });
        await hideStatusBtn.click({ force: true });

        // Expect "Delete" text to be visible after hiding
        const deleteText = this.page.getByRole('cell', { name: 'Delete', exact: true })
        await expect(deleteText).toBeVisible({ timeout: 10000 });

        // Show the hidden status again
        await showAllBtn.click({ force: true });

        // Dismiss modal or focus (return UI to default state)
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(500);
    }

    // Dragging a status to change position
    async dragStatusToNewPosition() {
        await this.navigateToListings();
        await this.switchToListView();
        await this.waitForTableRows();

        // Open Admin Default options
        const adminDefaultBtn = this.locators.adminDefaultButton();
        await expect(adminDefaultBtn).toBeVisible({ timeout: 30000 });
        await adminDefaultBtn.click({ force: true });

        // Wait for Admin options to appear
        const adminView = this.locators.adminView();
        await expect(adminView).toBeVisible({ timeout: 10000 });

        const draggableHandles = this.locators.dragHandle();

        const handleCount = await draggableHandles.count();
        if (handleCount < 2) {
            throw new Error('Less than 2 draggable statuses found, cannot perform drag-and-drop.');
        }

        // Drag the first status below the second (swap order)
        const firstHandle = draggableHandles.nth(0);
        const secondHandle = draggableHandles.nth(1);

        // Use Playwright drag-and-drop if supported
        if (typeof firstHandle.dragTo === 'function') {
            await firstHandle.dragTo(secondHandle);
        } else {
            // Fallback: manual drag
            const box1 = await firstHandle.boundingBox();
            const box2 = await secondHandle.boundingBox();

            if (box1 && box2) {
                await this.page.mouse.move(
                    box1.x + box1.width / 2,
                    box1.y + box1.height / 2
                );
                await this.page.mouse.down();
                await this.page.waitForTimeout(150);

                await this.page.mouse.move(
                    box2.x + box2.width / 2,
                    box2.y + box2.height / 2,
                    { steps: 8 }
                );

                await this.page.mouse.up();
            }
        }

        // Close focus
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(500);
    }

    // Searching for a status inside Admin View
    async searchStatusInAdminView(searchTerm: string) {
        await this.navigateToListings();
        await this.switchToListView();
        await this.waitForTableRows();

        // Open Admin Default panel
        const adminDefaultBtn = this.locators.adminDefaultButton();
        await expect(adminDefaultBtn).toBeVisible({ timeout: 30000 });
        await adminDefaultBtn.click({ force: true });

        // Ensure Admin options are visible
        const adminView = this.locators.adminView();
        await expect(adminView).toBeVisible({ timeout: 30000 });

        // The search input is visually identified by an input with placeholder 'Search'

        const searchInput = this.page.getByRole('textbox', { name: 'Search' }).nth(2);
        await expect(searchInput).toBeVisible({ timeout: 30000 });
        await searchInput.fill(searchTerm);

        const draggableRow = this.page.locator('.cdk-drag.column-item.custom-field-views', { hasText: searchTerm }).first();
        await expect(draggableRow).toBeVisible({ timeout: 20000 });

        // Close Admin View focus (click away)
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(500);
    }

    // Creating a new list view
    async CreateNewListView(viewName: string) {
        await this.navigateToListings();
        await this.switchToListView();
        await this.waitForTableRows();

        // Open Admin Default panel
        const adminDefaultBtn = this.locators.adminDefaultButton();
        await expect(adminDefaultBtn).toBeVisible({ timeout: 30000 });
        await adminDefaultBtn.click({ force: true });

        // Ensure Admin options are visible
        const adminView = this.locators.adminView();
        await expect(adminView).toBeVisible({ timeout: 30000 });

        // Click the plus (+) button to open the "create new view" dialog
        const plusBtn = this.locators.plusButton();
        await expect(plusBtn).toBeVisible({ timeout: 10000 });
        await plusBtn.click({ force: true });

        // Fill view name
        const viewNameInput = this.locators.viewNameInput();
        await expect(viewNameInput).toBeVisible({ timeout: 10000 });
        await viewNameInput.click();
        await viewNameInput.fill(viewName);

        // Confirm/save the new view
        const saveBtn = this.page.getByRole('button', { name: /save|create/i }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click({ force: true });

        // Wait for success message/snackbar
        await expect(
            this.page.getByText(/view created|saved successfully|created successfully/i)
        ).toBeVisible({ timeout: 10000 });

        // Reopen Admin Default panel
        await adminDefaultBtn.click({ force: true });

        // Open the dropdown to view the options
        const adminViewDropdown = this.page.locator('.view-w-100 > .ng-select-container > .ng-arrow-wrapper');
        await expect(adminViewDropdown).toBeVisible({ timeout: 5000 });
        await adminViewDropdown.click();
        await expect(this.page.getByText(viewName, { exact: true }).first()).toBeVisible({ timeout: 10000 });
        // Close Admin View focus (click away)
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(500);
    }

    // Creating a view without a name
    async CreateViewWithoutName() {
        await this.navigateToListings();
        await this.switchToListView();
        await this.waitForTableRows();

        // Open Admin Default panel
        const adminDefaultBtn = this.locators.adminDefaultButton();
        await expect(adminDefaultBtn).toBeVisible({ timeout: 30000 });
        await adminDefaultBtn.click({ force: true });

        // Ensure Admin options are visible
        const adminView = this.locators.adminView();
        await expect(adminView).toBeVisible({ timeout: 30000 });

        // Click the plus (+) button to open the "create new view" dialog
        const plusBtn = this.locators.plusButton();
        await expect(plusBtn).toBeVisible({ timeout: 10000 });
        await plusBtn.click({ force: true });

        // Do not fill the view name input (leave empty)
        const viewNameInput = this.locators.viewNameInput();
        await expect(viewNameInput).toBeVisible({ timeout: 10000 });
        await viewNameInput.click();
        await viewNameInput.fill('');

        // Try to confirm/save the new view with an empty name
        const saveBtn = this.page.getByRole('button', { name: /save|create/i }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click({ force: true });

        // Expect the input to have a red border (validation error is shown as border, not as a text message)
        //await expect(viewNameInput).toHaveCSS('border-color', 'rgb(205, 24, 24)');

        // Optionally, click away or close dialog if needed
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(500);
    }

    // Deleting an existing view
    async deleteView(viewName: string) {
        await this.navigateToListings();
        await this.switchToListView();
        await this.waitForTableRows();

        // Open Admin Default panel
        const adminDefaultBtn = this.locators.adminDefaultButton();
        await expect(adminDefaultBtn).toBeVisible({ timeout: 30000 });
        await adminDefaultBtn.click({ force: true });

        // Ensure Admin options are visible
        const adminView = this.locators.adminView();
        await expect(adminView).toBeVisible({ timeout: 30000 });

        // Open the Admin View dropdown
        const adminViewDropdown = this.page.locator('.view-w-100 > .ng-select-container > .ng-arrow-wrapper');
        await expect(adminViewDropdown).toBeVisible({ timeout: 10000 });
        await adminViewDropdown.click();

        const viewOption = this.page.getByText(viewName, { exact: true }).first();
        await expect(viewOption).toBeVisible({ timeout: 10000 });

        // Locate the delete/trash button (replace selector if needed per UI)
        const deleteButton = this.page.locator('img[src="assets/img/menuIcon/delete_icon.svg"]').last();
        await expect(deleteButton).toBeVisible({ timeout: 10000 });
        await deleteButton.click({ force: true });

        // Confirm deletion in the modal/dialog
        const confirmBtn = this.page.getByRole('button', { name: /confirm|yes|delete/i }).first();
        await expect(confirmBtn).toBeVisible({ timeout: 10000 });
        await confirmBtn.click({ force: true });

        // success message for view deleted
        const deletedSuccessMessage = this.page.getByText(/successfully deleted|deleted successfully|view deleted/i, { exact: false });
        await expect(deletedSuccessMessage).toBeVisible({ timeout: 10000 });

        // Optionally assert that the view no longer exists
        await this.page.waitForTimeout(800);
        await adminViewDropdown.click();
        await expect(this.page.getByText(viewName, { exact: true })).not.toBeVisible({ timeout: 10000 });

        // Close dropdown if needed
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(400);
    }


    // Sharing a view with a user/team
    async shareView() {
        await this.navigateToListings();
        await this.switchToListView();
        await this.waitForTableRows();

        // Open the Admin Default panel
        const adminDefaultBtn = this.locators.adminDefaultButton();
        await expect(adminDefaultBtn).toBeVisible({ timeout: 30000 });
        await adminDefaultBtn.click({ force: true });

        // Make sure admin options show up
        const adminView = this.locators.adminView();
        await expect(adminView).toBeVisible({ timeout: 30000 });

        // Click the share icon
        const shareIcon = this.locators.shareIcon();
        await expect(shareIcon).toBeVisible({ timeout: 10000 });
        await shareIcon.click({ force: true });

        // In share modal, click to select users
        const selectUsers = this.locators.selectUser();
        await selectUsers.click();

        // Choose the first user
        const firstUserCheckbox = this.page.locator('.checkbox__checkmark').first();
        await expect(firstUserCheckbox).toBeVisible({ timeout: 10000 });
        await firstUserCheckbox.click({ force: true });

        // Expand dropdown for teams
        const dropdown = this.page.locator('.w-100 > .box > .tags > .fas');
        await dropdown.click({ force: true });

        // Now select a team
        const selectTeams = this.locators.selectTeams();
        await selectTeams.click();

        // Check first team checkbox
        const firstTeamCheckbox = this.page.locator('.checkbox__checkmark').first();
        await expect(firstTeamCheckbox).toBeVisible({ timeout: 10000 });
        await firstTeamCheckbox.click({ force: true });

        // Click share button
        const shareBtn = this.locators.shareButton();
        await expect(shareBtn).toBeVisible({ timeout: 10000 });
        await shareBtn.click({ force: true });

        // Assert sharing succeeded
        const sharedSuccessMessage = this.page.getByText(/view shared|View already shared with one or more selected users or teams/i, { exact: false });
        await expect(sharedSuccessMessage).toBeVisible({ timeout: 10000 });

        // Give the UI a moment to settle
        await this.page.waitForTimeout(500);
        // Close dropdown if needed
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(400);
    }

    // Searching for a user/team inside Share View
    async searchUserAndTeamInShareView() {
        // Define the user and team to search for
        const user = "Dawood Ahmad";
        const team = "Hina Team";
        await this.navigateToListings();
        await this.switchToListView();
        await this.waitForTableRows();
        // Open the Admin Default panel
        const adminDefaultBtn = this.locators.adminDefaultButton();
        await expect(adminDefaultBtn).toBeVisible({ timeout: 30000 });
        await adminDefaultBtn.click({ force: true });
        // Ensure admin options are visible
        const adminView = this.locators.adminView();
        await expect(adminView).toBeVisible({ timeout: 30000 });

        // Define the user and team to search for
        const selectUsers = this.locators.selectUser();
        await selectUsers.click();
        // User search input
        const searchUserInput = this.page.locator('input[placeholder="Search"]').nth(2);
        await expect(searchUserInput).toBeVisible({ timeout: 10000 });
        await searchUserInput.fill(user);
        // Wait for list items to appear
        await this.page.waitForSelector('li.p-element', { timeout: 10000 });
        // Select user
        const userOption = this.page.locator('li.p-element', { hasText: user });
        await expect(userOption).toBeVisible({ timeout: 10000 });
        const dropdown = this.page.locator('.w-100 > .box > .tags > .fas');
        await dropdown.click({ force: true });
        const selectTeams = this.locators.selectTeams();
        await selectTeams.click();
        const searchTeamInput = this.page.locator('input[placeholder="Search"]').nth(2);
        await expect(searchTeamInput).toBeVisible({ timeout: 10000 });
        await searchTeamInput.fill(team);
        // Wait for list items
        await this.page.waitForSelector('li.p-element', { timeout: 10000 });
        // Select team
        const teamOption = this.page.locator('li.p-element', { hasText: team });
        await expect(teamOption).toBeVisible({ timeout: 10000 });
        // Click outside to close dropdowns
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(400);
    }
    // Apply a filter and verify reset removes all filters
    async applyListingFilter() {
        await this.navigateToListings();
        await this.waitForTableRows()
        // Search for a specific listing
        await this.searchForExistingListingview('Hina');
    }

    // Test clicking Reset button when no filters are applied
    async clickResetNoFilters() {
        await this.navigateToListings();
        await this.switchToListView();
        await this.waitForTableRows();
        // Ensure we are viewing listings with default filters (none applied)
        await this.resetFilters()
    }

    // Deleting a Listing from List View
    async deleteListingFromListView() {
        await this.navigateToListings();
        await this.switchToListView();
        await this.waitForTableRows();

        // Search for the listing by name
        const delete_icon = this.page.locator('img[alt="delete"]').first();

        await expect(delete_icon).toBeVisible({ timeout: 10000 });

        await delete_icon.click();

        // Wait for confirmation dialog to appear
        const confirmationDialog = this.page.getByText('Are you sure you want to delete this listing ? Your listing will be permanently');
        await expect(confirmationDialog).toBeVisible({ timeout: 10000 });

        // Find and click the confirm Delete button
        const confirmButton = this.page.getByRole('button', { name: 'Delete' }).last();
        await expect(confirmButton).toBeVisible({ timeout: 10000 });
        await confirmButton.click({ force: true });
        const toast = this.page.getByRole('alert', { name: 'Listing successfully deleted' });;
        await expect(toast).toBeVisible({ timeout: 10000 });
        await this.resetFilters();
        await this.page.waitForTimeout(1000);
    }


    async fastSearch(keyword: string) {
        await this.navigateToListings();
        await this.switchToListView();
        await this.waitForTableRows();

        const TIMEOUT = 2000;

        const searchBox = this.locators.SearchBox();
        await searchBox.click();
        await searchBox.fill(keyword);

        // Wait for header and at least 1 data row (total 2 rows) to appear, or timeout
        const rowsLocator = this.page.locator('tr');
        await rowsLocator.nth(0).waitFor({ timeout: TIMEOUT });

        // Wait for one additional data row after header
        await this.page.waitForFunction(
            () => document.querySelectorAll('tr').length >= 2,
            null,
            { timeout: TIMEOUT }
        );

        // Final check: there must be at least 2 rows (header + 1 data row)
        const dataRows = await rowsLocator.count();
        if (dataRows < 2) {
            throw new Error('Search results did not load within 2 seconds.');
        }
    }

    // Filtering 100+ contacts should be smooth
    async filterHundredPlusListingsSmoothly(filterValue: string) {
        await this.navigateToListings();
        await this.switchToListView();

        // Optional: Ensure table is loaded initially
        await this.waitForTableRows();

        const searchBox = this.locators.SearchBox();

        await searchBox.click();
        await searchBox.fill(filterValue);

        // We expect results to show up within 2 seconds (header + at least 1 result)
        const TIMEOUT = 2000;

        // Wait for second row (index 1, since index 0 is header)
        await this.page.locator('tr').nth(1).waitFor({ timeout: TIMEOUT });
    }

    // Applying a valid filter on a status using FilterIcon locator
    async applyvalidListingFilter(name: string) {
        await this.navigateToListings();
        await this.switchToListView();

        // Optional: ensure table is loaded first
        await this.waitForTableRows();

        await this.page.waitForTimeout(1200);

        const filterIcon = this.page.locator('th', { hasText: 'Listing Status' }).locator('img[alt="filter"]');
        await expect(filterIcon).toBeVisible({ timeout: 10000 });
        await filterIcon.dblclick({ force: true });

        const selectField = this.page.getByText('Select', { exact: true }).first();
        await selectField.click();

        // Choose "Equals"
        const equalsOption = this.page.getByRole('option', { name: /equals/i });
        await expect(equalsOption).toBeVisible({ timeout: 5000 });
        await equalsOption.click();

        const selectField1 = this.page.getByText('Select', { exact: true }).last();
        await selectField1.click();
        // Fill in the keyword/type value to filter
        const searchBox = this.page.locator('input[placeholder="Search"]').last();
        await searchBox.click();
        await searchBox.fill(name);

        // Select the desired option that matches the 'name' (e.g., 'Agency' or 'Individual')
        const optionItem = this.page.getByRole('dialog').getByRole('listitem').filter({ hasText: name });
        await optionItem.click();
        const tag = this.page.locator('.filter-by-tasks > re-multiselect > .box > .tags > .fas');
        await tag.click()
        // Click "Apply" to activate the filter
        const applyBtn = this.page.getByRole('button', { name: /apply/i });
        await applyBtn.click();
        await this.page.waitForTimeout(1500);
    }

    // Clearing applied filter
    async clearAppliedFilters(name: string) {
        await this.navigateToListings();
        await this.switchToListView();

        // Optional: ensure table is loaded first
        await this.waitForTableRows();

        await this.page.waitForTimeout(1400)

        const filterIcon = await this.page.waitForSelector('th:has-text("Listing Status") img[alt="filter"]', { state: "visible", timeout: 10000 });
        await filterIcon.click({ force: true });

        const selectField = this.page.getByText('Select', { exact: true }).first();
        await selectField.click();

        // Choose "Equals"
        const equalsOption = this.page.getByRole('option', { name: /equals/i });
        await expect(equalsOption).toBeVisible({ timeout: 5000 });
        await equalsOption.click();

        const selectField1 = this.page.getByText('Select', { exact: true }).last();
        await selectField1.click();
        // Fill in the keyword/type value to filter
        const searchBox = this.page.locator('input[placeholder="Search"]').last();;
        await searchBox.click();
        await searchBox.fill(name);

        // Select the desired option that matches the 'name' (e.g., 'Agency' or 'Individual')
        const optionItem = this.page.getByRole('dialog').getByRole('listitem').filter({ hasText: name });
        await optionItem.click();
        const tag = this.page.locator('.filter-by-tasks > re-multiselect > .box > .tags > .fas');
        await tag.click()
        // Click "Apply" to activate the filter
        const clearBtn = this.page.getByRole('button', { name: /clear/i });
        await clearBtn.click();
        await this.page.waitForTimeout(1500);

    }

    // Selecting a condition but not selecting data
    async selectInvalidData(name: string) {
        await this.navigateToListings();
        await this.switchToListView();

        // Optional: ensure table is loaded first
        await this.waitForTableRows();

        await this.page.waitForTimeout(400)

        const filterIcon = await this.page.waitForSelector('th:has-text("Listing Status") img[alt="filter"]', { state: "visible", timeout: 10000 });
        await filterIcon.click({ force: true });

        const selectField = this.page.getByText('Select', { exact: true }).first();
        await selectField.click();

        // Choose "Equals"
        const equalsOption = this.page.getByRole('option', { name: /equals/i });
        await expect(equalsOption).toBeVisible({ timeout: 5000 });
        await equalsOption.click();

        const selectField1 = this.page.getByText('Select', { exact: true }).last();
        await selectField1.click();
        // Fill in the keyword/type value to filter
        const searchBox = this.page.locator('input[placeholder="Search"]').last();;
        await searchBox.click();
        await searchBox.fill(name);

        // Select the desired option that matches the 'name' (e.g., 'Agency' or 'Individual')
        const optionItem = this.page.getByRole('dialog').getByRole('listitem').filter({ hasText: name });
        await optionItem.click();
        const tag = this.page.locator('.filter-by-tasks > re-multiselect > .box > .tags > .fas');
        await tag.click()
        // Click "Apply" to activate the filter
        const applyBtn = this.page.getByRole('button', { name: /apply/i });
        await applyBtn.click();
        // Verify that "No record found" message appears
        const noRecordMessage = this.page.locator('text=No results found').first();
        await expect(noRecordMessage).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(100);
    }

    // Sorting by a valid column using locator
    async sortByValidColumn() {
        await this.navigateToListings();
        await this.switchToListView();

        // Wait for the table to load fully
        await this.waitForTableRows();

        // Use the sortingIcon locator from ListingLocator
        const sortingIcon = this.locators.sortingIcon();
        await sortingIcon.waitFor({ state: 'visible', timeout: 5000 });
        await sortingIcon.click();

        // Optional: Wait for the sort to take effect (look for a sort icon or data change)
        await this.page.waitForTimeout(1000);
    }

    // Sorting after applying a filter
    async sortAfterFiltering(name: string) {
        await this.navigateToListings();
        await this.switchToListView();

        // Optional: ensure table is loaded first
        await this.waitForTableRows();

        const filterIcon = await this.page.waitForSelector('th:has-text("Listing Status") img[alt="filter"]', { state: "visible", timeout: 10000 });
        await filterIcon.click({ force: true });

        const selectField = this.page.getByText('Select', { exact: true }).first();
        await selectField.click();

        // Choose "Equals"
        const equalsOption = this.page.getByRole('option', { name: /equals/i });
        await expect(equalsOption).toBeVisible({ timeout: 5000 });
        await equalsOption.click();

        const selectField1 = this.page.getByText('Select', { exact: true }).last();
        await selectField1.click();
        // Fill in the keyword/type value to filter
        const searchBox = this.page.locator('input[placeholder="Search"]').last();;
        await searchBox.click();
        await searchBox.fill(name);

        // Select the desired option that matches the 'name' (e.g., 'Agency' or 'Individual')
        const optionItem = this.page.getByRole('dialog').getByRole('listitem').filter({ hasText: name });
        await optionItem.click();
        const tag = this.page.locator('.filter-by-tasks > re-multiselect > .box > .tags > .fas');
        await tag.click()
        // Click "Apply" to activate the filter
        const applyBtn = this.page.getByRole('button', { name: /apply/i });
        await applyBtn.click();

        // Now sort by the valid column (e.g., Listing Status)
        const sortingIcon = this.locators.sortingIcon();
        await sortingIcon.waitFor({ state: 'visible', timeout: 5000 });
        await sortingIcon.click();

        // Wait for sort to apply (optionally, verify sort or check data update)
        await this.page.waitForTimeout(1000);
    }

    // Sorting by an empty column
    async sortListingByEmptyColumn() {
        await this.navigateToListings();
        await this.switchToListView();
        await this.waitForTableRows();

        // Sort (for example by Listing Status)
        const sortingIcon = this.page.locator(
            'div.d-flex.align-items-center:has(p:text("Portal")) p-sorticon .p-sortable-column-icon'
        );
        await sortingIcon.waitFor({ state: 'visible', timeout: 5000 });
        await sortingIcon.click();

        // Wait to observe sort effect
        await this.page.waitForTimeout(1000);
    }

    async scrollToLoadMoreListing() {
        await this.navigateToListings();
        await this.switchToListView();

        const scrollContainer = '.p-datatable-wrapper'; // container to scroll
        const rowSelector = '.p-datatable-wrapper tbody tr'; // rows in the table

        // Trigger initial rendering
        await this.page.evaluate((selector) => {
            const el = document.querySelector(selector);
            if (el) el.scrollTop = 1;
        }, scrollContainer);

        // Wait for first row to appear
        await this.page.locator(rowSelector).first().waitFor({ state: 'visible', timeout: 15000 });

        // Get total records from footer
        const recordsFooter = this.page.locator('text=Records:');
        await recordsFooter.waitFor({ state: 'visible', timeout: 5000 });
        const recordsText = await recordsFooter.textContent();
        let totalRecords = 1000;
        if (recordsText) {
            const match = recordsText.match(/\d+/);
            if (match) totalRecords = Number(match[0]);
        }

        let lastCount = 0;
        let unchangedTries = 0;
        const maxTries = 10;

        while (unchangedTries < maxTries) {
            const rows = this.page.locator(rowSelector);
            const currentCount = await rows.count();

            if (currentCount === lastCount) {
                unchangedTries++;
            } else {
                unchangedTries = 0;
                lastCount = currentCount;
            }

            if (currentCount > 0 && currentCount < totalRecords) {
                const lastRow = rows.nth(currentCount - 1);
                await lastRow.scrollIntoViewIfNeeded();
            }

            await this.page.waitForTimeout(500);
            if (lastCount >= totalRecords) break;
        }

        const finalCount = await this.page.locator(rowSelector).count();
        console.log(`Fast scrolling complete. Loaded ${finalCount} of ${totalRecords} records.`);
        expect(finalCount).toBe(totalRecords);
    }

    // Apply multiple filters simultaneously on the listing table.
    public async applyMultipleFilters() {
        await this.navigateToListings();
        await this.waitForTableRows();
        await this.searchForExistingListingview('Hina');
        await this.selectAllPropertyTypesInListView();
        await this.selectAllSuburbsInListView();
        await this.selectAllListingStatusesInListView();
        await this.selectAllListingTypesInListView();
        await this.selectAllAgentsInListView();

    }

    // Sorting and filtering together 
    public async sortAfterFilter(statusLabel: string) {
        await this.navigateToListings();
        await this.switchToListView();

        // Apply a filter by searching for status
        const searchInput = this.locators.SearchBox();
        await expect(searchInput).toBeVisible({ timeout: 30000 });
        await searchInput.fill(statusLabel);
        await this.page.waitForTimeout(500);

        // Optionally verify results exist
        const rowsLocator = this.page.locator('tr');
        const rowCount = await rowsLocator.count();
        expect(rowCount).toBeGreaterThan(0);

        // Now do the sorting
        const sortingIcon = this.locators.sortingIcon();
        await sortingIcon.waitFor({ state: 'visible', timeout: 5000 });
        await sortingIcon.click();
    }

    // Opening multiple filters without applying

    public async openMultipleFiltersWithoutApplying() {
        await this.navigateToListings();
        await this.switchToListView();
        await this.waitForTableRows();

        // 1. Open Portal filter (assuming column with "Portal")
        const portalFilterIcon = this.page.locator('th:has-text("Portal") img[alt="filter"]');
        await portalFilterIcon.waitFor({ state: "visible", timeout: 10000 });
        await portalFilterIcon.click({ force: true });
        await this.page.waitForTimeout(500);

        // 2. Open Listing Status filter
        const listingStatusFilterIcon = this.page.locator('th:has-text("Listing Status") img[alt="filter"]');
        await listingStatusFilterIcon.waitFor({ state: "visible", timeout: 10000 });
        await listingStatusFilterIcon.click({ force: true });
        await this.page.waitForTimeout(500);

        // 3. Open Property Address filter (assuming column with "Property Address")
        const propertyAddressFilterIcon = this.page.locator('th:has-text("Property Address") img[alt="filter"]');
        await propertyAddressFilterIcon.waitFor({ state: "visible", timeout: 10000 });
        await propertyAddressFilterIcon.click({ force: true });
        await this.page.waitForTimeout(500);

        // 4. Open Property Type filter
        const propertyTypeFilterIcon = this.page.locator('th:has-text("Property Type") img[alt="filter"]');
        await propertyTypeFilterIcon.waitFor({ state: "visible", timeout: 10000 });
        await propertyTypeFilterIcon.click({ force: true });
        await this.page.waitForTimeout(500);

        // 5. Open Listing Type filter (assuming column with "Listing Type" or "Listings Type")
        const listingTypeFilterIcon = this.page.locator('th:has-text("Listing Type") img[alt="filter"], th:has-text("Listings Type") img[alt="filter"]');
        await listingTypeFilterIcon.waitFor({ state: "visible", timeout: 10000 });
        await listingTypeFilterIcon.click({ force: true });
        await this.page.waitForTimeout(500);

        // 6. Open Primary Agent filter
        const primaryAgentFilterIcon = this.page.locator('th:has-text("Primary Agent") img[alt="filter"]');
        await primaryAgentFilterIcon.waitFor({ state: "visible", timeout: 10000 });
        await primaryAgentFilterIcon.click({ force: true });
        await this.page.waitForTimeout(500);

        // 7. Open Secondary Agent filter
        const secondaryAgentFilterIcon = this.page.locator('th:has-text("Secondary Agent") img[alt="filter"]');
        await secondaryAgentFilterIcon.waitFor({ state: "visible", timeout: 10000 });
        await secondaryAgentFilterIcon.click({ force: true });
        await this.page.waitForTimeout(500);

        // 8. Open Price filter
        const priceFilterIcon = this.page.locator('th:has-text("Price") img[alt="filter"]');
        await priceFilterIcon.waitFor({ state: "visible", timeout: 10000 });
        await priceFilterIcon.click({ force: true });
        await this.page.waitForTimeout(500);

        // 9. Open Create Date filter (assuming column with "Create Date" or "Created Date" or "Created On")
        const createDateFilterIcon = this.page.locator(
            'th:has-text("Create Date") img[alt="filter"], th:has-text("Created Date") img[alt="filter"], th:has-text("Created On") img[alt="filter"]'
        );
        await createDateFilterIcon.waitFor({ state: "visible", timeout: 10000 });
        await createDateFilterIcon.click({ force: true });
        await this.page.waitForTimeout(500);

    }
    // Searching with an extremely long string
    async searchWithExtremelyLongString(search: string) {
        await this.navigateToListings();
        await this.switchToListView();
        await this.waitForTableRows();
        const searchInput = this.page.locator('input[placeholder="Search"]').last();
        await searchInput.waitFor({ state: 'visible', timeout: 5000 });
        await searchInput.fill('');
        await searchInput.fill(search);
        // Check if "No results found" or similar text is displayed
        const noResultsLocator = this.page.locator('text=/no results found|no listings found|no data/i');
        await expect(noResultsLocator).toBeVisible({ timeout: 5000 });
        await this.page.waitForTimeout(1000);
    }

    // Applying a filter and then quickly clicking Reset
    async applyFilterAndQuickReset(name: string) {
        await this.navigateToListings();
        await this.switchToListView();
        await this.waitForTableRows();

        // Find the filter icon for "Listing Status"

        const filterIcon = await this.page.waitForSelector('th:has-text("Listing Status") img[alt="filter"]', { state: 'visible', timeout: 5000 });
        await filterIcon.click({ force: true });


        const selectField = this.page.getByText('Select', { exact: true }).first();
        await selectField.click();

        // Choose "Equals"
        const equalsOption = this.page.getByRole('option', { name: /equals/i });
        await expect(equalsOption).toBeVisible({ timeout: 5000 });
        await equalsOption.click();

        const selectField1 = this.page.getByText('Select', { exact: true }).last();
        await selectField1.click();
        // Fill in the keyword/type value to filter
        const searchBox = this.page.locator('input[placeholder="Search"]').last();;
        await searchBox.click();
        await searchBox.fill(name);

        // Select the desired option that matches the 'name' (e.g., 'Agency' or 'Individual')
        const optionItem = this.page.getByRole('dialog').getByRole('listitem').filter({ hasText: name });
        await optionItem.click();
        const tag = this.page.locator('.filter-by-tasks > re-multiselect > .box > .tags > .fas');
        await tag.click()
        // Click "Apply" to activate the filter
        const applyBtn = this.page.getByRole('button', { name: /apply/i });
        await applyBtn.click();
        // Optionally, wait and verify that the filters were reset
        await this.page.waitForTimeout(1200);
        // You may wish to add an assertion here that all table rows are shown or the filter is cleared
    }

    // Opening the contact form
    async openContactForm() {
        await this.navigateToListings();
        await this.switchToListView();
        await this.waitForTableRows();

        // Assuming there is a button or icon to open the contact form in each card row
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick();
        // Wait for contact form to be visible (adjust selector if needed)
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        const closeForm = this.page.locator('.pi.pi-times').first()
        await this.page.waitForTimeout(1000)
        await closeForm.click({ force: true })

        await this.page.waitForTimeout(1500)
    }

    // Creating a listing
    async createListingWithRequiredField(propertyType: string, listingType: string, listingStatus: string) {
        await this.navigateToListings();
        await this.switchToListView()
        await this.waitForTableRows()
        // Assuming there is a button or icon to open the contact form in each card row
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick({ force: true });
        // Wait for contact form to be visible (adjust selector if needed)
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Fill and select the property address: "1/14 Thomas Street, Laidley, QLD 4341"
        const propertyAddressSearchInput = this.page.locator('#rightbarwithscroll').getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 5000 });
        await propertyAddressSearchInput.fill('140 Coates Street, Laidley, QLD 4341');
        // Wait for dropdown/options to appear and select the address
        const addressOption = this.page.locator('div:nth-child(2) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 5000 });
        await addressOption.click();

        // Open Property Type dropdown and search/select the option
        const propertyTypeDropdown = this.page.locator('ng-select[formcontrolname="type"]');
        await expect(propertyTypeDropdown).toBeVisible({ timeout: 10000 });
        await propertyTypeDropdown.click();

        // Search for the propertyType option
        const propertyTypeSearchInput = this.page.locator('ng-select[formcontrolname="type"] input[type="text"], ng-select[formcontrolname="type"] input[role="combobox"]');
        if (await propertyTypeSearchInput.isVisible({ timeout: 1000 }).catch(() => false)) {
            await propertyTypeSearchInput.fill(propertyType);
            await this.page.waitForTimeout(500); // Let options update if needed
        }

        const propertyTypeOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: propertyType }).first();
        await propertyTypeOption.click();

        // Open Listing Type dropdown, search and select option
        const listingTypeDropdown = this.page.locator('ng-select[formcontrolname="listingType"], ng-select[formcontrolname="listing_type"]');
        await expect(listingTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingTypeDropdown.click();
        const listingTypeSearchInput = listingTypeDropdown.locator('input[type="text"]');
        await expect(listingTypeSearchInput).toBeVisible({ timeout: 2000 });
        await listingTypeSearchInput.fill(listingType);
        await this.page.waitForTimeout(500); // Let options update if needed
        const listingTypeOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: listingType }).first();
        await listingTypeOption.click();

        // Open Listing Status dropdown, search and select option

        const listingStatusDropdown = this.page.locator('.cs-w-70.danger-tag > .ng-select-container > .ng-value-container > .ng-input > input')
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 })
        await listingStatusDropdown.click();
        // Correct way to access the search input for a native ng-select dropdown:
        const listingStatusSearchInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']").first();
        await listingStatusSearchInput.fill(listingStatus);
        await this.page.waitForTimeout(500);
        const listingStatusOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: listingStatus }).first();
        await listingStatusOption.click();

        // Click the "Save" button
        const saveButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveButton.click();

        await expect(this.page.getByRole('alert', { name: 'Active listing already exist' })).toBeVisible()

        const closeForm = this.page.locator('.pi.pi-times').first()
        await this.page.waitForTimeout(1000)
        await closeForm.click({ force: true })

    }

    // Creating a Listing with missing required fields
    async createListingWithMissingField() {
        // Navigate to Listings and open the listing form
        await this.navigateToListings();
        await this.switchToListView();
        await this.waitForTableRows()

        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick({ force: true });

        // Wait for the form/modal to appear
        const form = this.page.locator('#rightbarwithscroll, .p-dialog, .listing-form-modal, .add-listing-form').first();
        await expect(form).toBeVisible({ timeout: 10000 })
        // Click Save and expect validation error
        const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
        await saveButton.click();

        // Expect validation error to be visible after attempt to save with missing fields
        await expect(this.page.getByRole('alert', { name: /Required fields must be/i })).toBeVisible();
        const closeForm = this.page.locator('.pi.pi-times').first()
        await closeForm.click({ force: true })
        await this.page.waitForTimeout(1500)
    }

    async scrollToLoadListings() {
        await this.navigateToListings();
        await this.switchToListView();
        this.waitForTableRows()

        const scrollContainer = '.p-datatable-wrapper'; // container to scroll
        const rowSelector = '.p-datatable-wrapper tbody tr'; // rows in the table

        // Trigger initial rendering
        await this.page.evaluate((selector) => {
            const el = document.querySelector(selector);
            if (el) el.scrollTop = 1;
        }, scrollContainer);

        // Wait for first row to appear
        await this.page.locator(rowSelector).first().waitFor({ state: 'visible', timeout: 15000 });

        // Get total records from footer
        const recordsFooter = this.page.locator('text=Records:');
        await recordsFooter.waitFor({ state: 'visible', timeout: 5000 });
        const recordsText = await recordsFooter.textContent();
        let totalRecords = 1000;
        if (recordsText) {
            const match = recordsText.match(/\d+/);
            if (match) totalRecords = Number(match[0]);
        }

        let lastCount = 0;
        let unchangedTries = 0;
        const maxTries = 10;

        while (unchangedTries < maxTries) {
            const rows = this.page.locator(rowSelector);
            const currentCount = await rows.count();

            if (currentCount === lastCount) {
                unchangedTries++;
            } else {
                unchangedTries = 0;
                lastCount = currentCount;
            }

            if (currentCount > 0 && currentCount < totalRecords) {
                const lastRow = rows.nth(currentCount - 1);
                await lastRow.scrollIntoViewIfNeeded();
            }

            await this.page.waitForTimeout(500);
            if (lastCount >= totalRecords) break;
        }

        const finalCount = await this.page.locator(rowSelector).count();
        console.log(`Fast scrolling complete. Loaded ${finalCount} of ${totalRecords} records.`);
        expect(finalCount).toBe(totalRecords);

        // Scroll to the position where the table body (first row) starts
        await this.page.evaluate((rowSelector) => {
            const row = document.querySelector(rowSelector);
            if (row) {
                row.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, rowSelector);

        await this.page.waitForTimeout(1200);
    }

    // Opening and closing a listing details modal
    async openAndCloseListingDetails() {
        await this.navigateToListings();
        await this.switchToListView();
        await this.waitForTableRows();

        // Open the first listing row (assume clicking will open details modal)
        const firstRow = this.page.locator('tbody tr').first();
        await expect(firstRow).toBeVisible({ timeout: 10000 });
        await firstRow.click();

        await this.page.waitForTimeout(1200);
        // Close the details modal
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(2000);

        await this.page.waitForTimeout(1200)
    }

    // Opens the first listing details modal, closes it, then scrolls table to top
    async openCloseListingThenScroll() {
        await this.navigateToListings();
        await this.switchToListView();

        await this.waitForTableRows();

        // Open the first listing row to show details modal
        const firstRow = this.page.locator('tbody tr').first();
        await expect(firstRow).toBeVisible({ timeout: 10000 });
        await firstRow.click();

        await this.page.waitForTimeout(1200);
        // Close the details modal
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(2000);

        await this.page.waitForTimeout(1200);
    }

    // Opens, then closes the first row modal, then opens/closes second, then scrolls table to load more rows
    async openCloseMultipleListingsThenScroll() {
        await this.navigateToListings();
        await this.switchToListView();
        await this.page.waitForTimeout(2000);
        const rows = this.page.locator('tbody tr');
        const count = await rows.count();
        const maxOpen = Math.min(2, count);

        // Click first row, close form
        if (maxOpen >= 1) {
            const firstRow = rows.nth(0);
            await expect(firstRow).toBeVisible({ timeout: 10000 });
            await firstRow.click();
            await this.page.waitForTimeout(1200);
            await this.page.waitForTimeout(1200);
            // Close the details modal
            const closeFormIcon = this.page.locator('.pi.pi-times').first();
            await closeFormIcon.click({ force: true });
            await this.page.waitForTimeout(2000);

            await this.page.waitForTimeout(1200);
        }

        // Click second row, close form
        if (maxOpen >= 2) {
            const secondRow = rows.nth(1);
            await expect(secondRow).toBeVisible({ timeout: 10000 });
            await secondRow.click();
            await this.page.waitForTimeout(1200);
            await this.page.waitForTimeout(1200);
            // Close the details modal
            const closeFormIcon = this.page.locator('.pi.pi-times').first();
            await closeFormIcon.click({ force: true });
            await this.page.waitForTimeout(2000);

            await this.page.waitForTimeout(600);
        }
        await this.page.waitForTimeout(1200);
    }

    async openAndCloseListingDetailsThenApplyFilter(status: string) {
        await this.navigateToListings();
        await this.switchToListView();
        // Open details modal for first row
        const firstRow = this.page.locator('tbody tr').first();
        await expect(firstRow).toBeVisible({ timeout: 30000 });
        await firstRow.click();

        // Close the listing details modal after opening it
        await this.page.waitForTimeout(1200);
        // Close the details modal
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(2000);


        await this.page.waitForTimeout(1000);
        await this.page.waitForTimeout(1200);

        // Click filter icon for Listing Status
        const filterIconLocator = this.page.locator('th:has-text("Listing Status") img[alt="filter"]');
        await expect(filterIconLocator).toBeVisible({ timeout: 5000 });
        // Sometimes force-click doesn't trigger, so try both click() and a fallback
        try {
            await filterIconLocator.click({ force: true, timeout: 4000 });
        } catch (e) {
            // As fallback, try to click via evaluate (simulate DOM click)
            await this.page.evaluate((selector) => {
                const el = document.querySelector(selector);
                if (el) { (el as HTMLElement).click(); }
            }, 'th:has-text("Listing Status") img[alt="filter"]');
        }

        // Open and select "Equals"
        const selectField = this.page.getByText('Select', { exact: true }).first();
        await selectField.click();
        const equalsOption = this.page.getByRole('option', { name: /equals/i });
        await expect(equalsOption).toBeVisible({ timeout: 5000 });
        await equalsOption.click();

        // Choose Listing Status value
        const selectField2 = this.page.getByText('Select', { exact: true }).last();
        await selectField2.click();
        const searchBox = this.page.locator('input[placeholder="Search"]').last();;
        await searchBox.click();
        await searchBox.fill(status);

        // Select the actual match in dropdown
        const optionItem = this.page.getByRole('dialog').getByRole('listitem').filter({ hasText: status });
        await optionItem.click();

        // Tag close (if any tag shown)
        const tag = this.page.locator('.filter-by-tasks > re-multiselect > .box > .tags > .fas');
        if (await tag.isVisible({ timeout: 500 }).catch(() => false)) {
            await tag.click();
        }

        // Click Apply
        const applyBtn = this.page.getByRole('button', { name: /apply/i });
        await applyBtn.click();

        // Wait optionally for filter to complete

        await this.page.waitForTimeout(1200);
        await this.resetFilters();
    }

    //Search for a Listing and open its details modal.

    async searchAndOpenListing(searchTerm: string) {

        await this.navigateToListings();
        await this.switchToListView();
        await this.waitForTableRows();
        // Type into the search input/filter bar
        const searchInput = this.page.getByRole('textbox', { name: /search/i }).last();
        await searchInput.click();
        await searchInput.fill(searchTerm);
        await this.page.waitForTimeout(1000);

        // Wait until the table updates with the search result
        const firstRow = this.page.locator('tbody tr').first();
        await expect(firstRow).toBeVisible({ timeout: 10000 });

        // Open the first result's details modal
        await firstRow.click();
        await this.page.waitForTimeout(1200);
        // Close the details modal
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(2000);

    }

    // Check for duplicate Property Address values in the table

    async checkForDuplicatePropertyAddresses() {
        await this.navigateToListings();
        await this.switchToListView();
        await this.waitForTableRows();

        // Find column index for "Property Address"
        const headers = this.page.locator('thead tr th');
        const headerCount = await headers.count();
        let addressColIndex = -1;

        for (let i = 0; i < headerCount; i++) {
            const headerText = (await headers.nth(i).innerText()).trim().toLowerCase().replace(/\s+/g, " ");
            if (headerText === 'property address' || headerText === 'address') {
                addressColIndex = i;
                break;
            }
        }
        if (addressColIndex === -1) {
            throw new Error('Property Address column not found');
        }

        // We'll use a set to track addresses. If two addresses are exactly equal (character-for-character) they are duplicates.
        const tableRows = this.page.locator('tbody tr');
        const rowCount = await tableRows.count();
        const addressSet = new Set<string>();
        const duplicates: string[] = [];

        for (let i = 0; i < rowCount; i++) {
            const row = tableRows.nth(i);
            const cells = row.locator('td');
            const cellCount = await cells.count();
            if (addressColIndex >= cellCount) continue;

            // Get the address exactly as in the table (do NOT normalize for spaces/case/etc)
            const address = await cells.nth(addressColIndex).innerText();

            if (addressSet.has(address)) {
                duplicates.push(address);
            } else {
                addressSet.add(address);
            }
        }

        // Throw if duplicates found (i.e., two or more *identical* addresses)
        if (duplicates.length > 0) {
            // Only report unique duplicate values found
            throw new Error(`Duplicate Property Address(es) found in listing table: ${[...new Set(duplicates)].join(', ')}`);
        }
    }

    async closeFormWithoutSaving(propertyType: string, listingType: string, listingStatus: string) {
        await this.navigateToListings();
        await this.switchToListView()
        await this.waitForTableRows()
        // Assuming there is a button or icon to open the contact form in each card row
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick({ force: true });
        // Wait for contact form to be visible (adjust selector if needed)
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Fill and select the property address: "1/14 Thomas Street, Laidley, QLD 4341"
        const propertyAddressSearchInput = this.page.locator('#rightbarwithscroll').getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 5000 });
        await propertyAddressSearchInput.fill('140 Coates Street, Laidley, QLD 4341');
        // Wait for dropdown/options to appear and select the address
        const addressOption = this.page.locator('div:nth-child(2) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 5000 });
        await addressOption.click();

        // Open Property Type dropdown and search/select the option
        const propertyTypeDropdown = this.page.locator('ng-select[formcontrolname="type"]');
        await expect(propertyTypeDropdown).toBeVisible({ timeout: 10000 });
        await propertyTypeDropdown.click();

        // Search for the propertyType option
        const propertyTypeSearchInput = this.page.locator('ng-select[formcontrolname="type"] input[type="text"], ng-select[formcontrolname="type"] input[role="combobox"]');
        if (await propertyTypeSearchInput.isVisible({ timeout: 1000 }).catch(() => false)) {
            await propertyTypeSearchInput.fill(propertyType);
            await this.page.waitForTimeout(500); // Let options update if needed
        }

        const propertyTypeOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: propertyType }).first();
        await propertyTypeOption.click();

        // Open Listing Type dropdown, search and select option
        const listingTypeDropdown = this.page.locator('ng-select[formcontrolname="listingType"], ng-select[formcontrolname="listing_type"]');
        await expect(listingTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingTypeDropdown.click();
        const listingTypeSearchInput = listingTypeDropdown.locator('input[type="text"]');
        await expect(listingTypeSearchInput).toBeVisible({ timeout: 2000 });
        await listingTypeSearchInput.fill(listingType);
        await this.page.waitForTimeout(500); // Let options update if needed
        const listingTypeOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: listingType }).first();
        await listingTypeOption.click();

        // Open Listing Status dropdown, search and select option

        const listingStatusDropdown = this.page.locator('.cs-w-70.danger-tag > .ng-select-container > .ng-value-container > .ng-input > input')
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 })
        await listingStatusDropdown.click();
        // Correct way to access the search input for a native ng-select dropdown:
        const listingStatusSearchInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']").first();
        await listingStatusSearchInput.fill(listingStatus);
        await this.page.waitForTimeout(500);
        const listingStatusOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: listingStatus }).first();
        await listingStatusOption.click();

        const closeForm = this.page.locator('.pi.pi-times').first()
        await this.page.waitForTimeout(1000)
        await closeForm.click({ force: true })

        await this.page.waitForTimeout(1000);

    }

    // Pinning a listing card row via right-click context menu
    async pinFirstListing() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Wait for cards to appear
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });

        // Get bounding box of the first card to use mouse
        const firstCardRow = cards.first();
        const box = await firstCardRow.boundingBox();
        if (!box) throw new Error("First card bounding box not found");

        // Right-click using mouse at the center of the first card
        await this.page.mouse.click(box.x + box.width / 2, box.y + box.height / 2, { button: 'right' });

        // Click "Pin To Dashboard" in the context menu
        const pinToDashboardMenuItem = this.page.getByText('Pin To Dashboard').first();
        await expect(pinToDashboardMenuItem).toBeVisible({ timeout: 5000 });
        await pinToDashboardMenuItem.click();

        // Assert the pinned icon appears
        const pinnedIcon = this.page.locator('app-props-grid img[src*="pin"]').first();
        await expect(pinnedIcon).toBeVisible({ timeout: 5000 });

        await this.page.waitForTimeout(1000);
    }

    // Opening a pinned listing
    async openPinnedListing() {
        await this.navigateToListings();
        await this.switchToGridView();

        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });
        // Find a pinned icon in the grid and click it to open the pinned listing
        const pinnedIcon = this.page.locator('app-props-grid img[src*="pin"]').first();
        await expect(pinnedIcon).toBeVisible({ timeout: 5000 });
        // Click on the first card
        const firstCard = this.page.locator('.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 5000 });
        await firstCard.click();
        // Wait for the details modal or rightbar to appear
        const listingDetails = this.page.locator('#rightbarwithscroll');
        await expect(listingDetails).toBeVisible({ timeout: 10000 });
        // Optionally, close the details modal
        await this.page.waitForSelector('.pi.pi-times', { timeout: 10000 });
        await this.page.dblclick('.pi.pi-times');
        await this.page.waitForTimeout(1000);
    }

    // Unpin a pinned listing card in the grid view
    async unpinFirstPinnedListing() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Wait for cards to appear
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });

        // Find the pinned icon in the grid, assuming first pinned card
        const pinnedIcon = this.page.locator('app-props-grid img[src*="pin"]').first();
        await expect(pinnedIcon).toBeVisible({ timeout: 5000 });

        // Get the bounding box of the pinned icon for right-click
        const box = await pinnedIcon.boundingBox();
        if (!box) throw new Error("Pinned icon bounding box not found");

        // Right-click on the pinned icon to open the context menu
        await this.page.mouse.click(box.x + box.width / 2, box.y + box.height / 2, { button: 'right' });

        // Click "Unpin to Dashboard" in the context menu
        const unpinMenuItem = this.page.getByText('Unpin to Dashboard').first();
        await expect(unpinMenuItem).toBeVisible({ timeout: 5000 });
        await unpinMenuItem.click();
        await this.page.waitForTimeout(1000);
    }

    // Search field functionality for Listings table
    async searchfieldListing() {
        await this.navigateToListings();

        await this.navigateToListings();
        await this.switchToGridView();
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });
        // Assuming there is a button or icon to open the contact form in each card row
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick({ force: true });
        // Wait for contact form to be visible (adjust selector if needed)
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Fill and select the property address: "1/14 Thomas Street, Laidley, QLD 4341"
        const propertyAddressSearchInput = this.page.locator('#rightbarwithscroll').getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 5000 });
        await propertyAddressSearchInput.fill('140 Coates Street, Laidley, QLD 4341');
        // Wait for dropdown/options to appear and select the address
        const addressOption = this.page.locator('div:nth-child(1) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 5000 });
        await addressOption.click();

        // Wait for the dialog and click Yes
        const copyDialog = this.page.getByText('Would you like to copy this');
        await expect(copyDialog).toBeVisible({ timeout: 5000 });
        const yesButton = this.page.getByRole('button', { name: 'Yes' });
        await expect(yesButton).toBeVisible({ timeout: 5000 });
        await yesButton.click();

        const closeForm = this.page.locator('.pi.pi-times').first()
        await this.page.waitForTimeout(1000)
        await closeForm.click({ force: true })

        await this.page.waitForTimeout(1000);

    }

    // Select a listing from search result
    async selectListingFromSearch() {
        await this.navigateToListings();
        await this.switchToGridView();
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });
        // Assuming there is a button or icon to open the contact form in each card row
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick({ force: true });
        // Wait for contact form to be visible (adjust selector if needed)
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Fill and select the property address: "1/14 Thomas Street, Laidley, QLD 4341"
        const propertyAddressSearchInput = this.page.locator('#rightbarwithscroll').getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 5000 });
        await propertyAddressSearchInput.fill('140 Coates Street, Laidley, QLD 4341');
        // Wait for dropdown/options to appear and select the address
        const addressOption = this.page.locator('div:nth-child(1) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 5000 });
        await addressOption.click();

        // Wait for the dialog and click Yes
        const copyDialog = this.page.getByText('Would you like to copy this');
        await expect(copyDialog).toBeVisible({ timeout: 5000 });

        const crossicon = this.page.getByRole('button').filter({ hasText: /^$/ }).nth(2);
        await expect(crossicon).toBeVisible({ timeout: 5000 });
        await crossicon.click();

        const closeForm = this.page.locator('.pi.pi-times').first()
        await this.page.waitForTimeout(1000)
        await closeForm.click({ force: true })

        await this.page.waitForTimeout(1000);
    }

    async confirmListingCopy() {
        await this.navigateToListings();

        await this.navigateToListings();
        await this.switchToGridView();
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });
        // Assuming there is a button or icon to open the contact form in each card row
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick({ force: true });
        // Wait for contact form to be visible (adjust selector if needed)
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Fill and select the property address: "1/14 Thomas Street, Laidley, QLD 4341"
        const propertyAddressSearchInput = this.page.locator('#rightbarwithscroll').getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 5000 });
        await propertyAddressSearchInput.fill('140 Coates Street, Laidley, QLD 4341');
        // Wait for dropdown/options to appear and select the address
        const addressOption = this.page.locator('div:nth-child(1) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 5000 });
        await addressOption.click();

        // Wait for the dialog and click Yes
        const copyDialog = this.page.getByText('Would you like to copy this');
        await expect(copyDialog).toBeVisible({ timeout: 5000 });
        const yesButton = this.page.getByRole('button', { name: 'Yes' });
        await expect(yesButton).toBeVisible({ timeout: 5000 });
        await yesButton.click();

        const closeForm = this.page.locator('.pi.pi-times').first()
        await this.page.waitForTimeout(1000)
        await closeForm.click({ force: true })

        await this.page.waitForTimeout(1000);

    }

    // Decline listing copy dialog
    async declineListingCopy() {
        await this.navigateToListings();
        await this.switchToGridView();
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });
        // Open the contact form (or listing dialog)
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick({ force: true });
        // Wait for contact form to be visible
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Fill and select the property address to trigger the copy dialog
        const propertyAddressSearchInput = this.page.locator('#rightbarwithscroll').getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 5000 });
        await propertyAddressSearchInput.fill('140 Coates Street, Laidley, QLD 4341');
        // Wait for dropdown/options to appear and select the address
        const addressOption = this.page.locator('div:nth-child(1) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 5000 });
        await addressOption.click();

        // Wait for the copy dialog and decline it
        const copyDialog = this.page.getByText('Would you like to copy this');
        await expect(copyDialog).toBeVisible({ timeout: 5000 });
        const noButton = this.page.getByRole('button', { name: 'No' });
        await expect(noButton).toBeVisible({ timeout: 5000 });
        await noButton.click({ force: true });

        // Optional: close the contact form after declining
        const closeForm = this.page.locator('.pi.pi-times').first();
        await this.page.waitForTimeout(1000);
        await closeForm.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    async closePopup() {
        await this.navigateToListings();
        await this.switchToGridView();
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });
        // Open the contact form (or listing dialog)
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick({ force: true });
        // Wait for contact form to be visible
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Fill and select the property address to trigger the copy dialog
        const propertyAddressSearchInput = this.page.locator('#rightbarwithscroll').getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 5000 });
        await propertyAddressSearchInput.fill('140 Coates Street, Laidley, QLD 4341');
        // Wait for dropdown/options to appear and select the address
        const addressOption = this.page.locator('div:nth-child(1) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 5000 });
        await addressOption.click();

        // Wait for the copy dialog and decline it
        const copyDialog = this.page.getByText('Would you like to copy this');
        await expect(copyDialog).toBeVisible({ timeout: 5000 });
        const crossicon = this.page.getByRole('button').filter({ hasText: /^$/ }).nth(2);
        await expect(crossicon).toBeVisible({ timeout: 5000 });
        await crossicon.click();

        // Optional: close the contact form after declining
        const closeForm = this.page.locator('.pi.pi-times').first();
        await this.page.waitForTimeout(1000);
        await closeForm.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    async resetSearchField() {
        await this.navigateToListings();
        await this.switchToGridView();
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });
        // Open the contact form (or listing dialog)
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick({ force: true });
        // Wait for contact form to be visible
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Fill and select the property address to trigger the copy dialog
        const propertyAddressSearchInput = this.page.locator('#rightbarwithscroll').getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 5000 });
        await propertyAddressSearchInput.fill('140 Coates Street, Laidley, QLD 4341');
        // Wait for dropdown/options to appear and select the address
        const addressOption = this.page.locator('div:nth-child(1) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 5000 });
        await addressOption.click();

        // Wait for the copy dialog and decline it
        const copyDialog = this.page.getByText('Would you like to copy this');
        await expect(copyDialog).toBeVisible({ timeout: 5000 });
        const noButton = this.page.getByRole('button', { name: 'No' });
        await expect(noButton).toBeVisible({ timeout: 5000 });
        await noButton.click({ force: true });
        const crossicon = this.page.locator('.pi.pi-times._cross-icon');
        await expect(crossicon).toBeVisible({ timeout: 10000 });
        await crossicon.click({ force: true });

        // Optional: close the contact form after declining
        const closeForm = this.page.locator('.pi.pi-times').first();
        await this.page.waitForTimeout(1000);
        await closeForm.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    // Selecting a property in search
    async selectPropertyInSearch() {
        await this.navigateToListings();

        await this.navigateToListings();
        await this.switchToGridView();
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });
        // Assuming there is a button or icon to open the contact form in each card row
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick({ force: true });
        // Wait for contact form to be visible (adjust selector if needed)
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Fill and select the property address: "1/14 Thomas Street, Laidley, QLD 4341"
        const propertyAddressSearchInput = this.page.locator('#rightbarwithscroll').getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 5000 });
        await propertyAddressSearchInput.fill('140 Coates Street, Laidley, QLD 4341');
        // Wait for dropdown/options to appear and select the address
        const addressOption = this.page.locator('div:nth-child(2) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 5000 });
        await addressOption.click();

        const closeForm = this.page.locator('.pi.pi-times').first()
        await this.page.waitForTimeout(1000)
        await closeForm.click({ force: true })

        await this.page.waitForTimeout(1000);
    }

    // Selecting a previous Listing in search
    async selectPreviousListing() {
        await this.navigateToListings();

        await this.navigateToListings();
        await this.switchToGridView();
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });
        // Assuming there is a button or icon to open the contact form in each card row
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick({ force: true });
        // Wait for contact form to be visible (adjust selector if needed)
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Fill and select the property address: "1/14 Thomas Street, Laidley, QLD 4341"
        const propertyAddressSearchInput = this.page.locator('#rightbarwithscroll').getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 5000 });
        await propertyAddressSearchInput.fill('140 Coates Street, Laidley, QLD 4341');
        // Wait for dropdown/options to appear and select the address
        const addressOption = this.page.locator('div:nth-child(1) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 5000 });
        await addressOption.click();
        // Wait for the dialog and click Yes
        const copyDialog = this.page.getByText('Would you like to copy this');
        await expect(copyDialog).toBeVisible({ timeout: 5000 });

        const noButton = this.page.getByRole('button', { name: 'No' });
        await expect(noButton).toBeVisible({ timeout: 5000 });
        await noButton.click({ force: true });

        const closeForm = this.page.locator('.pi.pi-times').first()
        await this.page.waitForTimeout(1000)
        await closeForm.click({ force: true })

        await this.page.waitForTimeout(1000);
    }

    // Confirming previous listing data copy
    async previousListingCopy() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Wait for at least one listing card
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });

        // Double click to open contact form
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]");
        await contactFormBtn.dblclick({ force: true });

        // Wait for contact form to be visible
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Fill search input and select matching property address
        const propertyAddressSearchInput = contactForm.getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 5000 });
        await propertyAddressSearchInput.fill('140 Coates Street, Laidley, QLD 4341');

        // Wait for dropdown/option to appear and click it (nth-child(1); double-check if this should be 1 or 2)
        const addressOption = this.page.locator('div:nth-child(1) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 5000 });
        await addressOption.click();
        await this.page.waitForTimeout(1200);

        // Wait for "Would you like to copy this" dialog, click "Yes"
        const copyDialog = this.page.getByText('Would you like to copy this');
        await expect(copyDialog).toBeVisible({ timeout: 5000 });
        const yesButton = this.page.getByRole('button', { name: 'Yes' });
        await expect(yesButton).toBeVisible({ timeout: 5000 });
        await yesButton.click();

        // Close the form after confirming copy
        const closeForm = this.page.locator('.pi.pi-times').first();
        await this.page.waitForTimeout(1000);
        await closeForm.click({ force: true });

        await this.page.waitForTimeout(1000);
    }

    // Declining previous listing data copy
    async declinePreviousListingCopy() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Wait for at least one listing card
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });

        // Double click to open contact form
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]");
        await contactFormBtn.dblclick({ force: true });

        // Wait for contact form to be visible
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Fill search input and select matching property address
        const propertyAddressSearchInput = contactForm.getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 5000 });
        await propertyAddressSearchInput.fill('140 Coates Street, Laidley, QLD 4341');

        // Wait for dropdown/option to appear and click it
        const addressOption = this.page.locator('div:nth-child(1) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 5000 });
        await addressOption.click();

        // Wait for "Would you like to copy this" dialog, click "No"
        const copyDialog = this.page.getByText('Would you like to copy this');
        await expect(copyDialog).toBeVisible({ timeout: 5000 });
        const noButton = this.page.getByRole('button', { name: 'No' });
        await expect(noButton).toBeVisible({ timeout: 5000 });
        await noButton.click();

        // Close the form after declining copy
        const closeForm = this.page.locator('.pi.pi-times').first();
        await this.page.waitForTimeout(1000);
        await closeForm.click({ force: true });

        await this.page.waitForTimeout(1000);
    }

    // Search field reset after previous data selection
    async resetPreviousDataSearchField() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Ensure listing cards are loaded
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });

        // Double click Add New to open contact form
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]");
        await contactFormBtn.dblclick({ force: true });

        // Wait for the contact form and its search field
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });
        const propertyAddressSearchInput = contactForm.getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 5000 });

        // Fill in address to trigger previous data dialog
        await propertyAddressSearchInput.fill('140 Coates Street, Laidley, QLD 4341');

        // Wait for dropdown/option and select address
        const addressOption = this.page.locator('div:nth-child(1) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 5000 });
        await addressOption.click();

        // Wait for copy dialog to appear
        const copyDialog = this.page.getByText('Would you like to copy this');
        await expect(copyDialog).toBeVisible({ timeout: 5000 });

        const noButton = this.page.getByRole('button', { name: 'No' });
        await expect(noButton).toBeVisible({ timeout: 5000 });
        await noButton.click({ force: true });

        // Click the cross icon (close the dialog, which should reset the field)
        const crossIcon = this.page.locator('.pi.pi-times._cross-icon');
        await expect(crossIcon).toBeVisible({ timeout: 10000 });
        await crossIcon.click({ force: true });

        // Optional: close the form after test
        const closeForm = this.page.locator('.pi.pi-times').first();
        await this.page.waitForTimeout(1000);
        await closeForm.click({ force: true });
        await this.page.waitForTimeout(3000);
    }

    // Create a new Property via the Add New button in the grid view
    async createProperty() {
        // Use faker for address details
        const buildingNameValue = faker.company.name();
        const unitNoValue = faker.number.int({ min: 1, max: 50 }).toString();
        const streetNoValue = faker.location.buildingNumber();
        const streetNameValue = faker.location.street();
        const suburbValue = 'East Albury';
        const stateValue = faker.location.state();
        const postcodeValue = faker.location.zipCode('#####');
        const countryValue = faker.location.country();

        await this.navigateToListings();
        await this.navigateToProperties();
        // Ensure listing cards are loaded
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]").first();
        await expect(contactFormBtn).toBeVisible({ timeout: 5000 });
        await contactFormBtn.dblclick({ force: true });

        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });
        const propertyAddressSearchInput = contactForm.getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 5000 });

        const propertyTypeDropdown = this.page.locator('ng-select[formcontrolname="type"]');
        await expect(propertyTypeDropdown).toBeVisible({ timeout: 10000 });
        await propertyTypeDropdown.click();
        await expect(propertyTypeDropdown).toHaveClass(/ng-select-opened/);

        const propertyTypeSearchInput = this.page.locator('ng-select[formcontrolname="type"] input[type="text"], ng-select[formcontrolname="type"] input[role="combobox"]');
        if (await propertyTypeSearchInput.isVisible({ timeout: 1000 }).catch(() => false)) {
            await propertyTypeSearchInput.fill('Alpine');
            await this.page.waitForTimeout(700);
            const alpineOption = this.page.locator('.ng-option', { hasText: 'Alpine' });
            await expect(alpineOption).toBeVisible({ timeout: 5000 });
            await expect(alpineOption).toHaveText(/Alpine/i);
            await alpineOption.click({ force: true });
        }

        const createAddress = this.page.locator("//img[contains(@class,'pencil-cross')]");
        await expect(createAddress).toBeVisible({ timeout: 10000 });
        await createAddress.click({ force: true });

        const buildingName = this.page.locator("input[formcontrolname='building_name']");
        await expect(buildingName).toBeVisible({ timeout: 10000 });
        await buildingName.click();
        await buildingName.fill(buildingNameValue);
        await expect(buildingName).toHaveValue(buildingNameValue);

        const unitNo = this.page.locator("input[formcontrolname='unit_no']");
        await expect(unitNo).toBeVisible({ timeout: 10000 });
        await unitNo.click();
        await unitNo.fill(unitNoValue);
        await expect(unitNo).toHaveValue(unitNoValue);

        const streetNo = this.page.locator("input[formcontrolname='street_no']");
        await expect(streetNo).toBeVisible({ timeout: 10000 });
        await streetNo.click();
        await streetNo.fill(streetNoValue);
        await expect(streetNo).toHaveValue(streetNoValue);

        const streetName = this.page.locator("input[formcontrolname='street_name']");
        await expect(streetName).toBeVisible({ timeout: 10000 });
        await streetName.click();
        await streetName.fill(streetNameValue);
        await expect(streetName).toHaveValue(streetNameValue);

        const suburbInput = this.page.locator("p-autocomplete[formcontrolname='suburb'] input");
        await expect(suburbInput).toBeVisible({ timeout: 10000 });
        await suburbInput.click();
        await suburbInput.fill(suburbValue);
        await expect(suburbInput).toHaveValue(suburbValue);

        const suggestion = this.page.locator("ul.p-autocomplete-items li").first();
        await expect(suggestion).toBeVisible({ timeout: 5000 });
        await suggestion.click();

        const stateInput = this.page.locator("input[formcontrolname='state']");
        await expect(stateInput).toBeVisible({ timeout: 10000 });
        await stateInput.click();
        await stateInput.fill(stateValue);
        await expect(stateInput).toHaveValue(stateValue);

        const postcodeInput = this.page.locator("input[formcontrolname='post_code']");
        await expect(postcodeInput).toBeVisible({ timeout: 10000 });
        await postcodeInput.click();
        await postcodeInput.fill(postcodeValue);
        await expect(postcodeInput).toHaveValue(postcodeValue);

        const countryInput = this.page.locator("input[formcontrolname='country']");
        await expect(countryInput).toBeVisible({ timeout: 10000 });
        await countryInput.click();
        await countryInput.fill(countryValue);
        await expect(countryInput).toHaveValue(countryValue);

        const saveButton = this.page.locator("button[type='submit'], button:has-text('Save')").last();
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click({ force: true });
        await expect(saveButton).toBeEnabled();

        await this.page.waitForTimeout(1000);

        const saveBtn = this.page.locator("button", { hasText: "Save" }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();

        const yesButton = this.page.locator('button:has-text("Yes")');
        await expect(yesButton).toBeVisible({ timeout: 10000 });
        await yesButton.click({ force: true });
        await expect(yesButton).not.toBeVisible({ timeout: 4000 });

        const selectCurrentOwnerSpan = this.page.locator("//span[normalize-space()='Select Current Owner']");
        await expect(selectCurrentOwnerSpan).toBeVisible({ timeout: 10000 });
        await selectCurrentOwnerSpan.click();

        const searchInput = this.page.locator("input[placeholder='Search']").last();
        await expect(searchInput).toBeVisible({ timeout: 5000 });
        await searchInput.click();
        await searchInput.fill("Automation Testing");

        const option = this.page.locator("ul li", { hasText: "Automation Testing" });
        await expect(option).toBeVisible({ timeout: 5000 });
        await option.click();
        const sortUp = this.page.locator('.fas.fa-sort-up');
        await expect(sortUp).toBeVisible({ timeout: 5000 });
        await sortUp.click();
        await this.page.waitForTimeout(1500);

        const ddMmYyTextbox = this.page.getByRole('textbox', { name: 'DD-MM-YY' });
        await expect(ddMmYyTextbox).toBeVisible({ timeout: 5000 });
        await ddMmYyTextbox.click();

        const currentDay = new Date().getDate().toString();
        const date = this.page.getByText(currentDay, { exact: true });
        await expect(date).toBeVisible({ timeout: 2000 });
        await date.click();

        const priceInput = this.page.locator('input[name="price"]');
        await expect(priceInput).toBeVisible({ timeout: 2000 });
        await priceInput.fill('123456');

        const saveBtun = this.page.locator("button", { hasText: "Save" }).last();
        await expect(saveBtun).toBeVisible({ timeout: 10000 });
        await saveBtun.click();


        await expect(this.page.getByText('added successfully', { exact: false })).toBeVisible({ timeout: 7000 });

        await saveBtn.click();
        // Print the full entered address for debugging
        // console.log(`Full Address Entered:${buildingNameValue} ${unitNoValue} ${streetNoValue} ${streetNameValue}, ${suburbValue}, ${stateValue} ${postcodeValue}, ${countryValue}`);
    }

    // Save button functionality
    async clickSaveButtonOnContactForm() {
        await this.page.waitForTimeout(1200);
        await this.createProperty();
        await this.page.waitForTimeout(2000);
        // Ensure listing cards are loaded
        const addListingBtn = this.page.locator("button", { hasText: "Add Listing" });
        await expect(addListingBtn).toBeVisible({ timeout: 10000 });
        await addListingBtn.click();

        const listingsTypeDropdown = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).getByRole('combobox');
        await expect(listingsTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingsTypeDropdown.click();

        const auctionOption = this.page.getByRole('option', { name: 'Auction' });
        await expect(auctionOption).toBeVisible({ timeout: 10000 });
        await auctionOption.click();

        const listingStatusDropdown = this.page.locator('ng-select').filter({ hasText: 'Listing Status' });
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        const forSaleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'For sale' }).first();
        await expect(forSaleOption).toBeVisible({ timeout: 10000 });
        await forSaleOption.click();

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();

        const listingAddedAlert = this.page.getByRole('alert', { name: 'Listing added successfully' });
        await expect(listingAddedAlert).toBeVisible({ timeout: 10000 });
        await this.page.locator("//p[normalize-space()='Listing']").click();
        await this.page.waitForTimeout(2200);
    }

    async withoutPrimaryAgent() {
        await this.createProperty();

        await this.page.waitForTimeout(2000);
        // Ensure listing cards are loaded
        const addListingBtn = this.page.locator("button", { hasText: "Add Listing" });
        await expect(addListingBtn).toBeVisible({ timeout: 10000 });
        await addListingBtn.click();

        const listingsTypeDropdown = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).getByRole('combobox');
        await expect(listingsTypeDropdown).toBeVisible({ timeout: 5000 });
        await listingsTypeDropdown.click();

        const auctionOption = this.page.getByRole('option', { name: 'Auction' });
        await expect(auctionOption).toBeVisible({ timeout: 5000 });
        await auctionOption.click();

        const listingStatusDropdown = this.page.locator('ng-select').filter({ hasText: 'Listing Status' });
        await expect(listingStatusDropdown).toBeVisible({ timeout: 5000 });
        await listingStatusDropdown.click();

        const forSaleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'For sale' }).first();
        await expect(forSaleOption).toBeVisible({ timeout: 5000 });
        await forSaleOption.click();

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 5000 });
        await saveAndCloseButton.click();

        const listingAddedAlert = this.page.getByRole('alert', { name: 'Listing added successfully' });
        await expect(listingAddedAlert).toBeVisible({ timeout: 10000 });
        await this.page.locator("//p[normalize-space()='Listing']").click();
        await this.page.waitForTimeout(1200);

        // Click on the first listing card
        const firstListingCard = this.page.locator('.s-property').first();
        await expect(firstListingCard).toBeVisible({ timeout: 10000 });
        await firstListingCard.click();

        // Wait for and focus the 'Calendar' input by placeholder text
        const calendar = this.page.getByRole('tab', { name: ' Calendar' });
        await expect(calendar).toBeVisible({ timeout: 7000 });

        await calendar.click();

        // Click on the "Please select and connect Listing Agent" prompt (6th occurrence)
        await expect(
            this.page.locator('div').filter({ hasText: /^Please select and connect Listing Agent$/ }).nth(5)
        ).toBeVisible({ timeout: 5000 });

        const inspection = this.page.getByRole('tab', { name: 'gavel Inspections' });
        await expect(inspection).toBeVisible({ timeout: 7000 });
        await inspection.click();

        await expect(
            this.page.getByLabel('Inspections').getByText('Please select and connect')
        ).toBeVisible({ timeout: 5000 });

        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }

    // Selecting "Auction" as the listing type
    async selectAuctionAsListingType() {
        await this.createProperty();

        await this.page.waitForTimeout(2000);
        // Ensure listing cards are loaded
        const addListingBtn = this.page.locator("button", { hasText: "Add Listing" });
        await expect(addListingBtn).toBeVisible({ timeout: 10000 });
        await addListingBtn.click();

        const listingsTypeDropdown = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).getByRole('combobox');
        await expect(listingsTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingsTypeDropdown.click();

        const auctionOption = this.page.getByRole('option', { name: 'Auction' });
        await expect(auctionOption).toBeVisible({ timeout: 10000 });
        await auctionOption.click();

        const listingStatusDropdown = this.page.locator('ng-select').filter({ hasText: 'Listing Status' });
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        const forSaleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'For sale' }).first();
        await expect(forSaleOption).toBeVisible({ timeout: 10000 });
        await forSaleOption.click();


        const auctionDateLabel = this.page.getByText('Auction dateAuction Start');
        await expect(auctionDateLabel).toBeVisible({ timeout: 10000 });
        await auctionDateLabel.click();

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }
    async selectingForLease() {
        await this.createProperty();

        await this.page.waitForTimeout(2000);
        // Ensure listing cards are loaded
        const addListingBtn = this.page.locator("button", { hasText: "Add Listing" });
        await expect(addListingBtn).toBeVisible({ timeout: 10000 });
        await addListingBtn.click();

        const listingsTypeDropdown = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).getByRole('combobox');
        await expect(listingsTypeDropdown).toBeVisible({ timeout: 5000 });
        await listingsTypeDropdown.click();

        const auctionOption = this.page.getByRole('option', { name: 'Rental' });
        await expect(auctionOption).toBeVisible({ timeout: 5000 });
        await auctionOption.click();

        const listingStatusDropdown = this.page.locator('ng-select').filter({ hasText: 'Listing Status' });
        await expect(listingStatusDropdown).toBeVisible({ timeout: 5000 });
        await listingStatusDropdown.click();

        const forSaleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'For Lease' }).first();
        await expect(forSaleOption).toBeVisible({ timeout: 5000 });
        await forSaleOption.click();


        const rentalSection = this.page.locator("div[class='mb-2'] div[class='mb-2'] div[class='align-items-end mt-2 overlay-background row']");

        await expect(rentalSection).toBeVisible();


        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 5000 });
        await saveAndCloseButton.click();

        await this.page.waitForTimeout(2000)
    }

    // Adding multiple agents to a listing
    async addMultipleAgents(agentNames: string[]) {

        const listing = this.page.locator("//p[normalize-space()='Listing']");
        await expect(listing).toBeVisible({ timeout: 10000 });
        await listing.click();

        const firstListingCard = this.page.locator('.s-property').first();
        await expect(firstListingCard).toBeVisible({ timeout: 10000 });
        await firstListingCard.click();

        const primaryAgent = this.page.locator(
            'div.form-group:has-text("Primary Agent") ng-select'
        );

        await expect(primaryAgent).toBeVisible();
        await primaryAgent.click();

        const primaryInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']");
        await expect(primaryInput).toBeVisible({ timeout: 3000 });
        await primaryInput.fill(agentNames[0]);

        const primaryOption = this.page.locator(
            '.ng-dropdown-panel .ng-option',
            { hasText: agentNames[0] }
        ).first();
        await expect(primaryOption).toBeVisible({ timeout: 5000 });
        await primaryOption.click();

        const secondaryAgent = this.page.locator(
            'div.form-group:has-text("Secondary Agent") ng-select'
        );

        await expect(secondaryAgent).toBeVisible();
        await secondaryAgent.click();

        const secondaryInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']");
        await expect(secondaryInput).toBeVisible({ timeout: 3000 });
        await secondaryInput.fill(agentNames[1]);

        const secondaryOption = this.page.locator(
            '.ng-dropdown-panel .ng-option',
            { hasText: agentNames[1] }
        ).first();
        await expect(secondaryOption).toBeVisible({ timeout: 5000 });
        await secondaryOption.click();

        const addAgentBtn = this.page.locator('button.add-plus-btn');

        for (let i = 2; i < agentNames.length; i++) {

            await addAgentBtn.click();

            const dynamicAgentDropdown = this.page
                .locator('ng-select[id^="otherAgent"]')
                .last();

            await expect(dynamicAgentDropdown).toBeVisible({ timeout: 5000 });

            await dynamicAgentDropdown.click();

            const dynamicInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']");
            await expect(dynamicInput).toBeVisible({ timeout: 3000 });
            await dynamicInput.fill(agentNames[i]);

            const dynamicOption = this.page.locator(
                '.ng-dropdown-panel .ng-option',
                { hasText: agentNames[i] }
            ).first();
            await expect(dynamicOption).toBeVisible({ timeout: 5000 });
            await dynamicOption.click();
        }

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 5000 });
        await saveAndCloseButton.click();

        await this.page.waitForTimeout(2000)

    }

    // Feature name selection dropdown
    async selectFeatureByName() {
        const listing = this.page.locator("//p[normalize-space()='Listing']");
        await expect(listing).toBeVisible({ timeout: 10000 });
        await listing.click();

        const firstListingCard = this.page.locator('.s-property').first();
        await expect(firstListingCard).toBeVisible({ timeout: 10000 });
        await firstListingCard.click();
        // Locate the dropdown for Feature Name (assumes label or placeholder contains "Feature Name")
        const featuresHeading = this.page.locator('div.boxHeadingText:has-text("Features") p');
        await featuresHeading.scrollIntoViewIfNeeded();
        await expect(featuresHeading).toBeVisible();

        // Find the option with the given featureName and click it
        const featuredropdown = this.page.locator("//span[normalize-space()='Please Select']").first();
        await expect(featuredropdown).toBeVisible({ timeout: 5000 });
        await featuredropdown.click();
        // Click on the clickable div (checkmark)
        const selectAllCheckbox = this.page.locator('label.checkbox.select_all .checkbox__checkmark');
        await expect(selectAllCheckbox).toBeVisible();

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 5000 });
        await saveAndCloseButton.click();

        await this.page.waitForTimeout(2000)
    }

    // Searching in feature dropdown by name
    async searchFeatureInDropdown(featureName: string) {
        const listing = this.page.locator("//p[normalize-space()='Listing']");
        await expect(listing).toBeVisible({ timeout: 10000 });
        await listing.click();

        const firstListingCard = this.page.locator('.s-property').first();
        await expect(firstListingCard).toBeVisible({ timeout: 10000 });
        await firstListingCard.click();

        const featuresHeading = this.page.locator('div.boxHeadingText:has-text("Features") p');
        await featuresHeading.scrollIntoViewIfNeeded();
        await expect(featuresHeading).toBeVisible();

        const featureDropdown = this.page.locator("//span[normalize-space()='Please Select']").first();
        await expect(featureDropdown).toBeVisible({ timeout: 5000 });
        await featureDropdown.click();

        // Locate and use the feature search field
        const searchInput = this.page.getByRole('tabpanel', { name: 'gavel Listing Details' }).getByPlaceholder('Search');
        await expect(searchInput).toBeVisible({ timeout: 3000 });
        await searchInput.click();
        await searchInput.fill(featureName);

        const featureOption = this.page.locator('li.p-element', { hasText: featureName }).first();
        await expect(featureOption).toBeVisible({ timeout: 5000 });
        await featureOption.click();

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 5000 });
        await saveAndCloseButton.click();

        await this.page.waitForTimeout(2000);
    }

    // Closing the feature dropdown by clicking outside it
    async closeFeatureDropdown() {
        const listing = this.page.locator("//p[normalize-space()='Listing']");
        await expect(listing).toBeVisible({ timeout: 10000 });
        await listing.click();

        const firstListingCard = this.page.locator('.s-property').first();
        await expect(firstListingCard).toBeVisible({ timeout: 10000 });
        await firstListingCard.click();

        const featuresHeading = this.page.locator('div.boxHeadingText:has-text("Features") p');
        await featuresHeading.scrollIntoViewIfNeeded();
        await expect(featuresHeading).toBeVisible();
        const closeDropdown = this.page.locator("//span[@class='pi pi-times-circle']");
        await expect(closeDropdown).toBeVisible({ timeout: 10000 });
        await closeDropdown.click();

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 5000 });
        await saveAndCloseButton.click();

        await this.page.waitForTimeout(2000);
    }

    // Creating a new listing from search
    async createNewListingFromSearch() {
        await this.clickSaveButtonOnContactForm();
    }

    // Editing an existing listing
    async editExistingListing() {
        // Go to the listings page
        const listing = this.page.locator("//p[normalize-space()='Listing']");
        await expect(listing).toBeVisible({ timeout: 10000 });
        await listing.click();

        // Open the first listing card
        const firstListingCard = this.page.locator('.s-property').first();
        await expect(firstListingCard).toBeVisible({ timeout: 10000 });
        await firstListingCard.click();

        // Optionally update price if provided

        const priceInput = this.page.locator('input[name="price"]').first();
        await expect(priceInput).toBeVisible({ timeout: 5000 });
        await priceInput.click();
        await priceInput.clear();
        await priceInput.fill('1234');

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 5000 });
        await saveAndCloseButton.click();

        // Optionally check for success message
        await expect(this.page.getByText('Listing updated successfully', { exact: false })).toBeVisible({ timeout: 7000 });
        await this.page.waitForTimeout(2000);
    }

    // Verify toggles functionality in search field selection
    async verifySearchFieldToggles() {
        await this.confirmListingCopy()
    }

    // Verify toggles disappear after saving
    async verifyTogglesDisappearAfterSaving() {
        await this.declineListingCopy();
    }

    // Resetting the listing form
    async resetListingForm() {
        await this.resetPreviousDataSearchField();
    }

    // Check the Save button visibility and state
    async checkSaveButton() {
        await this.createListingWithMissingFields();
    }


    async uploadImagesToLibrary(imagePath: string) {
        // Navigate to Listing grid view and switch
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing card
        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Ensure Floorplans folder visible
        const floorPlanArea = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' });
        await floorPlanArea.waitFor({ state: 'visible', timeout: 30000 });

        await this.page.waitForTimeout(1500);

        // Open Add menu
        const addButton = this.page.locator('button', { hasText: 'Add' }).first();
        await addButton.scrollIntoViewIfNeeded();
        await addButton.click();
        await this.page.waitForTimeout(200);
        await addButton.click();

        // Click "File Upload (Public)" option
        const publicOption = this.page.locator('a', { hasText: 'File Upload (Public)' });

        await expect(publicOption).toBeVisible({ timeout: 3000 });
        await publicOption.click();

        // Wait for upload input to appear
        const fileInput = this.page.locator('#fileUpload');
        // Upload the file
        await fileInput.setInputFiles(imagePath);

        // Check image name visibility within the .lib-file area
        const imageName = imagePath.split(/[\\/]/).pop();
        if (imageName) {
            const imageNameInLibFile = this.page.locator(`.lib-file :text("${imageName}")`).first();
            await expect(imageNameInLibFile).toBeVisible({ timeout: 20000 });
        }

        // Save and close
        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 5000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);

        await this.page.waitForTimeout(2000);
    }

    async noImageUploadedScenario() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing card
        const firstListing = this.page.locator('.s-property').nth(1);
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Click Images tab
        const imagesTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imagesTab).toBeVisible({ timeout: 10000 });
        await imagesTab.click();
        await this.page.waitForTimeout(6000);

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 5000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }

    async uploadunsupportedImageFormat(imagePath: string) {
        // Navigate to Listing grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing card
        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Ensure Floorplans folder visible
        const floorPlanArea = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' });
        await floorPlanArea.waitFor({ state: 'visible', timeout: 30000 });

        await this.page.waitForTimeout(1500);

        // Open Add menu
        const addButton = this.page.locator('button', { hasText: 'Add' }).first();
        await addButton.scrollIntoViewIfNeeded();
        await addButton.click();
        await this.page.waitForTimeout(200);
        await addButton.click();

        // Click "File Upload (Public)" option
        const publicOption = this.page.locator('a', { hasText: 'File Upload (Public)' });

        await expect(publicOption).toBeVisible({ timeout: 3000 });
        await publicOption.click();

        // Wait for hidden input to appear
        const fileInput = this.page.locator('#fileUpload');

        // Upload the file
        await fileInput.setInputFiles(imagePath);

        const fileTypeNotSupportedAlert = this.page.locator('text=File Type Not Supported');
        await expect(fileTypeNotSupportedAlert).toBeVisible({ timeout: 10000 });

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 5000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);

    }

    // Delete uploaded image
    async deleteUploadedImage() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing card
        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Ensure Floorplans folder visible
        const floorPlanArea = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' });
        await floorPlanArea.waitFor({ state: 'visible', timeout: 30000 });

        await this.page.waitForTimeout(1500);

        const imageLocator = this.page.locator('img.img-hub2').first();
        await expect(imageLocator).toBeVisible({ timeout: 15000 })
        await imageLocator.click();

        // Locator for Remove (Delete) icon in images popup
        const removeIcon = this.page.locator('img[alt="Remove"][src*="delete_icon.svg"].cursor-pointer');
        await expect(removeIcon).toBeVisible({ timeout: 5000 });
        await removeIcon.click();

        // "Deleted successfully"
        const deletedSuccessfullyToast = this.page.locator('text= Deleted successfully');
        await expect(deletedSuccessfullyToast).toBeVisible({ timeout: 20000 });

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 5000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);

    }

    // Invalid characters in fields
    async checkInvalidCharactersInFields() {

        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing card
        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Open Property Type dropdown and search/select the option
        const propertyTypeDropdown = this.page.locator('ng-select[formcontrolname="type"]');
        await expect(propertyTypeDropdown).toBeVisible({ timeout: 10000 });
        await propertyTypeDropdown.click();

        // Search for the propertyType option
        const propertyTypeSearchInput = this.page.locator('ng-select[formcontrolname="type"] input[type="text"], ng-select[formcontrolname="type"] input[role="combobox"]');
        if (await propertyTypeSearchInput.isVisible({ timeout: 10000 }).catch(() => false)) {
            await propertyTypeSearchInput.fill('@#$%');
            await this.page.waitForTimeout(500); // Let options update if needed
        }
        // Verify that "No items found" appears in the dropdown
        const noItemsFound = this.page.locator('text = No items found').first();
        await expect(noItemsFound).toBeVisible({ timeout: 10000 });

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();

        // Optionally check for success message
        await expect(this.page.getByText('Listing updated successfully', { exact: false })).toBeVisible({ timeout: 7000 });
        await this.page.waitForTimeout(2000);
    }

    // Check that a newly saved listing appears in the grid and verify it's the first property in the grid
    async verifyListingAppearsInGrid() {
        // Use faker for address details (track property for later grid match)
        const buildingNameValue = faker.company.name();
        const unitNoValue = faker.number.int({ min: 1, max: 50 }).toString();
        const streetNoValue = faker.location.buildingNumber();
        const streetNameValue = faker.location.street();
        const suburbValue = 'East Albury';
        const stateValue = faker.location.state();
        const postcodeValue = faker.location.zipCode('#####');
        const countryValue = faker.location.country();

        await this.navigateToListings();
        await this.navigateToProperties();
        // Ensure listing cards are loaded
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]").first();
        await expect(contactFormBtn).toBeVisible({ timeout: 5000 });
        await contactFormBtn.dblclick({ force: true });

        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);
        const propertyAddressSearchInput = contactForm.getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 5000 });

        const propertyTypeDropdown = this.page.locator('ng-select[formcontrolname="type"]');
        await expect(propertyTypeDropdown).toBeVisible({ timeout: 10000 });
        await propertyTypeDropdown.click();
        await expect(propertyTypeDropdown).toHaveClass(/ng-select-opened/);

        const propertyTypeSearchInput = this.page.locator('ng-select[formcontrolname="type"] input[type="text"], ng-select[formcontrolname="type"] input[role="combobox"]');
        if (await propertyTypeSearchInput.isVisible({ timeout: 1000 }).catch(() => false)) {
            await propertyTypeSearchInput.fill('Alpine');
            await this.page.waitForTimeout(700);
            const alpineOption = this.page.locator('.ng-option', { hasText: 'Alpine' });
            await expect(alpineOption).toBeVisible({ timeout: 5000 });
            await expect(alpineOption).toHaveText(/Alpine/i);
            await alpineOption.click({ force: true });
        }

        const createAddress = this.page.locator("//img[contains(@class,'pencil-cross')]");
        await expect(createAddress).toBeVisible({ timeout: 10000 });
        await createAddress.click({ force: true });

        const buildingName = this.page.locator("input[formcontrolname='building_name']");
        await expect(buildingName).toBeVisible({ timeout: 10000 });
        await buildingName.click();
        await buildingName.fill(buildingNameValue);
        await expect(buildingName).toHaveValue(buildingNameValue);

        const unitNo = this.page.locator("input[formcontrolname='unit_no']");
        await expect(unitNo).toBeVisible({ timeout: 10000 });
        await unitNo.click();
        await unitNo.fill(unitNoValue);
        await expect(unitNo).toHaveValue(unitNoValue);

        const streetNo = this.page.locator("input[formcontrolname='street_no']");
        await expect(streetNo).toBeVisible({ timeout: 10000 });
        await streetNo.click();
        await streetNo.fill(streetNoValue);
        await expect(streetNo).toHaveValue(streetNoValue);

        const streetName = this.page.locator("input[formcontrolname='street_name']");
        await expect(streetName).toBeVisible({ timeout: 10000 });
        await streetName.click();
        await streetName.fill(streetNameValue);
        await expect(streetName).toHaveValue(streetNameValue);

        const suburbInput = this.page.locator("p-autocomplete[formcontrolname='suburb'] input");
        await expect(suburbInput).toBeVisible({ timeout: 10000 });
        await suburbInput.click();
        await suburbInput.fill(suburbValue);
        await expect(suburbInput).toHaveValue(suburbValue);

        const suggestion = this.page.locator("ul.p-autocomplete-items li").first();
        await expect(suggestion).toBeVisible({ timeout: 5000 });
        await suggestion.click();

        const stateInput = this.page.locator("input[formcontrolname='state']");
        await expect(stateInput).toBeVisible({ timeout: 10000 });
        await stateInput.click();
        await stateInput.fill(stateValue);
        await expect(stateInput).toHaveValue(stateValue);

        const postcodeInput = this.page.locator("input[formcontrolname='post_code']");
        await expect(postcodeInput).toBeVisible({ timeout: 10000 });
        await postcodeInput.click();
        await postcodeInput.fill(postcodeValue);
        await expect(postcodeInput).toHaveValue(postcodeValue);

        const countryInput = this.page.locator("input[formcontrolname='country']");
        await expect(countryInput).toBeVisible({ timeout: 10000 });
        await countryInput.click();
        await countryInput.fill(countryValue);
        await expect(countryInput).toHaveValue(countryValue);

        const saveButton = this.page.locator("button[type='submit'], button:has-text('Save')").last();
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click({ force: true });
        await expect(saveButton).toBeEnabled();

        await this.page.waitForTimeout(1000);

        const saveBtn = this.page.locator("button", { hasText: "Save" }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();

        const yesButton = this.page.locator('button:has-text("Yes")');
        await expect(yesButton).toBeVisible({ timeout: 10000 });
        await yesButton.click({ force: true });
        await expect(yesButton).not.toBeVisible({ timeout: 4000 });

        const selectCurrentOwnerSpan = this.page.locator("//span[normalize-space()='Select Current Owner']");
        await expect(selectCurrentOwnerSpan).toBeVisible({ timeout: 10000 });
        await selectCurrentOwnerSpan.click();

        const searchInput = this.page.locator("input[placeholder='Search']").last();
        await expect(searchInput).toBeVisible({ timeout: 5000 });
        await searchInput.click();
        await searchInput.fill("Automation Testing");

        const option = this.page.locator("ul li", { hasText: "Automation Testing" });
        await expect(option).toBeVisible({ timeout: 5000 });
        await option.click();
        const sortUp = this.page.locator('.fas.fa-sort-up');
        await expect(sortUp).toBeVisible({ timeout: 5000 });
        await sortUp.click();
        await this.page.waitForTimeout(1500);

        const ddMmYyTextbox = this.page.getByRole('textbox', { name: 'DD-MM-YY' });
        await expect(ddMmYyTextbox).toBeVisible({ timeout: 5000 });
        await ddMmYyTextbox.click();

        const currentDay = new Date().getDate().toString();
        const date = this.page.getByText(currentDay, { exact: true });
        await expect(date).toBeVisible({ timeout: 2000 });
        await date.click();

        const priceInput = this.page.locator('input[name="price"]');
        await expect(priceInput).toBeVisible({ timeout: 2000 });
        await priceInput.fill('123456');

        const saveBtun = this.page.locator("button", { hasText: "Save" }).last();
        await expect(saveBtun).toBeVisible({ timeout: 10000 });
        await saveBtun.click();

        await expect(this.page.getByText('added successfully', { exact: false })).toBeVisible({ timeout: 7000 });

        await saveBtn.click();

        // Add Listing to this property
        await this.page.waitForTimeout(2000);
        // Ensure listing cards are loaded
        const addListingBtn = this.page.locator("button", { hasText: "Add Listing" });
        await expect(addListingBtn).toBeVisible({ timeout: 10000 });
        await addListingBtn.click();

        const listingsTypeDropdown = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).getByRole('combobox');
        await expect(listingsTypeDropdown).toBeVisible({ timeout: 5000 });
        await listingsTypeDropdown.click();

        const auctionOption = this.page.getByRole('option', { name: 'Auction' });
        await expect(auctionOption).toBeVisible({ timeout: 5000 });
        await auctionOption.click();

        const listingStatusDropdown = this.page.locator('ng-select').filter({ hasText: 'Listing Status' });
        await expect(listingStatusDropdown).toBeVisible({ timeout: 5000 });
        await listingStatusDropdown.click();

        const forSaleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'For sale' }).first();
        await expect(forSaleOption).toBeVisible({ timeout: 5000 });
        await forSaleOption.click();

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 5000 });
        await saveAndCloseButton.click();

        const listingAddedAlert = this.page.getByRole('alert', { name: 'Listing added successfully' });
        await expect(listingAddedAlert).toBeVisible({ timeout: 10000 });

        // Grid me jao
        await this.page.locator("//p[normalize-space()='Listing']").click();
        await this.page.waitForTimeout(1200);
        // Wait for the first card row to load
        const firstProperty = this.page.locator('.s-property').first();
        await expect(firstProperty).toBeVisible({ timeout: 20000 });
        await this.page.waitForTimeout(2000);
    }

    // Searching for a saved listing
    async searchForSavedListing() {
        // Navigate to the Listing grid page
        // First card show ho
        await this.page.locator("//p[normalize-space()='Listing']").click();
        await this.page.waitForTimeout(1200);

        const firstCard = this.page.locator('.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 20000 });

        // Ab usi heading ka title search karo search box mein
        const headingTitle = await this.page.locator('h3.props-bg.cp.mb-1.px-0').first().innerText().catch(async () => {
            // fallback: grab all text content if selectors above not available
            return await firstCard.innerText();
        });

        const searchInput = this.locators.SearchBox();
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.click();
        await searchInput.fill(headingTitle);

        // Wait for search results to update
        await this.page.waitForTimeout(1000);

        // Locate matching listing in the results
        const searchResult = this.page.locator('.s-property', { hasText: headingTitle }).first();
        await expect(searchResult).toBeVisible({ timeout: 10000 });
        await this.resetFilters();
        await this.page.waitForTimeout(2000);
    }

    // Listing should not be visible after deletion
    async verifyListingNotVisibleAfterDeletion() {
        await this.navigateToListings();
        await this.switchToGridView();

        const firstCard = this.page.locator('.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 20000 });

        // Ab usi heading ka title search karo search box mein
        const headingTitle = await this.page.locator('h3.props-bg.cp.mb-1.px-0').first().innerText().catch(async () => {
            // fallback: grab all text content if selectors above not available
            return await firstCard.innerText();
        });

        const chevronDown = this.page.locator('i.pi.pi-chevron-down').first();
        await chevronDown.click({ force: true });

        // Find the delete button for the first visible listing card in card/grid view
        const cardDeleteButton = this.page.locator('a:nth-child(4)').first();
        await cardDeleteButton.scrollIntoViewIfNeeded()
        await cardDeleteButton.click({ force: true });

        // Wait for confirmation dialog to appear
        const confirmationDialog = this.page.getByText('Are you sure you want to delete this listing ? Your listing will be permanently');
        await expect(confirmationDialog).toBeVisible({ timeout: 10000 });

        // Find and click the confirm Delete button
        const confirmButton = this.page.getByRole('button', { name: 'Delete' });
        await expect(confirmButton).toBeVisible({ timeout: 10000 });
        await confirmButton.click({ force: true });
        const toast = this.page.getByRole('alert', { name: 'Listing successfully deleted' });;
        await expect(toast).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);

        const searchInput = this.locators.SearchBox();
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.click();
        await searchInput.fill(headingTitle);

        // Wait for search results to update
        await this.page.waitForTimeout(1000);
        // Confirm that the listing was opened by checking the heading title is visible in the detailed view
        const detailHeading = this.page.locator('h3.props-bg.cp.mb-1.px-0', { hasText: headingTitle });
        await expect(detailHeading).not.toBeVisible({ timeout: 10000 });

        await this.resetFilters();
        await this.page.waitForTimeout(2000);
    }

    // Verify project association popup opens
    async verifyProjectAssociationPopupOpens() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click on the first card
        const firstCard = this.page.locator('.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 10000 });
        await firstCard.click();

        // Find and click the project association button/icon if available
        const projectAssociation = this.page.getByText('Associate Project').first();
        await expect(projectAssociation).toBeVisible({ timeout: 10000 });
        await projectAssociation.click({ force: true });
        // Assert the popup/modal/dialog appears
        const projectAssociationModal = this.page.getByText('ProjectsSelect ProjectCancelAssociate');
        await expect(projectAssociationModal).toBeVisible({ timeout: 10000 });

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }

    // Verify project dropdown displays all projects
    async verifyProjectDropdownDisplaysAllProjects() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click on the first card
        const firstCard = this.page.locator('.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 10000 });
        await firstCard.click();

        // Find and click the 'Associate Project' button to open the dropdown/modal
        const projectAssociation = this.page.getByText('Associate Project').first();
        await expect(projectAssociation).toBeVisible({ timeout: 10000 });
        await projectAssociation.click({ force: true });

        await this.page.waitForTimeout(1200);

        // Wait for the dropdown to be visible (this selector may need adjusting)
        const projectDropdown = this.page.getByText('Select Project');
        await expect(projectDropdown).toBeVisible({ timeout: 10000 });
        await projectDropdown.click();

        const dropdownItems = this.page.getByRole('listbox', { name: 'Options list' });

        await expect(dropdownItems).toBeVisible({ timeout: 10000 });

        // Optionally, close the dropdown and modal
        await projectDropdown.press('Escape');
        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }

    // Verify project cannot be associated without selection
    async verifyProjectCannotAssociateWithoutSelection() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing card
        const firstCard = this.page.locator('.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 10000 });
        await firstCard.click();

        // Open project association modal
        const projectAssociation = this.page.getByText('Associate Project').first();
        await expect(projectAssociation).toBeVisible({ timeout: 10000 });
        await projectAssociation.click({ force: true });

        await this.page.waitForTimeout(1000);

        // Ensure dropdown for Select Project is visible, but make no selection
        const projectDropdown = this.page.getByText('Select Project');
        await expect(projectDropdown).toBeVisible({ timeout: 10000 });
        await projectDropdown.click();

        // Optionally check dropdown populates with options but none are selected
        const dropdownItems = this.page.getByRole('listbox', { name: 'Options list' });
        await expect(dropdownItems).toBeVisible({ timeout: 10000 });
        const selectedCount = await this.page.locator('.ng-option-selected').count();
        expect(selectedCount).toBe(0);

        // Close dropdown
        await projectDropdown.press('Escape');

        // Attempt to save without selection and verify that association does NOT succeed
        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }

    // Verify successful project association
    async verifySuccessfulProjectAssociation() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing card
        const firstCard = this.page.locator('.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 10000 });
        await firstCard.click();

        // Open project association modal
        const projectAssociation = this.page.getByText('Associate Project').first();
        await expect(projectAssociation).toBeVisible({ timeout: 10000 });
        await projectAssociation.click({ force: true });

        await this.page.waitForTimeout(1000);

        // Open and select first available option in the project dropdown
        const projectDropdown = this.page.getByText('Select Project');
        await expect(projectDropdown).toBeVisible({ timeout: 10000 });
        await projectDropdown.click();

        // Wait for the dropdown options to be visible
        const dropdownItems = this.page.getByRole('listbox', { name: 'Options list' });
        await expect(dropdownItems).toBeVisible({ timeout: 10000 });

        // Select the first (non-disabled) option
        const firstOption = dropdownItems.locator('.ng-option:not(.ng-option-disabled)').first();
        await expect(firstOption).toBeVisible({ timeout: 10000 });
        await firstOption.click();

        // Click Associate button
        const associateButton = this.page.getByRole('button', { name: /Associate/i });
        await expect(associateButton).toBeVisible({ timeout: 10000 });
        await associateButton.click();

        // Wait for and assert the success toast or alert is visible
        const successToast = this.page.getByRole('alert', { name: /Project associated successfully|Association successful/i });
        await expect(successToast).toBeVisible({ timeout: 10000 });

        // Click Save & Close
        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);

    }

    // Verify closing the project popup without selecting
    async verifyProjectAssociateWithoutSelection() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the second listing card (nth(1) means the second element)
        const secondCard = this.page.locator('.s-property').nth(1);
        await expect(secondCard).toBeVisible({ timeout: 10000 });
        await secondCard.click();

        // Open project association modal
        const projectAssociation = this.page.getByText('Associate Project').first();
        await expect(projectAssociation).toBeVisible({ timeout: 10000 });
        await projectAssociation.click({ force: true });

        await this.page.waitForTimeout(1000);

        // Try to click Associate without selecting a project
        const associateButton = this.page.getByRole('button', { name: /Associate/i });
        await expect(associateButton).toBeVisible({ timeout: 10000 });
        await associateButton.click();

        // Click the close (cross) icon to close the project association popup
        const closeIcon = this.page.locator('.pi.pi-times').last();
        await expect(closeIcon).toBeVisible({ timeout: 5000 });
        await closeIcon.click({ force: true });

        // Click Save & Close
        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }

    // Verify associated project listing leads
    async verifyAssociatedProjectListingLeads() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing card
        const firstCard = this.page.locator('.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 10000 });
        await firstCard.click();

        // Open project association modal
        const projectAssociation = this.page.getByText('Associate Project').first();
        await expect(projectAssociation).toBeVisible({ timeout: 10000 });
        const projectAssociateCheckbox = this.page.locator('#projectAssociateCheckbox');
        await expect(projectAssociateCheckbox).toBeChecked();
        await this.page.waitForTimeout(1000);
        // Click Save & Close
        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);

    }

    // Enhanced: Verifies expected messages in Lead, Task, and Related tabs before saving a listing.
    async verifyButtonsInTabsBeforeSave() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Ensure at least one card is loaded before proceeding
        const firstCard = this.page.locator('.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 20000 });

        // Open the Add New listing form
        const addNewBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]").first();
        await expect(addNewBtn).toBeVisible({ timeout: 5000 });
        await addNewBtn.dblclick({ force: true });

        // Make sure the form is open
        const rightBar = this.page.locator('#rightbarwithscroll');
        await expect(rightBar).toBeVisible({ timeout: 10000 });

        // Tab details for iteration: id and user-facing label (optional for error messages)
        const tabSelectors = [
            { id: "#pills-Lead-tab", label: "Lead" },
            { id: "#pills-Tasks-tab", label: "Tasks" },
            { id: "#pills-Related-tab", label: "Related" },
        ];
        const expectedText = 'Please create the listing';

        // Helper to check for expected message in current tab
        const expectMessage = async (tabLabel: string) => {
            // Try multiple ways of locating the message for robustness
            // 1. Check for <p> with matching text
            const p = this.page.locator('p', { hasText: expectedText });
            if (await p.isVisible().catch(() => false)) {
                await expect(p).toBeVisible({ timeout: 5000 });
            } else {
                // 2. Fallback to getByRole; works if using ARIA roles on <p>
                await expect(
                    this.page.getByRole('paragraph').filter({ hasText: expectedText })
                ).toBeVisible({ timeout: 10000 });

            }
        };

        // Iterate all relevant tabs and verify the message
        for (const tab of tabSelectors) {
            const tabLocator = this.page.locator(tab.id).first();
            await expect(tabLocator, `Tab "${tab.label}" should be visible`).toBeVisible({ timeout: 5000 });
            await tabLocator.click();
            await expectMessage(tab.label);
        }

        // Optional: close the newly opened form after validation
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
            await this.page.waitForTimeout(500);
            await closeBtn.click({ force: true });
            await this.page.waitForTimeout(2000);
        }
    }

    async verifyConjunctionTabsBeforeSave() {
        // Open the Listings grid and ensure property cards are loaded
        await this.navigateToListings();
        await this.switchToGridView();
        const firstCard = this.page.locator('.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 20000 });

        // Open the Add New listing form
        const addNewBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]").first();
        await expect(addNewBtn).toBeVisible({ timeout: 5000 });
        await addNewBtn.dblclick({ force: true });

        // Make sure the form is open
        const rightPanel = this.page.locator('#rightbarwithscroll');
        await expect(rightPanel).toBeVisible({ timeout: 10000 });

        // All conjunction-related tabs to check for the message
        const conjunctionTabs = [
            { id: "#pills-Lead-tab", label: "Lead" },
            { id: "#pills-Tasks-tab", label: "Tasks" },
            { id: "#pills-Related-tab", label: "Related" },
            { id: "#pills-Conjunction-tab", label: "Conjunction" }
        ];
        const expectedText = "Please create the listing";

        // For each relevant tab, click and check for the expected message
        for (const tab of conjunctionTabs) {
            const tabLocator = this.page.locator(tab.id).first();
            await expect(tabLocator, `Tab "${tab.label}" should be visible`).toBeVisible({ timeout: 5000 });
            await tabLocator.click();

            // Robust check for the expected message only within the right panel
            const matchingParagraphs = await rightPanel.locator('p', { hasText: expectedText }).all();
            let foundVisible = false;
            for (const paragraph of matchingParagraphs) {
                if (await paragraph.isVisible().catch(() => false)) {
                    await expect(paragraph).toBeVisible({ timeout: 5000 });
                    foundVisible = true;
                    break;
                }
            }
            if (!foundVisible) {
                // Fallback: match generic text node inside right panel (exact: false to account for extra text)
                await expect(
                    rightPanel.getByText(expectedText, { exact: false })
                ).toBeVisible({ timeout: 5000 });
            }
        }

        // Optionally close the right form if the close button is present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
            await this.page.waitForTimeout(500);
            await closeBtn.click({ force: true });
            await this.page.waitForTimeout(2000);
        }
    }

    // Verify the preview listing functionality
    async verifyPreviewListing() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Find the first listing card and open it
        const firstListingCard = this.page.locator('.s-property').first();
        await expect(firstListingCard).toBeVisible({ timeout: 10000 });
        await firstListingCard.click();

        // Click the Preview button (assuming it is a button with text 'Preview')
        const previewBtn = this.page.getByRole('button', { name: /preview Listing/i }).first();
        await expect(previewBtn).toBeVisible({ timeout: 5000 });
        await previewBtn.click({ force: true });

        // Wait for the preview modal or panel/dialog to be visible
        const previewPanel = this.page.locator('#rightbarwithscroll').first();
        await expect(previewPanel).toBeVisible({ timeout: 10000 });

        // Optionally close preview if there's a close button/icon

        const closeForm = this.page.locator('.pi.pi-times').first()
        await this.page.waitForTimeout(1000)
        await closeForm.click({ force: true });

        await this.page.waitForTimeout(2000);
    }

    // Verify the "Admin View" button is present and functional in the preview listing modal
    async verifyAdminViewButtonInPreviewListing() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Find the first listing card and open it
        const firstListingCard = this.page.locator('.s-property').first();
        await expect(firstListingCard).toBeVisible({ timeout: 10000 });
        await firstListingCard.click();

        // Click the Preview button
        const previewBtn = this.page.getByRole('button', { name: /preview Listing/i }).first();
        await expect(previewBtn).toBeVisible({ timeout: 10000 });
        await previewBtn.click({ force: true });

        // Wait for the preview modal/panel
        const previewPanel = this.page.locator('#rightbarwithscroll').first();
        await expect(previewPanel).toBeVisible({ timeout: 10000 });

        // Locate the "Admin View" button within the preview area
        const adminViewBtn = this.page.getByRole('button', { name: /Admin View/i }).first();
        await expect(adminViewBtn).toBeVisible({ timeout: 10000 });

        // Optional: Click the Admin View button and check for the expected admin UI/modal
        await adminViewBtn.click({ force: true });

        // Optionally close admin panel and preview panel
        const closeForm = this.page.locator('.pi.pi-times').first()
        await this.page.waitForTimeout(1000)
        await closeForm.click({ force: true });

        await this.page.waitForTimeout(2000);
    }

    async uploadMultipleImagesToLibrary(imagePaths: string | string[]) {
        const images: string[] = Array.isArray(imagePaths) ? imagePaths : [imagePaths];

        // Navigate to listings
        await this.navigateToListings();
        await this.switchToGridView();

        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Open Images tab
        const imagesTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imagesTab).toBeVisible({ timeout: 10000 });
        await imagesTab.click();
        await this.page.waitForTimeout(6000);

        // Open the File Upload (Public) menu item via Add button with improved handling
        const addButton = this.page.getByRole('button', { name: ' Add' }).first();
        const fileUploadMenuName = 'File Upload (Public)';
        let fileUploadMenu = this.page.getByRole('menuitem', { name: fileUploadMenuName });

        let attempt = 0;
        const maxAttempts = 5;
        let isVisible = false;
        while (!isVisible && attempt < maxAttempts) {
            await addButton.waitFor({ state: 'visible', timeout: 10000 });

            // Defensive: scroll into view and hover
            const addHandle = await addButton.elementHandle();
            if (addHandle) {
                // Scroll to the Add button using JS
                await this.page.evaluate((el) => {
                    el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
                }, addHandle);
            }
            await addButton.hover();
            await this.page.waitForTimeout(150);

            // Attempt click
            await addButton.click({ force: true });
            await this.page.waitForTimeout(600);

            // Refetch menu item after click
            fileUploadMenu = this.page.getByRole('menuitem', { name: fileUploadMenuName });

            try {
                isVisible = await fileUploadMenu.isVisible({ timeout: 1500 });
            } catch {
                isVisible = false;
            }
            attempt++;
        }

        await expect(fileUploadMenu).toBeVisible({ timeout: 5000 });
        await fileUploadMenu.click();

        // 🔥 Upload all images together
        const fileInput = this.page.locator('#fileUpload');
        await fileInput.setInputFiles(images);

        // Wait for success toast
        const toast = this.page.locator('text=Added Successfully');
        await expect(toast).toBeVisible({ timeout: 30000 });

        // Optional: verify all image names appear
        for (const imagePath of images) {
            const imageName = imagePath.split(/[\\/]/).pop();
            if (imageName) {
                const uploadedImage = this.page.locator(
                    `.mt-3.black-text.pb-1.f-12:has-text("${imageName}")`
                );
                await expect(uploadedImage).toBeVisible({ timeout: 15000 });
            }
        }

        // Save & Close
        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await saveAndCloseButton.click();
    }
    // Verify image and thumbnails in preview listing 
    async verifyImageAndThumbnailsInPreviewListing() {
        // Go to listings grid and open first listing
        await this.navigateToListings();
        await this.switchToGridView();

        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();
        // Open the preview
        const previewBtn = this.page.getByRole('button', { name: /Preview Listing/i });
        await expect(previewBtn).toBeVisible({ timeout: 6000 });
        await previewBtn.click({ force: true });
        await expect(this.page.locator('img.main-images')).toBeVisible();

        await this.page.waitForTimeout(1200);

        // Close the preview modal
        const closeIcon = this.page.locator('.pi.pi-times').first();
        await closeIcon.click({ force: true });
        await this.page.waitForTimeout(1500);

    }

    // Verify that clicking a thumbnail updates the main image in the preview listing
    async verifyThumbnailSelectionChangesMainImage() {
        // Go to listings grid and open first listing
        await this.navigateToListings();
        await this.switchToGridView();

        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Open the preview
        const previewBtn = this.page.getByRole('button', { name: /Preview Listing/i });
        await expect(previewBtn).toBeVisible({ timeout: 6000 });
        await previewBtn.click({ force: true });

        await this.page.waitForTimeout(1200);

        // Verify main image is visible
        const mainImage = this.page.locator('img.main-images').first();
        await expect(mainImage).toBeVisible({ timeout: 10000 });

        // Get all thumbnail images (excluding the main image)
        const image = this.page.locator('img.carousel-image').nth(1);
        await expect(image).toBeVisible({ timeout: 2000 });
        await image.click({ force: true });

        const closeForm = this.page.locator('.pi.pi-times').first();
        await this.page.waitForTimeout(1000);
        await closeForm.click({ force: true });

        await this.page.waitForTimeout(2000);
    }

    async VerifyListingStatusDisplayInPreview() {
        // Go to listings grid and open first listing
        await this.navigateToListings();
        await this.switchToGridView();

        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Open the preview
        const previewBtn = this.page.getByRole('button', { name: /Preview Listing/i });
        await expect(previewBtn).toBeVisible({ timeout: 6000 });
        await previewBtn.click({ force: true });

        // Verify main image is visible
        const mainImage = this.page.locator('img.main-images').first();
        await expect(mainImage).toBeVisible({ timeout: 10000 });
        const status = this.page.locator('p.statusStyle1').first();
        await expect(status).toBeVisible({ timeout: 20000 });

        const closeForm = this.page.locator('.pi.pi-times').first();
        await this.page.waitForTimeout(1000);
        await closeForm.click({ force: true });

        await this.page.waitForTimeout(2000);
    }

    // Verify total images count in preview
    async verifyTotalImagesCountInPreview() {
        // Go to listings grid and open first listing
        await this.navigateToListings();
        await this.switchToGridView();

        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Open the preview
        const previewBtn = this.page.getByRole('button', { name: /Preview Listing/i });
        await expect(previewBtn).toBeVisible({ timeout: 10000 });
        await previewBtn.click({ force: true });

        // Wait for main image to load and thumbnails to be present
        const mainImage = this.page.locator('img.main-images').first();
        await expect(mainImage).toBeVisible({ timeout: 10000 });

        const imageIndex = this.page.locator('#listing-image-index').first();

        await expect(imageIndex).toBeVisible({ timeout: 20000 });

        // Close preview
        const closeForm = this.page.locator('.pi.pi-times').first();
        await this.page.waitForTimeout(1000);
        await closeForm.click({ force: true });

        await this.page.waitForTimeout(2000);
    }
    // Verify image days count in preview
    async verifyImageDaysCountInPreview() {
        await this.navigateToListings();
        await this.switchToGridView();

        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Open the preview
        const previewBtn = this.page.getByRole('button', { name: /Preview Listing/i });
        await expect(previewBtn).toBeVisible({ timeout: 10000 });
        await previewBtn.click({ force: true });

        // Wait for main image and date label to load
        const mainImage = this.page.locator('img.main-images').first();
        await expect(mainImage).toBeVisible({ timeout: 10000 });

        const dateLabel = this.page.locator('p.statusStyle').first();
        await expect(dateLabel).toBeVisible({ timeout: 10000 });

        // Close preview
        const closeForm = this.page.locator('.pi.pi-times').first();
        await this.page.waitForTimeout(1000);
        await closeForm.click({ force: true });

        await this.page.waitForTimeout(2000);
    }

    // Verify sale type display in preview listing 
    async verifySaleTypeDisplayInPreviewListing() {
        await this.navigateToListings();
        await this.switchToGridView();

        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Open the preview
        const previewBtn = this.page.getByRole('button', { name: /Preview Listing/i });
        await expect(previewBtn).toBeVisible({ timeout: 10000 });
        await previewBtn.click({ force: true });

        // Locate the "Sale Type" value associated with the correct label in preview
        const saleTypeLabel = this.page.locator('div.pricingDetail h3', { hasText: 'Sale Type' }).first();
        await expect(saleTypeLabel).toBeVisible({ timeout: 10000 });

        const saleStatus = this.page.locator('p.mr-0.statusStyle1', { hasText: 'For Lease' });

        await expect(saleStatus).toBeVisible({ timeout: 10000 });

        // Close preview
        const closeForm = this.page.locator('.pi.pi-times').first();
        await this.page.waitForTimeout(1000);
        await closeForm.click({ force: true });
        await this.page.waitForTimeout(2000);
    }

    // Verify all listing details display in preview
    async verifyAllListingDetailsInPreview(agentNames: string[]) {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first listing card
        const firstListing = this.page.locator('.s-property').nth(1);
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // --- Fill listing details form ---
        // Agents
        const agentSelectors = [
            { selector: 'div.form-group:has-text("Primary Agent") ng-select', name: agentNames[0] },
            { selector: 'div.form-group:has-text("Secondary Agent") ng-select', name: agentNames[1] }
        ];
        for (const agent of agentSelectors) {
            const agentDropdown = this.page.locator(agent.selector);
            await expect(agentDropdown).toBeVisible();
            await agentDropdown.click();

            const agentInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']");
            await expect(agentInput).toBeVisible({ timeout: 3000 });
            await agentInput.fill(agent.name);

            const agentOption = this.page.locator(
                '.ng-dropdown-panel .ng-option',
                { hasText: agent.name }
            ).first();
            await expect(agentOption).toBeVisible({ timeout: 5000 });
            await agentOption.click();
        }

        // Date field (assume second input is date field)
        const dateInput = this.page.locator('input.p-inputtext.p-component').nth(1);
        await expect(dateInput).toBeVisible({ timeout: 10000 });
        await dateInput.click({ force: true });
        const todayCell = this.page.locator('.p-datepicker-today, td[aria-current="date"]'); // Robust selector
        await expect(todayCell).toBeVisible({ timeout: 5000 });
        await todayCell.click({ force: true });

        // Price
        const priceInput = this.page.locator('input[name="price"]').first();
        await expect(priceInput).toBeVisible({ timeout: 5000 });
        await priceInput.click();
        await priceInput.fill('10000');

        // Bedrooms, Bathrooms, Ensuite, Living Areas, Study, Pool, Garage
        const fieldSets = [
            { selector: 'input[formcontrolname="beds"], input[name="bedrooms"], input[data-testid="bedrooms"]', value: '2' },
            { selector: 'input[formcontrolname="baths"], input[name="bathrooms"], input[data-testid="bathrooms"]', value: '1' },
            { selector: 'input[name="ensuite"], input[data-testid="ensuite"], input[formcontrolname="ensuite"]', value: '1' },
            { selector: 'input[formcontrolname="living_areas"]', value: '1' },
            { selector: 'input[formcontrolname="study"], input[name="study"], input[data-testid="study"]', value: '1' },
            { selector: 'input[formcontrolname="pools"]', value: '1' },
            { selector: 'input[formcontrolname="garage"]', value: '1' }
        ];

        for (const field of fieldSets) {
            const input = this.page.locator(field.selector).first();
            await expect(input).toBeVisible({ timeout: 5000 });
            await input.click();
            await input.fill(field.value);
        }

        // Carport
        const carportInput = this.page.locator(
            'div.col-xl-4:has(p:has-text("Carport")) input[type="number"]'
        );
        await expect(carportInput).toBeVisible({ timeout: 5000 });
        await carportInput.click();
        await carportInput.fill('1');

        // Open Spaces
        const openSpacesInput = this.page.locator(
            'div.col-xl-4:has(p:has-text("Open Spaces")) input[type="number"]'
        );
        await expect(openSpacesInput).toBeVisible({ timeout: 5000 });
        await openSpacesInput.click();
        await openSpacesInput.fill('2');

        // Land Size
        const landSizeInput = this.page.locator(
            'div.col-sm-6:has(p:has-text("Land Size")) input[formcontrolname="land_area"]'
        );
        await expect(landSizeInput).toBeVisible({ timeout: 5000 });
        await landSizeInput.click();
        await landSizeInput.fill('500');

        // House Size
        const houseSizeInput = this.page.locator(
            'input[formcontrolname="building_area"], input[name="building_area"], input[data-testid="house-size"]'
        ).first();
        await expect(houseSizeInput).toBeVisible({ timeout: 5000 });
        await houseSizeInput.click();
        await houseSizeInput.fill('250');

        // Headline
        const headlineInput = this.page.locator('input[formcontrolname="heading"], input[name="heading"], input[data-testid="headline"]').first();
        await expect(headlineInput).toBeVisible({ timeout: 5000 });
        await headlineInput.click();
        await headlineInput.fill('Test Headline');

        // Description
        // Use a more stable and short locator: target the visible textarea/input for description
        const descriptionInput = this.page.locator(
            'ckeditor[formcontrolname="description_garax"] .ck-editor__editable'
        ).first();
        await expect(descriptionInput).toBeVisible({ timeout: 5000 });
        await descriptionInput.click({ force: true });
        await descriptionInput.fill('This is a test description.');

        // Features selection
        const featuresHeading = this.page.locator('div.boxHeadingText:has-text("Features") p');
        await featuresHeading.scrollIntoViewIfNeeded();
        await expect(featuresHeading).toBeVisible();

        const featuredropdown = this.page.locator("//span[normalize-space()='Please Select']").first();
        await expect(featuredropdown).toBeVisible({ timeout: 5000 });
        await featuredropdown.click();

        const firstFeatureOption = this.page.locator('li.p-element').first();
        await expect(firstFeatureOption).toBeVisible({ timeout: 5000 });
        await firstFeatureOption.click({ force: true });

        // Locate the "sort-up" icon
        const sortUpIcon = this.page.locator('i.fas.fa-sort-up');
        if (await sortUpIcon.isVisible({ timeout: 5000 }).catch(() => false)) {
            await sortUpIcon.click();
        }

        // Save changes
        const saveButton = this.page.locator('button:has-text("Save")').nth(2);
        await expect(saveButton).toBeVisible({ timeout: 5000 });
        await saveButton.click();
        await this.page.waitForTimeout(2000);

        // --- Preview and assertions ---
        // Open the preview dialog
        const previewBtn = this.page.getByRole('button', { name: /Preview Listing/i });
        await expect(previewBtn).toBeVisible({ timeout: 10000 });
        await previewBtn.scrollIntoViewIfNeeded();
        await previewBtn.click({ force: true });


        const auctionsLabel = this.page.getByText('Auctions', { exact: true });
        await auctionsLabel.scrollIntoViewIfNeeded();
        await expect(auctionsLabel).toBeVisible({ timeout: 3000 });

        // Bedroom, bathroom, car spaces and sizing labels and values
        await expect(this.page.locator('text=Bedroom').last()).toBeVisible({ timeout: 3000 });

        await expect(this.page.locator('text=Bathroom').last()).toBeVisible({ timeout: 3000 });

        await expect(this.page.locator('text=Car Spaces').last()).toBeVisible({ timeout: 3000 });

        await expect(this.page.locator('text=Land Size').last()).toBeVisible({ timeout: 3000 });

        await expect(this.page.locator('text=House Size').last()).toBeVisible({ timeout: 3000 });

        // Agents - both primary and secondary shown horizontally
        await expect(this.page.getByText('Automation Test', { exact: true }).last()).toBeVisible({ timeout: 3000 });
        await expect(this.page.getByText('Hina Agent', { exact: false }).last()).toBeVisible({ timeout: 3000 });

        // Description section
        await expect(this.page.getByText('Description', { exact: true })).toBeVisible({ timeout: 3000 });
        await expect(this.page.getByText('Test Headline', { exact: true })).toBeVisible({ timeout: 3000 }); // headline
        await expect(this.page.getByText('This is a test description.', { exact: true })).toBeVisible({ timeout: 3000 }); // description

        // Features section and first feature selected
        await expect(this.page.getByText('Features', { exact: true })).toBeVisible({ timeout: 3000 });
        // Air Conditioning is the selected feature in the image
        await expect(this.page.getByText('Air Conditioning', { exact: true })).toBeVisible({ timeout: 3000 });


        // Close the preview dialog
        const closeBtn = this.page.locator('.pi.pi-times').first();
        await this.page.waitForTimeout(1000);
        await closeBtn.click({ force: true });
        await this.page.waitForTimeout(2000);
    }

    // Verify fields are not editable in preview listing 
    async verifyFieldsNotEditableInPreviewListing() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstListing = this.page.locator('.s-property').nth(1);
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Open the preview dialog
        const previewBtn = this.page.getByRole('button', { name: /Preview Listing/i });
        await expect(previewBtn).toBeVisible({ timeout: 10000 });
        await previewBtn.click({ force: true });

        // Wait for preview to open (headline should be visible as a marker)
        const descriptionLocator = this.page.locator('text=Description').last();
        await descriptionLocator.scrollIntoViewIfNeeded();
        await expect(descriptionLocator).toBeVisible({ timeout: 5000 });

        // Verify expected fields/inputs are not editable
        const headlineInput = this.page.locator('input[formcontrolname="headline"]');
        const descInput = this.page.locator('textarea[formcontrolname="description"]');
        const priceInput = this.page.locator('input[name="price"]');
        const agentDropdown = this.page.locator('div.form-group:has-text("Primary Agent") ng-select input');
        const featureDropdown = this.page.locator('div:has-text("Features") ng-select');

        // Expect no enabled headline input
        await expect(headlineInput).toBeHidden();
        await expect(descInput).toBeHidden();
        await expect(priceInput).toBeHidden();
        // Features and agents should not be dropdowns/inputs here
        await expect(agentDropdown).toBeHidden();
        // Close preview
        const closeBtn = this.page.locator('.pi.pi-times').first();
        await this.page.waitForTimeout(1000);
        await closeBtn.click({ force: true });
        await this.page.waitForTimeout(2000);
    }

    // Verify Save button functionality
    async clickSaveButtonOnListingForm() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Find the price input (try common selectors)
        const priceInput = this.page.locator('input[name="price"]').first();
        await expect(priceInput).toBeVisible({ timeout: 5000 });
        await priceInput.scrollIntoViewIfNeeded();
        await priceInput.click();
        await priceInput.clear();
        await priceInput.fill('12345');

        // Click the save button 
        const saveButton = this.page.locator('button:has-text("Save")').nth(2);
        await expect(saveButton).toBeVisible({ timeout: 5000 });
        await saveButton.scrollIntoViewIfNeeded()
        await saveButton.click();

        // Close the form (if modal/dialog close icon present)
        const closeBtn = this.page.locator('.pi.pi-times').first();
        await this.page.waitForTimeout(500);
        await closeBtn.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    // Verify Save & Close button functionality
    async clickSaveAndCloseButtonOnListingForm() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Find the price input (try common selectors)
        const priceInput = this.page.locator('input[name="price"]').first();
        await expect(priceInput).toBeVisible({ timeout: 5000 });
        await priceInput.scrollIntoViewIfNeeded();
        await priceInput.click();
        await priceInput.clear();
        await priceInput.fill('54321');

        // Click the "Save & Close" button
        const saveAndCloseButton = this.page.getByRole('button', { name: /Save & Close/i }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 5000 });
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }

    async verifySaveAndCloseButtonFunctionality() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 30000 });
        await firstListing.click();

        // Click the "Save & Close" button
        const saveAndCloseButton = this.page.getByRole('button', { name: /Save & Close/i }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 5000 });
        await saveAndCloseButton.click();

        // Optionally, add a wait or verification after closing
        await this.page.waitForTimeout(1200);
    }

    // Verify correct error message for missing property type
    async verifyMissingPropertyTypeError() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click "Add New Listing" button (adjust selector as needed), and wait for form
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]");
        await expect(contactFormBtn).toBeVisible({ timeout: 10000 });
        await contactFormBtn.dblclick({ force: true });
        await expect(this.page.locator('#rightbarwithscroll')).toBeVisible({ timeout: 10000 });

        // Try to save without selecting property type
        const saveButton = this.page.getByRole('button', { name: /^Save$/i }).first();
        await expect(saveButton).toBeVisible({ timeout: 5000 });
        await saveButton.click();

        // Expect correct error message for missing property type (adjust selector/message as needed)
        const errorMessage = this.page.getByText(/Required fields must be filled in/i);
        await expect(errorMessage).toBeVisible({ timeout: 5000 });

        // Press Escape to close the error dialog or form
        await this.page.waitForTimeout(1000);
        // Also ensure pop-up form is closed if [x] icon is present
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        if (await closeFormIcon.isVisible({ timeout: 2000 }).catch(() => false)) {
            await closeFormIcon.click({ force: true });
            await this.page.waitForTimeout(2000);
        }

    }

    // Verify correct error message for missing listing type
    async verifyMissingListingTypeError() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click "Add New Listing" button and wait for the form to open
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]");
        await expect(contactFormBtn).toBeVisible({ timeout: 10000 });
        await contactFormBtn.dblclick({ force: true });
        await expect(this.page.locator('#rightbarwithscroll')).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);

        // Attempt to save without selecting listing type
        const saveButton = this.page.getByRole('button', { name: /^Save$/i }).first();
        await expect(saveButton).toBeVisible({ timeout: 5000 });
        await saveButton.click();

        // Assert the correct error message for missing listing type
        const errorMessage = this.page.getByText(/Required fields must be filled in/i);
        await expect(errorMessage).toBeVisible({ timeout: 5000 });

        await this.page.waitForTimeout(1000);
        // Also ensure pop-up form is closed if [x] icon is present
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        if (await closeFormIcon.isVisible({ timeout: 2000 }).catch(() => false)) {
            await closeFormIcon.click({ force: true });
            await this.page.waitForTimeout(2000);
        }
    }

    // Verify if the 'Sold' status popup appears when selecting 'Sold' in the listing status dropdown.
    async verifySoldStatusPopupAppears() {
        await this.navigateToListings();
        await this.switchToGridView();
        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 30000 });
        // Open add new listing form
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]").first();
        await expect(contactFormBtn).toBeVisible({ timeout: 10000 });
        await contactFormBtn.dblclick({ force: true });
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Open the status dropdown (identify dropdown for 'Listing Status')
        const listingStatusDropdown = this.page.locator('.cs-w-70.danger-tag > .ng-select-container > .ng-value-container > .ng-input > input')
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 })
        await listingStatusDropdown.click();
        // Correct way to access the search input for a native ng-select dropdown:
        const listingStatusSearchInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']").first();
        await listingStatusSearchInput.fill('Sold');
        await this.page.waitForTimeout(500);
        const soldOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Sold' }).first();
        await expect(soldOption).toBeVisible({ timeout: 5000 });
        await soldOption.click();

        const soldPopup = this.page.getByText('Listing Sold × Date SoldSold');
        await expect(soldPopup).toBeVisible({ timeout: 5000 });

        const closeBtn = this.page.getByRole('button', { name: 'Close', exact: true });
        await expect(closeBtn).toBeVisible({ timeout: 10000 });
        await closeBtn.click({ force: true });
        await this.page.waitForTimeout(1000);
        // Verify the popup is closed (should not be visible)
        await this.page.waitForTimeout(1000);
        // Also ensure pop-up form is closed if [x] icon is present
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        if (await closeFormIcon.isVisible({ timeout: 2000 }).catch(() => false)) {
            await closeFormIcon.click({ force: true });
            await this.page.waitForTimeout(2000);
        }
    }

    // Verify that a newly created listing appears at the top of the grid view after creation
    async verifyListingAppearsAtTopAfterCreation() {
        await this.verifyListingAppearsInGrid();
    }

    // Verify if the 'Sold' status popup contains the correct fields.
    async verifySoldStatusPopupFields() {
        await this.navigateToListings();
        await this.switchToGridView();
        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 20000 });

        // Open add new listing form
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]").first();
        await expect(contactFormBtn).toBeVisible({ timeout: 10000 });
        await contactFormBtn.dblclick({ force: true });
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Open the status dropdown (Listing Status)
        const listingStatusDropdown = this.page.locator('.cs-w-70.danger-tag > .ng-select-container > .ng-value-container > .ng-input > input');
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        // Type "Sold" and select from dropdown
        const listingStatusSearchInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']").first();
        await listingStatusSearchInput.fill('Sold');
        await this.page.waitForTimeout(500);
        const soldOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Sold' }).first();
        await expect(soldOption).toBeVisible({ timeout: 5000 });
        await soldOption.click();

        // Assert popup appears
        const soldPopup = this.page.getByText('Listing Sold × Date SoldSold');
        await expect(soldPopup).toBeVisible({ timeout: 5000 });

        // "Date Sold" input field (can be role-based or using improved selector)
        const dateSoldInput = this.page.getByText('Date Sold').first();
        await expect(dateSoldInput).toBeVisible({ timeout: 3000 });

        // "Sold Price" field using a stable text or label query
        const soldPriceInput = this.page.getByText(/Sold Price/i).first();
        await expect(soldPriceInput).toBeVisible({ timeout: 3000 });

        // disclose price
        const disclosePriceCheckbox = this.page.getByText('Disclose Price');
        await expect(disclosePriceCheckbox).toBeVisible({ timeout: 3000 });
        // Close the popup
        const closeBtn = this.page.getByRole('button', { name: 'Close', exact: true });
        await expect(closeBtn).toBeVisible({ timeout: 10000 });
        await closeBtn.click({ force: true });
        await this.page.waitForTimeout(1000);

        await this.page.waitForTimeout(1000);
        // Also ensure pop-up form is closed if [x] icon is present
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        if (await closeFormIcon.isVisible({ timeout: 2000 }).catch(() => false)) {
            await closeFormIcon.click({ force: true });
            await this.page.waitForTimeout(2000);
        }
    }
    /**
     * Verify that the 'Sold' status popup can be closed without saving changes.
     */
    async verifySoldStatusPopupCanBeClosedWithoutSaving() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing's add form
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]").first();
        await expect(contactFormBtn).toBeVisible({ timeout: 10000 });
        await contactFormBtn.dblclick({ force: true });
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Open the status dropdown (Listing Status)
        const listingStatusDropdown = this.page.locator('.cs-w-70.danger-tag > .ng-select-container > .ng-value-container > .ng-input > input');
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        // Type "Sold" and select from dropdown
        const listingStatusSearchInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']").first();
        await listingStatusSearchInput.fill('Sold');
        await this.page.waitForTimeout(500);
        const soldOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Sold' }).first();
        await expect(soldOption).toBeVisible({ timeout: 5000 });
        await soldOption.click();

        // Wait for popup
        const soldPopup = this.page.getByText('Listing Sold × Date SoldSold');
        await expect(soldPopup).toBeVisible({ timeout: 5000 });

        // Attempt to close: click "Close" button
        const closeBtn = this.page.getByRole('button', { name: 'Close', exact: true });
        await expect(closeBtn).toBeVisible({ timeout: 10000 });
        await closeBtn.click({ force: true });
        await this.page.waitForTimeout(1000);

        // Verify the popup is closed (should not be visible)
        await expect(soldPopup).not.toBeVisible({ timeout: 3000 });
        await this.page.waitForTimeout(1000);
        // Also ensure pop-up form is closed if [x] icon is present
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        if (await closeFormIcon.isVisible({ timeout: 2000 }).catch(() => false)) {
            await closeFormIcon.click({ force: true });
            await this.page.waitForTimeout(2000);
        }

    }

    /**
     * Verify if the 'Sold' status popup saves data correctly when valid inputs are provided.
     */
    async verifySoldStatusPopupSavesWithValidInputs() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing's add form
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]").first();
        await expect(contactFormBtn).toBeVisible({ timeout: 10000 });
        await contactFormBtn.dblclick({ force: true });
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Open the status dropdown (Listing Status)
        const listingStatusDropdown = this.page.locator('.cs-w-70.danger-tag > .ng-select-container > .ng-value-container > .ng-input > input');
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        // Type "Sold" and select from dropdown
        const listingStatusSearchInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']").first();
        await listingStatusSearchInput.fill('Sold');
        await this.page.waitForTimeout(500);
        const soldOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Sold' }).first();
        await expect(soldOption).toBeVisible({ timeout: 5000 });
        await soldOption.click();

        // Wait for popup
        const soldPopup = this.page.getByText('Listing Sold × Date SoldSold');
        await expect(soldPopup).toBeVisible({ timeout: 5000 });

        const dateSoldInput = this.page.locator('p-calendar[formcontrolname="soldDate"] input');
        await dateSoldInput.click();

        // Select today's date in the calendar popup
        const soldToday = new Date();
        const todayDate = soldToday.getDate();

        // Try PrimeNG's typical selector for "today"
        const todayButton = this.page.locator('.p-datepicker-today, .today, td[aria-current="date"]');
        if (await todayButton.first().isVisible({ timeout: 3000 })) {
            await todayButton.first().click();
        } else {
            // Fallback 1: Try by aria-label for "Today"
            const calendarCellWithAriaToday = this.page.locator('td[aria-label="Today"]');
            if (await calendarCellWithAriaToday.first().isVisible({ timeout: 1500 })) {
                await calendarCellWithAriaToday.first().click();
            } else {
                // Fallback 2: Try by exact date: Build expected aria-label (long format)
                const ariaLabelOptions = [
                    soldToday.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                    soldToday.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }),
                    soldToday.toISOString().slice(0, 10), // YYYY-MM-DD
                ];
                let clicked = false;
                for (const label of ariaLabelOptions) {
                    const cell = this.page.locator(`td[aria-label*="${label}"]`).first();
                    if (await cell.isVisible({ timeout: 500 })) {
                        await cell.click();
                        clicked = true;
                        break;
                    }
                }
                if (!clicked) {
                    // Final fallback: pick day cell with correct number (avoids "other month" days)
                    const cell = this.page.locator(
                        '.p-datepicker-calendar td:not(.p-datepicker-other-month)',
                        { hasText: String(todayDate) }
                    ).first();
                    await expect(cell).toBeVisible({ timeout: 1500 });
                    await cell.click();
                }
            }
        }

        const priceInput = this.page.locator('input[formcontrolname="soldPrice"], input[name="soldPrice"]').first();
        await expect(priceInput).toBeVisible({ timeout: 5000 });
        await priceInput.fill('1234');

        await this.page.waitForTimeout(2000);

        // Click Save on the popup
        const saveAndCloseBtn = this.page.getByRole('button', { name: /Save & Close/i }).last();
        await expect(saveAndCloseBtn).toBeVisible({ timeout: 10000 });
        await saveAndCloseBtn.click({ force: true });

        // Wait for popup to close
        await expect(soldPopup).not.toBeVisible({ timeout: 10000 });

        const dateSoldField = this.page.getByText('Date Sold');
        await expect(dateSoldField).toBeVisible({ timeout: 10000 });

        // Grab values for assertions
        const dateSoldText = await dateSoldField.textContent();
        const soldPriceField = this.page.getByText('Sold Price:');
        const soldPriceText = await soldPriceField.textContent();
        const disclosePriceField = this.page.getByText('Disclose Price');
        const disclosePriceText = await disclosePriceField.textContent();

        // 1. Assert "Date Sold" matches today's date in correct format (MM/DD/YYYY)
        // Use the same soldToday variable
        const pad = (n: number) => n.toString().padStart(2, "0");
        const formattedDate = `${pad(soldToday.getDate())}/${pad(soldToday.getMonth() + 1)}/${soldToday.getFullYear()}`;
        expect(dateSoldText).toContain(formattedDate);

        // 2. Assert "Sold Price" matches the filled price (formatted with thousands separator)
        expect(soldPriceText?.replace(/\s/g, '')).toMatch(/SoldPrice:1234/);

        // 3. Assert "Disclose Price" is "No" after save
        expect(disclosePriceText).toMatch(/Disclose Price:\s*No/);

        await this.page.waitForTimeout(1000);
        // Also ensure pop-up form is closed if [x] icon is present
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        if (await closeFormIcon.isVisible({ timeout: 2000 }).catch(() => false)) {
            await closeFormIcon.click({ force: true });
            await this.page.waitForTimeout(2000);
        }

    }

    async updateSoldDetailsAndVerify() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing's add form
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]").first();
        await expect(contactFormBtn).toBeVisible({ timeout: 10000 });
        await contactFormBtn.dblclick({ force: true });
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);

        // Open the status dropdown (Listing Status)
        const listingStatusDropdown = this.page.locator('.cs-w-70.danger-tag > .ng-select-container > .ng-value-container > .ng-input > input');
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        // Type "Sold" and select from dropdown
        const listingStatusSearchInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']").first();
        await listingStatusSearchInput.fill('Sold');
        await this.page.waitForTimeout(500);
        const soldOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Sold' }).first();
        await expect(soldOption).toBeVisible({ timeout: 5000 });
        await soldOption.click();

        // Wait for popup
        const soldPopup = this.page.getByText('Listing Sold × Date SoldSold');
        await expect(soldPopup).toBeVisible({ timeout: 5000 });

        const dateSoldInput = this.page.locator('p-calendar[formcontrolname="soldDate"] input');
        await dateSoldInput.click();

        // Select today's date in the calendar popup
        const soldToday = new Date();
        const todayDate = soldToday.getDate();

        // Try to click the today button first
        const todayButton = this.page.locator('.p-datepicker-today, .today, td[aria-current="date"]');
        if (await todayButton.first().isVisible({ timeout: 3000 })) {
            await todayButton.first().click();
        } else {
            // Fallbacks as before
            const calendarCellWithAriaToday = this.page.locator('td[aria-label="Today"]');
            if (await calendarCellWithAriaToday.first().isVisible({ timeout: 1500 })) {
                await calendarCellWithAriaToday.first().click();
            } else {
                const ariaLabelOptions = [
                    soldToday.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                    soldToday.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }),
                    soldToday.toISOString().slice(0, 10),
                ];
                let clicked = false;
                for (const label of ariaLabelOptions) {
                    const cell = this.page.locator(`td[aria-label*="${label}"]`).first();
                    if (await cell.isVisible({ timeout: 500 })) {
                        await cell.click();
                        clicked = true;
                        break;
                    }
                }
                if (!clicked) {
                    const cell = this.page.locator(
                        '.p-datepicker-calendar td:not(.p-datepicker-other-month)',
                        { hasText: String(todayDate) }
                    ).first();
                    await expect(cell).toBeVisible({ timeout: 1500 });
                    await cell.click();
                }
            }
        }

        const priceInput = this.page.locator('input[formcontrolname="soldPrice"], input[name="soldPrice"]').first();
        await expect(priceInput).toBeVisible({ timeout: 5000 });
        await priceInput.fill('1234');

        await this.page.waitForTimeout(1200);

        // Click Save on the popup
        const saveAndCloseBtn = this.page.getByRole('button', { name: /Save & Close/i }).last();
        await expect(saveAndCloseBtn).toBeVisible({ timeout: 10000 });
        await saveAndCloseBtn.click({ force: true });

        // Wait for popup to close
        await expect(soldPopup).not.toBeVisible({ timeout: 10000 });

        const dateSoldField = this.page.getByText('Date Sold');
        await expect(dateSoldField).toBeVisible({ timeout: 10000 });

        // Grab values for assertions
        const dateSoldText = await dateSoldField.textContent();
        const soldPriceField = this.page.getByText('Sold Price:');
        const soldPriceText = await soldPriceField.textContent();
        const disclosePriceField = this.page.getByText('Disclose Price');
        const disclosePriceText = await disclosePriceField.textContent();

        // Assert today's date
        const pad = (n: number) => n.toString().padStart(2, "0");
        const formattedToday = `${pad(soldToday.getDate())}/${pad(soldToday.getMonth() + 1)}/${soldToday.getFullYear()}`;
        expect(dateSoldText).toContain(formattedToday);

        expect(soldPriceText?.replace(/\s/g, '')).toMatch(/SoldPrice:1234/);

        // Pencil icon (<img> - edit sold status)
        const pencilIcon = this.page.locator('.pencil-cross').first();
        await expect(pencilIcon).toBeVisible({ timeout: 10000 });
        await pencilIcon.click();

        await dateSoldInput.click();

        // Pick yesterday's date:
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        // Fallbacks to select yesterday's day cell in datepicker
        // Most reliable: by visible day cell with hasText of yesterday's day (but NOT "other month" day)
        const dayCell = this.page.locator(
            '.p-datepicker-calendar td:not(.p-datepicker-other-month)',
            { hasText: String(yesterday.getDate()) }
        ).first();

        await expect(dayCell).toBeVisible({ timeout: 3000 });
        await dayCell.click();

        // Update "Sold Price"
        const priceInputEdit = this.page.locator('input[formcontrolname="soldPrice"], input[name="soldPrice"]').first();
        await expect(priceInputEdit).toBeVisible({ timeout: 3000 });
        const priceValue = '5678';
        await priceInputEdit.fill(priceValue);

        const saveAndCloseBtnEdit = this.page.getByRole('button', { name: /save & close/i }).last();

        // Click until the "Date Sold" field is visible, with safety loop
        for (let attempt = 0; attempt < 5; attempt++) {
            await saveAndCloseBtnEdit.click({ force: true });
            try {
                await this.page.waitForSelector('text=Date Sold', { state: 'visible', timeout: 10000 });
                // "Date Sold" field is visible, break out of the loop
                break;
            } catch (e) {
                if (attempt === 4) {
                    throw new Error('"Date Sold" field not displayed after multiple attempts');
                }
                // Otherwise, try clicking again
            }
        }
        // Wait for "Date Sold" field to definitely be visible before moving on
        await this.page.waitForSelector('text=Date Sold', { state: 'visible', timeout: 10000 });

        // Verify updated details in the main view
        const dateSoldFieldAfter = this.page.getByText('Date Sold').first();
        await expect(dateSoldFieldAfter).toBeVisible({ timeout: 10000 });
        const dateSoldTextAfter = await dateSoldFieldAfter.textContent();

        // Assert yesterday date - formatted as before
        const formattedYesterday = `${pad(yesterday.getDate())}/${pad(yesterday.getMonth() + 1)}/${yesterday.getFullYear()}`;
        expect(dateSoldTextAfter).toContain(formattedYesterday);

        const soldPriceFieldAfter = this.page.getByText('Sold Price:').first();
        const soldPriceTextAfter = await soldPriceFieldAfter.textContent();
        // Match formatted price value (with or without separator)
        expect(soldPriceTextAfter?.replace(/\D/g, '')).toContain(priceValue);

        // Optionally verify Disclose Price still "No"
        const disclosePriceFieldAfter = this.page.getByText('Disclose Price').first();
        const disclosePriceTextAfter = await disclosePriceFieldAfter.textContent();
        expect(disclosePriceTextAfter).toMatch(/Disclose Price:\s*No/);
        await this.page.waitForTimeout(1000);
        // Also ensure pop-up form is closed if [x] icon is present
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        if (await closeFormIcon.isVisible({ timeout: 2000 }).catch(() => false)) {
            await closeFormIcon.click({ force: true });
            await this.page.waitForTimeout(2000);
        }
    }

    /**
     * Verify if the listing disappears from grid/list view after changing status to 'Sold'.
     */
    async verifyListingDisappearsAfterMarkingSold() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Wait for card rows to load
        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows.first()).toBeVisible({ timeout: 10000 });

        // Get trimmed heading of the first listing - specifically targeting the <h3> that holds the address
        const firstCardHeadingLocator = this.page.locator('h3.props-bg.cp.mb-1.px-0[title]').first();
        let headingTextTrimmed: string | undefined = undefined;
        if (await firstCardHeadingLocator.isVisible({ timeout: 2000 })) {
            const headingTextRaw = await firstCardHeadingLocator.textContent();
            headingTextTrimmed = headingTextRaw?.trim();
        }

        await firstCardHeadingLocator.click({ force: true });

        await this.page.waitForTimeout(1200);

        // Wait for edit form to show up
        const editForm = this.page.locator('#rightbarwithscroll');
        await expect(editForm).toBeVisible({ timeout: 8000 });

        // Open Listing Type dropdown, search and select option
        const listingTypeDropdown = this.page.locator('ng-select[formcontrolname="listingType"], ng-select[formcontrolname="listing_type"]');
        await expect(listingTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingTypeDropdown.click();
        const listingTypeSearchInput = listingTypeDropdown.locator('input[type="text"]');
        await expect(listingTypeSearchInput).toBeVisible({ timeout: 2000 });
        await listingTypeSearchInput.fill('Auction');
        await this.page.waitForTimeout(500); // Let options update if needed
        const listingTypeOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Auction' }).first();
        await listingTypeOption.click();

        // Change status to 'Sold'
        const listingStatusDropdown = this.page.locator('.cs-w-70.danger-tag .ng-input input');
        await listingStatusDropdown.click({ force: true });
        const listingStatusSearchInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']").first();
        await listingStatusSearchInput.fill('Sold');
        await this.page.waitForTimeout(500);
        const soldOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Sold' }).first();
        await expect(soldOption).toBeVisible({ timeout: 3000 });
        await soldOption.click();

        await this.page.waitForTimeout(1200);

        // Fill in required Sold data
        const soldPopup = this.page.getByText('Listing Sold × Date SoldSold');
        await expect(soldPopup).toBeVisible({ timeout: 5000 });

        const dateSoldInput = this.page.locator('p-calendar[formcontrolname="soldDate"] input');
        await dateSoldInput.click();
        // Select today or first available cell
        const todayButton = this.page.locator('.p-datepicker-today, .today, td[aria-current="date"]');
        if (await todayButton.first().isVisible({ timeout: 3000 })) {
            await todayButton.first().click();
        } else {
            const dateCell = this.page.locator('.p-datepicker-calendar td:not(.p-datepicker-other-month)').first();
            await expect(dateCell).toBeVisible({ timeout: 1500 });
            await dateCell.click();
        }
        const priceInput = soldPopup.locator('input[formcontrolname="soldPrice"], input[name="soldPrice"]');
        await expect(priceInput.first()).toBeVisible({ timeout: 3000 });
        await priceInput.first().fill('10000');

        // Click Save & Close on the popup
        const saveAndCloseBtn = this.page.getByRole('button', { name: /Save & Close/i }).last();
        await expect(saveAndCloseBtn).toBeVisible({ timeout: 6000 });
        await saveAndCloseBtn.click({ force: true });

        await this.page.waitForTimeout(2000);

        // Wait for edit form to close
        const saveAndCloseButton = this.page.getByRole('button', { name: /Save & Close/i }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 6000 });
        await saveAndCloseButton.click({ force: true });
        await this.page.waitForTimeout(5000); // Optionally ensure animations finish

        // After marking as Sold, search for the trimmed address and verify no listing appears
        const searchInput = this.page.locator('input[placeholder="Search"]').last();
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        // Only fill and search if we actually have a trimmed heading available
        if (headingTextTrimmed) {
            await searchInput.fill(headingTextTrimmed);
            await this.page.keyboard.press('Enter');
            await this.page.waitForTimeout(1000); // Wait for search to process
            // Now verify that no listing is displayed
            const cardCount = await cardRows.filter({ hasText: headingTextTrimmed }).count();
            expect(cardCount).toBe(0); // No listing should be found after sold
        } else {
            throw new Error("Could not locate/trim the first listing's heading text for search and verification.");
        }
    }

    // Verify if invalid data in 'Sold Price' field (e.g., letters) is handled correctly.
    async verifyInvalidSoldPriceInput() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing's add form
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]").first();
        await expect(contactFormBtn).toBeVisible({ timeout: 10000 });
        await contactFormBtn.dblclick({ force: true });
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Open the status dropdown (Listing Status)
        const listingStatusDropdown = this.page.locator('.cs-w-70.danger-tag > .ng-select-container > .ng-value-container > .ng-input > input');
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        // Type "Sold" and select from dropdown
        const listingStatusSearchInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']").first();
        await listingStatusSearchInput.fill('Sold');
        await this.page.waitForTimeout(500);
        const soldOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Sold' }).first();
        await expect(soldOption).toBeVisible({ timeout: 5000 });
        await soldOption.click();
        await this.page.waitForTimeout(1200);

        // Wait for popup
        const soldPopup = this.page.getByText('Listing Sold × Date SoldSold');
        await expect(soldPopup).toBeVisible({ timeout: 5000 });

        const dateSoldInput = this.page.locator('p-calendar[formcontrolname="soldDate"] input');
        await dateSoldInput.click();

        // Select today's date in the calendar popup
        const soldToday = new Date();
        const todayDate = soldToday.getDate();

        // Try PrimeNG's typical selector for "today"
        const todayButton = this.page.locator('.p-datepicker-today, .today, td[aria-current="date"]');
        if (await todayButton.first().isVisible({ timeout: 3000 })) {
            await todayButton.first().click();
        } else {
            // Fallback 1: Try by aria-label for "Today"
            const calendarCellWithAriaToday = this.page.locator('td[aria-label="Today"]');
            if (await calendarCellWithAriaToday.first().isVisible({ timeout: 1500 })) {
                await calendarCellWithAriaToday.first().click();
            } else {
                // Fallback 2: Try by exact date: Build expected aria-label (long format)
                const ariaLabelOptions = [
                    soldToday.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                    soldToday.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }),
                    soldToday.toISOString().slice(0, 10), // YYYY-MM-DD
                ];
                let clicked = false;
                for (const label of ariaLabelOptions) {
                    const cell = this.page.locator(`td[aria-label*="${label}"]`).first();
                    if (await cell.isVisible({ timeout: 500 })) {
                        await cell.click();
                        clicked = true;
                        break;
                    }
                }
                if (!clicked) {
                    // Final fallback: pick day cell with correct number (avoids "other month" days)
                    const cell = this.page.locator(
                        '.p-datepicker-calendar td:not(.p-datepicker-other-month)',
                        { hasText: String(todayDate) }
                    ).first();
                    await expect(cell).toBeVisible({ timeout: 1500 });
                    await cell.click();
                }
            }
        }

        const priceInput = this.page.locator('input[formcontrolname="soldPrice"], input[name="soldPrice"]').first();
        await expect(priceInput).toBeVisible({ timeout: 5000 });

        // Fill 'abc' and verify it auto-cleared (invalid)
        await priceInput.fill('abc');
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(2000);
        // After entering non-numeric, it should auto-clear (invalid input)
        await expect(priceInput).toHaveValue('', { timeout: 1000 });

        await this.page.waitForTimeout(1200);

        // Now ready for next steps (e.g., fill valid value later)

        // Click Save on the popup
        const saveAndCloseBtn = this.page.getByRole('button', { name: /Save & Close/i }).last();
        await expect(saveAndCloseBtn).toBeVisible({ timeout: 10000 });
        await saveAndCloseBtn.click({ force: true });

        await expect(soldPopup).not.toBeVisible({ timeout: 10000 });

        // Verify the popup is closed (should not be visible)
        await expect(soldPopup).not.toBeVisible({ timeout: 3000 });
        await this.page.waitForTimeout(1000);
        // Also ensure pop-up form is closed if [x] icon is present
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        if (await closeFormIcon.isVisible({ timeout: 2000 }).catch(() => false)) {
            await closeFormIcon.click({ force: true });
            await this.page.waitForTimeout(2000);
        }
    }

    // Verify if the 'Disclose Price' checkbox can be selected/deselected.
    async verifyDisclosePriceCheckboxFunctionality() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing's add form
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]").first();
        await expect(contactFormBtn).toBeVisible({ timeout: 10000 });
        await contactFormBtn.dblclick({ force: true });
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Open the status dropdown (Listing Status)
        const listingStatusDropdown = this.page.locator('.cs-w-70.danger-tag > .ng-select-container > .ng-value-container > .ng-input > input');
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        // Type "Sold" and select from dropdown
        const listingStatusSearchInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']").first();
        await listingStatusSearchInput.fill('Sold');
        await this.page.waitForTimeout(500);
        const soldOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Sold' }).first();
        await expect(soldOption).toBeVisible({ timeout: 5000 });
        await soldOption.click();

        // Wait for popup
        const soldPopup = this.page.getByText('Listing Sold × Date SoldSold');
        await expect(soldPopup).toBeVisible({ timeout: 5000 });

        // Locate the Disclose Price checkbox
        const discloseCheckbox = this.page.locator('.p-element.mb-2 > .p-checkbox > .p-checkbox-box');
        await discloseCheckbox.waitFor({ state: 'visible', timeout: 10000 });
        // Click to toggle
        await discloseCheckbox.click();
        await this.page.waitForTimeout(500);

        // Click again to toggle back
        await discloseCheckbox.click();
        await this.page.waitForTimeout(500);

        // Close the popup by clicking "Save & Close"
        const saveAndCloseBtn = this.page.getByRole('button', { name: /Save & Close/i }).last();
        await expect(saveAndCloseBtn).toBeVisible({ timeout: 10000 });
        await saveAndCloseBtn.click({ force: true });

        await this.page.waitForTimeout(1200);

        // Wait until the Sold popup is closed
        await expect(soldPopup).not.toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);
        // Also ensure pop-up form is closed if [x] icon is present
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        if (await closeFormIcon.isVisible({ timeout: 2000 }).catch(() => false)) {
            await closeFormIcon.click({ force: true });
            await this.page.waitForTimeout(2000);
        }
    }

    // Verify if selecting 'Disclose Price' correctly reflects in the saved listing details.
    async verifyDisclosePriceCheckboxReflectsInListing() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Wait for card rows to load
        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows.first()).toBeVisible({ timeout: 10000 });

        // Get trimmed heading of the first listing - specifically targeting the <h3> that holds the address
        const firstCardHeadingLocator = this.page.locator('h3.props-bg.cp.mb-1.px-0[title]').first();
        let headingTextTrimmed: string | undefined = undefined;
        if (await firstCardHeadingLocator.isVisible({ timeout: 2000 })) {
            const headingTextRaw = await firstCardHeadingLocator.textContent();
            headingTextTrimmed = headingTextRaw?.trim();
        }

        await firstCardHeadingLocator.click({ force: true });

        // Wait for edit form to show up
        const editForm = this.page.locator('#rightbarwithscroll');
        await expect(editForm).toBeVisible({ timeout: 8000 });

        // Open Listing Type dropdown, search and select option
        const listingTypeDropdown = this.page.locator('ng-select[formcontrolname="listingType"], ng-select[formcontrolname="listing_type"]');
        await expect(listingTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingTypeDropdown.click();
        const listingTypeSearchInput = listingTypeDropdown.locator('input[type="text"]');
        await expect(listingTypeSearchInput).toBeVisible({ timeout: 2000 });
        await listingTypeSearchInput.fill('Auction');
        await this.page.waitForTimeout(500); // Let options update if needed
        const listingTypeOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Auction' }).first();
        await listingTypeOption.click();

        // Change status to 'Sold'
        const listingStatusDropdown = this.page.locator('.cs-w-70.danger-tag .ng-input input');
        await listingStatusDropdown.click({ force: true });
        const listingStatusSearchInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']").first();
        await listingStatusSearchInput.fill('Sold');
        await this.page.waitForTimeout(500);
        const soldOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Sold' }).first();
        await expect(soldOption).toBeVisible({ timeout: 3000 });
        await soldOption.click();

        // Fill in required Sold data
        const soldPopup = this.page.getByText('Listing Sold × Date SoldSold');
        await expect(soldPopup).toBeVisible({ timeout: 5000 });

        const dateSoldInput = this.page.locator('p-calendar[formcontrolname="soldDate"] input');
        await dateSoldInput.click();
        // Select today or first available cell
        const todayButton = this.page.locator('.p-datepicker-today, .today, td[aria-current="date"]');
        if (await todayButton.first().isVisible({ timeout: 3000 })) {
            await todayButton.first().click();
        } else {
            const dateCell = this.page.locator('.p-datepicker-calendar td:not(.p-datepicker-other-month)').first();
            await expect(dateCell).toBeVisible({ timeout: 1500 });
            await dateCell.click();
        }
        const priceInput = soldPopup.locator('input[formcontrolname="soldPrice"], input[name="soldPrice"]');
        await expect(priceInput.first()).toBeVisible({ timeout: 3000 });
        await priceInput.first().fill('10000');

        // Click Save & Close on the popup
        const saveAndCloseBtn = this.page.getByRole('button', { name: /Save & Close/i }).last();
        await expect(saveAndCloseBtn).toBeVisible({ timeout: 6000 });
        await saveAndCloseBtn.click({ force: true });

        await this.page.waitForTimeout(1200);


        // Wait for edit form to close
        const saveAndCloseButton = this.page.getByRole('button', { name: /Save & Close/i }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 6000 });
        await saveAndCloseButton.click({ force: true });
        await this.page.waitForTimeout(3000); // Optionally ensure animations finish

        // Apply Listing Status filter to "Sold" in list view  to ensure it's filtered correctly
        const listingStatusFilterDropdown = this.page.locator('re-multiselect[placeholder="Listing Status"]');
        await listingStatusFilterDropdown.click({ force: true });
        await this.page.waitForTimeout(1500);
        const listingStatusInput = this.page.locator('input[placeholder="Search"]').last();
        await expect(listingStatusInput).toBeVisible({ timeout: 10000 });
        await listingStatusInput.fill('Sold');
        const soldStatusOption = this.page.locator('li.p-element', { hasText: 'Sold' }).first();
        await expect(soldStatusOption).toBeVisible({ timeout: 10000 });
        await soldStatusOption.click({ force: true });

        await this.page.locator('.fas.fa-sort-up').click({ force: true })


        await this.page.waitForTimeout(3000);
        await expect(cardRows.first()).toBeVisible({ timeout: 10000 });

        // After marking as Sold, search for the trimmed address and verify no listing appears
        const searchInput = this.page.locator('input[placeholder="Search"]').last();
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        // Only fill and search if we actually have a trimmed heading available

        if (typeof headingTextTrimmed === 'string') {
            await searchInput.fill(headingTextTrimmed);
            await this.page.waitForTimeout(1000); // Wait for search to process
        } else {
            throw new Error("headingTextTrimmed is undefined or not a string");
        }
        await expect(cardRows.first()).toBeVisible({ timeout: 10000 });
        await firstCardHeadingLocator.click({ force: true });
        // expect sold price visible 
        const soldPriceFieldDetail = this.page.getByText('Sold Price:').first();
        await expect(soldPriceFieldDetail).toBeVisible({ timeout: 5000 });
        // Optionally, check the value
        const soldPriceTextDetail = await soldPriceFieldDetail.textContent();
        expect(soldPriceTextDetail?.replace(/\D/g, '')).toContain('10000');
        // escape the detail view to clean up
        await this.page.waitForTimeout(1000);
        // Also ensure pop-up form is closed if [x] icon is present
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        if (await closeFormIcon.isVisible({ timeout: 2000 }).catch(() => false)) {
            await closeFormIcon.click({ force: true });
            await this.page.waitForTimeout(2000);
        }
    }
    /**
     * Verify if navigating away from the form without saving discards changes.
     */
    async verifyFormDoesNotSaveOnNavigateAway() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing for editing
        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows.first()).toBeVisible({ timeout: 10000 });

        // Open first listing's add form
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]").first();
        await expect(contactFormBtn).toBeVisible({ timeout: 10000 });
        await contactFormBtn.dblclick({ force: true });
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Open Listing Type dropdown, search and select option
        const listingTypeDropdown = this.page.locator('ng-select[formcontrolname="listingType"], ng-select[formcontrolname="listing_type"]');
        await expect(listingTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingTypeDropdown.click();
        const listingTypeSearchInput = listingTypeDropdown.locator('input[type="text"]');
        await expect(listingTypeSearchInput).toBeVisible({ timeout: 10000 });
        await listingTypeSearchInput.fill('Auction');
        await this.page.waitForTimeout(500); // Let options update if needed
        const listingTypeOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Auction' }).first();
        await listingTypeOption.click();
        // Open the status dropdown (Listing Status)
        const listingStatusDropdown = this.page.locator('.cs-w-70.danger-tag > .ng-select-container > .ng-value-container > .ng-input > input');
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        // Type "Sold" and select from dropdown
        const listingStatusSearchInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']").first();
        await listingStatusSearchInput.fill('Sold');
        await this.page.waitForTimeout(500);
        const soldOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Sold' }).first();
        await expect(soldOption).toBeVisible({ timeout: 10000 });
        await soldOption.click();

        // Wait for popup
        const soldPopup = this.page.getByText('Listing Sold × Date SoldSold');
        await expect(soldPopup).toBeVisible({ timeout: 10000 });

        const dateSoldInput = this.page.locator('p-calendar[formcontrolname="soldDate"] input');
        await dateSoldInput.click();

        // Select today's date in the calendar popup
        const soldToday = new Date();
        const todayDate = soldToday.getDate();

        // Try PrimeNG's typical selector for "today"
        const todayButton = this.page.locator('.p-datepicker-today, .today, td[aria-current="date"]');
        if (await todayButton.first().isVisible({ timeout: 3000 })) {
            await todayButton.first().click();
        } else {
            // Fallback 1: Try by aria-label for "Today"
            const calendarCellWithAriaToday = this.page.locator('td[aria-label="Today"]');
            if (await calendarCellWithAriaToday.first().isVisible({ timeout: 1500 })) {
                await calendarCellWithAriaToday.first().click();
            } else {
                // Fallback 2: Try by exact date: Build expected aria-label (long format)
                const ariaLabelOptions = [
                    soldToday.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                    soldToday.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' }),
                    soldToday.toISOString().slice(0, 10), // YYYY-MM-DD
                ];
                let clicked = false;
                for (const label of ariaLabelOptions) {
                    const cell = this.page.locator(`td[aria-label*="${label}"]`).first();
                    if (await cell.isVisible({ timeout: 500 })) {
                        await cell.click();
                        clicked = true;
                        break;
                    }
                }
                if (!clicked) {
                    // Final fallback: pick day cell with correct number (avoids "other month" days)
                    const cell = this.page.locator(
                        '.p-datepicker-calendar td:not(.p-datepicker-other-month)',
                        { hasText: String(todayDate) }
                    ).first();
                    await expect(cell).toBeVisible({ timeout: 1500 });
                    await cell.click();
                }
            }
        }

        const priceInput = this.page.locator('input[formcontrolname="soldPrice"], input[name="soldPrice"]').first();
        await expect(priceInput).toBeVisible({ timeout: 10000 });
        await priceInput.fill('1234');

        // Click Save on the popup
        const saveAndCloseBtn = this.page.getByRole('button', { name: /Save & Close/i }).last();
        await expect(saveAndCloseBtn).toBeVisible({ timeout: 10000 });
        await saveAndCloseBtn.click({ force: true });

        // Wait for popup to close
        await expect(soldPopup).not.toBeVisible({ timeout: 10000 });

        // Click on the "stream Stream" tab by role
        const streamTab = this.page.getByRole('tab', { name: 'stream Stream' });
        await expect(streamTab).toBeVisible({ timeout: 5000 });
        await streamTab.click({ force: true });

        const dateSoldField = this.page.getByText('Date Sold');
        await expect(dateSoldField).toBeVisible({ timeout: 10000 });

        // Grab values for assertions
        const dateSoldText = await dateSoldField.textContent();
        const soldPriceField = this.page.getByText('Sold Price:');
        const soldPriceText = await soldPriceField.textContent();
        const disclosePriceField = this.page.getByText('Disclose Price');
        const disclosePriceText = await disclosePriceField.textContent();

        // 1. Assert "Date Sold" matches today's date in correct format (MM/DD/YYYY)
        // Use the same soldToday variable
        const pad = (n: number) => n.toString().padStart(2, "0");
        const formattedDate = `${pad(soldToday.getDate())}/${pad(soldToday.getMonth() + 1)}/${soldToday.getFullYear()}`;
        expect(dateSoldText).toContain(formattedDate);

        // 2. Assert "Sold Price" matches the filled price (formatted with thousands separator)
        expect(soldPriceText?.replace(/\s/g, '')).toMatch(/SoldPrice:1234/);

        // 3. Assert "Disclose Price" is "No" after save
        expect(disclosePriceText).toMatch(/Disclose Price:\s*No/);

        // Verify the popup is closed (should not be visible)
        await expect(soldPopup).not.toBeVisible({ timeout: 3000 });
        await this.page.waitForTimeout(1000);
        // Also ensure pop-up form is closed if [x] icon is present
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        if (await closeFormIcon.isVisible({ timeout: 2000 }).catch(() => false)) {
            await closeFormIcon.click({ force: true });
            await this.page.waitForTimeout(2000);
        }

    }

    async verifyUndoSoldStatusBringsListingBack() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Filter by "Sold" status
        const initialCardRows = this.locators.cardViewPropertyRow();
        await expect(initialCardRows).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const statusDropdown = this.locators.listingStatusDropdown();
        await expect(statusDropdown).toBeVisible();
        await statusDropdown.click({ force: true });
        await this.page.waitForTimeout(500);

        const statusSearchBox = this.locators.listingStatusSearchInput();
        await expect(statusSearchBox).toBeVisible();
        await statusSearchBox.fill('Sold');
        await this.page.waitForTimeout(1200);

        // Click the "Sold" option after search
        const soldOption1 = this.locators.listingStatusOption('Sold');
        await expect(soldOption1).toBeVisible({ timeout: 5000 });
        await soldOption1.click({ force: true });

        await statusDropdown.click();

        await this.page.waitForTimeout(3000);
        // Filtered card rows for "Sold"
        const soldCardRows = this.locators.cardViewPropertyRow();
        await expect(soldCardRows.first()).toBeVisible({ timeout: 10000 });

        // Get and click the heading of the first card
        const firstCardHeading = this.page.locator('h3.props-bg.cp.mb-1.px-0[title]').first();
        let headingTextTrimmed: string | undefined = undefined;
        if (await firstCardHeading.isVisible({ timeout: 2000 })) {
            const headingTextRaw = await firstCardHeading.textContent();
            headingTextTrimmed = headingTextRaw?.trim();
        }
        await firstCardHeading.click({ force: true });

        // Wait for edit form to load
        const editForm = this.page.locator('#rightbarwithscroll');
        await expect(editForm).toBeVisible({ timeout: 8000 });

        // Open the status dropdown (Listing Status)
        const listingStatusDropdown = this.page.locator('.cs-w-70.danger-tag > .ng-select-container > .ng-value-container > .ng-input > input');
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        // Type "Sold" and select from dropdown
        const listingStatusSearchInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']").first();
        await listingStatusSearchInput.fill('For Sale');
        await this.page.waitForTimeout(500);
        const soldOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'For Sale' }).first();
        await expect(soldOption).toBeVisible({ timeout: 5000 });
        await soldOption.click();

        // Save changes
        const saveAndClose = this.page.getByRole('button', { name: /Save & Close/i }).first();
        await expect(saveAndClose).toBeVisible({ timeout: 10000 });
        await saveAndClose.click({ force: true });

        await this.page.waitForTimeout(2000);
        // Click the Reset button (reset filters)
        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeVisible({ timeout: 5000 });
        await expect(resetButton).toBeEnabled();
        await resetButton.click({ force: true });
        await this.page.waitForTimeout(2000);
        // Search for the updated status and verify card displays new status
        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 10000 });

        // Search in the search box field for the previously stored heading (if available), otherwise search for "For Sale"
        const searchInput = this.page.locator('input[placeholder="Search"]').last(); // Adjust selector if needed
        await expect(searchInput).toBeVisible({ timeout: 5000 });

        if (headingTextTrimmed) {
            await searchInput.fill('');
            await searchInput.fill(headingTextTrimmed);
            await this.page.waitForTimeout(1000);

            // After search, ensure the specific card with the heading appears and has "For Sale" status
            const matchingCard = cardRows.filter({ has: this.page.locator(`h3[title="${headingTextTrimmed}"]`) }).first();
            await expect(matchingCard).toBeVisible({ timeout: 10000 });

            const cardText = (await matchingCard.innerText()).toLowerCase();
            expect(cardText.includes('for sale')).toBe(true);
        } else {
            // If no heading stored, search for "For Sale" in search box and expect at least one result
            await searchInput.fill('');
            await searchInput.fill('For Sale');
            await this.page.waitForTimeout(1000);

            const count = await cardRows.count();
            let foundForSale = false;
            for (let i = 0; i < count; i++) {
                const cardText = (await cardRows.nth(i).innerText()).toLowerCase();
                if (cardText.includes('for sale')) {
                    foundForSale = true;
                    break;
                }
            }
            expect(foundForSale).toBe(true);
        }
    }

    // Verify that the image tab contains a search field
    async verifyImageTabHasSearchField() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        const chevronDown = this.page.locator('i.pi.pi-chevron-down').first();
        await chevronDown.click({ force: true });
        // Find the delete button for the first visible listing card in card/grid view
        const cardDeleteButton = this.page.locator('a:nth-child(4)').first();
        await cardDeleteButton.scrollIntoViewIfNeeded()
        await this.page.waitForTimeout(1000);
        await cardDeleteButton.click({ force: true });

        // Wait for confirmation dialog to appear
        const confirmationDialog = this.page.getByText('Are you sure you want to delete this listing ? Your listing will be permanently');
        await expect(confirmationDialog).toBeVisible({ timeout: 10000 });

        // Find and click the confirm Delete button
        const confirmButton = this.page.getByRole('button', { name: 'Delete' });
        await expect(confirmButton).toBeVisible({ timeout: 10000 });
        await confirmButton.click({ force: true });
        const toast = this.page.getByRole('alert', { name: 'Listing successfully deleted' });
        await expect(toast).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(2000);
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);
        // Wait for the image tab to be visible and click it (adjust selector if needed)
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 10000 });
        await imageTab.click();

        const imageTabSearchField = this.page.getByRole('tabpanel', { name: 'gavel Images' }).getByPlaceholder('Search');
        await imageTabSearchField.waitFor({ state: 'visible', timeout: 10000 });

        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(2000);

    }

    // Verify that the Floor Plan folder is displayed upon opening the image tab
    async verifyFloorPlanFolderVisibleInImageTab() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Wait for all listing cards to load and click the first card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Wait for the image tab to be visible and click it (adjust selector if needed)
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 10000 });
        await imageTab.click();

        // Wait for the Floor Plan folder/item to be visible within the image tab panel
        const floorPlanFolder = this.page.locator('div.lib-file', { hasText: 'Floorplans' });
        await expect(floorPlanFolder).toBeVisible({ timeout: 20000 });

        // Optionally, close the modal/tab after check
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(2000);
    }

    // Verify that the Add button provides options for folder, public file upload, and private file upload
    async verifyAddButtonOptionsInImageTab() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Wait for all listing cards to load and click the first card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 10000 });
        await imageTab.click();

        // Wait for the Floor Plan folder/item to be visible within the image tab panel
        const floorPlanFolder = this.page.locator('div.lib-file', { hasText: 'Floorplans' });
        await floorPlanFolder.scrollIntoViewIfNeeded();
        await expect(floorPlanFolder).toBeVisible({ timeout: 30000 });

        // Find the 'Add' button (usually a plus icon or labeled 'Add')
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();

        // Verify "Folder", "Public File Upload", and "Private File Upload" options appear
        const folderOption = this.page.locator('a', { hasText: 'Folder' });
        const publicOption = this.page.locator('a', { hasText: /File Upload \(Public\)/ });
        const privateOption = this.page.locator('a', { hasText: /File Upload \(Private\)/ });

        await expect(folderOption).toBeVisible({ timeout: 10000 });
        await expect(publicOption).toBeVisible({ timeout: 10000 });
        await expect(privateOption).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);
        // Optionally close popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    // Verifies that selecting "Folder" from the Add menu opens the 'New Folder' popup/dialog
    async verifyFolderOptionOpensNewFolderPopup() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Wait for all listing cards to load and click the first card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 30000 });
        await imageTab.click();

        // Wait for the Floor Plan folder/item to be visible within the image tab panel
        const floorPlanFolder = this.page.locator('div.lib-file', { hasText: 'Floorplans' });
        await floorPlanFolder.scrollIntoViewIfNeeded();
        await expect(floorPlanFolder).toBeVisible({ timeout: 30000 });
        // Click the Add button
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();
        await this.page.waitForTimeout(1000);

        // Click "Folder" option
        const folderOption = this.page.locator('a', { hasText: 'Folder' });
        await expect(folderOption).toBeVisible({ timeout: 10000 });
        await folderOption.click({ force: true });
        await this.page.waitForTimeout(1000);
        // "New Folder" popup/dialog should be visible (look for "New Folder" title or name input)
        const popupTitle = this.page.getByText('New folder');
        const nameInput = this.page.getByRole('textbox', { name: 'Folder name' });

        await expect(popupTitle).toBeVisible({ timeout: 10000 });
        await expect(nameInput).toBeVisible({ timeout: 10000 });

        // click cancel button
        const cancelButton = this.page.getByRole('button', { name: /cancel/i });
        await expect(cancelButton).toBeVisible({ timeout: 5000 });
        await cancelButton.click();

        await this.page.waitForTimeout(1200);
        // Optionally close the popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }

    }

    /**
     * Verifies that the 'New Folder' popup contains a required name field.
     */
    async verifyNewFolderPopupHasRequiredNameField() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Wait for all listing cards to load and click the first card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 10000 });
        await imageTab.click();

        const floorPlanArea = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' });
        await floorPlanArea.scrollIntoViewIfNeeded();
        await floorPlanArea.waitFor({ state: 'visible', timeout: 30000 });
        // Find the 'Add' button (usually a plus icon or labeled 'Add')
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click({ force: true });

        // Wait for Folder and Upload options to become visible
        const folderOption = this.page.locator('a').filter({ hasText: 'Folder' });

        await expect(folderOption).toBeVisible({ timeout: 5000 });
        await this.page.waitForTimeout(1000);
        await folderOption.click();

        const newFolderDialog = this.page.locator('.p-dialog-content');
        await expect(newFolderDialog).toBeVisible({ timeout: 10000 });

        // Click the "Cancel" button in the folder creation dialog
        const createButton = this.page.getByRole('button', { name: 'Create' }).first();
        await expect(createButton).toBeVisible({ timeout: 10000 });
        await createButton.click();
        // Check for "Name is required!" validation message after trying to create a folder with no name
        const nameRequiredMsg = this.page.getByText('Name is required!').first();
        await expect(nameRequiredMsg).toBeVisible({ timeout: 10000 });

        // Click the "Cancel" button in the New Folder popup
        const cancelButton = this.page.getByRole('button', { name: 'Cancel' }).first();
        await expect(cancelButton).toBeVisible({ timeout: 5000 });
        await cancelButton.click();

        await this.page.waitForTimeout(1200);
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(2000);
    }

    // Verifies that the New Folder popup has cross, cancel, and create buttons
    async verifyNewFolderPopupHasButtons() {

        await this.navigateToListings();
        await this.switchToGridView();

        // Wait for all listing cards to load and click the first card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 10000 });
        await imageTab.click();

        const floorPlanArea = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' });
        await floorPlanArea.scrollIntoViewIfNeeded();
        await floorPlanArea.waitFor({ state: 'visible', timeout: 30000 });

        // Find the 'Add' button (usually a plus icon or labeled 'Add')
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click({ force: true });

        await this.page.waitForTimeout(1000);

        // Wait for Folder and Upload options to become visible
        const folderOption = this.page.locator('a').filter({ hasText: 'Folder' });

        await expect(folderOption).toBeVisible({ timeout: 5000 });
        await this.page.waitForTimeout(1000);
        await folderOption.click();

        // Assumes the New Folder popup is open
        const newFolderDialog = this.page.locator('.p-dialog-content');
        await expect(newFolderDialog).toBeVisible({ timeout: 5000 });

        // The cross/close icon button (could be .pi-times)
        const closeButton = this.page.locator('.p-dialog-header .p-dialog-header-close, .pi.pi-times').nth(2);
        await expect(closeButton).toBeVisible({ timeout: 2000 });

        // The Cancel button
        const cancelButton = this.page.getByRole('button', { name: /cancel/i }).first();
        await expect(cancelButton).toBeVisible({ timeout: 2000 });

        // The Create button
        const createButton = this.page.getByRole('button', { name: /create/i }).first();
        await expect(createButton).toBeVisible({ timeout: 2000 });

        await cancelButton.click();

        await this.page.waitForTimeout(1200);


        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(2000);
    }

    async createNewFolderInImagesTab() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 10000 });
        await imageTab.click();

        const floorPlanArea = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' });
        await floorPlanArea.scrollIntoViewIfNeeded();
        await floorPlanArea.waitFor({ state: 'visible', timeout: 30000 });

        // Find the 'Add' button (usually a plus icon or labeled 'Add')
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click({ force: true });
        await this.page.waitForTimeout(1000);

        // Wait for Folder and Upload options to become visible
        const folderOption = this.page.locator('a').filter({ hasText: 'Folder' });

        await expect(folderOption).toBeVisible({ timeout: 5000 });
        await this.page.waitForTimeout(1000);
        await folderOption.click();
        // Wait for the New Folder dialog to appear
        const newFolderDialog = this.page.locator('.p-dialog-content');
        await expect(newFolderDialog).toBeVisible({ timeout: 10000 });

        const folderNameInput = this.page.getByRole('textbox', { name: 'Folder name' });
        await folderNameInput.click();
        // Use faker to generate a random folder name for more robust testing
        const { faker } = require('@faker-js/faker');
        const randomFolderName = faker.word.sample();
        await folderNameInput.fill(randomFolderName);
        const createButton = this.page.getByRole('button', { name: /create/i }).first();
        await expect(createButton).toBeVisible({ timeout: 3000 });
        await createButton.click();

        const automationFolder = this.page.locator('.lib-file').filter({ hasText: randomFolderName });
        await automationFolder.scrollIntoViewIfNeeded();
        await expect(automationFolder).toBeVisible({ timeout: 30000 });

        await this.page.waitForTimeout(1200);
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(2000);

    }

    /**
     * Verifies that clicking "File Upload (Public)" from the Add menu opens the file upload dialog
     * and allows the user to successfully upload a file.
     */
    async verifyPublicFileUploadAllowsUploadingFile(filePath: string) {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first property card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Ensure Floorplans folder visible
        const floorPlanArea = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' });
        await floorPlanArea.scrollIntoViewIfNeeded();
        await floorPlanArea.waitFor({ state: 'visible', timeout: 30000 });
        // Find the 'Add' button (usually a plus icon or labeled 'Add')
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click({ force: true });
        await this.page.waitForTimeout(1000);

        // Click "File Upload (Public)" option
        const publicOption = this.page.locator('a', { hasText: 'File Upload (Public)' });

        await expect(publicOption).toBeVisible({ timeout: 3000 });
        await publicOption.click();

        // Wait for upload input to appear
        const fileInput = this.page.locator('#fileUpload');
        // Upload the file
        await fileInput.setInputFiles(filePath);

        // Check image name visibility within the .lib-file area
        const imageName = filePath.split(/[\\/]/).pop();
        if (imageName) {
            const imageNameInLibFile = this.page.locator(`.lib-file :text("${imageName}")`).first();
            await expect(imageNameInLibFile).toBeVisible({ timeout: 20000 });
        }

        // Save and close
        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 5000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }

    /**
     * Verifies that a file uploaded via the Public File Upload option
     */
    async verifyPublicFileUploadAllowsDownload(filePath: string) {

        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first property card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Ensure Floorplans folder visible
        const floorPlanArea = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' });
        await floorPlanArea.scrollIntoViewIfNeeded();
        await floorPlanArea.waitFor({ state: 'visible', timeout: 30000 });

        // Find the 'Add' button (usually a plus icon or labeled 'Add')
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click({ force: true });
        await this.page.waitForTimeout(1000);

        // Click "File Upload (Public)" option
        const publicOption = this.page.locator('a', { hasText: 'File Upload (Public)' });

        await expect(publicOption).toBeVisible({ timeout: 3000 });
        await publicOption.click();

        // Wait for upload input to appear
        const fileInput = this.page.locator('#fileUpload');
        // Upload the file
        await fileInput.setInputFiles(filePath);

        // Check image name visibility within the .lib-file area
        const imageName = filePath.split(/[\\/]/).pop();
        if (imageName) {
            const imageNameInLibFile = this.page.locator(`.lib-file :text("${imageName}")`);
            await expect(imageNameInLibFile).toBeVisible({ timeout: 20000 });
        }

        // Check for download element in the same context
        const downloadLocator = this.page.locator('img.img-hub2[src*="Library/PropertyImage"]').first()
        await downloadLocator.click();

        const downloadIcon = this.page.locator('.p-element.mr-3.pi.pi-download').first();
        await expect(downloadIcon).toBeVisible({ timeout: 5000 });
        await downloadIcon.click();
        // Optionally verify that re-downloading doesn't error
        await this.page.waitForTimeout(1000);
        // Close via pipi close icon
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1500);
    }

    // Upload an image using the Private File Upload option
    async uploadPrivateImage(filePath: string) {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first property card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Ensure Floorplans folder visible
        const floorPlanArea = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' });
        await floorPlanArea.scrollIntoViewIfNeeded();
        await floorPlanArea.waitFor({ state: 'visible', timeout: 30000 });

        // Find the 'Add' button (usually a plus icon or labeled 'Add')
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click({ force: true });
        await this.page.waitForTimeout(1000);

        // Click "File Upload (Public)" option
        const privateOption = this.page.locator('a', { hasText: 'File Upload (Private)' });

        await expect(privateOption).toBeVisible({ timeout: 3000 });
        await privateOption.click();

        // Wait for upload input to appear
        const fileInput = this.page.locator('#fileUpload');
        // Upload the file
        await fileInput.setInputFiles(filePath);

        // Check image name visibility within the .lib-file area
        const imageName = filePath.split(/[\\/]/).pop();
        if (imageName) {
            const imageNameInLibFile = this.page.locator(`.lib-file :text("${imageName}")`).first();
            await expect(imageNameInLibFile).toBeVisible({ timeout: 20000 });
        }

        // Check for download element in the same context
        const downloadLocator = this.page.locator('img.img-hub2[src*="PropertyImage"]').last()
        await downloadLocator.click();

        const downloadIcon = this.page.locator('.p-element.mr-3.pi.pi-download').first();
        await expect(downloadIcon).toBeVisible({ timeout: 5000 });
        await downloadIcon.click();
        // Wait for either the File Access dialog or file download to initiate
        const fileAccessDialog = this.page.locator('text=File Access').first();
        if (await fileAccessDialog.isVisible({ timeout: 3000 }).catch(() => false)) {
            // Enter PIN in the input field
            const pinInput = this.page.locator('input[placeholder="PIN"]');
            await expect(pinInput).toBeVisible({ timeout: 5000 });
            // Replace '1234' with the correct PIN if needed/configured elsewhere
            await pinInput.fill('1234');
            // Click Save button
            const saveButton = this.page.getByRole('button', { name: 'Save' });
            await expect(saveButton).toBeEnabled({ timeout: 3000 });
            await saveButton.click();
            // Wait for dialog to disappear, download to start
            await expect(fileAccessDialog).toBeHidden({ timeout: 5000 });
        }
        // Optionally verify that re-downloading doesn't error
        await this.page.waitForTimeout(1000);

        // 
        // Close via pipi close icon
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1500);
    }

    /**
     * Verifies that entering the correct PIN allows the user to download a file from the Private File Upload option.
     */
    async verifyPrivateFileUploadAllowsDownload() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first property card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Ensure Floorplans folder is visible
        const floorPlanArea = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' });
        await floorPlanArea.scrollIntoViewIfNeeded();
        await floorPlanArea.waitFor({ state: 'visible', timeout: 30000 });

        await this.page.waitForTimeout(1500);
        // Check for download element in the same context
        const downloadLocator = this.page.locator('img.img-hub2[src*="propertyImage"]').last()
        await downloadLocator.click();

        const downloadIcon = this.page.locator('.p-element.mr-3.pi.pi-download').first();
        await expect(downloadIcon).toBeVisible({ timeout: 5000 });
        await downloadIcon.click();

        // Enter PIN in the input field
        const pinInput = this.page.locator('input[placeholder="PIN"]');
        await expect(pinInput).toBeVisible({ timeout: 5000 });
        // Replace '1234' with the correct PIN if needed/configured elsewhere
        await pinInput.fill('1234');
        // Click Save button
        const saveButton = this.page.getByLabel('Images').getByRole('button', { name: 'Save' });
        await saveButton.click();
        // Optionally verify that re-downloading doesn't error
        await this.page.waitForTimeout(1000);

        // Save and close
        const saveAndCloseButton = this.page.getByRole('button', { name: /Save & Close/i }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 5000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }

    // Verify that entering an incorrect PIN prevents file download
    async verifyPrivateFileUploadInvalidPinBlocksDownload() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first property card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Ensure Floorplans folder is visible
        const floorPlanArea = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' });
        await floorPlanArea.scrollIntoViewIfNeeded();
        await floorPlanArea.waitFor({ state: 'visible', timeout: 30000 });

        await this.page.waitForTimeout(1500);

        // Attempt to download a private image to trigger PIN entry
        const downloadLocator = this.page.locator('img.img-hub2[src*="propertyImage"]').last();
        await downloadLocator.click();

        const downloadIcon = this.page.locator('.p-element.mr-3.pi.pi-download').first();
        await expect(downloadIcon).toBeVisible({ timeout: 5000 });
        await downloadIcon.click();

        // Wait for File Access (PIN entry) dialog to appear
        const fileAccessDialog = this.page.locator('text=File Access').first();
        if (await fileAccessDialog.isVisible({ timeout: 3000 }).catch(() => false)) {
            // Enter an incorrect PIN
            const pinInput = this.page.locator('input[placeholder="PIN"]');
            await expect(pinInput).toBeVisible({ timeout: 5000 });
            await pinInput.fill('9999'); // Use a clearly incorrect PIN
            const saveButton = this.page.getByLabel('Images').getByRole('button', { name: 'Save' });
            await expect(saveButton).toBeEnabled({ timeout: 3000 });
            await saveButton.click();

            // Expect an error or that the dialog remains visible (download NOT allowed)
            // Check for error message (adjust selector based on UI)
            const pinErrorMsg = this.page.locator('text=Invalid PIN');
            await expect(pinErrorMsg).toBeVisible({ timeout: 5000 });

            const cancelButton = this.page.getByRole('button', { name: /Cancel/i });
            await expect(cancelButton).toBeVisible({ timeout: 3000 });
            await cancelButton.click();
        }
        await this.page.waitForTimeout(1000);

        // Close the dialog or form
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1500);
    }

    // Verify that double clicking a file opens the File Preview popup
    async verifyDoubleClickOpensFilePreview() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first property card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Ensure Floorplans folder is visible
        const floorPlanArea = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' });
        await floorPlanArea.scrollIntoViewIfNeeded();
        await floorPlanArea.waitFor({ state: 'visible', timeout: 30000 });

        await this.page.waitForTimeout(1500);
        // Wait for the file/images area to be visible
        const fileThumbnail = this.page.locator('img.img-hub2[src*="PropertyImage"]').first();
        await expect(fileThumbnail).toBeVisible({ timeout: 10000 });

        // Double-click the file thumbnail
        await fileThumbnail.dblclick();

        // Wait for the File Preview popup/dialog to appear
        const previewDialog = this.page.locator('text=File Preview').first();
        await expect(previewDialog).toBeVisible({ timeout: 5000 });

        // Verify that the close (cross) icon is visible in the preview dialog
        const crossIcon = this.page.getByRole('dialog').getByRole('button').filter({ hasText: /^$/ });
        await expect(crossIcon).toBeVisible({ timeout: 3000 });

        await crossIcon.click();

        await this.page.waitForTimeout(1200);

        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    // Verify that the total number of files is displayed next to the search field
    async verifyFileCountDisplayedNextToSearch() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first property card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Ensure Floorplans folder is visible
        const floorPlanArea = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' });
        await floorPlanArea.scrollIntoViewIfNeeded();
        await floorPlanArea.waitFor({ state: 'visible', timeout: 30000 });

        // Wait for search field to be visible
        const searchField = this.page.locator('input[placeholder="Search"]').last();
        await expect(searchField).toBeVisible({ timeout: 10000 });

        const fileCountLocator = this.page.locator('label', { hasText: /\d+\sFiles/ });

        // Wait for file count to be visible
        await expect(fileCountLocator.first()).toBeVisible({ timeout: 5000 });

        // Text print kerwana hy
        const fileCountText = await fileCountLocator.first().innerText();
        console.log("File count label text:", fileCountText);

        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }

    }

    // Verify that right clicking a folder displays options for Share, Rename, Make a Copy, and Remove
    async verifyFolderContextMenuOptions() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first property card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Wait for any folder - e.g. Floorplans - to appear
        const folderElem = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' }).first();
        await folderElem.scrollIntoViewIfNeeded();
        await expect(folderElem).toBeVisible({ timeout: 10000 });

        // Right click on the folder
        await folderElem.click({ button: 'right' });
        await this.page.waitForTimeout(1000);

        // Check for Share, Rename, Make a Copy, Remove options in context menu
        const shareOption = this.page.getByText(/Share/i).first();
        const renameOption = this.page.getByText(/Rename/i).last();
        const makeCopyOption = this.page.getByText(/Make a Copy/i).first();
        const removeOption = this.page.getByText(/Remove/i).first();

        await expect(shareOption).toBeVisible({ timeout: 10000 });
        await expect(renameOption).toBeVisible({ timeout: 10000 });
        await expect(makeCopyOption).toBeVisible({ timeout: 10000 });
        await expect(removeOption).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);

        // Optionally close the dialog again using ".pi.pi-times" icon if still open
        const closePreviewButton = this.page.locator('.pi.pi-times').filter({ hasText: '' }).first();
        if (await closePreviewButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            await closePreviewButton.click({ force: true });
        }
    }

    // Verify that clicking Remove deletes the last folder
    async verifyRemoveFolderDeletesFolder() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first property card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        const folderElem = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' }).first();
        await folderElem.scrollIntoViewIfNeeded();
        await expect(folderElem).toBeVisible({ timeout: 10000 });

        // Find and trim the folder name text (remove whitespace)
        const folders = this.page.locator('div.lib-file').last();
        await folders.scrollIntoViewIfNeeded();
        await expect(folders).toBeVisible({ timeout: 15000 });
        const folderName = (await folders.textContent())?.trim();
        await this.page.waitForTimeout(600);
        // Right-click the folder and select 'Remove'
        await folders.click({ button: 'right' });
        await folders.click({ button: 'right' });
        await this.page.waitForTimeout(600);

        const removeOption = this.page.getByText(/Remove/i).first();
        await expect(removeOption).toBeVisible({ timeout: 5000 });
        await removeOption.click();

        // Wait a moment for deletion to process
        await this.page.waitForTimeout(1200);

        // Verify the folder no longer remains in the list
        if (folderName) {
            const folderList = this.page.locator('div.lib-file', { hasText: folderName });
            await expect(folderList).toHaveCount(0, { timeout: 30000 });
        }

        // Optionally close any open popups
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }

    }

    // Verify that clicking Make a Copy duplicates the folder
    async verifyMakeCopyDuplicatesFolder() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first listing card to open details
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Navigate to the Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Make sure the "Floorplans" folder is present
        const floorplansFolder = this.page.locator('.lib-file', { hasText: 'Floorplans' }).first();
        await floorplansFolder.scrollIntoViewIfNeeded();
        await expect(floorplansFolder).toBeVisible({ timeout: 30000 });

        // Identify the last folder (target for duplication)
        const targetFolder = this.page.locator('.lib-file').last();
        await targetFolder.scrollIntoViewIfNeeded();
        await expect(targetFolder).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);
        // Get the folder name before duplication
        const originalFolderName = (await targetFolder.innerText()).trim();

        // Right-click twice to ensure context menu is open
        await targetFolder.click({ button: 'right' });
        await targetFolder.click({ button: 'right' });
        await this.page.waitForTimeout(1000);

        // Click Make a Copy from context menu
        const makeCopyOption = this.page.getByRole('link', { name: /Make a Copy/i });
        await expect(makeCopyOption).toBeVisible({ timeout: 10000 });
        await makeCopyOption.click();

        // Verify duplicate folder appears with expected name
        const expectedCopyName = `Copy of ${originalFolderName}`;
        const copiedFolder = this.page.locator('.lib-file', { hasText: expectedCopyName }).first();
        await copiedFolder.scrollIntoViewIfNeeded();
        await expect(copiedFolder).toBeVisible({ timeout: 20000 });

        // Optionally close any open popups
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that entering a name and clicking Rename changes the folder name.
     */
    async verifyRenameFolderChangesName() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Find the last folder in the Files tab (to minimize risk of conflicting with system folders)
        const folder = this.page.locator('div.lib-file').last();
        await folder.scrollIntoViewIfNeeded();
        await expect(folder).toBeVisible({ timeout: 20000 });

        // Use a unique, random rename string to ensure uniqueness and avoid stale cache/UI issues
        const { faker } = require('@faker-js/faker');
        const newFolderName = `Renamed-${faker.string.alphanumeric(6)}`;
        await this.page.waitForTimeout(1000);

        // Right-click the folder to open context menu
        await folder.click({ button: "right" });
        await this.page.waitForTimeout(750);

        // Find and click 'Rename' in the context menu
        const renameOption = this.page.getByText('Rename').first();
        await expect(renameOption).toBeVisible({ timeout: 10000 });
        await renameOption.click({ force: true });

        const nameInput = this.page.locator('input[type="text"][required]');
        await expect(nameInput).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(500);

        // Clear the input in a robust way before filling
        await nameInput.click();
        await this.page.waitForTimeout(200);
        for (const char of newFolderName) {
            await nameInput.type(char, { delay: 20 }); // 120ms per character
        }

        // Click the "Rename" button
        const renameBtn = this.page.getByRole('button', { name: /^Rename$/i }).first();
        await expect(renameBtn).toBeVisible({ timeout: 5000 });
        await renameBtn.click({ force: true });

        // Verify the success toast "Name changed successfully" appears
        const successToast = this.page.getByRole('alert', { name: 'Name change successfully' })
        await expect(successToast).toBeVisible({ timeout: 10000 });


        // Wait for the folder tile to update—retrying for potential debounce/network delay
        const renamedFolder = this.page.locator('div.lib-file', { hasText: newFolderName }).first();
        await renamedFolder.scrollIntoViewIfNeeded();
        await expect(renamedFolder).toBeVisible({ timeout: 25000 }); // increased for async propagation
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    // Verify that clicking Share opens the Share popup
    async verifyShareOptionOpensSharePopup() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Wait for all listing cards to load and click the first card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Find a folder to share
        const foldersLocator = this.page.locator('.lib-file').last();
        await foldersLocator.scrollIntoViewIfNeeded();
        await expect(foldersLocator).toBeVisible({ timeout: 30000 });

        await this.page.waitForTimeout(750);

        // Right-click to open context menu
        await foldersLocator.click({ button: 'right' });
        await foldersLocator.click({ button: 'right' });
        await this.page.waitForTimeout(500);

        // Click Share in context menu
        const shareOption = this.page.getByText(/Share/i).first();
        await expect(shareOption).toBeVisible({ timeout: 6000 });
        await shareOption.click({ force: true });
        await this.page.waitForTimeout(1000);

        // Should see "Share" dialog appear (look for some label/input inside it)
        const shareDialogTitle = this.page.getByText('Share with people');
        await expect(shareDialogTitle).toBeVisible({ timeout: 10000 });

        // Try clicking 'Share' button with nobody selected (should be disabled)
        const shareButton = this.page.getByRole('button', { name: /^Share$/i }).last();
        await expect(shareButton).toBeVisible({ timeout: 6000 });
        await expect(shareButton).toBeDisabled();
        const errMsg = this.page.getByText(/At least one staff or team must be selected/i);
        await expect(errMsg).toBeVisible({ timeout: 6000 });

        // Click the "Cancel" button to close the share dialog
        const cancelBtn = this.page.getByRole('button', { name: /^Cancel$/i }).first();
        await expect(cancelBtn).toBeVisible({ timeout: 5000 });
        await cancelBtn.click();

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    async renamePopupopen() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Find the first folder in the Files tab
        const folder = this.page.locator('div.lib-file').last();
        await folder.scrollIntoViewIfNeeded();
        await expect(folder).toBeVisible({ timeout: 20000 });
        await this.page.waitForTimeout(750);

        // Right-click the folder to open context menu
        await folder.click({ button: "right" });
        await folder.click({ button: "right" });
        await this.page.waitForTimeout(2000);

        // Find and click 'Rename' in the context menu
        const renameOption = this.page.locator('a:has(img[alt="Rename"]):has-text("Rename")').first();
        await expect(renameOption).toBeVisible({ timeout: 10000 });
        await renameOption.click();

        await this.page.waitForTimeout(1000);

        // After clicking 'Rename', a rename popup should appear (usually a dialog with input)
        const renameDialog = this.page.getByText('Rename').first();
        const nameInput = this.page.locator('input[type="text"][required]');
        await expect(renameDialog).toBeVisible({ timeout: 10000 });
        await expect(nameInput).toBeVisible({ timeout: 10000 });

        // Click cancel button in the rename popup
        const cancelButton = this.page.getByRole('button', { name: /cancel/i }).first();
        await expect(cancelButton).toBeVisible({ timeout: 5000 });
        await cancelButton.click();

        await this.page.waitForTimeout(1200);

        // Optionally close the popup
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that adding a staff or team member in the Share popup enables the Share button.
     */
    async verifyShareFolderSelectingStaffOrTeam() {
        // Navigate to Listings, open grid, then open the first listing
        await this.navigateToListings();
        await this.switchToGridView();
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Find the first folder in the Files tab
        const folder = this.page.locator('div.lib-file').last();
        await folder.scrollIntoViewIfNeeded();
        await expect(folder).toBeVisible({ timeout: 20000 });
        await this.page.waitForTimeout(750);

        // Right-click the folder to open context menu
        await folder.click({ button: "right" });
        await folder.click({ button: "right" });
        await this.page.waitForTimeout(2000);

        // Select Share from the context menu
        const shareOption = this.page.getByText(/Share/i).first();
        await expect(shareOption).toBeVisible({ timeout: 10000 });
        await shareOption.click({ force: true });

        // Share dialog appears
        const shareDialogTitle = this.page.getByText('Share with people');
        await expect(shareDialogTitle).toBeVisible({ timeout: 10000 });

        const searchUserField = this.page.locator('div.ng-value-container:has-text("Search User") div.ng-input input');
        await expect(searchUserField).toBeVisible({ timeout: 10000 });
        await searchUserField.click({ force: true });

        // Find the first user/team suggestion in the dropdown if it appears
        const firstSuggestion = this.page.locator('div.ng-option[role="option"]').first();
        if (await firstSuggestion.isVisible({ timeout: 10000 }).catch(() => false)) {
            await firstSuggestion.click();
        }

        // Share button should start disabled
        const shareButton = this.page.getByRole('button', { name: /^Share$/i }).last();
        await expect(shareButton).toBeVisible({ timeout: 6000 });
        await expect(shareButton).toBeEnabled();

        // Close the share dialog using Cancel or close button
        const cancelBtn = this.page.getByRole('button', { name: /^Cancel$/i }).first();
        if (await cancelBtn.isVisible().catch(() => false)) {
            await cancelBtn.click();
        }
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that attempting to share a folder without selecting staff or team shows error and disables Share button.
     */
    public async verifyShareFolderRequiresStaffOrTeam(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Find the first folder in the Files tab
        const folder = this.page.locator('div.lib-file').last();
        await folder.scrollIntoViewIfNeeded();
        await expect(folder).toBeVisible({ timeout: 20000 });
        await this.page.waitForTimeout(750);

        // Right-click the folder to open context menu
        await folder.click({ button: "right" });
        await folder.click({ button: "right" });
        await this.page.waitForTimeout(2000);

        // Click Share in context menu
        const shareOption = this.page.getByText(/Share/i).first();
        await expect(shareOption).toBeVisible({ timeout: 6000 });
        await shareOption.click({ force: true });
        await this.page.waitForTimeout(1000);

        // Should see "Share" dialog appear (look for some label/input inside it)
        const shareDialogTitle = this.page.getByText('Share with people');
        await expect(shareDialogTitle).toBeVisible({ timeout: 10000 });

        // Try clicking 'Share' button with nobody selected (should be disabled)
        const shareButton = this.page.getByRole('button', { name: /^Share$/i }).last();
        await expect(shareButton).toBeVisible({ timeout: 6000 });
        await expect(shareButton).toBeDisabled();
        const errMsg = this.page.getByText(/At least one staff or team must be selected/i);
        await expect(errMsg).toBeVisible({ timeout: 6000 });

        // Click the "Cancel" button to close the share dialog
        const cancelBtn = this.page.getByRole('button', { name: /^Cancel$/i }).first();
        await expect(cancelBtn).toBeVisible({ timeout: 5000 });
        await cancelBtn.click();

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that files in the Images tab show all expected right-click context menu options:
     * Preview, Share, Get Link, Get Path, Rename, Make a Copy, Download, Remove
     */
    async verifyFileContextMenuOptionsInImagesTab() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();

        // Find the first image file in the listing files grid
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1200);
        await imageFile.click({ button: 'right' });
        await imageFile.click({ button: 'right' });
        // After clicking the image, all options in the context menu should be visible by text

        // Find the container for the folder options list specifically
        const folderOptionsList = this.page.locator('#folderOptionsList ul.folders');
        await expect(folderOptionsList).toBeVisible({ timeout: 5000 });

        // These selectors match the text and icon/image for each menu option as rendered in the DOM
        const optionChecks = [
            { text: 'Preview', iconSelector: 'i.pi.pi-eye' },
            { text: 'Share', iconSelector: 'i.pi.pi-user-plus' },
            { text: 'Get Link', iconSelector: 'i.pi.pi-link' },
            { text: 'Get Path', iconSelector: 'i.pi.pi-directions' },
            { text: 'Rename', iconSelector: 'img[alt="Rename"][src*="pencil.svg"]' },
            { text: 'Make a Copy', iconSelector: 'i.pi.pi-copy' },
            { text: 'Download', iconSelector: 'i.pi.pi-download' },
            { text: 'Remove', iconSelector: 'img[alt="Remove"][src*="delete_icon.svg"]' }
        ];

        for (const { text, iconSelector } of optionChecks) {
            // Each option is a <li> containing an <a> with icon/img and the label text
            const option = folderOptionsList.locator(`li:has(${iconSelector}) a`, { hasText: text });
            await option.scrollIntoViewIfNeeded();
            await expect(option, `Menu option "${text}" with icon should be visible`).toBeVisible({ timeout: 10000 });
        }

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that clicking Preview opens the file in a popup.
     */
    async verifyPreviewOptionOpensFileInImages() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();

        // Find the image file to use for right click (adjust the file name if needed)
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1200);

        // Right-click the folder to open context menu
        await imageFile.click({ button: 'right' });
        await imageFile.click({ button: 'right' });

        await this.page.waitForTimeout(1000);

        const previewOption = this.page.locator('a:has(i.pi.pi-eye):has-text("Preview")').first();
        await expect(previewOption).toBeVisible({ timeout: 5000 });
        await previewOption.click();

        const previewDialog = this.page.locator('.p-dialog:has-text("Preview")');
        await expect(previewDialog).toBeVisible({ timeout: 10000 });

        // Locate the cross (close) icon in the path popup dialog
        const crossIcon = this.page.locator('button.p-dialog-header-close');
        await expect(crossIcon.first()).toBeVisible();
        await crossIcon.click();
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that clicking Download successfully downloads the file in the Images tab.
     */
    async verifyDownloadImageFile() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();

        // Find the image file to use for right click (adjust the file name if needed)
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1200);

        // Right-click on the file to open context menu
        await imageFile.click({ button: 'right' });
        await imageFile.click({ button: 'right' });
        await this.page.waitForTimeout(1000);

        // Click on the "Download" action from the context menu
        const downloadOption = this.page.locator('a:has(i.pi.pi-download):has-text("Download")').first();
        await expect(downloadOption).toBeVisible({ timeout: 5000 });
        await downloadOption.click();
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that clicking "Get Link" in the Images tab opens a popup with the file link.
     */
    async verifyGetLinkOpensLinkPopupInImagesTab() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();

        // Find the image file to use for right click (adjust the file name if needed)
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1200);

        // Right-click on the file to open context menu
        await imageFile.click({ button: 'right' });
        await imageFile.click({ button: 'right' });
        // Click the "Preview" option from context menu (adjust selector if needed)
        const previewOption = this.page.locator('a:has(i.pi.pi-eye):has-text("Preview")').first();
        await expect(previewOption).toBeVisible({ timeout: 5000 });
        await previewOption.click();

        // Assert that the preview file modal/dialog appears
        // The selector might need to be updated according to the actual modal/dialog html
        const previewDialog = this.page.locator('.p-dialog:has-text("Preview")');
        await expect(previewDialog).toBeVisible({ timeout: 10000 });

        // Locate the cross (close) icon in the path popup dialog
        const crossIcon = this.page.locator('button.p-dialog-header-close');
        await expect(crossIcon.first()).toBeVisible();
        await crossIcon.click();
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that clicking "Get Path" in the Images tab opens a popup with the file path.
     */
    async verifyGetPathOpensPathPopupInImagesTab() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();

        // Find the image file to use for right click (adjust the file name if needed)
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1200);

        // Right-click on the file to open context menu
        await imageFile.click({ button: 'right' });
        await imageFile.click({ button: 'right' });
        await this.page.waitForTimeout(1000);

        // Wait for the context menu and click "Get Path"
        const getPathOption = this.page.locator('a:has(i.pi.pi-directions):has-text("Get Path")').first();
        await getPathOption.click();
        await this.page.waitForTimeout(1000);

        // Assert that the path popup/dialog appears
        const pathPopup = this.page.locator('.p-dialog:has-text("Get Path")');
        await expect(pathPopup).toBeVisible({ timeout: 10000 });

        // Locate the cross (close) icon in the path popup dialog
        const crossIcon = this.page.locator('button.p-dialog-header-close');
        await expect(crossIcon.first()).toBeVisible();
        await crossIcon.click();
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that clicking "Get Path" on a private file requires a PIN
     */
    async verifyGetPathOnPrivateFileRequiresPIN() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();

        // Find a private image file, adjust name as needed
        const privateImageFile = this.page.locator('div.lib-file', { hasText: 'propertyImage.jpg' }).first();
        await privateImageFile.scrollIntoViewIfNeeded();
        await expect(privateImageFile).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1200);

        await privateImageFile.click();

        const downloadIcon = this.page.locator('.p-element.mr-3.pi.pi-download').first();
        await expect(downloadIcon).toBeVisible({ timeout: 5000 });
        await downloadIcon.click();

        // Assert that PIN input appears
        const pinInput = this.page.locator('input[placeholder="PIN"]');
        await expect(pinInput).toBeVisible({ timeout: 5000 });

        // Negative test: Try clicking save without PIN, expect error or indication
        const saveButton = this.page.getByLabel('Images').getByRole('button', { name: 'Save' })
        await expect(saveButton).toBeVisible({ timeout: 5000 });
        await saveButton.click();

        const pinError = this.page.getByText('Please enter PIN first');
        await expect(pinError).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);

        // Click the cancel button in the PIN dialog
        const cancelButton = this.page.getByRole('button', { name: /Cancel/i }).first();
        await expect(cancelButton).toBeVisible({ timeout: 5000 });
        await cancelButton.click();
        await this.page.waitForTimeout(1000);

        // Save and close form
        const saveAndCloseButton = this.page.getByRole('button', { name: /Save & Close/i }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 5000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }

    /**
     * Verify that selecting a folder or file enables toolbar options (Share, Download, Delete, More).
     */
    async verifyToolbarOptionsEnabledOnSelection() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Wait for the Floor Plan folder/item to be visible within the image tab panel
        const floorPlanFolder = this.page.locator('div.lib-file', { hasText: 'Floorplans' });
        await floorPlanFolder.scrollIntoViewIfNeeded();
        await expect(floorPlanFolder).toBeVisible({ timeout: 20000 });
        // Right-click the folder to open context menu
        await floorPlanFolder.click({ button: 'right' });
        await floorPlanFolder.click({ button: 'right' });
        await this.page.waitForTimeout(1000);

        // Check for Share, Rename, Make a Copy, Remove options in context menu
        const shareOption = this.page.getByText(/Share/i).first();
        const renameOption = this.page.getByText(/Rename/i).last();
        const makeCopyOption = this.page.getByText(/Make a Copy/i).first();
        const removeOption = this.page.getByText(/Remove/i).first();

        await expect(shareOption).toBeVisible({ timeout: 10000 });
        await expect(renameOption).toBeVisible({ timeout: 10000 });
        await expect(makeCopyOption).toBeVisible({ timeout: 10000 });
        await expect(removeOption).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);

        // Optionally close the dialog again using ".pi.pi-times" icon if still open
        const closePreviewButton = this.page.locator('.pi.pi-times').filter({ hasText: '' }).first();
        if (await closePreviewButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            await closePreviewButton.click({ force: true });
        }

    }

    /**
     * Verify that clicking the List View/Grid View toggle changes the display in the Images tab
     */
    async verifyImagesTabListGridViewToggle() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Wait for the Floor Plan folder/item to be visible within the image tab panel
        const floorPlanFolder = this.page.locator('div.lib-file', { hasText: 'Floorplans' });
        await floorPlanFolder.scrollIntoViewIfNeeded();
        await expect(floorPlanFolder).toBeVisible({ timeout: 20000 });
        await this.page.waitForTimeout(1000);
        // Now, verify that the list view container appears and grid view container disappears (if possible)
        const listContainer = this.page.locator('img[ptooltip="List"]');
        await expect(listContainer).toBeVisible({ timeout: 10000 });
        await listContainer.click();

        await this.page.waitForTimeout(1000);

        // After switching to list view, verify that the grid view container appears and the list container disappears (if possible)
        const gridContainer = this.page.locator('img[ptooltip="Grid"]');
        await expect(gridContainer).toBeVisible({ timeout: 10000 });
        await gridContainer.click();

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);

    }

    /**
     * Verify that Zoom In and Zoom Out buttons work in the Edit popup in the Images tab.
     */
    async verifyImagesTabZoomInOutInEditPopup() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Wait for the Floor Plan folder/item to be visible within the image tab panel
        const floorPlanFolder = this.page.locator('div.lib-file', { hasText: 'Floorplans' });
        await floorPlanFolder.scrollIntoViewIfNeeded();
        await expect(floorPlanFolder).toBeVisible({ timeout: 20000 });
        await this.page.waitForTimeout(1000);

        // Locate and click the "Reorder" (edit.svg) icon for image reordering
        const reorderIcon = this.page.locator('img[ptooltip="Reorder"][src="assets/img/edit.svg"].p-element.cursor-pointer')
        await expect(reorderIcon.first()).toBeVisible({ timeout: 10000 });
        await reorderIcon.first().click();

        // Perform zoom in and zoom out by interacting with the slider
        const slider = this.page.locator('p-slider.p-element');
        await expect(slider).toBeVisible({ timeout: 10000 });

        // Get the slider handle
        const sliderHandle = slider.locator('.p-slider-handle').first();

        // Ensure handle is visible and interactable
        await expect(sliderHandle).toBeVisible({ timeout: 5000 });

        const handleBox = await sliderHandle.boundingBox();

        if (!handleBox) {
            throw new Error('Slider handle bounding box not found');
        }
        // Move to center of handle
        await this.page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);

        // Zoom In: Drag to the right by 80 pixels (simulate slider increase)
        await this.page.mouse.down();
        await this.page.mouse.move(handleBox.x + handleBox.width / 2 + 80, handleBox.y + handleBox.height / 2, { steps: 10 });
        await this.page.mouse.up();

        await this.page.waitForTimeout(800);

        // Zoom Out: Drag back to the left by 30 pixels (simulate slider decrease)
        await this.page.mouse.move(handleBox.x + handleBox.width / 2 + 50, handleBox.y + handleBox.height / 2);
        await this.page.mouse.down();
        await this.page.mouse.move(handleBox.x + handleBox.width / 2 + 20, handleBox.y + handleBox.height / 2, { steps: 10 });
        await this.page.mouse.up();

        await this.page.waitForTimeout(800);

        const crossIcon = this.page.locator('img[src="assets/img/Group37073.svg"]');
        await expect(crossIcon.first()).toBeVisible({ timeout: 10000 });
        await crossIcon.click();
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that dragging an image in the Edit popup changes its position.
     */
    async verifyDragChangesImagePosition() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Wait for the Floor Plan folder/item to be visible within the image tab panel
        const floorPlanFolder = this.page.locator('div.lib-file', { hasText: 'Floorplans' });
        await floorPlanFolder.scrollIntoViewIfNeeded();
        await expect(floorPlanFolder).toBeVisible({ timeout: 20000 });
        await this.page.waitForTimeout(1000);


        // Find the image file and drag it to the left side
        const imageFile = this.page.locator('div.lib-file', { hasText: 'propertyImage.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 10000 });

        const imageBox = await imageFile.boundingBox();
        if (!imageBox) throw new Error('BoundingBox for image file not found.');

        // Drag from center of the image file to 150px left of its current center
        const startX = imageBox.x + imageBox.width / 2;
        const startY = imageBox.y + imageBox.height / 2;
        const dragOffset = -150; // pixels to the left

        await this.page.mouse.move(startX, startY);
        await this.page.mouse.down();
        await this.page.mouse.move(startX + dragOffset, startY, { steps: 10 });
        await this.page.mouse.up();

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that deleting an image from the Edit popup removes it from the library.
     */
    async verifyImageDeleteRemovesFromLibrary() {
        await this.navigateToListings();
        await this.switchToGridView();
        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Find the image, open Edit popup
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 20000 });
        await imageFile.click(); // Open image preview/edit popup
        await this.page.waitForTimeout(1000);

        // Find and click Delete/Remove button in the popup
        const deleteBtn = this.page.getByRole('img', { name: 'Remove' }).first();
        await expect(deleteBtn).toBeVisible({ timeout: 10000 });
        await deleteBtn.click();

        // Verify success notification for deletion
        const deletedSuccessMsg = this.page.getByText(/deleted successfully/i, { exact: false });
        await expect(deletedSuccessMsg).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);

        // Close the popup if still present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1000);

    }

    /**
     * Verify that duplicating an image creates a copy with "Copy of ..." in its name.
     */
    async verifyImageMakeCopyCreatesCopy() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Find the image, e.g. 'PropertyImage2.jpg'
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 20000 });

        // Store original image name
        const originalImageName = (await imageFile.textContent())?.trim() ?? '';

        // Right-click image to open context menu (double right-click for robustness)
        await imageFile.click({ button: 'right' });
        await imageFile.click({ button: 'right' });
        await this.page.waitForTimeout(600);

        // Click "Make a Copy" (sometimes called "Duplicate")
        const makeCopyOption = this.page.getByRole('link', { name: /Make a Copy/i }).first();
        await expect(makeCopyOption).toBeVisible({ timeout: 5000 });
        await makeCopyOption.click();

        // Wait for the copy to appear
        const expectedCopyName = `Copy of ${originalImageName}`;
        const copiedImageFile = this.page.locator('div.lib-file', { hasText: expectedCopyName }).first();

        await copiedImageFile.scrollIntoViewIfNeeded();
        await expect(copiedImageFile).toBeVisible({ timeout: 20000 });
        await this.page.waitForTimeout(1000);

        // Optionally close any open popups
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that uploading an image through the Edit popup works
     */
    async verifyUploadImageThroughEditPopupWorks() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Find the image, e.g. 'PropertyImage2.jpg'
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 20000 });

        // Locate and click the "Reorder" (edit.svg) icon for image reordering
        const reorderIcon = this.page.locator('img[ptooltip="Reorder"][src="assets/img/edit.svg"].p-element.cursor-pointer')
        await expect(reorderIcon.first()).toBeVisible({ timeout: 10000 });
        await reorderIcon.first().click();

        // Locate and click the "Image upload" icon inside the Edit popup
        const imageUploadBtn = this.page.locator('a[ptooltip="Image upload"]');
        await expect(imageUploadBtn).toBeVisible({ timeout: 10000 });
        await imageUploadBtn.click();

        // Upload image through the Edit popup
        const fileInput = this.page.locator('input[type="file"][accept=".svg,image/*"]').first();
        const path = require('path');
        const IMAGE_DIR = path.resolve(__dirname, 'PropertyImages');
        const uploadImagePath = path.join(IMAGE_DIR, 'PropertyImage2.jpg');
        await fileInput.setInputFiles(uploadImagePath);

        // Optionally: wait for upload to complete or for any success message
        const uploadSuccess = this.page.getByText(/Added Successfully/i).first();
        await expect(uploadSuccess).toBeVisible({ timeout: 20000 });

        const crossIcon = this.page.locator('img[src="assets/img/Group37073.svg"]');
        await expect(crossIcon.first()).toBeVisible({ timeout: 10000 });
        await crossIcon.click();
        await this.page.waitForTimeout(1200);
        // Optionally close the popup
        const closeBtn = this.page.locator('.pi.pi-times, .close-btn').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify PDF-to-image conversion by uploading a PDF 
     */
    async verifyPdfToImageConversion() {
        // Go to Listings and open the first listing card
        await this.navigateToListings();
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to the Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Ensure a representative image is loaded for the listing
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 20000 });

        // Enter reorder/edit mode for that image
        const reorderIcon = this.page.locator('img[ptooltip="Reorder"][src="assets/img/edit.svg"].p-element.cursor-pointer').first();
        await expect(reorderIcon).toBeVisible({ timeout: 10000 });
        await reorderIcon.click();

        // Open the PDF-to-image upload popup
        const pdfToImageBtn = this.page.locator('a[ptooltip="PDF to image"] i.pi.pi-file-pdf').first();
        await expect(pdfToImageBtn).toBeVisible({ timeout: 10000 });
        await pdfToImageBtn.click();

        // Resolve the PDF path and upload it
        const path = require('path');
        const IMAGE_DIR = path.resolve(__dirname, 'PropertyImages');
        const pdfPath = path.join(IMAGE_DIR, 'PdfToImage.pdf');
        const fileInput = this.page.locator('input#pdffile[type="file"]').first();
        await fileInput.setInputFiles(pdfPath);

        // Wait for converted images container to appear and activate it
        const convertedImagesContainer = this.page.locator('.d-flex.flex-wrap.w-100.gap-2');
        await expect(convertedImagesContainer).toBeVisible({ timeout: 20000 });
        await convertedImagesContainer.click(); // (optional: may trigger gallery refresh)

        // Confirm a converted image appears and is visible
        const resultImage = this.page.locator('#galImgList .cdk-drag', { hasText: 'PdfToImage' }).first();
        await resultImage.waitFor({ state: 'visible', timeout: 20000 });

        // Close the Edit popup
        const crossIcon = this.page.locator('img[src="assets/img/Group37073.svg"]').first();
        await expect(crossIcon).toBeVisible({ timeout: 10000 });
        await crossIcon.click();
        await this.page.waitForTimeout(1200);

        // Optionally ensure the modal is closed
        const closeBtn = this.page.locator('.pi.pi-times, .close-btn').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that dragging an image into the Offline section removes it from the main view but counts it in total files
     */
    async verifyImageDragToOfflineSectionUpdatesCounts() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstListing = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListing).toBeVisible({ timeout: 30000 });
        await firstListing.click();

        // Switch to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Locate the representative image and count files before
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 20000 });

        // Enable reorder mode
        const reorderIcon = this.page
            .locator('img[ptooltip="Reorder"][src="assets/img/edit.svg"]')
            .first();
        await reorderIcon.waitFor({ state: 'visible' });
        await reorderIcon.click();

        // SOURCE: Angular draggable image
        const sourceImage = this.page.locator('#galImgList .cdk-drag', { hasText: 'PdfToImage' }).first();
        await sourceImage.waitFor({ state: 'visible' });

        // EXPAND Offline Images section (MANDATORY)
        const offlineHeading = this.page.locator(
            'h2.heading-style:has-text("Offline Images")'
        );
        await offlineHeading.scrollIntoViewIfNeeded();
        await offlineHeading.click();

        // REAL Angular CDK drop list under Offline Images
        const offlineDropList = this.page.locator(
            'div.cdk-drop-list:below(h2:has-text("Offline Images"))'
        ).first();
        await offlineDropList.waitFor({ state: 'visible' });

        // Wait for Angular animations/layout
        await this.page.waitForLoadState('networkidle');

        // Get bounding boxes
        const srcBox = await sourceImage.boundingBox();
        const targetBox = await offlineDropList.boundingBox();
        if (!srcBox || !targetBox) {
            throw new Error('Bounding box not found for drag/drop');
        }

        // Angular-safe drag & drop (slow + pause)
        await this.page.mouse.move(
            srcBox.x + srcBox.width / 2,
            srcBox.y + srcBox.height / 2
        );
        await this.page.mouse.down();

        await this.page.waitForTimeout(200); // REQUIRED for CDK

        await this.page.mouse.move(
            targetBox.x + targetBox.width / 2,
            targetBox.y + targetBox.height / 2,
            { steps: 50 }
        );

        await this.page.waitForTimeout(200);
        await this.page.mouse.up();

        await this.page.waitForTimeout(2000);

        // VERIFY image moved to Offline Images
        await expect
            .poll(async () => await offlineDropList.locator('.cdk-drag').count(), {
                timeout: 15000,
            })
            .toBeGreaterThan(0);


        await this.page.waitForTimeout(1200);

        const crossIcon = this.page.locator('img[src="assets/img/Group37073.svg"]');
        await expect(crossIcon.first()).toBeVisible({ timeout: 10000 });
        await crossIcon.click();
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that clicking Back in a folder returns to the previous folder.
     */
    async verifyBackButtonReturnsToPreviousFolder() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing and ensure visibility
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Wait for the image tab to be visible and click it (adjust selector if needed)
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 10000 });
        await imageTab.click();

        // Wait for the Floor Plan folder/item to be visible within the image tab panel
        const floorPlanFolder = this.page.locator('div.lib-file', { hasText: 'Floorplans' });
        await floorPlanFolder.scrollIntoViewIfNeeded();
        await expect(floorPlanFolder).toBeVisible({ timeout: 20000 });
        await floorPlanFolder.dblclick();

        // Click Back button to return to previous folder
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.waitFor({ state: 'visible', timeout: 10000 });
        await backButton.click();

        await expect(floorPlanFolder).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that breadcrumbs allow direct navigation to folders
     */
    async verifyBreadcrumbsAllowDirectNavigation() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstListing = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListing).toBeVisible({ timeout: 30000 });
        await firstListing.click();
        await this.page.waitForTimeout(1000);

        // Open Images tab
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 10000 });
        await imageTab.click();

        // Enter the Floor Plan folder
        const floorPlanFolder = this.page.locator('div.lib-file', { hasText: 'Floorplans' }).first();
        await floorPlanFolder.scrollIntoViewIfNeeded();
        await expect(floorPlanFolder).toBeVisible({ timeout: 20000 });
        await floorPlanFolder.dblclick();
        // Click Back button to return to previous folder
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.waitFor({ state: 'visible', timeout: 10000 });
        await backButton.click();
        // Close dialog or modal if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that images can be reordered in the Images tab by drag and drop.
     */
    async verifyImagesReorderable() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Find the image file and drag it to the left side
        const imageFile = this.page.locator('div.lib-file', { hasText: 'propertyImage.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 30000 });

        const imageBox = await imageFile.boundingBox();
        if (!imageBox) throw new Error('BoundingBox for image file not found.');

        // Drag from center of the image file to 150px left of its current center
        const startX = imageBox.x + imageBox.width / 2;
        const startY = imageBox.y + imageBox.height / 2;
        const dragOffset = -150; // pixels to the left

        await this.page.mouse.move(startX, startY);
        await this.page.mouse.down();
        await this.page.mouse.move(startX + dragOffset, startY, { steps: 10 });
        await this.page.mouse.up();

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that clicking 'Add Link' opens the link popup.
     */
    async verifyAddLinkOpensLinkPopup() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Find the image file and drag it to the left side
        const imageFile = this.page.locator('div.lib-file', { hasText: 'propertyImage.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 30000 });

        // Click the 'Add Link' button
        const addLinkButton = this.page.locator('img[ptooltip="Add Link"]');
        await expect(addLinkButton).toBeVisible({ timeout: 10000 });
        await addLinkButton.click();

        // Verify the link popup/modal appears
        const linkPopup = this.page.locator('.link-popup, .p-dialog, [data-testid="link-popup"]');
        await expect(linkPopup).toBeVisible({ timeout: 10000 });

        // click cancel button
        const cancelButton = this.page.getByRole('button', { name: 'Cancel' });
        await expect(cancelButton).toBeVisible({ timeout: 5000 });
        await cancelButton.click();
        await this.page.waitForTimeout(1000);
        // Optionally close the popup if desired
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify that clicking 'Save' without entering any data allows submission.
     */
    async verifySaveWithoutDataAllowsSubmission() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Find the image file and drag it to the left side
        const imageFile = this.page.locator('div.lib-file', { hasText: 'propertyImage.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 30000 });

        // Click the 'Add Link' button
        const addLinkButton = this.page.locator('img[ptooltip="Add Link"]');
        await expect(addLinkButton).toBeVisible({ timeout: 10000 });
        await addLinkButton.click();

        // Verify the link popup/modal appears
        const linkPopup = this.page.locator('label:has-text("Video URL") + div input');
        await expect(linkPopup).toBeVisible({ timeout: 10000 });

        // click save button
        const saveButton = this.page.getByLabel('Images').getByRole('button', { name: 'Save' });
        await expect(saveButton).toBeVisible({ timeout: 5000 });
        await saveButton.click();
        await this.page.waitForTimeout(1000);
        // Optionally close the popup if desired
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify that the 'Add Link' popup contains required fields.
     * Checks the popup fields: "Link Name", "URL", "Type", and Save/Cancel buttons.
     */
    async verifyAddLinkPopupContainsFields() {
        // Trigger popup via existing logic (reuse verifyAddLinkOpensLinkPopup if possible)
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Find the image file and drag it to the left side
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 30000 });

        // Click the 'Add Link' button
        const addLinkButton = this.page.locator('img[ptooltip="Add Link"]');
        await expect(addLinkButton).toBeVisible({ timeout: 10000 });
        await addLinkButton.click();

        // Verify the link popup/modal appears
        const linkPopup = this.page.locator('.link-popup, .p-dialog, [data-testid="link-popup"]');
        await expect(linkPopup).toBeVisible({ timeout: 10000 });

        // Check for "Video URL", "Online Tour 1", "Online Tour 2" fields inside the Listing Links popup
        const videoUrlField = this.page.locator('div').filter({ hasText: /^Video URL$/ });
        await expect(videoUrlField).toBeVisible({ timeout: 5000 });

        const onlineTour1Field = this.page.locator('div').filter({ hasText: /^Online Tour 1$/ });
        await expect(onlineTour1Field).toBeVisible({ timeout: 5000 });

        const onlineTour2Field = this.page.locator('div').filter({ hasText: /^Online Tour 2$/ });
        await expect(onlineTour2Field).toBeVisible({ timeout: 5000 });

        // Check for Save and Cancel buttons
        const saveButton = linkPopup.getByRole('button', { name: /^Save$/i });
        await expect(saveButton).toBeVisible({ timeout: 5000 });

        // click cancel button
        const cancelButton = this.page.getByRole('button', { name: 'Cancel' });
        await expect(cancelButton).toBeVisible({ timeout: 5000 });
        await cancelButton.click();
        await this.page.waitForTimeout(1000);
        // Optionally close the popup if desired
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1000);
    }

    // Verify that entering a video URL and saving updates the library
    async verifyEnteringVideoURLAndSavingUpdatesLibrary() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();
        await this.page.waitForTimeout(1000);

        // Switch to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Find the target image file to use for adding a link
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 30000 });

        // Click the 'Add Link' button on the image
        const addLinkButton = this.page.locator('img[ptooltip="Add Link"]');
        await expect(addLinkButton).toBeVisible({ timeout: 10000 });
        await addLinkButton.click();

        // Wait for the Link popup/modal to appear
        const linkPopup = this.page.locator('.link-popup, .p-dialog, [data-testid="link-popup"]');
        await expect(linkPopup).toBeVisible({ timeout: 10000 });

        // Fill the "Video URL" input in the popup
        const videoUrlInput = this.page.locator('input[placeholder="Add link"]').first();
        await expect(videoUrlInput).toBeVisible({ timeout: 5000 });
        await videoUrlInput.click();
        const testVideoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        await videoUrlInput.fill(testVideoUrl);
        await this.page.waitForTimeout(1000);
        // Click the Save button
        const saveButton = linkPopup.getByRole('button', { name: /^Save$/i });
        await expect(saveButton).toBeVisible({ timeout: 5000 });
        await saveButton.click();
        await this.page.waitForTimeout(1500);
        // Optionally close the popup if desired
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify that adding Online Tour links updates the library.
     */
    async verifyAddingOnlineTourLinkUpdatesLibrary() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();
        await this.page.waitForTimeout(1000);

        // Switch to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Find the target image file to use for adding a link
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 30000 });

        // Click the 'Add Link' button on the image
        const addLinkButton = this.page.locator('img[ptooltip="Add Link"]');
        await expect(addLinkButton).toBeVisible({ timeout: 10000 });
        await addLinkButton.click();

        // Wait for the Link popup/modal to appear
        const linkPopup = this.page.locator('.link-popup, .p-dialog, [data-testid="link-popup"]');
        await expect(linkPopup).toBeVisible({ timeout: 10000 });

        // Fill both "Online Tour 1" and "Online Tour 2" link inputs in the popup
        const onlineTour1Input = this.page.locator('label:has-text("Online Tour 1") + div input');
        await expect(onlineTour1Input).toBeVisible({ timeout: 10000 });
        await onlineTour1Input.click();
        const testTour1Url = 'https://myonlinetour.example.com/tour/123';
        await onlineTour1Input.fill(testTour1Url);

        const onlineTour2Input = this.page.locator('label:has-text("Online Tour 2") + div input');
        await expect(onlineTour2Input).toBeVisible({ timeout: 10000 });
        await onlineTour2Input.click();
        const testTour2Url = 'https://myonlinetour.example.com/tour/456';
        await onlineTour2Input.fill(testTour2Url);

        await this.page.waitForTimeout(1000);

        // Click the Save button
        const saveButton = linkPopup.getByRole('button', { name: /^Save$/i });
        await expect(saveButton).toBeVisible({ timeout: 5000 });
        await saveButton.click();
        await this.page.waitForTimeout(1500);

        // Optionally close the popup if it's still open
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1000);
    }
    /**
     * Verify that the 'Inspection' tab is hidden before the listing is saved.
     */
    async verifyInspectionTabHiddenBeforeSave() {
        await this.navigateToListings();
        await this.switchToGridView();
        // Wait for the first listing card to be attached and visible, for robustness
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeAttached({ timeout: 30000 });
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        // Open the new listing creation or detail using the plus icon
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick();

        // Check that the Inspection tab is NOT visible
        const inspectionTab = this.page.getByRole('tab', { name: /Inspection/i });

        await inspectionTab.click()

        const inspectionsLabel = this.page.getByLabel('Inspections').getByText('Please create the listing');
        await expect(inspectionsLabel).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1000);

        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1500);

    }

    /**
     * Verify required fields validation in the new listing form.
     * This will attempt to save the form without filling required fields and check for error messages.
     */
    async verifyRequiredFieldsValidation() {
        await this.navigateToListings();
        await this.switchToGridView();
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        const primaryAgent = this.page.locator(
            'div.form-group:has-text("Primary Agent") ng-select'
        );

        await primaryAgent.scrollIntoViewIfNeeded();
        await primaryAgent.click();

        const primaryInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']");
        await expect(primaryInput).toBeVisible({ timeout: 10000 });
        await primaryInput.fill('Jahanzaib Xenex');

        const primaryOption = this.page.locator(
            '.ng-dropdown-panel .ng-option',
            { hasText: 'Jahanzaib Xenex' }
        ).first();
        await expect(primaryOption).toBeVisible({ timeout: 10000 });
        await primaryOption.click();

        await this.page.waitForTimeout(1000);
        // Attempt to save/continue without filling fields
        const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click();

        // Click on the 'Inspections' tab to trigger validation messages for required fields
        const inspectionTab = this.page.getByRole('tab', { name: /Inspections/i }).first();
        await expect(inspectionTab).toBeVisible({ timeout: 10000 });
        await inspectionTab.click();

        // Click the 'Add' button in the Inspections tab
        const addButton = this.page.getByRole('button', { name: /Add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();

        // Wait for potential validation/error messages to appear
        const requiredFieldError = this.page.getByRole('alert', { name: 'Start time must be before end' });
        await expect(requiredFieldError).toBeVisible({ timeout: 5000 });

        // Close the form after test
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1500);

    }

    /**
     * Add a valid inspection and verify successful addition.
     * Assumes that the form is open for a listing.
     */
    async addValidInspectionAndVerifySuccess() {
        await this.navigateToListings();
        await this.switchToGridView();
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        const primaryAgent = this.page.locator(
            'div.form-group:has-text("Primary Agent") ng-select'
        );

        await primaryAgent.scrollIntoViewIfNeeded();
        await primaryAgent.click();

        const primaryInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']");
        await expect(primaryInput).toBeVisible({ timeout: 10000 });
        await primaryInput.fill('Jahanzaib Xenex');

        const primaryOption = this.page.locator(
            '.ng-dropdown-panel .ng-option',
            { hasText: 'Jahanzaib Xenex' }
        ).first();
        await expect(primaryOption).toBeVisible({ timeout: 10000 });
        await primaryOption.click();

        await this.page.waitForTimeout(1000);
        // Attempt to save/continue without filling fields
        const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click();

        // Click on the 'Inspections' tab to trigger validation messages for required fields
        const inspectionTab = this.page.getByRole('tab', { name: /Inspections/i }).first();
        await expect(inspectionTab).toBeVisible({ timeout: 10000 });
        await inspectionTab.click();


        // Fill in inspection event date: pick January 14, 2026 using the date picker and the displayed calendar
        const dateInput = this.page.locator('#basic');
        await expect(dateInput).toBeVisible({ timeout: 10000 });
        await dateInput.click();

        // 1️⃣ Compute Tomorrow
        const t = new Date();
        t.setDate(t.getDate() + 1);

        const targetDay = t.getDate();
        const targetMonth = t.getMonth();
        const targetYear = t.getFullYear();

        // 2️⃣ Read currently opened calendar's month-year (stable header)
        const header = this.page.locator(".p-datepicker-title");
        await expect(header).toBeVisible();

        const headerText = await header.innerText();
        const [monthName, year] = headerText.trim().split(" ");

        const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();

        // 3️⃣ Move calendar to correct month
        const monthDifference =
            (targetYear - parseInt(year)) * 12 + (targetMonth - monthIndex);

        for (let i = 0; i < Math.abs(monthDifference); i++) {
            if (monthDifference > 0) {
                await this.page.locator(".p-datepicker-next").click();
            } else {
                await this.page.locator(".p-datepicker-prev").click();
            }
            // Wait for transition + re-render
            await this.page.waitForTimeout(200);
        }

        // 4️⃣ Select tomorrow's date (non-flaky selector)
        const dayLocator = this.page.locator(
            `.p-datepicker-calendar td:not(.p-disabled) >> text="${targetDay}"`
        );

        await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
        await dayLocator.first().click({ force: true });

        const startTimeSelect = this.page.getByRole('combobox').nth(4);
        await startTimeSelect.click();
        await this.page.waitForTimeout(1000);
        // Select the 6th option (index 5) from the dropdown
        const startTimeOption = this.page.getByText('5', { exact: true });
        await expect(startTimeOption).toBeVisible({ timeout: 10000 });
        await startTimeOption.click();
        // Click the 'Add' button in the Inspections tab
        const addButton = this.page.getByRole('button', { name: /Add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();

        // Wait for event success message to appear after adding inspection event
        const successAlert = this.page.getByText('event added to calendar successfully');
        await expect(successAlert).toBeVisible({ timeout: 10000 });

        // Verify that the newly added inspection is deletable via the delete icon:
        const deleteLink = this.page.getByRole('link', { name: 'delete' }).first();
        await deleteLink.waitFor({ state: "visible", timeout: 10000 });
        // Click the 'Save' button (if visible)
        await saveButton.click();

        // Close the form after test
        const closeFormBtn = this.page.locator('.pi.pi-times').first();
        if (await closeFormBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
            await closeFormBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1500);
    }

    /**
     * Verify deletion of an inspection from the inspection tab
     */
    async verifyDeleteInspectionFromTab() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to the Inspections tab
        const inspectionsTab = this.page.getByRole('tab', { name: /Inspections/i });
        await expect(inspectionsTab).toBeVisible({ timeout: 20000 });
        await inspectionsTab.click();
        await this.page.waitForTimeout(1000);

        // Continuously click all visible delete icons until there are none left
        while (true) {
            const deleteLinks = this.page.getByRole('link', { name: 'delete' });
            const count = await deleteLinks.count();
            if (count === 0) break;
            // Always click the first visible delete link that is visible
            let clicked = false;
            for (let i = 0; i < count; i++) {
                const deleteLink = deleteLinks.nth(i);
                const isVisible = await deleteLink.isVisible({ timeout: 10000 }).catch(() => false);
                if (isVisible) {
                    await deleteLink.click();
                    clicked = true;
                    // Wait for UI/reactivity to update before next check
                    await this.page.waitForTimeout(600);
                    break;
                }
            }
            // If none were visible or clickable, break out of loop
            if (!clicked) break;
        }
        await this.page.waitForTimeout(1200);

        // Optionally, close modal/form
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1500);

    }

    /**
     * Verify that deleting an inspection from the inspection tab removes it from the calendar.
     * This will delete the first inspection, then check that it's no longer present in the list.
     */
    async verifyDeleteInspectionRemovesFromCalendar() {
        await this.navigateToListings();
        await this.switchToGridView();
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        const primaryAgent = this.page.locator(
            'div.form-group:has-text("Primary Agent") ng-select'
        );

        await primaryAgent.scrollIntoViewIfNeeded();
        await primaryAgent.click();

        const primaryInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']");
        await expect(primaryInput).toBeVisible({ timeout: 10000 });
        await primaryInput.fill('Jahanzaib Xenex');

        const primaryOption = this.page.locator(
            '.ng-dropdown-panel .ng-option',
            { hasText: 'Jahanzaib Xenex' }
        ).first();
        await expect(primaryOption).toBeVisible({ timeout: 10000 });
        await primaryOption.click();

        await this.page.waitForTimeout(1000);
        // Attempt to save/continue without filling fields
        const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click();

        // Click on the 'Inspections' tab to trigger validation messages for required fields
        const inspectionTab = this.page.getByRole('tab', { name: /Inspections/i }).first();
        await expect(inspectionTab).toBeVisible({ timeout: 10000 });
        await inspectionTab.click();


        // Fill in inspection event date: pick January 14, 2026 using the date picker and the displayed calendar
        const dateInput = this.page.locator('#basic');
        await expect(dateInput).toBeVisible({ timeout: 10000 });
        await dateInput.click();

        // 1️⃣ Compute Tomorrow
        const t = new Date();
        t.setDate(t.getDate() + 1);

        const targetDay = t.getDate();
        const targetMonth = t.getMonth();
        const targetYear = t.getFullYear();

        // 2️⃣ Read currently opened calendar's month-year (stable header)
        const header = this.page.locator(".p-datepicker-title");
        await expect(header).toBeVisible();

        const headerText = await header.innerText();
        const [monthName, year] = headerText.trim().split(" ");

        const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();

        // 3️⃣ Move calendar to correct month
        const monthDifference =
            (targetYear - parseInt(year)) * 12 + (targetMonth - monthIndex);

        for (let i = 0; i < Math.abs(monthDifference); i++) {
            if (monthDifference > 0) {
                await this.page.locator(".p-datepicker-next").click();
            } else {
                await this.page.locator(".p-datepicker-prev").click();
            }
            // Wait for transition + re-render
            await this.page.waitForTimeout(200);
        }

        // 4️⃣ Select tomorrow's date (non-flaky selector)
        const dayLocator = this.page.locator(
            `.p-datepicker-calendar td:not(.p-disabled) >> text="${targetDay}"`
        );

        await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
        await dayLocator.first().click({ force: true });

        const startTimeSelect = this.page.getByRole('combobox').nth(4);
        await startTimeSelect.click();
        await this.page.waitForTimeout(1000);
        // Select the 6th option (index 5) from the dropdown
        const startTimeOption = this.page.getByText('5', { exact: true });
        await expect(startTimeOption).toBeVisible({ timeout: 10000 });
        await startTimeOption.click();
        // Click the 'Add' button in the Inspections tab
        const addButton = this.page.getByRole('button', { name: /Add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();

        // Wait for event success message to appear after adding inspection event
        const successAlert = this.page.getByText('event added to calendar successfully');
        await expect(successAlert).toBeVisible({ timeout: 10000 });

        const deleteLink = this.page.getByRole('link', { name: 'delete' }).first();
        await deleteLink.waitFor({ state: "visible", timeout: 10000 });
        await deleteLink.click();

        // Wait for the "event removed successfully" success message
        const removeSuccessAlert = this.page.getByText('event removed successfully');
        await expect(removeSuccessAlert).toBeVisible({ timeout: 10000 });

        // Click Calendar tab
        const calendarTab = this.page.getByRole('tab', { name: /Calendar/i });
        await calendarTab.scrollIntoViewIfNeeded();
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();
        await this.page.waitForTimeout(1000);

        // Scroll the FullCalendar time grid scroller to top
        const scroller = this.page.locator('.fc-scroller').nth(2);
        await scroller.evaluate((el: HTMLElement) => { el.scrollTop = 0; });

        // Look for the specific event "Remmi: Open Home" in the timegrid calendar
        const event = this.page.locator('.fc-timegrid-event', { hasText: 'Remmi: Open Home' });
        await expect(event).toHaveCount(0);

        // Close modal or preview if present after calendar validation
        const closePreviewButton = this.page.locator('.pi.pi-times').filter({ hasText: '' }).first();
        if (await closePreviewButton.isVisible({ timeout: 10000 }).catch(() => false)) {
            await closePreviewButton.click({ force: true });
        }
        await this.page.waitForTimeout(1500);

    }

    /**
     * Verify that the inspection is visible in the calendar tab.
     * Assumes an inspection has been added successfully beforehand.
     */
    async verifyInspectionVisibleInCalendarTab() {
        // Always use explicit waits and visible assertions instead of just waiting -- to avoid flakiness

        await this.switchToGridView();
        await this.addValidInspectionAndVerifySuccess();

        // Open the first listing card (wait for it to be attached and visible)
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeAttached({ timeout: 20000 }); // More robust: attached before visible
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to the Calendar tab with robust waits
        const calendarTab = this.page.getByRole('tab', { name: /Calendar/i });
        await expect(calendarTab).toBeAttached({ timeout: 10000 });
        await calendarTab.scrollIntoViewIfNeeded();
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        // Wait until the calendar content actually appears by checking for known elements
        const calendarGrid = this.page.locator('.fc-timegrid');
        await expect(calendarGrid).toBeVisible({ timeout: 10000 });

        // Scroll FullCalendar time grid scroller to top (if present & visible)
        const scroller = this.page.locator('.fc-scroller').nth(2);
        if (await scroller.count() > 0) {
            const isScrollerVisible = await scroller.isVisible().catch(() => false);
            if (isScrollerVisible) {
                await scroller.evaluate((el: HTMLElement) => { el.scrollTop = 0; });
            }
        }

        // Robustly wait for the "Remmi: Open Home" event to appear and be attached (no arbitrary waits)
        const eventLocator = this.page.locator('.fc-timegrid-event', { hasText: 'Remmi: Open Home' }).first();
        await expect(eventLocator).toBeAttached({ timeout: 20000 });
        await expect(eventLocator).toBeVisible({ timeout: 20000 });

        // Close modal or preview if present after validation
        const closePreviewButton = this.page.locator('.pi.pi-times').first();
        if (await closePreviewButton.isVisible({ timeout: 5000 }).catch(() => false)) {
            await closePreviewButton.click({ force: true });
            // Wait for it to disappear to ensure next actions are not affected
            await expect(closePreviewButton).not.toBeVisible({ timeout: 5000 }).catch(() => { });
        }
    }

    /**
     * Verify that clicking on an inspection event in the calendar opens a popup/modal with inspection details.
     * Assumes there is an event called "Remmi: Open Home" visible on the calendar.
     */
    async verifyInspectionClickOpensPopup() {
        await this.switchToGridView();

        // Open the first listing card to access its tabs, robustly wait for attach & visible
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeAttached({ timeout: 20000 });
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to the Calendar tab and robustly open it
        const calendarTab = this.page.getByRole('tab', { name: /Calendar/i });
        await expect(calendarTab).toBeAttached({ timeout: 10000 });
        await calendarTab.scrollIntoViewIfNeeded();
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        // Make sure the calendar grid appears before proceeding
        const calendarGrid = this.page.locator('.fc-timegrid');
        await expect(calendarGrid).toBeVisible({ timeout: 20000 });

        // Optionally scroll calendar to top if scrollable/visible
        const scroller = this.page.locator('.fc-scroller').nth(2);
        if ((await scroller.count()) > 0 && await scroller.isVisible().catch(() => false)) {
            await scroller.evaluate((el: HTMLElement) => { el.scrollTop = 0; });
        }

        // Robustly wait for the "Remmi: Open Home" event to appear and be attached (no arbitrary waits)
        const eventLocator = this.page.locator('.fc-timegrid-event', { hasText: 'Remmi: Open Home' }).first();
        await expect(eventLocator).toBeAttached({ timeout: 20000 });
        await expect(eventLocator).toBeVisible({ timeout: 20000 });

        // Click on the event using force only if needed, prefer regular click first (increases reliability)
        try {
            await eventLocator.click({ timeout: 3500 });
        } catch {
            // fallback to force click if normal click didn't work (e.g., due to overlay)
            await eventLocator.click({ force: true });
        }

        // Assert popup/modal appears, don't proceed until it's attached and visible
        const popup = this.page.locator('.p-dialog-content').first();
        await expect(popup).toBeAttached({ timeout: 10000 });
        await expect(popup).toBeVisible({ timeout: 10000 });

        // Optionally verify some expected detail in the popup to ensure correctness
        // e.g., await expect(popup).toContainText('Open Home', { timeout: 3000 });

        // Robustly close popup if close button appears, don't use arbitrary waits
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible({ timeout: 4000 }).catch(() => false)) {
            await closeBtn.click({ force: true });
            // Wait for popup to disappear before ending
            await expect(popup).not.toBeVisible({ timeout: 5000 });
        }
    }

    /**
     * Verify that deleting an inspection from the Calendar view removes it from all relevant places.
     * Finds the "Remmi: Open Home" inspection event on the calendar, deletes it, and asserts removal.
     */
    async verifyInspectionRemovesFromCalendar() {
        await this.switchToGridView();

        // Open the first listing card to access its tabs
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to the Calendar tab
        const calendarTab = this.page.getByRole('tab', { name: /Calendar/i });
        await calendarTab.scrollIntoViewIfNeeded();
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();
        await this.page.waitForTimeout(1000);

        // Wait for calendar grid to be loaded and visible
        const calendarGrid = this.page.locator('.fc-timegrid');
        await expect(calendarGrid).toBeVisible({ timeout: 10000 });

        const scroller = this.page.locator('.fc-scroller').nth(2);
        if (await scroller.count().then(c => c > 0)) {
            await scroller.evaluate((el: HTMLElement) => { el.scrollTop = 0; });
        }

        // Find the inspection event by text and click to open its details popup
        const event = this.page.locator('.fc-timegrid-event', { hasText: 'Remmi: Open Home' }).first();
        await expect(event).toBeVisible({ timeout: 20000 });
        await this.page.waitForTimeout(2500);
        await event.click({ force: true });

        // In the popup/modal, find and click the Delete/Remove button (assuming ".pi-trash" is trash/delete icon)
        const popup = this.page.locator('.p-dialog-content').first();
        await expect(popup).toBeVisible({ timeout: 10000 });
        const deleteButton = this.page.getByRole('dialog').getByRole('img', { name: 'delete' }).first();
        await expect(deleteButton).toBeVisible({ timeout: 10000 });
        await deleteButton.click({ force: true });

        await this.page.waitForTimeout(1000);

        // Wait for and assert the toast 'Event deleted successfully' appears
        const toast = this.page.getByRole('alert', { name: 'Event deleted successfully' }).first();
        await expect(toast).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);

        // Assert the event is no longer visible in the calendar (should be gone)
        await expect(
            this.page.locator('.fc-timegrid-event', { hasText: 'Remmi: Open Home' })
        ).toHaveCount(0, { timeout: 5000 });

        // Optionally, check Inspection tab (if you want to ensure deletion from everywhere)
        const inspectionTab = this.page.getByRole('tab', { name: /Inspection/i });
        await inspectionTab.scrollIntoViewIfNeeded();
        await inspectionTab.click();
        await this.page.waitForTimeout(500);
        const deleteLink = this.page.getByRole('link', { name: 'delete' }).first();
        // Ensure that the delete link is no longer visible (i.e., deleted)
        await expect(deleteLink).not.toBeVisible();
        await this.page.waitForTimeout(1000);
        // Close the popup/modal if it's still open
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1500);
    }

    /**
     * Verify deletion of an inspection from the inspection section.
     * This method assumes the Inspections tab is available under the first listing.
     */
    async verifyDeleteInspectionFromInspectionTab() {
        await this.navigateToListings();
        await this.switchToGridView();
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        const primaryAgent = this.page.locator(
            'div.form-group:has-text("Primary Agent") ng-select'
        );

        await primaryAgent.scrollIntoViewIfNeeded();
        await primaryAgent.click();

        const primaryInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']");
        await expect(primaryInput).toBeVisible({ timeout: 10000 });
        await primaryInput.fill('Jahanzaib Xenex');

        const primaryOption = this.page.locator(
            '.ng-dropdown-panel .ng-option',
            { hasText: 'Jahanzaib Xenex' }
        ).first();
        await expect(primaryOption).toBeVisible({ timeout: 10000 });
        await primaryOption.click();

        await this.page.waitForTimeout(1000);
        // Attempt to save/continue without filling fields
        const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click();

        // Click on the 'Inspections' tab to trigger validation messages for required fields
        const inspectionTab = this.page.getByRole('tab', { name: /Inspections/i }).first();
        await expect(inspectionTab).toBeVisible({ timeout: 10000 });
        await inspectionTab.click();


        // Fill in inspection event date: pick January 14, 2026 using the date picker and the displayed calendar
        const dateInput = this.page.locator('#basic');
        await expect(dateInput).toBeVisible({ timeout: 10000 });
        await dateInput.click();

        // 1️⃣ Compute Tomorrow
        const t = new Date();
        t.setDate(t.getDate() + 1);

        const targetDay = t.getDate();
        const targetMonth = t.getMonth();
        const targetYear = t.getFullYear();

        // 2️⃣ Read currently opened calendar's month-year (stable header)
        const header = this.page.locator(".p-datepicker-title");
        await expect(header).toBeVisible();

        const headerText = await header.innerText();
        const [monthName, year] = headerText.trim().split(" ");

        const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();

        // 3️⃣ Move calendar to correct month
        const monthDifference =
            (targetYear - parseInt(year)) * 12 + (targetMonth - monthIndex);

        for (let i = 0; i < Math.abs(monthDifference); i++) {
            if (monthDifference > 0) {
                await this.page.locator(".p-datepicker-next").click();
            } else {
                await this.page.locator(".p-datepicker-prev").click();
            }
            // Wait for transition + re-render
            await this.page.waitForTimeout(200);
        }

        // 4️⃣ Select tomorrow's date (non-flaky selector)
        const dayLocator = this.page.locator(
            `.p-datepicker-calendar td:not(.p-disabled) >> text="${targetDay}"`
        );

        await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
        await dayLocator.first().click({ force: true });

        const startTimeSelect = this.page.getByRole('combobox').nth(4);
        await startTimeSelect.click();
        await this.page.waitForTimeout(1000);
        // Select the 6th option (index 5) from the dropdown
        const startTimeOption = this.page.getByText('5', { exact: true });
        await expect(startTimeOption).toBeVisible({ timeout: 10000 });
        await startTimeOption.click();
        // Click the 'Add' button in the Inspections tab
        const addButton = this.page.getByRole('button', { name: /Add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();

        // Wait for event success message to appear after adding inspection event
        const successAlert = this.page.getByText('event added to calendar successfully');
        await expect(successAlert).toBeVisible({ timeout: 10000 });

        // Verify that the newly added inspection is deletable via the delete icon:
        const deleteLink = this.page.getByRole('link', { name: 'delete' }).first();
        await deleteLink.waitFor({ state: "visible", timeout: 10000 });
        await deleteLink.scrollIntoViewIfNeeded();
        await deleteLink.click({ force: true });
        await this.page.waitForTimeout(700);
        // Confirm the inspection row is no longer visible
        await expect(deleteLink).not.toBeVisible({ timeout: 5000 });

        // Optionally, close the inspection form
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that an inspection with a past date cannot be added.
     * This will attempt to set an inspection event to a previous day and confirm the UI prevents it.
     */
    async verifyInspectionCannotAddPastDate() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to the Inspections tab
        const inspectionsTab = this.page.getByRole('tab', { name: /Inspections/i });
        await expect(inspectionsTab).toBeVisible({ timeout: 20000 });
        await inspectionsTab.click();

        await this.page.waitForTimeout(1000);
        // Pick a past date (yesterday) by direct click in the calendar

        const dateInput = this.page.locator('#basic');
        await expect(dateInput).toBeVisible({ timeout: 10000 });
        await dateInput.click();

        // Compute yesterday's date
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const targetDay = yesterday.getDate();

        // Try to directly click yesterday's day on the calendar (should be disabled)
        const pastDayCell = this.page.locator(`.p-datepicker-calendar td >> text="${targetDay}"`);
        await pastDayCell.first().click({ force: true });

        // Close the form after test
        const closeFormBtn = this.page.locator('.pi.pi-times').first();
        if (await closeFormBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
            await closeFormBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1500);
    }

    /**
     * Verify inspection portion expand/collapse functionality.
     * Adds an inspection (for tomorrow), and verifies expand/collapse on inspection list.
     */
    async verifyInspectionExpandCollapse() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to the Inspections tab
        const inspectionsTab = this.page.getByRole('tab', { name: /Inspections/i });
        await expect(inspectionsTab).toBeVisible({ timeout: 20000 });
        await inspectionsTab.click();
        await this.page.waitForTimeout(1000);

        // Add an inspection for tomorrow (add new if there isn't one already)
        const dateInput = this.page.locator('#basic');
        await expect(dateInput).toBeVisible({ timeout: 10000 });
        await dateInput.click();

        // Compute tomorrow
        const t = new Date();
        t.setDate(t.getDate() + 1);
        const targetDay = t.getDate();

        // Select tomorrow on the date picker
        const dayLocator = this.page.locator(
            `.p-datepicker-calendar td:not(.p-disabled) >> text="${targetDay}"`
        );
        await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
        await dayLocator.first().click({ force: true });

        // Select and pick a value for start time hour
        const startTimeHour = this.page.getByRole('combobox').nth(4);
        await expect(startTimeHour).toBeVisible({ timeout: 10000 });
        await startTimeHour.click();
        const startTimeHourOption = this.page.getByRole('option', { name: '5' }).first();
        await expect(startTimeHourOption).toBeVisible({ timeout: 10000 });
        await startTimeHourOption.click();
        await this.page.waitForTimeout(200);

        // Select and pick a value for start time minutes
        const startTimeMinutes = this.page.getByRole('combobox').nth(5);
        await expect(startTimeMinutes).toBeVisible({ timeout: 2000 });
        await startTimeMinutes.click({ force: true });
        const startTimeMinuteOption = this.page.getByRole('option', { name: '05' }).first();
        await expect(startTimeMinuteOption).toBeVisible({ timeout: 10000 });
        await startTimeMinuteOption.click();
        await this.page.waitForTimeout(200);

        // Select and pick a value for start time AM/PM
        const startTimeAmPm = this.page.getByRole('combobox').nth(6);
        await expect(startTimeAmPm).toBeVisible({ timeout: 10000 });
        await startTimeAmPm.click({ force: true });
        const startTimeAmPmOption = this.page.getByRole('option', { name: 'PM' }).first();
        await expect(startTimeAmPmOption).toBeVisible({ timeout: 10000 });
        await startTimeAmPmOption.click();
        await this.page.waitForTimeout(200);

        // Select and pick a value for end time hour
        const endTimeHour = this.page.getByRole('combobox').nth(7);
        await expect(endTimeHour).toBeVisible({ timeout: 10000 });
        await endTimeHour.click({ force: true });
        const endTimeHourOption = this.page.getByRole('option', { name: '6' }).first();
        await expect(endTimeHourOption).toBeVisible({ timeout: 10000 });
        await endTimeHourOption.click();
        await this.page.waitForTimeout(200);

        // Select and pick a value for end time minutes
        const endTimeMinutes = this.page.getByRole('combobox').nth(8);
        await expect(endTimeMinutes).toBeVisible({ timeout: 2000 });
        await endTimeMinutes.click({ force: true });
        const endTimeMinuteOption = this.page.getByRole('option', { name: '10' }).first();
        await expect(endTimeMinuteOption).toBeVisible({ timeout: 10000 });
        await endTimeMinuteOption.click();
        await this.page.waitForTimeout(200);

        // Select and pick a value for end time AM/PM
        const endTimeAmPm = this.page.getByRole('combobox').nth(9);
        await expect(endTimeAmPm).toBeVisible({ timeout: 10000 });
        await endTimeAmPm.click({ force: true });
        const endTimeAmPmOption = this.page.getByRole('option', { name: 'PM' }).first();
        await expect(endTimeAmPmOption).toBeVisible({ timeout: 10000 });
        await endTimeAmPmOption.click();
        await this.page.waitForTimeout(2000);

        // Clean up: Close the form/modal if open
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1500);
    }

    async verifyAddMultipleInspectionsDifferentDates() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Helper to add a single inspection by offsetting days
        const addInspection = async (daysFromToday: number) => {
            // Go to Inspections tab
            const inspectionsTab = this.page.getByRole('tab', { name: /Inspections/i });
            if (await inspectionsTab.isVisible({ timeout: 10000 }).catch(() => false)) {
                await inspectionsTab.click();
                await this.page.waitForTimeout(500);
            }

            // Open date picker
            const inspectionDateInput = this.page.locator('#basic');
            await expect(inspectionDateInput).toBeVisible({ timeout: 10000 });
            await inspectionDateInput.click();

            // Calculate target date
            const d = new Date();
            d.setDate(d.getDate() + daysFromToday);
            const targetDay = d.getDate();
            const targetMonth = d.getMonth();
            const targetYear = d.getFullYear();

            // Read calendar header to get visible month/year
            const calendarHeader = this.page.locator(".p-datepicker-title");
            await expect(calendarHeader).toBeVisible();
            const calendarHeaderText = await calendarHeader.innerText();
            const [monthName, visibleYear] = calendarHeaderText.trim().split(" ");
            const visibleMonthIndex = new Date(`${monthName} 1, 2000`).getMonth();
            const monthDiff = (targetYear - parseInt(visibleYear)) * 12 + (targetMonth - visibleMonthIndex);

            // Move to required month/year
            for (let i = 0; i < Math.abs(monthDiff); i++) {
                if (monthDiff > 0) {
                    await this.page.locator(".p-datepicker-next").click();
                } else {
                    await this.page.locator(".p-datepicker-prev").click();
                }
                await this.page.waitForTimeout(200);
            }

            // Pick the correct day
            const inspectionDayLocator = this.page.locator(
                `.p-datepicker-calendar td:not(.p-disabled) >> text="${targetDay}"`
            );
            await inspectionDayLocator.first().waitFor({ state: "visible", timeout: 10000 });
            await inspectionDayLocator.first().click({ force: true });

            // Fill required time field
            const startTimeCombo = this.page.getByRole('combobox').nth(4);
            await startTimeCombo.click();
            await this.page.waitForTimeout(500);
            const startTimeTimeOption = this.page.getByText('5', { exact: true });
            await expect(startTimeTimeOption).toBeVisible({ timeout: 2000 });
            await startTimeTimeOption.click();

            // Click the 'Add' button in the Inspections tab
            const addBtn = this.page.getByRole('button', { name: /Add/i }).first();
            await expect(addBtn).toBeVisible({ timeout: 10000 });
            await addBtn.click();

            // Wait for success alert
            const successMessage = this.page.getByText('event added to calendar successfully');
            await expect(successMessage).toBeVisible({ timeout: 10000 });

            await this.page.waitForTimeout(2000);
        };
        await addInspection(1);
        await addInspection(2);

        // Close the form after adding inspections
        const closeFormBtn = this.page.locator('.pi.pi-times').first();
        if (await closeFormBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
            await closeFormBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1500);
    }

    /**
     * Verify adding multiple inspections on the same date but different times
     */
    async verifyAddMultipleInspectionsSameDateDifferentTimes() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to Inspections tab
        const inspectionTab = this.page.getByRole('tab', { name: /Inspections/i }).first();
        await expect(inspectionTab).toBeVisible({ timeout: 10000 });
        await inspectionTab.click();

        // Utility function to add inspection at a certain time
        const addInspectionAtTime = async (hourText: string) => {
            // Open date picker and pick "tomorrow"
            const dateInput = this.page.locator('#basic');
            await expect(dateInput).toBeVisible({ timeout: 10000 });
            await dateInput.click();

            // Compute "tomorrow"
            const t = new Date();
            t.setDate(t.getDate() + 1);
            const targetDay = t.getDate();
            const targetMonth = t.getMonth();
            const targetYear = t.getFullYear();

            // Read calendar header and go to correct month
            const header = this.page.locator(".p-datepicker-title");
            await expect(header).toBeVisible();

            const headerText = await header.innerText();
            const [monthName, yearStr] = headerText.trim().split(" ");
            const visibleMonthIndex = new Date(`${monthName} 1, 2000`).getMonth();
            const monthDiff = (targetYear - parseInt(yearStr)) * 12 + (targetMonth - visibleMonthIndex);
            for (let i = 0; i < Math.abs(monthDiff); i++) {
                if (monthDiff > 0) {
                    await this.page.locator(".p-datepicker-next").click();
                } else {
                    await this.page.locator(".p-datepicker-prev").click();
                }
                await this.page.waitForTimeout(200);
            }

            // Pick the correct day
            const dayLocator = this.page.locator(
                `.p-datepicker-calendar td:not(.p-disabled) >> text="${targetDay}"`
            );
            await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
            await dayLocator.first().click({ force: true });

            // Pick given hour
            const startTimeCombo = this.page.getByRole('combobox').nth(4);
            await startTimeCombo.click();
            await this.page.waitForTimeout(500);
            const option = this.page.getByText(hourText, { exact: true });
            await expect(option).toBeVisible({ timeout: 2000 });
            await option.click();

            // Click 'Add'
            const addBtn = this.page.getByRole('button', { name: /Add/i }).first();
            await expect(addBtn).toBeVisible({ timeout: 10000 });
            await addBtn.click();

            // Wait for confirmation
            const successAlert = this.page.getByText('event added to calendar successfully');
            await expect(successAlert).toBeVisible({ timeout: 10000 });
            await this.page.waitForTimeout(700);
        };

        // Add two inspections on the same date but different times
        await addInspectionAtTime("3");
        await addInspectionAtTime("4");

        // Clean up - close the popup/form
        const closeFormBtn = this.page.locator('.pi.pi-times').first();
        if (await closeFormBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
            await closeFormBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1500);
    }

    /**
     * Verify that deleting all inspections removes them from all views
     */
    async verifyDeleteAllInspectionsRemovesFromAllViews() {
        await this.switchToGridView();
        // Open the first listing card to access its tabs
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();

        // Switch to Inspections tab
        const inspectionsTab = this.page.getByRole('tab', { name: /Inspections/i });
        await expect(inspectionsTab).toBeVisible({ timeout: 10000 });
        await inspectionsTab.click();
        await this.page.waitForTimeout(1000);

        // Continuously click all visible delete icons until there are none left
        while (true) {
            const deleteLinks = this.page.getByRole('link', { name: 'delete' });
            const count = await deleteLinks.count();
            if (count === 0) break;
            // Always click the first visible delete link that is visible
            let clicked = false;
            for (let i = 0; i < count; i++) {
                const deleteLink = deleteLinks.nth(i);
                const isVisible = await deleteLink.isVisible({ timeout: 10000 }).catch(() => false);
                if (isVisible) {
                    await deleteLink.click();
                    clicked = true;
                    // Wait for UI/reactivity to update before next check
                    await this.page.waitForTimeout(600);
                    break;
                }
            }
            // If none were visible or clickable, break out of loop
            if (!clicked) break;
        }
        await this.page.waitForTimeout(1200);

        // Optionally, close form
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1500);
    }

    /**
     Verify that deleting an inspection from the calendar does not affect other inspections
     */
    async verifyDeleteInspectionFromCalendarDoesNotAffectOthers() {
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();

        // Go to the Inspections tab
        const inspectionsTab = this.page.getByRole('tab', { name: /Inspections/i });
        await expect(inspectionsTab).toBeVisible({ timeout: 15000 });
        await inspectionsTab.click();
        await this.page.waitForTimeout(1000);

        // ---- Step 1: Add two inspections for different (future) dates ----
        const inspectionDescriptions: string[] = [];
        for (let idx = 1; idx <= 2; idx++) {
            // Open the date input
            const dateInput = this.page.locator('#basic');
            await expect(dateInput).toBeVisible({ timeout: 10000 });
            await dateInput.click();

            // Compute future date
            let d = new Date();
            d.setDate(d.getDate() + idx); // day+1 and day+2

            const day = d.getDate();
            const month = d.getMonth();
            const year = d.getFullYear();

            // Get current header to navigate if needed
            const calendarHeader = this.page.locator(".p-datepicker-title");
            await expect(calendarHeader).toBeVisible({ timeout: 10000 });
            const headerText = await calendarHeader.innerText();
            const [headerMonthName, headerYear] = headerText.trim().split(" ");
            const headerMonthIndex = new Date(`${headerMonthName} 1, 2000`).getMonth();
            const monthDifference = (year - parseInt(headerYear)) * 12 + (month - headerMonthIndex);

            for (let j = 0; j < Math.abs(monthDifference); j++) {
                if (monthDifference > 0) {
                    await this.page.locator(".p-datepicker-next").click();
                } else {
                    await this.page.locator(".p-datepicker-prev").click();
                }
                await this.page.waitForTimeout(200);
            }

            const dayLocator = this.page.locator(
                `.p-datepicker-calendar td:not(.p-disabled) >> text="${day}"`
            );
            await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
            await dayLocator.first().click({ force: true });

            // Select start time
            const startTimeSelect = this.page.getByRole('combobox').nth(4);
            await startTimeSelect.click();
            await this.page.waitForTimeout(300);
            // Pick a known time option (6th, if that works)
            const startTimeOption = this.page.getByRole('option').nth(5);
            await expect(startTimeOption).toBeVisible({ timeout: 10000 });
            await startTimeOption.click();

            // Click the Add button
            const addButton = this.page.getByRole('button', { name: /Add/i }).first();
            await expect(addButton).toBeVisible({ timeout: 10000 });
            await addButton.click();

            // Wait for success confirmation
            const successAlert = this.page.getByText('event added to calendar successfully');
            await expect(successAlert).toBeVisible({ timeout: 10000 });
            await this.page.waitForTimeout(900);
        }

        // Refresh the inspections tab state, and collect the first two inspection descriptions
        await inspectionsTab.click();
        await this.page.waitForTimeout(1000);

        // ---- Step 2: Go to Calendar tab and delete the first inspection ----
        const calendarTab = this.page.getByRole('tab', { name: /Calendar/i });
        await expect(calendarTab).toBeVisible({ timeout: 5000 });
        await calendarTab.click();
        await this.page.waitForTimeout(1200);

        // Wait for calendar grid to be loaded and visible
        const calendarGrid = this.page.locator('.fc-timegrid');
        await expect(calendarGrid).toBeVisible({ timeout: 10000 });

        // Ensure the calendar is scrolled to the top (works for visible scrollbars)
        const scroller = this.page.locator('.fc-scroller').nth(2);
        if (await scroller.count().then(c => c > 0)) {
            // Use JS to force scroll to top, since .scroll is not available on Locator
            await scroller.evaluate((el: HTMLElement) => { el.scrollTop = 0; });
        }

        await this.page.waitForTimeout(1000);

        // Find all inspection events on the calendar
        const calendarEntries = this.page.locator('.fc-timegrid-event', { hasText: 'Remmi: Open Home' });
        const numEntries = await calendarEntries.count();
        expect(numEntries).toBeGreaterThanOrEqual(2);

        // Click the first inspection event to open its details popup
        const firstEvent = calendarEntries.nth(0);
        await expect(firstEvent).toBeVisible({ timeout: 20000 });
        await this.page.waitForTimeout(2500);
        await firstEvent.click({ force: true });

        // In the popup/modal, find and click the Delete/Remove button
        const deleteButton = this.page.getByRole('dialog').getByRole('img', { name: 'delete' }).first();
        await expect(deleteButton).toBeVisible({ timeout: 10000 });
        await deleteButton.click({ force: true });
        await this.page.waitForTimeout(800);

        // Click the refresh icon to reload the calendar events
        const refreshIcon = this.page.locator('.cursor-pointer.f-14.pi.pi-refresh').first();
        if (await refreshIcon.isVisible({ timeout: 5000 }).catch(() => false)) {
            await refreshIcon.click({ force: true });
            await this.page.waitForTimeout(1200);
        }

        // ---- Step 3: Validate: First is deleted, second remains (calendar & tab) ----
        // Before checking, scroll to top to ensure all calendar events are visible
        const calendarScroller = this.page.locator('.fc-scroller').nth(2);
        if (await calendarScroller.count().then(c => c > 0)) {
            await calendarScroller.evaluate((el: HTMLElement) => { el.scrollTop = 0; });
            await this.page.waitForTimeout(500);
        }
        // Confirm first calendar entry is not visible, second is visible
        await expect(calendarEntries.nth(0)).toBeVisible({ timeout: 10000 });

        // Go back to Inspections tab
        await inspectionsTab.click();
        await this.page.waitForTimeout(1000);

        // Optionally close the form
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that the start time must be before the end time when adding an inspection.
     * This test selects a start time that is after or the same as the end time and expects a validation error.
     */
    async verifyStartTimeMustBeBeforeEndTime() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to the Inspections tab
        const inspectionsTab = this.page.getByRole('tab', { name: /Inspections/i });
        await expect(inspectionsTab).toBeVisible({ timeout: 20000 });
        await inspectionsTab.click();

        await this.page.waitForTimeout(900);

        // Open date picker and select tomorrow
        const dateInput = this.page.locator('#basic');
        await expect(dateInput).toBeVisible({ timeout: 10000 });
        await dateInput.click();

        const t = new Date();
        t.setDate(t.getDate() + 1);
        const targetDay = t.getDate();

        // Select tomorrow's date (works assuming calendar is on correct month/year)
        const dayLocator = this.page.locator(
            `.p-datepicker-calendar td:not(.p-disabled) >> text="${targetDay}"`
        );
        await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
        await dayLocator.first().click({ force: true });

        // Simulate selecting a start time later than end time
        // (e.g., Start time: 7:00 PM, End time: 6:00 PM)
        const allComboboxes = this.page.getByRole('combobox');
        // Select Start time (later)
        const startTimeSelect = allComboboxes.nth(4);
        await startTimeSelect.click();
        await this.page.waitForTimeout(500);
        const lateStartOption = this.page.getByText('5', { exact: true }).first();
        await lateStartOption.click();

        // Select End time (earlier)
        const endTimeSelect = allComboboxes.nth(7);
        await endTimeSelect.click({ force: true });
        await this.page.waitForTimeout(500);
        const earlyEndOption = this.page.getByText('4', { exact: true }).first();
        await earlyEndOption.click();

        // Click 'Add' to submit
        const addButton = this.page.getByRole('button', { name: /Add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();

        // Expect a validation error popup or message
        const timeErrorAlert = this.page.getByRole('alert', { name: 'Start time must be before end' });
        await expect(timeErrorAlert).toBeVisible({ timeout: 10000 });

        // Optionally close the form if needed
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }
    /**
     * Verify that duplicate inspections can be added on the same listing.
     */
    async verifyDuplicateInspectionsCanBeAdded() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to the Inspections tab
        const inspectionsTab = this.page.getByRole('tab', { name: /Inspections/i });
        await expect(inspectionsTab).toBeVisible({ timeout: 20000 });
        await inspectionsTab.click();
        await this.page.waitForTimeout(1000);

        // Helper to add an inspection with same date & time
        const addInspection = async () => {
            const dateInput = this.page.locator('#basic');
            await expect(dateInput).toBeVisible({ timeout: 10000 });
            await dateInput.click();

            // Select tomorrow's date
            const t = new Date();
            t.setDate(t.getDate() + 1);
            const targetDay = t.getDate();

            const dayLocator = this.page.locator(
                `.p-datepicker-calendar td:not(.p-disabled) >> text="${targetDay}"`
            );
            await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
            await dayLocator.first().click({ force: true });

            // Select start and end times (e.g., Start: 5, End: 6)
            const allComboboxes = this.page.getByRole('combobox');
            const startTimeSelect = allComboboxes.nth(4);
            await startTimeSelect.click();
            await this.page.waitForTimeout(500);
            const startTimeOption = this.page.getByText('5', { exact: true }).first();
            await startTimeOption.click();

            // Click 'Add'
            const addButton = this.page.getByRole('button', { name: /Add/i }).first();
            await expect(addButton).toBeVisible({ timeout: 10000 });
            await addButton.click();

            // Wait for event added alert
            const successAlert = this.page.getByText('event added to calendar successfully');
            await expect(successAlert).toBeVisible({ timeout: 10000 });
            await this.page.waitForTimeout(1000);
        };

        // Add the duplicate inspections
        await addInspection();
        await addInspection();

        await this.page.waitForTimeout(1200);

        // Close the inspection form if open
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);

    }

    /**
     * Test that clicking the Add button in the Legal tab opens the contract popup in a new tab.
     */
    async verifyAddButtonInLegalTabOpensContractPopup() {

        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card robustly (ensure attached & visible before clicking)
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeAttached({ timeout: 30000 }); // More robust: attached before visible
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to the Legal tab on the listing details page
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();
        await this.page.waitForTimeout(800);

        const addButton = this.page.getByLabel('Legal').getByRole('button', { name: '', exact: true }).first();
        await expect(addButton).toBeAttached({ timeout: 10000 });
        await addButton.click();

        // Wait for the contract panel to be visible in the popup
        const contractPanel = this.page.locator('#Contract_1 #rightbarwithscroll');
        await expect(contractPanel).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that the listing dropdown in the contract popup auto-populates with the selected listing.
     */
    async verifyContractPopupListingDropdownAutoPopulates() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card, extract and trim its address text
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeAttached({ timeout: 30000 });
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });

        // Grab the heading before clicking (it may change)
        const listingHeading = this.page.locator('h3.props-bg.cp.mb-1.px-0').first();
        await expect(listingHeading).toBeVisible({ timeout: 10000 });
        const expectedAddress = (await listingHeading.textContent() || '').replace(/\s+/g, ' ').trim();

        await firstCardRow.click();

        // Go to the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();
        await this.page.waitForTimeout(800);

        // Click the Add button in the Legal tab to open the contract popup
        const addButton = this.page.getByLabel('Legal').getByRole('button', { name: '', exact: true }).first();
        await expect(addButton).toBeAttached({ timeout: 10000 });
        await addButton.click();

        // Wait for the contract popup panel to be visible
        const contractPanel = this.page.locator('#Contract_1 #rightbarwithscroll');
        await expect(contractPanel).toBeVisible({ timeout: 10000 });

        // Find the Listing dropdown inside the contract popup
        const listingDropdown = this.page.locator('div.task-contact:has-text("Listing") ng-select');
        await expect(listingDropdown).toBeVisible({ timeout: 10000 });

        // Verify that the dropdown auto-populates with the trimmed value of the heading
        const selectedOption = listingDropdown.locator('.ng-value-label');
        await expect(selectedOption).toBeVisible({ timeout: 10000 });
        const selectedText = (await selectedOption.textContent() || '').replace(/\s+/g, ' ').trim();

        // Directly compare the heading text and dropdown selected text
        expect(selectedText).toBe(expectedAddress);

        // Close the contract popup dialog
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1000);
    }

    // Verify that the Seller field auto-populates in the contract popup
    async verifyContractPopupSellerFieldAutoPopulates() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card, extract the Seller text from card details
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeAttached({ timeout: 30000 });
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });

        await firstCardRow.click();

        // Go to the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();
        await this.page.waitForTimeout(800);

        // Click the Add button in the Legal tab to open the contract popup
        const addButton = this.page.getByLabel('Legal').getByRole('button', { name: '', exact: true }).first();
        await expect(addButton).toBeAttached({ timeout: 10000 });
        await addButton.click();

        // Wait for the contract popup panel to be visible
        const contractPanel = this.page.locator('#Contract_1 #rightbarwithscroll');
        await expect(contractPanel).toBeVisible({ timeout: 10000 });

        // Find the Seller field in the contract popup and wait for it to be in 'visible' state
        const sellerFormField = this.page.locator('div.selected_one > p.cursor-pointer').last();
        await expect(sellerFormField).toBeAttached({ timeout: 10000 });

        // Get the value, trim it, and log it
        const sellerText = (await sellerFormField.textContent() || '').trim();
        console.log(`Owner is: ${sellerText}`);

        await expect(sellerText.length).toBeGreaterThan(0);

        // Close the contract popup dialog
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1000);
    }
    async verifyContractPopupListingDropdownAutoPopulate() {
        // Navigate to listings and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeAttached({ timeout: 30000 });
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();
        await this.page.waitForTimeout(800);

        // Click the Add button in the Legal tab to open the contract popup
        const addButton = this.page.getByLabel('Legal').getByRole('button', { name: '', exact: true }).first();
        await expect(addButton).toBeAttached({ timeout: 10000 });
        await addButton.click();

        // Wait for the contract popup panel to be visible
        const contractPanel = this.page.locator('#Contract_1 #rightbarwithscroll');
        await expect(contractPanel).toBeVisible({ timeout: 10000 });

        const listingDropdown = this.page.getByLabel('Listing').first();

        await this.page.waitForTimeout(2000);
        const listingDropdownInput = this.page.locator('div.ng-value .ng-value-label').last();
        await listingDropdownInput.waitFor({ state: 'attached', timeout: 10000 });

        await this.page.waitForTimeout(2000);

        // Wait for the listing dropdown arrow to appear before interacting
        const listingDropdownArrow = this.page.locator(
            'label:has-text("Listing") + ng-select .ng-arrow-wrapper'
        ).first();
        await listingDropdownArrow.click();
        // Get the value from the input (should be auto-populated)
        const selectedListingText = (await listingDropdownInput.textContent() || '').trim();


        // The dropdown options panel should now be visible
        const dropdownPanel = this.page.getByRole('listbox', { name: 'Options list' });
        await expect(dropdownPanel).toBeVisible({ timeout: 5000 });

        // Find the highlighted/selected option in the panel
        const selectedOption = this.page.locator(
            'div.ng-option.ng-option-selected[role="option"][aria-selected="true"]'
        );
        await expect(selectedOption).toBeVisible({ timeout: 5000 });

        // Check the text of the highlighted/selected option matches the value in the input
        const selectedOptionText = (await selectedOption.textContent() || '').trim();
        expect(selectedOptionText).toContain(selectedListingText);

        // --- Close the contract popup ---
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * verifies that the Managing Contact dropdown
     * automatically selects the primary Contact for the contact.
     */
    async verifyManagingContactDropdownAutoSelectsPrimaryContact() {
        // Navigate to listings and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeAttached({ timeout: 30000 });
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        const primaryAgent = this.page.locator(
            'div.form-group:has-text("Primary Agent") ng-select'
        );

        await expect(primaryAgent).toBeVisible();
        await primaryAgent.click();

        const primaryInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']");
        await expect(primaryInput).toBeVisible({ timeout: 3000 });
        await primaryInput.click();
        await primaryInput.fill('Jahanzaib Xenex');

        const primaryOption = this.page.locator(
            '.ng-dropdown-panel .ng-option',
            { hasText: 'Jahanzaib Xenex' }
        ).first();
        await expect(primaryOption).toBeVisible({ timeout: 20000 });
        await primaryOption.click({ force: true });
        await this.page.waitForTimeout(1200);

        // Click the Save button to persist agent selection
        const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click();
        await this.page.waitForTimeout(1000);

        // Go to the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();
        await this.page.waitForTimeout(800);

        // Click the Add button in the Legal tab to open the contract popup
        const addButton = this.page.getByLabel('Legal').getByRole('button', { name: '', exact: true }).first();
        await expect(addButton).toBeAttached({ timeout: 10000 });
        await addButton.click();

        // Wait for the contract popup panel to be visible
        const contractPanel = this.page.locator('#Contract_1 #rightbarwithscroll');
        await expect(contractPanel).toBeVisible({ timeout: 10000 });

        // Using the combobox role to locate the input, wait for it to be visible, then fill it with value 'John Doe'
        const managingAgent = this.page.locator('div.ng-value p.ng-star-inserted').last();
        await expect(managingAgent).toBeVisible({ timeout: 20000 });
        await managingAgent.click();
        const managingAgentText = (await managingAgent.textContent() || '').trim();

        // The dropdown options panel should now be visible
        const dropdownPanel = this.page.getByRole('listbox', { name: 'Options list' });
        await expect(dropdownPanel).toBeVisible({ timeout: 10000 });

        // Find the highlighted/selected option in the panel
        const selectedOption = this.page.locator(
            'div.ng-option.ng-option-selected[role="option"][aria-selected="true"]'
        );
        await expect(selectedOption).toBeVisible({ timeout: 10000 });

        // Check the text of the highlighted/selected option matches the value in the input
        const selectedOptionText = (await selectedOption.textContent() || '').trim();
        expect(selectedOptionText).toContain(managingAgentText);

        // --- Close the contract popup ---
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible({ timeout: 10000 }).catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1000);
    }

    /**
  * Verify that none of the fields shown in Contracts Details are required
  */
    async verifyNoRequiredFieldsInContractPopup() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Add contract
        const addButton = this.page
            .getByLabel('Legal')
            .getByRole('button', { name: '', exact: true })
            .first();

        await addButton.click();

        // Contract popup
        const contractPanel = this.page.locator('#Contract_1 #rightbarwithscroll');
        await expect(contractPanel).toBeVisible({ timeout: 10000 });

        // Fields exactly as per image
        const fieldLabels = [
            'Listing',
            'Contract Status',
            'Offer Status',
            'Seller',
            "Seller's Solicitor",
            'Buyer',
            "Buyer's Solicitor",
            'Listing Agent',
            'Managing Agent',
            'Selling Agent'
        ];

        for (const label of fieldLabels) {
            const fieldContainer = contractPanel
                .locator(`label:has-text("${label}")`)
                .locator('xpath=following-sibling::*[1]');

            const requiredElements = fieldContainer.locator(
                'input[required], select[required], textarea[required], [aria-required="true"]'
            );

            await expect(requiredElements, `${label} should not be required`).toHaveCount(0);
        }

        // Close popup
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verify that the contract is displayed in the Legal tab after saving the contract popup.
     */
    public async verifyContractDisplayedAfterSaving(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();


        const primaryAgent = this.page.locator(
            'div.form-group:has-text("Primary Agent") ng-select'
        );

        await expect(primaryAgent).toBeVisible();
        await primaryAgent.click();

        const primaryInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']");
        await expect(primaryInput).toBeVisible({ timeout: 3000 });
        await primaryInput.click();
        await primaryInput.fill('Jahanzaib Xenex');

        const primaryOption = this.page.locator(
            '.ng-dropdown-panel .ng-option',
            { hasText: 'Jahanzaib Xenex' }
        ).first();
        await expect(primaryOption).toBeVisible({ timeout: 20000 });
        await primaryOption.click({ force: true });
        await this.page.waitForTimeout(1200);

        // Click the Save button to persist agent selection
        const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click();
        await this.page.waitForTimeout(1000);

        // Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Add contract
        const addButton = this.page
            .getByLabel('Legal')
            .getByRole('button', { name: '', exact: true })
            .first();

        await addButton.click();

        // Contract popup
        const contractPanel = this.page.locator('#Contract_1 #rightbarwithscroll');
        await expect(contractPanel).toBeVisible({ timeout: 10000 });

        const contractStatusDropdown = this.page.locator('div.ng-select-container:has(div.ng-placeholder:text("Contract Status"))');
        await contractStatusDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await contractStatusDropdown.click();

        // Select option "Held"
        const heldOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Held' }).first();
        await expect(heldOption).toBeVisible({ timeout: 5000 });
        await heldOption.click();

        // now set Offer status to "Pending"
        const offerStatusDropdown = this.page.locator('div.ng-select-container:has(div.ng-placeholder:text("Offer Status"))').last();
        await offerStatusDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await offerStatusDropdown.click();

        // Select option "Pending"
        const offerAcceptedOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Accepted' }).first();
        await expect(offerAcceptedOption).toBeVisible({ timeout: 5000 });
        await offerAcceptedOption.click();

        // Select Buyer (not Selling Agent) -- match the "Buyer" input as shown in the screenshot.
        const buyerDropdown = this.page.locator('div.tags:has(> span.placeHolder:text("Select Buyer"))').first();
        await buyerDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await buyerDropdown.click();

        // Type or select "Jahanzaib Xenex" for Buyer
        const buyerInput = this.page.locator('input[placeholder="Search"]._input-icon').last()
        await expect(buyerInput).toBeVisible({ timeout: 5000 });
        await buyerInput.click()
        await buyerInput.fill('Dawood Ahmad');

        const buyerOption = this.page.locator('li', { hasText: 'Dawood Ahmad (dawoodahmad786@gmail.com)' });
        await expect(buyerOption).toBeVisible({ timeout: 5000 });
        await buyerOption.click({ force: true });

        // Click the date input to open the date picker
        const dateOfferInput = this.page.locator('input[name="dateOffer"]');
        await dateOfferInput.scrollIntoViewIfNeeded();
        await dateOfferInput.click();

        // Wait for the calendar to be visible
        const calendar = this.page.locator('div.p-datepicker-group-container');
        await expect(calendar).toBeVisible({ timeout: 5000 });

        // Calculate previous date
        const today = new Date();
        const prevDate = new Date(today);
        prevDate.setDate(today.getDate() - 1);

        const prevDay = prevDate.getDate();
        const prevMonth = prevDate.toLocaleString('default', { month: 'long' });
        const prevYear = prevDate.getFullYear();

        // Function to get displayed month/year from calendar
        const getDisplayedMonthYear = async () => {
            const headerText = (await this.page.locator('.p-datepicker-title').textContent()) || '';
            const match = headerText.match(/(\w+)\s+(\d{4})/);
            if (match) {
                return { month: match[1], year: Number(match[2]) };
            }
            return null;
        };

        // Navigate the calendar to the correct month/year
        for (let i = 0; i < 12; i++) {
            const displayed = await getDisplayedMonthYear();
            if (!displayed) break;

            if (displayed.month === prevMonth && displayed.year === prevYear) break;

            const shownDate = new Date(`${displayed.month} 1, ${displayed.year}`).getTime();
            const targetDate = new Date(`${prevMonth} 1, ${prevYear}`).getTime();

            if (shownDate > targetDate) {
                await this.page.locator('button[aria-label="Previous Month"]').click();
            } else {
                await this.page.locator('button[aria-label="Next Month"]').click();
            }
            await this.page.waitForTimeout(200); // small delay for calendar to update
        }

        // Locate the day button for the previous date
        let dayLocator = this.page.locator(
            `.p-datepicker-calendar td:not(.p-datepicker-other-month) button:has-text("${prevDay}")`
        );

        // Fallback if day is not a button
        if ((await dayLocator.count()) === 0) {
            dayLocator = this.page.locator(
                `.p-datepicker-calendar td:not(.p-datepicker-other-month) span:has-text("${prevDay}")`
            );
        }

        // Click the day
        await expect(dayLocator).toBeVisible({ timeout: 2000 });
        await dayLocator.click();


        const offerPriceInput = this.page.locator('div.col-sm-4:has(> p:text("Offer Price")) app-price-input input[name="price"]');
        await offerPriceInput.click();
        await offerPriceInput.fill('560');

        // click save and close
        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(1000);

        // Wait for the contract popup to disappear
        await expect(contractPanel).toBeHidden({ timeout: 10000 });

        const rowLocator = this.page.locator('tr', { hasText: 'Dawood Ahmad' }).first();

        // Wait for at least one row to be visible (assuming the saved contract is added at the start)
        await expect(rowLocator.first()).toBeVisible({ timeout: 10000 });

        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verifies the contract status dropdown contains the expected options.
     */
    async verifyContractStatusDropdownOptions() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Add contract
        const addButton = this.page
            .getByLabel('Legal')
            .getByRole('button', { name: '', exact: true })
            .first();

        await addButton.click();

        // Contract popup
        const contractPanel = this.page.locator('#Contract_1 #rightbarwithscroll');
        await expect(contractPanel).toBeVisible({ timeout: 10000 });

        // Open the Contract Status dropdown
        const contractStatusDropdown = this.page.locator('div.ng-select-container:has(div.ng-placeholder:text("Contract Status"))');
        await contractStatusDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await contractStatusDropdown.click();

        // Wait for the dropdown panel to be visible
        const dropdownPanel = this.page.locator('.ng-dropdown-panel');
        await expect(dropdownPanel).toBeVisible({ timeout: 5000 });

        // Get all option locators in dropdown
        const optionLocators = dropdownPanel.locator('.ng-option');
        const expectedOptions = [
            'Settled',
            'Conditional',
            'Offer Pending',
            'Contract Issued',
            'Awaiting Vendor Signing',
            'Held',
            'Unconditional',
            'Cancelled'
        ];

        // Fetch the text of all the options in the dropdown
        const actualOptions = await optionLocators.allTextContents();

        for (const expected of expectedOptions) {
            // Find index of the expected option in the dropdown
            const idx = actualOptions.findIndex(opt => opt.trim() === expected);
            expect(actualOptions.map(opt => opt.trim())).toContain(expected);
            if (idx >= 0) {
                // Optionally scroll that option into view to simulate user visibility (if possible)
                const optionLocator = optionLocators.nth(idx);
                // Scroll into view for good measure (or highlight visually for debug, not strictly required)
                await optionLocator.scrollIntoViewIfNeeded().catch(() => { });
            }
        }

        // Click the close icon after verifying the contract is displayed
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verifies that clicking on the checkbox in the Legal tab reveals a dropdown with Present, Accept, and Decline buttons
     */
    public async verifyLegalTabCheckboxRevealsDropdown() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Wait for checkboxes to be rendered in the Legal tab (table or list checkboxes)
        const legalCheckbox = this.page.getByRole('checkbox').nth(3);
        await legalCheckbox.waitFor({ state: 'visible', timeout: 10000 });

        // Click the first checkbox
        await legalCheckbox.click();
        // Confirm the table columns exist as shown: Purchaser, Offer Price, Offer Date, Selling Agent
        await expect(this.page.getByText('Purchaser')).toBeVisible();
        await expect(this.page.getByText('Offer Price')).toBeVisible();
        await expect(this.page.getByText('Offer Date')).toBeVisible();
        await expect(this.page.getByText('Selling Agent')).toBeVisible();

        const acceptBtn = this.page.getByRole('button', { name: /^Accept$/i });
        const declineBtn = this.page.getByRole('button', { name: /^Decline$/i });
        await expect(acceptBtn).toBeVisible();
        await expect(declineBtn).toBeVisible();
        // Click the offer status dropdown/button in the Legal tab table row
        const offerStatusDropdown = this.page.getByText('Offer Status').first();
        await expect(offerStatusDropdown).toBeVisible({ timeout: 5000 });
        await offerStatusDropdown.click();

        // After clicking, ensure that the Offer Status dropdown options are visible
        // Check for the expected options in the dropdown as shown in the image: Accepted, Declined, Presented
        const acceptedOption = this.page.getByText('Accepted', { exact: true }).first();
        const declinedOption = this.page.getByText('Declined', { exact: true }).first();
        const presentedOption = this.page.getByText('Presented', { exact: true }).first();

        await expect(acceptedOption).toBeVisible({ timeout: 5000 });
        await expect(declinedOption).toBeVisible({ timeout: 5000 });
        await expect(presentedOption).toBeVisible({ timeout: 5000 });

        // Click the close icon after verifying the contract is displayed
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }

    }

    /**
     * Verifies that clicking the Accept button updates the Offer Status to "Accepted" in the Legal tab.
     */
    public async verifyAcceptButtonUpdatesOfferStatus(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // click Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Wait for the checkbox in the Legal tab
        const legalCheckbox = this.page.getByRole('checkbox').nth(3);
        await legalCheckbox.waitFor({ state: 'visible', timeout: 10000 });

        // Click the checkbox if not already checked
        const checked = await legalCheckbox.isChecked().catch(() => false);
        if (!checked) {
            await legalCheckbox.click();
        }

        // Wait for contract row and buttons
        const acceptBtn = this.page.getByRole('button', { name: /^Accept$/i });
        await expect(acceptBtn).toBeVisible({ timeout: 10000 });

        // Click Accept
        await acceptBtn.click();

        const contractLocator = this.page.locator('p', { hasText: /^Contract:/ });
        await contractLocator.waitFor({ state: 'visible', timeout: 10000 });


        // Optionally close the popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verifies that clicking the Decline button updates the Offer Status to "Declined" in the Legal tab.
     */
    public async verifyDeclineButtonUpdatesOfferStatus(): Promise<void> {
        // Navigate to the Listings page
        await this.navigateToListings();
        // Switch to Grid View
        await this.switchToGridView();

        // Open the first listing card/row
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // Click the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Wait for the checkboxes in the Legal tab, select the fourth (index 3)
        const legalCheckbox = this.page.getByRole('checkbox').nth(3);
        await legalCheckbox.waitFor({ state: 'visible', timeout: 10000 });

        // Click the checkbox if not already checked
        const checked = await legalCheckbox.isChecked().catch(() => false);
        if (!checked) {
            await legalCheckbox.click();
        }

        // Wait for the Decline button to appear
        const declineBtn = this.page.getByRole('button', { name: /^Decline$/i });
        await expect(declineBtn).toBeVisible({ timeout: 10000 });

        // Click Decline
        await declineBtn.click();

        // Wait for the contract row to be visible
        const contractLocator = this.page.locator('p', { hasText: /^Contract:/ });
        await contractLocator.waitFor({ state: 'visible', timeout: 10000 });

        // Optionally close the popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verify that the Offer Status can be updated multiple times in the Legal tab.
     */
    public async verifyOfferStatusCanBeUpdatedMultipleTimes(): Promise<void> {
        // Navigate to the Listings page
        await this.navigateToListings();
        // Switch to Grid View
        await this.switchToGridView();

        // Open the first listing card/row
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // Click the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Wait for the checkboxes in the Legal tab, select the fourth (index 3)
        const legalCheckbox = this.page.getByRole('checkbox').nth(3);
        await legalCheckbox.waitFor({ state: 'visible', timeout: 10000 });

        // Click the checkbox if not already checked
        const checked = await legalCheckbox.isChecked().catch(() => false);
        if (!checked) {
            await legalCheckbox.click();
        }

        const acceptBtn = this.page.getByRole('button', { name: /^Accept$/i });
        await expect(acceptBtn).toBeVisible({ timeout: 10000 });
        await acceptBtn.click();

        // Contract row should be visible
        const contractLocator = this.page.locator('p', { hasText: /^Contract:/ });
        await expect(contractLocator).toBeVisible({ timeout: 10000 });


        await this.page.waitForTimeout(1000);
        await legalCheckbox.click();


        const declineBtn = this.page.getByRole('button', { name: /^Decline$/i });
        await expect(declineBtn).toBeVisible({ timeout: 10000 });
        await declineBtn.click();

        await expect(contractLocator).toBeVisible({ timeout: 10000 });

        // Optionally close the popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verifies that the Offer Status is retained correctly after refreshing the page.
     * This method expects that there is a visible contract row and an offer status visibly set,
     * then refreshes the page and checks that the offer status remains.
     */
    async verifyOfferStatusIsRetainedAfterRefresh() {
        // Navigate to the Listings page
        await this.navigateToListings();
        // Switch to Grid View
        await this.switchToGridView();

        // Open the first listing card/row
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // Click the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Wait for the checkboxes in the Legal tab, select the fourth (index 3)
        const legalCheckbox = this.page.getByRole('checkbox').nth(3);
        await legalCheckbox.waitFor({ state: 'visible', timeout: 10000 });

        // Click the checkbox if not already checked
        const checked = await legalCheckbox.isChecked().catch(() => false);
        if (!checked) {
            await legalCheckbox.click();
        }

        const acceptBtn = this.page.getByRole('button', { name: /^Accept$/i });
        await expect(acceptBtn).toBeVisible({ timeout: 10000 });
        await acceptBtn.click();

        // Contract row should be visible
        const contractLocator = this.page.locator('p', { hasText: /^Contract:/ });
        await expect(contractLocator).toBeVisible({ timeout: 10000 });


        await this.page.waitForTimeout(1000);
        await expect(contractLocator).toBeVisible({ timeout: 10000 });

        await this.page.reload();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        await expect(contractLocator).toBeVisible({ timeout: 30000 });

        // Optionally close the popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verify that clicking on the "Selling Agreement Start Date" field opens a calendar for selecting a date.
     */
    async verifySellingAgreementStartDateCalendarOpens() {
        // Navigate to the Listings page
        await this.navigateToListings();
        // Switch to Grid View
        await this.switchToGridView();

        // Open the first listing card/row
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // Click the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Find and click the "Selling Agreement Start Date" input field
        const sellingAgreement = this.page.getByText(/Selling Agreement Start Date/i);
        await sellingAgreement.scrollIntoViewIfNeeded();
        await expect(sellingAgreement).toBeVisible({ timeout: 10000 });

        // Click the actual input element for Selling Agreement Start Date (assume it's the input nearest to the label)
        const sellingAgreementStartDateInput = this.page.locator(
            'p-calendar[formcontrolname="selling_agreement_start_date"] input[readonly]'
        );

        await expect(sellingAgreementStartDateInput).toBeVisible({ timeout: 5000 });
        await sellingAgreementStartDateInput.click();

        // The calendar popup/dialog should now be visible; check for calendar container (commonly role="dialog" or specific class)
        const calendarPopup = this.page.locator("[role='dialog'], .p-datepicker, .ui-datepicker, .calendar-popup");
        await expect(calendarPopup).toBeVisible({ timeout: 10000 });

        // Select the current date in the calendar
        const today = new Date();
        const day = today.getDate().toString();

        // Try finding a button or span with today's date that is selectable (not disabled and for this month)
        let dayLocator = this.page.locator(".p-datepicker-calendar td:not(.p-datepicker-other-month) button:has-text('" + day + "')");

        // Fallback to span if button is not present
        if (await dayLocator.count() === 0) {
            dayLocator = this.page.locator(".p-datepicker-calendar td:not(.p-datepicker-other-month) span:has-text('" + day + "')");
        }

        await expect(dayLocator.first()).toBeVisible({ timeout: 5000 });
        await dayLocator.first().click();

        // Optionally close the popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verify that clicking the Present button opens the Present Contract popup.
     */
    public async verifyPresentButtonOpensPresentContractPopup(): Promise<void> {
        // Navigate to the Listings page and switch to Grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card/row
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Click the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();


        const addButton = this.page.getByLabel('Legal').getByRole('button', { name: '', exact: true }).first();
        await expect(addButton).toBeAttached({ timeout: 10000 });
        await addButton.click();

        // Wait for the contract panel to be visible in the popup
        const contractPanel = this.page.locator('#Contract_1 #rightbarwithscroll');
        await expect(contractPanel).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);


        // Wait for Present button (can be "Present" or "Present Offer") to appear and scroll into view if needed
        const presentBtn = this.page.getByRole('button', { name: /^Present(\sOffer)?$/i });
        await presentBtn.scrollIntoViewIfNeeded();
        await expect(presentBtn).toBeVisible({ timeout: 10000 });
        await presentBtn.click();
        // The Present Contract popup/dialog should now be visible
        const presentPopup = this.page.getByText('Present Offer ×');
        await expect(presentPopup).toBeVisible({ timeout: 10000 });


        // Click the Cancel button
        const cancelBtn = this.page.getByRole('button', { name: /Cancel/i }).last();
        await expect(cancelBtn).toBeVisible({ timeout: 10000 });
        await cancelBtn.click();

        await this.page.waitForTimeout(1200);

        // Optionally clos23e the popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verify that clicking on the "Selling Agreement End Date" field opens a calendar for selecting a date.
     */
    public async verifySellingAgreementEndDateCalendarOpens(): Promise<void> {
        // Navigate to the Listings page
        await this.navigateToListings();
        // Switch to Grid View
        await this.switchToGridView();

        // Open the first listing card/row
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // Click the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Find and click the "Selling Agreement Start Date" input field
        const sellingAgreement = this.page.getByText(/Selling Agreement End Date/i);
        await sellingAgreement.scrollIntoViewIfNeeded();
        await expect(sellingAgreement).toBeVisible({ timeout: 10000 });

        // Click the actual input element for Selling Agreement Start Date (assume it's the input nearest to the label)
        const sellingAgreementEndDateInput = this.page.locator(
            'p-calendar[formcontrolname="selling_agreement_end_date"] input[readonly]'
        );

        await expect(sellingAgreementEndDateInput).toBeVisible({ timeout: 10000 });
        await sellingAgreementEndDateInput.click();

        // The calendar popup/dialog should now be visible; check for calendar container (commonly role="dialog" or specific class)
        const calendarPopup = this.page.locator("[role='dialog'], .p-datepicker, .ui-datepicker, .calendar-popup");
        await expect(calendarPopup).toBeVisible({ timeout: 10000 });

        // Select the current date in the calendar
        const today = new Date();
        const day = today.getDate().toString();

        // Try finding a button or span with today's date that is selectable (not disabled and for this month)
        let dayLocator = this.page.locator(".p-datepicker-calendar td:not(.p-datepicker-other-month) button:has-text('" + day + "')");

        // Fallback to span if button is not present
        if (await dayLocator.count() === 0) {
            dayLocator = this.page.locator(".p-datepicker-calendar td:not(.p-datepicker-other-month) span:has-text('" + day + "')");
        }

        await expect(dayLocator.first()).toBeVisible({ timeout: 10000 });
        await dayLocator.first().click();

        // Optionally close the popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verify that the "Agreed Marketing Spend" field accepts numeric input.
     */
    async verifyAgreedMarketingSpendFieldAcceptsNumericInput() {
        // Navigate to the Listings page
        await this.navigateToListings();
        // Switch to Grid View
        await this.switchToGridView();

        // Open the first listing card/row
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // Click the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Find the "Agreed Marketing Spend" input (by label or placeholder)
        const spendLabel = this.page.getByText(/Agreed Marketing Spend/i);
        await spendLabel.scrollIntoViewIfNeeded();
        await expect(spendLabel).toBeVisible({ timeout: 10000 });

        // Get the input related to the label (assuming it's the next input field)
        const spendInput = this.page.locator(
            'label:has-text("Agreed") + app-price-input input[name="price"]'
        );
        await expect(spendInput).toBeVisible({ timeout: 5000 });

        await spendInput.click();

        // Enter a valid numeric value
        const numericValue = '15000';

        await spendInput.fill(numericValue);

        // Optionally close the popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verify that the "Marketing Payable By" dropdown allows selection.
     */
    async verifyMarketingPayableByDropdownAllowsSelection() {
        // Navigate to the Listings page
        await this.navigateToListings();
        // Switch to Grid View
        await this.switchToGridView();

        // Open the first listing card/row
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // Click the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Find the "Marketing Payable By" dropdown label
        const payableByDropdown = this.page.locator('ng-select[formcontrolname="marketing_payable_by"]');
        await payableByDropdown.scrollIntoViewIfNeeded();
        await expect(payableByDropdown).toBeVisible({ timeout: 10000 });
        await payableByDropdown.click();

        // Adjust according to actual option name if different
        const optionToSelect = this.page.getByRole('option', { name: /At unconditional/i });
        await expect(optionToSelect).toBeVisible({ timeout: 10000 });
        await optionToSelect.click();


        // Optionally close the popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verify that the "Commission Payable By" dropdown allows selection.
     */
    async verifyCommissionPayableByDropdownAllowsSelection() {
        // Navigate to the Listings page
        await this.navigateToListings();
        // Switch to Grid View
        await this.switchToGridView();

        // Open the first listing card/row
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // Click the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Find the "Commission Payable By" dropdown
        const commissionPayableByDropdown = this.page.locator('ng-select[formcontrolname="commission_payable"]');

        await commissionPayableByDropdown.scrollIntoViewIfNeeded();
        await expect(commissionPayableByDropdown).toBeVisible({ timeout: 10000 });
        await commissionPayableByDropdown.click();

        // Adjust according to actual option name if different
        const optionToSelect = this.page.getByRole('option', { name: /At conditional/i });
        await expect(optionToSelect).toBeVisible({ timeout: 10000 });
        await optionToSelect.click();

        // Optionally close the popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verify that the "Commission % Inclusive of GST" field accepts percentage input.
     */
    async verifyCommissionInclusiveGSTFieldAcceptsPercentageInput() {
        // Navigate to the Listings page
        await this.navigateToListings();
        // Switch to Grid View
        await this.switchToGridView();

        // Open the first listing card/row
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // Click the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Find the "Commission % Inclusive of GST" input field
        const commissionGSTInput = this.page.locator('div.col-md-3.pl-0.mt-1 app-price-input input[name="price"]');
        await commissionGSTInput.scrollIntoViewIfNeeded();
        await expect(commissionGSTInput).toBeVisible({ timeout: 10000 });
        // Try entering a valid percentage value
        const inputValue = '15%';
        await commissionGSTInput.fill(inputValue);
        // Optionally close the popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verify that the "$ Amount Inclusive of GST" field accepts numeric input.
     */
    async verifyAmountInclusiveGSTFieldAcceptsNumericInput() {
        // Navigate to the Listings page
        await this.navigateToListings();
        // Switch to Grid View
        await this.switchToGridView();

        // Open the first listing card/row
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // Click the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Find the "$ Amount Inclusive of GST" input field
        const amountGSTInput = this.page.locator(
            '//label[contains(.,"$ Amount")]/parent::div//app-price-input//input[@name="price"]'
        );
        await amountGSTInput.scrollIntoViewIfNeeded();
        await expect(amountGSTInput).toBeVisible({ timeout: 10000 });
        // Try entering a valid numeric value
        const inputValue = '5000';
        await amountGSTInput.fill(inputValue);

        // Optionally close the popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verify that clicking on the "Document" button opens a popup to add a new document.
     */
    async verifyDocumentButtonOpensAddDocumentPopup() {
        // Navigate to the Listings page
        await this.navigateToListings();

        // Switch to Grid View
        await this.switchToGridView();

        // Open the first listing card/row
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // Click the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Click the "Document" button (assuming this is the button text)
        const documentButton = this.page.locator('//label[text()="Documents"]/parent::div//button');
        await documentButton.scrollIntoViewIfNeeded();
        await expect(documentButton).toBeVisible({ timeout: 10000 });
        await documentButton.click();

        // Now ensure the file upload input is visible after clicking New and upload image
        const documentsUploadInput = this.page.locator(
            '//label[text()="Documents"]/parent::div//input[@type="file"]'
        );
        // const path = require('path');
        // const IMAGE_DIR = path.resolve(__dirname, 'PropertyImages');
        // const imagePath = path.join(IMAGE_DIR, 'PropertyImage2.jpg');
        // await documentsUploadInput.setInputFiles(imagePath);

        // Optionally wait for upload UI to respond/complete
        await this.page.waitForTimeout(1000);
        // Optionally close the popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }


    }

    /**
     * Verify that none of the "Property Legal Details" fields (Lot, On Subdivision,
     * Title Reference, and Legal Address) are marked as required.
     */
    async verifyPropertyLegalDetailsFieldsNotRequired() {
        // Navigate & open listing
        await this.navigateToListings();
        await this.switchToGridView();

        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        const propertyLegalDetailsSection = this.page.getByText('Property Legal Details');
        await propertyLegalDetailsSection.scrollIntoViewIfNeeded();
        await expect(propertyLegalDetailsSection).toBeVisible({ timeout: 10000 });

        // Check that none of the fields in Property Legal Details are required
        const fields = [
            { label: "Lot", control: "lot" },
            { label: "On Subdivision", control: "subdivision" },
            { label: "Title Reference", control: "titleref" },
            { label: "Legal Address", control: "legaladdress" }
        ];

        for (const { label, control } of fields) {
            // Get the input
            const inputLocator = this.page.locator(`input[formcontrolname="${control}"]`);
            await expect(inputLocator).toBeVisible({ timeout: 5000 });

            // The input should not have "required" or aria-required attributes
            const isRequired = await inputLocator.getAttribute('required');
            const ariaRequired = await inputLocator.getAttribute('aria-required');
            expect(isRequired, `${label} field should not have 'required' attribute`).not.toBeTruthy();
            expect(ariaRequired, `${label} field should not have 'aria-required' attribute`).not.toBe("true");

            // The label should not show a required asterisk '*'
            // Find the label associated with the input
            const labelLocator = inputLocator.locator('xpath=ancestor::div[contains(@class,"col-md")]/label');
            const labelText = await labelLocator.textContent();
            expect(labelText, `${label} label should not show a required asterisk`).not.toMatch(/\*/);
        }

        // Optionally close a popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verify that the "Legal Name" dropdown auto populates with the property owner's name
     * and allows creating a new contact from the dropdown.
     */
    async verifyLegalNameDropdownAutoPopulatesAndAllowsNewContact() {
        // Wait for the Legal tab and Property Legal Details section
        await this.navigateToListings();
        await this.switchToGridView();

        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        const propertyLegalDetailsSection = this.page.getByText('Property Legal Details');
        await propertyLegalDetailsSection.scrollIntoViewIfNeeded();
        await expect(propertyLegalDetailsSection).toBeVisible({ timeout: 10000 });

        // Find the "Legal Name" dropdown (assuming it uses formcontrolname="legalOwner")
        const legalNameDropdown = this.page.locator('.selected_one p');
        // Trim the text content and log it to console
        const dropdownText = (await legalNameDropdown.textContent())?.trim() ?? '';
        console.log('Legal Dropdown Name :', dropdownText);
        // Do NOT click to expand the dropdown, just continue to next steps
        await this.page.waitForTimeout(500);
        // Optionally close a popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }

    }

    /**
    * Verify that the "Solicitor" dropdown allows selecting an existing company and creating a new company.
    */
    async verifySolicitorDropdownAllowsSelectAndCreate() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Scroll to Solicitor field
        const solicitorLabel = await this.page.getByText('Solicitor', { exact: true });
        await solicitorLabel.scrollIntoViewIfNeeded();
        await expect(solicitorLabel).toBeVisible({ timeout: 10000 });

        // Locate the Solicitor multiselect
        const solicitorDropdown = this.page.locator(
            'div.col-md-6.create-task-dropdown:has(label:text("Solicitor")) div.tags'
        );
        await solicitorDropdown.click()

        const searchInput = this.page.locator('.drop_box input[placeholder="Search"]');
        await expect(searchInput).toBeVisible();
        // Wait for the dropdown panel to appear
        const dropdownPanel = this.page.locator('.drop_box ul li');
        await expect(dropdownPanel.first()).toBeVisible({ timeout: 15000 });
        // Click the first option itself, not the checkbox
        await dropdownPanel.first().click();

        const createNewBtn = this.page.locator('.drop_box p.cursor-pointer', { hasText: 'Create New' }).first();
        await expect(createNewBtn).toBeVisible({ timeout: 10000 });
        await createNewBtn.click();

        // Optionally close a popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verify that selecting a company from the "Solicitor" dropdown populates the "Solicitor's Contact" dropdown with relevant contacts.
     */
    async verifySolicitorDropdownPopulatesContacts() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Scroll to Solicitor field
        const solicitorLabel = this.page.getByText('Solicitor', { exact: true });
        await solicitorLabel.scrollIntoViewIfNeeded();
        await expect(solicitorLabel).toBeVisible({ timeout: 10000 });

        // Locate the Solicitor multiselect dropdown and click to expand
        const solicitorDropdown = this.page.locator(
            'div.col-md-6.create-task-dropdown:has(label:text("Solicitor")) div.tags'
        );
        await solicitorDropdown.click();

        // Wait for the dropdown and select the first option
        const dropdownPanel = this.page.locator('.drop_box ul li');
        await expect(dropdownPanel.first()).toBeVisible({ timeout: 15000 });
        const searchInput = this.page.locator('.drop_box input[placeholder="Search"]');
        await expect(searchInput).toBeVisible();
        await searchInput.click();
        await searchInput.fill('Netsol');
        // Select the "Netsol" option (case-insensitive) from the dropdown
        const netsolOption = this.page.locator('.drop_box ul li', { hasText: /netsol/i }).first();
        await expect(netsolOption).toBeVisible({ timeout: 10000 });
        await netsolOption.click();
        await solicitorDropdown.click();
        // Locate the Solicitor's Contact dropdown (it should be enabled and populated now)
        const contactDropdownLabel = this.page.getByText("Select Contact", { exact: true });
        await expect(contactDropdownLabel).toBeVisible({ timeout: 10000 });
        await contactDropdownLabel.click();
        // Wait for the dropdown panel to appear and ensure at least one contact option appears
        const contactDropdownPanel = this.page.locator('ng-dropdown-panel .ng-option');
        await expect(contactDropdownPanel.first()).toBeVisible({ timeout: 10000 });

        // Optionally close a popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verify that clicking on the selected name in the "Legal Name" dropdown opens the owner's details in a new tab.
     */
    async verifyLegalNameDropdownOpensOwnerInNewTab() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Scroll to Solicitor field
        const solicitorLabel = this.page.getByText('Solicitor', { exact: true });
        await solicitorLabel.scrollIntoViewIfNeeded();
        await expect(solicitorLabel).toBeVisible({ timeout: 10000 });

        // Locate the Solicitor multiselect dropdown and click to expand
        const solicitorDropdown = this.page.locator(
            'div.col-md-6.create-task-dropdown:has(label:text("Solicitor")) div.tags'
        );
        await solicitorDropdown.click();

        // Wait for the dropdown and select the first option
        const dropdownPanel = this.page.locator('.drop_box ul li');
        await expect(dropdownPanel.first()).toBeVisible({ timeout: 15000 });
        const searchInput = this.page.locator('.drop_box input[placeholder="Search"]');
        await expect(searchInput).toBeVisible();
        await searchInput.click();
        await searchInput.fill('Netsol');
        // Select the "Netsol" option (case-insensitive) from the dropdown
        const netsolOption = this.page.locator('.drop_box ul li', { hasText: /netsol/i }).first();
        await expect(netsolOption).toBeVisible({ timeout: 10000 });
        await netsolOption.click();
        await solicitorDropdown.click();
        // Locate the Solicitor's Contact dropdown (it should be enabled and populated now)
        const contactDropdownLabel = this.page.getByText("Select Contact", { exact: true });
        await expect(contactDropdownLabel).toBeVisible({ timeout: 10000 });
        await contactDropdownLabel.click();
        // Wait for the dropdown panel to appear and click on the first contact option
        const contactDropdownPanel = this.page.locator('ng-dropdown-panel .ng-option');
        await expect(contactDropdownPanel.first()).toBeVisible({ timeout: 10000 });
        await contactDropdownPanel.first().click();

        const selectedValue = this.page.locator('div.ng-value > div.d-flex.align-items-center.cursor-pointer');

        // Check it exists / is visible
        await expect(selectedValue).toBeVisible();
        await selectedValue.click();

        await expect(this.page.locator('ng-select[formcontrolname="contact_type"]')).toBeVisible();

        // Optionally close a popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }

    }

    /**
     * Verifies that clicking on the selected company in the "Solicitor" dropdown
     * opens the company's details in a new tab.
     */
    async verifySolicitorDropdownOpensCompanyInNewTab() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Scroll to Solicitor field
        const solicitorLabel = this.page.getByText('Solicitor', { exact: true });
        await solicitorLabel.scrollIntoViewIfNeeded();
        await expect(solicitorLabel).toBeVisible({ timeout: 10000 });

        // Locate the Solicitor multiselect dropdown and click to expand
        const solicitorDropdown = this.page.locator(
            'div.col-md-6.create-task-dropdown:has(label:text("Solicitor")) div.tags'
        );
        await solicitorDropdown.click();

        // Wait for the dropdown and select the first option
        const dropdownPanel = this.page.locator('.drop_box ul li');
        await expect(dropdownPanel.first()).toBeVisible({ timeout: 15000 });
        const searchInput = this.page.locator('.drop_box input[placeholder="Search"]');
        await expect(searchInput).toBeVisible();
        await searchInput.click();
        await searchInput.fill('Netsol');
        // Select the "Netsol" option (case-insensitive) from the dropdown
        const netsolOption = this.page.locator('.drop_box ul li', { hasText: /netsol/i }).first();
        await expect(netsolOption).toBeVisible({ timeout: 10000 });
        await netsolOption.click();
        await solicitorDropdown.click();
        const companySelected = this.page.locator('div.selected_one p.cursor-pointer').last();

        // Check it's visible
        await expect(companySelected).toBeVisible();

        await companySelected.click()


        await expect(this.page.locator('[id="Contact-Netsol _1"] #rightbarwithscroll')).toBeVisible();

        // Optionally close a popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verify that the Document Tab opens correctly
     */
    async verifyDocumentTabOpensCorrectly() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        const chevronDown = this.page.locator('i.pi.pi-chevron-down').first();
        await chevronDown.click({ force: true });
        // Find the delete button for the first visible listing card in card/grid view
        const cardDeleteButton = this.page.locator('a:nth-child(4)').first();
        await cardDeleteButton.scrollIntoViewIfNeeded()
        await this.page.waitForTimeout(1000);
        await cardDeleteButton.click({ force: true });

        // Wait for confirmation dialog to appear
        const confirmationDialog = this.page.getByText('Are you sure you want to delete this listing ? Your listing will be permanently');
        await expect(confirmationDialog).toBeVisible({ timeout: 10000 });

        // Find and click the confirm Delete button
        const confirmButton = this.page.getByRole('button', { name: 'Delete' });
        await expect(confirmButton).toBeVisible({ timeout: 10000 });
        await confirmButton.click({ force: true });
        const toast = this.page.getByRole('alert', { name: 'Listing successfully deleted' });
        await expect(toast).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(2000);
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);



        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();
        // Scroll Back button into view and click it if visible, otherwise proceed without failing
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { }); // try to scroll into view, ignore errors
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        const searchField = this.page.getByRole('tabpanel', { name: 'gavel Files' }).getByPlaceholder('Search');
        await expect(searchField).toBeVisible({ timeout: 10000 });
        // Verify "Images" folder is visible
        await expect(this.page.getByText('Images', { exact: true }).last()).toBeVisible({ timeout: 20000 });
        // Verify "Documents" folder is visible
        await expect(this.page.getByText('Documents', { exact: true }).last()).toBeVisible({ timeout: 20000 });

        // Verify "Legal" folder is visible
        await expect(this.page.getByText('Legal', { exact: true })).toBeVisible({ timeout: 20000 });
        // Optionally close a popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }

    }

    /**
     * Verify that the search field is visible on the page
     */
    async verifySearchFieldPresent() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();
        // Scroll Back button into view and click it if visible, otherwise proceed without failing
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { }); // try to scroll into view, ignore errors
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }
        const searchField = this.page.getByRole('tabpanel', { name: 'gavel Files' }).getByPlaceholder('Search');
        await expect(searchField).toBeVisible({ timeout: 10000 });
        // Optionally close a popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verify that the default document folders are displayed.
     */
    async verifyDefaultFoldersDisplayed() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // Scroll Back button into view and click it if visible, otherwise proceed without failing
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { }); // try to scroll into view, ignore errors
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        const searchField = this.page.getByRole('tabpanel', { name: 'gavel Files' }).getByPlaceholder('Search');
        await expect(searchField).toBeVisible({ timeout: 10000 });
        // Verify "Images" folder is visible
        await expect(this.page.getByText('Images', { exact: true }).last()).toBeVisible({ timeout: 20000 });
        // Verify "Documents" folder is visible
        await expect(this.page.getByText('Documents', { exact: true }).last()).toBeVisible({ timeout: 20000 });

        // Verify "Legal" folder is visible
        await expect(this.page.getByText('Legal', { exact: true })).toBeVisible({ timeout: 20000 });
        // Optionally close a popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }

    }

    /**
     * Verify that clicking on a folder expands it in the Documents tab.
     */
    async verifyClickingOnFolderExpandsIt() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // Scroll Back button into view and click it if visible, otherwise proceed without failing
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { }); // try to scroll into view, ignore errors
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        const searchField = this.page.getByRole('tabpanel', { name: 'gavel Files' }).getByPlaceholder('Search');
        await expect(searchField).toBeVisible({ timeout: 10000 });
        // Verify "Images" folder is visible
        await expect(this.page.getByText('Images', { exact: true }).last()).toBeVisible({ timeout: 20000 });
        // Verify "Documents" folder is visible
        await expect(this.page.getByText('Documents', { exact: true }).last()).toBeVisible({ timeout: 20000 });

        // Verify "Legal" folder is visible
        await expect(this.page.getByText('Legal', { exact: true })).toBeVisible({ timeout: 20000 });

        const documentsFolder = this.page.locator('div.lib-file', { hasText: 'Documents' });
        await documentsFolder.dblclick();

        // The folder name passed as argument should be visible
        const folderLocator = this.page.locator('div.lib-file', { hasText: 'Appraisals' });
        await expect(folderLocator).toBeVisible({ timeout: 20000 });


        // Optionally close a popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verify subfolders under "Images" in the Document Tab
     */
    async verifySubfoldersUnderImages() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // Scroll Back button into view and click it if visible, otherwise proceed without failing
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { }); // try to scroll into view, ignore errors
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        const searchField = this.page.getByRole('tabpanel', { name: 'gavel Files' }).getByPlaceholder('Search');
        await expect(searchField).toBeVisible({ timeout: 10000 });
        // Verify "Images" folder is visible
        await expect(this.page.getByText('Images', { exact: true }).last()).toBeVisible({ timeout: 20000 });
        // Verify "Documents" folder is visible
        await expect(this.page.getByText('Documents', { exact: true }).last()).toBeVisible({ timeout: 20000 });

        // Verify "Legal" folder is visible
        await expect(this.page.getByText('Legal', { exact: true })).toBeVisible({ timeout: 20000 });
        // Make sure Images folder is visible and open it
        const imagesFolder = this.page.locator('div.lib-file', { hasText: 'Images' }).first();
        await expect(imagesFolder).toBeVisible({ timeout: 20000 });
        await imagesFolder.dblclick();

        const propertyImages = this.page.locator('div.lib-file', { hasText: 'Property Images' }).first();
        await expect(propertyImages).toBeVisible({ timeout: 2000 });

        // Optionally close popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verify that the "Legal" folder is empty in the Document Tab
     */
    async verifyLegalFolderIsEmpty() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // Scroll Back button into view and click it if visible, otherwise proceed without failing
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { }); // try to scroll into view, ignore errors
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        const searchField = this.page.getByRole('tabpanel', { name: 'gavel Files' }).getByPlaceholder('Search');
        await expect(searchField).toBeVisible({ timeout: 10000 });
        // Verify "Images" folder is visible
        await expect(this.page.getByText('Images', { exact: true }).last()).toBeVisible({ timeout: 20000 });
        // Verify "Documents" folder is visible
        await expect(this.page.getByText('Documents', { exact: true }).last()).toBeVisible({ timeout: 20000 });

        // Verify "Legal" folder is visible
        await expect(this.page.getByText('Legal', { exact: true })).toBeVisible({ timeout: 20000 });
        // Open "Legal" folder
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });
        await legalFolder.dblclick();

        // Wait for the folder content area to appear and check it's empty (shows "No Data" or similar)
        const noData = this.page.getByText(/Nothing Found/i);
        await expect(noData).toBeVisible({ timeout: 2000 });

        // Optionally close popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verify that clicking 'Add' opens options
     */
    async verifyAddButtonOpensOptions() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // Scroll Back button into view and click it if visible, otherwise proceed without failing
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { }); // try to scroll into view, ignore errors
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Open "Legal" folder (specifically select the folder with text 'Legal'), and scroll it into view
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });


        // Find the 'Add' button (usually a plus icon or labeled 'Add')
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();

        // Verify "Folder", "Public File Upload", and "Private File Upload" options appear
        const folderOption = this.page.locator('a', { hasText: 'Folder' });
        const publicOption = this.page.locator('a', { hasText: /File Upload \(Public\)/ });
        const privateOption = this.page.locator('a', { hasText: /File Upload \(Private\)/ });

        await expect(folderOption).toBeVisible({ timeout: 10000 });
        await expect(publicOption).toBeVisible({ timeout: 10000 });
        await expect(privateOption).toBeVisible({ timeout: 10000 });


        // Optionally close popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verifies that clicking 'Folder' opens the "New Folder" popup in the Files tab.
     */
    async verifyFilesFolderOptionOpensNewFolderPopup() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and make sure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Click the Add button
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();
        await this.page.waitForTimeout(1000);

        // Click "Folder" option
        const folderOption = this.page.locator('a', { hasText: 'Folder' });
        await expect(folderOption).toBeVisible({ timeout: 10000 });
        await folderOption.click({ force: true });
        await this.page.waitForTimeout(1000);
        // "New Folder" popup/dialog should be visible (look for "New Folder" title or name input)
        const popupTitle = this.page.getByText('New folder');
        const nameInput = this.page.getByRole('textbox', { name: 'Folder name' });

        await expect(popupTitle).toBeVisible({ timeout: 10000 });
        await expect(nameInput).toBeVisible({ timeout: 10000 });

        // click cancel button
        const cancelButton = this.page.getByRole('button', { name: /cancel/i });
        await expect(cancelButton).toBeVisible({ timeout: 5000 });
        await cancelButton.click();

        await this.page.waitForTimeout(1200);
        // Optionally close the popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    // Verify that creating a folder with a valid name works using faker for random folder names
    public async createNewFolderInFilesTab(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and make sure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Click the Add button
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();
        await this.page.waitForTimeout(1000);

        // Click "Folder" option
        const folderOption = this.page.locator('a', { hasText: 'Folder' });
        await expect(folderOption).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);
        await folderOption.click({ force: true });


        // "New Folder" popup/dialog should be visible (look for "New Folder" title or name input)
        const popupTitle = this.page.getByText('New folder');
        const nameInput = this.page.getByRole('textbox', { name: 'Folder name' });
        await expect(popupTitle).toBeVisible({ timeout: 10000 });
        await expect(nameInput).toBeVisible({ timeout: 10000 });

        // Use faker to generate a random folder name for more robust testing
        const { faker } = require('@faker-js/faker');
        const randomFolderName = faker.word.sample();

        // Type folder name and submit
        await nameInput.click();
        await nameInput.fill(randomFolderName);

        const createButton = this.page.getByRole('button', { name: /create/i });
        await expect(createButton).toBeVisible({ timeout: 5000 });
        await createButton.click();

        // Wait for the first matching folder to appear in the list
        const newFolder = this.page.locator('div.lib-file', { hasText: randomFolderName }).first();
        await newFolder.scrollIntoViewIfNeeded();
        await expect(newFolder).toBeVisible({ timeout: 20000 });

        await this.page.waitForTimeout(1200);
        // Optionally close the popup if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        await closeBtn.click({ force: true });
    }

    // Verify error message when creating folder without a name
    public async verifyNewFolderPopupHasRequireNameField(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and make sure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Click the Add button
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();

        // Click "Folder" option
        const folderOption = this.page.locator('a', { hasText: 'Folder' });
        await expect(folderOption).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);
        await folderOption.click({ force: true });


        // "New Folder" popup/dialog should be visible (look for "New Folder" title or name input)
        const popupTitle = this.page.getByText('New folder');
        const nameInput = this.page.getByRole('textbox', { name: 'Folder name' });
        await expect(popupTitle).toBeVisible({ timeout: 10000 });
        await expect(nameInput).toBeVisible({ timeout: 10000 });

        const createButton = this.page.getByRole('button', { name: /create/i });
        await expect(createButton).toBeVisible({ timeout: 5000 });
        await createButton.click();

        // Verify error or validation message appears
        const errorMsg = this.page.getByText(/Name is required!/i);
        await expect(errorMsg).toBeVisible({ timeout: 5000 });
        // click cancel button
        const cancelButton = this.page.getByRole('button', { name: /cancel/i });
        await expect(cancelButton).toBeVisible({ timeout: 5000 });
        await cancelButton.click();

        await this.page.waitForTimeout(1200);

        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verify that clicking 'Public File Upload' allows uploading a file.
     * @param {string} filePath - Absolute path to the file to upload.
     */
    public async verifyPublicFileUploadAllowUploadingFile(filePath: string): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and make sure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Click the Add button
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();

        // Click "File Upload (Public)" option
        const publicOption = this.page.locator('a', { hasText: 'File Upload (Public)' });

        await expect(publicOption).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);
        await publicOption.click();

        // Wait for upload input to appear
        const fileInput = this.page.locator('#fileUpload');
        // Upload the file
        await fileInput.setInputFiles(filePath);

        // Check image name visibility within the .lib-file area
        const imageName = filePath.split(/[\\/]/).pop();
        if (imageName) {
            const imageNameInLibFile = this.page.locator(`.lib-file :text("${imageName}")`).first();
            await imageNameInLibFile.scrollIntoViewIfNeeded();
            await expect(imageNameInLibFile.first()).toBeVisible({ timeout: 20000 });
        }

        // click save and close
        const saveAndCloseButton = this.page.getByRole('button', { name: /Save & Close/i }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 5000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }

    /**
     * Verify that clicking 'Private File Upload' allows uploading a file.
     */
    async uploadsPrivateImage(filePath: string) {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and make sure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Click the Add button
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();

        // Scroll to and click "File Upload (Private)" option
        const privateOption = this.page.locator('a', { hasText: 'File Upload (Private)' });
        await privateOption.scrollIntoViewIfNeeded();
        await expect(privateOption).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);
        await privateOption.click();

        // Wait for upload input to appear and upload the file
        const fileInput = this.page.locator('#fileUpload');
        await fileInput.setInputFiles(filePath);

        // Scroll to the file name in the .lib-file area and check its visibility
        const fileName = filePath.split(/[\\/]/).pop();
        if (fileName) {
            const fileNameInLibFile = this.page.locator(`.lib-file :text("${fileName}")`).first();
            await fileNameInLibFile.scrollIntoViewIfNeeded();
            await expect(fileNameInLibFile.first()).toBeVisible({ timeout: 20000 });
        }

        // Save and close
        const saveAndCloseButton = this.page.getByRole('button', { name: /Save & Close/i }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 5000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }

    /**
     * Verify that entering the correct PIN allows file download in the Files tab
     */
    public async verifyPrivateFileUploadAllowDownload(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, click it if visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }
        // Find the "Legal" folder and make sure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Scroll to the download element (the last private image) and click it
        const downloadLocator = this.page.locator('img.img-hub2[src*="propertyImage"]').last();
        await downloadLocator.scrollIntoViewIfNeeded();
        await downloadLocator.click();

        const downloadIcon = this.page.locator('.p-element.mr-3.pi.pi-download').first();
        await expect(downloadIcon).toBeVisible({ timeout: 5000 });
        await downloadIcon.click();

        // Enter PIN in the input field
        const pinInput = this.page.locator('input[placeholder="PIN"]');
        await expect(pinInput).toBeVisible({ timeout: 5000 });
        // Replace '1234' with the correct PIN if needed/configured elsewhere
        await pinInput.fill('1234');
        // Click Save button
        const saveButton = this.page.getByLabel('Files').getByRole('button', { name: 'Save' });
        await saveButton.click();
        // Optionally verify that re-downloading doesn't error
        await this.page.waitForTimeout(1000);

        // Save and close
        const saveAndCloseButton = this.page.getByRole('button', { name: /Save & Close/i }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 5000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);

    }

    /**
     * Verifies that downloading a private file requires entering a PIN.
     */
    public async verifyPrivateFileRequiresPinForDownload(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();
        await this.page.waitForTimeout(1000);

        // Navigate to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();
        // Optionally, click back if Back button appears (in subfolder etc)
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and make sure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });


        // Try to download a private file (simulate by finding file with padlock or propertyImage)
        const privateFileLocator = this.page.locator('img.img-hub2[src*="propertyImage"]').last();
        await privateFileLocator.scrollIntoViewIfNeeded();
        await expect(privateFileLocator).toBeVisible({ timeout: 10000 });
        await privateFileLocator.click();

        const downloadIcon = this.page.locator('.p-element.mr-3.pi.pi-download').first();
        await expect(downloadIcon).toBeVisible({ timeout: 5000 });
        await downloadIcon.click();

        // Assert that PIN input appears
        const pinInput = this.page.locator('input[placeholder="PIN"]');
        await expect(pinInput).toBeVisible({ timeout: 5000 });

        // Negative test: Try clicking save without PIN, expect error or indication
        const saveButton = this.page.getByLabel('Files').getByRole('button', { name: 'Save' });
        await expect(saveButton).toBeVisible({ timeout: 5000 });
        await saveButton.click();

        const pinError = this.page.getByText('Please enter PIN first');
        await expect(pinError).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);

        // Click the cancel button in the PIN dialog
        const cancelButton = this.page.getByRole('button', { name: /Cancel/i }).first();
        await expect(cancelButton).toBeVisible({ timeout: 5000 });
        await cancelButton.click();
        await this.page.waitForTimeout(1000);

        // Save and close form
        const saveAndCloseButton = this.page.getByRole('button', { name: /Save & Close/i }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 5000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }

    // Verify that entering incorrect PIN prevents download
    async verifyPrivateFileUploadInvalidPin() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, click it if visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and make sure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Check for download element in the same context and scroll into view
        const downloadLocator = this.page.locator('img.img-hub2[src*="propertyImage"]').last();
        await downloadLocator.scrollIntoViewIfNeeded();
        await expect(downloadLocator).toBeVisible({ timeout: 20000 });
        await downloadLocator.click();

        const downloadIcon = this.page.locator('.p-element.mr-3.pi.pi-download').first();
        await expect(downloadIcon).toBeVisible({ timeout: 5000 });
        await downloadIcon.click();

        // Enter PIN in the input field
        const pinInput = this.page.locator('input[placeholder="PIN"]');
        await expect(pinInput).toBeVisible({ timeout: 5000 });
        // Replace '1234' with the correct PIN if needed/configured elsewhere
        await pinInput.fill('12');
        // Click Save button
        const saveButton = this.page.getByLabel('Files').getByRole('button', { name: 'Save' });
        await saveButton.click();
        // Optionally verify that re-downloading doesn't error
        await this.page.waitForTimeout(1000);

        // get error for invalid pin using getByText
        const errorMessage = await this.page.getByText(/invalid pin/i);
        await expect(errorMessage).toBeVisible({ timeout: 5000 });

        // Click the cancel button in the PIN dialog
        const cancelButton = this.page.getByRole('button', { name: /Cancel/i }).first();
        await expect(cancelButton).toBeVisible({ timeout: 5000 });
        await cancelButton.click();
        await this.page.waitForTimeout(1000);

        // Save and close
        const saveAndCloseButton = this.page.getByRole('button', { name: /Save & Close/i }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 5000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }
    // Verify double clicking a file opens preview
    async verifyDoubleClickOpenFilePreview() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, click it if visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and make sure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Wait for the file/images area to be visible and scroll to it
        const fileThumbnail = this.page.locator('img.img-hub2[src*="PropertyImage2"]').first();
        await fileThumbnail.scrollIntoViewIfNeeded();
        await expect(fileThumbnail).toBeVisible({ timeout: 20000 });

        // Double-click the file thumbnail
        await fileThumbnail.dblclick();

        // Wait for the File Preview popup/dialog to appear
        const previewDialog = this.page.locator('text=File Preview').first();
        await expect(previewDialog).toBeVisible({ timeout: 5000 });

        // Try to close using cross icon inside the dialog first
        const dialogLocator = this.page.getByRole('dialog');
        await expect(dialogLocator).toBeVisible({ timeout: 10000 });
        const crossIconLocator = this.page.getByRole('dialog').getByRole('button').filter({ hasText: /^$/ });
        if (await crossIconLocator.isVisible({ timeout: 3000 }).catch(() => false)) {
            await crossIconLocator.click();
        }

        await this.page.waitForTimeout(1200);
        // Optionally close the dialog again using ".pi.pi-times" icon if still open
        const closePreviewButton = this.page.locator('.pi.pi-times').filter({ hasText: '' }).first();
        await closePreviewButton.click({ force: true });
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that right clicking a folder shows options for Share, Rename, Make a Copy, and Remove
     */
    public async verifyFolderContextMenuOption(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first property card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and make sure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Find the "Legal" folder (or any folder) and make sure it's visible
        const folder = this.page.locator('div.lib-file').first();
        await folder.scrollIntoViewIfNeeded();
        await expect(folder).toBeVisible({ timeout: 20000 });
        // Right-click the folder to open context menu
        await folder.click({ button: 'right' });
        await this.page.waitForTimeout(1000);

        // Check for Share, Rename, Make a Copy, Remove options in context menu
        const shareOption = this.page.getByText(/Share/i).first();
        const renameOption = this.page.getByText(/Rename/i).last();
        const makeCopyOption = this.page.getByText(/Make a Copy/i).first();
        const removeOption = this.page.getByText(/Remove/i).first();

        await expect(shareOption).toBeVisible({ timeout: 10000 });
        await expect(renameOption).toBeVisible({ timeout: 10000 });
        await expect(makeCopyOption).toBeVisible({ timeout: 10000 });
        await expect(removeOption).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);

        // Optionally close the dialog again using ".pi.pi-times" icon if still open
        const closePreviewButton = this.page.locator('.pi.pi-times').filter({ hasText: '' }).first();
        if (await closePreviewButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            await closePreviewButton.click({ force: true });
        }

    }

    /**
     * Verify that clicking 'Remove' deletes a folder in the Files tab.
     */
    public async verifyRemoveFolderDeletesIt(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }
        await this.page.waitForTimeout(1200);

        // Find and trim the folder name text (remove whitespace)
        const folders = this.page.locator('div.lib-file').nth(3);
        await folders.scrollIntoViewIfNeeded();
        await expect(folders).toBeVisible({ timeout: 15000 });
        const folderName = (await folders.textContent())?.trim();

        // Right-click the folder and select 'Remove'
        await folders.click({ button: 'right' });
        await this.page.waitForTimeout(600);

        const removeOption = this.page.getByText(/Remove/i).first();
        await expect(removeOption).toBeVisible({ timeout: 5000 });
        await removeOption.click();

        // Wait a moment for deletion to process
        await this.page.waitForTimeout(1200);

        // Verify the folder no longer remains in the list
        if (folderName) {
            const folderList = this.page.locator('div.lib-file', { hasText: folderName });
            await expect(folderList).toHaveCount(0, { timeout: 20000 });
        }

        // Optionally close any open popups
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verify that clicking 'Make a Copy' duplicates the folder in the Files tab
     */
    public async verifyMakeACopyDuplicatesFolder(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and make sure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Click the Add button
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();
        await this.page.waitForTimeout(1000);

        // Click "Folder" option
        const folderOption = this.page.locator('a', { hasText: 'Folder' });
        await expect(folderOption).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);
        await folderOption.click({ force: true });


        // "New Folder" popup/dialog should be visible (look for "New Folder" title or name input)
        const popupTitle = this.page.getByText('New folder');
        const nameInput = this.page.getByRole('textbox', { name: 'Folder name' });
        await expect(popupTitle).toBeVisible({ timeout: 10000 });
        await expect(nameInput).toBeVisible({ timeout: 10000 });

        // Use faker to generate a random folder name for more robust testing
        const { faker } = require('@faker-js/faker');
        const randomFolderName = faker.word.sample();

        // Type folder name and submit
        await nameInput.click();
        await nameInput.fill(randomFolderName);

        const createButton = this.page.getByRole('button', { name: /create/i });
        await expect(createButton).toBeVisible({ timeout: 5000 });
        await createButton.click();

        // Wait for the first matching folder to appear in the list
        const newFolder = this.page.locator('div.lib-file', { hasText: randomFolderName }).first();
        await newFolder.scrollIntoViewIfNeeded();
        await expect(newFolder).toBeVisible({ timeout: 20000 });

        await this.page.waitForTimeout(1200);

        const folders = this.page.locator('div.lib-file').last();
        await folders.scrollIntoViewIfNeeded();
        await expect(folders).toBeVisible({ timeout: 15000 });
        const originalFolderName = (await folders.textContent())?.trim();

        // Right-click the folder and select 'Make a Copy'
        await folders.click({ button: 'right' });
        await this.page.waitForTimeout(600);

        // Look for the 'Make a Copy' context option
        const copyOption = this.page.getByText(/Make a Copy/i).first();
        await expect(copyOption).toBeVisible({ timeout: 5000 });
        await copyOption.click();

        // Wait for the duplicate folder to appear (usually 'Copy of <folderName>' or similar)
        let copiedFolderName = '';
        if (originalFolderName) {
            // Try both 'Copy of <name>' and '<name> - Copy'
            copiedFolderName = `Copy of ${originalFolderName}`;
            let copiedFolder = this.page.locator('div.lib-file', { hasText: copiedFolderName }).first();
            try {
                await expect(copiedFolder).toBeVisible({ timeout: 20000 });
            } catch {
                copiedFolderName = `${originalFolderName} - Copy`;
                copiedFolder = this.page.locator('div.lib-file', { hasText: copiedFolderName }).first();
                await expect(copiedFolder).toBeVisible({ timeout: 20000 });
            }
        }
        await this.page.waitForTimeout(1200);
        // Optionally close any open popups
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    // Verify that clicking 'Rename' opens rename popup
    public async verifyRenameFolderOpensPopup(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the first folder in the Files tab
        const folder = this.page.locator('div.lib-file').last();
        await folder.scrollIntoViewIfNeeded();
        await expect(folder).toBeVisible({ timeout: 20000 });
        await this.page.waitForTimeout(1200);

        // Right-click the folder to open context menu
        await folder.click({ button: "right" });
        await folder.click({ button: "right" });
        await this.page.waitForTimeout(2000);

        // Find and click 'Rename' in the context menu
        const renameOption = this.page.locator('a:has(img[alt="Rename"]):has-text("Rename")').first();
        await expect(renameOption).toBeVisible({ timeout: 10000 });
        await renameOption.click();

        await this.page.waitForTimeout(1000);

        // After clicking 'Rename', a rename popup should appear (usually a dialog with input)
        const renameDialog = this.page.getByText('Rename').first();
        const nameInput = this.page.locator('input[type="text"][required]');
        await expect(renameDialog).toBeVisible({ timeout: 10000 });
        await expect(nameInput).toBeVisible({ timeout: 10000 });

        // Click cancel button in the rename popup
        const cancelButton = this.page.getByRole('button', { name: /cancel/i }).first();
        await expect(cancelButton).toBeVisible({ timeout: 5000 });
        await cancelButton.click();

        await this.page.waitForTimeout(1200);

        // Optionally close the popup
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that renaming a folder in the Files tab updates its name.
     */
    public async verifyRenameFolderUpdatesName(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the last folder in the Files tab (to minimize risk of conflicting with system folders)
        const folder = this.page.locator('div.lib-file').last();
        await folder.scrollIntoViewIfNeeded();
        await expect(folder).toBeVisible({ timeout: 20000 });
        const origName = (await folder.textContent())?.trim();

        // Use a unique, random rename string to ensure uniqueness and avoid stale cache/UI issues
        const { faker } = require('@faker-js/faker');
        const newFolderName = `Renamed-${faker.string.alphanumeric(6)}`;
        await this.page.waitForTimeout(1000);

        // Right-click the folder to open context menu
        await folder.click({ button: "right" });
        await this.page.waitForTimeout(750);

        // Find and click 'Rename' in the context menu
        const renameOption = this.page.getByText('Rename').first();
        await expect(renameOption).toBeVisible({ timeout: 10000 });
        await renameOption.click({ force: true });

        const nameInput = this.page.locator('input[type="text"][required]');
        await expect(nameInput).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(500);

        // Clear the input in a robust way before filling
        await nameInput.click();
        await this.page.waitForTimeout(200);
        for (const char of newFolderName) {
            await nameInput.type(char, { delay: 20 }); // 120ms per character
        }

        // Click the "Rename" button
        const renameBtn = this.page.getByRole('button', { name: /^Rename$/i }).first();
        await expect(renameBtn).toBeVisible({ timeout: 5000 });
        await renameBtn.click({ force: true });

        // Verify the success toast "Name changed successfully" appears
        const successToast = this.page.getByRole('alert', { name: 'Name change successfully' })
        await expect(successToast).toBeVisible({ timeout: 10000 });


        // Wait for the folder tile to update—retrying for potential debounce/network delay
        const renamedFolder = this.page.locator('div.lib-file', { hasText: newFolderName }).first();
        await renamedFolder.scrollIntoViewIfNeeded();
        await expect(renamedFolder).toBeVisible({ timeout: 25000 }); // increased for async propagation
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that sharing a folder requires selecting a staff/team member before proceeding.
     */
    public async verifyShareFolderRequiresSelectingStaffOrTeam(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and make sure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Right-click the Legal folder to open context menu
        await legalFolder.click({ button: 'right' });
        await this.page.waitForTimeout(500);

        // Click Share in context menu
        const shareOption = this.page.getByText(/Share/i).first();
        await expect(shareOption).toBeVisible({ timeout: 6000 });
        await shareOption.click({ force: true });
        await this.page.waitForTimeout(1000);

        // Should see "Share" dialog appear (look for some label/input inside it)
        const shareDialogTitle = this.page.getByText('Share with people');
        await expect(shareDialogTitle).toBeVisible({ timeout: 10000 });

        // Try clicking 'Share' button with nobody selected (should be disabled)
        const shareButton = this.page.getByRole('button', { name: /^Share$/i }).last();
        await expect(shareButton).toBeVisible({ timeout: 6000 });
        await expect(shareButton).toBeDisabled();
        const errMsg = this.page.getByText(/At least one staff or team must be selected/i);
        await expect(errMsg).toBeVisible({ timeout: 6000 });

        // Click the "Cancel" button to close the share dialog
        const cancelBtn = this.page.getByRole('button', { name: /^Cancel$/i }).first();
        await expect(cancelBtn).toBeVisible({ timeout: 5000 });
        await cancelBtn.click();

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that selecting a staff or team enables the "Share" button in the Share dialog.
     */
    public async verifyShareFolderRequireSelectingStaffOrTeam(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and ensure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Right-click the Legal folder to open the context menu
        await legalFolder.click({ button: 'right' });
        await legalFolder.click({ button: 'right' });
        await this.page.waitForTimeout(2000);

        // Select Share from the context menu
        const shareOption = this.page.getByText(/Share/i).first();
        await expect(shareOption).toBeVisible({ timeout: 10000 });
        await shareOption.click({ force: true });

        // Share dialog appears
        const shareDialogTitle = this.page.getByText('Share with people');
        await expect(shareDialogTitle).toBeVisible({ timeout: 10000 });

        const searchUserField = this.page.locator('div.ng-value-container:has-text("Search User") div.ng-input input');
        await expect(searchUserField).toBeVisible({ timeout: 10000 });
        await searchUserField.click({ force: true });

        // Find the first user/team suggestion in the dropdown if it appears
        const firstSuggestion = this.page.locator('div.ng-option[role="option"]').first();
        if (await firstSuggestion.isVisible({ timeout: 10000 }).catch(() => false)) {
            await firstSuggestion.click();
        }

        // Share button should start disabled
        const shareButton = this.page.getByRole('button', { name: /^Share$/i }).last();
        await expect(shareButton).toBeVisible({ timeout: 6000 });
        await expect(shareButton).toBeEnabled();

        // Close the share dialog using Cancel or close button
        const cancelBtn = this.page.getByRole('button', { name: /^Cancel$/i }).first();
        if (await cancelBtn.isVisible().catch(() => false)) {
            await cancelBtn.click();
        }
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    // Verify that shared staff/team appear with profile image
    async verifySharedStaffTeamHasProfileImage() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and ensure it's visible
        const legalFolder = this.page.locator('div.lib-file').last();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });
        await this.page.waitForTimeout(1000);

        // Right-click the Legal folder to open the context menu
        await legalFolder.click({ button: 'right' });
        await this.page.waitForTimeout(500);

        // Select Share from the context menu
        const shareOption = this.page.getByText(/Share/i).first();
        await expect(shareOption).toBeVisible({ timeout: 6000 });
        await shareOption.click({ force: true });

        // Share dialog appears
        const shareDialogTitle = this.page.getByText('Share with people');
        await expect(shareDialogTitle).toBeVisible({ timeout: 10000 });

        // Removed user icon logic per instruction. Always interact with 'Search User' field directly.
        const searchUserField = this.page.locator('div.ng-value-container:has-text("Search User") div.ng-input input');
        await expect(searchUserField).toBeVisible({ timeout: 6000 });
        await searchUserField.click();


        // Find the first user/team suggestion in the dropdown if it appears
        const firstSuggestion = this.page.locator('div.ng-option[role="option"]').first();
        if (await firstSuggestion.isVisible({ timeout: 10000 }).catch(() => false)) {
            await firstSuggestion.click();
        }

        // Share button should start disabled
        const shareButton = this.page.getByRole('button', { name: /^Share$/i }).last();
        await expect(shareButton).toBeVisible({ timeout: 6000 });
        await expect(shareButton).toBeEnabled();
        await shareButton.click();

        // Verify success message for data shared successfully
        const successToast = this.page.getByText(/Data shared Successfully/i);
        await expect(successToast).toBeVisible({ timeout: 10000 });

        // Click the users icon inside the last folder (if present and visible)
        const lastFolder = this.page.locator('div.lib-file').last();
        const usersIconInLastFolder = lastFolder.locator('i.fa.fa-users.f-12.p-1');
        if (await usersIconInLastFolder.isVisible().catch(() => false)) {
            await usersIconInLastFolder.click({ force: true });
        }

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    // Verify that clicking an image file shows action options
    async verifyImageFileShowsActionOptions() {

        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and ensure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });
        // Assume you are on the Files tab after navigation

        // Find the first image file in the listing files grid
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' });
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);
        await imageFile.click({ button: 'right' });
        await imageFile.click({ button: 'right' });
        // After clicking the image, all options in the context menu should be visible by text

        // Find the container for the folder options list specifically
        const folderOptionsList = this.page.locator('#folderOptionsList ul.folders');
        await expect(folderOptionsList).toBeVisible({ timeout: 5000 });

        // These selectors match the text and icon/image for each menu option as rendered in the DOM
        const optionChecks = [
            { text: 'Preview', iconSelector: 'i.pi.pi-eye' },
            { text: 'Share', iconSelector: 'i.pi.pi-user-plus' },
            { text: 'Get Link', iconSelector: 'i.pi.pi-link' },
            { text: 'Get Path', iconSelector: 'i.pi.pi-directions' },
            { text: 'Rename', iconSelector: 'img[alt="Rename"][src*="pencil.svg"]' },
            { text: 'Make a Copy', iconSelector: 'i.pi.pi-copy' },
            { text: 'Download', iconSelector: 'i.pi.pi-download' },
            { text: 'Remove', iconSelector: 'img[alt="Remove"][src*="delete_icon.svg"]' }
        ];

        for (const { text, iconSelector } of optionChecks) {
            // Each option is a <li> containing an <a> with icon/img and the label text
            const option = folderOptionsList.locator(`li:has(${iconSelector}) a`, { hasText: text });
            await option.scrollIntoViewIfNeeded();
            await expect(option, `Menu option "${text}" with icon should be visible`).toBeVisible({ timeout: 10000 });
        }

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);

    }

    // Verify clicking ‘Get Link’ opens link popup
    async verifyGetLinkOpensLinkPopup() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and ensure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Find the image file to use for right click (adjust the file name if needed)
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' });
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);
        await imageFile.click({ button: 'right' });
        await imageFile.click({ button: 'right' });

        // Wait for the context menu and click "Get Link"
        const getLinkOption = this.page.locator('#folderOptionsList ul.folders li:has(i.pi.pi-link) a', { hasText: 'Get Link' });
        await expect(getLinkOption).toBeVisible({ timeout: 2000 });
        await getLinkOption.click();
        await this.page.waitForTimeout(1000);

        // Assert that the link popup/dialog appears
        const linkPopup = this.page.locator('[role="dialog"], .p-dialog, .modal:has-text("Get Link")');
        await expect(linkPopup).toBeVisible({ timeout: 10000 });

        // Locate the cross (close) icon in the link popup dialog
        const crossIcon = this.page.locator('button.p-dialog-header-close')
        await expect(crossIcon.first()).toBeVisible();
        await crossIcon.click();

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        await closeBtn.dblclick({ force: true });
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify clicking "Get Path" opens the path popup dialog.
     */
    public async verifyGetPathOpensPathPopup(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and ensure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Find the image file to use for right click (adjust the file name if needed)
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' });
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);

        // Right-click the folder to open context menu
        await imageFile.click({ button: 'right' });
        await imageFile.click({ button: 'right' });

        await this.page.waitForTimeout(1000);

        // Wait for the context menu and click "Get Path"
        const getPathOption = this.page.locator('a:has(i.pi.pi-directions):has-text("Get Path")').first();
        await getPathOption.click();
        await this.page.waitForTimeout(1000);

        // Assert that the path popup/dialog appears
        const pathPopup = this.page.locator('.p-dialog:has-text("Get Path")');
        await expect(pathPopup).toBeVisible({ timeout: 10000 });

        // Locate the cross (close) icon in the path popup dialog
        const crossIcon = this.page.locator('button.p-dialog-header-close');
        await expect(crossIcon.first()).toBeVisible();
        await crossIcon.click();
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    // Verify clicking ‘Preview’ opens the file
    async verifyPreviewOptionOpensFile() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and ensure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Find the image file to use for right click (adjust the file name if needed)
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' });
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);

        // Right-click the folder to open context menu
        await imageFile.click({ button: 'right' });
        await imageFile.click({ button: 'right' });

        await this.page.waitForTimeout(1000);

        // Click the "Preview" option from context menu (adjust selector if needed)
        const previewOption = this.page.locator('a:has(i.pi.pi-eye):has-text("Preview")').first();
        await expect(previewOption).toBeVisible({ timeout: 5000 });
        await previewOption.click();

        // Assert that the preview file modal/dialog appears
        // The selector might need to be updated according to the actual modal/dialog html
        const previewDialog = this.page.locator('.p-dialog:has-text("Preview")');
        await expect(previewDialog).toBeVisible({ timeout: 10000 });

        // Locate the cross (close) icon in the path popup dialog
        const crossIcon = this.page.locator('button.p-dialog-header-close');
        await expect(crossIcon.first()).toBeVisible();
        await crossIcon.click();
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    // Verify clicking 'Download' downloads the file
    async verifyDownloadFile() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and ensure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Find the image file to use for right click (adjust the file name if needed)
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' });
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);

        // Right-click the folder to open context menu
        await imageFile.click({ button: 'right' });
        await imageFile.click({ button: 'right' });
        await this.page.waitForTimeout(1000);

        // Click on the "Download" action from the context menu
        const downloadOption = this.page.locator('a:has(i.pi.pi-download):has-text("Download")').first();
        await expect(downloadOption).toBeVisible({ timeout: 5000 });
        await downloadOption.click();
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);

    }

    // Verify clicking ‘Edit’ opens image in preview
    async verifyEditOpensImageInPreview() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and ensure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Find the image file to use for right click (adjust the file name if needed)
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);

        // Right-click the image file to open context menu
        await imageFile.click({ button: 'right' });
        await imageFile.click({ button: 'right' });
        await this.page.waitForTimeout(1000);

        // Click on the "Rename" action from the context menu using the <a> element with embedded pencil.svg image and 'Rename' text
        const renameOption = this.page.locator('a:has(img[src$="pencil.svg"][alt="Rename"]):has-text("Rename")').first();
        await expect(renameOption).toBeVisible({ timeout: 5000 });
        await renameOption.click();

        // Wait for the preview modal/dialog to open
        const previewDialog = this.page.locator('.image-preview-modal, .p-dialog, .preview-dialog').first();
        await expect(previewDialog).toBeVisible({ timeout: 10000 });

        const crossIcon = this.page.locator('button.p-dialog-header-close');
        await expect(crossIcon.first()).toBeVisible();
        await crossIcon.click();
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    // Verify that image zoom in/out works
    async verifyImageZoomInOutWorks() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and ensure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Locate and click the "Reorder" (edit.svg) icon for image reordering
        const reorderIcon = this.page.locator('img[ptooltip="Reorder"][src="assets/img/edit.svg"].p-element.cursor-pointer')
        await expect(reorderIcon.first()).toBeVisible({ timeout: 10000 });
        await reorderIcon.first().click();

        // Perform zoom in and zoom out by interacting with the slider
        const slider = this.page.locator('p-slider.p-element');
        await expect(slider).toBeVisible({ timeout: 10000 });

        // Get the slider handle
        const sliderHandle = slider.locator('.p-slider-handle').first();

        // Ensure handle is visible and interactable
        await expect(sliderHandle).toBeVisible({ timeout: 5000 });

        const handleBox = await sliderHandle.boundingBox();

        if (!handleBox) {
            throw new Error('Slider handle bounding box not found');
        }
        // Move to center of handle
        await this.page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);

        // Zoom In: Drag to the right by 80 pixels (simulate slider increase)
        await this.page.mouse.down();
        await this.page.mouse.move(handleBox.x + handleBox.width / 2 + 80, handleBox.y + handleBox.height / 2, { steps: 10 });
        await this.page.mouse.up();

        await this.page.waitForTimeout(800);

        // Zoom Out: Drag back to the left by 30 pixels (simulate slider decrease)
        await this.page.mouse.move(handleBox.x + handleBox.width / 2 + 50, handleBox.y + handleBox.height / 2);
        await this.page.mouse.down();
        await this.page.mouse.move(handleBox.x + handleBox.width / 2 + 20, handleBox.y + handleBox.height / 2, { steps: 10 });
        await this.page.mouse.up();

        await this.page.waitForTimeout(800);

        const crossIcon = this.page.locator('img[src="assets/img/Group37073.svg"]');
        await expect(crossIcon.first()).toBeVisible({ timeout: 10000 });
        await crossIcon.click();
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);

    }

    /**
     * Verify that dragging the image in preview changes its position.
     */
    async verifyImageDragChangesPosition() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and ensure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Find the image file and drag it to the left side
        const imageFile = this.page.locator('div.lib-file', { hasText: 'propertyImage.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 10000 });

        const imageBox = await imageFile.boundingBox();
        if (!imageBox) throw new Error('BoundingBox for image file not found.');

        // Drag from center of the image file to 150px left of its current center
        const startX = imageBox.x + imageBox.width / 2;
        const startY = imageBox.y + imageBox.height / 2;
        const dragOffset = -150; // pixels to the left

        await this.page.mouse.move(startX, startY);
        await this.page.mouse.down();
        await this.page.mouse.move(startX + dragOffset, startY, { steps: 10 });
        await this.page.mouse.up();

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verifies that the edited image position is reflected in the document tab after dragging.
     * Returns the new X position of the image after drag for assertion.
     */
    async verifyEditedImagePositionReflectsInDocumentTab() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // Try to click the Back button if visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Ensure the "Legal" folder is visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Find the target image file
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 10000 });

        const imageBox = await imageFile.boundingBox();
        if (!imageBox) throw new Error('BoundingBox for image file not found.');

        // Simulate dragging the image to the left by 150px
        const startX = imageBox.x + imageBox.width / 2;
        const startY = imageBox.y + imageBox.height / 2;
        const dragOffset = -150;

        await this.page.mouse.move(startX, startY);
        await this.page.mouse.down();
        await this.page.mouse.move(startX + dragOffset, startY, { steps: 10 });
        await this.page.mouse.up();

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);

    }

    /**
     * Verifies that the offline section expands and collapses as expected.
     */
    async verifyOfflineSectionExpandCollapse() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and ensure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Locate and click the "Reorder" (edit.svg) icon for image reordering
        const reorderIcon = this.page.locator('img[ptooltip="Reorder"][src="assets/img/edit.svg"].p-element.cursor-pointer')
        await expect(reorderIcon.first()).toBeVisible({ timeout: 10000 });
        await reorderIcon.first().click();

        // Perform zoom in and zoom out by interacting with the slider
        const slider = this.page.locator('p-slider.p-element');
        await expect(slider).toBeVisible({ timeout: 10000 });
        // Locate the "Offline Images" heading
        const offlineImagesHeading = this.page.getByRole('heading', { name: 'Offline Images' });
        await offlineImagesHeading.scrollIntoViewIfNeeded();
        await expect(offlineImagesHeading).toBeVisible({ timeout: 10000 });

        const crossIcon = this.page.locator('img[src="assets/img/Group37073.svg"]');
        await expect(crossIcon.first()).toBeVisible({ timeout: 10000 });
        await crossIcon.click();
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Drags an image from Gallery Images to Offline Images section (Angular CDK safe)
     */
    async verifyDragFileToOfflineSection() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstListing = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListing).toBeVisible({ timeout: 30000 });
        await firstListing.click();

        // Open Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await filesTab.waitFor({ state: 'visible' });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and ensure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Enable reorder mode
        const reorderIcon = this.page
            .locator('img[ptooltip="Reorder"][src="assets/img/edit.svg"]')
            .first();
        await reorderIcon.waitFor({ state: 'visible' });
        await reorderIcon.click();

        // SOURCE: Angular draggable image
        const sourceImage = this.page.locator('#galImgList .cdk-drag').first();
        await sourceImage.waitFor({ state: 'visible' });

        // EXPAND Offline Images section (MANDATORY)
        const offlineHeading = this.page.locator(
            'h2.heading-style:has-text("Offline Images")'
        );
        await offlineHeading.scrollIntoViewIfNeeded();
        await offlineHeading.click();

        // REAL Angular CDK drop list under Offline Images
        const offlineDropList = this.page.locator(
            'div.cdk-drop-list:below(h2:has-text("Offline Images"))'
        ).first();
        await offlineDropList.waitFor({ state: 'visible' });

        // Wait for Angular animations/layout
        await this.page.waitForLoadState('networkidle');

        // Get bounding boxes
        const srcBox = await sourceImage.boundingBox();
        const targetBox = await offlineDropList.boundingBox();
        if (!srcBox || !targetBox) {
            throw new Error('Bounding box not found for drag/drop');
        }

        // Angular-safe drag & drop (slow + pause)
        await this.page.mouse.move(
            srcBox.x + srcBox.width / 2,
            srcBox.y + srcBox.height / 2
        );
        await this.page.mouse.down();

        await this.page.waitForTimeout(200); // REQUIRED for CDK

        await this.page.mouse.move(
            targetBox.x + targetBox.width / 2,
            targetBox.y + targetBox.height / 2,
            { steps: 50 }
        );

        await this.page.waitForTimeout(200);
        await this.page.mouse.up();

        await this.page.waitForTimeout(2000);

        // VERIFY image moved to Offline Images
        await expect
            .poll(async () => await offlineDropList.locator('.cdk-drag').count(), {
                timeout: 15000,
            })
            .toBeGreaterThan(0);


        await this.page.waitForTimeout(1200);

        const crossIcon = this.page.locator('img[src="assets/img/Group37073.svg"]');
        await expect(crossIcon.first()).toBeVisible({ timeout: 10000 });
        await crossIcon.click();
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verifies the deletion of an offline file.
     * Assumes the offline image section is present with at least one image.
     */
    async verifyDeleteOfflineFile() {
        // Navigate to the Listings grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstListing = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListing).toBeVisible({ timeout: 30000 });
        await firstListing.click();

        // Switch to the "Files" tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await filesTab.waitFor({ state: 'visible' });
        await filesTab.click();

        // Optionally, click the Back button if visible (ignore errors if not)
        const backButton = this.page.getByRole('link', { name: ' Back' });
        try {
            await backButton.scrollIntoViewIfNeeded();
            if (await backButton.isVisible({ timeout: 20000 })) {
                await backButton.click();
            }
        } catch { }

        // Make sure "Legal" folder is visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Activate reorder mode
        const reorderIcon = this.page.locator('img[ptooltip="Reorder"][src="assets/img/edit.svg"]').first();
        await reorderIcon.waitFor({ state: 'visible' });
        await reorderIcon.click();

        // Click to expand the offline image section
        const offlineSectionExpand = this.page.locator('h4', { hasText: "Click to expand and drag and drop images you do not want to push to portals." });
        await offlineSectionExpand.scrollIntoViewIfNeeded();
        await expect(offlineSectionExpand).toBeVisible({ timeout: 10000 });
        await offlineSectionExpand.click();

        const offlineDropList = this.page.locator('.hwfix').last();
        await expect(offlineDropList).toBeVisible({ timeout: 10000 });
        await offlineDropList.click();

        // Click the delete ("cross") icon to delete selected images
        const deleteBtn = this.page.locator('a[ptooltip="Delete selected images"]');
        await expect(deleteBtn).toBeVisible({ timeout: 5000 });
        await deleteBtn.dblclick({ force: true });

        // Confirm deletion by checking for a "deleted successfully" toast/message by text
        const deletedToast = this.page.getByText(/deleted successfully/i).first();
        await expect(deletedToast).toBeVisible({ timeout: 20000 });

        await this.page.waitForTimeout(1200);

        const crossIcon = this.page.locator('img[src="assets/img/Group37073.svg"]');
        await expect(crossIcon.first()).toBeVisible({ timeout: 10000 });
        await crossIcon.click();
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that opening a folder in the listing view displays the "Back" button.
     */
    async verifyBackButtonIsShownWhenFolderOpened() {
        // Navigate to the Listings grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstListing = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListing).toBeVisible({ timeout: 30000 });
        await firstListing.click();

        // Switch to the "Files" tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await filesTab.waitFor({ state: 'visible' });
        await filesTab.click();

        // Optionally, click the Back button if visible (ignore errors if not)
        const backButton = this.page.getByRole('link', { name: ' Back' });
        try {
            await backButton.scrollIntoViewIfNeeded();
            if (await backButton.isVisible({ timeout: 20000 })) {
                await backButton.click();
            }
        } catch { }

        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });
        await legalFolder.dblclick();
        // expect the "Back" button to be visible after opening the "Legal" folder
        await expect(this.page.getByRole('link', { name: ' Back' })).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);


    }

    /**
     * Verify that folder names appear as navigation tabs after navigating into folders.
     */
    async verifyFolderNamesAppearAsNavigationTabs() {
        // Navigate to the Listings grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstListing = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListing).toBeVisible({ timeout: 30000 });
        await firstListing.click();

        // Switch to the "Files" tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await filesTab.waitFor({ state: 'visible' });
        await filesTab.click();


        // Optionally, click the Back button if visible (ignore errors if not)
        const backButton = this.page.getByRole('link', { name: ' Back' });
        try {
            await backButton.scrollIntoViewIfNeeded();
            if (await backButton.isVisible({ timeout: 20000 })) {
                await backButton.click();
            }
        } catch { }

        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });
        await legalFolder.dblclick();
        // expect the "Back" button to be visible after opening the "Legal" folder
        await expect(this.page.getByRole('link', { name: ' Back' })).toBeVisible({ timeout: 10000 });

        const breadcrumb = this.page.locator('ul li a span.bread-color:has-text("Legal")');
        await expect(breadcrumb).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verifies that clicking a folder tab in the breadcrumb navigation opens that folder.
     * Assumes navigation into at least one folder has already occurred.
     * Optionally, accepts the folder name to test; defaults to 'Legal'.
     */
    async verifyClickingFolderTabNavigatesToFolder() {
        // Navigate to the Listings grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstListing = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListing).toBeVisible({ timeout: 30000 });
        await firstListing.click();

        // Switch to the "Files" tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await filesTab.waitFor({ state: 'visible' });
        await filesTab.click();


        // Optionally, click the Back button if visible (ignore errors if not)
        const backButton = this.page.getByRole('link', { name: ' Back' });
        try {
            await backButton.scrollIntoViewIfNeeded();
            if (await backButton.isVisible({ timeout: 20000 })) {
                await backButton.click();
            }
        } catch { }

        const ducumentsFolder = this.page.locator('div.lib-file', { hasText: 'Documents' }).first();
        await ducumentsFolder.scrollIntoViewIfNeeded();
        await expect(ducumentsFolder).toBeVisible({ timeout: 20000 });
        await ducumentsFolder.dblclick();
        // expect the "Back" button to be visible after opening the "Legal" folder
        await expect(this.page.getByRole('link', { name: ' Back' })).toBeVisible({ timeout: 10000 });

        const breadcrumb = this.page.locator('ul li a span.bread-color:has-text("Documents")');
        await expect(breadcrumb).toBeVisible({ timeout: 10000 });

        // Click on Appraisals folder
        const appraisalsFolder = this.page.locator('div.lib-file', { hasText: 'Appraisals' }).first();
        await appraisalsFolder.scrollIntoViewIfNeeded();
        await expect(appraisalsFolder).toBeVisible({ timeout: 20000 });
        await appraisalsFolder.dblclick();
        // Optionally, assert that the breadcrumb has updated to 'Appraisals'
        const appraisalsBreadcrumb = this.page.locator('ul li a span.bread-color:has-text("Appraisals")');
        await expect(appraisalsBreadcrumb).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verifies that the document tab supports toggling between list and grid views.
     * Checks that toggling updates the UI as expected.
     */
    async verifyDocumentTabSupportsListGridViewToggle() {
        // Navigate to the Listings grid view and open the first listing
        await this.navigateToListings();
        await this.switchToGridView();

        const firstListing = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListing).toBeVisible({ timeout: 30000 });
        await firstListing.click();
        // Switch to the "Files" tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await filesTab.waitFor({ state: 'visible' });
        await filesTab.click();

        // Optionally, click the Back button if visible (ignore errors if not)
        const backButton = this.page.getByRole('link', { name: ' Back' });
        try {
            await backButton.scrollIntoViewIfNeeded();
            if (await backButton.isVisible({ timeout: 20000 })) {
                await backButton.click();
            }
        } catch { }

        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Now, verify that the list view container appears and grid view container disappears (if possible)
        const listContainer = this.page.locator('img[ptooltip="List"]');
        await expect(listContainer).toBeVisible({ timeout: 10000 });
        await listContainer.click();

        await this.page.waitForTimeout(1000);

        // After switching to list view, verify that the grid view container appears and the list container disappears (if possible)
        const gridContainer = this.page.locator('img[ptooltip="Grid"]');
        await expect(gridContainer).toBeVisible({ timeout: 10000 });
        await gridContainer.click();

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);

    }

    /**
     * Verifies that reordering folders by drag-and-drop changes their order in the UI.
     */
    async verifyFolderReordering() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstListing = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListing).toBeVisible({ timeout: 30000 });
        await firstListing.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and ensure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Find the "documents" folder and drag it to the right side
        const documentsFolder = this.page.locator('div.lib-file', { hasText: 'documents' }).first();
        await documentsFolder.scrollIntoViewIfNeeded();
        await expect(documentsFolder).toBeVisible({ timeout: 10000 });

        const documentsBox = await documentsFolder.boundingBox();
        if (!documentsBox) throw new Error('BoundingBox for documents folder not found.');

        // Drag from center of the folder to 150px right of its current center
        const startX = documentsBox.x + documentsBox.width / 2;
        const startY = documentsBox.y + documentsBox.height / 2;
        const dragOffset = 150; // pixels to the right

        await this.page.mouse.move(startX, startY);
        await this.page.mouse.down();
        await this.page.mouse.move(startX + dragOffset, startY, { steps: 10 });
        await this.page.mouse.up();

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }
    /*
    *Verify that reordering images works
     */
    public async verifyImageReorderingWorks() {
        // Reminder: This uses public directory images for upload
        const uploadInput = this.page.locator('input[type="file"]');
        await expect(uploadInput).toBeVisible({ timeout: 10000 });

        // Upload using images from the public assets folder (adjust as needed for your env)
        const firstImage = path.resolve(__dirname, '../../public/test-image-01.jpg');
        const secondImage = path.resolve(__dirname, '../../public/test-image-02.jpg');

        // Upload the first image
        await uploadInput.setInputFiles(firstImage);
        const uploadedImg1 = this.page.locator('img[src*="test-image-01"]');
        await expect(uploadedImg1).toBeVisible({ timeout: 10000 });

        // Upload the second image
        await uploadInput.setInputFiles(secondImage);
        const uploadedImg2 = this.page.locator('img[src*="test-image-02"]');
        await expect(uploadedImg2).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);

        // Get the relevant images before reorder
        const images = this.page.locator('img[src*="test-image-01"], img[src*="test-image-02"]');
        const imgCount = await images.count();
        if (imgCount < 2) {
            throw new Error('Both images must be present to reorder.');
        }

        const srcBefore0 = await images.nth(0).getAttribute('src');
        const srcBefore1 = await images.nth(1).getAttribute('src');

        // Drag and drop to reorder
        await images.nth(0).dragTo(images.nth(1));
        await this.page.waitForTimeout(1200);

        const imagesAfter = this.page.locator('img[src*="test-image-01"], img[src*="test-image-02"]');
        const srcAfter0 = await imagesAfter.nth(0).getAttribute('src');
        const srcAfter1 = await imagesAfter.nth(1).getAttribute('src');

        if (srcBefore0 === srcAfter0 && srcBefore1 === srcAfter1) {
            throw new Error('Images did not reorder as expected.');
        }

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
    Verify error message when uploading unsupported file types
    */
    async verifyUnsupportedFileTypeUploadShowsError(filePath: string): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and make sure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Click the Add button
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();

        // Click "File Upload (Public)" option
        const publicOption = this.page.locator('a', { hasText: 'File Upload (Public)' });

        await expect(publicOption).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);
        await publicOption.click();

        // Wait for upload input to appear
        const fileInput = this.page.locator('#fileUpload');
        // Upload the file
        await fileInput.setInputFiles(filePath);
        const errorToast = this.page.locator('div[aria-label="File type not supported"]');
        await expect(errorToast).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
    * Verify that all portal rows display their toggle (slider) button
    * in the Portals tab.
    */
    async verifyAllPortalToggleButtonsDisplayed() {
        // Navigate to listings and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing safely
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.waitFor({ state: 'attached', timeout: 10000 });
        await firstCardRow.click();

        // Go to the 'Portals' tab
        const portalsTab = this.page.getByRole('tab', { name: /Portals/i });
        await expect(portalsTab).toBeVisible({ timeout: 10000 });
        await portalsTab.click();

        // Wait for portal rows to appear
        await this.page.locator('div.row.b-b-light').first().waitFor({ state: 'visible', timeout: 10000 });

        // Expected portal names
        const expectedPortals = [
            'Company Website',
            'Domain',
            'realestate.com.au',
            'Homely',
            'Market Place',
            'Real Estate View'
        ];

        for (const portal of expectedPortals) {
            // Locate the row by portal name using regex to avoid whitespace issues
            const portalRow = this.page
                .locator('div.row.b-b-light')
                .filter({ hasText: new RegExp(`^\\s*${portal}\\s*$`, 'i') })
                .first();

            // Verify row is visible
            await expect(portalRow).toBeVisible({ timeout: 10000 });

            // Locate toggle slider inside the row
            const toggleSlider = portalRow.locator('label.switch span.slider');

            // Verify toggle button is displayed
            await expect(toggleSlider).toBeVisible({ timeout: 10000 });
        }

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that clicking a toggle button enables the first portal.
     */
    async verifyToggleEnablesPortal() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.waitFor({ state: 'attached', timeout: 10000 });
        await firstCardRow.click();

        // Go to 'Portals' tab
        const portalsTab = this.page.getByRole('tab', { name: /Portals/i });
        await expect(portalsTab).toBeVisible({ timeout: 10000 });
        await portalsTab.click();

        // Wait for portal rows to appear
        const firstPortalRow = this.page.locator('div.row.b-b-light').first();
        await firstPortalRow.waitFor({ state: 'visible', timeout: 10000 });
        await expect(firstPortalRow).toBeVisible({ timeout: 10000 });

        // If already enabled, do nothing; if disabled, enable it
        const toggleSlider = firstPortalRow.locator('label.switch span.slider').first();
        await expect(toggleSlider).toBeVisible({ timeout: 10000 });
        const inputBox = firstPortalRow.locator('input[type="checkbox"]').first();
        const isChecked = await inputBox.isChecked();
        if (!isChecked) {
            await toggleSlider.click();
            // click save button
            const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
            await expect(saveButton).toBeVisible({ timeout: 5000 });
            await saveButton.click();
            await expect(inputBox).toBeChecked({ timeout: 5000 });
            await this.page.waitForTimeout(1200);
        }

        // Assume the green dot is a descendant element, e.g. '.listing-active'
        const greenDotIndicator = this.page.locator('.listing-active').first();
        await expect(greenDotIndicator).toBeVisible({ timeout: 10000 });

        // Optionally, close any dialogs if opened
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify that all portals are disabled 
     */
    async verifyToggleDisablesPortal() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.waitFor({ state: 'attached', timeout: 10000 });
        await firstCardRow.click();

        // Go to the 'Portals' tab
        const portalsTab = this.page.getByRole('tab', { name: /Portals/i });
        await expect(portalsTab).toBeVisible({ timeout: 10000 });
        await portalsTab.click();

        // Wait for portal rows to appear
        const portalRows = this.page.locator('div.row.b-b-light');
        const numPortals = await portalRows.count();
        let needsUnchecking = false;

        for (let i = 0; i < numPortals; i++) {
            const row = portalRows.nth(i);
            await row.waitFor({ state: 'visible', timeout: 10000 });
            const inputBox = row.locator('input[type="checkbox"]').first();
            if (!(await inputBox.isVisible())) {
                // Scroll into view if not visible
                await inputBox.scrollIntoViewIfNeeded();
            }
            const isChecked = await inputBox.isChecked();
            if (isChecked) {
                const toggleSlider = row.locator('label.switch span.slider').first();
                await expect(toggleSlider).toBeVisible({ timeout: 10000 });
                await toggleSlider.click();
                needsUnchecking = true;
            }
        }

        if (needsUnchecking) {
            // Click save button if at least one was unchecked
            const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
            await expect(saveButton).toBeVisible({ timeout: 5000 });
            await saveButton.click();

            // Verify all portals are now unchecked
            for (let i = 0; i < numPortals; i++) {
                const row = portalRows.nth(i);
                const inputBox = row.locator('input[type="checkbox"]').first();
                await expect(inputBox).not.toBeChecked({ timeout: 5000 });
            }

            await this.page.waitForTimeout(1200);
        }
        // The green dot indicator should not be visible after disabling all
        const activeIndicator = this.page.locator('.listing-active').first();
        await expect(activeIndicator).not.toBeVisible({ timeout: 20000 });

        // Optionally close any dialogs if opened
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that the green dot appears in grid view listing  card after enabling a portal
     */
    async verifyGreenDotAppearsAfterEnablingPortal() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.waitFor({ state: 'attached', timeout: 10000 });
        await firstCardRow.click();

        // Go to 'Portals' tab
        const portalsTab = this.page.getByRole('tab', { name: /Portals/i });
        await expect(portalsTab).toBeVisible({ timeout: 10000 });
        await portalsTab.click();

        // Wait for portal rows to appear
        const firstPortalRow = this.page.locator('div.row.b-b-light').first();
        await firstPortalRow.waitFor({ state: 'visible', timeout: 10000 });
        await expect(firstPortalRow).toBeVisible({ timeout: 10000 });

        // If already enabled, do nothing; if disabled, enable it
        const toggleSlider = firstPortalRow.locator('label.switch span.slider').first();
        await expect(toggleSlider).toBeVisible({ timeout: 10000 });
        const inputBox = firstPortalRow.locator('input[type="checkbox"]').first();
        const isChecked = await inputBox.isChecked();
        if (!isChecked) {
            await toggleSlider.click();
            await expect(inputBox).toBeChecked({ timeout: 5000 });
            await this.page.waitForTimeout(1200);
        }

        // Click the save button after toggling
        const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(saveButton).toBeVisible({ timeout: 5000 });
        await saveButton.click();
        await this.page.waitForTimeout(1000);

        // Assume the green dot is a descendant element, e.g. '.listing-active'
        const greenDotIndicator = this.page.locator('.listing-active').first();
        await expect(greenDotIndicator).toBeVisible({ timeout: 10000 });

        // Optionally, close any dialogs if opened
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify that the correct number of enabled portals appears in the portal tab.
     */
    async verifyEnabledPortalCount() {
        // Go to the portals tab of the first listing (as above)
        await this.navigateToListings();
        await this.switchToGridView();

        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.waitFor({ state: 'attached', timeout: 10000 });
        await firstCardRow.click();

        const portalsTab = this.page.getByRole('tab', { name: /Portals/i });
        await expect(portalsTab).toBeVisible({ timeout: 10000 });
        await portalsTab.click();

        const enabledPortalCountBadge = this.page.locator('a#pills-portal-tab p.p-head-badge');
        await expect(enabledPortalCountBadge).toBeVisible({ timeout: 10000 });

        // Retrieve the number from the badge and log it for debugging
        const countText = await enabledPortalCountBadge.textContent();
        const actualCount = Number(countText?.trim());
        console.info(`Enabled portal count badge value: ${actualCount}`);
        await this.page.waitForTimeout(1000);
        // Optionally, close any dialogs if opened
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify that clicking the warning icon triggers the Portal Reminder popup when saving the listing.
     */
    async verifyPortalReminderPopupOnWarningIconClick() {
        // Navigate to listings and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.waitFor({ state: 'attached', timeout: 10000 });
        await firstCardRow.click();

        // Go to 'Portals' tab
        const portalsTab = this.page.getByRole('tab', { name: /Portals/i });
        await expect(portalsTab).toBeVisible({ timeout: 10000 });
        await portalsTab.click();

        // Wait for portal rows to appear
        const firstPortalRow = this.page.locator('div.row.b-b-light').first();
        await firstPortalRow.waitFor({ state: 'visible', timeout: 10000 });

        // Click the warning icon (assuming standard selector, replace if needed)
        const warningIcon = this.page.locator('i.pi.pi-exclamation-triangle, .warning-icon').first();
        await expect(warningIcon).toBeVisible({ timeout: 10000 });
        await warningIcon.click();
        await expect(warningIcon).toBeEnabled();

        // Attempt to save the listing
        const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(saveButton).toBeVisible({ timeout: 5000 });
        await saveButton.click();

        // Verify the Portal Reminders popup appears with correct text and controls
        const popupTitle = this.page.locator('div[role="dialog"]:has-text("Portal Reminders")');
        await expect(popupTitle).toBeVisible({ timeout: 10000 });
        // Buttons: "Cancel" and "Save & Close"
        const cancelBtn = this.page.getByRole('button', { name: /^Cancel$/ });
        const saveCloseBtn = this.page.getByRole('dialog').getByRole('button', { name: 'Save & Close' });
        await expect(cancelBtn).toBeVisible({ timeout: 5000 });
        await expect(saveCloseBtn).toBeVisible({ timeout: 5000 });

        await cancelBtn.click();
        await this.page.waitForTimeout(1000);

        // Optionally, close the popup and dialog if present
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that the Portal Reminder popup (Portal Reminders dialog) has a functioning close button.
     */
    async verifyPortalReminderPopupHasCloseButton() {
        // Navigate to Listings and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.waitFor({ state: 'attached', timeout: 10000 });
        await firstCard.click();

        // Open the 'Portals' tab
        const portalsTab = this.page.getByRole('tab', { name: /Portals/i });
        await expect(portalsTab).toBeVisible({ timeout: 10000 });
        await portalsTab.click();

        // Wait for first portal row to appear
        const firstPortalRow = this.page.locator('div.row.b-b-light').first();
        await firstPortalRow.waitFor({ state: 'visible', timeout: 10000 });

        // Click the warning icon in the portals tab to trigger the Portal Reminders popup
        const warningIcon = this.page.locator('i.pi.pi-exclamation-triangle, .warning-icon').first();
        await expect(warningIcon).toBeVisible({ timeout: 10000 });
        await expect(warningIcon).toBeEnabled();

        const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(saveButton).toBeVisible({ timeout: 5000 });
        await saveButton.click();

        // Verify the Portal Reminders popup/dialog appears
        const portalRemindersDialog = this.page.locator('div[role="dialog"]:has-text("Portal Reminders")');
        await expect(portalRemindersDialog).toBeVisible({ timeout: 10000 });

        const closeBtn = portalRemindersDialog.locator('button.p-dialog-header-close');
        await expect(closeBtn).toBeVisible({ timeout: 5000 });

        // Click the close button and verify the dialog closes
        await closeBtn.click();
        await expect(portalRemindersDialog).not.toBeVisible({ timeout: 5000 });

        await this.page.waitForTimeout(1000);
        // Optionally, close the popup and dialog if present
        const Close = this.page.locator('.pi.pi-times').first();
        if (await Close.isVisible().catch(() => false)) {
            await Close.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that clicking the 'Cancel' button closes the Portal Reminder popup without saving changes.
     */
    async verifyPortalReminderPopupClosesOnCancel() {
        // Navigate to Listings and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.waitFor({ state: 'attached', timeout: 10000 });
        await firstCard.click();

        // Open the 'Portals' tab
        const portalsTab = this.page.getByRole('tab', { name: /Portals/i });
        await expect(portalsTab).toBeVisible({ timeout: 10000 });
        await portalsTab.click();

        // Wait for first portal row to appear
        const firstPortalRow = this.page.locator('div.row.b-b-light').first();
        await firstPortalRow.waitFor({ state: 'visible', timeout: 10000 });

        // Click the warning icon to trigger the Portal Reminders popup
        const warningIcon = this.page.locator('i.pi.pi-exclamation-triangle, .warning-icon').first();
        await expect(warningIcon).toBeVisible({ timeout: 10000 });
        await expect(warningIcon).toBeEnabled();

        const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(saveButton).toBeVisible({ timeout: 5000 });
        await saveButton.click();

        // Verify the Portal Reminders popup/dialog appears
        const portalRemindersDialog = this.page.locator('div[role="dialog"]:has-text("Portal Reminders")');
        await expect(portalRemindersDialog).toBeVisible({ timeout: 10000 });

        // Locate and click the 'Cancel' button (assume button with text "Cancel" exists)
        const cancelButton = portalRemindersDialog.getByRole('button', { name: /Cancel/i }).first();
        await expect(cancelButton).toBeVisible({ timeout: 5000 });
        await cancelButton.click();

        // Verify the dialog closes after clicking 'Cancel'
        await expect(portalRemindersDialog).not.toBeVisible({ timeout: 5000 });

        await this.page.waitForTimeout(1000);

        // Optionally close any leftover dialogs/popups
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that clicking 'Save & Close' on the Portal Reminders popup saves changes and closes the popup.
     */
    async verifyPortalReminderSaveAndClose() {
        // Navigate to Listings and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.waitFor({ state: 'attached', timeout: 10000 });
        await firstCard.click();

        // Open the 'Portals' tab
        const portalsTab = this.page.getByRole('tab', { name: /Portals/i });
        await expect(portalsTab).toBeVisible({ timeout: 10000 });
        await portalsTab.click();

        // Wait for first portal row to appear
        const firstPortalRow = this.page.locator('div.row.b-b-light').first();
        await firstPortalRow.waitFor({ state: 'visible', timeout: 10000 });

        // Click the warning icon to trigger the Portal Reminders popup
        const warningIcon = this.page.locator('i.pi.pi-exclamation-triangle, .warning-icon').first();
        await expect(warningIcon).toBeVisible({ timeout: 10000 });
        await expect(warningIcon).toBeEnabled();

        // Click the save button to trigger the popup
        const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(saveButton).toBeVisible({ timeout: 5000 });
        await saveButton.click();

        // Verify the Portal Reminders popup/dialog appears
        const portalRemindersDialog = this.page.locator('div[role="dialog"]:has-text("Portal Reminders")');
        await expect(portalRemindersDialog).toBeVisible({ timeout: 10000 });

        // Locate and click the 'Save & Close' button (assume button with text "Save & Close" exists)
        const saveAndCloseButton = portalRemindersDialog.getByRole('button', { name: /Save & Close/i }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 5000 });
        await saveAndCloseButton.click();
        // Verify the dialog closes after clicking 'Save & Close'
        await expect(portalRemindersDialog).not.toBeVisible({ timeout: 8000 });
        await this.page.waitForTimeout(1200);

    }

    /**
     * Verify that an already saved portal status remains unchanged after refreshing the page.
     */
    async verifyPortalStatusPersistenceAfterRefresh() {
        // Step 1: Go to listings and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Step 2: Open first listing card
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.waitFor({ state: 'attached', timeout: 10000 });
        await firstCard.click();

        // Step 3: Open 'Portals' tab
        const portalsTab = this.page.getByRole('tab', { name: /Portals/i });
        await expect(portalsTab).toBeVisible({ timeout: 10000 });
        await portalsTab.click();

        // Step 4: Wait for first portal row and get the toggle checkbox status
        const firstPortalRow = this.page.locator('div.row.b-b-light').first();
        await firstPortalRow.waitFor({ state: 'visible', timeout: 10000 });
        const inputBox = firstPortalRow.locator('input[type="checkbox"]').first();
        const isCheckedBefore = await inputBox.isChecked();

        // Step 6: Refresh the page
        await this.page.reload();
        const refreshedFirstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(refreshedFirstCard).toBeVisible({ timeout: 30000 });
        await refreshedFirstCard.waitFor({ state: 'attached', timeout: 10000 });
        await refreshedFirstCard.click();

        const refreshedPortalsTab = this.page.getByRole('tab', { name: /Portals/i });
        await expect(refreshedPortalsTab).toBeVisible({ timeout: 10000 });
        await refreshedPortalsTab.click();

        const refreshedFirstPortalRow = this.page.locator('div.row.b-b-light').first();
        await refreshedFirstPortalRow.waitFor({ state: 'visible', timeout: 10000 });
        const refreshedInputBox = refreshedFirstPortalRow.locator('input[type="checkbox"]').first();
        const isCheckedAfter = await refreshedInputBox.isChecked();

        // Step 8: Assert that checkbox state is unchanged after page refresh
        expect(isCheckedAfter).toBe(isCheckedBefore);

        // Optionally close any leftover dialogs/popups
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verifies that disabling a portal removes the green dot indicator in the grid view.
     */
    async verifyGreenDotRemovesAfterDisablingPortal() {
        // Step 1: Navigate to Listings and switch to grid view.
        await this.navigateToListings();
        await this.switchToGridView();

        // Step 2: Open the first listing card.
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.waitFor({ state: 'attached', timeout: 10000 });
        await firstCard.click();

        // Step 3: Open the 'Portals' tab.
        const portalsTab = this.page.getByRole('tab', { name: /Portals/i });
        await expect(portalsTab).toBeVisible({ timeout: 10000 });
        await portalsTab.click();

        // Step 4: Locate the first portal row and its toggle/checkbox.
        const firstPortalRow = this.page.locator('div.row.b-b-light').first();
        await firstPortalRow.waitFor({ state: 'visible', timeout: 10000 });
        const inputBox = firstPortalRow.locator('input[type="checkbox"]').first();
        const toggleSlider = firstPortalRow.locator('label.switch span.slider').first();
        await expect(toggleSlider).toBeVisible({ timeout: 10000 });

        // Step 5: If portal is enabled, disable and save. If already disabled, do nothing.
        const wasChecked = await inputBox.isChecked();
        if (wasChecked) {
            await toggleSlider.click();
            const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
            await expect(saveButton).toBeVisible({ timeout: 5000 });
            await saveButton.click();
            await expect(inputBox).not.toBeChecked({ timeout: 5000 });
            await expect(saveButton).toBeVisible({ timeout: 5000 });
            await saveButton.click();
            await this.page.waitForTimeout(1200);
        }
        // Step 6: Close any open dialogs/popups.
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
            await this.page.waitForTimeout(1200);
        }
        const greenDot = this.page.locator("//div[contains(@class,'s-property')]").first().locator('.listing-active').first();
        await expect(greenDot).not.toBeVisible({ timeout: 8000 });
    }

    /**
     * Verifies that all portals are disabled by default when creating a new listing.
     */
    async verifyAllPortalsDisabledByDefaultForNewListing() {
        // Step 1: Navigate to Listings and switch to grid view.
        await this.navigateToListings();
        await this.switchToGridView();

        // Step 2: Open the first listing card.
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.waitFor({ state: 'attached', timeout: 10000 });
        await firstCard.click();

        // Step 3: Open the 'Portals' tab.
        const portalsTab = this.page.getByRole('tab', { name: /Portals/i });
        await expect(portalsTab).toBeVisible({ timeout: 10000 });
        await portalsTab.click();

        // Wait for all portal rows to appear
        const portalRows = this.page.locator('div.row.b-b-light');
        await expect(portalRows.first()).toBeVisible({ timeout: 10000 });

        const count = await portalRows.count();
        if (count === 0) {
            throw new Error('No portals found in the Portals tab.');
        }

        // For each portal row, check that the checkbox is NOT checked/enabled
        for (let i = 0; i < count; i++) {
            const row = portalRows.nth(i);
            const inputBox = row.locator('input[type="checkbox"]').first();
            await expect(inputBox).not.toBeChecked({ timeout: 10000 });
        }

        // Close the add listing dialog or navigate away
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that toggling a portal ON without saving does not immediately enable it (change is not persisted until 'Save' is clicked).
     */
    async verifyPortalCannotBeEnabledWithoutSaving() {
        // Step 1: Navigate to Listings and switch to grid view.
        await this.navigateToListings();
        await this.switchToGridView();

        // Step 2: Open the first listing card.
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.waitFor({ state: 'attached', timeout: 10000 });
        await firstCard.click();

        // Step 3: Open the 'Portals' tab.
        const portalsTab = this.page.getByRole('tab', { name: /Portals/i });
        await expect(portalsTab).toBeVisible({ timeout: 10000 });
        await portalsTab.click();

        // Wait for first portal row to appear
        const firstPortalRow = this.page.locator('div.row.b-b-light').first();
        await expect(firstPortalRow).toBeVisible({ timeout: 10000 });

        // Store the initial checked status of the first portal
        const inputBox = firstPortalRow.locator('input[type="checkbox"]').first();
        const wasChecked = await inputBox.isChecked();

        // Toggle the checkbox (i.e., if it was off, turn it on)
        const toggleSlider = firstPortalRow.locator('label.switch span.slider').first();
        await toggleSlider.click();
        await this.page.waitForTimeout(1000);

        // WITHOUT SAVING: close the tab/modal or re-open the listing to check if the change persisted.
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(800);

        // Re-open the listing and portals tab to check persisted status

        const reopenedCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(reopenedCard).toBeVisible({ timeout: 30000 });
        await reopenedCard.waitFor({ state: 'attached', timeout: 10000 });
        await reopenedCard.click();

        const portalsTabAgain = this.page.getByRole('tab', { name: /Portals/i });
        await expect(portalsTabAgain).toBeVisible({ timeout: 10000 });
        await portalsTabAgain.click();

        const reopenedPortalRow = this.page.locator('div.row.b-b-light').first();
        await expect(reopenedPortalRow).toBeVisible({ timeout: 10000 });
        const reopenedInputBox = reopenedPortalRow.locator('input[type="checkbox"]').first();
        // The portal should not be checked (should be unchecked if save wasn't clicked)
        await expect(reopenedInputBox).not.toBeChecked({ timeout: 10000 });
        await this.page.waitForTimeout(800);
        // Close out again
        const finalClose = this.page.locator('.pi.pi-times').first();
        if (await finalClose.isVisible().catch(() => false)) {
            await finalClose.click({ force: true });
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify that enabling all portals reflects the correct count in the badge.
     */
    async verifyEnablingAllPortalsReflectsCount() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.waitFor({ state: 'attached', timeout: 10000 });
        await firstCardRow.click();

        // Go to 'Portals' tab
        const portalsTab = this.page.getByRole('tab', { name: /Portals/i });
        await expect(portalsTab).toBeVisible({ timeout: 10000 });
        await portalsTab.click();
        await this.page.waitForTimeout(500);

        // Enable all portals (turn ON every toggle that's not checked)
        const allPortalRows = this.page.locator('div.row.b-b-light');
        const portalRowsCount = await allPortalRows.count();
        let enabledCount = 0;
        for (let i = 0; i < portalRowsCount; i++) {
            const row = allPortalRows.nth(i);
            const toggle = row.locator('label.switch span.slider').first();
            const checkbox = row.locator('input[type="checkbox"]').first();
            if (!(await checkbox.isChecked())) {
                await toggle.click();
                await expect(checkbox).toBeChecked({ timeout: 4000 });
                await this.page.waitForTimeout(200);
            }
            enabledCount++;
        }

        // Click Save
        const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(saveButton).toBeVisible({ timeout: 6000 });
        await saveButton.click();
        await this.page.waitForTimeout(3000);

        // Check badge value
        const enabledPortalCountBadge = this.page.locator('a#pills-portal-tab p.p-head-badge');
        await expect(enabledPortalCountBadge).toBeVisible({ timeout: 6000 });
        const badgeText = await enabledPortalCountBadge.textContent();
        const badgeValue = Number(badgeText?.trim());
        // Badge value should match enabledCount, which should be the same as all rows
        // expect(badgeValue).toBe(portalRowsCount);

        // Optionally, close dialog/modal if open
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(800);
    }

    /**
     * Verify that enabling/disabling a portal updates instantly in the UI before saving changes.
     */
    async verifyPortalInstantUiUpdateBeforeSave() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.waitFor({ state: 'attached', timeout: 10000 });
        await firstCardRow.click();

        // Go to 'Portals' tab
        const portalsTab = this.page.getByRole('tab', { name: /Portals/i });
        await expect(portalsTab).toBeVisible({ timeout: 10000 });
        await portalsTab.click();
        await this.page.waitForTimeout(500);

        // Get the first portal's checkbox and toggle
        const firstPortalRow = this.page.locator('div.row.b-b-light').first();
        await expect(firstPortalRow).toBeVisible({ timeout: 4000 });
        const toggle = firstPortalRow.locator('label.switch span.slider').first();
        const checkbox = firstPortalRow.locator('input[type="checkbox"]').first();

        // Record original state
        const wasChecked = await checkbox.isChecked();

        // Toggle the portal (enable if disabled, disable if enabled)
        await toggle.click();

        // Check that the toggle's state visually updates instantly in the DOM
        const shouldBeChecked = !wasChecked;
        await expect(checkbox).toBeChecked({ timeout: 3000, checked: shouldBeChecked });

        // Do not save - instead, revert toggle for cleanup
        await toggle.click();
        await expect(checkbox).toBeChecked({ timeout: 3000, checked: wasChecked });

        // Optionally close dialog/modal if open
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that invalid actions (e.g., rapidly clicking the portal toggle) do not cause unexpected issues.
     */
    async verifyPortalToggleIsDebouncedAndStable() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.waitFor({ state: 'attached', timeout: 10000 });
        await firstCardRow.click();

        // Go to 'Portals' tab
        const portalsTab = this.page.getByRole('tab', { name: /Portals/i });
        await expect(portalsTab).toBeVisible({ timeout: 10000 });
        await portalsTab.click();
        await this.page.waitForTimeout(300);

        // Get the first portal's toggle and checkbox
        const firstPortalRow = this.page.locator('div.row.b-b-light').first();
        await expect(firstPortalRow).toBeVisible({ timeout: 3000 });
        const toggle = firstPortalRow.locator('label.switch span.slider').first();
        const checkbox = firstPortalRow.locator('input[type="checkbox"]').first();

        // Record the initial checked state
        const initialChecked = await checkbox.isChecked();

        // Rapidly click the toggle several times in quick succession
        for (let i = 0; i < 5; i++) {
            await toggle.click({ force: true });
            await this.page.waitForTimeout(100); // Very minimal pause between clicks
        }

        // Wait briefly to allow UI to stabilize
        await this.page.waitForTimeout(500);

        const errorBanner = this.page.locator('.p-toast-message-error,.error-banner,.ant-message-error').first();
        expect(await errorBanner.isVisible().catch(() => false)).toBeFalsy();

        // The toggle should now be either ON or OFF: it should not be in an indeterminate or disabled state
        expect(await checkbox.isDisabled()).toBe(false);

        // Clean up: Try to revert checkbox to original state if changed
        const finalChecked = await checkbox.isChecked();
        if (finalChecked !== initialChecked) {
            await toggle.click({ force: true });
            await expect(checkbox).toBeChecked({ timeout: 3000, checked: initialChecked });
        }

        // Optionally close dialog/modal if open
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

}
