import { test, expect } from '@playwright/test';
import { MyProfileActions } from './MyProfileActions';
import { LoginActions } from '../Login/LoginAction';
import { LoginUsers } from '../../fixture/test-data';
import path from 'path';
import fs from 'fs';

const operationManager = LoginUsers.manager;
const IMAGE_DIR = path.resolve(__dirname, 'Images');

function ensureDirExists(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function ensureFileExists(filepath: string, content = 'This is not a valid image file') {
  if (!fs.existsSync(filepath)) fs.writeFileSync(filepath, content);
}

test.describe('Teams Tab Tests - Remmi E2E', () => {

  test('Test case 1: Verify search works for existing team names', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);
    await profile.navigateToProfilePage();
    await profile.SearchForExistingTeam('Hina Team');
  });

  test('Test case 2: Verify no results message appears for invalid team name.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);
    await profile.navigateToProfilePage();
    await profile.SearchForInvalidTeam('fjjs jjs');
  });

  test('Test case 3: Verify Add button remains disabled when no team is selected.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);
    await profile.navigateToProfilePage();
    await profile.verifyAddButtonDisabledWhenNoTeamSelected();
  });

  test('Test case 4: Verify clicking disabled Add button performs no action.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);
    await profile.navigateToProfilePage();
    await profile.verifyAddButtonperformNoAction();
  });

  test('Test case 5: Verify selecting a team enables Add button.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);
    await profile.navigateToProfilePage();
    await profile.verifySelectingTeamEnablesAddButton('Hina Team');
  });

  test('Test case 6: Verify Add button doesn’t enable due to dropdown lag.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);
    await profile.navigateToProfilePage();
    await profile.verifyAddButtonNotEnabledDueToDropdownLag('Hina Team');
  });

  test('Test case 7: Verify selected teams appear as tags below the dropdown.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);
    await profile.navigateToProfilePage();
    await profile.verifySelectedTeamAppearsAsTag('Team 1');
  });

  test('Test case 8: Verify removing a tag updates the list', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);
    await profile.navigateToProfilePage();
    await profile.verifyRemovingTagUpdatesList('Team 2');
  });

  test('Test case 9: Verify user can select multiple teams from dropdown.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);
    await profile.navigateToProfilePage();
    await profile.verifyUserCanSelectMultipleTeams(['Team 4', 'Team dev', 'xenex media']);
  });

  test('Test case 10: Verify clicking Add adds selected teams to list.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);
    await profile.navigateToProfilePage();
    await profile.verifySelectMultipleTeams(['Team 4', 'Team dev', 'xenex media']);
  });

  test('Test case 11: Verify “Create New” opens Add Team popup.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);
    await profile.navigateToProfilePage();
    await profile.VerifyCreateNewTeamPopUp();
  });

  test('Test case 12: Verify popup close (X) closes Add Team popup.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);
    await profile.navigateToProfilePage();
    await profile.VerifyCrossPopUpButton();
  });


});