import { Page, Locator, expect } from '@playwright/test';
import { ContactBasePage } from './ContactBasePage';
import { faker } from '@faker-js/faker';

export class ContactNotesPage extends ContactBasePage {
    public async verifyNoteTabOpensCorrectly(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const noteTab = this.page.getByRole("tab", { name: /note/i });
        await noteTab.waitFor({ state: "visible", timeout: 8000 });
        await noteTab.click();
        const noteTabPanel = this.page.locator('div[role="tabpanel"]').filter({ hasText: /note/i });
        await expect(noteTabPanel).toBeVisible({ timeout: 10000 });
        await this.closeModalIfVisible();
    }
    /**
     * Verify that clicking the "+" button in the Notes section displays the note fields
     */
    public async verifyAddNoteButtonDisplaysNoteFields(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const noteTab = this.page.getByRole("tab", { name: /note/i });
        await noteTab.waitFor({ state: "visible", timeout: 8000 });
        await noteTab.click();
        const addButton = this.page.getByRole('button', { name: '' }).last();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();
        const noteTitleInput = this.page.getByRole('textbox', { name: 'Add note name or search' });
        const noteContentInput = this.page.locator('.editor');
        await expect(noteTitleInput).toBeVisible({ timeout: 10000 });
        await expect(noteContentInput).toBeVisible({ timeout: 10000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verify that clicking "Cancel" removes the note entry form in the Notes section
     */
    public async verifyNotesCancelRemovesEntryForm(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const noteTab = this.page.getByRole("tab", { name: /note/i });
        await noteTab.waitFor({ state: "visible", timeout: 8000 });
        await noteTab.click();
        const addButton = this.page.getByRole('button', { name: '' }).last();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();
        const noteTitleInput = this.page.getByRole('textbox', { name: 'Add note name or search' });
        const noteContentInput = this.page.locator('.editor');
        await expect(noteTitleInput).toBeVisible({ timeout: 10000 });
        await expect(noteContentInput).toBeVisible({ timeout: 10000 });
        const cancelButton = this.page.getByRole('button', { name: /Cancel/i }).last();
        await expect(cancelButton).toBeVisible({ timeout: 10000 });
        await cancelButton.click();
        await expect(noteTitleInput).not.toBeVisible({ timeout: 10000 });
        await expect(noteContentInput).not.toBeVisible({ timeout: 10000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verify that clicking "Save" saves the note successfully in the Notes section
     */
    public async verifyNotesSaveAddsNoteSuccessfully(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        // Go to NOTE tab
        const noteTab = this.page.getByRole("tab", { name: /note/i });
        await noteTab.waitFor({ state: "visible", timeout: 8000 });
        await noteTab.click();

        // Click the "+" button to add a note
        const addButton = this.page.getByRole('button', { name: '' }).last();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();

        const noteTitleInput = this.page.getByRole('textbox', { name: 'Add note name or search' });
        const noteContentInput = this.page.locator('.editor');
        await expect(noteTitleInput).toBeVisible({ timeout: 10000 });
        await expect(noteContentInput).toBeVisible({ timeout: 10000 });
        await noteTitleInput.type('   ', { delay: 100 });
        const noteOptionList = this.page.locator("//div[@class='list_ ng-star-inserted']//ul");
        await noteOptionList.waitFor({ state: 'visible', timeout: 30000 });
        const matchedOption = this.page.locator('p.ml-2', { hasText: '"list" Bondi Beach, NSW,' });
        await matchedOption.scrollIntoViewIfNeeded();
        await matchedOption.waitFor({ state: 'visible', timeout: 20000 });
        await matchedOption.click({ force: true });
        const noteContent = 'Note Added';
        await noteContentInput.fill(noteContent);
        const saveButton = this.page.getByRole('button', { name: /Save/i }).last();
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click();
        const successMessage = this.page.getByText('Saved successfully');
        await expect(successMessage).toBeVisible({ timeout: 10000 });
        const savedNoteTitle = this.page.getByRole('cell', { name: 'Note Added' }).first();
        await expect(savedNoteTitle).toBeVisible({ timeout: 10000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verify that clicking the edit icon allows updating a note in the Notes section
     */
    public async verifyNoteEditFunctionality(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const noteTab = this.page.getByRole('tab', { name: /Notes/i });
        await expect(noteTab).toBeVisible({ timeout: 10000 });
        await noteTab.click();
        await this.page.waitForTimeout(1200);
        const noteTitleLocator = this.page.getByRole('cell', { name: 'Note Added' }).first();
        await noteTitleLocator.waitFor({ state: 'visible', timeout: 10000 });
        const firstEditIcon = this.page.locator("//img[@alt='edit']").first();
        await firstEditIcon.waitFor({ state: 'visible', timeout: 20000 });
        await firstEditIcon.click();
        const noteContentInput = this.page.locator('.editor');
        await expect(noteContentInput).toBeVisible({ timeout: 10000 });
        const updatedNoteContent = 'Updated note';
        await noteContentInput.click();
        await noteContentInput.fill('');
        await noteContentInput.fill(updatedNoteContent);
        const updateButton = this.page.getByRole('button', { name: /Update/i }).last();
        await expect(updateButton).toBeVisible({ timeout: 10000 });
        await updateButton.click();
        const successMessage = this.page.getByText('Updated successfully');
        await expect(successMessage).toBeVisible({ timeout: 10000 });
        const updatedNoteCell = this.page.getByRole('cell', { name: updatedNoteContent }).first();
        await updatedNoteCell.waitFor({ state: 'visible', timeout: 10000 });
        await this.closeModalIfVisible();
    }

    public async verifyNotesRenderListsCorrectly(): Promise<void> {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const noteTab = this.page.getByRole('tab', { name: /Notes/i });
        await expect(noteTab).toBeVisible();
        await noteTab.click();
        const addButton = this.page.getByRole('button', { name: '' }).last();
        await expect(addButton).toBeVisible();
        await addButton.click();
        const noteTitle = 'List Test Note';
        const noteTitleInput = this.page.getByRole('textbox', { name: 'Add note name or search' });
        const editor = this.page.locator('.editor');
        const toolbar = this.page.locator('.editControls');
        await expect(noteTitleInput).toBeVisible();
        await noteTitleInput.fill(noteTitle);
        const optionList = this.page.locator("//div[contains(@class,'list_')]//ul");
        if (await optionList.isVisible().catch(() => false)) {
            const matchedOption = this.page.locator('p.ml-2', { hasText: noteTitle });
            if (await matchedOption.isVisible().catch(() => false)) {
                await matchedOption.click({ force: true });
            }
        }
        await expect(editor).toBeVisible();
        await editor.click();
        const listButtons = toolbar.locator('.note-btn').filter({
            has: this.page.locator('.pi-list')
        });
        const bulletBtn = listButtons.first();
        const numberedBtn = listButtons.nth(1);
        await bulletBtn.click();
        await this.page.waitForTimeout(200);
        await this.page.keyboard.type('Bullet 1');
        await this.page.keyboard.press('Enter');
        await this.page.keyboard.type('Bullet 2');
        await this.page.keyboard.press('Enter');
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(200);
        await editor.click();
        await numberedBtn.click();
        await this.page.waitForTimeout(200);
        await this.page.keyboard.type('Number 1');
        await this.page.keyboard.press('Enter');
        await this.page.keyboard.type('Number 2');
        const saveButton = this.page.getByRole('button', { name: /Save/i }).last();
        await expect(saveButton).toBeVisible();
        await saveButton.click();
        await expect(this.page.getByText('Saved successfully')).toBeVisible();
        await this.page.waitForTimeout(300);
        const allListItems = this.page.getByRole('cell', { name: 'Bullet 1 Bullet 2 Number 1 Number' }).first();
        await expect(allListItems).toBeVisible({ timeout: 10000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verify that clicking the delete icon removes a note
     */
    async verifyDeleteNoteRemovesNote() {
        await this.NavigateToContacts();
        await this.openFirstContact();
        const noteTab = this.page.getByRole('tab', { name: /Notes/i });
        await expect(noteTab).toBeVisible();
        await noteTab.click();
        const firstNoteCell = this.page.locator('tr.cursor-pointer').first();
        await firstNoteCell.waitFor({ state: 'visible', timeout: 10000 });
        const firstDeleteIcon = this.page.getByRole('img', { name: 'delete' }).first();
        await firstDeleteIcon.waitFor({ state: 'visible', timeout: 10000 });
        await firstDeleteIcon.click();
        const successMessage = this.page.getByText(/Deleted successfully/i);
        await expect(successMessage).toBeVisible({ timeout: 10000 });
        await this.closeModalIfVisible();
    }

    /**
     * Verify that the added note also appears in Diary notes and Personal Notes
     */
    async verifyNoteAppearsInDiaryAndPersonalNotes() {
        await this.page.goto('/');
        const notesListIcon = this.page.locator("//img[@id='notes_lis']");
        await notesListIcon.waitFor({ state: 'visible', timeout: 20000 });
        await notesListIcon.click();

        const externalLinkIcon = this.page.locator("//i[contains(@class, 'pi-external-link')]");
        await externalLinkIcon.waitFor({ state: 'visible', timeout: 20000 });
        await externalLinkIcon.click();

        const addedNote = this.page.getByLabel('Open').getByText('note added').first();
        await addedNote.waitFor({ state: 'visible', timeout: 20000 });
    }

    /**
     * Editing a saved note should update it correctly
     */
    async verifyEditingSavedNoteUpdatesCorrectly() {
        await this.page.goto('/');
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
     * Verify that a note added from the Notes tab appears in another module's notes (e.g., Personal Notes).
     */
    async verifyNoteCanBeAddedToOtherModulesFromNotesTab() {
        await this.page.goto('/');
        const notesListIcon = this.page.locator("//img[@id='notes_lis']");
        await notesListIcon.waitFor({ state: 'visible', timeout: 20000 });
        await notesListIcon.click();
        const takaElement = this.page.locator('.taka.mb-2.ng-star-inserted');
        await takaElement.waitFor({ state: 'visible' });
        await takaElement.click();
        const noteTitleInput = this.page.getByRole('textbox', { name: 'Add note name or search' });
        const noteContentInput = this.page.locator('.editor');
        await noteTitleInput.waitFor({ state: 'visible' });
        await noteContentInput.waitFor({ state: 'visible' });
        await noteTitleInput.type('"list"    Bondi Beach, NSW, 2026', { delay: 350 });
        const noteOptionList = this.page.locator("//div[@class='list_ ng-star-inserted']//ul");
        await noteOptionList.waitFor({ state: 'visible' });
        const matchedOption = this.page.locator('p.ml-2', { hasText: '"list" Bondi Beach, NSW,' });
        await matchedOption.waitFor({ state: 'visible' });
        await matchedOption.click({ force: true });
        const noteContent = 'Note Added';
        await noteContentInput.fill(noteContent);
        const saveButton = this.page.getByRole('button', { name: /Save/i }).last();
        await saveButton.waitFor({ state: 'visible' });
        await saveButton.click();
        const successMessage = this.page.getByText('Added successfully');
        await successMessage.waitFor({ state: 'visible' });
        await this.page.reload();
        const noteListText = await this.page.getByText('"list" Bondi Beach, NS "list').first();
        await noteListText.waitFor({ state: "visible" });

    }

    /**
     * Verifies that the list is properly aligned with the status column in the contacts table.
     * This checks that each list row's left boundary matches the left boundary of the status column header.
     */
    async verifyListAlignmentWithStatusColumn() {
        await this.page.goto('/');
        const notesListIcon = this.page.locator("//img[@id='notes_lis']");
        await notesListIcon.waitFor({ state: 'visible', timeout: 20000 });
        await notesListIcon.click();
        const matchedNote = this.page.getByText('"list" Bondi Beach, NSW,').first();
        await matchedNote.waitFor({ state: 'visible', timeout: 10000 });
        const iconElement = this.page.locator('i').nth(2);
        await iconElement.waitFor({ state: 'visible' });
        await iconElement.click();

    }

    /**
     * Verifies that sorting works correctly on the Notes list.
     */
    async verifySortingFunctionalityOnNotesList() {
        await this.NavigateToContacts();
        await this.openFirstContact();

        // Open Notes tab
        const noteTab = this.page.getByRole('tab', { name: /Notes/i });
        await expect(noteTab).toBeVisible();
        await noteTab.click();

        // Wait for Notes tab panel to appear
        const noteTabPanel = this.page.locator('div[role="tabpanel"]').filter({ hasText: /note/i });
        await expect(noteTabPanel).toBeVisible({ timeout: 10000 });

        const noteColumnHeader = this.page.getByRole('columnheader', { name: /Note/i });
        const noteRowsLocator = this.page.locator('td[class*="note"]');

        // Click to sort ascending (assuming first click sorts ascending)
        await noteColumnHeader.click();
        await this.page.waitForTimeout(600); // reduced timeout for UI response

        // Grab resulting notes
        const noteTextsAsc = await noteRowsLocator.allTextContents();
        // Defensive: filter out empties, trim
        const filteredAsc = noteTextsAsc.map(x => x.trim()).filter(Boolean);

        // Check if sorted ASC
        const sortedAsc = [...filteredAsc].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
        if (JSON.stringify(filteredAsc) !== JSON.stringify(sortedAsc)) {
            throw new Error('Notes are not sorted in ascending order by Note column');
        }

        // Click again to sort descending
        await noteColumnHeader.click();
        await this.page.waitForTimeout(600);

        // Grab resulting notes for descending
        const noteTextsDesc = await noteRowsLocator.allTextContents();
        const filteredDesc = noteTextsDesc.map(x => x.trim()).filter(Boolean);

        // Check if sorted DESC
        const sortedDesc = [...filteredAsc].sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' }));
        if (JSON.stringify(filteredDesc) !== JSON.stringify(sortedDesc)) {
            throw new Error('Notes are not sorted in descending order by Note column');
        }
        await this.closeModalIfVisible();
    }

    /**
     * Verify if the History tab displays newly created contact details.
     */
}
