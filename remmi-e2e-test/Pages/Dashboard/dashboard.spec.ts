import { test as base, type Page } from "@playwright/test";
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
      // Optionally close context if desired in cleanup
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

  test('Verify board size adjusts with number of boards', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyBoardSizeAdjustsWithNumberOfBoards();
  });

  test('Verify note board popup opens', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyNoteBoardPopupOpens();
  });

  test('Verify adding a note', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyAddingNote();
  });

  test('Verify lead types on Lead board', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyLeadTypesOnLeadBoard();
  });

  test('Verify map board shows location', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyMapBoardShowsLocation();
  });

  test('Add 6 boards to a single row', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.addSixBoardsToSingleRow();
  });

  test('Verify that without saving the dashboard, board position does not change', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyBoardPositionDoesNotChangeWithoutSaving();
  });

  test('Add a note without title', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.addNoteWithoutTitle();
  });

  test('Verify that unpinned the listing from the dashboard', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.unpinPinnedListingFromDashboard();
  });

  test('Verify popup position sync after row change', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.checkBoardPopupPositionSyncAfterMove();
  });

  test('Verify cross icon closes popup', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyCrossIconClosesPopup();
  });

  test('Verify Reset button in popup', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyReloadButtonInPopup();
  });

  test('Verify widget visibility affects dashboard', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyWidgetVisibilityAffectsDashboard();
  });

  test('Verify widget movement between rows', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyWidgetMovementBetweenRows();
  });

  test('Verify widget visibility in More Widgets', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyWidgetVisibilityInMoreWidgets();
  });

  test('Verify simultaneous board resizing', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifySimultaneousBoardResizing();
  });

  test('Verify sorting of leads on board', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyBoardLeadSorting();
  });

  test('Verify that EOI board displays correct data on dashboard', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyEOIBoardDisplaysCorrectData();
  });

  test('Verify loading of listing thumbnails', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyLoadingOfListingThumbnails();
  });

  test('Verify that the Task board is displayed correctly on the Dashboard', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyTaskBoardIsDisplayedCorrectly();
  });

  test('Verify that the Report board is displayed correctly on the Dashboard', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyReportBoardIsDisplayedCorrectly();
  });

  test('Verify that the Contract board is displayed correctly on the Dashboard', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyContractBoardIsDisplayedCorrectly();
  });
  
  test('Verify that placeholder image is shown when a listing has no images on Dashboard board', async ({ sessionPage }) => {
    const dashboard = new DashboardAction(sessionPage);
    await dashboard.verifyPlaceholderImageForListingWithoutImages();
  });
});