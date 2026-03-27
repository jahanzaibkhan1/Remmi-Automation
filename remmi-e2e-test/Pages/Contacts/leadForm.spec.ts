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

    test('Verify that selecting Related Properties assigns the lead to the selected module', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyRelatedLeadDropdownAssignsToModule();
    });

    test('Verify that lead status , lead source, and Agent Responsible fields update correctly', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyLeadStatusChange();
    });

    test('Verify that Agent Responsible and Owner fields auto fill with the logged in user', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyAgentResponsibleAndOwnerAutofill();
    });

    test('Verify that Agent Responsible and Owner can be changed', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyAgentResponsibleAndOwnerCanBeChanged();
    });

    test('Verify that an error message appears when entering an invalid email format', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyInvalidEmailShowsError();
    });

    test('Verify that selecting an Existing Client auto fills Contact Name, Mobile, Email, and Suburb', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyExistingClientAutofillsContactFields();
    });

    test('Verify that closing the form without saving does not retain data', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyFormDataNotRetainedOnClose();
    });

    test('Verify that a lead remains linked to the correct client after editing', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyLeadRemainsLinkedToClientAfterEdit();
    });

    test('Verify that related properties dropdown resets after removing selection', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyRelatedPropertiesDropdownResetsAfterRemovingSelection();
    });

    test('Verify that a lead can be saved with only a lead type selected', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyLeadCanBeSavedWithOnlyLeadTypeSelected();
    });

    test('Verify that saving a lead updates the timestamp correctly', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyLeadRecordTimeAndDate();
    });

    test('Verify that clicking the contact name opens the contact form in a new tab', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyContactNameOpensContactFormInNewTab();
    });

});