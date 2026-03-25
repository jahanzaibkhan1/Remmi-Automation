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

});