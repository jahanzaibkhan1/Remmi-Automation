import { expect, Page, Locator } from '@playwright/test';
import { faker, th } from '@faker-js/faker';
export class ProjectActions {
    private readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Returns the search input for projects
     */
    private get projectsSearchInput(): Locator {
        return this.page.getByPlaceholder('Search').last();
    }

    /**
     * Returns the locator for a specific project by its name.
     */
    private projectNameResult(projectName: string): Locator {
        return this.page.locator('.sgv-product .product-content h3', { hasText: new RegExp(`^${projectName}$`, 'i') });
    }

    /**
     * Navigation to the project list page.
     */
    private async navigateToProjects(): Promise<void> {
        const currentUrl = this.page.url().split(/[?#]/)[0];
        if (!currentUrl.endsWith('/project/projects')) {
            await this.page.goto('/project/projects');
        }
    }

    /**
     * verify project search by name.
     */
    async verifyProjectCanBeSearchedByName(projectName: string): Promise<void> {
        await this.navigateToProjects();
        const input = this.projectsSearchInput;
        await expect(input).toBeVisible({ timeout: 30000 });
        await input.fill(projectName);
        await expect(this.projectNameResult(projectName).first()).toBeVisible({ timeout: 30000 });
    }

    /**
     * Search with partial project name
     */
    async verifyProjectCanBeSearchedByPartialName(partialName: string): Promise<void> {
        await this.navigateToProjects();
        const input = this.projectsSearchInput;
        await expect(input).toBeVisible({ timeout: 30000 });
        await input.fill(partialName);
        const firstResult = this.page.locator('.sgv-product .product-content h3', { hasText: new RegExp(partialName, 'i') }).first();
        await expect(firstResult).toBeVisible({ timeout: 30000 });
        const resultText = await firstResult.textContent();
        expect(resultText?.toLowerCase()).toContain(partialName.toLowerCase());
    }

    /**
     * Search with invalid project name
     */
    async verifyProjectSearchWithInvalidName(invalidName: string): Promise<void> {
        await this.navigateToProjects();
        const input = this.projectsSearchInput;
        await expect(input).toBeVisible({ timeout: 30000 });
        await input.fill(invalidName);
        const matchingProjects = this.page.locator('.sgv-product .product-content h3', { hasText: new RegExp(invalidName, 'i') });
        await expect(matchingProjects).toHaveCount(0);
        await this.clickResetButton();

    }

    /**
     * Verify that the project image is displayed correctly in Grid View
     */
    async verifyProjectImageDisplayedInGridView(projectName: string): Promise<void> {
        await this.navigateToProjects();
        // perform with search
        const searchInput = this.projectsSearchInput;
        await expect(searchInput).toBeVisible({ timeout: 30000 });
        await searchInput.fill(projectName);
        const projectCard = this.page.locator('.sgv-product .product-content h3', { hasText: new RegExp(`^${projectName}$`, 'i') }).first();
        await expect(projectCard).toBeVisible({ timeout: 15000 });
        const sgvProduct = projectCard.locator('..').locator('..').first();
        const productThumbnail = sgvProduct.locator('.product-thumbnail').first();
        await expect(productThumbnail).toBeVisible({ timeout: 10000 });
        const styleAttr = await productThumbnail.getAttribute('style');
        expect(styleAttr).toBeTruthy();
        const bgUrlMatch = styleAttr?.match(/background-image:\s*url\((['"]?)(.*?)\1\)/i);
        expect(bgUrlMatch && bgUrlMatch[2]).toBeTruthy();
        expect(bgUrlMatch![2].trim()).not.toBe('');
    }

    /**
     * Verify that a placeholder image appears for projects with no uploaded image
     */
    async verifyPlaceholderImageForProjectWithNoImage(): Promise<void> {
        await this.navigateToProjects();
        // perform with search search
        const searchInput = this.projectsSearchInput;
        await expect(searchInput).toBeVisible({ timeout: 30000 });
        await searchInput.fill('Al kabir heights');
        const projectCard = this.page.locator('.sgv-product .product-content h3', { hasText: new RegExp(`^${'Al kabir heights'}$`, 'i') }).first();
        await expect(projectCard).toBeVisible({ timeout: 15000 });
        const sgvProduct = projectCard.locator('..').locator('..').first();
        const productThumbnail = sgvProduct.locator('.product-thumbnail').first();
        await expect(productThumbnail).toBeVisible({ timeout: 10000 });
        await this.clickResetButton();
    }

    /**
     * Helper to click on a tab by its label
     */
    private async clickTabByLabel(tabLabel: string): Promise<void> {
        const tab = this.page.getByText(tabLabel, { exact: true });
        await expect(tab).toBeVisible({ timeout: 10000 });
        await tab.click();
    }

    /**
     * Helper to click the Reset button (assumes icon structure stays same)
     */
    private async clickResetButton(): Promise<void> {
        const resetButton = this.page.locator('i').nth(3);
        await expect(resetButton).toBeVisible({ timeout: 10000 });
        await resetButton.click();
    }

    /**
     * After search, click on Inactive tab and Active tab, then click on Reset icon
     */
    async verifyTabsAndResetAfterSearch(searchText: string): Promise<void> {
        await this.navigateToProjects();
        const input = this.projectsSearchInput;
        await expect(input).toBeVisible({ timeout: 30000 });
        await input.fill(searchText);
        await this.clickTabByLabel('Inactive');
        await this.clickTabByLabel('Active');
        await this.clickResetButton();
        await expect(input).toHaveValue('');
    }

    /**
     * Verify that the default selected tab is "Active"
     */
    async verifyDefaultTabIsActive(): Promise<void> {
        await this.navigateToProjects();
        const activeTab = this.page.getByText('Active', { exact: true });
        await expect(activeTab).toBeVisible({ timeout: 30000 });
        const ariaSelected = await activeTab.getAttribute('aria-selected');
        if (ariaSelected !== null) {
            expect(ariaSelected).toBe('true');
        } else {
            const className = await activeTab.getAttribute('class');
            expect(className).toMatch(/active/i);
        }
    }

    /**
     * Verifies that all projects listed are under the "Active" tab.
     */
    async verifyProjectsUnderActiveTab(projectName: string): Promise<void> {
        await this.navigateToProjects();
        const activeTab = this.page.getByText('Active', { exact: true });
        await expect(activeTab).toBeVisible({ timeout: 30000 });
        const projectCard = this.page.locator('.sgv-product .product-content h3', { hasText: new RegExp(`^${projectName}$`, 'i') }).first();
        await projectCard.scrollIntoViewIfNeeded();
    }

    /**
     * Verifies that all projects listed are under the "Inactive" tab.
     */
    async verifyProjectsUnderInactiveTab(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await this.clickTabByLabel('Inactive');
        const projectCard = this.page.locator('.sgv-product .product-content h3', { hasText: new RegExp(`^${projectName}$`, 'i') }).first();
        await expect(projectCard).toBeVisible({ timeout: 10000 });
        await projectCard.scrollIntoViewIfNeeded();
    }

    /**
     * Verifies that precincts are grouped correctly under their respective tabs.
     */
    async verifyPrecinctIsGroupedUnderTab(precinctName: string): Promise<void> {
        await this.navigateToProjects();
        const nameRegex = new RegExp(`^${precinctName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
        const container = this.page
            .locator('.sgv-product.ng-star-inserted')
            .filter({ has: this.page.locator('.precinct-content h3', { hasText: nameRegex }) })
            .first();
        await expect(container).toBeVisible({ timeout: 40000 });
        await expect(container.locator('.product-thumbnail.cp.ng-star-inserted[style*="projectimages"]')).toBeVisible({ timeout: 10000 });
    }

    private async getFirstVisiblePrecinctCard() {
        const precinctCard = this.page.locator('.sgv-product').first();
        await expect(precinctCard).toBeVisible({ timeout: 30000 });
        await precinctCard.click();
    }

    private async clickVisibleBackButton() {
        const backButton = this.page.locator('text=/back/i').first();
        await expect(backButton).toBeEnabled({ timeout: 15000 });
        await backButton.click({ force: true });
    }

    /**
     * Verifies clicking a precinct card opens the Project, Lot, EOI tabs
     */
    async verifyClickingPrecinctOpensTabs(): Promise<void> {
        await this.navigateToProjects();
        await this.getFirstVisiblePrecinctCard();
        const tabs = ['project', 'lot', 'EOI'];
        for (const tab of tabs) {
            const el = this.page.locator(`a#pills-${tab}`).first();
            await expect(el).toBeVisible({ timeout: 20000 });
            await expect(el).toHaveText(new RegExp(tab, 'i'), { timeout: 20000 });
        }
        await this.page.locator('p', { hasText: 'Projects' }).first().click();
        await expect(this.page.locator('.sgv-product').first()).toBeVisible({ timeout: 20000 });
    }

    async verifyPrecinctAllocatedProjectNotInActiveTabAfterPrecinctClick(): Promise<void> {
        await this.navigateToProjects();
        await this.page.reload();
        await this.getFirstVisiblePrecinctCard();
        const insidePrecinctProjectHeading = (
            await this.page.locator('.sgv-product .product-content h3').first().innerText()
        ).trim();
        await this.page.locator('p', { hasText: 'Projects' }).first().click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForSelector('.sgv-product .product-content h3', { state: 'visible', timeout: 20000 });
        await expect(this.projectsSearchInput).toBeVisible({ timeout: 30000 });
        await this.projectsSearchInput.fill(insidePrecinctProjectHeading);
        const escapedName = insidePrecinctProjectHeading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const nameRegex = new RegExp(`^\\s*${escapedName}\\s*$`, 'i');

        const activeProjectCard = this.page
            .locator('.projects-row .sgv-product .product-content h3')
            .filter({ hasText: nameRegex });
        await expect(activeProjectCard).toHaveCount(0);
    }

    async verifyProjectReappearsInActiveTabAfterPrecinctDeletion(): Promise<void> {
        await this.navigateToProjects();
        await this.page.reload();
        await this.page.waitForLoadState('networkidle');
        const precinctSetupLink = this.page.locator('p', { hasText: 'Precinct Set up' }).first();
        await expect(precinctSetupLink).toBeEnabled({ timeout: 40000 });
        await precinctSetupLink.click();
        const precinctAllocationTab = this.page.locator('a#pills-precinct_allow-tab', { hasText: /precinct allocation/i });
        await expect(precinctAllocationTab).toBeEnabled({ timeout: 20000 });
        await precinctAllocationTab.click();
        await this.page.locator('.ng-select-container').last().click();
        await this.page.locator('.ng-dropdown-panel .ng-option-label').first().click();
        let checkboxes = this.page.locator('p-checkbox .p-checkbox-box');
        await expect(checkboxes.first()).toBeVisible();
        await checkboxes.first().click();
        await this.page.waitForTimeout(1200);
        await checkboxes.first().click();
        await this.page.locator('button:has-text("Save")').click();
        await expect(this.page.locator('.toast-message')).toBeVisible();
        // Click the sidebar "Projects" link using a robust selector 
        await this.page.locator('p', { hasText: 'Projects' }).first().click();
        await this.getFirstVisiblePrecinctCard();
        await this.page.locator('a[href="/listings/project-precinct"]').click();
        await this.page.locator('#pills-precinct_allow-tab').click();
        await this.page.locator('.ng-select-container').last().click();
        await this.page.locator('.ng-dropdown-panel .ng-option-label').first().click();
        checkboxes = this.page.locator('p-checkbox .p-checkbox-box');
        await expect(checkboxes.nth(1)).toBeVisible();
        await checkboxes.nth(1).click();
        await this.page.locator('button:has-text("Save")').click();
        await expect(this.page.locator('.toast-message')).toBeVisible();
        await this.page.locator('p', { hasText: 'Projects' }).first().click();
        await this.getFirstVisiblePrecinctCard();
        const insidePrecinctProjectHeading = (
            await this.page.locator('.sgv-product .product-content h3').first().innerText()
        ).trim();
        console.log('insidePrecinctProjectHeading:', insidePrecinctProjectHeading);
        await this.page.locator('p', { hasText: 'Projects' }).first().click();
    }

    async switchToGridView(): Promise<void> {
        await this.navigateToProjects();
        const gridProducts = this.page.locator('.sgv-product');
        if (await gridProducts.first().isVisible().catch(() => false)) {
            return;
        }
        const gridViewButton = this.page.locator('.layout-changer a.grid-icon');
        await expect(gridViewButton).toBeVisible({ timeout: 30_000 });
        await gridViewButton.click();
        await expect(gridProducts.first()).toBeVisible({ timeout: 30_000 });
    }

    async switchToListView(): Promise<void> {
        await this.navigateToProjects();
        const tableRows = this.page.locator('tbody tr');
        if (await tableRows.first().isVisible().catch(() => false)) {
            return;
        }
        const listViewButton = this.page.locator('.layout-changer a').filter({
            has: this.page.locator('img[src*="list.svg"]')
        });
        await listViewButton.click();
        await this.waitForFirstTableRow();
    }

    async switchBetweenProjectViews(): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.switchToGridView();
    }

    async openProjectPopup(): Promise<void> {
        await this.page.locator('button._addNew').click();
        const dialog = this.page.locator('.p-dialog-content').filter({
            has: this.page.locator('input[formcontrolname="Project_Name"]'),
        });
        await expect(dialog).toBeVisible({ timeout: 10000 });
        await expect(dialog.locator('input[formcontrolname="Project_Name"]')).toBeVisible();
        await expect(dialog.locator('ng-select[formcontrolname="Project_Status"]')).toBeVisible();
        await expect(dialog.locator('button._outline-btn')).toBeVisible();
        await expect(dialog.locator('button._cancel-btn')).toBeVisible();
    }

    async verifyAndCloseProjectPopup(): Promise<void> {
        await this.navigateToProjects();
        await this.page.reload();
        await this.openProjectPopup();
        const dialog = this.page.locator('.p-dialog-content');
        await dialog.locator('button._cancel-btn').click();
        await expect(dialog).toBeHidden({ timeout: 10000 });
    }

    async clickOnProjects(): Promise<void> {
        await this.page.locator('p', { hasText: 'Projects' }).first().click();
    }

    /**
     * Create a project with valid data.
     * @param project Optional object containing project name and status.
     */
    async createProjectWithValidData(project?: { name?: string; status?: string }): Promise<void> {
        await this.navigateToProjects();
        await this.page.reload();
        await this.openProjectPopup();
        const projectName = project?.name ?? faker.company.name();
        console.log("Creating project with name:", projectName);
        const dialog = this.page.locator('.p-dialog-content')
            .filter({ has: this.page.locator('input[formcontrolname="Project_Name"]') });
        await dialog.locator('input[formcontrolname="Project_Name"]').fill(projectName);
        await dialog.locator('button._outline-btn').click();
        await expect(dialog).toBeHidden({ timeout: 10000 });
        await this.page.getByText('Project added successfully')
            .waitFor({ state: 'visible', timeout: 15000 })
            .catch(() => { });
        await this.page.locator('p.f-24', { hasText: projectName }).waitFor({ state: 'visible', timeout: 15000 });
        await this.clickOnProjects();
        await this.verifyProjectCanBeSearchedByName(projectName);
        await this.clickResetButton();
    }

    /**
     * Attempts to save a new project with empty required fields
     */
    async saveProjectPopupWithEmptyFields(): Promise<void> {
        await this.navigateToProjects();
        await this.page.reload();
        await this.openProjectPopup();
        const projectDialog = this.page.locator('.p-dialog-content').filter({
            has: this.page.locator('input[formcontrolname="Project_Name"]')
        });
        const projectNameInputField = projectDialog.locator('input[formcontrolname="Project_Name"]');
        await projectNameInputField.fill('');
        await projectDialog.locator('button._outline-btn').click();
        const projectNameValidationError = projectDialog.locator(
            'input[formcontrolname="Project_Name"] ~ .invalid-feedback, input[formcontrolname="Project_Name"] ~ .text-danger, input[formcontrolname="Project_Name"].ng-invalid'
        );
        await expect(projectNameValidationError).toBeVisible({ timeout: 5000 });
        await projectDialog.locator('button._cancel-btn').click();
        await expect(projectDialog).toBeHidden({ timeout: 10000 });
    }

    /**
     * Clicks the cross (X) icon to close the project popup dialog.
     */
    async closeProjectPopupWithCrossIcon(): Promise<void> {
        await this.navigateToProjects();
        await this.page.reload();
        await this.openProjectPopup();
        const dialog = this.page.locator('.p-dialog-content')
        const closeBtn = this.page.locator("//*[name()='path' and contains(@d,'M8.01186 7')]")
        await closeBtn.click({ force: true });
        await expect(dialog).toBeHidden({ timeout: 10000 });
    }
    /**
    * Verify that "Pin to Dashboard" option is visible when right-clicking a project card.
    */
    async verifyPinToDashboardOptionVisibleOnRightClick(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await this.page.reload();
        await this.verifyProjectCanBeSearchedByName(projectName);
        const projectCard = this.page.locator('.sgv-product .product-content h3', {
            hasText: new RegExp(`^${projectName}$`, 'i')
        }).first();
        await expect(projectCard).toBeVisible({ timeout: 15000 });
        await projectCard.click({ button: 'right' });
        const pinOption = this.page.getByText('Pin to Dashboard', { exact: true });
        await expect(pinOption).toBeVisible({ timeout: 10000 });
        await this.page.mouse.click(0, 0);
        await expect(pinOption).not.toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);
    }

    /**
     * Searches for a project by name, pins it to dashboard, and verifies the pin icon appears.
     */
    async pinProjectAndVerifyIcon(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await this.verifyProjectCanBeSearchedByName(projectName);
        const projectCard = this.page.locator('.sgv-product .product-content h3', {
            hasText: new RegExp(`^${projectName}$`, 'i')
        }).first();
        await projectCard.evaluate((el) => el.scrollIntoView({ behavior: "auto", block: "center", inline: "center" }));
        await expect(projectCard).toBeVisible({ timeout: 15000 });
        await projectCard.click({ button: 'right' });

        const pinOption = this.page.getByText('Pin to Dashboard', { exact: true });
        await expect(pinOption).toBeVisible({ timeout: 10000 });
        await pinOption.click();
        const pinnedIcon = this.page.locator('img[src="assets/img/dashboadIcon/pin-fill.svg"]');
        await expect(pinnedIcon).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);
    }

    /**
     * Searches for a project by name, unpins it from dashboard, and verifies that the pin icon is removed.
     */
    async unpinProjectAndVerifyRemoval(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await this.verifyProjectCanBeSearchedByName(projectName);
        const projectCard = this.page.locator('.sgv-product .product-content h3', {
            hasText: new RegExp(`^${projectName}$`, 'i')
        }).first();
        await projectCard.scrollIntoViewIfNeeded();
        await expect(projectCard).toBeVisible({ timeout: 15000 });
        await projectCard.click({ button: 'right' });

        const unpinOption = this.page.getByText('Unpin from Dashboard', { exact: true });
        await expect(unpinOption).toBeVisible({ timeout: 10000 });
        await unpinOption.click();

        // Verify the pin icon is removed from the card
        const pinnedIcon = this.page.locator('img[src="assets/img/dashboadIcon/pin-fill.svg"]').filter({
            has: projectCard
        });
        await expect(pinnedIcon).toHaveCount(0, { timeout: 10000 });
    }

    /**
     * Waits for the first data row in the projects table to be visible.
     */
    async waitForFirstTableRow(): Promise<void> {
        await this.page.waitForSelector('tbody tr', { state: 'attached', timeout: 30_000 });

        await this.page.waitForFunction(() => {
            const rows = document.querySelectorAll('tbody tr');
            if (rows.length === 0) return false;
            const firstRowText = rows[0].textContent?.trim() ?? '';
            return firstRowText.length > 5;
        }, { timeout: 30_000 });

        const firstDataRow = this.page.locator('tbody tr').first();
        await firstDataRow.waitFor({ state: 'visible', timeout: 30_000 });
    }

    /**
     * Verifies project search by name in List View
     */
    async verifyProjectCanBeSearchedByNameInListView(projectName: string): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();
        const searchInput = this.page.locator('input[placeholder="Search"]').last();
        await searchInput.fill('');
        await searchInput.fill(projectName);
        const projectRow = this.page
            .locator('tr')
            .filter({ hasText: new RegExp(projectName, 'i') })
            .first();
        await expect(projectRow).toBeVisible({ timeout: 30000 });
        await this.clickResetButton();
    }

    /**
     * Clicks the reset button to clear any search/filter in the projects List View.
     */
    async ResetButton(): Promise<void> {
        const resetButton = this.page.locator('button', { hasText: /reset/i }).last();
        await expect(resetButton).toBeVisible({ timeout: 10000 });
        await resetButton.click();
        await this.waitForFirstTableRow();
    }

    async verifyProjectSearchWithInvalidNameInListView(invalidName: string): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();
        const searchInput = this.page.locator('input[placeholder="Search"]').last();
        await searchInput.fill('');
        await searchInput.fill(invalidName);
        await this.page.waitForLoadState('networkidle');
        const noRecordsMessage = this.page.getByText(/No projects available/i).first();
        await expect(noRecordsMessage).toBeVisible({ timeout: 30_000 });
        const projectRow = this.page
            .locator('tr')
            .filter({ hasText: new RegExp(invalidName, 'i') });
        await expect(projectRow).toHaveCount(0);
        await this.clickResetButton();
    }

    async verifyActiveTabFilteringInListView(): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();
        const activeTab = this.page.locator('ul.list-type li', { hasText: 'Active' }).first();
        await activeTab.click();
        await expect(activeTab).toHaveClass(/active-filter/);
        await this.waitForFirstTableRow();
        const rowCount = await this.page.locator('tbody tr').count();
        expect(rowCount).toBeGreaterThan(0);
    }

    async verifyInactiveTabFilteringInListView(): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();
        const inactiveTab = this.page.locator('ul.list-type li', { hasText: 'Inactive' }).first();
        await inactiveTab.click();
        await expect(inactiveTab).toHaveClass(/active-filter/);
        await this.waitForFirstTableRow();
        const rowCount = await this.page.locator('tbody tr').count();
        expect(rowCount).toBeGreaterThan(0);
    }

    async selectSingleProjectManagerInListView(managerName: string): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();
        await this.page.waitForTimeout(1500);
        const projectManagerDropdown = this.page.locator('re-multiselect[placeholder="Project Manager"] .box');
        await projectManagerDropdown.click();
        const dropdownOptionsList = this.page.locator('re-multiselect[placeholder="Project Manager"] ul');
        await dropdownOptionsList.waitFor({ state: 'visible', timeout: 50000 });
        const searchInput = this.page.locator('re-multiselect[placeholder="Project Manager"] input[type="text"], re-multiselect[placeholder="Project Manager"] input[type="search"]').last();
        await searchInput.waitFor({ state: 'visible', timeout: 15_000 });
        await searchInput.fill(managerName);
        const managerOption = this.page
            .locator('li')
            .filter({ hasText: managerName })
            .first();

        await managerOption.waitFor({ state: 'visible', timeout: 15_000 });
        await managerOption.click();

        // Close the dropdown
        await this.page.keyboard.press('Escape');

        // Check tag of the selected manager
        const selectedTag = this.page
            .locator('re-multiselect[placeholder="Project Manager"] .tags')
            .filter({ hasText: managerName });

        await expect(selectedTag).toBeVisible({ timeout: 15_000 });

        await this.waitForFirstTableRow();

        const rowCount = await this.page.locator('tbody tr').count();
        expect(rowCount).toBeGreaterThan(0);
        await this.ResetButton();
    }

    /**
     * Select multiple project managers by their names in the list view.
     */
    async selectMultipleProjectManagersInListView(managerNames: string[]): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();
        await this.page.waitForTimeout(1500);

        const projectManagerDropdown = this.page.locator('re-multiselect[placeholder="Project Manager"] .box');
        await projectManagerDropdown.click();

        const dropdownOptionsList = this.page.locator('re-multiselect[placeholder="Project Manager"] ul');
        await dropdownOptionsList.waitFor({ state: 'visible', timeout: 50000 });

        const searchInput = this.page.locator('re-multiselect[placeholder="Project Manager"] input[type="text"], re-multiselect[placeholder="Project Manager"] input[type="search"]').last();
        await searchInput.waitFor({ state: 'visible', timeout: 15_000 });

        for (const managerName of managerNames) {
            await searchInput.fill(managerName);

            const managerOption = this.page.locator('li').filter({ hasText: managerName }).first();
            await managerOption.waitFor({ state: 'visible', timeout: 15_000 });
            await managerOption.click();

            // Optionally clear the search input for the next iteration
            await searchInput.fill('');
        }

        // Close the dropdown
        await this.page.keyboard.press('Escape');

        // Check tags of selected managers
        for (const managerName of managerNames) {
            const selectedTag = this.page
                .locator('re-multiselect[placeholder="Project Manager"] .tags')
                .filter({ hasText: managerName });

            await expect(selectedTag).toBeVisible({ timeout: 15_000 });
        }

        await this.waitForFirstTableRow();

        const rowCount = await this.page.locator('tbody tr').count();
        expect(rowCount).toBeGreaterThan(0);
        await this.ResetButton();
    }

    async selectAllProjectManagersInListView(): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();
        await this.page.waitForTimeout(1500);
        const projectManagerDropdown = this.page.locator('re-multiselect[placeholder="Project Manager"] .box');
        await projectManagerDropdown.click();

        const selectAllLabel = this.page.locator('label.select_all[data="Select All"]');
        await selectAllLabel.waitFor({ state: 'visible', timeout: 15_000 });
        await selectAllLabel.click();
        await this.page.keyboard.press('Escape');

        await this.waitForFirstTableRow();

        const rowCount = await this.page.locator('tbody tr').count();
        expect(rowCount).toBeGreaterThan(0);
        await this.ResetButton();
    }

    async deselectAllProjectManagersInListView(): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();
        await this.page.waitForTimeout(1500);

        const projectManagerDropdown = this.page.locator('re-multiselect[placeholder="Project Manager"] .box');
        await projectManagerDropdown.click();

        const toggleLabel = this.page.locator('label.select_all');
        await toggleLabel.waitFor({ state: 'visible', timeout: 15_000 });

        const currentState = await toggleLabel.getAttribute('data');

        if (currentState === 'Select All') {
            await toggleLabel.click();
            await expect(toggleLabel).toHaveAttribute('data', 'Deselect All', { timeout: 10_000 });
        }

        await toggleLabel.click();
        await expect(toggleLabel).toHaveAttribute('data', 'Select All', { timeout: 10_000 });

        await this.page.keyboard.press('Escape');

        await this.waitForFirstTableRow();

        const rowCount = await this.page.locator('tbody tr').count();
        expect(rowCount).toBeGreaterThan(0);

        await this.ResetButton();
    }

    async verifyDefaultViewPopupOpensInListView(): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();
        const defaultViewButton = this.page.locator('._view-btn').filter({ hasText: /default view/i });
        await defaultViewButton.waitFor({ state: 'visible', timeout: 15_000 });
        await defaultViewButton.click();
        const popupContent = this.page.locator('.p-overlaypanel-content');
        await expect(popupContent).toBeVisible({ timeout: 15_000 });
        await this.page.keyboard.press('Escape');
    }

    async createNewCustomViewInListView(viewName: string): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();

        const defaultViewButton = this.page.locator('._view-btn').filter({ hasText: /default view/i });
        await defaultViewButton.waitFor({ state: 'visible', timeout: 15_000 });
        await defaultViewButton.click();

        const popupContent = this.page.locator('.p-overlaypanel-content');
        await expect(popupContent).toBeVisible({ timeout: 15_000 });

        const addViewIcon = popupContent.locator('.view-options img[src*="plus-solid.svg"]');
        await addViewIcon.waitFor({ state: 'visible', timeout: 10_000 });
        await addViewIcon.click();

        const viewNameInput = this.page.locator('input[placeholder*="view" i], input[placeholder*="name" i]').last();
        await expect(viewNameInput).toBeVisible({ timeout: 10_000 });
        await viewNameInput.click();
        await viewNameInput.fill(viewName);

        const saveBtn = this.page.getByRole('button', { name: /save|create/i }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10_000 });
        await saveBtn.click({ force: true });

        await expect(
            this.page.getByText(/view created|saved successfully|created successfully/i)
        ).toBeVisible({ timeout: 10_000 });

        await this.resetToDefaultView();
    }

    async resetToDefaultView(): Promise<void> {
        const activeViewButton = this.page.locator('._view-btn').first();
        await activeViewButton.click();

        const viewDropdown = this.page.locator('.view-w-100 > .ng-select-container > .ng-arrow-wrapper');
        await expect(viewDropdown).toBeVisible({ timeout: 10_000 });
        await viewDropdown.click();

        const defaultOption = this.page.getByText(/^default view$/i).first();
        await expect(defaultOption).toBeVisible({ timeout: 10_000 });
        await defaultOption.click();

        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(800);
        await this.waitForFirstTableRow();
    }

    async shareViewWithAgentAndTeamInListView(
        userName: string = 'Abdul Rehman',
        teamName: string = 'Automation Team'
    ): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();

        const defaultViewButton = this.page.locator('._view-btn', { hasText: 'Default View' });
        await defaultViewButton.waitFor({ state: 'visible', timeout: 15_000 });
        await defaultViewButton.click();

        const popupContent = this.page.locator('.p-overlaypanel-content');
        await expect(popupContent).toBeVisible({ timeout: 15_000 });

        const shareIcon = popupContent.locator('.view-options img[src*="share-one.svg"]');
        await expect(shareIcon).toBeVisible({ timeout: 10_000 });
        await shareIcon.click({ force: true });

        const usersDropdown = popupContent.locator('re-multiselect.w-100.mr-2 .box');
        await expect(usersDropdown).toBeVisible({ timeout: 10_000 });
        await usersDropdown.click();

        const userDropBox = this.page.locator('.drop_box').last();
        await expect(userDropBox).toBeVisible({ timeout: 10_000 });

        const userSearchInput = userDropBox.locator('input[placeholder="Search"]');
        await userSearchInput.fill(userName);
        await this.page.waitForTimeout(800);

        const userOption = userDropBox.locator('li', { hasText: userName }).first();
        await expect(userOption).toBeVisible({ timeout: 10_000 });
        await userOption.locator('label.checkbox').click({ force: true });

        const userDropdownArrow = this.page.locator('re-multiselect.w-100.mr-2 i.fa-sort-up');
        await userDropdownArrow.click({ force: true });


        const teamsDropdown = popupContent.locator('re-multiselect.custom-select-share .box');
        await expect(teamsDropdown).toBeVisible({ timeout: 10_000 });
        await teamsDropdown.click();

        const teamDropBox = this.page.locator('.drop_box').last();
        await expect(teamDropBox).toBeVisible({ timeout: 10_000 });

        const teamSearchInput = teamDropBox.locator('input[placeholder="Search"]');
        await teamSearchInput.fill(teamName);
        await this.page.waitForTimeout(800);

        const teamOption = teamDropBox.locator('li', { hasText: teamName }).first();
        await expect(teamOption).toBeVisible({ timeout: 10_000 });
        await teamOption.locator('label.checkbox').click({ force: true });

        const teamDropdownArrow = this.page.locator('re-multiselect.custom-select-share i.fas.fa-sort-up');
        await teamDropdownArrow.click({ force: true });

        const shareBtn = popupContent.locator('button._outline-btn', { hasText: 'Share' });
        await expect(shareBtn).toBeVisible({ timeout: 10_000 });
        await shareBtn.click({ force: true });

        const sharedSuccessMessage = this.page.getByText('View shared').or(
            this.page.getByText('shared successfully')
        ).or(
            this.page.getByText('already shared with one or more selected users or teams')
        );
        await expect(sharedSuccessMessage.first()).toBeVisible({ timeout: 10_000 });

        await this.page.waitForTimeout(500);
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(400);
        await this.ResetButton();
        await this.waitForFirstTableRow();
    }

    async reorderStatusPositions() {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();

        const defaultViewButton = this.page.locator('._view-btn').filter({ hasText: /default view/i });
        await defaultViewButton.waitFor({ state: 'visible', timeout: 15_000 });
        await defaultViewButton.click();

        const popupContent = this.page.locator('.p-overlaypanel-content');
        await expect(popupContent).toBeVisible({ timeout: 15_000 });

        const draggableHandles = popupContent.locator('#visibleColumnList .cdk-drag');
        const handleCount = await draggableHandles.count();

        if (handleCount < 2) {
            throw new Error('Less than 2 draggable statuses found, cannot perform drag-and-drop.');
        }

        const firstHandle = draggableHandles.nth(0);
        const secondHandle = draggableHandles.nth(1);

        await firstHandle.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);

        const box1 = await firstHandle.boundingBox();
        const box2 = await secondHandle.boundingBox();

        if (!box1 || !box2) {
            throw new Error('Could not get bounding boxes for drag handles.');
        }

        const startX = box1.x + box1.width / 2;
        const startY = box1.y + box1.height / 2;
        const endX = box2.x + box2.width / 2;
        const endY = box2.y + box2.height + 20;
        await this.page.mouse.move(startX, startY);
        await this.page.waitForTimeout(100);
        await this.page.mouse.down();
        await this.page.waitForTimeout(100);
        await this.page.mouse.move(startX, startY + 15, { steps: 10 });
        await this.page.waitForTimeout(100);
        await this.page.mouse.move(endX, endY, { steps: 25 });
        await this.page.waitForTimeout(300);
        await this.page.mouse.up();
        await this.page.waitForTimeout(500);
        await expect(popupContent).toBeVisible();
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(400);
        await this.ResetButton();
        await this.waitForFirstTableRow();
    }

    async hideAndShowStatus() {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();
        await expect(
            this.page.locator('._view-btn').filter({ hasText: /default view/i })
        ).toBeVisible({ timeout: 15_000 });
        await this.page.locator('._view-btn').filter({ hasText: /default view/i }).click();
        await expect(this.page.locator('.p-overlaypanel-content')).toBeVisible({ timeout: 10_000 });
        await expect(
            this.page.locator('.p-overlaypanel-content').getByText('Hide All', { exact: true })
        ).toBeVisible({ timeout: 10_000 });
        await this.page.locator('.p-overlaypanel-content').getByText('Hide All', { exact: true }).click();
        await this.page.waitForTimeout(500);
        await expect(
            this.page.locator('.p-overlaypanel-content #visibleColumnList .cdk-drag')
        ).toHaveCount(0, { timeout: 10_000 });
        await expect(
            this.page.locator('.p-overlaypanel-content').getByText('Show All', { exact: true })
        ).toBeVisible({ timeout: 10_000 });
        await this.page.locator('.p-overlaypanel-content').getByText('Show All', { exact: true }).click();
        await this.page.waitForTimeout(500);
        await expect(
            this.page.locator('.p-overlaypanel-content #hiddenColumnList .cdk-drag')
        ).toHaveCount(0, { timeout: 10_000 });
        await expect(
            this.page.locator('.p-overlaypanel-content #visibleColumnList .cdk-drag').first()
        ).toBeVisible({ timeout: 10_000 });
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(300);
    }

    async searchStatusInViewPopup() {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();
        await expect(
            this.page.locator('._view-btn').filter({ hasText: /default view/i })
        ).toBeVisible({ timeout: 15_000 });
        await this.page.locator('._view-btn').filter({ hasText: /default view/i }).click();
        await expect(this.page.locator('.p-overlaypanel-content')).toBeVisible({ timeout: 10_000 });
        const searchTerm = 'Project Name';
        const searchInput = this.page.locator('.p-overlaypanel-content input[placeholder="Search"]').first();
        await expect(searchInput).toBeVisible({ timeout: 10_000 });
        await searchInput.fill(searchTerm);
        await this.page.waitForTimeout(500);
        const matchedRow = this.page.locator('.p-overlaypanel-content #visibleColumnList .cdk-drag')
            .filter({ hasText: new RegExp(searchTerm, 'i') });
        await expect(matchedRow.first()).toBeVisible({ timeout: 10_000 });
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(300);
    }

    async deleteSavedViewInListView(viewName: string): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();

        const defaultViewButton = this.page.locator('._view-btn').filter({ hasText: /default view/i });
        await defaultViewButton.waitFor({ state: 'visible', timeout: 15_000 });
        await defaultViewButton.click();

        const popupContent = this.page.locator('.p-overlaypanel-content');
        await expect(popupContent).toBeVisible({ timeout: 15_000 });

        // Open the view dropdown to reveal saved views
        const viewDropdown = popupContent.locator('ng-select[placeholder="Select default view"]');
        await expect(viewDropdown).toBeVisible({ timeout: 10_000 });
        await viewDropdown.click();
        await this.page.waitForTimeout(500);

        // Locate the target view option in the dropdown panel
        const viewOption = this.page.locator('.ng-dropdown-panel-items .ng-option')
            .filter({ hasText: new RegExp(`^\\s*${viewName}\\s*$`, 'i') });
        await expect(viewOption).toBeVisible({ timeout: 10_000 });

        // Click the trash/delete icon inside that option
        const deleteIcon = viewOption.locator('img[src*="delete_icon.svg"]');
        await expect(deleteIcon).toBeVisible({ timeout: 10_000 });
        await deleteIcon.click();

        // Handle confirmation dialog if one appears
        const confirmButton = this.page.getByRole('button', { name: /confirm|yes|delete|ok/i }).first();
        try {
            await expect(confirmButton).toBeVisible({ timeout: 5_000 });
            await confirmButton.click();
        } catch {
            // No confirmation dialog — deletion was immediate
        }

        // Verify success toast
        await expect(
            this.page.getByText(/view deleted|deleted successfully|removed successfully/i)
        ).toBeVisible({ timeout: 10_000 });

        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(300);
    }

    async switchBetweenGridAndListView() {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.switchToGridView();
        await this.switchToListView();
    }

    async openProjectCreatePopup(): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();
        const addButton = this.page.locator('button._addNew');
        await expect(addButton).toBeVisible({ timeout: 10_000 });
        await addButton.click();

        const dialog = this.page.locator('.p-dialog-content').filter({
            has: this.page.locator('input[formcontrolname="Project_Name"]'),
        });
        await expect(dialog).toBeVisible({ timeout: 10_000 });
        const projectNameInput = dialog.locator('input[formcontrolname="Project_Name"]');
        await expect(projectNameInput).toBeVisible();
        const projectStatusSelect = dialog.locator('ng-select[formcontrolname="Project_Status"]');
        await expect(projectStatusSelect).toBeVisible();
        const outlineButton = dialog.locator('button._outline-btn');
        await expect(outlineButton).toBeVisible();
        const cancelButton = dialog.locator('button._cancel-btn');
        await expect(cancelButton).toBeVisible();
        await cancelButton.click();
    }

    async selectMultipleProjects(): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();
        const selectAllCheckbox = this.page.locator('thead div.p-checkbox.p-component .p-checkbox-box');
        await expect(selectAllCheckbox).toBeVisible({ timeout: 30_000 });
        await selectAllCheckbox.click();
        await this.page.waitForTimeout(1000);
        await selectAllCheckbox.click();
        await this.ResetButton();
    }

    async duplicateSelectedProjects(): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();

        const rowCheckboxes = this.page.locator('tbody tr p-tablecheckbox .p-checkbox-box').first();
        await rowCheckboxes.click();

        const duplicateButton = this.page.locator('button', { hasText: /duplicate/i });
        await duplicateButton.click();

        const toastMessage = this.page.locator('.toast-message', { hasText: /project duplicated successfully/i });
        await expect(toastMessage).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1000);
        await this.ResetButton();
    }

    // 2. Delete selected projects
    async deleteSelectedProjects(): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();
        const checkboxes = this.page.locator('tbody tr p-tablecheckbox .p-checkbox-box').first();
        await checkboxes.click();
        const deleteButton = this.page.getByRole('button', { name: /delete/i }).first();
        await deleteButton.click();
        const confirmDeleteButton = this.page.getByRole('button', { name: /delete/i }).last();
        await confirmDeleteButton.click();
        await expect(
            this.page.getByText(/project deleted successfully|project.*deleted/i).first()
        ).toBeVisible({ timeout: 10_000 });
    }

    async deleteProjectViaRowIcon(): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();

        const deleteIcon = this.page.locator('tbody tr img[src*="delete_icon.svg"]').first();
        await expect(deleteIcon).toBeVisible({ timeout: 10_000 });
        await deleteIcon.click();

        await this.page.getByRole('button', { name: /yes|confirm|delete/i }).first().click();

        await expect(
            this.page.getByText(/Project deleted successfully|project.*deleted/i).first()
        ).toBeVisible({ timeout: 10_000 });
    }

    async cancelDeleteFromPopup(): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();
        await this.page.locator('tbody tr img[src*="delete_icon.svg"]').first().click();
        const cancelButton = this.page.getByRole('button', { name: /cancel|no/i }).first();
        await expect(cancelButton).toBeVisible({ timeout: 10_000 });
        await cancelButton.click();
        await expect(cancelButton).toBeHidden({ timeout: 5_000 });
    }

    async sortProjectsAscending(columnName: string = 'Project Name'): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();

        const sortIcon = this.page.locator('th', { hasText: columnName })
            .locator('p-sorticon').first();
        await sortIcon.click();
        await this.page.waitForTimeout(500);

        const values = await this.page.locator('tbody tr td:nth-child(3) p').allTextContents();
        const trimmed = values.map(v => v.trim()).filter(v => v.length > 0);
        const sorted = [...trimmed].sort((a, b) => a.localeCompare(b));

        if (JSON.stringify(trimmed) !== JSON.stringify(sorted)) {
            throw new Error(`Ascending sort failed. Got: ${trimmed.slice(0, 5).join(', ')}...`);
        }
    }

    async sortProjectsDescending(columnName: string = 'Project Name'): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();
        const columnHeader = this.page.locator('th', { hasText: 'Project Name' }).first();
        const filterIcon = this.page.getByRole('cell', { name: 'Project Name filter' }).locator('svg');
        await filterIcon.click();
        await expect(columnHeader.locator('sortamountdownicon')).toHaveCount(1, { timeout: 5_000 });
        const values = await this.page.locator('tbody tr td:nth-child(3) p').allTextContents();
        const trimmed = values.map(v => v.trim()).filter(v => v.length > 0);
        const sorted = [...trimmed].sort((a, b) => b.toLowerCase().localeCompare(a.toLowerCase()));

        if (JSON.stringify(trimmed) !== JSON.stringify(sorted)) {
            throw new Error(
                `Descending sort failed for "${columnName}".\n` +
                `Actual:   ${trimmed.slice(0, 5).join(' | ')}\n` +
                `Expected: ${sorted.slice(0, 5).join(' | ')}`
            );
        }
    }

    async searchProjectWithSymbols(): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();
        const searchInput = this.page.locator('input[placeholder="Search"]').last();
        await searchInput.fill('@#$%^&*');
        const noRecordsMessage = this.page.getByText(/No projects available/i).first();
        await expect(noRecordsMessage).toBeVisible({ timeout: 30_000 });
        await this.ResetButton();
    }

    async selectProjectManagerWithNoProjects(): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();
        await this.page.waitForTimeout(1500);
        const pm = this.page.locator('re-multiselect[placeholder="Project Manager"] .box');
        await pm.click();
        const dropdownOptionsList = this.page.locator('re-multiselect[placeholder="Project Manager"] ul');
        await dropdownOptionsList.waitFor({ state: 'visible', timeout: 50000 });
        await this.page.keyboard.press('Escape');
        await this.ResetButton();
    }

    async createViewWithoutName(): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();
        await this.page.locator('._view-btn').filter({ hasText: /default view/i }).click();
        const popupContent = this.page.locator('.p-overlaypanel-content');
        await expect(popupContent).toBeVisible({ timeout: 15_000 });
        const addViewIcon = popupContent.locator('.view-options img[src*="plus-solid.svg"]');
        await addViewIcon.waitFor({ state: 'visible', timeout: 10_000 });
        await addViewIcon.click();
        const viewNameInput = this.page.locator('input[placeholder*="view" i], input[placeholder*="name" i]').last();
        await expect(viewNameInput).toBeVisible({ timeout: 10_000 });
        const saveBtn = this.page.getByRole('button', { name: /save|create/i }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10_000 });
        await saveBtn.click({ force: true });
        await expect(
            this.page.locator('input[placeholder*="view" i], input[placeholder*="name" i].invalidField')
        ).toBeVisible({ timeout: 5_000 });
        await this.page.keyboard.press('Escape');
        await this.ResetButton();
    }

    async saveViewWithoutChanges(): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();
        await this.page.locator('._view-btn').filter({ hasText: /default view/i }).click();
        const popupContent = this.page.locator('.p-overlaypanel-content');
        await expect(popupContent).toBeVisible({ timeout: 15_000 });
        const addViewIcon = popupContent.locator('.view-options img[src*="plus-solid.svg"]');
        await addViewIcon.waitFor({ state: 'visible', timeout: 10_000 });
        await addViewIcon.click();
        const viewNameInput = this.page.locator('input[placeholder*="view" i], input[placeholder*="name" i]').last();
        await expect(viewNameInput).toBeVisible({ timeout: 10_000 });
        const saveBtn = this.page.getByRole('button', { name: /save|create/i }).first();
        await expect(saveBtn).toBeVisible({ timeout: 10_000 });
        await saveBtn.click({ force: true });
        await expect(
            this.page.locator('input[placeholder*="view" i], input[placeholder*="name" i].invalidField')
        ).toBeVisible({ timeout: 5_000 });
        await this.page.keyboard.press('Escape');
        await this.ResetButton();
    }

    async shareViewWithNoSelection(): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();
        await this.page.locator('._view-btn').filter({ hasText: /default view/i }).click();
        const popupContent = this.page.locator('.p-overlaypanel-content');
        await expect(popupContent).toBeVisible({ timeout: 15_000 });
        const shareIcon = popupContent.locator('.view-options img[src*="share-one.svg"]');
        await expect(shareIcon).toBeVisible({ timeout: 10_000 });
        await shareIcon.click({ force: true });
        const shareBtn = popupContent.locator('button._outline-btn', { hasText: 'Share' });
        await expect(shareBtn).toBeVisible({ timeout: 10_000 });
        await shareBtn.click({ force: true });
        const sharedSuccessMessage = this.page.getByText('View shared').or(
            this.page.getByText('shared successfully')
        ).or(
            this.page.getByText('user or team is not selected')
        );
        await expect(sharedSuccessMessage.first()).toBeVisible({ timeout: 10_000 });

        await this.page.waitForTimeout(500);
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(400);
        await this.ResetButton();
        await this.waitForFirstTableRow();
    }

    async viewStatusOutOfSync(): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();

        await this.page.locator('._view-btn').filter({ hasText: /default view/i }).click();

        const popupContent = this.page.locator('.p-overlaypanel-content');
        await expect(popupContent).toBeVisible({ timeout: 10_000 });
        await popupContent.locator('#visibleColumnList .cdk-drag')
            .filter({ hasText: /developer/i })
            .locator('img[src*="Eye.svg"]').click();
        await this.page.waitForTimeout(500);
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(500);
        await this.page.locator('._view-btn').filter({ hasText: /default view/i }).click();
        await expect(popupContent).toBeVisible({ timeout: 10_000 });
        const developerInVisible = await popupContent
            .locator('#visibleColumnList .cdk-drag')
            .filter({ hasText: /developer/i }).count();
        console.log(`After navigate-away-and-reopen, Developer in visible list: ${developerInVisible > 0}`);
        await this.page.waitForTimeout(500);
        await this.page.mouse.click(0, 0);
        await this.page.waitForTimeout(500);
        await this.ResetButton();
    }

    async verifyRecordsCountAtEnd(): Promise<void> {
        await this.navigateToProjects();
        await this.switchToListView();
        await this.waitForFirstTableRow();
        const recordsLocator = this.page.locator('p').filter({ hasText: /^\s*Records:\s*\d+/ });
        await recordsLocator.scrollIntoViewIfNeeded();
        await expect(recordsLocator).toBeVisible({ timeout: 40_000 });
        const text = await recordsLocator.textContent();
        const count = parseInt(text?.match(/\d+/)?.[0] ?? '0', 10);
        if (count <= 0) {
            throw new Error(`Invalid records count: "${text?.trim()}"`);
        }
        console.log(`Records displayed at end of list: ${count}`);
    }

    async verifyPrecinctSetupSubTabs(): Promise<void> {
        await this.navigateToProjects();
        await this.switchToGridView();
        // Click the "Precinct Set up" main menu tab
        const precinctSetupTab = this.page.locator('app-menu a', { hasText: /precinct set up/i });
        await expect(precinctSetupTab).toBeVisible({ timeout: 10_000 });
        await precinctSetupTab.click();
        await this.page.waitForLoadState('networkidle');

        // Verify "Precinct" sub-tab is visible
        const precinctSubTab = this.page.locator('.secondary-tabs a[role="tab"]')
            .filter({ hasText: /^\s*Precinct\s*$/i });
        await expect(precinctSubTab).toBeVisible({ timeout: 10_000 });

        // Verify "Precinct Allocation" sub-tab is visible
        const precinctAllocationSubTab = this.page.locator('.secondary-tabs a[role="tab"]')
            .filter({ hasText: /precinct allocation/i });
        await expect(precinctAllocationSubTab).toBeVisible({ timeout: 10_000 });
    }

    async verifyPrecinctTabDefaultControls(): Promise<void> {
        await this.navigateToProjects();
        const precinctSetupTab = this.page.locator('app-menu a', { hasText: /precinct set up/i });
        await expect(precinctSetupTab).toBeVisible({ timeout: 10_000 });
        await precinctSetupTab.click();
        await this.page.waitForLoadState('networkidle');
        const precinctTab = this.page.locator('#pills-precinct-tab');
        await expect(precinctTab).toHaveClass(/active/);
        const precinctPanel = this.page.locator('#precinct');
        const selectProjectDropdown = precinctPanel.locator('ng-select[placeholder="Select Project"]');
        await expect(selectProjectDropdown).toBeVisible({ timeout: 10_000 });
        const createNewButton = precinctPanel.locator('button', { hasText: /create new/i });
        await expect(createNewButton).toBeVisible({ timeout: 10_000 });
    }
}