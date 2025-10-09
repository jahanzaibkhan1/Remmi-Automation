import { test, expect } from '@playwright/test';
import { MyProfileActions } from './MyProfileActions';
import { LoginActions } from '../Login/LoginAction';
import { LoginUsers } from '../../fixture/test-data';
import path from 'path';

const manager = LoginUsers.manager;

let login: LoginActions;
let profile: MyProfileActions;

async function uploadProfileImage() {
  await profile.navigateToProfilePage();
  const imagePath = path.resolve(__dirname, 'Images/High.jpg');
  await profile.UploadImageProfile(imagePath);
}

async function uploadMultipleImages() {
  await profile.navigateToProfilePage();
  const imagePath = path.resolve(__dirname, 'Images/Profile.jpg');
  await profile.uploadMultipleImages(imagePath);
}

async function setImageAsDefaultProfile() {
  await profile.navigateToProfilePage();
  await profile.setImageAsDefaultProfile();
}

async function verifyThumbnailsAfterImageUpload() {
  await profile.navigateToProfilePage();
  const imagePath = path.resolve(__dirname, 'Images/High.jpg');
  await profile.verifyThumbnailsAfterImageUpload(imagePath);
}

async function verifyThumbnailsAreRemoved() {
  await profile.navigateToProfilePage();
  const imagePath = path.resolve(__dirname, 'Images/High.jpg');
  await profile.verifyThumbnailsAreRemoved(imagePath);
}

async function manageExistingThumbnails() {
  await profile.navigateToProfilePage();
  const imagePath1 = path.resolve(__dirname, 'Images/High.jpg');
  const imagePath2 = path.resolve(__dirname, 'Images/Profile.jpg');
  await profile.manageExistingThumbnails(imagePath1, imagePath2);
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
});
