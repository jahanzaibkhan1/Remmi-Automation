import { test } from '../../fixtures/session.fixture';
import { ContactPage } from '../../pages/contacts/ContactPage';

test.describe('Related Contact', () => {

    test('Search and select an existing contact', async ({ sessionPage }) => {
        const contactActions = new ContactPage(sessionPage);
        await contactActions.verifySearchAndSelectRelatedContact();
    });

    test('Associate button should add contact to the list', async ({ sessionPage }) => {
        const contactActions = new ContactPage(sessionPage);
        await contactActions.associateContactAndVerify();
    });

    test('The search icon is visible inside the Associate contact field', async ({ sessionPage }) => {
        const contactActions = new ContactPage(sessionPage);
        await contactActions.verifySearchIconInAssociateField();
    });

    test('Verify that the agents list is displayed correctly', async ({ sessionPage }) => {
        const contactActions = new ContactPage(sessionPage);
        await contactActions.verifyAgentsListIsDisplayedCorrectly();
    });

    test('Search field should show "Add New Contact" when no results found', async ({ sessionPage }) => {
        const contactActions = new ContactPage(sessionPage);
        await contactActions.verifyCreateNewContactOptionWhenNoResults();
    });

    test('Clicking "Add New Contact" should open a new contact form', async ({ sessionPage }) => {
        const contactActions = new ContactPage(sessionPage);
        await contactActions.verifyAddNewContactOpensForm();
    });

    test('Newly created contact should appear in the search list', async ({ sessionPage }) => {
        const contactActions = new ContactPage(sessionPage);
        await contactActions.verifyNewlyCreatedContactIsAddedToRelatedList();
    });

    test('Contact type and relationship tags should be draggable', async ({ sessionPage }) => {
        const contactActions = new ContactPage(sessionPage);
        await contactActions.verifyTagsAreDraggable();
    });

    test('Duplicate relationship tags should not be allowed', async ({ sessionPage }) => {
        const contactActions = new ContactPage(sessionPage);
        await contactActions.verifyDuplicateRelationshipTagsCannotBeAdded();
    });

    test('Relationship tags should be removable', async ({ sessionPage }) => {
        const contactActions = new ContactPage(sessionPage);
        await contactActions.verifyRelationshipTagCanBeRemoved();
    });

    test('Delete icon should remove a contact from the list', async ({ sessionPage }) => {
        const contactActions = new ContactPage(sessionPage);
        await contactActions.associateContactAndVerify();
    });

    test('Deleting a contact should require confirmation', async ({ sessionPage }) => {
        const contactActions = new ContactPage(sessionPage);
        await contactActions.verifyDeletingContactRequiresConfirmation();
    });

    test('Contact should be deleted after confirmation', async ({ sessionPage }) => {
        const contactActions = new ContactPage(sessionPage);
        await contactActions.deleteContactAfterConfirmation();
    });

    test('Contact deletion should not affect other contacts', async ({ sessionPage }) => {
        const contactActions = new ContactPage(sessionPage);
        await contactActions.associateContactAndVerify();
    });

    test('UI should not allow blank contact selection', async ({ sessionPage }) => {
        const contactActions = new ContactPage(sessionPage);
        await contactActions.verifyBlankContactCannotBeSelected();
    });

    test('Search should return accurate results', async ({ sessionPage }) => {
        const contactActions = new ContactPage(sessionPage);
        await contactActions.verifySearchReturnsAccurateResults('11 22');
    });

    test('Contacts should be sorted correctly when clicking the sort icon', async ({ sessionPage }) => {
        const contactActions = new ContactPage(sessionPage);
        await contactActions.verifySortingByStatus();
    });

});