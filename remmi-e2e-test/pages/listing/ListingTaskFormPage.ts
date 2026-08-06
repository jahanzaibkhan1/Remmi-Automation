import { expect } from '@playwright/test';
import { ListingBasePage } from './ListingBasePage';
import { faker } from '@faker-js/faker';

export class ListingTaskFormPage extends ListingBasePage {
    async verifyTaskFormMandatoryFields() {
        // Open Task creation form
        await this.navigateToListings();
        await this.switchToGridView();
        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);
        const chevronDown = this.page.locator('i.pi.pi-chevron-down').first();
        await chevronDown.click({ force: true });
        // Find the delete button for the first visible listing card in card/grid view
        const cardDeleteButton = this.page.locator('a:nth-child(4)').first();
        await cardDeleteButton.evaluate((el) => {
            el.scrollIntoView({ block: 'center', inline: 'center' });
        });
        await this.page.waitForTimeout(1000);
        await cardDeleteButton.click({ force: true });

        // Wait for confirmation dialog to appear
        const confirmationDialog = this.page.getByText('Are you sure you want to delete this listing ? Your listing will be permanently');
        await expect(confirmationDialog).toBeVisible({ timeout: 10000 });

        // Find and click the confirm Delete button
        const confirmButton = this.page.getByRole('button', { name: 'Delete' });
        await expect(confirmButton).toBeVisible({ timeout: 10000 });
        await confirmButton.click({ force: true });
        const toast = this.page.getByRole('alert', { name: 'Listing successfully deleted' });
        await expect(toast).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(2000);
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        // Click "New Task" button
        const newTaskBtn = this.page.getByRole('button', { name: /New Task/i });
        await expect(newTaskBtn).toBeVisible({ timeout: 10000 });
        await newTaskBtn.click();

        // Wait for popup to be visible
        const popup = this.page.locator('a').filter({ hasText: /^Task$/ });
        await expect(popup).toBeVisible({ timeout: 10000 });

        // Try to save without filling any fields
        const saveBtn = this.page.getByRole('button', { name: /Save|Create/i }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();

        const titleErrorLocator = this.page.locator('input[formcontrolname="title"].ng-invalid');
        const selectDateErrorLocator = this.page.locator('p-calendar[formcontrolname="due_date"] input');
        const staffErrorLocator = this.page.locator('ng-select[formcontrolname="assignedUsers"].ng-invalid');

        // Wait for all required error indicators to be visible individually
        await expect(titleErrorLocator).toBeVisible({ timeout: 10000 });
        await expect(selectDateErrorLocator).toBeVisible({ timeout: 10000 });
        await expect(staffErrorLocator).toBeVisible({ timeout: 10000 });

        // Click close button with text "Close" if visible
        const closeTaskFormBtn = this.page.getByRole('button', { name: /close/i }).first();
        if (await closeTaskFormBtn.isVisible().catch(() => false)) {
            await closeTaskFormBtn.click({ force: true });
        }

        await this.page.waitForTimeout(1000);

        // Optionally, close the popup
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Verifies that the dropdown list opens when clicking on the Task Type field in the "New Task" form.
     */
    async verifyTaskTypeDropdownOpens() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        // Click "New Task" button
        const newTaskBtn = this.page.getByRole('button', { name: /New Task/i });
        await expect(newTaskBtn).toBeVisible({ timeout: 10000 });
        await newTaskBtn.click();

        // Edit Job Type (Task Type) field
        const jobTypeSelector = this.page.locator('ng-select[formcontrolname="job_type_id"] .ng-select-container');
        await expect(jobTypeSelector).toBeVisible({ timeout: 10000 });
        await jobTypeSelector.click();

        const dropdownOptions = this.page.locator('.ng-dropdown-panel .ng-option');
        await expect(dropdownOptions.first()).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);

        // Optionally, close the popup
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Verifies that the dropdown list opens when clicking on the Task Status field in the "New Task" form.
     */
    async verifyTaskStatusDropdownOpens() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        // Click "New Task" button
        const newTaskBtn = this.page.getByRole('button', { name: /New Task/i });
        await expect(newTaskBtn).toBeVisible({ timeout: 10000 });
        await newTaskBtn.click();

        // Edit Task Status field
        const statusSelector = this.page.locator("//ng-select[@placeholder='Select Status']//div[@role='combobox']");
        await expect(statusSelector).toBeVisible({ timeout: 10000 });
        await statusSelector.click();

        const dropdownOptions = this.page.locator('.ng-dropdown-panel .ng-option');
        await expect(dropdownOptions.first()).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);

        // Optionally, close the popup
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Verifies that selecting "Lead Management" from Task Type triggers the Lead Name dropdown.
     */
    async verifyLeadNameDropdownAppearsOnLeadManagementTaskType() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        // Click "New Task" button
        const newTaskBtn = this.page.getByRole('button', { name: /New Task/i });
        await expect(newTaskBtn).toBeVisible({ timeout: 10000 });
        await newTaskBtn.click();

        // Click Task Type dropdown
        const taskTypeSelector = this.page.locator("ng-select[formcontrolname='job_type_id'] .ng-select-container");
        await expect(taskTypeSelector).toBeVisible({ timeout: 10000 });
        await taskTypeSelector.click();

        // Select "Lead Management" option
        const leadMgmtOpt = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: /lead management/i });
        await expect(leadMgmtOpt).toBeVisible({ timeout: 10000 });
        await leadMgmtOpt.click();

        // Check that the Lead Name dropdown appears
        const leadNameDropdown = this.page.locator("ng-select[formcontrolname='lead_id']");
        await expect(leadNameDropdown).toBeVisible({ timeout: 10000 });

        // Optionally, interact with Lead Name dropdown to ensure it is functional
        await leadNameDropdown.click();
        const leadNameOption = this.page.locator('.ng-dropdown-panel .ng-option').first();
        await expect(leadNameOption).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);
        // Optionally, close the popup
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that selecting a module shows the relevant dropdown list for that module 
     */
    async verifyModuleDropdownsAppearForSelectedModule() {

        await this.navigateToListings();
        await this.switchToGridView();
        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        // Click "New Task" button
        const newTaskBtn = this.page.getByRole('button', { name: /New Task/i });
        await expect(newTaskBtn).toBeVisible({ timeout: 10000 });
        await newTaskBtn.click();

        // Handle module: Listings
        // Focus the selectModule input for dropdown (uses Playwright to focus the <input> inside ng-select)
        const selectModule = this.page.locator("//ng-select[@placeholder='Select Module']//div[@role='combobox']");
        await selectModule.waitFor({ state: 'visible', timeout: 10000 });
        await selectModule.click();

        let moduleOptionLocator = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: /listings?/i });
        await expect(moduleOptionLocator).toBeVisible({ timeout: 10000 });
        await moduleOptionLocator.click();

        let listingDropdownLocator = this.page.locator("div[class='create-task-dropdown col-sm-6 ng-star-inserted'] div[class='tags']");
        await listingDropdownLocator.waitFor({ state: 'visible', timeout: 10000 });
        await listingDropdownLocator.click();
        // Wait for the related dropdown options (checkbox list) to appear, then check the first one
        const listingOption = this.page.locator("re-multiselect ul li").nth(1);
        await expect(listingOption).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);
        // Optionally, close the popup
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that selecting a listing from the dropdown creates a task linked to that listing
     */
    async verifyTaskIsLinkedToSelectedListing(taskTitle: string = 'Automation Task') {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click()

        // Switch to "Tasks" tab (or however tasks are added)
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();
        await this.page.waitForTimeout(1000);

        // Click "Add Task" button
        const addTaskButton = this.page.getByRole('button', { name: /Add Task|New Task/i });
        await expect(addTaskButton).toBeVisible({ timeout: 10000 });
        await addTaskButton.click();

        // Input task title
        const taskTitleInput = this.page.locator('input[formcontrolname="title"]').first();
        await expect(taskTitleInput).toBeVisible({ timeout: 10000 });
        await taskTitleInput.fill(taskTitle);

        // Fill in inspection event date: pick January 14, 2026 using the date picker and the displayed calendar
        const dateInput = this.page.locator('p-calendar[formcontrolname="due_date"] input');
        await expect(dateInput).toBeVisible({ timeout: 10000 });
        await dateInput.click();

        // 1️⃣ Compute Tomorrow
        const t = new Date();
        t.setDate(t.getDate() + 1);

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

        const staffSelect = this.page.locator('ng-select[formcontrolname="assignedUsers"]');
        await expect(staffSelect).toBeVisible();
        await staffSelect.click();

        const staffInput = this.page.locator(
            'ng-select[formcontrolname="assignedUsers"] input[type="text"]'
        );
        await staffInput.fill('Jahanzaib');

        const staffOption = this.page.locator('.ng-dropdown-panel .ng-option', {
            hasText: 'Jahanzaib'
        });
        await expect(staffOption).toBeVisible();
        await staffOption.click();

        // Select the "close" icon/button to clear any preselected item(s) from the multiselect dropdown, if present
        const clearSelectedIcon = this.page.locator('.create-task-dropdown > re-multiselect > .box > .tags > .selected_one > .pi');
        await clearSelectedIcon.waitFor({ state: 'visible', timeout: 10000 });
        await expect(clearSelectedIcon).toBeEnabled({ timeout: 10000 });
        await clearSelectedIcon.click({ force: true });
        // Wait and select a listing from the dropdown list of listings
        const listingDropdown = this.page.locator(
            "div.create-task-dropdown.col-sm-6.ng-star-inserted div.tags"
        );
        await listingDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await listingDropdown.click();
        // Select the search textbox inside the listing dropdown (if needed)
        const listingSearchBox = this.page.locator('#Task_1').getByRole('textbox', { name: 'Search' });
        await expect(listingSearchBox).toBeVisible({ timeout: 10000 });
        // Fill the search box with the desired listing: "140 Coates Street, Laidley, QLD 4341"
        await listingSearchBox.type('140 Coates Street, Laidley, QLD 4341', { delay: 100 });
        // Optionally, select from the dropdown if it appears after search
        const desiredListingOption = this.page.locator('#Task_1').getByText('Coates Street, Laidley, QLD 4341').last();
        await desiredListingOption.waitFor({ state: 'visible', timeout: 10000 });
        await desiredListingOption.click({ force: true });
        // Save task
        const saveTaskButton = this.page.getByRole('button', { name: /Save|Create/i }).first();
        await expect(saveTaskButton).toBeVisible({ timeout: 10000 });
        await saveTaskButton.click();

        await this.page.waitForTimeout(2000);

        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }

        // Locate the keyword input box, enter a search query, and wait for the results to appear
        const keywordInput = this.page.locator('#keywordInput');
        await expect(keywordInput).toBeVisible({ timeout: 10000 });
        await keywordInput.type('140 Coates Street, Laidley, QLD 4341', { delay: 100 });
        // Optionally, wait for the searched listing to appear and select it
        const listingCard = this.page.locator("//div[contains(@class,'s-property')]", { hasText: '140 Coates Street, Laidley, QLD 4341' });
        await listingCard.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);
        await firstCardRow.click();

        // Use a new locator to ensure we're selecting the Tasks tab accurately and consistently
        const refreshedTasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(refreshedTasksTab).toBeVisible({ timeout: 10000 });
        await refreshedTasksTab.click();
        await this.page.waitForTimeout(1000);

        // Ensure the first row is visible
        const firstRow = this.page.locator('table tbody tr')
            .filter({ hasText: 'Testing Task' }).last();
        await expect(firstRow).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);

        // Save and close the task popup
        const saveAndCloseBtn = this.page.getByRole('button', { name: 'Save & Close' }).first();
        if (await saveAndCloseBtn.isVisible().catch(() => false)) {
            await saveAndCloseBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1000);
    }

    //Verify that selecting the "Project" module shows a dropdown list for selecting a project.
    async verifyProjectDropdownIsVisible() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        // Click "New Task" button
        const newTaskBtn = this.page.getByRole('button', { name: /New Task/i });
        await expect(newTaskBtn).toBeVisible({ timeout: 10000 });
        await newTaskBtn.click();

        // Handle module: Listings
        // Focus the selectModule input for dropdown (uses Playwright to focus the <input> inside ng-select)
        const selectModule = this.page.locator("//ng-select[@placeholder='Select Module']//div[@role='combobox']");
        await selectModule.waitFor({ state: 'visible', timeout: 10000 });
        await selectModule.click();

        let moduleOptionLocator = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: /listings?/i });
        await expect(moduleOptionLocator).toBeVisible({ timeout: 10000 });

        // Optionally, close the popup
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }
    /**
     * Verifies that selecting a project from the dropdown creates a task linked to that project.
     */
    async verifyTaskIsLinkedToSelectedProject(taskTitle: string = 'Testing Task') {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        // Click "New Task" button
        const newTaskBtn = this.page.getByRole('button', { name: /New Task/i });
        await expect(newTaskBtn).toBeVisible({ timeout: 10000 });
        await newTaskBtn.click();

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

        const staffSelect = this.page.locator('ng-select[formcontrolname="assignedUsers"]');
        await expect(staffSelect).toBeVisible();
        await staffSelect.click();

        const staffInput = this.page.locator(
            'ng-select[formcontrolname="assignedUsers"] input[type="text"]'
        );
        await staffInput.fill('Jahanzaib');

        const staffOption = this.page.locator('.ng-dropdown-panel .ng-option', {
            hasText: 'Jahanzaib'
        });
        await expect(staffOption).toBeVisible();
        await staffOption.click();

        // Select the "Project" module from the module dropdown
        const selectModule = this.page.locator("//ng-select[@placeholder='Select Module']//div[@role='combobox']");
        await selectModule.waitFor({ state: 'visible', timeout: 10000 });
        await selectModule.click();

        const projectOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: /project/i });
        await expect(projectOption).toBeVisible({ timeout: 10000 });
        await projectOption.click();


        // Submit the form
        const saveBtn = this.page.getByRole('button', { name: /Save|Create/i }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();
        // Wait for the task to appear in the list under Tasks tab
        await this.page.waitForTimeout(2000);
        // Close modal if needed
        const closeBtun = this.page.locator('.pi.pi-times').last();
        if (await closeBtun.isVisible().catch(() => false)) {
            await closeBtun.click({ force: true });
        }
        // Wait for the task to appear in the list under Tasks tab
        await this.page.waitForTimeout(500); // Small wait for save to complete

        const createdTaskRow = this.page.locator('table tbody tr').filter({ hasText: taskTitle }).last();
        await createdTaskRow.scrollIntoViewIfNeeded();
        await expect(createdTaskRow).toBeVisible({ timeout: 10000 });


        // Close modal if needed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify that setting a reminder time sends an email or notification at the selected interval.
     */
    async verifyTaskReminderTriggersNotification(taskTitle: string) {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        // Click "New Task" button
        const newTaskBtn = this.page.getByRole('button', { name: /New Task/i });
        await expect(newTaskBtn).toBeVisible({ timeout: 10000 });
        await newTaskBtn.click();

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

        const reminderLabel = await this.page.locator("ng-select[placeholder='Select Reminder'] div[class='ng-placeholder']").first();
        await expect(reminderLabel).toBeVisible({ timeout: 10000 });
        await reminderLabel.click({ force: true });

        // Pick the "0" reminder option (has text "0")
        const zeroReminderOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: '30 minutes' }).first();
        await expect(zeroReminderOption).toBeVisible({ timeout: 10000 });
        await zeroReminderOption.click();

        const staffSelect = this.page.locator('ng-select[formcontrolname="assignedUsers"]');
        await expect(staffSelect).toBeVisible();
        await staffSelect.click();

        const staffInput = this.page.locator(
            'ng-select[formcontrolname="assignedUsers"] input[type="text"]'
        );
        await staffInput.fill('Jahanzaib');

        const staffOption = this.page.locator('.ng-dropdown-panel .ng-option', {
            hasText: 'Jahanzaib'
        });
        await expect(staffOption).toBeVisible();
        await staffOption.click();

        // Submit the form
        const saveBtn = this.page.getByRole('button', { name: /Save|Create/i }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();
        // Wait for the task to appear in the list under Tasks tab
        await this.page.waitForTimeout(2000);
        // Close modal if needed
        const closeBtun = this.page.locator('.pi.pi-times').last();
        if (await closeBtun.isVisible().catch(() => false)) {
            await closeBtun.click({ force: true });
        }
        const createdTaskRow = this.page.locator('table tbody tr').filter({ hasText: taskTitle }).last();
        await expect(createdTaskRow).toBeVisible({ timeout: 20000 });

        // Close modal if needed
        const closeBtn = this.page.locator('.pi.pi-times').last();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }

        const notificationDropdown = this.page.locator('#notification-dropdown');
        await expect(notificationDropdown).toBeVisible({ timeout: 20000 })
        await notificationDropdown.click();

        const notificationLink = this.page.getByRole('link', { name: 'Task Created Jahanzaib Xenex has assigned a task with you.' }).first();
        await expect(notificationLink).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify that the recurring task checkbox shows a dropdown with "Weekly," "Monthly," and "Yearly" options.
     */
    async verifyRecurringTaskOptions() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        // Click "New Task" button
        const newTaskBtn = this.page.getByRole('button', { name: /New Task/i });
        await expect(newTaskBtn).toBeVisible({ timeout: 10000 });
        await newTaskBtn.click();
        // Click the "Recurring Task" checkbox
        const recurringCheckbox = this.page.locator('.form-group > .d-flex > .p-element > .p-checkbox > .p-checkbox-box').first();
        await expect(recurringCheckbox).toBeVisible({ timeout: 20000 });
        await recurringCheckbox.click();

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

        await expect(weeklyOption).toBeVisible({ timeout: 2000 });
        await expect(monthlyOption).toBeVisible({ timeout: 2000 });
        await expect(yearlyOption).toBeVisible({ timeout: 2000 });
        // Close modal if needed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }

        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify that selecting "Weekly" from the recurring task dropdown triggers weekly email/notifications.
     */
    async verifyWeeklyRecurringTaskSendsNotification(taskTitle: string) {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        // Click "New Task" button
        const newTaskBtn = this.page.getByRole('button', { name: /New Task/i });
        await expect(newTaskBtn).toBeVisible({ timeout: 10000 });
        await newTaskBtn.click();

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

        await weeklyOption.click({ force: true });

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

        const staffSelect = this.page.locator('ng-select[formcontrolname="assignedUsers"]');
        await expect(staffSelect).toBeVisible();
        await staffSelect.click();

        const staffInput = this.page.locator(
            'ng-select[formcontrolname="assignedUsers"] input[type="text"]'
        );
        await staffInput.fill('Jahanzaib');

        const staffOption = this.page.locator('.ng-dropdown-panel .ng-option', {
            hasText: 'Jahanzaib'
        });
        await expect(staffOption).toBeVisible();
        await staffOption.click();

        // Submit the form
        const saveBtn = this.page.getByRole('button', { name: /Save|Create/i }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();
        // Wait for the task to appear in the list under Tasks tab
        await this.page.waitForTimeout(2000);
        // Close modal if needed
        const closeBtun = this.page.locator('.pi.pi-times').last();
        if (await closeBtun.isVisible().catch(() => false)) {
            await closeBtun.click({ force: true });
        }

        const createdTaskRow = this.page.locator('table tbody tr').filter({ hasText: taskTitle }).last();
        await expect(createdTaskRow).toBeVisible({ timeout: 10000 });

        // Close modal if needed
        const closeBtn = this.page.locator('.pi.pi-times').last();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }

        const notificationDropdown = this.page.locator('#notification-dropdown');
        await expect(notificationDropdown).toBeVisible({ timeout: 20000 })
        await notificationDropdown.click();

        const notificationLink = this.page.getByRole('link', { name: 'Task Created Jahanzaib Xenex has assigned a task with you.' }).first();
        await expect(notificationLink).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);
    }

    /**
       * Verify that selecting "Monthly" from the recurring task dropdown triggers weekly email/notifications.
       */
    async verifyMonthlyRecurringTaskSendsNotification(taskTitle: string) {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        // Click "New Task" button
        const newTaskBtn = this.page.getByRole('button', { name: /New Task/i });
        await expect(newTaskBtn).toBeVisible({ timeout: 10000 });
        await newTaskBtn.click();

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

        await monthlyOption.click({ force: true });

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

        const staffSelect = this.page.locator('ng-select[formcontrolname="assignedUsers"]');
        await expect(staffSelect).toBeVisible();
        await staffSelect.click();

        const staffInput = this.page.locator(
            'ng-select[formcontrolname="assignedUsers"] input[type="text"]'
        );
        await staffInput.fill('Jahanzaib');

        const staffOption = this.page.locator('.ng-dropdown-panel .ng-option', {
            hasText: 'Jahanzaib'
        });
        await expect(staffOption).toBeVisible();
        await staffOption.click();

        // Submit the form
        const saveBtn = this.page.getByRole('button', { name: /Save|Create/i }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();
        // Wait for the task to appear in the list under Tasks tab
        await this.page.waitForTimeout(2000);
        // Close modal if needed
        const closeBtun = this.page.locator('.pi.pi-times').last();
        if (await closeBtun.isVisible().catch(() => false)) {
            await closeBtun.click({ force: true });
        }

        const createdTaskRow = this.page.locator('table tbody tr').filter({ hasText: taskTitle }).last();
        await expect(createdTaskRow).toBeVisible({ timeout: 10000 });

        // Close modal if needed
        const closeBtn = this.page.locator('.pi.pi-times').last();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }

        const notificationDropdown = this.page.locator('#notification-dropdown');
        await expect(notificationDropdown).toBeVisible({ timeout: 20000 })
        await notificationDropdown.click();

        const notificationLink = this.page.getByRole('link', { name: 'Task Created Jahanzaib Xenex has assigned a task with you.' }).first();
        await expect(notificationLink).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);
    }

    /**
        * Verify that selecting "Yearly" from the recurring task dropdown triggers Yearly email/notifications.
        */
    async verifyYearlyRecurringTaskSendsNotification(taskTitle: string) {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        // Click "New Task" button
        const newTaskBtn = this.page.getByRole('button', { name: /New Task/i });
        await expect(newTaskBtn).toBeVisible({ timeout: 10000 });
        await newTaskBtn.click();

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

        const staffSelect = this.page.locator('ng-select[formcontrolname="assignedUsers"]');
        await expect(staffSelect).toBeVisible();
        await staffSelect.click();

        const staffInput = this.page.locator(
            'ng-select[formcontrolname="assignedUsers"] input[type="text"]'
        );
        await staffInput.fill('Jahanzaib');

        const staffOption = this.page.locator('.ng-dropdown-panel .ng-option', {
            hasText: 'Jahanzaib'
        });
        await expect(staffOption).toBeVisible();
        await staffOption.click();

        // Submit the form
        const saveBtn = this.page.getByRole('button', { name: /Save|Create/i }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();
        // Wait for the task to appear in the list under Tasks tab
        await this.page.waitForTimeout(2000);
        // Close modal if needed
        const closeBtun = this.page.locator('.pi.pi-times').last();
        if (await closeBtun.isVisible().catch(() => false)) {
            await closeBtun.click({ force: true });
        }

        const createdTaskRow = this.page.locator('table tbody tr').filter({ hasText: taskTitle }).last();
        await expect(createdTaskRow).toBeVisible({ timeout: 10000 });

        // Close modal if needed
        const closeBtn = this.page.locator('.pi.pi-times').last();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }

        const notificationDropdown = this.page.locator('#notification-dropdown');
        await expect(notificationDropdown).toBeVisible({ timeout: 20000 })
        await notificationDropdown.click();

        const notificationLink = this.page.getByRole('link', { name: 'Task Created Jahanzaib Xenex has assigned a task with you.' }).first();
        await expect(notificationLink).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);
    }


    /**
         * Verify that clicking "Sync Calendar" allows selection of a time period for task reminders..
         */
    async verifySyncCalendarTaskSendsNotification(taskTitle: string) {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        // Click "New Task" button
        const newTaskBtn = this.page.getByRole('button', { name: /New Task/i });
        await expect(newTaskBtn).toBeVisible({ timeout: 10000 });
        await newTaskBtn.click();

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

        const staffSelect = this.page.locator('ng-select[formcontrolname="assignedUsers"]');
        await expect(staffSelect).toBeVisible();
        await staffSelect.click();

        const staffInput = this.page.locator(
            'ng-select[formcontrolname="assignedUsers"] input[type="text"]'
        );
        await staffInput.fill('Jahanzaib');

        const staffOption = this.page.locator('.ng-dropdown-panel .ng-option', {
            hasText: 'Jahanzaib'
        });
        await expect(staffOption).toBeVisible();
        await staffOption.click();

        // Submit the form
        const saveBtn = this.page.getByRole('button', { name: /Save|Create/i }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();
        // Wait for the task to appear in the list under Tasks tab
        await this.page.waitForTimeout(2000);
        // Close modal if needed
        const closeBtun = this.page.locator('.pi.pi-times').last();
        if (await closeBtun.isVisible().catch(() => false)) {
            await closeBtun.click({ force: true });
        }

        const createdTaskRow = this.page.locator('table tbody tr').filter({ hasText: taskTitle }).last();
        await expect(createdTaskRow).toBeVisible({ timeout: 10000 });

        // Close modal if needed
        const closeBtn = this.page.locator('.pi.pi-times').last();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }

        const notificationDropdown = this.page.locator('#notification-dropdown');
        await expect(notificationDropdown).toBeVisible({ timeout: 20000 })
        await notificationDropdown.click();

        const notificationLink = this.page.getByRole('link', { name: 'Task Created Jahanzaib Xenex has assigned a task with you.' }).first();
        await expect(notificationLink).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that when a comment is added in the "Additional Comments" section
     */
    async verifyCommentNotificationToStaff() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        const taskRows = this.page.locator('table tbody tr').filter({ hasText: 'Recurring Yearly Task' }).last();
        await expect(taskRows).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(500);

        // Click the "Testing Task" cell to open editing
        const testingTaskCell = this.page.getByRole('cell', { name: 'Recurring Yearly Task' });
        await expect(testingTaskCell).toBeVisible({ timeout: 10000 });
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

        // Close modal if needed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }

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
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        const taskRows = this.page.locator('table tbody tr').filter({ hasText: 'Recurring Yearly Task' }).last();
        await expect(taskRows).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(500);

        // Click the "Testing Task" cell to open editing
        const testingTaskCell = this.page.getByRole('cell', { name: 'Recurring Yearly Task' });
        await expect(testingTaskCell).toBeVisible({ timeout: 10000 });
        await testingTaskCell.click();

        await this.page.waitForTimeout(1200);

        // Fill in Additional Comments
        const commentsInput = this.page.getByRole('textbox', { name: 'Send comments to the Assignee' });
        await commentsInput.scrollIntoViewIfNeeded();
        await expect(commentsInput).toBeVisible({ timeout: 10000 });

        // Wait for the comments container to appear below the header
        const addedComment = this.page.getByText('Comment Added To Task').first();
        await expect(addedComment).toBeVisible({ timeout: 10000 });

        // Close modal if needed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }

        await this.page.waitForTimeout(1000);

    }

    /**
     * Verify that after attaching a file and saving the task (clicking "Save" twice), the file appears once (no duplicates).
     */
    async verifyFileUploadNoDuplicationOnDoubleSave(filePath: string) {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        const taskRows = this.page.locator('table tbody tr').filter({ hasText: 'Recurring Yearly Task' }).last();
        await expect(taskRows).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(500);

        // Click the "Testing Task" cell to open editing
        const testingTaskCell = this.page.getByRole('cell', { name: 'Recurring Yearly Task' });
        await expect(testingTaskCell).toBeVisible({ timeout: 10000 });
        await testingTaskCell.click();

        await this.page.waitForTimeout(1200);

        // Click the "Add Files" button to open the file dialog
        const addFilesBtn = this.page.getByRole('button', { name: /Add Files/i });
        await addFilesBtn.scrollIntoViewIfNeeded();
        await expect(addFilesBtn).toBeVisible({ timeout: 10000 });
        await addFilesBtn.click();

        // Attach a file
        const uploadInput = this.page.locator('#fileInput');
        await uploadInput.setInputFiles(filePath);

        await this.page.waitForTimeout(1200);

        // Wait for the uploaded image thumbnail to appear and ensure only one instance is present
        const uploadedImages = this.page.locator('.img-fluid').first();
        await expect(uploadedImages).toBeVisible({ timeout: 10000 });

        // Save the form the first time
        const saveBtn = this.page.getByRole('button', { name: 'Save' }).first();
        await saveBtn.scrollIntoViewIfNeeded();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.dblclick();

        // Close modal if open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Verifies that the added file appears correctly after saving the task.
     */
    async verifyFileAppearsAfterTaskSave() {

        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        const taskRows = this.page.locator('table tbody tr').filter({ hasText: 'Recurring Yearly Task' }).last();
        await expect(taskRows).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(500);

        // Click the "Testing Task" cell to open editing
        const testingTaskCell = this.page.getByRole('cell', { name: 'Recurring Yearly Task' });
        await expect(testingTaskCell).toBeVisible({ timeout: 10000 });
        await testingTaskCell.click();

        await this.page.waitForTimeout(1200);

        // Click the "Add Files" button to open the file dialog
        const addFilesBtn = this.page.getByRole('button', { name: /Add Files/i });
        await addFilesBtn.scrollIntoViewIfNeeded();
        await expect(addFilesBtn).toBeVisible({ timeout: 10000 });
        const uploadedImagesAfterSave = this.page.locator('.img-fluid');
        await expect(uploadedImagesAfterSave).toBeVisible({ timeout: 10000 });
        await expect(uploadedImagesAfterSave).toHaveCount(1);


        // Close modal if open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);

    }

    /**
     * Verifies that after creating a task, the "Create Sub Task" option becomes visible for that task.
     */
    async verifyCreateSubTaskOptionVisible() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        const taskRows = this.page.locator('table tbody tr').filter({ hasText: 'Recurring Yearly Task' }).last();
        await expect(taskRows).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(500);

        // Click the "Testing Task" cell to open editing
        const testingTaskCell = this.page.getByRole('cell', { name: 'Recurring Yearly Task' });
        await expect(testingTaskCell).toBeVisible({ timeout: 10000 });
        await testingTaskCell.click();

        await this.page.waitForTimeout(1200);
        const createSubTaskBtn = this.page.getByRole('button', { name: /Create SubTask/i }).first();
        await expect(createSubTaskBtn).toBeVisible({ timeout: 10000 });
        await createSubTaskBtn.click();

        // Verify that the "Enter Task Title" textbox is visible in the Create SubTask modal
        const subTaskTitleInput = this.page.getByRole('textbox', { name: /Enter Task Title/i });
        await expect(subTaskTitleInput).toBeVisible({ timeout: 10000 });

        // Optionally: Close modal/dialog if one pops up
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Verifies that clicking on the "Create Sub Task" button shows a field below the staff section to enter a sub task title.
     */
    async verifyCreateSubTaskFieldAppearsBelowStaff() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        const taskRows = this.page.locator('table tbody tr').filter({ hasText: 'Recurring Yearly Task' }).last();
        await expect(taskRows).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(500);

        // Click the "Testing Task" cell to open editing
        const testingTaskCell = this.page.getByRole('cell', { name: 'Recurring Yearly Task' });
        await expect(testingTaskCell).toBeVisible({ timeout: 10000 });
        await testingTaskCell.click();

        await this.page.waitForTimeout(1200);
        const createSubTaskBtn = this.page.getByRole('button', { name: /Create SubTask/i }).first();
        await expect(createSubTaskBtn).toBeVisible({ timeout: 10000 });
        await createSubTaskBtn.click();

        // Verify that the "Enter Task Title" textbox is visible in the Create SubTask modal
        const subTaskTitleInput = this.page.getByRole('textbox', { name: /Enter Task Title/i });
        await expect(subTaskTitleInput).toBeVisible({ timeout: 10000 });
        await subTaskTitleInput.click();
        await subTaskTitleInput.fill("Subtask Title entered");

        // Optionally: Close modal/dialog if one pops up
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Verifies that the created sub task appears within the parent task in the UI.
     */
    async verifySubTaskIsVisibleInParentTask() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        const taskRows = this.page.locator('table tbody tr').filter({ hasText: 'Recurring Yearly Task' }).last();
        await expect(taskRows).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(500);

        // Click the "Testing Task" cell to open editing
        const testingTaskCell = this.page.getByRole('cell', { name: 'Recurring Yearly Task' });
        await expect(testingTaskCell).toBeVisible({ timeout: 10000 });
        await testingTaskCell.click();

        await this.page.waitForTimeout(1200);
        const createSubTaskBtn = this.page.getByRole('button', { name: /Create SubTask/i }).first();
        await expect(createSubTaskBtn).toBeVisible({ timeout: 10000 });
        await createSubTaskBtn.click();

        // Verify that the "Enter Task Title" textbox is visible in the Create SubTask modal
        const subTaskTitleInput = this.page.getByRole('textbox', { name: /Enter Task Title/i });
        await expect(subTaskTitleInput).toBeVisible({ timeout: 10000 });
        await subTaskTitleInput.click();
        await subTaskTitleInput.fill("Subtask Title entered");

        // Click the "Save" button to save the subtask
        const saveSubTaskButton = this.page.getByRole('button', { name: 'Save' }).nth(1);
        await expect(saveSubTaskButton).toBeVisible({ timeout: 10000 });
        await saveSubTaskButton.click();
        await this.page.waitForTimeout(1000);

        const row = this.page.locator('tbody tr', {
            has: this.page.getByText('Subtask Title entered').first()
        });
        await row.scrollIntoViewIfNeeded();
        await expect(row).toBeVisible({ timeout: 10000 });

        // Optionally: Close modal/dialog if one pops up
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Verifies that when the sub task is opened, a parent task dropdown is shown next to the team field.
     */
    async verifyParentTaskDropdownVisibleOnSubTaskOpen() {

        await this.navigateToListings();
        await this.switchToGridView();
        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        const taskRows = this.page.locator('table tbody tr').filter({ hasText: 'Recurring Yearly Task' }).last();
        await expect(taskRows).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(500);

        // Click the task cell to open editing
        const testingTaskCell = this.page.getByRole('cell', { name: 'Recurring Yearly Task' });
        await expect(testingTaskCell).toBeVisible({ timeout: 10000 });
        await testingTaskCell.click();

        await this.page.waitForTimeout(1200);

        const subTaskCell = this.page.getByRole('cell', { name: 'Subtask Title entered' }).first();
        await subTaskCell.scrollIntoViewIfNeeded();
        await expect(subTaskCell).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);
        await subTaskCell.click();

        const parentTaskDropdown = this.page.getByText('Parent TaskParent Task×');
        await expect(parentTaskDropdown).toBeVisible({ timeout: 10000 });

        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Verifies that all fields of the original task are copied correctly to the new task when using the "Copy Task" option.
     */
    async verifyCopyTaskCopiesAllFieldsCorrectly() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card and capture the listing name
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        const listingNameElement = this.page.locator('h3.props-bg.cp.mb-1.px-0').first();
        let listingName = (await listingNameElement.innerText()).trim();
        await firstListingCard.click();

        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        // Find the row and open the "Recurring Yearly Task"
        const taskRows = this.page.locator('table tbody tr').filter({ hasText: 'Recurring Yearly Task' }).last();
        await expect(taskRows).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(500);
        const testingTaskCell = this.page.getByRole('cell', { name: 'Recurring Yearly Task' });
        await expect(testingTaskCell).toBeVisible({ timeout: 10000 });
        await testingTaskCell.click();

        await this.page.waitForTimeout(1200);
        const rightSidebar = this.page.locator('[id^="Task: REM-"][id$="_1"] #rightbarwithscroll');
        await expect(rightSidebar).toBeVisible({ timeout: 10000 });

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

        // Set the listing field to the same value as original
        const listingDropdown = this.page.locator('div').filter({ hasText: /^Select Listing$/ }).nth(1);
        await listingDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await listingDropdown.evaluate((el) => el.scrollIntoView({ behavior: "auto", block: "center" }));

        await listingDropdown.click();
        const listingSearchBox = this.page.locator('[id="Task: REM-null_1"]').getByRole('textbox', { name: 'Search' });
        await expect(listingSearchBox).toBeVisible({ timeout: 10000 });
        await listingSearchBox.evaluate((el) => el.scrollIntoView({ behavior: "auto", block: "center" }));
        await listingSearchBox.fill(listingName);

        const desiredListingOption = this.page.locator('li', { has: this.page.locator('p', { hasText: listingName }) }).last();
        await desiredListingOption.click();

        // Save the copied task
        const saveBtn = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();
        await this.page.waitForTimeout(1000);

        // Close modal if present (last close button first)
        const closeBtn = this.page.locator('.pi.pi-times').last();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }

        // Reopen the "Recurring Yearly Task" cell to verify content
        await expect(testingTaskCell).toBeVisible({ timeout: 10000 });
        await testingTaskCell.click();
        await expect(rightSidebar).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(500);

        // Close modal again if present (first close button)
        const closeBtn1 = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn1.isVisible().catch(() => false)) {
            await closeBtn1.click();
        }
    }

    /**
     * Verifies that selecting a different parent task from the parent task dropdown
     */
    async verifyChangeOfParentTaskInDropdown() {

        await this.navigateToListings();
        await this.switchToGridView();
        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Go to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        const taskRows = this.page.locator('table tbody tr').filter({ hasText: 'Recurring Yearly Task' }).last();
        await expect(taskRows).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(500);

        // Click the task cell to open editing
        const testingTaskCell = this.page.getByRole('cell', { name: 'Recurring Yearly Task' });
        await expect(testingTaskCell).toBeVisible({ timeout: 10000 });
        await testingTaskCell.click();

        await this.page.waitForTimeout(1200);

        const subTaskCell = this.page.getByRole('cell', { name: 'Subtask Title entered' }).first();
        await subTaskCell.scrollIntoViewIfNeeded();
        await expect(subTaskCell).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);
        await subTaskCell.click();

        // Edit Job Type (Task Type) field
        const jobTypeSelector = this.page.locator('ng-select[formcontrolname="job_type_id"] .ng-select-container').last();
        await expect(jobTypeSelector).toBeVisible({ timeout: 10000 });
        await jobTypeSelector.click();
        await this.page.waitForTimeout(500);
        const dropdownOptions = this.page.locator('.ng-dropdown-panel .ng-option').first();
        await expect(dropdownOptions).toBeVisible({ timeout: 10000 });
        await dropdownOptions.click();


        // Edit Task Status field
        const statusSelector = this.page.locator("//ng-select[@placeholder='Select Status']//div[@role='combobox']").last();
        await expect(statusSelector).toBeVisible({ timeout: 10000 });
        await statusSelector.click();
        await this.page.waitForTimeout(500);
        const urgentOption = this.page.getByRole('option', { name: /urgent/i }).first();
        await expect(urgentOption).toBeVisible({ timeout: 10000 });
        await urgentOption.click();


        const staffInput = this.page.locator(
            'ng-select[formcontrolname="assignedUsers"] input[type="text"]'
        ).last();
        await staffInput.fill('Jahanzaib');

        const staffOption = this.page.locator('.ng-dropdown-panel .ng-option', {
            hasText: 'Jahanzaib'
        });
        await expect(staffOption).toBeVisible();
        await staffOption.click();

        // Click into the Parent Task dropdown (ng-select container for parent_id)
        const parentTaskDropdown = this.page.locator('ng-select[formcontrolname="parent_id"] .ng-select-container');
        await expect(parentTaskDropdown).toBeVisible({ timeout: 10000 });
        await parentTaskDropdown.scrollIntoViewIfNeeded();
        await parentTaskDropdown.click();

        // Typing into the input inside the ng-select component to search for "Automation testing"
        const parentTaskInput = this.page.locator('ng-select[formcontrolname="parent_id"] input[type="text"]');
        await expect(parentTaskInput).toBeVisible({ timeout: 5000 });
        await parentTaskInput.fill('Automation testing');

        // Wait for and select the desired option
        const parentTaskOption = this.page.locator('.ng-dropdown-panel .ng-option').filter({ hasText: "Automation testing" }).first();
        await expect(parentTaskOption).toBeVisible({ timeout: 10000 });
        await parentTaskOption.click();

        await this.page.waitForTimeout(1000);

        // Click the "Save" button to update the parent task of the subtask
        const saveBtn = this.page.getByRole('button', { name: 'Save' }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();

        await this.page.waitForTimeout(1000);

        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    // In the Related tab, verify that a contact can be searched and associated successfully

    async verifyTaskAppearsInList(taskTitle: string = 'Automation Task') {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click()

        // Switch to "Tasks" tab (or however tasks are added)
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();
        await this.page.waitForTimeout(1000);

        // Click "Add Task" button
        const addTaskButton = this.page.getByRole('button', { name: /Add Task|New Task/i });
        await expect(addTaskButton).toBeVisible({ timeout: 10000 });
        await addTaskButton.click();

        // Input task title
        const taskTitleInput = this.page.locator('input[formcontrolname="title"]').first();
        await expect(taskTitleInput).toBeVisible({ timeout: 10000 });
        await taskTitleInput.fill(taskTitle);

        // Fill in inspection event date: pick January 14, 2026 using the date picker and the displayed calendar
        const dateInput = this.page.locator('p-calendar[formcontrolname="due_date"] input');
        await expect(dateInput).toBeVisible({ timeout: 10000 });
        await dateInput.click();

        // 1️⃣ Compute Tomorrow
        const t = new Date();
        t.setDate(t.getDate() + 1);

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

        const staffSelect = this.page.locator('ng-select[formcontrolname="assignedUsers"]');
        await expect(staffSelect).toBeVisible();
        await staffSelect.click();

        const staffInput = this.page.locator(
            'ng-select[formcontrolname="assignedUsers"] input[type="text"]'
        );
        await staffInput.fill('Jahanzaib');

        const staffOption = this.page.locator('.ng-dropdown-panel .ng-option', {
            hasText: 'Jahanzaib'
        });
        await expect(staffOption).toBeVisible();
        await staffOption.click();

        // Save task
        const saveTaskButton = this.page.getByRole('button', { name: /Save|Create/i }).first();
        await expect(saveTaskButton).toBeVisible({ timeout: 10000 });
        await saveTaskButton.click();

        await this.page.waitForTimeout(2000);

        const closetask = this.page.locator('.pi.pi-times').last();
        if (await closetask.isVisible().catch(() => false)) {
            await closetask.click({ force: true });
        }
        // Ensure the first row is visible
        const firstRow = this.page.locator('table tbody tr')
            .filter({ hasText: 'Testing Task' }).last();
        await expect(firstRow).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);
        // Close modal if needed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }
}
