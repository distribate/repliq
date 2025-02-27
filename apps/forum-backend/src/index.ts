import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { showRoutes } from 'hono/dev';
import { initNats } from '@repo/config-nats/nats-client';
import { validateRequest } from '#middlewares/validate-request.ts';
import { contextStorage } from 'hono/context-storage'
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
import { getUserStatusRoute } from '#routes/user/get-user-status.ts';
import { getNewsRoute } from '#routes/public/get-news.ts';
import { getOnlineUsersRoute } from '#routes/public/get-online-users.ts';
import { getLatestRegUsersRoute } from '#routes/public/get-latest-reg-users.ts';
import { getLastCommentsRoute } from '#routes/comments/get-last-comments.ts';
import { getAuthImageRoute } from '#routes/public/get-auth-image.ts';
import { getDonatesRoute } from '#routes/public/get-donates.ts';
import { getThreadImagesRoute } from './routes/thread/get-thread-images';
import { getStaticImageRoute } from '#routes/shared/get-static-image.ts';
import { port } from "./utils/init-env.ts"
import { timeoutMiddleware } from '#middlewares/timeout.ts';
import { rateLimiterMiddleware } from '#middlewares/rate-limiter.ts';
import { csrfProtectionMiddleware } from '#middlewares/csrf-protection.ts';
import { corsProtectionMiddleware } from '#middlewares/cors-protection.ts';
import { getSearchRoute } from '#routes/search/get-search.ts';
import { getUserGlobalOptionsRoute } from '#routes/user/get-user-global-options.ts';
import { getAlertsRoute } from '#routes/public/get-alerts.ts';
import { createAuthImageRoute } from '#routes/admin/create-auth-image.ts';
import { getAuthImagesRoute } from '#routes/admin/get-auth-images.ts';
import { getMinecraftItemsRoute } from '#routes/public/get-minecraft-items.ts';
import { createMinecraftItemRoute } from '#routes/admin/create-minecraft-item.ts';
import { createCoverImageRoute } from '#routes/user/create-cover-image.ts';
import { createPostRoute } from '#routes/post/create-post.ts';
import { deletePostRoute } from '#routes/post/delete-post.ts';
import { editPostRoute } from '#routes/post/edit-post.ts';
import { pinPostRoute } from '#routes/post/pin-post.ts';
import { disableCommentsRoute } from '#routes/comments/disable-comments.ts';
import { getAvailableCategoriesRoute } from '#routes/categories/get-available-categories.ts';
import { getLatestThreadsRoute } from '#routes/thread/get-latest-threads.ts';
import { getUserReferalsRoute } from '#routes/user/get-user-referals.ts';
import { deleteCoverImageRoute } from '#routes/user/delete-cover-image.ts';
import { getImagesLibraryRoute } from '#routes/public/get-images-library.ts';
import { createReportRoute } from '#routes/report/create-report.ts';
import { getReportRoute } from '#routes/report/get-report.ts';
import { approveReportRoute } from '#routes/report/approve-report.ts';
import { getCategoryRoute } from '#routes/categories/get-category.ts';
import { getIsAdminRoute } from '#routes/admin/get-is-admin.ts';
import { getUserProfileRoute } from "#routes/user/get-user-profile.ts"
import { getPostViewersRoute } from '#routes/post/get-post-viewers.ts';
import { getUserFavoriteItemRoute } from '#routes/user/get-user-favorite-item.ts';
import { getUserPurchasesRoute } from '#routes/user/get-user-purchases.ts';
import { getUserBalanceRoute } from '#routes/user/get-user-balance.ts';
import { subscribeUserStatus } from '#subscribers/sub-user-status.ts';
import { watcher } from '#utils/kv-watcher.ts';
import { userStatus } from '#middlewares/user-status.ts';
import { getUserPublicSocialsRoute } from '#routes/user/get-user-public-socials.ts';
import { getThreadsByOwnerRoute } from '#routes/thread/get-threads-by-owner.ts';
import { getMyLandsRoute } from '#routes/user/get-my-lands.ts';
import { deleteNewsRoute, createNewsRoute } from '#routes/admin/create-news.ts';
import { adminMiddleware } from '#middlewares/admin-access.ts';
import { getTicketsRoute } from '#routes/admin/get-tickets.ts';
import { getReportsRoute } from '#routes/admin/get-reports.ts';
import { getStatusRoute } from '#routes/public/get-status.ts';

async function startNats() {
  await initNats()
  await watcher()

  subscribeUserStatus()
  console.log("\x1b[34m[NATS]\x1b[0m Users status subscribed")
}

await startNats()

export const report = new Hono()
  .basePath('/report')
  .use(validateRequest)
  .use(userStatus)
  .route("/", getReportRoute)
  .route("/", createReportRoute)
  .route("/", approveReportRoute)

export const landing = new Hono()
  .route("/", getNewsRoute)
  .route("/", getOnlineUsersRoute)
  .route("/", getLatestRegUsersRoute)
  .route("/", getDonatesRoute)
  .route("/", getAlertsRoute)
  .route("/", getMinecraftItemsRoute)
  .route("/", getImagesLibraryRoute)
  .route("/", getStatusRoute)

export const shared = new Hono()
  .basePath("/shared")
  .route('/', getFactRoute)
  .route("/", getAuthImageRoute)
  .route("/", getStaticImageRoute)

export const admin = new Hono()
  .basePath('/admin')
  .use(validateRequest)
  .use(adminMiddleware)
  .route('/', callServerCommandRoute)
  .route("/", createAuthImageRoute)
  .route("/", getAuthImagesRoute)
  .route("/", createMinecraftItemRoute)
  .route("/", deleteNewsRoute)
  .route("/", createNewsRoute)
  .route("/", getTicketsRoute)
  .route("/", getReportsRoute)

export const comment = new Hono()
  .basePath('/comment')
  .use(validateRequest)
  .use(userStatus)
  .route("/", createCommentRoute)
  .route("/", replyCommentRoute)
  .route("/", disableCommentsRoute)
  .route("/", getLastCommentsRoute)

export const category = new Hono()
  .basePath('/categories')
  .use(validateRequest)
  .use(userStatus)
  .route("/", getCategoriesRoute)
  .route("/", getCategoryThreadsRoute)
  .route("/", getLatestCategoryThreadsRoute)
  .route("/", getAvailableCategoriesRoute)
  .route("/", getCategoryRoute)

export const thread = new Hono()
  .basePath('/thread')
  .use(validateRequest)
  .use(userStatus)
  .route("/", getThreadRoute)
  .route("/", getThreadPreviewRoute)
  .route("/", removeThreadRoute)
  .route("/", updateThreadSettingsRoute)
  .route("/", getThreadCommentsRoute)
  .route("/", getThreadUserReactionsRoute)
  .route("/", createThreadRoute)
  .route("/", getLatestThreadsRoute)
  .route("/", getThreadImagesRoute)
  .route("/", getThreadsByOwnerRoute)

export const post = new Hono()
  .basePath('/post')
  .use(validateRequest)
  .use(userStatus)
  .route("/", createPostRoute)
  .route("/", deletePostRoute)
  .route("/", editPostRoute)
  .route('/', pinPostRoute)
  .route("/", getPostViewersRoute)

export const reaction = new Hono()
  .basePath('/reaction')
  .use(validateRequest)
  .use(userStatus)
  .route("/", createReactionRoute)

export const user = new Hono()
  .basePath('/user')
  .use(validateRequest)
  .use(userStatus)
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
  .route("/", getUserGlobalOptionsRoute)
  .route("/", getUserBanDetailsRoute)
  .route("/", createCoverImageRoute)
  .route("/", getUserReferalsRoute)
  .route("/", deleteCoverImageRoute)
  .route("/", getIsAdminRoute)
  .route("/", getUserProfileRoute)
  .route("/", getUserFavoriteItemRoute)
  .route("/", getUserPurchasesRoute)
  .route("/", getUserBalanceRoute)
  .route("/", getUserPublicSocialsRoute)
  .route("/", getMyLandsRoute)

export const search = new Hono()
  .basePath('/search')
  .use(validateRequest)
  .use(userStatus)
  .route("/", getSearchRoute)

const app = new Hono<Env>()
  .basePath('/api/forum')
  .use(corsProtectionMiddleware)
  .use(csrfProtectionMiddleware)
  .use(rateLimiterMiddleware)
  .use(timeoutMiddleware)
  .use(logger())
  .use(contextStorage())
  .route('/', admin)
  .route('/', user)
  .route("/", thread)
  .route("/", category)
  .route("/", comment)
  .route("/", reaction)
  .route("/", shared)
  .route("/", search)
  .route("/", post)
  .route("/", landing)
  .route("/", report)

// showRoutes(app, { verbose: false });

Bun.serve({ port, fetch: app.fetch })

console.log(port)