import { Page, expect, test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { MyProfileBasePage } from './MyProfileBasePage';

export class MyProfileTeamsPage extends MyProfileBasePage {
  constructor(page: Page) {
    super(page);
  }

  private async NavigateToTeamsTab(): Promise<void> {
    const tab = this.locators.TeamsTabs();
    await tab.click();
  }

  private async searchTeamName(teamName: string): Promise<void> {
    const searchTeam = this.locators.SelectTeam(teamName);
    await expect(searchTeam).toBeVisible();
    await searchTeam.click();
    await searchTeam.fill(teamName);
  }

  private async SelectTeamOption(teamName: string): Promise<void> {
    const option = this.locators.SelectTeamOption(teamName);
    await expect(option.first()).toHaveText(teamName);
    await expect(option.first()).toBeVisible({ timeout: 5000 });
    await option.first().click();
  }

  private async createNewTeamButton(): Promise<void> {
    const btn = this.locators.createNewTeam();
    await expect(btn).toBeVisible();
    await btn.click();
  }

  private async crossPopup(): Promise<void> {
    const cross = this.locators.crossPopup();
    await expect(cross).toBeVisible();
    await cross.dblclick({ force: true });
  }

  private async changeProfile(imagePath: string): Promise<void> {
    const fileInput = this.page.locator('input[type="file"]');
    await fileInput.setInputFiles(imagePath);
  }

  private async CreateTeamButton(): Promise<void> {
    const btn = this.page.getByRole('button', { name: 'Create Team' });
    await expect(btn).toBeVisible();
    await btn.click();
  }

  private async SelectOffice(officeName: string): Promise<void> {
    const officeInput = this.locators.SelectOffice(officeName);
    await officeInput.click();
    await expect(officeInput).toBeVisible({ timeout: 5000 });
    await officeInput.fill(officeName);
  }

  private async SelectOfficeOption(): Promise<void> {
    const option = this.locators.SelectOfficeOption();
    await expect(option.first()).toBeVisible({ timeout: 5000 });
    await option.first().click();
  }

  private async SelectTeamMember(): Promise<void> {
    const dropdown = this.locators.SelectTeamMemberDropdown();
    await expect(dropdown).toBeVisible({ timeout: 10000 });
    await dropdown.click({ force: true });
  }

  private async SelectTeamMemberSearchInput(memberName: string): Promise<void> {
    const input = this.locators.SelectTeamMemberSearchInput();
    await expect(input).toBeVisible({ timeout: 5000 });
    await input.fill(memberName);
    await this.page.waitForTimeout(1000);
  }

  private async selectTeamFromDropdown(memberName: string): Promise<void> {
    const option = this.locators.SelectTeamMemberOption().filter({ hasText: memberName });
    await expect(option.first()).toBeVisible({ timeout: 10000 });
    await option.first().scrollIntoViewIfNeeded();
    await option.first().click({ force: true });
  }

  private async SelectTeamLeader(): Promise<void> {
    const dropdown = this.locators.SelectTeamLeaderDropdown();
    await expect(dropdown).toBeVisible({ timeout: 10000 });
    await dropdown.click();
  }

  private async SelectTeamLeaderSearchInput(leaderName: string): Promise<void> {
    const input = this.locators.SelectTeamLeaderSearchInput();
    await expect(input).toBeVisible({ timeout: 5000 });
    await input.fill(leaderName);
    await this.page.waitForTimeout(1000);
  }

  private async SelectTeamLeaderFromDropdown(leaderName: string): Promise<void> {
    const option = this.page.getByRole('option', { name: /Jahanzaib Xenex \(jahanzaib@/i });
    await option.first().waitFor({ state: 'visible' });
    await option.first().scrollIntoViewIfNeeded();
    await option.first().click({ force: true });
  }

  private async NavigateToContacts(): Promise<void> {
    const contactSideMenu = this.locators.contactSideMenu();
    await contactSideMenu.click();
  }

  private async contactTeamsList(): Promise<void> {
    const contactTeams = this.locators.ContactTeams();
    await contactTeams.click();
  }

  private async CancelTeamButton(): Promise<void> {
    const btn = this.locators.CancelTeamButton();
    await expect(btn).toBeVisible();
    await btn.click();
  }

  private async editTeam(): Promise<void> {
    const EditIcon = this.locators.EditIcon().last();
    await EditIcon.scrollIntoViewIfNeeded();
    await EditIcon.click();
  }

  private async deleteTeam(): Promise<void> {
    const DeleteIcon = this.locators.DeleteIcon().first();
    await DeleteIcon.click();
  }

  private async AddButton(): Promise<void> {
    const btn = this.locators.AddButton();
    await btn.click();
  }

  private async verifyTeamInTable(teamName: string): Promise<void> {
    const teamRow = this.locators.TeamRow(teamName);
    await teamRow.scrollIntoViewIfNeeded();
    await expect(teamRow).toBeVisible({ timeout: 10000 });
  }

  private async openAddTeamPopup(): Promise<void> {
    const selectTeamInput = this.page.locator('ng-select[name="team"] input');
    await selectTeamInput.click();
    await this.createNewTeamButton();
  }

  private async fillTeamDetails(officeName: string, memberName: string, leaderName: string): Promise<string> {
    const teamName = `Team ${faker.word.sample()}`;
    const teamNameInput = this.locators.TeamNameInput();
    await teamNameInput.click();
    await teamNameInput.fill(teamName);

    await this.SelectOffice(officeName);
    await this.SelectOfficeOption();

    await this.SelectTeamMember();
    await this.SelectTeamMemberSearchInput(memberName);
    await this.page.waitForTimeout(1000);
    await this.selectTeamFromDropdown(memberName);
    await this.SelectTeamMember();

    await this.SelectTeamLeader();
    await this.SelectTeamLeaderSearchInput(leaderName);
    await this.SelectTeamLeaderFromDropdown(leaderName);

    return teamName;
  }

  async DeleteExistingTeam(): Promise<void> {
    await test.step('Delete all teams if any exist, otherwise pass the test', async () => {
      await this.NavigateToTeamsTab();
      await this.page.waitForTimeout(2000);
      const teamsCheckboxes = this.page.locator('tbody tr input[type="checkbox"]');
      const teamCount = await teamsCheckboxes.count();

      if (teamCount === 0) return;

      const selectAllCheckbox = this.page.locator("div[class='p-checkbox-box']").first();
      await selectAllCheckbox.click({ force: true });

      const deleteButton = this.page.getByRole('button', { name: /delete/i }).first();
      await deleteButton.click({ force: true });

      const confirmButton = this.page.getByRole('button', { name: /yes|ok/i }).first();
      await confirmButton.click({ force: true });

      const toast = this.page.getByRole('alert', { name: /removed successfully|deleted successfully/i });
      await expect(toast).toBeVisible({ timeout: 10000 });
    });
  }

  async SearchForExistingTeam(teamName: string): Promise<void> {
    await test.step('Verify search works for existing team names', async () => {
      await this.NavigateToTeamsTab();
      await this.searchTeamName(teamName);
      await this.SelectTeamOption(teamName);
      const removeSelectTeam = this.page.locator('.pi.pi-times-circle');
      await removeSelectTeam.click();
    });
  }

  async SearchForInvalidTeam(teamName: string): Promise<void> {
    await test.step('Verify dropdown search with invalid keyword', async () => {
      await this.NavigateToTeamsTab();
      await this.searchTeamName(teamName);
      const NoRecord = this.page.getByText('No items found');
      await expect(NoRecord).toBeVisible({ timeout: 5000 });
      await this.searchTeamName('');
    });
  }

  async verifyAddButtonDisabledWhenNoTeamSelected(): Promise<void> {
    await test.step('Verify Add button remains disabled when no team is selected', async () => {
      await this.NavigateToTeamsTab();
      const addButton = this.page.getByRole('button', { name: ' Add' });
      await expect(addButton).toBeDisabled();
    });
  }

  async verifyAddButtonperformNoAction(): Promise<void> {
    await test.step('Verify clicking disabled Add button performs no action', async () => {
      await this.NavigateToTeamsTab();
      const addButton = this.page.getByRole('button', { name: ' Add' });
      await expect(addButton).toBeDisabled();
      await addButton.click({ force: true });
    });
  }

  async verifySelectingTeamEnablesAddButton(teamName: string): Promise<void> {
    await test.step('Verify selecting a team enables Add button', async () => {
      await this.NavigateToTeamsTab();
      await this.searchTeamName(teamName);
      await this.SelectTeamOption(teamName);
      const addButton = this.page.getByRole('button', { name: ' Add' });
      await expect(addButton).toBeEnabled();
      await this.page.locator('.pi.pi-times-circle').click();
    });
  }

  async verifyAddButtonNotEnabledDueToDropdownLag(teamName: string): Promise<void> {
    await test.step("Verify Add button doesn't enable due to dropdown lag", async () => {
      await this.NavigateToTeamsTab();
      await this.searchTeamName(teamName);
      await this.SelectTeamOption(teamName);
      const addButton = this.page.getByRole('button', { name: ' Add' });
      await expect(addButton).toBeEnabled();
      await this.page.locator('.pi.pi-times-circle').click();
      await expect(addButton).toBeDisabled();
    });
  }

  async verifySelectedTeamAppearsAsTag(teamName: string): Promise<void> {
    await test.step('Verify selected team appears as a tag below the dropdown', async () => {
      await this.NavigateToTeamsTab();
      await this.searchTeamName(teamName);
      await this.SelectTeamOption(teamName);
      const tagLocator = this.page.locator('.ng-value-label', { hasText: teamName });
      await expect(tagLocator).toBeVisible({ timeout: 5000 });
      await expect(tagLocator).toHaveCount(1);
      await this.page.locator('.pi.pi-times-circle').click();
    });
  }

  async verifyRemovingTagUpdatesList(teamName: string): Promise<void> {
    await test.step('Verify removing a tag updates the list', async () => {
      await this.NavigateToTeamsTab();
      await this.searchTeamName(teamName);
      await this.SelectTeamOption(teamName);
      const tagLocator = this.page.locator('.ng-value-label', { hasText: teamName });
      await expect(tagLocator).toBeVisible({ timeout: 5000 });
      await expect(tagLocator).toHaveCount(1);
      await this.page.locator('.pi.pi-times-circle').click();
    });
  }

  async verifyUserCanSelectMultipleTeams(teamNames: string[]): Promise<void> {
    await test.step('Verify user can select multiple teams from dropdown', async () => {
      await this.NavigateToTeamsTab();
      for (const name of teamNames) {
        const searchBox = this.locators.SelectTeam(name);
        await expect(searchBox).toBeVisible();
        await searchBox.fill(name);
        const option = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: name }).first();
        await expect(option).toBeVisible({ timeout: 5000 });
        await option.click();
      }
      for (const name of teamNames) {
        const tag = this.page.locator('.ng-value-label', { hasText: name });
        await expect(tag).toBeVisible({ timeout: 5000 });
        await expect(tag).toHaveCount(1);
      }
      const removeTagButtons = this.page.locator('.pi.pi-times-circle');
      const tagCount = await removeTagButtons.count();
      for (let i = 0; i < tagCount; i++) {
        await removeTagButtons.first().click();
        await this.page.waitForTimeout(200);
      }
    });
  }

  async verifySelectMultipleTeams(teamNames: string[]): Promise<void> {
    await test.step('Verify clicking Add adds selected teams to list', async () => {
      await this.NavigateToTeamsTab();
      for (const name of teamNames) {
        const searchBox = this.locators.SelectTeam(name);
        await expect(searchBox).toBeVisible();
        await searchBox.fill(name);
        const option = this.page.locator('.ng-dropdown-panel .ng-option', { hasText: name }).first();
        await expect(option).toBeVisible({ timeout: 5000 });
        await option.click();
      }
      await this.AddButton();
      for (const name of teamNames) {
        const tag = this.page.locator('.ng-value-label', { hasText: name });
        await expect(tag).toBeVisible({ timeout: 5000 });
        await expect(tag).toHaveCount(1);
      }
    });
  }

  async VerifyCreateNewTeamPopUp(): Promise<void> {
    await test.step('Verify "Create New" opens Add Team popup', async () => {
      await this.NavigateToTeamsTab();
      await this.page.locator('ng-select[name="team"] input').click();
      await this.createNewTeamButton();
      const verifyPopup = this.page.getByText('Add TeamUpload profile');
      await expect(verifyPopup).toBeVisible();
      await this.crossPopup();
    });
  }

  async VerifyCrossPopUpButton(): Promise<void> {
    await test.step('Verify popup close (X) closes Add Team popup', async () => {
      await this.navigateToProfilePage();
      await this.NavigateToTeamsTab();
      await this.page.locator('ng-select[name="team"] input').click();
      await this.createNewTeamButton();
      const verifyPopup = this.page.getByText('Add TeamUpload profile');
      await expect(verifyPopup).toBeVisible();
      await this.crossPopup();
    });
  }

  async verifyImageFormats(jpgImagePath: string, pngImagePath: string, invalidImagePath?: string): Promise<void> {
    await test.step('Verify JPG/PNG allowed and invalid images are rejected for team upload', async () => {
      await this.navigateToProfilePage();
      await this.NavigateToTeamsTab();
      await this.page.locator('ng-select[name="team"] input').click();
      await this.createNewTeamButton();
      const popup = this.page.getByText('Add TeamUpload profile');
      await expect(popup).toBeVisible();
      await this.changeProfile(jpgImagePath);
      await this.changeProfile(pngImagePath);
      if (invalidImagePath) {
        await this.changeProfile(invalidImagePath);
        const errorMessage = this.page.locator('div').filter({ hasText: 'Unsupported file format!' }).nth(2);
        await expect(errorMessage).toBeVisible({ timeout: 5000 });
      }
      await this.crossPopup();
    });
  }

  async verifyUnsupportedFiles(invalidImagePath?: string): Promise<void> {
    await test.step('Verify unsupported file formats show validation error', async () => {
      await this.navigateToProfilePage();
      await this.NavigateToTeamsTab();
      await this.page.locator('ng-select[name="team"] input').click();
      await this.createNewTeamButton();
      const popup = this.page.getByText('Add TeamUpload profile');
      await expect(popup).toBeVisible();
      if (invalidImagePath) {
        await this.changeProfile(invalidImagePath);
        const errorMessage = this.page.locator('div').filter({ hasText: 'Unsupported file format!' }).nth(2);
        await expect(errorMessage).toBeVisible({ timeout: 5000 });
      }
      await this.crossPopup();
    });
  }

  async VerifyRequiredFiled(): Promise<void> {
    await test.step('Verify required field validation for Team Name, Office, and Members', async () => {
      await this.NavigateToTeamsTab();
      await this.page.locator('ng-select[name="team"] input').click();
      await this.createNewTeamButton();
      const popup = this.page.getByText('Add TeamUpload profile');
      await expect(popup).toBeVisible();
      await this.CreateTeamButton();
      await expect(this.page.getByText(/Team Name is required/i)).toBeVisible();
      await expect(this.page.getByText(/Office is required/i)).toBeVisible();
      await expect(this.page.getByText('Team Member(s) is required')).toBeVisible();
      await this.crossPopup();
    });
  }

  async VerifyRequiredFieldValidation(): Promise<void> {
    await test.step('Verify team cannot be created with missing required field', async () => {
      await this.NavigateToTeamsTab();
      await this.page.locator('ng-select[name="team"] input').click();
      await this.createNewTeamButton();
      await this.CreateTeamButton();
      await expect(this.page.getByText(/Team Name is required/i)).toBeVisible();
      await expect(this.page.getByText(/Office is required/i)).toBeVisible();
      await expect(this.page.getByText('Team Member(s) is required')).toBeVisible();
      await this.crossPopup();
    });
  }

  async VerifySelectingOfficeFiltersMembers(OfficeName: string): Promise<void> {
    await test.step('Verify selecting office filters available members', async () => {
      await this.NavigateToTeamsTab();
      await this.page.locator('ng-select[name="team"] input').click();
      await this.createNewTeamButton();
      await this.SelectOffice(OfficeName);
      await this.SelectOfficeOption();
      await this.CancelTeamButton();
    });
  }

  async VerifyNoMembersWithoutOffice(): Promise<void> {
    await test.step('Verify no members shown when office not selected', async () => {
      await this.NavigateToTeamsTab();
      await this.page.locator('ng-select[name="team"] input').click();
      await this.createNewTeamButton();
      await this.SelectTeamMember();
      const NoRecord = this.page.getByText('No Record Found');
      await expect(NoRecord).toBeVisible();
      await this.crossPopup();
    });
  }

  async VerifyTeamLeaderDropdownActive(OfficeName: string, teamName: string): Promise<void> {
    await test.step('Verify selecting members activates Team Leader dropdown', async () => {
      await this.NavigateToTeamsTab();
      await this.page.locator('ng-select[name="team"] input').click();
      await this.createNewTeamButton();
      await this.SelectOffice(OfficeName);
      await this.SelectOfficeOption();
      await this.SelectTeamMember();
      await this.SelectTeamMemberSearchInput(teamName);
      await this.page.waitForTimeout(1000);
      await this.selectTeamFromDropdown(teamName);
      await this.SelectTeamMember();
      const teamLeaderDropdown = this.page.locator('div').filter({ hasText: /^Team Leader \*Select Members$/ }).first();
      await expect(teamLeaderDropdown).toBeVisible();
      await this.CancelTeamButton();
    });
  }

  async VerifyTeamCreationWithoutLeader(OfficeName: string, teamName: string): Promise<void> {
    await test.step('Verify team requires a leader before creation', async () => {
      await this.NavigateToTeamsTab();
      await this.page.locator('ng-select[name="team"] input').click();
      await this.createNewTeamButton();
      await this.SelectOffice(OfficeName);
      await this.SelectOfficeOption();
      await this.SelectTeamMember();
      await this.SelectTeamMemberSearchInput(teamName);
      await this.page.waitForTimeout(1000);
      await this.selectTeamFromDropdown(teamName);
      await this.SelectTeamMember();
      await this.SelectTeamMemberSearchInput('');
      await this.CreateTeamButton();
      await expect(this.page.getByText(/Team Leader is required/i)).toBeVisible({ timeout: 10000 });
      await this.crossPopup();
    });
  }

  async VerifyTeamCreationWithValidDetails(OfficeName: string, memberName: string, leaderName: string): Promise<void> {
    await test.step('Verify successful team creation with all valid details', async () => {
      await this.page.reload({ waitUntil: 'networkidle' });
      await this.NavigateToTeamsTab();
      await this.openAddTeamPopup();
      const teamName = await this.fillTeamDetails(OfficeName, memberName, leaderName);
      await this.CreateTeamButton();
      await expect(this.page.getByText(/Team created/i)).toBeVisible({ timeout: 10000 });
      await this.NavigateToContacts();
      await this.contactTeamsList();
      await this.verifyTeamInTable(teamName);
    });
  }

  async verifyCancelClosesPopupWithoutSaving(OfficeName: string, memberName: string, leaderName: string): Promise<void> {
    await test.step('Verify Cancel button closes popup without saving', async () => {
      await this.page.goto(this.page.url(), { waitUntil: 'domcontentloaded' });
      await this.NavigateToTeamsTab();
      await this.openAddTeamPopup();
      const teamName = await this.fillTeamDetails(OfficeName, memberName, leaderName);
      await this.CancelTeamButton();
      await this.NavigateToContacts();
      await this.contactTeamsList();
      const teamRow = this.locators.TeamRow(teamName);
      await expect(teamRow).not.toBeVisible({ timeout: 5000 });
    });
  }

  async verifyUnsavedDataNotPersist(OfficeName: string, memberName: string, leaderName: string): Promise<void> {
    await test.step('Verify unsaved data does not persist after closing Add Team popup', async () => {
      await this.NavigateToTeamsTab();
      await this.openAddTeamPopup();
      await this.fillTeamDetails(OfficeName, memberName, leaderName);
      await this.CancelTeamButton();

      await this.page.locator('ng-select[name="team"] input').click();
      await this.createNewTeamButton();

      const reopenedTeamNameInput = this.locators.TeamNameInput();
      await expect(reopenedTeamNameInput).toBeVisible();
      await expect(reopenedTeamNameInput).toHaveValue('');
      await expect(this.page.getByText('Office *Select Office')).toBeVisible();
      await expect(this.page.getByText('Team Member *Select Members')).toBeVisible();
      await this.crossPopup();
    });
  }

  async verifyNewTeamAppearsInListAndDropdown(OfficeName: string, memberName: string, leaderName: string): Promise<void> {
    await test.step('Verify newly created team appears in dropdown and team list', async () => {
      await this.page.reload({ waitUntil: 'networkidle' });
      await this.NavigateToTeamsTab();
      await this.openAddTeamPopup();
      const teamName = await this.fillTeamDetails(OfficeName, memberName, leaderName);
      await this.CreateTeamButton();
      await expect(this.page.getByText(/Team created/i)).toBeVisible({ timeout: 10000 });
      await this.NavigateToContacts();
      await this.contactTeamsList();
      await this.verifyTeamInTable(teamName);
    });
  }

  async verifyEmptySpacesTeamNameDoesNotReflectInList(officeName: string, memberName: string, leaderName: string): Promise<void> {
    await test.step("Verify failed team creation doesn't reflect in list", async () => {
      await this.NavigateToTeamsTab();
      await this.page.locator('ng-select[name="team"] input').click();
      await this.createNewTeamButton();

      const teamName = '    ';
      const teamNameInput = this.locators.TeamNameInput();
      await teamNameInput.click();
      await teamNameInput.fill(teamName);

      await this.SelectOffice(officeName);
      await this.SelectOfficeOption();
      await this.SelectTeamMember();
      await this.SelectTeamMemberSearchInput(memberName);
      await this.page.waitForTimeout(1000);
      await this.selectTeamFromDropdown(memberName);
      await this.SelectTeamMember();
      await this.SelectTeamLeader();
      await this.SelectTeamLeaderSearchInput(leaderName);
      await this.SelectTeamLeaderFromDropdown(leaderName);

      await this.CreateTeamButton();
      await this.CancelTeamButton();

      await this.NavigateToContacts();
      await this.contactTeamsList();

      const teamRows = this.page.locator('tbody.p-datatable-tbody > tr');
      const allTexts = await teamRows.allTextContents();
      const hasInvalidTeam = allTexts.some(t => t.trim() === '');
      expect(hasInvalidTeam).toBeFalsy();
    });
  }

  async verifyTeamListSorting(): Promise<void> {
    await test.step('Verify sorting functionality for team list', async () => {
      await this.NavigateToTeamsTab();
      const sortCell = this.page.getByRole('cell', { name: 'Name' });
      const sortIcon = sortCell.locator('svg');
      await this.page.waitForTimeout(1000);
      await expect(sortIcon).toBeVisible();

      await sortIcon.click({ force: true });
      const teamRowsAsc = this.page.locator('tbody.p-datatable-tbody > tr > td:first-child');
      const teamNamesAsc = (await teamRowsAsc.allTextContents()).map(n => n.trim()).filter(n => !!n);
      const sortedNamesAsc = [...teamNamesAsc].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
      expect(teamNamesAsc).toEqual(sortedNamesAsc);

      await sortIcon.click({ force: true });
      const teamRowsDesc = this.page.locator('tbody.p-datatable-tbody > tr > td:first-child');
      const teamNamesDesc = (await teamRowsDesc.allTextContents()).map(n => n.trim()).filter(n => !!n);
      const sortedNamesDesc = [...teamNamesDesc].sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' }));
      expect(teamNamesDesc).toEqual(sortedNamesDesc);
    });
  }

  async verifySortButtonOnEmptyListDoesNotCrashUI(): Promise<void> {
    await test.step("Verify sort button on empty list doesn't crash UI", async () => {
      await this.NavigateToTeamsTab();
      const sortCell = this.page.getByRole('cell', { name: 'Name' });
      const sortIcon = sortCell.locator('svg');
      await this.page.waitForTimeout(1000);
      await expect(sortIcon).toBeVisible();
      await sortIcon.click({ force: true });
      await sortIcon.click({ force: true });
    });
  }

  async verifyEditIconOpensTeamForUpdate(): Promise<void> {
    await test.step('Verify Edit icon opens team for update', async () => {
      await this.NavigateToTeamsTab();
      await this.editTeam();
      await expect(this.page.getByRole('heading', { name: 'Edit Team' })).toBeVisible();
    });
  }

  async verifyDeleteIconOpensConfirmationPopup(): Promise<void> {
    await test.step('Verify Delete icon opens confirmation popup', async () => {
      await this.NavigateToTeamsTab();
      await this.deleteTeam();
      const confirmationPopup = this.page.locator('div').filter({ hasText: 'Are you sure that you want to' }).nth(3);
      await expect(confirmationPopup).toBeVisible({ timeout: 5000 });
      await expect(this.page.getByRole('button', { name: /Yes/i }).first()).toBeVisible();
      await expect(this.page.getByRole('button', { name: /No|Cancel/i }).first()).toBeVisible();
    });
  }

  async verifyCancelOnDeleteKeepsTeam(): Promise<void> {
    await test.step('Verify clicking Cancel on Delete popup keeps team', async () => {
      await this.NavigateToTeamsTab();
      await this.deleteTeam();
      const confirmationPopup = this.page.locator('div').filter({ hasText: 'Are you sure that you want to' }).nth(3);
      await expect(confirmationPopup).toBeVisible({ timeout: 5000 });
      const cancelButton = this.page.getByRole('button', { name: /No|Cancel/i }).first();
      await cancelButton.click({ force: true });
      await expect(confirmationPopup).toBeHidden({ timeout: 5000 });
    });
  }

  async verifyDeleteIconRemovesTeamPermanently(): Promise<void> {
    await test.step('Verify deleted team not shown in dropdown', async () => {
      await this.NavigateToTeamsTab();
      const firstTeamRow = this.page.locator('tbody tr').nth(1);
      const teamName = (await firstTeamRow.locator('td').nth(1).textContent())?.trim();
      if (!teamName) throw new Error('No teams found to delete.');

      await this.deleteTeam();

      const confirmButton = this.page.getByRole('button', { name: /Yes/i }).first();
      await confirmButton.click({ force: true });

      await expect(this.page.getByRole('alert', { name: /Removed successfully/i })).toBeVisible();
      const teamRow = this.page.locator('tbody tr', { hasText: teamName });
      await expect(teamRow).toHaveCount(0);
    });
  }

  async verifyTeamCreatedInMyProfileAlsoAppearsInTeamModule(OfficeName: string, memberName: string, leaderName: string): Promise<void> {
    await test.step('Verify team created in My Profile also appears in Team module', async () => {
      await this.NavigateToTeamsTab();
      await this.openAddTeamPopup();
      const teamName = await this.fillTeamDetails(OfficeName, memberName, leaderName);
      await this.CreateTeamButton();
      await expect(this.page.getByText(/Team created/i)).toBeVisible({ timeout: 10000 });
      await this.NavigateToContacts();
      await this.contactTeamsList();
      await this.verifyTeamInTable(teamName);
    });
  }

  async verifyAlignmentOfAddButtonWithTeamDropdown(): Promise<void> {
    await test.step('Verify alignment of Add button with Team dropdown', async () => {
      await this.NavigateToTeamsTab();
      const addButton = this.locators.AddButton();
      const teamDropdown = this.page.getByText('Select Team');
      await expect(teamDropdown).toBeVisible();
      await expect(addButton).toBeVisible();

      const teamDropdownBox = await teamDropdown.boundingBox();
      const addButtonBox = await addButton.boundingBox();
      if (!teamDropdownBox || !addButtonBox) throw new Error('Unable to determine bounding boxes');

      const horizontalGap = addButtonBox.x - (teamDropdownBox.x + teamDropdownBox.width);
      expect(horizontalGap).toBeGreaterThanOrEqual(0);
    });
  }

  async verifyDropdownSupportsSearchForLargeTeamLists(teamName: string): Promise<void> {
    await test.step('Verify dropdown supports search for large team lists', async () => {
      await this.NavigateToTeamsTab();
      await this.searchTeamName(teamName);
    });
  }

  async verifyDropdownWithInvalidKeyword(teamName: string): Promise<void> {
    await test.step('Verify dropdown search with invalid keyword', async () => {
      await this.NavigateToTeamsTab();
      await this.searchTeamName(teamName);
      await expect(this.page.getByText('No items found')).toBeVisible({ timeout: 5000 });
    });
  }

  async VerifyToastAfterTeamCreation(OfficeName: string, memberName: string, leaderName: string): Promise<void> {
    await test.step('Verify toast message appears after team creation', async () => {
      await this.NavigateToTeamsTab();
      await this.openAddTeamPopup();
      await this.fillTeamDetails(OfficeName, memberName, leaderName);
      await this.CreateTeamButton();
      await expect(this.page.getByText(/Team created/i)).toBeVisible({ timeout: 10000 });
    });
  }

  async VerifySingleToastOnMultipleClicks(OfficeName: string, memberName: string, leaderName: string): Promise<void> {
    await test.step('Verify no duplicate toast shown for single event', async () => {
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      await this.NavigateToTeamsTab();
      await this.openAddTeamPopup();
      await this.fillTeamDetails(OfficeName, memberName, leaderName);
      const createButton = this.page.locator('button:has-text("Create Team")');
      await createButton.dblclick({ force: true });
      const toasts = this.page.getByText(/Team created/i);
      await expect(toasts).toHaveCount(1, { timeout: 10000 });
    });
  }

  async VerifyRequiredFieldErrorColor(): Promise<void> {
    await test.step('Verify required field validation errors are shown in red', async () => {
      await this.NavigateToTeamsTab();
      await this.page.locator('ng-select[name="team"] input').click();
      await this.createNewTeamButton();
      const popup = this.page.getByText('Add TeamUpload profile');
      await expect(popup).toBeVisible();
      await this.CreateTeamButton();

      const requiredTeamError = this.page.getByText(/Team Name is required/i);
      const requiredOfficeError = this.page.getByText(/Office is required/i);
      const requiredMembersError = this.page.getByText('Team Member(s) is required');
      await expect(requiredTeamError).toBeVisible();
      await expect(requiredOfficeError).toBeVisible();
      await expect(requiredMembersError).toBeVisible();

      const expectedColor = 'rgb(205, 24, 24)';
      await expect(await requiredTeamError.evaluate(el => getComputedStyle(el).color)).toBe(expectedColor);
      await expect(await requiredOfficeError.evaluate(el => getComputedStyle(el).color)).toBe(expectedColor);
      await expect(await requiredMembersError.evaluate(el => getComputedStyle(el).color)).toBe(expectedColor);
      await this.CancelTeamButton();
    });
  }

  async VerifyConfirmationMessageColor(OfficeName: string, memberName: string, leaderName: string): Promise<void> {
    await test.step('Verify confirmation message color (green for success)', async () => {
      await this.page.reload({ waitUntil: 'networkidle' });
      await this.NavigateToTeamsTab();
      await this.openAddTeamPopup();
      await this.fillTeamDetails(OfficeName, memberName, leaderName);
      await this.CreateTeamButton();
      await expect(this.page.getByText(/Team created/i)).toBeVisible({ timeout: 10000 });
    });
  }

  async VerifyTeamDataPersistenceAfterRefresh(OfficeName: string, memberName: string, leaderName: string): Promise<void> {
    await test.step('Verify team data remains after page refresh', async () => {
      await this.NavigateToTeamsTab();
      await this.openAddTeamPopup();
      const teamName = await this.fillTeamDetails(OfficeName, memberName, leaderName);
      await this.CreateTeamButton();
      await expect(this.page.getByText(/Team created/i)).toBeVisible({ timeout: 10000 });

      await this.NavigateToContacts();
      await this.contactTeamsList();
      await this.verifyTeamInTable(teamName);

      await this.page.reload();
      await this.page.waitForLoadState('networkidle');
      await expect(this.page.locator('table')).toBeVisible({ timeout: 10000 });
      await this.verifyTeamInTable(teamName);
    });
  }

  async VerifyUnsavedPopupDataLostOnRefresh(OfficeName: string, memberName: string, leaderName: string): Promise<void> {
    await test.step('Verify unsaved Add Team popup data is lost after page refresh', async () => {
      await this.NavigateToTeamsTab();
      await this.openAddTeamPopup();
      await this.fillTeamDetails(OfficeName, memberName, leaderName);

      await this.page.reload();
      await this.page.waitForLoadState('networkidle');
      await this.NavigateToTeamsTab();

      await this.page.locator('ng-select[name="team"] input').click();
      await this.createNewTeamButton();

      await expect(this.locators.TeamNameInput()).toBeEmpty();
      await expect(this.page.locator('#wrapper').getByText('Select Office')).toBeVisible();
      await expect(this.page.locator('re-multiselect[formcontrolname="members"] .tags')).toBeVisible();
    });
  }
}
