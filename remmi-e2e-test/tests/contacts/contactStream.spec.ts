import { test } from '../../fixtures/session.fixture';
import { ContactPage } from '../../pages/contacts/ContactPage';

// Extend test to provide sessionPage for authenticated context

test.describe('Contacts "Stream" Tab - E2E Tests', () => {
  test('Open "Stream" tab', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.openStream();
  });

  test('Verify task record appears in Stream', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyTaskAppearsInList();
  });

  test('Verify property/listing  attachment record appears', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyListingAttachmentRecordAppears()
  });

  test('Verify related contact addition record appears', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyRelatedContactRecordAppears();
  });

  test('Verify lead assignment record appears', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyLeadAssignmentRecordAppears();
  });

  test('Verify timestamp accuracy on each stream card', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyStreamTimestampAccuracy();
  });

  test('Verify Stream search returns correct results for a valid keyword', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyStreamSearchFunctionality("Lead Assigned", true);
  });

  test('Verify Stream updates in real time', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyStreamUpdatesInRealTime();
  });

  test('Test search with invalid data', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.verifyStreamSearchFunctionality("thisShouldNotExist12345", false);
  });

  test('Ensure missing records are not displayed', async ({ sessionPage }) => {
    const contact = new ContactPage(sessionPage);
    await contact.addAndDeleteContact();
  });

});