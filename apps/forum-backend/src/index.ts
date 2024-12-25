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

const token = process.env.SECRET_TOKEN!;

export const headers = { Authorization: `Bearer ${token}` };

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
.route('/', getUserPostsRoute);

const app = new Hono()
.use('*', bearerAuth({ token }))
.use('*', logger())
.basePath('/api')
.route('/', admin)
.route('/', user)
.route("/", thread)

startNATS();

showRoutes(app, { verbose: false });

export default {
  port: process.env.FORUM_BACKEND_PORT,
  fetch: app.fetch,
};