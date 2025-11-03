import { test } from '@playwright/test';
import { MyProfileActions } from './MyProfileActions';
import { LoginActions } from '../Login/LoginAction';
import { LoginUsers } from '../../fixture/test-data';

const OprationManager = LoginUsers.manager;
const salesAgent = LoginUsers.sales;
const admin = LoginUsers.admin;


test.describe('My Profile Associations Tab Tests - Remmi E2E', () => {

    test('Test 1: Verify that the Association tab opens successfully', async ({ page }) => {
      const login = new LoginActions(page);
      const profile = new MyProfileActions(page);
  
      await login.login(OprationManager.email!, OprationManager.password!, OprationManager.otpSecret!);
  
      await profile.navigateToProfilePage();
      await profile.verifyAssociationTabOpensSuccessfully()
    });

    test('Test 2: Verify the search functionality in the Association tab', async ({ page }) => {
        const login = new LoginActions(page);
        const profile = new MyProfileActions(page);
    
        await login.login(OprationManager.email!, OprationManager.password!, OprationManager.otpSecret!);
    
        await profile.navigateToProfilePage();
        await profile.verifyAssociationTabSearchFunctionality("Hina's Project")
      });

      test('Test 3: Verify search with no matching project', async ({ page }) => {
        const login = new LoginActions(page);
        const profile = new MyProfileActions(page);
    
        await login.login(OprationManager.email!, OprationManager.password!, OprationManager.otpSecret!);
    
        await profile.navigateToProfilePage();
        await profile.verifyAssociationTabSearchNoResults("asdfg")
      });

      test('Test 4: Verify that Add Project dropdown opens successfully', async ({ page }) => {
        const login = new LoginActions(page);
        const profile = new MyProfileActions(page);
    
        await login.login(OprationManager.email!, OprationManager.password!, OprationManager.otpSecret!);
    
        await profile.navigateToProfilePage();
        await profile.verifyAddProjectDropdownOpensSuccessfully()
      });

      test('Test 5: Verify the search option inside Add Project dropdown', async ({ page }) => {
        const login = new LoginActions(page);
        const profile = new MyProfileActions(page);
    
        await login.login(OprationManager.email!, OprationManager.password!, OprationManager.otpSecret!);
    
        await profile.navigateToProfilePage();
        await profile.verifySearchOptionInAddProjectDropdown("Hina's Project")
      });
      
      test('Test 6: Verify single project selection from dropdown', async ({ page }) => {
        const login = new LoginActions(page);
        const profile = new MyProfileActions(page);
    
        await login.login(OprationManager.email!, OprationManager.password!, OprationManager.otpSecret!);
    
        await profile.navigateToProfilePage();
        await profile.verifySingleProjectSelectionFromDropdown("Hina's Project")
      });

      test('Test 7: Verify multiple project selection from dropdown', async ({ page }) => {
        const login = new LoginActions(page);
        const profile = new MyProfileActions(page);

        await login.login(OprationManager.email!, OprationManager.password!, OprationManager.otpSecret!);

        await profile.navigateToProfilePage();
        await profile.verifyMultipleProjectSelectionFromDropdown(["Hina's Project", "askari center"]);
      });

      test('Test 8: Verify the “Select All” functionality', async ({ page }) => {
        const login = new LoginActions(page);
        const profile = new MyProfileActions(page);

        await login.login(OprationManager.email!, OprationManager.password!, OprationManager.otpSecret!);

        await profile.navigateToProfilePage();
        await profile.verifySelectAllFunctionality();
      });

      test('Test 9: Verify the “Deselect All” functionality', async ({ page }) => {
        const login = new LoginActions(page);
        const profile = new MyProfileActions(page);

        await login.login(OprationManager.email!, OprationManager.password!, OprationManager.otpSecret!);

        await profile.navigateToProfilePage();
        await profile.verifyDeselectAllFunctionality();
      });

      test('Test 10: Verify removing a project tag before adding', async ({ page }) => {
        const login = new LoginActions(page);
        const profile = new MyProfileActions(page);

        await login.login(OprationManager.email!, OprationManager.password!, OprationManager.otpSecret!);

        await profile.navigateToProfilePage();
        await profile.verifyRemoveProjectTagBeforeAdding("Hina's Project");
      });

      test('Test 11: Verify adding multiple projects at once', async ({ page }) => {
        const login = new LoginActions(page);
        const profile = new MyProfileActions(page);

        await login.login(OprationManager.email!, OprationManager.password!, OprationManager.otpSecret!);

        await profile.navigateToProfilePage();
        await profile.verifyMultipleProjectSelection(["Hina's Project", "askari center"]);
      });

      test('Test 12: Verify that previously added projects are not duplicated', async ({ page }) => {
        const login = new LoginActions(page);
        const profile = new MyProfileActions(page);

        await login.login(OprationManager.email!, OprationManager.password!, OprationManager.otpSecret!);

        await profile.navigateToProfilePage();
        await profile.verifyPreviouslyAddedProjectsAreNotDuplicated(["Hina's Project", "askari center"]);
      });
      test('Test 13: Verify adding when list is initially empty', async ({ page }) => {
        const login = new LoginActions(page);
        const profile = new MyProfileActions(page);

        await login.login(OprationManager.email!, OprationManager.password!, OprationManager.otpSecret!);

        await profile.navigateToProfilePage();
        await profile.verifyInitialProjectSelection(["Hina's Project", "askari center", "New Staging Project"]);
      });
      test('Test 14: Verify the sort functionality', async ({ page }) => {
        const login = new LoginActions(page);
        const profile = new MyProfileActions(page);

        await login.login(OprationManager.email!, OprationManager.password!, OprationManager.otpSecret!);

        await profile.navigateToProfilePage();
        await profile.verifyAssocitionSortingList();
      });

      test('Test 15: Verify delete icon under Action column', async ({ page }) => {
        const login = new LoginActions(page);
        const profile = new MyProfileActions(page);

        await login.login(OprationManager.email!, OprationManager.password!, OprationManager.otpSecret!);

        await profile.navigateToProfilePage();
        await profile.verifyDeleteIconInActionColumn();
      });

      test('Test 16: Verify project delete funcationality', async ({ page }) => {
        const login = new LoginActions(page);
        const profile = new MyProfileActions(page);

        await login.login(OprationManager.email!, OprationManager.password!, OprationManager.otpSecret!);

        await profile.navigateToProfilePage();
        await profile.verifyProjectDeleteFunctionality();
      });
})