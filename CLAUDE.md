# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies and browsers
npm install
npx playwright install chromium

# Run all tests
npx playwright test

# Run a specific module
npx playwright test remmi-e2e-test/tests/listing
npx playwright test remmi-e2e-test/tests/contacts
npx playwright test remmi-e2e-test/tests/projects

# Run a single spec file
npx playwright test remmi-e2e-test/tests/login/login.spec.ts

# Run a single test by title
npx playwright test --grep "Test 1: Open listing form"

# Run headed (visible browser)
npx playwright test --headed

# View HTML report after a run
npx playwright show-report
```

## Environment Setup

Create `.env` in the project root. Required variables:

```env
BASE_URL=https://portal-staging.remmi.com.au
DASHBOARD_URL=https://portal-staging.remmi.com.au/dashboard

E2E_MANAGER_EMAIL=
E2E_MANAGER_PASSWORD=
E2E_MANAGER_OTP_SECRET=

E2E_SALES_EMAIL=
E2E_SALES_PASSWORD=
E2E_SALES_OTP_SECRET=

E2E_ADMIN_EMAIL=
E2E_ADMIN_PASSWORD=
E2E_ADMIN_OTP_SECRET=

E2E_MANAGER_GOOGLE_SECRET=
```

`playwright.config.ts` will exit immediately if `BASE_URL` is missing.

## Architecture (POM)

```
remmi-e2e-test/
├── pages/            # Page Object classes (one per module)
│   ├── login/        LoginPage.ts + LoginLocators.ts + LoginMessages.ts
│   ├── contacts/     ContactPage.ts + ContactLocators.ts
│   ├── listing/      ListingPage.ts + ListingLocators.ts
│   ├── dashboard/    DashboardPage.ts + DashboardLocators.ts
│   ├── myprofile/    MyProfilePage.ts + MyProfileLocators.ts
│   └── projects/     ProjectPage.ts
├── tests/            # Spec files only (no page logic here)
│   ├── login/
│   ├── contacts/     (+ Images/ subfolder for test attachments)
│   ├── listing/      (+ PropertyImages/ subfolder)
│   ├── dashboard/
│   ├── myprofile/    (+ Images/ subfolder)
│   └── projects/     (+ Images/ subfolder)
├── fixtures/         test-data.ts — role → env-var credential map
├── helpers/          getOtp.ts, mfaHelper.ts, updateEnvVariable.ts
├── auth/             sessionManager.ts
└── sessions/         *.json auth state files (gitignored)
```

### Layer responsibilities

| Layer | Location | Role |
|---|---|---|
| Locators | `pages/*/<Module>Locators.ts` | Returns `Locator` objects only — no assertions |
| Page Object | `pages/*/<Module>Page.ts` | Orchestrates flows using locators; owns `expect()` calls |
| Tests | `tests/*/*.spec.ts` | Fixture setup + calls one Page method per test |

### Session management

Tests do not log in per-test. Each spec loads a pre-saved browser storage state:

```ts
const context = await browser.newContext({ storageState: managerSessionPath });
```

- `auth/sessionManager.ts` — creates the session via full login flow, saves `storageState` to `sessions/<role>-session.json`; reuses the file if it exists
- `helpers/mfaHelper.ts` — decodes QR codes and fetches OTP via `POST https://staging.remmi.com.au/api/v1/verify-mfa`
- `fixtures/test-data.ts` — maps role names (`manager`, `sales`, `admin`) to env-var credentials

If a session expires, delete `sessions/<role>-session.json` and re-run to regenerate.

### How a spec file is structured

```ts
// 1. Extend base with a session-backed page fixture (worker scope = shared across tests)
const test = base.extend<{ sessionPage: any }>({
  sessionPage: [async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: managerSessionPath });
    const page = await context.newPage();
    await page.goto(DASHBOARD_URL);
    await use(page);
  }, { scope: 'worker' }]
});

// 2. Instantiate the Page Object and call one method per test
test('Test 1: ...', async ({ sessionPage }) => {
  const listingPage = new ListingPage(sessionPage);
  await listingPage.someFlow();
});
```

### Key configuration

- `workers: 1` — tests run sequentially (stateful session, no parallelism)
- `retries: 3` — flaky UI steps are retried automatically
- `timeout: 120000` — 2 min per test; `navigationTimeout` also 2 min
- Browser launches maximized (`--start-maximized`); viewport set to `null` to honour OS size
