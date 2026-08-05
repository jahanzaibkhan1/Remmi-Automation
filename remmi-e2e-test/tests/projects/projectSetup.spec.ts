import { expect } from '@playwright/test';
import { test } from '../../fixtures/session.fixture';
import { ProjectPage } from '../../pages/projects/ProjectPage';

test.describe('Project Setup Tests', () => {

    test('Test 1: Project with lots opens Pricelist tab by default', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyProjectWithLotsOpensPricelistTab('Automation');
    });

    test('TC_02: Project without lots opens General tab', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyProjectWithoutLotsOpensGeneralTab("Hina's Project");
    });

    test('TC_03: Pricelist → Project Setup tab switch', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyProjectSetupTabSwitchFromPricelist('Automation');
    });

    test('TC_04: Project Name and Status appear first on General tab', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyProjectNameAndStatusAppearFirst('Automation');
    });

    test('TC_05: Address fields appear below name/status', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyAddressFieldsAppearBelowNameStatus('Automation');
    });

    test('TC_06: Project address autocomplete shows suggestions', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyProjectAddressPopupOpens('Automation', 'Australia');
    });

    test('TC_07: Add project address and save', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).addProjectAddressAndSave('Automation', 'Australia');
    });

    test('TC_08: Save Project Address with empty fields', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).saveProjectAddressWithEmptyFields('Automation');
    });

    test('TC_10: Project Display Address popup opens', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyProjectDisplayAddressPopupOpens('Automation');
    });

    test('TC_11: Add project display address and save', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).addProjectDisplayAddressAndSave('Automation', {
            buildingName: 'Test Building',
            unitNo: '12',
            streetNo: '456',
            streetName: 'George Street',
            suburb: 'East Albury',
            state: 'NSW',
            postCode: '2000',
            country: 'Australia',
        });
    });

    test('TC_12: Save Display Address popup with empty fields', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).saveDisplayAddressWithEmptyFields('Automation');
    });

    test('TC_13: Close Display Address popup using cross icon', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).closeDisplayAddressPopupUsingCross('Automation');
    });

    test('TC_14: Developer dropdown shows contacts list', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyDeveloperDropdownShowsContacts('Automation');
    });

    test('TC_15: Add and remove developer', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).addAndRemoveDeveloper('Automation', '11 22');
    });

    test('TC_18: Project Manager dropdown shows all staff', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyProjectManagerDropdownShowsAllStaff('Automation');
    });

    test('TC_20: Verify no field is required on General tab', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyNoFieldRequiredOnGeneralTab('Automation');
    });

    test('TC_21: Floorplan list appears on icon click', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyFloorplanListAppearsOnIconClick('Automation');
    });

    test('TC_22: Select and delete a floorplan type', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).selectAndDeleteFloorplanType('Automation');
    });

    test('TC_23: Delete all selected floorplan types at once', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).deleteAllSelectedFloorplanTypes('Automation');
    });

    test('TC_24: Sort floorplan list ascending/descending', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).sortFloorplanListAscendingDescending('Automation');
    });

    test('TC_25: Add upgrade group with valid data', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).addUpgradeGroupWithValidData(
            'Automation',
            'Test Group',
            'Test Upgrade',
            '1000'
        );
    });

    test('TC_26: Add multiple upgrade groups', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).addMultipleUpgradeGroups('Automation');
    });

    test('TC_27: Remove an upgrade group using cross icon', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).addUpgradeGroupWithValidData(
            'Automation',
            'Test Group',
            'Test Upgrade',
            '1000'
        );
    });

    test('TC_28: Add upgrade under same group with valid data', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).addUpgradeUnderSameGroup('Automation', 'Extra Upgrade', '500');
    });

    test('TC_29: Add multiple upgrades under one group', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).addMultipleUpgradesUnderOneGroup('Automation');
    });

    test('TC_30: Remove individual upgrade fields', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).addUpgradeUnderSameGroup('Automation', 'Extra Upgrade', '500');
    });

    test('TC_31: Bonus Payable Upon accepts text tag', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyBonusPayableUponAcceptsText('Automation', 'Upon Contract Signing');
    });

    test('TC_32: Remove Bonus Payable Upon tag', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyBonusPayableUponAcceptsText('Automation', 'Upon Contract Signing');
    });

    test('TC_33: Bonus Payable To accepts text tag', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyBonusPayableToAcceptsText('Automation', 'Selling Agent');
    });

    test('TC_34: Bonus Campaign accepts text tag', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyBonusCampaignAcceptsText('Automation', 'Spring Campaign');
    });

    test('TC_35: Add multiple tags in all bonus fields', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).addMultipleTagsInAllBonusFields('Automation');
    });

    test('Test 36: Search from inactive tab', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyProjectsUnderInactiveTab('Al kabir heights');
    });

    test('Test 37: Click precinct in inactive tab', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.verifyPrecinctUnderInactiveTab('Tested');
    });

    test('TC_38: Add project with same name twice', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.addProjectWithSameNameTwice({ name: 'Project A' });
    });

    test('TC_39: Click project card to open Project Setup', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyProjectNameAndStatusAppearFirst('Automation');
    });

    test('TC_40: General tab shows entered project name and status', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyProjectNameAndStatusAppearFirst('Automation');
    });

    test('TC_41: Update project name and save', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        const originalName = 'Automation';
        const newName = 'Automation Updated';
        await project.updateProjectNameAndSave(originalName, newName);
    });

    test('TC_42: Update project status and save', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        const projectName = 'Automation';
        const newStatus = 'Active';
        await project.updateProjectStatusAndSave(projectName, newStatus);
    });

    test('TC_43: Assign developer, type, and manager together', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        const projectName = 'Automation';
        const developer = '11 22';
        const manager = 'Jahanzaib xenex';
        await project.assignDeveloperTypeAndManager(projectName, developer, manager);
    });

    test('TC_44: Delete all bonus tags and save', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).addMultipleTagsInAllBonusFields('Automation');
    });

    test('TC_45: Open address popup without entering data', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.openAddressPopupWithoutData('Automation');
    });

    test('TC_46: Enter incomplete address and save', async ({ sessionPage }) => {
        const project = new ProjectPage(sessionPage);
        await project.enterIncompleteAddressAndSave('Automation', {
            buildingName: '',
            unitNo: '',
            streetNo: '',
            streetName: '',
            suburb: 'East Albury',
            state: '',
            postCode: '',
            country: '',
        });
    });

    test('TC_47: Create project with status Inactive', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).createProjectWithInactiveStatus();
    });

    test('TC_48: Validate input trimming in project name', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).validateProjectNameTrimming();
    });

});