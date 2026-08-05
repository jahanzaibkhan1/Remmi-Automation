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
│   ├── Pages/
│   │   ├── Contacts/       # Contact module tests
│   │   ├── Dashboard/      # Dashboard tests
│   │   ├── Listing/        # Listing module tests
│   │   ├── Login/          # Authentication tests
│   │   ├── MyProfile/      # Profile & settings tests
│   │   └── Projects/       # Projects module tests
│   ├── auth/               # Session management
│   ├── fixture/            # Shared test data
│   ├── helper/             # Utility functions (OTP, env)
│   └── sessions/           # Auth session storage (gitignored)
├── playwright.config.ts
├── .env                    # Environment variables (gitignored)
└── package.json
```

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
EMAIL=your-test-email@example.com
PASSWORD=your-test-password
```

---

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run a specific module
```bash
npx playwright test remmi-e2e-test/Pages/Listing
npx playwright test remmi-e2e-test/Pages/Contacts
npx playwright test remmi-e2e-test/Pages/Projects
```

### Run a specific spec file
```bash
npx playwright test remmi-e2e-test/Pages/Login/login.spec.ts
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

| Module | Specs |
|---|---|
| Login | Sign in, MFA |
| Dashboard | Overview, notice board |
| Contacts | CRUD, leads, tasks, notes, streams, associations |
| Listing | Forms, images, calendar, documents, portals, legal, inspections |
| Projects | Setup, lot lists, precincts, price lists, grid view |
| My Profile | Profile info, images, MFA, social settings, teams, notifications |
