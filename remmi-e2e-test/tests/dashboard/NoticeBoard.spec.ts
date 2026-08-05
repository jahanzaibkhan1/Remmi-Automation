import { test } from '../../fixtures/session.fixture';
import { DashboardPage } from '../../pages/dashboard/DashboardPage';

test.describe('Notice Board', () => {
  test('Verify public message on Noticeboard', async ({ sessionPage }) => {
    const dashboard = new DashboardPage(sessionPage);
    await dashboard.verifyPublicMessageOnNoticeboard();
  });

  test('Verify private message to specific staff', async ({ sessionPage }) => {
    const dashboard = new DashboardPage(sessionPage);
    await dashboard.verifyPrivateMessageToSpecificStaff();
  });

  test('Verify private message to specific office', async ({ sessionPage }) => {
    const dashboard = new DashboardPage(sessionPage);
    await dashboard.verifyPrivateMessageToSpecificOffice();
  });

  test('Verify private message to specific team', async ({ sessionPage }) => {
    const dashboard = new DashboardPage(sessionPage);
    await dashboard.verifyPrivateMessageToSpecificTeam();
  });

  test('Verify message deletion from Noticeboard', async ({ sessionPage }) => {
    const dashboard = new DashboardPage(sessionPage);
    await dashboard.verifyMessageDeletionFromNoticeboard();
  });
  
  test('Verify that the user name is shown when a message is added to the Noticeboard', async ({ sessionPage }) => {
    const dashboard = new DashboardPage(sessionPage);
    await dashboard.verifyUserNameOnNoticeboardMessage();
  });

  test('Verify comment on a message', async ({ sessionPage }) => {
    const dashboard = new DashboardPage(sessionPage);
    await dashboard.verifyCommentOnNoticeboardMessage();
  });

  test('Verify react on a message', async ({ sessionPage }) => {
    const dashboard = new DashboardPage(sessionPage);
    await dashboard.verifyReactOnNoticeboardMessage();
  });

  test('Add a blank message on Noticeboard', async ({ sessionPage }) => {
    const dashboard = new DashboardPage(sessionPage);
    await dashboard.addBlankMessageOnNoticeboard();
  });

  test('Verify scrolling loads all Noticeboard comments', async ({ sessionPage }) => {
    const dashboard = new DashboardPage(sessionPage);
    await dashboard.verifyNoticeboardCommentScrollAndCleanup();
  });

});