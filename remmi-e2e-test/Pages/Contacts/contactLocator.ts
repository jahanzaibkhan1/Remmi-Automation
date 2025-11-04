import { Page, Locator } from '@playwright/test';
export class ContactLocators {

  constructor(private page: Page) { }

  Contacts(): Locator{
    return this.page.locator("//li[@data-label='Contacts']");
  }
  SearchBox(): Locator{
    return this.page.locator('#keywordInput');
  }

 
}