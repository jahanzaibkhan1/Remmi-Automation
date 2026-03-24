import { test as base } from '@playwright/test';
import { ContactActions } from './contactAction';
import * as path from 'path';

const managerSessionPath = path.join(__dirname, '../../sessions/manager-session.json');
const DASHBOARD_URL = process.env.DASHBOARD_URL;

// Extend test to provide sessionPage for authenticated context
const test = base.extend<{ sessionPage: any }>({
  sessionPage: [async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: managerSessionPath });
    try {
      const page = await context.newPage();
      await page.goto(DASHBOARD_URL);
      await use(page);
    } finally {
      // Optionally close context if desired in cleanup
    }
  }, { scope: 'worker' }]
});


test.describe('Contacts "Stream" Tab - E2E Tests', () => {
  test('Open "Stream" tab', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.openStream();
  });

  test('Verify task record appears in Stream', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyTaskAppearsInList();
  });

  test('Verify property/listing  attachment record appears', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyListingAttachmentRecordAppears()
  });

  test('Verify related contact addition record appears', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyRelatedContactRecordAppears();
  });

  test('Verify lead assignment record appears', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyLeadAssignmentRecordAppears();
  });

  test('Verify timestamp accuracy on each stream card', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyStreamTimestampAccuracy();
  });

  test('Verify Stream search returns correct results for a valid keyword', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyStreamSearchFunctionality("Lead Assigned", true);
  });

  test('Verify Stream updates in real time', async ({ sessionPage }) => {
    const contact = new ContactActions(sessionPage);
    await contact.verifyStreamUpdatesInRealTime();
  });


});