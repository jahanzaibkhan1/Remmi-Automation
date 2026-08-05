import { test } from '../../fixtures/session.fixture';
import { ContactPage } from '../../pages/contacts/ContactPage';

test.describe('Contact Related Property Tabs - Remmi E2E', () => {

  test('Verify all three tabs (Listing, Property, Contract) appear under Related Property', async ({ sessionPage }) => {
    const contactActions = new ContactPage(sessionPage);
    await contactActions.verifyRelatedPropertyHasAllTabs();
  });

  test('Verify associate field is visible and functional in Listing tab', async ({ sessionPage }) => {
    const contactActions = new ContactPage(sessionPage);
    await contactActions.verifyAssociateFieldVisibleAndFunctionalInListingTab();
  });

  test('Verify a listing can be associated using the associate field', async ({ sessionPage }) => {
    const contactActions = new ContactPage(sessionPage);
    await contactActions.verifyListingCanBeAssociatedViaAssociateField();
  });

  test('Verify the associated listing displays status aligned properly', async ({ sessionPage }) => {
    const contactActions = new ContactPage(sessionPage);
    await contactActions.verifyAssociatedListingStatusAlignment();
  });

  test('Verify a listing can be removed from the associated list', async ({ sessionPage }) => {
    const contactActions = new ContactPage(sessionPage);
    await contactActions.removeAssociatedListing();
  });

  test('Verify listing type or related tag can be dragged into a listing', async ({ sessionPage }) => {
    const contactActions = new ContactPage(sessionPage);
    await contactActions.verifyDragAndDropToListing();
  });

  test('Verify tag can be removed using the cross icon', async ({ sessionPage }) => {
    const contactActions = new ContactPage(sessionPage);
    await contactActions.removeTagByCrossIcon();
  });

  test('Verify clicking a listing opens it in a new tab and closes listing tab', async ({ sessionPage }) => {
    const contactActions = new ContactPage(sessionPage);
    await contactActions.verifyListingOpensInNewTabAndClosesListingTab();
  });

  test('Verify sort icon is present next to each status in listing tab', async ({ sessionPage }) => {
    const contactActions = new ContactPage(sessionPage);
    await contactActions.verifySortIconInStatusColumnHeaderInListingTab();
  });

  test('Verify property can be associated via associate field in Property tab', async ({ sessionPage }) => {
    const contactActions = new ContactPage(sessionPage);
    await contactActions.verifyPropertyCanBeAssociatedViaAssociateField();
  });

  test('Verify associated property appears at end of list', async ({ sessionPage }) => {
    const contactActions = new ContactPage(sessionPage);
    await contactActions.verifyAssociatedPropertyAppearsAtEndOfList();
  });

  test('Verify a property can be removed from associated list', async ({ sessionPage }) => {
    const contactActions = new ContactPage(sessionPage);
    await contactActions.removeAssociatedProperty();
  });

  test('Verify the associated property displays status aligned properly', async ({ sessionPage }) => {
    const contactActions = new ContactPage(sessionPage);
    await contactActions.verifyPropertyCanBeAssociatedViaAssociateField();
  });

  test('Verify sort icon exists beside property statuses in Property tab', async ({ sessionPage }) => {
    const contactActions = new ContactPage(sessionPage);
    await contactActions.verifySortIconExistsBesidePropertyStatuses();
  });

  test('Verify clicking associated property opens it in new tab with property tab active', async ({ sessionPage }) => {
    const contactActions = new ContactPage(sessionPage);
    await contactActions.verifyAssociatedPropertyOpensInNewTabWithPropertyTab();
  });

  test('Verify contract list displays status aligned properly', async ({ sessionPage }) => {
    const contactActions = new ContactPage(sessionPage);
    await contactActions.verifyContractListStatusAlignment();
  });

  test('Verify contract can be opened from contract tab with listing tab', async ({ sessionPage }) => {
    const contactActions = new ContactPage(sessionPage);
    await contactActions.verifyContractCanBeOpenedFromContractTabWithListingTab();
  });

  test('Verify contract can be deleted from contract tab', async ({ sessionPage }) => {
    const contactActions = new ContactPage(sessionPage);
    await contactActions.verifyContractCanBeDeletedFromContractTab();
  });

  test('Verify status alignment and sorting in contract tab', async ({ sessionPage }) => {
    const contactActions = new ContactPage(sessionPage);
    await contactActions.verifyStatusAlignmentInContractTab();
  });
  
});