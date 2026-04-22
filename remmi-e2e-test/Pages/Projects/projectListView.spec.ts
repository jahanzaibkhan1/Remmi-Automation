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
    
});