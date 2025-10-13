import { test, expect } from '@playwright/test';
import { MyProfileActions } from './MyProfileActions';
import { LoginActions } from '../Login/LoginAction';
import { LoginUsers } from '../../fixture/test-data';
import path from 'path';
import fs from 'fs';

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

async function validateImageResolutionWarning() {
  await profile.navigateToProfilePage();
  const imagePath = path.resolve(__dirname, 'Images/High.jpg');
  await profile.validateImageResolutionWarning(imagePath);
}

async function VerifyInvalidImageFormats(){
  await profile.navigateToProfilePage();
  const invalidImagePath = path.resolve(__dirname, 'Images/invalidImage.webp');

  // 🛠 Ensure the "Images" folder exists
  if (!fs.existsSync(path.dirname(invalidImagePath))) {
    fs.mkdirSync(path.dirname(invalidImagePath), { recursive: true });
  }

  // 🧪 Create a dummy invalid file if it doesn't exist
  if (!fs.existsSync(invalidImagePath)) {
    fs.writeFileSync(invalidImagePath, 'This is not a valid image file');
    console.log('⚠️ Created dummy invalid image file at:', invalidImagePath);
  }
  // Upload the invalid image
  await profile.VerifyInvalidImageFormats(invalidImagePath);
}

async function ChangeProfileImage(){
  await profile.navigateToProfilePage();
  const imagePath = path.resolve(__dirname, 'Images/Profile.jpg');

  await profile.ChangeProfileImage(imagePath);


}

async function VerifyProfileImagePersistsAfterReload(){
  await profile.navigateToProfilePage();
  const imagePath = path.resolve(__dirname, 'Images/High.jpg');
  await profile.VerifyProfileImagePersistsAfterReload(imagePath);
}

async function VerifyDefaultPlaceholder(){
  await profile.navigateToProfilePage();
  await profile.VerifyDefaultPlaceholder();
}

async function removeSelectedProfileImage(){
  await profile.navigateToProfilePage();
  await profile.removeSelectedProfileImage();
}
async function verifyAgentFaceAspectRatio(){
  await profile.navigateToProfilePage();
  const imagePath = path.resolve(__dirname, 'Images/High.jpg');
  await profile.verifyAgentFaceAspectRatio(imagePath);

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
    await validateImageResolutionWarning()
  });
  test('Test 8: Verify invalid image formats cannot be uploaded', async () => {
    await VerifyInvalidImageFormats()
  });

  test('Test 9: Verify system allows changing profile image', async () => {
    await ChangeProfileImage()
  });

  test('Test 1o: Verified profile image persists after reload', async () => {
    await VerifyProfileImagePersistsAfterReload();
  });
  test('Test 11: Verify the default placeholder is visible when no image is uploaded', async () => {
    await VerifyDefaultPlaceholder();
  });
  test('Test 12: Verify user can remove the selected profile image', async () => {
    await removeSelectedProfileImage();
  });
  
  test('Test 13: Verify correct aspect ratio is maintained for uploaded images', async () => {
    await verifyAgentFaceAspectRatio();
  });
});
