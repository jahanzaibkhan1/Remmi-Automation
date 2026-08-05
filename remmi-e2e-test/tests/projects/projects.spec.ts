import { test } from '../../fixtures/session.fixture';
import { ProjectPage } from '../../pages/projects/ProjectPage';

test.describe('Precinct Inner View - E2E Tests', () => {

    test('TC_01: Verify precinct name is displayed correctly', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyPrecinctNameDisplayedCorrectly();
    });

    test('TC_02: Verify Project, Lot, EOI tabs visible after selecting precinct', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyTabsVisibleAfterPrecinctSelection();
    });

    test('TC_03: Verify allocated projects displayed under Project tab', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyAllocatedProjectsUnderProjectTab();
    });

    test('TC_04: Verify project card shows correct image, name and price', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyProjectCardShowsImageNameAndPrice('Nexton');
    });

    test('TC_05: Expand project card using arrow icon', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyExpandProjectCard('Nexton');
    });

    test('TC_06: Collapse project card using arrow icon', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyCollapseProjectCard('Nexton');
    });

    test('TC_07: Open project from precinct card', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyOpenProjectFromPrecinctCard();
    });

    test('TC_08: Open Lot tab successfully', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyLotTabOpens();
    });

});