import { test } from '../../fixtures/session.fixture';
import { ListingConjunctionPage as ListingPage } from '../../pages/listing/ListingConjunctionPage';

test.describe('Listing side Menu Tests - Remmi E2E', () => {

    test('Test 1: Verify that the Conjunction Tab opens correctly', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifyConjunctionTabOpensCorrectly();
    });

    test('Test 2: Verify that Sale Commission accepts only numeric values', async ({ sessionPage }) => {
        const listingActions = new ListingPage(sessionPage);
        await listingActions.verifySaleCommissionAcceptsOnlyNumeric();
    });

});