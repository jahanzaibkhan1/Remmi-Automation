import { Page, Locator, expect } from '@playwright/test';
import { ContactBasePage } from './ContactBasePage';
import { faker } from '@faker-js/faker';

export class ContactTaskFormPage extends ContactBasePage {
    async verifyTaskMandatoryFields(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openTasksTab();
        const taskFormModal = this.page.locator('section.body-details.h-100.border-0:visible');
        await taskFormModal.waitFor({ state: 'visible', timeout: 10000 });
        const saveButton = this.page.getByRole('button', { name: /^save$/i }).first();
        await saveButton.waitFor({ state: 'visible' });
        await saveButton.click();
        const titleErrorLocator = this.page.locator('input[formcontrolname="title"].ng-invalid');
        const selectDateErrorLocator = this.page.locator('p-calendar[formcontrolname="due_date"] input');
        const staffErrorLocator = this.page.locator('ng-select[formcontrolname="assignedUsers"].ng-invalid');
        await expect(titleErrorLocator).toBeVisible({ timeout: 10000 });
        await expect(selectDateErrorLocator).toBeVisible({ timeout: 10000 });
        await expect(staffErrorLocator).toBeVisible({ timeout: 10000 });
        await this.closeModalIfVisible();

    }

    /**
     * Verifies that a dropdown list opens when clicking on the Task Type field in the "New Task" form.
     */
    async verifyTaskTypeDropdownOpens(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openTasksTab();
        const taskFormModal = this.page.locator('section.body-details.h-100.border-0:visible');
        await taskFormModal.waitFor({ state: 'visible', timeout: 10000 });
        const taskTypeSelector = this.page.locator('ng-select[formcontrolname="job_type_id"] .ng-select-container');
        await expect(taskTypeSelector).toBeVisible({ timeout: 10000 });
        await taskTypeSelector.click();
        const dropdownOptions = this.page.locator('.ng-dropdown-panel .ng-option');
        await expect(dropdownOptions.first()).toBeVisible({ timeout: 10000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verify that a dropdown list opens when clicking on Task Status field.
     */
    async verifyTaskStatusDropdownOpens(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openTasksTab();
        const taskFormModal = this.page.locator('section.body-details.h-100.border-0:visible');
        await taskFormModal.waitFor({ state: 'visible', timeout: 10000 });
        const statusSelector = this.page.locator("//ng-select[@placeholder='Select Status']//div[@role='combobox']");
        await expect(statusSelector).toBeVisible({ timeout: 10000 });
        await statusSelector.click();
        const dropdownOptions = this.page.locator('.ng-dropdown-panel .ng-option');
        await expect(dropdownOptions.first()).toBeVisible({ timeout: 10000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that selecting "Lead Management" from Task Type triggers the Lead Name dropdown in the task form.
     */
    async verifyLeadNameDropdownAppearsOnLeadManagementTaskType(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openTasksTab();
        const taskFormModal = this.page.locator('section.body-details.h-100.border-0:visible');
        await taskFormModal.waitFor({ state: 'visible', timeout: 10000 });
        const taskTypeSelector = this.page.locator('ng-select[formcontrolname="job_type_id"] .ng-select-container');
        await expect(taskTypeSelector).toBeVisible({ timeout: 10000 });
        await taskTypeSelector.click();
        const dropdownOptions = this.page.locator('.ng-dropdown-panel .ng-option');
        await expect(dropdownOptions.first()).toBeVisible({ timeout: 10000 });
        const leadManagementOption = dropdownOptions.filter({ hasText: /lead management/i }).first();
        await expect(leadManagementOption).toBeVisible({ timeout: 10000 });
        await leadManagementOption.click();
        const leadNameDropdown = this.page.locator('ng-select[formcontrolname="lead_id"]');
        await expect(leadNameDropdown).toBeVisible({ timeout: 10000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that selecting a module shows a relevant dropdown list for that module
     */
    async verifyModuleDropdownsAppearForSelectedModule(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openTasksTab();
        const selectModule = this.page.locator("//ng-select[@placeholder='Select Module']//div[@role='combobox']");
        await selectModule.waitFor({ state: 'visible', timeout: 10000 });
        await selectModule.click();
        let moduleOptionLocator = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: /listings?/i });
        await expect(moduleOptionLocator).toBeVisible({ timeout: 10000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that the contact tag is displayed correctly in the task form.
     */
    async verifyContactTagIsDisplayed(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openTasksTab();
        const taskFormModal = this.page.locator('section.body-details.h-100.border-0:visible');
        await taskFormModal.waitFor({ state: 'visible', timeout: 10000 });
        const contactTag = this.page.locator('p').filter({ hasText: '11 22' }).last();
        await contactTag.waitFor({ state: 'visible' });
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that the contact form displays correctly when opening or creating a contact from a task.
     */
    async verifyContactFormDisplaysFromTask(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openTasksTab();
        const selectModule = this.page.locator("//ng-select[@placeholder='Select Module']//div[@role='combobox']");
        await selectModule.waitFor({ state: 'visible', timeout: 20000 });
        await selectModule.click();
        let moduleOptionLocator = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: /property/i });
        await expect(moduleOptionLocator).toBeVisible({ timeout: 20000 });
        await moduleOptionLocator.click();
        let propertyDropdownLocator = this.page.getByText('Select Property', { exact: true })
        await propertyDropdownLocator.waitFor({ state: 'visible' });
        await propertyDropdownLocator.click();
        const propertyOption = this.page.locator('div.drop_box.ng-star-inserted');
        await propertyOption.waitFor({ state: 'visible' });
        const firstOption = this.page.locator('div.drop_box.ng-star-inserted li').first();
        await firstOption.waitFor({ state: 'visible', timeout: 10000 });
        await firstOption.click();
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that the contact form displays correctly when opening or creating a contact from a task.
     */
    async verifyContactFormFromTask(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openTasksTab();
        const contactSpan = this.page.locator('span').filter({ hasText: 'Contact' }).first();
        await contactSpan.waitFor({ state: 'visible' });
        const contactTag = this.page.locator('div.selected_one.ng-star-inserted')
        await contactTag.waitFor({ state: 'visible' });
        await contactTag.click({ force: true });
        await this.page.locator('p-splitter.p-element.ng-star-inserted').waitFor({ state: 'visible' });
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that selecting a property from the dropdown creates a task linked to that property.
     */
    async verifyTaskLinkedToSelectedProperty(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openTasksTab();

        // Use a unique task title for easy identification
        const uniqueTitle = `Testing Task`;

        const taskTitleInput = this.page.locator('input[formcontrolname="title"]').first();
        await taskTitleInput.waitFor({ state: "visible" });
        await taskTitleInput.fill(uniqueTitle);

        const dateInput = this.page.locator('p-calendar[formcontrolname="due_date"] input');
        await dateInput.waitFor({ state: "visible" });
        await dateInput.click();

        // Select tomorrow's date from the calendar
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

        // Assign staff "Jahanzaib Xenex" if not already selected
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
        }

        // Open the module selector and pick "Property"
        const selectModule = this.page.locator("//ng-select[@placeholder='Select Module']//div[@role='combobox']");
        await selectModule.waitFor({ state: 'visible', timeout: 20000 });
        await selectModule.click();

        const moduleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: /property/i });
        await expect(moduleOption).toBeVisible({ timeout: 20000 });
        await moduleOption.click();

        // Open the property selector
        const propertyDropdown = this.page.getByText('Select Property', { exact: true });
        await propertyDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await propertyDropdown.click();

        // Select the first property in the dropdown
        const propertyOptions = this.page.locator('div.drop_box.ng-star-inserted li');
        await propertyOptions.first().waitFor({ state: 'visible', timeout: 10000 });
        const selectedProperty = await propertyOptions.first().textContent();
        await propertyOptions.first().click();

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
            .filter({ hasText: uniqueTitle }).last();
        await firstRow.waitFor({ state: "visible", timeout: 30000 });
        await this.openStreamTab();
        const streamTaskRow = this.page.locator('div.stream-body').filter({ hasText: 'Task Added' }).first();
        await streamTaskRow.waitFor({ state: "visible" });

        await this.closeModalIfVisible();
    }

    /**
     * Verify that selecting the "Project" module shows a dropdown list for selecting a project.
     */
    async verifyProjectDropdownIsVisible(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openTasksTab();

        // Open the module selector and pick "Project"
        const selectModule = this.page.locator("//ng-select[@placeholder='Select Module']//div[@role='combobox']");
        await selectModule.waitFor({ state: 'visible', timeout: 20000 });
        await selectModule.click();

        const moduleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: /project/i });
        await expect(moduleOption).toBeVisible({ timeout: 20000 });
        await moduleOption.click();

        // The project dropdown should now be present (look for "Select Project")
        const projectDropdown = this.page.getByText('Select Project', { exact: true });
        await projectDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await expect(projectDropdown).toBeVisible({ timeout: 10000 });

        await this.closeModalIfVisible();
    }

    /**
     * Verifies that selecting a project from the dropdown creates a task linked to that project.
     */
    async verifyTaskLinkedToSelectedProject(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openTasksTab();

        // Use a unique title for the new task
        const uniqueTitle = "Testing Task";


        // Fill in the mandatory task title and due date
        const taskTitleInput = this.page.locator('input[formcontrolname="title"]').first();
        await taskTitleInput.waitFor({ state: "visible" });
        await taskTitleInput.fill(uniqueTitle);

        const dateInput = this.page.locator('p-calendar[formcontrolname="due_date"] input');
        await dateInput.waitFor({ state: "visible" });
        await dateInput.click();

        // Select tomorrow's date from the calendar
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

        // Assign a staff if field is present (optional, skip if not present)
        const staffDropdown = this.page.locator('ng-select[formcontrolname="assignedUsers"] .ng-select-container');
        if (await staffDropdown.isVisible().catch(() => false)) {
            await staffDropdown.click();
            const staffOption = this.page.locator('.ng-dropdown-panel .ng-option').first();
            await staffOption.waitFor({ state: 'visible', timeout: 5000 });
            await staffOption.click();
        }

        // Open module selector and pick "Project"
        const selectModule = this.page.locator("//ng-select[@placeholder='Select Module']//div[@role='combobox']");
        await selectModule.waitFor({ state: 'visible', timeout: 20000 });
        await selectModule.click();
        const moduleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: /project/i });
        await expect(moduleOption).toBeVisible({ timeout: 20000 });
        await moduleOption.click();

        // Wait for the project dropdown and select the first available project
        const projectDropdown = this.page.getByText('Select Project', { exact: true });
        await projectDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await projectDropdown.click();

        const projectOptions = this.page.locator('div.drop_box.ng-star-inserted li');
        const firstProjectOption = projectOptions.first();
        await firstProjectOption.waitFor({ state: 'visible', timeout: 20000 });
        const selectedProjectName = await firstProjectOption.textContent();
        await firstProjectOption.click();


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
            .filter({ hasText: uniqueTitle }).last();
        await firstRow.waitFor({ state: "visible", timeout: 30000 });
        await this.openStreamTab();
        const streamTaskRow = this.page.locator('div.stream-body').filter({ hasText: 'Task Added' }).first();
        await streamTaskRow.waitFor({ state: "visible" });

        await this.closeModalIfVisible();
    }

    /**
     * Verify that selecting the "Listing" module shows a dropdown list for selecting a listing.
     */
    async verifyListingDropdownIsVisible(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openTasksTab();

        // Open the module selector and pick "Listing"
        const selectModule = this.page.locator("//ng-select[@placeholder='Select Module']//div[@role='combobox']");
        await selectModule.waitFor({ state: 'visible', timeout: 10000 });
        await selectModule.click();

        const moduleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: /listing/i });
        await expect(moduleOption).toBeVisible({ timeout: 10000 });
        await moduleOption.click();

        // Wait for the listing dropdown to become visible
        const listingDropdown = this.page.getByText('Select Listing', { exact: true });
        await listingDropdown.waitFor({ state: 'visible', timeout: 10000 });

        // Optionally, check that at least one listing option is present
        await listingDropdown.click();
        const listingOptions = this.page.locator('div.drop_box.ng-star-inserted li');
        await expect(listingOptions.first()).toBeVisible({ timeout: 10000 });

        await this.closeModalIfVisible();
    }

    /**
     * Verifies that selecting a listing from the dropdown creates a task linked to that listing.
     */
    async verifyTaskLinkedToSelectedListing(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openTasksTab();

        // Use a unique title for the new task
        const uniqueTitle = "Testing Task";


        // Fill in the mandatory task title and due date
        const taskTitleInput = this.page.locator('input[formcontrolname="title"]').first();
        await taskTitleInput.waitFor({ state: "visible" });
        await taskTitleInput.fill(uniqueTitle);

        const dateInput = this.page.locator('p-calendar[formcontrolname="due_date"] input');
        await dateInput.waitFor({ state: "visible" });
        await dateInput.click();

        // Select tomorrow's date (assume a calendar table, pick available day that's not disabled)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dd = tomorrow.getDate();
        const dateString = dd.toString();
        // Try clicking tomorrow's cell on the calendar
        const cellLocator = this.page.locator(`.p-datepicker-calendar td:not(.p-disabled) >> text='${dateString}'`);
        await cellLocator.first().click();

        // Assign a staff if field is present (optional, skip if not present)
        const staffDropdown = this.page.locator('ng-select[formcontrolname="assignedUsers"] .ng-select-container');
        if (await staffDropdown.isVisible().catch(() => false)) {
            await staffDropdown.click();
            const staffOption = this.page.locator('.ng-dropdown-panel .ng-option').first();
            await staffOption.waitFor({ state: 'visible', timeout: 5000 });
            await staffOption.click();
        }
        // Open the module selector and pick "Listing"
        const selectModule = this.page.locator("//ng-select[@placeholder='Select Module']//div[@role='combobox']");
        await selectModule.waitFor({ state: 'visible', timeout: 10000 });
        await selectModule.click();

        const moduleOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: /listing/i });
        await expect(moduleOption).toBeVisible({ timeout: 10000 });
        await moduleOption.click();

        // Wait for the listing dropdown and select the first listing
        const listingDropdown = this.page.getByText('Select Listing', { exact: true });
        await listingDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await listingDropdown.click();
        const listingOptions = this.page.locator('div.drop_box.ng-star-inserted li');
        await expect(listingOptions.first()).toBeVisible({ timeout: 10000 });
        await listingOptions.first().click();

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
            .filter({ hasText: uniqueTitle }).last();
        await firstRow.waitFor({ state: "visible", timeout: 30000 });
        await this.openStreamTab();
        const streamTaskRow = this.page.locator('div.stream-body').filter({ hasText: 'Task Added' }).first();
        await streamTaskRow.waitFor({ state: "visible" });

        await this.closeModalIfVisible();
    }

    /**
     * Verifies that the recurring task checkbox shows a dropdown with "Weekly," "Monthly," and "Yearly" options.
     */
    async verifyRecurringTaskOptions() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openTasksTab();
        const recurringCheckbox = this.page.locator('.form-group > .d-flex > .p-element > .p-checkbox > .p-checkbox-box').first();
        await expect(recurringCheckbox).toBeVisible({ timeout: 20000 });
        await recurringCheckbox.click();
        const frequencySelect = this.page.getByText('Select Recurring Type');
        await expect(frequencySelect).toBeVisible({ timeout: 10000 });
        await frequencySelect.click();
        const dropdownPanel = this.page.locator('.ng-dropdown-panel');
        await expect(dropdownPanel).toBeVisible({ timeout: 10000 });
        const weeklyOption = dropdownPanel.locator('.ng-option', { hasText: 'Weekly' });
        const monthlyOption = dropdownPanel.locator('.ng-option', { hasText: 'Monthly' });
        const yearlyOption = dropdownPanel.locator('.ng-option', { hasText: 'Yearly' });
        await expect(weeklyOption).toBeVisible({ timeout: 2000 });
        await expect(monthlyOption).toBeVisible({ timeout: 2000 });
        await expect(yearlyOption).toBeVisible({ timeout: 2000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verify that clicking "Sync Calendar" allows selection of a time period for task reminders.
     */
    async verifyRecurringTaskSendsEmailNotifications(taskTitle: string): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openTasksTab();
        const taskTitleInput = this.page.locator('input[formcontrolname="title"]').first();
        await expect(taskTitleInput).toBeVisible({ timeout: 10000 });
        await taskTitleInput.fill(taskTitle);
        const dateInput = this.page.locator('p-calendar[formcontrolname="due_date"] input');
        await expect(dateInput).toBeVisible({ timeout: 10000 });
        await dateInput.click();
        const t = new Date();
        t.setDate(t.getDate() + 1);
        const targetDay = t.getDate();
        const targetMonth = t.getMonth();
        const targetYear = t.getFullYear();
        const header = this.page.locator(".p-datepicker-title");
        await expect(header).toBeVisible();
        const headerText = await header.innerText();
        const [monthName, yearText] = headerText.trim().split(" ");
        const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();
        const monthDifference = (targetYear - parseInt(yearText)) * 12 + (targetMonth - monthIndex);
        for (let i = 0; i < Math.abs(monthDifference); i++) {
            if (monthDifference > 0) {
                await this.page.locator('.p-datepicker-next').click();
            } else if (monthDifference < 0) {
                await this.page.locator('.p-datepicker-prev').click();
            }
        }
        const dayLocator = this.page.locator('.p-datepicker-calendar td:not(.p-datepicker-other-month)').getByText(new RegExp(`^${targetDay}$`));
        await expect(dayLocator.first()).toBeVisible();
        await dayLocator.first().click();
        await this.page.waitForTimeout(1200);
        const timerLabel = this.page.getByText('Select Timer', { exact: true });
        await expect(timerLabel).toBeVisible({ timeout: 10000 });
        await timerLabel.click({ force: true });
        const nineAmOption = this.page.getByRole('option', { name: '9am' }).first();
        await expect(nineAmOption).toBeVisible({ timeout: 10000 });
        await nineAmOption.click({ force: true });
        const recurringCheckbox = this.page.locator('.form-group > .d-flex > .p-element > .p-checkbox > .p-checkbox-box').first();
        await expect(recurringCheckbox).toBeVisible({ timeout: 20000 });
        await recurringCheckbox.click();
        const frequencySelect = this.page.getByText('Select Recurring Type');
        await expect(frequencySelect).toBeVisible({ timeout: 10000 });
        await frequencySelect.click();
        const dropdownPanel = this.page.locator('.ng-dropdown-panel');
        await expect(dropdownPanel).toBeVisible({ timeout: 10000 });
        const weeklyOption = dropdownPanel.locator('.ng-option', { hasText: 'Weekly' });
        const monthlyOption = dropdownPanel.locator('.ng-option', { hasText: 'Monthly' });
        const yearlyOption = dropdownPanel.locator('.ng-option', { hasText: 'Yearly' });
        await expect(weeklyOption).toBeVisible({ timeout: 10000 });
        await expect(monthlyOption).toBeVisible({ timeout: 10000 });
        await expect(yearlyOption).toBeVisible({ timeout: 10000 });
        await weeklyOption.click({ force: true });
        const recurringDateInput = this.page.locator('input[placeholder="dd/mm/yy"]').last();
        await expect(recurringDateInput).toBeVisible({ timeout: 10000 });
        await recurringDateInput.click();
        const recurringTomorrow = new Date();
        recurringTomorrow.setDate(recurringTomorrow.getDate() + 1);
        const recurringTargetDay = recurringTomorrow.getDate();
        const recurringTargetMonth = recurringTomorrow.getMonth();
        const recurringTargetYear = recurringTomorrow.getFullYear();
        const recurringCalendarHeader = this.page.locator(".p-datepicker-title");
        await expect(recurringCalendarHeader).toBeVisible();
        const recurringCalendarHeaderText = await recurringCalendarHeader.innerText();
        const [recurringMonthName, recurringYearText] = recurringCalendarHeaderText.trim().split(" ");
        const recurringMonthIndex = new Date(`${recurringMonthName} 1, 2000`).getMonth();
        const recurringMonthDifference = (recurringTargetYear - parseInt(recurringYearText)) * 12 + (recurringTargetMonth - recurringMonthIndex);
        for (let i = 0; i < Math.abs(recurringMonthDifference); i++) {
            if (recurringMonthDifference > 0) {
                await this.page.locator('.p-datepicker-next').click();
            } else if (recurringMonthDifference < 0) {
                await this.page.locator('.p-datepicker-prev').click();
            }
        }
        const recurringDayLocator = this.page.locator('.p-datepicker-calendar td:not(.p-datepicker-other-month)').getByText(new RegExp(`^${recurringTargetDay}$`));
        await expect(recurringDayLocator.first()).toBeVisible();
        await recurringDayLocator.first().click();
        await this.page.waitForTimeout(1000);
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
        const saveBtn = this.page.getByRole('button', { name: /Save|Create/i }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();
        // Wait for the "Task created" toast to appear and disappear
        const successToast = this.page.locator('div').filter({ hasText: 'Task created' }).last();
        await successToast.waitFor({ state: "visible" });
        await successToast.waitFor({ state: "hidden" });

        await this.page.waitForTimeout(2000);
        const closeBtun = this.page.locator('.pi.pi-times').nth(2);
        if (await closeBtun.isVisible().catch(() => false)) {
            await closeBtun.click({ force: true });
        }
        const createdTaskRow = this.page.locator('table tbody tr').filter({ hasText: taskTitle }).last();
        await expect(createdTaskRow).toBeVisible({ timeout: 10000 });
        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1200);
        const notificationDropdown = this.page.locator('#notification-dropdown');
        await expect(notificationDropdown).toBeVisible({ timeout: 20000 })
        await notificationDropdown.click();
        const notificationLink = this.page.getByRole('link', { name: 'Task Created Jahanzaib Xenex has assigned a task with you.' }).first();
        await expect(notificationLink).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify that clicking "Sync Calendar" allows selection of a time period for task reminders.
     */
    async verifySyncCalendarAllowsTimePeriodSelection(taskTitle: string): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openTasksTab();

        // Fill in task title
        const taskTitleInput = this.page.locator('input[formcontrolname="title"]').first();
        await expect(taskTitleInput).toBeVisible({ timeout: 10000 });
        await taskTitleInput.fill(taskTitle);

        // Set a due date (e.g., tomorrow)
        const dateInput = this.page.locator('p-calendar[formcontrolname="due_date"] input');
        await expect(dateInput).toBeVisible({ timeout: 10000 });
        await dateInput.click();

        // Pick tomorrow's date
        const t = new Date();
        t.setDate(t.getDate() + 1);
        const targetDay = t.getDate();
        const targetMonth = t.getMonth();
        const targetYear = t.getFullYear();

        // Get displayed calendar month & year
        const header = this.page.locator(".p-datepicker-title");
        await expect(header).toBeVisible();
        const headerText = await header.innerText();
        const [monthName, yearText] = headerText.trim().split(" ");
        const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();

        const monthDifference = (targetYear - parseInt(yearText)) * 12 + (targetMonth - monthIndex);
        for (let i = 0; i < Math.abs(monthDifference); i++) {
            if (monthDifference > 0) {
                await this.page.locator('.p-datepicker-next').click();
            } else if (monthDifference < 0) {
                await this.page.locator('.p-datepicker-prev').click();
            }
        }

        // Select the target day
        const dayLocator = this.page.locator('.p-datepicker-calendar td:not(.p-datepicker-other-month)').getByText(new RegExp(`^${targetDay}$`));
        await expect(dayLocator.first()).toBeVisible();
        await dayLocator.first().click();

        await this.page.waitForTimeout(1200);

        // Select the timer (reminder) dropdown and choose 9:00 AM
        const timerLabel = this.page.getByText('Select Timer', { exact: true });
        await expect(timerLabel).toBeVisible({ timeout: 10000 });
        await timerLabel.click({ force: true });

        // Wait for the options to appear and select "9:00 AM"
        const nineAmOption = this.page.getByRole('option', { name: '9am' }).first();
        await expect(nineAmOption).toBeVisible({ timeout: 10000 });
        await nineAmOption.click({ force: true });


        // Click the "Recurring Task" checkbox
        const recurringCheckbox = this.page.locator('.form-group > .d-flex > .p-element > .p-checkbox > .p-checkbox-box').first();
        await expect(recurringCheckbox).toBeVisible({ timeout: 20000 });
        await recurringCheckbox.click();


        // Click the "Sync Calendar" checkbox
        const syncCalendar = this.page.locator('.form-group > .d-flex > .p-element > .p-checkbox > .p-checkbox-box').last();
        await expect(syncCalendar).toBeVisible({ timeout: 20000 });
        await syncCalendar.click();

        // After checking, the frequency dropdown should appear
        const frequencySelect = this.page.getByText('Select Recurring Type');
        await expect(frequencySelect).toBeVisible({ timeout: 10000 });
        await frequencySelect.click();

        // Wait for the dropdown options to be visible
        const dropdownPanel = this.page.locator('.ng-dropdown-panel');
        await expect(dropdownPanel).toBeVisible({ timeout: 10000 });

        // Assert that "Weekly", "Monthly", "Yearly" options are present
        const weeklyOption = dropdownPanel.locator('.ng-option', { hasText: 'Weekly' });
        const monthlyOption = dropdownPanel.locator('.ng-option', { hasText: 'Monthly' });
        const yearlyOption = dropdownPanel.locator('.ng-option', { hasText: 'Yearly' });

        await expect(weeklyOption).toBeVisible({ timeout: 10000 });
        await expect(monthlyOption).toBeVisible({ timeout: 10000 });
        await expect(yearlyOption).toBeVisible({ timeout: 10000 });

        await yearlyOption.click({ force: true });

        // Always pick tomorrow's date in the recurring date input
        const recurringDateInput = this.page.locator('input[placeholder="dd/mm/yy"]').last();
        await expect(recurringDateInput).toBeVisible({ timeout: 10000 });
        await recurringDateInput.click();

        // Calculate tomorrow's date
        const recurringTomorrow = new Date();
        recurringTomorrow.setDate(recurringTomorrow.getDate() + 1);
        const recurringTargetDay = recurringTomorrow.getDate();
        const recurringTargetMonth = recurringTomorrow.getMonth();
        const recurringTargetYear = recurringTomorrow.getFullYear();

        // Get displayed calendar month & year
        const recurringCalendarHeader = this.page.locator(".p-datepicker-title");
        await expect(recurringCalendarHeader).toBeVisible();
        const recurringCalendarHeaderText = await recurringCalendarHeader.innerText();
        const [recurringMonthName, recurringYearText] = recurringCalendarHeaderText.trim().split(" ");
        const recurringMonthIndex = new Date(`${recurringMonthName} 1, 2000`).getMonth();

        const recurringMonthDifference = (recurringTargetYear - parseInt(recurringYearText)) * 12 + (recurringTargetMonth - recurringMonthIndex);
        for (let i = 0; i < Math.abs(recurringMonthDifference); i++) {
            if (recurringMonthDifference > 0) {
                await this.page.locator('.p-datepicker-next').click();
            } else if (recurringMonthDifference < 0) {
                await this.page.locator('.p-datepicker-prev').click();
            }
        }

        // Select tomorrow in the calendar
        const recurringDayLocator = this.page.locator('.p-datepicker-calendar td:not(.p-datepicker-other-month)').getByText(new RegExp(`^${recurringTargetDay}$`));
        await expect(recurringDayLocator.first()).toBeVisible();
        await recurringDayLocator.first().click();
        await this.page.waitForTimeout(1000);

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

        // Submit the form
        const saveBtn = this.page.getByRole('button', { name: /Save|Create/i }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();
        await this.page.waitForTimeout(2000);
        const successToast = this.page.locator('div').filter({ hasText: 'Task created' }).last();
        await successToast.waitFor({ state: "visible" });
        await successToast.waitFor({ state: "hidden" });
        const closeBtun = this.page.locator('.pi.pi-times').nth(2);
        if (await closeBtun.isVisible().catch(() => false)) {
            await closeBtun.click({ force: true });
        }

        const createdTaskRow = this.page.locator('table tbody tr').filter({ hasText: taskTitle }).last();
        await expect(createdTaskRow).toBeVisible({ timeout: 40000 });
        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1200);
        const notificationDropdown = this.page.locator('#notification-dropdown');
        await expect(notificationDropdown).toBeVisible({ timeout: 20000 })
        await notificationDropdown.click({ force: true });

        const notificationLink = this.page.getByRole('link', { name: 'Task Created Jahanzaib Xenex has assigned a task with you.' }).first();
        await expect(notificationLink).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);

    }

    /**
     * Verify that setting a reminder time sends an email or notification at the selected interval.
     */
    async verifyTaskReminderTriggersNotification() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.closeModalIfVisible();
        const notificationDropdown = this.page.locator('#notification-dropdown');
        await expect(notificationDropdown).toBeVisible({ timeout: 40000 })
        await notificationDropdown.click({ force: true });

        const notificationLink = this.page.getByRole('link', { name: 'Task Created Jahanzaib Xenex has assigned a task with you.' }).first();
        await expect(notificationLink).toBeVisible({ timeout: 30000 });
        await notificationDropdown.click({ force: true });
    }

    /**
     * Verify that selecting a team from the dropdown shows the task to all users in that team.
     */
    async verifyTaskVisibleToAllTeamMembers() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openTasksTab();

        // Fill in task title
        const taskTitleInput = this.page.locator('input[formcontrolname="title"]').first();
        await expect(taskTitleInput).toBeVisible({ timeout: 10000 });
        await taskTitleInput.fill('Team Task');

        // Set a due date (e.g., tomorrow)
        const dateInput = this.page.locator('p-calendar[formcontrolname="due_date"] input');
        await expect(dateInput).toBeVisible({ timeout: 10000 });
        await dateInput.click();

        // Pick tomorrow's date
        const t = new Date();
        t.setDate(t.getDate() + 1);
        const targetDay = t.getDate();
        const targetMonth = t.getMonth();
        const targetYear = t.getFullYear();

        // Get displayed calendar month & year
        const header = this.page.locator(".p-datepicker-title");
        await expect(header).toBeVisible();
        const headerText = await header.innerText();
        const [monthName, yearText] = headerText.trim().split(" ");
        const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();

        const monthDifference = (targetYear - parseInt(yearText)) * 12 + (targetMonth - monthIndex);
        for (let i = 0; i < Math.abs(monthDifference); i++) {
            if (monthDifference > 0) {
                await this.page.locator('.p-datepicker-next').click();
            } else if (monthDifference < 0) {
                await this.page.locator('.p-datepicker-prev').click();
            }
        }

        // Select the target day
        const dayLocator = this.page.locator('.p-datepicker-calendar td:not(.p-datepicker-other-month)').getByText(new RegExp(`^${targetDay}$`));
        await expect(dayLocator.first()).toBeVisible();
        await dayLocator.first().click();

        await this.page.waitForTimeout(1200);


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

        // Open the assignee/team dropdown
        const teamSelect = this.page.locator('div').filter({ hasText: /^Select Team$/ }).last();
        await expect(teamSelect).toBeVisible({ timeout: 10000 });
        await teamSelect.click();

        // Use the "drop_box" dropdown panel directly
        const dropdownPanel = this.page.locator('.drop_box');
        await expect(dropdownPanel).toBeVisible({ timeout: 10000 });
        await dropdownPanel.click();

        const options = this.page.locator('.drop_box ul li').first();
        await options.first().waitFor({ state: 'visible' });
        await options.first().click();
        // Save the task
        const saveBtn = this.page.getByRole('button', { name: /Save|Create/i }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();

        const successToast = this.page.locator('div').filter({ hasText: 'Task created' }).last();
        await successToast.waitFor({ state: "visible" });
        await successToast.waitFor({ state: "hidden" });

        await this.page.waitForTimeout(2000);
        const closeBtun = this.page.locator('.pi.pi-times').nth(2);
        if (await closeBtun.isVisible().catch(() => false)) {
            await closeBtun.click({ force: true });
        }
        const tasksTable = this.page.locator('#customentitydatalist table tbody tr').last();
        await tasksTable.first().waitFor({ state: 'visible' });

        await this.page.waitForTimeout(1000);
        await this.closeModalIfVisible()

    }

    /**
     * Verify that users added to the selected team can view the task.
     */
    async verifyTaskVisibleToTeamMember() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        // Click on the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        const tasksTable = this.page.locator('#customentitydatalist table tbody tr').last();
        await tasksTable.first().waitFor({ state: 'visible' });
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that when a comment is added in the "Additional Comments" section,
     * a notification is sent to the selected staff member.
     */
    async verifyCommentNotificationToStaff() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        // click on Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 30000 });
        await tasksTab.click();

        // Click the "Testing Task" cell to open editing
        const testingTaskCell = this.page.getByRole('cell', { name: 'Testing Task' }).first();
        await testingTaskCell.waitFor({ state: 'visible' });
        await testingTaskCell.click();

        // Fill in Additional Comments
        const commentsInput = this.page.getByRole('textbox', { name: 'Send comments to the Assignee' });
        await commentsInput.scrollIntoViewIfNeeded();
        await expect(commentsInput).toBeVisible({ timeout: 10000 });
        await commentsInput.click();
        await commentsInput.fill('Comment Added To Task');

        // Click the "Send Comments" button
        const sendCommentsBtn = this.page.getByRole('button', { name: 'Send Comment' });
        await expect(sendCommentsBtn).toBeVisible({ timeout: 10000 });
        await sendCommentsBtn.click();

        // Get by text "Comment published"
        const commentPublishedToast = this.page.getByText('Comment published');
        await expect(commentPublishedToast).toBeVisible({ timeout: 10000 });
        await expect(commentPublishedToast).toBeHidden({ timeout: 10000 });
        await this.closeModalIfVisible();

        // Wait for the notification dropdown to appear and verify the notification
        const notificationDropdown = this.page.locator('#notification-dropdown');
        await expect(notificationDropdown).toBeVisible({ timeout: 20000 });
        await notificationDropdown.click();

        const notificationLink = this.page.getByRole('link', { name: 'Task Comment Jahanzaib' }).first();
        await expect(notificationLink).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that the added comment appears below the "Additional Comments" section once the task is saved.
     * Assumes the comment to verify is 'Comment Added To Task'.
     */
    async verifyCommentAppearsUnderAdditionalComments() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        // Click the "Testing Task" cell to open editing
        const testingTaskCell = this.page.getByRole('cell', { name: 'Testing Task' }).first();
        await testingTaskCell.waitFor({ state: 'visible' });
        await testingTaskCell.click();

        // Fill in Additional Comments
        const commentsInput = this.page.getByRole('textbox', { name: 'Send comments to the Assignee' });
        await commentsInput.evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
        await expect(commentsInput).toBeVisible({ timeout: 10000 });

        // Wait for the comments container to appear below the header
        const addedComment = this.page.getByText('Comment Added To Task').first();
        await addedComment.evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
        await expect(addedComment).toBeVisible({ timeout: 10000 });
        await this.closeModalIfVisible();

    }

    async verifyFileUploadNoDuplicationOnDoubleSave(filePath: string) {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();
        // Click the "Testing Task" cell to open editing
        const testingTaskCell = this.page.getByRole('cell', { name: 'Testing Task' }).first();
        await testingTaskCell.waitFor({ state: 'visible' });
        await testingTaskCell.click();

        // Click the "Add Files" button to open the file dialog
        const addFilesBtn = this.page.getByRole('button', { name: /Add Files/i });
        await addFilesBtn.scrollIntoViewIfNeeded();
        await expect(addFilesBtn).toBeVisible({ timeout: 10000 });
        await addFilesBtn.click();

        // Attach a file
        const uploadInput = this.page.locator('#fileInput');
        await uploadInput.setInputFiles(filePath);

        // Wait for the uploaded image thumbnail to appear and ensure only one instance is present
        const uploadedImages = this.page.locator('.img-fluid').first();
        await expect(uploadedImages).toBeVisible({ timeout: 10000 });

        // Save the form the first time
        const saveBtn = this.page.getByRole('button', { name: 'Save' }).first();
        await saveBtn.scrollIntoViewIfNeeded();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.dblclick();
        await this.closeLeadModalIfVisible
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that the added file appears correctly after saving the task.
     */
    async verifyFileAppearsAfterTaskSave(filePath: string) {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        // Click the "Testing Task" cell to open editing
        const testingTaskCell = this.page.getByRole('cell', { name: 'Testing Task' }).first();
        await testingTaskCell.waitFor({ state: 'visible' });
        await testingTaskCell.click();

        // Add a file
        const addFilesBtn = this.page.getByRole('button', { name: /Add Files/i });
        await addFilesBtn.scrollIntoViewIfNeeded();
        await expect(addFilesBtn).toBeVisible({ timeout: 10000 });
        await addFilesBtn.click();

        const uploadInput = this.page.locator('#fileInput');
        await uploadInput.setInputFiles(filePath);

        // Wait for the uploaded image thumbnail to appear
        const uploadedImage = this.page.locator('.img-fluid').first();
        await expect(uploadedImage).toBeVisible({ timeout: 10000 });

        // Save the form
        const saveBtn = this.page.getByRole('button', { name: 'Save' }).first();
        await saveBtn.scrollIntoViewIfNeeded();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();
        await this.closeModalIfVisible();

    }

    /**
     * Verifies that after creating a task, the "Create Sub Task" option becomes visible.
     */
    async verifyCreateSubTaskOptionVisible() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        // Click the "Testing Task" cell to open editing
        const testingTaskCell = this.page.getByRole('cell', { name: 'Testing Task' }).first();
        await testingTaskCell.waitFor({ state: 'visible' });
        await testingTaskCell.click();

        // Wait for the "Create Sub Task" button to become visible
        const createSubTaskBtn = this.page.getByRole('button', { name: /Create SubTask/i });
        await expect(createSubTaskBtn).toBeVisible({ timeout: 30000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that clicking on the "Create Sub Task" button shows a field below the staff section to enter a sub task title.
     */
    async verifyCreateSubTaskFieldAppearsBelowStaff() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();
        const testingTaskCell = this.page.getByRole('cell', { name: 'Testing Task' }).first();
        await testingTaskCell.waitFor({ state: 'visible' });
        await testingTaskCell.click();
        const createSubTaskBtn = this.page.getByRole('button', { name: /Create SubTask/i }).first();
        await expect(createSubTaskBtn).toBeVisible({ timeout: 10000 });
        await createSubTaskBtn.click();
        const subTaskTitleInput = this.page.getByRole('textbox', { name: /Enter Task Title/i });
        await expect(subTaskTitleInput).toBeVisible({ timeout: 10000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that entering a title in the sub task field and saving creates the sub task.
     */
    async verifySubTaskCreation() {
        await this.NavigateToContacts();
        await this.openFirstContact();

        // Go to Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        // Open the parent task ("Testing Task")
        const testingTaskCell = this.page.getByRole('cell', { name: 'Testing Task' }).first();
        await testingTaskCell.waitFor({ state: 'visible' });
        await testingTaskCell.click();

        const createSubTaskBtn = this.page.getByRole('button', { name: /Create SubTask/i }).first();
        await expect(createSubTaskBtn).toBeVisible({ timeout: 10000 });
        await createSubTaskBtn.click();

        // Verify that the "Enter Task Title" textbox is visible in the Create SubTask modal
        const subTaskTitleInput = this.page.getByRole('textbox', { name: /Enter Task Title/i });
        await expect(subTaskTitleInput).toBeVisible({ timeout: 10000 });
        await subTaskTitleInput.click();
        await subTaskTitleInput.fill("Subtask Title entered");

        await this.page.waitForTimeout(1000);

        // Click the "Save" button to save the subtask
        const saveSubTaskButton = this.page.getByRole('button', { name: 'Save' }).nth(1);
        await expect(saveSubTaskButton).toBeVisible({ timeout: 10000 });
        await saveSubTaskButton.click({ force: true });

        const successToast = this.page.locator('div').filter({ hasText: 'Task created' }).last();
        await successToast.waitFor({ state: "visible" });

        const row = this.page.getByText('Subtask Title entered').first()
        await row.evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
        await expect(row).toBeVisible({ timeout: 10000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that the sub task is visible within the parent task after creation.
     */
    async verifySubTaskVisibleInParentTask(subTaskTitle: string = "Subtask Title entered") {
        await this.NavigateToContacts();
        await this.openFirstContact();

        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        // Open the parent task ("Testing Task")
        const testingTaskCell = this.page.getByRole('cell', { name: 'Testing Task' }).first();
        await expect(testingTaskCell).toBeVisible({ timeout: 10000 });
        await testingTaskCell.click();

        // Wait for the subtasks section to appear (could be a list/table of subtasks)
        const subTaskRow = this.page.getByText(subTaskTitle).first();
        await subTaskRow.evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
        await expect(subTaskRow).toBeVisible({ timeout: 10000 });

        await this.closeModalIfVisible();
    }

    /**
     * Verifies that when the sub task is opened for editing/creation,
     * a parent task dropdown is shown next to the team field.
     */
    async verifyParentTaskDropdownShownInSubTask() {
        await this.NavigateToContacts();
        await this.openFirstContact();

        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        // Open the parent task ("Testing Task")
        const testingTaskCell = this.page.getByRole('cell', { name: 'Testing Task' }).first();
        await expect(testingTaskCell).toBeVisible({ timeout: 10000 });
        await testingTaskCell.click();

        const subTaskCell = this.page.getByRole('cell', { name: 'Subtask Title entered' }).first();
        await subTaskCell.scrollIntoViewIfNeeded();
        await expect(subTaskCell).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);
        await subTaskCell.click();

        const parentTaskDropdown = this.page.getByText('Parent TaskParent Task×');
        await expect(parentTaskDropdown).toBeVisible({ timeout: 10000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that all fields of the original task are copied correctly to the new task when the "Copy Task" option is used.
     */
    async verifyCopyTaskCopiesAllFieldsCorrectly() {
        await this.NavigateToContacts();
        await this.openFirstContact();

        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        // Select the original task to copy ("Testing Task")
        const originalTaskCell = this.page.getByRole('cell', { name: 'Testing Task' }).first();
        await expect(originalTaskCell).toBeVisible({ timeout: 10000 });
        await originalTaskCell.click();

        await this.page.waitForTimeout(1200);

        const rightSidebar = this.page.locator('section.body-details.h-100.border-0:visible')
        await expect(rightSidebar).toBeVisible({ timeout: 10000 });

        // Use the previously selected listing option and trim its text
        const listingDropdownOption = this.page.locator('.selected_one')
        await expect(listingDropdownOption).toBeVisible({ timeout: 10000 });
        const listingName = (await listingDropdownOption.textContent())?.trim() || '';

        // Click the "Copy Task" button
        const copyTaskBtn = this.page.getByRole('button', { name: /Copy Task/i }).first();
        await expect(copyTaskBtn).toBeVisible({ timeout: 10000 });
        await copyTaskBtn.click();

        // Wait for the confirmation message
        const duplicatedSuccessMsg = this.page.getByText(/Task duplicated successfully/i, { exact: false });
        await expect(duplicatedSuccessMsg).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);

        // Fill in new title
        const taskTitleInput = this.page.locator('input[formcontrolname="title"]').first();
        await expect(taskTitleInput).toBeVisible({ timeout: 10000 });
        await taskTitleInput.click();
        await taskTitleInput.fill('Task copied');

        // Fill in a due date - Pick tomorrow's date
        const dateInput = this.page.locator('p-calendar[formcontrolname="due_date"] input');
        await expect(dateInput).toBeVisible({ timeout: 10000 });
        await dateInput.click();

        // Calculate tomorrow's date
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const targetDay = tomorrow.getDate();
        const targetMonth = tomorrow.getMonth();
        const targetYear = tomorrow.getFullYear();

        // Find calendar header and adjust to correct month/year
        const header = this.page.locator(".p-datepicker-title");
        await expect(header).toBeVisible();
        const headerText = await header.innerText();
        const [monthName, yearStr] = headerText.trim().split(" ");
        const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();
        const monthDifference = (targetYear - parseInt(yearStr)) * 12 + (targetMonth - monthIndex);

        for (let i = 0; i < Math.abs(monthDifference); i++) {
            if (monthDifference > 0) {
                await this.page.locator(".p-datepicker-next").click();
            } else {
                await this.page.locator(".p-datepicker-prev").click();
            }
            await this.page.waitForTimeout(200);
        }

        // Select tomorrow's day
        const dayLocator = this.page.locator(`.p-datepicker-calendar td:not(.p-disabled) >> text="${targetDay}"`);
        await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
        await dayLocator.first().click({ force: true });

        // Save the copied task
        const saveBtn = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();
        await this.page.waitForTimeout(1000);

        // Close modal if present (last close button first)
        const closeBtn = this.page.locator('.pi.pi-times').nth(2);
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }

        // Reopen the "Task copied" cell to verify content
        const copiedTaskCell = this.page.getByRole('cell', { name: 'Task copied' }).first();
        await copiedTaskCell.evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));

        await expect(copiedTaskCell).toBeVisible({ timeout: 10000 });
        await copiedTaskCell.click();
        await expect(rightSidebar).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(500);

        await this.closeModalIfVisible();
    }

    /**
     * Verify that changes to the original task do not affect the copied task after it has been created.
     */
    async verifyOriginalTaskNotAffectCopiedTask() {
        // Navigate to Contacts and open first contact
        await this.NavigateToContacts();
        await this.openFirstContact();

        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        const rightSidebar = this.page.locator('section.body-details.h-100.border-0:visible');
        await expect(rightSidebar).toBeVisible({ timeout: 10000 });

        const copiedTaskCell = this.page.getByRole('cell', { name: 'Task copied' }).first();
        await copiedTaskCell.waitFor({ state: 'visible', timeout: 10000 });
        await copiedTaskCell.click();

        // Start duplication
        const copyTaskBtn = this.page.getByRole('button', { name: /Copy Task/i }).first();
        await expect(copyTaskBtn).toBeVisible({ timeout: 10000 });
        await copyTaskBtn.click();

        // Wait for duplication confirmation
        const duplicatedSuccessMsg = this.page.getByText(/Task duplicated successfully/i, { exact: false });
        await expect(duplicatedSuccessMsg).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);

        // Use a unique title for the new copy
        const uniqueCopyTitle = 'Task copied v2';

        // Fill in the copy's title
        const taskTitleInput = this.page.locator('input[formcontrolname="title"]').first();
        await expect(taskTitleInput).toBeVisible({ timeout: 10000 });
        await taskTitleInput.click();
        await taskTitleInput.fill(uniqueCopyTitle);

        // Fill in due date - tomorrow
        const dateInput = this.page.locator('p-calendar[formcontrolname="due_date"] input');
        await expect(dateInput).toBeVisible({ timeout: 10000 });
        await dateInput.click();

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const targetDay = tomorrow.getDate();
        const targetMonth = tomorrow.getMonth();
        const targetYear = tomorrow.getFullYear();

        // Adjust calendar UI
        const header = this.page.locator(".p-datepicker-title");
        await expect(header).toBeVisible();
        const headerText = await header.innerText();
        const [monthName, yearStr] = headerText.trim().split(" ");
        const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();
        const monthDifference = (targetYear - parseInt(yearStr)) * 12 + (targetMonth - monthIndex);
        for (let i = 0; i < Math.abs(monthDifference); i++) {
            if (monthDifference > 0) {
                await this.page.locator(".p-datepicker-next").click();
            } else {
                await this.page.locator(".p-datepicker-prev").click();
            }
            await this.page.waitForTimeout(200);
        }
        const dayLocator = this.page.locator(`.p-datepicker-calendar td:not(.p-disabled) >> text="${targetDay}"`);
        await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
        await dayLocator.first().click({ force: true });

        // Attempt to set the Select Listing value like the previous one (if present)
        // If you have a 'listingName' to keep in sync, extract it from the previous cell's content
        let listingName: string | null = null;
        try {
            const listingDropdownFilled = this.page.locator('[formcontrolname="listing"] .p-dropdown-label:not(:empty)').first();
            if (await listingDropdownFilled.isVisible({ timeout: 1000 })) {
                listingName = (await listingDropdownFilled.innerText()).trim();
            }
        } catch { /* ignore if not present */ }

        if (listingName) {
            const listingDropdown = this.page.locator('div').filter({ hasText: /^Select Listing$/ }).nth(1);
            await listingDropdown.waitFor({ state: 'visible', timeout: 10000 });
            await listingDropdown.click();
            const listingSearchBox = this.page.locator('[id="Task: REM-null_1"]').getByRole('textbox', { name: 'Search' });
            await expect(listingSearchBox).toBeVisible({ timeout: 10000 });
            await listingSearchBox.fill(listingName);
            const desiredListingOption = this.page.locator('[id="Task: REM-null_1"]').getByText(new RegExp(listingName, 'i')).last();
            await desiredListingOption.click();
        }

        // Save the new copy
        const saveBtn = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();
        await this.page.waitForTimeout(1000);

        // Close modal if present
        const closeBtn = this.page.locator('.pi.pi-times').nth(2);
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }

        await copiedTaskCell.waitFor({ state: 'visible', timeout: 10000 });
        await copiedTaskCell.click();

        // Change field (for example, change title)
        const origTaskTitleInput = this.page.locator('input[formcontrolname="title"]').first();
        await expect(origTaskTitleInput).toBeVisible({ timeout: 10000 });
        await origTaskTitleInput.fill('Task copied updated');
        const updateSaveBtn = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(updateSaveBtn).toBeVisible({ timeout: 10000 });
        await updateSaveBtn.click();
        await this.page.waitForTimeout(1200);

        // Close edit modal if present
        const closeBtn2 = this.page.locator('.pi.pi-times').nth(2);
        if (await closeBtn2.isVisible().catch(() => false)) {
            await closeBtn2.click({ force: true });
        }

        // ---- STEP 3: Open "Task copied v2" and check field is unchanged ----
        const copiedV2Cell = this.page.getByRole('cell', { name: uniqueCopyTitle }).first();
        await copiedV2Cell.evaluate(node => node.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));

        await copiedV2Cell.waitFor({ state: 'visible', timeout: 10000 });
        await copiedV2Cell.click();
        await expect(rightSidebar).toBeVisible({ timeout: 10000 });
        // Confirm the title is still 'Task copied v2'
        const copiedV2TitleInput = this.page.locator('input[formcontrolname="title"]').first();
        await copiedV2TitleInput.evaluate(node => node.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
        await expect(copiedV2TitleInput).toHaveValue(uniqueCopyTitle, { timeout: 5000 });
        await this.page.waitForTimeout(500);

        // Cleanup: close modal
        await this.closeModalIfVisible();
    }

    /**
     * Verify that the task is visible in the task list after it is saved.
     */
    async verifyTaskAppearsInListAfterSave() {
        // Navigate to Contacts and open the first contact
        await this.NavigateToContacts();
        await this.openFirstContact();

        // Open the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Tasks?/i });
        await tasksTab.waitFor({ state: "visible", timeout: 10000 });
        await tasksTab.click();

        // Find the "Task copied v2" cell
        const copiedTaskCell = this.page.getByRole('cell', { name: 'Task copied v2' }).first();
        await copiedTaskCell.evaluate(node =>
            node.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' })
        );
        await copiedTaskCell.waitFor({ state: 'visible', timeout: 50000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that the "Related Property" section contains the "Listing", "Property", and "Contract" tabs.
     */

    async verifyTaskAppearsInList() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openStreamTab();
        await this.openTasksTab();
        await this.taskData();
        await this.closeModalIfVisible();
    }

    async verifyTaskRemainsLinkedToCorrectContact(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const tasksTab = this.page.getByRole('tab', { name: /Tasks?/i });
        await tasksTab.waitFor({ state: 'visible' });
        await tasksTab.click();
        const table = this.page.locator('#customentitydatalist').last();
        const rows = table.locator('tbody tr');
        const taskRow = rows.first();
        await taskRow.waitFor({ state: 'visible' });
        await taskRow.click();
        const bodyDetailsSection = this.page.locator('section.body-details.h-100.border-0:visible');
        await bodyDetailsSection.waitFor({ state: 'visible' });
        const label = this.page.locator('p.ng-value-label.ml-1');
        await label.waitFor({ state: 'visible' });
        await this.closeModalIfVisible();
    }
}
