import { Page, Locator, expect } from '@playwright/test';
import { ContactBasePage } from './ContactBasePage';
import { faker } from '@faker-js/faker';

export class ContactAssociationPage extends ContactBasePage {
    public async verifyAssociationsTabOpensCorrectly(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const associationsTab = this.page.getByRole("tab", { name: /associations/i });
        await associationsTab.waitFor({ state: "visible" });
        await associationsTab.click();
        await this.closeModalIfVisible();
    }

    public async verifyAccessRemmiButtonDisplaysPasswordField(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const associationsTab = this.page.getByRole("tab", { name: /associations/i });
        await associationsTab.waitFor({ state: "visible" });
        await associationsTab.click();
        const accessRemmiButton = this.page.getByRole('button', { name: /access remmi/i });
        await accessRemmiButton.waitFor({ state: "visible" });
        await accessRemmiButton.click();
        const passwordField = this.page.getByText('Password', { exact: true });
        await expect(passwordField).toBeVisible({ timeout: 10000 });
        const passwordInput = this.page.locator('label:has-text("Password") + input')
        await expect(passwordInput).toBeVisible({ timeout: 10000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verify that the password must be at least 12 characters when accessing Remmi.
     */
    public async verifyPasswordMustBeAtLeast12Characters(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const associationsTab = this.page.getByRole("tab", { name: /associations/i });
        await associationsTab.waitFor({ state: "visible" });
        await associationsTab.click();
        const accessRemmiButton = this.page.getByRole('button', { name: /access remmi/i });
        await accessRemmiButton.waitFor({ state: "visible" });
        await accessRemmiButton.click();
        const passwordInput = this.page.locator('label:has-text("Password") + input');
        await expect(passwordInput).toBeVisible({ timeout: 10000 });
        await passwordInput.fill('shortpwd');
        const minLengthError = this.page.getByText(/Password must be at least 12 characters/i);
        await expect(minLengthError).toBeVisible({ timeout: 10000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verify that login access is not granted without entering a password
     */
    public async verifyLoginAccessNotGrantedWithoutPassword(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const associationsTab = this.page.getByRole("tab", { name: /associations/i });
        await associationsTab.waitFor({ state: "visible" });
        await associationsTab.click();
        const accessRemmiButton = this.page.getByRole('button', { name: /access remmi/i });
        await accessRemmiButton.waitFor({ state: "visible" });
        await accessRemmiButton.click();
        const passwordInput = this.page.locator('label:has-text("Password") + input');
        await expect(passwordInput).toBeVisible({ timeout: 10000 });
        await passwordInput.fill('shortpwd');
        const minLengthError = this.page.getByText(/Password must be at least 12 characters/i);
        await expect(minLengthError).toBeVisible({ timeout: 10000 });
        const saveButton = this.page.getByRole('button', { name: /save/i }).first();
        await expect(saveButton).toBeVisible({ timeout: 8000 });
        await saveButton.click();
        const errorToast = this.page.getByRole('alert', { name: 'Password must be at least 12 characters long' });
        await expect(errorToast).toBeVisible({ timeout: 10000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verify that projects can be searched in the "Add Project" dropdown
     */
    public async verifyProjectCanBeSearchedInAddProjectDropdown(searchProjectName: string): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        // Navigate to Associations tab (assume this is where "Add Project" lives)
        const associationsTab = this.page.getByRole("tab", { name: /associations/i });
        await associationsTab.waitFor({ state: "visible", timeout: 10000 });
        await associationsTab.click();
        // Click the "Add Project" placeholder inside the custom dropdown
        const addProjectPlaceholder = this.page.locator('div.tags span.placeHolder', { hasText: /add project/i }).first();
        await expect(addProjectPlaceholder).toBeVisible({ timeout: 8000 });
        await addProjectPlaceholder.click();

        // Locate the dropdown input for searching projects (with placeholder 'Search')
        const projectDropdownInput = this.page.locator('div.drop_box input[placeholder="Search"]').first();
        await expect(projectDropdownInput).toBeVisible({ timeout: 10000 });
        await projectDropdownInput.click();
        await projectDropdownInput.fill(searchProjectName);
        const dropdownOption = this.page.locator('li.p-element.ng-star-inserted', { hasText: new RegExp(searchProjectName, 'i') }).first();
        await expect(dropdownOption).toBeVisible({ timeout: 10000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verify that clicking the "Select All" checkbox selects all projects in the "Add Project" dropdown
     */
    public async verifySelectAllCheckboxSelectsAllProjects(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();

        // Navigate to Associations tab
        const associationsTab = this.page.getByRole("tab", { name: /associations/i });
        await associationsTab.waitFor({ state: "visible", timeout: 10000 });
        await associationsTab.click();

        // Click "Add Project" placeholder to open the dropdown
        const addProjectPlaceholder = this.page.locator('div.tags span.placeHolder', { hasText: /add project/i }).first();
        await expect(addProjectPlaceholder).toBeVisible({ timeout: 8000 });
        await addProjectPlaceholder.click();

        // Open the projects dropdown input if not already open
        const projectDropdown = this.page.locator('div.drop_box').first();
        await expect(projectDropdown).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(2000);

        // Click the "Select All" checkbox inside the dropdown
        const selectAllCheckbox = projectDropdown.locator('.checkbox__checkmark').first();
        await expect(selectAllCheckbox).toBeVisible({ timeout: 10000 });
        // Check the checkbox if it's not already checked
        if (!(await selectAllCheckbox.isChecked())) {
            await selectAllCheckbox.click({ force: true });
        }
        const allOptions = projectDropdown.locator('li.p-element.ng-star-inserted');
        const optionCount = await allOptions.count();
        for (let i = 1; i < optionCount; i++) {
            const projectOptionCheckbox = allOptions.nth(i).locator('.checkbox__checkmark');
            await expect(projectOptionCheckbox).toBeChecked();
        }

        await this.closeModalIfVisible();
    }

    /**
     * Verify that clicking "Deselect All" unselects all selected projects in the "Add Project" dropdown
     */
    public async verifyDeselectAllUnselectsAllProjects(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();

        // Navigate to Associations tab
        const associationsTab = this.page.getByRole("tab", { name: /associations/i });
        await associationsTab.waitFor({ state: "visible", timeout: 10000 });
        await associationsTab.click();

        // Click "Add Project" placeholder to open the dropdown
        const addProjectPlaceholder = this.page.locator('div.tags span.placeHolder', { hasText: /add project/i }).first();
        await expect(addProjectPlaceholder).toBeVisible({ timeout: 8000 });
        await addProjectPlaceholder.click();

        // Ensure project dropdown is open
        const projectDropdown = this.page.locator('div.drop_box').first();
        await expect(projectDropdown).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(2000);

        // Click the "Select All" checkbox to select all projects
        const selectAllCheckbox = projectDropdown.locator('.checkbox__checkmark').first();
        await expect(selectAllCheckbox).toBeVisible({ timeout: 10000 });
        if (!(await selectAllCheckbox.isChecked())) {
            await selectAllCheckbox.click({ force: true });
        }

        if (await selectAllCheckbox.isChecked()) {
            await selectAllCheckbox.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
        const allOptions = projectDropdown.locator('li.p-element.ng-star-inserted');
        const optionCount = await allOptions.count();
        for (let i = 1; i < optionCount; i++) {
            const projectOptionCheckbox = allOptions.nth(i).locator('.checkbox__checkmark');
            await expect(projectOptionCheckbox).not.toBeChecked();
        }
        await this.closeModalIfVisible();
    }
    /**
     * Verify that clicking the "+" button adds the selected project to the association list
     */
    public async verifyAddProjectButtonAddsProject(searchProjectName: string): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        // Navigate to Associations tab (assume this is where "Add Project" lives)
        const associationsTab = this.page.getByRole("tab", { name: /associations/i });
        await associationsTab.waitFor({ state: "visible", timeout: 10000 });
        await associationsTab.click();
        // Click the "Add Project" placeholder inside the custom dropdown
        const addProjectPlaceholder = this.page.locator('div.tags span.placeHolder', { hasText: /add project/i }).first();
        await expect(addProjectPlaceholder).toBeVisible({ timeout: 8000 });
        await addProjectPlaceholder.click();

        // Locate the dropdown input for searching projects (with placeholder 'Search')
        const projectDropdownInput = this.page.locator('div.drop_box input[placeholder="Search"]').first();
        await expect(projectDropdownInput).toBeVisible({ timeout: 10000 });
        await projectDropdownInput.click();
        await projectDropdownInput.fill(searchProjectName);
        const dropdownOption = this.page.locator('li.p-element.ng-star-inserted', { hasText: new RegExp(searchProjectName, 'i') }).first();
        await expect(dropdownOption).toBeVisible({ timeout: 10000 });
        await dropdownOption.click();
        // Click the "+" button
        const addButton = this.page.getByLabel('Associations').getByRole('button', { name: '' })
        await addButton.click();

        await expect(this.page.getByRole('alert', { name: 'Added successfully' })).toBeVisible({ timeout: 10000 });

        const projectRow = this.page.locator('tr.compact-form.ng-star-inserted').filter({ hasText: searchProjectName }).first();
        await expect(projectRow).toBeVisible({ timeout: 30000 });

        // Optionally: Verify columns content (Project Name, Date, Delete Button)
        const nameCell = projectRow.locator('td').nth(0).locator('p');
        await expect(nameCell).toHaveText(/east village vila/i);

        const dateCell = projectRow.locator('td').nth(1).locator('p');
        await expect(dateCell).not.toHaveText(''); // Date field should not be empty

        const deleteButton = projectRow.locator('td.text-center button.btn.p-0');
        await expect(deleteButton).toBeVisible();

        await this.closeModalIfVisible();
    }

    /**
     * Verify that added projects can be deleted from the association list
     */
    public async verifyProjectCanBeDeletedFromList(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const associationsTab = this.page.getByRole("tab", { name: /associations/i });
        await associationsTab.waitFor({ state: "visible" });
        await associationsTab.click();
        const deleteButton = this.page.getByRole('button', { name: /delete/i }).first();
        await deleteButton.evaluate((el) => {
            el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
        });
        await expect(deleteButton).toBeVisible({ timeout: 5000 });
        await deleteButton.click();
        const removedAlert = this.page.getByRole('alert', { name: 'Removed successfully' });
        await removedAlert.waitFor({ state: 'visible' });
        await this.closeModalIfVisible();
    }

    /**
     * Verify that the NOTE Tab opens correctly
     */
}
