import { test as base, expect } from '@playwright/test';
import { ContactActions } from './contactAction';

const managerSessionPath = require('path').join(__dirname, '../../sessions/manager-session.json');
const DASHBOARD_URL = process.env.DASHBOARD_URL;

const test = base.extend<{ sessionPage: any }>({
    sessionPage: [async ({ browser }, use) => {
        const context = await browser.newContext({ storageState: managerSessionPath });
        try {
            const page = await context.newPage();
            await page.goto(DASHBOARD_URL);
            await use(page);
        } finally {

        }
    }, { scope: 'worker' }]
});

test.describe('Related Contact', () => {

    test('Search and select an existing contact', async ({ sessionPage }) => {
        const contactActions = new ContactActions(sessionPage);
        await contactActions.verifySearchAndSelectRelatedContact();
    });

    test('Associate button should add contact to the list', async ({ sessionPage }) => {
        const contactActions = new ContactActions(sessionPage);
        await contactActions.associateContactAndVerify();
    });

    test('The search icon is visible inside the Associate contact field', async ({ sessionPage }) => {
        const contactActions = new ContactActions(sessionPage);
        await contactActions.verifySearchIconInAssociateField();
    });

    test('Verify that the agents list is displayed correctly', async ({ sessionPage }) => {
        const contactActions = new ContactActions(sessionPage);
        await contactActions.verifyAgentsListIsDisplayedCorrectly();
    });

    test('Search field should show "Add New Contact" when no results found', async ({ sessionPage }) => {
        const contactActions = new ContactActions(sessionPage);
        await contactActions.verifyCreateNewContactOptionWhenNoResults();
    });

    test('Clicking "Add New Contact" should open a new contact form', async ({ sessionPage }) => {
        const contactActions = new ContactActions(sessionPage);
        await contactActions.verifyAddNewContactOpensForm();
    });

    test('Newly created contact should appear in the search list', async ({ sessionPage }) => {
        const contactActions = new ContactActions(sessionPage);
        await contactActions.verifyNewlyCreatedContactIsAddedToRelatedList();
    });

    test('Contact type and relationship tags should be draggable', async ({ sessionPage }) => {
        const contactActions = new ContactActions(sessionPage);
        await contactActions.verifyTagsAreDraggable();
    });

});