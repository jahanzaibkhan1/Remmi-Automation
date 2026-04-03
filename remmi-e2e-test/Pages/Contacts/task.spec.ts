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

  test('Test 1: Tasks tab should display existing task records', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyTasksTabDisplaysExistingTasks();
  });

  test('Test 2: "New Task" button should open the task creation form', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyNewTaskButtonOpensTaskCreationForm();
  });

  test('Test 3: Task should appear in the list after creation', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyTaskAppearsInList();
  });

  test('Test 4: Task should also appear in the Task module', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyTaskAppearsInTaskModule();
  });

  test('Test 5: Task list should display correct details', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyTaskListDisplaysCorrectDetails();
  });

  test('Test 6: Task updates should reflect immediately', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyTaskUpdatesReflectImmediately();
  });

  test('Test 7: Task should not be created without valid data', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyTaskCannotBeCreatedWithoutValidData();
  });

});