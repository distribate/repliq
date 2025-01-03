import { Hono } from 'hono';
import { getUserRoute } from '#routes/get-user.ts';
import { editUserSettingsRoute } from '#routes/edit-user-settings.ts';
import { getUserSettingsRoute } from '#routes/get-user-settings.ts';
import { logger } from 'hono/logger';
import { bearerAuth } from 'hono/bearer-auth';
import { editUserDetailsRoute } from '#routes/edit-user-detailts.ts';
import { getBlockedUsersRoute } from '#routes/get-blocked-users.ts';
import { getUserThreadsRoute } from '#routes/get-user-threads.ts';
import { getUserPostsRoute } from '#routes/get-user-posts.ts';
import { callServerCommandRoute } from '#routes/call-server-command.ts';
import { showRoutes } from 'hono/dev';
import { getThreadCommentsRoute } from '#routes/get-thread-comments.ts';
import { getUserFriendsRoute } from '#routes/get-user-friends.ts';
import { deleteFriendRequestRoute } from '#routes/delete-friend-request.ts';
import { createFriendRequestRoute } from '#routes/create-friend-request.ts';
import { acceptFriendRequestRoute } from '#routes/accept-friend-request.ts';
import { deleteFriendRoute } from '#routes/delete-friend.ts';
import { deleteFriendNoteRoute } from '#routes/delete-friend-note.ts';
import { createFriendNoteRoute } from '#routes/create-friend-note.ts';
import { createFriendPinRoute } from '#routes/create-friend-pin.ts';
import { controlUserBlockedRoute } from '#routes/delete-user-from-blocked.ts';
import { getUserSocialsRoute } from '#routes/get-user-socials.ts';
import { getUserProfileStatsRoute } from '#routes/get-user-profile-stats.ts';
import { createProfileViewRoute } from '#routes/create-profile-view.ts';
import { createIssueRoute } from '#routes/create-issue.ts';
import { initNats } from '@repo/config-nats/nats-client';
import { getUserProfileStatusRoute } from '#routes/get-user-profile-status.ts';
import { cors } from 'hono/cors';
import { subNotifications } from '#subscribers/sub-notifications.ts';
import { getUserNotificationsRoute } from '#routes/get-user-notifications.ts';
import { checkNotificationRoute } from '#routes/check-notification.ts';
import { getUserGameStatusRoute } from '#routes/get-user-game-status.ts';

const token = process.env.SECRET_TOKEN!;

async function startNatsSubscribers() {
  await subNotifications()
}

async function start() {
  await initNats()
  await startNatsSubscribers()
}

start()

export const admin = new Hono()
  .basePath('/admin')
  .route('/', callServerCommandRoute);

export const thread = new Hono()
  .basePath('/thread')
  .route('/', getThreadCommentsRoute);

export const user = new Hono()
  .basePath('/user')
  .route('/', getUserRoute)
  .route('/', editUserSettingsRoute)
  .route('/', editUserDetailsRoute)
  .route('/', getUserSettingsRoute)
  .route('/', getBlockedUsersRoute)
  .route('/', getUserThreadsRoute)
  .route('/', getUserPostsRoute)
  .route('/', getUserFriendsRoute)
  .route("/", createFriendRequestRoute)
  .route("/", deleteFriendRequestRoute)
  .route("/", acceptFriendRequestRoute)
  .route("/", deleteFriendRoute)
  .route("/", createFriendNoteRoute)
  .route("/", deleteFriendNoteRoute)
  .route("/", createFriendPinRoute)
  .route("/", controlUserBlockedRoute)
  .route("/", getUserSocialsRoute)
  .route("/", getUserProfileStatsRoute)
  .route("/", createProfileViewRoute)
  .route("/", createIssueRoute)
  .route("/", getUserProfileStatusRoute)
  .route("/", getUserNotificationsRoute)
  .route("/", checkNotificationRoute)
  .route("/", getUserGameStatusRoute)

const app = new Hono()
  .use("*", cors())
  .use('*', bearerAuth({ token }))
  .use('*', logger())
  .basePath('/api')
  .route('/', admin)
  .route('/', user)
  .route("/", thread)

showRoutes(app, { verbose: false });

export type ForumUserAppType = typeof user
export type ForumThreadAppType = typeof thread
export type ForumAdminAppType = typeof admin

export default {
  port: process.env.FORUM_BACKEND_PORT,
  fetch: app.fetch,
}