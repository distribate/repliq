import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { bearerAuth } from 'hono/bearer-auth';
import { showRoutes } from 'hono/dev';
import { initNats } from '@repo/config-nats/nats-client';
import { cors } from 'hono/cors';
import { csrf } from "hono/csrf";
import { validateRequest } from '#utils/validate-request.ts';
import { contextStorage } from 'hono/context-storage'
import { getUserRoute } from '#routes/user/get-user.ts';
import { editUserSettingsRoute } from '#routes/user/edit-user-settings.ts';
import { editUserDetailsRoute } from '#routes/user/edit-user-details.ts';
import { getUserSettingsRoute } from '#routes/user/get-user-settings.ts';
import { getBlockedUsersRoute } from '#routes/user/get-blocked-users.ts';
import { getUserThreadsRoute } from '#routes/user/get-user-threads.ts';
import { getUserPostsRoute } from '#routes/user/get-user-posts.ts';
import { getUserFriendsRoute } from '#routes/user/get-user-friends.ts';
import { createFriendRequestRoute } from '#routes/friend/create-friend-request.ts';
import { deleteFriendRequestRoute } from '#routes/friend/delete-friend-request.ts';
import { acceptFriendRequestRoute } from '#routes/friend/accept-friend-request.ts';
import { deleteFriendRoute } from '#routes/friend/delete-friend.ts';
import { createFriendNoteRoute } from '#routes/friend/create-friend-note.ts';
import { deleteFriendNoteRoute } from '#routes/friend/delete-friend-note.ts';
import { createFriendPinRoute } from '#routes/friend/create-friend-pin.ts';
import { controlUserBlockedRoute } from '#routes/user/delete-user-from-blocked.ts';
import { getUserSocialsRoute } from '#routes/user/get-user-socials.ts';
import { getUserProfileStatsRoute } from '#routes/user/get-user-profile-stats.ts';
import { createProfileViewRoute } from '#routes/user/create-profile-view.ts';
import { createIssueRoute } from '#routes/issue/create-issue.ts';
import { getUserProfileStatusRoute } from '#routes/user/get-user-profile-status.ts';
import { getUserNotificationsRoute } from '#routes/user/get-user-notifications.ts';
import { checkNotificationRoute } from '#routes/notification/check-notification.ts';
import { getUserGameStatusRoute } from '#routes/user/get-user-game-status.ts';
import { callServerCommandRoute } from '#routes/admin/call-server-command.ts';
import { getMeRoute } from '#routes/user/get-me.ts';
import { getFriendStatusRoute } from '#routes/friend/get-friend-status.ts';
import { getFriendRequestsRoute } from '#routes/friend/get-friend-requests.ts';
import { getRecommendedFriendsRoute } from '#routes/friend/get-recommended-friends.ts';
import { getCategoriesRoute } from '#routes/categories/get-categories.ts';
import { getCategoryThreadsRoute } from '#routes/categories/get-category-threads.ts';
import { getUserSummaryRoute } from '#routes/user/get-user-summary.ts';
import { getThreadRoute } from '#routes/thread/get-thread.ts';
import { getThreadPreviewRoute } from '#routes/thread/get-thread-preview.ts';
import { getLatestCategoryThreadsRoute } from '#routes/categories/get-latest-category-threads.ts';
import { removeThreadRoute } from '#routes/thread/remove-thread.ts';
import { updateThreadSettingsRoute } from '#routes/thread/update-thread-settings.ts';
import { getThreadUserReactionsRoute } from '#routes/thread/get-thread-user-rating.ts';
import { timeout } from 'hono/timeout'
import { natsSubscribe } from '#utils/nats-subscribers.ts';
import { csrfOptions } from '#shared/options/csrf-options.ts';
import type { Env } from '#types/env-type.ts';
import { createCommentRoute } from '#routes/comments/create-comment.ts';
import { replyCommentRoute } from '#routes/comments/reply-comment.ts';
import { getThreadCommentsRoute } from '#routes/comments/get-thread-comments.ts';
import { createReactionRoute } from '#routes/reaction/create-reaction.ts';
import { getUserBanDetailsRoute } from '#routes/user/get-user-ban-details.ts';
import { createThreadRoute } from '#routes/thread/create-thread.ts';
import { encodeCborXRoute } from '#routes/test/encode-cbor-x.ts';
import { decodeCborXRoute } from '#routes/test/decode-cbor-x.ts';
import { getUserFriendsCountRoute } from '#routes/user/get-user-friends-count.ts';
import { originList } from '@repo/shared/constants/origin-list';
import { swaggerUI } from '@hono/swagger-ui'
import { openAPISpecs } from 'hono-openapi';

const port = process.env.FORUM_BACKEND_PORT
const token = process.env.SECRET_TOKEN!

await initNats()
await natsSubscribe()

export const admin = new Hono()
  .basePath('/admin')
  .route('/', callServerCommandRoute);

export const comment = new Hono()
  .basePath('/comment')
  .route("/", createCommentRoute)
  .route("/", replyCommentRoute)

export const category = new Hono()
  .basePath('/categories')
  .route("/", getCategoriesRoute)
  .route("/", getCategoryThreadsRoute)
  .route("/", getLatestCategoryThreadsRoute)

export const thread = new Hono()
  .basePath('/thread')
  .route("/", getThreadRoute)
  .route("/", getThreadPreviewRoute)
  .route("/", removeThreadRoute)
  .route("/", updateThreadSettingsRoute)
  .route("/", getThreadCommentsRoute)
  .route("/", getThreadUserReactionsRoute)
  .route("/", createThreadRoute)

export const server = new Hono()
  .basePath('/server')

export const test = new Hono()
  .basePath('/test')
  .route("/", decodeCborXRoute)
  .route("/", encodeCborXRoute)

export const reaction = new Hono()
  .basePath('/reaction')
  .route("/", createReactionRoute)

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
  .route("/", getMeRoute)
  .route("/", getFriendStatusRoute)
  .route("/", getFriendRequestsRoute)
  .route("/", getRecommendedFriendsRoute)
  .route("/", getFriendRequestsRoute)
  .route("/", getUserSummaryRoute)
  .route("/", getUserBanDetailsRoute)
  .route("/", getUserFriendsCountRoute)

const app = new Hono<Env>()
  .use(cors({
    origin: originList,
    credentials: true,
    maxAge: 86400,
    allowHeaders: ["Cookie", "cookie", "x-csrf-token", "X-CSRF-Token", "content-type", "Content-Type"]
  }))
  .use(csrf(csrfOptions))
  .use(timeout(5000))
  .use('/api/forum/user/*', validateRequest)
  .use('/api/forum/reaction/*', validateRequest)
  .use('/api/forum/thread/*', validateRequest)
  .use('/api/forum/comment/*', validateRequest)
  .use('/api/forum/categories/*', validateRequest)
  .use("/api/forum/admin/*", bearerAuth({ token }))
  .basePath('/api/forum')
  .use(logger())
  .use(contextStorage())
  .route('/', admin)
  .route('/', user)
  .route("/", thread)
  .route("/", server)
  .route("/", category)
  .route("/", comment)
  .route("/", reaction)
  // .route("/", test)
  .get('/ui', swaggerUI({ url: '/openapi' }))

app.get('/openapi',
  // @ts-ignore
  openAPISpecs(app, {
    documentation: {
      info: {
        title: 'Fasberry Forum API',
        version: '1.0.0',
        description: 'Greeting API'
      },
      servers: [
        {
          url: 'http://localhost:4101', description: 'Local Server'
        }
      ],
      security: [{ bearerAuth: [token] }],
    },
  })
)

async function createServer() {
  showRoutes(app, { verbose: false });

  Bun.serve({ port, fetch: app.fetch });
}

createServer()
  .then((_) => console.log(`Server started on port ${port}'`))
  .catch(err => {
    console.error('Error starting server:', err);
  });