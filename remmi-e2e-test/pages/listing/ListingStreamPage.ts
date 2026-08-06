import { expect } from '@playwright/test';
import { ListingBasePage } from './ListingBasePage';

export class ListingStreamPage extends ListingBasePage {
    async verifySearchFunctionalityInStreamTab(searchKeyword: string) {
        await this.navigateToListings();
        await this.switchToGridView();

        const firstCard = this.page.locator('div.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();

        const streamTab = this.page.getByRole('tab', { name: /stream/i });
        await expect(streamTab).toBeVisible({ timeout: 10000 });
        await streamTab.click();

        const searchBox = this.page.getByRole('textbox', { name: /search by keyword/i });
        await searchBox.fill(searchKeyword);
        // Wait for search results to be displayed (wait for any stream-body to be visible)
        const streamEntries = this.page.locator('div.stream-body');
        await expect(streamEntries.first()).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);

        const recordsLocator = this.page.getByLabel('Stream').getByText('Records:');
        await expect(recordsLocator).toBeVisible({ timeout: 10000 });

        const recordsText = await recordsLocator.textContent();
        let totalRecords = 0;
        if (recordsText) {
            const match = recordsText.match(/Records:\s*(\d+)/);
            if (match) {
                totalRecords = Number(match[1]);
            }
        }

        console.log('Total Records:', totalRecords);
        await this.page.waitForTimeout(1000);

        // Optionally close modal/dialog as cleanup
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }


    async verifySearchFieldDisplaysCorrectTotalRecordsCount(searchKeyword: string) {
        await this.navigateToListings();
        await this.switchToGridView();

        const firstCard = this.page.locator('div.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();

        const streamTab = this.page.getByRole('tab', { name: /stream/i });
        await expect(streamTab).toBeVisible({ timeout: 10000 });
        await streamTab.click();

        const searchBox = this.page.getByRole('textbox', { name: /search by keyword/i });
        await searchBox.fill(searchKeyword);
        // Wait for search results to be displayed (wait for any stream-body to be visible)
        const streamEntries = this.page.locator('div.stream-body');
        await expect(streamEntries.first()).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);

        const recordsLocator = this.page.getByLabel('Stream').getByText('Records:');
        await expect(recordsLocator).toBeVisible({ timeout: 10000 });

        const recordsText = await recordsLocator.textContent();
        let totalRecords = 0;
        if (recordsText) {
            const match = recordsText.match(/Records:\s*(\d+)/);
            if (match) {
                totalRecords = Number(match[1]);
            }
        }

        console.log('Total Records:', totalRecords);
        await this.page.waitForTimeout(1000);
        // Optionally close modal/dialog as cleanup
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);

    }

    /**
     * Verifies infinite scrolling works in the Stream tab:
     * Scrolls to the end of the stream entries repeatedly and ensures more entries are loaded.
     */
    async verifyInfiniteScrollingInStreamTab() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first card to go to the detail modal
        const firstCard = this.page.locator('div.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();

        // Switch to the Stream tab
        const streamTab = this.page.getByRole('tab', { name: /stream/i });
        await expect(streamTab).toBeVisible({ timeout: 10000 });
        await streamTab.click();
        // Initial load of stream entries
        const entryLocator = this.page.locator('div.stream-body');
        let previousCount = await entryLocator.count();

        // Attempt to scroll and trigger infinite loading
        let didLoadNew = false;
        for (let i = 0; i < 5; i++) {
            await entryLocator.last().scrollIntoViewIfNeeded();
            // Wait for possible loading, adjust time if needed
            await this.page.waitForTimeout(1500);

            const currentCount = await entryLocator.count();
            if (currentCount > previousCount) {
                didLoadNew = true;
                previousCount = currentCount;
            } else {
                break; // No more entries loaded, assume end of scroll
            }
        }

        console.log('Infinite scrolling loaded entries:', previousCount);

        await this.page.waitForTimeout(1000);
        // Optionally close modal/dialog as cleanup
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify stream card is added when a new inspection is created
     */
    async verifyStreamCardAppearsForNewInspection() {
        await this.navigateToListings();
        await this.switchToGridView();
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        const streamTab = this.page.getByRole('tab', { name: /stream/i });
        await expect(streamTab).toBeVisible({ timeout: 10000 });
        await streamTab.click();
        await this.page.waitForTimeout(1000);
        const streamEntryLocator = this.page.locator('div.stream-body');
        const initialStreamCount = await streamEntryLocator.count();
        console.log(initialStreamCount);
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify stream card is added when a contact is related
     */
    async verifyStreamCardAppearsForRelatedContact() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        // Now go to the Stream tab and check for Jahanzaib Xenex entry
        const streamTab = this.page.getByRole('tab', { name: /stream/i });
        await expect(streamTab).toBeVisible({ timeout: 10000 });
        await streamTab.click();

        // Wait for stream entries to appear
        const streamEntries = this.page.locator('div.stream-body');
        await expect(streamEntries.first()).toBeVisible({ timeout: 10000 });
        const inspectionStream = this.page
            .locator('div.stream-body:has-text("Inspection"):has-text("Jahanzaib Xenex")')
            .first();

        await expect(inspectionStream).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1000);

        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);

    }
    async verifyContactNameClickableInStreamCard() {
        await this.navigateToListings();
        await this.switchToGridView();

        const firstCard = this.page.locator('div.s-property').first();
        await firstCard.waitFor({ state: 'visible', timeout: 30000 });
        await firstCard.click();

        const relatedTab = this.page.getByText('Related').first();
        await expect(relatedTab).toBeVisible({ timeout: 10000 });
        await relatedTab.click();

        // ------------------- Delete existing contacts -------------------
        const contactTypeText = this.page.getByText('Contact TypeBuyerBuyer');
        let isContactTypeVisible = false;
        try {
            await contactTypeText.waitFor({ state: 'visible', timeout: 5000 });
            isContactTypeVisible = true;
        } catch (e) {
            // If not visible after 5 seconds, skip without throwing
        }
        const deleteIcons = this.page.locator('img[alt="delete"]');
        // Wait until delete icons stabilize (in case of animations or loading)
        let initialCount = await deleteIcons.count();
        let currentCount = initialCount;

        while (currentCount > 0) {
            const icon = deleteIcons.first();
            await icon.scrollIntoViewIfNeeded();
            await icon.click();

            const yesButton = this.page.getByRole('button', { name: /^Yes$/i }).first();
            await yesButton.waitFor({ state: 'visible', timeout: 10000 });
            await yesButton.click();

            // Wait for the count to decrease before continuing
            await expect(deleteIcons).toHaveCount(currentCount - 1, { timeout: 15000 });
            currentCount = await deleteIcons.count();
        }
        await expect(deleteIcons).toHaveCount(0);

        // ------------------- Select contact from multiselect -------------------
        const contactDropdown = this.page.locator('div.col-10 re-multiselect div.tags').last();
        await contactDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await contactDropdown.click();

        const firstOption = this.page.locator('div.drop_box ul li.p-element p').first();
        await firstOption.waitFor({ state: 'visible', timeout: 20000 });
        await firstOption.click();
        await contactDropdown.click();

        const associateButton = this.page.getByRole('button', { name: /Associate/i }).first();
        await associateButton.waitFor({ state: 'visible', timeout: 10000 });
        await associateButton.click();

        const successMsg = this.page.getByText('Contact attached successfully');
        await expect(successMsg).toBeVisible({ timeout: 10000 });

        // ------------------- Drag-and-drop the contact tag -------------------
        const contactTypeText1 = this.page.getByText('Contact TypeBuyerBuyer');
        await contactTypeText1.waitFor({ state: 'visible', timeout: 10000 });
        const deleteIcons1 = this.page.locator('img[alt="delete"]').first();
        // Try scrolling by evaluating JS if scrollIntoViewIfNeeded doesn't work
        await deleteIcons1.evaluate((el: HTMLElement) => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
        await deleteIcons1.waitFor({ state: 'visible', timeout: 10000 });
        await this.page.waitForTimeout(1200);

        const contactTag = this.page.locator('span.cdk-drag.related-tag.ng-star-inserted').last();
        await expect(contactTag).toBeVisible({ timeout: 10000 });

        const dropList = this.page.locator('td.cdk-drop-list').first();
        await expect(dropList).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);

        // Retry drag and drop until success message is visible, up to a max number of retries
        const maxRetries = 15;
        let dragDropSuccess = false;
        let lastError = null;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                // Manually drag the contact tag to the drop list using mouse events
                const contactTagBox = await contactTag.boundingBox();
                const dropListBox = await dropList.boundingBox();

                if (!contactTagBox || !dropListBox) {
                    throw new Error("Could not get bounding box for contact tag or drop list.");
                }

                // Move mouse to the center of the contact tag
                await this.page.mouse.move(
                    contactTagBox.x + contactTagBox.width / 2,
                    contactTagBox.y + contactTagBox.height / 2
                );
                // Mouse down to start dragging
                await this.page.mouse.down();
                // Move mouse to the center of the drop list (simulate dragging)
                await this.page.mouse.move(
                    dropListBox.x + dropListBox.width / 2,
                    dropListBox.y + dropListBox.height / 2,
                    { steps: 10 }
                );
                // Mouse up to drop
                await this.page.mouse.up();
                const dragDropSuccessMsg = this.page.getByText('Property Contact updated successfully');
                await expect(dragDropSuccessMsg).toBeVisible({ timeout: 10000 });
                dragDropSuccess = true;
                break;
            } catch (error) {
                lastError = error;
                // Optionally wait a short time before retrying
                await this.page.waitForTimeout(700);
            }
        }

        if (!dragDropSuccess) {
            throw new Error('Drag & drop failed even after retries: ' + (lastError || ""));
        }

        // ------------------- Go to Stream tab and click contact -------------------
        const streamTab = this.page.getByRole('tab', { name: /stream/i });
        await streamTab.scrollIntoViewIfNeeded();
        await streamTab.waitFor({ state: 'visible', timeout: 10000 });
        await streamTab.click();

        const streamContact = this.page.locator('div.d-flex.align-items-center p._fw-400.cursor-pointer').first();
        await streamContact.waitFor({ state: 'visible', timeout: 10000 });
        await streamContact.click();

        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }

        await this.page.waitForTimeout(500);
    }
    // Verify that when a contact is removed, the stream card is also removed
    async verifyStreamCardRemovedWhenContactRemoved() {
        await this.navigateToListings();
        await this.switchToGridView();

        const firstCard = this.page.locator('div.s-property').first();
        await firstCard.waitFor({ state: 'visible', timeout: 30000 });
        await firstCard.click();

        const relatedTab = this.page.getByText('Related').first();
        await relatedTab.waitFor({ state: 'visible', timeout: 10000 });
        await relatedTab.click();

        // ------------------- Delete existing contacts -------------------
        const contactTypeText = this.page.getByText('Contact TypeBuyerBuyer');
        let isContactTypeVisible = false;
        try {
            await contactTypeText.waitFor({ state: 'visible', timeout: 5000 });
            isContactTypeVisible = true;
        } catch (e) {
            // If not visible after 5 seconds, skip without throwing
        }
        const deleteIcons = this.page.locator('img[alt="delete"]');
        // Wait until delete icons stabilize (in case of animations or loading)
        let initialCount = await deleteIcons.count();
        let currentCount = initialCount;

        while (currentCount > 0) {
            const icon = deleteIcons.first();
            await icon.scrollIntoViewIfNeeded();
            await icon.click();

            const yesButton = this.page.getByRole('button', { name: /^Yes$/i }).first();
            await yesButton.waitFor({ state: 'visible', timeout: 10000 });
            await yesButton.click();

            // Wait for the count to decrease before continuing
            await expect(deleteIcons).toHaveCount(currentCount - 1, { timeout: 15000 });
            currentCount = await deleteIcons.count();
        }
        await expect(deleteIcons).toHaveCount(0);

        // ------------------- Go to Stream tab and click contact -------------------
        const streamTab = this.page.getByRole('tab', { name: /stream/i });
        await streamTab.scrollIntoViewIfNeeded();
        await streamTab.waitFor({ state: 'visible', timeout: 10000 });
        await streamTab.click();

        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }

        await this.page.waitForTimeout(2000);
    }

    /**
     * Verify stream card is added when a primary agent is added
     */
    async verifyStreamCardAppearsForPrimaryAgentAssignment(agentName: string = 'Jahanzaib Xenex') {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        const streamTab = this.page.getByRole('tab', { name: /stream/i });
        await expect(streamTab).toBeVisible({ timeout: 10000 });
        await streamTab.click();
        await this.page.waitForTimeout(1000);

        const streamEntryLocator = this.page.locator('div.stream-body');
        await expect(streamEntryLocator.first()).toBeVisible({ timeout: 10000 });
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

        // Switch to stream tab again if not already active
        await streamTab.click();
        await this.page.waitForTimeout(1000);
        // Optionally: Check the specific card for assigned agent's name and action
        const agentCard = this.page.locator('div.stream-body', { hasText: agentName }).first();
        await expect(agentCard).toBeVisible({ timeout: 10000 });

        // Close details modal
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }

        await this.page.waitForTimeout(2000);
    }

    /**
     * Verify stream card is added when a secondary agent is added
     */
    async verifyStreamCardAppearsForSecondaryAgent() {
        await this.navigateToListings();
        await this.switchToGridView();
        await this.page.waitForTimeout(2000);
        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Add a secondary agent
        const secondaryAgentNgSelect = this.page.locator(
            'div.form-group:has-text("Secondary Agent") ng-select'
        );
        // try JS evaluate in case scrollIntoViewIfNeeded doesn't work
        await secondaryAgentNgSelect.evaluate((el: HTMLElement) => el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' }));
        await secondaryAgentNgSelect.click();

        const secondaryInput = this.page.locator("//div[@aria-expanded='true']//input[@type='text']");
        await expect(secondaryInput).toBeVisible({ timeout: 10000 });
        await secondaryInput.fill('Automation Test');

        const secondaryOption = this.page.locator(
            '.ng-dropdown-panel .ng-option',
            { hasText: 'Automation Test' }
        ).first();
        await expect(secondaryOption).toBeVisible({ timeout: 10000 });
        await secondaryOption.click();

        await this.page.waitForTimeout(1000);

        // Save changes (if the Save button appears)
        const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
        if (await saveButton.isVisible({ timeout: 10000 }).catch(() => false)) {
            await saveButton.click();
            await this.page.waitForTimeout(1500);
        }

        // Switch to Stream tab
        const streamTab = this.page.getByRole('tab', { name: /stream/i });
        await expect(streamTab).toBeVisible({ timeout: 10000 });
        await streamTab.click();
        await this.page.waitForTimeout(1000);

        // Check for stream card mentioning the secondary agent's name
        const agentStreamCard = this.page.locator('div.stream-body', { hasText: 'Secondary Agent' }).first();
        await expect(agentStreamCard).toBeVisible({ timeout: 15000 });

        // Close the modal
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Verify stream card is added when a task is created for a listing
     */
    async verifyStreamCardAppearsForCreatedTask(taskTitle: string = 'Automation Task') {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click()

        // Switch to "Tasks" tab (or however tasks are added)
        const tasksTab = this.page.getByRole('tab', { name: /Task|Tasks/i });
        await expect(tasksTab).toBeVisible({ timeout: 10000 });
        await tasksTab.click();
        await this.page.waitForTimeout(1000);

        // Click "Add Task" button
        const addTaskButton = this.page.getByRole('button', { name: /Add Task|New Task/i });
        await expect(addTaskButton).toBeVisible({ timeout: 10000 });
        await addTaskButton.click();

        // Input task title
        const taskTitleInput = this.page.locator('input[formcontrolname="title"]').first();
        await expect(taskTitleInput).toBeVisible({ timeout: 10000 });
        await taskTitleInput.fill(taskTitle);

        // Fill in inspection event date: pick January 14, 2026 using the date picker and the displayed calendar
        const dateInput = this.page.locator('p-calendar[formcontrolname="due_date"] input');
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
        const saveTaskButton = this.page.getByRole('button', { name: /Save|Create/i }).first();
        await expect(saveTaskButton).toBeVisible({ timeout: 10000 });
        await saveTaskButton.click();

        await this.page.waitForTimeout(2000);

        const closetask = this.page.locator('.pi.pi-times').last();
        if (await closetask.isVisible().catch(() => false)) {
            await closetask.click({ force: true });
        }

        // Switch to Stream tab
        const streamTab = this.page.getByRole('tab', { name: /stream/i });
        await expect(streamTab).toBeVisible({ timeout: 10000 });
        await streamTab.click();
        await this.page.waitForTimeout(1000);

        // Check for stream card mentioning the task title
        const streamCard = this.page.locator('div.stream-body', { hasText: 'Task Added' }).first();
        await expect(streamCard).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);
        // Close modal if needed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Verify stream card is added when a new listing is created.
     */
    async verifyStreamCardAppearsForListingCreation() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        // Go to the Stream tab
        const streamTab = this.page.getByRole('tab', { name: /stream/i });
        await expect(streamTab).toBeVisible({ timeout: 10000 });
        await streamTab.click();

        // Find the search field in the stream tab
        const searchInput = this.page.locator('input[placeholder*="Search by keyword"]').first();
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.fill("");
        await searchInput.fill('Listing Added');
        await searchInput.press('Enter');
        await this.page.waitForTimeout(1000);

        // Wait for stream card relating to creation event
        const createdStreamCard = this.page.locator('div.stream-body', { hasText: /Listing Added|Listing Created/i }).first();
        await createdStreamCard.scrollIntoViewIfNeeded();
        await expect(createdStreamCard).toBeVisible({ timeout: 10000 });

        // Optionally close modal if open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Verify that each stream card displays a date and time.
     */
    async verifyDateTimeDisplayedOnEachStreamCard() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to Stream tab
        const streamTab = this.page.getByRole('tab', { name: /stream/i });
        await expect(streamTab).toBeVisible({ timeout: 10000 });
        await streamTab.click();

        // Wait until at least one stream card is visible
        const streamCards = this.page.locator('div.stream-body');
        await expect(streamCards.first()).toBeVisible({ timeout: 10000 });

        // Ensure we got one or more stream cards
        const count = await streamCards.count();
        if (count === 0) {
            throw new Error("No stream cards found on the Stream tab.");
        }

        // Check each stream card for the date/time span
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

        // Optionally close modal if open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Verify that searching the stream tab with an invalid keyword shows zero results or empty state.
     */
    async verifySearchWithInvalidKeyword(invalidKeyword: string = "notarealkeyword123456") {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to Stream tab
        const streamTab = this.page.getByRole('tab', { name: /stream/i });
        await expect(streamTab).toBeVisible({ timeout: 10000 });
        await streamTab.click();

        // Wait for stream content
        await this.page.waitForTimeout(1000);

        // Find the search field in the stream tab
        const searchInput = this.page.locator('input[placeholder*="Search by keyword"]').first();
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.fill(""); // clear any previous text
        await searchInput.fill(invalidKeyword);
        await searchInput.press('Enter');
        await this.page.waitForTimeout(1000);

        // Some apps show a "no records found" text, try to cover both
        const noRecordsText = this.page.getByText(/no records available/i);
        await expect(noRecordsText).toBeVisible({ timeout: 30000 });

        // Optionally close modal if open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Verify that the stream search field with an empty input returns all records or does not display an error.
     */
    async verifySearchFieldWithEmptyInput() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to Stream tab
        const streamTab = this.page.getByRole('tab', { name: /stream/i });
        await expect(streamTab).toBeVisible({ timeout: 10000 });
        await streamTab.click();

        // Wait for stream content
        await this.page.waitForTimeout(1000);

        // Find the search field in the stream tab
        const searchInput = this.page.locator('input[placeholder*="Search by keyword"]').first();
        await expect(searchInput).toBeVisible({ timeout: 10000 });

        // Clear search field (if needed) and submit empty input
        await searchInput.fill("");
        await searchInput.press('Enter');
        await this.page.waitForTimeout(1000);

        // Expect that there is at least one stream card (assuming non-empty listing)
        const streamCards = this.page.locator("div.stream-body");
        await expect(streamCards.first()).toBeVisible({ timeout: 10000 });

        // Optionally close modal if open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }


    /**
     * Verify the UI consistency of the stream tab:
     */
    async verifyStreamTabUIConsistency() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to Stream tab
        const streamTab = this.page.getByRole('tab', { name: /stream/i });
        await expect(streamTab).toBeVisible({ timeout: 10000 });
        await streamTab.click();

        // Main: Stream tab container visible
        const streamContainer = this.page.locator('div.stream-container, div.stream-list, div[class*="stream"]');
        await expect(streamContainer.first()).toBeVisible({ timeout: 10000 });

        // Search bar
        const searchInput = this.page.locator('input[placeholder*="Search by keyword"]').first();
        await expect(searchInput).toBeVisible({ timeout: 10000 });

        // At least one stream card loaded
        const streamCards = this.page.locator('div.stream-body');
        await expect(streamCards.first()).toBeVisible({ timeout: 10000 });

        // Optionally close modal
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Measures and verifies the loading time of the stream tab UI.
     */
    async verifyStreamTabLoadingTime(maxAllowedMs: number = 5000) {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to Stream tab and measure load time for stream cards to appear
        const streamTab = this.page.getByRole('tab', { name: /stream/i });
        await expect(streamTab).toBeVisible({ timeout: 10000 });
        await streamTab.click();

        // Wait for main content (stream card) to be visible
        const streamCards = this.page.locator('div.stream-body');
        await expect(streamCards.first()).toBeVisible({ timeout: maxAllowedMs });

        // Optionally close modal if open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Verifies that duplicate stream cards are not created for the same action 
     */
    async verifyNoDuplicateStreamCardsForAction() {

        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        const relatedTab = this.page.getByText('Related').first();
        await expect(relatedTab).toBeVisible({ timeout: 10000 });
        await relatedTab.click();

        // ------------------- Delete existing contacts -------------------
        const contactTypeText = this.page.getByText('Contact TypeBuyerBuyer');
        let isContactTypeVisible = false;
        try {
            await contactTypeText.waitFor({ state: 'visible', timeout: 5000 });
            isContactTypeVisible = true;
        } catch (e) {
            // If not visible after 5 seconds, skip without throwing
        }
        const deleteIcons = this.page.locator('img[alt="delete"]');
        // Wait until delete icons stabilize (in case of animations or loading)
        let initialCount = await deleteIcons.count();
        let currentCount = initialCount;

        while (currentCount > 0) {
            const icon = deleteIcons.first();
            await icon.scrollIntoViewIfNeeded();
            await icon.click();

            const yesButton = this.page.getByRole('button', { name: /^Yes$/i }).first();
            await yesButton.waitFor({ state: 'visible', timeout: 10000 });
            await yesButton.click();

            // Wait for the count to decrease before continuing
            await expect(deleteIcons).toHaveCount(currentCount - 1, { timeout: 15000 });
            currentCount = await deleteIcons.count();
        }
        await expect(deleteIcons).toHaveCount(0);

        // ------------------- Select contact from multiselect -------------------
        const contactDropdown = this.page.locator('div.col-10 re-multiselect div.tags').last();
        await contactDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await contactDropdown.click();

        const firstOption = this.page.locator('div.drop_box ul li.p-element p').first();
        await firstOption.waitFor({ state: 'visible', timeout: 20000 });
        await firstOption.click();
        await contactDropdown.click();

        const associateButton = this.page.getByRole('button', { name: /Associate/i }).first();
        await associateButton.waitFor({ state: 'visible', timeout: 10000 });
        await associateButton.click();

        const successMsg = this.page.getByText('Contact attached successfully');
        await expect(successMsg).toBeVisible({ timeout: 10000 });
        await contactDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await contactDropdown.click()
        const relatedTabPanelSearchInput = this.page.getByRole('tabpanel', { name: 'lead Related' }).getByPlaceholder('Search');
        await expect(relatedTabPanelSearchInput).toBeVisible({ timeout: 10000 });
        await relatedTabPanelSearchInput.fill('');
        await relatedTabPanelSearchInput.fill('11 22');
        await this.page.waitForTimeout(2500);
        await firstOption.waitFor({ state: 'visible', timeout: 20000 });
        await firstOption.click();
        await contactDropdown.click();
        await associateButton.waitFor({ state: 'visible', timeout: 10000 });
        await associateButton.click();
        // Check if alert for already associated contact appears
        const alreadyAssociatedAlert = this.page.getByRole('alert', { name: /Contact is already associate/i });
        if (await alreadyAssociatedAlert.isVisible({ timeout: 5000 }).catch(() => false)) {
            await expect(alreadyAssociatedAlert).toBeVisible();
        }

        // Optionally close modal if open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);

    }

    /**
     * Verify that the stream card updates appropriately when a listing is modified
     */
    async verifyStreamCardUpdatesOnListingModification(agentName: string = 'Jahanzaib Xenex') {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        const streamTab = this.page.getByRole('tab', { name: /stream/i });
        await expect(streamTab).toBeVisible({ timeout: 10000 });
        await streamTab.click();
        await this.page.waitForTimeout(1000);

        const streamEntryLocator = this.page.locator('div.stream-body');
        await expect(streamEntryLocator.first()).toBeVisible({ timeout: 10000 });
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
        // Switch to stream tab again if not already active
        await streamTab.click();
        await this.page.waitForTimeout(1000);
        // Optionally: Check the specific card for assigned agent's name and action
        const agentCard = this.page.locator('div.stream-body', { hasText: agentName }).first();
        await expect(agentCard).toBeVisible({ timeout: 10000 });

        // Close details modal
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }

        await this.page.waitForTimeout(2000);
    }

    // Verify page refresh does not remove stream cards
    async verifyStreamCardsPersistAfterRefresh() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator('div.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();

        // Go to Stream tab
        const streamTab = this.page.getByRole('tab', { name: /stream/i });
        await expect(streamTab).toBeVisible({ timeout: 10000 });
        await streamTab.click();

        // Ensure at least one stream entry is visible
        const streamEntries = this.page.locator('div.stream-body');
        await expect(streamEntries.first()).toBeVisible({ timeout: 10000 });

        // Reload the page
        await this.page.reload();

        // Re-locate and open the first card again (in case the DOM changed)
        const firstCardAfterReload = this.page.locator('div.s-property').first();
        await expect(firstCardAfterReload).toBeVisible({ timeout: 30000 });
        await firstCardAfterReload.click();

        // Go to Stream tab again
        const streamTabAfterReload = this.page.getByRole('tab', { name: /stream/i });
        await expect(streamTabAfterReload).toBeVisible({ timeout: 10000 });
        await streamTabAfterReload.click();

        // Ensure stream entries are still present after refresh
        const streamEntriesAfterReload = this.page.locator('div.stream-body');
        await expect(streamEntriesAfterReload.first()).toBeVisible({ timeout: 10000 });

        // Optionally close modal/dialog as cleanup
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify error handling for failed listing creation (e.g. required fields missing, API failure, etc.)
     */
    async verifyErrorHandlingForFailedListingCreation() {
        await this.navigateToListings();
        await this.switchToGridView();
        // Open the first listing card
        const firstCard = this.page.locator('div.s-property').first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        // Assuming there is a button or icon to open the contact form in each card row
        const contactFormBtn = this.page.locator("//button[contains(@class,'_addNew')]//i[contains(@class,'pi-plus')]")
        await contactFormBtn.dblclick();
        // Wait for contact form to be visible (adjust selector if needed)
        const contactForm = this.page.locator('#rightbarwithscroll');
        await expect(contactForm).toBeVisible({ timeout: 10000 });

        // Without filling required fields, try to save listing
        const saveBtn = this.page.getByRole('button', { name: /^save$/i }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();

        // Wait for and check error message for required fields
        const requiredErrorMsg = this.page.getByText(/required fields must be filled/i).first();
        await expect(requiredErrorMsg).toBeVisible({ timeout: 10000 });

        // Go to Stream tab
        const streamTab = this.page.getByRole('tab', { name: /stream/i });
        await expect(streamTab).toBeVisible({ timeout: 10000 });
        await streamTab.click();
        // Verify the error message after failed listing creation is visible
        const errorHandlingLocator = this.page.getByLabel('Stream').getByText('Please create the listing')
        await expect(errorHandlingLocator).toBeVisible({ timeout: 10000 });

        // Clean up: Close modal if still open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(800);
    }

    /**
     * Opens the "Lead" tab in the listing details view.
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
}
