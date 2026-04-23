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

});