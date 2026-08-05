import { expect } from '@playwright/test';
import { test } from '../../fixtures/session.fixture';
import { ProjectPage } from '../../pages/projects/ProjectPage';

test.describe('Project Lot Form Tests', () => {

    test('TC_01 - Verify lot form opens on clicking a lot', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).clickLotOpensLotForm('Automation');
    });

    test('TC_02 - Verify lot name is shown on the form tab', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyLotNameShownOnFormTab('Automation', 'Automation Lot');
    });

    test('TC_03 - Verify left cross icon closes lot form', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyLeftCrossIconClosesLotForm('Automation', 'Automation Lot');
    });

    test('TC_04 - Verify tab\'s cross icon closes form', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyLeftCrossIconClosesLotForm('Automation', 'Automation Lot');
    });

    test('TC_05 - Verify project and lot name below tab', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyProjectAndLotNameBelowsTab('Automation', 'Automation Lot');
    });

    test('TC_06 - Verify apartment detail and history tabs are visible', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyApartmentDetailAndHistoryTabsVisible('Automation', 'Automation Lot');
    });

    test('TC_07 - Verify project dropdown is auto-filled', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyProjectsDropdownAutoFilled('Automation', 'Automation Lot');
    });

    test('TC_08 - Verify project can be changed', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyProjectCanBeChange('Automation', 'Automation Lot');
    });

    test('TC_09 - Verify lot field shows correct lot name', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyLotNameShownOnFormTab('Automation', 'Automation Lot');
    });

    test('TC_10 - Verify status reason dropdown shows all statuses', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyStatusReasonDropdownShowsAllStatuses('Automation', 'Automation Lot');
    });

    test('TC_11 - Verify required field validations work', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyLotCreationWithMissingFields('Automation');
    });

    test('TC_12 - Verify optional fields accept input', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyOptionalFieldAcceptInput('Automation', 'Automation Lot');
    });

    test('TC_13: Verify close button exits without saving', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyCloseButtonExitWithoutSaving('Automation', 'Automation Lot');
    });

    test('TC_14 - Verify Save button saves form without closing', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifySaveButtonSavesFormWithoutClosing('Automation', 'Automation Lot');
    });

    test('TC_15 - Verify Save & Close button saves form and closes it', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifySaveAndCloseButtonSaveAndClosesForm('Automation', 'Automation Lot');
    });

    test('TC_16 - Verify history tab loads properly', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyHistoryTabLoadsProperly('Automation', 'Automation Lot');
    });

    test('TC_17 - Verify search works in history tab', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyHistorySearchInTab('Bed', 'Automation', 'Automation Lot');
    });

    test('TC_18 - Verify change date is correct in the history tab', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyHistoryChangeDateInTab('Automation', 'Automation Lot');
    });

    test('TC_19 : Verify change by field shows updating staff in history tab', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyHistoryChangeByFieldInTab('Automation', 'Automation Lot');
    });

    test('TC_20 - Verify event column shows Create or Update', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyHistoryEventColumnShowsCreateOrUpdate('Automation', 'Automation Lot');
    });

    test('TC_21 - Verify change fields show updated fields in history tab', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyHistoryChangedField('Automation', 'Automation Lot');
    });

    test('TC_22 - Verify only new values are shown on creation', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyNewValuesShownOnCreation('Create', 'Automation', 'Automation Lot');
    });

    test('TC_23 - Verify both old and new values are shown on update', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyBothOldAndNewValueOnUpdate('Automation', 'Automation Lot');
    });

    test('TC_24 - Save with empty required fields', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyLotCreationWithMissingFields('Automation');
    });

    test('TC_25: Verify invalid/removed project cannot be selected', async ({ sessionPage }) => {
        await new ProjectPage(sessionPage).verifyInvalidProjectCannotBeSelected(
            'Automation',
            'Automation Lot',
            'InvalidProject_XYZ_12345'
        );
    });

});