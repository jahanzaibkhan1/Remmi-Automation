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

test.describe('Contacts "Lead" Tab - E2E Tests', () => {
    test('Open "Lead" tab', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.openLeadTab();
    });

    test('Verify new lead button', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyNewLeadButton();
    });

    test('Verify lead appears in the Lead module after creation', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyLeadAppearsInLeadModule();
    });

    test('Verify that clicking the contact name in the Lead tab opens the contact form in a new browser tab', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyContactNameOpensInNewTab();
    });

    test('Verify lead status details', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyLeadStatusDetails();
    });

    test('Verify duplicate lead creation', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyDuplicateLeadCreation();
    });

    test('Verify lead source details', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyLeadSourceDetails();
    });

    test('Verify duplicate lead creation does not merge records', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyDuplicateLeadDoesNotMergeRecords();
    });

    test('Verify lead list updates after a new lead is added', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyLeadListUpdatesAfterAdd();
    });

    test('Verify lead listing/project details', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyLeadListingProjectDetails();
    });

    test('Verify lead modification', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyLeadModification();
    });

    test('Verify lead status can be changed and displayed correctly', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyLeadStatusChange();
    });

    test('Verify lead record time and date', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyLeadRecordTimeAndDate();
    });

    test('Verify navigation between tabs', async ({ sessionPage }) => {
        const contact = new ContactActions(sessionPage);
        await contact.verifyNavigationBetweenTabsAndLeadPresence();
    });

});