import { test } from '../../fixtures/session.fixture';
import { ContactTaskFormPage as ContactPage } from '../../pages/contacts/ContactTaskFormPage';

test.describe('Contacts side Menu Tests - Remmi E2E', () => {

  test('Test 1: Verify that Title, Due Date, Staff, Task Status, and Task Type are mandatory fields in the "Create New Task" popup.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTaskMandatoryFields();
  });

  test('Test 2: Verify that a dropdown list opens when clicking on Task Type field.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTaskTypeDropdownOpens();
  });

  test('Test 3: Verify that a dropdown list opens when clicking on Task Status field.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTaskStatusDropdownOpens();
  });

  test('Test 4: Verify that selecting "Lead Management" from Task Type triggers the Lead Name dropdown in the task form.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyLeadNameDropdownAppearsOnLeadManagementTaskType();
  });

  test('Test 5: Verify that a task is created for the selected lead when lead Name is selected from the dropdown.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTaskAppearsInList();
  });

  test('Test 6: Verify that selecting a module shows a relevant dropdown list for that module (e.g., Contacts, Properties, Projects).', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyModuleDropdownsAppearForSelectedModule();
  });

  test('Test 7: Verify that selecting a contact from the dropdown creates a task linked to that contact.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTaskAppearsInList();
  });

  test('Test 8: Verify that the contact tag is displayed correctly in the task form.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyContactTagIsDisplayed();
  });

  test('Test 9: Verify that selecting the "Property" module shows a dropdown list for selecting a property.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyContactFormDisplaysFromTask();
  });

  test('Test 10: Verify that the contact form displays correctly when opening or creating a contact from a task.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyContactFormFromTask();
  });

  test('Test 11: Verify that selecting a property from the dropdown creates a task linked to that property.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTaskLinkedToSelectedProperty();
  });

  test('Test 12: Verify that after creating a task, the associated property is correctly shown when the task is opened', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTaskRemainsLinkedToCorrectContact();
  });

  test('Test 13: Verify that a task created for a specific property is only visible within that property and the task module', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyContactFormDisplaysFromTask();
  });

  test('Test 14: Verify that selecting the "Project" module shows a dropdown list for selecting a project.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyProjectDropdownIsVisible();
  });

  test('Test 15: Verify that selecting a project from the dropdown creates a task linked to that project.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTaskLinkedToSelectedProject();
  });

  test('Test 16: Verify that selecting the "Listing" module shows a dropdown list for selecting a listing.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyListingDropdownIsVisible();
  });

  test('Test 17: Verify that selecting a listing from the dropdown creates a task linked to that listing.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTaskLinkedToSelectedListing();
  });

  test('Test 18: Verify that after creating a task, the associated listing is correctly shown when the task is opened', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTaskRemainsLinkedToCorrectContact();
  });

  test('Test 19: Verify that a task created for a specific listing is only visible within that listing and the task module', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTaskLinkedToSelectedListing();
  });

  test('Test 20: Verify that recurring task checkbox shows a dropdown with "Weekly," "Monthly," and "Yearly" options.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyRecurringTaskOptions();
  });

  test('Test 21: Verify that selecting "Weekly" from the recurring task dropdown sends email/notifications weekly.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyRecurringTaskSendsEmailNotifications('Recurring Weekly Task');
  });

  test('Test 22: Verify that clicking "Sync Calendar" allows selection of a time period for task reminders.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifySyncCalendarAllowsTimePeriodSelection('Task Reminder');
  });

  test('Test 23: Verify that setting a reminder time sends an email or notification at the selected interval.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTaskReminderTriggersNotification();
  });

  test('Test 24: Verify that syncing the calendar with selected days sends email/notifications for the chosen period.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifySyncCalendarAllowsTimePeriodSelection('Task Reminder');
  });

  test('Test 25: Verify that selecting a team from the dropdown shows the task to all users in that team.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTaskVisibleToAllTeamMembers();
  });

  test('Test 26: Verify that users added to the selected team can view the task.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTaskVisibleToTeamMember();
  });

  test('Test 27: Verify that when a comment is added in the "Additional Comments" section, a notification is sent to the selected staff member.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyCommentNotificationToStaff();
  });

  test('Test 28: Verify that the added comment appears below the "Additional Comments" section once the task is saved.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyCommentAppearsUnderAdditionalComments();
  });

  test('Test 29: Verify that after adding a file and saving the task, the file appears only once even if "Save" is clicked twice', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    const path = require('path');
    const IMAGE_DIR = path.resolve(__dirname, 'Images');
    const imagePath = path.join(IMAGE_DIR, 'PropertyImage2.jpg');
    await contact.verifyFileUploadNoDuplicationOnDoubleSave(imagePath);
  });

  test('Test 30: Verify that the added file appears correctly after saving the task.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    const path = require('path');
    const IMAGE_DIR = path.resolve(__dirname, 'Images');
    const imagePath = path.join(IMAGE_DIR, 'PropertyImage2.jpg');
    await contact.verifyFileAppearsAfterTaskSave(imagePath);
  });

  test('Test 31: Verify that after creating a task, the "Create Sub Task" option becomes visible.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyCreateSubTaskOptionVisible();
  });

  test('Test 32: Verify that clicking on the "Create Sub Task" button shows a field below the staff section to enter a sub task title.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyCreateSubTaskFieldAppearsBelowStaff();
  });

  test('Test 33: Verify that entering a title in the sub task field and saving creates the sub task.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifySubTaskCreation();
  });

  test('Test 34: Verify that the sub task is visible within the parent task after creation.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifySubTaskVisibleInParentTask();
  });

  test('Test 35: Verify that when the sub task is opened, a parent task dropdown is shown next to the team field.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyParentTaskDropdownShownInSubTask();
  });

  test('Test 36: Verify that selecting a different parent task from the parent task dropdown updates the sub task’s parent task.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyParentTaskDropdownShownInSubTask();
  });

  test('Test 37: Verify that all fields of the original task are copied correctly to the new task when the "Copy Task" option is used.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyCopyTaskCopiesAllFieldsCorrectly();
  });

  test('Test 38: Verify that changes to the original task do not affect the copied task after it has been created.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyOriginalTaskNotAffectCopiedTask();
  });

  test('Test 39: Verify that the task is visible in the task list after it is saved.', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTaskAppearsInListAfterSave();
  });
  
});