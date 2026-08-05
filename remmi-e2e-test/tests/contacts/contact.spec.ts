import { test } from '../../fixtures/session.fixture';
import { ContactPage } from '../../pages/contacts/ContactPage';
import * as path from 'path';
import * as fs from 'fs';

const IMAGE_DIR = path.resolve(__dirname, 'Images');

// Utility functions to ensure directory and file existence
function ensureDirExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
function ensureFileExists(filePath: string) {
  if (!fs.existsSync(filePath)) {
    // Create a dummy file if it does not exist.
    fs.writeFileSync(filePath, '');
  }
}

// Extend test to provide sessionPage for authenticated context

test.describe('Contacts side Menu Tests - Remmi E2E', () => {

  test('Test 1: Verify contact search functionality', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifySearchFuntionality('Hina Test');
  });

  test('Test 2: Verify search with an invalid contact name', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.searchNonExistingContact('fghjkkkk');
  });

  test('Test 3: Verify contact type dropdown filters contacts correctly', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyContactDropdownFilter('Agent');
  });

  test('Test 4: Verify "Select All" functionality in contact type dropdown', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.selectAllContactType();
  });

  test('Test 5: Verify "Deselect All" functionality in contact type dropdown', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.deselectAllContactType();
  });

  test('Test 6: Verify search within contact type dropdown', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifymatchingTypeDisplayed('Agent');
  });

  test('Test 7: Verify company type dropdown filters companies correctly', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyCompanyTypeDropdownFilter('Agency');
  });

  test('Test 8: Verify "Select All" functionality in company type dropdown', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.selectAllCompanyTypes();
  });

  test('Test 9: Verify "Deselect All" functionality in company type dropdown', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.deselectAllCompanyType();
  });

  test('Test 10: Verify search within company type dropdown', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyCompanyTypeDropdownSearch('Agency');
  });

  test('Test 11: Verify reset button removes applied filters', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.VerifyResetButton('agent', 'Agency');
  });

  test('Test 12: Verify delete button is enabled after selecting a contact', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyDeleteButtonEnabledAfterSelectingContact();
  });

  test('Test 13: Verify delete button is disabled when no contact is selected', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyDeleteButtonDisabledWhenNoContactSelected();
  });

  test('Test 14: Verify the delete button removes the selected contact', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    const contactName = '11 22';
    await contact.verifyDeleteButtonRemovesSelectedContact(contactName);
  });

  test('Test 15: Restore a deleted contact from setting and verify in Contacts', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    const contactName = '11 22';
    await contact.RestoreDeletedContact(contactName);
  });

  test('Test 16: Verify canceling deletion keeps the contact in the list', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    const contactName = '11 22';
    await contact.verifyDeleteCancelKeepsContact(contactName);
  });

  test('Test 17: Verify contact creation form is displayed after clicking the plus button', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyContactCreationByPlusButton();
  });

  test('Test 18: Verify that initials placeholder is shown when profile image is missing', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyInitialsPlaceholderWhenNoProfileImage();
  });

  test('Test 19: Verify contact list status alignment', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyContactListStatusAlignment();
  });

  test('Test 20: Verify "Select All" functionality in contact list', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifySelectAllFunctionality();
  });

  test('Test 21: Verify deselecting "Select All" unselects all contacts', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyDeselectSelectAllUnselectsAll();
  });

  test('Test 22: Verify selecting individual contacts', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifySelectingIndividualContacts();
  });

  test('Test 23: Verify filtering contacts by "Active" status', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    const name = "Ayesha umer";
    await contact.verifyFilteringContactsByStatus(name);
  });

  test('Test 24: Verify clear button closes the filter popup', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyClearButtonClosesFilter();
  });

  test('Test 25: Verify filtering contacts with invalid condition', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyFilteringContactsWithInvalidCondition();
  });

  test('Test 26: Verify that data aligns properly with the check circle while applying filters', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTableAlignmentWithSelectionColumnWithFilter();
  });

  test('Test 27: Verify that data is displayed in the list for key contact columns', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyContactsTableEssentialColumnsHaveData();
  });

  test('Test 28: Verify filtering contacts by Full Name in the contact list', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    // Replace 'Hina Test' with an actual contact name you want to filter by if needed
    await contact.verifyFilteringContactsByFullName('Hina Test');
  });

  test('Test 29: Verify filtering contacts by Mobile in the contact list', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyFilteringContactsByMobile('0409235412');
  });

  test('Test 30: Verify filtering contacts by Email in the contact list', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyEmailFilterWorks('hina.test@remmi.com.au');
  });

  test('Test 31: Verify Individual type filter works correctly', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyIndividualTypeFilter('Individual');
  });

  test('Test 32: Verify Type filter (e.g., Company, Individuals) works correctly', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTypeFilter('Company');
  });

  test('Test 33: Verify Company Type filter works correctly', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTypeFilterForCompany('Company');
  });

  test('Test 34: Verify Associate Company filter works properly', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyAssociateCompanyFilter();
  });

  test('Test 35: Verify Owner filter works correctly', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyOwnerFilterWorks('Hina Tahir');
  });

  test('Test 36: Verify Created Date filter works properly', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyCreatedDateFilter();
  });

  test('Test 37: Verify sorting contacts by status', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifySortingByStatus();
  });

  test('Test 38: Verify list scrolling loads more contacts', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyScrollLoadsMoreContacts();
  });

  test('Test 39: Verify filtered/sorted contacts load correctly while scrolling', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyScrollingWithFilterOrSort();
  });

  test('Test 40: Verify scrolling after opening and closing a contact', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyScrollingAfterOpeningAndClosingContact();
  });

  test('Test 41: Verify that the position of check circles on the contact list is correct', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.NavigateToContacts();
    await contact.navigateToContactsThenOfficesAndCheckCheckboxes();
  });

  test('Test 42: Verify searching and scrolling loads relevant contacts', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifySearchingAndLoadingMoreContacts();
  });

  test('Test 43: Verify selecting a tag in dropdown filters contacts correctly', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTagDropdownFilter('Agent');
  });

  test('Test 44: Verify filtering by tag and scrolling loads relevant contacts', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTagDropdownFilterWithScroll('Agent');
  });

  test('Test 45: Verify opening a contact from the list displays details', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyOpenContactFromList();
  });

  test('Test 46: Verify clicking on a contact after applying filters opens correct contact', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyOpenFilteredContact('11 22');
  });

  test('Test 47: Verify opening and closing multiple contacts sequentially', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    // Open and close first 3 contacts (or total number if less)
    await contact.verifyOpenAndCloseMultipleContactsSequentially(2);
  });

});