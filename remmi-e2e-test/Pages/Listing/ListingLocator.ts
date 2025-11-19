import { Page, Locator } from '@playwright/test';
export class ListingLocators {

    constructor(private page: Page) { }

    ListingTab(): Locator {
        return this.page.locator("li.list.sideMenu.justify-center[data-label='Listings']");
    }
    SearchBox(): Locator {
        return this.page.locator('#keywordInput, [role="textbox"][name="Search"]');
    }
    clearSearch(): Locator {
        return this.page.locator('i').nth(5);
    }
}