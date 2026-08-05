import { test } from '../../fixtures/session.fixture';
import { ContactPage } from '../../pages/contacts/ContactPage';

// Extend test to provide sessionPage for authenticated context

test.describe('Contacts "Lead" Tab - E2E Tests', () => {
    test('Open "Lead" tab', async ({ sessionPage }) => {
        const contact = new ContactPage(sessionPage);
        await contact.openLeadTab();
    });

    test('Verify new lead button', async ({ sessionPage }) => {
        const contact = new ContactPage(sessionPage);
        await contact.verifyNewLeadButton();
    });

    test('Verify lead appears in the Lead module after creation', async ({ sessionPage }) => {
        const contact = new ContactPage(sessionPage);
        await contact.verifyLeadAppearsInLeadModule();
    });

    test('Verify that clicking the contact name in the Lead tab opens the contact form in a new browser tab', async ({ sessionPage }) => {
        const contact = new ContactPage(sessionPage);
        await contact.verifyContactNameOpensInNewTab();
    });

    test('Verify lead status details', async ({ sessionPage }) => {
        const contact = new ContactPage(sessionPage);
        await contact.verifyLeadStatusDetails();
    });

    test('Verify duplicate lead creation', async ({ sessionPage }) => {
        const contact = new ContactPage(sessionPage);
        await contact.verifyDuplicateLeadCreation();
    });

    test('Verify lead source details', async ({ sessionPage }) => {
        const contact = new ContactPage(sessionPage);
        await contact.verifyLeadSourceDetails();
    });

    test('Verify duplicate lead creation does not merge records', async ({ sessionPage }) => {
        const contact = new ContactPage(sessionPage);
        await contact.verifyDuplicateLeadDoesNotMergeRecords();
    });

    test('Verify lead list updates after a new lead is added', async ({ sessionPage }) => {
        const contact = new ContactPage(sessionPage);
        await contact.verifyLeadListUpdatesAfterAdd();
    });

    test('Verify lead listing/project details', async ({ sessionPage }) => {
        const contact = new ContactPage(sessionPage);
        await contact.verifyLeadListingProjectDetails();
    });

    test('Verify lead modification', async ({ sessionPage }) => {
        const contact = new ContactPage(sessionPage);
        await contact.verifyLeadModification();
    });

    test('Verify lead status can be changed and displayed correctly', async ({ sessionPage }) => {
        const contact = new ContactPage(sessionPage);
        await contact.verifyLeadStatusChange();
    });

    test('Verify lead record time and date', async ({ sessionPage }) => {
        const contact = new ContactPage(sessionPage);
        await contact.verifyLeadRecordTimeAndDate();
    });

    test('Verify navigation between tabs', async ({ sessionPage }) => {
        const contact = new ContactPage(sessionPage);
        await contact.verifyNavigationBetweenTabsAndLeadPresence();
    });

});