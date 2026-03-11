import { test as base, expect } from "@playwright/test";
import { DashboardAction } from "./DashboardAction";
import path from "path";
const managerSessionPath = path.join(__dirname, '../../sessions/manager-session.json');
const DASHBOARD_URL = process.env.DASHBOARD_URL || 'https://remmi-app-stage-ui.azurewebsites.net/dashboard';

const test = base.extend<{ sessionPage: any }>({
  sessionPage: [async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: managerSessionPath });
    try {
      const page = await context.newPage();
      await page.goto(DASHBOARD_URL);
      await use(page);
    } finally {
    }
  }, { scope: 'worker' }]
});

test.describe("Dashboard Module Boards Display", () => {
  test("Verify all main module boards are displayed", async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyAllModuleBoardsDisplayed();
  });

  test("Verify dragging boards to change their position", async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyDraggingBoardsToChangePosition();
  });

  test("Verify boards can be moved to different rows", async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyBoardsCanBeMovedToDifferentRows();
  });

  test("Verify max 5 boards allowed per row", async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyMaxFiveBoardsPerRow();
  });

  test("Verify module opens on board click", async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyModuleOpensOnBoardClick();
  });

  test('Verify "Dashboard Display Order" popup opens', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyDashboardDisplayOrderPopupOpens();
  });

  test('Verify widgets visibility toggle', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyWidgetsVisibilityToggle();
  });

  test('Verify drag and drop functionality in popup', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyDragAndDropInPopup();
  });

  test('Verify board position sync between dashboard and popup', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyBoardPositionSyncBetweenDashboardAndPopup();
  });

  test('Verify removing a row removes all its boards', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyRemovingRowRemovesAllBoards();
  });

  test('Verify new row addition', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyNewRowAddition();
  });

  test('Verify pinned listing appears separately', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyPinnedListingAppearsSeparately();

  });

  test('Verify unpinning a pinned listing', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyUnpinningPinnedListing();
  });

  test('Verify listing carousel arrows', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyListingCarouselArrows();
  });

  test('Verify listing details on desktop', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyListingDetailsOnDashboardDesktop();
  });
  
});