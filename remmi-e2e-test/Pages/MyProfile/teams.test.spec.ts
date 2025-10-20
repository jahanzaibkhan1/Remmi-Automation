import { test } from '@playwright/test';
import { MyProfileActions } from './MyProfileActions';
import { LoginActions } from '../Login/LoginAction';
import { LoginUsers } from '../../fixture/test-data';

const operationManager = LoginUsers.manager;
const salesAgent = LoginUsers.sales;
const admin = LoginUsers.admin;

let login: LoginActions;
let profile: MyProfileActions;

// 🔹 Helper functions
async function SearchForExistingTeam() {
  await profile.navigateToProfilePage();
  await profile.SearchForExistingTeam('Hina Team');
}

async function SearchForInvalidTeam() {
  await profile.navigateToProfilePage();
  await profile.SearchForInvalidTeam('fjjs jjs');
}


async function verifyAddButtonDisabledWhenNoTeamSelected() {
  await profile.navigateToProfilePage();
  await profile.verifyAddButtonDisabledWhenNoTeamSelected();
}

async function verifyAddButtonperformNoAction() {
  await profile.navigateToProfilePage();
  await profile.verifyAddButtonperformNoAction();
}

async function verifySelectingTeamEnablesAddButton() {
  await profile.navigateToProfilePage();
  await profile.verifySelectingTeamEnablesAddButton('Hina Team');
}

async function verifyAddButtonNotEnabledDueToDropdownLag() {
  await profile.navigateToProfilePage();
  await profile.verifyAddButtonNotEnabledDueToDropdownLag('Hina Team');
}

async function verifySelectedTeamAppearsAsTag() {
  await profile.navigateToProfilePage();
  await profile.verifySelectedTeamAppearsAsTag('Team 1');
}

async function verifyRemovingTagUpdatesList() {
  await profile.navigateToProfilePage();
  await profile.verifyRemovingTagUpdatesList('Team 2');
}

async function verifyUserCanSelectMultipleTeams() {
  await profile.navigateToProfilePage();
  await profile.verifyUserCanSelectMultipleTeams(['Team 4', 'Team dev', 'xenex media']);
}

// ----------- Tests -----------

test.describe('Teams Tab Tests - Remmi E2E', () => {
  test('Test case 1: Verify search works for existing team names', async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);

    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);

    await SearchForExistingTeam();
  });

  test('Test case 2: Verify no results message appears for invalid team name.', async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);

    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);

    await SearchForInvalidTeam();
  });

  test('Test case 3: Verify Add button remains disabled when no team is selected.', async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);

    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);

    await verifyAddButtonDisabledWhenNoTeamSelected();
  });

  test('Test case 4: Verify clicking disabled Add button performs no action.', async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);

    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);

    await verifyAddButtonperformNoAction();
  });

  test('Test case 5: Verify selecting a team enables Add button.', async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);

    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);

    await verifySelectingTeamEnablesAddButton();
  });

  test('Test case 6: Verify Add button doesn’t enable due to dropdown lag.', async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);

    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);

    await verifyAddButtonNotEnabledDueToDropdownLag();
  });

  test('Test case 7: Verify selected teams appear as tags below the dropdown.', async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);

    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);

    await verifySelectedTeamAppearsAsTag();
  });
  test('Test case 8: Verify removing a tag updates the list', async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);

    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);

    await verifyRemovingTagUpdatesList();
  });
  test('Test case 9: Verify user can select multiple teams from dropdown.', async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);
  
    if (!operationManager.email || !operationManager.password || !operationManager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }
  
    await login.login(operationManager.email!, operationManager.password!, operationManager.otpSecret!);
  
    await verifyUserCanSelectMultipleTeams();
  });
  
  
});