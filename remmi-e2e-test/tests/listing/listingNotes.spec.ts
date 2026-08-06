import { test } from '../../fixtures/session.fixture';
import { ListingNotesPage as ListingPage } from '../../pages/listing/ListingNotesPage';

test.describe('Listing side Menu Tests - Remmi E2E', () => {
    test('Test 1: Verify that the NOTE Tab opens correctly', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyNoteTabOpensCorrectly();
    });

    test('Test 2: Verify that clicking the "+" button in the Notes section displays the note fields', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyNotesAddButtonDisplaysFields();
    });

    test('Test 3: Verify that clicking "Cancel" removes the note entry form', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyNotesCancelRemovesEntryForm();
    });

    test('Test 4: Verify that clicking "Save" saves the note successfully', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyNotesSaveAddsNoteSuccessfully();
    });

    test('Test 5: Verify that saved notes appear in the notes list', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyNoteIsPresent();
    });

    test('Test 6: Verify that clicking the edit icon allows updating a note', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyNoteEditFunctionality();
    });

    test('Test 7: Verify that clicking the delete icon removes a note', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyNoteDeleteFunctionality();
    });

    test('Test 8: Verify that added note also appears in Personal Notes', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyNoteAppearsInPersonalNotes();
    });

    test('Test 9: Editing a saved note should update it correctly', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyNotesditFunctionality();
    });

});