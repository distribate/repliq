import { Hono } from "hono";
import { createPostRoute } from "./create-post";
import { removePostRoute } from "./delete-post";
import { editPostRoute } from "./edit-post";
import { pinPostRoute } from "./pin-post";
import { getPostViewersRoute } from "./get-post-viewers";
import { createPostReactionRoute } from "./create-post-reaction";
import { userActivityStatus } from "#middlewares/user-activity-status.ts";
import { requireAuth } from "#middlewares/require-auth.ts";

export const post = new Hono()
  .basePath('/post')
  .use(requireAuth("prevent"))
  .use(userActivityStatus())
  .route("/", createPostRoute)
  .route("/", removePostRoute)
  .route("/", editPostRoute)
  .route('/', pinPostRoute)
  .route("/", getPostViewersRoute)
  .route("/", createPostReactionRoute)
