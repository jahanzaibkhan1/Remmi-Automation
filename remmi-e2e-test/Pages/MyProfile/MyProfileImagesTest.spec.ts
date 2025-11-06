import { test } from '@playwright/test';
import { MyProfileActions } from './MyProfileActions';
import { LoginActions } from '../Login/LoginAction';
import { LoginUsers } from '../../fixture/test-data';
import path from 'path';
import fs from 'fs';

const OprationManager = LoginUsers.manager;
const salesAgent = LoginUsers.sales;
const admin = LoginUsers.admin;

const IMAGE_DIR = path.resolve(__dirname, 'Images');

/** Helpers to ensure files/folders for tests */
function ensureDirExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function ensureFileExists(filepath: string, content = 'This is not a valid image file') {
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, content);
    console.log('⚠️ Created dummy image file at:', filepath);
  }
}

test.describe('My Profile Tests - Remmi E2E', () => {
  test('Test 1: User can upload a profile image', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );


    await profile.navigateToProfilePage();
    const imagePath = path.join(IMAGE_DIR, 'High.jpg');
    await profile.UploadImageProfile(imagePath);
  });

  test('Test 2: User can open the upload multiple images flow', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await profile.navigateToProfilePage();
    const imagePath = path.join(IMAGE_DIR, 'Profile.jpg');
    await profile.uploadMultipleImages(imagePath);
  });

  test('Test 3: Verify selected image is set as the profile image', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await profile.navigateToProfilePage();
    await profile.setImageAsDefaultProfile();
  });

  test('Test 4: Verify thumbnails appear after image upload', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await profile.navigateToProfilePage();
    const imagePath = path.join(IMAGE_DIR, 'High.jpg');
    await profile.verifyThumbnailsAfterImageUpload(imagePath);
  });

  test('Test 5: Verify thumbnails are removed when clicking cross button', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await profile.navigateToProfilePage();
    const imagePath = path.join(IMAGE_DIR, 'High.jpg');
    await profile.verifyThumbnailsAreRemoved(imagePath);
  });

  test('Test 6: User can edit and delete low resolution and agent face thumbnails', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await profile.navigateToProfilePage();
    const imagePath1 = path.join(IMAGE_DIR, 'High.jpg');
    const imagePath2 = path.join(IMAGE_DIR, 'High.jpg');
    await profile.manageExistingThumbnails(imagePath1, imagePath2);
  });

  test('Test 7: Verify system shows a warning when low resolution image is too small', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await profile.navigateToProfilePage();
    const imagePath = path.join(IMAGE_DIR, 'High.jpg');
    await profile.validateImageResolutionWarning(imagePath);
  });

  test('Test 8: Verify invalid image formats cannot be uploaded', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await profile.navigateToProfilePage();
    const invalidImagePath = path.join(IMAGE_DIR, 'invalidImage.webp');
    ensureDirExists(IMAGE_DIR);
    ensureFileExists(invalidImagePath);
    await profile.VerifyInvalidImageFormats(invalidImagePath);
  });

  test('Test 9: Verify system allows changing profile image', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await profile.navigateToProfilePage();
    const imagePath = path.join(IMAGE_DIR, 'Profile.jpg');
    await profile.ChangeProfileImage(imagePath);
  });

  test('Test 10: Verified profile image persists after reload', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await profile.navigateToProfilePage();
    const imagePath = path.join(IMAGE_DIR, 'High.jpg');
    await profile.VerifyProfileImagePersistsAfterReload(imagePath);
  });

  test('Test 11: Verify the default placeholder is visible when no image is uploaded', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await profile.navigateToProfilePage();
    await profile.VerifyDefaultPlaceholder();
  });

  test('Test 12: Verify user can remove the selected profile image', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await profile.navigateToProfilePage();
    await profile.removeSelectedProfileImage();
  });
  
  test('Test 13: Verify correct aspect ratio is maintained for uploaded images', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await profile.navigateToProfilePage();
    const imagePath = path.join(IMAGE_DIR, 'High.jpg');
    await profile.verifyAgentFaceAspectRatio(imagePath);
  });

  test('Test 14: Verify system does not allow uploading broken/corrupt image files', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await profile.navigateToProfilePage();
    const brokenImagePath = path.join(IMAGE_DIR, 'broken_image.jpg');
    ensureDirExists(IMAGE_DIR);
    ensureFileExists(brokenImagePath);
    await profile.UploadBrokenImage(brokenImagePath);
  });

  test('Test 15: Verify system allows only specific file formats (e.g., JPG, PNG)', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

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

  test('Test 16: Verify proper error message is shown when upload fails', async ({ page }) => {
    const login = new LoginActions(page);
    const profile = new MyProfileActions(page);

    await login.login(
      OprationManager.email!,
      OprationManager.password!,
      process.env.E2E_MANAGER_OTP_SECRET!
    );

    await profile.navigateToProfilePage();
    const imagePath = path.join(IMAGE_DIR, 'Profile.jpg');
    await profile.verifyUploadFailureOnNetworkError(imagePath);
  });
});
