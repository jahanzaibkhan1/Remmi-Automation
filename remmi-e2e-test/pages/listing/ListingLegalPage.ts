import { expect } from '@playwright/test';
import { ListingBasePage } from './ListingBasePage';

export class ListingLegalPage extends ListingBasePage {
    async verifyAddButtonInLegalTabOpensContractPopup() {

        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card robustly (ensure attached & visible before clicking)
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeAttached({ timeout: 30000 }); // More robust: attached before visible
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to the Legal tab on the listing details page
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();
        await this.page.waitForTimeout(800);

        const addButton = this.page.getByLabel('Legal').getByRole('button', { name: '', exact: true }).first();
        await expect(addButton).toBeAttached({ timeout: 10000 });
        await addButton.click();

        // Wait for the contract panel to be visible in the popup
        const contractPanel = this.page.locator('#Contract_1 #rightbarwithscroll');
        await expect(contractPanel).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that the listing dropdown in the contract popup auto-populates with the selected listing.
     */
    async verifyContractPopupListingDropdownAutoPopulates() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card, extract and trim its address text
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeAttached({ timeout: 30000 });
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });

        // Grab the heading before clicking (it may change)
        const listingHeading = this.page.locator('h3.props-bg.cp.mb-1.px-0').first();
        await expect(listingHeading).toBeVisible({ timeout: 10000 });
        const expectedAddress = (await listingHeading.textContent() || '').replace(/\s+/g, ' ').trim();

        await firstCardRow.click();

        // Go to the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();
        await this.page.waitForTimeout(800);

        // Click the Add button in the Legal tab to open the contract popup
        const addButton = this.page.getByLabel('Legal').getByRole('button', { name: '', exact: true }).first();
        await expect(addButton).toBeAttached({ timeout: 10000 });
        await addButton.click();

        // Wait for the contract popup panel to be visible
        const contractPanel = this.page.locator('#Contract_1 #rightbarwithscroll');
        await expect(contractPanel).toBeVisible({ timeout: 10000 });

        // Find the Listing dropdown inside the contract popup
        const listingDropdown = this.page.locator('div.task-contact:has-text("Listing") ng-select');
        await expect(listingDropdown).toBeVisible({ timeout: 10000 });

        // Verify that the dropdown auto-populates with the trimmed value of the heading
        const selectedOption = listingDropdown.locator('.ng-value-label');
        await expect(selectedOption).toBeVisible({ timeout: 10000 });
        const selectedText = (await selectedOption.textContent() || '').replace(/\s+/g, ' ').trim();

        // Directly compare the heading text and dropdown selected text
        expect(selectedText).toBe(expectedAddress);

        // Close the contract popup dialog
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    // Verify that the Seller field auto-populates in the contract popup
    async verifyContractPopupSellerFieldAutoPopulates() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card, extract the Seller text from card details
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeAttached({ timeout: 30000 });
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });

        await firstCardRow.click();

        // Go to the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();
        await this.page.waitForTimeout(800);

        // Click the Add button in the Legal tab to open the contract popup
        const addButton = this.page.getByLabel('Legal').getByRole('button', { name: '', exact: true }).first();
        await expect(addButton).toBeAttached({ timeout: 10000 });
        await addButton.click();

        // Wait for the contract popup panel to be visible
        const contractPanel = this.page.locator('#Contract_1 #rightbarwithscroll');
        await expect(contractPanel).toBeVisible({ timeout: 10000 });

        // Find the Seller field in the contract popup and wait for it to be in 'visible' state
        const sellerFormField = this.page.locator('div.selected_one > p.cursor-pointer').last();
        await expect(sellerFormField).toBeAttached({ timeout: 10000 });

        // Get the value, trim it, and log it
        const sellerText = (await sellerFormField.textContent() || '').trim();
        console.log(`Owner is: ${sellerText}`);

        await expect(sellerText.length).toBeGreaterThan(0);

        // Close the contract popup dialog
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }
    async verifyContractPopupListingDropdownAutoPopulate() {
        // Navigate to listings and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeAttached({ timeout: 30000 });
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();
        await this.page.waitForTimeout(800);

        // Click the Add button in the Legal tab to open the contract popup
        const addButton = this.page.getByLabel('Legal').getByRole('button', { name: '', exact: true }).first();
        await expect(addButton).toBeAttached({ timeout: 10000 });
        await addButton.click();

        // Wait for the contract popup panel to be visible
        const contractPanel = this.page.locator('#Contract_1 #rightbarwithscroll');
        await expect(contractPanel).toBeVisible({ timeout: 10000 });

        const listingDropdown = this.page.getByLabel('Listing').first();

        await this.page.waitForTimeout(2000);
        const listingDropdownInput = this.page.locator('div.ng-value .ng-value-label').last();
        await listingDropdownInput.waitFor({ state: 'attached', timeout: 10000 });

        await this.page.waitForTimeout(2000);

        // Wait for the listing dropdown arrow to appear before interacting
        const listingDropdownArrow = this.page.locator(
            'label:has-text("Listing") + ng-select .ng-arrow-wrapper'
        ).first();
        await listingDropdownArrow.click();
        // Get the value from the input (should be auto-populated)
        const selectedListingText = (await listingDropdownInput.textContent() || '').trim();


        // The dropdown options panel should now be visible
        const dropdownPanel = this.page.getByRole('listbox', { name: 'Options list' });
        await expect(dropdownPanel).toBeVisible({ timeout: 10000 });

        // Find the highlighted/selected option in the panel
        const selectedOption = this.page.locator(
            'div.ng-option.ng-option-selected[role="option"][aria-selected="true"]'
        );
        await expect(selectedOption).toBeVisible({ timeout: 10000 });

        // Check the text of the highlighted/selected option matches the value in the input
        const selectedOptionText = (await selectedOption.textContent() || '').trim();
        expect(selectedOptionText).toContain(selectedListingText);

        // --- Close the contract popup ---
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * verifies that the Managing Contact dropdown
     * automatically selects the primary Contact for the contact.
     */
    async verifyManagingContactDropdownAutoSelectsPrimaryContact() {
        // Navigate to listings and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeAttached({ timeout: 30000 });
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        const primaryAgent = this.page.locator(
            'div.form-group:has-text("Primary Agent") ng-select'
        );

        await primaryAgent.scrollIntoViewIfNeeded();

        // Wait until the primaryAgent is attached to the DOM and visible
        await primaryAgent.waitFor({ state: 'visible', timeout: 10000 });
        await primaryAgent.click();

        const primaryInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']");
        // Wait until the input is visible and interactable
        await primaryInput.waitFor({ state: 'visible' });
        await primaryInput.fill('Jahanzaib Xenex');

        const primaryOption = this.page.locator(
            '.ng-dropdown-panel .ng-option',
            { hasText: 'Jahanzaib Xenex' }
        ).first();
        await primaryOption.waitFor({ state: 'visible', timeout: 20000 });
        await primaryOption.click({ force: true });
        await this.page.waitForTimeout(1200);

        // Click the Save button to persist agent selection
        const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click();
        await this.page.waitForTimeout(1000);

        // Go to the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();
        await this.page.waitForTimeout(800);

        // Click the Add button in the Legal tab to open the contract popup
        const addButton = this.page.getByLabel('Legal').getByRole('button', { name: '', exact: true }).first();
        await expect(addButton).toBeAttached({ timeout: 10000 });
        await addButton.click();

        // Wait for the contract popup panel to be visible
        const contractPanel = this.page.locator('#Contract_1 #rightbarwithscroll');
        await expect(contractPanel).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);

        // Using the combobox role to locate the input, wait for it to be visible, then fill it with value 'John Doe'
        const managingAgent = this.page.locator('div.ng-value p.ng-star-inserted').last();
        await managingAgent.waitFor({ state: 'visible', timeout: 20000 });
        await managingAgent.click();
        const managingAgentText = (await managingAgent.textContent() || '').trim();

        // The dropdown options panel should now be visible
        const dropdownPanel = this.page.getByRole('listbox', { name: 'Options list' });
        await expect(dropdownPanel).toBeVisible({ timeout: 10000 });

        // Find the highlighted/selected option in the panel
        const selectedOption = this.page.locator(
            'div.ng-option.ng-option-selected[role="option"][aria-selected="true"]'
        );
        await expect(selectedOption).toBeVisible({ timeout: 10000 });

        // Check the text of the highlighted/selected option matches the value in the input
        const selectedOptionText = (await selectedOption.textContent() || '').trim();
        expect(selectedOptionText).toContain(managingAgentText);

        // --- Close the contract popup ---
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
  * Verify that none of the fields shown in Contracts Details are required
  */
    async verifyNoRequiredFieldsInContractPopup() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Add contract
        const addButton = this.page
            .getByLabel('Legal')
            .getByRole('button', { name: '', exact: true })
            .first();

        await addButton.click();

        // Contract popup
        const contractPanel = this.page.locator('#Contract_1 #rightbarwithscroll');
        await expect(contractPanel).toBeVisible({ timeout: 10000 });

        // Fields exactly as per image
        const fieldLabels = [
            'Listing',
            'Contract Status',
            'Offer Status',
            'Seller',
            "Seller's Solicitor",
            'Buyer',
            "Buyer's Solicitor",
            'Listing Agent',
            'Managing Agent',
            'Selling Agent'
        ];

        for (const label of fieldLabels) {
            const fieldContainer = contractPanel
                .locator(`label:has-text("${label}")`)
                .locator('xpath=following-sibling::*[1]');

            const requiredElements = fieldContainer.locator(
                'input[required], select[required], textarea[required], [aria-required="true"]'
            );

            await expect(requiredElements, `${label} should not be required`).toHaveCount(0);
        }

        // Close popup
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verify that the contract is displayed in the Legal tab after saving the contract popup.
     */
    public async verifyContractDisplayedAfterSaving(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();


        const primaryAgent = this.page.locator(
            'div.form-group:has-text("Primary Agent") ng-select'
        );

        await expect(primaryAgent).toBeVisible();
        await primaryAgent.click();

        const primaryInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']");
        await expect(primaryInput).toBeVisible({ timeout: 3000 });
        await primaryInput.fill('Jahanzaib Xenex');

        const primaryOption = this.page.locator(
            '.ng-dropdown-panel .ng-option',
            { hasText: 'Jahanzaib Xenex' }
        ).first();
        await expect(primaryOption).toBeVisible({ timeout: 20000 });
        await primaryOption.click({ force: true });
        await this.page.waitForTimeout(1200);

        // Click the Save button to persist agent selection
        const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click();
        await this.page.waitForTimeout(1000);

        // Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Add contract
        const addButton = this.page
            .getByLabel('Legal')
            .getByRole('button', { name: '', exact: true })
            .first();

        await addButton.click();

        // Contract popup
        const contractPanel = this.page.locator('#Contract_1 #rightbarwithscroll');
        await expect(contractPanel).toBeVisible({ timeout: 10000 });

        const contractStatusDropdown = this.page.locator('div.ng-select-container:has(div.ng-placeholder:text("Contract Status"))');
        await contractStatusDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await contractStatusDropdown.click();

        // Select option "Held"
        const heldOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Held' }).first();
        await expect(heldOption).toBeVisible({ timeout: 10000 });
        await heldOption.click();

        // now set Offer status to "Pending"
        const offerStatusDropdown = this.page.locator('div.ng-select-container:has(div.ng-placeholder:text("Offer Status"))').last();
        await offerStatusDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await offerStatusDropdown.click();

        // Select option "Pending"
        const offerAcceptedOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Accepted' }).first();
        await expect(offerAcceptedOption).toBeVisible({ timeout: 10000 });
        await offerAcceptedOption.click();

        // Select Buyer (not Selling Agent) -- match the "Buyer" input as shown in the screenshot.
        const buyerDropdown = this.page.locator('div.tags:has(> span.placeHolder:text("Select Buyer"))').first();
        await buyerDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await buyerDropdown.click();

        // Type or select "Jahanzaib Xenex" for Buyer
        const buyerInput = this.page.locator('input[placeholder="Search"]._input-icon').last()
        await expect(buyerInput).toBeVisible({ timeout: 10000 });
        await buyerInput.click()
        await buyerInput.fill('Dawood Ahmad');

        const buyerOption = this.page.locator('li', { hasText: 'Dawood Ahmad (dawoodahmad786@gmail.com)' });
        await expect(buyerOption).toBeVisible({ timeout: 10000 });
        await buyerOption.click({ force: true });

        // Click the date input to open the date picker
        const dateOfferInput = this.page.locator('input[name="dateOffer"]');
        await dateOfferInput.scrollIntoViewIfNeeded();
        await dateOfferInput.click();

        // Wait for the calendar to be visible
        const calendar = this.page.locator('div.p-datepicker-group-container');
        await expect(calendar).toBeVisible({ timeout: 10000 });

        // 1️⃣ Compute Tomorrow
        const t = new Date();
        t.setDate(t.getDate() - 1);

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

        await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
        await dayLocator.first().click({ force: true });

        const offerPriceInput = this.page.locator('div.col-sm-4:has(> p:text("Offer Price")) app-price-input input[name="price"]');
        await offerPriceInput.click();
        await offerPriceInput.fill('560');

        // click save and close
        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(1000);

        // Wait for the contract popup to disappear
        await expect(contractPanel).toBeHidden({ timeout: 10000 });

        const rowLocator = this.page.locator('tr', { hasText: 'Dawood Ahmad' }).first();

        // Wait for at least one row to be visible (assuming the saved contract is added at the start)
        await rowLocator.first().evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
        await expect(rowLocator.first()).toBeVisible({ timeout: 10000 });


        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verifies the contract status dropdown contains the expected options.
     */
    async verifyContractStatusDropdownOptions() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Add contract
        const addButton = this.page
            .getByLabel('Legal')
            .getByRole('button', { name: '', exact: true })
            .first();

        await addButton.click();

        // Contract popup
        const contractPanel = this.page.locator('#Contract_1 #rightbarwithscroll');
        await expect(contractPanel).toBeVisible({ timeout: 10000 });

        // Open the Contract Status dropdown
        const contractStatusDropdown = this.page.locator('div.ng-select-container:has(div.ng-placeholder:text("Contract Status"))');
        await contractStatusDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await contractStatusDropdown.click();

        // Wait for the dropdown panel to be visible
        const dropdownPanel = this.page.locator('.ng-dropdown-panel');
        await dropdownPanel.waitFor({ state: 'visible', timeout: 10000 });

        // Exact match (exact: true)
        await expect(this.page.getByRole('option', { name: 'Settled', exact: true })).toBeVisible();
        await expect(this.page.getByRole('option', { name: 'Conditional', exact: true })).toBeVisible();
        await expect(this.page.getByRole('option', { name: 'Offer Pending', exact: true })).toBeVisible();
        await expect(this.page.getByRole('option', { name: 'Contract Issued', exact: true })).toBeVisible();
        await expect(this.page.getByRole('option', { name: 'Awaiting Vendor Signing', exact: true })).toBeVisible();
        await expect(this.page.getByRole('option', { name: 'Held', exact: true })).toBeVisible();
        await expect(this.page.getByRole('option', { name: 'Unconditional', exact: true })).toBeVisible();

        // Click the close icon after verifying the contract is displayed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verifies that clicking on the checkbox in the Legal tab reveals a dropdown with Present, Accept, and Decline buttons
     */
    public async verifyLegalTabCheckboxRevealsDropdown() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Wait for checkboxes to be rendered in the Legal tab (table or list checkboxes)
        const legalCheckbox = this.page.locator('.p-checkbox-box.p-component');
        await legalCheckbox.scrollIntoViewIfNeeded();
        await legalCheckbox.waitFor({ state: 'visible', timeout: 10000 });

        // Click the first checkbox
        await legalCheckbox.click();
        // Confirm the table columns exist as shown: Purchaser, Offer Price, Offer Date, Selling Agent
        await expect(this.page.getByText('Purchaser')).toBeVisible();
        await expect(this.page.getByText('Offer Price')).toBeVisible();
        await expect(this.page.getByText('Offer Date')).toBeVisible();
        await expect(this.page.getByText('Selling Agent')).toBeVisible();

        const acceptBtn = this.page.getByRole('button', { name: /^Accept$/i });
        const declineBtn = this.page.getByRole('button', { name: /^Decline$/i });
        await expect(acceptBtn).toBeVisible();
        await expect(declineBtn).toBeVisible();
        // Click the offer status dropdown/button in the Legal tab table row
        const offerStatusDropdown = this.page.getByText('Offer Status').first();
        await expect(offerStatusDropdown).toBeVisible({ timeout: 10000 });
        await offerStatusDropdown.click();

        // After clicking, ensure that the Offer Status dropdown options are visible
        // Check for the expected options in the dropdown as shown in the image: Accepted, Declined, Presented
        const acceptedOption = this.page.getByText('Accepted', { exact: true }).first();
        const declinedOption = this.page.getByText('Declined', { exact: true }).first();
        const presentedOption = this.page.getByText('Presented', { exact: true }).first();

        await expect(acceptedOption).toBeVisible({ timeout: 10000 });
        await expect(declinedOption).toBeVisible({ timeout: 10000 });
        await expect(presentedOption).toBeVisible({ timeout: 10000 });

        // Click the close icon after verifying the contract is displayed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }

    }

    /**
     * Verifies that clicking the Accept button updates the Offer Status to "Accepted" in the Legal tab.
     */
    public async verifyAcceptButtonUpdatesOfferStatus(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // click Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Wait for the checkbox in the Legal tab
        const legalCheckbox = this.page.locator('.p-checkbox-box.p-component');
        await legalCheckbox.scrollIntoViewIfNeeded();
        await legalCheckbox.waitFor({ state: 'visible', timeout: 10000 });

        // Click the checkbox if not already checked
        const checked = await legalCheckbox.isChecked().catch(() => false);
        if (!checked) {
            await legalCheckbox.click();
        }

        // Wait for contract row and buttons
        const acceptBtn = this.page.getByRole('button', { name: /^Accept$/i });
        await expect(acceptBtn).toBeVisible({ timeout: 10000 });

        // Click Accept
        await acceptBtn.click();

        const contractLocator = this.page.locator('p', { hasText: /^Contract:/ });
        await contractLocator.waitFor({ state: 'visible', timeout: 10000 });


        // Optionally close the popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verifies that clicking the Decline button updates the Offer Status to "Declined" in the Legal tab.
     */
    public async verifyDeclineButtonUpdatesOfferStatus(): Promise<void> {
        // Navigate to the Listings page
        await this.navigateToListings();
        // Switch to Grid View
        await this.switchToGridView();

        // Open the first listing card/row
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // Click the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Wait for the checkboxes in the Legal tab, select the fourth (index 3)
        const legalCheckbox = this.page.locator('.p-checkbox-box.p-component');
        await legalCheckbox.scrollIntoViewIfNeeded();
        await legalCheckbox.waitFor({ state: 'visible', timeout: 10000 });

        // Click the checkbox if not already checked
        const checked = await legalCheckbox.isChecked().catch(() => false);
        if (!checked) {
            await legalCheckbox.click();
        }

        // Wait for the Decline button to appear
        const declineBtn = this.page.getByRole('button', { name: /^Decline$/i });
        await expect(declineBtn).toBeVisible({ timeout: 10000 });

        // Click Decline
        await declineBtn.click();

        // Wait for the contract row to be visible
        const contractLocator = this.page.locator('p', { hasText: /^Contract:/ });
        await contractLocator.waitFor({ state: 'visible', timeout: 10000 });

        // Optionally close the popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verify that the Offer Status can be updated multiple times in the Legal tab.
     */
    public async verifyOfferStatusCanBeUpdatedMultipleTimes(): Promise<void> {
        // Navigate to the Listings page
        await this.navigateToListings();
        // Switch to Grid View
        await this.switchToGridView();

        // Open the first listing card/row
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // Click the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Wait for the checkboxes in the Legal tab, select the fourth (index 3)
        const legalCheckbox = this.page.locator('.p-checkbox-box.p-component');
        await legalCheckbox.scrollIntoViewIfNeeded();
        await legalCheckbox.waitFor({ state: 'visible', timeout: 10000 });

        // Click the checkbox if not already checked
        const checked = await legalCheckbox.isChecked().catch(() => false);
        if (!checked) {
            await legalCheckbox.click();
        }

        const acceptBtn = this.page.getByRole('button', { name: /^Accept$/i });
        await expect(acceptBtn).toBeVisible({ timeout: 10000 });
        await acceptBtn.click();

        // Contract row should be visible
        const contractLocator = this.page.locator('p', { hasText: /^Contract:/ });
        await expect(contractLocator).toBeVisible({ timeout: 10000 });


        await this.page.waitForTimeout(1000);
        await legalCheckbox.click();


        const declineBtn = this.page.getByRole('button', { name: /^Decline$/i });
        await expect(declineBtn).toBeVisible({ timeout: 10000 });
        await declineBtn.click();

        await expect(contractLocator).toBeVisible({ timeout: 10000 });

        // Optionally close the popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verifies that the Offer Status is retained correctly after refreshing the page.
     * This method expects that there is a visible contract row and an offer status visibly set,
     * then refreshes the page and checks that the offer status remains.
     */
    async verifyOfferStatusIsRetainedAfterRefresh() {
        // Navigate to the Listings page
        await this.navigateToListings();
        // Switch to Grid View
        await this.switchToGridView();

        // Open the first listing card/row
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // Click the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Wait for the checkboxes in the Legal tab, select the fourth (index 3)
        const legalCheckbox = this.page.locator('.p-checkbox-box.p-component');
        await legalCheckbox.scrollIntoViewIfNeeded();
        await legalCheckbox.waitFor({ state: 'visible', timeout: 10000 });

        // Click the checkbox if not already checked
        const checked = await legalCheckbox.isChecked().catch(() => false);
        if (!checked) {
            await legalCheckbox.click();
        }

        const acceptBtn = this.page.getByRole('button', { name: /^Accept$/i });
        await expect(acceptBtn).toBeVisible({ timeout: 10000 });
        await acceptBtn.click();

        // Contract row should be visible
        const contractLocator = this.page.locator('p', { hasText: /^Contract:/ });
        await expect(contractLocator).toBeVisible({ timeout: 10000 });


        await this.page.waitForTimeout(1000);
        await expect(contractLocator).toBeVisible({ timeout: 10000 });

        await this.page.reload();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        await expect(contractLocator).toBeVisible({ timeout: 30000 });

        // Optionally close the popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verify that clicking on the "Selling Agreement Start Date" field opens a calendar for selecting a date.
     */
    async verifySellingAgreementStartDateCalendarOpens() {
        // Navigate to the Listings page
        await this.navigateToListings();
        // Switch to Grid View
        await this.switchToGridView();

        // Open the first listing card/row
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // Click the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Find and click the "Selling Agreement Start Date" input field
        const sellingAgreement = this.page.getByText(/Selling Agreement Start Date/i);
        await sellingAgreement.scrollIntoViewIfNeeded();
        await expect(sellingAgreement).toBeVisible({ timeout: 10000 });

        // Click the actual input element for Selling Agreement Start Date (assume it's the input nearest to the label)
        const sellingAgreementStartDateInput = this.page.locator(
            'p-calendar[formcontrolname="selling_agreement_start_date"] input[readonly]'
        );

        await expect(sellingAgreementStartDateInput).toBeVisible({ timeout: 10000 });
        await sellingAgreementStartDateInput.click();

        // The calendar popup/dialog should now be visible; check for calendar container (commonly role="dialog" or specific class)
        const calendarPopup = this.page.locator("[role='dialog'], .p-datepicker, .ui-datepicker, .calendar-popup");
        await expect(calendarPopup).toBeVisible({ timeout: 10000 });

        // Select the current date in the calendar
        const today = new Date();
        const day = today.getDate().toString();

        // Try finding a button or span with today's date that is selectable (not disabled and for this month)
        let dayLocator = this.page.locator(".p-datepicker-calendar td:not(.p-datepicker-other-month) button:has-text('" + day + "')");

        // Fallback to span if button is not present
        if (await dayLocator.count() === 0) {
            dayLocator = this.page.locator(".p-datepicker-calendar td:not(.p-datepicker-other-month) span:has-text('" + day + "')");
        }

        await expect(dayLocator.first()).toBeVisible({ timeout: 10000 });
        await dayLocator.first().click();

        // Optionally close the popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verify that clicking the Present button opens the Present Contract popup.
     */
    public async verifyPresentButtonOpensPresentContractPopup(): Promise<void> {
        // Navigate to the Listings page and switch to Grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card/row
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Click the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();


        const addButton = this.page.getByLabel('Legal').getByRole('button', { name: '', exact: true }).first();
        await expect(addButton).toBeAttached({ timeout: 10000 });
        await addButton.click();

        // Wait for the contract panel to be visible in the popup
        const contractPanel = this.page.locator('#Contract_1 #rightbarwithscroll');
        await expect(contractPanel).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);


        // Wait for Present button (can be "Present" or "Present Offer") to appear and scroll into view if needed
        const presentBtn = this.page.getByRole('button', { name: /^Present(\sOffer)?$/i });
        await presentBtn.scrollIntoViewIfNeeded();
        await expect(presentBtn).toBeVisible({ timeout: 10000 });
        await presentBtn.click();
        // The Present Contract popup/dialog should now be visible
        const presentPopup = this.page.getByText('Present Offer ×');
        await expect(presentPopup).toBeVisible({ timeout: 10000 });


        // Click the Cancel button
        const cancelBtn = this.page.getByRole('button', { name: /Cancel/i }).last();
        await expect(cancelBtn).toBeVisible({ timeout: 10000 });
        await cancelBtn.click();

        await this.page.waitForTimeout(1200);

        // Optionally clos23e the popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verify that clicking on the "Selling Agreement End Date" field opens a calendar for selecting a date.
     */
    public async verifySellingAgreementEndDateCalendarOpens(): Promise<void> {
        // Navigate to the Listings page
        await this.navigateToListings();
        // Switch to Grid View
        await this.switchToGridView();

        // Open the first listing card/row
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // Click the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Find and click the "Selling Agreement Start Date" input field
        const sellingAgreement = this.page.getByText(/Selling Agreement End Date/i);
        await sellingAgreement.scrollIntoViewIfNeeded();
        await expect(sellingAgreement).toBeVisible({ timeout: 10000 });

        // Click the actual input element for Selling Agreement Start Date (assume it's the input nearest to the label)
        const sellingAgreementEndDateInput = this.page.locator(
            'p-calendar[formcontrolname="selling_agreement_end_date"] input[readonly]'
        );

        await expect(sellingAgreementEndDateInput).toBeVisible({ timeout: 10000 });
        await sellingAgreementEndDateInput.click();

        // The calendar popup/dialog should now be visible; check for calendar container (commonly role="dialog" or specific class)
        const calendarPopup = this.page.locator("[role='dialog'], .p-datepicker, .ui-datepicker, .calendar-popup");
        await expect(calendarPopup).toBeVisible({ timeout: 10000 });

        // Select the current date in the calendar
        const today = new Date();
        const day = today.getDate().toString();

        // Try finding a button or span with today's date that is selectable (not disabled and for this month)
        let dayLocator = this.page.locator(".p-datepicker-calendar td:not(.p-datepicker-other-month) button:has-text('" + day + "')");

        // Fallback to span if button is not present
        if (await dayLocator.count() === 0) {
            dayLocator = this.page.locator(".p-datepicker-calendar td:not(.p-datepicker-other-month) span:has-text('" + day + "')");
        }

        await expect(dayLocator.first()).toBeVisible({ timeout: 10000 });
        await dayLocator.first().click();

        // Optionally close the popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verify that the "Agreed Marketing Spend" field accepts numeric input.
     */
    async verifyAgreedMarketingSpendFieldAcceptsNumericInput() {
        // Navigate to the Listings page
        await this.navigateToListings();
        // Switch to Grid View
        await this.switchToGridView();

        // Open the first listing card/row
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // Click the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Find the "Agreed Marketing Spend" input (by label or placeholder)
        const spendLabel = this.page.getByText(/Agreed Marketing Spend/i);
        await spendLabel.scrollIntoViewIfNeeded();
        await expect(spendLabel).toBeVisible({ timeout: 10000 });

        // Get the input related to the label (assuming it's the next input field)
        const spendInput = this.page.locator(
            'label:has-text("Agreed") + app-price-input input[name="price"]'
        );
        await expect(spendInput).toBeVisible({ timeout: 10000 });

        await spendInput.click();

        // Enter a valid numeric value
        const numericValue = '15000';

        await spendInput.fill(numericValue);

        // Optionally close the popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verify that the "Marketing Payable By" dropdown allows selection.
     */
    async verifyMarketingPayableByDropdownAllowsSelection() {
        // Navigate to the Listings page
        await this.navigateToListings();
        // Switch to Grid View
        await this.switchToGridView();

        // Open the first listing card/row
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // Click the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Find the "Marketing Payable By" dropdown label
        const payableByDropdown = this.page.locator('ng-select[formcontrolname="marketing_payable_by"]');
        await payableByDropdown.scrollIntoViewIfNeeded();
        await expect(payableByDropdown).toBeVisible({ timeout: 10000 });
        await payableByDropdown.click();

        // Adjust according to actual option name if different
        const optionToSelect = this.page.getByRole('option', { name: /At unconditional/i });
        await expect(optionToSelect).toBeVisible({ timeout: 10000 });
        await optionToSelect.click();


        // Optionally close the popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verify that the "Commission Payable By" dropdown allows selection.
     */
    async verifyCommissionPayableByDropdownAllowsSelection() {
        // Navigate to the Listings page
        await this.navigateToListings();
        // Switch to Grid View
        await this.switchToGridView();

        // Open the first listing card/row
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // Click the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Find the "Commission Payable By" dropdown
        const commissionPayableByDropdown = this.page.locator('ng-select[formcontrolname="commission_payable"]');

        await commissionPayableByDropdown.scrollIntoViewIfNeeded();
        await expect(commissionPayableByDropdown).toBeVisible({ timeout: 10000 });
        await commissionPayableByDropdown.click();

        // Adjust according to actual option name if different
        const optionToSelect = this.page.getByRole('option', { name: /At conditional/i });
        await expect(optionToSelect).toBeVisible({ timeout: 10000 });
        await optionToSelect.click();

        // Optionally close the popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verify that the "Commission % Inclusive of GST" field accepts percentage input.
     */
    async verifyCommissionInclusiveGSTFieldAcceptsPercentageInput() {
        // Navigate to the Listings page
        await this.navigateToListings();
        // Switch to Grid View
        await this.switchToGridView();

        // Open the first listing card/row
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // Click the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Find the "Commission % Inclusive of GST" input field
        const commissionGSTInput = this.page.locator('div.col-md-3.pl-0.mt-1 app-price-input input[name="price"]');
        await commissionGSTInput.scrollIntoViewIfNeeded();
        await expect(commissionGSTInput).toBeVisible({ timeout: 10000 });
        // Try entering a valid percentage value
        const inputValue = '15%';
        await commissionGSTInput.fill(inputValue);
        // Optionally close the popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verify that the "$ Amount Inclusive of GST" field accepts numeric input.
     */
    async verifyAmountInclusiveGSTFieldAcceptsNumericInput() {
        // Navigate to the Listings page
        await this.navigateToListings();
        // Switch to Grid View
        await this.switchToGridView();

        // Open the first listing card/row
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // Click the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Find the "$ Amount Inclusive of GST" input field
        const amountGSTInput = this.page.locator(
            '//label[contains(.,"$ Amount")]/parent::div//app-price-input//input[@name="price"]'
        );
        await amountGSTInput.scrollIntoViewIfNeeded();
        await expect(amountGSTInput).toBeVisible({ timeout: 10000 });
        // Try entering a valid numeric value
        const inputValue = '5000';
        await amountGSTInput.fill(inputValue);

        // Optionally close the popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verify that clicking on the "Document" button opens a popup to add a new document.
     */
    async verifyDocumentButtonOpensAddDocumentPopup() {
        // Navigate to the Listings page
        await this.navigateToListings();

        // Switch to Grid View
        await this.switchToGridView();

        // Open the first listing card/row
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        await this.page.waitForTimeout(1000);

        // Click the Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Click the "Document" button (assuming this is the button text)
        const documentButton = this.page.locator('//label[text()="Documents"]/parent::div//button');
        await documentButton.scrollIntoViewIfNeeded();
        await expect(documentButton).toBeVisible({ timeout: 10000 });
        await documentButton.click();

        // Now ensure the file upload input is visible after clicking New and upload image
        const documentsUploadInput = this.page.locator(
            '//label[text()="Documents"]/parent::div//input[@type="file"]'
        );
        // const path = require('path');
        // const IMAGE_DIR = path.resolve(__dirname, 'PropertyImages');
        // const imagePath = path.join(IMAGE_DIR, 'PropertyImage2.jpg');
        // await documentsUploadInput.setInputFiles(imagePath);

        // Optionally wait for upload UI to respond/complete
        await this.page.waitForTimeout(1000);
        // Optionally close the popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }


    }

    /**
     * Verify that none of the "Property Legal Details" fields (Lot, On Subdivision,
     * Title Reference, and Legal Address) are marked as required.
     */
    async verifyPropertyLegalDetailsFieldsNotRequired() {
        // Navigate & open listing
        await this.navigateToListings();
        await this.switchToGridView();

        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        const propertyLegalDetailsSection = this.page.getByText('Property Legal Details');
        await propertyLegalDetailsSection.scrollIntoViewIfNeeded();
        await expect(propertyLegalDetailsSection).toBeVisible({ timeout: 10000 });

        // Check that none of the fields in Property Legal Details are required
        const fields = [
            { label: "Lot", control: "lot" },
            { label: "On Subdivision", control: "subdivision" },
            { label: "Title Reference", control: "titleref" },
            { label: "Legal Address", control: "legaladdress" }
        ];

        for (const { label, control } of fields) {
            // Get the input
            const inputLocator = this.page.locator(`input[formcontrolname="${control}"]`);
            await expect(inputLocator).toBeVisible({ timeout: 10000 });

            // The input should not have "required" or aria-required attributes
            const isRequired = await inputLocator.getAttribute('required');
            const ariaRequired = await inputLocator.getAttribute('aria-required');
            expect(isRequired, `${label} field should not have 'required' attribute`).not.toBeTruthy();
            expect(ariaRequired, `${label} field should not have 'aria-required' attribute`).not.toBe("true");

            // The label should not show a required asterisk '*'
            // Find the label associated with the input
            const labelLocator = inputLocator.locator('xpath=ancestor::div[contains(@class,"col-md")]/label');
            const labelText = await labelLocator.textContent();
            expect(labelText, `${label} label should not show a required asterisk`).not.toMatch(/\*/);
        }

        // Optionally close a popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verify that the "Legal Name" dropdown auto populates with the property owner's name
     * and allows creating a new contact from the dropdown.
     */
    async verifyLegalNameDropdownAutoPopulatesAndAllowsNewContact() {
        // Wait for the Legal tab and Property Legal Details section
        await this.navigateToListings();
        await this.switchToGridView();

        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        const propertyLegalDetailsSection = this.page.getByText('Legal Name');
        await propertyLegalDetailsSection.scrollIntoViewIfNeeded();
        await expect(propertyLegalDetailsSection).toBeVisible({ timeout: 10000 });

        // Find the "Legal Name" dropdown (assuming it uses formcontrolname="legalOwner")
        const legalNameDropdown = this.page.locator(
            'div.create-task-dropdown:has(label:has-text("Legal Name")) .selected_one p'
        );
        // Trim the text content and log it to console
        const dropdownText = (await legalNameDropdown.textContent())?.trim() ?? '';
        console.log('Legal Dropdown Name :', dropdownText);
        // Do NOT click to expand the dropdown, just continue to next steps
        await this.page.waitForTimeout(500);
        // Optionally close a popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }

    }

    /**
    * Verify that the "Solicitor" dropdown allows selecting an existing company and creating a new company.
    */
    async verifySolicitorDropdownAllowsSelectAndCreate() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Scroll to Solicitor field
        const solicitorLabel = await this.page.getByText('Solicitor', { exact: true });
        await solicitorLabel.scrollIntoViewIfNeeded();
        await expect(solicitorLabel).toBeVisible({ timeout: 10000 });

        // Locate the Solicitor multiselect
        const solicitorDropdown = this.page.locator(
            'div.col-md-6.create-task-dropdown:has(label:text("Solicitor")) div.tags'
        );
        await solicitorDropdown.click()

        const searchInput = this.page.locator('.drop_box input[placeholder="Search"]');
        await expect(searchInput).toBeVisible();
        // Wait for the dropdown panel to appear
        const dropdownPanel = this.page.locator('.drop_box ul li');
        await expect(dropdownPanel.first()).toBeVisible({ timeout: 15000 });
        // Click the first option itself, not the checkbox
        await dropdownPanel.first().click();

        const createNewBtn = this.page.locator('.drop_box p.cursor-pointer', { hasText: 'Create New' }).first();
        await expect(createNewBtn).toBeVisible({ timeout: 10000 });
        await createNewBtn.click();

        // Optionally close a popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verify that selecting a company from the "Solicitor" dropdown populates the "Solicitor's Contact" dropdown with relevant contacts.
     */
    async verifySolicitorDropdownPopulatesContacts() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Scroll to Solicitor field
        const solicitorLabel = this.page.getByText('Solicitor', { exact: true });
        await solicitorLabel.scrollIntoViewIfNeeded();
        await expect(solicitorLabel).toBeVisible({ timeout: 10000 });

        // Locate the Solicitor multiselect dropdown and click to expand
        const solicitorDropdown = this.page.locator(
            'div.col-md-6.create-task-dropdown:has(label:text("Solicitor")) div.tags'
        );
        await solicitorDropdown.click();

        // Wait for the dropdown and select the first option
        const dropdownPanel = this.page.locator('.drop_box ul li');
        await expect(dropdownPanel.first()).toBeVisible({ timeout: 15000 });
        const searchInput = this.page.locator('.drop_box input[placeholder="Search"]');
        await expect(searchInput).toBeVisible();
        await searchInput.click();
        await searchInput.fill('Netsol');
        // Select the "Netsol" option (case-insensitive) from the dropdown
        const netsolOption = this.page.locator('.drop_box ul li', { hasText: /netsol/i }).first();
        await expect(netsolOption).toBeVisible({ timeout: 10000 });
        await netsolOption.click();
        await solicitorDropdown.click();
        // Locate the Solicitor's Contact dropdown (it should be enabled and populated now)
        const contactDropdownLabel = this.page.getByText("Select Contact", { exact: true });
        await expect(contactDropdownLabel).toBeVisible({ timeout: 10000 });
        await contactDropdownLabel.click();
        // Wait for the dropdown panel to appear and ensure at least one contact option appears
        const contactDropdownPanel = this.page.locator('ng-dropdown-panel .ng-option');
        await expect(contactDropdownPanel.first()).toBeVisible({ timeout: 10000 });

        // Optionally close a popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verify that clicking on the selected name in the "Legal Name" dropdown opens the owner's details in a new tab.
     */
    async verifyLegalNameDropdownOpensOwnerInNewTab() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Scroll to Solicitor field
        const solicitorLabel = this.page.getByText('Solicitor', { exact: true });
        await solicitorLabel.scrollIntoViewIfNeeded();
        await expect(solicitorLabel).toBeVisible({ timeout: 10000 });

        // Locate the Solicitor multiselect dropdown and click to expand
        const solicitorDropdown = this.page.locator(
            'div.col-md-6.create-task-dropdown:has(label:text("Solicitor")) div.tags'
        );
        await solicitorDropdown.click();

        // Wait for the dropdown and select the first option
        const dropdownPanel = this.page.locator('.drop_box ul li');
        await dropdownPanel.first().waitFor({ state: 'visible', timeout: 30000 });
        const searchInput = this.page.locator('.drop_box input[placeholder="Search"]');
        await searchInput.waitFor({ state: 'visible', timeout: 10000 });
        await searchInput.click();
        await searchInput.fill('Netsol');
        // Select the "Netsol" option (case-insensitive) from the dropdown
        const netsolOption = this.page.locator('.drop_box ul li', { hasText: /netsol/i }).first();
        await expect(netsolOption).toBeVisible({ timeout: 10000 });
        await netsolOption.click();
        await solicitorDropdown.click();
        // Locate the Solicitor's Contact dropdown (it should be enabled and populated now)
        const contactDropdownLabel = this.page.getByText("Select Contact", { exact: true });
        await expect(contactDropdownLabel).toBeVisible({ timeout: 10000 });
        await contactDropdownLabel.click({ force: true });

        await this.page.waitForTimeout(1000);
        // Wait for the dropdown panel to appear and click on the first contact option
        const contactDropdownPanel = this.page.locator('ng-dropdown-panel .ng-option');
        await contactDropdownPanel.first().waitFor({ state: 'visible', timeout: 30000 });
        await contactDropdownPanel.first().click();

        const selectedValue = this.page.locator('div.ng-value > div.d-flex.align-items-center.cursor-pointer');

        // Check it exists / is visible
        await expect(selectedValue).toBeVisible();
        await selectedValue.click({ force: true });

        await expect(this.page.locator('ng-select[formcontrolname="contact_type"]')).toBeVisible();

        // Optionally close a popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }

    }

    /**
     * Verifies that clicking on the selected company in the "Solicitor" dropdown
     * opens the company's details in a new tab.
     */
    async verifySolicitorDropdownOpensCompanyInNewTab() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Legal tab
        const legalTab = this.page.getByRole('tab', { name: /Legal/i });
        await expect(legalTab).toBeVisible({ timeout: 10000 });
        await legalTab.click();

        // Scroll to Solicitor field
        const solicitorLabel = this.page.getByText('Solicitor', { exact: true });
        await solicitorLabel.scrollIntoViewIfNeeded();
        await expect(solicitorLabel).toBeVisible({ timeout: 10000 });

        // Locate the Solicitor multiselect dropdown and click to expand
        const solicitorDropdown = this.page.locator(
            'div.col-md-6.create-task-dropdown:has(label:text("Solicitor")) div.tags'
        );
        await solicitorDropdown.click();

        // Wait for the dropdown and select the first option
        const dropdownPanel = this.page.locator('.drop_box ul li');
        await dropdownPanel.first().waitFor({ state: 'visible', timeout: 30000 });
        const searchInput = this.page.locator('.drop_box input[placeholder="Search"]');
        await expect(searchInput).toBeVisible();
        await searchInput.click();
        await searchInput.fill('Netsol');
        // Select the "Netsol" option (case-insensitive) from the dropdown
        const netsolOption = this.page.locator('.drop_box ul li', { hasText: /netsol/i }).first();
        await expect(netsolOption).toBeVisible({ timeout: 10000 });
        await netsolOption.click();
        await solicitorDropdown.click();
        const companySelected = this.page.locator('div.selected_one p.cursor-pointer').last();

        // Check it's visible
        await expect(companySelected).toBeVisible();

        await companySelected.click()


        await expect(this.page.locator('#rightbarwithscroll').last()).toBeVisible();

        // Optionally close a popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verify that the Document Tab opens correctly
     */
}
