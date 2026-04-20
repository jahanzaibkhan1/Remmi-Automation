import { test as base } from '@playwright/test';
import { ProjectActions } from './projectAction';
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
            // Optionally handle context cleanup
        }
    }, { scope: 'worker' }]
});

test.describe('Projects - E2E Tests', () => {

    test('Test 1: Verify project search by name', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyProjectCanBeSearchedByName('East Village Vila');
    });

    test('Test 2: Search with partial project name', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyProjectCanBeSearchedByPartialName('East');
    });

    test('Test 3: Search with invalid project name', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyProjectSearchWithInvalidName('InvalidProjectName123');
    });

    test('Test 4: Verify that project image is displayed correctly in Grid View', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyProjectImageDisplayedInGridView('East Village Vila');
    });
    
    test('Test 5: Verify that a placeholder image appears for projects with no uploaded image', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyPlaceholderImageForProjectWithNoImage();
    });

    test('Test 6: Verify that clicking the Reset button', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyTabsAndResetAfterSearch('East');
    });

    test('Test 7: Verify default tab is "Active"', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyDefaultTabIsActive();
    });

    test('Test 8: Verify projects listed are under "Active" tab', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyProjectsUnderActiveTab('East Village Vila');
    });

    test('Test 9: Verify projects listed are under "Inactive" tab', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyProjectsUnderInactiveTab('Al kabir heights');
    });

});