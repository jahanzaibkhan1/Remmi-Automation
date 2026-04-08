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

  test('Test 9: Verify that selecting the "Property" module shows a dropdown list for selecting a property.', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyContactFormDisplaysFromTask();
  });

  test('Test 10: Verify that the contact form displays correctly when opening or creating a contact from a task.', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyContactFormFromTask();
  });
  
  test('Test 11: Verify that selecting a property from the dropdown creates a task linked to that property.', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyTaskLinkedToSelectedProperty();
  });

  test('Test 12: Verify that after creating a task, the associated property is correctly shown when the task is opened', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyTaskRemainsLinkedToCorrectContact();
  });

  test('Test 13: Verify that a task created for a specific property is only visible within that property and the task module', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyContactFormDisplaysFromTask();
  });

  test('Test 14: Verify that selecting the "Project" module shows a dropdown list for selecting a project.', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyProjectDropdownIsVisible();
  });

  test('Test 15: Verify that selecting a project from the dropdown creates a task linked to that project.', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyTaskLinkedToSelectedProject();
  });

  test('Test 16: Verify that selecting the "Listing" module shows a dropdown list for selecting a listing.', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyListingDropdownIsVisible();
  });

  test('Test 17: Verify that selecting a listing from the dropdown creates a task linked to that listing.', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyTaskLinkedToSelectedListing();
  });

  test('Test 18: Verify that after creating a task, the associated listing is correctly shown when the task is opened', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyTaskRemainsLinkedToCorrectContact();
  });

  test('Test 19: Verify that a task created for a specific listing is only visible within that listing and the task module', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyTaskLinkedToSelectedListing();
  });

  test('Test 20: Verify that recurring task checkbox shows a dropdown with "Weekly," "Monthly," and "Yearly" options.', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyRecurringTaskOptions();
  });

  test('Test 21: Verify that selecting "Weekly" from the recurring task dropdown sends email/notifications weekly.', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyRecurringTaskSendsEmailNotifications('Recurring Weekly Task');
  });

  test('Test 22: Verify that clicking "Sync Calendar" allows selection of a time period for task reminders.', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifySyncCalendarAllowsTimePeriodSelection('Task Reminder');
  });

  test('Test 23: Verify that setting a reminder time sends an email or notification at the selected interval.', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyTaskReminderTriggersNotification();
  });

  test('Test 24: Verify that syncing the calendar with selected days sends email/notifications for the chosen period.', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifySyncCalendarAllowsTimePeriodSelection('Task Reminder');
  });

  test('Test 25: Verify that selecting a team from the dropdown shows the task to all users in that team.', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyTaskVisibleToAllTeamMembers('Team Task');
  });

});