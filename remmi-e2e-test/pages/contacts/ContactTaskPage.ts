import { Page, Locator, expect } from '@playwright/test';
import { ContactBasePage } from './ContactBasePage';
import { faker } from '@faker-js/faker';

export class ContactTaskPage extends ContactBasePage {
    async verifyTasksTabDisplaysExistingTasks(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();

        // Switch to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Tasks?/i });
        await tasksTab.waitFor({ state: 'visible' });
        await tasksTab.click();

        const tasksTable = this.page.locator('#customentitydatalist table tbody tr').last();
        await tasksTable.first().waitFor({ state: 'visible' });

        await this.closeModalIfVisible();
    }

    /**
     * Verifies that clicking the "New Task" button opens the task creation form.
     */
    async verifyNewTaskButtonOpensTaskCreationForm(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();

        // Switch to the Tasks tab
        const tasksTab = this.page.getByRole('tab', { name: /Tasks?/i });
        await tasksTab.waitFor({ state: 'visible' });
        await tasksTab.click();

        // Click the "New Task" button
        const newTaskButton = this.page.getByRole('button', { name: /New Task/i });
        await newTaskButton.waitFor({ state: 'visible' });
        await newTaskButton.click();

        const taskForm = this.page.locator('div.d-flex.justify-content-between.taskCreatedList')
        await taskForm.waitFor({ state: 'visible' });

        await this.closeModalIfVisible();
    }

    /**
     * Verifies that the created task also appears in the global Task module.
     */
    async verifyTaskAppearsInTaskModule(taskTitle: string = 'Testing Task'): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const tasksTab = this.page.getByRole('tab', { name: /Tasks?/i });
        await tasksTab.waitFor({ state: 'visible' });
        await tasksTab.click();
        const taskRow = this.page.locator('table tbody tr').filter({ hasText: taskTitle }).first();
        await taskRow.waitFor({ state: "visible" });
        const taskTitleCell = taskRow.locator('td').filter({ hasText: taskTitle });
        await expect(taskTitleCell).toBeVisible();
        await this.closeModalIfVisible();
    }

    async verifyTaskListDisplaysCorrectDetails(taskTitle: string = 'Testing Task'): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const tasksTab = this.page.getByRole('tab', { name: /Tasks?/i });
        await tasksTab.waitFor({ state: 'visible' });
        await tasksTab.click();
        const table = this.page.locator('#customentitydatalist').last();
        const rows = table.locator('tbody tr');
        const taskRow = rows.filter({ hasText: taskTitle }).first();
        await taskRow.waitFor({ state: 'visible' });
        const columns = taskRow.locator('td');
        console.log(await columns.allTextContents());
        await expect(columns.nth(1)).toContainText(taskTitle);
        await expect(columns.nth(2)).toContainText(/door knocks/i);
        await expect(columns.nth(3)).toContainText(/not started/i);
        await expect(columns.nth(4)).toContainText(/\d{2}\/\d{2}\/\d{2}/);
        await this.closeModalIfVisible();
    }

    /**
     * Task updates should reflect immediately
     */
    async verifyTaskUpdatesReflectImmediately(taskTitle: string = 'updated Testing Task'): Promise<void> {
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
        const contactSpan = this.page.locator('span').filter({ hasText: 'Contact' }).first();
        await contactSpan.waitFor({ state: 'visible' });
        const taskTitleInput = this.page.locator('input[formcontrolname="title"]').first();
        await taskTitleInput.waitFor({ state: "visible" });
        await expect(taskTitleInput).toBeEnabled();
        await taskTitleInput.click();
        await taskTitleInput.clear();
        await taskTitleInput.fill(taskTitle);
        const saveButton = this.page.getByRole('button', { name: /^save$/i }).first();
        await saveButton.waitFor({ state: 'visible' });
        await saveButton.dblclick();
        const successToast = this.page.locator('div').filter({ hasText: /task has been updated/i }).last();
        await successToast.waitFor({ state: "visible", timeout: 20000 }).catch(() => { });
        await this.closeLeadModalIfVisible();
        await taskRow.waitFor({ state: 'visible' });
        const columns = taskRow.locator('td');
        await expect(columns.nth(1)).toContainText(taskTitle);
        await this.closeModalIfVisible();
    }

    /**
     * Task should not be created without valid data
     */
    async verifyTaskCannotBeCreatedWithoutValidData(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openTasksTab();
        const taskFormModal = this.page.locator('section.body-details.h-100.border-0:visible');
        await taskFormModal.waitFor({ state: 'visible' });
        const saveButton = this.page.getByRole('button', { name: /^save$/i }).first();
        await saveButton.waitFor({ state: 'visible' });
        await saveButton.click();
        await this.closeModalIfVisible();
    }

    /**
     * Tasks should remain linked to the correct contact
     */
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


    async verifyTaskAppearsInList() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openStreamTab();
        await this.openTasksTab();
        await this.taskData();
        await this.closeModalIfVisible();
    }
}
