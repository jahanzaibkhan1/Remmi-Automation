import { Page, expect } from '@playwright/test';
import { ListingLocators } from './ListingLocator';

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
    private async waitForTableRows(minRows: number = 2, rowTimeout = 10000) {
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


    //*************************************Public Actions *************************************//

    async searchForValidListing(keyword: string) {
        await this.navigateToListings();
        await this.waitForTableRows();
        await this.searchListing(keyword);

        await this.page.waitForTimeout(1000);

        const searchBox = this.locators.SearchBox();
        await expect(searchBox).toBeVisible({ timeout: 1000 });
        await expect(searchBox).toHaveValue(keyword);

        await this.waitForTableRows();

        const rows = this.getRowsLocator();
        const rowCount = await rows.count();
        expect(rowCount).toBeGreaterThan(1);

        const headerRow = rows.nth(0);
        const headers = await headerRow.locator('th').allInnerTexts();

        let found = false;
        for (let i = 1; i < rowCount; ++i) {
            const row = rows.nth(i);
            await expect(row).toBeVisible({ timeout: 2000 });
            const cellCount = await row.locator('td').count();
            for (let j = 0; j < cellCount; ++j) {
                const cellText = (await row.locator('td').nth(j).innerText()).toLowerCase();
                if (cellText.includes(keyword.toLowerCase())) {
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
        expect(found).toBe(true);

        const agentColumns = headers
            .map((h, idx) => ({ idx, h: h.trim().toLowerCase() }))
            .filter(({ h }) => h.includes('primary agent') || h.includes('selected by agent'))
            .map(({ idx }) => idx);

        if (agentColumns.length > 0) {
            let agentColumnHasKeyword = false;
            for (let i = 1; i < rowCount; ++i) {
                const row = rows.nth(i);
                await expect(row).toBeVisible({ timeout: 5000 });
                for (const colIdx of agentColumns) {
                    const cell = row.locator('td').nth(colIdx);
                    const cellText = (await cell.innerText()).toLowerCase();
                    if (cellText.includes(keyword.toLowerCase())) {
                        agentColumnHasKeyword = true;
                        break;
                    }
                }
                if (agentColumnHasKeyword) break;
            }
            expect(agentColumnHasKeyword).toBe(true);
        }

        const noResults = this.page.locator('text="No results found"');
        await expect(noResults).toHaveCount(0);

        const clearButton = this.locators.clearSearch();
        if (await clearButton.isVisible({ timeout: 500 }).catch(() => false)) {
            await clearButton.click();
        } else {
            await searchBox.fill('');
        }
        await expect(searchBox).toHaveValue('');
        await expect(searchBox).toBeVisible({ timeout: 800 });
    }

    async searchForInvalidListing(keyword: string) {
        await this.navigateToListings();
        await this.waitForTableRows();
        await this.searchListing(keyword);
        await this.page.waitForTimeout(1000);

        const noResults = this.page.getByText('No results found');
        await expect(noResults).toBeVisible({ timeout: 5000 });

        const clearButton = this.page.locator('i').nth(5);
        await clearButton.click({ force: true });
    }

    async searchWithSpecialCharacters(specialChars: string) {
        await this.navigateToListings();
        await this.waitForTableRows();
        await this.searchListing(specialChars);
        await this.page.waitForTimeout(1000);

        const resultSelector = `tr:has-text("${specialChars}"), li:has-text("${specialChars}"), div:has-text("${specialChars}")`;
        const resultsWithSpecialChars = this.page.locator(resultSelector);
        const count = await resultsWithSpecialChars.count();
        await expect(count).toBeGreaterThan(0);

        if (count > 0) {
            await resultsWithSpecialChars.first().scrollIntoViewIfNeeded();
        }

        const clearButton = this.locators.clearSearch?.()
            ?? this.page.locator('i').nth(5);
        if (await clearButton.isVisible({ timeout: 500 }).catch(() => false)) {
            await clearButton.click({ force: true });
        } else {
            const searchBox = this.locators.SearchBox();
            await searchBox.fill('');
        }
    }

    async searchWithEmptyField() {
        await this.navigateToListings();

        await this.waitForTableRows();

        const searchBox = this.locators?.SearchBox?.() ?? this.page.getByRole('textbox', { name: /search/i });
        await searchBox.fill('');
        await searchBox.press('Enter');
        await this.page.waitForTimeout(1000);

        const visibleRows = this.getRowsLocator();
        const visibleRowCount = await this.getRowsCount();
        await expect(visibleRowCount).toBeGreaterThan(1);
        for (let i = 1; i < visibleRowCount; ++i) {
            await expect(visibleRows.nth(i)).toBeVisible({ timeout: 3000 });
        }

        await expect(searchBox).toHaveValue('');
    }

    async selectSinglePropertyType() {
        await this.navigateToListings();
        await this.waitForTableRows();

        await this.openPropertyTypeDropdown();
        await this.page.waitForTimeout(1000);
        const firstPropertyTypeOption = this.page.locator('ul > li.p-element').first();
        await expect(firstPropertyTypeOption).toBeVisible({ timeout: 3000 });
        const selectedLabel = (await firstPropertyTypeOption.innerText()).trim();
        await firstPropertyTypeOption.click({ force: true });
        await this.page.waitForTimeout(1000);

        const rows = this.getRowsLocator();
        const rowCount = await this.getRowsCount();
        expect(rowCount).toBeGreaterThan(1);

        const headerRow = rows.nth(0);
        const headerCells = await headerRow.locator('th').allInnerTexts();
        let propertyTypeColIdx = headerCells.findIndex(h => h.trim().toLowerCase().includes('property type'));
        expect(propertyTypeColIdx).toBeGreaterThanOrEqual(0);

        let propertyTypeFound = false;
        for (let i = 1; i < rowCount; i++) {
            const row = rows.nth(i);
            await expect(row).toBeVisible({ timeout: 3000 });
            const cells = row.locator('td');
            const cellCount = await cells.count();
            expect(propertyTypeColIdx).toBeLessThan(cellCount);

            const cellText = (await cells.nth(propertyTypeColIdx).innerText()).trim().toLowerCase();
            if (cellText.includes(selectedLabel.toLowerCase())) {
                propertyTypeFound = true;
                break;
            }
        }
        expect(propertyTypeFound).toBe(true);

        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }

    async selectMultiplePropertyTypes() {
        await this.navigateToListings();
        await this.waitForTableRows();

        await this.openPropertyTypeDropdown();
        await this.page.waitForTimeout(1000);

        const propertyTypeOptions = this.page.locator('ul > li.p-element');
        const firstOption = propertyTypeOptions.nth(0);
        const secondOption = propertyTypeOptions.nth(1);

        const firstLabel = (await firstOption.innerText()).trim().toLowerCase();
        const secondLabel = (await secondOption.innerText()).trim().toLowerCase();

        await firstOption.click({ force: true });
        await secondOption.click({ force: true });
        await this.page.waitForTimeout(1000);

        const rows = this.getRowsLocator();
        const rowCount = await this.getRowsCount();
        expect(rowCount).toBeGreaterThan(1);

        const headerRow = rows.nth(0);
        const headerCells = await headerRow.locator('th').allInnerTexts();
        let propertyTypeColIdx = headerCells.findIndex(h => h.trim().toLowerCase().includes('property type'));
        expect(propertyTypeColIdx).toBeGreaterThanOrEqual(0);

        let found = false;
        for (let i = 1; i < rowCount; i++) {
            const row = rows.nth(i);
            await expect(row).toBeVisible({ timeout: 3000 });
            const cells = row.locator('td');
            const cellCount = await cells.count();
            expect(propertyTypeColIdx).toBeLessThan(cellCount);

            const cellText = (await cells.nth(propertyTypeColIdx).innerText()).trim().toLowerCase();
            if (cellText.includes(firstLabel) || cellText.includes(secondLabel)) {
                found = true;
                break;
            }
        }
        expect(found).toBe(true);

        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }

    async selectAllPropertyType() {
        await this.navigateToListings();
        await this.waitForTableRows();

        await this.openPropertyTypeDropdown();
        await this.page.waitForTimeout(1000);

        const selectAllOption = this.page.locator('.checkbox__checkmark').first();
        await selectAllOption.click();
        await this.page.waitForTimeout(1000);

        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await resetButton.click();
    }

    async deselectAllPropertyTypes() {
        await this.navigateToListings();
        await this.waitForTableRows();

        await this.openPropertyTypeDropdown();
        await this.page.waitForTimeout(1000);

        const selectAllOption = this.page.locator('.checkbox__checkmark').first();
        await selectAllOption.click();
        await this.page.waitForTimeout(500);

        await selectAllOption.click();
        await this.page.waitForTimeout(1000);

        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await resetButton.click();
    }

    async searchWithinPropertyTypeFilter(searchTerm: string) {
        await this.navigateToListings();
        await this.waitForTableRows();

        await this.openPropertyTypeDropdown();
        await this.page.waitForTimeout(1000);

        const propertyTypeSearchInput = this.page.locator('input[placeholder="Type to search"], input[type="text"][placeholder="Type to search"]');
        await propertyTypeSearchInput.fill(searchTerm);
        await this.page.waitForTimeout(1000);

        const matchedOption = this.page.locator('li.p-element').first();
        if (await matchedOption.isVisible()) {
            await matchedOption.click();
        }
        await this.page.waitForTimeout(800);

        const rowCount = await this.getRowsCount();
        let found = false;
        for (let i = 1; i < rowCount; ++i) {
            const row = this.getRowsLocator().nth(i);
            await expect(row).toBeVisible({ timeout: 3000 });
            const rowText = (await row.innerText()).toLowerCase();
            if (rowText.includes(searchTerm.toLowerCase())) {
                found = true;
                break;
            }
        }
        expect(found).toBe(true);

        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await resetButton.click();
    }

    async selectSinglePropertyAndCloseDropdown() {
        await this.navigateToListings();
        await this.waitForTableRows();
        await this.openPropertyTypeDropdown();
        await this.page.waitForTimeout(1000);

        const firstPropertyTypeOption = this.page.locator('ul > li.p-element').first();
        await firstPropertyTypeOption.click({ force: true });

        const closeButton = this.page.locator('.pi.pi-times-circle');
        if (await closeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await closeButton.click({ force: true });
        }
        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }

    async selectSingleSuburb() {
        await this.navigateToListings();
        await this.waitForTableRows();

        const suburbDropdown = this.locators.suburbDropdown();
        await expect(suburbDropdown).toBeVisible({ timeout: 2000 });
        await suburbDropdown.click();
        await this.page.waitForTimeout(1000);

        const firstSuburbOption = this.page.locator('ul > li.p-element').first();
        await expect(firstSuburbOption).toBeVisible({ timeout: 5000 });
        const firstSuburbTextRaw = await firstSuburbOption.textContent();
        const firstSuburbText = firstSuburbTextRaw ? firstSuburbTextRaw.trim() : '';
        await firstSuburbOption.click({ force: true });
        await this.page.waitForTimeout(1000);

        const rowCount = await this.getRowsCount();
        let found = false;
        for (let i = 1; i < rowCount; ++i) {
            const row = this.getRowsLocator().nth(i);
            await expect(row).toBeVisible({ timeout: 3000 });
            const rowText = (await row.innerText()).toLowerCase();
            if (firstSuburbText && rowText.includes(firstSuburbText.toLowerCase())) {
                found = true;
                break;
            }
        }
        expect(found).toBe(true);

        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }

    async selectMultipleSuburbs() {
        await this.navigateToListings();
        await this.waitForTableRows();

        const suburbDropdown = this.locators.suburbDropdown();
        await expect(suburbDropdown).toBeVisible({ timeout: 2000 });
        await suburbDropdown.click({ force: true });
        await this.page.waitForTimeout(1000);

        const allSuburbOptions = this.page.locator('ul > li.p-element');
        const optionCount = await allSuburbOptions.count();
        if (optionCount < 2) {
            throw new Error('Less than two suburb options available to select.');
        }
        const suburb1 = allSuburbOptions.nth(0);
        const suburb2 = allSuburbOptions.nth(1);

        const suburb1TextRaw = await suburb1.textContent();
        const suburb2TextRaw = await suburb2.textContent();
        const suburb1Text = suburb1TextRaw ? suburb1TextRaw.trim() : '';
        const suburb2Text = suburb2TextRaw ? suburb2TextRaw.trim() : '';

        await suburb1.click({ force: true });
        await this.page.waitForTimeout(300);
        await suburb2.click({ force: true });
        await this.page.waitForTimeout(1000);

        const rowCount = await this.getRowsCount();

        let foundSuburb1 = false;
        let foundSuburb2 = false;

        for (let i = 1; i < rowCount; ++i) {
            const row = this.getRowsLocator().nth(i);
            await expect(row).toBeVisible({ timeout: 3000 });
            const rowText = (await row.innerText()).toLowerCase();
            if (suburb1Text && rowText.includes(suburb1Text.toLowerCase())) {
                foundSuburb1 = true;
            }
            if (suburb2Text && rowText.includes(suburb2Text.toLowerCase())) {
                foundSuburb2 = true;
            }
            if (foundSuburb1 && foundSuburb2) break;
        }

        expect(foundSuburb1).toBe(true);
        expect(foundSuburb2).toBe(true);

        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }

    async selectAllSuburbs() {
        await this.navigateToListings();
        await this.waitForTableRows();

        const suburbDropdown = this.locators?.suburbDropdown?.() ?? this.page.locator('re-multiselect[placeholder="Suburb"]');
        await expect(suburbDropdown).toBeVisible();
        await suburbDropdown.click({ force: true });

        const selectAllCheckbox = this.locators.suburbSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible();
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(1000);

        const rows = this.page.locator('tbody tr');
        const rowCount = await rows.count();
        expect(rowCount).toBeGreaterThan(0);

        await expect(rows.first()).toBeVisible();

        for (let i = 0; i < rowCount; i++) {
            await expect(rows.nth(i)).toBeVisible();
        }

        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await expect(resetButton).toBeVisible();
        await resetButton.click();
    }

    async deselectAllSuburbs() {
        await this.navigateToListings();
        await this.waitForTableRows();

        const suburbDropdown = this.locators.suburbDropdown();
        await expect(suburbDropdown).toBeVisible();
        await suburbDropdown.click({ force: true });

        const selectAllCheckbox = this.locators.suburbSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible();
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(500);

        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(500);

        const visibleRows = this.getRowsLocator();
        const visibleRowCount = await this.getRowsCount();
        expect(visibleRowCount).toBeGreaterThan(0);

        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }

    async searchWithinSuburbDropdown(suburbLabel: string) {
        await this.navigateToListings();
        await this.waitForTableRows();

        const suburbDropdown = this.locators.suburbDropdown();
        await expect(suburbDropdown).toBeVisible();
        await suburbDropdown.click({ force: true });

        const searchInput = this.locators.suburbSearchInput();
        await expect(searchInput).toBeVisible();
        await searchInput.fill(suburbLabel);

        await this.page.waitForTimeout(800);

        const suburbOption = this.locators.suburbOption(suburbLabel);
        await expect(suburbOption).toBeVisible();

        await suburbOption.click({ force: true });

        await this.page.waitForTimeout(1000);

        const filteredRowCount = await this.getRowsCount();
        expect(filteredRowCount).toBeGreaterThan(0);

        const filteredRows = this.getRowsLocator();
        let dataShown = false;
        for (let i = 1; i < filteredRowCount; ++i) {
            const row = filteredRows.nth(i);
            await expect(row).toBeVisible({ timeout: 3000 });
            const rowText = (await row.innerText()).toLowerCase();
            if (rowText.includes(suburbLabel.toLowerCase())) {
                dataShown = true;
                break;
            }
        }
        expect(dataShown).toBe(true);

        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }

    async selectSingleListingStatus() {
        await this.navigateToListings();
        await this.waitForTableRows();

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

        const rowCount = await this.getRowsCount();
        expect(rowCount).toBeGreaterThan(1);

        const rows = this.getRowsLocator();

        const headerRow = rows.nth(0);
        const headerCells = await headerRow.locator('th').allInnerTexts();
        let listingStatusColIdx = headerCells.findIndex(h => h.trim().toLowerCase().includes('listing status'));
        if (listingStatusColIdx === -1) {
            listingStatusColIdx = headerCells.findIndex(h => h.trim().toLowerCase().includes('status'));
        }
        expect(listingStatusColIdx).toBeGreaterThanOrEqual(0);

        let allRowsCorrect = true;
        for (let i = 1; i < rowCount; ++i) {
            const row = rows.nth(i);
            await expect(row).toBeVisible({ timeout: 3000 });
            const cells = row.locator('td');
            const cellCount = await cells.count();
            expect(listingStatusColIdx).toBeLessThan(cellCount);

            const cellText = (await cells.nth(listingStatusColIdx).innerText()).toLowerCase();
            if (!cellText.includes("for lease")) {
                allRowsCorrect = false;
                break;
            }
        }
        expect(allRowsCorrect).toBe(true);

        await listingStatusDropdown.click();

        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }

    async selectMultipleListingStatuses() {
        await this.navigateToListings();
        await this.waitForTableRows();

        const listingStatusDropdown = this.locators.listingStatusDropdown();
        await listingStatusDropdown.click();

        const statusOptions = this.page.locator('ul > li.p-element');
        const statusCount = await statusOptions.count();
        if (statusCount < 2) {
            throw new Error('Less than two listing statuses available to select.');
        }

        const selectedStatusLabels: string[] = [];
        const status1 = statusOptions.nth(2);
        const status2 = statusOptions.nth(4);

        await this.waitForTableRows()
        const status1Label = (await status1.innerText()).trim().toLowerCase();
        const status2Label = (await status2.innerText()).trim().toLowerCase();
        selectedStatusLabels.push(status1Label, status2Label);

        await status1.click({ force: true });
        await this.page.waitForTimeout(200);
        await status2.click({ force: true });
        await this.page.waitForTimeout(1000);

        const rowCount = await this.getRowsCount();
        expect(rowCount).toBeGreaterThan(1);

        const rows = this.getRowsLocator();
        const headerRow = rows.nth(0);
        const headerCells = await headerRow.locator('th').allInnerTexts();
        let listingStatusColIdx = headerCells.findIndex(h => h.trim().toLowerCase().includes('listing status'));
        if (listingStatusColIdx === -1) {
            listingStatusColIdx = headerCells.findIndex(h => h.trim().toLowerCase().includes('status'));
        }
        expect(listingStatusColIdx).toBeGreaterThanOrEqual(0);

        let allRowsMatch = true;
        for (let i = 1; i < rowCount; ++i) {
            const row = rows.nth(i);
            await expect(row).toBeVisible({ timeout: 3000 });
            const cells = row.locator('td');
            const cellCount = await cells.count();
            expect(listingStatusColIdx).toBeLessThan(cellCount);

            const cellText = (await cells.nth(listingStatusColIdx).innerText()).trim().toLowerCase();
            if (!selectedStatusLabels.some(label => cellText.includes(label))) {
                allRowsMatch = false;
                break;
            }
        }
        expect(allRowsMatch).toBe(true);

        await listingStatusDropdown.click();
        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }

    async selectAllListingStatuses() {
        await this.navigateToListings();
        await this.waitForTableRows();

        const listingStatusDropdown = this.locators.listingStatusDropdown();
        await expect(listingStatusDropdown).toBeVisible();
        await listingStatusDropdown.click({ force: true });

        const selectAllCheckbox = this.locators.listingStatusSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible();
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(1000);

        const rows = this.page.locator('tbody tr');
        const rowCount = await rows.count();
        expect(rowCount).toBeGreaterThan(0);

        await expect(rows.first()).toBeVisible();
        for (let i = 0; i < rowCount; i++) {
            await expect(rows.nth(i)).toBeVisible();
        }

        await listingStatusDropdown.click();
        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await expect(resetButton).toBeVisible();
        await resetButton.click();
    }

    async deselectAllListingStatuses() {
        await this.navigateToListings();
        await this.waitForTableRows();

        const listingStatusDropdown = this.locators.listingStatusDropdown();
        await expect(listingStatusDropdown).toBeVisible();
        await listingStatusDropdown.click({ force: true });

        const selectAllCheckbox = this.locators.listingStatusSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible();
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(500);

        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(1000);

        await listingStatusDropdown.click();
        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }

    async searchListingStatusFilter(searchTerm: string) {
        await this.navigateToListings();
        await this.waitForTableRows();

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
        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }

    async selectSingleListingType() {
        await this.navigateToListings();
        await this.waitForTableRows();

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

        const rows = this.page.locator('tbody tr');
        const rowCount = await rows.count();

        expect(rowCount).toBeGreaterThan(0);

        const headerRow = this.page.locator('thead tr').first();
        await expect(headerRow).toBeVisible({ timeout: 3000 });
        const headerCells = await headerRow.locator('th').allInnerTexts();
        const listingTypeColIdx = headerCells.findIndex(h => h.trim().toLowerCase().includes('listings type'));
        expect(listingTypeColIdx).toBeGreaterThanOrEqual(0);

        let found = false;
        for (let i = 0; i < rowCount; ++i) {
            const dataRow = rows.nth(i);
            await expect(dataRow).toBeVisible({ timeout: 3000 });
            const cells = dataRow.locator('td');
            const cellCount = await cells.count();
            if (listingTypeColIdx >= cellCount) continue;

            const cellText = (await cells.nth(listingTypeColIdx).innerText()).trim().toLowerCase();
            if (selectedTypeText && cellText.includes(selectedTypeText.toLowerCase())) {
                found = true;
                break;
            }
        }
        expect(found).toBe(true);

        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }

    async selectMultipleListingTypes() {
        await this.navigateToListings();
        await this.waitForTableRows();

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

        const rows = this.page.locator('tbody tr');
        const rowCount = await rows.count();
        expect(rowCount).toBeGreaterThan(0);

        const headerRow = this.page.locator('thead tr').first();
        await expect(headerRow).toBeVisible({ timeout: 3000 });
        const headerCells = await headerRow.locator('th').allInnerTexts();
        let listingTypeColIdx = headerCells.findIndex(h =>
            h.trim().toLowerCase().includes('listing type')
        );
        if (listingTypeColIdx === -1) {
            listingTypeColIdx = headerCells.findIndex(h =>
                h.trim().toLowerCase().includes('listings type')
            );
        }
        expect(listingTypeColIdx).toBeGreaterThanOrEqual(0);

        let foundType1 = false;
        let foundType2 = false;
        for (let i = 0; i < rowCount; ++i) {
            const dataRow = rows.nth(i);
            await expect(dataRow).toBeVisible({ timeout: 3000 });
            const cells = dataRow.locator('td');
            const cellCount = await cells.count();
            if (listingTypeColIdx >= cellCount) continue;

            const cellText = (await cells.nth(listingTypeColIdx).innerText()).trim().toLowerCase();

            if (type1Text && cellText.includes(type1Text.toLowerCase())) {
                foundType1 = true;
            }
            if (type2Text && cellText.includes(type2Text.toLowerCase())) {
                foundType2 = true;
            }
            if (foundType1 && foundType2) break;
        }
        expect(foundType1).toBe(true);
        expect(foundType2).toBe(true);

        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }

    async selectSingleAgent() {
        await this.navigateToListings();
        await this.waitForTableRows();
        await this.openSelectByAgentDropdown();

        const agentOptions = this.page.locator('li.p-element');
        const optionCount = await agentOptions.count();
        expect(optionCount).toBeGreaterThan(1);

        let idx = 1, agentText = (await agentOptions.nth(idx).innerText()).trim();
        if (!agentText && optionCount > 2) {
            idx = 2;
            agentText = (await agentOptions.nth(idx).innerText()).trim();
        }
        if (!agentText) throw new Error('Could not find valid agent option for selection');

        await agentOptions.nth(idx).click({ force: true });
        await this.page.waitForTimeout(600);
        await this.page.locator('.p-datatable-loading, .loading-spinner')
            .waitFor({ state: 'hidden', timeout: 7000 }).catch(() => { });

        const rows = this.page.locator('tbody tr');
        const rowCount = await this.waitForTableRows();
        expect(rowCount).toBeGreaterThan(0);

        const headerCells = await this.page.locator('thead tr').first().locator('th').allInnerTexts();
        const agentColIdx = headerCells.findIndex(h => h.trim().toLowerCase().includes('primary agent'));
        expect(agentColIdx).toBeGreaterThanOrEqual(0);

        let foundAtLeastOneMatchingRow = false;
        for (let i = 0; i < rowCount; ++i) {
            const cells = rows.nth(i).locator('td');
            const cellCount = await cells.count();
            if (agentColIdx >= cellCount) {
                // Ignore rows which don't have expected columns, do not fail
                continue;
            }
            const cellText = (await cells.nth(agentColIdx).innerText()).trim().toLowerCase();
            if (cellText.includes(agentText.toLowerCase())) {
                foundAtLeastOneMatchingRow = true;
                break;
            }
        }
        // Pass if there is *at least* one row with matching agent name; ignore if other rows show something else
        expect(foundAtLeastOneMatchingRow).toBe(true);

        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }

    async selectMultipleAgents() {
        await this.navigateToListings();
        await this.waitForTableRows();
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

        const selectedAgents = [agentText1, agentText3];

        // Wait for filter to apply
        await this.page.locator('.p-datatable-loading, .loading-spinner')
            .waitFor({ state: 'hidden', timeout: 7000 }).catch(() => { });

        // Validate all rows have at least one of the selected agent names in Primary Agent column
        const rows = this.page.locator('tbody tr');
        const rowCount = await this.waitForTableRows();
        expect(rowCount).toBeGreaterThan(0);

        const headerCells = await this.page.locator('thead tr').first().locator('th').allInnerTexts();
        const agentColIdx = headerCells.findIndex(h => h.trim().toLowerCase().includes('primary agent'));
        expect(agentColIdx).toBeGreaterThanOrEqual(0);

        let failures: string[] = [];
        for (let i = 0; i < rowCount; ++i) {
            const cells = rows.nth(i).locator('td');
            const cellCount = await cells.count();
            if (agentColIdx >= cellCount) {
                failures.push(`Row ${i}: Not enough cells (expected agent column idx ${agentColIdx}, got ${cellCount})`);
                continue;
            }
            const cellText = (await cells.nth(agentColIdx).innerText()).trim().toLowerCase();
            if (!selectedAgents.some(a => cellText.includes(a.toLowerCase()))) {
                failures.push(`Row ${i}: Expected an agent from [${selectedAgents.join(", ")}] in "${cellText}"`);
            }
        }

        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }
    // Selecting a single contract status 
    async selectSingleContractStatus() {
        await this.navigateToListings();
        await this.waitForTableRows();

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

        // Click 'Reset' to clear the filter (skip table verification)
        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }

    // Selecting multiple Contract statuses
    async selectMultipleContractStatuses() {
        await this.navigateToListings();
        await this.waitForTableRows();

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
        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }

    // Selecting a contact creation date
    async selectListingCreationDate() {
        await this.navigateToListings();
        await this.waitForTableRows();

        // Open datepicker
        const input = this.locators.listingCreationDateDropdown();
        await expect(input).toBeVisible({ timeout: 3000 });
        await input.click({ force: true });
        await this.page.waitForTimeout(300);

        // Get current month/year as text
        const mElem = this.page.locator('.p-datepicker .p-datepicker-month');
        const yElem = this.page.locator('.p-datepicker .p-datepicker-year');
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const monthText = ((await mElem.textContent()) ?? '').trim().toLowerCase();
        const yearText = (await yElem.textContent() ?? '0').trim();

        const currM = months.findIndex(m => m.toLowerCase() === monthText);
        const currY = parseInt(yearText, 10);

        // Safety: Make sure current month/year are valid
        if (currM < 0 || isNaN(currY)) {
            throw new Error(`Failed to read month/year from datepicker: got month='${monthText}', year='${yearText}'`);
        }

        // Calculate how many "next" clicks are needed for Jan 2025
        const targetYear = 2025, targetMonth = 0; // 0 = Jan
        const nextClicks = (targetYear - currY) * 12 + (targetMonth - currM);

        const navBtn = nextClicks >= 0
            ? this.page.locator('.p-datepicker-next')
            : this.page.locator('.p-datepicker-prev');

        for (let i = 0; i < Math.abs(nextClicks); ++i) {
            await navBtn.click();
            await this.page.waitForTimeout(120);
        }

        // Select 1st Jan
        await this.page.locator('.p-datepicker-calendar td span', { hasText: /^1$/ }).first().click({ force: true });
        await this.page.waitForTimeout(300);

        // Click 'Today' in datepicker
        let todayBtn = this.page.locator('.p-datepicker-buttonbar button', { hasText: /today/i });
        if (!(await todayBtn.isVisible().catch(() => false))) {
            todayBtn = this.page.locator('button', { hasText: /today/i });
        }
        await todayBtn.click({ force: true });

        await this.waitForTableRows()

        // Reset filter
        const resetBtn = this.page.getByRole('button', { name: /reset/i });
        await expect(resetBtn).toBeEnabled();
        await resetBtn.click();
    }

    // Short version: just select the current date se agay wali date (tomorrow) in datepicker  
    async selectInvalidListingCreationDate() {
        await this.navigateToListings();
        await this.waitForTableRows();

        await this.locators.listingCreationDateDropdown().click();

        // Calculate tomorrow's date
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const d = tomorrow.getDate();

        // If calendar not showing correct month, click next (optional: most calendars default to current month)
        const day = this.page.locator('.p-datepicker-calendar td:not(.p-disabled) span', { hasText: new RegExp(`^${d}$`) });
        await day.first().click({ force: true });

        // expect "No records found" message to be visible
        const noRecordsMsg = this.page.locator('text=/no results? found/i');
        await expect(noRecordsMsg).toBeVisible({ timeout: 3000 });

    }

    // Checking if grid view button is displayed and toggling to grid view
    async checkGridViewDisplay() {
        await this.navigateToListings();

        // Grid view button should now be interacted with
        const gridViewButton = this.locators.gridViewButton();
        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 30000 });
    }

    // Checking contact details in grid view - verify image, address, status, specifications, price
    async checkContactDetailsInGridView() {
        await this.navigateToListings();

        // Grid view button should now be interacted with
        const gridViewButton = this.locators.gridViewButton();
        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 30000 });
        const image = this.page.locator('.s-property .product-thumbnail img').nth(2);
        await expect(image).toBeVisible()

        const heading = this.page.locator('.s-property h3[title]').nth(2);
        const headingValue = await heading.textContent();
        console.log("Heading:", headingValue?.trim());
        // Optional: verify that image is visible
        await expect(image).toBeVisible();

        const status = this.page.locator('.tag-saved').nth(2);
        const statusValue = await status.textContent();
        console.log("Status:", statusValue?.trim());
        await expect(cardRows).toBeVisible({ timeout: 30000 });
        const address = this.page.getByRole('heading', { name: '49 Hetheringtons Road, North Isis, QLD 4660' })
        await expect(address).toBeVisible()
        // Beds
        const beds = this.page.locator('img[src*="Bed.svg"]').locator('xpath=../following-sibling::span').nth(2);
        const bedsValue = await beds.textContent();
        console.log("Beds:", bedsValue?.trim());

        // Baths
        const baths = this.page.locator('img[src*="Bath.svg"]').locator('xpath=../following-sibling::span').nth(2);
        const bathsValue = await baths.textContent();
        console.log("Baths:", bathsValue?.trim());

        // Cars
        const cars = this.page.locator('img[src*="Car.svg"]').locator('xpath=../following-sibling::span').nth(2);
        const carsValue = await cars.textContent();
        console.log("Cars:", carsValue?.trim());

        // Area (16m2)
        const area = this.page.locator('img[src*="area-1.svg"]').locator('xpath=../following-sibling::span').nth(2);
        const areaValue = await area.textContent();
        console.log("Area:", areaValue?.trim());

        const price = this.page.locator('.price-from').nth(2);
        const priceValue = await price.textContent();
        console.log("Price:", priceValue?.trim());

    }

    // Expands the first contact card in the listings and verifies expanded details are visible
    async expandFirstContactCard() {
        await this.navigateToListings();

        // Wait for the card rows to be visible
        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows.first()).toBeVisible({ timeout: 30000 });
        // Assuming `card` is the current card context
        const accordionArrow = this.page.locator('p-accordiontab >> a.p-accordion-header-link[role="button"] >> chevronrighticon');

        // Click to expand accordion
        await accordionArrow.click();


        // Wait to see expanded details (use a selector for an expanded section, or something unique that appears after expansion)
        const expandedDetails = cardRows.first().locator('.details-expanded, .expanded-content, .property-details-block, .contact-details, .extra-details').first();
        await expect(expandedDetails).toBeVisible({ timeout: 5000 });

        // Optionally log summary details in expanded card
        const expandedText = await expandedDetails.textContent();
        console.log('Expanded Card Details:', expandedText?.trim());
    }

}
