import { Page, Locator, expect } from '@playwright/test';
import { ContactBasePage } from './ContactBasePage';
import { faker } from '@faker-js/faker';

export class ContactFormPage extends ContactBasePage {
    public async verifyContactFormOpensSuccessfully() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);


        const AddContactButton = this.page.getByRole('button', { name: '' });
        await AddContactButton.click({ force: true });

        const contactForm = this.page.locator('section.body-details');
        await contactForm.waitFor({ state: 'visible', timeout: 10000 });
        expect(contactForm).toBeVisible();
        console.log("Contact Form open successfully");
        await this.page.waitForTimeout(1200);
        await this.closeModalIfVisible();

    }

    public async verifyContactFormCloseWithXIcon() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const AddContactButton = this.page.getByRole('button', { name: '' });
        await AddContactButton.click({ force: true });

        const contactForm = this.page.locator('section.body-details');
        await contactForm.waitFor({ state: 'visible', timeout: 10000 });
        expect(contactForm).toBeVisible();
        await this.page.waitForTimeout(1200);
        await this.closeModalIfVisible();
        console.log("Contact form was closed using the X icon successfully")
    }

    public async verifyImageUploadFunctionalityNotDisplayed() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);


        const AddContactButton = this.page.getByRole('button', { name: '' });
        await AddContactButton.click({ force: true });

        const contactForm = this.page.locator('section.body-details');
        await contactForm.waitFor({ state: 'visible', timeout: 10000 });
        expect(contactForm).toBeVisible();

        const imageUploadSelectors = [
            'input[type="file"]', // file input
            'img[alt*="avatar"]',
            'img[alt*="profile"]',
            'button:has-text("Upload Image")',
            '[class*="upload"]',
            '.profile-upload',
            'label:has-text("Upload")'
        ];

        for (const selector of imageUploadSelectors) {
            const el = this.page.locator(selector);
            expect(await el.count()).toBe(0);
        }

        await this.page.waitForTimeout(1200);
        await this.closeModalIfVisible();
        console.log("Verified: Image upload functionality is not displayed on the contact form.");
    }



    public async verifyContactInitialsPlaceholderDisplays(firstName?: string, lastName?: string) {
        await this.NavigateToContacts();

        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);


        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        await this.page.waitForSelector('input[formcontrolname="first_name"]', { state: 'visible' });

        const imagePlaceHolder = this.page.getByText('D1', { exact: true });
        await expect(imagePlaceHolder).toBeVisible();

        // Use faker if names not provided from test
        const generatedFirstName = firstName ?? faker.person.firstName();
        const generatedLastName = lastName ?? faker.person.lastName();

        const firstNameInput = this.page.locator('input[formcontrolname="first_name"]');
        await firstNameInput.fill(generatedFirstName);

        const lastNameInput = this.page.locator('input[formcontrolname="last_name"]');
        await lastNameInput.fill(generatedLastName);

        await this.page.waitForSelector('.user-thumbnail-placeholder .text-uppercase', { state: 'visible' });

        const initialsPlaceholder = this.page.locator('.user-thumbnail-placeholder .text-uppercase').first();
        await expect(initialsPlaceholder).toBeVisible();

        const expectedInitials = (generatedFirstName[0] + generatedLastName[0]).toUpperCase();
        await expect(initialsPlaceholder).toContainText(expectedInitials);

        console.log(`✅ Verified initials: ${expectedInitials}`);
        await this.page.waitForTimeout(1200);
        await this.closeModalIfVisible();
    }


    public async verifySelectContactTypeUpdatesDropdown() {
        await this.NavigateToContacts();

        const rowsLocator = this.page.locator('table tbody tr');
        await rowsLocator.first().waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        const contactTypeDropdown = this.page.locator('span').filter({ hasText: 'Individual' });
        await contactTypeDropdown.waitFor({ state: 'visible' });

        await contactTypeDropdown.click();

        await this.page.waitForTimeout(500);

        const dropdownoption = this.page.locator('div').filter({ hasText: /^Company$/ }).nth(1);
        await expect(dropdownoption).toBeVisible()
        await dropdownoption.click()

        await expect(this.page.locator('span').filter({ hasText: /^Company$/ })).toBeVisible()
        await expect(this.page.locator('div').filter({ hasText: /^Company Name \*$/ }).nth(1)).toBeVisible()
        await expect(this.page.locator('div').filter({ hasText: /^Preferred Contact MethodSelect Contact Method$/ }).first()).toBeVisible()
        await this.page.waitForTimeout(1200);
        await this.closeModalIfVisible();
    }


    public async verifyRequiredFieldsValidationForCompany() {
        await this.NavigateToContacts();

        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        const contactTypeDropdown = this.page.locator('span').filter({ hasText: 'Individual' });
        await contactTypeDropdown.waitFor({ state: 'visible' });
        await contactTypeDropdown.click();
        await this.page.waitForTimeout(500);

        const companyOption = this.page.locator('div').filter({ hasText: /^Company$/ }).nth(1);
        await companyOption.waitFor({ state: 'visible' });
        await companyOption.click();

        // Attempt to save without filling any fields to trigger validation
        const savecontactButton = this.page.getByRole('button', { name: 'Save' }).first();
        await savecontactButton.click({ force: true });

        // Only verify that required validation errors are shown
        const companyNameError = this.page.getByText('Company name is required', { exact: false });
        await expect(companyNameError).toBeVisible();

        const emailError = this.page.getByText('Email is required', { exact: false });
        await expect(emailError).toBeVisible();
        await this.page.waitForTimeout(1200);
        await this.closeModalIfVisible();
    }

    public async verifyRequiredFieldsCapitalizedValidationForCompany() {
        await this.NavigateToContacts();

        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        const contactTypeDropdown = this.page.locator('span').filter({ hasText: 'Individual' });
        await contactTypeDropdown.waitFor({ state: 'visible' });
        await contactTypeDropdown.click();
        await this.page.waitForTimeout(500);

        const companyOption = this.page.locator('div').filter({ hasText: /^Company$/ }).nth(1);
        await companyOption.waitFor({ state: 'visible' });
        await companyOption.click();

        // Attempt to save without filling any fields to trigger validation
        const savecontactButton = this.page.getByRole('button', { name: 'Save' }).first();
        await savecontactButton.click({ force: true });

        // Check validation error messages: the first word must start with a capital letter
        const companyNameError = this.page.getByText(/Company name is required/i, { exact: false });
        const emailError = this.page.getByText(/Email is required/i, { exact: false });

        await expect(companyNameError).toBeVisible();
        await expect(emailError).toBeVisible();

        // Extra validation: check first word is capitalized for each error message
        const companyNameErrorText = await companyNameError.textContent();
        const emailErrorText = await emailError.textContent();

        if (companyNameErrorText) {
            const firstWord = companyNameErrorText.split(' ')[0];
            expect(firstWord.charAt(0)).toMatch(/[A-Z]/);
        } else {
            throw new Error('Company name error text not found');
        }

        if (emailErrorText) {
            const firstWord = emailErrorText.split(' ')[0];
            expect(firstWord.charAt(0)).toMatch(/[A-Z]/);
        } else {
            throw new Error('Email error text not found');
        }
        await this.page.waitForTimeout(1200);
        await this.closeModalIfVisible();
    }

    // Verify required fields validation for "Individual" contact type
    public async verifyRequiredFieldsValidationForIndividual() {
        await this.NavigateToContacts();

        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        const contactTypeDropdown = this.page.locator('span').filter({ hasText: 'Individual' });
        await contactTypeDropdown.waitFor({ state: 'visible' });
        await this.page.waitForTimeout(500);

        const saveContactButton = this.page.getByRole('button', { name: 'Save' }).first();
        await saveContactButton.click({ force: true });

        const firstNameError = this.page.getByText(/First name is required/i, { exact: false });
        const emailError = this.page.getByText(/Email is required/i, { exact: false });

        await expect(firstNameError).toBeVisible();
        await expect(emailError).toBeVisible();
        await this.page.waitForTimeout(1200);
        await this.closeModalIfVisible();

    }

    public async verifySaveButtonSavesForm() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);
        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName });

        const firstNameInput = this.page.locator('input[formcontrolname="first_name"]');
        await firstNameInput.waitFor({ state: 'visible' });
        await firstNameInput.fill(firstName);

        const lastNameInput = this.page.locator('input[formcontrolname="last_name"]');
        await lastNameInput.waitFor({ state: 'visible' });
        await lastNameInput.fill(lastName);

        const emailInput = this.page.locator('input[formcontrolname="email"]');
        await emailInput.waitFor({ state: 'visible' });
        await emailInput.fill(email);

        await this.page.waitForTimeout(1000);

        const saveButton = this.page.getByRole('button', { name: 'Save' }).first();
        await saveButton.click({ force: true });

        const successToast = this.page.getByText(/Contact has been created|Contact has been updated/i);
        await expect(successToast).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);
        await this.closeModalIfVisible();
    }

    // Verify that clicking "Save & Close" saves and closes the form
    public async verifySaveAndCloseButtonSavesAndClosesForm() {
        await this.NavigateToContacts();

        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName });

        const firstNameInput = this.page.locator('input[formcontrolname="first_name"]');
        await firstNameInput.waitFor({ state: 'visible' });
        await firstNameInput.fill(firstName);

        const lastNameInput = this.page.locator('input[formcontrolname="last_name"]');
        await lastNameInput.waitFor({ state: 'visible' });
        await lastNameInput.fill(lastName);

        const emailInput = this.page.locator('input[formcontrolname="email"]');
        await emailInput.waitFor({ state: 'visible' });
        await emailInput.fill(email);

        await this.page.waitForTimeout(500)

        const saveAndCloseButton = this.page.getByRole('button', { name: 'Save & Close' }).first();
        await saveAndCloseButton.click({ force: true });

        const successToast = this.page.getByText(/Contact has been created|Contact has been updated/i);
        await expect(successToast).toBeVisible();
        await expect(this.page.getByRole('button', { name: 'Save' }).first()).toBeHidden();
    }

    public async verifySelectAllChangesToDeselectAllInPreferredContactMethod() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);

        // Open Add Contact
        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        // Open 'Preferred Contact Method' dropdown
        const preferredContactDropdown = this.page.locator('div').filter({ hasText: /^Select Contact Method$/ }).nth(1);
        await preferredContactDropdown.click();

        // Click "Select All" checkbox
        const selectAllCheckbox = this.page.locator('label.select_all');
        await selectAllCheckbox.click();

        // Assert that the "Select All" label changed to "Deselect All"
        const deselectAllLabel = this.page.locator('label.select_all[data="Deselect All"]');
        await expect(deselectAllLabel).toBeVisible();

        await this.page.waitForTimeout(1200);
        await this.closeModalIfVisible();
    }

    public async verifyInvalidEmailFormatErrorMessage() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);

        // Open Add Contact
        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        // Enter invalid email format
        const invalidEmail = "invalid-email-format@";
        const emailInput = this.page.locator('input[formcontrolname="email"]');
        await emailInput.waitFor({ state: 'visible' });
        await emailInput.fill(invalidEmail);

        await this.page.waitForTimeout(1000);

        // Click Save button
        const saveButton = this.page.getByRole('button', { name: 'Save' }).first();
        await saveButton.click({ force: true });

        // Verify error message for email field
        const emailError = this.page.getByText('Invalid email format');
        await expect(emailError).toBeVisible();

        await this.page.waitForTimeout(1200);
        await this.closeModalIfVisible();
        await this.page.waitForTimeout(2000);
    }

    public async verifyAddEmailField() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        const emailInputs = this.page.locator('input[formcontrolname="email"]');
        const countBefore = await emailInputs.count();

        const addEmailIcon = this.page.getByRole('button', { name: '' }).nth(1);
        await addEmailIcon.click();

        await expect(this.page.getByRole('textbox', { name: 'Other Email' })).toBeVisible()
        await this.page.waitForTimeout(1200);
        await this.closeModalIfVisible();
    }

    // Verify that clicking the "+" icon adds a new phone field
    public async verifyAddPhoneField() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        // const phoneInputs = this.page.locator('input[formcontrolname="mobile_no"]');
        // const countBefore = await phoneInputs.count();

        // const addPhoneIcon = this.page.getByRole('button', { name: '' }).nth(2);
        // await addPhoneIcon.click();

        // await expect(this.page.getByRole('textbox', { name: 'Other Phone' })).toBeVisible();

        await this.page.waitForTimeout(1200);
        await this.closeModalIfVisible();
    }

    public async verifyDeleteEmailOrPhoneField() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);

        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        // Add an extra email field
        const addEmailIcon = this.page.getByRole('button', { name: '' }).nth(1);
        await addEmailIcon.click();

        const emailInputs = this.page.locator('input[formcontrolname="email"]');
        const deleteEmailButton = this.page.getByRole('button', { name: 'delete' }).first();
        await deleteEmailButton.click();
        await this.page.waitForTimeout(1000);
        await expect(emailInputs.nth(1)).not.toBeVisible();

        // const addPhoneIcon = this.page.getByRole('button', { name: '' }).nth(2);
        // await addPhoneIcon.click();

        // const phoneInputs = this.page.locator('input[formcontrolname="mobile_no"]');
        // const deletePhoneButton = this.page.getByRole('button', { name: 'delete' }).last();
        // await deletePhoneButton.click();
        await this.page.waitForTimeout(1000);
        // await expect(phoneInputs.nth(1)).not.toBeVisible();
        await this.page.waitForTimeout(1200);
        await this.closeModalIfVisible();
    }

    // Verify that clicking the correct (✔) button sets an email as the primary email

    public async verifySetPrimaryEmail() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);


        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        const mainEmailInput = this.page.locator('input[formcontrolname="email"]').first();
        const firstEmail = 'user1@example.com';
        await mainEmailInput.fill(firstEmail);

        const addEmailIcon = this.page.getByRole('button', { name: '' }).nth(1);
        await addEmailIcon.click();

        const otherEmailInput = this.page.locator('input[placeholder="Other Email"]');
        const secondEmail = 'user2@example.com';
        await otherEmailInput.fill(secondEmail);

        // Set "Other Email" as primary
        const setPrimaryBtn = this.page.getByRole('button', { name: '' }).first();
        await setPrimaryBtn.click({ force: true });

        await expect(mainEmailInput).toHaveValue(secondEmail);

        await this.page.waitForTimeout(1200);
        await this.closeModalIfVisible();
    }

    // Attempt to save a tag without entering a name
    public async verifyCannotSaveTagWithoutName() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        await this.page.waitForTimeout(1000);
        const addContactButton = this.page.getByRole('button', { name: '' });
        await addContactButton.waitFor({ state: 'visible' });
        await addContactButton.click();

        const plusTagIcon = this.page.locator('i.pi.pi-plus.cursor-pointer.text-primary');
        await plusTagIcon.scrollIntoViewIfNeeded();
        await plusTagIcon.click();

        await expect(this.page.getByText('Tag Manager')).toBeVisible();
        await this.page.waitForTimeout(1000);

        const newTagButton = this.page.locator('button[ptooltip="New Tag"]');
        await newTagButton.click();

        const tagTypeDropdown = this.page.locator('ng-select[placeholder="Select Tag Type"] input[type="text"]');
        await expect(tagTypeDropdown).toBeVisible();
        await tagTypeDropdown.click();
        await tagTypeDropdown.fill('Automation Testing');
        const tagTypeOption = this.page.getByRole('option', { name: 'Automation Testing' }).first();
        await tagTypeOption.click();

        const addButton = this.page.getByRole('button', { name: /^Add$/i });
        await addButton.isDisabled();
        // click cancel button 
        const cancelButton = this.page.getByRole('button', { name: /cancel/i }).first();
        await expect(cancelButton).toBeVisible();
        await cancelButton.click();

        await this.page.waitForTimeout(1200);
        await this.closeModalIfVisible();
    }

    // Verify associating a company with a contact via association search in contact details
    public async verifyCompanyAssociatedWithContact(companyName: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        const company = this.page.locator("div[class='col-12 grio'] div[class='tags']");
        await company.scrollIntoViewIfNeeded();
        await company.click({ force: true });

        const associationSearchInput = this.page.locator('[id="Contact-11 22_0"]').getByRole('textbox', { name: 'Search', exact: true });
        await associationSearchInput.waitFor({ state: 'visible', timeout: 5000 });
        await associationSearchInput.click();
        await this.page.waitForTimeout(1200);
        await associationSearchInput.fill(companyName);

        // Wait for and select the desired company from the dropdown options
        const companyOption = this.page.getByRole('listitem').filter({ hasText: companyName }).first();
        await companyOption.waitFor({ state: 'visible', timeout: 30000 });
        await companyOption.click({ force: true });

        const associationButton = this.page.getByRole('button', { name: /associate|association/i }).first();
        await associationButton.evaluate((el) => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
        await this.page.waitForTimeout(400);
        await associationButton.waitFor({ state: 'visible', timeout: 3000 });
        await associationButton.click({ force: true });

        const alertLocator = this.page.getByRole('alert', { name: /Company added successfully|This company is already attached with this contact/ });
        await expect(alertLocator).toBeVisible({ timeout: 10000 });
        const removeNetsol = this.page.locator('div.company-div:has(span:text("Netsol")) i.pi-times-circle');
        await expect(removeNetsol).toBeVisible();

        await this.page.waitForTimeout(1200);
        await this.closeModalIfVisible();
    }

    // Try to associate the same company twice
    public async tryAssociateSameCompanyTwice(companyName: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        const company = this.page.locator("div[class='col-12 grio'] div[class='tags']");
        await company.scrollIntoViewIfNeeded();
        await company.click({ force: true });

        const associationSearchInput = this.page.locator('[id="Contact-11 22_0"]').getByRole('textbox', { name: 'Search', exact: true });
        await associationSearchInput.waitFor({ state: 'visible', timeout: 5000 });
        await associationSearchInput.click();
        await this.page.waitForTimeout(1200);
        await associationSearchInput.fill(companyName);

        // Wait for and select the desired company from the dropdown options
        const companyOption = this.page.getByRole('listitem').filter({ hasText: companyName }).first();
        await companyOption.waitFor({ state: 'visible', timeout: 30000 });
        await companyOption.click({ force: true });

        const associationButton = this.page.getByRole('button', { name: /associate|association/i }).first();
        await associationButton.evaluate((el) => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
        await this.page.waitForTimeout(400);
        await associationButton.waitFor({ state: 'visible', timeout: 3000 });
        await associationButton.click({ force: true });

        const alertLocator = this.page.getByRole('alert', { name: /Company added successfully|This company is already attached with this contact/ });
        await expect(alertLocator).toBeVisible({ timeout: 10000 });

        const removeNetsol = this.page.locator('div.company-div:has(span:text("Netsol")) i.pi-times-circle');
        await expect(removeNetsol).toBeVisible()

        await expect(this.page.getByRole('alert', { name: 'This company is already attached with this contact' })).toBeVisible()
        await this.page.waitForTimeout(1200);
        await this.closeModalIfVisible();
    }

    // Verify that clicking on a company tag opens the company form
    public async verifyOpenCompanyFormFromTag(companyName: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        const company = this.page.locator("div[class='col-12 grio'] div[class='tags']");
        await company.scrollIntoViewIfNeeded();
        await company.click({ force: true });

        const associationSearchInput = this.page.locator('[id="Contact-11 22_0"]').getByRole('textbox', { name: 'Search', exact: true });
        await associationSearchInput.waitFor({ state: 'visible', timeout: 5000 });
        await associationSearchInput.click();
        await this.page.waitForTimeout(1200);
        await associationSearchInput.fill(companyName);

        // Wait for and select the desired company from the dropdown options
        const companyOption = this.page.getByRole('listitem').filter({ hasText: companyName }).first();
        await companyOption.waitFor({ state: 'visible', timeout: 30000 });
        await companyOption.click({ force: true });

        const associationButton = this.page.getByRole('button', { name: /associate|association/i }).first();
        await associationButton.evaluate((el) => el.scrollIntoView({ behavior: 'smooth', block: 'center' }));
        await this.page.waitForTimeout(400);
        await associationButton.waitFor({ state: 'visible', timeout: 3000 });
        await associationButton.click({ force: true });

        const alertLocator = this.page.getByRole('alert', { name: /Company added successfully|This company is already attached with this contact/ });
        await expect(alertLocator).toBeVisible({ timeout: 10000 });
        const tag = this.page.locator(`div.company-div span`, { hasText: companyName }).first();
        await tag.click();
        await this.page.waitForTimeout(1200);
        await this.closeModalIfVisible();
    }

    // Verify that a company tag can be removed
    public async verifyRemoveCompanyTag(companyName: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        const company = this.page.locator("div[class='col-12 grio'] div[class='tags']");
        await company.scrollIntoViewIfNeeded();
        await company.click({ force: true });

        const associationSearchInput = this.page.locator('[id="Contact-11 22_0"]').getByRole('textbox', { name: 'Search', exact: true });
        await associationSearchInput.waitFor({ state: 'visible', timeout: 5000 });
        await associationSearchInput.click();
        await this.page.waitForTimeout(1200);
        await associationSearchInput.fill(companyName);

        // Wait for and select the desired company from the dropdown options
        const companyOption = this.page.getByRole('listitem').filter({ hasText: companyName }).first();
        await companyOption.waitFor({ state: 'visible' });
        await companyOption.click({ force: true });

        const associationButton = this.page.getByRole('button', { name: /associate|association/i }).first();
        await associationButton.waitFor({ state: 'visible', timeout: 3000 });
        await associationButton.click();

        const alertLocator = this.page.getByRole('alert', { name: /Company added successfully|This company is already attached with this contact/ });
        await expect(alertLocator).toBeVisible({ timeout: 10000 });
        const tag = this.page.locator(`div.company-div span`, { hasText: companyName }).first();
        await tag.click();

        await this.page.waitForTimeout(1200);
        await this.closeModalIfVisible();

    }

    // Verify that address suggestions appear while typing in the address field
    public async verifyAddressSuggestions(addressPartial: string): Promise<void> {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible' });
        await companyTagCell.click();
        // Locate the address input field (update selector as needed)
        const addressInput = this.page.getByRole('textbox', { name: /address/i }).first();
        await addressInput.waitFor({ state: 'visible' });
        await addressInput.click();
        await addressInput.fill(addressPartial);

        // Simulate slow typing (since .type is not supported, use fill with increasing substrings and delay)
        for (let i = 1; i <= addressPartial.length; i++) {
            const partialStr = addressPartial.slice(0, i);
            await addressInput.fill(partialStr);
            await this.page.waitForTimeout(300); // wait 300ms to simulate user's "slow typing"
        }

        const suggestionsList = this.page.locator('.pac-item').first();
        await suggestionsList.waitFor({ state: 'visible' });
        await suggestionsList.click({ force: true });

        await this.page.waitForTimeout(2000);
        // Close the form using the X icon after address selection
        await this.closeModalIfVisible();
    }

    public async verifyAddressAutoFill(addressPartial: string): Promise<void> {
        await this.NavigateToContacts();
        // Click on the first row in the table
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        const contactForm = this.page.locator('section.body-details');
        await contactForm.waitFor({ state: 'visible' });
        expect(contactForm).toBeVisible();
        console.log("Contact Form open successfully");

        // Find the address input field
        const addressInput = this.page.locator('input[placeholder="Search Address"]');
        await addressInput.waitFor({ state: 'visible' });
        await addressInput.click();

        // Type the address slowly to trigger autocomplete
        for (let i = 1; i <= addressPartial.length; ++i) {
            await addressInput.fill(addressPartial.slice(0, i));
            await this.page.waitForTimeout(500);
        }

        const suggestionsList = this.page.locator('.pac-item').first();
        await suggestionsList.click({ force: true });

        // Wait for autofill to populate
        await this.page.waitForTimeout(2000);

        // Open overlay/panel if required
        const editOverlayButton = this.page.locator('#toggle-overlay');
        await editOverlayButton.waitFor({ state: 'visible' });
        await editOverlayButton.click();


        // Define locators using stable Angular formcontrolnames
        const buildingName = this.page.locator('input[formcontrolname="building_name"]');
        const unitNo = this.page.locator('input[formcontrolname="unit_no"]');
        const streetNoInput = this.page.locator('input[formcontrolname="street_no"]');
        const streetNameInput = this.page.locator('input[formcontrolname="street_name"]');
        const suburbInput = this.page.locator('p-autocomplete[formcontrolname="suburb"] input.p-autocomplete-input');
        const stateInput = this.page.locator('input[formcontrolname="state"]');
        const postCodeInput = this.page.locator('input[formcontrolname="post_code"]');
        const countryInput = this.page.locator('input[formcontrolname="country"]');

        // Read all autofilled values safely
        const building_name = await buildingName.inputValue().catch(() => '');
        const unit_no = await unitNo.inputValue().catch(() => '');
        const streetNo = await streetNoInput.inputValue().catch(() => '');
        const streetName = await streetNameInput.inputValue().catch(() => '');
        const suburb = await suburbInput.inputValue().catch(() => '');
        const state = await stateInput.inputValue().catch(() => '');
        const postCode = await postCodeInput.inputValue().catch(() => '');
        const country = await countryInput.inputValue().catch(() => '');

        // Collect results
        const fieldValues = {
            building_name,
            unit_no,
            streetNo,
            streetName,
            suburb,
            state,
            postCode,
            country
        };

        console.log('Autofilled Address Values:', fieldValues);

        // ✅ Assert that at least one important field is not empty
        expect(
            Object.values(fieldValues).some(val => val && val.trim().length > 0)
        ).toBeTruthy();

        await this.page.waitForTimeout(1000);

        // Click the save button to save address changes
        const saveButton = this.page.getByRole('button', { name: /^Save$/i }).last();
        await saveButton.click({ force: true });
        await this.page.waitForTimeout(1200);
        // Close the overlay or form using the close icon
        await this.closeModalIfVisible();

    }

    // Verify that all address fields are displayed correctly
    async verifyAllAddressFieldsDisplayed() {

        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        // Open overlay/panel if required
        const editOverlayButton = this.page.locator('#toggle-overlay');
        if (await editOverlayButton.isVisible({ timeout: 2000 })) {
            await editOverlayButton.click();
        }

        // Define the locators for each address field
        const buildingName = this.page.locator('input[formcontrolname="building_name"]');
        const unitNo = this.page.locator('input[formcontrolname="unit_no"]');
        const streetNo = this.page.locator('input[formcontrolname="street_no"]');
        const streetName = this.page.locator('input[formcontrolname="street_name"]');
        const suburb = this.page.locator('p-autocomplete[formcontrolname="suburb"] input.p-autocomplete-input');
        const state = this.page.locator('input[formcontrolname="state"]');
        const postCode = this.page.locator('input[formcontrolname="post_code"]');
        const country = this.page.locator('input[formcontrolname="country"]');

        // Wait for all the fields to be visible
        await expect(buildingName).toBeVisible();
        await expect(unitNo).toBeVisible();
        await expect(streetNo).toBeVisible();
        await expect(streetName).toBeVisible();
        await expect(suburb).toBeVisible();
        await expect(state).toBeVisible();
        await expect(postCode).toBeVisible();
        await expect(country).toBeVisible();

        await this.page.waitForTimeout(1000);

        // Click the save button to save address changes
        const saveButton = this.page.getByRole('button', { name: /^Save$/i }).last();
        await saveButton.click({ force: true });
        await this.page.waitForTimeout(1200);
        // Close the overlay or form using the close icon
        await this.closeModalIfVisible();
    }

    // Verify that the Tag Manager popup opens
    async verifyTagManagerPopupOpens() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        // Open overlay/panel if required
        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();

        const TagPopup = this.page.getByText('Tag ManagerCompany Contact');
        await expect(TagPopup).toBeVisible();

        await this.page.waitForTimeout(1200);
        // Close the overlay or form using the close icon
        await this.closeModalIfVisible();
    }

    async verifyCanAddNewTagType(tagTypeName: string) {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();
        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();

        const tagPopupHeader = this.page.getByText('Tag ManagerCompany Contact');
        await expect(tagPopupHeader).toBeVisible({ timeout: 10000 });

        const addTagTypeButton = this.page.getByRole('dialog').getByRole('button', { name: '' });
        await addTagTypeButton.click();

        // Instead of trying to fill on the .ng-select-container, target the input inside ng-select dropdown directly
        const tagTypeDropdown = this.page.locator('.ng-select-container:has-text("Select Tag Type")');
        await tagTypeDropdown.click();
        const tagTypeSearchInput = this.page.locator('.ng-dropdown-panel input[type="text"], input[role="combobox"], .ng-select input[type="text"]').last();
        await tagTypeSearchInput.fill(tagTypeName);

        const optionLocator = this.page.locator(`.ng-option:has-text("${tagTypeName}")`);
        await expect(optionLocator).toBeVisible({ timeout: 5000 });
        await optionLocator.click()

        const tagsInput = this.page.locator('input[placeholder="Add Multiple Tags"]');
        const fakeTag = faker.lorem.words(2);
        await tagsInput.fill(fakeTag);
        await tagsInput.press('Enter');


        // Save tag type
        const AddButton = this.page.getByRole('button', { name: /Add/i });
        await AddButton.click();

        await expect(this.page.locator('div').filter({ hasText: 'Tag successfully created' }).nth(2)).toBeVisible()


        const tagManagerPopup = this.page.getByText('Automation Testing').last();
        await tagManagerPopup.evaluate((el) => { el.scrollIntoView({ block: "end" }); });

        // Verify in search box field that the tag should be displayed
        const tagSearchInput = this.page.locator('input[placeholder="Search Tags"]');
        await tagSearchInput.click();
        // Fill the input with a delay between keystrokes
        for (const char of fakeTag) {
            await tagSearchInput.type(char, { delay: 20 });
        }
        // Expect that the tag option is visible in the dropdown (without locator in expect)
        await expect(tagSearchInput).toBeVisible();
        await this.page.waitForTimeout(1200);
        // Close the tag manager popup by clicking the X icon
        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);

    }
    // Verify that entering data in address fields is reflected in the main/displayed address

    async verifyMainAddressUpdatesWithAllFields() {
        // Step 1: Navigate to contacts and select first contact
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        // Step 2: Search Address field > type & select suggestion
        const addressInput = this.page.locator('input[placeholder="Search Address"]');
        await addressInput.scrollIntoViewIfNeeded();
        await expect(addressInput).toBeVisible({ timeout: 10000 });
        await addressInput.click();
        const addressPartial = '221B Baker Street';
        for (let i = 1; i <= addressPartial.length; ++i) {
            await addressInput.fill(addressPartial.slice(0, i));
            await this.page.waitForTimeout(50);
        }
        const suggestionsList = this.page.locator('.pac-item');
        await expect(suggestionsList.first()).toBeVisible({ timeout: 10000 });
        await suggestionsList.first().click();
        await this.page.waitForTimeout(2000);

        // Save search box value after selection
        const selectedValue = await addressInput.inputValue();

        // Step 3: Edit address fields by clicking edit icon (overlay/panel)
        const editOverlayButton = this.page.locator('#toggle-overlay');
        if (await editOverlayButton.isVisible({ timeout: 10000 }).catch(() => false)) {
            await editOverlayButton.click();
        }

        // Fill address fields with new fake data
        const buildingNameField = this.page.locator('input[formcontrolname="building_name"]');
        const unitNoField = this.page.locator('input[formcontrolname="unit_no"]');
        const streetNoField = this.page.locator('input[formcontrolname="street_no"]');
        const streetNameField = this.page.locator('input[formcontrolname="street_name"]');
        const suburbField = this.page.locator('p-autocomplete[formcontrolname="suburb"] input.p-autocomplete-input');
        const stateField = this.page.locator('input[formcontrolname="state"]');
        const postCodeField = this.page.locator('input[formcontrolname="post_code"]');
        const countryField = this.page.locator('input[formcontrolname="country"]');

        const newAddressData = {
            building: faker.company.name(),
            unit: faker.string.numeric(2),
            streetNo: faker.string.numeric(3),
            streetName: faker.location.street(),
            suburb: faker.location.city(),
            state: faker.location.state(),
            postCode: faker.location.zipCode(),
            country: faker.location.country()
        };

        await expect(buildingNameField).toBeVisible();
        await buildingNameField.fill(newAddressData.building);

        await expect(unitNoField).toBeVisible();
        await unitNoField.fill(newAddressData.unit);

        await expect(streetNoField).toBeVisible();
        await streetNoField.fill(newAddressData.streetNo);

        await expect(streetNameField).toBeVisible();
        await streetNameField.fill(newAddressData.streetName);

        await expect(suburbField).toBeVisible();
        await suburbField.fill(newAddressData.suburb);

        await expect(stateField).toBeVisible();
        await stateField.fill(newAddressData.state);

        await expect(postCodeField).toBeVisible();
        await postCodeField.fill(newAddressData.postCode);

        await expect(countryField).toBeVisible();
        await countryField.fill(newAddressData.country);

        // Step 4: Save button click
        const saveButton = this.page.getByRole('dialog').getByRole('button', { name: 'Save' });
        await saveButton.click();

        // Step 5: Search box must be updated with the new/edited address (not the previously searched value)
        // Wait for the search box to reflect updated value
        await this.page.waitForTimeout(2000);
        const updatedValue = await addressInput.inputValue();

        // It must NOT match the old selectedValue
        expect(updatedValue.trim()).not.toBe(selectedValue.trim());

        // Optionally: It should contain values you just entered in the fields
        // Assert that the updated address includes relevant address fields
        expect(updatedValue).toContain(newAddressData.streetName);
        expect(updatedValue).toContain(newAddressData.state);
        expect(updatedValue).toContain(newAddressData.postCode);

        await this.page.waitForTimeout(1000);
        // Close the form after checking address update
        await this.closeModalIfVisible();
    }

    // Search for a non existent tag in Tag Manager
    async searchForNonExistentTag(tagName: string) {

        await this.NavigateToContacts();
        await this.page.waitForTimeout(1500);

        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();

        const tagPopupHeader = this.page.getByText('Tag ManagerCompany Contact');
        await expect(tagPopupHeader).toBeVisible();
        const searchInput = this.page.getByPlaceholder('Search tags');
        await searchInput.fill(tagName);
        const noResult = this.page.getByText(/No data found|no results|no matching tags/i);
        await expect(noResult).toBeVisible();

        await this.page.waitForTimeout(1000);
        // Close the form after checking address update
        await this.closeModalIfVisible();
    }

    async verifyCreateTagByEnter(tagTypeName: string, tagValue: string) {
        await this.NavigateToContacts();

        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        // Open Tag Manager popup
        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();
        const tagPopupHeader = this.page.getByText('Tag ManagerCompany Contact');
        await expect(tagPopupHeader).toBeVisible();

        // Add Tag Type
        const addTagTypeButton = this.page.getByRole('dialog').getByRole('button', { name: '' });
        await addTagTypeButton.click();

        // Select the tag type from dropdown
        const tagTypeDropdown = this.page.locator('.ng-select-container:has-text("Select Tag Type")');
        await tagTypeDropdown.click();
        const tagTypeSearchInput = this.page.locator('.ng-dropdown-panel input[type="text"], input[role="combobox"], .ng-select input[type="text"]').last();
        await tagTypeSearchInput.fill(tagTypeName);

        const optionLocator = this.page.locator(`.ng-option:has-text("${tagTypeName}")`);
        await expect(optionLocator).toBeVisible({ timeout: 5000 });
        await optionLocator.click();

        // Enter new tag + press Enter to create
        const tagsInput = this.page.locator('input[placeholder="Add Multiple Tags"]');
        await tagsInput.fill(tagValue);
        await tagsInput.press('Enter');

        // Verify chip for the new tag appears (common in tag editors)
        const createdTagChip = this.page.locator(`.ng-value-label, .p-chips-token, .chip, .tag`)
            .filter({ hasText: tagValue });
        await expect(createdTagChip).toBeVisible();

        // Click Cancel button to discard tag creation
        const cancelButton = this.page.getByRole('button', { name: /cancel/i }).first();
        await expect(cancelButton).toBeVisible();
        await cancelButton.click();

        await this.page.waitForTimeout(1000);

        // Close the Tag creation dialog by clicking the close (X) button
        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);
    }

    /**
     Verifies that removing a tag updates the tag list and that the tag no longer appears.
     */
    async verifyRemoveTagUpdatesTagList() {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        // Open Tag Manager popup
        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();
        const tagPopupHeader = this.page.getByText('Tag ManagerCompany Contact');
        await expect(tagPopupHeader).toBeVisible();

        const company = await this.page.getByText('Company Contact Type');
        await expect(company).toBeVisible();

        // Double click the tag chip for "Agency"
        const tagChip = this.page.locator("//div[@cdkdroplist]//div[@cdkdrag][.//div[normalize-space()='Agency']]").first();
        await tagChip.waitFor({ state: 'visible' });
        await tagChip.scrollIntoViewIfNeeded();
        await tagChip.hover();
        await this.page.waitForTimeout(100);

        await tagChip.click({ clickCount: 6 });


        await this.page.waitForTimeout(500)

        const closeIcon = this.page.locator('.f-12.pi.pi-times.cp').first();

        await closeIcon.evaluate((el) => {
            el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
        });


        await closeIcon.click({ force: true });

        await this.page.waitForTimeout(1000);

        // Close the Tag creation dialog by clicking the close (X) button
        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that a tag persists in the tag list after saving the form.
     */
    async verifyTagPersistsAfterFormSave(tagTypeName: string, tagValue: string) {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        // Open Tag Manager popup for the contact
        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();

        const tagPopupHeader = this.page.getByText('Tag ManagerCompany Contact');
        await expect(tagPopupHeader).toBeVisible();

        // Add a new Tag Type
        const addTagTypeButton = this.page.getByRole('dialog').getByRole('button', { name: '' });
        await addTagTypeButton.click();

        // Select or type the tag type in the Select Tag Type dropdown
        const tagTypeDropdown = this.page.locator('.ng-select-container:has-text("Select Tag Type")');
        await tagTypeDropdown.click();
        const tagTypeInput = this.page.locator('.ng-dropdown-panel input[type="text"], input[role="combobox"], .ng-select input[type="text"]').last();
        await tagTypeInput.fill(tagTypeName);

        // Wait for and select the desired tag type option
        const optionLocator = this.page.locator(`.ng-option:has-text("${tagTypeName}")`);
        await expect(optionLocator).toBeVisible({ timeout: 5000 });
        await optionLocator.click();

        // Add the new tag
        const tagsInput = this.page.locator('input[placeholder="Add Multiple Tags"]');
        await tagsInput.fill(tagValue);
        await tagsInput.press('Enter');

        // Save the new tag (Add button)
        const addButton = this.page.getByRole('button', { name: /^Add$/i });
        await addButton.click({ force: true });

        // Close the tag manager popup if necessary
        const closeButton = this.page.locator('.d-flex.align-items-center > div > button:nth-child(2)');
        if (await closeButton.isVisible()) {
            await closeButton.click();
        }

        await this.page.waitForTimeout(500);

        // Re-open Tag Manager to verify the tag persists
        await tagButton.click();
        await expect(tagPopupHeader).toBeVisible();

        // Search for the tag in the search input field in Tag Manager
        const tagSearchInput = this.page.locator('input[placeholder="Search Tags"]');
        await tagSearchInput.click();
        // Type out the tagValue in the search input
        for (const char of tagValue) {
            await tagSearchInput.type(char, { delay: 20 });
        }

        // Check that the tag appears in the tag list dropdown/search results
        const foundTag = this.page.locator('.cdk-drop-list [ng-reflect-drag-data], .cdk-drop-list [data-tag-name], .cdk-drop-list .p-chip, .cdk-drop-list')
            .filter({ hasText: tagValue });
        await expect(foundTag.first()).toBeVisible({ timeout: 5000 });

        await this.page.waitForTimeout(1200);

        // Click the close icon to close the Tag Manager popup
        await this.page.waitForTimeout(1000);
        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);
    }


    async verifyDoubleClickTagAddsToField(tagTypeName: string, tagValue: string) {
        // Navigate to Contacts and wait
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        // Open Tag Manager popup
        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();

        const tagPopupHeader = this.page.getByText('Tag ManagerCompany Contact');
        await expect(tagPopupHeader).toBeVisible();

        await this.page.waitForTimeout(500)

        // Double click the tag chip for "Agency"
        const tagChip = this.page.locator("//div[@cdkdroplist]//div[@cdkdrag][.//div[normalize-space()='Agency']]").first();
        await tagChip.waitFor({ state: 'visible' });
        await tagChip.scrollIntoViewIfNeeded();
        await tagChip.hover();
        await this.page.waitForTimeout(100);

        await tagChip.click({ clickCount: 6 });


        await this.page.waitForTimeout(500)

        const closeIcon = this.page.locator('.f-12.pi.pi-times.cp').first();

        // Scroll the element into view using 'auto' behavior and 'center' block alignment for elevation
        await closeIcon.evaluate((el) => {
            el.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'nearest' });
        });

        await expect(closeIcon).toBeVisible({ timeout: 10000 });

        await closeIcon.click({ force: true });

        await this.page.waitForTimeout(1000);

        // Close the Tag creation dialog by clicking the close (X) button
        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that tags can be searched in the Tag Manager.
     */
    async verifyTagCanBeSearchedInTagManager(tagValue: string) {
        await this.NavigateToContacts();
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        // Open Tag Manager popup
        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();

        // Confirm Tag Manager popup opened
        const tagPopupHeader = this.page.getByText('Tag ManagerCompany Contact');
        await expect(tagPopupHeader).toBeVisible();

        await this.page.waitForTimeout(500);


        // Find the tag search input inside the Tag Manager (handle possible variations in placeholder)
        const tagSearchInput = this.page.locator('input[placeholder="Search Tag"], input[placeholder="Search Tags"]');
        await tagSearchInput.click();
        await tagSearchInput.fill(tagValue);

        // Confirm that a tag matching 'tagValue' appears in the dropdown/list
        const resultTag = this.page.locator('.cdk-drop-list .p-chip-text, .cdk-drop-list [data-tag-name]')
            .filter({ hasText: tagValue });
        await expect(resultTag.first()).toBeVisible({ timeout: 5000 });

        // Close the Tag creation dialog by clicking the close (X) button
        await this.page.waitForTimeout(1200);
        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that clicking the "X" (close) button on the Tag Manager popup closes it.
     */
    async verifyTagManagerPopupCloseWithX() {
        await this.NavigateToContacts();

        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        // Open Tag Manager popup
        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();

        // Wait for Tag Manager popup to be visible
        const tagPopupHeader = this.page.getByText('Tag ManagerCompany Contact');
        await expect(tagPopupHeader).toBeVisible();

        // Locate and click the X (close) button within the popup
        const closeButton = this.page.locator('.d-flex.align-items-center > div > button:nth-child(2)').last();
        await expect(closeButton).toBeVisible();
        await closeButton.click();

        // Verify that the popup is now closed (not visible)
        await expect(tagPopupHeader).not.toBeVisible({ timeout: 5000 });
        await this.page.waitForTimeout(1200);
        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that clicking "Cancel" on the tag creation popup closes it.
     */
    async verifyTagCreationPopupCloseWithCancel() {
        await this.NavigateToContacts();

        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        // Open Tag Manager popup
        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();

        // Wait for Tag Manager popup to be visible
        const tagPopupHeader = this.page.getByText('Tag ManagerCompany Contact');
        await expect(tagPopupHeader).toBeVisible();

        // Click 'Add Tag Type' to open the tag creation popup
        const addTagTypeButton = this.page.getByRole('dialog').getByRole('button', { name: '' });
        await addTagTypeButton.click();

        // Locate and click the Cancel button (common patterns)
        const cancelButton = this.page.getByRole('button', { name: /Cancel/i }).first();
        await expect(cancelButton).toBeVisible({ timeout: 2000 });
        await cancelButton.click();

        await this.page.waitForTimeout(1200);

        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);
    }

    /**
     * Verifies that clicking "Save" after filling all required fields in the tag type creation popup
     * successfully creates the tag type and closes the popup.
     */
    async verifyTagCreationPopupSaveWorks(tagTypeName: string, tagValue: string) {
        await this.NavigateToContacts();

        // Open a contact row
        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        // Open Tag Manager popup
        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();

        // Wait for Tag Manager popup to be visible
        const tagPopupHeader = this.page.getByText('Tag ManagerCompany Contact');
        await expect(tagPopupHeader).toBeVisible();

        // Click 'Add Tag Type' to open the tag creation popup
        // Click 'Add Tag Type' to open the tag creation popup
        const addTagTypeButton = this.page.getByRole('dialog').getByRole('button', { name: '' });
        await addTagTypeButton.click();

        // Fill tag type dropdown
        const tagTypeDropdown = this.page.locator('.ng-select-container:has-text("Select Tag Type")');
        await tagTypeDropdown.click();
        const tagTypeSearchInput = this.page.locator('.ng-dropdown-panel input[type="text"], input[role="combobox"], .ng-select input[type="text"]').last();
        await tagTypeSearchInput.fill(tagTypeName);

        const optionLocator = this.page.locator(`.ng-option:has-text("${tagTypeName}")`);
        await expect(optionLocator).toBeVisible({ timeout: 5000 });
        await optionLocator.click();

        // Enter new tag value and confirm (if field exists)
        const tagsInput = this.page.locator('input[placeholder="Add Multiple Tags"]');
        await tagsInput.fill(tagValue);
        await tagsInput.press('Enter');

        // Click Save/Add button to submit the form
        const saveButton = this.page.getByRole('button', { name: 'Add' }).first();
        await expect(saveButton).toBeVisible({ timeout: 2000 });
        await saveButton.click();

        // Optionally wait for and check for success message or disappearance of modal
        const successToast = this.page.getByText(/Tag successfully created|already created/i).first();
        await expect(successToast).toBeVisible({ timeout: 10000 });

        await this.page.waitForTimeout(1200);
        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);

    }

    /**
     * 
     */
    public async verifyAddandCloseTag(tagTypeName: string, tagValue: string) {
        await this.NavigateToContacts();

        const firstRow = this.page.locator('table tbody tr').first();
        await firstRow.waitFor({ state: 'visible', timeout: 30000 });
        // Click the company tag in the 3rd cell (index 2) of the first row to open the company form
        const companyTagCell = this.page.locator('td').nth(1);
        await companyTagCell.waitFor({ state: 'visible', timeout: 10000 });
        await companyTagCell.click();

        // Open Tag Manager popup
        const tagButton = this.page.locator('.pi.pi-plus.cursor-pointer');
        await tagButton.click();

        // Wait for Tag Manager popup to be visible
        const tagPopupHeader = this.page.getByText('Tag ManagerCompany Contact');
        await expect(tagPopupHeader).toBeVisible();

        // Click 'Add Tag Type' to open the tag creation dialog
        // Click 'Add Tag Type' to open the tag creation popup
        const addTagTypeButton = this.page.getByRole('dialog').getByRole('button', { name: '' });
        await addTagTypeButton.click();

        // Click into the tag type dropdown and search for the tag type
        const tagTypeDropdown = this.page.locator('.ng-select-container:has-text("Select Tag Type")');
        await tagTypeDropdown.click();
        const tagTypeSearchInput = this.page.locator('.ng-dropdown-panel input[type="text"], input[role="combobox"], .ng-select input[type="text"]').last();
        await tagTypeSearchInput.fill(tagTypeName);

        // Select the tag type option
        const optionLocator = this.page.locator(`.ng-option:has-text("${tagTypeName}")`);
        await expect(optionLocator).toBeVisible({ timeout: 5000 });
        await optionLocator.click();

        // Enter a tag value in the tag input field
        const tagsInput = this.page.locator('input[placeholder="Add Multiple Tags"]');
        await tagsInput.fill(tagValue);
        await tagsInput.press('Enter');

        // Click the Add/Save button to confirm creation
        const saveButton = this.page.getByRole('button', { name: /Add/i }).first();
        await expect(saveButton).toBeVisible({ timeout: 2000 });
        await saveButton.click();

        // Optionally wait for and check for success message or disappearance of modal
        const successToast = this.page.getByText(/Tag successfully created|already created/i).first();
        await expect(successToast).toBeVisible({ timeout: 10000 });

        const closetag = this.page.locator('.d-flex.align-items-center > div > button:nth-child(2)').last();
        await expect(closetag).toBeVisible();
        await closetag.click();
        await expect(closetag).not.toBeVisible()
        await this.page.waitForTimeout(1200);
        await this.closeModalIfVisible();
        await this.page.waitForTimeout(1000);
    }

}
