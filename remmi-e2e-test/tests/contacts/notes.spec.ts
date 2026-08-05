import { test } from '../../fixtures/session.fixture';
import { ContactPage } from '../../pages/contacts/ContactPage';

test.describe('Notes Tab Tests - Remmi E2E', () => {

  test('Test 1: Verify that the NOTE Tab opens correctly', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyNoteTabOpensCorrectly();
  });

  test('Test 2: Verify that clicking the "+" button in the Notes section displays the note fields', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyAddNoteButtonDisplaysNoteFields();
  });

  test('Test 3: Verify that clicking "Cancel" removes the note entry form', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyNotesCancelRemovesEntryForm();
  });

  test('Test 4: Verify that clicking "Save" saves the note successfully', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyNotesSaveAddsNoteSuccessfully();
  });

  test('Test 5: Verify that clicking the edit icon allows updating a note', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyNoteEditFunctionality();
  });

  test('Test 6: Verify that numbered lists and bullet points display correctly in notes', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyNotesRenderListsCorrectly();
  });

  test('Test 7: Verify that clicking the delete icon removes a note', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyDeleteNoteRemovesNote();
  });

  test('Test 8: Added note should also appear in Diary notes and Personal Notes', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyNoteAppearsInDiaryAndPersonalNotes();
  });

  test('Test 9: Editing a saved note should update it correctly', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyEditingSavedNoteUpdatesCorrectly();
  });

  test('Test 10: Verify that notes can be added to other modules from the Notes tab', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyNoteCanBeAddedToOtherModulesFromNotesTab();
  });

  test('Test 11: Verify that the list is properly aligned with the status column', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyListAlignmentWithStatusColumn();
  });

  test('Test 12: Verify that sorting works correctly on the Notes list', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifySortingFunctionalityOnNotesList();
  });

});