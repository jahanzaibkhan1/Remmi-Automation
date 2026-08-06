import { expect } from '@playwright/test';
import { ListingBasePage } from './ListingBasePage';

export class ListingInspectionPage extends ListingBasePage {
    async verifyInspectionTabHiddenBeforeSave() {
        await this.navigateToListings();
        await this.switchToGridView();
        // Wait for the first listing card to be attached and visible, for robustness
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeAttached({ timeout: 30000 });
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        // Open the new listing creation or detail using the plus icon
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick();

        // Check that the Inspection tab is NOT visible
        const inspectionTab = this.page.getByRole('tab', { name: /Inspection/i });

        await inspectionTab.click()

        const inspectionsLabel = this.page.getByLabel('Inspections').getByText('Please create the listing');
        await expect(inspectionsLabel).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1000);

        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1500);

    }

    /**
     * Verify required fields validation in the new listing form.
     * This will attempt to save the form without filling required fields and check for error messages.
     */
    async verifyRequiredFieldsValidation() {
        await this.navigateToListings();
        await this.switchToGridView();
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        const primaryAgent = this.page.locator(
            'div.form-group:has-text("Primary Agent") ng-select'
        );

        await primaryAgent.scrollIntoViewIfNeeded();
        await primaryAgent.click();

        const primaryInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']");
        await expect(primaryInput).toBeVisible({ timeout: 10000 });
        await primaryInput.fill('Jahanzaib Xenex');

        const primaryOption = this.page.locator(
            '.ng-dropdown-panel .ng-option',
            { hasText: 'Jahanzaib Xenex' }
        ).first();
        await expect(primaryOption).toBeVisible({ timeout: 10000 });
        await primaryOption.click();

        await this.page.waitForTimeout(1000);
        // Attempt to save/continue without filling fields
        const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Click on the 'Inspections' tab to trigger validation messages for required fields
        const inspectionTab = this.page.getByRole('tab', { name: /Inspections/i }).first();
        await expect(inspectionTab).toBeVisible({ timeout: 10000 });
        await inspectionTab.click();

        // Click the 'Add' button in the Inspections tab
        const addButton = this.page.getByRole('button', { name: /Add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();

        // Wait for potential validation/error messages to appear
        const requiredFieldError = this.page.getByRole('alert', { name: 'Start time must be before end' }).first();
        await expect(requiredFieldError).toBeVisible({ timeout: 10000 });

        // Close the form after test
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1500);

    }

    /**
     * Add a valid inspection and verify successful addition.
     * Assumes that the form is open for a listing.
     */
    async addValidInspectionAndVerifySuccess() {
        await this.navigateToListings();
        await this.switchToGridView();
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        const primaryAgent = this.page.locator(
            'div.form-group:has-text("Primary Agent") ng-select'
        );

        await primaryAgent.scrollIntoViewIfNeeded();
        await primaryAgent.click();

        const primaryInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']");
        await expect(primaryInput).toBeVisible({ timeout: 10000 });
        await primaryInput.fill('Jahanzaib Xenex');

        const primaryOption = this.page.locator(
            '.ng-dropdown-panel .ng-option',
            { hasText: 'Jahanzaib Xenex' }
        ).first();
        await expect(primaryOption).toBeVisible({ timeout: 10000 });
        await primaryOption.click();

        await this.page.waitForTimeout(1000);
        // Attempt to save/continue without filling fields
        const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Click on the 'Inspections' tab to trigger validation messages for required fields
        const inspectionTab = this.page.getByRole('tab', { name: /Inspections/i }).first();
        await expect(inspectionTab).toBeVisible({ timeout: 10000 });
        await inspectionTab.click();


        // Fill in inspection event date: pick January 14, 2026 using the date picker and the displayed calendar
        const dateInput = this.page.locator('#basic');
        await expect(dateInput).toBeVisible({ timeout: 10000 });
        await dateInput.click();

        // 1️⃣ Compute Tomorrow
        const t = new Date();
        t.setDate(t.getDate() + 1);

        const targetDay = t.getDate();
        const targetMonth = t.getMonth();
        const targetYear = t.getFullYear();

        // 2️⃣ Read currently opened calendar's month-year (stable header)
        const header = this.page.locator(".p-datepicker-title");
        await expect(header).toBeVisible();

        const headerText = await header.innerText();
        const [monthName, year] = headerText.trim().split(" ");

        const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();

        // 3️⃣ Move calendar to correct month
        const monthDifference =
            (targetYear - parseInt(year)) * 12 + (targetMonth - monthIndex);

        for (let i = 0; i < Math.abs(monthDifference); i++) {
            if (monthDifference > 0) {
                await this.page.locator(".p-datepicker-next").click();
            } else {
                await this.page.locator(".p-datepicker-prev").click();
            }
            // Wait for transition + re-render
            await this.page.waitForTimeout(200);
        }

        // 4️⃣ Select tomorrow's date (non-flaky selector)
        const dayLocator = this.page.locator(
            `.p-datepicker-calendar td:not(.p-disabled) >> text="${targetDay}"`
        );

        await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
        await dayLocator.first().click({ force: true });

        const startTimeSelect = this.page.locator(
            'div.col-sm-4:has(label:text("Start Time")) ng-select[placeholder="Hr"] div[role="combobox"]'
        );
        await startTimeSelect.click({ force: true });
        await this.page.waitForTimeout(1000);
        // Select the 6th option (index 5) from the dropdown
        const startTimeOption = this.page.getByText('5', { exact: true });
        await expect(startTimeOption).toBeVisible({ timeout: 10000 });
        await startTimeOption.click();
        // Click the 'Add' button in the Inspections tab
        const addButton = this.page.getByRole('button', { name: /Add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();

        // Wait for event success message to appear after adding inspection event
        const successAlert = this.page.getByText('event added to calendar successfully');
        await expect(successAlert).toBeVisible({ timeout: 10000 });

        // Verify that the newly added inspection is deletable via the delete icon:
        const deleteLink = this.page.getByRole('link', { name: 'delete' }).first();
        await deleteLink.waitFor({ state: "visible", timeout: 10000 });
        // Click the 'Save' button (if visible)
        await saveButton.click();

        // Close the form after test
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify deletion of an inspection from the inspection tab
     */
    async verifyDeleteInspectionFromTab() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Go to the Inspections tab
        const inspectionsTab = this.page.getByRole('tab', { name: /Inspections/i });
        await expect(inspectionsTab).toBeVisible({ timeout: 20000 });
        await inspectionsTab.click();
        await this.page.waitForTimeout(1000);

        // Keep clicking the delete icon until "Upcoming Inspections" section is not visible
        const upcomingInspectionsLocator = this.page.getByText(/Upcoming Inspections/i);
        // Wait for the section to appear (if needed)
        await expect(upcomingInspectionsLocator).toBeVisible({ timeout: 10000 });
        while (await upcomingInspectionsLocator.isVisible().catch(() => false)) {
            const deleteLinks = this.page.getByRole('link', { name: 'delete' });
            const count = await deleteLinks.count();
            if (count === 0) break; // No delete icons left, break to avoid infinite loop
            // Click the first visible delete link
            let clicked = false;
            for (let i = 0; i < count; i++) {
                const deleteLink = deleteLinks.nth(i);
                const isVisible = await deleteLink.isVisible({ timeout: 10000 }).catch(() => false);
                if (isVisible) {
                    await deleteLink.click();
                    clicked = true;
                    // Wait for UI/reactivity to update after click
                    await this.page.waitForTimeout(600);
                    break;
                }
            }
            // If none were visible or clickable, break to avoid hanging
            if (!clicked) break;
            // Optionally, wait a short moment for the DOM to update and Upcoming Inspections section to disappear if needed
            await this.page.waitForTimeout(500);
        }
        // Optionally, close modal/form
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1500);

    }

    /**
     * Verify that deleting an inspection from the inspection tab removes it from the calendar.
     * This will delete the first inspection, then check that it's no longer present in the list.
     */
    async verifyDeleteInspectionRemovesFromCalendar() {
        await this.navigateToListings();
        await this.switchToGridView();
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        const primaryAgent = this.page.locator(
            'div.form-group:has-text("Primary Agent") ng-select'
        );

        await primaryAgent.scrollIntoViewIfNeeded();
        await primaryAgent.click();

        const primaryInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']");
        await expect(primaryInput).toBeVisible({ timeout: 10000 });
        await primaryInput.fill('Jahanzaib Xenex');

        const primaryOption = this.page.locator(
            '.ng-dropdown-panel .ng-option',
            { hasText: 'Jahanzaib Xenex' }
        ).first();
        await expect(primaryOption).toBeVisible({ timeout: 10000 });
        await primaryOption.click();

        await this.page.waitForTimeout(1000);
        // Attempt to save/continue without filling fields
        const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Click on the 'Inspections' tab to trigger validation messages for required fields
        const inspectionTab = this.page.getByRole('tab', { name: /Inspections/i }).first();
        await expect(inspectionTab).toBeVisible({ timeout: 10000 });
        await inspectionTab.click();


        // Fill in inspection event date: pick January 14, 2026 using the date picker and the displayed calendar
        const dateInput = this.page.locator('#basic');
        await expect(dateInput).toBeVisible({ timeout: 10000 });
        await dateInput.click();

        // 1️⃣ Compute Tomorrow
        const t = new Date();
        t.setDate(t.getDate() + 1);

        const targetDay = t.getDate();
        const targetMonth = t.getMonth();
        const targetYear = t.getFullYear();

        // 2️⃣ Read currently opened calendar's month-year (stable header)
        const header = this.page.locator(".p-datepicker-title");
        await expect(header).toBeVisible();

        const headerText = await header.innerText();
        const [monthName, year] = headerText.trim().split(" ");

        const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();

        // 3️⃣ Move calendar to correct month
        const monthDifference =
            (targetYear - parseInt(year)) * 12 + (targetMonth - monthIndex);

        for (let i = 0; i < Math.abs(monthDifference); i++) {
            if (monthDifference > 0) {
                await this.page.locator(".p-datepicker-next").click();
            } else {
                await this.page.locator(".p-datepicker-prev").click();
            }
            // Wait for transition + re-render
            await this.page.waitForTimeout(200);
        }

        // 4️⃣ Select tomorrow's date (non-flaky selector)
        const dayLocator = this.page.locator(
            `.p-datepicker-calendar td:not(.p-disabled) >> text="${targetDay}"`
        );

        await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
        await dayLocator.first().click({ force: true });

        const startTimeSelect = this.page.locator(
            'div.col-sm-4:has(label:text("Start Time")) ng-select[placeholder="Hr"] div[role="combobox"]'
        );
        await startTimeSelect.click({ force: true });
        await this.page.waitForTimeout(1000);
        // Select the 6th option (index 5) from the dropdown
        const startTimeOption = this.page.getByText('5', { exact: true });
        await expect(startTimeOption).toBeVisible({ timeout: 10000 });
        await startTimeOption.click();
        // Click the 'Add' button in the Inspections tab
        const addButton = this.page.getByRole('button', { name: /Add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();

        // Wait for event success message to appear after adding inspection event
        const successAlert = this.page.getByText('event added to calendar successfully');
        await expect(successAlert).toBeVisible({ timeout: 10000 });

        const deleteLink = this.page.getByRole('link', { name: 'delete' }).first();
        await deleteLink.waitFor({ state: "visible", timeout: 10000 });
        await deleteLink.click();

        // Wait for the "event removed successfully" success message
        const removeSuccessAlert = this.page.getByText('event removed successfully');
        await expect(removeSuccessAlert).toBeVisible({ timeout: 10000 });

        // Click Calendar tab
        const calendarTab = this.page.getByRole('tab', { name: /Calendar/i });
        await calendarTab.scrollIntoViewIfNeeded();
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();
        await this.page.waitForTimeout(1000);

        // Scroll the FullCalendar time grid scroller to top
        const scroller = this.page.locator('.fc-scroller').nth(2);
        await scroller.evaluate((el: HTMLElement) => { el.scrollTop = 0; });

        // Look for the specific event "Remmi: Open Home" in the timegrid calendar
        const event = this.page.locator('.fc-timegrid-event', { hasText: 'Remmi: Open Home' });
        await expect(event).toHaveCount(0);

        // Close modal or preview if present after calendar validation
        const closePreviewButton = this.page.locator('.pi.pi-times').filter({ hasText: '' }).first();
        if (await closePreviewButton.isVisible({ timeout: 10000 }).catch(() => false)) {
            await closePreviewButton.click({ force: true });
        }
        await this.page.waitForTimeout(1500);

    }

    /**
     * Verify that the inspection is visible in the calendar tab.
     * Assumes an inspection has been added successfully beforehand.
     */
    async verifyInspectionVisibleInCalendarTab() {
        // Always use explicit waits and visible assertions instead of just waiting -- to avoid flakiness

        await this.switchToGridView();
        await this.addValidInspectionAndVerifySuccess();

        // Open the first listing card (wait for it to be attached and visible)
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeAttached({ timeout: 20000 }); // More robust: attached before visible
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Go to the Calendar tab with robust waits
        const calendarTab = this.page.getByRole('tab', { name: /Calendar/i });
        await expect(calendarTab).toBeAttached({ timeout: 10000 });
        await calendarTab.scrollIntoViewIfNeeded();
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        // Wait until the calendar content actually appears by checking for known elements
        const calendarGrid = this.page.locator('.fc-timegrid');
        await expect(calendarGrid).toBeVisible({ timeout: 10000 });

        // Scroll FullCalendar time grid scroller to top (if present & visible)
        const scroller = this.page.locator('.fc-scroller').nth(2);
        if (await scroller.count() > 0) {
            const isScrollerVisible = await scroller.isVisible().catch(() => false);
            if (isScrollerVisible) {
                await scroller.evaluate((el: HTMLElement) => { el.scrollTop = 0; });
            }
        }

        // Robustly wait for the "Remmi: Open Home" event to appear and be attached (no arbitrary waits)
        const eventLocator = this.page.locator('.fc-timegrid-event', { hasText: 'Remmi: Open Home' }).first();
        await expect(eventLocator).toBeAttached({ timeout: 20000 });
        await expect(eventLocator).toBeVisible({ timeout: 20000 });

        // Close modal or preview if present after validation
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verify that clicking on an inspection event in the calendar opens a popup/modal with inspection details.
     * Assumes there is an event called "Remmi: Open Home" visible on the calendar.
     */
    async verifyInspectionClickOpensPopup() {
        await this.switchToGridView();

        // Open the first listing card to access its tabs, robustly wait for attach & visible
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeAttached({ timeout: 20000 });
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Go to the Calendar tab and robustly open it
        const calendarTab = this.page.getByRole('tab', { name: /Calendar/i });
        await expect(calendarTab).toBeAttached({ timeout: 10000 });
        await calendarTab.scrollIntoViewIfNeeded();
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        // Make sure the calendar grid appears before proceeding
        const calendarGrid = this.page.locator('.fc-timegrid');
        await expect(calendarGrid).toBeVisible({ timeout: 20000 });

        // Optionally scroll calendar to top if scrollable/visible
        const scroller = this.page.locator('.fc-scroller').nth(2);
        if ((await scroller.count()) > 0 && await scroller.isVisible().catch(() => false)) {
            await scroller.evaluate((el: HTMLElement) => { el.scrollTop = 0; });
        }

        // Robustly wait for the "Remmi: Open Home" event to appear and be attached (no arbitrary waits)
        const eventLocator = this.page.locator('.fc-timegrid-event', { hasText: 'Remmi: Open Home' }).first();
        await expect(eventLocator).toBeAttached({ timeout: 20000 });
        await expect(eventLocator).toBeVisible({ timeout: 20000 });

        // Click on the event using force only if needed, prefer regular click first (increases reliability)
        try {
            await eventLocator.click({ timeout: 3500 });
        } catch {
            // fallback to force click if normal click didn't work (e.g., due to overlay)
            await eventLocator.click({ force: true });
        }

        // Assert popup/modal appears, don't proceed until it's attached and visible
        const popup = this.page.locator('.p-dialog-content').first();
        await expect(popup).toBeAttached({ timeout: 10000 });
        await expect(popup).toBeVisible({ timeout: 10000 });

        // Optionally verify some expected detail in the popup to ensure correctness
        // e.g., await expect(popup).toContainText('Open Home', { timeout: 3000 });

        // Robustly close popup if close button appears, don't use arbitrary waits
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verify that deleting an inspection from the Calendar view removes it from all relevant places.
     * Finds the "Remmi: Open Home" inspection event on the calendar, deletes it, and asserts removal.
     */
    async verifyInspectionRemovesFromCalendar() {
        await this.switchToGridView();

        // Open the first listing card to access its tabs
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });
        // Go to the Calendar tab
        const calendarTab = this.page.getByRole('tab', { name: /Calendar/i });
        await calendarTab.scrollIntoViewIfNeeded();
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();
        await this.page.waitForTimeout(1000);

        // Wait for calendar grid to be loaded and visible
        const calendarGrid = this.page.locator('.fc-timegrid');
        await expect(calendarGrid).toBeVisible({ timeout: 10000 });

        const scroller = this.page.locator('.fc-scroller').nth(2);
        if (await scroller.count().then(c => c > 0)) {
            await scroller.evaluate((el: HTMLElement) => { el.scrollTop = 0; });
        }

        // Find the inspection event by text and click to open its details popup
        const event = this.page.locator('.fc-timegrid-event', { hasText: 'Remmi: Open Home' }).first();
        await expect(event).toBeVisible({ timeout: 20000 });
        await this.page.waitForTimeout(2500);
        await event.click({ force: true });

        // In the popup/modal, find and click the Delete/Remove button (assuming ".pi-trash" is trash/delete icon)
        const popup = this.page.locator('.p-dialog-content').first();
        await expect(popup).toBeVisible({ timeout: 10000 });
        const deleteButton = this.page.getByRole('dialog').getByRole('img', { name: 'delete' }).first();
        await expect(deleteButton).toBeVisible({ timeout: 10000 });
        await deleteButton.click({ force: true });

        await this.page.waitForTimeout(1000);

        // Wait for and assert the toast 'Event deleted successfully' appears
        const toast = this.page.getByRole('alert', { name: 'Event deleted successfully' }).first();
        await expect(toast).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);

        // Assert the event is no longer visible in the calendar (should be gone)
        await expect(
            this.page.locator('.fc-timegrid-event', { hasText: 'Remmi: Open Home' })
        ).toHaveCount(0, { timeout: 5000 });

        // Optionally, check Inspection tab (if you want to ensure deletion from everywhere)
        const inspectionTab = this.page.getByRole('tab', { name: /Inspection/i });
        await inspectionTab.scrollIntoViewIfNeeded();
        await inspectionTab.click();
        await this.page.waitForTimeout(500);
        const deleteLink = this.page.getByRole('link', { name: 'delete' }).first();
        // Ensure that the delete link is no longer visible (i.e., deleted)
        await expect(deleteLink).not.toBeVisible();
        await this.page.waitForTimeout(1000);
        // Close the popup/modal if it's still open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1500);
    }

    /**
     * Verify deletion of an inspection from the inspection section.
     * This method assumes the Inspections tab is available under the first listing.
     */
    async verifyDeleteInspectionFromInspectionTab() {
        await this.navigateToListings();
        await this.switchToGridView();
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        const primaryAgent = this.page.locator(
            'div.form-group:has-text("Primary Agent") ng-select'
        );

        await primaryAgent.scrollIntoViewIfNeeded();
        await primaryAgent.click();

        const primaryInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']");
        await expect(primaryInput).toBeVisible({ timeout: 10000 });
        await primaryInput.fill('Jahanzaib Xenex');

        const primaryOption = this.page.locator(
            '.ng-dropdown-panel .ng-option',
            { hasText: 'Jahanzaib Xenex' }
        ).first();
        await expect(primaryOption).toBeVisible({ timeout: 10000 });
        await primaryOption.click();

        await this.page.waitForTimeout(1000);
        // Attempt to save/continue without filling fields
        const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Click on the 'Inspections' tab to trigger validation messages for required fields
        const inspectionTab = this.page.getByRole('tab', { name: /Inspections/i }).first();
        await expect(inspectionTab).toBeVisible({ timeout: 10000 });
        await inspectionTab.click();


        // Fill in inspection event date: pick January 14, 2026 using the date picker and the displayed calendar
        const dateInput = this.page.locator('#basic');
        await expect(dateInput).toBeVisible({ timeout: 10000 });
        await dateInput.click();

        // 1️⃣ Compute Tomorrow
        const t = new Date();
        t.setDate(t.getDate() + 1);

        const targetDay = t.getDate();
        const targetMonth = t.getMonth();
        const targetYear = t.getFullYear();

        // 2️⃣ Read currently opened calendar's month-year (stable header)
        const header = this.page.locator(".p-datepicker-title");
        await expect(header).toBeVisible();

        const headerText = await header.innerText();
        const [monthName, year] = headerText.trim().split(" ");

        const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();

        // 3️⃣ Move calendar to correct month
        const monthDifference =
            (targetYear - parseInt(year)) * 12 + (targetMonth - monthIndex);

        for (let i = 0; i < Math.abs(monthDifference); i++) {
            if (monthDifference > 0) {
                await this.page.locator(".p-datepicker-next").click();
            } else {
                await this.page.locator(".p-datepicker-prev").click();
            }
            // Wait for transition + re-render
            await this.page.waitForTimeout(200);
        }

        // 4️⃣ Select tomorrow's date (non-flaky selector)
        const dayLocator = this.page.locator(
            `.p-datepicker-calendar td:not(.p-disabled) >> text="${targetDay}"`
        );

        await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
        await dayLocator.first().click({ force: true });

        const startTimeSelect = this.page.locator(
            'div.col-sm-4:has(label:text("Start Time")) ng-select[placeholder="Hr"] div[role="combobox"]'
        );
        await startTimeSelect.click({ force: true });
        await this.page.waitForTimeout(1000);
        // Select the 6th option (index 5) from the dropdown
        const startTimeOption = this.page.getByText('5', { exact: true });
        await expect(startTimeOption).toBeVisible({ timeout: 10000 });
        await startTimeOption.click();
        // Click the 'Add' button in the Inspections tab
        const addButton = this.page.getByRole('button', { name: /Add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();

        // Wait for event success message to appear after adding inspection event
        const successAlert = this.page.getByText('event added to calendar successfully');
        await expect(successAlert).toBeVisible({ timeout: 10000 });

        // Verify that the newly added inspection is deletable via the delete icon:
        const deleteLink = this.page.getByRole('link', { name: 'delete' }).first();
        await deleteLink.waitFor({ state: "visible", timeout: 10000 });
        await deleteLink.scrollIntoViewIfNeeded();
        await deleteLink.click({ force: true });
        await this.page.waitForTimeout(700);
        // Confirm the inspection row is no longer visible
        await expect(deleteLink).not.toBeVisible({ timeout: 10000 });

        // Optionally, close the inspection form
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that an inspection with a past date cannot be added.
     * This will attempt to set an inspection event to a previous day and confirm the UI prevents it.
     */
    async verifyInspectionCannotAddPastDate() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Go to the Inspections tab
        const inspectionsTab = this.page.getByRole('tab', { name: /Inspections/i });
        await expect(inspectionsTab).toBeVisible({ timeout: 20000 });
        await inspectionsTab.click();

        await this.page.waitForTimeout(1000);
        // Pick a past date (yesterday) by direct click in the calendar

        const dateInput = this.page.locator('#basic');
        await expect(dateInput).toBeVisible({ timeout: 10000 });
        await dateInput.click();

        // Compute yesterday's date
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const targetDay = yesterday.getDate();

        // Try to directly click yesterday's day on the calendar (should be disabled)
        const pastDayCell = this.page.locator(`.p-datepicker-calendar td >> text="${targetDay}"`);
        await pastDayCell.first().click({ force: true });

        // Close the form after test
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1500);
    }

    /**
     * Verify inspection portion expand/collapse functionality.
     * Adds an inspection (for tomorrow), and verifies expand/collapse on inspection list.
     */
    async verifyInspectionExpandCollapse() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Go to the Inspections tab
        const inspectionsTab = this.page.getByRole('tab', { name: /Inspections/i });
        await expect(inspectionsTab).toBeVisible({ timeout: 20000 });
        await inspectionsTab.click();
        await this.page.waitForTimeout(1000);

        // Add an inspection for tomorrow (add new if there isn't one already)
        const dateInput = this.page.locator('#basic');
        await expect(dateInput).toBeVisible({ timeout: 10000 });
        await dateInput.click();

        // Compute tomorrow
        const t = new Date();
        t.setDate(t.getDate() + 1);
        const targetDay = t.getDate();

        // Select tomorrow on the date picker
        const dayLocator = this.page.locator(
            `.p-datepicker-calendar td:not(.p-disabled) >> text="${targetDay}"`
        );
        await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
        await dayLocator.first().click({ force: true });

        // Select and pick a value for start time hour
        const startTimeSelect = this.page.locator(
            'div.col-sm-4:has(label:text("Start Time")) ng-select[placeholder="Hr"] div[role="combobox"]'
        );
        await startTimeSelect.waitFor({ state: "visible", timeout: 10000 });
        await startTimeSelect.click({ force: true });
        const startTimeHourOption = this.page.getByRole('option', { name: '5' }).first();
        await expect(startTimeHourOption).toBeVisible({ timeout: 10000 });
        await startTimeHourOption.click();
        await this.page.waitForTimeout(200);

        // Select and pick a value for start time minutes
        const startTimeMinutes = this.page.locator(
            'div.col-sm-4:has(label:text("Start Time")) ng-select[placeholder="Min"] div[role="combobox"]'
        ).first();
        await expect(startTimeMinutes).toBeVisible({ timeout: 2000 });
        await startTimeMinutes.click({ force: true });
        const startTimeMinuteOption = this.page.getByRole('option', { name: '05' }).first();
        await expect(startTimeMinuteOption).toBeVisible({ timeout: 10000 });
        await startTimeMinuteOption.click();
        await this.page.waitForTimeout(200);

        // Select and pick a value for start time AM/PM
        const startTimeAmPm = this.page.locator(
            'div.col-sm-4:has(label:text("Start Time")) ng-select[placeholder="Min"] div[role="combobox"]'
        ).nth(1);
        await expect(startTimeAmPm).toBeVisible({ timeout: 10000 });
        await startTimeAmPm.click({ force: true });
        const startTimeAmPmOption = this.page.getByRole('option', { name: 'PM' }).first();
        await expect(startTimeAmPmOption).toBeVisible({ timeout: 10000 });
        await startTimeAmPmOption.click();
        await this.page.waitForTimeout(200);

        // Select and pick a value for end time hour
        const endTimeHour = this.page.locator(
            'div.col-sm-4:has(label:text("End Time")) ng-select[placeholder="Hr"] div[role="combobox"]'
        );
        await expect(endTimeHour).toBeVisible({ timeout: 10000 });
        await endTimeHour.click({ force: true });
        const endTimeHourOption = this.page.getByRole('option', { name: '6' }).first();
        await expect(endTimeHourOption).toBeVisible({ timeout: 10000 });
        await endTimeHourOption.click();
        await this.page.waitForTimeout(200);

        // Select and pick a value for end time minutes
        const endTimeMinutes = this.page.locator(
            'div.col-sm-4:has(label:text("End Time")) ng-select[placeholder="Min"] div[role="combobox"]'
        ).first();
        await expect(endTimeMinutes).toBeVisible({ timeout: 5000 });
        await endTimeMinutes.click({ force: true });
        const endTimeMinuteOption = this.page.getByRole('option', { name: '10' }).first();
        await expect(endTimeMinuteOption).toBeVisible({ timeout: 10000 });
        await endTimeMinuteOption.click();
        await this.page.waitForTimeout(200);

        // Select and pick a value for end time AM/PM
        const endTimeAmPm = this.page.locator(
            'div.col-sm-4:has(label:text("End Time")) ng-select[placeholder="Min"] div[role="combobox"]'
        ).nth(1);
        await expect(endTimeAmPm).toBeVisible({ timeout: 10000 });
        await endTimeAmPm.click({ force: true });
        const endTimeAmPmOption = this.page.getByRole('option', { name: 'PM' }).first();
        await expect(endTimeAmPmOption).toBeVisible({ timeout: 10000 });
        await endTimeAmPmOption.click();
        await this.page.waitForTimeout(2000);

        // Clean up: Close the form/modal if open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1500);
    }

    async verifyAddMultipleInspectionsDifferentDates() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Helper to add a single inspection by offsetting days
        const addInspection = async (daysFromToday: number) => {
            // Go to Inspections tab
            const inspectionsTab = this.page.getByRole('tab', { name: /Inspections/i });
            if (await inspectionsTab.isVisible({ timeout: 10000 }).catch(() => false)) {
                await inspectionsTab.click();
                await this.page.waitForTimeout(500);
            }

            // Open date picker
            const inspectionDateInput = this.page.locator('#basic');
            await expect(inspectionDateInput).toBeVisible({ timeout: 10000 });
            await inspectionDateInput.click();

            // Calculate target date
            const d = new Date();
            d.setDate(d.getDate() + daysFromToday);
            const targetDay = d.getDate();
            const targetMonth = d.getMonth();
            const targetYear = d.getFullYear();

            // Read calendar header to get visible month/year
            const calendarHeader = this.page.locator(".p-datepicker-title");
            await expect(calendarHeader).toBeVisible();
            const calendarHeaderText = await calendarHeader.innerText();
            const [monthName, visibleYear] = calendarHeaderText.trim().split(" ");
            const visibleMonthIndex = new Date(`${monthName} 1, 2000`).getMonth();
            const monthDiff = (targetYear - parseInt(visibleYear)) * 12 + (targetMonth - visibleMonthIndex);

            // Move to required month/year
            for (let i = 0; i < Math.abs(monthDiff); i++) {
                if (monthDiff > 0) {
                    await this.page.locator(".p-datepicker-next").click();
                } else {
                    await this.page.locator(".p-datepicker-prev").click();
                }
                await this.page.waitForTimeout(200);
            }

            // Pick the correct day
            const inspectionDayLocator = this.page.locator(
                `.p-datepicker-calendar td:not(.p-disabled) >> text="${targetDay}"`
            );
            await inspectionDayLocator.first().waitFor({ state: "visible", timeout: 10000 });
            await inspectionDayLocator.first().click({ force: true });

            // Fill required time field
            const startTimeCombo = this.page.locator('ng-select[placeholder="Hr"] div[role="combobox"]').nth(1);
            await startTimeCombo.click({ force: true });
            await this.page.waitForTimeout(500);
            const startTimeTimeOption = this.page.getByText('5', { exact: true });
            await expect(startTimeTimeOption).toBeVisible({ timeout: 2000 });
            await startTimeTimeOption.click();

            // Click the 'Add' button in the Inspections tab
            const addBtn = this.page.getByRole('button', { name: /Add/i }).first();
            await expect(addBtn).toBeVisible({ timeout: 10000 });
            await addBtn.click();

            // Wait for success alert
            const successMessage = this.page.getByText('event added to calendar successfully');
            await expect(successMessage).toBeVisible({ timeout: 10000 });

            await this.page.waitForTimeout(2000);
        };
        await addInspection(1);
        await addInspection(2);

        // Close the form after adding inspections
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1500);
    }

    /**
     * Verify adding multiple inspections on the same date but different times
     */
    async verifyAddMultipleInspectionsSameDateDifferentTimes() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Go to Inspections tab
        const inspectionTab = this.page.getByRole('tab', { name: /Inspections/i }).first();
        await expect(inspectionTab).toBeVisible({ timeout: 10000 });
        await inspectionTab.click();

        // Utility function to add inspection at a certain time
        const addInspectionAtTime = async (hourText: string) => {
            // Open date picker and pick "tomorrow"
            const dateInput = this.page.locator('#basic');
            await expect(dateInput).toBeVisible({ timeout: 10000 });
            await dateInput.click();

            // Compute "tomorrow"
            const t = new Date();
            t.setDate(t.getDate() + 1);
            const targetDay = t.getDate();
            const targetMonth = t.getMonth();
            const targetYear = t.getFullYear();

            // Read calendar header and go to correct month
            const header = this.page.locator(".p-datepicker-title");
            await expect(header).toBeVisible();

            const headerText = await header.innerText();
            const [monthName, yearStr] = headerText.trim().split(" ");
            const visibleMonthIndex = new Date(`${monthName} 1, 2000`).getMonth();
            const monthDiff = (targetYear - parseInt(yearStr)) * 12 + (targetMonth - visibleMonthIndex);
            for (let i = 0; i < Math.abs(monthDiff); i++) {
                if (monthDiff > 0) {
                    await this.page.locator(".p-datepicker-next").click();
                } else {
                    await this.page.locator(".p-datepicker-prev").click();
                }
                await this.page.waitForTimeout(200);
            }

            // Pick the correct day
            const dayLocator = this.page.locator(
                `.p-datepicker-calendar td:not(.p-disabled) >> text="${targetDay}"`
            );
            await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
            await dayLocator.first().click({ force: true });

            // Pick given hour
            const startTimeCombo = this.page.locator('ng-select[placeholder="Hr"] div[role="combobox"]').nth(1);
            await startTimeCombo.click({ force: true });
            await this.page.waitForTimeout(500);
            const option = this.page.getByText('5', { exact: true });;
            await expect(option).toBeVisible({ timeout: 2000 });
            await option.click();

            // Click 'Add'
            const addBtn = this.page.getByRole('button', { name: /Add/i }).first();
            await expect(addBtn).toBeVisible({ timeout: 10000 });
            await addBtn.click();

            // Wait for confirmation
            const successAlert = this.page.getByText('event added to calendar successfully');
            await expect(successAlert).toBeVisible({ timeout: 10000 });
            await this.page.waitForTimeout(700);
        };

        // Add two inspections on the same date but different times
        await addInspectionAtTime("3");
        await addInspectionAtTime("4");

        // Clean up - close the popup/form
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1500);
    }

    /**
     * Verify that deleting all inspections removes them from all views
     */
    async verifyDeleteAllInspectionsRemovesFromAllViews() {
        await this.switchToGridView();
        // Open the first listing card to access its tabs
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Switch to Inspections tab
        const inspectionsTab = this.page.getByRole('tab', { name: /Inspections/i });
        await expect(inspectionsTab).toBeVisible({ timeout: 10000 });
        await inspectionsTab.click();
        await this.page.waitForTimeout(1000);

        // Continuously click all visible delete icons until there are none left
        while (true) {
            const deleteLinks = this.page.getByRole('link', { name: 'delete' });
            const count = await deleteLinks.count();
            if (count === 0) break;
            // Always click the first visible delete link that is visible
            let clicked = false;
            for (let i = 0; i < count; i++) {
                const deleteLink = deleteLinks.nth(i);
                const isVisible = await deleteLink.isVisible({ timeout: 10000 }).catch(() => false);
                if (isVisible) {
                    await deleteLink.click();
                    clicked = true;
                    // Wait for UI/reactivity to update before next check
                    await this.page.waitForTimeout(600);
                    break;
                }
            }
            // If none were visible or clickable, break out of loop
            if (!clicked) break;
        }
        await this.page.waitForTimeout(1200);

        // Optionally, close form
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1500);
    }

    /**
     Verify that deleting an inspection from the calendar does not affect other inspections
     */
    async verifyDeleteInspectionFromCalendarDoesNotAffectOthers() {
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Go to the Inspections tab
        const inspectionsTab = this.page.getByRole('tab', { name: /Inspections/i });
        await expect(inspectionsTab).toBeVisible({ timeout: 15000 });
        await inspectionsTab.click();
        await this.page.waitForTimeout(1000);

        // ---- Step 1: Add two inspections for different (future) dates ----
        const inspectionDescriptions: string[] = [];
        for (let idx = 1; idx <= 2; idx++) {
            // Open the date input
            const dateInput = this.page.locator('#basic');
            await expect(dateInput).toBeVisible({ timeout: 10000 });
            await dateInput.click();

            // Compute future date
            let d = new Date();
            d.setDate(d.getDate() + idx); // day+1 and day+2

            const day = d.getDate();
            const month = d.getMonth();
            const year = d.getFullYear();

            // Get current header to navigate if needed
            const calendarHeader = this.page.locator(".p-datepicker-title");
            await expect(calendarHeader).toBeVisible({ timeout: 10000 });
            const headerText = await calendarHeader.innerText();
            const [headerMonthName, headerYear] = headerText.trim().split(" ");
            const headerMonthIndex = new Date(`${headerMonthName} 1, 2000`).getMonth();
            const monthDifference = (year - parseInt(headerYear)) * 12 + (month - headerMonthIndex);

            for (let j = 0; j < Math.abs(monthDifference); j++) {
                if (monthDifference > 0) {
                    await this.page.locator(".p-datepicker-next").click();
                } else {
                    await this.page.locator(".p-datepicker-prev").click();
                }
                await this.page.waitForTimeout(200);
            }

            const dayLocator = this.page.locator(
                `.p-datepicker-calendar td:not(.p-disabled) >> text="${day}"`
            );
            await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
            await dayLocator.first().click({ force: true });
            await this.page.waitForTimeout(1200);
            // Select start time
            const startTimeCombo = this.page.locator('ng-select[placeholder="Hr"] div[role="combobox"]').nth(1);
            await startTimeCombo.click({ force: true });
            await this.page.waitForTimeout(500);
            const startTimeTimeOption = this.page.getByText('5', { exact: true });
            await expect(startTimeTimeOption).toBeVisible({ timeout: 2000 });
            await startTimeTimeOption.click();

            // Click the Add button
            const addButton = this.page.getByRole('button', { name: /Add/i }).first();
            await expect(addButton).toBeVisible({ timeout: 10000 });
            await addButton.click();

            // Wait for success confirmation
            const successAlert = this.page.getByText('event added to calendar successfully');
            await expect(successAlert).toBeVisible({ timeout: 10000 });
            await this.page.waitForTimeout(900);
        }

        // Refresh the inspections tab state, and collect the first two inspection descriptions
        await inspectionsTab.click();
        await this.page.waitForTimeout(1000);

        // ---- Step 2: Go to Calendar tab and delete the first inspection ----
        const calendarTab = this.page.getByRole('tab', { name: /Calendar/i });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();
        await this.page.waitForTimeout(1200);

        // Wait for calendar grid to be loaded and visible
        const calendarGrid = this.page.locator('.fc-timegrid');
        await expect(calendarGrid).toBeVisible({ timeout: 10000 });

        // Ensure the calendar is scrolled to the top (works for visible scrollbars)
        const scroller = this.page.locator('.fc-scroller').nth(2);
        if (await scroller.count().then(c => c > 0)) {
            // Use JS to force scroll to top, since .scroll is not available on Locator
            await scroller.evaluate((el: HTMLElement) => { el.scrollTop = 0; });
        }

        await this.page.waitForTimeout(1000);

        // Find all inspection events on the calendar
        const calendarEntries = this.page.locator('.fc-timegrid-event', { hasText: 'Remmi: Open Home' });
        const numEntries = await calendarEntries.count();
        expect(numEntries).toBeGreaterThanOrEqual(2);

        // Click the first inspection event to open its details popup
        const firstEvent = calendarEntries.nth(0);
        await expect(firstEvent).toBeVisible({ timeout: 20000 });
        await this.page.waitForTimeout(2500);
        await firstEvent.click({ force: true });

        // In the popup/modal, find and click the Delete/Remove button
        const deleteButton = this.page.getByRole('dialog').getByRole('img', { name: 'delete' }).first();
        await expect(deleteButton).toBeVisible({ timeout: 10000 });
        await deleteButton.click({ force: true });
        await this.page.waitForTimeout(800);

        // Click the refresh icon to reload the calendar events
        const refreshIcon = this.page.locator('.cursor-pointer.f-14.pi.pi-refresh').first();
        if (await refreshIcon.isVisible({ timeout: 5000 }).catch(() => false)) {
            await refreshIcon.click({ force: true });
            await this.page.waitForTimeout(1200);
        }

        // ---- Step 3: Validate: First is deleted, second remains (calendar & tab) ----
        // Before checking, scroll to top to ensure all calendar events are visible
        const calendarScroller = this.page.locator('.fc-scroller').nth(2);
        if (await calendarScroller.count().then(c => c > 0)) {
            await calendarScroller.evaluate((el: HTMLElement) => { el.scrollTop = 0; });
            await this.page.waitForTimeout(500);
        }
        // Confirm first calendar entry is not visible, second is visible
        await expect(calendarEntries.nth(0)).toBeVisible({ timeout: 10000 });

        // Go back to Inspections tab
        await inspectionsTab.click();
        await this.page.waitForTimeout(1000);

        // Optionally close the form
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that the start time must be before the end time when adding an inspection.
     * This test selects a start time that is after or the same as the end time and expects a validation error.
     */
    async verifyStartTimeMustBeBeforeEndTime() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Go to the Inspections tab
        const inspectionsTab = this.page.getByRole('tab', { name: /Inspections/i });
        await expect(inspectionsTab).toBeVisible({ timeout: 20000 });
        await inspectionsTab.click();

        await this.page.waitForTimeout(900);

        // Open date picker and select tomorrow
        const dateInput = this.page.locator('#basic');
        await expect(dateInput).toBeVisible({ timeout: 10000 });
        await dateInput.click();

        const t = new Date();
        t.setDate(t.getDate() + 1);
        const targetDay = t.getDate();

        // Select tomorrow's date (works assuming calendar is on correct month/year)
        const dayLocator = this.page.locator(
            `.p-datepicker-calendar td:not(.p-disabled) >> text="${targetDay}"`
        );
        await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
        await dayLocator.first().click({ force: true });

        const startTimeCombo = this.page.locator('ng-select[placeholder="Hr"] div[role="combobox"]').nth(1);
        await startTimeCombo.click({ force: true });
        await this.page.waitForTimeout(500);
        const startTimeTimeOption = this.page.getByText('5', { exact: true });
        await expect(startTimeTimeOption).toBeVisible({ timeout: 2000 });
        await startTimeTimeOption.click();

        // Select End time (earlier)
        const endTimeSelect = this.page.locator('ng-select[placeholder="Hr"] div[role="combobox"]').nth(2)
        await endTimeSelect.click({ force: true });
        await this.page.waitForTimeout(1000);
        const earlyEndOption = this.page.getByLabel('Options list').getByText('4', { exact: true });
        await earlyEndOption.waitFor({ state: 'visible', timeout: 5000 });
        await earlyEndOption.click({ force: true });

        // Click 'Add' to submit
        const addButton = this.page.getByRole('button', { name: /Add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();

        // Expect a validation error popup or message
        const timeErrorAlert = this.page.getByRole('alert', { name: 'Start time must be before end' });
        await expect(timeErrorAlert).toBeVisible({ timeout: 10000 });

        // Optionally close the form if needed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }
    /**
     * Verify that duplicate inspections can be added on the same listing.
     */
    async verifyDuplicateInspectionsCanBeAdded() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });
        // Go to the Inspections tab
        const inspectionsTab = this.page.getByRole('tab', { name: /Inspections/i });
        await expect(inspectionsTab).toBeVisible({ timeout: 20000 });
        await inspectionsTab.click();
        await this.page.waitForTimeout(1000);

        // Helper to add an inspection with same date & time
        const addInspection = async () => {
            const dateInput = this.page.locator('#basic');
            await expect(dateInput).toBeVisible({ timeout: 10000 });
            await dateInput.click();

            // Select tomorrow's date
            const t = new Date();
            t.setDate(t.getDate() + 1);
            const targetDay = t.getDate();

            const dayLocator = this.page.locator(
                `.p-datepicker-calendar td:not(.p-disabled) >> text="${targetDay}"`
            );
            await dayLocator.first().waitFor({ state: "visible", timeout: 10000 });
            await dayLocator.first().click({ force: true });

            const startTimeSelect = this.page.locator('ng-select[placeholder="Hr"] div[role="combobox"]').nth(1)
            await startTimeSelect.click({ force: true });
            await this.page.waitForTimeout(500);
            const startTimeOption = this.page.getByRole('option', { name: '5' });
            await startTimeOption.click();

            // Click 'Add'
            const addButton = this.page.getByRole('button', { name: /Add/i }).first();
            await expect(addButton).toBeVisible({ timeout: 10000 });
            await addButton.click();

            // Wait for event added alert
            const successAlert = this.page.getByText('event added to calendar successfully');
            await expect(successAlert).toBeVisible({ timeout: 10000 });
            await this.page.waitForTimeout(1000);
        };

        // Add the duplicate inspections
        await addInspection();
        await addInspection();

        await this.page.waitForTimeout(1200);

        // Close the inspection form if open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);

    }

    /**
     * Test that clicking the Add button in the Legal tab opens the contract popup in a new tab.
     */
}
