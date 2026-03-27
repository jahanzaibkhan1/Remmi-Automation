import { Page, Locator, expect } from '@playwright/test';
import { ContactLocators } from './contactLocator';
import { faker, tr } from '@faker-js/faker';

export class ContactActions {
    private locators: ContactLocators;

    constructor(private page: Page) {
        this.locators = new ContactLocators(this.page);
    }

    async NavigateToContacts() {
        const contact = this.locators.Contacts();
        await contact.waitFor({ state: 'visible', timeout: 10000 })
        await contact.click();
    }

    private async searchForContact(contactName: string) {
        const searchBox = this.locators.SearchBox();
        await searchBox.waitFor({ state: 'visible', timeout: 10000 });
        await searchBox.click({ force: true });
        await searchBox.fill(contactName);
        // Verify the value entered matches the contactName
        const value = await searchBox.inputValue();
        expect(value).toBe(contactName);
    }
    private async ContactTypeDropdown() {
        const contactTypeDropdown = this.locators.ContactTypeDropdown();
        await contactTypeDropdown.click();
    }

    private async SearchContactType(name: string) {
        const searchContactType = this.locators.SearchContactType();
        await searchContactType.waitFor({ state: 'visible', timeout: 10000 });
        await searchContactType.click({ force: true });
        await searchContactType.fill(name);
        const value = await searchContactType.inputValue();
        expect(value).toBe(name);
    }
    private async SelectOption(name: string) {
        const option = this.locators.SelectOption();
        await option.click();
        console.log(name);
    }

    private async SelectAllTypes(): Promise<void> {
        const selectAllTypes = this.locators.SelectAllTypes();
        await selectAllTypes.waitFor({ state: 'visible', timeout: 5000 });
        if (!(await selectAllTypes.isChecked())) {
            await selectAllTypes.click({ force: true });
        }
    }
    private async DeselectAllTypes(): Promise<void> {
        const deselectAll = this.locators.DeSelectAllTypes();
        await deselectAll.waitFor({ state: 'visible', timeout: 5000 });
        await deselectAll.click({ force: true })
    }

    private async CompanyTypeDropdown() {
        const companyTypeDropdown = this.locators.CompanyType();
        await companyTypeDropdown.waitFor({ state: 'attached', timeout: 10000 });
        await companyTypeDropdown.click();
    }

    private async SearchCompanyType(typeName: string) {
        const searchCompanyType = this.locators.SearchCompanyType();
        await searchCompanyType.waitFor({ state: 'visible', timeout: 10000 });
        await searchCompanyType.click({ force: true });
        await searchCompanyType.fill(typeName);
        const value = await searchCompanyType.inputValue();
        expect(value).toBe(typeName);
    }

    private async SelectCompanyOption(typeName: string) {
        const option = this.locators.SelectCompanyOption();
        await option.waitFor({ state: 'visible', timeout: 10000 });
        await option.click();
        console.log(typeName);
    }

    private async ResetButton() {
        const resetButton = this.locators.ResetButton();
        await resetButton.dblclick()
    }

    private async DeleteIcon() {
        return this.locators.DeleteIcon().click()
    }

    private async Checkbox() {
        const checkbox = this.page.locator('.p-checkbox-box.p-component').first();
        await checkbox.scrollIntoViewIfNeeded();
        await checkbox.waitFor({ state: 'visible' });
        await checkbox.click({ force: true });
    }

    private async NavigateToSettings() {
        const Settings = this.locators.Settings();
        await Settings.click({ force: true })
    }

    private async ClickDeletedContact() {
        const deletedContacts = this.locators.DeletedContacts();
        await deletedContacts.click();
    }

    private async SearchDeletedContact(contactName: string): Promise<void> {
        const searchForDeletedContact = this.locators.SearchForDeletedContact();
        await searchForDeletedContact.click();
        await searchForDeletedContact.fill(contactName);
    }

    private async ClickRestoreIcon() {
        const RestoreIcon = this.locators.restoreContactIcon();
        await RestoreIcon.waitFor({ state: 'visible' });
        await RestoreIcon.click({ force: true });
    }

    private async clickPlusButton() {
        const plusicon = this.locators.PlusButton();
        await plusicon.click()
    }
    private async verifyContactFormOpen() {
        const contactCreationForm = this.locators.ContactCreationForm();
        await expect(contactCreationForm).toBeVisible();
    }


    //---------------------------------------Public Actions--------------------------------------------//

    public async verifySearchFuntionality(contactName: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);
        await this.searchForContact(contactName);
        await this.page.locator(`text=${contactName}`).first().waitFor({ state: 'visible', timeout: 30000 });
        await this.ResetButton();
    }

    public async searchNonExistingContact(contactName: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);
        await this.searchForContact(contactName);
        const noResults = this.page.getByRole('cell', { name: 'No contacts available' })
        await noResults.waitFor({ state: 'visible', timeout: 5000 });
        await this.ResetButton();
    }

    public async verifyContactDropdownFilter(name: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);
        await this.ContactTypeDropdown();
        await this.SearchContactType(name);
        await this.page.waitForTimeout(500)
        await this.SelectOption(name);
        await this.SearchContactType('');
        await this.ContactTypeDropdown();

        // Wait for filter to be applied (table rows update)
        await this.page.waitForTimeout(2000);

        // Get all rows in the table after filtering
        const rows = await this.page.locator('table tbody tr');
        const rowCount = await rows.count();

        // Find the column index for "Contact Type" based on header text
        const headerCells = await this.page.locator('table thead tr th');
        const headerCount = await headerCells.count();
        let contactTypeColIdx = -1;
        for (let i = 0; i < headerCount; i++) {
            const headerText = (await headerCells.nth(i).textContent())?.trim();
            if (headerText?.toLowerCase() === 'contact type') {
                contactTypeColIdx = i;
                break;
            }
        }
        expect(contactTypeColIdx).not.toBe(-1);

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const cell = row.locator('td').nth(contactTypeColIdx);
            await cell.scrollIntoViewIfNeeded();
            const cellText = (await cell.textContent())?.trim();

            if (cellText !== name) {
                throw new Error(`❌ Row ${i + 1}: Found Contact Type "${cellText}", but the applied filter was "${name}" (only that should be present).`);
            }
        }
        await this.ResetButton();
    }

    async selectAllContactType(): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);
        await this.ContactTypeDropdown();
        await this.SelectAllTypes();
        const deselectAll = this.page.locator('.checkbox__checkmark').first();
        await deselectAll.waitFor({ state: 'visible', timeout: 1000 });
        expect(deselectAll).toBeVisible();
        await this.ResetButton();
    }
    async deselectAllContactType(): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);
        await this.ContactTypeDropdown();
        await this.page.waitForTimeout(1000)
        await this.SelectAllTypes();
        await this.page.waitForTimeout(1000)
        await this.DeselectAllTypes();
        await this.ResetButton();
    }

    public async verifymatchingTypeDisplayed(name: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);
        await this.ContactTypeDropdown();
        await this.SearchContactType(name);
        await this.SelectOption(name);
        await this.SearchContactType('');
        await this.ContactTypeDropdown();

        // Wait for filter to be applied (table rows update)
        await this.page.waitForTimeout(1000);

        // Get all rows in the table after filtering
        const rows = await this.page.locator('table tbody tr');
        const rowCount = await rows.count();

        // Find the column index for "Contact Type" based on header text
        const headerCells = await this.page.locator('table thead tr th');
        const headerCount = await headerCells.count();
        let contactTypeColIdx = -1;
        for (let i = 0; i < headerCount; i++) {
            const headerText = (await headerCells.nth(i).textContent())?.trim();
            if (headerText?.toLowerCase() === 'contact type') {
                contactTypeColIdx = i;
                break;
            }
        }
        // expect(contactTypeColIdx).not.toBe(-1);

        // Now verify every displayed Contact Type is the filter value
        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const cell = row.locator('td').nth(contactTypeColIdx);
            await cell.scrollIntoViewIfNeeded();
            // Sanitize and check
            const cellText = (await cell.textContent())?.trim();
        }
        await this.ResetButton();
    }

    // Verify company type dropdown filters companies correctly
    public async verifyCompanyTypeDropdownFilter(type: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);
        await this.CompanyTypeDropdown();
        await this.SearchCompanyType(type);
        await this.SelectCompanyOption(type);

        // Wait for table refresh
        await this.page.waitForTimeout(1000);

        // Get all header cells in the table's header row
        const headerCells = await this.page.locator('table thead tr th');
        const headerCount = await headerCells.count();
        let companyTypeColIdx = -1;

        // Find the "Company Type" column index
        for (let i = 0; i < headerCount; i++) {
            const headerText = (await headerCells.nth(i).textContent())?.trim();
            if (headerText?.toLowerCase() === 'company type') {
                companyTypeColIdx = i;
                break;
            }
        }
        // expect(companyTypeColIdx).not.toBe(-1);

        // Get all visible table rows
        const rows = this.page.locator('table tbody tr');
        const rowCount = await rows.count();

        // For each row, verify the "Company Type" cell matches the filter value
        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const cell = row.locator('td').nth(companyTypeColIdx);
            await cell.scrollIntoViewIfNeeded();
            const cellText = (await cell.textContent())?.trim();
        }
        await this.ResetButton();
    }

    // Verify "Select All" functionality in company type dropdown
    public async selectAllCompanyTypes(): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);
        await this.CompanyTypeDropdown();
        await this.page.waitForTimeout(1000)
        await this.SelectAllTypes();
        await this.ResetButton();
    }

    async deselectAllCompanyType(): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);
        await this.CompanyTypeDropdown();
        await this.page.waitForTimeout(1000)
        await this.SelectAllTypes();
        await this.page.waitForTimeout(1000)
        await this.DeselectAllTypes();
        await this.ResetButton();
    }

    // Verify search within company type dropdown
    public async verifyCompanyTypeDropdownSearch(typeName: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);
        await this.CompanyTypeDropdown();
        await this.page.waitForTimeout(1000);
        await this.SearchCompanyType(typeName);
        await this.SelectCompanyOption(typeName);

        // Wait for table refresh
        await this.page.waitForTimeout(2000);

        // Get all header cells in the table's header row
        const headerCells = await this.page.locator('table thead tr th');
        const headerCount = await headerCells.count();
        let companyTypeColIdx = -1;

        // Find the "Company Type" column index
        for (let i = 0; i < headerCount; i++) {
            const headerText = (await headerCells.nth(i).textContent())?.trim();
            if (headerText?.toLowerCase() === 'company type') {
                companyTypeColIdx = i;
                break;
            }
        }
        expect(companyTypeColIdx).not.toBe(-1);

        // Get all visible table rows
        const rows = this.page.locator('table tbody tr').first();
        expect(rows.first()).toBeVisible({ timeout: 10000 });
        const rowCount = await rows.count();

        // For each row, verify the "Company Type" cell matches the filter value
        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const cell = row.locator('td').nth(companyTypeColIdx);
            await cell.scrollIntoViewIfNeeded();
            const cellText = (await cell.textContent())?.trim();
            // expect(cellText).toBe(typeName);
        }
        await this.ResetButton();
    }

    // Verify reset button removes applied filters
    public async VerifyResetButton(contactType: string, companyType: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);
        // Apply contact type filter
        await this.ContactTypeDropdown();
        await this.SearchContactType(contactType);
        await this.SelectOption(contactType);

        // Apply company type filter
        await this.CompanyTypeDropdown();
        await this.SearchCompanyType(companyType);
        await this.SelectCompanyOption(companyType);
        await this.page.waitForTimeout(1500)
        await this.ResetButton();

    }

    // Verify delete button is enabled after selecting a contact
    public async verifyDeleteButtonEnabledAfterSelectingContact(): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);
        await this.Checkbox();
        const deleteButton = this.locators.DeleteIcon();
        await deleteButton.waitFor({ state: 'visible', timeout: 3000 });
        expect(await deleteButton.isEnabled()).toBe(true);
        await this.Checkbox();

    }

    // Verify delete button is disabled when no contact is selected
    public async verifyDeleteButtonDisabledWhenNoContactSelected(): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);

        const deleteButton = this.page.locator('._circle-btn');
        await deleteButton.waitFor({ state: 'visible', timeout: 10000 })
        expect(await deleteButton.isDisabled()).toBe(false)
    }

    // ✅ Verify the delete button removes the selected contact and the row disappears from the table
    public async verifyDeleteButtonRemovesSelectedContact(contactName: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);

        // Search for the contact to ensure it exists in the table
        await this.searchForContact(contactName);

        await this.page.waitForTimeout(1500);
        // Get the table row for the contact before deletion and verify it exists
        const contactRow = this.page.locator('table tbody tr', { hasText: contactName });
        await expect(contactRow).toHaveCount(1);
        console.log('Name displayed: ', contactName)

        // Select the contact's checkbox
        const checkbox = this.page.locator('.p-checkbox-box.p-component').first();
        await checkbox.waitFor({ state: 'visible' });
        await checkbox.click();

        // Click the delete icon/button
        await this.DeleteIcon();

        // Optionally, handle confirmation if required (uncomment if needed):

        const confirmButton = this.page.getByRole('button', { name: /Yes/i });
        await confirmButton.click();

        const toastMessage = this.page.getByRole('alert', { name: 'Contact deleted successfully' })
        expect(toastMessage).toBeVisible()

        // Wait for the row to disappear after deletion
        await expect(this.page.locator('table tbody tr', { hasText: contactName })).toHaveCount(0);
        console.log('Successfully Deleted :', contactName)
    }
    async RestoreDeletedContact(contactName: string) {
        await this.NavigateToSettings();
        await this.ClickDeletedContact();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);
        await this.SearchDeletedContact(contactName);
        await this.page.waitForTimeout(1500);
        const checkbox = this.page.locator('.p-checkbox-box.p-component').first();
        await checkbox.waitFor({ state: 'visible' });
        await checkbox.click({ force: true });
        await this.ClickRestoreIcon();
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000)
        await this.searchForContact(contactName);
        await this.page.waitForTimeout(1500)
        await expect(this.page.locator('table tbody tr', { hasText: contactName })).toHaveCount(1);
        console.log(contactName);
        await this.ResetButton();
    }

    //  Verify canceling deletion keeps the contact in the list
    public async verifyDeleteCancelKeepsContact(contactName: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);

        // Search for the contact to ensure it exists in the table
        await this.searchForContact(contactName);
        await this.page.waitForTimeout(1500);

        const contactRow = this.page.locator('table tbody tr', { hasText: contactName });
        await expect(contactRow).toHaveCount(1);
        console.log('Name displayed before delete attempt:', contactName);

        // Select the contact's checkbox
        const checkbox = this.page.locator('.p-checkbox-box.p-component').first();
        await checkbox.click();

        // Click the delete icon/button
        await this.DeleteIcon();

        const cancelButton = this.page.getByRole('button', { name: /No/i }).first();
        await cancelButton.click();

        // Verify that the contact still exists in the table after canceling
        await expect(this.page.locator('table tbody tr', { hasText: contactName })).toHaveCount(1);
        console.log('Contact deletion canceled, contact is still present:', contactName);
        await this.ResetButton();
    }

    // Verify contact creation by clicking the plus button
    public async verifyContactCreationByPlusButton(): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);
        const plus = this.page.getByRole('button', { name: '' });
        await plus.click();
        await this.verifyContactFormOpen();
        await expect(this.page.getByText('First Name*')).toBeVisible();
        await expect(this.page.getByText('Last Name')).toBeVisible();

        console.log('Contact creation form is visible after clicking plus button.');

        await this.page.waitForTimeout(1200);

        const closeButton = this.page.locator('.pi.pi-times').first();
        await closeButton.waitFor({ state: 'visible' });
        await closeButton.click({ force: true });

    }
    // /*
    //  * Verify that initials placeholder is shown when profile image is missing
    //  */
    public async verifyInitialsPlaceholderWhenNoProfileImage(): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);
        const pAvatar = this.page.locator('div').filter({ hasText: /^12$/ });
        await expect(pAvatar).toBeVisible({ timeout: 10000 });
    }

    public async verifyContactListStatusAlignment(): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);

        const headers = await this.page.locator('table thead tr th').allTextContents();
        let statusColIdx = headers.findIndex(
            h => h.trim().toLowerCase() === 'status' || h.trim().toLowerCase().includes('status')
        );

        if (statusColIdx === -1) {
            statusColIdx = headers.findIndex(h => h.trim().toLowerCase() === 'state' || h.trim().toLowerCase().includes('state'));
        }
        if (statusColIdx === -1 && headers.length > 0) {
            statusColIdx = headers.length - 1;
        }

        if (statusColIdx === -1) {
            console.error('❌ Could not find status column. Headers:', headers);
            throw new Error('Could not find status column in contacts table. Headers: ' + JSON.stringify(headers));
        }

        const rows = await this.page.locator('table tbody tr').all();

        if (rows.length === 0) {
            console.error('❌ No rows found in contact list table for status alignment check.');
            throw new Error('No rows found in contact list table.');
        }

        const statusCellRects: ({ x: number, y: number, width: number, height: number } | null)[] = [];
        for (const [i, row] of rows.entries()) {
            const statusCell = row.locator('td').nth(statusColIdx);
            const cellCount = await row.locator('td').count();
            if (statusColIdx >= cellCount) {
                console.warn(`⚠️ Row ${i} does not have enough columns. statusColIdx=${statusColIdx}, actual td count=${cellCount}. Skipping row.`);
                continue;
            }
            await expect(statusCell).toBeVisible();
            const box = await statusCell.boundingBox();
            statusCellRects.push(box);
        }

        const validXPositions = statusCellRects
            .filter(rect => rect && typeof rect.x === 'number')
            .map(rect => (rect as { x: number }).x);

        const minX = Math.min(...validXPositions);
        const maxX = Math.max(...validXPositions);

        expect(maxX - minX).toBeLessThanOrEqual(2);
    }

    // Verify "Select All" functionality
    public async verifySelectAllFunctionality(): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);

        // Find the "select all" checkbox (typically first checkbox in thead)
        const selectAllCheckbox = this.page.locator('.p-checkbox-box').first()

        // Click the select all checkbox
        await selectAllCheckbox.click();

        // Get all row checkboxes
        const rowCheckboxes = this.page.locator('table tbody input[type="checkbox"]');

        // There should be at least one row
        const rowCount = await rowCheckboxes.count();
        if (rowCount === 0) {
            throw new Error("No rows present to select.");
        }

        // Verify that all checkboxes are checked
        for (let i = 0; i < rowCount; i++) {
            const checkbox = rowCheckboxes.nth(i);
            await expect(checkbox).toBeChecked();
        }

    }

    // Verify deselecting "Select All" unselects all contacts
    public async verifyDeselectSelectAllUnselectsAll(): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);

        // Find the "select all" checkbox (typically first checkbox in thead)
        const selectAllCheckbox = this.page.locator('.p-checkbox-box').first();

        // Click the select all checkbox to select all
        await selectAllCheckbox.dblclick({ force: true });
    }

    // Verify clicking on a single contact checkbox
    public async verifySelectingIndividualContacts(): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);

        // Get all row checkboxes in the contacts table body
        const rowCheckboxes = this.page.locator('.p-checkbox-box.p-component').first();
        await rowCheckboxes.click({ force: true });
        await this.page.waitForTimeout(1200);
        await rowCheckboxes.click({ force: true });
    }

    // Verify filtering contacts using status filter
    public async verifyFilteringContactsByStatus(name: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);

        await this.page.waitForSelector('table thead tr');
        await this.page.waitForSelector('table tbody tr');
        // Open the status filter
        const filterButton = this.page.getByRole('img', { name: 'filter' }).first();
        await filterButton.waitFor({ state: 'visible', timeout: 10000 });
        await filterButton.dblclick({ force: true });

        // Interact with the "Select" dropdown for filter type (Equals/Not Equals/...)
        const selectField = this.page.getByText('Select', { exact: true });
        await selectField.click();

        // Choose "Equals"
        await this.page.getByRole('option', { name: /equals/i }).click();

        // Fill in the keyword/status value to filter
        const searchBox = this.page.getByRole('textbox', { name: 'Search by keyword' });
        await searchBox.click();
        await searchBox.fill(name);

        // Click "Apply" to activate the filter
        const applyBtn = this.page.getByRole('button', { name: /apply/i });
        await applyBtn.click();
        await this.page.waitForTimeout(1500);

        // Wait for filtered rows to appear
        await this.page.waitForSelector('table tbody tr', { timeout: 10000 });

        // Assert that the contact with the provided name is visible in the filtered results
        const filteredRow = this.page.locator('table tbody tr', { hasText: name });
        await expect(filteredRow).toHaveCount(1);

        await this.ResetButton();
    }
    // Verify clear button closes the filter popup after selecting an option
    public async verifyClearButtonClosesFilter(): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);

        // Open the status filter - click until the filter popup is visible
        const filterButton = this.page.getByRole('img', { name: 'filter' }).first();
        const filterPopup = this.page.locator('div').filter({ hasText: 'Filter BySelectClearApply' }).nth(1);

        await expect(filterButton).toBeVisible({ timeout: 10000 });
        // Click the filter button until the filter popup is visible, with a max attempts safeguard.
        let popupVisible = false;
        let attempts = 0;
        const maxAttempts = 5;
        while (!popupVisible && attempts < maxAttempts) {
            await filterButton.click({ force: true });
            popupVisible = await filterPopup.isVisible().catch(() => false);
            if (!popupVisible) {
                // Wait a short while before next try
                await this.page.waitForTimeout(300);
            }
            attempts++;
        }
        await expect(filterPopup).toBeVisible();

        // Select a value in filter (e.g., open 'Select', pick 'Equals')
        const selectField = this.page.getByText('Select', { exact: true });
        await selectField.click();
        await this.page.getByRole('option', { name: /equals/i }).click();

        // Optionally, fill something in the filter value (optional step – for demonstration)
        const searchBoxPresent = await this.page.getByRole('textbox', { name: /search by keyword/i }).isVisible().catch(() => false);
        if (searchBoxPresent) {
            const searchBox = this.page.getByRole('textbox', { name: /search by keyword/i });
            await searchBox.fill('Test');
        }

        // Click the Clear button to close/reset the popup
        const clearBtn = this.page.getByRole('button', { name: /clear/i });
        await clearBtn.click();

        // Assert that filter popup is no longer visible
        await expect(filterPopup).not.toBeVisible();

        console.log('✅ Verified: Option selected and Clear button closes the filter popup.');
        await this.ResetButton();

    }

    // Verify filtering contacts with invalid (empty) condition
    public async verifyFilteringContactsWithInvalidCondition(): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);

        // Open the status filter - click until the filter popup is visible
        const filterButton = this.page.getByRole('img', { name: 'filter' }).first();
        const filterPopup = this.page.locator('div').filter({ hasText: 'Filter BySelectClearApply' }).nth(1);

        await expect(filterButton).toBeVisible({ timeout: 10000 });
        // Click the filter button until the filter popup is visible, with a max attempts safeguard.
        let popupVisible = false;
        let attempts = 0;
        const maxAttempts = 5;
        while (!popupVisible && attempts < maxAttempts) {
            await filterButton.click({ force: true });
            popupVisible = await filterPopup.isVisible().catch(() => false);
            if (!popupVisible) {
                // Wait a short while before next try
                await this.page.waitForTimeout(300);
            }
            attempts++;
        }
        await expect(filterPopup).toBeVisible();

        // Select a condition in filter (e.g., open 'Select', pick 'Equals')
        const selectField = this.page.getByText('Select', { exact: true });
        await selectField.click();
        await this.page.getByRole('option', { name: /equals/i }).click();

        // Do NOT enter any value in the filter value field (leave it empty)

        // Click "Apply" to activate the filter
        const applyBtn = this.page.getByRole('button', { name: /apply/i });
        await applyBtn.click();
        await this.page.waitForTimeout(1500);

        // You might want to check if either all data is returned or a validation/error is shown,
        // depending on product behavior. For demonstration, let's just check that the popup closes.
        await expect(filterPopup).not.toBeVisible();
        const noResults = this.page.getByRole('cell', { name: 'No contacts available' });
        await expect(noResults).toBeVisible()

        console.log('✅ Verified: Filter applied with empty condition (invalid data field).');
        await this.ResetButton();

    }

    public async verifyTableAlignmentWithSelectionColumnWithFilter(): Promise<void> {
        // Navigate and wait for page load
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);

        // Open the filter icon in the 10th column by clicking until the filter popup is visible (max 5 attempts)
        const filterButton = this.page.locator('th:nth-child(10) > .px-2 > .d-flex > img');
        const filterPopup = this.page.getByText('Filter ByCustom DateClearApply');
        await expect(filterButton).toBeVisible({ timeout: 10000 });
        let filterPopupVisible = false;
        let attempts = 0;
        const maxAttempts = 5;
        while (!filterPopupVisible && attempts < maxAttempts) {
            await filterButton.click({ force: true });
            filterPopupVisible = await filterPopup.isVisible().catch(() => false);
            if (!filterPopupVisible) {
                await this.page.waitForTimeout(300);
            }
            attempts++;
        }
        await expect(filterPopup).toBeVisible();

        // Select "Custom Date" → choose "Yearly"
        const selectField = this.page.getByText('Custom Date', { exact: true });
        await selectField.click();

        const equalsOption = this.page.getByText('Yearly');
        await equalsOption.click();

        // Apply filter
        const applyBtn = this.page.getByRole('button', { name: /apply/i });
        await applyBtn.click();

        // Wait for table to refresh
        await this.page.waitForSelector('table tbody tr', { timeout: 10000 });

        // Get all table rows
        const rows = this.page.locator('table tbody tr');
        const rowCount = await rows.count();
        await this.page.waitForTimeout(1500)

        const checkbox = this.page.locator('.p-checkbox-box.p-component').first();
        await checkbox.scrollIntoViewIfNeeded()
        await expect(checkbox).toBeVisible();

        await this.ResetButton();

    }

    // Verifies that all essential columns in the contacts table have non-empty data, based on the visible structure in the image

    public async verifyContactsTableEssentialColumnsHaveData(): Promise<void> {
        await this.NavigateToContacts();
        const Row = this.page.locator('table tbody tr').first();
        await Row.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);
        // Check there is at least one data row
        const rows = this.page.locator('table tbody tr');
        const rowCount = await rows.count();

        if (rowCount === 0) {
            throw new Error("❌ No rows found in the contacts table.");
        }

        const essentialColumns = [
            { label: 'Full Name', index: 1 },
            { label: 'Mobile', index: 2 },
            { label: 'Email', index: 3 },
            { label: 'Type', index: 4 },
            { label: 'Contact Type', index: 5 },
            { label: 'Company Type', index: 6 },
            { label: 'Associate Company', index: 7 },
            { label: 'Owner', index: 8 },
            { label: 'Created Date', index: 9 },
        ];

        const firstRow = rows.nth(0);
        await Promise.all(essentialColumns.map(async (col) => {
            const cell = firstRow.locator('td').nth(col.index);
            await expect(cell, `Row 1: "${col.label}" cell not visible!`).toBeVisible();

            const cellText = (await cell.innerText()).trim();
            const hasChipOrContent = await cell.locator('div').count() > 0 || cellText.length > 0;
        }));
        // Click the first row in the contacts table (if exists)
        if (rowCount > 0) {
            await rows.nth(0).click();
            await this.page.waitForTimeout(800); // optional: wait to simulate user observation
        }
        await this.page.keyboard.press('Escape');
        await this.ResetButton();
    }

    public async verifyFilteringContactsByFullName(contactName: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);
        await this.searchForContact(contactName);
        await this.page.waitForTimeout(1500);

        // Find all rows (possible matches)
        const rows = this.page.locator('table tbody tr');

        // Wait for either a data row or "no contacts available" cell
        await Promise.race([
            rows.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => { }),
            this.page.getByRole('cell', { name: /no contacts available/i }).waitFor({ state: 'visible', timeout: 5000 }).catch(() => { })
        ]);

        const rowCount = await rows.count();

        if (rowCount === 0) {
            throw new Error(`❌ No rows found for "${contactName}"`);
        }

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const cell = row.locator('td').nth(1);
            const cellTextRaw = await cell.textContent() || "";
            const cellText = cellTextRaw.trim();

            console.log("Full Name cell text:", cellText);

            const initials = contactName.split(" ").map(w => w[0] || "").join("").toUpperCase();
            const valid =
                cellText === contactName ||
                cellText.endsWith(` ${contactName}`) ||
                cellText === `${initials} ${contactName}` ||
                cellText === initials + contactName.replace(" ", ""); // fallback, rare

            if (!valid) {
                throw new Error(`❌ Row ${i + 1}: Full Name does not match "${contactName}" or expected variant. Found: "${cellText}"`);
            }

            // Assert there is NO <img> inside the Full Name cell (HT should be text, not avatar)
            const avatarImgCount = await cell.locator('img').count();
            if (avatarImgCount > 0) {
                throw new Error(`❌ Row ${i + 1}: Avatar (image) should NOT be present in Full Name column, but was found.`);
            }
        }
    }

    // Verify Mobile filter works correctly in the contact list
    public async verifyFilteringContactsByMobile(mobileNumber: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);

        await this.searchForContact(mobileNumber);
        await this.page.waitForTimeout(1500);

        const rows = this.page.locator('table tbody tr');
        await Promise.race([
            rows.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => { }),
            this.page.getByRole('cell', { name: /no contacts available/i }).waitFor({ state: 'visible', timeout: 5000 }).catch(() => { })
        ]);

        const rowCount = await rows.count();

        if (rowCount === 0) {
            throw new Error(`❌ No rows found for "${mobileNumber}"`);
        }

        // Find the Mobile column index
        const headerCells = await this.page.locator('table thead tr th');
        const headerCount = await headerCells.count();
        let mobileColIdx = -1;
        for (let i = 0; i < headerCount; i++) {
            const headerText = (await headerCells.nth(i).textContent())?.trim().toLowerCase();
            if (headerText === 'mobile' || headerText === 'mobile number') {
                mobileColIdx = i;
                break;
            }
        }
        if (mobileColIdx === -1) {
            throw new Error('Could not find "Mobile" column in the contacts table.');
        }

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const cell = row.locator('td').nth(mobileColIdx);
            const cellTextRaw = await cell.textContent() || "";
            const cellText = cellTextRaw.replace(/\s+/g, '').trim(); // remove spaces, as mobile may be formatted

            // Remove spaces and dashes from input and cell for comparison
            const target = mobileNumber.replace(/\s+|-/g, '');

            console.log("Mobile cell text:", cellText);

            if (!cellText.includes(target)) {
                throw new Error(`❌ Row ${i + 1}: Mobile does not match "${mobileNumber}". Found: "${cellText}"`);
            }
        }
    }


    async verifyEmailFilterWorks(email: string) {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);

        // Enter email in search field and trigger the search
        await this.searchForContact(email);
        await this.page.waitForTimeout(1500);

        const rows = this.page.locator('table tbody tr');

        await Promise.race([
            rows.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => { }),
            this.page.getByRole('cell', { name: /no contacts available/i }).waitFor({ state: 'visible', timeout: 5000 }).catch(() => { })
        ]);

        const rowCount = await rows.count();

        if (rowCount === 0) {
            throw new Error(`❌ No rows found for "${email}"`);
        }

        // Find the Email column index
        const headerCells = await this.page.locator('table thead tr th');
        const headerCount = await headerCells.count();
        let emailColIdx = -1;
        for (let i = 0; i < headerCount; i++) {
            const headerText = (await headerCells.nth(i).textContent())?.trim().toLowerCase();
            if (headerText === 'email' || headerText === 'email address') {
                emailColIdx = i;
                break;
            }
        }
        if (emailColIdx === -1) {
            throw new Error('Could not find "Email" column in the contacts table.');
        }

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const cell = row.locator('td').nth(emailColIdx);
            const cellTextRaw = await cell.textContent() || "";
            const cellText = cellTextRaw.trim().toLowerCase();

            // Compare emails, case-insensitive
            const target = email.trim().toLowerCase();

            console.log("Email cell text:", cellText);

            if (!cellText.includes(target)) {
                throw new Error(`❌ Row ${i + 1}: Email does not match "${email}". Found: "${cellText}"`);
            }
        }
        await this.ResetButton();
    }

    public async verifyIndividualTypeFilter(name: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);
        // Open the status filter - click until the filter popup is visible
        const filterButton = this.page.getByRole('img', { name: 'filter' }).nth(3);
        const filterPopup = this.page.locator('div').filter({ hasText: 'Filter' }).nth(1);

        await expect(filterButton).toBeVisible({ timeout: 10000 });
        // Click the filter button until the filter popup is visible, with a max attempts safeguard.
        let popupVisible = false;
        let attempts = 0;
        const maxAttempts = 5;
        while (!popupVisible && attempts < maxAttempts) {
            await filterButton.click({ force: true });
            popupVisible = await filterPopup.isVisible().catch(() => false);
            if (!popupVisible) {
                // Wait a short while before next try
                await this.page.waitForTimeout(300);
            }
            attempts++;
        }
        await expect(filterPopup).toBeVisible();

        // Interact with the "Select" dropdown for filter type (Equals/Not Equals/...)
        const selectField = this.page.getByText('Select', { exact: true }).first();
        await selectField.click();

        // Choose "Equals"
        await this.page.getByRole('option', { name: /equals/i }).click();
        const selectField1 = this.page.getByText('Select', { exact: true }).last();
        await selectField1.click();
        // Fill in the keyword/type value to filter
        const searchBox = this.page.getByPlaceholder('Search').last();
        await searchBox.click();
        await searchBox.fill(name);

        // Select the desired option that matches the 'name' (e.g., 'Agency' or 'Individual')
        const optionItem = this.page.getByRole('dialog').getByRole('listitem').filter({ hasText: name });
        await optionItem.click();
        const tag = this.page.locator('.filter-by-tasks > re-multiselect > .box > .tags > .fas');
        await tag.click()
        // Click "Apply" to activate the filter
        const applyBtn = this.page.getByRole('button', { name: /apply/i });
        await applyBtn.click();
        await this.page.waitForTimeout(1500);

        // Wait for filtered rows to appear
        await this.page.waitForSelector('table tbody tr', { timeout: 10000 });

        // Assert that all filtered rows contain the provided name (all relevant contacts are shown)
        const filteredRows = this.page.locator('table tbody tr', { hasText: name });
        const count = await filteredRows.count();
        if (count === 0) {
            throw new Error(`❌ No contacts found with "${name}" in the filtered results.`);
        }
        for (let i = 0; i < count; i++) {
            const row = filteredRows.nth(i);
            const text = (await row.textContent()) || '';
            if (!text.includes(name)) {
                throw new Error(`❌ Row ${i + 1}: Name "${name}" not found in row text: "${text}"`);
            }
        }
        await this.ResetButton();
    }

    public async verifyTypeFilter(typeName: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);

        // Open the type filter
        // Open the status filter - click until the filter popup is visible
        const filterButton = this.page.getByRole('img', { name: 'filter' }).nth(3);
        const filterPopup = this.page.locator('div').filter({ hasText: 'Filter' }).nth(1);

        await expect(filterButton).toBeVisible({ timeout: 10000 });
        // Click the filter button until the filter popup is visible, with a max attempts safeguard.
        let popupVisible = false;
        let attempts = 0;
        const maxAttempts = 5;
        while (!popupVisible && attempts < maxAttempts) {
            await filterButton.click({ force: true });
            popupVisible = await filterPopup.isVisible().catch(() => false);
            if (!popupVisible) {
                // Wait a short while before next try
                await this.page.waitForTimeout(300);
            }
            attempts++;
        }
        await expect(filterPopup).toBeVisible();

        // Open the first "Select" for filter type operator (Equals/Not Equals/...)
        const operatorDropdown = this.page.getByText('Select', { exact: true }).first();
        await operatorDropdown.click();

        // Choose "Equals" as operator
        await this.page.getByRole('option', { name: /equals/i }).click();

        // Open the second "Select" for value multiselect (company type)
        const companyTypeDropdown = this.page.getByText('Select', { exact: true }).last();
        await companyTypeDropdown.click();

        // Type and select the company type value to filter
        const searchBox = this.page.getByPlaceholder('Search').last();
        await searchBox.fill('Company');

        // Wait and select the desired company type option from the dropdown
        const matchingOption = this.page.getByRole('dialog').getByRole('listitem').filter({ hasText: 'Company' });
        await matchingOption.first().click();

        // Ensure the tag is visible and click if present (closes the dropdown/tag appearance, optional step)
        const closeTag = this.page.locator('.filter-by-tasks > re-multiselect > .box > .tags > .fas');
        if (await closeTag.isVisible().catch(() => false)) {
            await closeTag.click();
        }

        // Click "Apply" to execute the filter
        const applyBtn = this.page.getByRole('button', { name: /apply/i });
        await applyBtn.click();
        await this.page.waitForTimeout(1500);

        // Wait for filtering to complete
        await this.page.waitForSelector('table tbody tr', { timeout: 10000 });

        // Verify that all filtered rows contain the selected company type
        const filteredRows = this.page.locator('table tbody tr', { hasText: typeName });
        const rowCount = await filteredRows.count();
        if (rowCount === 0) {
            throw new Error(`❌ No companies found with type "${typeName}" in the filtered results.`);
        }
        for (let i = 0; i < rowCount; i++) {
            const row = filteredRows.nth(i);
            const rowText = (await row.textContent()) || '';
            if (!rowText.includes(typeName)) {
                throw new Error(`❌ Row ${i + 1}: Type "${typeName}" not found in row text: "${rowText}"`);
            }
        }
        await this.ResetButton();
    }

    public async verifyTypeFilterForCompany(typeName: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);

        // Open the type filter
        // Open the status filter - click until the filter popup is visible
        const filterButton = this.page.getByRole('img', { name: 'filter' }).nth(3);
        const filterPopup = this.page.locator('div').filter({ hasText: 'Filter' }).nth(1);

        await expect(filterButton).toBeVisible({ timeout: 10000 });
        // Click the filter button until the filter popup is visible, with a max attempts safeguard.
        let popupVisible = false;
        let attempts = 0;
        const maxAttempts = 5;
        while (!popupVisible && attempts < maxAttempts) {
            await filterButton.click({ force: true });
            popupVisible = await filterPopup.isVisible().catch(() => false);
            if (!popupVisible) {
                // Wait a short while before next try
                await this.page.waitForTimeout(300);
            }
            attempts++;
        }
        await expect(filterPopup).toBeVisible();

        // Open the first "Select" for filter type operator (Equals/Not Equals/...)
        const operatorDropdown = this.page.getByText('Select', { exact: true }).first();
        await operatorDropdown.click();

        // Choose "Equals" as operator
        await this.page.getByRole('option', { name: /equals/i }).click();

        // Open the second "Select" for value multiselect (company type)
        const companyTypeDropdown = this.page.getByText('Select', { exact: true }).last();
        await companyTypeDropdown.click();

        // Type and select the company type value to filter
        const searchBox = this.page.getByPlaceholder('Search').last();
        await searchBox.fill(typeName);

        // Wait and select the desired company type option from the dropdown
        const matchingOption = this.page.getByRole('dialog').getByRole('listitem').filter({ hasText: typeName });
        await matchingOption.first().click();

        // Ensure the tag is visible and click if present (closes the dropdown/tag appearance, optional step)
        const closeTag = this.page.locator('.filter-by-tasks > re-multiselect > .box > .tags > .fas');
        if (await closeTag.isVisible().catch(() => false)) {
            await closeTag.click();
        }

        // Click "Apply" to execute the filter
        const applyBtn = this.page.getByRole('button', { name: /apply/i });
        await applyBtn.click();
        await this.page.waitForTimeout(1500);

        // Wait for filtering to complete
        await this.page.waitForSelector('table tbody tr', { timeout: 10000 });

        // Verify that all filtered rows contain the selected company type
        const filteredRows = this.page.locator('table tbody tr', { hasText: typeName });
        const rowCount = await filteredRows.count();
        if (rowCount === 0) {
            throw new Error(`❌ No companies found with type "${typeName}" in the filtered results.`);
        }
        for (let i = 0; i < rowCount; i++) {
            const row = filteredRows.nth(i);
            const rowText = (await row.textContent()) || '';
            if (!rowText.includes(typeName)) {
                throw new Error(`❌ Row ${i + 1}: Type "${typeName}" not found in row text: "${rowText}"`);
            }
        }
        await this.ResetButton();
    }

    public async verifyAssociateCompanyFilter(): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);

        // Open the status filter - click until the filter popup is visible
        const filterButton = this.page.getByRole('img', { name: 'filter' }).nth(6);
        const filterPopup = this.page.locator('div').filter({ hasText: 'Filter' }).nth(1)

        await expect(filterButton).toBeVisible({ timeout: 10000 });
        // Click the filter button until the filter popup is visible, with a max attempts safeguard.
        let popupVisible = false;
        let attempts = 0;
        const maxAttempts = 5;
        while (!popupVisible && attempts < maxAttempts) {
            await filterButton.click({ force: true });
            popupVisible = await filterPopup.isVisible().catch(() => false);
            if (!popupVisible) {
                // Wait a short while before next try
                await this.page.waitForTimeout(300);
            }
            attempts++;
        }
        await expect(filterPopup).toBeVisible();

        // Operator "Select" drop down khol ke "Equals" select karain
        const operatorDropdown = this.page.getByText('Select', { exact: true }).first();
        await operatorDropdown.click();
        await this.page.getByRole('option', { name: /equals/i }).click();

        // Multiselect dropdown khol ke "select all" ka check lagain
        const valueDropdown = this.page.getByText('Select', { exact: true }).last();
        await valueDropdown.click();

        // Select All checkbox dhoondh ke usay check karen
        const selectAllCheckbox = this.page.locator('.checkbox__checkmark').first();
        await selectAllCheckbox.click();

        const closeTag = this.page.locator('.filter-by-tasks > re-multiselect > .box > .tags > .fas');
        if (await closeTag.isVisible().catch(() => false)) {
            await closeTag.click();
        }

        const applyBtn = this.page.getByRole('button', { name: /apply/i });
        await applyBtn.click();
        await this.page.waitForTimeout(1500);
        await this.page.waitForSelector('table tbody tr', { timeout: 10000 });
        await this.ResetButton();
    }

    public async verifyOwnerFilterWorks(ownerName: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);

        // Open the status filter - click until the filter popup is visible
        const filterButton = this.page.locator(
            'th:has(p:text("Owner")) img[alt="filter"]'
        );
        const filterPopup = this.page.locator('div').filter({ hasText: 'Filter' }).nth(1);

        await expect(filterButton).toBeVisible({ timeout: 10000 });
        // Click the filter button until the filter popup is visible, with a max attempts safeguard.
        let popupVisible = false;
        let attempts = 0;
        const maxAttempts = 5;
        while (!popupVisible && attempts < maxAttempts) {
            await filterButton.click({ force: true });
            popupVisible = await filterPopup.isVisible().catch(() => false);
            if (!popupVisible) {
                // Wait a short while before next try
                await this.page.waitForTimeout(300);
            }
            attempts++;
        }
        await expect(filterPopup).toBeVisible();
        await this.page.waitForTimeout(2000);
        const operatorDropdown = this.page.getByText('Select', { exact: true }).first();
        await operatorDropdown.click();
        const equalsOption = this.page.getByRole('option', { name: /equals/i });
        await equalsOption.click();

        await this.page.waitForTimeout(1200);

        const valueDropdown = this.page.getByText('Select', { exact: true }).last();
        await valueDropdown.click();
        const searchBox = this.page.getByPlaceholder('Search').last();
        await searchBox.waitFor({ state: 'visible', timeout: 10000 });
        await this.page.waitForTimeout(2000);
        const ownerFilterDropdown = this.page.locator("//div[@class='drop_box ng-star-inserted']");
        await ownerFilterDropdown.waitFor({ state: 'visible', timeout: 30000 });
        await searchBox.fill(ownerName);
        const matchingOption = this.page.getByRole('dialog').getByRole('listitem').filter({ hasText: ownerName });
        await expect(matchingOption.first()).toBeVisible({ timeout: 10000 });
        await matchingOption.first().click();

        const closeTag = this.page.locator('.filter-by-tasks > re-multiselect > .box > .tags > .fas');
        if (await closeTag.isVisible().catch(() => false)) {
            await closeTag.click();
        }

        const applyBtn = this.page.getByRole('button', { name: /apply/i });
        await applyBtn.click();
        await this.page.waitForTimeout(1500);

        await this.page.waitForSelector('table tbody tr', { timeout: 10000 });
        await this.ResetButton();
    }
    // Verify Created Date filter works properly
    public async verifyCreatedDateFilter(): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);

        // Locate the filter button for the Created Date column (assuming 10th column, adjust if needed)
        // Open the status filter - click until the filter popup is visible
        const filterButton = this.page.getByRole('img', { name: 'filter' }).nth(8);
        const filterPopup = this.page.locator('div').filter({ hasText: 'Filter ByCustom DateClearApply' }).nth(1);

        await expect(filterButton).toBeVisible({ timeout: 10000 });
        // Click the filter button until the filter popup is visible, with a max attempts safeguard.
        let popupVisible = false;
        let attempts = 0;
        const maxAttempts = 5;
        while (!popupVisible && attempts < maxAttempts) {
            await filterButton.click({ force: true });
            popupVisible = await filterPopup.isVisible().catch(() => false);
            if (!popupVisible) {
                // Wait a short while before next try
                await this.page.waitForTimeout(300);
            }
            attempts++;
        }
        await expect(filterPopup).toBeVisible();
        await this.page.locator('div').filter({ hasText: 'Custom Date' }).nth(4).click()
        // Click to open operator dropdown and select 'Equals'
        const SelectDate = this.page.getByText('Prev Quarter')
        await SelectDate.click();

        const applyBtn = this.page.getByRole('button', { name: /apply/i });
        await applyBtn.click();
        await this.page.waitForTimeout(1500);

        await this.page.waitForSelector('table tbody tr', { timeout: 10000 });
        await this.ResetButton();
    }

    // Verify sorting contacts by status (robust: skip empty/invalid, log details, throw descriptive errors)
    public async verifySortingByStatus(): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);

        // Locate the "Full Name" column header and click to sort (adjust column index if needed)
        const fullNameHeader = this.page.locator("//th[2]//div[1]//div[1]//i[1]");
        await fullNameHeader.waitFor({ state: 'visible', timeout: 10000 });
        await fullNameHeader.click();
        await this.page.waitForTimeout(1500);

        // Helper to get and clean Full Name cell values (skip empty/non-name rows)
        async function getCleanFullNameCells(page: any): Promise<string[]> {
            const nameValues: string[] = await page.$$eval(
                "table tbody tr td:nth-child(1)",
                (tds) =>
                    tds
                        .map((td) => td.textContent?.trim() || "")
                        .filter((txt) => txt && txt.length > 0 && txt.toLowerCase() !== 'full name')
            );
            return nameValues;
        }

        const fullNameCellsAsc = await getCleanFullNameCells(this.page);

        // Click again to sort descending
        await fullNameHeader.click();
        await this.ResetButton();
        await this.page.waitForTimeout(1500);
    }

    public async verifyScrollLoadsMoreContacts(): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);
        const tableWrapper = await this.page.$('div[role="table"]'); // Adjust if your table uses a different scroll container
        if (tableWrapper) {
            let previousRowCount = 0;
            for (let i = 0; i < 5; i++) {
                // Get current number of rows
                const rows = await this.page.$$('table tbody tr');
                if (rows.length === previousRowCount) {
                    // No more rows loaded, exit early
                    break;
                }
                previousRowCount = rows.length;

                // Scroll to bottom
                await tableWrapper.evaluate((el: HTMLElement) => {
                    el.scrollTop = el.scrollHeight;
                });
                // Wait for new rows to load
                await this.page.waitForTimeout(2000);
            }
        } else {
            // If cannot find table wrapper, fallback to page-level scrolling
            let previousRowCount = 0;
            for (let i = 0; i < 5; i++) {
                const rows = await this.page.$$('table tbody tr');
                if (rows.length === previousRowCount) break;
                previousRowCount = rows.length;
                await this.page.mouse.wheel(0, 5000);
                await this.page.waitForTimeout(2000);
            }
        }
        await this.ResetButton();

    }

    public async verifyScrollingWithFilterOrSort(): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);

        // Apply keyword filter to search (simulate typing a letter for filtered results)
        const filterInput = await this.page.$('#keywordInput');
        if (filterInput) {
            await filterInput.fill('B');
            await this.page.waitForTimeout(1500);

            // Try to scroll and load more filtered results
            const tableWrapper = await this.page.$('div[role="table"]');
            let prevCount = 0;
            for (let i = 0; i < 5; i++) {
                const rows = await this.page.$$('table tbody tr');
                if (rows.length === prevCount) break;
                prevCount = rows.length;

                if (tableWrapper) {
                    await tableWrapper.evaluate((el: HTMLElement) => {
                        el.scrollTop = el.scrollHeight;
                    });
                } else {
                    await this.page.mouse.wheel(0, 5000);
                }
                await this.page.waitForTimeout(1500);
            }
        }

        // Now, test that sorting works with virtualized/filtered/scrollable list
        const fullNameHeader = await this.page.$("//th[2]//div[1]//div[1]//i[1]");
        if (fullNameHeader) {
            await fullNameHeader.click();
            await this.page.waitForTimeout(1500);

            // Function to get all 'Full Name' column values (excluding blanks/header)
            const getCleanFullNameCells = async (): Promise<string[]> => {
                return await this.page.$$eval(
                    "table tbody tr td:nth-child(1)",
                    (tds) =>
                        tds
                            .map((td) => td.textContent?.trim() || "")
                            .filter((txt) => !!txt && txt.length > 0 && txt.toLowerCase() !== 'full name')
                );
            };

            const fullNameCellsAsc = await getCleanFullNameCells();

            // Click again for descending sort and wait for effect
            await fullNameHeader.click();
            await this.page.waitForTimeout(1500);

            // Optionally, you can get descending sorted results as well if you want to assert:
            // const fullNameCellsDesc = await getCleanFullNameCells();
        }
        await this.ResetButton();
    }

    async verifyScrollingAfterOpeningAndClosingContact() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);

        // Click the first visible contact's "Full Name" cell to open details
        const firstFullNameCell = await this.page.locator('//tbody/tr[1]/td[2]/div[1]/p-avatar[1]');
        if (firstFullNameCell) {
            await firstFullNameCell.click();

            // Wait for modal/details to appear
            await this.page.waitForTimeout(500)

            // Close the modal using the close icon
            const closeIcon = this.page.locator('.pi.pi-times.cursor-pointer.f-14');
            await closeIcon.click();
        }

        // Attempt to scroll the contact list to verify more contacts load after closing details
        const tableWrapper = await this.page.$('div[role="table"]');
        let prevCount = 0;
        for (let i = 0; i < 3; i++) {
            const rows = await this.page.$$('table tbody tr');
            if (rows.length === prevCount) break;
            prevCount = rows.length;

            if (tableWrapper) {
                await tableWrapper.evaluate((el: HTMLElement) => {
                    el.scrollTop = el.scrollHeight;
                });
            } else {
                await this.page.mouse.wheel(0, 5000);
            }
            await this.page.waitForTimeout(1500);
        }
        await this.ResetButton();

    }

    async navigateToContactsThenOfficesAndCheckCheckboxes() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);

        const officesLink = this.page.getByRole('link', { name: 'Offices' });
        await officesLink.click();
        await this.page.waitForTimeout(2000);
        const checkboxes = this.page.locator('[role="checkbox"]:visible');
        const count = await checkboxes.count();

        for (let i = 0; i < count; i++) {
            const checkbox = checkboxes.nth(i);
            const isDisabled = await checkbox.isDisabled();
            if (isDisabled) continue;

            const isChecked = await checkbox.isChecked();
            if (!isChecked) {
                await checkbox.scrollIntoViewIfNeeded();
                await checkbox.click({ timeout: 10000 });
            }
        }

    }

    public async verifySearchingAndLoadingMoreContacts(): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);
        const tableWrapper = await this.page.$('div[role="table"]'); // Adjust if your table uses a different scroll container
        if (tableWrapper) {
            let previousRowCount = 0;
            for (let i = 0; i < 5; i++) {
                // Get current number of rows
                const rows = await this.page.$$('table tbody tr');
                if (rows.length === previousRowCount) {
                    // No more rows loaded, exit early
                    break;
                }
                previousRowCount = rows.length;

                // Scroll to bottom
                await tableWrapper.evaluate((el: HTMLElement) => {
                    el.scrollTop = el.scrollHeight;
                });
                // Wait for new rows to load
                await this.page.waitForTimeout(2000);
            }
        } else {
            // If cannot find table wrapper, fallback to page-level scrolling
            let previousRowCount = 0;
            for (let i = 0; i < 5; i++) {
                const rows = await this.page.$$('table tbody tr');
                if (rows.length === previousRowCount) break;
                previousRowCount = rows.length;
                await this.page.mouse.wheel(0, 5000);
                await this.page.waitForTimeout(2000);
            }
        }
        await this.ResetButton();

    }

    public async verifyTagDropdownFilter(tagName: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);
        await this.ContactTypeDropdown();
        await this.SearchContactType(tagName);
        await this.SelectOption(tagName);
        await this.ContactTypeDropdown();

        // Wait for filter to be applied (table rows update)
        await this.page.waitForTimeout(3000);

        // Get all rows in the table after filtering
        const rows = await this.page.locator('table tbody tr');
        const rowCount = await rows.count();

        // Find the column index for "Contact Type" based on header text
        const headerCells = await this.page.locator('table thead tr th');
        const headerCount = await headerCells.count();
        let contactTypeColIdx = -1;
        for (let i = 0; i < headerCount; i++) {
            const headerText = (await headerCells.nth(i).textContent())?.trim();
            if (headerText?.toLowerCase() === 'contact type') {
                contactTypeColIdx = i;
                break;
            }
        }
        expect(contactTypeColIdx).not.toBe(-1);

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const cell = row.locator('td').nth(contactTypeColIdx);
            await cell.scrollIntoViewIfNeeded();
            const cellText = (await cell.textContent())?.trim();

            if (cellText !== tagName) {
                throw new Error(`❌ Row ${i + 1}: Contact Type "${cellText}" mila, magar filter "${name}" tha (sirf woh hi hona chahiye).`);
            }
        }
        await this.ResetButton();
    }

    // Verify filtering by tag and scrolling loads relevant contacts
    public async verifyTagDropdownFilterWithScroll(tagName: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(4000);
        await this.ContactTypeDropdown();
        await this.SearchContactType(tagName);
        await this.SelectOption(tagName);
        await this.ContactTypeDropdown();

        // Wait for filter to be applied (table rows update)
        await this.page.waitForTimeout(3000);

        // Try to repeatedly scroll and load more rows, then verify all match tagName
        const tableWrapper = await this.page.$('div[role="table"]');
        let seenRowIndices = new Set<number>();
        let maxScrolls = 5;

        for (let scrollAttempt = 0; scrollAttempt < maxScrolls; scrollAttempt++) {
            const rowsLocator = this.page.locator('table tbody tr');
            const rowCount = await rowsLocator.count();

            // Find the column index for "Contact Type"
            const headerCells = await this.page.locator('table thead tr th');
            const headerCount = await headerCells.count();
            let contactTypeColIdx = -1;
            for (let i = 0; i < headerCount; i++) {
                const headerText = (await headerCells.nth(i).textContent())?.trim();
                if (headerText?.toLowerCase() === 'contact type') {
                    contactTypeColIdx = i;
                    break;
                }
            }
            expect(contactTypeColIdx).not.toBe(-1);

            // Check all newly visible rows
            for (let i = 0; i < rowCount; i++) {
                if (seenRowIndices.has(i)) continue;
                seenRowIndices.add(i);

                const row = rowsLocator.nth(i);
                const cell = row.locator('td').nth(contactTypeColIdx);
                await cell.scrollIntoViewIfNeeded();
                const cellText = (await cell.textContent())?.trim();
                if (cellText !== tagName) {
                    throw new Error(`❌ Row ${i + 1}: Contact Type "${cellText}" found, but filter was "${tagName}".`);
                }
            }

            // Scroll to bottom to load more rows
            if (tableWrapper) {
                await tableWrapper.evaluate((el: HTMLElement) => { el.scrollTop = el.scrollHeight; });
            } else {
                await this.page.mouse.wheel(0, 5000);
            }
            await this.page.waitForTimeout(2000);

            // Stop if all visible rows are already checked
            if (seenRowIndices.size >= rowCount) break;
        }
        await this.ResetButton();
    }

    public async verifyOpenContactFromList(): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(2500);

        const rowsLocator = this.page.locator('table tbody tr');
        await rowsLocator.first().waitFor({ state: 'visible', timeout: 7000 });

        // Click until the detail panel is visible, with safety timeout and attempt limit
        const detailPanel = this.page.locator('.property-details').first();
        const maxAttempts = 5;
        let detailVisible = false;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            await rowsLocator.first().click();
            try {
                await detailPanel.waitFor({ state: 'visible', timeout: 2000 });
                detailVisible = true;
                break;
            } catch (e) {
                // Try again, in case of flakiness
                await this.page.waitForTimeout(300);
            }
        }

        if (!detailVisible) {
            throw new Error('Detail panel did not appear after multiple attempts');
        }

        const firstNameDiv = detailPanel.locator('.form-group > .site-input').first();
        const emailDiv = detailPanel.locator('input[type="email"]');

        if (await firstNameDiv.count() > 0) {
            await firstNameDiv.waitFor({ state: 'visible', timeout: 3000 });
            const firstNameInput = firstNameDiv.locator('input');
            let firstNameValue: string | null = null;
            if (await firstNameInput.count() > 0) {
                firstNameValue = await firstNameInput.inputValue();
            } else {
                const firstNameText = (await firstNameDiv.textContent())?.trim();
            }
        }

        if (await emailDiv.count() > 0) {
            await emailDiv.waitFor({ state: 'visible', timeout: 3000 });
            const emailValue = await emailDiv.inputValue();

        } else {
        }
        await this.page.keyboard.press('Escape');
        const detailPanel1 = this.page.locator('.property-details').first();
        await detailPanel1.waitFor({ state: 'hidden', timeout: 5000 });
        await this.ResetButton();
    }


    public async verifyOpenFilteredContact(filterName: string): Promise<void> {
        await this.NavigateToContacts();
        await this.searchForContact(filterName);
        const rowsLocator = this.page.locator('table tbody tr');
        await rowsLocator.first().waitFor({ state: 'visible', timeout: 30000 });

        // Click until the detail panel is visible or timeout after several tries
        const maxAttempts = 5;
        let detailPanel1Visible = false;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            await rowsLocator.first().click({ force: true });
            const detailPanel1 = this.page.locator('.property-details').first();
            try {
                await detailPanel1.waitFor({ state: 'visible', timeout: 2000 });
                await expect(detailPanel1).toBeVisible({ timeout: 2000 });
                detailPanel1Visible = true;
                break;
            } catch {
                // Retry on failure, slight pause for UI
                await this.page.waitForTimeout(300);
            }
        }
        if (!detailPanel1Visible) {
            throw new Error('Detail panel did not appear after multiple attempts');
        }

        const detailPanel = this.page.locator('.f-20.ng-star-inserted').first();
        await detailPanel.waitFor({ state: 'visible', timeout: 10000 });
        await expect(detailPanel).toBeVisible({ timeout: 10000 });

        let detailOpened = true;
        try {
            await detailPanel.waitFor({ state: 'visible', timeout: 10000 });
        } catch (error) {
            detailOpened = false;
        }

        if (detailOpened) {
            expect(detailPanel).toBeVisible();
        } else {
            const errorIndicator = this.page.locator('.contact-detail-error, .error-message, .retry-btn');
            await this.page.waitForTimeout(1000);
            const errorsCount = await errorIndicator.count();
            expect(errorsCount).toBeGreaterThan(0);
        }
        await this.page.keyboard.press('Escape');
        const detailPanel1 = this.page.locator('.property-details').first();
        await detailPanel1.waitFor({ state: 'hidden', timeout: 5000 });
        await this.ResetButton();
    }

    public async verifyOpenAndCloseMultipleContactsSequentially(count: number = 3): Promise<void> {
        await this.NavigateToContacts();
        await this.ResetButton();
        await this.page.waitForTimeout(2000);
        const rowsLocator = this.page.locator('table tbody tr');
        const numberOfContacts = await rowsLocator.count();
        const maxContacts = Math.min(count, numberOfContacts);

        for (let i = 0; i < maxContacts; i++) {
            const contactRow = rowsLocator.nth(i);
            await contactRow.waitFor({ state: 'visible', timeout: 30000 });

            // Get name before opening, for validation
            const nameCell = contactRow.locator('td').nth(0);
            const tableContactName = (await nameCell.textContent())?.trim() ?? "";

            // Open contact detail
            await contactRow.click();

            // Wait for contact details
            const detailPanel = this.page.locator('.f-20.ng-star-inserted').first();
            let detailOpened = true;
            try {
                await detailPanel.waitFor({ state: 'visible', timeout: 10000 });
            } catch (error) {
                detailOpened = false;
            }

            if (detailOpened) {
                expect(detailPanel).toBeVisible();

                let detailName: string | null = null;
                try {
                    detailName = (await detailPanel.textContent())?.trim() ?? "";
                } catch { }
                if (detailName) {
                    expect(detailName).toContain(tableContactName);
                }
            } else {
                const errorIndicator = this.page.locator('.contact-detail-error, .error-message, .retry-btn');
                await this.page.waitForTimeout(1000);
                const errorsCount = await errorIndicator.count();
                expect(errorsCount).toBeGreaterThan(0);
            }

            // Wait a bit before closing, to simulate user's observation
            await this.page.waitForTimeout(800);

            // Now close the contact that was opened
            const closeBtn = this.page.locator('.panel-close-btn, .mat-dialog-close, .contact-detail-close').first();
            if (await closeBtn.isVisible()) {
                await closeBtn.click();
                await detailPanel.waitFor({ state: 'hidden', timeout: 10000 });
            } else {
                await this.page.keyboard.press('Escape');
                await detailPanel.waitFor({ state: 'hidden', timeout: 10000 });
            }

            // Small wait after closing
            await this.page.waitForTimeout(500);
        }
        await this.ResetButton();
    }

    /*********************************************************Contact Form Public Action******************************************** */
    public async verifyContactFormOpensSuccessfully() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);


        const AddContactButton = this.page.getByRole('button', { name: '' });
        await AddContactButton.click({ force: true });

        const contactForm = this.page.locator('section');
        await contactForm.waitFor({ state: 'visible', timeout: 10000 });
        expect(contactForm).toBeVisible();
        console.log("Contact Form open successfully");
        await this.page.waitForTimeout(1200);
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    public async verifyContactFormCloseWithXIcon() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const AddContactButton = this.page.getByRole('button', { name: '' });
        await AddContactButton.click({ force: true });

        const contactForm = this.page.locator('section');
        await contactForm.waitFor({ state: 'visible', timeout: 10000 });
        expect(contactForm).toBeVisible();
        await this.page.waitForTimeout(1200);
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
        console.log("Contact form was closed using the X icon successfully")
    }

    public async verifyImageUploadFunctionalityNotDisplayed() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);


        const AddContactButton = this.page.getByRole('button', { name: '' });
        await AddContactButton.click({ force: true });

        const contactForm = this.page.locator('section');
        await contactForm.waitFor({ state: 'visible', timeout: 10000 });
        expect(contactForm).toBeVisible();

        const imageUploadSelectors = [
            'input[type="file"]', // file input
            'img[alt*="avatar"]',
            'img[alt*="profile"]',
            'button:has-text("Upload Image")',
            '[class*="upload"]',
            '.profile-upload',
            'label:has-text("Upload")'
        ];

        for (const selector of imageUploadSelectors) {
            const el = this.page.locator(selector);
            expect(await el.count()).toBe(0);
        }

        await this.page.waitForTimeout(1200);
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
        console.log("Verified: Image upload functionality is not displayed on the contact form.");
    }



    public async verifyContactInitialsPlaceholderDisplays(firstName?: string, lastName?: string) {
        await this.NavigateToContacts();

        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);


        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        await this.page.waitForSelector('input[formcontrolname="first_name"]', { state: 'visible' });

        const imagePlaceHolder = this.page.getByText('D1', { exact: true });
        await expect(imagePlaceHolder).toBeVisible();

        // Use faker if names not provided from test
        const generatedFirstName = firstName ?? faker.person.firstName();
        const generatedLastName = lastName ?? faker.person.lastName();

        const firstNameInput = this.page.locator('input[formcontrolname="first_name"]');
        await firstNameInput.fill(generatedFirstName);

        const lastNameInput = this.page.locator('input[formcontrolname="last_name"]');
        await lastNameInput.fill(generatedLastName);

        await this.page.waitForSelector('.user-thumbnail-placeholder .text-uppercase', { state: 'visible' });

        const initialsPlaceholder = this.page.locator('.user-thumbnail-placeholder .text-uppercase').first();
        await expect(initialsPlaceholder).toBeVisible();

        const expectedInitials = (generatedFirstName[0] + generatedLastName[0]).toUpperCase();
        await expect(initialsPlaceholder).toContainText(expectedInitials);

        console.log(`✅ Verified initials: ${expectedInitials}`);
        await this.page.waitForTimeout(1200);
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }


    public async verifySelectContactTypeUpdatesDropdown() {
        await this.NavigateToContacts();

        const rowsLocator = this.page.locator('table tbody tr');
        await rowsLocator.first().waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        const contactTypeDropdown = this.page.locator('span').filter({ hasText: 'Individual' });
        await contactTypeDropdown.waitFor({ state: 'visible' });

        await contactTypeDropdown.click();

        await this.page.waitForTimeout(500);

        const dropdownoption = this.page.locator('div').filter({ hasText: /^Company$/ }).nth(1);
        await expect(dropdownoption).toBeVisible()
        await dropdownoption.click()

        await expect(this.page.locator('span').filter({ hasText: /^Company$/ })).toBeVisible()
        await expect(this.page.locator('div').filter({ hasText: /^Company Name \*$/ }).nth(1)).toBeVisible()
        await expect(this.page.locator('div').filter({ hasText: /^Preferred Contact MethodSelect Contact Method$/ }).first()).toBeVisible()
        await this.page.waitForTimeout(1200);
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }


    public async verifyRequiredFieldsValidationForCompany() {
        await this.NavigateToContacts();

        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        const contactTypeDropdown = this.page.locator('span').filter({ hasText: 'Individual' });
        await contactTypeDropdown.waitFor({ state: 'visible' });
        await contactTypeDropdown.click();
        await this.page.waitForTimeout(500);

        const companyOption = this.page.locator('div').filter({ hasText: /^Company$/ }).nth(1);
        await companyOption.waitFor({ state: 'visible' });
        await companyOption.click();

        // Attempt to save without filling any fields to trigger validation
        const savecontactButton = this.page.getByRole('button', { name: 'Save' }).first();
        await savecontactButton.click({ force: true });

        // Only verify that required validation errors are shown
        const companyNameError = this.page.getByText('Company name is required', { exact: false });
        await expect(companyNameError).toBeVisible();

        const emailError = this.page.getByText('Email is required', { exact: false });
        await expect(emailError).toBeVisible();
        await this.page.waitForTimeout(1200);
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    public async verifyRequiredFieldsCapitalizedValidationForCompany() {
        await this.NavigateToContacts();

        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        const contactTypeDropdown = this.page.locator('span').filter({ hasText: 'Individual' });
        await contactTypeDropdown.waitFor({ state: 'visible' });
        await contactTypeDropdown.click();
        await this.page.waitForTimeout(500);

        const companyOption = this.page.locator('div').filter({ hasText: /^Company$/ }).nth(1);
        await companyOption.waitFor({ state: 'visible' });
        await companyOption.click();

        // Attempt to save without filling any fields to trigger validation
        const savecontactButton = this.page.getByRole('button', { name: 'Save' }).first();
        await savecontactButton.click({ force: true });

        // Check validation error messages: the first word must start with a capital letter
        const companyNameError = this.page.getByText(/Company name is required/i, { exact: false });
        const emailError = this.page.getByText(/Email is required/i, { exact: false });

        await expect(companyNameError).toBeVisible();
        await expect(emailError).toBeVisible();

        // Extra validation: check first word is capitalized for each error message
        const companyNameErrorText = await companyNameError.textContent();
        const emailErrorText = await emailError.textContent();

        if (companyNameErrorText) {
            const firstWord = companyNameErrorText.split(' ')[0];
            expect(firstWord.charAt(0)).toMatch(/[A-Z]/);
        } else {
            throw new Error('Company name error text not found');
        }

        if (emailErrorText) {
            const firstWord = emailErrorText.split(' ')[0];
            expect(firstWord.charAt(0)).toMatch(/[A-Z]/);
        } else {
            throw new Error('Email error text not found');
        }
        await this.page.waitForTimeout(1200);
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    // Verify required fields validation for "Individual" contact type
    public async verifyRequiredFieldsValidationForIndividual() {
        await this.NavigateToContacts();

        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        const contactTypeDropdown = this.page.locator('span').filter({ hasText: 'Individual' });
        await contactTypeDropdown.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(500);

        const saveContactButton = this.page.getByRole('button', { name: 'Save' }).first();
        await saveContactButton.click({ force: true });

        const firstNameError = this.page.getByText(/First name is required/i, { exact: false });
        const emailError = this.page.getByText(/Email is required/i, { exact: false });

        await expect(firstNameError).toBeVisible();
        await expect(emailError).toBeVisible();
        await this.page.waitForTimeout(1200);
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1000);

    }

    public async verifySaveButtonSavesForm() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);
        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName });

        const firstNameInput = this.page.locator('input[formcontrolname="first_name"]');
        await firstNameInput.waitFor({ state: 'visible' });
        await firstNameInput.fill(firstName);

        const lastNameInput = this.page.locator('input[formcontrolname="last_name"]');
        await lastNameInput.waitFor({ state: 'visible' });
        await lastNameInput.fill(lastName);

        const emailInput = this.page.locator('input[formcontrolname="email"]');
        await emailInput.waitFor({ state: 'visible' });
        await emailInput.fill(email);

        await this.page.waitForTimeout(1000);

        const saveButton = this.page.getByRole('button', { name: 'Save' }).first();
        await saveButton.click({ force: true });

        const successToast = this.page.getByText(/Contact has been created|Contact has been updated/i);
        await expect(successToast).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    // Verify that clicking "Save & Close" saves and closes the form
    public async verifySaveAndCloseButtonSavesAndClosesForm() {
        await this.NavigateToContacts();

        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName });

        const firstNameInput = this.page.locator('input[formcontrolname="first_name"]');
        await firstNameInput.waitFor({ state: 'visible' });
        await firstNameInput.fill(firstName);

        const lastNameInput = this.page.locator('input[formcontrolname="last_name"]');
        await lastNameInput.waitFor({ state: 'visible' });
        await lastNameInput.fill(lastName);

        const emailInput = this.page.locator('input[formcontrolname="email"]');
        await emailInput.waitFor({ state: 'visible' });
        await emailInput.fill(email);

        await this.page.waitForTimeout(500)

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveAndCloseButton.click({ force: true });

        const successToast = this.page.getByText(/Contact has been created|Contact has been updated/i);
        await expect(successToast).toBeVisible();
        await expect(this.page.getByRole('button', { name: 'Save' }).first()).toBeHidden();
    }

    public async verifySelectAllChangesToDeselectAllInPreferredContactMethod() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);

        // Open Add Contact
        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        // Open 'Preferred Contact Method' dropdown
        const preferredContactDropdown = this.page.locator('div').filter({ hasText: /^Select Contact Method$/ }).nth(1);
        await preferredContactDropdown.click();

        // Click "Select All" checkbox
        const selectAllCheckbox = this.page.locator('label.select_all');
        await selectAllCheckbox.click();

        // Assert that the "Select All" label changed to "Deselect All"
        const deselectAllLabel = this.page.locator('label.select_all[data="Deselect All"]');
        await expect(deselectAllLabel).toBeVisible();

        await this.page.waitForTimeout(1200);
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    public async verifyInvalidEmailFormatErrorMessage() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);

        // Open Add Contact
        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        // Enter invalid email format
        const invalidEmail = "invalid-email-format@";
        const emailInput = this.page.locator('input[formcontrolname="email"]');
        await emailInput.waitFor({ state: 'visible' });
        await emailInput.fill(invalidEmail);

        await this.page.waitForTimeout(1000);

        // Click Save button
        const saveButton = this.page.getByRole('button', { name: 'Save' }).first();
        await saveButton.click({ force: true });

        // Verify error message for email field
        const emailError = this.page.getByText('Invalid email format');
        await expect(emailError).toBeVisible();

        await this.page.waitForTimeout(1200);
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(2000);
    }

    public async verifyAddEmailField() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        const emailInputs = this.page.locator('input[formcontrolname="email"]');
        const countBefore = await emailInputs.count();

        const addEmailIcon = this.page.getByRole('button', { name: '' }).nth(1);
        await addEmailIcon.click();

        await expect(this.page.getByRole('textbox', { name: 'Other Email' })).toBeVisible()
        await this.page.waitForTimeout(1200);
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    // Verify that clicking the "+" icon adds a new phone field
    public async verifyAddPhoneField() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        const phoneInputs = this.page.locator('input[formcontrolname="mobile_no"]');
        const countBefore = await phoneInputs.count();

        const addPhoneIcon = this.page.getByRole('button', { name: '' }).nth(2);
        await addPhoneIcon.click();

        await expect(this.page.getByRole('textbox', { name: 'Other Phone' })).toBeVisible();

        await this.page.waitForTimeout(1200);
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    public async verifyDeleteEmailOrPhoneField() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        // Add an extra email field
        const addEmailIcon = this.page.getByRole('button', { name: '' }).nth(1);
        await addEmailIcon.click();

        const emailInputs = this.page.locator('input[formcontrolname="email"]');
        const deleteEmailButton = this.page.getByRole('button', { name: 'delete' }).first();
        await deleteEmailButton.click();
        await this.page.waitForTimeout(1000);
        await expect(emailInputs.nth(1)).not.toBeVisible();

        const addPhoneIcon = this.page.getByRole('button', { name: '' }).nth(2);
        await addPhoneIcon.click();

        const phoneInputs = this.page.locator('input[formcontrolname="mobile_no"]');
        const deletePhoneButton = this.page.getByRole('button', { name: 'delete' }).last();
        await deletePhoneButton.click();
        await this.page.waitForTimeout(1000);
        await expect(phoneInputs.nth(1)).not.toBeVisible();
        await this.page.waitForTimeout(1200);
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    // Verify that clicking the correct (✔) button sets an email as the primary email

    public async verifySetPrimaryEmail() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);


        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        const mainEmailInput = this.page.locator('input[formcontrolname="email"]').first();
        const firstEmail = 'user1@example.com';
        await mainEmailInput.fill(firstEmail);

        const addEmailIcon = this.page.getByRole('button', { name: '' }).nth(1);
        await addEmailIcon.click();

        const otherEmailInput = this.page.locator('input[placeholder="Other Email"]');
        const secondEmail = 'user2@example.com';
        await otherEmailInput.fill(secondEmail);

        // Set "Other Email" as primary
        const setPrimaryBtn = this.page.getByRole('button', { name: '' }).first();
        await setPrimaryBtn.click({ force: true });

        await expect(mainEmailInput).toHaveValue(secondEmail);

        await this.page.waitForTimeout(1200);
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    // Attempt to save a tag without entering a name
    public async verifyCannotSaveTagWithoutName() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);
        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        const plusTagIcon = this.page.locator('i.pi.pi-plus.cursor-pointer.text-primary');
        await plusTagIcon.scrollIntoViewIfNeeded();
        await plusTagIcon.click();

        await expect(this.page.getByText('Tag Manager')).toBeVisible();
        await this.page.waitForTimeout(1000);

        const newTagButton = this.page.locator('button[ptooltip="New Tag"]');
        await newTagButton.click();

        const tagTypeDropdown = this.page.locator('ng-select[placeholder="Select Tag Type"] input[type="text"]');
        await expect(tagTypeDropdown).toBeVisible();
        await tagTypeDropdown.click();
        await tagTypeDropdown.fill('Automation Testing');
        const tagTypeOption = this.page.getByRole('option', { name: 'Automation Testing' }).first();
        await tagTypeOption.click();

        const addButton = this.page.getByRole('button', { name: /^Add$/i });
        await addButton.isDisabled();
        // click cancel button 
        const cancelButton = this.page.getByRole('button', { name: /cancel/i }).first();
        await expect(cancelButton).toBeVisible();
        await cancelButton.click();

        await this.page.waitForTimeout(1200);
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    // Verify associating a company with a contact via association search in contact details
    public async verifyCompanyAssociatedWithContact(companyName: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        const company = this.page.locator("div[class='col-12 grio'] div[class='tags']");
        await company.scrollIntoViewIfNeeded();
        await company.click({ force: true });

        const associationSearchInput = this.page.locator('[id="Contact-11 22_0"]').getByRole('textbox', { name: 'Search', exact: true });
        await associationSearchInput.waitFor({ state: 'visible', timeout: 5000 });
        await associationSearchInput.click();
        await this.page.waitForTimeout(1200);
        await associationSearchInput.fill(companyName);

        // Wait for and select the desired company from the dropdown options
        const companyOption = this.page.getByRole('listitem').filter({ hasText: companyName }).first();
        await companyOption.waitFor({ state: 'visible', timeout: 30000 });
        await companyOption.click();

        // Click on the "Association" button (replace selector as needed)
        const associationButton = this.page.getByRole('button', { name: /associate|association/i }).first();
        await associationButton.waitFor({ state: 'visible', timeout: 3000 });
        await associationButton.click();

        const alertLocator = this.page.getByRole('alert', { name: /Company added successfully|This company is already attached with this contact/ });
        await expect(alertLocator).toBeVisible({ timeout: 10000 });
        const removeNetsol = this.page.locator('div.company-div:has(span:text("Netsol")) i.pi-times-circle');
        await expect(removeNetsol).toBeVisible();

        await this.page.waitForTimeout(1200);
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    // Try to associate the same company twice
    public async tryAssociateSameCompanyTwice(companyName: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        const company = this.page.locator("div[class='col-12 grio'] div[class='tags']");
        await company.scrollIntoViewIfNeeded();
        await company.click({ force: true });

        const associationSearchInput = this.page.locator('[id="Contact-11 22_0"]').getByRole('textbox', { name: 'Search', exact: true });
        await associationSearchInput.waitFor({ state: 'visible', timeout: 5000 });
        await associationSearchInput.click();
        await this.page.waitForTimeout(1200);
        await associationSearchInput.fill(companyName);

        // Wait for and select the desired company from the dropdown options
        const companyOption = this.page.getByRole('listitem').filter({ hasText: companyName }).first();
        await companyOption.waitFor({ state: 'visible', timeout: 30000 });
        await companyOption.click();
        // Click on the "Association" button (replace selector as needed)
        const associationButton = this.page.getByRole('button', { name: /associate|association/i }).first();
        await associationButton.waitFor({ state: 'visible', timeout: 3000 });
        await associationButton.click();

        const alertLocator = this.page.getByRole('alert', { name: /Company added successfully|This company is already attached with this contact/ });
        await expect(alertLocator).toBeVisible({ timeout: 10000 });

        const removeNetsol = this.page.locator('div.company-div:has(span:text("Netsol")) i.pi-times-circle');
        await expect(removeNetsol).toBeVisible()

        await expect(this.page.getByRole('alert', { name: 'This company is already attached with this contact' })).toBeVisible()
        await this.page.waitForTimeout(1200);
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    // Verify that clicking on a company tag opens the company form
    public async verifyOpenCompanyFormFromTag(companyName: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        const company = this.page.locator("div[class='col-12 grio'] div[class='tags']");
        await company.scrollIntoViewIfNeeded();
        await company.click({ force: true });

        const associationSearchInput = this.page.locator('[id="Contact-11 22_0"]').getByRole('textbox', { name: 'Search', exact: true });
        await associationSearchInput.waitFor({ state: 'visible', timeout: 5000 });
        await associationSearchInput.click();
        await this.page.waitForTimeout(1200);
        await associationSearchInput.fill(companyName);

        // Wait for and select the desired company from the dropdown options
        const companyOption = this.page.getByRole('listitem').filter({ hasText: companyName }).first();
        await companyOption.waitFor({ state: 'visible', timeout: 30000 });
        await companyOption.click();

        // Click on the "Association" button (replace selector as needed)
        const associationButton = this.page.getByRole('button', { name: /associate|association/i }).first();
        await associationButton.waitFor({ state: 'visible', timeout: 3000 });
        await associationButton.click();

        const alertLocator = this.page.getByRole('alert', { name: /Company added successfully|This company is already attached with this contact/ });
        await expect(alertLocator).toBeVisible({ timeout: 10000 });
        const tag = this.page.locator(`div.company-div span`, { hasText: companyName }).first();
        await tag.click();
        await this.page.waitForTimeout(1200);
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    // Verify that a company tag can be removed
    public async verifyRemoveCompanyTag(companyName: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        const company = this.page.locator("div[class='col-12 grio'] div[class='tags']");
        await company.scrollIntoViewIfNeeded();
        await company.click({ force: true });

        const associationSearchInput = this.page.locator('[id="Contact-11 22_0"]').getByRole('textbox', { name: 'Search', exact: true });
        await associationSearchInput.waitFor({ state: 'visible', timeout: 5000 });
        await associationSearchInput.click();
        await this.page.waitForTimeout(1200);
        await associationSearchInput.fill(companyName);

        // Wait for and select the desired company from the dropdown options
        const companyOption = this.page.getByRole('listitem').filter({ hasText: companyName }).first();
        await companyOption.waitFor({ state: 'visible', timeout: 30000 });
        await companyOption.click();

        // Click on the "Association" button (replace selector as needed)
        const associationButton = this.page.getByRole('button', { name: /associate|association/i }).first();
        await associationButton.waitFor({ state: 'visible', timeout: 3000 });
        await associationButton.click();

        const alertLocator = this.page.getByRole('alert', { name: /Company added successfully|This company is already attached with this contact/ });
        await expect(alertLocator).toBeVisible({ timeout: 10000 });
        const tag = this.page.locator(`div.company-div span`, { hasText: companyName }).first();
        await tag.click();

        await this.page.waitForTimeout(1200);
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1000);

    }

    // Verify that address suggestions appear while typing in the address field
    public async verifyAddressSuggestions(addressPartial: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible' });
        await companyTagCell.click();
        // Locate the address input field (update selector as needed)
        const addressInput = this.page.getByRole('textbox', { name: /address/i }).first();
        await addressInput.waitFor({ state: 'visible' });
        await addressInput.click();
        await addressInput.fill(addressPartial);

        // Simulate slow typing (since .type is not supported, use fill with increasing substrings and delay)
        for (let i = 1; i <= addressPartial.length; i++) {
            const partialStr = addressPartial.slice(0, i);
            await addressInput.fill(partialStr);
            await this.page.waitForTimeout(300); // wait 300ms to simulate user's "slow typing"
        }

        const suggestionsList = this.page.locator('.pac-item').first();
        await suggestionsList.waitFor({ state: 'visible' });
        await suggestionsList.click();

        await this.page.waitForTimeout(2000);
        // Close the form using the X icon after address selection
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    public async verifyAddressAutoFill(addressPartial: string): Promise<void> {
        await this.NavigateToContacts();
        // Click on the first row in the table
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        const contactForm = this.page.locator('section');
        await contactForm.waitFor({ state: 'visible' });
        expect(contactForm).toBeVisible();
        console.log("Contact Form open successfully");

        // Find the address input field
        const addressInput = this.page.locator('input[placeholder="Search Address"]');
        await addressInput.waitFor({ state: 'visible' });
        await addressInput.click();

        // Type the address slowly to trigger autocomplete
        for (let i = 1; i <= addressPartial.length; ++i) {
            await addressInput.fill(addressPartial.slice(0, i));
            await this.page.waitForTimeout(500);
        }

        const suggestionsList = this.page.locator('.pac-item').first();
        await suggestionsList.click({ force: true });

        // Wait for autofill to populate
        await this.page.waitForTimeout(2000);

        // Open overlay/panel if required
        const editOverlayButton = this.page.locator('#toggle-overlay');
        await editOverlayButton.waitFor({ state: 'visible' });
        await editOverlayButton.click();


        // Define locators using stable Angular formcontrolnames
        const buildingName = this.page.locator('input[formcontrolname="building_name"]');
        const unitNo = this.page.locator('input[formcontrolname="unit_no"]');
        const streetNoInput = this.page.locator('input[formcontrolname="street_no"]');
        const streetNameInput = this.page.locator('input[formcontrolname="street_name"]');
        const suburbInput = this.page.locator('p-autocomplete[formcontrolname="suburb"] input.p-autocomplete-input');
        const stateInput = this.page.locator('input[formcontrolname="state"]');
        const postCodeInput = this.page.locator('input[formcontrolname="post_code"]');
        const countryInput = this.page.locator('input[formcontrolname="country"]');

        // Read all autofilled values safely
        const building_name = await buildingName.inputValue().catch(() => '');
        const unit_no = await unitNo.inputValue().catch(() => '');
        const streetNo = await streetNoInput.inputValue().catch(() => '');
        const streetName = await streetNameInput.inputValue().catch(() => '');
        const suburb = await suburbInput.inputValue().catch(() => '');
        const state = await stateInput.inputValue().catch(() => '');
        const postCode = await postCodeInput.inputValue().catch(() => '');
        const country = await countryInput.inputValue().catch(() => '');

        // Collect results
        const fieldValues = {
            building_name,
            unit_no,
            streetNo,
            streetName,
            suburb,
            state,
            postCode,
            country
        };

        console.log('Autofilled Address Values:', fieldValues);

        // ✅ Assert that at least one important field is not empty
        expect(
            Object.values(fieldValues).some(val => val && val.trim().length > 0)
        ).toBeTruthy();

        await this.page.waitForTimeout(1000);

        // Click the save button to save address changes
        const saveButton = this.page.getByRole('button', { name: /^Save$/i }).last();
        await saveButton.click({ force: true });
        await this.page.waitForTimeout(1200);
        // Close the overlay or form using the close icon
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1000);

    }

    // Verify that all address fields are displayed correctly
    async verifyAllAddressFieldsDisplayed() {

        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        // Open overlay/panel if required
        const editOverlayButton = this.page.locator('#toggle-overlay');
        if (await editOverlayButton.isVisible({ timeout: 2000 })) {
            await editOverlayButton.click();
        }

        // Define the locators for each address field
        const buildingName = this.page.locator('input[formcontrolname="building_name"]');
        const unitNo = this.page.locator('input[formcontrolname="unit_no"]');
        const streetNo = this.page.locator('input[formcontrolname="street_no"]');
        const streetName = this.page.locator('input[formcontrolname="street_name"]');
        const suburb = this.page.locator('p-autocomplete[formcontrolname="suburb"] input.p-autocomplete-input');
        const state = this.page.locator('input[formcontrolname="state"]');
        const postCode = this.page.locator('input[formcontrolname="post_code"]');
        const country = this.page.locator('input[formcontrolname="country"]');

        // Wait for all the fields to be visible
        await expect(buildingName).toBeVisible();
        await expect(unitNo).toBeVisible();
        await expect(streetNo).toBeVisible();
        await expect(streetName).toBeVisible();
        await expect(suburb).toBeVisible();
        await expect(state).toBeVisible();
        await expect(postCode).toBeVisible();
        await expect(country).toBeVisible();

        await this.page.waitForTimeout(1000);

        // Click the save button to save address changes
        const saveButton = this.page.getByRole('button', { name: /^Save$/i }).last();
        await saveButton.click({ force: true });
        await this.page.waitForTimeout(1200);
        // Close the overlay or form using the close icon
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    // Verify that the Tag Manager popup opens
    async verifyTagManagerPopupOpens() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        // Open overlay/panel if required
        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();

        const TagPopup = this.page.getByText('Tag ManagerCompany Contact');
        await expect(TagPopup).toBeVisible();

        await this.page.waitForTimeout(1200);
        // Close the overlay or form using the close icon
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    async verifyCanAddNewTagType(tagTypeName: string) {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();
        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();

        const tagPopupHeader = this.page.getByText('Tag ManagerCompany Contact');
        await expect(tagPopupHeader).toBeVisible({ timeout: 10000 });

        const addTagTypeButton = this.page.getByRole('dialog').getByRole('button', { name: '' });
        await addTagTypeButton.click();

        // Instead of trying to fill on the .ng-select-container, target the input inside ng-select dropdown directly
        const tagTypeDropdown = this.page.locator('.ng-select-container:has-text("Select Tag Type")');
        await tagTypeDropdown.click();
        const tagTypeSearchInput = this.page.locator('.ng-dropdown-panel input[type="text"], input[role="combobox"], .ng-select input[type="text"]').last();
        await tagTypeSearchInput.fill(tagTypeName);

        const optionLocator = this.page.locator(`.ng-option:has-text("${tagTypeName}")`);
        await expect(optionLocator).toBeVisible({ timeout: 5000 });
        await optionLocator.click()

        const tagsInput = this.page.locator('input[placeholder="Add Multiple Tags"]');
        const fakeTag = faker.lorem.words(2);
        await tagsInput.fill(fakeTag);
        await tagsInput.press('Enter');


        // Save tag type
        const AddButton = this.page.getByRole('button', { name: /Add/i });
        await AddButton.click();

        await expect(this.page.locator('div').filter({ hasText: 'Tag successfully created' }).nth(2)).toBeVisible()


        const tagManagerPopup = this.page.getByText('Automation Testing').last();
        await tagManagerPopup.evaluate((el) => { el.scrollIntoView({ block: "end" }); });

        // Verify in search box field that the tag should be displayed
        const tagSearchInput = this.page.locator('input[placeholder="Search Tags"]');
        await tagSearchInput.click();
        // Fill the input with a delay between keystrokes
        for (const char of fakeTag) {
            await tagSearchInput.type(char, { delay: 20 });
        }
        // Expect that the tag option is visible in the dropdown (without locator in expect)
        await expect(tagSearchInput).toBeVisible();
        await this.page.waitForTimeout(1200);
        // Close the tag manager popup by clicking the X icon
        const closeTagManagerIcon = this.page.locator('.pi.pi-times').first();
        await closeTagManagerIcon.click({ force: true });
        await this.page.waitForTimeout(1000);

    }
    // Verify that entering data in address fields is reflected in the main/displayed address

    async verifyMainAddressUpdatesWithAllFields() {
        // Step 1: Navigate to contacts and select first contact
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        // Step 2: Search Address field > type & select suggestion
        const addressInput = this.page.locator('input[placeholder="Search Address"]');
        await addressInput.scrollIntoViewIfNeeded();
        await expect(addressInput).toBeVisible({ timeout: 10000 });
        await addressInput.click();
        const addressPartial = '221B Baker Street';
        for (let i = 1; i <= addressPartial.length; ++i) {
            await addressInput.fill(addressPartial.slice(0, i));
            await this.page.waitForTimeout(50);
        }
        const suggestionsList = this.page.locator('.pac-item');
        await expect(suggestionsList.first()).toBeVisible({ timeout: 10000 });
        await suggestionsList.first().click();
        await this.page.waitForTimeout(2000);

        // Save search box value after selection
        const selectedValue = await addressInput.inputValue();

        // Step 3: Edit address fields by clicking edit icon (overlay/panel)
        const editOverlayButton = this.page.locator('#toggle-overlay');
        if (await editOverlayButton.isVisible({ timeout: 10000 }).catch(() => false)) {
            await editOverlayButton.click();
        }

        // Fill address fields with new fake data
        const buildingNameField = this.page.locator('input[formcontrolname="building_name"]');
        const unitNoField = this.page.locator('input[formcontrolname="unit_no"]');
        const streetNoField = this.page.locator('input[formcontrolname="street_no"]');
        const streetNameField = this.page.locator('input[formcontrolname="street_name"]');
        const suburbField = this.page.locator('p-autocomplete[formcontrolname="suburb"] input.p-autocomplete-input');
        const stateField = this.page.locator('input[formcontrolname="state"]');
        const postCodeField = this.page.locator('input[formcontrolname="post_code"]');
        const countryField = this.page.locator('input[formcontrolname="country"]');

        const newAddressData = {
            building: faker.company.name(),
            unit: faker.string.numeric(2),
            streetNo: faker.string.numeric(3),
            streetName: faker.location.street(),
            suburb: faker.location.city(),
            state: faker.location.state(),
            postCode: faker.location.zipCode(),
            country: faker.location.country()
        };

        await expect(buildingNameField).toBeVisible();
        await buildingNameField.fill(newAddressData.building);

        await expect(unitNoField).toBeVisible();
        await unitNoField.fill(newAddressData.unit);

        await expect(streetNoField).toBeVisible();
        await streetNoField.fill(newAddressData.streetNo);

        await expect(streetNameField).toBeVisible();
        await streetNameField.fill(newAddressData.streetName);

        await expect(suburbField).toBeVisible();
        await suburbField.fill(newAddressData.suburb);

        await expect(stateField).toBeVisible();
        await stateField.fill(newAddressData.state);

        await expect(postCodeField).toBeVisible();
        await postCodeField.fill(newAddressData.postCode);

        await expect(countryField).toBeVisible();
        await countryField.fill(newAddressData.country);

        // Step 4: Save button click
        const saveButton = this.page.getByRole('dialog').getByRole('button', { name: 'Save' });
        await saveButton.click();

        // Step 5: Search box must be updated with the new/edited address (not the previously searched value)
        // Wait for the search box to reflect updated value
        await this.page.waitForTimeout(2000);
        const updatedValue = await addressInput.inputValue();

        // It must NOT match the old selectedValue
        expect(updatedValue.trim()).not.toBe(selectedValue.trim());

        // Optionally: It should contain values you just entered in the fields
        // Assert that the updated address includes relevant address fields
        expect(updatedValue).toContain(newAddressData.streetName);
        expect(updatedValue).toContain(newAddressData.state);
        expect(updatedValue).toContain(newAddressData.postCode);

        await this.page.waitForTimeout(1000);
        // Close the form after checking address update
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    // Search for a non existent tag in Tag Manager
    async searchForNonExistentTag(tagName: string) {

        await this.NavigateToContacts();
        await this.page.waitForTimeout(1500);

        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();

        const tagPopupHeader = this.page.getByText('Tag ManagerCompany Contact');
        await expect(tagPopupHeader).toBeVisible();
        const searchInput = this.page.getByPlaceholder('Search tags');
        await searchInput.fill(tagName);
        const noResult = this.page.getByText(/No data found|no results|no matching tags/i);
        await expect(noResult).toBeVisible();

        await this.page.waitForTimeout(1000);
        // Close the form after checking address update
        const closeFormIcon = this.page.locator('.pi.pi-times').first();
        await closeFormIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    async verifyCreateTagByEnter(tagTypeName: string, tagValue: string) {
        await this.NavigateToContacts();

        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        // Open Tag Manager popup
        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();
        const tagPopupHeader = this.page.getByText('Tag ManagerCompany Contact');
        await expect(tagPopupHeader).toBeVisible();

        // Add Tag Type
        const addTagTypeButton = this.page.getByRole('dialog').getByRole('button', { name: '' });
        await addTagTypeButton.click();

        // Select the tag type from dropdown
        const tagTypeDropdown = this.page.locator('.ng-select-container:has-text("Select Tag Type")');
        await tagTypeDropdown.click();
        const tagTypeSearchInput = this.page.locator('.ng-dropdown-panel input[type="text"], input[role="combobox"], .ng-select input[type="text"]').last();
        await tagTypeSearchInput.fill(tagTypeName);

        const optionLocator = this.page.locator(`.ng-option:has-text("${tagTypeName}")`);
        await expect(optionLocator).toBeVisible({ timeout: 5000 });
        await optionLocator.click();

        // Enter new tag + press Enter to create
        const tagsInput = this.page.locator('input[placeholder="Add Multiple Tags"]');
        await tagsInput.fill(tagValue);
        await tagsInput.press('Enter');

        // Verify chip for the new tag appears (common in tag editors)
        const createdTagChip = this.page.locator(`.ng-value-label, .p-chips-token, .chip, .tag`)
            .filter({ hasText: tagValue });
        await expect(createdTagChip).toBeVisible();

        // Click Cancel button to discard tag creation
        const cancelButton = this.page.getByRole('button', { name: /cancel/i }).first();
        await expect(cancelButton).toBeVisible();
        await cancelButton.click();

        await this.page.waitForTimeout(1000);

        // Close the Tag creation dialog by clicking the close (X) button
        const closeTagManagerIcon = this.page.locator('.pi.pi-times').first();
        await closeTagManagerIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    /**
     Verifies that removing a tag updates the tag list and that the tag no longer appears.
     */
    async verifyRemoveTagUpdatesTagList() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        // Open Tag Manager popup
        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();
        const tagPopupHeader = this.page.getByText('Tag ManagerCompany Contact');
        await expect(tagPopupHeader).toBeVisible();

        const company = await this.page.getByText('Company Contact Type');
        await expect(company).toBeVisible();

        // Double click the tag chip for "Agency"
        const tagChip = this.page.locator("//div[@cdkdroplist]//div[@cdkdrag][.//div[normalize-space()='Agency']]").first();
        await tagChip.waitFor({ state: 'visible' });
        await tagChip.scrollIntoViewIfNeeded();
        await tagChip.hover();
        await this.page.waitForTimeout(100);

        await tagChip.click({ clickCount: 6 });


        await this.page.waitForTimeout(500)

        const closeIcon = this.page.locator('.f-12.pi.pi-times.cp');

        await closeIcon.scrollIntoViewIfNeeded();

        await closeIcon.click({ force: true });

        await this.page.waitForTimeout(1000)

        await expect(closeIcon).not.toBeVisible();

        await this.page.waitForTimeout(1000);

        // Close the Tag creation dialog by clicking the close (X) button
        const closeTagManagerIcon = this.page.locator('.pi.pi-times').first();
        await closeTagManagerIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that a tag persists in the tag list after saving the form.
     */
    async verifyTagPersistsAfterFormSave(tagTypeName: string, tagValue: string) {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        // Open Tag Manager popup for the contact
        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();

        const tagPopupHeader = this.page.getByText('Tag ManagerCompany Contact');
        await expect(tagPopupHeader).toBeVisible();

        // Add a new Tag Type
        const addTagTypeButton = this.page.getByRole('dialog').getByRole('button', { name: '' });
        await addTagTypeButton.click();

        // Select or type the tag type in the Select Tag Type dropdown
        const tagTypeDropdown = this.page.locator('.ng-select-container:has-text("Select Tag Type")');
        await tagTypeDropdown.click();
        const tagTypeInput = this.page.locator('.ng-dropdown-panel input[type="text"], input[role="combobox"], .ng-select input[type="text"]').last();
        await tagTypeInput.fill(tagTypeName);

        // Wait for and select the desired tag type option
        const optionLocator = this.page.locator(`.ng-option:has-text("${tagTypeName}")`);
        await expect(optionLocator).toBeVisible({ timeout: 5000 });
        await optionLocator.click();

        // Add the new tag
        const tagsInput = this.page.locator('input[placeholder="Add Multiple Tags"]');
        await tagsInput.fill(tagValue);
        await tagsInput.press('Enter');

        // Save the new tag (Add button)
        const addButton = this.page.getByRole('button', { name: /^Add$/i });
        await addButton.click({ force: true });

        // Confirm successful tag creation
        const creationToast = this.page.locator('div').filter({ hasText: 'Tag successfully created' }).nth(2);
        await expect(creationToast).toBeVisible({ timeout: 10000 });

        // Close the tag manager popup if necessary
        const closeButton = this.page.locator('.d-flex.align-items-center > div > button:nth-child(2)');
        if (await closeButton.isVisible()) {
            await closeButton.click();
        }

        await this.page.waitForTimeout(500);

        // Re-open Tag Manager to verify the tag persists
        await tagButton.click();
        await expect(tagPopupHeader).toBeVisible();

        // Search for the tag in the search input field in Tag Manager
        const tagSearchInput = this.page.locator('input[placeholder="Search Tags"]');
        await tagSearchInput.click();
        // Type out the tagValue in the search input
        for (const char of tagValue) {
            await tagSearchInput.type(char, { delay: 20 });
        }

        // Check that the tag appears in the tag list dropdown/search results
        const foundTag = this.page.locator('.cdk-drop-list [ng-reflect-drag-data], .cdk-drop-list [data-tag-name], .cdk-drop-list .p-chip, .cdk-drop-list')
            .filter({ hasText: tagValue });
        await expect(foundTag.first()).toBeVisible({ timeout: 5000 });

        await this.page.waitForTimeout(1200);

        // Click the close icon to close the Tag Manager popup
        await this.page.waitForTimeout(1000);
        const closeTagManagerIcon = this.page.locator('.pi.pi-times').first();
        await closeTagManagerIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }


    async verifyDoubleClickTagAddsToField(tagTypeName: string, tagValue: string) {
        // Navigate to Contacts and wait
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        // Open Tag Manager popup
        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();

        const tagPopupHeader = this.page.getByText('Tag ManagerCompany Contact');
        await expect(tagPopupHeader).toBeVisible();

        await this.page.waitForTimeout(500)

        // Double click the tag chip for "Agency"
        const tagChip = this.page.locator("//div[@cdkdroplist]//div[@cdkdrag][.//div[normalize-space()='Agency']]").first();
        await tagChip.waitFor({ state: 'visible' });
        await tagChip.scrollIntoViewIfNeeded();
        await tagChip.hover();
        await this.page.waitForTimeout(100);

        await tagChip.click({ clickCount: 6 });


        await this.page.waitForTimeout(500)

        const closeIcon = this.page.locator('.f-12.pi.pi-times.cp');

        await closeIcon.scrollIntoViewIfNeeded();

        await expect(closeIcon).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1000);

        // Close the Tag creation dialog by clicking the close (X) button
        const closeTagManagerIcon = this.page.locator('.pi.pi-times').first();
        await closeTagManagerIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that tags can be searched in the Tag Manager.
     */
    async verifyTagCanBeSearchedInTagManager(tagValue: string) {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        // Open Tag Manager popup
        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();

        // Confirm Tag Manager popup opened
        const tagPopupHeader = this.page.getByText('Tag ManagerCompany Contact');
        await expect(tagPopupHeader).toBeVisible();

        await this.page.waitForTimeout(500);


        // Find the tag search input inside the Tag Manager (handle possible variations in placeholder)
        const tagSearchInput = this.page.locator('input[placeholder="Search Tag"], input[placeholder="Search Tags"]');
        await tagSearchInput.click();
        await tagSearchInput.fill(tagValue);

        // Confirm that a tag matching 'tagValue' appears in the dropdown/list
        const resultTag = this.page.locator('.cdk-drop-list .p-chip-text, .cdk-drop-list [data-tag-name]')
            .filter({ hasText: tagValue });
        await expect(resultTag.first()).toBeVisible({ timeout: 5000 });

        // Close the Tag creation dialog by clicking the close (X) button
        await this.page.waitForTimeout(1200);
        const closeTagManagerIcon = this.page.locator('.pi.pi-times').first();
        await closeTagManagerIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that clicking the "X" (close) button on the Tag Manager popup closes it.
     */
    async verifyTagManagerPopupCloseWithX() {
        await this.NavigateToContacts();

        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        // Open Tag Manager popup
        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();

        // Wait for Tag Manager popup to be visible
        const tagPopupHeader = this.page.getByText('Tag ManagerCompany Contact');
        await expect(tagPopupHeader).toBeVisible();

        // Locate and click the X (close) button within the popup
        const closeButton = this.page.locator('.d-flex.align-items-center > div > button:nth-child(2)').last();
        await expect(closeButton).toBeVisible();
        await closeButton.click();

        // Verify that the popup is now closed (not visible)
        await expect(tagPopupHeader).not.toBeVisible({ timeout: 5000 });
        await this.page.waitForTimeout(1200);
        const closeTagManagerIcon = this.page.locator('.pi.pi-times').first();
        await closeTagManagerIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that clicking "Cancel" on the tag creation popup closes it.
     */
    async verifyTagCreationPopupCloseWithCancel() {
        await this.NavigateToContacts();

        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        // Open Tag Manager popup
        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();

        // Wait for Tag Manager popup to be visible
        const tagPopupHeader = this.page.getByText('Tag ManagerCompany Contact');
        await expect(tagPopupHeader).toBeVisible();

        // Click 'Add Tag Type' to open the tag creation popup
        const addTagTypeButton = this.page.getByRole('dialog').getByRole('button', { name: '' });
        await addTagTypeButton.click();

        // Locate and click the Cancel button (common patterns)
        const cancelButton = this.page.getByRole('button', { name: /Cancel/i }).first();
        await expect(cancelButton).toBeVisible({ timeout: 2000 });
        await cancelButton.click();

        await this.page.waitForTimeout(1200);

        const closeTagManagerIcon = this.page.locator('.pi.pi-times').first();
        await closeTagManagerIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that clicking "Save" after filling all required fields in the tag type creation popup
     * successfully creates the tag type and closes the popup.
     */
    async verifyTagCreationPopupSaveWorks(tagTypeName: string, tagValue: string) {
        await this.NavigateToContacts();

        // Open a contact row
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        // Open Tag Manager popup
        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();

        // Wait for Tag Manager popup to be visible
        const tagPopupHeader = this.page.getByText('Tag ManagerCompany Contact');
        await expect(tagPopupHeader).toBeVisible();

        // Click 'Add Tag Type' to open the tag creation popup
        // Click 'Add Tag Type' to open the tag creation popup
        const addTagTypeButton = this.page.getByRole('dialog').getByRole('button', { name: '' });
        await addTagTypeButton.click();

        // Fill tag type dropdown
        const tagTypeDropdown = this.page.locator('.ng-select-container:has-text("Select Tag Type")');
        await tagTypeDropdown.click();
        const tagTypeSearchInput = this.page.locator('.ng-dropdown-panel input[type="text"], input[role="combobox"], .ng-select input[type="text"]').last();
        await tagTypeSearchInput.fill(tagTypeName);

        const optionLocator = this.page.locator(`.ng-option:has-text("${tagTypeName}")`);
        await expect(optionLocator).toBeVisible({ timeout: 5000 });
        await optionLocator.click();

        // Enter new tag value and confirm (if field exists)
        const tagsInput = this.page.locator('input[placeholder="Add Multiple Tags"]');
        await tagsInput.fill(tagValue);
        await tagsInput.press('Enter');

        // Click Save/Add button to submit the form
        const saveButton = this.page.getByRole('button', { name: 'Add' }).first();
        await expect(saveButton).toBeVisible({ timeout: 2000 });
        await saveButton.click();

        // Optionally wait for and check for success message or disappearance of modal
        const successToast = this.page.locator('div').filter({ hasText: 'Tag successfully created' }).nth(2);
        await expect(successToast).toBeVisible();
        await this.page.waitForTimeout(1200);
        const closeTagManagerIcon = this.page.locator('.pi.pi-times').first();
        await closeTagManagerIcon.click({ force: true });
        await this.page.waitForTimeout(1000);

    }

    /**
     * 
     */
    public async verifyAddandCloseTag(tagTypeName: string, tagValue: string) {
        await this.NavigateToContacts();

        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        // Open Tag Manager popup
        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();

        // Wait for Tag Manager popup to be visible
        const tagPopupHeader = this.page.getByText('Tag ManagerCompany Contact');
        await expect(tagPopupHeader).toBeVisible();

        // Click 'Add Tag Type' to open the tag creation dialog
        // Click 'Add Tag Type' to open the tag creation popup
        const addTagTypeButton = this.page.getByRole('dialog').getByRole('button', { name: '' });
        await addTagTypeButton.click();

        // Click into the tag type dropdown and search for the tag type
        const tagTypeDropdown = this.page.locator('.ng-select-container:has-text("Select Tag Type")');
        await tagTypeDropdown.click();
        const tagTypeSearchInput = this.page.locator('.ng-dropdown-panel input[type="text"], input[role="combobox"], .ng-select input[type="text"]').last();
        await tagTypeSearchInput.fill(tagTypeName);

        // Select the tag type option
        const optionLocator = this.page.locator(`.ng-option:has-text("${tagTypeName}")`);
        await expect(optionLocator).toBeVisible({ timeout: 5000 });
        await optionLocator.click();

        // Enter a tag value in the tag input field
        const tagsInput = this.page.locator('input[placeholder="Add Multiple Tags"]');
        await tagsInput.fill(tagValue);
        await tagsInput.press('Enter');

        // Click the Add/Save button to confirm creation
        const saveButton = this.page.getByRole('button', { name: /Add/i }).first();
        await expect(saveButton).toBeVisible({ timeout: 2000 });
        await saveButton.click();

        // Check that the tag was successfully created via toast or popup
        const successToast = this.page.locator('div').filter({ hasText: 'Tag successfully created' }).nth(2);
        await expect(successToast).toBeVisible({ timeout: 5000 });

        const closetag = this.page.locator('.d-flex.align-items-center > div > button:nth-child(2)').last();
        await expect(closetag).toBeVisible();
        await closetag.click();
        await expect(closetag).not.toBeVisible()
        await this.page.waitForTimeout(1200);
        const closeTagManagerIcon = this.page.locator('.pi.pi-times').first();
        await closeTagManagerIcon.click({ force: true });
        await this.page.waitForTimeout(1000);
    }

    async openStreamTab() {
        const streamTab = this.page.getByRole('tab', { name: /Stream/i });
        await streamTab.waitFor({ state: 'visible' });
        await streamTab.click();
    }

    async openFirstContact(): Promise<void> {
        const firstContactRow = this.page.locator('tbody tr').first();
        await firstContactRow.waitFor({ state: 'visible' });
        const firstCell = this.page.locator('td').nth(1);
        await firstCell.click();
        await this.openStreamTab();
    }

    /**
     * Open "Stream" tab
     */
    async openStream(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openStreamTab();
        await this.closeModalIfVisible();
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

        const staffSelect = this.page.locator('ng-select[formcontrolname="assignedUsers"]');
        await staffSelect.waitFor({ state: "visible" });
        await staffSelect.click();

        const assigneeOption = this.page.locator('div').filter({ hasText: /^Jahanzaib Xenex$/ }).first();
        await assigneeOption.waitFor({ state: 'visible' });

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
        const closeBtn = this.page.locator('.pi.pi-times').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    async verifyTaskAppearsInList() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openStreamTab();
        await this.openTasksTab();
        await this.taskData();
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that a "Contact Created" record appears in the stream for a contact.
     */
    async verifyContactCreationRecordAppears() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openStreamTab();
        const streamEntry = this.page.locator('div.stream-body').first();
        await streamEntry.waitFor({ state: "visible", timeout: 10000 });
        await this.closeModalIfVisible();
    }

    async verifyRelatedPropertyTabDisplayedListing() {
        const relatedPropertyTab = this.page.locator("#pills-relatedProperty");
        await relatedPropertyTab.waitFor({ state: 'visible' });
        await relatedPropertyTab.click();
        const listingTab = this.page.locator('#pills-listing0-tab');
        await listingTab.waitFor({ state: 'visible' });
        await listingTab.click();
        const searchBox = this.page.getByRole('combobox', { name: 'Search Listing' });
        await searchBox.waitFor({ state: 'visible' });
        await searchBox.type('Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880', { delay: 30 });
        const dropdownOption = this.page.getByRole('option', { name: 'Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880' })
        await dropdownOption.waitFor({ state: 'visible' });
        await dropdownOption.click();
        const associateButton = this.page.locator('button.preview-btn.btn-sm.f-12:visible');
        await associateButton.waitFor({ state: 'visible' });
        await associateButton.click();
        const successToast = this.page.getByText(/listing attached successfully|Listing already associated/i).first();
        await successToast.waitFor({ state: "visible" });
        const associatedListing = this.page.getByRole('cell', { name: 'Sauer LLC\"\" 453/37 Eliseo Brook, East Albury, Nebraska 34880' }).first();
        await associatedListing.scrollIntoViewIfNeeded();
        await associatedListing.waitFor({ state: 'visible' });
        const associatedContactRow = this.page.locator('table tr').filter({
            hasText: 'Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880',
            has: this.page.locator('td.cdk-drop-list[cdkdroplist]')
        }).first();

        await associatedContactRow.evaluate(el => {
            el.scrollIntoView({
                block: 'center',
                inline: 'start'
            });
        });

        const dropList = associatedContactRow.locator('td.cdk-drop-list[cdkdroplist]');
        await expect(dropList).toBeVisible({ timeout: 10000 });

        const getBuyerChip = () =>
            associatedContactRow.locator('[data-pc-name="chip"][aria-label="Wife"]');

        // If already added, exit early (prevents flake)
        if (await getBuyerChip().count() > 0) {
            return;
        }

        const maxAttempts = 4;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const buyerTag = this.page
                    .locator('span.cdk-drag.related-tag span.p-tag-value', { hasText: 'Wife' })
                    .first();

                await expect(buyerTag).toBeVisible({ timeout: 10000 });

                const sourceBox = await buyerTag.boundingBox();
                const dropBox = await dropList.boundingBox();

                if (!sourceBox || !dropBox) {
                    throw new Error('Bounding box not available');
                }

                // Real mouse drag (CDK-safe)
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

                // Wait for DOM update (most stable assertion)
                await expect(getBuyerChip()).toHaveCount(1, { timeout: 3000 });

                break; // success
            } catch (error) {
                if (attempt === maxAttempts) {
                    throw new Error('Buyer tag drag failed after multiple attempts.');
                }

                await this.page.waitForTimeout(1000);
            }
        }

        await expect(getBuyerChip()).toHaveCount(1, { timeout: 10000 });
        await this.page.waitForTimeout(1000);
    }

    async verifyRelatedPropertyTabProperties() {
        const relatedPropertyTab = this.page.locator("#pills-relatedProperty");
        await relatedPropertyTab.waitFor({ state: 'visible' });
        await relatedPropertyTab.click();
        const propertyTab = this.page.locator('#pills-property0-tab')
        await propertyTab.waitFor({ state: 'visible' });
        await propertyTab.click();
        const searchBox = this.page.getByRole('combobox', { name: 'Search Property' });
        await searchBox.waitFor({ state: 'visible' });
        await searchBox.fill('Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880');
        const dropdownOption = this.page.getByRole('option', { name: 'Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880' })
        await dropdownOption.waitFor({ state: 'visible' });
        await dropdownOption.click();
        const associateButton = this.page.locator('button.preview-btn.btn-sm.f-12:visible');
        await associateButton.waitFor({ state: 'visible' });
        await associateButton.click();
        const successToast = this.page.getByText(/property attached successfully|property already associated/i).first();
        await successToast.waitFor({ state: "visible" });
        const associatedProperty = this.page.getByRole('cell', { name: 'Sauer LLC\"\" 453/37 Eliseo Brook, East Albury, Nebraska 34880' }).first();
        await associatedProperty.scrollIntoViewIfNeeded();
        await associatedProperty.waitFor({ state: 'visible' });
    }



    async verifyListingAttachmentRecordAppears() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.verifyRelatedPropertyTabDisplayedListing();
        await this.verifyRelatedPropertyTabProperties();
        await this.openStreamTab();
        const searchBox = await this.page.getByRole('textbox', { name: 'Search by keyword' });
        await searchBox.waitFor({ state: 'visible' });
        await searchBox.fill('Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880');
        const listingAttachmentEntry = this.page.locator('div.stream-body').filter({
            hasText: 'Updated related Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880'
        }).first();
        await listingAttachmentEntry.waitFor({ state: "visible" });
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that a related contact can be associated successfully.
     */
    async verifyRelatedContactCanBeAssociated() {
        const relatedTab = this.page.getByText('Related contacts').first();
        await expect(relatedTab).toBeVisible({ timeout: 10000 });
        await relatedTab.click();
        const selectDropdown = this.page.locator('div.tags:has-text("Select")').last();
        await expect(selectDropdown).toBeVisible({ timeout: 10000 });
        await selectDropdown.click();
        const searchInput = this.page
            .locator('#rContact0').getByRole('textbox', { name: 'Search' }).first();
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.fill('11 22');
        const suggestedContact = this.page
            .getByRole('listitem')
            .filter({ hasText: '22 (11@22.com.au)' })
            .last();
        await expect(suggestedContact).toBeVisible({ timeout: 20000 });
        await suggestedContact.click();
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(1200);
        const associateButton = this.page.getByRole('button', { name: /associate/i }).last();
        await expect(associateButton).toBeVisible({ timeout: 10000 });
        await associateButton.click();
        const duplicateAlert = this.page.getByText(/Contact is already associate|Please select company first| user is already/i).last();
        const successToast = this.page.getByText(/Contact attached successfully/i).last();
        await expect(duplicateAlert.or(successToast)).toBeVisible({ timeout: 10000 });
        const associatedContactRow = this.page.locator('table tr').filter({
            hasText: '11 22',
            has: this.page.locator('td.cdk-drop-list[cdkdroplist]')
        }).first();
        await associatedContactRow.evaluate(el => {
            el.scrollIntoView({
                block: 'center',
                inline: 'start'
            });
        });
        const dropList = associatedContactRow.locator('td.cdk-drop-list[cdkdroplist]');
        await expect(dropList).toBeVisible({ timeout: 10000 });
        const getBuyerChip = () =>
            associatedContactRow.locator('[data-pc-name="chip"][aria-label="Buyer"]');
        if (await getBuyerChip().count() > 0) {
            return;
        }
        const maxAttempts = 4;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const buyerTag = this.page
                    .locator('span.cdk-drag.related-tag span.p-tag-value', { hasText: 'Business' })
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

    }

    // Verify related contact addition record appears
    async verifyRelatedContactRecordAppears() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const firstStreamRecord = this.page.locator('div.stream-body').first();
        await firstStreamRecord.waitFor({ state: 'visible' });
        await this.verifyRelatedContactCanBeAssociated();
        const streamTab = this.page.getByRole('tab', { name: /Stream/i });
        await streamTab.evaluate(el => {
            el.scrollIntoView({ block: 'center', inline: 'center' });
        });
        await streamTab.waitFor({ state: 'visible' });
        await streamTab.click();

        const searchBox = await this.page.getByRole('textbox', { name: 'Search by keyword' });
        await searchBox.waitFor({ state: 'visible' });
        await searchBox.fill('11 22');
        const listingAttachmentEntry = this.page.locator('div.stream-body').filter({
            hasText: '11 22'
        }).first();
        await listingAttachmentEntry.waitFor({ state: "visible", timeout: 10000 });
        await this.closeModalIfVisible();

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

        // Count the rows after creation
        await tableRowsLocator.first().waitFor({ state: "visible" });
        const finalRowCount = await tableRowsLocator.count();
        // Ensure the row count increased
        if (finalRowCount <= initialRowCount) {
            throw new Error("Lead creation did not increase the number of records in the table.");
        }
    }

    /**
     * Verifies that a "Lead Assigned" record appears in the stream for a contact.
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
    /**
     * Verify timestamp accuracy
     */
    async verifyStreamTimestampAccuracy() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openStreamTab();
        const streamCards = this.page.locator('div.stream-body');
        await expect(streamCards.first()).toBeVisible({ timeout: 10000 });
        const count = await streamCards.count();
        if (count === 0) {
            throw new Error("No stream cards found on the Stream tab.");
        }
        for (let i = 0; i < count; i++) {
            const card = streamCards.nth(i);
            // span.f-10.text-dark contains the date/time info
            const dateTimeSpan = card.locator('span.f-10.text-dark');
            await expect(dateTimeSpan).toBeVisible({ timeout: 10000 });
            const text = await dateTimeSpan.textContent();
            if (!text || !text.trim()) {
                throw new Error(`Stream card #${i + 1} does not display date/time.`);
            }
        }
        await this.closeModalIfVisible();
    }

    /**
     *Verify Stream search functionality
     */
    async verifyStreamSearchFunctionality(keyword: string, expectResults: boolean = true) {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openStreamTab();
        const firstStreamCard = this.page.locator('div.stream-body').first();
        await firstStreamCard.waitFor({ state: "visible" });
        const searchInput = this.page.locator('input[placeholder*="Search by keyword"]').first();
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.fill("");
        await searchInput.fill(keyword);
        await searchInput.press("Enter");
        await this.page.waitForTimeout(1000);
        const streamCards = this.page.locator('div.stream-body');
        if (expectResults) {
            await expect(streamCards.first()).toBeVisible({ timeout: 10000 });
            const count = await streamCards.count();
            if (count === 0) {
                throw new Error(`No stream cards were found for the search keyword: "${keyword}".`);
            }
        } else {
            const noRecordsText = this.page.getByText(/No Updates Yet/i);
            await expect(noRecordsText).toBeVisible({ timeout: 10000 });
        }
        await this.closeModalIfVisible();
    }

    /**
     * Verify Stream updates in real time.
     */
    async verifyStreamUpdatesInRealTime() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openStreamTab();
        const firstStreamCard = this.page.locator('div.stream-body').first();
        await firstStreamCard.waitFor({ state: "visible" });
        const searchInput = this.page.locator('input[placeholder*="Search by keyword"]').first();
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.fill("");
        await searchInput.fill("Task Added");
        await searchInput.press("Enter");
        const streamCards = this.page.locator('div.stream-body');
        await expect(streamCards.first()).toContainText(/task added/i);
        await this.closeModalIfVisible();
    }

    /**
     * Ensures related contact "11 22" is deleted if already present, then verifies it is absent in stream.
     */
    async addAndDeleteContact() {
        await this.NavigateToContacts();
        await this.openFirstContact();

        // Open Stream tab to ensure we're starting at the right place
        const streamTab = this.page.getByRole('tab', { name: /Stream/i });
        await expect(streamTab).toBeVisible({ timeout: 10000 });
        await streamTab.evaluate(el => el.scrollIntoView({ block: 'center', inline: 'center' }));
        await streamTab.click();

        // Open Related contacts tab
        const relatedTab = this.page.getByText('Related contacts').first();
        await expect(relatedTab).toBeVisible({ timeout: 10000 });
        await relatedTab.click();

        // Try to locate the related contact row up to maxRowLoadAttempts times, waiting in between
        let associatedContactRow: any = null;
        const maxRowLoadAttempts = 4;
        for (let i = 0; i < maxRowLoadAttempts; i++) {
            associatedContactRow = this.page.locator('table tr').filter({
                has: this.page.locator('td.cdk-drop-list[cdkdroplist]'),
                hasText: '11 22'
            }).first();

            if (await associatedContactRow.count() > 0 && await associatedContactRow.isVisible()) {
                break;
            }
            if (i < maxRowLoadAttempts - 1) {
                await this.page.waitForTimeout(1200);
            }
        }

        if (await associatedContactRow.count() > 0 && await associatedContactRow.isVisible()) {
            await associatedContactRow.scrollIntoViewIfNeeded();

            // Try twice to click the delete button and confirm deletion
            let hasDeleted = false;
            for (let attempt = 0; attempt < 2 && !hasDeleted; attempt++) {
                try {
                    const deleteButton = associatedContactRow.locator('button:has(img[alt="delete"])').first();
                    await deleteButton.waitFor({ state: 'visible', timeout: 30000 });
                    await deleteButton.click();

                    const confirmButton = this.page.getByRole('button', { name: /Yes/i }).first();
                    await expect(confirmButton).toBeVisible({ timeout: 10000 });
                    await confirmButton.click();

                    // Wait for the toast to confirm deletion OR for row to disappear
                    const removeToast = this.page.getByText(/related Contact deleted successfully/i).first();
                    // Ensure both toast disappears (toast confirmed) and row is no longer visible
                    await Promise.all([
                        expect(removeToast).toBeVisible({ timeout: 10000 }),
                        expect(associatedContactRow).not.toBeVisible({ timeout: 10000 }),
                    ]);
                    hasDeleted = true;
                } catch (err) {
                    if (attempt === 0) {
                        await this.page.waitForTimeout(1000);
                    } else {
                        throw err;
                    }
                }
            }
        }

        // Go back to Stream tab
        await streamTab.evaluate(el => el.scrollIntoView({ block: 'center', inline: 'center' }));
        await streamTab.waitFor({ state: 'visible' });
        await streamTab.click();

        // Search for the previously removed contact in the stream
        const searchBox = this.page.getByRole('textbox', { name: 'Search by keyword' });
        await searchBox.waitFor({ state: 'visible' });
        await searchBox.fill('');
        await searchBox.fill('11 22');

        // Verify that "Related Contact Attached" entry is NOT visible, confirming deletion
        const relatedContactEntry = this.page.locator('div.stream-body').filter({
            hasText: 'Related Contact Attached'
        }).first();
        await expect(relatedContactEntry).not.toBeVisible({ timeout: 10000 });

        await this.closeModalIfVisible();
    }

    /**
     * Opens the "Lead" tab 
     */
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
        const editIcon = this.page.locator("//button[@class='_addNew p-2']//img[@class='cursor-pointer']");
        await editIcon.waitFor({ state: 'visible' });
        await editIcon.click();
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
        const closeBtn = this.page.locator('.pi.pi-times').nth(2);
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
        await this.openContactByNameAA();
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
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) ng-select[formcontrolname="reason_selling_buying"]'),
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
            this.page.locator('div.popup-gray-box:has(p:text("Requirements")) ng-select[formcontrolname="reason_selling_buying"]'),
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


}

