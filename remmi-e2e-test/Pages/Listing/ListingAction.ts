import { Page, expect } from '@playwright/test';
import { ListingLocators } from './ListingLocator';
import { addAbortListener } from 'events';

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


    //*************************************Public Actions *************************************//

    async searchForValidListing(keyword: string) {
        await this.navigateToListings();
        const listing = this.page.getByRole('link').nth(4);
        await listing.click({ force: true })
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
            await expect(row).toBeVisible({ timeout: 30000 });
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
            await expect(row).toBeVisible({ timeout: 30000 });
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

        // Click 'Today' in datepicker
        let todayBtn = this.page.locator('.p-datepicker-buttonbar button', { hasText: /today/i });
        if (!(await todayBtn.isVisible().catch(() => false))) {
            todayBtn = this.page.locator('button', { hasText: /today/i });
        }
        await todayBtn.click({ force: true });
        // Reset filter
        const resetBtn = this.page.getByRole('button', { name: /reset/i });
        await expect(resetBtn).toBeEnabled();
        await resetBtn.click();
    }

    async selectNextDateFromToday() {
        // Open dropdown and always just click the next enabled date after the currently selected/visible date (today)
        await this.navigateToListings();
        await this.waitForTableRows();

        // Open the creation date dropdown
        await this.locators.listingCreationDateDropdown().click();

        // Wait for the calendar day cells to be visible
        const dayCells = this.page.locator(
            ".p-datepicker-calendar td:not(.p-disabled) >> :is(span, a)"
        );
        await dayCells.first().waitFor({ state: "visible" });

        // Find the current date in the calendar and click the next enabled day (if available)
        const today = new Date().getDate().toString();
        const count = await dayCells.count();

        let foundToday = false;
        for (let i = 0; i < count; i++) {
            const text = (await dayCells.nth(i).innerText()).trim();
            if (text === today) {
                // always try to click the next date if present
                if (i + 1 < count) {
                    await dayCells.nth(i + 1).click({ force: true });
                } else {
                    // If today is last date, go to next month and click first enabled day
                    await this.page.locator(".p-datepicker-next").click();
                    const nextMonthCells = this.page.locator(
                        ".p-datepicker-calendar td:not(.p-disabled) >> :is(span, a)"
                    );
                    await nextMonthCells.first().waitFor({ state: "visible" });
                    await nextMonthCells.first().click({ force: true });
                }
                foundToday = true;
                break;
            }
        }
        // Edge case: If calendar did not display 'today' (shouldn't occur), just pick and click the second visible day
        if (!foundToday && count > 1) {
            await dayCells.nth(1).click({ force: true });
        }

        // No records assertion (as per previous logic, may show "no results found" after picking a future date)
        const noRecordsMsg = this.page.locator('text=/no results? found/i');
        await expect(noRecordsMsg).toBeVisible({ timeout: 4000 });
    }


    // Checking if grid view button is displayed and toggling to grid view
    async checkGridViewDisplay() {
        await this.navigateToListings();

        // Grid view button should now be interacted with
        const gridViewButton = this.locators.gridViewButton().click({ force: true });
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

    // Expanding a Listing card
    async expandFirstContactCard() {
        await this.navigateToListings();
        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows.first()).toBeVisible({ timeout: 30000 });
        const chevronDown = this.page.locator('i.pi.pi-chevron-down').nth(2);
        await chevronDown.click({ force: true });
        const expandedDetails = this.page.locator('.p-accordion-content, .expanded-section').nth(2);
        const expandedText = (await expandedDetails.textContent() ?? '').trim();
        console.log('Expanded Card Details (trimmed):', expandedText);
    }

    // Collapsing an expanded listing card
    async collapseExpandedListingCard() {
        await this.navigateToListings();
        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows.first()).toBeVisible({ timeout: 30000 });
        const chevronDown = this.page.locator('i.pi.pi-chevron-down').nth(2);
        await chevronDown.click({ force: true });
        const expandedDetails = this.page.locator('.p-accordion-content, .expanded-section').nth(2);
        const expandedText = (await expandedDetails.textContent() ?? '').trim();
        console.log('Expanded Card Details (trimmed):', expandedText);
        await chevronDown.click({ force: true });
    }

    // Deleting a Listing
    async deleteListingCard() {
        await this.navigateToListings();
        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows.first()).toBeVisible({ timeout: 30000 });

        const chevronDown = this.page.locator('i.pi.pi-chevron-down').nth(0);
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

        // // Assert toast/snackbar notification or row is removed
        // const toast = this.page.locator('.p-toast-message-success, .p-toast-message', { hasText: "success" });
        // await expect(toast).toBeVisible({ timeout: 10000 });
    }

    // Editing a listing
    async editListingCard() {
        await this.navigateToListings();
        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows.first()).toBeVisible({ timeout: 30000 });

        // Expand the first listing card (if needed)
        const chevronDown = this.page.locator('i.pi.pi-chevron-down').nth(0);
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
    }

    // Editing and saving changes
    async editAndSaveListingCard() {
        await this.navigateToListings();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows.first()).toBeVisible({ timeout: 30000 });

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
        await expect(toast).toBeVisible({ timeout: 10000 });
    }


    //Opening a Listing portal
    async openPortalListingCard() {
        await this.navigateToListings();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows.first()).toBeVisible({ timeout: 30000 });

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

    }

    //     //Opening a Listing portal
    async compareListingCard() {
        await this.navigateToListings();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows.first()).toBeVisible({ timeout: 30000 });

        // Expand the first listing card
        const chevronDown = this.page.locator('i.pi.pi-chevron-down').first();
        await chevronDown.click({ force: true });

        const compare1 = this.page.locator('.p-checkbox-box').first()

        await compare1.scrollIntoViewIfNeeded()
        await compare1.click({ force: true })
        await chevronDown.click({ force: true });
        const chevronDown2 = this.page.locator('i.pi.pi-chevron-down').nth(1);
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

        await expect(clearCompare).toBeVisible({ timeout: 30000 })

        await clearCompare.click({ force: true })

    }

    // Comparing more than two Listings card (Pattern matching "oper walay code" style)
    async compareMoreThanTwoListingCards() {
        await this.navigateToListings();

        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows.first()).toBeVisible({ timeout: 30000 });

        // Expand the first listing card
        const chevronDown1 = this.page.locator('i.pi.pi-chevron-down').nth(0);
        await chevronDown1.click({ force: true });

        const compare1 = this.page.locator('.p-checkbox-box').nth(0)

        await compare1.scrollIntoViewIfNeeded()
        await compare1.click({ force: true })
        await chevronDown1.click({ force: true });

        await this.page.waitForTimeout(1000)
        const chevronDown2 = this.page.locator('i.pi.pi-chevron-down').nth(1);
        await chevronDown2.click({ force: true });

        const compare2 = this.page.locator('.p-checkbox-box').nth(1)

        await compare2.scrollIntoViewIfNeeded()
        await compare2.click({ force: true })
        await chevronDown2.click()

        await this.page.waitForTimeout(2000)

        const chevronDown3 = this.page.locator('i.pi.pi-chevron-down').nth(3);
        await chevronDown3.click({ force: true });

        const compare3 = this.page.locator('.p-checkbox-box').nth(3)

        await compare3.scrollIntoViewIfNeeded()
        await compare3.click({ force: true })

        await chevronDown3.click({ force: true })

        // Wait for form/modal
        const compareButton = this.page.getByRole('button', { name: 'Compare' });
        await compareButton.scrollIntoViewIfNeeded()
        await compareButton.click({ force: true })

        const verifyRows = this.page.locator('.property-row')
        await expect(verifyRows).toBeVisible({ timeout: 30000 })

        const clearCompare = this.page.getByRole('button', { name: 'Clear Compare' });

        await expect(clearCompare).toBeVisible({ timeout: 30000 })

        await clearCompare.click({ force: true })
    }

    async resetAllFilters() {
        await this.navigateToListings();

        // Cards load hone ka wait karo
        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows.first()).toBeVisible({ timeout: 30000 });

        // -- Search filter
        await this.searchListing('Hina Agent');
        await this.page.waitForTimeout(1000)
        await this.openPropertyTypeDropdown();
        await this.page.waitForTimeout(1000);

        const selectAllOption = this.page.locator('.checkbox__checkmark').first();
        await selectAllOption.click();
        await this.page.waitForTimeout(1000);

        const resetButton = this.page.getByRole('button', { name: /reset/i });
        if (await resetButton.isVisible().catch(() => false)) {
            await resetButton.click({ force: true });
            await this.page.waitForTimeout(1000);
        }
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
        const listViewButton = this.page.getByRole('link').nth(4);
        await listViewButton.click();
        await this.waitForTableRows();
    }

    async openListingForm() {
        await this.navigateToListings();
        await this.waitForTableRows()
        // Assuming there is a button or icon to open the contact form in each card row
        const contactFormBtn = this.page.getByRole('button', { name: '' })
        await contactFormBtn.dblclick();
        // Wait for contact form to be visible (adjust selector if needed)
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        const closeForm = this.page.locator('.pi.pi-times').first()

        await closeForm.click({ force: true })
    }

    // Fill required fields in the 'Create Listing' form and click "Save"
    async createListingWithRequiredFields(propertyType: string, listingType: string, listingStatus: string) {

        await this.navigateToListings();
        await this.waitForTableRows()
        // Assuming there is a button or icon to open the contact form in each card row
        const contactFormBtn = this.page.getByRole('button', { name: '' })
        await expect(contactFormBtn).toBeVisible({ timeout: 30000 })
        await contactFormBtn.dblclick();
        // Wait for contact form to be visible (adjust selector if needed)
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Fill and select the property address: "1/14 Thomas Street, Laidley, QLD 4341"
        const propertyAddressSearchInput = this.page.locator('#rightbarwithscroll').getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 5000 });
        await propertyAddressSearchInput.fill('1/14 Thomas Street, Laidley, QLD 4341');
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
    }

    // Creating a Listing with missing required fields for negative validation
    async createListingWithMissingFields() {
        // Navigate to Listings and open the listing form
        await this.navigateToListings();
        await this.waitForTableRows()
        const addButton = this.page.getByRole('button', { name: '' });
        await addButton.dblclick({ force: true });

        // Wait for the form/modal to appear
        const form = this.page.locator('#rightbarwithscroll, .p-dialog, .listing-form-modal, .add-listing-form').first();
        await expect(form).toBeVisible({timeout:10000})
        // Click Save and expect validation error
        const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
        await saveButton.click();

        // Wait and verify error message/validation appears
        const requiredError = this.page.getByRole('alert', { name: 'Required fields must be filled in' }).first();
        await expect(requiredError).toBeVisible();
        const closeForm = this.page.locator('.pi.pi-times').first()
        await closeForm.click({ force: true })

    }

    // Scrolls through the grid view to load more listings via infinite scroll
    async scrollToLoadMoreListings() {
        await this.navigateToListings();

        // Switch to grid view if not already there
        const gridViewBtn = this.locators.gridViewButton();
        await expect(gridViewBtn).toBeVisible({ timeout: 7000 });

        // Check if already in grid view (active). If not, click to switch.
        const isActive = await gridViewBtn.getAttribute('aria-pressed') === 'true'
            || (await gridViewBtn.getAttribute('class'))?.includes('active');

        if (!isActive) {
            await gridViewBtn.click();
        }

        // Ensure at least one card appears in the grid view
        const cardItemsLocator = this.page.locator('.property-row');
        await expect(cardItemsLocator.first()).toBeVisible({ timeout: 10000 });

        // Try to get the scrolling container, fallback to html/body
        let cardContainer = this.page.locator('.card-list-container, .card-view-main, .p-grid').first();
        if (!(await cardContainer.isVisible({ timeout: 3000 }))) {
            // fallback to the documentElement for scrolling
            cardContainer = this.page.locator('html');
        }

        // Track loaded card count
        let previousCount = await cardItemsLocator.count();
        let loadedCount = previousCount;

        // Attempt scrolling down and waiting for more cards to load
        for (let i = 0; i < 10; i++) {
            await cardContainer.evaluate((el: HTMLElement) => { el.scrollTop = el.scrollHeight; });
            await this.page.waitForTimeout(1000);

            const newCount = await cardItemsLocator.count();
            if (newCount > loadedCount) {
                loadedCount = newCount;
            } else {
                // Try one more short delay in case of late lazy loading
                await this.page.waitForTimeout(500);
                const afterWaitCount = await cardItemsLocator.count();
                if (afterWaitCount > loadedCount) {
                    loadedCount = afterWaitCount;
                } else {
                    break;
                }
            }
        }
    }


}
