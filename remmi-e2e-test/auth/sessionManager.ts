import { Browser } from '@playwright/test';
import { LoginPage } from '../pages/login/LoginPage';
import { LoginUsers } from '../fixtures/test-data';
import path from 'path';
import fs from 'fs';

export async function getSessionForRole(browser: Browser, role: keyof typeof LoginUsers) {
  const sessionsDir = path.join(__dirname, '..', 'sessions');
  if (!fs.existsSync(sessionsDir)) fs.mkdirSync(sessionsDir);

  const sessionFile = path.join(sessionsDir, `${role}-session.json`);

  // Reuse if session already exists
  if (fs.existsSync(sessionFile)) {
    console.log(`🔄 Using existing session for role: ${role}`);
    return sessionFile;
  }

  console.log(`⚡ Creating NEW session for role: ${role}`);

  const user = LoginUsers[role];

  if (!user) {
    console.error(`❌ Role '${role}' does not exist in LoginUsers`);
    throw new Error(`Role '${role}' not found.`);
  }

  if (!user.email || !user.password || !user.otpSecret) {
    throw new Error(
      `Missing credentials for role '${role}'. Set E2E_${role.toUpperCase()}_EMAIL, ` +
      `E2E_${role.toUpperCase()}_PASSWORD, and E2E_${role.toUpperCase()}_OTP_SECRET in .env.`
    );
  }

  // --- Actual login ---
  const context = await browser.newContext();
  const page = await context.newPage();

  const login = new LoginPage(page);

  try {
    await login.login(user.email, user.password, user.otpSecret);

    // Save session
    await context.storageState({ path: sessionFile });
    console.log(`✅ Saved session for ${role} at: ${sessionFile}`);

  } catch (err) {
    console.error(`❌ Login failed for role '${role}' — session not saved.`);
    throw err;
  } finally {
    await context.close();
  }

  return sessionFile;
}
