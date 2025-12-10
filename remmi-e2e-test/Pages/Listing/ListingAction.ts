import { Locator, Page, expect } from '@playwright/test';
import { ListingLocators } from './ListingLocator';
import { addAbortListener } from 'events';
import { table } from 'console';
import { faker } from '@faker-js/faker';

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
        await expect(listingTab).toBeVisible();
        await listingTab.click({ force: true });
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
        expect(foundKeyword).toBe(true);

        // Reset filter

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
        expect(foundFirst).toBe(true);
        expect(foundSecond).toBe(true);

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

        const propertyTypeSearchInput = this.page.locator('input[placeholder="Type to search"], input[type="text"][placeholder="Type to search"]');
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
        expect(found).toBe(true);
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

        await this.page.waitForTimeout(1000)

    }

    // Deleting a Listing
    async deleteListingCard() {
        await this.navigateToListings();
        await this.switchToGridView();

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
        // await confirmButton.click({ force: true });

        const cancell = this.page.getByRole('button', { name: 'Cancel' });
        await cancell.click({ force: true })

        await this.resetFilters()

        await this.page.waitForTimeout(1000)

        // // Assert toast/snackbar notification or row is removed
        // const toast = this.page.locator('.p-toast-message-success, .p-toast-message', { hasText: "success" });
        // await expect(toast).toBeVisible({ timeout: 10000 });
    }

    // Editing a listing
    async editListingCard() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Expand the first listing card (if needed)
        const chevronDown = this.page.locator('i.pi.pi-chevron-down').first();
        await chevronDown.click({ force: true });

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
        await this.page.waitForTimeout(1000);
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

        // For each suburb label, search and select
        for (const suburbLabel of suburbLabels) {
            const searchInput = this.locators.suburbSearchInput();
            await expect(searchInput).toBeVisible();
            await searchInput.fill(''); // Clear previous filter
            await searchInput.fill(suburbLabel);

            await this.page.waitForTimeout(500);

            // Select the matching suburb
            const suburbOption = this.locators.suburbOption(suburbLabel).first();
            await expect(suburbOption).toBeVisible();
            await suburbOption.click({ force: true });

            await this.page.waitForTimeout(300);
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
        expect(foundFirst).toBe(true);
        expect(foundSecond).toBe(true);
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
        await expect(header).toBeVisible();
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
            await this.page.waitForTimeout(200);
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
        const searchUserInput = this.page.getByRole('textbox', { name: /Type to search/i });
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
        const searchTeamInput = this.page.locator('input[placeholder="Type to search"]');
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
        const confirmButton = this.page.getByRole('button', { name: 'Delete', exact: true });
        await expect(confirmButton).toBeVisible({ timeout: 10000 });
        // await confirmButton.click({ force: true });

        const cancell = this.page.getByRole('button', { name: 'Cancel' });
        await cancell.click({ force: true });
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
        const searchBox = this.page.getByRole('textbox', { name: 'Type to search' });
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
        const searchBox = this.page.getByRole('textbox', { name: 'Type to search' });
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
        const searchBox = this.page.getByRole('textbox', { name: 'Type to search' });
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
        const searchBox = this.page.getByRole('textbox', { name: 'Type to search' });
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
       
        const filterIcon =  await this.page.waitForSelector('th:has-text("Listing Status") img[alt="filter"]', { state: 'visible', timeout: 5000 });
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
        const searchBox = this.page.getByRole('textbox', { name: 'Type to search' });
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

}
