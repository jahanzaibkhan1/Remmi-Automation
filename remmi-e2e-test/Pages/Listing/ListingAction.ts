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
        await listingTab.click({ force: true });
    }

    private async searchListing(keyword: string) {
        const searchBox = this.locators.SearchBox();
        await searchBox.click()
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
        await dropdown.click({ force: true });
    }

    private async searchPropertyType(type: string) {
        const searchInput = this.locators.propertyTypeSearchInput();
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
        await this.page.waitForTimeout(3000);
        await this.searchListing(keyword);
        await this.verifySearchResults(keyword);

        await this.page.waitForTimeout(1000);

        const searchBox = this.locators.SearchBox();
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
        await this.page.waitForTimeout(500);
        await this.searchListing(keyword);
        await this.page.waitForTimeout(1000);

        const noResults = this.page.getByText('No results found');
        await expect(noResults).toBeVisible({ timeout: 5000 })

        const clearButton = this.page.locator('i').nth(5);
        await clearButton.click({ force: true })
    }

    // Searching with special characters in the search box
    async searchWithSpecialCharacters(specialChars: string) {
        await this.navigateToListings();
        await this.page.waitForTimeout(500);
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
        await this.page.waitForTimeout(500)
        const searchBox = this.locators?.SearchBox?.() ?? this.page.getByRole('textbox', { name: /search/i });
        await searchBox.fill('');
        await searchBox.press('Enter');
        await this.page.waitForTimeout(1000);

        // Expect all data rows to be visible (i.e., search reset displays all listings)
        const allRows = this.page.locator('tr');
        const rowCount = await allRows.count();
        // Adjust the minimum expected row count as per your app's default data (1 for header, >1 for data, etc.)
        await expect(rowCount).toBeGreaterThan(1); // Ensures there are multiple rows shown
        for (let i = 1; i < rowCount; ++i) {  // Skipping header row (usually at index 0)
            await expect(allRows.nth(i)).toBeVisible({ timeout: 3000 });
        }

        // Ensure the search box is still empty
        await expect(searchBox).toHaveValue('');
    }

    // Selecting a single property type
    async selectSinglePropertyType() {
        await this.navigateToListings();

        await this.page.waitForTimeout(500)
        // Open dropdown and select property type
        await this.openPropertyTypeDropdown();
        await this.page.waitForTimeout(1000)

        // Select the property type from dropdown
        const firstPropertyTypeOption = this.page.locator('ul > li.p-element').first();
        await firstPropertyTypeOption.click({ force: true });

        const resetButton = this.page.locator('button').filter({ hasText: /reset/i });
        await resetButton.click()
    }

    // Selecting multiple property types
    async selectMultiplePropertyTypes() {
        await this.navigateToListings();
        await this.page.waitForTimeout(500);

        // Open the property type dropdown
        await this.openPropertyTypeDropdown();
        await this.page.waitForTimeout(1000);

        // Select two property types (first and second options)
        const propertyTypeOptions = this.page.locator('ul > li.p-element');
        const firstOption = propertyTypeOptions.nth(0);
        const secondOption = propertyTypeOptions.nth(1);

        await firstOption.click({ force: true });
        await secondOption.click({ force: true });

        await this.page.waitForTimeout(1000)

        // Click the 'Reset' button to clear the selection
        const resetButton = this.page.locator('button').filter({ hasText: /reset/i });
        await resetButton.click();
    }

    // Using "Select All" option in property type dropdown
    async selectAllPropertyType() {
        await this.navigateToListings();
        await this.page.waitForTimeout(500);
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

}
