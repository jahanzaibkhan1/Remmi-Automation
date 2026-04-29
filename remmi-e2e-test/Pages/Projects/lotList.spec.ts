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

    test('Test 8: Remove selected project tag using cross icon', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyRemoveSelectedProjectTag('adb');
    });

    test('Test 9: Use Bed dropdown in Lot tab', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyBedDropdownFilter();
    });

    test('Test 10: Search bed numbers in dropdown', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifySearchBedInDropdown('2');
    });

    test('Test 11: Select one bed number', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.selectBedNumber('2');
    });

    test('Test 12: Select multiple bed numbers', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.selectMultipleBedNumbers(['2', '3']);
    });

    test('Test 13: Select All beds option', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifySelectAllBedsInDropdown();
    });

    test('Test 14: Use Deselect All in Bed dropdown', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyDeselectAllBedsInDropdown();
    });

    test('Test 15: Remove selected bed tag using cross icon', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyRemoveSelectedBedTag('2');
    });

    test('Test 16: Use Status dropdown in Lot tab', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyStatusDropdownFilter();
    });

    test('Test 17: Select one status from Status dropdown', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifySelectOneStatus('For sale');
    });

    test('Test 18: Select multiple statuses from Status dropdown', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.selectMultipleStatuses(['For sale', 'Sold']);
    });

    test('Test 19: Search statuses in Status dropdown', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifySearchStatusInDropdown('Sold');
    });

    test('Test 20: Use Select All in Status dropdown', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifySelectAllStatusInDropdown();
    });

    test('Test 21: Use Deselect All in Status dropdown', async ({ sessionPage }) => {
        const project = new ProjectActions(sessionPage);
        await project.verifyDeselectAllStatusInDropdown();
    });

});