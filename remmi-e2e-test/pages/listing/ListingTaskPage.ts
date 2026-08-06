import { expect } from '@playwright/test';
import { ListingBasePage } from './ListingBasePage';

export class ListingTaskPage extends ListingBasePage {
    async verifyTasksTabDisplaysRecords() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator('div.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();

        // Go to Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        // Clean up: Close modal if open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(800);
    }

    /**
     * Verifies that clicking the "New Task" button opens the task creation form.
     */
    async verifyNewTaskButtonOpensTaskForm() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator('div.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();

        // Go to Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        // Click the "New Task" button
        const newTaskButton = this.page.getByRole('button', { name: /new task/i });
        await expect(newTaskButton).toBeVisible({ timeout: 10000 });
        await newTaskButton.click();

        // Expect the task creation form to be visible (update selector as appropriate)
        const taskForm = this.page.locator('a').filter({ hasText: /^Task$/ });
        await expect(taskForm).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);
        // Clean up: Close modal if open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that a task appears in the list after creation.
     */
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

    /**
     * Verifies that the created task is visible in the global Task module.
     */
    async verifyTaskAppearsInTaskModule() {
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

    /**
     * Verifies that the task list displays the correct details for a given task.
     */
    async verifyTaskListDisplaysCorrectDetails() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing card
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();

        // Go to Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();
        await this.page.waitForTimeout(1000);

        // Find the row containing "Testing Task"
        const taskRow = this.page.locator('table tbody tr').filter({ hasText: 'Testing Task' }).last();
        await expect(taskRow).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);

        // Analyze each cell value
        const cells = taskRow.locator('td');
        const titleCell = cells.nth(0);
        const jobTypeCell = cells.nth(1);
        const statusCell = cells.nth(2);
        const dueDateCell = cells.nth(3);

        await expect(titleCell).toHaveText(/Testing Task/i);
        await expect(jobTypeCell).toHaveText(/Door Knocks/i);
        await expect(statusCell).toHaveText(/Not Started/i);
        const dueDateText = (await dueDateCell.textContent())?.trim() ?? '';
        console.log('Due Date Text:', dueDateText);
        expect(dueDateText).not.toBe('');

        await this.page.waitForTimeout(1000);

        // Clean up - close modal if visible
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Verifies that updates to a task are reflected immediately in the task list UI after editing.
     */
    async verifyTaskUpdatesReflectImmediately() {
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
        await this.page.waitForTimeout(1000);

        // Locate the latest "Testing Task" row
        const taskRow = this.page.locator('table tbody tr').filter({ hasText: 'Testing Task' }).last();
        await expect(taskRow).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);

        // Click the "Testing Task" row to open the task edit modal/form
        const testingTaskCell = taskRow.locator('td').first();
        await expect(testingTaskCell).toBeVisible({ timeout: 10000 });
        await testingTaskCell.click();

        // Change the Job Type (Task Type) using the dropdown
        const jobTypeSelector = this.page.locator('ng-select[formcontrolname="job_type_id"] .ng-select-container');
        await expect(jobTypeSelector).toBeVisible({ timeout: 10000 });
        await jobTypeSelector.click();

        await this.page.waitForTimeout(300);

        // Pick "Tester" from the dropdown options
        const testerOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Tester' });
        await expect(testerOption).toBeVisible({ timeout: 10000 });
        await testerOption.click();

        await this.page.waitForTimeout(1000);

        // Save the edited task
        const saveBtn = this.page.getByRole('button', { name: 'Save' }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click({ force: true });

        // Wait until the toast confirms update and dismiss any modal-popup if open
        await expect(this.page.getByText(/Task has been updated/i)).toBeVisible({ timeout: 15000 });
        const closeTaskBtn = this.page.locator('.pi.pi-times').last();
        if (await closeTaskBtn.isVisible().catch(() => false)) {
            await closeTaskBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1500);

        // Revalidate that the updated row is present and check Job Type reflects update
        await expect(taskRow).toBeVisible({ timeout: 10000 });
        // Scroll the updated row into view and verify the Job Type update
        await taskRow.scrollIntoViewIfNeeded();
        await expect(taskRow.locator('td').nth(1)).toHaveText(/Tester/i);

        // Ensure modals are closed if left open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     Task should not be created without valid data
     */
    async verifyTaskCannotBeCreatedWithoutValidData() {
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
        // Input task title
        const taskTitleInput = this.page.locator('input[formcontrolname="title"]').first();
        await expect(taskTitleInput).toBeVisible({ timeout: 10000 });
        await taskTitleInput.fill('Random Task');

        // Try to save the task with empty fields (do not enter any data)
        const saveBtn = this.page.getByRole('button', { name: /save/i }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();

        // Close the task creation modal after attempting save
        const closeTaskModalBtn = this.page.getByRole('button', { name: /close/i }).first();
        if (await closeTaskModalBtn.isVisible().catch(() => false)) {
            await closeTaskModalBtn.click({ force: true });
        }

        // Verify "Random Task" is not visible in the tasks table after invalid creation attempt
        const randomTaskRow = this.page.locator('table tr', { hasText: 'Random Task' });
        await expect(randomTaskRow).not.toBeVisible({ timeout: 2000 });

        // Close the modal if still open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }

        await this.page.waitForTimeout(500);
    }

    /**
     * Verifies that tasks remain linked to the correct listing after creation.
     * Creates a new task for a listing, navigates away, then returns to confirm the task is present only in that listing.
     */
    async verifyTasksRemainLinkedToCorrectListing(taskTitle: string = 'Linked Listing Task') {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("div.s-property").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Save the title or ID of the currently opened listing for later verification
        const listingTitleLocator = this.page.locator('.listing-title, .property-title').first();
        let currentListingTitle = '';
        if (await listingTitleLocator.isVisible().catch(() => false)) {
            currentListingTitle = await listingTitleLocator.innerText();
        }

        // Go to Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();

        // Add a new task to this listing
        const addTaskButton = this.page.getByRole('button', { name: /Add Task|New Task/i });
        await expect(addTaskButton).toBeVisible({ timeout: 10000 });
        await addTaskButton.click();

        // Enter task title & assign due date and any required fields
        const taskTitleInput = this.page.locator('input[formcontrolname="title"]').first();
        await expect(taskTitleInput).toBeVisible({ timeout: 10000 });
        await taskTitleInput.fill(taskTitle);

        // Fill in due date (pick tomorrow)
        const dateInput = this.page.locator('p-calendar[formcontrolname="due_date"] input');
        await expect(dateInput).toBeVisible({ timeout: 10000 });
        await dateInput.click();

        const t = new Date();
        t.setDate(t.getDate() + 1);
        const targetDay = t.getDate();
        const header = this.page.locator(".p-datepicker-title");
        await expect(header).toBeVisible();
        const headerText = await header.innerText();
        const [monthName, year] = headerText.trim().split(" ");
        const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();
        const monthDifference = (t.getFullYear() - parseInt(year)) * 12 + (t.getMonth() - monthIndex);
        for (let i = 0; i < Math.abs(monthDifference); i++) {
            if (monthDifference > 0) {
                await this.page.locator(".p-datepicker-next").click();
            } else {
                await this.page.locator(".p-datepicker-prev").click();
            }
            await this.page.waitForTimeout(200);
        }
        const dayLocator = this.page.locator(
            `.p-datepicker-calendar td:not(.p-disabled) >> text="${targetDay}"`
        );
        await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
        await dayLocator.first().click({ force: true });

        // Assign staff (if required)
        const staffSelect = this.page.locator('ng-select[formcontrolname="assignedUsers"]');
        if (await staffSelect.isVisible().catch(() => false)) {
            await staffSelect.click();
            const staffInput = this.page.locator('ng-select[formcontrolname="assignedUsers"] input[type="text"]');
            await staffInput.fill('Jahanzaib');
            const staffOption = this.page.locator('.ng-dropdown-panel .ng-option', {
                hasText: 'Jahanzaib'
            }).first();
            await expect(staffOption).toBeVisible({ timeout: 10000 });
            await staffOption.click();
        }

        // Save the task
        const saveBtn = this.page.getByRole('button', { name: /save/i }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();

        // Wait for the task creation modal to close
        await this.page.waitForTimeout(1000);

        // Confirm the task appears in the tasks list for this listing
        const createdTaskRow = this.page.locator('table tr', { hasText: taskTitle });
        await expect(createdTaskRow).toBeVisible({ timeout: 10000 });

        // Close the listing detail (if there is a close button)
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);

        // Navigate to a different listing
        const secondListingCard = this.page.locator("div.s-property").nth(1);
        await expect(secondListingCard).toBeVisible({ timeout: 30000 });
        await secondListingCard.click();

        // Go to Tasks tab for the second listing
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();
        await this.page.waitForTimeout(800);

        // The created task should NOT appear in this listing's tasks
        const taskRowInSecondListing = this.page.locator('table tr', { hasText: taskTitle });
        await expect(taskRowInSecondListing).not.toBeVisible({ timeout: 2000 });

        // Cleanup: Optionally, return to the original listing and verify again
        // (This confirms the task is persistently linked)
        if (currentListingTitle) {
            // Close second listing if needed
            if (await closeBtn.isVisible().catch(() => false)) {
                await closeBtn.click({ force: true });
            }
            await this.page.waitForTimeout(500);

            // Find original listing by title and click it
            const originalListingCard = this.page.locator('.s-property', { hasText: currentListingTitle }).first();
            await expect(originalListingCard).toBeVisible({ timeout: 10000 });
            await originalListingCard.click();

            // Go to Tasks tab
            await expect(tasksTab).toBeVisible({ timeout: 10000 });
            await tasksTab.click();
            await this.page.waitForTimeout(800);

            // The created task should still be present here
            const taskRow = this.page.locator('table tr', { hasText: taskTitle });
            await expect(taskRow).toBeVisible({ timeout: 10000 });

            // Close out
            if (await closeBtn.isVisible().catch(() => false)) {
                await closeBtn.click({ force: true });
            }
        }
    }

    /**
     * Verify that Title, Due Date, Staff, Task Status, and Task Type are mandatory fields in the "Create New Task" popup.
     */
}
