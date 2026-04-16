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

test.describe('History Tab Tests - Remmi E2E', () => {

  test('Test 1: Verify if the history tab displays newly created contact details', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyHistoryTabDisplaysNewContactDetails();
  });

  test('Test 2: Verify if changes to a contact field are reflected in history', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyContactFieldChangeIsReflectedInHistory();
  });

  test('Test 3: Check if the "Changed Date" displays the correct date and time of modification', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyChangedDateDisplaysCorrectDateAndTime();
  });

  test('Test 4: Verify if the "Changed By" field displays the correct user who made changes', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyChangedByFieldIsCorrect('Jahanzaib Xenex');
  });

  test('Test 5: Check if the "Event" status correctly indicates the type of action', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyEventStatusIsCorrect('Update');
  });

}); 