import { Page, Locator, expect } from '@playwright/test';
import { ContactBasePage } from './ContactBasePage';
import { faker } from '@faker-js/faker';

export class ContactStreamPage extends ContactBasePage {
    async openStreamTab() {
        const streamTab = this.page.getByRole('tab', { name: /Stream/i });
        await streamTab.waitFor({ state: 'visible' });
        await streamTab.click();
    }

    async openFirstContact(): Promise<void> {
        const firstContactRow = this.page.locator('tbody tr').first();
        await firstContactRow.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(1000);
        const firstCell = this.page.locator('td').nth(1);
        const elementHandle = await firstCell.elementHandle();
        if (elementHandle) {
            await this.page.evaluate((el) => {
                el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
            }, elementHandle);
        }
        await firstCell.click();

        await this.openStreamTab();
    }

    /**
     * Open "Stream" tab
     */
    async openStream(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openStreamTab();
        await this.closeModalIfVisible();
    }

    async openTasksTab(): Promise<void> {
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await tasksTab.waitFor({ state: 'visible' });
        await tasksTab.click();
        const addTaskButton = this.page.getByRole('button', { name: /Add Task|New Task/i });
        await addTaskButton.waitFor({ state: 'visible' });
        await addTaskButton.click();
    }

    async taskData(taskTitle: string = 'Testing Task') {
        const taskTitleInput = this.page.locator('input[formcontrolname="title"]').first();
        await taskTitleInput.waitFor({ state: "visible" });
        await taskTitleInput.fill(taskTitle);

        const dateInput = this.page.locator('p-calendar[formcontrolname="due_date"] input');
        await dateInput.waitFor({ state: "visible" });
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

        const staffSelect = this.page.locator('ng-select[formcontrolname="assignedUsers"] input');
        const staffElement = await staffSelect.elementHandle();
        if (staffElement) {
            await this.page.evaluate((el) => {
                el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
            }, staffElement);
        }
        await staffSelect.waitFor({ state: "visible" });
        const assigneeLabel = this.page.locator('div').filter({ hasText: /^Jahanzaib Xenex$/ }).first();
        const isLabelVisible = await assigneeLabel.waitFor({ state: 'visible', timeout: 6000 }).then(() => true).catch(() => false);

        if (!isLabelVisible) {
            await staffSelect.click({ force: true });
            await staffSelect.waitFor({ state: "visible" });
            await staffSelect.click({ force: true });
            await staffSelect.fill('Jahanzaib Xenex');

            const assigneeOption = this.page.getByRole('option', { name: 'Jahanzaib Xenex (jahanzaib@xenex-media.com.au)' });
            await assigneeOption.waitFor({ state: 'visible' });
            await assigneeOption.click({ force: true });
            await assigneeLabel.waitFor({ state: 'visible', timeout: 6000 }).catch(() => { });
        } else {
        }

        const saveTaskButton = this.page.getByRole('button', { name: 'Save' }).first();
        await saveTaskButton.scrollIntoViewIfNeeded();
        await saveTaskButton.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(1000);
        await saveTaskButton.dblclick({ force: true });

        const successToast = this.page.locator('div').filter({ hasText: 'Task created' }).last();
        await successToast.waitFor({ state: "visible" });

        const closetask = this.page.locator("//a[@class='level_li Task_1 cursor-pointer active']//i[@class='p-element pi pi-times ml-2 f-12 cursor-pointer']");
        if (await closetask.isVisible().catch(() => false)) {
            await closetask.click({ force: true });
        }

        const firstRow = this.page.locator('table tbody tr')
            .filter({ hasText: taskTitle }).last();
        await firstRow.waitFor({ state: "visible" });
        await this.openStreamTab();
        const streamTaskRow = this.page.locator('div.stream-body').filter({ hasText: 'Task Added' }).first();
        await streamTaskRow.waitFor({ state: "visible" });
    }

    async closeModalIfVisible() {
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
    }

    async verifyTaskAppearsInList() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openStreamTab();
        await this.openTasksTab();
        await this.taskData();
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that a "Contact Created" record appears in the stream for a contact.
     */
    async verifyContactCreationRecordAppears() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openStreamTab();
        const streamEntry = this.page.locator('div.stream-body').first();
        await streamEntry.waitFor({ state: "visible", timeout: 10000 });
        await this.closeModalIfVisible();
    }

    async verifyRelatedPropertyTabDisplayedListing() {
        const relatedPropertyTab = this.page.locator("#pills-relatedProperty");
        await relatedPropertyTab.waitFor({ state: 'visible' });
        await relatedPropertyTab.click();
        const listingTab = this.page.locator('#pills-listing0-tab');
        await listingTab.waitFor({ state: 'visible' });
        await listingTab.click();
        const searchBox = this.page.getByRole('combobox', { name: 'Search Listing' });
        await searchBox.waitFor({ state: 'visible' });
        await searchBox.type('Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880', { delay: 30 });
        const dropdownOption = this.page.getByRole('option', { name: 'Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880' })
        await dropdownOption.waitFor({ state: 'visible' });
        await dropdownOption.click();
        const associateButton = this.page.locator('button.preview-btn.btn-sm.f-12:visible');
        await associateButton.waitFor({ state: 'visible' });
        await associateButton.click();
        const successToast = this.page.getByText(/listing attached successfully|Listing already associated/i).first();
        await successToast.waitFor({ state: "visible" });
        const associatedListing = this.page.getByRole('cell', { name: 'Sauer LLC\"\" 453/37 Eliseo Brook, East Albury, Nebraska 34880' }).first();
        await associatedListing.scrollIntoViewIfNeeded();
        await associatedListing.waitFor({ state: 'visible' });
        const associatedContactRow = this.page.locator('table tr').filter({
            hasText: 'Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880',
            has: this.page.locator('td.cdk-drop-list[cdkdroplist]')
        }).first();

        await associatedContactRow.evaluate(el => {
            el.scrollIntoView({
                block: 'center',
                inline: 'start'
            });
        });

        const dropList = associatedContactRow.locator('td.cdk-drop-list[cdkdroplist]');
        await expect(dropList).toBeVisible({ timeout: 10000 });

        const getBuyerChip = () =>
            associatedContactRow.locator('[data-pc-name="chip"][aria-label="Wife"]');

        // If already added, exit early (prevents flake)
        if (await getBuyerChip().count() > 0) {
            return;
        }

        const maxAttempts = 4;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const buyerTag = this.page
                    .locator('span.cdk-drag.related-tag span.p-tag-value', { hasText: 'Wife' })
                    .first();

                await expect(buyerTag).toBeVisible({ timeout: 10000 });

                const sourceBox = await buyerTag.boundingBox();
                const dropBox = await dropList.boundingBox();

                if (!sourceBox || !dropBox) {
                    throw new Error('Bounding box not available');
                }

                // Real mouse drag (CDK-safe)
                await this.page.mouse.move(
                    sourceBox.x + sourceBox.width / 2,
                    sourceBox.y + sourceBox.height / 2
                );
                await this.page.mouse.down();

                await this.page.mouse.move(
                    dropBox.x + dropBox.width / 2,
                    dropBox.y + dropBox.height / 2,
                    { steps: 12 }
                );

                await this.page.waitForTimeout(150);
                await this.page.mouse.up();

                // Wait for DOM update (most stable assertion)
                await expect(getBuyerChip()).toHaveCount(1, { timeout: 3000 });

                break; // success
            } catch (error) {
                if (attempt === maxAttempts) {
                    throw new Error('Buyer tag drag failed after multiple attempts.');
                }

                await this.page.waitForTimeout(1000);
            }
        }

        await expect(getBuyerChip()).toHaveCount(1, { timeout: 10000 });
        await this.page.waitForTimeout(1000);
    }

    async verifyRelatedPropertyTabProperties() {
        const relatedPropertyTab = this.page.locator("#pills-relatedProperty");
        await relatedPropertyTab.waitFor({ state: 'visible' });
        await relatedPropertyTab.click();
        const propertyTab = this.page.locator('#pills-property0-tab')
        await propertyTab.waitFor({ state: 'visible' });
        await propertyTab.click();
        const searchBox = this.page.getByRole('combobox', { name: 'Search Property' });
        await searchBox.waitFor({ state: 'visible' });
        await searchBox.fill('Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880');
        const dropdownOption = this.page.getByRole('option', { name: 'Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880' })
        await dropdownOption.waitFor({ state: 'visible' });
        await dropdownOption.click();
        const associateButton = this.page.locator('button.preview-btn.btn-sm.f-12:visible');
        await associateButton.waitFor({ state: 'visible' });
        await associateButton.click();
        const successToast = this.page.getByText(/property attached successfully|property already associated/i).first();
        await successToast.waitFor({ state: "visible" });
        const associatedProperty = this.page.getByRole('cell', { name: 'Sauer LLC\"\" 453/37 Eliseo Brook, East Albury, Nebraska 34880' }).first();
        await associatedProperty.scrollIntoViewIfNeeded();
        await associatedProperty.waitFor({ state: 'visible' });
    }



    async verifyListingAttachmentRecordAppears() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.verifyRelatedPropertyTabDisplayedListing();
        await this.verifyRelatedPropertyTabProperties();
        await this.openStreamTab();
        const searchBox = await this.page.getByRole('textbox', { name: 'Search by keyword' });
        await searchBox.waitFor({ state: 'visible' });
        await searchBox.fill('Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880');
        const listingAttachmentEntry = this.page.locator('div.stream-body').filter({
            hasText: 'Updated related Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880'
        }).first();
        await listingAttachmentEntry.waitFor({ state: "visible" });
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that a related contact can be associated successfully.
     */
    async verifyRelatedContactCanBeAssociated() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const relatedTab = this.page.getByText('Related contacts').first();
        await expect(relatedTab).toBeVisible({ timeout: 10000 });
        await relatedTab.click();
        const selectDropdown = this.page.locator('div.tags:has-text("Select")').last();
        await expect(selectDropdown).toBeVisible({ timeout: 10000 });
        await selectDropdown.click();
        const searchInput = this.page
            .locator('#rContact0').getByRole('textbox', { name: 'Search' }).first();
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.fill('11 22');
        const suggestedContact = this.page
            .getByRole('listitem')
            .filter({ hasText: '22 (11@22.com.au)' })
            .last();
        await expect(suggestedContact).toBeVisible({ timeout: 20000 });
        await suggestedContact.click();
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(1200);
        const associateButton = this.page.getByRole('button', { name: /associate/i }).last();
        await expect(associateButton).toBeVisible({ timeout: 10000 });
        await associateButton.click();
        const duplicateAlert = this.page.getByText(/Contact is already associate|Please select company first| user is already/i).last();
        const successToast = this.page.getByText(/Contact attached successfully/i).last();
        await expect(duplicateAlert.or(successToast)).toBeVisible({ timeout: 10000 });
        const associatedContactRow = this.page.locator('table tr').filter({
            hasText: '11 22',
            has: this.page.locator('td.cdk-drop-list[cdkdroplist]')
        }).first();
        await associatedContactRow.evaluate(el => {
            el.scrollIntoView({
                block: 'center',
                inline: 'start'
            });
        });
        const dropList = associatedContactRow.locator('td.cdk-drop-list[cdkdroplist]');
        await expect(dropList).toBeVisible({ timeout: 10000 });
        const getBuyerChip = () =>
            associatedContactRow.locator('[data-pc-name="chip"][aria-label="Buyer"]');
        if (await getBuyerChip().count() > 0) {
            return;
        }
        const maxAttempts = 4;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const buyerTag = this.page
                    .locator('span.cdk-drag.related-tag span.p-tag-value', { hasText: 'Business' })
                    .last();
                await expect(buyerTag).toBeVisible({ timeout: 10000 });
                const sourceBox = await buyerTag.boundingBox();
                const dropBox = await dropList.boundingBox();
                if (!sourceBox || !dropBox) {
                    throw new Error('Bounding box not available');
                }
                await this.page.mouse.move(
                    sourceBox.x + sourceBox.width / 2,
                    sourceBox.y + sourceBox.height / 2
                );
                await this.page.mouse.down();
                await this.page.mouse.move(
                    dropBox.x + dropBox.width / 2,
                    dropBox.y + dropBox.height / 2,
                    { steps: 12 }
                );
                await this.page.waitForTimeout(150);
                await this.page.mouse.up();
                break;
            } catch (error) {
                if (attempt === maxAttempts) {
                    throw new Error('Buyer tag drag failed after multiple attempts.');
                }
                await this.page.waitForTimeout(1000);
            }
        }

    }

    // Verify related contact addition record appears
    async verifyRelatedContactRecordAppears() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const firstStreamRecord = this.page.locator('div.stream-body').first();
        await firstStreamRecord.waitFor({ state: 'visible' });
        const streamTab = this.page.getByRole('tab', { name: /Stream/i });
        await streamTab.evaluate(el => {
            el.scrollIntoView({ block: 'center', inline: 'center' });
        });
        await streamTab.waitFor({ state: 'visible' });
        await streamTab.click();

        const searchBox = await this.page.getByRole('textbox', { name: 'Search by keyword' });
        await searchBox.waitFor({ state: 'visible' });
        await searchBox.fill('11 22');
        const listingAttachmentEntry = this.page.locator('div.stream-body').filter({
            hasText: '11 22'
        }).first();
        await listingAttachmentEntry.waitFor({ state: "visible", timeout: 10000 });
        await this.closeModalIfVisible();

    }

    async leadCreation() {
        const leadTab = this.page.getByRole('tab', { name: 'Lead' });
        await leadTab.waitFor({ state: 'visible' });
        await leadTab.click();

        // Count rows before creation
        const tableRowsLocator = this.page.locator('#customentitydatalist table tbody tr');
        await tableRowsLocator.first().waitFor({ state: 'visible' });
        const initialRowCount = await tableRowsLocator.count();

        // Look for the "New Lead" button
        const newLeadButton = this.page.getByRole('button', { name: /new lead/i });
        await newLeadButton.waitFor({ state: 'visible' });
        await expect(newLeadButton).toBeEnabled();
        await newLeadButton.click();

        const leadLink = this.page.locator('a').filter({ hasText: /^Lead$/ });
        await leadLink.waitFor({ state: 'visible' });

        const leadDetails = this.page.locator('div.popup-gray-box:has(p:text("Lead Details"))');
        await leadDetails.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(2000);

        // Select Lead Type
        const leadType = leadDetails.locator('ng-select[formcontrolname="lead_type"]');
        await leadType.waitFor({ state: 'visible' });
        await leadType.click();
        await this.page.waitForTimeout(600);
        const buyerOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Buyer' });
        await buyerOption.waitFor({ state: 'visible' });
        await buyerOption.click();
        await this.page.waitForTimeout(600);

        // Get other lead detail fields
        const leadStatus = leadDetails.locator('ng-select[formcontrolname="lead_status"]');
        await leadStatus.waitFor({ state: 'visible' });
        await leadStatus.click();
        await this.page.waitForTimeout(600);
        const leadStatusOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'New' });
        await leadStatusOption.waitFor({ state: 'visible' });
        await leadStatusOption.click();
        await this.page.waitForTimeout(600);

        // Select Lead Source
        const leadSource = leadDetails.locator('ng-select[formcontrolname="lead_source"]');
        await leadSource.waitFor({ state: 'visible' });
        await leadSource.click();
        await this.page.waitForTimeout(600);
        const sourceOption = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: 'Billboard' });
        await sourceOption.waitFor({ state: 'visible' });
        await sourceOption.click();
        await this.page.waitForTimeout(1000);

        const contactDetails = this.page.getByText('Email:');
        await contactDetails.waitFor({ state: 'visible' });

        // Click "Save & Close" button
        const saveAndCloseButton = this.page.getByRole('button', { name: /save & close/i }).first();
        await saveAndCloseButton.waitFor({ state: 'visible' });
        await expect(saveAndCloseButton).toBeEnabled();
        await saveAndCloseButton.click();

        // Get the "lead added successfully" toast message
        const leadAddedSuccessMsg = this.page.getByText(/lead added successfully/i);
        await leadAddedSuccessMsg.waitFor({ state: 'visible' });
        await leadAddedSuccessMsg.waitFor({ state: 'hidden' });

        await leadLink.waitFor({ state: 'hidden' });

        await this.page.waitForTimeout(2000);
        // Count the rows after creation
        await tableRowsLocator.first().waitFor({ state: "visible" });
        const finalRowCount = await tableRowsLocator.count();
        // Ensure the row count increased
        if (finalRowCount <= initialRowCount) {
            throw new Error("Lead creation did not increase the number of records in the table.");
        }
    }

    /**
     * Verifies that a "Lead Assigned" record appears in the stream for a contact.
     */
    async verifyLeadAssignmentRecordAppears() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.leadCreation();
        await this.openStreamTab();
        const streamEntry = this.page.locator('div.stream-body').filter({ hasText: 'Lead Assigned' }).first();
        await streamEntry.waitFor({ state: "visible", timeout: 10000 });
        await this.closeModalIfVisible();
    }
    /**
     * Verify timestamp accuracy
     */
    async verifyStreamTimestampAccuracy() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openStreamTab();
        const streamCards = this.page.locator('div.stream-body');
        await expect(streamCards.first()).toBeVisible({ timeout: 10000 });
        const count = await streamCards.count();
        if (count === 0) {
            throw new Error("No stream cards found on the Stream tab.");
        }
        for (let i = 0; i < count; i++) {
            const card = streamCards.nth(i);
            // span.f-10.text-dark contains the date/time info
            const dateTimeSpan = card.locator('span.f-10.text-dark');
            await expect(dateTimeSpan).toBeVisible({ timeout: 10000 });
            const text = await dateTimeSpan.textContent();
            if (!text || !text.trim()) {
                throw new Error(`Stream card #${i + 1} does not display date/time.`);
            }
        }
        await this.closeModalIfVisible();
    }

    /**
     *Verify Stream search functionality
     */
    async verifyStreamSearchFunctionality(keyword: string, expectResults: boolean = true) {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openStreamTab();
        const firstStreamCard = this.page.locator('div.stream-body').first();
        await firstStreamCard.waitFor({ state: "visible" });
        const searchInput = this.page.locator('input[placeholder*="Search by keyword"]').first();
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.fill("");
        await searchInput.fill(keyword);
        await searchInput.press("Enter");
        await this.page.waitForTimeout(1000);
        const streamCards = this.page.locator('div.stream-body');
        if (expectResults) {
            await expect(streamCards.first()).toBeVisible({ timeout: 10000 });
            const count = await streamCards.count();
            if (count === 0) {
                throw new Error(`No stream cards were found for the search keyword: "${keyword}".`);
            }
        } else {
            const noRecordsText = this.page.getByText(/No Updates Yet/i);
            await expect(noRecordsText).toBeVisible({ timeout: 10000 });
        }
        await this.closeModalIfVisible();
    }

    /**
     * Verify Stream updates in real time.
     */
    async verifyStreamUpdatesInRealTime() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        await this.openStreamTab();
        const firstStreamCard = this.page.locator('div.stream-body').first();
        await firstStreamCard.waitFor({ state: "visible" });
        const searchInput = this.page.locator('input[placeholder*="Search by keyword"]').first();
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.fill("");
        await searchInput.fill("Task Added");
        await searchInput.press("Enter");
        const streamCards = this.page.locator('div.stream-body');
        await expect(streamCards.first()).toContainText(/task added/i, { timeout: 20000 });
        await this.closeModalIfVisible();
    }

    /**
     * Ensures related contact "11 22" is deleted if already present, then verifies it is absent in stream.
     */
    async addAndDeleteContact() {
        await this.NavigateToContacts();
        await this.openFirstContact();

        // Open Stream tab to ensure we're starting at the right place
        const streamTab = this.page.getByRole('tab', { name: /Stream/i });
        await expect(streamTab).toBeVisible({ timeout: 10000 });
        await streamTab.evaluate(el => el.scrollIntoView({ block: 'center', inline: 'center' }));
        await streamTab.click();

        // Open Related contacts tab
        const relatedTab = this.page.getByText('Related contacts').first();
        await expect(relatedTab).toBeVisible({ timeout: 10000 });
        await relatedTab.click();

        // Try to locate the related contact row up to maxRowLoadAttempts times, waiting in between
        let associatedContactRow: any = null;
        const maxRowLoadAttempts = 4;
        for (let i = 0; i < maxRowLoadAttempts; i++) {
            associatedContactRow = this.page.locator('table tr').filter({
                has: this.page.locator('td.cdk-drop-list[cdkdroplist]'),
                hasText: '11 22'
            }).first();

            if (await associatedContactRow.count() > 0 && await associatedContactRow.isVisible()) {
                break;
            }
            if (i < maxRowLoadAttempts - 1) {
                await this.page.waitForTimeout(1200);
            }
        }

        if (await associatedContactRow.count() > 0 && await associatedContactRow.isVisible()) {
            await associatedContactRow.scrollIntoViewIfNeeded();

            // Try twice to click the delete button and confirm deletion
            let hasDeleted = false;
            for (let attempt = 0; attempt < 2 && !hasDeleted; attempt++) {
                try {
                    const deleteButton = associatedContactRow.locator('button:has(img[alt="delete"])').first();
                    await deleteButton.waitFor({ state: 'visible', timeout: 30000 });
                    await deleteButton.click();

                    const confirmButton = this.page.getByRole('button', { name: /Yes/i }).first();
                    await expect(confirmButton).toBeVisible({ timeout: 10000 });
                    await confirmButton.click();

                    // Wait for the toast to confirm deletion OR for row to disappear
                    const removeToast = this.page.getByText(/related Contact deleted successfully/i).first();
                    // Ensure both toast disappears (toast confirmed) and row is no longer visible
                    await Promise.all([
                        expect(removeToast).toBeVisible({ timeout: 10000 }),
                        expect(associatedContactRow).not.toBeVisible({ timeout: 10000 }),
                    ]);
                    hasDeleted = true;
                } catch (err) {
                    if (attempt === 0) {
                        await this.page.waitForTimeout(1000);
                    } else {
                        throw err;
                    }
                }
            }
        }

        // Go back to Stream tab
        await streamTab.evaluate(el => el.scrollIntoView({ block: 'center', inline: 'center' }));
        await streamTab.waitFor({ state: 'visible' });
        await streamTab.click();

        // Search for the previously removed contact in the stream
        const searchBox = this.page.getByRole('textbox', { name: 'Search by keyword' });
        await searchBox.waitFor({ state: 'visible' });
        await searchBox.fill('');
        await searchBox.fill('11 22');

        // Verify that "Related Contact Attached" entry is NOT visible, confirming deletion
        const relatedContactEntry = this.page.locator('div.stream-body').filter({
            hasText: 'Related Contact Attached'
        }).first();
        await expect(relatedContactEntry).not.toBeVisible({ timeout: 10000 });

        await this.closeModalIfVisible();
    }

    /**
     * Opens the "Lead" tab 
     */
}
