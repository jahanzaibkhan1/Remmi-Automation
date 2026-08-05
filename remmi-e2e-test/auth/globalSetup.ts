import { chromium } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';
import { getSessionForRole } from './sessionManager';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export default async function globalSetup() {
  const browser = await chromium.launch();
  try {
    await getSessionForRole(browser, 'manager');
  } finally {
    await browser.close();
  }
}
