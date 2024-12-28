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
import { startNATS } from '#shared/nats-client.ts';
import { getThreadCommentsRoute } from '#routes/get-thread-comments.ts';
import { getUserFriendsRoute } from '#routes/get-user-friends.ts';

startNATS()

const token = process.env.SECRET_TOKEN!;

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

const app = new Hono()
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
};