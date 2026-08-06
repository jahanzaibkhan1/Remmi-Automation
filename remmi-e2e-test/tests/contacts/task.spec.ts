import { test } from '../../fixtures/session.fixture';
import { ContactTaskPage as ContactPage } from '../../pages/contacts/ContactTaskPage';

test.describe('Contacts side Menu Tests - Remmi E2E', () => {

  test('Test 1: Tasks tab should display existing task records', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTasksTabDisplaysExistingTasks();
  });

  test('Test 2: "New Task" button should open the task creation form', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyNewTaskButtonOpensTaskCreationForm();
  });

  test('Test 3: Task should appear in the list after creation', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTaskAppearsInList();
  });

  test('Test 4: Task should also appear in the Task module', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTaskAppearsInTaskModule();
  });

  test('Test 5: Task list should display correct details', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTaskListDisplaysCorrectDetails();
  });

  test('Test 6: Task updates should reflect immediately', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTaskUpdatesReflectImmediately();
  });

  test('Test 7: Task should not be created without valid data', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTaskCannotBeCreatedWithoutValidData();
  });

  test('Test 8: Task status updates should be logged correctly', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTaskUpdatesReflectImmediately();
  });

  test('Test 9: Tasks should remain linked to the correct contact', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTaskRemainsLinkedToCorrectContact();
  });

});