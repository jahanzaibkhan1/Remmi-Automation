import { test as base } from '@playwright/test';
import { ListingPage } from '../../pages/listing/ListingPage';
import * as path from 'path';

const managerSessionPath = path.join(__dirname, '../../sessions/manager-session.json');
const DASHBOARD_URL = process.env.DASHBOARD_URL || 'https://remmi-app-stage-ui.azurewebsites.net/dashboard';

const test = base.extend<{ sessionPage: any }>({
    sessionPage: [async ({ browser }, use) => {
        const context = await browser.newContext({ storageState: managerSessionPath });
        try {
            const page = await context.newPage();
            await page.goto(DASHBOARD_URL);
            await use(page);
        } finally {
            // Clean-up if needed
        }
    }, { scope: 'worker' }]
});

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