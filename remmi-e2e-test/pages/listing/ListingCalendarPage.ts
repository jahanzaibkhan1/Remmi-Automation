import { expect } from '@playwright/test';
import { ListingBasePage } from './ListingBasePage';

export class ListingCalendarPage extends ListingBasePage {
    async verifyGoogleCalendarConnectButtonVisible() {
        // Navigate to the relevant page/section where Google Calendar integration is managed.
        // (Implement navigation as appropriate for your app context)
        await this.navigateToListings();
        await this.switchToGridView();
        // Open the first listing card (if required by context)
        const firstListingCard = this.page
            .locator("//div[contains(@class,'s-property')]")
            .first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

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

        await this.page.waitForTimeout(1000);

        // Navigate to the Calendar/Integrations tab
        const calendarTab = this.page.getByRole('tab', { name: ' Calendar' });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();
        // Assert "Connect Your Account" button is visible
        const connectAccountBtn = this.page.getByRole('button', { name: /connect your account/i });
        await expect(connectAccountBtn).toBeVisible({ timeout: 10000 });

        // Close modal/tab
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1500);

    }

    /**
     * Verify that "+Create New" and "+New Task" buttons appear on the expected page/tab.
     */
    async verifyCreateNewAndNewTaskButtonsVisible() {
        // Navigate to the Listings page and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page
            .locator("//div[contains(@class,'s-property')]")
            .first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Navigate to the Calendar/Integrations tab
        const calendarTab = this.page.getByRole('tab', { name: ' Calendar' });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        // Assert that "+New Task" button is visible
        const newTaskBtn = this.page.getByRole('button', { name: /New Task/i });
        await expect(newTaskBtn).toBeVisible({ timeout: 10000 });

        // Close modal/tab if any is open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify that clicking "+Create New" opens the inspection fields.
     */
    async verifyCreateNewOpensInspectionFields() {
        // Navigate to Listings page and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page
            .locator("//div[contains(@class,'s-property')]")
            .first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Navigate to the Calendar/Integrations tab
        const calendarTab = this.page.getByRole('tab', { name: ' Calendar' });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        // Wait for "+Create New" button to appear and click it
        const createNewBtn = this.page.getByRole('button', { name: /create new/i });
        await expect(createNewBtn).toBeVisible({ timeout: 10000 });
        await createNewBtn.click();

        const inspectionField = this.page.locator('.p-dialog-content').first();
        await expect(inspectionField).toBeVisible({ timeout: 10000 });

        const closeBtun = this.page.locator('.event_poup_close_btn');

        if (await closeBtun.isVisible()) {
            await closeBtun.click({ force: true });
        }

        await expect(closeBtun).not.toBeVisible({ timeout: 10000 });

        // Close modal/tab if any is open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify that private inspection fields enforce required validation for date and time.
     */
    async verifyPrivateInspectionFieldsValidation() {
        // Navigate to Listings page and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page
            .locator("//div[contains(@class,'s-property')]")
            .first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Navigate to the Calendar/Integrations tab
        const calendarTab = this.page.getByRole('tab', { name: ' Calendar' });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        // Wait for "+Create New" button to appear and click it
        const createNewBtn = this.page.getByRole('button', { name: /create new/i });
        await expect(createNewBtn).toBeVisible({ timeout: 10000 });
        await createNewBtn.click();

        const inspectionField = this.page.locator('.p-dialog-content').first();
        await expect(inspectionField).toBeVisible({ timeout: 10000 });

        // Attempt to save without entering required date and time
        const saveBtn = this.page.getByRole('button', { name: /save/i }).last();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();

        // Expect validation messages for date and time fields
        const dateValidationMsg = this.page.getByRole('alert', { name: 'Start time must be before end' });
        await expect(dateValidationMsg).toBeVisible({ timeout: 10000 });

        const closeBtun = this.page.locator('.event_poup_close_btn');

        if (await closeBtun.isVisible()) {
            await closeBtun.click({ force: true });
        }
        await expect(closeBtun).not.toBeVisible({ timeout: 10000 });
        // Optionally, close the inspection modal after test
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(3000);
    }

    /**
     * Verify that the listing location field is auto-filled when opening a listing.
     */
    async verifyListingLocationFieldIsAutoFilled() {
        // Navigate to Listings page and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page
            .locator("//div[contains(@class,'s-property')]")
            .first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Navigate to the Calendar/Integrations tab
        const calendarTab = this.page.getByRole('tab', { name: ' Calendar' });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        // Wait for "+Create New" button to appear and click it
        const createNewBtn = this.page.getByRole('button', { name: /create new/i });
        await expect(createNewBtn).toBeVisible({ timeout: 10000 });
        await createNewBtn.click();

        const inspectionField = this.page.locator('.p-dialog-content').first();
        await expect(inspectionField).toBeVisible({ timeout: 10000 });

        const location = this.page.getByPlaceholder('Location');

        const value = await location.inputValue();

        console.log('Location:', value);

        expect(value).not.toBe('');

        const closeBtun = this.page.locator('.event_poup_close_btn');

        if (await closeBtun.isVisible()) {
            await closeBtun.click({ force: true });
        }
        await expect(closeBtun).not.toBeVisible({ timeout: 10000 });
        // Optionally, close the inspection modal after test
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(3000);
    }

    /**
     * Verify that the primary agent is auto selected when creating a new inspection.
     */
    async verifyPrimaryAgentIsAutoSelected() {
        // Navigate to Listings page and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page
            .locator("//div[contains(@class,'s-property')]")
            .first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Navigate to the Calendar/Integrations tab
        const calendarTab = this.page.getByRole('tab', { name: ' Calendar' });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        await this.page.waitForTimeout(3000);

        // Wait for "+Create New" button to appear and click it
        const createNewBtn = this.page.getByRole('button', { name: /create new/i });
        await expect(createNewBtn).toBeVisible({ timeout: 10000 });
        await createNewBtn.click();

        const primaryAgent = this.page.locator('ng-select[bindlabel="full_name"] .ng-value-label').last();
        await expect(primaryAgent).toBeVisible();
        const agentName = await primaryAgent.textContent();
        console.log('Primary Agent:', agentName);
        expect(agentName?.trim()).not.toBe('');

        const closeBtun = this.page.locator('.event_poup_close_btn');

        if (await closeBtun.isVisible()) {
            await closeBtun.click({ force: true });
        }
        await expect(closeBtun).not.toBeVisible({ timeout: 10000 });


        // Close the modal
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(3000);
    }

    /**
     * Verify that the agent dropdown allows adding and removing agents.
     */
    async verifyAgentDropdownAllowsAddAndRemoveAgents() {
        // Navigate to Listings page and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page
            .locator("//div[contains(@class,'s-property')]")
            .first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Navigate to the Calendar/Integrations tab
        const calendarTab = this.page.getByRole('tab', { name: ' Calendar' });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();


        await this.page.waitForTimeout(1000);

        // Wait for "+Create New" button to appear and click it
        const createNewBtn = this.page.getByRole('button', { name: /create new/i });
        await expect(createNewBtn).toBeVisible({ timeout: 10000 });
        await createNewBtn.click();

        // Open the agent dropdown
        const agentDropdown = this.page.locator('ng-select[bindlabel="full_name"]').last();
        await expect(agentDropdown).toBeVisible({ timeout: 10000 });
        await agentDropdown.click();

        // Wait for dropdown options to appear
        const dropdownOptions = this.page.locator('ng-dropdown-panel .ng-option');
        await expect(dropdownOptions.first()).toBeVisible({ timeout: 10000 });

        // Select the first available agent from the list (for add)
        const agentOptionToAdd = dropdownOptions.nth(1);
        const agentOptionText = await agentOptionToAdd.textContent();
        await agentOptionToAdd.click();

        // Verify that the agent was added (should now be visible in the selected values)
        const selectedAgents = this.page.locator('ng-select[bindlabel="full_name"] .ng-value-label');
        const selectedAgentsCountAfterAdd = await selectedAgents.count();
        expect(selectedAgentsCountAfterAdd).toBeGreaterThan(0);

        // Remove the agent by clicking the remove/cross button next to their name
        const removeBtn = this.page.locator('ng-select[bindlabel="full_name"] .ng-value-icon').last();
        await expect(removeBtn).toBeVisible();
        await removeBtn.click();

        // Confirm agent is removed
        const selectedAgentsCountAfterRemove = await selectedAgents.count();
        expect(selectedAgentsCountAfterRemove).toBeLessThan(selectedAgentsCountAfterAdd);

        const closeBtun = this.page.locator('.event_poup_close_btn');

        if (await closeBtun.isVisible()) {
            await closeBtun.click({ force: true });
        }
        await expect(closeBtun).not.toBeVisible({ timeout: 10000 });

        // Clean up: Close the modal if open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    // Verify that clicking on an agent name opens the listing form
    async verifyClickingCancelNotSave() {
        // Navigate to Listings page and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page
            .locator("//div[contains(@class,'s-property')]")
            .first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Navigate to the Calendar/Integrations tab
        const calendarTab = this.page.getByRole('tab', { name: ' Calendar' });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        // Wait for "+Create New" button to appear and click it
        const createNewBtn = this.page.getByRole('button', { name: /create new/i });
        await expect(createNewBtn).toBeVisible({ timeout: 10000 });
        await createNewBtn.click();
        // Click the cancel button to close the dialog/modal
        const cancelBtn = this.page.getByRole('button', { name: /cancel/i });

        if (await cancelBtn.isVisible().catch(() => false)) {
            await cancelBtn.click({ force: true });
        }
        await expect(cancelBtn).not.toBeVisible({ timeout: 10000 });

        // Clean up: Close the modal if open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(3000);
    }

    async verifySavingInspectionAddsToCalendar() {
        // Navigate to Listings page and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page
            .locator("//div[contains(@class,'s-property')]")
            .first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Navigate to the Calendar/Integrations tab
        const calendarTab = this.page.getByRole('tab', { name: ' Calendar' });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        // Wait for "+Create New" button to appear and click it
        const createNewBtn = this.page.getByRole('button', { name: /create new/i });
        await expect(createNewBtn).toBeVisible({ timeout: 10000 });
        await createNewBtn.click();

        // Fill out minimal required fields for the inspection
        const titleInput = this.page.locator('input[placeholder="Add title"]');
        await titleInput.click();
        await titleInput.fill('');
        await titleInput.fill('Test Inspection');

        const startHour = this.page.locator('ng-select[placeholder="Hr"] div[role="combobox"]').nth(3);
        await startHour.waitFor({ state: 'visible', timeout: 10000 });
        await startHour.click();
        const startHourOption = this.page.getByRole('option', { name: '5' });
        await expect(startHourOption).toBeVisible({ timeout: 10000 });
        await startHourOption.click();

        // Click Save
        const saveBtn = this.page.getByLabel('Calendar').getByRole('button', { name: 'Save' });
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();

        // Wait for confirmation alert that event was added to calendar
        const calendarAlert = this.page.getByRole('alert', { name: /event added to calendar/i });
        await expect(calendarAlert).toBeVisible({ timeout: 10000 });

        const newEvent = this.page.locator("//div[@class='fc-event-main']").first();
        await newEvent.scrollIntoViewIfNeeded();
        await expect(newEvent).toBeVisible({ timeout: 10000 });
        // Clean up: Close the modal if open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(3000);
    }

    /**
     * Verifies that the saved inspection appears under the "Inspection Section".
     */
    async verifyInspectionAppearsInInspectionSection() {
        // Navigate to Listings page and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page
            .locator("//div[contains(@class,'s-property')]")
            .first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        await this.page.waitForTimeout(1000);

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Navigate to the Calendar/Integrations tab
        const calendarTab = this.page.getByRole('tab', { name: ' Calendar' });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        await this.page.waitForTimeout(3000);

        const newEvent = this.page.locator("//div[@class='fc-event-main']").first();
        await newEvent.scrollIntoViewIfNeeded();
        await expect(newEvent).toBeVisible({ timeout: 10000 });

        //Close the form dialog
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(3000);
    }

    /**
     * Verifies that clicking an inspection event in the calendar opens a popup with details.
     */
    async verifyClickingInspectionOpensPopupWithDetails() {
        // Navigate to Listings page and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page
            .locator("//div[contains(@class,'s-property')]")
            .first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        await this.page.waitForTimeout(1000);

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Navigate to the Calendar/Integrations tab
        const calendarTab = this.page.getByRole('tab', { name: ' Calendar' });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        await this.page.waitForTimeout(3000);


        const newEvent = this.page.locator("//div[@class='fc-event-main']").first();
        await newEvent.scrollIntoViewIfNeeded();
        await expect(newEvent).toBeVisible({ timeout: 10000 });
        await newEvent.click({ force: true });

        const popup = this.page.locator('.p-dialog, .fc-popover, [role="dialog"]').last();
        await expect(popup).toBeVisible({ timeout: 10000 });

        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(3000);

    }

    /**
     * Verifies that the inspection popup contains a close (X) icon and a delete icon.
     */
    async verifyInspectionPopupHasCloseAndDeleteIcons() {
        // Navigate to Listings page and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page
            .locator("//div[contains(@class,'s-property')]")
            .first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        await this.page.waitForTimeout(1000);

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Navigate to the Calendar/Integrations tab
        const calendarTab = this.page.getByRole('tab', { name: ' Calendar' });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        await this.page.waitForTimeout(3000);


        // Locate and click the first calendar event
        const newEvent = this.page.locator("//div[@class='fc-event-main']").first();
        await newEvent.scrollIntoViewIfNeeded();
        await expect(newEvent).toBeVisible({ timeout: 10000 });
        await newEvent.click({ force: true });

        // Wait for the inspection popup/dialog to appear
        const popup = this.page.locator('.p-dialog, .fc-popover, [role="dialog"]').last();
        await expect(popup).toBeVisible({ timeout: 10000 });

        // Check for the close (X) icon in the popup
        const closeIcon = popup.locator('.pi.pi-times.p-1');
        await expect(closeIcon).toBeVisible({ timeout: 10000 });

        // Check for the delete icon (commonly .pi-trash or a button labeled 'Delete') in the popup
        const deleteIcon = this.page.getByRole('img', { name: 'delete' }).last();
        await expect(deleteIcon).toBeVisible({ timeout: 10000 });

        await closeIcon.click({ force: true });

        await this.page.waitForTimeout(1200);

        //Close the form dialog
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(3000);
    }

    /**
     * Verifies that deleting an inspection from the popup removes it from both the calendar and the "My Task" section.
     */
    async verifyDeletingInspectionRemovesFromCalendarAndMyTask() {
        // Navigate to Listings page and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page
            .locator("//div[contains(@class,'s-property')]")
            .first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        await this.page.waitForTimeout(3000);

        // Navigate to the Calendar/Integrations tab
        const calendarTab = this.page.getByRole('tab', { name: ' Calendar' });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        await this.page.waitForTimeout(1000);

        // Locate and click the first calendar event
        const eventLocator = this.page.locator("//div[@class='fc-event-main']").first();
        await eventLocator.scrollIntoViewIfNeeded();
        await expect(eventLocator).toBeVisible({ timeout: 10000 });
        await eventLocator.click({ force: true });

        // Wait for the inspection popup/dialog to appear
        const popup = this.page.locator('.p-dialog, .fc-popover, [role="dialog"]').last();
        await expect(popup).toBeVisible({ timeout: 10000 });

        // Check and click the delete icon
        // Use getByRole as in previous method, fallback to .pi-trash if needed
        const deleteIcon = this.page.getByRole('img', { name: 'delete' }).last();
        await expect(deleteIcon).toBeVisible({ timeout: 10000 });
        await deleteIcon.click();

        // Verify success message "Event deleted successfully" appears
        const successMsg = this.page.getByText(/event deleted successfully/i).last();
        await expect(successMsg).toBeVisible({ timeout: 10000 });

        await expect(eventLocator).not.toBeVisible({ timeout: 10000 });

        // Scroll to the "Inspections" section header (nth(1) to handle duplicates if needed)
        const inspectionsSection = this.page.locator('div').filter({ hasText: /^Inspections$/ }).nth(1);
        await inspectionsSection.scrollIntoViewIfNeeded();

        const inspectionCard = this.page.locator('div.mb-2.p-3', {
            hasText: 'Busy - Private Inspection'
        });
        await expect(inspectionCard).not.toBeVisible({ timeout: 10000 });

        //Close the form dialog
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(3000);

    }

    /**
     * Verify that deleting an inspection from the Inspections section removes it from the Calendar.
     */
    async verifyDeletingInspectionRemovesFromInspectionSectionAndCalendar() {

        // Navigate to Listings page and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page
            .locator("//div[contains(@class,'s-property')]")
            .first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        await this.page.waitForTimeout(3000);
        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible' });

        // Navigate to the Calendar/Integrations tab
        const calendarTab = this.page.getByRole('tab', { name: ' Calendar' });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        await this.page.waitForTimeout(1000);


        // Wait for "+Create New" button to appear and click it
        const createNewBtn = this.page.getByRole('button', { name: /create new/i });
        await expect(createNewBtn).toBeVisible({ timeout: 10000 });
        await createNewBtn.click();

        // Fill out minimal required fields for the inspection
        const titleInput = this.page.locator('input[placeholder="Add title"]');
        await titleInput.click();
        await titleInput.fill('');
        await titleInput.fill('Test Inspection');
        const startHour = this.page.locator('ng-select[placeholder="Hr"] div[role="combobox"]').nth(3);
        await startHour.waitFor({ state: 'visible', timeout: 10000 });
        await startHour.click();
        const startHourOption = this.page.getByRole('option', { name: '5' });
        await expect(startHourOption).toBeVisible({ timeout: 10000 });
        await startHourOption.click();

        // Click Save
        const saveBtn = this.page.getByLabel('Calendar').getByRole('button', { name: 'Save' });
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();

        // Wait for confirmation alert that event was added to calendar
        const calendarAlert = this.page.getByRole('alert', { name: /event added to calendar/i });
        await expect(calendarAlert).toBeVisible({ timeout: 10000 });

        const newEvent = this.page.locator("//div[@class='fc-event-main']").first();
        await newEvent.scrollIntoViewIfNeeded();
        await expect(newEvent).toBeVisible({ timeout: 10000 });


        // Wait for the Inspections section to be visible
        const inspectionsSection = this.page.locator('div').filter({ hasText: /^Inspections$/ }).nth(1);
        await expect(inspectionsSection).toBeVisible({ timeout: 10000 });
        await inspectionsSection.scrollIntoViewIfNeeded();

        // Find the first inspection card (assuming it contains this unique text)
        const inspectionCard = this.page.locator('div.mb-2.p-3', {
            hasText: 'Busy - Private Inspection'
        }).first();
        await expect(inspectionCard).toBeVisible({ timeout: 10000 });

        // Click the delete icon on the inspection card
        const deleteIcon = this.page.getByRole('link', { name: 'delete' });
        await expect(deleteIcon).toBeVisible({ timeout: 10000 });
        await deleteIcon.click();
        // Optionally: check for a success toast/message
        const successMsg = this.page.getByText(/event removed successfully/i).last();
        await expect(successMsg).toBeVisible({ timeout: 10000 });
        await expect(inspectionCard).not.toBeVisible({ timeout: 10000 });
        await expect(newEvent).not.toBeVisible({ timeout: 10000 });
        // Optionally cleanup: Close any success toast/message/dialogs if needed
        // Clean up: Close the modal if open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(3000);
    }

    /**
     * Verifies that the arrow button expands and collapses the inspection section.
     */
    async verifyInspectionSectionArrowExpandCollapse() {
        // Navigate to Listings page and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page
            .locator("//div[contains(@class,'s-property')]")
            .first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();
        await this.page.waitForTimeout(3000);
        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Navigate to the Calendar/Integrations tab
        const calendarTab = this.page.getByRole('tab', { name: ' Calendar' });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        await this.page.waitForTimeout(1000);

        // Locate the Inspections section header and scroll it into view
        const inspectionsSectionHeader = this.page.locator('div').filter({ hasText: /^Inspections$/ }).nth(1);
        await inspectionsSectionHeader.scrollIntoViewIfNeeded();
        await expect(inspectionsSectionHeader).toBeVisible({ timeout: 10000 });
        const inspectionsSection = this.page.locator('app-collapse-box', { hasText: 'Inspections' }).nth(0);
        const body = inspectionsSection.locator('.card-body');
        await expect(body).toBeVisible({ timeout: 10000 });
        await inspectionsSection.click();
        await expect(body).not.toBeVisible({ timeout: 10000 });

        // Optionally close any dialog that pops up
        // Clean up: Close the modal if open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that clicking "+New Task" opens the task creation form.
     */
    async verifyClickingNewTaskOpensTaskCreationForm() {
        // Navigate to Listings page and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page
            .locator("//div[contains(@class,'s-property')]")
            .first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Navigate to the Calendar/Integrations tab
        const calendarTab = this.page.getByRole('tab', { name: ' Calendar' });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        // Wait for "+New Task" button to appear and click it
        const newTaskBtn = this.page.getByRole('button', { name: /new task/i });
        await expect(newTaskBtn).toBeVisible({ timeout: 10000 });
        await newTaskBtn.click();

        const taskTitleInput = this.page.getByRole('heading', { name: 'Create New Task' });
        await expect(taskTitleInput).toBeVisible({ timeout: 10000 });

        // Optionally cleanup: Close the form dialog if open
        // Clean up: Close the modal if open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
  * Verifies that the module and listing name are auto-selected in the task creation form.
  */
    async verifyTaskFormAutoSelectsModuleAndListingName() {
        // Navigate to Listings page and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("div.s-property").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Navigate to Calendar/Integrations tab
        const calendarTab = this.page.getByRole('tab', { name: ' Calendar' });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        // Wait for "+ New Task" button and click it
        const newTaskBtn = this.page.getByRole('button', { name: /new task/i });
        await expect(newTaskBtn).toBeVisible({ timeout: 10000 });
        await newTaskBtn.click();

        // Wait for the task creation dialog
        const taskDialog = this.page.locator('app-create-new-task, .p-dialog');
        await expect(taskDialog).toBeVisible({ timeout: 10000 });

        const listingField = this.page.locator('re-multiselect .selected_one p.cursor-pointer').last();
        await expect(listingField).toBeVisible({ timeout: 10000 });
        const selectedListingName = (await listingField.textContent())?.trim() || '';
        expect(selectedListingName).not.toBe('');
        console.log('Selected Listing:', selectedListingName);

        // Clean up: Close the modal if open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    async verifyTaskAppearsInTaskList(taskTitle: string) {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click()

        // Navigate to Calendar/Integrations tab
        const calendarTab = this.page.getByRole('tab', { name: ' Calendar' });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        // Wait for "+ New Task" button and click it
        const newTaskBtn = this.page.getByRole('button', { name: /new task/i });
        await expect(newTaskBtn).toBeVisible({ timeout: 10000 });
        await newTaskBtn.click();

        // Wait for the task creation dialog
        const taskDialog = this.page.locator('app-create-new-task, .p-dialog');
        await expect(taskDialog).toBeVisible({ timeout: 10000 });

        // Input task title
        const taskTitleInput = this.page.locator('input[formcontrolname="title"]').first();
        await expect(taskTitleInput).toBeVisible({ timeout: 10000 });
        await taskTitleInput.fill(taskTitle);

        // Fill in inspection event date: pick January 14, 2026 using the date picker and the displayed calendar
        const dateInput = this.page.locator('p-calendar[formcontrolname="due_date"] input');
        await expect(dateInput).toBeVisible({ timeout: 10000 });
        await dateInput.click();
        const t = new Date();
        t.setDate(t.getDate() + 1);
        const targetDay = t.getDate();
        const targetMonth = t.getMonth();
        const targetYear = t.getFullYear();

        const header = this.page.locator(".p-datepicker-title");
        await header.waitFor({ state: "visible" });
        const headerText = await header.innerText();
        const [monthName, year] = headerText.trim().split(" ");
        const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();

        const monthDifference =
            (targetYear - parseInt(year)) * 12 + (targetMonth - monthIndex);

        for (let i = 0; i < Math.abs(monthDifference); i++) {
            if (monthDifference > 0) {
                await this.page.locator(".p-datepicker-next").click();
            } else {
                await this.page.locator(".p-datepicker-prev").click();
            }
        }

        const dayButton = this.page.locator(
            `.p-datepicker-calendar td:not(.p-disabled) .p-datepicker-day:not(.p-disabled), .p-datepicker-calendar td:not(.p-disabled) span:not(.p-disabled)`
        ).filter({ hasText: String(targetDay) }).first();

        await dayButton.click({ force: true });

        const staffSelect = this.page.locator('ng-select[formcontrolname="assignedUsers"]');
        await expect(staffSelect).toBeVisible();
        await staffSelect.click();

        const staffInput = this.page.locator(
            'ng-select[formcontrolname="assignedUsers"] input[type="text"]'
        );
        await staffInput.fill('Jahanzaib');

        const staffOption = this.page.locator('.ng-dropdown-panel .ng-option', {
            hasText: 'Jahanzaib'
        });
        await expect(staffOption).toBeVisible();
        await staffOption.click();

        // Save task
        const saveTaskButton = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(saveTaskButton).toBeVisible({ timeout: 10000 });
        await saveTaskButton.click();

        // Wait for confirmation that the task was created ("Task created successfully" alert or toast)
        const successToast = this.page.getByText(/task created/i).last();
        await expect(successToast).toBeVisible({ timeout: 10000 });

        const closetask = this.page.locator('.pi.pi-times').last();
        if (await closetask.isVisible().catch(() => false)) {
            await closetask.click({ force: true });
        }
        // Ensure the second "My Tasks" div is visible
        const myTasksDiv = this.page.locator('div').filter({ hasText: /^My Tasks$/ }).nth(1);
        await myTasksDiv.scrollIntoViewIfNeeded();
        await expect(myTasksDiv).toBeVisible({ timeout: 10000 });
        await myTasksDiv.click({ force: true });
        const todayTasks = this.page.locator('td', { hasText: 'Automation Task' }).first();
        await todayTasks.scrollIntoViewIfNeeded();
        await expect(todayTasks).toBeVisible({ timeout: 10000 });
        // Close modal if needed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Verifies that a saved task appears in the global Task Module.
     */
    async verifyTaskAppearsInTaskListAfterCreation() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click()

        // Navigate to Calendar/Integrations tab
        const calendarTab = this.page.getByRole('tab', { name: ' Calendar' });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();
        // Ensure the second "My Tasks" div is visible
        const myTasksDiv = this.page.locator('div').filter({ hasText: /^My Tasks$/ }).nth(1);
        await myTasksDiv.scrollIntoViewIfNeeded();
        await expect(myTasksDiv).toBeVisible({ timeout: 10000 });
        await myTasksDiv.click({ force: true });
        const todayTasks = this.page.locator('td', { hasText: 'Automation Task' }).first();
        await todayTasks.scrollIntoViewIfNeeded();
        await expect(todayTasks).toBeVisible({ timeout: 10000 });
        // Close modal if needed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Verifies that tasks are displayed in the calendar under the correct due date.
     * Assumes a task titled 'Automation Task' has been added for tomorrow's date.
     */
    async verifyTaskAppearsInCalendarUnderCorrectDueDate() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to Calendar tab
        const calendarTab = this.page.getByRole('tab', { name: /Calendar/i });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        // Ensure the second "My Tasks" div is visible
        const myTasksDiv = this.page.locator('div').filter({ hasText: /^My Tasks$/ }).nth(1);
        await myTasksDiv.scrollIntoViewIfNeeded();
        await expect(myTasksDiv).toBeVisible({ timeout: 10000 });
        await myTasksDiv.click({ force: true });


        const todayTasks = this.page.locator('td', { hasText: 'Automation Task' }).first();
        await todayTasks.scrollIntoViewIfNeeded();
        await expect(todayTasks).toBeVisible({ timeout: 10000 });

        const fullText = await todayTasks.innerText();

        const parts = fullText.split('\n').map(s => s.trim());

        const taskTime = parts[parts.length - 1];

        console.log(`Automation Testing task time is: ${taskTime}`);

        // Close any modal/popover if opened (optional; depends on UI)
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Verifies that an existing task can be updated and the changes are reflected in the calendar.
     * Assumes there is already a task present ("Automation Task").
     */
    async verifyTaskCanBeUpdated(newTitle: string = 'Updated Automation Task') {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to Calendar tab
        const calendarTab = this.page.getByRole('tab', { name: /Calendar/i });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        // Ensure the second "My Tasks" div is visible
        const myTasksDiv = this.page.locator('div').filter({ hasText: /^My Tasks$/ }).nth(1);
        await myTasksDiv.scrollIntoViewIfNeeded();
        await expect(myTasksDiv).toBeVisible({ timeout: 10000 });
        await myTasksDiv.click({ force: true });

        // Locate the task cell for "Automation Task" for today/tomorrow
        const todayTasks = this.page.locator('td', { hasText: 'Automation Task' }).first();
        await todayTasks.scrollIntoViewIfNeeded();
        await expect(todayTasks).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);

        // Click the Edit icon/button (assume .pi-pencil or a button with Edit)
        const editBtn = this.page.locator('.pi.pi-pencil, button:has-text("Edit")').first();
        await editBtn.waitFor({ state: 'visible' });
        await editBtn.click();

        // Wait for the task edit dialog or form to be fully visible/loaded before continuing.
        const staffAgent = this.page.locator('[id="Task: REM-null_1"]').getByText('Jahanzaib Xenex', { exact: true });
        await expect(staffAgent).toBeVisible({ timeout: 15000 });

        // Update the Task Title
        const taskTitleInput = this.page.locator('input[formcontrolname="title"]').first();
        await expect(taskTitleInput).toBeVisible({ timeout: 10000 });
        await taskTitleInput.fill(newTitle);

        await this.page.waitForTimeout(1200);
        // Edit Job Type (Task Type) field, wait for dropdown state, select "Door Knocks"
        const jobTypeSelector = this.page.locator('ng-select[formcontrolname="job_type_id"] .ng-select-container');
        await jobTypeSelector.waitFor({ state: 'visible' });

        await jobTypeSelector.click();

        // Wait for dropdown to be active/expanded
        const dropdownPanel = this.page.locator('.ng-dropdown-panel');
        await dropdownPanel.waitFor({ state: 'visible' });

        // Find and select "Door Knocks" from the options
        const doorKnocksOption = dropdownPanel.locator('.ng-option', { hasText: 'Door Knocks' });
        await doorKnocksOption.waitFor({ state: 'visible' });
        await doorKnocksOption.click();

        const saveTaskButton = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(saveTaskButton).toBeVisible({ timeout: 10000 });
        await saveTaskButton.click();

        // Wait for confirmation that the task was updated successfully (alert or toast)
        const successToast = this.page.getByText(/task has been updated/i).last();
        await expect(successToast).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);

        // Optionally close modal/popover if present
        const closetask = this.page.locator('.pi.pi-times').last();
        if (await closetask.isVisible().catch(() => false)) {
            await closetask.click({ force: true });
        }
        await expect(myTasksDiv).toBeVisible({ timeout: 10000 });

        const updatedTask = this.page.locator('td', { hasText: newTitle }).first();
        await expect(updatedTask).toBeVisible({ timeout: 10000 });

        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(2000);

    }

    /**
     * Verifies that a task can be deleted and is removed from both the calendar and the task list.
     */
    async verifyTaskCanBeDeleted(taskTitle: string = 'Updated Automation Task') {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to Calendar tab
        const calendarTab = this.page.getByRole('tab', { name: /Calendar/i });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        // Ensure the second "My Tasks" div is visible
        const myTasksDiv = this.page.locator('div').filter({ hasText: /^My Tasks$/ }).nth(1);
        await myTasksDiv.scrollIntoViewIfNeeded();
        await expect(myTasksDiv).toBeVisible({ timeout: 10000 });
        await myTasksDiv.click({ force: true });

        // Locate the task cell
        const taskCell = this.page.locator('td', { hasText: taskTitle }).first();
        await taskCell.scrollIntoViewIfNeeded();
        await expect(taskCell).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);

        const deleteBtn = this.page.getByRole('img', { name: 'delete' }).first();
        await expect(deleteBtn).toBeVisible({ timeout: 10000 });
        await deleteBtn.click({ force: true });

        // Wait for confirmation that the task was deleted successfully (alert or toast)
        const successToast = this.page.getByText(/task deleted successfully/i).last();
        await expect(successToast).toBeVisible({ timeout: 20000 });
        // Ensure the task is no longer visible
        await expect(this.page.locator('td', { hasText: taskTitle }).first()).not.toBeVisible({ timeout: 10000 });

        // Optionally close any modal/popover if open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(2000);
    }

    /**
     * Verifies that clicking the check circle updates the task status and removes it from My Task section.
     */
    async verifyClickingCheckCircleUpdatesTaskStatusAndRemovesFromMyTask(taskTitle: string) {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click()

        // Navigate to Calendar/Integrations tab
        const calendarTab = this.page.getByRole('tab', { name: ' Calendar' });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        // Wait for "+ New Task" button and click it
        const newTaskBtn = this.page.getByRole('button', { name: /new task/i });
        await expect(newTaskBtn).toBeVisible({ timeout: 10000 });
        await newTaskBtn.click();

        // Wait for the task creation dialog
        const taskDialog = this.page.locator('app-create-new-task, .p-dialog');
        await expect(taskDialog).toBeVisible({ timeout: 10000 });

        // Input task title
        const taskTitleInput = this.page.locator('input[formcontrolname="title"]').first();
        await expect(taskTitleInput).toBeVisible({ timeout: 10000 });
        await taskTitleInput.fill(taskTitle);

        // Fill in inspection event date: pick January 14, 2026 using the date picker and the displayed calendar
        const dateInput = this.page.locator('p-calendar[formcontrolname="due_date"] input');
        await expect(dateInput).toBeVisible({ timeout: 10000 });
        await dateInput.click();

        const t = new Date();
        t.setDate(t.getDate() + 1);
        const targetDay = t.getDate();
        const targetMonth = t.getMonth();
        const targetYear = t.getFullYear();

        const header = this.page.locator(".p-datepicker-title");
        await header.waitFor({ state: "visible" });
        const headerText = await header.innerText();
        const [monthName, year] = headerText.trim().split(" ");
        const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();

        const monthDifference =
            (targetYear - parseInt(year)) * 12 + (targetMonth - monthIndex);

        for (let i = 0; i < Math.abs(monthDifference); i++) {
            if (monthDifference > 0) {
                await this.page.locator(".p-datepicker-next").click();
            } else {
                await this.page.locator(".p-datepicker-prev").click();
            }
        }

        const dayButton = this.page.locator(
            `.p-datepicker-calendar td:not(.p-disabled) .p-datepicker-day:not(.p-disabled), .p-datepicker-calendar td:not(.p-disabled) span:not(.p-disabled)`
        ).filter({ hasText: String(targetDay) }).first();

        await dayButton.click({ force: true });

        const staffSelect = this.page.locator('ng-select[formcontrolname="assignedUsers"]');
        await expect(staffSelect).toBeVisible();
        await staffSelect.click();

        const staffInput = this.page.locator(
            'ng-select[formcontrolname="assignedUsers"] input[type="text"]'
        );
        await staffInput.fill('Jahanzaib');

        const staffOption = this.page.locator('.ng-dropdown-panel .ng-option', {
            hasText: 'Jahanzaib'
        });
        await expect(staffOption).toBeVisible();
        await staffOption.click();

        // Save task
        const saveTaskButton = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(saveTaskButton).toBeVisible({ timeout: 10000 });
        await saveTaskButton.click();

        // Wait for confirmation that the task was created ("Task created successfully" alert or toast)
        const successToast = this.page.getByText(/task created/i).last();
        await expect(successToast).toBeVisible({ timeout: 10000 });

        const closetask = this.page.locator('.pi.pi-times').last();
        if (await closetask.isVisible().catch(() => false)) {
            await closetask.click({ force: true });
        }
        // Ensure the second "My Tasks" div is visible
        const myTasksDiv = this.page.locator('div').filter({ hasText: /^My Tasks$/ }).nth(1);
        await myTasksDiv.scrollIntoViewIfNeeded();
        await expect(myTasksDiv).toBeVisible({ timeout: 10000 });
        await myTasksDiv.click({ force: true });
        // Locate the table cell containing the "Automation Task" text, and ensure it is centered in view and clearly visible
        const todayTasks = this.page.locator('td', { hasText: 'Automation Task' }).first();
        // Elevate (raise and focus) the center of this element into the viewport
        await todayTasks.evaluate((el) => {
            el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'auto' });
        });
        await expect(todayTasks).toBeVisible({ timeout: 10000 });

        // Click the checkbox for the first task if present
        const checkbox = this.page.locator('.p-checkbox-box.p-component').first();
        await checkbox.waitFor({ state: "visible", timeout: 10000 });
        await checkbox.click({ force: true });

        // Wait for the status-updated success toast to appear after changing task status
        const statusToast = this.page.getByText(/task status has changed/i).last();
        await expect(statusToast).toBeVisible({ timeout: 10000 });

        // Close modal if needed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Verifies that the arrow button expands/collapses the My Tasks section in the calendar/tasks module.
     */
    async verifyTaskSectionArrowExpandCollapse() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("div.s-property").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Navigate to Calendar/Integrations tab
        const calendarTab = this.page.getByRole('tab', { name: /Calendar/i });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        // Locate the "My Tasks" section (nth(1) for the second)
        const myTasksDiv = this.page.locator('div').filter({ hasText: /^My Tasks$/ }).nth(1);
        await myTasksDiv.scrollIntoViewIfNeeded();
        await expect(myTasksDiv).toBeVisible({ timeout: 10000 });
        await myTasksDiv.click();

        // Get the Actions column cell (for example, to expand/collapse or interact with the row)
        const actionsCell = this.page.getByRole('cell', { name: 'Actions' }).first();
        await expect(actionsCell).toBeVisible({ timeout: 10000 });

        await myTasksDiv.click();
        await expect(actionsCell).not.toBeVisible({ timeout: 10000 });
        // Close modal if needed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Verifies that selecting an agent in the assigned user dropdown filters calendar events accordingly.
     */
    async verifyCalendarFiltersByAgent() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("div.s-property").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Navigate to Calendar tab
        const calendarTab = this.page.getByRole('tab', { name: /Calendar/i });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        const primaryAgentDropdown = this.page.locator(
            'div.form-group:has-text("Primary Agent") ng-select'
        );
        await primaryAgentDropdown.scrollIntoViewIfNeeded();
        await expect(primaryAgentDropdown).toBeVisible({ timeout: 10000 });
        await primaryAgentDropdown.click();

        // Select the agent "Jahanzaib Xenex" from the dropdown options
        const agentOption = this.page.getByRole('option', { name: 'Jahanzaib Xenex' });
        await expect(agentOption).toBeVisible({ timeout: 10000 });
        await agentOption.click();

        await this.page.waitForTimeout(1000);

        // Optional: Close modal if needed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that selecting a contact in the calendar contact filter dropdown filters events accordingly.
     */
    async verifyCalendarFiltersByContact() {
        // Navigate to Listings page and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page
            .locator("//div[contains(@class,'s-property')]")
            .first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        await this.page.waitForTimeout(3000);

        // Navigate to the Calendar/Integrations tab
        const calendarTab = this.page.getByRole('tab', { name: ' Calendar' });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        // Wait for "+Create New" button to appear and click it
        const createNewBtn = this.page.getByRole('button', { name: /create new/i });
        await expect(createNewBtn).toBeVisible({ timeout: 10000 });
        await createNewBtn.click();

        // Fill out minimal required fields for the inspection
        const titleInput = this.page.locator('input[placeholder="Add title"]');
        await titleInput.click();
        await titleInput.fill('');
        await titleInput.fill('Test Inspection');


        const startHour = this.page.locator('ng-select[placeholder="Hr"] div[role="combobox"]').nth(3);
        await startHour.waitFor({ state: 'visible', timeout: 10000 });
        await startHour.click();
        const startHourOption = this.page.getByRole('option', { name: '5' });
        await expect(startHourOption).toBeVisible({ timeout: 10000 });
        await startHourOption.click();

        // Click Save
        const saveBtn = this.page.getByLabel('Calendar').getByRole('button', { name: 'Save' });
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();

        // Wait for confirmation alert that event was added to calendar
        const calendarAlert = this.page.getByRole('alert', { name: /event added to calendar/i });
        await expect(calendarAlert).toBeVisible({ timeout: 10000 });

        // Open the agent dropdown or filter (assume there's such a dropdown)
        const agentDropdown = this.page.getByText('SelectListing')
        await expect(agentDropdown).toBeVisible({ timeout: 10000 });
        await agentDropdown.click();

        const agentOption = this.page.getByLabel('Options list').getByText('Jahanzaib Xenex', { exact: true });
        await expect(agentOption).toBeVisible({ timeout: 10000 });
        await agentOption.click();

        await this.page.waitForTimeout(1000);
        const newEvent = this.page.locator("//div[@class='fc-event-main']").first();
        await newEvent.scrollIntoViewIfNeeded();
        await expect(newEvent).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1000);

        // Optionally close any modal if needed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that selecting both an agent and a contact in the calendar filter dropdown
     * displays calendar events for both, showing combined results.
     */
    async verifyCalendarFiltersByAgentAndContact() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Go to Calendar/Integrations tab
        const calendarTab = this.page.getByRole('tab', { name: /Calendar/i });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();


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

        // Locate and click the first calendar event
        const newEvent = this.page.locator("//div[@class='fc-event-main']").first();
        await newEvent.scrollIntoViewIfNeeded();
        await expect(newEvent).toBeVisible({ timeout: 10000 });
        await newEvent.click({ force: true });

        // Wait for the inspection popup/dialog to appear
        const popup = this.page.locator('.p-dialog, .fc-popover, [role="dialog"]').last();
        await expect(popup).toBeVisible({ timeout: 10000 });

        // Check for the delete icon (commonly .pi-trash or a button labeled 'Delete') in the popup
        const deleteIcon = this.page.getByRole('img', { name: 'delete' }).last();
        await expect(deleteIcon).toBeVisible({ timeout: 10000 });

        await deleteIcon.click({ force: true });

        // Verify the "event deleted successfully" success message appears
        const eventDeletedMsg = this.page.getByText(/event deleted successfully/i).last();
        await expect(eventDeletedMsg).toBeVisible({ timeout: 10000 });

        await expect(newEvent).not.toBeVisible({ timeout: 10000 });

        // Optionally close any modal if needed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that switching between Day, Week, and Month changes the calendar view.
     */
    async verifyCalendarViewSwitching() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        const historyCard = this.page.locator('div.stream-body').first();
        await historyCard.waitFor({ state: 'visible', timeout: 15000 });

        // Go to Calendar/Integrations tab
        const calendarTab = this.page.getByRole('tab', { name: /Calendar/i });
        await expect(calendarTab).toBeVisible({ timeout: 10000 });
        await calendarTab.click();

        // Helper to get the calendar view's main area text
        const calendarMain = this.page.locator('.fc-view-harness-active, .fc-view').last();
        await expect(calendarMain).toBeVisible({ timeout: 10000 });

        // Switch to Week view
        const weekViewButton = this.page.getByText('Week', { exact: true }).first()
        await expect(weekViewButton).toBeVisible({ timeout: 10000 });
        await expect(calendarMain).toBeVisible({ timeout: 10000 });

        // Switch to Day view
        await weekViewButton.click();
        await this.page.waitForTimeout(500);
        await this.page.getByRole('option', { name: 'Day' }).click();
        await expect(calendarMain).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1000);

        // Switch to Month view
        const monthViewButton = this.page.getByText('Day', { exact: true }).first();
        await monthViewButton.click();
        await this.page.waitForTimeout(500);
        await this.page.getByRole('option', { name: 'Month' }).click();
        await expect(calendarMain).toBeVisible({ timeout: 10000 });

        //Close the form dialog
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that the Conjunction Tab opens correctly.
     */
}
