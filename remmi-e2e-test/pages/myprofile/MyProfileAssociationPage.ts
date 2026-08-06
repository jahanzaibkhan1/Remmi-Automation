import { Page, expect, test } from '@playwright/test';
import { MyProfileBasePage } from './MyProfileBasePage';

export class MyProfileAssociationPage extends MyProfileBasePage {
  constructor(page: Page) {
    super(page);
  }

  private async AssociationsTab(): Promise<void> {
    await this.locators.associationTab.click();
  }

  private async clickAddProjectButton(): Promise<void> {
    await this.locators.addProjectBtn.click({ force: true });
  }

  private async fillSearchProjectInput(projectName: string): Promise<void> {
    await this.locators.searchProjectInput.fill(projectName);
  }

  private async selectProjectOption(): Promise<void> {
    const option = this.locators.searchProjectOption;
    await option.first().waitFor({ state: 'visible' });
    await option.click();
  }

  private async clickAddButton(): Promise<void> {
    await this.locators.addBtn.click({ force: true });
  }

  private async selectAllProjects(): Promise<void> {
    await this.locators.selectAllCheckbox.click();
  }

  private async deselectAllProjects(): Promise<void> {
    await this.locators.deselectAllCheckbox.click();
  }

  private async removeSelectedProjects(): Promise<void> {
    await this.locators.removeSelected.click();
  }

  private async DeleteProjectIcon(): Promise<void> {
    const deleteProjectIcon = this.locators.deleteProjectIcon();
    await deleteProjectIcon.click({ force: true });
  }

  async verifyAssociationTabOpensSuccessfully(): Promise<void> {
    await test.step('Verify that the Association tab opens successfully', async () => {
      await this.AssociationsTab();
    });
  }

  async verifyAssociationTabSearchFunctionality(searchName: string): Promise<void> {
    await test.step('Verify the search functionality in the Association tab', async () => {
      await this.AssociationsTab();
      await this.clickAddProjectButton();
      await this.fillSearchProjectInput(searchName);
      const option = this.locators.searchProjectOption;
      await option.first().waitFor({ state: 'visible' });
      await this.page.waitForTimeout(1200);
    });
  }

  async verifyAssociationTabSearchNoResults(nonExistentProject: string): Promise<void> {
    await test.step('Verify search with no matching project', async () => {
      await this.AssociationsTab();
      await this.clickAddProjectButton();
      await this.fillSearchProjectInput('');
      await this.fillSearchProjectInput(nonExistentProject);
      const option = this.locators.searchProjectOption;
      await expect(option.first()).not.toBeVisible({ timeout: 30000 });
      await this.page.waitForTimeout(1200);
    });
  }

  async verifyAddProjectDropdownOpensSuccessfully(): Promise<void> {
    await test.step('Verify that the Add Project dropdown opens successfully', async () => {
      await this.AssociationsTab();
      await this.clickAddProjectButton();
      const option = this.page.locator('.drop_box');
      await option.waitFor({ state: 'visible' });
      await this.page.waitForTimeout(1200);
    });
  }

  async verifySearchOptionInAddProjectDropdown(searchTerm: string): Promise<void> {
    await test.step('Verify the search option inside Add Project dropdown', async () => {
      await this.AssociationsTab();
      await this.clickAddProjectButton();
      await this.fillSearchProjectInput(searchTerm);
      const option = this.locators.searchProjectOption;
      await option.first().waitFor({ state: 'visible' });
      await expect(option).toContainText(searchTerm);
      await this.page.waitForTimeout(1200);
    });
  }

  async verifySingleProjectSelectionFromDropdown(projectName: string): Promise<void> {
    await test.step('Verify single project selection from Add Project dropdown', async () => {
      await this.AssociationsTab();
      await this.clickAddProjectButton();
      await this.fillSearchProjectInput(projectName);
      await this.selectProjectOption();
      const insidesearchBox = this.page.locator('.pi.pi-times-circle');
      await expect(insidesearchBox).toBeVisible();
      await insidesearchBox.dblclick({ force: true });
      await this.page.waitForTimeout(1200);
    });
  }

  async verifyMultipleProjectSelectionFromDropdown(projectNames: string[]): Promise<void> {
    await test.step('Verify multiple project selection from Add Project dropdown', async () => {
      await this.AssociationsTab();
      await this.clickAddProjectButton();
      for (const projectName of projectNames) {
        await this.fillSearchProjectInput(projectName);
        await this.selectProjectOption();
        const boxes = await this.page.locator('.pi.pi-times-circle').all();
        for (const box of boxes) {
          await box.dblclick({ force: true });
        }
        await this.fillSearchProjectInput('');
      }
      await this.page.waitForTimeout(1200);
    });
  }

  async verifySelectAllFunctionality(): Promise<void> {
    await test.step('Verify the Select All functionality in Associations', async () => {
      await this.AssociationsTab();
      await this.clickAddProjectButton();
      const tableRows = this.page.locator('table tbody tr').first();
      await tableRows.first().waitFor({ state: 'visible' });
      await this.selectAllProjects();
      const checkboxes = await this.page.$$('.checkbox__input[type="checkbox"]');
      for (const checkbox of checkboxes) {
        const checked = await checkbox.isChecked();
        expect(checked).toBeTruthy();
      }
      await this.clickAddButton();
      const addedAlert = this.page.getByRole('alert', { name: 'Added successfully' });
      await addedAlert.waitFor({ state: 'visible' });
      await addedAlert.waitFor({ state: 'hidden' });

      await this.page.locator('table tbody tr').first().waitFor({ state: 'visible' });
      const checkbox = this.page.locator("div[class='p-checkbox-box']").first();
      await checkbox.waitFor({ state: 'visible' });
      await expect(checkbox).toBeEnabled();
      await checkbox.click({ force: true });
      const trashIcon = this.page.locator('.mr-2.cursor-pointer.ng-star-inserted').first();
      await trashIcon.waitFor({ state: 'visible' });
      await trashIcon.click({ force: true });
      const yesButton = this.page.getByRole('button', { name: 'Yes' }).nth(1);
      await yesButton.click({ force: true });
      const NoRecord = this.page.getByRole('cell', { name: 'No records found' });
      await NoRecord.waitFor({ state: 'visible' });
      await this.page.waitForTimeout(1200);
    });
  }

  async verifyDeselectAllFunctionality(): Promise<void> {
    await test.step('Verify the Deselect All functionality in Associations', async () => {
      await this.AssociationsTab();
      await this.clickAddProjectButton();
      await this.selectAllProjects();
      await this.locators.deselectAllCheckbox.click();
      const checkboxes = await this.page.$$('.checkbox__input[type="checkbox"]');
      for (const checkbox of checkboxes) {
        const checked = await checkbox.isChecked();
        expect(checked).toBe(false);
      }
      await this.page.waitForTimeout(1200);
    });
  }

  async verifyRemoveProjectTagBeforeAdding(projectName: string): Promise<void> {
    await test.step('Verify removing a selected project tag before final Add', async () => {
      await this.AssociationsTab();
      await this.clickAddProjectButton();
      await this.fillSearchProjectInput(projectName);
      await this.selectProjectOption();
      await this.removeSelectedProjects();
      const associationRow = this.page.getByRole('row', { name: projectName });
      if (await associationRow.isVisible()) {
        await expect(associationRow).toBeVisible();
      } else {
        await expect(associationRow).not.toBeVisible();
      }
      await this.page.waitForTimeout(1200);
    });
  }

  async verifyMultipleProjectSelection(projectNames: string[]): Promise<void> {
    await test.step('Verify adding multiple projects at once', async () => {
      await this.AssociationsTab();
      await this.clickAddProjectButton();
      for (const projectName of projectNames) {
        await this.fillSearchProjectInput(projectName);
        await this.selectProjectOption();
        await this.locators.searchProjectInput.fill('');
      }
      await this.clickAddButton();
      await this.page.waitForTimeout(1200);
    });
  }

  async verifyPreviouslyAddedProjectsAreNotDuplicated(): Promise<void> {
    await test.step('Verify that previously added projects are not duplicated', async () => {
      await this.AssociationsTab();
      await this.page.waitForTimeout(1000);

      const tableRows = this.page.locator('//table//tr//td[2]');
      const namesBefore = (await tableRows.allInnerTexts())
        .map(name => name.trim())
        .filter(name => name && name.toLowerCase() !== 'no records found');

      await this.clickAddProjectButton();
      await this.page.waitForTimeout(2000);
      await this.selectAllProjects();
      await this.page.waitForTimeout(500);
      await this.clickAddButton();
      await this.page.waitForTimeout(1000);

      const namesAfter = (await tableRows.allInnerTexts())
        .map(name => name.trim())
        .filter(name => name && name.toLowerCase() !== 'no records found');

      await this.clickAddProjectButton();
      const totalChecked = await this.page.locator('p-multiselectpanel .p-multiselect-items .p-checkbox-box.p-highlight').count();

      const counts: Record<string, number> = {};
      for (const name of namesAfter) {
        counts[name] = (counts[name] || 0) + 1;
      }

      expect(namesAfter.length).toBeGreaterThanOrEqual(totalChecked);
      await this.page.waitForTimeout(1200);
    });
  }

  async verifyInitialProjectSelection(): Promise<void> {
    await test.step('Verify adding when list is initially empty', async () => {
      await this.AssociationsTab();
      const tableRows = this.page.locator('table tbody tr').first();
      await tableRows.first().waitFor({ state: 'visible' });
      const checkbox = this.page.locator("div[class='p-checkbox-box']").first();
      await checkbox.click({ force: true });
      const trashIcon = this.page.locator('.mr-2.cursor-pointer.ng-star-inserted').first();
      await trashIcon.click({ force: true });
      const yes = this.page.getByRole('button', { name: 'Yes' }).nth(1);
      await yes.click({ force: true });
      await this.page.waitForTimeout(1000);

      await this.clickAddProjectButton();
      await this.page.waitForTimeout(1500);
      await this.selectAllProjects();
      await this.page.waitForTimeout(1000);
      await this.clickAddButton();

      const removedAlert = this.page.getByRole('alert', { name: 'Removed successfully' });
      await removedAlert.waitFor({ state: 'visible' });
      await removedAlert.waitFor({ state: 'hidden' });
      await this.page.waitForTimeout(1200);
    });
  }

  async verifyAssocitionSortingList(): Promise<void> {
    await test.step('Verify the sort functionality', async () => {
      await this.AssociationsTab();
      await this.page.locator('table tbody tr').first().waitFor({ state: 'visible' });
      const sortHeader = this.page.getByRole('columnheader', { name: /Name/i }).first();
      const sortIcon = sortHeader.locator('svg').first();
      await expect(sortIcon).toBeVisible({ timeout: 10000 });

      await sortIcon.click({ force: true });
      await this.page.waitForTimeout(4000);
      const rowsAsc = this.page.locator('tbody.p-datatable-tbody > tr > td:first-child');
      const namesAsc = (await rowsAsc.allTextContents()).map(n => n.trim()).filter(n => !!n && n.toLowerCase() !== 'no records found');
      const sortedNamesAsc = [...namesAsc].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
      expect(namesAsc).toEqual(sortedNamesAsc);

      await sortIcon.click({ force: true });
      await this.page.waitForTimeout(2000);
      const rowsDesc = this.page.locator('tbody.p-datatable-tbody > tr > td:first-child');
      const namesDesc = (await rowsDesc.allTextContents()).map(n => n.trim()).filter(n => !!n && n.toLowerCase() !== 'no records found');
      const sortedNamesDesc = [...namesDesc].sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' }));
      expect(namesDesc).toEqual(sortedNamesDesc);
      await this.page.waitForTimeout(1200);
    });
  }

  async verifyDeleteIconInActionColumn(): Promise<void> {
    await test.step('Verify delete icon under Action column', async () => {
      await this.AssociationsTab();
      await this.page.locator('table tbody tr').first().waitFor({ state: 'visible' });
      await this.DeleteProjectIcon();
      const yes = this.page.getByRole('button', { name: 'Yes' }).nth(1);
      await yes.click({ force: true });
      const removedAlert = this.page.getByRole('alert', { name: 'Removed successfully' });
      await removedAlert.waitFor({ state: 'visible' });
      await removedAlert.waitFor({ state: 'hidden' });
      await this.page.waitForTimeout(1200);
    });
  }

  async verifyProjectDeleteFunctionality(): Promise<void> {
    await test.step('Verify project delete functionality', async () => {
      await this.AssociationsTab();
      await this.page.locator('table tbody tr').first().waitFor({ state: 'visible' });

      const projectRows = this.page.locator('//table//tr//td[2]');
      const beforeDeleteNames = (await projectRows.allInnerTexts())
        .map(t => t.trim())
        .filter(t => t && t.toLowerCase() !== 'no records found');

      if (!beforeDeleteNames[0]) {
        return;
      }

      await this.DeleteProjectIcon();
      const yes = this.page.getByRole('button', { name: 'Yes' }).nth(1);
      await yes.click({ force: true });
      const removedAlert = this.page.getByRole('alert', { name: /Removed successfully/i });
      await removedAlert.waitFor({ state: 'visible' });
      await removedAlert.waitFor({ state: 'hidden' });
      await this.page.waitForTimeout(1200);
    });
  }

  async verifyCheckboxBesideEachProject(): Promise<void> {
    await test.step('Verify checkbox beside each project', async () => {
      await this.AssociationsTab();
      await this.page.locator('table tbody tr').first().waitFor({ state: 'visible' });

      const selectAllCheckbox = this.page.locator("div[class='p-checkbox-box']").first();
      await selectAllCheckbox.scrollIntoViewIfNeeded();
      await selectAllCheckbox.click({ force: true });

      const checkboxes = this.page.locator('//table//tr//td[1]//div[contains(@class,"p-checkbox-box")]');
      const checkboxCount = await checkboxes.count();
      if (checkboxCount === 0) throw new Error('No checkboxes found beside any project.');

      for (let i = 0; i < checkboxCount; i++) {
        const classes = await checkboxes.nth(i).getAttribute('class');
        expect(classes).toContain('p-highlight');
      }
      await this.page.waitForTimeout(1200);
    });
  }

  async verifyMultipleCheckboxSelection(): Promise<void> {
    await test.step('Verify multiple checkbox selection', async () => {
      await this.AssociationsTab();
      await this.page.locator('table tbody tr').first().waitFor({ state: 'visible' });

      const checkboxes = this.page.locator('//table//tr//td[1]//div[contains(@class,"p-checkbox-box")]');
      await checkboxes.nth(0).click({ force: true });
      await checkboxes.nth(1).click({ force: true });
      await this.page.waitForTimeout(1200);
    });
  }

  async verifySelectAllCheckbox(): Promise<void> {
    await test.step('Verify select all checkbox', async () => {
      await this.AssociationsTab();
      await this.page.locator('table tbody tr').first().waitFor({ state: 'visible' });
      const checkbox = this.page.locator("div[class='p-checkbox-box']").first();
      await checkbox.click({ force: true });
      await this.page.waitForTimeout(1200);
    });
  }

  async verifyBulkDeleteFunctionality(): Promise<void> {
    await test.step('Verify bulk delete functionality', async () => {
      await this.AssociationsTab();
      await this.page.locator('table tbody tr').first().waitFor({ state: 'visible' });

      const checkboxes = this.page.locator('//table//tr//td[1]//div[contains(@class,"p-checkbox-box")]');
      const checkboxCount = await checkboxes.count();
      if (checkboxCount < 2) throw new Error(`Less than 2 checkboxes found (${checkboxCount}).`);

      await checkboxes.nth(0).click({ force: true });
      await checkboxes.nth(1).click({ force: true });

      const trashIcon = this.page.locator('.mr-2.cursor-pointer.ng-star-inserted').first();
      await trashIcon.click({ force: true });
      const yesButton = this.page.getByRole('button', { name: 'Yes' }).nth(1);
      await yesButton.click({ force: true });

      const removedAlert = this.page.getByRole('alert', { name: /Removed successfully/i }).first();
      await expect(removedAlert).toBeVisible({ timeout: 30000 });
      await removedAlert.evaluate(node => (node as HTMLElement).style.display = 'none');
      await this.page.locator('table tbody tr').first().waitFor({ state: 'visible' });
      await this.page.waitForTimeout(1200);
    });
  }

  async verifyUIUpdateAfterDeletion(): Promise<void> {
    await test.step('Add a project if not present, otherwise delete a project and verify UI update', async () => {
      await this.AssociationsTab();
      await this.page.locator('table tbody tr').first().waitFor({ state: 'visible' });

      let projectNamesBefore = await this.page.locator('//table//tr//td[2]').allInnerTexts();

      if (projectNamesBefore.length === 0) {
        await this.clickAddProjectButton();
        await this.fillSearchProjectInput('lahore centre');
        await this.selectProjectOption();
        await this.clickAddButton();
        await this.page.waitForTimeout(1500);
        projectNamesBefore = await this.page.locator('//table//tr//td[2]').allInnerTexts();
        await this.page.waitForTimeout(1200);
      }

      const checkboxes = this.page.locator('//table//tr//td[1]//div[contains(@class,"p-checkbox-box")]');
      const checkboxCount = await checkboxes.count();
      if (checkboxCount < 1) throw new Error('No checkboxes (projects) found after attempted add.');

      await checkboxes.first().click({ force: true });
      const trashIcon = this.page.locator('.mr-2.cursor-pointer.ng-star-inserted').first();
      await trashIcon.click({ force: true });
      const yesButton = this.page.getByRole('button', { name: 'Yes' }).nth(1);
      await yesButton.click({ force: true });

      const removedAlert = this.page.getByRole('alert', { name: 'Removed successfully' });
      await removedAlert.waitFor({ state: 'visible' });
      await removedAlert.waitFor({ state: 'hidden' });
      await this.page.locator('table tbody tr').first().waitFor({ state: 'visible' });

      const projectNamesAfter = await this.page.locator('//table//tr//td[2]').allInnerTexts();
      expect(projectNamesAfter.length).toBeLessThan(projectNamesBefore.length);
      const deletedProjects = projectNamesBefore.filter(name => !projectNamesAfter.includes(name));
      expect(deletedProjects.length).toBeGreaterThan(0);
      await this.page.waitForTimeout(1200);
    });
  }

  async verifyDeletedProjectsCanBeReadded(projectName: string): Promise<void> {
    await test.step('Verify that deleted projects can be re-added', async () => {
      await this.AssociationsTab();
      await this.clickAddProjectButton();
      await this.fillSearchProjectInput(projectName);
      await this.selectProjectOption();
      await this.clickAddButton();
      await this.page.locator('table tbody tr').first().waitFor({ state: 'visible' });
      await this.page.waitForTimeout(1200);
    });
  }

  async verifyEmptyListMessage(projectName: string): Promise<void> {
    await test.step('Verify empty list message', async () => {
      await this.AssociationsTab();
      await this.clickAddProjectButton();
      await this.page.locator('table tbody tr').first().waitFor({ state: 'visible' });
      await this.fillSearchProjectInput(projectName);
      await this.page.waitForTimeout(400);
      await this.selectProjectOption();
      await this.clickAddButton();
      await this.page.waitForTimeout(1500);

      const checkbox = this.page.locator("div[class='p-checkbox-box']").first();
      await checkbox.click({ force: true });
      const trashIcon = this.page.locator('.mr-2.cursor-pointer.ng-star-inserted').first();
      await trashIcon.click({ force: true });
      const yesButton = this.page.getByRole('button', { name: 'Yes' }).nth(1);
      await yesButton.click({ force: true });

      const removedAlert = this.page.getByRole('alert', { name: 'Removed successfully' });
      await removedAlert.waitFor({ state: 'visible' });
      await removedAlert.waitFor({ state: 'hidden' });
      const NoRecord = this.page.getByRole('cell', { name: 'No records found' });
      await expect(NoRecord).toBeVisible();
      await this.page.waitForTimeout(1200);
    });
  }

  async verifyAddProjectwithoutDropdownOption(): Promise<void> {
    await test.step('Try adding project without selecting any', async () => {
      await this.page.waitForTimeout(2000);
      await this.navigateToProfilePage();
      await this.AssociationsTab();
      await this.clickAddProjectButton();
      await this.fillSearchProjectInput('');
      await this.clickAddButton();
      await this.page.waitForTimeout(1200);
    });
  }
}
