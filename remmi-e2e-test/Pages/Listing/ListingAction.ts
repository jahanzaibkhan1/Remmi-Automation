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
        // Ensure the search box is visible and has the correct keyword filled
        await expect(searchBox).toBeVisible({ timeout: 1000 });
        await expect(searchBox).toHaveValue(keyword);

        // Verify there is at least one row/result containing the keyword
        const resultsWithKeyword = this.page.locator(`tr:has-text("${keyword}"), li:has-text("${keyword}"), div:has-text("${keyword}")`);
        const count = await resultsWithKeyword.count();
        // Optionally assert that NO unexpected 'No results' message is present
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
        await searchInput.fill(''); // clear any previous input
        await searchInput.fill(type);
    }

    // Select the property type option from the dropdown
    private async selectPropertyTypeOption(type: string) {
        const option = this.locators.propertyTypeOption(type);
        await option.waitFor({ state: 'visible', timeout: 5000 }); // wait until the option is visible
        await option.click({ force: true });
    }

    private async selectAllPropertyTypes() {
        const dropdown = this.locators.propertyTypeDropdown();
        await dropdown.click();
        const selectAll = this.locators.propertyTypeSelectAll();
        await selectAll.click();
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

        // --- Wait for table rows to update after searching
        await this.waitForTableRows();

        // --- Verify at least one table row contains the keyword in at least one of the visible table cells
        const rows = this.getRowsLocator();
        const rowCount = await rows.count();
        expect(rowCount).toBeGreaterThan(1); // at least header + 1 result

        // Find which columns are visible and searchable (for robust cross-project use)
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

        // Optionally: Assert keyword appears in either "Primary Agent" or "Selected by Agent" columns, if relevant headers are present
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

        // Optionally ensure no "No results found" message is present
        const noResults = this.page.locator('text="No results found"');
        await expect(noResults).toHaveCount(0);

        // --- Clear the search box for cleanup
        const clearButton = this.locators.clearSearch();
        if (await clearButton.isVisible({ timeout: 500 }).catch(() => false)) {
            await clearButton.click();
        } else {
            await searchBox.fill('');
        }
        await expect(searchBox).toHaveValue('');
        await expect(searchBox).toBeVisible({ timeout: 800 });
    }

    // Searching for an invalid listing should show no results
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

    // Searching with special characters in the search box
    async searchWithSpecialCharacters(specialChars: string) {
        await this.navigateToListings();
        await this.waitForTableRows();
        await this.searchListing(specialChars);
        await this.page.waitForTimeout(1000);

        const resultSelector = `tr:has-text("${specialChars}"), li:has-text("${specialChars}"), div:has-text("${specialChars}")`;
        const resultsWithSpecialChars = this.page.locator(resultSelector);
        const count = await resultsWithSpecialChars.count();
        await expect(count).toBeGreaterThan(0);

        // Scroll the first result with the special characters into view if found
        if (count > 0) {
            await resultsWithSpecialChars.first().scrollIntoViewIfNeeded();
        }

        // Clear the search box
        const clearButton = this.locators.clearSearch?.()
            ?? this.page.locator('i').nth(5);
        if (await clearButton.isVisible({ timeout: 500 }).catch(() => false)) {
            await clearButton.click({ force: true });
        } else {
            const searchBox = this.locators.SearchBox();
            await searchBox.fill('');
        }
    }

    // Searching with an empty search field
    async searchWithEmptyField() {
        await this.navigateToListings();

        await this.waitForTableRows();

        // Find the search input and wipe it
        const searchBox = this.locators?.SearchBox?.() ?? this.page.getByRole('textbox', { name: /search/i });
        await searchBox.fill('');
        await searchBox.press('Enter');
        await this.page.waitForTimeout(1000);

        // Re-fetch table rows after search is cleared
        const visibleRows = this.getRowsLocator();
        const visibleRowCount = await this.getRowsCount();
        await expect(visibleRowCount).toBeGreaterThan(1); // should still have header + data
        for (let i = 1; i < visibleRowCount; ++i) {
            await expect(visibleRows.nth(i)).toBeVisible({ timeout: 3000 });
        }

        // Ensure the search box is still empty
        await expect(searchBox).toHaveValue('');
    }

    // Selecting a single property type
    async selectSinglePropertyType() {
        await this.navigateToListings();
        await this.waitForTableRows();

        // Open dropdown and select the first property type
        await this.openPropertyTypeDropdown();
        await this.page.waitForTimeout(1000);
        // Locate and click the first property type option
        const firstPropertyTypeOption = this.page.locator('ul > li.p-element').first();
        await expect(firstPropertyTypeOption).toBeVisible({ timeout: 3000 });
        const selectedLabel = (await firstPropertyTypeOption.innerText()).trim();
        await firstPropertyTypeOption.click({ force: true });
        await this.page.waitForTimeout(1000);

        // Verify in the table that the selected property type appears in at least one row in the Property Type column
        const rows = this.getRowsLocator();
        const rowCount = await this.getRowsCount();
        expect(rowCount).toBeGreaterThan(1);

        // Find the column index for Property Type
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

        // Click Reset to clear the filter for next tests
        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }

    // Selecting multiple property types and verifying in the table
    async selectMultiplePropertyTypes() {
        await this.navigateToListings();
        await this.waitForTableRows();

        // Open the property type dropdown
        await this.openPropertyTypeDropdown();
        await this.page.waitForTimeout(1000);

        // Select two property types (first and second options)
        const propertyTypeOptions = this.page.locator('ul > li.p-element');
        const firstOption = propertyTypeOptions.nth(0);
        const secondOption = propertyTypeOptions.nth(1);

        // Get their labels for later verification
        const firstLabel = (await firstOption.innerText()).trim().toLowerCase();
        const secondLabel = (await secondOption.innerText()).trim().toLowerCase();

        await firstOption.click({ force: true });
        await secondOption.click({ force: true });
        await this.page.waitForTimeout(1000);

        // Verify in the table that selected property types appear in Property Type column
        const rows = this.getRowsLocator();
        const rowCount = await this.getRowsCount();
        expect(rowCount).toBeGreaterThan(1);

        // Find Property Type column index
        const headerRow = rows.nth(0);
        const headerCells = await headerRow.locator('th').allInnerTexts();
        let propertyTypeColIdx = headerCells.findIndex(h => h.trim().toLowerCase().includes('property type'));
        expect(propertyTypeColIdx).toBeGreaterThanOrEqual(0);

        // For each data row, verify at least one selected type is present
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

        // Click the 'Reset' button to clear the selection
        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }

    // Using "Select All" option in property type dropdown
    async selectAllPropertyType() {
        await this.navigateToListings();
        await this.waitForTableRows();

        // Open the property type dropdown
        await this.openPropertyTypeDropdown();
        await this.page.waitForTimeout(1000);

        // Click the "Select All" option (case-insensitive match)
        const selectAllOption = this.page.locator('.checkbox__checkmark').first();
        await selectAllOption.click();
        await this.page.waitForTimeout(1000);

        // Click the 'Reset' button to clear the selection
        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await resetButton.click();
    }

    // Using "Deselect All" option
    async deselectAllPropertyTypes() {
        await this.navigateToListings();
        await this.waitForTableRows();

        // Open the property type dropdown
        await this.openPropertyTypeDropdown();
        await this.page.waitForTimeout(1000);

        // Click the "Select All" checkbox to select all first (if not already)
        const selectAllOption = this.page.locator('.checkbox__checkmark').first();
        await selectAllOption.click();
        await this.page.waitForTimeout(500);

        // Click again to deselect all
        await selectAllOption.click();
        await this.page.waitForTimeout(1000);

        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await resetButton.click();
    }

    // Searching within property type filter and verify data in table
    async searchWithinPropertyTypeFilter(searchTerm: string) {
        await this.navigateToListings();
        await this.waitForTableRows();

        // Open the property type dropdown
        await this.openPropertyTypeDropdown();
        await this.page.waitForTimeout(1000);

        // Locate the search input inside the dropdown and type searchTerm
        const propertyTypeSearchInput = this.page.locator('input[placeholder="Type to search"], input[type="text"][placeholder="Type to search"]');
        await propertyTypeSearchInput.fill(searchTerm);
        await this.page.waitForTimeout(1000);

        // Select the first option that matches the filtered search (if available)
        const matchedOption = this.page.locator('li.p-element').first();
        if (await matchedOption.isVisible()) {
            await matchedOption.click();
        }
        await this.page.waitForTimeout(800);

        // Now verify at least one table row contains the searched property type term
        // This assumes property type appears in at least one column per row after filter
        const rowCount = await this.getRowsCount();
        let found = false;
        for (let i = 1; i < rowCount; ++i) { // Skip header (row 0)
            const row = this.getRowsLocator().nth(i);
            await expect(row).toBeVisible({ timeout: 3000 });
            const rowText = (await row.innerText()).toLowerCase();
            if (rowText.includes(searchTerm.toLowerCase())) {
                found = true;
                break;
            }
        }
        expect(found).toBe(true);

        // Click the Reset button to clear the filter
        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await resetButton.click();
    }

    async selectSinglePropertyAndCloseDropdown() {
        await this.navigateToListings();
        await this.waitForTableRows();
        // Open dropdown and select property type
        await this.openPropertyTypeDropdown();
        await this.page.waitForTimeout(1000);

        // Select the property type from dropdown
        const firstPropertyTypeOption = this.page.locator('ul > li.p-element').first();
        await firstPropertyTypeOption.click({ force: true });
        // Ab close button per click kerwao
        const closeButton = this.page.locator('.pi.pi-times-circle');
        if (await closeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await closeButton.click({ force: true });
        }
        // Click the Reset button to clear filter selection
        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }

    // Selecting a single suburb and verifying table data contains suburb
    async selectSingleSuburb() {
        await this.navigateToListings();
        await this.waitForTableRows();

        // Open suburb dropdown
        const suburbDropdown = this.locators.suburbDropdown();
        await expect(suburbDropdown).toBeVisible({ timeout: 2000 });
        await suburbDropdown.click();
        await this.page.waitForTimeout(1000);

        // Select the first suburb option (assuming options are present)
        const firstSuburbOption = this.page.locator('ul > li.p-element').first();
        await expect(firstSuburbOption).toBeVisible({ timeout: 5000 });
        const firstSuburbTextRaw = await firstSuburbOption.textContent();
        const firstSuburbText = firstSuburbTextRaw ? firstSuburbTextRaw.trim() : '';
        await firstSuburbOption.click({ force: true });
        await this.page.waitForTimeout(1000);

        // Verify that at least one table row contains the selected suburb text
        const rowCount = await this.getRowsCount();
        let found = false;
        for (let i = 1; i < rowCount; ++i) { // Skip header (row 0)
            const row = this.getRowsLocator().nth(i);
            await expect(row).toBeVisible({ timeout: 3000 });
            const rowText = (await row.innerText()).toLowerCase();
            if (firstSuburbText && rowText.includes(firstSuburbText.toLowerCase())) {
                found = true;
                break;
            }
        }
        expect(found).toBe(true);

        // Click the Reset button to clear filter selection for next tests
        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }

    // Selecting multiple suburbs and verifying table data contains the selected suburbs
    async selectMultipleSuburbs() {
        await this.navigateToListings();
        await this.waitForTableRows();

        // Open suburb dropdown
        const suburbDropdown = this.locators.suburbDropdown();
        await expect(suburbDropdown).toBeVisible({ timeout: 2000 });
        await suburbDropdown.click({ force: true });
        await this.page.waitForTimeout(1000);

        // Grab first two suburb options (assuming they exist)
        const allSuburbOptions = this.page.locator('ul > li.p-element');
        const optionCount = await allSuburbOptions.count();
        if (optionCount < 2) {
            throw new Error('Less than two suburb options available to select.');
        }
        const suburb1 = allSuburbOptions.nth(0);
        const suburb2 = allSuburbOptions.nth(1);

        // Get their names/texts for later verification
        const suburb1TextRaw = await suburb1.textContent();
        const suburb2TextRaw = await suburb2.textContent();
        const suburb1Text = suburb1TextRaw ? suburb1TextRaw.trim() : '';
        const suburb2Text = suburb2TextRaw ? suburb2TextRaw.trim() : '';

        await suburb1.click({ force: true });
        await this.page.waitForTimeout(300);
        await suburb2.click({ force: true });
        await this.page.waitForTimeout(1000);

        // Verify that at least one table row contains each of the selected suburb texts
        const rowCount = await this.getRowsCount();

        let foundSuburb1 = false;
        let foundSuburb2 = false;

        for (let i = 1; i < rowCount; ++i) { // Skip header (row 0)
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

        // Click Reset to clear filter selection
        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }

    // Using "Select All" in suburb dropdown
    async selectAllSuburbs() {
        await this.navigateToListings();
        await this.waitForTableRows();

        // Open the suburb dropdown
        const suburbDropdown = this.locators?.suburbDropdown?.() ?? this.page.locator('re-multiselect[placeholder="Suburb"]');
        await expect(suburbDropdown).toBeVisible();
        await suburbDropdown.click({ force: true });

        // Use the locator helper to select the "Select All" checkbox for suburbs
        const selectAllCheckbox = this.locators.suburbSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible();
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(1000);

        // VERIFY: Assert each row is visible (toBeVisible assertion)
        const rows = this.page.locator('tbody tr');
        const rowCount = await rows.count();
        expect(rowCount).toBeGreaterThan(0);

        // Extra assertion: check that at least one row is present and visible
        await expect(rows.first()).toBeVisible();

        for (let i = 0; i < rowCount; i++) {
            await expect(rows.nth(i)).toBeVisible();
        }

        // Click Reset to clear selection
        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await expect(resetButton).toBeVisible();
        await resetButton.click();
    }

    // Using "Deselect All" in suburb dropdown
    async deselectAllSuburbs() {
        await this.navigateToListings();
        await this.waitForTableRows();

        // Open the suburb dropdown using the locator helper for consistency
        const suburbDropdown = this.locators.suburbDropdown();
        await expect(suburbDropdown).toBeVisible();
        await suburbDropdown.click({ force: true });

        // First, select all suburbs by clicking "Select All"
        const selectAllCheckbox = this.locators.suburbSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible();
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(500);

        // Then, deselect all suburbs by clicking "Select All" again
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(500);

        const visibleRows = this.getRowsLocator();
        const visibleRowCount = await this.getRowsCount();
        expect(visibleRowCount).toBeGreaterThan(0);

        // Click Reset to clear filter selection (for next test runs)
        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }

    // Searching for a suburb in the dropdown 
    async searchWithinSuburbDropdown(suburbLabel: string) {
        await this.navigateToListings();
        await this.waitForTableRows();

        // Open the suburb dropdown
        const suburbDropdown = this.locators.suburbDropdown();
        await expect(suburbDropdown).toBeVisible();
        await suburbDropdown.click({ force: true });

        // Find the search input inside the dropdown and type the suburb label
        const searchInput = this.locators.suburbSearchInput();
        await expect(searchInput).toBeVisible();
        await searchInput.fill(suburbLabel);

        // Wait a moment for filter options to update
        await this.page.waitForTimeout(800);

        // Confirm the option with the label exists and is visible
        const suburbOption = this.locators.suburbOption(suburbLabel);
        await expect(suburbOption).toBeVisible();

        // Select the filtered suburb option
        await suburbOption.click({ force: true });

        // Wait for listings to update
        await this.page.waitForTimeout(1000);

        // Assert that the table rows are filtered (should be > 0, but likely < total rows)
        const filteredRowCount = await this.getRowsCount();
        expect(filteredRowCount).toBeGreaterThan(0);

        // Data show honay ka verification: at least ek table row me suburbLabel nazar aaye
        const filteredRows = this.getRowsLocator();
        let dataShown = false;
        // row 0 = header ("th"), usually data rows start from index 1
        for (let i = 1; i < filteredRowCount; ++i) {
            const row = filteredRows.nth(i);
            await expect(row).toBeVisible({ timeout: 3000 });
            // Check the text content of the row for the suburb label (case insensitive)
            const rowText = (await row.innerText()).toLowerCase();
            if (rowText.includes(suburbLabel.toLowerCase())) {
                dataShown = true;
                break;
            }
        }
        // Assertion: data must be shown in at least one row
        expect(dataShown).toBe(true);

        // Click Reset to clear the filter for next tests
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

        // Get all rows and make sure "For Lease" appears in Listing Status column specifically
        const rows = this.getRowsLocator();

        // Get column headers to find Listing Status column index
        const headerRow = rows.nth(0);
        const headerCells = await headerRow.locator('th').allInnerTexts();
        let listingStatusColIdx = headerCells.findIndex(h => h.trim().toLowerCase().includes('listing status'));
        if (listingStatusColIdx === -1) {
            // fallback: try common alternatives
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

    // Selecting multiple listing statuses
    async selectMultipleListingStatuses() {
        await this.navigateToListings();
        await this.waitForTableRows();

        // Open the listing status dropdown
        const listingStatusDropdown = this.locators.listingStatusDropdown();
        await listingStatusDropdown.click();

        // Select the first two listing statuses (make sure at least two exist)
        const statusOptions = this.page.locator('ul > li.p-element');
        const statusCount = await statusOptions.count();
        if (statusCount < 2) {
            throw new Error('Less than two listing statuses available to select.');
        }

        // Capture text of statuses to select so we can verify after
        const selectedStatusLabels: string[] = [];
        const status1 = statusOptions.nth(2);
        const status2 = statusOptions.nth(4);

        // Get and save status texts (lowercased and trimmed for comparison)
        await this.waitForTableRows()
        const status1Label = (await status1.innerText()).trim().toLowerCase();
        const status2Label = (await status2.innerText()).trim().toLowerCase();
        selectedStatusLabels.push(status1Label, status2Label);

        // Click both statuses to select
        await status1.click({ force: true });
        await this.page.waitForTimeout(200);
        await status2.click({ force: true });
        await this.page.waitForTimeout(1000);

        // Get table rows and verify 'Listing Status' column data matches selected statuses
        const rowCount = await this.getRowsCount();
        expect(rowCount).toBeGreaterThan(1);

        // Get all rows
        const rows = this.getRowsLocator();
        // Get headers and locate the Listing Status column index
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
            // Must match one of the two selected statuses
            if (!selectedStatusLabels.some(label => cellText.includes(label))) {
                allRowsMatch = false;
                break;
            }
        }
        expect(allRowsMatch).toBe(true);

        // Reset filter
        await listingStatusDropdown.click();
        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }
    // Using "Select All" in status filter
    async selectAllListingStatuses() {
        await this.navigateToListings();
        await this.waitForTableRows();

        // Open the listing status dropdown
        const listingStatusDropdown = this.locators.listingStatusDropdown();
        await expect(listingStatusDropdown).toBeVisible();
        await listingStatusDropdown.click({ force: true });

        // Select "Select All" checkbox for listing status using locator helper
        const selectAllCheckbox = this.locators.listingStatusSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible();
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(1000);

        // VERIFY: Assert all rows are visible
        const rows = this.page.locator('tbody tr');
        const rowCount = await rows.count();
        expect(rowCount).toBeGreaterThan(0);

        // Extra assertion: at least one row is visible
        await expect(rows.first()).toBeVisible();
        for (let i = 0; i < rowCount; i++) {
            await expect(rows.nth(i)).toBeVisible();
        }

        // Click Reset to clear selection
        await listingStatusDropdown.click();
        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await expect(resetButton).toBeVisible();
        await resetButton.click();
    }

    // Using "Deselect All" in status filter
    async deselectAllListingStatuses() {
        await this.navigateToListings();
        await this.waitForTableRows();

        // Open the listing status dropdown using the locator helper
        const listingStatusDropdown = this.locators.listingStatusDropdown();
        await expect(listingStatusDropdown).toBeVisible();
        await listingStatusDropdown.click({ force: true });

        // Select all statuses by clicking "Select All"
        const selectAllCheckbox = this.locators.listingStatusSelectAll().first();
        await expect(selectAllCheckbox).toBeVisible();
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(500);

        // Deselect all statuses by clicking "Select All" again
        await selectAllCheckbox.click({ force: true });
        await this.page.waitForTimeout(1000);

        // Click Reset to clear filter selection
        await listingStatusDropdown.click();
        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }

    // Searching within listing status filter using locators file
    async searchListingStatusFilter(searchTerm: string) {
        await this.navigateToListings();
        await this.waitForTableRows();

        // Open the listing status dropdown using locator from locators file
        const listingStatusDropdown = this.locators.listingStatusDropdown();
        await expect(listingStatusDropdown).toBeVisible();
        await listingStatusDropdown.click({ force: true });
        await this.page.waitForTimeout(500);

        // Find the search box inside the listing status dropdown using locator
        const statusDropdownSearchBox = this.locators.listingStatusSearchInput?.() 
            ?? this.page.locator('input[placeholder="Search"][aria-label="Search Listing Status"]');
        await expect(statusDropdownSearchBox).toBeVisible();
        await statusDropdownSearchBox.fill(searchTerm);
        await this.page.waitForTimeout(500);

        // Assert that filtered results contain the search term
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
        await listingStatusDropdown.click(); // Close dropdown after test

        await this.page.waitForTimeout(1000)
        // click reset button 
        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }

    // Selecting a single listing type and verifying filtered results (robust header/cell handling)
    async selectSingleListingType() {
        await this.navigateToListings();
        await this.waitForTableRows();

        // Open listing type dropdown using locator
        const listingTypeDropdown = this.locators.listingTypeDropdown();
        await expect(listingTypeDropdown).toBeVisible({ timeout: 3000 });
        await listingTypeDropdown.click({ force: true });
        await this.page.waitForTimeout(500);

        // Wait for at least one visible option
        const allTypeOptions = this.page.locator('ul li.p-element');
        const firstTypeOption = allTypeOptions.first();
        await expect(firstTypeOption).toBeVisible({ timeout: 5000 });

        const selectedTypeTextRaw = await firstTypeOption.textContent();
        const selectedTypeText = selectedTypeTextRaw ? selectedTypeTextRaw.trim() : '';
        await firstTypeOption.click({ force: true });
        await this.page.waitForTimeout(1000);

        // Validate that at least one row in the Listing Type column contains the selected type
        const rows = this.page.locator('tbody tr');
        const rowCount = await rows.count();

        // Defensive: Ensure there are data rows
        expect(rowCount).toBeGreaterThan(0);

        // Get Listing Type column index from table header (thead)
        const headerRow = this.page.locator('thead tr').first();
        await expect(headerRow).toBeVisible({ timeout: 3000 });
        const headerCells = await headerRow.locator('th').allInnerTexts();
        const listingTypeColIdx = headerCells.findIndex(h => h.trim().toLowerCase().includes('listings type'));
        expect(listingTypeColIdx).toBeGreaterThanOrEqual(0);

        // Defensive: Ensure at least one cell in data rows matches filter
        let found = false;
        for (let i = 0; i < rowCount; ++i) {
            const dataRow = rows.nth(i);
            await expect(dataRow).toBeVisible({ timeout: 3000 });
            const cells = dataRow.locator('td');
            const cellCount = await cells.count();
            if (listingTypeColIdx >= cellCount) continue; // skip malformed row

            const cellText = (await cells.nth(listingTypeColIdx).innerText()).trim().toLowerCase();
            if (selectedTypeText && cellText.includes(selectedTypeText.toLowerCase())) {
                found = true;
                break;
            }
        }
        expect(found).toBe(true);

        // Click Reset for the next test
        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeEnabled();
        await resetButton.click();
    }
}
