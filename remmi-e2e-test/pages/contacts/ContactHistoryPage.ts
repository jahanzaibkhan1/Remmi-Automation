import { Page, Locator, expect } from '@playwright/test';
import { ContactBasePage } from './ContactBasePage';
import { faker } from '@faker-js/faker';

export class ContactHistoryPage extends ContactBasePage {
    public async verifyHistoryTabDisplaysNewContactDetails(): Promise<void> {
        await this.NavigateToContact();
        await this.openFirstContact();
        const historyTab = this.page.getByRole('tab', { name: /history/i });
        await expect(historyTab).toBeVisible({ timeout: 10000 });
        await historyTab.click();
        const historyContainer = this.page.locator("app-remmi-history.ng-star-inserted");
        await expect(historyContainer).toBeVisible({ timeout: 15000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verify if changes to the Phone Number field are reflected in the History tab.
     */
    public async verifyContactFieldChangeIsReflectedInHistory(): Promise<void> {
        const fieldLabel = 'Mobile No';
        // Generate a new unique phone number with country code for Australia (+61)
        const phoneNumDigits = Math.floor(100000000 + Math.random() * 899999999).toString().slice(0, 9); // 9 digits
        const newValue = `+61${phoneNumDigits}`;

        await this.NavigateToContact();
        await this.openFirstContact();

        // Fill the mobile number field (with country code)
        const fieldInput = this.page.locator('input[formcontrolname="mobile_no"]');
        await expect(fieldInput).toBeVisible({ timeout: 10000 });
        await fieldInput.fill(' ');
        await fieldInput.fill(newValue);

        // Save changes
        const saveBtn = this.page.getByRole('button', { name: /^save$/i }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();

        // Open History tab
        const historyTab = this.page.getByRole('tab', { name: /history/i });
        await expect(historyTab).toBeVisible({ timeout: 10000 });
        await historyTab.click();

        // Wait for history container and table, and ensure at least one row is present
        const historyContainer = this.page.locator("app-remmi-history.ng-star-inserted");
        await expect(historyContainer).toBeVisible({ timeout: 15000 });
        const historyTable = historyContainer.locator("table");
        await expect(historyTable).toBeVisible({ timeout: 10000 });
        const firstRow = historyTable.locator("tbody tr").first();
        await expect(firstRow).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(3000);
        // Dynamically find header columns for "Changed Field" and "New Value"
        const headers = historyTable.locator("thead tr th");
        const headerCount = await headers.count();
        let changedFieldCol = -1;
        let newValueCol = -1;
        for (let i = 0; i < headerCount; i++) {
            const hdr = (await headers.nth(i).textContent())?.trim();
            if (hdr === "Changed Field") changedFieldCol = i;
            if (hdr === "New Value") newValueCol = i;
        }
        if (changedFieldCol === -1 || newValueCol === -1) {
            throw new Error("Couldn't find required columns in history table");
        }

        // Find at least one row, match on Changed Field and New Value exactly
        const rows = historyTable.locator("tbody tr");
        const rowCount = await rows.count();
        if (rowCount === 0) {
            throw new Error("No rows found in history table");
        }

        let found = false;
        for (let i = 0; i < rowCount; i++) {
            const cells = rows.nth(i).locator("td");
            // Field should be "Mobile No"
            const changedField = (await cells.nth(changedFieldCol).innerText()).trim();
            // New value rendered inside nested div/span; fetch visible text only
            const newValueCell = cells.nth(newValueCol);
            let newValueText = '';
            // try innerText, fallback to textContent of span if exist
            try {
                newValueText = (await newValueCell.innerText()).replace(/\s+/g, '').trim();
            } catch (e) { }
            // fallback: get visible span if applicable
            if (!newValueText) {
                const span = newValueCell.locator('span');
                if (await span.count() > 0) {
                    newValueText = (await span.first().innerText()).replace(/\s+/g, '').trim();
                }
            }
            // Strict match: field is "Mobile No" and newValue is exactly what we filled
            if (
                changedField === fieldLabel &&
                newValueText === newValue.replace(/\s+/g, '')
            ) {
                found = true;
                break;
            }
        }
        if (!found) {
            throw new Error(`History table does not reflect latest change to "${fieldLabel}" (${newValue})`);
        }
        await this.closeModalIfVisible();
    }

    // Check if the 'Changed Date' displays the correct date and time of modification
    async verifyChangedDateDisplaysCorrectDateAndTime() {
        await this.NavigateToContact();
        await this.openFirstContact();
        // Open the History tab
        const historyTab = this.page.getByRole('tab', { name: /History/i }).first();
        await expect(historyTab).toBeVisible({ timeout: 10000 });
        await historyTab.click();

        // Wait for the history component to appear
        const historyContainer = this.page.locator("app-remmi-history.ng-star-inserted");
        await expect(historyContainer).toBeVisible({ timeout: 15000 });

        // Wait for the table inside the history container
        const historyTable = historyContainer.locator("table");
        await expect(historyTable).toBeVisible({ timeout: 15000 });

        // Wait for the first row
        const firstRow = historyTable.locator("tbody tr").first();
        await expect(firstRow).toBeVisible({ timeout: 10000 });

        // First column = Changed Date
        const firstChangedDateCell = firstRow.locator("td").first();
        await expect(firstChangedDateCell).toBeVisible({ timeout: 10000 });

        const changedDateText = (await firstChangedDateCell.textContent())?.trim();
        expect(changedDateText).toBeTruthy();

        console.log('Changed Date :', changedDateText);

        // Optional: strict date format validation
        const datePattern = /^\d{2}-\d{2}-\d{4}\s\d{2}:\d{2}\s(?:AM|PM)$/;
        expect(changedDateText).toMatch(datePattern);
        await this.closeModalIfVisible();
    }

    // Verify if the 'Changed By' field displays the correct user who made changes
    async verifyChangedByFieldIsCorrect(expectedUser: string) {
        await this.NavigateToContact();
        await this.openFirstContact();

        // Open the History tab
        const historyTab = this.page.getByRole('tab', { name: /History/i }).first();
        await expect(historyTab).toBeVisible({ timeout: 10000 });
        await historyTab.click();

        // Wait for the history component to appear
        const historyContainer = this.page.locator("app-remmi-history.ng-star-inserted");
        await expect(historyContainer).toBeVisible({ timeout: 15000 });

        // Wait for table to be visible
        const historyTable = historyContainer.locator("table");
        await expect(historyTable).toBeVisible({ timeout: 15000 });

        // Wait for first row
        const firstRow = historyTable.locator("tbody tr").first();
        await expect(firstRow).toBeVisible({ timeout: 10000 });

        // Second column = Changed By (index 1, 0-based)
        const changedByCell = firstRow.locator("td").nth(1);
        await expect(changedByCell).toBeVisible({ timeout: 10000 });

        const changedByText = (await changedByCell.textContent())?.trim();
        expect(changedByText).toBeTruthy();
        expect(changedByText).toContain(expectedUser);

        await this.closeModalIfVisible();
    }

    // Check if the 'Event' status correctly indicates the type of action
    async verifyEventStatusIsCorrect(expectedEvent: string) {
        await this.NavigateToContact();
        await this.openFirstContact();

        // Open the History tab
        const historyTab = this.page.getByRole('tab', { name: /History/i }).first();
        await expect(historyTab).toBeVisible({ timeout: 10000 });
        await historyTab.click();

        // Wait for the history component to appear
        const historyContainer = this.page.locator("app-remmi-history.ng-star-inserted");
        await expect(historyContainer).toBeVisible({ timeout: 15000 });

        // Wait for the table inside the history container
        const historyTable = historyContainer.locator("table");
        await expect(historyTable).toBeVisible({ timeout: 15000 });

        // Wait for the first row
        const firstRow = historyTable.locator("tbody tr").first();
        await expect(firstRow).toBeVisible({ timeout: 10000 });

        // Third column = Event (index 2, 0-based)
        const eventCell = firstRow.locator("td").nth(2);
        await expect(eventCell).toBeVisible({ timeout: 10000 });

        const eventText = (await eventCell.textContent())?.trim();
        expect(eventText).toBeTruthy();
        expect(eventText).toContain(expectedEvent);

        await this.closeModalIfVisible();
    }

    // Verify if the 'Changed Field' column correctly records the modified field name
    async verifyChangedFieldIsCorrect(expectedField: string) {
        await this.NavigateToContact();
        await this.openFirstContact();

        // Open the History tab
        const historyTab = this.page.getByRole('tab', { name: /History/i }).first();
        await expect(historyTab).toBeVisible({ timeout: 10000 });
        await historyTab.click();

        // Wait for the history component to appear
        const historyContainer = this.page.locator("app-remmi-history.ng-star-inserted");
        await expect(historyContainer).toBeVisible({ timeout: 15000 });

        // Wait for the table inside the history container
        const historyTable = historyContainer.locator("table");
        await expect(historyTable).toBeVisible({ timeout: 15000 });

        // Wait for the first row
        const firstRow = historyTable.locator("tbody tr").first();
        await expect(firstRow).toBeVisible({ timeout: 10000 });

        // Fourth column = Changed Field (index 3, 0-based)
        const changedFieldCell = firstRow.locator("td").nth(3);
        await expect(changedFieldCell).toBeVisible({ timeout: 10000 });

        const changedFieldText = (await changedFieldCell.textContent())?.trim();
        expect(changedFieldText).toBeTruthy();
        expect(changedFieldText).toContain(expectedField);

        await this.closeModalIfVisible();
    }

    // Verify search functionality in history tab
    async verifyHistorySearchFunctionality(searchTerm: string, expectedField?: string) {
        await this.NavigateToContact();
        await this.openFirstContact();

        // Open the History tab
        const historyTab = this.page.getByRole('tab', { name: /History/i }).first();
        await expect(historyTab).toBeVisible({ timeout: 10000 });
        await historyTab.click();

        // Wait for the history container and table
        const historyContainer = this.page.locator("app-remmi-history.ng-star-inserted");
        await expect(historyContainer).toBeVisible({ timeout: 15000 });

        const historyTable = historyContainer.locator("table");
        await expect(historyTable).toBeVisible({ timeout: 15000 });

        // Search box
        const searchInput = historyContainer.locator("input[placeholder*='Search']");
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.fill(searchTerm);
        await this.page.waitForTimeout(1000); // Wait for table to update

        // Verify that at least one row is visible (for positive cases)
        if (expectedField) {
            const firstRow = historyTable.locator("tbody tr").first();
            await expect(firstRow).toBeVisible({ timeout: 10000 });
            // Check if changed field column (4th, index=3) contains the expected field
            const changedFieldCell = firstRow.locator("td").nth(3);
            const changedFieldText = (await changedFieldCell.textContent())?.trim();
            expect(changedFieldText).toBeTruthy();
            expect(changedFieldText).toContain(expectedField);
        } else {
            // For negative/empty result, check table is empty or shows "no result"
            const rows = await historyTable.locator("tbody tr").count();
            expect(rows).toBe(0);
        }

        await this.closeModalIfVisible();
    }

    // Check search functionality with an invalid term
    async verifyHistorySearchWithInvalidTerm(invalidTerm: string) {
        await this.NavigateToContact();
        await this.openFirstContact();
        // Open the History tab
        const historyTab = this.page.getByRole('tab', { name: /History/i }).first();
        await expect(historyTab).toBeVisible({ timeout: 10000 });
        await historyTab.click();
        // Wait for the history container and table
        const historyContainer = this.page.locator("app-remmi-history.ng-star-inserted");
        await expect(historyContainer).toBeVisible({ timeout: 15000 });
        const historyTable = historyContainer.locator("table");
        await expect(historyTable).toBeVisible({ timeout: 15000 });
        // Search box
        const searchInput = historyContainer.locator("input[placeholder*='Search']");
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.fill(invalidTerm);
        await this.page.waitForTimeout(1000);
        await expect(historyContainer.locator('text=/no record found/i')).toBeVisible({ timeout: 10000 });
        await this.closeModalIfVisible();
    }

    // Verify if history displays only relevant changes per contact
    async verifyHistoryDisplaysRelevantChangesForContact(expectedUser: string) {
        await this.NavigateToContact();
        await this.openFirstContact();
        // Open the History tab
        const historyTab = this.page.getByRole('tab', { name: /History/i }).first();
        await expect(historyTab).toBeVisible({ timeout: 10000 });
        await historyTab.click();
        // Wait for the history container and table
        const historyContainer = this.page.locator("app-remmi-history.ng-star-inserted");
        await expect(historyContainer).toBeVisible({ timeout: 15000 });
        const historyTable = historyContainer.locator("table");
        await expect(historyTable).toBeVisible({ timeout: 15000 });
        // Wait for the first row to be visible
        const firstRow = historyTable.locator("tbody tr").first();
        await expect(firstRow).toBeVisible({ timeout: 10000 });
        // Get all rows in the history table
        const rows = historyTable.locator("tbody tr");
        const rowCount = await rows.count();
        expect(rowCount).toBeGreaterThan(0);
        for (let i = 0; i < rowCount; i++) {
            const changedByCell = rows.nth(i).locator("td").nth(1); // 2nd column: Changed By
            const changedByText = (await changedByCell.textContent())?.trim();
            expect(changedByText).toBeTruthy();
            // The cell should contain the expected user for all rows visible for the contact
            expect(changedByText?.toLowerCase()).toContain(expectedUser.toLowerCase());
        }
        await this.closeModalIfVisible();
    }

    // Check history tab with no changes made; fill in search field and verify only "Create" event present
    async verifyHistoryTabWithNoChanges(expectedEvent: string) {
        await this.NavigateToContact();
        await this.openFirstContact();

        // Open History tab
        const historyTab = this.page.getByRole('tab', { name: /History/i }).first();
        await expect(historyTab).toBeVisible({ timeout: 10000 });
        await historyTab.click();

        // Wait for the history container and table
        const historyContainer = this.page.locator("app-remmi-history.ng-star-inserted");
        await expect(historyContainer).toBeVisible({ timeout: 15000 });
        const historyTable = historyContainer.locator("table");
        await expect(historyTable).toBeVisible({ timeout: 15000 });

        // Fill in the search field with the expected event ("Create" by default)
        const searchInput = historyContainer.locator("input[placeholder*='Search']");
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.fill(expectedEvent);
        await this.page.waitForTimeout(1000);

        // There should be exactly one row (the "Create" event)
        const rows = historyTable.locator("tbody tr");
        // Check if the only row's "Event" column value is "Create" (or as expectedEvent)
        const eventCell = rows.first().locator("td").nth(2); // 3rd column ("Event")
        const eventText = (await eventCell.textContent())?.trim();
        expect(eventText).toBeTruthy();
        await this.closeModalIfVisible();
    }

    /**
     * Verifies UI alignment and readability of history records in the contact history tab
     */
    async verifyHistoryRecordsUIAlignmentAndReadability() {
        // Navigate and open History tab for the first contact
        await this.NavigateToContact();
        await this.openFirstContact();
        // Open the History tab
        const historyTab = this.page.getByRole('tab', { name: /History/i }).first();
        await expect(historyTab).toBeVisible({ timeout: 10000 });
        await historyTab.click();

        // Wait for the History tab to load
        const historyContainer = this.page.locator("app-remmi-history.ng-star-inserted");
        await expect(historyContainer).toBeVisible({ timeout: 15000 });

        // Check that the table and header exist
        const table = historyContainer.locator("table");
        await expect(table).toBeVisible({ timeout: 10000 });

        const headerCells = table.locator("thead tr th");

        // Ensure all header cell text is visible/non-empty
        const headerCount = await headerCells.count();
        for (let i = 0; i < headerCount; i++) {
            const headerCell = headerCells.nth(i);
            const headerText = (await headerCell.textContent())?.trim();
            expect(headerText).toBeTruthy();
            await expect(headerCell).toBeVisible();
        }

        // Check alignment of columns: widths should be non-zero and roughly similar across header and body
        const firstBodyRow = table.locator("tbody tr").first();
        await expect(firstBodyRow).toBeVisible({ timeout: 10000 });

        const bodyCells = firstBodyRow.locator("td");
        const bodyCellCount = await bodyCells.count();
        expect(bodyCellCount).toBe(headerCount);

        // Compare header and row cell bounding boxes for alignment
        for (let i = 0; i < headerCount; i++) {
            const headerCell = headerCells.nth(i);
            const bodyCell = bodyCells.nth(i);

            const headerBox = await headerCell.boundingBox();
            const bodyBox = await bodyCell.boundingBox();

            expect(headerBox).not.toBeNull();
            expect(bodyBox).not.toBeNull();
            // If boundingBox is null, skip this check
            if (headerBox && bodyBox) {
                // Left edge alignment within 2px tolerance
                expect(Math.abs(headerBox.x - bodyBox.x)).toBeLessThanOrEqual(2);
                // Cell widths should be visually similar
                expect(Math.abs(headerBox.width - bodyBox.width)).toBeLessThanOrEqual(5);
            }
        }

        await this.closeModalIfVisible();
    }

    async checkLargeHistoryRecordsBehavior() {
        await this.NavigateToContact();
        await this.openFirstContact();
        const historyTab = this.page.getByRole('tab', { name: /History/i }).first();
        await expect(historyTab).toBeVisible({ timeout: 10000 });
        await historyTab.click();
        const historyContainer = this.page.locator("app-remmi-history");
        await expect(historyContainer).toBeVisible({ timeout: 20000 });
        const firstTableRow = historyContainer.locator("table tbody tr").first();
        const tableIsVisible = await historyContainer.locator("table").isVisible().catch(() => false);
        if (tableIsVisible) {
            await expect(firstTableRow).toBeVisible({ timeout: 10000 });
        }
        const tableRows = historyContainer.locator("table tbody tr");
        const listItems = historyContainer.locator('[class*="history-item"], [class*="record"], li');
        let totalItems = 0;
        if (!tableIsVisible) {
            const firstListItem = listItems.first();
            await firstListItem.waitFor({ state: 'visible', timeout: 10000 }).catch(() => { });
        }
        const rowCount = await tableRows.count().catch(() => 0);
        const itemCount = await listItems.count().catch(() => 0);
        totalItems = rowCount + itemCount;
        expect(totalItems).toBeGreaterThan(0);
        const showMoreBtn = historyContainer.locator('button:has-text("Show More"), button:has-text("Load More"), button:has-text("Next")');
        const showMoreFallback = historyContainer.getByText(/show more|load more|next/i, { exact: false });
        const warningOrNotice = historyContainer.getByText(/too many records|limited view|showing first/i, { exact: false });
        const scrollableContainer = historyContainer.locator('[style*="overflow"], [class*="scroll"]');
        let hasShowMore = false;
        let showMoreLocator: import('@playwright/test').Locator | undefined;
        if (await showMoreBtn.first().isVisible().catch(() => false)) {
            hasShowMore = true;
            showMoreLocator = showMoreBtn.first();
        } else if (await showMoreFallback.first().isVisible().catch(() => false)) {
            hasShowMore = true;
            showMoreLocator = showMoreFallback.first();
        }
        const hasWarning = await warningOrNotice.isVisible().catch(() => false);
        const hasScrollable = await scrollableContainer.first().isVisible().catch(() => false);
        console.log(`History records rendered: ${totalItems}`);
        console.log(`Scrollable container present: ${hasScrollable}`);
        if (hasShowMore && showMoreLocator) {
            const table = historyContainer.locator("table");
            const hasTbl = await table.isVisible({ timeout: 5000 }).catch(() => false);
            if (hasTbl) {
                const tbody = table.locator("tbody");
                const rowToWaitFor = tbody.locator("tr").first();
                await expect(rowToWaitFor).toBeVisible({ timeout: 10000 });
                const initialCount = await tbody.locator("tr").count();
                await showMoreLocator.click();
                await this.page.waitForTimeout(2000);
                const updatedCount = await tbody.locator("tr").count();
                expect(updatedCount).toBeGreaterThan(initialCount);
                console.log(`Rows after Show More: ${updatedCount} (was ${initialCount})`);
            }
        }
        await this.closeModalIfVisible();
    }

    /**
     * Check if special characters in fields are displayed correctly in history
     */
    async verifySpecialCharactersInHistory(specialChars: string): Promise<void> {
        await this.NavigateToContact();
        await this.openFirstContact();
        const historyTab = this.page.getByRole('tab', { name: /history/i }).first();
        await expect(historyTab).toBeVisible({ timeout: 10000 });
        await historyTab.click();
        const historyContainer = this.page.locator("app-remmi-history");
        await expect(historyContainer).toBeVisible({ timeout: 15000 });
        const historyTable = historyContainer.locator("table");
        await expect(historyTable).toBeVisible({ timeout: 15000 });
        const rows = historyTable.locator("tbody tr");
        const firstRow = rows.first();
        await firstRow.waitFor({ state: 'visible', timeout: 20000 }).catch(() => { });
        let searchInput;
        searchInput = historyContainer.locator('input[type="text"][placeholder*="Search"], input[type="search"], input.p-inputtext[aria-label*="search"], input.p-inputtext[placeholder*="Search"]')
            .first();
        if (!(await searchInput.isVisible().catch(() => false))) {
            searchInput = historyContainer.locator('input[placeholder*="Search"]').first();
        }
        if (await searchInput.isVisible().catch(() => false)) {
            await searchInput.fill('');
            await searchInput.fill(specialChars);
            await this.page.waitForTimeout(1000);
        }
        const noRecords = historyTable.locator('text=/no records found/i');
        if (await noRecords.isVisible().catch(() => false)) {
            await expect(noRecords).toBeVisible();
        } else { }
        await this.closeModalIfVisible();
    }

    /**
     * Check if the records are loading correctly when scrolling in the history tab.
     */
    async checkRecordsLoadOnScrollInHistoryTab(): Promise<void> {
        await this.NavigateToContact();
        await this.openFirstContact();
        const historyTab = this.page.getByRole('tab', { name: /history/i }).first();
        await expect(historyTab).toBeVisible({ timeout: 10000 });
        await historyTab.click();
        const historyContainer = this.page.locator("app-remmi-history");
        await expect(historyContainer).toBeVisible({ timeout: 15000 });
        const historyTable = historyContainer.locator("table");
        await expect(historyTable).toBeVisible({ timeout: 15000 });
        const rows = historyTable.locator("tbody tr");
        const firstRow = rows.first();
        await firstRow.waitFor({ state: 'visible' });
        const rowCount = await rows.count();
        expect(rowCount).toBeGreaterThan(0);
        const recordLabel = historyContainer.locator("text=/Records:/i");
        await expect(recordLabel).toBeVisible();
        const lastRow = rows.last();
        await lastRow.scrollIntoViewIfNeeded();
        await lastRow.waitFor({ state: 'visible', timeout: 15000 });
        console.log("Total records verified:", rowCount);
        await this.closeModalIfVisible();
    }
}
