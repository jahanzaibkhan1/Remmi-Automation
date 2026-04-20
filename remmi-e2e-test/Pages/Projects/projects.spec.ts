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
    
});