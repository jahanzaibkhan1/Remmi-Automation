import { Page, Locator } from "@playwright/test";

export class DashboardLocator {
    constructor(private readonly page: Page) { }

    get dashboardHomeIcon(): Locator {
        return this.page.locator("img[src='assets/img/dashboadIcon/home.svg']");
    }

    get calendarHeading(): Locator {
        return this.page.getByRole("heading", { name: "Calendar", exact: true });
    }

    /** Unique 'View all' button under Calendar section */
    get calendarViewAllButton(): Locator {
        return this.page.locator('.viewAll.ng-star-inserted');
    }

    get connectCalendarButton(): Locator {
        return this.page.getByRole('button', { name: 'Connect Calendar' });
    }

    get weather(): Locator {
        return this.page.locator('.rain.day.ng-star-inserted');
    }

    get notesHeading(): Locator {
        return this.page.getByRole('heading', { name: 'Notes', exact: true });
    }

    get notesViewAllButton(): Locator {
        return this.page.locator("p.viewAll");
    }

    get map(): Locator {
        return this.page.locator('#map');
    }

    get emailsHeading(): Locator {
        return this.page.getByRole('heading', { name: 'Emails', exact: true });
    }

    get emailsComingSoonButton(): Locator {
        return this.page.getByRole("button", { name: 'Coming soon' });
    }

    get bannerHeading(): Locator {
        return this.page.locator("h2[class='zed']");
    }

    get bannerMessage(): Locator {
        return this.page.locator("p[class='zed']");
    }

    get bannerImage(): Locator {
        return this.page.locator("img[src='assets/img/dash/building.png']");
    }

    get followUpHeading(): Locator {
        return this.page.locator('.follow h3', { hasText: 'Follow up' });
    }

    get followUpMorningCard(): Locator {
        return this.page.locator('.foloow.up4.cursor-pointer');
    }

    get followUpAfternoonCard(): Locator {
        return this.page.locator('.foloow.up3.cursor-pointer');
    }

    get followUpTomorrowCard(): Locator {
        return this.page.locator('.foloow.up2.cursor-pointer');
    }

    get followUpThisWeekCard(): Locator {
        return this.page.locator('.foloow.up1.cursor-pointer');
    }

    get followUpMorningCount(): Locator {
        return this.followUpMorningCard.locator('p.ico.icon').first();
    }

    get followUpAfternoonCount(): Locator {
        return this.followUpAfternoonCard.locator('p.ico.icon').first();
    }

    get followUpTomorrowCount(): Locator {
        return this.followUpTomorrowCard.locator('p.ico.icon').first();
    }

    get followUpThisWeekCount(): Locator {
        return this.followUpThisWeekCard.locator('p.ico.icon').first();
    }

    // Locators for the "Leads" section boxes
    get leadsSection(): Locator {
        return this.page.locator('div.leads.mxw207px');
    }

    get leadsHeading(): Locator {
        return this.leadsSection.locator('h3.w.mb-3', { hasText: 'Leads' });
    }

    get newLeadsBox(): Locator {
        return this.leadsSection.locator('.lead_box', { hasText: 'New' });
    }

    get newLeadsCount(): Locator {
        return this.newLeadsBox.locator('.num');
    }

    get buyerLeadsBox(): Locator {
        return this.leadsSection.locator('.lead_box', { hasText: 'Buyer' });
    }

    get buyerLeadsCount(): Locator {
        return this.buyerLeadsBox.locator('.num');
    }

    get sellerLeadsBox(): Locator {
        return this.leadsSection.locator('.lead_box', { hasText: 'Seller' });
    }

    get sellerLeadsCount(): Locator {
        return this.sellerLeadsBox.locator('.num');
    }

    get unassignedLeadsBox(): Locator {
        return this.leadsSection.locator('.lead_box', { hasText: 'Unassigned' });
    }

    get unassignedLeadsCount(): Locator {
        return this.unassignedLeadsBox.locator('.num');
    }

    get leads(): Locator {
        return this.page.getByRole('heading', { name: 'Leads', exact: true });
    }

    get newLeadCard(): Locator {
        return this.page.locator('h3', { hasText: 'Leads' })
            .locator('xpath=following-sibling::div//div[p[normalize-space()="New"]]');
    }
    get newLeadCount(): Locator {
        return this.newLeadCard.locator('div.num');
    }

    get buyerLeadCard(): Locator {
        return this.page.locator('h3', { hasText: 'Leads' })
            .locator('xpath=following-sibling::div//div[p[normalize-space()="Buyer"]]');
    }
    get buyerLeadCount(): Locator {
        return this.buyerLeadCard.locator('div.num');
    }

    get sellerLeadCard(): Locator {
        return this.page.locator('h3', { hasText: 'Leads' })
            .locator('xpath=following-sibling::div//div[p[normalize-space()="Seller"]]');
    }
    get sellerLeadCount(): Locator {
        return this.sellerLeadCard.locator('div.num');
    }

    get unassignedLeadCard(): Locator {
        return this.page.locator('h3', { hasText: 'Leads' })
            .locator('xpath=following-sibling::div//div[p[normalize-space()="Unassigned"]]');
    }
    get unassignedLeadCount(): Locator {
        return this.unassignedLeadCard.locator('div.num');
    }
    get contractsHeading(): Locator {
        return this.page.getByRole('heading', { name: 'Contracts', exact: true });
    }
    get contractsLinkIcon(): Locator {
        return this.page.locator('div.contract').locator('div[routerlink="/contracts"]');
    }
    get awaitingVendorSigningCard(): Locator {
        return this.page.locator('p', { hasText: 'Awaiting Vendor Signing' }).locator('..');
    }
    get awaitingVendorSigningCount(): Locator {
        return this.awaitingVendorSigningCard.locator('h3.h33');
    }
    get offerPendingCard(): Locator {
        return this.page.locator('p', { hasText: 'Offer Pending' }).locator('..');
    }
    get offerPendingCount(): Locator {
        return this.offerPendingCard.locator('h3.h33');
    }
    get conditionalCard(): Locator {
        return this.page.locator('p', { hasText: 'Conditional' }).locator('..');
    }
    get conditionalCount(): Locator {
        return this.conditionalCard.locator('h3.h33');
    }

    get tasksHeading(): Locator {
        return this.page.getByRole('heading', { name: 'Task', exact: true });
    }
    get tasksLinkIcon(): Locator {
        return this.page.locator('div[routerlink="/tasks/my-tasks"]');
    }
    get dueTodayCard(): Locator {
        return this.page.locator('p', { hasText: 'Due Today' }).locator('..');
    }
    get dueTodayCount(): Locator {
        return this.dueTodayCard.locator('div.num');
    }
    get dueTodayClickable(): Locator {
        return this.dueTodayCard.locator('div.num | p');
    }

    get highPriorityCard(): Locator {
        return this.page.locator('p', { hasText: 'High Priority' }).locator('..');
    }
    get highPriorityCount(): Locator {
        return this.highPriorityCard.locator('div.num');
    }
    get highPriorityClickable(): Locator {
        return this.highPriorityCard.locator('div.num | p');
    }

    get totalTasksCard(): Locator {
        return this.page.locator('p', { hasText: 'Total Tasks' }).locator('..');
    }
    get totalTasksCount(): Locator {
        return this.totalTasksCard.locator('div.num');
    }
    get totalTasksClickable(): Locator {
        return this.totalTasksCard.locator('div.num | p');
    }

    get ofiHeading(): Locator {
        return this.page.getByRole('heading', { name: 'OFI\'s' });
    }

    get ofiCountText(): Locator {
        return this.page.locator('div.mxw120px.ofis p strong', { hasText: /\d+ OFIs/ });
    }

    get ofiNotificationCount(): Locator {
        return this.page.locator('div.mxw120px.ofis p.notify');
    }

    get ofiLinkIcon(): Locator {
        return this.page.locator('div.mxw120px.ofis div[routerlink="/ofi/ofi-list"]');
    }

    get reportingComingSoon(): Locator {
        return this.page.locator(".report.ng-star-inserted.mxw120px");
    }

    get appraisalCard(): Locator {
        return this.page.locator('div.appraisal.mxw120px.ng-star-inserted').first();
    }
    get appraisalHeading(): Locator {
        return this.appraisalCard.getByRole('heading', { name: 'Create new Appraisal' });
    }
    get appraisalDropImage(): Locator {
        return this.appraisalCard.locator('img[alt][src="assets/img/dash/drop.svg"]');
    }
    get appraisalPlusButton(): Locator {
        return this.page.locator('div.ico.icon.icon5[routerlink="/property/properties"][tabindex="0"]');
    }

    get listingRecordCard(): Locator {
        return this.page.locator('div.box_.flex_col.mxw120px.notes.prop.ng-star-inserted');
    }
    get listingRecordHeading(): Locator {
        return this.listingRecordCard.getByRole('heading', { name: 'Listing Record' });
    }
    get listingRecordNewListingCount(): Locator {
        return this.listingRecordCard.locator('div.note.property:has-text("New Listing") small');
    }
    get listingRecordSoldPropertiesCount(): Locator {
        return this.listingRecordCard.locator('div.note.property:has-text("Sold Properties") small');
    }

    get eoiCard(): Locator {
        return this.page.locator('div.appraisal.mxw120px.eoi.ng-star-inserted');
    }
    get eoiHeading(): Locator {
        return this.eoiCard.getByRole('heading', { name: 'EOI' });
    }
    get eoiCountText(): Locator {
        return this.eoiCard.locator('p strong', { hasText: /\d+ EOIs/ });
    }
    get eoiLinkIcon(): Locator {
        return this.eoiCard.locator('div.ico.icon.icon5[routerlink="/listings/listing-eoi"][tabindex="0"]');
    }

    get priceListCard(): Locator {
        return this.page.locator('div.box_.mxw213px.price_list.ng-star-inserted');
    }
    get priceListHeading(): Locator {
        return this.priceListCard.getByRole('heading', { name: 'Price-list' });
    }
    get priceListLinkIcon(): Locator {
        return this.priceListCard.locator('div.ico.icon.icon4[routerlink="/project/projects"][tabindex="0"]');
    }

    get matrixCard(): Locator {
        return this.page.locator('div.follow.mxw213px.matrix.ng-star-inserted');
    }
    get matrixHeading(): Locator {
        return this.matrixCard.getByRole('heading', { name: 'Matrix' });
    }
    get matrixNoRecordsNote(): Locator {
        return this.matrixCard.locator('div.note > p', { hasText: 'No Records' });
    }

    get projectsCard(): Locator {
        return this.page.locator('div.contract.mxw213px.project.ng-star-inserted');
    }
    get projectsHeading(): Locator {
        return this.projectsCard.getByRole('heading', { name: 'Projects' });
    }
    get projectsLinkIcon(): Locator {
        return this.projectsCard.locator('div.ico.icon.icon4[routerlink="/project/projects"][tabindex="0"]');
    }
    get projectsCompletedCount(): Locator {
        return this.projectsCard.locator('div.bo_x_ h3.h33').filter({
            has: this.page.locator('p.f-10', { hasText: 'Completed Projects' })
        });
    }
    get projectsTotalCount(): Locator {
        return this.projectsCard.locator('div.bo_x_.fv > div:has(p.f-10:has-text("Total")) > h3.h33');
    }
    get projectsInProgressCount(): Locator {
        return this.projectsCard.locator('div.bo_x_.fv > div:has(p.f-10:has-text("In Progress")) > h3.h33');
    }


}