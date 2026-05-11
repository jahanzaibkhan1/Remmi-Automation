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

test.describe('Project Setup Tests', () => {

    test('Test 1: Project with lots opens Pricelist tab by default', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyProjectWithLotsOpensPricelistTab('Automation');
    });

    test('TC_02: Project without lots opens General tab', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyProjectWithoutLotsOpensGeneralTab("Hina's Project");
    });

    test('TC_03: Pricelist → Project Setup tab switch', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyProjectSetupTabSwitchFromPricelist('Automation');
    });

    test('TC_04: Project Name and Status appear first on General tab', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyProjectNameAndStatusAppearFirst('Automation');
    });

    test('TC_05: Address fields appear below name/status', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyAddressFieldsAppearBelowNameStatus('Automation');
    });

    test('TC_06: Project address autocomplete shows suggestions', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyProjectAddressPopupOpens('Automation', 'Australia');
    });

    test('TC_07: Add project address and save', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).addProjectAddressAndSave('Automation', 'Australia');
    });

    test('TC_08: Save Project Address with empty fields', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).saveProjectAddressWithEmptyFields('Automation');
    });

    test('TC_10: Project Display Address popup opens', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyProjectDisplayAddressPopupOpens('Automation');
    });

    test('TC_11: Add project display address and save', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).addProjectDisplayAddressAndSave('Automation', {
            buildingName: 'Test Building',
            unitNo: '12',
            streetNo: '456',
            streetName: 'George Street',
            state: 'NSW',
            postCode: '2000',
            country: 'Australia',
        });
    });

    test('TC_12: Save Display Address popup with empty fields', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).saveDisplayAddressWithEmptyFields('Automation');
    });

    test('TC_13: Close Display Address popup using cross icon', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).closeDisplayAddressPopupUsingCross('Automation');
    });

});