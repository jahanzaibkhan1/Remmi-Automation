import { test } from '../../fixtures/session.fixture';
import { ProjectPage } from '../../pages/projects/ProjectPage';

test.describe('Projects - List View Tests', () => {
    test('Verify project search by name in List View', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyProjectCanBeSearchedByNameInListView('Nexton');
    });

    test('Search with no matching results in List View', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyProjectSearchWithInvalidNameInListView('NoSuchProjectABC123');
    });

    test('Verify active tab filtering in List View', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyActiveTabFilteringInListView();
    });

    test('Verify inactive tab filtering in List View', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyInactiveTabFilteringInListView();
    });

    test('Select single project manager in List View', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.selectSingleProjectManagerInListView('Jahanzaib Xenex');
    });

    test('Select multiple project managers in List View', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.selectMultipleProjectManagersInListView(['Jahanzaib Xenex', 'Hina Agent']);
    });

    test('Select All project managers in List View', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.selectAllProjectManagersInListView();
    });

    test('Deselect All managers in PM dropdown in List View', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.deselectAllProjectManagersInListView();
    });

    test('Search within Project Manager dropdown in List View', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.selectSingleProjectManagerInListView('Jahanzaib Xenex');
    });

    test('Verify default view popup opens in List View', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyDefaultViewPopupOpensInListView();
    });

    test('Create a new custom view in List View', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        const uniqueViewName = `Test View`;
        await project.createNewCustomViewInListView(uniqueViewName);
    });

    test('Share view with agent and team in List View', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.shareViewWithAgentAndTeamInListView();
    });
   
    test('Reorder status positions in List View', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.reorderStatusPositions();
    });

    test('Hide and show Project Status column in List View', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.hideAndShowStatus();
    });

    test('Search for status in View Options popup', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.searchStatusInViewPopup();
    });

    test('Delete a saved view in List View', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.deleteSavedViewInListView('Test View');
    });

    test('Switch between grid and list views', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.switchBetweenGridAndListView();
    });

    test('Open project create popup', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.openProjectCreatePopup();
    });

    test('Select multiple projects in List View', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.selectMultipleProjects();
    });

    test('Duplicate selected projects', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.duplicateSelectedProjects();
    });

    test('Delete selected projects', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.deleteSelectedProjects();
    });

    test('Delete project via delete icon', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.deleteProjectViaRowIcon();
    });

    test('Cancel delete from popup', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.cancelDeleteFromPopup();
    });

    test('Sort projects ascending', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.sortProjectsAscending('Project Name');
    });

    test('Sort projects descending', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.sortProjectsDescending('Project Name');
    });

    test('Try searching project with symbols', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.searchProjectWithSymbols();
    });

    test('Select project manager with no projects', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.selectProjectManagerWithNoProjects();
    });

    test('Create view without name', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.createViewWithoutName();
    });

    test('Save view without changing anything', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.saveViewWithoutChanges();
    });

    test('Attempt sharing view with no selection', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.shareViewWithNoSelection();
    });

    test('View status out of sync', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.viewStatusOutOfSync();
    });

    test('Verify records are displayed at the end of project list view', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyRecordsCountAtEnd();
    });

});