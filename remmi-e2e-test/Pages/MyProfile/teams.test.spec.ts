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

});