import { Hono } from "hono";
import { createFriendRequestRoute } from "./create-friend-request";
import { deleteFriendRequestRoute } from "./delete-friend-request";
import { acceptFriendRequestRoute } from "./accept-friend-request";
import { removeFriendRoute } from "./delete-friend";
import { createFriendNoteRoute } from "./create-friend-note";
import { deleteFriendNoteRoute } from "./delete-friend-note";
import { getFriendStatusRoute } from "./get-friend-status";
import { getFriendRequestsRoute } from "./get-friend-requests";
import { createFriendPinRoute } from "./create-friend-pin";
import { getRecommendedFriendsRoute } from "./get-recommended-friends";
import { validateRequest } from "#middlewares/validate-request.ts";
import { userStatus } from "#middlewares/user-status.ts";

export const friend = new Hono()
  .basePath("/friend")
  .use(validateRequest("prevent"))
  .use(userStatus())
  .route("/", createFriendRequestRoute)
  .route("/", deleteFriendRequestRoute)
  .route("/", acceptFriendRequestRoute)
  .route("/", removeFriendRoute)
  .route("/", createFriendNoteRoute)
  .route("/", deleteFriendNoteRoute)
  .route("/", getFriendStatusRoute)
  .route("/", getFriendRequestsRoute)
  .route("/", getFriendRequestsRoute)
  .route("/", createFriendPinRoute)
  .route("/", getRecommendedFriendsRoute)