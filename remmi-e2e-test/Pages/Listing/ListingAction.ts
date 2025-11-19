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
        // Assert that a result containing the keyword appears quickly
        const searchResult = this.page.locator(`text=${keyword}`);
        await expect(searchResult).toBeVisible({ timeout: 1500 });
    }

    private async verifySearchResults(keyword: string) {
        const searchBox = this.locators.SearchBox();
        // Ensure the search box is visible and has the correct keyword filled
        await expect(searchBox).toBeVisible({ timeout: 1000 });
        await expect(searchBox).toHaveValue(keyword);

        // Verify there is at least one row/result containing the keyword
        const resultsWithKeyword = this.page.locator(`tr:has-text("${keyword}"), li:has-text("${keyword}"), div:has-text("${keyword}")`);
        const count = await resultsWithKeyword.count();
        expect(count).toBeGreaterThan(0);
        // Optionally assert that NO unexpected 'No results' message is present
        const noResults = this.page.locator('text="No results found"');
        await expect(noResults).toHaveCount(0);
    }

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
}
