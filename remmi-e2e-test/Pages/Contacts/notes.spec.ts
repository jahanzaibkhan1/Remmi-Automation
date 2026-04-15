import { test as base } from '@playwright/test';
import { ContactActions } from './contactAction';

const managerSessionPath = require('path').join(__dirname, '../../sessions/manager-session.json');
const DASHBOARD_URL = process.env.DASHBOARD_URL;

const test = base.extend<{ sessionPage: any }>({
  sessionPage: [async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: managerSessionPath });
    try {
      const page = await context.newPage();
      await page.goto(DASHBOARD_URL);
      await use(page);
    } finally {

    }
  }, { scope: 'worker' }]
});

test.describe('Notes Tab Tests - Remmi E2E', () => {

  test('Test 1: Verify that the NOTE Tab opens correctly', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyNoteTabOpensCorrectly();
  });

  test('Test 2: Verify that clicking the "+" button in the Notes section displays the note fields', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyAddNoteButtonDisplaysNoteFields();
  });

  test('Test 3: Verify that clicking "Cancel" removes the note entry form', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyNotesCancelRemovesEntryForm();
  });

  test('Test 4: Verify that clicking "Save" saves the note successfully', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyNotesSaveAddsNoteSuccessfully();
  });

  test('Test 5: Verify that clicking the edit icon allows updating a note', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyNoteEditFunctionality();
  });

  test('Test 6: Verify that numbered lists and bullet points display correctly in notes', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyNotesRenderListsCorrectly();
  });

  test('Test 7: Verify that clicking the delete icon removes a note', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyDeleteNoteRemovesNote();
  });

  test('Test 8: Added note should also appear in Diary notes and Personal Notes', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyNoteAppearsInDiaryAndPersonalNotes();
  });

  test('Test 9: Editing a saved note should update it correctly', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyEditingSavedNoteUpdatesCorrectly();
  });

});