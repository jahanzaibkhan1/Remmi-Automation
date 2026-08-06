import { test } from '../../fixtures/session.fixture';
import { MyProfileSocialPage as MyProfilePage } from '../../pages/myprofile/MyProfileSocialPage';

test.describe('Social Settings Tests - Remmi E2E', () => {
  test('Test 1: The user can successfully upload social media links and the page updates correctly', async ({ sessionPage }) => {
    const profile = new MyProfilePage(sessionPage);

    await profile.navigateToProfilePage();
    await profile.updateSocialSettings({
      facebook: 'https://facebook.com/myprofile',
      xUrl: 'https://x.com/myprofile',
      instagram: 'https://instagram.com/myprofile',
      linkedIn: 'https://linkedin.com/in/myprofile',
      website: 'https://mywebsite.com',
      marketingEmail: 'marketing@example.com',
      selectBso: 'Jahanzaib Xenex',
    });
  });
});
