import { Page, Locator, expect } from '@playwright/test';
import { ContactBasePage } from './ContactBasePage';
import { faker } from '@faker-js/faker';

export class ContactLeadPage extends ContactBasePage {
    async openLead(): Promise<void> {
        const leadTab = this.page.getByRole('tab', { name: /Lead/i });
        await leadTab.waitFor({ state: 'visible' });
        await leadTab.click();
    }

    async openLeadTab() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openLead();
        await this.closeModalIfVisible();
    }

    /**
     * Verify new lead button
     */
    async verifyNewLeadButton(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openLead();
        const newLeadButton = this.page.getByRole('button', { name: /New Lead/i });
        await newLeadButton.waitFor({ state: 'visible' });
        await expect(newLeadButton).toBeEnabled();
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that a lead appears in the Lead tab/module after creation.
     */
    async verifyLeadAppearsInLeadModule(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.leadCreation();
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that clicking the contact name in the Lead tab opens the contact form in a new browser tab.
     */
    async verifyContactNameOpensInNewTab(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openLead();

        const newLeadButton = this.page.getByRole('button', { name: /new lead/i });
        await newLeadButton.waitFor({ state: 'visible' });
        await expect(newLeadButton).toBeEnabled();
        await newLeadButton.click();

        const leadLink = this.page.locator('a').filter({ hasText: /^Lead$/ });
        await leadLink.waitFor({ state: 'visible' });
        const leadDiv = this.page.locator('div').filter({ hasText: /^11 22$/ }).nth(2);
        await leadDiv.waitFor({ state: 'visible' });
        const nameConst = this.page.getByText('11 22', { exact: true }).nth(3);
        await nameConst.click();
        const contactTypeLocator = this.page.locator('[id="Contact - 11 22_2"]').getByText('12 Contact TypeSelect Type×');
        await contactTypeLocator.waitFor({ state: 'visible' });
        await this.closeModalIfVisible();
    }

    /**
     * Verifies the details and status of a lead in the Lead tab/module.
     */
    async verifyLeadStatusDetails(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openLead();

        const firstLeadRow = this.page.locator('#customentitydatalist table tbody tr').first();
        await firstLeadRow.waitFor({ state: "visible" });

        // Verify "Date" cell
        const dateCell = firstLeadRow.locator('td').nth(1);
        await expect(dateCell).toBeVisible();
        const dateText = await dateCell.textContent();
        if (!dateText || !dateText.trim()) {
            throw new Error("Lead 'Date' cell is empty or not found.");
        }

        // Verify "Status" cell (should be 'New')
        const statusCell = firstLeadRow.locator('td').nth(2);
        await expect(statusCell).toBeVisible();
        const statusText = await statusCell.textContent();
        if (!statusText || !statusText.trim()) {
            throw new Error("Lead 'Status' cell is empty or not found.");
        }

        // Verify "Lead Source" cell (should be 'Billboard')
        const leadSourceCell = firstLeadRow.locator('td').nth(4);
        await expect(leadSourceCell).toBeVisible();
        const leadSourceText = await leadSourceCell.textContent();
        if (!leadSourceText || !leadSourceText.trim()) {
            throw new Error("Lead 'Lead Source' cell is empty or not found.");
        }

        // Verify "Name" cell
        const nameCell = firstLeadRow.locator('td').nth(5);
        await expect(nameCell).toBeVisible();
        const nameText = await nameCell.textContent();
        if (!nameText || !nameText.trim()) {
            throw new Error("Lead 'Name' cell is empty or not found.");
        }

        await this.closeModalIfVisible();
    }

    /**
     * Verify duplicate lead creation
     */
    async verifyDuplicateLeadCreation() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openLead();

        // Verify the first table row is visible after saving new lead
        const firstTableRow = this.page.locator('#customentitydatalist table tbody tr').first();
        await firstTableRow.waitFor({ state: 'visible' });
        // Wait for duplicate icons to appear before the click
        const duplicateIconsLocator = this.page.locator('i[ptooltip="Duplicate"].pi.pi-clone');
        await duplicateIconsLocator.first().waitFor({ state: 'visible' });
        const initialCount = await duplicateIconsLocator.count();
        expect(initialCount).toBeGreaterThan(0);

        // Click the first duplicate icon
        const duplicateIcon = duplicateIconsLocator.first();
        await duplicateIcon.waitFor({ state: 'visible' });
        await duplicateIcon.click();

        // Wait for the success message after duplication
        const duplicateSuccessMessage = this.page.getByText('Duplicated', { exact: true });
        await duplicateSuccessMessage.waitFor({ state: 'visible' });
        await duplicateSuccessMessage.waitFor({ state: 'hidden' });

        // Count the duplicate icons again after duplication
        const finalCount = await duplicateIconsLocator.count();
        expect(finalCount).toBeGreaterThan(initialCount);

        await this.closeModalIfVisible();
    }

    /**
     * Verify lead source details 
     */
    async verifyLeadSourceDetails() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openLead();
        const firstRow = this.page.locator('#customentitydatalist table tbody tr').first();
        await firstRow.waitFor({ state: 'visible' });
        const leadSourceCell = firstRow.locator('td').nth(4);
        await leadSourceCell.waitFor({ state: 'visible' });
        const leadSourceText = await leadSourceCell.textContent();
        if (!leadSourceText || !/Billboard/i.test(leadSourceText)) {
            throw new Error("Lead 'Lead Source' cell does not show value 'Billboard'.");
        }
        await this.closeModalIfVisible();
    }

    /**
     * Verify duplicate lead creation does not merge records
     */
    async verifyDuplicateLeadDoesNotMergeRecords() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openLead();

        // Count the number of rows before duplication
        const tableRowsLocator = this.page.locator('#customentitydatalist table tbody tr');
        await tableRowsLocator.first().waitFor({ state: 'visible' });
        const initialRowCount = await tableRowsLocator.count();

        // Count duplicate icons before duplication
        const duplicateIconsLocator = this.page.locator('i[ptooltip="Duplicate"].pi.pi-clone');
        await duplicateIconsLocator.first().waitFor({ state: 'visible' });
        const initialDuplicateCount = await duplicateIconsLocator.count();
        expect(initialDuplicateCount).toBeGreaterThan(0);

        // Click the first duplicate icon
        const duplicateIcon = duplicateIconsLocator.first();
        await duplicateIcon.waitFor({ state: 'visible' });
        await duplicateIcon.click();

        // Wait for success message after duplication
        const duplicateSuccessMessage = this.page.getByText('Duplicated', { exact: true });
        await duplicateSuccessMessage.waitFor({ state: 'visible' });
        await duplicateSuccessMessage.waitFor({ state: 'hidden' });

        const finalRowCount = await tableRowsLocator.count();
        const finalDuplicateCount = await duplicateIconsLocator.count();
        if (finalRowCount < initialRowCount) {
            throw new Error("Duplicate lead creation did not add a new record, possible merge occurred.");
        }
        await expect(finalDuplicateCount).toBeGreaterThan(initialDuplicateCount);
        await this.closeModalIfVisible();
    }

    /**
     * Verify that the lead list updates after a new lead is added.
     */
    async verifyLeadListUpdatesAfterAdd() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.leadCreation();
        await this.closeModalIfVisible();
    }

    /**
     * Opens the contact with the name "AA AA".
     * Navigates to Contacts, searches for "AA AA", and opens the contact details page.
     */
    async openContactByNameAA() {
        const contactRow = this.page.locator('tr').filter({ hasText: 'AA AA' }).first();
        await contactRow.waitFor({ state: 'visible' });
        await contactRow.click();
    }
    async clickFirstLeadTableRow() {
        const tableRowsLocator = this.page.locator('#customentitydatalist table tbody tr');
        await tableRowsLocator.first().waitFor({ state: 'visible' });
        const firstRow = tableRowsLocator.first();
        await firstRow.click();
    }

    async clickLeadEditIcon() {
        const editIcon = this.page.locator('button[data-help-target="lead-detail-edit-toggle"]').first();
        await expect(editIcon).toBeVisible({timeout: 30000});
        await editIcon.click();
        await this.page.waitForTimeout(1000);
    }

    async clickSaveButton() {
        const saveButton = this.page.getByRole('button', { name: 'Save' });
        await saveButton.waitFor({ state: 'visible' });
        await saveButton.click({ force: true });
    }
    // Success message for lead update
    async waitForLeadUpdatedSuccessMessage() {
        const successMessageLocator = this.page.getByText('Lead updated successfully', { exact: true });
        await successMessageLocator.waitFor({ state: 'visible' });
        await successMessageLocator.waitFor({ state: 'hidden' });
    }

    /**
     * Closes the lead modal window if it is visible.
     */
    async closeLeadModalIfVisible() {
        const closeBtn = this.page.locator('i.p-element.pi.pi-times.ml-2.f-12.cursor-pointer').nth(1);
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    /**
     * Verify lead's listing or project details are correctly displayed for a contact.
     */
    async verifyLeadListingProjectDetails() {
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
        const newOption = this.page.getByRole('option', { name: 'New' });
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
        await this.waitForLeadUpdatedSuccessMessage();
        await this.closeLeadModalIfVisible();
        const tableRow = this.page.locator('#customentitydatalist table tbody tr').first();
        await tableRow.waitFor({ state: 'visible' });
        const projects = tableRow.locator('td').nth(3);
        await projects.waitFor({ state: 'visible' });
        const projectsText = await projects.textContent();
        if (!projectsText || !/East Village Vila/i.test(projectsText)) {
            throw new Error("Lead 'Lead Source' cell does not show value 'East Village Vila'.");
        }
        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verifies that the lead was successfully modified by checking all cell values in the grid.
     */
    async verifyLeadModification() {

        await this.NavigateToContacts();
        await this.openContactByNameAA();
        const firstStreamRecord = this.page.locator('div.stream-body').first();
        await firstStreamRecord.waitFor({ state: 'visible' });
        await this.openLead();

        const tableRow = this.page.locator('#customentitydatalist table tbody tr').first();
        await tableRow.waitFor({ state: 'visible' });

        // Lead Status
        const leadStatusCell = tableRow.locator('td').nth(2);
        await leadStatusCell.waitFor({ state: 'visible' });
        const leadStatusText = (await leadStatusCell.textContent())?.trim() || '';
        if (!/New/i.test(leadStatusText)) {
            throw new Error("Lead 'Status' cell does not show value 'New'.");
        }

        // Project
        const projectCell = tableRow.locator('td').nth(3);
        await projectCell.waitFor({ state: 'visible' });
        const projectText = (await projectCell.textContent())?.trim() || '';
        if (!/East Village Vila/i.test(projectText)) {
            throw new Error("Lead 'Project' cell does not show value 'East Village Vila'.");
        }

        // Lead Source
        const leadSourceCell = tableRow.locator('td').nth(4);
        await leadSourceCell.waitFor({ state: 'visible' });
        const leadSourceText = (await leadSourceCell.textContent())?.trim() || '';
        if (!/Billboard/i.test(leadSourceText)) {
            throw new Error("Lead 'Source' cell does not show value 'Billboard'.");
        }

        // Owner
        const ownerCell = tableRow.locator('td').nth(5);
        await ownerCell.waitFor({ state: 'visible' });
        const ownerText = (await ownerCell.textContent())?.trim() || '';
        if (!/jahanzaib xenex/i.test(ownerText)) {
            throw new Error("Lead 'Owner' cell does not show value 'jahanzaib xenex'.");
        }

        await this.closeModalIfVisible();


    }

    /**
     * Verifies that the lead status has changed in the grid.
     */
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

    /**
     * Verifies the lead record's created time and date in the contact table.
     */
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

    /**
     * Verify navigation between tabs
     */
    async verifyNavigationBetweenTabsAndLeadPresence() {
        await this.NavigateToContacts();
        await this.openContactByNameAA();
        const tasksTab = this.page.getByRole('tab', { name: /Tasks/i });
        await tasksTab.waitFor({ state: 'visible' });
        await tasksTab.click();
        await this.openLead();
        const leadTableRows = this.page.locator('#customentitydatalist table tbody tr');
        await leadTableRows.first().waitFor({ state: 'visible' });
        await this.closeModalIfVisible();
    }

    /**
     * Verify that clicking the new lead button opens the lead form.
     */
}
