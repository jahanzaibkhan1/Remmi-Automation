import { Page, Locator } from '@playwright/test';
import { ContactLocators } from './contactLocator';

export class ContactActions {
    private locators: ContactLocators;

    constructor(private page: Page) {
        this.locators = new ContactLocators(this.page);
    }

    async NavigateToContacts() {
        const contact = this.locators.Contacts();
        await contact.click();
    }

    private async searchForContact(contactName: string) {
        const searchBox = this.locators.SearchBox();
        await searchBox.waitFor({ state: 'visible', timeout: 10000 });
        await searchBox.click({ force: true });
        await searchBox.fill(contactName);
        // Optionally verify value
        const value = await searchBox.inputValue();
    }

    public async searchExistingContact(contactName: string): Promise<void> {
        await this.page.waitForTimeout(1000)
        await this.searchForContact(contactName);
        await this.page.locator(`text=${contactName}`).first().waitFor({ state: 'visible', timeout: 5000 });
    }
    
    public async searchNonExistingContact(contactName: string): Promise<void> {
        await this.page.waitForTimeout(1000);
        await this.searchForContact(contactName);
        const noResults = this.page.getByRole('cell', { name: 'No contacts available' })
        await noResults.waitFor({ state: 'visible', timeout: 5000 });
    }
}