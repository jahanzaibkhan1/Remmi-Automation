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

    test('Test 1: Verify that Title, Due Date, Staff, Task Status, and Task Type are mandatory fields in the "Create New Task" popup', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyTaskFormMandatoryFields();
    });

    test('Test 2: Verify that a dropdown list opens when clicking on Task Type field in the "New Task" form', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyTaskTypeDropdownOpens();
    });

    test('Test 3: Verify that a dropdown list opens when clicking on Task Status field.', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyTaskStatusDropdownOpens();
    });

    test('Test 4: Verify that selecting "Lead Management" from Task Type triggers the Lead Name dropdown in the task form', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyLeadNameDropdownAppearsOnLeadManagementTaskType();
    });

    test('Test 5: Verify that a task is created for the selected listing when lead name is selected from the dropdown.', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyTaskAppearsInList('Testing Task');
    });

    test('Test 6: Verify that selecting a module shows a relevant dropdown list for that module (e.g., Listings, Properties, Projects)', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyModuleDropdownsAppearForSelectedModule();
    });

    test('Test 7: Verify that selecting a listing from the dropdown creates a task linked to that listing', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyTaskIsLinkedToSelectedListing('Testing Task');
    });

    test('Test 8: Verify that selecting the Property module shows a dropdown list for selecting a property', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyModuleDropdownsAppearForSelectedModule();
    });

    test('Test 9: Verify that selecting a property from the dropdown creates a task linked to that property', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyTaskAppearsInList('Testing Task');
    });

    test('Test 10: Verify that selecting the "Project" module shows a dropdown list for selecting a project', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyProjectDropdownIsVisible();
    });

    test('Test 11: Verify that selecting a project from the dropdown creates a task linked to that project', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyTaskIsLinkedToSelectedProject('Testing Task');
    });

    test('Test 12: Verify that setting a reminder time sends an email or notification at the selected interval', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyTaskReminderTriggersNotification('Task Created');
    });

    test('Test 13: Verify that recurring task checkbox shows a dropdown with "Weekly," "Monthly," and "Yearly" options.', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyRecurringTaskOptions();
    });

    test('Test 14: Verify that selecting "Weekly" from the recurring task dropdown sends email/notifications weekly.', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyWeeklyRecurringTaskSendsNotification('Recurring Weekly Task');
    });

    test('Test 15: Verify that selecting "Monthly" from the recurring task dropdown sends email/notifications monthly.', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyMonthlyRecurringTaskSendsNotification('Recurring Monthly Task');
    });

    test('Test 16: Verify that selecting "Yearly" from the recurring task dropdown sends email/notifications yearly.', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyYearlyRecurringTaskSendsNotification('Recurring Yearly Task');
    });

    test('Test 17: Verify that clicking "Sync Calendar" allows selection of a time period for task reminders', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifySyncCalendarTaskSendsNotification('Task Reminder');
    });

    test('Test 18: Verify that when a comment is added in the "Additional Comments" section, a notification is sent to the selected staff member.', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyCommentNotificationToStaff();
    });

    test('Test 19: Verify that the added comment appears below the "Additional Comments" section once the task is saved.', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyCommentAppearsUnderAdditionalComments();
    });

    test('Test 20: Verify that after adding a file and saving the task, the file appears only once even if "Save" is clicked twice', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      const path = require('path');
      const IMAGE_DIR = path.resolve(__dirname, 'PropertyImages');
      const imagePath = path.join(IMAGE_DIR, 'PropertyImage2.jpg');
      await listingActions.verifyFileUploadNoDuplicationOnDoubleSave(imagePath);
    });

    test('Test 21: Verify that the added file appears correctly after saving the task.', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyFileAppearsAfterTaskSave();
    });

    test('Test 22: Verify that after creating a task, the "Create Sub Task" option becomes visible.', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyCreateSubTaskOptionVisible();
    });

    test('Test 23: Verify that clicking on the "Create Sub Task" button shows a field below the staff section to enter a sub task title.', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyCreateSubTaskFieldAppearsBelowStaff();
    });

    test('Test 24: Verify that the sub task is visible within the parent task after creation.', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifySubTaskIsVisibleInParentTask();
    });

    test('Test 25: Verify that when the sub task is opened, a parent task dropdown is shown next to the team field.', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyParentTaskDropdownVisibleOnSubTaskOpen();
    });

    test('Test 26: Verify that all fields of the original task are copied correctly to the new task when the "Copy Task" option is used.', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyCopyTaskCopiesAllFieldsCorrectly();
    });

});