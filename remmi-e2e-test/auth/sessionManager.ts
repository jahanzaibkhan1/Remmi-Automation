import { Browser } from '@playwright/test';
import { LoginPage } from '../pages/login/LoginPage';
import { LoginUsers } from '../fixtures/test-data';
import path from 'path';
import fs from 'fs';

const SESSION_MAX_AGE_MS = 23 * 60 * 60 * 1000; // treat sessions older than 23 h as stale

// Module-level cache: avoids redundant fs.existsSync calls across tests in the same run
const resolvedSessions = new Map<string, string>();
let sessionsDirEnsured = false;

export async function getSessionForRole(browser: Browser, role: keyof typeof LoginUsers) {
  // Fast path: already resolved this role this run
  if (resolvedSessions.has(role)) {
    return resolvedSessions.get(role)!;
  }

  const sessionsDir = path.join(__dirname, '..', 'sessions');
  if (!sessionsDirEnsured) {
    if (!fs.existsSync(sessionsDir)) fs.mkdirSync(sessionsDir);
    sessionsDirEnsured = true;
  }

  const sessionFile = path.join(sessionsDir, `${role}-session.json`);

  // Reuse if session file exists and is less than 23 hours old
  if (fs.existsSync(sessionFile)) {
    const ageMs = Date.now() - fs.statSync(sessionFile).mtimeMs;
    if (ageMs < SESSION_MAX_AGE_MS) {
      console.log(`🔄 Using existing session for role: ${role}`);
      resolvedSessions.set(role, sessionFile);
      return sessionFile;
    }
    console.log(`⚠️  Session for '${role}' is stale (>${Math.round(ageMs / 3600000)}h old) — re-logging in.`);
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

  const context = await browser.newContext();
  const page = await context.newPage();
  const login = new LoginPage(page);

  try {
    await login.login(user.email, user.password, user.otpSecret);
    await context.storageState({ path: sessionFile });
    console.log(`✅ Saved session for ${role} at: ${sessionFile}`);
    resolvedSessions.set(role, sessionFile);
  } catch (err) {
    console.error(`❌ Login failed for role '${role}' — session not saved.`);
    throw err;
  } finally {
    await context.close();
  }

  return sessionFile;
}
