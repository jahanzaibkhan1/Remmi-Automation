import { Page, Locator, expect } from '@playwright/test';
import { ContactBasePage } from './ContactBasePage';
import { faker } from '@faker-js/faker';

export class ContactLeadFormPage extends ContactBasePage {
    async verifyNewLeadButtonOpensForm() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openLead();
        const newLeadButton = this.page.getByRole('button', { name: /New Lead/i });
        await newLeadButton.waitFor({ state: 'visible' });
        await newLeadButton.click();
        const createLeadText = this.page.getByText(/create lead/i);
        await expect(createLeadText).toBeVisible({ timeout: 10000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verify that selecting an Existing Client removes contact creation fields
     */
    async verifyExistingClientRemovesContactFields(): Promise<void> {
        await this.NavigateToContacts();
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openLead();
        const newLeadButton = this.page.getByRole('button', { name: /New Lead/i });
        await newLeadButton.waitFor({ state: 'visible' });
        await newLeadButton.click();
        const createLeadText = this.page.getByText(/create lead/i);
        await expect(createLeadText).toBeVisible({ timeout: 10000 });
        const existingClientParagraph = this.page.getByRole('paragraph').filter({ hasText: /^11 22$/ }).first();
        await existingClientParagraph.waitFor({ state: 'visible' });
        // The following fields should NOT be visible for an existing client
        const fieldsShouldNotExist = [
            '[formcontrolname="first_name"]',
            '[formcontrolname="last_name"]',
            '[formcontrolname="mobile_phone"]',
            '[formcontrolname="telephone"]',
            '[formcontrolname="email"]',
            '[formcontrolname="suburb"]',
            '[formcontrolname="postcode"]',
            '[formcontrolname="countryregion"] .ng-select-container',
            '[formcontrolname="countryregion"] input'
        ];

        for (const selector of fieldsShouldNotExist) {
            await expect(this.page.locator(selector)).not.toBeVisible();
        }
        await this.closeModalIfVisible();
    }

    /**
     * Verify that removing an Existing Client brings back contact creation fields
     */
    async verifyContactFieldsReturnOnExistingClientRemoval(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openLead();
        const newLeadButton = this.page.getByRole('button', { name: /New Lead/i });
        await newLeadButton.waitFor({ state: 'visible' });
        await newLeadButton.click();

        const createLeadText = this.page.getByText(/create lead/i);
        await expect(createLeadText).toBeVisible({ timeout: 10000 });

        const existingClientParagraph = this.page.getByRole('paragraph').filter({ hasText: /^11 22$/ }).first();
        await existingClientParagraph.waitFor({ state: 'visible' });

        const removeIcon = this.page.locator('span.pi.pi-times-circle.f-12.ng-star-inserted').first();
        await removeIcon.waitFor({ state: 'visible' });
        await removeIcon.click();

        await existingClientParagraph.waitFor({ state: 'hidden' });

        const firstNameField = this.page.locator('[formcontrolname="first_name"]').last();
        const lastNameField = this.page.locator('[formcontrolname="last_name"]').last();
        const mobilePhoneField = this.page.locator('[formcontrolname="mobile_phone"]').last();
        const telephoneField = this.page.locator('[formcontrolname="telephone"]').last();
        const emailField = this.page.locator('[formcontrolname="email"]').last();
        const suburbField = this.page.locator('[formcontrolname="suburb"]').last();
        const postcodeField = this.page.locator('[formcontrolname="postcode"]').last();
        const countryRegionSelect = this.page.locator('[formcontrolname="countryregion"] .ng-select-container').last();
        const countryRegionInput = this.page.locator('[formcontrolname="countryregion"] input').last();

        await firstNameField.waitFor({ state: 'visible' });
        await lastNameField.waitFor({ state: 'visible' });
        await mobilePhoneField.waitFor({ state: 'visible' });
        await telephoneField.waitFor({ state: 'visible' });
        await emailField.waitFor({ state: 'visible' });
        await suburbField.waitFor({ state: 'visible' });
        await postcodeField.waitFor({ state: 'visible' });
        await countryRegionSelect.waitFor({ state: 'visible' });
        await countryRegionInput.waitFor({ state: 'visible' });
        await this.closeModalIfVisible();
    }

    /**
     * Verify that selecting an Existing Client links the contact to the contact field
     */
    async verifyExistingClientSelectionLinksContact(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openLead();
        const newLeadButton = this.page.getByRole('button', { name: /New Lead/i });
        await newLeadButton.waitFor({ state: 'visible' });
        await newLeadButton.click();
        const existingClientParagraph = this.page.getByRole('paragraph').filter({ hasText: /^11 22$/ }).first();
        await existingClientParagraph.waitFor({ state: 'visible' });
        const firstNameField = this.page.locator('[formcontrolname="first_name"]').last();
        await firstNameField.waitFor({ state: 'hidden' });
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that clicking the close button closes the lead form modal
     */
    async verifyCloseButtonClosesForm(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openLead();
        const newLeadButton = this.page.getByRole('button', { name: /New Lead/i });
        await newLeadButton.waitFor({ state: 'visible' });
        await newLeadButton.click();
        const createLeadText = this.page.getByText(/create lead/i);
        await expect(createLeadText).toBeVisible({ timeout: 10000 });
        const closeButton = this.page.getByRole('button', { name: /close/i }).first();
        await closeButton.waitFor({ state: 'visible' });
        await closeButton.click();
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that clicking the "Save & Close" button on the lead form saves the lead and closes the form modal.
     */
    async verifySaveAndCloseButtonSavesLeadAndClosesForm(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openLead();
        await this.leadCreation();
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that selecting "Buyer" or "Prospective Buyer" displays the correct Requirements fields in the lead form.
     */
    async verifyBuyerRequirementsFields(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openLead();

        // Open the New Lead form
        const newLeadButton = this.page.getByRole('button', { name: /New Lead/i });
        await newLeadButton.waitFor({ state: 'visible' });
        await newLeadButton.click();

        const leadDetails = this.page.locator('div.popup-gray-box:has(p:text("Lead Details"))');
        await leadDetails.waitFor({ state: 'visible' });

        // Select Lead Type: Buyer
        const leadType = leadDetails.locator('ng-select[formcontrolname="lead_type"]');
        await leadType.waitFor({ state: 'visible' });
        await leadType.click();
        await this.page.waitForTimeout(600);
        const buyerOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: /Buyer|Prospective Buyer/ });
        await buyerOption.waitFor({ state: 'visible' });
        await buyerOption.click();
        await this.page.waitForTimeout(600);

        const requirementsSection = this.page.locator('div.popup-gray-box:has(p:text("Requirements"))');
        await requirementsSection.waitFor({ state: 'visible' });

        const requirementsFields = [
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) div:has(label:text("Property Type")) ng-select'),
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) div:has(label:text("Price Range")) ng-select'),
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) div:has(label:text("Bedrooms")) ng-select'),
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) div:has(label:text("Bathrooms")) ng-select'),
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) div:has(label:text("Car Parks")) ng-select'),
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) div:has(label:text("Timeframe")) ng-select'),
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) ng-select[formcontrolname="min_land_area"]'),
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) ng-select[formcontrolname="max_land_area"]'),
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) ng-select[formcontrolname="established_property"]'),
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) ng-select[formcontrolname="intended_use"]'),
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) re-multiselect[formcontrolname="outdoor_feature"]'),
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) re-multiselect[formcontrolname="indoor_feature"]'),
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) ng-select[formcontrolname="reason_for_buying"]'),
        ];

        for (const field of requirementsFields) {
            await field.evaluate((el) => {
                el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'auto' });
            }).catch(() => { });
            await field.waitFor({ state: 'visible' });
        }

        await this.closeModalIfVisible();
    }

    /**
     * Verify that selecting Developer or Prospective Developer displays the correct Requirements fields
     */
    async verifyDeveloperRequirementsFields() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openLead();

        // Open the New Lead form
        const newLeadButton = this.page.getByRole('button', { name: /New Lead/i });
        await newLeadButton.waitFor({ state: 'visible' });
        await newLeadButton.click();

        const leadDetails = this.page.locator('div.popup-gray-box:has(p:text("Lead Details"))');
        await leadDetails.waitFor({ state: 'visible' });

        // Select Lead Type: Developer or Prospective Developer
        const leadType = leadDetails.locator('ng-select[formcontrolname="lead_type"]');
        await leadType.waitFor({ state: 'visible' });
        await leadType.click();
        await this.page.waitForTimeout(600);
        // Pick Developer or Prospective Developer
        const developerOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: /Developer/ });
        await developerOption.waitFor({ state: 'visible' });
        await developerOption.click();
        await this.page.waitForTimeout(600);

        const requirementsSection = this.page.locator('div.popup-gray-box:has(p:text("Requirements"))');
        await requirementsSection.waitFor({ state: 'visible' });

        // Collect all the Developer Requirements fields to verify visible
        const requirementsFields = [
            this.page.locator('div.popup-gray-box:has(p:text("Developer Requirements")) ng-select[formcontrolname="development_type"]'),
            this.page.locator('div.popup-gray-box:has(p:text("Developer Requirements")) input[formcontrolname="project_address"]'),
            this.page.locator('div.popup-gray-box:has(p:text("Developer Requirements")) input[formcontrolname="project_suburb"]'),
            this.page.locator('div.popup-gray-box:has(p:text("Developer Requirements")) ng-select[formcontrolname="project_status"]'),
            this.page.locator('div.popup-gray-box:has(p:text("Developer Requirements")) input[formcontrolname="lot_quantity"]'),
            this.page.locator('div.popup-gray-box:has(p:text("Developer Requirements")) ng-select[formcontrolname="current_market"]'),
            this.page.locator('div.popup-gray-box:has(p:text("Developer Requirements")) input[formcontrolname="product_mix"]'),
            this.page.locator('div.popup-gray-box:has(p:text("Developer Requirements")) ng-select[formcontrolname="price_range"]'),
            this.page.locator('div.popup-gray-box:has(p:text("Developer Requirements")) ng-select[formcontrolname="time_frame"]'),
            this.page.locator('div.popup-gray-box:has(p:text("Developer Requirements")) input[formcontrolname="levels"]'),
            this.page.locator('div.popup-gray-box:has(p:text("Developer Requirements")) input[formcontrolname="amenities"]'),
        ];

        for (const field of requirementsFields) {
            await field.evaluate((el) => {
                el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'auto' });
            }).catch(() => { });
            await field.waitFor({ state: 'visible' });
        }

        await this.closeModalIfVisible();
    }

    // Verify that selecting Seller or Prospective Seller displays the correct Requirements fields
    async verifySellerRequirementsFields() {

        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openLead();

        // Open the New Lead form
        const newLeadButton = this.page.getByRole('button', { name: /New Lead/i });
        await newLeadButton.waitFor({ state: 'visible' });
        await newLeadButton.click();
        const leadDetails = this.page.locator('div.popup-gray-box:has(p:text("Lead Details"))');
        // Select Lead Type: Seller or Prospective Seller
        const leadType = leadDetails.locator('ng-select[formcontrolname="lead_type"]');
        await leadType.waitFor({ state: 'visible' });
        await leadType.click();
        await this.page.waitForTimeout(600);

        // Pick Seller or Prospective Seller
        const sellerOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: /Seller/ });
        await sellerOption.waitFor({ state: 'visible' });
        await sellerOption.click();
        await this.page.waitForTimeout(600);

        const requirementsSection = this.page.locator('div.popup-gray-box:has(p:text("Requirements"))');
        await requirementsSection.waitFor({ state: 'visible' });

        // Collect all the Seller Requirements fields to verify visible, as per UI markup
        const requirementsFields = [
            // Address input
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) input[formcontrolname="address"]'),
            // Property Type dropdown
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) ng-select[formcontrolname="listing_type"]'),
            // Price Range dropdown
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) ng-select[formcontrolname="price_range"]'),
            // Bedrooms dropdown
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) ng-select[formcontrolname="beds"]'),
            // Bathrooms dropdown
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) ng-select[formcontrolname="baths"]'),
            // Selling Timeframe dropdown
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) ng-select[formcontrolname="time_frame"]'),
            // Reason For Selling dropdown
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) ng-select[formcontrolname="reason_for_selling"]'),
            // Current Purpose dropdown
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) ng-select[formcontrolname="current_purpose"]'),
            // Tenancy Details dropdown
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) ng-select[formcontrolname="tenancy_details"]'),
            // Tenancy End Date calendar
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) p-calendar[formcontrolname="tenancy_end_date"] input[placeholder="Tenancy End Date"]'),
            // Cars dropdown
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) ng-select[formcontrolname="car"]'),
            // Features multiselect (look for re-multiselect)
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) re-multiselect[formcontrolname="features"]'),
        ];

        for (const field of requirementsFields) {
            await field.evaluate((el) => {
                el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'auto' });
            }).catch(() => { });
            await field.waitFor({ state: 'visible' });
        }

        await this.closeModalIfVisible();
    }

    /**
     * Verifies the visibility and contents of the "Related Lead" dropdown in the Lead form.
     */
    async verifyRelatedLeadDropdownVisible() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openLead();

        // Open New Lead form
        const newLeadButton = this.page.getByRole('button', { name: /New Lead/i });
        await newLeadButton.waitFor({ state: 'visible' });
        await newLeadButton.click();

        // Locate and open the Related Lead dropdown
        const relatedLeadDropdown = this.page.locator('ng-select[formcontrolname="lead_category"]');
        await relatedLeadDropdown.waitFor({ state: 'visible' });
        await relatedLeadDropdown.click();

        // Gather all dropdown options
        const dropdownOptions = this.page.locator('ng-dropdown-panel .ng-option');
        await dropdownOptions.first().waitFor({ state: 'visible' });
        const allOptions: string[] = [];
        const totalOptions = await dropdownOptions.count();
        for (let i = 0; i < totalOptions; i++) {
            const optText = (await dropdownOptions.nth(i).innerText())?.trim();
            if (optText) allOptions.push(optText);
        }

        // Define and verify required options
        const expectedOptions = ['Listing', 'Project', 'Property', 'Client Requirements'];
        for (const expected of expectedOptions) {
            if (!allOptions.includes(expected)) {
                throw new Error(
                    `Related Lead dropdown missing expected option "${expected}". Options found: ${JSON.stringify(allOptions)}`
                );
            }
        }
        if (allOptions.length !== expectedOptions.length) {
            throw new Error(
                `Related Lead dropdown option count mismatch. Expected ${expectedOptions.length}, got ${allOptions.length}: ${JSON.stringify(allOptions)}`
            );
        }

        await this.closeModalIfVisible();
    }

    /**
     * Verify that selecting Related Properties assigns the lead to the selected module
     */
    async verifyRelatedLeadDropdownAssignsToModule() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openLead();

        const tableRowsLocator = this.page.locator('#customentitydatalist table tbody tr');
        await tableRowsLocator.first().waitFor({ state: "visible" });
        const initialRowCount = await tableRowsLocator.count();

        const newLeadButton = this.page.getByRole('button', { name: /New Lead/i });
        await newLeadButton.waitFor({ state: 'visible' });
        await newLeadButton.click();

        const leadDetails = this.page.locator('div.popup-gray-box:has(p:text("Lead Details"))');
        await leadDetails.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(1000);

        const leadType = leadDetails.locator('ng-select[formcontrolname="lead_type"]');
        await leadType.waitFor({ state: 'visible' });
        await leadType.click();
        const buyerOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Buyer' });
        await buyerOption.waitFor({ state: 'visible' });
        await buyerOption.click();
        await this.page.waitForTimeout(600);

        const leadStatus = leadDetails.locator('ng-select[formcontrolname="lead_status"]');
        await leadStatus.waitFor({ state: 'visible' });
        await leadStatus.click();
        const leadStatusOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'New' });
        await leadStatusOption.waitFor({ state: 'visible' });
        await leadStatusOption.click();
        await this.page.waitForTimeout(600);

        const leadSource = leadDetails.locator('ng-select[formcontrolname="lead_source"]');
        await leadSource.waitFor({ state: 'visible' });
        await leadSource.click();
        const sourceOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Billboard' });
        await sourceOption.waitFor({ state: 'visible' });
        await sourceOption.click();
        await this.page.waitForTimeout(1000);

        const relatedLeadDropdown = this.page.locator('ng-select[formcontrolname="lead_category"]');
        await relatedLeadDropdown.waitFor({ state: 'visible' });
        await relatedLeadDropdown.click();
        const listingOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Project' }).first();
        await listingOption.waitFor({ state: 'visible' });
        await listingOption.click();
        await this.page.waitForTimeout(600);

        // Project Name dropdown: click and select first option
        const projectNameDropdown = this.page.locator('ng-select[formcontrolname="project"]');
        await projectNameDropdown.waitFor({ state: 'visible' });
        await projectNameDropdown.click();
        const dropdownPanel = this.page.locator('.ng-dropdown-panel');
        await dropdownPanel.waitFor({ state: 'visible' });
        const firstProjectOption = dropdownPanel.locator('.ng-option', { hasText: 'East Village Vila' }).first();
        await firstProjectOption.evaluate(el => el.scrollIntoView({ block: 'center', inline: 'center' }));
        await firstProjectOption.waitFor({ state: 'visible' });
        await firstProjectOption.click();
        await this.page.waitForTimeout(600);

        const contactDetails = this.page.getByText('Email:');
        await contactDetails.waitFor({ state: 'visible' });

        const saveAndCloseButton = this.page.getByRole('button', { name: /save & close/i }).first();
        await saveAndCloseButton.waitFor({ state: 'visible' });
        await expect(saveAndCloseButton).toBeEnabled();
        await saveAndCloseButton.click();

        const leadAddedSuccessMsg = this.page.getByText(/lead added successfully/i);
        await leadAddedSuccessMsg.waitFor({ state: 'visible' });
        await leadAddedSuccessMsg.waitFor({ state: 'hidden' });

        await tableRowsLocator.first().waitFor({ state: "visible" });
        const finalRowCount = await tableRowsLocator.count();
        if (finalRowCount <= initialRowCount) {
            throw new Error(`Lead creation did not increase the number of records in the table: before=${initialRowCount}, after=${finalRowCount}`);
        }

        await this.closeModalIfVisible();
    }


    /**
     * Verify that Agent Responsible and Owner auto fill with the logged in user
     */
    async verifyAgentResponsibleAndOwnerAutofill() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openLead();
        const tableRowsLocator = this.page.locator('#customentitydatalist table tbody tr');
        await tableRowsLocator.first().waitFor({ state: "visible" });
        const newLeadButton = this.page.getByRole('button', { name: /New Lead/i });
        await newLeadButton.waitFor({ state: 'visible' });
        await newLeadButton.click();
        const agentResponsibleLocator = this.page.locator('span').filter({ hasText: 'Jahanzaib Xenex' }).first();
        await agentResponsibleLocator.waitFor({ state: 'visible' });
        const owner = this.page.locator('span').filter({ hasText: 'Jahanzaib Xenex' }).last();
        await owner.waitFor({ state: 'visible' });
        await this.closeLeadModalIfVisible();
        await this.closeModalIfVisible();

    }

    /**
     * Verify that Agent Responsible and Owner fields can be changed to different users.
     */
    async verifyAgentResponsibleAndOwnerCanBeChanged() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openLead();
        const tableRowsLocator = this.page.locator('#customentitydatalist table tbody tr');
        await tableRowsLocator.first().waitFor({ state: "visible" });
        const newLeadButton = this.page.getByRole('button', { name: /New Lead/i });
        await newLeadButton.waitFor({ state: 'visible' });
        await newLeadButton.click();
        const existingClientParagraph = this.page.getByRole('paragraph').filter({ hasText: /^11 22$/ }).first();
        await existingClientParagraph.waitFor({ state: 'visible' });
        // Change Agent Responsible
        const agentResponsible = this.page.locator('[formcontrolname="agent_responsible"]');
        await agentResponsible.waitFor({ state: 'visible' });
        await agentResponsible.click();
        const agentResponsibleInput = this.page.locator('[formcontrolname="agent_responsible"] input');
        await agentResponsibleInput.waitFor({ state: 'visible' });
        await agentResponsibleInput.fill('Automation Test');
        const agentOption = this.page.getByRole('option', { name: /Automation Test/i });
        await agentOption.waitFor({ state: 'visible' });
        await agentOption.click();

        // Change Owner
        const owner = this.page.locator('[formcontrolname="Owner"]');
        await owner.waitFor({ state: 'visible' });
        await owner.click();
        const ownerInput = this.page.locator('[formcontrolname="Owner"] input');
        await ownerInput.waitFor({ state: 'visible' });
        await ownerInput.fill('Sales Agent');
        const ownerOption = this.page.getByRole('option', { name: /Sales Agent/i });
        await ownerOption.waitFor({ state: 'visible' });
        await ownerOption.click();

        // Verify the fields display the changed values
        const agentResponsibleSpan = this.page.locator('span').filter({ hasText: 'Automation Test' }).first();
        await agentResponsibleSpan.waitFor({ state: 'visible' });
        const ownerSpan = this.page.locator('span').filter({ hasText: 'Sales Agent' }).first();
        await ownerSpan.waitFor({ state: 'visible' });
        const saveButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveButton.waitFor({ state: 'visible' });
        await saveButton.click({ force: true });
        const leadAddedSuccessMsg = this.page.getByText(/lead added successfully/i);
        await leadAddedSuccessMsg.waitFor({ state: 'visible' });
        await leadAddedSuccessMsg.waitFor({ state: 'hidden' });
        const agentTextLocator = this.page.locator('table tbody tr td', { hasText: 'Automation Test' });
        await expect(agentTextLocator.first()).toBeVisible();
        await this.closeModalIfVisible();
    }

    /**
     * Verify that an error message appears when entering an invalid email format
     */
    async verifyInvalidEmailShowsError() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openLead();
        const newLeadButton = this.page.getByRole('button', { name: /New Lead/i });
        await newLeadButton.waitFor({ state: 'visible' });
        await newLeadButton.click();

        const existingClientParagraph = this.page.getByRole('paragraph').filter({ hasText: /^11 22$/ }).first();
        await existingClientParagraph.waitFor({ state: 'visible' });

        const removeIcon = this.page.locator('span.pi.pi-times-circle.f-12.ng-star-inserted').first();
        await removeIcon.waitFor({ state: 'visible' });
        await removeIcon.click();

        // Fill an invalid email in the email field
        const emailInput = this.page.locator('[formcontrolname="email"], input[type="email"]').last();
        await emailInput.waitFor({ state: 'visible' });
        await emailInput.fill('notanemail');

        // Click the "Save & Close" button to attempt to save the lead with invalid email
        const saveAndCloseBtn = this.page.getByRole('button', { name: /Save & Close/i }).first();
        await saveAndCloseBtn.waitFor({ state: 'visible' });
        await saveAndCloseBtn.click({ force: true });

        // Expect an error message to appear
        const errorMsg = this.page.getByText(/please enter a valid email address/i, { exact: false });
        await errorMsg.waitFor({ state: 'visible', timeout: 5000 });

        // Optionally, close the modal if visible
        await this.closeModalIfVisible();
    }

    /**
     * Verify that selecting an Existing Client auto fills Contact Name, Mobile, Email, and Suburb
     */
    async verifyExistingClientAutofillsContactFields() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openLead();

        // Open the new lead form
        const newLeadButton = this.page.getByRole('button', { name: /New Lead/i });
        await newLeadButton.waitFor({ state: 'visible' });
        await newLeadButton.click();

        const existingClientParagraph = this.page.getByRole('paragraph').filter({ hasText: /^11 22$/ }).first();
        await existingClientParagraph.waitFor({ state: 'visible' });
        // Verify the Contact Details field shows the selected Existing Client
        const contactDetails = this.page.getByText(/Contact Details\s*Contact:\s*11 22/i);
        await contactDetails.waitFor({ state: 'visible' });

        await this.closeModalIfVisible();
    }

    /**
     * Verify that closing the form without saving does not retain data
     */
    async verifyFormDataNotRetainedOnClose() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openLead();

        // Open the new lead form
        const newLeadButton = this.page.getByRole('button', { name: /New Lead/i });
        await newLeadButton.waitFor({ state: 'visible' });
        await newLeadButton.click();

        const existingClientParagraph = this.page.getByRole('paragraph').filter({ hasText: /^11 22$/ }).first();
        await existingClientParagraph.waitFor({ state: 'visible' });

        const removeIcon = this.page.locator('span.pi.pi-times-circle.f-12.ng-star-inserted').first();
        await removeIcon.waitFor({ state: 'visible' });
        await removeIcon.click();

        // Fill out first name and email fields with some test data
        const firstNameInput = this.page.locator('[formcontrolname="first_name"]').last();
        const emailInput = this.page.locator('[formcontrolname="email"], input[type="email"]').last();
        await firstNameInput.waitFor({ state: 'visible' });
        await emailInput.waitFor({ state: 'visible' });

        await firstNameInput.fill('ShouldNotBeRetained');
        await emailInput.fill('shouldnot@beretained.com');

        // Close the modal without saving
        const closeButton = this.page.getByRole('button', { name: /close/i }).first();
        await closeButton.waitFor({ state: 'visible' });
        await closeButton.click();

        // Reopen the form and check that previous data is not retained
        await newLeadButton.waitFor({ state: 'visible' });
        await newLeadButton.click();

        await existingClientParagraph.waitFor({ state: 'visible' });
        await removeIcon.waitFor({ state: 'visible' });
        await removeIcon.click();

        await firstNameInput.waitFor({ state: 'visible' });
        await emailInput.waitFor({ state: 'visible' });

        const firstNameValue = await firstNameInput.inputValue();
        const emailValue = await emailInput.inputValue();

        if (firstNameValue === 'ShouldNotBeRetained' || emailValue === 'shouldnot@beretained.com') {
            throw new Error("Form data was retained after closing without saving.");
        }

        await this.closeModalIfVisible();
    }

    /**
     * Verify that a lead remains linked to the correct client after editing the lead
     */
    async verifyLeadRemainsLinkedToClientAfterEdit(): Promise<void> {
        await this.NavigateToContacts();
        await this.openContactByNameAA();
        await this.openLead();
        await this.clickFirstLeadTableRow();
        const leadLink = this.page.locator('a').filter({ hasText: 'Lead - AA AA' });
        await leadLink.waitFor({ state: 'visible' });
        await this.clickLeadEditIcon();
        // Wait for the contact with name 'AA AA' and its cross icon to be visible
        const contactContainer = this.page.locator('div.selected_one', { hasText: 'AA AA' }).last();
        await contactContainer.waitFor({ state: 'visible' });

        const contactName = contactContainer.locator('p.cursor-pointer', { hasText: 'AA AA' });
        await contactName.waitFor({ state: 'visible' });

        const crossIcon = contactContainer.locator('span.pi.pi-times-circle');
        await crossIcon.waitFor({ state: 'visible' });

        // Click Owner field, search for 'jahanzaib xenex', and select it
        const owner = this.page.locator('[formcontrolname="Owner"]');
        await owner.waitFor({ state: 'visible' });
        await owner.click();
        const ownerSearchField = this.page.locator('[formcontrolname="Owner"] input');
        await ownerSearchField.waitFor({ state: 'visible' });
        await ownerSearchField.fill('jahanzaib xenex');
        const jahanzaibOption = this.page.getByRole('option', { name: /jahanzaib xenex/i });
        await jahanzaibOption.waitFor({ state: 'visible' });
        await jahanzaibOption.click();

        // Click the Save button to save changes in the lead edit modal
        const saveButton = this.page.getByRole('button', { name: /save/i }).first();
        await saveButton.waitFor({ state: 'visible' });
        await saveButton.click();

        await contactContainer.waitFor({ state: 'visible' });
        await contactName.waitFor({ state: 'visible' });
        await crossIcon.waitFor({ state: 'visible' });

        await this.closeModalIfVisible();
    }

    /**
     * Verify that related properties dropdown resets after removing selection
     */
    async verifyRelatedPropertiesDropdownResetsAfterRemovingSelection(): Promise<void> {
        await this.NavigateToContacts();
        await this.openContactByNameAA();
        await this.openLead();
        await this.clickFirstLeadTableRow();
        const leadLink = this.page.locator('a').filter({ hasText: 'Lead - AA AA' });
        await leadLink.waitFor({ state: 'visible' });
        await this.clickLeadEditIcon();

        const contactContainer = this.page.locator('div.selected_one', { hasText: 'AA AA' }).last();
        await contactContainer.waitFor({ state: 'visible' });

        const contactName = contactContainer.locator('p.cursor-pointer', { hasText: 'AA AA' });
        await contactName.waitFor({ state: 'visible' });

        const relatedLeadDropdown = this.page.locator('ng-select[formcontrolname="lead_category"]');
        await relatedLeadDropdown.waitFor({ state: 'visible' });
        await relatedLeadDropdown.click({ force: true });

        const option = this.page.getByRole('option', { name: 'Property' });
        await option.waitFor({ state: 'visible' });
        await option.click();
        const selectedTag = this.page.locator('.ng-select .ng-value-label', { hasText: 'Property' });
        await selectedTag.waitFor({ state: 'visible' });

        const clearIcon = this.page.locator('#lead_category').getByTitle('Clear all');
        await clearIcon.waitFor({ state: 'visible' });
        await clearIcon.click();
        await clearIcon.waitFor({ state: 'hidden' });
        await this.closeModalIfVisible();
    }

    /**
     * Verify that a lead can be saved with only a lead type selected
     */
    async verifyLeadCanBeSavedWithOnlyLeadTypeSelected(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openLead();

        // Open the new lead form
        const newLeadButton = this.page.getByRole('button', { name: /New Lead/i });
        await newLeadButton.waitFor({ state: 'visible' });
        await newLeadButton.click();

        const existingClientParagraph = this.page.getByRole('paragraph').filter({ hasText: /^11 22$/ }).first();
        await existingClientParagraph.waitFor({ state: 'visible' });

        // Select only the lead type ("Buyer"), do not touch other fields
        const leadTypeDropdown = this.page.locator('ng-select[formcontrolname="lead_type"]');
        await leadTypeDropdown.waitFor({ state: 'visible' });
        await leadTypeDropdown.click({ force: true });
        const buyerOption = this.page.getByRole('option', { name: 'Buyer' });
        await buyerOption.waitFor({ state: 'visible' });
        await buyerOption.click();

        // Remove lead status tag
        const leadStatusClearIcon = this.page.getByTitle('Clear all').nth(3);
        await leadStatusClearIcon.waitFor({ state: 'visible' });
        await leadStatusClearIcon.click();


        // Remove related contact tag
        const relatedContactClearIcon = this.page.locator('#lead_category').getByTitle('Clear all');
        await relatedContactClearIcon.waitFor({ state: 'visible' });
        await relatedContactClearIcon.click();

        // Remove agent responsible tag
        const agentRespClearIcon = this.page.getByTitle('Clear all').nth(3);
        await agentRespClearIcon.waitFor({ state: 'visible' });
        await agentRespClearIcon.click();

        const saveButton = this.page.getByRole('button', { name: /save/i }).first();
        await saveButton.waitFor({ state: 'visible' });
        await saveButton.click();
        const successMsg = this.page.getByText('Lead added successfully', { exact: true });
        await successMsg.waitFor({ state: 'visible' });
        await successMsg.waitFor({ state: 'hidden' });
        await this.closeModalIfVisible();
    }

    /**
    * Verifies that clicking the "New Lead" button opens the lead form.
    */
    async verifyContactNameOpensContactFormInNewTab(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openLead();

        // Open the new lead form
        const newLeadButton = this.page.getByRole('button', { name: /New Lead/i });
        await newLeadButton.waitFor({ state: 'visible' });
        await newLeadButton.click();

        const existingClientParagraph = this.page.getByRole('paragraph').filter({ hasText: /^11 22$/ }).first();
        await existingClientParagraph.waitFor({ state: 'visible' });
        const ele = this.page.locator('p').filter({ hasText: '11 22' }).last()
        await ele.waitFor({ state: 'visible' });
        await ele.click();
        const detailsSection = this.page.locator('section.body-details.h-100.border-0:visible');
        await detailsSection.waitFor({ state: 'visible' });
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that the Tasks tab displays existing task records for a contact.
     */

    async verifyLeadAssignmentRecordAppears() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.leadCreation();
        await this.openStreamTab();
        const streamEntry = this.page.locator('div.stream-body').filter({ hasText: 'Lead Assigned' }).first();
        await streamEntry.waitFor({ state: "visible", timeout: 10000 });
        await this.closeModalIfVisible();
    }

    async verifyLeadAppearsInLeadModule(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.leadCreation();
        await this.closeModalIfVisible();
    }

    async verifyLeadStatusChange() {
        await this.NavigateToContacts();
        await this.openContactByNameAA();
        const firstStreamRecord = this.page.locator('div.stream-body').first();
        await firstStreamRecord.waitFor({ state: 'visible' });
        await this.openLead();
        await this.clickFirstLeadTableRow();
        const leadLink = this.page.locator('a').filter({ hasText: 'Lead - AA AA' });
        await leadLink.waitFor({ state: 'visible' });
        await this.clickLeadEditIcon();

        // Wait for the contact with name 'AA AA' and its cross icon to be visible
        const contactContainer = this.page.locator('div.selected_one', { hasText: 'AA AA' }).last();
        await contactContainer.waitFor({ state: 'visible' });

        const contactName = contactContainer.locator('p.cursor-pointer', { hasText: 'AA AA' });
        await contactName.waitFor({ state: 'visible' });

        const crossIcon = contactContainer.locator('span.pi.pi-times-circle');
        await crossIcon.waitFor({ state: 'visible' });

        const relatedLead = this.page.locator('[formcontrolname="lead_category"]');
        await relatedLead.waitFor({ state: 'visible' });
        await relatedLead.click();
        const relatedLeadOption = this.page.getByRole('option', { name: 'Project' });
        await relatedLeadOption.waitFor({ state: 'visible' });
        await relatedLeadOption.click();

        const leadEnquiry = this.page.locator('[formcontrolname="project"], [formcontrolname="listing"]');
        await leadEnquiry.waitFor({ state: 'visible' });
        await leadEnquiry.click();
        const eastVillageOption = this.page.getByRole('option', { name: 'East Village Vila' });
        await eastVillageOption.waitFor({ state: 'visible' });
        await eastVillageOption.click();

        // Agent Responsible
        const agentResponsible = this.page.locator('[formcontrolname="agent_responsible"]');
        await agentResponsible.waitFor({ state: 'visible' });
        await agentResponsible.click();
        const agentResponsibleSearchField = this.page.locator('[formcontrolname="agent_responsible"] input');
        await agentResponsibleSearchField.waitFor({ state: 'visible' });
        await agentResponsibleSearchField.fill('jahanzaib xenex');
        const jahanzaibAgentOption = this.page.getByRole('option', { name: /jahanzaib xenex/i });
        await jahanzaibAgentOption.waitFor({ state: 'visible' });
        await jahanzaibAgentOption.click();

        // Click Owner field, search for 'jahanzaib xenex', and select it
        const owner = this.page.locator('[formcontrolname="Owner"]');
        await owner.waitFor({ state: 'visible' });
        await owner.click();
        const ownerSearchField = this.page.locator('[formcontrolname="Owner"] input');
        await ownerSearchField.waitFor({ state: 'visible' });
        await ownerSearchField.fill('jahanzaib xenex');
        const jahanzaibOption = this.page.getByRole('option', { name: /jahanzaib xenex/i });
        await jahanzaibOption.waitFor({ state: 'visible' });
        await jahanzaibOption.click();

        // Lead Type
        const leadType = this.page.locator('[formcontrolname="lead_type"]');
        await leadType.waitFor({ state: 'visible' });
        await leadType.click();
        const buyerOption = this.page.getByRole('option', { name: 'Buyer' });
        await buyerOption.waitFor({ state: 'visible' });
        await buyerOption.click();

        // Lead Status
        const leadStatus = this.page.locator('[formcontrolname="lead_status"]');
        await leadStatus.waitFor({ state: 'visible' });
        await leadStatus.click();
        const newOption = this.page.getByRole('option', { name: 'Contact Started' });
        await newOption.waitFor({ state: 'visible' });
        await newOption.click();

        // Lead Source
        const leadSource = this.page.locator('[formcontrolname="lead_source"]');
        await leadSource.waitFor({ state: 'visible' });
        await leadSource.click();
        const billboardOption = this.page.getByRole('option', { name: 'Billboard' });
        await billboardOption.waitFor({ state: 'visible' });
        await billboardOption.click();

        await this.clickSaveButton();
        const successMessageLocator = this.page.getByText('Lead updated successfully', { exact: true });
        await successMessageLocator.waitFor({ state: 'visible' });
        await successMessageLocator.waitFor({ state: 'hidden' });
        await this.closeLeadModalIfVisible();
        await this.page.waitForTimeout(2000);
        const tableRow = this.page.locator('#customentitydatalist table tbody tr').first();
        await tableRow.waitFor({ state: 'visible' });
        const leadStatusCell = tableRow.locator('td').nth(2);
        await leadStatusCell.waitFor({ state: 'visible' });
        const statusText = await leadStatusCell.textContent();
        if (!statusText || !/Contact Started/i.test(statusText)) {
            throw new Error("Lead 'Status' cell does not show value 'Contact Started'.");
        }

        await this.closeModalIfVisible();
    }

    async verifyLeadRecordTimeAndDate(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const firstStreamRecord = this.page.locator('div.stream-body').first();
        await firstStreamRecord.waitFor({ state: 'visible' });
        await this.openLead();
        const tableRow = this.page.locator('#customentitydatalist table tbody tr').first();
        await tableRow.waitFor({ state: 'visible' });
        const dateCell = tableRow.locator('td').nth(1);
        await dateCell.waitFor({ state: 'visible' });
        const dateText = await dateCell.textContent();

        if (!dateText || !dateText.trim()) {
            throw new Error("Lead 'Created Date' cell is empty.");
        }
        const datePattern = /^\d{2}\/\d{2}\/\d{2}$/;
        if (!datePattern.test(dateText.trim())) {
            throw new Error(`Lead 'Created Date' cell does not match expected date format (MM/DD/YY): "${dateText}"`);
        }

        await this.closeModalIfVisible();
    }
}
