import { test } from '../../fixtures/session.fixture';
import { NoticeBoardPage } from '../../pages/dashboard/NoticeBoardPage';

test.describe('Notice Board', () => {
  test('Verify public message on Noticeboard', async ({ sessionPage }) => {
    await new NoticeBoardPage(sessionPage).verifyPublicMessageOnNoticeboard();
  });

  test('Verify private message to specific staff', async ({ sessionPage }) => {
    await new NoticeBoardPage(sessionPage).verifyPrivateMessageToSpecificStaff();
  });

  test('Verify private message to specific office', async ({ sessionPage }) => {
    await new NoticeBoardPage(sessionPage).verifyPrivateMessageToSpecificOffice();
  });

  test('Verify private message to specific team', async ({ sessionPage }) => {
    await new NoticeBoardPage(sessionPage).verifyPrivateMessageToSpecificTeam();
  });

  test('Verify message deletion from Noticeboard', async ({ sessionPage }) => {
    await new NoticeBoardPage(sessionPage).verifyMessageDeletionFromNoticeboard();
  });

  test('Verify that the user name is shown when a message is added to the Noticeboard', async ({ sessionPage }) => {
    await new NoticeBoardPage(sessionPage).verifyUserNameOnNoticeboardMessage();
  });

  test('Verify comment on a message', async ({ sessionPage }) => {
    await new NoticeBoardPage(sessionPage).verifyCommentOnNoticeboardMessage();
  });

  test('Verify react on a message', async ({ sessionPage }) => {
    await new NoticeBoardPage(sessionPage).verifyReactOnNoticeboardMessage();
  });

  test('Add a blank message on Noticeboard', async ({ sessionPage }) => {
    await new NoticeBoardPage(sessionPage).addBlankMessageOnNoticeboard();
  });

  test('Verify scrolling loads all Noticeboard comments', async ({ sessionPage }) => {
    await new NoticeBoardPage(sessionPage).verifyNoticeboardCommentScrollAndCleanup();
  });
});
