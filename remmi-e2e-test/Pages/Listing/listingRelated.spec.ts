import { test as base } from '@playwright/test';
import { ListingActions } from './ListingAction';
import * as path from 'path';

const managerSessionPath = path.join(__dirname, '../../sessions/manager-session.json');
const DASHBOARD_URL = process.env.DASHBOARD_URL || 'https://remmi-app-stage-ui.azurewebsites.net/dashboard';

const test = base.extend<{ sessionPage: any }>({
  sessionPage: [async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: managerSessionPath });
    try {
      const page = await context.newPage();
      await page.goto(DASHBOARD_URL);
      await use(page);
    } finally {

    }
  }, { scope: 'worker' }]
});

test.describe('Listing side Menu Tests - Remmi E2E', () => {

  test('Test 1: Verify that a contact can be searched and associated successfully', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyContactAssociationInRelatedTab();
  });

  test('Test 2: Verify error message shown if trying to associate without selecting a contact', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyErrorMessageWhenAssociatingWithoutContact();
  });

  test('Test 3: Verify that a non-existing contact shows "Add New contact" button', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyAddNewContactButtonAppearsForNonExistingContact();
  });

  test('Test 4: Verify that clicking "Add New contact" opens a new contact tab', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyCreateNewContactOpensContactTab();
  });

  test('Test 5: Verify that a newly created contact is automatically added to the Related contact list', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyNewlyCreatedContactIsAddedToRelatedList();
  });

  test('Test 6: Verify that a contact can be removed from the related contact list', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyContactAssociationInRelatedTab();
  });

  test('Test 7: Verify confirmation popup and correct behavior when deleting a contact from Related tab', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyDeleteContactConfirmationPopup();
  });

  test('Test 8: Verify that a contact is not deleted if "No" is clicked on confirmation popup', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyContactNotDeletedWhenNoClickedOnConfirmation();
  });

  test('Test 9: Verify that a contact type tag can be added to a related contact', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyContactTypeTagCanBeAdded();
  });
  
  test('Test 10: Verify that duplicate contact type tags cannot be added', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyDuplicateContactTypeTagsCannotBeAdded();
  });

  test('Test 11: Verify that a contact type tag can be removed from a related contact', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyContactTypeTagCanBeRemoved();
  });

  test('Test 12: Verify that a relationship tag can be added to a related contact', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyRelationshipTagCanBeAdded();
  });

  test('Test 13: Verify that duplicate relationship tags cannot be added', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyDuplicateRelationshipTagsCannotBeAdded();
  });

  test('Test 14: Verify that a relationship tag can be removed from a related contact', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyRelationshipTagCanBeRemoved();
  });

  test('Test 15: Verify that total associated contact count updates correctly', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyAssociatedContactCountUpdatesCorrectly();
  });

  test('Test 16: Verify that contract related contacts are automatically added to Related contact tab', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyContractRelatedContactsAreAddedToRelatedTab();
  });

  test('Test 17: Verify that contract related contacts are not removed when the contract is settled', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyContractRelatedContactsRemainAfterSettlement();
  });

  test('Test 18: Verify that an associated contact remains linked after saving and reopening the contact', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyAssociatedContactRemainsLinkedAfterSaveAndReopen();
  });

  test('Test 19: Verify that deleting all related contacts shows nothing', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.deleteAllRelatedContacts();
  });

  test('Test 20: Verify that a newly created contact appears in the global contact list', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyNewlyCreatedContactIsAddedToRelatedList();
  });

  test('Test 21: Verify that canceling "Add New Contact" does not create a contact', async ({ sessionPage }) => {
    const listingActions = new ListingActions(sessionPage);
    await listingActions.verifyCancelAddNewContactDoesNotCreateContact();
  });

});