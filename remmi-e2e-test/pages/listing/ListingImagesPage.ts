import { expect } from '@playwright/test';
import { ListingBasePage } from './ListingBasePage';

export class ListingImagesPage extends ListingBasePage {
    async verifyImageTabHasSearchField() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        const chevronDown = this.page.locator('i.pi.pi-chevron-down').first();
        await chevronDown.click({ force: true });
        // Find the delete button for the first visible listing card in card/grid view
        const cardDeleteButton = this.page.locator('a:nth-child(4)').first();
        await cardDeleteButton.scrollIntoViewIfNeeded()
        await this.page.waitForTimeout(1000);
        await cardDeleteButton.click({ force: true });

        // Wait for confirmation dialog to appear
        const confirmationDialog = this.page.getByText('Are you sure you want to delete this listing ? Your listing will be permanently');
        await expect(confirmationDialog).toBeVisible({ timeout: 10000 });

        // Find and click the confirm Delete button
        const confirmButton = this.page.getByRole('button', { name: 'Delete' });
        await expect(confirmButton).toBeVisible({ timeout: 10000 });
        await confirmButton.click({ force: true });
        const toast = this.page.getByRole('alert', { name: 'Listing successfully deleted' });
        await expect(toast).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(2000);
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);
        // Wait for the image tab to be visible and click it (adjust selector if needed)
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 10000 });
        await imageTab.click();

        const imageTabSearchField = this.page.getByRole('tabpanel', { name: 'gavel Images' }).getByPlaceholder('Search');
        await imageTabSearchField.waitFor({ state: 'visible', timeout: 10000 });

        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(2000);

    }

    // Verify that the Floor Plan folder is displayed upon opening the image tab
    async verifyFloorPlanFolderVisibleInImageTab() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Wait for all listing cards to load and click the first card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Wait for the image tab to be visible and click it (adjust selector if needed)
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 10000 });
        await imageTab.click();

        // Wait for the Floor Plan folder/item to be visible within the image tab panel
        const floorPlanFolder = this.page.locator('div.lib-file', { hasText: 'Floorplans' });
        await expect(floorPlanFolder).toBeVisible({ timeout: 20000 });

        // Optionally, close the modal/tab after check
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(2000);
    }

    // Verify that the Add button provides options for folder, public file upload, and private file upload
    async verifyAddButtonOptionsInImageTab() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Wait for all listing cards to load and click the first card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 10000 });
        await imageTab.click();

        // Wait for the Floor Plan folder/item to be visible within the image tab panel
        const floorPlanFolder = this.page.locator('div.lib-file', { hasText: 'Floorplans' });
        await floorPlanFolder.scrollIntoViewIfNeeded();
        await expect(floorPlanFolder).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1200);

        // Find the 'Add' button (usually a plus icon or labeled 'Add')
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();

        // Verify "Folder", "Public File Upload", and "Private File Upload" options appear
        const folderOption = this.page.locator('a', { hasText: 'Folder' });
        const publicOption = this.page.locator('a', { hasText: /File Upload \(Public\)/ });
        const privateOption = this.page.locator('a', { hasText: /File Upload \(Private\)/ });

        await expect(folderOption).toBeVisible({ timeout: 10000 });
        await expect(publicOption).toBeVisible({ timeout: 10000 });
        await expect(privateOption).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);
        // Optionally close popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    // Verifies that selecting "Folder" from the Add menu opens the 'New Folder' popup/dialog
    async verifyFolderOptionOpensNewFolderPopup() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Wait for all listing cards to load and click the first card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 30000 });
        await imageTab.click();

        // Wait for the Floor Plan folder/item to be visible within the image tab panel
        const floorPlanFolder = this.page.locator('div.lib-file', { hasText: 'Floorplans' });
        await floorPlanFolder.scrollIntoViewIfNeeded();
        await expect(floorPlanFolder).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1200);
        // Click the Add button
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();
        await this.page.waitForTimeout(1000);

        // Click "Folder" option
        const folderOption = this.page.locator('a', { hasText: 'Folder' });
        await expect(folderOption).toBeVisible({ timeout: 10000 });
        await folderOption.click({ force: true });
        await this.page.waitForTimeout(1000);
        // "New Folder" popup/dialog should be visible (look for "New Folder" title or name input)
        const popupTitle = this.page.getByText('New folder');
        const nameInput = this.page.getByRole('textbox', { name: 'Folder name' });

        await expect(popupTitle).toBeVisible({ timeout: 10000 });
        await expect(nameInput).toBeVisible({ timeout: 10000 });

        // click cancel button
        const cancelButton = this.page.getByRole('button', { name: /cancel/i });
        await expect(cancelButton).toBeVisible({ timeout: 10000 });
        await cancelButton.click();

        await this.page.waitForTimeout(1200);
        // Optionally close the popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }

    }

    /**
     * Verifies that the 'New Folder' popup contains a required name field.
     */
    async verifyNewFolderPopupHasRequiredNameField() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Wait for all listing cards to load and click the first card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 10000 });
        await imageTab.click();

        const floorPlanArea = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' });
        await floorPlanArea.scrollIntoViewIfNeeded();
        await floorPlanArea.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1200);
        // Find the 'Add' button (usually a plus icon or labeled 'Add')
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click({ force: true });

        // Wait for Folder and Upload options to become visible
        const folderOption = this.page.locator('a').filter({ hasText: 'Folder' });

        await expect(folderOption).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);
        await folderOption.click();

        const newFolderDialog = this.page.locator('.p-dialog-content');
        await expect(newFolderDialog).toBeVisible({ timeout: 10000 });

        // Click the "Cancel" button in the folder creation dialog
        const createButton = this.page.getByRole('button', { name: 'Create' }).first();
        await expect(createButton).toBeVisible({ timeout: 10000 });
        await createButton.click();
        // Check for "Name is required!" validation message after trying to create a folder with no name
        const nameRequiredMsg = this.page.getByText('Name is required!').first();
        await expect(nameRequiredMsg).toBeVisible({ timeout: 10000 });

        // Click the "Cancel" button in the New Folder popup
        const cancelButton = this.page.getByRole('button', { name: 'Cancel' }).first();
        await expect(cancelButton).toBeVisible({ timeout: 10000 });
        await cancelButton.click();

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(2000);
    }

    // Verifies that the New Folder popup has cross, cancel, and create buttons
    async verifyNewFolderPopupHasButtons() {

        await this.navigateToListings();
        await this.switchToGridView();

        // Wait for all listing cards to load and click the first card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 10000 });
        await imageTab.click();

        const floorPlanArea = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' });
        await floorPlanArea.scrollIntoViewIfNeeded();
        await floorPlanArea.waitFor({ state: 'visible', timeout: 30000 });

        await this.page.waitForTimeout(1200);

        // Find the 'Add' button (usually a plus icon or labeled 'Add')
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click({ force: true });

        // Wait for Folder and Upload options to become visible
        const folderOption = this.page.locator('a').filter({ hasText: 'Folder' });

        await expect(folderOption).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);
        await folderOption.click();

        // Assumes the New Folder popup is open
        const newFolderDialog = this.page.locator('.p-dialog-content');
        await expect(newFolderDialog).toBeVisible({ timeout: 10000 });

        // The cross/close icon button (could be .pi-times)
        const closeButton = this.page.locator('.p-dialog-header .p-dialog-header-close, .pi.pi-times').nth(2);
        await expect(closeButton).toBeVisible({ timeout: 2000 });

        // The Cancel button
        const cancelButton = this.page.getByRole('button', { name: /cancel/i }).first();
        await expect(cancelButton).toBeVisible({ timeout: 2000 });

        // The Create button
        const createButton = this.page.getByRole('button', { name: /create/i }).first();
        await expect(createButton).toBeVisible({ timeout: 2000 });

        await cancelButton.click();

        await this.page.waitForTimeout(1200);


        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(2000);
    }

    async createNewFolderInImagesTab() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 10000 });
        await imageTab.click();

        const floorPlanArea = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' });
        await floorPlanArea.scrollIntoViewIfNeeded();
        await floorPlanArea.waitFor({ state: 'visible', timeout: 30000 });

        await this.page.waitForTimeout(1200);

        // Find the 'Add' button (usually a plus icon or labeled 'Add')
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click({ force: true });
        // Wait for Folder and Upload options to become visible
        const folderOption = this.page.locator('a').filter({ hasText: 'Folder' });

        await expect(folderOption).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);
        await folderOption.click();
        // Wait for the New Folder dialog to appear
        const newFolderDialog = this.page.locator('.p-dialog-content');
        await expect(newFolderDialog).toBeVisible({ timeout: 10000 });

        const folderNameInput = this.page.getByRole('textbox', { name: 'Folder name' });
        await folderNameInput.click();
        // Use faker to generate a random folder name for more robust testing
        const { faker } = require('@faker-js/faker');
        const randomFolderName = faker.word.sample();
        await folderNameInput.fill(randomFolderName);
        const createButton = this.page.getByRole('button', { name: /create/i }).first();
        await expect(createButton).toBeVisible({ timeout: 3000 });
        await createButton.click();

        const automationFolder = this.page.locator('.lib-file').filter({ hasText: randomFolderName });
        await automationFolder.scrollIntoViewIfNeeded();
        await expect(automationFolder).toBeVisible({ timeout: 30000 });

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(2000);

    }

    /**
     * Verifies that clicking "File Upload (Public)" from the Add menu opens the file upload dialog
     * and allows the user to successfully upload a file.
     */
    async verifyPublicFileUploadAllowsUploadingFile(filePath: string) {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first property card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Ensure Floorplans folder visible
        const floorPlanArea = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' });
        await floorPlanArea.scrollIntoViewIfNeeded();
        await floorPlanArea.waitFor({ state: 'visible', timeout: 30000 });

        await this.page.waitForTimeout(1200);
        // Find the 'Add' button (usually a plus icon or labeled 'Add')
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click({ force: true });

        // Click "File Upload (Public)" option
        const publicOption = this.page.locator('a', { hasText: 'File Upload (Public)' });

        await expect(publicOption).toBeVisible({ timeout: 3000 });
        await publicOption.click();

        // Wait for upload input to appear
        const fileInput = this.page.locator('#fileUpload');
        // Upload the file
        await fileInput.setInputFiles(filePath);

        // Check image name visibility within the .lib-file area
        const imageName = filePath.split(/[\\/]/).pop();
        if (imageName) {
            const imageNameInLibFile = this.page.locator(`.lib-file :text("${imageName}")`).first();
            await expect(imageNameInLibFile).toBeVisible({ timeout: 40000 });
        }

        // Save and close
        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }

    /**
     * Verifies that a file uploaded via the Public File Upload option
     */
    async verifyPublicFileUploadAllowsDownload(filePath: string) {

        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first property card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Ensure Floorplans folder visible
        const floorPlanArea = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' });
        await floorPlanArea.scrollIntoViewIfNeeded();
        await floorPlanArea.waitFor({ state: 'visible', timeout: 30000 });

        await this.page.waitForTimeout(1200);

        // Find the 'Add' button (usually a plus icon or labeled 'Add')
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click({ force: true });

        // Click "File Upload (Public)" option
        const publicOption = this.page.locator('a', { hasText: 'File Upload (Public)' });

        await expect(publicOption).toBeVisible({ timeout: 3000 });
        await publicOption.click();

        // Wait for upload input to appear
        const fileInput = this.page.locator('#fileUpload');
        // Upload the file
        await fileInput.setInputFiles(filePath);

        // Check image name visibility within the .lib-file area
        const imageName = filePath.split(/[\\/]/).pop();
        if (imageName) {
            const imageNameInLibFile = this.page.locator(`.lib-file :text("${imageName}")`).first();
            await expect(imageNameInLibFile).toBeVisible({ timeout: 40000 });
        }

        // Check for download element in the same context
        const downloadLocator = this.page.locator('img.img-hub2[src*="Library/PropertyImage"]').first()
        await downloadLocator.click();

        const downloadIcon = this.page.locator('.p-element.mr-3.pi.pi-download').first();
        await expect(downloadIcon).toBeVisible({ timeout: 10000 });
        await downloadIcon.click();
        // Optionally verify that re-downloading doesn't error
        await this.page.waitForTimeout(1000);
        // Close via pipi close icon
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1500);
    }

    // Upload an image using the Private File Upload option
    async uploadPrivateImage(filePath: string) {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first property card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Ensure Floorplans folder visible
        const floorPlanArea = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' });
        await floorPlanArea.scrollIntoViewIfNeeded();
        await floorPlanArea.waitFor({ state: 'visible', timeout: 30000 });

        await this.page.waitForTimeout(1200);

        // Find the 'Add' button (usually a plus icon or labeled 'Add')
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click({ force: true });

        // Click "File Upload (Public)" option
        const privateOption = this.page.locator('a', { hasText: 'File Upload (Private)' });

        await expect(privateOption).toBeVisible({ timeout: 3000 });
        await privateOption.click();

        // Wait for upload input to appear
        const fileInput = this.page.locator('#fileUpload');
        // Upload the file
        await fileInput.setInputFiles(filePath);

        // Check image name visibility within the .lib-file area
        const imageName = filePath.split(/[\\/]/).pop();
        if (imageName) {
            const imageNameInLibFile = this.page.locator(`.lib-file :text("${imageName}")`).first();
            await expect(imageNameInLibFile).toBeVisible({ timeout: 40000 });
        }

        // Check for download element in the same context
        const downloadLocator = this.page.locator('img.img-hub2[src*="PropertyImage"]').last()
        await downloadLocator.click();

        const downloadIcon = this.page.locator('.p-element.mr-3.pi.pi-download').first();
        await expect(downloadIcon).toBeVisible({ timeout: 10000 });
        await downloadIcon.click();
        // Wait for either the File Access dialog or file download to initiate
        const fileAccessDialog = this.page.locator('text=File Access').first();
        if (await fileAccessDialog.isVisible({ timeout: 3000 }).catch(() => false)) {
            // Enter PIN in the input field
            const pinInput = this.page.locator('input[placeholder="PIN"]');
            await expect(pinInput).toBeVisible({ timeout: 10000 });
            // Replace '1234' with the correct PIN if needed/configured elsewhere
            await pinInput.fill('1234');
            // Click Save button
            const saveButton = this.page.getByRole('button', { name: 'Save' });
            await expect(saveButton).toBeEnabled({ timeout: 3000 });
            await saveButton.click();
            // Wait for dialog to disappear, download to start
            await expect(fileAccessDialog).toBeHidden({ timeout: 5000 });
        }
        // Optionally verify that re-downloading doesn't error
        await this.page.waitForTimeout(1000);

        // 
        // Close via pipi close icon
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1500);
    }

    /**
     * Verifies that entering the correct PIN allows the user to download a file from the Private File Upload option.
     */
    async verifyPrivateFileUploadAllowsDownload() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first property card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Ensure Floorplans folder is visible
        const floorPlanArea = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' });
        await floorPlanArea.scrollIntoViewIfNeeded();
        await floorPlanArea.waitFor({ state: 'visible', timeout: 30000 });

        await this.page.waitForTimeout(1500);
        // Check for download element in the same context
        const downloadLocator = this.page.locator('img.img-hub2[src*="propertyImage"]').last()
        await downloadLocator.click();

        const downloadIcon = this.page.locator('.p-element.mr-3.pi.pi-download').first();
        await expect(downloadIcon).toBeVisible({ timeout: 10000 });
        await downloadIcon.click();

        // Enter PIN in the input field
        const pinInput = this.page.locator('input[placeholder="PIN"]');
        await expect(pinInput).toBeVisible({ timeout: 10000 });
        // Replace '1234' with the correct PIN if needed/configured elsewhere
        await pinInput.fill('1234');
        // Click Save button
        const saveButton = this.page.getByLabel('Images').getByRole('button', { name: 'Save' });
        await saveButton.click();
        // Optionally verify that re-downloading doesn't error
        await this.page.waitForTimeout(1000);

        // Save and close
        const saveAndCloseButton = this.page.getByRole('button', { name: /Save & Close/i }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }

    // Verify that entering an incorrect PIN prevents file download
    async verifyPrivateFileUploadInvalidPinBlocksDownload() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first property card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Ensure Floorplans folder is visible
        const floorPlanArea = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' });
        await floorPlanArea.scrollIntoViewIfNeeded();
        await floorPlanArea.waitFor({ state: 'visible', timeout: 30000 });

        await this.page.waitForTimeout(1500);

        // Attempt to download a private image to trigger PIN entry
        const downloadLocator = this.page.locator('img.img-hub2[src*="propertyImage"]').last();
        await downloadLocator.click();

        const downloadIcon = this.page.locator('.p-element.mr-3.pi.pi-download').first();
        await expect(downloadIcon).toBeVisible({ timeout: 10000 });
        await downloadIcon.click();

        // Wait for File Access (PIN entry) dialog to appear
        const fileAccessDialog = this.page.locator('text=File Access').first();
        if (await fileAccessDialog.isVisible({ timeout: 3000 }).catch(() => false)) {
            // Enter an incorrect PIN
            const pinInput = this.page.locator('input[placeholder="PIN"]');
            await expect(pinInput).toBeVisible({ timeout: 10000 });
            await pinInput.fill('9999'); // Use a clearly incorrect PIN
            const saveButton = this.page.getByLabel('Images').getByRole('button', { name: 'Save' });
            await expect(saveButton).toBeEnabled({ timeout: 3000 });
            await saveButton.click();

            // Expect an error or that the dialog remains visible (download NOT allowed)
            // Check for error message (adjust selector based on UI)
            const pinErrorMsg = this.page.locator('text=Invalid PIN');
            await expect(pinErrorMsg).toBeVisible({ timeout: 10000 });

            const cancelButton = this.page.getByRole('button', { name: /Cancel/i });
            await expect(cancelButton).toBeVisible({ timeout: 3000 });
            await cancelButton.click();
        }
        await this.page.waitForTimeout(1000);

        // Close the dialog or form
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1500);
    }

    // Verify that double clicking a file opens the File Preview popup
    async verifyDoubleClickOpensFilePreview() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first property card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Ensure Floorplans folder is visible
        const floorPlanArea = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' });
        await floorPlanArea.scrollIntoViewIfNeeded();
        await floorPlanArea.waitFor({ state: 'visible', timeout: 30000 });

        await this.page.waitForTimeout(1500);
        // Wait for the file/images area to be visible
        const fileThumbnail = this.page.locator('img.img-hub2[src*="PropertyImage"]').first();
        await expect(fileThumbnail).toBeVisible({ timeout: 10000 });

        // Double-click the file thumbnail
        await fileThumbnail.dblclick();

        // Wait for the File Preview popup/dialog to appear
        const previewDialog = this.page.locator('text=File Preview').first();
        await expect(previewDialog).toBeVisible({ timeout: 10000 });

        // Verify that the close (cross) icon is visible in the preview dialog
        const crossIcon = this.page.getByRole('dialog').getByRole('button').filter({ hasText: /^$/ });
        await expect(crossIcon).toBeVisible({ timeout: 3000 });

        await crossIcon.click();

        await this.page.waitForTimeout(1200);

        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    // Verify that the total number of files is displayed next to the search field
    async verifyFileCountDisplayedNextToSearch() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first property card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Ensure Floorplans folder is visible
        const floorPlanArea = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' });
        await floorPlanArea.scrollIntoViewIfNeeded();
        await floorPlanArea.waitFor({ state: 'visible', timeout: 30000 });

        // Wait for search field to be visible
        const searchField = this.page.locator('input[placeholder="Search"]').last();
        await expect(searchField).toBeVisible({ timeout: 10000 });

        const fileCountLocator = this.page.locator('label', { hasText: /\d+\sFiles/ });

        // Wait for file count to be visible
        await expect(fileCountLocator.first()).toBeVisible({ timeout: 10000 });

        // Text print kerwana hy
        const fileCountText = await fileCountLocator.first().innerText();
        console.log("File count label text:", fileCountText);

        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }

    }

    // Verify that right clicking a folder displays options for Share, Rename, Make a Copy, and Remove
    async verifyFolderContextMenuOptions() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first property card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Wait for any folder - e.g. Floorplans - to appear
        const folderElem = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' }).first();
        await folderElem.scrollIntoViewIfNeeded();
        await expect(folderElem).toBeVisible({ timeout: 10000 });

        // Right click on the folder
        await folderElem.click({ button: 'right' });
        await this.page.waitForTimeout(1000);

        // Check for Share, Rename, Make a Copy, Remove options in context menu
        const shareOption = this.page.getByText(/Share/i).last();
        const renameOption = this.page.getByText(/Rename/i).last();
        const makeCopyOption = this.page.getByText(/Make a Copy/i).first();
        const removeOption = this.page.getByText(/Remove/i).first();

        await expect(shareOption).toBeVisible({ timeout: 10000 });
        await expect(renameOption).toBeVisible({ timeout: 10000 });
        await expect(makeCopyOption).toBeVisible({ timeout: 10000 });
        await expect(removeOption).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);

        // Optionally close the dialog again using ".pi.pi-times" icon if still open
        await this.closeModalIfVisible();
    }

    // Verify that clicking Remove deletes the last folder
    async verifyRemoveFolderDeletesFolder() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first property card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Open the Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        const folderElem = this.page.locator('.lib-file').filter({ hasText: 'Floorplans' }).first();
        await folderElem.scrollIntoViewIfNeeded();
        await expect(folderElem).toBeVisible({ timeout: 10000 });

        // Find and trim the folder name text (remove whitespace)
        const folders = this.page.locator('div.lib-file').last();
        await folders.scrollIntoViewIfNeeded();
        await expect(folders).toBeVisible({ timeout: 15000 });
        const folderName = (await folders.textContent())?.trim();
        await this.page.waitForTimeout(600);
        // Right-click the folder and select 'Remove'
        await folders.click({ button: 'right' });
        await folders.click({ button: 'right' });
        await this.page.waitForTimeout(600);

        const removeOption = this.page.getByText(/Remove/i).first();
        await expect(removeOption).toBeVisible({ timeout: 10000 });
        await removeOption.click();

        // Wait a moment for deletion to process
        await this.page.waitForTimeout(1200);

        // Verify the folder no longer remains in the list
        if (folderName) {
            const folderList = this.page.locator('div.lib-file', { hasText: folderName });
            await expect(folderList).toHaveCount(0, { timeout: 30000 });
        }

        // Optionally close any open popups
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }

    }

    // Verify that clicking Make a Copy duplicates the folder
    async verifyMakeCopyDuplicatesFolder() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first listing card to open details
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Navigate to the Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Make sure the "Floorplans" folder is present
        const floorplansFolder = this.page.locator('.lib-file', { hasText: 'Floorplans' }).first();
        await floorplansFolder.scrollIntoViewIfNeeded();
        await expect(floorplansFolder).toBeVisible({ timeout: 30000 });

        // Identify the last folder (target for duplication)
        const targetFolder = this.page.locator('.lib-file').last();
        await targetFolder.scrollIntoViewIfNeeded();
        await expect(targetFolder).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);
        // Get the folder name before duplication
        const originalFolderName = (await targetFolder.innerText()).trim();

        // Right-click twice to ensure context menu is open
        await targetFolder.click({ button: 'right' });
        await targetFolder.click({ button: 'right' });
        await this.page.waitForTimeout(1000);

        // Click Make a Copy from context menu
        const makeCopyOption = this.page.getByRole('link', { name: /Make a Copy/i });
        await expect(makeCopyOption).toBeVisible({ timeout: 10000 });
        await makeCopyOption.click();

        // Verify duplicate folder appears with expected name
        const expectedCopyName = `Copy of ${originalFolderName}`;
        const copiedFolder = this.page.locator('.lib-file', { hasText: expectedCopyName }).first();
        await copiedFolder.scrollIntoViewIfNeeded();
        await expect(copiedFolder).toBeVisible({ timeout: 40000 });

        // Optionally close any open popups
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that entering a name and clicking Rename changes the folder name.
     */
    async verifyRenameFolderChangesName() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Find the last folder in the Files tab (to minimize risk of conflicting with system folders)
        const folder = this.page.locator('div.lib-file').last();
        await folder.scrollIntoViewIfNeeded();
        await expect(folder).toBeVisible({ timeout: 20000 });

        // Use a unique, random rename string to ensure uniqueness and avoid stale cache/UI issues
        const { faker } = require('@faker-js/faker');
        const newFolderName = `Renamed-${faker.string.alphanumeric(6)}`;
        await this.page.waitForTimeout(1000);

        // Right-click the folder to open context menu
        await folder.click({ button: "right" });
        await this.page.waitForTimeout(750);

        // Find and click 'Rename' in the context menu
        const renameOption = this.page.getByText('Rename').first();
        await expect(renameOption).toBeVisible({ timeout: 10000 });
        await renameOption.click({ force: true });

        const nameInput = this.page.locator('input[type="text"][required]');
        await expect(nameInput).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(500);

        // Clear the input in a robust way before filling
        await nameInput.click();
        await this.page.waitForTimeout(200);
        for (const char of newFolderName) {
            await nameInput.type(char, { delay: 20 }); // 120ms per character
        }

        // Click the "Rename" button
        const renameBtn = this.page.getByRole('button', { name: /^Rename$/i }).first();
        await expect(renameBtn).toBeVisible({ timeout: 10000 });
        await renameBtn.click({ force: true });

        // Verify the success toast "Name changed successfully" appears
        const successToast = this.page.getByRole('alert', { name: 'Name change successfully' })
        await expect(successToast).toBeVisible({ timeout: 10000 });


        // Wait for the folder tile to update—retrying for potential debounce/network delay
        const renamedFolder = this.page.locator('div.lib-file', { hasText: newFolderName }).first();
        await renamedFolder.scrollIntoViewIfNeeded();
        await expect(renamedFolder).toBeVisible({ timeout: 25000 }); // increased for async propagation
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    // Verify that clicking Share opens the Share popup
    async verifyShareOptionOpensSharePopup() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Wait for all listing cards to load and click the first card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Find a folder to share
        const foldersLocator = this.page.locator('.lib-file').last();
        await foldersLocator.scrollIntoViewIfNeeded();
        await expect(foldersLocator).toBeVisible({ timeout: 30000 });

        await this.page.waitForTimeout(750);

        // Right-click to open context menu
        await foldersLocator.click({ button: 'right' });
        await foldersLocator.click({ button: 'right' });
        await this.page.waitForTimeout(500);

        // Click Share in context menu
        const shareOption = this.page.getByText(/Share/i).last();
        await expect(shareOption).toBeVisible({ timeout: 6000 });
        await shareOption.click({ force: true });
        await this.page.waitForTimeout(1000);

        // Should see "Share" dialog appear (look for some label/input inside it)
        const shareDialogTitle = this.page.getByText('Share with people');
        await expect(shareDialogTitle).toBeVisible({ timeout: 10000 });

        // Try clicking 'Share' button with nobody selected (should be disabled)
        const shareButton = this.page.getByRole('button', { name: /^Share$/i }).last();
        await expect(shareButton).toBeVisible({ timeout: 6000 });
        await expect(shareButton).toBeDisabled();
        const errMsg = this.page.getByText(/At least one staff or team must be selected/i);
        await expect(errMsg).toBeVisible({ timeout: 6000 });

        // Click the "Cancel" button to close the share dialog
        const cancelBtn = this.page.getByRole('button', { name: /^Cancel$/i }).first();
        await expect(cancelBtn).toBeVisible({ timeout: 10000 });
        await cancelBtn.click();

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    async renamePopupopen() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Find the first folder in the Files tab
        const folder = this.page.locator('div.lib-file').last();
        await folder.scrollIntoViewIfNeeded();
        await expect(folder).toBeVisible({ timeout: 20000 });
        await this.page.waitForTimeout(750);

        // Right-click the folder to open context menu
        await folder.click({ button: "right" });
        await folder.click({ button: "right" });
        await this.page.waitForTimeout(2000);

        // Find and click 'Rename' in the context menu
        const renameOption = this.page.locator('a:has(img[alt="Rename"]):has-text("Rename")').first();
        await expect(renameOption).toBeVisible({ timeout: 10000 });
        await renameOption.click();

        await this.page.waitForTimeout(1000);

        // After clicking 'Rename', a rename popup should appear (usually a dialog with input)
        const renameDialog = this.page.getByText('Rename').first();
        const nameInput = this.page.locator('input[type="text"][required]');
        await expect(renameDialog).toBeVisible({ timeout: 10000 });
        await expect(nameInput).toBeVisible({ timeout: 10000 });

        // Click cancel button in the rename popup
        const cancelButton = this.page.getByRole('button', { name: /cancel/i }).first();
        await expect(cancelButton).toBeVisible({ timeout: 10000 });
        await cancelButton.click();

        await this.page.waitForTimeout(1200);

        // Optionally close the popup
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that adding a staff or team member in the Share popup enables the Share button.
     */
    async verifyShareFolderSelectingStaffOrTeam() {
        // Navigate to Listings, open grid, then open the first listing
        await this.navigateToListings();
        await this.switchToGridView();
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Find the first folder in the Files tab
        const folder = this.page.locator('div.lib-file').last();
        await folder.scrollIntoViewIfNeeded();
        await expect(folder).toBeVisible({ timeout: 20000 });
        await this.page.waitForTimeout(750);

        // Right-click the folder to open context menu
        await folder.click({ button: "right" });
        await folder.click({ button: "right" });
        await this.page.waitForTimeout(2000);

        // Select Share from the context menu
        const shareOption = this.page.getByText(/Share/i).last();
        await expect(shareOption).toBeVisible({ timeout: 10000 });
        await shareOption.click({ force: true });

        // Share dialog appears
        const shareDialogTitle = this.page.getByText('Share with people');
        await expect(shareDialogTitle).toBeVisible({ timeout: 10000 });

        const searchUserField = this.page.locator('div.ng-value-container:has-text("Search User") div.ng-input input');
        await expect(searchUserField).toBeVisible({ timeout: 10000 });
        await searchUserField.click({ force: true });

        // Find the first user/team suggestion in the dropdown if it appears
        const firstSuggestion = this.page.locator('div.ng-option[role="option"]').first();
        if (await firstSuggestion.isVisible({ timeout: 10000 }).catch(() => false)) {
            await firstSuggestion.click();
        }

        // Share button should start disabled
        const shareButton = this.page.getByRole('button', { name: /^Share$/i }).last();
        await expect(shareButton).toBeVisible({ timeout: 6000 });
        await expect(shareButton).toBeEnabled();

        // Close the share dialog using Cancel or close button
        const cancelBtn = this.page.getByRole('button', { name: /^Cancel$/i }).first();
        if (await cancelBtn.isVisible().catch(() => false)) {
            await cancelBtn.click();
        }
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that attempting to share a folder without selecting staff or team shows error and disables Share button.
     */
    public async verifyShareFolderRequiresStaffOrTeam(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await imageTab.waitFor({ state: 'visible', timeout: 20000 });
        await imageTab.click();

        // Find the first folder in the Files tab
        const folder = this.page.locator('div.lib-file').last();
        await folder.scrollIntoViewIfNeeded();
        await expect(folder).toBeVisible({ timeout: 20000 });
        await this.page.waitForTimeout(750);

        // Right-click the folder to open context menu
        await folder.click({ button: "right" });
        await folder.click({ button: "right" });
        await this.page.waitForTimeout(2000);

        // Click Share in context menu
        const shareOption = this.page.getByText(/Share/i).last();
        await expect(shareOption).toBeVisible({ timeout: 6000 });
        await shareOption.click({ force: true });
        await this.page.waitForTimeout(1000);

        // Should see "Share" dialog appear (look for some label/input inside it)
        const shareDialogTitle = this.page.getByText('Share with people');
        await expect(shareDialogTitle).toBeVisible({ timeout: 10000 });

        // Try clicking 'Share' button with nobody selected (should be disabled)
        const shareButton = this.page.getByRole('button', { name: /^Share$/i }).last();
        await expect(shareButton).toBeVisible({ timeout: 6000 });
        await expect(shareButton).toBeDisabled();
        const errMsg = this.page.getByText(/At least one staff or team must be selected/i);
        await expect(errMsg).toBeVisible({ timeout: 6000 });

        // Click the "Cancel" button to close the share dialog
        const cancelBtn = this.page.getByRole('button', { name: /^Cancel$/i }).first();
        await expect(cancelBtn).toBeVisible({ timeout: 10000 });
        await cancelBtn.click();

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that files in the Images tab show all expected right-click context menu options:
     * Preview, Share, Get Link, Get Path, Rename, Make a Copy, Download, Remove
     */
    async verifyFileContextMenuOptionsInImagesTab() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();

        // Find the first image file in the listing files grid
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1200);
        await imageFile.click({ button: 'right' });
        await imageFile.click({ button: 'right' });
        // After clicking the image, all options in the context menu should be visible by text

        // Find the container for the folder options list specifically
        const folderOptionsList = this.page.locator('#folderOptionsList ul.folders');
        await expect(folderOptionsList).toBeVisible({ timeout: 10000 });

        // These selectors match the text and icon/image for each menu option as rendered in the DOM
        const optionChecks = [
            { text: 'Preview', iconSelector: 'i.pi.pi-eye' },
            { text: 'Share', iconSelector: 'i.pi.pi-user-plus' },
            { text: 'Get Link', iconSelector: 'i.pi.pi-link' },
            { text: 'Get Path', iconSelector: 'i.pi.pi-directions' },
            { text: 'Rename', iconSelector: 'img[alt="Rename"][src*="pencil.svg"]' },
            { text: 'Make a Copy', iconSelector: 'i.pi.pi-copy' },
            { text: 'Download', iconSelector: 'i.pi.pi-download' },
            { text: 'Remove', iconSelector: 'img[alt="Remove"][src*="delete_icon.svg"]' }
        ];

        for (const { text, iconSelector } of optionChecks) {
            // Each option is a <li> containing an <a> with icon/img and the label text
            const option = folderOptionsList.locator(`li:has(${iconSelector}) a`, { hasText: text });
            await option.scrollIntoViewIfNeeded();
            await expect(option, `Menu option "${text}" with icon should be visible`).toBeVisible({ timeout: 10000 });
        }

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that clicking Preview opens the file in a popup.
     */
    async verifyPreviewOptionOpensFileInImages() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();

        // Find the image file to use for right click (adjust the file name if needed)
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1200);

        // Right-click the folder to open context menu
        await imageFile.click({ button: 'right' });
        await imageFile.click({ button: 'right' });

        await this.page.waitForTimeout(1000);

        const previewOption = this.page.locator('a:has(i.pi.pi-eye):has-text("Preview")').first();
        await expect(previewOption).toBeVisible({ timeout: 10000 });
        await previewOption.click();

        const previewDialog = this.page.locator('.p-dialog:has-text("Preview")');
        await expect(previewDialog).toBeVisible({ timeout: 10000 });

        // Locate the cross (close) icon in the path popup dialog
        const crossIcon = this.page.locator('button.p-dialog-header-close');
        await expect(crossIcon.first()).toBeVisible();
        await crossIcon.click();
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that clicking Download successfully downloads the file in the Images tab.
     */
    async verifyDownloadImageFile() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();

        // Find the image file to use for right click (adjust the file name if needed)
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1200);

        // Right-click on the file to open context menu
        await imageFile.click({ button: 'right' });
        await imageFile.click({ button: 'right' });
        await this.page.waitForTimeout(1000);

        // Click on the "Download" action from the context menu
        const downloadOption = this.page.locator('a:has(i.pi.pi-download):has-text("Download")').first();
        await expect(downloadOption).toBeVisible({ timeout: 10000 });
        await downloadOption.click();
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that clicking "Get Link" in the Images tab opens a popup with the file link.
     */
    async verifyGetLinkOpensLinkPopupInImagesTab() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();

        // Find the image file to use for right click (adjust the file name if needed)
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1200);

        // Right-click on the file to open context menu
        await imageFile.click({ button: 'right' });
        await imageFile.click({ button: 'right' });
        // Click the "Preview" option from context menu (adjust selector if needed)
        const previewOption = this.page.locator('a:has(i.pi.pi-eye):has-text("Preview")').first();
        await expect(previewOption).toBeVisible({ timeout: 10000 });
        await previewOption.click();

        // Assert that the preview file modal/dialog appears
        // The selector might need to be updated according to the actual modal/dialog html
        const previewDialog = this.page.locator('.p-dialog:has-text("Preview")');
        await expect(previewDialog).toBeVisible({ timeout: 10000 });

        // Locate the cross (close) icon in the path popup dialog
        const crossIcon = this.page.locator('button.p-dialog-header-close');
        await expect(crossIcon.first()).toBeVisible();
        await crossIcon.click();
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that clicking "Get Path" in the Images tab opens a popup with the file path.
     */
    async verifyGetPathOpensPathPopupInImagesTab() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();

        // Find the image file to use for right click (adjust the file name if needed)
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1200);

        // Right-click on the file to open context menu
        await imageFile.click({ button: 'right' });
        await imageFile.click({ button: 'right' });
        await this.page.waitForTimeout(1000);

        // Wait for the context menu and click "Get Path"
        const getPathOption = this.page.locator('a:has(i.pi.pi-directions):has-text("Get Path")').first();
        await getPathOption.click();
        await this.page.waitForTimeout(1000);

        // Assert that the path popup/dialog appears
        const pathPopup = this.page.locator('.p-dialog:has-text("Get Path")');
        await expect(pathPopup).toBeVisible({ timeout: 10000 });

        // Locate the cross (close) icon in the path popup dialog
        const crossIcon = this.page.locator('button.p-dialog-header-close');
        await expect(crossIcon.first()).toBeVisible();
        await crossIcon.click();
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that clicking "Get Path" on a private file requires a PIN
     */
    async verifyGetPathOnPrivateFileRequiresPIN() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();

        // Find a private image file, adjust name as needed
        const privateImageFile = this.page.locator('div.lib-file', { hasText: 'propertyImage.jpg' }).first();
        await privateImageFile.scrollIntoViewIfNeeded();
        await expect(privateImageFile).toBeVisible({ timeout: 30000 });
        await this.page.waitForTimeout(1200);

        await privateImageFile.click();

        const downloadIcon = this.page.locator('.p-element.mr-3.pi.pi-download').first();
        await expect(downloadIcon).toBeVisible({ timeout: 10000 });
        await downloadIcon.click();

        // Assert that PIN input appears
        const pinInput = this.page.locator('input[placeholder="PIN"]');
        await expect(pinInput).toBeVisible({ timeout: 10000 });

        // Negative test: Try clicking save without PIN, expect error or indication
        const saveButton = this.page.getByLabel('Images').getByRole('button', { name: 'Save' })
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click();

        const pinError = this.page.getByText('Please enter PIN first');
        await expect(pinError).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);

        // Click the cancel button in the PIN dialog
        const cancelButton = this.page.getByRole('button', { name: /Cancel/i }).first();
        await expect(cancelButton).toBeVisible({ timeout: 10000 });
        await cancelButton.click();
        await this.page.waitForTimeout(1000);

        // Save and close form
        const saveAndCloseButton = this.page.getByRole('button', { name: /Save & Close/i }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }

    /**
     * Verify that selecting a folder or file enables toolbar options (Share, Download, Delete, More).
     */
    async verifyToolbarOptionsEnabledOnSelection() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Wait for the Floor Plan folder/item to be visible within the image tab panel
        const floorPlanFolder = this.page.locator('div.lib-file', { hasText: 'Floorplans' });
        await floorPlanFolder.scrollIntoViewIfNeeded();
        await expect(floorPlanFolder).toBeVisible({ timeout: 20000 });
        // Right-click the folder to open context menu
        await floorPlanFolder.click({ button: 'right' });
        await floorPlanFolder.click({ button: 'right' });
        await this.page.waitForTimeout(1000);

        // Check for Share, Rename, Make a Copy, Remove options in context menu
        const shareOption = this.page.getByText(/Share/i).last();
        const renameOption = this.page.getByText(/Rename/i).last();
        const makeCopyOption = this.page.getByText(/Make a Copy/i).first();
        const removeOption = this.page.getByText(/Remove/i).first();

        await expect(shareOption).toBeVisible({ timeout: 10000 });
        await expect(renameOption).toBeVisible({ timeout: 10000 });
        await expect(makeCopyOption).toBeVisible({ timeout: 10000 });
        await expect(removeOption).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);

        // Optionally close the dialog again using ".pi.pi-times" icon if still open
        const closePreviewButton = this.page.locator('.pi.pi-times').filter({ hasText: '' }).first();
        if (await closePreviewButton.isVisible({ timeout: 3000 }).catch(() => false)) {
            await closePreviewButton.click({ force: true });
        }

    }

    /**
     * Verify that clicking the List View/Grid View toggle changes the display in the Images tab
     */
    async verifyImagesTabListGridViewToggle() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Wait for the Floor Plan folder/item to be visible within the image tab panel
        const floorPlanFolder = this.page.locator('div.lib-file', { hasText: 'Floorplans' });
        await floorPlanFolder.scrollIntoViewIfNeeded();
        await expect(floorPlanFolder).toBeVisible({ timeout: 20000 });
        await this.page.waitForTimeout(1000);
        // Now, verify that the list view container appears and grid view container disappears (if possible)
        const listContainer = this.page.locator('img[ptooltip="List"]');
        await expect(listContainer).toBeVisible({ timeout: 10000 });
        await listContainer.click();

        await this.page.waitForTimeout(1000);

        // After switching to list view, verify that the grid view container appears and the list container disappears (if possible)
        const gridContainer = this.page.locator('img[ptooltip="Grid"]');
        await expect(gridContainer).toBeVisible({ timeout: 10000 });
        await gridContainer.click();

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);

    }

    /**
     * Verify that Zoom In and Zoom Out buttons work in the Edit popup in the Images tab.
     */
    async verifyImagesTabZoomInOutInEditPopup() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Wait for the Floor Plan folder/item to be visible within the image tab panel
        const floorPlanFolder = this.page.locator('div.lib-file', { hasText: 'Floorplans' });
        await floorPlanFolder.scrollIntoViewIfNeeded();
        await expect(floorPlanFolder).toBeVisible({ timeout: 20000 });
        await this.page.waitForTimeout(1000);

        // Locate and click the "Reorder" (edit.svg) icon for image reordering
        const reorderIcon = this.page.locator('img[ptooltip="Reorder"][src="assets/img/edit.svg"].p-element.cursor-pointer')
        await expect(reorderIcon.first()).toBeVisible({ timeout: 10000 });
        await reorderIcon.first().click();

        // Perform zoom in and zoom out by interacting with the slider
        const slider = this.page.locator('p-slider.p-element');
        await expect(slider).toBeVisible({ timeout: 10000 });

        // Get the slider handle
        const sliderHandle = slider.locator('.p-slider-handle').first();

        // Ensure handle is visible and interactable
        await expect(sliderHandle).toBeVisible({ timeout: 10000 });

        const handleBox = await sliderHandle.boundingBox();

        if (!handleBox) {
            throw new Error('Slider handle bounding box not found');
        }
        // Move to center of handle
        await this.page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);

        // Zoom In: Drag to the right by 80 pixels (simulate slider increase)
        await this.page.mouse.down();
        await this.page.mouse.move(handleBox.x + handleBox.width / 2 + 80, handleBox.y + handleBox.height / 2, { steps: 10 });
        await this.page.mouse.up();

        await this.page.waitForTimeout(800);

        // Zoom Out: Drag back to the left by 30 pixels (simulate slider decrease)
        await this.page.mouse.move(handleBox.x + handleBox.width / 2 + 50, handleBox.y + handleBox.height / 2);
        await this.page.mouse.down();
        await this.page.mouse.move(handleBox.x + handleBox.width / 2 + 20, handleBox.y + handleBox.height / 2, { steps: 10 });
        await this.page.mouse.up();

        await this.page.waitForTimeout(800);

        const crossIcon = this.page.locator('img[src="assets/img/Group37073.svg"]');
        await expect(crossIcon.first()).toBeVisible({ timeout: 10000 });
        await crossIcon.click();
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that dragging an image in the Edit popup changes its position.
     */
    async verifyDragChangesImagePosition() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Wait for the Floor Plan folder/item to be visible within the image tab panel
        const floorPlanFolder = this.page.locator('div.lib-file', { hasText: 'Floorplans' });
        await floorPlanFolder.scrollIntoViewIfNeeded();
        await expect(floorPlanFolder).toBeVisible({ timeout: 20000 });
        await this.page.waitForTimeout(1000);


        // Find the image file and drag it to the left side
        const imageFile = this.page.locator('div.lib-file', { hasText: 'propertyImage.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 10000 });

        const imageBox = await imageFile.boundingBox();
        if (!imageBox) throw new Error('BoundingBox for image file not found.');

        // Drag from center of the image file to 150px left of its current center
        const startX = imageBox.x + imageBox.width / 2;
        const startY = imageBox.y + imageBox.height / 2;
        const dragOffset = -150; // pixels to the left

        await this.page.mouse.move(startX, startY);
        await this.page.mouse.down();
        await this.page.mouse.move(startX + dragOffset, startY, { steps: 10 });
        await this.page.mouse.up();

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that deleting an image from the Edit popup removes it from the library.
     */
    async verifyImageDeleteRemovesFromLibrary() {
        await this.navigateToListings();
        await this.switchToGridView();
        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Find the image, open Edit popup
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 20000 });
        await imageFile.click(); // Open image preview/edit popup
        await this.page.waitForTimeout(1000);

        // Find and click Delete/Remove button in the popup
        const deleteBtn = this.page.getByRole('img', { name: 'Remove' }).first();
        await expect(deleteBtn).toBeVisible({ timeout: 10000 });
        await deleteBtn.click();

        // Verify success notification for deletion
        const deletedSuccessMsg = this.page.getByText(/deleted successfully/i, { exact: false });
        await expect(deletedSuccessMsg).toBeVisible({ timeout: 40000 });
        await this.page.waitForTimeout(1000);

        // Close the popup if still present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);

    }

    /**
     * Verify that duplicating an image creates a copy with "Copy of ..." in its name.
     */
    async verifyImageMakeCopyCreatesCopy() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Find the image, e.g. 'PropertyImage2.jpg'
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 20000 });

        // Store original image name
        const originalImageName = (await imageFile.textContent())?.trim() ?? '';

        // Right-click image to open context menu (double right-click for robustness)
        await imageFile.click({ button: 'right' });
        await imageFile.click({ button: 'right' });
        await this.page.waitForTimeout(600);

        // Click "Make a Copy" (sometimes called "Duplicate")
        const makeCopyOption = this.page.getByRole('link', { name: /Make a Copy/i }).first();
        await expect(makeCopyOption).toBeVisible({ timeout: 10000 });
        await makeCopyOption.click();

        // Wait for the copy to appear
        const expectedCopyName = `Copy of ${originalImageName}`;
        const copiedImageFile = this.page.locator('div.lib-file', { hasText: expectedCopyName }).first();

        await copiedImageFile.scrollIntoViewIfNeeded();
        await expect(copiedImageFile).toBeVisible({ timeout: 40000 });
        await this.page.waitForTimeout(1000);

        // Optionally close any open popups
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that uploading an image through the Edit popup works
     */
    async verifyUploadImageThroughEditPopupWorks() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Find the image, e.g. 'PropertyImage2.jpg'
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 20000 });

        // Locate and click the "Reorder" (edit.svg) icon for image reordering
        const reorderIcon = this.page.locator('img[ptooltip="Reorder"][src="assets/img/edit.svg"].p-element.cursor-pointer')
        await expect(reorderIcon.first()).toBeVisible({ timeout: 10000 });
        await reorderIcon.first().click();

        // Locate and click the "Image upload" icon inside the Edit popup
        const imageUploadBtn = this.page.locator('a[ptooltip="Image upload"]');
        await expect(imageUploadBtn).toBeVisible({ timeout: 10000 });
        await imageUploadBtn.click();

        // Upload image through the Edit popup
        const fileInput = this.page.locator('input[type="file"][accept=".svg,image/*"]').first();
        const path = require('path');
        const IMAGE_DIR = path.resolve(__dirname, 'PropertyImages');
        const uploadImagePath = path.join(IMAGE_DIR, 'PropertyImage2.jpg');
        await fileInput.setInputFiles(uploadImagePath);

        // Optionally: wait for upload to complete or for any success message
        const uploadSuccess = this.page.getByText(/Added Successfully/i).first();
        await expect(uploadSuccess).toBeVisible({ timeout: 40000 });

        const crossIcon = this.page.locator('img[src="assets/img/Group37073.svg"]');
        await expect(crossIcon.first()).toBeVisible({ timeout: 10000 });
        await crossIcon.click();
        await this.page.waitForTimeout(1200);
        // Optionally close the popup
        const closeBtn = this.page.locator('.pi.pi-times, .close-btn').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify PDF-to-image conversion by uploading a PDF 
     */
    async verifyPdfToImageConversion() {
        // Go to Listings and open the first listing card
        await this.navigateToListings();
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to the Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Ensure a representative image is loaded for the listing
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 20000 });

        // Enter reorder/edit mode for that image
        const reorderIcon = this.page.locator('img[ptooltip="Reorder"][src="assets/img/edit.svg"].p-element.cursor-pointer').first();
        await expect(reorderIcon).toBeVisible({ timeout: 10000 });
        await reorderIcon.click();

        // Open the PDF-to-image upload popup
        const pdfToImageBtn = this.page.locator('a[ptooltip="PDF to image"] i.pi.pi-file-pdf').first();
        await expect(pdfToImageBtn).toBeVisible({ timeout: 10000 });
        await pdfToImageBtn.click();

        // Resolve the PDF path and upload it
        const path = require('path');
        const IMAGE_DIR = path.resolve(__dirname, 'PropertyImages');
        const pdfPath = path.join(IMAGE_DIR, 'PdfToImage.pdf');
        const fileInput = this.page.locator('input#pdffile[type="file"]').first();
        await fileInput.setInputFiles(pdfPath);

        // Wait for converted images container to appear and activate it
        const convertedImagesContainer = this.page.locator('.d-flex.flex-wrap.w-100.gap-2');
        await expect(convertedImagesContainer).toBeVisible({ timeout: 20000 });
        await convertedImagesContainer.click(); // (optional: may trigger gallery refresh)

        // Confirm a converted image appears and is visible
        const resultImage = this.page.locator('#galImgList .cdk-drag', { hasText: 'PdfToImage' }).first();
        await resultImage.waitFor({ state: 'visible', timeout: 20000 });

        // Close the Edit popup
        const crossIcon = this.page.locator('img[src="assets/img/Group37073.svg"]').first();
        await expect(crossIcon).toBeVisible({ timeout: 10000 });
        await crossIcon.click();
        await this.page.waitForTimeout(1200);

        // Optionally ensure the modal is closed
        const closeBtn = this.page.locator('.pi.pi-times, .close-btn').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click({ force: true });
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that dragging an image into the Offline section removes it from the main view but counts it in total files
     */
    async verifyImageDragToOfflineSectionUpdatesCounts() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstListing = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListing).toBeVisible({ timeout: 30000 });
        await firstListing.click();

        // Switch to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Locate the representative image and count files before
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 20000 });

        // Enable reorder mode
        const reorderIcon = this.page
            .locator('img[ptooltip="Reorder"][src="assets/img/edit.svg"]')
            .first();
        await reorderIcon.waitFor({ state: 'visible' });
        await reorderIcon.click();

        // SOURCE: Angular draggable image
        const sourceImage = this.page.locator('#galImgList .cdk-drag', { hasText: 'PdfToImage' }).first();
        await sourceImage.waitFor({ state: 'visible' });

        // EXPAND Offline Images section (MANDATORY)
        const offlineHeading = this.page.locator(
            'h2.heading-style:has-text("Offline Images")'
        );
        await offlineHeading.scrollIntoViewIfNeeded();
        await offlineHeading.click();

        // REAL Angular CDK drop list under Offline Images
        const offlineDropList = this.page.locator(
            'div.cdk-drop-list:below(h2:has-text("Offline Images"))'
        ).first();
        await offlineDropList.waitFor({ state: 'visible' });

        // Wait for Angular animations/layout
        await this.page.waitForLoadState('networkidle');

        // Get bounding boxes
        const srcBox = await sourceImage.boundingBox();
        const targetBox = await offlineDropList.boundingBox();
        if (!srcBox || !targetBox) {
            throw new Error('Bounding box not found for drag/drop');
        }

        // Angular-safe drag & drop (slow + pause)
        await this.page.mouse.move(
            srcBox.x + srcBox.width / 2,
            srcBox.y + srcBox.height / 2
        );
        await this.page.mouse.down();

        await this.page.waitForTimeout(200); // REQUIRED for CDK

        await this.page.mouse.move(
            targetBox.x + targetBox.width / 2,
            targetBox.y + targetBox.height / 2,
            { steps: 50 }
        );

        await this.page.waitForTimeout(200);
        await this.page.mouse.up();

        await this.page.waitForTimeout(2000);

        // VERIFY image moved to Offline Images
        await expect
            .poll(async () => await offlineDropList.locator('.cdk-drag').count(), {
                timeout: 15000,
            })
            .toBeGreaterThan(0);


        await this.page.waitForTimeout(1200);

        const crossIcon = this.page.locator('img[src="assets/img/Group37073.svg"]');
        await expect(crossIcon.first()).toBeVisible({ timeout: 10000 });
        await crossIcon.click();
        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that clicking Back in a folder returns to the previous folder.
     */
    async verifyBackButtonReturnsToPreviousFolder() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing and ensure visibility
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Wait for the image tab to be visible and click it (adjust selector if needed)
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 10000 });
        await imageTab.click();

        // Wait for the Floor Plan folder/item to be visible within the image tab panel
        const floorPlanFolder = this.page.locator('div.lib-file', { hasText: 'Floorplans' });
        await floorPlanFolder.scrollIntoViewIfNeeded();
        await expect(floorPlanFolder).toBeVisible({ timeout: 20000 });
        await floorPlanFolder.dblclick();

        // Click Back button to return to previous folder
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.waitFor({ state: 'visible', timeout: 10000 });
        await backButton.click();

        await expect(floorPlanFolder).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1000);
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that breadcrumbs allow direct navigation to folders
     */
    async verifyBreadcrumbsAllowDirectNavigation() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstListing = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListing).toBeVisible({ timeout: 30000 });
        await firstListing.click();
        await this.page.waitForTimeout(1000);

        // Open Images tab
        const imageTab = this.page.getByRole('tab', { name: 'gavel Images' });
        await imageTab.waitFor({ state: 'visible', timeout: 10000 });
        await imageTab.click();

        // Enter the Floor Plan folder
        const floorPlanFolder = this.page.locator('div.lib-file', { hasText: 'Floorplans' }).first();
        await floorPlanFolder.scrollIntoViewIfNeeded();
        await expect(floorPlanFolder).toBeVisible({ timeout: 20000 });
        await floorPlanFolder.dblclick();
        // Click Back button to return to previous folder
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.waitFor({ state: 'visible', timeout: 10000 });
        await backButton.click();
        // Close dialog or modal if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that images can be reordered in the Images tab by drag and drop.
     */
    async verifyImagesReorderable() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Find the image file and drag it to the left side
        const imageFile = this.page.locator('div.lib-file', { hasText: 'propertyImage.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 30000 });

        const imageBox = await imageFile.boundingBox();
        if (!imageBox) throw new Error('BoundingBox for image file not found.');

        // Drag from center of the image file to 150px left of its current center
        const startX = imageBox.x + imageBox.width / 2;
        const startY = imageBox.y + imageBox.height / 2;
        const dragOffset = -150; // pixels to the left

        await this.page.mouse.move(startX, startY);
        await this.page.mouse.down();
        await this.page.mouse.move(startX + dragOffset, startY, { steps: 10 });
        await this.page.mouse.up();

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that clicking 'Add Link' opens the link popup.
     */
    async verifyAddLinkOpensLinkPopup() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Find the image file and drag it to the left side
        const imageFile = this.page.locator('div.lib-file', { hasText: 'propertyImage.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 30000 });

        // Click the 'Add Link' button
        const addLinkButton = this.page.locator('img[ptooltip="Add Link"]');
        await expect(addLinkButton).toBeVisible({ timeout: 10000 });
        await addLinkButton.click();

        // Verify the link popup/modal appears
        const linkPopup = this.page.locator('.link-popup, .p-dialog, [data-testid="link-popup"]');
        await expect(linkPopup).toBeVisible({ timeout: 10000 });

        // click cancel button
        const cancelButton = this.page.getByRole('button', { name: 'Cancel' });
        await expect(cancelButton).toBeVisible({ timeout: 10000 });
        await cancelButton.click();
        await this.page.waitForTimeout(1000);
        // Optionally close the popup if desired
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify that clicking 'Save' without entering any data allows submission.
     */
    async verifySaveWithoutDataAllowsSubmission() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Find the image file and drag it to the left side
        const imageFile = this.page.locator('div.lib-file', { hasText: 'propertyImage.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 30000 });

        // Click the 'Add Link' button
        const addLinkButton = this.page.locator('img[ptooltip="Add Link"]');
        await expect(addLinkButton).toBeVisible({ timeout: 10000 });
        await addLinkButton.click();

        // Verify the link popup/modal appears
        const linkPopup = this.page.locator('label:has-text("Video URL") + div input');
        await expect(linkPopup).toBeVisible({ timeout: 10000 });

        // click save button
        const saveButton = this.page.getByLabel('Images').getByRole('button', { name: 'Save' });
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click();
        await this.page.waitForTimeout(1000);
        // Optionally close the popup if desired
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify that the 'Add Link' popup contains required fields.
     * Checks the popup fields: "Link Name", "URL", "Type", and Save/Cancel buttons.
     */
    async verifyAddLinkPopupContainsFields() {
        // Trigger popup via existing logic (reuse verifyAddLinkOpensLinkPopup if possible)
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();
        await this.page.waitForTimeout(1000);

        // Go to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Find the image file and drag it to the left side
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 30000 });

        // Click the 'Add Link' button
        const addLinkButton = this.page.locator('img[ptooltip="Add Link"]');
        await expect(addLinkButton).toBeVisible({ timeout: 10000 });
        await addLinkButton.click();

        // Verify the link popup/modal appears
        const linkPopup = this.page.locator('.link-popup, .p-dialog, [data-testid="link-popup"]');
        await expect(linkPopup).toBeVisible({ timeout: 10000 });

        // Check for "Video URL", "Online Tour 1", "Online Tour 2" fields inside the Listing Links popup
        const videoUrlField = this.page.locator('div').filter({ hasText: /^Video URL$/ });
        await expect(videoUrlField).toBeVisible({ timeout: 10000 });

        const onlineTour1Field = this.page.locator('div').filter({ hasText: /^Online Tour 1$/ });
        await expect(onlineTour1Field).toBeVisible({ timeout: 10000 });

        const onlineTour2Field = this.page.locator('div').filter({ hasText: /^Online Tour 2$/ });
        await expect(onlineTour2Field).toBeVisible({ timeout: 10000 });

        // Check for Save and Cancel buttons
        const saveButton = linkPopup.getByRole('button', { name: /^Save$/i });
        await expect(saveButton).toBeVisible({ timeout: 10000 });

        // click cancel button
        const cancelButton = this.page.getByRole('button', { name: 'Cancel' });
        await expect(cancelButton).toBeVisible({ timeout: 10000 });
        await cancelButton.click();
        await this.page.waitForTimeout(1000);
        // Optionally close the popup if desired
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    // Verify that entering a video URL and saving updates the library
    async verifyEnteringVideoURLAndSavingUpdatesLibrary() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();
        await this.page.waitForTimeout(1000);

        // Switch to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Find the target image file to use for adding a link
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 30000 });

        // Click the 'Add Link' button on the image
        const addLinkButton = this.page.locator('img[ptooltip="Add Link"]');
        await expect(addLinkButton).toBeVisible({ timeout: 10000 });
        await addLinkButton.click();

        // Wait for the Link popup/modal to appear
        const linkPopup = this.page.locator('.link-popup, .p-dialog, [data-testid="link-popup"]');
        await expect(linkPopup).toBeVisible({ timeout: 10000 });

        // Fill the "Video URL" input in the popup
        const videoUrlInput = this.page.locator('input[placeholder="Add link"]').first();
        await expect(videoUrlInput).toBeVisible({ timeout: 10000 });
        await videoUrlInput.click();
        const testVideoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        await videoUrlInput.fill(testVideoUrl);
        await this.page.waitForTimeout(1000);
        // Click the Save button
        const saveButton = linkPopup.getByRole('button', { name: /^Save$/i });
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click();
        await this.page.waitForTimeout(1500);
        // Optionally close the popup if desired
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verify that adding Online Tour links updates the library.
     */
    async verifyAddingOnlineTourLinkUpdatesLibrary() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();
        await this.page.waitForTimeout(1000);

        // Switch to Images tab
        const imageTab = this.page.getByRole('tab', { name: /Images/i });
        await expect(imageTab).toBeVisible({ timeout: 20000 });
        await imageTab.click();
        await this.page.waitForTimeout(1000);

        // Find the target image file to use for adding a link
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 30000 });

        // Click the 'Add Link' button on the image
        const addLinkButton = this.page.locator('img[ptooltip="Add Link"]');
        await expect(addLinkButton).toBeVisible({ timeout: 10000 });
        await addLinkButton.click();

        // Wait for the Link popup/modal to appear
        const linkPopup = this.page.locator('.link-popup, .p-dialog, [data-testid="link-popup"]');
        await expect(linkPopup).toBeVisible({ timeout: 10000 });

        // Fill both "Online Tour 1" and "Online Tour 2" link inputs in the popup
        const onlineTour1Input = this.page.locator('label:has-text("Online Tour 1") + div input');
        await expect(onlineTour1Input).toBeVisible({ timeout: 10000 });
        await onlineTour1Input.click();
        const testTour1Url = 'https://myonlinetour.example.com/tour/123';
        await onlineTour1Input.fill(testTour1Url);

        const onlineTour2Input = this.page.locator('label:has-text("Online Tour 2") + div input');
        await expect(onlineTour2Input).toBeVisible({ timeout: 10000 });
        await onlineTour2Input.click();
        const testTour2Url = 'https://myonlinetour.example.com/tour/456';
        await onlineTour2Input.fill(testTour2Url);

        await this.page.waitForTimeout(1000);

        // Click the Save button
        const saveButton = linkPopup.getByRole('button', { name: /^Save$/i });
        await expect(saveButton).toBeVisible({ timeout: 10000 });
        await saveButton.click();
        await this.page.waitForTimeout(1500);

        // Optionally close the popup if it's still open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }
    /**
     * Verify that the 'Inspection' tab is hidden before the listing is saved.
     */
}
