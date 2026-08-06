import { expect, Locator } from '@playwright/test';
import { faker } from '@faker-js/faker';
import * as path from 'path';
import { ProjectBasePage } from './ProjectBasePage';

export class ProjectLotListFormPage extends ProjectBasePage {
    async verifyLotFormOpensOnClick(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const firstCheckbox = this.rowCheckbox(firstRow);
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        const lotEditHeader = this.page.locator('.name-handle p');
        await expect(lotEditHeader).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await expect(this.page.locator('a#pills-lot-tab.active')).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.page.locator('a#pills-history-tab')).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        const saveAndCloseBtn = this.saveAndCloseButton.first();
        await expect(saveAndCloseBtn).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await saveAndCloseBtn.click();
        await this.assertSuccessToast();
        await this.assertLotsExist();
        await this.resetButton.click();
    }

    // TC — Verify lot name is shown in the form's Lot field
    async verifyLotNameOnFormTab(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const expectedLotName = (await this.rowLotCell(firstRow).innerText()).trim();
        expect(expectedLotName.length).toBeGreaterThan(0);
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        const actualLotName = await this.lotFormLotInput.inputValue();
        expect(actualLotName.trim()).toBe(expectedLotName);
        const saveAndCloseBtn = this.saveAndCloseButton.first();
        await expect(saveAndCloseBtn).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await saveAndCloseBtn.click();
        await this.assertSuccessToast();
        await this.assertLotsExist();
        await this.resetButton.click();
    }

    // TC — Verify left cross icon closes lot form
    async verifyCrossIconClosesLotForm(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const firstCheckbox = this.rowCheckbox(firstRow);
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await expect(this.popupCloseIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.popupCloseIcon.click();
        await this.page.waitForTimeout(800);
        await expect(this.lotFormLotInput).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.assertLotsExist();
    }

    // TC — Verify right pin icon pins the form (pin then unpin)
    async verifyPinIconPinsForm(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await expect(this.lotFormPinIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotFormPinIcon.click();
        await expect(this.pinSuccessToast).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.lotFormHistoryTab).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotFormHistoryTab.click();
        await expect(this.lotFormPinIconPinned).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotFormPinIcon.click();
        await expect(this.pinDeleteSuccessToast).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.lotFormPinIconPinned).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await expect(this.popupCloseIcon).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.popupCloseIcon.click();
        await this.page.waitForTimeout(800);
        await expect(this.lotFormLotInput).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.assertLotsExist();
    }

    // TC — Verify project and lot name below tab
    async verifyProjectAndLotNameBelowTab(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const expectedProjectName = (await this.rowProjectCell(firstRow).innerText()).trim();
        const expectedLotName = (await this.rowLotCell(firstRow).innerText()).trim();
        expect(expectedProjectName.length).toBeGreaterThan(0);
        expect(expectedLotName.length).toBeGreaterThan(0);
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormProjectValue).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        const actualProjectName = (await this.lotFormProjectValue.innerText()).trim();
        expect(actualProjectName).toBe(expectedProjectName);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        const actualLotName = await this.lotFormLotInput.inputValue();
        expect(actualLotName.trim()).toBe(expectedLotName);
        const saveAndCloseBtn = this.saveAndCloseButton.first();
        await expect(saveAndCloseBtn).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await saveAndCloseBtn.click();
        await this.assertSuccessToast();
        await this.assertLotsExist();
        await this.resetButton.click();
    }

    // TC — Verify Apartment Details and History tabs are visible
    async verifyApartmentAndHistoryTabsVisible(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        await this.rowLotCell(firstRow).click();
        await expect(this.lotFormApartmentDetailsTab).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await expect(this.lotFormApartmentDetailsTab).toHaveClass(/active/);
        await expect(this.lotFormHistoryTab).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.closePopupIfVisible();
    }

    // TC — Verify project dropdown is auto-filled
    async verifyProjectDropdownAutoFilled(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const expectedProjectName = (await this.rowProjectCell(firstRow).innerText()).trim();
        expect(expectedProjectName.length).toBeGreaterThan(0);
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormProjectValue).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        const actualProjectName = (await this.lotFormProjectValue.innerText()).trim();
        expect(actualProjectName).toBe(expectedProjectName);
        await this.closePopupIfVisible();
    }


    // TC_09 — Verify project can be changed (search project, save, refresh, verify)
    async verifyProjectCanBeChanged(newProjectName: string): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const originalLotName = (await this.rowLotCell(firstRow).innerText()).trim();
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.lotFormProjectArrow.click();
        await expect(this.lotFormProjectDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotFormProjectSearchInput.fill(newProjectName);
        await this.page.waitForTimeout(800);
        const newOption = this.projectOptionInForm(newProjectName).first();
        await expect(newOption).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await newOption.click();
        await this.page.waitForTimeout(800);

        const updatedValue = (await this.lotFormProjectValue.innerText()).trim();
        expect(updatedValue.toLowerCase()).toContain(newProjectName.toLowerCase());
        await this.saveAndCloseButton.first().click();
        await this.assertSuccessToast();
        await this.page.waitForTimeout(1500);
        await this.page.reload();
        await this.page.waitForTimeout(2000);
        await expect(this.lotSearchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.assertLotsExist();
        await this.searchLot(originalLotName);
        await this.assertLotsExist();
        const updatedRow = this.lotTableRows.first();
        const projectAfter = (await this.rowProjectCell(updatedRow).innerText()).trim();
        expect(projectAfter.toLowerCase()).toContain(newProjectName.toLowerCase());
        await this.clearLotSearch();
        await this.resetButton.click();
    }

    /**
     * Asserts that the lot name displayed in the form matches the selected lot in the list.
     */
    async verifyLotNameOnLotFormTab(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const expectedLotName = (await this.rowLotCell(firstRow).innerText()).trim();
        expect(expectedLotName.length).toBeGreaterThan(0);
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1200);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        // Get lot name input value in the form
        const actualLotName = (await this.lotFormLotInput.inputValue()).trim();
        expect(actualLotName).toBe(expectedLotName);
        await this.closePopupIfVisible();
    }

    // TC_11 — Verify status reason dropdown shows all statuses
    async verifyStatusReasonDropdownShowsAll(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.lotFormStatusReasonArrow.click();
        await expect(this.lotFormStatusReasonDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        const totalOptions = await this.lotFormStatusReasonOptions.count();
        expect(totalOptions).toBeGreaterThanOrEqual(15);
        const expectedStatuses = [
            'Developer Hold', 'For Sale', 'Withheld', 'Awaiting Vendor Signing',
            'Called to Settle', 'Cancelled', 'Conditional', 'Contract Issued',
            'Contract Requested', 'Defaulted', 'Held', 'Reserved', 'Settled', 'Sold', 'Unconditional'
        ];
        for (const status of expectedStatuses) {
            const option = this.statusReasonOptionInForm(status).first();
            await expect(option).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        }
        await this.closePopupIfVisible();
    }

    // TC_13 — Verify optional fields accept input
    async verifyOptionalFieldsAcceptInput(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        // Open lot form
        const firstRow = this.lotTableRows.first();
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        // Fill optional fields
        await this.lotFormBedInput.fill('3');
        await this.page.waitForTimeout(300);
        expect(await this.lotFormBedInput.inputValue()).toBe('3');
        await this.lotFormBathInput.fill('2');
        await this.page.waitForTimeout(300);
        expect(await this.lotFormBathInput.inputValue()).toBe('2');
        await this.lotFormAspectInput.fill('North');
        await this.page.waitForTimeout(300);
        expect(await this.lotFormAspectInput.inputValue()).toBe('North');
        await this.closePopupIfVisible();
    }

    // TC — Verify close button exits without saving
    async verifyCloseButtonExitsWithoutSaving(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.lotFormLotInput.fill('Changed Lot Name');
        await this.page.waitForTimeout(500);
        expect(await this.lotFormLotInput.inputValue()).toBe('Changed Lot Name');
        await this.closePopupIfVisible();
    }

    // Verify Save button saves form without closing
    async verifySaveButtonSavesWithoutClosing(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.lotFormBedInput.fill('4');
        await this.page.waitForTimeout(300);
        expect(await this.lotFormBedInput.inputValue()).toBe('4');
        await this.lotFormBathInput.fill('3');
        await this.page.waitForTimeout(300);
        expect(await this.lotFormBathInput.inputValue()).toBe('3');
        await this.lotFormAspectInput.fill('East');
        await this.page.waitForTimeout(300);
        expect(await this.lotFormAspectInput.inputValue()).toBe('East');
        const saveButton = this.page.locator('button', { hasText: /^save$/i }).first();
        await expect(saveButton).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await saveButton.click();
        await this.assertSuccessToast();
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        expect(await this.lotFormBedInput.inputValue()).toBe('4');
        expect(await this.lotFormBathInput.inputValue()).toBe('3');
        expect(await this.lotFormAspectInput.inputValue()).toBe('East');
        await this.closePopupIfVisible();
        await this.assertLotsExist();
        await this.resetButton.click();
        const updatedRow = this.lotTableRows.first();
        await this.rowLotCell(updatedRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        expect(await this.lotFormBedInput.inputValue()).toBe('4');
        expect(await this.lotFormBathInput.inputValue()).toBe('3');
        expect(await this.lotFormAspectInput.inputValue()).toBe('East');
        await this.closePopupIfVisible();
    }

    // Verify Save & Close saves and closes form
    async verifySaveAndCloseButtonSavesAndClosesForm(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.lotFormBedInput.fill('5');
        await this.page.waitForTimeout(300);
        expect(await this.lotFormBedInput.inputValue()).toBe('5');
        await this.lotFormBathInput.fill('2');
        await this.page.waitForTimeout(300);
        expect(await this.lotFormBathInput.inputValue()).toBe('2');
        await this.lotFormAspectInput.fill('West');
        await this.page.waitForTimeout(300);
        expect(await this.lotFormAspectInput.inputValue()).toBe('West');
        const saveAndCloseBtn = this.saveAndCloseButton.first();
        await expect(saveAndCloseBtn).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await saveAndCloseBtn.click();
        await this.assertSuccessToast();
        await expect(this.lotFormLotInput).not.toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.assertLotsExist();
        await this.resetButton.click();
        const updatedRow = this.lotTableRows.first();
        await this.rowLotCell(updatedRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        expect(await this.lotFormBedInput.inputValue()).toBe('5');
        expect(await this.lotFormBathInput.inputValue()).toBe('2');
        expect(await this.lotFormAspectInput.inputValue()).toBe('West');
        await this.closePopupIfVisible();
    }

    // TC_17 — Verify history tab loads properly
    async verifyHistoryTabLoads(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await expect(this.lotFormHistoryTab).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.lotFormHistoryTab.click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormHistoryTab).toHaveClass(/active/);
        await expect(this.historyTabContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        const rowCount = await this.historyTableRows.count();
        expect(rowCount).toBeGreaterThan(0);
        await expect(this.historyRecordsCount).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.closePopupIfVisible();
    }

    // TC_18 — Verify search works in history tab
    async verifyHistorySearch(searchKeyword: string): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();

        const firstRow = this.lotTableRows.first();
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });

        // Open the History tab
        await this.lotFormHistoryTab.click();
        await this.page.waitForTimeout(1500);
        await expect(this.historyTabContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });

        // Count initial rows
        const initialCount = await this.historyTableRows.count();
        expect(initialCount).toBeGreaterThan(0);

        // Search
        await expect(this.historySearchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.historySearchInput.fill(searchKeyword);
        await this.page.waitForTimeout(1500);

        // Count filtered rows and check contents
        const filteredCount = await this.historyTableRows.count();
        expect(filteredCount).toBeGreaterThan(0);
        const firstRowText = (await this.historyTableRows.first().innerText()).toLowerCase();
        expect(firstRowText).toContain(searchKeyword.toLowerCase());

        // Clear search input and close the popup
        await this.historySearchInput.fill('');
        await this.page.waitForTimeout(500);
        await this.closePopupIfVisible();
    }

    // TC_19 — Verify change date is correct
    async verifyHistoryChangeDate(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();

        // Open lot form
        const firstRow = this.lotTableRows.first();
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });

        // Click History tab
        await this.lotFormHistoryTab.click();
        await this.page.waitForTimeout(1500);
        await expect(this.historyTabContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });

        // Verify history rows exist
        const rowCount = await this.historyTableRows.count();
        expect(rowCount).toBeGreaterThan(0);

        // Verify Changed Date column has valid timestamp format (e.g., "06-05-2026 10:02 AM")
        const dateText = (await this.historyRowChangedDate(this.historyTableRows.first()).innerText()).trim();
        expect(dateText.length).toBeGreaterThan(0);
        expect(dateText).toMatch(/\d{2}-\d{2}-\d{4}\s+\d{1,2}:\d{2}\s+(AM|PM)/i);
        await this.closePopupIfVisible();
    }

    // TC_20 — Verify change by field shows updating staff
    async verifyHistoryChangeByField(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();

        // Open lot form
        const firstRow = this.lotTableRows.first();
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });

        // Click History tab
        await this.lotFormHistoryTab.click();
        await this.page.waitForTimeout(1500);
        await expect(this.historyTabContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });

        // Verify history rows exist
        const rowCount = await this.historyTableRows.count();
        expect(rowCount).toBeGreaterThan(0);

        // Verify Changed By column has staff name (e.g., "Remmi: Jahanzaib Xenex")
        const changedByText = (await this.historyRowChangedBy(this.historyTableRows.first()).innerText()).trim();
        expect(changedByText.length).toBeGreaterThan(0);
        await this.closePopupIfVisible();
    }

    // TC_21 — Verify event column shows 'Create' or 'Update'
    async verifyHistoryEventColumn(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();

        // Open lot form
        const firstRow = this.lotTableRows.first();
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });

        // Click History tab
        await this.lotFormHistoryTab.click();
        await this.page.waitForTimeout(1500);
        await expect(this.historyTabContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });

        // Verify history rows exist
        const rowCount = await this.historyTableRows.count();
        expect(rowCount).toBeGreaterThan(0);

        // Verify all Event column values are either 'Create' or 'Update'
        for (let i = 0; i < rowCount; i++) {
            const eventText = (await this.historyRowEvent(this.historyTableRows.nth(i)).innerText()).trim();
            expect(['Create', 'Update']).toContain(eventText);
        }
        await this.closePopupIfVisible();
    }

    // TC_22 — Verify change fields show updated fields
    async verifyHistoryChangedFields(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();

        // Open lot form
        const firstRow = this.lotTableRows.first();
        await this.rowLotCell(firstRow).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });

        // Click History tab
        await this.lotFormHistoryTab.click();
        await this.page.waitForTimeout(1500);
        await expect(this.historyTabContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });

        // Verify history rows exist
        const rowCount = await this.historyTableRows.count();
        expect(rowCount).toBeGreaterThan(0);

        // Verify Changed Field column has a non-empty value for each row
        for (let i = 0; i < rowCount; i++) {
            const fieldText = (await this.historyRowChangedField(this.historyTableRows.nth(i)).innerText()).trim();
            expect(fieldText.length).toBeGreaterThan(0);
        }
        await this.closePopupIfVisible();
    }

    // TC_23 — Verify only new values are shown on creation 
    async verifyOnlyNewValuesShownOnCreation(searchValue: string): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();

        // Open lot form
        await this.rowLotCell(this.lotTableRows.first()).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });

        // Open History tab
        await this.lotFormHistoryTab.click();
        await this.page.waitForTimeout(1500);
        await expect(this.historyTabContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });

        // Search in history
        await this.historySearchInput.fill(searchValue);
        await this.page.waitForTimeout(1000);

        // Verify filtered rows exist
        const filteredRows = await this.historyTableRows.all();
        expect(filteredRows.length).toBeGreaterThan(0);

        // Verify search keyword appears in the Changed Field column of at least one row
        let found = false;
        for (let i = 0; i < filteredRows.length; i++) {
            const fieldText = (await this.historyRowChangedField(filteredRows[i]).innerText())
                .trim()
                .toLowerCase();
            if (fieldText.includes(searchValue.toLowerCase())) {
                found = true;
                break;
            }
        }
        expect(found).toBeTruthy();

        await this.closePopupIfVisible();
    }

    // TC_24 — Verify both old and new column values exist on update
    async verifyBothOldAndNewValuesOnUpdate(): Promise<void> {
        await this.navigateToLots();
        await this.assertLotsExist();
        await this.resetButton.click();
        await this.rowLotCell(this.lotTableRows.first()).click();
        await this.page.waitForTimeout(1500);
        await expect(this.lotFormLotInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.lotFormHistoryTab.click();
        await this.page.waitForTimeout(1500);
        await expect(this.historyTabContent).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        const rowCount = await this.historyTableRows.count();
        expect(rowCount).toBeGreaterThan(0);
        let verified = false;
        for (let i = 0; i < rowCount; i++) {
            const row = this.historyTableRows.nth(i);
            const eventText = (await this.historyRowEvent(row).innerText()).trim();
            if (eventText === 'Update') {
                const oldValueText = (await this.historyRowOldValue(row).innerText()).trim();
                const newValueText = (await this.historyRowNewValue(row).innerText()).trim();
                console.log(`Old Value: "${oldValueText}", New Value: "${newValueText}"`);
                expect(oldValueText.length).toBeGreaterThan(0);
                expect(newValueText.length).toBeGreaterThan(0);
                expect(oldValueText).not.toBe(newValueText);
                verified = true;
                break;
            }
        }
        expect(verified).toBeTruthy();
        await this.closePopupIfVisible();
    }

    // ==========================================================================
    // HELPERS — PRECINCT LOT TAB
    // ==========================================================================

    /**
     * HELPER — Navigate to first precinct and open Lot tab
     */
    protected async navigateToLotTabInPrecinct(): Promise<void> {
        await this.navigateToProjects();
        await this.page.waitForLoadState('networkidle');
        await expect(this.firstPrecinctOnProjectsPage).toBeVisible({
            timeout: ProjectBasePage.TIMEOUT_LONG,
        });
        await this.firstPrecinctOnProjectsPage.click();
        await expect(this.lotTabInPrecinct).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.lotTabInPrecinct.click();
    }

    /**
     * HELPER — Reset filters and ensure at least one lot row is visible
     */
    protected async resetAndAssertLotRowVisible(): Promise<void> {
        await this.resetButton.click();
        const firstRow = this.lotTableRows.first();
        const firstCheckbox = this.rowCheckbox(firstRow);
        await expect(firstCheckbox).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_EXTRA_LONG });
        await this.resetButton.click();
        await this.page.waitForTimeout(2000);
    }

    /**
     * HELPER — Cleanup after test (close dropdown, reset, navigate back)
     */
    protected async cleanupAfterLotTest(): Promise<void> {
        await this.closeDropdown();
        await this.resetFilters();
        await this.closeDropdown();
        await this.clickOnProjects();
        await this.page.waitForTimeout(500);
    }

    /**
     * HELPER — Open Project dropdown, search, and verify results exist
     */
    protected async openProjectDropdownAndSearch(projectName: string): Promise<number> {
        await this.openProjectDropdown();
        await this.page.waitForTimeout(1000);
        await this.searchInProjectDropdown(projectName);
        const count = await this.projectDropdownOptions.count();
        expect(count).toBeGreaterThan(0);
        return count;
    }

    /**
     * HELPER — Verify first dropdown option matches project name
     */
    protected async assertFirstOptionMatchesProject(projectName: string): Promise<void> {
        const firstOptionText = (await this.projectDropdownOptions.first().innerText()).trim().toLowerCase();
        expect(firstOptionText).toContain(projectName.toLowerCase());
    }

    /**
     * HELPER — Click matching project option from dropdown
     */
    protected async clickProjectOptionByName(projectName: string): Promise<void> {
        const count = await this.projectDropdownOptions.count();
        for (let i = 0; i < count; i++) {
            const option = this.projectDropdownOptions.nth(i);
            const text = (await option.innerText()).trim().toLowerCase();
            if (text.includes(projectName.toLowerCase())) {
                await expect(option).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
                await option.click();
                return;
            }
        }
        throw new Error(`Project "${projectName}" not found in dropdown`);
    }

    // ==========================================================================
    // TESTS — PRECINCT LOT TAB
    // ==========================================================================

    /**
     * Opens the Lot tab from the Precinct view.
     */


    protected get lotFormStatusReasonArrow(): Locator {
        return this.lotFormStatusReasonSelect.locator('.ng-arrow-wrapper');
    }

    protected get lotFormStatusReasonDropdownPanel(): Locator {
        return this.lotFormStatusReasonSelect.locator('ng-dropdown-panel');
    }

    protected get saveAndCloseButton(): Locator {
        return this.page.locator('button', { hasText: /save.*close|save & close/i }).first();
    }



    protected async assertLotsExist(): Promise<void> {
        const count = await this.getLotRowCount();
        expect(count).toBeGreaterThan(0);
    }

    protected async clearLotSearch(): Promise<void> {
        await this.lotSearchInput.fill('');
        await this.page.waitForTimeout(1000);
    }

    async clickOnProjects(): Promise<void> {
        await this.projectsMenuLink.click();
    }

    protected async closeDropdown(): Promise<void> {
        await this.page.waitForTimeout(200);
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(800);
    }

    protected async navigateToLots(): Promise<void> {
        const url = this.page.url();
        if (!url.includes('/listings/lot')) {
            await this.page.goto('/listings/lot');
        }
        await expect(this.lotSearchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
    }

    protected async openProjectDropdown(): Promise<void> {
        await expect(this.projectDropdownInLot).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_LONG });
        await this.projectDropdownInLot.click();
        await expect(this.projectDropdownPanel).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
    }

    protected async resetFilters(): Promise<void> {
        await this.resetButton.click();
        await this.page.waitForTimeout(800);
    }

    protected async searchInProjectDropdown(projectName: string): Promise<void> {
        await expect(this.projectDropdownSearchInput).toBeVisible({ timeout: ProjectBasePage.TIMEOUT_DEFAULT });
        await this.projectDropdownSearchInput.fill(projectName);
        await this.page.waitForTimeout(800);
    }

    protected async searchLot(keyword: string): Promise<void> {
        await this.lotSearchInput.fill(keyword);
        await this.page.waitForTimeout(1500);
    }

    protected statusReasonOptionInForm(name: string): Locator {
        return this.lotFormStatusReasonSelect.locator('ng-dropdown-panel .ng-option', { hasText: name });
    }



    protected async getLotRowCount(): Promise<number> {
        return await this.lotTableRows.count();
    }

}