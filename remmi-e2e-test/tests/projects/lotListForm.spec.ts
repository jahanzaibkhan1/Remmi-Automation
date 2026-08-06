import { test } from '../../fixtures/session.fixture';
import { ProjectLotListFormPage as ProjectPage } from '../../pages/projects/ProjectLotListFormPage';

test.describe('Lot Form', () => {

    test('Test 1: Verify lot form opens on clicking a lot', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyLotFormOpensOnClick();
    });

    test('Test 2: Verify lot name is shown on the form', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyLotNameOnFormTab();
    });

    test('Test 3: Left cross icon closes lot form', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyCrossIconClosesLotForm();
    });

    test('Test 4: Right pin icon pins the form', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyPinIconPinsForm();
    });

    test('Test 5: Verify tabs cross icon closes form', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyCrossIconClosesLotForm();
    });

    test('Test 6: Verify project and lot name below tab', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyProjectAndLotNameBelowTab();
    });

    test('Test 7: Apartment Details and History tabs are visible', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyApartmentAndHistoryTabsVisible();
    });

    test('Test 8: Verify project dropdown is auto-filled', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyProjectDropdownAutoFilled();
    });

    test('TC_09: Verify project can be changed', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyProjectCanBeChanged('Automation Testing');
    });
    
    test('Test_10: Verify lot field shows correct lot name', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyLotNameOnLotFormTab();
    });

    test('TC_11: Verify status reason dropdown shows all statuses', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyStatusReasonDropdownShowsAll();
    });

    test('TC_13: Verify optional fields accept input', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyOptionalFieldsAcceptInput();
    });

    test('TC_14: Verify close button exits without saving', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyCloseButtonExitsWithoutSaving();
    });

    test('TC_15: Verify Save button saves form without closing', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifySaveButtonSavesWithoutClosing();
    });

    test('TC_16: Verify Save & Close saves and closes form', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifySaveAndCloseButtonSavesAndClosesForm();
    });

    test('TC_17: Verify history tab loads properly', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyHistoryTabLoads();
    });

    test('TC_18: Verify search works in history tab', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyHistorySearch('Bed');
    });

    test('TC_19: Verify change date is correct', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyHistoryChangeDate();
    });

    test('TC_20: Verify change by field shows updating staff', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyHistoryChangeByField();
    });

    test('TC_21: Verify event column shows Create or Update', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyHistoryEventColumn();
    });

    test('TC_22: Verify change fields show updated fields', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyHistoryChangedFields();
    });

    test('TC_23: Verify only new values are shown on creation', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyOnlyNewValuesShownOnCreation('Create');
    });

    test('TC_24: Verify both old and new values are shown on update', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyBothOldAndNewValuesOnUpdate();
    });

});