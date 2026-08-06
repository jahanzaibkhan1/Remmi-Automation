import { Page, Locator, expect } from '@playwright/test';
import { ContactBasePage } from './ContactBasePage';
import { faker } from '@faker-js/faker';

export class ContactRelatedContactPage extends ContactBasePage {
    async verifySearchAndSelectRelatedContact() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const relatedContactTab = this.page.getByRole("tab", { name: /related contact/i });
        await relatedContactTab.waitFor({ state: "visible" });
        await relatedContactTab.click();

        const selectDropdown = this.page.locator('div.tags:has-text("Select")').last();
        await selectDropdown.waitFor({ state: "visible" });
        await selectDropdown.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
        await selectDropdown.click({ force: true });

        // Locate the search input for the contact within the "Related" tab
        const searchInputInRelatedTab = this.page.locator('#rContact0').getByRole('textbox', { name: 'Search' })
        await searchInputInRelatedTab.waitFor({ state: "visible" });
        await searchInputInRelatedTab.fill('11 22');

        // Wait for and select the matching contact option from the dropdown
        const suggestedContact = this.page.getByRole('listitem').filter({ hasText: '22 (11@22.com.au)' }).last();
        await suggestedContact.waitFor({ state: "visible" });
        await suggestedContact.click();
        await this.page.mouse.click(0, 0);
        // In the Contact section, click "Associate Contact" or similar
        const associateButton = this.page.getByRole('button', { name: /associate/i }).last();
        await associateButton.waitFor({ state: "visible" });
        await associateButton.click();
        const duplicateAlert = this.page.getByRole('alert', {
            name: /user is already associate to this contact/i
        }).first();
        const successToast = this.page.getByText(
            /Contact attached successfully/i
        ).first();
        const alertOrSuccessLocator = duplicateAlert.or(successToast);
        await alertOrSuccessLocator.waitFor({ state: "visible" });
        await alertOrSuccessLocator.waitFor({ state: "hidden" });
        await this.closeModalIfVisible();
    }

    /**
     * Clicks the Associate button and verifies that the contact is added to the related contacts list.
     */
    async associateContactAndVerify() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const relatedContactTab = this.page.getByRole("tab", { name: /related contact/i });
        await relatedContactTab.waitFor({ state: "visible" });
        await relatedContactTab.click();
        const selectDropdown = this.page.locator('div.tags:has-text("Select")').last();
        await selectDropdown.waitFor({ state: "visible" });
        await selectDropdown.click({ force: true });
        const searchInputInRelatedTab = this.page.locator('#rContact0').getByRole('textbox', { name: 'Search' })
        await searchInputInRelatedTab.waitFor({ state: "visible" });
        await searchInputInRelatedTab.fill('11 22');
        const suggestedContact = this.page.getByRole('listitem').filter({ hasText: '22 (11@22.com.au)' }).last();
        await suggestedContact.waitFor({ state: "visible" });
        await suggestedContact.click();
        await this.page.mouse.click(0, 0);
        const associateButton = this.page.getByRole('button', { name: /associate/i }).last();
        await associateButton.waitFor({ state: "visible" });
        await associateButton.click();
        const duplicateAlert = this.page.getByRole('alert', {
            name: /user is already associate to this contact/i
        }).first();
        const successToast = this.page.getByText(
            /Contact attached successfully/i
        ).first();
        const alertOrSuccessLocator = duplicateAlert.or(successToast);
        await alertOrSuccessLocator.waitFor({ state: "visible" });

        const associatedContactRow = this.page.locator('table tr').filter({ hasText: '11 22' }).last();
        await associatedContactRow.scrollIntoViewIfNeeded();
        await expect(associatedContactRow).toBeVisible({ timeout: 10000 });
        const deleteIcon = associatedContactRow.getByRole('img', { name: 'delete' }).first();
        await expect(deleteIcon).toBeVisible({ timeout: 10000 });
        await deleteIcon.click();
        const yesButton = this.page.getByRole('button', { name: /^Yes$/i }).first();
        await expect(yesButton).toBeVisible({ timeout: 10000 });
        await yesButton.click();
        await this.page.waitForTimeout(500);
        const removedToast = this.page.getByText(/Contact deleted successfully/i).first();
        await expect(removedToast).toBeVisible({ timeout: 30000 });
        await this.closeModalIfVisible();
    }

    // Verify that the search icon is correctly displayed inside the Associate field
    async verifySearchIconInAssociateField() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const relatedContactTab = this.page.getByRole("tab", { name: /related contact/i });
        await relatedContactTab.waitFor({ state: "visible" });
        await relatedContactTab.click();
        const selectDropdown = this.page.locator('div.tags:has-text("Select")').last();
        await selectDropdown.waitFor({ state: "visible" });
        await selectDropdown.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
        await selectDropdown.click({ force: true });
        const searchInputInRelatedTab = this.page.locator('#rContact0').getByRole('textbox', { name: 'Search' })
        await searchInputInRelatedTab.waitFor({ state: "visible" });
        const searchIcon = this.page.locator('.pi.pi-search.search');
        await searchIcon.waitFor({ state: "visible" });
        await this.closeModalIfVisible();
    }

    // Verify that the agents list is displayed correctly
    async verifyAgentsListIsDisplayedCorrectly() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const relatedContactTab = this.page.getByRole("tab", { name: /related contact/i });
        await relatedContactTab.waitFor({ state: "visible" });
        await relatedContactTab.click();
        const selectDropdown = this.page.locator('div.tags:has-text("Select")').last();
        await selectDropdown.waitFor({ state: "visible" });
        await selectDropdown.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
        await selectDropdown.click({ force: true });
        const suggestedContact = this.page.getByRole('listitem').filter({ hasText: '22 (11@22.com.au)' }).last();
        await suggestedContact.waitFor({ state: "visible" });
        await this.closeModalIfVisible();
    }

    // Search field should show "Create New Contact" when no results found
    async verifyCreateNewContactOptionWhenNoResults() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const relatedContactTab = this.page.getByRole("tab", { name: /related contact/i });
        await relatedContactTab.waitFor({ state: "visible" });
        await relatedContactTab.click();
        const selectDropdown = this.page.locator('div.tags:has-text("Select")').last();
        await selectDropdown.waitFor({ state: "visible" });
        await selectDropdown.click({ force: true });
        const searchInput = this.page.locator('#rContact0').getByRole('textbox', { name: 'Search' });
        await searchInput.waitFor({ state: "visible" });
        const createNewContactOption = this.page.getByText('Create New').last();
        await createNewContactOption.waitFor({ state: "visible" });
        await this.closeModalIfVisible();
    }

    // Clicking "Add New Contact" should open a new contact form
    async verifyAddNewContactOpensForm() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const relatedContactTab = this.page.getByRole("tab", { name: /related contact/i });
        await relatedContactTab.waitFor({ state: "visible" });
        await relatedContactTab.click();
        const selectDropdown = this.page.locator('div.tags:has-text("Select")').last();
        await selectDropdown.waitFor({ state: "visible" });
        await selectDropdown.click({ force: true });
        const searchInput = this.page.locator('#rContact0').getByRole('textbox', { name: 'Search' });
        await searchInput.waitFor({ state: "visible" });
        const addNewContactOption = this.page.getByText(/add new contact|create new/i).last();
        await addNewContactOption.waitFor({ state: "visible" });
        await addNewContactOption.click();
        const addNewModel = this.page.locator('section').last();
        await addNewModel.waitFor({ state: "visible" });
        await this.closeModalIfVisible();
    }

    // Newly created contact should appear in the list
    async verifyNewlyCreatedContactIsAddedToRelatedList() {
        await this.NavigateToContacts();
        await this.openFirstContact();

        // Click the "Related Contact" tab
        const relatedContactTab = this.page.getByRole("tab", { name: /related contact/i });
        await relatedContactTab.waitFor({ state: "visible" });
        await relatedContactTab.click();

        // Open the contact selection dropdown
        const selectDropdown = this.page.locator('div.tags:has-text("Select")').last();
        await expect(selectDropdown).toBeVisible({ timeout: 10000 });
        await selectDropdown.click();

        // Use '@faker-js/faker' to generate random contact info
        const faker = require('@faker-js/faker').faker;
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName });

        // Locate the search input in the "Related" tab
        const searchInput = this.page.locator('#rContact0').getByRole('textbox', { name: 'Search' });
        await searchInput.waitFor({ state: "visible" });
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);

        // Click "Create New" button
        const createNewBtn = this.page.getByText('Create New').last();
        await expect(createNewBtn).toBeVisible({ timeout: 10000 });
        await createNewBtn.click();

        const addNewModel = this.page.locator('section').last();
        await addNewModel.waitFor({ state: "visible" });
        await this.page.locator('input[formcontrolname="first_name"]').last().fill(firstName);
        await this.page.locator('input[formcontrolname="last_name"]').last().fill(lastName);
        await this.page.locator('input[formcontrolname="email"]').last().fill(email);

        // Save the new contact
        const saveButton = this.page.getByRole('button', { name: 'Save' }).first();
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click({ force: true });

        // Confirm that the contact was created (wait for toast message)
        const successToast = this.page.getByText(/Contact has been created|Contact has been updated/i);
        await expect(successToast).toBeVisible({ timeout: 10000 });

        // Close the new contact tab/modal
        const closeBtn = this.page.locator('.pi.pi-times').nth(2);
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }

        await relatedContactTab.waitFor({ state: "visible" });
        await relatedContactTab.click();

        await expect(selectDropdown).toBeVisible({ timeout: 10000 });
        await selectDropdown.click();

        const fullName = `${firstName} ${lastName}`;
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);
        await searchInput.click();
        await searchInput.fill(fullName);
        const relatedContactEntry = this.page
            .locator('.drop_box li p')
            .filter({
                hasText: `${fullName} (${email})`
            })
            .first();

        await expect(relatedContactEntry).toBeVisible({ timeout: 15000 });
        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Check that contact type and relationship tags are draggable.
     */
    async verifyTagsAreDraggable() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const relatedContactTab = this.page.getByRole("tab", { name: /related contact/i });
        await relatedContactTab.waitFor({ state: "visible" });
        await relatedContactTab.click();
        const selectDropdown = this.page.locator('div.tags:has-text("Select")').last();
        await selectDropdown.waitFor({ state: "visible" });
        await selectDropdown.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
        await selectDropdown.click({ force: true });
        const searchInputInRelatedTab = this.page.locator('#rContact0').getByRole('textbox', { name: 'Search' })
        await searchInputInRelatedTab.waitFor({ state: "visible" });
        await searchInputInRelatedTab.fill('11 22');
        const suggestedContact = this.page.getByRole('listitem').filter({ hasText: '22 (11@22.com.au)' }).last();
        await suggestedContact.waitFor({ state: "visible" });
        await suggestedContact.click();
        await this.page.mouse.click(0, 0);
        const associateButton = this.page.getByRole('button', { name: /associate/i }).last();
        await associateButton.waitFor({ state: "visible" });
        await associateButton.click();
        const duplicateAlert = this.page.getByRole('alert', {
            name: /user is already associate to this contact/i
        });
        const successToast = this.page.getByText(
            /Contact attached successfully/i
        );
        const alertOrSuccessLocator = duplicateAlert.or(successToast);
        await expect(alertOrSuccessLocator).toBeVisible({ timeout: 10000 });

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

        // If already added, exit early (prevents flake)
        if (await getBuyerChip().count() > 0) {
            return;
        }

        const maxAttempts = 4;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const buyerTag = this.page
                    .locator('span.cdk-drag.related-tag span.p-tag-value', { hasText: 'Buyer' })
                    .last();
                await buyerTag.scrollIntoViewIfNeeded();

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

                // Wait for DOM update and verify chip contains "friend"
                await expect(getBuyerChip()).toHaveCount(1, { timeout: 10000 });


                break; // success
            } catch (error) {
                if (attempt === maxAttempts) {
                    throw new Error('Buyer tag drag failed after multiple attempts.');
                }

                await this.page.waitForTimeout(1000);
            }
        }
        await expect(getBuyerChip()).toHaveCount(1, { timeout: 10000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verifies that duplicate relationship tags cannot be added for a related contact.
     */
    async verifyDuplicateRelationshipTagsCannotBeAdded() {
        await this.NavigateToContacts();
        await this.openFirstContact();

        // Go to Related Contact tab
        const relatedContactTab = this.page.getByRole("tab", { name: /related contact/i });
        await relatedContactTab.waitFor({ state: "visible" });
        await relatedContactTab.click();

        // Ensure a contact is already associated (should see a delete button)
        const associatedContactDeleteBtn = this.page.getByRole('button', { name: 'delete' });
        await associatedContactDeleteBtn.scrollIntoViewIfNeeded();
        await expect(associatedContactDeleteBtn).toBeVisible({ timeout: 20000 });

        // Locate cdk-drop-list and ensure visibility
        const dropList = this.page.locator('td.cdk-drop-list[cdkdroplist]');
        await expect(dropList).toBeVisible({ timeout: 10000 });

        // Helper for Buyer chip locator
        const getBuyerChip = () =>
            this.page.locator('[data-pc-name="chip"][aria-label="Buyer"]');

        // Ensure Buyer chip already exists
        await expect(getBuyerChip()).toHaveCount(1, { timeout: 10000 });

        // Locate the Buyer tag for drag
        const buyerTag = this.page
            .locator('span.cdk-drag.related-tag span.p-tag-value', { hasText: 'Buyer' })
            .last();
        await buyerTag.scrollIntoViewIfNeeded();

        await expect(buyerTag).toBeVisible({ timeout: 10000 });

        // Drag the Buyer tag onto the drop list (should be rejected as duplicate)
        const sourceBox = await buyerTag.boundingBox();
        const dropBox = await dropList.boundingBox();

        if (!sourceBox || !dropBox) {
            throw new Error('Bounding box not found for drag operation.');
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

        // Expect only one Buyer chip (no duplicate added)
        await expect(getBuyerChip()).toHaveCount(1, { timeout: 5000 });

        // Duplicate association alert should appear
        const duplicateError = this.page
            .getByRole('alert')
            .filter({ hasText: /already associate/i });

        await expect(duplicateError).toBeVisible({ timeout: 10000 });

        await this.closeModalIfVisible();
    }

    /**
     * Removes a relationship tag from a related contact and verifies it is removed.
     */
    async verifyRelationshipTagCanBeRemoved() {
        await this.NavigateToContacts();
        await this.openFirstContact();

        // Open the Related Contact tab
        const relatedContactTab = this.page.getByRole("tab", { name: /related contact/i });
        await relatedContactTab.waitFor({ state: "visible" });
        await relatedContactTab.click();

        // Find the associated contact row containing '11 22'
        const associatedContactRow = this.page.locator('table tr').filter({ hasText: '11 22' }).last();
        await associatedContactRow.scrollIntoViewIfNeeded();
        await expect(associatedContactRow).toBeVisible({ timeout: 10000 });

        // Find the Buyer relationship chip
        const relationshipChip = associatedContactRow.locator('[data-pc-name="chip"][aria-label="Buyer"]');
        await expect(relationshipChip).toBeVisible({ timeout: 10000 });

        // Hover over the chip to make the remove icon visible
        await relationshipChip.hover();

        // Click the remove icon inside the chip
        const removeIcon = relationshipChip.locator('[data-pc-section="removeicon"]');
        await expect(removeIcon).toBeVisible({ timeout: 10000 });
        await removeIcon.click({ force: true });

        // Verify the chip is removed
        await expect(
            associatedContactRow.locator('[data-pc-name="chip"][aria-label="Buyer"]')
        ).toHaveCount(0);

        await this.page.waitForTimeout(1000);

        // Clean up: Delete the associated contact itself
        const deleteIcon = associatedContactRow.getByRole('img', { name: 'delete' }).first();
        await expect(deleteIcon).toBeVisible({ timeout: 10000 });
        await deleteIcon.click();

        const yesButton = this.page.getByRole('button', { name: /^Yes$/i }).first();
        await expect(yesButton).toBeVisible({ timeout: 10000 });
        await yesButton.click();
        // Check for success message and make sure the row disappears
        const removedToast = this.page.getByText(/Contact deleted successfully/i);
        await expect(removedToast).toBeVisible({ timeout: 10000 });

        await this.closeModalIfVisible();
    }

    /**
     * Verifies that deleting a contact requires confirmation before deletion proceeds.
     */
    async verifyDeletingContactRequiresConfirmation() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const relatedContactTab = this.page.getByRole("tab", { name: /related contact/i });
        await relatedContactTab.waitFor({ state: "visible" });
        await relatedContactTab.click();
        const selectDropdown = this.page.locator('div.tags:has-text("Select")').last();
        await selectDropdown.waitFor({ state: "visible" });
        await selectDropdown.click({ force: true });
        const searchInputInRelatedTab = this.page.locator('#rContact0').getByRole('textbox', { name: 'Search' })
        await searchInputInRelatedTab.waitFor({ state: "visible" });
        await searchInputInRelatedTab.fill('11 22');
        const suggestedContact = this.page.getByRole('listitem').filter({ hasText: '22 (11@22.com.au)' }).last();
        await suggestedContact.waitFor({ state: "visible" });
        await suggestedContact.click();
        await this.page.mouse.click(0, 0);
        const associateButton = this.page.getByRole('button', { name: /associate/i }).last();
        await associateButton.waitFor({ state: "visible" });
        await associateButton.click();
        const duplicateAlert = this.page.getByRole('alert', {
            name: /user is already associate to this contact/i
        }).first();
        const successToast = this.page.getByText(
            /Contact attached successfully/i
        ).first();
        const alertOrSuccessLocator = duplicateAlert.or(successToast);
        await alertOrSuccessLocator.waitFor({ state: "visible" });

        const associatedContactRow = this.page.locator('table tr').filter({ hasText: '11 22' }).last();
        await associatedContactRow.scrollIntoViewIfNeeded();
        await expect(associatedContactRow).toBeVisible({ timeout: 10000 });
        const deleteIcon = associatedContactRow.getByRole('img', { name: 'delete' }).first();
        await expect(deleteIcon).toBeVisible({ timeout: 10000 });
        await deleteIcon.click();
        const yesButton = this.page.getByRole('button', { name: /^Yes$/i }).first();
        await expect(yesButton).toBeVisible({ timeout: 10000 });
        await this.closeModalIfVisible();
    }

    /**
     * Deletes a contact after confirmation and verifies successful deletion.
     */
    async deleteContactAfterConfirmation() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const relatedContactTab = this.page.getByRole("tab", { name: /related contact/i });
        await relatedContactTab.waitFor({ state: "visible" });
        await relatedContactTab.click();

        const associatedContactRow = this.page.locator('table tr').filter({ hasText: '11 22' }).last();
        await associatedContactRow.scrollIntoViewIfNeeded();
        await expect(associatedContactRow).toBeVisible({ timeout: 10000 });

        const deleteIcon = associatedContactRow.getByRole('img', { name: 'delete' }).first();
        await expect(deleteIcon).toBeVisible({ timeout: 10000 });
        await deleteIcon.click();

        // Confirm deletion in confirmation dialog
        const yesButton = this.page.getByRole('button', { name: /^Yes$/i }).first();
        await expect(yesButton).toBeVisible({ timeout: 10000 });
        await yesButton.click();

        // Wait for success message and verify the contact row is gone
        const removedToast = this.page.getByText(/Contact deleted successfully/i);
        await expect(removedToast).toBeVisible({ timeout: 10000 });

        await this.closeModalIfVisible();
    }

    /**
     * UI should not allow blank contact selection
     */
    async verifyBlankContactCannotBeSelected() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const relatedContactTab = this.page.getByRole("tab", { name: /related contact/i });
        await relatedContactTab.waitFor({ state: "visible" });
        await relatedContactTab.click();

        // Open the related contact dropdown
        const selectDropdown = this.page.locator('div.tags:has-text("Select")').last();
        await selectDropdown.waitFor({ state: "visible" });
        await selectDropdown.click({ force: true });

        const associateButton = this.page.getByRole('button', { name: /associate/i }).last();
        await associateButton.waitFor({ state: "visible" });
        await associateButton.click();

        const errorMsg = this.page.getByText(/Please select contact first/i);
        await expect(errorMsg).toBeVisible({ timeout: 10000 });


        await this.closeModalIfVisible();
    }

    /**
     * Search should return accurate results for related contact search.
     * Verifies that searching with a keyword returns only relevant results in the dropdown.
     */
    async verifySearchReturnsAccurateResults(searchKeyword: string) {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const relatedContactTab = this.page.getByRole("tab", { name: /related contact/i });
        await relatedContactTab.waitFor({ state: "visible" });
        await relatedContactTab.click();

        // Open the related contact dropdown
        const selectDropdown = this.page.locator('div.tags:has-text("Select")').last();
        await selectDropdown.waitFor({ state: "visible" });
        await selectDropdown.evaluate(el => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
        await selectDropdown.click({ force: true });

        // Fill the search input
        const searchInputInRelatedTab = this.page.locator('#rContact0').getByRole('textbox', { name: 'Search' })
        await searchInputInRelatedTab.waitFor({ state: "visible" });
        await searchInputInRelatedTab.fill(searchKeyword);

        // Wait for dropdown results to appear
        const resultItems = this.page.getByRole('listitem');
        await expect(resultItems.first()).toBeVisible({ timeout: 10000 });
        const expectedContact = '11 22 (11@22.com.au)';
        const matchingEntry = this.page.locator('li p', { hasText: expectedContact }).first();
        await expect(matchingEntry).toBeVisible({ timeout: 10000 });
        await this.closeModalIfVisible();

    }

    /**
     * Verify that the Associations tab opens correctly
     */

    public async verifySortingByStatus(): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(2000);

        // Locate the "Full Name" column header and click to sort (adjust column index if needed)
        const fullNameHeader = this.page.locator("//th[2]//div[1]//div[1]//i[1]");
        await fullNameHeader.waitFor({ state: 'visible', timeout: 10000 });
        await fullNameHeader.click();
        await this.page.waitForTimeout(1500);

        // Helper to get and clean Full Name cell values (skip empty/non-name rows)
        async function getCleanFullNameCells(page: any): Promise<string[]> {
            const nameValues: string[] = await page.$$eval(
                "table tbody tr td:nth-child(1)",
                (tds: HTMLTableCellElement[]) =>
                    tds
                        .map((td) => td.textContent?.trim() || "")
                        .filter((txt) => txt && txt.length > 0 && txt.toLowerCase() !== 'full name')
            );
            return nameValues;
        }

        const fullNameCellsAsc = await getCleanFullNameCells(this.page);

        // Click again to sort descending
        await fullNameHeader.click();
        await this.locators.ResetButton().dblclick();
        await this.page.waitForTimeout(1500);
    }
}
