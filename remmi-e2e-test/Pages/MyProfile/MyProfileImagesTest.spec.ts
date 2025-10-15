import { test } from '@playwright/test';
import { MyProfileActions } from './MyProfileActions';
import { LoginActions } from '../Login/LoginAction';
import { LoginUsers } from '../../fixture/test-data';
import path from 'path';
import fs from 'fs';

const manager = LoginUsers.manager;

let login: LoginActions;
let profile: MyProfileActions;

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

async function uploadProfileImage() {
  await profile.navigateToProfilePage();
  const imagePath = path.join(IMAGE_DIR, 'High.jpg');
  await profile.UploadImageProfile(imagePath);
}

async function uploadMultipleImages() {
  await profile.navigateToProfilePage();
  const imagePath = path.join(IMAGE_DIR, 'Profile.jpg');
  await profile.uploadMultipleImages(imagePath);
}

async function setImageAsDefaultProfile() {
  await profile.navigateToProfilePage();
  await profile.setImageAsDefaultProfile();
}

async function verifyThumbnailsAfterImageUpload() {
  await profile.navigateToProfilePage();
  const imagePath = path.join(IMAGE_DIR, 'High.jpg');
  await profile.verifyThumbnailsAfterImageUpload(imagePath);
}

async function verifyThumbnailsAreRemoved() {
  await profile.navigateToProfilePage();
  const imagePath = path.join(IMAGE_DIR, 'High.jpg');
  await profile.verifyThumbnailsAreRemoved(imagePath);
}

async function manageExistingThumbnails() {
  await profile.navigateToProfilePage();
  const imagePath1 = path.join(IMAGE_DIR, 'High.jpg');
  const imagePath2 = path.join(IMAGE_DIR, 'Profile.jpg');
  await profile.manageExistingThumbnails(imagePath1, imagePath2);
}

async function validateImageResolutionWarning() {
  await profile.navigateToProfilePage();
  const imagePath = path.join(IMAGE_DIR, 'High.jpg');
  await profile.validateImageResolutionWarning(imagePath);
}

async function verifyInvalidImageFormats() {
  await profile.navigateToProfilePage();
  const invalidImagePath = path.join(IMAGE_DIR, 'invalidImage.webp');
  ensureDirExists(IMAGE_DIR);
  ensureFileExists(invalidImagePath);
  await profile.VerifyInvalidImageFormats(invalidImagePath);
}

async function changeProfileImage() {
  await profile.navigateToProfilePage();
  const imagePath = path.join(IMAGE_DIR, 'Profile.jpg');
  await profile.ChangeProfileImage(imagePath);
}

async function verifyProfileImagePersistsAfterReload() {
  await profile.navigateToProfilePage();
  const imagePath = path.join(IMAGE_DIR, 'High.jpg');
  await profile.VerifyProfileImagePersistsAfterReload(imagePath);
}

async function verifyDefaultPlaceholder() {
  await profile.navigateToProfilePage();
  await profile.VerifyDefaultPlaceholder();
}

async function removeSelectedProfileImage() {
  await profile.navigateToProfilePage();
  await profile.removeSelectedProfileImage();
}

async function verifyAgentFaceAspectRatio() {
  await profile.navigateToProfilePage();
  const imagePath = path.join(IMAGE_DIR, 'High.jpg');
  await profile.verifyAgentFaceAspectRatio(imagePath);
}

async function uploadBrokenImage() {
  await profile.navigateToProfilePage();
  const brokenImagePath = path.join(IMAGE_DIR, 'broken_image.jpg');
  ensureDirExists(IMAGE_DIR);
  ensureFileExists(brokenImagePath);
  await profile.UploadBrokenImage(brokenImagePath);
}

async function verifyAllowedImageFileFormats() {
  await profile.navigateToProfilePage();
  const validPaths = [
    path.join(IMAGE_DIR, 'Profile.jpg'),
    path.join(IMAGE_DIR, 'High.png')
  ];
  const invalidPaths = [
    path.join(IMAGE_DIR, 'invalidImage.webp'),
    path.join(IMAGE_DIR, 'broken_image.jpg')
  ];
  await profile.verifyAllowedImageFileFormats(validPaths, invalidPaths);
}

async function verifyUploadFailureOnNetworkError(){
  await profile.navigateToProfilePage();
  const imagePath = path.join(IMAGE_DIR, 'Profile.jpg');
  await profile.verifyUploadFailureOnNetworkError(imagePath);
}

test.describe('My Profile Tests - Remmi E2E', () => {
  test.beforeEach(async ({ page }) => {
    login = new LoginActions(page);
    profile = new MyProfileActions(page);

    if (!manager.email || !manager.password || !manager.otpSecret) {
      test.skip(true, 'Skipping login tests: missing environment credentials');
    }

    await login.login(manager.email!, manager.password!, manager.otpSecret!);
  });

  test('Test 1: User can upload a profile image', async () => {
    await uploadProfileImage();
  });

  test('Test 2: User can open the upload multiple images flow', async () => {
    await uploadMultipleImages();
  });

  test('Test 3: Verify selected image is set as the profile image', async () => {
    await setImageAsDefaultProfile();
  });

  test('Test 4: Verify thumbnails appear after image upload', async () => {
    await verifyThumbnailsAfterImageUpload();
  });

  test('Test 5: Verify thumbnails are removed when clicking cross button', async () => {
    await verifyThumbnailsAreRemoved();
  });

  test('Test 6: User can edit and delete low resolution and agent face thumbnails', async () => {
    await manageExistingThumbnails();
  });

  test('Test 7: Verify system shows a warning when low resolution image is too small', async () => {
    await validateImageResolutionWarning();
  });

  test('Test 8: Verify invalid image formats cannot be uploaded', async () => {
    await verifyInvalidImageFormats();
  });

  test('Test 9: Verify system allows changing profile image', async () => {
    await changeProfileImage();
  });

  test('Test 10: Verified profile image persists after reload', async () => {
    await verifyProfileImagePersistsAfterReload();
  });

  test('Test 11: Verify the default placeholder is visible when no image is uploaded', async () => {
    await verifyDefaultPlaceholder();
  });

  test('Test 12: Verify user can remove the selected profile image', async () => {
    await removeSelectedProfileImage();
  });
  
  test('Test 13: Verify correct aspect ratio is maintained for uploaded images', async () => {
    await verifyAgentFaceAspectRatio();
  });

  test('Test 14: Verify system does not allow uploading broken/corrupt image files', async () => {
    await uploadBrokenImage();
  });

  test('Test 15: Verify system allows only specific file formats (e.g., JPG, PNG)', async () => {
    await verifyAllowedImageFileFormats();
  });

  test('Test 16: Verify proper error message is shown when upload fails', async () => {
    await verifyUploadFailureOnNetworkError();
  });
});
