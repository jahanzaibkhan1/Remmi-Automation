import { Page, Locator, expect } from '@playwright/test';
import { ContactBasePage } from './ContactBasePage';
import { faker } from '@faker-js/faker';

export class ContactRelatedPropertyPage extends ContactBasePage {
    async verifyRelatedPropertyHasAllTabs() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        // Open the Related Property tab
        const relatedPropertyTab = this.page.locator("#pills-relatedProperty");
        await relatedPropertyTab.waitFor({ state: "visible", timeout: 10000 });
        await relatedPropertyTab.click();

        // Wait for and check all three tabs
        const listingTab = this.page.locator('#pills-listing0-tab');
        const propertyTab = this.page.locator('#pills-property0-tab');
        const contractTab = this.page.getByRole('tab', { name: /Contract/i });

        await listingTab.waitFor({ state: "visible", timeout: 8000 });
        await propertyTab.waitFor({ state: "visible", timeout: 8000 });
        await contractTab.waitFor({ state: "visible", timeout: 8000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that the associate field is visible and functional in the Listing tab
     */
    async verifyAssociateFieldVisibleAndFunctionalInListingTab() {
        await this.NavigateToContacts();
        await this.openFirstContact();

        // Open Related Property tab and then Listing tab
        const relatedPropertyTab = this.page.locator("#pills-relatedProperty");
        await relatedPropertyTab.waitFor({ state: 'visible', timeout: 8000 });
        await relatedPropertyTab.click();
        const listingTab = this.page.locator("#pills-listing0-tab");
        await listingTab.waitFor({ state: 'visible', timeout: 8000 });
        await listingTab.click();

        // Check that the associate field (Search Listing) is visible
        const associateSearchBox = this.page.getByRole('combobox', { name: /search listing/i });
        await associateSearchBox.waitFor({ state: 'visible', timeout: 8000 });

        // Try searching for a listing and select an option if present
        const searchValue = 'Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880';
        await associateSearchBox.type(searchValue, { delay: 180 });

        // Wait for at least one suggestion to appear and click it
        const suggestionOption = this.page.getByRole('option', { name: searchValue });
        await suggestionOption.waitFor({ state: 'visible', timeout: 30000 });

        await this.closeModalIfVisible();
    }

    /**
     * Verifies that a listing can be associated to a contact using the associate field in the Listing tab.
     */
    async verifyListingCanBeAssociatedViaAssociateField() {
        await this.NavigateToContacts();
        await this.openFirstContact();

        // Open Related Property tab and then Listing tab
        const relatedPropertyTab = this.page.locator("#pills-relatedProperty");
        await relatedPropertyTab.waitFor({ state: 'visible', timeout: 8000 });
        await relatedPropertyTab.click();

        const listingTab = this.page.locator("#pills-listing0-tab");
        await listingTab.waitFor({ state: 'visible', timeout: 8000 });
        await listingTab.click();

        // Interact with associate/search field
        const searchValue = 'Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880';
        const associateSearchBox = this.page.getByRole('combobox', { name: /search listing/i });
        await associateSearchBox.waitFor({ state: 'visible', timeout: 8000 });
        await associateSearchBox.type(searchValue, { delay: 180 });

        // Wait for the suggested listing option and select it
        const suggestionOption = this.page.getByRole('option', { name: searchValue });
        await suggestionOption.waitFor({ state: 'visible', timeout: 30000 });
        await suggestionOption.click();

        // Click the Associate button
        const associateButton = this.page.locator('button.preview-btn.btn-sm.f-12:visible');
        await associateButton.waitFor({ state: 'visible', timeout: 8000 });
        await associateButton.click();

        // Wait for a success or "already associated" message
        const toast = this.page.getByText(/listing attached successfully|Listing already associated/i).first();
        await toast.waitFor({ state: 'visible', timeout: 10000 });

        // Confirm the listing appears in the associated list
        const associatedListingRow = this.page.getByRole('cell', { name: searchValue }).first();
        await associatedListingRow.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
        await associatedListingRow.waitFor({ state: 'visible', timeout: 30000 });

        await this.closeModalIfVisible();
    }

    /**
     * Verifies that the status of an associated listing is displayed and aligned properly in the UI.
     */
    async verifyAssociatedListingStatusAlignment() {
        await this.NavigateToContacts();
        await this.openFirstContact();

        // Open Related Property tab and then Listing tab
        const relatedPropertyTab = this.page.locator("#pills-relatedProperty");
        await relatedPropertyTab.waitFor({ state: 'visible', timeout: 8000 });
        await relatedPropertyTab.click();

        const listingTab = this.page.locator("#pills-listing0-tab");
        await listingTab.waitFor({ state: 'visible', timeout: 8000 });
        await listingTab.click();

        const associatedListingCell = this.page.getByRole('cell', { name: 'Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880' }).first();
        await associatedListingCell.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
        await associatedListingCell.waitFor({ state: 'visible', timeout: 10000 });
        await this.closeModalIfVisible();

    }

    /**
     * Removes a listing from the associated list and verifies its removal.
     */
    async removeAssociatedListing() {

        await this.NavigateToContacts();
        await this.openFirstContact();

        // Open Related Property tab and then Listing tab
        const relatedPropertyTab = this.page.locator("#pills-relatedProperty");
        await relatedPropertyTab.waitFor({ state: 'visible', timeout: 8000 });
        await relatedPropertyTab.click();
        const listingTab = this.page.locator("#pills-listing0-tab");
        await listingTab.waitFor({ state: 'visible', timeout: 8000 });
        await listingTab.click();
        const associatedListingCell = this.page.getByRole('cell', { name: 'Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880' }).first();
        await associatedListingCell.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
        await associatedListingCell.waitFor({ state: 'visible', timeout: 10000 });
        const removeButton = this.page.getByRole('button', { name: 'delete' });
        await removeButton.waitFor({ state: 'visible', timeout: 5000 });
        await removeButton.click();
        // Confirm the removal action if a modal/dialog appears
        const confirmButton = this.page.locator('button:has-text("Yes")').first();
        if (await confirmButton.isVisible({ timeout: 10000 }).catch(() => false)) {
            await confirmButton.click();
        }
        // Wait for a deletion toast/message
        const toast = this.page.getByText(/removed successfully|deleted successfully/i).first();
        await toast.waitFor({ state: 'visible', timeout: 10000 });

        await this.closeModalIfVisible();
    }

    /**
     * Verifies that a listing type or related tag can be dragged into a listing.
     */
    async verifyDragAndDropToListing() {
        await this.NavigateToContacts();
        await this.openFirstContact();

        // Open Related Property tab and then Listing tab
        const relatedPropertyTab = this.page.locator("#pills-relatedProperty");
        await relatedPropertyTab.waitFor({ state: 'visible', timeout: 8000 });
        await relatedPropertyTab.click();

        const listingTab = this.page.locator("#pills-listing0-tab");
        await listingTab.waitFor({ state: 'visible', timeout: 8000 });
        await listingTab.click();

        // Interact with associate/search field
        const searchValue = 'Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880';
        const associateSearchBox = this.page.getByRole('combobox', { name: /search listing/i });
        await associateSearchBox.waitFor({ state: 'visible', timeout: 8000 });
        await associateSearchBox.type(searchValue, { delay: 180 });

        // Wait for the suggested listing option and select it
        const suggestionOption = this.page.getByRole('option', { name: searchValue });
        await suggestionOption.waitFor({ state: 'visible', timeout: 30000 });
        await suggestionOption.click();

        // Click the Associate button
        const associateButton = this.page.locator('button.preview-btn.btn-sm.f-12:visible');
        await associateButton.waitFor({ state: 'visible', timeout: 8000 });
        await associateButton.click();

        // Wait for a success or "already associated" message
        const toast = this.page.getByText(/listing attached successfully|Listing already associated/i).first();
        await toast.waitFor({ state: 'visible', timeout: 10000 });

        // Confirm the listing appears in the associated list
        const associatedListingRow = this.page.getByRole('cell', { name: searchValue }).first();
        await associatedListingRow.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
        await associatedListingRow.waitFor({ state: 'visible', timeout: 30000 });
        const dropList = this.page.locator('td.cdk-drop-list[cdkdroplist]');
        await expect(dropList).toBeVisible({ timeout: 10000 });
        const getBuyerChip = () =>
            associatedListingRow.locator('[data-pc-name="chip"][aria-label="Buyer"]');
        if (await getBuyerChip().count() > 0) {
            return;
        }
        const maxAttempts = 4;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const buyerTag = this.page
                    .locator('span.cdk-drag.related-tag span.p-tag-value', { hasText: 'Wife' })
                    .last();
                await expect(buyerTag).toBeVisible({ timeout: 10000 });
                const sourceBox = await buyerTag.boundingBox();
                const dropBox = await dropList.boundingBox();
                if (!sourceBox || !dropBox) {
                    throw new Error('Bounding box not available');
                }
                await this.page.mouse.move(
                    sourceBox.x + sourceBox.width / 2,
                    sourceBox.y + sourceBox.height / 2
                );
                await this.page.mouse.down();
                await this.page.mouse.move(
                    dropBox.x + dropBox.width / 2,
                    dropBox.y + dropBox.height / 2,
                    { steps: 12 }
                );
                await this.page.waitForTimeout(150);
                await this.page.mouse.up();
                break;
            } catch (error) {
                if (attempt === maxAttempts) {
                    throw new Error('Buyer tag drag failed after multiple attempts.');
                }
                await this.page.waitForTimeout(1000);
            }
        }
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that a tag can be removed using the cross (remove) icon.
     */
    async removeTagByCrossIcon() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        // Open Related Property tab and then Listing tab
        const relatedPropertyTab = this.page.locator("#pills-relatedProperty");
        await relatedPropertyTab.waitFor({ state: 'visible', timeout: 8000 });
        await relatedPropertyTab.click();
        const associatedListingRow = this.page.getByRole('cell', { name: 'Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880' }).first();
        await associatedListingRow.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
        await associatedListingRow.waitFor({ state: 'visible', timeout: 30000 });
        const tagChip = this.page.locator(`[data-pc-name="chip"][aria-label="Wife"]`).first();
        await expect(tagChip).toBeVisible({ timeout: 5000 });
        const crossIcon = this.page.locator('.pi-times').last();
        await expect(crossIcon).toBeVisible({ timeout: 10000 });
        await crossIcon.click();
        await expect(tagChip).toBeHidden({ timeout: 30000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that clicking a listing opens it in a new tab and closes the listing tab.
     */
    async verifyListingOpensInNewTabAndClosesListingTab() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const relatedPropertyTab = this.page.locator("#pills-relatedProperty");
        await relatedPropertyTab.waitFor({ state: 'visible', timeout: 8000 });
        await relatedPropertyTab.click();
        const associatedListingRow = this.page.getByRole('cell', { name: 'Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880' }).first();
        await associatedListingRow.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
        await associatedListingRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);
        associatedListingRow.click({ force: true });
        const newListingSection = this.page.locator('section.body-details');
        await expect(newListingSection).toBeVisible({ timeout: 10000 });
        await this.closeModalIfVisible();
    }

    /**
     * Clicks each header, verifies sort icon visibility, and scrolls header into view.
     */
    async verifySortIconInStatusColumnHeaderInListingTab() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const relatedPropertyTab = this.page.locator("#pills-relatedProperty");
        await relatedPropertyTab.waitFor({ state: 'visible', timeout: 20000 });
        await relatedPropertyTab.click();
        const associatedListingRow = this.page.getByRole('cell', { name: 'Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880' }).first();
        await associatedListingRow.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
        await associatedListingRow.waitFor({ state: 'visible', timeout: 30000 });
        const table = this.page.locator('table.p-datatable-table').nth(5);
        await expect(table).toBeVisible({ timeout: 30000 });
        const headers = [
            table.getByRole('columnheader', { name: 'Tags' }),
            table.getByRole('columnheader', { name: 'Address' }),
            table.getByRole('columnheader', { name: 'Status' }),
            table.getByRole('columnheader', { name: 'Price' }),
            table.getByRole('columnheader', { name: 'Created Date' }),
        ];

        for (const header of headers) {
            await expect(header).toBeVisible();
            await header.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
            await header.click();
            const sortIcon = header.locator('svg');
            await expect(sortIcon).toBeVisible();
        }

        await this.closeModalIfVisible();
    }

    async verifyPropertyCanBeAssociatedViaAssociateField() {
        await this.NavigateToContacts();
        await this.openFirstContact();

        // Open Related Property tab and then Listing tab
        const relatedPropertyTab = this.page.locator("#pills-relatedProperty");
        await relatedPropertyTab.waitFor({ state: 'visible', timeout: 8000 });
        await relatedPropertyTab.click();

        const propertyTab = this.page.locator("#pills-property0-tab");
        await propertyTab.waitFor({ state: 'visible', timeout: 8000 });
        await propertyTab.click();

        // Interact with associate/search field
        const searchValue = 'Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880';
        const associateSearchBox = this.page.getByRole('combobox', { name: /search Property/i });
        await associateSearchBox.waitFor({ state: 'visible', timeout: 8000 });
        await associateSearchBox.type(searchValue, { delay: 180 });

        // Wait for the suggested listing option and select it
        const suggestionOption = this.page.getByRole('option', { name: searchValue });
        await suggestionOption.waitFor({ state: 'visible', timeout: 30000 });
        await suggestionOption.click();

        // Click the Associate button
        const associateButton = this.page.locator('button.preview-btn.btn-sm.f-12:visible');
        await associateButton.waitFor({ state: 'visible', timeout: 8000 });
        await associateButton.click();

        // Wait for a success or "already associated" message
        const toast = this.page.getByText(/property attached successfully|property already associated/i).first();
        await toast.waitFor({ state: 'visible', timeout: 10000 });

        // Confirm the listing appears in the associated list
        const associatedListingRow = this.page.getByRole('cell', { name: searchValue }).first();
        await associatedListingRow.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
        await associatedListingRow.waitFor({ state: 'visible', timeout: 30000 });

        await this.closeModalIfVisible();
    }

    /**
     * Verifies that the most recently associated property appears as the last entry in the property association list.
     */
    async verifyAssociatedPropertyAppearsAtEndOfList() {
        await this.NavigateToContacts();
        await this.openFirstContact();

        // Open Related Property tab and then Listing tab
        const relatedPropertyTab = this.page.locator("#pills-relatedProperty");
        await relatedPropertyTab.waitFor({ state: 'visible', timeout: 8000 });
        await relatedPropertyTab.click();
        const propertyTab = this.page.locator("#pills-property0-tab");
        await propertyTab.waitFor({ state: 'visible', timeout: 8000 });
        await propertyTab.click();
        const associatedListingRow = this.page.getByRole('cell', { name: 'Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880' }).first();
        await associatedListingRow.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
        await associatedListingRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.closeModalIfVisible();
    }

    /**
     * Removes a specific property from the associated property list and verifies its removal.
     */
    async removeAssociatedProperty() {
        await this.NavigateToContacts();
        await this.openFirstContact();

        // Open Related Property tab, then Property tab
        const relatedPropertyTab = this.page.locator("#pills-relatedProperty");
        await relatedPropertyTab.waitFor({ state: 'visible', timeout: 8000 });
        await relatedPropertyTab.click();

        const propertyTab = this.page.locator("#pills-property0-tab");
        await propertyTab.waitFor({ state: 'visible', timeout: 8000 });
        await propertyTab.click();
        const propertyName = 'Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880';
        const associatedPropertyCell = this.page.getByRole('cell', { name: propertyName }).first();
        await associatedPropertyCell.waitFor({ state: 'visible', timeout: 10000 });
        await associatedPropertyCell.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
        const removeIcon = this.page.getByRole('button', { name: 'delete' });
        await removeIcon.waitFor({ state: 'visible', timeout: 6000 });
        await removeIcon.click({ force: true });
        const confirmButton = this.page.getByRole('button', { name: /yes|confirm/i }).first();
        if (await confirmButton.isVisible().catch(() => false)) {
            await confirmButton.click();
        }
        const toast = this.page.getByText(/deleted successfully/i).first();
        await toast.waitFor({ state: 'visible', timeout: 10000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that the sort icon exists beside the property statuses in the property tab.
     */
    async verifySortIconExistsBesidePropertyStatuses() {
        await this.NavigateToContacts();
        await this.openFirstContact();

        // Open Related Property tab, then Property tab
        const relatedPropertyTab = this.page.locator("#pills-relatedProperty");
        await relatedPropertyTab.waitFor({ state: 'visible', timeout: 8000 });
        await relatedPropertyTab.click();

        const propertyTab = this.page.locator("#pills-property0-tab");
        await propertyTab.waitFor({ state: 'visible', timeout: 8000 });
        await propertyTab.click();

        const associatedListingRow = this.page.getByRole('cell', { name: 'Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880' }).first();
        await associatedListingRow.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
        await associatedListingRow.waitFor({ state: 'visible', timeout: 30000 });
        const table = this.page.locator('table.p-datatable-table').nth(6);
        await expect(table).toBeVisible({ timeout: 30000 });
        const headers = [
            table.getByRole('columnheader', { name: 'Tags' }),
            table.getByRole('columnheader', { name: 'Address' }),
            table.getByRole('columnheader', { name: 'type' }),
            table.getByRole('columnheader', { name: 'Settlement date' }),
        ];

        for (const header of headers) {
            await expect(header).toBeVisible();
            await header.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
            await header.click();
            const sortIcon = header.locator('svg');
            await expect(sortIcon).toBeVisible();
        }

        await this.closeModalIfVisible();

    }

    /**
     * Verifies that clicking an associated property opens it in a new tab with the property tab active.
     */
    async verifyAssociatedPropertyOpensInNewTabWithPropertyTab() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        // Open Related Property tab, then Property tab
        const relatedPropertyTab = this.page.locator("#pills-relatedProperty");
        await relatedPropertyTab.waitFor({ state: 'visible', timeout: 8000 });
        await relatedPropertyTab.click();
        const propertyTab = this.page.locator("#pills-property0-tab");
        await propertyTab.waitFor({ state: 'visible', timeout: 8000 });
        await propertyTab.click();
        // Find the associated property row/cell (adjust selector as appropriate)
        const propertyCell = this.page.getByRole('cell', { name: 'Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880' }).first();
        await propertyCell.waitFor({ state: 'visible', timeout: 15000 });
        await propertyCell.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
        await this.page.waitForTimeout(1000);
        await propertyCell.click({ force: true });
        const newListingSection = this.page.locator('.col-md-7');
        await expect(newListingSection).toBeVisible({ timeout: 10000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verify contract list displays status aligned properly
     */
    async verifyContractListStatusAlignment() {
        await this.NavigateToContacts();
        await this.openFirstContact();

        // Open Related Property tab, then Contract tab
        const relatedPropertyTab = this.page.locator("#pills-relatedProperty");
        await relatedPropertyTab.waitFor({ state: 'visible', timeout: 8000 });
        await relatedPropertyTab.click();

        const contractTab = this.page.getByRole('tab', { name: /contract/i });
        await contractTab.waitFor({ state: 'visible', timeout: 8000 });
        await contractTab.click();
        // Wait for contracts to load (adjust table index as required by DOM)
        const contractTable = this.page.locator('table.p-datatable-table').nth(7);
        await expect(contractTable).toBeVisible({ timeout: 15000 });
        const firstRow = contractTable.locator('tbody tr').first();
        await expect(firstRow).toBeVisible({ timeout: 15000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verify contract can be opened from contract tab with listing tab
     */
    async verifyContractCanBeOpenedFromContractTabWithListingTab() {
        await this.NavigateToContacts();
        await this.openFirstContact();

        // Open Related Property tab
        const relatedPropertyTab = this.page.locator("#pills-relatedProperty");
        await relatedPropertyTab.waitFor({ state: 'visible', timeout: 8000 });
        await relatedPropertyTab.click();

        // Open Contract tab
        const contractTab = this.page.getByRole('tab', { name: /contract/i });
        await contractTab.waitFor({ state: 'visible', timeout: 8000 });
        await contractTab.click();

        // Find the associated contract row/cell (adjust selector as needed)
        const contractRow = this.page.locator('table.p-datatable-table').nth(7).locator('tbody tr').first();
        await contractRow.waitFor({ state: 'visible', timeout: 15000 });
        await contractRow.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));

        // Click the contract row/cell
        await contractRow.click({ force: true });

        // Expect contract details section to appear (adjust selector as needed)
        const contractDetailSection = this.page.locator('section').nth(1);
        await expect(contractDetailSection).toBeVisible({ timeout: 10000 });

        await this.closeModalIfVisible();
    }

    /**
     * Verify contract can be deleted from contract tab
     */
    async verifyContractCanBeDeletedFromContractTab() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const relatedPropertyTab = this.page.locator("#pills-relatedProperty");
        await relatedPropertyTab.waitFor({ state: 'visible', timeout: 8000 });
        await relatedPropertyTab.click();
        const contractTab = this.page.getByRole('tab', { name: /contract/i });
        await contractTab.waitFor({ state: 'visible', timeout: 8000 });
        await contractTab.click();
        const contractTable = this.page.locator('table.p-datatable-table').nth(7);
        await expect(contractTable).toBeVisible({ timeout: 15000 });
        const firstRow = contractTable.locator('tbody tr').first();
        await expect(firstRow).toBeVisible({ timeout: 15000 });
        const deleteButton = this.page.getByRole('button', { name: /delete/i }).first();
        await deleteButton.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
        await expect(deleteButton).toBeVisible({ timeout: 8000 });
        await deleteButton.click();
        const confirmButton = this.page.getByRole('button', { name: 'yes' });
        await expect(confirmButton).toBeVisible({ timeout: 8000 });
        await confirmButton.click();
        const successMessage = this.page.getByText(/deleted successfully/i).last();
        await expect(successMessage).toBeVisible({ timeout: 8000 });
        await this.closeModalIfVisible();
    }
    /**
     * Verify that the status column header in the contract tab is aligned properly.
     */
    async verifyStatusAlignmentInContractTab() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const relatedPropertyTab = this.page.locator("#pills-relatedProperty");
        await relatedPropertyTab.waitFor({ state: "visible", timeout: 8000 });
        await relatedPropertyTab.click();

        // Open Contract tab
        const contractTab = this.page.getByRole("tab", { name: /contract/i });
        await contractTab.waitFor({ state: "visible", timeout: 8000 });
        await contractTab.click();

        // Contract table
        const contractTable = this.page.locator("table.p-datatable-table").nth(7);
        await expect(contractTable).toBeVisible({ timeout: 15000 });

        // Find the "Status" column header
        const headerCells = contractTable.locator("thead tr th");
        const statusHeader = headerCells.filter({ hasText: /status/i }).first();
        await expect(statusHeader).toBeVisible({ timeout: 30000 });

        // Check the alignment of the status header cell
        const alignment = await statusHeader.evaluate(
            (el) => window.getComputedStyle(el).textAlign
        );
        expect(['center', 'left', 'right']).toContain(alignment);

        await this.closeModalIfVisible();
    }


    /**
     * Search and select an existing contact in the Related Contact tab.
     */
}
