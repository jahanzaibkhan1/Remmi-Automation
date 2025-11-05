import { Page, Locator } from '@playwright/test';
export class ContactLocators {

  constructor(private page: Page) { }

  Contacts(): Locator{
    return this.page.locator("//li[@data-label='Contacts']");
  }
  SearchBox(): Locator{
    return this.page.locator('#keywordInput');
  }
  ContactTypeDropdown():Locator{
    return this.page.locator("//re-multiselect[@placeholder='Contact Type']//div[@class='tags']");
  }
  SearchContactType(): Locator{
    return this.page.getByRole('textbox', { name: 'Type to search' })
  }
  SelectOption(): Locator{
    return this.page.locator("//li[@class='p-element ng-star-inserted']").first();
  }
  SelectAllTypes(): Locator{
    return this.page.locator("//label[@class='checkbox select_all style-d']")
  }
}