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

});