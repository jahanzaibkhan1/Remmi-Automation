import { test as base } from '@playwright/test';
import { ContactActions } from './contactAction';
import * as path from 'path';

const managerSessionPath = path.join(__dirname, '../../sessions/manager-session.json');
const DASHBOARD_URL = process.env.DASHBOARD_URL;

// Extend test to provide sessionPage for authenticated context
const test = base.extend<{ sessionPage: any }>({
    sessionPage: [async ({ browser }, use) => {
        const context = await browser.newContext({ storageState: managerSessionPath });
        try {
            const page = await context.newPage();
            await page.goto(DASHBOARD_URL);
            await use(page);
        } finally {
            // Optionally close context if desired in cleanup
        }
    }, { scope: 'worker' }]
});


test.describe('Contacts "Lead Form" Tab - E2E Tests', () => {
    test('Verify that clicking the create new button opens the lead form', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyNewLeadButtonOpensForm();
    });

    test('Verify that selecting an Existing Client removes contact creation fields', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyExistingClientRemovesContactFields();
    });

    test('Verify that removing an Existing Client brings back contact creation fields', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyContactFieldsReturnOnExistingClientRemoval();
    });

    test('Verify that selecting an Existing Client links the contact to the contact field', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyExistingClientSelectionLinksContact();
    });

    test('Verify that clicking the close button closes the form', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyCloseButtonClosesForm();
    });

    test('Verify that clicking the save & close button saves the lead and closes the form', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifySaveAndCloseButtonSavesLeadAndClosesForm();
    });

    test('Verify that selecting Buyer or Prospective Buyer displays the correct Requirements fields', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyBuyerRequirementsFields();
    });

    test('Verify that selecting Developer or Prospective Developer displays the correct Requirements fields', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyDeveloperRequirementsFields();
    });

    test('Verify that selecting Seller or Prospective Seller displays the correct Requirements fields', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifySellerRequirementsFields();
    });

    test('Verify that saving a lead displays the data in the lead list view', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyLeadAppearsInLeadModule();
    });

    test('Verify that selecting Related Properties displays a new dropdown', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyRelatedLeadDropdownVisible();
    });

});