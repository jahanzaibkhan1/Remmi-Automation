import { test } from '../../fixtures/session.fixture';
import { MyProfilePage } from '../../pages/myprofile/MyProfilePage';
import * as path from 'path';

test.describe('My Profile Tests - Remmi E2E', () => {
  // 1. Profile fields show data & are non-editable
  test('1. Profile fields show data & are non-editable', async ({ sessionPage }) => {
    const profile = new MyProfilePage(sessionPage);

    await profile.navigateToProfilePage();
    await profile.verifyAllProfileFields();
  });

  // 2. Fields remain non-editable if data missing
  test('2. Fields remain non-editable if data missing', async ({ sessionPage }) => {
    const profile = new MyProfilePage(sessionPage);

    await profile.navigateToProfilePage();
    await profile.verifyAllProfileFields();
  });

  // 3. PIN field allows input and updates profile
  test('3. PIN field allows input and updates profile', async ({ sessionPage }) => {
    const profile = new MyProfilePage(sessionPage);

    await profile.navigateToProfilePage();
    await profile.enterPinAndSave('1234');
  });

  // 4. Calendar color selection updates correctly
  test('4. Calendar color selection updates correctly', async ({ sessionPage }) => {
    const profile = new MyProfilePage(sessionPage);
    await profile.navigateToProfilePage();
    await profile.updateCalendarColor('#c0add5');
  });

  // 5. Correct PIN allows private download
  test('5. Correct PIN allows private download', async ({ sessionPage }) => {
    const profile = new MyProfilePage(sessionPage);

    await profile.navigateToLibrary();
    const imagePath = path.join(__dirname, 'Images/Profile.jpg');
    await profile.uploadImageToLibrary(imagePath);
    await profile.downloadWithCorrectPin('1234');
  });

  // 6. PIN is required for private download (empty PIN case)
  test('6. PIN is required for private download (empty PIN case)', async ({ sessionPage }) => {
    const profile = new MyProfilePage(sessionPage);

    await profile.navigateToLibrary();
    await profile.downloadWithEmptyPin();
  });

  // 7. PIN is required for private download (validation)
  test('7. PIN is required for private download (validation)', async ({ sessionPage }) => {
    const profile = new MyProfilePage(sessionPage);

    await profile.navigateToLibrary();
    await profile.verifyPINIsRequired();
  });

  // 8. Incorrect PIN prevents private download
  test('8. Incorrect PIN prevents private download', async ({ sessionPage }) => {
    const profile = new MyProfilePage(sessionPage);

    await profile.navigateToLibrary();
    await profile.downloadWithIncorrectPin('1230');
  });

  // 9. System does not allow invalid calendar color (commented out by default)
  // test('9. System does not allow invalid calendar color', async ({ sessionPage }) => {
  //   const profile = new MyProfilePage(sessionPage);
  //   await profile.navigateToProfilePage();
  //   await profile.tryInvalidCalendarColor('INVALID_COLOR');
  // });
});
