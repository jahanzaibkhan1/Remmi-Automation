import { test as base } from '@playwright/test';
import { ContactActions } from './contactAction';
import * as path from 'path';
import * as fs from 'fs';
import { faker } from '@faker-js/faker'; // <-- FIX: add import for faker

const managerSessionPath = path.join(__dirname, '../../sessions/manager-session.json');
const DASHBOARD_URL = process.env.DASHBOARD_URL || 'https://remmi-app-stage-ui.azurewebsites.net/dashboard';

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

});