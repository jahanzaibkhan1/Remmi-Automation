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
})