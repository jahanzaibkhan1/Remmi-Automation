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
npx playwright test remmi-e2e-test/Pages/Listing
npx playwright test remmi-e2e-test/Pages/Contacts
npx playwright test remmi-e2e-test/Pages/Projects

# Run a single spec file
npx playwright test remmi-e2e-test/Pages/Login/login.spec.ts

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

## Architecture

### Layer pattern (per module)

Each module under `remmi-e2e-test/Pages/<Module>/` has three layers:

| File | Role |
|---|---|
| `*Locator.ts` | Returns `Locator` objects only — no actions, no assertions |
| `*Action.ts` | Orchestrates user flows using the Locator class; contains `expect()` assertions |
| `*.spec.ts` | Extends `base` test with a session fixture, then calls Action methods |

### Session management

Tests do not log in per-test. Instead, each spec file creates a `sessionPage` fixture by loading a pre-saved browser storage state from `remmi-e2e-test/sessions/<role>-session.json` (gitignored).

- `auth/sessionManager.ts` — creates a session by running the full login flow and saving `storageState` to disk; reuses the file if it already exists
- `helper/mfaHelper.ts` — decodes QR codes and fetches OTP via `POST https://staging.remmi.com.au/api/v1/verify-mfa`
- `fixture/test-data.ts` — maps role names (`manager`, `sales`, `admin`) to env-var credentials

Session files are created lazily on first run. If a session expires, delete the relevant `sessions/*.json` file and re-run to regenerate.

### How a spec file is structured

```ts
// 1. Extend base test with a session-backed page fixture
const test = base.extend<{ sessionPage: any }>({
  sessionPage: [async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: managerSessionPath });
    const page = await context.newPage();
    await page.goto(DASHBOARD_URL);
    await use(page);
  }, { scope: 'worker' }]
});

// 2. Each test case instantiates Action class and calls a single method
test('Test 1: ...', async ({ sessionPage }) => {
  const actions = new ListingActions(sessionPage);
  await actions.someFlow();
});
```

### Key configuration

- `workers: 1` — tests run sequentially (stateful session, no parallelism)
- `retries: 3` — flaky UI steps are retried automatically
- `timeout: 120000` — 2 min per test; `navigationTimeout` also 2 min
- Browser launches maximized (`--start-maximized`); viewport set to `null` to honour OS size
