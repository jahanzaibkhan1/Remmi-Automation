import { expect } from '@playwright/test';
import { ListingBasePage } from './ListingBasePage';

export class ListingLeadPage extends ListingBasePage {
    async openLeadTab() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator('div.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();

        const leadTab = this.page.getByRole('tab', { name: 'lead Lead' });
        await expect(leadTab).toBeVisible({ timeout: 10000 });
        await leadTab.click();
        // Clean up: Close modal if still open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(800);

    }

    /**
     * Verifies that the "New Lead" button is visible and clickable in the listing view.
     */
    async verifyNewLeadButton() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator('div.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();

        const leadTab = this.page.getByRole('tab', { name: 'lead Lead' });
        await expect(leadTab).toBeVisible({ timeout: 10000 });
        await leadTab.click();

        // Look for the "New Lead" button
        const newLeadButton = this.page.getByRole('button', { name: /new lead/i });
        await expect(newLeadButton).toBeVisible({ timeout: 10000 });
        await expect(newLeadButton).toBeEnabled();
        await newLeadButton.click();

        const leadLink = this.page.locator('a').filter({ hasText: /^Lead$/ });
        await expect(leadLink).toBeVisible({ timeout: 10000 });

        // Clean up: Close modal if still open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(800);
    }

    /**
   * Verifies that a newly created lead appears in the Lead module.
   */
    async verifyLeadAppearsInLeadModule() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator('div.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();

        // Go to Lead tab
        const leadTab = this.page.getByRole('tab', { name: 'lead Lead' });;
        await expect(leadTab).toBeVisible({ timeout: 10000 });
        await leadTab.click();

        // Look for the "New Lead" button
        const newLeadButton = this.page.getByRole('button', { name: /new lead/i });
        await expect(newLeadButton).toBeVisible({ timeout: 10000 });
        await expect(newLeadButton).toBeEnabled();
        await newLeadButton.click();

        const leadLink = this.page.locator('a').filter({ hasText: /^Lead$/ });
        await expect(leadLink).toBeVisible({ timeout: 10000 });

        const leadDetails = this.page.locator('div.popup-gray-box:has(p:text("Lead Details"))');
        await expect(leadDetails).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(2000);

        // Select Lead Type
        const leadType = leadDetails.locator('ng-select[formcontrolname="lead_type"]');
        await leadType.click();
        await this.page.waitForTimeout(600);
        const buyerOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Buyer' });
        await expect(buyerOption).toBeVisible({ timeout: 10000 });
        await buyerOption.click();
        await this.page.waitForTimeout(600);
        // Get other lead detail fields
        const leadStatus = leadDetails.locator('ng-select[formcontrolname="lead_status"]');
        await expect(leadStatus).toBeVisible({ timeout: 10000 });
        await leadStatus.click();
        await this.page.waitForTimeout(600);
        const leadStatusOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'New' });
        await expect(leadStatusOption).toBeVisible({ timeout: 10000 });
        await leadStatusOption.click();
        await this.page.waitForTimeout(600);
        // Select Lead Source
        const leadSource = leadDetails.locator('ng-select[formcontrolname="lead_source"]');
        await expect(leadSource).toBeVisible({ timeout: 10000 });
        await leadSource.click();
        await this.page.waitForTimeout(600);
        const sourceOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Billboard' });
        await expect(sourceOption).toBeVisible({ timeout: 10000 });
        await sourceOption.click();
        await this.page.waitForTimeout(1000);
        // Click the placeholder in the tags element
        const tagPlaceholder = this.page.locator('.d-flex > label > re-multiselect > .box > .tags');
        await tagPlaceholder.waitFor({ state: 'visible' });
        await tagPlaceholder.click();
        const searchTagInput = this.page.getByRole('textbox', { name: 'Search' }).last();
        await expect(searchTagInput).toBeVisible({ timeout: 10000 });

        const tagDropdownPanel = this.page.locator('.drop_box');
        await expect(tagDropdownPanel).toBeVisible({ timeout: 20000 });

        const tagOption = tagDropdownPanel.locator('ul li').first().locator('p');
        await expect(tagOption).toBeVisible({ timeout: 20000 });
        await tagOption.click();

        const contactDetails = this.page.getByText('Email:')
        await contactDetails.waitFor({ state: 'visible' });

        // Click "Save & Close" button
        const saveAndCloseButton = this.page.getByRole('button', { name: /save & close/i }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await expect(saveAndCloseButton).toBeEnabled();
        await saveAndCloseButton.click();
        // Get the "lead added successfully" toast message
        const leadAddedSuccessMsg = this.page.getByText(/lead added successfully/i);
        await expect(leadAddedSuccessMsg).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(2000);
        // Verify the first table row is visible after saving new lead
        const firstTableRow = this.page.locator('#customentitydatalist table tbody tr').first();
        await firstTableRow.waitFor({ state: "visible", timeout: 30000 });
        // Clean up: Close modal if still open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(800);
    }

    async verifyLeadAppearInLeadModule() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator('div.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();

        // Go to Lead tab
        const leadTab = this.page.getByRole('tab', { name: 'lead Lead' });;
        await expect(leadTab).toBeVisible({ timeout: 10000 });
        await leadTab.click();

        // Look for the "New Lead" button
        const newLeadButton = this.page.getByRole('button', { name: /new lead/i });
        await expect(newLeadButton).toBeVisible({ timeout: 10000 });
        await expect(newLeadButton).toBeEnabled();
        await newLeadButton.click();

        const leadLink = this.page.locator('a').filter({ hasText: /^Lead$/ });
        await expect(leadLink).toBeVisible({ timeout: 10000 });

        const leadDetails = this.page.locator('div.popup-gray-box:has(p:text("Lead Details"))');
        await expect(leadDetails).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(2000);

        // Select Lead Type
        const leadType = leadDetails.locator('ng-select[formcontrolname="lead_type"]');
        await leadType.click();
        await this.page.waitForTimeout(600);
        const buyerOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Buyer' });
        await expect(buyerOption).toBeVisible({ timeout: 10000 });
        await buyerOption.click();
        await this.page.waitForTimeout(600);
        // Get other lead detail fields
        const leadStatus = leadDetails.locator('ng-select[formcontrolname="lead_status"]');
        await expect(leadStatus).toBeVisible({ timeout: 10000 });
        await leadStatus.click();
        await this.page.waitForTimeout(600);
        const leadStatusOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'New' });
        await expect(leadStatusOption).toBeVisible({ timeout: 10000 });
        await leadStatusOption.click();
        await this.page.waitForTimeout(600);
        // Select Lead Source
        const leadSource = leadDetails.locator('ng-select[formcontrolname="lead_source"]');
        await expect(leadSource).toBeVisible({ timeout: 10000 });
        await leadSource.click();
        await this.page.waitForTimeout(600);
        const sourceOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Billboard' });
        await expect(sourceOption).toBeVisible({ timeout: 10000 });
        await sourceOption.click();
        await this.page.waitForTimeout(1000);
        // Click the placeholder in the tags element
        const tagPlaceholder = this.page.locator('.d-flex > label > re-multiselect > .box > .tags');
        await tagPlaceholder.waitFor({ state: 'visible' });
        await tagPlaceholder.click();
        const searchTagInput = this.page.getByRole('textbox', { name: 'Search' }).last();
        await expect(searchTagInput).toBeVisible({ timeout: 10000 });

        const tagDropdownPanel = this.page.locator('.drop_box');
        await expect(tagDropdownPanel).toBeVisible({ timeout: 20000 });

        const tagOption = this.page.getByRole('listitem').filter({ hasText: '(butt.ahmad78690@gmail.com)' });
        await expect(tagOption).toBeVisible({ timeout: 20000 });
        await tagOption.click();

        const contactDetails = this.page.getByText('Email:')
        await contactDetails.waitFor({ state: 'visible' });

        // Click "Save & Close" button
        const saveAndCloseButton = this.page.getByRole('button', { name: /save & close/i }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await expect(saveAndCloseButton).toBeEnabled();
        await saveAndCloseButton.click();
        // Get the "lead added successfully" toast message
        const leadAddedSuccessMsg = this.page.getByText(/lead added successfully/i);
        await expect(leadAddedSuccessMsg).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(2000);
        // Verify the first table row is visible after saving new lead
        const firstTableRow = this.page.locator('#customentitydatalist table tbody tr').first();
        await firstTableRow.waitFor({ state: "visible", timeout: 30000 });
        // Clean up: Close modal if still open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(800);
    }

    /**
     * Verifies the lead status details for a given lead in the listing.
     */
    async verifyLeadStatusDetails() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator('div.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();

        // Go to Lead tab
        const leadTab = this.page.getByRole('tab', { name: 'lead Lead' });;
        await expect(leadTab).toBeVisible({ timeout: 10000 });
        await leadTab.click();
        // Locate the "Status" column cell for the first row in the lead table and verify it is "New"
        const statusCell = this.page.locator('#customentitydatalist table tbody tr').first().locator('td').nth(4);
        await expect(statusCell).toHaveText(/New/i, { timeout: 10000 });

        // Clean up: Close modal if still open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(800);
    }

    /**
     * Verify duplicate lead creation.
     */
    async verifyDuplicateLeadCreation() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator('div.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();

        // Go to Lead tab
        const leadTab = this.page.getByRole('tab', { name: 'lead Lead' });
        await expect(leadTab).toBeVisible({ timeout: 10000 });
        await leadTab.click();
        // Verify the first table row is visible after saving new lead
        const firstTableRow = this.page.locator('#customentitydatalist table tbody tr').first();
        await expect(firstTableRow).toBeVisible({ timeout: 10000 });
        // Wait for duplicate icons to appear before the click
        const duplicateIconsLocator = this.page.locator('i[ptooltip="Duplicate"].pi.pi-clone');
        await expect(duplicateIconsLocator.first()).toBeVisible({ timeout: 10000 });
        const initialCount = await duplicateIconsLocator.count();
        expect(initialCount).toBeGreaterThan(0);

        // Click the first duplicate icon
        const duplicateIcon = duplicateIconsLocator.first();
        await expect(duplicateIcon).toBeVisible({ timeout: 10000 });
        await duplicateIcon.click();

        await this.page.waitForTimeout(1200);

        // Wait for the success message after duplication
        const duplicateSuccessMessage = this.page.getByText('Duplicated!', { exact: true });
        await expect(duplicateSuccessMessage).toBeVisible({ timeout: 10000 });

        // Wait briefly to allow the UI to update the duplicate list
        await this.page.waitForTimeout(3000);

        // Count the duplicate icons again after duplication
        const finalCount = await duplicateIconsLocator.count();
        expect(finalCount).toBeGreaterThan(initialCount);


        // Clean up: Close modal if still open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(800);
    }

    // Verify lead assignment removal
    async verifyLeadAssignmentRemoval() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator('div.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();

        // Go to Lead tab
        const leadTab = this.page.getByRole('tab', { name: 'lead Lead' });
        await expect(leadTab).toBeVisible({ timeout: 10000 });
        await leadTab.click();

        // Wait for lead assignments to appear in the table
        const assignmentTableRow = this.page.locator('#customentitydatalist table tbody tr').first();
        await expect(assignmentTableRow).toBeVisible({ timeout: 10000 });

        // Count the 'Remove Assigned' icons before removal
        const removeAssignedIconsLocator = this.page.locator('i[ptooltip="Remove Assigned"].pi.pi-user-minus');
        await removeAssignedIconsLocator.first().waitFor({ state: 'visible', timeout: 20000 });
        const initialCount = await removeAssignedIconsLocator.count();
        expect(initialCount).toBeGreaterThan(0);

        // Remove the first assigned contact
        const removeAssignedIcon = removeAssignedIconsLocator.first();
        await expect(removeAssignedIcon).toBeVisible({ timeout: 10000 });
        await removeAssignedIcon.click();
        await this.page.waitForTimeout(1200);
        // Wait for removal confirmation message using aria-label instead of text content
        const removalSuccessMessage = this.page.locator('div[aria-label="Removed contact assignment for 11 22"]');
        await expect(removalSuccessMessage).toBeVisible({ timeout: 10000 });
        // Re-count the icons after removal, should be fewer
        await this.page.waitForTimeout(2000);
        const finalCount = await removeAssignedIconsLocator.count();
        expect(finalCount).toBeLessThan(initialCount);

        // Clean up: Close modal if still open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(800);
    }

    // Verify lead listing details
    async verifyLeadListingDetails() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator('div.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();

        // Go to Lead tab
        const leadTab = this.page.getByRole('tab', { name: 'lead Lead' });
        await expect(leadTab).toBeVisible({ timeout: 10000 });
        await leadTab.click();

        // Look for the "New Lead" button
        const newLeadButton = this.page.getByRole('button', { name: /new lead/i });
        await expect(newLeadButton).toBeVisible({ timeout: 10000 });
        await expect(newLeadButton).toBeEnabled();
        await newLeadButton.click();

        const leadLink = this.page.locator('a').filter({ hasText: /^Lead$/ });
        await expect(leadLink).toBeVisible({ timeout: 10000 });

        const leadDetails = this.page.locator('div.popup-gray-box:has(p:text("Lead Details"))');
        await expect(leadDetails).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(2000);

        // Clean up: Close modal if still open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(800);
    }

    /**
     * Verify lead source details in the Lead Details popup for a newly created lead.
     */
    async verifyLeadSourceDetails() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator('div.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();

        // Go to Lead tab
        const leadTab = this.page.getByRole('tab', { name: 'lead Lead' });
        await expect(leadTab).toBeVisible({ timeout: 10000 });
        await leadTab.click();
        // Locate the "Lead Source" column cell for the first row in the lead table and verify it is "Billboard"
        const leadSourceCell = this.page.locator('#customentitydatalist table tbody tr').first().locator('td').nth(5);
        await expect(leadSourceCell).toHaveText(/Billboard/i, { timeout: 10000 });

        // Clean up: Close modal if still open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(800);
    }

    /**
     * Verifies that the lead list updates after a new lead is added.
     */
    async verifyLeadListUpdatesAfterAdd() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator('div.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();

        // Go to Lead tab
        const leadTab = this.page.getByRole('tab', { name: 'lead Lead' });
        await expect(leadTab).toBeVisible({ timeout: 10000 });
        await leadTab.click();

        // Wait for at least one row to appear before counting existing leads
        const leadRows = this.page.locator('#customentitydatalist table tbody tr');
        await leadRows.first().waitFor({ state: 'visible', timeout: 20000 });
        const leadCountBefore = await leadRows.count();

        // Click "New Lead" button
        const newLeadButton = this.page.getByRole('button', { name: /new lead/i });
        await expect(newLeadButton).toBeVisible({ timeout: 10000 });
        await expect(newLeadButton).toBeEnabled();
        await newLeadButton.click();

        // Click on the Lead link in the modal
        const leadLink = this.page.locator('a').filter({ hasText: /^Lead$/ });
        await expect(leadLink).toBeVisible({ timeout: 10000 });

        // Wait for Lead Details popup
        const leadDetails = this.page.locator('div.popup-gray-box:has(p:text("Lead Details"))');
        await expect(leadDetails).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(2000);

        // Select Lead Type
        const leadType = leadDetails.locator('ng-select[formcontrolname="lead_type"]');
        await leadType.click();
        await this.page.waitForTimeout(600);
        const buyerOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Buyer' });
        await expect(buyerOption).toBeVisible({ timeout: 10000 });
        await buyerOption.click();
        await this.page.waitForTimeout(600);

        // Set Lead Status
        const leadStatus = leadDetails.locator('ng-select[formcontrolname="lead_status"]');
        await expect(leadStatus).toBeVisible({ timeout: 10000 });
        await leadStatus.click();
        await this.page.waitForTimeout(600);
        const leadStatusOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'New' });
        await expect(leadStatusOption).toBeVisible({ timeout: 10000 });
        await leadStatusOption.click();
        await this.page.waitForTimeout(600);

        // Set Lead Source
        const leadSource = leadDetails.locator('ng-select[formcontrolname="lead_source"]');
        await expect(leadSource).toBeVisible({ timeout: 10000 });
        await leadSource.click();
        await this.page.waitForTimeout(600);
        const sourceOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Billboard' });
        await expect(sourceOption).toBeVisible({ timeout: 10000 });
        await sourceOption.click();
        await this.page.waitForTimeout(1000);

        // Add a tag if available
        const tagPlaceholder = this.page.locator('.d-flex > label > re-multiselect > .box > .tags');
        await tagPlaceholder.waitFor({ state: 'visible' });
        await tagPlaceholder.click();
        const searchTagInput = this.page.getByRole('textbox', { name: 'Search' }).last();
        await expect(searchTagInput).toBeVisible({ timeout: 10000 });

        const tagDropdownPanel = this.page.locator('.drop_box');
        await expect(tagDropdownPanel).toBeVisible({ timeout: 20000 });

        const tagOption = tagDropdownPanel.locator('ul li').nth(1).locator('p');
        await expect(tagOption).toBeVisible({ timeout: 20000 });
        await tagOption.click();

        // Wait for contact details section for form completeness
        const contactDetails = this.page.getByText('Email:');
        await contactDetails.waitFor({ state: 'visible' });

        // Click "Save & Close" to create the lead
        const saveAndCloseButton = this.page.getByRole('button', { name: /save & close/i }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await expect(saveAndCloseButton).toBeEnabled();
        await saveAndCloseButton.click();

        // Wait for and verify "lead added successfully" toast
        const leadAddedSuccessMsg = this.page.getByText(/lead added successfully/i);
        await expect(leadAddedSuccessMsg).toBeVisible({ timeout: 10000 });

        // Wait for the lead list to update and verify it has at least one more row than before
        const leadRowsAfter = this.page.locator('#customentitydatalist table tbody tr');
        await leadRowsAfter.first().waitFor({ state: 'visible', timeout: 20000 });
        await this.page.waitForTimeout(2500);
        const leadCountAfter = await leadRowsAfter.count();
        expect(leadCountAfter).toBeGreaterThan(leadCountBefore);

        // Clean up: Close modal if still open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(800);
    }

    /**
     * Verifies that an existing lead can be modified and updates are reflected.
     */
    async verifyLeadModification() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator('div.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();

        // Go to Lead tab
        const leadTab = this.page.getByRole('tab', { name: 'lead Lead' });
        await expect(leadTab).toBeVisible({ timeout: 10000 });
        await leadTab.click();

        // Click the edit button (assumes a pencil/edit icon exists in row)
        const firstEditBtn = this.page.locator('#customentitydatalist table tbody tr').first();
        await expect(firstEditBtn).toBeVisible({ timeout: 10000 });

        const editDialog = this.page.getByRole('cell', { name: '22' }).first();
        await expect(editDialog).toBeVisible({ timeout: 10000 });
        await editDialog.click({ force: true });

        const editButton = this.page.locator('button._addNew img[src="assets/img/pencil.svg"]').first();
        await editButton.waitFor({ state: 'visible', timeout: 20000 });
        await expect(editButton).toBeEnabled({ timeout: 20000 });
        await editButton.click();

        // Change the Lead Status (choose a valid different status, e.g., 'Contacted')
        const leadStatusSelect = this.page.locator('ng-select[formcontrolname="lead_status"]');
        await leadStatusSelect.click();
        await this.page.waitForTimeout(800);
        const contactedOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Contact started' });
        await expect(contactedOption).toBeVisible({ timeout: 10000 });
        await contactedOption.click();
        await this.page.waitForTimeout(1000);

        // Click "Save & Close" to save changes
        const saveAndCloseButton = this.page.getByRole('button', { name: /save/i }).first();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await expect(saveAndCloseButton).toBeEnabled();
        await saveAndCloseButton.click({ force: true });

        // Wait for and verify "lead updated successfully" toast message
        const leadUpdatedMsg = this.page.getByText(/lead updated successfully/i);
        await expect(leadUpdatedMsg).toBeVisible({ timeout: 20000 });
        await this.page.waitForTimeout(2000);
        // Close the lead details modal if it's still open
        const closeBtn1 = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn1.isVisible().catch(() => false)) {
            await closeBtn1.click();
        }
        await this.page.waitForTimeout(2000);
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();

        // Go to Lead tab
        const leadTab1 = this.page.getByRole('tab', { name: 'lead Lead' });
        await leadTab1.waitFor({ state: 'visible', timeout: 10000 });
        await leadTab1.click();

        // Ensure the first row is visible before checking status
        const firstRow = this.page.locator('#customentitydatalist table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 20000 });
        await this.page.waitForTimeout(2000);
        const statusCell = firstRow.locator('td').nth(4);
        await expect(statusCell).toHaveText(/Contact started/i, { timeout: 10000 });

        await this.page.waitForTimeout(1000);

        // Clean up: Close modal if still open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(800);
    }

    /**
     * Verifies that the lead status can be changed successfully and reflects in the grid.
     */
    async verifyLeadStatusChange() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator('div.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();

        // Go to Lead tab
        const leadTab = this.page.getByRole('tab', { name: 'lead Lead' });
        await expect(leadTab).toBeVisible({ timeout: 10000 });
        await leadTab.click();

        // Click the edit button (assumes a pencil/edit icon exists in row)
        const firstEditBtn = this.page.locator('#customentitydatalist table tbody tr').first();
        await expect(firstEditBtn).toBeVisible({ timeout: 30000 });

        // Verify the updated status in the table/grid
        const firstRow = this.page.locator('#customentitydatalist table tbody tr').first();
        await expect(firstRow).toBeVisible({ timeout: 10000 });
        const statusCell = firstRow.locator('td').nth(4);
        await expect(statusCell).toHaveText(/Contact started/i, { timeout: 10000 });

        // Clean up: Ensure any modal is closed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(800);
    }

    /**
     * Verifies that the lead record displays a valid date and time in the corresponding column.
     */
    async verifyLeadRecordsTimeAndDate() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator('div.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();

        // Go to Lead tab
        const leadTab = this.page.getByRole('tab', { name: 'lead Lead' });
        await expect(leadTab).toBeVisible({ timeout: 10000 });
        await leadTab.click();

        // Ensure the first row is visible
        const firstRow = this.page.locator('#customentitydatalist table tbody tr').first();
        await expect(firstRow).toBeVisible({ timeout: 10000 });

        // Locate the "Date" column by its header name to ensure correct column in case order changes
        const dateHeader = this.page.locator('#customentitydatalist table thead tr th').filter({ hasText: /date/i }).first();
        const dateHeaderIndex = await dateHeader.evaluate((el: HTMLElement) => {
            const cells = Array.from(el.parentElement!.children);
            return cells.indexOf(el);
        });
        const dateCell = firstRow.locator('td').nth(dateHeaderIndex);
        await expect(dateCell).toBeVisible({ timeout: 10000 });

        const cellText = (await dateCell.textContent())?.trim() || '';
        console.log('Date cell text:', cellText);

        expect(cellText).toMatch(/^\d{2}\/\d{2}\/\d{2}$/);


        // Clean up: Ensure any modal is closed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(800);
    }

    /**
     * Verifies navigation between tabs on the listing detail page.
     * Checks that each main tab is accessible and visible after navigation.
     */
    async verifyNavigationBetweenTabs() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator('div.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();

        // Go to Lead tab
        const leadTab = this.page.getByRole('tab', { name: 'lead Lead' });
        await expect(leadTab).toBeVisible({ timeout: 10000 });
        await leadTab.click();

        // Ensure the first row is visible
        const firstRow = this.page.locator('#customentitydatalist table tbody tr').first();
        await expect(firstRow).toBeVisible({ timeout: 10000 });

        // Click on the Calendar tab
        const calendarTab = this.page.getByRole('tab', { name: /calendar/i });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();
        await leadTab.click();
        await expect(firstRow).toBeVisible({ timeout: 10000 });
        // Clean up: Close modal if open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(800);
    }

    /**
     * Verifies that the Tasks tab displays existing task records.
     */
}
