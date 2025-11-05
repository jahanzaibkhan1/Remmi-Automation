import { Page, Locator, expect } from '@playwright/test';
import { ContactLocators } from './contactLocator';

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
    private async SelectOption(name:string) {
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
        await deselectAll.click({force: true})
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



    //---------------------------------------Public Actions--------------------------------------------//

    public async verifySearchFuntionality(contactName: string): Promise<void> {
        await this.searchForContact(contactName);
        await this.page.locator(`text=${contactName}`).first().waitFor({ state: 'visible', timeout: 5000 });
    }

    public async searchNonExistingContact(contactName: string): Promise<void> {
        await this.searchForContact(contactName);
        const noResults = this.page.getByRole('cell', { name: 'No contacts available' })
        await noResults.waitFor({ state: 'visible', timeout: 5000 });
    }

    public async verifyContactDropdownFilter(name: string): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(2000);
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

    async selectAllContactType(): Promise<void>{

        await this.ContactTypeDropdown();
        await this.SelectAllTypes();
        const deselectAll = this.page.locator("//label[@class='checkbox select_all style-d']");
        await deselectAll.waitFor({state:'visible', timeout:1000});
        expect(deselectAll).toBeVisible();
    }
    async deselectAllContactType(): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(2000);
        await this.ContactTypeDropdown();
        await this.page.waitForTimeout(1000)
        await this.SelectAllTypes();
        await this.page.waitForTimeout(1000)
        await this.DeselectAllTypes()
    }
    
    public async verifymatchingTypeDisplayed(name: string): Promise<void> {
        await this.NavigateToContacts();
        await this.page.waitForTimeout(2000);
        await this.ContactTypeDropdown();
        await this.SearchContactType(name);
        await this.SelectOption(name);
        await this.ContactTypeDropdown();
    }

}