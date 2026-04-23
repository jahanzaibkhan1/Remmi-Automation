import { test as base, expect } from '@playwright/test';
import { ProjectActions } from './projectAction';
import * as path from 'path';

const managerSessionPath = path.join(__dirname, '../../sessions/manager-session.json');
const DASHBOARD_URL = process.env.DASHBOARD_URL;

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

test.describe('Projects - List View Tests', () => {
    test('Verify project search by name in List View', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyProjectCanBeSearchedByNameInListView('East Village Vila');
    });

    test('Search with no matching results in List View', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyProjectSearchWithInvalidNameInListView('NoSuchProjectABC123');
    });

    test('Verify active tab filtering in List View', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyActiveTabFilteringInListView();
    });

    test('Verify inactive tab filtering in List View', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyInactiveTabFilteringInListView();
    });

    test('Select single project manager in List View', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.selectSingleProjectManagerInListView('Jahanzaib Xenex');
    });

    test('Select multiple project managers in List View', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.selectMultipleProjectManagersInListView(['Jahanzaib Xenex', 'Hina Agent']);
    });

    test('Select All project managers in List View', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.selectAllProjectManagersInListView();
    });

    test('Deselect All managers in PM dropdown in List View', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.deselectAllProjectManagersInListView();
    });

    test('Search within Project Manager dropdown in List View', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.selectSingleProjectManagerInListView('Jahanzaib Xenex');
    });

    test('Verify default view popup opens in List View', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyDefaultViewPopupOpensInListView();
    });

    test('Create a new custom view in List View', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        const uniqueViewName = `Test View`;
        await project.createNewCustomViewInListView(uniqueViewName);
    });

    test('Share view with agent and team in List View', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.shareViewWithAgentAndTeamInListView();
    });
   
    test('Reorder status positions in List View', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.reorderStatusPositions();
    });

    test('Hide and show Project Status column in List View', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.hideAndShowStatus();
    });

    test('Search for status in View Options popup', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.searchStatusInViewPopup();
    });

    test('Delete a saved view in List View', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.deleteSavedViewInListView('Test View');
    });

    test('Switch between grid and list views', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.switchBetweenGridAndListView();
    });

    test('Open project create popup', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.openProjectCreatePopup();
    });

    test('Select multiple projects in List View', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.selectMultipleProjects();
    });

    test('Duplicate selected projects', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.duplicateSelectedProjects();
    });

    test('Delete selected projects', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.deleteSelectedProjects();
    });

    test('Delete project via delete icon', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.deleteProjectViaRowIcon();
    });

    test('Cancel delete from popup', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.cancelDeleteFromPopup();
    });

    test('Sort projects ascending', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.sortProjectsAscending('Project Name');
    });

});