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

test.describe('Contacts side Menu Tests - Remmi E2E', () => {

  test('Test 1: Verify that Title, Due Date, Staff, Task Status, and Task Type are mandatory fields in the "Create New Task" popup.', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyTaskMandatoryFields();
  });

  test('Test 2: Verify that a dropdown list opens when clicking on Task Type field.', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyTaskTypeDropdownOpens();
  });

  test('Test 3: Verify that a dropdown list opens when clicking on Task Status field.', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyTaskStatusDropdownOpens();
  });

  test('Test 4: Verify that selecting "Lead Management" from Task Type triggers the Lead Name dropdown in the task form.', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyLeadNameDropdownAppearsOnLeadManagementTaskType();
  });

  test('Test 5: Verify that a task is created for the selected lead when lead Name is selected from the dropdown.', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyTaskAppearsInList();
  });

  test('Test 6: Verify that selecting a module shows a relevant dropdown list for that module (e.g., Contacts, Properties, Projects).', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyModuleDropdownsAppearForSelectedModule();
  });

  test('Test 7: Verify that selecting a contact from the dropdown creates a task linked to that contact.', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyTaskAppearsInList();
  });

  test('Test 8: Verify that the contact tag is displayed correctly in the task form.', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyContactTagIsDisplayed();
  });


});