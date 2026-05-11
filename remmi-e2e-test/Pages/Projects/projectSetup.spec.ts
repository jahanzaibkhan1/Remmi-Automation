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

    test('TC_14: Developer dropdown shows contacts list', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyDeveloperDropdownShowsContacts('Automation');
    });

    test('TC_15: Add and remove developer', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).addAndRemoveDeveloper('Automation', '11 22');
    });

    test('TC_18: Project Manager dropdown shows all staff', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyProjectManagerDropdownShowsAllStaff('Automation');
    });

    test('TC_20: Verify no field is required on General tab', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyNoFieldRequiredOnGeneralTab('Automation');
    });

    test('TC_21: Floorplan list appears on icon click', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).verifyFloorplanListAppearsOnIconClick('Automation');
    });

    test('TC_22: Select and delete a floorplan type', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).selectAndDeleteFloorplanType('Automation');
    });

    test('TC_23: Delete all selected floorplan types at once', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).deleteAllSelectedFloorplanTypes('Automation');
    });

    test('TC_24: Sort floorplan list ascending/descending', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).sortFloorplanListAscendingDescending('Automation');
    });

    test('TC_25: Add upgrade group with valid data', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).addUpgradeGroupWithValidData(
            'Automation',
            'Test Group',
            'Test Upgrade',
            '1000'
        );
    });

    test('TC_26: Add multiple upgrade groups', async ({ sessionPage }) => {
        await new ProjectActions(sessionPage).addMultipleUpgradeGroups('Automation');
    });
    
});