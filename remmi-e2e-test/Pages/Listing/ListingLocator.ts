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
    propertyTypeDropdown(): Locator {
        return this.page.locator('re-multiselect[placeholder="Property Type"]');
    }
    propertyTypeSearchInput(): Locator {
        return this.page.locator('input[placeholder="Type to search"], input[type="text"][placeholder="Type to search"]');
    }
    propertyTypeSelectAll(): Locator {
        return this.page.locator('.checkbox__checkmark').first();
    }
    propertyTypeOption(label: string) {
        return this.page.locator('li.p-element', { hasText: label });
    }

    suburbDropdown(): Locator {
        return this.page.locator('re-multiselect[placeholder="Suburb"]');
    }
    suburbSearchInput(): Locator {
        return this.page.locator('input[placeholder="Type to search"], input[type="text"][placeholder="Type to search"]');
    }
    suburbSelectAll(): Locator {
        return this.page.locator('.checkbox__checkmark'); // adjust nth if Suburb select all is not first
    }
    suburbOption(label: string) {
        return this.page.locator('li.p-element', { hasText: label });
    }
    // Listing Status k hain yeah

    listingStatusDropdown(): Locator {
        return this.page.locator('re-multiselect[placeholder="Listing Status"]');
    }
    listingStatusSearchInput(): Locator {
        return this.page.locator('input[placeholder="Type to search"], input[type="text"][placeholder="Type to search"]');
    }
    listingStatusSelectAll(): Locator {
        return this.page.locator('.checkbox__checkmark'); // Adjust nth if needed for Listing Status
    }
    listingStatusOption(label: string) {
        return this.page.locator('li.p-element', { hasText: label });
    }

    listingTypeDropdown(): Locator {
        return this.page.locator('re-multiselect[placeholder="Listing Type"]');
    }
    listingTypeSearchInput(): Locator {
        return this.page.locator('input[placeholder="Type to search"], input[type="text"][placeholder="Type to search"]');
    }
    listingTypeSelectAll(): Locator {
        return this.page.locator('.checkbox__checkmark'); // Adjust nth if needed for Listing Type
    }
    listingTypeOption(label: string) {
        return this.page.locator('li.p-element', { hasText: label });
    }

}