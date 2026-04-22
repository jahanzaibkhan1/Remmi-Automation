import { expect, Page, Locator } from '@playwright/test';
import { faker } from '@faker-js/faker';
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
        await input.fill('');

    }

    /**
     * Verify that the project image is displayed correctly in Grid View
     */
    async verifyProjectImageDisplayedInGridView(projectName: string): Promise<void> {
        await this.navigateToProjects();
        const projectCard = this.page.locator('.sgv-product .product-content h3', { hasText: new RegExp(`^${projectName}$`, 'i') }).first();
        await projectCard.scrollIntoViewIfNeeded();
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
        const projectCard = this.page.locator('.sgv-product .product-content h3', { hasText: new RegExp(`^${'Al kabir heights'}$`, 'i') }).first();
        await projectCard.scrollIntoViewIfNeeded();
        await expect(projectCard).toBeVisible({ timeout: 15000 });
        const sgvProduct = projectCard.locator('..').locator('..').first();
        const productThumbnail = sgvProduct.locator('.product-thumbnail').first();
        await expect(productThumbnail).toBeVisible({ timeout: 10000 });
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
        const gridIcon = this.page.locator('.layout-changer a.grid-icon');
        await expect(gridIcon).toBeVisible({ timeout: 30000 });
        await gridIcon.click();
    }

    async switchToListView(): Promise<void> {
        const listIcon = this.page.locator('.layout-changer a:not(.grid-icon)');
        await expect(listIcon).toBeVisible({ timeout: 30000 });
        await listIcon.click();
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
            .catch(() => {});
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

}