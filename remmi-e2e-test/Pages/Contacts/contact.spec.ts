import { test } from '@playwright/test';
import { ContactActions } from './contactAction';
import { LoginActions } from '../Login/LoginAction';
import { LoginUsers } from '../../fixture/test-data';

const OprationManager = LoginUsers.manager;
const salesAgent = LoginUsers.sales;
const admin = LoginUsers.admin;


test.describe('Contacts side Menu Tests - Remmi E2E', () => {

  test('Test 1: Verify contact search functionality', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifySearchFuntionality('Hina Test')
  });

  test('Test 2: Verify search with an invalid contact name', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.searchNonExistingContact('fghjkkkk')
  });

  test('Test 3: Verify contact type dropdown filters contacts correctly', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifyContactDropdownFilter('Agent');
  });

  test('Test 4: Verify "Select All" functionality in contact type dropdown', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.selectAllContactType();
  });

  test('Test 5: Verify "Deselect All" functionality in contact type dropdown', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.deselectAllContactType();
  });

  test('Test 6: Verify search within contact type dropdown', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifymatchingTypeDisplayed('Agent');
  });

  test('Test 7: Verify company type dropdown filters companies correctly', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifyCompanyTypeDropdownFilter('Agency');
  });

  test('Test 8: Verify "Select All" functionality in company type dropdown', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.selectAllCompanyTypes();
  });

  test('Test 9: Verify "Deselect All" functionality in company type dropdown', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.deselectAllCompanyType();
  });

  test('Test 10: Verify search within company type dropdown', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifyCompanyTypeDropdownSearch('Agency')
  });

  test('Test 11: Verify reset button removes applied filters', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.VerifyResetButton('agent', "Agency");
  });

  test('Test 12: Verify delete button is enabled after selecting a contact', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifyDeleteButtonEnabledAfterSelectingContact();
  });

  test('Test 13: Verify delete button is disabled when no contact is selected', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifyDeleteButtonDisabledWhenNoContactSelected();
  });
  
  test('Test 14: Verify the delete button removes the selected contact', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    const contactName = '11 22'; 
    
    await contact.verifyDeleteButtonRemovesSelectedContact(contactName);
  });
  
  test('Test 15: Restore a deleted contact from setting and verify in Contacts', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    const contactName = '11 22';
    await contact.RestoreDeletedContact(contactName);
  });

  test('Test 16: Verify canceling deletion keeps the contact in the list', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    const contactName = '11 22';

    await contact.verifyDeleteCancelKeepsContact(contactName);
  });

  test('Test 17: Verify contact creation form is displayed after clicking the plus button', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    await contact.verifyContactCreationByPlusButton();
  });
  
  test('Test 18: Verify that initials placeholder is shown when profile image is missing', async ({ page }) => {
    const login = new LoginActions(page);
    const contact = new ContactActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );
    const contactName = '11 22'; // Replace with a contact known to have no profile image if needed

    await contact.verifyInitialsPlaceholderWhenNoProfileImage(contactName);
  });

test('Test 19: Verify contact list status alignment', async ({ page }) => {
  const login = new LoginActions(page);
  const contact = new ContactActions(page);

  await login.login(
    OprationManager.email!,
    OprationManager.password!,
    process.env.E2E_MANAGER_OTP_SECRET!
  );

  await contact.verifyContactListStatusAlignment();
});

test('Test 20: Verify "Select All" functionality in contact list', async ({ page }) => {
  const login = new LoginActions(page);
  const contact = new ContactActions(page);

  await login.login(
    OprationManager.email!,
    OprationManager.password!,
    process.env.E2E_MANAGER_OTP_SECRET!
  );

  await contact.verifySelectAllFunctionality();
});

test('Test 21: Verify deselecting "Select All" unselects all contacts', async ({ page }) => {
  const login = new LoginActions(page);
  const contact = new ContactActions(page);

  await login.login(
    OprationManager.email!,
    OprationManager.password!,
    process.env.E2E_MANAGER_OTP_SECRET!
  );

  await contact.verifyDeselectSelectAllUnselectsAll();
});

test('Test 22: Verify selecting individual contacts', async ({ page }) => {
  const login = new LoginActions(page);
  const contact = new ContactActions(page);

  await login.login(
    OprationManager.email!,
    OprationManager.password!,
    process.env.E2E_MANAGER_OTP_SECRET!
  );

  await contact.verifySelectingIndividualContacts();
});

test('Test 23: Verify filtering contacts by "Active" status', async ({ page }) => {
  const login = new LoginActions(page);
  const contact = new ContactActions(page);

  await login.login(
    OprationManager.email!,
    OprationManager.password!,
    process.env.E2E_MANAGER_OTP_SECRET!
  );

  const name = "Ayesha umer";

  await contact.verifyFilteringContactsByStatus(name);
});

test('Test 24: Verify clear button closes the filter popup', async ({ page }) => {
  const login = new LoginActions(page);
  const contact = new ContactActions(page);

  await login.login(
    OprationManager.email!,
    OprationManager.password!,
    process.env.E2E_MANAGER_OTP_SECRET!
  );

  await contact.verifyClearButtonClosesFilter();
});

test('Test 25: Verify filtering contacts with invalid condition', async ({ page }) => {
  const login = new LoginActions(page);
  const contact = new ContactActions(page);

  await login.login(
    OprationManager.email!,
    OprationManager.password!,
    process.env.E2E_MANAGER_OTP_SECRET!
  );

  await contact.verifyFilteringContactsWithInvalidCondition();
});

test('Test 26: Verify that data aligns properly with the check circle while applying filters', async ({ page }) => {
  const login = new LoginActions(page);
  const contact = new ContactActions(page);

  await login.login(
    OprationManager.email!,
    OprationManager.password!,
    process.env.E2E_MANAGER_OTP_SECRET!
  );

  await contact.verifyTableAlignmentWithSelectionColumnWithFilter();
});

test('Test 27: Verify that data is displayed in the list for key contact columns', async ({ page }) => {
  const login = new LoginActions(page);
  const contact = new ContactActions(page);

  await login.login(
    OprationManager.email!,
    OprationManager.password!,
    process.env.E2E_MANAGER_OTP_SECRET!
  );

  await contact.verifyContactsTableEssentialColumnsHaveData();
});

test('Test 28: Verify filtering contacts by Full Name in the contact list', async ({ page }) => {
  const login = new LoginActions(page);
  const contact = new ContactActions(page);

  await login.login(
    OprationManager.email!,
    OprationManager.password!,
    process.env.E2E_MANAGER_OTP_SECRET!
  );

  // Replace 'Hina Test' with an actual contact name you want to filter by if needed
  await contact.verifyFilteringContactsByFullName('Hina Test');
});

test('Test 29: Verify filtering contacts by Mobile in the contact list', async ({ page }) => {
  const login = new LoginActions(page);
  const contact = new ContactActions(page);

  await login.login(
    OprationManager.email!,
    OprationManager.password!,
    process.env.E2E_MANAGER_OTP_SECRET!
  );

  await contact.verifyFilteringContactsByMobile('0409235412');
});

test('Test 30: Verify filtering contacts by Email in the contact list', async ({ page }) => {
  const login = new LoginActions(page);
  const contact = new ContactActions(page);

  await login.login(
    OprationManager.email!,
    OprationManager.password!,
    process.env.E2E_MANAGER_OTP_SECRET!
  );

  await contact.verifyEmailFilterWorks('hina.test@remmi.com.au');
});

test('Test 31: Verify Individual type filter works correctly', async ({ page }) => {
  const login = new LoginActions(page);
  const contact = new ContactActions(page);

  await login.login(
    OprationManager.email!,
    OprationManager.password!,
    process.env.E2E_MANAGER_OTP_SECRET!
  );
  await contact.verifyIndividualTypeFilter('Individual');
});

test('Test 32: Verify Type filter (e.g., Company, Individuals) works correctly', async ({ page }) => {
  const login = new LoginActions(page);
  const contact = new ContactActions(page);

  await login.login(
    OprationManager.email!,
    OprationManager.password!,
    process.env.E2E_MANAGER_OTP_SECRET!
  );
  await contact.verifyTypeFilter('Company');
});

test('Test 33: Verify Company Type filter works correctly', async ({ page }) => {
  const login = new LoginActions(page);
  const contact = new ContactActions(page);

  await login.login(
    OprationManager.email!,
    OprationManager.password!,
    process.env.E2E_MANAGER_OTP_SECRET!
  );
  await contact.verifyTypeFilterForCompany('Company');
});

test('Test 34: Verify Associate Company filter works properly', async ({ page }) => {
  const login = new LoginActions(page);
  const contact = new ContactActions(page);

  await login.login(
    OprationManager.email!,
    OprationManager.password!,
    process.env.E2E_MANAGER_OTP_SECRET!
  );
  await contact.verifyAssociateCompanyFilter();
});

});