import { Hono } from 'hono';
import { logger as honoLogger } from 'hono/logger';
import { showRoutes } from 'hono/dev';
import { initNats } from '@repo/config-nats/nats-client';
import { validateRequest } from '#middlewares/validate-request.ts';
import { contextStorage } from 'hono/context-storage'
import { editUserSettingsRoute } from '#routes/user/edit-user-settings.ts';
import { editUserDetailsRoute } from '#routes/user/edit-user-details.ts';
import { getUserSettingsRoute } from '#routes/user/get-user-settings.ts';
import { getBlockedUsersRoute, getUserIsBlockedRoute } from '#routes/user/get-blocked-users.ts';
import { getUserThreadsRoute } from '#routes/user/get-user-threads.ts';
import { getUserPostsRoute } from '#routes/user/get-user-posts.ts';
import { getUserFriendsMetaRoute, getUserFriendsRoute } from '#routes/user/get-user-friends.ts';
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
import { getUserNotificationsRoute } from '#routes/notifications/get-user-notifications.ts';
import { checkNotificationRoute } from '#routes/notifications/check-notification.ts';
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
import { createThreadRoute } from '#routes/thread/create-thread.ts';
import { getUserStatusRoute } from '#routes/user/get-user-status.ts';
import { getNewsRoute } from '#routes/public/get-news.ts';
import { getOnlineUsersRoute } from '#routes/public/get-online-users.ts';
import { getLatestRegUsersRoute } from '#routes/public/get-latest-reg-users.ts';
import { getLastCommentsRoute } from '#routes/comments/get-last-comments.ts';
import { getThreadImagesRoute } from './routes/thread/get-thread-images';
import { getStaticImageRoute } from '#routes/public/get-static-image.ts';
import { timeoutMiddleware } from '#middlewares/timeout.ts';
import { rateLimiterMiddleware } from '#middlewares/rate-limiter.ts';
import { csrfProtectionMiddleware } from '#middlewares/csrf-protection.ts';
import { corsProtectionMiddleware } from '#middlewares/cors-protection.ts';
import { getSearchRoute } from '#routes/search/get-search.ts';
import { getUserGlobalOptionsRoute } from '#routes/user/get-user-global-options.ts';
import { getAlertsRoute } from '#routes/public/get-alerts.ts';
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
import { getUserPurchasesRoute } from '#routes/user/get-user-purchases.ts';
import { subscribeUserStatus } from '#subscribers/sub-user-status.ts';
import { watcher } from '#utils/kv-watcher.ts';
import { userStatus } from '#middlewares/user-status.ts';
import { getUserPublicSocialsRoute } from '#routes/user/get-user-public-socials.ts';
import { getThreadsByOwnerRoute } from '#routes/thread/get-threads-by-owner.ts';
import { adminMiddleware } from '#middlewares/admin-access.ts';
import { getTicketsRoute } from '#routes/admin/get-tickets.ts';
import { getReportsRoute } from '#routes/admin/get-reports.ts';
import { getStatusRoute } from '#routes/public/get-status.ts';
import { getUserTicketsRoute } from '#routes/user/get-user-tickets.ts';
import { createUserRestrictRoute } from '#routes/warns/create-user-restrict.ts';
import { notificationsSSERoute } from '#routes/notifications/notifications-sse.ts';
import { getMediaRoute } from '#routes/public/get-media.ts';
import { getHealthRoute } from '#routes/public/get-health.ts';
import { logger, natsLogger } from "@repo/lib/utils/logger.ts"
import { timing } from 'hono/timing'
import { getProfilesRoute } from '#routes/user/get-profiles.ts';
import { connectProfileRoute } from '#routes/user/connect-profile.ts';
import { deleteAccountRoute, restoreAccountRoute } from '#routes/user/delete-account.ts';
import { uploadAvatarRoute } from '#routes/user/upload-avatar.ts';
import { connectServiceRoute, connectServiceSSE } from '#routes/user/connect-service.ts';
import { collectStats } from '#middlewares/collect-stats.ts';
import { subscribeCollectStats } from '#subscribers/sub-collect-stats.ts';
import { getPublicStatsRoute } from '#routes/public/get-public-stats.ts';
import { saveThreadRoute, unsaveThreadRoute } from '#routes/thread/save-thread.ts';
import { getSavedThreadsRoute } from '#routes/user/get-saved-threads.ts';

async function startNats() {
  await initNats()
  await watcher()
  subscribeUserStatus()
  natsLogger.success("Users status subscribed")
  subscribeCollectStats()
  natsLogger.success("Collect stats subscribed")

  // impl this to minecraft backend
  // subscribePlayerGroup()
  // natsLogger.success("Player group subscribed")
}

await startNats()

export const report = new Hono()
  .basePath('/report')
  .use(validateRequest("prevent"))
  .use(userStatus())
  .route("/", getReportRoute)
  .route("/", createReportRoute)
  .route("/", approveReportRoute)

export const shared = new Hono()
  .basePath("/shared")
  .route("/", getStaticImageRoute)
  .route("/", getNewsRoute)
  .route("/", getOnlineUsersRoute)
  .route("/", getLatestRegUsersRoute)
  .route("/", getAlertsRoute)
  .route("/", getImagesLibraryRoute)
  .route("/", getStatusRoute)
  .route("/", getMediaRoute)
  .route("/", getPublicStatsRoute)

export const admin = new Hono()
  .basePath('/private')
  .use(validateRequest("prevent"))
  .use(adminMiddleware())
  .route("/", getTicketsRoute)
  .route("/", getReportsRoute)
  .route("/", createUserRestrictRoute)

export const comment = new Hono()
  .basePath('/comment')
  .use(validateRequest("prevent"))
  .use(userStatus())
  .route("/", createCommentRoute)
  .route("/", replyCommentRoute)
  .route("/", disableCommentsRoute)
  .route("/", getLastCommentsRoute)

export const category = new Hono()
  .basePath('/categories')
  .use(validateRequest("prevent"))
  .use(userStatus())
  .route("/", getCategoriesRoute)
  .route("/", getCategoryThreadsRoute)
  .route("/", getLatestCategoryThreadsRoute)
  .route("/", getAvailableCategoriesRoute)
  .route("/", getCategoryRoute)

export const thread = new Hono()
  .basePath('/thread')
  .use(validateRequest())
  .route("/", getThreadRoute)
  .route("/", getThreadsByOwnerRoute)

  .use(validateRequest("prevent"))
  .use(userStatus())
  .route("/", getThreadPreviewRoute)
  .route("/", removeThreadRoute)
  .route("/", updateThreadSettingsRoute)
  .route("/", getThreadCommentsRoute)
  .route("/", getThreadUserReactionsRoute)
  .route("/", createThreadRoute)
  .route("/", getLatestThreadsRoute)
  .route("/", getThreadImagesRoute)
  .route("/", saveThreadRoute)
  .route("/", unsaveThreadRoute)

export const post = new Hono()
  .basePath('/post')
  .use(validateRequest("prevent"))
  .use(userStatus())
  .route("/", createPostRoute)
  .route("/", deletePostRoute)
  .route("/", editPostRoute)
  .route('/', pinPostRoute)
  .route("/", getPostViewersRoute)

export const reaction = new Hono()
  .basePath('/reaction')
  .use(validateRequest("prevent"))
  .use(userStatus())
  .route("/", createReactionRoute)

export const user = new Hono()
  .basePath('/user')

  .use(validateRequest())
  .route("/", getUserProfileRoute)
  //--------------------------------------

  .use(validateRequest("prevent"))
  .use(userStatus())
  .route("/", getMeRoute)
  .route("/", getProfilesRoute)
  .route("/", connectProfileRoute)
  .route("/", getUserGlobalOptionsRoute)
  //--------------------------------------

  // #current user preferences and details routes
  .route('/', getUserSettingsRoute)
  .route('/', editUserSettingsRoute)
  .route('/', editUserDetailsRoute)
  .route("/", createCoverImageRoute)
  .route("/", uploadAvatarRoute)
  .route("/", deleteCoverImageRoute)
  //--------------------------------------

  // #user info routes
  .route("/", getUserSummaryRoute)
  //--------------------------------------

  // #current user info routes
  .route("/", getUserStatusRoute)
  .route("/", getUserReferalsRoute)
  .route("/", getUserPurchasesRoute)
  .route("/", getUserTicketsRoute)
  .route("/", getSavedThreadsRoute)
  .route("/", getUserSocialsRoute)
  .route("/", getUserProfileStatsRoute)
  //--------------------------------------

  // #profile routes
  .route('/', getUserThreadsRoute)
  .route('/', getUserPostsRoute)
  .route('/', getUserFriendsRoute)
  .route("/", getUserPublicSocialsRoute)
  .route("/", createProfileViewRoute)
  //--------------------------------------

  // #user friends routes
  .route("/", getUserFriendsMetaRoute)
  .route("/", createFriendRequestRoute)
  .route("/", deleteFriendRequestRoute)
  .route("/", acceptFriendRequestRoute)
  .route("/", deleteFriendRoute)
  .route("/", createFriendNoteRoute)
  .route("/", deleteFriendNoteRoute)
  .route("/", getFriendStatusRoute)
  .route("/", getFriendRequestsRoute)
  .route("/", createFriendPinRoute)
  .route("/", getRecommendedFriendsRoute)
  .route("/", getFriendRequestsRoute)
  //--------------------------------------

  // #user's actions routes
  .route("/", createIssueRoute)
  .route("/", deleteAccountRoute)
  .route("/", restoreAccountRoute)
  //--------------------------------------

  // #user's notifications
  .route("/", getUserNotificationsRoute)
  .route("/", checkNotificationRoute)
  //--------------------------------------

  // #blocked users routes
  .route("/", getUserIsBlockedRoute)
  .route('/', getBlockedUsersRoute)
  .route("/", controlUserBlockedRoute)
  //--------------------------------------

  // #validation routes
  .route("/", getIsAdminRoute)
//--------------------------------------

export const sse = new Hono()
  // #http-only cookies accepted for only production mode
  .use(validateRequest("prevent"))
  .route("/", notificationsSSERoute)

export const search = new Hono()
  .basePath('/search')
  .use(validateRequest("prevent"))
  .use(userStatus())
  .route("/", getSearchRoute)

export const root = new Hono()
  .basePath("/")
  .route("/", getHealthRoute)
  //--------------------------------------

  .use(validateRequest("prevent"))
  .route("/", connectServiceRoute)
  .route("/", connectServiceSSE)
  //--------------------------------------

const app = new Hono<Env>()
  .basePath('/forum')
  .use(corsProtectionMiddleware())
  .use(csrfProtectionMiddleware())
  .use(rateLimiterMiddleware())
  .use(timeoutMiddleware())
  .use(timing())
  .use(collectStats())
  .use(honoLogger())
  .use(contextStorage())
  .route("/", shared)
  .route("/", root)
  .route('/', user)
  .route('/', admin)
  .route("/", thread)
  .route("/", category)
  .route("/", comment)
  .route("/", reaction)
  .route("/", sse)
  .route("/", search)
  .route("/", post)
  .route("/", report)

showRoutes(app, { verbose: false });

Bun.serve({ port: Bun.env.FORUM_BACKEND_PORT!, fetch: app.fetch })

logger.success(`Repliq Forum Backend started on ${Bun.env.FORUM_BACKEND_PORT!}`)