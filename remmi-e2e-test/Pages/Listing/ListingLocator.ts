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
        return this.page.locator('re-multiselect').filter({ hasText: 'Property Type' }).getByPlaceholder('Search');
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
        return this.page.locator('re-multiselect').filter({ hasText: 'Suburb' }).getByPlaceholder('Search')
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
        return this.page.locator('re-multiselect').filter({ hasText: 'Listing Status' }).getByPlaceholder('Search');
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
        return this.page.locator('re-multiselect').filter({ hasText: 'Listing Type' }).getByPlaceholder('Search');
    }
    listingTypeSelectAll(): Locator {
        return this.page.locator('.checkbox__checkmark'); // Adjust nth if needed for Listing Type
    }
    listingTypeOption(label: string) {
        return this.page.locator('li.p-element', { hasText: label });
    }

    // Select By Agent Filters
    selectByAgentDropdown(): Locator {
        return this.page.locator('//span[@class="placeHolder ng-star-inserted" and text()="Select by Agent"]');
    }
    selectByAgentSearchInput(): Locator {
        // Try common search input patterns (fallback to a broad match for stability)
        return this.page.locator('re-multiselect').filter({ hasText: 'Select by Agent Abdul Live' }).getByPlaceholder('Search').first();
    }
    selectByAgentSelectAll(): Locator {
        return this.page.locator('.checkbox__checkmark').first(); // May need .first() if multiple checkmarks on page
    }
    selectByAgentOption(label: string) {
        return this.page.locator('li.p-element', { hasText: label });
    }

    contractStatusDropdown(): Locator {
        return this.page.locator('re-multiselect[placeholder="Contract Status"]');
    }
    contractStatusSearchInput(): Locator {
        return this.page.locator('re-multiselect').filter({ hasText: 'Contract Status' }).getByPlaceholder('Search');
    }
    contractStatusSelectAll(): Locator {
        return this.page.locator('.checkbox__checkmark').first(); // Adjust nth if needed for Contract Status
    }
    contractStatusOption(label: string) {
        return this.page.locator('li.p-element', { hasText: label });
    }

    listingCreationDateDropdown(): Locator {
        return this.page.locator("input[placeholder='Listing Creation Date']");
    }
    listingCreationDateSearchInput(): Locator {
        return this.page.locator('input[placeholder="Type to search"], input[type="text"][placeholder="Type to search"]');
    }
    listingCreationDateSelectAll(): Locator {
        return this.page.locator('.checkbox__checkmark'); // Adjust nth if needed for Listing Creation Date filter
    }
    listingCreationDateOption(label: string): Locator {
        return this.page.locator('li.p-element', { hasText: label });
    }

    gridViewButton(): Locator {
        return this.page.locator('img.grid-svg-image');
    }
    // Card view property row locator for listings
    cardViewPropertyRow(): Locator {
        return this.page.locator('.property-row.pl-1.ng-star-inserted')
    }

    adminDefaultButton(): Locator {
        return this.page.getByText('Admin Default').first()
    }

    // Admin view button (if any specific admin-only UI element needed)
    adminView(): Locator {
        // Adjust the selector as per actual admin view button/control
        return this.page.getByText('View OptionsSaveSelect')
    }

    hideStatus():Locator{
        return this.page.locator('._flex_between > img').nth(0)
    }

    hideAllButton(): Locator {
        return this.page.getByText('Hide All');
    }
    showAllButton(): Locator {
        return this.page.getByText('Show All');
    }

    dragHandle(): Locator {
        return this.page.locator('.cdk-drag.column-item.custom-field-views');
    }
    
    plusButton(): Locator {
        return this.page.locator('.cursor-pointer > img').first();
    }

    viewNameInput(): Locator {
        return this.page.locator('input[placeholder="View name"]');
    }

    // write locator for share 

    shareIcon(): Locator {
        return this.page.locator('.cursor-pointer > img').last();
    }

    selectUser():Locator{
        return this.page.locator("//span[normalize-space()='Select Users']").first();
    }

    selectTeams(): Locator{
        return this.page.locator("//span[normalize-space()='Select Teams']").first();
    }

    shareButton():Locator{
        return this.page.getByRole('button', { name: /share/i }).first()
    }

    filterIcon(): Locator {
        // Returns the filter icon for the "Listing Status" column
        return this.page.getByRole('img', { name: 'filter' }).nth(1);
    }

    sortingIcon(): Locator {
        return this.page.locator(
          'div.d-flex.align-items-center:has(p:text("Listing Status")) p-sorticon .p-sortable-column-icon'
        );
      }

      propertyTab(): Locator{
        return this.page.locator("//p[normalize-space()='Properties']");
      }
    
}