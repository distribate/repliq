import { Hono } from "hono";
import { getUserProfileRoute } from "./get-user-profile";
import { userStatus } from "#middlewares/user-status.ts";
import { validateRequest } from "#middlewares/validate-request.ts";
import { getMeRoute } from "./get-me";
import { getProfilesRoute } from "./get-profiles";
import { connectProfileRoute } from "./connect-profile";
import { getUserGlobalOptionsRoute } from "./get-user-global-options";
import { getUserSettingsRoute } from "./get-user-settings";
import { editUserSettingsRoute } from "./edit-user-settings";
import { editUserDetailsRoute } from "./edit-user-details";
import { createCoverImageRoute } from "./create-cover-image";
import { removeAvatarRoute } from "./remove-avatar";
import { uploadAvatarRoute } from "./upload-avatar";
import { deleteCoverImageRoute } from "./delete-cover-image";
import { getUserSummaryRoute } from "./get-user-summary";
import { getUserStatusRoute } from "./get-user-status";
import { getUserAvatarsRoute } from "./get-user-avatars";
import { getUserReferalsRoute } from "./get-user-referals";
import { getUserTicketsRoute } from "./get-user-tickets";
import { getSavedThreadsRoute } from "./get-saved-threads";
import { getMyThreadsRoute } from "./get-my-threads";
import { getUserSocialsRoute } from "./get-user-socials";
import { getUserProfileStatsRoute } from "./get-user-profile-stats";
import { getUserThreadsRoute } from "./get-user-threads";
import { getUserPostsRoute } from "./get-user-posts";
import { getUserFriendsMetaRoute, getUserFriendsRoute } from "./get-user-friends";
import { getUserPublicSocialsRoute } from "./get-user-public-socials";
import { createProfileViewRoute } from "./create-profile-view";
import { acceptFriendRequestRoute } from "#routes/friend/accept-friend-request.ts";
import { deleteFriendRequestRoute } from "#routes/friend/delete-friend-request.ts";
import { createFriendRequestRoute } from "#routes/friend/create-friend-request.ts";
import { deleteFriendRoute } from "#routes/friend/delete-friend.ts";
import { createFriendNoteRoute } from "#routes/friend/create-friend-note.ts";
import { deleteFriendNoteRoute } from "#routes/friend/delete-friend-note.ts";
import { getFriendStatusRoute } from "#routes/friend/get-friend-status.ts";
import { getFriendRequestsRoute } from "#routes/friend/get-friend-requests.ts";
import { createFriendPinRoute } from "#routes/friend/create-friend-pin.ts";
import { getRecommendedFriendsRoute } from "#routes/friend/get-recommended-friends.ts";
import { createIssueRoute } from "#routes/issue/create-issue.ts";
import { deleteAccountRoute, restoreAccountRoute } from "./delete-account";
import { getUserNotificationsRoute } from "#routes/notifications/get-user-notifications.ts";
import { checkNotificationRoute } from "#routes/notifications/check-notification.ts";
import { getBlockedUsersRoute, getUserIsBlockedRoute } from "./get-blocked-users";
import { controlUserBlockedRoute } from "./delete-user-from-blocked";
import { getIsAdminRoute } from "#routes/admin/get-is-admin.ts";

export const user = new Hono()
  .basePath('/user')
  .use(validateRequest())
  .route("/", getUserProfileRoute)  
  .use(validateRequest("prevent"))
  .use(userStatus())
  .route("/", getMeRoute)
  .route("/", getProfilesRoute)
  .route("/", connectProfileRoute)
  .route("/", getUserGlobalOptionsRoute)
  // #current user preferences and details routes
  .route('/', getUserSettingsRoute)
  .route('/', editUserSettingsRoute)
  .route('/', editUserDetailsRoute)
  .route("/", createCoverImageRoute)
  .route("/", removeAvatarRoute)
  .route("/", uploadAvatarRoute)
  .route("/", deleteCoverImageRoute)
  // #user info routes
  .route("/", getUserSummaryRoute)
  // #current user info routes
  .route("/", getUserStatusRoute)
  .route("/", getUserAvatarsRoute)
  .route("/", getUserReferalsRoute)
  .route("/", getUserTicketsRoute)
  .route("/", getSavedThreadsRoute)
  .route("/", getMyThreadsRoute)
  .route("/", getUserSocialsRoute)
  .route("/", getUserProfileStatsRoute)
  // #profile routes
  .route('/', getUserThreadsRoute)
  .route('/', getUserPostsRoute)
  .route('/', getUserFriendsRoute)
  .route("/", getUserPublicSocialsRoute)
  .route("/", createProfileViewRoute)
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
  // #user's actions routes
  .route("/", createIssueRoute)
  .route("/", deleteAccountRoute)
  .route("/", restoreAccountRoute)
  // #user's notifications
  .route("/", getUserNotificationsRoute)
  .route("/", checkNotificationRoute)
  // #blocked users routes
  .route("/", getUserIsBlockedRoute)
  .route('/', getBlockedUsersRoute)
  .route("/", controlUserBlockedRoute)
  // #validation routes
  .route("/", getIsAdminRoute)