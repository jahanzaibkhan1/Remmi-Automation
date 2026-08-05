import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  protected static readonly TIMEOUT_SHORT   =  5_000;
  protected static readonly TIMEOUT_DEFAULT = 10_000;
  protected static readonly TIMEOUT_MEDIUM  = 20_000;
  protected static readonly TIMEOUT_LONG    = 30_000;
  protected static readonly TIMEOUT_XLONG   = 60_000;

  constructor(protected readonly page: Page) {}

  /**
   * Navigate to `path` only when not already there (avoids unnecessary reloads).
   */
  protected async goto(path: string): Promise<void> {
    const current = this.page.url().split(/[?#]/)[0];
    if (!current.endsWith(path)) {
      await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    }
  }

  /**
   * Assert visible — wraps expect so callers don't need to pass timeout every time.
   */
  protected async assertVisible(locator: Locator, timeout = BasePage.TIMEOUT_DEFAULT): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }

  /**
   * Wait for element to be visible then click. Avoids force-clicking invisible elements.
   */
  protected async clickWhenReady(locator: Locator, timeout = BasePage.TIMEOUT_DEFAULT): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
    await locator.click();
  }

  /**
   * Fill an input and assert the value was accepted.
   */
  protected async fillAndVerify(locator: Locator, value: string): Promise<void> {
    await expect(locator).toBeVisible({ timeout: BasePage.TIMEOUT_DEFAULT });
    await locator.fill(value);
    await expect(locator).toHaveValue(value);
  }
}
