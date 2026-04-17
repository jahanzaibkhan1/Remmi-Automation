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

test.describe('Associations Tab Tests - Remmi E2E', () => {

  test('Verify that the Associations tab opens correctly', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyAssociationsTabOpensCorrectly();
  });

  test('Verify that the "Access Remmi" button displays the password field', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyAccessRemmiButtonDisplaysPasswordField();
  });

  test('Verify password must be at least 12 characters ', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyPasswordMustBeAtLeast12Characters();
  });

  test('Verify that login access is not granted without entering a password', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyLoginAccessNotGrantedWithoutPassword();
  });

  test('Verify that projects can be searched in the "Add Project" dropdown', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyProjectCanBeSearchedInAddProjectDropdown('east Village Vila');
  });

  test('Verify that clicking the "Select All" checkbox selects all projects in the "Add Project" dropdown', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifySelectAllCheckboxSelectsAllProjects();
  });

  test('Verify that clicking "Deselect All" unselects all selected projects', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyDeselectAllUnselectsAllProjects();
  });

  test('Verify that clicking the "+" button adds the selected project to the list', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyAddProjectButtonAddsProject('east Village Vila');
  });

  test('Verify that added projects can be deleted from the list', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyProjectCanBeDeletedFromList();
  });

});