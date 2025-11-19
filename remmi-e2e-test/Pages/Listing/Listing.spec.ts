import { test } from '@playwright/test';
import { ListingActions } from './ListingAction';
import { LoginActions } from '../Login/LoginAction';
import { LoginUsers } from '../../fixture/test-data';

const manager = LoginUsers.manager;

test('Test Case 1: Searching for a valid contact', async ({ page }) => {
  const login = new LoginActions(page);
  await login.login(
    manager.email!,
    manager.password!,
    process.env.E2E_MANAGER_OTP_SECRET || manager.otpSecret!
  );
  const listingActions = new ListingActions(page);
  await listingActions.searchForValidListing('Hina Ryan');
});
