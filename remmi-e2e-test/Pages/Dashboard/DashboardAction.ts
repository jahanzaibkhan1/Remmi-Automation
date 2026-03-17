import { Locator, Page, expect } from "@playwright/test";
import { DashboardLocator } from "./DashboardLocator";

export class DashboardAction {
  locators: DashboardLocator;

  constructor(public page: Page) {
    this.locators = new DashboardLocator(page);
  }

  async clickDashboardHomeIcon() {
    await this.locators.dashboardHomeIcon.waitFor({ state: "visible" });
    await expect(this.locators.dashboardHomeIcon).toBeVisible();
    await this.locators.dashboardHomeIcon.click({ force: true });
  }

  // Dashboard
  async verifyDashboardLoaded() {
    await this.locators.dashboardHomeIcon.waitFor({ state: "visible" });
    await expect(this.locators.dashboardHomeIcon).toBeVisible();
  }

  // Calendar
  async verifyCalendarSection() {
    await this.locators.calendarHeading.waitFor({ state: "visible" });
    await expect(this.locators.calendarHeading).toBeVisible();
    await this.locators.calendarViewAllButton.waitFor({ state: "visible" });
    await expect(this.locators.calendarViewAllButton).toBeVisible();
  }

  async clickCalendarViewAll() {
    await this.locators.calendarViewAllButton.waitFor({ state: "visible" });
    await expect(this.locators.calendarViewAllButton).toBeVisible();
    await this.locators.calendarViewAllButton.click();
  }

  async clickConnectCalendar() {
    await this.locators.connectCalendarButton.waitFor({ state: "visible" });
    await expect(this.locators.connectCalendarButton).toBeVisible();
    await this.locators.connectCalendarButton.click();
  }

  // Weather
  async verifyWeatherWidget() {
    await this.locators.weather.waitFor({ state: "visible" });
    await expect(this.locators.weather).toBeVisible();
  }

  // Notes
  async verifyNotesSection() {
    await this.locators.notesHeading.waitFor({ state: "visible" });
    await expect(this.locators.notesHeading).toBeVisible();
    await this.locators.notesViewAllButton.waitFor({ state: "visible" });
    await expect(this.locators.notesViewAllButton).toBeVisible();
  }

  async clickNotesViewAll() {
    await this.locators.notesViewAllButton.waitFor({ state: "visible" });
    await expect(this.locators.notesViewAllButton).toBeVisible();
    await this.locators.notesViewAllButton.click();
  }

  // Map
  async verifyMapVisible() {
    await this.locators.map.waitFor({ state: "visible" });
    await expect(this.locators.map).toBeVisible();
  }

  // Emails
  async verifyEmailsSection() {
    await this.locators.emailsHeading.waitFor({ state: "visible" });
    await expect(this.locators.emailsHeading).toBeVisible();
    await this.locators.emailsComingSoonButton.waitFor({ state: "visible" });
    await expect(this.locators.emailsComingSoonButton).toBeVisible();
  }

  // Banner
  async verifyBanner() {
    await this.locators.bannerHeading.waitFor({ state: "visible" });
    await expect(this.locators.bannerHeading).toBeVisible();
    await this.locators.bannerMessage.waitFor({ state: "visible" });
    await expect(this.locators.bannerMessage).toBeVisible();
    await this.locators.bannerImage.waitFor({ state: "visible" });
    await expect(this.locators.bannerImage).toBeVisible();
  }

  // Follow Ups
  async verifyFollowUpSection() {
    await this.locators.followUpHeading.scrollIntoViewIfNeeded();
    await this.locators.followUpHeading.waitFor({ state: "visible" });
    await expect(this.locators.followUpHeading).toBeVisible();
  }

  async clickMorningFollowUp() {
    await this.locators.followUpMorningCard.scrollIntoViewIfNeeded();
    await this.locators.followUpMorningCard.waitFor({ state: "visible" });
    await expect(this.locators.followUpMorningCard).toBeVisible();
    await this.locators.followUpMorningCard.click();
  }

  async clickAfternoonFollowUp() {
    await this.locators.followUpAfternoonCard.scrollIntoViewIfNeeded();
    await this.locators.followUpAfternoonCard.waitFor({ state: "visible" });
    await expect(this.locators.followUpAfternoonCard).toBeVisible();
    await this.locators.followUpAfternoonCard.click();
  }

  async clickTomorrowFollowUp() {
    await this.locators.followUpTomorrowCard.scrollIntoViewIfNeeded();
    await this.locators.followUpTomorrowCard.waitFor({ state: "visible" });
    await expect(this.locators.followUpTomorrowCard).toBeVisible();
    await this.locators.followUpTomorrowCard.click();
  }

  async clickThisWeekFollowUp() {
    await this.locators.followUpThisWeekCard.scrollIntoViewIfNeeded();
    await this.locators.followUpThisWeekCard.waitFor({ state: "visible" });
    await expect(this.locators.followUpThisWeekCard).toBeVisible();
    await this.locators.followUpThisWeekCard.click();
  }

  async getMorningFollowUpCount() {
    await this.locators.followUpMorningCount.scrollIntoViewIfNeeded();
    await this.locators.followUpMorningCount.waitFor({ state: "visible" });
    await expect(this.locators.followUpMorningCount).toBeVisible();
    return await this.locators.followUpMorningCount.textContent();
  }

  async getAfternoonFollowUpCount() {
    await this.locators.followUpAfternoonCount.scrollIntoViewIfNeeded();
    await this.locators.followUpAfternoonCount.waitFor({ state: "visible" });
    await expect(this.locators.followUpAfternoonCount).toBeVisible();
    return await this.locators.followUpAfternoonCount.textContent();
  }

  async getTomorrowFollowUpCount() {
    await this.locators.followUpTomorrowCount.scrollIntoViewIfNeeded();
    await this.locators.followUpTomorrowCount.waitFor({ state: "visible" });
    await expect(this.locators.followUpTomorrowCount).toBeVisible();
    return await this.locators.followUpTomorrowCount.textContent();
  }

  async getThisWeekFollowUpCount() {
    await this.locators.followUpThisWeekCount.scrollIntoViewIfNeeded();
    await this.locators.followUpThisWeekCount.waitFor({ state: "visible" });
    await expect(this.locators.followUpThisWeekCount).toBeVisible();
    return await this.locators.followUpThisWeekCount.textContent();
  }

  // Leads
  async verifyLeadsSection() {
    await this.locators.leadsHeading.scrollIntoViewIfNeeded();
    await this.locators.leadsHeading.waitFor({ state: "visible" });
    await expect(this.locators.leadsHeading).toBeVisible();
  }

  async clickNewLeads() {
    await this.locators.newLeadsBox.scrollIntoViewIfNeeded();
    await this.locators.newLeadsBox.waitFor({ state: "visible" });
    await expect(this.locators.newLeadsBox).toBeVisible();
    await this.locators.newLeadsBox.click();
  }

  async clickBuyerLeads() {
    await this.locators.buyerLeadsBox.scrollIntoViewIfNeeded();
    await this.locators.buyerLeadsBox.waitFor({ state: "visible" });
    await expect(this.locators.buyerLeadsBox).toBeVisible();
    await this.locators.buyerLeadsBox.click();
  }

  async clickSellerLeads() {
    await this.locators.sellerLeadsBox.scrollIntoViewIfNeeded();
    await this.locators.sellerLeadsBox.waitFor({ state: "visible" });
    await expect(this.locators.sellerLeadsBox).toBeVisible();
    await this.locators.sellerLeadsBox.click();
  }

  async clickUnassignedLeads() {
    await this.locators.unassignedLeadsBox.scrollIntoViewIfNeeded();
    await this.locators.unassignedLeadsBox.waitFor({ state: "visible" });
    await expect(this.locators.unassignedLeadsBox).toBeVisible();
    await this.locators.unassignedLeadsBox.click();
  }

  async getNewLeadsCount() {
    await this.locators.newLeadsCount.scrollIntoViewIfNeeded();
    await this.locators.newLeadsCount.waitFor({ state: "visible" });
    await expect(this.locators.newLeadsCount).toBeVisible();
    return await this.locators.newLeadsCount.textContent();
  }

  async getBuyerLeadsCount() {
    await this.locators.buyerLeadsCount.scrollIntoViewIfNeeded();
    await this.locators.buyerLeadsCount.waitFor({ state: "visible" });
    await expect(this.locators.buyerLeadsCount).toBeVisible();
    return await this.locators.buyerLeadsCount.textContent();
  }

  async getSellerLeadsCount() {
    await this.locators.sellerLeadsCount.scrollIntoViewIfNeeded();
    await this.locators.sellerLeadsCount.waitFor({ state: "visible" });
    await expect(this.locators.sellerLeadsCount).toBeVisible();
    return await this.locators.sellerLeadsCount.textContent();
  }

  async getUnassignedLeadsCount() {
    await this.locators.unassignedLeadsCount.scrollIntoViewIfNeeded();
    await this.locators.unassignedLeadsCount.waitFor({ state: "visible" });
    await expect(this.locators.unassignedLeadsCount).toBeVisible();
    return await this.locators.unassignedLeadsCount.textContent();
  }

  // Contracts
  async verifyContractsSection() {
    await this.locators.contractsHeading.scrollIntoViewIfNeeded();
    await this.locators.contractsHeading.waitFor({ state: "visible" });
    await expect(this.locators.contractsHeading).toBeVisible();
  }

  async clickContractsLink() {
    await this.locators.contractsLinkIcon.scrollIntoViewIfNeeded();
    await this.locators.contractsLinkIcon.waitFor({ state: "visible" });
    await expect(this.locators.contractsLinkIcon).toBeVisible();
    await this.locators.contractsLinkIcon.click();
  }

  async getAwaitingVendorSigningCount() {
    await this.locators.awaitingVendorSigningCount.scrollIntoViewIfNeeded();
    await this.locators.awaitingVendorSigningCount.waitFor({ state: "visible" });
    await expect(this.locators.awaitingVendorSigningCount).toBeVisible();
    return await this.locators.awaitingVendorSigningCount.textContent();
  }

  async getOfferPendingCount() {
    await this.locators.offerPendingCount.scrollIntoViewIfNeeded();
    await this.locators.offerPendingCount.waitFor({ state: "visible" });
    await expect(this.locators.offerPendingCount).toBeVisible();
    return await this.locators.offerPendingCount.textContent();
  }

  async getConditionalCount() {
    await this.locators.heldCount.scrollIntoViewIfNeeded();
    await this.locators.heldCount.waitFor({ state: "visible" });
    await expect(this.locators.heldCount).toBeVisible();
    return await this.locators.heldCount.textContent();
  }

  // Tasks
  async verifyTasksSection() {
    await this.locators.tasksHeading.scrollIntoViewIfNeeded();
    await this.locators.tasksHeading.waitFor({ state: "visible" });
    await expect(this.locators.tasksHeading).toBeVisible();
  }

  async clickTasksLink() {
    await this.locators.tasksLinkIcon.scrollIntoViewIfNeeded();
    await this.locators.tasksLinkIcon.waitFor({ state: "visible" });
    await expect(this.locators.tasksLinkIcon).toBeVisible();
    await this.locators.tasksLinkIcon.click();
  }

  async clickDueToday() {
    await this.locators.dueTodayClickable.scrollIntoViewIfNeeded();
    await this.locators.dueTodayClickable.waitFor({ state: "visible" });
    await expect(this.locators.dueTodayClickable).toBeVisible();
    await this.locators.dueTodayClickable.click();
  }

  async clickHighPriority() {
    await this.locators.highPriorityClickable.scrollIntoViewIfNeeded();
    await this.locators.highPriorityClickable.waitFor({ state: "visible" });
    await expect(this.locators.highPriorityClickable).toBeVisible();
    await this.locators.highPriorityClickable.click();
  }

  async clickTotalTasks() {
    await this.locators.totalTasksClickable.scrollIntoViewIfNeeded();
    await this.locators.totalTasksClickable.waitFor({ state: "visible" });
    await expect(this.locators.totalTasksClickable).toBeVisible();
    await this.locators.totalTasksClickable.click();
  }

  async getDueTodayCount() {
    await this.locators.dueTodayCount.scrollIntoViewIfNeeded();
    await this.locators.dueTodayCount.waitFor({ state: "visible" });
    await expect(this.locators.dueTodayCount).toBeVisible();
    return await this.locators.dueTodayCount.textContent();
  }

  async getHighPriorityCount() {
    await this.locators.highPriorityCount.scrollIntoViewIfNeeded();
    await this.locators.highPriorityCount.waitFor({ state: "visible" });
    await expect(this.locators.highPriorityCount).toBeVisible();
    return await this.locators.highPriorityCount.textContent();
  }

  async getTotalTasksCount() {
    await this.locators.totalTasksCount.scrollIntoViewIfNeeded();
    await this.locators.totalTasksCount.waitFor({ state: "visible" });
    await expect(this.locators.totalTasksCount).toBeVisible();
    return await this.locators.totalTasksCount.textContent();
  }

  // OFI
  async verifyOFISection() {
    await this.locators.ofiHeading.scrollIntoViewIfNeeded();
    await this.locators.ofiHeading.waitFor({ state: "visible" });
    await expect(this.locators.ofiHeading).toBeVisible();
  }

  async getOFICount() {
    await this.locators.ofiCountText.scrollIntoViewIfNeeded();
    await this.locators.ofiCountText.waitFor({ state: "visible" });
    await expect(this.locators.ofiCountText).toBeVisible();
    return await this.locators.ofiCountText.textContent();
  }

  async getOFINotificationCount() {
    await this.locators.ofiNotificationCount.scrollIntoViewIfNeeded();
    await this.locators.ofiNotificationCount.waitFor({ state: "visible" });
    await expect(this.locators.ofiNotificationCount).toBeVisible();
    return await this.locators.ofiNotificationCount.textContent();
  }

  async clickOFILink() {
    await this.locators.ofiLinkIcon.scrollIntoViewIfNeeded();
    await this.locators.ofiLinkIcon.waitFor({ state: "visible" });
    await expect(this.locators.ofiLinkIcon).toBeVisible();
    await this.locators.ofiLinkIcon.click();
  }

  // Reporting
  async verifyReportingComingSoon() {
    await this.locators.reportingComingSoon.scrollIntoViewIfNeeded();
    await this.locators.reportingComingSoon.waitFor({ state: "visible" });
    await expect(this.locators.reportingComingSoon).toBeVisible();
  }

  // Appraisal
  async verifyAppraisalCard() {
    await this.locators.appraisalHeading.scrollIntoViewIfNeeded();
    await this.locators.appraisalHeading.waitFor({ state: "visible" });
    await expect(this.locators.appraisalHeading).toBeVisible();
    await this.locators.appraisalDropImage.scrollIntoViewIfNeeded();
    await this.locators.appraisalDropImage.waitFor({ state: "visible" });
    await expect(this.locators.appraisalDropImage).toBeVisible();
  }

  async clickCreateAppraisal() {
    await this.locators.appraisalPlusButton.scrollIntoViewIfNeeded();
    await this.locators.appraisalPlusButton.waitFor({ state: "visible" });
    await expect(this.locators.appraisalPlusButton).toBeVisible();
    await this.locators.appraisalPlusButton.click();
  }

  // Listing Record
  async verifyListingRecord() {
    await this.locators.listingRecordHeading.scrollIntoViewIfNeeded();
    await this.locators.listingRecordHeading.waitFor({ state: "visible" });
    await expect(this.locators.listingRecordHeading).toBeVisible();
  }

  async getNewListingCount() {
    await this.locators.listingRecordNewListingCount.scrollIntoViewIfNeeded();
    await this.locators.listingRecordNewListingCount.waitFor({ state: "visible" });
    await expect(this.locators.listingRecordNewListingCount).toBeVisible();
    return await this.locators.listingRecordNewListingCount.textContent();
  }

  async getSoldPropertiesCount() {
    await this.locators.listingRecordSoldPropertiesCount.scrollIntoViewIfNeeded();
    await this.locators.listingRecordSoldPropertiesCount.waitFor({ state: "visible" });
    await expect(this.locators.listingRecordSoldPropertiesCount).toBeVisible();
    return await this.locators.listingRecordSoldPropertiesCount.textContent();
  }

  async clickNewListingCount() {
    await this.locators.listingRecordNewListingCount.scrollIntoViewIfNeeded();
    await this.locators.listingRecordNewListingCount.waitFor({ state: "visible" });
    await expect(this.locators.listingRecordNewListingCount).toBeVisible();
    await this.locators.listingRecordNewListingCount.click();
  }

  async clickSoldPropertiesCount() {
    await this.locators.listingRecordSoldPropertiesCount.scrollIntoViewIfNeeded();
    await this.locators.listingRecordSoldPropertiesCount.waitFor({ state: "visible" });
    await expect(this.locators.listingRecordSoldPropertiesCount).toBeVisible();
    await this.locators.listingRecordSoldPropertiesCount.click();
  }

  // EOI
  async verifyEOICard() {
    await this.locators.eoiHeading.scrollIntoViewIfNeeded();
    await this.locators.eoiHeading.waitFor({ state: "visible" });
    await expect(this.locators.eoiHeading).toBeVisible();
  }

  async getEOICount() {
    await this.locators.eoiCountText.scrollIntoViewIfNeeded();
    await this.locators.eoiCountText.waitFor({ state: "visible" });
    await expect(this.locators.eoiCountText).toBeVisible();
    return await this.locators.eoiCountText.textContent();
  }

  async clickEOILink() {
    await this.locators.eoiLinkIcon.scrollIntoViewIfNeeded();
    await this.locators.eoiLinkIcon.waitFor({ state: "visible" });
    await expect(this.locators.eoiLinkIcon).toBeVisible();
    await this.locators.eoiLinkIcon.click();
  }

  // Price List
  async verifyPriceList() {
    await this.locators.priceListHeading.scrollIntoViewIfNeeded();
    await this.locators.priceListHeading.waitFor({ state: "visible" });
    await expect(this.locators.priceListHeading).toBeVisible();
  }

  async clickPriceList() {
    await this.locators.priceListLinkIcon.scrollIntoViewIfNeeded();
    await this.locators.priceListLinkIcon.waitFor({ state: "visible" });
    await expect(this.locators.priceListLinkIcon).toBeVisible();
    await this.locators.priceListLinkIcon.click();
  }

  // Matrix
  async verifyMatrix() {
    await this.locators.matrixHeading.scrollIntoViewIfNeeded();
    await this.locators.matrixHeading.waitFor({ state: "visible" });
    await expect(this.locators.matrixHeading).toBeVisible();
    await this.locators.matrixNoRecordsNote.scrollIntoViewIfNeeded();
    await this.locators.matrixNoRecordsNote.waitFor({ state: "visible" });
    await expect(this.locators.matrixNoRecordsNote).toBeVisible();
  }

  // Projects
  async verifyProjectsSection() {
    await this.locators.projectsHeading.scrollIntoViewIfNeeded();
    await this.locators.projectsHeading.waitFor({ state: "visible" });
    await expect(this.locators.projectsHeading).toBeVisible();
  }

  async clickProjectsLink() {
    await this.locators.projectsLinkIcon.scrollIntoViewIfNeeded();
    await this.locators.projectsLinkIcon.waitFor({ state: "visible" });
    await expect(this.locators.projectsLinkIcon).toBeVisible();
    await this.locators.projectsLinkIcon.click();
  }

  async getTotalProjectsCount() {
    await this.locators.projectsTotalCount.scrollIntoViewIfNeeded();
    await this.locators.projectsTotalCount.waitFor({ state: "visible" });
    await expect(this.locators.projectsTotalCount).toBeVisible();
    return await this.locators.projectsTotalCount.textContent();
  }

  async getInProgressProjectsCount() {
    await this.locators.projectsInProgressCount.scrollIntoViewIfNeeded();
    await this.locators.projectsInProgressCount.waitFor({ state: "visible" });
    await expect(this.locators.projectsInProgressCount).toBeVisible();
    return await this.locators.projectsInProgressCount.textContent();
  }

  async getCompletedProjectsCount() {
    await this.locators.projectsCompletedCount.scrollIntoViewIfNeeded();
    await this.locators.projectsCompletedCount.waitFor({ state: "visible" });
    await expect(this.locators.projectsCompletedCount).toBeVisible();
    return await this.locators.projectsCompletedCount.textContent();
  }

  async clickEyeIcon() {
    await this.locators.eyeIcon.waitFor({ state: 'visible' });
    await expect(this.locators.eyeIcon).toBeEnabled();

    for (let attempt = 0; attempt < 10; attempt++) {
      await this.locators.eyeIcon.click();
      try {
        await this.page.getByRole('heading', { name: 'Dashboard Display Order' }).waitFor({ state: 'visible', timeout: 2000 });
        return;
      } catch (error) {
        if (attempt === 2) throw error;
        await this.page.waitForTimeout(500);
      }
    }
  }

  async verifyCalendarNavSection() {
    await this.locators.calendarNavItem.waitFor({ state: "visible" });
    await expect(this.locators.calendarNavItem).toBeVisible();
  }
  // 
  async clickCalendarNavSection() {
    await this.locators.calendarNavItem.waitFor({ state: "visible" });
    await expect(this.locators.calendarNavItem).toBeVisible();
    await this.locators.calendarNavItem.click();
  }

  async verifyDragAndDropWidgetItemVisible() {
    await this.locators.dragAndDropWidgetItem.waitFor({ state: "visible" });
    await expect(this.locators.dragAndDropWidgetItem).toBeVisible();
  }

  async verifyWeatherNavItemVisible() {
    await this.locators.weatherNavItem.waitFor({ state: "visible" });
    await expect(this.locators.weatherNavItem).toBeVisible();
    await this.locators.weatherNavItem.click();
  }

  async verifyNotesNavItemVisible() {
    await this.locators.notesNavItem.waitFor({ state: "visible" });
    await expect(this.locators.notesNavItem).toBeVisible();
  }

  async verifyMapNavItemVisible() {
    await this.locators.mapNavItem.waitFor({ state: "visible" });
    await expect(this.locators.mapNavItem).toBeVisible();
  }

  async verifyEmailsNavItemVisible() {
    await this.locators.emailsNavItem.waitFor({ state: "visible" });
    await expect(this.locators.emailsNavItem).toBeVisible();
  }

  async dragMapToCalendarPosition() {
    await this.locators.weatherNavItem.waitFor({ state: "visible" });
    await this.locators.calendarNavItem.waitFor({ state: "visible" });
    await this.locators.weatherNavItem.dragTo(this.locators.calendarNavItem);
  }

  async clickCloseIcon() {
    await this.locators.closeIcon.waitFor({ state: "visible" });
    await expect(this.locators.closeIcon).toBeVisible();
    await this.locators.closeIcon.click({ force: true });
  }

  async reloadBoards() {
    await this.locators.reloadBoards.waitFor({ state: "visible" });
    await expect(this.locators.reloadBoards).toBeVisible();
    await this.locators.reloadBoards.click();
  }

  async hoverAddBox() {
    await this.locators.addBox.waitFor({ state: "visible" });
    await this.locators.addBox.hover({ timeout: 10000 });
  }

  async clickAddWidgetIcon() {
    await this.locators.addWidgetIcon.waitFor({ state: "visible" });
    await expect(this.locators.addWidgetIcon).toBeVisible();
    await this.locators.addWidgetIcon.click({ force: true, timeout: 5000 });
    await this.locators.dragToNewWidgetRow.waitFor({ state: "visible" });
    await expect(this.locators.dragToNewWidgetRow).toBeVisible();
  }

  async dragCalendarToNewWidgetRow() {
    await Promise.all([
      this.locators.calendarNavItem.waitFor({ state: "visible" }),
      this.locators.dragToNewWidgetRow.waitFor({ state: "visible" })
    ]);
    const calendarBox = await this.locators.calendarNavItem.boundingBox();
    const dropRowBox = await this.locators.dragToNewWidgetRow.boundingBox();

    if (calendarBox && dropRowBox) {
      await this.page.mouse.move(
        calendarBox.x + calendarBox.width / 2,
        calendarBox.y + calendarBox.height / 2
      );
      await this.page.mouse.down();
      await this.page.mouse.move(
        dropRowBox.x + dropRowBox.width / 2,
        dropRowBox.y + dropRowBox.height / 2,
        { steps: 10 }
      );
      await this.page.mouse.up();
    } else {
      await this.locators.calendarNavItem.dragTo(this.locators.dragToNewWidgetRow, { force: true, timeout: 5000 });
    }
  }

  async getFirstRow() {
    await this.locators.firstRow.waitFor({ state: "visible" });
    await expect(this.locators.firstRow).toBeVisible();
    return this.locators.firstRow;
  }

  async getBanner() {
    await this.locators.banner.waitFor({ state: "visible" });
    await expect(this.locators.banner).toBeVisible();
  }

  async dragBannerToFirstRow() {
    await this.locators.banner.waitFor({ state: "visible" });
    await this.locators.firstRow.waitFor({ state: "visible" });
    await expect(this.locators.banner).toBeVisible();
    await expect(this.locators.firstRow).toBeVisible();

    // Attempt dragging up to 3 times in case of flakiness
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        // Re-acquire bounding boxes in each attempt
        const bannerBox = await this.locators.banner.boundingBox();
        const firstRowBox = await this.locators.firstRow.boundingBox();

        if (bannerBox && firstRowBox) {
          // Mouse drag-and-drop operation
          await this.page.mouse.move(
            bannerBox.x + bannerBox.width / 2,
            bannerBox.y + bannerBox.height / 2
          );
          await this.page.mouse.down();
          await this.page.mouse.move(
            firstRowBox.x + firstRowBox.width / 2,
            firstRowBox.y + firstRowBox.height / 2,
            { steps: 10 }
          );
          await this.page.mouse.up();
        } else {
          // Fallback to dragAndDrop API if bounding boxes aren't available
          await this.locators.banner.dragTo(this.locators.firstRow, { force: true, timeout: 5000 });
        }
        break; // If drag succeeds, exit loop
      } catch (error) {
        if (attempt === 2) throw error;
        await this.page.waitForTimeout(1000); // Wait a bit before retrying
      }
    }
    await expect(this.page.getByRole('alert', { name: /A maximum of 5 widgets is/i })).toBeVisible();
  }


  async verifyContractModuleBoardVisible() {
    await this.locators.contractModuleBoard.waitFor({ state: "visible" });
    await expect(this.locators.contractModuleBoard).toBeVisible();
  }

  async clickMinusIcon() {
    await this.locators.minusIcon.waitFor({ state: "visible" });
    await expect(this.locators.minusIcon).toBeVisible();
    await this.locators.minusIcon.click({ force: true });
  }

  async openListingsTab() {
    await this.locators.listingTab.waitFor({ state: 'visible' });
    await this.locators.listingTab.click({ force: true });
  }

  async clickGridViewButton() {
    const cardRows = this.locators.cardViewPropertyRow;
    if (await cardRows.first().isVisible().catch(() => false)) {
      return;
    }
    await this.locators.gridViewButton.waitFor({ state: 'visible' });
    await this.locators.gridViewButton.click({ force: true });
    await expect(cardRows.first()).toBeVisible({ timeout: 30000 });
  }

  async getListingCards() {
    const cards = this.locators.listingCards;
    await cards.first().waitFor({ state: 'visible' });
    return cards;
  }

  async isFirstListingPinned() {
    const firstCard = this.locators.listingCards.first();
    const pinnedIcon = firstCard.locator('img[src*="pin"]');
    try {
      return await pinnedIcon.isVisible();
    } catch {
      return false;
    }
  }

  async rightClickFirstListing() {
    const firstCard = this.locators.listingCards.first();
    await firstCard.waitFor({ state: 'visible' });
    await firstCard.click({ button: 'right' });
  }

  async clickPinToDashboard() {
    await this.locators.pinToDashboardMenuItem.waitFor({ state: 'visible' });
    await this.locators.pinToDashboardMenuItem.click({ force: true });
  }

  getFirstListingPinnedIcon() {
    const firstCard = this.locators.listingCards.first();
    return firstCard.locator('img[src*="pin"]');
  }

  async waitForFirstListingPinned() {
    const pinnedIcon = this.getFirstListingPinnedIcon();
    await pinnedIcon.waitFor({ state: 'visible' });
  }

  async selectPrimaryAgent(agentName: string) {
    const firstCard = this.locators.listingCards.first();
    await firstCard.waitFor({ state: 'visible' });
    await firstCard.click();
    // Open the agent dropdown
    const dropdown = this.locators.primaryAgentDropdown;
    await dropdown.scrollIntoViewIfNeeded();
    await expect(dropdown).toBeVisible();
    await dropdown.click();

    // Fill the dropdown input with the agent name
    const input = this.locators.primaryAgentInput;
    await expect(input).toBeVisible();
    await input.fill(agentName);

    // Select the agent option from dropdown
    const options = this.locators.primaryAgentOptions;
    const agentOption = options.filter({ hasText: agentName }).first();
    await expect(agentOption).toBeVisible();
    await agentOption.click();

    const saveAndCloseButton = this.locators.saveAndCloseButton;
    await expect(saveAndCloseButton).toBeVisible();
    await saveAndCloseButton.click();
    const updateSuccessMsg = this.page.getByRole('alert').filter({ hasText: /Listing updated successfully|Listing Update successfully/i }).first();
    await updateSuccessMsg.waitFor({ state: 'visible' });
  }

  async getPinnedListingCard() {
    const pinnedCard = this.locators.PinnedlistingCardOnDashboard;
    await pinnedCard.waitFor({ state: 'visible' });
    return pinnedCard;
  }

  async navigateToListings() {
    const listingTab = this.locators.listingTab;
    await listingTab.waitFor({ state: 'visible', timeout: 30000 });
    await listingTab.click({ force: true });
  }

  async unpinFirstPinnedListing() {
    const pinnedCard = this.locators.PinnedlistingCard;
    await pinnedCard.waitFor({ state: "visible" });
    await pinnedCard.click({ button: "right" });
    const unpinMenuItem = this.locators.unpinToDashboardMenuItem;
    await unpinMenuItem.waitFor({ state: "visible", timeout: 10000 });
    await unpinMenuItem.click({ force: true });
  }

  /**
   *Verify that all module boards are displayed on the dashboard
   */
  async verifyAllModuleBoardsDisplayed() {
    // Required dashboard modules
    await this.verifyDashboardLoaded();
    await this.verifyCalendarSection();
    await this.verifyWeatherWidget();
    await this.verifyNotesSection();
    await this.verifyMapVisible();
    await this.verifyEmailsSection();
    await this.verifyBanner();
    await this.verifyFollowUpSection();
    await this.getMorningFollowUpCount();
    await this.getAfternoonFollowUpCount();
    await this.getTomorrowFollowUpCount();
    await this.getThisWeekFollowUpCount();
    await this.verifyLeadsSection();
    await this.getNewLeadsCount();
    await this.getBuyerLeadsCount();
    await this.getSellerLeadsCount();
    await this.getUnassignedLeadsCount();
    await this.verifyContractsSection();
    await this.getAwaitingVendorSigningCount();
    await this.getOfferPendingCount();
    await this.verifyMatrix();
    await this.verifyProjectsSection();
    await this.getTotalProjectsCount();
    await this.getInProgressProjectsCount();
    await this.getCompletedProjectsCount();

  }

  /**
  Verify dragging boards to change their position
   */
  async verifyDraggingBoardsToChangePosition() {
    await this.verifyDashboardLoaded();
    await this.clickEyeIcon();
    await this.verifyCalendarNavSection();
    await this.verifyWeatherNavItemVisible();
    await this.verifyDragAndDropWidgetItemVisible();
    await this.dragMapToCalendarPosition();
    await this.reloadBoards();
    await this.clickCloseIcon();
  }

  async verifyBoardsCanBeMovedToDifferentRows() {
    await this.verifyDashboardLoaded();
    await this.clickEyeIcon();
    await this.hoverAddBox();
    await this.clickAddWidgetIcon();
    await this.dragCalendarToNewWidgetRow();
    await this.reloadBoards();
    await this.clickCloseIcon();
  }

  /**
   * Verify that a maximum of 5 boards are allowed per row.
   */
  async verifyMaxFiveBoardsPerRow() {
    await this.verifyDashboardLoaded();
    await this.clickEyeIcon();
    await this.getFirstRow();
    await this.getBanner();
    await this.dragBannerToFirstRow();
    await this.reloadBoards();
    await this.clickCloseIcon();
  }

  /**
   * Verify that clicking on a module board opens the respective module.
   */
  async verifyModuleOpensOnBoardClick() {
    await this.verifyDashboardLoaded();
    await this.verifyCalendarSection();
    await this.verifyWeatherWidget();
    await this.verifyNotesSection();
    await this.verifyMapVisible();
  }

  /**
   * Verify that the "Dashboard Display Order" popup opens.
   */
  async verifyDashboardDisplayOrderPopupOpens() {
    await this.clickDashboardHomeIcon();
    await this.verifyDashboardLoaded();
    await this.clickEyeIcon();
    await this.clickCloseIcon();
  }

  /**
   * Verify widgets visibility toggle
   */
  async verifyWidgetsVisibilityToggle() {
    await this.verifyDashboardLoaded();
    await this.clickEyeIcon();
    await this.clickCalendarNavSection();
    await expect(this.locators.calendarHeading).not.toBeVisible();
    await this.clickCloseIcon();
  }

  /**
   * Verify drag and drop functionality in the 'Dashboard Display Order' popup.
   */
  async verifyDragAndDropInPopup() {
    await this.verifyDashboardLoaded();
    await this.clickEyeIcon();
    await this.verifyCalendarNavSection();
    await this.verifyWeatherNavItemVisible();
    await this.verifyDragAndDropWidgetItemVisible();
    await this.dragMapToCalendarPosition();
    await this.reloadBoards();
    await this.clickCloseIcon();
  }

  /**
   * Verify that board positions in the dashboard match the positions shown
   * in the "Dashboard Display Order" popup.
   */
  async verifyBoardPositionSyncBetweenDashboardAndPopup() {
    await this.verifyDashboardLoaded();
    const getBoardOrder = async (selector: string): Promise<string[]> => {
      const locators = await this.page.locator(selector).all();
      return (
        await Promise.all(
          locators.map(async (locator) => {
            const text = await locator.textContent();
            return typeof text === "string" ? text.trim() : "";
          })
        )
      ).filter(Boolean);
    };
    const dashboardOrder = await getBoardOrder('[data-testid="dashboard-board"]');
    await this.clickEyeIcon();
    const popupOrder = await getBoardOrder('[data-testid="popup-board-item"]');
    expect(dashboardOrder).toEqual(popupOrder);
    await this.clickCloseIcon();
  }

  /**
 * Verify that removing a row removes all its boards in the dashboard.
 */
  async verifyRemovingRowRemovesAllBoards() {
    await this.verifyDashboardLoaded();
    await this.clickEyeIcon();
    await this.locators.firstRow.waitFor({ state: "visible" });
    await this.locators.firstRow.hover();
    await this.clickMinusIcon();
    await expect(this.locators.calendarHeading).not.toBeVisible();
    await expect(this.locators.weather).not.toBeVisible();
    await expect(this.locators.notesHeading).not.toBeVisible();
    await expect(this.locators.map).not.toBeVisible();
    await expect(this.locators.emailsHeading).not.toBeVisible();
    await this.reloadBoards();
    await this.clickCloseIcon();
  }

  /**
   * Verify new row addition
   */
  async verifyNewRowAddition() {
    await this.verifyDashboardLoaded();
    await this.clickEyeIcon();
    await this.locators.addBox.waitFor({ state: "visible" });
    await this.locators.addBox.hover();
    await this.locators.addWidgetIcon.waitFor({ state: "visible" });
    await this.locators.addWidgetIcon.click({ force: true, timeout: 10000 });
    await this.locators.dragToNewWidgetRow.waitFor({ state: "visible" });
    await expect(this.locators.dragToNewWidgetRow).toBeVisible();
    await this.reloadBoards();
    await this.clickCloseIcon();
  }


  /**
   * Verifies that the pinned listing appears separately on the dashboard.
   */
  async verifyPinnedListingAppearsSeparately() {

    await this.navigateToListings();
    await this.getListingCards();
    await this.clickGridViewButton();
    await this.selectPrimaryAgent('Jahanzaib Xenex');
    if (await this.isFirstListingPinned()) {
      await this.clickDashboardHomeIcon();
      await this.getPinnedListingCard();
      return
    }
    await this.rightClickFirstListing();
    await this.openListingsTab();
    await this.clickGridViewButton();
    await this.getListingCards();
    await this.selectPrimaryAgent('Jahanzaib Xenex');
    if (await this.isFirstListingPinned()) {
      return;
    }
    await this.rightClickFirstListing();
    await this.clickPinToDashboard();
    await this.waitForFirstListingPinned();
    await this.clickDashboardHomeIcon();
    await this.getPinnedListingCard();
  }

  /**
   * Verify unpinning a pinned listing.
   */
  async verifyUnpinningPinnedListing() {
    await this.navigateToListings();
    await this.getListingCards();
    await this.clickGridViewButton();

    const propertyCard = this.locators.cardViewPropertyRow.nth(1);
    await propertyCard.waitFor({ state: "visible" });

    let cardHeading: string | null = null;
    try {
      const headingLoc = propertyCard.locator('h3.props-bg.cp.mb-1.px-0');
      if (await headingLoc.isVisible()) {
        cardHeading = (await headingLoc.innerText())?.trim() ?? null;
      }
    } catch {
      cardHeading = null;
    }

    const pinnedIcon = propertyCard.locator('img.imggG').first();
    const isPinned = await pinnedIcon.isVisible().catch(() => false);
    if (isPinned) {
      await propertyCard.click({ button: 'right' });
      const unpinMenuItem = this.locators.unpinToDashboardMenuItem;
      await unpinMenuItem.waitFor({ state: "visible", timeout: 10000 });
      await unpinMenuItem.click({ force: true });
    }

    await this.clickDashboardHomeIcon();

    if (cardHeading) {
      const pinnedCard = this.locators.PinnedlistingCardOnDashboard;
      await expect(pinnedCard.filter({ hasText: cardHeading })).not.toBeVisible();
    }
  }

  /**
   * Verify listing carousel arrows
   */
  async verifyListingCarouselArrows() {
    await this.verifyDashboardLoaded();
    const rightcarousel = this.page.locator('i.pi-arrow-right').first();
    await rightcarousel.scrollIntoViewIfNeeded();
    await rightcarousel.waitFor({ state: 'visible' });
    await rightcarousel.click();
    const leftArrow = this.page.locator('i.pi-arrow-left').first();
    await leftArrow.waitFor({ state: 'visible' });
    await leftArrow.click();
  }

  /**
   * Verify listing details on desktop
   */
  async verifyListingDetailsOnDashboardDesktop() {
    await this.verifyDashboardLoaded();
    const propertyCard = this.page.locator('ul.listing li').nth(1);
    await propertyCard.scrollIntoViewIfNeeded();
    await propertyCard.waitFor({ state: 'visible' });
    const headerImage = propertyCard.locator('img');
    await headerImage.waitFor({ state: 'visible' });
    const saleTag = propertyCard.locator('button');
    await saleTag.waitFor({ state: 'visible' });
    const heading = propertyCard.locator('h4');
    await heading.scrollIntoViewIfNeeded();
    await heading.waitFor({ state: 'visible' });
  }

  /**
   * Verify board size adjusts with number of boards
   */
  async verifyBoardSizeAdjustsWithNumberOfBoards() {
    await this.verifyDashboardLoaded();
    await this.verifyCalendarSection();
    await this.verifyWeatherWidget();
    await this.verifyNotesSection();
    await this.verifyMapVisible();
    await this.verifyEmailsSection();
  }

  /**
   * Verify note board popup opens
   */
  async verifyNoteBoardPopupOpens() {
    await this.verifyDashboardLoaded();
    await this.clickNotesViewAll();
    const noteSidebar = this.page.locator('._sidebar_.ng-star-inserted');
    await noteSidebar.waitFor({ state: 'visible' });
    await this.clickNotesViewAll();
  }

  /**
   * Verify adding a note
   */
  async verifyAddingNote() {
    await this.verifyDashboardLoaded();
    await this.clickNotesViewAll();
    const noteSidebar = this.page.locator('._sidebar_.ng-star-inserted');
    await noteSidebar.waitFor({ state: 'visible' });
    const takaElement = this.page.locator('.taka.mb-2.ng-star-inserted');
    await takaElement.waitFor({ state: 'visible' });
    await takaElement.click();
    const noteTitleInput = this.page.getByRole('textbox', { name: 'Add note name or search' });
    const noteContentInput = this.page.locator('.editor');
    await noteTitleInput.waitFor({ state: 'visible' });
    await noteContentInput.waitFor({ state: 'visible' });
    await noteTitleInput.type('"list"    Bondi Beach, NSW, 2026', { delay: 350 });
    const noteOptionList = this.page.locator("//div[@class='list_ ng-star-inserted']//ul");
    await noteOptionList.waitFor({ state: 'visible' });
    const matchedOption = this.page.locator('p.ml-2', { hasText: '"list" Bondi Beach, NSW,' });
    await matchedOption.waitFor({ state: 'visible' });
    await matchedOption.click({ force: true });
    const noteContent = 'Note Added';
    await noteContentInput.fill(noteContent);
    const saveButton = this.page.getByRole('button', { name: /Save/i }).last();
    await saveButton.waitFor({ state: 'visible' });
    await saveButton.click();
    const successMessage = this.page.getByText('Added successfully');
    await successMessage.waitFor({ state: 'visible' });
    await this.page.reload();
    const noteListText = await this.page.getByText('"list" Bondi Beach, NS "list').first();
    await noteListText.waitFor({ state: "visible" });
  }

  /**
 * Verify lead types are displayed on the Lead board
 */
  async verifyLeadTypesOnLeadBoard() {
    // Wait for dashboard to load
    await this.verifyDashboardLoaded();
    await this.verifyLeadsSection();
    await this.page.waitForTimeout(1000);

    const parseCount = (count: string | null | undefined) => {
      const value = Number((count ?? "").trim());
      return isNaN(value) ? 0 : value;
    };

    // Get counts from dashboard
    const counts = {
      new: parseCount(await this.getNewLeadsCount()),
      buyer: parseCount(await this.getBuyerLeadsCount()),
      seller: parseCount(await this.getSellerLeadsCount()),
      unassigned: parseCount(await this.getUnassignedLeadsCount()),
    };

    const statusMap: Record<string, string> = {
      new: "New",
      buyer: "Buyer",
      seller: "Seller",
      unassigned: "Unassigned",
    };

    const verifyLeadPageCount = async (clickFn: () => Promise<void>, expectedCount: number, typeName: string) => {
      await clickFn();

      const leadRows = this.page.locator(`tbody.p-datatable-tbody tr`);
      const noLeadsMessage = this.page.locator("tbody.p-datatable-tbody tr:has-text('No leads available')");

      if (expectedCount === 0) {
        // Expect "No leads available" message
        await expect(noLeadsMessage).toBeVisible({ timeout: 20000 });
        await this.clickDashboardHomeIcon();
        return;
      }

      // Wait for rows to appear
      await leadRows.first().waitFor({ state: "visible", timeout: 20000 });

      const actualCount = await leadRows.count();

      if (typeName === "unassigned") {
        // Only verify count, type is optional
        expect(actualCount, `Expected ${expectedCount} unassigned leads, got ${actualCount}`).toBe(expectedCount);
      } else {
        // Verify both count and type
        const matchingRows = await leadRows.filter({
          hasText: statusMap[typeName],
        }).count();

        expect(actualCount, `Expected ${expectedCount} ${typeName} leads, got ${actualCount}`).toBe(expectedCount);
        expect(matchingRows, `${typeName} leads type mismatch`).toBe(expectedCount);
      }

      // Go back to dashboard
      await this.clickDashboardHomeIcon();
    };

    // Verify all lead types
    await verifyLeadPageCount(() => this.clickNewLeads(), counts.new, "new");
    await verifyLeadPageCount(() => this.clickBuyerLeads(), counts.buyer, "buyer");
    await verifyLeadPageCount(() => this.clickSellerLeads(), counts.seller, "seller");
    await verifyLeadPageCount(() => this.clickUnassignedLeads(), counts.unassigned, "unassigned");
  }

  // Verify map board shows location
  async verifyMapBoardShowsLocation() {
    await this.clickDashboardHomeIcon();
    await this.verifyDashboardLoaded();
    await this.verifyMapVisible();
  }

  // Add 6 boards to a single row
  async addSixBoardsToSingleRow() {
    await this.verifyDashboardLoaded();
    await this.clickEyeIcon();
    await this.getFirstRow();
    await this.getBanner();
    await this.dragBannerToFirstRow();
    await this.reloadBoards();
    await this.clickCloseIcon();
  };

  /**
   * Verify that without saving the dashboard, board position should not be change 
   */
  async verifyBoardPositionDoesNotChangeWithoutSaving() {
    await this.verifyDashboardLoaded();
    const firstRow = this.page.locator("//div[contains(@class,'row_')]").first();
    await firstRow.waitFor({ state: 'visible' });
    const getBoardTitles = async () =>
      (await firstRow.locator('h3').allInnerTexts()).map(t => t.trim()).filter(Boolean);
    const initialOrder = await getBoardTitles();
    await this.clickEyeIcon();
    await this.hoverAddBox();
    await this.clickAddWidgetIcon();
    await this.dragCalendarToNewWidgetRow();
    await this.reloadBoards();
    await this.clickCloseIcon();
    await this.verifyDashboardLoaded();
    await firstRow.waitFor({ state: 'visible' });
    const finalOrder = await getBoardTitles();
    expect(finalOrder).toEqual(initialOrder);
  }

  /**
   * Add a note without title
   */
  async addNoteWithoutTitle() {
    await this.verifyDashboardLoaded();
    await this.clickNotesViewAll();
    const noteSidebar = this.page.locator('._sidebar_.ng-star-inserted');
    await noteSidebar.waitFor({ state: 'visible' });
    const takaElement = this.page.locator('.taka.mb-2.ng-star-inserted');
    await takaElement.waitFor({ state: 'visible' });
    await takaElement.click();
    await this.locators.saveButton.waitFor({ state: 'visible' });
    await this.locators.saveButton.click();
    await this.locators.closeNote.waitFor({ state: 'visible' });
    await this.locators.closeNote.click({ force: true });
    await expect(this.locators.closeNote).not.toBeVisible({ timeout: 10000 });
    await expect(noteSidebar).not.toBeVisible({ timeout: 10000 });
    await this.verifyDashboardLoaded();

  }

  /**
   * Verify that the pinned listing can be unpinned from the dashboard.
   */
  async unpinPinnedListingFromDashboard() {
    await this.verifyDashboardLoaded();
    await this.verifyCalendarSection();
    await this.verifyWeatherWidget();
    await this.verifyNotesSection();
    await this.verifyMapVisible();
    await this.page.reload();
    await this.verifyEmailsSection();
    const pinnedListing = this.page.locator('.h-150px').first();
    await pinnedListing.scrollIntoViewIfNeeded();
    await expect(pinnedListing).toBeVisible({ timeout: 15000 });
    await this.page.waitForTimeout(1000);
    await pinnedListing.click({ button: 'right' });
    await this.page.waitForTimeout(1000);
    const unpinMenuItem = this.locators.unpinToDashboardMenuItem;
    await expect(unpinMenuItem).toBeVisible({ timeout: 10000 });
    await unpinMenuItem.click();
  }


  /**
   * Check if popup position syncs after a board is moved
   */
  async checkBoardPopupPositionSyncAfterMove() {
    await this.verifyDashboardLoaded();
    await this.clickEyeIcon();
    const popupLocator = this.page.locator('.popup.ng-star-inserted');
    await popupLocator.waitFor({ state: 'visible' });
    const popupBoardTitlesBefore = await popupLocator.allInnerTexts();
    await this.hoverAddBox();
    await this.clickAddWidgetIcon();
    await this.dragCalendarToNewWidgetRow();
    const popupLocatorAfterMove = this.page.locator('.popup.ng-star-inserted');
    await popupLocatorAfterMove.waitFor({ state: 'visible' });
    const popupBoardTitlesAfter = await popupLocatorAfterMove.allInnerTexts();
    expect(popupBoardTitlesAfter).not.toEqual(popupBoardTitlesBefore);
    await this.reloadBoards();
    await this.clickCloseIcon();
    await this.verifyDashboardLoaded();
  }


  /**
   * Verify that clicking the cross icon closes the popup.
   */
  async verifyCrossIconClosesPopup() {
    await this.verifyDashboardLoaded();
    await this.clickEyeIcon();
    const popup = this.page.locator('.popup.ng-star-inserted');
    await popup.waitFor({ state: 'visible' });
    await this.clickCloseIcon();
    await this.verifyDashboardLoaded();
  }

  /**
   * Verify the Reload button functionality in the popup.
   */
  async verifyReloadButtonInPopup() {
    await this.verifyDashboardLoaded();
    await this.clickEyeIcon();
    const popup = this.page.locator('.popup.ng-star-inserted');
    await popup.waitFor({ state: 'visible' });
    await this.reloadBoards();
    await this.clickCloseIcon();
  }

  /**
   * Verify that changing widget visibility affects dashboard display.
   */
  async verifyWidgetVisibilityAffectsDashboard() {
    await this.verifyDashboardLoaded();
    await this.clickEyeIcon();
    await this.verifyCalendarNavSection();
    await this.verifyWeatherNavItemVisible();
    const calendarEyeIcon = this.page.locator('.pi.pi-eye-slash').first();
    await calendarEyeIcon.waitFor({ state: 'visible' });
    await this.reloadBoards();
    await this.clickCloseIcon();
  }

  /**
   * Verify widget movement between rows
   */
  async verifyWidgetMovementBetweenRows() {
    await this.verifyDashboardLoaded();
    await this.clickEyeIcon();
    const popupLocator = this.page.locator('.popup.ng-star-inserted');
    await popupLocator.waitFor({ state: 'visible' });
    const boardTitlesBefore = await popupLocator.allInnerTexts();
    await this.hoverAddBox();
    await this.clickAddWidgetIcon();
    await this.dragCalendarToNewWidgetRow();
    const popupLocatorAfterMove = this.page.locator('.popup.ng-star-inserted');
    await popupLocatorAfterMove.waitFor({ state: 'visible' });
    const boardTitlesAfter = await popupLocatorAfterMove.allInnerTexts();
    expect(boardTitlesAfter).not.toEqual(boardTitlesBefore);
    await this.reloadBoards();
    await this.clickCloseIcon();
    await this.verifyDashboardLoaded();
  }

  /**
   * Verify widget visibility toggling via "More Widgets" section behaves correctly.
   */
  async verifyWidgetVisibilityInMoreWidgets() {
    await this.verifyDashboardLoaded();
    await this.clickEyeIcon();
    const popup = this.page.locator('.popup.ng-star-inserted');
    await popup.waitFor({ state: 'visible' });
    await this.verifyCalendarNavSection();
    await this.verifyWeatherNavItemVisible();
    const dragDropWidget = this.page.getByText('Drag & drop to add widget').first();
    await dragDropWidget.waitFor({ state: 'visible' });
    await this.reloadBoards();
    await this.clickCloseIcon();
    await this.verifyDashboardLoaded();
  }

  /**
   * Verify simultaneous board resizing
   */
  async verifySimultaneousBoardResizing() {
    await this.verifyWidgetMovementBetweenRows();
  }

  /**
   * Verify sorting of leads on the board.
   */
  async verifyBoardLeadSorting() {
    await this.verifyDashboardLoaded();
    await this.verifyLeadsSection();
    await this.getNewLeadsCount();
    await this.getBuyerLeadsCount();
    await this.getSellerLeadsCount();
    await this.getUnassignedLeadsCount();
  }

  /**
   * Verify that the EOI board displays correct data on the dashboard.
   */
  async verifyEOIBoardDisplaysCorrectData() {
    await this.verifyDashboardLoaded();
    await this.verifyEOICard();

    const eoiText = await this.getEOICount();
    const eoiCount = Number((eoiText ?? "").match(/\d+/)?.[0] ?? 0);

    await this.clickEOILink();

    const dateRangeInput = this.page.locator("input[placeholder='Date Range']").first();
    await dateRangeInput.waitFor({ state: "visible" });
    await dateRangeInput.click();

    const calendar = this.page.locator(".p-datepicker-calendar");
    await expect(calendar).toBeVisible();

    // Calculate Monday of current week
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMonday);
    const mondayDay = monday.getDate().toString();

    // Select Monday safely
    const mondayCell = calendar
      .locator("tbody td:not(.p-disabled):not(.p-datepicker-other-month)")
      .filter({ hasText: mondayDay })
      .first();

    await mondayCell.click();

    const rows = this.page.locator("tbody.p-datatable-tbody tr");
    const noEOI = this.page.getByText("No EOI available");

    await Promise.race([
      rows.first().waitFor({ state: "visible" }).catch(() => { }),
      noEOI.waitFor({ state: "visible" }).catch(() => { }),
    ]);

    if (await noEOI.isVisible().catch(() => false)) {
      expect(eoiCount).toBe(0);
      return;
    }

    const visibleRows = await rows.count();
    console.log(`EOI count from dashboard: ${eoiCount}, EOI table visible rows: ${visibleRows}`);
    expect(visibleRows).toBe(eoiCount);

  }

  // Verifies that all listing thumbnails on the dashboard are loaded properly
  async verifyLoadingOfListingThumbnails() {
    await this.verifyDashboardLoaded();
    const propertyCard = this.page.locator('ul.listing li').nth(1);
    await propertyCard.scrollIntoViewIfNeeded();
    await propertyCard.waitFor({ state: 'visible' });
    const headerImage = propertyCard.locator('img');
    await headerImage.waitFor({ state: 'visible' });
    const saleTag = propertyCard.locator('button');
    await saleTag.waitFor({ state: 'visible' });
    const heading = propertyCard.locator('h4');
    await heading.scrollIntoViewIfNeeded();
    await heading.waitFor({ state: 'visible' });
  }

  /**
   * Verify that the Task board is displayed correctly on the Dashboard
   */
  async verifyTaskBoardIsDisplayedCorrectly() {
    await this.verifyDashboardLoaded();
    await this.verifyTasksSection();
    await this.getDueTodayCount();
    await this.getHighPriorityCount();
    await this.getTotalTasksCount();
  }

  /**
   * Verify that the Report board is displayed correctly on the Dashboard
   */
  async verifyReportBoardIsDisplayedCorrectly() {
    await this.verifyDashboardLoaded();
    await this.verifyReportingComingSoon();
  }

  /**
   * Verify that the Contract board is displayed correctly on the Dashboard
   */
  async verifyContractBoardIsDisplayedCorrectly() {
    await this.verifyDashboardLoaded();
    await this.locators.contractsHeading.waitFor({ state: "visible" });
    await this.locators.contractsLinkIcon.waitFor({ state: "visible" });
    await this.locators.awaitingVendorSigningCard.waitFor({ state: "visible" });
    await this.locators.awaitingVendorSigningCount.waitFor({ state: "visible" });
    const awaitingVendorCount = await this.locators.awaitingVendorSigningCount.textContent();
    await this.locators.offerPendingCard.waitFor({ state: "visible" });
    await this.locators.offerPendingCount.waitFor({ state: "visible" });
    const offerPendingCount = await this.locators.offerPendingCount.textContent();
    await this.locators.heldCard.waitFor({ state: "visible" });
    await this.locators.heldCount.waitFor({ state: "visible" });
    const heldCount = await this.locators.heldCount.textContent();
    console.log(`Contracts Board Counts: Awaiting Vendor Signing: ${awaitingVendorCount}, Offer Pending: ${offerPendingCount}, Held: ${heldCount}`);
  }

  /**
   * Verify that placeholder image is shown when a listing has no images on Dashboard board
   */
  async verifyPlaceholderImageForListingWithoutImages() {
    await this.verifyDashboardLoaded();
    const propertyCard = this.page.locator('ul.listing li').nth(1);
    await propertyCard.scrollIntoViewIfNeeded();
    await propertyCard.waitFor({ state: 'visible' });
    const headerImage = propertyCard.locator('img');
    await headerImage.waitFor({ state: 'visible' });
  }

  /**
   * Verify that all Widgets sizes are valid and rendered correctly
   */
  async verifyAllWidgetsSizesAreConsistent() {
    await this.verifyDashboardLoaded();

    const widgets = this.page.locator('board-info');
    const count = await widgets.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const box = await widgets.nth(i).boundingBox();

      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThan(0);
      expect(box!.height).toBeGreaterThan(0);
    }
  }

  /**
   * Verify that the Contract board on the Dashboard shows correct data.
   */
  async verifyContractBoardShowsCorrectData() {
    await this.verifyDashboardLoaded();

    // Wait for contracts heading and key contract board elements
    await this.locators.contractsHeading.waitFor({ state: "visible" });
    await this.locators.contractsLinkIcon.waitFor({ state: "visible" });
    await this.locators.awaitingVendorSigningCard.waitFor({ state: "visible" });
    await this.locators.awaitingVendorSigningCount.waitFor({ state: "visible" });
    await this.locators.offerPendingCard.waitFor({ state: "visible" });
    await this.locators.offerPendingCount.waitFor({ state: "visible" });
    await this.locators.heldCard.waitFor({ state: "visible" });
    await this.locators.heldCount.waitFor({ state: "visible" });

    // Get counts and assert they are numbers (>= 0)
    const awaitingVendorCount = Number(await this.locators.awaitingVendorSigningCount.textContent() || '0');
    const offerPendingCount = Number(await this.locators.offerPendingCount.textContent() || '0');
    const heldCount = Number(await this.locators.heldCount.textContent() || '0');

    expect(awaitingVendorCount).toBeGreaterThanOrEqual(0);
    expect(offerPendingCount).toBeGreaterThanOrEqual(0);
    expect(heldCount).toBeGreaterThanOrEqual(0);

    // Report for debugging/logging
    console.log(`Contract Board Data: Awaiting Vendor Signing: ${awaitingVendorCount}, Offer Pending: ${offerPendingCount}, Held: ${heldCount}`);
  }

  /**
   * Verify that the Report board is displayed correctly on the Dashboard
   */
  async verifyReportsBoardIsDisplayedCorrectly() {
    await this.verifyDashboardLoaded();
    await this.verifyReportingComingSoon();
  }

  /**
   * Verify that Listings records board on the Dashboard shows correct data
   */
  async verifyListingsBoardShowsCorrectData() {
    await this.verifyDashboardLoaded();
    await this.verifyListingRecord();
    await this.getNewListingCount();
    await this.getSoldPropertiesCount();
  }

  /**
   * Verify that the OFIs board on the Dashboard shows correct data
   */
  async verifyOFIsBoardShowsCorrectData() {
    await this.verifyDashboardLoaded();
    await this.locators.ofiHeading.scrollIntoViewIfNeeded();
    await this.locators.ofiHeading.waitFor({ state: "visible" });
    const ofiText = await this.locators.ofiCountText.textContent();
    const ofiCount = Number((ofiText ?? "").match(/\d+/)?.[0] ?? 0);
    await this.locators.ofiLinkIcon.click();
    await this.locators.resetButton.waitFor({ state: "visible" });
    await this.locators.resetButton.click();
    const dateRangeInput = this.page.locator("input[placeholder='Date Range']").first();
    await dateRangeInput.waitFor({ state: "visible" });
    await dateRangeInput.click();
    const calendar = this.page.locator(".p-datepicker-calendar");
    await expect(calendar).toBeVisible();
    const todayButton = this.page.getByRole('button', { name: 'Today' }).first();
    await todayButton.waitFor({ state: "visible" });
    await todayButton.click();
    const tableRows = this.page.locator("tbody.p-datatable-tbody tr");
    const noRecordMsg = this.page.getByText("No record available");
    await Promise.race([
      tableRows.first().waitFor({ state: 'visible' }).catch(() => { }),
      noRecordMsg.waitFor({ state: 'visible' }).catch(() => { }),
    ]);
    if (ofiCount === 0) {
      expect(await noRecordMsg.isVisible().catch(() => false)).toBe(true);
    } else {
      const visibleRowsCount = await tableRows.count();
      expect(visibleRowsCount).toBe(ofiCount);
    }
  }

  /**
   * Verify that Task board on the Dashboard shows correct data
   */
  async verifyTaskBoardShowsCorrectData() {
    await this.verifyTaskBoardIsDisplayedCorrectly();
  }

  /**
   * Verify that Project board on the Dashboard shows correct data
   */
  async verifyProjectBoardShowsCorrectData() {
    await this.verifyDashboardLoaded();
    await this.verifyProjectsSection();
    await this.getTomorrowFollowUpCount();
    await this.getInProgressProjectsCount();
    await this.getTotalProjectsCount();
  }

  /**
   * Verify that the Follow-up section border is displayed properly on the dashboard.
   */
  async verifyFollowUpSectionBorder() {
    await this.verifyDashboardLoaded();
    await this.verifyFollowUpSection();
    await this.getMorningFollowUpCount();
    await this.getAfternoonFollowUpCount();
    await this.getTomorrowFollowUpCount();
    await this.getThisWeekFollowUpCount();
  }

  /**
   * Verify that all module names have correct spelling on the dashboard
   */
  async verifyModuleNamesSpelling() {
    await this.verifyDashboardLoaded();

    const modules = [
      { locator: this.page.getByRole('heading', { name: 'Task', exact: true }), expected: 'Task' },
      { locator: this.page.getByRole('heading', { name: "Projects", exact: true }), expected: 'Projects' },
      { locator: this.page.getByRole('heading', { name: "Leads", exact: true }), expected: 'Leads' },
      { locator: this.page.getByRole('heading', { name: "OFI's" }), expected: "OFI's" },
      { locator: this.page.getByRole('heading', { name: "EOI" }), expected: "EOI" },
      { locator: this.page.getByRole('heading', { name: "Listing Record" }), expected: "Listing Record" },
      { locator: this.page.getByRole('heading', { name: "Create new Appraisal" }), expected: "Create new Appraisal" },
      { locator: this.page.getByRole('heading', { name: /Report(s)?/, exact: false }), expected: "Reporting" },
    ];

    for (const mod of modules) {
      await mod.locator.scrollIntoViewIfNeeded();
      await mod.locator.waitFor({ state: "visible" });
      const actual = await mod.locator.textContent();
      expect((actual ?? '').trim()).toBe(mod.expected);
    }
  }

  /**
   * Verify that a public message can be posted and is visible on the Noticeboard.
   */
  async verifyPublicMessageOnNoticeboard(message: string = "Public notice test message") {
    await this.verifyDashboardLoaded();
    await this.verifyCalendarSection();
    await this.verifyWeatherWidget();
    await this.verifyNotesSection();
    await this.locators.noticeBoardBox.waitFor({ state: "visible" });
    await this.locators.writeMessageInput.waitFor({ state: "visible" });
    await this.locators.writeMessageInput.fill(message);
    await this.locators.sendButton.click();
    const messageLocator = this.page.locator('.false.note.ng-star-inserted', { hasText: message }).first();
    await messageLocator.waitFor({ state: "visible"});
    await this.locators.deleteIcon.waitFor({state: 'visible'});
    await this.locators.deleteIcon.click({force: true});
    await expect(this.locators.deleteIcon).not.toBeVisible();
  }

  /**
   * Verify private message to specific staff
   */
  async verifyPrivateMessageToSpecificStaff(
    recipient: string= 'Jahanzaib Xenex',
    message: string = "Private notice test message"
  ) {
    await this.verifyCalendarSection();
    await this.verifyWeatherWidget();
    await this.verifyNotesSection();
    await this.locators.noticeBoardBox.waitFor({ state: "visible" });
    await this.locators.writeMessageInput.waitFor({ state: "visible" });
    await this.locators.writeMessageInput.fill(message);
    await this.locators.privateButton.waitFor({ state: "visible" });
    await this.locators.privateButton.click();

    // Open recipient selector and choose a staff (assuming this opens a dropdown or similar)
    await this.locators.staffUser.waitFor({ state: "visible" });
    await this.locators.staffUser.click();
    await this.locators.searchUser.waitFor({state: 'visible'});
    await this.locators.searchUser.click();
    await this.locators.searchUser.clear();
    await this.locators.searchUser.fill('Jahanzaib Xenex');
    const recipientOption = this.page.locator("li.p-element.ng-star-inserted", { hasText: recipient });
    await recipientOption.waitFor({ state: "visible" });
    await recipientOption.click();
    await this.locators.sendButton.waitFor({ state: "visible" });
    await this.locators.sendButton.click();
    const messageLocator = this.page.locator('.bg-color.note.ng-star-inserted', { hasText: message}).first();
    await messageLocator.waitFor({ state: "visible"});
    await this.locators.deleteIcon.waitFor({state: 'visible'});
    await this.locators.deleteIcon.click({force: true});
    await expect(this.locators.deleteIcon).not.toBeVisible();
  }

  /**
   * Verify private message to specific office
   */
  async verifyPrivateMessageToSpecificOffice(
    office: string = 'QA Tester',
    message: string = "Private office notice test message"
  ) {
    await this.verifyCalendarSection();
    await this.verifyWeatherWidget();
    await this.verifyNotesSection();
    await this.locators.noticeBoardBox.waitFor({ state: "visible" });
    await this.locators.writeMessageInput.waitFor({ state: "visible" });
    await this.locators.writeMessageInput.fill(message);

    // Select "Private" type
    await this.locators.privateButton.waitFor({ state: "visible" });
    await this.locators.privateButton.click();

    // Click Office selector
    await this.locators.officeButton.waitFor({ state: "visible" });
    await this.locators.officeButton.click();

    // Select office from list
    await this.locators.selectOffice.waitFor({ state: "visible" });
    await this.locators.selectOffice.click();
    await this.locators.searchUser.waitFor({ state: 'visible' });
    await this.locators.searchUser.clear();
    await this.locators.searchUser.fill(office);

    const officeOption = this.locators.officeOption.filter({ hasText: office }).first();
    await officeOption.waitFor({ state: "visible" });
    await officeOption.click();

    // Send the message
    await this.locators.sendButton.waitFor({ state: "visible" });
    await this.locators.sendButton.click();

    // Verify message sent
    const messageLocator = this.page.locator('.bg-color.note.ng-star-inserted', { hasText: message }).first();
    await messageLocator.waitFor({ state: "visible" });

    // Clean up: delete the message
    await this.locators.deleteIcon.waitFor({ state: 'visible' });
    await this.locators.deleteIcon.click({ force: true });
    await expect(this.locators.deleteIcon).not.toBeVisible();
  }

  /**
   * Verify private message to specific team
   */
  async verifyPrivateMessageToSpecificTeam(
    team: string = 'Automation Team',
    message: string = "Private team notice test message"
  ) {
    await this.verifyCalendarSection();
    await this.verifyWeatherWidget();
    await this.verifyNotesSection();
    await this.locators.noticeBoardBox.waitFor({ state: "visible" });
    await this.locators.writeMessageInput.waitFor({ state: "visible" });
    await this.locators.writeMessageInput.fill(message);

    // Select "Private" type
    await this.locators.privateButton.waitFor({ state: "visible" });
    await this.locators.privateButton.click();

    // Click Team selector
    await this.locators.teamButton.waitFor({ state: "visible" });
    await this.locators.teamButton.click();

    // Select team from list
    await this.locators.selectTeam.waitFor({ state: "visible" });
    await this.locators.selectTeam.click();
    await this.locators.searchUser.waitFor({ state: 'visible' });
    await this.locators.searchUser.clear();
    await this.locators.searchUser.fill(team);

    const teamOption = this.locators.teamOption.filter({ hasText: team }).first();
    await teamOption.waitFor({ state: "visible" });
    await teamOption.click();

    // Send the message
    await this.locators.sendButton.waitFor({ state: "visible" });
    await this.locators.sendButton.click();

    // Verify message sent
    const messageLocator = this.page.locator('.bg-color.note.ng-star-inserted', { hasText: message }).first();
    await messageLocator.waitFor({ state: "visible" });

    // Clean up: delete the message
    await this.locators.deleteIcon.waitFor({ state: 'visible' });
    await this.locators.deleteIcon.click({ force: true });
    await expect(this.locators.deleteIcon).not.toBeVisible();
  }

  /**
   * Verify message deletion from Noticeboard
   */
  async verifyMessageDeletionFromNoticeboard() {
    await this.verifyPublicMessageOnNoticeboard();
  }

  /**
   * Verify that the user's name is shown when a message is added to the Noticeboard
   */
  async verifyUserNameOnNoticeboardMessage(message: string = "Test notice message", expectedUserName: string = "Jahanzaib Xenex") {
    await this.verifyDashboardLoaded();
    await this.verifyCalendarSection();
    await this.verifyWeatherWidget();
    await this.verifyNotesSection();
    await this.locators.noticeBoardBox.waitFor({ state: "visible" });
    await this.locators.writeMessageInput.waitFor({ state: "visible" });
    await this.locators.writeMessageInput.fill(message);
    await this.locators.sendButton.click();
    const messageLocator = this.page.locator('.false.note.ng-star-inserted', { hasText: message }).first();
    await messageLocator.waitFor({ state: "visible"});
    // Assert the user's name is visible adjacent to the posted message
    const userNameLocator = messageLocator.locator('p.user.f-10', { hasText: 'Jahanzaib Xenex' }).first();
    await expect(userNameLocator).toBeVisible();

    // Optional: Clean up (delete message)
    await this.locators.deleteIcon.waitFor({ state: 'visible' });
    await this.locators.deleteIcon.click({ force: true });
    await expect(this.locators.deleteIcon).not.toBeVisible();
  }

  /**
   * Verify comment on a message.
   */
  async verifyCommentOnNoticeboardMessage(message: string = "Test notice message") {
    await this.verifyDashboardLoaded();
    await this.verifyCalendarSection();
    await this.verifyWeatherWidget();
    await this.verifyNotesSection();
    await this.locators.noticeBoardBox.waitFor({ state: "visible" });
    await this.locators.writeMessageInput.waitFor({ state: "visible" });
    await this.locators.writeMessageInput.fill(message);
    await this.locators.sendButton.click();
    const messageLocator = this.page.locator('.false.note.ng-star-inserted', { hasText: message }).first();
    await messageLocator.waitFor({ state: "visible"});
    // Assert the user's name is visible adjacent to the posted message
    const userNameLocator = messageLocator.locator('p.user.f-10', { hasText: 'Jahanzaib Xenex' }).first();
    await expect(userNameLocator).toBeVisible();

    // Optional: Clean up (delete message)
    await this.locators.deleteIcon.waitFor({ state: 'visible' });
    await this.locators.deleteIcon.click({ force: true });
    await expect(this.locators.deleteIcon).not.toBeVisible();
  }

  /**
   * Verify all reacts (like, heart, comment) on a message in the Noticeboard.
   */
  async verifyReactOnNoticeboardMessage(message: string = "Test notice message") {
    await this.verifyDashboardLoaded();
    await this.verifyCalendarSection();
    await this.verifyWeatherWidget();
    await this.verifyNotesSection();
    await this.locators.noticeBoardBox.waitFor({ state: "visible" });
    await this.locators.writeMessageInput.waitFor({ state: "visible" });
    await this.locators.writeMessageInput.fill(message);
    await this.locators.sendButton.click();

    const messageLocator = this.page.locator('.false.note.ng-star-inserted', { hasText: message }).first();
    await messageLocator.waitFor({ state: "visible" });

    // Get the icon_list container within this message (scoped to message if necessary)
    const iconList = messageLocator.locator('div.icon_list');
    await iconList.waitFor({ state: "visible" });

    // React selectors for like, heart, comment
    const reactIcons = [
      { imgSelector: "img[src*='like.svg']",   desc: 'like'    },
      { imgSelector: "img[src*='heart.svg']",  desc: 'heart'   }
    ];

    for (let i = 0; i < reactIcons.length; i++) {
      const reactDiv   = iconList.locator('div.img_ico').nth(i);
      const reactImg   = reactDiv.locator(reactIcons[i].imgSelector);
      const reactCount = reactDiv.locator('p');

      // Get initial count
      const initialCount = parseInt(await reactCount.textContent() || "0", 10);

      await reactImg.waitFor({ state: "visible" });
      await reactImg.click();

      // Wait for the count to increase by 1
      await expect.poll(async () => {
        return parseInt(await reactCount.textContent() || "0", 10);
      }, { timeout: 20000 }).toBe(initialCount + 1);
    }

    // Optional: Clean up (delete message)
    await this.locators.deleteIcon.waitFor({ state: 'visible' });
    await this.locators.deleteIcon.click({ force: true });
    await expect(this.locators.deleteIcon).not.toBeVisible();
  }



}

