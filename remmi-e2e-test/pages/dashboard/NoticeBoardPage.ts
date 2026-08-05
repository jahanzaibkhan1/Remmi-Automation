import { Page, expect } from '@playwright/test';
import { BasePage } from '../common/BasePage';
import { NoticeBoardLocators } from './NoticeBoardLocators';

export class NoticeBoardPage extends BasePage {
  private readonly loc: NoticeBoardLocators;

  constructor(page: Page) {
    super(page);
    this.loc = new NoticeBoardLocators(page);
  }

  // ---------------------------------------------------------------------------
  // Primitives
  // ---------------------------------------------------------------------------

  private async openBoard(): Promise<void> {
    await expect(this.loc.box).toBeVisible({ timeout: BasePage.TIMEOUT_LONG });
    await expect(this.loc.messageInput).toBeVisible({ timeout: BasePage.TIMEOUT_DEFAULT });
  }

  private async sendMessage(text: string): Promise<void> {
    await this.loc.messageInput.fill(text);
    await this.loc.sendButton.click();
  }

  private async deleteFirstMessage(): Promise<void> {
    await expect(this.loc.deleteIcon).toBeVisible({ timeout: BasePage.TIMEOUT_DEFAULT });
    await this.loc.deleteIcon.click({ force: true });
    await expect(this.loc.deleteIcon).not.toBeVisible({ timeout: BasePage.TIMEOUT_DEFAULT });
  }

  // ---------------------------------------------------------------------------
  // Public scenarios
  // ---------------------------------------------------------------------------

  async verifyPublicMessageOnNoticeboard(message = 'Public notice test message'): Promise<void> {
    await this.openBoard();
    await this.sendMessage(message);
    await expect(this.loc.publicMessage(message)).toBeVisible();
    await this.deleteFirstMessage();
  }

  async verifyMessageDeletionFromNoticeboard(): Promise<void> {
    await this.verifyPublicMessageOnNoticeboard();
  }

  async verifyUserNameOnNoticeboardMessage(
    message = 'Test notice message',
    expectedUserName = 'Jahanzaib Xenex',
  ): Promise<void> {
    await this.openBoard();
    await this.sendMessage(message);
    const messageEl = this.loc.publicMessage(message);
    await expect(messageEl).toBeVisible();
    await expect(messageEl.locator('p.user.f-10', { hasText: expectedUserName })).toBeVisible();
    await this.deleteFirstMessage();
  }

  async verifyCommentOnNoticeboardMessage(
    message = 'Test notice message',
    expectedUserName = 'Jahanzaib Xenex',
  ): Promise<void> {
    await this.openBoard();
    await this.sendMessage(message);
    const messageEl = this.loc.publicMessage(message);
    await expect(messageEl).toBeVisible();
    await expect(messageEl.locator('p.user.f-10', { hasText: expectedUserName })).toBeVisible();
    await this.deleteFirstMessage();
  }

  async verifyReactOnNoticeboardMessage(message = 'Test notice message'): Promise<void> {
    await this.openBoard();
    await this.sendMessage(message);
    const messageEl = this.loc.publicMessage(message);
    await expect(messageEl).toBeVisible();
    const iconList = messageEl.locator('div.icon_list');
    await expect(iconList).toBeVisible();

    const reactIcons = [
      { imgSelector: "img[src*='like.svg']", idx: 0 },
      { imgSelector: "img[src*='heart.svg']", idx: 1 },
    ];

    for (const react of reactIcons) {
      const reactDiv = iconList.locator('div.img_ico').nth(react.idx);
      const reactImg = reactDiv.locator(react.imgSelector);
      const reactCount = reactDiv.locator('p');
      const initialCount = parseInt((await reactCount.textContent()) ?? '0', 10);
      await reactImg.click();
      await expect.poll(() => reactCount.textContent().then(t => parseInt(t ?? '0', 10)), {
        timeout: BasePage.TIMEOUT_MEDIUM,
      }).toBe(initialCount + 1);
    }

    await this.deleteFirstMessage();
  }

  async addBlankMessageOnNoticeboard(message = '  '): Promise<void> {
    await this.openBoard();
    await this.sendMessage(message);
    await expect(this.loc.publicMessage(message)).toBeVisible({ timeout: BasePage.TIMEOUT_DEFAULT });
    await this.deleteFirstMessage();
  }

  // ---------------------------------------------------------------------------
  // Private message scenarios
  // ---------------------------------------------------------------------------

  async verifyPrivateMessageToSpecificStaff(
    recipient = 'Jahanzaib Xenex',
    message = 'Private notice test message',
  ): Promise<void> {
    await this.openBoard();
    await this.sendMessage(message);
    await this.loc.privateButton.click();
    await this.loc.staffSelector.click();
    await expect(this.loc.searchInput).toBeVisible();
    await this.loc.searchInput.clear();
    await this.loc.searchInput.fill(recipient);
    await this.loc.recipientOption(recipient).click();
    await this.loc.sendButton.click();
    await expect(this.loc.privateMessage(message)).toBeVisible();
    await this.deleteFirstMessage();
  }

  async verifyPrivateMessageToSpecificOffice(
    office = 'QA Tester',
    message = 'Private office notice test message',
  ): Promise<void> {
    await this.openBoard();
    await this.sendMessage(message);
    await this.loc.privateButton.click();
    await this.loc.officeButton.click();
    await this.loc.teamSelector.click();
    await expect(this.loc.searchInput).toBeVisible();
    await this.loc.searchInput.clear();
    await this.loc.searchInput.fill(office);
    await this.loc.officeOption(office).click();
    await this.loc.sendButton.click();
    await expect(this.loc.privateMessage(message)).toBeVisible();
    await this.deleteFirstMessage();
  }

  async verifyPrivateMessageToSpecificTeam(
    team = 'Automation Team',
    message = 'Private team notice test message',
  ): Promise<void> {
    await this.openBoard();
    await this.sendMessage(message);
    await this.loc.privateButton.click();
    await this.loc.teamButton.click();
    await this.loc.teamSelector.click();
    await expect(this.loc.searchInput).toBeVisible();
    await this.loc.searchInput.clear();
    await this.loc.searchInput.fill(team);
    await this.loc.teamOption(team).click();
    await this.loc.sendButton.click();
    await expect(this.loc.privateMessage(message)).toBeVisible();
    await this.deleteFirstMessage();
  }

  // ---------------------------------------------------------------------------
  // Load-more / scroll cleanup
  // ---------------------------------------------------------------------------

  async verifyNoticeboardCommentScrollAndCleanup(): Promise<void> {
    await this.openBoard();
    const testMessage = ' ';
    const count = 8;

    for (let i = 0; i < count; i++) {
      await this.sendMessage(testMessage);
      await expect(
        this.page.locator('.false.note.ng-star-inserted', { hasText: testMessage }).nth(i)
      ).toBeVisible();
    }

    const loadMore = this.page.locator('button', { hasText: /Load more/i });
    if (await loadMore.isVisible().catch(() => false)) {
      await loadMore.scrollIntoViewIfNeeded();
      await loadMore.click();
    }

    const deleteSelector = "img[src='assets/img/menuIcon/delete_icon.svg']";
    let remaining = await this.page.locator(deleteSelector).count();
    let attempts = 0;
    while (remaining > 0 && attempts < count * 2) {
      const icon = this.page.locator(deleteSelector).first();
      await icon.waitFor({ state: 'visible', timeout: BasePage.TIMEOUT_SHORT });
      await icon.click({ force: true });
      remaining = await this.page.locator(deleteSelector).count();
      attempts++;
    }

    await expect(
      this.page.locator('.false.note.ng-star-inserted', { hasText: testMessage })
    ).toHaveCount(0, { timeout: BasePage.TIMEOUT_MEDIUM });
  }
}
