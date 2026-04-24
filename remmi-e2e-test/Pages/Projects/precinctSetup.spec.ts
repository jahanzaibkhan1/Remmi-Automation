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
            // Optionally clean up context
        }
    }, { scope: 'worker' }]
});

test.describe('Precinct Setup Tab', () => {
    test('should display "Precinct" and "Precinct Allocation" sub-tabs when "Precinct Setup" tab is clicked', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyPrecinctSetupSubTabs();
    });
    
    test('Verify Precinct tab shows Select Project dropdown and Create New button', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyPrecinctTabDefaultControls();
    });

    test('Verify Add Precinct popup opens and closes via Cancel', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyAddPrecinctPopupOpensAndCloses();
    });

    test('Validate successful precinct creation with image', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyPrecinctCreationWithImage();
    });

    test('Validate image removal using cross icon', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyImageRemovalViaCrossIcon();
    });

    test('Cancel Add Precinct popup using cross icon', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.cancelAddPrecinctPopupUsingCrossIcon();
    });

    test('Cancel Add Precinct popup using Cancel button', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.cancelAddPrecinctPopupUsingCancelButton();
    });

    test('Validate precinct card display after creation', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyPrecinctCreationWithImage();
    });

    test('Verify Edit Precinct popup opens correctly', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyEditPrecinctPopupOpensCorrectly();
    });

    test('Validate changes are saved after editing precinct', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.validateChangesAreSavedAfterEditingPrecinct();
    });

    test('Validate precinct deletion from card', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.validatePrecinctDeletionFromCard();
    });

    test('Verify dropdown-based project filtering in Precinct tab', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyDropdownSelectAndClearInPrecinctTab();
    });

    test('Verify “cross icon” on project dropdown clears filter', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyDropdownSelectAndClearInPrecinctTab();
    });

    test('Verify Precinct Allocation tab shows correct layout', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyPrecinctAllocationTabLayout();
    });

    test('Validate precinct dropdown shows created precincts', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.validatePrecinctDropdownShowsCreatedPrecincts();
    });

    test('Verify search field filters project list', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifySearchFieldFiltersProjectList();
    });

    test('Allocate project to precinct and save', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.allocateProjectToPrecinctAndSave();
    });
});