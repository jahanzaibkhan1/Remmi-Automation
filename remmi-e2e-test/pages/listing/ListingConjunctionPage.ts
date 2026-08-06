import { expect } from '@playwright/test';
import { ListingBasePage } from './ListingBasePage';

export class ListingConjunctionPage extends ListingBasePage {
    async verifyConjunctionTabOpensCorrectly() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 30000 });
        await firstListingCard.click();

        // Find and click the Conjunction tab
        const conjunctionTab = this.page.getByRole('tab', { name: /Conjunction/i });
        await expect(conjunctionTab).toBeVisible({ timeout: 10000 });
        await conjunctionTab.click();

        // Verify that the Conjunction tab content is visible/loaded.
        const conjunctionContent = this.page.getByText('Sales CommissionConjunction');
        await expect(conjunctionContent).toBeVisible({ timeout: 10000 });

        // Optionally close the form/dialog if needed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that Sale Commission field accepts only numeric values.
     */
    async verifySaleCommissionAcceptsOnlyNumeric() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first listing card
        const firstListingCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListingCard).toBeVisible({ timeout: 20000 });
        await firstListingCard.click();

        // Go to Conjunction tab
        const conjunctionTab = this.page.getByRole('tab', { name: /Conjunction/i });
        await expect(conjunctionTab).toBeVisible({ timeout: 10000 });
        await conjunctionTab.click();

        // Locate the Sale Commission input (adjust the selector if needed)
        const saleCommissionInput = this.page.locator('input[type="number"]._input').last();

        await expect(saleCommissionInput).toBeVisible({ timeout: 10000 });

        // Test 1: Try entering a valid numeric value
        await saleCommissionInput.fill('');
        await saleCommissionInput.type('123.45');
        let value = await saleCommissionInput.inputValue();
        expect(value).toBe('123.45');

        // Test 2: Try entering non-numeric values (letters, symbols)
        await saleCommissionInput.fill('');
        await saleCommissionInput.type('abc$%');
        value = await saleCommissionInput.inputValue();
        // The field should remain empty or strip out all non-numeric characters
        expect(value).toBe('');

        // Test 3: Try mixed input ("12xyz#45")
        await saleCommissionInput.fill('');
        await saleCommissionInput.type('12xyz#45');
        value = await saleCommissionInput.inputValue();
        // Should only keep numeric part ("1245" or blank, depending on validation implementation)
        // If the field allows only numeric input, value will be '1245'.
        expect(value).toMatch(/^\d*\.?\d*$/);

        // Optionally close the form/dialog if needed
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(500);
    }

    /**
     * Verifies that the NOTE Tab opens correctly.
     */
}
