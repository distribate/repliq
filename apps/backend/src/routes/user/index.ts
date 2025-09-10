import { Hono } from "hono";
import { getUserProfileRoute } from "./get-user-profile";
import { getMeRoute } from "./get-me";
import { getProfilesRoute } from "./get-profiles";
import { connectProfileRoute } from "./connect-profile";
import { getUserGlobalOptionsRoute } from "./get-user-global-options";
import { getUserSettingsRoute } from "./get-user-settings";
import { editUserSettingsRoute } from "./edit-user-settings";
import { editUserDetailsRoute } from "./edit-user-details";
import { createCoverImageRoute } from "./create-cover-image";
import { removeAvatarRoute } from "./remove-avatar";
import { createAvatarRoute } from "./create-avatar";
import { deleteCoverImageRoute } from "./delete-cover-image";
import { getUserSummaryRoute } from "./get-user-summary";
import { getUserActivityStatusRoute } from "./get-user-status";
import { getUserAvatarsRoute } from "./get-user-avatars";
import { getUserReferalsRoute } from "./get-user-referals";
import { getUserTicketsRoute } from "./get-user-tickets";
import { getSavedThreadsRoute } from "./get-saved-threads";
import { getMyThreadsRoute } from "./get-my-threads";
import { getUserSocialsRoute } from "./get-user-socials";
import { getUserProfileStatsRoute } from "./get-user-profile-stats";
import { getUserThreadsRoute } from "./get-user-threads";
import { getUserPostsRoute } from "./get-user-posts";
import { getUserFriendsRoute } from "./get-user-friends";
import { getUserPublicSocialsRoute } from "./get-user-public-socials";
import { createIssueRoute } from "#routes/issue/create-issue.ts";
import { deleteAccountRoute, restoreAccountRoute } from "./delete-account";
import { getBlockedUsersRoute, getUserIsBlockedRoute } from "./get-blocked-users";
import { controlUserBlockedRoute } from "./delete-user-from-blocked";
import { getIsAdminRoute } from "#routes/admin/get-is-admin.ts";
import { getMyFriendsMetaRoute, getMyFriendsRoute } from "./get-my-friends";
import { notifications } from "../notifications";
import { editAvatarRoute } from "./edit-avatar";
import { requireAuth } from "#middlewares/require-auth.ts";
import { userActivityStatus } from "#middlewares/user-activity-status.ts";

const avatar = new Hono()
  .basePath("/avatar")
  .route("/", createAvatarRoute)
  .route("/", removeAvatarRoute)
  .route("/", editAvatarRoute)

const coverImage = new Hono()
  .basePath("/cover-image")
  .route("/", createCoverImageRoute)
  .route("/", deleteCoverImageRoute)

export const user = new Hono()
  .basePath('/user')
  .use(requireAuth())
  .route("/", getUserProfileRoute)
  .use(requireAuth("prevent"))
  .use(userActivityStatus())
  .route("/", getMeRoute)
  .route("/", getProfilesRoute)
  .route("/", connectProfileRoute)
  .route("/", getUserGlobalOptionsRoute)
  // #current user preferences and details routes
  .route('/', getUserSettingsRoute)
  .route('/', editUserSettingsRoute)
  .route('/', editUserDetailsRoute)
  .route("/", avatar)
  .route("/", coverImage)
  .route("/", getUserSummaryRoute)
  .route("/", getUserAvatarsRoute)
  // #current user info routes
  .route("/", getUserActivityStatusRoute)
  .route("/", getUserReferalsRoute)
  .route("/", getUserTicketsRoute)
  .route("/", getSavedThreadsRoute)
  .route("/", getMyThreadsRoute)
  .route("/", getUserSocialsRoute)
  .route("/", getUserProfileStatsRoute)
  // #user friends routes
  .route("/", getMyFriendsRoute)
  .route("/", getMyFriendsMetaRoute)
  // #profile routes
  .route('/', getUserThreadsRoute)
  .route('/', getUserPostsRoute)
  .route('/', getUserFriendsRoute)
  .route("/", getUserPublicSocialsRoute)
  // #user's actions routes
  .route("/", createIssueRoute)
  .route("/", deleteAccountRoute)
  .route("/", restoreAccountRoute)
  // #user's notifications
  .route("/", notifications)
  .route("/", getUserIsBlockedRoute)
  .route('/', getBlockedUsersRoute)
  .route("/", controlUserBlockedRoute)
  .route("/", getIsAdminRoute)