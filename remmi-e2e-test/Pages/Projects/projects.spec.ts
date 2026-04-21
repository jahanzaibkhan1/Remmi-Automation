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

    test('Test 10: Verify precinct grouping under tabs', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyPrecinctIsGroupedUnderTab('Tested');
    });

    test('Test 11: Verify clicking precinct opens project/lot/EOI tabs', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyClickingPrecinctOpensTabs();
    });

    test('Test 12: Verify that a precinct-allocated project does not appear in the "Active" tab after viewing inside a precinct', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyPrecinctAllocatedProjectNotInActiveTabAfterPrecinctClick();
    });

    test('Test 13: Delete precinct shows project back in active tab', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyProjectReappearsInActiveTabAfterPrecinctDeletion();
    });

    test('Test 14: Switch between grid and list views', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.switchBetweenProjectViews();
    });

    test('Test 15: Click plus icon to open project popup', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyAndCloseProjectPopup();
    });

    test('Test 16: Validate popup fields - project name & status', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyAndCloseProjectPopup();
    });

    test('Test 17: Create project with valid data', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.createProjectWithValidData();
    });

    test('Test 18: Save popup with empty fields', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.saveProjectPopupWithEmptyFields();
    });

});