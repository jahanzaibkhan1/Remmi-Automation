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

test.describe('Lot List Page', () => {
    test('Test 1: Search for specific lot', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifySearchSpecificLot('Automation Lot');
    });

    test('Test 2: Use Project dropdown in Lot tab', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyProjectDropdownShowsAllocatedProjects();
    });

    test('Test 3: Search project in dropdown list', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifySearchProjectInDropdown('Automation Testing');
    });

    test('Test 4: Select one project from dropdown', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifySelectProjectFromDropdown('Adb');
    });

    test('Test 5: Select multiple projects from dropdown', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifySelectMultipleProjectsFromDropdown(['Adb', 'Automation Testing']);
    });

    test('Test 6: Use Deselect All in Project dropdown', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyDeselectAllProjectsInDropdown();
    });

    test('Test 7: Use Select All in Project dropdown', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifySelectAllProjectsInDropdown();
    });
});