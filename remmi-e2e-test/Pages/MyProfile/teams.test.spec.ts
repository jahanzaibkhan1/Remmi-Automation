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

  
  test('Test case 0: Delete all existing teams', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.DeleteExistingTeam();
  });

  test('Test case 1: Verify search works for existing team names', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.SearchForExistingTeam('Hina Team');
  });

  test('Test case 2: Verify no results message appears for invalid team name.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.SearchForInvalidTeam('fjjs jjs');
  });

  test('Test case 3: Verify Add button remains disabled when no team is selected.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.verifyAddButtonDisabledWhenNoTeamSelected();
  });

  test('Test case 4: Verify clicking disabled Add button performs no action.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.verifyAddButtonperformNoAction();
  });

  test('Test case 5: Verify selecting a team enables Add button.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.verifySelectingTeamEnablesAddButton('Hina Team');
  });

  test('Test case 6: Verify Add button doesn’t enable due to dropdown lag.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.verifyAddButtonNotEnabledDueToDropdownLag('Hina Team');
  });

  test('Test case 7: Verify selected teams appear as tags below the dropdown.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.verifySelectedTeamAppearsAsTag('Team 1');
  });

  test('Test case 8: Verify removing a tag updates the list', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.verifyRemovingTagUpdatesList('Team 2');
  });

  test('Test case 9: Verify user can select multiple teams from dropdown.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.verifyUserCanSelectMultipleTeams(['Team 4', 'Team dev', 'xenex media']);
  });

  test('Test case 10: Verify clicking Add adds selected teams to list.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.verifySelectMultipleTeams(['Team 4', 'Team dev', 'xenex media']);
  });

  test('Test case 11: Verify “Create New” opens Add Team popup.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.VerifyCreateNewTeamPopUp();
  });

  test('Test case 12: Verify popup close (X) closes Add Team popup.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.VerifyCrossPopUpButton();
  });

  test('Test case 13: Verify JPG and PNG formats are accepted, and invalid image format is rejected for team upload.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);


    ensureDirExists(IMAGE_DIR);
    const jpgImagePath = path.join(IMAGE_DIR, 'High.jpg');
    const pngImagePath = path.join(IMAGE_DIR, 'premium.png');
    const invalidImagePath = path.join(IMAGE_DIR, 'invalidImage.webp');

    ensureFileExists(jpgImagePath, 'Profile Image with jpg format');
    ensureFileExists(pngImagePath, 'Profile Image with png format');
    ensureFileExists(invalidImagePath, 'This is an invalid image format file.');

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();

    // Upload jpg, then png, then an invalid file format
    await profile.verifyImageFormats(jpgImagePath, pngImagePath, invalidImagePath);
  });

  test('Test case 14: Verify unsupported file formats show validation error.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    ensureDirExists(IMAGE_DIR);
    const invalidImagePath = path.join(IMAGE_DIR, 'invalidImage.webp');

    ensureFileExists(invalidImagePath, 'This is an invalid image format file.');

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();

    // Upload jpg, then png, then an invalid file format
    await profile.verifyUnsupportedFiles(invalidImagePath);
  });

  test('Test case 15: Verify required field validation for Team Name, Office, and Members.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.VerifyRequiredFiled();
  });
  test('Test case 16: Verify team cannot be created with missing required field.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.VerifyRequiredFieldValidation();
  });
  test('Test case 17: Verify selecting office filters available members.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.VerifySelectingOfficeFiltersMembers('QA Tester');
  });

  test('Test case 18: Verify no members shown when office not selected', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.VerifyNoMembersWithoutOffice();
  });
  test('Test case 19: Verify selecting members activates Team Leader dropdown.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.VerifyTeamLeaderDropdownActive('QA Tester', 'Jahanzaib Xenex');
  });

  test('Test case 20: Verify team creation fails if no Team Leader is selected.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.VerifyTeamCreationWithoutLeader('QA Tester', 'Jahanzaib Xenex');
  });
  test('Test case 21: Verify successful team creation with all valid details.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.VerifyTeamCreationWithValidDetails('QA Tester', 'Jahanzaib Xenex', 'Jahanzaib Xenex');
  });
  test('Test case 22: Verify Cancel button closes popup without saving.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.verifyCancelClosesPopupWithoutSaving('QA Tester', 'Jahanzaib Xenex', 'Jahanzaib Xenex');
  });
  test('Test case 23: Verify unsaved data does not persist after closing popup', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.verifyUnsavedDataNotPersist('QA Tester', 'Jahanzaib Xenex', 'Jahanzaib Xenex');
  });
  
  test('Test case 24: Verify newly created team appears in dropdown and team list.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.verifyNewTeamAppearsInListAndDropdown('QA Tester', 'Jahanzaib Xenex', 'Jahanzaib Xenex');
  });
  test('Test case 25: Verify failed team creation doesn’t reflect in list.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.verifyEmptySpacesTeamNameDoesNotReflectInList('QA Tester', 'Jahanzaib Xenex', 'Jahanzaib Xenex');
  });

  test('Test case 26: Verify failed team creation doesn’t reflect in list.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.verifyTeamListSorting();
  });
  test('Test case 27: Verify sort button on empty list doesn’t crash UI.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);
  
    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.verifySortButtonOnEmptyListDoesNotCrashUI();
  });

  test('Test case 28: Verify Edit icon opens existing team for update', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);
  
    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.verifyEditIconOpensTeamForUpdate();
  });

  test('Test case 29: Verify Delete icon opens confirmation popup.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);
  
    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.verifyDeleteIconOpensConfirmationPopup();
  });

  test('Test case 30: Verify clicking Cancel on Delete popup keeps team.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);
  
    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.verifyCancelOnDeleteKeepsTeam();
  });
  
  test('Test case 31: Verify confirming Delete removes team permanently.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.verifyDeleteIconRemovesTeamPermanently();
  });

  test('Test case 32: Verify team created in My Profile also appears in Team module', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.verifyTeamCreatedInMyProfileAlsoAppearsInTeamModule('QA Tester','Jahanzaib Xenex', 'Jahanzaib Xenex');
  });

  test('Test case 33: Verify alignment of Add button with Team dropdown.', async ({ page }) => {
     const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.verifyAlignmentOfAddButtonWithTeamDropdown();
  });
  test('Test case 34: Verify dropdown supports search for large team lists.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.verifyDropdownSupportsSearchForLargeTeamLists('Team');
  });

  test('Test case 35: Verify dropdown search with invalid keyword.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.verifyDropdownWithInvalidKeyword('keyword jjs');
  });
  test('Test case 36: Verify toast notification appears after team creation.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.VerifyToastAfterTeamCreation('QA Tester', 'Jahanzaib Xenex', 'Jahanzaib Xenex');
  });

  test('Test case 37: Verify no duplicate toast shown for single event.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.VerifySingleToastOnMultipleClicks('QA Tester', 'Jahanzaib Xenex', 'Jahanzaib Xenex');
  });

  test('Test case 38: Verify validation message color (red for errors).', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.VerifyRequiredFieldErrorColor();
  });

  test('Test case 39: Verify confirmation message color (green for success)', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.VerifyConfirmationMessageColor('QA Tester', 'Jahanzaib Xenex', 'Jahanzaib Xenex');
  });
  test('Test case 40: Verify data remains after page refresh.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.VerifyTeamCreationWithValidDetails('QA Tester', 'Jahanzaib Xenex', 'Jahanzaib Xenex');
  });
  test('Test case 41: Verify unsaved popup data lost on refresh.', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
        operationManager.email!,
        operationManager.password!,
        process.env.E2E_MANAGER_OTP_SECRET!
      );
    await profile.navigateToProfilePage();
    await profile.VerifyUnsavedPopupDataLostOnRefresh('QA Tester', 'Jahanzaib Xenex', 'Jahanzaib Xenex');
  });
});
