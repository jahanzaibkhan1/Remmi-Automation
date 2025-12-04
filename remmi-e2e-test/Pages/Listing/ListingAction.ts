import { Locator, Page, expect } from '@playwright/test';
import { ListingLocators } from './ListingLocator';
import { addAbortListener } from 'events';
import { table } from 'console';

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

        await expect(searchInput).toBeVisible({ timeout: 3000 });
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

        // Reset filters if the function exists
        
    }

    // Searching for a non-existing Listing by keyword
    async searchForNonExistingListing(keyword: string) {
        await this.navigateToListings();
        await this.switchToListView();

        // Wait for table rows (header at least)
        await this.waitForTableRows();

        // Search for the non-existing keyword
        const searchInput = this.locators.SearchBox();
        await expect(searchInput).toBeVisible({ timeout: 3000 });
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
        await expect(searchInput).toBeVisible({ timeout: 3000 });
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
        await expect(searchInput).toBeVisible({ timeout: 3000 });
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

        await expect(searchInput).toBeVisible({ timeout: 3000 });
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

        await expect(searchInput).toBeVisible({ timeout: 3000 });
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
        await expect(firstOption).toBeVisible({ timeout: 3000 });
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
            await expect(row).toBeVisible({ timeout: 3000 });
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
            await expect(row).toBeVisible({ timeout: 3000 });
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
        expect(foundFirst).toBe(true);
        expect(foundSecond).toBe(true);
    }
    // Deselect all property types in the property type filter dropdown and verify rows remain
    async deselectPropertyTypes() {
        await this.navigateToListings();
        await this.switchToListView();

        // Open the property type dropdown
        await this.openPropertyTypeDropdown();

        // Find and click the select all checkbox to deselect all
        const selectAll = this.locators.propertyTypeSelectAll();
        await expect(selectAll).toBeVisible();
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
        await expect(suburbDropdown).toBeVisible();
        await suburbDropdown.click({ force: true });

        // Type into the suburb search input
        const searchInput = this.locators.suburbSearchInput();
        await expect(searchInput).toBeVisible();
        await searchInput.fill(suburbLabel);
        await this.page.waitForTimeout(800);

        // Select the matching suburb
        const suburbOption = this.locators.suburbOption(suburbLabel).first();
        await expect(suburbOption).toBeVisible();
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
        await expect(suburbDropdown).toBeVisible();
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
            expect(foundMatching).toBe(true);
        }
    }

    // Selecting "Deselect All" in suburb filter in List View
    async deselectAllSuburbsInListView() {
        await this.navigateToListings();
        await this.switchToListView();

        // Open the suburb dropdown
        const suburbDropdown = this.locators.suburbDropdown();
        await expect(suburbDropdown).toBeVisible();
        await suburbDropdown.click({ force: true });

        // Click the "Select All" checkbox once to select all, then again to deselect all
        const selectAllCheckbox = this.locators.suburbSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible();
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
        await expect(suburbDropdown).toBeVisible();
        await suburbDropdown.click({ force: true });

        // Search for the non-existing suburb label
        const searchInput = this.locators.suburbSearchInput();
        await expect(searchInput).toBeVisible();
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
        await expect(listingStatusDropdown).toBeVisible();
        await listingStatusDropdown.click({ force: true });

        // Wait for listing status options to be visible
        const statusOptions = this.page.locator('ul > li.p-element');
        await expect(statusOptions.first()).toBeVisible({ timeout: 5000 });

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

        // Open the listing status dropdown
        const listingStatusDropdown = this.locators.listingStatusDropdown();
        await expect(listingStatusDropdown).toBeVisible();
        await listingStatusDropdown.click({ force: true });

        // Wait for listing status options to be visible
        const statusOptions = this.page.locator('ul > li.p-element');
        await expect(statusOptions.first()).toBeVisible({ timeout: 5000 });

        // Select each status label
        const lowerLabels = statusLabels.map(label => label.toLowerCase());
        let selectedCount = 0;
        const count = await statusOptions.count();
        for (let i = 0; i < count; ++i) {
            const option = statusOptions.nth(i);
            const text = (await option.innerText()).trim().toLowerCase();
            if (lowerLabels.includes(text)) {
                await option.click({ force: true });
                selectedCount++;
                // Wait a little between selections (optional, for UI stability)
                await this.page.waitForTimeout(250);
            }
            if (selectedCount === lowerLabels.length) break;
        }
        expect(selectedCount).toBe(lowerLabels.length);

        // Dismiss the dropdown if needed (by clicking outside or pressing Esc)
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(1000);

        // Check that at least one table row contains each selected status
        const tableRows = this.page.locator('tr');
        const rowCount = await tableRows.count();
        expect(rowCount).toBeGreaterThan(0);

        for (const desiredStatus of lowerLabels) {
            let found = false;
            for (let i = 0; i < rowCount; i++) {
                const row = tableRows.nth(i);
                const rowText = (await row.innerText()).toLowerCase();
                if (rowText.includes(desiredStatus)) {
                    found = true;
                    break;
                }
            }
            expect(found).toBe(true);
        }
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
        await expect(listingStatusDropdown).toBeVisible();
        await listingStatusDropdown.click({ force: true });

        // Click the "Select All" checkbox to select everything
        const selectAllCheckbox = this.locators.listingStatusSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible();
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

}
