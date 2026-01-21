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

    test('Test 1: Verify that clicking the Add button in the Legal tab opens the contract popup in a new tab', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyAddButtonInLegalTabOpensContractPopup();
    });

    test('Test 2: Verify that the listing dropdown auto populates the selected listing in the contract popup', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyContractPopupListingDropdownAutoPopulates();
    });

    test('Test 3: Verify that the Seller field auto populates in the contract popup', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyContractPopupSellerFieldAutoPopulates();
    });
    
    test('Test 4: Verify that the listing dropdown auto selects the primary listing for the contract popup', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyContractPopupListingDropdownAutoPopulate();
    });

    test('Test 5: Verify that the Managing Contact dropdown auto selects the primary Contact for the contact', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyManagingContactDropdownAutoSelectsPrimaryContact();
    });

    test('Test 6: Verify that no field is marked as required in the contract popup', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyNoRequiredFieldsInContractPopup()
    });

    test('Test 7: Verify that the contract is displayed in the Legal tab after saving the contract popup', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyContractDisplayedAfterSaving();
    });

    test('Test 8: Verify that the contract status displays Purchaser, Offer Price, Offer Date, Selling Contact, etc.', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyContractStatusDropdownOptions();
    });

    test('Test 9: Verify that clicking the checkbox in the Legal tab shows a dropdown with Present, Accept, and Decline buttons', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyLegalTabCheckboxRevealsDropdown();
    });

    test('Test 10: Verify that clicking the Accept button updates the Offer Status to "Accepted"', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyAcceptButtonUpdatesOfferStatus();
    });

    test('Test 11: Verify that clicking the Decline button updates the Offer Status to "Declined"', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyDeclineButtonUpdatesOfferStatus();
    });

    test('Test 12: Verify that the Offer Status can be updated multiple times in the Legal tab', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyOfferStatusCanBeUpdatedMultipleTimes();
    });

    test('Test 13: Verify that the Offer Status is retained correctly after refreshing the page', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyOfferStatusIsRetainedAfterRefresh();
    });

    test('Test 14: Verify that clicking on the "Selling Agreement Start Date" field opens a calendar for selecting a date', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifySellingAgreementStartDateCalendarOpens();
    });

    test('Test 15: Verify that clicking the Present button opens the Present Contract popup', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyPresentButtonOpensPresentContractPopup();
    });

    test('Test 16: Verify that closing the Present Contract popup does not change the Offer Status', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyPresentButtonOpensPresentContractPopup();
    });

    test('Test 17: Verify that clicking on the "Selling Agreement End Date" field opens a calendar for selecting a date', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifySellingAgreementEndDateCalendarOpens();
    });

    test('Test 18: Verify that the "Agreed Marketing Spend" field accepts numeric input', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyAgreedMarketingSpendFieldAcceptsNumericInput();
    });

    test('Test 19: Verify that the "Marketing Payable By" dropdown allows selection', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyMarketingPayableByDropdownAllowsSelection();
    });

    test('Test 20: Verify that the "Commission Payable By" dropdown allows selection', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyCommissionPayableByDropdownAllowsSelection();
    });

    test('Test 21: Verify that the "Commission % Inclusive of GST" field accepts percentage input', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyCommissionInclusiveGSTFieldAcceptsPercentageInput();
    });

    test('Test 22: Verify that the "$ Amount Inclusive of GST" field accepts numeric input', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyAmountInclusiveGSTFieldAcceptsNumericInput();
    });

    test('Test 23: Verify that clicking on the "Document" button opens a popup to add a new document', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyDocumentButtonOpensAddDocumentPopup();
    });

    test('Test 24: Verify that the "Property Legal Details" section displays fields for Lot, On Subdivision, Title Reference, and Legal Address, and none of the fields are required', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyPropertyLegalDetailsFieldsNotRequired();
    });

    test('Test 25: Verify that the "Legal Name" dropdown auto-populates with the property owner\'s name and allows creating a new contact', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifyLegalNameDropdownAutoPopulatesAndAllowsNewContact();
    });

    test('Test 26: Verify that the "Solicitor" dropdown allows selecting a company and creating a new company', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifySolicitorDropdownAllowsSelectAndCreate();
    });

    test('Test 27: Verify that selecting a company from the "Solicitor" dropdown populates the "Solicitor\'s Contact" dropdown with relevant contacts', async ({ sessionPage }) => {
      const listingActions = new ListingActions(sessionPage);
      await listingActions.verifySolicitorDropdownPopulatesContacts();
    });

});