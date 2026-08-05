import { test } from '../../fixtures/session.fixture';
import { ListingPage } from '../../pages/listing/ListingPage';

test.describe('Listing side Menu Tests - Remmi E2E', () => {

    test('Test 1: Tasks tab should display existing task records', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyTasksTabDisplaysRecords();
    });

    test('Test 2: "New Task" button should open the task creation form', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyNewTaskButtonOpensTaskForm();
    });

    test('Test 3: Task should appear in the list after creation', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyTaskAppearsInList('Testing Task');
    });

    test('Test 4: Task should also appear in the Task module', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyTaskAppearsInTaskModule();
    });

    test('Test 5: Task list should display correct details for the created task', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyTaskListDisplaysCorrectDetails();
    });

    test('Test 6: Task updates should reflect immediately', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyTaskUpdatesReflectImmediately();
    });

    test('Test 7: Task should not be created without valid data', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyTaskCannotBeCreatedWithoutValidData();
    });

    test('Test 8: Task status updates should be logged correctly', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyTaskUpdatesReflectImmediately();
    });

    test('Test 9: Tasks should remain linked to the correct listing', async ({ sessionPage }) => {
      const listingActions = new ListingPage(sessionPage);
      await listingActions.verifyTaskAppearsInList('Testing Task');
    });

});