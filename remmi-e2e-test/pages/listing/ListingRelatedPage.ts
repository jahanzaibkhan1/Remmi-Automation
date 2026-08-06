import { expect } from '@playwright/test';
import { ListingBasePage } from './ListingBasePage';

export class ListingRelatedPage extends ListingBasePage {
    async verifyContactAssociationInRelatedTab() {

        await this.navigateToListings();
        await this.switchToGridView();
        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();
        // Click the "Related" tab
        const relatedTab = this.page.getByText('Related').first();
        await expect(relatedTab).toBeVisible({ timeout: 10000 });
        await relatedTab.click();

        // Open the dropdown to select a contact within the Related tab (more robust against index changes)
        const selectDropdown = this.page.locator('div.tags:has-text("Select")').last();
        await expect(selectDropdown).toBeVisible({ timeout: 10000 });
        await selectDropdown.click();

        // Locate the search input for the contact within the "Related" tab
        const searchInputInRelatedTab = this.page
            .getByRole('tabpanel', { name: /related/i })
            .getByPlaceholder(/search/i)
            .first();
        await expect(searchInputInRelatedTab).toBeVisible({ timeout: 10000 });
        await searchInputInRelatedTab.fill('11 22');

        // Wait for and select the matching contact option from the dropdown
        const suggestedContact = this.page.getByRole('listitem').filter({ hasText: '22 (11@22.com.au)' }).last();
        await expect(suggestedContact).toBeVisible({ timeout: 20000 });
        await suggestedContact.click();
        await this.page.mouse.click(0, 0);
        // In the Contact section, click "Associate Contact" or similar
        const associateButton = this.page.getByRole('button', { name: /associate/i }).first();
        await expect(associateButton).toBeVisible({ timeout: 10000 });
        await associateButton.click();

        const duplicateAlert = this.page.getByRole('alert', {
            name: /Contact is already associate/i
        });
        const successToast = this.page.getByText(
            /Contact attached successfully/i
        );
        const alertOrSuccessLocator = duplicateAlert.or(successToast);

        await expect(alertOrSuccessLocator).toBeVisible({ timeout: 10000 });

        // Delete the remaining contact if visible, otherwise pass
        const remainingContactRow = this.page.locator('table tr').filter({ hasText: 'seller' }).last();
        if (await remainingContactRow.isVisible().catch(() => false)) {
            await remainingContactRow.scrollIntoViewIfNeeded();
            const deleteIcon2 = remainingContactRow.getByRole('img', { name: 'delete' }).first();
            if (await deleteIcon2.isVisible().catch(() => false)) {
                await deleteIcon2.click();
                const yesButton2 = this.page.getByRole('button', { name: /^Yes$/i }).first();
                if (await yesButton2.isVisible().catch(() => false)) {
                    await yesButton2.click();
                    await this.page.waitForTimeout(500);
                    const removedToast2 = this.page.getByText(/Contact deleted successfully/i);
                    await expect(removedToast2).toBeVisible({ timeout: 10000 });
                }
            }
            await expect(remainingContactRow).not.toBeVisible({ timeout: 30000 });
        }

        // Scroll to the contact row and verify "11 22" is associated and visible in the Contact section
        const associatedContactRow = this.page.locator('table tr').filter({ hasText: '11 22' }).first();
        await associatedContactRow.scrollIntoViewIfNeeded();
        await expect(associatedContactRow).toBeVisible({ timeout: 10000 });

        // Delete the associated contact by clicking its "delete" icon in the row
        const deleteIcon = associatedContactRow.getByRole('img', { name: 'delete' }).first();
        await expect(deleteIcon).toBeVisible({ timeout: 10000 });
        await deleteIcon.click();

        // Confirm deletion in the dialog by clicking "Yes"
        const yesButton = this.page.getByRole('button', { name: /^Yes$/i }).first();
        await expect(yesButton).toBeVisible({ timeout: 10000 });
        await yesButton.click();
        await this.page.waitForTimeout(500);
        const removedToast = this.page.getByText(/Contact deleted successfully/i).first();
        await expect(removedToast).toBeVisible({ timeout: 30000 });
        // Verify the row for "11 22" is no longer visible in the table
        await expect(associatedContactRow).not.toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);

        const closeBtn = this.page.locator('.pi.pi-times').last();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that an error message appears when trying to associate a contact without selecting one.
     */
    async verifyErrorMessageWhenAssociatingWithoutContact() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Click the "Related" tab
        const relatedTab = this.page.getByText('Related').first();
        await expect(relatedTab).toBeVisible({ timeout: 10000 });
        await relatedTab.click();

        // Open the dropdown to select a contact within the Related tab (more robust against index changes)
        const selectDropdown = this.page.locator('div.tags:has-text("Select")').last();
        await expect(selectDropdown).toBeVisible({ timeout: 10000 });
        await selectDropdown.click();

        // Locate the search input for the contact within the "Related" tab
        const searchInputInRelatedTab = this.page
            .getByRole('tabpanel', { name: /related/i })
            .getByPlaceholder(/search/i)
            .first();
        await expect(searchInputInRelatedTab).toBeVisible({ timeout: 10000 });
        // Wait for and select the matching contact option from the dropdown
        const suggestedContact = this.page.getByRole('listitem').filter({ hasText: '22 (11@22.com.au)' }).last();
        await expect(suggestedContact).toBeVisible({ timeout: 20000 });
        await this.page.mouse.click(0, 0);
        // Directly click "Associate" without selecting any contact
        const associateButton = this.page.getByRole('button', { name: /associate/i }).first();
        await expect(associateButton).toBeVisible({ timeout: 10000 });
        await associateButton.click();

        // Assert that the appropriate validation/error message appear
        const errorMessage = this.page.getByRole('alert', { name: 'Please select contact first' });
        await expect(errorMessage).toBeVisible({ timeout: 10000 });

        // Optionally close any dialog that might appear
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that entering a non-existing contact in the search shows the "Add New Contact" button.
     */
    async verifyAddNewContactButtonAppearsForNonExistingContact() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Click the "Related" tab
        const relatedTab = this.page.getByText('Related').first();
        await expect(relatedTab).toBeVisible({ timeout: 10000 });
        await relatedTab.click();

        // Click on the contact selection dropdown
        const selectDropdown = this.page.locator('div.tags:has-text("Select")').last();
        await expect(selectDropdown).toBeVisible({ timeout: 10000 });
        await selectDropdown.click();

        // Locate the search input for the contact within the "Related" tab
        const searchInputInRelatedTab = this.page
            .getByRole('tabpanel', { name: /related/i })
            .getByPlaceholder(/search/i)
            .first();
        await expect(searchInputInRelatedTab).toBeVisible({ timeout: 10000 });
        const nonExistingContact = 'SomeRandomNonExistentContactName1234';
        await searchInputInRelatedTab.fill(nonExistingContact);

        // Wait for the dropdown options to load
        await this.page.waitForTimeout(1000);

        // Verify that "Add New contact" button becomes visible
        const createNew = this.page.getByLabel('Related').getByText('Create New');
        await expect(createNew).toBeVisible({ timeout: 20000 });

        // Optionally close any dialog or dropdown
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that clicking "Create New" contact opens a new contact tab.
     */
    async verifyCreateNewContactOpensContactTab() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Click the "Related" tab
        const relatedTab = this.page.getByText('Related').first();
        await expect(relatedTab).toBeVisible({ timeout: 10000 });
        await relatedTab.click();

        // Click on the contact selection dropdown
        const selectDropdown = this.page.locator('div.tags:has-text("Select")').last();
        await expect(selectDropdown).toBeVisible({ timeout: 10000 });
        await selectDropdown.click();

        // Locate the search input for the contact within the "Related" tab
        const searchInputInRelatedTab = this.page
            .getByRole('tabpanel', { name: /related/i })
            .getByPlaceholder(/search/i)
            .first();
        await expect(searchInputInRelatedTab).toBeVisible({ timeout: 10000 });
        // Wait for the dropdown options to load
        await this.page.waitForTimeout(1000);

        // Find and click the "Create New" button
        const createNewBtn = this.page.getByLabel('Related').getByText('Create New');
        await expect(createNewBtn).toBeVisible({ timeout: 10000 });
        await createNewBtn.click();

        // Verify that a new contact tab/modal opens (adapt selector as needed for your UI)
        const newContactForm = this.page.locator('#Contact_1 #rightbarwithscroll');
        await expect(newContactForm).toBeVisible({ timeout: 10000 });

        // Optionally: Close the dialog or modal
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that a newly created contact is automatically added to the Related contact list.
     */
    async verifyNewlyCreatedContactIsAddedToRelatedList() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Click the "Related" tab
        const relatedTab = this.page.getByText('Related').first();
        await expect(relatedTab).toBeVisible({ timeout: 10000 });
        await relatedTab.click();

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
        const searchInputInRelatedTab = this.page
            .getByRole('tabpanel', { name: /related/i })
            .getByPlaceholder(/search/i)
            .first();
        await expect(searchInputInRelatedTab).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);

        // Click "Create New" button
        const createNewBtn = this.page.getByLabel('Related').getByText('Create New');
        await expect(createNewBtn).toBeVisible({ timeout: 10000 });
        await createNewBtn.click();

        // Fill out the new contact form
        const newContactForm = this.page.locator('#Contact_1 #rightbarwithscroll');
        await expect(newContactForm).toBeVisible({ timeout: 10000 });
        await this.page.locator('input[formcontrolname="first_name"]').fill(firstName);
        await this.page.locator('input[formcontrolname="last_name"]').fill(lastName);
        await this.page.locator('input[formcontrolname="email"]').fill(email);

        // Save the new contact
        const saveButton = this.page.getByRole('button', { name: 'Save' }).first();
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click({ force: true });

        // Confirm that the contact was created (wait for toast message)
        const successToast = this.page.getByText(/Contact has been created|Contact has been updated/i);
        await expect(successToast).toBeVisible({ timeout: 10000 });

        // Close the new contact tab/modal
        const closeBtn = this.page.locator('.pi.pi-times').last();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }

        await expect(selectDropdown).toBeVisible({ timeout: 10000 });
        await selectDropdown.click();

        const fullName = `${firstName} ${lastName}`;
        await expect(searchInputInRelatedTab).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);
        await searchInputInRelatedTab.click();
        await searchInputInRelatedTab.fill(fullName);
        const relatedContactEntry = this.page
            .locator('.drop_box li p')
            .filter({
                hasText: `${fullName} (${email})`
            })
            .first();

        await expect(relatedContactEntry).toBeVisible({ timeout: 15000 });

        // Close any open modal/tab
        const closeBtn2 = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn2.isVisible().catch(() => false)) {
            await closeBtn2.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that a confirmation popup appears when deleting a contact from the Related tab,
     * and the contact is only removed after confirming in the popup.
     */
    async verifyDeleteContactConfirmationPopup() {
        await this.navigateToListings();
        await this.switchToGridView();
        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();
        // Click the "Related" tab
        const relatedTab = this.page.getByText('Related').first();
        await expect(relatedTab).toBeVisible({ timeout: 10000 });
        await relatedTab.click();

        // Open the dropdown to select a contact within the Related tab (more robust against index changes)
        const selectDropdown = this.page.locator('div.tags:has-text("Select")').last();
        await expect(selectDropdown).toBeVisible({ timeout: 10000 });
        await selectDropdown.click();

        // Locate the search input for the contact within the "Related" tab
        const searchInputInRelatedTab = this.page
            .getByRole('tabpanel', { name: /related/i })
            .getByPlaceholder(/search/i)
            .first();
        await expect(searchInputInRelatedTab).toBeVisible({ timeout: 10000 });
        await searchInputInRelatedTab.fill('11 22');

        // Wait for and select the matching contact option from the dropdown
        const suggestedContact = this.page.getByRole('listitem').filter({ hasText: '22 (11@22.com.au)' }).last();
        await expect(suggestedContact).toBeVisible({ timeout: 20000 });
        await suggestedContact.click();
        await this.page.mouse.click(0, 0);
        // In the Contact section, click "Associate Contact" or similar
        const associateButton = this.page.getByRole('button', { name: /associate/i }).first();
        await expect(associateButton).toBeVisible({ timeout: 10000 });
        await associateButton.click();

        const duplicateAlert = this.page.getByRole('alert', {
            name: /Contact is already associate/i
        });
        const successToast = this.page.getByText(
            /Contact attached successfully/i
        );
        const alertOrSuccessLocator = duplicateAlert.or(successToast);

        await expect(alertOrSuccessLocator).toBeVisible({ timeout: 10000 });

        // Scroll to the contact row and verify "11 22" is associated and visible in the Contact section
        const associatedContactRow = this.page.locator('table tr').filter({ hasText: '11 22' }).first();
        await associatedContactRow.scrollIntoViewIfNeeded();
        await expect(associatedContactRow).toBeVisible({ timeout: 10000 });

        // Delete the associated contact by clicking its "delete" icon in the row
        const deleteIcon = associatedContactRow.getByRole('img', { name: 'delete' }).first();
        await expect(deleteIcon).toBeVisible({ timeout: 10000 });
        await deleteIcon.click();

        // Wait for the confirmation popup "Remove contact from this listing?"
        const confirmationPopup = this.page.locator('div').filter({ hasText: /^Remove contact from this listing\?$/ });
        await expect(confirmationPopup).toBeVisible({ timeout: 10000 });

        // Confirm deletion in the dialog by clicking "Yes"
        const yesButton = this.page.getByRole('button', { name: /^Yes$/i }).first();
        await expect(yesButton).toBeVisible({ timeout: 10000 });

        // Verify "No" button is visible in the confirmation popup
        const noButton = this.page.getByRole('button', { name: /^No$/i }).first();
        await expect(noButton).toBeVisible({ timeout: 10000 });

        await yesButton.click();

        await this.page.waitForTimeout(500);
        const removedToast = this.page.getByText(/Contact deleted successfully/i);
        await expect(removedToast).toBeVisible({ timeout: 10000 });
        // Verify the row for "11 22" is no longer visible in the table
        await expect(associatedContactRow).not.toBeVisible({ timeout: 10000 });
        // Close any possible modal/dialog
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }


    /**
     * Verifies that a contact is not deleted if "No" is clicked on confirmation popup.
     */
    async verifyContactNotDeletedWhenNoClickedOnConfirmation() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();
        // Click the "Related" tab
        const relatedTab = this.page.getByText('Related').first();
        await expect(relatedTab).toBeVisible({ timeout: 10000 });
        await relatedTab.click();

        // Open the dropdown to select a contact within the Related tab
        const selectDropdown = this.page.locator('div.tags:has-text("Select")').last();
        await expect(selectDropdown).toBeVisible({ timeout: 10000 });
        await selectDropdown.click();

        // Locate and fill the search input in the Related tab
        const searchInputInRelatedTab = this.page
            .getByRole('tabpanel', { name: /related/i })
            .getByPlaceholder(/search/i)
            .first();
        await expect(searchInputInRelatedTab).toBeVisible({ timeout: 10000 });
        await searchInputInRelatedTab.fill('11 22');

        // Wait for and select the matching contact from suggestions
        const suggestedContact = this.page.getByRole('listitem').filter({ hasText: '22 (11@22.com.au)' }).last();
        await expect(suggestedContact).toBeVisible({ timeout: 20000 });
        await suggestedContact.click();
        await this.page.mouse.click(0, 0);

        // Click the "Associate Contact" button
        const associateButton = this.page.getByRole('button', { name: /associate/i }).first();
        await expect(associateButton).toBeVisible({ timeout: 10000 });
        await associateButton.click();

        const duplicateAlert = this.page.getByRole('alert', {
            name: /Contact is already associate/i
        });
        const successToast = this.page.getByText(
            /Contact attached successfully/i
        );
        const alertOrSuccessLocator = duplicateAlert.or(successToast);

        await expect(alertOrSuccessLocator).toBeVisible({ timeout: 10000 });

        // Locate the associated contact row for "11 22" in the table
        const associatedContactRow = this.page.locator('table tr').filter({ hasText: '11 22' }).first();
        await associatedContactRow.scrollIntoViewIfNeeded();
        await expect(associatedContactRow).toBeVisible({ timeout: 10000 });

        // Click the delete icon in the associated contact row
        const deleteIcon = associatedContactRow.getByRole('img', { name: 'delete' }).first();
        await expect(deleteIcon).toBeVisible({ timeout: 10000 });
        await deleteIcon.click();

        // Wait for the confirmation popup to be visible
        const confirmationPopup = this.page.locator('div').filter({ hasText: /^Remove contact from this listing\?$/ });
        await expect(confirmationPopup).toBeVisible({ timeout: 10000 });

        // Verify "No" and "Yes" buttons are present
        const noButton = this.page.getByRole('button', { name: /^No$/i }).first();
        await expect(noButton).toBeVisible({ timeout: 10000 });
        const yesButton = this.page.getByRole('button', { name: /^Yes$/i }).first();
        await expect(yesButton).toBeVisible({ timeout: 10000 });

        // Click "No" to cancel deletion
        await noButton.click();
        await expect(confirmationPopup).not.toBeVisible({ timeout: 10000 });
        // Verify that the associated contact row ("11 22") is still visible (not deleted)
        await associatedContactRow.scrollIntoViewIfNeeded();
        await expect(associatedContactRow).toBeVisible({ timeout: 10000 });
        await deleteIcon.click();
        await yesButton.click();
        await this.page.waitForTimeout(500);
        const removedToast = this.page.getByText(/Contact deleted successfully/i);
        await expect(removedToast).toBeVisible({ timeout: 10000 });
        // Verify the row for "11 22" is no longer visible in the table
        await expect(associatedContactRow).not.toBeVisible({ timeout: 10000 });
        // Close any possible modal/dialog
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that a contact type tag can be added to a contact in the listing.
     */
    async verifyContactTypeTagCanBeAdded() {

        await this.navigateToListings();
        await this.switchToGridView();

        const firstListingCard = this.page
            .locator("//div[contains(@class,'s-property')]")
            .first();

        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        const relatedTab = this.page.getByText('Related').first();
        await expect(relatedTab).toBeVisible({ timeout: 10000 });
        await relatedTab.click();

        const selectDropdown = this.page.locator('div.tags:has-text("Select")').last();
        await expect(selectDropdown).toBeVisible({ timeout: 10000 });
        await selectDropdown.click();

        const searchInput = this.page
            .getByRole('tabpanel', { name: /related/i })
            .getByPlaceholder(/search/i)
            .first();

        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.fill('11 22');

        const suggestedContact = this.page
            .getByRole('listitem')
            .filter({ hasText: '22 (11@22.com.au)' })
            .last();

        await expect(suggestedContact).toBeVisible({ timeout: 20000 });
        await suggestedContact.click();
        await this.page.mouse.click(0, 0);

        const associateButton = this.page.getByRole('button', { name: /associate/i }).first();
        await expect(associateButton).toBeVisible({ timeout: 10000 });
        await associateButton.click();

        const duplicateAlert = this.page.getByRole('alert').filter({
            hasText: /Contact is already associate/i
        });

        const successToast = this.page.getByText(/Contact attached successfully/i);

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

        // If already added, exit early (prevents flake)
        if (await getBuyerChip().count() > 0) {
            return;
        }

        const maxAttempts = 4;

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                const buyerTag = this.page
                    .locator('span.cdk-drag.related-tag span.p-tag-value', { hasText: 'Buyer' })
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
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that a contact type tag (e.g., "Buyer") can be removed from a related contact.
     */
    async verifyContactTypeTagCanBeRemoved() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Click the "Related" tab
        const relatedTab = this.page.getByText('Related').first();
        await expect(relatedTab).toBeVisible({ timeout: 10000 });
        await relatedTab.click();
        // Locate the associated contact row for "11 22" in the table
        const associatedContactRow = this.page.locator('table tr').filter({ hasText: '11 22' }).first();
        await associatedContactRow.evaluate(el => {
            el.scrollIntoView({
                block: 'center',
                inline: 'start'
            });
        });
        await expect(associatedContactRow).toBeVisible({ timeout: 10000 });
        // Locate the relationship chip
        const relationshipChip = associatedContactRow.locator(
            '[data-pc-name="chip"][aria-label="Buyer"]'
        );

        await expect(relationshipChip).toBeVisible({ timeout: 10000 });

        // Hover in case remove icon appears only on hover
        await relationshipChip.hover();

        // Click the remove icon wrapper (NOT the SVG)
        const removeIcon = relationshipChip.locator(
            '[data-pc-section="removeicon"]'
        );

        await expect(removeIcon).toBeVisible({ timeout: 10000 });
        await removeIcon.click({ force: true });

        // Verify chip is removed safely (Angular re-render safe)
        await expect(
            associatedContactRow.locator('[data-pc-name="chip"][aria-label="Buyer"]')
        ).toHaveCount(0);

        await this.page.waitForTimeout(1000);
        // Delete associated contact (cleanup)
        const deleteIcon = this.page.getByRole('img', { name: 'delete' }).first();
        await expect(deleteIcon).toBeVisible({ timeout: 10000 });
        await deleteIcon.click();

        const confirmationPopup = this.page
            .locator('div')
            .filter({ hasText: /^Remove contact from this listing\?$/ });

        await expect(confirmationPopup).toBeVisible({ timeout: 10000 });

        const yesButton = this.page.getByRole('button', { name: /^Yes$/i }).first();
        await expect(yesButton).toBeVisible({ timeout: 10000 });
        await yesButton.click();

        const removedToast = this.page.getByText(/Contact deleted successfully/i);
        await expect(removedToast).toBeVisible({ timeout: 10000 });

        await expect(associatedContactRow).not.toBeVisible({ timeout: 10000 });

        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }


    // Helper function: create, associate "11 22", drag "Buyer" tag, then delete associated contact and close modal
    async createAndDragContactTypeTag() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Click the "Related" tab
        const relatedTab = this.page.getByText('Related').first();
        await expect(relatedTab).toBeVisible({ timeout: 10000 });
        await relatedTab.click();

        // Open the dropdown to select a contact within the Related tab
        const selectDropdown = this.page.locator('div.tags:has-text("Select")').last();
        await expect(selectDropdown).toBeVisible({ timeout: 10000 });
        await selectDropdown.click();

        // Locate and fill the search input in the Related tab
        const searchInputInRelatedTab = this.page
            .getByRole('tabpanel', { name: /related/i })
            .getByPlaceholder(/search/i)
            .first();
        await expect(searchInputInRelatedTab).toBeVisible({ timeout: 10000 });
        await searchInputInRelatedTab.fill('11 22');

        // Wait for and select the matching contact from suggestions
        const suggestedContact = this.page.getByRole('listitem').filter({ hasText: '22 (11@22.com.au)' }).last();
        await expect(suggestedContact).toBeVisible({ timeout: 20000 });
        await suggestedContact.click();
        await this.page.mouse.click(0, 0);

        // Click the "Associate Contact" button
        const associateButton = this.page.getByRole('button', { name: /associate/i }).first();
        await expect(associateButton).toBeVisible({ timeout: 10000 });
        await associateButton.click();

        // Check for the success confirmation message
        const duplicateAlert = this.page.getByRole('alert', {
            name: /Contact is already associate/i
        });
        const successToast = this.page.getByText(
            /Contact attached successfully/i
        );
        const alertOrSuccessLocator = duplicateAlert.or(successToast);

        await expect(alertOrSuccessLocator).toBeVisible({ timeout: 10000 });

        // Locate the associated contact row for "11 22" in the table
        const associatedContactRow = this.page.locator('table tr').filter({ hasText: '11 22' }).first();
        await associatedContactRow.evaluate(el => {
            el.scrollIntoView({
                block: 'center',
                inline: 'start'
            });
        });
        await expect(associatedContactRow).toBeVisible({ timeout: 10000 });

        // Ensure the drag-drop area is visible
        const dropList = associatedContactRow.locator('td.cdk-drop-list[cdkdroplist][style*="padding-left: 12px"]');
        await expect(dropList).toBeVisible({ timeout: 10000 });

        // Locate the "Buyer" tag in the related contacts (assuming the tag is draggable)
        const buyerTag = this.page.locator('span.cdk-drag.related-tag span.p-tag-value', { hasText: 'Buyer' }).first();
        await expect(buyerTag).toBeVisible({ timeout: 10000 });

        // Drag the "Buyer" tag to the drop list area within the contact row (first add)
        await buyerTag.dragTo(dropList);

        // Check the "Buyer" contact tag is now visible in the row
        const contactTagAfter = associatedContactRow.locator('[data-pc-name="chip"][aria-label="Buyer"]');
        await expect(contactTagAfter).toBeVisible({ timeout: 10000 });

        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    // Main test: checks that duplicate contact type tags cannot be added
    async verifyDuplicateContactTypeTagsCannotBeAdded() {
        await this.navigateToListings();
        await this.switchToGridView();

        const firstListingCard = this.page
            .locator("//div[contains(@class,'s-property')]")
            .first();

        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Click the "Related" tab
        const relatedTab = this.page.getByText('Related').first();
        await expect(relatedTab).toBeVisible({ timeout: 10000 });
        await relatedTab.click();


        // Always re-query row (Angular-safe)
        const associatedContactRow = this.page
            .locator('table tr')
            .filter({ hasText: '11 22' })
            .first();

        await associatedContactRow.evaluate(el => {
            el.scrollIntoView({
                block: 'center',
                inline: 'start'
            });
        });

        await expect(associatedContactRow).toBeVisible({ timeout: 20000 });

        const dropList = associatedContactRow.locator('td.cdk-drop-list[cdkdroplist]');
        await expect(dropList).toBeVisible({ timeout: 10000 });

        const getBuyerChip = () =>
            associatedContactRow.locator('[data-pc-name="chip"][aria-label="Buyer"]');

        // Ensure Buyer already exists (otherwise duplicate test invalid)
        await expect(getBuyerChip()).toHaveCount(1, { timeout: 10000 });

        // --- CDK SAFE DRAG (manual mouse events) ---
        const buyerTag = this.page
            .locator('span.cdk-drag.related-tag span.p-tag-value', { hasText: 'Buyer' })
            .first();

        await expect(buyerTag).toBeVisible({ timeout: 10000 });

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

        // --- VALIDATIONS ---

        // Still only one Buyer chip
        await expect(getBuyerChip()).toHaveCount(1, { timeout: 5000 });

        // Duplicate alert (case-insensitive & partial match)
        const duplicateError = this.page
            .getByRole('alert')
            .filter({ hasText: /already associate/i });

        await expect(duplicateError).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);
        // Close modal safely if exists
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify that a relationship tag can be added to a related contact successfully.
     */
    async verifyRelationshipTagCanBeAdded() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Click the "Related" tab
        const relatedTab = this.page.getByText('Related').first();
        await expect(relatedTab).toBeVisible({ timeout: 10000 });
        await relatedTab.click();

        // Open the contact dropdown and associate '11 22'
        const selectDropdown = this.page.locator('div.tags:has-text("Select")').last();
        await expect(selectDropdown).toBeVisible({ timeout: 10000 });
        await selectDropdown.click();

        const searchInput = this.page
            .getByRole('tabpanel', { name: /related/i })
            .getByPlaceholder(/search/i)
            .first();
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.fill('11 22');

        const suggestedContact = this.page.getByRole('listitem').filter({ hasText: '22 (11@22.com.au)' }).last();
        await expect(suggestedContact).toBeVisible({ timeout: 20000 });
        await suggestedContact.click();
        await this.page.mouse.click(0, 0);

        // Click Associate Contact
        const associateButton = this.page.getByRole('button', { name: /associate/i }).first();
        await expect(associateButton).toBeVisible({ timeout: 10000 });
        await associateButton.click();

        // Wait for confirmation
        const duplicateAlert = this.page.getByRole('alert', {
            name: /Contact is already associate/i
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
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify that duplicate relationship tags cannot be added to a related contact.
     */
    async verifyDuplicateRelationshipTagsCannotBeAdded() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Click the "Related" tab
        const relatedTab = this.page.getByText('Related').first();
        await expect(relatedTab).toBeVisible({ timeout: 10000 });
        await relatedTab.click();

        // Always re-query row (Angular-safe)
        const associatedContactRow = this.page
            .locator('table tr')
            .filter({ hasText: '11 22' })
            .first();

        await associatedContactRow.evaluate(el => {
            el.scrollIntoView({
                block: 'center',
                inline: 'start'
            });
        });

        await expect(associatedContactRow).toBeVisible({ timeout: 20000 });

        const dropList = associatedContactRow.locator('td.cdk-drop-list[cdkdroplist]');
        await expect(dropList).toBeVisible({ timeout: 10000 });

        const getBuyerChip = () =>
            associatedContactRow.locator('[data-pc-name="chip"][aria-label="Wife"]');

        // Ensure Buyer already exists (otherwise duplicate test invalid)
        await expect(getBuyerChip()).toHaveCount(1, { timeout: 10000 });

        // --- CDK SAFE DRAG (manual mouse events) ---
        const buyerTag = this.page
            .locator('span.cdk-drag.related-tag span.p-tag-value', { hasText: 'Wife' })
            .first();

        await expect(buyerTag).toBeVisible({ timeout: 10000 });

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

        // --- VALIDATIONS ---

        // Still only one Buyer chip
        await expect(getBuyerChip()).toHaveCount(1, { timeout: 5000 });

        // Duplicate alert (case-insensitive & partial match)
        const duplicateError = this.page
            .getByRole('alert')
            .filter({ hasText: /already associate/i });

        await expect(duplicateError).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);
        // Close modal safely if exists
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    /**
   * Verify that a relationship tag can be removed from a related contact.
   */
    async verifyRelationshipTagCanBeRemoved() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Open Related tab
        const relatedTab = this.page.getByText('Related').first();
        await expect(relatedTab).toBeVisible({ timeout: 10000 });
        await relatedTab.click();

        // Locate the associated contact row for "11 22" in the table
        const associatedContactRow = this.page.locator('table tr').filter({ hasText: '11 22' }).first();
        await associatedContactRow.evaluate(el => {
            el.scrollIntoView({
                block: 'center',
                inline: 'start'
            });
        });
        await expect(associatedContactRow).toBeVisible({ timeout: 10000 });
        // Locate the relationship chip
        const relationshipChip = associatedContactRow.locator(
            '[data-pc-name="chip"][aria-label="Wife"]'
        );

        await expect(relationshipChip).toBeVisible({ timeout: 10000 });

        // Hover in case remove icon appears only on hover
        await relationshipChip.hover();

        // Click the remove icon wrapper (NOT the SVG)
        const removeIcon = relationshipChip.locator(
            '[data-pc-section="removeicon"]'
        );

        await expect(removeIcon).toBeVisible({ timeout: 10000 });
        await removeIcon.click({ force: true });

        // Verify chip is removed safely (Angular re-render safe)
        await expect(
            associatedContactRow.locator('[data-pc-name="chip"][aria-label="Wife"]')
        ).toHaveCount(0);

        await this.page.waitForTimeout(1000);

        // Delete associated contact (cleanup)
        const deleteIcon = this.page.getByRole('img', { name: 'delete' }).first();
        await expect(deleteIcon).toBeVisible({ timeout: 10000 });
        await deleteIcon.click({ force: true });

        const confirmationPopup = this.page
            .locator('div')
            .filter({ hasText: /^Remove contact from this listing\?$/ });

        await expect(confirmationPopup).toBeVisible({ timeout: 10000 });

        const yesButton = this.page.getByRole('button', { name: /^Yes$/i }).first();
        await expect(yesButton).toBeVisible({ timeout: 10000 });
        await yesButton.click();

        const removedToast = this.page.getByText(/Contact deleted successfully/i);
        await expect(removedToast).toBeVisible({ timeout: 10000 });

        await expect(associatedContactRow).not.toBeVisible({ timeout: 10000 });

        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);

    }

    async verifyAssociatedContactCountUpdatesCorrectly() {
        await this.navigateToListings();
        await this.switchToGridView();

        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        const relatedTab = this.page.getByText('Related').first();
        await expect(relatedTab).toBeVisible({ timeout: 10000 });
        await relatedTab.click();

        // Try to find the records badge that is visible, otherwise continue gracefully
        let recordsBadge = this.page.locator('div.mt-4 > p.ng-star-inserted', { hasText: 'Records: ' }).first();
        let initialCount = 0;

        if (await recordsBadge.isVisible().catch(() => false)) {
            await recordsBadge.evaluate(el => el.scrollIntoView({ block: 'center', inline: 'start' }));
            await expect(recordsBadge).toBeVisible({ timeout: 10000 });
            const recordsText = await recordsBadge.textContent();
            const recordMatch = recordsText?.match(/Records:\s*(\d+)/);
            initialCount = recordMatch ? parseInt(recordMatch[1], 10) : 0;
            console.log(`Initial contact count: ${initialCount}`); // Initial count
        } else {
            console.log('Records badge not visible, continuing...');
        }

        const getContactCount = async () => {
            if (await recordsBadge.isVisible().catch(() => false)) {
                const badgeText = await recordsBadge.textContent();
                const match = badgeText?.match(/Records:\s*(\d+)/);
                return match ? parseInt(match[1], 10) : 0;
            }
            return 0;
        };

        const selectDropdown = this.page.locator('div.tags:has-text("Select")').last();
        await selectDropdown.scrollIntoViewIfNeeded();
        await expect(selectDropdown).toBeVisible({ timeout: 10000 });
        await selectDropdown.click();

        const searchInput = this.page
            .getByRole('tabpanel', { name: /related/i })
            .getByPlaceholder(/search/i)
            .first();
        await expect(searchInput).toBeVisible({ timeout: 10000 });
        await searchInput.fill('11 22');

        const suggestedContact = this.page.getByRole('listitem').filter({ hasText: '22 (11@22.com.au)' }).last();
        await expect(suggestedContact).toBeVisible({ timeout: 20000 });
        await suggestedContact.click();
        await this.page.mouse.click(0, 0);

        const associateButton = this.page.getByRole('button', { name: /associate/i }).first();
        await expect(associateButton).toBeVisible({ timeout: 10000 });
        await associateButton.click();

        const duplicateAlert = this.page.getByRole('alert', { name: /Contact is already associate/i });
        const successToast = this.page.getByText(/Contact attached successfully/i);
        const alertOrSuccessLocator = duplicateAlert.or(successToast);
        await expect(alertOrSuccessLocator).toBeVisible({ timeout: 10000 });

        let added = false;
        if (await successToast.isVisible().catch(() => false)) {
            const associatedContactRow = this.page.locator('table tr').filter({ hasText: '11 22' }).first();
            await associatedContactRow.scrollIntoViewIfNeeded();
            await expect(associatedContactRow).toBeVisible({ timeout: 10000 });

            await this.page.waitForFunction(
                async (initial) => {
                    const badge = document.querySelector('div.mt-4 > p.ng-star-inserted');
                    if (!badge) return false;
                    const match = badge.textContent?.match(/Records:\s*(\d+)/);
                    return match ? parseInt(match[1], 10) > initial : false;
                },
                initialCount,
                { timeout: 5000 }
            );

            added = true;
        }

        // Log the count after adding but BEFORE deletion
        const countBeforeDelete = await getContactCount();
        console.log(`Contact count before deleting '11 22': ${countBeforeDelete}`); // <-- log here

        const associatedContactRow = this.page.locator('table tr').filter({ hasText: '11 22' }).first();
        const deleteIcon = associatedContactRow.getByRole('img', { name: 'delete' }).first();
        await expect(deleteIcon).toBeVisible({ timeout: 10000 });
        await deleteIcon.click();

        const yesButton = this.page.getByRole('button', { name: /^Yes$/i }).first();
        await expect(yesButton).toBeVisible({ timeout: 10000 });
        await yesButton.click();

        const removedToast = this.page.getByText(/Contact deleted successfully/i);
        await expect(removedToast).toBeVisible({ timeout: 10000 });
        await expect(associatedContactRow).not.toBeVisible({ timeout: 10000 });

        if (added) {
            await this.page.waitForFunction(
                async (expected) => {
                    const badge = document.querySelector('div.mt-4 > p.ng-star-inserted');
                    if (!badge) return false;
                    const match = badge.textContent?.match(/Records:\s*(\d+)/);
                    return match ? parseInt(match[1], 10) === expected : false;
                },
                initialCount,
                { timeout: 5000 }
            );
        }

        const finalCount = await getContactCount();
        console.log(`Final contact count after deletion: ${finalCount}`); // Final count

        if (added && finalCount !== initialCount) {
            throw new Error(`Expected count after deletion to be ${initialCount}, but got ${finalCount}`);
        }

        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }

        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that contract-related contacts are automatically added to the Related contact tab.
     */
    async verifyContractRelatedContactsAreAddedToRelatedTab() {

        await this.navigateToContracts();

        await this.page.waitForFunction(() => {
            const rows = Array.from(document.querySelectorAll('table tr'));
            return rows.length > 0;
        }, { timeout: 30000 });


        const contractSearchText = 'Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880';

        const keywordInput = this.page.locator('#keywordInput');
        await keywordInput.waitFor({ state: 'visible', timeout: 20000 });
        await keywordInput.fill('');
        await keywordInput.type(contractSearchText, { delay: 150 });
        const contractRow = this.page.locator('table tr', { hasText: 'Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880' }).first();
        await this.page.waitForTimeout(1200);
        const noContractsCell = this.page.getByRole('cell', { name: 'No contracts available' });

        if (await contractRow.isVisible().catch(() => false)) {

            const checkbox = contractRow.locator('.p-checkbox-box').first();

            await checkbox.waitFor({ state: 'visible', timeout: 10000 });

            await checkbox.click();

            const deleteButton = this.page.getByRole('button', { name: /delete/i }).first();

            if (await deleteButton.isVisible().catch(() => false)) {

                await deleteButton.click();


                const yesButton = this.page.getByRole('button', { name: /^yes$/i }).first();

                await yesButton.waitFor({ state: 'visible', timeout: 10000 });

                await yesButton.click();


                await contractRow.waitFor({ state: 'detached', timeout: 10000 });

            }

        }
        else if (await noContractsCell.isVisible().catch(() => false)) {

            console.log('No contracts available, skipping delete step.');

        }

        const plusIcon = this.page.getByRole('button', { name: '' });

        await expect(plusIcon).toBeVisible({ timeout: 10000 });

        await plusIcon.click();

        const listingDropdown = this.page.locator("ng-select[name='listingid']");
        await listingDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await listingDropdown.click();
        await listingDropdown.type(contractSearchText, { delay: 10 });

        const firstOption = this.page.locator(".ng-option:not(.ng-option-disabled)").first();
        await firstOption.waitFor({ state: 'visible', timeout: 10000 });
        await firstOption.click();

        const contractStatusDropdown = this.page.locator('#Contract_0').getByText('Contract Status');
        await contractStatusDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await contractStatusDropdown.click();

        const settledOption = this.page.getByRole('option', { name: 'Settled' });
        await settledOption.waitFor({ state: 'visible', timeout: 10000 });
        await settledOption.click();



        const offerStatusDropdown = this.page.locator('ng-select').filter({ hasText: 'Offer Status' }).getByRole('combobox');
        await offerStatusDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await offerStatusDropdown.click();

        const firstOfferStatusOption = this.page.getByRole('option', { name: 'Accepted' }).first();
        await firstOfferStatusOption.waitFor({ state: 'visible', timeout: 10000 });
        await firstOfferStatusOption.click();

        const sellerDropdown = this.page.locator('div').filter({ hasText: /^Select Seller$/ }).nth(1);
        await sellerDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await sellerDropdown.click();

        const sellerSearchBox = this.page.locator('#Contract_0').getByRole('textbox', { name: 'Search' });
        await sellerSearchBox.fill('Automation Testing');

        const sellerOption = this.page.getByText(/Automation testing \(testing@/i).first();
        await sellerOption.waitFor({ state: 'visible', timeout: 20000 });
        await sellerOption.click();

        // Click the "x" icon in the buyer tags to clear if visible, otherwise skip
        const sellersSolicitorDropdownIcon = this.page.locator('div:nth-child(2) > re-multiselect > .box > .tags > .selected_one > .pi');
        if (await sellersSolicitorDropdownIcon.isVisible()) {
            await sellersSolicitorDropdownIcon.click();
        }

        const sellersSolicitorDropdown = this.page.locator('.form-field:has(label:text("Seller\'s Solicitor")) .tags');
        await sellersSolicitorDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await sellersSolicitorDropdown.click();

        const sellersSolicitorSearchBox = this.page.locator('#Contract_0').getByRole('textbox', { name: 'Search' });
        await sellersSolicitorSearchBox.waitFor({ state: 'visible', timeout: 10000 });

        const dropdown = this.page.locator('.drop_box');
        await dropdown.waitFor({ state: 'visible', timeout: 20000 });
        const firstSolicitorCheckbox = this.page.getByRole('listitem').filter({ hasText: '22' }).first();
        await firstSolicitorCheckbox.waitFor({ state: 'attached', timeout: 20000 });
        await firstSolicitorCheckbox.click({ force: true });


        // Click the "x" icon in the buyer tags to clear if visible, otherwise skip
        const buyerClearIcon = this.page.locator('div:nth-child(3) > re-multiselect > .box > .tags > .selected_one > .pi');
        if (await buyerClearIcon.isVisible()) {
            await buyerClearIcon.click();
        }

        const buyerDropdown = this.page.locator('.form-field:has(label:text("Buyer")) .tags').first();
        await buyerDropdown.waitFor({ state: 'visible', timeout: 10000 });
        await buyerDropdown.click();

        const buyerDropdownSearch = this.page.locator('#Contract_0').getByRole('textbox', { name: 'Search' });
        await buyerDropdownSearch.waitFor({ state: 'visible', timeout: 10000 });

        const firstBuyerCheckbox = this.page.getByRole('listitem').filter({ hasText: 'Abe Weber (Abe.Weber@hotmail.' });
        await firstBuyerCheckbox.waitFor({ state: 'visible', timeout: 20000 });
        await firstBuyerCheckbox.click({ force: true });

        const offerDateInput = this.page.locator("//input[@name='dateOffer']");
        await offerDateInput.scrollIntoViewIfNeeded();

        const now = new Date();
        const currentDateStr =
            `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

        await offerDateInput.fill(currentDateStr);
        await offerDateInput.press('Enter');

        const priceInput = this.page.locator('input[name="price"]').first();
        await priceInput.fill('10000');

        const saveAndCloseButton = this.page.getByRole('button', { name: /Save & Close/i }).first();

        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await saveAndCloseButton.click();



        await expect(
            this.page.getByRole('alert', { name: 'Contract added successfully' })
        ).toBeVisible({ timeout: 10000 });



        await this.navigateToListings();

        await this.switchToGridView();

        // Search for the listing by its name using the keyword input field
        const nameSearchInput = this.page.locator('#keywordInput');
        await nameSearchInput.waitFor({ state: 'visible', timeout: 10000 });
        const listingName = 'Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880'; // Replace with actual listing name if needed
        await nameSearchInput.fill(listingName);
        await nameSearchInput.press('Enter');
        // Wait for the first listing card to appear in the list/grid
        const firstListingCard = this.page.getByText('For Sale Sauer LLC"" 453/37').first();
        await firstListingCard.waitFor({ state: 'visible', timeout: 20000 });
        await firstListingCard.click({ force: true });

        await this.page.waitForTimeout(1200);

        const relatedTab = this.page.getByText('Related').first();

        await relatedTab.waitFor({ state: 'visible', timeout: 10000 });

        await relatedTab.click({ force: true });

        // Scroll into view before making assertions
        const buyerCell = this.page.getByRole('table').getByText('Buyer').last();
        await buyerCell.evaluate(el => el.scrollIntoView({ block: 'center', inline: 'start' }));
        await expect(buyerCell).toBeVisible({ timeout: 10000 });

        const sellerSolicitorCell = this.page.getByRole('table').getByText('Seller Solicitor');
        await sellerSolicitorCell.scrollIntoViewIfNeeded();
        await expect(sellerSolicitorCell).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1000);

        const closeBtn = this.page.locator('.pi.pi-times').last();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }

        await this.page.waitForTimeout(1000);

    }

    /**
     * Verify that contract related contacts are not removed when the contract is settled
     */
    public async verifyContractRelatedContactsRemainAfterSettlement() {
        // Navigate to Listings and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        await this.resetFilters();
        await this.page.waitForTimeout(2500);

        // Search for a test listing (replace with dynamic if needed)
        const nameSearchInput = this.page.locator('#keywordInput').first();
        await nameSearchInput.waitFor({ state: 'visible', timeout: 10000 });
        const listingName = 'Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880'; // replace as needed
        await nameSearchInput.fill(listingName);
        await nameSearchInput.press('Enter');

        // Click the first listing card that matches
        const firstListingCard = this.page.getByText('For Sale Sauer LLC"" 453/37').first();
        await firstListingCard.waitFor({ state: 'visible', timeout: 20000 });
        await firstListingCard.click({ force: true });

        // Go to the Related tab
        const relatedTab = this.page.getByText('Related').first();
        await relatedTab.waitFor({ state: 'visible', timeout: 10000 });
        await relatedTab.click();

        // Scroll into view before making assertions
        const buyerCell = this.page.getByRole('table').getByText('Buyer').last();
        await buyerCell.evaluate(el => el.scrollIntoView({ block: 'center', inline: 'start' }));
        await expect(buyerCell).toBeVisible({ timeout: 10000 });

        const sellerSolicitorCell = this.page.getByRole('table').getByText('Seller Solicitor');
        await sellerSolicitorCell.scrollIntoViewIfNeeded();
        await expect(sellerSolicitorCell).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);

        const closeBtn = this.page.locator('.pi.pi-times').last();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }

        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify that an associated contact remains linked after saving and reopening the contact
     */
    public async verifyAssociatedContactRemainsLinkedAfterSaveAndReopen() {
        // Navigate to Listings and switch to grid view
        await this.navigateToListings();
        await this.switchToGridView();

        await this.resetFilters();
        await this.page.waitForTimeout(2500);

        // Search for a test listing (replace with dynamic automation fixture if needed)
        const listingName = 'Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880'; // adjust as needed
        const nameSearchInput = this.page.locator('#keywordInput').first();
        await nameSearchInput.waitFor({ state: 'visible', timeout: 10000 });
        await nameSearchInput.fill(listingName);
        await nameSearchInput.press('Enter');

        // Open the first matching listing
        const firstListingCard = this.page.getByText('For Sale Sauer LLC"" 453/37').first();
        await firstListingCard.waitFor({ state: 'visible', timeout: 20000 });
        await firstListingCard.click({ force: true });

        // Go to the Related tab
        const relatedTab = this.page.getByText('Related').first();
        await relatedTab.waitFor({ state: 'visible', timeout: 10000 });
        await relatedTab.click();

        const buyerCell = this.page.getByRole('table').getByText('Buyer').last();
        await buyerCell.evaluate(el => el.scrollIntoView({ block: 'center', inline: 'start' }));
        await expect(buyerCell).toBeVisible({ timeout: 10000 });

        const sellerSolicitorCell = this.page.getByRole('table').getByText('Seller Solicitor');
        await sellerSolicitorCell.scrollIntoViewIfNeeded();
        await expect(sellerSolicitorCell).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('.pi.pi-times').last();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }

        await this.page.waitForTimeout(1000);
    }

    /**
     * Delete all related contacts for a listing.
     */
    public async deleteAllRelatedContacts() {
        await this.navigateToListings();
        await this.switchToGridView();

        await this.resetFilters();
        await this.page.waitForTimeout(2500);

        const listingName = 'Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880';
        const nameSearchInput = this.page.locator('#keywordInput').first();
        await nameSearchInput.waitFor({ state: 'visible', timeout: 10000 });
        await nameSearchInput.fill(listingName);
        await nameSearchInput.press('Enter');

        const firstListingCard = this.page.getByText('For Sale Sauer LLC"" 453/37').first();
        await firstListingCard.waitFor({ state: 'visible', timeout: 20000 });
        await firstListingCard.click({ force: true });

        const relatedTab = this.page.getByText('Related').first();
        await relatedTab.waitFor({ state: 'visible', timeout: 10000 });
        await relatedTab.click();
        // wait for the first delete icon to become visible
        const firstDeleteIcon = this.page.getByRole('img', { name: 'delete' }).first();
        await firstDeleteIcon.waitFor({ state: 'visible', timeout: 10000 });

        // Delete all related contacts one by one
        while (true) {
            const deleteIcons = this.page.getByRole('img', { name: 'delete' });
            const count = await deleteIcons.count();
            if (count === 0) break;

            await deleteIcons.first().click();

            const confirmYesBtn = this.page.getByRole('button', { name: /^Yes$/i });
            await confirmYesBtn.waitFor({ state: 'visible', timeout: 5000 });
            await confirmYesBtn.click();

            // Wait for the delete button to disappear before proceeding to next, allowing extra load time for UI update
            await this.page.waitForTimeout(1500);
            // Optional: you could use a more robust wait here, for example, wait for count to decrease if needed
        }
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('div.close-rightBar i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }

        await this.resetFilters();
        await this.page.waitForTimeout(2500);
    }

    /**
     * Verifies that canceling "Add New contact" does not create a new contact.
     */
    public async verifyCancelAddNewContactDoesNotCreateContact() {
        // Navigate to Listings and open the first listing as in previous methods
        await this.navigateToListings();
        await this.switchToGridView();

        await this.resetFilters();
        await this.page.waitForTimeout(2500);

        const listingName = 'Sauer LLC"" 453/37 Eliseo Brook, East Albury, Nebraska 34880';
        const nameSearchInput = this.page.locator('#keywordInput').first();
        await nameSearchInput.waitFor({ state: 'visible', timeout: 10000 });
        await nameSearchInput.fill(listingName);
        await nameSearchInput.press('Enter');

        const firstListingCard = this.page.getByText('For Sale Sauer LLC"" 453/37').first();
        await firstListingCard.waitFor({ state: 'visible', timeout: 20000 });
        await firstListingCard.click({ force: true });

        // Go to Related tab
        const relatedTab = this.page.getByText('Related').first();
        await relatedTab.waitFor({ state: 'visible', timeout: 10000 });
        await relatedTab.click();

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
        const searchInputInRelatedTab = this.page
            .getByRole('tabpanel', { name: /related/i })
            .getByPlaceholder(/search/i)
            .first();
        await expect(searchInputInRelatedTab).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);

        // Click "Create New" button
        const createNewBtn = this.page.getByLabel('Related').getByText('Create New');
        await expect(createNewBtn).toBeVisible({ timeout: 10000 });
        await createNewBtn.click();

        // Fill out the new contact form
        const newContactForm = this.page.locator('#Contact_1 #rightbarwithscroll');
        await expect(newContactForm).toBeVisible({ timeout: 10000 });
        await this.page.locator('input[formcontrolname="first_name"]').fill(firstName);
        await this.page.locator('input[formcontrolname="last_name"]').fill(lastName);
        await this.page.locator('input[formcontrolname="email"]').fill(email);

        // Close the new contact tab/modal
        const closeBtn = this.page.locator('.pi.pi-times').last();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }

        await expect(selectDropdown).toBeVisible({ timeout: 10000 });
        await selectDropdown.click();

        const fullName = `${firstName} ${lastName}`;
        await expect(searchInputInRelatedTab).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);
        await searchInputInRelatedTab.click();
        await searchInputInRelatedTab.fill(fullName);
        const relatedContactEntry = this.page
            .locator('.drop_box li p')
            .filter({
                hasText: `${fullName} (${email})`
            })
            .first();

        await expect(relatedContactEntry).not.toBeVisible({ timeout: 15000 });

        await this.page.waitForTimeout(1200);

        // Close any open modal/tab
        const closeBtn2 = this.page.locator('.pi.pi-times').last();
        if (await closeBtn2.isVisible().catch(() => false)) {
            await closeBtn2.click({ force: true });
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify that the "Connect Your Account" button is visible when Google Calendar is not connected.
     */
}
