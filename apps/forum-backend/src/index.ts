import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { bearerAuth } from 'hono/bearer-auth';
import { showRoutes } from 'hono/dev';
import { initNats } from '@repo/config-nats/nats-client';
import { validateRequest } from '#middlewares/validate-request.ts';
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
import type { Env } from '#types/env-type.ts';
import { createCommentRoute } from '#routes/comments/create-comment.ts';
import { replyCommentRoute } from '#routes/comments/reply-comment.ts';
import { getThreadCommentsRoute } from '#routes/comments/get-thread-comments.ts';
import { createReactionRoute } from '#routes/reaction/create-reaction.ts';
import { getUserBanDetailsRoute } from '#routes/user/get-user-ban-details.ts';
import { createThreadRoute } from '#routes/thread/create-thread.ts';
import { getUserFriendsCountRoute } from '#routes/user/get-user-friends-count.ts';
import { getFactRoute } from '#routes/shared/get-fact-route.ts';
import { createBunWebSocket } from 'hono/bun'
import type { ServerWebSocket } from 'bun'
import { confirmWebsocketConnRoute } from '#routes/ws/confirm-websocket-conn.ts';
import { userStatusRoute } from '#routes/ws/user-status.ts';
import { getUserStatusRoute } from '#routes/user/get-user-status.ts';
import { getUserCoverImageRoute } from '#routes/user/get-user-cover-image.ts';
import { getNewsRoute } from '#routes/public/get-news.ts';
import { getOnlineUsersRoute } from '#routes/public/get-online-users.ts';
import { getLatestRegUsersRoute } from '#routes/public/get-latest-reg-users.ts';
import { getLastCommentsRoute } from '#routes/comments/get-last-comments.ts';
import { getUserLandsRoute } from '#routes/user/get-user-lands.ts';
import { getAuthImageRoute } from '#routes/public/get-auth-image.ts';
import { getDonatesRoute } from '#routes/public/get-donates.ts';
import { getThreadImagesRoute } from './routes/thread/get-thread-images';
import { getStaticImageRoute } from '#routes/shared/get-static-image.ts';
import { port, token } from "./utils/init-env.ts"
import { timeoutMiddleware } from '#middlewares/timeout.ts';
import { rateLimiterMiddleware } from '#middlewares/rate-limiter.ts';
import { csrfProtectionMiddleware } from '#middlewares/csrf-protection.ts';
import { corsProtectionMiddleware } from '#middlewares/cors-protection.ts';

const { websocket } = createBunWebSocket<ServerWebSocket>()

initNats()

export const landing = new Hono()
  .route("/", getNewsRoute)
  .route("/", getOnlineUsersRoute)
  .route("/", getLatestRegUsersRoute)
  .route("/", getDonatesRoute)

export const shared = new Hono()
  .basePath("/shared")
  .route('/', getFactRoute)
  .route("/", getAuthImageRoute)
  .route("/", getStaticImageRoute)

export const admin = new Hono()
  .basePath('/admin')
  .use(bearerAuth({ token }))
  .route('/', callServerCommandRoute);

export const comment = new Hono()
  .basePath('/comment')
  .use(validateRequest)
  .route("/", createCommentRoute)
  .route("/", replyCommentRoute)
  .route("/", getLastCommentsRoute)

export const category = new Hono()
  .basePath('/categories')
  .use(validateRequest)
  .route("/", getCategoriesRoute)
  .route("/", getCategoryThreadsRoute)
  .route("/", getLatestCategoryThreadsRoute)

export const thread = new Hono()
  .basePath('/thread')
  .use(validateRequest)
  .route("/", getThreadRoute)
  .route("/", getThreadPreviewRoute)
  .route("/", removeThreadRoute)
  .route("/", updateThreadSettingsRoute)
  .route("/", getThreadCommentsRoute)
  .route("/", getThreadUserReactionsRoute)
  .route("/", createThreadRoute)
  .route("/", getThreadImagesRoute)

export const server = new Hono()
  .basePath('/server')

export const reaction = new Hono()
  .basePath('/reaction')
  .use(validateRequest)
  .route("/", createReactionRoute)

export const user = new Hono()
  .basePath('/user')
  .use(validateRequest)
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
  .route("/", getUserStatusRoute)
  .route("/", getUserLandsRoute)
  .route("/", getUserCoverImageRoute)

export const ws = new Hono()
  .basePath('/ws')
  .use(validateRequest)
  .route("/", userStatusRoute)
  .route("/", confirmWebsocketConnRoute)

const app = new Hono<Env>()
  .use(corsProtectionMiddleware)
  .use(csrfProtectionMiddleware)
  .basePath('/api/forum')
  .use(timeoutMiddleware)
  .use(rateLimiterMiddleware)
  .use(logger())
  .use(contextStorage())
  .route('/', admin)
  .route('/', user)
  .route("/", thread)
  .route("/", server)
  .route("/", category)
  .route("/", comment)
  .route("/", reaction)
  .route("/", shared)
  .route("/", ws)
  .route("/", landing)

showRoutes(app, { verbose: false });

Bun.serve({
  port, fetch: app.fetch, websocket
})

console.log(port)