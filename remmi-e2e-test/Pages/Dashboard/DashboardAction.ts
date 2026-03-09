import { Page, expect } from "@playwright/test";
import { DashboardLocator } from "./DashboardLocator";

export class DashboardAction {
  locators: DashboardLocator;

  constructor(public page: Page) {
    this.locators = new DashboardLocator(page);
  }

  async clickDashboardHomeIcon() {
    await this.locators.dashboardHomeIcon.waitFor({ state: "visible" });
    await expect(this.locators.dashboardHomeIcon).toBeVisible();
    await this.locators.dashboardHomeIcon.click({force: true});
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
    await this.locators.conditionalCount.scrollIntoViewIfNeeded();
    await this.locators.conditionalCount.waitFor({ state: "visible" });
    await expect(this.locators.conditionalCount).toBeVisible();
    return await this.locators.conditionalCount.textContent();
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
    await expect(this.locators.addBox).toBeVisible();
    await this.locators.addBox.hover({ timeout: 5000 });
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
    await this.verifyContractsSection();
    await this.clickContractsLink();
    await this.verifyContractModuleBoardVisible();
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

}