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
  DeSelectAllTypes(): Locator {
    return this.page.locator("//label[@class='checkbox select_all style-d']")
  }
  CompanyType():Locator{
    return this.page.locator("//span[normalize-space()='Company Type']")
  }
  SearchCompanyType(): Locator{
    return this.page.getByRole('textbox', { name: 'Type to search' })
  }
  SelectCompanyOption(): Locator{
    return this.page.locator("//li[@class='p-element ng-star-inserted']").first();
  }
  ResetButton(): Locator{
    return this.page.getByRole('button', { name: 'Reset' });
  }
  DeleteIcon (): Locator{
    return this.page.locator('div:nth-child(8) > .cursor-pointer');
  }
  CheckBox():Locator{
    return this.page.getByRole('checkbox');
  }
  Settings(): Locator{
    return this.page.locator('li[data-label="Settings"]')
  }
  DeletedContacts(): Locator{
    return this.page.getByRole('link', { name: 'Deleted Contacts' });
  }
  SearchForDeletedContact():Locator{
    return this.page.locator('#keywordInput');
  }
  restoreContactIcon():Locator{
    return this.page.locator('img[ptooltip="Restore Contact"][src*="undo_solid.svg"]')
  }
  PlusButton():Locator{
    return this.page.locator('i.pi.pi-plus');
  }
  ContactCreationForm():Locator{
    return this.page.locator('section')
  }
  
}