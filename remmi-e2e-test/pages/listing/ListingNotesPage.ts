import { expect } from '@playwright/test';
import { ListingBasePage } from './ListingBasePage';
import { faker } from '@faker-js/faker';

export class ListingNotesPage extends ListingBasePage {
    async verifyNoteTabOpensCorrectly() {
        await this.openFirstListingCard();

        // Go to NOTE tab
        const noteTab = this.page.getByRole('tab', { name: /Notes/i });
        await expect(noteTab).toBeVisible({ timeout: 10000 });
        await noteTab.click();

        const notePanel = this.page.getByLabel('Notes').getByRole('button', { name: '' });
        await expect(notePanel).toBeVisible({ timeout: 10000 });

        // Optionally close the form/dialog if needed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Verifies that clicking the "+" button in the Notes section displays the note fields.
     */
    async verifyNotesAddButtonDisplaysFields() {
        await this.openFirstListingCard();

        // Go to NOTE tab
        const noteTab = this.page.getByRole('tab', { name: /Notes/i });
        await expect(noteTab).toBeVisible({ timeout: 10000 });
        await noteTab.click();

        // Click the "+" button to add a note
        const addButton = this.page.getByRole('button', { name: '' }).last();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();

        // Wait for note fields to appear
        const noteTitleInput = this.page.getByRole('textbox', { name: 'Add note name or search' });
        const noteContentInput = this.page.locator('.editor');
        await expect(noteTitleInput).toBeVisible({ timeout: 10000 });
        await expect(noteContentInput).toBeVisible({ timeout: 10000 });

        // Optionally close the form/dialog if needed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Verifies that clicking "Cancel" removes the note entry form in the Notes section.
     */
    async verifyNotesCancelRemovesEntryForm() {
        await this.openFirstListingCard();

        // Go to NOTE tab
        const noteTab = this.page.getByRole('tab', { name: /Notes/i });
        await expect(noteTab).toBeVisible({ timeout: 10000 });
        await noteTab.click();

        // Click the "+" button to add a note
        const addButton = this.page.getByRole('button', { name: '' }).last();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();

        // Wait for note fields to appear
        const noteTitleInput = this.page.getByRole('textbox', { name: 'Add note name or search' });
        const noteContentInput = this.page.locator('.editor');
        await expect(noteTitleInput).toBeVisible({ timeout: 10000 });
        await expect(noteContentInput).toBeVisible({ timeout: 10000 });

        // Click the "Cancel" button (assumes button role and visible label "Cancel")
        const cancelButton = this.page.getByRole('button', { name: /Cancel/i }).last();
        await expect(cancelButton).toBeVisible({ timeout: 10000 });
        await cancelButton.click();

        // Verify that the note entry form (title or content input) is no longer visible
        await expect(noteTitleInput).not.toBeVisible({ timeout: 10000 });
        await expect(noteContentInput).not.toBeVisible({ timeout: 10000 });

        // Optionally close the form/dialog if needed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Verifies that clicking "Save" saves the note successfully in the Notes section.
     */

    async verifyNotesSaveAddsNoteSuccessfully() {
        await this.openFirstListingCard();

        // Go to NOTE tab
        const noteTab = this.page.getByRole('tab', { name: /Notes/i });
        await expect(noteTab).toBeVisible({ timeout: 10000 });
        await noteTab.click();

        // Click the "+" button to add a note
        const addButton = this.page.getByRole('button', { name: '' }).last();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();

        // Wait for note fields to appear and fill them in
        const noteTitleInput = this.page.getByRole('textbox', { name: 'Add note name or search' });
        const noteContentInput = this.page.locator('.editor');
        await expect(noteTitleInput).toBeVisible({ timeout: 10000 });
        await expect(noteContentInput).toBeVisible({ timeout: 10000 });

        await noteTitleInput.type('   ', { delay: 100 });
        // Wait for autocomplete/suggestions dropdown and select the option that matches the noteTitle
        const noteOptionList = this.page.locator("//div[@class='list_ ng-star-inserted']//ul");
        await noteOptionList.waitFor({ state: 'visible', timeout: 30000 });
        const matchedOption = this.page.locator('p.ml-2', { hasText: '"list" Bondi Beach, NSW,' });
        await matchedOption.scrollIntoViewIfNeeded();
        await matchedOption.waitFor({ state: 'visible', timeout: 20000 });
        await matchedOption.click({ force: true });

        const noteContent = 'Note Added';

        await noteContentInput.fill(noteContent);

        // Click the "Save" button (assumes button role and visible label "Save")
        const saveButton = this.page.getByRole('button', { name: /Save/i }).last();
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click();

        // Assert that the "message saved successfully" notification appears
        const successMessage = this.page.getByText('Saved successfully');
        await expect(successMessage).toBeVisible({ timeout: 10000 });

        // Assert that the note appears in the list
        const savedNoteTitle = this.page.getByRole('cell', { name: 'Note Added' }).first();
        await expect(savedNoteTitle).toBeVisible({ timeout: 10000 });


        // Optionally close the form/dialog if needed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    // Verify that a note with given title and content appears in the notes list
    async verifyNoteIsPresent() {
        await this.openFirstListingCard();
        await this.page.waitForTimeout(3000);
        // Go to NOTE tab
        const noteTab = this.page.getByRole('tab', { name: /Notes/i });
        await expect(noteTab).toBeVisible({ timeout: 10000 });
        await noteTab.click();
        await this.page.waitForTimeout(1200);
        const noteTitleLocator = this.page.getByRole('cell', { name: 'Note Added' }).first();
        await noteTitleLocator.waitFor({ state: 'visible', timeout: 10000 });
        // Optionally close the form/dialog if needed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    // Verify that clicking the edit icon allows updating a note
    async verifyNoteEditFunctionality() {
        await this.openFirstListingCard();

        await this.page.waitForTimeout(3000);

        // Go to NOTE tab
        const noteTab = this.page.getByRole('tab', { name: /Notes/i });
        await expect(noteTab).toBeVisible({ timeout: 10000 });
        await noteTab.click();

        await this.page.waitForTimeout(1200);
        const noteTitleLocator = this.page.getByRole('cell', { name: 'Note Added' }).first();
        await noteTitleLocator.waitFor({ state: 'visible', timeout: 10000 });

        const firstEditIcon = this.page.locator("//img[@alt='edit']").first();
        await firstEditIcon.waitFor({ state: 'visible', timeout: 20000 });
        await firstEditIcon.click();

        // Change the note content - assumes an input/textarea is visible for editing
        const noteContentInput = this.page.locator('.editor');;
        await expect(noteContentInput).toBeVisible({ timeout: 10000 });

        // Use a new note text for the update
        const updatedNoteContent = 'Updated note';
        await noteContentInput.click();
        await noteContentInput.fill('');
        await noteContentInput.fill(updatedNoteContent);

        // Click the "Save" button
        const updateButton = this.page.getByRole('button', { name: /Update/i }).last();
        await expect(updateButton).toBeVisible({ timeout: 10000 });
        await updateButton.click();

        // Assert that the "Saved successfully" notification appears
        const successMessage = this.page.getByText('Updated successfully');
        await expect(successMessage).toBeVisible({ timeout: 10000 });

        // Assert that the note's updated content appears in the list

        const updatedNoteCell = this.page.getByRole('cell', { name: updatedNoteContent }).first();
        await updatedNoteCell.waitFor({ state: 'visible', timeout: 10000 });

        // Optionally close the form/dialog if needed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    // Verify that clicking the delete icon removes a note
    async verifyNoteDeleteFunctionality() {
        await this.openFirstListingCard();

        await this.page.waitForTimeout(3000);

        // Go to NOTE tab
        const noteTab = this.page.getByRole('tab', { name: /Notes/i });
        await expect(noteTab).toBeVisible({ timeout: 10000 });
        await noteTab.click();

        // Assume that there is at least one note present
        const firstNoteCell = this.page.locator('tr.cursor-pointer').first();
        await firstNoteCell.waitFor({ state: 'visible', timeout: 10000 });

        // Click the first delete icon
        const firstDeleteIcon = this.page.locator("//img[@class='cursor-pointer']").first();
        await firstDeleteIcon.waitFor({ state: 'visible', timeout: 10000 });
        await firstDeleteIcon.click();

        // Assert that the "Deleted successfully" notification appears
        const successMessage = this.page.getByText(/Deleted successfully/i);
        await expect(successMessage).toBeVisible({ timeout: 10000 });

        // Expect the first note row to not be visible after deletion
        await expect(firstNoteCell).not.toBeVisible({ timeout: 10000 });

        // Optionally close the form/dialog if needed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);

    }

    // Added note should also appear in Personal Notes
    async verifyNoteAppearsInPersonalNotes() {
        await this.verifyNotesSaveAddsNoteSuccessfully();

        const notesListIcon = this.page.locator("//img[@id='notes_lis']");
        await notesListIcon.waitFor({ state: 'visible', timeout: 20000 });
        await notesListIcon.click();

        const externalLinkIcon = this.page.locator("//i[contains(@class, 'pi-external-link')]");
        await externalLinkIcon.waitFor({ state: 'visible', timeout: 20000 });
        await externalLinkIcon.click();

        const addedNote = this.page.getByLabel('Open').getByText('note added').first();
        await addedNote.waitFor({ state: 'visible', timeout: 20000 });

    }

    // Edits a note in the Personal Notes panel and deletes it as cleanup
    async verifyPersonalNotesEditFunctionality() {
        await this.navigateToListings();
        await this.switchToGridView();

        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await firstListingCard.waitFor({ state: 'visible', timeout: 30000 });

        const notesListIcon = this.page.locator("//img[@id='notes_lis']");
        await notesListIcon.waitFor({ state: 'visible', timeout: 20000 });
        await notesListIcon.click();

        const externalLinkIcon = this.page.locator("//i[contains(@class, 'pi-external-link')]");
        await externalLinkIcon.waitFor({ state: 'visible', timeout: 20000 });
        await externalLinkIcon.click();

        const firstCard = this.page.locator('div.main-card-body').first();
        await firstCard.waitFor({ state: 'visible', timeout: 20000 });

        const editIcon = this.page.locator('div.main-card-body').first().locator('i.pi-pencil');;
        await editIcon.waitFor({ state: 'visible', timeout: 10000 });
        await editIcon.click();

        const noteContentInput = this.page.locator('.editor').last();
        await expect(noteContentInput).toBeVisible({ timeout: 10000 });

        const updatedNoteContent = faker.lorem.words(2);
        await noteContentInput.click();
        await noteContentInput.fill('');
        await noteContentInput.fill(updatedNoteContent);

        const updateButton = this.page.getByRole('button', { name: /Update/i }).last();
        await expect(updateButton).toBeVisible({ timeout: 10000 });
        await updateButton.click();

        const successMessage = this.page.getByText('Updated successfully');
        await expect(successMessage).toBeVisible({ timeout: 10000 });

        const deleteIcon = this.page.locator('img[src*="delete_icon.svg"]').first();
        await expect(deleteIcon).toBeVisible({ timeout: 10000 });
        await deleteIcon.click();

        const confirmDeleteButton = this.page.getByRole('button', { name: /Delete/i }).last();
        await expect(confirmDeleteButton).toBeVisible({ timeout: 10000 });
        await confirmDeleteButton.click();

        const deleteMessage = this.page.getByText(/Deleted successfully/i);
        await expect(deleteMessage).toBeVisible({ timeout: 10000 });


    }

    /**
     * Verify that the History tab displays details for the newly created listing.
     */
}
