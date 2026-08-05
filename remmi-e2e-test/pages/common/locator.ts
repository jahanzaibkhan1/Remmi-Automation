import { Page, Locator } from '@playwright/test';

/**
 * Self-healing locator using Playwright's native CSS OR combinator.
 *
 * Provide selectors from most stable to least stable:
 *   1. data-testid  (most stable — won't change unless intentional)
 *   2. aria role / aria-label
 *   3. stable CSS class or attribute
 *   4. text content  (least stable — changes with copy edits)
 *
 * Playwright evaluates all selectors and returns the first element that matches any.
 *
 * @example
 *   heal(page,
 *     '[data-testid="submit-btn"]',
 *     '[aria-label="Submit"]',
 *     'button[type="submit"]',
 *     'button:has-text("Submit")',
 *   )
 */
export function heal(page: Page, ...selectors: string[]): Locator {
  if (selectors.length === 0) throw new Error('heal() requires at least one selector');
  return page.locator(selectors.join(', '));
}

/**
 * Self-healing locator scoped to a parent element.
 */
export function healWithin(parent: Locator, ...selectors: string[]): Locator {
  if (selectors.length === 0) throw new Error('healWithin() requires at least one selector');
  return parent.locator(selectors.join(', '));
}
