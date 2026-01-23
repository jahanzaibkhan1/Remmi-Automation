import { test as base } from '@playwright/test';
import { MyProfileActions } from './MyProfileActions';
import * as path from 'path';
import * as fs from 'fs';

const managerSessionPath = path.join(__dirname, '../../sessions/manager-session.json');
const DASHBOARD_URL = process.env.DASHBOARD_URL || 'https://remmi-app-stage-ui.azurewebsites.net/dashboard';

const IMAGE_DIR = path.resolve(__dirname, 'Images');

// Utility functions to ensure directory and file existence
function ensureDirExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}
function ensureFileExists(filePath: string) {
  if (!fs.existsSync(filePath)) {
    // Create a dummy file if it does not exist.
    fs.writeFileSync(filePath, '');
  }
}

// Extend test to provide sessionPage for authenticated context
const test = base.extend<{ sessionPage: any }>({
  sessionPage: [async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: managerSessionPath });
    try {
      const page = await context.newPage();
      await page.goto(DASHBOARD_URL);
      await use(page);
    } finally {
      // Optionally close context if desired in cleanup
    }
  }, { scope: 'worker' }]
});

test.describe('My Profile Image Tests - Remmi E2E', () => {
  test('Test 1: User can upload a profile image', async ({ sessionPage }) => {
    const profile = new MyProfileActions(sessionPage);

    await profile.navigateToProfilePage();
    const imagePath = path.join(IMAGE_DIR, 'High.jpg');
    await profile.UploadImageProfile(imagePath);
  });

  test('Test 2: User can open the upload multiple images flow', async ({ sessionPage }) => {
    const profile = new MyProfileActions(sessionPage);

    await profile.navigateToProfilePage();
    const imagePath = path.join(IMAGE_DIR, 'Profile.jpg');
    await profile.uploadMultipleImages(imagePath);
  });

  test('Test 3: Verify selected image is set as the profile image', async ({ sessionPage }) => {
    const profile = new MyProfileActions(sessionPage);

    await profile.navigateToProfilePage();
    await profile.setImageAsDefaultProfile();
  });

  test('Test 4: Verify thumbnails appear after image upload', async ({ sessionPage }) => {
    const profile = new MyProfileActions(sessionPage);

    await profile.navigateToProfilePage();
    const imagePath = path.join(IMAGE_DIR, 'High.jpg');
    await profile.verifyThumbnailsAfterImageUpload(imagePath);
  });

  test('Test 5: Verify thumbnails are removed when clicking cross button', async ({ sessionPage }) => {
    const profile = new MyProfileActions(sessionPage);

    await profile.navigateToProfilePage();
    const imagePath = path.join(IMAGE_DIR, 'High.jpg');
    await profile.verifyThumbnailsAreRemoved(imagePath);
  });

  test('Test 6: User can edit and delete low resolution and agent face thumbnails', async ({ sessionPage }) => {
    const profile = new MyProfileActions(sessionPage);

    await profile.navigateToProfilePage();
    const imagePath1 = path.join(IMAGE_DIR, 'High.jpg');
    const imagePath2 = path.join(IMAGE_DIR, 'High.jpg');
    await profile.manageExistingThumbnails(imagePath1, imagePath2);
  });

  test('Test 7: Verify system shows a warning when low resolution image is too small', async ({ sessionPage }) => {
    const profile = new MyProfileActions(sessionPage);

    await profile.navigateToProfilePage();
    const imagePath = path.join(IMAGE_DIR, 'High.jpg');
    await profile.validateImageResolutionWarning(imagePath);
  });

  test('Test 8: Verify invalid image formats cannot be uploaded', async ({ sessionPage }) => {
    const profile = new MyProfileActions(sessionPage);

    await profile.navigateToProfilePage();
    const invalidImagePath = path.join(IMAGE_DIR, 'invalidImage.webp');
    ensureDirExists(IMAGE_DIR);
    ensureFileExists(invalidImagePath);
    await profile.VerifyInvalidImageFormats(invalidImagePath);
  });

  test('Test 9: Verify system allows changing profile image', async ({ sessionPage }) => {
    const profile = new MyProfileActions(sessionPage);

    await profile.navigateToProfilePage();
    const imagePath = path.join(IMAGE_DIR, 'Profile.jpg');
    await profile.ChangeProfileImage(imagePath);
  });

  test('Test 10: Verified profile image persists after reload', async ({ sessionPage }) => {
    const profile = new MyProfileActions(sessionPage);

    await profile.navigateToProfilePage();
    const imagePath = path.join(IMAGE_DIR, 'Profile.jpg');
    await profile.VerifyProfileImagePersistsAfterReload(imagePath);
  });

  test('Test 11: Verify the default placeholder is visible when no image is uploaded', async ({ sessionPage }) => {
    const profile = new MyProfileActions(sessionPage);

    await profile.navigateToProfilePage();
    await profile.VerifyDefaultPlaceholder();
  });

  test('Test 12: Verify user can remove the selected profile image', async ({ sessionPage }) => {
    const profile = new MyProfileActions(sessionPage);

    await profile.navigateToProfilePage();
    await profile.removeSelectedProfileImage();
  });
  
  test('Test 13: Verify correct aspect ratio is maintained for uploaded images', async ({ sessionPage }) => {
    const profile = new MyProfileActions(sessionPage);

    await profile.navigateToProfilePage();
    const imagePath = path.join(IMAGE_DIR, 'High.jpg');
    await profile.verifyAgentFaceAspectRatio(imagePath);
  });

  test('Test 14: Verify system does not allow uploading broken/corrupt image files', async ({ sessionPage }) => {
    const profile = new MyProfileActions(sessionPage);

    await profile.navigateToProfilePage();
    const brokenImagePath = path.join(IMAGE_DIR, 'broken_image.jpg');
    ensureDirExists(IMAGE_DIR);
    ensureFileExists(brokenImagePath);
    await profile.UploadBrokenImage(brokenImagePath);
  });

  test('Test 15: Verify system allows only specific file formats (e.g., JPG, PNG)', async ({ sessionPage }) => {
    const profile = new MyProfileActions(sessionPage);

    await profile.navigateToProfilePage();
    const validPaths = [
      path.join(IMAGE_DIR, 'Profile.jpg'),
      path.join(IMAGE_DIR, 'premium.png')
    ];
    const invalidPaths = [
      path.join(IMAGE_DIR, 'invalidImage.webp'),
      path.join(IMAGE_DIR, 'broken_image.jpg')
    ];
    await profile.verifyAllowedImageFileFormats(validPaths, invalidPaths);
  });

  // test('Test 16: Verify proper error message is shown when upload fails', async ({ sessionPage }) => {
  //   const profile = new MyProfileActions(sessionPage);

  //   await profile.navigateToProfilePage();
  //   const imagePath = path.join(IMAGE_DIR, 'Profile.jpg');
  //   await profile.verifyUploadFailureOnNetworkError(imagePath);
  // });
});
