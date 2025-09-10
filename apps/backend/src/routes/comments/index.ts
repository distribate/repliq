import { Hono } from "hono";
import { createCommentRoute } from "./create-comment";
import { replyCommentRoute } from "./reply-comment";
import { disableCommentsRoute } from "./disable-comments";
import { getLatestCommentsRoute } from "./get-latest-comments";
import { removeCommentRoute } from "./remove-comment";
import { requireAuth } from "#middlewares/require-auth.ts";
import { userActivityStatus } from "#middlewares/user-activity-status.ts";

export const comment = new Hono()
  .basePath('/comment')
  .use(requireAuth("prevent"))
  .use(userActivityStatus())
  .route("/", createCommentRoute)
  .route("/", replyCommentRoute)
  .route("/", disableCommentsRoute)
  .route("/", getLatestCommentsRoute)
  .route("/", removeCommentRoute)