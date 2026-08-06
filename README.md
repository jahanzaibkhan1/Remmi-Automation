# Remmi QA Automation

End-to-end test suite for the [Remmi](https://remmi.com.au) real estate platform, built with [Playwright](https://playwright.dev) and TypeScript.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Playwright | Browser automation & test runner |
| TypeScript | Language |
| Faker.js | Dynamic test data generation |
| OTPlib | MFA / OTP handling |
| dotenv | Environment variable management |

---

## Project Structure

```
remmi-qa-automation/
├── remmi-e2e-test/
│   ├── pages/
│   │   ├── common/         # BasePage (abstract base for all modules)
│   │   ├── contacts/       # ContactBasePage + 12 sub-module page classes
│   │   ├── dashboard/      # DashboardPage + NoticeBoardPage
│   │   ├── listing/        # ListingBasePage + 17 sub-module page classes
│   │   ├── login/          # LoginPage
│   │   ├── myprofile/      # MyProfileBasePage + 8 sub-module page classes
│   │   └── projects/       # ProjectBasePage + 11 sub-module page classes
│   ├── tests/
│   │   ├── contacts/       # 12 contact spec files
│   │   ├── dashboard/      # 2 spec files
│   │   ├── listing/        # 17 listing spec files
│   │   ├── login/
│   │   ├── myprofile/      # 8 spec files
│   │   └── projects/       # 11 project spec files
│   ├── auth/               # Session management (sessionManager.ts)
│   ├── fixtures/           # test-data.ts — role → credential map
│   ├── helpers/            # getOtp.ts, mfaHelper.ts, updateEnvVariable.ts
│   └── sessions/           # Auth state JSON files (gitignored)
├── playwright.config.ts
├── .env                    # Environment variables (gitignored)
└── package.json
```

### Page Object Architecture

All page classes follow a three-layer hierarchy:

```
BasePage  (common/BasePage.ts)
└── [Module]BasePage  (e.g. ListingBasePage, ContactBasePage, ProjectBasePage)
    └── [Feature]Page  (e.g. ListingFormPage, ContactLeadPage, ProjectSetupPage)
```

Each spec file imports exactly one leaf page class and calls one page method per test.

| Layer | Responsibility |
|---|---|
| `BasePage` | Shared helpers: `goto`, `assertVisible`, `clickWhenReady`, `fillAndVerify` |
| `[Module]BasePage` | Module navigation, shared locators, cross-section helpers |
| `[Feature]Page` | Feature-specific test methods and locators |

---

## Setup

### 1. Install dependencies

```bash
npm install
npx playwright install chromium
```

### 2. Configure environment variables

Create a `.env` file in the project root:

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

Tests load pre-saved browser sessions from `sessions/<role>-session.json`. If a session expires, delete the file and re-run to regenerate it.

---

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run a specific module
```bash
npx playwright test remmi-e2e-test/tests/login
npx playwright test remmi-e2e-test/tests/dashboard
npx playwright test remmi-e2e-test/tests/contacts
npx playwright test remmi-e2e-test/tests/listing
npx playwright test remmi-e2e-test/tests/projects
npx playwright test remmi-e2e-test/tests/myprofile
```

### Run a specific spec file
```bash
npx playwright test remmi-e2e-test/tests/login/login.spec.ts
```

### Run with UI mode (headed)
```bash
npx playwright test --headed
```

### View HTML report
```bash
npx playwright show-report
```

---

## Configuration

Key settings in `playwright.config.ts`:

| Setting | Value |
|---|---|
| Browser | Chromium (maximized) |
| Workers | 1 (sequential) |
| Retries | 3 |
| Timeout | 120s per test |
| Screenshots | On failure only |
| Video | Retained on failure |

---

## Test Modules

| Module | Specs | Coverage |
|---|---|---|
| Login | 1 | Sign in, MFA |
| Dashboard | 2 | Overview, notice board |
| Contacts | 12 | List, form, leads, lead forms, tasks, task forms, notes, streams, history, related contacts, related properties, associations |
| Listing | 17 | Form, grid view, list view, images, calendar, documents, portals, legal, inspections, leads, tasks, task forms, notes, history, streams, conjunction, related |
| Projects | 11 | Setup, overview, lot list, lot list form, lot form, lot list view, precinct setup, precinct lot list, price list, grid view, list view |
| My Profile | 8 | Profile info, images, MFA, social settings, access, teams, notifications, associations |
