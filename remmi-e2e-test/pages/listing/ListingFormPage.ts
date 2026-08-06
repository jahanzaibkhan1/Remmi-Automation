import { expect } from '@playwright/test';
import { ListingBasePage } from './ListingBasePage';
import { faker } from '@faker-js/faker';

export class ListingFormPage extends ListingBasePage {
    async closeFormWithoutSaving() {
        await this.navigateToListings();
        await this.switchToListView()
        await this.waitForTableRows()
        // Assuming there is a button or icon to open the contact form in each card row
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick({ force: true });
        // Wait for contact form to be visible (adjust selector if needed)
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Fill and select the property address: "1/14 Thomas Street, Laidley, QLD 4341"
        const propertyAddressSearchInput = this.page.locator('#rightbarwithscroll').getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 10000 });
        await propertyAddressSearchInput.fill('140 Coates Street, Laidley, QLD 4341');
        // Wait for dropdown/options to appear and select the address
        const addressOption = this.page.locator('div:nth-child(2) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 10000 });
        await addressOption.click();

        const listingsTypeDropdown = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).getByRole('combobox');
        await expect(listingsTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingsTypeDropdown.click();

        // Search 'Auction' inside Listings Type dropdown
        const listingsTypeSearchInput = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).locator('input[type="text"]');
        await expect(listingsTypeSearchInput).toBeVisible({ timeout: 10000 });
        await listingsTypeSearchInput.fill('Auction');
        await this.page.waitForTimeout(500);

        const auctionOption = this.page.getByRole('option', { name: 'Auction' });
        await auctionOption.waitFor({ state: 'visible' });
        await auctionOption.click();

        const listingStatusDropdown = this.page.locator('ng-select').filter({ hasText: 'Listing Status' });
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        const forSaleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'For sale' }).first();
        await expect(forSaleOption).toBeVisible({ timeout: 10000 });
        await forSaleOption.click();

        await this.closeModalIfVisible();

        await this.page.waitForTimeout(1000);
    }

    // Pinning a listing card row via right-click context menu
    async pinFirstListing() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Wait for cards to appear
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });

        // Check if the first card is already pinned
        const firstCard = cards.first();
        const pinnedIconOnFirstCard = firstCard.locator('img[src*="pin"]');

        if (await pinnedIconOnFirstCard.isVisible({ timeout: 2000 }).catch(() => false)) {
            console.log("First listing is already pinned, skipping pin.");
            return;
        }
        await firstCard.click({ button: 'right' });

        // Click "Pin To Dashboard" in the context menu
        const pinToDashboardMenuItem = this.page.getByText('Pin To Dashboard').first();
        await expect(pinToDashboardMenuItem).toBeVisible({ timeout: 10000 });
        await pinToDashboardMenuItem.click();

        // Assert the pinned icon appears now
        const pinnedIcon = firstCard.locator('img[src*="pin"]');
        await expect(pinnedIcon).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1000);
    }

    // Opening a pinned listing
    async openPinnedListing() {
        await this.navigateToListings();
        await this.switchToGridView();

        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });
        // Find a pinned icon in the grid and click it to open the pinned listing
        const pinnedIcon = this.page.locator('app-props-grid img[src*="pin"]').first();
        await expect(pinnedIcon).toBeVisible({ timeout: 10000 });
        // Click on the first card
        const firstCard = this.page.locator('.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 10000 });
        await firstCard.click();
        // Wait for the details modal or rightbar to appear
        const listingDetails = this.page.locator('#rightbarwithscroll');
        await expect(listingDetails).toBeVisible({ timeout: 10000 });
        // Optionally, close the details modal
        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);
        await this.page.waitForTimeout(1000);
    }

    // Unpin a pinned listing card in the grid view
    async unpinFirstPinnedListing() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Wait for cards to appear
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });

        await this.page.waitForTimeout(1200);

        // Find the pinned icon in the grid, assuming first pinned card
        const pinnedIcon = this.page.locator('app-props-grid img[src*="pin"]').first();
        await expect(pinnedIcon).toBeVisible({ timeout: 10000 });

        const firstCard = this.page.locator('.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 10000 });
        await firstCard.click({ button: 'right' });
        // Click "Unpin to Dashboard" in the context menu
        const unpinMenuItem = this.page.getByText('Unpin to Dashboard').first();
        await unpinMenuItem.waitFor({ state: 'visible', timeout: 10000 });
        await this.page.waitForTimeout(1000);
        await unpinMenuItem.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    // Search field functionality for Listings table
    async searchfieldListing() {
        await this.navigateToListings();

        await this.navigateToListings();
        await this.switchToGridView();
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });
        // Assuming there is a button or icon to open the contact form in each card row
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick({ force: true });
        // Wait for contact form to be visible (adjust selector if needed)
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Fill and select the property address: "1/14 Thomas Street, Laidley, QLD 4341"
        const propertyAddressSearchInput = this.page.locator('#rightbarwithscroll').getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 10000 });
        await propertyAddressSearchInput.type('140 Coates Street, Laidley, QLD 4341', { delay: 100 });
        // Wait for dropdown/options to appear and select the address
        const addressOption = this.page.locator('div:nth-child(1) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 15000 });
        await addressOption.click();

        // Wait for the dialog and click Yes
        const copyDialog = this.page.getByText('Would you like to copy this');
        await expect(copyDialog).toBeVisible({ timeout: 15000 });
        const yesButton = this.page.getByRole('button', { name: 'Yes' });
        await expect(yesButton).toBeVisible({ timeout: 15000 });
        await yesButton.click();

        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);

        await this.page.waitForTimeout(1000);

    }

    // Select a listing from search result
    async selectListingFromSearch() {
        await this.navigateToListings();
        await this.switchToGridView();
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });
        // Assuming there is a button or icon to open the contact form in each card row
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick({ force: true });
        // Wait for contact form to be visible (adjust selector if needed)
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Fill and select the property address: "1/14 Thomas Street, Laidley, QLD 4341"
        const propertyAddressSearchInput = this.page.locator('#rightbarwithscroll').getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 10000 });
        await propertyAddressSearchInput.type('140 Coates Street, Laidley, QLD 4341', { delay: 100 });
        // Wait for dropdown/options to appear and select the address
        const addressOption = this.page.locator('div:nth-child(1) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 10000 });
        await addressOption.click();

        // Wait for the dialog and click Yes
        const copyDialog = this.page.getByText('Would you like to copy this');
        await expect(copyDialog).toBeVisible({ timeout: 10000 });

        const crossicon = this.page.locator('button.p-dialog-header-close').first();
        await expect(crossicon).toBeVisible({ timeout: 10000 });
        await crossicon.click();

        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);
    }

    async confirmListingCopy() {
        await this.navigateToListings();

        await this.navigateToListings();
        await this.switchToGridView();
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });
        // Assuming there is a button or icon to open the contact form in each card row
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick({ force: true });
        // Wait for contact form to be visible (adjust selector if needed)
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Fill and select the property address: "1/14 Thomas Street, Laidley, QLD 4341"
        const propertyAddressSearchInput = this.page.locator('#rightbarwithscroll').getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 10000 });
        await propertyAddressSearchInput.type('140 Coates Street, Laidley, QLD 4341', { delay: 100 });
        // Wait for dropdown/options to appear and select the address
        const addressOption = this.page.locator('div:nth-child(1) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 20000 });
        await addressOption.click();

        // Wait for the dialog and click Yes
        const copyDialog = this.page.getByText('Would you like to copy this');
        await expect(copyDialog).toBeVisible({ timeout: 20000 });
        const yesButton = this.page.getByRole('button', { name: 'Yes' });
        await expect(yesButton).toBeVisible({ timeout: 20000 });
        await yesButton.click();

        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);

    }

    // Decline listing copy dialog
    async declineListingCopy() {
        await this.navigateToListings();
        await this.switchToGridView();
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });
        // Open the contact form (or listing dialog)
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick({ force: true });
        // Wait for contact form to be visible
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Fill and select the property address to trigger the copy dialog
        const propertyAddressSearchInput = this.page.locator('#rightbarwithscroll').getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 10000 });
        await propertyAddressSearchInput.type('140 Coates Street, Laidley, QLD 4341', { delay: 100 });
        // Wait for dropdown/options to appear and select the address
        const addressOption = this.page.locator('div:nth-child(1) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 10000 });
        await addressOption.click();

        // Wait for the copy dialog and decline it
        const copyDialog = this.page.getByText('Would you like to copy this');
        await expect(copyDialog).toBeVisible({ timeout: 10000 });
        const noButton = this.page.getByRole('button', { name: 'No' });
        await expect(noButton).toBeVisible({ timeout: 10000 });
        await noButton.click({ force: true });

        // Optional: close the contact form after declining
        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);
    }

    async closePopup() {
        await this.navigateToListings();
        await this.switchToGridView();
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });
        // Open the contact form (or listing dialog)
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick({ force: true });
        // Wait for contact form to be visible
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Fill and select the property address to trigger the copy dialog
        const propertyAddressSearchInput = this.page.locator('#rightbarwithscroll').getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 10000 });
        await propertyAddressSearchInput.type('140 Coates Street, Laidley, QLD 4341', { delay: 100 });
        // Wait for dropdown/options to appear and select the address
        const addressOption = this.page.locator('div:nth-child(1) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 10000 });
        await addressOption.click();

        // Wait for the copy dialog and decline it
        const copyDialog = this.page.getByText('Would you like to copy this');
        await expect(copyDialog).toBeVisible({ timeout: 10000 });
        // Click the close ("X") icon in the dialog header to close the dialog
        const crossIcon = this.page.locator('button.p-dialog-header-close').first();
        await expect(crossIcon).toBeVisible({ timeout: 10000 });
        await crossIcon.click({ force: true });


        // Optional: close the contact form after declining
        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);
        await this.page.waitForTimeout(1000);
    }

    async resetSearchField() {
        await this.navigateToListings();
        await this.switchToGridView();
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });
        // Open the contact form (or listing dialog)
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick({ force: true });
        // Wait for contact form to be visible
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Fill and select the property address to trigger the copy dialog
        const propertyAddressSearchInput = this.page.locator('#rightbarwithscroll').getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 10000 });
        await propertyAddressSearchInput.type('140 Coates Street, Laidley, QLD 4341', { delay: 100 });
        // Wait for dropdown/options to appear and select the address
        const addressOption = this.page.locator('div:nth-child(1) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 10000 });
        await addressOption.click();

        // Wait for the copy dialog and decline it
        const copyDialog = this.page.getByText('Would you like to copy this');
        await expect(copyDialog).toBeVisible({ timeout: 10000 });
        const noButton = this.page.getByRole('button', { name: 'No' });
        await expect(noButton).toBeVisible({ timeout: 10000 });
        await noButton.click({ force: true });
        const crossicon = this.page.locator('.pi.pi-times._cross-icon');
        await expect(crossicon).toBeVisible({ timeout: 10000 });
        await crossicon.click({ force: true });

        // Optional: close the contact form after declining
        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);
        await this.page.waitForTimeout(1000);
    }

    // Selecting a property in search
    async selectPropertyInSearch() {
        await this.navigateToListings();

        await this.navigateToListings();
        await this.switchToGridView();
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });
        // Assuming there is a button or icon to open the contact form in each card row
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick({ force: true });
        // Wait for contact form to be visible (adjust selector if needed)
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Fill and select the property address: "1/14 Thomas Street, Laidley, QLD 4341"
        const propertyAddressSearchInput = this.page.locator('#rightbarwithscroll').getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 10000 });
        await propertyAddressSearchInput.type('140 Coates Street, Laidley, QLD 4341', { delay: 100 });
        // Wait for dropdown/options to appear and select the address
        const addressOption = this.page.locator('div:nth-child(2) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 10000 });
        await addressOption.click();

        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);

        await this.page.waitForTimeout(1000);
    }

    // Selecting a previous Listing in search
    async selectPreviousListing() {
        await this.navigateToListings();

        await this.navigateToListings();
        await this.switchToGridView();
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });
        // Assuming there is a button or icon to open the contact form in each card row
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick({ force: true });
        // Wait for contact form to be visible (adjust selector if needed)
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Fill and select the property address: "1/14 Thomas Street, Laidley, QLD 4341"
        const propertyAddressSearchInput = this.page.locator('#rightbarwithscroll').getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 10000 });
        await propertyAddressSearchInput.type('140 Coates Street, Laidley, QLD 4341', { delay: 100 });
        // Wait for dropdown/options to appear and select the address
        const addressOption = this.page.locator('div:nth-child(1) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 10000 });
        await addressOption.click();
        // Wait for the dialog and click Yes
        const copyDialog = this.page.getByText('Would you like to copy this');
        await expect(copyDialog).toBeVisible({ timeout: 10000 });

        const noButton = this.page.getByRole('button', { name: 'No' });
        await expect(noButton).toBeVisible({ timeout: 10000 });
        await noButton.click({ force: true });

        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);

        await this.page.waitForTimeout(1000);
    }

    // Confirming previous listing data copy
    async previousListingCopy() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Wait for at least one listing card
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });

        // Double click to open contact form
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]");
        await contactFormBtn.dblclick({ force: true });

        // Wait for contact form to be visible
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Fill search input and select matching property address
        const propertyAddressSearchInput = contactForm.getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 10000 });
        await propertyAddressSearchInput.type('140 Coates Street, Laidley, QLD 4341', { delay: 100 });

        // Wait for dropdown/option to appear and click it (nth-child(1); double-check if this should be 1 or 2)
        const addressOption = this.page.locator('div:nth-child(1) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 10000 });
        await addressOption.click();
        await this.page.waitForTimeout(1200);

        // Wait for "Would you like to copy this" dialog, click "Yes"
        const copyDialog = this.page.getByText('Would you like to copy this');
        await expect(copyDialog).toBeVisible({ timeout: 10000 });
        const yesButton = this.page.getByRole('button', { name: 'Yes' });
        await expect(yesButton).toBeVisible({ timeout: 10000 });
        await yesButton.click();

        // Close the form after confirming copy
        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);

        await this.page.waitForTimeout(1000);
    }

    // Declining previous listing data copy
    async declinePreviousListingCopy() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Wait for at least one listing card
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });

        // Double click to open contact form
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]");
        await contactFormBtn.dblclick({ force: true });

        // Wait for contact form to be visible
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Fill search input and select matching property address
        const propertyAddressSearchInput = contactForm.getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 10000 });
        await propertyAddressSearchInput.type('140 Coates Street, Laidley, QLD 4341', { delay: 100 });

        // Wait for dropdown/option to appear and click it
        const addressOption = this.page.locator('div:nth-child(1) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 10000 });
        await addressOption.click();

        // Wait for "Would you like to copy this" dialog, click "No"
        const copyDialog = this.page.getByText('Would you like to copy this');
        await expect(copyDialog).toBeVisible({ timeout: 20000 });
        const noButton = this.page.getByRole('button', { name: 'No' });
        await expect(noButton).toBeVisible({ timeout: 10000 });
        await noButton.click();

        // Close the form after declining copy
        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);
    }

    // Search field reset after previous data selection
    async resetPreviousDataSearchField() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Ensure listing cards are loaded
        const cards = this.page.locator('.s-property');
        await expect(cards.first()).toBeVisible({ timeout: 20000 });

        // Double click Add New to open contact form
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]");
        await contactFormBtn.dblclick({ force: true });

        // Wait for the contact form and its search field
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });
        const propertyAddressSearchInput = contactForm.getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 10000 });

        // Fill in address to trigger previous data dialog
        await propertyAddressSearchInput.type('140 Coates Street, Laidley, QLD 4341', { delay: 100 });

        // Wait for dropdown/option and select address
        const addressOption = this.page.locator('div:nth-child(1) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 10000 });
        await addressOption.click();

        // Wait for copy dialog to appear
        const copyDialog = this.page.getByText('Would you like to copy this');
        await expect(copyDialog).toBeVisible({ timeout: 10000 });

        const noButton = this.page.getByRole('button', { name: 'No' });
        await expect(noButton).toBeVisible({ timeout: 10000 });
        await noButton.click({ force: true });

        // Click the cross icon (close the dialog, which should reset the field)
        const crossIcon = this.page.locator('.pi.pi-times._cross-icon');
        await expect(crossIcon).toBeVisible({ timeout: 10000 });
        await crossIcon.click({ force: true });

        // Optional: close the form after test
        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);
        await this.page.waitForTimeout(3000);
    }

    // Create a new Property via the Add New button in the grid view
    async createProperty() {
        // Use faker for address details
        const buildingNameValue = faker.company.name();
        const unitNoValue = faker.number.int({ min: 1, max: 50 }).toString();
        const streetNoValue = faker.location.buildingNumber();
        const streetNameValue = faker.location.street();
        const suburbValue = 'East Albury';
        const stateValue = faker.location.state();
        const postcodeValue = faker.location.zipCode('#####');
        const countryValue = faker.location.country();

        await this.navigateToListings();
        await this.navigateToProperties();
        // Ensure listing cards are loaded
        const cards = this.page.locator('.s-property').first();
        await cards.waitFor({ state: 'visible', timeout: 30000 });
        const contactFormBtn = this.page.locator(".pi.pi-plus").first();
        await contactFormBtn.waitFor({ state: 'visible', timeout: 10000 });

        await this.page.waitForTimeout(1200);

        // Click on the contactFormBtn until the contact form is visible
        let maxAttempts = 10;
        let formVisible = false;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            await contactFormBtn.dblclick({ force: true });
            // Wait briefly for the form to become visible
            try {
                await expect(this.page.locator('#rightbarwithscroll')).toBeVisible({ timeout: 1000 });
                formVisible = true;
                break;
            } catch (error) {
                // Not visible yet, try again if attempts remain
            }
        }
        if (!formVisible) {
            throw new Error('Contact form did not become visible after multiple attempts');
        }

        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });
        const propertyAddressSearchInput = contactForm.getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 10000 });

        const propertyTypeDropdown = this.page.locator('ng-select[formcontrolname="type"]');
        await expect(propertyTypeDropdown).toBeVisible({ timeout: 10000 });
        await propertyTypeDropdown.click();
        await expect(propertyTypeDropdown).toHaveClass(/ng-select-opened/);

        const propertyTypeSearchInput = this.page.locator('ng-select[formcontrolname="type"] input[type="text"], ng-select[formcontrolname="type"] input[role="combobox"]');
        if (await propertyTypeSearchInput.isVisible({ timeout: 10000 }).catch(() => false)) {
            await propertyTypeSearchInput.fill('Alpine');
            await this.page.waitForTimeout(700);
            const alpineOption = this.page.locator('.ng-option', { hasText: 'Alpine' });
            await expect(alpineOption).toBeVisible({ timeout: 10000 });
            await expect(alpineOption).toHaveText(/Alpine/i);
            await alpineOption.click({ force: true });
        }

        const createAddress = this.page.locator("//img[contains(@class,'pencil-cross')]");
        await expect(createAddress).toBeVisible({ timeout: 10000 });
        await createAddress.click({ force: true });

        const buildingName = this.page.locator("input[formcontrolname='building_name']");
        await expect(buildingName).toBeVisible({ timeout: 10000 });
        await buildingName.click();
        await buildingName.fill(buildingNameValue);
        await expect(buildingName).toHaveValue(buildingNameValue);

        const unitNo = this.page.locator("input[formcontrolname='unit_no']");
        await expect(unitNo).toBeVisible({ timeout: 10000 });
        await unitNo.click();
        await unitNo.fill(unitNoValue);
        await expect(unitNo).toHaveValue(unitNoValue);

        const streetNo = this.page.locator("input[formcontrolname='street_no']");
        await expect(streetNo).toBeVisible({ timeout: 10000 });
        await streetNo.click();
        await streetNo.fill(streetNoValue);
        await expect(streetNo).toHaveValue(streetNoValue);

        const streetName = this.page.locator("input[formcontrolname='street_name']");
        await expect(streetName).toBeVisible({ timeout: 10000 });
        await streetName.click();
        await streetName.fill(streetNameValue);
        await expect(streetName).toHaveValue(streetNameValue);

        const suburbInput = this.page.locator("p-autocomplete[formcontrolname='suburb'] input");
        await expect(suburbInput).toBeVisible({ timeout: 10000 });
        await suburbInput.click();
        await suburbInput.fill(suburbValue);
        await expect(suburbInput).toHaveValue(suburbValue);

        const suggestion = this.page.locator("ul.p-autocomplete-items li").first();
        await expect(suggestion).toBeVisible({ timeout: 30000 });
        await suggestion.click();

        const stateInput = this.page.locator("input[formcontrolname='state']");
        await expect(stateInput).toBeVisible({ timeout: 10000 });
        await stateInput.click();
        await stateInput.fill(stateValue);
        await expect(stateInput).toHaveValue(stateValue);

        const postcodeInput = this.page.locator("input[formcontrolname='post_code']");
        await expect(postcodeInput).toBeVisible({ timeout: 10000 });
        await postcodeInput.click();
        await postcodeInput.fill(postcodeValue);
        await expect(postcodeInput).toHaveValue(postcodeValue);

        const countryInput = this.page.locator("input[formcontrolname='country']");
        await expect(countryInput).toBeVisible({ timeout: 10000 });
        await countryInput.click();
        await countryInput.fill(countryValue);
        await expect(countryInput).toHaveValue(countryValue);

        const saveButton = this.page.locator("button[type='submit'], button:has-text('Save')").last();
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click({ force: true });

        await this.page.waitForTimeout(1800);

        const saveBtn = this.page.locator("button", { hasText: "Save" }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();

        const yesButton = this.page.locator('button:has-text("Yes")');
        await expect(yesButton).toBeVisible({ timeout: 10000 });
        await yesButton.click({ force: true });
        await expect(yesButton).not.toBeVisible({ timeout: 10000 });

        const selectCurrentOwnerSpan = this.page.locator("//span[normalize-space()='Select Current Owner']");
        await expect(selectCurrentOwnerSpan).toBeVisible({ timeout: 10000 });
        await selectCurrentOwnerSpan.click();

        const searchInput = this.page.locator("input[placeholder='Search']").last();
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.click();
        await searchInput.fill("Automation Testing");

        const option = this.page.locator("ul li", { hasText: "Automation Testing" });
        await expect(option).toBeVisible({ timeout: 10000 });
        await option.click();
        const sortUp = this.page.locator('.fas.fa-sort-up');
        await expect(sortUp).toBeVisible({ timeout: 10000 });
        await sortUp.click();
        await this.page.waitForTimeout(1500);

        const ddMmYyTextbox = this.page.getByRole('combobox', { name: 'DD-MM-YY' });
        await expect(ddMmYyTextbox).toBeVisible({ timeout: 10000 });
        await ddMmYyTextbox.click();

        // Wait for calendar to be visible
        const calendar = this.page.locator('.p-datepicker-calendar');
        await expect(calendar).toBeVisible({ timeout: 5000 });

        // Locate today's date using the .p-datepicker-today class
        const todayLocator = this.page.locator('.p-datepicker-today span');

        // Wait until the date is visible and click it
        await todayLocator.waitFor({ state: 'visible', timeout: 5000 });
        await todayLocator.click({ force: true });

        const priceInput = this.page.locator('input[name="price"]');
        await expect(priceInput).toBeVisible({ timeout: 10000 });
        await priceInput.fill('123456');

        const saveBtun = this.page.locator("button", { hasText: "Save" }).last();
        await expect(saveBtun).toBeVisible({ timeout: 10000 });
        await saveBtun.click();
        await this.page.waitForTimeout(2000);

        await expect(this.page.getByText('added successfully', { exact: false })).toBeVisible({ timeout: 10000 });

        const ownerText = this.page.getByText('Owner/s Automation');
        await ownerText.waitFor({ state: 'visible', timeout: 10000 });

        await saveBtn.click();
        // Print the full entered address for debugging
        // console.log(`Full Address Entered:${buildingNameValue} ${unitNoValue} ${streetNoValue} ${streetNameValue}, ${suburbValue}, ${stateValue} ${postcodeValue}, ${countryValue}`);
    }

    // Save button functionality
    async clickSaveButtonOnContactForm() {
        await this.page.waitForTimeout(1200);
        await this.createProperty();
        await this.page.waitForTimeout(2000);
        // Ensure listing cards are loaded
        const addListingBtn = this.page.locator("button", { hasText: "Add Listing" });
        await expect(addListingBtn).toBeVisible({ timeout: 10000 });
        await addListingBtn.click();

        const listingsTypeDropdown = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).getByRole('combobox');
        await expect(listingsTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingsTypeDropdown.click();

        // Search 'Auction' inside Listings Type dropdown
        const listingsTypeSearchInput = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).locator('input[type="text"]');
        await expect(listingsTypeSearchInput).toBeVisible({ timeout: 10000 });
        await listingsTypeSearchInput.fill('Auction');
        await this.page.waitForTimeout(500);

        const auctionOption = this.page.getByRole('option', { name: 'Auction' });
        await auctionOption.waitFor({ state: 'visible' });
        await auctionOption.click();
        await this.page.waitForTimeout(1000);
        const listingStatusDropdown = this.page.locator('ng-select').filter({ hasText: 'Listing Status' });
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        const forSaleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'For sale' }).first();
        await expect(forSaleOption).toBeVisible({ timeout: 10000 });
        await forSaleOption.click();
        await this.page.waitForTimeout(1000);
        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();

        const listingAddedAlert = this.page.getByRole('alert', { name: 'Listing added successfully' });
        await expect(listingAddedAlert).toBeVisible({ timeout: 10000 });
        await this.page.locator("//p[normalize-space()='Listing']").click();
        await this.page.waitForTimeout(2200);
    }

    async withoutPrimaryAgent() {
        await this.createProperty();

        await this.page.waitForTimeout(2000);
        // Ensure listing cards are loaded
        const addListingBtn = this.page.locator("button", { hasText: "Add Listing" });
        await expect(addListingBtn).toBeVisible({ timeout: 10000 });
        await addListingBtn.click();


        // Search 'Auction' inside Listings Type dropdown
        const listingsTypeSearchInput = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).locator('input[type="text"]');
        await expect(listingsTypeSearchInput).toBeVisible({ timeout: 10000 });
        await listingsTypeSearchInput.fill('Auction');
        await this.page.waitForTimeout(500);

        const auctionOption = this.page.getByRole('option', { name: 'Auction' });
        await auctionOption.waitFor({ state: 'visible' });
        await auctionOption.click();

        const listingStatusDropdown = this.page.locator('ng-select').filter({ hasText: 'Listing Status' });
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        const forSaleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'For sale' }).first();
        await expect(forSaleOption).toBeVisible({ timeout: 10000 });
        await forSaleOption.click();

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();

        const listingAddedAlert = this.page.getByRole('alert', { name: 'Listing added successfully' });
        await expect(listingAddedAlert).toBeVisible({ timeout: 10000 });
        await this.page.locator("//p[normalize-space()='Listing']").click();
        await this.page.waitForTimeout(1200);

        // Click on the first listing card
        const firstListingCard = this.page.locator('.s-property').first();
        await expect(firstListingCard).toBeVisible({ timeout: 10000 });
        await firstListingCard.click();

        // Wait for and focus the 'Calendar' input by placeholder text
        const calendar = this.page.getByRole('tab', { name: ' Calendar' });
        await expect(calendar).toBeVisible({ timeout: 10000 });

        await calendar.click();

        // Click on the "Please select and connect Listing Agent" prompt (6th occurrence)
        await expect(
            this.page.locator('div').filter({ hasText: /^Please select and connect Listing Agent$/ }).nth(5)
        ).toBeVisible({ timeout: 10000 });

        const inspection = this.page.getByRole('tab', { name: 'gavel Inspections' });
        await expect(inspection).toBeVisible({ timeout: 7000 });
        await inspection.click();

        await expect(
            this.page.getByLabel('Inspections').getByText('Please select and connect')
        ).toBeVisible({ timeout: 10000 });

        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }

    // Selecting "Auction" as the listing type
    async selectAuctionAsListingType() {
        await this.createProperty();

        await this.page.waitForTimeout(2000);
        // Ensure listing cards are loaded
        const addListingBtn = this.page.locator("button", { hasText: "Add Listing" });
        await expect(addListingBtn).toBeVisible({ timeout: 10000 });
        await addListingBtn.click();

        const listingsTypeDropdown = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).getByRole('combobox');
        await expect(listingsTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingsTypeDropdown.click();

        // Search 'Auction' inside Listings Type dropdown
        const listingsTypeSearchInput = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).locator('input[type="text"]');
        await expect(listingsTypeSearchInput).toBeVisible({ timeout: 10000 });
        await listingsTypeSearchInput.fill('Auction');
        await this.page.waitForTimeout(500);

        const auctionOption = this.page.getByRole('option', { name: 'Auction' });
        await auctionOption.waitFor({ state: 'visible' });
        await auctionOption.click();

        const listingStatusDropdown = this.page.locator('ng-select').filter({ hasText: 'Listing Status' });
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        const forSaleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'For sale' }).first();
        await expect(forSaleOption).toBeVisible({ timeout: 10000 });
        await forSaleOption.click();


        const auctionDateLabel = this.page.getByText('Auction dateAuction Start');
        await expect(auctionDateLabel).toBeVisible({ timeout: 10000 });
        await auctionDateLabel.click();

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }
    async selectingForLease() {
        await this.createProperty();

        await this.page.waitForTimeout(2000);
        // Ensure listing cards are loaded
        const addListingBtn = this.page.locator("button", { hasText: "Add Listing" });
        await expect(addListingBtn).toBeVisible({ timeout: 10000 });
        await addListingBtn.click();

        // Search 'Auction' inside Listings Type dropdown
        const listingsTypeSearchInput = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).locator('input[type="text"]');
        await expect(listingsTypeSearchInput).toBeVisible({ timeout: 10000 });
        await listingsTypeSearchInput.fill('Rental');
        await this.page.waitForTimeout(500);

        const auctionOption = this.page.getByRole('option', { name: 'Rental' });
        await auctionOption.waitFor({ state: 'visible' });
        await auctionOption.click();

        const listingStatusDropdown = this.page.locator('ng-select').filter({ hasText: 'Listing Status' });
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        const forSaleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'For Lease' }).first();
        await expect(forSaleOption).toBeVisible({ timeout: 10000 });
        await forSaleOption.click();


        const rentalSection = this.page.locator("div[class='mb-2'] div[class='mb-2'] div[class='align-items-end mt-2 overlay-background row']");

        await expect(rentalSection).toBeVisible();


        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();

        await this.page.waitForTimeout(2000)
    }

    // Adding multiple agents to a listing
    async addMultipleAgents(agentNames: string[]) {

        const listing = this.page.locator("//p[normalize-space()='Listing']");
        await expect(listing).toBeVisible({ timeout: 10000 });
        await listing.click();

        const firstListingCard = this.page.locator('.s-property').first();
        await expect(firstListingCard).toBeVisible({ timeout: 10000 });
        await firstListingCard.click();

        const primaryAgent = this.page.locator(
            'div.form-group:has-text("Primary Agent") ng-select'
        );

        await expect(primaryAgent).toBeVisible();
        await primaryAgent.click();

        const primaryInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']");
        await expect(primaryInput).toBeVisible({ timeout: 10000 });
        await primaryInput.fill(agentNames[0]);

        const primaryOption = this.page.locator(
            '.ng-dropdown-panel .ng-option',
            { hasText: agentNames[0] }
        ).first();
        await expect(primaryOption).toBeVisible({ timeout: 10000 });
        await primaryOption.click();

        const secondaryAgent = this.page.locator(
            'div.form-group:has-text("Secondary Agent") ng-select'
        );

        await expect(secondaryAgent).toBeVisible();
        await secondaryAgent.click();

        const secondaryInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']");
        await expect(secondaryInput).toBeVisible({ timeout: 10000 });
        await secondaryInput.fill(agentNames[1]);

        const secondaryOption = this.page.locator(
            '.ng-dropdown-panel .ng-option',
            { hasText: agentNames[1] }
        ).first();
        await expect(secondaryOption).toBeVisible({ timeout: 10000 });
        await secondaryOption.click();

        const addAgentBtn = this.page.locator('button.add-plus-btn');

        for (let i = 2; i < agentNames.length; i++) {

            await addAgentBtn.click();

            const dynamicAgentDropdown = this.page
                .locator('ng-select[id^="otherAgent"]')
                .last();

            await expect(dynamicAgentDropdown).toBeVisible({ timeout: 10000 });

            await dynamicAgentDropdown.click();

            const dynamicInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']");
            await expect(dynamicInput).toBeVisible({ timeout: 10000 });
            await dynamicInput.fill(agentNames[i]);

            const dynamicOption = this.page.locator(
                '.ng-dropdown-panel .ng-option',
                { hasText: agentNames[i] }
            ).first();
            await expect(dynamicOption).toBeVisible({ timeout: 10000 });
            await dynamicOption.click();
        }

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();

        await this.page.waitForTimeout(2000)

    }

    // Feature name selection dropdown
    async selectFeatureByName() {
        const listing = this.page.locator("//p[normalize-space()='Listing']");
        await expect(listing).toBeVisible({ timeout: 10000 });
        await listing.click();

        const firstListingCard = this.page.locator('.s-property').first();
        await expect(firstListingCard).toBeVisible({ timeout: 10000 });
        await firstListingCard.click();
        // Locate the dropdown for Feature Name (assumes label or placeholder contains "Feature Name")
        const featuresHeading = this.page.locator('div.boxHeadingText:has-text("Features") p');
        await featuresHeading.scrollIntoViewIfNeeded();
        await expect(featuresHeading).toBeVisible();

        // Find the option with the given featureName and click it
        const featuredropdown = this.page.locator("//span[normalize-space()='Please Select']").first();
        await expect(featuredropdown).toBeVisible({ timeout: 10000 });
        await featuredropdown.click();
        // Click on the clickable div (checkmark)
        const selectAllCheckbox = this.page.locator('label.checkbox.select_all .checkbox__checkmark');
        await expect(selectAllCheckbox).toBeVisible();

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();

        await this.page.waitForTimeout(2000)
    }

    // Searching in feature dropdown by name
    async searchFeatureInDropdown(featureName: string) {
        const listing = this.page.locator("//p[normalize-space()='Listing']");
        await expect(listing).toBeVisible({ timeout: 10000 });
        await listing.click();

        const firstListingCard = this.page.locator('.s-property').first();
        await expect(firstListingCard).toBeVisible({ timeout: 10000 });
        await firstListingCard.click();

        const featuresHeading = this.page.locator('div.boxHeadingText:has-text("Features") p');
        await featuresHeading.scrollIntoViewIfNeeded();
        await expect(featuresHeading).toBeVisible();

        const featureDropdown = this.page.locator("//span[normalize-space()='Please Select']").first();
        await expect(featureDropdown).toBeVisible({ timeout: 10000 });
        await featureDropdown.click();

        // Locate and use the feature search field
        const searchInput = this.page.getByRole('tabpanel', { name: 'gavel Listing Details' }).getByPlaceholder('Search');
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.click();
        await searchInput.fill(featureName);

        const featureOption = this.page.locator('li.p-element', { hasText: featureName }).first();
        await expect(featureOption).toBeVisible({ timeout: 10000 });
        await featureOption.click();

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();

        await this.page.waitForTimeout(2000);
    }

    // Closing the feature dropdown by clicking outside it
    async closeFeatureDropdown() {
        const listing = this.page.locator("//p[normalize-space()='Listing']");
        await expect(listing).toBeVisible({ timeout: 10000 });
        await listing.click();

        const firstListingCard = this.page.locator('.s-property').first();
        await expect(firstListingCard).toBeVisible({ timeout: 10000 });
        await firstListingCard.click();

        const featuresHeading = this.page.locator('div.boxHeadingText:has-text("Features") p');
        await featuresHeading.scrollIntoViewIfNeeded();
        await expect(featuresHeading).toBeVisible();
        const closeDropdown = this.page.locator("//span[@class='pi pi-times-circle']");
        await expect(closeDropdown).toBeVisible({ timeout: 10000 });
        await closeDropdown.click();

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();

        await this.page.waitForTimeout(2000);
    }

    // Creating a new listing from search
    async createNewListingFromSearch() {
        await this.clickSaveButtonOnContactForm();
    }

    // Editing an existing listing
    async editExistingListing() {
        // Go to the listings page
        const listing = this.page.locator("//p[normalize-space()='Listing']");
        await expect(listing).toBeVisible({ timeout: 10000 });
        await listing.click();

        // Open the first listing card
        const firstListingCard = this.page.locator('.s-property').first();
        await expect(firstListingCard).toBeVisible({ timeout: 10000 });
        await firstListingCard.click();

        // Optionally update price if provided

        const priceInput = this.page.locator('input[name="price"]').first();
        await expect(priceInput).toBeVisible({ timeout: 10000 });
        await priceInput.click();
        await priceInput.clear();
        await priceInput.fill('1234');

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();

        // Optionally check for success message
        await expect(this.page.getByText('Listing updated successfully', { exact: false })).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(2000);
    }

    // Verify toggles functionality in search field selection
    async verifySearchFieldToggles() {
        await this.confirmListingCopy()
    }

    // Verify toggles disappear after saving
    async verifyTogglesDisappearAfterSaving() {
        await this.declineListingCopy();
    }

    // Resetting the listing form
    async resetListingForm() {
        await this.resetPreviousDataSearchField();
    }

    // Check the Save button visibility and state
    async checkSaveButton() {
        await this.createListingWithMissingFields();
    }


    async uploadImagesToLibrary(imagePath: string) {
        // Navigate to Listing grid view and switch
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing card
        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Ensure Floorplans folder visible
        const floorPlanArea = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' });
        await floorPlanArea.waitFor({ state: 'visible', timeout: 30000 });

        await this.page.waitForTimeout(1500);

        // Open Add menu
        const addButton = this.page.locator('button', { hasText: 'Add' }).first();
        await addButton.scrollIntoViewIfNeeded();
        await addButton.click();
        await this.page.waitForTimeout(200);
        await addButton.click();

        // Click "File Upload (Public)" option
        const publicOption = this.page.locator('a', { hasText: 'File Upload (Public)' });

        await expect(publicOption).toBeVisible({ timeout: 10000 });
        await publicOption.click();

        // Wait for upload input to appear
        const fileInput = this.page.locator('#fileUpload');
        // Upload the file
        await fileInput.setInputFiles(imagePath);

        // Check image name visibility within the .lib-file area
        const imageName = imagePath.split(/[\\/]/).pop();
        if (imageName) {
            const imageNameInLibFile = this.page.locator(`.lib-file :text("${imageName}")`).first();
            await expect(imageNameInLibFile).toBeVisible({ timeout: 50000 });
        }

        // Save and close
        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();

        await this.page.waitForTimeout(2000);
    }

    async noImageUploadedScenario() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing card
        const firstListing = this.page.locator('.s-property').nth(1);
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Click Images tab
        const imagesTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imagesTab).toBeVisible({ timeout: 10000 });
        await imagesTab.click();
        await this.page.waitForTimeout(6000);

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }

    async uploadunsupportedImageFormat(imagePath: string) {
        // Navigate to Listing grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing card
        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Ensure Floorplans folder visible
        const floorPlanArea = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' });
        await floorPlanArea.waitFor({ state: 'visible', timeout: 30000 });

        await this.page.waitForTimeout(1500);

        // Open Add menu
        const addButton = this.page.locator('button', { hasText: 'Add' }).first();
        await addButton.scrollIntoViewIfNeeded();
        await addButton.click();
        await this.page.waitForTimeout(200);
        await addButton.click();

        // Click "File Upload (Public)" option
        const publicOption = this.page.locator('a', { hasText: 'File Upload (Public)' });

        await expect(publicOption).toBeVisible({ timeout: 3000 });
        await publicOption.click();

        // Wait for hidden input to appear
        const fileInput = this.page.locator('#fileUpload');

        // Upload the file
        await fileInput.setInputFiles(imagePath);

        const fileTypeNotSupportedAlert = this.page.locator('text=File Type Not Supported');
        await expect(fileTypeNotSupportedAlert).toBeVisible({ timeout: 10000 });

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);

    }

    // Delete uploaded image
    async deleteUploadedImage() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing card
        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Ensure Floorplans folder visible
        const floorPlanArea = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' });
        await floorPlanArea.waitFor({ state: 'visible', timeout: 30000 });

        await this.page.waitForTimeout(1500);

        const imageLocator = this.page.locator('img.img-hub2').first();
        await expect(imageLocator).toBeVisible({ timeout: 15000 })
        await imageLocator.click();

        // Locator for Remove (Delete) icon in images popup
        const removeIcon = this.page.locator('img[alt="Remove"][src*="delete_icon.svg"].cursor-pointer');
        await expect(removeIcon).toBeVisible({ timeout: 10000 });
        await removeIcon.click();

        // "Deleted successfully"
        const deletedSuccessfullyToast = this.page.locator('text= Deleted successfully');
        await expect(deletedSuccessfullyToast).toBeVisible({ timeout: 50000 });

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);

    }

    // Invalid characters in fields
    async checkInvalidCharactersInFields() {

        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing card
        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Open Property Type dropdown and search/select the option
        const propertyTypeDropdown = this.page.locator('ng-select[formcontrolname="type"]');
        await expect(propertyTypeDropdown).toBeVisible({ timeout: 10000 });
        await propertyTypeDropdown.click();

        // Search for the propertyType option
        const propertyTypeSearchInput = this.page.locator('ng-select[formcontrolname="type"] input[type="text"], ng-select[formcontrolname="type"] input[role="combobox"]');
        if (await propertyTypeSearchInput.isVisible({ timeout: 10000 }).catch(() => false)) {
            await propertyTypeSearchInput.fill('@#$%');
            await this.page.waitForTimeout(500); // Let options update if needed
        }
        // Verify that "No items found" appears in the dropdown
        const noItemsFound = this.page.locator('text = No items found').first();
        await expect(noItemsFound).toBeVisible({ timeout: 10000 });

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();

        // Optionally check for success message
        await expect(this.page.getByText('Listing updated successfully', { exact: false })).toBeVisible({ timeout: 7000 });
        await this.page.waitForTimeout(2000);
    }

    // Check that a newly saved listing appears in the grid and verify it's the first property in the grid
    async verifyListingAppearsInGrid() {
        // Use faker for address details
        const buildingNameValue = faker.company.name();
        const unitNoValue = faker.number.int({ min: 1, max: 50 }).toString();
        const streetNoValue = faker.location.buildingNumber();
        const streetNameValue = faker.location.street();
        const suburbValue = 'East Albury';
        const stateValue = faker.location.state();
        const postcodeValue = faker.location.zipCode('#####');
        const countryValue = faker.location.country();

        await this.navigateToListings();
        await this.navigateToProperties();
        // Ensure listing cards are loaded
        const cards = this.page.locator('.s-property').first();
        await cards.waitFor({ state: 'visible', timeout: 30000 });
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]").first();
        await contactFormBtn.waitFor({ state: 'visible', timeout: 10000 });

        // Click on the contactFormBtn until the contact form is visible
        let maxAttempts = 10;
        let formVisible = false;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            await contactFormBtn.dblclick({ force: true });
            // Wait briefly for the form to become visible
            try {
                await expect(this.page.locator('#rightbarwithscroll')).toBeVisible({ timeout: 1000 });
                formVisible = true;
                break;
            } catch (error) {
                // Not visible yet, try again if attempts remain
            }
        }
        if (!formVisible) {
            throw new Error('Contact form did not become visible after multiple attempts');
        }

        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });
        const propertyAddressSearchInput = contactForm.getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 10000 });

        const propertyTypeDropdown = this.page.locator('ng-select[formcontrolname="type"]');
        await expect(propertyTypeDropdown).toBeVisible({ timeout: 10000 });
        await propertyTypeDropdown.click();
        await expect(propertyTypeDropdown).toHaveClass(/ng-select-opened/);

        const propertyTypeSearchInput = this.page.locator('ng-select[formcontrolname="type"] input[type="text"], ng-select[formcontrolname="type"] input[role="combobox"]');
        if (await propertyTypeSearchInput.isVisible({ timeout: 10000 }).catch(() => false)) {
            await propertyTypeSearchInput.fill('Alpine');
            await this.page.waitForTimeout(700);
            const alpineOption = this.page.locator('.ng-option', { hasText: 'Alpine' });
            await expect(alpineOption).toBeVisible({ timeout: 10000 });
            await expect(alpineOption).toHaveText(/Alpine/i);
            await alpineOption.click({ force: true });
        }

        const createAddress = this.page.locator("//img[contains(@class,'pencil-cross')]");
        await expect(createAddress).toBeVisible({ timeout: 10000 });
        await createAddress.click({ force: true });

        const buildingName = this.page.locator("input[formcontrolname='building_name']");
        await expect(buildingName).toBeVisible({ timeout: 10000 });
        await buildingName.click();
        await buildingName.fill(buildingNameValue);
        await expect(buildingName).toHaveValue(buildingNameValue);

        const unitNo = this.page.locator("input[formcontrolname='unit_no']");
        await expect(unitNo).toBeVisible({ timeout: 10000 });
        await unitNo.click();
        await unitNo.fill(unitNoValue);
        await expect(unitNo).toHaveValue(unitNoValue);

        const streetNo = this.page.locator("input[formcontrolname='street_no']");
        await expect(streetNo).toBeVisible({ timeout: 10000 });
        await streetNo.click();
        await streetNo.fill(streetNoValue);
        await expect(streetNo).toHaveValue(streetNoValue);

        const streetName = this.page.locator("input[formcontrolname='street_name']");
        await expect(streetName).toBeVisible({ timeout: 10000 });
        await streetName.click();
        await streetName.fill(streetNameValue);
        await expect(streetName).toHaveValue(streetNameValue);

        const suburbInput = this.page.locator("p-autocomplete[formcontrolname='suburb'] input");
        await expect(suburbInput).toBeVisible({ timeout: 10000 });
        await suburbInput.click();
        await suburbInput.fill(suburbValue);
        await expect(suburbInput).toHaveValue(suburbValue);

        const suggestion = this.page.locator("ul.p-autocomplete-items li").first();
        await expect(suggestion).toBeVisible({ timeout: 20000 });
        await suggestion.click();

        const stateInput = this.page.locator("input[formcontrolname='state']");
        await expect(stateInput).toBeVisible({ timeout: 10000 });
        await stateInput.click();
        await stateInput.fill(stateValue);
        await expect(stateInput).toHaveValue(stateValue);

        const postcodeInput = this.page.locator("input[formcontrolname='post_code']");
        await expect(postcodeInput).toBeVisible({ timeout: 10000 });
        await postcodeInput.click();
        await postcodeInput.fill(postcodeValue);
        await expect(postcodeInput).toHaveValue(postcodeValue);

        const countryInput = this.page.locator("input[formcontrolname='country']");
        await expect(countryInput).toBeVisible({ timeout: 10000 });
        await countryInput.click();
        await countryInput.fill(countryValue);
        await expect(countryInput).toHaveValue(countryValue);

        const saveButton = this.page.locator("button[type='submit'], button:has-text('Save')").last();
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click({ force: true });

        const ownerText = this.page.getByText('Owner/s Automation');
        await ownerText.waitFor({ state: 'visible', timeout: 10000 });

        await this.page.waitForTimeout(1800);

        const saveBtn = this.page.locator("button", { hasText: "Save" }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();

        const yesButton = this.page.locator('button:has-text("Yes")');
        await expect(yesButton).toBeVisible({ timeout: 10000 });
        await yesButton.click({ force: true });
        await expect(yesButton).not.toBeVisible({ timeout: 10000 });

        const selectCurrentOwnerSpan = this.page.locator("//span[normalize-space()='Select Current Owner']");
        await expect(selectCurrentOwnerSpan).toBeVisible({ timeout: 10000 });
        await selectCurrentOwnerSpan.click();

        const searchInput = this.page.locator("input[placeholder='Search']").last();
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.click();
        await searchInput.fill("Automation Testing");

        const option = this.page.locator("ul li", { hasText: "Automation Testing" });
        await expect(option).toBeVisible({ timeout: 10000 });
        await option.click();
        const sortUp = this.page.locator('.fas.fa-sort-up');
        await expect(sortUp).toBeVisible({ timeout: 10000 });
        await sortUp.click();
        await this.page.waitForTimeout(1500);

        const ddMmYyTextbox = this.page.getByRole('combobox', { name: 'DD-MM-YY' });
        await expect(ddMmYyTextbox).toBeVisible({ timeout: 10000 });
        await ddMmYyTextbox.click();

        // Wait for calendar to be visible
        const calendar = this.page.locator('.p-datepicker-calendar');
        await expect(calendar).toBeVisible({ timeout: 5000 });

        // Locate today's date using the .p-datepicker-today class
        const todayLocator = this.page.locator('.p-datepicker-today span');

        // Wait until the date is visible and click it
        await todayLocator.waitFor({ state: 'visible', timeout: 5000 });
        await todayLocator.click({ force: true });

        const priceInput = this.page.locator('input[name="price"]');
        await expect(priceInput).toBeVisible({ timeout: 10000 });
        await priceInput.fill('123456');

        const saveBtun = this.page.locator("button", { hasText: "Save" }).last();
        await expect(saveBtun).toBeVisible({ timeout: 10000 });
        await saveBtun.click();
        await this.page.waitForTimeout(2000);

        await expect(this.page.getByText('added successfully', { exact: false })).toBeVisible({ timeout: 10000 });

        await saveBtn.click();

        // Add Listing to this property
        await this.page.waitForTimeout(2000);
        // Ensure listing cards are loaded
        const addListingBtn = this.page.locator("button", { hasText: "Add Listing" });
        await expect(addListingBtn).toBeVisible({ timeout: 10000 });
        await addListingBtn.click();

        const listingsTypeDropdown = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).getByRole('combobox');
        await expect(listingsTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingsTypeDropdown.click();

        const auctionOption = this.page.getByRole('option', { name: 'Auction' });
        await expect(auctionOption).toBeVisible({ timeout: 10000 });
        await auctionOption.click();

        const listingStatusDropdown = this.page.locator('ng-select').filter({ hasText: 'Listing Status' });
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        const forSaleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'For sale' }).first();
        await expect(forSaleOption).toBeVisible({ timeout: 10000 });
        await forSaleOption.click();

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();

        const listingAddedAlert = this.page.getByRole('alert', { name: 'Listing added successfully' });
        await expect(listingAddedAlert).toBeVisible({ timeout: 10000 });

        // Grid me jao
        await this.page.locator("//p[normalize-space()='Listing']").click();
        await this.page.waitForTimeout(1200);
        // Wait for the first card row to load
        const firstProperty = this.page.locator('.s-property').first();
        await expect(firstProperty).toBeVisible({ timeout: 20000 });
        await this.page.waitForTimeout(2000);
    }

    // Searching for a saved listing
    async searchForSavedListing() {
        // Navigate to the Listing grid page
        // First card show ho
        await this.page.locator("//p[normalize-space()='Listing']").click();
        await this.page.waitForTimeout(1200);

        const firstCard = this.page.locator('.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 20000 });

        // Ab usi heading ka title search karo search box mein
        const headingTitle = await this.page.locator('h3.props-bg.cp.mb-1.px-0').first().innerText().catch(async () => {
            // fallback: grab all text content if selectors above not available
            return await firstCard.innerText();
        });

        const searchInput = this.locators.SearchBox();
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.click();
        await searchInput.fill(headingTitle);

        // Wait for search results to update
        await this.page.waitForTimeout(1000);

        // Locate matching listing in the results
        const searchResult = this.page.locator('.s-property', { hasText: headingTitle }).first();
        await expect(searchResult).toBeVisible({ timeout: 10000 });
        await this.resetFilters();
        await this.page.waitForTimeout(2000);
    }

    // Listing should not be visible after deletion
    async verifyListingNotVisibleAfterDeletion() {
        await this.navigateToListings();
        await this.switchToGridView();

        const firstCard = this.page.locator('.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 20000 });

        // Ab usi heading ka title search karo search box mein
        const headingTitle = await this.page.locator('h3.props-bg.cp.mb-1.px-0').first().innerText().catch(async () => {
            // fallback: grab all text content if selectors above not available
            return await firstCard.innerText();
        });

        const chevronDown = this.page.locator('i.pi.pi-chevron-down').first();
        await chevronDown.click({ force: true });

        // Find the delete button for the first visible listing card in card/grid view
        const cardDeleteButton = this.page.locator('a:nth-child(4)').first();
        await cardDeleteButton.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
        await cardDeleteButton.click({ force: true });

        // Wait for confirmation dialog to appear
        const confirmationDialog = this.page.getByText('Are you sure you want to delete this listing ? Your listing will be permanently');
        await expect(confirmationDialog).toBeVisible({ timeout: 10000 });

        // Find and click the confirm Delete button
        const confirmButton = this.page.getByRole('button', { name: 'Delete' });
        await expect(confirmButton).toBeVisible({ timeout: 10000 });
        await confirmButton.click({ force: true });
        const toast = this.page.getByRole('alert', { name: 'Listing successfully deleted' });;
        await expect(toast).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);

        const searchInput = this.locators.SearchBox();
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.click();
        await searchInput.fill(headingTitle);

        // Wait for search results to update
        await this.page.waitForTimeout(1000);
        // Confirm that the listing was opened by checking the heading title is visible in the detailed view
        const detailHeading = this.page.locator('h3.props-bg.cp.mb-1.px-0', { hasText: headingTitle });
        await expect(detailHeading).not.toBeVisible({ timeout: 10000 });

        await this.resetFilters();
        await this.page.waitForTimeout(2000);
    }

    // Verify project association popup opens
    async verifyProjectAssociationPopupOpens() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click on the first card
        const firstCard = this.page.locator('.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 10000 });
        await firstCard.click();

        // Find and click the project association button/icon if available
        const projectAssociation = this.page.getByText('Associate Project').first();
        await expect(projectAssociation).toBeVisible({ timeout: 10000 });
        await projectAssociation.click({ force: true });
        // Assert the popup/modal/dialog appears
        const projectAssociationModal = this.page.getByText('ProjectsSelect ProjectCancelAssociate');
        await expect(projectAssociationModal).toBeVisible({ timeout: 10000 });

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }

    // Verify project dropdown displays all projects
    async verifyProjectDropdownDisplaysAllProjects() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click on the first card
        const firstCard = this.page.locator('.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 10000 });
        await firstCard.click();

        // Find and click the 'Associate Project' button to open the dropdown/modal
        const projectAssociation = this.page.getByText('Associate Project').first();
        await expect(projectAssociation).toBeVisible({ timeout: 10000 });
        await projectAssociation.click({ force: true });

        await this.page.waitForTimeout(1200);

        // Wait for the dropdown to be visible (this selector may need adjusting)
        const projectDropdown = this.page.getByText('Select Project');
        await expect(projectDropdown).toBeVisible({ timeout: 10000 });
        await projectDropdown.click();

        const dropdownItems = this.page.getByRole('listbox', { name: 'Options list' });

        await expect(dropdownItems).toBeVisible({ timeout: 10000 });

        // Optionally, close the dropdown and modal
        await projectDropdown.press('Escape');
        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }

    // Verify project cannot be associated without selection
    async verifyProjectCannotAssociateWithoutSelection() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing card
        const firstCard = this.page.locator('.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 10000 });
        await firstCard.click();

        // Open project association modal
        const projectAssociation = this.page.getByText('Associate Project').first();
        await expect(projectAssociation).toBeVisible({ timeout: 10000 });
        await projectAssociation.click({ force: true });

        await this.page.waitForTimeout(1000);

        // Ensure dropdown for Select Project is visible, but make no selection
        const projectDropdown = this.page.getByText('Select Project');
        await expect(projectDropdown).toBeVisible({ timeout: 10000 });
        await projectDropdown.click();

        // Optionally check dropdown populates with options but none are selected
        const dropdownItems = this.page.getByRole('listbox', { name: 'Options list' });
        await expect(dropdownItems).toBeVisible({ timeout: 10000 });
        const selectedCount = await this.page.locator('.ng-option-selected').count();
        expect(selectedCount).toBe(0);

        // Close dropdown
        await projectDropdown.press('Escape');

        // Attempt to save without selection and verify that association does NOT succeed
        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }

    // Verify successful project association
    async verifySuccessfulProjectAssociation() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing card
        const firstCard = this.page.locator('.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 10000 });
        await firstCard.click();

        // Open project association modal
        const projectAssociation = this.page.getByText('Associate Project').first();
        await expect(projectAssociation).toBeVisible({ timeout: 10000 });
        await projectAssociation.click({ force: true });

        await this.page.waitForTimeout(1000);

        // Open the "Select Project" dropdown and use the search option to filter
        const projectDropdown = this.page.getByText('Select Project');
        await expect(projectDropdown).toBeVisible({ timeout: 10000 });
        await projectDropdown.click();

        // Locate the search input inside the dropdown and type a search term (e.g., "Test")
        const searchInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']");
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.fill('East Village Vila');
        await this.page.waitForTimeout(500);

        // Wait for the dropdown options to be visible
        const dropdownItems = this.page.getByRole('listbox', { name: 'Options list' });
        await expect(dropdownItems).toBeVisible({ timeout: 10000 });

        // Select the option whose text matches the searched 'Test'
        const searchedOption = dropdownItems.locator('.ng-option:not(.ng-option-disabled)', { hasText: 'East Village Vila' }).first();
        await expect(searchedOption).toBeVisible({ timeout: 10000 });
        await searchedOption.click();

        // Click Associate button
        const associateButton = this.page.getByRole('button', { name: /Associate/i });
        await expect(associateButton).toBeVisible({ timeout: 10000 });
        await associateButton.click();

        // Wait for and assert the success toast or alert is visible
        const successToast = this.page.getByRole('alert', { name: /Project associated successfully|Association successful/i });
        await expect(successToast).toBeVisible({ timeout: 10000 });

        // Click Save & Close
        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);

    }

    // Verify closing the project popup without selecting
    async verifyProjectAssociateWithoutSelection() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the second listing card (nth(1) means the second element)
        const secondCard = this.page.locator('.s-property').nth(1);
        await expect(secondCard).toBeVisible({ timeout: 10000 });
        await secondCard.click();

        // Open project association modal
        const projectAssociation = this.page.getByText('Associate Project').first();
        await expect(projectAssociation).toBeVisible({ timeout: 10000 });
        await projectAssociation.click({ force: true });

        await this.page.waitForTimeout(1000);

        // Try to click Associate without selecting a project
        const associateButton = this.page.getByRole('button', { name: /Associate/i });
        await expect(associateButton).toBeVisible({ timeout: 10000 });
        await associateButton.click();

        // Click the close (cross) icon to close the project association popup
        const closeIcon = this.page.locator('.pi.pi-times').last();
        await expect(closeIcon).toBeVisible({ timeout: 10000 });
        await closeIcon.click({ force: true });

        // Click Save & Close
        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }

    // Verify associated project listing leads
    async verifyAssociatedProjectListingLeads() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing card
        const firstCard = this.page.locator('.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 10000 });
        await firstCard.click();

        // Open project association modal
        const projectAssociation = this.page.getByText('Associate Project').first();
        await expect(projectAssociation).toBeVisible({ timeout: 10000 });
        const projectAssociateCheckbox = this.page.locator('#projectAssociateCheckbox');
        await expect(projectAssociateCheckbox).toBeChecked();
        await this.page.waitForTimeout(1000);
        // Click Save & Close
        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);

    }

    // Enhanced: Verifies expected messages in Lead, Task, and Related tabs before saving a listing.
    async verifyButtonsInTabsBeforeSave() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Ensure at least one card is loaded before proceeding
        const firstCard = this.page.locator('.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 20000 });

        // Open the Add New listing form
        const addNewBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]").first();
        await expect(addNewBtn).toBeVisible({ timeout: 10000 });
        await addNewBtn.dblclick({ force: true });

        // Make sure the form is open
        const rightBar = this.page.locator('#rightbarwithscroll');
        await expect(rightBar).toBeVisible({ timeout: 10000 });

        // Tab details for iteration: id and user-facing label (optional for error messages)
        const tabSelectors = [
            { id: "#pills-Lead-tab", label: "Lead" },
            { id: "#pills-Tasks-tab", label: "Tasks" },
            { id: "#pills-Related-tab", label: "Related" },
        ];
        const expectedText = 'Please create the listing';

        // Helper to check for expected message in current tab
        const expectMessage = async (tabLabel: string) => {
            // Try multiple ways of locating the message for robustness
            // 1. Check for <p> with matching text
            const p = this.page.locator('p', { hasText: expectedText });
            if (await p.isVisible().catch(() => false)) {
                await expect(p).toBeVisible({ timeout: 10000 });
            } else {
                // 2. Fallback to getByRole; works if using ARIA roles on <p>
                await expect(
                    this.page.getByRole('paragraph').filter({ hasText: expectedText })
                ).toBeVisible({ timeout: 10000 });

            }
        };

        // Iterate all relevant tabs and verify the message
        for (const tab of tabSelectors) {
            const tabLocator = this.page.locator(tab.id).first();
            await expect(tabLocator, `Tab "${tab.label}" should be visible`).toBeVisible({ timeout: 10000 });
            await tabLocator.click();
            await expectMessage(tab.label);
        }

        // Optional: close the newly opened form after validation
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(2000);
    }

    async verifyConjunctionTabsBeforeSave() {
        // Open the Listings grid and ensure property cards are loaded
        await this.navigateToListings();
        await this.switchToGridView();
        const firstCard = this.page.locator('.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 20000 });

        // Open the Add New listing form
        const addNewBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]").first();
        await expect(addNewBtn).toBeVisible({ timeout: 10000 });
        await addNewBtn.dblclick({ force: true });

        // Make sure the form is open
        const rightPanel = this.page.locator('#rightbarwithscroll');
        await expect(rightPanel).toBeVisible({ timeout: 10000 });

        // All conjunction-related tabs to check for the message
        const conjunctionTabs = [
            { id: "#pills-Lead-tab", label: "Lead" },
            { id: "#pills-Tasks-tab", label: "Tasks" },
            { id: "#pills-Related-tab", label: "Related" },
            { id: "#pills-Conjunction-tab", label: "Conjunction" }
        ];
        const expectedText = "Please create the listing";

        // For each relevant tab, click and check for the expected message
        for (const tab of conjunctionTabs) {
            const tabLocator = this.page.locator(tab.id).first();
            await expect(tabLocator, `Tab "${tab.label}" should be visible`).toBeVisible({ timeout: 10000 });
            await tabLocator.click();

            // Robust check for the expected message only within the right panel
            const matchingParagraphs = await rightPanel.locator('p', { hasText: expectedText }).all();
            let foundVisible = false;
            for (const paragraph of matchingParagraphs) {
                if (await paragraph.isVisible().catch(() => false)) {
                    await expect(paragraph).toBeVisible({ timeout: 10000 });
                    foundVisible = true;
                    break;
                }
            }
            if (!foundVisible) {
                // Fallback: match generic text node inside right panel (exact: false to account for extra text)
                await expect(
                    rightPanel.getByText(expectedText, { exact: false })
                ).toBeVisible({ timeout: 10000 });
            }
        }

        // Optionally close the right form if the close button is present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(2000);
    }

    // Verify the preview listing functionality
    async verifyPreviewListing() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Find the first listing card and open it
        const firstListingCard = this.page.locator('.s-property').first();
        await expect(firstListingCard).toBeVisible({ timeout: 10000 });
        await firstListingCard.click();

        // Click the Preview button (assuming it is a button with text 'Preview')
        const previewBtn = this.page.getByRole('button', { name: /preview Listing/i }).first();
        await previewBtn.waitFor({ state: 'visible' });
        await previewBtn.click();

        // Wait for the preview modal or panel/dialog to be visible
        const previewPanel = this.page.locator('#rightbarwithscroll').first();
        await expect(previewPanel).toBeVisible({ timeout: 10000 });

        // Optionally close preview if there's a close button/icon

        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }

        await this.page.waitForTimeout(2000);
    }

    // Verify the "Admin View" button is present and functional in the preview listing modal
    async verifyAdminViewButtonInPreviewListing() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Find the first listing card and open it
        const firstListingCard = this.page.locator('.s-property').first();
        await expect(firstListingCard).toBeVisible({ timeout: 10000 });
        await firstListingCard.click();

        // Click the Preview button
        const previewBtn = this.page.getByRole('button', { name: /preview Listing/i }).first();
        await expect(previewBtn).toBeVisible({ timeout: 10000 });
        await previewBtn.click();

        // Wait for the preview modal/panel
        const previewPanel = this.page.locator('#rightbarwithscroll').first();
        await expect(previewPanel).toBeVisible({ timeout: 10000 });

        // Locate the "Admin View" button within the preview area
        const adminViewBtn = this.page.getByRole('button', { name: 'Admin View' });
        await adminViewBtn.waitFor({ state: 'visible', timeout: 20000 });

        // Optional: Click the Admin View button and check for the expected admin UI/modal
        await adminViewBtn.click({ force: true });

        // Optionally close admin panel and preview panel
        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);;

        await this.page.waitForTimeout(2000);
    }

    async uploadMultipleImagesToLibrary(imagePaths: string | string[]) {
        const images: string[] = Array.isArray(imagePaths) ? imagePaths : [imagePaths];

        // Navigate to listings
        await this.navigateToListings();
        await this.switchToGridView();

        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Open Images tab
        const imagesTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imagesTab).toBeVisible({ timeout: 10000 });
        await imagesTab.click();
        await this.page.waitForTimeout(6000);

        // Open the File Upload (Public) menu item via Add button with improved handling
        const addButton = this.page.getByRole('button', { name: ' Add' }).first();
        const fileUploadMenuName = 'File Upload (Public)';
        let fileUploadMenu = this.page.getByRole('menuitem', { name: fileUploadMenuName });

        let attempt = 0;
        const maxAttempts = 5;
        let isVisible = false;
        while (!isVisible && attempt < maxAttempts) {
            await addButton.waitFor({ state: 'visible', timeout: 10000 });

            // Defensive: scroll into view and hover
            const addHandle = await addButton.elementHandle();
            if (addHandle) {
                // Scroll to the Add button using JS
                await this.page.evaluate((el) => {
                    el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
                }, addHandle);
            }
            await addButton.hover();
            await this.page.waitForTimeout(150);

            // Attempt click
            await addButton.click({ force: true });
            await this.page.waitForTimeout(600);

            // Refetch menu item after click
            fileUploadMenu = this.page.getByRole('menuitem', { name: fileUploadMenuName });

            try {
                isVisible = await fileUploadMenu.isVisible({ timeout: 1500 });
            } catch {
                isVisible = false;
            }
            attempt++;
        }

        await expect(fileUploadMenu).toBeVisible({ timeout: 10000 });
        await fileUploadMenu.click();

        // 🔥 Upload all images together
        const fileInput = this.page.locator('#fileUpload');
        await fileInput.setInputFiles(images);

        // Wait for success toast
        const toast = this.page.locator('text=Added Successfully');
        await expect(toast).toBeVisible({ timeout: 30000 });

        // Optional: verify all image names appear
        for (const imagePath of images) {
            const imageName = imagePath.split(/[\\/]/).pop();
            if (imageName) {
                const uploadedImage = this.page.locator(
                    `.mt-3.black-text.pb-1.f-12:has-text("${imageName}")`
                );
                await expect(uploadedImage).toBeVisible({ timeout: 50000 });
            }
        }

        // Save & Close
        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await saveAndCloseButton.click();
    }
    // Verify image and thumbnails in preview listing 
    async verifyImageAndThumbnailsInPreviewListing() {
        // Go to listings grid and open first listing
        await this.navigateToListings();
        await this.switchToGridView();

        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();
        // Open the preview
        const previewBtn = this.page.getByRole('button', { name: /Preview Listing/i });
        await expect(previewBtn).toBeVisible({ timeout: 6000 });
        await previewBtn.click();
        await expect(this.page.locator('img.main-images')).toBeVisible();

        await this.page.waitForTimeout(1200);

        // Close the preview modal
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1500);

    }

    // Verify that clicking a thumbnail updates the main image in the preview listing
    async verifyThumbnailSelectionChangesMainImage() {
        // Go to listings grid and open first listing
        await this.navigateToListings();
        await this.switchToGridView();

        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Open the preview
        const previewBtn = this.page.getByRole('button', { name: /Preview Listing/i });
        await expect(previewBtn).toBeVisible({ timeout: 6000 });
        await previewBtn.click();

        await this.page.waitForTimeout(1200);

        // Verify main image is visible
        const mainImage = this.page.locator('img.main-images').first();
        await expect(mainImage).toBeVisible({ timeout: 10000 });

        // Get all thumbnail images (excluding the main image)
        const image = this.page.locator('img.carousel-image').nth(1);
        await expect(image).toBeVisible({ timeout: 2000 });
        await image.click({ force: true });

        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);

        await this.page.waitForTimeout(2000);
    }

    async VerifyListingStatusDisplayInPreview() {
        // Go to listings grid and open first listing
        await this.navigateToListings();
        await this.switchToGridView();

        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Open the preview
        const previewBtn = this.page.getByRole('button', { name: /Preview Listing/i });
        await expect(previewBtn).toBeVisible({ timeout: 6000 });
        await previewBtn.click();

        // Verify main image is visible
        const mainImage = this.page.locator('img.main-images').first();
        await expect(mainImage).toBeVisible({ timeout: 10000 });
        const status = this.page.locator('p.statusStyle1').first();
        await expect(status).toBeVisible({ timeout: 20000 });

        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);

        await this.page.waitForTimeout(2000);
    }

    // Verify total images count in preview
    async verifyTotalImagesCountInPreview() {
        // Go to listings grid and open first listing
        await this.navigateToListings();
        await this.switchToGridView();

        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Open the preview
        const previewBtn = this.page.getByRole('button', { name: /Preview Listing/i });
        await expect(previewBtn).toBeVisible({ timeout: 10000 });
        await previewBtn.click();

        // Wait for main image to load and thumbnails to be present
        const mainImage = this.page.locator('img.main-images').first();
        await expect(mainImage).toBeVisible({ timeout: 10000 });

        const imageIndex = this.page.locator('#listing-image-index').first();

        await expect(imageIndex).toBeVisible({ timeout: 20000 });

        // Close the preview modal safely if visible
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }

        await this.page.waitForTimeout(2000);
    }
    // Verify image days count in preview
    async verifyImageDaysCountInPreview() {
        await this.navigateToListings();
        await this.switchToGridView();

        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Open the preview
        const previewBtn = this.page.getByRole('button', { name: /Preview Listing/i });
        await expect(previewBtn).toBeVisible({ timeout: 10000 });
        await previewBtn.click();

        // Wait for main image and date label to load
        const mainImage = this.page.locator('img.main-images').first();
        await expect(mainImage).toBeVisible({ timeout: 10000 });

        const dateLabel = this.page.locator('p.statusStyle').first();
        await expect(dateLabel).toBeVisible({ timeout: 10000 });

        // Close the preview modal safely if visible
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }

        await this.page.waitForTimeout(2000);
    }

    // Verify sale type display in preview listing 
    async verifySaleTypeDisplayInPreviewListing() {
        await this.navigateToListings();
        await this.switchToGridView();

        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Open the preview
        const previewBtn = this.page.getByRole('button', { name: /Preview Listing/i });
        await expect(previewBtn).toBeVisible({ timeout: 10000 });
        await previewBtn.click();

        // Scroll to the "Sale Type" label in preview and ensure visibility
        const saleTypeLabel = this.page.getByText('Sale Type').last();
        await saleTypeLabel.scrollIntoViewIfNeeded();
        await expect(saleTypeLabel).toBeVisible({ timeout: 10000 });

        // Scroll to the "For Lease" sale status
        const saleStatus = this.page.getByText('For Lease', { exact: true }).first();
        await saleStatus.evaluate((el) => {
            el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
        });
        await expect(saleStatus).toBeVisible({ timeout: 10000 });

        // Close preview safely if visible
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(2000);
    }

    // Verify all listing details display in preview
    async verifyAllListingDetailsInPreview(agentNames: string[]) {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first listing card
        const firstListing = this.page.locator('.s-property').nth(1);
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // --- Fill listing details form ---
        // Agents
        const agentSelectors = [
            { selector: 'div.form-group:has-text("Primary Agent") ng-select', name: agentNames[0] },
            { selector: 'div.form-group:has-text("Secondary Agent") ng-select', name: agentNames[1] }
        ];
        for (const agent of agentSelectors) {
            const agentDropdown = this.page.locator(agent.selector);
            await expect(agentDropdown).toBeVisible();
            await agentDropdown.click();

            const agentInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']");
            await expect(agentInput).toBeVisible({ timeout: 3000 });
            await agentInput.fill(agent.name);

            const agentOption = this.page.locator(
                '.ng-dropdown-panel .ng-option',
                { hasText: agent.name }
            ).first();
            await expect(agentOption).toBeVisible({ timeout: 10000 });
            await agentOption.click();
        }

        // Date field (assume second input is date field)
        const dateInput = this.page.locator('input.p-inputtext.p-component').nth(1);
        await expect(dateInput).toBeVisible({ timeout: 10000 });
        await dateInput.click({ force: true });
        const todayCell = this.page.locator('.p-datepicker-today, td[aria-current="date"]'); // Robust selector
        await expect(todayCell).toBeVisible({ timeout: 10000 });
        await todayCell.click({ force: true });

        // Price
        const priceInput = this.page.locator('input[name="price"]').first();
        await expect(priceInput).toBeVisible({ timeout: 10000 });
        await priceInput.click();
        await priceInput.fill('10000');

        // Bedrooms, Bathrooms, Ensuite, Living Areas, Study, Pool, Garage
        const fieldSets = [
            { selector: 'input[formcontrolname="beds"], input[name="bedrooms"], input[data-testid="bedrooms"]', value: '2' },
            { selector: 'input[formcontrolname="baths"], input[name="bathrooms"], input[data-testid="bathrooms"]', value: '1' },
            { selector: 'input[name="ensuite"], input[data-testid="ensuite"], input[formcontrolname="ensuite"]', value: '1' },
            { selector: 'input[formcontrolname="living_areas"]', value: '1' },
            { selector: 'input[formcontrolname="study"], input[name="study"], input[data-testid="study"]', value: '1' },
            { selector: 'input[formcontrolname="pools"]', value: '1' },
            { selector: 'input[formcontrolname="garage"]', value: '1' }
        ];

        for (const field of fieldSets) {
            const input = this.page.locator(field.selector).first();
            await expect(input).toBeVisible({ timeout: 10000 });
            await input.click();
            await input.fill(field.value);
        }

        // Carport
        const carportInput = this.page.locator(
            'div.col-xl-4:has(p:has-text("Carport")) input[type="number"]'
        );
        await expect(carportInput).toBeVisible({ timeout: 10000 });
        await carportInput.click();
        await carportInput.fill('1');

        // Open Spaces
        const openSpacesInput = this.page.locator(
            'div.col-xl-4:has(p:has-text("Open Spaces")) input[type="number"]'
        );
        await expect(openSpacesInput).toBeVisible({ timeout: 10000 });
        await openSpacesInput.click();
        await openSpacesInput.fill('2');

        // Land Size
        const landSizeInput = this.page.locator(
            'div.col-sm-6:has(p:has-text("Land Size")) input[formcontrolname="land_area"]'
        );
        await expect(landSizeInput).toBeVisible({ timeout: 10000 });
        await landSizeInput.click();
        await landSizeInput.fill('500');

        // House Size
        const houseSizeInput = this.page.locator(
            'input[formcontrolname="building_area"], input[name="building_area"], input[data-testid="house-size"]'
        ).first();
        await expect(houseSizeInput).toBeVisible({ timeout: 10000 });
        await houseSizeInput.click();
        await houseSizeInput.fill('250');

        // Headline
        const headlineInput = this.page.locator('input[formcontrolname="heading"], input[name="heading"], input[data-testid="headline"]').first();
        await expect(headlineInput).toBeVisible({ timeout: 10000 });
        await headlineInput.click();
        await headlineInput.fill('Test Headline');

        // Description
        // Use a more stable and short locator: target the visible textarea/input for description
        const descriptionInput = this.page.locator(
            'ckeditor[formcontrolname="description_garax"] .ck-editor__editable'
        ).first();
        await expect(descriptionInput).toBeVisible({ timeout: 10000 });
        await descriptionInput.click({ force: true });
        await descriptionInput.fill('This is a test description.');

        // Features selection
        const featuresHeading = this.page.locator('div.boxHeadingText:has-text("Features") p');
        await featuresHeading.scrollIntoViewIfNeeded();
        await expect(featuresHeading).toBeVisible();

        const featuredropdown = this.page.locator("//span[normalize-space()='Please Select']").first();
        await expect(featuredropdown).toBeVisible({ timeout: 10000 });
        await featuredropdown.click();

        const firstFeatureOption = this.page.locator('li.p-element').first();
        await expect(firstFeatureOption).toBeVisible({ timeout: 10000 });
        await firstFeatureOption.click({ force: true });

        // Locate the "sort-up" icon
        const sortUpIcon = this.page.locator('i.fas.fa-sort-up');
        if (await sortUpIcon.isVisible({ timeout: 5000 }).catch(() => false)) {
            await sortUpIcon.click();
        }

        // Save changes
        const saveButton = this.page.locator('button:has-text("Save")').nth(2);
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click();
        await this.page.waitForTimeout(2000);

        // --- Preview and assertions ---
        // Open the preview dialog
        const previewBtn = this.page.getByRole('button', { name: /Preview Listing/i });
        await expect(previewBtn).toBeVisible({ timeout: 10000 });
        await previewBtn.scrollIntoViewIfNeeded();
        await previewBtn.click();


        const auctionsLabel = this.page.getByText('Auctions', { exact: true });
        await auctionsLabel.scrollIntoViewIfNeeded();
        await expect(auctionsLabel).toBeVisible({ timeout: 3000 });

        // Bedroom, bathroom, car spaces and sizing labels and values
        await expect(this.page.locator('text=Bedroom').last()).toBeVisible({ timeout: 3000 });

        await expect(this.page.locator('text=Bathroom').last()).toBeVisible({ timeout: 3000 });

        await expect(this.page.locator('text=Car Spaces').last()).toBeVisible({ timeout: 3000 });

        await expect(this.page.locator('text=Land Size').last()).toBeVisible({ timeout: 3000 });

        await expect(this.page.locator('text=House Size').last()).toBeVisible({ timeout: 3000 });

        // Agents - both primary and secondary shown horizontally
        await expect(this.page.getByText('Automation Test', { exact: true }).last()).toBeVisible({ timeout: 3000 });
        await expect(this.page.getByText('Hina Agent', { exact: false }).last()).toBeVisible({ timeout: 3000 });

        // Description section
        await expect(this.page.getByText('Description', { exact: true })).toBeVisible({ timeout: 3000 });
        await expect(this.page.getByText('Test Headline', { exact: true })).toBeVisible({ timeout: 3000 }); // headline
        await expect(this.page.getByText('This is a test description.', { exact: true })).toBeVisible({ timeout: 3000 }); // description

        // Features section and first feature selected
        await expect(this.page.getByText('Features', { exact: true })).toBeVisible({ timeout: 3000 });
        // Air Conditioning is the selected feature in the image
        await expect(this.page.getByText('Air Conditioning', { exact: true })).toBeVisible({ timeout: 3000 });


        // Close the preview dialog
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(2000);
    }

    // Verify fields are not editable in preview listing 
    async verifyFieldsNotEditableInPreviewListing() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstListing = this.page.locator('.s-property').nth(1);
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Open the preview dialog
        const previewBtn = this.page.getByRole('button', { name: /Preview Listing/i });
        await previewBtn.waitFor({ state: 'visible', timeout: 10000 });
        await previewBtn.click();
        // Wait until the preview dialog/modal is attached to the DOM
        const previewDialog = this.page.locator('#rightbarwithscroll').first();
        await previewDialog.waitFor({ state: 'attached', timeout: 10000 });

        // Wait for preview to open (headline should be visible as a marker)
        const descriptionLocator = this.page.locator('text=Description').last();
        await descriptionLocator.scrollIntoViewIfNeeded();
        await expect(descriptionLocator).toBeVisible({ timeout: 10000 });

        // Verify expected fields/inputs are not editable
        const headlineInput = this.page.locator('input[formcontrolname="headline"]');
        const descInput = this.page.locator('textarea[formcontrolname="description"]');
        const priceInput = this.page.locator('input[name="price"]');
        const agentDropdown = this.page.locator('div.form-group:has-text("Primary Agent") ng-select input');
        const featureDropdown = this.page.locator('div:has-text("Features") ng-select');

        // Expect no enabled headline input
        await expect(headlineInput).toBeHidden();
        await expect(descInput).toBeHidden();
        await expect(priceInput).toBeHidden();
        // Features and agents should not be dropdowns/inputs here
        await expect(agentDropdown).toBeHidden();
        // Close preview
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(2000);
    }

    // Verify Save button functionality
    async clickSaveButtonOnListingForm() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Find the price input (try common selectors)
        const priceInput = this.page.locator('input[name="price"]').first();
        await expect(priceInput).toBeVisible({ timeout: 10000 });
        await priceInput.evaluate((el) => el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'auto' }));
        await priceInput.click();
        await priceInput.clear();
        await priceInput.fill('12345');

        // Click the save button 
        const saveButton = this.page.locator('button:has-text("Save")').nth(2);
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.scrollIntoViewIfNeeded()
        await saveButton.click();

        // Close the form (if modal/dialog close icon present)
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    // Verify Save & Close button functionality
    async clickSaveAndCloseButtonOnListingForm() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 10000 });
        await firstListing.click();

        // Find the price input (try common selectors)
        const priceInput = this.page.locator('input[name="price"]').first();
        await expect(priceInput).toBeVisible({ timeout: 10000 });
        await priceInput.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'auto' }));
        await priceInput.click();
        await priceInput.clear();
        await priceInput.fill('54321');

        // Click the "Save & Close" button
        const saveAndCloseButton = this.page.getByRole('button', { name: /Save & Close/i }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }

    async verifySaveAndCloseButtonFunctionality() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 30000 });
        await firstListing.click();

        // Click the "Save & Close" button
        const saveAndCloseButton = this.page.getByRole('button', { name: /Save & Close/i }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();

        // Optionally, add a wait or verification after closing
        await this.page.waitForTimeout(1200);
    }

    // Verify correct error message for missing property type
    async verifyMissingPropertyTypeError() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click "Add New Listing" button (adjust selector as needed), and wait for form
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]");
        await expect(contactFormBtn).toBeVisible({ timeout: 10000 });
        await contactFormBtn.dblclick({ force: true });
        await expect(this.page.locator('#rightbarwithscroll')).toBeVisible({ timeout: 10000 });

        // Try to save without selecting property type
        const saveButton = this.page.getByRole('button', { name: /^Save$/i }).first();
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click();

        // Expect correct error message for missing property type (adjust selector/message as needed)
        const errorMessage = this.page.getByText(/Required fields must be filled in/i);
        await expect(errorMessage).toBeVisible({ timeout: 10000 });

        // Press Escape to close the error dialog or form
        await this.page.waitForTimeout(1000);
        // Also ensure pop-up form is closed if [x] icon is present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }

        await this.page.waitForTimeout(2000);

    }

    // Verify correct error message for missing listing type
    async verifyMissingListingTypeError() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click "Add New Listing" button and wait for the form to open
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]");
        await expect(contactFormBtn).toBeVisible({ timeout: 10000 });
        await contactFormBtn.dblclick({ force: true });
        await expect(this.page.locator('#rightbarwithscroll')).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);

        // Attempt to save without selecting listing type
        const saveButton = this.page.getByRole('button', { name: /^Save$/i }).first();
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click();

        // Assert the correct error message for missing listing type
        const errorMessage = this.page.getByText(/Required fields must be filled in/i);
        await expect(errorMessage).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1000);
        // Also ensure pop-up form is closed if [x] icon is present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }

        await this.page.waitForTimeout(2000);
    }

    // Verify if the 'Sold' status popup appears when selecting 'Sold' in the listing status dropdown.
    async verifySoldStatusPopupAppears() {
        await this.navigateToListings();
        await this.switchToGridView();
        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 30000 });
        // Open add new listing form
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]").first();
        await expect(contactFormBtn).toBeVisible({ timeout: 10000 });
        await contactFormBtn.dblclick({ force: true });
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        const listingsTypeDropdown = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).getByRole('combobox');
        await expect(listingsTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingsTypeDropdown.click();

        // Search 'Auction' inside Listings Type dropdown
        const listingsTypeSearchInput = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).locator('input[type="text"]');
        await expect(listingsTypeSearchInput).toBeVisible({ timeout: 10000 });
        await listingsTypeSearchInput.fill('Auction');
        await this.page.waitForTimeout(500);

        const auctionOption = this.page.getByRole('option', { name: 'Auction' });
        await auctionOption.waitFor({ state: 'visible' });
        await auctionOption.click();

        const listingStatusDropdown = this.page.locator('ng-select').filter({ hasText: 'Listing Status' });
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        const forSaleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Sold' }).first();
        await expect(forSaleOption).toBeVisible({ timeout: 10000 });
        await forSaleOption.click();

        const soldPopup = this.page.getByText('Listing Sold × Date SoldSold');
        await expect(soldPopup).toBeVisible({ timeout: 10000 });

        const closeBtn = this.page.getByRole('button', { name: 'Close', exact: true });
        await expect(closeBtn).toBeVisible({ timeout: 10000 });
        await closeBtn.click({ force: true });
        await this.page.waitForTimeout(1000);
        // Verify the popup is closed (should not be visible)
        await this.page.waitForTimeout(1000);
        // Also ensure pop-up form is closed if [x] icon is present
        const closeBtn2 = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn2.isVisible().catch(() => false)) {
            await closeBtn2.click();
        }
    }

    // Verify that a newly created listing appears at the top of the grid view after creation
    async verifyListingAppearsAtTopAfterCreation() {
        await this.verifyListingAppearsInGrid();
    }

    // Verify if the 'Sold' status popup contains the correct fields.
    async verifySoldStatusPopupFields() {
        await this.navigateToListings();
        await this.switchToGridView();
        const firstListing = this.page.locator('.s-property').first();
        await expect(firstListing).toBeVisible({ timeout: 20000 });

        // Open add new listing form
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]").first();
        await expect(contactFormBtn).toBeVisible({ timeout: 10000 });
        await contactFormBtn.dblclick({ force: true });
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        const listingsTypeDropdown = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).getByRole('combobox');
        await expect(listingsTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingsTypeDropdown.click();

        // Search 'Auction' inside Listings Type dropdown
        const listingsTypeSearchInput = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).locator('input[type="text"]');
        await expect(listingsTypeSearchInput).toBeVisible({ timeout: 10000 });
        await listingsTypeSearchInput.fill('Auction');
        await this.page.waitForTimeout(500);

        const auctionOption = this.page.getByRole('option', { name: 'Auction' });
        await auctionOption.waitFor({ state: 'visible' });
        await auctionOption.click();

        const listingStatusDropdown = this.page.locator('ng-select').filter({ hasText: 'Listing Status' });
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        const forSaleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Sold' }).first();
        await expect(forSaleOption).toBeVisible({ timeout: 10000 });
        await forSaleOption.click();

        // Assert popup appears
        const soldPopup = this.page.getByText('Listing Sold × Date SoldSold');
        await expect(soldPopup).toBeVisible({ timeout: 10000 });

        // "Date Sold" input field (can be role-based or using improved selector)
        const dateSoldInput = this.page.getByText('Date Sold').first();
        await expect(dateSoldInput).toBeVisible({ timeout: 3000 });

        // "Sold Price" field using a stable text or label query
        const soldPriceInput = this.page.getByText(/Sold Price/i).first();
        await expect(soldPriceInput).toBeVisible({ timeout: 3000 });

        // disclose price
        const disclosePriceCheckbox = this.page.getByText('Disclose Price');
        await expect(disclosePriceCheckbox).toBeVisible({ timeout: 3000 });
        // Close the popup
        const closeBtn = this.page.getByRole('button', { name: 'Close', exact: true });
        await expect(closeBtn).toBeVisible({ timeout: 10000 });
        await closeBtn.click({ force: true });
        await this.page.waitForTimeout(1000);

        await this.page.waitForTimeout(1000);
        // Also ensure pop-up form is closed if [x] icon is present
        const closeBtn2 = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn2.isVisible().catch(() => false)) {
            await closeBtn2.click();
        }
        await this.page.waitForTimeout(2000);
    }
    /**
     * Verify that the 'Sold' status popup can be closed without saving changes.
     */
    async verifySoldStatusPopupCanBeClosedWithoutSaving() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing's add form
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]").first();
        await expect(contactFormBtn).toBeVisible({ timeout: 10000 });
        await contactFormBtn.dblclick({ force: true });
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        const listingsTypeDropdown = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).getByRole('combobox');
        await expect(listingsTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingsTypeDropdown.click();

        // Search 'Auction' inside Listings Type dropdown
        const listingsTypeSearchInput = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).locator('input[type="text"]');
        await expect(listingsTypeSearchInput).toBeVisible({ timeout: 10000 });
        await listingsTypeSearchInput.fill('Auction');
        await this.page.waitForTimeout(500);

        const auctionOption = this.page.getByRole('option', { name: 'Auction' });
        await auctionOption.waitFor({ state: 'visible' });
        await auctionOption.click();

        const listingStatusDropdown = this.page.locator('ng-select').filter({ hasText: 'Listing Status' });
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        const forSaleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Sold' }).first();
        await expect(forSaleOption).toBeVisible({ timeout: 10000 });
        await forSaleOption.click();

        // Wait for popup
        const soldPopup = this.page.getByText('Listing Sold × Date SoldSold');
        await expect(soldPopup).toBeVisible({ timeout: 10000 });

        // Attempt to close: click "Close" button
        const closeBtn = this.page.getByRole('button', { name: 'Close', exact: true });
        await expect(closeBtn).toBeVisible({ timeout: 10000 });
        await closeBtn.click({ force: true });
        await this.page.waitForTimeout(1000);

        // Verify the popup is closed (should not be visible)
        await expect(soldPopup).not.toBeVisible({ timeout: 3000 });
        await this.page.waitForTimeout(1000);
        // Also ensure pop-up form is closed if [x] icon is present
        const closeBtn2 = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn2.isVisible().catch(() => false)) {
            await closeBtn2.click();
        }
        await this.page.waitForTimeout(2000);

    }

    /**
    * Verify if the 'Sold' status popup saves data correctly when valid inputs are provided.
    */
    async verifySoldStatusPopupSavesWithValidInputs() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing's add form
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]").first();
        await expect(contactFormBtn).toBeVisible({ timeout: 10000 });
        await contactFormBtn.dblclick({ force: true });
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        const listingsTypeDropdown = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).getByRole('combobox');
        await expect(listingsTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingsTypeDropdown.click();

        // Search 'Auction' inside Listings Type dropdown
        const listingsTypeSearchInput = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).locator('input[type="text"]');
        await expect(listingsTypeSearchInput).toBeVisible({ timeout: 10000 });
        await listingsTypeSearchInput.fill('Auction');
        await this.page.waitForTimeout(500);

        const auctionOption = this.page.getByRole('option', { name: 'Auction' });
        await auctionOption.waitFor({ state: 'visible' });
        await auctionOption.click();

        const listingStatusDropdown = this.page.locator('ng-select').filter({ hasText: 'Listing Status' });
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        const forSaleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Sold' }).first();
        await expect(forSaleOption).toBeVisible({ timeout: 10000 });
        await forSaleOption.click();

        // Wait for popup
        const soldPopup = this.page.getByText('Listing Sold × Date SoldSold');
        await expect(soldPopup).toBeVisible({ timeout: 10000 });

        const dateSoldInput = this.page.locator('p-calendar[formcontrolname="soldDate"] input');
        await dateSoldInput.click({ force: true });

        // 1️⃣ Compute Tomorrow
        const soldDate = new Date();
        soldDate.setDate(soldDate.getDate());

        const targetDay = soldDate.getDate();
        const targetMonth = soldDate.getMonth();
        const targetYear = soldDate.getFullYear();

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

        await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
        await dayLocator.first().click({ force: true });
        const priceInput = this.page.locator('input[formcontrolname="soldPrice"], input[name="soldPrice"]').first();
        await expect(priceInput).toBeVisible({ timeout: 10000 });
        await priceInput.click({ force: true });
        await priceInput.fill('1234');

        await this.page.waitForTimeout(2000);

        // Click Save on the popup
        const saveAndCloseBtn = this.page.getByRole('button', { name: /Save & Close/i }).last();
        await expect(saveAndCloseBtn).toBeVisible({ timeout: 10000 });
        await saveAndCloseBtn.click({ force: true });

        // Wait for popup to close
        await expect(soldPopup).not.toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1000);

        const dateSoldField = this.page.getByText('Date Sold');
        await expect(dateSoldField).toBeVisible({ timeout: 10000 });

        // Grab values for assertions
        const dateSoldText = await dateSoldField.textContent();
        const soldPriceField = this.page.getByText('Sold Price:');
        const soldPriceText = await soldPriceField.textContent();
        const disclosePriceField = this.page.getByText('Disclose Price');
        const disclosePriceText = await disclosePriceField.textContent();

        // 1. Assert "Date Sold" matches tomorrow's date in correct format (MM/DD/YYYY)
        const pad = (n: number) => n.toString().padStart(2, "0");
        const formattedDate = `${pad(soldDate.getDate())}/${pad(soldDate.getMonth() + 1)}/${soldDate.getFullYear()}`;
        expect(dateSoldText).toContain(formattedDate);

        expect(soldPriceField).toBeVisible();
        expect(disclosePriceField).toBeVisible();

        await this.page.waitForTimeout(1000);
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(2000);
    }


    async updateSoldDetailsAndVerify() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing's add form
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]").first();
        await expect(contactFormBtn).toBeVisible({ timeout: 10000 });
        await contactFormBtn.dblclick({ force: true });
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);

        const listingsTypeDropdown = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).getByRole('combobox');
        await expect(listingsTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingsTypeDropdown.click();

        // Search 'Auction' inside Listings Type dropdown
        const listingsTypeSearchInput = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).locator('input[type="text"]');
        await expect(listingsTypeSearchInput).toBeVisible({ timeout: 10000 });
        await listingsTypeSearchInput.fill('Auction');
        await this.page.waitForTimeout(500);

        const auctionOption = this.page.getByRole('option', { name: 'Auction' });
        await auctionOption.waitFor({ state: 'visible' });
        await auctionOption.click();

        const listingStatusDropdown = this.page.locator('ng-select').filter({ hasText: 'Listing Status' });
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        const forSaleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Sold' }).first();
        await expect(forSaleOption).toBeVisible({ timeout: 10000 });
        await forSaleOption.click();
        // Wait for popup
        const soldPopup = this.page.getByText('Listing Sold × Date SoldSold');
        await expect(soldPopup).toBeVisible({ timeout: 10000 });

        const dateSoldInput = this.page.locator('p-calendar[formcontrolname="soldDate"] input');
        await dateSoldInput.click({ force: true });

        // 1️⃣ Compute Tomorrow
        const soldDate = new Date();
        soldDate.setDate(soldDate.getDate());

        const targetDay = soldDate.getDate();
        const targetMonth = soldDate.getMonth();
        const targetYear = soldDate.getFullYear();

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

        await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
        await dayLocator.first().click({ force: true });
        const priceInput = this.page.locator('input[formcontrolname="soldPrice"], input[name="soldPrice"]').first();
        await expect(priceInput).toBeVisible({ timeout: 10000 });
        await priceInput.click({ force: true });
        await priceInput.fill('1234');

        await this.page.waitForTimeout(2000);

        // Click Save on the popup
        const saveAndCloseBtn = this.page.getByRole('button', { name: /Save & Close/i }).last();
        await expect(saveAndCloseBtn).toBeVisible({ timeout: 10000 });
        await saveAndCloseBtn.click({ force: true });

        // Wait for popup to close
        await expect(soldPopup).not.toBeVisible({ timeout: 10000 });

        const dateSoldField = this.page.getByText('Date Sold');
        await expect(dateSoldField).toBeVisible({ timeout: 10000 });

        // Grab values for assertions
        const dateSoldText = await dateSoldField.textContent();
        const soldPriceField = this.page.getByText('Sold Price:');
        const soldPriceText = await soldPriceField.textContent();
        const disclosePriceField = this.page.getByText('Disclose Price');
        const disclosePriceText = await disclosePriceField.textContent();

        // Assert today's date using current date
        const pad = (n: number) => n.toString().padStart(2, "0");
        const formattedDate = `${pad(soldDate.getDate())}/${pad(soldDate.getMonth() + 1)}/${soldDate.getFullYear()}`;
        expect(dateSoldText).toContain(formattedDate);

        expect(soldPriceField).toBeVisible();
        expect(disclosePriceField).toBeVisible();

        // Pencil icon (<img> - edit sold status)
        const pencilIcon = this.page.locator('.pencil-cross').first();
        await expect(pencilIcon).toBeVisible({ timeout: 10000 });
        await pencilIcon.click();

        const dialog = this.page.locator('.confirmation-dialog-body');
        await dialog.waitFor({ state: "visible", timeout: 10000 });
        // Update "Sold Price"
        const priceInputEdit = this.page.locator('input[formcontrolname="soldPrice"], input[name="soldPrice"]').first();
        await expect(priceInputEdit).toBeVisible({ timeout: 10000 });

        const priceValue = '5678';
        await priceInputEdit.fill(priceValue);
        await this.page.waitForTimeout(1200);
        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).last();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click({ force: true })
        // Verify updated details in the main view
        const dateSoldFieldAfter = this.page.getByText('Date Sold').first();
        await expect(dateSoldFieldAfter).toBeVisible({ timeout: 10000 });
        const dateSoldTextAfter = await dateSoldFieldAfter.textContent();

        const soldPriceFieldAfter = this.page.getByText('Sold Price:').first();
        const soldPriceTextAfter = await soldPriceFieldAfter.textContent();
        // Match formatted price value (with or without separator)
        expect(soldPriceTextAfter?.replace(/\D/g, '')).toContain(priceValue);

        // Optionally verify Disclose Price still "No"
        const disclosePriceFieldAfter = this.page.getByText('Disclose Price').first();
        const disclosePriceTextAfter = await disclosePriceFieldAfter.textContent();
        expect(disclosePriceTextAfter).toMatch(/Disclose Price:\s*No/);
        await this.page.waitForTimeout(1500);
        // Also ensure pop-up form is closed if [x] icon is present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1500);
    }

    /**
     * Verify if the listing disappears from grid/list view after changing status to 'Sold'.
     */
    async verifyListingDisappearsAfterMarkingSold() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Wait for card rows to load
        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows.first()).toBeVisible({ timeout: 10000 });

        // Get trimmed heading of the first listing - specifically targeting the <h3> that holds the address
        const firstCardHeadingLocator = this.page.locator('h3.props-bg.cp.mb-1.px-0[title]').first();
        let headingTextTrimmed: string | undefined = undefined;
        if (await firstCardHeadingLocator.isVisible({ timeout: 2000 })) {
            const headingTextRaw = await firstCardHeadingLocator.textContent();
            headingTextTrimmed = headingTextRaw?.trim();
        }

        await firstCardHeadingLocator.click({ force: true });

        await this.page.waitForTimeout(1200);

        // Wait for edit form to show up
        const editForm = this.page.locator('#rightbarwithscroll');
        await expect(editForm).toBeVisible({ timeout: 8000 });

        const listingsTypeDropdown = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).getByRole('combobox');
        await expect(listingsTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingsTypeDropdown.click();

        // Search 'Auction' inside Listings Type dropdown
        const listingsTypeSearchInput = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).locator('input[type="text"]');
        await expect(listingsTypeSearchInput).toBeVisible({ timeout: 10000 });
        await listingsTypeSearchInput.fill('Auction');
        await this.page.waitForTimeout(500);

        const auctionOption = this.page.getByRole('option', { name: 'Auction' });
        await auctionOption.waitFor({ state: 'visible' });
        await auctionOption.click();

        const listingStatusDropdown = this.page.locator('ng-select').filter({ hasText: 'Listing Status' });
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        const forSaleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Sold' }).first();
        await expect(forSaleOption).toBeVisible({ timeout: 10000 });
        await forSaleOption.click();

        await this.page.waitForTimeout(1200);

        // Fill in required Sold data
        const soldPopup = this.page.getByText('Listing Sold × Date SoldSold');
        await expect(soldPopup).toBeVisible({ timeout: 10000 });

        const dateSoldInput = this.page.locator('p-calendar[formcontrolname="soldDate"] input');
        await dateSoldInput.click({ force: true });

        // 1️⃣ Compute Tomorrow
        const soldDate = new Date();
        soldDate.setDate(soldDate.getDate());

        const targetDay = soldDate.getDate();
        const targetMonth = soldDate.getMonth();
        const targetYear = soldDate.getFullYear();

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

        await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
        await dayLocator.first().click({ force: true });
        const priceInput = this.page.locator('input[formcontrolname="soldPrice"], input[name="soldPrice"]').first();
        await expect(priceInput).toBeVisible({ timeout: 10000 });
        await priceInput.click({ force: true });
        await priceInput.fill('1234');

        await this.page.waitForTimeout(2000);

        // Click Save on the popup
        const saveAndCloseBtn = this.page.getByRole('button', { name: /Save & Close/i }).last();
        await expect(saveAndCloseBtn).toBeVisible({ timeout: 10000 });
        await saveAndCloseBtn.click({ force: true });

        // Wait for popup to close
        await expect(soldPopup).not.toBeVisible({ timeout: 10000 });

        const dateSoldField = this.page.getByText('Date Sold');
        await expect(dateSoldField).toBeVisible({ timeout: 10000 });

        // Grab values for assertions
        const dateSoldText = await dateSoldField.textContent();
        const soldPriceField = this.page.getByText('Sold Price:');
        const soldPriceText = await soldPriceField.textContent();
        const disclosePriceField = this.page.getByText('Disclose Price');
        const disclosePriceText = await disclosePriceField.textContent();

        // Assert today's date using current date
        const pad = (n: number) => n.toString().padStart(2, "0");
        const formattedDate = `${pad(soldDate.getDate())}/${pad(soldDate.getMonth() + 1)}/${soldDate.getFullYear()}`;
        expect(dateSoldText).toContain(formattedDate);

        expect(soldPriceField).toBeVisible();
        expect(disclosePriceField).toBeVisible();

        await this.page.waitForTimeout(2000);

        // Wait for edit form to close
        const saveAndCloseButton = this.page.getByRole('button', { name: /Save & Close/i }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 6000 });
        await saveAndCloseButton.click({ force: true });
        await this.page.waitForTimeout(5000); // Optionally ensure animations finish

        // After marking as Sold, search for the trimmed address and verify no listing appears
        const searchInput = this.page.locator('input[placeholder="Search"]').last();
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        // Only fill and search if we actually have a trimmed heading available
        if (headingTextTrimmed) {
            await searchInput.fill(headingTextTrimmed);
            await this.page.keyboard.press('Enter');
            await this.page.waitForTimeout(1000); // Wait for search to process
            // Now verify that no listing is displayed
            const cardCount = await cardRows.filter({ hasText: headingTextTrimmed }).count();
            expect(cardCount).toBe(0); // No listing should be found after sold
        } else {
            throw new Error("Could not locate/trim the first listing's heading text for search and verification.");
        }
    }

    // Verify if invalid data in 'Sold Price' field (e.g., letters) is handled correctly.
    async verifyInvalidSoldPriceInput() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing's add form
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]").first();
        await expect(contactFormBtn).toBeVisible({ timeout: 10000 });
        await contactFormBtn.dblclick({ force: true });
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        const listingsTypeDropdown = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).getByRole('combobox');
        await expect(listingsTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingsTypeDropdown.click();

        // Search 'Auction' inside Listings Type dropdown
        const listingsTypeSearchInput = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).locator('input[type="text"]');
        await expect(listingsTypeSearchInput).toBeVisible({ timeout: 10000 });
        await listingsTypeSearchInput.fill('Auction');
        await this.page.waitForTimeout(500);

        const auctionOption = this.page.getByRole('option', { name: 'Auction' });
        await auctionOption.waitFor({ state: 'visible' });
        await auctionOption.click();

        const listingStatusDropdown = this.page.locator('ng-select').filter({ hasText: 'Listing Status' });
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        const forSaleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Sold' }).first();
        await expect(forSaleOption).toBeVisible({ timeout: 10000 });
        await forSaleOption.click();
        await this.page.waitForTimeout(1200);

        // Wait for popup
        const soldPopup = this.page.getByText('Listing Sold × Date SoldSold');
        await expect(soldPopup).toBeVisible({ timeout: 10000 });

        const dateSoldInput = this.page.locator('p-calendar[formcontrolname="soldDate"] input');
        await dateSoldInput.click({ force: true });

        // 1️⃣ Compute Tomorrow
        const soldDate = new Date();
        soldDate.setDate(soldDate.getDate());

        const targetDay = soldDate.getDate();
        const targetMonth = soldDate.getMonth();
        const targetYear = soldDate.getFullYear();

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

        await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
        await dayLocator.first().click({ force: true });

        const priceInput = this.page.locator('input[formcontrolname="soldPrice"], input[name="soldPrice"]').first();
        await expect(priceInput).toBeVisible({ timeout: 10000 });
        // Fill 'abc' and verify it auto-cleared (invalid)
        await priceInput.fill('abc');
        await this.page.keyboard.press('Enter');
        // After entering non-numeric, it should auto-clear (invalid input)
        await expect(priceInput).toHaveValue('', { timeout: 10000 });

        await this.page.waitForTimeout(1200);

        // Now ready for next steps (e.g., fill valid value later)

        // Click Save on the popup
        const saveAndCloseBtn = this.page.getByRole('button', { name: /Save & Close/i }).last();
        await expect(saveAndCloseBtn).toBeVisible({ timeout: 10000 });
        await saveAndCloseBtn.click({ force: true });

        await expect(soldPopup).not.toBeVisible({ timeout: 10000 });

        // Verify the popup is closed (should not be visible)
        await expect(soldPopup).not.toBeVisible({ timeout: 3000 });
        await this.page.waitForTimeout(1000);
        // Also ensure pop-up form is closed if [x] icon is present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(2000);
    }

    // Verify if the 'Disclose Price' checkbox can be selected/deselected.
    async verifyDisclosePriceCheckboxFunctionality() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing's add form
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]").first();
        await expect(contactFormBtn).toBeVisible({ timeout: 10000 });
        await contactFormBtn.dblclick({ force: true });
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        const listingsTypeDropdown = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).getByRole('combobox');
        await expect(listingsTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingsTypeDropdown.click();

        // Search 'Auction' inside Listings Type dropdown
        const listingsTypeSearchInput = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).locator('input[type="text"]');
        await expect(listingsTypeSearchInput).toBeVisible({ timeout: 10000 });
        await listingsTypeSearchInput.fill('Auction');
        await this.page.waitForTimeout(500);

        const auctionOption = this.page.getByRole('option', { name: 'Auction' });
        await auctionOption.waitFor({ state: 'visible' });
        await auctionOption.click();

        const listingStatusDropdown = this.page.locator('ng-select').filter({ hasText: 'Listing Status' });
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        const forSaleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Sold' }).first();
        await expect(forSaleOption).toBeVisible({ timeout: 10000 });
        await forSaleOption.click();

        // Wait for popup
        const soldPopup = this.page.getByText('Listing Sold × Date SoldSold');
        await expect(soldPopup).toBeVisible({ timeout: 10000 });

        // Locate the Disclose Price checkbox
        const discloseCheckbox = this.page.locator('.p-element.mb-2 > .p-checkbox > .p-checkbox-box');
        await discloseCheckbox.waitFor({ state: 'visible', timeout: 10000 });
        // Click to toggle
        await discloseCheckbox.click();
        await this.page.waitForTimeout(500);

        // Click again to toggle back
        await discloseCheckbox.click();
        await this.page.waitForTimeout(500);

        // Close the popup by clicking "Save & Close"
        const saveAndCloseBtn = this.page.getByRole('button', { name: /Save & Close/i }).last();
        await expect(saveAndCloseBtn).toBeVisible({ timeout: 10000 });
        await saveAndCloseBtn.click({ force: true });

        await this.page.waitForTimeout(1200);

        // Wait until the Sold popup is closed
        await expect(soldPopup).not.toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);
        // Also ensure pop-up form is closed if [x] icon is present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(2000);
    }

    // Verify if selecting 'Disclose Price' correctly reflects in the saved listing details.
    async verifyDisclosePriceCheckboxReflectsInListing() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Wait for card rows to load
        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows.first()).toBeVisible({ timeout: 10000 });

        // Get trimmed heading of the first listing - specifically targeting the <h3> that holds the address
        const firstCardHeadingLocator = this.page.locator('h3.props-bg.cp.mb-1.px-0[title]').first();
        let headingTextTrimmed: string | undefined = undefined;
        if (await firstCardHeadingLocator.isVisible({ timeout: 2000 })) {
            const headingTextRaw = await firstCardHeadingLocator.textContent();
            headingTextTrimmed = headingTextRaw?.trim();
        }

        await firstCardHeadingLocator.click({ force: true });

        // Wait for edit form to show up
        const editForm = this.page.locator('#rightbarwithscroll');
        await expect(editForm).toBeVisible({ timeout: 8000 });

        const listingsTypeDropdown = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).getByRole('combobox');
        await expect(listingsTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingsTypeDropdown.click();

        // Search 'Auction' inside Listings Type dropdown
        const listingsTypeSearchInput = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).locator('input[type="text"]');
        await expect(listingsTypeSearchInput).toBeVisible({ timeout: 10000 });
        await listingsTypeSearchInput.fill('Auction');
        await this.page.waitForTimeout(500);

        const auctionOption = this.page.getByRole('option', { name: 'Auction' });
        await auctionOption.waitFor({ state: 'visible' });
        await auctionOption.click();

        const listingStatusDropdown = this.page.locator('ng-select').filter({ hasText: 'Listing Status' });
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        const forSaleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Sold' }).first();
        await expect(forSaleOption).toBeVisible({ timeout: 10000 });
        await forSaleOption.click();

        // Fill in required Sold data
        const soldPopup = this.page.getByText('Listing Sold × Date SoldSold');
        await expect(soldPopup).toBeVisible({ timeout: 10000 });

        const dateSoldInput = this.page.locator('p-calendar[formcontrolname="soldDate"] input');
        await dateSoldInput.click({ force: true });

        // 1️⃣ Compute Tomorrow
        const soldDate = new Date();
        soldDate.setDate(soldDate.getDate());

        const targetDay = soldDate.getDate();
        const targetMonth = soldDate.getMonth();
        const targetYear = soldDate.getFullYear();

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

        await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
        await dayLocator.first().click({ force: true });
        const priceInput = soldPopup.locator('input[formcontrolname="soldPrice"], input[name="soldPrice"]');
        await expect(priceInput.first()).toBeVisible({ timeout: 3000 });
        await priceInput.first().fill('10000');

        // Click Save & Close on the popup
        const saveAndCloseBtn = this.page.getByRole('button', { name: /Save & Close/i }).last();
        await expect(saveAndCloseBtn).toBeVisible({ timeout: 6000 });
        await saveAndCloseBtn.click({ force: true });

        await this.page.waitForTimeout(1200);


        // Wait for edit form to close
        const saveAndCloseButton = this.page.getByRole('button', { name: /Save & Close/i }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 6000 });
        await saveAndCloseButton.click({ force: true });
        await this.page.waitForTimeout(3000); // Optionally ensure animations finish

        // Apply Listing Status filter to "Sold" in list view  to ensure it's filtered correctly
        const listingStatusFilterDropdown = this.page.locator('re-multiselect[placeholder="Listing Status"]');
        await listingStatusFilterDropdown.waitFor({ state: "visible", timeout: 10000 });
        await listingStatusFilterDropdown.click({ force: true });
        await this.page.waitForTimeout(1500);
        const listingStatusInput = this.page.locator('re-multiselect').filter({ hasText: 'Listing Status Deposit Taken' }).getByPlaceholder('Search');
        await expect(listingStatusInput).toBeVisible({ timeout: 10000 });
        await listingStatusInput.fill('Sold');
        const soldStatusOption = this.page.locator('li.p-element', { hasText: 'Sold' }).first();
        await expect(soldStatusOption).toBeVisible({ timeout: 10000 });
        await soldStatusOption.click({ force: true });
        await this.page.waitForTimeout(3000);
        await this.page.locator('.fas.fa-sort-up').click({ force: true })


        await this.page.waitForTimeout(3000);
        await expect(cardRows.first()).toBeVisible({ timeout: 10000 });

        // After marking as Sold, search for the trimmed address and verify no listing appears
        const searchInput = this.page.locator('input[placeholder="Search"]').last();
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        // Only fill and search if we actually have a trimmed heading available

        if (typeof headingTextTrimmed === 'string') {
            await searchInput.fill(headingTextTrimmed);
            await this.page.waitForTimeout(1000); // Wait for search to process
        } else {
            throw new Error("headingTextTrimmed is undefined or not a string");
        }
        await expect(cardRows.first()).toBeVisible({ timeout: 10000 });
        await firstCardHeadingLocator.click({ force: true });
        // expect sold price visible 
        const soldPriceFieldDetail = this.page.getByText('Sold Price:').first();
        await expect(soldPriceFieldDetail).toBeVisible({ timeout: 10000 });
        // Optionally, check the value
        const soldPriceTextDetail = await soldPriceFieldDetail.textContent();
        expect(soldPriceTextDetail?.replace(/\D/g, '')).toContain('10000');
        // escape the detail view to clean up
        await this.page.waitForTimeout(1500);
        const maybeSaveAndCloseBtn = this.page.getByRole('button', { name: /Save & Close/i }).first();
        const isSaveAndCloseVisible = await maybeSaveAndCloseBtn.isVisible({ timeout: 2000 }).catch(() => false);
        if (isSaveAndCloseVisible) {
            await maybeSaveAndCloseBtn.click({ force: true });
            await this.page.waitForTimeout(2000);
        }
    }
    /**
     * Verify if navigating away from the form without saving discards changes.
     */
    async verifyFormDoesNotSaveOnNavigateAway() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing for editing
        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows.first()).toBeVisible({ timeout: 10000 });

        // Open first listing's add form
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]").first();
        await expect(contactFormBtn).toBeVisible({ timeout: 10000 });
        await contactFormBtn.dblclick({ force: true });
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        const listingsTypeDropdown = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).getByRole('combobox');
        await expect(listingsTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingsTypeDropdown.click();

        // Search 'Auction' inside Listings Type dropdown
        const listingsTypeSearchInput = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).locator('input[type="text"]');
        await expect(listingsTypeSearchInput).toBeVisible({ timeout: 10000 });
        await listingsTypeSearchInput.fill('Auction');
        await this.page.waitForTimeout(500);

        const auctionOption = this.page.getByRole('option', { name: 'Auction' });
        await auctionOption.waitFor({ state: 'visible' });
        await auctionOption.click();

        const listingStatusDropdown = this.page.locator('ng-select').filter({ hasText: 'Listing Status' });
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        const forSaleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Sold' }).first();
        await expect(forSaleOption).toBeVisible({ timeout: 10000 });
        await forSaleOption.click();
        // Wait for popup
        const soldPopup = this.page.getByText('Listing Sold × Date SoldSold');
        await expect(soldPopup).toBeVisible({ timeout: 10000 });

        const dateSoldInput = this.page.locator('p-calendar[formcontrolname="soldDate"] input');
        await dateSoldInput.click({ force: true });

        // 1️⃣ Compute Tomorrow
        const soldDate = new Date();
        soldDate.setDate(soldDate.getDate());

        const targetDay = soldDate.getDate();
        const targetMonth = soldDate.getMonth();
        const targetYear = soldDate.getFullYear();

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

        await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
        await dayLocator.first().click({ force: true });
        const priceInput = this.page.locator('input[formcontrolname="soldPrice"], input[name="soldPrice"]').first();
        await expect(priceInput).toBeVisible({ timeout: 10000 });
        await priceInput.click({ force: true });
        await priceInput.fill('1234');

        await this.page.waitForTimeout(2000);

        // Click Save on the popup
        const saveAndCloseBtn = this.page.getByRole('button', { name: /Save & Close/i }).last();
        await expect(saveAndCloseBtn).toBeVisible({ timeout: 10000 });
        await saveAndCloseBtn.click({ force: true });

        // Wait for popup to close
        await expect(soldPopup).not.toBeVisible({ timeout: 10000 });

        // Click on the "stream Stream" tab by role
        const streamTab = this.page.getByRole('tab', { name: 'stream Stream' });
        await expect(streamTab).toBeVisible({ timeout: 10000 });
        await streamTab.click({ force: true });

        const dateSoldField = this.page.getByText('Date Sold');
        await expect(dateSoldField).toBeVisible({ timeout: 10000 });

        // Grab values for assertions
        const dateSoldText = await dateSoldField.textContent();
        const soldPriceField = this.page.getByText('Sold Price:');
        const soldPriceText = await soldPriceField.textContent();
        const disclosePriceField = this.page.getByText('Disclose Price');
        const disclosePriceText = await disclosePriceField.textContent();

        const pad = (n: number) => n.toString().padStart(2, "0");
        const formattedDate = `${pad(soldDate.getDate())}/${pad(soldDate.getMonth() + 1)}/${soldDate.getFullYear()}`;
        expect(dateSoldText).toContain(formattedDate);

        // Verify the popup is closed (should not be visible)
        await expect(soldPopup).not.toBeVisible({ timeout: 3000 });
        await this.page.waitForTimeout(1000);
        // Also ensure pop-up form is closed if [x] icon is present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }

        await this.page.waitForTimeout(2000);

    }

    async verifyUndoSoldStatusBringsListingBack() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Filter by "Sold" status
        const initialCardRows = this.locators.cardViewPropertyRow();
        await expect(initialCardRows).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const statusDropdown = this.locators.listingStatusDropdown();
        await expect(statusDropdown).toBeVisible();
        await statusDropdown.click({ force: true });
        await this.page.waitForTimeout(500);

        const statusSearchBox = this.locators.listingStatusSearchInput();
        await expect(statusSearchBox).toBeVisible();
        await statusSearchBox.fill('Sold');
        await this.page.waitForTimeout(1200);

        // Click the "Sold" option after search
        const soldOption1 = this.locators.listingStatusOption('Sold');
        await expect(soldOption1).toBeVisible({ timeout: 10000 });
        await soldOption1.click({ force: true });

        await statusDropdown.click();

        await this.page.waitForTimeout(3000);
        // Filtered card rows for "Sold"
        const soldCardRows = this.locators.cardViewPropertyRow();
        await expect(soldCardRows.first()).toBeVisible({ timeout: 10000 });

        // Get and click the heading of the first card
        const firstCardHeading = this.page.locator('h3.props-bg.cp.mb-1.px-0[title]').first();
        let headingTextTrimmed: string | undefined = undefined;
        if (await firstCardHeading.isVisible({ timeout: 2000 })) {
            const headingTextRaw = await firstCardHeading.textContent();
            headingTextTrimmed = headingTextRaw?.trim();
        }
        await firstCardHeading.click({ force: true });

        // Wait for edit form to load
        const editForm = this.page.locator('#rightbarwithscroll');
        await expect(editForm).toBeVisible({ timeout: 8000 });

        const listingsTypeDropdown = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).getByRole('combobox');
        await expect(listingsTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingsTypeDropdown.click();

        // Search 'Auction' inside Listings Type dropdown
        const listingsTypeSearchInput = this.page.locator('ng-select').filter({ hasText: 'Listings Type' }).locator('input[type="text"]');
        await expect(listingsTypeSearchInput).toBeVisible({ timeout: 10000 });
        await listingsTypeSearchInput.fill('Auction');
        await this.page.waitForTimeout(500);

        const auctionOption = this.page.getByRole('option', { name: 'Auction' });
        await auctionOption.waitFor({ state: 'visible' });
        await auctionOption.click();

        const listingStatusDropdown = this.page.locator('ng-select').filter({ hasText: 'Listing Status' });
        await expect(listingStatusDropdown).toBeVisible({ timeout: 10000 });
        await listingStatusDropdown.click();

        const forSaleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'For Sale' }).first();
        await expect(forSaleOption).toBeVisible({ timeout: 10000 });
        await forSaleOption.click();

        // Save changes
        const saveAndClose = this.page.getByRole('button', { name: /Save & Close/i }).first();
        await expect(saveAndClose).toBeVisible({ timeout: 10000 });
        await saveAndClose.click({ force: true });

        await this.page.waitForTimeout(2000);
        // Click the Reset button (reset filters)
        const resetButton = this.page.getByRole('button', { name: /reset/i });
        await expect(resetButton).toBeVisible({ timeout: 10000 });
        await expect(resetButton).toBeEnabled();
        await resetButton.click({ force: true });
        await this.page.waitForTimeout(2000);
        // Search for the updated status and verify card displays new status
        const cardRows = this.locators.cardViewPropertyRow();
        await expect(cardRows).toBeVisible({ timeout: 10000 });

        // Search in the search box field for the previously stored heading (if available), otherwise search for "For Sale"
        const searchInput = this.page.locator('input[placeholder="Search"]').last(); // Adjust selector if needed
        await expect(searchInput).toBeVisible({ timeout: 10000 });

        if (headingTextTrimmed) {
            await searchInput.fill('');
            await searchInput.fill(headingTextTrimmed);
            await this.page.waitForTimeout(1000);

            // After search, ensure the specific card with the heading appears and has "For Sale" status
            const matchingCard = cardRows.filter({ has: this.page.locator(`h3[title="${headingTextTrimmed}"]`) }).first();
            await expect(matchingCard).toBeVisible({ timeout: 10000 });

            const cardText = (await matchingCard.innerText()).toLowerCase();
            expect(cardText.includes('for sale')).toBe(true);
        } else {
            // If no heading stored, search for "For Sale" in search box and expect at least one result
            await searchInput.fill('');
            await searchInput.fill('For Sale');
            await this.page.waitForTimeout(1000);

            const count = await cardRows.count();
            let foundForSale = false;
            for (let i = 0; i < count; i++) {
                const cardText = (await cardRows.nth(i).innerText()).toLowerCase();
                if (cardText.includes('for sale')) {
                    foundForSale = true;
                    break;
                }
            }
            expect(foundForSale).toBe(true);
        }
    }

    // Verify that the image tab contains a search field

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

        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1500)
    }

    async deleteListingCard() {
        await this.navigateToListings();
        await this.switchToGridView();
        const firstCard = this.page.locator('.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 20000 });

        const chevronDown = this.page.locator('i.pi.pi-chevron-down').first();
        await chevronDown.click({ force: true });

        // Find the delete button for the first visible listing card in card/grid view
        const cardDeleteButton = this.page.locator('a:nth-child(4)').first();
        await cardDeleteButton.scrollIntoViewIfNeeded()
        // Click the delete button until the confirmation dialog appears or give up after a number of attempts
        let maxAttempts = 10;
        let dialogVisible = false;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            await cardDeleteButton.click({ force: true });
            const confirmationDialog = this.page.getByText('Are you sure you want to delete this listing ? Your listing will be permanently');
            try {
                await expect(confirmationDialog).toBeVisible({ timeout: 1500 });
                dialogVisible = true;
                break;
            } catch {
                // Not visible yet, try again if attempts remain
            }
        }
        if (!dialogVisible) {
            throw new Error('Delete confirmation dialog did not appear after multiple attempts');
        }

        // Find and click the confirm Delete button
        const confirmButton = this.page.getByRole('button', { name: 'Delete' });
        await expect(confirmButton).toBeVisible({ timeout: 10000 });
        await confirmButton.click({ force: true });
        const toast = this.page.getByRole('alert', { name: 'Listing successfully deleted' });;
        await expect(toast).toBeVisible({ timeout: 10000 });
        await this.resetFilters();
        await this.page.waitForTimeout(2000);

    }

    async createListingWithRequiredFields(propertyType: string, listingType: string, listingStatus: string) {
        await this.navigateToListings();
        await this.switchToListView()
        await this.waitForTableRows()
        // Assuming there is a button or icon to open the contact form in each card row
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick({ force: true });
        // Wait for contact form to be visible (adjust selector if needed)
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Fill and select the property address: "1/14 Thomas Street, Laidley, QLD 4341"
        const propertyAddressSearchInput = this.page.locator('#rightbarwithscroll').getByRole('textbox', { name: 'Search' });
        await expect(propertyAddressSearchInput).toBeVisible({ timeout: 10000 });
        await propertyAddressSearchInput.fill('140 Coates Street, Laidley, QLD 4341');
        // Wait for dropdown/options to appear and select the address
        const addressOption = this.page.locator('div:nth-child(2) > .loop-item > div > .item-display');
        await expect(addressOption).toBeVisible({ timeout: 10000 });
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

        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);

    }

    async createListingWithMissingFields() {
        // Navigate to Listings and open the listing form
        await this.navigateToListings();
        await this.switchToListView();
        await this.waitForTableRows()

        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick({ force: true });

        // Wait for the form/modal to appear
        const form = this.page.locator('#rightbarwithscroll, .p-dialog, .listing-form-modal, .add-listing-form').first();
        await expect(form).toBeVisible({ timeout: 10000 })
        // Click Save and expect validation error
        const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
        await saveButton.click();

        // Expect validation error to be visible after attempt to save with missing fields
        await expect(this.page.getByRole('alert', { name: /Required fields must be/i })).toBeVisible();
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        } await this.page.waitForTimeout(1500)
    }
}
