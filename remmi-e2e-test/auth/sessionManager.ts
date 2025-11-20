import { Browser } from '@playwright/test';
import { LoginActions } from '../Pages/Login/LoginAction';
import { LoginUsers } from '../fixture/test-data';
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

  // --- Soft validation (won't crash test suite) ---
  if (!user.email || !user.password || !user.otpSecret) {
    console.warn(
      `⚠️ Missing credentials for role '${role}'.\n` +
      `Provided → email="${user.email}", password="${user.password}", otp="${user.otpSecret}".\n`
      + `Login will probably fail — but tests will continue.`
    );
  }

  // --- Actual login ---
  const context = await browser.newContext();
  const page = await context.newPage();

  const login = new LoginActions(page);

  try {
    await login.login(user.email, user.password, user.otpSecret);

    // Save session
    await context.storageState({ path: sessionFile });
    console.log(`✅ Saved session for ${role} at: ${sessionFile}`);

  } catch (err) {
    console.error(`❌ Login failed for role '${role}' — session not saved.`);
    console.error(err);
  } finally {
    await context.close();
  }

  return sessionFile;
}
