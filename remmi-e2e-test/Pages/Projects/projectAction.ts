import { expect, Page, Locator } from '@playwright/test';

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

}