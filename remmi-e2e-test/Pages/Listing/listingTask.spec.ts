import { test as base } from '@playwright/test';
import { ListingActions } from './ListingAction';
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

    }
  }, { scope: 'worker' }]
});

test.describe('Listing side Menu Tests - Remmi E2E', () => {

    test('Test 1: Tasks tab should display existing task records', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyTasksTabDisplaysRecords();
    });

    test('Test 2: "New Task" button should open the task creation form', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyNewTaskButtonOpensTaskForm();
    });

    test('Test 3: Task should appear in the list after creation', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyTaskAppearsInList('Testing Task');
    });

    test('Test 4: Task should also appear in the Task module', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyTaskAppearsInTaskModule();
    });

    test('Test 5: Task list should display correct details for the created task', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyTaskListDisplaysCorrectDetails();
    });

    test('Test 6: Task updates should reflect immediately', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyTaskUpdatesReflectImmediately();
    });

    test('Test 7: Task should not be created without valid data', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyTaskCannotBeCreatedWithoutValidData();
    });

});