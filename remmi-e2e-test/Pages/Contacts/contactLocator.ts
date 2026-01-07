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
    return this.page.locator('re-multiselect[placeholder="Contact Type"] input[placeholder="Search"]');
  }
  SelectOption(): Locator{
    return this.page.locator("//li[@class='p-element ng-star-inserted']").first();
  }
  SelectAllTypes(): Locator{
    return this.page.locator('.checkbox__checkmark').first();
  }
  DeSelectAllTypes(): Locator {
    return this.page.locator('.checkbox__checkmark').first()
  }
  CompanyType():Locator{
    return this.page.locator("//span[normalize-space()='Company Type']")
  }
  SearchCompanyType(): Locator{
    return this.page.locator('input[placeholder="Search"]').last();
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
    return this.page.locator('.d-flex.align-items-center.gap-3 > img').first();
  }
  PlusButton():Locator{
    return this.page.locator('i.pi.pi-plus');
  }
  ContactCreationForm():Locator{
    return this.page.locator('section')
  }
  
}