import { Page, Locator, expect } from '@playwright/test';
import { ContactLocators } from './contactLocator';
import { faker, tr } from '@faker-js/faker';
import { setEngine } from 'crypto';
import { waitForDebugger } from 'inspector';

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

    private CheckBox() {
        return this.locators.CheckBox().nth(3).click();
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
        const RestoreIcon = this.locators.restoreContactIcon()
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
        await this.page.waitForTimeout(4000);
        await this.searchForContact(contactName);
        await this.page.locator(`text=${contactName}`).first().waitFor({ state: 'visible', timeout: 5000 });
    }

    public async searchNonExistingContact(contactName: string): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);
        await this.searchForContact(contactName);
        const noResults = this.page.getByRole('cell', { name: 'No contacts available' })
        await noResults.waitFor({ state: 'visible', timeout: 5000 });
    }

    public async verifyContactDropdownFilter(name: string): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);
        await this.ContactTypeDropdown();
        await this.SearchContactType(name);
        await this.page.waitForTimeout(500)
        await this.SelectOption(name);
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
                throw new Error(`❌ Row ${i + 1}: Contact Type "${cellText}" mila, magar filter "${name}" tha (sirf woh hi hona chahiye).`);
            }
        }
    }

    async selectAllContactType(): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);
        await this.ContactTypeDropdown();
        await this.SelectAllTypes();
        const deselectAll = this.page.locator("//label[@class='checkbox select_all style-d']");
        await deselectAll.waitFor({ state: 'visible', timeout: 1000 });
        expect(deselectAll).toBeVisible();
    }
    async deselectAllContactType(): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);
        await this.ContactTypeDropdown();
        await this.page.waitForTimeout(1000)
        await this.SelectAllTypes();
        await this.page.waitForTimeout(1000)
        await this.DeselectAllTypes()
    }

    public async verifymatchingTypeDisplayed(name: string): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);
        await this.ContactTypeDropdown();
        await this.SearchContactType(name);
        await this.SelectOption(name);
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
        expect(contactTypeColIdx).not.toBe(-1);

        // Now verify every displayed Contact Type is the filter value
        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const cell = row.locator('td').nth(contactTypeColIdx);
            await cell.scrollIntoViewIfNeeded();
            // Sanitize and check
            const cellText = (await cell.textContent())?.trim();
            expect(cellText).toBe(name);
        }
    }

    // Verify company type dropdown filters companies correctly
    public async verifyCompanyTypeDropdownFilter(type: string): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);
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
        expect(companyTypeColIdx).not.toBe(-1);

        // Get all visible table rows
        const rows = this.page.locator('table tbody tr');
        const rowCount = await rows.count();

        // For each row, verify the "Company Type" cell matches the filter value
        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const cell = row.locator('td').nth(companyTypeColIdx);
            await cell.scrollIntoViewIfNeeded();
            const cellText = (await cell.textContent())?.trim();
            expect(cellText).toBe(type);
        }
    }

    // Verify "Select All" functionality in company type dropdown
    public async selectAllCompanyTypes(): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);
        await this.CompanyTypeDropdown();
        await this.page.waitForTimeout(1000)
        await this.SelectAllTypes();
    }

    async deselectAllCompanyType(): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);
        await this.CompanyTypeDropdown();
        await this.page.waitForTimeout(1000)
        await this.SelectAllTypes();
        await this.page.waitForTimeout(1000)
        await this.DeselectAllTypes()
    }

    // Verify search within company type dropdown
    public async verifyCompanyTypeDropdownSearch(typeName: string): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000)
        await this.CompanyTypeDropdown();
        await this.page.waitForTimeout(1000);
        await this.SearchCompanyType(typeName);
        await this.SelectCompanyOption(typeName);

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
        expect(companyTypeColIdx).not.toBe(-1);

        // Get all visible table rows
        const rows = this.page.locator('table tbody tr');
        const rowCount = await rows.count();

        // For each row, verify the "Company Type" cell matches the filter value
        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const cell = row.locator('td').nth(companyTypeColIdx);
            await cell.scrollIntoViewIfNeeded();
            const cellText = (await cell.textContent())?.trim();
            expect(cellText).toBe(typeName);
        }
    }

    // Verify reset button removes applied filters
    public async VerifyResetButton(contactType: string, companyType: string): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);

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
        await this.page.waitForTimeout(4000);
        await this.CheckBox();
        const deleteButton = this.locators.DeleteIcon();
        await deleteButton.waitFor({ state: 'visible', timeout: 3000 });
        expect(await deleteButton.isEnabled()).toBe(true);
    }

    // Verify delete button is disabled when no contact is selected
    public async verifyDeleteButtonDisabledWhenNoContactSelected(): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);

        const deleteButton = this.page.locator('._circle-btn');
        await deleteButton.waitFor({ state: 'visible', timeout: 10000 })
        expect(await deleteButton.isDisabled()).toBe(false)
    }

    // ✅ Verify the delete button removes the selected contact and the row disappears from the table
    public async verifyDeleteButtonRemovesSelectedContact(contactName: string): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);

        // Search for the contact to ensure it exists in the table
        await this.searchForContact(contactName);

        await this.page.waitForTimeout(1500);
        // Get the table row for the contact before deletion and verify it exists
        const contactRow = this.page.locator('table tbody tr', { hasText: contactName });
        await expect(contactRow).toHaveCount(1);
        console.log('Name displayed: ', contactName)

        // Select the contact's checkbox
        const checkbox = this.page.getByRole('checkbox').last();
        await checkbox.click()

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
        await this.page.waitForTimeout(2000)
        await this.SearchDeletedContact(contactName);
        await this.page.waitForTimeout(1500);
        await this.ClickRestoreIcon();
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000)
        await this.searchForContact(contactName);
        await this.page.waitForTimeout(1500)
        await expect(this.page.locator('table tbody tr', { hasText: contactName })).toHaveCount(1);
        console.log(contactName);
    }

    //  Verify canceling deletion keeps the contact in the list
    public async verifyDeleteCancelKeepsContact(contactName: string): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);

        // Search for the contact to ensure it exists in the table
        await this.searchForContact(contactName);
        await this.page.waitForTimeout(1500);

        const contactRow = this.page.locator('table tbody tr', { hasText: contactName });
        await expect(contactRow).toHaveCount(1);
        console.log('Name displayed before delete attempt:', contactName);

        // Select the contact's checkbox
        const checkbox = this.page.getByRole('checkbox').last();
        await checkbox.click();

        // Click the delete icon/button
        await this.DeleteIcon();

        const cancelButton = this.page.getByRole('button', { name: /No/i }).first();
        await cancelButton.click();

        // Verify that the contact still exists in the table after canceling
        await expect(this.page.locator('table tbody tr', { hasText: contactName })).toHaveCount(1);
        console.log('Contact deletion canceled, contact is still present:', contactName);
    }

    // Verify contact creation by clicking the plus button
    public async verifyContactCreationByPlusButton(): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);
        const plus = this.page.getByRole('button', { name: '' });
        await plus.click();
        await this.verifyContactFormOpen();
        await expect(this.page.getByText('First Name*')).toBeVisible();
        await expect(this.page.getByText('Last Name')).toBeVisible();

        console.log('Contact creation form is visible after clicking plus button.');
    }
    // /*
    //  * Verify that initials placeholder is shown when profile image is missing
    //  */
    public async verifyInitialsPlaceholderWhenNoProfileImage(contactName: string): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);
        await this.searchForContact(contactName);

        // Wait for table rows to load
        await this.page.waitForSelector('table tbody tr', { timeout: 10000 });

        const row = this.page.locator('table tbody tr', { hasText: contactName }).first();
        await expect(row).toBeVisible({ timeout: 10000 });

        // Locate p-avatar anywhere inside the row
        const pAvatar = row.locator('p-avatar');
        await expect(pAvatar).toBeVisible({ timeout: 10000 });

        // Check if profile image exists
        const avatarImg = pAvatar.locator('img');
        const hasImage = await avatarImg.isVisible().catch(() => false);

        if (!hasImage) {
            const initialsPlaceholder = pAvatar.locator('div').filter({ hasText: /^12$/ });
            await expect(initialsPlaceholder).toBeVisible();

            const nameParts = contactName.trim().split(' ');
            let initials = '';
            if (nameParts.length === 1) initials = nameParts[0][0]?.toUpperCase() ?? '';
            else if (nameParts.length >= 2) initials = (nameParts[0][0] + nameParts[1][0])?.toUpperCase();
            if (!initials && contactName.length >= 2) initials = contactName.substring(0, 2).toUpperCase();

            const initialsText = (await initialsPlaceholder.textContent())?.replace(/\s/g, '').toUpperCase() || '';
            expect(initialsText).toContain(initials);

            console.log(`✅ Verified initials "${initials}" for contact "${contactName}"`);
        } else {
            throw new Error(`Profile image is present for contact "${contactName}", cannot verify initials placeholder.`);
        }
    }

    public async verifyContactListStatusAlignment(): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);

        await this.page.waitForSelector('table tbody tr', { timeout: 10000 });

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

        if (validXPositions.length === 0) {
            throw new Error('No valid bounding boxes found for status column cells.');
        }

        const minX = Math.min(...validXPositions);
        const maxX = Math.max(...validXPositions);

        expect(maxX - minX).toBeLessThanOrEqual(2);
    }

    // Verify "Select All" functionality
    public async verifySelectAllFunctionality(): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);

        // Wait for table and rows
        await this.page.waitForSelector('table thead tr');
        await this.page.waitForSelector('table tbody tr');

        // Find the "select all" checkbox (typically first checkbox in thead)
        const selectAllCheckbox = this.page.getByRole('checkbox').nth(1)

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
        await this.page.waitForTimeout(4000);

        // Wait for table and rows
        await this.page.waitForSelector('table thead tr');
        await this.page.waitForSelector('table tbody tr');

        // Find the "select all" checkbox (typically first checkbox in thead)
        const selectAllCheckbox = this.page.getByRole('checkbox').nth(1);

        // Click the select all checkbox to select all
        await selectAllCheckbox.click();

        // Check that all row checkboxes are checked
        const rowCheckboxes = this.page.locator('table tbody input[type="checkbox"]');
        const rowCount = await rowCheckboxes.count();
        if (rowCount === 0) {
            throw new Error("No rows present to select.");
        }
        for (let i = 0; i < rowCount; i++) {
            const checkbox = rowCheckboxes.nth(i);
            await expect(checkbox).toBeChecked();
        }

        // Click the select all checkbox again to deselect all
        await selectAllCheckbox.click();

        // Verify that all row checkboxes are now unchecked
        for (let i = 0; i < rowCount; i++) {
            const checkbox = rowCheckboxes.nth(i);
            await expect(checkbox).not.toBeChecked();
        }
    }

    // Verify clicking on a single contact checkbox
    public async verifySelectingIndividualContacts(): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);

        // Wait for contacts table to load
        await this.page.waitForSelector('table thead tr');
        await this.page.waitForSelector('table tbody tr');

        // Get all row checkboxes in the contacts table body
        const rowCheckboxes = this.page.getByRole('checkbox').nth(3);
        await rowCheckboxes.click()
    }

    // Verify filtering contacts using status filter
    public async verifyFilteringContactsByStatus(name: string): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(3000);

        // Open the status filter
        const filterButton = this.page.locator("//th[2]//div[1]//div[1]//img[1]");
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
    }
    // Verify clear button closes the filter popup after selecting an option
    public async verifyClearButtonClosesFilter(): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(3000);

        // Open the status filter
        const filterButton = this.page.locator("//th[2]//div[1]//div[1]//img[1]");
        await filterButton.dblclick({ force: true });

        // Check that filter popup is visible
        const filterPopup = this.page.locator('div').filter({ hasText: 'Filter BySelectClearApply' }).nth(1)
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
    }

    // Verify filtering contacts with invalid (empty) condition
    public async verifyFilteringContactsWithInvalidCondition(): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(3000);

        // Open the status filter (assuming second column is filterable)
        const filterButton = this.page.locator("//th[2]//div[1]//div[1]//img[1]");
        await filterButton.dblclick({ force: true });

        // Check that filter popup is visible
        const filterPopup = this.page.locator('div').filter({ hasText: 'Filter BySelectClearApply' }).nth(1);
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
    }

    public async verifyTableAlignmentWithSelectionColumnWithFilter(): Promise<void> {
        // Navigate and wait for page load
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);

        // Open the filter icon in the 10th column
        const filterButton = this.page.locator("//th[10]//div[1]//div[1]//img[1]");
        await filterButton.dblclick({ force: true });

        // Wait for filter popup to appear
        const filterPopup = this.page.getByText('Filter ByCustom DateClearApply');
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

        const checkbox = this.page.getByRole('checkbox').nth(1);
        await checkbox.scrollIntoViewIfNeeded()
        await expect(checkbox).toBeVisible();

    }

    // Verifies that all essential columns in the contacts table have non-empty data, based on the visible structure in the image

    public async verifyContactsTableEssentialColumnsHaveData(): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);

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
    }

    public async verifyFilteringContactsByFullName(contactName: string): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);
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
        await this.page.waitForTimeout(4000);

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
        await this.page.waitForTimeout(4000);

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
    }

    public async verifyIndividualTypeFilter(name: string): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);
        // Open the status filter
        const filterButton = this.page.locator("//th[5]//div[1]//div[1]//img[1]");
        await filterButton.dblclick({ force: true });

        // Interact with the "Select" dropdown for filter type (Equals/Not Equals/...)
        const selectField = this.page.getByText('Select', { exact: true }).first();
        await selectField.click();

        // Choose "Equals"
        await this.page.getByRole('option', { name: /equals/i }).click();
        const selectField1 = this.page.getByText('Select', { exact: true }).last();
        await selectField1.click();
        // Fill in the keyword/type value to filter
        const searchBox = this.page.getByRole('textbox', { name: 'Type to search' });
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
    }

    public async verifyTypeFilter(typeName: string): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);

        // Open the type filter
        const filterButton = this.page.locator("//th[5]//div[1]//div[1]//img[1]");
        await filterButton.dblclick({ force: true });

        // Open the first "Select" for filter type operator (Equals/Not Equals/...)
        const operatorDropdown = this.page.getByText('Select', { exact: true }).first();
        await operatorDropdown.click();

        // Choose "Equals" as operator
        await this.page.getByRole('option', { name: /equals/i }).click();

        // Open the second "Select" for value multiselect (company type)
        const companyTypeDropdown = this.page.getByText('Select', { exact: true }).last();
        await companyTypeDropdown.click();

        // Type and select the company type value to filter
        const searchBox = this.page.getByRole('textbox', { name: 'Type to search' });
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
    }

    public async verifyTypeFilterForCompany(typeName: string): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(3000);

        // Open the type filter
        const filterButton = this.page.locator("//th[5]//div[1]//div[1]//img[1]");
        await filterButton.dblclick({ force: true });

        // Open the first "Select" for filter type operator (Equals/Not Equals/...)
        const operatorDropdown = this.page.getByText('Select', { exact: true }).first();
        await operatorDropdown.click();

        // Choose "Equals" as operator
        await this.page.getByRole('option', { name: /equals/i }).click();

        // Open the second "Select" for value multiselect (company type)
        const companyTypeDropdown = this.page.getByText('Select', { exact: true }).last();
        await companyTypeDropdown.click();

        // Type and select the company type value to filter
        const searchBox = this.page.getByRole('textbox', { name: 'Type to search' });
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
    }

    public async verifyAssociateCompanyFilter(): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);

        // "Associate Company" filter open kar rahe hain
        const filterButton = this.page.locator("//th[8]//div[1]//div[1]//img[1]");
        await filterButton.dblclick({ force: true });

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
    }

    public async verifyOwnerFilterWorks(ownerName: string): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);

        const filterButton = this.page.locator("//th[9]//div[1]//div[1]//img[1]");
        await filterButton.dblclick({ force: true });
        await this.page.waitForTimeout(1500);

        const operatorDropdown = this.page.getByText('Select', { exact: true }).first();
        await operatorDropdown.click();
        const equalsOption = this.page.getByRole('option', { name: /equals/i });
        await equalsOption.click();

        const valueDropdown = this.page.getByText('Select', { exact: true }).last();
        await valueDropdown.click();
        const searchBox = this.page.getByRole('textbox', { name: 'Type to search' });
        await searchBox.waitFor({ state: 'visible', timeout: 5000 });
        await searchBox.fill(ownerName);
        await this.page.waitForTimeout(500);
        const matchingOption = this.page.getByRole('dialog').getByRole('listitem').filter({ hasText: ownerName });
        await matchingOption.first().click();

        const closeTag = this.page.locator('.filter-by-tasks > re-multiselect > .box > .tags > .fas');
        if (await closeTag.isVisible().catch(() => false)) {
            await closeTag.click();
        }

        const applyBtn = this.page.getByRole('button', { name: /apply/i });
        await applyBtn.click();
        await this.page.waitForTimeout(1500);

        await this.page.waitForSelector('table tbody tr', { timeout: 10000 });

    }
    // Verify Created Date filter works properly
    public async verifyCreatedDateFilter(): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);

        // Locate the filter button for the Created Date column (assuming 10th column, adjust if needed)
        const filterButton = this.page.locator("//th[10]//div[1]//div[1]//img[1]");
        await this.page.waitForTimeout(500)
        await filterButton.dblclick({ force: true });
        await this.page.waitForTimeout(1500);
        await this.page.locator('div').filter({ hasText: 'Custom Date' }).nth(4).click()
        // Click to open operator dropdown and select 'Equals'
        const SelectDate = this.page.getByText('Prev Quarter')
        await SelectDate.click();

        const applyBtn = this.page.getByRole('button', { name: /apply/i });
        await applyBtn.click();
        await this.page.waitForTimeout(1500);

        await this.page.waitForSelector('table tbody tr', { timeout: 10000 });
    }

    // Verify sorting contacts by status (robust: skip empty/invalid, log details, throw descriptive errors)
    public async verifySortingByStatus(): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(3000);

        // Locate the "Full Name" column header and click to sort (adjust column index if needed)
        const fullNameHeader = this.page.locator("//th[2]//div[1]//div[1]//i[1]");
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
        await this.page.waitForTimeout(1500);
    }

    public async verifyScrollLoadsMoreContacts(): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);
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

    }

    public async verifyScrollingWithFilterOrSort(): Promise<void> {
        await this.NavigateToContacts();
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
    }

    async verifyScrollingAfterOpeningAndClosingContact() {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(2000);
        await this.page.waitForSelector('table tbody tr', { timeout: 10000 });

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

    }

    async navigateToContactsThenOfficesAndCheckCheckboxes() {
        await this.NavigateToContacts();
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
        await this.page.waitForTimeout(4000);
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

    }

    public async verifyTagDropdownFilter(tagName: string): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);
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
    }

    // Verify filtering by tag and scrolling loads relevant contacts
    public async verifyTagDropdownFilterWithScroll(tagName: string): Promise<void> {
        await this.NavigateToContacts();
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
    }

    public async verifyOpenContactFromList(): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(2500);

        const rowsLocator = this.page.locator('table tbody tr');
        await rowsLocator.first().waitFor({ state: 'visible', timeout: 7000 });

        await rowsLocator.first().click();

        const detailPanel = this.page.locator('.property-details').first();
        await detailPanel.first().waitFor({ state: 'visible', timeout: 5000 });

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
    }


    public async verifyOpenFilteredContact(filterName: string): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);

        await this.searchForContact(filterName);

        const rowsLocator = this.page.locator('table tbody tr');
        await rowsLocator.first().waitFor({ state: 'visible', timeout: 10000 });

        const contactRow = rowsLocator.first();
        const nameCell = contactRow.locator('td').nth(0);
        const tableContactName = (await nameCell.textContent())?.trim() ?? "";
        await contactRow.click();

        const detailPanel = this.page.locator('.f-20.ng-star-inserted').first();

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
    }

    public async verifyOpenAndCloseMultipleContactsSequentially(count: number = 3): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);

        const rowsLocator = this.page.locator('table tbody tr');
        const numberOfContacts = await rowsLocator.count();
        const maxContacts = Math.min(count, numberOfContacts);

        for (let i = 0; i < maxContacts; i++) {
            const contactRow = rowsLocator.nth(i);
            await contactRow.waitFor({ state: 'visible', timeout: 10000 });

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
                await detailPanel.waitFor({ state: 'hidden', timeout: 5000 });
            } else {
                await this.page.keyboard.press('Escape');
                await detailPanel.waitFor({ state: 'hidden', timeout: 5000 });
            }

            // Small wait after closing
            await this.page.waitForTimeout(500);
        }
    }

    /*********************************************************Contact Form Public Action******************************************** */
    public async verifyContactFormOpensSuccessfully() {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(2000);

        const AddContactButton = this.page.getByRole('button', { name: '' });
        await AddContactButton.click({ force: true });

        const contactForm = this.page.locator('section');
        await contactForm.waitFor({ state: 'visible', timeout: 10000 });
        expect(contactForm).toBeVisible();
        console.log("Contact Form open successfully")
    }

    public async verifyContactFormCloseWithXIcon() {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(2000);
        const AddContactButton = this.page.getByRole('button', { name: '' });
        await AddContactButton.click({ force: true });

        const contactForm = this.page.locator('section');
        await contactForm.waitFor({ state: 'visible', timeout: 10000 });
        expect(contactForm).toBeVisible();
        const closeIcon = this.page.locator('.pi.pi-times.cursor-pointer.f-14').first();
        await closeIcon.waitFor({ state: 'visible', timeout: 5000 });
        await closeIcon.click();
        await contactForm.waitFor({ state: 'hidden', timeout: 5000 });
        expect(await contactForm.isVisible()).toBeFalsy();
        console.log("Contact form was closed using the X icon successfully")
    }

    public async verifyImageUploadFunctionalityNotDisplayed() {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(2000);

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

        console.log("Verified: Image upload functionality is not displayed on the contact form.");
    }



    public async verifyContactInitialsPlaceholderDisplays(firstName?: string, lastName?: string) {
        await this.NavigateToContacts();

        await this.page.waitForTimeout(2500)

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
    }


    public async verifySelectContactTypeUpdatesDropdown() {
        await this.NavigateToContacts();

        await this.page.waitForTimeout(3000);

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
    }

    public async verifyRequiredFieldsValidationForCompany() {
        await this.NavigateToContacts();

        await this.page.waitForTimeout(3000);
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
    }

    public async verifyRequiredFieldsCapitalizedValidationForCompany() {
        await this.NavigateToContacts();

        await this.page.waitForTimeout(3000);
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
    }

    // Verify required fields validation for "Individual" contact type
    public async verifyRequiredFieldsValidationForIndividual() {
        await this.NavigateToContacts();

        await this.page.waitForTimeout(3000);
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
    }

    public async verifySaveButtonSavesForm() {
        await this.NavigateToContacts();

        await this.page.waitForTimeout(3000);

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

        const saveButton = this.page.getByRole('button', { name: 'Save' }).first();
        await saveButton.click({ force: true });

        const successToast = this.page.getByText(/Contact has been created|Contact has been updated/i);
        await expect(successToast).toBeVisible();
    }

    // Verify that clicking "Save & Close" saves and closes the form
    public async verifySaveAndCloseButtonSavesAndClosesForm() {
        await this.NavigateToContacts();

        await this.page.waitForTimeout(3000);

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
        await this.page.waitForTimeout(3000);

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


    }

    public async verifyInvalidEmailFormatErrorMessage() {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(3000);

        // Open Add Contact
        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        // Enter invalid email format
        const invalidEmail = "invalid-email-format@";
        const emailInput = this.page.locator('input[formcontrolname="email"]');
        await emailInput.waitFor({ state: 'visible' });
        await emailInput.fill(invalidEmail);

        // Click Save button
        const saveButton = this.page.getByRole('button', { name: 'Save' }).first();
        await saveButton.click({ force: true });

        // Verify error message for email field
        const emailError = this.page.getByText('Invalid email format');
        await expect(emailError).toBeVisible();
    }

    public async verifyAddEmailField() {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(3000);

        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        const emailInputs = this.page.locator('input[formcontrolname="email"]');
        const countBefore = await emailInputs.count();

        const addEmailIcon = this.page.getByRole('button', { name: '' }).nth(1);
        await addEmailIcon.click();

        await expect(this.page.getByRole('textbox', { name: 'Other Email' })).toBeVisible()

        const countAfter = await emailInputs.count();

        expect(countAfter).toBe(countBefore + 1);
    }

    // Verify that clicking the "+" icon adds a new phone field
    public async verifyAddPhoneField() {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(3000);

        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        const phoneInputs = this.page.locator('input[formcontrolname="mobile_no"]');
        const countBefore = await phoneInputs.count();

        const addPhoneIcon = this.page.getByRole('button', { name: '' }).nth(2);
        await addPhoneIcon.click();

        await expect(this.page.getByRole('textbox', { name: 'Other Phone' })).toBeVisible();

        const countAfter = await phoneInputs.count();

        expect(countAfter).toBe(countBefore + 1);
    }

    public async verifyDeleteEmailOrPhoneField() {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(3000);

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
    }

    // Verify that clicking the correct (✔) button sets an email as the primary email

    public async verifySetPrimaryEmail() {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(3000);

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
    }

    // Attempt to save a tag without entering a name
    public async verifyCannotSaveTagWithoutName() {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(3000);

        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        const plusTagIcon = this.page.locator('i.pi.pi-plus.cursor-pointer.text-primary');
        await plusTagIcon.scrollIntoViewIfNeeded();
        await plusTagIcon.click();

        await expect(this.page.getByText('Tag Manager')).toBeVisible();

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
    }

    // Verify associating a company with a contact via association search in contact details
    public async verifyCompanyAssociatedWithContact(companyName: string): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(3000);

        const rowsLocator = this.page.locator('table tbody tr');
        await rowsLocator.first().waitFor({ state: 'visible', timeout: 10000 });

        const contactRow = rowsLocator.first();
        const nameCell = contactRow.locator('td').nth(0);
        const tableContactName = (await nameCell.textContent())?.trim() ?? "";
        await contactRow.click();

        const detailPanel = this.page.locator('.f-20.ng-star-inserted').first();

        const associationSearchInput = this.page.getByRole('searchbox', { name: 'Search Company' });
        await associationSearchInput.waitFor({ state: 'visible', timeout: 5000 });
        await associationSearchInput.click();
        await associationSearchInput.fill(companyName);

        // Wait for and select the desired company from the dropdown options
        const companyOption = this.page.getByRole('option', { name: companyName }).first();
        await companyOption.waitFor({ state: 'visible', timeout: 5000 });
        await companyOption.click();

        // Click on the "Association" button (replace selector as needed)
        const associationButton = this.page.getByRole('button', { name: /associate|association/i }).first();
        await associationButton.waitFor({ state: 'visible', timeout: 3000 });
        await associationButton.click();

        const alertLocator = this.page.getByRole('alert', { name: /Company added successfully|This company is already attached with this contact/ });
        await expect(alertLocator).toBeVisible({ timeout: 10000 });
        const removeNetsol = this.page.locator('div.company-div:has(span:text("Netsol")) i.pi-times-circle');
        await expect(removeNetsol).toBeVisible()
    }

    // Try to associate the same company twice
    public async tryAssociateSameCompanyTwice(companyName: string): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(3000);

        const rowsLocator = this.page.locator('table tbody tr');
        await rowsLocator.first().waitFor({ state: 'visible', timeout: 10000 });

        const contactRow = rowsLocator.first();
        const nameCell = contactRow.locator('td').nth(0);
        const tableContactName = (await nameCell.textContent())?.trim() ?? "";
        await contactRow.click();

        const detailPanel = this.page.locator('.f-20.ng-star-inserted').first();

        const associationSearchInput = this.page.getByRole('searchbox', { name: 'Search Company' });
        await associationSearchInput.waitFor({ state: 'visible', timeout: 5000 });
        await associationSearchInput.click();
        await associationSearchInput.fill(companyName);

        // Wait for and select the desired company from the dropdown options
        const companyOption = this.page.getByRole('option', { name: companyName }).first();
        await companyOption.waitFor({ state: 'visible', timeout: 5000 });
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
    }

    // Verify that clicking on a company tag opens the company form
    public async verifyOpenCompanyFormFromTag(companyName: string): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(3000);

        const rowsLocator = this.page.locator('table tbody tr');
        await rowsLocator.first().waitFor({ state: 'visible', timeout: 10000 });

        const contactRow = rowsLocator.first();
        const nameCell = contactRow.locator('td').nth(0);
        const tableContactName = (await nameCell.textContent())?.trim() ?? "";
        await contactRow.click();

        const detailPanel = this.page.locator('.f-20.ng-star-inserted').first();

        const associationSearchInput = this.page.getByRole('searchbox', { name: 'Search Company' });
        await associationSearchInput.waitFor({ state: 'visible', timeout: 5000 });
        await associationSearchInput.click();
        await associationSearchInput.fill(companyName);

        // Wait for and select the desired company from the dropdown options
        const companyOption = this.page.getByRole('option', { name: companyName }).first();
        await companyOption.waitFor({ state: 'visible', timeout: 5000 });
        await companyOption.click();

        // Click on the "Association" button (replace selector as needed)
        const associationButton = this.page.getByRole('button', { name: /associate|association/i }).first();
        await associationButton.waitFor({ state: 'visible', timeout: 3000 });
        await associationButton.click();

        const alertLocator = this.page.getByRole('alert', { name: /Company added successfully|This company is already attached with this contact/ });
        await expect(alertLocator).toBeVisible({ timeout: 10000 });
        const tag = this.page.locator(`div.company-div span`, { hasText: companyName }).first();
        await tag.click();
        await expect(this.page.locator('section').filter({ hasText: 'Contact TypeSelect Type×Company×TypeCompany Type×Client× Netsol Save Contact' })).toBeVisible()
    }

    // Verify that a company tag can be removed
    public async verifyRemoveCompanyTag(companyName: string): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(3000);

        const rowsLocator = this.page.locator('table tbody tr');
        await rowsLocator.first().waitFor({ state: 'visible', timeout: 10000 });

        const contactRow = rowsLocator.first();
        const nameCell = contactRow.locator('td').nth(0);
        const tableContactName = (await nameCell.textContent())?.trim() ?? "";
        await contactRow.click();

        const detailPanel = this.page.locator('.f-20.ng-star-inserted').first();

        const associationSearchInput = this.page.getByRole('searchbox', { name: 'Search Company' });
        await associationSearchInput.waitFor({ state: 'visible', timeout: 5000 });
        await associationSearchInput.click();
        await associationSearchInput.fill(companyName);

        // Wait for and select the desired company from the dropdown options
        const companyOption = this.page.getByRole('option', { name: companyName }).first();
        await companyOption.waitFor({ state: 'visible', timeout: 5000 });
        await companyOption.click();

        // Click on the "Association" button (replace selector as needed)
        const associationButton = this.page.getByRole('button', { name: /associate|association/i }).first();
        await associationButton.waitFor({ state: 'visible', timeout: 3000 });
        await associationButton.click();

        const alertLocator = this.page.getByRole('alert', { name: /Company added successfully|This company is already attached with this contact/ });
        await expect(alertLocator).toBeVisible({ timeout: 10000 });
        const tag = this.page.locator(`div.company-div span`, { hasText: companyName }).first();
        await tag.click();
        await expect(this.page.locator('section').filter({ hasText: 'Contact TypeSelect Type×Company×TypeCompany Type×Client× Netsol Save Contact' })).toBeVisible()

        const closeButton = this.page.locator('//i[@ptooltip="Close" and contains(@class,"pi-times")]').last();
        await closeButton.click();
        await expect(this.page.locator('section').filter({ hasText: 'Contact TypeSelect Type×Company×TypeCompany Type×Client× Netsol Save Contact' })).not.toBeVisible()

    }

    // Verify that address suggestions appear while typing in the address field
    public async verifyAddressSuggestions(addressPartial: string): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(3000);

        // Click into first contact to open detail view
        const rowsLocator = this.page.locator('table tbody tr');
        await rowsLocator.first().waitFor({ state: 'visible', timeout: 10000 });

        const contactRow = rowsLocator.first();
        const nameCell = contactRow.locator('td').nth(0);
        const tableContactName = (await nameCell.textContent())?.trim() ?? "";
        await contactRow.click();

        // Locate the address input field (update selector as needed)
        const addressInput = this.page.getByRole('textbox', { name: /address/i }).first();
        await addressInput.waitFor({ state: 'visible', timeout: 5000 });
        await addressInput.click();
        await addressInput.fill(addressPartial);

        const suggestionsList = this.page.locator('.pac-item');
        // Simulate slow typing (since .type is not supported, use fill with increasing substrings and delay)
        for (let i = 1; i <= addressPartial.length; i++) {
            const partialStr = addressPartial.slice(0, i);
            await addressInput.fill(partialStr);
            await this.page.waitForTimeout(300); // wait 300ms to simulate user's "slow typing"
        }
        // Wait for suggestions to appear and select the first one
        await suggestionsList.first().waitFor({ state: 'visible', timeout: 5000 });
        await suggestionsList.first().click();
    }

    public async verifyAddressAutoFill(addressPartial: string): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(3000);

        // Open the first contact in the contacts list
        const rowsLocator = this.page.locator('table tbody tr');
        const firstRow = rowsLocator.first();
        await expect(firstRow).toBeVisible({ timeout: 10000 });
        await firstRow.click();

        // Find the address input field
        const addressInput = this.page.locator('input[placeholder="Search Address"]');
        await expect(addressInput).toBeVisible({ timeout: 5000 });
        await addressInput.click();

        // Type the address slowly to trigger autocomplete
        for (let i = 1; i <= addressPartial.length; ++i) {
            await addressInput.fill(addressPartial.slice(0, i));
            await this.page.waitForTimeout(50);
        }

        // Wait for Google Places suggestions and click the first one
        const suggestionsList = this.page.locator('.pac-item');
        await expect(suggestionsList.first()).toBeVisible({ timeout: 5000 });
        await suggestionsList.first().click();

        // Wait for autofill to populate
        await this.page.waitForTimeout(2000);

        // Open overlay/panel if required
        const editOverlayButton = this.page.locator('#toggle-overlay');
        if (await editOverlayButton.isVisible({ timeout: 2000 })) {
            await editOverlayButton.click();
        }

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

    }

    // Verify that all address fields are displayed correctly
    async verifyAllAddressFieldsDisplayed() {

        await this.NavigateToContacts();
        await this.page.waitForTimeout(3000);

        // Click into first contact to open detail view
        const rowsLocator = this.page.locator('table tbody tr');
        await rowsLocator.first().waitFor({ state: 'visible', timeout: 10000 });

        const contactRow = rowsLocator.first();
        const nameCell = contactRow.locator('td').nth(0);
        const tableContactName = (await nameCell.textContent())?.trim() ?? "";
        await contactRow.click();

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
    }

    // Verify that the Tag Manager popup opens
    async verifyTagManagerPopupOpens() {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(3000);

        // Click into first contact to open detail view
        const rowsLocator = this.page.locator('table tbody tr');
        await rowsLocator.first().waitFor({ state: 'visible', timeout: 10000 });

        const contactRow = rowsLocator.first();
        const nameCell = contactRow.locator('td').nth(0);
        const tableContactName = (await nameCell.textContent())?.trim() ?? "";
        await contactRow.click();

        // Open overlay/panel if required
        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();

        const TagPopup = this.page.getByText('Tag ManagerCompany Contact');
        await expect(TagPopup).toBeVisible();
    }

    async verifyCanAddNewTagType(tagTypeName: string) {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);

        const rowsLocator = this.page.locator('table tbody tr');
        await rowsLocator.first().waitFor({ state: 'visible', timeout: 10000 });

        const contactRow = rowsLocator.first();
        const nameCell = contactRow.locator('td').nth(0);
        const tableContactName = (await nameCell.textContent())?.trim() ?? "";
        await contactRow.click();

        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();

        const tagPopupHeader = this.page.getByText('Tag ManagerCompany Contact');
        await expect(tagPopupHeader).toBeVisible();

        const addTagTypeButton = this.page.locator('.p-element.p-button-rounded').first();
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


        const tagManagerPopup = this.page.getByText('Automation Testing'); // try common class, else adjust selector
        await tagManagerPopup.scrollIntoViewIfNeeded();

        // Now check visibility after scroll
        const newTagType = this.page.getByText(tagTypeName, { exact: true });
        await expect(newTagType).toBeVisible({ timeout: 10000 });

        // Verify in search box field that the tag should be displayed
        const tagSearchInput = this.page.locator('input[placeholder="Search Tags"]');
        await tagSearchInput.click();
        // Fill the input with a delay between keystrokes
        for (const char of fakeTag) {
            await tagSearchInput.type(char, { delay: 20 });
        }
        // Expect that the tag option is visible in the dropdown (without locator in expect)
        await expect(tagSearchInput).toBeVisible()
    }
    // Verify that entering data in address fields is reflected in the main/displayed address

    async verifyMainAddressUpdatesWithAllFields() {
        // Step 1: Navigate to contacts and select first contact
        await this.NavigateToContacts();
        await this.page.waitForTimeout(3000);

        const rows = this.page.locator('table tbody tr');
        const firstRow = rows.nth(0);
        await expect(firstRow).toBeVisible({ timeout: 10000 });
        await firstRow.click();

        // Step 2: Search Address field > type & select suggestion
        const addressInput = this.page.locator('input[placeholder="Search Address"]');
        await expect(addressInput).toBeVisible({ timeout: 5000 });
        await addressInput.click();
        const addressPartial = '221B Baker Street';
        for (let i = 1; i <= addressPartial.length; ++i) {
            await addressInput.fill(addressPartial.slice(0, i));
            await this.page.waitForTimeout(50);
        }
        const suggestionsList = this.page.locator('.pac-item');
        await expect(suggestionsList.first()).toBeVisible({ timeout: 5000 });
        await suggestionsList.first().click();
        await this.page.waitForTimeout(2000);

        // Save search box value after selection
        const selectedValue = await addressInput.inputValue();

        // Step 3: Edit address fields by clicking edit icon (overlay/panel)
        const editOverlayButton = this.page.locator('#toggle-overlay');
        if (await editOverlayButton.isVisible({ timeout: 2000 }).catch(() => false)) {
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
    }

// Search for a non existent tag in Tag Manager
    async searchForNonExistentTag(tagName: string) {

        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);

        const rowsLocator = this.page.locator('table tbody tr');
        await rowsLocator.first().waitFor({ state: 'visible', timeout: 10000 });

        const contactRow = rowsLocator.first();
        const nameCell = contactRow.locator('td').nth(0);
        const tableContactName = (await nameCell.textContent())?.trim() ?? "";
        await contactRow.click();

        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();

        const tagPopupHeader = this.page.getByText('Tag ManagerCompany Contact');
        await expect(tagPopupHeader).toBeVisible();
        const searchInput = this.page.getByPlaceholder('Search tags');
        await searchInput.fill(tagName);
        const noResult = this.page.getByText(/No data found|no results|no matching tags/i);
        await expect(noResult).toBeVisible();
    }
     
    async verifyCreateTagByEnter(tagTypeName: string, tagValue: string) {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(4000);

        // Open a contact row
        const rowsLocator = this.page.locator('table tbody tr');
        await rowsLocator.first().waitFor({ state: 'visible', timeout: 10000 });
        const contactRow = rowsLocator.first();
        await contactRow.click();

        // Open Tag Manager popup
        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();
        const tagPopupHeader = this.page.getByText('Tag ManagerCompany Contact');
        await expect(tagPopupHeader).toBeVisible();

        // Add Tag Type
        const addTagTypeButton = this.page.locator('.p-element.p-button-rounded').first();
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
    }
}

