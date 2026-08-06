import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../common/BasePage';
import { ContactLocators } from './ContactLocators';
import { faker } from '@faker-js/faker';

export abstract class ContactBasePage extends BasePage {
    protected locators: ContactLocators;

    constructor(page: Page) {
        super(page);
        this.locators = new ContactLocators(page);
    }

    async NavigateToContacts() {
        const contact = this.locators.Contacts();
        await contact.waitFor({ state: 'visible', timeout: 10000 })
        await contact.click();
    }

    async NavigateToContact() {
        const targetUrl = '/setting/office-contact';
        // Only navigate if not already on the contacts page
        if (!this.page.url().includes(targetUrl)) {
            await this.page.goto(targetUrl);
        }
    }



    async openFirstContact(): Promise<void> {
        const firstContactRow = this.page.locator('tbody tr').first();
        await firstContactRow.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(1000);
        const firstCell = this.page.locator('td').nth(1);
        const elementHandle = await firstCell.elementHandle();
        if (elementHandle) {
            await this.page.evaluate((el) => {
                el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
            }, elementHandle);
        }
        await firstCell.click();

        await this.openStreamTab();
    }
    async openTasksTab(): Promise<void> {
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await tasksTab.waitFor({ state: 'visible' });
        await tasksTab.click();
        const addTaskButton = this.page.getByRole('button', { name: /Add Task|New Task/i });
        await addTaskButton.waitFor({ state: 'visible' });
        await addTaskButton.click();
    }
    async taskData(taskTitle: string = 'Testing Task') {
        const taskTitleInput = this.page.locator('input[formcontrolname="title"]').first();
        await taskTitleInput.waitFor({ state: "visible" });
        await taskTitleInput.fill(taskTitle);

        const dateInput = this.page.locator('p-calendar[formcontrolname="due_date"] input');
        await dateInput.waitFor({ state: "visible" });
        await dateInput.click();

        const t = new Date();
        t.setDate(t.getDate() + 1);
        const targetDay = t.getDate();
        const targetMonth = t.getMonth();
        const targetYear = t.getFullYear();

        const header = this.page.locator(".p-datepicker-title");
        await header.waitFor({ state: "visible" });
        const headerText = await header.innerText();
        const [monthName, year] = headerText.trim().split(" ");
        const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();

        const monthDifference =
            (targetYear - parseInt(year)) * 12 + (targetMonth - monthIndex);

        for (let i = 0; i < Math.abs(monthDifference); i++) {
            if (monthDifference > 0) {
                await this.page.locator(".p-datepicker-next").click();
            } else {
                await this.page.locator(".p-datepicker-prev").click();
            }
        }

        const dayButton = this.page.locator(
            `.p-datepicker-calendar td:not(.p-disabled) .p-datepicker-day:not(.p-disabled), .p-datepicker-calendar td:not(.p-disabled) span:not(.p-disabled)`
        ).filter({ hasText: String(targetDay) }).first();

        await dayButton.click({ force: true });

        const staffSelect = this.page.locator('ng-select[formcontrolname="assignedUsers"] input');
        const staffElement = await staffSelect.elementHandle();
        if (staffElement) {
            await this.page.evaluate((el) => {
                el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
            }, staffElement);
        }
        await staffSelect.waitFor({ state: "visible" });
        const assigneeLabel = this.page.locator('div').filter({ hasText: /^Jahanzaib Xenex$/ }).first();
        const isLabelVisible = await assigneeLabel.waitFor({ state: 'visible', timeout: 6000 }).then(() => true).catch(() => false);

        if (!isLabelVisible) {
            await staffSelect.click({ force: true });
            await staffSelect.waitFor({ state: "visible" });
            await staffSelect.click({ force: true });
            await staffSelect.fill('Jahanzaib Xenex');

            const assigneeOption = this.page.getByRole('option', { name: 'Jahanzaib Xenex (jahanzaib@xenex-media.com.au)' });
            await assigneeOption.waitFor({ state: 'visible' });
            await assigneeOption.click({ force: true });
            await assigneeLabel.waitFor({ state: 'visible', timeout: 6000 }).catch(() => { });
        } else {
        }

        const saveTaskButton = this.page.getByRole('button', { name: 'Save' }).first();
        await saveTaskButton.scrollIntoViewIfNeeded();
        await saveTaskButton.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(1000);
        await saveTaskButton.dblclick({ force: true });

        const successToast = this.page.locator('div').filter({ hasText: 'Task created' }).last();
        await successToast.waitFor({ state: "visible" });

        const closetask = this.page.locator("//a[@class='level_li Task_1 cursor-pointer active']//i[@class='p-element pi pi-times ml-2 f-12 cursor-pointer']");
        if (await closetask.isVisible().catch(() => false)) {
            await closetask.click({ force: true });
        }

        const firstRow = this.page.locator('table tbody tr')
            .filter({ hasText: taskTitle }).last();
        await firstRow.waitFor({ state: "visible" });
        await this.openStreamTab();
        const streamTaskRow = this.page.locator('div.stream-body').filter({ hasText: 'Task Added' }).first();
        await streamTaskRow.waitFor({ state: "visible" });
    }
    async closeModalIfVisible() {
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }
    async leadCreation() {
        const leadTab = this.page.getByRole('tab', { name: 'Lead' });
        await leadTab.waitFor({ state: 'visible' });
        await leadTab.click();

        // Count rows before creation
        const tableRowsLocator = this.page.locator('#customentitydatalist table tbody tr');
        await tableRowsLocator.first().waitFor({ state: 'visible' });
        const initialRowCount = await tableRowsLocator.count();

        // Look for the "New Lead" button
        const newLeadButton = this.page.getByRole('button', { name: /new lead/i });
        await newLeadButton.waitFor({ state: 'visible' });
        await expect(newLeadButton).toBeEnabled();
        await newLeadButton.click();

        const leadLink = this.page.locator('a').filter({ hasText: /^Lead$/ });
        await leadLink.waitFor({ state: 'visible' });

        const leadDetails = this.page.locator('div.popup-gray-box:has(p:text("Lead Details"))');
        await leadDetails.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(2000);

        // Select Lead Type
        const leadType = leadDetails.locator('ng-select[formcontrolname="lead_type"]');
        await leadType.waitFor({ state: 'visible' });
        await leadType.click();
        await this.page.waitForTimeout(600);
        const buyerOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Buyer' });
        await buyerOption.waitFor({ state: 'visible' });
        await buyerOption.click();
        await this.page.waitForTimeout(600);

        // Get other lead detail fields
        const leadStatus = leadDetails.locator('ng-select[formcontrolname="lead_status"]');
        await leadStatus.waitFor({ state: 'visible' });
        await leadStatus.click();
        await this.page.waitForTimeout(600);
        const leadStatusOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'New' });
        await leadStatusOption.waitFor({ state: 'visible' });
        await leadStatusOption.click();
        await this.page.waitForTimeout(600);

        // Select Lead Source
        const leadSource = leadDetails.locator('ng-select[formcontrolname="lead_source"]');
        await leadSource.waitFor({ state: 'visible' });
        await leadSource.click();
        await this.page.waitForTimeout(600);
        const sourceOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Billboard' });
        await sourceOption.waitFor({ state: 'visible' });
        await sourceOption.click();
        await this.page.waitForTimeout(1000);

        const contactDetails = this.page.getByText('Email:');
        await contactDetails.waitFor({ state: 'visible' });

        // Click "Save & Close" button
        const saveAndCloseButton = this.page.getByRole('button', { name: /save & close/i }).first();
        await saveAndCloseButton.waitFor({ state: 'visible' });
        await expect(saveAndCloseButton).toBeEnabled();
        await saveAndCloseButton.click();

        // Get the "lead added successfully" toast message
        const leadAddedSuccessMsg = this.page.getByText(/lead added successfully/i);
        await leadAddedSuccessMsg.waitFor({ state: 'visible' });
        await leadAddedSuccessMsg.waitFor({ state: 'hidden' });

        await leadLink.waitFor({ state: 'hidden' });

        await this.page.waitForTimeout(2000);
        // Count the rows after creation
        await tableRowsLocator.first().waitFor({ state: "visible" });
        const finalRowCount = await tableRowsLocator.count();
        // Ensure the row count increased
        if (finalRowCount <= initialRowCount) {
            throw new Error("Lead creation did not increase the number of records in the table.");
        }
    }

    async openStreamTab() {
        const streamTab = this.page.getByRole('tab', { name: /Stream/i });
        await streamTab.waitFor({ state: 'visible' });
        await streamTab.click();
    }

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

    async waitForLeadUpdatedSuccessMessage() {
        const successMessageLocator = this.page.getByText('Lead updated successfully', { exact: true });
        await successMessageLocator.waitFor({ state: 'visible' });
        await successMessageLocator.waitFor({ state: 'hidden' });
    }

    async closeLeadModalIfVisible() {
        const closeBtn = this.page.locator('i.p-element.pi.pi-times.ml-2.f-12.cursor-pointer').nth(1);
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }
}
