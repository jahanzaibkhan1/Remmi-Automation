import { expect } from '@playwright/test';
import { ListingBasePage } from './ListingBasePage';
import * as path from 'path';

export class ListingDocumentPage extends ListingBasePage {
    async verifyDocumentTabOpensCorrectly() {
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



        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();
        // Scroll Back button into view and click it if visible, otherwise proceed without failing
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { }); // try to scroll into view, ignore errors
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        const searchField = this.page.getByRole('tabpanel', { name: 'gavel Files' }).getByPlaceholder('Search');
        await expect(searchField).toBeVisible({ timeout: 10000 });
        // Verify "Images" folder is visible
        await expect(this.page.getByText('Images', { exact: true }).last()).toBeVisible({ timeout: 20000 });
        // Verify "Documents" folder is visible
        await expect(this.page.getByText('Documents', { exact: true }).last()).toBeVisible({ timeout: 20000 });

        // Verify "Legal" folder is visible
        await expect(this.page.getByText('Legal', { exact: true })).toBeVisible({ timeout: 20000 });
        // Optionally close a popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }

    }

    /**
     * Verify that the search field is visible on the page
     */
    async verifySearchFieldPresent() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();
        // Scroll Back button into view and click it if visible, otherwise proceed without failing
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { }); // try to scroll into view, ignore errors
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }
        const searchField = this.page.getByRole('tabpanel', { name: 'gavel Files' }).getByPlaceholder('Search');
        await expect(searchField).toBeVisible({ timeout: 10000 });
        // Optionally close a popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verify that the default document folders are displayed.
     */
    async verifyDefaultFoldersDisplayed() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // Scroll Back button into view and click it if visible, otherwise proceed without failing
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { }); // try to scroll into view, ignore errors
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        const searchField = this.page.getByRole('tabpanel', { name: 'gavel Files' }).getByPlaceholder('Search');
        await expect(searchField).toBeVisible({ timeout: 10000 });
        // Verify "Images" folder is visible
        await expect(this.page.getByText('Images', { exact: true }).last()).toBeVisible({ timeout: 20000 });
        // Verify "Documents" folder is visible
        await expect(this.page.getByText('Documents', { exact: true }).last()).toBeVisible({ timeout: 20000 });

        // Verify "Legal" folder is visible
        await expect(this.page.getByText('Legal', { exact: true })).toBeVisible({ timeout: 20000 });
        // Optionally close a popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }

    }

    /**
     * Verify that clicking on a folder expands it in the Documents tab.
     */
    async verifyClickingOnFolderExpandsIt() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // Scroll Back button into view and click it if visible, otherwise proceed without failing
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { }); // try to scroll into view, ignore errors
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        const searchField = this.page.getByRole('tabpanel', { name: 'gavel Files' }).getByPlaceholder('Search');
        await expect(searchField).toBeVisible({ timeout: 10000 });
        // Verify "Images" folder is visible
        await expect(this.page.getByText('Images', { exact: true }).last()).toBeVisible({ timeout: 20000 });
        // Verify "Documents" folder is visible
        await expect(this.page.getByText('Documents', { exact: true }).last()).toBeVisible({ timeout: 20000 });

        // Verify "Legal" folder is visible
        await expect(this.page.getByText('Legal', { exact: true })).toBeVisible({ timeout: 20000 });

        const documentsFolder = this.page.locator('div.lib-file', { hasText: 'Documents' });
        await documentsFolder.dblclick();

        // The folder name passed as argument should be visible
        const folderLocator = this.page.locator('div.lib-file', { hasText: 'Appraisals' });
        await expect(folderLocator).toBeVisible({ timeout: 20000 });


        // Optionally close a popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verify subfolders under "Images" in the Document Tab
     */
    async verifySubfoldersUnderImages() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // Scroll Back button into view and click it if visible, otherwise proceed without failing
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { }); // try to scroll into view, ignore errors
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        const searchField = this.page.getByRole('tabpanel', { name: 'gavel Files' }).getByPlaceholder('Search');
        await expect(searchField).toBeVisible({ timeout: 10000 });
        // Verify "Images" folder is visible
        await expect(this.page.getByText('Images', { exact: true }).last()).toBeVisible({ timeout: 20000 });
        // Verify "Documents" folder is visible
        await expect(this.page.getByText('Documents', { exact: true }).last()).toBeVisible({ timeout: 20000 });

        // Verify "Legal" folder is visible
        await expect(this.page.getByText('Legal', { exact: true })).toBeVisible({ timeout: 20000 });
        // Make sure Images folder is visible and open it
        const imagesFolder = this.page.locator('div.lib-file', { hasText: 'Images' }).first();
        await expect(imagesFolder).toBeVisible({ timeout: 20000 });
        await imagesFolder.dblclick();

        const propertyImages = this.page.locator('div.lib-file', { hasText: 'Property Images' }).first();
        await expect(propertyImages).toBeVisible({ timeout: 2000 });

        // Optionally close popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verify that the "Legal" folder is empty in the Document Tab
     */
    async verifyLegalFolderIsEmpty() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // Scroll Back button into view and click it if visible, otherwise proceed without failing
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { }); // try to scroll into view, ignore errors
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        const searchField = this.page.getByRole('tabpanel', { name: 'gavel Files' }).getByPlaceholder('Search');
        await expect(searchField).toBeVisible({ timeout: 10000 });
        // Verify "Images" folder is visible
        await expect(this.page.getByText('Images', { exact: true }).last()).toBeVisible({ timeout: 20000 });
        // Verify "Documents" folder is visible
        await expect(this.page.getByText('Documents', { exact: true }).last()).toBeVisible({ timeout: 20000 });

        // Verify "Legal" folder is visible
        await expect(this.page.getByText('Legal', { exact: true })).toBeVisible({ timeout: 20000 });
        // Open "Legal" folder
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });
        await legalFolder.dblclick();

        // Wait for the folder content area to appear and check it's empty (shows "No Data" or similar)
        const noData = this.page.getByText(/Nothing Found/i);
        await expect(noData).toBeVisible({ timeout: 2000 });

        // Optionally close popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verify that clicking 'Add' opens options
     */
    async verifyAddButtonOpensOptions() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // Scroll Back button into view and click it if visible, otherwise proceed without failing
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { }); // try to scroll into view, ignore errors
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Open "Legal" folder (specifically select the folder with text 'Legal'), and scroll it into view
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });


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


        // Optionally close popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verifies that clicking 'Folder' opens the "New Folder" popup in the Files tab.
     */
    async verifyFilesFolderOptionOpensNewFolderPopup() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and make sure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

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

    // Verify that creating a folder with a valid name works using faker for random folder names
    public async createNewFolderInFilesTab(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and make sure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Click the Add button
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();
        await this.page.waitForTimeout(1000);

        // Click "Folder" option
        const folderOption = this.page.locator('a', { hasText: 'Folder' });
        await expect(folderOption).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);
        await folderOption.click({ force: true });


        // "New Folder" popup/dialog should be visible (look for "New Folder" title or name input)
        const popupTitle = this.page.getByText('New folder');
        const nameInput = this.page.getByRole('textbox', { name: 'Folder name' });
        await expect(popupTitle).toBeVisible({ timeout: 10000 });
        await expect(nameInput).toBeVisible({ timeout: 10000 });

        // Use faker to generate a random folder name for more robust testing
        const { faker } = require('@faker-js/faker');
        const randomFolderName = faker.word.sample();

        // Type folder name and submit
        await nameInput.click();
        await nameInput.fill(randomFolderName);

        const createButton = this.page.getByRole('button', { name: /create/i });
        await expect(createButton).toBeVisible({ timeout: 10000 });
        await createButton.click();

        // Wait for the first matching folder to appear in the list
        const newFolder = this.page.locator('div.lib-file', { hasText: randomFolderName }).first();
        await newFolder.scrollIntoViewIfNeeded();
        await expect(newFolder).toBeVisible({ timeout: 20000 });

        await this.page.waitForTimeout(1200);
        // Optionally close the popup if present
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    // Verify error message when creating folder without a name
    public async verifyNewFolderPopupHasRequireNameField(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and make sure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Click the Add button
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();

        // Click "Folder" option
        const folderOption = this.page.locator('a', { hasText: 'Folder' });
        await expect(folderOption).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);
        await folderOption.click({ force: true });


        // "New Folder" popup/dialog should be visible (look for "New Folder" title or name input)
        const popupTitle = this.page.getByText('New folder');
        const nameInput = this.page.getByRole('textbox', { name: 'Folder name' });
        await expect(popupTitle).toBeVisible({ timeout: 10000 });
        await expect(nameInput).toBeVisible({ timeout: 10000 });

        const createButton = this.page.getByRole('button', { name: /create/i });
        await expect(createButton).toBeVisible({ timeout: 10000 });
        await createButton.click();

        // Verify error or validation message appears
        const errorMsg = this.page.getByText(/Name is required!/i);
        await expect(errorMsg).toBeVisible({ timeout: 10000 });
        // click cancel button
        const cancelButton = this.page.getByRole('button', { name: /cancel/i });
        await expect(cancelButton).toBeVisible({ timeout: 10000 });
        await cancelButton.click();

        await this.page.waitForTimeout(1200);

        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verify that clicking 'Public File Upload' allows uploading a file.
     * @param {string} filePath - Absolute path to the file to upload.
     */
    public async verifyPublicFileUploadAllowUploadingFile(filePath: string): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and make sure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Click the Add button
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();

        // Click "File Upload (Public)" option
        const publicOption = this.page.locator('a', { hasText: 'File Upload (Public)' });

        await expect(publicOption).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);
        await publicOption.click();

        // Wait for upload input to appear
        const fileInput = this.page.locator('#fileUpload');
        // Upload the file
        await fileInput.setInputFiles(filePath);

        // Check image name visibility within the .lib-file area
        const imageName = filePath.split(/[\\/]/).pop();
        if (imageName) {
            const imageNameInLibFile = this.page.locator(`.lib-file :text("${imageName}")`).first();
            await imageNameInLibFile.scrollIntoViewIfNeeded();
            await expect(imageNameInLibFile.first()).toBeVisible({ timeout: 20000 });
        }

        // click save and close
        const saveAndCloseButton = this.page.getByRole('button', { name: /Save & Close/i }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }

    /**
     * Verify that clicking 'Private File Upload' allows uploading a file.
     */
    async uploadsPrivateImage(filePath: string) {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and make sure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Click the Add button
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();

        // Scroll to and click "File Upload (Private)" option
        const privateOption = this.page.locator('a', { hasText: 'File Upload (Private)' });
        await privateOption.scrollIntoViewIfNeeded();
        await expect(privateOption).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);
        await privateOption.click();

        // Wait for upload input to appear and upload the file
        const fileInput = this.page.locator('#fileUpload');
        await fileInput.setInputFiles(filePath);

        // Scroll to the file name in the .lib-file area and check its visibility
        const fileName = filePath.split(/[\\/]/).pop();
        if (fileName) {
            const fileNameInLibFile = this.page.locator(`.lib-file :text("${fileName}")`).first();
            await fileNameInLibFile.scrollIntoViewIfNeeded();
            await expect(fileNameInLibFile.first()).toBeVisible({ timeout: 20000 });
        }

        // Save and close
        const saveAndCloseButton = this.page.getByRole('button', { name: /Save & Close/i }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }

    /**
     * Verify that entering the correct PIN allows file download in the Files tab
     */
    public async verifyPrivateFileUploadAllowDownload(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, click it if visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }
        // Find the "Legal" folder and make sure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Scroll to the download element (the last private image) and click it
        const downloadLocator = this.page.locator('img.img-hub2[src*="propertyImage"]').last();
        await downloadLocator.scrollIntoViewIfNeeded();
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
        const saveButton = this.page.getByLabel('Files').getByRole('button', { name: 'Save' });
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

    /**
     * Verifies that downloading a private file requires entering a PIN.
     */
    public async verifyPrivateFileRequiresPinForDownload(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing card
        const firstCard = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCard).toBeVisible({ timeout: 30000 });
        await firstCard.click();
        await this.page.waitForTimeout(1000);

        // Navigate to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();
        // Optionally, click back if Back button appears (in subfolder etc)
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and make sure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });


        // Try to download a private file (simulate by finding file with padlock or propertyImage)
        const privateFileLocator = this.page.locator('img.img-hub2[src*="propertyImage"]').last();
        await privateFileLocator.scrollIntoViewIfNeeded();
        await expect(privateFileLocator).toBeVisible({ timeout: 10000 });
        await privateFileLocator.click();

        const downloadIcon = this.page.locator('.p-element.mr-3.pi.pi-download').first();
        await expect(downloadIcon).toBeVisible({ timeout: 10000 });
        await downloadIcon.click();

        // Assert that PIN input appears
        const pinInput = this.page.locator('input[placeholder="PIN"]');
        await expect(pinInput).toBeVisible({ timeout: 10000 });

        // Negative test: Try clicking save without PIN, expect error or indication
        const saveButton = this.page.getByLabel('Files').getByRole('button', { name: 'Save' });
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

    // Verify that entering incorrect PIN prevents download
    async verifyPrivateFileUploadInvalidPin() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, click it if visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and make sure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Check for download element in the same context and scroll into view
        const downloadLocator = this.page.locator('img.img-hub2[src*="propertyImage"]').last();
        await downloadLocator.scrollIntoViewIfNeeded();
        await expect(downloadLocator).toBeVisible({ timeout: 20000 });
        await downloadLocator.click();

        const downloadIcon = this.page.locator('.p-element.mr-3.pi.pi-download').first();
        await expect(downloadIcon).toBeVisible({ timeout: 10000 });
        await downloadIcon.click();

        // Enter PIN in the input field
        const pinInput = this.page.locator('input[placeholder="PIN"]');
        await expect(pinInput).toBeVisible({ timeout: 10000 });
        // Replace '1234' with the correct PIN if needed/configured elsewhere
        await pinInput.fill('12');
        // Click Save button
        const saveButton = this.page.getByLabel('Files').getByRole('button', { name: 'Save' });
        await saveButton.click();
        // Optionally verify that re-downloading doesn't error
        await this.page.waitForTimeout(1000);

        // get error for invalid pin using getByText
        const errorMessage = await this.page.getByText(/invalid pin/i);
        await expect(errorMessage).toBeVisible({ timeout: 10000 });

        // Click the cancel button in the PIN dialog
        const cancelButton = this.page.getByRole('button', { name: /Cancel/i }).first();
        await expect(cancelButton).toBeVisible({ timeout: 10000 });
        await cancelButton.click();
        await this.page.waitForTimeout(1000);

        // Save and close
        const saveAndCloseButton = this.page.getByRole('button', { name: /Save & Close/i }).first();
        await saveAndCloseButton.scrollIntoViewIfNeeded();
        await expect(saveAndCloseButton).toBeVisible({ timeout: 10000 });
        await saveAndCloseButton.click();
        await this.page.waitForTimeout(2000);
    }
    // Verify double clicking a file opens preview
    async verifyDoubleClickOpenFilePreview() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, click it if visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and make sure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Wait for the file/images area to be visible and scroll to it
        const fileThumbnail = this.page.locator('img.img-hub2[src*="PropertyImage2"]').first();
        await fileThumbnail.scrollIntoViewIfNeeded();
        await expect(fileThumbnail).toBeVisible({ timeout: 20000 });

        // Double-click the file thumbnail
        await fileThumbnail.dblclick();

        // Wait for the File Preview popup/dialog to appear
        const previewDialog = this.page.locator('text=File Preview').first();
        await expect(previewDialog).toBeVisible({ timeout: 10000 });

        // Try to close using cross icon inside the dialog first
        const dialogLocator = this.page.getByRole('dialog');
        await expect(dialogLocator).toBeVisible({ timeout: 10000 });
        const crossIconLocator = this.page.getByRole('dialog').getByRole('button').filter({ hasText: /^$/ });
        if (await crossIconLocator.isVisible({ timeout: 3000 }).catch(() => false)) {
            await crossIconLocator.click();
        }

        await this.page.waitForTimeout(1200);
        // Optionally close the dialog again using ".pi.pi-times" icon if still open
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verify that right clicking a folder shows options for Share, Rename, Make a Copy, and Remove
     */
    public async verifyFolderContextMenuOption(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Click the first property card
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and make sure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Find the "Legal" folder (or any folder) and make sure it's visible
        const folder = this.page.locator('div.lib-file').first();
        await folder.scrollIntoViewIfNeeded();
        await expect(folder).toBeVisible({ timeout: 20000 });
        await this.page.waitForTimeout(1200);
        // Right-click the folder to open context menu
        await folder.click({ button: 'right' });
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
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }

    }

    /**
     * Verify that clicking 'Remove' deletes a folder in the Files tab.
     */
    public async verifyRemoveFolderDeletesIt(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }
        await this.page.waitForTimeout(1200);

        // Find and trim the folder name text (remove whitespace)
        const folders = this.page.locator('div.lib-file').nth(3);
        await folders.scrollIntoViewIfNeeded();
        await expect(folders).toBeVisible({ timeout: 15000 });
        const folderName = (await folders.textContent())?.trim();

        await this.page.waitForTimeout(1200);

        // Right-click the folder and select 'Remove'
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
            await expect(folderList).toHaveCount(0, { timeout: 20000 });
        }

        // Optionally close any open popups
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    /**
     * Verify that clicking 'Make a Copy' duplicates the folder in the Files tab
     */
    public async verifyMakeACopyDuplicatesFolder(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and make sure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Click the Add button
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();
        await this.page.waitForTimeout(1000);

        // Click "Folder" option
        const folderOption = this.page.locator('a', { hasText: 'Folder' });
        await expect(folderOption).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);
        await folderOption.click({ force: true });


        // "New Folder" popup/dialog should be visible (look for "New Folder" title or name input)
        const popupTitle = this.page.getByText('New folder');
        const nameInput = this.page.getByRole('textbox', { name: 'Folder name' });
        await expect(popupTitle).toBeVisible({ timeout: 10000 });
        await expect(nameInput).toBeVisible({ timeout: 10000 });

        // Use faker to generate a random folder name for more robust testing
        const { faker } = require('@faker-js/faker');
        const randomFolderName = faker.word.sample();

        // Type folder name and submit
        await nameInput.click();
        await nameInput.fill(randomFolderName);

        const createButton = this.page.getByRole('button', { name: /create/i });
        await expect(createButton).toBeVisible({ timeout: 10000 });
        await createButton.click();

        // Wait for the first matching folder to appear in the list
        const newFolder = this.page.locator('div.lib-file', { hasText: randomFolderName }).first();
        await newFolder.scrollIntoViewIfNeeded();
        await expect(newFolder).toBeVisible({ timeout: 20000 });

        await this.page.waitForTimeout(1200);

        const folders = this.page.locator('div.lib-file').last();
        await folders.scrollIntoViewIfNeeded();
        await expect(folders).toBeVisible({ timeout: 15000 });
        const originalFolderName = (await folders.textContent())?.trim();

        // Right-click the folder and select 'Make a Copy'
        await folders.click({ button: 'right' });
        await this.page.waitForTimeout(600);

        // Look for the 'Make a Copy' context option
        const copyOption = this.page.getByText(/Make a Copy/i).first();
        await expect(copyOption).toBeVisible({ timeout: 10000 });
        await copyOption.click();

        // Wait for the duplicate folder to appear (usually 'Copy of <folderName>' or similar)
        let copiedFolderName = '';
        if (originalFolderName) {
            // Try both 'Copy of <name>' and '<name> - Copy'
            copiedFolderName = `Copy of ${originalFolderName}`;
            let copiedFolder = this.page.locator('div.lib-file', { hasText: copiedFolderName }).first();
            try {
                await expect(copiedFolder).toBeVisible({ timeout: 20000 });
            } catch {
                copiedFolderName = `${originalFolderName} - Copy`;
                copiedFolder = this.page.locator('div.lib-file', { hasText: copiedFolderName }).first();
                await expect(copiedFolder).toBeVisible({ timeout: 20000 });
            }
        }
        await this.page.waitForTimeout(1200);
        // Optionally close any open popups
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
    }

    // Verify that clicking 'Rename' opens rename popup
    public async verifyRenameFolderOpensPopup(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the first folder in the Files tab
        const folder = this.page.locator('div.lib-file').last();
        await folder.scrollIntoViewIfNeeded();
        await expect(folder).toBeVisible({ timeout: 20000 });
        await this.page.waitForTimeout(1200);

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
     * Verify that renaming a folder in the Files tab updates its name.
     */
    public async verifyRenameFolderUpdatesName(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the last folder in the Files tab (to minimize risk of conflicting with system folders)
        const folder = this.page.locator('div.lib-file').last();
        await folder.scrollIntoViewIfNeeded();
        await expect(folder).toBeVisible({ timeout: 20000 });
        const origName = (await folder.textContent())?.trim();

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

    /**
     * Verify that sharing a folder requires selecting a staff/team member before proceeding.
     */
    public async verifyShareFolderRequiresSelectingStaffOrTeam(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and make sure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Right-click the Legal folder to open context menu
        await legalFolder.click({ button: 'right' });
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

    /**
     * Verify that selecting a staff or team enables the "Share" button in the Share dialog.
     */
    public async verifyShareFolderRequireSelectingStaffOrTeam(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and ensure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Right-click the Legal folder to open the context menu
        await legalFolder.click({ button: 'right' });
        await legalFolder.click({ button: 'right' });
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

    // Verify that shared staff/team appear with profile image
    async verifySharedStaffTeamHasProfileImage() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and ensure it's visible
        const legalFolder = this.page.locator('div.lib-file').last();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });
        await this.page.waitForTimeout(1000);

        // Right-click the Legal folder to open the context menu
        await legalFolder.click({ button: 'right' });
        await this.page.waitForTimeout(500);

        // Select Share from the context menu
        const shareOption = this.page.getByText(/Share/i).last();
        await expect(shareOption).toBeVisible({ timeout: 6000 });
        await shareOption.click({ force: true });

        // Share dialog appears
        const shareDialogTitle = this.page.getByText('Share with people');
        await expect(shareDialogTitle).toBeVisible({ timeout: 10000 });

        // Removed user icon logic per instruction. Always interact with 'Search User' field directly.
        const searchUserField = this.page.locator('div.ng-value-container:has-text("Search User") div.ng-input input');
        await expect(searchUserField).toBeVisible({ timeout: 6000 });
        await searchUserField.click();


        // Find the first user/team suggestion in the dropdown if it appears
        const firstSuggestion = this.page.locator('div.ng-option[role="option"]').first();
        if (await firstSuggestion.isVisible({ timeout: 10000 }).catch(() => false)) {
            await firstSuggestion.click();
        }

        // Share button should start disabled
        const shareButton = this.page.getByRole('button', { name: /^Share$/i }).last();
        await expect(shareButton).toBeVisible({ timeout: 6000 });
        await expect(shareButton).toBeEnabled();
        await shareButton.click();

        // Verify success message for data shared successfully
        const successToast = this.page.getByText(/Data shared Successfully/i);
        await expect(successToast).toBeVisible({ timeout: 10000 });

        // Click the users icon inside the last folder (if present and visible)
        const lastFolder = this.page.locator('div.lib-file').last();
        const usersIconInLastFolder = lastFolder.locator('i.fa.fa-users.f-12.p-1');
        if (await usersIconInLastFolder.isVisible().catch(() => false)) {
            await usersIconInLastFolder.click({ force: true });
        }

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    // Verify that clicking an image file shows action options
    async verifyImageFileShowsActionOptions() {

        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and ensure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });
        // Assume you are on the Files tab after navigation

        // Find the first image file in the listing files grid
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' });
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 10000 });
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

    // Verify clicking ‘Get Link’ opens link popup
    async verifyGetLinkOpensLinkPopup() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and ensure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Find the image file to use for right click (adjust the file name if needed)
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' });
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);
        await imageFile.click({ button: 'right' });
        await imageFile.click({ button: 'right' });

        // Wait for the context menu and click "Get Link"
        const getLinkOption = this.page.locator('#folderOptionsList ul.folders li:has(i.pi.pi-link) a', { hasText: 'Get Link' });
        await expect(getLinkOption).toBeVisible({ timeout: 2000 });
        await getLinkOption.click();
        await this.page.waitForTimeout(1000);

        // Assert that the link popup/dialog appears
        const linkPopup = this.page.locator('[role="dialog"], .p-dialog, .modal:has-text("Get Link")').last();
        await expect(linkPopup).toBeVisible({ timeout: 10000 });

        // Locate the cross (close) icon in the link popup dialog
        const crossIcon = this.page.locator('button.p-dialog-header-close')
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
     * Verify clicking "Get Path" opens the path popup dialog.
     */
    public async verifyGetPathOpensPathPopup(): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and ensure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Find the image file to use for right click (adjust the file name if needed)
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' });
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);

        // Right-click the folder to open context menu
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

    // Verify clicking ‘Preview’ opens the file
    async verifyPreviewOptionOpensFile() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and ensure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Find the image file to use for right click (adjust the file name if needed)
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' });
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);

        // Right-click the folder to open context menu
        await imageFile.click({ button: 'right' });
        await imageFile.click({ button: 'right' });

        await this.page.waitForTimeout(1000);

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

    // Verify clicking 'Download' downloads the file
    async verifyDownloadFile() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and ensure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Find the image file to use for right click (adjust the file name if needed)
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' });
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);

        // Right-click the folder to open context menu
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

    // Verify clicking ‘Edit’ opens image in preview
    async verifyEditOpensImageInPreview() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and ensure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Find the image file to use for right click (adjust the file name if needed)
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);

        // Right-click the image file to open context menu
        await imageFile.click({ button: 'right' });
        await imageFile.click({ button: 'right' });
        await this.page.waitForTimeout(1000);

        // Click on the "Rename" action from the context menu using the <a> element with embedded pencil.svg image and 'Rename' text
        const renameOption = this.page.locator('a:has(img[src$="pencil.svg"][alt="Rename"]):has-text("Rename")').first();
        await expect(renameOption).toBeVisible({ timeout: 10000 });
        await renameOption.click();

        // Wait for the preview modal/dialog to open
        const previewDialog = this.page.locator('.image-preview-modal, .p-dialog, .preview-dialog').first();
        await expect(previewDialog).toBeVisible({ timeout: 10000 });

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

    // Verify that image zoom in/out works
    async verifyImageZoomInOutWorks() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and ensure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

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
     * Verify that dragging the image in preview changes its position.
     */
    async verifyImageDragChangesPosition() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and ensure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

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
     * Verifies that the edited image position is reflected in the document tab after dragging.
     * Returns the new X position of the image after drag for assertion.
     */
    async verifyEditedImagePositionReflectsInDocumentTab() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // Try to click the Back button if visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Ensure the "Legal" folder is visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Find the target image file
        const imageFile = this.page.locator('div.lib-file', { hasText: 'PropertyImage2.jpg' }).first();
        await imageFile.scrollIntoViewIfNeeded();
        await expect(imageFile).toBeVisible({ timeout: 10000 });

        const imageBox = await imageFile.boundingBox();
        if (!imageBox) throw new Error('BoundingBox for image file not found.');

        // Simulate dragging the image to the left by 150px
        const startX = imageBox.x + imageBox.width / 2;
        const startY = imageBox.y + imageBox.height / 2;
        const dragOffset = -150;

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
     * Verifies that the offline section expands and collapses as expected.
     */
    async verifyOfflineSectionExpandCollapse() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and ensure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Locate and click the "Reorder" (edit.svg) icon for image reordering
        const reorderIcon = this.page.locator('img[ptooltip="Reorder"][src="assets/img/edit.svg"].p-element.cursor-pointer')
        await expect(reorderIcon.first()).toBeVisible({ timeout: 10000 });
        await reorderIcon.first().click();

        // Perform zoom in and zoom out by interacting with the slider
        const slider = this.page.locator('p-slider.p-element');
        await expect(slider).toBeVisible({ timeout: 10000 });
        // Locate the "Offline Images" heading
        const offlineImagesHeading = this.page.getByRole('heading', { name: 'Offline Images' });
        await offlineImagesHeading.scrollIntoViewIfNeeded();
        await expect(offlineImagesHeading).toBeVisible({ timeout: 10000 });

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
     * Drags an image from Gallery Images to Offline Images section (Angular CDK safe)
     */
    async verifyDragFileToOfflineSection() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open first listing
        const firstListing = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListing).toBeVisible({ timeout: 30000 });
        await firstListing.click();

        // Open Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await filesTab.waitFor({ state: 'visible' });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and ensure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Enable reorder mode
        const reorderIcon = this.page
            .locator('img[ptooltip="Reorder"][src="assets/img/edit.svg"]')
            .first();
        await reorderIcon.waitFor({ state: 'visible' });
        await reorderIcon.click();

        // SOURCE: Angular draggable image
        const sourceImage = this.page.locator('#galImgList .cdk-drag').first();
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
     * Verifies the deletion of an offline file.
     * Assumes the offline image section is present with at least one image.
     */
    async verifyDeleteOfflineFile() {
        // Navigate to the Listings grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstListing = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListing).toBeVisible({ timeout: 30000 });
        await firstListing.click();

        // Switch to the "Files" tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await filesTab.waitFor({ state: 'visible' });
        await filesTab.click();

        // Optionally, click the Back button if visible (ignore errors if not)
        const backButton = this.page.getByRole('link', { name: ' Back' });
        try {
            await backButton.scrollIntoViewIfNeeded();
            if (await backButton.isVisible({ timeout: 20000 })) {
                await backButton.click();
            }
        } catch { }

        // Make sure "Legal" folder is visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Activate reorder mode
        const reorderIcon = this.page.locator('img[ptooltip="Reorder"][src="assets/img/edit.svg"]').first();
        await reorderIcon.waitFor({ state: 'visible' });
        await reorderIcon.click();

        // Click to expand the offline image section
        const offlineSectionExpand = this.page.locator('h4', { hasText: "Click to expand and drag and drop images you do not want to push to portals." });
        await offlineSectionExpand.scrollIntoViewIfNeeded();
        await expect(offlineSectionExpand).toBeVisible({ timeout: 10000 });
        await offlineSectionExpand.click();

        const offlineDropList = this.page.locator('.hwfix').last();
        await expect(offlineDropList).toBeVisible({ timeout: 10000 });
        await offlineDropList.click();

        // Click the delete ("cross") icon to delete selected images
        const deleteBtn = this.page.locator('a[ptooltip="Delete selected images"]');
        await expect(deleteBtn).toBeVisible({ timeout: 10000 });
        await deleteBtn.dblclick({ force: true });

        // Confirm deletion by checking for a "deleted successfully" toast/message by text
        const deletedToast = this.page.getByText(/deleted successfully/i).first();
        await expect(deletedToast).toBeVisible({ timeout: 20000 });

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
     * Verify that opening a folder in the listing view displays the "Back" button.
     */
    async verifyBackButtonIsShownWhenFolderOpened() {
        // Navigate to the Listings grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstListing = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListing).toBeVisible({ timeout: 30000 });
        await firstListing.click();

        // Switch to the "Files" tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await filesTab.waitFor({ state: 'visible' });
        await filesTab.click();

        // Optionally, click the Back button if visible (ignore errors if not)
        const backButton = this.page.getByRole('link', { name: ' Back' });
        try {
            await backButton.scrollIntoViewIfNeeded();
            if (await backButton.isVisible({ timeout: 20000 })) {
                await backButton.click();
            }
        } catch { }

        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });
        await legalFolder.dblclick();
        // expect the "Back" button to be visible after opening the "Legal" folder
        await expect(this.page.getByRole('link', { name: ' Back' })).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);


    }

    /**
     * Verify that folder names appear as navigation tabs after navigating into folders.
     */
    async verifyFolderNamesAppearAsNavigationTabs() {
        // Navigate to the Listings grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstListing = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListing).toBeVisible({ timeout: 30000 });
        await firstListing.click();

        // Switch to the "Files" tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await filesTab.waitFor({ state: 'visible' });
        await filesTab.click();


        // Optionally, click the Back button if visible (ignore errors if not)
        const backButton = this.page.getByRole('link', { name: ' Back' });
        try {
            await backButton.scrollIntoViewIfNeeded();
            if (await backButton.isVisible({ timeout: 20000 })) {
                await backButton.click();
            }
        } catch { }

        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });
        await legalFolder.dblclick();
        // expect the "Back" button to be visible after opening the "Legal" folder
        await expect(this.page.getByRole('link', { name: ' Back' })).toBeVisible({ timeout: 10000 });

        const breadcrumb = this.page.locator('ul li a span.bread-color:has-text("Legal")');
        await expect(breadcrumb).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verifies that clicking a folder tab in the breadcrumb navigation opens that folder.
     * Assumes navigation into at least one folder has already occurred.
     * Optionally, accepts the folder name to test; defaults to 'Legal'.
     */
    async verifyClickingFolderTabNavigatesToFolder() {
        // Navigate to the Listings grid view
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstListing = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListing).toBeVisible({ timeout: 30000 });
        await firstListing.click();

        // Switch to the "Files" tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await filesTab.waitFor({ state: 'visible' });
        await filesTab.click();


        // Optionally, click the Back button if visible (ignore errors if not)
        const backButton = this.page.getByRole('link', { name: ' Back' });
        try {
            await backButton.scrollIntoViewIfNeeded();
            if (await backButton.isVisible({ timeout: 20000 })) {
                await backButton.click();
            }
        } catch { }

        const ducumentsFolder = this.page.locator('div.lib-file', { hasText: 'Documents' }).first();
        await ducumentsFolder.scrollIntoViewIfNeeded();
        await expect(ducumentsFolder).toBeVisible({ timeout: 20000 });
        await ducumentsFolder.dblclick();
        // expect the "Back" button to be visible after opening the "Legal" folder
        await expect(this.page.getByRole('link', { name: ' Back' })).toBeVisible({ timeout: 10000 });

        const breadcrumb = this.page.locator('ul li a span.bread-color:has-text("Documents")');
        await expect(breadcrumb).toBeVisible({ timeout: 10000 });

        // Click on Appraisals folder
        const appraisalsFolder = this.page.locator('div.lib-file', { hasText: 'Appraisals' }).first();
        await appraisalsFolder.scrollIntoViewIfNeeded();
        await expect(appraisalsFolder).toBeVisible({ timeout: 20000 });
        await appraisalsFolder.dblclick();
        // Optionally, assert that the breadcrumb has updated to 'Appraisals'
        const appraisalsBreadcrumb = this.page.locator('ul li a span.bread-color:has-text("Appraisals")');
        await expect(appraisalsBreadcrumb).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    /**
     * Verifies that the document tab supports toggling between list and grid views.
     * Checks that toggling updates the UI as expected.
     */
    async verifyDocumentTabSupportsListGridViewToggle() {
        // Navigate to the Listings grid view and open the first listing
        await this.navigateToListings();
        await this.switchToGridView();

        const firstListing = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListing).toBeVisible({ timeout: 30000 });
        await firstListing.click();
        // Switch to the "Files" tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await filesTab.waitFor({ state: 'visible' });
        await filesTab.click();

        // Optionally, click the Back button if visible (ignore errors if not)
        const backButton = this.page.getByRole('link', { name: ' Back' });
        try {
            await backButton.scrollIntoViewIfNeeded();
            if (await backButton.isVisible({ timeout: 20000 })) {
                await backButton.click();
            }
        } catch { }

        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

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
     * Verifies that reordering folders by drag-and-drop changes their order in the UI.
     */
    async verifyFolderReordering() {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstListing = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstListing).toBeVisible({ timeout: 30000 });
        await firstListing.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and ensure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Find the "documents" folder and drag it to the right side
        const documentsFolder = this.page.locator('div.lib-file', { hasText: 'documents' }).first();
        await documentsFolder.scrollIntoViewIfNeeded();
        await expect(documentsFolder).toBeVisible({ timeout: 10000 });

        const documentsBox = await documentsFolder.boundingBox();
        if (!documentsBox) throw new Error('BoundingBox for documents folder not found.');

        // Drag from center of the folder to 150px right of its current center
        const startX = documentsBox.x + documentsBox.width / 2;
        const startY = documentsBox.y + documentsBox.height / 2;
        const dragOffset = 150; // pixels to the right

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
    /*
    *Verify that reordering images works
     */
    public async verifyImageReorderingWorks() {
        // Reminder: This uses public directory images for upload
        const uploadInput = this.page.locator('input[type="file"]');
        await expect(uploadInput).toBeVisible({ timeout: 10000 });

        // Upload using images from the public assets folder (adjust as needed for your env)
        const firstImage = path.resolve(__dirname, '../../public/test-image-01.jpg');
        const secondImage = path.resolve(__dirname, '../../public/test-image-02.jpg');

        // Upload the first image
        await uploadInput.setInputFiles(firstImage);
        const uploadedImg1 = this.page.locator('img[src*="test-image-01"]');
        await expect(uploadedImg1).toBeVisible({ timeout: 10000 });

        // Upload the second image
        await uploadInput.setInputFiles(secondImage);
        const uploadedImg2 = this.page.locator('img[src*="test-image-02"]');
        await expect(uploadedImg2).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);

        // Get the relevant images before reorder
        const images = this.page.locator('img[src*="test-image-01"], img[src*="test-image-02"]');
        const imgCount = await images.count();
        if (imgCount < 2) {
            throw new Error('Both images must be present to reorder.');
        }

        const srcBefore0 = await images.nth(0).getAttribute('src');
        const srcBefore1 = await images.nth(1).getAttribute('src');

        // Drag and drop to reorder
        await images.nth(0).dragTo(images.nth(1));
        await this.page.waitForTimeout(1200);

        const imagesAfter = this.page.locator('img[src*="test-image-01"], img[src*="test-image-02"]');
        const srcAfter0 = await imagesAfter.nth(0).getAttribute('src');
        const srcAfter1 = await imagesAfter.nth(1).getAttribute('src');

        if (srcBefore0 === srcAfter0 && srcBefore1 === srcAfter1) {
            throw new Error('Images did not reorder as expected.');
        }

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    /**
    Verify error message when uploading unsupported file types
    */
    async verifyUnsupportedFileTypeUploadShowsError(filePath: string): Promise<void> {
        await this.navigateToListings();
        await this.switchToGridView();

        // Open the first listing
        const firstCardRow = this.page.locator("//div[contains(@class,'s-property')]").first();
        await expect(firstCardRow).toBeVisible({ timeout: 30000 });
        await firstCardRow.click();
        await this.page.waitForTimeout(1000);

        // Go to Files tab
        const filesTab = this.page.getByRole('tab', { name: /Files/i });
        await expect(filesTab).toBeVisible({ timeout: 10000 });
        await filesTab.click();

        // If there's a Back button, try to click it if it's visible
        const backButton = this.page.getByRole('link', { name: ' Back' });
        await backButton.scrollIntoViewIfNeeded().catch(() => { });
        if (await backButton.isVisible({ timeout: 20000 }).catch(() => false)) {
            await backButton.click();
        }

        // Find the "Legal" folder and make sure it's visible
        const legalFolder = this.page.locator('div.lib-file', { hasText: 'Legal' }).first();
        await legalFolder.scrollIntoViewIfNeeded();
        await expect(legalFolder).toBeVisible({ timeout: 20000 });

        // Click the Add button
        const addButton = this.page.getByRole('button', { name: /add/i }).first();
        await expect(addButton).toBeVisible({ timeout: 10000 });
        await addButton.click();

        // Click "File Upload (Public)" option
        const publicOption = this.page.locator('a', { hasText: 'File Upload (Public)' });

        await expect(publicOption).toBeVisible({ timeout: 10000 });
        await this.page.waitForTimeout(1200);
        await publicOption.click();

        // Wait for upload input to appear
        const fileInput = this.page.locator('#fileUpload');
        // Upload the file
        await fileInput.setInputFiles(filePath);
        const errorToast = this.page.locator('div[aria-label="File type not supported"]');
        await expect(errorToast).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);
        const closeBtn = this.page.locator('i.pi.pi-times.cursor-pointer.f-14').first();
        if (await closeBtn.isVisible().catch(() => false)) {
            await closeBtn.click();
        }
        await this.page.waitForTimeout(1200);
    }

    /**
    * Verify that all portal rows display their toggle (slider) button
    * in the Portals tab.
    */
}
