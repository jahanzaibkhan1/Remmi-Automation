import { Locator, Page } from '@playwright/test';

export class NoticeBoardLocators {
  constructor(private readonly page: Page) {}

  get box(): Locator {
    return this.page.locator('.box_notice');
  }

  get messageInput(): Locator {
    return this.page.locator("input[placeholder='Write a message...']");
  }

  get publicButton(): Locator {
    return this.page.locator('button', { hasText: 'Public' });
  }

  get privateButton(): Locator {
    return this.page.locator('button', { hasText: 'Private' });
  }

  get sendButton(): Locator {
    return this.page.locator('i.pi.pi-send');
  }

  get deleteIcon(): Locator {
    return this.page.locator("img[src='assets/img/menuIcon/delete_icon.svg']").first();
  }

  get staffSelector(): Locator {
    return this.page.locator("//div[@class='tags']");
  }

  get teamSelector(): Locator {
    return this.page.locator('.tags');
  }

  get officeButton(): Locator {
    return this.page.locator('div.btn_group.mb-3.ng-star-inserted > button:nth-child(2)');
  }

  get teamButton(): Locator {
    return this.page.locator('body app-root notice-board button:nth-child(3)');
  }

  get searchInput(): Locator {
    return this.page.locator('input._input-icon.ng-untouched.ng-pristine.ng-valid');
  }

  publicMessage(text: string): Locator {
    return this.page.locator('.false.note.ng-star-inserted', { hasText: text }).first();
  }

  privateMessage(text: string): Locator {
    return this.page.locator('.bg-color.note.ng-star-inserted', { hasText: text }).first();
  }

  recipientOption(name: string): Locator {
    return this.page.locator('li.p-element.ng-star-inserted', { hasText: name });
  }

  officeOption(name: string): Locator {
    return this.page.locator('li.p-element.ng-star-inserted', { hasText: name });
  }

  teamOption(name: string): Locator {
    return this.page.locator('body app-root notice-board li', { hasText: name }).first();
  }
}
