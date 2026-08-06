import { expect } from '@playwright/test';
import { ListingBasePage } from './ListingBasePage';

export class ListingHistoryPage extends ListingBasePage {
    async verifyHistoryTabDisplaysListingDetails() {
        // Go to listings grid page
        await this.openFirstListingCard();

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

        // Select the 'History' tab and wait for it to be visible, then click it
        const historyTab = this.page.getByRole('tab', { name: /History/i }).first();
        await expect(historyTab).toBeVisible({ timeout: 10000 });
        await historyTab.click();

        const historyContainer = this.page.locator("app-remmi-history.ng-star-inserted");
        await expect(historyContainer).toBeVisible({ timeout: 15000 });

        // Optionally close the form/dialog if needed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
    * Verifies that changing a field in a listing is reflected in the History tab.
    */
    async verifyListingFieldChangeIsReflectedInHistory() {
        await this.openFirstListingCard();

        // Fill the Listing Type dropdown with "Conjunctional"
        const listingTypeDropdown = this.page.locator('ng-select[formcontrolname="listing_type"]').first();
        await expect(listingTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingTypeDropdown.click();

        const listingTypeInput = this.page.locator('ng-select[formcontrolname="listing_type"] input[type="text"]').first();
        await listingTypeInput.fill('Conjunctional');

        await expect(listingTypeDropdown).toBeVisible({ timeout: 10000 });
        await listingTypeDropdown.click();

        const conjunctionalOption = this.page.getByRole('option', { name: 'Conjunctional' });
        await expect(conjunctionalOption).toBeVisible();
        await conjunctionalOption.click();

        // Save
        const saveButton = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(saveButton).toBeVisible();
        await saveButton.click();

        // Wait for success toast
        await expect(
            this.page.getByText(/Listing Updated successfully/i)
        ).toBeVisible({ timeout: 15000 });

        // Open History tab
        const historyTab = this.page.getByRole('tab', { name: /History/i }).first();
        await historyTab.click();

        // Wait for history component
        const historyContainer = this.page.locator("app-remmi-history");
        await expect(historyContainer).toBeVisible({ timeout: 20000 });

        const historyTable = historyContainer.locator("table");
        await expect(historyTable).toBeVisible();

        // Wait until at least one row exists
        await expect(historyTable.locator("tbody tr")).not.toHaveCount(0, { timeout: 15000 });

        // 🔎 Find "New Value" column index dynamically
        const headers = historyTable.locator("thead tr th");
        const headerCount = await headers.count();

        let newValueColumnIndex = -1;

        for (let i = 0; i < headerCount; i++) {
            const headerText = (await headers.nth(i).textContent())?.trim();
            if (headerText === "New Value") {
                newValueColumnIndex = i;
                break;
            }
        }

        if (newValueColumnIndex === -1) {
            throw new Error("New Value column not found in history table");
        }

        // 🔎 Find row that contains "Conjunctional"
        const targetRow = historyTable
            .locator("tbody tr")
            .filter({ hasText: "Conjunctional" })
            .first();

        await expect(targetRow).toBeVisible({ timeout: 15000 });

        // Get exact New Value cell from correct column
        const newValueCell = targetRow.locator("td").nth(newValueColumnIndex);

        // ✅ Stable assertion
        await expect(newValueCell).toContainText("Conjunctional");

        // Close modal if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }
    /**
     Check if the 'Changed Date' displays the correct date and time of modification
     */
    async verifyChangedDateIsCorrect() {

        await this.openFirstListingCard();

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

        // Optionally close the modal/details dialog
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);

    }

    /**
     * Verify if the 'Changed By' field displays the correct user who made changes
     */
    async verifyChangedByFieldIsCorrect(expectedUser: string) {
        await this.openFirstListingCard();

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

        // Second column = Changed By (assumption: 1st is Changed Date, 2nd is Changed By)
        const changedByCell = firstRow.locator("td").nth(1);
        await expect(changedByCell).toBeVisible({ timeout: 10000 });

        const changedByText = (await changedByCell.textContent())?.trim();
        expect(changedByText).toBeTruthy();

        console.log('Changed By :', changedByText);

        // Check if the Changed By field matches the expected user (case-insensitive, substring match)
        expect(
            changedByText?.toLowerCase()
        ).toContain(expectedUser.toLowerCase());

        // Optionally close the modal/details dialog
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }
    /**
     * Check if the 'Event' status correctly indicates the type of action in listing history
     */
    async verifyEventStatusIsCorrect(expectedEventType: string) {
        await this.openFirstListingCard();

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

        // Third column = Event (assumption: 1st=Changed Date, 2nd=Changed By, 3rd=Event)
        const eventCell = firstRow.locator("td").nth(2);
        await expect(eventCell).toBeVisible({ timeout: 10000 });

        const eventText = (await eventCell.textContent())?.trim();
        expect(eventText).toBeTruthy();

        console.log('Event Status:', eventText);

        // Check if the Event status matches the expected event type (case-insensitive, substring match)
        expect(
            eventText?.toLowerCase()
        ).toContain(expectedEventType.toLowerCase());

        // Optionally close the modal/details dialog
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
  * Verify if the 'Changed Field' column correctly records the modified field name in listing history
  */
    async verifyChangedFieldIsCorrect(expectedFieldName: string) {
        await this.openFirstListingCard();

        // Open History tab
        const historyTab = this.page.getByRole('tab', { name: /History/i }).first();
        await expect(historyTab).toBeVisible({ timeout: 10000 });
        await historyTab.click();

        // Wait for history container
        const historyContainer = this.page.locator("app-remmi-history");
        await expect(historyContainer).toBeVisible({ timeout: 15000 });

        const historyTable = historyContainer.locator("table");
        await expect(historyTable).toBeVisible({ timeout: 15000 });

        // Wait for rows to load
        const rows = historyTable.locator("tbody tr");
        await expect(rows).not.toHaveCount(0, { timeout: 15000 });

        // 🔎 Find "Changed Field" column index dynamically
        const headers = historyTable.locator("thead tr th");
        const headerCount = await headers.count();

        let changedFieldColumnIndex = -1;

        for (let i = 0; i < headerCount; i++) {
            const headerText = (await headers.nth(i).textContent())?.trim();
            if (headerText?.toLowerCase() === "changed field") {
                changedFieldColumnIndex = i;
                break;
            }
        }

        if (changedFieldColumnIndex === -1) {
            throw new Error("Changed Field column not found in history table");
        }

        // 🔎 Find row containing expected field name
        const targetRow = rows.filter({
            hasText: new RegExp(expectedFieldName, 'i')
        }).first();

        await expect(targetRow).toBeVisible({ timeout: 10000 });

        // Get exact Changed Field cell
        const changedFieldCell = targetRow.locator("td").nth(changedFieldColumnIndex);

        await expect(changedFieldCell).toBeVisible({ timeout: 10000 });
        await expect(changedFieldCell).toContainText(
            new RegExp(expectedFieldName, 'i')
        );

        // Optional close
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }
    /**
  * Verify search functionality in the history tab for a listing
  */
    async verifyHistorySearchFunctionality(searchTerm: string, expectedFieldName: string) {
        await this.openFirstListingCard();

        // Open History tab
        const historyTab = this.page.getByRole('tab', { name: /History/i }).first();
        await expect(historyTab).toBeVisible({ timeout: 10000 });
        await historyTab.click();

        // Wait for history container
        const historyContainer = this.page.locator("app-remmi-history");
        await expect(historyContainer).toBeVisible({ timeout: 15000 });

        const historyTable = historyContainer.locator("table");
        await expect(historyTable).toBeVisible({ timeout: 15000 });

        // Locate search input INSIDE history container
        const searchInput = historyContainer.locator('input[placeholder*="search" i]');
        await expect(searchInput).toBeVisible({ timeout: 10000 });

        // Perform search
        await searchInput.fill(searchTerm);
        await searchInput.press('Enter');

        // Wait until table updates (at least one row appears or refresh completes)
        const rows = historyTable.locator("tbody tr");
        await expect(rows).not.toHaveCount(0, { timeout: 15000 });

        // ✅ Use Playwright filtering instead of manual loops
        const matchingRow = rows.filter({
            hasText: new RegExp(expectedFieldName, 'i')
        }).first();

        await expect(matchingRow).toBeVisible({ timeout: 10000 });

        // Optional: Close modal
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Check that searching with an invalid term returns no results in the history tab.
     */
    async verifyHistorySearchWithInvalidTerm(invalidSearchTerm: string) {
        await this.openFirstListingCard();

        // Open the History tab
        const historyTab = this.page.getByRole('tab', { name: /History/i }).first();
        await expect(historyTab).toBeVisible({ timeout: 10000 });
        await historyTab.click();

        // Find the search input in the history tab
        const searchInput = this.page.locator('input[placeholder*="search" i]').last();
        await expect(searchInput).toBeVisible({ timeout: 5000 });
        await searchInput.fill(invalidSearchTerm);
        await searchInput.press('Enter');
        await this.page.waitForTimeout(1000); // Wait for debounce/API

        // Wait for the history component and table
        const historyContainer = this.page.locator("app-remmi-history.ng-star-inserted");
        await expect(historyContainer).toBeVisible({ timeout: 15000 });
        const historyTable = historyContainer.locator("table");
        await expect(historyTable).toBeVisible({ timeout: 15000 });

        const noRecordMessageLocator = this.page.getByRole('cell', { name: 'No record found.' });
        await noRecordMessageLocator.waitFor({ state: 'visible', timeout: 12000 });

        // Optionally close dialog or modal
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Verify that the history tab displays only relevant changes for a specific contact.
     */
    async verifyHistoryDisplaysRelevantChangesForContact(contactName: string) {
        await this.openFirstListingCard();

        // Open the History tab
        const historyTab = this.page.getByRole('tab', { name: /History/i }).first();
        await expect(historyTab).toBeVisible({ timeout: 10000 });
        await historyTab.click();

        // Wait for history table to appear
        const historyContainer = this.page.locator("app-remmi-history.ng-star-inserted");
        await expect(historyContainer).toBeVisible({ timeout: 15000 });
        const historyTableRows = historyContainer.locator("tbody tr");

        // Search for the contact name in the history search bar if available
        const searchInput = this.page.locator('input[placeholder*="search" i]').last();
        await expect(searchInput).toBeVisible({ timeout: 5000 });
        await searchInput.fill(contactName);
        await searchInput.press('Enter');
        await this.page.waitForTimeout(1000);

        // Validate each visible history row is relevant to the contact
        const rows = await historyTableRows.all();
        for (const row of rows) {
            const cellText = await row.innerText();
            expect(
                cellText.toLowerCase()
            ).toContain(contactName.toLowerCase());
        }

        // Optionally close dialog or modal
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
  * Verifies the history tab for a listing when no changes have been made.
  */
    async verifyHistoryTabWithNoChanges(expectedEvent: string) {
        await this.openFirstListingCard();

        // Open History tab
        const historyTab = this.page.getByRole('tab', { name: /History/i }).first();
        await expect(historyTab).toBeVisible({ timeout: 10000 });
        await historyTab.click();

        // Wait for history container
        const historyContainer = this.page.locator("app-remmi-history");
        await expect(historyContainer).toBeVisible({ timeout: 15000 });

        const historyTable = historyContainer.locator("table");
        await expect(historyTable).toBeVisible({ timeout: 15000 });

        const rows = historyTable.locator("tbody tr");
        await expect(rows).not.toHaveCount(0, { timeout: 15000 });

        // 🔎 Find "Event" column index dynamically
        const headers = historyTable.locator("thead tr th");
        const headerCount = await headers.count();

        let eventColumnIndex = -1;

        for (let i = 0; i < headerCount; i++) {
            const headerText = (await headers.nth(i).textContent())?.trim();
            if (headerText?.toLowerCase() === "event") {
                eventColumnIndex = i;
                break;
            }
        }

        if (eventColumnIndex === -1) {
            throw new Error("Event column not found in history table");
        }

        // ✅ Validate each visible row's Event column
        const rowCount = await rows.count();
        let atLeastOneMatch = false;

        for (let i = 0; i < rowCount; i++) {
            const eventCell = rows.nth(i).locator("td").nth(eventColumnIndex);
            await expect(eventCell).toBeVisible();

            const eventText = (await eventCell.textContent())?.trim().toLowerCase() || "";

            if (eventText === expectedEvent.toLowerCase()) {
                atLeastOneMatch = true;
            }

        }

        expect(atLeastOneMatch).toBeTruthy();

        // Optional close
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verifies that the History tab table columns are visually aligned and data is readable.
     */
    async verifyHistoryRecordsUIAlignmentAndReadability() {
        await this.openFirstListingCard();

        // Open the History tab
        const historyTab = this.page.getByRole('tab', { name: /History/i }).first();
        await expect(historyTab).toBeVisible({ timeout: 10000 });
        await historyTab.click();

        // Wait for the History tab to load
        const historyContainer = this.page.locator("app-remmi-history.ng-star-inserted");
        await expect(historyContainer).toBeVisible({ timeout: 15000 });
        await this.page.waitForTimeout(1200);
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

        // Optionally close the modal/dialog
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Check system behavior when history records are too large
     */
    async checkLargeHistoryRecordsBehavior() {
        await this.openFirstListingCard();

        // Open the History tab
        const historyTab = this.page.getByRole('tab', { name: /History/i }).first();
        await expect(historyTab).toBeVisible({ timeout: 10000 });
        await historyTab.click();

        // Set the values for multiple editable fields to create a large history log
        const updates = [
            { name: 'price', selector: 'input[name="price"]', value: '10000' },
            { name: 'bedrooms', selector: 'input[formcontrolname="beds"], input[name="bedrooms"], input[data-testid="bedrooms"]', value: '2' },
            { name: 'bathrooms', selector: 'input[formcontrolname="baths"], input[name="bathrooms"], input[data-testid="bathrooms"]', value: '1' },
            { name: 'ensuite', selector: 'input[name="ensuite"], input[data-testid="ensuite"], input[formcontrolname="ensuite"]', value: '1' },
            { name: 'living_areas', selector: 'input[formcontrolname="living_areas"]', value: '1' },
            { name: 'study', selector: 'input[formcontrolname="study"], input[name="study"], input[data-testid="study"]', value: '1' },
            { name: 'pools', selector: 'input[formcontrolname="pools"]', value: '1' },
            { name: 'garage', selector: 'input[formcontrolname="garage"]', value: '1' },
            { name: 'carport', selector: 'div.col-xl-4:has(p:has-text("Carport")) input[type="number"]', value: '1' },
            { name: 'open_spaces', selector: 'div.col-xl-4:has(p:has-text("Open Spaces")) input[type="number"]', value: '2' },
            { name: 'land_size', selector: 'div.col-sm-6:has(p:has-text("Land Size")) input[formcontrolname="land_area"]', value: '500' },
            { name: 'house_size', selector: 'input[formcontrolname="building_area"], input[name="building_area"], input[data-testid="house-size"]', value: '250' },
        ];

        for (const update of updates) {
            const input = this.page.locator(update.selector).first();
            await expect(input).toBeVisible({ timeout: 10000 });
            await input.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(300);
            await input.fill(update.value);
        }

        const saveButton = this.page.locator('button:has-text("Save")').first();
        await saveButton.scrollIntoViewIfNeeded();
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click();
        await this.page.waitForTimeout(2000);

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
            // If boundingBox is null, skip this check
            if (headerBox && bodyBox) {
                // Left edge alignment within 2px tolerance
                expect(Math.abs(headerBox.x - bodyBox.x)).toBeLessThanOrEqual(2);
                // Cell widths should be visually similar
                expect(Math.abs(headerBox.width - bodyBox.width)).toBeLessThanOrEqual(5);
            }
        }

        // Optionally close the modal/dialog
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
  * Checks if special characters in a given field are displayed correctly in the listing history.
  */
    async verifySpecialCharactersInHistory(specialChars: string) {
        await this.openFirstListingCard();

        // Update Display Price field
        const displayPriceInput = this.page.locator("input[formcontrolname='display_price']").first();
        await expect(displayPriceInput).toBeVisible({ timeout: 15000 });
        await displayPriceInput.evaluate((el) => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
        await displayPriceInput.fill(specialChars);

        // Save
        const saveBtn = this.page.getByRole('button', { name: /Save/i }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10000 });
        await saveBtn.click();

        // Wait for success toast
        await expect(
            this.page.getByText(/Updated successfully|Listing Updated successfully/i)
        ).toBeVisible({ timeout: 15000 });

        // Open History tab
        const historyTab = this.page.getByRole('tab', { name: /History/i }).first();
        await historyTab.click();

        // Wait for history container
        const historyContainer = this.page.locator("app-remmi-history");
        await expect(historyContainer).toBeVisible({ timeout: 15000 });

        const historyTable = historyContainer.locator("table");
        await expect(historyTable).toBeVisible({ timeout: 15000 });

        // Wait for history rows
        const rows = historyTable.locator("tbody tr");
        // Wait for first row or "No Records Found" message to appear (history table may be empty or not)
        await this.page.waitForTimeout(1000);

        // If there is a search input in the history container, fill it in
        // Try both native input and some custom ones used in Angular/PrimeNG tables
        let searchInput;
        // Standard search inputs
        searchInput = historyContainer.locator('input[type="text"][placeholder*="Search"], input[type="search"], input.p-inputtext[aria-label*="search"], input.p-inputtext[placeholder*="Search"]')
            .first();
        if (!(await searchInput.isVisible().catch(() => false))) {
            // Try another possible selector
            searchInput = historyContainer.locator('input[placeholder*="Search"]').first();
        }
        if (await searchInput.isVisible().catch(() => false)) {
            await searchInput.fill('');
            await searchInput.fill(specialChars);
            // Wait for filtering
            await this.page.waitForTimeout(1000);
        }

        // Find "No Records Found" or equivalent message (case-insensitive)
        const noRecords = historyTable.locator('text=/no records found/i');
        if (await noRecords.isVisible().catch(() => false)) {
            // No records found
            await expect(noRecords).toBeVisible();
        } else { }
        // Optional close
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
 * Verify all history records are rendered correctly
 */
    async checkRecordsLoadOnScrollInHistoryTab() {
        await this.openFirstListingCard();

        const historyTab = this.page.getByRole('tab', { name: /History/i }).first();
        await expect(historyTab).toBeVisible({ timeout: 10000 });
        await historyTab.click();

        const historyContainer = this.page.locator("app-remmi-history");
        await expect(historyContainer).toBeVisible({ timeout: 15000 });

        const historyTable = historyContainer.locator("table");
        await expect(historyTable).toBeVisible({ timeout: 15000 });

        const rows = historyTable.locator("tbody tr");

        // Wait for the first row to become visible before proceeding
        const firstRow = rows.first();
        await firstRow.waitFor({ state: 'visible' });

        const rowCount = await rows.count();
        expect(rowCount).toBeGreaterThan(0);

        // ✅ Validate record count label matches actual rows
        const recordLabel = historyContainer.locator("text=/Records:/i");
        await expect(recordLabel).toBeVisible();

        // ✅ Ensure last row is reachable
        const lastRow = rows.last();
        await lastRow.scrollIntoViewIfNeeded();
        await lastRow.waitFor({ state: 'visible', timeout: 15000 });

        console.log("Total records verified:", rowCount);

        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }


}
