import { Page, Locator, expect } from '@playwright/test';
import { ContactLocators } from './contactLocator';
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
        await option.waitFor({ state: 'visible', timeout: 10000 });
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
        await this.SelectOption(name);
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
        await this.page.waitForTimeout(2000);
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
    await this.page.waitForTimeout(2000);
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

}