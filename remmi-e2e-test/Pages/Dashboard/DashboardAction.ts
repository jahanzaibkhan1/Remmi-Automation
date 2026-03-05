import { Page, expect } from "@playwright/test";
import { DashboardLocator } from "./DashboardLocator";

export class DashboardAction {
  private readonly locators: DashboardLocator;

  constructor(private readonly page: Page) {
    this.locators = new DashboardLocator(page);
  }

  // =========================
  // Assertions
  // =========================

  /** Assert that the dashboard home icon is visible */
  async assertHomeIconVisible(timeout: number = 30000): Promise<void> {
    await this.locators.dashboardHomeIcon.waitFor({ state: 'visible', timeout });
    await expect(
      this.locators.dashboardHomeIcon,
      "Dashboard home icon should be visible"
    ).toBeVisible({ timeout });
  }

  /** Assert that the calendar heading is visible */
  async assertCalendarHeadingVisible(timeout: number = 30000): Promise<void> {
    await this.locators.calendarHeading.waitFor({ state: 'visible', timeout });
    await expect(
      this.locators.calendarHeading,
      "Calendar heading should be visible"
    ).toBeVisible({ timeout });
  }

  /** Click the 'View All' button in Calendar */
  async clickViewAllCalendar(timeout: number = 30000): Promise<void> {
    await this.locators.calendarViewAllButton.waitFor({ state: 'visible', timeout });
    await this.locators.calendarViewAllButton.click({ timeout });
  }

  /** Click the 'Connect Calendar' button */
  async clickConnectCalendar(timeout: number = 30000): Promise<void> {
    await this.locators.connectCalendarButton.waitFor({ state: 'visible', timeout });
    await this.locators.connectCalendarButton.click({ timeout });
  }
}