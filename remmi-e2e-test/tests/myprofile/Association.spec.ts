import { test as base } from '@playwright/test';
import { MyProfilePage } from '../../pages/myprofile/MyProfilePage';
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
      // Optionally close context if desired in cleanup
    }
  }, { scope: 'worker' }]
});



test.describe('My Profile Associations Tab Tests - Remmi E2E', () => {

    test('Test 1: Verify that the Association tab opens successfully', async ({ sessionPage }) => {
      const profile = new MyProfilePage(sessionPage);
      await profile.navigateToProfilePage();
      await profile.verifyAssociationTabOpensSuccessfully();
    });

    test('Test 2: Verify the search functionality in the Association tab', async ({ sessionPage }) => {
      const profile = new MyProfilePage(sessionPage);
      await profile.navigateToProfilePage();
      await profile.verifyAssociationTabSearchFunctionality("Hina's Project");
    });

    test('Test 3: Verify search with no matching project', async ({ sessionPage }) => {
      const profile = new MyProfilePage(sessionPage);
      await profile.navigateToProfilePage();
      await profile.verifyAssociationTabSearchNoResults("asdfg");
    });

    test('Test 4: Verify that Add Project dropdown opens successfully', async ({ sessionPage }) => {
      const profile = new MyProfilePage(sessionPage);
      await profile.navigateToProfilePage();
      await profile.verifyAddProjectDropdownOpensSuccessfully();
    });

    test('Test 5: Verify the search option inside Add Project dropdown', async ({ sessionPage }) => {
      const profile = new MyProfilePage(sessionPage);
      await profile.navigateToProfilePage();
      await profile.verifySearchOptionInAddProjectDropdown("Hina's Project");
    });

    test('Test 6: Verify single project selection from dropdown', async ({ sessionPage }) => {
      const profile = new MyProfilePage(sessionPage);
      await profile.navigateToProfilePage();
      await profile.verifySingleProjectSelectionFromDropdown("Hina's Project");
    });

    test('Test 7: Verify multiple project selection from dropdown', async ({ sessionPage }) => {
      const profile = new MyProfilePage(sessionPage);
      await profile.navigateToProfilePage();
      await profile.verifyMultipleProjectSelectionFromDropdown(["Hina's Project", "automation Testing"]);
    });

    test('Test 8: Verify the “Select All” functionality', async ({ sessionPage }) => {
      const profile = new MyProfilePage(sessionPage);
      await profile.navigateToProfilePage();
      await profile.verifySelectAllFunctionality();
    });

    test('Test 9: Verify the “Deselect All” functionality', async ({ sessionPage }) => {
      const profile = new MyProfilePage(sessionPage);
      await profile.navigateToProfilePage();
      await profile.verifyDeselectAllFunctionality();
    });

    test('Test 10: Verify removing a project tag before adding', async ({ sessionPage }) => {
      const profile = new MyProfilePage(sessionPage);
      await profile.navigateToProfilePage();
      await profile.verifyRemoveProjectTagBeforeAdding("Hina's Project");
    });

    test('Test 11: Verify adding multiple projects at once', async ({ sessionPage }) => {
      const profile = new MyProfilePage(sessionPage);
      await profile.navigateToProfilePage();
      await profile.verifyMultipleProjectSelection(["Hina's Project", "automation Testing"]);
    });

    test('Test 12: Verify that previously added projects are not duplicated', async ({ sessionPage }) => {
      const profile = new MyProfilePage(sessionPage);
      await profile.navigateToProfilePage();
      await profile.verifyPreviouslyAddedProjectsAreNotDuplicated();
    });

    test('Test 13: Verify adding when list is initially empty', async ({ sessionPage }) => {
      const profile = new MyProfilePage(sessionPage);
      await profile.navigateToProfilePage();
      await profile.verifyInitialProjectSelection();
    });

    test('Test 14: Verify the sort functionality', async ({ sessionPage }) => {
      const profile = new MyProfilePage(sessionPage);
      await profile.navigateToProfilePage();
      await profile.verifyAssocitionSortingList();
    });

    test('Test 15: Verify delete icon under Action column', async ({ sessionPage }) => {
      const profile = new MyProfilePage(sessionPage);
      await profile.navigateToProfilePage();
      await profile.verifyDeleteIconInActionColumn();
    });

    test('Test 16: Verify project delete funcationality', async ({ sessionPage }) => {
      const profile = new MyProfilePage(sessionPage);
      await profile.navigateToProfilePage();
      await profile.verifyProjectDeleteFunctionality();
    });

    test('Test 17: Verify checkbox beside each project', async ({ sessionPage }) => {
      const profile = new MyProfilePage(sessionPage);
      await profile.navigateToProfilePage();
      await profile.verifyCheckboxBesideEachProject();
    });

    test('Test 18: Verify multiple checkbox selection', async ({ sessionPage }) => {
      const profile = new MyProfilePage(sessionPage);
      await profile.navigateToProfilePage();
      await profile.verifyMultipleCheckboxSelection();
    });

    test('Test 19: Verify Select All checkbox selection', async ({ sessionPage }) => {
      const profile = new MyProfilePage(sessionPage);
      await profile.navigateToProfilePage();
      await profile.verifySelectAllCheckbox();
    });

    test('Test 20: Verify bulk delete functionality', async ({ sessionPage }) => {
      const profile = new MyProfilePage(sessionPage);
      await profile.navigateToProfilePage();
      await profile.verifyBulkDeleteFunctionality();
    });

    test('Test 21: Verify UI update after deletion', async ({ sessionPage }) => {
      const profile = new MyProfilePage(sessionPage);
      await profile.navigateToProfilePage();
      await profile.verifyUIUpdateAfterDeletion();
    });

    test('Test 22: Verify that deleted projects can be re-added', async ({ sessionPage }) => {
      const profile = new MyProfilePage(sessionPage);
      await profile.navigateToProfilePage();
      await profile.verifyDeletedProjectsCanBeReadded("lahore centre");
    });

    test('Test 23: Verify empty list message', async ({ sessionPage }) => {
      const profile = new MyProfilePage(sessionPage);
      await profile.navigateToProfilePage();
      await profile.verifyEmptyListMessage("lahore centre");
    });

    test('Test 24: Try adding project without selecting any', async ({ sessionPage }) => {
      const profile = new MyProfilePage(sessionPage);
      await profile.verifyAddProjectwithoutDropdownOption();
    });

});