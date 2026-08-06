import { test } from '../../fixtures/session.fixture';
import { ProjectGridViewPage as ProjectPage } from '../../pages/projects/ProjectGridViewPage';

// Extend test to provide sessionPage for authenticated context

test.describe('Projects - E2E Tests', () => {

    test('Test 1: Verify project search by name', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyProjectCanBeSearchedByName('Nexton');
    });

    test('Test 2: Search with partial project name', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyProjectCanBeSearchedByPartialName('Next');
    });

    test('Test 3: Search with invalid project name', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyProjectSearchWithInvalidName('InvalidProjectName123');
    });

    test('Test 4: Verify that project image is displayed correctly in Grid View', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyProjectImageDisplayedInGridView('Nexton');
    });
    
    test('Test 5: Verify that a placeholder image appears for projects with no uploaded image', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyPlaceholderImageForProjectWithNoImage();
    });

    test('Test 6: Verify that clicking the Reset button', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyTabsAndResetAfterSearch('East');
    });

    test('Test 7: Verify default tab is "Active"', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyDefaultTabIsActive();
    });

    test('Test 8: Verify projects listed are under "Active" tab', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyProjectsUnderActiveTab('East Village Vila');
    });

    test('Test 9: Verify projects listed are under "Inactive" tab', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyProjectsUnderInactiveTab('Al kabir heights');
    });

    test('Test 10: Verify precinct grouping under tabs', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyPrecinctIsGroupedUnderTab('Tested');
    });

    test('Test 11: Verify clicking precinct opens project/lot/EOI tabs', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyClickingPrecinctOpensTabs();
    });

    test('Test 12: Verify that a precinct-allocated project does not appear in the "Active" tab after viewing inside a precinct', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyPrecinctAllocatedProjectNotInActiveTabAfterPrecinctClick();
    });

    test('Test 13: Delete precinct shows project back in active tab', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyProjectReappearsInActiveTabAfterPrecinctDeletion();
    });

    test('Test 14: Switch between grid and list views', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.switchBetweenProjectViews();
    });

    test('Test 15: Click plus icon to open project popup', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyAndCloseProjectPopup();
    });

    test('Test 16: Validate popup fields - project name & status', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyAndCloseProjectPopup();
    });

    test('Test 17: Create project with valid data', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.createProjectWithValidData();
    });

    test('Test 18: Save popup with empty fields', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.saveProjectPopupWithEmptyFields();
    });

    test('Test 19: Cancel button closes the project popup', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyAndCloseProjectPopup();
    });

    test('Test 20: Cross icon closes the project popup', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.closeProjectPopupWithCrossIcon();
    });

    test('Test 21: Verify project opens with the "General" tab selected after entering project name and status', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.createProjectWithValidData();
    });

    test('Test 22: Verify that "Pin to Dashboard" option is visible on right-clicking a project card', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyPinToDashboardOptionVisibleOnRightClick('East Village Vila');
    });

    test('Test 23: Clicking "Pin to Dashboard" pins the project and shows pin icon on card', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        const projectName = 'East Village Vila';
        await project.pinProjectAndVerifyIcon(projectName);
    });

    test('Test 24: Clicking "Unpin from Dashboard" removes the pin icon from the project card', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        const projectName = 'East Village Vila';
        await project.unpinProjectAndVerifyRemoval(projectName);
    });

});